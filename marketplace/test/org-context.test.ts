// The org context (was the brand brain, v2 14 Nov 2026; renamed 15 Nov 2026): buyer-facing work stands on a foundation
// layer (brand DNA; voice bank from the site, the Ad Library and past ads; why they buy from reviews; claims, customers,
// how we speak to customers, design language, markets, dos and don'ts) and a data layer (segments and creatives from the
// ad account). The connector puts the intake and this rule in the first load.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { TOOL_FILES, BRAND_TOOLS } from "../src/modules/packs/build.ts";
import { firstLoadFiles } from "../src/modules/mcp/pack-files.ts";
import { MCP_INSTRUCTIONS_OWN_AI } from "../src/modules/mcp/server.ts";

const load = (rel: string): Promise<any> => import(rel);
const bbPath = "../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs";
const now = new Date("2026-11-14T12:00:00Z");
const tmp = () => { const d = mkdtempSync(path.join(tmpdir(), "oc-")); return { dir: d, ctx: path.join(d, "context") }; };

test("an empty org context asks for it, the client's material and access to the numbers", async () => {
  const bb = await load(bbPath);
  const { ctx } = tmp();
  const r = bb.askBrain(ctx, { now, kind: "ad_creative" });
  assert.equal(r.ask, true);
  assert.match(r.text, /Do you have an org context \(a brand guide, brand file or folder about your business\)/);
  assert.match(r.text, /old ad copy, a creative folder or Drive link, email exports/);
  assert.match(r.text, /read access to your ad account/);
  assert.match(r.text, /Before you ask, look/);
  assert.ok(r.questions.length <= 4, "room is left for the job's own question");
  assert.equal(bb.askBrain(ctx, { now, kind: "code" }).ask, false, "a job with no brand need asks nothing");
  const c = bb.checkBrain(ctx, { now, kind: "ad_creative" });
  assert.equal(c.score, 0);
  assert.equal(c.ready, false);
});

test("ads go into the voice bank word for word, long runs are observations with unknown performance, and patterns are counted", async () => {
  const bb = await load(bbPath);
  const { dir, ctx } = tmp();
  const f = path.join(dir, "ads.json");
  writeFileSync(f, JSON.stringify({ data: [
    { ad_archive_id: "1", ad_creative_bodies: ["Light gold for every day.\nShop now"], ad_creative_link_titles: ["Everyday gold"], ad_delivery_start_time: "2026-08-01", call_to_action_type: "SHOP_NOW" },
    { ad_archive_id: "2", ad_creative_bodies: ["Your first real gold? Start small."], ad_delivery_start_time: "2026-10-20", ad_delivery_stop_time: "2026-10-25", call_to_action_type: "SHOP_NOW" },
  ] }));
  const r = bb.ingestAds(ctx, bb.readRows(f), { source: "library", now });
  assert.equal(r.ads, 2);
  assert.equal(r.patterns.proven, 0);
  assert.equal(r.patterns.long_running, 1);
  assert.equal(r.patterns.question_hooks, 0.5);
  const bank = readFileSync(path.join(ctx, "org-context", "foundation", "voice-bank.md"), "utf8");
  assert.match(bank, /- "Light gold for every day\. \/ Shop now" \| ad \(Ad Library\) 1, 2026-08-01, 107 days, still running, LONG-RUNNING; performance unknown/);
  assert.match(bank, /## Patterns: library/);
  bb.ingestAds(ctx, bb.readRows(f), { source: "library", now });
  assert.equal((readFileSync(path.join(ctx, "org-context", "foundation", "voice-bank.md"), "utf8").match(/Light gold for every day/g) || []).length, 1, "a line read twice is kept once");
  bb.ingestAds(ctx, bb.readRows(f), { source: "competitor:Rival", now });
  assert.match(readFileSync(path.join(ctx, "org-context", "foundation", "competitors.md"), "utf8"), /## Rival/);
});

test("segments show spend share against revenue share and flag under-spent winners and over-spent segments", async () => {
  const bb = await load(bbPath);
  const { dir, ctx } = tmp();
  const f = path.join(dir, "ag.csv");
  writeFileSync(f, "age,gender,spend,purchase_value,purchases\n25-34,female,1000,5000,40\n35-44,female,3000,6000,30\n45-54,female,500,4000,20\n25-34,male,800,800,5\n");
  const r = bb.ingestSegments(ctx, [f], { now });
  assert.deepEqual(r.winners, ["25-34 / female", "45-54 / female"]);
  assert.deepEqual(r.over, ["35-44 / female"]);
  const md = readFileSync(path.join(ctx, "org-context", "data", "segments.md"), "utf8");
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
  const md = readFileSync(path.join(ctx, "org-context", "foundation", "why-they-buy.md"), "utf8");
  assert.match(md, /## Occasions named[\s\S]*anniversary: 1/);
  assert.match(md, /## Objections and complaints[\s\S]*clasp broke/);
  assert.match(readFileSync(path.join(ctx, "org-context", "foundation", "voice-bank.md"), "utf8"), /## Customer words[\s\S]*beautiful finish/);
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
  const md = readFileSync(path.join(ctx, "org-context", "sources.md"), "utf8");
  assert.match(md, /- ads \| Meta Ad Library \| public \| 2026-11-14/);
  assert.match(md, /no-access \| 2026-11-14 \| asked to set it/);
  assert.throws(() => bb.addSource(ctx, "x", "y", { status: "maybe", now }), /provided, public or no-access/);
});

test("every brand-facing pack carries the tool, every pack carries the foundation rule, and the connector loads both first", () => {
  assert.ok(TOOL_FILES.some(t => t.name === "org-context.mjs"));
  assert.ok(BRAND_TOOLS.has("org-context.mjs"), "a brand tool");
  assert.ok(TOOL_FILES.some(t => t.name === "quality/FOUNDATION.md") && !BRAND_TOOLS.has("quality/FOUNDATION.md"), "every agent gets foundation first");
  const ad = firstLoadFiles("Make 20 static ad creatives for our jewellery store").paths;
  // The intake (METHOD.md step 0) comes straight after AGENTS.md, and the foundation rule straight after the method.
  assert.ok(ad.indexOf("METHOD.md") === ad.indexOf("AGENTS.md") + 1, "the method, with the intake, comes straight after AGENTS.md");
  assert.ok(ad.indexOf("tools/quality/FOUNDATION.md") === ad.indexOf("METHOD.md") + 1, "the foundation rule follows the method");
  const plain = firstLoadFiles("Explain this regex").paths;
  assert.ok(plain.includes("METHOD.md") && !plain.includes("tools/quality/FOUNDATION.md"));
  assert.ok(firstLoadFiles(undefined).paths.includes("METHOD.md") && !firstLoadFiles(undefined).paths.includes("tools/quality/FOUNDATION.md"));
  assert.match(MCP_INSTRUCTIONS_OWN_AI, /first ask whether they have an org context, and for their site, past ads and creative files/);
  const shared = (f: string) => readFileSync(new URL(`../packs/shared/${f}`, import.meta.url), "utf8");
  assert.match(shared("METHOD.md"), /Buyer-facing work never skips the org context, one-shot or not\./);
  assert.match(shared("METHOD.md"), /Buyer-facing work \(ads, copy, emails, pages\) with no org context and no material is always a gap that changes the work\./);
  assert.doesNotMatch(shared("METHOD.md"), /skip site capture, brand DNA, the taste brief/);
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
  assert.equal(bb.askBrain(ctx, { now, kind: "analysis" }).questions.some((q: string) => /org context/.test(q)), false, "nor asks for an org context");
});

test("plain job names map to a kind, and a name the tool does not know asks everything instead of nothing", async () => {
  const bb = await load(bbPath);
  const { ctx } = tmp();
  for (const name of ["ads", "statics", "page", "homepage", "campaign", "emails"]) assert.equal(bb.askBrain(ctx, { now, kind: name }).ask, true, name);
  assert.equal(bb.kindOf("homepage").kind, "web_page");
  const odd = bb.askBrain(ctx, { now, kind: "lookbook" });
  assert.equal(odd.ask, true);
  assert.match(odd.text, /"lookbook" is not a kind this tool knows/);
  assert.equal(bb.askBrain(ctx, { now, kind: "dashboard" }).questions.some((q: string) => /org context/.test(q)), false, "a dashboard is an analysis");
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
  const bank = readFileSync(path.join(ctx, "org-context", "foundation", "voice-bank.md"), "utf8");
  assert.match(bank, /"Gold for every day" \| site home\.html \(headline\)/);
  assert.doesNotMatch(bank, /var x/, "scripts are not read as lines");
  assert.match(readFileSync(path.join(ctx, "org-context", "data", "funnel.md"), "utf8"), /Biggest leak after the click: add to cart \(10\.0% of the step before\)/);
  assert.ok(existsSync(path.join(ctx, "org-context", "foundation", "customers.md")));
  const g = bb.gateBrain(ctx, { now, kind: "ads" });
  assert.equal(g.ok, false, "started files are empty until written");
  assert.match(g.text, /Not ready:/);
  assert.match(g.text, /foundation\/claims\.md \(missing\)/);
  writeFileSync(path.join(ctx, "org-context", "foundation", "claims.md"), "# Claims allowed and banned\n- Made by hand in our workshop (site)\n");
  writeFileSync(path.join(ctx, "org-context", "foundation", "customers.md"), "# Customers and avatars\n## Gift buyer: buys for a wife or mother\n- 35-44 pays most (segments)\n");
  writeFileSync(path.join(ctx, "org-context", "foundation", "design.md"), "# Design\n- Gold #f6b74d on buttons only\n");
  assert.equal(bb.gateBrain(ctx, { now, kind: "ads" }).ok, false, "thin and undated foundation cannot clear the gate");
  assert.equal(bb.checkBrain(ctx, { now: new Date(), kind: "ads" }).parts.find((p: any) => p.id === "claims").state, "stale", "saving a file is not evidence freshness; an explicit review date is required");
  assert.equal(bb.gateBrain(ctx, { now, kind: "dashboard" }).ok, true, "an analysis never waits on the org context");
});

// 15 Nov 2026: the brand brain and the brand file are one org context in context/org-context/. The old tool names
// and the old folder keep working, and the eight sections Kevin named each have a home.
import { spawnSync } from "node:child_process";
const SCRIPTS = new URL("../../catalogue-items/general/brand-dna-capture/scripts/", import.meta.url);
const run = (tool: string, args: string[]) => spawnSync(process.execPath, [new URL(tool, SCRIPTS).pathname.replace(/^\/([A-Za-z]:)/, "$1"), ...args], { encoding: "utf8" });

test("the org context has the eight sections, a template, and points worth 100 in all", async () => {
  const oc = await load(bbPath);
  assert.equal(oc.FOLDER, "org-context");
  assert.deepEqual(oc.SECTIONS.filter((s: any) => s.n).map((s: any) => s.title), ["Brand DNA", "Customers and avatars", "Voice and writing style", "How we speak to customers", "Design language", "Markets", "Claims allowed and banned", "Do's and don'ts"]);
  assert.equal(oc.PARTS.reduce((n: number, p: any) => n + p.points, 0), 100);
  for (const id of ["brand-dna", "customers", "customer-talk", "markets", "claims", "dos-donts", "design", "voice-bank"]) assert.ok(oc.PARTS.some((p: any) => p.id === id), id);
  const t = oc.templateText();
  assert.match(t, /## 7\. Claims allowed and banned\nFile: context\/org-context\/foundation\/claims\.md/);
  assert.match(t, /context\/MEMORY\.md \(MEMORY-TEMPLATE\.md\)\. Link it; never copy/);
  assert.doesNotMatch(t, /brand brain/i);
  for (const cmd of ["template", "status", "slice", "build", "check", "gate", "ask", "learn", "migrate", "import", "source", "ads", "reviews", "segments", "creatives", "plan", "voice-check"]) assert.ok(oc.COMMANDS.includes(cmd), cmd);
});

test("missing task foundation blocks readiness without deleting the older context", async () => {
  const oc = await load(bbPath);
  const { ctx } = tmp();
  const f = (p: string, t: string) => { const x = path.join(ctx, "org-context", p); mkdirSync(path.dirname(x), { recursive: true }); writeFileSync(x, t); };
  f("foundation/voice-bank.md", "# Voice bank\n" + Array.from({ length: 40 }, (_, i) => `- "Line ${i}" | site\n`).join("") + "Updated 2026-11-14 by org-context.mjs 3.0.0.\n");
  f("foundation/why-they-buy.md", "# Why\n" + Array.from({ length: 10 }, (_, i) => `- "Customer ${i}" | review\n`).join("") + "Updated 2026-11-14 by x.\n");
  f("foundation/claims.md", "# Claims\n- a\n- b\n- c\n- d\n- e\nUpdated 2026-11-14 by x.\n");
  f("foundation/customers.md", "# Customers\n## One\n## Two\nUpdated 2026-11-14 by x.\n");
  f("foundation/design.md", "# Design\n- a\n- b\n- c\n- d\n- e\nUpdated 2026-11-14 by x.\n");
  assert.equal(oc.gateBrain(ctx, { now, kind: "ads" }).ok, false);
  const c = oc.checkBrain(ctx, { now, kind: "ads" });
  assert.ok(c.gaps.some((g: any) => g.id === "brand-dna") && c.gaps.some((g: any) => g.id === "markets") && c.gaps.some((g: any) => g.id === "customer-talk"));
  assert.equal(c.parts.find((p: any) => p.id === "markets").needed, true);
  assert.equal(oc.checkBrain(ctx, { now, kind: "analysis" }).parts.find((p: any) => p.id === "brand-dna").needed, false, "an analysis needs no brand DNA");
});

test("an older context/brand-file/ folder is still read, with its old file names, and migrate moves it", async () => {
  const oc = await load(bbPath);
  const { ctx } = tmp();
  const old = (p: string, t: string) => { const x = path.join(ctx, "brand-file", p); mkdirSync(path.dirname(x), { recursive: true }); writeFileSync(x, t); };
  old("foundation/messaging.md", "# Messaging\n- Made by hand (site)\nUpdated 2026-11-14 by brand-brain.mjs 2.2.1.\n");
  old("foundation/personas.md", "# Personas\n## Gift buyer\n## Self buyer\nUpdated 2026-11-14 by brand-brain.mjs 2.2.1.\n");
  assert.equal(oc.orgDir(ctx), path.join(ctx, "brand-file"));
  assert.match(oc.moveNote(ctx), /old folder context\/brand-file\/\. It still works\. Move it with: node tools\/org-context\.mjs migrate/);
  const c = oc.checkBrain(ctx, { now, kind: "ads" });
  assert.equal(c.parts.find((p: any) => p.id === "customers").have, 2, "personas.md is read as customers");
  assert.equal(c.parts.find((p: any) => p.id === "claims").have, 1, "messaging.md is read as claims");
  oc.addSource(ctx, "ads", "Meta Ad Library", { status: "public", now });
  assert.ok(existsSync(path.join(ctx, "brand-file", "sources.md")), "one home: writes go to the folder in use, never a second one");
  const out: string[] = [];
  assert.equal(oc.main(["migrate", "--dir", ctx, "--today", "2026-11-14"], (l: string) => out.push(l)), 0);
  assert.match(out.join("\n"), /MOVED:\n- context\/brand-file\/ -> context\/org-context\/\n- foundation\/messaging\.md -> foundation\/claims\.md\n- foundation\/personas\.md -> foundation\/customers\.md/);
  assert.ok(existsSync(path.join(ctx, "org-context", "foundation", "claims.md")) && !existsSync(path.join(ctx, "brand-file")));
  assert.equal(oc.moveNote(ctx), null);
  assert.equal(oc.checkBrain(ctx, { now, kind: "ads" }).parts.find((p: any) => p.id === "customers").have, 2);
});

test("brand-brain.mjs and brand-file.mjs are thin aliases: one renamed line, then the same command and exports", async () => {
  const bb = await load("../../catalogue-items/general/brand-dna-capture/scripts/brand-brain.mjs");
  const bf = await load("../../catalogue-items/general/brand-dna-capture/scripts/brand-file.mjs");
  const oc = await load(bbPath);
  assert.equal(bb.checkBrain, oc.checkBrain);
  assert.equal(bb.PARTS, oc.PARTS, "brand-brain.mjs PARTS are the layer parts");
  assert.equal(bf.PARTS, oc.STORE_PARTS, "brand-file.mjs PARTS are the store parts");
  assert.equal(bf.kindOf("20% off this week"), "offer", "brand-file.mjs kindOf is the fact kind");
  assert.equal(bb.kindOf("homepage").kind, "web_page", "brand-brain.mjs kindOf is the job kind");
  assert.equal(bf.statusOf, oc.statusOf);
  const { ctx } = tmp();
  for (const tool of ["brand-brain.mjs", "brand-file.mjs"]) {
    const r = run(tool, ["gate", "--for", "dashboard", "--dir", ctx]);
    assert.equal(r.status, 0, tool);
    assert.equal(r.stderr.trim(), `renamed: org-context.mjs (${tool} still works and runs it)`);
    assert.match(r.stdout, /^GATE: pass\. analysis is not buyer-facing, so it does not wait on the org context\./);
  }
  const s = run("brand-file.mjs", ["status", "--for", "email", "--dir", ctx]);
  assert.match(s.stdout, /No org context yet at /);
  assert.equal(run("org-context.mjs", ["gate", "--for", "dashboard", "--dir", ctx]).stderr, "", "the new name prints no renamed line");
});

test("index.md lists the sections and links the store memory without copying it", async () => {
  const oc = await load(bbPath);
  const { ctx } = tmp();
  oc.learn(ctx, { job: "spring emails", kept: "short subject lines", now });
  const idx = readFileSync(path.join(ctx, "org-context", "index.md"), "utf8");
  assert.match(idx, /^# Org context: /);
  assert.match(idx, /^- 4\. How we speak to customers \(foundation\/customer-talk\.md\): missing$/m);
  assert.match(idx, /Store numbers and lessons: \.\.\/MEMORY\.md \(the store memory\)\. They are linked here, never copied\./);
});
