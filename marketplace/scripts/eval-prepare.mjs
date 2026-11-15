// Scores job preparation (src/modules/knowledge/prepare.ts) on the brief-level golden set
// (test/fixtures/<vertical>-jobs-golden.json: whole job briefs labelled with the cards an expert wants, written
// independently of the retrieval code). Compares ways to get cards for a brief:
//   one-query: the whole brief as one ask-knowledge query (what an agent does when it asks once);
//   two-query: the first request sentence and the first data signal, the typical agent in round 2;
//   prepare:   the tool's own best k (query plan, fact filters, rerank, diversity), what an agent reads if it skips
//              the grading step;
//   shortlist: the whole graded shortlist (about 40), the ceiling the owner's AI can reach when it grades;
//   graded:    the cards a grader kept from each shortlist, read from --grades (only when given).
// Reports must-recall at 10 and 15 (at 40 for the shortlist), any-useful precision, wrong cards surfaced, digest
// words and time.
//
//   node scripts/eval-prepare.mjs [--vertical=ecommerce] [--k=15] [--split] [--json] [--brief <file>]
//   node scripts/eval-prepare.mjs --export=<dir>     write one grading sheet per brief (brief + digest, no labels)
//   node scripts/eval-prepare.mjs --grades=<file>    score a grader's keeps: {"b01": ["MCR-0022", ...], ...}
//
// The grader is the owner's AI doing the digest's printed grading step. Run it on a Claude plan (a fresh subagent per
// sheet, or `claude -p < sheet.md`), never with API keys, and never show it this script, the labels or the other
// sheets. It answers with a line "KEEP: ID, ID, ..." (best first); --grades also accepts a folder of those answers
// named <brief id>.txt.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVertical } from "./eval-vertical.mjs";
import { moduleMarkdown } from "../src/modules/knowledge/cards.ts";
import { JobPrep, cardsFromModuleMarkdown, preparedMarkdown, briefAsks, briefSignals } from "../src/modules/knowledge/prepare.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => { const a = process.argv.find(x => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : d; };
const vertical = arg("vertical", "ecommerce"), K = Number(arg("k", "15"));

export function packCards(id) {
  const { vertical: v, sources, cards } = loadVertical(id, { publicOnly: true });
  const src = new Map(sources.map(s => [s.id, s]));
  return v.modules.flatMap(m => {
    const mine = cards.filter(c => c.modules[0] === m.code);
    return mine.length ? cardsFromModuleMarkdown(m.code, moduleMarkdown(v, m.code, mine, src)) : [];
  });
}

/** A grader's answer: the ids on its "KEEP:" line, best first (or every card id in the text when there is no such line). */
export function keptIds(answer) {
  const line = /^\W*KEEP\W*:?\s*(.+)$/im.exec(answer);
  return [...new Set(((line ? line[1] : answer).match(/\b[A-Z]{2,4}-\d{4}\b/g) ?? []))];
}

const cards = packCards(vertical);
export { cards };
const prep = new JobPrep(cards);
const bi = process.argv.indexOf("--brief");
if (bi > 0) {
  const t = Date.now();
  const p = prep.prepare(readFileSync(process.argv[bi + 1], "utf8"), { k: K });
  console.log(preparedMarkdown(p));
  console.error(`${cards.length} cards, ${Date.now() - t} ms`);
  process.exit(0);
}
const golden = JSON.parse(readFileSync(path.join(ROOT, "test", "fixtures", `${vertical}-jobs-golden.json`), "utf8"));
const known = new Set(cards.map(c => c.id));

const exportDir = arg("export", null);
if (exportDir) {
  mkdirSync(exportDir, { recursive: true });
  for (const b of golden.briefs) {
    const sheet = [
      "You are the AI an online store owner uses. Below is their brief, then the knowledge brief a lookup tool wrote for this job. Do its grading step and nothing else: do not draft the work.",
      "",
      "End your answer with one line: KEEP: <the 10 to 15 card ids you keep, best first, separated by commas>",
      "",
      "# The owner's brief",
      "",
      b.brief,
      "",
      preparedMarkdown(prep.prepare(b.brief, { k: K })),
    ].join("\n");
    writeFileSync(path.join(exportDir, `${b.id}.md`), sheet + "\n");
  }
  console.log(`wrote ${golden.briefs.length} grading sheets to ${exportDir}`);
  process.exit(0);
}

let grades = null;
const gradesArg = arg("grades", null);
if (gradesArg) {
  grades = {};
  if (statSync(gradesArg).isDirectory()) for (const f of readdirSync(gradesArg).filter(f => f.endsWith(".txt"))) grades[f.replace(/\.txt$/, "")] = keptIds(readFileSync(path.join(gradesArg, f), "utf8"));
  else for (const [id, v] of Object.entries(JSON.parse(readFileSync(gradesArg, "utf8")))) grades[id] = Array.isArray(v) ? v : keptIds(String(v));
}

const prepCache = new Map();
const prepared = b => { if (!prepCache.has(b)) prepCache.set(b, prep.prepare(b, { k: K })); return prepCache.get(b); };
const ways = {
  "one-query": b => oneQuery(b.brief),
  "two-query": b => twoQuery(b.brief),
  prepare: b => prepared(b.brief).picks.map(p => p.card.id),
  shortlist: b => prepared(b.brief).shortlist.map(p => p.card.id),
  ...(grades ? { graded: b => (grades[b.id] ?? []).slice(0, K) } : {}),
};
// The plain baselines run the same index without the plan, filters, rerank or diversity.
function oneQuery(b) { return rawAsk([b.replace(/\s+/g, " ").slice(0, 2000)]); }
function twoQuery(b) { const q = [briefAsks(b)[0], briefSignals(b)[0]].filter(Boolean); return rawAsk(q.length ? q : [b]); }
function rawAsk(qs) {
  const seen = new Map();
  for (const q of qs) prep.raw(q).forEach((id, r) => seen.set(id, Math.max(seen.get(id) ?? 0, 1 / (10 + r + 1))));
  return [...seen].sort((a, b) => b[1] - a[1]).map(([id]) => id).slice(0, K);
}
const rows = [];
for (const b of golden.briefs) {
  const must = b.must.filter(id => known.has(id)), good = new Set([...must, ...b.good.filter(id => known.has(id))]), wrong = new Set(b.wrong ?? []);
  const row = { id: b.id, module: b.module, must: must.length };
  for (const [name, fn] of Object.entries(ways)) {
    const t = Date.now();
    const got = fn(b);
    const ms = Date.now() - t;
    const at = n => must.length ? must.filter(id => got.slice(0, n).includes(id)).length / must.length : 0;
    row[name] = { r10: at(10), r15: at(15), r40: at(40), n: got.length, useful: got.length ? got.filter(id => good.has(id)).length / got.length : 0, wrong: got.filter(id => wrong.has(id)).length, ms };
  }
  row.words = preparedMarkdown(prepared(b.brief)).split(/\s+/).length;
  rows.push(row);
}
const summarize = rs => Object.fromEntries(Object.keys(ways).map(n => {
  const avg = f => +(rs.reduce((s, r) => s + r[n][f], 0) / rs.length).toFixed(3);
  return [n, { r10: avg("r10"), r15: avg("r15"), r40: avg("r40"), n: avg("n"), useful: avg("useful"), wrong: rs.reduce((s, r) => s + r[n].wrong, 0), ms: Math.round(avg("ms")) }];
}));
const summary = summarize(rows);
summary.digestWords = Math.round(rows.reduce((s, r) => s + r.words, 0) / rows.length);
const line = (n, s) => n === "shortlist"
  ? `  ${n.padEnd(10)} must@40 ${s.r40}  cards ${s.n}  useful ${s.useful}  wrong ${s.wrong}`
  : `  ${n.padEnd(10)} must@10 ${s.r10}  must@15 ${s.r15}  useful ${s.useful}  wrong ${s.wrong}  cards ${s.n}  ${s.ms} ms`;
if (process.argv.includes("--split")) {
  // Tune on the odd-numbered briefs (b01, b03, ...), report on the even ones.
  for (const [half, keep] of [["tune (odd)", (_, i) => i % 2 === 0], ["check (even)", (_, i) => i % 2 === 1]]) {
    const s = summarize(rows.filter(keep));
    console.log(half);
    for (const [n, v] of Object.entries(s)) console.log(line(n, v));
  }
}
if (process.argv.includes("--json")) console.log(JSON.stringify({ summary, rows }, null, 2));
else {
  console.log(`${vertical}: ${cards.length} public cards, ${rows.length} briefs, k=${K}`);
  for (const [n, s] of Object.entries(summary)) if (typeof s === "object") console.log(line(n, s));
  console.log(`  digest words ${summary.digestWords}`);
  for (const r of rows) console.log(`  ${r.id} ${r.module.padEnd(4)} must ${r.must}  one ${r["one-query"].r15.toFixed(2)}  two ${r["two-query"].r15.toFixed(2)}  prep ${r.prepare.r15.toFixed(2)}  list ${r.shortlist.r40.toFixed(2)}${grades ? `  graded ${r.graded.r15.toFixed(2)}` : ""}  wrong ${r.prepare.wrong}`);
}
