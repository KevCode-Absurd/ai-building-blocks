// Copies an open-source skill set into a vertical's knowledge folder, so the vertical's agents can carry it:
//
//   node scripts/vendor-skills.mjs --vertical=ecommerce --name=meta-ads --from=<plugin folder> --repo=<url>
//
// Only text the agent reads is copied: each skills/<name>/SKILL.md (and the router <name>/SKILL.md), the shared
// references/*.md and the subagent definitions agents/*.md. Scripts stay in the original repository: every
// reference to scripts/<file> becomes a link to it. Paths between the copied files are rewritten to where they sit in
// a pack (knowledge/<vertical>/vendor/<name>/...), so no file names a path the pack lacks. The licence is kept
// beside the copy with a notice of the source and what changed (MIT asks for the copyright and permission notice).
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = n => process.argv.find(a => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const vertical = arg("vertical") ?? "ecommerce", name = arg("name"), from = arg("from"), repo = (arg("repo") ?? "").replace(/\/+$/, "");
if (!name || !from || !repo) { console.error("Usage: node scripts/vendor-skills.mjs --vertical=ecommerce --name=meta-ads --from=<plugin folder> --repo=<github url>"); process.exit(2); }
const licence = readFileSync(path.join(from, "LICENSE"), "utf8");
if (!/MIT License|Apache License|BSD/i.test(licence)) { console.error("Only permissive licences (MIT, Apache 2.0, BSD) may be vendored."); process.exit(1); }

const base = `knowledge/${vertical}/vendor/${name}`;
const OUT = path.join(ROOT, base);
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const files = new Map(); // path in the copy -> text
const add = (rel, src) => files.set(rel, readFileSync(src, "utf8").replace(/\r\n?/g, "\n"));
if (existsSync(path.join(from, name, "SKILL.md"))) add(`skills/${name}/SKILL.md`, path.join(from, name, "SKILL.md"));
for (const d of readdirSync(path.join(from, "skills")).sort()) if (existsSync(path.join(from, "skills", d, "SKILL.md"))) add(`skills/${d}/SKILL.md`, path.join(from, "skills", d, "SKILL.md"));
for (const dir of [path.join(from, name, "references"), path.join(from, "references")]) if (existsSync(dir)) for (const f of readdirSync(dir).filter(f => f.endsWith(".md")).sort()) add(`references/${f}`, path.join(dir, f));
if (existsSync(path.join(from, "agents"))) for (const f of readdirSync(path.join(from, "agents")).filter(f => f.endsWith(".md")).sort()) add(`agents/${f}`, path.join(from, "agents", f));

const rewrite = text => text
  // Shared references, wherever the skill says they are.
  .replace(/(?<![\w/.-])(?:\.\.\/)*(?:[\w-]+\/)?references\/([\w.-]+\.md)/g, (m, f) => files.has(`references/${f}`) ? `${base}/references/${f}` : m)
  .replace(/(?<![\w/.-])(?:\.\.\/)*agents\/([\w.-]+\.md)/g, (m, f) => files.has(`agents/${f}`) ? `${base}/agents/${f}` : m)
  .replace(/(?<![\w/.-])(?:\.\.\/)*skills\/([\w-]+)\/SKILL\.md/g, (m, d) => files.has(`skills/${d}/SKILL.md`) ? `${base}/skills/${d}/SKILL.md` : m)
  // Scripts and anything else in the plugin stay in its repository.
  .replace(/(?<![\w/.:-])(?:\.\.\/)*((?:scripts|evals|tests)\/[\w./-]+\.\w+)/g, (_, p) => `${repo}/blob/main/${p}`)
  // Any remaining reference folder ("references/") points at the copy.
  .replace(/(?<![\w/.-])(?:[\w-]+\/)?references\/(?=[\s`'")]|$)/gm, `${base}/references/`);

let n = 0;
for (const [rel, text] of files) {
  const out = path.join(OUT, ...rel.split("/"));
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, rewrite(text));
  n++;
}
writeFileSync(path.join(OUT, "LICENSE.md"), [
  `# Licence and source`, "",
  `These files come from ${repo} under the licence below. AI Blocks copied the skills, references and agent definitions`,
  `on 13 November 2026 and changed only the paths between them, so they work inside an AI Blocks agent pack; the scripts`,
  `stay in the original repository and are linked from the text. Each e-commerce agent's toolbox says when to use each`,
  `skill for an online store.`, "",
  "```text", licence.trim(), "```", "",
].join("\n"));
console.log(`vendored ${n} files from ${from} into ${base}`);
