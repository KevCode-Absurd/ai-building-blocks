import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { checkMcpAccessLive } from '../../tools/check-mcp-access-live.mjs';
import { handleCompanyApi } from '../src/server/company-api.ts';
import { memorySpaces } from '../src/server/spaces.ts';
import { memoryMcpOAuthStore } from '../src/server/mcp-oauth.ts';

const origin = 'https://staging.example.test', share = 'dedicated-staging-company-fixture';
const resource = `${origin}/mcp/company/${share}`;
async function fixture() {
  const spaces = memorySpaces(), oauth = memoryMcpOAuthStore();
  const space = { id: 'fixture-company', name: 'Dedicated staging fixture', userId: 'fixture-owner', ownerHash: 'owner-private', ipHash: 'ip-private', shareToken: share, access: { mode: 'domain', emails: [], domain: 'example.test' }, created: 'stamp', updated: 'stamp' };
  await spaces.addSpace(space);
  await spaces.addSpace({ ...space, id: 'foreign-company', userId: 'other-owner', shareToken: 'foreign-staging-company-fixture' });
  const custom = { slug: 'custom-fixture-method', name: 'Fixture method', markdown: '# Method\nRead the source and check it.' };
  const flow = { goal: 'Read and check the source', nodes: [{ id: 'step', slug: custom.slug, x: 0, y: 0 }], edges: [], customSkills: [custom] };
  const rows = [
    { id: 'visible', kind: 'skill', body: '# Fixture skill\nUse [method](references/method.md).', data: { files: { 'references/method.md': 'Check the source.' } } },
    { id: 'hidden', kind: 'skill', body: 'HIDDEN STAGING SECRET', data: null },
    { id: 'foreign', kind: 'skill', body: 'FOREIGN STAGING SECRET', data: null, spaceId: 'foreign-company' },
    { id: 'workflow', kind: 'workflow', body: '', data: flow },
    { id: 'missing-reference', kind: 'workflow', body: '', data: { ...flow, customSkills: [{ ...custom, markdown: '# Method\nRead [missing](references/staging-missing.md).' }] } },
  ];
  for (const row of rows) await spaces.addItem({ spaceId: space.id, title: row.id, summary: '', visibility: 'private', hidden: false, created: 'stamp', updated: 'stamp', ...row });
  const env = { PUBLIC_API_ENABLED: 'true', MCP_OAUTH_ENABLED: 'true', API_ALLOWED_HOSTS: 'staging.example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { async fetch() { return new Response('Missing', { status: 404 }); } } };
  const handle = request => handleCompanyApi(request, env, { spaces, oauth, authenticate: async () => 'employee', verifiedEmails: async () => ['employee@example.test'] });
  const post = (path, data, headers = {}) => handle(new Request(new URL(path, origin), { method: 'POST', headers: { 'cf-connecting-ip': '192.0.2.11', 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) }));
  const client = await (await post('/oauth/register', { client_name: 'Staging access test', redirect_uris: ['https://native-client.test/callback'] })).json();
  const verifier = 'v'.repeat(64);
  const authorization = { client_id: client.client_id, redirect_uri: client.redirect_uris[0], response_type: 'code', code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256', scope: 'company:read', resource, state: 'test-state' };
  const consent = await (await post('/oauth/authorize', { ...authorization, consent: true }, { origin })).json();
  const token = await (await post('/oauth/token', { grant_type: 'authorization_code', client_id: client.client_id, redirect_uri: client.redirect_uris[0], code: new URL(consent.redirect_uri).searchParams.get('code'), code_verifier: verifier, resource })).json();
  assert.match(token.access_token, /^[a-f0-9]{64}$/);
  const fixtureIds = { workspaceId: space.id, verifiedEmail: 'employee@example.test', visibleItemId: 'visible', hiddenItemId: 'hidden', foreignItemId: 'foreign', workflowItemId: 'workflow', missingReferenceItemId: 'missing-reference' };
  const initial = { space: structuredClone(space), items: await Promise.all(rows.map(r => spaces.item(r.id))) };
  let mutations = 0, restorations = 0, failureAt = null;
  const admin = {
    async assertFixtureScope() { return { environment: 'staging', fixtureOnly: true }; },
    async snapshot() { return structuredClone(initial); },
    async setAccess(access) { mutations++; await spaces.updateSpace(space.id, { access }); },
    async setShareToken(shareToken) { mutations++; await spaces.updateSpace(space.id, { shareToken }); },
    async patchItem(id, patch) { mutations++; assert.ok(rows.some(r => r.id === id)); await spaces.updateItem(id, patch); if (failureAt === id) throw Error('private admin error must not escape'); },
    async restore(snapshot) { restorations++; await spaces.updateSpace(space.id, { access: snapshot.space.access, shareToken: snapshot.space.shareToken, updated: snapshot.space.updated }); for (const item of snapshot.items) await spaces.updateItem(item.id, item); },
  };
  const options = { stagingOrigin: origin, expectedStagingOrigin: origin, companyResource: resource, accessToken: token.access_token, fixture: fixtureIds, admin, fetchImpl: async (input, init) => { const headers = new Headers(init.headers); headers.set('cf-connecting-ip', '192.0.2.11'); return handle(new Request(input, { ...init, headers })); } };
  return { options, spaces, initial, token, mutations: () => mutations, restorations: () => restorations, failPatch(id) { failureAt = id; } };
}

test('live access runner exercises real OAuth-bound REST/native MCP policy changes and exactly restores all scoped state', async () => {
  const f = await fixture(), result = await checkMcpAccessLive(f.options);
  assert.equal(result.ok, true, JSON.stringify(result)); assert.equal(result.restored, true);
  for (const name of ['domain_nonmember:native_initialize', 'domain_nonmember:native_tool_discovery', 'invitation_removed:rest', 'link_only_member_denied:native_initialize', 'old_shared_link_revoked:rest', 'hidden_item_denied', 'foreign_item_denied', 'native_foreign_tool_error', 'stale_resource_revision_denied', 'stale_workflow_revision_denied', 'stale_approval_denied', 'malformed_graph_blocks_execution', 'missing_reference_blocks_execution']) assert.ok(result.checks.some(c => c.check === name && c.status === 'PASS'), name);
  assert.equal(f.restorations(), 1); assert.ok(f.mutations() > 10);
  assert.deepEqual(await f.spaces.spaceByShare(share), f.initial.space);
  for (const item of f.initial.items) assert.deepEqual(await f.spaces.item(item.id), item);
  assert.ok(!JSON.stringify(result).includes(f.token.access_token));
  assert.doesNotMatch(JSON.stringify(result), /HIDDEN STAGING SECRET|FOREIGN STAGING SECRET|owner-private|ip-private/);
});

test('live access runner restores its initial snapshot even if a scoped admin hook mutates then fails', async () => {
  const f = await fixture(); f.failPatch('visible');
  const result = await checkMcpAccessLive(f.options);
  assert.equal(result.ok, false); assert.equal(result.restored, true); assert.equal(f.restorations(), 1);
  assert.doesNotMatch(JSON.stringify(result), /private admin error|access_token/);
  assert.deepEqual(await f.spaces.spaceByShare(share), f.initial.space);
  for (const item of f.initial.items) assert.deepEqual(await f.spaces.item(item.id), item);
});

test('live access runner refuses production and unscoped hooks before any mutation', async () => {
  const f = await fixture();
  for (const target of ['https://useaiblocks.com', 'https://www.useaiblocks.com', 'https://production.example.test']) await assert.rejects(checkMcpAccessLive({ ...f.options, stagingOrigin: target, expectedStagingOrigin: target, companyResource: `${target}/mcp/company/${share}` }), /Production is forbidden/);
  await assert.rejects(checkMcpAccessLive({ ...f.options, admin: { ...f.options.admin, assertFixtureScope: async () => ({ environment: 'production', fixtureOnly: true }) } }), /staging-only/);
  assert.equal(f.mutations(), 0); assert.equal(f.restorations(), 0);
});

test('live access runner marks restoration failure as a release blocker without disclosing its snapshot', async () => {
  const f = await fixture();
  const result = await checkMcpAccessLive({ ...f.options, admin: { ...f.options.admin, restore: async () => { throw Error('private snapshot contents'); } } });
  assert.equal(result.ok, false); assert.equal(result.restored, false);
  assert.match(result.error, /Stop release work/);
  assert.ok(result.checks.some(c => c.check === 'fixture_restored' && c.status === 'FAIL'));
  assert.doesNotMatch(JSON.stringify(result), /private snapshot contents|owner-private|ip-private/);
  await f.options.admin.restore(f.initial);
});
