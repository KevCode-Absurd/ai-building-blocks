// The Worker's request and cron handling, without Cloudflare-only imports so tests can load it in Node.
import type { Env } from "./env.ts";
import { compile, dispatch, errorResponse } from "./core/http.ts";
import { coreRoutes } from "./core/routes.ts";
import { moduleRoutes, scheduledTasks } from "./modules/index.ts";
import "./modules/fakes.ts";

const compiled = compile([...coreRoutes, ...moduleRoutes]);
const API_PREFIXES = ["/api/", "/mcp", "/oauth/", "/.well-known/"];
/** Files the Worker writes outside /api: an agent's personality, /agents/<id>/soul.md (also in wrangler.jsonc run_worker_first). */
const WORKER_FILES = /^\/agents\/[^/]+\/soul\.md$/;

export async function handleFetch(req: Request, env: Env, exec: ExecutionContext): Promise<Response> {
  const url = new URL(req.url);
  if (API_PREFIXES.some(p => url.pathname === p.replace(/\/$/, "") || url.pathname.startsWith(p)) || WORKER_FILES.test(url.pathname)) {
    const res = await dispatch(compiled, req, env, exec);
    return res ?? errorResponse(404, "not_found", "There is nothing at this address.");
  }
  if (env.ASSETS) return env.ASSETS.fetch(req);
  return errorResponse(404, "not_found", "There is nothing at this address.");
}

export async function handleScheduled(env: Env): Promise<void> {
  for (const task of scheduledTasks) {
    try { await task(env); } catch (err) { console.error("scheduled_task_failed", err instanceof Error ? err.message : String(err)); }
  }
}
