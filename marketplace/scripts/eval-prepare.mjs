// Scores job preparation (src/modules/knowledge/prepare.ts) on the brief-level golden set
// (test/fixtures/<vertical>-jobs-golden.json: whole job briefs labelled with the cards an expert wants, written
// independently of the retrieval code). Compares three ways to get cards for a brief:
//   one-query: the whole brief as one ask-knowledge query (what an agent does when it asks once);
//   two-query: the first request sentence and the first data signal, the typical agent in round 2;
//   prepare:   the prepare step (query plan, fact filters, rerank, diversity).
// Reports must-recall at 10 and 15, any-useful precision, wrong cards surfaced, digest words and time.
//
//   node scripts/eval-prepare.mjs [--vertical=ecommerce] [--k=15] [--json] [--brief <file>]
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadVertical } from "./eval-vertical.mjs";
import { moduleMarkdown } from "../src/modules/knowledge/cards.ts";
import { JobPrep, cardsFromModuleMarkdown, preparedMarkdown, briefAsks, briefSignals, briefFacts, fitsFacts } from "../src/modules/knowledge/prepare.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => { const a = process.argv.find(x => x.startsWith(`--${n}=`)); return a ? a.split("=")[1] : d; };
const vertical = arg("vertical", "ecommerce"), K = Number(arg("k", "15"));

export function packCards(id) {
  const { vertical: v, sources, cards } = loadVertical(id, { publicOnly: true });
  const src = new Map(sources.map(s => [s.id, s]));
  return v.modules.flatMap(m => {
    const mine = cards.filter(c => c.modules[0] === m.code);
    return mine.length ? cardsFromModuleMarkdown(m.code, moduleMarkdown(v, m.code, mine, src)) : [];
  });
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
const ways = {
  "one-query": b => oneQuery(b),
  "two-query": b => twoQuery(b),
  prepare: b => prep.prepare(b, { k: K }).picks.map(p => p.card.id),
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
    const got = fn(b.brief);
    const ms = Date.now() - t;
    const at = n => must.length ? must.filter(id => got.slice(0, n).includes(id)).length / must.length : 0;
    row[name] = { r10: at(10), r15: at(15), useful: got.length ? got.filter(id => good.has(id)).length / got.length : 0, wrong: got.filter(id => wrong.has(id)).length, ms };
  }
  row.words = preparedMarkdown(prep.prepare(b.brief, { k: K })).split(/\s+/).length;
  rows.push(row);
}
const avg = (name, f) => (rows.reduce((s, r) => s + r[name][f], 0) / rows.length);
const summary = Object.fromEntries(Object.keys(ways).map(n => [n, { r10: +avg(n, "r10").toFixed(3), r15: +avg(n, "r15").toFixed(3), useful: +avg(n, "useful").toFixed(3), wrong: rows.reduce((s, r) => s + r[n].wrong, 0), ms: Math.round(avg(n, "ms")) }]));
summary.digestWords = Math.round(rows.reduce((s, r) => s + r.words, 0) / rows.length);
if (process.argv.includes("--split")) {
  for (const [half, keep] of [["tune (odd)", (_, i) => i % 2 === 0], ["check (even)", (_, i) => i % 2 === 1]]) {
    const rs = rows.filter(keep), a = (n, f) => (rs.reduce((x, r) => x + r[n][f], 0) / rs.length).toFixed(3);
    console.log(half + ": " + Object.keys(ways).map(n => n + " must@15 " + a(n, "r15") + " useful " + a(n, "useful") + " wrong " + rs.reduce((x, r) => x + r[n].wrong, 0)).join(" | "));
  }
}
if (process.argv.includes("--json")) console.log(JSON.stringify({ summary, rows }, null, 2));
else {
  console.log(`${vertical}: ${cards.length} public cards, ${rows.length} briefs, k=${K}`);
  for (const [n, s] of Object.entries(summary)) if (typeof s === "object") console.log(`  ${n.padEnd(10)} must@10 ${s.r10}  must@15 ${s.r15}  useful ${s.useful}  wrong ${s.wrong}  ${s.ms} ms`);
  console.log(`  digest words ${summary.digestWords}`);
  for (const r of rows) console.log(`  ${r.id} ${r.module.padEnd(4)} must ${r.must}  one ${r["one-query"].r15.toFixed(2)}  two ${r["two-query"].r15.toFixed(2)}  prep ${r.prepare.r15.toFixed(2)}  wrong ${r.prepare.wrong}`);
}
