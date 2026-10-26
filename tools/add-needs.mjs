// Writes two marked sections into every SKILL.md, worked out by tools/lib/needs.mjs from the blocks' inputs and outputs:
//   "## Before you start" (before "## What you need"): what's needed, the steps before this one with links,
//     which brand brain files to read, how to check for each thing, and the tools that do the job best.
//   "## After this" (after "## What you hand back"): the AI asks what's next and offers the paths from here.
// Run after `npm --prefix site run index` (it reads site/public/data/blocks.json). Running it again changes nothing.
// Usage: node tools/add-needs.mjs [--check]   (--check: exit 1 if any file would change)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { afterSection, beforeSection, planOf } from "./lib/needs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(ROOT, "site/package.json"));
const YAML = require("yaml");
const CHECK = process.argv.includes("--check");
const onlyAt = process.argv.indexOf("--only");
const ONLY = onlyAt >= 0 ? new Set((process.argv[onlyAt + 1] ?? "").split(",").filter(Boolean)) : null;
if (ONLY && !ONLY.size) throw new Error("--only needs one or more catalogue slugs.");

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "site/public/data/blocks.json"), "utf8"));
const all = data.blocks;
// blocks.json keeps ports short ("brief", "photos?"); turn them back into {type, required}.
const port = (p) => (typeof p === "string" ? { type: p.replace(/\?$/, ""), required: !p.endsWith("?") } : p);
// It also leaves out default values and sends a passed test as tested: 1; put those back the way lib/data.ts does.
const DEFAULTS = { category: "general", type: "skill", role: "make", job: "ops", level: "intermediate", thinking: "medium", origin: "own", version: "1.0.0" };
for (const b of all) {
  for (const [k, d] of Object.entries(DEFAULTS)) b[k] ??= d;
  b.inputs = (b.inputs ?? []).map(port); b.outputs = (b.outputs ?? []).map(port);
  if (b.tested === 1) b.tested = { result: "pass" };
  if (typeof b.usedIn === "number") b.usedIn = Array(b.usedIn).fill("");
}
const bySlug = Object.fromEntries(all.map((b) => [b.slug, b]));
const types = YAML.parse(fs.readFileSync(path.join(ROOT, "catalogue-items/_types.yaml"), "utf8"));
const desc = {};
for (const group of Object.values(types)) for (const [id, t] of Object.entries(group)) desc[id] = t.desc;
const describe = (t) => ({ label: t.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()), what: (desc[t] ?? t).replace(/\.$/, "").replace(/^./, (c) => c.toLowerCase()) });

const MARK = {
  before: ["<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->", "<!-- /needs -->"],
  after: ["<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->", "<!-- /next -->"],
};
const strip = (text, [start, end]) => {
  const i = text.indexOf(start.slice(0, 12));
  if (i < 0) return text;
  const j = text.indexOf(end, i);
  return text.slice(0, i) + text.slice(j + end.length).replace(/^(\r?\n){1,2}/, "");
};
function toolsOf(folder, slug) {
  for (const f of [path.join(folder, "page.yaml"), path.join(ROOT, "tools/orchestrator-pages", `${slug}.yaml`)]) {
    if (!fs.existsSync(f)) continue;
    try { return YAML.parse(fs.readFileSync(f, "utf8"))?.works_best_with?.tools ?? []; } catch { return []; }
  }
  return [];
}
/** Reviewed `next:` / `before:` slug lists (page.yaml, then item.yaml), the same override build-index.mjs honours. */
function linksOf(folder, slug) {
  const links = {};
  const page = [path.join(folder, "page.yaml"), path.join(ROOT, "tools/orchestrator-pages", `${slug}.yaml`)].find((f) => fs.existsSync(f));
  for (const f of [page, path.join(folder, "item.yaml")].filter(Boolean)) {
    if (!fs.existsSync(f)) continue;
    try { const y = YAML.parse(fs.readFileSync(f, "utf8")) ?? {}; for (const k of ["next", "before"]) if (!links[k] && Array.isArray(y[k])) links[k] = y[k]; } catch { /* unreadable: worked-out links */ }
  }
  return links;
}
/** Which lines are inside a ``` code block, so a "## " in an example is never taken for a heading. */
function fenced(lines) {
  let open = false;
  return lines.map((l) => { if (l.trimStart().startsWith("```")) { open = !open; return true; } return open; });
}
/** Puts `block` before the first line that starts with `heading` (or before the first "## " after the title). */
function insertBefore(text, nl, block, heading) {
  const lines = text.split(nl);
  const code = fenced(lines);
  let at = lines.findIndex((l, n) => !code[n] && l.startsWith(heading));
  if (at < 0) at = lines.findIndex((l, n) => n > 0 && !code[n] && l.startsWith("## "));
  if (at < 0) return text + nl + nl + block + nl;
  lines.splice(at, 0, ...block.split(nl), "");
  return lines.join(nl);
}
/** Puts `block` after the section that starts with `heading`: before the next "## ". */
function insertAfter(text, nl, block, heading) {
  const lines = text.split(nl);
  const code = fenced(lines);
  const h = lines.findIndex((l, n) => !code[n] && l.startsWith(heading));
  if (h < 0) return insertBefore(text, nl, block, "## Check before");
  let at = lines.findIndex((l, n) => n > h && !code[n] && l.startsWith("## "));
  if (at < 0) at = lines.length;
  while (at > h + 1 && lines[at - 1].trim() === "") at--;
  lines.splice(at, 0, "", ...block.split(nl));
  return lines.join(nl);
}

let changed = 0, withBefore = 0, withAfter = 0;
for (const category of ["general", "ecommerce", "orchestrators", "agents"]) {
  const dir = path.join(ROOT, "catalogue-items", category);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir)) {
    if (ONLY && !ONLY.has(slug)) continue;
    const file = path.join(dir, slug, "SKILL.md");
    const b = bySlug[slug];
    if (!fs.existsSync(file) || !b) continue;
    const itemPath = path.join(dir, slug, "item.yaml");
    if (fs.existsSync(itemPath) && YAML.parse(fs.readFileSync(itemPath, "utf8"))?.needs_mode === "manual") continue;
    const old = fs.readFileSync(file, "utf8");
    const nl = old.includes("\r\n") ? "\r\n" : "\n";
    let text = strip(strip(old, MARK.before), MARK.after);
    const plan = planOf(b, bySlug, all, describe, linksOf(path.join(dir, slug), slug));
    const before = beforeSection(plan, toolsOf(path.join(dir, slug), slug), nl);
    const after = afterSection(plan, nl);
    if (before) { text = insertBefore(text, nl, [MARK.before[0], before, MARK.before[1]].join(nl), "## What you need"); withBefore++; }
    if (after) { text = insertAfter(text, nl, [MARK.after[0], after, MARK.after[1]].join(nl), "## What you hand back"); withAfter++; }
    if (text !== old) {
      changed++;
      if (!CHECK) fs.writeFileSync(file, text);
    }
  }
}
console.log(`needs: ${withBefore} with "Before you start", ${withAfter} with "After this", ${changed} files ${CHECK ? "would change" : "changed"}`);
if (CHECK && changed) process.exit(1);
