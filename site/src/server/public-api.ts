import { apiSecurity, type SecurityEnv } from './api-security.ts';
import { PublicCatalogueService, PublicApiError } from './public-catalogue.ts';
import { handlePublicMcp, PUBLIC_MCP_TOOLS } from './public-mcp.ts';

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

export async function readPublicBody(request: Request): Promise<Uint8Array> {
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_PUBLIC_BODY_BYTES)) throw new PublicApiError(413, 'payload_too_large', 'Keep requests under 64,000 bytes.');
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.length;
    if (size > MAX_PUBLIC_BODY_BYTES) { await reader.cancel(); throw new PublicApiError(413, 'payload_too_large', 'Keep requests under 64,000 bytes.'); }
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
    } else args[key] = value;
  }
  return args;
}

export async function handlePublicApi(request: Request, env: PublicApiEnv): Promise<Response> {
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
        const bytes = await readPublicBody(request);
        forwarded = new Request(request.url, { method: request.method, headers: request.headers, body: bytes });
      }
      return finish(await handlePublicMcp(forwarded, service));
    }
    if (['GET', 'HEAD'].includes(request.method) && route === '/api/v1/status') return finish(publicJson(200, {
      service: 'ai-blocks', api_version: 'v1', model_calls: false, hosted_execution: false,
      persistence: 'client', authentication: 'public-catalogue-only', historical_revisions: false,
      tools: ['search_library', 'get_skill', 'get_workflow', 'get_resource', 'prepare_workflow'],
    }));
    if (['GET', 'HEAD'].includes(request.method) && route === '/api/v1/openapi.json') return finish(publicJson(200, openApi(url.origin)));
    if (route === '/api/v1/workflow-preparations') {
      if (request.method !== 'POST') return finish(publicJson(405, { error: { code: 'method_not_allowed', message: 'Use POST.' } }, { allow: 'POST, OPTIONS' }));
      if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) return finish(publicJson(415, { error: { code: 'unsupported_media_type', message: 'Use application/json.' } }));
      let input: unknown;
      try { input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await readPublicBody(request))); }
      catch (error) { if (error instanceof PublicApiError) throw error; throw new PublicApiError(400, 'invalid_json', 'Send a valid JSON object.'); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new PublicApiError(400, 'invalid_arguments', 'Send a JSON object.');
      return finish(publicJson(200, await service.callTool('prepare_workflow', input as Record<string, unknown>)));
    }
    const match = route.match(/^\/api\/v1\/(skills|workflows|resources)\/([a-z0-9][a-z0-9-]{0,119})$/);
    const tool = route === '/api/v1/search' ? 'search_library' : match ? ({ skills: 'get_skill', workflows: 'get_workflow', resources: 'get_resource' } as Record<string, string>)[match[1]] : null;
    if (!tool) return finish(publicJson(404, { error: { code: 'not_found', message: 'API route not found.' } }));
    if (!['GET', 'HEAD'].includes(request.method)) return finish(publicJson(405, { error: { code: 'method_not_allowed', message: 'Use GET.' } }, { allow: 'GET, HEAD, OPTIONS' }));
    const args = queryArguments(url);
    if (match) {
      if (Object.hasOwn(args, 'slug')) throw new PublicApiError(400, 'invalid_arguments', 'Specify the skill in the route, not the query.');
      args.slug = match[2];
    }
    return finish(publicJson(200, await service.callTool(tool, args)));
  } catch (error) {
    if (error instanceof PublicApiError) return finish(publicJson(error.status, { error: { code: error.code, message: error.message } }));
    return finish(publicJson(503, { error: { code: 'service_unavailable', message: 'The catalogue service is temporarily unavailable.' } }));
  }
}

function openApi(origin: string) {
  const response = { description: 'Structured result with explicit revision hashes and execution limitations.' };
  const schema = (name: string) => PUBLIC_MCP_TOOLS.find(tool => tool.name === name)!.inputSchema;
  const parameters = (name: string, route = false) => Object.entries(schema(name).properties ?? {}).map(([key, value]) => ({ name: key, in: route && key === 'slug' ? 'path' : 'query', required: (schema(name).required ?? []).includes(key), schema: value }));
  return { openapi: '3.1.0', info: { title: 'AI Blocks public API', version: '1.0.0', description: 'Stateless catalogue retrieval and workflow validation. All inference and execution happen in the client.' }, servers: [{ url: origin }], paths: {
    '/api/v1/search': { get: { operationId: 'search_library', parameters: parameters('search_library'), responses: { '200': response } } },
    ...Object.fromEntries([['skills', 'get_skill'], ['workflows', 'get_workflow'], ['resources', 'get_resource']].map(([kind, operationId]) => [`/api/v1/${kind}/{slug}`, { get: { operationId, parameters: parameters(operationId, true), responses: { '200': response } } }])),
    '/api/v1/workflow-preparations': { post: { operationId: 'prepare_workflow', requestBody: { required: true, content: { 'application/json': { schema: schema('prepare_workflow') } } }, responses: { '200': response } } },
  } };
}
