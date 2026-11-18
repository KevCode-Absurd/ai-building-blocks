// The org context rules a job is given (site/src/jobs/brand-file.mjs), and the three copies of the shared lists:
// the library module, the agents app module, and the tool the AI runs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as rules from '../src/jobs/brand-file.mjs';
import { BRAND_FILE, SELLING_KINDS, SLICES, SLICE_BY_KIND, SLICE_LINES, brandFileLine, brandFileNext, brandFileStep, readStatus, sliceFor } from '../src/jobs/brand-file.mjs';
import { BRAND_KINDS, CONTEXT_LEVELS, CONTEXT_NEED, DELIVERABLE_KINDS, contextNeed } from '../src/jobs/grounding.mjs';
import * as tool from '../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs';

const plain = (value) => JSON.parse(JSON.stringify(value));

test('the shared org context lists are identical in the library, the agents app and the tool', async () => {
  const packs = await import('../../marketplace/src/modules/packs/brand-file.ts');
  for (const name of ['FRESH_DAYS', 'FAST_KINDS', 'SLICES', 'SLICE_PARTS', 'SLICE_WORDS']) {
    assert.deepEqual(plain(packs[name]), plain(rules[name]), `agents app ${name}`);
    assert.deepEqual(plain(tool[name]), plain(rules[name]), `tool ${name}`);
  }
  assert.deepEqual(plain(packs.BRAND_FILE_PARTS), plain(rules.BRAND_FILE_PARTS));
  assert.deepEqual(plain(tool.STORE_PARTS), plain(rules.BRAND_FILE_PARTS));
  assert.deepEqual(plain(packs.SLICE_LINES), plain(SLICE_LINES));
  assert.deepEqual(plain(packs.BRAND_FILE), plain(BRAND_FILE));
  // The tool also takes the two service kinds that agent toolboxes name as foundation_kind (18 Nov 2026).
  // The library never asks for them, so they are the only extra entries allowed.
  assert.deepEqual(plain(tool.SLICE_BY_KIND), { ...plain(SLICE_BY_KIND), support: 'facts', proposal: 'facts' });
  assert.deepEqual(plain(tool.SELLING_KINDS), plain(SELLING_KINDS));
  assert.equal(tool.SCHEMA, BRAND_FILE.schema); assert.equal(`context/${tool.FOLDER}`, BRAND_FILE.folder); assert.equal(`${BRAND_FILE.folder}/${tool.INDEX_FILE}`, BRAND_FILE.index);
  for (const level of SLICES) assert.equal(packs.brandFileLine(level), SLICE_LINES[level]);
});

test('each kind of job takes the slice the method already names, and the selling kinds are the brand kinds', () => {
  assert.deepEqual(plain(SLICE_BY_KIND), plain(CONTEXT_NEED));
  assert.deepEqual([...SLICES], Object.keys(CONTEXT_LEVELS));
  assert.deepEqual([...SELLING_KINDS], [...BRAND_KINDS]);
  for (const kind of DELIVERABLE_KINDS) assert.equal(sliceFor(kind), contextNeed(kind).level, kind);
  assert.equal(sliceFor('poster'), 'none');
});

test('freshness: 7 days for prices, offers, stock and shipping; 90 for look, voice and other facts', () => {
  assert.deepEqual(plain(rules.FRESH_DAYS), { fast: 7, slow: 90, fixed: null });
  assert.deepEqual([...rules.FAST_KINDS], ['price', 'offer', 'stock', 'shipping']);
  assert.deepEqual(rules.BRAND_FILE_PARTS.map((p) => [p.file, p.fresh]), [['offers.json', 'fast'], ['facts.json', 'slow'], ['look.json', 'slow'], ['voice.md', 'slow'], ['references.md', null], ['worked.md', null]]);
  assert.equal(BRAND_FILE.index, 'context/org-context/index.md');
  assert.deepEqual([...BRAND_FILE.replaces], ['brand-brain/00-index.md', 'brand-brain/INDEX.md', '00-start-here.md', 'brand-file/index.md']);
});

test('the per-kind line is short, names the slice, and says "org context" and nothing older', () => {
  for (const kind of DELIVERABLE_KINDS) {
    const line = brandFileLine(kind);
    assert.ok(line.length <= 150, `${kind}: ${line.length} characters`);
    assert.match(line, /^Org context: /, kind);
    assert.doesNotMatch(line, /brand brain|brand file|brand dna/i, kind);
    if (sliceFor(kind) === 'none') assert.equal(line, 'Org context: not needed for this job. Skip capture.');
    else assert.ok(line.endsWith(`then take slice ${sliceFor(kind)}.`), kind);
  }
  assert.match(brandFileLine('web_page'), /refresh prices and stock first/);
});

test('a job that needs no org context is told so and skips capture', () => {
  for (const kind of ['code', 'ops_doc', 'analysis', 'other']) {
    const step = brandFileStep({ kind, status: { exists: true, stale: ['offers', 'look'] } });
    assert.equal(step.state, 'not_needed'); assert.equal(step.level, 'none');
    assert.deepEqual(step.lines, [`This ${kind} job needs no org context. Skip capture and work from the system, files or data.`]);
  }
});

test('the first job for a client builds the org context once; later jobs reuse it', () => {
  const step = brandFileStep({ kind: 'email', status: { exists: false } });
  assert.equal(step.state, 'build');
  assert.match(step.lines[0], /^First job for this client: build the org context once with node tools\/capture-brand-dna\.mjs <site url> <1 to 3 pages that matter>\. Later jobs reuse and update it\.$/);
  assert.match(step.lines[1], /Take only your slice: node tools\/org-context\.mjs slice voice --for email --out context\/facts\.md\./);
  assert.match(step.lines.at(-1), /^At hand-over, record what the client kept, killed or asked for more of: node tools\/org-context\.mjs learn --job /);
});

test('a fresh org context means: read what worked, take the slice, record what the client kept', () => {
  const step = brandFileStep({ kind: 'ad_creative', status: { exists: true, stale: [], missing: [] } });
  assert.equal(step.state, 'ready'); assert.equal(step.lines.length, 3);
  assert.match(step.lines[0], /^Before the spec, read context\/org-context\/worked\.md if it exists: keep what the client kept, leave out what they killed\.$/);
  assert.match(step.lines[1], /^The org context is fresh for this job\. Take only your slice: node tools\/org-context\.mjs slice full --for ad_creative --out context\/facts\.md\. It is all the brand context you read\. Lines under RECHECK are not facts/);
  assert.doesNotMatch(step.lines.join('\n'), /capture-brand-dna/);
});

test('a stale org context is refreshed only where it is stale, prices and stock first when the job sells', () => {
  const status = { exists: true, parts: [{ id: 'offers', state: 'stale' }, { id: 'facts', state: 'fresh' }, { id: 'look', state: 'stale' }, { id: 'voice', state: 'fresh' }], stale: [{ kind: 'price', source: 'https://www.allbirds.com/products/mens-tree-runners' }, { kind: 'stock', source: 'https://www.allbirds.com/products/mens-tree-runners' }, { kind: 'guarantee', source: 'https://www.allbirds.com/' }] };
  const page = brandFileStep({ kind: 'web_page', status });
  assert.equal(page.state, 'refresh');
  assert.equal(page.lines[1], 'Refresh only what is stale (offers, look); leave the rest of the org context as it is.');
  assert.equal(page.lines[2], 'First refresh prices, offers, stock and shipping: node tools/capture-brand-dna.mjs https://www.allbirds.com/products/mens-tree-runners. Nothing that sells is written before this.');
  assert.equal(page.lines[3], 'Refresh the look: node tools/capture-brand-dna.mjs <site url>');
  assert.match(page.lines[4], /^Take only your slice: node tools\/org-context\.mjs slice full --for web_page --out context\/facts\.md\./);
  // An email takes facts and voice: a stale look is not its problem.
  const email = brandFileStep({ kind: 'email', status });
  assert.equal(email.lines[1], 'Refresh only what is stale (offers); leave the rest of the org context as it is.');
  assert.ok(!email.lines.some((l) => /Refresh the look/.test(l)));
  // A plan does not sell: it still refreshes stale prices, without the stop.
  const plan = brandFileStep({ kind: 'plan', status: { exists: true, stale: ['offers', 'facts'] } });
  assert.match(plan.lines[2], /^Refresh prices, offers, stock and shipping: node tools\/capture-brand-dna\.mjs <the pages with prices>$/);
  assert.match(plan.lines[3], /^Read the stale facts again at their source, or confirm them with the client/);
  // A missing part is refreshed like a stale one.
  assert.equal(brandFileStep({ kind: 'copy', status: { exists: true, missing: ['voice'] } }).lines[2], 'Refresh the voice: node tools/capture-brand-dna.mjs <site url>');
});

test('before the host has looked, the lines cover every case in order, and a skill folder can be named', () => {
  const lines = brandFileNext({ kind: 'web_page' });
  assert.equal(brandFileStep({ kind: 'web_page' }).state, 'check');
  assert.equal(lines.length, 6);
  assert.match(lines[0], /^Before the spec, read context\/org-context\/worked\.md/);
  assert.equal(lines[1], 'Check the org context: node tools/org-context.mjs status --for web_page');
  assert.match(lines[2], /^If there is none, this is the first job for this client: build it once with /);
  assert.equal(lines[3], 'If parts are stale or missing: refresh only those, prices, offers and stock first, by capturing the pages they came from again. Do not capture the whole site.');
  assert.match(lines[4], /^Take only your slice: /); assert.match(lines[5], /^At hand-over, record what the client kept/);
  assert.ok(lines.join(' ').split(/\s+/).length < 150, 'short enough to sit in a job context');
  assert.match(brandFileNext({ kind: 'strategy', tools: 'scripts' })[1], /^Check the org context: node scripts\/org-context\.mjs status --for strategy$/);
  for (const kind of DELIVERABLE_KINDS) for (const line of brandFileNext({ kind })) assert.doesNotMatch(line, /brand brain|brand file|brand dna/i, kind);
  assert.deepEqual(readStatus(null, 'full'), { known: false });
  assert.deepEqual(readStatus({ exists: true, stale: ['look'], missing: [] }, 'facts'), { known: true, exists: true, stale: [], missing: [], pages: [] });
});

test('the tool\'s own status report drives the same rules', async () => {
  const { firstCapture, tempContext, writeCapture } = await import('./fixtures/brand-file-fixtures.mjs');
  const ctx = tempContext(); writeCapture(ctx, firstCapture()); tool.syncBrandFile(ctx, { now: new Date('2026-11-01T12:00:00Z') });
  assert.equal(brandFileStep({ kind: 'ad_creative', status: tool.statusOf(ctx, { now: new Date('2026-11-05T12:00:00Z'), kind: 'ad_creative' }) }).state, 'ready');
  const late = brandFileStep({ kind: 'ad_creative', status: tool.statusOf(ctx, { now: new Date('2026-11-12T12:00:00Z'), kind: 'ad_creative' }) });
  assert.equal(late.state, 'refresh');
  assert.equal(late.lines[2], 'First refresh prices, offers, stock and shipping: node tools/capture-brand-dna.mjs https://shop.example.test/ https://shop.example.test/products/runner. Nothing that sells is written before this.');
  assert.equal(brandFileStep({ kind: 'email', status: tool.statusOf(tempContext(), { kind: 'email' }) }).state, 'build');
});
