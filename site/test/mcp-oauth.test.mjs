import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { memoryMcpOAuthStore, d1McpOAuthStore, handleMcpOAuth, validateAuthorizationRequest, verifyMcpToken, OAuthError } from '../src/server/mcp-oauth.ts';

const origin = 'https://example.test';
const resource = `${origin}/mcp/company/company_abcdefgh`;
const verifier = 'v'.repeat(64);
const challenge = createHash('sha256').update(verifier).digest('base64url');
const env = { MCP_OAUTH_ENABLED: 'true' };
const options = { authenticate: async () => ({ userId: 'user_abc' }), authorizeResource: async (user, target) => user === 'user_abc' && target === resource };
const request = (path, data, headers = {}) => new Request(`${origin}${path}`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) });
async function invoke(store, path, data, opts = options, headers = {}) {
  const response = await handleMcpOAuth(request(path, data, headers), env, store, opts);
  return { status: response.status, body: await response.json() };
}
async function register(store) {
  const response = await invoke(store, '/oauth/register', { client_name: 'Test AI', redirect_uris: ['https://client.test/callback?existing=value'] });
  assert.equal(response.status, 201); return response.body;
}
const authorization = client => ({ client_id: client.client_id, redirect_uri: client.redirect_uris[0], response_type: 'code', scope: 'company:read', resource, state: 'state_for_csrf_protection', code_challenge: challenge, code_challenge_method: 'S256' });
async function getCode(store, client) {
  const grant = await invoke(store, '/oauth/authorize', { ...authorization(client), consent: true }, options, { origin });
  assert.equal(grant.status, 200);
  const callback = new URL(grant.body.redirect_uri);
  assert.equal(callback.searchParams.get('state'), 'state_for_csrf_protection'); assert.equal(callback.searchParams.get('existing'), 'value');
  assert.equal(callback.searchParams.get('iss'), origin);
  return callback.searchParams.get('code');
}
const exchange = (client, code) => ({ grant_type: 'authorization_code', client_id: client.client_id, redirect_uri: client.redirect_uris[0], code, code_verifier: verifier, resource });
const accessRequest = (token, target = resource) => new Request(target, { headers: { authorization: `Bearer ${token}` } });

function sqliteStore() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0008_mcp_oauth.sql', import.meta.url), 'utf8'));
  const statement = (sql, values = []) => ({
    bind(...args) { return statement(sql, args); },
    async first() { return db.prepare(sql).get(...values) ?? null; },
    async run() { const result = db.prepare(sql).run(...values); return { meta: { changes: Number(result.changes) } }; },
  });
  const adapter = { prepare: sql => statement(sql), async batch(statements) { db.exec('BEGIN'); try { const results = []; for (const s of statements) results.push(await s.run()); db.exec('COMMIT'); return results; } catch (e) { db.exec('ROLLBACK'); throw e; } } };
  return { db, store: d1McpOAuthStore(adapter) };
}

test('OAuth metadata is explicitly gated and DCR accepts exact safe public-client callbacks only', async () => {
  const store = memoryMcpOAuthStore();
  const disabled = await handleMcpOAuth(new Request(`${origin}/.well-known/oauth-authorization-server`), {}, store, options);
  assert.equal(disabled.status, 404);
  const metadata = await handleMcpOAuth(new Request(`${origin}/.well-known/oauth-authorization-server`), env, store, options);
  const info = await metadata.json();
  assert.deepEqual(info.code_challenge_methods_supported, ['S256']);
  assert.deepEqual(info.scopes_supported, ['company:read', 'saved:read','company:write','saved:write']);
  assert.equal(info.authorization_response_iss_parameter_supported, true);
  for (const uri of ['http://client.test/callback', 'https://client.test/*', 'https://user:password@client.test/callback', 'https://client.test/callback#fragment']) {
    assert.equal((await invoke(store, '/oauth/register', { client_name: 'Unsafe', redirect_uris: [uri] })).status, 400);
  }
  assert.equal((await invoke(store, '/oauth/register', { client_name: 'Native dev', redirect_uris: ['http://127.0.0.1:12345/callback'] })).status, 201);
  assert.equal((await invoke(store, '/oauth/register', { client_name: 'Confidential', redirect_uris: ['https://client.test/callback'], token_endpoint_auth_method: 'client_secret_post' })).status, 400);
});

test('Codex native dynamic registration accepts its standard application_type metadata', async () => {
  const store = memoryMcpOAuthStore();
  // Standard fields observed from Codex 0.163.0-alpha.11.2's real registration request.
  const payload = {
    client_name: 'Codex', redirect_uris: ['http://127.0.0.1/callback'],
    grant_types: ['authorization_code', 'refresh_token'], token_endpoint_auth_method: 'none',
    response_types: ['code'], scope: 'saved:read', application_type: 'native',
  };
  const registered = await invoke(store, '/oauth/register', payload);
  assert.equal(registered.status, 201); assert.equal(registered.body.token_endpoint_auth_method, 'none');
  assert.equal(registered.body.scope, 'saved:read');
  const context = await validateAuthorizationRequest({
    ...authorization(registered.body), redirect_uri: 'http://127.0.0.1:51234/callback',
    resource: `${origin}/mcp/personal`, scope: 'saved:read',
  }, store, origin);
  assert.equal(context.client_name, 'Codex'); assert.equal(context.scope, 'saved:read');
  assert.equal((await invoke(store, '/oauth/register', { ...payload, application_type: 'web', redirect_uris: ['https://client.test/callback'] })).status, 201);
  for (const invalid of ['', 'server', 'native '.padEnd(10000, 'x'), 123, ['native']]) {
    const response = await invoke(store, '/oauth/register', { ...payload, application_type: invalid });
    assert.equal(response.status, 400); assert.equal(response.body.error, 'invalid_client_metadata');
  }
});

for (const backend of ['memory', 'D1']) test(`${backend}: personal saved-library grants require their exact resource and scope without granting company access`, async () => {
  const fixture = backend === 'memory' ? { store: memoryMcpOAuthStore() } : sqliteStore();
  const { store } = fixture, client = await register(store), personal = `${origin}/mcp/personal`;
  const personalOptions = { ...options, authorizeResource: async (user, target) => user === 'user_abc' && target === personal };
  const parameters = { ...authorization(client), resource: personal, scope: 'saved:read' };
  const context = await validateAuthorizationRequest(parameters, store, origin);
  assert.equal(context.resource, personal); assert.equal(context.scope, 'saved:read');
  for (const patch of [
    { scope: 'company:read' }, { scope: 'saved:read company:read' }, { scope: 'saved:write' },
    { resource: `${personal}/user_abc` }, { resource: `${personal}/` }, { resource: `${personal}?company=abc` },
    { resource: `${origin}/mcp/company/company_abcdefgh` },
  ]) await assert.rejects(() => validateAuthorizationRequest({ ...parameters, ...patch }, store, origin), e => e instanceof OAuthError && e.status === 400);
  const consent = await invoke(store, '/oauth/authorize', { ...parameters, consent: true }, personalOptions, { origin });
  assert.equal(consent.status, 200);
  const code = new URL(consent.body.redirect_uri).searchParams.get('code');
  const token = await invoke(store, '/oauth/token', { ...exchange(client, code), resource: personal });
  assert.equal(token.status, 200); assert.equal(token.body.scope, 'saved:read');
  const identity = await verifyMcpToken(accessRequest(token.body.access_token, personal), store);
  assert.match(identity.grantId, /^[a-f0-9]{64}$/);
  assert.deepEqual(identity, { userId: 'user_abc', grantId: identity.grantId, resource: personal, scope: 'saved:read' });
  assert.equal(await verifyMcpToken(accessRequest(token.body.access_token, resource), store), null);
  assert.equal(await verifyMcpToken(accessRequest(token.body.access_token, `${origin}/mcp/company`), store), null);
  const refresh = { grant_type: 'refresh_token', client_id: client.client_id, refresh_token: token.body.refresh_token, resource: personal };
  assert.equal((await invoke(store, '/oauth/token', { ...refresh, scope: 'company:read' })).status, 400);
  assert.equal((await invoke(store, '/oauth/token', { ...refresh, resource, scope: 'company:read' })).status, 400);
  const rotated = await invoke(store, '/oauth/token', { ...refresh, scope: 'saved:read' });
  assert.equal(rotated.status, 200); assert.equal(rotated.body.scope, 'saved:read');
  assert.equal((await verifyMcpToken(accessRequest(rotated.body.access_token, personal), store)).grantId, identity.grantId);
  const companyCode = await getCode(store, client), company = await invoke(store, '/oauth/token', exchange(client, companyCode));
  assert.equal(company.status, 200);
  assert.equal(await verifyMcpToken(accessRequest(company.body.access_token, personal), store), null);
  assert.equal((await verifyMcpToken(accessRequest(company.body.access_token, resource), store)).scope, 'company:read');
  if (fixture.db) assert.deepEqual(fixture.db.prepare('SELECT DISTINCT scope FROM mcp_oauth_grants ORDER BY scope').all().map(g => g.scope), ['company:read', 'saved:read']);
  fixture.db?.close();
});

test('native OAuth accepts only the RFC 8252 loopback port exception and binds the actual callback at exchange', async () => {
  const store = memoryMcpOAuthStore();
  for (const registered of ['http://127.0.0.1/callback?source=codex', 'http://[::1]:2345/callback?source=codex']) {
    const registeredResponse = await invoke(store, '/oauth/register', { client_name: 'Codex native', redirect_uris: [registered], scope: 'company:read saved:read' });
    assert.equal(registeredResponse.status, 201); const client = registeredResponse.body;
    const host = new URL(registered).hostname;
    const actual = `http://${host}:51234/callback?source=codex`;
    const parameters = { ...authorization(client), redirect_uri: actual };
    assert.equal((await validateAuthorizationRequest(parameters, store, origin)).redirect_uri, actual);
    for (const changed of [
      `http://${host}:51234/other?source=codex`, `http://${host}:51234/callback?source=other`,
      `http://${host}:51234/call%62ack?source=codex`, 'http://localhost:51234/callback?source=codex',
      'http://127.0.0.2:51234/callback?source=codex', `https://${host}:51234/callback?source=codex`,
    ]) await assert.rejects(() => validateAuthorizationRequest({ ...parameters, redirect_uri: changed }, store, origin), e => e instanceof OAuthError && e.status === 400);
    const consent = await invoke(store, '/oauth/authorize', { ...parameters, consent: true }, options, { origin });
    assert.equal(consent.status, 200); const callback = new URL(consent.body.redirect_uri);
    assert.equal(callback.port, '51234'); assert.equal(callback.searchParams.get('iss'), origin);
    const code = callback.searchParams.get('code');
    assert.equal((await invoke(store, '/oauth/token', exchange(client, code))).status, 400);
    assert.equal((await invoke(store, '/oauth/token', { ...exchange(client, code), redirect_uri: actual })).status, 200);
  }
  const registration = await invoke(store, '/oauth/register', { client_name: 'Hosted callback', redirect_uris: ['https://client.test/callback'] });
  await assert.rejects(() => validateAuthorizationRequest({ ...authorization(registration.body), redirect_uri: 'https://client.test:51234/callback' }, store, origin), e => e instanceof OAuthError);
});

test('hosted AI locale hints do not change the validated authorization or its security checks', async () => {
  const store = memoryMcpOAuthStore(), client = await register(store), valid = authorization(client);
  const expected = await validateAuthorizationRequest(valid, store, origin);
  for (const ui_locales of ['en-US', 'fr-CA en-US', 'zh-Hant-TW']) {
    const parameters = { ...valid, ui_locales };
    assert.deepEqual(await validateAuthorizationRequest(new URLSearchParams(parameters), store, origin), expected);
    const consent = await invoke(store, '/oauth/authorize', { ...parameters, consent: true }, options, { origin });
    assert.equal(consent.status, 200);
    assert.equal(new URL(consent.body.redirect_uri).searchParams.has('ui_locales'), false);
    for (const patch of [{ redirect_uri: 'https://attacker.test/' }, { code_challenge_method: 'plain' }, { scope: 'saved:read' }, { resource: 'https://attacker.test/mcp/company' }]) {
      await assert.rejects(() => validateAuthorizationRequest({ ...parameters, ...patch }, store, origin), e => e instanceof OAuthError && e.status === 400);
    }
  }
  for (const ui_locales of ['', 123, ['en-US'], 'en-US\n<script>', 'en_US', 'x'.repeat(257)]) {
    await assert.rejects(() => validateAuthorizationRequest({ ...valid, ui_locales }, store, origin), e => e instanceof OAuthError && e.status === 400);
  }
  const repeated = new URLSearchParams({ ...valid, ui_locales: 'en-US' }); repeated.append('ui_locales', 'fr');
  await assert.rejects(() => validateAuthorizationRequest(repeated, store, origin), e => e instanceof OAuthError && e.status === 400);
  await assert.rejects(() => validateAuthorizationRequest({ ...valid, unrecognized: 'value' }, store, origin), e => e instanceof OAuthError && e.status === 400);
});

test('authorization validates registered redirect, PKCE and target before consent and membership', async () => {
  const store = memoryMcpOAuthStore(); const client = await register(store); const valid = authorization(client);
  assert.equal((await validateAuthorizationRequest(new URLSearchParams(valid), store, origin)).client_name, 'Test AI');
  for (const patch of [{ redirect_uri: 'https://attacker.test/' }, { code_challenge_method: 'plain' }, { resource: 'https://attacker.test/mcp/company/company_abcdefgh' }, { scope: 'company:write' }]) {
    await assert.rejects(() => validateAuthorizationRequest({ ...valid, ...patch }, store, origin), e => e instanceof OAuthError && e.status === 400);
  }
  assert.equal((await invoke(store, '/oauth/authorize', valid, options, { origin })).status, 403);
  assert.equal((await invoke(store, '/oauth/authorize', { ...valid, consent: true }, options, { origin: 'https://attacker.test' })).status, 403);
  assert.equal((await invoke(store, '/oauth/authorize', { ...valid, consent: true }, { ...options, authenticate: async () => null }, { origin })).status, 401);
  assert.equal((await invoke(store, '/oauth/authorize', { ...valid, consent: true }, { ...options, authorizeResource: async () => false }, { origin })).status, 403);
});

for (const backend of ['memory', 'D1']) test(`${backend}: PKCE exchange, one-time code, exact audience, refresh rotation and family revocation`, async () => {
  const fixture = backend === 'memory' ? { store: memoryMcpOAuthStore() } : sqliteStore();
  const { store } = fixture; const client = await register(store); const code = await getCode(store, client);
  const wrong = await invoke(store, '/oauth/token', { ...exchange(client, code), code_verifier: 'wrong'.repeat(16) }); assert.equal(wrong.status, 400);
  const token = await invoke(store, '/oauth/token', exchange(client, code)); assert.equal(token.status, 200);
  assert.equal((await invoke(store, '/oauth/token', exchange(client, code))).status, 400);
  const verified = await verifyMcpToken(accessRequest(token.body.access_token), store);
  assert.equal(verified.userId, 'user_abc'); assert.equal(verified.workspaceToken, 'company_abcdefgh');
  assert.equal(await verifyMcpToken(accessRequest(token.body.access_token, `${origin}/mcp/company/another_abcdefgh`), store), null);
  assert.equal(await verifyMcpToken(new Request(`${resource}?access_token=${token.body.access_token}`), store), null);
  assert.equal(await verifyMcpToken(new Request(resource, { headers: { authorization: 'Bearer clerk_session_value' } }), store), null);
  assert.equal((await invoke(store, '/oauth/token', { grant_type: 'refresh_token', client_id: client.client_id, refresh_token: token.body.refresh_token, resource: `${origin}/mcp/company/another_abcdefgh` })).status, 400);
  const refreshed = await invoke(store, '/oauth/token', { grant_type: 'refresh_token', client_id: client.client_id, refresh_token: token.body.refresh_token, resource }); assert.equal(refreshed.status, 200);
  assert.equal((await verifyMcpToken(accessRequest(refreshed.body.access_token), store)).grantId, verified.grantId);
  if (fixture.db) {
    const stored = fixture.db.prepare('SELECT * FROM mcp_oauth_tokens').all();
    assert.ok(stored.length >= 4); assert.ok(stored.every(row => /^[a-f0-9]{64}$/.test(row.token_hash)));
    assert.ok(!JSON.stringify(stored).includes(token.body.access_token)); assert.ok(!JSON.stringify(stored).includes(token.body.refresh_token));
    assert.equal(fixture.db.prepare('SELECT COUNT(*) AS n FROM mcp_oauth_codes').get().n, 0);
  }
  assert.equal((await invoke(store, '/oauth/revoke', { token: token.body.refresh_token, client_id: client.client_id })).status, 200);
  assert.equal(await verifyMcpToken(accessRequest(refreshed.body.access_token), store), null);
  assert.equal(await verifyMcpToken(accessRequest(token.body.access_token), store), null);
  assert.equal((await invoke(store, '/oauth/token', { grant_type: 'refresh_token', client_id: client.client_id, refresh_token: refreshed.body.refresh_token, resource })).status, 400);
  fixture.db?.close();
});

for (const backend of ['memory', 'D1']) test(`${backend}: refresh-token reuse revokes the active lineage`, async () => {
  const fixture = backend === 'memory' ? { store: memoryMcpOAuthStore() } : sqliteStore();
  const { store } = fixture, client = await register(store), code = await getCode(store, client);
  const token = await invoke(store, '/oauth/token', exchange(client, code));
  const parameters = { grant_type: 'refresh_token', client_id: client.client_id, refresh_token: token.body.refresh_token, resource };
  const rotated = await invoke(store, '/oauth/token', parameters);
  assert.equal(rotated.status, 200);
  assert.ok(await verifyMcpToken(accessRequest(rotated.body.access_token), store));
  assert.equal((await invoke(store, '/oauth/token', parameters)).status, 400);
  assert.equal(await verifyMcpToken(accessRequest(rotated.body.access_token), store), null);
  assert.equal((await invoke(store, '/oauth/token', { ...parameters, refresh_token: rotated.body.refresh_token })).status, 400);
  fixture.db?.close();
});

test('memory: parallel code exchanges cannot mint two grants and registrations have a hard storage cap', async () => {
  const store = memoryMcpOAuthStore(), client = await register(store), code = await getCode(store, client);
  const [first, second] = await Promise.all([invoke(store, '/oauth/token', exchange(client, code)), invoke(store, '/oauth/token', exchange(client, code))]);
  assert.deepEqual([first.status, second.status].sort(), [200, 400]);
  for (let i = 1; i < 1000; i++) assert.equal(await store.putClient({ client_id: `id_${i}`, client_name: 'Dev', redirect_uris: ['https://client.test/callback'], created_at: 1 }), true);
  assert.equal(await store.putClient({ client_id: 'too_many', client_name: 'Dev', redirect_uris: ['https://client.test/callback'], created_at: 1 }), false);
});
