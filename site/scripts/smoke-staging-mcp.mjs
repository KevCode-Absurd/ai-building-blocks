// Explicit staging target only. Credentials and private response bodies never enter logs or evidence files.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

class SmokeFailure extends Error { constructor(check) { super(check); this.check = check; } }
const ensure = (condition, check) => { if (!condition) throw new SmokeFailure(check); };
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const random = () => randomBytes(32).toString('base64url');
const hashPattern = /^[a-f0-9]{64}$/;
const rpcHeaders = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };

export function stagingTarget(env, local = false) {
  let origin;
  try { origin = new URL(env.MCP_STAGING_ORIGIN); } catch { throw new SmokeFailure('explicit-staging-origin-required'); }
  ensure(!origin.username && !origin.password && !origin.search && !origin.hash && origin.pathname === '/', 'origin-must-be-bare');
  const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname);
  ensure(local ? loopback && origin.protocol === 'http:' : !loopback && origin.protocol === 'https:', 'target-transport');
  ensure(!/(?:^|\.)useaiblocks\.com$/i.test(origin.hostname), 'production-target-refused');
  ensure(local || /(?:staging|preview|test)/i.test(origin.hostname), 'target-must-identify-staging');
  const resourcePath = env.MCP_STAGING_RESOURCE_PATH ?? '/mcp/company';
  ensure(resourcePath === '/mcp/personal' || /^\/mcp\/company(?:\/[A-Za-z0-9_-]{24,128})?$/.test(resourcePath), 'private-resource-path');
  const kind = resourcePath === '/mcp/personal' ? 'personal' : 'company';
  return { origin: origin.origin, resource: new URL(resourcePath, origin).href, resourcePath, kind, scope: kind === 'personal' ? 'saved:read' : 'company:read', environment: local ? 'actual-local-http' : 'real-staging-http' };
}

/** Redirects never carry credentials to another host. Captured errors contain only fixed check identifiers. */
function httpClient(target, preview, fetchImpl, spacing = 2500) {
  let last = 0;
  return async (input, init = {}, token) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
    ensure(url.origin === target.origin, 'same-origin-request');
    const delay = Math.max(0, last + spacing - Date.now());
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    last = Date.now();
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    if (preview) headers.set('x-preview-access', preview);
    if (token) headers.set('authorization', `Bearer ${token}`);
    return fetchImpl(input, { ...init, headers, redirect: 'error', signal: AbortSignal.timeout(20000) });
  };
}

async function json(response, expected, check) {
  ensure(response.status === expected, check);
  ensure(/application\/json/i.test(response.headers.get('content-type') ?? ''), `${check}-json`);
  const bytes = await response.arrayBuffer(); ensure(bytes.byteLength <= 4_000_000, `${check}-response-size`);
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new SmokeFailure(`${check}-parse`); }
}
const privateHeaders = response => {
  ensure(/private/.test(response.headers.get('cache-control') ?? '') && /no-store/.test(response.headers.get('cache-control') ?? ''), 'private-cache-control');
  ensure(/authorization/i.test(response.headers.get('vary') ?? ''), 'authorization-vary');
};

/** Performs browser sign-in/consent without printing an authorization URL, copying a bearer token or persisting credentials. */
export async function browserOAuth(target, http, note) {
  const verifier = random(), state = random();
  let authorization, finish;
  const completed = new Promise(resolve => { finish = resolve; });
  const server = createServer((req, res) => {
    res.setHeader('cache-control', 'no-store'); res.setHeader('referrer-policy', 'no-referrer');
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (url.pathname === '/start' && authorization) { res.writeHead(302, { location: authorization }); res.end(); return; }
    if (url.pathname !== '/callback' || !url.searchParams.get('code') || url.searchParams.getAll('state').length !== 1) { res.writeHead(400); res.end('Invalid authorization callback.'); return; }
    const supplied = Buffer.from(url.searchParams.get('state')), expected = Buffer.from(state);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) { res.writeHead(400); res.end('Authorization state did not match.'); return; }
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'content-security-policy': "default-src 'none'; frame-ancestors 'none'" });
    res.end('Connection received. Return to the staging check. No credentials are displayed.');
    finish(url.searchParams.get('code'));
  });
  let timer;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    const port = server.address().port, callback = `http://127.0.0.1:${port}/callback`;
    const client = await json(await http(new URL('/oauth/register', target.origin), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ client_name: target.clientName ?? 'AI Blocks staging verification', redirect_uris: [callback], grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'], token_endpoint_auth_method: 'none', scope: target.scope }) }), 201, 'real-oauth-registration');
    ensure(typeof client.client_id === 'string', 'registration-client-id');
    const params = new URLSearchParams({ client_id: client.client_id, redirect_uri: callback, response_type: 'code', code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256', scope: target.scope, resource: target.resource, state });
    const context = await json(await http(new URL(`/oauth/authorization-context?${params}`, target.origin)), 200, 'authorization-context');
    ensure(context.client_id === client.client_id && context.resource === target.resource && context.redirect_uri === callback, 'consent-context-binding');
    if (target.verifyConsentPage) await target.verifyConsentPage(params);
    authorization = new URL(`/oauth/authorize?${params}`, target.origin).href;
    note(`Open http://127.0.0.1:${port}/start to sign in and approve this staging-only test client. Browser preview access must already be active.`);
    const code = await Promise.race([completed, new Promise((_, reject) => { timer = setTimeout(() => reject(new SmokeFailure('browser-consent-timeout')), 600000); })]);
    const tokens = await json(await http(new URL('/oauth/token', target.origin), { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', code, client_id: client.client_id, redirect_uri: callback, code_verifier: verifier, resource: target.resource }) }), 200, 'authorization-code-exchange');
    ensure(hashPattern.test(tokens.access_token) && hashPattern.test(tokens.refresh_token), 'issued-token-format');
    ensure(tokens.scope === target.scope && tokens.resource === target.resource, 'issued-token-scope');
    return { clientId: client.client_id, access: tokens.access_token, refresh: tokens.refresh_token };
  } finally { clearTimeout(timer); await new Promise(resolve => server.close(resolve)); }
}

export async function runStagingSmoke({ target, preview, accessToken, skillItemId, workflowItemId, fetchImpl = fetch, spacing = 2500, oauth = false, note = () => {} }) {
  const evidence = { schema: 'abb-staging-mcp-evidence/1', recorded_at: new Date().toISOString(), environment: target.environment, target_origin: target.origin, authentication: oauth ? 'browser-oauth-pending' : accessToken ? 'externally-provided-access-token' : 'unauthenticated', checks: [], limitations: ['No model execution is performed by this script.', 'No credentials, company names, item IDs, private paths or content are recorded.', 'Browser OAuth and saved item retrieval do not establish Codex compatibility.'] };
  const passed = id => evidence.checks.push({ id, status: 'PASS' });
  const http = httpClient(target, preview, fetchImpl, spacing);
  const personal = target.kind === 'personal';
  const names = personal ? { list: 'list_saved_items', item: 'get_saved_item', resource: 'get_saved_resource', prepare: 'prepare_saved_workflow' } : { list: 'list_company_items', item: 'get_company_item', resource: 'get_company_resource', prepare: 'prepare_company_workflow' };
  let issued;
  try {
    const metadata = await json(await http(new URL('/.well-known/oauth-authorization-server', target.origin)), 200, 'authorization-metadata');
    ensure(metadata.issuer === target.origin && metadata.code_challenge_methods_supported?.includes('S256'), 'authorization-metadata-binding'); passed('authorization-server-discovery');
    const protectedMetadata = await json(await http(new URL(`/.well-known/oauth-protected-resource${target.resourcePath}`, target.origin)), 200, 'resource-metadata');
    ensure(protectedMetadata.resource === target.resource && protectedMetadata.authorization_servers?.includes(target.origin), 'protected-resource-binding'); passed('protected-resource-discovery');
    const anonymous = await http(target.resource, { method: 'POST', headers: rpcHeaders, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) });
    ensure(anonymous.status === 401 && /oauth-protected-resource/.test(anonymous.headers.get('www-authenticate') ?? ''), 'anonymous-challenge'); privateHeaders(anonymous); passed('anonymous-rejection-and-private-headers');
    if (oauth) {
      issued = await browserOAuth(target, http, note); evidence.authentication = 'real-browser-oauth'; passed('real-browser-sign-in-consent-pkce-code-exchange');
      const rotated = await json(await http(new URL('/oauth/token', target.origin), { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: issued.refresh, client_id: issued.clientId, resource: target.resource }) }), 200, 'refresh-token-exchange');
      ensure(hashPattern.test(rotated.access_token) && hashPattern.test(rotated.refresh_token) && rotated.refresh_token !== issued.refresh, 'refresh-rotation');
      issued = { ...issued, access: rotated.access_token, refresh: rotated.refresh_token }; accessToken = issued.access; passed('refresh-token-rotation');
    }
    if (!accessToken) { evidence.checks.push({ id: 'authenticated-private-resources', status: 'NOT_RUN' }); return evidence; }
    ensure(hashPattern.test(accessToken), 'access-token-format');
    ensure(typeof skillItemId === 'string' && skillItemId && typeof workflowItemId === 'string' && workflowItemId, 'explicit-synthetic-fixture-item-ids-required');
    const client = new Client({ name: 'ai-blocks-staging-smoke', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(new URL(target.resource), { fetch: (input, init) => http(input, init, accessToken) });
    const call = async (name, args) => { const result = await client.callTool({ name, arguments: args }); ensure(!result.isError && result.structuredContent, `tool-${name}`); return result.structuredContent; };
    let resourceCount = 0;
    const readInventory = async item => {
      ensure(hashPattern.test(item.revision_sha256) && Array.isArray(item.resources) && item.resources.length <= 100, 'item-resource-inventory');
      for (const resource of item.resources) {
        ensure(resource.bytes <= 512000 && hashPattern.test(resource.sha256), 'bounded-resource');
        const parts = []; let offset = 0;
        for (let chunk = 0; ; chunk++) {
          ensure(chunk < 32, 'bounded-chunk-count');
          const result = await call(names.resource, { item_id: item.item_id, revision_sha256: item.revision_sha256, path: resource.path, offset, limit: 48000 });
          ensure(result.encoding === 'base64' && result.offset === offset && result.revision_sha256 === item.revision_sha256, 'resource-chunk-binding');
          const bytes = Buffer.from(result.content, 'base64'); ensure(bytes.byteLength <= 48000, 'bounded-resource-chunk'); parts.push(bytes);
          if (result.next_offset === null) break;
          ensure(result.next_offset === offset + bytes.byteLength && result.next_offset > offset, 'ordered-resource-chunks'); offset = result.next_offset;
        }
        const complete = Buffer.concat(parts); ensure(complete.byteLength === resource.bytes && digest(complete) === resource.sha256, 'complete-resource-hash'); resourceCount++;
      }
    };
    try {
      await client.connect(transport); ensure(client.getServerVersion()?.name === (personal ? 'ai-blocks-personal-library' : 'ai-blocks-company-workspace'), 'private-server-identity');
      const tools = (await client.listTools()).tools.map(t => t.name);
      ensure([...Object.values(names), 'search_library', 'get_skill', 'get_workflow', 'get_resource', 'prepare_workflow'].every(name => tools.includes(name)), 'private-and-public-tool-discovery'); passed('official-sdk-private-and-public-tools-in-one-connection');
      const listing = await call(names.list, { limit: 25 });
      ensure(listing.items?.some(i => i.item_id === skillItemId) && listing.items?.some(i => i.item_id === workflowItemId), 'isolated-fixture-workspace-lists-saved-skill-and-workflow'); passed('saved-company-item-discovery');
      const item = await call(names.item, { item_id: skillItemId }); await readInventory(item);
      const restPath = target.resourcePath.replace('/mcp/', '/api/v1/');
      const restResponse = await http(new URL(`${restPath}/items/${encodeURIComponent(skillItemId)}?revision_sha256=${item.revision_sha256}`, target.origin), {}, accessToken); privateHeaders(restResponse);
      const rest = await json(restResponse, 200, 'private-rest-item'); ensure(rest.revision_sha256 === item.revision_sha256 && rest.resources.length === item.resources.length, 'rest-mcp-revision-parity'); passed('saved-skill-full-retrieval-and-rest-parity');
      const again = await call(names.item, { item_id: skillItemId, revision_sha256: item.revision_sha256 }); ensure(again.revision_sha256 === item.revision_sha256, 'saved-skill-reuse'); passed('saved-skill-repeat-retrieval');
      const workflow = await call(names.item, { item_id: workflowItemId }); await readInventory(workflow);
      const prepared = await call(names.prepare, { item_id: workflowItemId, revision_sha256: workflow.revision_sha256 });
      ensure(prepared.status !== 'BLOCKED' && prepared.steps_run === 0 && prepared.execution_status === 'NOT_RUN', 'workflow-unblocked-not-executed');
      ensure(prepared.company_packages?.some(p => p.item_id === skillItemId), 'workflow-reuses-selected-saved-company-skill');
      ensure(prepared.approval?.grants_execution_authority === false, 'approval-is-not-authorization');
      const restWorkflow = await json(await http(new URL(`${restPath}/items/${encodeURIComponent(workflowItemId)}?revision_sha256=${workflow.revision_sha256}`, target.origin), {}, accessToken), 200, 'saved-workflow-rest-retrieval');
      ensure(restWorkflow.revision_sha256 === workflow.revision_sha256, 'saved-workflow-rest-revision-parity');
      const restPreparation = await json(await http(new URL(`${restPath}/workflow-preparations`, target.origin), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ item_id: workflowItemId, revision_sha256: workflow.revision_sha256 }) }, accessToken), 200, 'saved-workflow-rest-preparation');
      ensure(restPreparation.draft_sha256 === prepared.draft_sha256, 'rest-mcp-workflow-draft-parity');
      const restPreparationAgain = await json(await http(new URL(`${restPath}/workflow-preparations`, target.origin), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ item_id: workflowItemId, revision_sha256: workflow.revision_sha256 }) }, accessToken), 200, 'saved-workflow-rest-repeat');
      ensure(restPreparationAgain.draft_sha256 === restPreparation.draft_sha256, 'rest-saved-workflow-repeat-binding');
      const support = item.resources.find(r => r.path.startsWith('references/'));
      if (support) {
        const params = new URLSearchParams({ path: support.path, revision_sha256: item.revision_sha256, offset: '0', limit: '48000' });
        const restResource = await json(await http(new URL(`${restPath}/resources/${encodeURIComponent(skillItemId)}?${params}`, target.origin), {}, accessToken), 200, 'saved-skill-rest-support-resource');
        ensure(restResource.next_offset === null && restResource.encoding === 'base64' && digest(Buffer.from(restResource.content, 'base64')) === support.sha256, 'saved-skill-rest-support-hash');
      }
      passed('rest-saved-workflow-retrieval-preparation-repeat-and-skill-resource');
      for (const companyItem of prepared.company_packages ?? []) await readInventory(companyItem);
      const stale = await client.callTool({ name: names.prepare, arguments: { item_id: workflowItemId, revision_sha256: workflow.revision_sha256, approved_draft_hash: '0'.repeat(64) } }); ensure(stale.isError === true, 'stale-review-hash-rejected');
      passed('saved-workflow-preparation-reuses-company-skill'); passed('changed-review-binding-rejected');
      evidence.resources_verified = resourceCount;
    } finally { await client.close(); }
    const wrongResource = new URL('/mcp/company/' + 'x'.repeat(24), target.origin);
    ensure(wrongResource.href !== target.resource, 'negative-scope-resource');
    const foreign = await http(wrongResource, { method: 'POST', headers: rpcHeaders, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) }, accessToken);
    ensure(foreign.status === 401, 'cross-workspace-grant-rejected'); passed('token-cannot-cross-workspace-resource');
    return evidence;
  } catch (error) {
    evidence.checks.push({ id: error instanceof SmokeFailure ? error.check : 'unexpected-transport-or-server-failure', status: 'FAIL' });
    if (!(error instanceof SmokeFailure)) {
      evidence.transport_error = { name: /^[A-Za-z]+$/.test(error?.name ?? '') ? error.name : 'Error', ...(typeof error?.cause?.code === 'string' && /^[A-Z0-9_]+$/.test(error.cause.code) ? { code: error.cause.code } : {}) };
    }
    return evidence;
  } finally {
    if (issued) {
      try {
        const response = await http(new URL('/oauth/revoke', target.origin), { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: issued.clientId, token: issued.refresh, token_type_hint: 'refresh_token' }) });
        ensure(response.status === 200, 'issued-test-grant-revocation');
        const denied = await http(target.resource, { method: 'POST', headers: rpcHeaders, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) }, issued.access);
        ensure(denied.status === 401, 'revoked-token-rejected'); passed('issued-test-grant-revoked-and-access-rejected');
      } catch { evidence.checks.push({ id: 'issued-test-grant-cleanup-requires-operator-review', status: 'FAIL' }); }
    }
  }
}

async function main() {
  const args = new Set(process.argv.slice(2));
  ensure([...args].every(v => ['--local', '--oauth', '--allow-oauth-mutations', '--discover'].includes(v)), 'unknown-command-option');
  const target = stagingTarget(process.env, args.has('--local'));
  const oauth = args.has('--oauth');
  ensure(!oauth || args.has('--allow-oauth-mutations'), 'explicit-oauth-mutations-approval-required');
  ensure(!args.has('--discover') || !oauth, 'choose-discovery-or-oauth');
  const evidence = await runStagingSmoke({ target, preview: process.env.MCP_STAGING_PREVIEW_ACCESS, accessToken: args.has('--discover') ? undefined : process.env.MCP_STAGING_ACCESS_TOKEN, skillItemId: process.env.MCP_STAGING_ITEM_ID, workflowItemId: process.env.MCP_STAGING_WORKFLOW_ID, oauth, note: text => process.stdout.write(text + '\n') });
  if (process.env.MCP_STAGING_EVIDENCE_PATH) await writeFile(process.env.MCP_STAGING_EVIDENCE_PATH, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  process.stdout.write(JSON.stringify(evidence, null, 2) + '\n');
  process.exitCode = evidence.checks.some(c => c.status === 'FAIL') ? 1 : 0;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(() => { process.stderr.write('Staging check could not start. Verify the explicit staging target, options and evidence destination; no private error details were printed.\n'); process.exitCode = 1; });
