// Runner: house packages, seeding, agent picking, job runs (start, execute, checks, cost cap, failures).
// evaluation, delivery and ops are mocked so these tests do not depend on how far those modules are built.
import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Env } from "../src/env.ts";
import type { Persona, PolicyResult, RubricResult } from "../src/core/types.ts";

type CheckResult = { passed: boolean; rubric: RubricResult; policy: PolicyResult; feedback: string };
const passed = (): CheckResult => ({ passed: true, rubric: { criteria: [], passed: true, score: 1 }, policy: { passed: true, flags: [] }, feedback: "" });
const failed = (feedback: string): CheckResult => ({ passed: false, rubric: { criteria: [], passed: false, score: 0.4 }, policy: { passed: true, flags: [] }, feedback });

const calls = { check: [] as any[], release: [] as any[], ops: [] as any[], after: [] as any[] };
const impl = {
  check: async (_input: any): Promise<CheckResult> => passed(),
  after: async (_input: any): Promise<{ blindTestId: string | null }> => ({ blindTestId: null }),
};

/** Every export of a neighbour module as a stub, with our overrides. Read from source so the real module never loads. */
function stubModule(rel: string, overrides: Record<string, unknown>): Record<string, unknown> {
  const src = readFileSync(new URL(rel, import.meta.url), "utf8");
  const out: Record<string, unknown> = {};
  for (const m of src.matchAll(/^export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)) {
    out[m[1]] = async () => { throw new Error(`${m[1]} is not mocked in the runner tests`); };
  }
  return { ...out, ...overrides };
}

mock.module("../src/modules/evaluation/service.ts", { exports: stubModule("../src/modules/evaluation/service.ts", {
  checkDraft: async (_env: Env, input: any) => { calls.check.push(input); return impl.check(input); },
  afterJobDraft: async (_env: Env, input: any) => { calls.after.push(input); return impl.after(input); },
}) });
mock.module("../src/modules/delivery/service.ts", { exports: stubModule("../src/modules/delivery/service.ts", {
  releaseDraft: async (env: Env, input: any) => {
    calls.release.push(input);
    const { transitionJob } = await import("../src/core/jobs.ts");
    await env.DB.prepare("UPDATE drafts SET released_at = ?, released_by = ? WHERE id = ?").bind(new Date().toISOString(), input.actor, input.draftId).run();
    return transitionJob(env, { jobId: input.jobId, to: "delivered", actor: input.actor, actorKind: input.actorKind });
  },
}) });
mock.module("../src/modules/ops/service.ts", { exports: stubModule("../src/modules/ops/service.ts", {
  notifyOps: async (_env: Env, notice: any) => { calls.ops.push(notice); },
}) });

const { testEnv } = await import("./helpers.ts");
type TestEnv = Awaited<ReturnType<typeof testEnv>>;
const runner = await import("../src/modules/runner/service.ts");
const packages = await import("../src/modules/runner/packages.ts");
const { registerFake, ModelError } = await import("../src/core/models.ts");
const { getJob, transitionJob } = await import("../src/core/jobs.ts");
const { sha256Hex, stableJson } = await import("../src/core/db.ts");
const { housePersonas, setPersonasForTests } = await import("../src/modules/directory/index.ts");
const { releaseDraft } = await import("../src/modules/delivery/service.ts");
const { LANDING_PAGE, BLOG_POST, NOVA } = await import("./fixtures.ts");

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

const REQUEST = "We sell a $29/month scheduling app for dog groomers. Most are one-person shops booking by text message. We want them to start a free trial.";
const SPEC = { product: "A $29/month scheduling app for dog groomers", audience: "One-person dog grooming shops", goal: "Sign up" };

async function insertPersona(t: TestEnv, p: Persona) {
  await t.sql("INSERT INTO personas (id, kind, name, title, tagline, area, profile, status, sort, created_at, updated_at) VALUES (?, 'house', ?, ?, ?, ?, ?, ?, ?, 'x', 'x')",
    p.id, p.name, p.title, p.tagline, p.area, JSON.stringify(p.profile), p.status, p.sort);
}

/** A fresh env with Nova seeded and her house agents built; mocks reset. */
async function setup(over: Partial<Env> = {}): Promise<TestEnv> {
  const t = await testEnv(over);
  for (const list of Object.values(calls)) list.length = 0;
  impl.check = async () => passed();
  impl.after = async () => ({ blindTestId: null });
  await insertPersona(t, NOVA);
  await runner.seedHouseAgents(t.env, "test");
  return t;
}

let jobSeq = 0;
async function makeJob(t: TestEnv, o: { status?: string; jobTypeId?: string; personaId?: string | null } = {}): Promise<string> {
  await t.grantBeta("user_buyer");
  const id = `job_${String(++jobSeq).padStart(4, "0")}`;
  await t.sql("INSERT INTO jobs (id, org_id, created_by, status, job_type_id, persona_id, title, created_at, updated_at) VALUES (?, 'org_user_buyer', 'user_buyer', ?, ?, ?, 'Groomer landing page', 'x', 'x')",
    id, o.status ?? "confirmed", o.jobTypeId ?? "landing-page-copy", o.personaId === undefined ? "nova-seo" : o.personaId);
  await t.sql("INSERT INTO briefs (job_id, request_text, spec, created_at, updated_at) VALUES (?, ?, ?, 'x', 'x')", id, REQUEST, JSON.stringify(SPEC));
  await t.sql("INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) VALUES (?, ?, 'x', 'x', 'x')", id, JSON.stringify(LANDING_PAGE.rubric));
  return id;
}

const jobEvents = async (t: TestEnv, jobId: string) =>
  (await t.sql("SELECT type, data FROM events WHERE entity = 'job' AND entity_id = ? ORDER BY seq", jobId)).map(e => ({ type: e.type, data: JSON.parse(e.data) }));
const status = async (t: TestEnv, jobId: string) => (await getJob(t.env, jobId))!.status;

// ---------- Packages ----------

test("house packages are deterministic and built from the persona's method", async () => {
  const a = packages.buildHousePackage(NOVA, LANDING_PAGE);
  const b = packages.buildHousePackage(structuredClone(NOVA), structuredClone(LANDING_PAGE));
  assert.deepEqual(a, b);
  assert.equal(await packages.packageSha(a), await packages.packageSha(b));
  assert.equal(await packages.packageSha(a), await sha256Hex(stableJson(a)));
  assert.equal(a.schema, "ai-blocks-agent/1");
  assert.equal(a.job_type_id, "landing-page-copy");
  assert.deepEqual(a.steps.map(s => [s.id, s.tier, s.output]), [["plan", "standard", "markdown"], ["draft", "standard", "markdown"], ["check_and_fix", "standard", "markdown"]]);
  assert.ok(a.skill.instructions.includes(NOVA.profile.method));
  assert.ok(a.skill.instructions.includes("Buying links"), "persona not_for");
  assert.ok(a.skill.instructions.includes("Fake reviews or invented testimonials"), "job type not_for");
  assert.ok(a.skill.instructions.includes(LANDING_PAGE.deliverable));
  for (const c of LANDING_PAGE.rubric) assert.ok(a.skill.instructions.includes(c.pass_rule));
  assert.ok(a.banned_patterns.some(p => /invented quotes, testimonials or reviews/i.test(p)));
  assert.ok(a.banned_patterns.some(p => /invented numbers/i.test(p)));
  assert.ok(!a.banned_patterns.some(p => p.includes("seamless") || p.includes("unlock")), "cosmetic vocabulary bans are not integrity rules");
  assert.ok(a.style_rules.some(r => /current task first/.test(r)));
  assert.match(a.skill.name, /^[a-z0-9-]{1,64}$/);
  // Prompts use only the documented placeholders, and steps only refer to earlier steps.
  const seen: string[] = [];
  for (const step of a.steps) {
    for (const m of step.prompt.matchAll(/\{\{([^}]+)\}\}/g)) {
      assert.match(m[1], /^(request|spec|rubric|brand|output_contract|previous|feedback|step:[a-z_]+)$/);
      if (m[1].startsWith("step:")) assert.ok(seen.includes(m[1].slice(5)), `${step.id} uses ${m[1]} before it exists`);
    }
    seen.push(step.id);
  }
});

test("a persona's soul goes into its instructions and a soul.md file, without overriding facts or tone", async () => {
  const soul = {
    essence: "A former bike mechanic who treats every page like a gear train.",
    temperament: "Patient and exact. I check each part before I move on.",
    voice: "Plain and friendly. \"Here's the one change that matters most.\"",
    values: ["Pages that load fast", "One clear next step"],
    quirks: ["I read the page out loud", "I write the button last"],
    pushback: "If the brief has no proof, I say so and leave a placeholder instead of guessing.",
    off_hours: "I fix old bikes on Sundays, so I like parts that fit without forcing.",
  };
  const withSoul = { ...structuredClone(NOVA), profile: { ...structuredClone(NOVA.profile), soul } };
  const pkg = packages.buildHousePackage(withSoul, LANDING_PAGE);
  assert.match(pkg.skill.instructions, /## Who you are\nA former bike mechanic/);
  assert.ok(pkg.skill.instructions.includes(soul.pushback));
  assert.match(pkg.skill.instructions, /never changes the facts or the checklist/);
  assert.ok(pkg.files.some(f => f.path === "reference/soul.md" && f.content.includes(soul.off_hours)));
  assert.notEqual(await packages.packageSha(pkg), await packages.packageSha(packages.buildHousePackage(NOVA, LANDING_PAGE)));
  assert.ok(!packages.buildHousePackage(NOVA, LANDING_PAGE).skill.instructions.includes("## Who you are"), "no soul, no section");
});

test("generic house packages use a strong generic method; long jobs draft on the premium tier", async () => {
  const generic = packages.buildHousePackage(null, LANDING_PAGE);
  assert.ok(!generic.skill.instructions.includes(NOVA.profile.method));
  assert.match(generic.skill.instructions, /Read the request and the details twice/);
  assert.match(generic.skill.instructions, /\[add your price\]/);
  assert.notEqual(await packages.packageSha(generic), await packages.packageSha(packages.buildHousePackage(NOVA, LANDING_PAGE)));
  const whitePaper = { ...BLOG_POST, id: "white-paper", turnaround_hours: 96, price: { ...BLOG_POST.price, base_usd: 299 } };
  const long = packages.buildHousePackage(null, whitePaper);
  assert.deepEqual(long.steps.map(s => s.tier), ["standard", "premium", "standard"]);
  assert.ok(long.steps[1].max_tokens > generic.steps[1].max_tokens);
});

test("prompts are filled in one pass, so the buyer's own text is never expanded", () => {
  const out = packages.renderPrompt("A {{request}} B {{feedback}} C {{step:plan}} D {{spec}} E {{previous}}", {
    request: "Use {{feedback}} literally", spec: { product: "App", proof: ["4.7 stars", "2,100 reviews"] }, specFields: LANDING_PAGE.spec_fields,
    rubric: [], brand: {}, previous: "", feedback: "", steps: { plan: "P" },
  });
  assert.match(out, /^A Use \{\{feedback\}\} literally B \(none\) C P D /);
  assert.match(out, /- What are you selling\? \[product\]: App/);
  assert.match(out, /\[proof\]: 4\.7 stars; 2,100 reviews/);
  assert.match(out, /E \(none: this is the first version\)$/);
});

// ---------- Seeding ----------

test("seeding builds one agent per persona outcome, a generic agent per uncovered job type, and is idempotent", async () => {
  const t = await testEnv();
  const lena: Persona = {
    ...NOVA, id: "lena-pages", name: "Lena", sort: 20,
    profile: {
      ...NOVA.profile,
      outcomes: [
        { id: "page", title: "A landing page", deliverable: "Full landing page copy.", job_type_id: "landing-page-copy" },
        { id: "page_again", title: "Another landing page", deliverable: "Same job type, one agent.", job_type_id: "landing-page-copy" },
        { id: "unknown", title: "Not on the menu", deliverable: "x", job_type_id: "not-in-catalogue" },
        { id: "hint", title: "Quoted by hand", deliverable: "x", job_type_id: null, job_type_hint: "seo plan" },
      ],
    },
  };
  await insertPersona(t, lena);
  await insertPersona(t, { ...NOVA, id: "hidden-one", name: "Hid", status: "hidden" });
  assert.deepEqual(await runner.seedHouseAgents(t.env, "ops_1"), { created: 2, updated: 0 });
  const agents = await t.sql("SELECT kind, persona_id, job_type_id, status, live_version FROM agents ORDER BY job_type_id");
  assert.deepEqual(agents, [
    { kind: "house", persona_id: "lena-pages", job_type_id: "landing-page-copy", status: "live", live_version: 1 },
    { kind: "house", persona_id: null, job_type_id: "seo-blog-post", status: "live", live_version: 1 },
  ]);
  const versions = await t.sql("SELECT version, status, sha256, package, published_at FROM agent_versions");
  for (const v of versions) {
    assert.equal(v.version, 1);
    assert.equal(v.status, "published");
    assert.ok(v.published_at);
    assert.equal(v.sha256, await sha256Hex(stableJson(JSON.parse(v.package))));
  }
  const lenaPkg = JSON.parse((await t.sql("SELECT package FROM agent_versions v JOIN agents a ON a.id = v.agent_id WHERE a.persona_id = 'lena-pages'"))[0].package);
  assert.ok(lenaPkg.skill.instructions.includes(NOVA.profile.method));

  assert.deepEqual(await runner.seedHouseAgents(t.env, "ops_1"), { created: 0, updated: 0 });
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM agent_versions"))[0].n, 2);

  // A changed method publishes version 2 and leaves version 1 exactly as it was.
  const before = (await t.sql("SELECT v.package, v.sha256 FROM agent_versions v JOIN agents a ON a.id = v.agent_id WHERE a.persona_id = 'lena-pages'"))[0];
  await t.sql("UPDATE personas SET profile = ? WHERE id = 'lena-pages'", JSON.stringify({ ...lena.profile, method: "1. A new way of working." }));
  assert.deepEqual(await runner.seedHouseAgents(t.env, "ops_1"), { created: 0, updated: 1 });
  const after = await t.sql("SELECT v.version, v.package, v.sha256 FROM agent_versions v JOIN agents a ON a.id = v.agent_id WHERE a.persona_id = 'lena-pages' ORDER BY v.version");
  assert.equal(after.length, 2);
  assert.equal(after[0].package, before.package);
  assert.equal(after[0].sha256, before.sha256);
  assert.match(JSON.parse(after[1].package).skill.instructions, /A new way of working/);
  assert.equal((await t.sql("SELECT live_version FROM agents WHERE persona_id = 'lena-pages'"))[0].live_version, 2);
  const types = (await t.sql("SELECT type FROM events WHERE entity = 'agent'")).map(e => e.type);
  assert.equal(types.filter(x => x === "agent.created").length, 2);
  assert.equal(types.filter(x => x === "agent.version_published").length, 3);
});

test("seeding reads the directory data when the personas table is empty", async () => {
  const original = housePersonas();
  setPersonasForTests([NOVA]);
  try {
    const t = await testEnv();
    assert.deepEqual(await runner.seedHouseAgents(t.env, "ops_1"), { created: 2, updated: 0 });
    assert.deepEqual((await t.sql("SELECT persona_id, job_type_id FROM agents ORDER BY job_type_id")).map(r => [r.persona_id, r.job_type_id]),
      [["nova-seo", "landing-page-copy"], ["nova-seo", "seo-blog-post"]]);
    assert.equal((await t.sql("SELECT COUNT(*) AS n FROM personas WHERE id = 'nova-seo'"))[0].n, 1);
    assert.deepEqual(await runner.seedHouseAgents(t.env, "ops_1"), { created: 0, updated: 0 });
  } finally {
    setPersonasForTests(original);
  }
});

// ---------- Picking ----------

test("pickAgent: the persona's live agent, else a live expert agent, else the house agent", async () => {
  const t = await setup();
  const novaPage = (await t.sql("SELECT id FROM agents WHERE persona_id = 'nova-seo' AND job_type_id = 'landing-page-copy'"))[0].id;
  assert.deepEqual(await runner.pickAgent(t.env, "landing-page-copy", "nova-seo"), { agentId: novaPage, version: 1 });
  assert.equal((await runner.pickAgent(t.env, "landing-page-copy", null))?.agentId, novaPage, "house agent when nothing else is live");

  await t.grantBeta("user_exp");
  await t.sql("INSERT INTO experts (id, user_id, status, display_name, created_at, updated_at) VALUES ('exp_1', 'user_exp', 'approved', 'Sam', 'x', 'x')");
  await t.sql("INSERT INTO agents (id, kind, expert_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agent_exp', 'expert', 'exp_1', 'landing-page-copy', 'Sam pages', 'live', 1, 'x', 'x')");
  await t.sql("INSERT INTO agent_versions (agent_id, version, package, sha256, status, created_at, published_at) VALUES ('agent_exp', 1, ?, 'sha', 'published', 'x', 'x')", JSON.stringify(packages.buildHousePackage(null, LANDING_PAGE)));
  assert.equal((await runner.pickAgent(t.env, "landing-page-copy", null))?.agentId, "agent_exp");
  assert.equal((await runner.pickAgent(t.env, "landing-page-copy", "someone-else"))?.agentId, "agent_exp");
  assert.equal((await runner.pickAgent(t.env, "landing-page-copy", "nova-seo"))?.agentId, novaPage, "the chosen persona still wins");

  await t.sql("UPDATE agents SET status = 'retired' WHERE id = 'agent_exp'");
  assert.equal((await runner.pickAgent(t.env, "landing-page-copy", null))?.agentId, novaPage);
  assert.equal(await runner.pickAgent(t.env, "not-in-catalogue", null), null);
});

test("pickAgent prefers the generic house agent over another persona's", async () => {
  const t = await testEnv();
  await insertPersona(t, { ...NOVA, profile: { ...NOVA.profile, outcomes: [NOVA.profile.outcomes[0]] } }); // Nova covers the blog post only
  await runner.seedHouseAgents(t.env, "test");
  const generic = (await t.sql("SELECT id FROM agents WHERE persona_id IS NULL AND job_type_id = 'landing-page-copy'"))[0].id;
  assert.equal((await runner.pickAgent(t.env, "landing-page-copy", "nova-seo"))?.agentId, generic);
});

// ---------- Starting runs ----------

test("startJobRun pins the agent, creates the run, moves the job to running and starts the workflow", async () => {
  const t = await setup();
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  const job = (await getJob(t.env, jobId))!;
  const novaPage = (await t.sql("SELECT id FROM agents WHERE persona_id = 'nova-seo' AND job_type_id = 'landing-page-copy'"))[0].id;
  assert.equal(job.status, "running");
  assert.equal(job.agent_id, novaPage);
  assert.equal(job.agent_version, 1);
  assert.deepEqual(t.workflowCalls, [{ id: runId, params: { runId } }]);
  const [run] = await t.sql("SELECT kind, status, attempt, workflow_id, agent_id, input FROM runs WHERE id = ?", runId);
  assert.equal(run.kind, "job");
  assert.equal(run.status, "queued");
  assert.equal(run.attempt, 1);
  assert.equal(run.workflow_id, runId);
  const input = JSON.parse(run.input);
  assert.equal(input.mode, "job");
  assert.equal(input.brief, REQUEST);
  assert.deepEqual(input.spec, SPEC);
  assert.equal(input.rubric.length, 5);
  const ev = (await jobEvents(t, jobId)).at(-1)!;
  assert.equal(ev.type, "job.running");
  assert.equal(ev.data.run_id, runId);
  await assert.rejects(runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" }), /cannot start on it right now/);
  await assert.rejects(runner.startJobRun(t.env, { jobId, actor: "ops_1", actorKind: "ops", kind: "revision" }), /cannot start/);
});

test("startJobRun handles reruns from review and revisions after delivery, keeping the pinned version", async () => {
  const t = await setup();
  const jobId = await makeJob(t);
  const first = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  const firstDraft = (await runner.executeRun(t.env, first.runId)).draftId!;
  assert.equal(await status(t, jobId), "in_review");

  // Ops rerun with a note: same agent version, the note and the earlier draft go into the prompts.
  const prompts: string[] = [];
  registerFake("runner.step.draft", req => { prompts.push(req.prompt); return { text: "# Shorter headline draft\n\nBody." }; });
  const rerun = await runner.startJobRun(t.env, { jobId, actor: "ops_1", actorKind: "ops", kind: "rerun", feedback: "Make the headline shorter." });
  const [rerunRow] = await t.sql("SELECT kind, attempt, agent_version, input FROM runs WHERE id = ?", rerun.runId);
  assert.equal(rerunRow.kind, "job");
  assert.equal(rerunRow.attempt, 2);
  assert.equal(rerunRow.agent_version, 1);
  assert.equal(JSON.parse(rerunRow.input).previousDraftId, firstDraft);
  const second = (await runner.executeRun(t.env, rerun.runId)).draftId!;
  assert.match(prompts[0], /Our reviewer asked for these changes:\nMake the headline shorter\./);
  assert.ok(prompts[0].includes("## Earlier version\n# "), "the earlier draft is shown");
  assert.equal(await status(t, jobId), "in_review");
  assert.equal(calls.after.length, 1, "the baseline comparison runs only after the first job draft");

  // Released, then the buyer asks for changes: a revision run from the released draft.
  await releaseDraft(t.env, { jobId, draftId: second, actor: "ops_1", actorKind: "ops" });
  await transitionJob(t.env, { jobId, to: "revising", actor: "user_buyer", actorKind: "user" });
  const rev = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user", kind: "revision", feedback: "Mention the free trial in the headline." });
  const [revRow] = await t.sql("SELECT kind, input FROM runs WHERE id = ?", rev.runId);
  assert.equal(revRow.kind, "revision");
  assert.equal(JSON.parse(revRow.input).previousDraftId, second);
  await runner.executeRun(t.env, rev.runId);
  assert.match(prompts[1], /The buyer asked for these changes:\nMention the free trial/);
  assert.equal(await status(t, jobId), "in_review");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM drafts WHERE job_id = ?", jobId))[0].n, 3);
  assert.deepEqual((await t.sql("SELECT version FROM drafts WHERE job_id = ? ORDER BY version", jobId)).map(d => d.version), [1, 2, 3]);
});

test("without a workflow binding the run executes inline", async () => {
  const t = await setup({ JOB_RUN: undefined });
  const jobId = await makeJob(t);
  await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  assert.equal(await status(t, jobId), "in_review");
});

test("startJobRun tells ops when no agent can take the job", async () => {
  const t = await testEnv();
  for (const list of Object.values(calls)) list.length = 0;
  const jobId = await makeJob(t, { personaId: null });
  await assert.rejects(runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" }), /No agent is ready/);
  assert.equal(await status(t, jobId), "confirmed");
  assert.equal(calls.ops[0].kind, "no_agent");
});

// ---------- Executing runs ----------

test("executeRun: steps, draft, checking, in review and an ops alert", async () => {
  const t = await setup();
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  const { draftId } = await runner.executeRun(t.env, runId);
  assert.ok(draftId);

  const steps = await t.sql("SELECT seq, step_id, status, provider, model, input_tokens, output_tokens FROM run_steps WHERE run_id = ? ORDER BY seq", runId);
  assert.deepEqual(steps.map(s => [s.seq, s.step_id, s.status, s.provider]), [[1, "plan", "succeeded", "fake"], [2, "draft", "succeeded", "fake"], [3, "check_and_fix", "succeeded", "fake"]]);
  assert.ok(steps.every(s => s.input_tokens > 0 && s.output_tokens > 0));
  const mc = await t.sql("SELECT purpose, job_id, run_id FROM model_calls ORDER BY created_at, rowid");
  assert.deepEqual(mc.map(c => c.purpose), ["runner.step.plan", "runner.step.draft", "runner.step.check_and_fix"]);
  assert.ok(mc.every(c => c.job_id === jobId && c.run_id === runId));

  const [draft] = await t.sql("SELECT job_id, run_id, version, content, format, fingerprint FROM drafts WHERE id = ?", draftId);
  assert.equal(draft.job_id, jobId);
  assert.equal(draft.version, 1);
  assert.equal(draft.format, "markdown");
  assert.equal(draft.fingerprint, await sha256Hex(draft.content + jobId));
  // The demo fake writes a specific landing page from the brief, with no invented claims or hype.
  assert.match(draft.content, /^# .+/);
  assert.match(draft.content, /dog groom/i);
  assert.ok(draft.content.includes("$29/month"));
  assert.match(draft.content, /## Questions people ask/);
  for (const w of packages.HYPE_WORDS) assert.ok(!draft.content.toLowerCase().includes(w), `hype word: ${w}`);
  assert.ok(!draft.content.includes("—"), "no em dashes");

  const [run] = await t.sql("SELECT status, input_tokens, finished_at FROM runs WHERE id = ?", runId);
  assert.equal(run.status, "succeeded");
  assert.ok(run.input_tokens > 0 && run.finished_at);
  assert.deepEqual((await jobEvents(t, jobId)).map(e => e.type), ["job.running", "job.checking", "job.in_review"]);
  assert.equal(calls.check.length, 1);
  assert.equal(calls.check[0].draftId, draftId);
  assert.equal(calls.check[0].jobTypeId, "landing-page-copy");
  assert.equal(calls.check[0].brief, REQUEST);
  assert.equal(calls.check[0].rubric.length, 5);
  assert.equal(calls.check[0].writerProvider, "fake");
  assert.deepEqual(calls.ops.map(o => [o.kind, o.link]), [["draft_ready", `/ops/jobs/${jobId}`]]);
  assert.deepEqual(calls.after, [{ jobId, draftId }]);
  assert.equal(calls.release.length, 0);

  // Calling it again (a workflow retry) changes nothing.
  assert.deepEqual(await runner.executeRun(t.env, runId), { draftId });
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM drafts"))[0].n, 1);
  assert.equal(calls.check.length, 1);
});

test("with RELEASE_REVIEW off a passing draft is released to the buyer", async () => {
  const t = await setup({ RELEASE_REVIEW: "off" });
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  const { draftId } = await runner.executeRun(t.env, runId);
  assert.equal(await status(t, jobId), "delivered");
  assert.deepEqual(calls.release, [{ jobId, draftId, actor: "system", actorKind: "system" }]);
  assert.equal(calls.ops.length, 0);
});

test("a failed check reruns once with the check feedback, then goes to review", async () => {
  const t = await setup();
  let n = 0;
  impl.check = async () => (++n === 1 ? failed("The headline does not name the audience.") : passed());
  const prompts: string[] = [];
  registerFake("runner.step.draft", req => { prompts.push(req.prompt); return { text: `# Draft ${prompts.length}\n\nBody.` }; });
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  const { draftId } = await runner.executeRun(t.env, runId);

  const runs = await t.sql("SELECT id, attempt, status, input FROM runs WHERE job_id = ? ORDER BY attempt", jobId);
  assert.equal(runs.length, 2);
  assert.deepEqual(runs.map(r => r.status), ["succeeded", "succeeded"]);
  const second = JSON.parse(runs[1].input);
  assert.equal(second.checkRerun, true);
  assert.equal(second.checkFeedback, "The headline does not name the audience.");
  assert.match(prompts[1], /Our quality check found these problems in the earlier version\. Fix every one:\nThe headline does not name the audience\./);
  assert.match(prompts[1], /## Earlier version\n# Draft 1/);
  const drafts = await t.sql("SELECT id, version, run_id FROM drafts WHERE job_id = ? ORDER BY version", jobId);
  assert.deepEqual(drafts.map(d => [d.version, d.run_id]), [[1, runs[0].id], [2, runs[1].id]]);
  assert.equal(draftId, drafts[1].id);

  const events = await jobEvents(t, jobId);
  assert.deepEqual(events.map(e => e.type), ["job.running", "job.checking", "job.running", "job.checking", "job.in_review"]);
  assert.equal(events[2].data.reason, "check_failed");
  assert.equal(events[4].data.checks_failed, undefined);
  assert.equal(calls.check.length, 2);
  assert.deepEqual(calls.after, [{ jobId, draftId }]);
  assert.deepEqual(calls.ops.map(o => o.kind), ["draft_ready"]);
});

test("two failed checks: in review with checks_failed and an ops alert, never released", async () => {
  const t = await setup({ RELEASE_REVIEW: "off" });
  impl.check = async () => failed("Invented a review.");
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  await runner.executeRun(t.env, runId);
  assert.equal(await status(t, jobId), "in_review");
  const last = (await jobEvents(t, jobId)).at(-1)!;
  assert.equal(last.type, "job.in_review");
  assert.equal(last.data.checks_failed, true);
  assert.deepEqual(calls.ops.map(o => o.kind), ["draft_failed_checks"]);
  assert.equal(calls.release.length, 0);
  assert.equal(calls.check.length, 2);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM runs WHERE job_id = ?", jobId))[0].n, 2);
});

test("the job cost cap stops the run cleanly before the next model call", async () => {
  const t = await setup();
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  await t.sql("INSERT INTO runs (id, job_id, kind, status, cost_micro_usd, created_at) VALUES ('run_earlier', ?, 'baseline', 'succeeded', 2000000, '2000-01-01T00:00:00.000Z')", jobId);
  assert.deepEqual(await runner.executeRun(t.env, runId), { draftId: null });
  const [run] = await t.sql("SELECT status, error FROM runs WHERE id = ?", runId);
  assert.equal(run.status, "failed");
  assert.match(run.error, /spending limit/);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM run_steps WHERE run_id = ?", runId))[0].n, 0);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM model_calls"))[0].n, 0);
  assert.equal(await status(t, jobId), "failed");
  assert.equal((await jobEvents(t, jobId)).at(-1)!.data.reason, "job_cost_cap");
  assert.deepEqual(calls.ops.map(o => o.kind), ["job_run_failed"]);
});

test("the cost cap counts live spend step by step across the job's runs", async () => {
  const t = await setup({ MODEL_MODE: "live", ANTHROPIC_API_KEY: "sk-ant-test", DAILY_MODEL_CAP_USD: "100", JOB_COST_CAP_USD: "2" });
  let fetches = 0;
  globalThis.fetch = (async () => {
    fetches++;
    // Sonnet: 100k in x $2/M + 100k out x $10/M = $1.20 per step.
    return new Response(JSON.stringify({ model: "claude-sonnet-5-5", content: [{ type: "text", text: "# Step output\n\nText." }], stop_reason: "end_turn", usage: { input_tokens: 100_000, output_tokens: 100_000 } }), { status: 200 });
  }) as typeof fetch;
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  await runner.executeRun(t.env, runId);
  assert.equal(fetches, 2, "the third step would pass the $2 cap, so it never runs");
  const [run] = await t.sql("SELECT status, cost_micro_usd FROM runs WHERE id = ?", runId);
  assert.equal(run.status, "failed");
  assert.equal(run.cost_micro_usd, 2_400_000);
  const steps = await t.sql("SELECT step_id, provider, model, cost_micro_usd FROM run_steps WHERE run_id = ? ORDER BY seq", runId);
  assert.deepEqual(steps, [
    { step_id: "plan", provider: "anthropic", model: "claude-sonnet-5-5", cost_micro_usd: 1_200_000 },
    { step_id: "draft", provider: "anthropic", model: "claude-sonnet-5-5", cost_micro_usd: 1_200_000 },
  ]);
  assert.equal(await status(t, jobId), "failed");
});

test("a provider error fails the run and the job, and alerts ops", async () => {
  const t = await setup();
  registerFake("runner.step.draft", () => { throw new ModelError("provider_busy", "The AI provider is busy right now (HTTP 429).", true); });
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  assert.deepEqual(await runner.executeRun(t.env, runId), { draftId: null });
  const [run] = await t.sql("SELECT status, error FROM runs WHERE id = ?", runId);
  assert.equal(run.status, "failed");
  assert.match(run.error, /busy/);
  const steps = await t.sql("SELECT step_id, status, error FROM run_steps WHERE run_id = ? ORDER BY seq", runId);
  assert.deepEqual(steps.map(s => [s.step_id, s.status]), [["plan", "succeeded"], ["draft", "failed"]]);
  assert.match(steps[1].error, /busy/);
  assert.equal(await status(t, jobId), "failed");
  assert.equal((await jobEvents(t, jobId)).at(-1)!.data.reason, "provider_busy");
  assert.equal(calls.ops[0].kind, "job_run_failed");
  assert.match(calls.ops[0].text, /busy/);
  assert.equal(calls.check.length, 0);
  assert.equal((await t.sql("SELECT type FROM events WHERE entity = 'run' AND entity_id = ? ORDER BY seq", runId)).map(e => e.type).at(-1), "run.failed");
});

test("evaluation errors never fail the job", async () => {
  const t = await setup();
  impl.after = async () => { throw new Error("baseline exploded"); };
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  await runner.executeRun(t.env, runId);
  assert.equal(await status(t, jobId), "in_review");
  assert.ok((await jobEvents(t, jobId)).some(e => e.type === "evaluation.after_draft_failed"));

  // If the checks themselves cannot run, the draft still goes to a person.
  const t2 = await setup({ RELEASE_REVIEW: "off" });
  impl.check = async () => { throw new Error("judge down"); };
  const job2 = await makeJob(t2);
  const r2 = await runner.startJobRun(t2.env, { jobId: job2, actor: "user_buyer", actorKind: "user" });
  await runner.executeRun(t2.env, r2.runId);
  assert.equal(await status(t2, job2), "in_review");
  assert.equal((await jobEvents(t2, job2)).at(-1)!.data.check_error, true);
  assert.deepEqual(calls.ops.map(o => o.kind), ["check_error"]);
  assert.equal(calls.release.length, 0);
});

test("a cancelled job stops its queued run", async () => {
  const t = await setup();
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  await transitionJob(t.env, { jobId, to: "cancelled", actor: "ops_1", actorKind: "ops" });
  assert.deepEqual(await runner.executeRun(t.env, runId), { draftId: null });
  assert.equal((await t.sql("SELECT status FROM runs WHERE id = ?", runId))[0].status, "cancelled");
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM model_calls"))[0].n, 0);
});

// ---------- Runs outside a job ----------

test("runBaseline and runAgentOnBrief write drafts that are never the job's draft", async () => {
  const t = await setup();
  const jobId = await makeJob(t);
  const base = await runner.runBaseline(t.env, { jobTypeId: "landing-page-copy", brief: REQUEST, spec: SPEC, rubric: LANDING_PAGE.rubric, jobId });
  const [baseRun] = await t.sql("SELECT kind, job_id, status, agent_id FROM runs WHERE id = ?", base.runId);
  assert.deepEqual(baseRun, { kind: "baseline", job_id: jobId, status: "succeeded", agent_id: null });
  const [baseDraft] = await t.sql("SELECT job_id, content, fingerprint FROM drafts WHERE id = ?", base.draftId);
  assert.equal(baseDraft.job_id, null);
  assert.ok(baseDraft.content.length > 50);
  assert.equal(baseDraft.fingerprint, await sha256Hex(baseDraft.content + jobId));
  assert.deepEqual((await t.sql("SELECT purpose FROM model_calls")).map(c => c.purpose), ["runner.baseline"]);

  const agentId = (await t.sql("SELECT id FROM agents WHERE persona_id = 'nova-seo' AND job_type_id = 'landing-page-copy'"))[0].id;
  const bench = await runner.runAgentOnBrief(t.env, { agentId, version: 1, brief: LANDING_PAGE.sample_briefs[1].text, kind: "test", actor: "user_exp" });
  const [benchRun] = await t.sql("SELECT kind, job_id, status FROM runs WHERE id = ?", bench.runId);
  assert.deepEqual(benchRun, { kind: "test", job_id: null, status: "succeeded" });
  assert.equal((await t.sql("SELECT job_id FROM drafts WHERE id = ?", bench.draftId))[0].job_id, null);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM run_steps WHERE run_id = ?", bench.runId))[0].n, 3);
  await assert.rejects(runner.runAgentOnBrief(t.env, { agentId, version: 9, brief: "x", kind: "test", actor: "user_exp" }), /package is incomplete/);
});

// ---------- Scheduled ----------

test("runs that never finish are failed by the sweep, and ops hears about it", async () => {
  const t = await setup();
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  assert.equal(await runner.sweepStaleRuns(t.env), 0);
  assert.equal(await runner.sweepStaleRuns(t.env, new Date(Date.now() + 3 * 3600_000)), 1);
  assert.equal((await t.sql("SELECT status FROM runs WHERE id = ?", runId))[0].status, "failed");
  assert.equal(await status(t, jobId), "failed");
  assert.equal(calls.ops.at(-1).kind, "job_run_failed");
});

// ---------- Web search ----------

test("web search: text steps may search; cited pages reach later steps and the draft's sources list", async () => {
  const t = await setup({ WEB_SEARCH_MAX_USES: "4" });
  const page = { url: "https://www.ftc.gov/business-guidance/resources/example", title: "FTC guidance" };
  const seen: { id: string; webSearch?: number; prompt: string }[] = [];
  registerFake("runner.step.plan", req => { seen.push({ id: "plan", webSearch: req.webSearch, prompt: req.prompt }); return { text: "Plan: lead with the free trial.", sources: [page] }; });
  registerFake("runner.step.draft", req => { seen.push({ id: "draft", webSearch: req.webSearch, prompt: req.prompt }); return { text: "# Book more grooms\n\nStart your free trial." }; });
  registerFake("runner.step.check_and_fix", req => { seen.push({ id: "check", webSearch: req.webSearch, prompt: req.prompt }); return { text: "# Book more grooms\n\nStart your free trial today." }; });
  const jobId = await makeJob(t);
  const { runId } = await runner.startJobRun(t.env, { jobId, actor: "user_buyer", actorKind: "user" });
  const { draftId } = await runner.executeRun(t.env, runId);

  assert.deepEqual(seen.map(s => [s.id, s.webSearch]), [["plan", 4], ["draft", 4], ["check", 4]]);
  assert.ok(seen[1].prompt.includes(`Pages this step cited:\n- FTC guidance: ${page.url}`), "the draft step can cite the plan's pages");
  const [plan] = await t.sql("SELECT sources FROM run_steps WHERE run_id = ? AND step_id = 'plan'", runId);
  assert.deepEqual(JSON.parse(plan.sources), [page]);
  const [draft] = await t.sql("SELECT content FROM drafts WHERE id = ?", draftId);
  assert.equal(draft.content, `# Book more grooms\n\nStart your free trial today.\n\n## Sources from web search\n\n- [FTC guidance](${page.url})`);
});

test("web search is off unless WEB_SEARCH_MAX_USES is set; the sources list skips pages the text already links", () => {
  assert.equal(runner.webSearchUses({} as Env), 0);
  assert.equal(runner.webSearchUses({ WEB_SEARCH_MAX_USES: "0" } as Env), 0);
  assert.equal(runner.webSearchUses({ WEB_SEARCH_MAX_USES: "five" } as Env), 0);
  assert.equal(runner.webSearchUses({ WEB_SEARCH_MAX_USES: "5" } as Env), 5);
  assert.equal(runner.webSearchUses({ WEB_SEARCH_MAX_USES: "500" } as Env), 20);
  const a = { url: "https://a.example/x", title: "A [draft]" }, b = { url: "https://b.example/p_(1)", title: "B" };
  assert.equal(runner.withSources("Text citing https://a.example/x.", [a]), "Text citing https://a.example/x.");
  assert.equal(runner.withSources("Text.", [a, b]), "Text.\n\n## Sources from web search\n\n- [A draft](https://a.example/x)\n- [B](https://b.example/p_%281%29)");
  assert.equal(runner.withSources("Text.", []), "Text.");
});
