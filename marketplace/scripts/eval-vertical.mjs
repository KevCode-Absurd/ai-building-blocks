// Scores a vertical knowledge library's retrieval on an independent golden set (test/fixtures/<vertical>-golden.json:
// founder questions written from the sources, never from the cards). A question counts as found at rank r when the
// r-th card returned comes from the question's source file. Questions of type "absent" have no answer in any source:
// the library should say it does not know (enough = false). Reports Hit@1, Hit@3, Hit@5, MRR@10, abstention, and the
// misses. Uses every card (public and private), since it measures retrieval, not what is published.
//
//   node scripts/eval-vertical.mjs [--vertical=ecommerce] [--misses] [--json] [--public]
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CardIndex } from "../src/modules/knowledge/cards.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export function loadVertical(id, { publicOnly = false } = {}) {
  const dir = path.join(ROOT, "knowledge", id);
  const vertical = JSON.parse(readFileSync(path.join(dir, "vertical.json"), "utf8"));
  const sources = existsSync(path.join(dir, "sources.json")) ? JSON.parse(readFileSync(path.join(dir, "sources.json"), "utf8")) : [];
  let cards = existsSync(path.join(dir, "cards")) ? readdirSync(path.join(dir, "cards")).filter(f => f.endsWith(".json")).flatMap(f => JSON.parse(readFileSync(path.join(dir, "cards", f), "utf8"))) : [];
  if (publicOnly) cards = cards.filter(c => c.public);
  return { vertical, sources, cards };
}

const norm = f => String(f).replace(/\\/g, "/").replace(/\.(txt|docx)$/i, "").toLowerCase();

export function evaluateVertical(id, golden, opts = {}) {
  const { vertical, sources, cards } = loadVertical(id, opts);
  const index = new CardIndex(vertical, cards, sources);
  const fileOf = new Map(sources.map(s => [s.id, norm(s.file ?? "")]));
  const rows = golden.questions.map(q => {
    const a = index.ask(q.q, { k: 10 });
    if (q.type === "absent") return { ...q, absent: true, refused: !a.enough, top: a.hits[0]?.card.id ?? null };
    const want = norm(q.source);
    const rank = a.hits.findIndex(h => fileOf.get(h.card.source) === want) + 1;
    const covered = cards.some(c => fileOf.get(c.source) === want);
    return { ...q, rank, covered, enough: a.enough, top: a.hits[0] ? `${a.hits[0].card.id} ${a.hits[0].card.claim}` : null };
  });
  const answerable = rows.filter(r => !r.absent);
  const withCards = answerable.filter(r => r.covered);
  const at = (rs, n) => rs.length ? rs.filter(r => r.rank > 0 && r.rank <= n).length / rs.length : 0;
  const mrr = rs => rs.length ? rs.reduce((s, r) => s + (r.rank ? 1 / r.rank : 0), 0) / rs.length : 0;
  const absent = rows.filter(r => r.absent);
  const round = x => Math.round(x * 1000) / 1000;
  return {
    cards: cards.length, questions: rows.length, answerable: answerable.length,
    /** Questions whose source produced at least one card: retrieval can only find what extraction kept. */
    covered: withCards.length,
    hit1: round(at(answerable, 1)), hit3: round(at(answerable, 3)), hit5: round(at(answerable, 5)), mrr: round(mrr(answerable)),
    covered_hit5: round(at(withCards, 5)), covered_mrr: round(mrr(withCards)),
    absent: absent.length, refused: absent.filter(r => r.refused).length,
    answered_when_found: answerable.filter(r => r.rank > 0 && r.rank <= 5 && r.enough).length,
    misses: answerable.filter(r => !r.rank || r.rank > 5),
    wrongly_answered: absent.filter(r => !r.refused),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const id = process.argv.find(a => a.startsWith("--vertical="))?.split("=")[1] ?? "ecommerce";
  const golden = JSON.parse(readFileSync(path.join(ROOT, "test", "fixtures", `${id}-golden.json`), "utf8"));
  const r = evaluateVertical(id, golden, { publicOnly: process.argv.includes("--public") });
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else {
    console.log(`${id}: ${r.cards} cards; ${r.answerable} answerable questions (${r.covered} whose source has cards), ${r.absent} absent`);
    console.log(`  all answerable: Hit@1 ${r.hit1}  Hit@3 ${r.hit3}  Hit@5 ${r.hit5}  MRR@10 ${r.mrr}`);
    console.log(`  source has cards: Hit@5 ${r.covered_hit5}  MRR@10 ${r.covered_mrr}`);
    console.log(`  absent questions refused: ${r.refused}/${r.absent}`);
    if (process.argv.includes("--misses")) {
      for (const m of r.misses) console.log(`MISS [${m.module}] ${m.q}\n   want ${m.source}${m.covered ? "" : " (no cards from this source)"}\n   got  ${m.top}`);
      for (const m of r.wrongly_answered) console.log(`ANSWERED AN ABSENT QUESTION: ${m.q} -> ${m.top}`);
    }
  }
}
