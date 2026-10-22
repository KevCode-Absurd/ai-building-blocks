// Shared by the Workers router and Pages adapters. Never trust browser-only checks.
import { equalPreviewCredential, validPreviewSession } from "./preview-session.ts";
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
};
export type SecurityAction = "compose" | "comment" | "create_space";
const localHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);
export const localSecurity = (req: Request, env: SecurityEnv) => env.SECURITY_LOCAL === "true" && localHosts.has(new URL(req.url).hostname);
export const securityJson = (status: number, body: unknown, extra: Record<string, string> = {}) => Response.json(body, {
  status, headers: { "cache-control": "no-store", "x-content-type-options": "nosniff", ...extra },
});
export async function previewSecurity(req: Request, env: SecurityEnv): Promise<Response | null> {
  if (env.PREVIEW_PROTECTED !== "true") return null;
  const secret = env.PREVIEW_ACCESS_TOKEN;
  const supplied = req.headers.get("x-preview-access") ?? "";
  if (!secret || secret.length < 32) return securityJson(503, { error: "Private preview is not configured." }, { "x-robots-tag": "noindex, nofollow" });
  if (await equalPreviewCredential(secret, supplied) || await validPreviewSession(req, env)) return null;
  return securityJson(403, { error: "This preview is private." }, { "x-robots-tag": "noindex, nofollow" });
}
export function turnstileAction(req: Request): SecurityAction | null {
  if (req.method !== "POST") return null;
  const path = new URL(req.url).pathname.replace(/\/+$/, "");
  if (path === "/api/compose") return "compose";
  if (path === "/api/comments") return "comment";
  if (path === "/api/spaces") return "create_space";
  return null;
}
export async function apiSecurity(req: Request, env: SecurityEnv, verify: typeof fetch = fetch): Promise<Response | null> {
  const privatePreview = await previewSecurity(req, env);
  if (privatePreview) return privatePreview;
  if (localSecurity(req, env)) return null;
  const url = new URL(req.url);
  const allowed = (env.API_ALLOWED_HOSTS ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  if (!allowed.length) return securityJson(503, { error: "Security configuration is unavailable. Please try later." });
  if (url.protocol !== "https:" || !allowed.includes(url.hostname)) return securityJson(403, { error: "Use the official site to access this service." });
  const write = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (write && (req.headers.get("sec-fetch-site") === "cross-site" || (req.headers.has("origin") && req.headers.get("origin") !== url.origin))) {
    return securityJson(403, { error: "Open this action on the site." });
  }
  // Cloudflare supplies this header. Forwarded/X-Real-IP and client identifiers are not trusted.
  const ip = req.headers.get("cf-connecting-ip");
  if (!ip) return securityJson(503, { error: "Security verification is unavailable. Please try later." });
  const action = turnstileAction(req);
  const limiter = write ? env.API_WRITE_LIMITER : env.API_READ_LIMITER;
  if (!limiter || (action === "compose" && !env.AI_LIMITER)) return securityJson(503, { error: "Request protection is unavailable. Please try later." });
  try {
    // One shared bucket per visitor and operation class; changing paths/queries cannot reset it.
    if (!(await limiter.limit({ key: ip })).success || (action === "compose" && !(await env.AI_LIMITER!.limit({ key: ip })).success)) {
      return securityJson(429, { error: "Too many requests. Please wait a minute and try again." }, { "retry-after": "60" });
    }
  } catch { return securityJson(503, { error: "Request protection is unavailable. Please try later." }); }
  if (!action) return null;
  // Fail closed: missing configuration must never silently permit a paid call or anonymous write.
  if (!env.TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY || /^([123])x0{5}/.test(env.TURNSTILE_SITE_KEY)) {
    return securityJson(503, { error: "Security verification is not configured yet. Please try later." });
  }
  const token = req.headers.get("x-turnstile-token");
  if (!token || token.length > 2048) return securityJson(403, { error: "Complete the security check and try again." });
  try {
    const response = await verify("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return securityJson(503, { error: "Security verification is temporarily unavailable. Please try again." });
    const result = await response.json() as { success?: boolean; hostname?: string; action?: string };
    if (result.success !== true || result.hostname !== url.hostname || result.action !== action) {
      return securityJson(403, { error: "The security check expired or failed. Please try again." });
    }
  } catch { return securityJson(503, { error: "Security verification is temporarily unavailable. Please try again." }); }
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
