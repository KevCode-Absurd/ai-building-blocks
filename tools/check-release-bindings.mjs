// Read-only Cloudflare release/binding fingerprint check. Never prints secrets.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const [mode, environment] = process.argv.slice(2);
assert(['before', 'after'].includes(mode)); assert(['staging', 'production'].includes(environment));
const script = 'ai-building-blocks' + (environment === 'staging' ? '-staging' : '');
const privateConfig = await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8');
const token = privateConfig.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1]; assert(token);
async function api(route) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/31c814d2c58a11163d3187f505f0b9c5/workers/scripts/${script}${route}`, { headers: { authorization: 'Bearer ' + token }, signal: AbortSignal.timeout(30000) });
  const data = await response.json(); assert(response.ok && data.success, 'Cloudflare read failed ' + response.status); return data.result;
}
const settings = await api('/settings'), deployments = await api('/deployments');
const canonical = v => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
const fingerprint = v => crypto.createHash('sha256').update(JSON.stringify(canonical(v))).digest('hex');
const bindings = settings.bindings.map(b => ({ name: b.name, fingerprint: fingerprint(b) })).sort((a, b) => a.name.localeCompare(b.name));
const deployment = (deployments.deployments || deployments)[0];
assert.equal(deployment.versions.length, 1); assert.equal(deployment.versions[0].percentage, 100);
const report = { checkedOn: new Date().toISOString(), environment, versionId: deployment.versions[0].version_id, bindingCount: bindings.length, bindings, AIEnabled: settings.bindings.find(b => b.name === 'WORKFLOW_COMPOSER_ENABLED')?.text, dailyCapUSD: settings.bindings.find(b => b.name === 'WORKFLOW_DAILY_CAP_USD')?.text };
assert.equal(report.AIEnabled, environment === 'production' ? 'true' : 'false');
assert.equal(report.dailyCapUSD, environment === 'production' ? '10' : '2');
const snapshot = `site/.wrangler/r10-${environment}-bindings-before.json`;
if (mode === 'before') await fs.writeFile(snapshot, JSON.stringify(report, null, 2));
else {
  const before = JSON.parse(await fs.readFile(snapshot, 'utf8'));
  assert.deepEqual(bindings, before.bindings, 'Binding configuration changed during deployment');
  assert.notEqual(report.versionId, before.versionId);
  report.previousVersion = before.versionId; report.bindingsPreserved = true;
  await fs.writeFile(`reports/cloudflare-r10-${environment}-bindings.json`, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ mode, environment, versionId: report.versionId, bindingCount: bindings.length, AIEnabled: report.AIEnabled, dailyCapUSD: report.dailyCapUSD, ...(mode === 'after' ? { bindingsPreserved: true } : {}) }));
