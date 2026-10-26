// Offline evidence against an already-generated public search artifact.
import fs from 'node:fs/promises';
import zlib from 'node:zlib';
import path from 'node:path';
import { searchLibraryIndex, searchShardIds } from '../src/lib/library-search-core.ts';
const bytes = await fs.readFile(process.argv[2]), manifest = JSON.parse(bytes), index = { ...manifest, postings: [...manifest.postings] };
const publicRoot = path.resolve(path.dirname(process.argv[2]), '..'), chunks = [];
for (const [id, chunk] of (manifest.shards?.files ?? []).entries()) {
  const chunkBytes = await fs.readFile(path.join(publicRoot, chunk.file));
  chunks[id] = { bytes: chunkBytes.length, brotliBytes: zlib.brotliCompressSync(chunkBytes, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } }).length };
  index.postings.splice(id * manifest.shards.size, chunk.terms, ...JSON.parse(chunkBytes));
}
const manifestBrotliBytes = zlib.brotliCompressSync(bytes, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } }).length;
const queries = ['AEO', 'answerengineoptimization', 'GEO', 'AI search', 'SEO', 'Agentic', 'get my brand mentioned in ChatGPT answers', 'help me fix why my app is crashing', 'turn a recording into action items', 'respond to an angry customer', 'turn this podcast into several social posts', 'find patterns in customer reviews', 'help a new team member get started'];
const results = queries.map(query => {
  const start = performance.now(), hits = [...searchLibraryIndex(index, query)].sort((a,b) => b[1].score - a[1].score);
  const needed = searchShardIds(manifest, query);
  return { query, matches: hits.length, milliseconds: Number((performance.now() - start).toFixed(2)), firstQueryRequests: 1 + needed.length, firstQueryBrotliBytes: manifestBrotliBytes + needed.reduce((sum, id) => sum + chunks[id].brotliBytes, 0), first: hits.slice(0, 6).map(([slug, hit]) => ({ slug, ...hit })) };
});
const report = { measuredOn: new Date().toISOString(), scope: 'Offline verified public corpus; desktop Node timing and Brotli quality6 estimates, not deployed transfer or a phone/user outcome study.', sourceHash: index.sourceHash, corpusHash: index.corpusHash, documents: index.docs.length, terms: index.terms.length, manifestBytes: bytes.length, gzipBytes: zlib.gzipSync(bytes).length, manifestBrotliBytes, chunks: chunks.length, allChunkBrotliBytes: chunks.reduce((sum, chunk) => sum + chunk.brotliBytes, 0), results };
if (process.argv[3]) await fs.writeFile(process.argv[3], JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
