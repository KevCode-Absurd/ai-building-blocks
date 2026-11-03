// Search in a small business owner's words: lib/library-search-core.ts, library-search-language.ts,
// library-search-intents.ts, library-rank.ts, catalogue-audience.mjs, roles/specialist-matching.mjs and the
// /tools search box (tools/tool-search.ts).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildLibrarySearchIndex, queryTokens, searchLibraryIndex, searchTokens } from '../src/lib/library-search-core.ts';
import { countStrongMatches, rankLibraryResults, sameWord } from '../src/lib/library-rank.ts';
import { searchIntents, searchIntentExclusions } from '../src/lib/library-search-intents.ts';
import { audienceOf } from '../src/lib/catalogue-audience.mjs';
import { makeToolSearchDocument, miniToolSlug } from '../src/lib/search-document.mjs';
import { isStrongRoleMatch, rankRoles, rankSpecialists } from '../src/roles/specialist-matching.mjs';
import { searchTools } from '../src/tools/tool-search.ts';
import { BROWSER_TOOLS } from '../src/tools/browser-tools.mjs';
import { TOOLS as MINI_TOOLS } from '../../mini-tools/index.mjs';
import { OWNER_FLOORS, OWNER_GOLD } from '../scripts/owner-search-gold.mjs';

const hash = 'a'.repeat(64);
const ids = (docs, query) => [...searchLibraryIndex(buildLibrarySearchIndex(docs, hash), query)].sort((a, b) => b[1].score - a[1].score).map(([slug]) => slug);

test('a word and its forms are one word; a longer word is another word', () => {
  for (const [a, b] of [['review', 'reviews'], ['review', 'reviewing'], ['invoice', 'invoicing'], ['test', 'testing'], ['make', 'maker'], ['check', 'checker'], ['optimise', 'optimisation']]) assert.ok(sameWord(a, b), `${a} ~ ${b}`);
  for (const [a, b] of [['review', 'reviewer'], ['lead', 'leader'], ['custom', 'customer'], ['project', 'projection'], ['post', 'poster']]) assert.ok(!sameWord(a, b), `${a} != ${b}`);
});

test('a whole word only meets its own forms in the index; a word still being typed meets every word it starts', () => {
  const docs = [{ slug: 'reply', title: 'Customer review reply' }, { slug: 'code', title: 'Code reviewer' }, { slug: 'magnet', title: 'Lead magnet planner' }, { slug: 'team', title: 'Team leader coach' }];
  assert.deepEqual(ids(docs, 'reviews'), ['reply']);
  assert.deepEqual(ids(docs, 'leads'), ['magnet']);
  assert.deepEqual(ids(docs, 'revie').sort(), ['code', 'reply']);
});

test('"no-shows" stays one term and T&Cs are terms and conditions', () => {
  assert.ok(searchTokens('reduce no-shows').includes('noshow'));
  assert.ok(searchTokens('fewer no shows at my salon').includes('noshow'));
  assert.ok(!searchTokens('reduce no-shows').includes('show'));
  assert.deepEqual(searchTokens('T&Cs for my shop').filter(t => t.startsWith('term') || t.startsWith('condition')), ['terms', 'condition'].map(w => searchTokens(w)[0]));
  assert.deepEqual(ids([{ slug: 'noshow', title: 'Appointment no-show pattern finder' }, { slug: 'show', title: 'Trade show planner' }], 'too many no-shows'), ['noshow']);
});

test("owners' words find the catalogue's words", () => {
  const docs = [
    { slug: 'meta', title: 'Meta ad cost checker' }, { slug: 'quote', title: 'Quote and proposal builder' },
    { slug: 'terms', title: 'Terms of service drafter' }, { slug: 'local', title: 'Local search listing manager', summary: 'Keep your local listing right.' },
    { slug: 'booking', title: 'Booking page designer' }, { slug: 'about', title: 'Founder story writer', summary: 'Write your about page.' },
    { slug: 'loyalty', title: 'Loyalty program designer' }, { slug: 'enquiry', title: 'Lead magnet planner' },
  ];
  for (const [query, slug] of [['facebook ad cost', 'meta'], ['send an estimate', 'quote'], ['write terms and conditions', 'terms'], ['T&Cs', 'terms'], ['get found on google maps', 'local'],
    ['fix my google business profile', 'local'], ['more appointments', 'booking'], ['write an about us page', 'about'], ['loyalty card for my coffee shop', 'loyalty'], ['more enquiries', 'enquiry']]) assert.equal(ids(docs, query)[0], slug, query);
  // The kind of business is context: "salon" alone still finds local-service work, and does not have to be said.
  assert.equal(ids([...docs, { slug: 'salon-photo', title: 'Salon photo editor', body: 'salon' }], 'more bookings for my salon')[0], 'booking');
  assert.ok(queryTokens('more bookings for my salon').soft.includes('salon'));
});

test('growth goals are understood in plain words', () => {
  const has = (query, id) => searchIntents(query).some(intent => intent.id === id);
  for (const [query, id] of [['I want more customers', 'more-customers'], ['find my first customers', 'more-customers'], ['how do I get more leads', 'more-leads'], ['sell more', 'more-sales'],
    ['more bookings for my dental practice', 'more-bookings'], ['too many no-shows', 'more-bookings'], ['get more google reviews', 'more-reviews'], ['ask customers for reviews', 'more-reviews'],
    ['get my cafe on google maps', 'local-listing'], ['write a quote for a plumbing job', 'quote-estimate'], ['T&Cs for my online shop', 'terms-policy'], ['write an about us page', 'about-page'],
    ['my facebook ads cost too much', 'ad-performance']]) assert.ok(has(query, id), `${query} -> ${id}`);
  assert.ok(!has('write a cold email to get clients', 'more-customers'));
  assert.ok(Object.values(queryTokens("customers don't come back").alternatives).flat().includes('lapsed'));
  assert.ok(!has('customer quote image ad', 'quote-estimate'));
  assert.ok(!has('customer acquisition cost limit', 'more-customers'));
  // Owners' phrasings read requests only: a document that says "ads cost too much" is not tagged by them.
  assert.ok(!searchIntents('Our ads cost too much last year', true).some(intent => intent.id === 'ad-performance'));
  // A developer's method that mentions customers is not how an owner gets customers.
  assert.ok(searchIntentExclusions('build-software').includes('more-customers'));
  assert.ok(!searchIntentExclusions('grow-social').includes('more-customers'));
});

test('strong matches say the request in the name, summary or stated purpose; passing mentions do not count', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'title', title: 'Refund policy writer' }, { slug: 'summary', title: 'Store policy pack', summary: 'Write the refund policy and returns page.' },
    { slug: 'body', title: 'Order notes', body: 'Mentions a refund policy in passing.' }, { slug: 'goal', title: 'Growth channel picker', summary: 'Find more customers for your business.' },
  ], hash);
  const hits = searchLibraryIndex(index, 'refund policy');
  assert.equal(hits.get('title').strong, true);
  assert.equal(hits.get('summary').strong, true);
  assert.ok(!hits.get('body').strong);
  assert.equal(countStrongMatches(hits), 2);
  assert.equal(countStrongMatches(hits, ['body', 'title']), 1);
  assert.equal(searchLibraryIndex(index, 'I want more customers').get('goal')?.strong, true);
});

test("owner items come first unless the request is a specialist's", () => {
  assert.equal(audienceOf({ slug: 'a', task: 'build-software' }), 'specialist');
  assert.equal(audienceOf({ slug: 'copilot-email-drafter', task: 'write-emails' }), 'specialist');
  assert.equal(audienceOf({ slug: 'b', task: 'write-emails' }), 'owner');
  assert.equal(audienceOf({ slug: 'c', task: 'research-topics', audience: 'owner' }), 'owner');
  const blocks = [{ slug: 'dev', name: 'Invoice tracker', task: 'build-software' }, { slug: 'owner', name: 'Invoice tracker', task: 'manage-accounting' }];
  const hits = new Map(blocks.map(b => [b.slug, { score: 5000, field: 'title' }]));
  assert.equal(rankLibraryResults(blocks, hits, 'invoice tracker', { isTested: () => false })[0].slug, 'owner');
  assert.equal(rankLibraryResults(blocks, hits, 'invoice tracker api in python', { isTested: () => false })[0].slug, 'dev');
  const scores = new Map();
  rankLibraryResults(blocks, hits, 'invoice tracker', { isTested: () => false, scores });
  assert.ok(scores.get('owner') > scores.get('dev'));
});

test('a name that states the goal leads like a name that repeats the words', () => {
  const docs = [{ slug: 'channel', title: 'Business growth channel planner', summary: 'Pick where to find more customers.' }, { slug: 'finder', title: 'Best customer finder', body: 'more customers' }];
  const index = buildLibrarySearchIndex(docs, hash), hits = searchLibraryIndex(index, 'I want more customers');
  const blocks = [{ slug: 'finder', name: 'Best customer finder' }, { slug: 'channel', name: 'Business growth channel planner' }];
  assert.equal(rankLibraryResults(blocks.filter(b => hits.has(b.slug)), hits, 'I want more customers', { isTested: () => false })[0].slug, 'channel');
});

const roles = { schema: 'ai-blocks-roles/1', areas: [{ id: 'all', name: 'All' }], roles: [
  { id: 'local-listing-specialist', name: 'Local listing specialist', summary: 'Keeps your local search listing and map profile right.', area: 'marketing', deliverables: ['Listing fixes'], keywords: '' },
  { id: 'quote-writer', name: 'Quote writer', summary: 'Writes clear quotes and proposals for customers.', area: 'sales', deliverables: ['A quote'], keywords: '' },
  { id: 'listing-api-engineer', name: 'Listing API engineer', summary: 'Builds local listing integrations in code.', area: 'engineering', deliverables: ['Code'], keywords: '' },
  { id: 'trade-show-planner', name: 'Trade show planner', summary: 'Plans trade show stands.', area: 'marketing', deliverables: ['A plan'], keywords: '' },
] };

test('the specialist search understands owners and puts owner roles first', () => {
  assert.equal(rankSpecialists(roles, 'get my cafe on google maps')[0].id, 'local-listing-specialist');
  assert.equal(rankSpecialists(roles, 'send an estimate to a client')[0].id, 'quote-writer');
  assert.equal(rankSpecialists(roles, 'local listing')[0].id, 'local-listing-specialist');
  assert.equal(rankSpecialists(roles, 'local listing api code')[0].id, 'listing-api-engineer');
  assert.equal(typeof rankSpecialists(roles, 'local listing')[0].score, 'number');
  const rows = rankRoles(roles, 'local listing');
  assert.ok(rows.every(row => isStrongRoleMatch(row, 'local listing')));
  assert.deepEqual(rankRoles(roles, 'zzqv unknown words'), []);
});

const pageTools = [...BROWSER_TOOLS, ...MINI_TOOLS];
test('the /tools box ranks with the library engine and keeps exact searches exact', () => {
  assert.equal(searchTools(pageTools, '').length, pageTools.length);
  for (const [query, slug] of [['contrast', 'contrast-checker'], ['UTM', 'utm-link-builder'], ['page test', 'page-test-calculator']]) assert.deepEqual(searchTools(pageTools, query).map(t => t.slug), [slug], query);
  assert.equal(searchTools(pageTools, 'what should I charge per hour')[0]?.slug, 'hourly-rate');
  assert.deepEqual(searchTools(pageTools, 'zzqvnomatchingtool'), []);
});

test('mini tools join the library search as kind "tool" under their own keys', () => {
  const doc = makeToolSearchDocument(MINI_TOOLS.find(t => t.slug === 'hourly-rate'));
  assert.equal(doc.kind, 'tool');
  assert.equal(miniToolSlug(doc.slug), 'hourly-rate');
  assert.equal(miniToolSlug('hourly-rate'), null);
  const index = buildLibrarySearchIndex([doc, { slug: 'hourly-rate', title: 'Hourly rate notes' }], hash);
  assert.ok(searchLibraryIndex(index, 'hourly rate').has(doc.slug));
});

test('the owner golden set is large enough to gate releases', () => {
  assert.ok(OWNER_GOLD.length >= 50);
  assert.equal(new Set(OWNER_GOLD.map(([q]) => q)).size, OWNER_GOLD.length);
  assert.ok(OWNER_FLOORS.top8 > 0 && OWNER_FLOORS.top8 <= OWNER_GOLD.length);
});

// With a built catalogue (npm run index), the shipped index must still answer owners at the release floors.
const root = new URL('../public/', import.meta.url);
test('owner requests rank their answers at or above the release floors', { skip: !fs.existsSync(new URL('data/library-search.json', root)) && 'needs npm run index' }, async () => {
  const { readPublishedIndex, scoreOwnerGold } = await import('../scripts/lib/owner-search-eval.mjs');
  const blocks = JSON.parse(fs.readFileSync(new URL('data/blocks.json', root), 'utf8')).blocks;
  const result = scoreOwnerGold(blocks, readPublishedIndex(fileURLToPath(root)));
  assert.deepEqual(result.missing, []);
  for (const n of ['top1', 'top3', 'top8']) assert.ok(result[n] >= OWNER_FLOORS[n], `${n}: ${result[n]} < ${OWNER_FLOORS[n]}`);
});

test('MCP and REST search report scores, strong matches and the role to hire for an agent', async () => {
  const { createHash } = await import('node:crypto');
  const { PublicCatalogueService } = await import('../src/server/public-catalogue.ts');
  const bytes = value => new TextEncoder().encode(typeof value === 'string' ? value : JSON.stringify(value));
  const digest = value => createHash('sha256').update(value).digest('hex');
  const items = [
    { slug: 'refund-policy-writer', name: 'Refund policy writer', summary: 'Write a clear refund policy for your shop.', type: 'skill', category: 'general', task: 'help-customers', inputs: [], outputs: [], uses: [], steps: [] },
    { slug: 'agency-paid-social-strategist', name: 'Paid social strategist', summary: 'Plans paid social campaigns.', type: 'agent', category: 'agent', task: 'plan-ad-tests', inputs: [], outputs: [], uses: [], steps: [] },
  ];
  const blocks = bytes({ blocks: items }), assets = new Map([['/data/blocks.json', blocks]]), resources = {};
  for (const item of items) {
    const md = bytes('# Instructions\nDo the job.\n'), path = `/skills/${item.slug}/SKILL.md`;
    assets.set(path, md);
    resources[item.slug] = { revision_sha256: 'a'.repeat(64), instruction: { path, sha256: digest(md), bytes: md.length }, files: [], reference_validation: { status: 'PASS' } };
  }
  assets.set('/data/public-api-manifest.json', bytes({ schema: 'abb-public-catalogue/1', catalogue_sha256: digest(blocks), resources }));
  const service = new PublicCatalogueService(async path => assets.has(path) ? new Response(assets.get(path)) : new Response('Missing', { status: 404 }), 'https://example.test');
  const found = await service.callTool('search_library', { query: 'refund policy' });
  assert.equal(found.items[0].id, 'refund-policy-writer');
  assert.equal(found.items[0].strong, true);
  assert.equal(typeof found.items[0].score, 'number');
  assert.equal(found.no_strong_match, false);
  assert.equal(found.strong_matches, 1);
  const agent = await service.callTool('search_library', { query: 'paid social' });
  assert.deepEqual(agent.items[0].hire_as, { role_id: 'paid-social-strategist', url: 'https://useaiblocks.com/roles/paid-social-strategist' });
  const weak = await service.callTool('search_library', { query: 'job' });
  assert.equal(weak.total, 0);
  assert.equal(weak.no_strong_match, true);
  assert.match(weak.notice, /No strong match/);
  assert.ok(!('no_strong_match' in await service.callTool('search_library', {})));
});
