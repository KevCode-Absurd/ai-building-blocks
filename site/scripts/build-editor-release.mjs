// UI-only release: retain the latest verified catalogue, HTML content and Worker.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { build } from 'vite';
import preact from '@preact/preset-vite';
const repo = path.resolve(import.meta.dirname, '../..');
const root = path.resolve(repo, process.argv[2] ?? '');
const version = process.argv[3];
assert(root.startsWith(path.join(repo, 'site/.wrangler/releases') + path.sep));
await assert.rejects(fs.stat(root), { code: 'ENOENT' });
const live = JSON.parse(await fs.readFile(path.join(repo, 'reports/cloudflare-live-release.json'), 'utf8'));
assert.equal(live.production.versionId, version, 'The verified production baseline changed.');
const previous = path.resolve(live.production.assetReleaseRoot ?? live.production.releaseRoot);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = args => execFileSync('git', ['-c', 'core.longpaths=true', ...args], { cwd: repo, windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
const overlays = ['site/src/Builder.tsx', 'site/src/SkillAdd.tsx', 'site/src/skill-add.css', 'site/src/lib/insert-flow-skill.ts', 'site/src/ExecutionPrompt.tsx', 'site/src/space/SpacePage.tsx', 'site/src/lib/space-workflow-export.ts', 'site/src/MindPack.tsx', 'site/src/lib/handoff.ts'];
const dirty = git(['status', '--porcelain', '--untracked-files=all', '--', 'site/src']).toString().trimEnd().split(/\r?\n/).filter(Boolean).map(line => line.slice(3).replaceAll('\\', '/'));
for (const file of dirty) assert(overlays.includes(file), 'Unreviewed app change: ' + file);
const sourceCommit = git(['rev-parse', 'HEAD']).toString().trim();
const source = path.join(root, 'source'), assets = path.join(root, 'assets');
await fs.mkdir(source, { recursive: true });
const archive = path.join(root, 'source.tar');
await fs.writeFile(archive, git(['archive', sourceCommit, 'site/src', 'site/index.html', 'site/tsconfig.json', 'mini-tools', 'tools/lib']));
execFileSync('tar', ['-xf', archive, '-C', source], { windowsHide: true });
const sourceHashes = {};
for (const file of overlays) {
  await fs.mkdir(path.dirname(path.join(source, file)), { recursive: true });
  const bytes = await fs.readFile(path.join(repo, file)); sourceHashes[file] = sha(bytes);
  await fs.writeFile(path.join(source, file), bytes);
}
await fs.cp(path.join(previous, 'assets'), assets, { recursive: true });
await build({ configFile: false, root: path.join(source, 'site'), publicDir: false, plugins: [preact()], build: { outDir: path.join(root, 'browser'), target: 'es2020', modulePreload: { polyfill: false }, cssCodeSplit: true, emptyOutDir: true } });
const refs = html => [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\/assets\/[^" ]+)"[^>]*>/g)].map(m => m[1]);
const oldRefs = refs(await fs.readFile(path.join(previous, 'assets/index.html'), 'utf8'));
const newRefs = refs(await fs.readFile(path.join(root, 'browser/index.html'), 'utf8'));
assert.equal(oldRefs.length, 2); assert.equal(newRefs.length, 2);
await fs.cp(path.join(root, 'browser/assets'), path.join(assets, 'assets'), { recursive: true });
let htmlFiles = 0;
const assetEntries = await fs.readdir(assets, { recursive: true, withFileTypes: true });
for (const entry of assetEntries) {
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
  const file = path.join(entry.parentPath, entry.name), old = await fs.readFile(file, 'utf8');
  let updated = old;
  for (let i = 0; i < oldRefs.length; i++) updated = updated.replaceAll(oldRefs[i], newRefs[i]);
  if (updated !== old) { await fs.writeFile(file, updated); htmlFiles++; }
}
await fs.mkdir(path.join(root, 'worker'), { recursive: true });
const previousWorker = path.join(path.resolve(live.production.releaseRoot), 'worker/worker.js');
assert.equal(sha(await fs.readFile(previousWorker)), live.production.workerSha256);
await fs.copyFile(previousWorker, path.join(root, 'worker/worker.js'));
for (const environment of ['staging', 'production']) {
  let config = JSON.parse(await fs.readFile(path.join(previous, `wrangler.${environment}.jsonc`), 'utf8'));
  if (environment === 'staging' && config.env?.staging) config = { ...config, ...config.env.staging };
  delete config.env; config.main = path.join(root, 'worker/worker.js'); config.assets.directory = assets; config.no_bundle = true;
  await fs.writeFile(path.join(root, `wrangler.${environment}.jsonc`), JSON.stringify(config, null, 2) + '\n');
}
for (const file of ['data/blocks.json', 'sitemap-skills.xml', 'sitemap-workflows.xml', 'sitemap-agents.xml']) assert.equal(sha(await fs.readFile(path.join(assets, file))), sha(await fs.readFile(path.join(previous, 'assets', file))), 'Catalogue changed: ' + file);
for (const [file, hash] of Object.entries(sourceHashes)) assert.equal(sha(await fs.readFile(path.join(repo, file))), hash, 'Source changed during build: ' + file);
const report = { createdAt: new Date().toISOString(), root, assets, files: assetEntries.filter(e => e.isFile()).length, previous, previousVersionId: version, sourceCommit, sourceHashes, oldRefs, newRefs, htmlFiles, workerUnchanged: true, workerSha256: live.production.workerSha256, catalogueSha256: sha(await fs.readFile(path.join(assets, 'data/blocks.json'))), scope: 'Searchable Add skill insertion and verified Space workflow exports. Latest verified content and backend retained.' };
await fs.writeFile(path.join(root, 'release-manifest.json'), JSON.stringify(report, null, 2) + '\n');
await fs.writeFile(path.join(repo, 'reports/2026-10-22-workflow-editor-release.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
