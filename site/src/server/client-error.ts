// POST /api/client-error: browsers report a page that broke (a failed code load after a deploy, a page that hit the
// recovery screen) and Content-Security-Policy-Report-Only violations. Each report becomes one log line in Workers
// Logs. Nothing is stored, nothing is sent on, and only cleaned fields are kept: the error type, a short message with
// names, numbers, quoted text and addresses removed, a cleaned route, and for a policy report the rule and the origin.
// It has its own small rate limit, so a noisy page can never use up a visitor's limit for saving work.
import { localSecurity, type SecurityEnv } from "./api-security.ts";
import { errorId, safeRoute } from "./request-log.ts";
import { safeErrorText } from "../lib/safe-error-text.ts";

type Limiter = { limit(options: { key: string }): Promise<{ success: boolean }> };
export type ClientErrorEnv = SecurityEnv & { CLIENT_ERROR_LIMITER?: Limiter };
type Logger = { error(line: string): void };

export const CLIENT_ERROR_PATH = "/api/client-error";
const MAX_BODY = 8_192;
const PER_IP_PER_MINUTE = 10;
const PER_ISOLATE_PER_MINUTE = 300;
const KINDS = new Set(["chunk", "boundary", "error"]);
const NAMES = /^(?:Error|TypeError|ReferenceError|SyntaxError|RangeError|ChunkLoadError|NetworkError|AbortError|TimeoutError|SecurityError|NotFoundError|InvalidStateError|DOMException|UnknownError)$/;

/** Only the origin of a blocked address, or the keyword the browser uses for inline code. */
function blockedSource(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  if (/^(inline|eval|wasm-eval|trusted-types-policy|trusted-types-sink|data|blob)$/.test(value)) return value;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.origin : url.protocol.replace(":", ""); } catch { return "other"; }
}
const directive = (value: unknown) => typeof value === "string" ? value.replace(/[^a-z-]/g, "").slice(0, 40) : "";
const routeOf = (value: unknown) => {
  if (typeof value !== "string") return "";
  if (value.startsWith("/")) return safeRoute(value.split(/[?#]/)[0]);
  try { return safeRoute(new URL(value).pathname); } catch { return ""; }
};

type Clean = { kind: string; route: string; name?: string; message?: string; directive?: string; blocked?: string; disposition?: string };

/** Turn a raw report into the cleaned fields we log, or null when it is not a report we understand. */
export function cleanReport(text: string, contentType: string): Clean[] | null {
  let body: unknown;
  try { body = JSON.parse(text); } catch { return null; }
  if (!body || typeof body !== "object") return null;
  // report-uri sends {"csp-report": {...}}; the Reporting API sends [{type: "csp-violation", body: {...}}].
  const legacy = (body as Record<string, unknown>)["csp-report"];
  if (legacy && typeof legacy === "object") {
    const r = legacy as Record<string, unknown>;
    return [{ kind: "csp", route: routeOf(r["document-uri"]), directive: directive(r["effective-directive"] ?? r["violated-directive"]), blocked: blockedSource(r["blocked-uri"]), disposition: r.disposition === "enforce" ? "enforce" : "report" }];
  }
  if (Array.isArray(body) && /reports\+json/.test(contentType)) {
    const rows = body.slice(0, 5).filter(row => row && typeof row === "object" && (row as { type?: unknown }).type === "csp-violation" && (row as { body?: unknown }).body && typeof (row as { body?: unknown }).body === "object")
      .map(row => { const r = (row as { body: Record<string, unknown> }).body; return { kind: "csp", route: routeOf(r.documentURL), directive: directive(r.effectiveDirective), blocked: blockedSource(r.blockedURL), disposition: r.disposition === "enforce" ? "enforce" : "report" }; });
    return rows.length ? rows : null;
  }
  const r = body as Record<string, unknown>;
  if (typeof r.kind !== "string" || !KINDS.has(r.kind)) return null;
  return [{ kind: r.kind, route: routeOf(r.route), name: typeof r.name === "string" && NAMES.test(r.name) ? r.name : "Error", message: safeErrorText(r.message) }];
}

// A fallback limit inside this isolate, used on its own when the shared limiter is not configured.
const windowState = { start: 0, total: 0, perIp: new Map<string, number>() };
export function isolateAllows(ip: string, now = Date.now()): boolean {
  if (now - windowState.start >= 60_000) { windowState.start = now; windowState.total = 0; windowState.perIp.clear(); }
  const mine = windowState.perIp.get(ip) ?? 0;
  if (windowState.total >= PER_ISOLATE_PER_MINUTE || mine >= PER_IP_PER_MINUTE) return false;
  windowState.total++; windowState.perIp.set(ip, mine + 1);
  return true;
}
export function resetClientErrorLimits() { windowState.start = 0; windowState.total = 0; windowState.perIp.clear(); }

const reply = (status: number, extra: Record<string, string> = {}) => new Response(null, { status, headers: { "cache-control": "no-store", "x-content-type-options": "nosniff", ...extra } });

export async function clientError(request: Request, env: ClientErrorEnv, logger: Logger = console): Promise<Response> {
  if (request.method !== "POST") return reply(405, { allow: "POST" });
  const url = new URL(request.url);
  const local = localSecurity(request, env);
  const hosts = (env.API_ALLOWED_HOSTS ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!local && (url.protocol !== "https:" || !hosts.includes(url.hostname))) return reply(403);
  // Reports come from our own pages only.
  if (request.headers.get("sec-fetch-site") === "cross-site" || (request.headers.has("origin") && request.headers.get("origin") !== url.origin)) return reply(403);
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY) return reply(413);
  const ip = request.headers.get("cf-connecting-ip") ?? (local ? "local" : "");
  if (!ip) return reply(403);
  if (!isolateAllows(ip)) return reply(429, { "retry-after": "60" });
  if (env.CLIENT_ERROR_LIMITER) {
    try { if (!(await env.CLIENT_ERROR_LIMITER.limit({ key: ip })).success) return reply(429, { "retry-after": "60" }); }
    catch { /* the isolate limit above still applies */ }
  }
  const text = await request.text();
  if (text.length > MAX_BODY) return reply(413);
  const reports = cleanReport(text, request.headers.get("content-type") ?? "");
  if (!reports) return reply(400);
  for (const report of reports) logger.error(JSON.stringify({ event: "client_error", id: errorId(), ...report }));
  return reply(204);
}
