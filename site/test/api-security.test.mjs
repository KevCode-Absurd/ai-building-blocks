import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { apiSecurity, securityConfig } from '../src/server/api-security.ts';
import worker from '../src/worker.ts';
import { onRequest as comments } from '../functions/api/comments.ts';
import { onRequest as spaces } from '../functions/api/spaces/[[path]].ts';
import { onRequest as compose } from '../functions/api/compose.ts';

const allow = { async limit() { return { success: true }; } };
const env = () => ({ API_ALLOWED_HOSTS: 'useaiblocks.com', TURNSTILE_SITE_KEY: 'real-site-key', TURNSTILE_SECRET_KEY: 'server-secret', API_READ_LIMITER: allow, API_WRITE_LIMITER: allow, AI_LIMITER: allow });
const request = (path = '/api/compose', { method = 'POST', host = 'useaiblocks.com', headers = {} } = {}) => new Request('https://' + host + path, { method, headers: { 'cf-connecting-ip': '192.0.2.1', ...headers } });
const verified = (action = 'compose', hostname = 'useaiblocks.com') => async () => Response.json({ success: true, hostname, action });

test('all anonymous actions reject direct calls without a Turnstile token, including trailing slashes', async () => {
  for (const path of ['/api/compose', '/api/compose/', '/api/comments', '/api/comments/', '/api/spaces', '/api/spaces/']) {
    let contacted = false;
    const response = await apiSecurity(request(path), env(), async () => { contacted = true; throw Error(); });
    assert.equal(response.status, 403, path); assert.equal(contacted, false);
  }
});
test('every adapter and the Worker enforce security before touching D1 or assets', async () => {
  const db = { prepare() { throw Error('D1 must not be reached'); } };
  for (const [adapter, path] of [[comments, '/api/comments'], [spaces, '/api/spaces'], [compose, '/api/compose']]) {
    const e = { ...env(), COMMENTS: db, SPACES: db, COMPOSER: db, ASSETS: { fetch() { throw Error('Assets must not be reached'); } } };
    assert.equal((await adapter({ request: request(path), env: e })).status, 403);
    assert.equal((await worker.fetch(request(path), e)).status, 403);
  }
});
test('server checks action, hostname and success; forged, expired and replayed tokens are rejected', async () => {
  const req = request('/api/compose', { headers: { 'x-turnstile-token': 'token' } });
  for (const result of [{ success: false, 'error-codes': ['timeout-or-duplicate'] }, { success: false }, { success: true, action: 'comment', hostname: 'useaiblocks.com' }, { success: true, action: 'compose', hostname: 'attacker.test' }, {}]) {
    assert.equal((await apiSecurity(req, env(), async () => Response.json(result))).status, 403);
  }
  assert.equal(await apiSecurity(req, env(), verified()), null);
});
test('verification forwards the secret, token and trusted IP only to Siteverify', async () => {
  const e = env();
  assert.equal(await apiSecurity(request('/api/comments', { headers: { 'x-turnstile-token': 'fresh-token' } }), e, async (url, options) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.equal(options.method, 'POST'); assert.equal(options.body.get('secret'), e.TURNSTILE_SECRET_KEY);
    assert.equal(options.body.get('response'), 'fresh-token'); assert.equal(options.body.get('remoteip'), '192.0.2.1');
    return Response.json({ success: true, action: 'comment', hostname: 'useaiblocks.com' });
  }), null);
});
test('Turnstile network errors and malformed replies fail closed without leaking secrets', async () => {
  for (const verify of [async () => { throw Error('server-secret'); }, async () => new Response('broken'), async () => new Response('', { status: 500 })]) {
    const response = await apiSecurity(request('/api/spaces', { headers: { 'x-turnstile-token': 'token' } }), env(), verify);
    assert.equal(response.status, 503); assert(!JSON.stringify(await response.json()).includes('server-secret'));
  }
});
test('API and AI bursts return retry information before verification, including valid-token floods', async () => {
  for (const binding of ['API_WRITE_LIMITER', 'AI_LIMITER']) {
    let verifiedCalls = 0;
    const e = { ...env(), [binding]: { async limit() { return { success: false }; } } };
    const response = await apiSecurity(request('/api/compose', { headers: { 'x-turnstile-token': 'token' } }), e, async () => { verifiedCalls++; throw Error(); });
    assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '60'); assert.equal(verifiedCalls, 0);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
});
test('changing URLs, query strings and client-supplied IP headers cannot reset the read bucket', async () => {
  const keys = [];
  const e = { ...env(), API_READ_LIMITER: { async limit({ key }) { keys.push(key); return { success: keys.length < 3 }; } } };
  for (const [i, path] of ['/api/comments?slug=a', '/api/spaces/public?x=2', '/api/missing?x=3'].entries()) {
    const response = await apiSecurity(request(path, { method: 'GET', headers: { 'x-forwarded-for': String(i), 'x-real-ip': String(i) } }), e);
    assert.equal(response?.status ?? 200, i < 2 ? 200 : 429);
  }
  assert.deepEqual(keys, ['192.0.2.1', '192.0.2.1', '192.0.2.1']);
});
test('missing or unavailable limiters fail closed', async () => {
  for (const binding of ['API_READ_LIMITER', 'API_WRITE_LIMITER', 'AI_LIMITER']) {
    for (const value of [undefined, { async limit() { throw Error('outage'); } }]) {
      assert.equal((await apiSecurity(request('/api/compose', { method: binding === 'API_READ_LIMITER' ? 'GET' : 'POST' }), { ...env(), [binding]: value })).status, 503);
    }
  }
});
test('production rejects alternate hostnames even with local bypass or forged Origin', async () => {
  for (const host of ['ai-building-blocks.example.workers.dev', 'preview.example.workers.dev', 'attacker.test']) {
    assert.equal((await apiSecurity(request('/api/compose', { host, headers: { origin: 'https://useaiblocks.com' } }), { ...env(), SECURITY_LOCAL: 'true' })).status, 403);
  }
});
test('loopback bypass requires explicit local configuration and cannot be used remotely', async () => {
  assert.equal(await apiSecurity(request('/api/spaces', { host: '127.0.0.1' }), { SECURITY_LOCAL: 'true' }), null);
  assert.equal((await apiSecurity(request('/api/spaces', { host: '127.0.0.1' }), {})).status, 503);
  assert.equal((await apiSecurity(request(), { SECURITY_LOCAL: 'true' })).status, 503);
});
test('cross-origin browser writes are rejected but owner-authorized changes need no new challenge', async () => {
  assert.equal((await apiSecurity(request('/api/spaces/me/items', { headers: { origin: 'https://attacker.test' } }), env())).status, 403);
  assert.equal((await apiSecurity(request('/api/spaces/me', { method: 'PATCH', headers: { 'sec-fetch-site': 'cross-site' } }), env())).status, 403);
  assert.equal(await apiSecurity(request('/api/spaces/me/items', { headers: { origin: 'https://useaiblocks.com', authorization: 'Bearer owner' } }), env()), null);
});
test('metadata exposes only the sitekey; missing keys, test keys and missing trusted IP fail closed', async () => {
  const response = await securityConfig(request('/api/security', { method: 'GET' }), env());
  assert.deepEqual(await response.json(), { required: true, sitekey: 'real-site-key' });
  assert.equal((await apiSecurity(request(), { ...env(), TURNSTILE_SECRET_KEY: '' })).status, 503);
  assert.equal((await apiSecurity(request(), { ...env(), TURNSTILE_SITE_KEY: '1x00000000000000000000AA' })).status, 503);
  assert.equal((await apiSecurity(new Request('https://useaiblocks.com/api/compose'), env())).status, 503);
  assert.equal((await apiSecurity(request('/api/comments', { headers: { 'x-turnstile-token': 'x'.repeat(2049) } }), env())).status, 403);
});
test('private staging protects every route before assets and APIs, without skipping Turnstile', async () => {
  const secret = 'private-staging-credential-for-testing-only';
  const e = { ...env(), PREVIEW_PROTECTED: 'true', PREVIEW_ACCESS_TOKEN: secret, ASSETS: { fetch() { throw Error('Unauthorized assets accessed'); } } };
  for (const path of ['/', '/assets/app.js', '/data/blocks.json', '/skills/test/SKILL.md', '/api/security', '/api/comments', '/api/compose', '/api/spaces']) {
    for (const headers of [{}, { 'x-preview-access': 'wrong' }, { authorization: `Bearer ${secret}` }]) {
      assert.equal((await worker.fetch(request(path, { method: 'GET', headers }), e)).status, 403, path);
    }
  }
  assert.equal((await worker.fetch(request('/api/comments', { headers: { 'x-preview-access': secret } }), e)).status, 403, 'Preview access never bypasses Turnstile');
  assert.equal((await worker.fetch(request('/', { method: 'GET' }), { ...e, PREVIEW_ACCESS_TOKEN: '' })).status, 503);
  const response = await worker.fetch(request('/', { method: 'GET', headers: { 'x-preview-access': secret } }), { ...e, ASSETS: { async fetch() { return new Response('private assets'); } } });
  assert.equal(await response.text(), 'private assets');
});
test('deployment disables public previews and isolates staging limits', () => {
  const config = JSON.parse(fs.readFileSync('wrangler.example.jsonc', 'utf8'));
  for (const c of [config, config.env.staging]) {
    assert.equal(c.preview_urls, false);
    assert.deepEqual(c.ratelimits.map(x => [x.name, x.simple.limit, x.simple.period]), [['API_READ_LIMITER', 120, 60], ['API_WRITE_LIMITER', 30, 60], ['AI_LIMITER', 3, 60]]);
    assert(!('TURNSTILE_SECRET_KEY' in c.vars)); assert(!('SECURITY_LOCAL' in c.vars));
  }
  assert.equal(config.workers_dev, false);
  assert.equal(config.env.staging.workers_dev, true);
  assert.equal(config.env.staging.assets.run_worker_first, true);
  assert.equal(config.env.staging.vars.PREVIEW_PROTECTED, 'true');
  assert(config.env.staging.ratelimits.every(s => !config.ratelimits.some(p => p.namespace_id === s.namespace_id)));
});
