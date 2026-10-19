// Reading level of every block page, or of any text you give it. We aim for grade 8 to 10.
// Run from the repo root:
//   node tools/reading-level.mjs                 every page, hardest first
//   node tools/reading-level.mjs <slug>          one page, with the words and sentences to fix
//   node tools/reading-level.mjs --text "..."    any text
//   node tools/reading-level.mjs --file x.md     any file
//   add --max 10 to list only pages above grade 10, --strict to fail when any are
import fs from "node:fs";
import YAML from "../site/node_modules/yaml/dist/index.js";
import { grade, hardWords, longSentences } from "./readability.mjs";

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const MAX = Number(opt("--max") ?? 10);
const show = (label, text) => {
  console.log(`${label}: grade ${grade(text)}`);
  const hard = hardWords(text), long = longSentences(text);
  if (hard.length) console.log(`  long words: ${hard.join(", ")}`);
  for (const s of long) console.log(`  long sentence: ${s}`);
};

if (opt("--text") !== undefined) { show("text", opt("--text")); process.exit(0); }
if (opt("--file")) { show(opt("--file"), fs.readFileSync(opt("--file"), "utf8")); process.exit(0); }

// The words a visitor reads on a block page. The skill file itself is for the AI and isn't graded here.
const flat = (x) => (x == null ? [] : Array.isArray(x) ? x.flatMap(flat) : typeof x === "object" ? Object.values(x).flatMap(flat) : [String(x)]);
const readerText = (p) => [p.headline, p.subhead, p.summary, p.explain, p.when, p.you_give, p.you_get, p.how_to_use, (p.how_it_works ?? []).map((s) => s.text), (p.tweaks ?? []).map((t) => t.how), p.judge, p.improve].flatMap(flat).join("\n");

const files = [];
for (const cat of ["general", "ecommerce"]) for (const slug of fs.readdirSync(`catalogue-items/${cat}`)) {
  const f = `catalogue-items/${cat}/${slug}/page.yaml`;
  if (fs.existsSync(f)) files.push({ slug, f });
}
for (const f of fs.readdirSync("tools/orchestrator-pages").filter((x) => x.endsWith(".yaml"))) files.push({ slug: f.replace(/\.yaml$/, ""), f: `tools/orchestrator-pages/${f}` });

const one = args.find((a) => !a.startsWith("--") && !args[args.indexOf(a) - 1]?.startsWith("--"));
if (one) {
  const hit = files.find((x) => x.slug === one);
  if (!hit) { console.error(`No page called ${one}`); process.exit(1); }
  const p = YAML.parse(fs.readFileSync(hit.f, "utf8"));
  show("headline + subhead + summary", [p.headline, p.subhead, p.summary].join("\n"));
  show("whole page", readerText(p));
  process.exit(0);
}

const rows = files.map(({ slug, f }) => {
  const p = YAML.parse(fs.readFileSync(f, "utf8"));
  return { slug, top: grade([p.headline, p.subhead, p.summary].join("\n")), page: grade(readerText(p)) };
}).sort((a, b) => b.page - a.page);
const over = rows.filter((r) => r.page > MAX);
const mid = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
for (const r of args.includes("--max") ? over : rows) console.log(`${String(r.page).padStart(5)}  ${String(r.top).padStart(5)}  ${r.slug}`);
console.log(`\n${rows.length} pages. Middle page reads at grade ${mid(rows.map((r) => r.page))}. ${over.length} above grade ${MAX}.`);
console.log("Columns: whole page, then headline + subhead + summary.");
if (args.includes("--strict") && over.length) process.exit(1);
