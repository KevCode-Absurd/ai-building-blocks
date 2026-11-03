// Log lines for Workers Logs (wrangler observability): one per request the Worker runs that failed (4xx or 5xx), threw
// or was slow. Request counts and status totals for everything else are in the Workers dashboard. Only the method, a
// cleaned route, the status and the time taken are written: never the query string, headers, body, IP or a share-link
// token. Cloudflare's own per-request logs stay off (wrangler.example.jsonc) because they record the raw address.
// A thrown error or a 5xx gets a short error id, sent back in the x-error-id header so a report can be matched to it.

const SEGMENT_ID = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{16,}|[A-Za-z0-9_]{24,}|\d{4,})$/i;
// Paths whose second part is a private token or id, whatever it looks like.
const PRIVATE_PARENT = new Set(["s", "people"]);
const SLOW_MS = 2_000;

/** The path with ids, tokens, emails and anything odd replaced, so it is safe to keep in logs. */
export function safeRoute(pathname: string): string {
  let path = pathname;
  try { path = decodeURIComponent(pathname); } catch { /* keep the raw path */ }
  const parts = path.split("/").filter(Boolean).slice(0, 8).map((part, index, all) => {
    if (index === 1 && PRIVATE_PARENT.has(all[0])) return ":id";
    if (part.includes("@") || SEGMENT_ID.test(part) || part.length > 80) return ":id";
    return /^[\w.~-]+$/.test(part) ? part : ":x";
  });
  return ("/" + parts.join("/")).slice(0, 200);
}

/** A short id that ties a log line to what a visitor or support sees. */
export const errorId = () => crypto.randomUUID().slice(0, 8);

const errorName = (error: unknown) => {
  const name = (error as { name?: unknown } | null)?.name;
  return typeof name === "string" && /^[A-Za-z]{1,40}$/.test(name) ? name : "Error";
};

type Log = { event: string; method: string; route: string; status: number; ms: number; id?: string; error?: string };
type Logger = { log(line: string): void; error(line: string): void };

/** Run the router, log the outcome and turn an unexpected throw into a plain 500 instead of Cloudflare's error page. */
export async function withRequestLog(request: Request, handle: () => Promise<Response>, logger: Logger = console, now: () => number = Date.now): Promise<Response> {
  const started = now();
  const url = new URL(request.url);
  const base: Pick<Log, "method" | "route"> = { method: request.method.slice(0, 10), route: safeRoute(url.pathname) };
  try {
    const response = await handle();
    if (response.status < 500) {
      const ms = now() - started;
      if (response.status >= 400 || ms >= SLOW_MS) logger.log(JSON.stringify({ event: "request", ...base, status: response.status, ms } satisfies Log));
      return response;
    }
    const id = errorId();
    logger.error(JSON.stringify({ event: "request", ...base, status: response.status, ms: now() - started, id } satisfies Log));
    // Responses from fetch() have locked headers; copy only when the id can be added.
    try { response.headers.set("x-error-id", id); return response; } catch { return response; }
  } catch (error) {
    const id = errorId();
    // The error type only: messages can carry stored text or SQL.
    logger.error(JSON.stringify({ event: "worker_error", ...base, status: 500, ms: now() - started, id, error: errorName(error) } satisfies Log));
    const api = base.route === "/api" || base.route.startsWith("/api/") || base.route.startsWith("/mcp") || base.route.startsWith("/oauth");
    const headers = { "cache-control": "no-store", "x-content-type-options": "nosniff", "x-error-id": id };
    return api
      ? Response.json({ error: "Something went wrong on our side. Please try again.", error_id: id }, { status: 500, headers })
      : new Response(`Something went wrong on our side. Please reload the page. (Error ${id})`, { status: 500, headers: { ...headers, "content-type": "text/plain; charset=utf-8" } });
  }
}
