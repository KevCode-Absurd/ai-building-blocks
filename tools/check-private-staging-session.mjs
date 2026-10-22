// Check real private-preview authentication without storing or printing credentials.
// This does not solve Turnstile or claim a successful protected write.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const base = 'https://ai-building-blocks-staging.kevinmark7498.workers.dev';
const release = JSON.parse(await fs.readFile('reports/cloudflare-live-release.json', 'utf8'));
const frozen = JSON.parse(await fs.readFile('reports/cloudflare-frozen-release.json', 'utf8'));
const secret = JSON.parse(await fs.readFile('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN;
assert(typeof secret === 'string' && secret.length >= 32);
const checks = [];
const get = (path, options = {}) => fetch(base + path, { ...options, redirect: 'manual', signal: AbortSignal.timeout(30000) });
const post = (token, headers = {}) => get('/__preview/login', { method: 'POST', headers: { origin: base, 'content-type': 'application/x-www-form-urlencoded', ...headers }, body: new URLSearchParams({ preview_token: token }) });
let failure;
try {
  assert.equal((await get('/')).status, 403); checks.push('unauthenticated staging remains private');
  let response = await get('/__preview/login');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('referrer-policy'), 'same-origin', 'Native login forms must preserve their same-origin Origin header.');
  const html = await response.text(); assert(!html.includes(secret)); assert(html.includes('type="password"'));
  assert.match(response.headers.get('cache-control'), /no-store/); assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  checks.push('bounded login form has no credentials, caching or embedding');
  assert.equal((await get('/__preview/login?preview_token=invalid-fixture')).status, 400); checks.push('URL credentials refused');
  response = await post('invalid-fixture'); assert.equal(response.status, 403); assert.equal(response.headers.get('set-cookie'), null); checks.push('invalid credential refused');
  response = await post('invalid-fixture', { origin: 'https://example.invalid' }); assert.equal(response.status, 403); checks.push('foreign origin refused');
  response = await post(secret); assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/space');
  const fullCookie = response.headers.get('set-cookie');
  for (const flag of ['__Host-ai_preview=', 'HttpOnly', 'Secure', 'SameSite=Strict', 'Max-Age=900', 'Path=/']) assert(fullCookie.includes(flag));
  assert(!fullCookie.includes(secret) && !/Domain=/i.test(fullCookie));
  const cookie = fullCookie.split(';')[0]; checks.push('same-origin login creates signed fifteen-minute host-only session');
  response = await get('/', { headers: { cookie } }); assert.equal(response.status, 200);
  const sha = value => crypto.createHash('sha256').update(value).digest('hex');
  assert.equal(sha(Buffer.from(await response.arrayBuffer())), frozen.criticalAssets['index.html']); checks.push('cookie-only browser can read exact frozen frontend');
  response = await get('/', { headers: { cookie: cookie.slice(0, -1) + (cookie.endsWith('0') ? '1' : '0') } }); assert.equal(response.status, 403); checks.push('tampered signed cookie refused');
  for (const path of ['/api/spaces', '/api/comments']) {
    response = await get(path, { method: 'POST', headers: { cookie, origin: base, 'content-type': 'application/json' }, body: '{}' });
    assert.equal(response.status, 403); assert.match((await response.json()).error, /security check/i);
  }
  checks.push('preview session still requires real Turnstile on both protected writes');
  response = await get('/__preview/logout', { method: 'POST', headers: { cookie, origin: base } }); assert.equal(response.status, 303); assert.match(response.headers.get('set-cookie'), /Max-Age=0/); checks.push('logout clears browser session');
} catch (error) { failure = error.message; }
const report = { checkedOn: new Date().toISOString(), deployedVersion: release.staging.versionId, origin: base, status: failure ? 'fail' : 'pass', passed: checks.length, checks, protectedWritesCreated: 0, providerCalls: 0, credentialsStored: false, ...(failure ? { failure } : {}) };
await fs.writeFile('reports/cloudflare-staging-preview-session.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failure) process.exitCode = 1;
