import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { PublicApiError, PublicCatalogueService } from '../src/server/public-catalogue.ts';
import { handleMcp, handlePublicMcp, PUBLIC_MCP_LISTED_TOOLS, PUBLIC_MCP_TOOLS } from '../src/server/public-mcp.ts';

const endpoint = 'https://example.test/api/mcp';
const revision = 'a'.repeat(64);
const sha = text => createHash('sha256').update(text).digest('hex');
const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-11-25' };
const initialize = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'test', version: '1' } } };
const request = (body, extraHeaders = {}) => new Request(endpoint, { method: 'POST', headers: { ...headers, ...extraHeaders }, body: typeof body === 'string' ? body : JSON.stringify(body) });

function fixture() {
  const instructions = '# Sample\nRead the supplied brief. Produce a draft and check it against the brief.\n';
  const workflowInstructions = '# Sample flow\nRun sample after reading the supplied brief.\n';
  const blocks = JSON.stringify({ blocks: [
    { slug: 'sample', name: 'Sample', summary: 'Draft from a brief', type: 'skill', category: 'general', inputs: [{ type: 'brief', required: true }], outputs: [{ type: 'draft', required: true }] },
    { slug: 'sample-flow', name: 'Sample flow', summary: 'A sample workflow', type: 'workflow', category: 'orchestrator', steps: [{ uses: 'sample' }] }
  ] });
  const entry = (slug, content) => ({ revision_sha256: revision, instruction: { path: `/skills/${slug}/SKILL.md`, sha256: sha(content), bytes: Buffer.byteLength(content) }, files: [], reference_validation: { status: 'PASS' } });
  const manifest = JSON.stringify({ schema: 'abb-public-catalogue/1', catalogue_sha256: sha(blocks), resources: { sample: entry('sample', instructions), 'sample-flow': entry('sample-flow', workflowInstructions) } });
  const assets = new Map([['/data/blocks.json', blocks], ['/data/public-api-manifest.json', manifest], ['/skills/sample/SKILL.md', instructions], ['/skills/sample-flow/SKILL.md', workflowInstructions]]);
  return { instructions, service: new PublicCatalogueService(async path => assets.has(path) ? new Response(assets.get(path)) : new Response('Missing', { status: 404 }), endpoint) };
}

test('official SDK client negotiates, discovers the fifteen listed tools and retrieves/prepares with the real catalogue service', async () => {
  const { service, instructions } = fixture();
  const traffic = [];
  const transport = new StreamableHTTPClientTransport(new URL(endpoint), { fetch: async (input, init) => {
    const req = new Request(input, init);
    const response = await handlePublicMcp(req, service);
    traffic.push({ method: req.method, session: response.headers.get('mcp-session-id'), type: response.headers.get('content-type') });
    return response;
  } });
  const client = new Client({ name: 'official-client-test', version: '1.0.0' });
  try {
    await client.connect(transport);
    assert.equal(client.getServerVersion().name, 'ai-blocks-public-library');
    assert.match(client.getInstructions(), /own model/);
    assert.match(client.getInstructions(), /not evidence of human consent/);
    assert.deepEqual((await client.listTools()).tools.map(t => t.name), ['start_outcome', 'advance_outcome', 'record_outcome_decision', 'record_outcome_experiment', 'find_specialist', 'prepare_specialist', 'search_library', 'plan_workflow', 'get_skill', 'get_workflow', 'get_resource', 'prepare_workflow', 'get_item', 'search', 'fetch']);
    const search = await client.callTool({ name: 'search_library', arguments: { query: 'sample' } });
    assert.equal(search.isError, undefined);
    assert.match(search.content[0].text, /sample/);
    const skill = await client.callTool({ name: 'get_skill', arguments: { slug: 'sample', revision_sha256: revision, response_format: 'detailed' } });
    assert.equal(skill.structuredContent.instructions, instructions);
    assert.equal(skill.structuredContent.instructions_complete, true);
    const flow = await client.callTool({ name: 'get_workflow', arguments: { slug: 'sample-flow', revision_sha256: revision } });
    assert.equal(flow.structuredContent.governing_skill.slug, 'sample-flow');
    const resource = await client.callTool({ name: 'get_resource', arguments: { slug: 'sample', path: 'SKILL.md', revision_sha256: revision, limit: 10 } });
    assert.equal(resource.structuredContent.content, instructions.slice(0, 10));
    assert.equal(resource.structuredContent.next_offset, 10);
    const draftArgs = { name: 'My draft', goal: 'Draft from my brief', steps: [{ id: 'draft', slug: 'sample', revision_sha256: revision }] };
    const draft = await client.callTool({ name: 'prepare_workflow', arguments: draftArgs });
    assert.equal(draft.structuredContent.approval.status, 'REVIEW_REQUIRED');
    assert.equal(draft.structuredContent.execution.model_calls_by_service, 0);
    assert.equal(draft.structuredContent.state, 'NOT_STARTED');
    const approved = await client.callTool({ name: 'prepare_workflow', arguments: { ...draftArgs, approved_draft_hash: draft.structuredContent.draft_sha256 } });
    assert.equal(approved.structuredContent.approval.grants_execution_authority, false);
    assert.equal(approved.structuredContent.approval.independently_verified, false);
    assert(traffic.every(t => t.session === null));
    assert(traffic.filter(t => t.method === 'POST' && t.type).every(t => /application\/json/.test(t.type)));
  } finally { await client.close(); }
});

test('protocol rejects invalid envelopes and method parameters without calling any catalogue operation', async () => {
  const service = { async callTool() { assert.fail('invalid protocol reached the catalogue'); } };
  const cases = [
    ['{', -32700],
    [[], -32600],
    [{ jsonrpc: '1.0', id: 2, method: 'tools/list' }, -32600],
    [{ jsonrpc: '2.0', id: 2, method: 'initialize', params: {} }, -32602],
    [{ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'get_skill', arguments: [] } }, -32602],
    [{ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'not_a_tool', arguments: {} } }, -32602],
    [{ jsonrpc: '2.0', id: 2, method: 'tools/list', params: { cursor: 'unexpected' } }, -32602],
    [{ jsonrpc: '2.0', id: 2, method: 'not/a/method' }, -32601]
  ];
  for (const [body, code] of cases) {
    const result = await (await handlePublicMcp(request(body), service)).json();
    assert.equal(result.error.code, code, JSON.stringify(body));
  }
});

test('transport enforces HTTP media/protocol headers and closes standalone streams without sessions', async () => {
  const { service } = fixture();
  for (const [extra, expected] of [[{ accept: 'application/json' }, 406], [{ 'content-type': 'text/plain' }, 415], [{ 'content-type': 'application/jsonp' }, 415]]) {
    assert.equal((await handlePublicMcp(request(initialize, extra), service)).status, expected);
  }
  const unsupported = await handlePublicMcp(request({ jsonrpc: '2.0', id: 3, method: 'tools/list' }, { 'mcp-protocol-version': '9999-01-01' }), service);
  assert.equal(unsupported.status, 400);
  for (const method of ['GET', 'DELETE', 'PUT']) {
    const result = await handlePublicMcp(new Request(endpoint, { method, headers: { accept: 'text/event-stream' } }), service);
    assert.equal(result.status, 405);
    assert.equal(result.headers.get('allow'), 'POST');
    assert.equal(result.headers.get('mcp-session-id'), null);
    assert.equal(await result.text(), '');
  }
  for (const method of ['notifications/initialized', 'notifications/unknown']) {
    const result = await handlePublicMcp(request({ jsonrpc: '2.0', method }), service);
    assert.equal(result.status, 202);
    assert.equal(await result.text(), '');
  }
});

test('catalogue validation, stale and missing resources are tool errors the AI can read, and unknown exceptions are redacted', async () => {
  const { service } = fixture();
  const call = async (name, args, current = service) => (await handlePublicMcp(request({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name, arguments: args } }), current)).json();
  const invalid = await call('search_library', { limit: 100 });
  assert.equal(invalid.error, undefined);
  assert.equal(invalid.result.isError, true);
  assert.match(invalid.result.content[0].text, /limit/);
  const stale = await call('get_skill', { slug: 'sample', revision_sha256: 'b'.repeat(64) });
  assert.equal(stale.result.isError, true);
  assert.match(stale.result.content[0].text, /revision/);
  const absent = await call('get_skill', { slug: 'missing' });
  assert.equal(absent.result.isError, true);
  const unknown = await call('get_skill', {}, { async callTool() { throw Error('secret-token-must-not-leak'); } });
  assert.equal(unknown.result.isError, true);
  assert.doesNotMatch(JSON.stringify(unknown), /secret-token/);
});

test('separate private adapter uses its own tool registry and cannot reach public tools', async () => {
  const tool = { name: 'company_read', description: 'Read permitted company instructions', inputSchema: { type: 'object', properties: {} } };
  const service = { async callTool(name) { assert.equal(name, 'company_read'); return { private: true }; } };
  const options = { tools: [tool], serverName: 'company-private', instructions: 'Use only authorized company content.' };
  const init = await (await handleMcp(request(initialize), service, options)).json();
  assert.equal(init.result.serverInfo.name, 'company-private');
  const list = await (await handleMcp(request({ jsonrpc: '2.0', id: 4, method: 'tools/list' }), service, options)).json();
  assert.deepEqual(list.result.tools.map(t => t.name), ['company_read']);
  const denied = await (await handleMcp(request({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'get_skill', arguments: { slug: 'sample' } } }), service, options)).json();
  assert.equal(denied.error.code, -32602);
  assert.equal(PUBLIC_MCP_TOOLS.length, 22);
  assert.equal(PUBLIC_MCP_LISTED_TOOLS.length, 15);
  const knownError = { async callTool() { throw new PublicApiError(403, 'forbidden', 'Company access denied.'); } };
  const forbidden = await (await handleMcp(request({ jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'company_read', arguments: {} } }), knownError, options)).json();
  assert.equal(forbidden.result.isError, true);
  assert.equal(forbidden.result.content[0].text, 'Company access denied.');
});
