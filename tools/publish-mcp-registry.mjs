// Publish server.json to the official MCP Registry (registry.modelcontextprotocol.io) under com.useaiblocks/*.
//
//   node tools/publish-mcp-registry.mjs check      what the registry lists for us now, and whether the live proof matches
//   node tools/publish-mcp-registry.mjs publish    sign in with our domain key, then publish server.json
//
// Sign-in is the registry's HTTP domain method: it fetches https://useaiblocks.com/.well-known/mcp-registry-auth
// (served by site/src/server/public-api.ts) and checks an Ed25519 signature over the current RFC 3339 time.
// The private key lives OUTSIDE the repo, in .mcp-registry-ed25519.pem next to the repo folder (override with
// MCP_REGISTRY_KEY). Never commit it; if it is lost, make a new pair and change MCP_REGISTRY_RECORD.
// Bump "version" in server.json for every publish: the registry refuses a version it already has.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = "https://registry.modelcontextprotocol.io";
const DOMAIN = "useaiblocks.com";
const server = JSON.parse(fs.readFileSync(path.join(ROOT, "server.json"), "utf8"));
const keyFile = process.env.MCP_REGISTRY_KEY || path.resolve(ROOT, "../.mcp-registry-ed25519.pem");

async function liveProof() {
  const res = await fetch(`https://${DOMAIN}/.well-known/mcp-registry-auth`, { redirect: "manual", headers: { accept: "text/plain", "user-agent": "mcp-registry/1.0" } });
  const text = (await res.text()).trim();
  return { status: res.status, key: text.match(/^v=MCPv1;\s*k=ed25519;\s*p=([A-Za-z0-9+/=]+)$/)?.[1] ?? null, text };
}

function localKey() {
  if (!fs.existsSync(keyFile)) throw new Error(`No private key at ${keyFile}.`);
  const privateKey = crypto.createPrivateKey(fs.readFileSync(keyFile));
  const publicB64 = crypto.createPublicKey(privateKey).export({ format: "der", type: "spki" }).subarray(-32).toString("base64");
  return { privateKey, publicB64 };
}

async function listed() {
  const res = await fetch(`${REGISTRY}/v0/servers?search=${encodeURIComponent(server.name)}`, { headers: { accept: "application/json" } });
  const body = await res.json().catch(() => ({}));
  return (body.servers ?? []).filter((s) => (s.server ?? s).name === server.name).map((s) => ({ version: (s.server ?? s).version, meta: s._meta ?? (s.server ?? s)._meta }));
}

const cmd = process.argv[2];
if (cmd === "check") {
  const proof = await liveProof(), { publicB64 } = localKey();
  console.log(JSON.stringify({ proof_status: proof.status, proof_matches_local_key: proof.key === publicB64, listed: await listed() }, null, 2));
} else if (cmd === "publish") {
  const { privateKey, publicB64 } = localKey(), proof = await liveProof();
  if (proof.status !== 200 || proof.key !== publicB64) throw new Error(`Live proof ${proof.status} does not match the local key; deploy the site first.`);
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const signed_timestamp = crypto.sign(null, Buffer.from(timestamp), privateKey).toString("hex");
  const auth = await fetch(`${REGISTRY}/v0/auth/http`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ domain: DOMAIN, timestamp, signed_timestamp }) });
  const authBody = await auth.json().catch(() => ({}));
  const token = authBody.registry_token ?? authBody.token;
  if (!auth.ok || !token) throw new Error(`Sign-in failed (${auth.status}): ${JSON.stringify(authBody).slice(0, 500)}`);
  const pub = await fetch(`${REGISTRY}/v0/publish`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify(server) });
  const text = await pub.text();
  console.log(pub.status, text.slice(0, 2000));
  if (!pub.ok) process.exit(1);
} else {
  console.log("Usage: node tools/publish-mcp-registry.mjs check|publish");
  process.exit(2);
}
