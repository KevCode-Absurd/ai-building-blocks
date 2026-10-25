/** Read-only, resource-bound OAuth delegation for private MCP. No provider/model calls. */
export type McpOAuthClient = { client_id: string; client_name: string; redirect_uris: string[]; created_at: number };
export type McpOAuthScope = "company:read" | "saved:read";
type Authorization = {
  client_id: string; redirect_uri: string; response_type: "code"; code_challenge: string; code_challenge_method: "S256";
  resource: string; scope: McpOAuthScope; state: string;
};
export type McpAuthorizationRequest = Authorization & { client_name: string };
type Code = Authorization & { code_hash: string; user_id: string; expires_at: number };
type Grant = { id: string; user_id: string; client_id: string; resource: string; scope: string; revoked_at: number | null };
type Token = { token_hash: string; grant_id: string; client_id: string; kind: "access" | "refresh"; expires_at: number; consumed_at: number | null; rotation_target: string | null };
export type McpOAuthStore = {
  putClient(client: McpOAuthClient): Promise<boolean>;
  getClient(id: string): Promise<McpOAuthClient | null>;
  putCode(code: Code): Promise<void>;
  getCode(hash: string): Promise<Code | null>;
  consumeCode(hash: string, now: number): Promise<Code | null>;
  issue(grant: Grant, access: Token, refresh: Token): Promise<void>;
  getAccess(hash: string, now: number): Promise<Grant | null>;
  getRefresh(hash: string, client: string, now: number): Promise<Grant | null>;
  rotate(hash: string, client: string, now: number, access: Token, refresh: Token): Promise<boolean>;
  revoke(hash: string, client: string, now: number): Promise<void>;
};
type Statement = { bind(...args: unknown[]): Statement; first<T = Record<string, unknown>>(): Promise<T | null>; run(): Promise<{ meta?: { changes?: number } }> };
export type McpOAuthDB = { prepare(sql: string): Statement; batch(statements: Statement[]): Promise<{ meta?: { changes?: number } }[]> };
export type McpOAuthEnv = { MCP_OAUTH_ENABLED?: string };
export type McpOAuthOptions = {
  origin?: string;
  authenticate: (request: Request) => Promise<{ userId: string } | null>;
  authorizeResource: (userId: string, resource: string) => Promise<boolean>;
};
const textEncoder = new TextEncoder();
const nowSeconds = () => Math.floor(Date.now() / 1000);
const random = () => [...crypto.getRandomValues(new Uint8Array(32))].map(b => b.toString(16).padStart(2, "0")).join("");
const hash = async (value: string) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", textEncoder.encode(value)))].map(b => b.toString(16).padStart(2, "0")).join("");
const challengeFor = async (value: string) => btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256", textEncoder.encode(value))))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
export class OAuthError extends Error { status: number; code: string; constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; } }
const error = (status: number, code: string, message: string): never => { throw new OAuthError(status, code, message); };
const securityHeaders = { "cache-control": "no-store", pragma: "no-cache", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer", "access-control-allow-origin": "*" };
const json = (status: number, value: unknown, extra: Record<string, string> = {}) => new Response(JSON.stringify(value), { status, headers: { ...securityHeaders, "content-type": "application/json; charset=utf-8", ...extra } });
const string = (value: unknown, name: string, max = 2048) => { if (typeof value !== "string" || !value || value.length > max) error(400, "invalid_request", `Invalid ${name}.`); return value as string; };
function onlyKeys(value: Record<string, unknown>, allowed: string[]) { if (Object.keys(value).some(k => !allowed.includes(k))) error(400, "invalid_request", "Unsupported request parameter."); }
function redirect(value: unknown) {
  const raw = string(value, "redirect_uri"); let url: URL;
  try { url = new URL(raw); } catch { return error(400, "invalid_redirect_uri", "A registered redirect URI must be absolute."); }
  const loopback = url.hostname === "127.0.0.1" || url.hostname === "[::1]" || url.hostname === "localhost";
  if ((url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) || url.username || url.password || url.hash || raw.includes("*") || ["code", "state", "iss"].some(k => url.searchParams.has(k))) error(400, "invalid_redirect_uri", "Use an exact HTTPS redirect URI, or HTTP loopback for a native development client.");
  return raw;
}
/** RFC 8252 permits varying only the port of an HTTP loopback IP redirect. */
function redirectMatches(registered: string, requested: string) {
  if (registered === requested) return true;
  const literalLoopback = /^http:\/\/(127\.0\.0\.1|\[::1\])(?::[0-9]+)?(?=\/|$)/;
  if (!literalLoopback.test(registered) || !literalLoopback.test(requested)) return false;
  // Compare raw path/query bytes as registered; URL normalization must not relax them.
  return registered.replace(literalLoopback, "http://$1") === requested.replace(literalLoopback, "http://$1");
}
function resource(value: unknown, origin: string) {
  const raw = string(value, "resource"); let url: URL;
  try { url = new URL(raw); } catch { return error(400, "invalid_target", "Invalid MCP resource."); }
  if (url.origin !== origin || url.username || url.password || url.search || url.hash || !/^\/mcp\/(?:personal|company(?:\/[A-Za-z0-9_-]{8,128})?)$/.test(url.pathname) || raw !== `${origin}${url.pathname}`) error(400, "invalid_target", "Only an exact personal or company MCP endpoint on this server can receive a grant.");
  return raw;
}
function scopeForResource(target: string): McpOAuthScope { return new URL(target).pathname === "/mcp/personal" ? "saved:read" : "company:read"; }
function registrationScope(value: unknown): string {
  if (value === undefined) return "company:read saved:read";
  const scopes = string(value, "scope", 100).split(" ");
  if (new Set(scopes).size !== scopes.length || scopes.some(s => !["company:read", "saved:read"].includes(s))) error(400, "invalid_scope", "Only company:read and saved:read are available.");
  return scopes.join(" ");
}
async function body(request: Request): Promise<Record<string, unknown>> {
  if (Number(request.headers.get("content-length")) > 20000 || !request.body) error(400, "invalid_request", "Request body is missing or too large.");
  const reader = request.body!.getReader(); const parts: Uint8Array[] = []; let size = 0;
  while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.length; if (size > 20000) { await reader.cancel(); error(400, "invalid_request", "Request body is too large."); } parts.push(chunk.value); }
  const bytes = new Uint8Array(size); let offset = 0; for (const part of parts) { bytes.set(part, offset); offset += part.length; }
  let text: string; try { text = new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { return error(400, "invalid_request", "Invalid UTF-8 request."); }
  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].toLowerCase();
  if (contentType === "application/json") {
    let value: unknown; try { value = JSON.parse(text); } catch { return error(400, "invalid_request", "Invalid JSON request."); }
    if (!value || typeof value !== "object" || Array.isArray(value)) error(400, "invalid_request", "Expected an object.");
    return value as Record<string, unknown>;
  }
  if (contentType === "application/x-www-form-urlencoded") {
    const form = new URLSearchParams(text); if ([...form.keys()].some(k => form.getAll(k).length > 1)) error(400, "invalid_request", "Repeated request parameters are not allowed.");
    return Object.fromEntries(form);
  }
  return error(415, "invalid_request", "Use JSON or form-encoded parameters.");
}

/** Validate before showing consent or constructing any sign-in redirect. Never redirect an invalid request. */
export async function validateAuthorizationRequest(input: URL | URLSearchParams | Record<string, unknown>, store: McpOAuthStore, origin: string): Promise<McpAuthorizationRequest> {
  let data: Record<string, unknown>;
  if (input instanceof URL || input instanceof URLSearchParams) {
    const query = input instanceof URL ? input.searchParams : input;
    if ([...query.keys()].some(k => query.getAll(k).length > 1)) error(400, "invalid_request", "Repeated authorization parameters are not allowed.");
    data = Object.fromEntries(query);
  } else data = input;
  onlyKeys(data, ["client_id", "redirect_uri", "response_type", "code_challenge", "code_challenge_method", "resource", "scope", "state", "ui_locales"]);
  // Hosted AI clients may send a language hint. Ignore it after validation:
  // it must never change consent, identity, scopes, or the resource-bound grant.
  if (data.ui_locales !== undefined) {
    const locales = string(data.ui_locales, "ui_locales", 256);
    if (!/^[A-Za-z]{1,8}(?:-[A-Za-z0-9]{1,8})*(?: [A-Za-z]{1,8}(?:-[A-Za-z0-9]{1,8})*)*$/.test(locales)) error(400, "invalid_request", "Invalid ui_locales.");
  }
  const clientId = string(data.client_id, "client_id", 128); const client = await store.getClient(clientId);
  if (!client) error(400, "invalid_client", "Unknown client. Register the client before authorization.");
  const redirectUri = redirect(data.redirect_uri);
  if (!client!.redirect_uris.some(registered => redirectMatches(registered, redirectUri))) error(400, "invalid_redirect_uri", "Redirect URI does not match this registered client.");
  if (data.response_type !== "code") error(400, "unsupported_response_type", "Only authorization code is supported.");
  if (data.code_challenge_method !== "S256" || typeof data.code_challenge !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(data.code_challenge)) error(400, "invalid_request", "PKCE S256 is required.");
  const target = resource(data.resource, origin), scope = scopeForResource(target);
  if (data.scope !== scope) error(400, "invalid_scope", `This resource requires exactly ${scope}. Personal and company permissions cannot be combined in one grant.`);
  return { client_id: clientId, client_name: client!.client_name, redirect_uri: redirectUri, response_type: "code", code_challenge: data.code_challenge as string, code_challenge_method: "S256", resource: target, scope, state: string(data.state, "state") };
}

function tokenRecord(raw: string, kind: "access" | "refresh", grant: Grant, expires: number): Promise<Token> {
  return hash(raw).then(token_hash => ({ token_hash, grant_id: grant.id, client_id: grant.client_id, kind, expires_at: expires, consumed_at: null, rotation_target: null }));
}

export async function handleMcpOAuth(request: Request, env: McpOAuthEnv, store: McpOAuthStore, options: McpOAuthOptions): Promise<Response | null> {
  const url = new URL(request.url), origin = options.origin ?? url.origin;
  const paths = ["/.well-known/oauth-authorization-server", "/oauth/register", "/oauth/authorize", "/oauth/token", "/oauth/revoke"];
  if (!paths.includes(url.pathname)) return null;
  if (env.MCP_OAUTH_ENABLED !== "true") return json(404, { error: "not_found" });
  try {
    if (url.pathname === "/.well-known/oauth-authorization-server") {
      if (request.method !== "GET") return json(405, { error: "invalid_request" }, { allow: "GET" });
      return json(200, { issuer: origin, authorization_endpoint: `${origin}/oauth/authorize`, token_endpoint: `${origin}/oauth/token`, registration_endpoint: `${origin}/oauth/register`, revocation_endpoint: `${origin}/oauth/revoke`, response_types_supported: ["code"], grant_types_supported: ["authorization_code", "refresh_token"], token_endpoint_auth_methods_supported: ["none"], code_challenge_methods_supported: ["S256"], scopes_supported: ["company:read", "saved:read"], client_id_metadata_document_supported: false, authorization_response_iss_parameter_supported: true });
    }
    if (request.method === "OPTIONS" && url.pathname !== "/oauth/authorize") return new Response(null, { status: 204, headers: { ...securityHeaders, "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "600" } });
    if (url.pathname === "/oauth/authorize" && request.method === "GET") return null; // Root renders the validated sign-in/consent page.
    if (request.method !== "POST") return json(405, { error: "invalid_request", error_description: "Use POST." }, { allow: "POST" });
    if (url.search) error(400, "invalid_request", "Submit OAuth request parameters in the body.");
    const data = await body(request); const now = nowSeconds();
    if (url.pathname === "/oauth/register") {
      onlyKeys(data, ["client_name", "redirect_uris", "grant_types", "response_types", "token_endpoint_auth_method", "client_uri", "logo_uri", "scope", "application_type"]);
      if (data.application_type !== undefined && !["native", "web"].includes(data.application_type as string)) error(400, "invalid_client_metadata", "Application type must be native or web.");
      if (data.token_endpoint_auth_method !== undefined && data.token_endpoint_auth_method !== "none") error(400, "invalid_client_metadata", "Only public clients with PKCE are supported.");
      if (data.grant_types !== undefined && (!Array.isArray(data.grant_types) || data.grant_types.some(g => !["authorization_code", "refresh_token"].includes(String(g))))) error(400, "invalid_client_metadata", "Unsupported grant type.");
      if (data.response_types !== undefined && (!Array.isArray(data.response_types) || data.response_types.some(g => g !== "code"))) error(400, "invalid_client_metadata", "Unsupported response type.");
      const registeredScopes = registrationScope(data.scope);
      if (!Array.isArray(data.redirect_uris) || !data.redirect_uris.length || data.redirect_uris.length > 10) error(400, "invalid_client_metadata", "Register between 1 and 10 exact redirect URIs.");
      const redirects = (data.redirect_uris as unknown[]).map(redirect);
      if (new Set(redirects).size !== redirects.length) error(400, "invalid_client_metadata", "Redirect URIs must be unique.");
      const client: McpOAuthClient = { client_id: `mcp_${random()}`, client_name: string(data.client_name, "client_name", 120), redirect_uris: redirects, created_at: now };
      if (!(await store.putClient(client))) error(429, "temporarily_unavailable", "Client registration capacity has been reached. Reuse an existing registration or contact the workspace operator.");
      return json(201, { ...client, client_id_issued_at: now, token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], scope: registeredScopes });
    }
    if (url.pathname === "/oauth/authorize") {
      if (request.headers.get("origin") !== origin || request.headers.get("sec-fetch-site") === "cross-site") error(403, "access_denied", "Authorize from this site's consent page.");
      const { consent, ...authorizationData } = data;
      if (consent !== true) error(403, "access_denied", "Explicit consent is required.");
      const authorization = await validateAuthorizationRequest(authorizationData, store, origin);
      const user = await options.authenticate(request);
      if (!user?.userId) error(401, "access_denied", "Sign in before authorizing the connection.");
      if (!(await options.authorizeResource(user!.userId, authorization.resource))) error(403, "access_denied", "Your account does not have access to this saved-library resource.");
      const codeRaw = random(); const { client_name: _clientName, ...record } = authorization;
      await store.putCode({ ...record, user_id: user!.userId, code_hash: await hash(codeRaw), expires_at: now + 300 });
      const destination = new URL(authorization.redirect_uri); destination.searchParams.set("code", codeRaw); destination.searchParams.set("state", authorization.state); destination.searchParams.set("iss", origin);
      return json(200, { redirect_uri: destination.toString() });
    }
    if (url.pathname === "/oauth/revoke") {
      onlyKeys(data, ["token", "token_type_hint", "client_id"]);
      const clientId = string(data.client_id, "client_id", 128); const token = string(data.token, "token", 256);
      if (!(await store.getClient(clientId))) error(400, "invalid_client", "Unknown client.");
      await store.revoke(await hash(token), clientId, now);
      return json(200, {});
    }
    const clientId = string(data.client_id, "client_id", 128);
    if (!(await store.getClient(clientId))) error(400, "invalid_client", "Unknown client.");
    const target = resource(data.resource, origin);
    let grant: Grant;
    const accessRaw = random(), refreshRaw = random();
    if (data.grant_type === "authorization_code") {
      onlyKeys(data, ["grant_type", "code", "client_id", "redirect_uri", "code_verifier", "resource"]);
      const rawCode = string(data.code, "code", 256), verifier = string(data.code_verifier, "code_verifier", 128);
      if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) error(400, "invalid_grant", "Invalid PKCE verifier.");
      const codeHash = await hash(rawCode); const code = await store.getCode(codeHash);
      if (!code || code.expires_at <= now || code.client_id !== clientId || code.redirect_uri !== data.redirect_uri || code.resource !== target || await challengeFor(verifier) !== code.code_challenge) error(400, "invalid_grant", "The code, redirect, resource or PKCE verifier is invalid or expired.");
      const consumed = await store.consumeCode(codeHash, now);
      if (!consumed) error(400, "invalid_grant", "Authorization code has already been used.");
      if (code!.scope !== scopeForResource(target)) error(400, "invalid_grant", "The authorization scope does not match this resource.");
      grant = { id: random(), user_id: code!.user_id, client_id: clientId, resource: target, scope: code!.scope, revoked_at: null };
      await store.issue(grant, await tokenRecord(accessRaw, "access", grant, now + 3600), await tokenRecord(refreshRaw, "refresh", grant, now + 30 * 86400));
    } else if (data.grant_type === "refresh_token") {
      onlyKeys(data, ["grant_type", "refresh_token", "client_id", "resource", "scope"]);
      if (data.scope !== undefined && data.scope !== scopeForResource(target)) error(400, "invalid_scope", "A refresh cannot expand or change scope.");
      const refreshHash = await hash(string(data.refresh_token, "refresh_token", 256));
      const existing = await store.getRefresh(refreshHash, clientId, now);
      if (!existing) {
        // A recognized consumed refresh token can indicate theft. Revoke the whole lineage.
        // Unknown tokens and tokens belonging to another client cannot revoke a grant.
        await store.revoke(refreshHash, clientId, now);
        error(400, "invalid_grant", "Refresh token is invalid, expired or revoked. Reconnect the client.");
      }
      if (existing!.resource !== target || existing!.scope !== scopeForResource(target)) error(400, "invalid_grant", "Refresh token is bound to another resource or scope.");
      grant = existing!;
      if (!(await store.rotate(refreshHash, clientId, now, await tokenRecord(accessRaw, "access", grant, now + 3600), await tokenRecord(refreshRaw, "refresh", grant, now + 30 * 86400)))) {
        await store.revoke(refreshHash, clientId, now);
        error(400, "invalid_grant", "Refresh token has already been used or revoked. Reconnect the client.");
      }
    } else return error(400, "unsupported_grant_type", "Only authorization_code and refresh_token are supported.");
    return json(200, { access_token: accessRaw, token_type: "Bearer", expires_in: 3600, refresh_token: refreshRaw, scope: grant.scope, resource: grant.resource });
  } catch (caught) {
    if (caught instanceof OAuthError) return json(caught.status, { error: caught.code, error_description: caught.message });
    return json(503, { error: "temporarily_unavailable", error_description: "The authorization service is unavailable. No connection was granted." });
  }
}

/** Only an opaque OAuth access token is accepted; query strings, cookies and Clerk sessions are not borrowed. */
export async function verifyMcpToken(request: Request, store: McpOAuthStore): Promise<{ userId: string; workspaceToken?: string; resource: string; scope: McpOAuthScope } | null> {
  const value = request.headers.get("authorization") ?? "";
  if (!/^Bearer [a-f0-9]{64}$/.test(value)) return null;
  const grant = await store.getAccess(await hash(value.slice(7)), nowSeconds());
  const url = new URL(request.url);
  if (!/^\/mcp\/(?:personal|company(?:\/[A-Za-z0-9_-]{8,128})?)$/.test(url.pathname) || !grant || grant.revoked_at !== null || grant.scope !== scopeForResource(grant.resource) || grant.resource !== `${url.origin}${url.pathname}`) return null;
  const workspaceToken = url.pathname.startsWith("/mcp/company/") ? url.pathname.slice("/mcp/company/".length) : undefined;
  return { userId: grant.user_id, ...(workspaceToken ? { workspaceToken } : {}), resource: grant.resource, scope: grant.scope as McpOAuthScope };
}

export function memoryMcpOAuthStore(): McpOAuthStore {
  const clients = new Map<string, McpOAuthClient>(), codes = new Map<string, Code>(), grants = new Map<string, Grant>(), tokens = new Map<string, Token>();
  const active = (key: string, kind: Token["kind"], now: number, client?: string) => { const token = tokens.get(key); if (!token || token.kind !== kind || token.expires_at <= now || token.consumed_at !== null || (client && token.client_id !== client)) return null; const grant = grants.get(token.grant_id); return grant?.revoked_at === null ? grant : null; };
  return {
    async putClient(value) { if (clients.size >= 1000 || clients.has(value.client_id)) return false; clients.set(value.client_id, structuredClone(value)); return true; },
    async getClient(id) { return structuredClone(clients.get(id) ?? null); },
    async putCode(value) { codes.set(value.code_hash, structuredClone(value)); },
    async getCode(id) { return structuredClone(codes.get(id) ?? null); },
    async consumeCode(id, now) { const value = codes.get(id); if (!value || value.expires_at <= now) return null; codes.delete(id); return structuredClone(value); },
    async issue(grant, access, refresh) { grants.set(grant.id, structuredClone(grant)); tokens.set(access.token_hash, structuredClone(access)); tokens.set(refresh.token_hash, structuredClone(refresh)); },
    async getAccess(id, now) { return structuredClone(active(id, "access", now)); },
    async getRefresh(id, client, now) { return structuredClone(active(id, "refresh", now, client)); },
    async rotate(id, client, now, access, refresh) { if (!active(id, "refresh", now, client)) return false; const old = tokens.get(id)!; if (old.grant_id !== access.grant_id || old.grant_id !== refresh.grant_id) return false; old.consumed_at = now; old.rotation_target = refresh.token_hash; tokens.set(access.token_hash, structuredClone(access)); tokens.set(refresh.token_hash, structuredClone(refresh)); return true; },
    async revoke(id, client, now) { const token = tokens.get(id); if (token?.client_id === client) { const grant = grants.get(token.grant_id); if (grant) grant.revoked_at = now; } },
  };
}

export function d1McpOAuthStore(db: McpOAuthDB): McpOAuthStore {
  const insertToken = (t: Token) => db.prepare("INSERT INTO mcp_oauth_tokens(token_hash,grant_id,client_id,kind,expires_at,consumed_at,rotation_target) VALUES(?,?,?,?,?,?,?)").bind(t.token_hash, t.grant_id, t.client_id, t.kind, t.expires_at, t.consumed_at, t.rotation_target);
  const getGrant = (token: string, kind: string, now: number, client?: string) => db.prepare(`SELECT g.* FROM mcp_oauth_tokens t JOIN mcp_oauth_grants g ON g.id=t.grant_id WHERE t.token_hash=? AND t.kind=? AND t.expires_at>? AND t.consumed_at IS NULL AND g.revoked_at IS NULL${client ? " AND t.client_id=?" : ""}`).bind(token, kind, now, ...(client ? [client] : [])).first<Grant>();
  return {
    async putClient(c) { const result = await db.prepare("INSERT INTO mcp_oauth_clients(client_id,client_name,redirect_uris,created_at) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM mcp_oauth_clients)<1000").bind(c.client_id, c.client_name, JSON.stringify(c.redirect_uris), c.created_at).run(); return result.meta?.changes === 1; },
    async getClient(id) { const row = await db.prepare("SELECT * FROM mcp_oauth_clients WHERE client_id=?").bind(id).first<Omit<McpOAuthClient, "redirect_uris"> & { redirect_uris: string }>(); return row ? { ...row, redirect_uris: JSON.parse(row.redirect_uris) } : null; },
    async putCode(c) { await db.prepare("INSERT INTO mcp_oauth_codes(code_hash,contents,expires_at) VALUES(?,?,?)").bind(c.code_hash, JSON.stringify(c), c.expires_at).run(); },
    async getCode(id) { const row = await db.prepare("SELECT contents FROM mcp_oauth_codes WHERE code_hash=?").bind(id).first<{ contents: string }>(); return row ? JSON.parse(row.contents) as Code : null; },
    async consumeCode(id, now) { const row = await db.prepare("DELETE FROM mcp_oauth_codes WHERE code_hash=? AND expires_at>? RETURNING contents").bind(id, now).first<{ contents: string }>(); return row ? JSON.parse(row.contents) as Code : null; },
    async issue(g, a, r) { await db.batch([db.prepare("INSERT INTO mcp_oauth_grants(id,user_id,client_id,resource,scope,revoked_at) VALUES(?,?,?,?,?,NULL)").bind(g.id, g.user_id, g.client_id, g.resource, g.scope), insertToken(a), insertToken(r)]); },
    getAccess: (id, now) => getGrant(id, "access", now),
    getRefresh: (id, client, now) => getGrant(id, "refresh", now, client),
    async rotate(id, client, now, access, refresh) {
      const guard = "SELECT 1 FROM mcp_oauth_tokens old JOIN mcp_oauth_grants g ON g.id=old.grant_id WHERE old.token_hash=? AND old.rotation_target=? AND old.grant_id=? AND g.revoked_at IS NULL";
      const conditional = (t: Token) => db.prepare(`INSERT INTO mcp_oauth_tokens(token_hash,grant_id,client_id,kind,expires_at,consumed_at,rotation_target) SELECT ?,?,?,?,?,NULL,NULL WHERE EXISTS(${guard})`).bind(t.token_hash, t.grant_id, t.client_id, t.kind, t.expires_at, id, refresh.token_hash, t.grant_id);
      const results = await db.batch([
        db.prepare("UPDATE mcp_oauth_tokens SET consumed_at=?,rotation_target=? WHERE token_hash=? AND client_id=? AND kind='refresh' AND expires_at>? AND consumed_at IS NULL AND grant_id=? AND EXISTS(SELECT 1 FROM mcp_oauth_grants g WHERE g.id=grant_id AND g.revoked_at IS NULL)").bind(now, refresh.token_hash, id, client, now, refresh.grant_id),
        conditional(access), conditional(refresh),
      ]);
      return results[0]?.meta?.changes === 1 && results[1]?.meta?.changes === 1 && results[2]?.meta?.changes === 1;
    },
    async revoke(id, client, now) { await db.prepare("UPDATE mcp_oauth_grants SET revoked_at=? WHERE id IN(SELECT grant_id FROM mcp_oauth_tokens WHERE token_hash=? AND client_id=?)").bind(now, id, client).run(); },
  };
}
