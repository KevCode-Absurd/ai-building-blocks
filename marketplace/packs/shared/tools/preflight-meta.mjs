#!/usr/bin/env node
// preflight-meta.mjs: check a Meta campaign plan the way a senior media buyer would, before anything goes live.
// Usage: node tools/preflight-meta.mjs <plan.json>      (template: node tools/preflight-meta.mjs template)
// Exit code 1 when any FAIL. Never calls Meta: it checks the plan file only.
import fs from "node:fs";

const TEMPLATE = {
  goal: "sales", currency: "INR", target_cpa: 9000, aov: 30000, margin: 0.35, monthly_budget: 1000000,
  pixel: { id: "123", events: ["ViewContent", "AddToCart", "InitiateCheckout", "Purchase"], capi: true },
  campaigns: [{
    name: "PROS | Sales | Broad | IN", objective: "OUTCOME_SALES", budget_level: "campaign", daily_budget: 25000,
    bid_strategy: "LOWEST_COST", attribution: "7d_click_1d_view", role: "prospecting",
    adsets: [{
      name: "PROS | Broad W 30-65 | Adv+ placements", optimization_goal: "OFFSITE_CONVERSIONS", conversion_event: "PURCHASE",
      audience: { type: "broad", exclusions: ["purchasers 180d"], notes: "" }, placements: "advantage_plus", daily_budget: null,
      ads: [{ name: "H1 | Notes list | 35-44 W", format: "image", hypothesis: "H1", url: "https://example.com/p?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}", primary_text: "...", headline: "...", cta: "SHOP_NOW" }],
    }],
  }],
};
const arg = process.argv[2];
if (!arg) { console.log("Usage: node preflight-meta.mjs <plan.json> | template"); process.exit(1); }
if (arg === "template") { console.log(JSON.stringify(TEMPLATE, null, 2)); process.exit(0); }
const plan = JSON.parse(fs.readFileSync(arg, "utf8"));
const out = [];
const fail = (where, msg, fix) => out.push({ level: "FAIL", where, msg, fix });
const warn = (where, msg, fix) => out.push({ level: "WARN", where, msg, fix });
const ok = (where, msg) => out.push({ level: "OK", where, msg });

const goal = (plan.goal || "sales").toLowerCase();
const purchaseGoal = /sale|purchase|revenue|roas/.test(goal);
const cpa = plan.target_cpa || (plan.aov && plan.margin ? plan.aov * plan.margin : null);
const camps = plan.campaigns || [];
if (!camps.length) fail("plan", "No campaigns in the plan.", "Add at least one campaign.");

// Tracking
const ev = (plan.pixel?.events || []).map(e => String(e).toLowerCase());
if (purchaseGoal) {
  if (!plan.pixel) fail("tracking", "No pixel or dataset named.", "Name the pixel or dataset the ads optimise on.");
  else if (!ev.includes("purchase")) fail("tracking", "The pixel has no Purchase event.", "Fire Purchase with value and currency before optimising for sales.");
  else ok("tracking", "Pixel with a Purchase event.");
  if (plan.pixel && plan.pixel.capi === false) warn("tracking", "No Conversions API: browser-blocked purchases are lost.", "Set up CAPI or the CAPI Gateway, with event_id for de-duplication.");
}

if (plan.target_cpa && plan.aov && plan.margin) {
  const gp = plan.aov * plan.margin;
  if (plan.target_cpa > gp) fail("economics", `Target cost per purchase ${plan.target_cpa} is above gross profit per order ${Math.round(gp)}: every sale loses money on the first order.`, "Lower the target, or state the repeat-order value that pays it back.");
  else ok("economics", `Target cost per purchase ${plan.target_cpa} is within gross profit per order ${Math.round(gp)}.`);
}
const attrs = new Set(camps.map(c => c.attribution).filter(Boolean));
if (attrs.size > 1) warn("attribution", `Campaigns use different attribution settings (${[...attrs].join(", ")}): results can't be compared.`, "Use one setting across the account.");
let total = 0;
const names = new Set();
for (const c of camps) {
  const w = `campaign "${c.name}"`;
  if (c.status && !/PAUSED/i.test(c.status)) fail(w, `Status ${c.status}: a plan must be built paused and go live only on the owner's yes.`, "Set status PAUSED.");
  if (names.has(c.name)) warn(w, "Duplicate campaign name.", "Use a naming pattern: ROLE | objective | audience | market."); names.add(c.name);
  const obj = String(c.objective || "").toUpperCase();
  if (purchaseGoal && !/OUTCOME_SALES|CONVERSIONS|PRODUCT_CATALOG_SALES/.test(obj)) {
    if (c.purpose) warn(w, `Objective ${obj || "missing"} for a sales goal, with a stated purpose: ${c.purpose}.`, "Cap its budget (under 10%) and judge it on its own job, not ROAS.");
    else fail(w, `Objective ${obj || "missing"} cannot optimise for purchases. A clicks, traffic, reach or engagement campaign buys the cheapest clickers, not buyers.`, "Use OUTCOME_SALES optimised for Purchase.");
  } else if (obj) ok(w, `Objective ${obj}.`);
  if (c.attribution && /1d_click$|^1d_click/.test(c.attribution) && (plan.aov || 0) > 5000) warn(w, "1-day-click attribution on a considered purchase undercounts sales.", "Use 7-day click, 1-day view (the default) unless you have a reason.");
  const sets = c.adsets || [];
  if (!sets.length) fail(w, "No ad sets.", "Add ad sets.");
  const cbo = c.budget_level === "campaign" || c.daily_budget;
  const campDaily = c.daily_budget || sets.reduce((a, s) => a + (s.daily_budget || 0), 0);
  total += campDaily;
  if (sets.length > 6 && cbo) warn(w, `${sets.length} ad sets under one campaign budget split the learning.`, "Keep 2 to 5 ad sets per campaign, or use one broad Advantage+ ad set.");
  const roles = new Set(sets.map(s => s.role || c.role || (s.audience?.type === "retargeting" ? "retargeting" : "prospecting")));
  if (roles.has("retargeting") && roles.has("prospecting")) warn(w, "Prospecting and retargeting share one campaign budget; the budget drifts to the cheap warm audience.", "Split them, or let Advantage+ Sales handle both with an existing-customer cap.");
  for (const s of sets) {
    const sw = `ad set "${s.name}"`;
    const og = String(s.optimization_goal || "").toUpperCase();
    if (purchaseGoal) {
      if (/LINK_CLICKS|LANDING_PAGE_VIEWS|IMPRESSIONS|REACH|POST_ENGAGEMENT|THRUPLAY/.test(og)) fail(sw, `Optimises for ${og}, not purchases.`, "Optimise for OFFSITE_CONVERSIONS with the Purchase event (or VALUE).");
      else if (og && !/OFFSITE_CONVERSIONS|VALUE|CONVERSIONS/.test(og)) warn(sw, `Unusual optimisation goal ${og}.`, "Check it optimises for purchases.");
      if (s.conversion_event && !/PURCHASE/i.test(s.conversion_event)) {
        if (/ADD_TO_CART|INITIATE/i.test(s.conversion_event)) warn(sw, `Optimises for ${s.conversion_event}: more volume, weaker buyers.`, "Use only while Purchase volume is too low (under about 10 a week), and plan the switch.");
        else fail(sw, `Conversion event ${s.conversion_event} is not a purchase.`, "Use PURCHASE.");
      }
    }
    const daily = s.daily_budget || (s.budget_share ? campDaily * s.budget_share : (cbo ? campDaily / sets.length : 0));
    if (cpa && daily) {
      const perWeek = (daily * 7) / cpa;
      const testing = /test/i.test(s.role || c.role || "");
      if (perWeek < 10 && testing) warn(sw, `Testing lane at about ${perWeek.toFixed(1)} purchases a week: read tests on cost per purchase and spend at 1.5x to 3x target CPA per concept, not on ROAS.`, "Keep the testing lane at 10 to 20% of budget.");
      else if (perWeek < 10) fail(sw, `About ${perWeek.toFixed(1)} purchases a week at a ${Math.round(cpa)} cost per purchase: it will stay in learning (Meta needs about 50 a week).`, "Merge ad sets or raise this budget; fewer, better-funded ad sets learn faster.");
      else if (perWeek < 50) warn(sw, `About ${Math.round(perWeek)} purchases a week; under the ~50 Meta needs to leave learning.`, "Fine for a test; consolidate when you scale.");
      else ok(sw, `About ${Math.round(perWeek)} purchases a week: enough to learn.`);
    }
    const aud = s.audience || {};
    const role = s.role || c.role || (aud.type === "retargeting" ? "retargeting" : "prospecting");
    if (role === "prospecting" && !(aud.exclusions || []).some(x => /purchas|customer|buyer/i.test(x)) && !/advantage/i.test(aud.type || ""))
      warn(sw, "Prospecting with no past-buyer exclusion: you pay to reach people who already bought.", "Exclude purchasers (e.g. 180 days) or use the existing-customer budget cap.");
    if (aud.type === "interest" && (aud.interests || []).length > 0 && (aud.size || 0) && aud.size < 500000) warn(sw, "Small interest audience; it will saturate and costs rise.", "Go broader; let the creative pick the buyer.");
    if (s.placements && s.placements !== "advantage_plus" && Array.isArray(s.placements) && s.placements.some(p => /audience_network|instream/i.test(p))) warn(sw, "Audience Network or in-stream placements often bring accidental clicks.", "Check landing-page views per click before keeping them.");
    const ads = s.ads || [];
    if (!ads.length) fail(sw, "No ads.", "Add 3 to 6 ads with different formats and angles.");
    else {
      if (ads.length < 3) warn(sw, `Only ${ads.length} ad(s): too little for the system to choose from.`, "Give each ad set 3 to 6 genuinely different ads.");
      const formats = new Set(ads.map(a => a.format)); if (ads.length >= 3 && formats.size < 2) warn(sw, "Every ad is the same format.", "Mix formats (static, video, carousel); Meta treats near-identical ads as one.");
      for (const a of ads) {
        const aw = `ad "${a.name}"`;
        if (!a.url) fail(aw, "No landing URL.", "Add the product or collection URL.");
        else if (!/utm_/.test(a.url)) warn(aw, "No UTM tags: you can't see this ad's sales in your store analytics.", "Add utm_source, utm_medium and utm_campaign.");
        if (a.url && /utm_/.test(a.url) && !/utm_content/.test(a.url)) warn(aw, "No utm_content: you can't tell this ad from its siblings in store analytics.", "Add utm_content with the ad name or id.");
        if (/carousel/i.test(a.format || "")) {
          const n = Array.isArray(a.cards) ? a.cards.length : Number(a.cards);
          if (!n) warn(aw, "Carousel with no card count.", "Give cards: 2 to 10.");
          else if (n > 10 || n < 2) fail(aw, `Carousel with ${n} cards; Meta allows 2 to 10.`, "Cut or split it into two ads.");
        }
        if (!a.hypothesis) warn(aw, "No hypothesis: the ad doesn't say what it tests.", "Name the hypothesis it serves (H1, H2...).");
        if (a.primary_text && a.primary_text.length > 125) warn(aw, `Primary text ${a.primary_text.length} characters; only about 125 show before "more".`, "Put the hook in the first 125 characters.");
        if (a.headline && a.headline.length > 40) warn(aw, `Headline ${a.headline.length} characters; over 40 gets cut on mobile.`, "Shorten to 40 or fewer.");
        if (/\[[^\]]+\]|\{\{(?!\s*(campaign|adset|ad)\.)/.test(`${a.primary_text || ""} ${a.headline || ""}`)) fail(aw, "Placeholder or template tag in the copy.", "Write the real words.");
      }
    }
  }
}
if (plan.monthly_budget && total) {
  const m = total * 30.4;
  if (Math.abs(m - plan.monthly_budget) / plan.monthly_budget > 0.15) warn("budget", `Daily budgets add to about ${Math.round(m)} a month, vs the ${plan.monthly_budget} budget.`, "Make the daily budgets add up to the monthly budget.");
  else ok("budget", "Daily budgets match the monthly budget.");
}
const nF = out.filter(x => x.level === "FAIL").length, nW = out.filter(x => x.level === "WARN").length;
for (const x of out) console.log(`${x.level.padEnd(4)} ${x.where}: ${x.msg}${x.fix ? ` Fix: ${x.fix}` : ""}`);
console.log(`\n${nF ? "FAIL" : "PASS"}: ${nF} fail, ${nW} warn.`);
process.exit(nF ? 1 : 0);
