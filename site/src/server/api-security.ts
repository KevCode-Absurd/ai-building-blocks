// Shared by the Workers router and Pages adapters. Never trust browser-only checks.
import { equalPreviewCredential, validPreviewSession } from "./preview-session.ts";
import type { SaveFailureReporter } from "./save-diagnostics.ts";
type Limiter = { limit(options: { key: string }): Promise<{ success: boolean }> };
export type SecurityEnv = {
  API_ALLOWED_HOSTS?: string;
  SECURITY_LOCAL?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  PREVIEW_PROTECTED?: string;
  PREVIEW_ACCESS_TOKEN?: string;
  API_READ_LIMITER?: Limiter;
  API_WRITE_LIMITER?: Limiter;
  AI_LIMITER?: Limiter;
  /** Optional bucket for anonymous public API and MCP reads, so agents and the site's own reads never starve each
   *  other. Without it, public reads share API_READ_LIMITER. */
  PUBLIC_READ_LIMITER?: Limiter;
};
export type SecurityAction = "compose" | "transcribe" | "comment" | "create_space";
/** The bucket a request counts against. "public_read" is an anonymous public API or MCP read. */
export type LimitClass = "read" | "write" | "public_read";
/** The configured windows (the ratelimits in wrangler.example.jsonc), echoed in RateLimit headers on a 429. Keep them in
 *  step with the bindings: Cloudflare's binding only answers allowed or not, so these are the policy, not live counts. */
export const RATE_LIMITS: Record<LimitClass | "ai", { limit: number; period: number }> = {
  read: { limit: 120, period: 60 }, write: { limit: 30, period: 60 }, public_read: { limit: 600, period: 60 }, ai: { limit: 3, period: 60 },
};
/** Retry-After plus the IETF RateLimit-Policy and RateLimit fields (draft-ietf-httpapi-ratelimit-headers) for a rejected request. */
export function rateLimitHeaders(name: LimitClass | "ai"): Record<string, string> {
  const { limit, period } = RATE_LIMITS[name];
  return { "retry-after": String(period), "ratelimit-policy": `"${name}";q=${limit};w=${period}`, ratelimit: `"${name}";r=0;t=${period}` };
}
export type SecurityOptions = {
  /** Count the request against this bucket instead of choosing by HTTP method (the public MCP classifies by JSON-RPC method). */
  limit?: LimitClass;
  /** "public": errors use the public API's shape, { error: { code, message } }. The default, { error: message }, is what the site's own pages read. */
  errors?: "public";
};
const errorBody = (options: SecurityOptions, code: string, message: string) => options.errors === "public" ? { error: { code, message } } : { error: message };
const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
export const localSecurity = (req: Request, env: SecurityEnv) => env.SECURITY_LOCAL === "true" && localHosts.has(new URL(req.url).hostname);
export const securityJson = (status: number, body: unknown, extra: Record<string, string> = {}) => Response.json(body, {
  status, headers: { "cache-control": "no-store", "x-content-type-options": "nosniff", ...extra },
});
export async function previewSecurity(req: Request, env: SecurityEnv, options: SecurityOptions = {}): Promise<Response | null> {
  if (env.PREVIEW_PROTECTED !== "true") return null;
  const secret = env.PREVIEW_ACCESS_TOKEN;
  const supplied = req.headers.get("x-preview-access") ?? "";
  if (!secret || secret.length < 32) return securityJson(503, errorBody(options, "preview_unconfigured", "Private preview is not configured."), { "x-robots-tag": "noindex, nofollow" });
  if (await equalPreviewCredential(secret, supplied) || await validPreviewSession(req, env)) return null;
  return securityJson(403, errorBody(options, "preview_private", "This preview is private."), { "x-robots-tag": "noindex, nofollow" });
}
export function turnstileAction(req: Request): SecurityAction | null {
  if (req.method !== "POST") return null;
  const path = new URL(req.url).pathname.replace(/\/+$/, "");
  if (path === "/api/compose") return "compose";
  if (path === "/api/transcribe") return "transcribe";
  if (path === "/api/comments") return "comment";
  if (path === "/api/spaces") return "create_space";
  return null;
}
export async function apiSecurity(req: Request, env: SecurityEnv, verify: typeof fetch = fetch, report: SaveFailureReporter = () => {}, options: SecurityOptions = {}): Promise<Response | null> {
  const deny = (status: number, code: string, message: string, extra: Record<string, string> = {}) => securityJson(status, errorBody(options, code, message), extra);
  const privatePreview = await previewSecurity(req, env, options);
  if (privatePreview) { report("security", "preview_rejected"); return privatePreview; }
  if (localSecurity(req, env)) return null;
  const url = new URL(req.url);
  const allowed = (env.API_ALLOWED_HOSTS ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!allowed.length) { report("security", "security_config_missing"); return deny(503, "security_unavailable", "Security configuration is unavailable. Please try later."); }
  if (url.protocol !== "https:" || !allowed.includes(url.hostname)) { report("security", "security_host_rejected"); return deny(403, "host_forbidden", "Use the official site to access this service."); }
  const write = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (write && (req.headers.get("sec-fetch-site") === "cross-site" || (req.headers.has("origin") && req.headers.get("origin") !== url.origin))) {
    report("security", "origin_rejected");
    return deny(403, "origin_forbidden", "Open this action on the site.");
  }
  // Cloudflare supplies this header. Forwarded/X-Real-IP and client identifiers are not trusted.
  const ip = req.headers.get("cf-connecting-ip");
  if (!ip) { report("security", "security_ip_missing"); return deny(503, "security_unavailable", "Security verification is unavailable. Please try later."); }
  const action = turnstileAction(req);
  const bucket: LimitClass = options.limit ?? (write ? "write" : "read");
  // Public reads use their own bucket when it is bound, otherwise the shared read bucket (and its headers).
  const applied: LimitClass = bucket === "public_read" && !env.PUBLIC_READ_LIMITER ? "read" : bucket;
  const limiter = applied === "write" ? env.API_WRITE_LIMITER : applied === "public_read" ? env.PUBLIC_READ_LIMITER : env.API_READ_LIMITER;
  const paid = action === "compose" || action === "transcribe";
  if (!limiter || (paid && !env.AI_LIMITER)) { report("security", "limiter_missing"); return deny(503, "protection_unavailable", "Request protection is unavailable. Please try later."); }
  try {
    // One shared bucket per visitor and operation class; changing paths/queries cannot reset it.
    const within = (await limiter.limit({ key: ip })).success;
    if (!within || (paid && !(await env.AI_LIMITER!.limit({ key: ip })).success)) {
      report("security", "rate_limited");
      return deny(429, "rate_limited", "Too many requests. Please wait a minute and try again.", rateLimitHeaders(within ? "ai" : applied));
    }
  } catch { report("security", "limiter_unavailable"); return deny(503, "protection_unavailable", "Request protection is unavailable. Please try later."); }
  if (!action) return null;
  // Fail closed: missing configuration must never silently permit a paid call or anonymous write.
  if (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY || /^([123])x0{5}/.test(env.TURNSTILE_SITE_KEY)) {
    return deny(503, "security_unavailable", "Security verification is not configured yet. Please try later.");
  }
  const token = req.headers.get("x-turnstile-token");
  if (!token || token.length > 2048) return deny(403, "verification_required", "Complete the security check and try again.");
  try {
    const response = await verify("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return deny(503, "security_unavailable", "Security verification is temporarily unavailable. Please try again.");
    const result = await response.json() as { success?: boolean; hostname?: string; action?: string };
    if (result.success !== true || result.hostname !== url.hostname || result.action !== action) {
      return deny(403, "verification_failed", "The security check expired or failed. Please try again.");
    }
  } catch { return deny(503, "security_unavailable", "Security verification is temporarily unavailable. Please try again."); }
  return null;
}
export async function securityConfig(req: Request, env: SecurityEnv): Promise<Response> {
  if (req.method !== "GET") return securityJson(405, { error: "Use GET." }, { allow: "GET" });
  const denied = await apiSecurity(req, env);
  if (denied) return denied;
  if (localSecurity(req, env)) return securityJson(200, { required: false });
  if (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY) return securityJson(503, { error: "Security verification is not configured yet. Please try later." });
  return securityJson(200, { required: true, sitekey: env.TURNSTILE_SITE_KEY });
}
