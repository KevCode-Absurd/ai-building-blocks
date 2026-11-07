import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { PublicCatalogueService } from '../src/server/public-catalogue.ts';
import { handlePublicApi } from '../src/server/public-api.ts';
import { handlePublicMcp, PUBLIC_MCP_INSTRUCTIONS } from '../src/server/public-mcp.ts';
import { engineFixture } from './fixtures/jobs/engine-fixture.mjs';
const origin = 'https://example.test', asset = async () => new Response('Missing', { status: 404 });
const env = { PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { fetch: asset } };
const post = (route, body) => new Request(origin + route, { method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.5' }, body: JSON.stringify(body) });

test('REST completes a synthetic structural job and serves actual JSON schemas without changing the live front door', async t => {
  const f = engineFixture(), original = PublicCatalogueService.prototype.jobContext;
  PublicCatalogueService.prototype.jobContext = async () => f.context; t.after(() => { PublicCatalogueService.prototype.jobContext = original; });
  let response = await handlePublicApi(post('/api/v1/jobs', f.input), env); assert.equal(response.status, 200);
  let result = await response.json(); assert.equal(result.phase, 'SCOPE'); assert.equal(response.headers.get('cache-control'), 'no-store');
  for (const entry of f.events) { response = await handlePublicApi(post('/api/v1/job-events', { job_id: result.job_id, state: result.state, state_digest: result.state_digest, ...entry }), env); const next = await response.json(); assert.equal(response.status, 200, JSON.stringify(next)); result = next; assert.equal(result.model_calls, 0); }
  assert.equal(result.phase, 'COMPLETE');
  response = await handlePublicApi(new Request(origin + '/api/v1/schemas/ai-blocks-council/1.json', { headers: { 'cf-connecting-ip': '192.0.2.5' } }), env);
  assert.equal(response.status, 200); assert.equal((await response.json()).properties.schema.const, 'ai-blocks-council/1');
  assert(PUBLIC_MCP_INSTRUCTIONS.slice(0, 512).includes('start_outcome')); assert(PUBLIC_MCP_INSTRUCTIONS.length < 2500);
});

test('official MCP SDK discovers small job tools and completes the same protocol', async t => {
  const f = engineFixture(), service = new PublicCatalogueService(asset, origin); service.jobContext = async () => f.context;
  const client = new Client({ name: 'jobs-protocol-test', version: '1' }); t.after(() => client.close());
  await client.connect(new StreamableHTTPClientTransport(new URL(origin + '/mcp'), { fetch: (input, init) => handlePublicMcp(new Request(input, init), service) }));
  const tools = (await client.listTools()).tools;
  assert.equal(tools[0].name, 'start_outcome');
  const advance = tools.find(t => t.name === 'advance_job'); assert(advance); assert(JSON.stringify(advance.inputSchema).length < 2000);
  const call = async (name, args) => { const result = await client.callTool({ name, arguments: args }); assert(!result.isError, JSON.stringify(result)); return result.structuredContent ?? JSON.parse(result.content.find(c => c.type === 'text').text); };
  let result = await call('start_job', f.input);
  for (const entry of f.events) result = await call('advance_job', { job_id: result.job_id, state: result.state, state_digest: result.state_digest, ...entry });
  assert.equal(result.phase, 'COMPLETE'); assert.equal(result.model_calls, 0);
  const bad = await client.callTool({ name: 'advance_job', arguments: { job_id: result.job_id, event: 'deliver', state: result.state, state_digest: result.state_digest, document: f.delivery } }); assert.equal(bad.isError, true);
});

test('job REST rejects methods, malformed bodies and unknown query arguments', async t => {
  const f = engineFixture(), original = PublicCatalogueService.prototype.jobContext;
  PublicCatalogueService.prototype.jobContext = async () => f.context; t.after(() => { PublicCatalogueService.prototype.jobContext = original; });
  const get = route => handlePublicApi(new Request(origin + route, { headers: { 'cf-connecting-ip': '192.0.2.5' } }), env);
  assert.equal((await get('/api/v1/jobs')).status, 405);
  assert.equal((await get('/api/v1/approaches?job=write-documents&bogus=yes')).status, 400);
  const response = await handlePublicApi(post('/api/v1/job-events', { event: 'deliver', document: {} }), env); assert.equal(response.status, 400);
  const error = await response.json(); assert(error.error.issues.some(i => i.path === 'job_id'));
});
