// Production-only, read-only verification. Importing this module performs no I/O.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

export const PRODUCTION = 'https://useaiblocks.com';
export const BASELINE_VERSION = 'b3556c1f-4e77-4e8b-9604-2b2f8c7be093';
export const BASELINE_ROOT = path.resolve('site/.wrangler/releases/release-2026-10-23-mcp-production');
export const DEVICES_SOURCE_ROOT = path.resolve('site/.wrangler/releases/release-2026-10-23-devices-r2/source');
export const RELEASE_ROOT = path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/23/01a16767-65d7-7912-81d7-ae3cd042ca89/release-ui-r2-mcp-reviewed');
export const ROOT_REVIEW = path.resolve('reports/2026-10-23-simplicity-r2-review.json');
export const DEPLOYMENT_REPORT = path.resolve('reports/2026-10-23-simplicity-r2-production-deployment.json');
export const LIVE_REPORT = path.resolve('reports/2026-10-23-simplicity-r2-production-live.json');
const APPROVED_PRERENDER_SHA256 = '6fe8dc303dccc626a8ed7b4ff655cad0041a1f1e5dbd6e4906a715abce07a605';
const APPROVED_PRERENDER_FILE = path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/23/01a16767-65d7-7912-81d7-ae3cd042ca89/reviewed-ui2-inputs/prerender.mjs');
const APPROVED_PRERENDER_ORIGIN = path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/23/01a16767-65d7-7912-81d7-ae3cd042ca89/release-ui-r2/source/site/scripts/prerender.mjs');
const TASK_ROOT = path.dirname(RELEASE_ROOT);
export const SETTINGS_BASELINE_FILE = path.join(TASK_ROOT, 'reviewed-mcp-live-settings/inventory.json');
const MCP_WORKER_SHA256 = 'cce6f40deecfdb9136e32cba94034577b73ae9c2231d2940c3f55fb7fb391384';
const MCP_SOURCE_SHA256 = 'e268d8bcacd6f48cd578fd7f297f8d477482279e47b834f2dc622e5836756303';
const STARTER_INPUT_SHA256 = '824e4e8e95df0617c86b6f51aa6cedc2bd76f10241d32d57999a7c5ec05059d1';
const SEARCH_ENGINE_SHA256 = '134eba78f78ec184b2e56f49bbb738686b31c94eab9a7a66c28264f79370d347';
export const sha = value => crypto.createHash('sha256').update(value).digest('hex');
export const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
export const fingerprint = value => sha(JSON.stringify(canonical(value)));
export const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'));
export function argumentsOf(argv, allowed) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i]; assert(allowed.includes(key), 'Unsupported argument: ' + key);
    assert(!(key in out), 'Repeated argument: ' + key);
    out[key] = ['--execute', '--verified-content'].includes(key) ? true : argv[++i];
    assert(out[key] && !String(out[key]).startsWith('--'), 'Missing value for ' + key);
  }
  return out;
}
function inside(parent, child) { const relative = path.relative(parent, child); return relative && !relative.startsWith('..') && !path.isAbsolute(relative); }
const safeRelative = file => typeof file === 'string' && file && !file.startsWith('/') && !file.includes('\\') && !file.split('/').some(part => !part || part === '..' || part === '.');
const assetRoute = file => file.endsWith('/index.html') ? '/' + file.slice(0, -'index.html'.length) : file.endsWith('.html') ? '/' + file.slice(0, -'.html'.length) : '/' + file;
const pagePrefix = block => block.category === 'orchestrator' || ['workflow', 'routine'].includes(block.type) ? 'workflows' : ({ prompt: 'prompts', agent: 'agents', mind: 'minds' }[block.type] ?? 'skills');
export function normalizeConfig(config) {
  const value = structuredClone(config); delete value.main;
  if (value.assets) delete value.assets.directory;
  return value;
}
export function validateManifestContract(manifest, root) {
  assert.equal(path.resolve(root), RELEASE_ROOT, 'Only the reviewed UI refinement release root is allowed.');
  assert.equal(manifest.status, 'built-not-deployed');
  assert.equal(manifest.reviewStatus, 'awaiting-root-release-review');
  assert.equal(manifest.publicInputMode, 'verified-live-assets-reconstructed-public', 'Preview/public inputs are not approved release content.');
  assert.equal(manifest.verifiedContent, true);
  assert.equal(manifest.publicContentSource, 'verified-mcp-baseline-with-reviewed-derived-assets');
  assert.equal(manifest.deploymentAuthorized, false, 'The build manifest must not imply deployment approval.');
  assert.equal(manifest.stagingDeploymentAllowed, false);
  assert.equal(manifest.compiledWorkerUnchanged, true); assert.equal(manifest.backendSourceUnchanged, true);
  assert.equal(path.resolve(manifest.root), RELEASE_ROOT);
  assert.equal(path.resolve(manifest.previous), BASELINE_ROOT);
  assert.equal(manifest.previousVersionId, BASELINE_VERSION);
  assert.equal(manifest.staticChecks?.status, 'pass');
}
export function validateSearchAcceptance(validation, report, expected) {
  for (const [key, value] of Object.entries(expected)) {
    assert.equal(validation[key], value, 'Search acceptance does not bind frozen ' + key); assert.equal(report[key], value);
  }
  assert.deepEqual(validation.acceptance, report.acceptance);
  assert.equal(validation.acceptance.total, 24); assert.equal(validation.acceptance.passed, 24);
  assert(Array.isArray(validation.acceptance.failed) ? validation.acceptance.failed.length === 0 : validation.acceptance.failed === 0, 'Search acceptance contains failures.');
  assert(Array.isArray(validation.precision) && validation.precision.length === 8, 'Eight independent semantic precision checks are required.');
  assert.deepEqual(validation.precision, report.precision);
  assert.equal(new Set(validation.precision.map(check => check.id)).size, 8);
  assert(validation.precision.every(check => check.passed === true), 'Semantic precision checks must all pass.');
}
/** Verify only the public catalogue corpus and its content-addressed lazy chunks. */
export async function validateSearchIndex(release) {
  const catalogue = await readJson(path.join(release.assets, 'data/blocks.json'));
  const indexFile = 'data/library-search.json';
  assert(release.hashes[indexFile], 'Sharded public search manifest is required.');
  const indexBytes = await fs.readFile(path.join(release.assets, indexFile));
  assert(indexBytes.length <= 24 * 1024 * 1024);
  assert.equal(sha(indexBytes), release.hashes[indexFile]);
  const coreFile = 'site/src/lib/library-search-core.ts';
  assert(release.manifest.sourceHashes[coreFile], 'Frozen search implementation is required.');
  const { validateLibrarySearchIndex, searchLibraryIndex } = await import(pathToFileURL(path.join(release.root, 'source', coreFile)).href);
  const index = validateLibrarySearchIndex(JSON.parse(indexBytes), release.manifest.catalogueSha256);
  assert(index.shards, 'Search must retain its lazy shard manifest.');
  assert.equal(index.shards.size, 1024);
  assert.deepEqual(index.docs, catalogue.blocks.map(block => block.slug).sort(), 'Search must include every public catalogue document exactly once.');
  const inputs = { 'data/blocks.json': release.manifest.catalogueSha256 };
  for (const slug of index.docs) for (const file of [`data/pages/${slug}.json`, `skills/${slug}/SKILL.md`]) if (release.hashes[file]) inputs[file] = release.hashes[file];
  assert.equal(index.corpusHash, fingerprint(inputs), 'Search corpus does not match the exact public page and full-method bytes.');
  const files = [indexFile], fullPostings = [];
  for (const [id, chunk] of index.shards.files.entries()) {
    assert.equal(chunk.file, '/data/library-search/' + chunk.sha256 + '.json');
    const relative = chunk.file.slice(1); assert(safeRelative(relative));
    assert.equal(release.hashes[relative], chunk.sha256);
    const bytes = await fs.readFile(path.join(release.assets, relative));
    assert(bytes.length <= 4 * 1024 * 1024); assert.equal(sha(bytes), chunk.sha256);
    const postings = JSON.parse(bytes);
    assert(Array.isArray(postings)); assert.equal(postings.length, chunk.terms);
    assert.equal(chunk.terms, Math.min(1024, index.terms.length - id * 1024));
    for (const [offset, posting] of postings.entries()) {
      assert(typeof posting === 'string' && posting && /^[A-Za-z\d+/]*={0,2}$/.test(posting));
      assert.equal(Buffer.from(posting, 'base64').toString('base64'), posting, 'Posting must be canonical base64.');
      const immediate = index.postings[id * 1024 + offset];
      if (immediate) assert.equal(immediate, posting, 'Immediate semantic posting differs from its lazy chunk.');
      fullPostings.push(posting);
    }
    files.push(relative);
  }
  assert.equal(fullPostings.length, index.terms.length);
  assert.deepEqual([...new Set(files.slice(1))].sort(), Object.keys(release.hashes).filter(file => file.startsWith('data/library-search/')).sort(), 'Unlisted or missing search chunks.');
  for (const token of ['aeo', 'seo', 'agent', '~answer-visibility']) {
    const id = index.terms.indexOf(token); assert(id >= 0 && index.postings[id], 'Missing immediate search posting: ' + token);
  }
  const full = { ...index, postings: fullPostings };
  const aliases = ['AEO', 'GEO', 'answer engine optimization', 'AI search'];
  const aliasResults = aliases.map(query => [...searchLibraryIndex(full, query).keys()].sort());
  assert(aliasResults[0].length, 'AEO must find useful public tasks.');
  for (const result of aliasResults.slice(1)) assert.deepEqual(result, aliasResults[0], 'Answer-search aliases disagree.');
  const intent = [...searchLibraryIndex(full, 'get my brand mentioned in ChatGPT answers')].sort((a, b) => b[1].score - a[1].score);
  assert(intent.length && /AI answer visibility/.test(intent[0][1].reason ?? ''), 'Natural goal search lacks a purpose match.');
  const derived = release.manifest.derivedLibrarySearch;
  assert(derived, 'Frozen search derivation evidence is required.');
  assert.equal(derived.sourceHash, index.sourceHash); assert.equal(derived.corpusHash, index.corpusHash);
  assert.equal(derived.documents, index.docs.length); assert.equal(derived.terms, index.terms.length);
  assert.deepEqual(derived.files, Object.fromEntries([...new Set(files)].map(file => [file, release.hashes[file]])));
  const coreHash = release.manifest.sourceHashes[coreFile], intentsHash = release.manifest.sourceHashes['site/src/lib/library-search-intents.ts'];
  assert(coreHash && intentsHash);
  assert.equal(derived.engineHash, fingerprint({ 'library-search-core.ts': coreHash, 'library-search-intents.ts': intentsHash }));
  assert.equal(derived.engineHash, SEARCH_ENGINE_SHA256, 'Only the independently reviewed GEO precision fix is allowed.');
  const validation = release.manifest.searchValidation;
  assert(validation && inside(release.root, path.resolve(validation.reportFile)), 'Freeze independent search acceptance evidence inside this release.');
  const validationBytes = await fs.readFile(validation.reportFile); assert.equal(sha(validationBytes), validation.sha256);
  const report = JSON.parse(validationBytes);
  validateSearchAcceptance(validation, report, { sourceHash: index.sourceHash, corpusHash: index.corpusHash, manifestHash: release.hashes[indexFile], documents: index.docs.length, coreHash, intentsHash });
  return { files: [...new Set(files)], sourceHash: index.sourceHash, corpusHash: index.corpusHash, documents: index.docs.length, terms: index.terms.length, chunks: index.shards.files.length, immediateAeoResults: aliasResults[0].length, naturalGoalTop: intent[0][0], naturalGoalPurposeSlugs: intent.filter(([, hit]) => /AI answer visibility/.test(hit.reason ?? '') && hit.field !== 'body').map(([slug]) => slug), lazySample: index.terms.find((term, id) => !index.postings[id] && /^[a-z]{7,14}$/.test(term)) };
}
/** The reviewed overlay is narrow; every other saved-demo byte stays baseline-identical. */
export async function validateExampleOverlay(release) {
  const selected = release.manifest.reviewedExampleOverlay;
  assert(selected && selected.manifestFile && selected.manifestSha256 && selected.hashes, 'Reviewed generic example overlay is required.');
  const evidenceFile = path.resolve(selected.manifestFile);
  assert(inside(release.root, evidenceFile), 'Freeze overlay evidence inside this release.');
  const evidenceBytes = await fs.readFile(evidenceFile); assert.equal(sha(evidenceBytes), selected.manifestSha256);
  const evidence = JSON.parse(evidenceBytes);
  assert.equal(evidence.schema, 'ai-blocks-reviewed-example-display-overlay/1');
  assert.equal(evidence.status, 'reviewed-display-overlay'); assert.equal(evidence.deploymentAuthorized, false);
  assert.equal(evidence.baseline.versionId, '07892305-f4bd-4ad6-9380-64229e82b76a'); assert.equal(path.resolve(evidence.baseline.assets), path.resolve(DEVICES_SOURCE_ROOT, '../assets'));
  assert.equal(evidence.fileCount, 262); assert.equal(evidence.files.length, 262);
  assert.equal(fingerprint(selected.hashes), selected.overlayFingerprint);
  assert.equal(selected.overlayFingerprint, 'd8eeb8c5e672e7791a268c6cdb2ce6f463c1f38317a8d50e8b9634a351576cef', 'Only the reviewed frozen display overlay is allowed.');
  assert.equal(evidence.overlayFingerprint, selected.overlayFingerprint);
  const declared = Object.fromEntries(evidence.files.map(file => [file.path, file.sha256]));
  assert.deepEqual(selected.hashes, declared); assert.equal(Object.keys(declared).length, 262);
  const baselineHashes = await readJson(path.resolve(DEVICES_SOURCE_ROOT, '../asset-hashes.json'));
  for (const item of evidence.files) {
    assert(safeRelative(item.path)); assert(/^(?:example-app\/.*\.(?:html|js)|example-app-shots\/[a-z-]+\.webp)$/.test(item.path));
    assert.equal(baselineHashes[item.path], item.beforeSha256, 'Overlay baseline changed: ' + item.path);
    assert.equal(release.hashes[item.path], item.sha256, 'Overlay asset differs: ' + item.path);
    if (!item.path.endsWith('.webp')) assert(!/merc(?:atura|urata|uriata)/i.test(await fs.readFile(path.join(release.assets, item.path), 'utf8')), 'Old visible app name remains: ' + item.path);
  }
  let preserved = 0;
  for (const [file, expected] of Object.entries(baselineHashes)) if (/^(?:example-app\/|example-app-shots\/)/.test(file) && !declared[file]) {
    assert.equal(release.hashes[file], expected, 'Unreviewed saved-example asset changed: ' + file); preserved++;
  }
  return { files: Object.keys(declared).sort(), overlayFingerprint: selected.overlayFingerprint, manifestSha256: selected.manifestSha256, unchangedExampleAssets: preserved };
}
export async function validatePackageSamples(release) {
  const catalogue = await readJson(path.join(release.assets, 'data/blocks.json'));
  const bySlug = Object.fromEntries(catalogue.blocks.map(block => [block.slug, block]));
  const starters = await readJson(path.join(release.assets, 'data/starter-blocks.json'));
  assert.equal(starters.sourceHash, release.manifest.catalogueSha256);
  assert.equal(starters.starter, true); assert.equal(starters.blocks.length, 4);
  for (const block of starters.blocks) assert(bySlug[block.slug], 'Starter absent from frozen catalogue.');
  const derived = await readJson(path.join(release.root, 'derived-supporting-assets.json'));
  const mapping = Object.entries(derived.mapping);
  // R2 retains R1's already-materialized supporting files. A zero-new-files
  // derivation report is valid; sample the frozen published inventory as well.
  const published = new Map(mapping);
  for (const file of Object.keys(release.hashes)) if (/^skills\/[^/]+\/.+\.(?:md|py)$/.test(file) && !file.endsWith('/SKILL.md')) {
    const slug = file.split('/')[1], archive = 'skills/' + slug + '.zip';
    if (bySlug[slug] && release.hashes[archive] && !published.has(file)) published.set(file, { sha256: release.hashes[file], archive, archiveSha256: release.hashes[archive] });
  }
  const selected = ['.md', '.py'].map(extension => [...published].find(([file]) => file.endsWith(extension)));
  assert(selected.every(Boolean), 'Published derived Markdown and Python samples required.');
  const packages = new Map([['ad-first-line-writer-and-scorer', new Set()]]);
  for (const [file, source] of selected) {
    assert.equal(release.hashes[file], source.sha256); assert.equal(release.hashes[source.archive], source.archiveSha256);
    const slug = file.split('/')[1]; assert(bySlug[slug]);
    if (!packages.has(slug)) packages.set(slug, new Set()); packages.get(slug).add(file);
  }
  const require = createRequire(new URL('../site/package.json', import.meta.url)), { unzipSync } = require('fflate');
  for (const [slug, supportFiles] of packages) {
    assert(bySlug[slug], 'Required baseline package absent: ' + slug);
    const archive = 'skills/' + slug + '.zip'; assert(release.hashes[archive]);
    const files = unzipSync(await fs.readFile(path.join(release.assets, archive)));
    assert(files[slug + '/SKILL.md'], 'Full package must contain its skill.');
    const metadata = await readJson(path.join(release.assets, 'data/pages/' + slug + '.json'));
    assert(Array.isArray(metadata.files) && metadata.files.length && metadata.files.every(file => typeof file === 'string'));
    // Page.files is the exact archive inventory. Never demand an unlinked standalone copy.
    for (const relative of metadata.files) assert(files[slug + '/' + relative], 'Declared support file missing from full ZIP: ' + slug + '/' + relative);
    for (const [file] of mapping.filter(([file]) => file.startsWith('skills/' + slug + '/'))) supportFiles.add(file);
    for (const file of supportFiles) {
      const relative = file.slice(('skills/' + slug + '/').length), entry = slug + '/' + relative;
      assert(files[entry]); assert.equal(sha(files[entry]), release.hashes[file], 'Derived copy differs from full source ZIP: ' + file);
    }
  }
  return { bySlug, starters, packages };
}
export async function validateSettingsBaseline() {
  const bytes = await fs.readFile(SETTINGS_BASELINE_FILE);
  assert.equal(sha(bytes), '489e8676a0f55eca1426b703b58d6f5cd2d74f1719126704ecc76bbd9426d8d4');
  const evidence = JSON.parse(bytes); assert.equal(evidence.status, 'pass');
  assert.equal(evidence.productionVersionId, BASELINE_VERSION); assert.equal(evidence.workerSha256, MCP_WORKER_SHA256);
  assert.equal(evidence.readOnly, true); assert.equal(evidence.databaseWrites, 0); assert.equal(evidence.providerCalls, 0);
  assert.equal(path.resolve(evidence.settingsFile), path.join(path.dirname(SETTINGS_BASELINE_FILE), 'settings.json'));
  const settingsBytes = await fs.readFile(evidence.settingsFile); assert.equal(sha(settingsBytes), evidence.settingsSha256);
  const settings = JSON.parse(settingsBytes);
  assert.equal(fingerprint(effectiveSettings(settings)), evidence.effectiveSettingsFingerprint);
  assert.deepEqual(bindingFingerprints(settings), evidence.bindings);
  return { evidence, settings, sha256: sha(bytes) };
}
export async function verifiedMcpBaseline() {
  const baseline = await readJson('reports/2026-10-23-mcp-production-handoff.json');
  assert.equal(sha(await fs.readFile('reports/2026-10-23-mcp-production-handoff.json')), 'f599a22325be1f1c3549a39e454ce820ceec46fc79e3749b5533bfa95c8981cd');
  assert.equal(baseline.status, 'PUBLISHED_AND_VERIFIED'); assert.equal(baseline.versionId, BASELINE_VERSION);
  assert.equal(path.resolve(baseline.releaseRoot), BASELINE_ROOT); assert.equal(baseline.workerSha256, MCP_WORKER_SHA256);
  const validationBytes = await fs.readFile('reports/2026-10-23-mcp-production-validation.json');
  assert.equal(sha(validationBytes), 'af8ee8377fedaad79513d21ef09baf354579a532815883e8b34a4f3e10d2c7f7');
  const validation = JSON.parse(validationBytes); assert.equal(validation.status, 'PASS'); assert.equal(validation.productionVersionId, BASELINE_VERSION);
  assert.equal(validation.workerSha256, MCP_WORKER_SHA256);
  assert.equal(sha(await fs.readFile(path.join(BASELINE_ROOT, 'release-manifest.json'))), 'b6660398c6023a0df3dfac01bad9fb09c5bd33f3f880ed190e91c5c8437affbb');
  assert.equal(sha(await fs.readFile(path.join(BASELINE_ROOT, 'wrangler.production.jsonc'))), baseline.configurationSha256);
  assert.equal(sha(await fs.readFile(baseline.worker)), MCP_WORKER_SHA256);
  const cache = await readJson(path.join(BASELINE_ROOT, 'frozen-assets-manifest.json'));
  assert.equal(cache.manifestSha256, baseline.frozenAssetManifestSha256);
  assert.equal(sha(JSON.stringify(cache.manifest)), cache.manifestSha256);
  assert.equal(path.resolve(cache.directory), path.join(BASELINE_ROOT, 'assets'));
  const require = createRequire(new URL('../site/package.json', import.meta.url)), { hash } = require('blake3-wasm');
  const entries = await fs.readdir(cache.directory, { recursive: true, withFileTypes: true });
  assert(!entries.some(item => item.isSymbolicLink()));
  const files = entries.filter(item => item.isFile()).map(item => path.relative(cache.directory, path.join(item.parentPath, item.name)).split(path.sep).join('/'));
  const hashes = {}; let next = 0;
  await Promise.all(Array.from({ length: 16 }, async () => { while (next < files.length) {
    const file = files[next++]; assert(safeRelative(file)); const bytes = await fs.readFile(path.join(cache.directory, file));
    const recorded = cache.manifest['/' + file];
    if (recorded) { assert.equal(bytes.length, recorded.size); assert.equal(hash(bytes.toString('base64') + path.extname(file).slice(1)).toString('hex').slice(0, 32), recorded.hash, 'MCP baseline upload bytes changed: ' + file); }
    else assert(['.assetsignore', '_headers', '_redirects', '_routes.json'].includes(file), 'Unrecorded MCP baseline asset: ' + file);
    hashes[file] = sha(bytes);
  } }));
  for (const file of Object.keys(cache.manifest)) assert(hashes[file.slice(1)], 'Missing baseline upload asset: ' + file);
  const devicesHashes = await readJson(path.resolve(DEVICES_SOURCE_ROOT, '../asset-hashes.json'));
  for (const file of ['.assetsignore', '_headers', '_redirects', '_routes.json']) assert.equal(hashes[file], devicesHashes[file], 'Unuploaded baseline hosting policy changed: ' + file);
  assert.equal(hashes['data/public-api-manifest.json'], baseline.publicApiManifestSha256);
  return { baseline: { ...baseline, root: baseline.releaseRoot }, deployed: { ...baseline, databaseId: baseline.databaseId }, hashes };
}
async function validateReviewedStarter(release) {
  const selected = release.manifest.reviewedLocalAppStarter;
  assert(selected && inside(release.root, path.resolve(selected.manifestFile)), 'Freeze reviewed local starter evidence inside the release.');
  const bytes = await fs.readFile(selected.manifestFile); assert.equal(sha(bytes), STARTER_INPUT_SHA256); assert.equal(selected.manifestSha256, STARTER_INPUT_SHA256);
  const evidence = JSON.parse(bytes); assert.equal(evidence.schema, 'ai-blocks-reviewed-local-app-starter-input/1');
  assert.equal(evidence.publicBaseline, false); assert.equal(evidence.contentRewritten, false); assert.equal(evidence.externalExecution, false);
  assert.equal(evidence.fileCount, 16); assert.equal(evidence.stageCount, 9);
  assert.equal(selected.inputFingerprint, 'c9c49b973882f31a778cc477c963a3433bbf2b0195ccabc2a99fb184598f6e2c');
  assert.equal(fingerprint(evidence.hashes), selected.inputFingerprint); assert.deepEqual(selected.hashes, evidence.hashes);
  assert.deepEqual(evidence.sourceBeforeHashes, evidence.hashes); assert.deepEqual(evidence.sourceAfterHashes, evidence.hashes);
  assert.equal(selected.sourceQaArchiveSha256, 'dee38f6f68e994415a6ddc1b2d7ef3004f951c0bddaaea7dcc73dcf393b4c417');
  assert.equal(sha(await fs.readFile(evidence.sourceQaArchive.file)), selected.sourceQaArchiveSha256);
  const actualStarter = await fs.readdir(path.join(release.root, 'source/app-starter'), { recursive: true, withFileTypes: true });
  assert(!actualStarter.some(item => item.isSymbolicLink()));
  assert.deepEqual(actualStarter.filter(item => item.isFile()).map(item => 'app-starter/' + path.relative(path.join(release.root, 'source/app-starter'), path.join(item.parentPath, item.name)).split(path.sep).join('/')).sort(), Object.keys(evidence.hashes).sort(), 'Unexpected local starter input entered the frozen build.');
  for (const [file, expected] of Object.entries(evidence.hashes)) { assert(safeRelative(file)); assert.equal(sha(await fs.readFile(path.join(release.root, 'source', file))), expected); }
  return { files: 16, stages: 9, inputFingerprint: selected.inputFingerprint, sourceQaArchiveSha256: selected.sourceQaArchiveSha256, provenance: 'reviewed-local-input-not-public-baseline' };
}
export async function validateRelease(manifestFile) {
  const file = path.resolve(manifestFile), root = path.dirname(file);
  const allowed = [path.resolve('site/.wrangler/releases'), path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/23/01a16767-65d7-7912-81d7-ae3cd042ca89')];
  assert(allowed.some(parent => inside(parent, root)), 'Use an approved dedicated frozen release.');
  assert.equal(root, RELEASE_ROOT, 'Only the reviewed UI refinement release root is allowed.');
  assert.equal(path.basename(file), 'release-manifest.json');
  const manifestBytes = await fs.readFile(file), manifest = JSON.parse(manifestBytes);
  validateManifestContract(manifest, root);
  assert.equal(path.resolve(manifest.root), root);
  const assets = path.resolve(manifest.assets); assert.equal(assets, path.join(root, 'assets'));
  const { baseline, deployed, hashes: baselineHashes } = await verifiedMcpBaseline();
  assert.equal(path.resolve(manifest.previous), path.resolve(baseline.root));
  assert.equal(manifest.previousVersionId, BASELINE_VERSION);
  assert.equal(manifest.workerSha256, baseline.workerSha256);
  assert.equal(manifest.workerSha256, deployed.workerSha256);
  assert.equal(manifest.catalogueSha256, deployed.catalogueSha256, 'This UI release must retain the verified public catalogue.');
  assert.equal(path.resolve(manifest.frontendSourceBaselineRoot), DEVICES_SOURCE_ROOT);
  assert.equal(path.resolve(manifest.assetBaselineRoot), BASELINE_ROOT);
  const verifiedMcp = manifest.verifiedMcpBaseline;
  assert(verifiedMcp); assert.equal(verifiedMcp.handoffSha256, 'f599a22325be1f1c3549a39e454ce820ceec46fc79e3749b5533bfa95c8981cd');
  assert.equal(path.resolve(verifiedMcp.workerInput), path.resolve(baseline.worker));
  const frozenBaselineManifest = await readJson(verifiedMcp.frozenAssetManifestFile);
  assert.equal(frozenBaselineManifest.manifestSha256, baseline.frozenAssetManifestSha256);
  assert.equal(verifiedMcp.frozenAssetManifestSha256, sha(await fs.readFile(verifiedMcp.frozenAssetManifestFile)));
  assert.equal(verifiedMcp.validationSha256, 'af8ee8377fedaad79513d21ef09baf354579a532815883e8b34a4f3e10d2c7f7');
  assert.equal(verifiedMcp.releaseManifestSha256, 'b6660398c6023a0df3dfac01bad9fb09c5bd33f3f880ed190e91c5c8437affbb');
  assert.equal(verifiedMcp.configurationSha256, baseline.configurationSha256);
  assert.deepEqual(verifiedMcp.requiredWorkerRoutes, baseline.requiredWorkerRoutes); assert.deepEqual(verifiedMcp.requiredApiFlags, baseline.requiredApiFlags);
  for (const [fileKey, hashKey] of [['handoffFile', 'handoffSha256'], ['validationFile', 'validationSha256'], ['releaseManifestFile', 'releaseManifestSha256']]) assert.equal(sha(await fs.readFile(verifiedMcp[fileKey])), verifiedMcp[hashKey]);
  assert.deepEqual(verifiedMcp.assetHashes, Object.fromEntries([...baseline.requiredNewAssets, baseline.requiredGeneratedAsset].map(file => [file, baselineHashes[file]])));
  assert.equal(fingerprint(manifest.sourceHashes), manifest.sourceFingerprint);
  for (const [relative, expected] of Object.entries(manifest.sourceHashes)) {
    const frozenFile = path.resolve(root, 'source', relative);
    assert(inside(path.join(root, 'source'), frozenFile), 'Invalid source snapshot path.');
    assert(!(await fs.lstat(frozenFile)).isSymbolicLink());
    assert.equal(sha(await fs.readFile(frozenFile)), expected, 'Frozen source changed: ' + relative);
  }
  assert.deepEqual(Object.keys(manifest.reviewedFrontendOverrides ?? {}), ['site/scripts/prerender.mjs']);
  const override = manifest.reviewedFrontendOverrides['site/scripts/prerender.mjs'];
  assert.equal(path.resolve(override.sourceFile), APPROVED_PRERENDER_FILE);
  assert.equal(path.resolve(override.reviewedFromSource), APPROVED_PRERENDER_ORIGIN);
  assert.equal(override.sha256, APPROVED_PRERENDER_SHA256);
  assert.equal(manifest.sourceHashes['site/scripts/prerender.mjs'], APPROVED_PRERENDER_SHA256);
  assert.equal(sha(await fs.readFile(APPROVED_PRERENDER_FILE)), APPROVED_PRERENDER_SHA256);
  assert.equal(sha(await fs.readFile(APPROVED_PRERENDER_ORIGIN)), APPROVED_PRERENDER_SHA256);
  const accountFiles = ['AccountPersistence.tsx', 'AccountPage.tsx', 'account.css', 'lib/library-sync.ts', 'lib/library-storage.ts', 'lib/library-data.ts', 'lib/signup-saves.ts', 'lib/composer-account.ts', 'lib/page-metadata.ts', 'lib/site-info.mjs'].map(file => 'site/src/' + file);
  assert.deepEqual(Object.keys(manifest.accountBaselineSourceHashes ?? {}).sort(), [...accountFiles].sort());
  assert.deepEqual(manifest.accountBaselineFrozenHashes, manifest.accountBaselineSourceHashes, 'Reviewed cross-device/account code must remain exact.');
  for (const relative of accountFiles) {
    const expected = sha(await fs.readFile(path.join(DEVICES_SOURCE_ROOT, relative)));
    assert.equal(manifest.accountBaselineSourceHashes[relative], expected);
    assert.equal(sha(await fs.readFile(path.join(root, 'source', relative))), expected, 'Account saving/signin source changed: ' + relative);
  }
  assert.deepEqual(Object.keys(manifest.pinnedUiBaselineSourceHashes ?? {}).sort(), ['site/src/Business.tsx', 'site/src/MindsPage.tsx', 'site/src/MindLabel.tsx'].sort());
  for (const relative of ['site/src/lib/merge-library.ts', ...Object.keys(manifest.pinnedUiBaselineSourceHashes)]) {
    assert(safeRelative(relative));
    let baselineBytes;
    try { baselineBytes = await fs.readFile(path.join(DEVICES_SOURCE_ROOT, relative)); } catch (error) {
      assert(relative === 'site/src/lib/merge-library.ts' && error.code === 'ENOENT');
      await assert.rejects(fs.access(path.join(root, 'source', relative)), { code: 'ENOENT' }, 'Unreviewed merge module entered the frozen account source.');
      assert(!manifest.sourceHashes[relative]); continue;
    }
    const expected = sha(baselineBytes);
    if (manifest.pinnedUiBaselineSourceHashes?.[relative]) assert.equal(manifest.pinnedUiBaselineSourceHashes[relative], expected);
    assert.equal(sha(await fs.readFile(path.join(root, 'source', relative))), expected, 'Pinned cross-device/UI source changed: ' + relative);
  }
  const mcpSource = manifest.acceptedMcpSource;
  assert(mcpSource && inside(root, path.resolve(mcpSource.inventoryFile)), 'Freeze accepted MCP source inventory inside the release.');
  const mcpSourceBytes = await fs.readFile(mcpSource.inventoryFile); assert.equal(sha(mcpSourceBytes), MCP_SOURCE_SHA256); assert.equal(mcpSource.inventorySha256, MCP_SOURCE_SHA256);
  const acceptedSource = JSON.parse(mcpSourceBytes); assert.equal(acceptedSource.sourceCount, 19); assert.equal(acceptedSource.productionVersionId, BASELINE_VERSION);
  assert.equal(path.resolve(mcpSource.actualSourceRoot), path.join(root, 'source'));
  assert.equal(mcpSource.count, 19); assert.equal(mcpSource.compiled, false); assert.equal(mcpSource.sourceFingerprint, acceptedSource.sourceFingerprint);
  assert.equal(fingerprint(acceptedSource.sourceHashes), acceptedSource.sourceFingerprint); assert.deepEqual(mcpSource.sourceHashes, acceptedSource.sourceHashes);
  assert(inside(root, path.resolve(mcpSource.sourceRoot)));
  for (const [relative, expected] of Object.entries(acceptedSource.sourceHashes)) { assert(safeRelative(relative)); assert.equal(manifest.backendSourceHashes[relative.slice('site/'.length)], expected); assert.equal(sha(await fs.readFile(path.join(acceptedSource.archiveRoot, relative))), expected); assert.equal(sha(await fs.readFile(path.join(mcpSource.sourceRoot, relative))), expected); assert.equal(sha(await fs.readFile(path.join(root, 'source', relative))), expected); }
  for (const entry of await fs.readdir(path.join(DEVICES_SOURCE_ROOT, 'site'), { recursive: true, withFileTypes: true })) if (entry.isFile()) {
    const relative = path.relative(DEVICES_SOURCE_ROOT, path.join(entry.parentPath, entry.name)).split(path.sep).join('/');
    if (/^site\/(?:functions\/|src\/server\/|src\/worker\.ts$)/.test(relative) && !acceptedSource.sourceHashes[relative]) assert.equal(manifest.backendSourceHashes[relative.slice('site/'.length)], sha(await fs.readFile(path.join(DEVICES_SOURCE_ROOT, relative))), 'Unreviewed backend source changed: ' + relative);
  }
  for (const [siteRelative, expected] of Object.entries(manifest.backendSourceHashes)) { const relative = 'site/' + siteRelative; assert(safeRelative(siteRelative)); assert.equal(sha(await fs.readFile(path.join(root, 'source', relative))), expected); if (!acceptedSource.sourceHashes[relative]) assert.equal(expected, sha(await fs.readFile(path.join(DEVICES_SOURCE_ROOT, relative))), 'Unreviewed backend source added: ' + relative); }
  const actualBackend = (await fs.readdir(path.join(root, 'source/site'), { recursive: true, withFileTypes: true })).filter(item => item.isFile()).map(item => path.relative(path.join(root, 'source'), path.join(item.parentPath, item.name)).split(path.sep).join('/')).filter(file => /^site\/(?:functions\/|src\/server\/|src\/worker\.ts$)/.test(file));
  assert.deepEqual(actualBackend.sort(), Object.keys(manifest.backendSourceHashes).map(file => 'site/' + file).sort(), 'Unrecorded backend input entered the frozen source tree.');
  const worker = path.join(root, 'worker/worker.js');
  assert.equal(sha(await fs.readFile(worker)), baseline.workerSha256);
  assert.equal(sha(await fs.readFile(baseline.worker)), baseline.workerSha256);
  const hashes = await readJson(path.join(root, 'asset-hashes.json'));
  assert(Object.keys(hashes).every(file => !file.startsWith('/') && !file.includes('\\') && !file.split('/').includes('..')), 'Invalid asset snapshot path.');
  assert.equal(fingerprint(hashes), manifest.assetFingerprint);
  const entries = await fs.readdir(assets, { recursive: true, withFileTypes: true });
  assert(!entries.some(entry => entry.isSymbolicLink()), 'No symbolic links in frozen assets.');
  const files = entries.filter(entry => entry.isFile()).map(entry => path.relative(assets, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'));
  assert.deepEqual([...files].sort(), Object.keys(hashes).sort(), 'Frozen asset inventory changed.');
  let next = 0;
  await Promise.all(Array.from({ length: 16 }, async () => { while (next < files.length) { const relative = files[next++]; assert.equal(sha(await fs.readFile(path.join(assets, relative))), hashes[relative], 'Frozen asset changed: ' + relative); } }));
  assert.equal(hashes['data/blocks.json'], manifest.catalogueSha256);
  for (const [relative, expected] of Object.entries(manifest.effectivePublicHashes ?? {})) assert.equal(hashes[relative], expected, 'Effective public content differs: ' + relative);
  for (const file of ['_headers', '_routes.json', '.assetsignore']) assert.equal(hashes[file], baselineHashes[file], 'Hosting/privacy policy changed: ' + file);
  for (const [relative, expected] of Object.entries(baselineHashes)) if (/^assets\//.test(relative) || /^(?:api|api-and-mcp|mcp|public-api|public-mcp|connect-mcp)(?:\/|\.|$)|^data\/public-api-manifest\.json$|^\.well-known\/(?:oauth-|openid)|^(?:openapi|mcp-manifest)\.json$/i.test(relative)) assert.equal(hashes[relative], expected, 'Independent API/MCP asset or dependency changed: ' + relative);
  for (const [relative, expected] of Object.entries(manifest.miniToolBaselineHashes ?? {})) {
    const frozenFile = path.resolve(root, 'source', relative);
    assert(inside(path.join(root, 'source'), frozenFile)); assert(!(await fs.lstat(frozenFile)).isSymbolicLink());
    assert.equal(sha(await fs.readFile(frozenFile)), expected, 'Frozen mini-tool source differs: ' + relative);
  }
  assert.equal(manifest.staticChecks?.status, 'pass');
  const configFile = path.join(root, 'wrangler.production.jsonc'), config = await readJson(configFile);
  const baselineConfig = await readJson(path.join(baseline.root, 'wrangler.production.jsonc'));
  assert.deepEqual(normalizeConfig(config), normalizeConfig(baselineConfig), 'Effective production config changed.');
  assert.equal(fingerprint(normalizeConfig(config)), manifest.configurationFingerprints.production);
  const stagingConfig = await readJson(path.join(root, 'wrangler.staging.jsonc'));
  assert.equal(manifest.stagingConfiguration.deploymentAllowed, false);
  const baselineStaging = await readJson(path.resolve(DEVICES_SOURCE_ROOT, '../wrangler.staging.jsonc'));
  assert.deepEqual(normalizeConfig(stagingConfig), normalizeConfig(baselineStaging), 'Independent archival staging configuration changed.');
  assert.equal(fingerprint(normalizeConfig(stagingConfig)), manifest.configurationFingerprints.staging);
  assert.equal(config.name, 'ai-building-blocks'); assert.equal(config.account_id, '31c814d2c58a11163d3187f505f0b9c5');
  assert.equal(path.resolve(config.main), worker); assert.equal(path.resolve(config.assets.directory), assets); assert.equal(config.no_bundle, true);
  assert.equal(config.vars.WORKFLOW_COMPOSER_ENABLED, 'true');
  for (const [key, expected] of Object.entries(baseline.requiredApiFlags)) assert.equal(config.vars[key], expected);
  assert.deepEqual(config.assets.run_worker_first, baseline.requiredWorkerRoutes);
  assert(config.d1_databases.length && config.d1_databases.every(binding => binding.database_id === deployed.databaseId));
  const release = { file, root, assets, worker, configFile, config, manifest, hashes, manifestSha256: sha(manifestBytes), baseline, deployed };
  release.starter = await validateReviewedStarter(release);
  release.settingsBaseline = await validateSettingsBaseline();
  const settingsEvidence = manifest.liveSettingsBaseline;
  assert(settingsEvidence && inside(root, path.resolve(settingsEvidence.manifestFile)));
  assert.equal(sha(await fs.readFile(settingsEvidence.manifestFile)), release.settingsBaseline.sha256);
  assert.equal(settingsEvidence.manifestSha256, release.settingsBaseline.sha256);
  for (const key of ['settingsSha256', 'effectiveSettingsFingerprint', 'productionVersionId', 'workerSha256']) assert.equal(settingsEvidence[key], release.settingsBaseline.evidence[key]);
  assert.equal(sha(await fs.readFile(settingsEvidence.settingsFile)), settingsEvidence.settingsSha256);
  await validatePackageSamples(release);
  release.search = await validateSearchIndex(release);
  release.example = await validateExampleOverlay(release);
  return release;
}
export async function cloudflareClient(config) {
  const text = await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8');
  const token = text.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1]; assert(token, 'Existing authenticated Wrangler credentials required.');
  const base = `https://api.cloudflare.com/client/v4/accounts/${config.account_id}/workers/scripts/ai-building-blocks`;
  const request = async route => { const response = await fetch(base + route, { headers: { authorization: 'Bearer ' + token }, signal: AbortSignal.timeout(30000) }); assert(response.ok, 'Cloudflare read failed: ' + response.status); return response; };
  const api = async route => { const data = await (await request(route)).json(); assert.equal(data.success, true, 'Cloudflare read did not succeed.'); return data.result; };
  const version = async () => { const result = await api('/deployments'), versions = (result.deployments ?? result)[0].versions; assert.equal(versions.length, 1); assert.equal(versions[0].percentage, 100); return versions[0].version_id; };
  const workerHash = async () => {
    // Endpoint verified against the installed official Wrangler 4.151.3 SDK.
    const response = await request('/content/v2'), type = response.headers.get('content-type') ?? '';
    if (/multipart\/form-data/i.test(type)) {
      const form = await response.formData();
      const module = form.get('worker.js'); assert(module && typeof module.arrayBuffer === 'function', 'Expected the frozen worker.js module.');
      return sha(Buffer.from(await module.arrayBuffer()));
    }
    return sha(Buffer.from(await response.arrayBuffer()));
  };
  return { api, version, workerHash };
}
export const bindingFingerprints = settings => settings.bindings.map(binding => ({ name: binding.name, sha256: fingerprint(binding) })).sort((a, b) => a.name.localeCompare(b.name));
export function effectiveSettings(settings) { const value = structuredClone(settings); delete value.annotations; return value; }

export async function validateReview(release, reviewFile) {
  assert.equal(path.resolve(reviewFile), ROOT_REVIEW, 'Use the separate exact UI refinement approval record.');
  const review = await readJson(reviewFile);
  validateReviewBinding(release, review);
  for (const evidence of review.qaEvidence) {
    assert.equal(sha(await fs.readFile(evidence.file)), evidence.sha256, 'QA evidence changed: ' + evidence.kind);
  }
  return { review, sha256: sha(await fs.readFile(reviewFile)) };
}
export function validateReviewBinding(release, review) {
  assert.equal(review.approved, true, 'Root release review is pending.');
  assert.equal(path.resolve(review.root), release.root);
  for (const key of ['assetFingerprint', 'sourceFingerprint', 'catalogueSha256', 'workerSha256', 'previousVersionId']) assert.equal(review[key], release.manifest[key], 'Root review does not bind this exact release: ' + key);
  assert.equal(review.manifestSha256, release.manifestSha256);
  assert.equal(review.previousVersionId, BASELINE_VERSION);
  assert(Array.isArray(review.qaEvidence) && review.qaEvidence.length >= 2, 'Browser and visual QA evidence required.');
  for (const kind of ['browser', 'visual']) assert(review.qaEvidence.some(evidence => evidence.kind === kind && evidence.status === 'pass'), 'Missing passing ' + kind + ' QA evidence.');
  for (const evidence of review.qaEvidence) {
    assert.equal(evidence.status, 'pass');
  }
}

/** Fresh anonymous contexts; every non-GET/HEAD request is stopped before transport. */
export async function verifyPublicUi(release, output, { origin = PRODUCTION, staticPreview = false } = {}) {
  assert(origin === PRODUCTION || /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin), 'Only production or a local frozen QA preview is allowed.');
  assert(!staticPreview || origin !== PRODUCTION, 'Never mock production authentication.');
  const require = createRequire(new URL('../site/package.json', import.meta.url));
  const { chromium, expect: baseExpect } = require('@playwright/test');
  const expect = baseExpect.configure({ timeout: 20000 });
  const browser = await chromium.launch({ channel: 'chrome' }), evidence = [];
  try {
    for (const [device, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'light', serviceWorkers: 'block' });
      await context.addInitScript(() => localStorage.setItem('abb:analytics-consent:v1', JSON.stringify({ value: 'denied', at: Date.now() })));
      const blocked = [], errors = [];
      await context.route('**/*', route => {
        const request = route.request();
        if (!['GET', 'HEAD'].includes(request.method())) { blocked.push({ method: request.method(), origin: new URL(request.url()).origin, pathname: new URL(request.url()).pathname }); return route.abort('blockedbyclient'); }
        if (staticPreview && request.url() === origin + '/api/auth') return route.fulfill({ json: { configured: false } });
        return route.continue();
      });
      const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
      await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
      await expect(page.getByTestId('library-search')).toBeVisible({ timeout: 30000 });
      for (const id of ['all', 'prompt', 'skill', 'workflow', 'agent', 'mind']) await expect(page.getByTestId('tab-' + id)).toBeVisible();
      await expect(page.getByTestId('tab-all')).toHaveAttribute('aria-selected', 'true');
      for (const job of ['all', 'coding', 'marketing', 'design', 'writing', 'business']) await expect(page.getByTestId('job-' + job)).toBeVisible();
      await expect(page.getByTestId('job-all')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByTestId('filter-domain')).toContainText('All functions');
      await expect(page.getByTestId('filter-task')).toContainText('All use cases');
      const sectionIds = ['home-minds', 'home-workflows', 'home-agents', 'everyday-tools'];
      assert.deepEqual(await page.locator(sectionIds.map(id => '#' + id).join(',')).evaluateAll(nodes => nodes.map(node => node.id)), sectionIds);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), device + ' homepage overflows horizontally');
      const manifestResponse = page.waitForResponse(response => response.url() === origin + '/data/library-search.json' && response.status() === 200);
      await page.getByTestId('library-search').fill('AEO'); await manifestResponse;
      await expect(page.getByTestId('result-count')).toContainText(/^[1-9]\d* results?/);
      await expect(page.getByText('Searching full instructions…', { exact: true })).toHaveCount(0);
      await page.getByTestId('library-search').fill('get my brand mentioned in ChatGPT answers');
      await expect.poll(() => page.locator('#library-results [data-testid="block-card"]').first().getAttribute('data-slug'), { timeout: 15000 }).toBeTruthy();
      await expect.poll(() => page.locator('#library-results [data-testid="block-card"]').first().getAttribute('data-slug'), { timeout: 15000 }).toMatch(new RegExp('^(?:' + release.search.naturalGoalPurposeSlugs.join('|') + ')$'));
      assert(release.search.lazySample, 'A non-immediate deep search term is required.');
      const chunkResponse = page.waitForResponse(response => response.url().startsWith(origin + '/data/library-search/') && response.status() === 200);
      await page.getByTestId('library-search').fill(release.search.lazySample); await chunkResponse;
      await expect(page.getByText('Searching full instructions…', { exact: true })).toHaveCount(0);
      await expect(page.getByTestId('result-count')).toContainText(/^[1-9]\d* results?/);
      await expect(page.getByText('Full instructions could not be searched.', { exact: false })).toHaveCount(0);
      await page.getByTestId('library-search').scrollIntoViewIfNeeded();
      const searchShot = output.replace(/\.json$/, '') + '-' + device + '-search.png'; await page.screenshot({ path: searchShot });
      await page.getByTestId('library-search').fill('');
      await page.locator('#home-workflows a[href^="/?workflow="]').first().click();
      const builder = page.getByTestId('builder');
      await expect(builder.getByTestId('workflow-list-view')).toHaveAttribute('aria-pressed', 'true');
      const selected = await builder.getByTestId('workflow-list-view').evaluate(node => getComputedStyle(node).backgroundColor);
      const unselected = await builder.getByTestId('workflow-diagram-view').evaluate(node => getComputedStyle(node).backgroundColor);
      assert.notEqual(selected, unselected, 'Selected workflow mode must be visually distinct.');
      const start = builder.getByTestId('list-start'); await expect(start).toBeVisible();
      assert(await start.evaluate(node => node.scrollWidth <= node.clientWidth), 'Workflow Start text clips.');
      await expect(builder.getByTestId('step-open').first()).toBeVisible();
      const workflowSteps = await builder.getByTestId('step-open').count();
      await builder.getByTestId('workflow-diagram-view').click(); await expect(builder.getByTestId('workflow-diagram-view')).toHaveAttribute('aria-pressed', 'true');
      await expect(builder.getByTestId('flow-node')).toHaveCount(workflowSteps);
      await builder.getByTestId('workflow-list-view').click(); await expect(start).toBeVisible();
      await expect(builder.getByTestId('step-open')).toHaveCount(workflowSteps);
      const workflowShot = output.replace(/\.json$/, '') + '-' + device + '-workflow.png'; await page.screenshot({ path: workflowShot });
      await page.goto(origin + '/apps/starter-pack', { waitUntil: 'domcontentloaded' });
      const starter = page.getByTestId('starter-page'); await expect(starter.locator('#stages .ap-stages li')).toHaveCount(9);
      const [download] = await Promise.all([page.waitForEvent('download'), starter.getByTestId('starter-download').click()]);
      assert.equal(download.suggestedFilename(), 'app-starter.zip');
      const archiveFile = output.replace(/\.json$/, '') + '-' + device + '-app-starter.zip'; await download.saveAs(archiveFile);
      const archiveBytes = await fs.readFile(archiveFile); assert.equal(sha(archiveBytes), release.starter.sourceQaArchiveSha256, 'Downloaded starter archive differs from the reviewed complete sixteen-file pack.');
      const { unzipSync } = require('fflate'), unpacked = unzipSync(archiveBytes), starterHashes = release.manifest.reviewedLocalAppStarter.hashes;
      assert.deepEqual(Object.keys(unpacked).sort(), Object.keys(starterHashes).sort());
      for (const [file, expected] of Object.entries(starterHashes)) assert.equal(sha(unpacked[file]), expected, 'Downloaded starter file changed: ' + file);
      assert.deepEqual(errors, [], 'Uncaught live UI errors.');
      assert(!blocked.some(request => request.origin === origin && /^\/api\//.test(request.pathname)), 'The public UI unexpectedly attempted an API mutation.');
      evidence.push({ device, filters: 'pass', sectionOrder: sectionIds, semanticAeo: 'pass', naturalGoal: 'pass', deepChunk: 'pass', workflowMode: 'pass', workflowSteps, searchShot, workflowShot, starter: { stages: 9, files: 16, archiveFile, sha256: sha(archiveBytes), exactReviewedBytes: true }, staticPreview, analyticsConsent: 'denied in isolated QA context', blockedMutations: blocked, transportedMutations: 0 });
      await context.close();
    }
  } finally { await browser.close(); }
  return evidence;
}

export async function checkLive(release, deploymentFile, output) {
  assert.equal(path.resolve(deploymentFile), DEPLOYMENT_REPORT); assert.equal(path.resolve(output), LIVE_REPORT);
  const deployment = await readJson(deploymentFile);
  assert.equal(deployment.status, 'deployed-awaiting-live-verification');
  assert.equal(deployment.environment, 'production'); assert.equal(deployment.manifestSha256, release.manifestSha256);
  assert.equal(deployment.previousVersionId, BASELINE_VERSION); assert.notEqual(deployment.versionId, BASELINE_VERSION);
  assert.equal(deployment.assetFingerprint, release.manifest.assetFingerprint);
  assert.equal(deployment.sourceFingerprint, release.manifest.sourceFingerprint);
  assert.equal(deployment.searchCorpusHash, release.search.corpusHash);
  assert.equal(deployment.exampleOverlayFingerprint, release.example.overlayFingerprint);
  const cf = await cloudflareClient(release.config); assert.equal(await cf.version(), deployment.versionId);
  assert.equal(await cf.workerHash(), release.manifest.workerSha256, 'Production compiled Worker differs.');
  const settings = await cf.api('/settings'); assert.deepEqual(bindingFingerprints(settings), deployment.bindings);
  assert.equal(fingerprint(effectiveSettings(settings)), deployment.settingsFingerprint);
  const checks = [];
  const get = route => fetch(PRODUCTION + route, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
  async function exact(route, relative) {
    assert(release.hashes[relative], 'Missing frozen check asset: ' + relative);
    const response = await get(route); assert.equal(response.status, 200, route);
    const bytes = Buffer.from(await response.arrayBuffer()); assert.equal(sha(bytes), release.hashes[relative], route + ' differs from frozen bytes');
    checks.push({ route, sha256: sha(bytes), bytes: bytes.length }); return bytes;
  }
  for (const [route, file] of [['/', 'index.html'], ['/compose', 'compose.html'], ['/apps', 'apps.html'], ['/apps/starter-pack', 'apps/starter-pack.html'], ['/from-a-source', 'from-a-source.html'], ['/how-it-works', 'how-it-works.html'], ['/account', 'account.html'], ['/sign-in', 'sign-in.html'], ['/sign-up', 'sign-up.html'], ['/support', 'support.html'], ['/privacy', 'privacy.html'], ['/data/blocks.json', 'data/blocks.json'], ['/analytics.js', 'analytics.js'], ['/sitemap.xml', 'sitemap.xml']]) await exact(route, file);
  for (const file of [...release.baseline.requiredNewAssets, release.baseline.requiredGeneratedAsset]) {
    if (file !== 'connect-mcp.html') { await exact(assetRoute(file), file); continue; }
    // The accepted worker validates OAuth parameters before serving this asset.
    // Bare-route rejection is public evidence; valid-context HTML bytes belong
    // to the separate MCP-owner canary, not this anonymous UI check.
    for (const route of ['/connect-mcp', '/connect-mcp.html']) {
      const response = await get(route); assert.equal(response.status, 400, route + ' must reject missing authorization parameters');
      const body = await response.json(); assert.deepEqual(body, { error: 'invalid_request', error_description: 'Invalid client_id.' });
      const headers = Object.fromEntries(['content-type', 'cache-control', 'vary', 'x-robots-tag', 'x-content-type-options'].map(name => [name, response.headers.get(name)]));
      assert.equal(headers['content-type'], 'application/json'); assert.equal(headers['cache-control'], 'private, no-store');
      assert.equal(headers.vary, 'Authorization, Origin'); assert.equal(headers['x-robots-tag'], 'noindex, nofollow'); assert.equal(headers['x-content-type-options'], 'nosniff');
      checks.push({ route, scope: 'invalid-request-guard', status: 400, body, headers, frozenArtifactSha256: release.hashes[file], frozenArtifactVerifiedOffline: true, liveConsentHtmlBytes: 'not-fetched-requires-separate-valid-context-MCP-owner-canary' });
    }
  }
  for (const file of ['metadata/index.json', 'metadata/apps.json', 'metadata/apps/starter-pack.json', 'metadata/compose.json', 'metadata/from-a-source.json']) await exact('/' + file, file);
  const index = await fs.readFile(path.join(release.assets, 'index.html'), 'utf8');
  for (const ref of new Set(index.match(/\/assets\/[^"'\s<>]+\.(?:js|css)/g) ?? [])) await exact(ref, ref.slice(1));
  for (const relative of Object.keys(release.hashes).filter(file => /^sitemap[^/]*\.xml$/.test(file))) if (relative !== 'sitemap.xml') await exact('/' + relative, relative);
  const refinementFiles = [...new Set([...release.search.files, ...release.example.files, ...Object.keys(release.hashes).filter(file => /^assets\/.*\.(?:js|css)$/.test(file))])];
  let refinementNext = 0;
  await Promise.all(Array.from({ length: 4 }, async () => { while (refinementNext < refinementFiles.length) { const relative = refinementFiles[refinementNext++]; await exact(assetRoute(relative), relative); } }));
  const samples = await validatePackageSamples(release), { bySlug, packages } = samples;
  const starterBytes = await exact('/data/starter-blocks.json', 'data/starter-blocks.json'), starters = JSON.parse(starterBytes);
  assert.equal(starters.sourceHash, release.manifest.catalogueSha256, 'Starter cache must identify the exact frozen catalogue.');
  assert.equal(starters.starter, true); assert.equal(starters.blocks.length, 4);
  for (const block of starters.blocks) {
    assert(bySlug[block.slug], 'Starter is absent from the frozen catalogue.');
    const route = '/' + pagePrefix(bySlug[block.slug]) + '/' + block.slug;
    await exact(route, route.slice(1) + '.html');
  }
  for (const [slug, supportFiles] of packages) {
    const block = bySlug[slug]; assert(block, 'Required baseline package is missing: ' + slug);
    const route = '/' + pagePrefix(block) + '/' + slug; await exact(route, route.slice(1) + '.html');
    const archive = 'skills/' + slug + '.zip'; await exact('/' + archive, archive);
    for (const file of supportFiles) await exact('/' + file, file);
  }
  // The app starter ZIP is generated in the browser. Its actual sixteen-file
  // archive is checked in verifyPublicUi; unrelated skill ZIPs are not evidence.
  for (const route of ['/space', '/s/unissued-ui-refinement-check', '/metadata/tools.json']) { const response = await get(route); assert.equal(response.status, 200); assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/); checks.push({ route, noindex: true }); }
  for (const route of ['/account', '/sign-in', '/sign-up']) {
    const response = await get(route); assert.equal(response.status, 200);
    assert.match(await response.text(), /<meta\s+name="robots"\s+content="[^\"]*noindex[^\"]*"/i); checks.push({ route, metaNoindex: true });
  }
  const ai = await (await get('/api/compose')).json(); assert.deepEqual(ai, { enabled: true });
  const auth = await (await get('/api/auth')).json(); assert.equal(auth.configured, true); assert.match(auth.publishableKey, /^pk_live_/);
  for (const route of ['/api/library', '/api/spaces/me', '/api/minds']) { const response = await get(route); assert.equal(response.status, 401, route + ' must refuse anonymous access'); }
  const redirects = (await fs.readFile(path.join(release.assets, '_redirects'), 'utf8')).split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#')).map(line => line.trim().split(/\s+/)).filter(row => row[2] === '301' && !/[*!:]/.test(row[0]));
  assert(redirects.length, 'Original URL redirect map missing.');
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => { while (next < redirects.length) { const [from, to] = redirects[next++]; const response = await get(from); assert.equal(response.status, 301, from); assert.equal(new URL(response.headers.get('location'), PRODUCTION).href, new URL(to, PRODUCTION).href, from); checks.push({ route: from, redirect: to, status: 301 }); } }));
  const growth = await get('/traction?source=ui-refinement-release'); assert.equal(growth.status, 301); assert.equal(new URL(growth.headers.get('location'), PRODUCTION).href, PRODUCTION + '/tools/growth-channel-planner?source=ui-refinement-release');
  const exampleRedirect = await get('/apps/mercatura-ads?source=ui-refinement-release'); assert.equal(exampleRedirect.status, 301); assert.equal(new URL(exampleRedirect.headers.get('location'), PRODUCTION).href, PRODUCTION + '/apps?source=ui-refinement-release');
  const ui = await verifyPublicUi(release, output);
  assert.equal(await cf.version(), deployment.versionId, 'Another deployment became active during checks.');
  assert.deepEqual(bindingFingerprints(await cf.api('/settings')), deployment.bindings, 'Production settings changed during checks.');
  assert.equal(fingerprint(effectiveSettings(await cf.api('/settings'))), deployment.settingsFingerprint);
  const report = { status: 'pass', scope: 'UI-and-byte-preservation', mcpCanaries: { status: 'pending-separate-version-bound-MCP-owner-validation', previousVersionEvidence: 'carried-forward-preservation-only-not-a-new-canary-run', previousValidation: 'reports/2026-10-23-mcp-production-validation.json' }, checkedOn: new Date().toISOString(), environment: 'production', origin: PRODUCTION, versionId: deployment.versionId, previousVersionId: BASELINE_VERSION, manifestSha256: release.manifestSha256, assetFingerprint: release.manifest.assetFingerprint, workerSha256: release.manifest.workerSha256, search: release.search, example: release.example, ui, readOnly: true, providerCalls: 0, databaseWrites: 0, checks };
  await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n');
  // Reconcile only this production entry; independent MCP staging evidence stays intact.
  const liveFile = 'reports/cloudflare-live-release.json', liveBytes = await fs.readFile(liveFile), live = JSON.parse(liveBytes);
  assert.equal(live.production.versionId, deployment.versionId);
  assert.equal(fingerprint(live.staging), deployment.stagingFingerprint, 'Independent staging changed; reconcile its current record before updating production metadata.');
  Object.assign(live.production, { verified: false, uiVerified: true, uiVerifiedOn: report.checkedOn, uiVerificationReport: path.resolve(output), status: 'ui-verified-awaiting-MCP-canaries' });
  assert.equal(sha(await fs.readFile(liveFile)), sha(liveBytes), 'Live release metadata changed during verification.');
  await fs.writeFile(liveFile, JSON.stringify(live, null, 2) + '\n');
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = argumentsOf(process.argv.slice(2), ['--manifest', '--verified-content', '--deployment', '--report']);
  assert(args['--verified-content'] && args['--manifest'] && args['--deployment'] && args['--report'], 'Required: --manifest FILE --verified-content --deployment FILE --report FILE');
  const release = await validateRelease(args['--manifest']);
  const report = await checkLive(release, args['--deployment'], args['--report']);
  console.log(JSON.stringify({ status: report.status, versionId: report.versionId, checks: report.checks.length, report: args['--report'] }));
}
