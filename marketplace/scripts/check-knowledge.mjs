// Knowledge-kit quality check over every role kit in packs/roles (Stanford CS329Z lectures 11 and 12: data quality
// beats volume when the pool is small; check provenance, dedupe near-copies, keep it fresh).
//
//   node scripts/check-knowledge.mjs [--json] [--today=YYYY-MM-DD] [--role=<id>]
//
// Errors (exit 1): a [n] in knowledge.md with no row in sources.json (a citation that points nowhere), and a
// sources.json row without a url or checked date. Warnings: sources never cited, sources past twice their review
// window, near-duplicate passages inside one kit (word-set Jaccard 0.5 or more, the threshold lecture 12 uses), and
// numbers in a Benchmarks section with no [n] on the same line.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chunkMarkdown, indexedPath, tokens } from "../src/modules/packs/retrieve.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROLES = path.join(ROOT, "packs", "roles");

const jaccard = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / (a.size + b.size - n || 1); };
const days = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a.slice(0, 10)}T00:00:00Z`)) / 86_400_000);

export function checkKit(roleId, today) {
  const dir = path.join(ROLES, roleId);
  const read = p => existsSync(path.join(dir, p)) ? readFileSync(path.join(dir, p), "utf8") : null;
  const errors = [], warnings = [];
  const knowledge = read("knowledge.md");
  if (!knowledge) return { role: roleId, errors, warnings, skipped: true };
  let sources = [];
  try { sources = JSON.parse(read("sources.json") ?? "[]"); } catch { errors.push("sources.json is not valid JSON"); }
  let role = {};
  try { role = JSON.parse(read("role.json") ?? "{}"); } catch {}
  const review = Number(role.review_every_days) || 14;
  const rows = new Map(sources.map(s => [s.n, s]));
  for (const s of sources) {
    if (!s.url) errors.push(`source [${s.n}] has no url`);
    if (!/^\d{4}-\d{2}-\d{2}/.test(s.checked ?? "")) errors.push(`source [${s.n}] has no checked date`);
    else if (today && days(s.checked, today) > review * 2) warnings.push(`source [${s.n}] was checked ${s.checked}, more than twice its ${review}-day review window ago`);
  }
  const cited = new Set();
  knowledge.split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(/\[(\d{1,3})\]/g)) {
      const n = Number(m[1]);
      cited.add(n);
      if (!rows.has(n)) errors.push(`knowledge.md:${i + 1} cites [${n}], which sources.json does not have`);
    }
  });
  for (const s of sources) if (!cited.has(s.n)) warnings.push(`source [${s.n}] is never cited in knowledge.md`);
  // Numbers in the benchmarks section need a source on the same line.
  const bench = /^##\s+(?:\d+\.\s*)?Benchmarks[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/im.exec(knowledge.replace(/\r\n?/g, "\n"));
  if (bench) for (const line of bench[1].split("\n")) if (/^\s*[-*]/.test(line) && /\d/.test(line.replace(/\[\d+\]/g, "")) && !/\[\d+\]/.test(line)) warnings.push(`benchmark without a source: ${line.trim().slice(0, 90)}`);
  // Near-duplicate passages across the kit's files.
  const files = [];
  const walk = rel => { for (const name of readdirSync(path.join(dir, rel)).sort()) { const r = rel ? `${rel}/${name}` : name; if (statSync(path.join(dir, r)).isDirectory()) walk(r); else if (indexedPath(r)) files.push({ path: r, text: read(r) }); } };
  walk("");
  const chunks = files.flatMap(f => chunkMarkdown(f.path, f.text)).map(c => ({ c, set: new Set(tokens(c.text)) })).filter(x => x.set.size >= 25);
  for (let i = 0; i < chunks.length; i++) for (let j = i + 1; j < chunks.length; j++) {
    const s = jaccard(chunks[i].set, chunks[j].set);
    if (s >= 0.5) warnings.push(`near-duplicate passages (Jaccard ${s.toFixed(2)}): ${chunks[i].c.path}:${chunks[i].c.lines[0]} and ${chunks[j].c.path}:${chunks[j].c.lines[0]}`);
  }
  return { role: roleId, errors, warnings };
}

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  const arg = n => process.argv.find(a => a.startsWith(`--${n}=`))?.split("=")[1];
  const today = arg("today") ?? new Date().toISOString().slice(0, 10);
  const roles = arg("role") ? [arg("role")] : readdirSync(ROLES).filter(r => statSync(path.join(ROLES, r)).isDirectory()).sort();
  const results = roles.map(r => checkKit(r, today)).filter(r => !r.skipped);
  const errors = results.reduce((n, r) => n + r.errors.length, 0);
  if (process.argv.includes("--json")) console.log(JSON.stringify(results, null, 2));
  else {
    const kinds = {};
    for (const r of results) for (const w of r.warnings) { const k = w.replace(/\[\d+\]|\d+(\.\d+)?|:.*$/g, "#").slice(0, 40); kinds[k] = (kinds[k] ?? 0) + 1; }
    for (const r of results) for (const e of r.errors) console.log(`ERROR ${r.role}: ${e}`);
    console.log(`${results.length} kits checked: ${errors} errors, ${results.reduce((n, r) => n + r.warnings.length, 0)} warnings`);
    for (const [k, n] of Object.entries(kinds).sort((a, b) => b[1] - a[1])) console.log(`  ${n} x ${k}`);
  }
  process.exitCode = errors ? 1 : 0;
}
