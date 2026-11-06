// Live protocol check for the MCP connector: what an AI app (Claude, ChatGPT, Cursor) sees before anyone signs in.
// No user session, no tokens, no model calls. The only thing it leaves behind is one test app registration
// (POST /oauth/register), because there is no route to delete a registration. It prints that client_id at the end.
//
//   node scripts/mcp-smoke.mjs                                         staging (https://agents-staging.useaiblocks.com)
//   node scripts/mcp-smoke.mjs --base https://agents.useaiblocks.com   another server (also MCP_SMOKE_BASE=...)
//
// Checks: both discovery documents; CORS preflight on /mcp; POST /mcp without a token is a 401 whose
// WWW-Authenticate points at the protected-resource metadata; a made-up token is invalid_token; registration
// refuses bad redirect URIs and accepts a good one (with a cursor:// app link when the server supports it);
// authorize and token refuse bad requests for that app without storing anything.
const args = process.argv.slice(2);
const flag = name => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const base = new URL(flag("--base") ?? process.env.MCP_SMOKE_BASE ?? args.find(a => /^https?:\/\//.test(a)) ?? "https://agents-staging.useaiblocks.com").origin;
const mcpUrl = `${base}/mcp`;
const TIMEOUT_MS = 20_000;
const LOOPBACK_REDIRECT = "http://127.0.0.1:8976/mcp-smoke/callback";
const APP_REDIRECT = "cursor://anysphere.cursor-mcp/oauth/callback";
const ORIGIN_HEADER = "https://claude.ai";

let passed = 0, failed = 0, warned = 0;
const pass = (name, detail = "") => { passed++; console.log(`PASS  ${name}${detail ? `: ${detail}` : ""}`); };
const fail = (name, detail) => { failed++; console.log(`FAIL  ${name}: ${detail}`); };
const warn = (name, detail) => { warned++; console.log(`WARN  ${name}: ${detail}`); };

async function request(method, path, o = {}) {
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const res = await fetch(url, { method, headers: o.headers, body: o.body, redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS) });
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { status: res.status, headers: res.headers, body };
}

/** Runs one named check; a thrown error (network, timeout, assertion) is a failure with its message. */
async function check(name, work) {
  try { const detail = await work(); pass(name, typeof detail === "string" ? detail : ""); }
  catch (err) { fail(name, err instanceof Error ? err.message : String(err)); }
}
function expect(cond, message) { if (!cond) throw new Error(message); }
const list = header => (header ?? "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

console.log(`MCP smoke check against ${base}\n`);

// ---------- Discovery ----------

let issuer = base;
await check("authorization server metadata (/.well-known/oauth-authorization-server)", async () => {
  const r = await request("GET", "/.well-known/oauth-authorization-server");
  expect(r.status === 200, `HTTP ${r.status}`);
  const m = r.body;
  expect(m && typeof m === "object", "not JSON");
  expect(m.issuer === base, `issuer is ${m.issuer}, expected ${base}`);
  issuer = m.issuer;
  for (const key of ["authorization_endpoint", "token_endpoint", "registration_endpoint"]) {
    expect(typeof m[key] === "string" && m[key].startsWith(`${base}/`), `${key} is ${m[key]}`);
  }
  expect((m.code_challenge_methods_supported ?? []).includes("S256"), "S256 PKCE not listed");
  expect((m.response_types_supported ?? []).includes("code"), "response type code not listed");
  expect(["authorization_code", "refresh_token"].every(g => (m.grant_types_supported ?? []).includes(g)), "grant types missing");
  expect((m.token_endpoint_auth_methods_supported ?? []).includes("none"), "public clients (none) not listed");
  expect(r.headers.get("access-control-allow-origin") === "*", "no CORS allow-origin");
  return `scopes ${(m.scopes_supported ?? []).join(" ")}`;
});

for (const path of ["/.well-known/oauth-protected-resource", "/.well-known/oauth-protected-resource/mcp"]) {
  await check(`protected resource metadata (${path})`, async () => {
    const r = await request("GET", path);
    expect(r.status === 200, `HTTP ${r.status}`);
    expect(r.body?.resource === mcpUrl, `resource is ${r.body?.resource}, expected ${mcpUrl}`);
    expect((r.body.authorization_servers ?? []).includes(issuer), `authorization_servers ${JSON.stringify(r.body.authorization_servers)} misses ${issuer}`);
    expect((r.body.bearer_methods_supported ?? ["header"]).includes("header"), "bearer header method not listed");
    return `resource ${r.body.resource}`;
  });
}

// ---------- /mcp before sign-in ----------

await check("CORS preflight on /mcp", async () => {
  const r = await request("OPTIONS", "/mcp", { headers: { origin: ORIGIN_HEADER, "access-control-request-method": "POST", "access-control-request-headers": "authorization, content-type, mcp-protocol-version" } });
  expect(r.status >= 200 && r.status < 300, `HTTP ${r.status}`);
  const allowOrigin = r.headers.get("access-control-allow-origin");
  expect(allowOrigin === "*" || allowOrigin === ORIGIN_HEADER, `allow-origin is ${allowOrigin}`);
  expect(list(r.headers.get("access-control-allow-methods")).includes("post"), `allow-methods is ${r.headers.get("access-control-allow-methods")}`);
  const headers = list(r.headers.get("access-control-allow-headers"));
  for (const h of ["authorization", "content-type", "mcp-protocol-version"]) expect(headers.includes(h), `allow-headers misses ${h}`);
  return `HTTP ${r.status}, allow-origin ${allowOrigin}`;
});

const INIT = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "ai-blocks-mcp-smoke", version: "1" } } });
const MCP_HEADERS = { "content-type": "application/json", accept: "application/json, text/event-stream", origin: ORIGIN_HEADER };

await check("POST /mcp without a token is 401 and points at the resource metadata", async () => {
  const r = await request("POST", "/mcp", { headers: MCP_HEADERS, body: INIT });
  expect(r.status === 401, `HTTP ${r.status}`);
  const challenge = r.headers.get("www-authenticate") ?? "";
  expect(/^Bearer\s/i.test(challenge), `WWW-Authenticate is "${challenge}"`);
  const meta = /resource_metadata="([^"]+)"/.exec(challenge)?.[1];
  expect(meta, `no resource_metadata in "${challenge}"`);
  expect(meta.startsWith(`${base}/.well-known/oauth-protected-resource`), `resource_metadata is ${meta}`);
  expect(!/error="invalid_token"/.test(challenge), "says invalid_token although no token was sent");
  expect(list(r.headers.get("access-control-expose-headers")).includes("www-authenticate"), "WWW-Authenticate is not exposed to browser apps (access-control-expose-headers)");
  const followed = await request("GET", meta);
  expect(followed.status === 200 && followed.body?.resource === mcpUrl, `the resource_metadata link answers HTTP ${followed.status} with resource ${followed.body?.resource}`);
  return `WWW-Authenticate: ${challenge}`;
});

await check("POST /mcp with a made-up token is 401 invalid_token", async () => {
  const fake = `abo_${"0".repeat(64)}`;
  const r = await request("POST", "/mcp", { headers: { ...MCP_HEADERS, authorization: `Bearer ${fake}` }, body: INIT });
  expect(r.status === 401, `HTTP ${r.status}`);
  expect(/error="invalid_token"/.test(r.headers.get("www-authenticate") ?? ""), `WWW-Authenticate is "${r.headers.get("www-authenticate")}"`);
});

// ---------- Dynamic client registration ----------

const register = redirect_uris => request("POST", "/oauth/register", {
  headers: { "content-type": "application/json", origin: ORIGIN_HEADER },
  body: JSON.stringify({ client_name: "AI Blocks MCP smoke test (safe to delete)", redirect_uris, grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], token_endpoint_auth_method: "none" }),
});

for (const bad of ["javascript:alert(1)", "http://example.com/callback", "data:text/html,hello"]) {
  await check(`registration refuses the redirect URI ${bad}`, async () => {
    const r = await register([bad]);
    expect(r.status === 400, `HTTP ${r.status} ${JSON.stringify(r.body)}`);
    expect(r.body?.error === "invalid_redirect_uri", `error is ${r.body?.error}`);
    expect(typeof r.body.error_description === "string" && r.body.error_description.length > 0, "no error_description");
    return r.body.error_description;
  });
}

let client = null;
await check("registration accepts a good app (one test registration)", async () => {
  let r = await register([LOOPBACK_REDIRECT, APP_REDIRECT]);
  if (r.status === 400 && r.body?.error === "invalid_redirect_uri") {
    // Nothing was stored. The server does not take app links yet; register the loopback address alone.
    warn("custom-scheme redirect (cursor://)", `refused by this server: ${r.body.error_description} Deploy the RFC 8252 change to allow it.`);
    r = await register([LOOPBACK_REDIRECT]);
  } else if (r.status === 201) {
    pass("custom-scheme redirect (cursor://) accepted at registration");
  }
  expect(r.status === 201, `HTTP ${r.status} ${JSON.stringify(r.body)}`);
  expect(/^mcpc_[a-f0-9]{32}$/.test(r.body?.client_id ?? ""), `client_id is ${r.body?.client_id}`);
  expect(r.body.token_endpoint_auth_method === "none", `token_endpoint_auth_method is ${r.body.token_endpoint_auth_method}`);
  expect(Array.isArray(r.body.redirect_uris) && r.body.redirect_uris.includes(LOOPBACK_REDIRECT), "redirect_uris not echoed");
  client = r.body;
  return `client_id ${client.client_id}, redirects ${client.redirect_uris.join(", ")}`;
});

// ---------- Authorize and token refuse bad requests (nothing is stored for any of these) ----------

const authorizeUrl = params => `/oauth/authorize?${new URLSearchParams(params)}`;
const CHALLENGE = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"; // a well-formed S256 challenge

await check("authorize sends an unknown app to the consent page error, not to its redirect", async () => {
  const r = await request("GET", authorizeUrl({ response_type: "code", client_id: "mcpc_00000000000000000000000000000000", redirect_uri: LOOPBACK_REDIRECT, code_challenge: CHALLENGE, code_challenge_method: "S256" }));
  expect(r.status === 302, `HTTP ${r.status}`);
  const loc = new URL(r.headers.get("location"), base);
  expect(loc.origin === base && loc.pathname === "/oauth/consent" && loc.searchParams.get("error") === "unknown_client", `location ${loc}`);
});

if (client) {
  await check("authorize refuses a redirect URI the app did not register", async () => {
    const r = await request("GET", authorizeUrl({ response_type: "code", client_id: client.client_id, redirect_uri: "https://evil.example/callback", code_challenge: CHALLENGE, code_challenge_method: "S256" }));
    expect(r.status === 302, `HTTP ${r.status}`);
    const loc = new URL(r.headers.get("location"), base);
    expect(loc.origin === base && loc.searchParams.get("error") === "bad_redirect", `location ${loc}`);
  });
  await check("authorize requires PKCE S256 and says so on the app's own redirect", async () => {
    const r = await request("GET", authorizeUrl({ response_type: "code", client_id: client.client_id, redirect_uri: LOOPBACK_REDIRECT, state: "smoke" }));
    expect(r.status === 302, `HTTP ${r.status}`);
    const loc = new URL(r.headers.get("location"));
    expect(`${loc.origin}${loc.pathname}` === LOOPBACK_REDIRECT.replace(/\?.*$/, ""), `location ${loc}`);
    expect(loc.searchParams.get("error") === "invalid_request", `error is ${loc.searchParams.get("error")}`);
    expect(loc.searchParams.get("state") === "smoke", "state not returned");
    expect(loc.searchParams.get("iss") === issuer, `iss is ${loc.searchParams.get("iss")}`);
  });
  await check("token refuses a made-up code", async () => {
    const r = await request("POST", "/oauth/token", {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "authorization_code", code: "0".repeat(64), client_id: client.client_id, redirect_uri: LOOPBACK_REDIRECT, code_verifier: "a".repeat(43) }).toString(),
    });
    expect(r.status === 400 && r.body?.error === "invalid_grant", `HTTP ${r.status} ${JSON.stringify(r.body)}`);
  });
}

await check("token refuses an unknown app", async () => {
  const r = await request("POST", "/oauth/token", {
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: `abo_${"0".repeat(64)}`, client_id: "mcpc_00000000000000000000000000000000" }).toString(),
  });
  expect(r.status === 401 && r.body?.error === "invalid_client", `HTTP ${r.status} ${JSON.stringify(r.body)}`);
});

// ---------- Summary ----------

console.log(`\n${passed} passed, ${failed} failed${warned ? `, ${warned} warning${warned === 1 ? "" : "s"}` : ""}.`);
if (client) {
  console.log(`Left behind: one app registration, ${client.client_id} ("${client.client_name}"). There is no route to delete a registration.`);
  const db = base === "https://agents.useaiblocks.com" ? "ai-blocks-agents --env production" : base === "https://agents-staging.useaiblocks.com" ? "ai-blocks-agents-staging --env staging" : "<database> --env <env>";
  console.log(`It has no sign-ins or tokens. To remove it: npx wrangler d1 execute ${db} --remote --command "DELETE FROM mcp_clients WHERE client_id = '${client.client_id}'"`);
}
process.exitCode = failed ? 1 : 0;
