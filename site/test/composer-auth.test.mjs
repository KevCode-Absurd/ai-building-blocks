import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { generateKeyPairSync, createSign } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { authenticateUser, handleAccount } from "../src/server/auth.ts";
import { decodeCatalogue, handleComposer, memoryComposer, d1Composer } from "../src/server/composer.ts";
import { freeSelection } from "../src/lib/composer-core.ts";
import worker from "../src/worker.ts";

const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const env = { CLERK_PUBLISHABLE_KEY: `pk_test_${btoa("clerk.example.test$")}`, CLERK_SECRET_KEY: "sk_test_unit-test-placeholder", CLERK_JWT_KEY: publicKey.export({ type: "spki", format: "pem" }) };
const now = Math.floor(Date.now() / 1000);
const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
function token(patch = {}, signingKey = privateKey) {
  const data = `${encode({ alg: "RS256", typ: "JWT", kid: "test" })}.${encode({ iss: "https://clerk.example.test", sub: "user_alice", sid: "sess_test", azp: "https://example.test", iat: now, nbf: now - 10, exp: now + 300, v: 2, sts: "active", ...patch })}`;
  return data + "." + createSign("RSA-SHA256").update(data).sign(signingKey).toString("base64url");
}
const authRequest = (jwt = token(), path = "/api/auth?usage") => new Request("https://example.test" + path, { headers: { authorization: `Bearer ${jwt}` } });

test("Clerk checks a real signature, application issuer, origin, expiry and session state", async () => {
  assert.equal(await authenticateUser(authRequest(), env), "user_alice");
  const wrongKey = generateKeyPairSync("rsa", { modulusLength: 2048 }).privateKey;
  for (const jwt of ["forged", token({}, wrongKey), token({ exp: now - 120 }), token({ nbf: now + 120 }), token({ iss: "https://other.clerk.accounts.dev" }), token({ azp: "https://attacker.test" }), token({ sts: "pending" })]) {
    const result = await authenticateUser(authRequest(jwt), env);
    assert(result instanceof Response); assert.equal(result.status, 401);
  }
  assert.equal((await authenticateUser(new Request("https://example.test/api/compose", { headers: { "x-user-id": "user_alice" } }), env)).status, 401);
  assert.equal((await authenticateUser(authRequest(), {})).status, 503);
});

test("public config never returns a secret, and usage ignores caller-supplied account IDs", async () => {
  const config = await handleAccount(new Request("https://example.test/api/auth"), { ...env, CLERK_SECRET_KEY: "do-not-expose" }, null);
  assert.equal(config.headers.get("cache-control"), "no-store");
  assert.deepEqual(await config.json(), { configured: true, publishableKey: env.CLERK_PUBLISHABLE_KEY });
  assert.equal((await handleAccount(new Request("https://example.test/api/auth?usage&user_id=user_alice"), env, memoryComposer())).status, 401);
  const store = memoryComposer();
  await store.claim({ id: "one", fingerprint: "f", day: new Date().toISOString().slice(0, 10), ip: "ip", user_id: "user_alice", charge: .03, status: "done", result: "{}" }, 2);
  const own = await handleAccount(authRequest(token({ sub: "user_bob" }), "/api/auth?usage&user_id=user_alice"), env, store);
  assert.deepEqual(await own.json(), { completed: 0, attemptsToday: 0, dailyAttemptLimit: 5, dailyIpAttemptLimit: 10, unlimited: false });
});

const catalogue = decodeCatalogue(JSON.parse(fs.readFileSync("public/data/blocks.json", "utf8")));
const goal = "Build a landing page from scratch";
const modelEnv = { ANTHROPIC_API_KEY: "unit-test-only", WORKFLOW_COMPOSER_ENABLED: "true", WORKFLOW_DEFAULT_MODEL: "claude-haiku-5-5", WORKFLOW_DAILY_CAP_USD: "2" };
function request(id = crypto.randomUUID(), patch = {}) { return new Request("https://example.test/api/compose", { method: "POST", headers: { "content-type": "application/json", "idempotency-key": id }, body: JSON.stringify({ goal, context: "", assignMinds: false, ...patch }) }); }
const run = async (_m, _k, _prompt, schema) => ({ text: JSON.stringify(schema?.properties?.intents ? { intents: [{ query: goal, kind: "create" }] } : freeSelection(catalogue, goal)), usage: { input: 100, output: 500, cached: 0, cacheWrite: 0 }, cost: .003, latencyMs: 10 });

test("generation denies anonymous callers before loading the catalogue or contacting a model", async () => {
  let spent = false;
  const response = await handleComposer(request(undefined, { userId: "user_alice" }), () => { throw Error("Anonymous catalogue access"); }, modelEnv, memoryComposer(), "ip", async () => { spent = true; return run(); });
  assert.equal(response.status, 401); assert.equal(spent, false);
  const viaWorker = await worker.fetch(new Request("http://localhost/api/compose", { method: "POST", headers: { authorization: "Bearer forged" } }), { ...modelEnv, ...env, SECURITY_LOCAL: "true" });
  assert.equal(viaWorker.status, 401, "Development security bypass cannot bypass customer login");
});

test("idempotency is scoped to accounts, survives network changes, and counts each generation once", async () => {
  const store = memoryComposer(), id = crypto.randomUUID(); let calls = 0;
  const runner = async (...args) => { calls++; return run(...args); };
  assert.equal((await handleComposer(request(id), catalogue, modelEnv, store, "ip-a", runner, "user_alice")).status, 200);
  assert.equal((await handleComposer(request(id), catalogue, modelEnv, store, "ip-b", runner, "user_alice")).status, 200);
  assert.equal(calls, 2);
  assert.equal((await handleComposer(request(id), catalogue, modelEnv, store, "ip-b", runner, "user_bob")).status, 200);
  assert.equal(calls, 4);
  assert.equal((await store.usage("user_alice", new Date().toISOString().slice(0, 10))).completed, 1);
});

test("migrated D1 preserves historical jobs and enforces per-account limits across changing IPs", async () => {
  const db = new DatabaseSync(":memory:");
  db.exec(fs.readFileSync("migrations/0004_composer.sql", "utf8"));
  db.exec("INSERT INTO composer_jobs VALUES ('old', 'f', '2026-10-21', 'old-ip', 0.03, 'done', '{}')");
  db.exec(fs.readFileSync("migrations/0005_composer_accounts.sql", "utf8"));
  const store = d1Composer({ prepare(sql) { return { bind(...values) { return { async first() { return db.prepare(sql).get(...values) ?? null; }, async run() { return db.prepare(sql).run(...values); } }; } }; } });
  assert.equal((await store.get("old")).user_id, null);
  const job = { fingerprint: "f", day: "2026-10-22", charge: .001, status: "pending", result: null, user_id: "user_alice" };
  const results = await Promise.all(Array.from({ length: 14 }, (_, i) => store.claim({ ...job, id: `job-${i}`, ip: `ip-${i}` }, 2)));
  assert.equal(results.filter(Boolean).length, 5);
  await store.finish("job-0", .003, "done", "{}");
  await store.finish("job-1", .002, "failed", null);
  assert.equal(await store.claim({ ...job, id: "bob-job", user_id: "user_bob", ip: "ip-bob" }, 2), true);
  const usage = await store.usage("user_alice", "2026-10-22");
  assert.equal(usage.completed, 1); assert.equal(usage.attemptsToday, 5);
  assert.equal(usage.estimatedCost.toFixed(3), "0.008");
  assert.equal((await store.usage("user_bob", "2026-10-22")).completed, 0);
  db.close();
});


test("only the verified configured owner receives a null account count limit", async()=>{
 const configured={...env,WORKFLOW_UNLIMITED_USER_ID:'user_alice'};
 const owner=await handleAccount(authRequest(),configured,memoryComposer());
 assert.deepEqual(await owner.json(),{completed:0,attemptsToday:0,dailyAttemptLimit:null,dailyIpAttemptLimit:null,unlimited:true});
 const other=await handleAccount(authRequest(token({sub:'user_bob'}),'/api/auth?usage&user_id=user_alice&unlimited=true'),configured,memoryComposer());
 assert.deepEqual(await other.json(),{completed:0,attemptsToday:0,dailyAttemptLimit:5,dailyIpAttemptLimit:10,unlimited:false});
 assert.equal((await handleAccount(new Request('https://example.test/api/auth?usage',{headers:{'x-user-id':'user_alice'}}),configured,memoryComposer())).status,401);
});
