import { SCOPE_REST_OPERATIONS } from '../intake/request-scope-mcp.mjs';
import { OUTCOME_MAX_BODY_BYTES, OUTCOME_REST_OPERATIONS, outcomeMcpTools } from '../outcomes/outcome-mcp.mjs';
import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/sdk/types.js';
import { apiSecurity, type SecurityEnv } from './api-security.ts';
import { PublicCatalogueService, PublicApiError } from './public-catalogue.ts';
import { handlePublicMcp, PUBLIC_MCP_TOOLS, PUBLIC_MCP_VERSION, SKILLS_EXTENSION } from './public-mcp.ts';
import { sha256 } from '../lib/workflow-execution.ts';

export type PublicApiEnv = SecurityEnv & {
  ASSETS: { fetch(request: Request): Promise<Response> };
  PUBLIC_API_ENABLED?: string;
  PUBLIC_API_ALLOWED_ORIGINS?: string;
};
export const MAX_PUBLIC_BODY_BYTES = 64_000;
const services = new WeakMap<PublicApiEnv['ASSETS'], Map<string, { service: PublicCatalogueService; expires: number }>>();
/** Reuse validated public metadata in a warm isolate; never cache private company results. */
export function publicCatalogueService(env: PublicApiEnv, origin: string): PublicCatalogueService {
  let origins = services.get(env.ASSETS);
  if (!origins) { origins = new Map(); services.set(env.ASSETS, origins); }
  const cached = origins.get(origin);
  if (cached && cached.expires > Date.now()) return cached.service;
  const service = new PublicCatalogueService(path => env.ASSETS.fetch(new Request(new URL(path, origin))), origin);
  origins.set(origin, { service, expires: Date.now() + 30_000 });
  return service;
}
export const publicJson = (status: number, body: unknown, headers: Record<string, string> = {}) => Response.json(body, {
  status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers },
});

/** Anonymous content and pure validation only. This module has no model or private-store binding. */
export async function publicApiSecurity(request: Request, env: PublicApiEnv): Promise<Response | null> {
  if (env.PUBLIC_API_ENABLED !== 'true') return publicJson(503, { error: { code: 'service_disabled', message: 'The API and MCP service is not enabled.' } });
  const origin = request.headers.get('origin');
  const allowed = new Set([new URL(request.url).origin, ...(env.PUBLIC_API_ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean)]);
  if (origin && !allowed.has(origin)) return publicJson(403, { error: { code: 'origin_forbidden', message: 'This client origin is not allowed.' } });
  // Origin was checked above. Existing protection still enforces official HTTPS hosts,
  // trusted edge IP and fail-closed method-class limits, without browser Turnstile.
  const headers = new Headers(request.headers);
  headers.delete('origin'); headers.delete('sec-fetch-site');
  return apiSecurity(new Request(request.url, { method: request.method, headers }), env);
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
/** Every path this module answers; the Worker and the Vite bridge route them here before static assets. */
export const isPublicApiRoute = (path: string) => path === '/mcp' || path === '/api/v1' || path.startsWith('/api/v1/') || path === SERVER_CARD || path === AI_CATALOG;

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
  const denied = await apiSecurity(new Request(request.url, { method: request.method, headers }), env);
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
  if (discoveryRoute === SERVER_CARD || discoveryRoute === AI_CATALOG) return discovery(request, env, discoveryRoute);
  const denied = await publicApiSecurity(request, env); if (denied) return denied;
  const origin = request.headers.get('origin');
  const finish = (response: Response) => {
    const headers = new Headers(response.headers);
    headers.set('x-content-type-options', 'nosniff');
    headers.set('x-robots-tag', 'noindex, nofollow');
    if (origin) { headers.set('access-control-allow-origin', origin); headers.set('vary', 'Origin'); }
    return new Response(request.method === 'HEAD' ? null : response.body, { status: response.status, headers });
  };
  if (request.method === 'OPTIONS') return finish(new Response(null, { status: 204, headers: {
    'access-control-allow-methods': 'GET, HEAD, POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Authorization',
    'access-control-max-age': '600',
  } }));
  const url = new URL(request.url), route = url.pathname.replace(/\/+$/, '');
  const service = publicCatalogueService(env, url.origin);
  try {
    if (route === '/mcp' || route === '/api/v1/mcp') {
      let forwarded = request;
      if (request.method === 'POST') {
        if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) return finish(publicJson(415, { error: { code: 'unsupported_media_type', message: 'Use application/json.' } }));
        // Only outcome tool calls, which carry a whole engagement, may use the larger limit.
        const bytes = await readPublicBody(request, OUTCOME_MAX_BODY_BYTES);
        if (bytes.length > MAX_PUBLIC_BODY_BYTES && !isOutcomeCall(bytes)) throw new PublicApiError(413, 'payload_too_large', 'Keep requests under 64,000 bytes.');
        forwarded = new Request(request.url, { method: request.method, headers: request.headers, body: bytes });
      }
      return finish(await handlePublicMcp(forwarded, service));
    }
    if (['GET', 'HEAD'].includes(request.method) && route === '/api/v1/status') return finish(publicJson(200, {
      service: 'ai-blocks', api_version: 'v1', model_calls: false, hosted_execution: false,
      persistence: 'client', authentication: 'public-catalogue-only', historical_revisions: false,
      tools: PUBLIC_MCP_TOOLS.map(tool => tool.name),
      mcp: { url: `${url.origin}/mcp`, server_card: `${url.origin}${SERVER_CARD}`, version: PUBLIC_MCP_VERSION, protocol_versions: [...SUPPORTED_PROTOCOL_VERSIONS], prompts: true, resources: true, extensions: [SKILLS_EXTENSION] },
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
    if (error instanceof PublicApiError) return finish(publicJson(error.status, { error: { code: error.code, message: error.message } }));
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

function openApi(origin: string) {
  const response = { description: 'Structured result with explicit revision hashes and execution limitations.' };
  const schema = (name: string) => PUBLIC_MCP_TOOLS.find(tool => tool.name === name)!.inputSchema;
  const parameters = (name: string, route = '') => Object.entries(schema(name).properties ?? {}).map(([key, value]) => ({ name: key, in: key === route ? 'path' : 'query', required: key === route || (schema(name).required ?? []).includes(key), schema: value }));
  return { openapi: '3.1.0', info: { title: 'AI Blocks public API', version: PUBLIC_MCP_VERSION, description: 'Stateless catalogue retrieval and workflow validation, the same tools as the MCP server at /mcp. All inference and execution happen in the client.' }, servers: [{ url: origin }], paths: {
    '/api/v1/search': { get: { operationId: 'search_library', parameters: parameters('search_library'), responses: { '200': response } } },
    '/api/v1/plan': { get: { operationId: 'plan_workflow', parameters: parameters('plan_workflow'), responses: { '200': response } } },
    ...Object.fromEntries([['skills', 'get_skill'], ['workflows', 'get_workflow'], ['resources', 'get_resource']].map(([kind, operationId]) => [`/api/v1/${kind}/{slug}`, { get: { operationId, parameters: parameters(operationId, 'slug'), responses: { '200': response } } }])),
    '/api/v1/items/{id}': { get: { operationId: 'get_item', parameters: parameters('get_item', 'id'), responses: { '200': response } } },
    '/api/v1/documents': { get: { operationId: 'search', parameters: parameters('search'), responses: { '200': response } } },
    '/api/v1/documents/{id}': { get: { operationId: 'fetch', description: 'id is type/id from search, such as skill/ad-angle-planner.', parameters: parameters('fetch', 'id'), responses: { '200': response } } },
    ...Object.fromEntries(Object.entries(OUTCOME_REST_OPERATIONS).map(([path, operationId]) => [path, { post: { operationId, description: 'Stateless outcome orchestration: send the engagement and its engagement_sha256 back with each call. No model calls, persistence or action authority. Requests up to 256,000 bytes.', requestBody: { required: true, content: { 'application/json': { schema: schema(operationId) } } }, responses: { '200': response } } }])),
    ...Object.fromEntries(Object.entries(SCOPE_REST_OPERATIONS).map(([path, operationId]) => [path, { post: { operationId, description: 'Stateless host-authored scope and recommendation preparation; no persistence, hosted execution or action authority. Existing request-body limits apply.', requestBody: { required: true, content: { 'application/json': { schema: schema(operationId) } } }, responses: { '200': response } } }])),
    '/api/v1/workflow-preparations': { post: { operationId: 'prepare_workflow', requestBody: { required: true, content: { 'application/json': { schema: schema('prepare_workflow') } } }, responses: { '200': response } } },
    '/api/v1/specialists': { get: {operationId:'find_specialist',parameters:parameters('find_specialist'),responses:{'200':response}} },
    '/api/v1/specialists/{role_id}': {get:{operationId:'get_specialist',parameters:[{name:'role_id',in:'path',required:true,schema:{type:'string'}}],responses:{'200':response}}},
    '/api/v1/specialists/{role_id}/pack': {get:{operationId:'download_base_specialist',parameters:[{name:'role_id',in:'path',required:true,schema:{type:'string'}}],responses:{'200':{description:'Complete base specialist ZIP with verified methods, supporting files and licences; no private task context.',content:{'application/zip':{schema:{type:'string',format:'binary'}}}}}}},
    '/api/v1/specialist-preparations': {post:{operationId:'prepare_specialist',requestBody:{required:true,content:{'application/json':{schema:schema('prepare_specialist')}}},responses:{'200':response}}},
    '/api/v1/specialist-team-preparations': {post:{operationId:'prepare_specialist_team',requestBody:{required:true,content:{'application/json':{schema:schema('prepare_specialist_team')}}},responses:{'200':response}}},
    '/api/v1/specialist-team-checkpoints': {post:{operationId:'checkpoint_specialist_team',requestBody:{required:true,content:{'application/json':{schema:schema('checkpoint_specialist_team')}}},responses:{'200':response}}},
  } };
}
