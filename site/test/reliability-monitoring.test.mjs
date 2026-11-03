import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {isChunkError, shouldReload, recoverFromChunkError} from '../src/lib/chunk-recovery.ts';
import {safeErrorText} from '../src/lib/safe-error-text.ts';
import {safeRoute, withRequestLog} from '../src/server/request-log.ts';
import {cleanReport, clientError, resetClientErrorLimits} from '../src/server/client-error.ts';
import worker from '../src/worker.ts';

const memory = () => { const data = new Map(); return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)) }; };
const quiet = () => { const lines = []; return { lines, log: line => lines.push(['log', JSON.parse(line)]), error: line => lines.push(['error', JSON.parse(line)]) }; };

test('failed code loads from every browser count as chunk failures; ordinary errors do not', () => {
  for (const message of [
    'Failed to fetch dynamically imported module: https://useaiblocks.com/assets/BlockPage-abc123.js',
    'Importing a module script failed.',
    'error loading dynamically imported module: https://useaiblocks.com/assets/x.js',
    'Unable to preload CSS for /assets/ToolsPage-1a2b.css',
  ]) assert.equal(isChunkError(new TypeError(message)), true, message);
  assert.equal(isChunkError({ name: 'ChunkLoadError', message: '' }), true);
  for (const value of [new TypeError("Cannot read properties of undefined (reading 'map')"), null, undefined, 'text']) assert.equal(isChunkError(value), false);
});

test('a page reloads at most once a minute, and never without storage to remember it', () => {
  const storage = memory(), now = 1_000_000;
  assert.equal(shouldReload(storage, now), true);
  assert.equal(shouldReload(storage, now + 30_000), false, 'a second failure right after the reload shows the recovery screen');
  assert.equal(shouldReload(storage, now + 61_000), true, 'a later deploy can reload again');
  assert.equal(shouldReload(null, now), false);
  assert.equal(shouldReload({ getItem: () => null, setItem: () => { throw new Error('quota'); } }, now), false);
  assert.equal(shouldReload({ getItem: () => null, setItem: () => {} }, now), false, 'storage that does not keep the value cannot guard a loop');
  // Outside a browser there is no session storage, so nothing reloads.
  let reloaded = false;
  assert.equal(recoverFromChunkError(new TypeError('Importing a module script failed.'), () => { reloaded = true; }), false);
  assert.equal(reloaded, false);
});

test('error reports keep the shape of a message, never names, numbers, quoted text or addresses', () => {
  assert.equal(safeErrorText('Failed to fetch dynamically imported module: https://useaiblocks.com/assets/BlockPage-abc123.js'), 'Failed to fetch dynamically imported module: /assets/BlockPage-abc#.js');
  assert.equal(safeErrorText(`Cannot read properties of undefined (reading 'Sprout Coffee plan')`), 'Cannot read properties of undefined (reading <text>)');
  assert.equal(safeErrorText('Saved for owner@example.com at 07700 900123 via https://example.com/s/secret-token?x=1'), 'Saved for <email> at # # via <url>');
  assert.equal(safeErrorText({ message: 'x' }), '');
  assert.ok(safeErrorText('x'.repeat(5000)).length <= 200);
});

test('logged routes drop share tokens, ids, emails and query strings', () => {
  assert.equal(safeRoute('/api/v1/items/website-brand-brain-builder'), '/api/v1/items/website-brand-brain-builder');
  assert.equal(safeRoute('/s/abcDEF123-private'), '/s/:id');
  assert.equal(safeRoute('/people/Jo%20Bloggs'), '/people/:id');
  assert.equal(safeRoute('/api/spaces/0d5c6a3e-8f7b-4c1d-9e2f-3a4b5c6d7e8f/items'), '/api/spaces/:id/items');
  assert.equal(safeRoute('/community/owner%40example.com'), '/community/:id');
  assert.equal(safeRoute('/api/x/' + 'A'.repeat(30)), '/api/x/:id');
  assert.equal(safeRoute('/skills/<script>'), '/skills/:x');
});

test('the Worker logs failures with a cleaned route and error id, and turns a throw into a 500', async () => {
  const logger = quiet();
  const ok = new Response('fine');
  assert.equal(await withRequestLog(new Request('https://useaiblocks.com/skills/x.md?q=private'), async () => ok, logger), ok);
  assert.equal(logger.lines.length, 0, 'fast successes are counted by Cloudflare, not logged');
  await withRequestLog(new Request('https://useaiblocks.com/s/token123?q=private'), async () => new Response('', { status: 404 }), logger, () => 0);
  assert.deepEqual(logger.lines.pop(), ['log', { event: 'request', method: 'GET', route: '/s/:id', status: 404, ms: 0 }]);
  let clock = 0;
  await withRequestLog(new Request('https://useaiblocks.com/api/v1/status'), async () => { clock = 2_500; return new Response('{}'); }, logger, () => clock);
  assert.equal(logger.lines.pop()[1].ms, 2_500, 'slow requests are logged');
  const failed = await withRequestLog(new Request('https://useaiblocks.com/api/v1/items'), async () => new Response('x', { status: 503 }), logger);
  const [level, line] = logger.lines.pop();
  assert.equal(level, 'error'); assert.equal(line.status, 503); assert.match(line.id, /^[0-9a-f]{8}$/);
  assert.equal(failed.headers.get('x-error-id'), line.id);
  const thrown = await withRequestLog(new Request('https://useaiblocks.com/api/compose', { method: 'POST' }), async () => { throw new RangeError('SELECT * FROM users WHERE email = owner@example.com'); }, logger);
  const [, crash] = logger.lines.pop();
  assert.equal(thrown.status, 500);
  assert.deepEqual(await thrown.json(), { error: 'Something went wrong on our side. Please try again.', error_id: crash.id });
  assert.equal(crash.event, 'worker_error'); assert.equal(crash.error, 'RangeError');
  assert.doesNotMatch(JSON.stringify(crash), /SELECT|example\.com/);
  const page = await withRequestLog(new Request('https://useaiblocks.com/skills/x.json'), async () => { throw new Error('boom'); }, logger);
  assert.equal(page.headers.get('content-type'), 'text/plain; charset=utf-8');
  assert.match(await page.text(), /Please reload the page\. \(Error [0-9a-f]{8}\)/);
});

test('client reports and policy reports are cleaned to a closed set of fields', () => {
  assert.deepEqual(cleanReport(JSON.stringify({ kind: 'chunk', route: '/s/secret?x=1', name: 'TypeError', message: 'Importing a module script failed: https://useaiblocks.com/assets/a-1.js', extra: 'dropped' }), 'text/plain'),
    [{ kind: 'chunk', route: '/s/:id', name: 'TypeError', message: 'Importing a module script failed: /assets/a-#.js' }]);
  assert.deepEqual(cleanReport(JSON.stringify({ kind: 'boundary', route: '/compose', name: 'MadeUpName<script>', message: 1 }), 'text/plain'),
    [{ kind: 'boundary', route: '/compose', name: 'Error', message: '' }]);
  assert.deepEqual(cleanReport(JSON.stringify({ 'csp-report': { 'document-uri': 'https://useaiblocks.com/s/secret?q=1', 'effective-directive': 'script-src-elem', 'blocked-uri': 'https://evil.example/x.js?token=1', disposition: 'report' } }), 'application/csp-report'),
    [{ kind: 'csp', route: '/s/:id', directive: 'script-src-elem', blocked: 'https://evil.example', disposition: 'report' }]);
  assert.deepEqual(cleanReport(JSON.stringify([{ type: 'csp-violation', body: { documentURL: 'https://useaiblocks.com/', effectiveDirective: 'script-src-elem', blockedURL: 'inline', disposition: 'report' } }]), 'application/reports+json'),
    [{ kind: 'csp', route: '/', directive: 'script-src-elem', blocked: 'inline', disposition: 'report' }]);
  for (const [text, type] of [['not json', 'text/plain'], ['{"kind":"anything"}', 'text/plain'], ['[]', 'application/reports+json'], ['null', 'text/plain']]) assert.equal(cleanReport(text, type), null);
});

test('/api/client-error accepts same-site reports only, logs one line each and has its own small limit', async () => {
  resetClientErrorLimits();
  const env = { API_ALLOWED_HOSTS: 'useaiblocks.com' };
  const post = (body, headers = {}, url = 'https://useaiblocks.com/api/client-error') => new Request(url, { method: 'POST', body, headers: { 'cf-connecting-ip': '203.0.113.9', 'content-type': 'text/plain', ...headers } });
  const report = JSON.stringify({ kind: 'boundary', route: '/compose', name: 'TypeError', message: 'x is not a function' });
  const logger = quiet();
  assert.equal((await clientError(new Request('https://useaiblocks.com/api/client-error'), env, logger)).status, 405);
  assert.equal((await clientError(post(report, {}, 'https://elsewhere.test/api/client-error'), env, logger)).status, 403);
  assert.equal((await clientError(post(report, { origin: 'https://evil.example' }), env, logger)).status, 403);
  assert.equal((await clientError(post(report, { 'sec-fetch-site': 'cross-site' }), env, logger)).status, 403);
  assert.equal((await clientError(post('x'.repeat(9000)), env, logger)).status, 413);
  assert.equal((await clientError(post('{"kind":"nope"}'), env, logger)).status, 400);
  const accepted = await clientError(post(report, { origin: 'https://useaiblocks.com' }), env, logger);
  assert.equal(accepted.status, 204);
  const [level, line] = logger.lines.at(-1);
  assert.equal(level, 'error');
  assert.deepEqual(Object.keys(line).sort(), ['event', 'id', 'kind', 'message', 'name', 'route']);
  assert.doesNotMatch(JSON.stringify(line), /203\.0\.113/);
  let status = 0;
  for (let i = 0; i < 12 && status !== 429; i++) status = (await clientError(post(report), env, logger)).status;
  assert.equal(status, 429);
  // A shared limiter, when bound, is asked too.
  resetClientErrorLimits();
  const denied = await clientError(post(report), { ...env, CLIENT_ERROR_LIMITER: { limit: async () => ({ success: false }) } }, logger);
  assert.equal(denied.status, 429);
  resetClientErrorLimits();
});

test('the Worker routes /api/client-error before the shared API limiter, so reports never use up a visitor\'s save limit', async () => {
  resetClientErrorLimits();
  let shared = 0;
  const env = { API_ALLOWED_HOSTS: 'useaiblocks.com', API_WRITE_LIMITER: { limit: async () => { shared++; return { success: true }; } }, API_READ_LIMITER: { limit: async () => ({ success: true }) }, ASSETS: { fetch: async () => new Response('', { status: 404 }) } };
  const origError = console.error; console.error = () => {};
  try {
    const response = await worker.fetch(new Request('https://useaiblocks.com/api/client-error', { method: 'POST', body: JSON.stringify({ kind: 'chunk', route: '/', name: 'TypeError', message: 'Importing a module script failed.' }), headers: { 'cf-connecting-ip': '203.0.113.10' } }), env);
    assert.equal(response.status, 204);
  } finally { console.error = origError; resetClientErrorLimits(); }
  assert.equal(shared, 0);
});

test('Workers Logs are on with sampling, query strings redacted and raw per-request logs off', () => {
  const config = JSON.parse(fs.readFileSync('wrangler.example.jsonc', 'utf8'));
  for (const c of [config, config.env.staging]) {
    assert.equal(c.observability.enabled, true);
    assert.ok(c.observability.head_sampling_rate > 0 && c.observability.head_sampling_rate <= 1);
    assert.equal(c.observability.redact_query_string, true);
    assert.equal(c.observability.logs.invocation_logs, false);
  }
});

test('the app reloads once on a failed code load and reports page failures from the recovery screen', () => {
  const main = fs.readFileSync('src/main.tsx', 'utf8'), recovery = fs.readFileSync('src/PageRecovery.tsx', 'utf8');
  assert.ok(main.indexOf('installChunkRecovery();') > 0 && main.indexOf('installChunkRecovery();') < main.indexOf('createRoot('), 'listeners are installed before the app renders');
  assert.match(recovery, /componentDidCatch\(error: unknown\) \{\n\s+if \(isChunkError\(error\) && recoverFromChunkError\(error\)\) return;\n\s+reportClientError\(/);
});
