// The e-commerce team by stage of the work (src/modules/directory/team-stages.ts) and team search
// (GET /api/agents?vertical=ecommerce&q=), which /e-commerce uses to find the agent for a job.
import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { housePersonas } from "../src/modules/directory/index.ts";
import { ECOMMERCE_STAGES } from "../src/modules/directory/team-stages.ts";

const team = housePersonas().filter(p => p.vertical === "ecommerce" && p.status === "live");

test("every e-commerce agent sits in exactly one stage, and every stage names real team agents", () => {
  const seen = new Map<string, string>();
  for (const st of ECOMMERCE_STAGES) {
    assert.match(st.id, /^[a-z]+$/);
    assert.ok(st.summary.split(/\s+/).length <= 14, `short summary: ${st.summary}`);
    assert.doesNotMatch(st.label + st.summary, /[–—]/, "no em or en dashes");
    for (const id of st.agents) {
      assert.ok(!seen.has(id), `${id} is in ${seen.get(id)} and ${st.id}`);
      seen.set(id, st.id);
      assert.ok(team.some(p => p.id === id), `${st.id}: ${id} is not a live e-commerce agent`);
    }
  }
  for (const p of team) assert.ok(seen.has(p.id), `${p.id} has no stage`);
});

test("the team answer carries the stages; ?q= finds the agent for a job inside the team", async () => {
  const t = await testEnv();
  const all = (await t.api("GET", "/api/agents?vertical=ecommerce")).body;
  assert.equal(all.total, team.length);
  assert.ok(all.stages.length >= 8);
  assert.deepEqual(all.stages.flatMap((s: { ids: string[] }) => s.ids).sort(), all.agents.map((a: { id: string }) => a.id).sort());

  const find = async (q: string) => (await t.api("GET", `/api/agents?vertical=ecommerce&q=${encodeURIComponent(q)}`)).body;
  const meta = await find("Meta ads");
  assert.equal(meta.q, "Meta ads");
  assert.equal(meta.team, team.length);
  assert.ok(meta.agents.length > 0 && meta.agents.length < team.length, "a search narrows the team");
  assert.ok(meta.agents.every((a: { vertical: { id: string } | null }) => a.vertical?.id === "ecommerce"), "only team agents");
  assert.ok(meta.agents.slice(0, 3).some((a: { role: { id: string } | null }) => a.role?.id === "meta-media-buyer"), "a Meta media buyer near the top");

  const tiktok = await find("tiktok ads");
  assert.equal(tiktok.agents[0].id, "zara-tiktok-ads");
  const none = await find("xylophone zebra");
  assert.equal(none.agents.length, 0);
  assert.equal((await t.api("GET", `/api/agents?vertical=ecommerce&q=${"x".repeat(121)}`)).status, 400);
});
