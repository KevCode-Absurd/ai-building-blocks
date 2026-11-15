#!/usr/bin/env node
// consistency-check.mjs: is the work logically consistent? Every piece serves a hypothesis, every hypothesis has evidence,
// the same number says the same thing everywhere, nothing the owner banned appears, every store fact has a source,
// and no working codes or process labels leak to the owner.
// Usage: node tools/quality/consistency-check.mjs <hypotheses.json> <deliverable.md|.html|folder> [more...]
//        A folder is read whole (.html .htm .svg .md .txt .csv .json, not the working files), so the sources
//        behind images and mockups get the same checks as the documents.
//        node tools/quality/consistency-check.mjs template      (prints the hypotheses.json shape)
// hypotheses.json: { "hypotheses": [ { "id": "H1", "title": "...", "gap": "...", "evidence": "...", "source": "...", "bet": "...", "chosen": true } ],
//                    "pieces": [ { "name": "Ad 3", "hypothesis": "H1" } ],   (optional: one per ad, email, section or test)
//                    "never_say": [ "all natural", "sale" ],                 (the owner's banned words; also read from never-say.txt beside it)
//                    "facts": [ { "fact": "Free gift packing on every order", "source": "owner, turn 2" } ] }
// Store facts (cash on delivery, EMI, free shipping, return or exchange terms, buyback, founders, years in business,
// certificates) fail unless a fact of the same kind is in "facts" or in facts.md beside hypotheses.json. "Your figure" or "you told me" fails unless the
// owner gave a fact. Process labels ("Step 2 of 6", "Toolbox used", file names) fail in a deliverable.
import fs from "node:fs";
import path from "node:path";

const TEMPLATE = { hypotheses: [{ id: "H1", title: "Women 35-44 are underfunded", gap: "33% of revenue on 21% of spend", evidence: "ROAS 5.03 vs 3.21 account, 414 purchases", source: "Meta, 12 months, age x gender", bet: "Own ad set and 4 creatives for her", chosen: true }],
  pieces: [{ name: "Ad 1: Notes list", hypothesis: "H1" }],
  never_say: ["all natural", "cheap"],
  facts: [{ fact: "Free gift packing on every order", source: "owner, turn 2" }, { fact: "15-day exchange", source: "site: /pages/returns" }] };
// Store facts an agent is tempted to assume. Each kind needs a matching entry in "facts".
const STORE_FACTS = [
  ["cash on delivery", /\bcash[- ]on[- ]delivery\b|\bCOD\b/],
  ["EMI or pay in parts", /\b(?:no[- ]cost )?EMI\b|\bpay in (?:\d+|three|four) parts\b|\binstal?ments?\b|\blayaway\b/i],
  ["free shipping", /\bfree (?:shipping|delivery)\b/i],
  ["returns or exchange terms", /\b\d+[- ]days? (?:returns?|exchange|refund)|\b(?:lifetime|easy|free) (?:returns?|exchange)\b|\bbuy-?back\b/i],
  ["founders or team", /\bco-?founders?\b|\bour founders?\b|\bfounded by\b/i],
  ["years in business", /\bsince (?:19|20)\d\d\b|\b\d+\+? years (?:of|in) (?:craft|business|trust|experience)\b/i],
  ["offer terms", /₹\s?[\d,]+\s*off\b|\b\d{1,2}\s?%\s*off\b|\bflat\s+(?:₹\s?[\d,]+|\d{1,2}\s?%)|\bmaking[- ]charges?\s+(?:waived|free)\b|\b(?:₹\s?[\d,]+|\d{1,2}\s?%)\s+off\s+(?:on\s+|the\s+)?making/i],
  ["certificates", /\b(?:IGI|GIA|SGL|BIS)[- ](?:certified|certificate|hallmark(?:ed)?)\b|\bcertified (?:diamonds?|gemstones?|stones?)\b/i],
];
const OWNER_SAID = /\b(?:your (?:own )?(?:figure|number)|you told me|you said|as you mentioned|you mentioned)\b/i;
const LABEL_LEAK = /\bStep \d+ of \d+\b|\bToolbox used\b|\btoolbox\.md\b|\bjourney map\b|\bGUIDE\.md\b|\bhypotheses\.json\b|\bnever-say\.txt\b/i;
const norm = t => " " + String(t).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9₹%]+/g, " ").trim() + " ";
const [hp, ...args] = process.argv.slice(2);
const WORKING = /^(hypotheses\.json|never-say\.txt|facts\.md|NOTES\.md|DECISIONS\.md|trace\.md|numbers\.json|spec\.md)$/i;
const walk = p => fs.statSync(p).isDirectory()
  ? fs.readdirSync(p).flatMap(f => (f === "node_modules" || f.startsWith(".")) ? [] : walk(path.join(p, f)))
  : (/\.(html?|svg|md|txt|csv|json)$/i.test(p) && !WORKING.test(path.basename(p)) ? [p] : []);
// Buyer-facing files (ads, mockups, emails, scripts, captions, page copy): a banned single word fails there too.
// Marked with --buyer <path>, or known by a folder or file name such as creatives/, mockups/, copy.md, scripts.html.
const buyerPaths = [], plainArgs = [];
for (let i = 0; i < args.length; i++) if (args[i] === "--buyer") buyerPaths.push(args[++i]); else plainArgs.push(args[i]);
const expand = a => fs.existsSync(a) ? (fs.statSync(a).isDirectory() ? walk(a) : [a]) : [a];
const docs = [...plainArgs, ...buyerPaths].flatMap(expand);
const buyerSet = new Set(buyerPaths.flatMap(expand));
const BUYER_NAME = /(^|[\\/])(creatives?|mockups?|ads|emails?|captions?|scripts?|copy|landing|page-copy)([\\/.-]|$)|(copy|mockup|email|caption|script|ad-copy|upload-sheet)[^\\/]*\.(html?|svg|md|txt|csv|json)$/i;
const isBuyer = d => buyerSet.has(d) || BUYER_NAME.test(d.replace(/^.*?(deliverables|work)[\\/]/, ""));
if (!hp) { console.log("Usage: node consistency-check.mjs <hypotheses.json> <deliverable> [...] | template"); process.exit(1); }
if (hp === "template") { console.log(JSON.stringify(TEMPLATE, null, 2)); process.exit(0); }
const H = JSON.parse(fs.readFileSync(hp, "utf8"));
const hyps = H.hypotheses || [], pieces = H.pieces || [], facts = [...(H.facts || [])];
// context/facts.md beside it counts too: each line is a fact; a line that says "owner" came from the owner.
const factsMd = path.join(path.dirname(hp), "facts.md");
if (fs.existsSync(factsMd)) for (const l of fs.readFileSync(factsMd, "utf8").split(/\r?\n/)) if (l.trim()) facts.push({ fact: l, source: /owner/i.test(l) ? "owner (facts.md)" : "facts.md" });
const nsFile = path.join(path.dirname(hp), "never-say.txt");
const neverSay = [...(H.never_say || []), ...(fs.existsSync(nsFile) ? fs.readFileSync(nsFile, "utf8").split(/\r?\n/) : [])]
  .map(x => x.replace(/^[-*]\s*/, "").replace(/^["“]|["”]$/g, "").trim()).filter(x => x && !x.startsWith("#"));
const res = [];
const fail = (m, fix) => res.push(["FAIL", m, fix]);
const warn = (m, fix) => res.push(["WARN", m, fix]);

// 0. The owner's bans are on record before any buyer words are written (an empty never-say.txt with "# none given" counts).
if (!H.never_say && !fs.existsSync(nsFile)) (docs.some(isBuyer) ? fail : warn)("No banned words on record (never-say.txt or never_say).", "Write context/never-say.txt from the owner's answers and the org context, then check again.");

// 1. Hypotheses are real hypotheses
if (!hyps.length) fail("No hypotheses written.", "Write 2 to 4: gap, evidence, bet.");
for (const h of hyps) {
  const w = `${h.id || "?"} "${h.title || ""}"`;
  if (!h.gap || !h.bet) fail(`${w} is missing its gap or its bet.`, "Every hypothesis says what is wrong and what we will do.");
  if (!h.evidence) fail(`${w} has no evidence.`, "Add the number or the observation it rests on.");
  else if (!/\d/.test(h.evidence) && !h.source) warn(`${w} rests on no number and names no source.`, "Fine when no data exists; then name what it rests on and how to test it.");
}
const ids = new Set(hyps.map(h => h.id));
const chosen = hyps.filter(h => h.chosen !== false);

// 2. Every piece serves a hypothesis, and chosen hypotheses get work
for (const p of pieces) if (!p.hypothesis || !ids.has(p.hypothesis)) fail(`"${p.name}" serves no known hypothesis (${p.hypothesis || "none"}).`, "Tie it to a hypothesis or cut it.");
if (pieces.length) for (const h of chosen) if (!pieces.some(p => p.hypothesis === h.id)) warn(`${h.id} was chosen but no piece acts on it.`, "Make something for it, or mark it not chosen.");

// 3. Deliverables: same label, same number; no leaked codes
const strip = t => t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
const LABELS = ["account ROAS", "overall ROAS", "break-even ROAS", "break even ROAS", "average order", "AOV", "cost per purchase", "CPA", "gross margin", "margin", "conversion rate", "monthly budget", "daily budget"];
const seen = new Map();
for (const d of docs) {
  const t = strip(fs.readFileSync(d, "utf8"));
  if (/\b[A-Z]{3}-\d{4}\b/.test(t)) fail(`${d}: library card id in the deliverable (${t.match(/\b[A-Z]{3}-\d{4}\b/)[0]}).`, "Card ids stay in working notes; name the source in plain words.");
  if (/\[(?:TBD|TODO|INSERT|DATE|NAME|PLACEHOLDER)[^\]]*\]|\{\{\s*(?!campaign\.|adset\.|ad\.)[a-z_.]+\s*\}\}/i.test(t)) fail(`${d}: placeholder or raw template tag.`, "Write the real value.");
  if (/working notes|internal note|note to self|DECISIONS\.md|context\/trace/i.test(t)) fail(`${d}: working notes reached the owner.`, "Remove them.");
  if (LABEL_LEAK.test(t)) fail(`${d}: process label in front of the owner ("${t.match(LABEL_LEAK)[0]}").`, "Say where things stand in plain words; file, tool and stage names stay in your notes.");
  const nt = norm(t);
  // A ban covers its meaning: in buyer files, the key word of a banned claim ("natural" in "all natural") warns on its own.
  const STOP = new Set("a an the all every each our your is are be 100 % one any no never only just very so of in on to for with and or it its this that".split(" "));
  if (isBuyer(d)) for (const p of neverSay) {
    const ws = norm(p).trim().split(" "), key = ws.filter(w => !STOP.has(w));
    if (ws.length > 1 && key.length && !nt.includes(norm(p)) && key.every(k => nt.includes(` ${k} `))) {
      const at = new RegExp(`\\b${key[0]}\\b`, "i").exec(t);
      warn(`${d}: "${key.join(" ")}" may say the banned claim "${p}" in other words${at ? ` (near "${t.slice(Math.max(0, at.index - 30), at.index + 40).trim()}")` : ""}.`, "Keep it only where it is true of that one piece (\"natural ruby\"), never as a claim about the whole brand or range.");
    }
  }
  for (const p of neverSay) if (norm(p).trim() && nt.includes(norm(p))) {
    const words = norm(p).trim().split(" ").map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const at = new RegExp(words.join("[^a-z0-9₹%]+"), "i").exec(t.replace(/[’']/g, ""));
    // A banned claim ("all natural") is wrong anywhere; a banned single word ("sale", "cheap") is for buyer copy,
    // so in a report to the owner it only warns (copy-check.cjs fails it in copy).
    const hard = words.length > 1 || isBuyer(d);
    (hard ? fail : warn)(`${d}: says "${p}", which the owner said never to say${at ? ` (near "${t.replace(/[’']/g, "").slice(Math.max(0, at.index - 30), at.index + 50).trim()}")` : ""}.`, hard ? "Rewrite the line without it, then run this again." : "Fine in a note to the owner; never in anything a buyer sees (mark buyer files with --buyer).");
  }
  for (const [kind, re] of STORE_FACTS) {
    const m = t.match(re);
    if (m && !facts.some(x => re.test(String(x.fact || "")))) fail(`${d}: states a store fact about ${kind} ("${m[0]}") with no source in facts.`, "Add it to facts with its source (owner, a site page, data, org context), or take it out. Never assume store terms.");
  }
  const said = t.match(OWNER_SAID);
  if (said && !facts.some(x => /owner/i.test(String(x.source || "")))) fail(`${d}: credits the owner ("${said[0]}") but no fact comes from the owner.`, "Call a number theirs only if they gave it; otherwise say where it came from.");
  for (const L of LABELS) {
    const re = new RegExp(`${L.replace(/ /g, "[ -]")}\\s*(?:of|is|was|at|:|=|≈|~)?\\s*(?:₹|Rs\\.?|\\$)?\\s*([0-9][0-9,]*\\.?[0-9]*)\\s*(%|x|L|k)?`, "gi");
    let m;
    while ((m = re.exec(t))) {
      const v = Number(m[1].replace(/,/g, "")) * (m[2] === "L" ? 1e5 : m[2] === "k" ? 1e3 : 1);
      if (!Number.isFinite(v) || v === 0) continue;
      const key = L.toLowerCase().replace(/break even/, "break-even").replace(/^aov$/, "average order").replace(/^cpa$/, "cost per purchase").replace(/^overall roas$/, "account roas");
      const arr = seen.get(key) || []; arr.push({ v, d, at: t.slice(Math.max(0, m.index - 40), m.index + 40) }); seen.set(key, arr);
    }
  }
}
for (const [k, arr] of seen) {
  if (["margin", "conversion rate", "daily budget"].includes(k)) continue; // these legitimately vary by item
  const vals = [...new Set(arr.map(x => x.v))];
  const lo = Math.min(...vals), hi = Math.max(...vals);
  if (vals.length > 1 && (hi - lo) / hi > 0.05) warn(`"${k}" appears as ${vals.slice(0, 4).join(", ")} in different places.`, `Use one figure, or say why they differ: "${arr[0].at.trim()}" vs "${arr.find(x => x.v !== arr[0].v).at.trim()}".`);
}
const nF = res.filter(r => r[0] === "FAIL").length;
for (const [l, m, f] of res) console.log(`${l} ${m} Fix: ${f}`);
console.log(`${nF ? "FAIL" : "PASS"}: ${nF} fail, ${res.length - nF} warn; ${hyps.length} hypotheses, ${pieces.length} pieces, ${docs.length} deliverables.`);
process.exit(nF ? 1 : 0);
