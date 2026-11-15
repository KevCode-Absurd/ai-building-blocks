#!/usr/bin/env node
// find-insights.mjs: read an ad-platform export folder and list what an owner usually misses, ranked, each with its number.
// Usage: node tools/find-insights.mjs <export-folder> [--margin 0.35] [--goal sales|leads] [--json out.json] [--md out.md]
// Reads any CSV in the folder (and subfolders insights/, tracking/, ad-library/) that has a spend column and a
// revenue or purchases column. Built for Meta exports (Meta connector or Ads Manager), works on any spend-and-sales table.
// It never guesses: every finding carries its source file and the figures behind it.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
if (!args[0] || args[0] === "--help") {
  console.log("Usage: node find-insights.mjs <export-folder> [--margin 0.35] [--goal sales] [--json out.json] [--md out.md]");
  process.exit(args[0] ? 0 : 1);
}
const root = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const margin = opt("--margin") ? Number(opt("--margin")) : null;
const goal = opt("--goal", "sales");

// ---------- CSV ----------
function parseCSV(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; continue; }
    if (c === '"') q = true; else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [h, ...body] = rows.filter(r => r.length > 1 || r[0]);
  return (body || []).map(r => Object.fromEntries((h || []).map((k, i) => [k.trim(), r[i] ?? ""])));
}
const num = v => { if (v === undefined || v === null || v === "") return 0; const n = Number(String(v).replace(/[%,₹$]/g, "")); return Number.isFinite(n) ? n : 0; };
const pick = (r, keys) => { for (const k of keys) if (k in r && r[k] !== "") return num(r[k]); return 0; };
const SPEND = ["amount_spent", "spend", "Amount spent (INR)", "Amount spent (USD)", "cost", "Cost"];
const REV = ["omni_purchase_values", "purchase_value", "offsite_conversion_fb_pixel_purchase_values", "Purchases conversion value", "conversion_value", "revenue"];
const BUY = ["omni_purchase", "purchases", "offsite_conversion_fb_pixel_purchase", "Purchases", "conversions"];
const METRIC = new Set([...SPEND, ...REV, ...BUY, "impressions", "reach", "frequency", "clicks", "link_click", "ctr", "cpc", "cpm", "landing_page_view",
  "omni_add_to_cart", "omni_initiated_checkout", "purchase_roas", "3_second_video_plays", "id", "name", "cost_per_link_click", "results", "cost_per_result"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!/^(images|videos)$/i.test(e.name)) walk(p, out); }
    else if (/\.csv$/i.test(e.name)) out.push(p);
  }
  return out;
}
const files = walk(root);
const tables = {};
for (const f of files) { try { tables[path.relative(root, f).replace(/\\/g, "/")] = parseCSV(fs.readFileSync(f, "utf8")); } catch { /* unreadable: skip */ } }
const find = re => Object.keys(tables).find(k => re.test(k));
const findings = [];
const add = (f) => findings.push(f);
const fmt = n => Math.abs(n) >= 1e5 ? `${(n / 1e5).toFixed(1)}L` : Math.round(n).toLocaleString("en-IN");
const pct = x => `${(x * 100).toFixed(1)}%`;
const r2 = x => Math.round(x * 100) / 100;

// ---------- Account baseline ----------
let base = null;
const monthly = find(/account_monthly\.csv$/) || find(/account.*\.csv$/);
if (monthly) {
  const rows = tables[monthly];
  const s = rows.reduce((a, r) => a + pick(r, SPEND), 0), v = rows.reduce((a, r) => a + pick(r, REV), 0), p = rows.reduce((a, r) => a + pick(r, BUY), 0);
  if (s > 0) base = { spend: s, rev: v, buys: p, roas: v / s, cpa: p ? s / p : null, aov: p ? v / p : null, src: monthly };
}
const beRoas = margin ? 1 / margin : null;

// ---------- 1. Segments: spend share vs revenue share ----------
function dims(rows) { return Object.keys(rows[0] || {}).filter(k => !METRIC.has(k) && !/^video_|_watched|^omni_|roas|^cost_per/.test(k)); }
for (const [file, rows] of Object.entries(tables)) {
  if (!/breakdown_/.test(file) || /campaign_x/.test(file) || !rows.length) continue;
  const d = dims(rows); if (!d.length) continue;
  const S = rows.reduce((a, r) => a + pick(r, SPEND), 0), V = rows.reduce((a, r) => a + pick(r, REV), 0);
  if (S <= 0 || V <= 0) continue;
  const segs = rows.map(r => ({ key: d.map(k => r[k]).join(" / "), s: pick(r, SPEND), v: pick(r, REV), p: pick(r, BUY) }))
    .filter(x => x.s > 0).map(x => ({ ...x, ss: x.s / S, vs: x.v / S ? x.v / V : 0, roas: x.v / x.s }));
  const acct = V / S;
  for (const x of segs) {
    const ratio = x.ss ? x.vs / x.ss : 0;
    if (x.p >= 15 && x.ss >= 0.03 && ratio >= 1.3)
      add({ kind: "underfunded_segment", score: (ratio - 1) * x.vs * 100, title: `${x.key} is underfunded`,
        evidence: `${pct(x.vs)} of revenue on ${pct(x.ss)} of spend; ROAS ${r2(x.roas)} vs ${r2(acct)} overall; ${Math.round(x.p)} purchases`,
        bet: `Give ${x.key} its own creative and budget; it returns ${r2(x.roas / acct)}x the account average.`, src: file });
    if (x.ss >= 0.05 && ratio <= 0.7)
      add({ kind: "overfunded_segment", score: (1 - ratio) * x.ss * 100, title: `${x.key} takes more than it returns`,
        evidence: `${pct(x.ss)} of spend for ${pct(x.vs)} of revenue; ROAS ${r2(x.roas)} vs ${r2(acct)}${beRoas ? ` (break-even ${r2(beRoas)})` : ""}; ${Math.round(x.p)} purchases`,
        bet: `Cut or exclude ${x.key} in prospecting, or give it a different offer; ${fmt(x.s)} spent at ${r2(x.roas)} ROAS.`, src: file });
  }
}

// ---------- 2. Campaign objective vs the goal ----------
const camps = find(/campaign_totals\.csv$/) || find(/campaigns?\.csv$/);
if (camps && goal === "sales") {
  const rows = tables[camps], S = rows.reduce((a, r) => a + pick(r, SPEND), 0);
  const off = rows.filter(r => r.objective && !/SALES|CONVERSIONS|PRODUCT_CATALOG/i.test(r.objective) && pick(r, SPEND) > 0);
  const offS = off.reduce((a, r) => a + pick(r, SPEND), 0), offV = off.reduce((a, r) => a + pick(r, REV), 0);
  if (S && offS / S >= 0.02) {
    const by = {}; for (const r of off) by[r.objective] = (by[r.objective] || 0) + pick(r, SPEND);
    add({ kind: "objective_mismatch", score: (offS / S) * 100 * 1.5, title: "Money goes to campaigns that don't optimise for purchases",
      evidence: `${pct(offS / S)} of spend (${fmt(offS)}) on ${Object.entries(by).map(([k, v]) => `${k} ${fmt(v)}`).join(", ")}; ROAS ${offS ? r2(offV / offS) : 0}`,
      bet: "For a sales goal, use Sales campaigns optimised for Purchase. Keep reach or engagement only with a stated job (e.g. warming an audience) and a small, capped budget.", src: camps });
  }
  // learning-limited proxy: ad sets/campaigns with too few purchases per week to exit learning
}
const adsets = find(/adset_totals\.csv$/);
if (adsets && base) {
  const rows = tables[adsets].filter(r => pick(r, SPEND) > 0);
  const weeks = 52;
  const thin = rows.filter(r => /OFFSITE_CONVERSIONS|VALUE/i.test(r.optimization_goal || "OFFSITE_CONVERSIONS") && pick(r, BUY) / weeks < 10 && pick(r, SPEND) > base.spend * 0.005);
  if (rows.length >= 10 && thin.length / rows.length >= 0.5) {
    const tS = thin.reduce((a, r) => a + pick(r, SPEND), 0);
    add({ kind: "fragmented_structure", score: (tS / base.spend) * 60, title: "Budget is split across too many ad sets to learn",
      evidence: `${thin.length} of ${rows.length} ad sets with spend got under 10 purchases a week (Meta needs about 50 a week to leave learning); they took ${pct(tS / base.spend)} of spend`,
      bet: "Consolidate into fewer ad sets (broad or Advantage+ audience, one per real offer or market) so each gets enough purchases to optimise.", src: adsets });
  }
}

// ---------- 3. Winners and tired ads ----------
const ads = find(/ad_totals\.csv$/), last90 = find(/ad_last90\.csv$/);
if (ads && base) {
  const rows = tables[ads].filter(r => pick(r, SPEND) > 0);
  const winners = rows.filter(r => pick(r, BUY) >= 10 && pick(r, REV) / pick(r, SPEND) >= base.roas * 1.2)
    .sort((a, b) => pick(b, REV) - pick(a, REV)).slice(0, 5);
  if (winners.length) {
    const paused = winners.filter(r => !/ACTIVE/.test(r.effective_status || r.status || ""));
    add({ kind: "winners", score: 25 + paused.length * 5, title: `${winners.length} proven winners${paused.length ? `, ${paused.length} of them not running now` : ""}`,
      evidence: winners.map(r => `"${r.name}" ROAS ${r2(pick(r, REV) / pick(r, SPEND))}, ${Math.round(pick(r, BUY))} purchases, ${(r.effective_status || r.status || "").toLowerCase()}`).join("; "),
      bet: paused.length ? "Relaunch the paused winners with a fresh hook or format before testing from scratch." : "Use the winners' angle and format as the control for new creatives.", src: ads });
  }
  if (last90) {
    const recent = Object.fromEntries(tables[last90].map(r => [r.id || r.name, r]));
    const tired = rows.filter(r => { const x = recent[r.id || r.name]; if (!x) return false; const all = pick(r, REV) / pick(r, SPEND), now = pick(x, SPEND) ? pick(x, REV) / pick(x, SPEND) : 0; return pick(r, BUY) >= 10 && pick(x, SPEND) > base.spend * 0.003 && now < all * 0.6 && num(x.frequency) >= 2.5; });
    if (tired.length) add({ kind: "fatigue", score: 12 + tired.length * 2, title: `${tired.length} past winners are tiring`,
      evidence: tired.slice(0, 4).map(r => { const x = recent[r.id || r.name]; return `"${r.name}" ROAS ${r2(pick(r, REV) / pick(r, SPEND))} over 12 months, ${r2(pick(x, REV) / pick(x, SPEND))} in the last 90 days at frequency ${r2(num(x.frequency))}`; }).join("; "),
      bet: "Refresh the hook and first frame of these, keep the angle; add new formats so one ad isn't carrying the account.", src: last90 });
  }
  // money with nothing to show
  if (base.cpa) {
    const dead = rows.filter(r => pick(r, BUY) === 0 && pick(r, SPEND) >= base.cpa * 2);
    const dS = dead.reduce((a, r) => a + pick(r, SPEND), 0);
    if (dS / base.spend >= 0.02) add({ kind: "dead_spend", score: (dS / base.spend) * 80, title: "Ads that spent twice a sale's cost with no sale",
      evidence: `${dead.length} ads, ${fmt(dS)} (${pct(dS / base.spend)} of spend), zero purchases; the account's cost per purchase is ${fmt(base.cpa)}`,
      bet: "Set a kill rule: pause an ad at 2 to 3 times your target cost per purchase with no sale.", src: ads });
  }
}

// ---------- 3b. Video: hook rate (3-second plays per impression) and hold rate (ThruPlays per 3-second play) ----------
// Only from a real 3-second-plays column: "video_play_actions" counts autoplay starts, so it would read near 100%.
if (ads) {
  const vids = tables[ads].map(r => ({ r, imp: num(r.impressions), p3: num(r["3_second_video_plays"]), tp: num(r.video_thruplay_watched_actions) }))
    .filter(x => x.imp >= 10000 && x.p3 > 0).map(x => ({ ...x, hook: x.p3 / x.imp, hold: x.tp / x.p3, roas: pick(x.r, SPEND) ? pick(x.r, REV) / pick(x.r, SPEND) : 0 }));
  if (vids.length >= 4) {
    const med = k => { const v = vids.map(x => x[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
    const mh = med("hook"), mo = med("hold");
    const strongHook = vids.filter(x => x.hook >= mh * 1.4).sort((a, b) => b.hook - a.hook).slice(0, 3);
    const leaky = vids.filter(x => x.hook >= mh && x.hold < mo * 0.6).slice(0, 3);
    if (strongHook.length) add({ kind: "video_hooks", score: 11, title: "Video openers that stop the scroll best",
      evidence: strongHook.map(x => `"${x.r.name}" hook rate ${pct(x.hook)} (median ${pct(mh)}), hold ${pct(x.hold)}, ROAS ${r2(x.roas)}`).join("; "),
      bet: "Reuse these first 3 seconds on new bodies; test new openers on the best-selling bodies.", src: ads });
    if (leaky.length) add({ kind: "video_hold", score: 9, title: "Videos that hook but lose people after the opener",
      evidence: leaky.map(x => `"${x.r.name}" hook ${pct(x.hook)}, hold ${pct(x.hold)} (median ${pct(mo)})`).join("; "),
      bet: "Keep the opener, rebuild the middle: show the product and the proof by second 5.", src: ads });
  }
}

// ---------- 4. Placement and funnel breaks ----------
const place = find(/breakdown_placement\.csv$/);
if (place && base) {
  const rows = tables[place].filter(r => pick(r, SPEND) > 0);
  const totLPV = rows.reduce((a, r) => a + num(r.landing_page_view), 0), totClk = rows.reduce((a, r) => a + num(r.link_click), 0);
  for (const r of rows) {
    const clk = num(r.link_click), lpv = num(r.landing_page_view), s = pick(r, SPEND);
    if (clk > 1000 && totClk && lpv / clk < (totLPV / totClk) * 0.6 && s / base.spend >= 0.005)
      add({ kind: "junk_clicks", score: (s / base.spend) * 100 + 5, title: `${r.publisher_platform} ${r.platform_position || ""} clicks don't reach the site`.trim(),
        evidence: `${fmt(clk)} link clicks but ${fmt(lpv)} landing-page views (${pct(lpv / clk)} vs ${pct(totLPV / totClk)} overall); ${Math.round(pick(r, BUY))} purchases on ${fmt(s)}`,
        bet: "Exclude this placement or optimise only for purchases; accidental clicks inflate CTR and teach the algorithm the wrong buyer.", src: place });
  }
}
if (base && monthly) {
  const rows = tables[monthly];
  const lpv = rows.reduce((a, r) => a + num(r.landing_page_view), 0), atc = rows.reduce((a, r) => a + num(r.omni_add_to_cart), 0), ic = rows.reduce((a, r) => a + num(r.omni_initiated_checkout), 0);
  if (lpv && atc && ic) add({ kind: "funnel", score: 10, title: "Where visitors drop on the way to a purchase",
    evidence: `landing-page view to add to cart ${pct(atc / lpv)}; add to cart to checkout ${pct(ic / atc)}; checkout to purchase ${pct(base.buys / ic)} (ad-platform counts)`,
    bet: "The biggest drop is the page or step to fix first; compare with store analytics before acting.", src: monthly });
}

// ---------- 5. Tracking ----------
const statsF = find(/dataset_stats.*\.csv$/);
if (statsF) {
  const rows = tables[statsF];
  const ev = k => rows.filter(r => /purchase/i.test(Object.values(r).join(" "))).reduce((a, r) => a + num(r[k]), 0);
  const cols = Object.keys(rows[0] || {});
  const web = cols.find(c => /web|browser/i.test(c)), srv = cols.find(c => /server/i.test(c));
  if (web && srv) { const w = ev(web), s = ev(srv); if (w && s / w < 0.8) add({ kind: "tracking", score: 15, title: "Server-side purchase events are missing", evidence: `server purchases ${fmt(s)} vs browser ${fmt(w)} in 28 days`, bet: "Set up the Conversions API (or the CAPI Gateway) so purchases blocked in the browser still count.", src: statsF }); }
}
const dq = path.join(root, "tracking", "dataset_quality.json"), dd = path.join(root, "tracking", "dataset_details.json");
try {
  const txt = fs.readFileSync(dq, "utf8");
  const m = txt.match(/"?(?:event_name|name)"?\s*:\s*"Purchase"[\s\S]{0,400}?"?(?:event_match_quality|emq|score|composite_score)"?\s*:\s*\{?[^0-9]*([0-9.]+)/i);
  if (m && Number(m[1]) < 7) add({ kind: "tracking", score: 14, title: "Purchase match quality is low", evidence: `Event Match Quality for Purchase ${m[1]} of 10`, bet: "Send hashed email and phone with each purchase (server side) to lift match quality and the algorithm's learning.", src: "tracking/dataset_quality.json" });
} catch { /* no file */ }
try { const t = fs.readFileSync(dd, "utf8"); if (/NOT_ONBOARDED/.test(t)) add({ kind: "tracking", score: 13, title: "Conversions API Gateway is not set up", evidence: "dataset details: CAPI Gateway NOT_ONBOARDED", bet: "Check whether server events come from another integration; if not, set up CAPI.", src: "tracking/dataset_details.json" }); } catch { /* no file */ }

// ---------- 6. Ad Library: long runners (own and rivals) ----------
for (const [file, rows] of Object.entries(tables)) {
  if (!/ad-library/.test(file) || !rows.length || !("start_date" in rows[0])) continue;
  const today = opt("--today", null) ? new Date(opt("--today")) : new Date(Math.max(...rows.map(r => +new Date(r.start_date)).filter(Number.isFinite)));
  const long = rows.map(r => ({ r, days: Math.round(((r.end_date ? new Date(r.end_date) : today) - new Date(r.start_date)) / 864e5) })).filter(x => x.days >= 30).sort((a, b) => b.days - a.days);
  if (!long.length) continue;
  const who = rows[0].advertiser || path.basename(path.dirname(file));
  const fmts = {}; for (const x of long) fmts[x.r.media_type] = (fmts[x.r.media_type] || 0) + 1;
  add({ kind: /competitors/.test(file) ? "rival_long_runners" : "own_long_runners", score: /competitors/.test(file) ? 9 : 11,
    title: `${who}: ${long.length} ads ran 30+ days (likely winners)`,
    evidence: `${Object.entries(fmts).map(([k, v]) => `${v} ${k}`).join(", ")}; longest: ${long.slice(0, 3).map(x => `"${(x.r.headline || x.r.body || "").replace(/\s+/g, " ").slice(0, 60)}" ${x.days} days`).join("; ")}`,
    bet: /competitors/.test(file) ? "Study what these lead with (offer, proof, format); use the gaps, never copy the words." : "Relaunch or remix these before inventing new angles.", src: file });
}

// ---------- 7. Break-even ----------
if (base && beRoas) {
  add({ kind: "break_even", score: base.roas < beRoas ? 40 : 8, title: base.roas < beRoas ? "The account runs below break-even" : "The account clears break-even",
    evidence: `ROAS ${r2(base.roas)} vs break-even ${r2(beRoas)} at a ${pct(margin)} margin; cost per purchase ${fmt(base.cpa)} vs ${fmt((base.aov || 0) * margin)} gross profit per order`,
    bet: base.roas < beRoas ? "Cut spend below break-even first; growth comes after the account pays for itself." : "Room to scale the segments above break-even.", src: base.src });
}

// Hour of day is weak to act on (dayparting needs lifetime budgets): count it for less.
for (const f of findings) if (/breakdown_hour/.test(f.src)) f.score *= 0.3;
// A one-dimension segment repeats its two-dimension child (35-44 and 35-44 / female): keep the finer one when both point the same way.
const keyOf = f => f.title.replace(/ is underfunded| takes more than it returns/, "");
for (const f of findings) if (/segment/.test(f.kind) && !keyOf(f).includes(" / ")) {
  if (findings.some(g => g !== f && g.kind === f.kind && keyOf(g).includes(" / ") && keyOf(g).split(" / ").includes(keyOf(f)))) f.score *= 0.5;
}
findings.sort((a, b) => b.score - a.score);
const TOP = Number(opt("--top", 15));
const shown = findings.slice(0, TOP), rest = findings.length - shown.length;
const md = [
  "# What the data says (insight finder)", "",
  base ? `Account: spend ${fmt(base.spend)}, revenue ${fmt(base.rev)}, ROAS ${r2(base.roas)}, ${Math.round(base.buys)} purchases, cost per purchase ${base.cpa ? fmt(base.cpa) : "n/a"}, average order ${base.aov ? fmt(base.aov) : "n/a"} (${base.src}).` : "No account totals found.", "",
  "Ranked by likely gain. Each item: what we found, the numbers, and the bet it suggests. Check a finding against store data before acting on it.", "",
  ...shown.map((f, i) => `${i + 1}. **${f.title}.** ${f.evidence}. *Bet:* ${f.bet} _(source: ${f.src})_`),
  rest > 0 ? `
${rest} smaller findings are in the JSON (--json).` : "", findings.length ? "" : "No strong finding: the export lacks spend with revenue or purchases by segment.",
].join("\n");
const out = opt("--md"); if (out) fs.writeFileSync(out, md); else console.log(md);
const j = opt("--json"); if (j) fs.writeFileSync(j, JSON.stringify({ base, margin, findings }, null, 2));
