// Checks every import map file at once: each one reads as YAML, and no name is used twice (across maps or with a skill we have).
// Run from the repo root: node tools/check-import-maps.mjs
import fs from "node:fs";
import path from "node:path";
import YAML from "../site/node_modules/yaml/dist/index.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const files = ["tools/import-map.yaml", ...fs.readdirSync(path.join(ROOT, "tools/import-map")).filter((f) => f.endsWith(".yaml")).sort().map((f) => `tools/import-map/${f}`)];
const ours = new Map();
for (const cat of ["general", "ecommerce"]) for (const slug of fs.readdirSync(path.join(ROOT, "catalogue-items", cat))) {
  const f = path.join(ROOT, "catalogue-items", cat, slug, "item.yaml");
  if (fs.existsSync(f)) ours.set(String(YAML.parse(fs.readFileSync(f, "utf8")).name).toLowerCase(), `${cat}/${slug}`);
}
const names = new Map();
const per = {};
const problems = [];
// Later files win, as in tools/import-skills.mjs (zz-review-overrides.yaml sorts last).
const merged = {};
for (const f of files) {
  let map;
  try { map = YAML.parse(fs.readFileSync(path.join(ROOT, f), "utf8")) ?? {}; } catch (e) { problems.push(`${f}: YAML error: ${e.message.split(/\r?\n/)[0]}`); continue; }
  for (const [key, v] of Object.entries(map)) merged[key] = v;
}
for (const [key, v] of Object.entries(merged)) {
    const repo = key.split(":")[0];
    per[repo] ??= { kept: 0, skipped: 0 };
    if (v?.skip) { per[repo].skipped++; continue; }
    per[repo].kept++;
    const n = String(v?.name ?? "").toLowerCase();
    if (!n) problems.push(`${key}: no name`);
    if (ours.has(n)) problems.push(`${key}: "${v.name}" is already our ${ours.get(n)}`);
    names.set(n, [...(names.get(n) ?? []), key]);
}
for (const [n, keys] of names) if (keys.length > 1) problems.push(`"${n}" is used ${keys.length} times: ${keys.join(", ")}`);
for (const [repo, c] of Object.entries(per)) console.log(`${repo}: ${c.kept} kept, ${c.skipped} skipped`);
const total = Object.values(per).reduce((a, c) => ({ kept: a.kept + c.kept, skipped: a.skipped + c.skipped }), { kept: 0, skipped: 0 });
console.log(`\n${files.length} map files, ${total.kept} kept, ${total.skipped} skipped`);
if (problems.length) { console.log(`\n${problems.length} problems:\n  ${problems.join("\n  ")}`); process.exitCode = 1; }
