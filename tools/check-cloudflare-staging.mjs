import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';

const base = stagingTarget();
const releaseDist = path.resolve(process.env.CF_RELEASE_DIST || 'site/dist');
const checks = [], cleanup = [], pending = [], fixture = {};
const suffix = crypto.randomUUID();
let slug = 'staging-check-' + suffix;
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
async function request(path, init = {}, authenticated = true) {
  const target = new URL(path, base);
  assert.equal(target.origin, base, 'All test requests stay on the verified staging Worker.');
  const headers = new Headers(init.headers);
  if (authenticated && process.env.CF_PREVIEW_ACCESS_TOKEN) headers.set('x-preview-access', process.env.CF_PREVIEW_ACCESS_TOKEN);
  return fetch(target, { ...init, headers, redirect: 'manual', signal: AbortSignal.timeout(30000) });
}
async function api(path, method = 'GET', data, key, extraHeaders = {}) {
  const response = await request(path, { method, headers: { ...(data ? { 'content-type': 'application/json' } : {}), ...(key ? { authorization: `Bearer ${key}` } : {}), ...extraHeaders }, ...(data ? { body: JSON.stringify(data) } : {}) });
  assert.match(response.headers.get('content-type') || '', /json/, 'Expected an API JSON response.');
  assert.match(response.headers.get('cache-control') || '', /no-store/, 'API responses must not be cached.');
  return { status: response.status, body: await response.json(), retryAfter: response.headers.get('retry-after') };
}
let failure;
try {
  // Verify the deployed catalogue matches the local stable artifact before writes.
  const metadata = await api('/api/compose');
  assert.equal(metadata.status, 200); assert(Object.keys(metadata.body).length === 1 && metadata.body.enabled === false, 'AI must be disabled and model metadata private.');
  checks.push('paid AI disabled and backend model details remain private');
  const security = await api('/api/security');
  assert.equal(security.status, 200); assert.equal(security.body.required, true);
  assert.equal(typeof security.body.sitekey, 'string'); assert(security.body.sitekey.length > 10);
  checks.push('live security metadata requires browser verification');
  for (const route of ['/', '/data/blocks.json', '/api/security']) for (const headers of [{}, { 'x-preview-access': 'incorrect-staging-preview-key' }]) {
    const denied = await request(route, { headers }, false);
    assert([401, 403, 404].includes(denied.status), 'Private staging must refuse missing and incorrect preview access.');
    assert.match(denied.headers.get('cache-control') || '', /no-store/);
  }
  checks.push('private staging root, asset and API refuse missing and incorrect preview access');
  for (const [route, body] of [['/api/comments', { slug, body: 'Rejected synthetic request', name: 'Staging test' }], ['/api/spaces', { name: 'Rejected synthetic request' }], ['/api/compose', { goal: 'Build a complete workflow from supplied information', context: '' }]]) {
    const denied = await api(route, 'POST', body); assert.equal(denied.status, 403, 'Protected action must require a fresh widget token.');
  }
  checks.push('comments, space creation and AI reject missing Turnstile tokens');
  const forged = await api('/api/comments', 'POST', { slug, body: 'Rejected synthetic request', name: 'Staging test' }, undefined, { 'x-turnstile-token': 'invalid-staging-token' });
  assert.equal(forged.status, 403);
  const crossSite = await api('/api/comments', 'POST', { slug, body: 'Rejected synthetic request', name: 'Staging test' }, undefined, { origin: 'https://untrusted.invalid' });
  assert.equal(crossSite.status, 403);
  checks.push('forged verification token and cross-origin write are refused');
  for (const key of [undefined, 'incorrect-staging-owner-key']) { const denied = await api('/api/spaces/me', 'GET', undefined, key); assert.equal(denied.status, 401); }
  checks.push('live space API refuses absent and incorrect owner keys');
  const catalogue = JSON.parse(fs.readFileSync(path.join(releaseDist, 'data/blocks.json'), 'utf8'));
  const download = catalogue.blocks.find(block => block.hasFiles);
  assert(download);
  for (const asset of ['data/blocks.json', 'skills/website-brand-brain-builder/SKILL.md', `skills/${download.slug}.zip`]) {
    const response = await request('/' + asset); assert.equal(response.status, 200, asset);
    assert.equal(sha(Buffer.from(await response.arrayBuffer())), sha(fs.readFileSync(path.join(releaseDist, asset))), 'Staging asset differs from stable build: ' + asset);
  }
  checks.push('deployed catalogue, skill and ZIP bytes match the stable build');
  let result;
  if (process.env.CF_STAGING_FIXTURES) {
  const input = JSON.parse(fs.readFileSync(process.env.CF_STAGING_FIXTURES, 'utf8'));
  for (const key of ['commentSlug', 'commentId', 'ownerKey', 'shareToken', 'spaceId']) assert.equal(typeof input[key], 'string', 'Real-widget fixture is incomplete.');
  slug = input.commentSlug; Object.assign(fixture, { commentId: input.commentId, ownerKey: input.ownerKey, shareToken: input.shareToken, spaceId: input.spaceId });
  result = await api('/api/comments?slug=' + slug);
  const commentIds = input.commentIds || [fixture.commentId];
  assert(Array.isArray(commentIds) && commentIds.length >= 1 && commentIds.length <= 6 && new Set(commentIds).size === commentIds.length && commentIds.includes(fixture.commentId), 'Expected bounded unique synthetic comment IDs.');
  for (const id of commentIds) {
    assert(typeof id === 'string' && /^[a-f0-9-]{36}$/i.test(id), 'Invalid synthetic comment ID.');
    const comment = result.body.comments.find(comment => comment.id === id);
    assert(comment && comment.body.startsWith('Staging launch verification '), 'Only verified synthetic widget-created comments may be cleaned up.');
    if (input.verificationTag) assert.equal(comment.body, input.verificationTag, 'Duplicate cleanup requires the exact verification tag.');
  }
  fixture.commentIds = commentIds;
  fixture.commentVerified = true;
  checks.push('comment persists through real staging D1');
  result = await api('/api/comments?id=' + fixture.commentId, 'DELETE'); assert.equal(result.status, 403);
  checks.push('comment moderation rejects an unauthenticated request');
  result = await api('/api/spaces/me', 'GET', undefined, fixture.ownerKey);
  assert.equal(result.status, 200); assert.equal(result.body.space.id, fixture.spaceId); assert(result.body.space.name.startsWith('Staging launch verification '));
  for (const key of [undefined, 'incorrect-staging-owner-key']) { result = await api('/api/spaces/me', 'GET', undefined, key); assert.equal(result.status, 401); }
  checks.push('space owner authorization rejects absent and incorrect keys');
  result = await api('/api/spaces/me/items', 'POST', { kind: 'skill', title: 'Staging fixture ' + suffix, body: 'Synthetic staging-only test data', visibility: 'private' }, fixture.ownerKey);
  assert.equal(result.status, 201); fixture.itemId = result.body.item.id;
  result = await api('/api/spaces/me', 'GET', undefined, fixture.ownerKey); assert(result.body.items.some(item => item.id === fixture.itemId));
  checks.push('private space item persists through real staging D1');
  result = await api('/api/spaces/public'); assert(!result.body.items.some(item => item.id === fixture.itemId));
  checks.push('private staging fixture never appears in the public list');
  result = await api('/api/spaces/shared/' + fixture.shareToken); assert.equal(result.status, 200); assert(result.body.items.some(item => item.id === fixture.itemId));
  result = await api('/api/spaces/shared/' + fixture.shareToken, 'POST', { name: 'Forbidden' }); assert.equal(result.status, 405);
  checks.push('shared space reads work and writes are refused');
  result = await api('/api/spaces/me/link', 'POST', {}, fixture.ownerKey); assert.equal(result.status, 200);
  const previous = fixture.shareToken; fixture.shareToken = result.body.shareToken;
  result = await api('/api/spaces/shared/' + previous); assert.equal(result.status, 404);
  result = await api('/api/spaces/shared/' + fixture.shareToken); assert.equal(result.status, 200);
  checks.push('share rotation invalidates the previous link');
  } else pending.push('Create one synthetic space and comment through their real Turnstile widgets, then supply the private fixture file to verify positive D1 and sharing flows.');
  for (const path of ['/', '/how-it-works', '/minds', '/tools', '/compose', '/space', '/people', '/skills/website-brand-brain-builder', '/example-app/', '/s/' + (fixture.shareToken || 'staging-unissued-link-check')]) {
    const response = await request(path); assert.equal(response.status, 200, 'Deep link changed: ' + (path.startsWith('/s/') ? '/s/[fixture]' : path)); assert(!response.headers.has('location'), 'Deep link unexpectedly redirected.'); assert((await response.text()).includes('<html'));
  }
  checks.push('deep links and shared-space URLs keep their addresses');
  for (const path of ['/staging-missing-' + suffix, '/skills/no-such-thing']) { const response = await request(path); assert.equal(response.status, 404); assert((await response.text()).includes("This page doesn")); }
  checks.push('unknown pages retain real custom404 responses');
  const redirect = fs.readFileSync(path.join(releaseDist, '_redirects'), 'utf8').split(/\r?\n/).find(line => line.endsWith(' 301')).split(/\s+/);
  let response = await request(redirect[0]); assert.equal(response.status, 301); assert.equal(new URL(response.headers.get('location'), base).pathname, redirect[1]);
  response = await request('/skills/fact-based-ad-copy-writer?source=staging'); assert.equal(response.status, 301);
  assert.equal(new URL(response.headers.get('location'), base).pathname, '/prompts/fact-based-ad-copy-writer'); assert.equal(new URL(response.headers.get('location'), base).search, '?source=staging');
  checks.push('legacy and wrong-type URLs permanently redirect without losing queries');
  response = await request('/skills/website-brand-brain-builder/SKILL.md', { method: 'HEAD' }); assert.equal(response.status, 200); assert.equal(await response.text(), '');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff'); assert.match(response.headers.get('cache-control') || '', /max-age=300/);
  response = await request('/compose'); assert.match(response.headers.get('permissions-policy') || '', /microphone=\(self\)/);
  checks.push('HEAD, cache/security headers and microphone permission policy are preserved');
  response = await request('/example-app/'); assert((await response.text()).includes('noindex'));
  checks.push('saved example remains excluded from indexing');
  response = await request('/example-app/not-a-screen'); assert.equal(response.status, 404);
  assert((await response.text()).includes("This screen isn't in the tour"), 'Missing saved-tour screens retain their own404 page.');
  checks.push('missing saved-tour screens retain the tour-specific404');
  result = await api('/api/unknown'); assert.equal(result.status, 404); assert.equal(typeof result.body.error, 'string');
  checks.push('unknown API returns a JSON404 rather than an HTML shell');
} catch (error) {
  failure = String(error.message);
  for (const secret of [fixture.ownerKey, fixture.shareToken, process.env.CF_STAGING_COMMENTS_TEAM_TOKEN, process.env.CF_PREVIEW_ACCESS_TOKEN].filter(Boolean)) failure = failure.replaceAll(secret, '[redacted]');
} finally {
  if (fixture.itemId) {
    try { const result = await api('/api/spaces/me/items/' + fixture.itemId, 'DELETE', undefined, fixture.ownerKey); assert.equal(result.status, 200); cleanup.push('deleted the staging fixture item'); }
    catch { cleanup.push('fixture item cleanup failed; staging owner must remove it'); failure ||= 'Staging fixture item cleanup failed.'; }
  }
  if (fixture.commentVerified && process.env.CF_STAGING_COMMENTS_TEAM_TOKEN) {
    try { for (const id of fixture.commentIds) { const result = await api('/api/comments?id=' + id, 'DELETE', undefined, process.env.CF_STAGING_COMMENTS_TEAM_TOKEN); assert.equal(result.status, 200); } cleanup.push('hid ' + fixture.commentIds.length + ' verified staging fixture comments'); }
    catch { cleanup.push('fixture comment cleanup failed; staging owner must moderate it'); failure ||= 'Staging fixture comment cleanup failed.'; }
  } else if (fixture.commentVerified) { cleanup.push('synthetic fixture comment retained; moderation token was not supplied'); pending.push('Moderate the verified synthetic test comment.'); }
}
// Never include owner keys, share tokens, authorization headers or secret values.
const report = { checkedOn: new Date().toISOString(), environment: base, deployedVersion: process.env.CF_STAGING_VERSION, scope: 'verified isolated staging Worker and D1', status: failure ? 'fail' : pending.length ? 'partial' : 'pass', productionTouched: false, providerCalls: 0, passed: checks.length, checks, pending, cleanup, remainingFixture: { commentSlug: fixture.commentId ? slug : undefined, emptySpaceId: fixture.spaceId }, ...(failure ? { failure } : {}) };
fs.writeFileSync('reports/cloudflare-staging-api-check.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, passed: report.passed, productionTouched: false, providerCalls: 0, ...(failure ? { failure } : {}) }));
if (failure) process.exitCode = 1;
else if (pending.length) process.exitCode = 2;
