// Run last, after ordinary live browser/API flows. Never use a production URL.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
const base = stagingTarget();
assert(process.env.CF_STAGING_VERSION, 'Record the confirmed staging version.');
const token = JSON.parse(fs.readFileSync('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN;
assert(typeof token === 'string' && token.length >= 32, 'Private staging access is required.');
const statuses = [];
const report = { checkedOn: new Date().toISOString(), environment: base, deployedVersion: process.env.CF_STAGING_VERSION, productionTouched: false, providerCalls: 0, status: 'running', statuses };
try {
  const metadata = await fetch(new URL('/api/compose', base), { headers: { 'x-preview-access': token }, redirect: 'manual', signal: AbortSignal.timeout(30_000) });
  assert.equal(metadata.status, 200); assert.equal((await metadata.json()).enabled, false);
  let limited = false;
  for (let attempt = 0; attempt < 8; attempt++) {
    const response = await fetch(new URL('/api/compose', base), { method: 'POST', headers: { 'x-preview-access': token, 'content-type': 'application/json' }, body: JSON.stringify({ goal: 'Rejected staging rate-limit probe', context: '' }), redirect: 'manual', signal: AbortSignal.timeout(30_000) });
    statuses.push(response.status);
    assert([403, 429].includes(response.status), 'The invalid-token probe must not reach the provider.');
    await response.arrayBuffer();
    if (response.status === 429) { assert(Number(response.headers.get('retry-after')) > 0); limited = true; break; }
  }
  assert(limited, 'The live AI burst limiter must reject the bounded invalid-token probe.');
  report.status = 'pass';
} catch (error) {
  report.status = 'fail'; report.failure = String(error.message).replaceAll(token, '[redacted]'); process.exitCode = 1;
} finally {
  fs.writeFileSync('reports/cloudflare-staging-rate-check.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, statuses, productionTouched: false, providerCalls: 0, ...(report.failure ? { failure: report.failure } : {}) }));
}
