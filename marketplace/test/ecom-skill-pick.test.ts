// Can an e-commerce agent tell which of its skills fits an owner's request from its toolkit text alone? Runs the
// lexical picker (scripts/eval-skill-pick.mjs) on the golden set (test/fixtures/ecom-skill-pick.json) and holds the
// accuracy reached on 2026-11-14 after the toolbox when/outcome rewrite, less 5 points of slack:
//   agent top-1   tune 100.0%  holdout 82.5%   (before the rewrite: 82.5% / 75.0%)
//   orchestrator  tune  95.0%  holdout 65.0%   (before: 67.5% / 60.0%), whole toolbox of 359 skills
// A model check on 20 holdout requests (sonnet, toolkit text only) picked right 20 of 20 before and after.
// When this fails, fix the toolbox.json when/outcome text on "tune" items; never edit the golden set to pass.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

interface PickRow { id: string; split: string; request: string; agentRank: number; agentTop: string[] }
const { evaluatePicks, loadToolkits }: any = await import(new URL("../scripts/eval-skill-pick.mjs", import.meta.url).href);

const GOLDEN = JSON.parse(readFileSync(new URL("./fixtures/ecom-skill-pick.json", import.meta.url), "utf8"));

test("the skill-pick golden set: 80 owner requests, half tune and half holdout, each answerable by its agent", () => {
  const { skills, kits } = loadToolkits();
  assert.equal(GOLDEN.items.length, 80);
  assert.equal(GOLDEN.items.filter((i: { split: string }) => i.split === "tune").length, 40);
  assert.equal(new Set(GOLDEN.items.map((i: { id: string }) => i.id)).size, 80);
  for (const it of GOLDEN.items) {
    assert.ok(it.skills.length >= 1 && it.skills.length <= 3, `${it.id}: 1 to 3 right skills`);
    for (const s of it.skills) assert.ok(skills.has(s), `${it.id}: ${s} is not a toolbox skill`);
    assert.ok(kits.has(it.agents[0]), `${it.id}: ${it.agents[0]} is not an e-commerce agent`);
    assert.ok(it.skills.some((s: string) => kits.get(it.agents[0])!.includes(s)), `${it.id}: ${it.agents[0]} carries none of its right skills`);
  }
});

test("agents pick the right skill from their toolkit text (lexical proxy floors, 2026-11-14)", () => {
  const { summary, rows }: { summary: Record<string, Record<string, number>>; rows: PickRow[] } = evaluatePicks(GOLDEN);
  const misses = (split: string) => rows.filter(r => r.split === split && r.agentRank !== 1).map(r => `${r.id} "${r.request}" -> ${r.agentTop[0]}`).join("\n  ");
  assert.ok(summary.tune.agentTop1 >= 0.95, `agent top-1 on tune ${summary.tune.agentTop1}:\n  ${misses("tune")}`);
  assert.ok(summary.holdout.agentTop1 >= 0.775, `agent top-1 on holdout ${summary.holdout.agentTop1}:\n  ${misses("holdout")}`);
  assert.ok(summary.tune.agentTop3 >= 0.95 && summary.holdout.agentTop3 >= 0.9, "agent top-3");
  assert.ok(summary.tune.orchestratorTop1 >= 0.9, `orchestrator top-1 on tune ${summary.tune.orchestratorTop1}`);
  assert.ok(summary.holdout.orchestratorTop1 >= 0.6, `orchestrator top-1 on holdout ${summary.holdout.orchestratorTop1}`);
});
