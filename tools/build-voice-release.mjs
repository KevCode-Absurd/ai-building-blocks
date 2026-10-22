// Rebuild both server and browser code, then freeze the exact deployment input.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
const root = path.resolve(process.argv[2] || '');
const reuse = process.argv[3] ? path.resolve(process.argv[3]) : null;
assert(root.startsWith(path.resolve('site/.wrangler/releases') + path.sep));
await assert.rejects(fs.stat(root), { code: 'ENOENT' });
await fs.mkdir(root, { recursive: true });
async function run(args, env = {}) {
  const code = await new Promise((resolve, reject) => { const child = spawn(process.execPath, args, { cwd: path.resolve('site'), windowsHide: true, stdio: 'inherit', env: { ...process.env, VITE_CLERK_PUBLISHABLE_KEY: '', ...env } }); child.on('error', reject); child.on('exit', resolve); });
  assert.equal(code, 0, args.join(' '));
}
if (reuse) {
  assert(reuse.startsWith(path.resolve('site/.wrangler/releases') + path.sep));
  const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  for (const file of ['data/blocks.json', 'mini-tools/tools.json', 'sitemap.xml']) assert.equal(sha(await fs.readFile('site/public/' + file)), sha(await fs.readFile(path.join(reuse, file))), 'Generated content changed; run a full index build.');
} else for (const script of ['scripts/build-index.mjs', 'scripts/build-ai-tools.mjs', '../tools/build-mini-tool.mjs', '../tools/check-masking.mjs', 'scripts/build-icons.mjs']) await run([script]);
await run(['node_modules/typescript/bin/tsc', '-b']);
await run(['node_modules/vite/bin/vite.js', 'build', '--outDir', path.join(root, 'assets')]);
await run(['scripts/prerender.mjs'], { PRERENDER_DIST: path.join(root, 'assets') });
await run(['node_modules/wrangler/bin/wrangler.js', 'deploy', '--env=', '--dry-run', '--config', 'wrangler.example.jsonc', '--outdir', path.join(root, 'worker')]);
console.log(JSON.stringify({ root, status: 'built' }));
