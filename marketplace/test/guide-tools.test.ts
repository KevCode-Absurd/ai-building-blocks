// The guide's data tools (ecom-journey, 14 Nov 2026): find-insights reads an ad export into ranked gaps with their
// numbers, preflight-meta stops the classic launch mistakes, consistency-check ties work to hypotheses and evidence.
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const tools = fileURLToPath(new URL("../packs/shared/tools/", import.meta.url));
const run = (tool: string, args: string[]) => spawnSync(process.execPath, [path.join(tools, tool), ...args], { encoding: "utf8" });
const tmp = () => mkdtempSync(path.join(tmpdir(), "guide-tools-"));

test("find-insights ranks an underfunded segment, a money-losing one and paused winners, each with its numbers", () => {
  const d = tmp(); mkdirSync(path.join(d, "insights"));
  const H = "amount_spent,landing_page_view,omni_add_to_cart,omni_initiated_checkout,omni_purchase,omni_purchase_values,link_click";
  writeFileSync(path.join(d, "insights", "account_monthly.csv"), `month,${H}\n2026-01,100000,20000,400,100,40,320000,50000\n`);
  writeFileSync(path.join(d, "insights", "breakdown_age.csv"), `age,${H}\n25-34,50000,,,,10,60000,\n35-44,20000,,,,20,180000,\n45-54,30000,,,,10,80000,\n`);
  writeFileSync(path.join(d, "insights", "ad_totals.csv"), `name,id,effective_status,${H}\nWinner A,1,CAMPAIGN_PAUSED,10000,,,,15,90000,\nLoser,2,ACTIVE,8000,,,,0,0,\n`);
  const r = run("find-insights.mjs", [d, "--margin", "0.4"]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /35-44 is underfunded\.\*\* 56\.3% of revenue on 20\.0% of spend/);
  assert.match(r.stdout, /25-34 takes more than it returns/);
  assert.match(r.stdout, /not running now/);
  assert.match(r.stdout, /break-even 2\.5/);
});

test("preflight-meta fails a traffic campaign, link-click optimisation and a live status for a sales goal", () => {
  const d = tmp(), f = path.join(d, "plan.json");
  const tpl = JSON.parse(run("preflight-meta.mjs", ["template"]).stdout);
  assert.equal(run("preflight-meta.mjs", [(writeFileSync(f, JSON.stringify(tpl)), f)]).status, 0, "the template passes");
  tpl.campaigns[0].objective = "OUTCOME_TRAFFIC"; tpl.campaigns[0].status = "ACTIVE"; tpl.campaigns[0].adsets[0].optimization_goal = "LINK_CLICKS";
  writeFileSync(f, JSON.stringify(tpl));
  const r = run("preflight-meta.mjs", [f]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL .*OUTCOME_TRAFFIC cannot optimise for purchases/);
  assert.match(r.stdout, /FAIL .*Optimises for LINK_CLICKS/);
  assert.match(r.stdout, /FAIL .*built paused/);
});

test("consistency-check fails work that serves no hypothesis, leaks a card id or ships a placeholder", () => {
  const d = tmp(), h = path.join(d, "h.json"), doc = path.join(d, "out.md");
  writeFileSync(h, JSON.stringify({ hypotheses: [{ id: "H1", title: "t", gap: "g", evidence: "ROAS 5 vs 3", bet: "b" }], pieces: [{ name: "Ad 1", hypothesis: "H1" }, { name: "Ad 2" }] }));
  writeFileSync(doc, "Account ROAS 3.2. Later: account ROAS 2.1. See CRO-0001. Launch on [DATE].\n");
  const r = run("quality/consistency-check.mjs", [h, doc]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /"Ad 2" serves no known hypothesis/);
  assert.match(r.stdout, /library card id/);
  assert.match(r.stdout, /placeholder/);
  assert.match(r.stdout, /"account roas" appears as 3\.2, 2\.1/);
});

// 14 Nov 2026, after the blind test: the owner's bans, unsourced store facts and process labels must never reach the owner.
test("consistency-check fails a banned claim, an assumed store fact, a false 'your figure' and a stage label", () => {
  const d = tmp(), h = path.join(d, "hypotheses.json"), doc = path.join(d, "plan.html");
  writeFileSync(h, JSON.stringify({ hypotheses: [{ id: "H1", gap: "g", evidence: "ROAS 5 vs 3", bet: "b" }], never_say: ["sale"] }));
  writeFileSync(path.join(d, "never-say.txt"), "# from the owner, turn 2\nall natural\n");
  writeFileSync(doc, "<p>Step 2 of 6: Gather.</p><h2>All nine stones. All natural.</h2><p>Pay by cash on delivery. Your figure of 31,500. Free gift packing. One sale a day.</p>");
  const r = run("quality/consistency-check.mjs", [h, doc]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL .*says "all natural"/);
  assert.match(r.stdout, /WARN .*says "sale"/, "a banned single word only warns in a report to the owner");
  assert.match(r.stdout, /FAIL .*store fact about cash on delivery/);
  assert.match(r.stdout, /FAIL .*credits the owner \("Your figure"\)/);
  assert.match(r.stdout, /FAIL .*process label .*Step 2 of 6/);
  writeFileSync(path.join(d, "facts.md"), "- Cash on delivery on orders under ₹50,000. Source: site /pages/shipping\n- Margin 31,500 a typical order. Source: owner, turn 2\n");
  writeFileSync(doc, "<h2>All nine stones, each one hallmarked gold.</h2><p>Cash on delivery available. Your figure of 31,500.</p>");
  const ok = run("quality/consistency-check.mjs", [h, doc]);
  assert.equal(ok.status, 0, ok.stdout);
});

test("copy-check fails any line with a phrase the owner banned", () => {
  const d = tmp(), doc = path.join(d, "copy.md");
  writeFileSync(doc, "## Ad 2\n**Headline:** All nine stones. All natural.\n");
  const r = run("quality/copy-check.cjs", [doc, "--never", "all natural"]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /says "all natural", which the owner said never to say/);
});

// 15 Nov 2026, rerun judges: a banned word baked into a mockup, an offer amount nobody set, a 12-card carousel.
test("consistency-check reads a folder, fails a banned word in a mockup source and an unsourced offer amount", () => {
  const d = tmp(), h = path.join(d, "hypotheses.json"), out = path.join(d, "deliverables"), mock = path.join(d, "mockups");
  mkdirSync(out); mkdirSync(mock);
  writeFileSync(h, JSON.stringify({ hypotheses: [{ id: "H1", gap: "g", evidence: "1 of 3", bet: "b" }], never_say: ["sale"] }));
  writeFileSync(path.join(out, "plan.md"), "Pongal ad: ₹1,500 off making charges. One sale a day so far.\n");
  writeFileSync(path.join(mock, "checkout.html"), "<button>Get sale previews</button>");
  const r = run("quality/consistency-check.mjs", [h, out, "--buyer", mock]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL .*checkout\.html: says "sale"/);
  assert.match(r.stdout, /WARN .*plan\.md: says "sale"/);
  assert.match(r.stdout, /FAIL .*store fact about offer terms/);
});

test("preflight-meta fails a carousel over 10 cards", () => {
  const d = tmp(), f = path.join(d, "plan.json");
  const tpl = JSON.parse(run("preflight-meta.mjs", ["template"]).stdout);
  Object.assign(tpl.campaigns[0].adsets[0].ads[0], { format: "carousel", cards: 12 });
  writeFileSync(f, JSON.stringify(tpl));
  const r = run("preflight-meta.mjs", [f]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL .*Carousel with 12 cards/);
});

// 15 Nov 2026, round 3: the first message got heavy, and a banned claim came back in other words.
test("ask-check fails a question that asks three things and a 300-word ask, and passes a light one", () => {
  const d = tmp(), heavy = path.join(d, "heavy.md"), light = path.join(d, "light.md");
  writeFileSync(heavy, "I've read your account.\n\n1. **Which claim is right?** a) site's (my default) b) ads'\n   Also, any word you never use? And is there an offer?\n\n" + "More context here. ".repeat(110));
  const r = run("quality/ask-check.mjs", [heavy]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /Question 1 asks 3 things/);
  assert.match(r.stdout, /runs \d+ words/);
  writeFileSync(light, "I've read your last 12 months of ads. Three quick questions, then I'll make the 10.\n\n1. **What should the 10 be for?** a) A mix (my pick) b) Evergreen c) Wedding season\n2. **Any words or claims you never use?** Default: none beyond your site's.\n3. **Photos: your site's, or a Drive folder?** a) Site (my default) b) Drive\n\nI'll assume no discount and reviews quoted with first names only.\n");
  const ok = run("quality/ask-check.mjs", [light]);
  assert.equal(ok.status, 0, ok.stdout);
});

test("consistency-check warns when a buyer file says a banned claim in other words", () => {
  const d = tmp(), h = path.join(d, "hypotheses.json"), ads = path.join(d, "ad-copy.md");
  writeFileSync(h, JSON.stringify({ hypotheses: [{ id: "H1", gap: "g", evidence: "1 of 3", bet: "b" }], never_say: ["all natural"] }));
  writeFileSync(ads, "**Headline:** Natural Gemstones, set in 18K gold\n");
  const r = run("quality/consistency-check.mjs", [h, "--buyer", ads]);
  assert.match(r.stdout, /WARN .*"natural" may say the banned claim "all natural"/);
});
