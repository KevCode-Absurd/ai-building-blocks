// Check the page copy of catalogue items against docs/QUALITY-BAR.md.
//
//   node tools/check-pages.mjs [slug ...]   check the named items (no slugs = every item)
//   node tools/check-pages.mjs --tally      also print how many items fail each rule
//   node tools/check-pages.mjs --pointers   also list the "Skip it when" pointers that name no item we know
//   node tools/check-pages.mjs --fix-names  rewrite earlier item names in not_for to the current name, then check
//
// "Skip it when" (not_for) lines that name another item are linked on the site (tools/lib/not-for-links.mjs). A line that
// uses an earlier name of an item (its old page.yaml name, a display-copy alias, an old slug from renamed.json) fails here,
// because --fix-names can put the current name in. A "use the X" pointer that names no item is only counted, not failed:
// those need a person to pick the right item.
//
// Pages checked: catalogue-items/<group>/<slug>/page.yaml, tools/orchestrator-pages/<slug>.yaml (workflows),
// catalogue-items/ai-tools/<slug>.yaml and catalogue-items/minds/<slug>/mind.yaml (these two have to parse; AI tools also check
// first_result, needs, example and not_verified when present, and minds check not_for and output_sample when present).
// Prints the failures per slug and exits 1 when any item fails.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "../site/node_modules/yaml/dist/index.js";
import { linkNotFor, makeNameIndex, unresolvedPointers, findItemNames } from "./lib/not-for-links.mjs";
import { applyDisplayCopy } from "./lib/display-copy.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ITEMS = path.join(ROOT, "catalogue-items");
const FLOW_PAGES = path.join(ROOT, "tools", "orchestrator-pages");
const GROUPS = ["general", "ecommerce", "agents", "imported", "orchestrators", "stacks"];

const readYaml = (file) => YAML.parse(fs.readFileSync(file, "utf8"));
const dirs = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith("_")).map((e) => e.name) : []);

// Banned words come from docs/WRITING.md ("Banned words: a, b, c."), with a fallback list.
const FALLBACK_BANNED = ["utilize", "leverage", "seamless", "robust", "unlock", "elevate", "delve", "game-changer", "cutting-edge"];
function bannedWords() {
  try {
    const line = fs.readFileSync(path.join(ROOT, "docs", "WRITING.md"), "utf8").split(/\r?\n/).find((l) => /^Banned words:/i.test(l));
    if (!line) return FALLBACK_BANNED;
    // A word with a note in brackets ("powerful (as filler)") depends on context, so it is left out.
    const list = line.replace(/^Banned words:\s*/i, "").replace(/\.\s*$/, "").split(",").map((w) => w.trim()).filter((w) => w && !/[()]/.test(w));
    return list.length ? list : FALLBACK_BANNED;
  } catch { return FALLBACK_BANNED; }
}
const escapeRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// "game changer" and "game-changer" both match; a banned word also matches its endings ("leverages", "unlocking").
const BANNED = bannedWords().map((w) => ({ word: w, re: new RegExp(`(?<!\\w)${w.split(/[\s-]+/).map(escapeRe).join("[\\s-]?")}\\w*`, "i") }));

const flat = (v) => (typeof v === "string" ? v : Array.isArray(v) ? v.map(flat).join("\n") : v && typeof v === "object" ? Object.values(v).map(flat).join("\n") : v == null ? "" : String(v));
const wordCount = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const filled = (v) => (typeof v === "string" ? !!v.trim() : Array.isArray(v) ? v.some((x) => flat(x).trim()) : !!v);
const COPY_FIELDS = ["summary", "subhead", "explain", "when", "not_for", "you_give", "you_get", "how_to_use", "output_sample", "worked_example"];

// not_for and output_sample, on skill, prompt, agent, workflow and mind pages alike.
function fitFields(view, fail) {
  if (view.not_for !== undefined) {
    const n = view.not_for;
    if (!Array.isArray(n) || n.length < 1 || n.length > 5 || n.some((x) => typeof x !== "string" || !x.trim())) fail("not_for", "not_for must be 1 to 5 non-empty strings (quote any line that contains a colon, or YAML reads it as a mapping)");
  }
  if (view.worked_example !== undefined) fail("worked_example", "worked_example is retired: convert to output_sample (input, prerequisites, output)");
  if (view.output_sample !== undefined) {
    const o = view.output_sample;
    const strs = (v, min, max, label) => {
      if (!Array.isArray(v) || v.length < min || v.length > max || v.some((x) => typeof x !== "string" || !x.trim())) fail("output_sample", `output_sample.${label} must be ${min} to ${max} non-empty strings (quote any line that contains a colon)`);
    };
    if (!o || typeof o !== "object" || Array.isArray(o)) fail("output_sample", "output_sample must have input and output (and optionally prerequisites)");
    else {
      strs(o.input, 1, 6, "input");
      if (o.prerequisites !== undefined) strs(o.prerequisites, 1, 6, "prerequisites");
      if (!Array.isArray(o.output) || o.output.length < 1 || o.output.length > 12) fail("output_sample", "output_sample.output must be 1 to 12 items, each with name and contains");
      else o.output.forEach((it, i) => {
        if (!it || typeof it !== "object" || typeof it.name !== "string" || !it.name.trim() || typeof it.contains !== "string" || !it.contains.trim()) fail("output_sample", `output_sample.output[${i}] needs a non-empty name and contains`);
        else if (wordCount(it.contains) > 25) fail("output_sample", `output_sample.output[${i}].contains is ${wordCount(it.contains)} words (max 25)`);
      });
    }
  }
}

// Optional AI tool fields (first_result, needs, example, not_verified): shape only, plus no em dash.
function toolFields(t) {
  const fails = [];
  const fail = (rule, msg) => fails.push({ rule, msg });
  const strList = (v) => Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string" && x.trim());
  const hint = " (quote any line that contains a colon)";
  if (t.first_result !== undefined) {
    const r = t.first_result;
    const ok = Array.isArray(r) ? strList(r) : r && typeof r === "object" && Object.keys(r).length > 0 && Object.values(r).every(strList);
    if (!ok) fail("first_result", "first_result must be a list of steps, or a map of way in to a list of steps, each step a non-empty string" + hint);
  }
  if (t.needs !== undefined && !strList(t.needs)) fail("needs", "needs must be a list of non-empty strings" + hint);
  if (t.not_verified !== undefined && !strList(t.not_verified)) fail("not_verified", "not_verified must be a list of non-empty strings" + hint);
  if (t.example !== undefined) {
    const e = t.example;
    if (!e || typeof e !== "object" || Array.isArray(e)) fail("example", "example must be a map with task, cost and reply");
    else {
      const keys = Object.keys(e);
      for (const k of keys) if (!["task", "cost", "reply"].includes(k)) fail("example", `example.${k} is not a known key (task, cost, reply)`);
      for (const k of ["task", "cost", "reply"]) if (e[k] !== undefined && (typeof e[k] !== "string" || !e[k].trim())) fail("example", `example.${k} must be a non-empty string`);
      if (!["task", "cost", "reply"].some((k) => typeof e[k] === "string" && e[k].trim())) fail("example", "example needs at least one of task, cost, reply");
    }
  }
  for (const f of ["first_result", "needs", "example", "not_verified"]) if (flat(t[f]).includes("—")) fail("em-dash", `${f} has an em dash`);
  return fails;
}

function checkPage(page, item, type) {
  const fails = [];
  const fail = (rule, msg) => fails.push({ rule, msg });
  if (!page || typeof page !== "object") { fail("parse", "page is empty or not a mapping"); return fails; }
  // The site reads name and summary from item.yaml when the page has none.
  const view = { ...page, name: page.name ?? item?.name, summary: page.summary ?? item?.summary };
  if (["skill", "prompt", "agent"].includes(type)) {
    for (const f of ["name", "headline", "summary", "subhead", "you_give", "you_get", "how_to_use"]) if (!filled(view[f])) fail("missing", `${f} is missing or empty`);
  }
  fitFields(view, fail);
  if (typeof view.summary === "string" && view.summary.length > 160) fail("summary", `summary is ${view.summary.length} characters (max 160)`);
  for (const f of COPY_FIELDS) {
    const text = flat(view[f]);
    if (!text) continue;
    if (text.includes("—")) fail("em-dash", `${f} has an em dash`);
    for (const b of BANNED) { const m = text.match(b.re); if (m) fail("banned-word", `${f} uses "${m[0]}" (banned: ${b.word})`); }
  }
  return fails;
}

// Every item: { slug, group, file, type, item, itemError, hasItemFile, parseOnly }
function collect() {
  const out = [];
  for (const g of GROUPS) {
    for (const slug of dirs(path.join(ITEMS, g))) {
      const itemFile = path.join(ITEMS, g, slug, "item.yaml");
      let item = null, itemError = null;
      if (fs.existsSync(itemFile)) { try { item = readYaml(itemFile); } catch (e) { itemError = e.message.split(/\r?\n/)[0]; } }
      const type = item?.type ?? (g === "agents" ? "agent" : g === "orchestrators" ? "workflow" : "skill");
      const file = [path.join(ITEMS, g, slug, "page.yaml"), path.join(FLOW_PAGES, `${slug}.yaml`)].find((f) => fs.existsSync(f)) ?? null;
      out.push({ slug, group: g, file, type, item, itemError, hasItemFile: fs.existsSync(itemFile) });
    }
  }
  // Workflow pages with no folder under catalogue-items.
  if (fs.existsSync(FLOW_PAGES)) for (const f of fs.readdirSync(FLOW_PAGES)) {
    if (!f.endsWith(".yaml") || f.startsWith("_")) continue;
    const slug = f.slice(0, -5);
    if (!out.some((o) => o.slug === slug)) out.push({ slug, group: "orchestrator-pages", file: path.join(FLOW_PAGES, f), type: "workflow", item: null, hasItemFile: false });
  }
  const toolsDir = path.join(ITEMS, "ai-tools");
  if (fs.existsSync(toolsDir)) for (const f of fs.readdirSync(toolsDir)) if (f.endsWith(".yaml") && !f.startsWith("_")) out.push({ slug: f.slice(0, -5), group: "ai-tools", file: path.join(toolsDir, f), type: "ai-tool", parseOnly: true });
  for (const slug of dirs(path.join(ITEMS, "minds"))) {
    const file = path.join(ITEMS, "minds", slug, "mind.yaml");
    if (fs.existsSync(file)) out.push({ slug, group: "minds", file, type: "mind", parseOnly: true });
  }
  return out;
}

function checkItem(it) {
  const fails = [];
  if (it.itemError) fails.push({ rule: "parse", msg: `item.yaml does not parse: ${it.itemError}` });
  if (!it.file) {
    // A workflow may have no page of its own; the site builds it from item.yaml.
    if (["skill", "prompt", "agent"].includes(it.type) && it.hasItemFile) fails.push({ rule: "missing", msg: "no page.yaml" });
    return fails;
  }
  let page;
  try { page = readYaml(it.file); } catch (e) { fails.push({ rule: "parse", msg: `${path.basename(it.file)} does not parse: ${e.message.split(/\r?\n/)[0]}` }); return fails; }
  if (it.parseOnly) {
    if (!page || typeof page !== "object") return [{ rule: "parse", msg: `${path.basename(it.file)} is not a mapping` }];
    if (it.type === "ai-tool") return fails.concat(toolFields(page));
    const found = [];
    fitFields(page, (rule, msg) => found.push({ rule, msg }));
    return fails.concat(found);
  }
  return fails.concat(checkPage(page, it.item, it.type));
}

// Every item a not_for line can point to, with its current name (display-copy.yaml wins, as on the site), its earlier
// names and its page address. Items in quarantine.yaml have no page, so nothing links to them.
function nameTargets(items) {
  const copy = fs.existsSync(path.join(ITEMS, "display-copy.yaml")) ? readYaml(path.join(ITEMS, "display-copy.yaml")) ?? {} : {};
  const held = fs.existsSync(path.join(ITEMS, "quarantine.yaml")) ? new Set(Object.keys(readYaml(path.join(ITEMS, "quarantine.yaml")) ?? {})) : new Set();
  const kind = (it) => (it.type === "mind" ? "minds" : it.type === "agent" || it.group === "agents" ? "agents" : it.group === "orchestrators" || it.group === "orchestrator-pages" || ["workflow", "routine"].includes(it.type) ? "workflows" : it.type === "prompt" ? "prompts" : "skills");
  const out = [];
  for (const it of items) {
    if (held.has(it.slug) || it.type === "ai-tool" || !it.file) continue;
    let page = null;
    try { page = readYaml(it.file); } catch { continue; }
    if (!page || typeof page !== "object") continue;
    const base = it.type === "mind" ? page.name : page.name ?? it.item?.name;
    if (typeof base !== "string" || !base.trim()) continue;
    const edited = applyDisplayCopy({ slug: it.slug, name: base }, { name: base }, copy[it.slug]);
    out.push({ slug: it.slug, name: edited.page.name, aliases: [...edited.aliases, ...(it.item?.name && it.item.name !== edited.page.name ? [it.item.name] : [])], href: `/${kind(it)}/${it.slug}` });
  }
  return out;
}
const renamedMap = () => { try { return JSON.parse(fs.readFileSync(path.join(ITEMS, "renamed.json"), "utf8")); } catch { return {}; } };

// Rewrites the earlier names in one page file's not_for, keeping the file's own quoting and line endings where it can.
function fixNames(file, index, slug) {
  const raw = fs.readFileSync(file, "utf8");
  const doc = YAML.parseDocument(raw);
  const seq = doc.get("not_for", true);
  if (!seq || !Array.isArray(seq.items)) return 0;
  const edits = [];
  let fixed = 0;
  for (const node of seq.items) {
    if (!node || typeof node.value !== "string" || !node.range) continue;
    const hits = findItemNames(node.value, index, slug).filter((h) => h.how === "old");
    if (!hits.length) continue;
    const [start, end] = node.range;
    let src = raw.slice(start, end);
    const plain = hits.every((h) => src.split(h.said).length === 2);
    if (plain) for (const h of hits) src = src.replace(h.said, h.name);
    else src = JSON.stringify(linkNotFor([node.value], index, slug).lines[0]);
    edits.push([start, end, src]);
    fixed += hits.length;
  }
  if (!edits.length) return 0;
  let out = raw;
  for (const [start, end, src] of edits.sort((a, b) => b[0] - a[0])) out = out.slice(0, start) + src + out.slice(end);
  // A rewrite must never change anything but those lines.
  const before = YAML.parse(raw), after = YAML.parse(out);
  if (JSON.stringify({ ...before, not_for: null }) !== JSON.stringify({ ...after, not_for: null })) throw new Error(`${file}: fix touched more than not_for`);
  fs.writeFileSync(file, out);
  return fixed;
}

const args = process.argv.slice(2);
const tally = args.includes("--tally");
const wanted = args.filter((a) => !a.startsWith("--"));
const all = collect();
const picked = wanted.length ? all.filter((i) => wanted.includes(i.slug)) : all;
for (const w of wanted) if (!picked.some((i) => i.slug === w)) { console.error(`No item named "${w}".`); process.exitCode = 1; }
const nameIndex = makeNameIndex(nameTargets(all), renamedMap());
if (args.includes("--fix-names")) {
  let n = 0, files = 0;
  for (const it of picked) if (it.file && !it.parseOnly) { const k = fixNames(it.file, nameIndex, it.slug); if (k) { n += k; files++; } }
  console.log(`Put the current name in for ${n} earlier item names on ${files} pages.`);
}
const pointerStats = { lines: 0, linked: 0, items: 0, old: 0, unmatched: [] };
// not_for lines: the earlier names they use (fixable, so they fail) and the pointers that name no item (counted only).
function pointerFails(it) {
  if (!it.file || it.type === "ai-tool") return [];
  let page;
  try { page = readYaml(it.file); } catch { return []; }
  const lines = Array.isArray(page?.not_for) ? page.not_for.filter((x) => typeof x === "string") : [];
  const fails = [];
  for (const line of lines) {
    pointerStats.lines++;
    const found = findItemNames(line, nameIndex, it.slug);
    if (found.length) { pointerStats.linked++; pointerStats.items += found.length; }
    for (const f of found.filter((x) => x.how === "old")) { pointerStats.old++; fails.push({ rule: "not-for-name", msg: `not_for says "${f.said}": the item is now called "${f.name}" (node tools/check-pages.mjs --fix-names)` }); }
    for (const u of unresolvedPointers(line, found)) pointerStats.unmatched.push(`${it.slug}: ${u}`);
  }
  return fails;
}
let failing = 0;
const rules = {};
for (const it of picked) {
  const fails = checkItem(it).concat(pointerFails(it));
  if (!fails.length) continue;
  failing++;
  for (const r of new Set(fails.map((f) => f.rule))) rules[r] = (rules[r] ?? 0) + 1;
  console.log(`${it.slug} (${it.group})`);
  for (const f of fails) console.log(`  - ${f.msg}`);
}
console.log(`\n${picked.length - failing} of ${picked.length} items pass, ${failing} fail.`);
console.log(`not_for: ${pointerStats.lines} lines, ${pointerStats.linked} link to an item (${pointerStats.items} links), ${pointerStats.old} use an earlier name, ${pointerStats.unmatched.length} "use the ..." pointers name no item we know.`);
if (args.includes("--pointers")) for (const u of pointerStats.unmatched) console.log(`  unmatched: ${u}`);
if (tally && failing) console.log(Object.entries(rules).sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r}: ${n}`).join(", "));
if (failing || process.exitCode) process.exit(1);
