import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { buildLibrarySearchIndex, searchLibraryIndex } from '../src/lib/library-search-core.ts';
const bundle = await build({ stdin: { resolveDir: process.cwd(), contents: 'export {buildMetadataInSlices,publicSearchDocuments} from "./src/lib/library-search.ts";' }, bundle: true, platform: 'node', format: 'esm', write: false });
const { buildMetadataInSlices, publicSearchDocuments } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const hash = 'a'.repeat(64);
test('yielded fallback is byte-identical to the unchanged search engine across posting boundaries', async () => {
  const documents = Array.from({ length: 280 }, (_, i) => ({ slug: 'method-' + String(i).padStart(4, '0'), title: i % 3 ? 'Spreadsheet analysis' : 'AI answer visibility audit', summary: 'Use a public spreadsheet to understand numbers.', metadata: 'skill code task-' + i }));
  const expected = buildLibrarySearchIndex(documents, hash), actual = await buildMetadataInSlices([...documents].reverse(), hash);
  assert.deepEqual(actual, expected);
  for (const query of ['AEO', 'Explain the changes in this spreadsheet', 'task-119']) assert.deepEqual(searchLibraryIndex(actual, query), searchLibraryIndex(expected, query));
});
test('unsupported-worker fallback yields to input and cancels an abandoned catalogue', async () => {
  const documents = Array.from({ length: 160 }, (_, i) => ({ slug: 'method-' + i, title: 'Public method ' + i }));
  let beats = 0, checks = 0;
  const heartbeat = setInterval(() => beats++, 0);
  try { await buildMetadataInSlices(documents, hash); } finally { clearInterval(heartbeat); }
  assert(beats >= 5, 'metadata preparation must not become one blocking task');
  await assert.rejects(buildMetadataInSlices(documents, hash, () => ++checks > 2), /cancelled/);
});
test('worker input selects only public catalogue metadata, never account or private extension fields', () => {
  const docs = publicSearchDocuments({ blocks: [{ slug: 'public-method', name: 'Public name', headline: 'Public headline', summary: 'Public summary', type: 'skill', category: 'general', task: 'write', job: 'ops', privateText: 'PRIVATE_CANARY', account: { token: 'PRIVATE_TOKEN' } }] });
  assert(!JSON.stringify(docs).includes('PRIVATE_'));
  assert.equal(docs[0].summary, 'Public summary');
  assert(!('body' in docs[0]));
});
