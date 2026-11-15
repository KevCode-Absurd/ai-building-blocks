// Brand brain v2 (14 Nov 2026): buyer-facing work stands on a foundation layer (voice bank from the site, the Ad
// Library and past ads; why they buy from reviews; messaging, personas, design, dos and don'ts) and a data layer
// (segments and creatives from the ad account). The connector puts the intake and this rule in the first load.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { TOOL_FILES, BRAND_TOOLS } from "../src/modules/packs/build.ts";
import { firstLoadFiles } from "../src/modules/mcp/pack-files.ts";
import { MCP_INSTRUCTIONS_OWN_AI } from "../src/modules/mcp/server.ts";

const load = (rel: string): Promise<any> => import(rel);
const bbPath = "../../catalogue-items/general/brand-dna-capture/scripts/brand-brain.mjs";
const now = new Date("2026-11-14T12:00:00Z");
const tmp = () => { const d = mkdtempSync(path.join(tmpdir(), "bb2-")); return { dir: d, ctx: path.join(d, "context") }; };

test("an empty brain asks for the brain, the client's material and access to the numbers", async () => {
  const bb = await load(bbPath);
  const { ctx } = tmp();
  const r = bb.askBrain(ctx, { now, kind: "ad_creative" });
  assert.equal(r.ask, true);
  assert.match(r.text, /Do you have a brand brain/);
  assert.match(r.text, /old ad copy, a creative folder or Drive link, email exports/);
  assert.match(r.text, /read access to your ad account/);
  assert.match(r.text, /Before you ask, look/);
  assert.ok(r.questions.length <= 4, "room is left for the job's own question");
  assert.equal(bb.askBrain(ctx, { now, kind: "code" }).ask, false, "a job with no brand need asks nothing");
  const c = bb.checkBrain(ctx, { now, kind: "ad_creative" });
  assert.equal(c.score, 0);
  assert.equal(c.ready, false);
});

test("ads go into the voice bank word for word, long runs are marked proven, and patterns are counted", async () => {
  const bb = await load(bbPath);
  const { dir, ctx } = tmp();
  const f = path.join(dir, "ads.json");
  writeFileSync(f, JSON.stringify({ data: [
    { ad_archive_id: "1", ad_creative_bodies: ["Light gold for every day.\nShop now"], ad_creative_link_titles: ["Everyday gold"], ad_delivery_start_time: "2026-08-01", call_to_action_type: "SHOP_NOW" },
    { ad_archive_id: "2", ad_creative_bodies: ["Your first real gold? Start small."], ad_delivery_start_time: "2026-10-20", ad_delivery_stop_time: "2026-10-25", call_to_action_type: "SHOP_NOW" },
  ] }));
  const r = bb.ingestAds(ctx, bb.readRows(f), { source: "library", now });
  assert.equal(r.ads, 2);
  assert.equal(r.patterns.proven, 1);
  assert.equal(r.patterns.question_hooks, 0.5);
  const bank = readFileSync(path.join(ctx, "brand-file", "foundation", "voice-bank.md"), "utf8");
  assert.match(bank, /- "Light gold for every day\. \/ Shop now" \| ad \(Ad Library\) 1, 2026-08-01, 107 days, still running, PROVEN/);
  assert.match(bank, /## Patterns: library/);
  bb.ingestAds(ctx, bb.readRows(f), { source: "library", now });
  assert.equal((readFileSync(path.join(ctx, "brand-file", "foundation", "voice-bank.md"), "utf8").match(/Light gold for every day/g) || []).length, 1, "a line read twice is kept once");
  bb.ingestAds(ctx, bb.readRows(f), { source: "competitor:Rival", now });
  assert.match(readFileSync(path.join(ctx, "brand-file", "foundation", "competitors.md"), "utf8"), /## Rival/);
});

test("segments show spend share against revenue share and flag under-spent winners and over-spent segments", async () => {
  const bb = await load(bbPath);
  const { dir, ctx } = tmp();
  const f = path.join(dir, "ag.csv");
  writeFileSync(f, "age,gender,spend,purchase_value,purchases\n25-34,female,1000,5000,40\n35-44,female,3000,6000,30\n45-54,female,500,4000,20\n25-34,male,800,800,5\n");
  const r = bb.ingestSegments(ctx, [f], { now });
  assert.deepEqual(r.winners, ["25-34 / female", "45-54 / female"]);
  assert.deepEqual(r.over, ["35-44 / female"]);
  const md = readFileSync(path.join(ctx, "brand-file", "data", "segments.md"), "utf8");
  assert.match(md, /\| 45-54 \/ female \| 9\.4% \| 25\.3% \| 8\.00 \| 268 \|/);
  assert.match(md, /too small to judge/);
  const plan = bb.planCreatives(ctx, { n: 10, now });
  assert.equal(plan.slots.length, 10);
  assert.ok(!plan.slots.some((s: any) => s.segment === "35-44 / female"), "the plan never feeds an over-spent segment");
  assert.ok(plan.slots.some((s: any) => /^Under-spent winner/.test(s.why)));
  assert.ok(plan.slots.some((s: any) => /^Test/.test(s.why)), "some of the set is kept for tests");
});

test("reviews give counted reasons, occasions, objections and customer words", async () => {
  const bb = await load(bbPath);
  const { dir, ctx } = tmp();
  const f = path.join(dir, "rev.csv");
  writeFileSync(f, 'text,rating,date\n"A gift for my wife on our anniversary, beautiful finish",5,2026-09-01\n"Delivery was late and the clasp broke",2,2026-09-10\n"Wear it daily wear to office, light and pretty",5,2026-09-12\n');
  const r = bb.ingestReviews(ctx, bb.readRows(f), { now });
  assert.equal(r.reviews, 3);
  const md = readFileSync(path.join(ctx, "brand-file", "foundation", "why-they-buy.md"), "utf8");
  assert.match(md, /## Occasions named[\s\S]*anniversary: 1/);
  assert.match(md, /## Objections and complaints[\s\S]*clasp broke/);
  assert.match(readFileSync(path.join(ctx, "brand-file", "foundation", "voice-bank.md"), "utf8"), /## Customer words[\s\S]*beautiful finish/);
});

test("voice-check fails the stiff AI lines that made the Gehna ad bad, and passes a plain one", async () => {
  const bb = await load(bbPath);
  const { ctx } = tmp();
  const bad = "Fair warning: wear these earrings to a family function and someone is likely to ask where they are from.\nWhether you share the link is entirely up to you.";
  const r = bb.voiceCheck(ctx, bad, { ads: true });
  assert.equal(r.ok, false);
  assert.match(r.text, /"fair warning" opener/);
  assert.match(r.text, /a predicted-compliment formula/);
  assert.match(r.text, /a coy aside/);
  assert.match(r.text, /THIN: fill the voice bank first/);
  assert.equal(bb.voiceCheck(ctx, "Light gold for every day.").ok, true);
  assert.equal(bb.voiceCheck(ctx, "Gold that lasts — for years.").ok, false, "dashes fail");
  // Rounds 3 and 4: "Every stone we set is natural." passed the voice check but was false for a store with a lab-grown line.
  const abs = bb.voiceCheck(ctx, "Every stone we set is natural.");
  assert.match(abs.text, /an absolute claim \("Every stone"\)/);
  assert.doesNotMatch(bb.voiceCheck(ctx, "Light gold for every day.").text, /absolute claim/);
  // Round 6: a date promise on a plan that ships after the last payment, and a ranking no source backed.
  const promise = bb.voiceCheck(ctx, "Wedding in February? Book it at today's price.\nOur #1 most added earring this season.");
  assert.match(promise.text, /a date promise/);
  assert.match(promise.text, /a pay-later line/);
  assert.match(promise.text, /a ranking: quote the store's own tag/);
  assert.doesNotMatch(bb.voiceCheck(ctx, "Light gold you will wear every day.").text, /date promise|ranking|pay-later/);
});

test("sources record where each part came from, and whether access worked", async () => {
  const bb = await load(bbPath);
  const { ctx } = tmp();
  bb.addSource(ctx, "creative folder", "drive link", { status: "no-access", note: "asked to set it to anyone with the link", now });
  bb.addSource(ctx, "ads", "Meta Ad Library", { status: "public", now });
  const md = readFileSync(path.join(ctx, "brand-file", "sources.md"), "utf8");
  assert.match(md, /- ads \| Meta Ad Library \| public \| 2026-11-14/);
  assert.match(md, /no-access \| 2026-11-14 \| asked to set it/);
  assert.throws(() => bb.addSource(ctx, "x", "y", { status: "maybe", now }), /provided, public or no-access/);
});

test("every brand-facing pack carries the tool, every pack carries the foundation rule, and the connector loads both first", () => {
  assert.ok(TOOL_FILES.some(t => t.name === "brand-brain.mjs"));
  assert.ok(BRAND_TOOLS.has("brand-brain.mjs"), "brand-facing roles only");
  assert.ok(TOOL_FILES.some(t => t.name === "quality/FOUNDATION.md") && !BRAND_TOOLS.has("quality/FOUNDATION.md"), "every agent gets foundation first");
  const ad = firstLoadFiles("Make 20 static ad creatives for our jewellery store").paths;
  assert.ok(ad.includes("tools/quality/INTAKE.md") && ad.includes("tools/quality/FOUNDATION.md"));
  assert.ok(ad.indexOf("tools/quality/INTAKE.md") === ad.indexOf("AGENTS.md") + 1, "the intake comes straight after AGENTS.md");
  const plain = firstLoadFiles("Explain this regex").paths;
  assert.ok(plain.includes("tools/quality/INTAKE.md") && !plain.includes("tools/quality/FOUNDATION.md"));
  assert.ok(!firstLoadFiles(undefined).paths.includes("tools/quality/INTAKE.md"));
  assert.match(MCP_INSTRUCTIONS_OWN_AI, /first ask whether they have a brand brain, and for their site, past ads and creative files/);
  const shared = (f: string) => readFileSync(new URL(`../packs/shared/${f}`, import.meta.url), "utf8");
  assert.match(shared("WORK-METHOD.md"), /Buyer-facing work \(ads, copy, emails, pages\) never skips the brand brain/);
  assert.doesNotMatch(shared("WORK-METHOD.md"), /skip site capture, brand DNA, the taste brief/);
  assert.match(shared("tools/quality/FOUNDATION.md"), /Text on images is set, never drawn/);
  assert.match(shared("tools/quality/FOUNDATION.md"), /Never from it/);
  assert.match(shared("AGENTS.md"), /\*\*Foundation first\.\*\*/);
});

test("the data layer reads any business's breakdown, not only an ad account: a SaaS export by plan", async () => {
  const bb = await load(bbPath);
  const { dir, ctx } = tmp();
  const f = path.join(dir, "plans.csv");
  writeFileSync(f, "plan,cost,mrr,signups\nstarter,2000,3000,120\npro,1000,6000,40\nteam,3000,2500,15\n");
  const r = bb.ingestSegments(ctx, [f], { now });
  assert.deepEqual(r.tables, ["plan"]);
  assert.deepEqual(r.winners, ["pro"]);
  const c = bb.checkBrain(ctx, { now, kind: "analysis" });
  assert.equal(c.parts.find((p: any) => p.id === "voice-bank").needed, false, "an analysis never waits on the voice bank");
  assert.equal(bb.askBrain(ctx, { now, kind: "analysis" }).questions.some((q: string) => /brand brain/.test(q)), false, "nor asks for a brand brain");
});

test("plain job names map to a kind, and a name the tool does not know asks everything instead of nothing", async () => {
  const bb = await load(bbPath);
  const { ctx } = tmp();
  for (const name of ["ads", "statics", "page", "homepage", "campaign", "emails"]) assert.equal(bb.askBrain(ctx, { now, kind: name }).ask, true, name);
  assert.equal(bb.kindOf("homepage").kind, "web_page");
  const odd = bb.askBrain(ctx, { now, kind: "lookbook" });
  assert.equal(odd.ask, true);
  assert.match(odd.text, /"lookbook" is not a kind this tool knows/);
  assert.equal(bb.askBrain(ctx, { now, kind: "dashboard" }).questions.some((q: string) => /brand brain/.test(q)), false, "a dashboard is an analysis");
  assert.equal(bb.askBrain(ctx, { now, kind: "code" }).ask, false);
});

test("build fills every part a tool can from one folder, starts the parts a person writes, and the gate holds buyer-facing work until they exist", async () => {
  const bb = await load(bbPath);
  const { dir, ctx } = tmp();
  const m = (p: string, t: string) => { const f = path.join(dir, "material", p); mkdirSync(path.dirname(f), { recursive: true }); writeFileSync(f, t); };
  m("website/home.html", "<html><head><meta name=\"description\" content=\"Light gold you wear every day\"></head><body><h1>Gold for every day</h1><a href='/c'>Shop the edit</a><p>Each piece is made by hand in our own workshop.</p><script>var x='Shop the edit'</script></body></html>");
  m("ad-library/ads.json", JSON.stringify([{ library_id: "1", body: "Made by hand in our workshop.", headline: "Everyday gold", start_date: "2026-07-01" }]));
  m("ad-library/ads.csv", "library_id,body\n1,Made by hand in our workshop.\n");
  m("ad-library/competitors/rival/ads.json", JSON.stringify([{ library_id: "9", body: "Sale now on" }]));
  m("reviews.csv", "text,rating\n\"Bought it as a gift, lovely finish\",5\n");
  m("insights/breakdown_age.csv", "age,amount_spent,omni_purchase_values,omni_purchase\n25-34,100,500,20\n35-44,300,600,30\n");
  m("insights/account_monthly.csv", "impressions,link_click,landing_page_view,omni_add_to_cart,omni_initiated_checkout,omni_purchase\n10000,300,200,20,10,5\n");
  assert.equal(bb.gateBrain(ctx, { now, kind: "ads" }).ok, false);
  const r = bb.buildBrain(ctx, { from: path.join(dir, "material"), now });
  assert.ok(r.done.some((d: string) => /^site pages: \d+ lines from 1 pages/.test(d)));
  assert.equal(r.done.filter((d: string) => /^ads ad-library\/ads\./.test(d)).length, 1, "the CSV twin of a JSON export is skipped");
  assert.ok(r.done.some((d: string) => /competitors\/rival/.test(d)));
  const bank = readFileSync(path.join(ctx, "brand-file", "foundation", "voice-bank.md"), "utf8");
  assert.match(bank, /"Gold for every day" \| site home\.html \(headline\)/);
  assert.doesNotMatch(bank, /var x/, "scripts are not read as lines");
  assert.match(readFileSync(path.join(ctx, "brand-file", "data", "funnel.md"), "utf8"), /Biggest leak after the click: add to cart \(10\.0% of the step before\)/);
  assert.ok(existsSync(path.join(ctx, "brand-file", "foundation", "personas.md")));
  const g = bb.gateBrain(ctx, { now, kind: "ads" });
  assert.equal(g.ok, false, "started files are empty until written");
  assert.match(g.text, /Missing: foundation\/messaging\.md, foundation\/personas\.md, foundation\/design\.md/);
  writeFileSync(path.join(ctx, "brand-file", "foundation", "messaging.md"), "# Messaging\n- Made by hand in our workshop (site)\n");
  writeFileSync(path.join(ctx, "brand-file", "foundation", "personas.md"), "# Personas\n## Gift buyer: buys for a wife or mother\n- 35-44 pays most (segments)\n");
  writeFileSync(path.join(ctx, "brand-file", "foundation", "design.md"), "# Design\n- Gold #f6b74d on buttons only\n");
  assert.equal(bb.gateBrain(ctx, { now, kind: "ads" }).ok, true);
  assert.equal(bb.checkBrain(ctx, { now: new Date(), kind: "ads" }).parts.find((p: any) => p.id === "messaging").state, "thin", "a hand-written file with no stamp is dated by its saved date: thin (1 of 5 lines), never stale");
  assert.equal(bb.gateBrain(ctx, { now, kind: "dashboard" }).ok, true, "an analysis never waits on the brand brain");
});
