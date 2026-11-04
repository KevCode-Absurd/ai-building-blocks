// The business boards review sheet: every item, specialist and mini tool made for each board, with its stage.
// Run from the repo root after `npm run index` (in site/):
//   node tools/map-boards.mjs board-review.csv     write the sheet (one row per board and entry)
//   node tools/map-boards.mjs                      print the counts per board and stage
// Fix a wrong row in catalogue-items/boards.yaml, not here.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const { mapAll, readFixes } = await import(new URL(`file:///${path.join(SITE, "scripts/lib/board-map.mjs").replace(/\\/g, "/")}`).href);
const { BOARDS, STAGES } = await import(new URL(`file:///${path.join(SITE, "src/trust-pages/boards.mjs").replace(/\\/g, "/")}`).href);
const { TOOLS } = await import(new URL(`file:///${path.join(ROOT, "mini-tools/index.mjs").replace(/\\/g, "/")}`).href);
const read = (f) => JSON.parse(fs.readFileSync(path.join(SITE, "public/data", f), "utf8"));
const { fixes, problems } = readFixes();
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
const { boards, unplaced } = mapAll({ blocks: read("blocks-index.json").blocks, roles: read("roles-index.json").roles, tools: TOOLS, fixes });

const csv = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const rows = [["board", "stage", "stage label", "kind", "slug", "name", "summary"]];
for (const b of BOARDS) for (const s of STAGES) {
  const at = boards[b.slug][s.id];
  for (const x of at.made) rows.push([b.name, s.id, b.stages[s.id][0], x.kind, x.slug, x.name, x.summary]);
  for (const r of at.roles) rows.push([b.name, s.id, b.stages[s.id][0], "specialist", `role:${r.id}`, r.name, r.summary]);
  for (const t of at.tools.filter((t) => t.made)) rows.push([b.name, s.id, b.stages[s.id][0], "tool", `tool:${t.slug}`, t.name, t.summary]);
}
const out = process.argv[2];
if (out) { fs.writeFileSync(out, rows.map((r) => r.map(csv).join(",")).join("\n") + "\n"); console.log(`${rows.length - 1} rows written to ${out}`); }
for (const b of BOARDS) {
  const st = boards[b.slug];
  const made = STAGES.reduce((n, s) => n + st[s.id].made.length, 0), roles = STAGES.reduce((n, s) => n + st[s.id].roles.length, 0);
  console.log(`${b.name.padEnd(40)} ${String(made).padStart(5)} made for, ${String(roles).padStart(4)} specialists  ${STAGES.map((s) => `${s.id} ${st[s.id].made.length}`).join(" · ")}`);
}
console.log(`${unplaced.length} entries are on no board (personal, academic, investing or minds).`);
