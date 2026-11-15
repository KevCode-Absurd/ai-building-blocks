// Job preparation (src/modules/knowledge/prepare.ts and the tool packs carry, tools/prepare-job.mjs): the brief is
// read once into requests, signals and facts, the library is searched for each, and the digest is short and ranked.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { briefAsks, briefFacts, briefFactLines, briefSignals, briefModules, cardsFromModuleMarkdown, fitsFacts, JobPrep, keepPicks, planQueries, preparedMarkdown, situationPenalty, withoutNegations, type PrepCard } from "../src/modules/knowledge/prepare.ts";

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
  assert.ok(signals.some(s => /^Bought twice or more segment: Repeat rate highest \(build retention/.test(s)), signals.join("\n"));
  assert.ok(signals.some(s => /^colour not as shown: 44% of return reasons \(reduce returns/.test(s)), signals.join("\n"));
  assert.ok(!signals.some(s => /Customers (highest|lowest)/.test(s) && /price/i.test(s)));
  assert.deepEqual(briefModules(asks), ["EML", "CXP"]);
});

test("a funnel table yields the step that drops most", () => {
  const s = briefSignals(`| Device | Sessions | Add to cart | Reached checkout | Orders |\n|---|---|---|---|---|\n| Mobile | 420,000 | 16,800 | 7,100 | 2,350 |\n| In-app | 170,000 | 6,300 | 1,500 | 450 |\n| Desktop | 80,000 | 5,200 | 2,600 | 1,150 |`);
  assert.ok(s.some(x => /^In-app device: Add to cart to Reached checkout rate lowest/.test(x)), s.join("\n"));
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

test("stated facts become small queries; table titles, quotes and what the store does not do do not", () => {
  const brief = `We sell dog treats in the UK on Shopify. I need a win-back programme.\nLast 12 months:\nMetric | Value\nAverage days between orders | 34\nUnder £20 | 48%\nOur only win-back email goes out at 180 days with 20% off. We do not send text messages. The team thinks retention is improving.`;
  const facts = briefFactLines(brief);
  assert.ok(facts.includes("Average days between orders: 34"), facts.join("\n"));
  assert.ok(!facts.some(f => /^Under £20/.test(f)), "a label of numbers alone is no query");
  assert.ok(!facts.some(f => /Last 12 months/.test(f)), "a table title is no fact");
  assert.ok(facts.some(f => /180 days with 20% off/.test(f)));
  assert.ok(facts.some(f => /thinks retention/.test(f)), "a belief is a fact to check");
  assert.ok(!facts.some(f => /I need/.test(f)), "a request is an ask, not a fact");
  assert.doesNotMatch(withoutNegations(brief), /text messages/);
  assert.match(withoutNegations("We do not sell on TikTok Shop and judge every channel on orders."), /judge every channel/);
  const plan = planQueries(brief);
  assert.ok(!plan.some(q => /text messages/.test(q.text)), "a negated line never becomes search text");
  assert.ok(plan.some(q => q.kind === "fact") && plan.at(-1)!.kind === "brief");
});

test("a store that mentions new customers is not a new store, and an SMS card drops when the store sends no texts", () => {
  const zero = card({ id: "ADC-0052", claim: "At zero-to-one, run a small Meta test campaign.", holds: "New brands under $10k a month." });
  assert.equal(situationPenalty(zero, "Scale our Meta account; ROAS on new customers is 1.7."), 0.15);
  assert.equal(situationPenalty(zero, "We are launching a new brand next month."), 1);
  const sms = card({ id: "EML-0029", claim: "SMS flows: welcome texts on days 1, 3 and 5.", holds: "Stores with SMS consent." });
  const brief = "UK dog treat store on Klaviyo. Write a win-back email series. We do not send text messages.";
  const cards = [sms, card({ id: "EML-0050", claim: "Win-back emails 30 to 45 days after last purchase convert best.", text: "Win-back email timing for lapsed buyers." })];
  const p = new JobPrep(cards).prepare(brief, { k: 5 });
  assert.equal(p.picks[0].card.id, "EML-0050");
  assert.ok(!p.facts.channels.includes("sms"));
});

test("the digest keeps a wider shortlist with the grading step, and --keep narrows it to the cards the AI kept", () => {
  const cards = Array.from({ length: 30 }, (_, i) => card({ id: `EML-${String(i + 1).padStart(4, "0")}`, claim: `Win-back idea ${i + 1}: ${["timing", "offer", "subject line", "segment", "plain text", "discount ladder"][i % 6]} for lapsed customers ${"abcdefghijklmnopqrstuvwxyz1234"[i]}.`, text: `Lapsed customers and win-back email ${i} ${"x".repeat(i + 1)}.` }));
  const p = new JobPrep(cards).prepare(BRIEF, { k: 5, pool: 20 });
  assert.equal(p.picks.length, 5);
  assert.ok(p.shortlist.length > p.picks.length && p.shortlist.length <= 20);
  assert.deepEqual(p.shortlist.slice(0, 5).map(x => x.card.id), p.picks.map(x => x.card.id), "the tool's picks lead the shortlist");
  const md = preparedMarkdown(p);
  assert.match(md, /## Grade these cards before drafting[\s\S]*## Cards[\s\S]*## More candidates[\s\S]*## Gaps/);
  assert.match(md, /--keep ID,ID/);
  const keep = [p.shortlist[p.shortlist.length - 1].card.id, p.picks[0].card.id];
  const { prepared, unknown } = keepPicks(p, [...keep, "ZZZ-9999"], cards);
  assert.deepEqual(unknown, ["ZZZ-9999"]);
  assert.deepEqual(prepared.picks.map(x => x.card.id), keep, "kept in the AI's order");
  const kept = preparedMarkdown(prepared);
  assert.match(kept, /## Cards you kept/);
  assert.doesNotMatch(kept, /Grade these|More candidates/);
});

test("the pack tool's --keep rewrites the digest with the kept cards and logs them in the trace; an unknown id fails", () => {
  const load = (rel: string): Promise<any> => import(rel);
  return load("../scripts/gen-prepare-job.mjs").then(gen => {
    const dir = mkdtempSync(path.join(tmpdir(), "prep-keep-"));
    mkdirSync(path.join(dir, "knowledge", "ecommerce"), { recursive: true });
    writeFileSync(path.join(dir, "AGENTS.md"), "# Agent\n");
    const block = (n: number, claim: string) => `## ${claim}\n\nCard EML-000${n}. Tier 3, growth.\n\nWin-back for lapsed customers, idea ${n}.\n\n**Holds when:** Repeat buyers.\n\n**Asked as:** When should my win-back start?\n`;
    writeFileSync(path.join(dir, "knowledge", "ecommerce", "EML.md"), `# E-commerce knowledge: Email (EML)\n\n${block(1, "Start win-back at twice the average gap between orders.")}\n${block(2, "Lead a win-back email with what is new since the last order.")}`);
    const work = mkdtempSync(path.join(tmpdir(), "prep-keep-work-"));
    writeFileSync(path.join(work, "brief.md"), BRIEF);
    const r = spawnSync(process.execPath, [gen.TARGET, "brief.md", "--pack", dir, "--keep", "EML-0002"], { cwd: work, encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
    const digest = readFileSync(path.join(work, "context", "knowledge-brief.md"), "utf8");
    assert.match(digest, /## Cards you kept[\s\S]*EML-0002/);
    assert.doesNotMatch(digest, /EML-0001/);
    assert.match(readFileSync(path.join(work, "context", "trace.md"), "utf8"), /Graded shortlist: cards kept, best first \| EML-0002/);
    const bad = spawnSync(process.execPath, [gen.TARGET, "brief.md", "--pack", dir, "--keep", "EML-9999"], { cwd: work, encoding: "utf8" });
    assert.equal(bad.status, 2);
    assert.match(bad.stderr, /No card with id EML-9999/);
  });
});

test("on the 24 labelled briefs the tool beats one plain query on must-have cards with no more wrong ones (scripts/eval-prepare.mjs)", () => {
  const r = spawnSync(process.execPath, ["scripts/eval-prepare.mjs", "--json"], { cwd: path.join(import.meta.dirname, ".."), encoding: "utf8", maxBuffer: 1 << 26 });
  assert.equal(r.status, 0, r.stderr);
  const { summary } = JSON.parse(r.stdout);
  assert.ok(summary.prepare.r15 >= 0.45, `prepare must@15 ${summary.prepare.r15}`);
  assert.ok(summary.prepare.r15 > summary["one-query"].r15 + 0.05, "clearly above one query");
  assert.ok(summary.prepare.wrong <= summary["one-query"].wrong, `wrong ${summary.prepare.wrong} vs one query ${summary["one-query"].wrong}`);
  assert.ok(summary.shortlist.r40 >= 0.6, `shortlist must@40 ${summary.shortlist.r40}`);
  assert.ok(summary.digestWords <= 3200, `digest ${summary.digestWords} words`);
});
