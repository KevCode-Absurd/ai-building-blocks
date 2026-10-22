import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import preact from '@preact/preset-vite';
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const root = path.resolve(repo, process.argv[2]), previous = path.resolve(repo, process.argv[3]);
assert(root.startsWith(path.join(repo, 'site/.wrangler/releases') + path.sep));
await assert.rejects(fs.stat(root), { code: 'ENOENT' });
const source = path.join(root, 'source'), assets = path.join(root, 'assets'); await fs.mkdir(source, { recursive: true });
const git = args => execFileSync('git', ['-c', 'core.longpaths=true', ...args], { cwd: repo, windowsHide: true, maxBuffer: 32 * 1024 * 1024 });
const commit = git(['rev-parse', 'HEAD']).toString().trim();
const archive = path.join(root, 'source.tar');
await fs.writeFile(archive, git(['archive', 'HEAD', 'site/src', 'site/functions', 'site/index.html', 'site/tsconfig.json', 'site/wrangler.example.jsonc', 'tools/lib', 'mini-tools']));
execFileSync('tar', ['-xf', archive, '-C', source], { windowsHide: true });
const overlays = ['site/src/lib/composer-core.ts', 'site/src/lib/composer-semantic.ts', 'site/src/lib/composer-models.ts', 'site/src/server/composer.ts', 'site/src/server/transcription.ts', 'site/src/VoiceRequest.tsx'];
for (const file of overlays) await fs.copyFile(path.join(repo, file), path.join(source, file));
const css = await fs.readFile(path.join(repo, 'site/src/compose.css'), 'utf8');
const iconCSS = css.match(/^\.compose-voice-controls \.btn\.compose-voice-icon[^\n]*\n\.compose-voice-icon[^\n]*\n\.compose-voice-spinner[^\n]*\n@keyframes compose-voice-spin[^\n]*\n@media \(prefers-reduced-motion: reduce\)[^\n]*/m)?.[0];
assert(iconCSS); await fs.appendFile(path.join(source, 'site/src/compose.css'), '\n' + iconCSS + '\n');
try { execFileSync('robocopy', [path.join(previous, 'assets'), assets, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP'], { windowsHide: true, stdio: 'ignore' }); } catch (error) { if (error.status > 7 || error.status === null) throw error; }
await build({ configFile: false, root: path.join(source, 'site'), publicDir: false, plugins: [preact()], build: { outDir: path.join(root, 'browser'), target: 'es2020', modulePreload: { polyfill: false }, cssCodeSplit: true, emptyOutDir: true } });
const refs = html => [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\/assets\/[^" ]+)"[^>]*>/g)].map(match => match[1]);
const oldRefs = refs(await fs.readFile(path.join(previous, 'assets/index.html'), 'utf8')), newRefs = refs(await fs.readFile(path.join(root, 'browser/index.html'), 'utf8'));
assert.equal(oldRefs.length, 2); assert.equal(newRefs.length, 2);
await fs.cp(path.join(root, 'browser/assets'), path.join(assets, 'assets'), { recursive: true });
let changedHTML = 0;
for (const entry of await fs.readdir(assets, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
  const file = path.join(entry.parentPath, entry.name), original = await fs.readFile(file, 'utf8'); let updated = original;
  for (let i = 0; i < oldRefs.length; i++) updated = updated.replaceAll(oldRefs[i], newRefs[i]);
  if (updated !== original) { await fs.writeFile(file, updated); changedHTML++; }
}
const short = path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/22/01a163a5-f288-7b63-a7e1-d0230f42b9af');
const dry = JSON.parse(await fs.readFile(path.join(source, 'site/wrangler.example.jsonc'), 'utf8'));
dry.main = path.join(source, 'site/src/worker.ts'); delete dry.assets; delete dry.env;
const configPath = path.join(short, 'composer-build.jsonc'); await fs.writeFile(configPath, JSON.stringify(dry));
async function run(args) {
  const code = await new Promise((resolve, reject) => { const child = spawn(process.execPath, args, { cwd: path.join(repo, 'site'), windowsHide: true, stdio: 'inherit', env: { ...process.env, WRANGLER_LOG_PATH: path.join(root, 'build.log') } }); child.on('error', reject); child.on('exit', resolve); }); assert.equal(code, 0);
}
await run(['node_modules/typescript/bin/tsc', '-p', path.join(source, 'site/tsconfig.json')]);
await run(['node_modules/wrangler/bin/wrangler.js', 'deploy', '--env=', '--dry-run', '--config', configPath, '--outdir', path.join(root, 'worker')]);
for (const environment of ['staging', 'production']) {
  const config = JSON.parse(await fs.readFile(path.join(previous, `wrangler.${environment}.jsonc`), 'utf8'));
  config.main = path.join(root, 'worker/worker.js'); config.assets.directory = assets; config.no_bundle = true;
  for (const e of Object.values(config.env || {})) if (e.assets) e.assets.directory = assets;
  await fs.writeFile(path.join(root, `wrangler.${environment}.jsonc`), JSON.stringify(config, null, 2));
}
const sha = async file => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
const report = { createdAt: new Date().toISOString(), sourceCommit: commit, previous, release: root, assets, changedHTML, oldRefs, newRefs, workerSha256: await sha(path.join(root, 'worker/worker.js')), catalogueSha256: await sha(path.join(assets, 'data/blocks.json')), overlays: await Promise.all(overlays.map(async file => ({ file, sha256: await sha(path.join(source, file)) }))), scope: 'Semantic request interpretation, balanced multi-goal retrieval and accessible microphone icon using existing OpenAI Whisper endpoint.' };
await fs.writeFile(path.join(root, 'release-manifest.json'), JSON.stringify(report, null, 2));
await fs.writeFile(path.join(repo, 'reports/composer-semantic-release.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify(report));
