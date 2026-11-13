// Merges curated toolbox picks (one JSON file per group of modules: { "<CODE>": [{ ref, type, use, when, tune, cards }] })
// into knowledge/<vertical>/toolbox.json, checking every ref and card id:
//
//   node scripts/merge-vertical-toolbox.mjs --vertical=ecommerce <group-a.json> <group-b.json> ...
//
// A library ref must name a folder in catalogue-items; a local ref must be vendored under knowledge/<vertical>/vendor;
// card ids must exist (unknown ones are dropped with a note). Duplicate refs inside a module keep the first.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const vertical = process.argv.find(a => a.startsWith("--vertical="))?.split("=")[1] ?? "ecommerce";
const inputs = process.argv.slice(2).filter(a => !a.startsWith("--"));
const DIR = path.join(ROOT, "knowledge", vertical);
const v = JSON.parse(readFileSync(path.join(DIR, "vertical.json"), "utf8"));
const codes = new Set(v.modules.map(m => m.code));
const cardIds = new Set(readdirSync(path.join(DIR, "cards")).flatMap(f => JSON.parse(readFileSync(path.join(DIR, "cards", f), "utf8")).map(c => c.id)));
const CAT = path.resolve(ROOT, "..", "catalogue-items");
const groups = readdirSync(CAT, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const inLibrary = slug => groups.some(g => existsSync(path.join(CAT, g, slug))) || existsSync(path.join(CAT, "ai-tools", `${slug}.yaml`));
const vendored = ref => existsSync(path.join(DIR, "vendor", ref.split("/")[0], "skills", ref.split("/")[1] ?? "", "SKILL.md"));

const modules = {};
const notes = [];
for (const file of inputs) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  for (const [code, items] of Object.entries(data)) {
    if (!codes.has(code)) { notes.push(`${path.basename(file)}: unknown module ${code}`); continue; }
    for (const i of items) {
      const list = (modules[code] ??= []);
      if (list.some(x => x.ref === i.ref)) continue;
      const ok = i.ref?.startsWith("library:") ? inLibrary(i.ref.slice(8)) : i.ref?.startsWith("local:") ? vendored(i.ref.slice(6)) : i.ref?.startsWith("skill:") ? existsSync(path.join(DIR, "skills", i.ref.slice(6), "SKILL.md")) : false;
      if (!ok) { notes.push(`${code}: ${i.ref} not found, left out`); continue; }
      const cards = (i.cards ?? []).filter(c => cardIds.has(c));
      if (cards.length < (i.cards ?? []).length) notes.push(`${code}: ${i.ref} names unknown cards ${(i.cards ?? []).filter(c => !cardIds.has(c)).join(", ")}`);
      list.push({ ref: i.ref, type: i.type, use: i.use, when: String(i.when).replace(/—/g, ", ").trim(), tune: String(i.tune).replace(/—/g, ", ").trim(), cards });
    }
  }
}
const out = { schema: "ai-blocks-vertical-toolbox/1", reviewed: new Date().toISOString().slice(0, 10), modules: Object.fromEntries(v.modules.filter(m => modules[m.code]?.length).map(m => [m.code, modules[m.code]])) };
writeFileSync(path.join(DIR, "toolbox.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log(`toolbox.json: ${Object.values(out.modules).reduce((n, l) => n + l.length, 0)} items in ${Object.keys(out.modules).length} modules (${Object.entries(out.modules).map(([c, l]) => `${c} ${l.length}`).join(", ")})`);
for (const n of notes) console.log(`  note: ${n}`);
