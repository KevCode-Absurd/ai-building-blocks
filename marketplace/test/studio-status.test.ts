// Ops agent status: go live, retire and bring back (un-retire). Every change writes an event, keeps the agent's
// history, tells the expert, and refreshes the expert's public persona straight away (not only on the cron).
import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { setAgentStatus, unretireAgent } from "../src/modules/studio/service.ts";

type T = Awaited<ReturnType<typeof testEnv>>;

const OPS = "user_ops";
const EXPERT_USER = "user_pia";
const NOW = "2026-11-01T09:00:00.000Z";

async function agent(t: T, id: string, o: { jobType?: string; status: string; liveVersion?: number | null; versions?: ("published" | "draft")[]; house?: boolean }) {
  await t.sql("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    id, o.house ? "house" : "expert", o.house ? null : "exp_pia", o.house ? null : "per_pia", o.jobType ?? "landing-page-copy",
    o.house ? `House ${id}` : `Pia: ${id}`, o.status, o.liveVersion ?? null, NOW, NOW);
  for (const [i, status] of (o.versions ?? ["published"]).entries()) {
    await t.sql("INSERT INTO agent_versions (agent_id, version, package, sha256, changelog, status, created_at, published_at) VALUES (?, ?, '{}', 'x', '', ?, ?, ?)",
      id, i + 1, status, NOW, status === "published" ? NOW : null);
  }
}

async function setup(): Promise<T> {
  const t = await testEnv();
  await t.makeOps(OPS);
  await t.api("GET", "/api/me", { user: EXPERT_USER });
  await t.sql("INSERT INTO experts (id, user_id, status, display_name, job_types, created_at, updated_at) VALUES ('exp_pia', ?, 'approved', 'Pia Marsh', '[\"landing-page-copy\",\"seo-blog-post\"]', ?, ?)", EXPERT_USER, NOW, NOW);
  await t.sql("INSERT INTO personas (id, kind, expert_id, name, title, tagline, area, profile, status, created_at, updated_at) VALUES ('per_pia', 'expert', 'exp_pia', 'Pia', 'Landing page writer', 'Pages that get the click', 'marketing', '{\"outcomes\":[]}', 'hidden', ?, ?)", NOW, NOW);
  return t;
}

async function persona(t: T) {
  const [p] = await t.sql("SELECT status, profile FROM personas WHERE id = 'per_pia'");
  return { status: p.status as string, jobTypes: (JSON.parse(p.profile).outcomes ?? []).map((o: any) => o.job_type_id) as string[] };
}
const agentRow = async (t: T, id: string) => ({ ...(await t.sql("SELECT status, live_version FROM agents WHERE id = ?", id))[0] });
const notices = async (t: T) => (await t.sql("SELECT kind FROM notifications WHERE user_id = ? ORDER BY created_at, rowid", EXPERT_USER)).map(n => n.kind);

test("live, retire and bring back move the agent and the expert's persona together", async () => {
  const t = await setup();
  await agent(t, "agt_lp", { status: "testing", versions: ["published", "published"] });
  const base = "/api/studio/agents/agt_lp";

  assert.equal((await t.api("POST", `${base}/live`, { user: OPS, body: { version: 1 } })).status, 200);
  assert.deepEqual(await agentRow(t, "agt_lp"), { status: "live", live_version: 1 });
  assert.deepEqual(await persona(t), { status: "live", jobTypes: ["landing-page-copy"] }, "the persona shows the job at once");
  const [synced] = await t.sql("SELECT actor, actor_kind FROM events WHERE type = 'persona.synced' AND entity_id = 'per_pia' ORDER BY seq DESC LIMIT 1");
  assert.deepEqual([synced.actor, synced.actor_kind], [OPS, "ops"]);

  assert.equal((await t.api("POST", `${base}/retire`, { user: OPS, body: { reason: "Buyers asked for changes on every draft." } })).status, 200);
  assert.deepEqual(await agentRow(t, "agt_lp"), { status: "retired", live_version: 1 }, "retiring keeps the live version on record");
  assert.deepEqual(await persona(t), { status: "hidden", jobTypes: [] });
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM agent_versions WHERE agent_id = 'agt_lp'"))[0].n, 2, "versions stay");

  // Only ops can bring an agent back.
  assert.equal((await t.api("POST", `${base}/unretire`, { body: {} })).status, 401);
  assert.equal((await t.api("POST", `${base}/unretire`, { user: EXPERT_USER, body: {} })).status, 403);
  assert.equal((await t.api("POST", "/api/studio/agents/agt_missing/unretire", { user: OPS, body: {} })).status, 404);

  const back = await t.api("POST", `${base}/unretire`, { user: OPS, body: { reason: "Fixed the brief questions." } });
  assert.equal(back.status, 200, JSON.stringify(back.body));
  assert.deepEqual({ status: back.body.status, liveVersion: back.body.liveVersion }, { status: "live", liveVersion: 1 });
  assert.deepEqual(await agentRow(t, "agt_lp"), { status: "live", live_version: 1 }, "back to live on its last live version");
  assert.deepEqual(await persona(t), { status: "live", jobTypes: ["landing-page-copy"] });
  const [ev] = await t.sql("SELECT actor, actor_kind, data FROM events WHERE type = 'agent.unretired' AND entity_id = 'agt_lp'");
  assert.deepEqual([ev.actor, ev.actor_kind, JSON.parse(ev.data)], [OPS, "ops", { from: "retired", to: "live", live_version: 1, reason: "Fixed the brief questions." }]);
  assert.deepEqual(await notices(t), ["agent.live", "agent.retired", "agent.unretired"]);

  const again = await t.api("POST", `${base}/unretire`, { user: OPS, body: {} });
  assert.equal(again.status, 409);
  assert.equal(again.body.error.code, "not_retired");

  // Back to testing hides the persona too.
  await setAgentStatus(t.env, { agentId: "agt_lp", status: "testing", actor: OPS, reason: "A second look." });
  assert.deepEqual(await persona(t), { status: "hidden", jobTypes: [] });
  const types = (await t.sql("SELECT type FROM events WHERE entity = 'agent' AND entity_id = 'agt_lp' ORDER BY seq")).map(e => e.type);
  assert.deepEqual(types, ["agent.live", "agent.retired", "agent.unretired", "agent.status_changed"]);
});

test("an agent that was never live comes back as a draft", async () => {
  const t = await setup();
  await agent(t, "agt_blog", { jobType: "seo-blog-post", status: "retired", liveVersion: null, versions: ["published", "draft"] });
  const res = await unretireAgent(t.env, { agentId: "agt_blog", actor: OPS });
  assert.deepEqual(res, { status: "draft", liveVersion: null });
  assert.deepEqual(await agentRow(t, "agt_blog"), { status: "draft", live_version: null });
  assert.deepEqual(await persona(t), { status: "hidden", jobTypes: [] }, "a draft agent is not shown to buyers");
  const [ev] = await t.sql("SELECT data FROM events WHERE type = 'agent.unretired' AND entity_id = 'agt_blog'");
  assert.equal(JSON.parse(ev.data).to, "draft");
  assert.deepEqual(await notices(t), ["agent.unretired"]);
  // From draft, ops can still put a published version live.
  assert.equal((await t.api("POST", "/api/studio/agents/agt_blog/live", { user: OPS, body: { version: 1 } })).status, 200);
  assert.deepEqual(await persona(t), { status: "live", jobTypes: ["seo-blog-post"] });
});

test("an expert keeps one active agent per job: a retired one cannot come back next to a newer one", async () => {
  const t = await setup();
  await agent(t, "agt_old", { status: "retired", liveVersion: 1 });
  await agent(t, "agt_new", { status: "testing" });
  const res = await t.api("POST", "/api/studio/agents/agt_old/unretire", { user: OPS, body: {} });
  assert.equal(res.status, 409);
  assert.equal(res.body.error.code, "agent_exists");
  assert.match(res.body.error.message, /Retire that one first/);
  const live = await t.api("POST", "/api/studio/agents/agt_old/live", { user: OPS, body: { version: 1 } });
  assert.equal(live.body.error.code, "agent_exists", "going live from retired has the same rule");
  assert.deepEqual(await agentRow(t, "agt_old"), { status: "retired", live_version: 1 });
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM events WHERE entity_id = 'agt_old'"))[0].n, 0, "nothing changed, so nothing is logged");

  await setAgentStatus(t.env, { agentId: "agt_new", status: "retired", actor: OPS, reason: "Replaced by the old one." });
  assert.equal((await t.api("POST", "/api/studio/agents/agt_old/unretire", { user: OPS, body: {} })).status, 200);
  assert.deepEqual(await agentRow(t, "agt_old"), { status: "live", live_version: 1 });
});

test("house agents come back too, without an expert to tell", async () => {
  const t = await setup();
  await agent(t, "agt_house", { house: true, status: "live", liveVersion: 1 });
  assert.equal((await t.api("POST", "/api/studio/agents/agt_house/retire", { user: OPS, body: { reason: "Too many reruns." } })).status, 200);
  assert.equal((await t.api("POST", "/api/studio/agents/agt_house/unretire", { user: OPS, body: {} })).status, 200);
  assert.deepEqual(await agentRow(t, "agt_house"), { status: "live", live_version: 1 });
  assert.deepEqual(await notices(t), []);
  const agents = (await t.api("GET", "/api/ops/agents", { user: OPS })).body.agents;
  assert.equal(agents.find((a: any) => a.id === "agt_house").status, "live");
});
