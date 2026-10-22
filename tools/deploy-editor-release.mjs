// Publish only the tested immutable UI delta; preserve the current backend and every binding.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
const [environment, input, expectedVersion] = process.argv.slice(2);
assert(['staging', 'production'].includes(environment)); assert(expectedVersion);
const root = path.resolve(input ?? ''); assert(root.startsWith(path.resolve('site/.wrangler/releases') + path.sep));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'release-manifest.json'), 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(manifest.workerUnchanged, true);
const browser = JSON.parse(await fs.readFile('reports/2026-10-22-workflow-editor-built-browser.json', 'utf8'));
assert(browser.stats.expected >= 46 && browser.stats.unexpected === 0 && browser.stats.flaky === 0 && browser.stats.skipped === 0, 'Final built browser checks must pass.');
assert.equal(browser.config.metadata.editorReleaseRoot, root, 'Browser checks used a different release.');
assert.equal(sha(await fs.readFile(path.join(root, 'worker/worker.js'))), manifest.workerSha256);
assert.equal(sha(await fs.readFile(path.join(root, 'assets/data/blocks.json'))), manifest.catalogueSha256);
assert.equal(JSON.parse(await fs.readFile(path.join(root, 'frozen-assets-manifest.json'), 'utf8')).workerSha256, manifest.workerSha256);
for (const [file, hash] of Object.entries(manifest.sourceHashes)) {
  assert.equal(sha(await fs.readFile(file)), hash, 'Source changed after verification: ' + file);
  if (environment === 'production') assert.equal(sha(execFileSync('git', ['show', 'HEAD:' + file], { windowsHide: true, maxBuffer: 8 * 1024 * 1024 })), hash, 'Tested source must be committed: ' + file);
}
const live = JSON.parse(await fs.readFile('reports/cloudflare-live-release.json', 'utf8')); assert.equal(live[environment].versionId, expectedVersion);
assert.equal(manifest.workerSha256, live.production.workerSha256);
if (environment === 'production') {
  assert.equal(manifest.previousVersionId, expectedVersion);
  const staging = JSON.parse(await fs.readFile('reports/2026-10-22-workflow-editor-staging.json', 'utf8'));
  assert.equal(staging.status, 'pass'); assert.equal(staging.releaseRoot, root);
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', windowsHide: true }).trim();
  const remote = execFileSync('git', ['ls-remote', 'origin', 'refs/heads/main'], { encoding: 'utf8', windowsHide: true }).trim().split(/\s+/)[0];
  assert.equal(remote, commit, 'Push the reviewed source before production deployment.');
}
const config = JSON.parse(await fs.readFile(path.join(root, `wrangler.${environment}.jsonc`), 'utf8'));
const script = environment === 'production' ? 'ai-building-blocks' : 'ai-building-blocks-staging'; assert.equal(config.name, script);
const credential = await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8');
const token = credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1]; assert(token, 'Wrangler authorization unavailable.');
async function api(route) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.account_id}/workers/scripts/${script}${route}`, { headers: { authorization: 'Bearer ' + token }, signal: AbortSignal.timeout(30000) });
  const data = await response.json(); assert(response.ok && data.success, 'Cloudflare read failed: ' + response.status); return data.result;
}
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const bindings = settings => settings.bindings.map(b => ({ name: b.name, fingerprint: sha(JSON.stringify(canonical(b))) })).sort((a, b) => a.name.localeCompare(b.name));
const currentVersion = async () => { const data = await api('/deployments'), versions = (data.deployments ?? data)[0].versions; assert.equal(versions.length, 1); assert.equal(versions[0].percentage, 100); return versions[0].version_id; };
assert.equal(await currentVersion(), expectedVersion, 'Another release is live; stop and review.');
const before = bindings(await api('/settings'));
for (const name of ['ASSETS', 'COMMENTS', 'SPACES', 'COMPOSER', 'CLERK_SECRET_KEY', 'TURNSTILE_SECRET_KEY']) assert(before.some(b => b.name === name));
const shortFolder = path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/22/01a16276-6e77-7c51-bd36-a283b29f6c47');
await fs.mkdir(shortFolder, { recursive: true });
const shortConfig = path.join(shortFolder, `editor-${environment}.jsonc`); await fs.writeFile(shortConfig, JSON.stringify(config, null, 2));
const code = await new Promise((resolve, reject) => { const child = spawn(process.execPath, ['tools/wrangler-frozen.mjs', 'deploy', '--env=', '--keep-vars', '--config', shortConfig], { cwd: path.resolve('.'), windowsHide: true, stdio: 'inherit', env: { ...process.env, CF_FROZEN_ASSET_MANIFEST: path.join(root, 'frozen-assets-manifest.json'), WRANGLER_LOG_PATH: path.join(root, `${environment}-deploy.log`) } }); child.on('error', reject); child.on('exit', resolve); });
const versionId = await currentVersion(); assert.deepEqual(bindings(await api('/settings')), before, 'Live bindings changed.'); assert.notEqual(versionId, expectedVersion, 'Deployment did not activate; CLI exit ' + code);
const report = { deployedOn: new Date().toISOString(), environment, previousVersionId: expectedVersion, versionId, releaseRoot: root, assetReleaseRoot: root, workerSha256: manifest.workerSha256, catalogueSha256: manifest.catalogueSha256, bindingsPreserved: before.length, cliExitCode: code, status: 'deployed-awaiting-verification' };
await fs.writeFile(`reports/2026-10-22-workflow-editor-${environment}-deployment.json`, JSON.stringify(report, null, 2) + '\n');
Object.assign(live[environment], report); live.checkedOn = report.deployedOn;
await fs.writeFile('reports/cloudflare-live-release.json', JSON.stringify(live, null, 2) + '\n'); console.log(JSON.stringify(report));
