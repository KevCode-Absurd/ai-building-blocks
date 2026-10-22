// Rebuild only frontend/prerendered HTML directly into a fresh immutable release.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
const root = path.resolve(process.argv[2] || '');
const allowed = [path.resolve('site/.wrangler/releases'), path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/22/01a161bf-0b97-7cf2-97f3-74eb6d30d1e4')];
assert(allowed.some(parent => root.startsWith(parent + path.sep)) && path.basename(root).startsWith('release-2026-10-22'));
const previous = JSON.parse(await fs.readFile('reports/cloudflare-frozen-release.json', 'utf8'));
const assets = path.join(root, 'assets');
await assert.rejects(fs.stat(assets), { code: 'ENOENT' });
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const expectedCore = 'ae4a19edceea4dde9a00cab55f14032ce5c62ddfef46ee6d2d719dc0cc8b1207';
assert.equal(sha(await fs.readFile('site/src/lib/composer-core.ts')), expectedCore);
assert.equal(sha(await fs.readFile(previous.worker)), previous.workerSha256);
assert.equal(sha(await fs.readFile('site/public/data/blocks.json')), previous.criticalAssets['data/blocks.json']);
await fs.mkdir(path.join(root, 'worker'), { recursive: true });
await fs.copyFile(previous.worker, path.join(root, 'worker/worker.js'));
await fs.copyFile(previous.worker + '.map', path.join(root, 'worker/worker.js.map'));
async function run(args, env = {}) {
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: path.resolve('site'), windowsHide: true, stdio: 'inherit', env: { ...process.env, VITE_CLERK_PUBLISHABLE_KEY: '', ...env } });
    child.on('error', reject); child.on('exit', resolve);
  });
  assert.equal(code, 0, 'Frozen frontend build failed.');
}
await run(['node_modules/vite/bin/vite.js', 'build', '--outDir', assets, '--emptyOutDir']);
await run(['scripts/prerender.mjs'], { PRERENDER_DIST: assets });
assert.equal(sha(await fs.readFile('site/src/lib/composer-core.ts')), expectedCore, 'Source changed during build.');
for (const [file, hash] of Object.entries(previous.criticalAssets)) {
  if (file === 'data/blocks.json' || file.endsWith('.zip')) assert.equal(sha(await fs.readFile(path.join(assets, file))), hash, 'Content package changed: ' + file);
}
console.log(JSON.stringify({ root, assets, sourceSha256: expectedCore, workerSha256: previous.workerSha256, catalogueAndFourPacksUnchanged: true }));
