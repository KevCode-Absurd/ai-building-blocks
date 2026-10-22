import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
const root = path.resolve(process.argv[2]);
assert(root.startsWith(path.resolve('site/.wrangler/releases') + path.sep));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'release-manifest.json'), 'utf8'));
assert.equal(manifest.htmlParityVerified, true);
assert.equal(JSON.parse(await fs.readFile('reports/workflow-matching-local-browser.json', 'utf8')).status, 'pass');
const baseline = JSON.parse(await fs.readFile('site/.wrangler/workflow-matching-production-bindings-before.json', 'utf8'));
const credential = await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8');
const token = credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1]; assert(token);
async function api(route) {
  const response = await fetch('https://api.cloudflare.com/client/v4/accounts/31c814d2c58a11163d3187f505f0b9c5/workers/scripts/ai-building-blocks' + route, { headers: { authorization: 'Bearer ' + token }, signal: AbortSignal.timeout(30000) });
  const data = await response.json(); assert(response.ok && data.success, 'Cloudflare check failed: ' + response.status); return data.result;
}
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const bindings = settings => settings.bindings.map(binding => ({ name: binding.name, fingerprint: sha(JSON.stringify(canonical(binding))) })).sort((a, b) => a.name.localeCompare(b.name));
const currentVersion = async () => { const data = await api('/deployments'); const versions = (data.deployments || data)[0].versions; assert.equal(versions.length, 1); assert.equal(versions[0].percentage, 100); return versions[0].version_id; };
assert.equal(await currentVersion(), baseline.versionId, 'Another release went live; review it before proceeding.');
assert.deepEqual(bindings(await api('/settings')), baseline.bindings);
const config = JSON.parse(await fs.readFile(path.join(root, 'wrangler.production.jsonc'), 'utf8'));
const shortConfig = path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/22/01a163a5-f288-7b63-a7e1-d0230f42b9af/workflow-matching-production.jsonc');
await fs.writeFile(shortConfig, JSON.stringify(config, null, 2));
const exitCode = await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'deploy', '--env=', '--keep-vars', '--config', shortConfig], { cwd: path.resolve('site'), windowsHide: true, stdio: 'inherit', env: { ...process.env, WRANGLER_LOG_PATH: path.join(root, 'production-deploy.log') } });
  child.on('error', reject); child.on('exit', resolve);
});
assert.equal(exitCode, 0, 'Deployment did not finish successfully.');
const versionId = await currentVersion(); assert.notEqual(versionId, baseline.versionId);
assert.deepEqual(bindings(await api('/settings')), baseline.bindings, 'Live bindings changed.');
const report = { deployedOn: new Date().toISOString(), status: 'deployed-awaiting-live-browser-verification', origin: 'https://useaiblocks.com', previousVersionId: baseline.versionId, versionId, root, workerSha256: manifest.workerSha256, bindingsPreserved: baseline.bindingCount, AIEnabled: true, dailyCapUSD: '10', catalogueSha256: manifest.catalogueSha256 };
await fs.writeFile('reports/workflow-matching-production-deployment.json', JSON.stringify(report, null, 2));
const live = JSON.parse(await fs.readFile('reports/cloudflare-live-release.json', 'utf8'));
Object.assign(live.production, { ...report, releaseRoot: root, assetReleaseRoot: root }); live.checkedOn = report.deployedOn;
await fs.writeFile('reports/cloudflare-live-release.json', JSON.stringify(live, null, 2));
console.log(JSON.stringify(report));
