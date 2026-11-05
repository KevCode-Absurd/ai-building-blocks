import { SCOPE_REST_OPERATIONS } from '../intake/request-scope-mcp.mjs';
import { OUTCOME_MAX_BODY_BYTES, OUTCOME_REST_OPERATIONS, outcomeMcpTools } from '../outcomes/outcome-mcp.mjs';
import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/sdk/types.js';
import { apiSecurity, type LimitClass, type SecurityEnv } from './api-security.ts';
import { PublicCatalogueService, PublicApiError } from './public-catalogue.ts';
import { handlePublicMcp, PUBLIC_MCP_LISTED_TOOLS, PUBLIC_MCP_TOOLS, PUBLIC_MCP_VERSION, SKILLS_EXTENSION } from './public-mcp.ts';
import { sha256 } from '../lib/workflow-execution.ts';

export type PublicApiEnv = SecurityEnv & {
  ASSETS: { fetch(request: Request): Promise<Response> };
  PUBLIC_API_ENABLED?: string;
  PUBLIC_API_ALLOWED_ORIGINS?: string;
};
export const MAX_PUBLIC_BODY_BYTES = 64_000;
const services = new WeakMap<PublicApiEnv['ASSETS'], Map<string, PublicCatalogueService>>();
/** Reuse validated public metadata for the isolate's lifetime; never cache private company results. The catalogue
 *  (keyed on its blocks.json SHA-256, which the manifest pins) cannot change inside one deployment, because ASSETS
 *  serves that deployment's files, so there is nothing to expire. A failed load is retried on the next request. */
export function publicCatalogueService(env: PublicApiEnv, origin: string): PublicCatalogueService {
  let origins = services.get(env.ASSETS);
  if (!origins) { origins = new Map(); services.set(env.ASSETS, origins); }
  let service = origins.get(origin);
  if (!service) { service = new PublicCatalogueService(path => env.ASSETS.fetch(new Request(new URL(path, origin))), origin); origins.set(origin, service); }
  return service;
}
export const publicJson = (status: number, body: unknown, headers: Record<string, string> = {}) => Response.json(body, {
  status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers },
});
export type PublicSecurityOptions = {
  /** The rate-limit bucket (default: by HTTP method). */
  limit?: LimitClass;
  /** An anonymous catalogue read: any web page may call it, so the origin allow-list does not apply. */
  anyOrigin?: boolean;
};
const allowedOrigins = (request: Request, env: PublicApiEnv) => new Set([new URL(request.url).origin, ...(env.PUBLIC_API_ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean)]);

/** Anonymous content and pure validation only. This module has no model or private-store binding. Errors use the one
 *  public shape, { error: { code, message } }. */
export async function publicApiSecurity(request: Request, env: PublicApiEnv, options: PublicSecurityOptions = {}): Promise<Response | null> {
  if (env.PUBLIC_API_ENABLED !== 'true') return publicJson(503, { error: { code: 'service_disabled', message: 'The API and MCP service is not enabled.' } });
  const origin = request.headers.get('origin');
  if (origin && !options.anyOrigin && !allowedOrigins(request, env).has(origin)) return publicJson(403, { error: { code: 'origin_forbidden', message: 'This web page is not allowed to send this request. Anonymous GET requests work from any page; MCP and POST requests need an approved origin or a server-side client.' } });
  // Origin was checked above. Existing protection still enforces official HTTPS hosts,
  // trusted edge IP and fail-closed method-class limits, without browser Turnstile.
  const headers = new Headers(request.headers);
  headers.delete('origin'); headers.delete('sec-fetch-site');
  return apiSecurity(new Request(request.url, { method: request.method, headers }), env, undefined, undefined, { limit: options.limit, errors: 'public' });
}

/** MCP tools that only read the catalogue. Every other tool call (outcome, scope, preparation and team tools, which
 *  carry whole briefs and plans) counts against the write bucket, as does any request over the general body limit. */
export const MCP_READ_TOOLS = new Set(['search_library', 'plan_workflow', 'get_skill', 'get_workflow', 'get_resource', 'get_item', 'search', 'fetch', 'find_specialist']);
/** The rate-limit bucket for one MCP POST body, by JSON-RPC method: initialize, tools/list, resources/*, prompts/*,
 *  skills/*, ping, notifications and read-only tool calls are reads. Also returns the request id for error replies. */
export function mcpLimitClass(bytes: Uint8Array): { limit: LimitClass; id: string | number | null } {
  if (bytes.length > MAX_PUBLIC_BODY_BYTES) return { limit: 'write', id: null };
  let message: { id?: unknown; method?: unknown; params?: { name?: unknown } } | null = null;
  try { message = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { /* the MCP handler answers the parse error */ }
  const id = message && (typeof message.id === 'string' || typeof message.id === 'number') ? message.id : null;
  if (!message || typeof message !== 'object' || Array.isArray(message)) return { limit: 'public_read', id: null };
  if (message.method === 'tools/call') return { limit: typeof message.params?.name === 'string' && MCP_READ_TOOLS.has(message.params.name) ? 'public_read' : 'write', id };
  return { limit: 'public_read', id };
}

/** A REST-shaped error on /mcp as a JSON-RPC error, keeping the HTTP status and headers (Retry-After, RateLimit). */
async function rpcError(response: Response, id: string | number | null): Promise<Response> {
  let error: { code?: string; message?: string } = {};
  try { error = ((await response.clone().json()) as { error?: typeof error }).error ?? {}; } catch { /* not JSON */ }
  const retry = Number(response.headers.get('retry-after'));
  const headers = new Headers(response.headers); headers.set('content-type', 'application/json');
  return new Response(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32000, message: error.message ?? 'The request could not be completed.', data: { code: error.code ?? 'error', status: response.status, ...(retry > 0 ? { retry_after_seconds: retry } : {}) } } }), { status: response.status, headers });
}

/** The one public error body: code and message, plus issues (path, message, suggestion; as in the MCP tool-error
 *  shape ai-blocks-tool-error/1) and details where an error has them. */
export function publicError(error: PublicApiError) {
  const { issues, ...details } = error.details ?? {};
  return { code: error.code, message: error.message, ...(Array.isArray(issues) ? { issues } : {}), ...(Object.keys(details).length ? { details } : {}) };
}

/** Anonymous catalogue reads: GET or HEAD only, open to any origin and cacheable by anyone. */
const CATALOGUE_READ = /^\/api\/v1\/(?:status|openapi\.json|search|plan|documents(?:\/.+)?|(?:skills|workflows|resources|items)\/[^/]+|specialists(?:\/[^/]+(?:\/pack)?)?)$/;
export const isCatalogueRead = (route: string) => CATALOGUE_READ.test(route);
const PUBLIC_CACHE = 'public, max-age=300, stale-while-revalidate=86400';
const ANY_ORIGIN = { 'access-control-allow-origin': '*', 'access-control-expose-headers': 'ETag, Retry-After, RateLimit, RateLimit-Policy' };
const ifNoneMatch = (request: Request, etag: string) => (request.headers.get('if-none-match') ?? '').split(',').map(s => s.trim().replace(/^W\//, '')).some(tag => tag === etag || tag === '*');
/** A successful anonymous catalogue read: public caching for five minutes (stale while revalidating) with a strong
 *  ETag over the exact bytes, and 304 Not Modified when the client already has them. */
async function cacheable(request: Request, response: Response): Promise<Response> {
  if (response.status !== 200) return response;
  const bytes = new Uint8Array(await response.arrayBuffer());
  const known = response.headers.get('x-content-sha256');
  const etag = `"${(known ?? await sha256(bytes)).slice(0, 32)}"`;
  const headers = new Headers(response.headers);
  headers.set('cache-control', PUBLIC_CACHE); headers.set('etag', etag);
  if (ifNoneMatch(request, etag)) {
    for (const name of ['content-type', 'content-length', 'content-disposition']) headers.delete(name);
    return new Response(null, { status: 304, headers });
  }
  return new Response(bytes, { status: 200, headers });
}

export async function readPublicBody(request: Request, limit = MAX_PUBLIC_BODY_BYTES): Promise<Uint8Array> {
  const tooLarge = `Keep requests under ${limit.toLocaleString('en-US')} bytes.`;
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > limit)) throw new PublicApiError(413, 'payload_too_large', tooLarge);
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.length;
    if (size > limit) { await reader.cancel(); throw new PublicApiError(413, 'payload_too_large', tooLarge); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

function queryArguments(url: URL) {
  const args: Record<string, unknown> = {};
  for (const [rawKey, value] of url.searchParams) {
    const key = rawKey === 'q' ? 'query' : rawKey === 'kind' ? 'type' : rawKey;
    if (Object.hasOwn(args, key)) throw new PublicApiError(400, 'invalid_arguments', 'Duplicate query parameters are not supported.');
    if (['limit', 'offset', 'resource_offset', 'resource_limit'].includes(key)) {
      if (!/^\d+$/.test(value)) throw new PublicApiError(400, 'invalid_arguments', 'Pagination must be a nonnegative integer.');
      args[key] = Number(value);
    } else if (key === 'tested') {
      if (value !== 'true' && value !== 'false') throw new PublicApiError(400, 'invalid_arguments', 'tested must be true or false.');
      args[key] = value === 'true';
    } else args[key] = value;
  }
  return args;
}

const SERVER_CARD = '/mcp/server-card', AI_CATALOG = '/.well-known/ai-catalog.json';
/** The official MCP Registry (registry.modelcontextprotocol.io) proves we own useaiblocks.com, and so may publish
 *  com.useaiblocks/*, by fetching this record (no redirects, 10 s timeout). Only the public half of the key is here;
 *  the private half stays outside the repo (tools/publish-mcp-registry.mjs). */
export const MCP_REGISTRY_AUTH = '/.well-known/mcp-registry-auth';
export const MCP_REGISTRY_RECORD = 'v=MCPv1; k=ed25519; p=BafhgP3kRG94ovxOR+Li8beTcDKpS8ojGySRWlIQ84Q=';
/** Every path this module answers; the Worker and the Vite bridge route them here before static assets. */
export const isPublicApiRoute = (path: string) => path === '/mcp' || path === '/api/v1' || path.startsWith('/api/v1/') || path === SERVER_CARD || path === AI_CATALOG || path === MCP_REGISTRY_AUTH;

/** MCP discovery (SEP-2127 server cards and the AI Catalog, docs/discovery.md in modelcontextprotocol/experimental-ext-server-card):
 *  a card for the public server at <mcp url>/server-card and a domain catalogue pointing to it. Public metadata only,
 *  so any origin may read it; it never lists tools (hosts list those after connecting). */
function serverCard(origin: string) {
  return {
    $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
    name: 'com.useaiblocks/library', version: PUBLIC_MCP_VERSION, title: 'AI Blocks',
    description: 'Find and load skills, workflows, agents, prompts, minds and AI tools just in time.',
    websiteUrl: `${origin}/api-and-mcp`,
    icons: [{ src: `${origin}/icon-512.png`, mimeType: 'image/png', sizes: ['512x512'] }],
    remotes: [{ type: 'streamable-http', url: `${origin}/mcp`, supportedProtocolVersions: [...SUPPORTED_PROTOCOL_VERSIONS] }],
    _meta: { 'com.useaiblocks/library': { openapi: `${origin}/api/v1/openapi.json`, extensions: [SKILLS_EXTENSION], read_only: true, authentication: 'none' } },
  };
}
const aiCatalog = (origin: string) => ({ specVersion: '1.0', entries: [{ identifier: `urn:air:${new URL(origin).hostname.replace(/^www\./, '')}:mcp:library`, displayName: 'AI Blocks catalogue', description: 'Find reusable skills and build a workflow plan with instructions and checks for your own AI.', representativeQueries: ['Find a skill to write ad angles from supplied customer research.', 'Plan a workflow for a checked weekly sales report.', 'Read a skill and show what to prepare before it and what to do next.'], type: 'application/mcp-server-card+json', url: `${origin}${SERVER_CARD}` }] });

async function discovery(request: Request, env: PublicApiEnv, route: string): Promise<Response> {
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET', 'access-control-allow-headers': 'Content-Type, If-None-Match', 'access-control-expose-headers': 'ETag', 'x-content-type-options': 'nosniff' };
  if (env.PUBLIC_API_ENABLED !== 'true') return publicJson(503, { error: { code: 'service_disabled', message: 'The API and MCP service is not enabled.' } }, cors);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'access-control-max-age': '600' } });
  if (!['GET', 'HEAD'].includes(request.method)) return publicJson(405, { error: { code: 'method_not_allowed', message: 'Use GET.' } }, { ...cors, allow: 'GET, HEAD, OPTIONS' });
  // Host checks and read rate limits as for the rest of the API, without the origin allow-list (cards are for anyone).
  const headers = new Headers(request.headers); headers.delete('origin'); headers.delete('sec-fetch-site');
  const denied = await apiSecurity(new Request(request.url, { method: request.method, headers }), env, undefined, undefined, { limit: 'public_read', errors: 'public' });
  if (denied) { const out = new Headers(denied.headers); for (const [k, v] of Object.entries(cors)) out.set(k, v); return new Response(denied.body, { status: denied.status, headers: out }); }
  const origin = new URL(request.url).origin;
  const body = JSON.stringify(route === SERVER_CARD ? serverCard(origin) : aiCatalog(origin));
  const etag = `"${(await sha256(new TextEncoder().encode(body))).slice(0, 32)}"`;
  const common = { ...cors, etag, 'cache-control': 'public, max-age=3600', vary: 'Accept' };
  if ((request.headers.get('if-none-match') ?? '').split(',').map(s => s.trim().replace(/^W\//, '')).includes(etag)) return new Response(null, { status: 304, headers: common });
  return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers: { ...common, 'content-type': route === SERVER_CARD ? 'application/mcp-server-card+json' : 'application/ai-catalog+json' } });
}

export async function handlePublicApi(request: Request, env: PublicApiEnv): Promise<Response> {
  const discoveryRoute = new URL(request.url).pathname.replace(/\/+$/, '');
  if (discoveryRoute === MCP_REGISTRY_AUTH) {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Use GET.', { status: 405, headers: { allow: 'GET, HEAD', 'content-type': 'text/plain; charset=utf-8' } });
    return new Response(request.method === 'HEAD' ? null : MCP_REGISTRY_RECORD + '\n', { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-content-type-options': 'nosniff' } });
  }
  if (discoveryRoute === SERVER_CARD || discoveryRoute === AI_CATALOG) return discovery(request, env, discoveryRoute);
  const url = new URL(request.url), route = url.pathname.replace(/\/+$/, '');
  const mcp = route === '/mcp' || route === '/api/v1/mcp';
  // Anonymous catalogue reads (and their CORS preflights) are open to every origin; POST, /mcp and private routes keep the allow-list.
  const preflightMethod = request.method === 'OPTIONS' ? (request.headers.get('access-control-request-method') ?? '').toUpperCase() : '';
  const openRead = isCatalogueRead(route) && (['GET', 'HEAD'].includes(request.method) || ['GET', 'HEAD'].includes(preflightMethod));
  // An MCP POST is classified by its JSON-RPC method before rate limiting: reads use the read bucket, only tools that
  // carry large bodies use the write bucket. Body errors are reported after the (write-bucket) security check.
  let mcpBody: Uint8Array | undefined, bodyError: unknown, rpcId: string | number | null = null, limit: LimitClass | undefined;
  const jsonBody = /^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '');
  if (mcp && request.method === 'POST' && jsonBody) {
    try { mcpBody = await readPublicBody(request, OUTCOME_MAX_BODY_BYTES); ({ limit, id: rpcId } = mcpLimitClass(mcpBody)); }
    catch (error) { bodyError = error; limit = 'write'; }
  } else if (mcp && request.method === 'POST') limit = 'write';
  else if (openRead) limit = 'public_read';
  const origin = request.headers.get('origin'), echoOrigin = !!origin && allowedOrigins(request, env).has(origin);
  const finish = async (response: Response) => {
    if (mcp && response.status >= 400 && (response.headers.get('content-type') ?? '').includes('json')) {
      const body = await response.clone().json().catch(() => null) as { jsonrpc?: string } | null;
      if (body && body.jsonrpc !== '2.0') response = await rpcError(response, rpcId);
    }
    if (openRead && preflightMethod === '') response = await cacheable(request, response);
    const headers = new Headers(response.headers);
    headers.set('x-content-type-options', 'nosniff');
    headers.set('x-robots-tag', 'noindex, nofollow');
    if (!headers.has('cache-control')) headers.set('cache-control', 'no-store');
    if (openRead) for (const [key, value] of Object.entries(ANY_ORIGIN)) headers.set(key, value);
    else if (echoOrigin) { headers.set('access-control-allow-origin', origin!); headers.set('vary', 'Origin'); }
    return new Response(request.method === 'HEAD' ? null : response.body, { status: response.status, headers });
  };
  const denied = await publicApiSecurity(request, env, { limit, anyOrigin: openRead });
  // Denials go through finish too: JSON-RPC errors on /mcp, and CORS headers only where the origin may read them.
  if (denied) return finish(denied);
  if (request.method === 'OPTIONS') return finish(new Response(null, { status: 204, headers: openRead ? {
    'access-control-allow-methods': 'GET, HEAD, OPTIONS',
    'access-control-allow-headers': 'Accept, Content-Type, If-None-Match',
    'access-control-max-age': '600',
  } : {
    'access-control-allow-methods': 'GET, HEAD, POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Authorization',
    'access-control-max-age': '600',
  } }));
  const service = publicCatalogueService(env, url.origin);
  try {
    if (mcp) {
      let forwarded = request;
      if (request.method === 'POST') {
        if (!jsonBody) return finish(publicJson(415, { error: { code: 'unsupported_media_type', message: 'Use application/json.' } }));
        if (bodyError) throw bodyError;
        // Only outcome tool calls, which carry a whole engagement, may use the larger limit.
        const bytes = mcpBody!;
        if (bytes.length > MAX_PUBLIC_BODY_BYTES && !isOutcomeCall(bytes)) throw new PublicApiError(413, 'payload_too_large', 'Keep requests under 64,000 bytes.');
        forwarded = new Request(request.url, { method: request.method, headers: request.headers, body: bytes });
      }
      return finish(await handlePublicMcp(forwarded, service));
    }
    if (['GET', 'HEAD'].includes(request.method) && route === '/api/v1/status') return finish(publicJson(200, {
      service: 'ai-blocks', api_version: 'v1', model_calls: false, hosted_execution: false,
      persistence: 'client', authentication: 'public-catalogue-only', historical_revisions: false,
      tools: PUBLIC_MCP_TOOLS.map(tool => tool.name),
      mcp: { url: `${url.origin}/mcp`, tools: PUBLIC_MCP_LISTED_TOOLS.map(tool => tool.name), server_card: `${url.origin}${SERVER_CARD}`, version: PUBLIC_MCP_VERSION, protocol_versions: [...SUPPORTED_PROTOCOL_VERSIONS], prompts: true, resources: true, extensions: [SKILLS_EXTENSION] },
    }));
    if (['GET', 'HEAD'].includes(request.method) && route === '/api/v1/openapi.json') return finish(publicJson(200, openApi(url.origin)));
    if (route === '/api/v1/workflow-preparations' || route === '/api/v1/specialist-preparations' || route === '/api/v1/specialist-team-preparations' || route === '/api/v1/specialist-team-checkpoints' || Object.hasOwn(SCOPE_REST_OPERATIONS, route) || Object.hasOwn(OUTCOME_REST_OPERATIONS, route)) {
      if (request.method !== 'POST') return finish(publicJson(405, { error: { code: 'method_not_allowed', message: 'Use POST.' } }, { allow: 'POST, OPTIONS' }));
      if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) return finish(publicJson(415, { error: { code: 'unsupported_media_type', message: 'Use application/json.' } }));
      let input: unknown;
      try { input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await readPublicBody(request, Object.hasOwn(OUTCOME_REST_OPERATIONS, route) ? OUTCOME_MAX_BODY_BYTES : MAX_PUBLIC_BODY_BYTES))); }
      catch (error) { if (error instanceof PublicApiError) throw error; throw new PublicApiError(400, 'invalid_json', 'Send a valid JSON object.'); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new PublicApiError(400, 'invalid_arguments', 'Send a JSON object.');
      const operation=(SCOPE_REST_OPERATIONS as Record<string, string>)[route] ?? (OUTCOME_REST_OPERATIONS as Record<string, string>)[route] ?? (route==='/api/v1/specialist-team-preparations'?'prepare_specialist_team':route==='/api/v1/specialist-team-checkpoints'?'checkpoint_specialist_team':route==='/api/v1/specialist-preparations'?'prepare_specialist':'prepare_workflow');
      return finish(publicJson(200, await service.callTool(operation, input as Record<string, unknown>)));
    }
    const specialistPack=route.match(/^\/api\/v1\/specialists\/([a-z0-9][a-z0-9-]{0,69})\/pack$/);
    if(specialistPack){
      if(!['GET','HEAD'].includes(request.method))return finish(publicJson(405,{error:{code:'method_not_allowed',message:'Use GET.'}},{allow:'GET, HEAD, OPTIONS'}));
      if(url.search)throw new PublicApiError(400,'invalid_arguments','The base specialist pack does not accept task context or query parameters.');
      const pack=await service.specialistPack(specialistPack[1]);
      return finish(new Response(pack.bytes as BodyInit,{headers:{'content-type':'application/zip','content-disposition':`attachment; filename="${pack.filename}"`,'cache-control':'no-store','x-content-sha256':await sha256(pack.bytes)}}));
    }
    if (route === '/api/v1/specialists' || /^\/api\/v1\/specialists\/[a-z0-9][a-z0-9-]{0,69}$/.test(route)) {
      if (!['GET','HEAD'].includes(request.method)) return finish(publicJson(405,{error:{code:'method_not_allowed',message:'Use GET.'}},{allow:'GET, HEAD, OPTIONS'}));
      if(route!=='/api/v1/specialists'){
        if(url.search)throw new PublicApiError(400,'invalid_arguments','The role resource route does not accept query parameters.');
        const read=await service.readResource('aiblocks://roles/'+route.split('/').at(-1));
        return finish(publicJson(200,JSON.parse(('text' in read.contents[0]?read.contents[0].text:''))));
      }
      const args=queryArguments(url);if(args.query!==undefined){args.task=args.query;delete args.query;}
      return finish(publicJson(200,await service.callTool('find_specialist',args)));
    }
    const match = route.match(/^\/api\/v1\/(skills|workflows|resources|items)\/([a-z0-9][a-z0-9-]{0,119})$/);
    // fetch's ids are type/id, so a document route takes one or two path segments (or an encoded slash).
    const document = route.replace(/%2F/gi, '/').match(/^\/api\/v1\/documents\/((?:[a-z_-]{3,20}\/)?[a-z0-9][a-z0-9-]{0,119})$/);
    const tool = route === '/api/v1/search' ? 'search_library' : route === '/api/v1/plan' ? 'plan_workflow' : route === '/api/v1/documents' ? 'search' : document ? 'fetch'
      : match ? ({ skills: 'get_skill', workflows: 'get_workflow', resources: 'get_resource', items: 'get_item' } as Record<string, string>)[match[1]] : null;
    if (!tool) return finish(publicJson(404, { error: { code: 'not_found', message: 'API route not found.' } }));
    if (!['GET', 'HEAD'].includes(request.method)) return finish(publicJson(405, { error: { code: 'method_not_allowed', message: 'Use GET.' } }, { allow: 'GET, HEAD, OPTIONS' }));
    const args = queryArguments(url);
    // ?q= is the request on the plan route, as on search.
    if (tool === 'plan_workflow' && Object.hasOwn(args, 'query')) {
      if (Object.hasOwn(args, 'request')) throw new PublicApiError(400, 'invalid_arguments', 'Duplicate query parameters are not supported.');
      args.request = args.query; delete args.query;
    }
    const pathKey = tool === 'get_item' || tool === 'fetch' ? 'id' : 'slug';
    if (match || document) {
      if (Object.hasOwn(args, pathKey)) throw new PublicApiError(400, 'invalid_arguments', 'Specify the item in the route, not the query.');
      args[pathKey] = document ? document[1] : match![2];
    }
    return finish(publicJson(200, await service.callTool(tool, args)));
  } catch (error) {
    if (error instanceof PublicApiError) return finish(publicJson(error.status, { error: publicError(error) }));
    return finish(publicJson(503, { error: { code: 'service_unavailable', message: 'The catalogue service is temporarily unavailable.' } }));
  }
}

/** A JSON-RPC tools/call for an outcome tool, the one MCP request allowed past the general body limit. */
function isOutcomeCall(bytes: Uint8Array): boolean {
  try {
    const message = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    return message?.method === 'tools/call' && outcomeMcpTools.some(tool => tool.name === message.params?.name);
  } catch { return false; }
}

/** The schema ids each operation's JSON body carries in its `schema` field. OpenAPI names one response component after
 *  each id, built from the matching MCP tool's outputSchema (the first operation listed for an id defines it). */
export const OPENAPI_RESULT_SCHEMAS: Record<string, string[]> = {
  search_library: ['abb-search/2'], plan_workflow: ['abb-workflow-plan/1', 'abb-step-map/1'],
  get_skill: ['abb-skill/1'], get_workflow: ['abb-library-workflow/1'], get_item: ['abb-skill/1', 'abb-library-workflow/1', 'abb-item/1'],
  get_resource: ['abb-resource/1'], prepare_workflow: ['abb-workflow-preparation/1'],
  find_specialist: ['ai-blocks-specialist-matches/1'], get_specialist: ['ai-blocks-role/1'],
  prepare_specialist: ['ai-blocks-base-specialist/1', 'ai-blocks-specialist-preparation/1'],
  prepare_specialist_team: ['ai-blocks-team-preparation/1'], checkpoint_specialist_team: ['ai-blocks-team-checkpoint/1'],
};
type JsonSchema = { type?: unknown; properties?: Record<string, unknown>; required?: string[]; [key: string]: unknown };
const componentName = (id: string) => id.replace(/[^A-Za-z0-9._-]/g, '.');
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

function openApi(origin: string) {
  const tool = (name: string) => PUBLIC_MCP_TOOLS.find(t => t.name === name);
  const schema = (name: string) => tool(name)!.inputSchema;
  const output = (name: string): JsonSchema => (tool(name)?.outputSchema as JsonSchema | undefined) ?? { type: 'object', properties: { schema: { type: 'string' } }, required: ['schema'], additionalProperties: true };
  // Components named after the schema ids, each with its id as a constant so clients can tell results apart.
  const schemas: Record<string, unknown> = {
    Error: { type: 'object', required: ['error'], additionalProperties: false, properties: { error: { type: 'object', required: ['code', 'message'], properties: {
      code: { type: 'string', description: 'Stable machine code, such as invalid_arguments, not_found, stale_revision, payload_too_large, unsupported_media_type, rate_limited, origin_forbidden or service_unavailable.' },
      message: { type: 'string', description: 'Plain words saying what went wrong and what to change.' },
      issues: { type: 'array', description: 'One entry per problem, as in the MCP tool-error shape (ai-blocks-tool-error/1).', items: { type: 'object', required: ['path', 'message'], properties: { path: { type: 'string' }, message: { type: 'string' }, suggestion: { type: 'string' } } } },
      details: { type: 'object', additionalProperties: true, description: 'Extra facts for some errors. stale_revision gives slug, requested_revision_sha256, current_revision_sha256, updated and changed (the changed file paths, or null when the revision is older than the history kept).' },
    } } } },
    DocumentSearchResult: { type: 'object', required: ['results'], properties: { results: { type: 'array', items: { type: 'object', required: ['id', 'title', 'url'], properties: { id: { type: 'string', description: 'type/id, for /api/v1/documents/{id}.' }, title: { type: 'string' }, url: { type: 'string' } } } } } },
    DocumentFetchResult: { type: 'object', required: ['id', 'title', 'text', 'url', 'metadata'], properties: { id: { type: 'string' }, title: { type: 'string' }, text: { type: 'string' }, url: { type: 'string' }, metadata: { type: 'object', additionalProperties: true } } },
    ServiceStatus: { type: 'object', required: ['service', 'api_version', 'model_calls', 'tools', 'mcp'], properties: { service: { type: 'string' }, api_version: { type: 'string' }, model_calls: { type: 'boolean', const: false }, hosted_execution: { type: 'boolean' }, tools: { type: 'array', items: { type: 'string' } }, mcp: { type: 'object', additionalProperties: true } }, additionalProperties: true },
  };
  for (const [operation, ids] of Object.entries(OPENAPI_RESULT_SCHEMAS)) for (const id of ids) {
    if (schemas[componentName(id)]) continue;
    const base = output(operation);
    schemas[componentName(id)] = { ...base, type: 'object', properties: { ...(base.properties ?? {}), schema: { type: 'string', const: id } }, required: [...new Set(['schema', ...(base.required ?? [])])] };
  }
  const result = (operation: string) => {
    const ids = OPENAPI_RESULT_SCHEMAS[operation];
    if (ids) return ids.length === 1 ? ref(componentName(ids[0])) : { oneOf: ids.map(id => ref(componentName(id))) };
    const name = `${operation}.result`;
    schemas[name] ??= output(operation);
    return ref(name);
  };
  const ok = (body: unknown, cached = false) => ({ description: 'The result. Rows and items carry page urls to cite and revision hashes to pin; nothing was executed and no model was called.',
    ...(cached ? { headers: { ETag: { $ref: '#/components/headers/ETag' }, 'Cache-Control': { $ref: '#/components/headers/CacheControl' } } } : {}),
    content: { 'application/json': { schema: body } } });
  const RESPONSES: Record<string, string> = { '304': 'NotModified', '400': 'BadRequest', '403': 'Forbidden', '404': 'NotFound', '409': 'Conflict', '413': 'PayloadTooLarge', '415': 'UnsupportedMediaType', '429': 'TooManyRequests', '503': 'ServiceUnavailable' };
  const errors = (codes: string[]) => Object.fromEntries(codes.map(code => [code, { $ref: `#/components/responses/${RESPONSES[code]}` }]));
  // Anonymous GET: cacheable, 304 on a matching If-None-Match. 409 where a revision can be pinned, 413 where a file is read.
  const read = (operation: string, parameters: unknown[], body: unknown, extra: { revision?: boolean; file?: boolean; description?: string } = {}) => ({ get: {
    operationId: operation, ...(extra.description ? { description: extra.description } : {}),
    parameters: [...parameters, { $ref: '#/components/parameters/IfNoneMatch' }],
    responses: { '200': ok(body, true), ...errors(['304', '400', '403', '404', ...(extra.revision ? ['409'] : []), ...(extra.file ? ['413'] : []), '429', '503']) },
  } });
  const write = (operation: string, description?: string) => ({ post: {
    operationId: operation, ...(description ? { description } : {}),
    requestBody: { required: true, content: { 'application/json': { schema: schema(operation) } } },
    responses: { '200': ok(result(operation)), ...errors(['400', '403', '404', '409', '413', '415', '429', '503']) },
  } });
  // q is the short form of query (search, documents) and of request (plan); send one, not both.
  const q = { name: 'q', in: 'query', required: false, description: 'Short form of query (search and documents) or request (plan). Send q or the long name, not both.', schema: { type: 'string', maxLength: 300 } };
  const parameters = (name: string, route = '') => Object.entries(schema(name).properties ?? {}).map(([key, value]) => ({ name: key, in: key === route ? 'path' : 'query', required: key === route || (!['query', 'request'].includes(key) && (schema(name).required ?? []).includes(key)), schema: value }));
  const path = (name: string) => ({ name, in: 'path', required: true, schema: { type: 'string' } });
  const revisioned = (name: string) => Object.hasOwn(schema(name).properties ?? {}, 'revision_sha256');
  const header = (description: string) => ({ description, schema: { type: 'string' } });
  const errorResponse = (description: string, headers?: Record<string, unknown>) => ({ description, ...(headers ? { headers } : {}), content: { 'application/json': { schema: ref('Error') } } });
  return { openapi: '3.1.0', info: { title: 'AI Blocks public API', version: PUBLIC_MCP_VERSION, description: 'Stateless catalogue retrieval and workflow validation, the same tools as the MCP server at /mcp. All inference and execution happen in the client. Anonymous GET requests work from any web page (CORS *), are cacheable for five minutes and answer If-None-Match with 304. Every error has the same shape: { "error": { "code", "message" } }.' }, servers: [{ url: origin }], paths: {
    '/api/v1/status': read('get_status', [], ref('ServiceStatus')),
    '/api/v1/search': read('search_library', [...parameters('search_library'), q], result('search_library')),
    '/api/v1/plan': read('plan_workflow', [...parameters('plan_workflow'), q], result('plan_workflow')),
    ...Object.fromEntries([['skills', 'get_skill'], ['workflows', 'get_workflow'], ['resources', 'get_resource']].map(([kind, operationId]) => [`/api/v1/${kind}/{slug}`, read(operationId, parameters(operationId, 'slug'), result(operationId), { revision: revisioned(operationId), file: true })])),
    '/api/v1/items/{id}': read('get_item', parameters('get_item', 'id'), result('get_item'), { revision: revisioned('get_item'), file: true }),
    '/api/v1/documents': read('search', [...parameters('search'), q], ref('DocumentSearchResult')),
    '/api/v1/documents/{id}': read('fetch', parameters('fetch', 'id'), ref('DocumentFetchResult'), { file: true, description: 'id is type/id from search, such as skill/ad-angle-planner.' }),
    ...Object.fromEntries(Object.entries(OUTCOME_REST_OPERATIONS).map(([route, operationId]) => [route, write(operationId, 'Stateless outcome orchestration: send the engagement and its engagement_sha256 back with each call. No model calls, persistence or action authority. Requests up to 256,000 bytes.')])),
    ...Object.fromEntries(Object.entries(SCOPE_REST_OPERATIONS).map(([route, operationId]) => [route, write(operationId, 'Stateless host-authored scope and recommendation preparation; no persistence, hosted execution or action authority. Existing request-body limits apply.')])),
    '/api/v1/workflow-preparations': write('prepare_workflow'),
    '/api/v1/specialists': read('find_specialist', parameters('find_specialist'), result('find_specialist')),
    '/api/v1/specialists/{role_id}': read('get_specialist', [path('role_id')], result('get_specialist')),
    '/api/v1/specialists/{role_id}/pack': { get: { operationId: 'download_base_specialist', parameters: [path('role_id'), { $ref: '#/components/parameters/IfNoneMatch' }], responses: { '200': { description: 'Complete base specialist ZIP with verified methods, supporting files and licences; no private task context.', headers: { ETag: { $ref: '#/components/headers/ETag' }, 'Cache-Control': { $ref: '#/components/headers/CacheControl' }, 'X-Content-SHA256': header('SHA-256 of the ZIP bytes.') }, content: { 'application/zip': { schema: { type: 'string', format: 'binary' } } } }, ...errors(['304', '400', '403', '404', '429', '503']) } } },
    '/api/v1/specialist-preparations': write('prepare_specialist'),
    '/api/v1/specialist-team-preparations': write('prepare_specialist_team'),
    '/api/v1/specialist-team-checkpoints': write('checkpoint_specialist_team'),
  }, components: {
    schemas,
    parameters: { IfNoneMatch: { name: 'If-None-Match', in: 'header', required: false, description: 'An ETag from an earlier reply. The server answers 304 with no body when it is still current.', schema: { type: 'string' } } },
    headers: {
      ETag: header('Strong validator over the exact reply bytes. Send it back as If-None-Match.'),
      CacheControl: header('public, max-age=300, stale-while-revalidate=86400 on anonymous catalogue reads; no-store on errors and POST replies.'),
      RetryAfter: { description: 'Seconds to wait before retrying.', schema: { type: 'integer' } },
      RateLimit: header('The bucket and what is left of it, such as "public_read";r=0;t=60 (draft-ietf-httpapi-ratelimit-headers).'),
      RateLimitPolicy: header('The bucket\'s quota and window in seconds, such as "public_read";q=600;w=60.'),
    },
    responses: {
      NotModified: { description: 'Your copy is current (If-None-Match matched). No body.', headers: { ETag: { $ref: '#/components/headers/ETag' } } },
      BadRequest: errorResponse('invalid_arguments or invalid_json. The message names each unsupported argument and lists the allowed ones.'),
      Forbidden: errorResponse('origin_forbidden: a web page origin that may not send this request (anonymous GET requests work from any page), or host_forbidden: not the official host.'),
      NotFound: errorResponse('not_found: no published item, file or route has that identifier. Search again and use the returned id.'),
      Conflict: errorResponse('stale_revision: the item changed after the revision you sent. details.changed lists the changed files (null when older than the history kept) and details.current_revision_sha256 the revision to review. approval_mismatch: the approved hash no longer matches the exact proposal.'),
      PayloadTooLarge: errorResponse('payload_too_large: the request body is over 64,000 bytes (256,000 for outcome calls), or asset_too_large: the file is too big for this operation.'),
      UnsupportedMediaType: errorResponse('unsupported_media_type: send Content-Type: application/json.'),
      TooManyRequests: errorResponse('rate_limited: wait Retry-After seconds. Reads and writes have separate buckets.', { 'Retry-After': { $ref: '#/components/headers/RetryAfter' }, RateLimit: { $ref: '#/components/headers/RateLimit' }, 'RateLimit-Policy': { $ref: '#/components/headers/RateLimitPolicy' } }),
      ServiceUnavailable: errorResponse('service_unavailable or a fail-closed check. Retry later; nothing ran.'),
    },
  } };
}
