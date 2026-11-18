// Explicit publication only: normal builds never publish a pending benchmark.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { BENCHMARK_SLUG, BENCHMARK_ASSETS, renderBenchmarkArticle } from './lib/ecommerce-benchmark-article.mjs';
import { readReviewedBenchmarkFiles } from './lib/ecommerce-benchmark-files.mjs';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const get = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const input = get('--input'), expectedHash = get('--sha256'), out = get('--out');
const publish = args.includes('--publish');
if (!input || !/^[a-f0-9]{64}$/.test(expectedHash ?? '') || (!publish && !out) || (publish && out)) {
  throw new Error('Usage: node scripts/publish-ecommerce-benchmarks.mjs --input <reviewed-public-export.json> --sha256 <exact-input-sha256> (--out <private-preview-dir> | --publish)');
}
const bytes = fs.readFileSync(path.resolve(input));
const inputHash = createHash('sha256').update(bytes).digest('hex');
if (inputHash !== expectedHash) throw new Error('Reviewed input changed: SHA-256 does not match');
const methodology = fs.readFileSync(path.join(site, 'scripts/data/ecommerce-benchmark-methodology.html'), 'utf8');
const rendered = renderBenchmarkArticle(JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')), methodology);
const reviewedFiles = readReviewedBenchmarkFiles(rendered.data, get('--artifact-dir'));
const content = publish ? path.join(site, 'src/content/blog') : path.resolve(out);
const assets = publish ? path.join(site, 'public', BENCHMARK_ASSETS) : path.join(content, 'public-evidence');
// All validation occurs before any public file is written.
fs.mkdirSync(content, { recursive: true });
fs.mkdirSync(assets, { recursive: true });
fs.writeFileSync(path.join(content, `${BENCHMARK_SLUG}.html`), rendered.body + '\n');
fs.writeFileSync(path.join(content, `${BENCHMARK_SLUG}.json`), JSON.stringify(rendered.meta, null, 2) + '\n');
fs.writeFileSync(path.join(assets, 'results.json'), JSON.stringify(rendered.data, null, 2) + '\n');
for (const file of reviewedFiles) fs.writeFileSync(path.join(assets, file.filename), file.bytes);
if (publish) {
  const orderFile = path.join(site, 'src/lib/blog.mjs');
  const source = fs.readFileSync(orderFile, 'utf8');
  if (!source.includes(`  "${BENCHMARK_SLUG}",`)) {
    if (!source.includes('export const ORDER = [\n') && !source.includes('export const ORDER = [\r\n')) throw new Error('Cannot locate blog reading order');
    fs.writeFileSync(orderFile, source.replace(/export const ORDER = \[\r?\n/, `export const ORDER = [\n  "${BENCHMARK_SLUG}",\n`));
  }
}
console.log(JSON.stringify({ mode: publish ? 'publication-files-written' : 'private-preview-only', inputSha256: inputHash, publicDataSha256: rendered.publicDataSha256, content, assets, totals: rendered.totals }, null, 2));
