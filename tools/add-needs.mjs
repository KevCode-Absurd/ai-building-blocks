// Writes two marked sections into every SKILL.md, worked out by tools/lib/needs.mjs from the blocks' inputs and outputs:
//   "## Before you start" (before "## What you need"): what's needed, the steps before this one with links,
//     which brand brain files to read, how to check for each thing, and the tools that do the job best.
//   "## After this" (after "## What you hand back", or the page's last output or hand-back section, or else at the end
//     above credits and sources; see insertAfterHandBack): the AI asks what's next and offers the paths from here.
// Imported skills get the same sections, marked as ours, and their item.yaml credit says we added them.
// Run after `npm --prefix site run index` (it reads site/public/data/blocks.json). Running it again changes nothing.
// Usage: node tools/add-needs.mjs [--check] [--dry] [--out <file>] [--only <slug,slug>]
//   --check: exit 1 if any file would change. --dry: write nothing, just count.
//   --out: write nothing; save the old and new sections of each page that would change to <file> (Markdown).
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
const outAt = process.argv.indexOf("--out");
const OUT = outAt >= 0 ? process.argv[outAt + 1] : null;
if (outAt >= 0 && !OUT) throw new Error("--out needs a file path.");
const DRY = CHECK || !!OUT || process.argv.includes("--dry");

const data = JSON.parse(fs.readFileSync(path.join(ROOT, "site/public/data/blocks.json"), "utf8"));
const all = data.blocks;
// blocks.json keeps ports short ("brief", "photos?"); turn them back into {type, required}.
const port = (p) => (typeof p === "string" ? { type: p.replace(/\?$/, ""), required: !p.endsWith("?") } : p);
// It also leaves out default values and sends a passed test as tested: 1; put those back the way lib/data.ts does.
const DEFAULTS = { category: "general", type: "skill", role: "make", job: "ops", level: "intermediate", thinking: "medium", origin: "own", version: "1.0.0" };
for (const b of all) {
  for (const [k, d] of Object.entries(DEFAULTS)) b[k] ??= d;
  b.inputs = (b.inputs ?? []).map(port); b.outputs = (b.outputs ?? []).map(port);
  // Steps come as "slug" or [slug, note]; lib/needs.mjs reads { uses }, as build-index.mjs passes them.
  b.steps = (b.steps ?? []).map((s) => (typeof s === "string" ? { uses: s } : Array.isArray(s) ? { uses: s[0], note: s[1] } : s));
  if (b.tested === 1) b.tested = { result: "pass" };
  if (typeof b.usedIn === "number") b.usedIn = Array(b.usedIn).fill("");
}
const bySlug = Object.fromEntries(all.map((b) => [b.slug, b]));
const types = YAML.parse(fs.readFileSync(path.join(ROOT, "catalogue-items/_types.yaml"), "utf8"));
const desc = {};
for (const group of Object.values(types)) for (const [id, t] of Object.entries(group)) desc[id] = t.desc;
// "A spreadsheet", "An audit report", "Meeting notes", "Source text": a label reads like the named ones in lib/needs.mjs.
const MASS = new Set(["source_text", "audio", "pdp_copy", "product_data"]);
const article = (t, words) => (MASS.has(t) || /s$/.test(t) ? words : `${/^[aeiou]/.test(words) ? "an" : "a"} ${words}`);
const describe = (t) => ({ label: article(t, t.replace(/_/g, " ")).replace(/^./, (c) => c.toUpperCase()), what: (desc[t] ?? t).replace(/\.$/, "").replace(/^./, (c) => c.toLowerCase()) });

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
  if (at < 0) return text.replace(/\s+$/, "") + nl + nl + block + nl;
  lines.splice(at, 0, ...block.split(nl), "");
  return lines.join(nl);
}
/** Headings of the part that says what the skill hands back, in the words pages use ("Output", "Hand back", "Deliverable"). */
const HAND_BACK = /^## (What you hand back|What to hand back|Hand back|Hand it back|Outputs?\b|Output (format|shape|files)|Deliverables?\b|Deliverable format|Deliver\b|What you get|What good output looks like|Intended result|Final check|Checks? before (you hand (it )?back|handing back)|Acceptance( checks)?\b|Completion checks|What you just built|What next|Next steps?\b)/i;
/** End matter that stays below "After this": credits, sources, references, licence. */
const END_MATTER = /^## (Credits?|Sources?|References|Method references|Licen[cs]e|Attribution|Acknowledg|Further reading)\b/i;
/** Sections "After this" never sits above: when to use it, how to work, the method. */
const BODY = /^## (When to use|When not to use|How to work|How you work|Method\s*$|Steps\s*$)/i;
/**
 * Puts the "After this" block at the end of the hand-back part, never above "When to use", "How to work" or the method:
 * after the last hand-back or output section ("## What you hand back", "## Output", "## Hand back", "## Final check",
 * "## What next"), or after the last of those body sections when one comes later; on a page with no hand-back heading,
 * at the end of the main content, above trailing credits, sources and licence. The place depends only on the page's
 * own headings (the generated sections are taken out first), so a rerun puts it in the same spot.
 */
function insertAfterHandBack(text, nl, block) {
  const lines = text.split(nl);
  const code = fenced(lines);
  const heads = lines.map((l, n) => (!code[n] && l.startsWith("## ") ? n : -1)).filter((n) => n >= 0);
  const last = (re) => [...heads].reverse().find((n) => re.test(lines[n]));
  const handBack = last(HAND_BACK);
  let at = lines.length;
  if (handBack !== undefined) { const h = Math.max(handBack, last(BODY) ?? -1); at = heads.find((n) => n > h) ?? lines.length; }
  else for (const n of [...heads].reverse()) { if (END_MATTER.test(lines[n])) at = n; else break; }
  while (at > 0 && lines[at - 1].trim() === "") at--;
  // Last on the page: one blank line above it and the file's final newline below, however many blank lines were there.
  if (lines.slice(at).every((l) => l.trim() === "")) return [...lines.slice(0, at), "", ...block.split(nl), ""].join(nl);
  lines.splice(at, 0, "", ...block.split(nl));
  return lines.join(nl);
}

/** The marked section in `text` (for --out), or "(none)". */
const section = (text, [start, end]) => {
  const i = text.indexOf(start.slice(0, 12));
  return i < 0 ? "(none)" : text.slice(text.indexOf("\n", i) + 1, text.indexOf(end, i)).replace(/\r/g, "").trim();
};
// Imported skills are someone else's work: their sections say so (the licences ask that changes are marked), a page
// that already has its own "Before you start" or "After this" keeps it, and the credit says what we added.
const IMPORTED_MARK = {
  before: ["<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->", MARK.before[1]],
  after: ["<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->", MARK.after[1]],
};
const ADDED = "We added Before you start and After this sections that link to other AI Blocks steps.";
/** The credit line for the copied skill, updated to say what we added (the item.yaml text, or null if unchanged). */
function creditAdded(yaml) {
  if (yaml.includes(ADDED)) return null;
  const next = yaml.replace(/^(\s*used: )(["']?)Copied (as it is, )?(under [^\r\n]*?)(["']?)(\r?\n)/m,
    (_, lead, q1, _asIs, rest, q2, end) => `${lead}${q1}Copied ${rest} ${ADDED}${q2}${end}`);
  return next === yaml ? null : next;
}
/** Whether the page has its own `## <heading>` outside code blocks. */
function hasOwn(text, heading) {
  const lines = text.split(/\r?\n/);
  const code = fenced(lines);
  return lines.some((l, n) => !code[n] && l.startsWith(`## ${heading}`));
}
const preview = [];
let changed = 0, withBefore = 0, withAfter = 0, credited = 0;
for (const category of ["general", "ecommerce", "orchestrators", "agents", "imported"]) {
  const dir = path.join(ROOT, "catalogue-items", category);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir)) {
    if (ONLY && !ONLY.has(slug)) continue;
    const file = path.join(dir, slug, "SKILL.md");
    const b = bySlug[slug];
    if (!fs.existsSync(file) || !b) continue;
    const itemPath = path.join(dir, slug, "item.yaml");
    const itemText = fs.existsSync(itemPath) ? fs.readFileSync(itemPath, "utf8") : "";
    const item = itemText ? YAML.parse(itemText) : null;
    if (item?.needs_mode === "manual") continue;
    const imported = category === "imported" || item?.origin === "imported";
    const mark = imported ? IMPORTED_MARK : MARK;
    const old = fs.readFileSync(file, "utf8");
    const nl = old.includes("\r\n") ? "\r\n" : "\n";
    let text = strip(strip(old, MARK.before), MARK.after);
    const plan = planOf(b, bySlug, all, describe, linksOf(path.join(dir, slug), slug));
    const before = imported && hasOwn(text, "Before you start") ? null : beforeSection(plan, toolsOf(path.join(dir, slug), slug), nl, { imported });
    const after = imported && hasOwn(text, "After this") ? null : afterSection(plan, nl);
    if (before) { text = insertBefore(text, nl, [mark.before[0], before, mark.before[1]].join(nl), "## What you need"); withBefore++; }
    if (after) { text = insertAfterHandBack(text, nl, [mark.after[0], after, mark.after[1]].join(nl)); withAfter++; }
    if (text !== old) {
      changed++;
      if (OUT) preview.push(`## ${category}/${slug}`, "", ...[MARK.before, MARK.after].flatMap((m) => [`### ${m === MARK.before ? "Before you start" : "After this"}: now`, "```md", section(old, m), "```", "### New", "```md", section(text, m), "```", ""]));
      if (!DRY) fs.writeFileSync(file, text);
    }
    const credit = imported && (before || after) ? creditAdded(itemText) : null;
    if (credit) { credited++; if (!DRY) fs.writeFileSync(itemPath, credit); }
  }
}
if (credited) console.log(`credits: ${credited} imported items ${DRY ? "would say" : "now say"} what we added`);
if (CHECK && credited) changed += credited;
if (OUT) fs.writeFileSync(OUT, [`# Needs preview: ${changed} pages would change`, "", ...preview].join("\n"));
console.log(`needs: ${withBefore} with "Before you start", ${withAfter} with "After this", ${changed} files ${DRY ? "would change" : "changed"}`);
if (CHECK && changed) process.exit(1);
