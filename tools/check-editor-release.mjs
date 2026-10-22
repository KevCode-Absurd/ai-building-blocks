import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
const [environment, input, profile = 'workflow-editor'] = process.argv.slice(2);
assert(['workflow-editor', 'audience'].includes(profile));
assert(['staging', 'production'].includes(environment));
const releaseRoot = path.resolve(input ?? ''), assets = path.join(releaseRoot, 'assets');
assert(releaseRoot.startsWith(path.resolve('site/.wrangler/releases') + path.sep));
async function run(script) {
  const code = await new Promise((resolve, reject) => { const child = spawn(process.execPath, [script, environment, assets], { windowsHide: true, stdio: 'inherit' }); child.on('error', reject); child.on('exit', resolve); }); assert.equal(code, 0);
}
await run('tools/check-frozen-release-live.mjs');
await run('tools/check-account-minds-release.mjs');
const general = JSON.parse(await fs.readFile(`reports/cloudflare-r10-${environment}-frozen-checks.json`, 'utf8'));
const account = JSON.parse(await fs.readFile(`reports/2026-10-22-account-minds-${environment}-public.json`, 'utf8'));
const origin = environment === 'production' ? 'https://useaiblocks.com' : 'https://ai-building-blocks-staging.kevinmark7498.workers.dev';
const preview = environment === 'staging' ? JSON.parse(await fs.readFile('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN : null;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const chunks = (await fs.readdir(path.join(releaseRoot, 'browser/assets'))).filter(file => /\.(?:js|css)$/.test(file));
for (let at = 0; at < chunks.length; at += 4) await Promise.all(chunks.slice(at, at + 4).map(async file => {
  const response = await fetch(origin + '/assets/' + file, { headers: preview ? { 'x-preview-access': preview } : {}, signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, file); assert.equal(sha(Buffer.from(await response.arrayBuffer())), sha(await fs.readFile(path.join(assets, 'assets', file))), 'Deployed browser chunk differs: ' + file);
}));
const report = { checkedAt: new Date().toISOString(), status: 'pass', environment, releaseRoot, catalogueSha256: sha(await fs.readFile(path.join(assets, 'data/blocks.json'))), passed: general.passed + account.checks.length + chunks.length, exactBrowserChunks: chunks.length, providerCalls: 0, checks: [...general.checks, ...account.checks, 'Every new JavaScript and CSS chunk matches the frozen build'] };
await fs.writeFile(`reports/2026-10-22-${profile}-${environment}.json`, JSON.stringify(report, null, 2) + '\n'); console.log(JSON.stringify({ environment, status: report.status, passed: report.passed }));
