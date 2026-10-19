// Moves every block to the new name its page.yaml asks for (new_slug), and updates every reference to it.
// Blocks: catalogue-items/<category>/<slug>/page.yaml. Workflows: tools/orchestrator-pages/<slug>.yaml.
// References are rewritten in catalogue-items, tools, mini-tools and the site source and tests. Run from the repo root:
//   node tools/apply-renames.mjs          (shows what would change)
//   node tools/apply-renames.mjs --write  (does it)
import fs from "node:fs";
import path from "node:path";
import YAML from "../site/node_modules/yaml/dist/index.js";

const WRITE = process.argv.includes("--write");
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const map = new Map(); // old slug -> { next, name, summary, folder?, pageFile? }
const all = new Set();
const problems = [];
const read = (f) => { try { return YAML.parse(fs.readFileSync(f, "utf8")); } catch (e) { problems.push(`${f}: ${e.message.split(String.fromCharCode(10))[0]}`); return {}; } };

for (const cat of ["general", "ecommerce"]) {
  for (const slug of fs.readdirSync(`catalogue-items/${cat}`)) {
    const folder = `catalogue-items/${cat}/${slug}`;
    if (!fs.existsSync(`${folder}/item.yaml`)) continue;
    all.add(slug);
    const pf = `${folder}/page.yaml`;
    if (!fs.existsSync(pf)) continue;
    const page = read(pf);
    if (page.new_slug && page.new_slug !== slug) map.set(slug, { next: page.new_slug, name: page.name, summary: page.summary, folder });
  }
}
const WF = "tools/orchestrator-pages";
for (const f of fs.existsSync(WF) ? fs.readdirSync(WF).filter((f) => f.endsWith(".yaml")) : []) {
  const slug = f.replace(/\.yaml$/, "");
  all.add(slug);
  const page = read(`${WF}/${f}`);
  if (page.new_slug && page.new_slug !== slug) map.set(slug, { next: page.new_slug, pageFile: `${WF}/${f}` });
}

// The new names must be valid, unique, and not collide with a block that keeps its name.
const final = new Map([...all].map((s) => [s, map.get(s)?.next ?? s]));
const seen = new Map();
for (const [old, next] of final) {
  if (!SLUG.test(next)) problems.push(`${old}: "${next}" is not a valid name`);
  if (seen.has(next)) problems.push(`"${next}" is wanted by both ${seen.get(next)} and ${old}`);
  seen.set(next, old);
}
if (problems.length) { console.log("Fix these first:\n  " + problems.join("\n  ")); process.exit(1); }

console.log(`${map.size} renames`);
for (const [old, r] of map) console.log(`  ${old} -> ${r.next}`);
if (!WRITE) { console.log("\nDry run. Add --write to apply."); process.exit(0); }

// 1. Rewrite references everywhere, in one pass per file, longest names first.
const olds = [...map.keys()].sort((a, b) => b.length - a.length);
const re = new RegExp(`(?<![a-z0-9-])(${olds.map((s) => s.replace(/[-]/g, "\\-")).join("|")})(?![a-z0-9-])`, "g");
const roots = ["catalogue-items", "tools", "mini-tools", "site/src", "site/e2e"];
const exts = new Set([".md", ".yaml", ".yml", ".mjs", ".js", ".ts", ".tsx", ".json", ".txt"]);
let files = 0;
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules") walk(p); continue; }
    if (!exts.has(path.extname(e.name)) || p.endsWith("apply-renames.mjs")) continue;
    const text = fs.readFileSync(p, "utf8");
    const next = text.replace(re, (m) => map.get(m).next);
    if (next !== text) { fs.writeFileSync(p, next); files++; }
  }
};
roots.forEach(walk);

// 2. Move the folders and workflow page files; record the old name; take name and summary from the page.
for (const [old, r] of map) {
  if (r.folder) {
    const to = path.join(path.dirname(r.folder), r.next);
    fs.renameSync(r.folder, to);
    const ip = path.join(to, "item.yaml");
    let item = fs.readFileSync(ip, "utf8");
    if (r.name) item = item.replace(/^name: .*$/m, `name: ${JSON.stringify(r.name)}`);
    if (r.summary) item = item.replace(/^summary: .*$/m, `summary: ${JSON.stringify(r.summary)}`);
    // Keep one renamed_from (the newest); older names live on in renamed.json.
    item = item.replace(/^renamed_from: .*\r?\n/gm, "").replace(/^(slug: .*)$/m, `$1\nrenamed_from: ${old}`);
    fs.writeFileSync(ip, item);
  } else {
    fs.renameSync(r.pageFile, path.join(WF, `${r.next}.yaml`));
  }
}

// 3. Old links keep working: the site redirects every old name in renamed.json to the new one.
const RF = "catalogue-items/renamed.json";
const redirects = fs.existsSync(RF) ? JSON.parse(fs.readFileSync(RF, "utf8")) : {};
for (const [old, r] of map) redirects[old] = r.next;
fs.writeFileSync(RF, JSON.stringify(Object.fromEntries(Object.entries(redirects).sort(([a], [b]) => a.localeCompare(b))), null, 2) + "\n");
console.log(`\nDone: ${map.size} renamed, references updated in ${files} files.`);
console.log("Next: npm --prefix site run index && node tools/make-orchestrators.mjs && npm --prefix site run index");
