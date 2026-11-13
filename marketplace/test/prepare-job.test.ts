// Job preparation (src/modules/knowledge/prepare.ts and the tool packs carry, tools/prepare-job.mjs): the brief is
// read once into requests, signals and facts, the library is searched for each, and the digest is short and ranked.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { briefAsks, briefFacts, briefSignals, briefModules, cardsFromModuleMarkdown, fitsFacts, JobPrep, preparedMarkdown, type PrepCard } from "../src/modules/knowledge/prepare.ts";

const BRIEF = `We sell cotton bedsheets in India on Shopify (prices in ₹, 40% of orders are cash on delivery).

What I need: "Write a 3-email win-back series for customers who have not ordered in 120 days."

| Segment | Customers | Repeat rate |
|---|---|---|
| Bought once, king size | 4,100 | 9% |
| Bought twice or more | 1,900 | 41% |
| Bought once, single size | 2,300 | 7% |

Return reasons: colour not as shown 44%; size 21%; quality 12%.
In her words: "I want sheets that stay soft after washing."
Numbers marked (test) are test inputs for this exercise.`;

const card = (over: Partial<PrepCard>): PrepCard => ({ id: "EML-0001", module: "EML", claim: "Start win-back at twice the average gap between orders.", text: "Win-back timing for lapsed customers.",
  holds: "Stores with repeat buyers.", fails: "", asks: "When should my win-back start?", tier: 3, scope: "growth", markets: [], amazon: [], mode: "", platforms: [], ...over });

test("facts, requests and signals come out of the brief, and customer quotes and notes are not requests", () => {
  const f = briefFacts(BRIEF);
  assert.equal(f.market, "IN");
  assert.equal(f.platform, "shopify");
  assert.equal(f.cod, true);
  assert.equal(briefFacts("We sell in India and the US, priced in ₹ and $10.").market, undefined, "two markets: no market filter");
  const asks = briefAsks(BRIEF);
  assert.deepEqual(asks, ["Write a 3-email win-back series for customers who have not ordered in 120 days."]);
  const signals = briefSignals(BRIEF);
  assert.ok(signals.some(s => /^Bought twice or more: Repeat rate highest \(build retention/.test(s)), signals.join("\n"));
  assert.ok(signals.some(s => /^colour not as shown: 44% of return reasons \(reduce returns/.test(s)), signals.join("\n"));
  assert.ok(!signals.some(s => /Customers (highest|lowest)/.test(s) && /price/i.test(s)));
  assert.deepEqual(briefModules(asks), ["EML", "CXP"]);
});

test("a funnel table yields the step that drops most", () => {
  const s = briefSignals(`| Device | Sessions | Add to cart | Reached checkout | Orders |\n|---|---|---|---|---|\n| Mobile | 420,000 | 16,800 | 7,100 | 2,350 |\n| In-app | 170,000 | 6,300 | 1,500 | 450 |\n| Desktop | 80,000 | 5,200 | 2,600 | 1,150 |`);
  assert.ok(s.some(x => /^In-app: Add to cart to Reached checkout rate lowest/.test(x)), s.join("\n"));
});

test("cards for another market or marketplace never fit; global and unmarked cards always do", () => {
  const us = briefFacts("A US store on Shopify, prices in $.");
  assert.equal(fitsFacts(card({ markets: ["IN"] }), us), false);
  assert.equal(fitsFacts(card({ markets: ["global"] }), us), true);
  assert.equal(fitsFacts(card({}), us), true);
  assert.equal(fitsFacts(card({ amazon: ["US"] }), us), false, "an Amazon card needs a brief that sells on Amazon");
  assert.equal(fitsFacts(card({ platforms: ["woocommerce"] }), us), false);
});

test("module markdown parses back into cards with their facets, holds and fails lines", () => {
  const md = `# E-commerce knowledge: Email (EML)\n\nIntro.\n\n## Start win-back at twice the gap.\n\nCard EML-0042. Tier 1, baseline, market IN, US; shopify.\n\nBody text here.\n\n**Holds when:** Repeat categories.\n\n**Fails when:** One-off purchases.\n\n**Asked as:** When do I start win-back?\n\n**Source:** A source.\n`;
  const [c] = cardsFromModuleMarkdown("EML", md);
  assert.equal(c.id, "EML-0042");
  assert.deepEqual([c.tier, c.scope, c.markets, c.platforms], [1, "baseline", ["IN", "US"], ["shopify"]]);
  assert.equal(c.holds, "Repeat categories.");
  assert.equal(c.fails, "One-off purchases.");
  assert.equal(c.text, "Body text here.");
});

test("prepare ranks the request's module first, drops near-duplicates and lists gaps; the digest stays short", () => {
  const cards = [
    card({ id: "EML-0001" }),
    card({ id: "EML-0002", claim: "Start win-back at twice the average gap between orders, always.", text: "Win-back timing for lapsed customers." }),
    card({ id: "EML-0003", claim: "Win-back emails lead with what changed since the last order.", text: "Lapsed customers return for news, not discounts." }),
    card({ id: "OFF-0001", module: "OFF", claim: "Bundle sheets with pillow covers to lift order value.", text: "Bedsheet bundles.", asks: "How do I raise order value?" }),
    card({ id: "LPG-0001", module: "LPG", claim: "Show true-colour photos in daylight to cut colour returns.", text: "Colour not as shown returns fall with daylight photos.", markets: ["US"] }),
  ];
  const p = new JobPrep(cards).prepare(BRIEF, { k: 10 });
  const ids = p.picks.map(x => x.card.id);
  assert.equal(ids[0].slice(0, 3), "EML");
  assert.ok(!(ids.includes("EML-0001") && ids.includes("EML-0002")), "near-duplicate dropped");
  assert.ok(!ids.includes("LPG-0001"), "US-only card filtered for an Indian store");
  assert.ok(p.gaps.some(g => /colour not as shown/.test(g)), "the colour-return signal has no fitting card: a gap");
  const md = preparedMarkdown(p);
  assert.match(md, /\*\*Facts read from the brief \(used as filters\):\*\* market IN; shopify; cash on delivery/);
  assert.match(md, /## Gaps[\s\S]*No strong card for: colour not as shown/);
  assert.ok(md.split(/\s+/).length < 1200);
});

test("the pack tool is generated from the source and runs in a pack folder", async () => {
  const load = (rel: string): Promise<any> => import(rel);
  const gen = await load("../scripts/gen-prepare-job.mjs");
  assert.equal(readFileSync(gen.TARGET, "utf8"), gen.generate(), "out of date: run node scripts/gen-prepare-job.mjs");
  const dir = mkdtempSync(path.join(tmpdir(), "prep-"));
  mkdirSync(path.join(dir, "knowledge", "ecommerce"), { recursive: true });
  writeFileSync(path.join(dir, "AGENTS.md"), "# Agent\n");
  writeFileSync(path.join(dir, "knowledge", "ecommerce", "EML.md"),
    "# E-commerce knowledge: Email (EML)\n\n## Start win-back at twice the average gap between orders.\n\nCard EML-0001. Tier 3, growth.\n\nWin-back timing for lapsed customers.\n\n**Holds when:** Repeat buyers.\n\n**Asked as:** When should my win-back start?\n");
  const work = mkdtempSync(path.join(tmpdir(), "prep-work-"));
  writeFileSync(path.join(work, "brief.md"), BRIEF);
  const r = spawnSync(process.execPath, [gen.TARGET, "brief.md", "--pack", dir], { cwd: work, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /EML-0001/);
  assert.ok(existsSync(path.join(work, "context", "knowledge-brief.md")));
  assert.match(readFileSync(path.join(work, "context", "trace.md"), "utf8"), /\| Question \| Cards \| Call it supports \|[\s\S]*EML-0001/);
});
