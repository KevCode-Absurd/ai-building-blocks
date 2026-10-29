import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {buildMindsIndex, buildMindsStarterIndex} from '../scripts/build-list-index.mjs';

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

test('the first Minds download retains exact visible cards, wall faces, all identities and role counts', () => {
  const starter = buildMindsStarterIndex(full, source);
  assert.equal(starter.mindsStarter, true);
  assert.equal(starter.sourceHash, index.sourceHash);
  assert.equal(starter.minds.roster.length, full.minds.roster.length);
  for (const [i, mind] of full.minds.roster.entries()) {
    const row = starter.minds.roster[i];
    for (const key of ['slug', 'name', 'area', 'identity', 'seat', 'living', 'built', 'labels']) assert.deepEqual(row[key], mind[key], `${mind.slug}.${key}`);
    assert.equal(starter.blocks.find(b => b.slug === mind.slug).type, 'mind', 'Saved selections outside the first batch stay valid.');
    if (i < 150) assert.deepEqual(row.face, mind.face, 'Every visible wall face remains exact.');
    if (i < 24) {
      assert.deepEqual(row, mind);
      assert.deepEqual(starter.blocks.find(b => b.slug === mind.slug), full.blocks.find(b => b.slug === mind.slug));
    }
  }
  assert(gzipSync(Buffer.from(JSON.stringify(starter))).length < gzipSync(Buffer.from(JSON.stringify(index))).length / 2);
});
