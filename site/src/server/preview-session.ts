import type { SecurityEnv } from "./api-security.ts";

const cookieName = "__Host-ai_preview";
const lifetime = 15 * 60;
const encoder = new TextEncoder();
const hex = (bytes: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
const key = (secret: string) => crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
const message = (host: string, value: string) => encoder.encode(`private-preview-v1|${host}|${value}`);

function browserPreview(req: Request, env: SecurityEnv): boolean {
  const url = new URL(req.url);
  const hosts = (env.API_ALLOWED_HOSTS ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  // Browser sessions are restricted to the single named private Workers preview.
  return env.PREVIEW_PROTECTED === "true" && url.protocol === "https:" && hosts.length === 1 &&
    hosts[0] === url.hostname && url.hostname.endsWith(".workers.dev");
}
export async function equalPreviewCredential(secret: string, supplied: string): Promise<boolean> {
  if (!supplied || supplied.length > 256) return false;
  const digest = async (s: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(s)));
  const [a, b] = await Promise.all([digest(secret), digest(supplied)]);
  let different = 0; for (let i = 0; i < a.length; i++) different |= a[i] ^ b[i];
  return different === 0;
}
export async function validPreviewSession(req: Request, env: SecurityEnv): Promise<boolean> {
  if (!browserPreview(req, env) || !env.PREVIEW_ACCESS_TOKEN || env.PREVIEW_ACCESS_TOKEN.length < 32) return false;
  const cookies = (req.headers.get("cookie") ?? "").split(";").map(s => s.trim()).filter(s => s.startsWith(cookieName + "="));
  if (cookies.length !== 1) return false;
  const value = cookies[0].slice(cookieName.length + 1);
  const match = value.match(/^([0-9]{10})\.([0-9]{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/);
  if (!match) return false;
  const issued = Number(match[1]), expires = Number(match[2]), now = Math.floor(Date.now() / 1000);
  if (issued > now || expires <= now || expires - issued !== lifetime) return false;
  try {
    const signature = Uint8Array.from(match[4].match(/../g)!, s => parseInt(s, 16));
    return await crypto.subtle.verify("HMAC", await key(env.PREVIEW_ACCESS_TOKEN), signature, message(new URL(req.url).hostname, match.slice(1, 4).join(".")));
  } catch { return false; }
}
const headers = {
  "cache-control": "no-store, private", "pragma": "no-cache", "x-robots-tag": "noindex, nofollow",
  "content-security-policy": "default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
  "referrer-policy": "no-referrer", "x-content-type-options": "nosniff", "x-frame-options": "DENY",
};
function loginPage(status = 200, error = ""): Response {
  // no-referrer makes native form POSTs send Origin:null. Keep same-origin proof
  // for the CSRF check while still withholding referrers from other origins.
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Private staging access</title><main><h1>Private staging access</h1><p>Enter the staging access credential to open a private 15-minute browser session. Security checks still apply to protected actions.</p>${error ? `<p role="alert">${error}</p>` : ""}<form method="post" action="/__preview/login" autocomplete="off"><label>Staging access credential <input name="preview_token" type="password" required maxlength="256" autocomplete="off" spellcheck="false"></label><button type="submit">Open staging</button></form></main></html>`, { status, headers: { ...headers, "referrer-policy": "same-origin", "content-type": "text/html; charset=utf-8" } });
}
async function readForm(req: Request): Promise<URLSearchParams | null> {
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/x-www-form-urlencoded")) return null;
  if (Number(req.headers.get("content-length")) > 1024 || !req.body) return null;
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > 1024) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return new URLSearchParams(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch { return null; } finally { reader.releaseLock(); }
}
export async function previewSessionRoute(req: Request, env: SecurityEnv): Promise<Response | null> {
  const url = new URL(req.url);
  if (!["/__preview/login", "/__preview/logout"].includes(url.pathname)) return null;
  if (!browserPreview(req, env)) return new Response("Not found", { status: 404, headers });
  const secret = env.PREVIEW_ACCESS_TOKEN;
  if (!secret || secret.length < 32) return new Response("Private preview is not configured.", { status: 503, headers });
  if (url.search) return new Response("Use the private login form without URL parameters.", { status: 400, headers });
  if (url.pathname === "/__preview/login" && req.method === "GET") return loginPage();
  if (req.method !== "POST") return new Response("Use POST.", { status: 405, headers: { ...headers, allow: url.pathname.endsWith("login") ? "GET, POST" : "POST" } });
  if (req.headers.get("origin") !== url.origin || req.headers.get("sec-fetch-site") === "cross-site") return new Response("Open this action on the private staging site.", { status: 403, headers });
  const ip = req.headers.get("cf-connecting-ip");
  if (!ip || !env.API_WRITE_LIMITER) return new Response("Request protection unavailable.", { status: 503, headers });
  try {
    if (!(await env.API_WRITE_LIMITER.limit({ key: ip })).success) return new Response("Try again in a minute.", { status: 429, headers: { ...headers, "retry-after": "60" } });
  } catch { return new Response("Request protection unavailable.", { status: 503, headers }); }
  if (url.pathname === "/__preview/logout") return new Response(null, { status: 303, headers: { ...headers, location: "/__preview/login", "set-cookie": `${cookieName}=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Strict` } });
  const form = await readForm(req);
  if (!form || form.getAll("preview_token").length !== 1 || [...form.keys()].some(k => k !== "preview_token")) return loginPage(400, "Use the staging access form.");
  if (!(await equalPreviewCredential(secret, form.get("preview_token") ?? ""))) return loginPage(403, "Access could not be verified.");
  const now = Math.floor(Date.now() / 1000);
  const value = `${now}.${now + lifetime}.${hex(crypto.getRandomValues(new Uint8Array(16)))}`;
  const signature = hex(await crypto.subtle.sign("HMAC", await key(secret), message(url.hostname, value)));
  return new Response(null, { status: 303, headers: { ...headers, location: "/space", "set-cookie": `${cookieName}=${value}.${signature}; Path=/; Max-Age=${lifetime}; Secure; HttpOnly; SameSite=Strict` } });
}
