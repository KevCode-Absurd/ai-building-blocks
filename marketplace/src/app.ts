// The Worker's request and cron handling, without Cloudflare-only imports so tests can load it in Node.
import type { Env } from "./env.ts";
import { compile, dispatch, errorResponse } from "./core/http.ts";
import { coreRoutes } from "./core/routes.ts";
import { moduleRoutes, scheduledTasks } from "./modules/index.ts";
import "./modules/fakes.ts";
import { llmsTxt, pageResponse, robotsTxt, shellVersion, sitemapXml } from "./pages.ts";
import { shareRedirect } from "./modules/experts/profiles.ts";

const compiled = compile([...coreRoutes, ...moduleRoutes]);
const API_PREFIXES = ["/api/", "/mcp", "/oauth/", "/.well-known/"];
/**
 * Files the Worker writes outside /api: an agent's personality (/agents/<id>/soul.md), one skill in one file
 * (/agents/<id>/skills/<skill>.txt) and the capture tools (/tools/<file>). wrangler.jsonc run_worker_first sends them here.
 */
const WORKER_FILES = /^\/agents\/[^/]+\/soul\.md$|^\/agents\/[^/]+\/skills\/[^/]+\.txt$|^\/tools\/(?:quality\/(?:cards\/)?)?[^/]+$/;

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
    // A page: its own head tags and plain content, and a real 404 for unknown addresses. A pack file's viewer
    // (/agents/<id>/files/SKILL.md) is a page too, though its address ends in the file's extension: it says noindex.
    if (!/\.[A-Za-z0-9]+$/.test(url.pathname) || FILE_VIEWER.test(url.pathname)) {
      const page = await cachedPage(req, env, exec, url);
      if (page) return page;
    }
    // Any other address with an extension is a built file. The app's fallback answers a missing one with the home
    // page's HTML and a 200, so search engines would see a copy of the home page at every made-up address: send the
    // 404 page instead.
    if (env.ASSETS) {
      const res = await env.ASSETS.fetch(req);
      if (res.ok && !/\.html?$/i.test(url.pathname) && (res.headers.get("content-type") ?? "").startsWith("text/html")) {
        const missing = await pageResponse(req, env);
        if (missing) return missing;
      }
      return res;
    }
  }
  if (env.ASSETS) return env.ASSETS.fetch(req);
  return errorResponse(404, "not_found", "There is nothing at this address.");
}

/** The viewer page for one file of an agent's pack: src/ui/pages/directory/file.tsx. */
const FILE_VIEWER = /^\/agents\/[a-z0-9-]+\/files\/.+$/;

/** How long a public page is kept at the edge. Agents and profiles change rarely, and each deploy starts a fresh copy. */
const EDGE_PAGE_SECONDS = 300;

/**
 * A page from this data centre's cache when there is a fresh copy, else built and kept there.
 * Pages are the same for every visitor (sign-in state loads in the browser), so only a share link (?via=, which
 * sets a cookie) and non-200 answers skip the cache. The key carries the shell's fingerprint, so a deploy never
 * serves old HTML that points at asset files that are gone.
 */
async function cachedPage(req: Request, env: Env, exec: ExecutionContext, url: URL): Promise<Response | null> {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  if (!cache || req.method !== "GET" || url.searchParams.has("via")) return pageResponse(req, env);
  const version = await shellVersion(env, url);
  if (!version) return pageResponse(req, env);
  const key = new Request(`${url.origin}${url.pathname}${url.search}${url.search ? "&" : "?"}__shell=${version}`, { method: "GET" });
  const hit = await cache.match(key).catch(() => undefined);
  if (hit) {
    const out = new Response(hit.body, hit);
    out.headers.set("cache-control", "public, max-age=0, must-revalidate");
    out.headers.set("x-edge-cache", "hit");
    return out;
  }
  const page = await pageResponse(req, env);
  if (!page || page.status !== 200 || page.headers.has("set-cookie")) return page;
  const copy = new Response(page.clone().body, page);
  copy.headers.set("cache-control", `public, max-age=${EDGE_PAGE_SECONDS}`);
  exec.waitUntil(cache.put(key, copy).catch(() => undefined));
  page.headers.set("x-edge-cache", "miss");
  return page;
}

export async function handleScheduled(env: Env): Promise<void> {
  for (const task of scheduledTasks) {
    try { await task(env); } catch (err) { console.error("scheduled_task_failed", err instanceof Error ? err.message : String(err)); }
  }
}
