import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildListIndex } from '../scripts/build-list-index.mjs';
const source = fs.readFileSync(new URL('../public/data/blocks.json', import.meta.url));
const catalogue = JSON.parse(source);

test('list index keeps every block with what cards, filters and the Verified/Imported filter read', () => {
  const index = buildListIndex(catalogue, source);
  assert.equal(index.index, true);
  assert.equal(index.sourceHash, createHash('sha256').update(source).digest('hex'), 'Full-text search shards are keyed by the blocks.json hash.');
  assert.deepEqual(index.renamed, catalogue.renamed);
  assert.equal(index.blocks.length, catalogue.blocks.length);
  const faces = new Map((catalogue.minds?.roster ?? []).map(mind => [mind.slug, mind.face]));
  index.blocks.forEach((block, i) => {
    const full = catalogue.blocks[i];
    assert.equal(block.slug, full.slug);
    for (const field of ['name', 'summary', 'headline', 'category', 'type', 'task', 'tasks', 'jobFunctions', 'topics', 'boards', 'job', 'level', 'origin', 'tested', 'warnings', 'hasFiles', 'execution', 'identity', 'area', 'also'])
      assert.deepEqual(block[field], full[field], `${full.slug}.${field}`);
    assert.deepEqual(block.steps, full.steps?.map(step => (Array.isArray(step) ? step[0] : step)));
    assert.equal(block.source?.by, full.source?.by);
    for (const field of ['inputs', 'outputs', 'uses', 'skills', 'aliases', ...(full.type === 'mind' ? [] : ['seats'])]) assert.equal(block[field], undefined, `${full.slug}.${field} stays in blocks.json`);
    // A mind keeps what it is known for, so a library search can name the minds who know its topic.
    if (full.type === 'mind') { assert.deepEqual(block.face, full.face ?? faces.get(full.slug)); for (const field of ['seats', 'labels', 'cues']) assert.deepEqual(block[field], full[field], `${full.slug}.${field}`); }
  });
  assert.equal(index.minds, undefined, 'The mind roster loads with the full catalogue.');
  assert(Buffer.byteLength(JSON.stringify(index)) < source.length * 0.7);
});

test('generated list index matches the current full catalogue', () => {
  const generated = JSON.parse(fs.readFileSync(new URL('../public/data/blocks-index.json', import.meta.url), 'utf8'));
  assert.deepEqual(generated, buildListIndex(catalogue, source), 'Regenerate the list index (node scripts/build-list-index.mjs) after blocks.json changes.');
});
