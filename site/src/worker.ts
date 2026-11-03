// Static assets, rewrites and redirects are served by Cloudflare's asset service.
// Only /api/*, /mcp/*, OAuth and discovery run this router before assets; everything else reaches it only when no asset
// matches, which is how the item pages' Markdown and JSON twins (/skills/<slug>.md, .json) get here.
import { onRequest as comments } from "../functions/api/comments.ts";
import { onRequest as spaces } from "../functions/api/spaces/[[path]].ts";
import { onRequest as compose } from "../functions/api/compose.ts";
import { onRequest as transcribe } from "../functions/api/transcribe.ts";
import { onRequest as auth } from "../functions/api/auth.ts";
import { onRequest as minds } from "../functions/api/minds.ts";
import { onRequest as library } from "../functions/api/library.ts";
import { onRequest as community } from "../functions/api/community/[[path]].ts";
import { securityConfig, apiSecurity, previewSecurity } from "./server/api-security.ts";
import { previewSessionRoute } from "./server/preview-session.ts";
import { handlePublicApi, isPublicApiRoute } from "./server/public-api.ts";
import { handleCompanyApi, isCompanyApiRoute, type CompanyApiEnv } from "./server/company-api.ts";
import { itemTwin } from "./server/twins.ts";
import { withRequestLog } from "./server/request-log.ts";
import { clientError, CLIENT_ERROR_PATH } from "./server/client-error.ts";
// Old item addresses and their new ones, bundled into the Worker (about 50 KB), so a missing page never has to read
// the 4.5 MB catalogue. scripts/build-index.mjs makes the same file into public/_redirects.
import renamedItems from "../../catalogue-items/renamed.json" with { type: "json" };

type Env = Parameters<typeof comments>[0]["env"] & Parameters<typeof spaces>[0]["env"] &
  Parameters<typeof compose>[0]["env"] & Parameters<typeof community>[0]["env"] & CompanyApiEnv;

const router = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const session = await previewSessionRoute(request, env);
    if (session) return session;
    const privatePreview = await previewSecurity(request, env);
    if (privatePreview) return privatePreview;
    const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';
    if (isCompanyApiRoute(path)) return handleCompanyApi(request, env);
    if (isPublicApiRoute(path)) return handlePublicApi(request, env);
    if (path === "/apps/mercatura-ads" && ["GET", "HEAD"].includes(request.method)) {
      const target = new URL(request.url); target.pathname = "/apps";
      return Response.redirect(target.toString(), 301);
    }
    if (path === "/api/security") return securityConfig(request, env);
    if (path === "/api/transcribe") return transcribe({ request, env });
    if (path === "/api/auth") return auth({ request, env });
    if (path === "/api/minds") return minds({ request, env });
    if (path === "/api/library") return library({ request, env });
    if (path === "/api/community" || path.startsWith("/api/community/")) return community({ request, env });
    if (path === "/api/comments") return comments({ request, env });
    if (path === "/api/spaces" || path.startsWith("/api/spaces/")) return spaces({ request, env });
    if (path === "/api/compose") return compose({ request, env });
    if (path === CLIENT_ERROR_PATH) return clientError(request, env);
    if (path === "/api" || path.startsWith("/api/")) {
      const denied = await apiSecurity(request, env);
      if (denied) return denied;
      return Response.json({ error: "API route not found." }, { status: 404, headers: { "cache-control": "no-store" } });
    }
    // Item pages' Markdown and JSON twins (server/twins.ts). No twin is an asset, so these arrive after the asset miss.
    const twin = await itemTwin(request, env.ASSETS, path);
    if (twin) return twin;
    const response = await env.ASSETS.fetch(request);
    if (response.status === 404 && /^\/community\/[0-9a-f-]+$/.test(path) && ["GET", "HEAD"].includes(request.method)) {
      const shell = await env.ASSETS.fetch(new Request(new URL('/community', request.url), { method: request.method }));
      if (shell.ok) return shell;
    }
    // Vite's app router repairs links using the wrong block type. Preserve that
    // behavior for missing typed paths while retaining a real 404 for unknown slugs.
    const typed = path.match(/^\/(skills|prompts|workflows|agents|minds)\/([a-z0-9-]+)(?:\.html)?$/);
    if (response.status === 404 && typed && ['GET', 'HEAD'].includes(request.method)) {
      // Each item's page is a static file under its kind, so a few cheap file checks find the right one.
      const slug = (renamedItems as Record<string, string>)[typed[2]] ?? typed[2];
      for (const kind of ['skills', 'prompts', 'workflows', 'agents', 'minds']) {
        const target = `/${kind}/${slug}`;
        if (target === path) continue;
        const page = await env.ASSETS.fetch(new Request(new URL(target, request.url), { method: 'HEAD' }));
        if (page.ok) {
          const url = new URL(request.url); url.pathname = target;
          return Response.redirect(url.toString(), 301);
        }
      }
    }
    // A code file from an older build (a page opened before a deploy): a plain, uncached 404 tells the app to reload.
    if (response.status === 404 && path.startsWith('/assets/')) {
      return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
    }
    if (response.status === 404 && ['GET', 'HEAD'].includes(request.method)) {
      if (path.startsWith('/example-app/')) {
        const tour = await env.ASSETS.fetch(new Request(new URL('/example-app/404', request.url), { method: request.method }));
        if (tour.ok) return new Response(tour.body, { status: 404, headers: tour.headers });
      }
      const page = await env.ASSETS.fetch(new Request(new URL('/404', request.url), { method: request.method }));
      if (page.ok) return new Response(page.body, { status: 404, headers: page.headers });
    }
    return response;
  },
};

// Every request the Worker runs is logged (route, status, time) and an unexpected throw becomes a 500 with an error id.
export default {
  fetch: (request: Request, env: Env): Promise<Response> => withRequestLog(request, () => router.fetch(request, env)),
};
