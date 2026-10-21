// Read, check and patch the first-read copy of block pages: name, summary, subhead (headline = name).
// Run from the repo root:
//   node tools/page-copy.mjs dump  <slugs.txt | slug ...>   compact view of each page (name, summary, subhead, explain, give, get, skill description)
//   node tools/page-copy.mjs check <slugs.txt | slug ...>   rule check; exit 1 if any page fails
//   node tools/page-copy.mjs patch <changes.json>           {"slug": {"name"?: "...", "summary"?: "...", "subhead"?: "..."}} written into page.yaml and item.yaml
// Rules checked (brand/COPYWRITING.md, docs/WRITING.md): name 2 to 7 words, no colon; summary <= 18 words with "Get";
// subhead 25 to 50 words, not equal to the summary; headline equals name; no em dashes, exclamation marks or banned words; grade <= 10.
import fs from "node:fs";
import path from "node:path";
import YAML from "../site/node_modules/yaml/dist/index.js";
import { grade } from "./readability.mjs";

const FOLDERS = ["general", "ecommerce", "imported", "agents"];
const BANNED = /\b(delve|foster|leverage|utili[sz]e|facilitate|empower|streamline|robust|cutting-edge|game.?changer|unlock|supercharge|harness|elevate|seamless|effortless|transformative|revolutioni[sz]e|paradigm|synergy|holistic|journey|ecosystem|best-in-class|world-class|next-level|magic)\b/i;
const words = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean).length;
const [cmd, ...rest] = process.argv.slice(2);

function find(slug) {
  for (const f of FOLDERS) { const d = path.join("catalogue-items", f, slug); if (fs.existsSync(path.join(d, "page.yaml"))) return d; }
  return null;
}
function slugs(args) {
  if (args.length === 1 && fs.existsSync(args[0]) && fs.statSync(args[0]).isFile() && !find(args[0])) return fs.readFileSync(args[0], "utf8").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
  return args;
}
const first = (s, n) => String(s ?? "").replace(/\s+/g, " ").trim().split(" ").slice(0, n).join(" ");
const desc = (dir) => { const f = path.join(dir, "SKILL.md"); if (!fs.existsSync(f)) return ""; const m = fs.readFileSync(f, "utf8").match(/^description:\s*(.*)$/m); return m ? m[1].replace(/^["']|["']$/g, "") : ""; };

if (cmd === "dump") {
  for (const slug of slugs(rest)) {
    const dir = find(slug); if (!dir) { console.log(`## ${slug}\n  NOT FOUND\n`); continue; }
    const p = YAML.parse(fs.readFileSync(path.join(dir, "page.yaml"), "utf8"));
    const i = YAML.parse(fs.readFileSync(path.join(dir, "item.yaml"), "utf8"));
    console.log(`## ${slug}  (${dir.split(path.sep)[1]}, ${i.type}, job ${p.job})`);
    console.log(`name: ${p.name}`);
    console.log(`summary (${words(p.summary)}w): ${p.summary}`);
    console.log(`subhead (${words(p.subhead)}w): ${p.subhead}`);
    console.log(`explain: ${first(p.explain, 70)}`);
    console.log(`give: ${(p.you_give ?? []).map((x) => first(x, 12)).join(" | ")}`);
    console.log(`get: ${(p.you_get ?? []).map((x) => first(x, 12)).join(" | ")}`);
    console.log(`skill description: ${first(desc(dir), 60)}`);
    console.log("");
  }
} else if (cmd === "check") {
  let bad = 0;
  for (const slug of slugs(rest)) {
    const dir = find(slug); if (!dir) { console.log(`${slug}: NOT FOUND`); bad++; continue; }
    const p = YAML.parse(fs.readFileSync(path.join(dir, "page.yaml"), "utf8"));
    const i = YAML.parse(fs.readFileSync(path.join(dir, "item.yaml"), "utf8"));
    const issues = [];
    const n = words(p.name); if (n < 2 || n > 7) issues.push(`name ${n} words`);
    if (/[:]/.test(p.name ?? "")) issues.push("name has a colon");
    if (words(p.summary) > 18) issues.push(`summary ${words(p.summary)} words`);
    if (!/\bget\b/i.test(p.summary ?? "")) issues.push("summary has no Get");
    const sw = words(p.subhead); if (sw < 25 || sw > 50) issues.push(`subhead ${sw} words`);
    if (String(p.subhead ?? "").trim() === String(p.summary ?? "").trim()) issues.push("subhead equals summary");
    if (String(p.headline ?? "").trim() !== String(p.name ?? "").trim()) issues.push("headline is not the name");
    if (String(i.name ?? "").trim() !== String(p.name ?? "").trim()) issues.push("item.yaml name differs");
    if (String(i.summary ?? "").trim() !== String(p.summary ?? "").trim()) issues.push("item.yaml summary differs");
    const text = [p.name, p.summary, p.subhead].join(" ");
    if (/—|–/.test(text)) issues.push("em dash");
    if (/!/.test(text)) issues.push("exclamation mark");
    const b = text.match(BANNED); if (b) issues.push(`banned word "${b[0]}"`);
    const g = grade([p.summary, p.subhead].join("\n")); if (g > 10) issues.push(`grade ${g}`);
    if (issues.length) { bad++; console.log(`${slug}: ${issues.join("; ")}`); }
  }
  console.log(bad ? `${bad} page(s) with issues` : "all clean");
  process.exit(bad ? 1 : 0);
} else if (cmd === "patch") {
  const changes = JSON.parse(fs.readFileSync(rest[0], "utf8"));
  let n = 0;
  for (const [slug, c] of Object.entries(changes)) {
    const dir = find(slug); if (!dir) { console.log(`${slug}: NOT FOUND, skipped`); continue; }
    const pf = path.join(dir, "page.yaml"), itf = path.join(dir, "item.yaml");
    const pd = YAML.parseDocument(fs.readFileSync(pf, "utf8"));
    const id = YAML.parseDocument(fs.readFileSync(itf, "utf8"));
    const set = (doc, k, v) => { if (v == null) return; const s = String(v).trim(); doc.set(k, s); };
    if (c.name) { set(pd, "name", c.name); set(pd, "headline", c.name); set(id, "name", c.name); }
    if (c.summary) { set(pd, "summary", c.summary); set(id, "summary", c.summary); }
    if (c.subhead) set(pd, "subhead", c.subhead);
    fs.writeFileSync(pf, pd.toString({ lineWidth: 0, flowCollectionPadding: false }));
    fs.writeFileSync(itf, id.toString({ lineWidth: 0, flowCollectionPadding: false }));
    n++;
  }
  console.log(`${n} page(s) patched`);
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(0, 8).join("\n"));
}
