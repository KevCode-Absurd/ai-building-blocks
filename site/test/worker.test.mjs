import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../src/worker.ts';

test('known legacy Mercatura app URL redirects to apps and preserves its query for GET and HEAD', async () => {
  const env = { ASSETS: { async fetch() { return new Response('Missing', { status: 404 }); } } };
  for (const method of ['GET', 'HEAD']) {
    const response = await worker.fetch(new Request('https://example.test/apps/mercatura-ads?source=saved', { method }), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), 'https://example.test/apps?source=saved');
  }
  for (const path of ['/apps/unknown', '/apps/mercatura-ads/details']) assert.equal((await worker.fetch(new Request('https://example.test' + path), env)).status, 404);
  assert.equal((await worker.fetch(new Request('https://example.test/apps/mercatura-ads', { method: 'POST' }), env)).status, 404);
});

test('Workers routes existing APIs before static assets and keeps unknown APIs as JSON 404s', async () => {
  const env = { API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: { async limit() { return { success: true }; } }, ASSETS: { fetch() { throw new Error('API leaked into asset routing'); } } };
  for (const path of ['/api/comments', '/api/comments/', '/api/spaces', '/api/spaces/me', '/api/spaces/shared/test']) {
    const response = await worker.fetch(new Request('https://example.test' + path, { headers: { 'cf-connecting-ip': '192.0.2.1' } }), env);
    assert.equal(response.status, 503, path); // Existing handler: database is not connected.
    assert.match(response.headers.get('content-type'), /json/);
  }
  const response = await worker.fetch(new Request('https://example.test/api/compose', { headers: { 'cf-connecting-ip': '192.0.2.1' } }), env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).enabled, false);
  for (const path of ['/api', '/api/missing', '/api/comments-extra', '/api/compose/other']) {
    const response = await worker.fetch(new Request('https://example.test' + path, { headers: { 'cf-connecting-ip': '192.0.2.1' } }), env);
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
});

test('Workers passes asset requests intact so Cloudflare retains rewrites, redirects, queries and HEAD behavior', async () => {
  for (const path of ['/', '/space', '/people', '/s/test-token', '/example-app/', '/skills/website-brand-brain-builder/SKILL.md?download=1', '/missing']) {
    const request = new Request('https://example.test' + path, { method: 'HEAD' });
    const response = new Response(null, { status: 204, headers: { 'x-asset-service': 'preserved' } });
    const result = await worker.fetch(request, { ASSETS: { async fetch(received) { assert.equal(received, request); return response; } } });
    assert.equal(result, response);
  }
});

test('Workers deployment protects API, MCP and consent routing while isolating staging data', () => {
  const config = JSON.parse(fs.readFileSync('wrangler.example.jsonc', 'utf8'));
  assert.equal(config.main, 'src/worker.ts');
  assert.equal(config.pages_build_output_dir, undefined);
  assert.equal(config.assets.directory, './dist');
  assert.equal(config.assets.binding, 'ASSETS');
  assert.equal(config.assets.html_handling, 'auto-trailing-slash');
  assert.equal(config.assets.not_found_handling, undefined, 'Missing paths reach the router for canonical repair and a custom 404');
  assert(config.compatibility_flags.includes('assets_navigation_has_no_effect'));
  // Item pages stay asset-first (no Worker on a page view); their .md and .json twins reach the Worker on the asset miss.
  assert.deepEqual(config.assets.run_worker_first, ['/api', '/api/*', '/mcp', '/mcp/*', '/oauth/*', '/.well-known/*', '/connect-mcp', '/connect-mcp.html']);
  assert.equal(config.vars.PUBLIC_API_ENABLED, 'false');
  assert.equal(config.vars.MCP_OAUTH_ENABLED, 'false');
  const prod = config.d1_databases, stage = config.env.staging.d1_databases;
  assert.deepEqual(prod.map(db => db.binding), ['COMMENTS', 'SPACES', 'COMPOSER']);
  assert.deepEqual(stage.map(db => db.binding), prod.map(db => db.binding));
  assert(stage.every(db => !prod.some(p => p.database_id === db.database_id)));
  assert.equal(config.vars.WORKFLOW_COMPOSER_ENABLED, 'false');
  assert.equal(config.env.staging.vars.WORKFLOW_COMPOSER_ENABLED, 'false');
  assert(!('routes' in config), 'Domain cutover follows preview verification');
});

test('unknown pages keep the custom 404 HTML and its headers with a real 404 status', async () => {
  const request = new Request('https://example.test/unknown');
  const response = await worker.fetch(request, { ASSETS: { async fetch(req) {
    return new URL(req.url).pathname === '/404' ? new Response('Custom 404 page', { headers: { 'x-content-type-options': 'nosniff' } }) : new Response('Missing', { status: 404 });
  } } });
  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'Custom 404 page');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
});

test('missing typed links redirect to the real block type, preserve queries and retain unknown 404s', async () => {
  const env = { ASSETS: { async fetch(request) {
    if (new URL(request.url).pathname === '/data/blocks.json') return Response.json({ blocks: [
      { slug: 'example-prompt', type: 'prompt' }, { slug: 'example-routine', type: 'routine' },
    ], renamed: { 'old-prompt': 'example-prompt' } });
    return new Response('Custom not found', { status: 404 });
  } } };
  for (const [path, expected] of [['/skills/example-prompt', '/prompts/example-prompt'], ['/agents/example-routine', '/workflows/example-routine'], ['/skills/old-prompt', '/prompts/example-prompt']]) {
    const response = await worker.fetch(new Request('https://example.test' + path + '?source=saved'), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), 'https://example.test' + expected + '?source=saved');
  }
  for (const path of ['/skills/no-such-slug', '/prompts/example-prompt']) {
    const response = await worker.fetch(new Request('https://example.test' + path), env);
    assert.equal(response.status, 404);
    assert.equal(await response.text(), 'Custom not found');
  }
});

test('missing saved-tour pages retain their own 404 for GET and HEAD while other paths use the site 404', async () => {
  for (const method of ['GET', 'HEAD']) {
    for (const path of ['/example-app/not-a-screen', '/example-app/deep/missing', '/tools/not-a-tool']) {
      const tour = path.startsWith('/example-app/');
      const calls = [];
      const result = await worker.fetch(new Request('https://example.test' + path, { method }), { ASSETS: { async fetch(req) {
        const asset = new URL(req.url).pathname;
        calls.push(asset);
        assert.equal(req.method, method);
        if (asset === '/example-app/404' || asset === '/404') return new Response(method === 'HEAD' ? null : asset === '/example-app/404' ? "This screen isn't in the tour" : 'Site not found', { headers: { 'x-content-type-options': 'nosniff' } });
        return new Response(null, { status: 404 });
      } } });
      assert.equal(result.status, 404);
      assert.equal(await result.text(), method === 'HEAD' ? '' : tour ? "This screen isn't in the tour" : 'Site not found');
      assert.equal(result.headers.get('x-content-type-options'), 'nosniff');
      assert.deepEqual(calls, [path, tour ? '/example-app/404' : '/404']);
    }
  }
});
