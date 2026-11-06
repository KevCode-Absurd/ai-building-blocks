// Ops console: gate numbers, beta codes, staff, seeding, agents, costs and ops alerts.
// Neighbour services (delivery, runner, directory, evaluation) are mocked so these tests do not depend on their build state.
import { test, mock } from "node:test";
import assert from "node:assert/strict";

const realDelivery = await import("../src/modules/delivery/service.ts");
const realRunner = await import("../src/modules/runner/service.ts");
const realDirectory = await import("../src/modules/directory/service.ts");
const realEvaluation = await import("../src/modules/evaluation/service.ts");

const calls: string[] = [];
const releaseDraft = mock.fn(async () => { throw new Error("not used here"); });
const startJobRun = mock.fn(async () => ({ runId: "run_x" }));
const seedPersonas = mock.fn(async (_env: unknown, actor: string) => { calls.push(`personas:${actor}`); return { created: 2, updated: 1 }; });
const seedHouseAgents = mock.fn(async (_env: unknown, actor: string) => { calls.push(`agents:${actor}`); return { created: 3 }; });
const winRates = mock.fn(async (_env: unknown, groupBy: string): Promise<any[]> => groupBy === "agent"
  ? [
    { key: "agent_nova_blog", tests: 4, judgments: 12, agentWins: 3, baselineWins: 1, ties: 0, winRate: 0.75 },
    { key: "agent_expert@1", tests: 2, judgments: 6, agentWins: 1, baselineWins: 1, ties: 0, winRate: 0.5 },
    { key: "agent_expert@2", tests: 2, judgments: 6, agentWins: 2, baselineWins: 0, ties: 0, winRate: 1 },
  ]
  : [{ key: "all", tests: 20, judgments: 60, agentWins: 14, baselineWins: 6, ties: 0, winRate: 0.7 }]);

mock.module("../src/modules/delivery/service.ts", { exports: { ...realDelivery, releaseDraft } });
mock.module("../src/modules/runner/service.ts", { exports: { ...realRunner, startJobRun, seedHouseAgents } });
mock.module("../src/modules/directory/service.ts", { exports: { ...realDirectory, seedPersonas } });
mock.module("../src/modules/evaluation/service.ts", { exports: { ...realEvaluation, winRates } });

const { testEnv } = await import("./helpers.ts");
const { gateMetrics, notifyOps } = await import("../src/modules/ops/service.ts");
type T = Awaited<ReturnType<typeof testEnv>>;

const OPS = "user_ops";
const NOW = new Date().toISOString();
const T0 = Date.parse("2026-09-01T00:00:00.000Z");
const at = (hours: number) => new Date(T0 + hours * 3_600_000).toISOString();

async function setup(overrides: Record<string, string> = {}): Promise<T> {
  calls.length = 0;
  for (const m of [releaseDraft, startJobRun, seedPersonas, seedHouseAgents, winRates]) m.mock.resetCalls();
  const t = await testEnv(overrides as any);
  await t.makeOps(OPS);
  return t;
}

async function user(t: T, id: string) {
  await t.grantBeta(id);
  return `org_${id}`;
}

async function job(t: T, j: { id: string; user: string; status: string; confirmedAt?: number; releasedAt?: number; revisions?: number; agentId?: string | null; deliveredAt?: string | null }) {
  await t.sql(`INSERT INTO jobs (id, org_id, created_by, status, job_type_id, title, agent_id, agent_version, revisions_used, delivered_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'seo-blog-post', ?, ?, ?, ?, ?, ?, ?)`, j.id, `org_${j.user}`, j.user, j.status, `Job ${j.id}`, j.agentId ?? null, j.agentId ? 1 : null,
  j.revisions ?? 0, j.deliveredAt ?? (j.releasedAt !== undefined ? at(j.releasedAt) : null), at(-1), at(j.releasedAt ?? 0));
  if (j.confirmedAt !== undefined) {
    await t.sql("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) VALUES (?, ?, 'user', 'job', ?, 'job.confirmed', '{}')", at(j.confirmedAt), j.user, j.id);
  }
  if (j.releasedAt !== undefined) {
    await t.sql("INSERT INTO runs (id, job_id, kind, status, created_at) VALUES (?, ?, 'job', 'succeeded', ?)", `run_${j.id}`, j.id, at(j.releasedAt));
    await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, fingerprint, released_at, created_at) VALUES (?, ?, ?, 1, 'x', 'fp', ?, ?)",
      `d_${j.id}`, j.id, `run_${j.id}`, at(j.releasedAt), at(j.releasedAt));
  }
}

async function decision(t: T, jobId: string, kind: string, by: string) {
  await t.sql("INSERT INTO decisions (id, job_id, draft_id, kind, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)", `dec_${jobId}_${kind}`, jobId, `d_${jobId}`, kind, by, NOW);
}

async function spend(t: T, id: string, jobId: string | null, usd: number, o: { day?: string; purpose?: string; ok?: number } = {}) {
  await t.sql("INSERT INTO model_calls (id, day, purpose, job_id, provider, model, input_tokens, output_tokens, cost_micro_usd, ok, created_at) VALUES (?, ?, ?, ?, 'fake', 'fake-1', 100, 50, ?, ?, ?)",
    id, o.day ?? NOW.slice(0, 10), o.purpose ?? "runner.step", jobId, Math.round(usd * 1_000_000), o.ok ?? 1, NOW);
}

// ---------- Gate ----------

test("gate numbers come from the record", async () => {
  const t = await setup();
  for (const [i, status] of (["approved", "approved", "approved", "applied", "paused"] as const).entries()) {
    const id = `user_expert_${i}`;
    await user(t, id);
    await t.sql("INSERT INTO experts (id, user_id, status, display_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)", `exp_${i}`, id, status, `Expert ${i}`, NOW, NOW);
  }
  for (const u of ["user_a", "user_b", "user_c", "user_d"]) await user(t, u);
  // Org A: two confirmed jobs 5 days apart (a repeat buyer). A1 accepted first time; A2 accepted after a revision.
  await job(t, { id: "job_a1", user: "user_a", status: "accepted", confirmedAt: 0, releasedAt: 10 });
  await decision(t, "job_a1", "accept", "user_a");
  await job(t, { id: "job_a2", user: "user_a", status: "accepted", confirmedAt: 120, releasedAt: 140, revisions: 1 });
  await decision(t, "job_a2", "revise", "user_a");
  await decision(t, "job_a2", "accept", "user_a");
  // Org B: second job 40 days after the first (not a repeat within 30 days). B1 rejected; B2 delivered, no answer yet.
  await job(t, { id: "job_b1", user: "user_b", status: "rejected", confirmedAt: 0, releasedAt: 30 });
  await decision(t, "job_b1", "reject", "user_b");
  await job(t, { id: "job_b2", user: "user_b", status: "delivered", confirmedAt: 960, releasedAt: 964 });
  // Org C: one confirmed job, still running. Org D: only a quote, never confirmed.
  await job(t, { id: "job_c1", user: "user_c", status: "running", confirmedAt: 24 });
  await job(t, { id: "job_d1", user: "user_d", status: "quoted" });
  await spend(t, "mc_1", "job_a1", 0.4);
  await spend(t, "mc_2", "job_a2", 0.6);
  await spend(t, "mc_3", "job_b1", 0.5);
  await spend(t, "mc_4", null, 1.0, { purpose: "studio.compile" });

  const res = await t.api("GET", "/api/ops/gate", { user: OPS });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, {
    experts: { approved: 3, target: 50 },
    jobs: { delivered: 4, accepted: 2, target: 100 },
    blindWinRate: { value: 0.7, tests: 20, target: 0.65 },
    repeatBuyers: { value: 0.3333, buyers: 3, target: 0.3 },
    firstPassAcceptance: 0.3333,
    medianHoursToFirstDraft: 15,
    modelCostPerJobUsd: 0.75,
  });
  assert.equal(winRates.mock.calls[0].arguments[1], "all");
});

test("gate numbers are empty, not wrong, before there is any data or when win rates are not ready", async () => {
  const t = await setup();
  winRates.mock.mockImplementationOnce(async () => { throw new Error("evaluation.winRates is not built yet"); });
  const g = await gateMetrics(t.env);
  assert.deepEqual(g, {
    experts: { approved: 0, target: 50 },
    jobs: { delivered: 0, accepted: 0, target: 100 },
    blindWinRate: { value: null, tests: 0, target: 0.65 },
    repeatBuyers: { value: null, buyers: 0, target: 0.3 },
    firstPassAcceptance: null,
    medianHoursToFirstDraft: null,
    modelCostPerJobUsd: null,
  });
});

test("a job with no confirmed event still counts once it is past confirmation", async () => {
  const t = await setup();
  await user(t, "user_a");
  await t.sql("INSERT INTO jobs (id, org_id, created_by, status, created_at, updated_at) VALUES ('job_1', 'org_user_a', 'user_a', 'running', ?, ?), ('job_2', 'org_user_a', 'user_a', 'confirmed', ?, ?), ('job_3', 'org_user_a', 'user_a', 'cancelled', ?, ?)",
    at(0), at(0), at(48), at(48), at(50), at(50));
  const g = await gateMetrics(t.env);
  assert.deepEqual(g.repeatBuyers, { value: 1, buyers: 1, target: 0.3 });
});

// ---------- Beta codes ----------

test("beta codes: ops creates them, buyers redeem them through /api/beta/redeem, uses show in the list", async () => {
  const t = await setup();
  const res = await t.api("POST", "/api/ops/beta-codes", { user: OPS, body: { count: 3, max_uses: 2, note: "Shopify founders group", expires_at: "2099-12-31" } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(res.body.codes.length, 3);
  assert.equal(new Set(res.body.codes).size, 3);
  for (const c of res.body.codes) assert.match(c, /^AB-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
  assert.equal(res.body.expires_at, "2099-12-31T23:59:59.999Z");
  const code: string = res.body.codes[0];

  assert.equal((await t.api("GET", "/api/me", { user: "user_x" })).body.betaAccess, false);
  assert.equal((await t.api("POST", "/api/beta/redeem", { user: "user_x", email: "x@example.com", body: { code: code.toLowerCase() } })).status, 200);
  assert.equal((await t.api("GET", "/api/me", { user: "user_x" })).body.betaAccess, true);
  assert.equal((await t.api("POST", "/api/beta/redeem", { user: "user_y", body: { code } })).status, 200);
  assert.equal((await t.api("POST", "/api/beta/redeem", { user: "user_z", body: { code } })).status, 400, "max uses reached");

  const list = await t.api("GET", "/api/ops/beta-codes", { user: OPS });
  const row = list.body.codes.find((c: any) => c.code === code);
  assert.equal(row.uses, 2);
  assert.equal(row.max_uses, 2);
  assert.equal(row.state, "used_up");
  assert.equal(row.note, "Shopify founders group");
  assert.deepEqual(row.redeemed.map((r: any) => r.user_id).sort(), ["user_x", "user_y"]);
  assert.equal(list.body.codes.filter((c: any) => c.state === "active").length, 2);
  const ev = await t.sql("SELECT actor_kind FROM events WHERE type = 'beta_code.created'");
  assert.equal(ev.length, 3);
  assert.ok(ev.every(e => e.actor_kind === "ops"));
});

test("beta codes: defaults, expiry and bad input", async () => {
  const t = await setup();
  const one = await t.api("POST", "/api/ops/beta-codes", { user: OPS, body: {} });
  assert.equal(one.status, 200);
  assert.equal(one.body.codes.length, 1);
  assert.equal(one.body.max_uses, 1);
  assert.equal(one.body.expires_at, null);
  assert.equal((await t.api("POST", "/api/ops/beta-codes", { user: OPS, body: { count: 0 } })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/beta-codes", { user: OPS, body: { count: 101 } })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/beta-codes", { user: OPS, body: { max_uses: -1 } })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/beta-codes", { user: OPS, body: { expires_at: "2020-01-01" } })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/beta-codes", { user: OPS, body: { expires_at: "next week" } })).status, 400);

  await t.sql("INSERT INTO beta_codes (code, max_uses, created_by, created_at, expires_at) VALUES ('AB-OLDD-CODE', 5, ?, ?, '2020-01-01T00:00:00.000Z')", OPS, NOW);
  const list = await t.api("GET", "/api/ops/beta-codes", { user: OPS });
  assert.equal(list.body.codes.find((c: any) => c.code === "AB-OLDD-CODE").state, "expired");
  assert.equal((await t.api("POST", "/api/beta/redeem", { user: "user_x", body: { code: "AB-OLDD-CODE" } })).status, 400);
});

// ---------- Staff ----------

test("staff changes take effect in /api/me", async () => {
  const t = await setup({ OPS_USER_IDS: "user_founder" });
  await t.api("GET", "/api/me", { user: "user_rita", email: "rita@example.com" });
  await t.api("GET", "/api/me", { user: "user_founder", email: "founder@example.com" });
  const before = await t.api("GET", "/api/me", { user: "user_rita" });
  assert.deepEqual(before.body.roles, { ops: false, reviewer: false });

  const add = await t.api("POST", "/api/ops/staff", { user: OPS, body: { action: "add", role: "reviewer", email: "RITA@example.com" } });
  assert.equal(add.status, 200, JSON.stringify(add.body));
  assert.equal(add.body.changed, true);
  assert.deepEqual((await t.api("GET", "/api/me", { user: "user_rita" })).body.roles, { ops: false, reviewer: true });

  assert.equal((await t.api("POST", "/api/ops/staff", { user: OPS, body: { role: "ops", user_id: "user_rita" } })).status, 200);
  assert.deepEqual((await t.api("GET", "/api/me", { user: "user_rita" })).body.roles, { ops: true, reviewer: true });
  assert.equal((await t.api("GET", "/api/ops/jobs", { user: "user_rita" })).status, 200);

  const list = await t.api("GET", "/api/ops/staff", { user: OPS });
  assert.deepEqual(list.body.staff.filter((s: any) => s.user_id === "user_rita").map((s: any) => s.role).sort(), ["ops", "reviewer"]);
  assert.equal(list.body.staff.find((s: any) => s.user_id === "user_rita").email, "rita@example.com");
  assert.deepEqual(list.body.settings_ops, [{ user_id: "user_founder", email: "founder@example.com" }]);

  assert.equal((await t.api("POST", "/api/ops/staff", { user: OPS, body: { action: "remove", role: "ops", email: "rita@example.com" } })).status, 200);
  assert.equal((await t.api("POST", "/api/ops/staff", { user: OPS, body: { action: "remove", role: "reviewer", user_id: "user_rita" } })).status, 200);
  assert.deepEqual((await t.api("GET", "/api/me", { user: "user_rita" })).body.roles, { ops: false, reviewer: false });
  assert.equal((await t.api("GET", "/api/ops/jobs", { user: "user_rita" })).status, 403);

  const types = await t.sql("SELECT type, actor_kind FROM events WHERE entity = 'user' AND entity_id = 'user_rita' AND type LIKE 'staff.%' ORDER BY seq");
  assert.deepEqual(types.map(e => e.type), ["staff.added", "staff.added", "staff.removed", "staff.removed"]);
  assert.ok(types.every(e => e.actor_kind === "ops"));

  const again = await t.api("POST", "/api/ops/staff", { user: OPS, body: { action: "remove", role: "reviewer", user_id: "user_rita" } });
  assert.equal(again.body.changed, false);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM events WHERE type = 'staff.removed'"))[0].n, 2, "no event when nothing changed");
});

test("staff changes refuse unknown people, bad roles and removing your own ops access", async () => {
  const t = await setup({ OPS_USER_IDS: "user_founder" });
  await t.api("GET", "/api/me", { user: "user_founder" });
  assert.equal((await t.api("POST", "/api/ops/staff", { user: OPS, body: { role: "reviewer", email: "nobody@example.com" } })).status, 404);
  assert.equal((await t.api("POST", "/api/ops/staff", { user: OPS, body: { role: "admin", user_id: OPS } })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/staff", { user: OPS, body: { role: "reviewer" } })).status, 400);
  assert.equal((await t.api("POST", "/api/ops/staff", { user: OPS, body: { action: "remove", role: "ops", user_id: OPS } })).status, 400);
  await t.api("POST", "/api/ops/staff", { user: OPS, body: { role: "ops", user_id: "user_founder" } });
  const res = await t.api("POST", "/api/ops/staff", { user: OPS, body: { action: "remove", role: "ops", user_id: "user_founder" } });
  assert.equal(res.body.still_ops_from_settings, true);
  assert.equal((await t.api("GET", "/api/me", { user: "user_founder" })).body.roles.ops, true);
});

// ---------- Seed, agents, costs ----------

test("seed runs the directory first, then the runner, and returns both counts", async () => {
  const t = await setup();
  const res = await t.api("POST", "/api/ops/seed", { user: OPS });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { personas: { created: 2, updated: 1 }, agents: { created: 3 } });
  assert.deepEqual(calls, [`personas:${OPS}`, `agents:${OPS}`]);
  const [ev] = await t.sql("SELECT actor_kind, data FROM events WHERE type = 'ops.seeded'");
  assert.equal(ev.actor_kind, "ops");

  seedHouseAgents.mock.mockImplementationOnce(async () => { throw new Error("runner.seedHouseAgents is not built yet"); });
  const broken = await t.api("POST", "/api/ops/seed", { user: OPS });
  assert.equal(broken.status, 503);
  assert.match(broken.body.error.message, /house agents were not/);
});

test("the cron seeds when this build's house content changed since the last seed, and only then", async () => {
  const t = await setup();
  const { seedIfContentChanged, houseContentVersion } = await import("../src/modules/ops/actions.ts");
  assert.equal(await seedIfContentChanged(t.env), "seeded", "nothing seeded yet");
  assert.deepEqual(calls, ["personas:system", "agents:system"]);
  const [ev] = await t.sql("SELECT actor_kind, data FROM events WHERE type = 'ops.seeded'");
  assert.equal(ev.actor_kind, "system");
  assert.equal(JSON.parse(ev.data).content_version, await houseContentVersion());
  assert.equal(await seedIfContentChanged(t.env), "current");
  assert.equal(calls.length, 2, "no second seed for the same content");

  // The latest seed counts: one from an older build seeds again. (Events are append-only, so add a newer one.)
  const older = () => t.sql("INSERT INTO events (at, actor, actor_kind, entity, entity_id, type, data) VALUES (?, 'system', 'system', 'system', 'seed', 'ops.seeded', ?)", NOW, JSON.stringify({ content_version: "cat-old/0000" }));
  await older();
  assert.equal(await seedIfContentChanged(t.env), "seeded");
  // Errors are logged, never thrown from the cron.
  await older();
  seedHouseAgents.mock.mockImplementationOnce(async () => { throw new Error("runner down"); });
  assert.equal(await seedIfContentChanged(t.env), "failed");
});

test("agents list shows persona, job type, live version, jobs, acceptance and win rate", async () => {
  const t = await setup();
  await t.sql("INSERT INTO personas (id, kind, name, title, tagline, area, status, sort, created_at, updated_at) VALUES ('nova-seo', 'house', 'Nova', 'SEO strategist', 'x', 'marketing', 'live', 10, ?, ?)", NOW, NOW);
  await user(t, "user_expert");
  await t.sql("INSERT INTO experts (id, user_id, status, display_name, created_at, updated_at) VALUES ('exp_1', 'user_expert', 'approved', 'Dana Ruiz', ?, ?)", NOW, NOW);
  await t.sql("INSERT INTO agents (id, kind, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agent_nova_blog', 'house', 'nova-seo', 'seo-blog-post', 'Nova blog', 'live', 1, ?, ?)", NOW, NOW);
  await t.sql("INSERT INTO agents (id, kind, expert_id, job_type_id, name, status, created_at, updated_at) VALUES ('agent_expert', 'expert', 'exp_1', 'landing-page-copy', 'Dana landing pages', 'testing', ?, ?)", NOW, NOW);
  await t.sql("INSERT INTO agent_versions (agent_id, version, package, sha256, status, created_at) VALUES ('agent_nova_blog', 1, '{}', 's', 'published', ?), ('agent_expert', 1, '{}', 's', 'published', ?), ('agent_expert', 2, '{}', 's', 'draft', ?)", NOW, NOW, NOW);
  await user(t, "user_a");
  await job(t, { id: "job_1", user: "user_a", status: "accepted", agentId: "agent_nova_blog" });
  await job(t, { id: "job_2", user: "user_a", status: "rejected", agentId: "agent_nova_blog" });
  await job(t, { id: "job_3", user: "user_a", status: "running", agentId: "agent_nova_blog" });

  const res = await t.api("GET", "/api/ops/agents", { user: OPS });
  assert.equal(res.status, 200);
  const [nova, dana] = res.body.agents;
  assert.equal(nova.id, "agent_nova_blog");
  assert.equal(nova.persona_name, "Nova");
  assert.equal(nova.job_type_title, "SEO blog post");
  assert.equal(nova.kind, "house");
  assert.equal(nova.live_version, 1);
  assert.equal(nova.jobs, 3);
  assert.equal(nova.accepted, 1);
  assert.equal(nova.acceptance_rate, 0.5);
  assert.equal(nova.win_rate, 0.75);
  assert.equal(nova.blind_tests, 4);
  assert.equal(dana.id, "agent_expert");
  assert.equal(dana.expert_name, "Dana Ruiz");
  assert.equal(dana.latest_version, 1);
  assert.equal(dana.acceptance_rate, null);
  assert.equal(dana.win_rate, 0.75, "per-version keys are combined: 3 wins, 1 loss");
  assert.equal(dana.blind_tests, 4);

  assert.deepEqual((await t.api("GET", "/api/ops/agents?status=testing", { user: OPS })).body.agents.map((a: any) => a.id), ["agent_expert"]);
  assert.deepEqual((await t.api("GET", "/api/ops/agents?kind=house", { user: OPS })).body.agents.map((a: any) => a.id), ["agent_nova_blog"]);
  assert.deepEqual((await t.api("GET", "/api/ops/agents?q=dana", { user: OPS })).body.agents.map((a: any) => a.id), ["agent_expert"]);
});

test("costs show spend by day, by purpose and by job, and today against the daily cap", async () => {
  const t = await setup({ DAILY_MODEL_CAP_USD: "4" });
  await user(t, "user_a");
  await job(t, { id: "job_1", user: "user_a", status: "running" });
  await job(t, { id: "job_2", user: "user_a", status: "running" });
  const todayDay = NOW.slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  await spend(t, "mc_1", "job_1", 1.25, { purpose: "runner.step" });
  await spend(t, "mc_2", "job_1", 0.25, { purpose: "evaluation.rubric", ok: 0 });
  await spend(t, "mc_3", "job_2", 0.5, { purpose: "runner.step", day: yesterday });
  await spend(t, "mc_4", null, 0.1, { purpose: "intake.classify", day: yesterday });
  await spend(t, "mc_old", "job_2", 9, { purpose: "runner.step", day: "2025-01-01" });

  const res = await t.api("GET", "/api/ops/costs", { user: OPS });
  assert.equal(res.status, 200);
  const c = res.body;
  assert.deepEqual(c.today, { day: todayDay, usd: 1.5, calls: 2, cap_usd: 4, share: 0.375 });
  assert.deepEqual(c.days, [{ day: todayDay, usd: 1.5, calls: 2, failed: 1 }, { day: yesterday, usd: 0.6, calls: 2, failed: 0 }]);
  assert.deepEqual(c.purposes.map((p: any) => [p.purpose, p.usd, p.calls]), [["runner.step", 1.75, 2], ["evaluation.rubric", 0.25, 1], ["intake.classify", 0.1, 1]]);
  assert.deepEqual(c.jobs.map((j: any) => [j.job_id, j.usd, j.title]), [["job_1", 1.5, "Job job_1"], ["job_2", 0.5, "Job job_2"]]);
});

// ---------- Alerts ----------

test("notifyOps reaches every OPS_USER_IDS and staff ops user once, and never throws", async () => {
  const t = await setup({ OPS_USER_IDS: "user_founder, user_ghost, user_both" });
  await t.api("GET", "/api/me", { user: "user_founder", email: "founder@example.com" });
  await t.makeOps("user_both");
  await t.makeOps("user_staff");
  await t.makeReviewer("user_reviewer");
  await notifyOps(t.env, { kind: "ops.review_needed", subject: "A draft needs your OK", text: "Job job_1 is waiting.", link: "/ops/jobs/job_1" });
  const rows = await t.sql("SELECT user_id, to_email, kind, subject, link FROM notifications ORDER BY user_id");
  assert.deepEqual(rows.map(r => r.user_id), ["user_both", "user_founder", "user_ops", "user_staff"]);
  assert.ok(rows.every(r => r.kind === "ops.review_needed" && r.link === "https://agents.test/ops/jobs/job_1"));
  assert.equal(rows.find(r => r.user_id === "user_founder").to_email, "founder@example.com");

  const broken = { ...t.env, DB: { prepare() { throw new Error("database is down"); } } as any };
  await assert.doesNotReject(notifyOps(broken, { kind: "x", subject: "x", text: "x" }));
  await assert.doesNotReject(notifyOps(t.env, { kind: "x", subject: "x", text: "x", link: "http://[bad" }));
});
