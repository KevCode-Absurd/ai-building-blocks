// E-commerce house rules (round 2, ticket EB1): the job spine comes first, every rule keeps a short title sentence,
// the text stays short enough to read, and no rule names a bench or held-out brand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Vertical } from "../src/modules/knowledge/cards.ts";
import { toolkitMarkdown, verticalBundle } from "../src/modules/knowledge/bundle.ts";
import { NOVA } from "./fixtures.ts";
import type { Persona } from "../src/core/types.ts";

const VERTICAL = JSON.parse(readFileSync(new URL("../knowledge/ecommerce/vertical.json", import.meta.url), "utf8")) as Vertical;
const RULES = VERTICAL.house_rules ?? [];
const title = (r: string) => /^([^.]+\.)/.exec(r)![1];

// Other groups cite these titles in their skills, so they are fixed here.
const SPINE = [
  "Org context first.",
  "Map every signal to an asset.",
  "Look it up before you decide.",
  "Ship what was asked, in full.",
  "Write for a busy owner.",
  "Only the brief's facts run the business.",
  "One basis per number.",
];
const KEPT = [
  "Rank in one unit.", "Totals match.", "Show the after.", "Test at the same time.", "Fund each test cell to its read.",
  "Two reads before a verdict.", "Keep the wrong-fit buyer.", "Each variant earns its own words.", "Publishable means finished.",
  "Test where the change lands.", "Spend plans add up.",
];
// Bench brands (IMPLEMENTER-RULES rule 4) and the held-out brands (PRD-NEXT15 section 9).
const BRANDS = ["Bombay Shaving", "Bombas", "Mokobara", "Olipop", "Whole Truth", "Bellroy", "Minimalist", "Blue Tokai", "Brooklinen",
  "Plum", "Wakefit", "Snitch", "Plausible", "Cal.com", "Supabase", "Chargebee", "Basecamp", "37signals", "Ahrefs", "Raycast", "Buffer",
  "Headspace", "Todoist", "SUGAR", "Rothy", "Lounge Underwear", "Babbel", "Splitwise", "Podia"];

test("the seven spine rules come first, then the eleven kept rules, each with a short title sentence", () => {
  assert.deepEqual(RULES.map(title), [...SPINE, ...KEPT]);
  for (const r of RULES) assert.ok(title(r).split(/\s+/).length <= 8, `short title: ${title(r)}`);
});

test("the toolkit renders the spine at the top of the rules", () => {
  const bundle = verticalBundle(VERTICAL, [], [], { toolbox: { schema: "ai-blocks-vertical-toolbox/1", reviewed: "2026-11-13", modules: {} }, vendor: {} });
  const persona: Persona = { ...NOVA, id: "store-copywriter", title: "Store copywriter", vertical: "ecommerce", modules: ["ADC"] };
  const kit = toolkitMarkdown(persona, bundle, []);
  const numbered = [...kit.matchAll(/^(\d+)\. \*\*([^*]+)\*\*/gm)].map(m => [Number(m[1]), m[2]]);
  assert.deepEqual(numbered.slice(0, 7), SPINE.map((t, i) => [i + 1, t]));
  assert.equal(numbered.length, 18);
});

test("the rules carry the round 2 changes", () => {
  const rule = (t: string) => RULES.find(r => r.startsWith(t))!;
  assert.match(rule("Org context first."), /never ship[^]*reading level[^]*own phrases[^]*segment the data ranks[^]*each with its number/);
  assert.match(rule("Org context first."), /stored org context[^]*never per job[^]*back to the file/);
  assert.match(rule("Map every signal to an asset."), /past winner gets a relaunch[^]*best segment[^]*top return or complaint reason[^]*about 10%[^]*gap to close/i);
  assert.match(rule("Look it up before you decide."), /prepare-job\.mjs <brief>[^]*per data signal and per major decision[^]*context\/trace\.md[^]*knowledge-brief\.md[^]*never in the deliverable/);
  assert.match(rule("Ship what was asked, in full."), /copy job ships copy[^]*unless the brief asks[^]*one line on what to watch[^]*every branch[^]*merge fields[^]*fallback/);
  assert.match(rule("Write for a busy owner."), /two plain lines[^]*one number[^]*one table per decision, five columns or fewer[^]*no formulas[^]*stop when the job is done/);
  assert.match(rule("Only the brief's facts run the business."), /dates[^]*age ranges[^]*product specs[^]*relative time[^]*Quote product facts/i);
  // Round 2 rollback (13 Nov 2026): never drop an ask to stay safe, keep working notes out of copy, follow the
  // owner's named priority, and count copy by script.
  assert.match(rule("Only the brief's facts run the business."), /approved claims word for word[^]*still deliver every asked-for piece[^]*never drop one to stay safe/);
  assert.doesNotMatch(RULES.join(" "), /works either way/);
  assert.match(rule("Map every signal to an asset."), /not the deliverable[^]*priority the owner names takes a top slot/);
  assert.match(rule("Write for a busy owner."), /working stays in the numbers ledger/);
  assert.match(rule("Publishable means finished."), /only what the customer reads: no working notes[^]*private survey quote[^]*copy-check\.cjs/);
  assert.match(rule("One basis per number."), /numbers\.cjs[^]*margin, not order value[^]*on hand, held, inbound and sellable[^]*one money basis per table[^]*Cut means zero/i);
  assert.match(rule("Show the after."), /numbers ledger, with at most one assumed input, named in the line/);
  assert.match(rule("Fund each test cell to its read."), /^Fund each test cell to its read\. When the brief asks for a test,/);
  assert.match(rule("Spend plans add up."), /at most 15%[^]*Fund proven winners from the start where tracking works/);
});

test("the rules stay short, plain and free of bench brands", () => {
  const all = RULES.join(" ");
  // 900 until the round 2 rollback added the owner's priority and the customer-copy-only rule.
  assert.ok(all.split(/\s+/).length < 950, `house rules run ${all.split(/\s+/).length} words`);
  assert.doesNotMatch(all, /[–—]/, "no em or en dashes");
  assert.doesNotMatch(all, /\bbeta\b|practitioner yardstick|start date/i);
  assert.doesNotMatch(all, /\b20\d\d\b/, "no calendar years");
  // Brands that are also everyday words match only as written (capitalised), like the bench leak guard.
  const everyday = new Set(["Plum", "Buffer", "Minimalist", "Plausible", "Snitch", "Headspace", "Basecamp"]);
  for (const b of BRANDS) assert.doesNotMatch(all, new RegExp(`\\b${b.replace(".", "\\.")}\\b`, everyday.has(b) ? "" : "i"), `no brand: ${b}`);
});
