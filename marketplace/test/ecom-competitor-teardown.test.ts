import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { testEnv } from "./helpers.ts";
import { housePersonas } from "../src/modules/directory/index.ts";
import { validatePersona } from "../src/modules/directory/schema.ts";
import { getRole } from "../src/modules/directory/roles.ts";
import { ECOMMERCE_STAGES } from "../src/modules/directory/team-stages.ts";
import { teamMarkdown } from "../src/modules/directory/team.ts";
import { buildPack, TOOL_FILES } from "../src/modules/packs/build.ts";
import { listJobTypes } from "../src/modules/catalogue/index.ts";
import org from "../src/modules/directory/data/team-org-chart.json" with { type: "json" };

const ID = "hattie-competitor-teardown";
const TEARDOWN_TOOLS = ["teardown-collect.mjs", "teardown-report.mjs", "teardown-shots.mjs", "TEARDOWN.md"];
const toolsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../packs/shared/tools");

test("competitor teardown jobs find Hattie inside the e-commerce team", async () => {
  const t = await testEnv();
  for (const query of ["competitor teardown", "reverse engineer marketing", "competitor ads"]) {
    const response = await t.api("GET", `/api/agents?vertical=ecommerce&q=${encodeURIComponent(query)}`);
    assert.equal(response.status, 200);
    const hits = response.body.agents as { id: string }[];
    assert.equal(hits[0]?.id, ID, `${query} should lead to the teardown analyst`);
  }
});

test("Hattie validates, has her own role and one research-stage seat", () => {
  const matches = housePersonas().filter(person => person.id === ID);
  assert.equal(matches.length, 1);
  const person = matches[0];
  assert.equal(validatePersona(person).ok, true);
  assert.equal(person.role, "dtc-competitor-teardown");
  assert.ok(getRole(person.role));
  assert.equal(person.vertical, "ecommerce");
  assert.equal(person.team?.provenance, "hand-written");
  assert.deepEqual(person.team?.families, ["competitor-intelligence"]);
  assert.deepEqual(ECOMMERCE_STAGES.filter(stage => stage.agents.includes(ID)).map(stage => stage.id), ["research"]);
  const research = ECOMMERCE_STAGES.find(stage => stage.id === "research")!;
  assert.equal(research.agents.indexOf(ID), research.agents.indexOf("shannon-market-research") + 1);
});

test("the orchestrator can hand competitor teardowns to Hattie and keeps market sizing with Shannon", () => {
  const people = housePersonas();
  const coordinator = people.find(person => person.id === "margaret-job-orchestrator")!;
  const handover = teamMarkdown(coordinator);
  assert.ok(handover.includes(`${ID}:`), "Hattie must be in the generated roster");
  assert.match(handover, /Competitor marketing teardowns .* go to hattie-competitor-teardown/);
  assert.match(handover, /Sizing a market or category stays with shannon-market-research/);
  const entry = org.personas.find(candidate => candidate.id === ID);
  assert.ok(entry?.roles.includes("dtc-competitor-teardown"));
  const department = org.departments.find(candidate => candidate.id === "ecommerce");
  assert.ok(department?.roles.some(role => role.id === "dtc-competitor-teardown" && role.persona_ids.includes(ID)), "Hattie needs an executable role handoff");
});

test("the teardown tools ship in Hattie's pack and not in another e-commerce pack", async () => {
  const scoped = TOOL_FILES.filter(t => t.personaIds?.includes(ID));
  assert.deepEqual(scoped.map(t => t.name), TEARDOWN_TOOLS);
  const tools = Object.fromEntries(scoped.map(t => [t.name, fs.readFileSync(path.join(toolsDir, t.name), "utf8")]));
  const people = housePersonas();
  for (const id of [ID, "nico-ecommerce-speed"]) {
    const persona = people.find(person => person.id === id)!;
    const pack = await buildPack({ persona, role: getRole(persona.role), kit: null, jobTypes: listJobTypes(), tools, options: { kind: "agent" as const, version: "2026.11.19", updated: "2026-11-19" } });
    for (const name of TEARDOWN_TOOLS) {
      const has = pack.files.some(f => f.path === `tools/${name}`);
      assert.equal(has, id === ID, `${id} ${has ? "must not" : "must"} carry tools/${name}`);
    }
  }
});

test("the teardown check asks for a mode and keeps briefs to the owner's own facts", async () => {
  // A plain .mjs tool with no type declarations: load it by URL so the compiler treats it as untyped.
  const { check } = await import(new URL("../packs/shared/tools/teardown-report.mjs", import.meta.url).href) as { check: (ev: unknown, md: string) => { errors: string[] } };
  const ev = {
    evidence: [
      { id: "E1", kind: "observation", area: "catalogue", label: "Every public product", data: { products: [{ title: "Miracle Balm Tint", price: 40 }] } },
      { id: "E2", kind: "observation", area: "ads_meta", label: "Ad headlines", data: { headlines: [{ text: "No-makeup makeup, but better", ads: 9 }] } },
    ],
    ids: { productList: "E1", adsAngles: "E2" },
    lanes: [{ lane: "Meta ads", agents: ["lindsey-meta-media-buyer"], names: ["Lindsey"] }],
    unknowns: [],
  };
  const report = (mode: string, brief: string) => [
    "# Test: how they sell", "", mode, "**Verdict:** One balm sold through many ads [E1].", "",
    "## Hand-offs to your agents", "### Lindsey · Meta ads (lindsey-meta-media-buyer)", "- **What they do:** Many ads on one balm [E2].", `- **Brief:** ${brief}`,
  ].join("\n");
  const none = check(ev, report("", "Launch 6 ads for {your hero product} at {your price} by 1 December, two angles, one creator."));
  assert.ok(none.errors.some((e: string) => /No \*\*Mode:\*\* line/.test(e)), "a report without a mode must fail");
  const general = check(ev, report("**Mode:** general", "Launch 6 ads for the Miracle Balm Tint at $40 by 1 December, two angles, one creator, three hooks."));
  assert.ok(general.errors.some((e: string) => /names their product/.test(e)), "general briefs must not name the competitor's product");
  assert.ok(general.errors.some((e: string) => /placeholders/.test(e)), "general briefs need placeholders for the owner's facts");
  const lifted = check(ev, report("**Mode:** general", "Launch 6 ads for {your hero product} that open with No-makeup makeup, but better, by 1 December."));
  assert.ok(lifted.errors.some((e: string) => /reuses their ad line/.test(e)), "briefs must not reuse the competitor's ad lines");
  const personal = check(ev, report("**Mode:** personalized for Brightland (brightland.co)", "Launch 6 ads for {your hero product} by 1 December, two angles, one creator, three hooks."));
  assert.ok(personal.errors.some((e: string) => /owner's store is not collected/.test(e)), "personalized mode needs the owner's own store collected");
});
