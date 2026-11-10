// The MCP server at /mcp: JSON-RPC basics, tools/list, and tools/call for every tool.
// Intake, delivery and directory are mocked (they are built in parallel); the catalogue uses the test fixtures.
import { mock, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Env } from "../src/env.ts";
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
/** A live agent with a personality (soul.md). */
const SAGE: Persona = {
  ...NOVA, id: "sage-brand", name: "Sage", title: "Brand designer", tagline: "Turns a messy brand into one clear look you can use.", area: "design", sort: 20, role: "brand-designer",
  profile: {
    ...NOVA.profile, portrait: "/agents/sage-brand.webp",
    soul: {
      essence: "I am a calm designer who cares more about clear choices than pretty ones.",
      temperament: "I slow down before I draw anything. I ask what the brand must say first, then pick the look.",
      voice: "Short, warm and direct. \"Here are two options, and here is the one I would pick.\"",
      values: ["One clear idea per page", "Work you can use the same day"],
      quirks: ["I sketch three ideas before I open any tool", "I name every colour after a real thing"],
      pushback: "If the brief is thin, I ask two questions first. If I disagree, I say why and show both ways.",
      off_hours: "I paint shop signs on weekends, so I think about how things read from far away.",
    },
  },
};
const SEAT_FIXTURES: Persona[] = ["test-strategist", "test-maker-a", "test-maker-b", "test-red-team", "test-judge"].map((id, i) => ({ ...NOVA, id, name: `Seat${i}`, profile: { ...NOVA.profile, portrait: `/agents/${id}.webp` } }));
/** An agent an expert built in the studio: it has no download pack. */
const EXPERT_BUILT: Persona = { ...NOVA, id: "pat-expert-seo", kind: "expert", name: "Pat" };
/** Words a buyer must never see now that hiring is free. */
const MONEY_WORDS = /\$|price|quote|charge|beta/i;
/** A result's text and structured data, minus the internal job status ids (such as "quoted"). */
const visible = (r: { content: { text: string }[]; structuredContent?: unknown }) =>
  `${r.content.map(c => c.text).join("\n")}\n${JSON.stringify(r.structuredContent ?? {}, (k, v) => (k === "status" ? undefined : v))}`;
const intakeHasDailyLimit = readFileSync(new URL("../src/modules/intake/service.ts", import.meta.url), "utf8").includes("checkDailyJobs");

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
    const expires = new Date(Date.now() + 7 * 86400_000).toISOString();
    const quote = {
      job_type_id: "seo-blog-post", catalogue_version: "cat-test", price_cents: 0, currency: "usd", turnaround_hours: input.rush ? 12 : 24, rush: !!input.rush, expires_at: expires,
      breakdown: [],
      rubric: [
        { id: "clear_offer", text: "Answers the search in the first paragraph.", weight: 5, pass_rule: "x", critical: true, source: "template" },
        { id: "plain_words", text: "Plain, specific words.", weight: 3, pass_rule: "x", critical: false, source: "template" },
      ],
      spec: { topic: "dog grooming" },
    };
    await db().prepare("UPDATE jobs SET status = 'quoted', quote = ?, quote_expires_at = ?, turnaround_hours = ? WHERE id = ?").bind(JSON.stringify(quote), expires, quote.turnaround_hours, input.jobId).run();
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
    [NOVA, HIDDEN, SAGE].filter(p => (!filter?.area || p.area === filter.area) && (!filter?.q || `${p.name} ${p.title} ${p.tagline}`.toLowerCase().includes(filter.q.toLowerCase())))),
  getPersona: mock.fn(async (_env: unknown, id: string) => [NOVA, HIDDEN, SAGE, EXPERT_BUILT, ...SEAT_FIXTURES].find(p => p.id === id) ?? null),
};
const wrap = (name: keyof typeof fakes) => (...args: unknown[]) => (fakes[name] as unknown as (...a: unknown[]) => unknown)(...args);

mock.module(intakeUrl, { exports: { ...realIntake, startRequest: wrap("startRequest"), answerQuestions: wrap("answerQuestions"), quoteJob: wrap("quoteJob"), confirmOrder: wrap("confirmOrder") } });
mock.module(deliveryUrl, { exports: { ...realDelivery, acceptJob: wrap("acceptJob"), requestRevision: wrap("requestRevision") } });
mock.module(directoryUrl, { exports: { ...realDirectory, listPersonas: wrap("listPersonas"), getPersona: wrap("getPersona") } });

const { testEnv } = await import("./helpers.ts");
const { pkceChallenge } = await import("../src/modules/mcp/oauth.ts");
const { LIMITS, bucketKey, cleanupRateCounts, takeToolCall, windowStart } = await import("../src/modules/mcp/limits.ts");
const { RATE_LIMITED_CODE } = await import("../src/modules/mcp/server.ts");
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

async function setup(o: { beta?: boolean; allowOrder?: boolean; user?: string; env?: Partial<Env> } = {}) {
  const t = await testEnv(o.env ?? {});
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
    id, orgId, user, set.status ?? "delivered", set.price_cents ?? null, set.revisions_used ?? 0, set.auto_accept_at ?? null, now(), now());
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
  assert.match(init.body.result.instructions, /start_job only after the user clearly says yes/);
  assert.match(init.body.result.instructions, /Hiring agents is free/);
  assert.doesNotMatch(init.body.result.instructions, MONEY_WORDS);
  assert.equal(init.body.result.serverInfo.title, "AI Blocks");
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
  assert.deepEqual(tools.map(t => t.name), ["get_execution_plan", "check_execution_delivery", "list_agents", "get_agent", "load_agent", "load_team", "get_agent_file", "list_job_types", "start_request", "answer_questions", "get_plan", "start_job", "decline_plan", "get_job", "get_delivery", "accept_delivery", "request_revision"]);
  // Hiring is free: no tool name, title, description or input says money, quote or beta.
  for (const tool of tools) assert.doesNotMatch(JSON.stringify(tool), MONEY_WORDS, tool.name);
  for (const tool of tools) {
    assert.equal(tool.inputSchema.type, "object", tool.name);
    assert.ok(tool.description.length > 20, tool.name);
    assert.ok(tool.title, tool.name);
    assert.equal(typeof tool.annotations.readOnlyHint, "boolean", tool.name);
    assert.equal(typeof tool.annotations.destructiveHint, "boolean", tool.name);
    assert.equal(tool.annotations.openWorldHint, false, tool.name);
    assert.equal(tool.scope, undefined, "internal fields stay internal");
    assert.equal(tool.costly, undefined, "internal fields stay internal");
    assert.equal(tool.run, undefined);
  }
  const by = Object.fromEntries(tools.map(t => [t.name, t]));
  for (const name of ["get_execution_plan", "check_execution_delivery", "list_agents", "get_agent", "load_agent", "load_team", "get_agent_file", "list_job_types", "get_job", "get_delivery"]) assert.equal(by[name].annotations.readOnlyHint, true, name);
  for (const name of ["start_request", "answer_questions", "get_plan", "start_job", "decline_plan", "accept_delivery", "request_revision"]) assert.equal(by[name].annotations.readOnlyHint, false, name);
  assert.equal(by.accept_delivery.annotations.destructiveHint, true);
  assert.equal(by.decline_plan.annotations.destructiveHint, true);
  assert.equal(by.decline_plan.annotations.idempotentHint, true);
  assert.deepEqual(by.decline_plan.inputSchema.required, ["job_id"]);
  assert.equal(by.start_job.annotations.destructiveHint, false);
  assert.deepEqual(by.start_job.inputSchema.required, ["job_id"]);
  assert.deepEqual(Object.keys(by.start_job.inputSchema.properties), ["job_id"]);
  assert.equal(by.get_plan.title, "Get the plan");
  assert.equal(by.start_job.title, "Start the job");
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
  // Nova has no personality yet: the profile works as before, with no soul and no soul.md link.
  assert.equal(agent.structuredContent.agent.soul, null);
  assert.equal(agent.structuredContent.agent.soul_url, null);
  assert.ok(!textOf(agent).includes("Personality"));
  assert.doesNotMatch(visible(agent), MONEY_WORDS);
  const missing = await call("get_agent", { agent_id: "nobody" });
  assert.equal(missing.isError, true);
  assert.match(textOf(missing), /list_agents/);
  assert.equal((await call("get_agent", { agent_id: "hidden-agent" })).isError, true);
  assert.equal((await call("get_agent", {})).isError, true);

  const jobs = await call("list_job_types", {});
  assert.deepEqual(jobs.structuredContent.job_types.map((j: any) => j.id), ["landing-page-copy", "seo-blog-post"]);
  const blog = await call("list_job_types", { query: "article" });
  assert.deepEqual(blog.structuredContent.job_types.map((j: any) => j.id), ["seo-blog-post"]);
  assert.match(textOf(blog), /Ready in about 24 hours/);
  assert.doesNotMatch(visible(blog), MONEY_WORDS);
  assert.equal(blog.structuredContent.job_types[0].price_from_usd, undefined);
  assert.equal((await call("list_job_types", { area: "content" })).structuredContent.job_types.length, 1);
});

test("get_agent includes the agent's personality and its soul.md link", async () => {
  const { call } = await setup({ beta: false });
  const res = await call("get_agent", { agent_id: "sage-brand" });
  assert.equal(res.isError, undefined, textOf(res));
  const agent = res.structuredContent.agent;
  assert.equal(agent.soul.essence, SAGE.profile.soul!.essence);
  assert.deepEqual(agent.soul.values, SAGE.profile.soul!.values);
  assert.equal(agent.soul_url, `${ORIGIN}/agents/sage-brand/soul.md`);
  for (const key of ["method", "source_roles", "look"]) assert.equal(agent[key], undefined, `${key} stays private`);
  const text = textOf(res);
  assert.match(text, /Personality: I am a calm designer/);
  for (const label of ["How I think", "How I talk", "What I care about", "My habits", "When we disagree", "Off the clock"]) assert.match(text, new RegExp(`- ${label}: `), label);
  assert.match(text, /- What I care about: One clear idea per page; Work you can use the same day/);
  assert.match(text, /Full personality: https:\/\/agents\.test\/agents\/sage-brand\/soul\.md/);
  assert.ok(!text.includes(SAGE.profile.method), "the method stays private");
  assert.doesNotMatch(visible(res), MONEY_WORDS);
});

test("get_agent links a house agent's free downloads as absolute addresses, and an expert's agent has none", async () => {
  const { call } = await setup({ beta: false });
  const res = await call("get_agent", { agent_id: "nova-seo" });
  assert.equal(res.isError, undefined, textOf(res));
  assert.deepEqual(res.structuredContent.agent.pack, {
    agent_zip: `${ORIGIN}/packs/nova-seo.zip`,
    train_zip: `${ORIGIN}/packs/nova-seo-train.zip`,
    files: `${ORIGIN}/packs/nova-seo/files.json`,
    guide: `${ORIGIN}/guides/train-your-own-agent`,
  });
  const text = textOf(res);
  assert.match(text, /Free download to use and change in the user's own AI \(not for resale\): https:\/\/agents\.test\/packs\/nova-seo\.zip/);
  assert.match(text, /Train your own version: https:\/\/agents\.test\/packs\/nova-seo-train\.zip \(how: https:\/\/agents\.test\/guides\/train-your-own-agent\)/);
  assert.doesNotMatch(visible(res), MONEY_WORDS);

  const built = await call("get_agent", { agent_id: "pat-expert-seo" });
  assert.equal(built.isError, undefined, textOf(built));
  assert.equal(built.structuredContent.agent.pack, null);
  assert.ok(!textOf(built).includes("/packs/"), "no download for an expert's agent");
});

test("start_request needs an invite code while INVITE_ONLY is on, like the website", async () => {
  const { call } = await setup({ beta: false });
  const res = await call("start_request", { text: "A 1,500 word article about how often to groom a dog." });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /Hiring needs an invite code right now. The user can enter it at https:\/\/agents\.test\/invite/);
  assert.doesNotMatch(textOf(res), MONEY_WORDS);
  assert.equal(fakes.startRequest.mock.callCount(), 0);
});

test("with open hiring, anyone signed in can start a request with no invite code", async () => {
  const { call } = await setup({ beta: false, env: { INVITE_ONLY: "false" } });
  const res = await call("start_request", { text: "A 1,500 word article about how often to groom a dog." });
  assert.equal(res.isError, undefined, textOf(res));
  assert.equal(fakes.startRequest.mock.callCount(), 1);
});

test("from request to start: request, answer, plan, start", async () => {
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
  assert.match(textOf(answered), /Call get_plan/);

  const plan = await call("get_plan", { job_id: jobId, goals: "Rank for dog grooming searches" });
  assert.equal(plan.isError, undefined, textOf(plan));
  assert.deepEqual(fakes.quoteJob.mock.calls[0].arguments[1], { jobId, userId: user, rush: undefined, goals: "Rank for dog grooming searches" });
  assert.equal(plan.structuredContent.plan.turnaround_hours, 24);
  assert.equal(plan.structuredContent.plan.rush, false);
  assert.match(plan.structuredContent.plan.deliverable, /1,200 to 2,000 word article/);
  assert.deepEqual(plan.structuredContent.plan.checklist.map((c: any) => c.id), ["clear_offer", "plain_words"]);
  assert.ok(plan.structuredContent.plan_expires_at);
  assert.match(textOf(plan), /Ready in about 24 hours after the job starts/);
  assert.match(textOf(plan), /Hiring agents is free/);
  assert.match(textOf(plan), new RegExp(`call start_job with job_id ${jobId}`));
  assert.match(textOf(plan), /call decline_plan/);
  // Asking again while the plan is good returns it without planning again.
  const again = await call("get_plan", { job_id: jobId });
  assert.equal(again.structuredContent.plan.turnaround_hours, 24);
  assert.equal(fakes.quoteJob.mock.callCount(), 1);
  const faster = await call("get_plan", { job_id: jobId, rush: true });
  assert.equal(faster.structuredContent.plan.turnaround_hours, 12);
  assert.equal(faster.structuredContent.plan.rush, true);
  assert.match(textOf(faster), /about 12 hours after the job starts \(faster delivery\)/);
  assert.equal(fakes.quoteJob.mock.callCount(), 2);

  const begun = await call("start_job", { job_id: jobId });
  assert.equal(begun.isError, undefined, textOf(begun));
  assert.deepEqual(fakes.confirmOrder.mock.calls[0].arguments[1], { jobId, userId: user, actorKind: "mcp" });
  assert.equal(begun.structuredContent.status, "confirmed");
  assert.equal(begun.structuredContent.url, `${ORIGIN}/jobs/${jobId}`);
  assert.match(textOf(begun), /Started SEO blog post/);
  const twice = await call("start_job", { job_id: jobId });
  assert.equal(twice.isError, true);
  assert.match(textOf(twice), /already started/);
  assert.equal((await call("get_plan", { job_id: jobId })).isError, true);

  const job = await call("get_job", { job_id: jobId });
  assert.equal(job.structuredContent.status_label, "Started");
  assert.match(textOf(job), /working on it/);
  const listed = await call("get_job", {});
  assert.deepEqual(listed.structuredContent.jobs.map((j: any) => j.job_id), [jobId]);

  // Nothing in the whole flow shows a price, a quote, a charge or a beta.
  for (const r of [started, answered, plan, again, faster, begun, job, listed]) assert.doesNotMatch(visible(r), MONEY_WORDS);
  for (const r of [started, answered, plan, faster, begun, job, listed]) {
    for (const key of ["price", "price_cents", "quote", "quote_expires_at", "payment"]) assert.equal((r.structuredContent ?? {})[key], undefined, key);
  }
});

test("old tool names still work for apps connected before hiring was free", async () => {
  const { call, rpc, t, orgId, user } = await setup();
  const listed: string[] = (await rpc("tools/list", {})).body.result.tools.map((x: any) => x.name);
  for (const old of ["get_quote", "place_order", "decline_quote"]) assert.ok(!listed.includes(old), `${old} is not listed`);

  const draft = (await call("start_request", { text: "A 1,500 word article about how often to groom a dog." })).structuredContent.job_id;
  const plan = await call("get_quote", { job_id: draft });
  assert.equal(plan.isError, undefined, textOf(plan));
  assert.equal(plan.structuredContent.plan.turnaround_hours, 24);
  assert.doesNotMatch(visible(plan), MONEY_WORDS);
  // An old app still sends price_cents: it is ignored.
  const started = await call("place_order", { job_id: draft, price_cents: 12900 });
  assert.equal(started.isError, undefined, textOf(started));
  assert.equal(started.structuredContent.status, "confirmed");
  assert.equal(fakes.confirmOrder.mock.callCount(), 1);

  const other = await insertJob(t, orgId, user, { status: "quoted" });
  const declined = await call("decline_quote", { job_id: other });
  assert.equal(declined.structuredContent.status, "cancelled");
  const [event] = await t.sql("SELECT data FROM events WHERE entity_id = ? AND type = 'job.cancelled'", other);
  assert.equal(JSON.parse(event.data).via, "decline_plan");
});

test("jobs from before hiring was free never show their old price", async () => {
  const { call, t, orgId, user } = await setup();
  const old = await insertJob(t, orgId, user, { status: "delivered", price_cents: 12900 });
  const one = await call("get_job", { job_id: old });
  const all = await call("get_job", {});
  for (const r of [one, all]) {
    assert.doesNotMatch(visible(r), MONEY_WORDS);
    assert.ok(!visible(r).includes("129"));
  }
  assert.equal(one.structuredContent.price_cents, undefined);
});

test("start_job passes the daily job limit message to the AI unchanged", async () => {
  const { call, t, orgId, user } = await setup({ env: { DAILY_JOBS_PER_USER: "1" } });
  // Use the real start, not the fake. Until intake checks the limit inside confirmOrder, check it first here.
  const { checkDailyJobs } = await import("../src/modules/intake/limits.ts");
  fakes.confirmOrder.mock.mockImplementation(async (env: any, input: { jobId: string; userId: string; actorKind?: string }) => {
    if (!intakeHasDailyLimit) await checkDailyJobs(env, input.userId, { saved: true });
    return realIntake.confirmOrder(env, input);
  });
  const original = console.error;
  console.error = () => {};
  try {
    const later = new Date(Date.now() + 7 * 86400_000).toISOString();
    const first = await insertJob(t, orgId, user, { status: "quoted" });
    const second = await insertJob(t, orgId, user, { status: "quoted" });
    await t.sql("UPDATE jobs SET quote_expires_at = ?, turnaround_hours = 24 WHERE id IN (?, ?)", later, first, second);
    const ok = await call("start_job", { job_id: first });
    assert.equal(ok.isError, undefined, textOf(ok));
    const over = await call("start_job", { job_id: second });
    assert.equal(over.isError, true);
    assert.match(textOf(over), /You can start 1 job a day, and you have started 1 in the last 24 hours. You can start the next one in about \d+ hours?/);
    assert.doesNotMatch(textOf(over), MONEY_WORDS);
    assert.equal((await t.sql("SELECT status FROM jobs WHERE id = ?", second))[0].status, "quoted");
  } finally {
    console.error = original;
    fakes.confirmOrder.mock.restore();
  }
});

test("a plan that timed out cannot be started", async () => {
  const { call, t, orgId, user } = await setup();
  const jobId = await insertJob(t, orgId, user, { status: "quoted" });
  await t.sql("UPDATE jobs SET quote_expires_at = '2000-01-01T00:00:00.000Z' WHERE id = ?", jobId);
  const res = await call("start_job", { job_id: jobId });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /timed out after 7 days\. Call get_plan/);
  const draft = await insertJob(t, orgId, user, { status: "draft" });
  assert.match(textOf(await call("start_job", { job_id: draft })), /no plan yet\. Call get_plan first/);
  assert.equal(fakes.confirmOrder.mock.callCount(), 0);
});

test("a read-only connection cannot start jobs, accept or ask for changes", async () => {
  const { call, t, orgId, user } = await setup({ allowOrder: false });
  const quoted = await insertJob(t, orgId, user, { status: "quoted" });
  const delivered = await insertJob(t, orgId, user, { status: "delivered" });
  for (const [name, args] of [
    ["start_job", { job_id: quoted }],
    ["accept_delivery", { job_id: delivered }],
    ["request_revision", { job_id: delivered, reasons: "Make the intro shorter please." }],
  ] as const) {
    const res = await call(name, args);
    assert.equal(res.isError, true, name);
    assert.match(textOf(res), /not allowed to start jobs or decide on work/, name);
    assert.match(textOf(res), /"Let it start jobs" turned on/, name);
    assert.match(textOf(res), new RegExp(`/jobs/${name === "start_job" ? quoted : delivered}`), name);
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
  const theirQuote = await insertJob(t, org_id, "other_buyer", { status: "quoted" });
  for (const [name, args] of [["get_job", { job_id: theirs }], ["get_delivery", { job_id: theirs }], ["accept_delivery", { job_id: theirs }], ["answer_questions", { job_id: theirs, answers: { a: "b" } }], ["decline_plan", { job_id: theirQuote }]] as const) {
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

test("decline_plan closes a request with a plan or a draft, with the same ownership checks as the website", async () => {
  const { call, t, orgId, user } = await setup();
  const quoted = await insertJob(t, orgId, user, { status: "quoted" });
  const declined = await call("decline_plan", { job_id: quoted, reason: "Not needed now" });
  assert.equal(declined.isError, undefined, textOf(declined));
  assert.equal(declined.structuredContent.status, "cancelled");
  assert.match(textOf(declined), /nothing was started/);
  assert.doesNotMatch(visible(declined), MONEY_WORDS);
  assert.match(textOf(declined), /start_request/);
  assert.equal((await t.sql("SELECT status FROM jobs WHERE id = ?", quoted))[0].status, "cancelled");
  const [event] = await t.sql("SELECT actor, actor_kind, data FROM events WHERE entity = 'job' AND entity_id = ? AND type = 'job.cancelled'", quoted);
  assert.equal(event.actor, user);
  assert.equal(event.actor_kind, "mcp");
  assert.deepEqual(JSON.parse(event.data), { from: "quoted", by: "buyer", via: "decline_plan", reason: "Not needed now", plan_ready: true });
  // Asking again is not an error, and does not log a second event.
  const again = await call("decline_plan", { job_id: quoted });
  assert.equal(again.isError, undefined);
  assert.match(textOf(again), /already closed/);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM events WHERE entity_id = ? AND type = 'job.cancelled'", quoted))[0].n, 1);
  // A plan that was turned down cannot be started afterwards.
  const startClosed = await call("start_job", { job_id: quoted });
  assert.equal(startClosed.isError, true);
  assert.match(textOf(startClosed), /declined or cancelled/);
  assert.match(textOf(await call("get_plan", { job_id: quoted })), /declined or cancelled/);
  assert.equal(fakes.confirmOrder.mock.callCount(), 0);

  // A request still waiting on answers can be dropped too.
  const draft = await insertJob(t, orgId, user, { status: "draft" });
  assert.equal((await call("decline_plan", { job_id: draft })).structuredContent.status, "cancelled");

  // A job that has started cannot be declined here.
  const running = await insertJob(t, orgId, user, { status: "running" });
  const tooLate = await call("decline_plan", { job_id: running });
  assert.equal(tooLate.isError, true);
  assert.match(textOf(tooLate), /Only a request that has not started can be declined\. This job is: In progress/);
  assert.match(textOf(tooLate), /useaiblocks\.com\/support/);
  const delivered = await insertJob(t, orgId, user, { status: "delivered" });
  const done = await call("decline_plan", { job_id: delivered });
  assert.equal(done.isError, true);
  assert.match(textOf(done), /accept_delivery/);
  assert.ok(!textOf(done).includes("support"));
  assert.equal((await t.sql("SELECT status FROM jobs WHERE id = ?", running))[0].status, "running");
  assert.equal((await call("decline_plan", {})).isError, true);
  assert.equal((await call("decline_plan", { job_id: quoted, reason: "x".repeat(1001) })).isError, true);
});

test("decline_plan works on a browse-only connection but needs hiring access, like the request pages", async () => {
  const readOnly = await setup({ allowOrder: false });
  const quoted = await insertJob(readOnly.t, readOnly.orgId, readOnly.user, { status: "quoted" });
  assert.equal((await readOnly.call("decline_plan", { job_id: quoted })).structuredContent.status, "cancelled");

  const noBeta = await setup({ beta: false, user: "user_nobeta" });
  const theirs = await insertJob(noBeta.t, noBeta.orgId, noBeta.user, { status: "quoted" });
  const res = await noBeta.call("decline_plan", { job_id: theirs });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /invite code/);
  assert.equal((await noBeta.t.sql("SELECT status FROM jobs WHERE id = ?", theirs))[0].status, "quoted");
});

// ---------- Rate limits ----------

const AT = Date.UTC(2026, 10, 6, 12, 0, 30); // 30 seconds into a minute, 30 seconds into an hour
const appA = { id: "user_buyer", via: "oauth" as const, sessionId: "mcg_a", scopes: ["marketplace:read", "marketplace:order"] };
const appB = { ...appA, sessionId: "mcg_b" };
const minute = (n: number) => AT + n * 60_000;

test("rate limits: costly tools pause first, per connection, and the next window starts fresh", async () => {
  const t = await testEnv();
  for (let i = 0; i < 20; i++) assert.equal(await takeToolCall(t.env, appA, true, AT), null, `costly call ${i + 1}`);
  const hit = (await takeToolCall(t.env, appA, true, AT))!;
  assert.ok(hit);
  assert.deepEqual({ per: hit.limit.per, tools: hit.limit.tools, windowSeconds: hit.limit.windowSeconds, max: hit.limit.max }, { per: "connection", tools: "costly", windowSeconds: 60, max: 20 });
  assert.equal(hit.retryAfterSeconds, 30);
  assert.match(hit.message, /new requests, plans and job starts are paused\. Wait about 30 seconds, then try again\. Browsing agents and checking jobs still work\./);
  // Reads still work on that connection, and another app of the same buyer is not paused.
  assert.equal(await takeToolCall(t.env, appA, false, AT), null);
  assert.equal(await takeToolCall(t.env, appB, true, AT), null);
  // The next minute is a new window.
  assert.equal(await takeToolCall(t.env, appA, true, minute(1)), null);
});

test("rate limits: every tool counts toward a ceiling per connection and per buyer", async () => {
  const t = await testEnv();
  for (let i = 0; i < 60; i++) assert.equal(await takeToolCall(t.env, appA, false, AT), null, `call ${i + 1}`);
  const app = (await takeToolCall(t.env, appA, false, AT))!;
  assert.equal(app.limit.per, "connection");
  assert.equal(app.limit.tools, "any");
  assert.equal(app.message, "Too many requests from this AI app. Wait about 30 seconds, then try again.");
  // The buyer's other app goes on until the buyer's own ceiling (120 a minute across apps).
  for (let i = 0; i < 59; i++) assert.equal(await takeToolCall(t.env, appB, false, AT), null, `app B call ${i + 1}`);
  const buyer = (await takeToolCall(t.env, appB, false, AT))!;
  assert.equal(buyer.limit.per, "user");
  assert.equal(buyer.message, "Too many requests from your connected AI apps. Wait about 30 seconds, then try again.");
  // Another buyer is not affected.
  assert.equal(await takeToolCall(t.env, { ...appA, id: "someone_else", sessionId: "mcg_c" }, false, AT), null);

  // When a costly call is over both limits, the one that blocks every tool is reported.
  const t2 = await testEnv();
  for (let i = 0; i < 20; i++) await takeToolCall(t2.env, appA, true, AT);
  for (let i = 0; i < 40; i++) await takeToolCall(t2.env, appA, false, AT);
  const both = (await takeToolCall(t2.env, appA, true, AT))!;
  assert.equal(both.limit.tools, "any");
  assert.match(both.message, /^Too many requests from this AI app/);
});

test("rate limits: a buyer can make at most 100 costly calls an hour across all their apps", async () => {
  const t = await testEnv();
  // Five calls per app per minute stays under the per-connection limit.
  for (let i = 0; i < 100; i++) {
    assert.equal(await takeToolCall(t.env, i % 2 ? appA : appB, true, minute(Math.floor(i / 10))), null, `costly call ${i + 1}`);
  }
  const hit = (await takeToolCall(t.env, appA, true, minute(10)))!;
  assert.equal(hit.limit.per, "user");
  assert.equal(hit.limit.windowSeconds, 3600);
  assert.equal(hit.retryAfterSeconds, 3600 - 10 * 60 - 30);
  assert.match(hit.message, /Wait about 50 minutes/);
  assert.equal(await takeToolCall(t.env, appA, false, minute(10)), null, "reads still work");
  assert.equal(LIMITS.length, 4);
});

test("/mcp answers a rate-limited tool call with HTTP 429, Retry-After and a JSON-RPC error", async () => {
  const { t, rpc, call, user } = await setup();
  const [grant] = await t.sql("SELECT id FROM mcp_grants WHERE user_id = ?", user);
  const oauthUser = { id: user, via: "oauth" as const, sessionId: grant.id as string };
  const costly = LIMITS.find(l => l.per === "connection" && l.tools === "costly")!;
  // Fill this window and the next, so the test passes even if a minute ends while it runs.
  const nowSeconds = Math.floor(Date.now() / 1000);
  for (const start of [windowStart(costly, nowSeconds), windowStart(costly, nowSeconds) + costly.windowSeconds]) {
    await t.sql("INSERT INTO mcp_rate_counts (bucket, window_start, count, expires_at) VALUES (?, ?, ?, ?)",
      bucketKey(costly, oauthUser), start, costly.max, new Date((start + costly.windowSeconds) * 1000).toISOString());
  }
  const res = await rpc("tools/call", { name: "start_request", arguments: { text: "A 1,500 word article about how often to groom a dog." } });
  assert.equal(res.status, 429);
  assert.equal(res.body.jsonrpc, "2.0");
  assert.equal(typeof res.body.id, "number");
  assert.equal(res.body.result, undefined);
  assert.equal(res.body.error.code, RATE_LIMITED_CODE);
  assert.match(res.body.error.message, /Wait about \d+ seconds?, then try again/);
  const retry = Number(res.res.headers.get("retry-after"));
  assert.ok(retry >= 1 && retry <= 60, String(retry));
  assert.equal(res.body.error.data.retry_after_seconds, retry);
  assert.deepEqual(res.body.error.data.limit, { per: "connection", tools: "costly", max: 20, window_seconds: 60 });
  assert.equal(res.body.error.data.reason, "rate_limited");
  assert.ok(res.res.headers.get("access-control-expose-headers")!.includes("retry-after"));
  assert.equal(fakes.startRequest.mock.callCount(), 0, "the tool never ran");
  // Reading still works, and only tool calls are counted.
  assert.equal((await call("get_job", {})).isError, undefined);
  assert.equal((await rpc("tools/list", {})).status, 200);
  const counted = await t.sql("SELECT bucket, count FROM mcp_rate_counts WHERE bucket LIKE '%:any:%' ORDER BY bucket");
  assert.deepEqual(counted.map(r => [r.bucket, r.count]), [[`grant:${grant.id}:any:60`, 2], [`user:${user}:any:60`, 2]]);

  // The cron drops counters once their window is over.
  await t.sql("UPDATE mcp_rate_counts SET expires_at = '2000-01-01T00:00:00.000Z' WHERE bucket LIKE '%:any:%'");
  await cleanupRateCounts(t.env);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM mcp_rate_counts WHERE bucket LIKE '%:any:%'"))[0].n, 0);
  const { scheduled } = await import("../src/modules/mcp/routes.ts");
  assert.ok(scheduled.includes(cleanupRateCounts));
});

test("if the counter cannot be written, tool calls still go through", async () => {
  const { t, call } = await setup();
  await t.sql("DROP TABLE mcp_rate_counts");
  const original = console.error;
  const logged: unknown[] = [];
  console.error = (...args: unknown[]) => { logged.push(args[0]); };
  try {
    assert.equal((await call("get_job", {})).isError, undefined);
  } finally { console.error = original; }
  assert.ok(logged.includes("mcp_rate_limit_unavailable"));
});

// ---------- Agents in the user's own AI (load_agent, get_agent_file, HOSTED_JOBS off) ----------

/** A stand-in for the built site's static files: nova-seo's files.json and the files it lists. */
function fakeAssets(extra: Record<string, string> = {}) {
  const files = [
    { path: "AGENTS.md", url: "/packs/nova-seo/AGENTS.md", bytes: 30, purpose: "Start here", kind: "start" },
    { path: "soul.md", url: "/packs/nova-seo/soul.md", bytes: 20, purpose: "Who I am", kind: "identity" },
    { path: "personality.md", url: "/packs/nova-seo/personality.md", bytes: 20, purpose: "How I talk", kind: "identity" },
    { path: "playbook.md", url: "/packs/nova-seo/playbook.md", bytes: 20, purpose: "How I work", kind: "work" },
    { path: "access.md", url: "/packs/nova-seo/access.md", bytes: 20, purpose: "What I may touch", kind: "work" },
    { path: "knowledge.md", url: "/packs/roles/seo-specialist/knowledge.md", bytes: 20, purpose: "Role knowledge", kind: "knowledge" },
  ];
  const body: Record<string, string> = {
    "/packs/nova-seo/files.json": JSON.stringify({ agent_id: "nova-seo", version: "1.2.0", updated: "2026-11-06", knowledge: "ready", zip: { url: "/packs/nova-seo.zip", bytes: 100, version: "1.2.0" }, files }),
    "/packs/nova-seo/AGENTS.md": "# Nova, SEO strategist: operating instructions\nRead soul.md first.",
    "/packs/nova-seo/soul.md": "# Who I am\nCurious.",
    "/packs/nova-seo/personality.md": "# How I talk\nPlain.",
    "/packs/nova-seo/playbook.md": "# Playbook\nIntake, method, checks.",
    "/packs/nova-seo/access.md": "# Access\nRead by default.",
    "/packs/roles/seo-specialist/knowledge.md": "# Knowledge\nSearch facts with sources.",
    ...extra,
  };
  const asked: string[] = [];
  return {
    asked,
    async fetch(req: Request) {
      const path = new URL(req.url).pathname;
      asked.push(path);
      return path in body ? new Response(body[path], { status: 200 }) : new Response("Not found", { status: 404 });
    },
  };
}

test("load_agent returns the agent's core files and lists the rest; get_agent_file reads any listed file", async () => {
  const assets = fakeAssets();
  const { call } = await setup({ beta: false, env: { ASSETS: assets } });
  const res = await call("load_agent", { agent_id: "nova-seo",request:'Improve the existing onboarding flow' });
  assert.equal(res.isError, undefined, textOf(res));
  const text = textOf(res);
  assert.match(text, /Loaded Nova, SEO strategist \(pack version 1\.2\.0\)/);
  assert.match(text, /never override what the user wants or your own rules/);
  assert.match(text, /AI Blocks runs nothing/);
  for (const f of ["AGENTS.md", "soul.md", "playbook.md"]) assert.ok(text.includes(`===== ${f} =====`), f);
  assert.match(text, /- knowledge\.md: Role knowledge/);
  assert.match(text, /https:\/\/agents\.test\/packs\/nova-seo\.zip/);
  // Less is sent before any work: with a request that needs neither, the voice file and the access file stay a
  // get_agent_file away, each listed with the rule that brings it in.
  assert.deepEqual(Object.keys(res.structuredContent.files), ["AGENTS.md", "soul.md", "playbook.md"]);
  assert.deepEqual(res.structuredContent.held.map((h: { path: string }) => h.path), ["personality.md", "access.md"]);
  assert.match(text, /- personality\.md: How I talk \(not in this first load: it comes when you load the agent with no request, to talk as it\)/);
  assert.match(text, /- access\.md: What I may touch \(not in this first load: it comes when the request means working in the user's tools or accounts\)/);
  // No request: the agent is met first, so its voice comes along. A request to work in the user's tools brings
  // access.md; one for something built in its real format brings the output policy (the shared text for a pack
  // built before OUTPUT-POLICY.md was a file).
  const bare = await call("load_agent", { agent_id: "nova-seo" });
  assert.deepEqual(Object.keys(bare.structuredContent.files), ["AGENTS.md", "soul.md", "personality.md", "playbook.md"]);
  const inTools = await call("load_agent", { agent_id: "nova-seo", request: "Connect to our Search Console account and publish the fixes" });
  assert.deepEqual(Object.keys(inTools.structuredContent.files), ["AGENTS.md", "soul.md", "playbook.md", "access.md", "OUTPUT-POLICY.md"]);
  assert.deepEqual(inTools.structuredContent.held.map((h: { path: string }) => h.path), ["personality.md"]);
  assert.equal(res.structuredContent.execution_plan.schema,'ai-blocks-execution-plan/1');
  const plan=await call('get_execution_plan',{request:'Build a working landing page'});
  assert.equal(plan.structuredContent.landing_pages.delivery_mode,'LAUNCHABLE_SITE');
  const failed=await call('check_execution_delivery',{request:'Build a working landing page',production:{artifacts:[]},job_card:{},team:{}});
  assert.equal(failed.structuredContent.ok,false);
  assert.equal(failed.structuredContent.hosted_execution,false);
  assert.deepEqual(res.structuredContent.other_files.map((f: { path: string }) => f.path), ["personality.md", "access.md", "knowledge.md"]);
  // The public loader introduction has no paid gate. The agent's factual-integrity
  // policy legitimately discusses prices and quotes as facts not to invent.
  assert.doesNotMatch(text.split('===== AGENTS.md =====')[0], MONEY_WORDS);
  assert.match(inTools.structuredContent.files['OUTPUT-POLICY.md'], /verified sources authorised for this task/);

  const file = await call("get_agent_file", { agent_id: "nova-seo", path: "knowledge.md" });
  assert.equal(file.isError, undefined, textOf(file));
  assert.match(textOf(file), /===== knowledge\.md \(Nova, Role knowledge\) =====\n# Knowledge/);
  assert.ok(assets.asked.includes("/packs/roles/seo-specialist/knowledge.md"), "shared role files are read from their own address");

  const outside = await call("get_agent_file", { agent_id: "nova-seo", path: "../../wrangler.jsonc" });
  assert.equal(outside.isError, true);
  assert.match(textOf(outside), /is not in Nova's pack\. Files: AGENTS\.md, soul\.md/);
  assert.ok(!assets.asked.some(p => p.includes("wrangler")), "only files listed in files.json are ever read");

  const expert = await call("load_agent", { agent_id: "pat-expert-seo" });
  assert.equal(expert.isError, true);
  assert.match(textOf(expert), /built by an expert and has no download yet/);
});

test("load_agent with a request returns the work method, the routed skill in full and the relevant knowledge, under 60 KB", async () => {
  const files = [
    { path: "AGENTS.md", url: "/packs/nova-seo/AGENTS.md", bytes: 30, purpose: "Start here", kind: "start" },
    { path: "WORK-METHOD.md", url: "/packs/nova-seo/WORK-METHOD.md", bytes: 30, purpose: "How every job runs", kind: "start" },
    { path: "context/README.md", url: "/packs/nova-seo/context/README.md", bytes: 30, purpose: "What to capture", kind: "start" },
    { path: "playbook.md", url: "/packs/nova-seo/playbook.md", bytes: 20, purpose: "How I work", kind: "work" },
    { path: "OUTPUT-POLICY.md", url: "/packs/nova-seo/OUTPUT-POLICY.md", bytes: 20, purpose: "Output policy", kind: "work" },
    { path: "knowledge.md", url: "/packs/roles/seo-specialist/knowledge.md", bytes: 20, purpose: "Role knowledge", kind: "knowledge" },
    { path: "skills/keyword-research/SKILL.md", url: "/packs/roles/seo-specialist/skills/keyword-research/SKILL.md", bytes: 20, purpose: "Skill: keywords", kind: "skill" },
    { path: "skills/seo-blog-post/SKILL.md", url: "/packs/jobs/seo-blog-post/SKILL.md", bytes: 20, purpose: "Skill: blog post", kind: "skill" },
  ];
  const routes = [
    { path: "skills/seo-blog-post/SKILL.md", kind: "job", name: "SEO blog post article blog", text: "One search-ready blog post." },
    { path: "skills/keyword-research/SKILL.md", kind: "skill", name: "keyword research", text: "Finds the searches that matter for one page." },
  ];
  const big = "x".repeat(70_000);
  const assets = fakeAssets({
    "/packs/nova-seo/files.json": JSON.stringify({ agent_id: "nova-seo", version: "2.0.0", updated: "2026-11-09", knowledge: "ready", files, routes }),
    "/packs/nova-seo/WORK-METHOD.md": "# Work method: the Grounded Job Protocol\n\n1. Ground first.",
    "/packs/nova-seo/context/README.md": "# Context: what to capture before the work",
    "/packs/nova-seo/OUTPUT-POLICY.md": "# Output policy",
    "/packs/roles/seo-specialist/skills/keyword-research/SKILL.md": "---\nname: keyword-research\n---\n# Keyword research\n\nStart from the seed keyword.",
    "/packs/jobs/seo-blog-post/SKILL.md": "# SEO blog post",
    "/packs/tools/ai-default-patterns.md": "# AI default patterns",
    "/packs/roles/seo-specialist/knowledge.md": `# Knowledge\n\n## 4. Benchmarks\n\nKeyword difficulty and search volume.\n\n## 5. Decision rules\n\nPick one search per page.\n\n## 9. Glossary\n\n${big}`,
  });
  const { t, call } = await setup({ beta: false, env: { HOSTED_JOBS: "off", ASSETS: assets } });
  const res = await call("load_agent", { agent_id: "nova-seo", request: "Do keyword research for our new page about dog grooming in Leeds" });
  assert.equal(res.isError, undefined, textOf(res));
  const data = res.structuredContent;
  assert.equal(data.routed.path, "skills/keyword-research/SKILL.md");
  assert.deepEqual(Object.keys(data.files).slice(0, 3), ["AGENTS.md", "WORK-METHOD.md", "context/README.md"], "the method comes right after the entry point");
  assert.match(data.files["skills/keyword-research/SKILL.md"], /Start from the seed keyword/);
  assert.deepEqual(data.knowledge_sections, ["4. Benchmarks", "5. Decision rules"], "relevant sections only; the huge glossary stays out");
  assert.ok(new TextEncoder().encode(textOf(res)).length < 60_000, "the first payload stays under 60 KB");
  assert.match(textOf(res), /For this request, follow skills\/keyword-research\/SKILL\.md/);
  // The same pack, one skill in one file for chat apps.
  const one = await t.api("GET", "/agents/nova-seo/skills/keyword-research.txt");
  assert.equal(one.status, 200);
  assert.match(one.res.headers.get("content-type") ?? "", /^text\/plain/);
  assert.match(one.body, /===== FILE: WORK-METHOD\.md =====[\s\S]*===== FILE: skills\/keyword-research\/SKILL\.md =====/);
  assert.equal((await t.api("GET", "/agents/nova-seo/skills/no-such-skill.txt")).status, 404);
  // The capture tools, served with their own content types; unknown names are refused.
  const tool = await t.api("GET", "/tools/ai-default-patterns.md");
  assert.equal(tool.status, 200);
  assert.match(tool.res.headers.get("content-type") ?? "", /^text\/markdown/);
  assert.equal((await t.api("GET", "/tools/capture-brand-dna.mjs")).status, 404, "not published in this build");
  assert.equal((await t.api("GET", "/tools/wrangler.jsonc")).status, 404);
});

test("load_agent on a pack with a curated toolbox sends toolbox.md right after AGENTS.md and routes no skill", async () => {
  const at = (path: string, kind: string, purpose = path) => ({ path, url: path.startsWith("toolbox/") ? `/packs/${path}` : `/packs/nova-seo/${path}`, bytes: 20, purpose, kind });
  const files = [
    at("AGENTS.md", "start"), at("toolbox.md", "start"), at("WORK-METHOD.md", "start"), at("context/README.md", "start"), at("soul.md", "identity"),
    at("personality.md", "identity"), at("playbook.md", "work"), at("access.md", "work"), at("OUTPUT-POLICY.md", "work"),
    { path: "knowledge.md", url: "/packs/roles/seo-specialist/knowledge.md", bytes: 20, purpose: "Role knowledge", kind: "knowledge" },
    { path: "skills/keyword-research/SKILL.md", url: "/packs/roles/seo-specialist/skills/keyword-research/SKILL.md", bytes: 20, purpose: "Skill: keywords", kind: "skill" },
    at("toolbox/skill/search-intent-mapper.md", "toolbox", "Skill: maps what a searcher wants."),
    at("toolbox/mind/edward-tufte.md", "toolbox", "Thinking lens: show the data."),
  ];
  const routes = [{ path: "skills/keyword-research/SKILL.md", kind: "skill", name: "keyword research", text: "Finds the searches that matter for one page." }];
  const toolbox = { schema: "ai-blocks-toolbox-summary/1", reviewed: "2026-11-10", tasks: [{ id: "keyword-map", task: "Map keywords to pages", kind: "analysis", mine: true, items: 2 }], counts: { kit: 1, skill: 1, mind: 1, total: 3 } };
  const assets = fakeAssets({
    "/packs/nova-seo/files.json": JSON.stringify({ agent_id: "nova-seo", version: "3.0.0", updated: "2026-11-10", knowledge: "ready", files, routes, toolbox }),
    "/packs/nova-seo/toolbox.md": "# Nova's toolbox\n\n### Map keywords to pages\n\n- When a page has no clear search: **Keyword research** (build, skill) `skills/keyword-research/SKILL.md`",
    "/packs/nova-seo/WORK-METHOD.md": "# Work method",
    "/packs/nova-seo/context/README.md": "# Context",
    "/packs/nova-seo/OUTPUT-POLICY.md": "# Output policy",
    "/packs/roles/seo-specialist/skills/keyword-research/SKILL.md": "# Keyword research\n\nStart from the seed keyword.",
    "/packs/toolbox/skill/search-intent-mapper.md": "# Search intent mapper\n\nWhat it gives: what a searcher wants.",
    "/packs/roles/seo-specialist/knowledge.md": "# Knowledge\n\n## 5. Decision rules\n\nPick one search per page.",
  });
  const { call } = await setup({ beta: false, env: { HOSTED_JOBS: "off", ASSETS: assets } });
  const res = await call("load_agent", { agent_id: "nova-seo", request: "Do keyword research for our new page about dog grooming in Leeds" });
  assert.equal(res.isError, undefined, textOf(res));
  const data = res.structuredContent;
  assert.deepEqual(Object.keys(data.files), ["AGENTS.md", "toolbox.md", "WORK-METHOD.md", "context/README.md", "soul.md", "playbook.md", "knowledge.md"], "toolbox.md right after the entry point; no skill pushed in full");
  assert.equal(data.routed, undefined, "nothing is routed by keyword: the agent picks from toolbox.md");
  assert.deepEqual(data.held.map((h: { path: string }) => h.path), ["personality.md", "access.md", "OUTPUT-POLICY.md"]);
  assert.equal(data.toolbox_items, 2);
  assert.ok(!data.other_files.some((f: { path: string }) => f.path.startsWith("toolbox/")), "item files are named in toolbox.md, not listed again");
  const text = textOf(res);
  assert.match(text, /Choose what fits this request from toolbox\.md below, at your own discretion, and read each file you choose with get_agent_file\./);
  assert.match(text, /never search for a skill/);
  assert.match(text, /- toolbox\/: 2 library items, each named in toolbox\.md with when to use it/);
  assert.doesNotMatch(text, /For this request, follow/);
  assert.ok(!assets.asked.includes("/packs/roles/seo-specialist/skills/keyword-research/SKILL.md"), "the skill is read only when the agent asks for it");
  // The agent opens what it chose by name: a role skill, or a library item stored once for every pack.
  const item = await call("get_agent_file", { agent_id: "nova-seo", path: "toolbox/skill/search-intent-mapper.md" });
  assert.equal(item.isError, undefined, textOf(item));
  assert.match(textOf(item), /===== toolbox\/skill\/search-intent-mapper\.md \(Nova, Skill: maps what a searcher wants\.\) =====\n# Search intent mapper/);
  assert.ok(assets.asked.includes("/packs/toolbox/skill/search-intent-mapper.md"), "read from the shared copy");
  const unknown = await call("get_agent_file", { agent_id: "nova-seo", path: "toolbox/skill/not-listed.md" });
  assert.equal(unknown.isError, true, "only files the pack lists; nothing is searched");
});

test("load_agent takes a job role and loads its lead agent, the way toolbox.md names a helper", async () => {
  const sageFiles = [{ path: "AGENTS.md", url: "/packs/sage-brand/AGENTS.md", bytes: 30, purpose: "Start here", kind: "start" }];
  const assets = fakeAssets({
    "/packs/sage-brand/files.json": JSON.stringify({ agent_id: "sage-brand", version: "1.0.0", updated: "2026-11-10", knowledge: "ready", files: sageFiles }),
    "/packs/sage-brand/AGENTS.md": "# Sage, Brand designer",
  });
  const { call } = await setup({ beta: false, env: { HOSTED_JOBS: "off", ASSETS: assets } });
  const res = await call("load_agent", { role_id: "brand-designer", request: "A logo brief for a bakery" });
  assert.equal(res.isError, undefined, textOf(res));
  assert.equal(res.structuredContent.agent_id, "sage-brand");
  assert.equal(res.structuredContent.role_id, "brand-designer");
  assert.match(textOf(res), /Loaded Sage, Brand designer/);
  const none = await call("load_agent", { role_id: "lion-tamer" });
  assert.equal(none.isError, true);
  assert.match(textOf(none), /No agent has the job role lion-tamer\. Call list_agents/);
  const neither = await call("load_agent", {});
  assert.equal(neither.isError, true);
  assert.match(textOf(neither), /Give agent_id \(from list_agents\), or role_id/);
});

test("load_agent says so plainly when the agent's files cannot be read", async () => {
  const { call } = await setup({ beta: false });
  const res = await call("load_agent", { agent_id: "nova-seo" });
  assert.equal(res.isError, true);
  assert.match(textOf(res), /Nova's files are not ready to load right now\. The user can see Nova at https:\/\/agents\.test\/agents\/nova-seo/);
});

test("with hosted jobs off, the connector finds and loads agents only, and never gets the scope to start jobs", async () => {
  const { t, rpc, call } = await setup({ beta: false, env: { HOSTED_JOBS: "off", ASSETS: fakeAssets() } });
  const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } });
  const instructions: string = init.body.result.instructions;
  assert.match(instructions.slice(0, 512), /load_agent/, "the steps fit in the first 512 characters");
  // One clear start, in under 120 words: find, load, then pick from the toolbox the agent already carries.
  assert.ok(instructions.split(/\s+/).length < 120, `${instructions.split(/\s+/).length} words`);
  assert.match(instructions, /Start any piece of work this way: call list_agents .* then load_agent/);
  assert.match(instructions, /choose from its toolbox\.md, and read each chosen file with get_agent_file/);
  assert.match(instructions, /never search for skills/);
  assert.doesNotMatch(instructions, /get_execution_plan/, "one start, not two");
  assert.match(instructions, /work on the user's own AI\. AI Blocks runs no work for you/);
  assert.doesNotMatch(instructions, /start_job|start_request/);
  assert.doesNotMatch(instructions, MONEY_WORDS);

  const list = await rpc("tools/list", {});
  assert.deepEqual(list.body.result.tools.map((x: { name: string }) => x.name), ["get_execution_plan", "check_execution_delivery", "list_agents", "get_agent", "load_agent", "load_team", "get_agent_file"]);

  const agents = await call("list_agents", {});
  assert.match(textOf(agents), /To use one, call load_agent with its agent_id/);
  assert.doesNotMatch(textOf(agents), /start_request|job_type_id|\[seo-blog-post\]/);
  const profile = await call("get_agent", { agent_id: "nova-seo" });
  assert.match(textOf(profile), /To work as Nova in this chat, on the user's own AI, call load_agent with agent_id nova-seo\./);
  assert.doesNotMatch(textOf(profile), /start_request/);

  // Job tools are not listed, and calling one anyway gets the same answer as the website.
  for (const name of ["start_request", "list_job_types", "get_job"]) {
    const res = await call(name, name === "start_request" ? { text: "Write a blog post about dog grooming." } : {});
    assert.equal(res.isError, true, name);
    assert.match(textOf(res), /Our agents work in your own AI, so we do not run jobs on this site\..*https:\/\/agents\.test\/connect/, name);
  }
  assert.equal(fakes.startRequest.mock.callCount(), 0);

  const loaded = await call("load_agent", { agent_id: "nova-seo" });
  assert.equal(loaded.isError, undefined, textOf(loaded));

  // setup() approved with "let it start jobs" ticked: the connection still only got browse access.
  const connections = await t.api("GET", "/api/oauth/connections", { user: "user_buyer" });
  assert.deepEqual(connections.body.connections[0].scopes.map((s: { id: string }) => s.id), ["marketplace:read"]);
});

test("with hosted jobs off, the AI Blocks team can still start jobs from their AI to test agents", async () => {
  const { t, call } = await setup({ env: { HOSTED_JOBS: "off" }, user: "user_ops" });
  await t.makeOps("user_ops");
  const res = await call("start_request", { text: "Write a 1,500 word article about dog grooming.", persona_id: "nova-seo" });
  assert.equal(res.isError, undefined, textOf(res));
  assert.equal(fakes.startRequest.mock.callCount(), 1);
});


test("load_team returns six isolated seat packs with a neutral coordinator and a dynamic task lead", async () => {
  const extra: Record<string, string> = {};
  for (const persona of SEAT_FIXTURES) {
    const base = `/packs/${persona.id}`;
    const files = ["soul.md", "access.md", "knowledge.md"].map(path => ({ path, url: `${base}/${path}`, purpose: path, kind: "work", bytes: 30 }));
    extra[`${base}/files.json`] = JSON.stringify({ agent_id: persona.id, version: "test", updated: "2026-11-07", files });
    extra[`${base}/soul.md`] = `# ${persona.name}\nSaved soul.`;
    extra[`${base}/access.md`] = "Read by default.";
    extra[`${base}/knowledge.md`] = "Unrelated role knowledge must be loaded on demand.";
  }
  const assets = fakeAssets(extra);
  const { call } = await setup({ beta: false, env: { HOSTED_JOBS: "off", ASSETS: assets } });
  const document = JSON.parse(readFileSync(new URL("./fixtures/team-plan-six-seats.json", import.meta.url), "utf8"));
  const result = await call("load_team", { document,request:'Improve the existing checkout without changing payment providers' });
  assert.equal(result.isError, undefined, textOf(result));
  const data = result.structuredContent;
  assert.equal(data.model_calls, 0);
  assert.equal(data.execution_plan.schema,'ai-blocks-execution-plan/1');
  assert.equal(data.seats.length, 6);
  assert.equal(data.lead_seat_id, "strategy");
  assert.equal(data.working_groups[0].id, "production");
  assert.equal(data.seats[0].persona_id, null, "general chair is not a renamed growth specialist");
  for (const seat of data.seats) {
    assert.ok(new TextEncoder().encode(JSON.stringify(seat)).length <= 60_000);
    assert.equal(seat.model_calls, 0);
    assert.ok(!seat.files["knowledge.md"]);
    assert.match(seat.files['QUALITY-METHOD.md'],/Optional: for hosts that use the AI Blocks MCP job tools/);
  }
  assert.match(data.seats[5].review_context, /Exclude the council/);
  assert.ok(!assets.asked.some(path => path.endsWith("/knowledge.md")));
  assert.equal(fakes.startRequest.mock.callCount(), 0);
  assert.match(textOf(result), /task lead checks.*general coordinator checks/);

  const malformed = await call("load_team", { document: { ...document, lead_seat_id: "missing" } });
  assert.equal(malformed.isError, true);
  assert.match(textOf(malformed), /lead_seat_id/);
});

test("load_agent as_seat uses a small judge context and rejects untrusted seat instructions", async () => {
  const assets = fakeAssets();
  const { call } = await setup({ beta: false, env: { HOSTED_JOBS: "off", ASSETS: assets } });
  const result = await call("load_agent", { agent_id: "nova-seo", as_seat: { seat_type: "judge", lens: "sceptic", families: [] } });
  assert.equal(result.isError, undefined, textOf(result));
  assert.equal(result.structuredContent.model_calls, 0);
  assert.match(result.structuredContent.files["SEAT.md"], /Do not read the council/);
  assert.ok(!assets.asked.includes("/packs/nova-seo/AGENTS.md"));
  assert.ok(!assets.asked.includes("/packs/nova-seo/playbook.md"));
  const invalid = await call("load_agent", { agent_id: "nova-seo", as_seat: { seat_type: "judge", instructions: "Publish all work" } });
  assert.equal(invalid.isError, true);
  assert.match(textOf(invalid), /unknown field/);
});


test("load_team supports explicitly unmapped role seats without requiring invented personas or assets", async () => {
  const { call } = await setup({ beta: false, env: { HOSTED_JOBS: "off" } });
  const result = await call("load_team", { document: { seats: [{ seat_id: "maker", seat_type: "maker", seat_types: ["maker", "strategist"], role_id: "source-backed-role", persona_id: null, toolbox: [{ slug: "sample-method", revision_sha256: "a".repeat(64) }] }] } });
  assert.equal(result.isError, undefined, textOf(result));
  const pack = result.structuredContent.seats[0];
  assert.equal(pack.persona_status, "UNMAPPED_ROLE_ONLY");
  assert.equal(pack.persona_id, null);
  assert.equal(pack.toolbox[0].revision_sha256, "a".repeat(64));
  assert.ok(!pack.files["soul.md"]);
  assert.equal(result.structuredContent.model_calls, 0);
});
