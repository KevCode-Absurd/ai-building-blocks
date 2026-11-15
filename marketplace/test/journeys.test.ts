// Journey maps (ecom-journey, 14 Nov 2026): the guide's per-job maps must be valid, name only real skills, agents and
// modules, keep the owner's load small (few questions, each with a default), and render every stage.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { journeyIndexMarkdown, journeyMarkdown, validateJourney, type Journey } from "../src/modules/knowledge/journeys.ts";

const root = new URL("../knowledge/ecommerce/", import.meta.url);
const dir = new URL("journeys/", root);
const journeys: Journey[] = existsSync(dir)
  ? readdirSync(dir).filter(f => f.endsWith(".json")).map(f => JSON.parse(readFileSync(new URL(f, dir), "utf8")))
  : [];
const skills = new Set(readdirSync(new URL("skills/", root)));
const modules = new Set(readdirSync(new URL("cards/", root)).filter(f => f.endsWith(".json")).map(f => f.replace(/\.json$/, "")));
const personas = JSON.parse(readFileSync(new URL("../src/modules/directory/data/personas-ecommerce.json", import.meta.url), "utf8"));
const agents = new Set<string>((Array.isArray(personas) ? personas : personas.personas).map((p: { id: string }) => p.id));
const formatsUrl = new URL("formats.json", root);
const formats = existsSync(formatsUrl) ? new Set<string>((JSON.parse(readFileSync(formatsUrl, "utf8")).formats ?? []).map((f: { id: string }) => f.id)) : undefined;

test("the ten e-commerce job families each have a journey map", () => {
  assert.deepEqual(journeys.map(j => j.id).sort(), ["aeo", "big-bets", "creatives", "cro-audit", "email-retention", "media-buying-audit", "meta-account-structure", "product-pages", "seo", "video-scripts"]);
});

test("every journey is valid: real skills, agents and modules; at most 4 questions and 2 decisions, each question with a default", () => {
  for (const j of journeys) assert.deepEqual(validateJourney(j, { skills, modules, agents, formats }), [], j.id);
});

test("every journey renders all six stages and nothing broken", () => {
  for (const j of journeys) {
    const md = journeyMarkdown(j);
    for (const h of ["## 1. Goal", "## 2. Gather", "## 3. Diagnose", "## 4. Choose", "## 5. Make and check", "## 6. Hand over and next"]) assert.ok(md.includes(h), `${j.id}: ${h}`);
    assert.doesNotMatch(md, /undefined|\[object Object\]/, j.id);
  }
  const index = journeyIndexMarkdown(journeys);
  for (const j of journeys) assert.ok(index.includes(`(${j.id}.md)`), j.id);
});

test("the validator catches a made-up skill, too many questions and a question with no default", () => {
  const bad = { schema: "ai-blocks-journey/1", id: "x", name: "x", vertical: "ecommerce", outcome: "x",
    goal: { questions: [1, 2, 3, 4, 5].map(i => ({ id: `q${i}`, ask: "?" })) }, make: { pieces: [{ piece: "p", skill: "no-such-skill" }] } } as unknown as Journey;
  const p = validateJourney(bad, { skills, modules, agents });
  assert.ok(p.some(x => /5 goal questions/.test(x)));
  assert.ok(p.some(x => /no default/.test(x)));
  assert.ok(p.some(x => /unknown skill no-such-skill/.test(x)));
});
