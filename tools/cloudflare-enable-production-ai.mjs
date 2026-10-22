// Explicit owner request: free customer generation, global $10/day reservation cap.
// Upload the identical frozen Worker, retain assets and inherit every other binding.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const expected = process.argv[2];
assert.equal(expected, '87a8bdfb-ee9a-4341-9fa0-66214986b3f1');
const release = JSON.parse(await fs.readFile('reports/cloudflare-live-release.json', 'utf8'));
assert.equal(release.production.versionId, expected);
const frozen = JSON.parse(await fs.readFile('reports/cloudflare-frozen-release.json', 'utf8'));
const code = await fs.readFile(path.join(frozen.root, 'worker/worker.js'));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
assert.equal(sha(code), release.production.workerSha256);
const credential = await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8');
const token = credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];
assert(token, 'Wrangler authorization is unavailable.');
async function api(route, init = {}) {
  const response = await fetch('https://api.cloudflare.com/client/v4/accounts/31c814d2c58a11163d3187f505f0b9c5/workers/scripts/ai-building-blocks' + route, {
    ...init, headers: { authorization: 'Bearer ' + token, ...init.headers }, signal: AbortSignal.timeout(60000),
  });
  const data = await response.json();
  assert(response.ok && data.success, 'Cloudflare request failed: ' + response.status);
  return data.result;
}
const currentVersion = async () => {
  const data = await api('/deployments');
  const deployment = (data.deployments || data)[0];
  assert.equal(deployment.versions.length, 1);
  assert.equal(deployment.versions[0].percentage, 100);
  return deployment.versions[0].version_id;
};
assert.equal(await currentVersion(), expected, 'Concurrent production change; stop.');
const before = await api('/settings');
const names = before.bindings.map(binding => binding.name);
for (const name of ['ASSETS', 'COMMENTS', 'SPACES', 'COMPOSER', 'API_READ_LIMITER', 'API_WRITE_LIMITER', 'AI_LIMITER', 'TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY', 'CLERK_SECRET_KEY', 'OPENAI_API_KEY']) assert(names.includes(name), 'Missing required binding: ' + name);
assert.equal(before.bindings.find(b => b.name === 'WORKFLOW_COMPOSER_ENABLED')?.text, 'false');
assert.equal(before.bindings.find(b => b.name === 'WORKFLOW_DAILY_CAP_USD')?.text, '2');
const changed = { WORKFLOW_COMPOSER_ENABLED: 'true', WORKFLOW_DAILY_CAP_USD: '10' };
const bindings = names.map(name => name in changed ? { name, type: 'plain_text', text: changed[name] } : { name, type: 'inherit' });
const form = new FormData();
form.set('metadata', JSON.stringify({ main_module: 'worker.js', keep_assets: true, bindings, compatibility_date: before.compatibility_date, compatibility_flags: before.compatibility_flags, annotations: { 'workers/message': 'Owner-authorized free AI generation with global USD10/day reservation cap; identical R8 code/assets' } }));
form.set('worker.js', new Blob([code], { type: 'application/javascript+module' }), 'worker.js');
await api('?bindings_inherit=strict', { method: 'PUT', body: form });
const after = await api('/settings');
const canonical = v => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
const fingerprint = v => sha(JSON.stringify(canonical(v)) ?? 'null');
assert.equal(fingerprint(after.assets), fingerprint(before.assets));
assert.deepEqual(after.bindings.map(b => b.name).sort(), [...names].sort());
for (const binding of before.bindings) {
  const actual = after.bindings.find(b => b.name === binding.name);
  if (binding.name in changed) assert.equal(actual.text, changed[binding.name]);
  else assert.equal(fingerprint(actual), fingerprint(binding), 'Unexpected binding change: ' + binding.name);
}
const versionId = await currentVersion();
assert.notEqual(versionId, expected);
for (const file of ['site/wrangler.production.jsonc', frozen.configs.production, path.join(frozen.root, 'wrangler.production.live.jsonc')]) {
  const config = JSON.parse(await fs.readFile(file, 'utf8'));
  Object.assign(config.vars, changed);
  await fs.writeFile(file, JSON.stringify(config, null, 2) + '\n');
}
const report = { checkedOn: new Date().toISOString(), status: 'deployed; one authenticated workflow test pending', previousVersion: expected, versionId, workerSha256: sha(code), assetsRetained: true, otherBindingsPreserved: true, publicRoutesChanged: false, aiEnabled: true, dailyCapUSD: 10, customerPriceUSD: 0, budgetWindow: 'UTC day', generationRequestsByThisTool: 0, sourceCodeChanged: false };
await fs.writeFile('reports/cloudflare-production-ai-enable.json', JSON.stringify(report, null, 2) + '\n');
Object.assign(release.production, { previousVersionId: expected, versionId, aiEnabled: true, dailyCapUSD: 10, status: 'public; owner-authorized free AI enabled; authenticated workflow verification pending' });
release.clerk.aiGenerationEnabled = true;
release.checkedOn = report.checkedOn;
await fs.writeFile('reports/cloudflare-live-release.json', JSON.stringify(release, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
