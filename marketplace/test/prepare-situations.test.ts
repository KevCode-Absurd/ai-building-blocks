// Situation match, the owner-words layer and stage-scoped preparation (src/modules/knowledge/prepare.ts,
// scripts/tag-card-situations.mjs, knowledge/ecommerce/synonyms.json): cards carry the situations they hold in, the
// brief says the store's, a card for another kind of store is pushed down, owner words reach expert cards, and an
// agent can pass its stage, hypotheses and modules while the old call keeps working.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { amountsIn, bandOf, briefFacts, cardsFromModuleMarkdown, JobPrep, parseFits, preparedMarkdown, situationMisfits, type PrepCard } from "../src/modules/knowledge/prepare.ts";
import { cardMarkdown, fitsLine, type Card } from "../src/modules/knowledge/cards.ts";
import { KnowledgeIndex, synonymsOf, tokens } from "../src/modules/packs/retrieve.ts";

const load = (rel: string): Promise<any> => import(rel);
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const card = (over: Partial<PrepCard>): PrepCard => ({ id: "ADC-0001", module: "ADC", claim: "Raise budget in steps.", text: "Budget steps for Meta.", holds: "", fails: "", asks: "",
  tier: 3, scope: "growth", markets: [], amazon: [], mode: "", platforms: [], ...over });

test("money amounts and bands: currencies, k and lakh, a day and a month", () => {
  const a = amountsIn("Meta at about $1,800 a day ($54k a month); hero at Rs 2,199; £34 AOV; 2 lakh");
  assert.deepEqual(a.map(x => Math.round(x.usd)), [1800, 54000, 26, 43]);
  assert.match(a[0].after, /^a day/);
  assert.equal(bandOf("spend", 54_000), "mid");
  assert.equal(bandOf("spend", 250_000), "large");
  assert.equal(bandOf("traffic", 42_000), "medium");
  assert.equal(bandOf("price", 240), "high");
});

test("the brief gives the store's situation, and only where it is clear", () => {
  const f = briefFacts("We sell cast-iron pans on our Shopify store, US only, AOV $118. Meta is our main channel at about $1,800 a day ($54k a month). Last 30 days: Sessions | 42,000");
  assert.deepEqual([f.spend, f.price, f.traffic, f.stage, f.model], ["mid", "mid", "medium", "scaling", ["dtc"]]);
  const pre = briefFacts("Two of us plan to launch a new DTC dog grooming brand on Shopify, US only.");
  assert.equal(pre.stage, "prelaunch");
  const amazon = briefFacts("We are a US private-label seller on Amazon.com only (FBA for every order, no website).");
  assert.deepEqual(amazon.model, ["marketplace"]);
  const sub = briefFacts("We roast coffee and sell subscriptions on Shopify through a third-party subscription app.");
  assert.ok(sub.model!.includes("subscription"));
  const vague = briefFacts("I need ad copy for our candles.");
  assert.deepEqual([vague.stage, vague.spend, vague.price, vague.model], [undefined, undefined, undefined, undefined], "nothing clear, nothing set");
});

test("situation facets survive the card markdown and filter only on a clear difference", () => {
  const c = { situations: { spend: ["large"], stage: ["scaling"] } } as Pick<Card, "situations">;
  assert.equal(fitsLine(c), "spend large; stage scaling");
  assert.deepEqual(parseFits("spend large; stage scaling; colour blue"), { spend: ["large"], stage: ["scaling"] });
  const md = `# E-commerce knowledge: Ads (ADC)\n\n## Keep a backup ad account above $250k a month.\n\nCard ADC-0038. Tier 4, growth.\n\nBody.\n\n**Holds when:** Meta accounts spending over about $250k a month.\n\n**Fits:** spend large\n\n**Source:** A source.\n`;
  const [parsed] = cardsFromModuleMarkdown("ADC", md);
  assert.deepEqual(parsed.situations, { spend: ["large"] });
  assert.equal(parsed.text, "Body.", "the Fits line is not card text");
  const mid = briefFacts("US Shopify store, Meta spend about $54k a month.");
  assert.deepEqual(situationMisfits(parsed, mid), ["spend"]);
  assert.deepEqual(situationMisfits(parsed, briefFacts("A US store on Shopify.")), [], "spend unknown: no misfit");
  assert.deepEqual(situationMisfits(card({ situations: { model: ["subscription", "dtc"] } }), mid), [], "one shared model is enough");
});

test("the card index does not search the Fits line", () => {
  const base = { id: "ADC-0038", modules: ["ADC"], topics: [], claim: "Keep a backup ad account.", body: "word ".repeat(70), conditions: "", fails_when: "", scope: "growth", tier: 4,
    numbers: [], asks: [], platforms: [], platform: [], jurisdiction: [], marketplace: [], mode: "", source: "S1", evidence: { where: "" }, strength: "", public: true, situations: { spend: ["large"] } } as Card;
  assert.match(cardMarkdown(base, undefined), /\*\*Fits:\*\* spend large/);
});

test("the tagger reads situations from conditions and fails-when, and is stable on a second run", async () => {
  const { cardSituations } = await load("../scripts/tag-card-situations.mjs");
  const tag = (conditions: string, fails_when = "", claim = "A claim.") => cardSituations({ claim, conditions, fails_when, modules: ["ADC"] }).situations;
  assert.deepEqual(tag("Meta accounts spending over about $250k a month."), { spend: ["large"] });
  assert.deepEqual(tag("Subscription brands with enough monthly cancels."), { model: ["subscription"] });
  assert.deepEqual(tag("Stores running A/B tests, mainly above about 300,000 monthly sessions."), { traffic: ["high"] });
  assert.deepEqual(tag("Meta advertisers at low to mid spend.", "Very high-spend accounts."), { spend: ["small", "mid"] });
  assert.deepEqual(tag("Online sales in India, through an own website or a marketplace."), { model: ["dtc", "marketplace"] }, "joined by 'or': fits either");
  assert.deepEqual(tag("DTC subscription brands."), { model: ["subscription"] }, "DTC qualifies the narrower model");
  assert.deepEqual(tag("Ecommerce stores, from launch up to about $5k to $10k a day in spend."), {}, "up to the top of a range covers every band");
  assert.deepEqual(tag("Products with a large Amazon review base in the category."), {}, "reading Amazon reviews is not selling on Amazon");
  assert.deepEqual(tag("Most brands.", "Small accounts with few conversions."), { stage: ["scaling"] }, "failing for small accounts rules out pre-launch too");
  const again = tag("Meta accounts spending over about $250k a month.");
  assert.deepEqual(again, { spend: ["large"] });
});

test("owner words reach expert cards through the vertical's synonyms file, and no file searches as before", () => {
  const synonyms = JSON.parse(readFileSync(path.join(ROOT, "knowledge", "ecommerce", "synonyms.json"), "utf8"));
  assert.equal(synonyms.schema, "ai-blocks-synonyms/1");
  const files = [
    { path: "knowledge/cards/EML-0001.md", text: "# Recover abandoned checkouts with a one-hour email.\n\nCheckout abandonment emails recover sales." },
    { path: "knowledge/cards/LPG-0001.md", text: "# Put reviews near the price.\n\nReviews beside the price answer doubts on the product page." },
  ];
  const q = "lots of people add to cart and leave";
  assert.ok(synonymsOf(tokens(q), null).length === 0);
  const plain = new KnowledgeIndex(files);
  const withSyn = new KnowledgeIndex(files, { synonyms });
  assert.equal(withSyn.ask(q, { k: 2 }).passages[0]?.path, "knowledge/cards/EML-0001.md");
  assert.ok(!plain.ask(q, { k: 2 }).passages.some(p => p.path === "knowledge/cards/EML-0001.md"), "without the layer, owner words miss the expert card");
  // Groups work both ways: "average order" finds an "AOV" card.
  const aov = new KnowledgeIndex([{ path: "a.md", text: "# Lift AOV with a bundle.\n\nBundles raise AOV for consumables." }, { path: "b.md", text: "# Faster pages.\n\nSpeed helps." }], { synonyms });
  assert.equal(aov.ask("how do I get a bigger average order", { k: 1 }).passages[0]?.path, "a.md");
});

test("prepare pushes down a card for another kind of store, and takes stage, hypotheses and modules", () => {
  const cards = [
    card({ id: "ADC-0001", claim: "Scale Meta budget in steps while new-customer ROAS stays above break-even.", text: "Budget steps for scaling Meta spend." }),
    card({ id: "ADC-0038", claim: "Above $250k a month on Meta, keep a backup ad account and scale budget.", text: "Big account budget scaling on Meta.", situations: { spend: ["large"] } }),
    card({ id: "EML-0006", module: "EML", claim: "Win back cancelled subscribers with a deeper first reorder offer.", text: "Subscription win-back.", situations: { model: ["subscription"] } }),
    card({ id: "MEA-0025", module: "MEA", claim: "Track acquisition MER, new-customer revenue over ad spend, not blended MER.", text: "New customer measurement for scaling." }),
  ];
  const brief = "US Shopify store, Meta spend about $54k a month. I need a plan to scale Meta budget.";
  const prep = new JobPrep(cards);
  const old = prep.prepare(brief);
  const ids = old.picks.map(p => p.card.id);
  assert.ok(ids.indexOf("ADC-0001") < ids.indexOf("ADC-0038") || !ids.includes("ADC-0038"), ids.join(","));
  assert.equal(old.stage, undefined);
  const staged = prep.prepare(brief, { stage: "diagnose", hypotheses: ["new customer revenue is below break-even while blended looks fine"], modules: ["MEA"], k: 3 });
  assert.equal(staged.stage, "diagnose");
  assert.ok(staged.queries.some(q => q.kind === "hypothesis"));
  assert.ok(staged.picks.slice(0, 2).some(p => p.card.id === "MEA-0025"), staged.picks.map(p => p.card.id).join(","));
  const md = preparedMarkdown(staged);
  assert.match(md, /\*\*The store's situation[^\n]*ad spend mid/);
  assert.match(md, /\*\*Stage:\*\* diagnose/);
  assert.match(md, /Your hypotheses, each searched/);
});
