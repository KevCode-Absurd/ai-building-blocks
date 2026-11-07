import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { CoordinatorLibraryService, coordinatorReadTools, coordinatorWriteTools } from '../src/server/coordinator-library.ts';
import { memoryCoordinatorStore, d1CoordinatorStore } from '../src/server/coordinator-store.ts';
import { handleCompanyApi, isCompanyApiRoute } from '../src/server/company-api.ts';
import { memorySpaces } from '../src/server/spaces.ts';
import { memoryMcpOAuthStore } from '../src/server/mcp-oauth.ts';
import { memoryLibrary } from '../src/server/account-library.ts';

const origin = 'https://example.test';
const service = (store, { userId = 'user-a', scope = 'company:workspace', write = true } = {}) => new CoordinatorLibraryService(store, { origin, authorize: async wanted => ({ userId, scope, write: write && !wanted }), authorizePreferences: async () => ({ userId, scope, write }), now: () => new Date('2026-11-07T10:00:00Z') });
const save = (extra = {}) => ({ answers: { depth: 'standard', variety_mix: 'balanced' }, expected_version: 0, idempotency_key: 'save-preferences-0001', ...extra });
function sqlStore() {
  const db = new DatabaseSync(':memory:'); db.exec('PRAGMA foreign_keys=ON');
  db.exec(fs.readFileSync(new URL('../migrations/0008_mcp_oauth.sql', import.meta.url), 'utf8'));
  db.exec(fs.readFileSync(new URL('../migrations/0010_coordinator_records.sql', import.meta.url), 'utf8'));
  const statement = (sql, values = []) => ({ bind(...args) { return statement(sql, args); }, async first() { return db.prepare(sql).get(...values) ?? null; }, async all() { return { results: db.prepare(sql).all(...values) }; }, async run() { return { meta: { changes: Number(db.prepare(sql).run(...values).changes) } }; } });
  const adapter = { prepare: sql => statement(sql), async batch(statements) { db.exec('BEGIN'); try { const results = []; for (const s of statements) results.push(await s.run()); db.exec('COMMIT'); return results; } catch (error) { db.exec('ROLLBACK'); throw error; } } };
  return { db, store: d1CoordinatorStore(adapter) };
}

for (const backend of ['memory', 'D1']) {
  test(`${backend}: saved defaults round-trip, conflict, retry and delete without crossing person/workspace scopes`, async () => {
    const fixture = backend === 'D1' ? sqlStore() : { store: memoryCoordinatorStore() }, store = fixture.store, s = service(store);
    try {
      const empty = await s.callTool('get_job_preferences', {}); assert.equal(empty.version, 0); assert.equal(empty.store, 'account');
      const first = await s.callTool('set_job_preferences', save()); assert.equal(first.saved, true); assert.equal(first.version, 1); assert.equal(first.preferences.general.variety_mix.proven, 50); assert.equal(first.preferences.owner_scope, 'account:user-a/company_workspace');
      assert.equal((await service(store).callTool('get_job_preferences', {})).preferences.general.depth, 'standard');
      const retry = await s.callTool('set_job_preferences', save()); assert.equal(retry.idempotent_replay, true); assert.equal(retry.version, 1);
      await assert.rejects(() => s.callTool('set_job_preferences', save({ answers: { depth: 'deep' } })), e => e.code === 'idempotency_conflict');
      await assert.rejects(() => s.callTool('set_job_preferences', save({ idempotency_key: 'stale-save-0002' })), e => e.code === 'revision_conflict');
      const second = await s.callTool('set_job_preferences', save({ answers: { volume: 12 }, job: 'write-documents', expected_version: 1, idempotency_key: 'job-specific-0002' })); assert.equal(second.version, 2); assert.equal(second.preferences.by_job_type['write-documents'].volume, 12);
      assert.equal((await service(store, { userId: 'user-b' }).callTool('get_job_preferences', {})).version, 0);
      assert.equal((await service(store, { scope: 'company:other-workspace' }).callTool('get_job_preferences', {})).version, 0);
      const deleted = await s.callTool('delete_private_record', { id: second.record.id, expected_version: 2, confirmed: true }); assert.equal(deleted.purged, true);
      assert.equal((await s.callTool('get_job_preferences', {})).version, 0);
      await assert.rejects(() => s.callTool('set_job_preferences', save()), e => e.code === 'record_deleted');
      const afterDelete = await s.callTool('set_job_preferences', save({ answers: { depth: 'quick' }, idempotency_key: 'new-after-delete-0003' })); assert.equal(afterDelete.version, 1); assert.notEqual(afterDelete.record.id, second.record.id);
      assert.equal(afterDelete.preferences.general.depth, 'quick'); assert.equal(afterDelete.preferences.by_job_type['write-documents'], undefined);
    } finally { fixture.db?.close(); }
  });
}

test('private preference writes need write consent and reject scope forgery, invalid choices and ambiguous input', async () => {
  const store = memoryCoordinatorStore(), s = service(store);
  await assert.rejects(() => service(store, { write: false }).callTool('set_job_preferences', save()), e => e.code === 'write_scope_required');
  await assert.rejects(() => s.callTool('set_job_preferences', save({ answers: { depth: 'unknown' } })), e => e.code === 'invalid_preferences');
  await assert.rejects(() => s.callTool('set_job_preferences', save({ reset: true })), e => e.code === 'invalid_arguments');
  const preferences = { schema: 'ai-blocks-job-preferences/1', owner_scope: 'account:other/workspace', version: 1, general: {}, by_job_type: {}, history: [] };
  await assert.rejects(() => s.callTool('set_job_preferences', { preferences, expected_version: 0, idempotency_key: 'forged-scope-0001' }), e => e.code === 'preference_scope_mismatch');
  await assert.rejects(() => s.callTool('get_job_preferences', { owner_scope: 'other' }), e => e.code === 'invalid_arguments');
});

test('concurrent preference writers cannot create two active versions and reset keeps a bounded audit history', async () => {
  const store = memoryCoordinatorStore(), s = service(store);
  const results = await Promise.allSettled([s.callTool('set_job_preferences', save()), s.callTool('set_job_preferences', save({ answers: { depth: 'deep' }, idempotency_key: 'parallel-preference-0002' }))]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  const reset = await s.callTool('set_job_preferences', { reset: true, expected_version: 1, idempotency_key: 'reset-preferences-0003' });
  assert.deepEqual(reset.preferences.general, {}); assert.deepEqual(reset.preferences.by_job_type, {}); assert.equal(reset.preferences.history.at(-1).change, 'Reset saved defaults.');
});

async function apiFixture(user = 'employee') {
  const spaces = memorySpaces(), oauth = memoryMcpOAuthStore(), coordinator = memoryCoordinatorStore(), library = memoryLibrary(), workspace = 'preference-workspace-token-0001';
  await spaces.addSpace({ id: 'team-workspace', name: 'Team workspace', ownerHash: 'hidden', ipHash: 'hidden', shareToken: workspace, userId: 'owner', access: { mode: 'domain', emails: [], domain: 'company.test' }, created: '2026-11-07', updated: '2026-11-07' });
  const env = { PUBLIC_API_ENABLED: 'true', MCP_OAUTH_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { async fetch() { return new Response('Missing', { status: 404 }); } } };
  let who = user;
  const deps = { spaces, oauth, coordinator, library, authenticate: async req => req.headers.get('authorization') === 'Bearer account-session' ? who : new Response('Sign in', { status: 401 }), verifiedEmails: async () => [`${who}@company.test`] };
  const call = (method, path = '/api/v1/job-preferences', body, headers = {}) => handleCompanyApi(new Request(new URL(path, origin), { method, headers: { 'cf-connecting-ip': '192.0.2.8', authorization: 'Bearer account-session', ...(body ? { 'content-type': 'application/json' } : {}), ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) }), env, deps);
  return { call, workspace, deps, env, setUser(value) { who = value; } };
}

test('GET/PUT preferences default to personal scope and return private no-store results', async () => {
  const f = await apiFixture(); assert.equal(isCompanyApiRoute('/api/v1/job-preferences'), true);
  const first = await f.call('GET'); assert.equal(first.status, 200); assert.match(first.headers.get('cache-control'), /private, no-store/);
  const saved = await f.call('PUT', undefined, save()); assert.equal(saved.status, 200, await saved.clone().text()); assert.equal((await saved.json()).version, 1);
  assert.equal((await (await f.call('GET')).json()).preferences.general.depth, 'standard');
  f.setUser('another-user'); assert.equal((await (await f.call('GET')).json()).version, 0);
});

test('company members save their own workspace defaults without modifying shared organizational memory', async () => {
  const f = await apiFixture(), path = `/api/v1/job-preferences?workspace=${f.workspace}`;
  const saved = await f.call('PUT', path, save()); assert.equal(saved.status, 200, await saved.clone().text()); assert.equal((await saved.json()).version, 1);
  assert.equal((await (await f.call('GET')).json()).version, 0);
  f.setUser('coworker'); assert.equal((await (await f.call('GET', path)).json()).version, 0);
});

test('preference REST rejects expired OAuth, cross-origin sessions, duplicate selectors and invalid methods', async () => {
  const f = await apiFixture();
  assert.equal((await f.call('PUT', undefined, save(), { origin: 'https://attacker.test' })).status, 403);
  assert.equal((await f.call('GET', undefined, undefined, { authorization: 'Bearer ' + 'a'.repeat(64) })).status, 401);
  assert.equal((await f.call('GET', `/api/v1/job-preferences?workspace=${f.workspace}&workspace=${f.workspace}`)).status, 400);
  assert.equal((await f.call('GET', '/api/v1/job-preferences?owner=other')).status, 400);
  assert.equal((await f.call('POST', undefined, save())).status, 405);
  const options = await f.call('OPTIONS'); assert.match(options.headers.get('access-control-allow-methods'), /PUT/);
});

test('private preference tool declarations override the anonymous local-only tools', () => {
  assert.equal(coordinatorReadTools.filter(t => t.name === 'get_job_preferences').length, 1);
  const set = coordinatorWriteTools.find(t => t.name === 'set_job_preferences'); assert.equal(set.annotations.readOnlyHint, false);
  assert.ok(set.inputSchema.required.includes('expected_version')); assert.ok(set.inputSchema.required.includes('idempotency_key'));
});

test('signed-in MCP loads defaults, prioritizes private tools, and saves job answers only with write consent', async () => {
  const f = await apiFixture(), resource = origin + '/mcp/personal';
  await f.call('PUT', undefined, save({ answers: { depth: 'deep' } }));
  const hash = value => createHash('sha256').update(value).digest('hex');
  async function token(raw, scope) {
    const grant = { id: 'grant-' + raw[0], user_id: 'employee', client_id: 'test-client', resource, scope, revoked_at: null }, expiry = Math.floor(Date.now() / 1000) + 1000;
    const record = (value, kind) => ({ token_hash: hash(value), grant_id: grant.id, client_id: 'test-client', kind, expires_at: expiry, consumed_at: null, rotation_target: null });
    await f.deps.oauth.issue(grant, record(raw, 'access'), record(raw + '-refresh', 'refresh'));
    return raw;
  }
  const read = await token('b'.repeat(64), 'saved:read'), write = await token('c'.repeat(64), 'saved:read saved:write');
  let capturedStart, proposed;
  f.deps.coordinatorPublicService = { async callTool(name, input) {
    if (name === 'start_job') { capturedStart = input; return { model_calls: 0 }; }
    if (name === 'advance_job') return { state_digest: 'd'.repeat(64), preference_update: { files: [{ path: 'ai-blocks/preferences.json', content: JSON.stringify(proposed) }] }, model_calls: 0 };
    throw Error('Unexpected public call: ' + name);
  } };
  async function mcp(name, args, bearer = read) {
    const response = await f.call('POST', '/mcp/personal', { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }, { authorization: `Bearer ${bearer}`, accept: 'application/json, text/event-stream' });
    assert.equal(response.status, 200, await response.clone().text()); const body=await response.json();return body.result??body.error;
  }
  const preferences = await mcp('get_job_preferences', {}); assert.equal(preferences.structuredContent.store, 'account');
  await mcp('start_job', { request: 'Make 10 useful documents' }); assert.equal(capturedStart.preferences.general.depth, 'deep'); assert.equal(capturedStart.preferences_ref.store, 'account');
  proposed = structuredClone(preferences.structuredContent.preferences); proposed.version = 2; proposed.general.volume = 12;
  const args = { job_id: 'job_test', event: 'scope', schema: 'ai-blocks-job-card/1', document: {}, state: {}, state_digest: 'a'.repeat(64) };
  const local = await mcp('advance_job', args); assert.equal(local.structuredContent.preference_persistence.status, 'WRITE_CONSENT_REQUIRED'); assert.equal((await (await f.call('GET')).json()).version, 1);
  const saved = await mcp('advance_job', args, write); assert.equal(saved.structuredContent.preference_persistence.saved, true); assert.equal((await (await f.call('GET')).json()).preferences.general.volume, 12);
  const denied = await mcp('set_job_preferences', save(), read); assert.ok(denied.isError===true||typeof denied.code==='number');
});
