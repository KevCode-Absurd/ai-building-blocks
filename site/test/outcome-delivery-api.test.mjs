import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { PublicCatalogueService } from '../src/server/public-catalogue.ts';
import { handlePublicMcp, PUBLIC_MCP_TOOLS } from '../src/server/public-mcp.ts';
import { handlePublicApi } from '../src/server/public-api.ts';
import { outcomeScope } from './fixtures/outcome-delivery-fixtures.mjs';

const origin = 'https://example.test';
const service = () => new PublicCatalogueService(async () => { assert.fail('Scope and selection need no remote catalogue read.'); }, origin);
test('official HTTP MCP client lists start_outcome as the front door; scoped handoffs moved to REST and still transfer selected work without execution', async () => {
  const s = service(), client = new Client({ name: 'outcome-handoff-test', version: '1' });
  const transport = new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { fetch: (input, init) => handlePublicMcp(new Request(input, init), s) });
  try {
    await client.connect(transport);
    const inventory = (await client.listTools()).tools;
    assert.equal(inventory.length, 15); assert.equal(new Set(inventory.map(t => t.name)).size, 15); assert.equal(inventory[0].name, 'start_outcome');
    // A client with a cached tool list gets a readable answer naming the REST route, not a protocol error.
    const moved = await client.callTool({ name: 'prepare_scoped_specialist_work', arguments: { scope: outcomeScope() } });
    assert.equal(moved.isError, true); assert.match(moved.content[0].text, /start_outcome.*POST https:\/\/example\.test\/api\/v1\/scoped-work-preparations /);
    const call = async (name, args) => s.callTool(name, args);
    const p = await call('prepare_scoped_specialist_work', { scope: outcomeScope() });
    const h = await call('prepare_recommendation_handoff', { scope: p.scope, scope_sha256: p.scope_sha256, selected_recommendation_ids: ['R1'] });
    assert.deepEqual(h.selected_recommendation_ids, ['R1']);
    assert.equal(h.review.grants_execution_authority, false);
    assert.equal(h.stored_by_service, false); assert.equal(h.model_calls, 0); assert.equal(h.hosted_execution, false);
    assert.equal(h.files['prompts/other-fix.txt'], undefined);
    const changed = structuredClone(p.scope); changed.delivery.after += ' changed';
    await assert.rejects(() => s.callTool('prepare_recommendation_handoff', { scope: changed, scope_sha256: p.scope_sha256, selected_recommendation_ids: ['R1'] }), error => error.status === 400);
  } finally { await client.close(); }
});

test('REST and OpenAPI share the scoping contracts without changing existing request limits or storage', async () => {
  const env = { PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { async fetch() { assert.fail('No catalogue read required.'); } } };
  const request = (path, body) => new Request(origin + path, { method: body ? 'POST' : 'GET', headers: { 'cf-connecting-ip': '192.0.2.10', ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const response = await handlePublicApi(request('/api/v1/scoped-work-preparations', { scope: outcomeScope() }), env);
  assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  const p = await response.json();
  const h = await handlePublicApi(request('/api/v1/recommendation-handoffs', { scope: p.scope, scope_sha256: p.scope_sha256, selected_recommendation_ids: ['R1'] }), env);
  assert.equal(h.status, 200); assert.deepEqual((await h.json()).selected_recommendation_ids, ['R1']);
  const openapi = await (await handlePublicApi(request('/api/v1/openapi.json'), env)).json();
  assert.equal(openapi.paths['/api/v1/recommendation-handoffs'].post.operationId, 'prepare_recommendation_handoff');
  assert.equal((await handlePublicApi(request('/api/v1/recommendation-handoffs'), env)).status, 405);
  const oversized = await handlePublicApi(request('/api/v1/scoped-work-preparations', { scope: outcomeScope(), padding: 'x'.repeat(65000) }), env);
  assert.equal(oversized.status, 413);
  for (const name of ['scope_specialist_request', 'prepare_scoped_specialist_work', 'prepare_recommendation_handoff']) assert(PUBLIC_MCP_TOOLS.find(t => t.name === name).annotations.readOnlyHint);
});
