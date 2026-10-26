import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildStarterIndex } from '../scripts/build-starter-index.mjs';
const source = fs.readFileSync(new URL('../public/data/blocks.json', import.meta.url));
const catalogue = JSON.parse(source);
const discovery = fs.readFileSync(new URL('../src/lib/task-discovery.ts', import.meta.url), 'utf8');
test('starter index preserves exact reviewed task records and catalogue identifiers', () => {
  const result = buildStarterIndex(catalogue, discovery, source);
  assert.equal(result.blocks.length, 4); assert.equal(result.totalBlocks, catalogue.blocks.length);
  for (const block of result.blocks) assert.deepEqual(block, catalogue.blocks.find(full => full.slug === block.slug));
  assert.deepEqual(result.portTypes, catalogue.portTypes); assert.deepEqual(result.renamed, catalogue.renamed);
  assert.equal(result.sourceHash.length, 64); assert(Buffer.byteLength(JSON.stringify(result)) < 128000);
});
test('generated starter bytes match the current full catalogue and reviewed mapping', () => {
  const generated = JSON.parse(fs.readFileSync(new URL('../public/data/starter-blocks.json', import.meta.url), 'utf8'));
  assert.deepEqual(generated, buildStarterIndex(catalogue, discovery, source), 'Regenerate the starter index after the full catalogue changes.');
});
test('missing, duplicate or unpublished reviewed tasks block starter generation', () => {
  assert.throws(() => buildStarterIndex({ ...catalogue, blocks: [] }, discovery, source), /missing/);
  assert.throws(() => buildStarterIndex(catalogue, discovery.replace(/slug:\s*"[a-z0-9-]+"/, 'slug: "executive-email-draft"'), source), /distinct/);
  const hidden = structuredClone(catalogue); hidden.blocks.find(block => block.slug === 'rough-notes-to-minutes-writer').headline = '';
  assert.throws(() => buildStarterIndex(hidden, discovery, source), /missing/);
});
