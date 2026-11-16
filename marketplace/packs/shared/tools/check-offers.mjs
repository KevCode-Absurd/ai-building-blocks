#!/usr/bin/env node
// check-offers.mjs: finds every offer in customer-facing copy, works out its effective discount, and fails any offer
// past the owner's limit. Run it on the ads, emails or pages before hand-over.
//
//   node tools/check-offers.mjs --limit 15 deliverables/ad-copy.csv deliverables/emails
//   node tools/check-offers.mjs --limit unknown deliverables/      (the owner has not given a limit yet)
//
// Effective discount: "Buy 2 Get 1 Free" (or "Buy 2, Get 3rd Free") is 1 free in 3, so 33% off; buy one get one is
// 50%; "20% off" and "up to 33% off" are their figures; "₹100 off on ₹999" is 10%; "a free serum worth ₹249 over
// ₹799" is 31%. A free gift with no stated worth is noted, so you work out its cost against the order it needs.
// FAIL (exit 1): an offer past --limit; with --limit unknown, any deep offer (over 20% effective). A deep offer
//   belongs in the plan as an option that needs the owner's yes, not in any ad or email, until they give a limit.
// WARN: a free gift with no worth stated; no --limit given (ask the owner the most money off they allow).
// Reads .csv, .md, .txt, .json and .html (visible text) files, and folders of them. Plain Node, no packages.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const DEEP = 20;
const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, a: 1, an: 1 };
const ORD = { "2nd": 2, second: 2, "3rd": 3, third: 3, "4th": 4, fourth: 4, "5th": 5, fifth: 5 };
const n = s => (s == null ? NaN : NUM[String(s).toLowerCase()] ?? Number(String(s).replace(/,/g, "")));
const money = "(?:₹|rs\\.?|inr|\\$|£|€)\\s?([\\d,]+(?:\\.\\d+)?)";

// Every offer in a piece of text, each with its effective discount in percent (null when it cannot be worked out).
export function findOffers(text) {
  const t = String(text || "").replace(/\s+/g, " ");
  const found = [];
  const add = (m, pct, kind) => found.push({ text: m.trim(), pct: pct == null ? null : Math.round(pct), kind });
  let m;
  // Buy N get M free / Buy N get the (N+1)th free / BOGO.
  const bng = /\bbuy\s+(\d+|one|two|three|four|five|an?)\b[\s,&+-]*(?:and\s+)?get\s+(?:the\s+)?(?:(\d+|one|two|three|a|an)\s+(?:more\s+)?(?:free|at\s+no\s+cost)|(\d+(?:st|nd|rd|th)|second|third|fourth|fifth)\s+(?:\w+\s+)?free)/gi;
  while ((m = bng.exec(t))) {
    const buy = n(m[1]);
    let free = n(m[2]);
    if (m[3]) free = (ORD[m[3].toLowerCase()] ?? parseInt(m[3], 10)) - buy;
    if (buy > 0 && free > 0) add(m[0], (100 * free) / (buy + free), "buy-get-free");
  }
  for (const re of [/\bbogo\b/gi, /\bbuy\s+1\s*get\s*1\b/gi, /\b(?:buy\s+one,?\s+get\s+one)\b(?!\s+(?:\d+|half)\s*%)/gi])
    while ((m = re.exec(t))) if (!found.some(f => f.text.toLowerCase().includes(m[0].toLowerCase()))) add(m[0], 50, "buy-get-free");
  // Percent off.
  const pct = /\b(?:(?:up\s*to|upto|flat|extra|save|get)\s+)?(\d{1,2}(?:\.\d+)?)\s?%\s?(?:off|discount)\b|\b(?:save|discount of)\s+(\d{1,2}(?:\.\d+)?)\s?%/gi;
  while ((m = pct.exec(t))) add(m[0], Number(m[1] ?? m[2]), "percent-off");
  // Money off on a minimum order.
  const MIN = `(?:on|over|above|with|for)\\b[^.;|₹$£€]{0,25}?${money}`;
  const off = new RegExp(`${money}\\s?off\\b(?:[^.;|₹$£€]{0,12}?${MIN})?`, "gi");
  while ((m = off.exec(t))) {
    const amt = n(m[1]), min = n(m[2]);
    add(m[0], min > 0 ? (100 * amt) / min : null, "money-off");
  }
  // A free item, with its worth and the order it needs when given.
  const gift = new RegExp(`\\bfree\\s+(?!shipping|delivery|returns?|samples? of|consultation)([a-z0-9][\\w\\s-]{0,40}?)(?:\\s*\\(?\\s*worth\\s+${money}\\)?)?[^.;|₹$£€]{0,20}?${MIN}`, "gi");
  while ((m = gift.exec(t))) {
    if (found.some(f => f.text.toLowerCase().includes(m[0].toLowerCase()) || m[0].toLowerCase().includes(f.text.toLowerCase()))) continue;
    const w = new RegExp(`worth\\s+${money}`, "i").exec(m[0]);
    const worth = n(m[2] ?? w?.[1]), min = n(m[3]);
    add(m[0], worth > 0 && min > 0 ? (100 * worth) / min : null, "gift");
  }
  return found;
}

const isHtml = f => /\.html?$/i.test(f);
const visible = raw => raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8377;/g, "₹");
const files = p => {
  const st = fs.statSync(p);
  if (!st.isDirectory()) return [p];
  return fs.readdirSync(p).flatMap(x => files(path.join(p, x)));
};

// Judge offers against a limit: a number (percent), or null when the owner has not given one.
export function judgeOffers(offers, limit) {
  const out = [];
  for (const o of offers) {
    if (o.pct == null) {
      const what = o.kind === "gift" ? "the gift's worth or the order it needs is" : "the order it needs is";
      out.push({ level: "WARN", o, msg: `"${o.text}": ${what} not stated, so its effective discount is unknown.`, fix: "Work out what it costs against the order it needs, and keep it within the owner's limit." });
      continue;
    }
    if (limit != null && o.pct > limit) out.push({ level: "FAIL", o, msg: `"${o.text}" is ${o.pct}% off in effect, past the owner's ${limit}% limit.`, fix: "Take it out of the copy; offer it in the plan as an option that needs their yes." });
    else if (limit == null && o.pct > DEEP) out.push({ level: "FAIL", o, msg: `"${o.text}" is ${o.pct}% off in effect: a deep offer while the owner's limit is unknown.`, fix: "Keep it out of the copy until they give a limit; put it in the plan as an option that needs their yes, and ask the most money off they allow." });
    else out.push({ level: "OK", o, msg: `"${o.text}" is ${o.pct}% off in effect${limit != null ? `, within ${limit}%` : ""}.` });
  }
  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const li = args.indexOf("--limit");
  const rawLimit = li >= 0 ? args[li + 1] : undefined;
  const targets = args.filter((a, i) => !a.startsWith("--") && !(li >= 0 && i === li + 1));
  if (!targets.length) { console.log("Usage: node tools/check-offers.mjs --limit <percent|unknown> <file|folder>..."); process.exit(2); }
  if (li >= 0 && (!rawLimit || (rawLimit !== "unknown" && !Number.isFinite(Number(rawLimit))))) { console.error("--limit needs a percent or the word unknown."); process.exit(2); }
  const limit = rawLimit == null || rawLimit === "unknown" ? null : Number(rawLimit);
  const res = [];
  if (li < 0) res.push({ level: "WARN", msg: "No --limit given: judged as if the owner's limit were unknown.", fix: "Ask the most money off they allow, then pass --limit <percent>." });
  for (const t of targets) for (const f of files(t).filter(f => /\.(csv|md|txt|json|html?)$/i.test(f))) {
    const raw = fs.readFileSync(f, "utf8");
    for (const r of judgeOffers(findOffers(isHtml(f) ? visible(raw) : raw), limit)) res.push({ ...r, msg: `${path.basename(f)}: ${r.msg}` });
  }
  const nF = res.filter(r => r.level === "FAIL").length, nW = res.filter(r => r.level === "WARN").length;
  for (const r of res.filter(r => r.level !== "OK")) console.log(`${r.level} ${r.msg}${r.fix ? ` Fix: ${r.fix}` : ""}`);
  console.log(`${nF ? "FAIL" : "PASS"}: ${res.filter(r => r.o).length} offer(s) found, ${nF} fail, ${nW} warn (limit ${limit ?? "unknown"}).`);
  process.exit(nF ? 1 : 0);
}
