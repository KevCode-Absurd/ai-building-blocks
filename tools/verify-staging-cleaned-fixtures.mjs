// Reconcile completed checks without recreating comments already moderated.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
const base = stagingTarget();
const version = process.env.CF_STAGING_VERSION;
const tag = 'Staging launch verification owner-20261022';
const spaces = ['ba6b1cdf-16fc-4073-a9ef-df7d6954c98a', '55669f7a-6a03-4a1d-b355-6a323e629c33'];
const comments = ['0ea164e7-64ff-452c-8d65-c294dcb87832', 'd08854bb-210a-4b0c-97a4-1f527357fff0'];
const fixture = JSON.parse(fs.readFileSync('site/.wrangler/staging-live-fixtures.json'));
const credential = JSON.parse(fs.readFileSync('site/.wrangler/staging-secrets.json')).PREVIEW_ACCESS_TOKEN;
const api = JSON.parse(fs.readFileSync('reports/cloudflare-staging-api-check.json'));
const frozen = JSON.parse(fs.readFileSync('reports/cloudflare-frozen-release.json'));
const report = { checkedOn: new Date().toISOString(), deployedVersion: version, status: 'running', readOnly: true, productionTouched: false, providerCalls: 0, clipboardRead: false, checks: [] };
let currentShare = '';
async function get(route, owner = false) {
  const target = new URL(route, base); assert.equal(target.origin, base);
  return fetch(target, { headers: { 'x-preview-access': credential, ...(owner ? { authorization: 'Bearer ' + fixture.ownerKey } : {}) }, redirect: 'manual', signal: AbortSignal.timeout(30000) });
}
try {
  assert.equal(version, '80bc2a97-5835-4936-bd81-8c994a9552b6');
  assert.equal(api.deployedVersion, version); assert.equal(api.status, 'pass'); assert.equal(api.passed, 21);
  assert.equal(api.productionTouched, false); assert.equal(api.providerCalls, 0); assert.equal(api.pending.length, 0);
  assert.equal(frozen.workerSha256, '892f4aaae4cfd8dc723acc5ddf17f714c59416ee66b3d932057e590f76410d2c');
  assert.equal(fixture.verificationTag, tag); assert(spaces.includes(fixture.spaceId));
  assert.equal(fixture.commentSlug, 'website-brand-brain-builder');
  assert.deepEqual([...fixture.commentIds].sort(), [...comments].sort());
  assert(/^[A-Za-z0-9_-]{32}$/.test(fixture.ownerKey) && /^[A-Za-z0-9_-]{32}$/.test(fixture.shareToken));
  assert.equal(api.remainingFixture.emptySpaceId, fixture.spaceId);
  assert(api.cleanup.includes('deleted the staging fixture item') && api.cleanup.includes('hid 2 verified staging fixture comments'));
  report.checks.push('current-version API evidence and exact synthetic fixture identity match');
  let response = await get('/api/spaces/me', true); assert.equal(response.status, 200);
  const owner = await response.json(); assert.equal(owner.space.id, fixture.spaceId); assert.equal(owner.space.name, tag); assert.equal(owner.items.length, 0);
  currentShare = owner.shareToken; assert(/^[A-Za-z0-9_-]{32}$/.test(currentShare));
  report.canonicalSpaceId = fixture.spaceId; report.extraEmptySpaceIds = spaces.filter(id => id !== fixture.spaceId);
  report.checks.push('captured owner key still opens the exact synthetic empty space');
  assert.notEqual(currentShare, fixture.shareToken, 'Successful rotation must have changed the original share token.');
  response = await get('/api/spaces/shared/' + fixture.shareToken); assert.equal(response.status, 404);
  response = await get('/api/spaces/shared/' + currentShare); assert.equal(response.status, 200); assert.equal((await response.json()).items.length, 0);
  report.checks.push('old shared link remains invalid and rotated link reads the cleaned empty space');
  response = await get('/api/compose'); assert.equal(response.status, 200); assert.deepEqual(await response.json(), { enabled: false });
  const sql = `SELECT id,name,created,(SELECT COUNT(*) FROM space_items WHERE space_id=spaces.id) AS item_count FROM spaces WHERE name='${tag}' AND id IN ('${spaces.join("','")}'); SELECT id,slug,body,hidden,at FROM comments WHERE slug='website-brand-brain-builder' AND body='${tag}' AND id IN ('${comments.join("','")}')`;
  const output = execFileSync(process.execPath, [path.resolve('site/node_modules/wrangler/bin/wrangler.js'), 'd1', 'execute', 'SPACES', '--remote', '--env', 'staging', '--config', path.resolve(process.env.CF_STAGING_CONFIG), '--command', sql, '--json'], { env: { ...process.env, WRANGLER_WRITE_LOGS: 'false', WRANGLER_SEND_METRICS: 'false' }, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], timeout: 90000 });
  const results = JSON.parse(output); assert.equal(results.length, 2); assert(results.every(result => result.success));
  assert.equal(results[0].results.length, 2); assert(results[0].results.every(row => Number(row.item_count) === 0));
  assert.equal(results[1].results.length, 2); assert(results[1].results.every(row => Number(row.hidden) === 1));
  report.databaseRecords = { spaces: results[0].results, comments: results[1].results };
  report.checks.push('both exact-tag comments persist hidden and both exact spaces contain no items');
  report.status = 'pass';
} catch (error) {
  report.status = 'fail'; report.failure = String(error.message);
  for (const secret of [credential, fixture.ownerKey, fixture.shareToken, currentShare].filter(Boolean)) report.failure = report.failure.replaceAll(secret, '[redacted]');
  process.exitCode = 1;
}
fs.writeFileSync('reports/cloudflare-staging-fixture-reconciliation.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, checks: report.checks.length, clipboardRead: false, productionTouched: false, ...(report.failure ? { failure: report.failure } : {}) }));
