// Fast read-only routing check before real-widget fixture creation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
const base = stagingTarget();
assert(process.env.CF_STAGING_VERSION && process.env.CF_RELEASE_DIST, 'Record the confirmed immutable release.');
const token = JSON.parse(fs.readFileSync('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN;
assert(typeof token === 'string' && token.length >= 32, 'Private staging access is required.');
const report = { checkedOn: new Date().toISOString(), environment: base, deployedVersion: process.env.CF_STAGING_VERSION, status: 'running', productionTouched: false, providerCalls: 0, checks: [] };
async function get(urlPath, method = 'GET') {
  return fetch(new URL(urlPath, base), { method, headers: { 'x-preview-access': token }, redirect: 'manual', signal: AbortSignal.timeout(30_000) });
}
try {
  const catalogue = await get('/data/blocks.json'); assert.equal(catalogue.status, 200);
  const sha = value => crypto.createHash('sha256').update(value).digest('hex');
  assert.equal(sha(Buffer.from(await catalogue.arrayBuffer())), sha(fs.readFileSync(path.join(process.env.CF_RELEASE_DIST, 'data/blocks.json'))));
  report.checks.push('live catalogue matches immutable snapshot');
  const missingTour = await get('/example-app/not-a-screen');
  assert.equal(missingTour.status, 404);
  assert((await missingTour.text()).includes("This screen isn't in the tour"), 'Missing tour URL returned the global404 instead of the saved tour404.');
  report.checks.push('missing saved-tour screen returns its own404 page');
  const missingTool = await get('/tools/not-a-tool'); assert.equal(missingTool.status, 404);
  assert((await missingTool.text()).includes("This page doesn't exist"));
  report.checks.push('unknown tool URL retains real site404');
  for (const method of ['GET', 'HEAD']) {
    const response = await get('/apps/mercatura-ads?source=launch-check', method);
    assert.equal(response.status, 301);
    const location = new URL(response.headers.get('location'), base);
    assert.equal(location.origin, base); assert.equal(location.pathname, '/apps');
    assert.equal(location.search, '?source=launch-check');
    if (method === 'HEAD') assert.equal(await response.text(), '');
  }
  report.checks.push('known legacy Apps GET/HEAD redirect to Apps and preserve queries');
  for (const urlPath of ['/', '/space', '/people', '/s/staging-unissued-link-check']) {
    const response = await get(urlPath); assert.equal(response.status, 200, urlPath); assert(!response.headers.has('location'), 'Internal rewrite must keep its address.');
    await response.arrayBuffer();
  }
  report.checks.push('root, space, people and shared-link rewrites preserve addresses');
  report.status = 'pass';
} catch (error) {
  report.status = 'fail'; report.failure = String(error.message).replaceAll(token, '[redacted]'); process.exitCode = 1;
} finally {
  const reportPath = 'reports/cloudflare-staging-routing-check.json';
  if (fs.existsSync(reportPath)) {
    const previous = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    report.history = [...(previous.history || []), { checkedOn: previous.checkedOn, deployedVersion: previous.deployedVersion, status: previous.status, failure: previous.failure }];
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
}
