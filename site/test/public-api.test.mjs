import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Readable } from 'node:stream';
import { handlePublicApi, MAX_PUBLIC_BODY_BYTES } from '../src/server/public-api.ts';
import { devPublicApi } from '../scripts/vite-public-api.ts';
import worker from '../src/worker.ts';

const origin = 'https://example.test';
const hash = value => createHash('sha256').update(value).digest('hex');
const revision = 'a'.repeat(64);
const edgeHeaders = { 'cf-connecting-ip': '192.0.2.7' };
const rpcHeaders = { ...edgeHeaders, 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-11-25' };
const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'api-test', version: '1' } } };
const get = (path, headers = {}) => new Request(origin + path, { headers: { ...edgeHeaders, ...headers } });
const prepareCall = { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'prepare_workflow', arguments: { name: 'Mine', goal: 'Draft', steps: [{ id: 'first', slug: 'sample', revision_sha256: revision }] } } };
const post = (path, value, headers = {}) => new Request(origin + path, { method: 'POST', headers: { ...rpcHeaders, ...headers }, body: typeof value === 'string' ? value : JSON.stringify(value) });

function environment(overrides = {}) {
  const md = '# Sample\nDraft from the supplied brief; check facts before delivery.\n';
  const blocks = JSON.stringify({ blocks: [{ slug: 'sample', name: 'Sample', summary: 'Draft from a brief', type: 'skill', category: 'general', inputs: ['brief'], outputs: ['draft'] }] });
  const manifest = JSON.stringify({ schema: 'abb-public-catalogue/1', catalogue_sha256: hash(blocks), resources: { sample: { revision_sha256: revision, instruction: { path: '/skills/sample/SKILL.md', sha256: hash(md), bytes: Buffer.byteLength(md) }, files: [], reference_validation: { status: 'PASS' } } } });
  const files = new Map([['/data/blocks.json', blocks], ['/data/public-api-manifest.json', manifest], ['/skills/sample/SKILL.md', md]]);
  return { PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, API_WRITE_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { async fetch(request) { const file = files.get(new URL(request.url).pathname); return file === undefined ? new Response('Missing', { status: 404 }) : new Response(file); } }, ...overrides };
}

test('public wrapper fails closed for disabled service, untrusted transport/host, missing edge identity and unavailable limits', async () => {
  const cases = [
    [get('/api/v1/status'), { PUBLIC_API_ENABLED: 'false' }, 503],
    [new Request('http://example.test/api/v1/status', { headers: edgeHeaders }), {}, 403],
    [new Request('https://other.test/api/v1/status', { headers: edgeHeaders }), {}, 403],
    [get('/api/v1/status'), { API_ALLOWED_HOSTS: '' }, 503],
    [new Request(origin + '/api/v1/status'), {}, 503],
    [get('/api/v1/status'), { API_READ_LIMITER: undefined }, 503],
    [post('/mcp', init), { API_READ_LIMITER: undefined }, 503],
    [post('/mcp', prepareCall), { API_WRITE_LIMITER: undefined }, 503],
    [get('/api/v1/status'), { API_READ_LIMITER: { async limit() { throw Error('unavailable'); } } }, 503],
    [post('/mcp', init), { API_READ_LIMITER: { async limit() { return { success: false }; } } }, 429],
    [post('/mcp', prepareCall), { API_WRITE_LIMITER: { async limit() { return { success: false }; } } }, 429]
  ];
  for (const [request, changes, expected] of cases) {
    const response = await handlePublicApi(request, environment(changes));
    assert.equal(response.status, expected, request.url);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
});

test('anonymous catalogue GETs are open to any origin; MCP and POST requests require an exact configured origin', async () => {
  for (const headers of [{}, { origin }, { origin: 'https://approved-client.test' }, { origin: 'https://untrusted.test' }]) {
    const response = await handlePublicApi(get('/api/v1/status', headers), environment({ PUBLIC_API_ALLOWED_ORIGINS: 'https://approved-client.test' }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.doesNotMatch(response.headers.get('vary') ?? '', /Origin/);
  }
  const preflight = method => new Request(origin + '/api/v1/search', { method: 'OPTIONS', headers: { ...edgeHeaders, origin: 'https://untrusted.test', 'access-control-request-method': method } });
  const readPreflight = await handlePublicApi(preflight('GET'), environment());
  assert.equal(readPreflight.status, 204);
  assert.equal(readPreflight.headers.get('access-control-allow-origin'), '*');
  assert.match(readPreflight.headers.get('access-control-allow-headers'), /If-None-Match/);
  assert.equal((await handlePublicApi(preflight('POST'), environment())).status, 403);
  const approvedPost = await handlePublicApi(post('/api/v1/workflow-preparations', prepareCall.params.arguments, { origin: 'https://approved-client.test' }), environment({ PUBLIC_API_ALLOWED_ORIGINS: 'https://approved-client.test' }));
  assert.equal(approvedPost.status, 200);
  assert.equal(approvedPost.headers.get('access-control-allow-origin'), 'https://approved-client.test');
  assert.equal((await handlePublicApi(post('/api/v1/workflow-preparations', prepareCall.params.arguments, { origin: 'https://untrusted.test' }), environment())).status, 403);
  for (const clientOrigin of ['null', 'https://untrusted.test', 'https://approved-client.test.evil.test']) {
    const denied = await handlePublicApi(post('/mcp', init, { origin: clientOrigin }), environment({ PUBLIC_API_ALLOWED_ORIGINS: 'https://approved-client.test' }));
    assert.equal(denied.status, 403);
    assert.equal(denied.headers.get('access-control-allow-origin'), null);
  }
  const options = new Request(origin + '/mcp', { method: 'OPTIONS', headers: { ...edgeHeaders, origin: 'https://approved-client.test', 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type,mcp-protocol-version' } });
  const response = await handlePublicApi(options, environment({ PUBLIC_API_ALLOWED_ORIGINS: 'https://approved-client.test' }));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://approved-client.test');
  assert.match(response.headers.get('access-control-allow-methods'), /POST/);
  assert.match(response.headers.get('access-control-allow-headers'), /MCP-Protocol-Version/);
});

test('REST and both MCP aliases operate on the same pinned source without any provider fetch or private-store access', async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => assert.fail('API/MCP attempted an external/provider request');
  const forbiddenDb = new Proxy({}, { get() { assert.fail('public service accessed a private database'); } });
  const env = environment({ OPENAI_API_KEY: 'fake-never-use', ANTHROPIC_API_KEY: 'fake-never-use', COMPOSER: forbiddenDb, SPACES: forbiddenDb });
  try {
    const rest = await (await handlePublicApi(get('/api/v1/skills/sample?revision_sha256=' + revision), env)).json();
    assert.equal(rest.slug, 'sample');
    for (const path of ['/mcp', '/api/v1/mcp']) {
      const transport = new StreamableHTTPClientTransport(new URL(origin + path), { requestInit: { headers: edgeHeaders }, fetch: (input, init) => handlePublicApi(new Request(input, init), env) });
      const client = new Client({ name: 'wrapper-integration', version: '1' });
      try {
        await client.connect(transport);
        const skill = await client.callTool({ name: 'get_skill', arguments: { slug: 'sample', revision_sha256: revision } });
        assert.deepEqual(skill.structuredContent, rest);
        const draft = await client.callTool({ name: 'prepare_workflow', arguments: { name: 'Mine', goal: 'Draft from a brief', steps: [{ id: 'first', slug: 'sample', revision_sha256: revision }] } });
        assert.equal(draft.structuredContent.execution.model_calls_by_service, 0);
        assert.equal(draft.structuredContent.execution.stored_by_service, false);
      } finally { await client.close(); }
    }
    const prepared = await handlePublicApi(post('/api/v1/workflow-preparations', { name: 'Mine', goal: 'Draft from a brief', steps: [{ id: 'first', slug: 'sample', revision_sha256: revision }] }), env);
    assert.equal(prepared.status, 200);
    assert.equal((await prepared.json()).approval.grants_execution_authority, false);
  } finally { globalThis.fetch = previousFetch; }
});

test('request bounds inspect streamed bytes even with a forged length and handle invalid media or JSON', async () => {
  const env = environment();
  for (const route of ['/mcp', '/api/v1/workflow-preparations']) {
    const oversized = post(route, 'x'.repeat(MAX_PUBLIC_BODY_BYTES + 1));
    assert.equal((await handlePublicApi(oversized, env)).status, 413);
    const payload = new TextEncoder().encode('x'.repeat(MAX_PUBLIC_BODY_BYTES + 1));
    const stream = new ReadableStream({ start(controller) { controller.enqueue(payload.subarray(0, 32000)); controller.enqueue(payload.subarray(32000)); controller.close(); } });
    const forged = new Request(origin + route, { method: 'POST', headers: { ...rpcHeaders, 'content-length': '1' }, body: stream, duplex: 'half' });
    assert.equal((await handlePublicApi(forged, env)).status, 413);
    for (const type of ['text/plain', 'application/jsonp']) assert.equal((await handlePublicApi(post(route, '{}', { 'content-type': type }), env)).status, 415);
    const invalid = await handlePublicApi(post(route, '{'), env);
    assert.equal(invalid.status, 400);
  }
  const malformedParams = await (await handlePublicApi(post('/mcp', { jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'get_skill', arguments: [] } }), env)).json();
  assert.equal(malformedParams.error.code, -32602);
});

test('REST query validation, resource chunks, OpenAPI and production worker routing preserve API behavior', async () => {
  const env = environment();
  for (const path of ['/api/v1/search?q=a&query=b', '/api/v1/search?limit=1.5', '/api/v1/search?offset=-1', '/api/v1/search?unknown=true']) assert.equal((await handlePublicApi(get(path), env)).status, 400, path);
  const queryAlias = await (await handlePublicApi(get('/api/v1/search?q=Sample&kind=skill'), env)).json();
  const queryLong = await (await handlePublicApi(get('/api/v1/search?query=Sample&type=skill'), env)).json();
  assert.deepEqual(queryAlias, queryLong);
  const resource = await (await handlePublicApi(get(`/api/v1/resources/sample?path=SKILL.md&revision_sha256=${revision}&limit=8`), env)).json();
  assert.equal(resource.content, '# Sample');
  assert.equal(resource.next_offset, 8);
  const schema = await (await handlePublicApi(get('/api/v1/openapi.json'), env)).json();
  assert.equal(schema.openapi, '3.1.0');
  assert.equal(schema.paths['/api/v1/workflow-preparations'].post.operationId, 'prepare_workflow');
  const head = await handlePublicApi(new Request(origin + '/api/v1/status', { method: 'HEAD', headers: edgeHeaders }), env);
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await worker.fetch(get('/api/v1/status'), env)).status, 200);
  assert.equal((await worker.fetch(post('/mcp', init), env)).status, 200);
  assert.equal((await worker.fetch(post('/api/v1/mcp', init), env)).status, 200);
});

test('Vite development bridge serves local public MCP, bounds streamed bytes, and keeps private company routes on the Worker', async () => {
  let middleware;
  devPublicApi().configureServer({ config: { root: process.cwd() }, middlewares: { use(handler) { middleware = handler; } } });
  const invoke = async (url, chunks = [], extra = {}) => {
    const req = Readable.from(chunks);
    req.url = url; req.method = chunks.length ? 'POST' : 'GET'; req.headers = { host: 'localhost:5173', ...rpcHeaders, ...extra };
    const out = { statusCode: 200, headers: {}, body: null, setHeader(key, value) { this.headers[key] = value; }, end(value) { this.body = value; } };
    await middleware(req, out, () => { out.next = true; });
    return out;
  };
  const status = await invoke('/api/v1/status');
  assert.equal(status.statusCode, 200);
  assert.equal(JSON.parse(status.body).model_calls, false);
  const initialized = await invoke('/mcp', [Buffer.from(JSON.stringify(init))]);
  assert.equal(initialized.statusCode, 200);
  assert.equal(JSON.parse(initialized.body).result.serverInfo.name, 'ai-blocks-public-library');
  const oversized = await invoke('/mcp', [Buffer.alloc(32000), Buffer.alloc(32001)], { 'content-length': '1' });
  assert.equal(oversized.statusCode, 413);
  const company = await invoke('/mcp/company/secret-workspace-token');
  assert.equal(company.statusCode, 503);
  assert.equal(JSON.parse(company.body).error.code, 'local_worker_required');
  assert.equal((await invoke('/api/v1/status', [], { host: 'untrusted.test' })).statusCode, 403);
  assert.equal((await invoke('/unrelated')).next, true);
});
