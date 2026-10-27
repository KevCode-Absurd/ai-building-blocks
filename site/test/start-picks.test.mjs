// Free mode on /compose: the "Start with" picks for a goal (composer-core startPicks). The person picks one and grows
// the workflow in the builder; these checks keep the picks on the goal's subject.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { decodeCatalogue, startPicks } from "../src/lib/composer-core.ts";
import { withoutParts } from "../src/lib/goal.ts";
const c = decodeCatalogue(JSON.parse(fs.readFileSync("public/data/blocks.json", "utf8")));
const slugs = goal => startPicks(c, goal, 5).tasks.map(p => p.b.slug);

test("a two-word subject beats one shared word", () => {
  const picks = slugs("run a fair performance review round for my team");
  assert.ok(c.bySlug[picks[0]] && /review/i.test(`${c.bySlug[picks[0]].name} ${c.bySlug[picks[0]].summary}`), picks[0]);
  assert.ok(!picks.slice(0, 3).some(s => /performance-max/.test(s)), picks.join(", "));
});

test("picks are single steps, a request to check leads with a check, and nothing fits gibberish", () => {
  for (const goal of ["landing page", "write a cited research report", "tidy my meeting notes"]) {
    const { tasks } = startPicks(c, goal, 5);
    assert.ok(tasks.length > 0, goal);
    for (const { b } of tasks) assert.ok(b.type !== "agent" && b.type !== "mind" && b.category !== "orchestrator" && !b.slug.startsWith("request-"), `${goal}: ${b.slug}`);
  }
  assert.equal(c.bySlug[slugs("check my spreadsheet formulas")[0]].role, "check");
  assert.deepEqual(startPicks(c, "qwertyuiop zzzz", 5), { tasks: [], workflows: [] });
});

test("the same goal gives the same picks, and hidden items never come back", () => {
  assert.deepEqual(slugs("start a youtube channel for my business"), slugs("start a youtube channel for my business"));
  const top = slugs("landing page")[0], view = withoutParts(c, [top]);
  assert.ok(!startPicks(view, "landing page", 5).tasks.some(p => p.b.slug === top));
});
