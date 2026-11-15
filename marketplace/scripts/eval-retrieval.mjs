// Retrieval eval: how often the knowledge lookup (src/modules/packs/retrieve.ts) puts the passage that answers a
// question in its top k, over the independent golden set in test/fixtures/retrieval-golden.json (75 questions across
// 15 role kits, written by an author who never saw the retrieval code). Reports Hit@1, Hit@3, Hit@5, MRR@10 and the
// misses, overall and by question type. Lecture 3 of Stanford CS329Z: measure retrieval on its own, with Hit@k and
// MRR, before judging answers. test/packs-retrieve.test.ts holds the floor.
//
// --split also reports the tuning half (odd-numbered questions: 1st, 3rd, ...) and the held-out half (even-numbered)
// on their own: tune on the first, report the second.
//
//   node scripts/eval-retrieval.mjs [--k 10] [--json] [--misses] [--split]
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { KnowledgeIndex, indexedPath } from "../src/modules/packs/retrieve.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** The kit files an agent of the role would carry and look up: knowledge, skills, prompts, workflows. */
export function kitFiles(roleId) {
  const dir = path.join(ROOT, "packs", "roles", roleId);
  const out = [];
  const walk = rel => {
    for (const name of readdirSync(path.join(dir, rel)).sort()) {
      const r = rel ? `${rel}/${name}` : name;
      if (statSync(path.join(dir, r)).isDirectory()) walk(r);
      else if (indexedPath(r)) out.push({ path: r, text: readFileSync(path.join(dir, r), "utf8") });
    }
  };
  walk("");
  return out;
}

export function evaluate(golden, { k = 10 } = {}) {
  const indexes = new Map();
  const rows = golden.questions.map(q => {
    if (!indexes.has(q.role)) indexes.set(q.role, new KnowledgeIndex(kitFiles(q.role)));
    const index = indexes.get(q.role);
    const answer = index.ask(q.q, { k });
    const norm = s => s.replace(/\s+/g, " ");
    const rank = answer.passages.findIndex(p => p.path === q.file && norm(p.text).includes(norm(q.quote))) + 1;
    return { ...q, rank, enough: answer.enough, top: answer.passages[0]?.id ?? null };
  });
  const at = (n, rs = rows) => rs.filter(r => r.rank > 0 && r.rank <= n).length / rs.length;
  const mrrOf = rs => rs.reduce((a, r) => a + (r.rank ? 1 / r.rank : 0), 0) / rs.length;
  const mrr = mrrOf(rows);
  const byType = {};
  for (const r of rows) {
    const t = (byType[r.type] ??= { n: 0, hit5: 0 });
    t.n++; if (r.rank > 0 && r.rank <= 5) t.hit5++;
  }
  const round = x => Math.round(x * 1000) / 1000;
  const half = keep => { const rs = rows.filter((_, i) => keep(i)); return { n: rs.length, hit1: round(at(1, rs)), hit3: round(at(3, rs)), hit5: round(at(5, rs)), mrr: round(mrrOf(rs)) }; };
  const split = { tune: half(i => i % 2 === 0), check: half(i => i % 2 === 1) };
  return { n: rows.length, hit1: round(at(1)), hit3: round(at(3)), hit5: round(at(5)), mrr: round(mrr), byType, split, misses: rows.filter(r => !r.rank || r.rank > 5) };
}

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const golden = JSON.parse(readFileSync(path.join(ROOT, "test", "fixtures", "retrieval-golden.json"), "utf8"));
  const kArg = process.argv.indexOf("--k");
  const r = evaluate(golden, { k: kArg > 0 ? Number(process.argv[kArg + 1]) : 10 });
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else {
    console.log(`questions ${r.n}  Hit@1 ${r.hit1}  Hit@3 ${r.hit3}  Hit@5 ${r.hit5}  MRR@10 ${r.mrr}`);
    for (const [t, v] of Object.entries(r.byType)) console.log(`  ${t}: Hit@5 ${v.hit5}/${v.n}`);
    if (process.argv.includes("--split")) for (const [h, v] of Object.entries(r.split)) console.log(`  ${h === "tune" ? "tune (odd)" : "check (even, held out)"}: ${v.n} questions  Hit@1 ${v.hit1}  Hit@3 ${v.hit3}  Hit@5 ${v.hit5}  MRR@10 ${v.mrr}`);
    if (process.argv.includes("--misses")) for (const m of r.misses) console.log(`MISS (rank ${m.rank || "-"}) [${m.role}] ${m.q}\n   want ${m.file}: "${m.quote}"\n   got  ${m.top}`);
  }
}
