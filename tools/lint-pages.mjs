// Checks every block page against docs/PAGE-FORMAT.md and docs/WRITING.md.
// Run from the repo root: node tools/lint-pages.mjs [--json] [--fix]
// Every page is checked, imported skills and workflow folders too (catalogue-items/imported and catalogue-items/orchestrators
// use the newer page format, so they are held to that).
// Two rules fail the run (exit 1): a list line that YAML read as a map instead of plain text, and a page whose skill
// ships scripts or tells the AI to run commands but never says it needs an AI that can run code (tools/lib/page-lists.mjs).
// --fix quotes those list lines and adds the plain "An AI that can run code" line to Before you start.
// Everything else is reported as before and does not fail the run: many older pages miss fields from the old format.
import fs from "node:fs";
import path from "node:path";
import YAML from "../site/node_modules/yaml/dist/index.js";
import { TASKS } from "../site/src/lib/catalogue-taxonomy.mjs";
import { addPrerequisite, codeNote, mapItems, quoteMapItems, runsCode, saysRunsCode } from "./lib/page-lists.mjs";

// Imported skills and workflow folders are written to docs/QUALITY-BAR.md: an output_sample instead of the old output_shape,
// example and tests.
const REQUIRED_IMPORTED = ["name", "summary", "job", "headline", "subhead", "when", "not_for", "you_give", "you_get", "how_to_use", "output_sample"];
const REQUIRED = ["new_slug", "name", "summary", "job", "headline", "subhead", "explain", "when", "you_give", "you_get", "how_to_use", "how_it_works", "output_shape", "example", "tweaks", "judge", "test", "improve"];
// The jobs come from the site's own list, so a new job is never reported as unknown.
const JOBS = TASKS.map((t) => t.id);
const BANNED = ["delve", "foster", "leverage", "utilize", "facilitate", "empower", "streamline", "robust", "cutting-edge", "game changer", "game-changer", "unlock", "supercharge", "harness", "elevate", "seamless", "effortless", "transformative", "revolutionize", "paradigm", "synergy", "holistic", "journey", "ecosystem", "best-in-class", "world-class", "next-level", "morrow", "ledgerly", "hale studio"];
const words = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean).length;

const pages = [];
for (const cat of ["general", "ecommerce", "agents", "imported", "orchestrators"]) for (const slug of fs.existsSync(`catalogue-items/${cat}`) ? fs.readdirSync(`catalogue-items/${cat}`) : []) {
  if (fs.existsSync(`catalogue-items/${cat}/${slug}/item.yaml`) && (cat !== "orchestrators" || fs.existsSync(`catalogue-items/${cat}/${slug}/page.yaml`))) pages.push({ slug, file: `catalogue-items/${cat}/${slug}/page.yaml`, imported: cat === "imported", newer: cat === "imported" || cat === "orchestrators" });
}
const WF = "tools/orchestrator-pages";
if (fs.existsSync(WF)) for (const f of fs.readdirSync(WF).filter((f) => f.endsWith(".yaml"))) pages.push({ slug: f.replace(/\.yaml$/, ""), file: `${WF}/${f}` });

const FIX = process.argv.includes("--fix");
const fixed = { lists: 0, listPages: 0, code: 0, codeLeft: [] };
const report = [];
for (const { slug, file, newer } of pages) {
  const issues = [], errors = [];
  if (!fs.existsSync(file)) { report.push({ slug, file, issues: ["no page.yaml"], errors }); continue; }
  let raw = fs.readFileSync(file, "utf8");
  let p;
  try { p = YAML.parse(raw); } catch (e) { report.push({ slug, file, issues: [`bad YAML: ${e.message.split(String.fromCharCode(10))[0]}`], errors: ["bad YAML"] }); continue; }
  // Skills that run code: the folder ships scripts, or SKILL.md has commands to run.
  const folder = path.dirname(file);
  const skillFile = file.endsWith("/page.yaml") && fs.existsSync(path.join(folder, "SKILL.md")) ? path.join(folder, "SKILL.md") : null;
  const why = skillFile ? runsCode(fs.readFileSync(skillFile, "utf8"), fs.existsSync(path.join(folder, "scripts")) && fs.statSync(path.join(folder, "scripts")).isDirectory()) : "";
  if (FIX) {
    let changed = false;
    if (mapItems(p).length) { const q = quoteMapItems(raw); raw = q.text; fixed.lists += q.fixed; fixed.listPages++; changed = true; }
    if (why && !saysRunsCode(p)) {
      const next = addPrerequisite(raw, codeNote(why));
      if (next) { raw = next; fixed.code++; changed = true; } else fixed.codeLeft.push(slug);
    }
    if (changed) { fs.writeFileSync(file, raw); p = YAML.parse(raw); }
  }
  // Skills built from a mind's sources (item.yaml has minds:) have no worked example yet (docs/SOURCE-SKILLS-PRD.md).
  const itemFile = file.endsWith("/page.yaml") ? file.replace(/page\.yaml$/, "item.yaml") : `catalogue-items/orchestrators/${slug}/item.yaml`;
  // Skills rebuilt from sources (with minds or credits) get their example in a later test round.
  const itemText = fs.existsSync(itemFile) ? fs.readFileSync(itemFile, "utf8") : "";
  const fromMinds = /^minds:/m.test(itemText) || /^generated_from:/m.test(itemText) || (/^type: (agent|prompt)/m.test(itemText) && /^example_pending: true/m.test(itemText)) || (/^origin: rebuilt/m.test(itemText) && /^credits:/m.test(itemText) && /^example_pending: true/m.test(itemText));
  for (const f of newer ? REQUIRED_IMPORTED : REQUIRED) if ((f !== "example" || !fromMinds) && (p[f] == null || (Array.isArray(p[f]) && !p[f].length))) issues.push(`missing ${f}`);
  for (const field of new Set(mapItems(p).map((m) => m.field))) errors.push(`${field} has an item that is not plain text (quote lines containing ": ", or run with --fix)`);
  if (why && !saysRunsCode(p)) errors.push(`its skill runs code (${why}) but the page never says it needs an AI that can run code (run with --fix)`);
  if (p.job && !JOBS.includes(p.job)) issues.push(`unknown job "${p.job}"`);
  // Examples use a real, named business with public facts, never a made-up firm (the same names as marketplace/src/modules/packs/lint.ts).
  if (p.example && !String(p.example.business ?? "").trim()) issues.push("example names no business; use a real, named business with public facts");
  else if (p.example && /^(sprout|harbourside pottery|tidewell)$/i.test(String(p.example.business).trim())) issues.push(`example uses the made-up business "${p.example.business}"; use a real, named business with public facts`);
  // The example is test data now (tools/test-blocks.mjs runs its input); the page shows output_shape instead (docs/MINDS-PRD.md §2).
  if (p.example && !String(p.example.input ?? "").trim()) issues.push("empty example input");
  if (words(p.headline) > 18) issues.push(`headline ${words(p.headline)} words`);
  if (words(p.summary) > 25) issues.push(`summary ${words(p.summary)} words`);
  if (words(p.name) > 10) issues.push(`name ${words(p.name)} words`);
  if (/—/.test(raw)) issues.push("em dash");
  const low = raw.toLowerCase();
  for (const w of BANNED) if (new RegExp(`(^|[^a-z])${w.replace(/[-]/g, "\\-")}([^a-z]|$)`).test(low)) issues.push(`banned word "${w}"`);
  if (issues.length || errors.length) report.push({ slug, file, issues: [...errors, ...issues], errors });
}

if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 1));
else {
  for (const r of report) console.log(`${r.slug}: ${r.issues.join("; ")}`);
  if (FIX) console.log(`\nFixed ${fixed.lists} list lines on ${fixed.listPages} pages, and added the "can run code" line to ${fixed.code} pages.${fixed.codeLeft.length ? ` Left for a person (no room in Before you start): ${fixed.codeLeft.join(", ")}` : ""}`);
  const failing = report.filter((r) => r.errors.length);
  console.log(`\n${pages.length} pages (${pages.filter((x) => x.imported).length} imported), ${pages.length - report.length} clean, ${report.length} with issues, ${failing.length} that fail the check`);
}
if (report.some((r) => r.errors.length)) process.exitCode = 1;
