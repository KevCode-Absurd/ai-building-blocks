// The MCP server at /mcp: JSON-RPC basics, tools/list, and tools/call for every tool.
// Intake, delivery and directory are mocked (they are built in parallel); the catalogue uses the test fixtures.
import { mock, test } from "node:test";
import assert from "node:assert/strict";
import type { JobRow, Persona } from "../src/core/types.ts";
import { NOVA } from "./fixtures.ts";

const intakeUrl = new URL("../src/modules/intake/service.ts", import.meta.url).href;
const deliveryUrl = new URL("../src/modules/delivery/service.ts", import.meta.url).href;
const directoryUrl = new URL("../src/modules/directory/service.ts", import.meta.url).href;
const realIntake = await import(intakeUrl);
const realDelivery = await import(deliveryUrl);
const realDirectory = await import(directoryUrl);

const db = () => current!.env.DB;
const now = () => new Date().toISOString();
const loadJob = async (id: string) => (await db().prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first<JobRow>())!;
const HIDDEN: Persona = { ...NOVA, id: "hidden-agent", name: "Hidden", status: "hidden" };

const fakes = {
  startRequest: mock.fn(async (_env: unknown, input: { orgId: string; userId: string; text: string; source?: string; jobTypeId?: string; personaId?: string }) => {
    const id = `job_${Math.random().toString(16).slice(2, 18).padEnd(16, "0")}`;
    const jt = input.jobTypeId ?? "seo-blog-post";
    await db().prepare("INSERT INTO jobs (id, org_id, created_by, source, status, job_type_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, 'draft', ?, 'SEO blog post', ?, ?)")
      .bind(id, input.orgId, input.userId, input.source ?? "web", jt, now(), now()).run();
    return { job: await loadJob(id), classification: { job_type_id: jt, confidence: 0.9, reason: "matched", alternatives: [] }, spec: { topic: "dog grooming" }, questions: [{ field_id: "audience", question: "Who reads it?" }], ready: false };
  }),
  answerQuestions: mock.fn(async (_env: unknown, input: { jobId: string; answers: Record<string, unknown> }) => {
    return { job: await loadJob(input.jobId), classification: { job_type_id: "seo-blog-post", confidence: 0.9, reason: "", alternatives: [] }, spec: { topic: "dog grooming", ...input.answers }, questions: [], ready: true };
  }),
  quoteJob: mock.fn(async (_env: unknown, input: { jobId: string; rush?: boolean; goals?: string }) => {
    const price = input.rush ? 19350 : 12900;
    const expires = new Date(Date.now() + 7 * 86400_000).toISOString();
    const quote = {
      job_type_id: "seo-blog-post", catalogue_version: "cat-test", price_cents: price, currency: "usd", turnaround_hours: input.rush ? 12 : 24, rush: !!input.rush, expires_at: expires,
      breakdown: [{ label: "SEO blog post", cents: 12900 }, ...(input.rush ? [{ label: "Rush", cents: 6450 }] : [])],
      rubric: [
        { id: "clear_offer", text: "Answers the search in the first paragraph.", weight: 5, pass_rule: "x", critical: true, source: "template" },
        { id: "plain_words", text: "Plain, specific words.", weight: 3, pass_rule: "x", critical: false, source: "template" },
      ],
      spec: { topic: "dog grooming" },
    };
    await db().prepare("UPDATE jobs SET status = 'quoted', price_cents = ?, quote = ?, quote_expires_at = ?, turnaround_hours = ? WHERE id = ?").bind(price, JSON.stringify(quote), expires, quote.turnaround_hours, input.jobId).run();
    await db().prepare("INSERT INTO rubrics (job_id, criteria, created_at, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(job_id) DO UPDATE SET criteria = excluded.criteria").bind(input.jobId, JSON.stringify(quote.rubric), now(), now()).run();
    return { job: await loadJob(input.jobId), quote };
  }),
  confirmOrder: mock.fn(async (_env: unknown, input: { jobId: string; userId: string; actorKind?: string }) => {
    await db().prepare("UPDATE jobs SET status = 'confirmed' WHERE id = ?").bind(input.jobId).run();
    return loadJob(input.jobId);
  }),
  acceptJob: mock.fn(async (_env: unknown, input: { jobId: string }) => {
    await db().prepare("UPDATE jobs SET status = 'accepted', accepted_at = ? WHERE id = ?").bind(now(), input.jobId).run();
    return loadJob(input.jobId);
  }),
  requestRevision: mock.fn(async (_env: unknown, input: { jobId: string }) => {
    await db().prepare("UPDATE jobs SET status = 'revising', revisions_used = revisions_used + 1 WHERE id = ?").bind(input.jobId).run();
    return loadJob(input.jobId);
  }),
  listPersonas: mock.fn(async (_env: unknown, filter?: { area?: string; q?: string }) =>
    [NOVA, HIDDEN].filter(p => (!filter?.area || p.area === filter.area) && (!filter?.q || `${p.name} ${p.title} ${p.tagline}`.toLowerCase().includes(filter.q.toLowerCase())))),
  getPersona: mock.fn(async (_env: unknown, id: string) => [NOVA, HIDDEN].find(p => p.id === id) ?? null),
};
const wrap = (name: keyof typeof fakes) => (...args: unknown[]) => (fakes[name] as unknown as (...a: unknown[]) => unknown)(...args);

mock.module(intakeUrl, { exports: { ...realIntake, startRequest: wrap("startRequest"), answerQuestions: wrap("answerQuestions"), quoteJob: wrap("quoteJob"), confirmOrder: wrap("confirmOrder") } });
mock.module(deliveryUrl, { exports: { ...realDelivery, acceptJob: wrap("acceptJob"), requestRevision: wrap("requestRevision") } });
mock.module(directoryUrl, { exports: { ...realDirectory, listPersonas: wrap("listPersonas"), getPersona: wrap("getPersona") } });

const { testEnv } = await import("./helpers.ts");
const { pkceChallenge } = await import("../src/modules/mcp/oauth.ts");
const { HttpError } = await import("../src/core/http.ts");
type T = Awaited<ReturnType<typeof testEnv>>;
let current: T | null = null;

const ORIGIN = "https://agents.test";
const REDIRECT = "https://claude.ai/api/mcp/auth_callback";

/** Connect an app for a user through the real OAuth flow and return its access token. */
async function connect(t: T, user = "user_buyer", allowOrder = true): Promise<string> {
  const reg = await t.api("POST", "/oauth/register", { body: { client_name: "Claude", redirect_uris: [REDIRECT] } });
  const verifier = Buffer.from(crypto.getRandomValues(new Uint8Array(48))).toString("base64url");
  const q = new URLSearchParams({ response_type: "code", client_id: reg.body.client_id, redirect_uri: REDIRECT, code_challenge: await pkceChallenge(verifier), code_challenge_method: "S256", state: "s" });
  const auth = await t.api("GET", `/oauth/authorize?${q}`);
  const requestId = new URL(auth.res.headers.get("location")!).searchParams.get("request");
  const ok = await t.api("POST", "/api/oauth/approve", { user, body: { request_id: requestId, approve: true, allow_order: allowOrder } });
  const code = new URL(ok.body.redirect_url).searchParams.get("code")!;
  const tok = await t.api("POST", "/oauth/token", { body: { grant_type: "authorization_code", code, client_id: reg.body.client_id, redirect_uri: REDIRECT, code_verifier: verifier } });
  assert.equal(tok.status, 200, JSON.stringify(tok.body));
  return tok.body.access_token;
}

async function setup(o: { beta?: boolean; allowOrder?: boolean; user?: string } = {}) {
  const t = await testEnv();
  current = t;
  for (const f of Object.values(fakes)) f.mock.resetCalls();
  const user = o.user ?? "user_buyer";
  const token = await connect(t, user, o.allowOrder ?? true);
  if (o.beta ?? true) await t.grantBeta(user);
  let n = 0;
  const rpc = async (method: string, params?: unknown, headers: Record<string, string> = {}) => {
    const res = await t.api("POST", "/mcp", { headers: { authorization: `Bearer ${token}`, accept: "application/json, text/event-stream", ...headers }, body: { jsonrpc: "2.0", id: ++n, method, ...(params === undefined ? {} : { params }) } });
    return res;
  };
  const call = async (name: string, args: Record<string, unknown> = {}) => {
    const res = await rpc("tools/call", { name, arguments: args });
    assert.equal(res.status, 200, JSON.stringify(res.body));
    assert.ok(res.body.result, JSON.stringify(res.body));
    return res.body.result as { content: { type: string; text: string }[]; structuredContent?: any; isError?: boolean };
  };
  const [{ org_id }] = await t.sql("SELECT org_id FROM org_members WHERE user_id = ?", user);
  return { t, token, rpc, call, user, orgId: org_id as string };
}

const textOf = (r: { content: { text: string }[] }) => r.content.map(c => c.text).join("\n");

async function insertJob(t: T, orgId: string, user: string, set: Partial<JobRow> = {}): Promise<string> {
  const id = set.id ?? `job_${Math.random().toString(16).slice(2, 18).padEnd(16, "0")}`;
  await t.sql("INSERT INTO jobs (id, org_id, created_by, source, status, job_type_id, title, price_cents, revisions_used, revisions_allowed, auto_accept_at, created_at, updated_at) VALUES (?, ?, ?, 'mcp', ?, 'seo-blog-post', 'Dog grooming article', ?, ?, 2, ?, ?, ?)",
    id, orgId, user, set.status ?? "delivered", set.price_cents ?? 12900, set.revisions_used ?? 0, set.auto_accept_at ?? null, now(), now());
  await t.sql("INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", id, JSON.stringify([
    { id: "clear_offer", text: "Answers the search in the first paragraph.", weight: 5, pass_rule: "x", critical: true, source: "template" },
    { id: "plain_words", text: "Plain, specific words.", weight: 3, pass_rule: "x", critical: false, source: "template" },
  ]), now(), now(), now());
  return id;
}

async function insertDraft(t: T, jobId: string, version: number, content: string, released: boolean): Promise<string> {
  const runId = `run_${jobId.slice(4)}${version}`, draftId = `drf_${jobId.slice(4)}${version}`;
  await t.sql("INSERT INTO runs (id, job_id, kind, status, created_at) VALUES (?, ?, 'job', 'succeeded', ?)", runId, jobId, now());
  await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, fingerprint, released_at, released_by, created_at) VALUES (?, ?, ?, ?, ?, 'fp', ?, ?, ?)",
    draftId, jobId, runId, version, content, released ? now() : null, released ? "ops" : null, now());
  return draftId;
}

test("initialize, notifications, ping and protocol errors", async () => {
  const { rpc, t, token } = await setup();
  const init = await rpc("initialize", { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "claude-ai", version: "1" } });
  assert.equal(init.status, 200);
  assert.equal(init.res.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(init.body.jsonrpc, "2.0");
  assert.equal(init.body.id, 1);
  assert.equal(init.body.result.protocolVersion, "2025-11-25");
  assert.deepEqual(init.body.result.capabilities, { tools: { listChanged: false } });
  assert.equal(init.body.result.serverInfo.name, "ai-blocks-agents");
  assert.ok(init.body.result.instructions.length < 2000);
  assert.match(init.body.result.instructions, /place_order only after the user clearly says yes/);
  const old = await rpc("initialize", { protocolVersion: "1999-01-01", capabilities: {}, clientInfo: { name: "x", version: "1" } });
  assert.equal(old.body.result.protocolVersion, "2025-11-25");

  const bearer = { authorization: `Bearer ${token}` };
  const note = await t.api("POST", "/mcp", { headers: bearer, body: { jsonrpc: "2.0", method: "notifications/initialized" } });
  assert.equal(note.status, 202);
  assert.equal(note.body, null);
  assert.deepEqual((await rpc("ping")).body.result, {});
  const unknown = await rpc("resources/list");
  assert.equal(unknown.body.error.code, -32601);
  const batch = await t.api("POST", "/mcp", { headers: bearer, body: [{ jsonrpc: "2.0", id: 1, method: "ping" }] });
  assert.equal(batch.status, 400);
  assert.equal(batch.body.error.code, -32600);
  const notRpc = await t.api("POST", "/mcp", { headers: bearer, body: { id: 1, method: "ping" } });
  assert.equal(notRpc.body.error.code, -32600);
  const { handleFetch } = await import("../src/app.ts");
  const exec = { waitUntil() {}, passThroughOnException() {} } as unknown as ExecutionContext;
  const parse = await handleFetch(new Request(`${ORIGIN}/mcp`, { method: "POST", headers: { ...bearer, "content-type": "application/json" }, body: "{oops" }), t.env, exec);
  assert.equal(parse.status, 400);
  assert.equal((await parse.json() as any).error.code, -32700);
  const version = await rpc("ping", undefined, { "mcp-protocol-version": "1999-01-01" });
  assert.equal(version.status, 400);
  assert.equal((await rpc("ping", undefined, { "mcp-protocol-version": "2025-06-18" })).status, 200);
});

test("tools/list returns every tool with input schemas and annotations", async () => {
  const { rpc } = await setup();
  const res = await rpc("tools/list", {});
  const tools: any[] = res.body.result.tools;
  assert.deepEqual(tools.map(t => t.name), ["list_agents", "get_agent", "list_job_types", "start_request", "answer_questions", "get_quote", "place_order", "get_job", "get_delivery", "accept_delivery", "request_revision"]);
  for (const tool of tools) {
    assert.equal(tool.inputSchema.type, "object", tool.name);
    assert.ok(tool.description.length > 20, tool.name);
    assert.ok(tool.title, tool.name);
    assert.equal(typeof tool.annotations.readOnlyHint, "boolean", tool.name);
    assert.equal(typeof tool.annotations.destructiveHint, "boolean", tool.name);
    assert.equal(tool.annotations.openWorldHint, false, tool.name);
    assert.equal(tool.scope, undefined, "internal fields stay internal");
    assert.equal(tool.run, undefined);
  }
  const by = Object.fromEntries(tools.map(t => [t.name, t]));
  for (const name of ["list_agents", "get_agent", "list_job_types", "get_job", "get_delivery"]) assert.equal(by[name].annotations.readOnlyHint, true, name);
  for (const name of ["start_request", "answer_questions", "get_quote", "place_order", "accept_delivery", "request_revision"]) assert.equal(by[name].annotations.readOnlyHint, false, name);
  assert.equal(by.accept_delivery.annotations.destructiveHint, true);
  assert.equal(by.place_order.annotations.destructiveHint, false);
  assert.deepEqual(by.place_order.inputSchema.required, ["job_id", "price_cents"]);
  assert.deepEqual(by.start_request.inputSchema.required, ["text"]);
  assert.ok(by.list_agents.inputSchema.properties.area.enum.includes("marketing"));
});

test("list_agents, get_agent and list_job_types browse the directory and catalogue", async () => {
  const { call } = await setup({ beta: false });
  const list = await call("list_agents", { area: "marketing", query: "seo" });
  assert.equal(list.isError, undefined);
  assert.deepEqual(fakes.listPersonas.mock.calls[0].arguments[1], { area: "marketing", q: "seo" });
  assert.deepEqual(list.structuredContent.agents.map((a: any) => a.agent_id), ["nova-seo"], "hidden agents are left out");
  assert.equal(list.structuredContent.agents[0].url, `${ORIGIN}/agents/nova-seo`);
  assert.match(textOf(list), /Nova, SEO strategist \(agent_id nova-seo\)/);
  assert.match(textOf(list), /\[seo-blog-post\]/);
  assert.equal((await call("list_agents", { area: "space" })).isError, true);

  const agent = await call("get_agent", { agent_id: "nova-seo" });
  assert.equal(agent.structuredContent.agent.name, "Nova");
  assert.deepEqual(agent.structuredContent.agent.not_for, NOVA.profile.not_for);
  assert.match(textOf(agent), /call start_request with persona_id nova-seo/);
  const missing = await call("get_agent", { agent_id: "nobody" });
  assert.equal(missing.isError, true);
  assert.match(textOf(missing), /list_agents/);
  assert.equal((await call("get_agent", { agent_id: "hidden-agent" })).isError, true);
  assert.equal((await call("get_agent", {})).isError, true);

  const jobs = await call("list_job_types", {});
  assert.deepEqual(jobs.structuredContent.job_types.map((j: any) => j.id), ["landing-page-copy", "seo-blog-post"]);
  const blog = await call("list_job_types", { query: "article" });
  assert.deepEqual(blog.structuredContent.job_types.map((j: any) => j.id), ["seo-blog-post"]);
  assert.match(textOf(blog), /From \$89/);
  assert.equal((await call("list_job_types", { area: "content" })).structuredContent.job_types.length, 1);
});

test("start_request needs beta access, like the website", async () => {
  const { call } = await setup({ beta: false });
  const res = await call("start_request", { text: "A 1,500 word article about how often to groom a dog." });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /invite code at https:\/\/agents\.test\/invite/);
  assert.equal(fakes.startRequest.mock.callCount(), 0);
});

test("from request to order: start, answer, quote, order", async () => {
  const { call, user, orgId, t } = await setup();
  const tooShort = await call("start_request", { text: "hi" });
  assert.equal(tooShort.isError, true);
  assert.equal((await call("start_request", { text: "A long enough request text", persona_id: "nobody" })).isError, true);
  assert.equal((await call("start_request", { text: "A long enough request text", job_type_id: "no-such-job" })).isError, true);

  const started = await call("start_request", { text: "A 1,500 word article about how often to groom a dog.", persona_id: "nova-seo", job_type_id: "seo-blog-post" });
  assert.equal(started.isError, undefined, textOf(started));
  const input = fakes.startRequest.mock.calls[0].arguments[1];
  assert.deepEqual(input, { orgId, userId: user, text: "A 1,500 word article about how often to groom a dog.", source: "mcp", jobTypeId: "seo-blog-post", personaId: "nova-seo" });
  const jobId = started.structuredContent.job_id;
  assert.equal(started.structuredContent.questions[0].field_id, "audience");
  assert.equal(started.structuredContent.url, `${ORIGIN}/requests/${jobId}`);
  assert.match(textOf(started), /Ask the user:\n1\. Who reads it\? \[field_id: audience\]/);
  assert.equal((await t.sql("SELECT source FROM jobs WHERE id = ?", jobId))[0].source, "mcp");

  assert.equal((await call("answer_questions", { job_id: jobId, answers: [] as unknown as Record<string, unknown> })).isError, true);
  assert.equal((await call("answer_questions", { job_id: jobId, answers: { "Bad Key": "x" } })).isError, true);
  const answered = await call("answer_questions", { job_id: jobId, answers: { audience: "Dog owners", words: 1500 } });
  assert.equal(answered.structuredContent.ready, true);
  assert.deepEqual(fakes.answerQuestions.mock.calls[0].arguments[1], { jobId, userId: user, answers: { audience: "Dog owners", words: 1500 } });
  assert.match(textOf(answered), /Call get_quote/);

  const quote = await call("get_quote", { job_id: jobId, goals: "Rank for dog grooming searches" });
  assert.equal(quote.isError, undefined, textOf(quote));
  assert.deepEqual(fakes.quoteJob.mock.calls[0].arguments[1], { jobId, userId: user, rush: undefined, goals: "Rank for dog grooming searches" });
  assert.equal(quote.structuredContent.quote.price_cents, 12900);
  assert.equal(quote.structuredContent.quote.price, "$129");
  assert.deepEqual(quote.structuredContent.quote.checklist.map((c: any) => c.id), ["clear_offer", "plain_words"]);
  assert.match(textOf(quote), /\$129/);
  assert.match(textOf(quote), /Nothing is charged during the beta/);
  assert.match(textOf(quote), /price_cents 12900/);
  // Asking again while the quote is valid returns it without re-quoting.
  const again = await call("get_quote", { job_id: jobId });
  assert.equal(again.structuredContent.quote.price_cents, 12900);
  assert.equal(fakes.quoteJob.mock.callCount(), 1);
  const rush = await call("get_quote", { job_id: jobId, rush: true });
  assert.equal(rush.structuredContent.quote.price_cents, 19350);
  assert.equal(fakes.quoteJob.mock.callCount(), 2);

  const wrongPrice = await call("place_order", { job_id: jobId, price_cents: 12900 });
  assert.equal(wrongPrice.isError, true);
  assert.match(textOf(wrongPrice), /quoted price is \$193\.50/);
  assert.equal(fakes.confirmOrder.mock.callCount(), 0);
  assert.equal((await call("place_order", { job_id: jobId })).isError, true);

  const ordered = await call("place_order", { job_id: jobId, price_cents: 19350 });
  assert.equal(ordered.isError, undefined, textOf(ordered));
  assert.deepEqual(fakes.confirmOrder.mock.calls[0].arguments[1], { jobId, userId: user, actorKind: "mcp" });
  assert.equal(ordered.structuredContent.status, "confirmed");
  assert.equal(ordered.structuredContent.url, `${ORIGIN}/jobs/${jobId}`);
  assert.match(textOf(ordered), /Nothing is charged during the beta/);
  const twice = await call("place_order", { job_id: jobId, price_cents: 19350 });
  assert.equal(twice.isError, true);
  assert.match(textOf(twice), /already ordered/);
  assert.equal((await call("get_quote", { job_id: jobId })).isError, true);

  const job = await call("get_job", { job_id: jobId });
  assert.equal(job.structuredContent.status_label, "Ordered");
  assert.match(textOf(job), /working on it/);
  const listed = await call("get_job", {});
  assert.deepEqual(listed.structuredContent.jobs.map((j: any) => j.job_id), [jobId]);
});

test("an expired quote cannot be ordered", async () => {
  const { call, t, orgId, user } = await setup();
  const jobId = await insertJob(t, orgId, user, { status: "quoted", price_cents: 12900 });
  await t.sql("UPDATE jobs SET quote_expires_at = '2000-01-01T00:00:00.000Z' WHERE id = ?", jobId);
  const res = await call("place_order", { job_id: jobId, price_cents: 12900 });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /expired/);
  const draft = await insertJob(t, orgId, user, { status: "draft" });
  assert.match(textOf(await call("place_order", { job_id: draft, price_cents: 12900 })), /no quote yet/);
});

test("a read-only connection cannot order, accept or ask for changes", async () => {
  const { call, t, orgId, user } = await setup({ allowOrder: false });
  const quoted = await insertJob(t, orgId, user, { status: "quoted", price_cents: 12900 });
  const delivered = await insertJob(t, orgId, user, { status: "delivered" });
  for (const [name, args] of [
    ["place_order", { job_id: quoted, price_cents: 12900 }],
    ["accept_delivery", { job_id: delivered }],
    ["request_revision", { job_id: delivered, reasons: "Make the intro shorter please." }],
  ] as const) {
    const res = await call(name, args);
    assert.equal(res.isError, true, name);
    assert.match(textOf(res), /not allowed to order or decide on work/, name);
    assert.match(textOf(res), new RegExp(`/jobs/${name === "place_order" ? quoted : delivered}`), name);
  }
  assert.equal(fakes.confirmOrder.mock.callCount(), 0);
  assert.equal(fakes.acceptJob.mock.callCount(), 0);
  assert.equal(fakes.requestRevision.mock.callCount(), 0);
  // Browsing and reading still work.
  assert.equal((await call("get_job", { job_id: delivered })).isError, undefined);
  assert.equal((await call("list_agents", {})).isError, undefined);
});

test("jobs of other buyers stay hidden, even from staff", async () => {
  const { call, t } = await setup();
  await t.makeOps("user_buyer");
  await t.grantBeta("other_buyer");
  const [{ org_id }] = await t.sql("SELECT org_id FROM org_members WHERE user_id = 'other_buyer'");
  const theirs = await insertJob(t, org_id, "other_buyer", { status: "delivered" });
  await insertDraft(t, theirs, 1, "Secret draft", true);
  for (const [name, args] of [["get_job", { job_id: theirs }], ["get_delivery", { job_id: theirs }], ["accept_delivery", { job_id: theirs }], ["answer_questions", { job_id: theirs, answers: { a: "b" } }]] as const) {
    const res = await call(name, args);
    assert.equal(res.isError, true, name);
    assert.match(textOf(res), /could not find that job/, name);
  }
  assert.deepEqual((await call("get_job", {})).structuredContent.jobs, []);
});

test("get_delivery shows released drafts only, with the checklist results", async () => {
  const { call, t, orgId, user } = await setup();
  const jobId = await insertJob(t, orgId, user, { status: "in_review" });
  const none = await call("get_delivery", { job_id: jobId });
  assert.equal(none.isError, true);
  assert.match(textOf(none), /Nothing is ready to read yet\. This job is: Final check/);
  await insertDraft(t, jobId, 1, "Draft one, released", true);
  const draft2 = await insertDraft(t, jobId, 2, "Draft two, still being checked", false);
  void draft2;
  await t.sql("UPDATE jobs SET status = 'delivered', auto_accept_at = ? WHERE id = ?", new Date(Date.now() + 5 * 86400_000).toISOString(), jobId);
  const released = await t.sql("SELECT id FROM drafts WHERE job_id = ? AND version = 1", jobId);
  await t.sql("INSERT INTO scores (id, draft_id, judge, passed, score, result, created_at) VALUES ('scr_1', ?, 'rubric', 0, 0.6, ?, ?)", released[0].id,
    JSON.stringify({ passed: false, score: 0.6, criteria: [{ id: "clear_offer", pass: true, evidence: "", note: "" }, { id: "plain_words", pass: false, evidence: "", note: "" }] }), now());
  const res = await call("get_delivery", { job_id: jobId });
  assert.equal(res.isError, undefined, textOf(res));
  assert.equal(res.structuredContent.draft.version, 1);
  assert.equal(res.structuredContent.draft.content, "Draft one, released");
  assert.ok(!textOf(res).includes("still being checked"));
  assert.deepEqual(res.structuredContent.checklist.map((c: any) => [c.id, c.passed]), [["clear_offer", true], ["plain_words", false]]);
  assert.equal(res.structuredContent.revisions_left, 2);
  assert.match(textOf(res), /\[not passed\] Plain, specific words\. \[plain_words\]/);
  assert.match(textOf(res), /2 rounds left/);
  assert.match(textOf(res), /--- Draft \(markdown\) ---\nDraft one, released\n--- End of draft ---/);
});

test("accept_delivery and request_revision act on delivered work with actorKind mcp", async () => {
  const { call, t, orgId, user } = await setup();
  const running = await insertJob(t, orgId, user, { status: "running" });
  assert.match(textOf(await call("accept_delivery", { job_id: running })), /Only delivered work can be accepted/);
  assert.match(textOf(await call("request_revision", { job_id: running, reasons: "Shorter intro, please." })), /only be asked for on delivered work/);

  const a = await insertJob(t, orgId, user, { status: "delivered" });
  assert.equal((await call("accept_delivery", { job_id: a, rating: 9 })).isError, true);
  const accepted = await call("accept_delivery", { job_id: a, rating: 5, note: "Great work" });
  assert.equal(accepted.isError, undefined, textOf(accepted));
  assert.deepEqual(fakes.acceptJob.mock.calls[0].arguments[1], { jobId: a, userId: user, rating: 5, note: "Great work", actorKind: "mcp" });
  assert.equal(accepted.structuredContent.status, "accepted");

  const b = await insertJob(t, orgId, user, { status: "delivered" });
  const badIds = await call("request_revision", { job_id: b, reasons: "Shorter intro, please.", failed_criteria: ["made_up"] });
  assert.equal(badIds.isError, true);
  assert.match(textOf(badIds), /clear_offer, plain_words/);
  assert.equal((await call("request_revision", { job_id: b, reasons: "short" })).isError, true);
  const revised = await call("request_revision", { job_id: b, reasons: "Shorter intro, please.", failed_criteria: ["plain_words"] });
  assert.equal(revised.isError, undefined, textOf(revised));
  assert.deepEqual(fakes.requestRevision.mock.calls[0].arguments[1], { jobId: b, userId: user, reasons: "Shorter intro, please.", failedCriteria: ["plain_words"], actorKind: "mcp" });
  assert.equal(revised.structuredContent.revisions_left, 1);

  const used = await insertJob(t, orgId, user, { status: "delivered", revisions_used: 2 });
  assert.match(textOf(await call("request_revision", { job_id: used, reasons: "Shorter intro, please." })), /used all 2 rounds/);
  assert.equal(fakes.requestRevision.mock.callCount(), 1);
});

test("service errors become plain tool errors; unknown tools are protocol errors", async () => {
  const { call, rpc, t, orgId, user } = await setup();
  const jobId = await insertJob(t, orgId, user, { status: "delivered" });
  fakes.acceptJob.mock.mockImplementationOnce(async () => { throw new HttpError(409, "job_changed", "This job changed while you were working on it. Refresh and try again."); });
  const known = await call("accept_delivery", { job_id: jobId });
  assert.equal(known.isError, true);
  assert.equal(textOf(known), "This job changed while you were working on it. Refresh and try again.");
  fakes.acceptJob.mock.mockImplementationOnce(async () => { throw new Error("SQLITE_BUSY internal detail"); });
  const original = console.error;
  console.error = () => {};
  try {
    const unknownErr = await call("accept_delivery", { job_id: jobId });
    assert.equal(unknownErr.isError, true);
    assert.ok(!textOf(unknownErr).includes("SQLITE"));
    assert.match(textOf(unknownErr), /Something went wrong on our side/);
  } finally { console.error = original; }

  const unknownTool = await rpc("tools/call", { name: "delete_everything", arguments: {} });
  assert.equal(unknownTool.body.error.code, -32602);
  const badArgs = await rpc("tools/call", { name: "get_job", arguments: [1] });
  assert.equal(badArgs.body.error.code, -32602);
});
