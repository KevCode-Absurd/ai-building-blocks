// Reads catalogue-items/** and writes the site's data: one small index for the library,
// plus each block's skill files under public/skills/<slug>/ (fetched only when a block page opens).
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { Marked } from "marked";

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
const PAGE_FIELDS = ["headline", "subhead", "explain", "when", "you_give", "you_get", "how_to_use", "how_it_works", "output_shape", "tweaks", "judge", "test", "improve", "terms", "works_best_with"];

const types = YAML.parse(fs.readFileSync(path.join(ROOT, "_types.yaml"), "utf8"));
const typeDesc = {};
for (const group of Object.values(types)) for (const [id, t] of Object.entries(group)) typeDesc[id] = t.desc;

const asPorts = (list) =>
  (list ?? []).map((p) => (typeof p === "string" ? { type: p, required: true } : { type: p.type, required: p.required !== false }));

// Markdown is turned into HTML here, at build time, so the site ships no Markdown library.
// Raw HTML in a file is escaped: files are data, never markup we trust.
const md = new Marked({ gfm: true, renderer: { html: ({ text }) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;") } });
// The skill file as shown on the page: no frontmatter, and no <!-- markers --> the section tools leave.
const bodyOf = (t) => t.replace(/\r\n?/g, "\n").replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/^<!--[\s\S]*?-->\n?/gm, "");

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
    fs.mkdirSync(path.join(OUT_SKILLS, slug), { recursive: true });
    fs.copyFileSync(skillPath, path.join(OUT_SKILLS, slug, "SKILL.md"));
    // Reference files and a licence travel with the skill, so a download installs complete.
    const refDir = path.join(folder, "references");
    const files = [...(fs.existsSync(refDir) ? fs.readdirSync(refDir).filter((f) => f.endsWith(".md")).sort().map((f) => `references/${f}`) : []), ...(fs.existsSync(path.join(folder, "LICENSE")) ? ["LICENSE"] : [])];
    for (const f of files) { fs.mkdirSync(path.dirname(path.join(OUT_SKILLS, slug, f)), { recursive: true }); fs.copyFileSync(path.join(folder, f), path.join(OUT_SKILLS, slug, f)); }
    const steps = (item.steps ?? []).map((s) => ({ uses: s.uses, note: s.note ?? "" }));
    const pagePath = [path.join(folder, "page.yaml"), path.join(WORKFLOW_PAGES, `${slug}.yaml`)].find((p) => fs.existsSync(p));
    let page = null;
    if (pagePath) { try { page = YAML.parse(fs.readFileSync(pagePath, "utf8")); } catch (e) { problems.push(`${category}/${slug}: page: ${e.message.split(/\r?\n/)[0]}`); } }
    if (page) {
      const out = Object.fromEntries(PAGE_FIELDS.filter((f) => page[f] != null).map((f) => [f, page[f]]));
      // Public sources a block was built from, shown on its page. Only http(s) links are kept.
      const credits = (item.credits ?? []).filter((c) => c && c.title && (!c.url || /^https?:\/\//.test(c.url))).map((c) => ({ title: String(c.title), by: c.by ? String(c.by) : "", url: c.url ? String(c.url) : "", used: c.used ? String(c.used) : "" }));
      if (credits.length) out.credits = credits;
      out.html = { explain: page.explain ? md.parse(String(page.explain)) : "", skill: md.parse(bodyOf(skill)) };
      fs.writeFileSync(path.join(OUT_PAGES, `${slug}.json`), JSON.stringify(out));
    }
    blocks.push({
      slug,
      name: page?.name ?? item.name ?? slug,
      summary: page?.summary ?? item.summary ?? "",
      headline: page?.headline ?? "",
      task: page?.job ?? TASK_FROM_JOB[item.job] ?? "set-up-ai",
      category: category === "orchestrators" ? "orchestrator" : category,
      boards: item.boards ?? [],
      type: item.type ?? "skill",
      role: item.role ?? "make",
      job: item.job ?? "ops",
      level: item.level ?? "intermediate",
      // Workflows run several skills in a row, so they always ask for the strongest model.
      thinking: ["low", "medium", "high"].includes(page?.thinking) ? page.thinking : category === "orchestrators" || item.type === "workflow" ? "high" : "medium",
      thinkingWhy: page?.thinking_why ?? (category === "orchestrators" || item.type === "workflow" ? "It runs several skills in a row. Give it your strongest model." : ""),
      inputs: asPorts(item.inputs),
      outputs: asPorts(item.outputs),
      uses: item.uses ?? [],
      steps,
      origin: item.origin ?? "own",
      // Last test run on the example business (tools/test-blocks.mjs). Only a pass is shown on the page.
      tested: item.tested ? { on: String(item.tested.on), result: item.tested.result, business: item.tested.business ?? "sprout" } : null,
      version: String(item.version ?? "1.0.0"),
      words: skill.split(/\s+/).length,
      // The same look in the other format: a video block's image twin, or the other way round.
      twin: item.twin ?? null,
      files,
      added: fs.statSync(yamlPath).mtime.toISOString().slice(0, 10),
    });
  }
}

// Minds (catalogue-items/minds, docs/MINDS-PRD.md): a public figure's ideas and voice. Each built one has a mind.yaml and
// a SKILL.md made by tools/build-minds.mjs; its page is put together here from mind.yaml and knowledge.md.
const MINDS = path.join(ROOT, "minds");
const roster = fs.existsSync(path.join(MINDS, "_roster.yaml")) ? YAML.parse(fs.readFileSync(path.join(MINDS, "_roster.yaml"), "utf8")) : { areas: {}, minds: [] };
for (const r of roster.minds) {
  const folder = path.join(MINDS, r.slug);
  const yamlPath = path.join(folder, "mind.yaml"), skillPath = path.join(folder, "SKILL.md");
  if (!fs.existsSync(yamlPath) || !fs.existsSync(skillPath)) continue;
  let m;
  try { m = YAML.parse(fs.readFileSync(yamlPath, "utf8")); } catch (e) { problems.push(`minds/${r.slug}: ${e.message.split("\n")[0]}`); continue; }
  const skill = fs.readFileSync(skillPath, "utf8");
  fs.mkdirSync(path.join(OUT_SKILLS, r.slug), { recursive: true });
  fs.copyFileSync(skillPath, path.join(OUT_SKILLS, r.slug, "SKILL.md"));
  const first = m.name.split(" (")[0];
  const knowledge = fs.existsSync(path.join(folder, "knowledge.md")) ? fs.readFileSync(path.join(folder, "knowledge.md"), "utf8").replace(/\r\n?/g, "\n") : "";
  // Their big ideas: the ### headings under "Core ideas", each with its first sentence, tags removed.
  const core = knowledge.split(/^## /m).find((s) => /^Core ideas/i.test(s)) ?? "";
  const ideas = core.split(/^### /m).slice(1).map((s) => {
    const [title, ...rest] = s.split("\n");
    const text = rest.join(" ").replace(/\[S\d+\]/g, "").replace(/\s+/g, " ").trim();
    return { title: title.trim(), text: (text.match(/^.*?[.!?](\s|$)/)?.[0] ?? text).trim() };
  }).filter((x) => x.title);
  const page = {
    headline: m.name,
    subhead: m.summary,
    explain: `${m.known_for}\n\nThis is an AI playing ${first} from their public work: ${m.sources.length} public sources, listed below, written into a data set of what they knew and believed and a profile of how they think and talk. It isn't ${first}, and ${first} hasn't endorsed it.${m.living ? ` ${first} is alive, so views can change; it was last checked on ${String(m.last_checked).slice(0, 10)}.` : ""}`,
    when: m.use_cases,
    you_give: ["Your task or question", "Your facts, numbers or draft (optional; it asks once if they matter)", "A role for them, such as \"my investor\" (optional)"],
    you_get: [`The answer or the work, in ${first}'s voice, using their ideas by name`, "Anything that goes beyond their public record, marked", "One suggested next step"],
    how_to_use: ["Add the skill to your AI, or copy it and paste it into a chat.", `Ask your question or give the task, such as "${m.use_cases[0]}".`, "Paste the facts that matter.", `To hear ${first} argue with other minds, put them on an advisory council.`],
    output_shape: `<the answer or the piece of work, in ${first}'s voice>\n  <the recommendation, or the work itself, first>\n  <the reasoning, using ${first}'s ideas by name>\n  <[beyond the record] wherever it goes past what they said or did>\n\nMISSING: <facts you didn't give, or none>\nNEXT: <one suggested next step>`,
    ideas,
    seats: m.seats,
    pairs: (m.pairs_with ?? []).filter((s) => roster.minds.some((x) => x.slug === s)),
    credits: m.sources.filter((s) => s.title).map((s) => ({ title: String(s.title), by: s.by ? String(s.by) : "", url: s.url && /^https?:\/\//.test(s.url) ? String(s.url) : "", used: "" })),
  };
  page.html = { explain: md.parse(page.explain), skill: md.parse(bodyOf(skill)) };
  fs.writeFileSync(path.join(OUT_PAGES, `${r.slug}.json`), JSON.stringify(page));
  blocks.push({
    slug: r.slug, name: m.name, summary: m.summary, headline: m.name,
    task: "think-with-minds", category: "mind", boards: [], type: "mind", role: "make", job: "minds", level: "beginner",
    thinking: "medium", thinkingWhy: "It plays one voice from a written data set. Use your strongest model when the stakes are high.",
    seats: m.seats.map((s) => s.seat), area: m.area, also: m.also ?? [], years: m.years ?? "", living: !!m.living,
    inputs: [{ type: "question", required: true }], outputs: [{ type: "mind_view", required: true }],
    uses: [], steps: [], origin: "own", tested: null, version: String(m.version ?? "1.0.0"), words: skill.split(/\s+/).length,
    twin: null, files: [], added: fs.statSync(yamlPath).mtime.toISOString().slice(0, 10),
  });
}

// How many workflows use each block: the honest "popular" signal until people can vote.
const bySlug = Object.fromEntries(blocks.map((b) => [b.slug, b]));
for (const b of blocks) b.usedIn = 0;
for (const b of blocks) for (const u of new Set([...b.uses, ...b.steps.map((s) => s.uses)])) if (bySlug[u] && u !== b.slug) bySlug[u].usedIn++;
for (const b of blocks) for (const u of [...b.uses, ...b.steps.map((s) => s.uses)]) if (!bySlug[u]) problems.push(`${b.slug}: uses unknown block "${u}"`);

// A twin is named on one side only; fill in the other side and check both exist.
for (const b of blocks) if (b.twin) {
  const t = bySlug[b.twin];
  if (!t) { problems.push(`${b.slug}: twin "${b.twin}" isn't a block`); b.twin = null; continue; }
  if (t.twin && t.twin !== b.slug) problems.push(`${t.slug}: has two twins (${t.twin}, ${b.slug})`);
  t.twin = b.slug;
}

// One finished picture for a visual skill (catalogue-items/example-images.yaml, files in public/examples/).
const looksFile = path.join(ROOT, "example-images.yaml");
if (fs.existsSync(looksFile)) {
  const looks = YAML.parse(fs.readFileSync(looksFile, "utf8"));
  for (const [slug, name] of Object.entries(looks.blocks ?? {})) {
    const img = looks.images?.[name];
    const file = `public/examples/${name}.webp`;
    if (!bySlug[slug]) problems.push(`example-images: "${slug}" isn't a block`);
    else if (!img?.alt) problems.push(`example-images: "${name}" has no alt text`);
    else if (!fs.existsSync(file)) problems.push(`example-images: ${file} is missing`);
    else bySlug[slug].look = { src: `/examples/${name}.webp`, alt: img.alt };
  }
}

// What each block needs first, the steps before it and the paths after it (tools/lib/needs.mjs), on its page.
const { planOf } = await import("../../tools/lib/needs.mjs");
const describe = (t) => ({ label: t.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()), what: (typeDesc[t] ?? t).replace(/\.$/, "").replace(/^./, (c) => c.toLowerCase()) });
for (const b of blocks) {
  const f = path.join(OUT_PAGES, `${b.slug}.json`);
  if (!fs.existsSync(f)) continue;
  const pageData = JSON.parse(fs.readFileSync(f, "utf8"));
  pageData.plan = planOf(b, bySlug, blocks, describe);
  fs.writeFileSync(f, JSON.stringify(pageData));
}

const usedTypes = new Set(blocks.flatMap((b) => [...b.inputs, ...b.outputs].map((p) => p.type)));
const portTypes = Object.fromEntries([...usedTypes].sort().map((t) => [t, typeDesc[t] ?? null]));

// Old names still work: the site sends an old link to the block's new page.
const renamedFile = path.join(ROOT, "renamed.json");
const renamed = fs.existsSync(renamedFile) ? Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(renamedFile, "utf8"))).filter(([, to]) => blocks.some((b) => b.slug === to))) : {};
// The whole roster goes too, so /minds can show who's coming before their files are built.
const minds = { areas: roster.areas ?? {}, roster: roster.minds.map((m) => ({ slug: m.slug, name: m.name, area: m.area, seat: m.seat, living: !!m.living, built: !!bySlug[m.slug] })) };
fs.writeFileSync(path.join(OUT_DATA, "blocks.json"), JSON.stringify({ built: new Date().toISOString().slice(0, 10), portTypes, renamed, minds, blocks }));
// Every page, for search engines: the home page, each block, the mini tools and the apps. The saved example app
// (public/example-app) is left out: it's a copy of another app, marked noindex.
const SITE = "https://useaiblocks.com";
const kindPath = (b) => (b.type === "mind" ? "minds" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflows" : b.type === "prompt" ? "prompts" : "skills");
const { TOOLS } = await import("../../mini-tools/index.mjs");
const urls = ["/", "/how-it-works", "/minds", "/tools", ...TOOLS.map((t) => `/tools/${t.slug}`), "/apps", "/apps/starter-pack", ...blocks.filter((b) => b.headline).map((b) => `/${kindPath(b)}/${b.slug}`)];
fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`sitemap: ${urls.length} pages`);
console.log(`${blocks.filter((b) => b.headline).length} of ${blocks.length} have a page`);
console.log(`${blocks.length} blocks (${blocks.filter((b) => b.category === "general").length} general, ${blocks.filter((b) => b.category === "ecommerce").length} ecommerce, ${blocks.filter((b) => b.category === "orchestrator").length} orchestrators, ${blocks.filter((b) => b.category === "mind").length} minds)`);
if (problems.length) console.log("Problems:\n  " + problems.join("\n  "));
