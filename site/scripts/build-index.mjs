// Reads catalogue-items/** and writes the site's data: one small index for the library,
// plus each block's skill files under public/skills/<slug>/ (fetched only when a block page opens).
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const ROOT = path.resolve("../catalogue-items");
const OUT_DATA = "public/data";
const OUT_SKILLS = "public/skills";
fs.rmSync(OUT_SKILLS, { recursive: true, force: true });
fs.mkdirSync(OUT_DATA, { recursive: true });

const examples = JSON.parse(fs.readFileSync("public/examples/examples.json", "utf8"));
const formatIds = new Set(examples.formats.map((f) => f.id));
const types = YAML.parse(fs.readFileSync(path.join(ROOT, "_types.yaml"), "utf8"));
const typeDesc = {};
for (const group of Object.values(types)) for (const [id, t] of Object.entries(group)) typeDesc[id] = t.desc;

const asPorts = (list) =>
  (list ?? []).map((p) => (typeof p === "string" ? { type: p, required: true } : { type: p.type, required: p.required !== false }));

const blocks = [];
const problems = [];
for (const category of ["general", "ecommerce", "orchestrators"]) {
  const dir = path.join(ROOT, category);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir).sort()) {
    const folder = path.join(dir, slug);
    const yamlPath = path.join(folder, "item.yaml");
    const skillPath = path.join(folder, "SKILL.md");
    if (!fs.existsSync(yamlPath) || !fs.existsSync(skillPath)) { problems.push(`${category}/${slug}: missing item.yaml or SKILL.md`); continue; }
    let item;
    try { item = YAML.parse(fs.readFileSync(yamlPath, "utf8")); } catch (e) { problems.push(`${category}/${slug}: ${e.message.split("\n")[0]}`); continue; }
    if (item.slug !== slug) problems.push(`${category}/${slug}: slug in item.yaml is "${item.slug}"`);
    const skill = fs.readFileSync(skillPath, "utf8");
    const addon = path.join(folder, "boards", "ecommerce.md");
    const hasAddon = fs.existsSync(addon);
    fs.mkdirSync(path.join(OUT_SKILLS, slug), { recursive: true });
    fs.copyFileSync(skillPath, path.join(OUT_SKILLS, slug, "SKILL.md"));
    if (hasAddon) fs.copyFileSync(addon, path.join(OUT_SKILLS, slug, "ecommerce.md"));
    const steps = (item.steps ?? []).map((s) => ({ uses: s.uses, note: s.note ?? "" }));
    blocks.push({
      slug,
      name: item.name ?? slug,
      summary: item.summary ?? "",
      category: category === "orchestrators" ? "orchestrator" : category,
      boards: item.boards ?? [],
      type: item.type ?? "skill",
      role: item.role ?? "make",
      job: item.job ?? "ops",
      level: item.level ?? "intermediate",
      inputs: asPorts(item.inputs),
      outputs: asPorts(item.outputs),
      uses: item.uses ?? [],
      steps,
      example: formatIds.has(item.example) ? item.example : null,
      origin: item.origin ?? "own",
      version: String(item.version ?? "1.0.0"),
      words: skill.split(/\s+/).length,
      addon: hasAddon,
      added: fs.statSync(yamlPath).mtime.toISOString().slice(0, 10),
    });
  }
}

// How many workflows use each block: the honest "popular" signal until people can vote.
const bySlug = Object.fromEntries(blocks.map((b) => [b.slug, b]));
for (const b of blocks) b.usedIn = 0;
for (const b of blocks) for (const u of new Set([...b.uses, ...b.steps.map((s) => s.uses)])) if (bySlug[u] && u !== b.slug) bySlug[u].usedIn++;
for (const b of blocks) for (const u of [...b.uses, ...b.steps.map((s) => s.uses)]) if (!bySlug[u]) problems.push(`${b.slug}: uses unknown block "${u}"`);

const usedTypes = new Set(blocks.flatMap((b) => [...b.inputs, ...b.outputs].map((p) => p.type)));
const portTypes = Object.fromEntries([...usedTypes].sort().map((t) => [t, typeDesc[t] ?? null]));

fs.writeFileSync(path.join(OUT_DATA, "blocks.json"), JSON.stringify({ built: new Date().toISOString().slice(0, 10), portTypes, blocks }));
console.log(`${blocks.length} blocks (${blocks.filter((b) => b.category === "general").length} general, ${blocks.filter((b) => b.category === "ecommerce").length} ecommerce, ${blocks.filter((b) => b.category === "orchestrator").length} orchestrators)`);
if (problems.length) console.log("Problems:\n  " + problems.join("\n  "));
