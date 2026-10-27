import fs from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import { handlePublicApi, isPublicApiRoute, MAX_PUBLIC_BODY_BYTES, publicJson } from '../src/server/public-api.ts';

/** Local development serves public catalogue data only. Private company OAuth/D1 runs in the local Worker. */
export function devPublicApi(): Plugin {
  return {
    name: 'dev-public-api',
    configureServer(server) {
      const publicRoot = path.resolve(server.config.root, 'public');
      server.middlewares.use(async (req, res, next) => {
        const rawPath = (req.url ?? '/').split('?')[0].replace(/\/+$/, '') || '/';
        const company = rawPath === '/mcp/company' || rawPath.startsWith('/mcp/company/');
        const publicRoute = isPublicApiRoute(rawPath);
        if (!company && !publicRoute) return next();
        const send = async (response: Response) => {
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        };
        if (company) return send(publicJson(503, { error: { code: 'local_worker_required', message: 'Private company MCP needs OAuth and the company database. Use the local Worker server for this connection.' } }));
        try {
          const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
          if (!['localhost', '127.0.0.1', '[::1]'].includes(requestUrl.hostname)) return send(publicJson(403, { error: { code: 'local_only', message: 'Use localhost for the development API.' } }));
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) if (value !== undefined && !['connection', 'transfer-encoding'].includes(key)) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
          const chunks: Uint8Array[] = []; let size = 0;
          for await (const chunk of req.iterator({ destroyOnReturn: false })) {
            const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : chunk as Uint8Array;
            size += bytes.byteLength;
            if (size > MAX_PUBLIC_BODY_BYTES) {
              // Drain remaining data without retaining it; do not parse or truncate an oversized request.
              req.resume();
              return send(publicJson(413, { error: { code: 'payload_too_large', message: 'Keep requests under 64,000 bytes.' } }));
            }
            chunks.push(bytes);
          }
          const method = req.method ?? 'GET';
          const request = new Request(requestUrl, { method, headers, ...(!['GET', 'HEAD'].includes(method) ? { body: new Uint8Array(Buffer.concat(chunks)) } : {}) });
          const response = await handlePublicApi(request, {
            SECURITY_LOCAL: 'true', PUBLIC_API_ENABLED: 'true',
            ASSETS: { async fetch(assetRequest) {
              try {
                const pathname = decodeURIComponent(new URL(assetRequest.url).pathname);
                if (pathname.includes('\\') || pathname.includes('\0')) return new Response(null, { status: 404 });
                const resolved = path.resolve(publicRoot, `.${pathname}`);
                const relative = path.relative(publicRoot, resolved);
                if (relative.startsWith('..') || path.isAbsolute(relative)) return new Response(null, { status: 404 });
                const [realRoot, realFile] = await Promise.all([fs.realpath(publicRoot), fs.realpath(resolved)]);
                const realRelative = path.relative(realRoot, realFile);
                if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) return new Response(null, { status: 404 });
                const bytes = await fs.readFile(realFile);
                return new Response(new Uint8Array(bytes), { headers: { 'content-length': String(bytes.byteLength) } });
              } catch { return new Response(null, { status: 404 }); }
            } }
          });
          return send(response);
        } catch {
          return send(publicJson(503, { error: { code: 'service_unavailable', message: 'The development catalogue is unavailable. Build the public catalogue assets and try again.' } }));
        }
      });
    }
  };
}
