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

type Env = Parameters<typeof comments>[0]["env"] & Parameters<typeof spaces>[0]["env"] &
  Parameters<typeof compose>[0]["env"] & Parameters<typeof community>[0]["env"] & CompanyApiEnv;

export default {
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
      const asset = await env.ASSETS.fetch(new Request(new URL('/data/blocks.json', request.url)));
      if (asset.ok) {
        const catalogue = await asset.json() as { renamed?: Record<string, string>; blocks: { slug: string; type?: string; category?: string }[] };
        const slug = catalogue.renamed?.[typed[2]] ?? typed[2];
        const block = catalogue.blocks.find(b => b.slug === slug);
        if (block) {
          const kind = block.type === 'mind' ? 'minds' : block.type === 'agent' ? 'agents' : block.category === 'orchestrator' || block.type === 'workflow' || block.type === 'routine' ? 'workflows' : block.type === 'prompt' ? 'prompts' : 'skills';
          const target = `/${kind}/${block.slug}`;
          if (target !== path) {
            const url = new URL(request.url); url.pathname = target;
            return Response.redirect(url.toString(), 301);
          }
        }
      }
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
