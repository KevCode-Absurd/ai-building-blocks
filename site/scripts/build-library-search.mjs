// Deterministic public-only search artifact. No model calls, remote fetches or generators.
// node scripts/build-library-search.mjs [PUBLIC_ROOT] (defaults to site/public)
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { buildLibrarySearchIndex } from '../src/lib/library-search-core.ts';
import { makeSearchDocument } from '../src/lib/search-document.mjs';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const decode = text => text.replace(/&(?:amp|lt|gt|quot|apos|#39|nbsp);/g, value => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'", '&nbsp;': ' ' })[value]);
const plain = value => decode(String(value ?? '').replace(/<[^>]*>/g, ' '));
const strings = value => typeof value === 'string' ? plain(value) : Array.isArray(value) ? value.map(strings).join(' ') : value && typeof value === 'object' ? Object.values(value).map(strings).join(' ') : '';
// Index the method itself, not other methods linked from navigation/recommendations.
const instructionFields = ['when', 'not_for', 'output_sample', 'you_give', 'you_get', 'how_to_use', 'how_it_works', 'output_shape', 'tweaks', 'judge', 'test', 'improve', 'terms', 'thinkingWhy', 'stepNotes'];
export async function buildPublicLibrarySearch(publicRoot) {
  publicRoot = path.resolve(publicRoot);
  const engineFiles = ['library-search-core.ts', 'library-search-intents.ts', 'library-search-language.ts', 'catalogue-taxonomy.mjs', 'search-document.mjs'], engineHashes = {};
  for (const file of engineFiles) engineHashes[file] = sha(await fs.readFile(new URL('../src/lib/' + file, import.meta.url)));
  const source = await fs.readFile(path.join(publicRoot, 'data/blocks.json')), catalogue = JSON.parse(source), sourceHash = sha(source);
  const inputs = { 'data/blocks.json': sourceHash }, documents = [];
  const blocks = [...catalogue.blocks].sort((a, b) => a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
  let nextBlock = 0;
  await Promise.all(Array.from({ length: Math.min(20, blocks.length) }, async () => {
   while (nextBlock < blocks.length) {
    const block = blocks[nextBlock++];
    assert(/^[a-z\d]+(?:-[a-z\d]+)*$/.test(block.slug), 'Invalid public search slug');
    const read = async file => {
      try { const bytes = await fs.readFile(path.join(publicRoot, file)); inputs[file] = sha(bytes); return bytes.toString('utf8'); }
      catch (error) { if (error.code === 'ENOENT') return ''; throw error; }
    };
    const rawPage = await read(`data/pages/${block.slug}.json`), page = rawPage ? JSON.parse(rawPage) : {};
    const skill = await read(`skills/${block.slug}/SKILL.md`);
    const instructions = instructionFields.map(field => strings(page[field])).join(' ');
    documents.push(makeSearchDocument(block, page, { body: `${instructions} ${plain(page.html?.skill)} ${skill}` }));
   }
  }));
  for (const [file, hash] of Object.entries(inputs)) assert.equal(sha(await fs.readFile(path.join(publicRoot, file))), hash, 'Public search input changed: ' + file);
  const index = buildLibrarySearchIndex(documents, sourceHash);
  const sorted = Object.fromEntries(Object.keys(inputs).sort().map(file => [file, inputs[file]]));
  index.corpusHash = sha(JSON.stringify(sorted));
  for (const file of engineFiles) assert.equal(sha(await fs.readFile(new URL('../src/lib/' + file, import.meta.url))), engineHashes[file], 'Search engine changed during index generation; regenerate on stable source.');
  index.engineHash = sha(JSON.stringify(engineHashes));
  const bytes = Buffer.from(JSON.stringify(index));
  assert(bytes.length <= 24 * 1024 * 1024, 'Public search index exceeds the lazy payload guard');
  return { index, bytes, inputs: sorted };
}
export async function writePublicLibrarySearch(publicRoot = path.resolve(import.meta.dirname, '../public'), outputRoot = publicRoot) {
  const result = await buildPublicLibrarySearch(publicRoot);
  const artifacts = serializeLibrarySearch(result.index);
  const files = {};
  for (const [file, bytes] of Object.entries(artifacts)) {
    await fs.mkdir(path.dirname(path.join(outputRoot, file)), { recursive: true });
    await fs.writeFile(path.join(outputRoot, file), bytes); files[file] = sha(bytes);
  }
  const cleanup = await pruneLibrarySearchShards(outputRoot);
  console.log(JSON.stringify({ searchDocuments: result.index.docs.length, searchTerms: result.index.terms.length, fullBytes: result.bytes.length, manifestBytes: artifacts['data/library-search.json'].length, files: Object.keys(files).length, sourceHash: result.index.sourceHash, corpusHash: result.index.corpusHash, cleanup }));
  return { ...result, files, cleanup };
}

/** Only remove obsolete content-addressed shards after every current shard is verified. */
export async function pruneLibrarySearchShards(outputRoot) {
  const root = await fs.realpath(path.resolve(outputRoot));
  const folder = path.join(root, 'data/library-search');
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'data/library-search.json'), 'utf8'));
  assert(Array.isArray(manifest.shards?.files), 'Missing public search shard inventory');
  const active = new Set();
  for (const row of manifest.shards.files) {
    assert(/^[a-f0-9]{64}$/.test(row.sha256) && row.file === `/data/library-search/${row.sha256}.json`, 'Invalid public search shard path');
    active.add(`${row.sha256}.json`);
  }
  try {
    assert.equal(await fs.realpath(folder), folder, 'Search shard directory must not be a link');
  } catch (error) {
    if (error.code === 'ENOENT' && !active.size) return { removed: 0, bytes: 0 };
    throw error;
  }
  // Plan all removals before deleting anything; never follow links or remove directories.
  const stale = [];
  for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
    if (!/^[a-f0-9]{64}\.json$/.test(entry.name)) continue;
    assert(entry.isFile() && !entry.isSymbolicLink(), 'Search shard must be a regular file');
    const file = path.join(folder, entry.name);
    if (active.has(entry.name)) {
      assert.equal(sha(await fs.readFile(file)), entry.name.slice(0, -5), 'Search shard checksum mismatch');
      active.delete(entry.name);
    } else stale.push({ file, bytes: (await fs.stat(file)).size });
  }
  assert.equal(active.size, 0, 'Current search shard is missing; keep old shards until the build succeeds');
  for (const { file } of stale) await fs.unlink(file);
  return { removed: stale.length, bytes: stale.reduce((total, row) => total + row.bytes, 0) };
}
export function serializeLibrarySearch(index) {
  const artifacts = {}, files = [], size = 1024;
  for (let start = 0; start < index.terms.length; start += size) {
    const postings = index.postings.slice(start, start + size), bytes = Buffer.from(JSON.stringify(postings)), sha256 = sha(bytes), file = `data/library-search/${sha256}.json`;
    artifacts[file] = bytes; files.push({ file: '/' + file, sha256, terms: postings.length });
  }
  const manifest = { ...index, postings: index.postings.map((value, i) => index.terms[i].startsWith('~') || ['aeo', 'seo', 'agent'].includes(index.terms[i]) ? value : ''), shards: { size, files } };
  artifacts['data/library-search.json'] = Buffer.from(JSON.stringify(manifest));
  return artifacts;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = process.argv.indexOf('--out');
  await writePublicLibrarySearch(process.argv[2], out >= 0 ? path.resolve(process.argv[out + 1]) : undefined);
}
