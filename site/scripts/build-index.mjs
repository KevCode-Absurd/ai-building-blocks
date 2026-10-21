// Reads catalogue-items/** and writes the site's data: one small index for the library,
// plus each block's skill files under public/skills/<slug>/ (fetched only when a block page opens).
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { Marked } from "marked";

// CATALOGUE_ROOT points the build at another folder (tools/make-fake-catalogue.mjs makes one for load tests).
const ROOT = path.resolve(process.env.CATALOGUE_ROOT || "../catalogue-items");
const OUT_DATA = "public/data";
const OUT_SKILLS = "public/skills";
// Headings inside a skill's text drop one level (h1 to h2 and so on), so every page has one h1: its own title.
const sub = (html) => html.replace(/<(\/?)h([1-5])\b/g, (_, slash, n) => `<${slash}h${Number(n) + 1}`);
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
// Skills imported from outside (catalogue-items/imported/<slug>) are filed under "general"; the whole folder travels with them.
const SKIP_TOP = new Set(["item.yaml", "page.yaml", "boards", "tests", "SKILL.md"]);
const walk = (dir, rel = "") => fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((e) => {
  if (e.name.startsWith(".") || e.name === "__pycache__" || e.name === "node_modules" || (!rel && SKIP_TOP.has(e.name))) return [];
  const r = rel ? `${rel}/${e.name}` : e.name;
  return e.isDirectory() ? walk(path.join(dir, e.name), r) : [r];
});
const seen = new Set();
for (const dirName of ["general", "ecommerce", "orchestrators", "imported"]) {
  const category = dirName === "imported" ? "general" : dirName;
  const dir = path.join(ROOT, dirName);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir).sort()) {
    const folder = path.join(dir, slug);
    const yamlPath = path.join(folder, "item.yaml");
    const skillPath = path.join(folder, "SKILL.md");
    if (!fs.existsSync(yamlPath) || !fs.existsSync(skillPath)) { problems.push(`${category}/${slug}: missing item.yaml or SKILL.md`); continue; }
    let item;
    try { item = YAML.parse(fs.readFileSync(yamlPath, "utf8")); } catch (e) { problems.push(`${category}/${slug}: ${e.message.split("\n")[0]}`); continue; }
    if (item.slug !== slug) problems.push(`${dirName}/${slug}: slug in item.yaml is "${item.slug}"`);
    if (seen.has(slug)) { problems.push(`${dirName}/${slug}: slug is already used by another block`); continue; }
    seen.add(slug);
    const imported = dirName === "imported" || item.origin === "imported";
    const skill = fs.readFileSync(skillPath, "utf8");
    fs.mkdirSync(path.join(OUT_SKILLS, slug), { recursive: true });
    fs.copyFileSync(skillPath, path.join(OUT_SKILLS, slug, "SKILL.md"));
    // Reference files and a licence travel with the skill, so a download installs complete.
    const refDir = path.join(folder, "references");
    const files = imported ? walk(folder) : [...(fs.existsSync(refDir) ? fs.readdirSync(refDir).filter((f) => f.endsWith(".md")).sort().map((f) => `references/${f}`) : []), ...(fs.existsSync(path.join(folder, "LICENSE")) ? ["LICENSE"] : [])];
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
      out.html = { explain: page.explain ? sub(md.parse(String(page.explain))) : "", skill: sub(md.parse(bodyOf(skill))) };
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
      origin: imported ? "imported" : item.origin ?? "own",
      ...(item.source ? { source: { by: String(item.source.by ?? ""), repo: String(item.source.repo ?? ""), url: String(item.source.url ?? ""), licence: String(item.source.licence ?? ""), original: String(item.source.original_name ?? ""), commit: String(item.source.commit ?? "") } } : {}),
      ...(Array.isArray(item.warnings) && item.warnings.length ? { warnings: item.warnings.map(String) } : {}),
      // Last test run on the example business (tools/test-blocks.mjs). Only a pass is shown on the page.
      tested: item.tested ? { on: String(item.tested.on), result: item.tested.result, business: item.tested.business ?? "sprout" } : null,
      version: String(item.version ?? "1.0.0"),
      words: skill.split(/\s+/).length,
      // The same look in the other format: a video block's image twin, or the other way round.
      twin: item.twin ?? null,
      // The minds whose work the skill comes from (docs/SOURCE-SKILLS-PRD.md). Checked against the roster below.
      minds: Array.isArray(item.minds) ? item.minds.map(String) : [],
      files,
      added: fs.statSync(yamlPath).mtime.toISOString().slice(0, 10),
    });
  }
}

// Minds (catalogue-items/minds, docs/MINDS-PRD.md): a public figure's ideas and voice. Each built one has a mind.yaml and
// a SKILL.md made by tools/build-minds.mjs; its page is put together here from mind.yaml and knowledge.md.
const MINDS = path.join(ROOT, "minds");
const roster = fs.existsSync(path.join(MINDS, "_roster.yaml")) ? YAML.parse(fs.readFileSync(path.join(MINDS, "_roster.yaml"), "utf8")) : { areas: {}, minds: [] };
// Pixel portraits, one line per mind (catalogue-items/minds/_avatars.yaml), drawn by src/lib/face.ts.
const faces = fs.existsSync(path.join(MINDS, "_avatars.yaml")) ? YAML.parse(fs.readFileSync(path.join(MINDS, "_avatars.yaml"), "utf8")) ?? {} : {};
for (const r of roster.minds) if (!faces[r.slug]) problems.push(`minds/_avatars.yaml has no face for ${r.slug}`);
// Role labels (catalogue-items/minds/_labels.yaml): what each person is known for doing, shown as badges and filters.
const labelFile = fs.existsSync(path.join(MINDS, "_labels.yaml")) ? YAML.parse(fs.readFileSync(path.join(MINDS, "_labels.yaml"), "utf8")) : { labels: {}, people: {} };
const labelsOf = (slug) => (labelFile.people?.[slug] ?? []).filter((l) => labelFile.labels?.[l]);
for (const r of roster.minds) if (!labelsOf(r.slug).length) problems.push(`minds/_labels.yaml has no labels for ${r.slug}`);
for (const r of roster.minds) {
  const folder = path.join(MINDS, r.slug);
  const yamlPath = path.join(folder, "mind.yaml"), skillPath = path.join(folder, "SKILL.md");
  if (!fs.existsSync(yamlPath) || !fs.existsSync(skillPath)) continue;
  let m;
  try { m = YAML.parse(fs.readFileSync(yamlPath, "utf8")); } catch (e) { problems.push(`minds/${r.slug}: ${e.message.split("\n")[0]}`); continue; }
  const skill = fs.readFileSync(skillPath, "utf8");
  fs.mkdirSync(path.join(OUT_SKILLS, r.slug), { recursive: true });
  fs.copyFileSync(skillPath, path.join(OUT_SKILLS, r.slug, "SKILL.md"));
  // The parts go too, so a mind's pack can carry its playbook, personality, knowledge and sources as their own files.
  const mindFiles = ["playbook.md", "personality.md", "knowledge.md"].filter((f) => fs.existsSync(path.join(folder, f)));
  for (const f of mindFiles) fs.copyFileSync(path.join(folder, f), path.join(OUT_SKILLS, r.slug, f));
  const srcList = (m.sources ?? []).filter((s) => s.title).map((s) => `${s.n}. ${s.title}${s.by ? `, ${s.by}` : ""} (${s.kind ?? "source"})${s.url ? `: ${s.url}` : ""}`);
  fs.writeFileSync(path.join(OUT_SKILLS, r.slug, "sources.md"), [`# Sources: ${m.name}`, "", "The public work this mind was built from. knowledge.md cites them as [S1], [S2] and so on.", "", ...srcList, ""].join("\n"));
  mindFiles.push("sources.md");
  const first = m.name.split(" (")[0];
  const knowledge = fs.existsSync(path.join(folder, "knowledge.md")) ? fs.readFileSync(path.join(folder, "knowledge.md"), "utf8").replace(/\r\n?/g, "\n") : "";
  // Their big ideas: the ### headings under "Core ideas", each with its first sentence, tags removed.
  const core = knowledge.split(/^## /m).find((s) => /^Core ideas/i.test(s)) ?? "";
  const ideas = core.split(/^### /m).slice(1).map((s) => {
    const [title, ...rest] = s.split("\n");
    const text = rest.join(" ").replace(/\[S\d+\]/g, "").replace(/\s+/g, " ").trim();
    return { title: title.trim(), text: (text.match(/^.*?[.!?](\s|$)/)?.[0] ?? text).trim() };
  }).filter((x) => x.title);
  // How to hire them (playbook.md): the jobs, their method as steps, and the questions they ask first.
  const playbook = fs.existsSync(path.join(folder, "playbook.md")) ? fs.readFileSync(path.join(folder, "playbook.md"), "utf8").replace(/\r\n?/g, "\n") : "";
  const pbPart = (re) => (playbook.split(/^## /m).find((x) => re.test(x)) ?? "").split("\n").slice(1);
  const boldItem = (l) => { const x = l.replace(/^\s*(?:[-*]|\d+\.)\s+/, "").match(/^\*\*(.+?)\*\*:?\s*(.*)$/); return x ? { title: x[1].replace(/[.:]$/, ""), text: x[2].trim().replace(/^[a-z]/, (c) => c.toUpperCase()) } : null; };
  const hire = playbook ? {
    jobs: pbPart(/^What to hire/).filter((l) => /^\s*-/.test(l)).map(boldItem).filter(Boolean),
    steps: pbPart(/^How .+ take on your problem/).filter((l) => /^\d+\./.test(l)).map(boldItem).filter(Boolean),
    questions: pbPart(/^First questions/).filter((l) => /^\s*-/.test(l)).map((l) => l.replace(/^\s*-\s+/, "").trim()),
  } : undefined;
  const page = {
    headline: m.name,
    subhead: m.summary,
    explain: `${m.known_for}\n\nThis is an AI playing ${first} from public work: ${m.sources.length} public sources, listed below, written into a data set of what they knew and believed and a profile of how they think and talk. It isn't ${first}, and ${first} hasn't endorsed it.${m.living ? ` ${first} is alive, so views can change; it was last checked on ${String(m.last_checked).slice(0, 10)}.` : ""}`,
    when: m.use_cases,
    you_give: ["Your task or question", "Your facts, numbers or draft (optional; it asks once if they matter)", "A role for them, such as \"my investor\" (optional)"],
    you_get: [`Your problem worked on the way ${first} would: their questions, their method, their push-back`, `The answer or the work, in ${first}'s voice, using their ideas by name`, "Anything that goes beyond their public record, marked", "One suggested next step"],
    how_to_use: ["Add the skill to your AI, or copy it and paste it into a chat.", `Ask your question or give the task, such as "${m.use_cases[0]}".`, "Paste the facts that matter.", `To hear ${first} argue with other minds, put them on an advisory council.`],
    output_shape: `<the answer or the piece of work, in ${first}'s voice>\n  <the recommendation, or the work itself, first>\n  <the reasoning, using ${first}'s ideas by name>\n  <[beyond the record] wherever it goes past what they said or did>\n\nMISSING: <facts you didn't give, or none>\nNEXT: <one suggested next step>`,
    ideas,
    hire,
    seats: m.seats,
    pairs: (m.pairs_with ?? []).filter((s) => roster.minds.some((x) => x.slug === s)),
    credits: m.sources.filter((s) => s.title).map((s) => ({ title: String(s.title), by: s.by ? String(s.by) : "", url: s.url && /^https?:\/\//.test(s.url) ? String(s.url) : "", used: "" })),
  };
  page.html = { explain: sub(md.parse(page.explain)), skill: sub(md.parse(bodyOf(skill))) };
  fs.writeFileSync(path.join(OUT_PAGES, `${r.slug}.json`), JSON.stringify(page));
  blocks.push({
    slug: r.slug, name: m.name, summary: m.summary, headline: m.name,
    task: "think-with-minds", category: "mind", boards: [], type: "mind", role: "make", job: "minds", level: "beginner",
    thinking: "medium", thinkingWhy: "It plays one voice from a written data set. Use your strongest model when the stakes are high.",
    seats: m.seats.map((s) => s.seat), area: m.area, also: m.also ?? [], years: m.years ?? "", living: !!m.living, labels: labelsOf(r.slug), // the face comes from the roster (lib/data.ts), so it is sent once
    inputs: [{ type: "question", required: true }], outputs: [{ type: "mind_view", required: true }],
    uses: [], steps: [], origin: "own", tested: null, version: String(m.version ?? "1.0.0"), words: skill.split(/\s+/).length,
    twin: null, files: mindFiles, minds: [], skills: [], flows: [], added: fs.statSync(yamlPath).mtime.toISOString().slice(0, 10),
  });
}

// How many workflows use each block: the honest "popular" signal until people can vote.
const bySlug = Object.fromEntries(blocks.map((b) => [b.slug, b]));
// Each skill names the minds whose work it comes from; each mind then lists those skills, the ones it leads first.
for (const b of blocks) for (const ms of b.minds ?? []) {
  const m = bySlug[ms];
  if (!m || m.type !== "mind") { problems.push(`${b.slug}: minds lists "${ms}", which isn't a built mind`); continue; }
  (b.category === "orchestrator" || b.type === "workflow" ? m.flows : m.skills).push(b.slug);
}
for (const b of blocks) if (b.type === "mind") b.skills.sort((x, y) => bySlug[x].minds.indexOf(b.slug) - bySlug[y].minds.indexOf(b.slug) || bySlug[x].name.localeCompare(bySlug[y].name));
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
  // Why it needs that much thinking is only shown on the block's own page, so it travels there, not in blocks.json.
  if (b.thinkingWhy) pageData.thinkingWhy = b.thinkingWhy;
  delete b.thinkingWhy;
  // Facts only the block's own page shows (or nothing does) travel with the page, not in blocks.json.
  pageData.words = b.words; pageData.added = b.added; if (b.tested) pageData.tested = b.tested;
  // An imported skill's GitHub link, licence, first name and commit are only shown on its page; the list keeps just the maker.
  if (b.source) pageData.source = b.source;
  fs.writeFileSync(f, JSON.stringify(pageData));
}

const usedTypes = new Set(blocks.flatMap((b) => [...b.inputs, ...b.outputs].map((p) => p.type)));
const portTypes = Object.fromEntries([...usedTypes].sort().map((t) => [t, typeDesc[t] ?? null]));

// Old names still work: the site sends an old link to the block's new page.
const renamedFile = path.join(ROOT, "renamed.json");
const renamed = fs.existsSync(renamedFile) ? Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(renamedFile, "utf8"))).filter(([, to]) => blocks.some((b) => b.slug === to))) : {};
// The whole roster goes too, so /minds can show who's coming before their files are built.
const minds = { areas: roster.areas ?? {}, roster: roster.minds.map((m) => ({ slug: m.slug, name: m.name, area: m.area, seat: m.seat, living: !!m.living, built: !!bySlug[m.slug], face: faces[m.slug] ?? {}, labels: labelsOf(m.slug) })), labels: labelFile.labels ?? {} };
// The file list of a skill with extra files is fetched only when someone downloads it (Install.tsx), so it isn't in blocks.json.
for (const b of blocks) if (b.files.length) fs.writeFileSync(path.join(OUT_SKILLS, b.slug, "_files.json"), JSON.stringify(b.files));
// blocks.json is loaded by every page, so each block is sent as small as it can be: fields the list, search, home page and
// builder never read are left out, and a value equal to its default is left out too. loadCatalogue (lib/data.ts) puts them back.
const DEFAULTS = { category: "general", type: "skill", role: "make", job: "ops", level: "intermediate", thinking: "medium", origin: "own", version: "1.0.0", usedIn: 0 };
const wire = (b) => {
  const o = {};
  for (const [k, v] of Object.entries(b)) {
    if (["words", "added", "files", "tested"].includes(k)) continue; // page JSON, or _files.json
    if (k === "headline") { if (v === b.name) continue; } // same as the name: left out; no page at all: sent as ""
    else if (k in DEFAULTS ? v === DEFAULTS[k] : v == null || v === "" || (Array.isArray(v) && !v.length)) continue;
    o[k] = k === "inputs" || k === "outputs" ? v.map((p) => (p.required ? p.type : `${p.type}?`)) : k === "steps" ? v.map((x) => (x.note ? [x.uses, x.note] : x.uses)) : k === "source" ? { by: v.by } : v;
  }
  if (b.files.length) o.hasFiles = true;
  if (b.tested?.result === "pass") o.tested = 1;
  return o;
};
fs.writeFileSync(path.join(OUT_DATA, "blocks.json"), JSON.stringify({ built: new Date().toISOString().slice(0, 10), portTypes, renamed, minds, blocks: blocks.map(wire) }));
// Every page, for search engines: the home page, each block, the mini tools and the apps. The saved example app
// (public/example-app) is left out: it's a copy of another app, marked noindex.
const SITE = "https://useaiblocks.com";
const kindPath = (b) => (b.type === "mind" ? "minds" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflows" : b.type === "prompt" ? "prompts" : "skills");
const { TOOLS } = await import("../../mini-tools/index.mjs");
const urls = ["/", "/how-it-works", "/minds", "/from-a-source", "/tools", ...TOOLS.map((t) => `/tools/${t.slug}`), "/apps", "/apps/starter-pack", ...blocks.filter((b) => b.headline).map((b) => `/${kindPath(b)}/${b.slug}`)];
// One sitemap per kind of page, under a sitemap index, so Search Console shows how each kind is indexed. No lastmod:
// the only dates we have are file times, and a wrong date teaches search engines to ignore it.
// sitemap-jobs.xml (the job hubs) is written by scripts/prerender.mjs.
const urlset = (us) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${us.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}\n</urlset>\n`;
const SITEMAPS = { pages: urls.filter((u) => !/^\/(skills|workflows|prompts|minds)\//.test(u)), skills: urls.filter((u) => u.startsWith("/skills/")), workflows: urls.filter((u) => u.startsWith("/workflows/")), prompts: urls.filter((u) => u.startsWith("/prompts/")), minds: urls.filter((u) => u.startsWith("/minds/")) };
for (const f of fs.readdirSync("public").filter((f) => /^sitemap-.*\.xml$/.test(f))) fs.rmSync(path.join("public", f));
for (const [k, us] of Object.entries(SITEMAPS)) if (us.length) fs.writeFileSync(`public/sitemap-${k}.xml`, urlset(us));
fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...Object.keys(SITEMAPS).filter((k) => SITEMAPS[k].length), "jobs"].map((k) => `  <sitemap><loc>${SITE}/sitemap-${k}.xml</loc></sitemap>`).join("\n")}\n</sitemapindex>\n`);
// Everyone may crawl and index everything: search engines, answer engines and AI assistants. The library is free and
// credited, so training crawlers are allowed too, on purpose. The saved example app is a copy of another app (noindex).
// /data/ stays open because the pages need it to render.
fs.writeFileSync("public/robots.txt", [
  "# AI Blocks: free AI skills, workflows, minds and mini tools.",
  "# Search engines, answer engines and AI assistants are all welcome, including AI training crawlers: the library is free and every skill is credited.",
  "# A short guide for AI assistants: https://useaiblocks.com/llms.txt",
  "User-agent: *", "Allow: /", "Disallow: /example-app/", "",
  "Content-Signal: search=yes, ai-input=yes, ai-train=yes", "",
  `Sitemap: ${SITE}/sitemap.xml`, "",
].join("\n"));

// llms.txt (llmstxt.org): a plain guide to the site for AI assistants. It links one file per job (/llms/<job>.txt),
// each listing that job's pages with their one line, and llms-full.txt is the index of those files.
const TASK_NAMES = Object.fromEntries([...fs.readFileSync("src/lib/data.ts", "utf8").split("export const TASKS")[1].split("];")[0].matchAll(/\{ id: "([^"]+)", name: "([^"]+)" \}/g)].map((m) => [m[1], m[2]]));
const paged = blocks.filter((b) => b.headline);
const line = (b) => `- [${b.name}](${SITE}/${kindPath(b)}/${b.slug}): ${b.summary}`;
const byTask = {};
for (const b of paged) if (b.type !== "mind") (byTask[b.task] ??= []).push(b);
const tasksBySize = Object.entries(byTask).sort((a, b) => b[1].length - a[1].length);
const nSkills = paged.filter((b) => b.type !== "mind").length, nMinds = paged.filter((b) => b.type === "mind").length;
const example = paged.find((b) => b.slug === "ad-angle-planner") ?? paged[0];
const intro = [
  "# AI Blocks", "",
  "> Free AI skills, workflows, prompts and minds for real work. Each skill is a SKILL.md for Claude, ChatGPT, Gemini or Codex.", "",
  "## Key facts", "",
  "- Free to use, no account needed.",
  `- ${nSkills} skills, workflows and prompts in ${tasksBySize.length} jobs, ${nMinds} minds and ${TOOLS.length} mini tools.`,
  "- Imported skills are copied as they are from open-licence GitHub repos (MIT, Apache 2.0, BSD, CC BY, CC BY-SA), credited on their page with a link to the original.",
  "- Minds are AIs built from a person's public work, with their sources listed. They are not the person. Minds that invest teach frameworks only, never buy or sell advice.",
  "- Skills that scrape websites or need a paid outside account say so on their page.",
  `- Last built ${new Date().toISOString().slice(0, 10)}.`, "",
  "## How to use a skill", "",
  `- Every skill has a page and a skill file. For example: [${example.name}](${SITE}/${kindPath(example)}/${example.slug}), and its file [SKILL.md](${SITE}/skills/${example.slug}/SKILL.md). Add the file to your AI as a skill, or paste it into a chat.`,
  `- [Every page by job](${SITE}/jobs), and the whole catalogue as data: [blocks.json](${SITE}/data/blocks.json)`, "",
  "## Main pages", "",
  `- [All skills by job](${SITE}/jobs): every skill, workflow and prompt, sorted by the job it does`,
  `- [How it works](${SITE}/how-it-works): from one prompt to your own AI app`,
  `- [Minds](${SITE}/minds): hire a great thinker's method for your problem`,
  `- [From a source](${SITE}/from-a-source): turn a video, article or course into skills`,
  `- [Mini tools](${SITE}/tools): calculators for prices, margins, discounts and AI costs`,
  `- [Apps](${SITE}/apps): an example AI app and a starter pack`, "",
];
const jobLine = ([t, bs]) => `- [${TASK_NAMES[t] ?? t}](${SITE}/llms/${t}.txt): ${bs.length} skills and workflows, such as ${bs.slice(0, 2).map((b) => b.name).join(" and ")}`;
fs.rmSync("public/llms", { recursive: true, force: true });
fs.mkdirSync("public/llms", { recursive: true });
for (const [t, bs] of tasksBySize) fs.writeFileSync(`public/llms/${t}.txt`, [`# ${TASK_NAMES[t] ?? t}: AI Blocks`, "", `> ${bs.length} free AI skills and workflows for this job. Each page links its SKILL.md.`, "", ...[...bs].sort((x, y) => x.name.localeCompare(y.name)).map(line), ""].join("\n"));
fs.writeFileSync("public/llms/minds.txt", ["# Minds: AI Blocks", "", "> AIs built from great thinkers' public work. Not the people themselves.", "", ...paged.filter((b) => b.type === "mind").sort((x, y) => x.name.localeCompare(y.name)).map(line), ""].join("\n"));
fs.writeFileSync("public/llms.txt", [...intro, "## Skills by job", "", ...tasksBySize.map(jobLine), `- [Minds](${SITE}/llms/minds.txt): ${nMinds} minds, from founders and investors to writers and scientists`, "", "## Optional", "", `- [Every job file in one list](${SITE}/llms-full.txt)`, ""].join("\n"));
fs.writeFileSync("public/llms-full.txt", [...intro, "## Every job", "", ...[...tasksBySize].sort((a, b) => (TASK_NAMES[a[0]] ?? a[0]).localeCompare(TASK_NAMES[b[0]] ?? b[0])).map(jobLine), `- [Minds](${SITE}/llms/minds.txt): ${nMinds} minds`, ""].join("\n"));

// Old addresses answer with a real 301 to the new one (Cloudflare Pages _redirects), so links and search results carry
// over. A rename never changes a block's kind, so one rule each. The app's own routes with no page file come last
// (rewrites, status 200), because dist/404.html turns off Cloudflare's fall back to the app for unknown addresses.
const redirects = Object.entries(renamed).map(([from, to]) => [from, bySlug[to]]).filter(([, b]) => b?.headline).map(([from, b]) => `/${kindPath(b)}/${from} /${kindPath(b)}/${b.slug} 301`);
const appRoutes = ["/space /index.html 200", "/people /index.html 200", "/s/* /index.html 200"];
fs.writeFileSync("public/_redirects", `# Old block names, moved to shorter ones (catalogue-items/renamed.json). Made by scripts/build-index.mjs.\n${redirects.join("\n")}\n\n# App pages with no page file of their own.\n${appRoutes.join("\n")}\n`);
if (redirects.length + appRoutes.length > 2000) problems.push(`_redirects has ${redirects.length + appRoutes.length} rules; Cloudflare Pages allows 2,000`);
console.log(`sitemap: ${urls.length} pages`);
console.log(`${blocks.filter((b) => b.headline).length} of ${blocks.length} have a page`);
console.log(`${blocks.length} blocks (${blocks.filter((b) => b.category === "general").length} general, ${blocks.filter((b) => b.category === "ecommerce").length} ecommerce, ${blocks.filter((b) => b.category === "orchestrator").length} orchestrators, ${blocks.filter((b) => b.category === "mind").length} minds)`);
if (problems.length) console.log("Problems:\n  " + problems.join("\n  "));
