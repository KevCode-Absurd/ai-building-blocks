// Reads catalogue-items/ai-tools/*.yaml (one AI product per file, plus _use-cases.yaml and _categories.yaml),
// checks every field, and writes public/data/ai-tools.json for the /ai-tools pages.
// Runs after build-index.mjs, because every `blocks` slug must exist in public/data/blocks.json.
// Fails loudly (exit 1) on a missing field, an unknown id or slug, a banned word, an em dash or an exclamation mark.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const ROOT = path.resolve(process.env.CATALOGUE_ROOT || "../catalogue-items", "ai-tools");
const BLOCKS = path.resolve("public/data/blocks.json");
const WRITING = path.resolve("../docs/WRITING.md");
const OUT = path.resolve("public/data/ai-tools.json");

const PRICING_MODELS = ["free", "freemium", "subscription", "usage", "enterprise"];
const RUNS_IN = ["web", "desktop", "mobile", "api", "browser-extension", "slack", "chrome"];
const REQUIRED = ["slug", "name", "maker", "url", "promise", "use_cases", "categories", "what_it_does", "benefits", "best_for", "not_for", "pricing", "works_with", "runs_in", "blocks", "alternatives", "last_checked", "sources"];
// Words that are fine inside a product name even though the list bans them as filler.
const NAME_EXEMPT = [/\bShopify Magic\b/g, /\bshopify-magic\b/g];

const problems = [];
const fail = (msg) => problems.push(msg);

// The banned list lives in docs/WRITING.md ("Banned words: a, b (note), c."), so the rule has one home.
function bannedWords() {
  const text = fs.readFileSync(WRITING, "utf8");
  const line = text.split(/\r?\n/).find((l) => l.startsWith("Banned words:"));
  if (!line) throw new Error("docs/WRITING.md has no 'Banned words:' line");
  return line.replace(/^Banned words:/, "").replace(/\([^)]*\)/g, "").replace(/\.\s*$/, "").split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
}
const BANNED = bannedWords();
const bannedRe = new RegExp(`\\b(${BANNED.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[\\s-]")) .join("|")})\\b`, "i");

const texts = (v) => (Array.isArray(v) ? v.flatMap(texts) : v && typeof v === "object" ? Object.values(v).flatMap(texts) : typeof v === "string" ? [v] : []);
function checkCopy(where, value) {
  for (let s of texts(value)) {
    if (/^https?:\/\//.test(s)) continue;
    for (const re of NAME_EXEMPT) s = s.replace(re, "");
    const hit = s.match(bannedRe);
    if (hit) fail(`${where}: banned word "${hit[0]}" in "${s}"`);
    if (s.includes("—")) fail(`${where}: em dash in "${s}"`);
    if (s.includes("!")) fail(`${where}: exclamation mark in "${s}"`);
  }
}

const list = (file) => {
  const v = YAML.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
  if (!Array.isArray(v)) throw new Error(`${file} must be a list`);
  return v;
};
const useCases = list("_use-cases.yaml");
const categories = list("_categories.yaml");
for (const [file, items] of [["_use-cases.yaml", useCases], ["_categories.yaml", categories]]) {
  const seen = new Set();
  for (const it of items) {
    for (const k of ["id", "name", "blurb"]) if (!it[k]) fail(`${file}: an entry is missing ${k}`);
    if (seen.has(it.id)) fail(`${file}: duplicate id ${it.id}`);
    seen.add(it.id);
    checkCopy(`${file} ${it.id}`, it);
  }
}
const useCaseIds = new Set(useCases.map((u) => u.id));
const categoryIds = new Set(categories.map((c) => c.id));

// Blocks: slug -> { name, path } the same way the site builds a block's address (lib/data.ts kindOf/pathOf).
const index = JSON.parse(fs.readFileSync(BLOCKS, "utf8"));
const kindPath = (b) => (b.type === "mind" ? "minds" : b.type === "agent" ? "agents" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflows" : b.type === "prompt" ? "prompts" : "skills");
const blockBySlug = new Map(index.blocks.map((b) => [b.slug, { slug: b.slug, name: b.name, path: `/${kindPath(b)}/${b.slug}` }]));

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".yaml") && !f.startsWith("_")).sort();
const tools = [];
for (const file of files) {
  const where = `ai-tools/${file}`;
  let t;
  try { t = YAML.parse(fs.readFileSync(path.join(ROOT, file), "utf8")); } catch (e) { fail(`${where}: ${e.message.split("\n")[0]}`); continue; }
  if (!t || typeof t !== "object") { fail(`${where}: not a map`); continue; }
  for (const k of REQUIRED) if (t[k] === undefined || t[k] === null || t[k] === "") fail(`${where}: missing ${k}`);
  if (t.slug !== file.slice(0, -5)) fail(`${where}: slug "${t.slug}" must match the file name`);
  if (typeof t.promise === "string" && t.promise.trim().split(/\s+/).length > 14) fail(`${where}: promise is over 14 words`);
  if (/\b\d+(\.\d+)?\b/.test(t.name ?? "") && !/^v0$/i.test(t.name)) fail(`${where}: name "${t.name}" carries a version number`);
  const ids = (k, set, min, max) => {
    const v = t[k];
    if (!Array.isArray(v) || v.length < min || v.length > max) { fail(`${where}: ${k} needs ${min} to ${max} entries`); return; }
    for (const id of v) if (!set.has(id)) fail(`${where}: unknown ${k} id "${id}"`);
  };
  ids("use_cases", useCaseIds, 1, 4);
  ids("categories", categoryIds, 1, 3);
  const bullets = (k, min, max) => { if (!Array.isArray(t[k]) || t[k].length < min || t[k].length > max) fail(`${where}: ${k} needs ${min} to ${max} bullets`); };
  bullets("what_it_does", 3, 6); bullets("benefits", 3, 5); bullets("best_for", 2, 4); bullets("not_for", 1, 3);
  if (!t.pricing || !PRICING_MODELS.includes(t.pricing.model)) fail(`${where}: pricing.model must be one of ${PRICING_MODELS.join(", ")}`);
  if (!t.pricing?.from) fail(`${where}: pricing.from is missing`);
  if (!t.pricing?.note) fail(`${where}: pricing.note is missing`);
  if (!Array.isArray(t.runs_in) || !t.runs_in.length || t.runs_in.some((r) => !RUNS_IN.includes(r))) fail(`${where}: runs_in must be a non-empty subset of ${RUNS_IN.join(", ")}`);
  if (!Array.isArray(t.blocks)) fail(`${where}: blocks must be a list (empty is fine)`);
  else for (const s of t.blocks) if (!blockBySlug.has(s)) fail(`${where}: block "${s}" is not in public/data/blocks.json`);
  if (!Array.isArray(t.alternatives) || t.alternatives.length < 1 || t.alternatives.length > 4) fail(`${where}: alternatives needs 1 to 4 slugs`);
  if (String(t.last_checked) !== "2026-10-21" && !/^\d{4}-\d{2}-\d{2}$/.test(String(t.last_checked))) fail(`${where}: last_checked must be a date (YYYY-MM-DD)`);
  if (!Array.isArray(t.sources) || !t.sources.length || t.sources.some((s) => !/^https?:\/\//.test(s))) fail(`${where}: sources must list at least one URL`);
  if (!/^https?:\/\//.test(t.url ?? "")) fail(`${where}: url must start with https://`);
  const { sources, url, ...copy } = t;
  checkCopy(where, copy);
  tools.push(t);
}
// Cross-references between products (alternatives, works_with) resolve after every file is read.
const slugs = new Set(tools.map((t) => t.slug));
for (const t of tools) {
  for (const a of t.alternatives ?? []) if (!slugs.has(a)) fail(`ai-tools/${t.slug}.yaml: alternative "${a}" is not a product here`);
  if ((t.alternatives ?? []).includes(t.slug)) fail(`ai-tools/${t.slug}.yaml: lists itself as an alternative`);
}

if (problems.length) {
  console.error(`build-ai-tools: ${problems.length} problem${problems.length === 1 ? "" : "s"}\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

// What the site needs, and nothing else: works_with keeps a slug when it names a product here, else the plain name.
const out = {
  built: new Date().toISOString().slice(0, 10),
  useCases,
  categories,
  tools: tools.map((t) => ({
    slug: t.slug, name: t.name, maker: t.maker, url: t.url, promise: t.promise,
    useCases: t.use_cases, categories: t.categories,
    does: t.what_it_does, benefits: t.benefits, bestFor: t.best_for, notFor: t.not_for,
    pricing: { model: t.pricing.model, from: String(t.pricing.from), note: t.pricing.note },
    worksWith: (t.works_with ?? []).map((w) => (slugs.has(w) ? { slug: w, name: tools.find((x) => x.slug === w).name } : { name: String(w) })),
    runsIn: t.runs_in,
    blocks: t.blocks.map((s) => blockBySlug.get(s)),
    alternatives: t.alternatives,
    lastChecked: String(t.last_checked instanceof Date ? t.last_checked.toISOString().slice(0, 10) : t.last_checked),
    sources: t.sources,
  })),
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
const priced = out.tools.filter((t) => !/check the maker/i.test(t.pricing.from)).length;
const withBlocks = out.tools.filter((t) => t.blocks.length).length;
console.log(`build-ai-tools: ${out.tools.length} products, ${useCases.length} use cases, ${categories.length} categories, ${priced} with a confirmed price, ${withBlocks} with library blocks -> public/data/ai-tools.json (${kb} KB)`);
