// OAuth 2.1 for MCP clients: discovery, registration, the PKCE code flow, refresh rotation, hashing, revocation, 401s.
import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv, type TestEnv } from "./helpers.ts";
import { handleFetch } from "../src/app.ts";
import { sha256Hex } from "../src/core/db.ts";
import { pkceChallenge } from "../src/modules/mcp/oauth.ts";

const ORIGIN = "https://agents.test";
const RESOURCE = `${ORIGIN}/mcp`;
const CLAUDE_REDIRECT = "https://claude.ai/api/mcp/auth_callback";
const exec = { waitUntil() {}, passThroughOnException() {}, props: {} } as unknown as ExecutionContext;
const INIT = { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } } };
/** Whether /mcp accepts a token: 200 when it does, 401 when not. OAuth tokens never sign in on /api routes. */
const mcpCall = (t: TestEnv, o: { headers: Record<string, string> }) => t.api("POST", "/mcp", { headers: o.headers, body: INIT });

/** A raw request (form bodies, custom headers) straight into the app. */
async function raw(t: TestEnv, method: string, path: string, o: { headers?: Record<string, string>; body?: string } = {}) {
  const res = await handleFetch(new Request(new URL(path, ORIGIN), { method, headers: o.headers, body: o.body }), t.env, exec);
  const text = await res.clone().text();
  let body: any = text;
  try { body = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
  return { status: res.status, body, res };
}
const form = (t: TestEnv, path: string, fields: Record<string, string | undefined>) =>
  raw(t, "POST", path, { headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(Object.entries(fields).filter(([, v]) => v !== undefined) as [string, string][]).toString() });

async function pkce() {
  const verifier = Buffer.from(crypto.getRandomValues(new Uint8Array(48))).toString("base64url");
  return { verifier, challenge: await pkceChallenge(verifier) };
}

async function register(t: TestEnv, redirect_uris: unknown = [CLAUDE_REDIRECT], extra: Record<string, unknown> = {}) {
  return t.api("POST", "/oauth/register", { body: { client_name: "Claude", redirect_uris, grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], token_endpoint_auth_method: "none", ...extra } });
}

function authorizePath(params: Record<string, string | undefined>) {
  return `/oauth/authorize?${new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][])}`;
}

/** The whole flow a client like Claude runs: register, authorize, the buyer approves, exchange the code. */
async function connect(t: TestEnv, o: { user?: string; scope?: string; allowOrder?: boolean; redirect?: string } = {}) {
  const user = o.user ?? "user_buyer";
  const redirect = o.redirect ?? CLAUDE_REDIRECT;
  const reg = await register(t, [redirect]);
  assert.equal(reg.status, 201, JSON.stringify(reg.body));
  const clientId: string = reg.body.client_id;
  const { verifier, challenge } = await pkce();
  const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: clientId, redirect_uri: redirect, code_challenge: challenge, code_challenge_method: "S256", state: "st-123", scope: o.scope, resource: RESOURCE }));
  assert.equal(auth.status, 302);
  const consent = new URL(auth.res.headers.get("location")!);
  assert.equal(consent.origin + consent.pathname, `${ORIGIN}/oauth/consent`);
  const requestId = consent.searchParams.get("request")!;
  const approved = await t.api("POST", "/api/oauth/approve", { user, body: { request_id: requestId, approve: true, allow_order: o.allowOrder ?? true } });
  assert.equal(approved.status, 200, JSON.stringify(approved.body));
  const back = new URL(approved.body.redirect_url);
  const code = back.searchParams.get("code")!;
  const tokens = await form(t, "/oauth/token", { grant_type: "authorization_code", code, client_id: clientId, redirect_uri: redirect, code_verifier: verifier, resource: RESOURCE });
  return { clientId, verifier, challenge, requestId, back, code, tokens, redirect };
}

test("discovery documents describe the server and the /mcp resource", async () => {
  const t = await testEnv();
  const as = await t.api("GET", "/.well-known/oauth-authorization-server");
  assert.equal(as.status, 200);
  assert.equal(as.body.issuer, ORIGIN);
  assert.equal(as.body.authorization_endpoint, `${ORIGIN}/oauth/authorize`);
  assert.equal(as.body.token_endpoint, `${ORIGIN}/oauth/token`);
  assert.equal(as.body.registration_endpoint, `${ORIGIN}/oauth/register`);
  assert.deepEqual(as.body.code_challenge_methods_supported, ["S256"]);
  assert.deepEqual(as.body.grant_types_supported, ["authorization_code", "refresh_token"]);
  assert.deepEqual(as.body.scopes_supported, ["marketplace:read", "marketplace:order"]);
  assert.deepEqual(as.body.token_endpoint_auth_methods_supported, ["none"]);
  for (const path of ["/.well-known/oauth-protected-resource", "/.well-known/oauth-protected-resource/mcp"]) {
    const pr = await t.api("GET", path);
    assert.equal(pr.status, 200, path);
    assert.equal(pr.body.resource, RESOURCE);
    assert.deepEqual(pr.body.authorization_servers, [ORIGIN]);
    assert.deepEqual(pr.body.scopes_supported, ["marketplace:read", "marketplace:order"]);
  }
  const pre = await raw(t, "OPTIONS", "/oauth/token", { headers: { origin: "http://localhost:6274", "access-control-request-method": "POST" } });
  assert.equal(pre.status, 204);
  assert.equal(pre.res.headers.get("access-control-allow-origin"), "*");
});

test("registration accepts https and local http redirects, and refuses the rest", async () => {
  const t = await testEnv();
  const ok = await register(t);
  assert.equal(ok.status, 201);
  assert.match(ok.body.client_id, /^mcpc_[a-f0-9]{32}$/);
  assert.equal(ok.body.token_endpoint_auth_method, "none");
  assert.deepEqual(ok.body.redirect_uris, [CLAUDE_REDIRECT]);
  for (const local of ["http://localhost:6274/oauth/callback", "http://127.0.0.1:33418/callback", "http://[::1]:8080/cb"]) {
    assert.equal((await register(t, [local])).status, 201, local);
  }
  const bad: [unknown, string][] = [
    [["http://example.com/cb"], "invalid_redirect_uri"],
    [["javascript:alert(1)"], "invalid_redirect_uri"],
    [["https://claude.ai/cb#frag"], "invalid_redirect_uri"],
    [["https://user:pw@claude.ai/cb"], "invalid_redirect_uri"],
    [["https://*.claude.ai/cb"], "invalid_redirect_uri"],
    [["https://claude.ai/cb?code=1"], "invalid_redirect_uri"],
    [["not a url"], "invalid_redirect_uri"],
    [[], "invalid_redirect_uri"],
    [null, "invalid_redirect_uri"],
    [Array.from({ length: 11 }, (_, i) => `https://claude.ai/cb${i}`), "invalid_redirect_uri"],
    [[CLAUDE_REDIRECT, CLAUDE_REDIRECT], "invalid_redirect_uri"],
  ];
  for (const [uris, code] of bad) {
    const res = await register(t, uris);
    assert.equal(res.status, 400, JSON.stringify(uris));
    assert.equal(res.body.error, code);
    assert.ok(res.body.error_description);
  }
  assert.equal((await register(t, [CLAUDE_REDIRECT], { grant_types: ["client_credentials"] })).body.error, "invalid_client_metadata");
  assert.equal((await register(t, [CLAUDE_REDIRECT], { response_types: ["token"] })).body.error, "invalid_client_metadata");
  assert.equal((await register(t, [CLAUDE_REDIRECT], { token_endpoint_auth_method: "private_key_jwt" })).body.error, "invalid_client_metadata");
  // A client asking for a secret method is still registered, as a public client.
  const secretAsked = await register(t, [CLAUDE_REDIRECT], { token_endpoint_auth_method: "client_secret_post" });
  assert.equal(secretAsked.status, 201);
  assert.equal(secretAsked.body.token_endpoint_auth_method, "none");
  const bad_json = await raw(t, "POST", "/oauth/register", { headers: { "content-type": "application/json" }, body: "nope" });
  assert.equal(bad_json.status, 400);
  const events = await t.sql("SELECT type FROM events WHERE entity = 'mcp_client'");
  assert.ok(events.length >= 5 && events.every(e => e.type === "mcp.client_registered"));
});

test("the full PKCE code flow issues abo_ tokens that sign the buyer in on /api routes", async () => {
  const t = await testEnv();
  const flow = await connect(t);
  assert.equal(flow.back.origin + flow.back.pathname, CLAUDE_REDIRECT);
  assert.equal(flow.back.searchParams.get("state"), "st-123");
  assert.equal(flow.back.searchParams.get("iss"), ORIGIN);
  assert.equal(flow.tokens.status, 200, JSON.stringify(flow.tokens.body));
  const tok = flow.tokens.body;
  assert.match(tok.access_token, /^abo_[a-f0-9]{64}$/);
  assert.match(tok.refresh_token, /^abo_[a-f0-9]{64}$/);
  assert.notEqual(tok.access_token, tok.refresh_token);
  assert.equal(tok.token_type, "Bearer");
  assert.equal(tok.expires_in, 3600);
  assert.equal(tok.scope, "marketplace:read marketplace:order");
  assert.equal(flow.tokens.res.headers.get("cache-control"), "no-store");

  const me = await mcpCall(t, { headers: { authorization: `Bearer ${tok.access_token}` } });
  assert.equal(me.status, 200);
  // An AI app's token never signs in on the website API, so it cannot reach staff, studio or browser-only routes.
  assert.equal((await t.api("GET", "/api/me", { headers: { authorization: `Bearer ${tok.access_token}` } })).status, 401);
  // The refresh token is not an access token.
  assert.equal((await mcpCall(t, { headers: { authorization: `Bearer ${tok.refresh_token}` } })).status, 401);

  const [grant] = await t.sql("SELECT * FROM mcp_grants");
  assert.equal(grant.user_id, "user_buyer");
  assert.equal(grant.scope, "marketplace:read marketplace:order");
  assert.equal(grant.resource, RESOURCE);
  const types = (await t.sql("SELECT type FROM events WHERE type LIKE 'mcp.%' ORDER BY seq")).map(e => e.type);
  assert.deepEqual(types, ["mcp.client_registered", "mcp.connection_approved", "mcp.connected"]);

  // The consent request is single use.
  const again = await t.api("POST", "/api/oauth/approve", { user: "user_buyer", body: { request_id: flow.requestId, approve: true } });
  assert.equal(again.status, 404);
});

test("the consent page data names the app, its redirect host and the scopes in plain words", async () => {
  const t = await testEnv();
  const reg = await register(t);
  const { challenge } = await pkce();
  const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: CLAUDE_REDIRECT, code_challenge: challenge, code_challenge_method: "S256", state: "s" }));
  const requestId = new URL(auth.res.headers.get("location")!).searchParams.get("request")!;
  assert.equal((await t.api("GET", `/api/oauth/requests/${requestId}`)).status, 401);
  const req = await t.api("GET", `/api/oauth/requests/${requestId}`, { user: "user_buyer" });
  assert.equal(req.status, 200);
  assert.equal(req.body.client_name, "Claude");
  assert.equal(req.body.redirect_host, "claude.ai");
  assert.equal(req.body.asks_to_order, true);
  assert.equal(req.body.can_hire, false, "INVITE_ONLY is on in tests and this person has no invite code");
  assert.deepEqual(req.body.scopes.map((s: any) => s.id), ["marketplace:read", "marketplace:order"]);
  assert.ok(req.body.scopes.every((s: any) => s.label && s.detail));
  // Hiring is free: the consent words never mention money or a beta.
  for (const s of req.body.scopes) assert.doesNotMatch(`${s.label} ${s.detail}`, /\$|price|quote|charge|beta|order/i);
  // With open hiring (every real environment), anyone signed in can hire.
  const open = await testEnv({ INVITE_ONLY: "false" });
  const reg2 = await register(open);
  const auth2 = await open.api("GET", authorizePath({ response_type: "code", client_id: reg2.body.client_id, redirect_uri: CLAUDE_REDIRECT, code_challenge: challenge, code_challenge_method: "S256", state: "s" }));
  const id2 = new URL(auth2.res.headers.get("location")!).searchParams.get("request")!;
  assert.equal((await open.api("GET", `/api/oauth/requests/${id2}`, { user: "user_buyer" })).body.can_hire, true);
  assert.equal((await t.api("GET", "/api/oauth/requests/oar_nope", { user: "user_buyer" })).status, 404);
});

test("authorize refuses bad requests without redirecting to unknown places", async () => {
  const t = await testEnv();
  const reg = await register(t);
  const clientId = reg.body.client_id;
  const { challenge } = await pkce();
  const base = { response_type: "code", client_id: clientId, redirect_uri: CLAUDE_REDIRECT, code_challenge: challenge, code_challenge_method: "S256", state: "s1" };
  const go = async (params: Record<string, string | undefined>) => new URL((await t.api("GET", authorizePath(params))).res.headers.get("location")!);

  const unknown = await go({ ...base, client_id: "mcpc_nope" });
  assert.equal(unknown.pathname, "/oauth/consent");
  assert.equal(unknown.searchParams.get("error"), "unknown_client");
  const wrongRedirect = await go({ ...base, redirect_uri: "https://evil.example/cb" });
  assert.equal(wrongRedirect.origin, ORIGIN);
  assert.equal(wrongRedirect.searchParams.get("error"), "bad_redirect");

  const cases: [Record<string, string | undefined>, string][] = [
    [{ ...base, code_challenge: undefined }, "invalid_request"],
    [{ ...base, code_challenge_method: "plain" }, "invalid_request"],
    [{ ...base, code_challenge: "short" }, "invalid_request"],
    [{ ...base, response_type: "token" }, "unsupported_response_type"],
    [{ ...base, resource: "https://other.example/mcp" }, "invalid_target"],
  ];
  for (const [params, error] of cases) {
    const back = await go(params);
    assert.equal(back.origin + back.pathname, CLAUDE_REDIRECT, error);
    assert.equal(back.searchParams.get("error"), error);
    assert.equal(back.searchParams.get("state"), "s1");
    assert.equal(back.searchParams.get("code"), null);
  }
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM mcp_auth_requests"))[0].n, 0);
});

test("a local app may use any port on its loopback redirect", async () => {
  const t = await testEnv();
  const flow = await connect(t, { redirect: "http://127.0.0.1:33418/callback" });
  assert.equal(flow.tokens.status, 200);
  const reg = await register(t, ["http://127.0.0.1:1000/callback"]);
  const { challenge } = await pkce();
  const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: "http://127.0.0.1:51234/callback", code_challenge: challenge, code_challenge_method: "S256" }));
  assert.ok(new URL(auth.res.headers.get("location")!).searchParams.get("request"));
  const otherPath = await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: "http://127.0.0.1:51234/other", code_challenge: challenge, code_challenge_method: "S256" }));
  assert.equal(new URL(otherPath.res.headers.get("location")!).searchParams.get("error"), "bad_redirect");
});

const CURSOR_REDIRECT = "cursor://anysphere.cursor-mcp/oauth/callback";

test("desktop apps may register their own link type (RFC 8252), never script, data or file addresses", async () => {
  const t = await testEnv();
  for (const uri of [CURSOR_REDIRECT, "com.example.app:/oauth2redirect", "com.example.app://callback", "vscode://vscode.github-authentication/did-authenticate", "io.github.someone.tool:/cb?x=1"]) {
    const res = await register(t, [uri]);
    assert.equal(res.status, 201, `${uri}: ${JSON.stringify(res.body)}`);
    assert.deepEqual(res.body.redirect_uris, [uri]);
  }
  const bad = [
    "javascript:alert(1)", "JavaScript:alert(1)", "data:text/html,<script>alert(1)</script>", "file:///etc/passwd", "vbscript:msgbox(1)",
    "chrome-extension://abcdef/cb", "ftp://example.com/cb", "myapp:/callback", "com.example.app:callback", "cursor://user:pw@anysphere.cursor-mcp/cb",
    "cursor://anysphere.cursor-mcp/cb#frag", "com.example.app:/cb?state=1", "http://claude.ai/cb", "https://claude.ai/a b", "https://claude.ai\\@evil.example/cb",
  ];
  for (const uri of bad) {
    const res = await register(t, [uri]);
    assert.equal(res.status, 400, uri);
    assert.equal(res.body.error, "invalid_redirect_uri", uri);
    assert.ok(res.body.error_description, uri);
  }
  assert.match((await register(t, ["javascript:alert(1)"])).body.error_description, /javascript: address cannot be a redirect URI/);
  assert.match((await register(t, ["myapp:/callback"])).body.error_description, /domain name you own, written in reverse, such as com\.example\.app:\/callback/);
  assert.match((await register(t, ["http://claude.ai/cb"])).body.error_description, /Use https for a website/);
  // One bad address refuses the whole registration.
  const before = (await t.sql("SELECT COUNT(*) AS n FROM mcp_clients"))[0].n;
  assert.equal((await register(t, [CLAUDE_REDIRECT, "data:text/html,hi"])).status, 400);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM mcp_clients"))[0].n, before);
  const [event] = await t.sql("SELECT data FROM events WHERE entity = 'mcp_client' AND entity_id = (SELECT client_id FROM mcp_clients WHERE redirect_uris = ?)", JSON.stringify([CURSOR_REDIRECT]));
  assert.deepEqual(JSON.parse(event.data).redirect_hosts, ["cursor://"]);
});

test("a desktop app with its own link type connects end to end, with exact matching only", async () => {
  const t = await testEnv();
  const flow = await connect(t, { redirect: CURSOR_REDIRECT });
  assert.equal(flow.tokens.status, 200, JSON.stringify(flow.tokens.body));
  assert.equal(`${flow.back.protocol}//${flow.back.host}${flow.back.pathname}`, CURSOR_REDIRECT);
  assert.match(flow.back.searchParams.get("code")!, /^[a-f0-9]{64}$/);
  assert.equal(flow.back.searchParams.get("state"), "st-123");
  assert.equal(flow.back.searchParams.get("iss"), ORIGIN);
  assert.equal((await mcpCall(t, { headers: { authorization: `Bearer ${flow.tokens.body.access_token}` } })).status, 200);

  // No loopback-style relaxing: another path, host or app is refused before anything is stored.
  const reg = await register(t, [CURSOR_REDIRECT]);
  const { challenge } = await pkce();
  const pending = (await t.sql("SELECT COUNT(*) AS n FROM mcp_auth_requests"))[0].n;
  for (const other of ["cursor://anysphere.cursor-mcp/oauth/other", "cursor://evil.example/oauth/callback", "vscode://anysphere.cursor-mcp/oauth/callback", "CURSOR://anysphere.cursor-mcp/oauth/callback"]) {
    const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: other, code_challenge: challenge, code_challenge_method: "S256" }));
    assert.equal(auth.status, 302, other);
    const location = new URL(auth.res.headers.get("location")!);
    assert.equal(location.origin + location.pathname, `${ORIGIN}/oauth/consent`, other);
    assert.equal(location.searchParams.get("error"), "bad_redirect", other);
  }
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM mcp_auth_requests"))[0].n, pending);

  // The reverse-domain form with a single slash works too.
  const reverse = await connect(t, { redirect: "com.example.app:/oauth2redirect" });
  assert.equal(reverse.tokens.status, 200);
  assert.equal(reverse.back.protocol, "com.example.app:");
  assert.equal(reverse.back.pathname, "/oauth2redirect");
  assert.ok(reverse.back.searchParams.get("code"));

  // The Connect page names the link type instead of a host.
  const list = await t.api("GET", "/api/oauth/connections", { user: "user_buyer" });
  assert.deepEqual(list.body.connections.map((c: any) => c.redirect_host).sort(), ["com.example.app:", "cursor://"]);
});

test("the consent page data shows where the person is sent: a website, a local app or an app link", async () => {
  const t = await testEnv();
  const cases: [string, string, string][] = [
    [CLAUDE_REDIRECT, "web", "claude.ai"],
    ["http://127.0.0.1:33418/callback", "local", "127.0.0.1:33418"],
    [CURSOR_REDIRECT, "app", "cursor://"],
    ["com.example.app:/oauth2redirect", "app", "com.example.app:"],
  ];
  for (const [uri, kind, host] of cases) {
    const reg = await register(t, [uri]);
    const { challenge } = await pkce();
    const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: uri, code_challenge: challenge, code_challenge_method: "S256" }));
    const requestId = new URL(auth.res.headers.get("location")!).searchParams.get("request")!;
    const req = await t.api("GET", `/api/oauth/requests/${requestId}`, { user: "user_buyer" });
    assert.equal(req.status, 200, uri);
    assert.equal(req.body.redirect_kind, kind, uri);
    assert.equal(req.body.redirect_host, host, uri);
    assert.equal(req.body.redirect_uri, uri);
  }
});

test("a wrong PKCE verifier is rejected and a reused code turns the connection off", async () => {
  const t = await testEnv();
  const reg = await register(t);
  const clientId = reg.body.client_id;
  const { verifier, challenge } = await pkce();
  const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: clientId, redirect_uri: CLAUDE_REDIRECT, code_challenge: challenge, code_challenge_method: "S256", state: "s" }));
  const requestId = new URL(auth.res.headers.get("location")!).searchParams.get("request")!;
  const approved = await t.api("POST", "/api/oauth/approve", { user: "user_buyer", body: { request_id: requestId, approve: true } });
  const code = new URL(approved.body.redirect_url).searchParams.get("code")!;
  const exchange = (fields: Record<string, string>) => form(t, "/oauth/token", { grant_type: "authorization_code", code, client_id: clientId, redirect_uri: CLAUDE_REDIRECT, code_verifier: verifier, ...fields });

  const wrong = await exchange({ code_verifier: (await pkce()).verifier });
  assert.equal(wrong.status, 400);
  assert.equal(wrong.body.error, "invalid_grant");
  assert.equal((await exchange({ code_verifier: "too-short" })).body.error, "invalid_grant");
  assert.equal((await exchange({ redirect_uri: "https://claude.ai/other" })).body.error, "invalid_grant");
  const other = await register(t);
  assert.equal((await exchange({ client_id: other.body.client_id })).body.error, "invalid_grant");
  assert.equal((await exchange({ client_id: "mcpc_unknown" })).body.error, "invalid_client");

  // The right verifier still works: a failed try does not burn the code.
  const ok = await exchange({});
  assert.equal(ok.status, 200);
  const access = ok.body.access_token;
  assert.equal((await mcpCall(t, { headers: { authorization: `Bearer ${access}` } })).status, 200);

  const reused = await exchange({});
  assert.equal(reused.status, 400);
  assert.equal(reused.body.error, "invalid_grant");
  assert.equal((await mcpCall(t, { headers: { authorization: `Bearer ${access}` } })).status, 401);
  const revoked = await t.sql("SELECT type, data FROM events WHERE type = 'mcp.connection_revoked'");
  assert.equal(JSON.parse(revoked[0].data).reason, "code_reused");
});

test("an expired code is refused", async () => {
  const t = await testEnv();
  const reg = await register(t);
  const { verifier, challenge } = await pkce();
  const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: CLAUDE_REDIRECT, code_challenge: challenge, code_challenge_method: "S256" }));
  const requestId = new URL(auth.res.headers.get("location")!).searchParams.get("request")!;
  const approved = await t.api("POST", "/api/oauth/approve", { user: "user_buyer", body: { request_id: requestId, approve: true } });
  const code = new URL(approved.body.redirect_url).searchParams.get("code")!;
  // No state was sent, so none comes back.
  assert.equal(new URL(approved.body.redirect_url).searchParams.get("state"), null);
  await t.sql("UPDATE mcp_codes SET expires_at = '2000-01-01T00:00:00.000Z'");
  const res = await form(t, "/oauth/token", { grant_type: "authorization_code", code, client_id: reg.body.client_id, redirect_uri: CLAUDE_REDIRECT, code_verifier: verifier });
  assert.equal(res.body.error, "invalid_grant");
});

test("deny sends the app access_denied and no code", async () => {
  const t = await testEnv();
  const reg = await register(t);
  const { challenge } = await pkce();
  const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: CLAUDE_REDIRECT, code_challenge: challenge, code_challenge_method: "S256", state: "s9" }));
  const requestId = new URL(auth.res.headers.get("location")!).searchParams.get("request")!;
  const denied = await t.api("POST", "/api/oauth/approve", { user: "user_buyer", body: { request_id: requestId, approve: false } });
  assert.equal(denied.status, 200);
  const back = new URL(denied.body.redirect_url);
  assert.equal(back.searchParams.get("error"), "access_denied");
  assert.equal(back.searchParams.get("state"), "s9");
  assert.equal(back.searchParams.get("code"), null);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM mcp_codes"))[0].n, 0);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM events WHERE type = 'mcp.connection_denied'"))[0].n, 1);
});

test("only a signed-in person on the website can approve; an AI app's own token cannot", async () => {
  const t = await testEnv();
  const flow = await connect(t);
  const reg = await register(t);
  const { challenge } = await pkce();
  const auth = await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: CLAUDE_REDIRECT, code_challenge: challenge, code_challenge_method: "S256" }));
  const requestId = new URL(auth.res.headers.get("location")!).searchParams.get("request")!;
  const bearer = { authorization: `Bearer ${flow.tokens.body.access_token}` };
  assert.equal((await t.api("POST", "/api/oauth/approve", { body: { request_id: requestId, approve: true } })).status, 401);
  assert.equal((await t.api("POST", "/api/oauth/approve", { headers: bearer, body: { request_id: requestId, approve: true } })).status, 401);
  assert.equal((await t.api("GET", `/api/oauth/requests/${requestId}`, { headers: bearer })).status, 401);
  assert.equal((await t.api("GET", "/api/oauth/connections", { headers: bearer })).status, 401);
  assert.equal((await t.api("POST", "/api/oauth/approve", { user: "user_buyer", headers: { origin: "https://evil.example" }, body: { request_id: requestId, approve: true } })).status, 403);
  // The request survives those refusals and still works for the person.
  assert.equal((await t.api("POST", "/api/oauth/approve", { user: "user_buyer", body: { request_id: requestId, approve: true } })).status, 200);
});

test("the buyer can turn ordering off; scopes are normalised", async () => {
  const t = await testEnv();
  const readOnly = await connect(t, { allowOrder: false });
  assert.equal(readOnly.tokens.body.scope, "marketplace:read");
  const asked = await connect(t, { scope: "marketplace:order" });
  assert.equal(asked.tokens.body.scope, "marketplace:read marketplace:order");
  const odd = await connect(t, { scope: "openid marketplace:read offline_access" });
  assert.equal(odd.tokens.body.scope, "marketplace:read");
});

test("refresh tokens rotate, and a reused refresh token turns the connection off", async () => {
  const t = await testEnv();
  const flow = await connect(t);
  const first = flow.tokens.body;
  const refresh = (token: string, extra: Record<string, string> = {}) => form(t, "/oauth/token", { grant_type: "refresh_token", refresh_token: token, client_id: flow.clientId, ...extra });

  const second = await refresh(first.refresh_token);
  assert.equal(second.status, 200, JSON.stringify(second.body));
  assert.match(second.body.access_token, /^abo_/);
  assert.notEqual(second.body.refresh_token, first.refresh_token);
  assert.equal(second.body.scope, first.scope);
  // Old access tokens keep working until they expire; the new one works too.
  for (const tok of [first.access_token, second.body.access_token]) {
    assert.equal((await mcpCall(t, { headers: { authorization: `Bearer ${tok}` } })).status, 200);
  }
  // JSON bodies and HTTP Basic client ids are accepted too.
  const third = await t.api("POST", "/oauth/token", { headers: { authorization: `Basic ${btoa(`${flow.clientId}:`)}` }, body: { grant_type: "refresh_token", refresh_token: second.body.refresh_token } });
  assert.equal(third.status, 200, JSON.stringify(third.body));

  const other = await register(t);
  assert.equal((await refresh(third.body.refresh_token, { client_id: other.body.client_id })).body.error, "invalid_grant");
  assert.equal((await refresh(third.body.refresh_token, { scope: "marketplace:read" })).body.error, "invalid_scope");
  assert.equal((await refresh("abo_" + "0".repeat(64))).body.error, "invalid_grant");

  // Replaying an already-rotated refresh token revokes the whole connection.
  const replay = await refresh(first.refresh_token);
  assert.equal(replay.status, 400);
  assert.equal(replay.body.error, "invalid_grant");
  assert.equal((await mcpCall(t, { headers: { authorization: `Bearer ${third.body.access_token}` } })).status, 401);
  assert.equal((await refresh(third.body.refresh_token)).body.error, "invalid_grant");
  const [grant] = await t.sql("SELECT revoked_at FROM mcp_grants");
  assert.ok(grant.revoked_at);
  assert.equal((await form(t, "/oauth/token", { grant_type: "password", client_id: flow.clientId })).body.error, "unsupported_grant_type");
});

test("tokens and codes are stored only as SHA-256 hashes", async () => {
  const t = await testEnv();
  const flow = await connect(t);
  const { access_token, refresh_token } = flow.tokens.body;
  const tokens = await t.sql("SELECT * FROM mcp_tokens ORDER BY kind");
  assert.equal(tokens.length, 2);
  const hashes = new Set(tokens.map(r => r.token_hash));
  assert.ok(hashes.has(await sha256Hex(access_token)));
  assert.ok(hashes.has(await sha256Hex(refresh_token)));
  const everything = JSON.stringify([tokens, await t.sql("SELECT * FROM mcp_codes"), await t.sql("SELECT * FROM mcp_grants"), await t.sql("SELECT * FROM events")]);
  for (const secret of [access_token, refresh_token, access_token.slice(4), flow.code]) assert.ok(!everything.includes(secret));
  const [code] = await t.sql("SELECT code_hash, consumed_at FROM mcp_codes");
  assert.equal(code.code_hash, await sha256Hex(flow.code));
  assert.ok(code.consumed_at);
});

test("access tokens expire after an hour and can be revoked by the app or the buyer", async () => {
  const t = await testEnv();
  const flow = await connect(t);
  const bearer = (tok: string) => ({ authorization: `Bearer ${tok}` });
  const [access] = await t.sql("SELECT created_at, expires_at FROM mcp_tokens WHERE kind = 'access'");
  assert.equal(Date.parse(access.expires_at) - Date.parse(access.created_at), 3600_000);
  const [refresh] = await t.sql("SELECT created_at, expires_at FROM mcp_tokens WHERE kind = 'refresh'");
  assert.equal(Date.parse(refresh.expires_at) - Date.parse(refresh.created_at), 30 * 86400_000);

  await t.sql("UPDATE mcp_tokens SET expires_at = '2000-01-01T00:00:00.000Z' WHERE kind = 'access'");
  assert.equal((await mcpCall(t, { headers: bearer(flow.tokens.body.access_token) })).status, 401);

  // The app revokes its own connection (RFC 7009).
  const second = await connect(t);
  assert.equal((await mcpCall(t, { headers: bearer(second.tokens.body.access_token) })).status, 200);
  const rev = await form(t, "/oauth/revoke", { token: second.tokens.body.refresh_token, client_id: second.clientId });
  assert.equal(rev.status, 200);
  assert.equal((await mcpCall(t, { headers: bearer(second.tokens.body.access_token) })).status, 401);
  assert.equal((await form(t, "/oauth/revoke", { token: "abo_unknown" })).status, 200);

  // The buyer disconnects an app on the Connect page.
  const third = await connect(t);
  const list = await t.api("GET", "/api/oauth/connections", { user: "user_buyer" });
  assert.equal(list.status, 200);
  assert.equal(list.body.connections.length, 2); // the first (expired access, live refresh) and the third
  const live = list.body.connections[0];
  assert.equal(live.client_name, "Claude");
  assert.equal(live.redirect_host, "claude.ai");
  assert.equal((await t.api("POST", `/api/oauth/connections/${live.id}/revoke`, { user: "someone_else" })).status, 404);
  assert.equal((await t.api("POST", `/api/oauth/connections/${live.id}/revoke`, { user: "user_buyer" })).status, 200);
  assert.equal((await mcpCall(t, { headers: bearer(third.tokens.body.access_token) })).status, 401);
  assert.equal((await t.api("GET", "/api/oauth/connections", { user: "user_buyer" })).body.connections.length, 1);
});

test("/mcp answers 401 with a pointer to the protected-resource metadata", async () => {
  const t = await testEnv();
  const init = { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } } };
  const anon = await t.api("POST", "/mcp", { body: init });
  assert.equal(anon.status, 401);
  const challenge = anon.res.headers.get("www-authenticate")!;
  assert.match(challenge, /^Bearer /);
  assert.ok(challenge.includes(`resource_metadata="${ORIGIN}/.well-known/oauth-protected-resource"`));
  assert.ok(!challenge.includes("invalid_token"));
  assert.equal(anon.res.headers.get("access-control-expose-headers")?.includes("www-authenticate"), true);

  const badToken = await t.api("POST", "/mcp", { headers: { authorization: `Bearer abo_${"f".repeat(64)}` }, body: init });
  assert.equal(badToken.status, 401);
  assert.ok(badToken.res.headers.get("www-authenticate")!.includes('error="invalid_token"'));
  // A website sign-in (here the test header) is not an MCP connection.
  assert.equal((await t.api("POST", "/mcp", { user: "user_buyer", body: init })).status, 401);

  const flow = await connect(t);
  const ok = await t.api("POST", "/mcp", { headers: { authorization: `Bearer ${flow.tokens.body.access_token}` }, body: init });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.result.protocolVersion, "2025-06-18");
  assert.equal((await t.api("GET", "/mcp", { headers: { authorization: `Bearer ${flow.tokens.body.access_token}` } })).status, 405);
});

test("the cron removes expired requests, codes and tokens", async () => {
  const t = await testEnv();
  await connect(t);
  const reg = await register(t);
  const { challenge } = await pkce();
  await t.api("GET", authorizePath({ response_type: "code", client_id: reg.body.client_id, redirect_uri: CLAUDE_REDIRECT, code_challenge: challenge, code_challenge_method: "S256" }));
  await t.sql("UPDATE mcp_auth_requests SET expires_at = '2000-01-01T00:00:00.000Z'");
  await t.sql("UPDATE mcp_codes SET expires_at = '2000-01-01T00:00:00.000Z'");
  await t.sql("UPDATE mcp_tokens SET expires_at = '2000-01-01T00:00:00.000Z' WHERE kind = 'access'");
  await t.scheduled();
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM mcp_auth_requests"))[0].n, 0);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM mcp_codes"))[0].n, 0);
  assert.deepEqual((await t.sql("SELECT kind FROM mcp_tokens")).map(r => r.kind), ["refresh"]);
});

test("the consent page shell is served by the Worker and cannot be framed", async () => {
  const t = await testEnv({ ASSETS: { fetch: async (req: Request) => new Response(`<html>${new URL(req.url).pathname}</html>`, { headers: { "content-type": "text/html" } }) } });
  const res = await raw(t, "GET", "/oauth/consent?request=oar_x");
  assert.equal(res.status, 200);
  assert.equal(res.body, "<html>/</html>");
  assert.equal(res.res.headers.get("x-frame-options"), "DENY");
  assert.match(res.res.headers.get("content-security-policy")!, /frame-ancestors 'none'/);
});
