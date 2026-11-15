// Tags each knowledge card with the situations its advice holds in (stage, model, traffic, price, spend, size: the
// facets in src/modules/knowledge/prepare.ts, Situations), from the card's own words: its claim and "holds when"
// (conditions) say where it fits, its "fails when" says where it does not. Rules only, no model, so the same cards
// always get the same tags, and the script can run again after new cards are merged. It writes one field,
// `situations`, into knowledge/<vertical>/cards/*.json, and leaves every other field and the file layout as they are.
// A card whose words name no situation gets no field: it holds everywhere. Hand-reviewed tags go in
// knowledge/<vertical>/situations-review.json ({ "ADC-0038": { "spend": ["large"] } }, or null to clear) and win
// over the rules.
//
//   node scripts/tag-card-situations.mjs [--vertical=ecommerce] [--dry] [--report] [--card ADC-0038]
//
// --dry writes nothing; --report lists every card's tags with the words that set them.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITUATION_FACETS, amountsIn, bandOf } from "../src/modules/knowledge/prepare.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => { const a = process.argv.find(x => x.startsWith(`--${n}=`)); return a ? a.split("=")[1] : d; };

/** Word rules: [facet, value, pattern]. A pattern names the kind of store, never a tactic. */
const WORDS = [
  ["stage", "prelaunch", /\bpre-?launch\b|\bbefore (?:the |you )?launch\b|\bzero[- ]to[- ]one\b|\bno sales yet\b|\bnot yet launched\b|\bbefore (?:the |your )?first sales?\b|\bvalidat(?:e|ing) (?:a |the )?(?:new )?product idea\b|\bstarting (?:a|the) (?:new )?(?:brand|store)\b/i],
  ["stage", "early", /\bnew (?:brands?|stores?|shops?|ad accounts?|sellers?)\b|\bearly[- ]stage\b|\bsmall (?:stores?|brands?|shops?|accounts?|catalogs?|teams?)\b|\bjust (?:launched|started)\b|\bfirst (?:few )?(?:months?|orders|customers|sales)\b|\blittle (?:data|history|traffic)\b|\bfew (?:orders|sales|purchases|conversions)\b|\bstart-?ups?\b|\bsolo (?:founders?|operators?)\b/i],
  ["stage", "scaling", /\bscal(?:e|ing) (?:brands?|accounts?|stores?|businesses)\b|\bestablished (?:brands?|stores?|accounts?|businesses)\b|\blarge (?:brands?|accounts?|stores?|retailers?|catalogs?|advertisers?)\b|\bbig (?:brands?|accounts?|advertisers?)\b|\bmature (?:brands?|accounts?|stores?)\b|\benterprise\b|\b(?:8|9|eight|nine)[- ]figure\b|\bproven (?:winners?|offers?|products?|hero products?)\b/i],
  ["spend", "large", /\bhigh[- ]spend(?:ing)?\b|\bbig (?:budgets?|spenders?)\b/i],
  ["spend", "small", /\blow[- ]spend(?:ing)?\b|\bsmall (?:budgets?|ad budgets?)\b|\bvery low budgets?\b/i],
  ["model", "subscription", /\bsubscriptions?\b(?! (?:to|for) (?:the |a |our )?(?:newsletter|email|list|sms))|\bsubscribe[- ](?:and|&)[- ]save\b|\brecurring (?:orders?|deliver(?:y|ies)|billing|revenue|charges?)\b|\b(?:recharge|skio)\b|\bcancel(?:led|ed|s|ling)? subscri|\bactive subscribers\b|\bsubscribers? (?:churn|cancel)/i],
  ["model", "cod", /\bCOD\b|\bcash on delivery\b|\bRTO\b|\breturn(?:ed)? to origin\b/i],
  // Selling on a marketplace, not reading its reviews: "Amazon sellers", "sell on Flipkart", "FBA", "TikTok Shop".
  ["model", "marketplace", /\bFBA\b|\bseller central\b|\btiktok shop\b|\bgmv max\b|\bmarketplace sellers?\b|\bsellers? on (?:a |the )?marketplaces?\b|\b(?:a|the) marketplace\b|\bwalmart marketplace\b|\bsell(?:s|ing)? (?:on|through|via) (?:amazon|flipkart|etsy|meesho|marketplaces?)\b|\b(?:amazon|flipkart|etsy|meesho) (?:sellers?|listings?|brands?|stores?|private[- ]label|ppc|ads|sponsored|launch(?:es)?|search|rankings?|buy box|fees)\b|\bprivate[- ]label\b/i],
  ["model", "wholesale", /\bwholesale\b|\bB2B\b(?! SaaS)|\bstockists?\b|\bretail (?:partners?|buyers?|stores? orders)\b|\bdistributors?\b|\bomnichannel\b|\bretail plus online\b/i],
  ["model", "dtc", /\bDTC\b|\bD2C\b|\bdirect[- ]to[- ]consumer\b|\bown (?:site|store|website|online store)\b/i],
  ["traffic", "low", /\blow[- ]traffic\b|\blittle traffic\b|\bfew (?:visitors|sessions)\b|\bsmall (?:audiences?|traffic)\b/i],
  ["traffic", "high", /\bhigh[- ]traffic\b|\bheavy traffic\b|\blarge (?:traffic|audiences?)\b|\bmillions? of (?:visitors|sessions)\b/i],
  ["traffic", "medium", /\benough traffic\b|\bsufficient traffic\b/i],
  ["price", "high", /\bhigh[- ](?:ticket|priced?|aov|order value)\b|\bpremium\b|\bluxury\b|\bexpensive (?:products?|items?)\b|\bconsidered purchases?\b|\bbig[- ]ticket\b/i],
  ["price", "low", /\blow[- ](?:ticket|priced?|aov|order value|price points?)\b|\bcheap (?:products?|items?)\b|\bimpulse (?:buys?|purchases?|products?)\b|\binexpensive (?:products?|items?)\b/i],
];
/** "medium" traffic words mean enough to test: medium or high. */
const WIDEN = { traffic: { medium: ["medium", "high"] } };

/** What a number in the text measures, from the words around it: [facet, scale to the facet's unit]. */
function measureOf(before, after) {
  const b = before.slice(-50), a = after.slice(0, 50);
  const perDay = /^\s*(?:a|per|\/)\s*day\b|^\s*daily\b/i.test(a), perMonth = /^\s*(?:a|per|\/)\s*(?:month|mo)\b|^\s*monthly\b|^\s*(?:\/mo|\/month)\b/i.test(a), perYear = /^\s*(?:a|per|\/)\s*year\b|^\s*(?:annual|yearly)\b|^\s*(?:in )?(?:annual |yearly )?(?:revenue|sales|gmv|arr)\b/i.test(a);
  const ctx = `${b} ${a}`;
  if (/\b(?:aov|order value|price[ds]?|priced|ticket|per (?:unit|item|order)|products? (?:at|around|over|under|above|below|between|from|in the)|sell(?:ing)? (?:at|for)|retail(?:ing)? (?:at|for))\b/i.test(ctx) && !perMonth && !perYear && !perDay) return ["price", 1];
  if (/\b(?:spend|spending|budget|ad accounts?|on (?:meta|facebook|google|tiktok|ads))\b/i.test(ctx) && (perDay || perMonth)) return ["spend", perDay ? 30 : 1];
  if (/\b(?:revenue|sales|turnover|gmv|arr|brands? (?:doing|at|with|over|under|above))\b/i.test(ctx) || perYear) return ["size", perMonth ? 12 : 1];
  return null;
}

/** The bands a bound covers: "over X" from X's band up, "under X" up to X's band, "X to Y" between, "at X" its own band. */
function bandsFor(facet, before, n, n2) {
  const v = SITUATION_FACETS[facet];
  const i = x => v.indexOf(bandOf(facet, x));
  const lo = Math.min(n, n2 ?? n), hi = Math.max(n, n2 ?? n);
  // A bound word rules a range too: "up to about $5k to $10k a day" is at most the top of it.
  if (/\b(?:over|above|more than|at least|exceeding|beyond|upwards of|\+)\s*(?:about|roughly|around|approximately|~)?\s*$/i.test(before.slice(-30))) return v.slice(i(lo * 1.001));
  if (/\b(?:under|below|less than|up to|at most|within|not more than)\s*(?:about|roughly|around|approximately|~)?\s*$/i.test(before.slice(-30))) return v.slice(0, i(hi * 0.999) + 1);
  return v.slice(i(lo), i(hi) + 1);
}

/** Situations a text names: { facet: Set(values) } with the words that set each, for the report. */
export function situationsIn(text) {
  const out = {}, why = [];
  const add = (facet, values, w) => { (out[facet] ??= new Set()); for (const x of values) out[facet].add(x); why.push(`${facet}=${values.join("/")} <${w}>`); };
  const at = {};
  for (const [facet, value, re] of WORDS) { const m = re.exec(text); if (m) { add(facet, WIDEN[facet]?.[value] ?? [value], m[0]); if (facet === "model") at[value] = m.index; } }
  // Several models joined by "or", "and", "including", "alike" mean the card fits each ("an own website or a
  // marketplace"); a model word that qualifies another ("DTC subscription brands") narrows it instead.
  const named = Object.entries(at).sort((a, b) => a[1] - b[1]);
  const inclusive = named.length > 1 && named.slice(1).some(([, i], n) => /\b(?:or|and|alike|including|both|as well as|plus|also)\b|,/i.test(text.slice(named[n][1], i)));
  // Money bounds: "$250k a month on Meta", "above roughly $100 AOV", "between $1M and $5M a year".
  let skipTo = -1;
  for (const a of amountsIn(text)) {
    if (a.index < skipTo) continue;
    // A range ("$20k to $1M a month"): the words after its second number say what both measure.
    const range = /^\s*(?:k|m)?\s*(?:to|-|–|and)\s*(?:about |roughly |around )?(?:A\$|\$|₹|£|€|Rs\.?\s?)?(\d[\d,]*(?:\.\d+)?)\s?(k|K|m|M|million)?\b/.exec(a.after);
    if (range) skipTo = a.end + range[0].length;
    const m = measureOf(a.before, range ? a.after.slice(range[0].length) : a.after);
    if (!m) continue;
    const scale = s => /^k$/i.test(s ?? "") ? 1e3 : /^(m|million)$/i.test(s ?? "") ? 1e6 : 1;
    const second = range ? Number(range[1].replace(/,/g, "")) * scale(range[2]) * a.rate * m[1] : undefined;
    add(m[0], bandsFor(m[0], a.before, a.usd * m[1], second && Number.isFinite(second) ? second : undefined), `${a.before.slice(-20)}|${a.after.slice(0, 20)}`.replace(/\s+/g, " "));
  }
  // Monthly sessions: "above about 300,000 monthly sessions", "under 10,000 visitors a month".
  for (const m of text.matchAll(/(\d[\d,.]*)\s*(k|K|m|M)?\s+(?:monthly\s+|unique\s+)?(?:sessions|visitors|visits)\b/g)) {
    const n = Number(m[1].replace(/,/g, "")) * (/k/i.test(m[2] ?? "") ? 1e3 : /m/i.test(m[2] ?? "") ? 1e6 : 1);
    const before = text.slice(Math.max(0, (m.index ?? 0) - 40), m.index ?? 0);
    if (Number.isFinite(n) && n >= 100) add("traffic", bandsFor("traffic", before, n), m[0]);
  }
  // Sizes said as figures: "a 7-figure brand" is yearly revenue; "six-figure monthly spend" is ad spend.
  for (const m of text.matchAll(/\b(5|6|7|8|9|five|six|seven|eight|nine)[- ]figures?\b(\s+(?:monthly |a month )?(?:ad )?(?:spend|spending|budgets?))?/gi)) {
    const d = { five: 5, six: 6, seven: 7, eight: 8, nine: 9 }[m[1].toLowerCase()] ?? Number(m[1]);
    if (m[2]) add("spend", [d <= 4 ? "small" : d === 5 ? "mid" : "large"], m[0]);
    else add("size", [d <= 6 ? "small" : d === 7 ? "mid" : "large"], m[0]);
  }
  return { found: Object.fromEntries(Object.entries(out).map(([f, s]) => [f, [...s]])), why, inclusive };
}

/** A card's situations: where its claim and conditions say it fits, minus where its "fails when" says it does not. */
export function cardSituations(card) {
  // The conditions say where a card holds; the claim is the advice, and a tactic it names ("add a subscription
  // option") is not the kind of store it is for. A card with no conditions is read from its claim.
  const pos = situationsIn(card.conditions?.trim() ? card.conditions : card.claim);
  if (card.modules?.[0] === "AMZ") { (pos.found.model ??= []).includes("marketplace") || pos.found.model.push("marketplace"); }
  const neg = situationsIn(card.fails_when ?? "");
  const out = {};
  for (const facet of Object.keys(SITUATION_FACETS)) {
    const all = SITUATION_FACETS[facet];
    let fits = pos.found[facet]?.length ? all.filter(v => pos.found[facet].includes(v)) : all;
    // A DTC word that qualifies a narrower model ("DTC subscription brands") adds nothing; joined by "or" it does.
    if (facet === "model" && pos.found.model && fits.length > 1 && fits.includes("dtc") && !pos.inclusive) fits = fits.filter(v => v !== "dtc");
    // A situation the card says it fails in is taken out, unless that would leave nothing (the card contradicts itself).
    // On an ordered facet a low value takes out everything below it too ("fails for small accounts" is no card for a
    // store not yet launched), and a high value everything above it.
    const nofit = new Set();
    for (const v of neg.found[facet] ?? []) {
      const i = all.indexOf(v);
      if (facet === "model") nofit.add(v);
      else all.forEach((x, j) => { if (i <= (all.length - 1) / 2 ? j <= i : j >= i) nofit.add(x); });
    }
    const kept = fits.filter(v => !nofit.has(v));
    if (kept.length && kept.length < all.length) out[facet] = kept;
    else if (!kept.length && fits.length < all.length) out[facet] = fits;
  }
  // Amazon module cards are written for marketplace selling; their Amazon facet already filters them.
  return { situations: out, why: [...pos.why, ...neg.why.map(w => `not ${w}`)] };
}

const sameJson = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const vertical = arg("vertical", "ecommerce");
  const dir = path.join(ROOT, "knowledge", vertical, "cards");
  const reviewFile = path.join(ROOT, "knowledge", vertical, "situations-review.json");
  const review = existsSync(reviewFile) ? JSON.parse(readFileSync(reviewFile, "utf8")) : {};
  const only = process.argv.includes("--card") ? process.argv[process.argv.indexOf("--card") + 1] : null;
  let tagged = 0, changed = 0, total = 0;
  const byFacet = {};
  for (const f of readdirSync(dir).filter(x => x.endsWith(".json")).sort()) {
    const file = path.join(dir, f);
    const before = readFileSync(file, "utf8");
    const cards = JSON.parse(before);
    let dirty = false;
    for (const card of cards) {
      total++;
      const { situations, why } = cardSituations(card);
      const want = Object.prototype.hasOwnProperty.call(review, card.id) ? review[card.id] : situations;
      const has = want && Object.keys(want).length ? want : null;
      if (has) { tagged++; for (const k of Object.keys(has)) byFacet[k] = (byFacet[k] ?? 0) + 1; }
      if (only && card.id === only || process.argv.includes("--report") && has) console.log(`${card.id} ${JSON.stringify(has ?? {})}${why.length ? `  ${why.join("; ")}` : ""}`);
      if (!sameJson(card.situations, has ?? undefined)) {
        changed++; dirty = true;
        if (has) card.situations = has; else delete card.situations;
      }
    }
    // Same layout as the files are written in: two-space JSON with a final newline.
    if (dirty && !process.argv.includes("--dry")) writeFileSync(file, `${JSON.stringify(cards, null, 2)}\n`);
  }
  console.error(`${vertical}: ${tagged} of ${total} cards tagged (${Object.entries(byFacet).map(([k, n]) => `${k} ${n}`).join(", ")}); ${changed} changed${process.argv.includes("--dry") ? " (dry run, nothing written)" : ""}`);
}
