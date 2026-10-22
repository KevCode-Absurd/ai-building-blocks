import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apiSecurity, previewSecurity } from '../src/server/api-security.ts';
import { previewSessionRoute } from '../src/server/preview-session.ts';
import worker from '../src/worker.ts';

const host = 'private-staging.example.workers.dev';
const origin = 'https://' + host;
const secret = 'synthetic-preview-credential-for-tests-only-12345';
const allow = { async limit() { return { success: true }; } };
const env = () => ({ PREVIEW_PROTECTED: 'true', PREVIEW_ACCESS_TOKEN: secret, API_ALLOWED_HOSTS: host, API_WRITE_LIMITER: allow });
const request = (path = '/__preview/login', options = {}) => new Request(origin + path, options);
const login = (token = secret, headers = {}, body) => request('/__preview/login', { method: 'POST', headers: { origin, 'cf-connecting-ip': '192.0.2.1', 'content-type': 'application/x-www-form-urlencoded', ...headers }, body: body ?? new URLSearchParams({ preview_token: token }) });
const sessionCookie = async () => (await previewSessionRoute(login(), env())).headers.get('set-cookie').split(';')[0];

test('preview login is staging-only, exact-host HTTPS and never public app authentication', async () => {
  for (const e of [{ ...env(), PREVIEW_PROTECTED: undefined }, { ...env(), API_ALLOWED_HOSTS: 'useaiblocks.com' }, { ...env(), API_ALLOWED_HOSTS: host + ',other.workers.dev' }]) {
    assert.equal((await previewSessionRoute(request(), e)).status, 404);
  }
  assert.equal((await previewSessionRoute(new Request('http://' + host + '/__preview/login'), env())).status, 404);
  assert.equal((await previewSessionRoute(new Request('https://other.workers.dev/__preview/login'), env())).status, 404);
  assert.equal((await previewSessionRoute(request(), { ...env(), PREVIEW_ACCESS_TOKEN: '' })).status, 503);
  assert.equal(await previewSessionRoute(request('/'), env()), null);
});

test('public login form has no credential, script, caching, embedding or URL credential acceptance', async () => {
  const response = await worker.fetch(request(), env());
  assert.equal(response.status, 200);
  const html = await response.text();
  assert(!html.includes(secret)); assert(!html.includes('<script'));
  assert(html.includes('type="password"')); assert(html.includes('method="post"'));
  assert.equal(response.headers.get('referrer-policy'), 'same-origin');
  assert.match(response.headers.get('content-security-policy'), /default-src 'none'.*form-action 'self'.*frame-ancestors 'none'/);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal((await previewSessionRoute(request('/__preview/login?preview_token=not-a-real-secret'), env())).status, 400);
});

test('signed session grants private assets and APIs for fifteen minutes without granting Turnstile', async () => {
  const response = await previewSessionRoute(login(), env());
  assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/space');
  const setCookie = response.headers.get('set-cookie');
  for (const flag of ['__Host-ai_preview=', 'Max-Age=900', 'Path=/', 'Secure', 'HttpOnly', 'SameSite=Strict']) assert(setCookie.includes(flag), flag);
  assert(!/Domain=/i.test(setCookie)); assert(!setCookie.includes(secret));
  const cookie = setCookie.split(';')[0];
  const req = request('/', { headers: { cookie } });
  assert.equal(await previewSecurity(req, env()), null);
  const assets = await worker.fetch(req, { ...env(), ASSETS: { async fetch() { return new Response('private assets'); } } });
  assert.equal(await assets.text(), 'private assets');
  const e = { ...env(), TURNSTILE_SITE_KEY: 'real-site-key', TURNSTILE_SECRET_KEY: 'server-secret' };
  const denied = await apiSecurity(request('/api/spaces', { method: 'POST', headers: { cookie, origin, 'cf-connecting-ip': '192.0.2.1' } }), e);
  assert.equal(denied.status, 403); assert.match(await denied.text(), /security check/);
});

test('missing, malformed, duplicate, tampered, expired, future, cross-host and rotated sessions fail closed', async () => {
  const cookie = await sessionCookie();
  for (const value of ['', '__Host-ai_preview=broken', cookie + '; ' + cookie, cookie.replace(/.$/, cookie.endsWith('0') ? '1' : '0')]) {
    assert.equal((await previewSecurity(request('/', { headers: { cookie: value } }), env())).status, 403);
  }
  assert.equal((await previewSecurity(request('/', { headers: { cookie } }), { ...env(), PREVIEW_ACCESS_TOKEN: 'another-private-preview-credential-123456789' })).status, 403);
  assert.equal((await previewSecurity(new Request('https://other.workers.dev/', { headers: { cookie } }), { ...env(), API_ALLOWED_HOSTS: 'other.workers.dev' })).status, 403);
  const realNow = Date.now;
  try {
    const now = realNow();
    Date.now = () => now + 901_000;
    assert.equal((await previewSecurity(request('/', { headers: { cookie } }), env())).status, 403);
    Date.now = () => now - 2_000;
    assert.equal((await previewSecurity(request('/', { headers: { cookie } }), env())).status, 403);
  } finally { Date.now = realNow; }
});

test('login requires same-origin POST, trusted IP, live write limiter and bounded single-credential form', async () => {
  for (const headers of [{ origin: 'https://attacker.test' }, { origin: '' }, { origin: 'null' }, { 'sec-fetch-site': 'cross-site' }]) {
    assert.equal((await previewSessionRoute(login(secret, headers), env())).status, 403);
  }
  for (const method of ['HEAD', 'PUT', 'OPTIONS']) assert.equal((await previewSessionRoute(request('/__preview/login', { method }), env())).status, 405);
  assert.equal((await previewSessionRoute(login('wrong'), env())).status, 403);
  for (const body of ['preview_token=' + 'x'.repeat(1025), 'preview_token=a&preview_token=b', 'preview_token=a&next=https://attacker.test']) assert.equal((await previewSessionRoute(login(secret, {}, body), env())).status, 400);
  assert.equal((await previewSessionRoute(login(secret, { 'content-type': 'application/json' }), env())).status, 400);
  assert.equal((await previewSessionRoute(login(secret, { 'cf-connecting-ip': '' }), env())).status, 503);
  for (const limiter of [undefined, { async limit() { throw Error(secret); } }]) {
    const response = await previewSessionRoute(login(), { ...env(), API_WRITE_LIMITER: limiter });
    assert.equal(response.status, 503); assert(!(await response.text()).includes(secret));
  }
  const throttled = await previewSessionRoute(login(), { ...env(), API_WRITE_LIMITER: { async limit() { return { success: false }; } } });
  assert.equal(throttled.status, 429); assert.equal(throttled.headers.get('retry-after'), '60');
});

test('logout clears only the private cookie through same-origin POST and existing header access remains valid', async () => {
  assert.equal((await previewSessionRoute(request('/__preview/logout'), env())).status, 405);
  const response = await previewSessionRoute(new Request(origin + '/__preview/logout', { method: 'POST', headers: { origin, 'cf-connecting-ip': '192.0.2.1' } }), env());
  assert.equal(response.status, 303); assert.match(response.headers.get('set-cookie'), /Max-Age=0; Secure; HttpOnly; SameSite=Strict/);
  assert.equal(await previewSecurity(request('/', { headers: { 'x-preview-access': secret } }), env()), null);
});
