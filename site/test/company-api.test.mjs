import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { handleCompanyApi } from '../src/server/company-api.ts';
import { handlePublicApi } from '../src/server/public-api.ts';
import { memorySpaces } from '../src/server/spaces.ts';
import { memoryMcpOAuthStore } from '../src/server/mcp-oauth.ts';
import { memoryLibrary } from '../src/server/account-library.ts';

const origin = 'https://example.test', workspace = 'selected-company-workspace-token';
const endpoint = `${origin}/mcp/company/${workspace}`;
const edge = { 'cf-connecting-ip': '192.0.2.8' };
const verifier = 'v'.repeat(64), challenge = createHash('sha256').update(verifier).digest('base64url');
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'company-api-test', version: '1' } } };
async function fixture(changes = {}) {
  const spaces = memorySpaces(), oauth = memoryMcpOAuthStore(), library = memoryLibrary();
  const stamp = '2026-10-23T00:00:00Z';
  await spaces.addSpace({ id: 'company', name: 'Company methods', ownerHash: 'OWNER_HASH_MUST_NOT_LEAK', ipHash: 'IP_HASH_MUST_NOT_LEAK', shareToken: workspace, userId: 'owner', access: { mode: 'domain', emails: [], domain: 'company.test' }, created: stamp, updated: stamp });
  await spaces.addSpace({ id: 'other', name: 'Other company', ownerHash: 'FOREIGN_OWNER_HASH', ipHash: 'FOREIGN_IP_HASH', shareToken: 'other-company-workspace-token', userId: 'other-owner', access: { mode: 'invited', emails: [], domain: '' }, created: stamp, updated: stamp });
  await spaces.addItem({ id: 'private-skill', spaceId: 'company', kind: 'skill', title: 'Company evidence method', summary: 'Use internal evidence', body: '# Method\nRead [evidence](references/evidence.md).\n', data: { files: { 'references/evidence.md': 'INTERNAL EVIDENCE: α reference.' } }, visibility: 'private', hidden: false, created: stamp, updated: stamp });
  await spaces.addItem({ id: 'foreign-skill', spaceId: 'other', kind: 'skill', title: 'Other company method', summary: 'FOREIGN COMPANY SECRET', body: 'FOREIGN COMPANY SECRET', data: null, visibility: 'private', hidden: false, created: stamp, updated: stamp });
  const env = {
    PUBLIC_API_ENABLED: 'true', MCP_OAUTH_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test',
    API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } },
    OPENAI_API_KEY: 'fake-key-must-never-be-used',
    ASSETS: { async fetch(request) { return new URL(request.url).pathname === '/connect-mcp' ? new Response('<!doctype html><title>Connect AI Blocks</title><main id="consent"></main>', { headers: { 'content-type': 'text/html' } }) : new Response('Missing', { status: 404 }); } },
    ...changes,
  };
  let emails = ['employee@company.test'];
  const deps = { spaces, oauth, library, authenticate: async request => request.headers.get('authorization') === 'Bearer clerk-session-test' ? 'employee' : new Response('Sign in', { status: 401 }), verifiedEmails: async () => emails };
  const handle = request => handleCompanyApi(request, env, deps);
  const post = (path, data, headers = {}) => handle(new Request(new URL(path, origin), { method: 'POST', headers: { ...edge, 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) }));
  const get = (path, headers = {}) => handle(new Request(new URL(path, origin), { headers: { ...edge, ...headers } }));
  return { env, spaces, oauth, library, deps, handle, post, get, setEmails(value) { emails = value; } };
}
async function connect(f, clientName = 'Company AI') {
  const registration = await f.post('/oauth/register', { client_name: clientName, redirect_uris: ['https://client.test/callback'] });
  assert.equal(registration.status, 201); const client = await registration.json();
  const authorization = { client_id: client.client_id, redirect_uri: client.redirect_uris[0], response_type: 'code', code_challenge: challenge, code_challenge_method: 'S256', scope: 'company:read', resource: endpoint, state: 'client_csrf_state' };
  const contextResponse = await f.get(`/oauth/authorization-context?${new URLSearchParams(authorization)}`);
  assert.equal(contextResponse.status, 200); const context = await contextResponse.json(); assert.equal(context.client_name, clientName);
  const consent = await f.post('/oauth/authorize', { ...authorization, consent: true }, { origin, authorization: 'Bearer clerk-session-test' });
  assert.equal(consent.status, 200); const destination = new URL((await consent.json()).redirect_uri);
  assert.equal(destination.searchParams.get('state'), 'client_csrf_state');
  const response = await f.post('/oauth/token', { grant_type: 'authorization_code', code: destination.searchParams.get('code'), client_id: client.client_id, redirect_uri: client.redirect_uris[0], code_verifier: verifier, resource: endpoint });
  assert.equal(response.status, 200);
  return { client, authorization, token: await response.json() };
}

test('company OAuth and actual SDK client retrieve private skills and references directly, including REST', async () => {
  const f = await fixture(), connection = await connect(f);
  const transport = new StreamableHTTPClientTransport(new URL(endpoint), { fetch: async (input, init) => {
    const request = new Request(input, init), headers = new Headers(request.headers); headers.set('authorization', `Bearer ${connection.token.access_token}`); headers.set('cf-connecting-ip', edge['cf-connecting-ip']);
    return f.handle(new Request(request, { headers }));
  } });
  const client = new Client({ name: 'company-official-sdk-test', version: '1' });
  try {
    await client.connect(transport);
    assert.equal(client.getServerVersion().name, 'ai-blocks-company-workspace');
    assert.deepEqual((await client.listTools()).tools.map(t => t.name), ['list_company_items', 'get_company_item', 'get_company_resource', 'prepare_company_workflow', 'start_outcome', 'advance_outcome', 'record_outcome_decision', 'record_outcome_experiment', 'read_back_outcome_experiment', 'prepare_outcome_pattern', 'start_job', 'advance_job', 'propose_team', 'get_approaches', 'get_job_templates', 'get_job_preferences', 'set_job_preferences', 'scope_specialist_request', 'prepare_scoped_specialist_work', 'route_scoped_specialist_work', 'prepare_scoped_specialist_team', 'prepare_recommendation_handoff', 'prepare_specialist_team', 'checkpoint_specialist_team', 'find_specialist', 'prepare_specialist', 'search_library', 'plan_workflow', 'get_skill', 'get_workflow', 'get_resource', 'prepare_workflow', 'get_item', 'search', 'fetch']);
    const list = await client.callTool({ name: 'list_company_items', arguments: {} });
    assert.ok(list.structuredContent.items.some(i => i.item_id === 'private-skill'));
    assert.doesNotMatch(JSON.stringify(list), /FOREIGN COMPANY SECRET|OWNER_HASH_MUST_NOT_LEAK|IP_HASH_MUST_NOT_LEAK/);
    const item = await client.callTool({ name: 'get_company_item', arguments: { item_id: 'private-skill' } });
    const revision = item.structuredContent.revision_sha256;
    const reference = await client.callTool({ name: 'get_company_resource', arguments: { item_id: 'private-skill', path: 'references/evidence.md', revision_sha256: revision } });
    assert.equal(Buffer.from(reference.structuredContent.content, 'base64').toString('utf8'), 'INTERNAL EVIDENCE: α reference.');
    const bearer = { authorization: `Bearer ${connection.token.access_token}` };
    const rest = await f.get(`/api/v1/company/${workspace}/items/private-skill`, bearer); assert.equal(rest.status, 200); assert.equal((await rest.json()).revision_sha256, revision);
    const restResource = await f.get(`/api/v1/company/${workspace}/resources/private-skill?path=references%2Fevidence.md&revision_sha256=${revision}`, bearer);
    assert.equal(restResource.status, 200); assert.match(Buffer.from((await restResource.json()).content, 'base64').toString('utf8'), /INTERNAL EVIDENCE/);
    const foreign = await client.callTool({ name: 'get_company_item', arguments: { item_id: 'foreign-skill' } }); assert.equal(foreign.isError, true); assert.doesNotMatch(JSON.stringify(foreign), /FOREIGN COMPANY SECRET/);
    const wrongCompany = await f.get('/api/v1/company/other-company-workspace-token/items', bearer); assert.equal(wrongCompany.status, 401);
  } finally { await client.close(); }
});

test('private endpoint advertises OAuth discovery; token and current membership revocations deny subsequent reads', async () => {
  const f = await fixture();
  const anonymous = await f.post(`/mcp/company/${workspace}`, init, { accept: 'application/json, text/event-stream' });
  assert.equal(anonymous.status, 401); assert.match(anonymous.headers.get('www-authenticate'), /oauth-protected-resource/);
  const metadata = await f.get(`/.well-known/oauth-protected-resource/mcp/company/${workspace}`); assert.equal(metadata.status, 200); assert.equal((await metadata.json()).resource, endpoint);
  const { client, token } = await connect(f); const bearer = { authorization: `Bearer ${token.access_token}` };
  assert.equal((await f.get(`/api/v1/company/${workspace}/items`, bearer)).status, 200);
  f.setEmails(['employee@company.test.attacker.test']);
  assert.equal((await f.get(`/api/v1/company/${workspace}/items`, bearer)).status, 403);
  f.setEmails(['employee@company.test']);
  await f.spaces.updateSpace('company', { access: { mode: 'invited', emails: [], domain: '' } });
  assert.equal((await f.get(`/api/v1/company/${workspace}/items`, bearer)).status, 403);
  await f.spaces.updateSpace('company', { access: { mode: 'domain', emails: [], domain: 'company.test' } });
  assert.equal((await f.post('/oauth/revoke', { token: token.refresh_token, client_id: client.client_id })).status, 200);
  assert.equal((await f.get(`/api/v1/company/${workspace}/items`, bearer)).status, 401);
});

test('company connection is explicitly gated; consent is authenticated, scoped and never reflects client markup', async () => {
  const disabled = await fixture({ MCP_OAUTH_ENABLED: 'false' });
  assert.equal((await disabled.get('/.well-known/oauth-authorization-server')).status, 503);
  const f = await fixture(), hostile = '<img src=x onerror=alert(1)>', { authorization } = await connect(f, hostile);
  const page = await f.get(`/oauth/authorize?${new URLSearchParams(authorization)}`);
  assert.equal(page.status, 200); assert.equal(page.headers.get('x-frame-options'), 'DENY'); assert.doesNotMatch(await page.text(), /onerror|alert\(1\)/);
  for (const alias of ['/connect-mcp', '/connect-mcp.html']) {
    const direct = await f.get(`${alias}?${new URLSearchParams(authorization)}`);
    assert.equal(direct.status, 200); assert.equal(direct.headers.get('x-frame-options'), 'DENY');
    assert.match(direct.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.equal(direct.headers.get('cache-control'), 'private, no-store');
    assert.equal((await f.get(alias)).status, 400, 'Direct consent aliases still validate registered OAuth parameters.');
  }
  const noSession = await f.post('/oauth/authorize', { ...authorization, consent: true }, { origin }); assert.equal(noSession.status, 401);
  const noConsent = await f.post('/oauth/authorize', authorization, { origin, authorization: 'Bearer clerk-session-test' }); assert.equal(noConsent.status, 403);
  const wrongScope = await f.get(`/oauth/authorization-context?${new URLSearchParams({ ...authorization, scope: 'company:write' })}`); assert.equal(wrongScope.status, 400);
  const otherResource = await f.post('/oauth/authorize', { ...authorization, resource: `${origin}/mcp/company/other-company-workspace-token`, consent: true }, { origin, authorization: 'Bearer clerk-session-test' }); assert.equal(otherResource.status, 403);
});

test('allowed browser clients can discover the OAuth challenge without reading private content', async () => {
  const f = await fixture({ PUBLIC_API_ALLOWED_ORIGINS: 'https://client.test' });
  const response = await f.post(`/mcp/company/${workspace}`, init, { origin: 'https://client.test', accept: 'application/json, text/event-stream' });
  assert.equal(response.status, 401);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://client.test');
  assert.match(response.headers.get('access-control-expose-headers'), /WWW-Authenticate/);
  assert.match(response.headers.get('www-authenticate'), /oauth-protected-resource/);
  assert.doesNotMatch(await response.text(), /INTERNAL EVIDENCE|FOREIGN COMPANY SECRET/);
});

test('OAuth/company operations make zero ambient provider calls; public API never reads the private database', async () => {
  const f = await fixture(), previous = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('No ambient provider or external fetch is permitted in this integration test'); };
  try {
    const { token } = await connect(f);
    const result = await f.get(`/api/v1/company/${workspace}/items/private-skill`, { authorization: `Bearer ${token.access_token}` });
    assert.equal(result.status, 200);
    Object.defineProperty(f.env, 'SPACES', { get() { throw new Error('Public API must never inspect the private store'); } });
    const publicResponse = await handlePublicApi(new Request(`${origin}/api/v1/status`, { headers: edge }), f.env);
    assert.equal(publicResponse.status, 200); assert.equal((await publicResponse.json()).model_calls, false);
  } finally { globalThis.fetch = previous; }
});

test('personal saved library uses a distinct OAuth grant and reuses a saved workflow through REST and MCP', async () => {
  const f = await fixture();
  const ownFlow = { id: 'saved-once', name: 'Saved once reuse', nodes: [{ id: 'step', slug: 'custom-summarize', x: 0, y: 0 }], edges: [], customSkills: [{ slug: 'custom-summarize', name: 'Summarize', markdown: '# Summarize\nReturn the supplied facts concisely.' }] };
  assert.equal(await f.library.put('employee', { 'abb:v1': JSON.stringify({ kits: [{ id: 'kit', name: 'My existing kit', slugs: [] }], flows: [ownFlow], recent: [], draft: null }) }, 0), true);
  await f.library.put('different-user', { 'abb:v1': JSON.stringify({ kits: [], flows: [{ ...ownFlow, name: 'OTHER ACCOUNT SECRET' }], recent: [], draft: null }) }, 0);
  const registered = await (await f.post('/oauth/register', { client_name: 'Personal AI', redirect_uris: ['http://127.0.0.1/callback'] })).json();
  const personalResource = `${origin}/mcp/personal`;
  const authorization = { client_id: registered.client_id, redirect_uri: 'http://127.0.0.1:43210/callback', response_type: 'code', code_challenge: challenge, code_challenge_method: 'S256', resource: personalResource, scope: 'saved:read', state: 'personal_state' };
  const consent = await f.post('/oauth/authorize', { ...authorization, consent: true }, { origin, authorization: 'Bearer clerk-session-test' });
  assert.equal(consent.status, 200);
  const callback = new URL((await consent.json()).redirect_uri);
  const tokenResponse = await f.post('/oauth/token', { grant_type: 'authorization_code', code: callback.searchParams.get('code'), client_id: registered.client_id, redirect_uri: authorization.redirect_uri, code_verifier: verifier, resource: personalResource });
  assert.equal(tokenResponse.status, 200); const token = await tokenResponse.json();
  assert.equal(token.scope, 'saved:read');
  const bearer = { authorization: `Bearer ${token.access_token}` };
  const listed = await f.get('/api/v1/personal/items', bearer); assert.equal(listed.status, 200);
  const items = await listed.json();
  assert.doesNotMatch(JSON.stringify(items), /OTHER ACCOUNT SECRET|Company evidence/);
  const flow = items.items.find(i => i.title === 'Saved once reuse'); assert(flow);
  const packResponse = await f.get(`/api/v1/personal/items/${flow.item_id}`, bearer); assert.equal(packResponse.status, 200);
  const pack = await packResponse.json();
  const prepared = await f.post('/api/v1/personal/workflow-preparations', { item_id: flow.item_id, revision_sha256: pack.revision_sha256 }, bearer);
  assert.equal(prepared.status, 200); assert.doesNotMatch(JSON.stringify(await prepared.json()), /OTHER ACCOUNT SECRET/);
  assert.equal((await f.get(`/api/v1/company/${workspace}/items`, bearer)).status, 401);
  const companyConnection = await connect(f);
  assert.equal((await f.get('/api/v1/personal/items', { authorization: `Bearer ${companyConnection.token.access_token}` })).status, 401);
  // get_me needs the personal grant: no token or a company token never reaches it, and it has no REST route.
  const getMe = { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'get_me', arguments: {} } };
  const anonymousMe = await f.post('/mcp/personal', getMe, { accept: 'application/json, text/event-stream' });
  assert.equal(anonymousMe.status, 401); assert.match(anonymousMe.headers.get('cache-control'), /private, no-store/);
  assert.equal((await f.post('/mcp/personal', getMe, { accept: 'application/json, text/event-stream', authorization: `Bearer ${companyConnection.token.access_token}` })).status, 401);
  assert.equal((await f.get('/api/v1/personal/me', bearer)).status, 404);
  const metadata = await (await f.get('/.well-known/oauth-protected-resource/mcp/personal')).json();
  assert.deepEqual(metadata.scopes_supported, ['saved:read','saved:write']);
  const client = new Client({ name: 'personal-sdk', version: '1' });
  const transport = new StreamableHTTPClientTransport(new URL(personalResource), { fetch: async (input, init) => {
    const request = new Request(input, init), headers = new Headers(request.headers);
    headers.set('authorization', bearer.authorization); headers.set('cf-connecting-ip', edge['cf-connecting-ip']);
    return f.handle(new Request(request, { headers }));
  } });
  try {
    await client.connect(transport);
    const tools = (await client.listTools()).tools.map(t => t.name);
    assert(tools.includes('list_saved_items') && tools.includes('get_resource'));
    assert(!tools.includes('list_company_items'));
    // get_me is on the personal server only: four saved-work tools, get_me and thirty-one public tools.
    assert.equal(tools.length, 36); assert.equal(tools.filter(t => t === 'get_me').length, 1);
    assert.match(client.getInstructions(), /call get_me with the task/);
    assert(client.getInstructions().indexOf('get_me') < 512, 'the get_me line sits in the first 512 characters');
    const none = await client.callTool({ name: 'get_me', arguments: { for_task: 'Write a LinkedIn post about my launch' } });
    assert.equal(none.structuredContent.saved, false); assert.match(none.structuredContent.next_action, /useaiblocks\.com\/me-md/);
    await f.library.put('different-user', { 'abb:business': JSON.stringify({ me: '## Core\n\nOTHER ACCOUNT ME SECRET' }) }, 1);
    assert.equal(await f.library.put('employee', { ...(await f.library.get('employee')).data, 'abb:business': JSON.stringify({ me: '## Core\n\nCORE_PLACEHOLDER\n\n## Voice\n\nVOICE_PLACEHOLDER' }) }, 1), true);
    const mine = await client.callTool({ name: 'get_me', arguments: { for_task: 'Write a LinkedIn post about my launch' } });
    assert.equal(mine.structuredContent.voice, 'you'); assert.equal(mine.structuredContent.trust, 'untrusted-user-supplied-data');
    assert.match(mine.structuredContent.context, /CORE_PLACEHOLDER[\s\S]*VOICE_PLACEHOLDER/); assert.deepEqual(JSON.parse(mine.content[0].text), mine.structuredContent);
    assert.doesNotMatch(JSON.stringify(mine), /OTHER ACCOUNT ME SECRET/);
    const item = await client.callTool({ name: 'get_saved_item', arguments: { item_id: flow.item_id } });
    assert.equal(item.structuredContent.revision_sha256, pack.revision_sha256);
    const resource = await client.callTool({ name: 'get_saved_resource', arguments: { item_id: flow.item_id, revision_sha256: pack.revision_sha256, path: 'skills/custom-summarize/SKILL.md' } });
    assert.match(Buffer.from(resource.structuredContent.content, 'base64').toString(), /Return the supplied facts concisely/);
  } finally { await client.close(); }
});

test('verified connection limits survive refresh and forged caller IDs while independent grants stay separate', async () => {
  const counts = new Map(), seen = [];
  const f = await fixture({ API_READ_LIMITER: { async limit({ key }) { seen.push(key); if (!key.startsWith('mcp-grant:')) return { success: true }; const count = (counts.get(key) ?? 0) + 1; counts.set(key, count); return { success: count <= 2 }; } } });
  const first = await connect(f), read = token => f.get('/api/v1/company/'+workspace+'/items', { authorization: 'Bearer '+token, 'x-api-key': 'synthetic-changing-key', 'x-user-id': 'synthetic-changing-user' });
  assert.equal((await read(first.token.access_token)).status, 200); assert.equal((await read(first.token.access_token)).status, 200);
  const denied = await read(first.token.access_token); assert.equal(denied.status, 429); assert.equal(denied.headers.get('retry-after'), '60'); assert.match(denied.headers.get('access-control-expose-headers'), /Retry-After/);
  assert.doesNotMatch(await denied.text(), /INTERNAL EVIDENCE|private-skill|OWNER_HASH/);
  const refreshed = await f.post('/oauth/token', { grant_type: 'refresh_token', client_id: first.client.client_id, refresh_token: first.token.refresh_token, resource: endpoint }); assert.equal(refreshed.status, 200);
  const rotated = await refreshed.json(); assert.equal((await read(rotated.access_token)).status, 429);
  const other = await connect(f, 'Independent synthetic connection'); assert.equal((await read(other.token.access_token)).status, 200);
  assert.equal(counts.size, 2); assert.ok(seen.includes(edge['cf-connecting-ip']), 'the shared IP guard still runs');
  const before = [...counts.values()].reduce((a,b)=>a+b,0); assert.equal((await read('invalid-synthetic-token')).status, 401); assert.equal([...counts.values()].reduce((a,b)=>a+b,0), before);
});

test('connection protection outages fail closed before returning private data', async () => {
  const f = await fixture({ API_READ_LIMITER: { async limit({ key }) { if (key.startsWith('mcp-grant:')) throw Error('Synthetic limiter outage'); return { success: true }; } } });
  const connection = await connect(f), response = await f.get('/api/v1/company/'+workspace+'/items', { authorization: 'Bearer '+connection.token.access_token });
  assert.equal(response.status, 503); assert.equal(response.headers.get('cache-control'), 'private, no-store'); assert.doesNotMatch(await response.text(), /INTERNAL EVIDENCE|private-skill|OWNER_HASH/);
});
