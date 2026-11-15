// The org context tool (catalogue-items/general/brand-dna-capture/scripts/org-context.mjs) and the merging capture:
// one org context with a fixed shape, merged and never overwritten, with freshness enforced and slices cut to the job.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as bf from '../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs';
import { mergeCapture } from '../../catalogue-items/general/brand-dna-capture/scripts/capture-brand-dna.mjs';
import { OLD_FOLDER, SITE, WRITTEN, capture, firstCapture, page, secondCapture, tempContext, writeCapture, writeFiles } from './fixtures/brand-file-fixtures.mjs';

const at = (d) => new Date(`${d}T12:00:00Z`);
const read = (ctx, file) => fs.readFileSync(path.join(ctx, 'org-context', file), 'utf8');
const json = (ctx, file) => JSON.parse(read(ctx, file));
const words = (s) => s.split(/\s+/).filter(Boolean).length;
/** Run the command line and collect what it prints. */
function run(ctx, ...argv) { const out = []; const code = bf.main([...argv, '--dir', ctx], (line) => out.push(line)); return { code, text: out.join('\n') }; }
function built(dna = firstCapture(), now = '2026-11-01') { const ctx = tempContext(); writeCapture(ctx, dna); const result = bf.syncBrandFile(ctx, { now: at(now) }); return { ctx, result }; }

test('the first capture builds every part of the org context, each line with its source, date and how fast it ages', () => {
  const { ctx, result } = built();
  assert.deepEqual(result.changes, [], 'nothing is "changed" on the first build');
  for (const file of ['facts.json', 'offers.json', 'look.json', 'voice.md', 'index.md']) assert.ok(fs.existsSync(path.join(ctx, 'org-context', file)), file);
  const offers = json(ctx, 'offers.json').offers, facts = json(ctx, 'facts.json').facts;
  assert.deepEqual(offers.map((r) => r.kind).sort(), ['offer', 'price', 'price', 'shipping', 'stock']);
  assert.deepEqual(facts.map((r) => r.kind).sort(), ['guarantee', 'review', 'review']);
  for (const r of [...offers, ...facts]) {
    assert.ok(r.id && r.value && r.kind, r.id);
    assert.match(r.source, /^https:\/\/shop\.example\.test\//, r.id);
    assert.equal(r.captured_at, '2026-11-01T09:00:00.000Z', r.id);
    assert.equal(r.volatile, bf.FAST_KINDS.includes(r.kind) ? 'fast' : 'slow', r.id);
  }
  assert.equal(offers.find((r) => r.id === 'price:runner').value, 'Runner: USD 98');
  assert.equal(offers.find((r) => r.id === 'stock:runner').value, 'Runner: in stock');
  // A line that names a price and shipping is filed once, as shipping.
  assert.equal(offers.filter((r) => /Free shipping/.test(r.value)).length, 1);
  const look = json(ctx, 'look.json');
  assert.equal(look.palette[0].hex, '#FFFFFF'); assert.equal(look.type.roles.h1.family, 'Test Serif'); assert.equal(look.buttons.primary.bg, '#112233');
  assert.equal(look.raw, 'context/brand-dna.json'); assert.equal(look.captured_at, '2026-11-01T09:00:00.000Z');
  assert.match(read(ctx, 'voice.md'), /- "Shoes made from trees" \| headline \| https:\/\/shop\.example\.test\/ \| 2026-11-01/);
  assert.match(read(ctx, 'voice.md'), /## Button words\n\n- "SHOP NOW" \| button \|/);
  const index = read(ctx, 'index.md');
  for (const part of bf.STORE_PARTS) assert.ok(index.includes(`| ${part.id} | ${part.file} |`), part.id);
  assert.match(index, /Missing: nothing\./);
  assert.ok(words(index) < 320, 'the index fits one screen');
});

test('a second capture merges: old values are kept, every change is listed, and the replaced files go to history', () => {
  const { ctx } = built();
  writeCapture(ctx, mergeCapture(firstCapture(), secondCapture()));
  const { changes } = bf.syncBrandFile(ctx, { now: at('2026-11-10') });
  const text = changes.map((c) => c.text);
  assert.ok(text.includes('Price changed: Runner, USD 98 → USD 110'), text.join(' | '));
  assert.ok(text.includes('Stock changed: Runner, in stock → out of stock'));
  assert.ok(text.includes('Offer ended: Autumn sale: 20% off boots'));
  assert.ok(text.includes('New offer: Free socks with every pair this week'));
  assert.ok(text.includes('Price no longer shown: $98') && text.includes('New price: $110'));
  const offers = json(ctx, 'offers.json').offers, price = offers.find((r) => r.id === 'price:runner');
  assert.deepEqual(price.was, { value: 'Runner: USD 98', captured_at: '2026-11-01T09:00:00.000Z' });
  assert.equal(price.captured_at, '2026-11-10T09:00:00.000Z'); assert.equal(price.first_seen, '2026-11-01T09:00:00.000Z');
  // The ended offer is still on file, marked ended, and is not handed to a job.
  const ended = offers.find((r) => /Autumn sale/.test(r.value));
  assert.equal(ended.status, 'ended'); assert.ok(ended.ended_at);
  assert.doesNotMatch(bf.sliceText(ctx, 'facts', { now: at('2026-11-10') }).text, /Autumn sale/);
  // An unchanged line is re-dated, not duplicated.
  assert.equal(offers.filter((r) => /Free shipping/.test(r.value)).length, 1);
  assert.equal(offers.find((r) => /Free shipping/.test(r.value)).captured_at, '2026-11-10T09:00:00.000Z');
  const history = fs.readdirSync(path.join(ctx, 'org-context', 'history'));
  assert.ok(history.some((f) => /^\d{8}-\d{4}-offers\.json$/.test(f)), history.join(', '));
  assert.match(read(ctx, 'history/changes.md'), /## 2026-11-10 12:00 UTC\n\n- [\s\S]*Price changed: Runner, USD 98 → USD 110 \(shop\.example\.test\/products\/runner\)/);
  assert.match(read(ctx, 'index.md'), /Changed at the last capture:\n- On 2026-11-10 12:00 UTC\n {2}- /);
  // Voice lines are added to, never replaced.
  assert.equal((read(ctx, 'voice.md').match(/"Shoes made from trees"/g) || []).length, 1);
});

test('a page that was not read again keeps its lines and its own date; a failed page keeps its last good capture', () => {
  const first = firstCapture(), later = '2026-11-10T09:00:00.000Z';
  const onlyHome = capture([page({ at: later, offers: ['Free socks with every pair this week'] })], later);
  const merged = mergeCapture(first, onlyHome);
  assert.deepEqual(merged.pages.map((p) => [p.path, p.captured_at]), [['/', later], ['/products/runner', '2026-11-01T09:00:00.000Z']]);
  assert.equal(merged.source, first.source); assert.equal(merged.runs, 2); assert.equal(merged.first_captured_at, first.captured_at);
  // Every merged fact carries the date of the page it was read on.
  assert.equal(merged.brand.facts.prices.find((f) => f.text === '$98').captured_at, '2026-11-01T09:00:00.000Z');
  assert.equal(merged.brand.facts.offers[0].captured_at, later);
  const { ctx } = built(first);
  writeCapture(ctx, merged);
  const { changes } = bf.syncBrandFile(ctx, { now: at('2026-11-10') });
  assert.ok(!changes.some((c) => /Runner/.test(c.text)), 'nothing is said about a page that was not read');
  assert.equal(json(ctx, 'offers.json').offers.find((r) => r.id === 'price:runner').status, 'live');
  // The product page line is now 9 days old, so it is stale and listed for a recheck.
  const status = bf.statusOf(ctx, { now: at('2026-11-10') });
  assert.ok(status.stale.some((s) => s.id === 'price:runner' && s.age_days === 9));
  // A page read for the first time is one change, not one per line on it.
  const grown = built(capture([first.pages[0]], first.captured_at));
  writeCapture(grown.ctx, mergeCapture(capture([first.pages[0]], first.captured_at), capture([page({ pathname: '/products/runner', at: later, prices: ['$98'], structured: [{ type: 'Product', name: 'Runner', price: '98', currency: 'USD', availability: 'https://schema.org/InStock' }, { type: 'meta', property: 'og:price:amount', price: '98.00', currency: 'USD' }] })], later)));
  const added = bf.syncBrandFile(grown.ctx, { now: at('2026-11-10') }).changes;
  assert.deepEqual(added.map((c) => [c.text, c.source]), [['New page read, 3 lines added', 'https://shop.example.test/products/runner']]);
  // The page's own price tag is not listed again beside the named product's price.
  assert.deepEqual(json(grown.ctx, 'offers.json').offers.filter((r) => r.source.endsWith('/runner')).map((r) => r.id), ['price:runner', 'stock:runner', 'price:products-runner:98']);
  const failed = mergeCapture(first, capture([page({ pathname: '/products/runner', at: later, error: 'net::ERR_TIMED_OUT' })], later));
  assert.equal(failed.pages[1].captured_at, '2026-11-01T09:00:00.000Z'); assert.ok(failed.pages[1].desktop.facts);
  assert.match(failed.notes.join(' '), /this run failed, so the capture from 2026-11-01 is kept/);
});

test('competitor and reference sites go to references.md with look and headline lines only, and are kept between runs', () => {
  const ref = { url: 'https://competitor.example.test/', kind: 'competitor', captured_at: '2026-11-01T09:05:00.000Z', look: { palette: [{ hex: '#000000', area_share: 0.5 }], h1: 'Other Serif 700 56px', body: 'Other Sans 400 16px', button: '#000000, radius 0px, uppercase' }, headlines: ['Run further'] };
  const { ctx } = built(capture(firstCapture().pages, '2026-11-01T09:00:00.000Z', { references: [ref] }));
  const refs = read(ctx, 'references.md');
  assert.match(refs, /## Competitors\n\n- https:\/\/competitor\.example\.test\/ \| look: #000000 50%; headlines Other Serif 700 56px; body Other Sans 400 16px; button #000000, radius 0px, uppercase \| lines: "Run further" \| capture-brand-dna\.mjs \| 2026-11-01/);
  // A hand-written line survives the next capture, and the same site is updated in place.
  fs.appendFileSync(path.join(ctx, 'org-context', 'references.md'), '\n## Admired\n\n- A plain product page | one action per screen | client call | 2026-11-01\n');
  writeCapture(ctx, mergeCapture(capture(firstCapture().pages, '2026-11-01T09:00:00.000Z', { references: [ref] }), capture(secondCapture().pages, '2026-11-10T09:00:00.000Z', { references: [{ ...ref, captured_at: '2026-11-10T09:05:00.000Z' }] })));
  bf.syncBrandFile(ctx, { now: at('2026-11-10') });
  const after = read(ctx, 'references.md');
  assert.equal((after.match(/competitor\.example\.test/g) || []).length, 1);
  assert.match(after, /capture-brand-dna\.mjs \| 2026-11-10/); assert.match(after, /A plain product page \| one action per screen/);
  assert.doesNotMatch(read(ctx, 'offers.json'), /competitor/);
});

test('freshness: prices and offers go stale after 7 days, look and voice after 90, and a line with no date is stale', () => {
  assert.deepEqual({ ...bf.FRESH_DAYS }, { fast: 7, slow: 90, fixed: null });
  const rec = (kind, captured_at, volatile) => ({ kind, captured_at, volatile });
  assert.equal(bf.isStale(rec('price', '2026-11-03T12:00:00Z', 'fast'), at('2026-11-10')), false);
  assert.equal(bf.isStale(rec('price', '2026-11-02T11:00:00Z', 'fast'), at('2026-11-10')), true);
  assert.equal(bf.isStale(rec('guarantee', '2026-08-12T12:00:00Z', 'slow'), at('2026-11-10')), false);
  assert.equal(bf.isStale(rec('guarantee', '2026-08-11T11:00:00Z', 'slow'), at('2026-11-10')), true);
  assert.equal(bf.isStale(rec('fact', null, 'slow'), at('2026-11-10')), true);
  assert.equal(bf.isStale(rec('fact', '2019-01-01', 'fixed'), at('2026-11-10')), false);
  assert.equal(bf.isStale(rec('fact', 'not a date', 'fixed'), at('2026-11-10')), true);
  const { ctx } = built();
  const state = (day, kind) => Object.fromEntries(bf.statusOf(ctx, { now: at(day), kind }).parts.map((p) => [p.id, p.state]));
  assert.deepEqual(state('2026-11-08'), { offers: 'fresh', facts: 'fresh', look: 'fresh', voice: 'fresh', references: 'none yet', worked: 'none yet' });
  assert.deepEqual(state('2026-11-09'), { offers: 'stale', facts: 'fresh', look: 'fresh', voice: 'fresh', references: 'none yet', worked: 'none yet' });
  assert.deepEqual(state('2027-01-31'), { offers: 'stale', facts: 'stale', look: 'stale', voice: 'stale', references: 'none yet', worked: 'none yet' });
});

test('status says what exists, how old each part is, what is stale and what is missing, and exits 0 or 1', () => {
  const { ctx } = built();
  const fresh = run(ctx, 'status', '--today', '2026-11-05');
  assert.equal(fresh.code, 0);
  assert.match(fresh.text, /Org context: shop\.example\.test .* as of 2026-11-05/);
  assert.match(fresh.text, /offers\s+offers\.json\s+fresh\s+2026-11-01\s+4d\s+5 lines, fresh for 7 days/);
  assert.match(fresh.text, /Result: READY$/);
  const stale = run(ctx, 'status', '--today', '2026-11-12', '--for', 'ad_creative');
  assert.equal(stale.code, 1);
  assert.match(stale.text, /for an ad_creative job: needs full/);
  assert.match(stale.text, /Stale, recheck before use \(5\):\n- offer: Autumn sale: 20% off boots \(shop\.example\.test, 2026-11-01, 11 days old\)/);
  assert.match(stale.text, /\n- price: Runner: USD 98 \(shop\.example\.test\/products\/runner, 2026-11-01, 11 days old\)/);
  assert.match(stale.text, /- First, refresh prices, offers, stock and shipping \(5 stale\): node .*capture-brand-dna\.mjs https:\/\/shop\.example\.test\/ https:\/\/shop\.example\.test\/products\/runner\n/);
  assert.match(stale.text, /Result: NOT READY$/);
  // A job that needs no org context is ready whatever the file's state, and is told to skip capture.
  const code = run(ctx, 'status', '--today', '2027-06-01', '--for', 'code');
  assert.equal(code.code, 0); assert.match(code.text, /No org context is needed for a code job\. Skip capture/);
  // A plan needs facts only: a stale look does not block it, stale prices do.
  fs.rmSync(path.join(ctx, 'org-context', 'voice.md'));
  const plan = bf.statusOf(ctx, { now: at('2026-11-05'), kind: 'plan' });
  assert.equal(plan.level, 'facts'); assert.equal(plan.ok, true); assert.deepEqual(plan.missing, []);
  const page = bf.statusOf(ctx, { now: at('2026-11-05'), kind: 'web_page' });
  assert.equal(page.ok, false); assert.deepEqual(page.missing, ['voice']);
  // No org context at all: first job builds it once; with older files present, migrate is the next step.
  const empty = tempContext();
  const none = run(empty, 'status', '--for', 'email');
  assert.equal(none.code, 1); assert.match(none.text, /No org context yet[\s\S]*First job for this business: build the org context once/);
  writeFiles(empty, { 'facts.md': WRITTEN['facts.md'] });
  assert.match(run(empty, 'status').text, /Build the org context from what is already here \(context\/facts\.md\): node .*org-context\.mjs migrate/);
  const asJson = JSON.parse(run(ctx, 'status', '--json', '--today', '2026-11-05').text);
  assert.equal(asJson.schema, 'ai-blocks-org-context/1'); assert.equal(asJson.parts.length, 6);
  assert.equal(run(ctx, 'status', '--for', 'poster').code, 2);
});

test('slice prints only what the level needs, newest first, with stale lines set apart for a recheck', () => {
  const { ctx } = built(mergeCapture(firstCapture(), capture([secondCapture().pages[0]], '2026-11-10T09:00:00.000Z')), '2026-11-10');
  const none = run(ctx, 'slice', 'none', '--for', 'code');
  assert.equal(none.code, 0); assert.match(none.text, /This job needs no org context\. Skip capture\./); assert.doesNotMatch(none.text, /Runner/);
  const facts = run(ctx, 'slice', 'facts', '--today', '2026-11-10').text;
  assert.match(facts, /^ORG CONTEXT SLICE: facts \| shop\.example\.test \| read 2026-11-10/);
  // Fresh lines are facts; the product page was read 9 days ago, so its price and stock are listed for a recheck.
  const [live, recheck] = facts.split('RECHECK BEFORE USE');
  assert.match(live, /LIVE OFFERS[^\n]*\n- offer: Free socks with every pair this week \(shop\.example\.test, 2026-11-10\)/);
  assert.doesNotMatch(live, /Runner: USD 98/);
  assert.match(recheck, /- STALE price: Runner: USD 98 \(shop\.example\.test\/products\/runner, 2026-11-01, 9 days old\)/);
  assert.match(recheck, /- STALE stock: Runner: in stock/);
  assert.doesNotMatch(facts, /VOICE|LOOK \(/);
  const voice = run(ctx, 'slice', 'voice', '--today', '2026-11-10').text;
  assert.match(voice, /VOICE: real lines to match by ear[^\n]*\n- "Shoes made from trees" \(headline, shop\.example\.test, 2026-11-10\)/);
  assert.match(voice, /- Button words: SHOP NOW \/ ADD TO CART/); assert.doesNotMatch(voice, /LOOK \(/);
  const look = run(ctx, 'slice', 'look', '--today', '2026-11-10').text;
  assert.match(look, /LOOK \(measured 2026-11-10 from shop\.example\.test;/);
  assert.match(look, /- Colour by page area: #FFFFFF 62% background; #112233 9% text\/primary-button; #F6B74D 0\.4% link\/accent\. Accent #F6B74D stays near 0\.4%\./);
  assert.match(look, /- Primary button: #112233 fill, #FFFFFF text, radius 4px, uppercase/); assert.doesNotMatch(look, /VOICE:/);
  const full = run(ctx, 'slice', 'full', '--for', 'ad_creative', '--today', '2026-11-10').text;
  for (const block of ['LIVE OFFERS', 'FACTS', 'VOICE:', 'LOOK (', 'RECHECK BEFORE USE']) assert.ok(full.includes(block), block);
  // Something that sells is told to stop and refresh stale prices and stock first.
  assert.match(full, /STOP: 3 price, offer, stock or shipping lines are stale\. First, refresh prices, offers, stock and shipping/);
  // With --for and no level, the kind's own slice is used.
  assert.match(run(ctx, 'slice', '--for', 'email', '--today', '2026-11-10').text, /^ORG CONTEXT SLICE: voice for an email job/);
  assert.equal(run(ctx, 'slice', 'everything').code, 2);
  const missing = run(tempContext(), 'slice', 'facts');
  assert.equal(missing.code, 1); assert.match(missing.text, /There is no org context at .* yet/);
});

test('a slice stays inside its word budget however large the org context is, and says how much it left out', () => {
  const day = '2026-11-10T09:00:00.000Z', many = (n, make) => Array.from({ length: n }, (_, i) => make(i));
  const big = capture([
    page({ at: day, prices: many(16, (i) => `Trail shoe number ${i} in recycled wool now costs $${90 + i}`), offers: many(16, (i) => `Bundle offer ${i}: buy 2 pairs and get free socks worth $${10 + i}`), shipping: many(16, (i) => `Delivery option ${i} takes ${i + 2} working days by courier`), guarantees: many(16, (i) => `Guarantee ${i}: return within ${30 + i} days for a full refund`), reviews: many(16, (i) => `Rated 4.${i % 10} by ${1000 + i} reviews for comfort`), headlines: many(12, (i) => `Headline number ${i} about shoes made from natural materials`), body: many(12, (i) => `Body line ${i} explains the material and how it is made in plain words`) }),
    ...many(4, (n) => page({ pathname: `/collections/c${n}`, at: day, prices: many(16, (i) => `Collection ${n} shoe ${i} costs $${70 + i} with free returns`), structured: many(16, (i) => ({ type: 'Product', name: `Shoe ${n}-${i}`, price: String(80 + i), currency: 'USD', availability: 'https://schema.org/InStock', rating: '4.6', review_count: 300 + i })) })),
  ], day);
  const { ctx } = built(big, '2026-11-10');
  assert.ok(json(ctx, 'offers.json').offers.length > 150);
  for (const level of ['facts', 'voice', 'look', 'full']) {
    const r = bf.sliceText(ctx, level, { now: at('2026-11-10'), kind: 'web_page' });
    assert.ok(words(r.text) <= bf.SLICE_WORDS[level], `${level}: ${words(r.text)} words`);
    assert.match(r.text, /- \(\d+ more in offers\.json\)/, level);
  }
  assert.deepEqual({ ...bf.SLICE_WORDS }, { none: 40, facts: 600, voice: 600, look: 600, full: 1500 });
  // Newest first: a line read later is listed before an older one.
  writeCapture(ctx, mergeCapture(big, capture([page({ pathname: '/collections/c0', at: '2026-11-12T09:00:00.000Z', offers: ['A newer offer read on the twelfth'] })], '2026-11-12T09:00:00.000Z')));
  bf.syncBrandFile(ctx, { now: at('2026-11-12') });
  const lines = bf.sliceText(ctx, 'facts', { now: at('2026-11-12') }).text.split('\n'), offers = lines.slice(lines.findIndex((l) => l.startsWith('LIVE OFFERS')) + 1);
  assert.match(offers[0], /A newer offer read on the twelfth .*2026-11-12\)$/);
});

test('learn records what the client kept, killed or asked for more of, newest first, and the next job reads it first', () => {
  const { ctx } = built();
  assert.equal(run(ctx, 'learn', '--job', 'welcome emails', '--kept', 'the plain subject lines', '--killed', 'the discount opener', '--more', 'founder stories', '--today', '2026-11-03').code, 0);
  assert.equal(run(ctx, 'learn', '--job', 'six Meta ads', '--killed', 'lifestyle shots with no product', '--today', '2026-11-08').code, 0);
  assert.equal(read(ctx, 'worked.md'), '# What worked\n\nWhat this client kept, killed or asked for more of, newest first. Read it before you write the next spec.\n\n## 2026-11-08 | six Meta ads\n\n- Killed: lifestyle shots with no product\n\n## 2026-11-03 | welcome emails\n\n- Kept: the plain subject lines\n- Killed: the discount opener\n- More of: founder stories\n');
  const slice = bf.sliceText(ctx, 'facts', { now: at('2026-11-08') }).text.split('\n');
  assert.equal(slice[3], 'WHAT WORKED BEFORE (read first; worked.md, newest first)');
  assert.equal(slice[4], '- 2026-11-08 | six Meta ads: Killed: lifestyle shots with no product');
  assert.match(read(ctx, 'index.md'), /Latest from worked\.md:\n- 2026-11-08 \| six Meta ads: Killed: lifestyle shots with no product/);
  assert.equal(bf.statusOf(ctx, { now: at('2026-11-08') }).parts.find((p) => p.id === 'worked').state, 'kept');
  assert.equal(run(ctx, 'learn', '--kept', 'x').code, 2, 'a job name is required');
  assert.equal(run(ctx, 'learn', '--job', 'x').code, 2, 'at least one of kept, killed or more is required');
  // learn works before any capture, for a client whose jobs need no org context.
  const bare = tempContext();
  assert.equal(run(bare, 'learn', '--job', 'ops runbook', '--kept', 'the one-page format').code, 0);
  assert.ok(fs.existsSync(path.join(bare, 'org-context', 'worked.md')));
});

test('migrate builds the org context from the older context files, keeps their sources and dates, and can be run twice', () => {
  const ctx = tempContext();
  writeCapture(ctx, firstCapture()); writeFiles(ctx, WRITTEN);
  const first = run(ctx, 'migrate', '--today', '2026-11-10');
  assert.equal(first.code, 0);
  for (const from of ['context/brand-dna.json -> ', 'context/facts.md -> 2 lines in offers.json, 2 in facts.json', 'context/voice.md -> voice.md (2 brand lines, 1 customer lines)', 'context/references.md -> references.md', 'context/taste-brief.md -> references.md']) assert.ok(first.text.includes(from), `${from}\n${first.text}`);
  const facts = json(ctx, 'facts.json').facts, offers = json(ctx, 'offers.json').offers;
  const founded = facts.find((r) => /Founded in 2016/.test(r.value));
  assert.equal(founded.source, 'https://shop.example.test/about'); assert.equal(founded.captured_at, '2026-11-09', 'the file\'s own date is used when a line has none');
  const ships = offers.find((r) => /Ships to 12 countries/.test(r.value));
  assert.equal(ships.kind, 'shipping'); assert.equal(ships.source, 'shipping page'); assert.equal(ships.captured_at, '2026-11-02');
  const price = offers.find((r) => /Runner costs \$98/.test(r.value));
  assert.equal(price.kind, 'price'); assert.equal(price.volatile, 'fast'); assert.equal(price.captured_at, '2026-11-09');
  // An inferred line is kept, marked, and never handed over as a fact.
  const inferred = facts.find((r) => /runners aged 25 to 40/.test(r.value));
  assert.equal(inferred.status, 'unconfirmed');
  const slice = bf.sliceText(ctx, 'facts', { now: at('2026-11-10') }).text;
  assert.match(slice, /NOT CONFIRMED: never use as fact\n- Most buyers are runners aged 25 to 40 \[inferred\]/);
  assert.doesNotMatch(slice.split('NOT CONFIRMED')[0], /runners aged 25 to 40/);
  const voice = read(ctx, 'voice.md');
  assert.match(voice, /- "Better things in a better way" \| line \| https:\/\/shop\.example\.test\/about \| 2026-11-09/);
  assert.match(voice, /## Customer words\n\n- "I forgot I was wearing them" \| customer \| context\/voice\.md \| /);
  const refs = read(ctx, 'references.md');
  assert.match(refs, /## Admired\n\n- Admire: plain product photography on white\. \| context\/taste-brief\.md/);
  assert.match(refs, /## Avoid\n\n- Avoid: cream "premium" bands and rounded cards\. \| context\/taste-brief\.md/);
  assert.match(refs, /## Notes\n\n- Brand one: clean product pages/);
  const snapshot = ['facts.json', 'offers.json', 'voice.md', 'references.md', 'look.json'].map((f) => read(ctx, f));
  const again = run(ctx, 'migrate', '--today', '2026-11-10');
  assert.equal(again.code, 0); assert.match(again.text, /already up to date/);
  assert.deepEqual(['facts.json', 'offers.json', 'voice.md', 'references.md', 'look.json'].map((f) => read(ctx, f)), snapshot, 'a second run changes nothing');
  assert.equal(run(tempContext(), 'migrate').code, 1, 'nothing to build from');
});

test('migrate reads a capture saved from the browser snippet, which has one page at the top level', () => {
  const ctx = tempContext(), snippet = { ...firstCapture().pages[1].desktop, schema: 'ai-blocks-brand-dna/1', method: 'snippet', source: `${SITE}/products/runner`, captured_at: '2026-11-01T09:00:00.000Z' };
  writeCapture(ctx, snippet);
  assert.equal(run(ctx, 'migrate', '--today', '2026-11-02').code, 0);
  assert.equal(json(ctx, 'offers.json').offers.find((r) => r.id === 'price:runner').source, `${SITE}/products/runner`);
  assert.equal(json(ctx, 'look.json').type.roles.h1.family, 'Test Serif');
});

test('migrate turns an old eight-file folder into the org context and keeps the old folder in history', () => {
  const ctx = tempContext(), old = path.join(path.dirname(ctx), 'brand-brain');
  writeFiles(old, OLD_FOLDER); fs.mkdirSync(ctx, { recursive: true });
  const r = run(ctx, 'migrate', '--from', old, '--today', '2026-11-10');
  assert.equal(r.code, 0);
  assert.match(r.text, /00-start-here\.md -> replaced by org-context\/index\.md; the old folder is copied to org-context\/history\/20261110-1200-brand-brain\//);
  const facts = json(ctx, 'facts.json').facts, offers = json(ctx, 'offers.json').offers;
  const sells = facts.find((x) => /Sells shoes made from natural materials/.test(x.value));
  assert.equal(sells.source, 'home page'); assert.equal(sells.captured_at, '2026-10-20'); assert.equal(sells.status, 'live');
  assert.equal(facts.find((x) => /Stage: established/.test(x.value)).status, 'unconfirmed');
  assert.equal(facts.find((x) => /friend's pair/.test(x.value)).status, 'unconfirmed');
  assert.equal(facts.find((x) => /I wear them every day/.test(x.value)).kind, 'customer');
  assert.equal(facts.find((x) => /Machine washable/.test(x.value)).kind, 'claim');
  // A line under a product heading carries the product's name.
  assert.equal(offers.find((x) => x.kind === 'price').value, 'Runner: One-time $98');
  assert.equal(facts.find((x) => /Free returns for 30 days/.test(x.value)).kind, 'guarantee');
  assert.deepEqual(json(ctx, 'look.json').notes.map((n) => n.replace(/ \(.*\)$/, '')), ['Colours: #112233 for text and buttons.', 'Fonts: Test Serif for headlines.']);
  assert.match(read(ctx, 'voice.md'), /## Notes\n\n- Plain and warm, never cheeky\./);
  assert.match(read(ctx, 'references.md'), /## Competitors\n\n- Brand two: cheaper, less durable\./);
  assert.match(read(ctx, 'worked.md'), /## Carried over from .*brand-brain\/log\.md\n\n- 2026-10-21: the owner dropped the discount-led headline\./);
  assert.deepEqual(fs.readdirSync(path.join(ctx, 'org-context', 'history', '20261110-1200-brand-brain')).sort(), Object.keys(OLD_FOLDER).sort());
  // Prices read on 20 October are stale on 10 November: the migrated file says so instead of passing them on.
  const status = bf.statusOf(ctx, { now: at('2026-11-10'), kind: 'email' });
  assert.equal(status.ok, false); assert.ok(status.stale.some((s) => s.value === 'Runner: One-time $98'));
  // The old folder is found without --from when it sits beside context/.
  const auto = tempContext(); writeFiles(path.join(path.dirname(auto), 'brand-brain'), OLD_FOLDER); fs.mkdirSync(auto, { recursive: true });
  assert.equal(run(auto, 'migrate').code, 0); assert.ok(fs.existsSync(path.join(auto, 'org-context', 'facts.json')));
});

test('written facts: the kind, source and date are read from the line, and fast-changing kinds win', () => {
  assert.equal(bf.factKindOf('Free shipping on orders over $75'), 'shipping');
  assert.equal(bf.factKindOf('20% off everything until Sunday, now $78'), 'offer');
  assert.equal(bf.factKindOf('Runner is sold out in size 9'), 'stock');
  assert.equal(bf.factKindOf('Plan costs €9 per month'), 'price');
  assert.equal(bf.factKindOf('30-day money-back guarantee'), 'guarantee');
  assert.equal(bf.factKindOf('Founded in 2016'), 'fact');
  assert.equal(bf.findDate('read on 9 Nov 2026'), '2026-11-09'); assert.equal(bf.findDate('Nov 9, 2026'), '2026-11-09');
  assert.equal(bf.findDate('2026-11-09T06:26:00Z'), '2026-11-09'); assert.equal(bf.findDate('no date here'), null);
  const r = bf.recordFromLine('- Plan costs €9 per month (source: pricing page) 3 Nov 2026', { file: 'context/facts.md' });
  assert.deepEqual([r.kind, r.source, r.captured_at, r.volatile, r.status], ['price', 'pricing page', '2026-11-03', 'fast', 'live']);
  assert.equal(bf.recordFromLine('- Open on Sundays', { file: 'context/facts.md' }).captured_at, null);
  assert.equal(bf.recordFromLine('|---|---|', { file: 'x' }), null);
  // Claims: approved is a fact with its proof; pending is not a fact yet; banned is never used.
  const claim = (line) => bf.recordFromLine(line, { file: 'claims.md', fallbackKind: 'claim' });
  assert.deepEqual([claim('- Machine washable [approved: care label, 2026-11-01]').status, claim('- Machine washable [approved: care label, 2026-11-01]').source], ['live', 'care label']);
  assert.equal(claim('- Loved by a million runners [pending]').status, 'unconfirmed');
  assert.equal(claim('- Cures back pain [banned]').status, 'banned');
});

test('a banned claim is kept on file, never handed over as a fact, and shown as banned', () => {
  const { ctx } = built();
  const file = path.join(ctx, 'org-context', 'facts.json'), doc = json(ctx, 'facts.json');
  doc.facts.push({ id: 'claim:cures-back-pain', kind: 'claim', value: 'Cures back pain', source: 'owner, call', captured_at: '2026-11-01', volatile: 'slow', status: 'banned' });
  fs.writeFileSync(file, JSON.stringify(doc, null, 1));
  const slice = bf.sliceText(ctx, 'facts', { now: at('2026-11-01') }).text;
  assert.match(slice, /NOT CONFIRMED: never use as fact\n- BANNED: Cures back pain/);
  assert.doesNotMatch(slice.split('NOT CONFIRMED')[0], /Cures back pain/);
  assert.equal(bf.statusOf(ctx, { now: at('2026-11-01') }).parts.find((p) => p.id === 'facts').count, 3, 'a banned line is not counted as a live fact');
});

test('a job saves its slice as context/facts.md; that file is never read back in as a source', () => {
  const { ctx } = built();
  const before = [read(ctx, 'facts.json'), read(ctx, 'offers.json')];
  const out = path.join(ctx, 'facts.md'), saved = run(ctx, 'slice', 'facts', '--out', out, '--today', '2026-11-01');
  assert.equal(saved.code, 0); assert.match(saved.text, /^Wrote the facts slice to .*facts\.md \(\d+ words\)\. Read that file, not the whole org context\.$/);
  assert.equal(fs.readFileSync(out, 'utf8'), `${bf.sliceText(ctx, 'facts', { now: at('2026-11-01') }).text}\n`);
  // status names the same command, so the job can copy it.
  assert.match(run(ctx, 'status', '--for', 'plan', '--today', '2026-11-01').text, /Take only your slice: node .*org-context\.mjs slice facts --for plan --out .*facts\.md/);
  const r = run(ctx, 'migrate', '--today', '2026-11-01');
  assert.equal(r.code, 0); assert.doesNotMatch(r.text, /context\/facts\.md ->/);
  assert.deepEqual([read(ctx, 'facts.json'), read(ctx, 'offers.json')], before);
});

test('a capture saved by hand is taken in before the org context counts as ready', () => {
  const { ctx } = built();
  assert.equal(bf.statusOf(ctx, { now: at('2026-11-02') }).ok, true);
  // The browser snippet route: a newer context/brand-dna.json that org-context.mjs has not read yet.
  writeCapture(ctx, mergeCapture(firstCapture(), secondCapture('2026-11-02T15:00:00.000Z')));
  const waiting = run(ctx, 'status', '--today', '2026-11-03');
  assert.equal(waiting.code, 1);
  assert.match(waiting.text, /context\/brand-dna\.json is newer than the org context\. Take it in first: node .*org-context\.mjs migrate/);
  assert.equal(run(ctx, 'migrate', '--today', '2026-11-03').code, 0);
  assert.equal(run(ctx, 'status', '--today', '2026-11-03').code, 0);
  assert.equal(json(ctx, 'offers.json').offers.find((x) => x.id === 'price:runner').value, 'Runner: USD 110');
});

test('references reach the jobs that need taste, and a job with none kept is told to keep them', () => {
  const { ctx } = built();
  for (const level of ['voice', 'look', 'full']) assert.match(bf.sliceText(ctx, level, { now: at('2026-11-01') }).text, /REFERENCES \(kept between jobs; add new ones to references\.md\)\n- None kept yet\. Add the sites the client admires and avoids to references\.md, or capture them with --admire, --avoid or --competitor/, level);
  assert.doesNotMatch(bf.sliceText(ctx, 'facts', { now: at('2026-11-01') }).text, /REFERENCES/);
  fs.writeFileSync(path.join(ctx, 'org-context', 'references.md'), '# References\n\n## Admired\n\n- A plain product page | one action per screen | client call | 2026-11-01\n');
  assert.match(bf.sliceText(ctx, 'look', { now: at('2026-11-01') }).text, /REFERENCES[^\n]*\n- Admired: A plain product page \| one action per screen \| client call \| 2026-11-01/);
});

test('the command line explains itself and refuses what it does not know', () => {
  const help = run(tempContext(), '--help');
  assert.equal(help.code, 0);
  for (const cmd of ['status [--for <kind>]', 'slice <none|facts|voice|look|full> [--for <kind>]', 'learn --job <name> --kept', 'migrate [--from <old folder>]']) assert.ok(help.text.includes(cmd), cmd);
  assert.equal(run(tempContext()).code, 2);
  assert.equal(run(tempContext(), 'publish').code, 2);
  // Self-contained: no package imports, and no network.
  const src = fs.readFileSync(new URL('../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs', import.meta.url), 'utf8');
  assert.deepEqual([...src.matchAll(/^import .* from '([^']+)';$/gm)].map((m) => m[1]), ['node:fs', 'node:path', 'node:url']);
  assert.doesNotMatch(src, /\bfetch\(|https?\.request|child_process/);
});
