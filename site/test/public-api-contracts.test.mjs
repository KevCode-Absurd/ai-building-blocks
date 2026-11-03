import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { handlePublicApi, mcpLimitClass, OPENAPI_RESULT_SCHEMAS } from '../src/server/public-api.ts';
import { changesSince } from '../src/server/public-catalogue.ts';

const origin = 'https://example.test';
const hash = value => createHash('sha256').update(value).digest('hex');
const revision = 'a'.repeat(64), older = 'b'.repeat(64), oldest = 'c'.repeat(64), sameFiles = 'd'.repeat(64);
const edgeHeaders = { 'cf-connecting-ip': '192.0.2.7' };
const rpcHeaders = { ...edgeHeaders, 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-11-25' };
const get = (path, headers = {}) => new Request(origin + path, { headers: { ...edgeHeaders, ...headers } });
const post = (path, value, headers = {}) => new Request(origin + path, { method: 'POST', headers: { ...rpcHeaders, ...headers }, body: JSON.stringify(value) });
const rpc = (method, params = {}, id = 7) => ({ jsonrpc: '2.0', id, method, params });
const init = rpc('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'contracts', version: '1' } }, 1);
const counter = (success = true) => { const bucket = { calls: 0, async limit() { bucket.calls++; return { success: typeof success === 'function' ? success(bucket.calls) : success }; } }; return bucket; };

function environment(overrides = {}, assets = {}) {
  const md = '# Sample\nDraft from the supplied brief; check facts before delivery.\n';
  const blocks = JSON.stringify({ blocks: [{ slug: 'sample', name: 'Sample', summary: 'Draft from a brief', type: 'skill', category: 'general', inputs: ['brief'], outputs: ['draft'] }] });
  const history = [
    { revision_sha256: sameFiles, replaced: '2026-11-02', changed: [] },
    { revision_sha256: older, replaced: '2026-11-01', changed: ['SKILL.md'] },
    { revision_sha256: oldest, replaced: '2026-10-20', changed: ['references/guide.md'] },
  ];
  const manifest = JSON.stringify({ schema: 'abb-public-catalogue/1', catalogue_sha256: hash(blocks), resources: { sample: { revision_sha256: revision, updated: '2026-11-01', history, instruction: { path: '/skills/sample/SKILL.md', sha256: hash(md), bytes: Buffer.byteLength(md) }, files: [], reference_validation: { status: 'PASS' } } } });
  const files = new Map([['/data/blocks.json', blocks], ['/data/public-api-manifest.json', manifest], ['/skills/sample/SKILL.md', md]]);
  const fetched = [];
  const env = { PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: counter(), API_WRITE_LIMITER: counter(), ASSETS: { async fetch(request) {
    const path = new URL(request.url).pathname; fetched.push(path);
    if (assets.fail?.(path)) return new Response('Unavailable', { status: 500 });
    const file = files.get(path); return file === undefined ? new Response('Missing', { status: 404 }) : new Response(file);
  } }, ...overrides };
  return { env, fetched };
}

test('MCP requests are rate limited by JSON-RPC method: reads use the read bucket, only large-body tools the write bucket', async () => {
  assert.equal(mcpLimitClass(new TextEncoder().encode(JSON.stringify(init))).limit, 'public_read');
  for (const method of ['tools/list', 'resources/list', 'resources/read', 'prompts/list', 'prompts/get', 'skills/list', 'ping']) assert.equal(mcpLimitClass(new TextEncoder().encode(JSON.stringify(rpc(method)))).limit, 'public_read', method);
  for (const name of ['search_library', 'get_skill', 'get_item', 'fetch', 'find_specialist']) assert.equal(mcpLimitClass(new TextEncoder().encode(JSON.stringify(rpc('tools/call', { name })))).limit, 'public_read', name);
  for (const name of ['prepare_workflow', 'start_outcome', 'advance_outcome', 'prepare_specialist_team', 'not_a_tool']) assert.equal(mcpLimitClass(new TextEncoder().encode(JSON.stringify(rpc('tools/call', { name })))).limit, 'write', name);
  assert.equal(mcpLimitClass(new TextEncoder().encode('x'.repeat(64_001))).limit, 'write');
  assert.deepEqual(mcpLimitClass(new TextEncoder().encode(JSON.stringify(rpc('tools/list', {}, 'abc')))), { limit: 'public_read', id: 'abc' });

  const { env } = environment();
  for (const message of [init, rpc('tools/list'), rpc('tools/call', { name: 'search_library', arguments: { query: 'sample' } })]) assert.equal((await handlePublicApi(post('/mcp', message), env)).status, 200);
  assert.equal(env.API_READ_LIMITER.calls, 3);
  assert.equal(env.API_WRITE_LIMITER.calls, 0);
  await handlePublicApi(post('/mcp', rpc('tools/call', { name: 'prepare_workflow', arguments: { name: 'Mine', goal: 'Draft', steps: [{ id: 'first', slug: 'sample', revision_sha256: revision }] } })), env);
  assert.equal(env.API_WRITE_LIMITER.calls, 1);
  // A dedicated public read bucket takes MCP and REST reads off the site's shared read bucket when it is bound.
  const dedicated = environment({ PUBLIC_READ_LIMITER: counter() }).env;
  await handlePublicApi(post('/mcp', rpc('tools/list')), dedicated);
  await handlePublicApi(get('/api/v1/search?q=sample'), dedicated);
  assert.equal(dedicated.PUBLIC_READ_LIMITER.calls, 2);
  assert.equal(dedicated.API_READ_LIMITER.calls, 0);
});

test('a rate-limited MCP request gets a JSON-RPC error with its id, Retry-After and RateLimit headers', async () => {
  const { env } = environment({ API_READ_LIMITER: counter(false) });
  const response = await handlePublicApi(post('/mcp', rpc('tools/list', {}, 42)), env);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '60');
  assert.equal(response.headers.get('ratelimit-policy'), '"read";q=120;w=60');
  assert.equal(response.headers.get('ratelimit'), '"read";r=0;t=60');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const body = await response.json();
  assert.equal(body.jsonrpc, '2.0');
  assert.equal(body.id, 42);
  assert.equal(body.error.code, -32000);
  assert.equal(body.error.data.code, 'rate_limited');
  assert.equal(body.error.data.retry_after_seconds, 60);
  assert.match(body.error.message, /wait a minute/);
  // Other /mcp failures outside the protocol handler are JSON-RPC errors too.
  const media = await (await handlePublicApi(post('/mcp', init, { 'content-type': 'text/plain' }), environment().env)).json();
  assert.equal(media.error.data.code, 'unsupported_media_type');
  // The write bucket reports its own policy.
  const write = await handlePublicApi(post('/mcp', rpc('tools/call', { name: 'prepare_workflow', arguments: {} })), environment({ API_WRITE_LIMITER: counter(false) }).env);
  assert.equal(write.headers.get('ratelimit-policy'), '"write";q=30;w=60');
});

test('every public error, including the security layer, has the shape { error: { code, message } }', async () => {
  const cases = [
    [get('/api/v1/search?q=sample'), { API_READ_LIMITER: counter(false) }, 429, 'rate_limited'],
    [new Request('https://other.test/api/v1/status', { headers: edgeHeaders }), {}, 403, 'host_forbidden'],
    [new Request(origin + '/api/v1/status'), {}, 503, 'security_unavailable'],
    [get('/api/v1/status'), { API_READ_LIMITER: undefined }, 503, 'protection_unavailable'],
    [post('/api/v1/workflow-preparations', {}, { origin: 'https://untrusted.test' }), {}, 403, 'origin_forbidden'],
    [get('/api/v1/nothing-here'), {}, 404, 'not_found'],
    [get('/api/v1/search?colour=blue'), {}, 400, 'invalid_arguments'],
  ];
  for (const [request, overrides, status, code] of cases) {
    const response = await handlePublicApi(request, environment(overrides).env);
    assert.equal(response.status, status, request.url);
    const body = await response.json();
    assert.equal(body.error.code, code, request.url);
    assert.equal(typeof body.error.message, 'string');
  }
  const rateLimited = await handlePublicApi(get('/api/v1/search?q=sample', { origin: 'https://any-site.test' }), environment({ API_READ_LIMITER: counter(false) }).env);
  assert.equal(rateLimited.headers.get('access-control-allow-origin'), '*', 'browser apps can read a 429 on an anonymous read');
  assert.match(rateLimited.headers.get('access-control-expose-headers'), /Retry-After/);
});

test('unsupported arguments are named, with the allowed list', async () => {
  const body = await (await handlePublicApi(get('/api/v1/search?colour=blue&shape=round'), environment().env)).json();
  assert.match(body.error.message, /Unsupported arguments: "colour", "shape"\. Allowed: query, type,/);
  // issues follow the MCP tool-error shape: path, message, suggestion.
  assert.deepEqual(body.error.issues.map(i => [i.path, i.message]), [['colour', 'Unsupported argument.'], ['shape', 'Unsupported argument.']]);
  assert.match(body.error.issues[0].suggestion, /^Remove it\. Allowed: query/);
  const typo = await (await handlePublicApi(get('/api/v1/search?limt=5'), environment().env)).json();
  assert.equal(typo.error.issues[0].suggestion, 'Did you mean limit?');
});

test('anonymous catalogue reads are publicly cacheable with an ETag and answer If-None-Match with 304', async () => {
  const { env } = environment();
  const first = await handlePublicApi(get('/api/v1/search?q=sample', { origin: 'https://any-site.test' }), env);
  assert.equal(first.status, 200);
  assert.equal(first.headers.get('cache-control'), 'public, max-age=300, stale-while-revalidate=86400');
  const etag = first.headers.get('etag');
  assert.match(etag, /^"[a-f0-9]{32}"$/);
  assert.equal(first.headers.get('access-control-allow-origin'), '*');
  assert.match(first.headers.get('access-control-expose-headers'), /ETag/);
  const body = await first.text();
  assert.equal(etag, `"${hash(body).slice(0, 32)}"`);
  const again = await handlePublicApi(get('/api/v1/search?q=sample', { 'if-none-match': `W/${etag}, "other"` }), env);
  assert.equal(again.status, 304);
  assert.equal(again.headers.get('etag'), etag);
  assert.equal(await again.text(), '');
  assert.equal((await handlePublicApi(get('/api/v1/search?q=sample', { 'if-none-match': '"stale"' }), env)).status, 200);
  for (const path of ['/api/v1/status', '/api/v1/openapi.json', '/api/v1/skills/sample', '/api/v1/items/sample', '/api/v1/documents?q=sample', '/api/v1/plan?q=draft']) {
    const response = await handlePublicApi(get(path), env);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('etag'), path);
    assert.match(response.headers.get('cache-control'), /^public/, path);
  }
  // Errors and POST replies are never cached.
  assert.equal((await handlePublicApi(get('/api/v1/skills/missing'), env)).headers.get('cache-control'), 'no-store');
  assert.equal((await handlePublicApi(post('/mcp', init), env)).headers.get('cache-control'), 'no-store');
  const head = await handlePublicApi(new Request(origin + '/api/v1/search?q=sample', { method: 'HEAD', headers: edgeHeaders }), env);
  assert.equal(head.headers.get('etag'), etag);
  assert.equal(await head.text(), '');
});

test('the catalogue loads once per isolate, survives time passing, and a failed load is retried', async () => {
  const { env, fetched } = environment();
  const realNow = Date.now;
  try {
    await handlePublicApi(get('/api/v1/search?q=sample'), env);
    const loads = fetched.filter(p => p === '/data/public-api-manifest.json').length;
    assert.equal(loads, 1);
    Date.now = () => realNow() + 10 * 60_000;
    await handlePublicApi(get('/api/v1/search?q=draft'), env);
    await handlePublicApi(get('/api/v1/skills/sample'), env);
    assert.equal(fetched.filter(p => p === '/data/public-api-manifest.json').length, 1, 'no reload after 10 minutes');
  } finally { Date.now = realNow; }
  let failing = true;
  const flaky = environment({}, { fail: path => failing && path === '/data/blocks.json' });
  assert.equal((await handlePublicApi(get('/api/v1/search?q=sample'), flaky.env)).status, 503);
  failing = false;
  assert.equal((await handlePublicApi(get('/api/v1/search?q=sample'), flaky.env)).status, 200, 'the next request loads again');
});

test('a stale revision says what changed; an earlier id for the same files is still accepted', async () => {
  assert.deepEqual(changesSince({ history: [{ revision_sha256: 'x', changed: ['b.md'] }, { revision_sha256: 'y', changed: ['a.md', 'b.md'] }] }, 'y'), ['a.md', 'b.md']);
  assert.equal(changesSince({ history: [] }, 'y'), null);
  const { env } = environment();
  const stale = await handlePublicApi(get(`/api/v1/skills/sample?revision_sha256=${older}`), env);
  assert.equal(stale.status, 409);
  const body = await stale.json();
  assert.equal(body.error.code, 'stale_revision');
  assert.match(body.error.message, /Changed: SKILL\.md\./);
  assert.match(body.error.message, new RegExp(revision));
  assert.deepEqual(body.error.details, { slug: 'sample', requested_revision_sha256: older, current_revision_sha256: revision, updated: '2026-11-01', changed: ['SKILL.md'] });
  const oldestBody = await (await handlePublicApi(get(`/api/v1/skills/sample?revision_sha256=${oldest}`), env)).json();
  assert.deepEqual(oldestBody.error.details.changed, ['SKILL.md', 'references/guide.md']);
  const unknown = await (await handlePublicApi(get(`/api/v1/skills/sample?revision_sha256=${'e'.repeat(64)}`), env)).json();
  assert.equal(unknown.error.details.changed, null);
  assert.match(unknown.error.message, /older than the change history/);
  const same = await handlePublicApi(get(`/api/v1/skills/sample?revision_sha256=${sameFiles}`), env);
  assert.equal(same.status, 200);
  assert.equal((await same.json()).revision_sha256, revision);
  const resource = await (await handlePublicApi(get(`/api/v1/resources/sample?path=SKILL.md&revision_sha256=${sameFiles}`), env)).json();
  assert.equal(resource.revision_sha256, revision, 'replies always carry the current revision');
  // MCP shows the same plain message.
  const viaMcp = await (await handlePublicApi(post('/mcp', rpc('tools/call', { name: 'get_skill', arguments: { slug: 'sample', revision_sha256: older } })), env)).json();
  assert.match(viaMcp.result.content[0].text, /Changed: SKILL\.md/);
});

test('OpenAPI documents response schemas by schema id, one Error component and the 400/404/409/413/429 responses', async () => {
  const { env } = environment();
  const spec = await (await handlePublicApi(get('/api/v1/openapi.json'), env)).json();
  const { schemas, responses } = spec.components;
  assert.deepEqual(Object.keys(schemas.Error.properties.error.properties), ['code', 'message', 'issues', 'details']);
  for (const ids of Object.values(OPENAPI_RESULT_SCHEMAS)) for (const id of ids) assert.equal(schemas[id.replace('/', '.')].properties.schema.const, id, id);
  for (const name of ['BadRequest', 'Forbidden', 'NotFound', 'Conflict', 'PayloadTooLarge', 'UnsupportedMediaType', 'TooManyRequests', 'ServiceUnavailable']) assert.equal(responses[name].content['application/json'].schema.$ref, '#/components/schemas/Error', name);
  assert.ok(responses.TooManyRequests.headers['Retry-After']);
  assert.ok(responses.TooManyRequests.headers.RateLimit);
  const operations = Object.values(spec.paths).flatMap(p => Object.values(p));
  for (const op of operations) {
    for (const code of ['200', '400', '403', '404', '429', '503']) assert.ok(op.responses[code], `${op.operationId} ${code}`);
    if (op.requestBody) for (const code of ['409', '413', '415']) assert.ok(op.responses[code], `${op.operationId} ${code}`);
  }
  const ops = Object.fromEntries(operations.map(op => [op.operationId, op]));
  for (const id of ['get_skill', 'get_workflow', 'get_item', 'get_resource']) assert.ok(ops[id].responses['409'] && ops[id].responses['413'], id);
  assert.equal(ops.search_library.responses['200'].content['application/json'].schema.$ref, '#/components/schemas/abb-search.2');
  assert.deepEqual(ops.plan_workflow.responses['200'].content['application/json'].schema.oneOf.map(s => s.$ref), ['#/components/schemas/abb-workflow-plan.1', '#/components/schemas/abb-step-map.1']);
  assert.ok(ops.search_library.parameters.some(p => p.name === 'q'), 'q is documented as the short form');
  assert.ok(ops.search_library.parameters.some(p => p.$ref === '#/components/parameters/IfNoneMatch'));
  // Real replies carry one of the ids their operation documents.
  const replies = { search_library: '/api/v1/search?q=sample', get_skill: '/api/v1/skills/sample', get_item: '/api/v1/items/sample', plan_workflow: '/api/v1/plan?q=draft', get_resource: `/api/v1/resources/sample?path=SKILL.md&revision_sha256=${revision}` };
  for (const [operation, path] of Object.entries(replies)) assert.ok(OPENAPI_RESULT_SCHEMAS[operation].includes((await (await handlePublicApi(get(path), env)).json()).schema), operation);
  const prepared = await (await handlePublicApi(post('/api/v1/workflow-preparations', { name: 'Mine', goal: 'Draft', steps: [{ id: 'first', slug: 'sample', revision_sha256: revision }] }), env)).json();
  assert.ok(OPENAPI_RESULT_SCHEMAS.prepare_workflow.includes(prepared.schema));
  // Every $ref resolves.
  const refs = JSON.stringify(spec).match(/"\$ref":"#\/components\/[^"]+"/g);
  for (const raw of refs) { const [, kind, name] = raw.match(/#\/components\/([^/]+)\/([^"]+)/); assert.ok(spec.components[kind][name], raw); }
});
