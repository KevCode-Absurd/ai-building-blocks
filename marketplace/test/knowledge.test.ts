// Vertical knowledge libraries (knowledge/<vertical>/, src/modules/knowledge): card validation, the hard filters,
// tier prior, freshness and wild-bet rules in retrieval, what is published (public cards only), what a vertical
// agent carries, and the public API.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { testEnv } from "./helpers.ts";
import { CardIndex, cardAnswerText, cardMarkdown, cardProblems, type Card, type Source, type Vertical } from "../src/modules/knowledge/cards.ts";
import { personaVerticalFiles, verticalBundle, verticalKnowledgeSection } from "../src/modules/knowledge/bundle.ts";
import { cardQuery, forgetVerticals } from "../src/modules/knowledge/service.ts";
import { NOVA } from "./fixtures.ts";
import type { Persona } from "../src/core/types.ts";

const VERTICAL = JSON.parse(readFileSync(new URL("../knowledge/ecommerce/vertical.json", import.meta.url), "utf8")) as Vertical;

const src = (id: string, extra: Partial<Source> = {}): Source => ({ id, title: `Source ${id}`, author: "A practitioner", url: `https://example.org/${id}`, date: "2026-06-01", rights: "public_reference", tier: 3, modules: ["MCR"], why: "Numbers and conditions.", cards: 1, public: true, ...extra });
const words = (n: number, w = "spend") => Array.from({ length: n }, (_, i) => `${w}${i % 7}`).join(" ");
const card = (id: string, extra: Partial<Card> = {}): Card => ({
  id, modules: [id.slice(0, 3)], topics: [], claim: "Test 3 to 5 new hooks per concept each week at under 10k a month in ad spend.",
  body: `Creative fatigue sets in fast at low spend. ${words(70)}`, conditions: "Under 10k a month in Meta spend.", fails_when: "Above 50k a month, where volume needs to be higher.",
  scope: "growth", tier: 3, numbers: ["3 to 5 hooks per concept"], asks: ["how many new ads should we test each week"], platforms: [], platform: [], jurisdiction: [], marketplace: [], mode: "",
  source: "S0001", evidence: { where: "minute 12" }, strength: "stated_by_practitioner", public: true, ...extra,
});

test("the e-commerce vertical has the 23 modules of the ingestion spec with their review windows", () => {
  assert.equal(VERTICAL.modules.length, 23);
  assert.deepEqual(VERTICAL.modules.slice(0, 3).map(m => m.code), ["PRD", "AVT", "OFF"]);
  assert.equal(VERTICAL.modules.find(m => m.code === "MCR")!.review_due_days, 180);
  assert.deepEqual(VERTICAL.modules.find(m => m.code === "AMZ")!.required, ["marketplace", "mode"]);
  assert.equal(VERTICAL.aliases!.DEP, "ADC");
});

test("card validation: ids, modules, one claim, body length, fails_when on growth cards, short quotes, module fields", () => {
  const sources = new Map([["S0001", src("S0001")]]);
  assert.deepEqual(cardProblems(card("MCR-0001"), VERTICAL, sources), []);
  const bad = cardProblems(card("MCR-1", { scope: "growth", fails_when: "", evidence: { where: "", quote: words(16, "q") }, source: "S9999" }), VERTICAL, sources);
  assert.ok(bad.includes("id must be like LPG-0007"));
  assert.ok(bad.includes("a growth card needs fails_when"));
  assert.ok(bad.includes("evidence quote must be under 15 words"));
  assert.ok(bad.includes("source S9999 is not in sources.json"));
  assert.ok(cardProblems(card("FIN-0001"), VERTICAL, sources).includes("FIN cards need jurisdiction"));
  assert.deepEqual(cardProblems(card("FIN-0001", { jurisdiction: ["IN"] }), VERTICAL, sources), []);
  assert.ok(cardProblems(card("LPG-0001", { modules: ["MCR"] }), VERTICAL, sources).includes("id must start with the primary module"));
  assert.ok(cardProblems(card("MCR-0002", { body: "Too short." }), VERTICAL, sources).some(p => /body has/.test(p)));
});

test("retrieval: the asked-as questions bridge the founder's words, and a card for another market never comes back", () => {
  const cards = [
    card("MCR-0001"),
    card("FIN-0001", { modules: ["FIN"], claim: "Register for GST once turnover passes the threshold for your state.", body: `GST registration in India. ${words(70, "gst")}`, jurisdiction: ["IN"], asks: ["do I need to register for tax in India"], scope: "baseline", fails_when: "" }),
    card("FIN-0002", { modules: ["FIN"], claim: "Collect sales tax once you pass a state's economic nexus threshold.", body: `US sales tax nexus. ${words(70, "nexus")}`, jurisdiction: ["US"], asks: ["do I need to register for tax in the US"], scope: "baseline", fails_when: "" }),
  ];
  const index = new CardIndex(VERTICAL, cards, [src("S0001")]);
  assert.equal(index.ask("how many new ads should we test every week").hits[0].card.id, "MCR-0001");
  const india = index.ask("do I need to register for tax", { jurisdiction: "IN" });
  assert.deepEqual(india.hits.map(h => h.card.id), ["FIN-0001"]);
  assert.ok(!index.ask("do I need to register for tax", { jurisdiction: "US" }).hits.some(h => h.card.id === "FIN-0001"));
  assert.deepEqual(index.ask("register tax", { modules: ["MCR"] }).hits.map(h => h.card.id).filter(id => id.startsWith("FIN")), []);
});

test("ranking: platform docs beat a practitioner on the same point, stale cards are marked, wild bets come after baseline", () => {
  const same = { claim: "Turn on server-side events so purchases are deduplicated with the pixel.", body: `Deduplicate pixel and server events with one event id. ${words(70, "dedupe")}`, asks: ["why are my purchases counted twice"], modules: ["MEA"] };
  const sources = [src("S0001"), src("S0002", { tier: 1, url: "https://developers.facebook.com/docs" }), src("S0003", { date: "2023-01-01" })];
  const index = new CardIndex(VERTICAL, [
    card("MEA-0001", { ...same, source: "S0001", tier: 3 }),
    card("MEA-0002", { ...same, source: "S0002", tier: 1 }),
    card("MCR-0003", { source: "S0003", claim: "Hooks that name the buyer's problem beat brand intros.", asks: ["what hook should open my ad"] }),
    card("WLD-0001", { modules: ["WLD"], scope: "growth", claim: "A handwritten note to your first 100 buyers drives word of mouth.", body: `Personal notes as a stunt. ${words(70, "note")}`, asks: ["what hook should open my ad", "how do I get word of mouth"] }),
    card("MCR-0004", { scope: "baseline", fails_when: "", claim: "Every ad opens with a hook in the first 2 seconds.", asks: ["what hook should open my ad"] }),
  ], sources);
  assert.equal(index.ask("why are my purchases counted twice").hits[0].card.id, "MEA-0002");
  const hooks = index.ask("what hook should open my ad", { today: "2026-11-13" });
  assert.equal(hooks.hits.find(h => h.card.id === "MCR-0003")!.stale, true, "older than MCR's 180-day window");
  const order = hooks.hits.map(h => h.card.id);
  assert.ok(order.indexOf("WLD-0001") > order.indexOf("MCR-0004"), order.join(","));
  assert.match(cardAnswerText(hooks, "E-commerce"), /STALE/);
  assert.match(cardAnswerText(index.ask("sourdough starter ratio for bread"), "E-commerce"), /no card on this|Weak match/);
});

test("only public cards from public sources are published, and a vertical agent carries the baseline, its modules and the sources", () => {
  const sources = [src("S0001"), src("S0002", { rights: "licensed", public: false })];
  const cards = [card("MCR-0001"), card("MCR-0002", { source: "S0002", public: false }), card("MEA-0001", { modules: ["MEA"], scope: "baseline", fails_when: "" }), card("FIN-0001", { modules: ["FIN"], jurisdiction: ["US"] })];
  const b = verticalBundle(VERTICAL, cards, sources);
  assert.deepEqual(b.cards.map(c => c.id), ["FIN-0001", "MCR-0001", "MEA-0001"]);
  assert.deepEqual(b.sources.map(s => s.id), ["S0001"]);
  assert.ok(!JSON.stringify(b.index).includes("MCR-0002"));
  assert.deepEqual(Object.keys(b.files).sort(), ["knowledge/ecommerce/FIN.md", "knowledge/ecommerce/MCR.md", "knowledge/ecommerce/MEA.md", "knowledge/ecommerce/baseline.md", "knowledge/ecommerce/sources.md"]);
  assert.match(b.files["knowledge/ecommerce/MCR.md"].content, /^# E-commerce knowledge: Paid social creative \(MCR\)/);
  const specialist: Persona = { ...NOVA, vertical: "ecommerce", modules: ["MCR", "ADC"] };
  assert.deepEqual(personaVerticalFiles(specialist, b).map(f => f.path), ["knowledge/ecommerce/baseline.md", "knowledge/ecommerce/MCR.md", "knowledge/ecommerce/sources.md"]);
  assert.match(personaVerticalFiles(specialist, b)[0].content, /MEA-0001/, "the baseline holds other modules' baseline cards");
  assert.equal(personaVerticalFiles(specialist, b)[0].shared, false);
  const lead: Persona = { ...NOVA, vertical: "ecommerce", modules: VERTICAL.modules.map(m => m.code) };
  assert.deepEqual(personaVerticalFiles(lead, b).map(f => f.path), ["knowledge/ecommerce/MEA.md", "knowledge/ecommerce/FIN.md", "knowledge/ecommerce/sources.md"], "its only baseline card is in MEA.md, which it carries, so no baseline file");
  assert.deepEqual(personaVerticalFiles(NOVA, b), [], "an agent outside the vertical carries none of it");
  const note = verticalKnowledgeSection(specialist, b, personaVerticalFiles(specialist, b).map(f => f.path), "https://agents.useaiblocks.com/mcp");
  assert.match(note, /^## E-commerce knowledge library/);
  assert.match(note, /ask_vertical_knowledge/);
  assert.match(cardMarkdown(b.cards[1], b.sources[0]), /\*\*Fails when:\*\*[\s\S]*\*\*Source:\*\* Source S0001, A practitioner, 2026-06-01 \(https:\/\/example\.org\/S0001\)/);
});

test("query options from loose input keep only known modules and values", () => {
  const q = cardQuery(VERTICAL, { modules: "lpg, OFF,xyz", jurisdiction: "in", mode: "amazon_first", platform: "magento", k: "50" });
  assert.deepEqual(q.modules, ["LPG", "OFF"]);
  assert.equal(q.jurisdiction, "IN");
  assert.equal(q.mode, "amazon_first");
  assert.equal(q.platform, undefined);
  assert.equal(q.k, 6);
});

after(() => forgetVerticals());

test("GET /api/knowledge/ecommerce and /ask serve the built index, and an unknown library is a 404", async () => {
  forgetVerticals();
  const b = verticalBundle(VERTICAL, [card("MCR-0001"), card("MCR-0002", { public: false })], [src("S0001")]);
  const assets = { async fetch(req: Request) { const p = new URL(req.url).pathname; return p === "/packs/knowledge/ecommerce/index.json" ? new Response(JSON.stringify(b.index), { headers: { "content-type": "application/json" } }) : new Response("Not found", { status: 404 }); } };
  const t = await testEnv({ ASSETS: assets as unknown as Fetcher });
  const about = await t.api("GET", "/api/knowledge/ecommerce");
  assert.equal(about.status, 200);
  assert.equal(about.body.cards, 1);
  assert.equal(about.body.modules.find((m: { code: string }) => m.code === "MCR").cards, 1);
  const ask = await t.api("GET", "/api/knowledge/ecommerce/ask?q=how%20many%20new%20ads%20should%20we%20test%20each%20week");
  assert.equal(ask.status, 200);
  assert.equal(ask.body.cards[0].id, "MCR-0001");
  assert.equal(ask.body.cards[0].source.title, "Source S0001");
  assert.equal((await t.api("GET", "/api/knowledge/ecommerce/ask?q=hi")).status, 400);
  assert.equal((await t.api("GET", "/api/knowledge/saas")).status, 404);
});
