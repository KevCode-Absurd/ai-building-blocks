// A complete content/frontend rebuild into a new immutable release directory.
// Keeps the reviewed Worker bundle byte-identical; catalogue exports may change.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
const root = path.resolve(process.argv[2] || '');
const reuse = process.argv[3] ? path.resolve(process.argv[3]) : null;
const parent = path.resolve('site/.wrangler/releases');
assert(root.startsWith(parent + path.sep) && path.basename(root).startsWith('release-2026-10-22'));
await assert.rejects(fs.stat(root), { code: 'ENOENT' });
const previous = JSON.parse(await fs.readFile('reports/cloudflare-frozen-release.json', 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const coreHash = 'ae4a19edceea4dde9a00cab55f14032ce5c62ddfef46ee6d2d719dc0cc8b1207';
assert.equal(sha(await fs.readFile('site/src/lib/composer-core.ts')), coreHash);
assert.equal(sha(await fs.readFile(previous.worker)), previous.workerSha256);
await fs.mkdir(path.join(root, 'worker'), { recursive: true });
await fs.copyFile(previous.worker, path.join(root, 'worker/worker.js'));
await fs.copyFile(previous.worker + '.map', path.join(root, 'worker/worker.js.map'));
async function run(args, env = {}) {
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: path.resolve('site'), windowsHide: true, stdio: 'inherit', env: { ...process.env, VITE_CLERK_PUBLISHABLE_KEY: '', ...env } });
    child.on('error', reject); child.on('exit', resolve);
  });
  assert.equal(code, 0, 'Full frozen build failed: ' + args[0]);
}
if (reuse) {
  assert(reuse.startsWith(parent + path.sep));
  for (const file of ['data/blocks.json', 'mini-tools/tools.json']) assert.equal(sha(await fs.readFile('site/public/' + file)), sha(await fs.readFile(path.join(reuse, file))), 'Generated content changed; run the full index build.');
} else for (const script of ['scripts/build-index.mjs', 'scripts/build-ai-tools.mjs', '../tools/build-mini-tool.mjs', '../tools/check-masking.mjs', 'scripts/build-icons.mjs']) await run([script]);
await run(['node_modules/typescript/bin/tsc', '-b']);
const assets = path.join(root, 'assets');
await run(['node_modules/vite/bin/vite.js', 'build', '--outDir', assets]);
await run(['scripts/prerender.mjs'], { PRERENDER_DIST: assets });
assert.equal(sha(await fs.readFile('site/src/lib/composer-core.ts')), coreHash);
console.log(JSON.stringify({ root, assets, workerSha256: previous.workerSha256, rebuiltContent: !reuse, generatedContentSource: reuse }));
