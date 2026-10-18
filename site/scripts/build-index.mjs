// Reads catalogue-items/** and writes the site's data: one small index for the library,
// plus each block's skill files under public/skills/<slug>/ (fetched only when a block page opens).
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const ROOT = path.resolve("../catalogue-items");
const OUT_DATA = "public/data";
const OUT_SKILLS = "public/skills";
const OUT_PAGES = "public/data/pages";
const WORKFLOW_PAGES = path.resolve("../tools/orchestrator-pages");
fs.rmSync(OUT_SKILLS, { recursive: true, force: true });
fs.rmSync(OUT_PAGES, { recursive: true, force: true });
fs.mkdirSync(OUT_PAGES, { recursive: true });

// Until a block has its page written, it is filed under the job closest to its old group.
const TASK_FROM_JOB = { copy: "write-ad-copy", email: "write-ad-copy", ads: "make-image-ads", image: "make-image-ads", video: "make-video-ads", page: "write-landing-page", analysis: "read-ad-results", research: "understand-customers", brand: "brand-file", offer: "make-offer", organic: "grow-social", ops: "set-up-ai" };
// The first lines of the real example output, shown on the library card.
const peekOf = (page) => String(page?.example?.output ?? "").split(/\r?\n/).map((l) => l.trimEnd()).filter((l) => l.trim()).slice(0, 4).map((l) => (l.length > 64 ? l.slice(0, 63) + "…" : l)).join("\n");
const PAGE_FIELDS = ["headline", "subhead", "explain", "when", "you_give", "you_get", "how_to_use", "how_it_works", "output_shape", "example", "tweaks", "judge", "test", "improve", "terms"];

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
    const pagePath = [path.join(folder, "page.yaml"), path.join(WORKFLOW_PAGES, `${slug}.yaml`)].find((p) => fs.existsSync(p));
    let page = null;
    if (pagePath) { try { page = YAML.parse(fs.readFileSync(pagePath, "utf8")); } catch (e) { problems.push(`${category}/${slug}: page: ${e.message.split(/\r?\n/)[0]}`); } }
    if (page) {
      const out = Object.fromEntries(PAGE_FIELDS.filter((f) => page[f] != null).map((f) => [f, page[f]]));
      fs.writeFileSync(path.join(OUT_PAGES, `${slug}.json`), JSON.stringify(out));
    }
    blocks.push({
      slug,
      name: page?.name ?? item.name ?? slug,
      summary: page?.summary ?? item.summary ?? "",
      headline: page?.headline ?? "",
      peek: peekOf(page),
      task: page?.job ?? TASK_FROM_JOB[item.job] ?? "set-up-ai",
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

// Old names still work: the site sends an old link to the block's new page.
const renamedFile = path.join(ROOT, "renamed.json");
const renamed = fs.existsSync(renamedFile) ? Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(renamedFile, "utf8"))).filter(([, to]) => blocks.some((b) => b.slug === to))) : {};
fs.writeFileSync(path.join(OUT_DATA, "blocks.json"), JSON.stringify({ built: new Date().toISOString().slice(0, 10), portTypes, renamed, blocks }));
console.log(`${blocks.filter((b) => b.headline).length} of ${blocks.length} have a page`);
console.log(`${blocks.length} blocks (${blocks.filter((b) => b.category === "general").length} general, ${blocks.filter((b) => b.category === "ecommerce").length} ecommerce, ${blocks.filter((b) => b.category === "orchestrator").length} orchestrators)`);
if (problems.length) console.log("Problems:\n  " + problems.join("\n  "));
