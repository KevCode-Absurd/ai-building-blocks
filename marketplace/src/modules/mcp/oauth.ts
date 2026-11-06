// OAuth 2.1 authorization server for buyers' own AI apps (Claude, ChatGPT and other MCP clients).
// Adapted from the library's site/src/server/mcp-oauth.ts (redirect rules, loopback port matching, PKCE S256,
// single-use codes, refresh rotation with reuse detection) and site/migrations/0008_mcp_oauth.sql, reshaped for
// this app's router, D1 helpers, Clerk sign-in and event log.
//
// Flow: POST /oauth/register -> GET /oauth/authorize (validated, stored, redirect to /oauth/consent?request=<id>)
// -> the signed-in buyer approves (POST /api/oauth/approve returns the client's redirect URL with code and state)
// -> POST /oauth/token (authorization_code + PKCE, then refresh_token with rotation).
// Tokens are "abo_" + 64 hex, stored only as SHA-256 hashes. The verifier registered below makes them
// authenticate as { via: "oauth", scopes } on /mcp only (core/auth.ts ignores them on /api routes).
import type { Env } from "../../env.ts";
import type { Ctx } from "../../core/http.ts";
import { fail, json } from "../../core/http.ts";
import { registerTokenVerifier, type AuthUser } from "../../core/auth.ts";
import { account } from "../../core/access.ts";
import { all, first, nowIso, parseJson, sha256Hex } from "../../core/db.ts";
import { eventStatement, recordEvent } from "../../core/events.ts";
import { SCOPES, SCOPE_WORDS, requireBrowserSession, type Scope } from "./service.ts";

export const ACCESS_TTL_SECONDS = 3600;
export const REFRESH_TTL_SECONDS = 30 * 86400;
const CODE_TTL_SECONDS = 300;
/** Long enough to create an account and verify an email on the consent page. */
const REQUEST_TTL_SECONDS = 30 * 60;
const MAX_CLIENTS = 10_000;
const MAX_BODY = 20_000;
export const TOKEN_PATTERN = /^abo_[a-f0-9]{64}$/;

// ---------- Small helpers ----------

const enc = new TextEncoder();
const hex = (bytes: Uint8Array) => [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
const randomHex = (n = 32) => hex(crypto.getRandomValues(new Uint8Array(n)));
const newToken = () => `abo_${randomHex(32)}`;
const later = (now: string, seconds: number) => new Date(Date.parse(now) + seconds * 1000).toISOString();
const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export async function pkceChallenge(verifier: string): Promise<string> {
  return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(verifier))));
}
export const hashToken = (raw: string) => sha256Hex(raw);
export const mcpResource = (env: Env) => `${env.APP_ORIGIN}/mcp`;

/** Canonical scope string. Ordering includes browsing, so read is always granted. Unknown scopes are ignored (RFC 6749 3.3). */
export function normalizeScope(raw: string | null | undefined): string {
  const asked = new Set((raw ?? "").trim().split(/\s+/).filter(Boolean));
  const known = SCOPES.filter(s => asked.has(s));
  if (!known.length) return SCOPES.join(" ");
  return known.includes("marketplace:order") ? "marketplace:read marketplace:order" : "marketplace:read";
}
export const scopeList = (scope: string) => scope.split(" ").filter(Boolean) as Scope[];

export class OAuthError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}
const oauthFail = (status: number, code: string, message: string): never => { throw new OAuthError(status, code, message); };

/** Machine endpoints (metadata, register, token, revoke, /mcp) are called by AI apps, sometimes from a browser. */
export const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "authorization, content-type, mcp-protocol-version, mcp-session-id, last-event-id",
  "access-control-expose-headers": "www-authenticate, mcp-session-id",
  "access-control-max-age": "600",
};
const NO_STORE = { "cache-control": "no-store", pragma: "no-cache", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" };

export function machineJson(status: number, data: unknown, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", ...NO_STORE, ...CORS_HEADERS, ...extra } });
}
const oauthErrorResponse = (err: OAuthError) => machineJson(err.status, { error: err.code, error_description: err.message });
export const preflight = () => new Response(null, { status: 204, headers: { ...CORS_HEADERS, "cache-control": "no-store" } });

async function catchOAuth(work: () => Promise<Response>): Promise<Response> {
  try { return await work(); } catch (err) {
    if (err instanceof OAuthError) return oauthErrorResponse(err);
    console.error("mcp_oauth_error", err instanceof Error ? err.message : String(err));
    return machineJson(503, { error: "temporarily_unavailable", error_description: "Sign-in for AI apps is not working right now. Try again in a minute." });
  }
}

async function readText(req: Request): Promise<string> {
  const text = await req.text();
  if (text.length > MAX_BODY) oauthFail(400, "invalid_request", "The request is too large.");
  return text;
}

/** Token and revoke requests: form-encoded (the standard) or JSON. Repeated form fields are refused. */
async function readParams(req: Request): Promise<Record<string, string>> {
  const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  const text = await readText(req);
  if (type === "application/json") {
    let value: unknown;
    try { value = JSON.parse(text || "{}"); } catch { return oauthFail(400, "invalid_request", "Send valid JSON."); }
    if (!value || typeof value !== "object" || Array.isArray(value)) oauthFail(400, "invalid_request", "Send a JSON object.");
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([, v]) => typeof v === "string")) as Record<string, string>;
  }
  if (type && type !== "application/x-www-form-urlencoded") oauthFail(400, "invalid_request", "Send the request form-encoded or as JSON.");
  const form = new URLSearchParams(text);
  if ([...form.keys()].some(k => form.getAll(k).length > 1)) oauthFail(400, "invalid_request", "Each parameter may appear once.");
  return Object.fromEntries(form);
}

/** Public clients send client_id in the body; some send it as HTTP Basic with an empty secret. Secrets are ignored: PKCE protects the code. */
function clientIdFrom(req: Request, params: Record<string, string>): string {
  let id = params.client_id;
  const basic = /^Basic\s+([A-Za-z0-9+/=]+)$/i.exec(req.headers.get("authorization") ?? "");
  if (!id && basic) {
    try { id = decodeURIComponent(atob(basic[1]).split(":")[0] ?? ""); } catch { id = ""; }
  }
  if (!id || id.length > 128) oauthFail(401, "invalid_client", "Send the client_id you got when you registered.");
  return id!;
}

// ---------- Redirect URIs ----------

const LOOPBACK = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** https, or http on localhost / 127.0.0.1 / [::1] for apps running on the buyer's computer. Exact URIs only. */
export function redirectProblem(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw || raw.length > 2000) return "Each redirect URI must be text, up to 2,000 characters.";
  let url: URL;
  try { url = new URL(raw); } catch { return "Each redirect URI must be a full address."; }
  const local = url.protocol === "http:" && LOOPBACK.has(url.hostname);
  if (url.protocol !== "https:" && !local) return "Use an https redirect URI, or http on localhost or 127.0.0.1 for an app on your computer.";
  if (url.username || url.password || raw.includes("#") || raw.includes("*")) return "A redirect URI cannot hold a password, a # part or a wildcard.";
  if (["code", "state", "iss", "error"].some(k => url.searchParams.has(k))) return "A redirect URI cannot already contain code, state, iss or error.";
  return null;
}

/** Exact match, except that a local http redirect may use any port (RFC 8252 7.3). */
export function redirectMatches(registered: string, requested: string): boolean {
  if (registered === requested) return true;
  const loop = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?(?=[/?]|$)/;
  if (!loop.test(registered) || !loop.test(requested)) return false;
  return registered.replace(loop, "http://$1") === requested.replace(loop, "http://$1");
}

// ---------- Discovery ----------

export function authorizationServerMetadata(env: Env) {
  const o = env.APP_ORIGIN;
  return {
    issuer: o,
    authorization_endpoint: `${o}/oauth/authorize`,
    token_endpoint: `${o}/oauth/token`,
    registration_endpoint: `${o}/oauth/register`,
    revocation_endpoint: `${o}/oauth/revoke`,
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["none"],
    revocation_endpoint_auth_methods_supported: ["none"],
    code_challenge_methods_supported: ["S256"],
    scopes_supported: [...SCOPES],
    authorization_response_iss_parameter_supported: true,
    service_documentation: `${o}/connect`,
  };
}

export function protectedResourceMetadata(env: Env) {
  return {
    resource: mcpResource(env),
    authorization_servers: [env.APP_ORIGIN],
    scopes_supported: [...SCOPES],
    bearer_methods_supported: ["header"],
    resource_name: "AI Blocks Agents",
    resource_documentation: `${env.APP_ORIGIN}/connect`,
  };
}

// ---------- Registration ----------

interface ClientRow { client_id: string; client_name: string; redirect_uris: string; created_at: string }

async function getClient(env: Env, id: string): Promise<(Omit<ClientRow, "redirect_uris"> & { redirect_uris: string[] }) | null> {
  const row = await first<ClientRow>(env.DB, "SELECT * FROM mcp_clients WHERE client_id = ?", id);
  return row ? { ...row, redirect_uris: parseJson<string[]>(row.redirect_uris, []) } : null;
}

const cleanName = (v: unknown) => typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, 120) : "";

export function register(ctx: Ctx): Promise<Response> {
  return catchOAuth(async () => {
    const text = await readText(ctx.req);
    let data: Record<string, unknown>;
    try { data = JSON.parse(text || "null"); } catch { return oauthFail(400, "invalid_client_metadata", "Send the registration as a JSON object."); }
    if (!data || typeof data !== "object" || Array.isArray(data)) oauthFail(400, "invalid_client_metadata", "Send the registration as a JSON object.");
    const uris = data.redirect_uris;
    if (!Array.isArray(uris) || uris.length < 1 || uris.length > 10) oauthFail(400, "invalid_redirect_uri", "Register between 1 and 10 redirect URIs.");
    for (const u of uris as unknown[]) { const p = redirectProblem(u); if (p) oauthFail(400, "invalid_redirect_uri", p); }
    if (new Set(uris as string[]).size !== (uris as string[]).length) oauthFail(400, "invalid_redirect_uri", "Each redirect URI may appear once.");
    const listOf = (v: unknown, allowed: string[], field: string) => {
      if (v === undefined) return;
      if (!Array.isArray(v) || v.some(x => !allowed.includes(String(x)))) oauthFail(400, "invalid_client_metadata", `${field} may only contain ${allowed.join(" and ")}.`);
    };
    listOf(data.grant_types, ["authorization_code", "refresh_token"], "grant_types");
    listOf(data.response_types, ["code"], "response_types");
    // Public clients only. A client asking for a secret method is registered as public and told so in the reply.
    if (data.token_endpoint_auth_method !== undefined && !["none", "client_secret_post", "client_secret_basic"].includes(String(data.token_endpoint_auth_method))) {
      oauthFail(400, "invalid_client_metadata", "Only public clients with PKCE are supported (token_endpoint_auth_method none).");
    }
    const now = nowIso();
    const client = { client_id: `mcpc_${randomHex(16)}`, client_name: cleanName(data.client_name) || "Unnamed AI app", redirect_uris: uris as string[] };
    const db = ctx.env.DB;
    const res = await db.batch([
      db.prepare("INSERT INTO mcp_clients (client_id, client_name, redirect_uris, created_at) SELECT ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM mcp_clients) < ?")
        .bind(client.client_id, client.client_name, JSON.stringify(client.redirect_uris), now, MAX_CLIENTS),
      db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, 'system', 'system', 'mcp_client', ?, 'mcp.client_registered', ? WHERE changes() = 1")
        .bind(now, client.client_id, JSON.stringify({ client_name: client.client_name, redirect_hosts: client.redirect_uris.map(u => new URL(u).host) })),
    ]);
    if (!res[0]?.meta?.changes) oauthFail(503, "temporarily_unavailable", "We cannot register more apps right now. Try again later.");
    return machineJson(201, {
      ...client,
      client_id_issued_at: Math.floor(Date.parse(now) / 1000),
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      scope: SCOPES.join(" "),
    });
  });
}

// ---------- Authorization request ----------

function redirectTo(location: string): Response {
  return new Response(null, { status: 302, headers: { location, ...NO_STORE } });
}

/** Where the consent page explains a request we cannot send back to the app (unknown app or redirect). */
const consentError = (env: Env, code: string) => redirectTo(`${env.APP_ORIGIN}/oauth/consent?error=${code}`);

function backToClient(env: Env, redirectUri: string, params: Record<string, string | null | undefined>): string {
  const url = new URL(redirectUri);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  url.searchParams.set("iss", env.APP_ORIGIN);
  return url.toString();
}

/** Accept the MCP endpoint with or without a trailing slash, or the bare origin; store the canonical form. */
function resourceOk(env: Env, raw: string | null): boolean {
  if (raw === null) return true;
  return [mcpResource(env), `${mcpResource(env)}/`, env.APP_ORIGIN, `${env.APP_ORIGIN}/`].includes(raw);
}

export async function authorize(ctx: Ctx): Promise<Response> {
  const env = ctx.env, q = ctx.url.searchParams;
  if ([...q.keys()].some(k => q.getAll(k).length > 1)) return consentError(env, "invalid_request");
  // Never redirect anywhere until the app and its redirect URI are known to match.
  const clientId = q.get("client_id") ?? "";
  const client = clientId && clientId.length <= 128 ? await getClient(env, clientId) : null;
  if (!client) return consentError(env, "unknown_client");
  let redirectUri = q.get("redirect_uri");
  if (!redirectUri && client.redirect_uris.length === 1) redirectUri = client.redirect_uris[0];
  if (!redirectUri || redirectProblem(redirectUri) || !client.redirect_uris.some(r => redirectMatches(r, redirectUri!))) return consentError(env, "bad_redirect");
  const state = q.get("state");
  const back = (error: string, description: string) => redirectTo(backToClient(env, redirectUri!, { error, error_description: description, state }));
  if (state !== null && state.length > 2048) return back("invalid_request", "state is too long.");
  if (q.get("response_type") !== "code") return back("unsupported_response_type", "Only response_type=code is supported.");
  const challenge = q.get("code_challenge") ?? "";
  if (q.get("code_challenge_method") !== "S256" || !/^[A-Za-z0-9_-]{43}$/.test(challenge)) return back("invalid_request", "PKCE with code_challenge_method S256 is required.");
  if (!resourceOk(env, q.get("resource"))) return back("invalid_target", `The only resource here is ${mcpResource(env)}.`);
  const now = nowIso(), id = `oar_${randomHex(20)}`;
  const db = env.DB;
  await db.prepare("INSERT INTO mcp_auth_requests (id, client_id, redirect_uri, scope, state, code_challenge, resource, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, client.client_id, redirectUri, normalizeScope(q.get("scope")), state, challenge, mcpResource(env), now, later(now, REQUEST_TTL_SECONDS)).run();
  return redirectTo(`${env.APP_ORIGIN}/oauth/consent?request=${id}`);
}

// ---------- Consent (signed in on the website) ----------

interface AuthRequestRow { id: string; client_id: string; redirect_uri: string; scope: string; state: string | null; code_challenge: string; resource: string; created_at: string; expires_at: string }

const REQUEST_GONE = "This connection link has expired or was already used. Go back to your AI app and connect again.";

/** The consent page loads this. Only a person signed in on the website (not an AI app) may see or approve it. */
export async function getAuthRequest(ctx: Ctx): Promise<Response> {
  await requireBrowserSession(ctx);
  const a = await account(ctx);
  const row = await first<AuthRequestRow & { client_name: string }>(ctx.env.DB,
    "SELECT r.*, c.client_name FROM mcp_auth_requests r JOIN mcp_clients c ON c.client_id = r.client_id WHERE r.id = ? AND r.expires_at > ?", ctx.params.id, nowIso());
  if (!row) return fail(404, "request_expired", REQUEST_GONE);
  const scopes = scopeList(row.scope);
  return json({
    request_id: row.id,
    client_name: row.client_name,
    redirect_host: new URL(row.redirect_uri).host,
    scopes: scopes.map(s => ({ id: s, ...SCOPE_WORDS[s] })),
    asks_to_order: scopes.includes("marketplace:order"),
    beta_access: a.betaAccess,
    expires_at: row.expires_at,
  });
}

export async function approve(ctx: Ctx): Promise<Response> {
  await requireBrowserSession(ctx);
  const origin = ctx.req.headers.get("origin");
  if (origin && origin !== ctx.env.APP_ORIGIN) fail(403, "wrong_site", "Approve connections on the AI Blocks website.");
  const body = await ctx.body<{ request_id?: unknown; approve?: unknown; allow_order?: unknown }>();
  if (typeof body.request_id !== "string" || !/^oar_[a-f0-9]{40}$/.test(body.request_id)) fail(400, "invalid_input", "This connection link is not complete. Go back to your AI app and connect again.");
  if (typeof body.approve !== "boolean") fail(400, "invalid_input", "Choose Approve or Deny.");
  const a = await account(ctx);
  const env = ctx.env, db = env.DB, now = nowIso();
  // Single use: the request row is removed as it is read.
  const req = await first<AuthRequestRow>(db, "DELETE FROM mcp_auth_requests WHERE id = ? AND expires_at > ? RETURNING *", body.request_id, now);
  if (!req) return fail(404, "request_expired", REQUEST_GONE);
  const client = await getClient(env, req.client_id);
  const clientName = client?.client_name ?? "An AI app";
  if (!body.approve) {
    await recordEvent(db, { actor: a.user.id, actorKind: "user", entity: "mcp_client", entityId: req.client_id, type: "mcp.connection_denied", data: { client_name: clientName } });
    return json({ redirect_url: backToClient(env, req.redirect_uri, { error: "access_denied", error_description: "The person said no.", state: req.state }) });
  }
  const scope = body.allow_order === false ? "marketplace:read" : req.scope;
  const code = randomHex(32);
  await db.batch([
    db.prepare("INSERT INTO mcp_codes (code_hash, client_id, user_id, redirect_uri, scope, code_challenge, resource, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(await hashToken(code), req.client_id, a.user.id, req.redirect_uri, scope, req.code_challenge, req.resource, now, later(now, CODE_TTL_SECONDS)),
    eventStatement(db, { actor: a.user.id, actorKind: "user", entity: "mcp_client", entityId: req.client_id, type: "mcp.connection_approved", data: { client_name: clientName, scope } }, now),
  ]);
  return json({ redirect_url: backToClient(env, req.redirect_uri, { code, state: req.state }) });
}

// ---------- Token endpoint ----------

interface CodeRow { code_hash: string; client_id: string; user_id: string; redirect_uri: string; scope: string; code_challenge: string; resource: string; expires_at: string; consumed_at: string | null; grant_id: string | null }
interface TokenRow { token_hash: string; grant_id: string; client_id: string; kind: "access" | "refresh"; expires_at: string; consumed_at: string | null }
interface GrantRow { id: string; user_id: string; client_id: string; scope: string; resource: string; created_at: string; last_used_at: string | null; revoked_at: string | null }

function revokeGrantStatements(db: D1Database, grantId: string, now: string, actor: string, actorKind: "user" | "system" | "mcp", reason: string): D1PreparedStatement[] {
  return [
    db.prepare("UPDATE mcp_grants SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL").bind(now, grantId),
    db.prepare("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, ?, 'mcp_grant', ?, 'mcp.connection_revoked', ? WHERE changes() = 1")
      .bind(now, actor, actorKind, grantId, JSON.stringify({ reason })),
  ];
}

function tokenInsert(db: D1Database, hash: string, grantId: string, clientId: string, kind: "access" | "refresh", now: string, guard: { sql: string; params: unknown[] }): D1PreparedStatement {
  const ttl = kind === "access" ? ACCESS_TTL_SECONDS : REFRESH_TTL_SECONDS;
  return db.prepare(`INSERT INTO mcp_tokens (token_hash, grant_id, client_id, kind, created_at, expires_at) SELECT ?, ?, ?, ?, ?, ? WHERE EXISTS (${guard.sql})`)
    .bind(hash, grantId, clientId, kind, now, later(now, ttl), ...guard.params);
}

const tokenReply = (access: string, refresh: string, scope: string) =>
  machineJson(200, { access_token: access, token_type: "Bearer", expires_in: ACCESS_TTL_SECONDS, refresh_token: refresh, scope });

export function token(ctx: Ctx): Promise<Response> {
  return catchOAuth(async () => {
    const params = await readParams(ctx.req);
    const clientId = clientIdFrom(ctx.req, params);
    const env = ctx.env, db = env.DB;
    if (!(await getClient(env, clientId))) oauthFail(401, "invalid_client", "This app is not registered. Register it again.");
    if (params.resource !== undefined && !resourceOk(env, params.resource)) oauthFail(400, "invalid_target", `The only resource here is ${mcpResource(env)}.`);
    const now = nowIso();
    const access = newToken(), refresh = newToken();
    const [accessHash, refreshHash] = await Promise.all([hashToken(access), hashToken(refresh)]);

    if (params.grant_type === "authorization_code") {
      const raw = params.code ?? "", verifier = params.code_verifier ?? "";
      if (!/^[a-f0-9]{64}$/.test(raw)) oauthFail(400, "invalid_grant", "The code is not valid.");
      if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) oauthFail(400, "invalid_grant", "A PKCE code_verifier of 43 to 128 characters is required.");
      const codeHash = await hashToken(raw);
      const code = await first<CodeRow>(db, "SELECT * FROM mcp_codes WHERE code_hash = ?", codeHash);
      if (!code) return oauthFail(400, "invalid_grant", "The code is not valid.");
      if (code.consumed_at) {
        // A code used twice may have been stolen: stop everything issued from it.
        if (code.grant_id) await db.batch(revokeGrantStatements(db, code.grant_id, now, "system", "system", "code_reused"));
        oauthFail(400, "invalid_grant", "This code was already used. Connect again.");
      }
      if (code.expires_at <= now) oauthFail(400, "invalid_grant", "The code has expired. Connect again.");
      if (code.client_id !== clientId) oauthFail(400, "invalid_grant", "The code was issued to another app.");
      if (params.redirect_uri !== undefined ? params.redirect_uri !== code.redirect_uri : false) oauthFail(400, "invalid_grant", "redirect_uri does not match the one used to ask for the code.");
      if ((await pkceChallenge(verifier)) !== code.code_challenge) oauthFail(400, "invalid_grant", "The PKCE code_verifier does not match.");
      const grantId = `mcg_${randomHex(16)}`;
      const guard = { sql: "SELECT 1 FROM mcp_codes WHERE code_hash = ? AND grant_id = ?", params: [codeHash, grantId] };
      const results = await db.batch([
        db.prepare("UPDATE mcp_codes SET consumed_at = ?, grant_id = ? WHERE code_hash = ? AND consumed_at IS NULL AND expires_at > ?").bind(now, grantId, codeHash, now),
        db.prepare(`INSERT INTO mcp_grants (id, user_id, client_id, scope, resource, created_at) SELECT ?, ?, ?, ?, ?, ? WHERE EXISTS (${guard.sql})`)
          .bind(grantId, code.user_id, clientId, code.scope, code.resource, now, ...guard.params),
        tokenInsert(db, accessHash, grantId, clientId, "access", now, guard),
        tokenInsert(db, refreshHash, grantId, clientId, "refresh", now, guard),
        db.prepare(`INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) SELECT ?, ?, 'user', 'mcp_grant', ?, 'mcp.connected', ? WHERE EXISTS (${guard.sql})`)
          .bind(now, code.user_id, grantId, JSON.stringify({ client_id: clientId, scope: code.scope }), ...guard.params),
      ]);
      if (results[0]?.meta?.changes !== 1) oauthFail(400, "invalid_grant", "This code was already used. Connect again.");
      return tokenReply(access, refresh, code.scope);
    }

    if (params.grant_type === "refresh_token") {
      const raw = params.refresh_token ?? "";
      if (!TOKEN_PATTERN.test(raw)) oauthFail(400, "invalid_grant", "The refresh token is not valid. Connect again.");
      const oldHash = await hashToken(raw);
      const row = await first<TokenRow & { scope: string; revoked_at: string | null }>(db,
        "SELECT t.*, g.scope, g.revoked_at FROM mcp_tokens t JOIN mcp_grants g ON g.id = t.grant_id WHERE t.token_hash = ? AND t.kind = 'refresh'", oldHash);
      if (!row || row.client_id !== clientId) return oauthFail(400, "invalid_grant", "The refresh token is not valid. Connect again.");
      if (row.revoked_at) oauthFail(400, "invalid_grant", "This connection was turned off. Connect again.");
      if (row.consumed_at) {
        // A refresh token used twice may have been stolen: stop the whole connection.
        await db.batch(revokeGrantStatements(db, row.grant_id, now, "system", "system", "refresh_reused"));
        oauthFail(400, "invalid_grant", "This refresh token was already used, so the connection was turned off. Connect again.");
      }
      if (row.expires_at <= now) oauthFail(400, "invalid_grant", "The refresh token has expired. Connect again.");
      if (params.scope !== undefined && normalizeScope(params.scope) !== row.scope) oauthFail(400, "invalid_scope", "A refresh cannot change what the app may do. Connect again to change it.");
      const guard = { sql: "SELECT 1 FROM mcp_tokens WHERE token_hash = ? AND replaced_by = ?", params: [oldHash, refreshHash] };
      const results = await db.batch([
        db.prepare("UPDATE mcp_tokens SET consumed_at = ?, replaced_by = ? WHERE token_hash = ? AND kind = 'refresh' AND consumed_at IS NULL AND expires_at > ? AND EXISTS (SELECT 1 FROM mcp_grants g WHERE g.id = grant_id AND g.revoked_at IS NULL)")
          .bind(now, refreshHash, oldHash, now),
        tokenInsert(db, accessHash, row.grant_id, clientId, "access", now, guard),
        tokenInsert(db, refreshHash, row.grant_id, clientId, "refresh", now, guard),
      ]);
      if (results[0]?.meta?.changes !== 1) oauthFail(400, "invalid_grant", "This refresh token was already used. Connect again.");
      return tokenReply(access, refresh, row.scope);
    }

    return oauthFail(400, "unsupported_grant_type", "Use grant_type authorization_code or refresh_token.");
  });
}

/** RFC 7009: always 200, so the reply never tells whether a token existed. */
export function revoke(ctx: Ctx): Promise<Response> {
  return catchOAuth(async () => {
    const params = await readParams(ctx.req);
    const raw = params.token ?? "";
    if (TOKEN_PATTERN.test(raw)) {
      const db = ctx.env.DB;
      const row = await first<TokenRow>(db, "SELECT * FROM mcp_tokens WHERE token_hash = ?", await hashToken(raw));
      if (row && (!params.client_id || params.client_id === row.client_id)) {
        await db.batch(revokeGrantStatements(db, row.grant_id, nowIso(), row.client_id, "mcp", "revoked_by_app"));
      }
    }
    return machineJson(200, {});
  });
}

// ---------- Bearer token verifier ----------

/** Turns a live access token into the caller. Registered at import so every route sees it. */
export async function verifyAccessToken(raw: string, env: Env): Promise<AuthUser | null> {
  if (!TOKEN_PATTERN.test(raw)) return null;
  const now = nowIso();
  const row = await first<{ grant_id: string; user_id: string; scope: string; last_used_at: string | null }>(env.DB,
    "SELECT g.id AS grant_id, g.user_id, g.scope, g.last_used_at FROM mcp_tokens t JOIN mcp_grants g ON g.id = t.grant_id WHERE t.token_hash = ? AND t.kind = 'access' AND t.expires_at > ? AND g.revoked_at IS NULL",
    await hashToken(raw), now);
  if (!row) return null;
  if (!row.last_used_at || Date.parse(now) - Date.parse(row.last_used_at) > 5 * 60_000) {
    await env.DB.prepare("UPDATE mcp_grants SET last_used_at = ? WHERE id = ?").bind(now, row.grant_id).run().catch(() => undefined);
  }
  // For OAuth callers, sessionId holds the grant id (one per connected app).
  return { id: row.user_id, via: "oauth", sessionId: row.grant_id, scopes: scopeList(row.scope) };
}

registerTokenVerifier(verifyAccessToken);

// ---------- The buyer's connections (Connect page) ----------

export async function listConnections(ctx: Ctx): Promise<Response> {
  const user = await requireBrowserSession(ctx);
  const rows = await all<GrantRow & { client_name: string; redirect_uris: string }>(ctx.env.DB,
    `SELECT g.*, c.client_name, c.redirect_uris FROM mcp_grants g JOIN mcp_clients c ON c.client_id = g.client_id
     WHERE g.user_id = ? AND g.revoked_at IS NULL
       AND EXISTS (SELECT 1 FROM mcp_tokens t WHERE t.grant_id = g.id AND t.kind = 'refresh' AND t.consumed_at IS NULL AND t.expires_at > ?)
     ORDER BY g.created_at DESC LIMIT 50`, user.id, nowIso());
  return json({
    connections: rows.map(r => ({
      id: r.id,
      client_name: r.client_name,
      redirect_host: (() => { try { return new URL(parseJson<string[]>(r.redirect_uris, [])[0] ?? "").host; } catch { return ""; } })(),
      scopes: scopeList(r.scope).map(s => ({ id: s, ...SCOPE_WORDS[s] })),
      created_at: r.created_at,
      last_used_at: r.last_used_at,
    })),
  });
}

export async function revokeConnection(ctx: Ctx): Promise<Response> {
  const user = await requireBrowserSession(ctx);
  const db = ctx.env.DB;
  const grant = await first<GrantRow>(db, "SELECT * FROM mcp_grants WHERE id = ? AND user_id = ?", ctx.params.id, user.id);
  if (!grant) return fail(404, "connection_not_found", "We could not find that connection. Refresh the page.");
  await db.batch(revokeGrantStatements(db, grant.id, nowIso(), user.id, "user", "disconnected_by_buyer"));
  return json({ ok: true });
}

// ---------- Cleanup (cron) ----------

export async function cleanupExpired(env: Env): Promise<void> {
  const now = nowIso(), dayAgo = later(now, -86400);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM mcp_auth_requests WHERE expires_at <= ?").bind(now),
    // Used codes are kept a day after they expire so a late replay still revokes its grant.
    env.DB.prepare("DELETE FROM mcp_codes WHERE expires_at <= ?").bind(dayAgo),
    env.DB.prepare("DELETE FROM mcp_tokens WHERE expires_at <= ?").bind(now),
  ]);
}
