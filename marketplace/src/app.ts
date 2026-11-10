// The Worker's request and cron handling, without Cloudflare-only imports so tests can load it in Node.
import type { Env } from "./env.ts";
import { compile, dispatch, errorResponse } from "./core/http.ts";
import { coreRoutes } from "./core/routes.ts";
import { moduleRoutes, scheduledTasks } from "./modules/index.ts";
import "./modules/fakes.ts";
import { llmsTxt, pageResponse, robotsTxt, sitemapXml } from "./pages.ts";
import { shareRedirect } from "./modules/experts/profiles.ts";

const compiled = compile([...coreRoutes, ...moduleRoutes]);
const API_PREFIXES = ["/api/", "/mcp", "/oauth/", "/.well-known/"];
/**
 * Files the Worker writes outside /api: an agent's personality (/agents/<id>/soul.md), one skill in one file
 * (/agents/<id>/skills/<skill>.txt) and the capture tools (/tools/<file>). wrangler.jsonc run_worker_first sends them here.
 */
const WORKER_FILES = /^\/agents\/[^/]+\/soul\.md$|^\/agents\/[^/]+\/skills\/[^/]+\.txt$|^\/tools\/[^/]+$/;

export async function handleFetch(req: Request, env: Env, exec: ExecutionContext): Promise<Response> {
  const url = new URL(req.url);
  if (API_PREFIXES.some(p => url.pathname === p.replace(/\/$/, "") || url.pathname.startsWith(p)) || WORKER_FILES.test(url.pathname)) {
    const res = await dispatch(compiled, req, env, exec);
    return res ?? errorResponse(404, "not_found", "There is nothing at this address.");
  }
  if (req.method === "GET" || req.method === "HEAD") {
    if (url.pathname === "/robots.txt") return robotsTxt(env);
    if (url.pathname === "/sitemap.xml") return sitemapXml(env);
    if (url.pathname === "/llms.txt") return llmsTxt(env);
    // An expert's share link: count the visit, set the first-party cookie, go to their profile.
    const share = /^\/e\/([a-z0-9-]{2,60})\/?$/.exec(url.pathname);
    if (share) return (await shareRedirect(env, req, share[1]!)) ?? errorResponse(404, "not_found", "There is no expert at this address.");
    // A page (no file extension): its own head tags and plain content, and a real 404 for unknown addresses.
    if (!/\.[A-Za-z0-9]+$/.test(url.pathname)) {
      const page = await pageResponse(req, env);
      if (page) return page;
    }
  }
  if (env.ASSETS) return env.ASSETS.fetch(req);
  return errorResponse(404, "not_found", "There is nothing at this address.");
}

export async function handleScheduled(env: Env): Promise<void> {
  for (const task of scheduledTasks) {
    try { await task(env); } catch (err) { console.error("scheduled_task_failed", err instanceof Error ? err.message : String(err)); }
  }
}
