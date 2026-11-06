// Experts module: the approved expert's dashboard (agents, jobs, buyer edits, win rates) and persona sync. No prices: hiring is free.
import { test, mock } from "node:test";
import assert from "node:assert/strict";

const OPS = new URL("../src/modules/ops/service.ts", import.meta.url).href;
const EVAL = new URL("../src/modules/evaluation/service.ts", import.meta.url).href;
const realOps = await import(`${OPS}?real`);
const realEval = await import(`${EVAL}?real`);
const evalState: { rows: unknown[]; fail: boolean; calls: string[] } = { rows: [], fail: false, calls: [] };
mock.module(OPS, { exports: { ...realOps, notifyOps: async () => {} } });
mock.module(EVAL, {
  exports: {
    ...realEval,
    winRates: async (_env: unknown, groupBy: string) => {
      evalState.calls.push(groupBy);
      if (evalState.fail) throw new Error("evaluation.winRates is not built yet");
      return evalState.rows;
    },
  },
});

const { testEnv } = await import("./helpers.ts");
const { syncAllExpertPersonas, syncExpertPersona } = await import("../src/modules/experts/service.ts");

type T = Awaited<ReturnType<typeof testEnv>>;

async function approvedExpert(t: T, user: string) {
  const res = await t.api("POST", "/api/experts/apply", {
    user, email: `${user}@example.com`, body: {
      display_name: "Maya Patel", headline: "Conversion copywriter for SaaS founders", areas: ["marketing"], job_types: ["landing-page-copy"],
      experience: "Eight years writing landing pages and launch emails for software companies.",
      claims: [{ text: "Wrote the launch page for a scheduling app", evidence_url: "https://example.com/case" }],
      sample_links: [], country: "India", agree: true,
    },
  });
  await t.makeOps("ops_1");
  await t.api("POST", `/api/experts/${res.body.expert.id}/review`, { user: "ops_1", body: { decision: "approve" } });
  const [persona] = await t.sql("SELECT id FROM personas WHERE expert_id = ?", res.body.expert.id);
  return { expertId: res.body.expert.id as string, personaId: persona.id as string };
}

const RUBRIC = [
  { id: "one_action", text: "Every section leads to the one action the buyer chose.", weight: 4, pass_rule: "x", critical: false, source: "template" },
  { id: "proof_used", text: "Claims are backed by the proof the buyer gave, and nothing is invented.", weight: 5, pass_rule: "x", critical: true, source: "template" },
];

/** Two agents, two buyers (one shares edits), five jobs: accepted, accepted with edits, rejected, auto-accepted, running. */
async function seed(t: T, expertId: string, personaId: string) {
  const at = (n: number) => new Date(Date.UTC(2026, 10, 1, 12, n)).toISOString();
  await t.grantBeta("buyer_1");
  await t.grantBeta("buyer_2");
  await t.sql("INSERT INTO consents (owner_kind, owner_id, scope, granted, updated_by, updated_at) VALUES ('org', 'org_buyer_1', 'learn_from_edits', 1, 'buyer_1', ?)", at(0));
  await t.sql("INSERT INTO consents (owner_kind, owner_id, scope, granted, updated_by, updated_at) VALUES ('org', 'org_buyer_2', 'learn_from_edits', 0, 'buyer_2', ?)", at(0));
  await t.sql("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agt_lp', 'expert', ?, ?, 'landing-page-copy', 'Maya: landing pages', 'live', 2, ?, ?)", expertId, personaId, at(1), at(1));
  await t.sql("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agt_blog', 'expert', ?, ?, 'seo-blog-post', 'Maya: blog posts', 'testing', NULL, ?, ?)", expertId, personaId, at(2), at(2));
  await t.sql("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agt_house', 'house', NULL, NULL, 'landing-page-copy', 'House', 'live', 1, ?, ?)", at(1), at(1));
  for (const [agent, version, status, changelog] of [["agt_lp", 1, "published", "First version"], ["agt_lp", 2, "published", "Shorter headlines"], ["agt_blog", 1, "draft", ""]] as const) {
    await t.sql("INSERT INTO agent_versions (agent_id, version, package, sha256, changelog, status, created_at, published_at) VALUES (?, ?, '{}', 'x', ?, ?, ?, ?)", agent, version, changelog, status, at(3), status === "published" ? at(3) : null);
  }
  const jobs = [
    ["job_1", "buyer_1", "accepted", 14900, "agt_lp", 2, "Landing page for a dog grooming app"],
    ["job_2", "buyer_2", "accepted", 19900, "agt_lp", 2, "Landing page for a bookkeeping service"],
    ["job_3", "buyer_2", "rejected", 9900, "agt_lp", 1, "Landing page for a deodorant brand"],
    ["job_4", "buyer_2", "accepted", 12900, "agt_blog", 1, ""],
    ["job_5", "buyer_1", "running", 14900, "agt_lp", 2, "Waitlist page for a tutoring app"],
    ["job_house", "buyer_1", "accepted", 50000, "agt_house", 1, "Not this expert's job"],
  ] as const;
  for (const [i, [id, buyer, status, price, agent, version, title]] of jobs.entries()) {
    await t.sql(`INSERT INTO jobs (id, org_id, created_by, status, job_type_id, title, price_cents, agent_id, agent_version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, id, `org_${buyer}`, buyer, status, agent === "agt_blog" ? "seo-blog-post" : "landing-page-copy", title, price, agent, version, at(10 + i), at(10 + i));
    await t.sql("INSERT INTO runs (id, job_id, kind, agent_id, agent_version, status, created_at) VALUES (?, ?, 'job', ?, ?, 'succeeded', ?)", `run_${id}`, id, agent, version, at(10 + i));
    await t.sql("INSERT INTO drafts (id, job_id, run_id, content, fingerprint, created_at) VALUES (?, ?, ?, 'draft', 'f', ?)", `drf_${id}`, id, `run_${id}`, at(10 + i));
    await t.sql("INSERT INTO rubrics (job_id, criteria, created_at, updated_at) VALUES (?, ?, ?, ?)", id, JSON.stringify(RUBRIC), at(10 + i), at(10 + i));
  }
  const decisions = [
    ["dec_1", "job_1", "revise", "Make the headline shorter.", ["one_action"], null, null, "buyer_1", 20],
    ["dec_2", "job_1", "accept", "", [], JSON.stringify({ diff: "- Book a demo\n+ Start free", reason: "Our trial is free" }), 5, "buyer_1", 21],
    ["dec_3", "job_2", "accept", "", [], "Changed the intro to our own words.", 3, "buyer_2", 22],
    ["dec_4", "job_3", "reject", "It invented a customer quote.", ["proof_used"], null, null, "buyer_2", 23],
    ["dec_5", "job_4", "auto_accept", "", [], null, null, "system_user", 24],
    ["dec_house", "job_house", "accept", "Great", [], null, 1, "buyer_1", 25],
  ] as const;
  await t.sql("INSERT INTO users (id, email, email_verified, beta_access, created_at, last_seen_at) VALUES ('system_user', NULL, 0, 0, ?, ?)", at(0), at(0));
  for (const [id, job, kind, reasons, failed, edits, rating, by, n] of decisions) {
    await t.sql("INSERT INTO decisions (id, job_id, draft_id, kind, reasons, failed_criteria, edits, rating, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      id, job, `drf_${job}`, kind, reasons, JSON.stringify(failed), edits, rating, by, at(n));
  }
}

test("the dashboard is only for approved experts", async () => {
  const t = await testEnv();
  assert.equal((await t.api("GET", "/api/experts/me/dashboard")).status, 401);
  assert.equal((await t.api("GET", "/api/experts/me/dashboard", { user: "user_none" })).status, 403);
  await t.api("POST", "/api/experts/apply", {
    user: "user_waiting", body: {
      display_name: "Ana Souza", headline: "Sales emails for B2B teams", areas: ["sales"], job_types: ["seo-blog-post"],
      experience: "Ten years writing outbound sales emails for software teams in Brazil and Portugal.",
      claims: [{ text: "Booked meetings for a payroll app", evidence_url: "https://example.com/payroll" }], sample_links: [], country: "Brazil", agree: true,
    },
  });
  const res = await t.api("GET", "/api/experts/me/dashboard", { user: "user_waiting" });
  assert.equal(res.status, 403);
  assert.equal(res.body.error.code, "expert_only");
});

test("dashboard numbers on seeded data", async () => {
  const t = await testEnv();
  const { expertId, personaId } = await approvedExpert(t, "user_maya");
  await seed(t, expertId, personaId);
  evalState.fail = false;
  evalState.rows = [
    { key: "agt_lp", tests: 4, judgments: 12, agentWins: 3, baselineWins: 1, ties: 0, winRate: 0.75 },
    { key: "agt_house", tests: 9, judgments: 27, agentWins: 2, baselineWins: 7, ties: 0, winRate: 0.22 },
  ];
  const res = await t.api("GET", "/api/experts/me/dashboard", { user: "user_maya" });
  assert.equal(res.status, 200);
  const d = res.body;
  assert.ok(evalState.calls.includes("agent"));
  assert.deepEqual(d.expert, { id: expertId, display_name: "Maya Patel", founding: true, rate: 0.75 });
  assert.deepEqual(d.personas.map((p: { id: string }) => p.id), [personaId]);
  assert.equal(d.personas[0].status, "live", "loading the dashboard syncs the persona with the live agent");

  // Totals cover this expert's five jobs only (never the house agent's job).
  assert.equal(d.totals.agents, 2);
  assert.equal(d.totals.live_agents, 1);
  assert.equal(d.totals.jobs, 5);
  assert.equal(d.totals.accepted, 3);
  assert.equal(d.totals.rejected, 1);
  assert.equal(d.totals.acceptance_rate, 0.75);
  assert.equal(d.totals.ratings, 2);
  assert.equal(d.totals.avg_rating, 4);
  assert.equal(d.totals.revision_requests, 1);
  assert.equal("accepted_value_cents" in d.totals, false);

  const lp = d.agents.find((a: { id: string }) => a.id === "agt_lp");
  const blog = d.agents.find((a: { id: string }) => a.id === "agt_blog");
  assert.equal(lp.job_type_title, "Landing page copy");
  assert.deepEqual(lp.versions.map((v: { version: number; status: string }) => `${v.version}:${v.status}`), ["2:published", "1:published"]);
  assert.equal(lp.live_version, 2);
  assert.equal(lp.stats.jobs, 4);
  assert.equal(lp.stats.accepted, 2);
  assert.equal(lp.stats.rejected, 1);
  assert.equal(Math.round(lp.stats.acceptance_rate * 1000), 667);
  assert.equal(lp.stats.avg_rating, 4);
  assert.equal("accepted_value_cents" in lp.stats, false);
  assert.deepEqual(lp.win_rate, { tests: 4, judgments: 12, agent_wins: 3, baseline_wins: 1, ties: 0, rate: 0.75 });
  assert.equal(blog.status, "testing");
  assert.equal(blog.stats.jobs, 1);
  assert.equal(blog.stats.avg_rating, null);
  assert.equal(blog.win_rate, null);
  assert.equal(d.win_rates_available, true);

  assert.deepEqual(d.jobs.map((j: { id: string }) => j.id), ["job_5", "job_4", "job_3", "job_2", "job_1"]);
  const job = (id: string) => d.jobs.find((j: { id: string }) => j.id === id);
  assert.equal(job("job_1").rating, 5);
  assert.equal(job("job_1").outcome, "accepted");
  assert.equal(job("job_4").outcome, "auto_accepted");
  assert.equal(job("job_4").title, "SEO blog post", "untitled jobs fall back to the job type");
  assert.equal(job("job_3").outcome, "rejected");
  assert.equal(job("job_5").outcome, "open");
  assert.equal(job("job_2").agent_name, "Maya: landing pages");
  assert.ok(!JSON.stringify(d.jobs).includes("org_buyer"), "buyer orgs are not exposed");

  // Buyer feedback: revision reasons and rejections always; edits only when the buyer agreed to share them.
  const fb = (id: string) => d.feedback.find((f: { id: string }) => f.id === id);
  assert.deepEqual(d.feedback.map((f: { id: string }) => f.id).sort(), ["dec_1", "dec_2", "dec_3", "dec_4"]);
  assert.equal(fb("dec_1").kind, "revise");
  assert.equal(fb("dec_1").reasons, "Make the headline shorter.");
  assert.deepEqual(fb("dec_1").failed_checks, [{ id: "one_action", text: RUBRIC[0]!.text }]);
  assert.equal(fb("dec_2").edits_shared, true);
  assert.deepEqual(fb("dec_2").edits, { diff: "- Book a demo\n+ Start free", reason: "Our trial is free" });
  assert.equal(fb("dec_3").has_edits, true);
  assert.equal(fb("dec_3").edits_shared, false);
  assert.equal(fb("dec_3").edits, null);
  assert.equal(fb("dec_4").failed_checks[0].text, RUBRIC[1]!.text);

  // Jobs have no price for buyers, so the dashboard shows no job prices and no estimated earnings from them.
  assert.equal(d.work_value, undefined);
  assert.ok(d.jobs.every((j: Record<string, unknown>) => !("price_cents" in j) && !("currency" in j)));
});

test("the dashboard still loads when win rates are not available", async () => {
  const t = await testEnv();
  const { expertId, personaId } = await approvedExpert(t, "user_maya");
  await seed(t, expertId, personaId);
  evalState.fail = true;
  const res = await t.api("GET", "/api/experts/me/dashboard", { user: "user_maya" });
  evalState.fail = false;
  assert.equal(res.status, 200);
  assert.equal(res.body.win_rates_available, false);
  assert.ok(res.body.agents.every((a: { win_rate: unknown }) => a.win_rate === null));
  assert.equal(res.body.totals.jobs, 5);
});

test("a persona goes live with its live agents' outcomes and hides when the expert is paused", async () => {
  const t = await testEnv();
  const { expertId, personaId } = await approvedExpert(t, "user_maya");
  const persona = async () => {
    const [p] = await t.sql("SELECT status, profile FROM personas WHERE id = ?", personaId);
    return { status: p.status as string, outcomes: JSON.parse(p.profile).outcomes as { job_type_id: string }[] };
  };
  assert.deepEqual(await syncExpertPersona(t.env, expertId), { changed: 0 }, "no live agents yet");
  assert.equal((await persona()).status, "hidden");

  const now = new Date().toISOString();
  await t.sql("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agt_lp', 'expert', ?, ?, 'landing-page-copy', 'Maya', 'live', 1, ?, ?)", expertId, personaId, now, now);
  await t.sql("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES ('agt_blog', 'expert', ?, ?, 'seo-blog-post', 'Maya', 'draft', NULL, ?, ?)", expertId, personaId, now, now);
  await syncAllExpertPersonas(t.env);
  let p = await persona();
  assert.equal(p.status, "live");
  assert.deepEqual(p.outcomes.map(o => o.job_type_id), ["landing-page-copy"]);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM events WHERE entity = 'persona' AND entity_id = ? AND type = 'persona.synced'", personaId))[0].n, 1);
  assert.deepEqual(await syncExpertPersona(t.env, expertId), { changed: 0 }, "nothing to change twice");

  const paused = await t.api("POST", `/api/experts/${expertId}/review`, { user: "ops_1", body: { decision: "pause", note: "Checking a buyer complaint." } });
  assert.equal(paused.status, 200);
  assert.equal((await persona()).status, "hidden");
  await syncAllExpertPersonas(t.env);
  assert.equal((await persona()).status, "hidden", "stays hidden while paused");
  assert.equal((await t.api("GET", "/api/experts/me/dashboard", { user: "user_maya" })).status, 403);

  await t.api("POST", `/api/experts/${expertId}/review`, { user: "ops_1", body: { decision: "approve" } });
  assert.equal((await persona()).status, "live", "approving again brings it back");

  await t.sql("UPDATE agents SET status = 'retired' WHERE id = 'agt_lp'");
  await syncAllExpertPersonas(t.env);
  p = await persona();
  assert.equal(p.status, "hidden");
  assert.deepEqual(p.outcomes, []);
});
