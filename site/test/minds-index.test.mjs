import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {buildMindsIndex} from '../scripts/build-list-index.mjs';

const bundle = await build({stdin: {contents: 'export {decodeWire} from "./src/lib/data.ts"; export {mindsFor,mindSearchOrder} from "./src/lib/mind-match.ts";', resolveDir: fileURLToPath(new URL('..', import.meta.url))}, bundle: true, write: false, format: 'esm', platform: 'browser'});
const {decodeWire, mindsFor, mindSearchOrder} = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));

const source = fs.readFileSync(new URL('../public/data/blocks.json', import.meta.url));
const full = JSON.parse(source), index = buildMindsIndex(full, source);
const before = decodeWire(full), after = decodeWire(index);

test('the minds index preserves every complete profile, roster, council and referenced skill name', () => {
  assert.equal(index.sourceHash, createHash('sha256').update(source).digest('hex'));
  assert.deepEqual(index.minds, full.minds);
  assert.deepEqual(index.renamed, full.renamed);
  for (const block of full.blocks.filter(b => b.type === 'mind' || b.slug === 'advisory-council')) {
    assert.deepEqual(index.blocks.find(b => b.slug === block.slug), block);
    for (const slug of block.type === 'mind' ? block.skills ?? [] : []) assert.equal(after.bySlug[slug]?.name, before.bySlug[slug]?.name);
  }
  assert(gzipSync(Buffer.from(JSON.stringify(index))).length < gzipSync(source).length / 2, 'Browsing must not transfer the unrelated full catalogue.');
});

test('the scoped catalogue gives the unchanged mind matcher identical names, scores and order', () => {
  // Fidelity checks, not new ranking targets or workflow-benchmark tuning.
  const names = full.minds.roster.map(m => m.slug);
  for (const query of ['Steve Jobs', 'design', 'growth', 'music', 'physics', 'leadership', 'history', 'films', 'pricing']) {
    const rows = c => mindsFor(c, [[query, 1]], 40).map(row => [row.mind.slug, row.score]);
    assert.deepEqual(rows(after), rows(before), query);
    assert.deepEqual(mindSearchOrder(after, query, names), mindSearchOrder(before, query, names), query);
  }
});
