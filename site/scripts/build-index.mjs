// Reads catalogue-items/** and writes the site's data: one small index for the library,
// plus each block's SKILL.md under public/skills/<slug>/ (fetched only when a block page opens), and a zip for a skill with extra files.
import fs from "node:fs";
import { primarySkillFile } from "./lib/skill-file.mjs";
import { loadFactChecks } from "./lib/fact-checks.mjs";
import { BROWSER_TOOLS } from "../src/tools/browser-tools.mjs";
import path from "node:path";
import YAML from "yaml";
import { markdown as md } from "./lib/safe-markdown.mjs";
import { zipSync } from "fflate";
import { quarantineClosure } from "../../tools/lib/quarantine.mjs";
import { applyDisplayCopy } from "../../tools/lib/display-copy.mjs";
import { acquireBuildLock } from "./lib/build-lock.mjs";
import { INFO_PAGES, POLICY_DATE } from "../src/lib/site-info.mjs";
import { makeTaskRecipe } from "../src/lib/copyable-task.mjs";
import { TASKS } from "../src/lib/catalogue-taxonomy.mjs";
import {roleSeeds,sameJobAgentPages} from "../src/roles/role-definitions.mjs";
import { compileClassifications } from "./lib/catalogue-classification.mjs";
import { gitDates } from "./lib/git-dates.mjs";
import { FEEDS, connectLines, feedItems, jobHubDates, jsonFeed, newest, pageFacts, rssFeed, sitemapIndex, urlset as sitemapUrlset } from "./lib/crawl-files.mjs";
import { linkNotFor, makeNameIndex } from "../../tools/lib/not-for-links.mjs";
import { loadSiblings } from "./lib/similar-items.mjs";
import { pagePath } from "./lib/crawl-files.mjs";
import { boardsOf, readFixes } from "./lib/board-map.mjs";
import { guardrails, safetyMarkdown, scanDay } from "../../tools/lib/safety-guardrails.mjs";
import { FORMAT_PAGE_URLS } from "./lib/format-pages.mjs";
import { studyPage } from "../src/trust-pages/agent-skills-study.mjs";
await acquireBuildLock(".index-build.lock");

// CATALOGUE_ROOT points the build at another folder (tools/make-fake-catalogue.mjs makes one for load tests).
const ROOT = path.resolve(process.env.CATALOGUE_ROOT || "../catalogue-items");
const factChecks = loadFactChecks(ROOT), sourceFactRows = new Map();
const classificationFile = path.join(ROOT, "classification.yaml");
const classifications = compileClassifications(fs.existsSync(classificationFile) ? YAML.parse(fs.readFileSync(classificationFile, "utf8")) : {});
// Hand fixes for the business boards (catalogue-items/boards.yaml): checked here so a typo fails the build.
const boardFixes = readFixes();
const copyFile = path.join(ROOT, "display-copy.yaml");
const copyEdits = fs.existsSync(copyFile) ? YAML.parse(fs.readFileSync(copyFile, "utf8")) ?? {} : {};
const copyUsed = new Set();
// The safety scan's results (tools/safety-scan.mjs write): each item's guardrails on its page and SAFETY.md in its zip.
const safetyFile = path.join(ROOT, "_safety.json");
const safety = fs.existsSync(safetyFile) ? JSON.parse(fs.readFileSync(safetyFile, "utf8")) : { scanned: "", items: {} };
const safetyFor = (slug) => (safety.scanned ? { checked: scanDay(safety.scanned), guardrails: guardrails(safety.items[slug]) } : null);
const OUT_DATA = "public/data";
const OUT_SKILLS = "public/skills";
// One fixed date inside every zip, so the same files always make the same zip.
const ZIP_DATE = new Date(2026, 0, 1, 5, 30, 0);
// Headings inside a skill's text drop one level (h1 to h2 and so on), so every page has one h1: its own title.
const sub = (html) => html.replace(/<(\/?)h([1-5])\b/g, (_, slash, n) => `<${slash}h${Number(n) + 1}`);
const OUT_PAGES = "public/data/pages";
const WORKFLOW_PAGES = path.resolve("../tools/orchestrator-pages");
fs.rmSync(OUT_SKILLS, { recursive: true, force: true, maxRetries: 5 });
fs.rmSync(OUT_PAGES, { recursive: true, force: true, maxRetries: 5 });
fs.mkdirSync(OUT_PAGES, { recursive: true });

// An output_sample with at least one input and one named output.
const hasStructure = (s) => !!s && Array.isArray(s.input) && s.input.length > 0 && Array.isArray(s.output) && s.output.some((o) => o?.name && o?.contains);

// Until a block has its page written, it is filed under the job closest to its old group.
const TASK_FROM_JOB = { copy: "write-ad-copy", email: "write-ad-copy", ads: "make-image-ads", image: "make-image-ads", video: "make-video-ads", page: "write-landing-page", analysis: "read-ad-results", research: "understand-customers", brand: "brand-file", offer: "make-offer", organic: "grow-social", ops: "set-up-ai" };
/** A page's first "Use it when" line, without the leading "You want", "You need", … (one line: a second one adds weight
 *  to blocks.json and did not match goals better). */
const cuesOf = (when) => (Array.isArray(when) ? when : []).filter((w) => typeof w === "string").slice(0, 1)
  .map((w) => w.trim().replace(/^You(?:'re| are| have| want| need)?\s+/i, "")).join(" ").slice(0, 300);
const PAGE_FIELDS = ["headline", "subhead", "explain", "when", "not_for", "output_sample", "you_give", "you_get", "how_to_use", "how_it_works", "output_shape", "tweaks", "judge", "test", "improve", "terms", "works_best_with"];
// Source schemas carry precise fields for some imported methods. Keep their
// meaning separate from display copy and leave the original frontmatter intact.
function schemaFields(schema) {
  if (!schema || typeof schema !== "object") return [];
  const rows = [], seen = new Set();
  const add = (field, optional = false) => {
    const name = typeof field === "string" ? field : field?.field ?? field?.name;
    if (!name || seen.has(name)) return;
    seen.add(name);
    const description = typeof field === "object" && field?.description ? ": " + field.description : "";
    rows.push(`${name}${description}${optional ? " (optional)" : ""}`);
  };
  if (schema.properties && typeof schema.properties === "object" && !Array.isArray(schema.properties)) {
    const required = new Set(Array.isArray(schema.required) ? schema.required : []);
    for (const [name, definition] of Object.entries(schema.properties)) add({ name, description: definition?.description }, !required.has(name));
  } else {
    for (const key of ["required", "optional"]) for (const field of Array.isArray(schema[key]) ? schema[key] : []) add(field, key === "optional");
  }
  for (const field of Array.isArray(schema.fields) ? schema.fields : []) add(field, field?.required === false || field?.optional === true);
  return rows;
}

const types = YAML.parse(fs.readFileSync(path.join(ROOT, "_types.yaml"), "utf8"));
const typeDesc = {};
for (const group of Object.values(types)) for (const [id, t] of Object.entries(group)) typeDesc[id] = t.desc;

const asPorts = (list) =>
  (list ?? []).map((p) => (typeof p === "string" ? { type: p, required: true } : { type: p.type, required: p.required !== false }));

// Markdown is turned into HTML here, at build time, so the site ships no Markdown library.
// Raw HTML in a file is escaped: files are data, never markup we trust.
// The skill file as shown on the page: no frontmatter, and no <!-- markers --> the section tools leave.
const bodyOf = (t) => t.replace(/\r\n?/g, "\n").replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/^<!--[\s\S]*?-->\n?/gm, "");

const blocks = [];
// Reviewed "what comes next" / "steps before" lists (page.yaml or item.yaml `next:` and `before:`, slugs in order).
// They replace the worked-out links in tools/lib/needs.mjs; they never go into blocks.json.
const linkOverrides = new Map();
const problems = [];
// Skills imported from outside (catalogue-items/imported/<slug>) are filed under "general"; the whole folder travels with them.
const SKIP_TOP = new Set(["item.yaml", "page.yaml", "boards", "tests", "SKILL.md"]);
const walk = (dir, rel = "") => fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((e) => {
  if (e.name.startsWith(".") || e.name === "__pycache__" || e.name === "node_modules" || (!rel && SKIP_TOP.has(e.name))) return [];
  const r = rel ? `${rel}/${e.name}` : e.name;
  return e.isDirectory() ? walk(path.join(dir, e.name), r) : [r];
});
const seen = new Set();
// The day an item's own files last changed (the newest of the listed files). Shown on its page as "Updated" and used as
// the sitemap's lastmod, the page's dateModified and the feeds. It comes from git history (scripts/lib/git-dates.mjs), so a
// fresh checkout or a rebuild never moves it; a file with uncommitted edits uses its file time until it is committed.
const dates = { catalogue: gitDates(ROOT), workflowPages: gitDates(WORKFLOW_PAGES) };
if (!dates.catalogue.usable) console.warn("lastmod: no git history for the catalogue, so dates fall back to file times");
if (dates.catalogue.shallow) console.warn("lastmod: shallow git clone, so dates may be too new; fetch the full history before building for release");
// `workflowPage` is a workflow's page written in tools/orchestrator-pages instead of its own folder.
const lastChange = (folder, names, workflowPage) => {
  const times = [dates.catalogue.modifiedAt(names.map((n) => path.join(folder, n))), workflowPage ? dates.workflowPages.modifiedAt([workflowPage]) : ""].filter(Boolean);
  return new Date(times.length ? Math.max(...times.map(Date.parse)) : Date.now()).toISOString().slice(0, 10);
};
// The day the item first appeared (its oldest committed file): the feeds' date_published and the page's datePublished.
const firstSeen = (folder, names) => dates.catalogue.published(names.map((n) => path.join(folder, n)));
for (const dirName of ["general", "ecommerce", "orchestrators", "agents", "imported"]) {
  const category = dirName === "imported" ? "general" : dirName === "agents" ? "agent" : dirName;
  const dir = path.join(ROOT, dirName);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir).sort()) {
    const folder = path.join(dir, slug);
    const yamlPath = path.join(folder, "item.yaml");
    const skillPath = primarySkillFile(folder);
    if (!fs.existsSync(yamlPath) || !skillPath) {
      // Empty folders left by a rename contain no catalogue entry.
      if (fs.readdirSync(folder).length) problems.push(`${dirName}/${slug}: missing item.yaml or primary instruction file`);
      continue;
    }
    let item;
    try { item = YAML.parse(fs.readFileSync(yamlPath, "utf8")); } catch (e) { problems.push(`${category}/${slug}: ${e.message.split("\n")[0]}`); continue; }
    if (item.slug !== slug) problems.push(`${dirName}/${slug}: slug in item.yaml is "${item.slug}"`);
    if (seen.has(slug)) { problems.push(`${dirName}/${slug}: slug is already used by another block`); continue; }
    seen.add(slug);
    const imported = dirName === "imported" || item.origin === "imported";
    const skill = fs.readFileSync(skillPath, "utf8");
  sourceFactRows.set(path.basename(folder), factChecks.forItem(path.basename(folder), skill));
    fs.mkdirSync(path.join(OUT_SKILLS, slug), { recursive: true });
    fs.copyFileSync(skillPath, path.join(OUT_SKILLS, slug, "SKILL.md"));
    // Reference files and a licence travel with the skill, so a download installs complete.
    const refDir = path.join(folder, "references");
    const candidateFiles = imported || item.package_files === "all" ? walk(folder) : [...(fs.existsSync(refDir) ? fs.readdirSync(refDir).filter((f) => f.endsWith(".md")).sort().map((f) => `references/${f}`) : []), ...(fs.existsSync(path.join(folder, "LICENSE")) ? ["LICENSE"] : [])];
    // Windows may retain a lowercase source filename when the canonical path
    // was written. Do not ship two case-colliding main files in one archive.
    const files = candidateFiles.filter(file => {
      if (file.toLowerCase() !== "skill.md") return true;
      const alternate = fs.readFileSync(path.join(folder, file), "utf8");
      if (alternate.replace(/\r\n?/g, "\n") !== skill.replace(/\r\n?/g, "\n")) throw Error(`${slug}: conflicting primary instruction filenames`);
      return false;
    });
    // They ship as one zip per skill (skills/<slug>.zip, the folder Claude installs), not one file each: the site stays
    // under Cloudflare Pages' file limit, and a download is one request. The skill's own files are never changed.
    if (files.length) {
      const tree = { [`${slug}/SKILL.md`]: new TextEncoder().encode(skill.replace(/\r\n?/g, "\n")) };
      for (const f of files) tree[`${slug}/${f}`] = fs.readFileSync(path.join(folder, f));
      // Our guardrails ride along as their own file; an upstream SAFETY.md, if any, is kept as it is.
      if (safety.scanned && !tree[`${slug}/SAFETY.md`]) tree[`${slug}/SAFETY.md`] = new TextEncoder().encode(safetyMarkdown(item.name ?? slug, safety.items[slug], safety.scanned));
      fs.writeFileSync(path.join(OUT_SKILLS, `${slug}.zip`), zipSync(tree, { level: 6, mtime: ZIP_DATE }));
    }
    const steps = (item.steps ?? []).map((s) => ({ uses: s.uses, note: s.note ?? "" }));
    const pagePath = [path.join(folder, "page.yaml"), path.join(WORKFLOW_PAGES, `${slug}.yaml`)].find((p) => fs.existsSync(p));
    let page = null;
    if (pagePath) { try { page = YAML.parse(fs.readFileSync(pagePath, "utf8")); } catch (e) { problems.push(`${category}/${slug}: page: ${e.message.split(/\r?\n/)[0]}`); } }
    const edited = applyDisplayCopy(item, page, copyEdits[slug]);
    item = edited.item; page = edited.page;
    if (copyEdits[slug]) copyUsed.add(slug);
    if (page || (item.type ?? "skill") === "skill") {
      const out = Object.fromEntries(PAGE_FIELDS.filter((f) => page?.[f] != null).map((f) => [f, page[f]]));
      // Public sources a block was built from, shown on its page. Only http(s) links are kept.
      const credits = (item.credits ?? []).filter((c) => c && c.title && (!c.url || /^https?:\/\//.test(c.url))).map((c) => ({ title: String(c.title), by: c.by ? String(c.by) : "", url: c.url ? String(c.url) : "", used: c.used ? String(c.used) : "" }));
      if (credits.length) out.credits = credits;
      const checked = safetyFor(slug);
      if (checked) out.safety = checked;
      out.html = { explain: page?.explain ? sub(md.parse(String(page.explain))) : "", skill: sub(md.parse(bodyOf(skill))) };
      if ((item.type ?? "skill") === "skill") {
        let metadata = {};
        try {
          const frontmatter = skill.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").match(/^---\n([\s\S]*?)\n---/);
          if (frontmatter) metadata = YAML.parse(frontmatter[1]) ?? {};
        } catch { /* The complete source remains authoritative when a schema cannot be parsed. */ }
        out.copyable = makeTaskRecipe({ ...item, slug, name: page?.name ?? item.name ?? slug,
          task: classifications.primary.get(slug) ?? page?.job ?? TASK_FROM_JOB[item.job] ?? "set-up-ai",
          inputs: asPorts(item.inputs), outputs: asPorts(item.outputs), uses: item.uses ?? [], steps, hasFiles: files.length > 0,
        }, { ...page, sourceInputFields: schemaFields(metadata.input_schema), sourceOutputFields: schemaFields(metadata.output_schema) }, skill);
      }
      // The business boards this item is made for (src/trust-pages/boards.mjs): its page shows them as "For:" links.
      const forBoards = boardsOf({ slug, name: page?.name ?? item.name ?? slug, summary: page?.summary ?? item.summary ?? "", headline: page?.headline ?? "", cues: cuesOf(page?.when),
        task: classifications.primary.get(slug) ?? page?.job ?? TASK_FROM_JOB[item.job] ?? "set-up-ai", category: category === "orchestrators" ? "orchestrator" : category, type: item.type ?? "skill" }, boardFixes.fixes);
      if (forBoards.length) out.boards = forBoards;
      fs.writeFileSync(path.join(OUT_PAGES, `${slug}.json`), JSON.stringify(out));
    }
    const links = Object.fromEntries(["next", "before"].map((k) => [k, page?.[k] ?? item[k]]).filter(([, v]) => v !== undefined));
    for (const [k, v] of Object.entries(links)) if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) { problems.push(`${category}/${slug}: ${k} must be a list of slugs`); delete links[k]; }
    if (Object.keys(links).length) linkOverrides.set(slug, links);
    blocks.push({
      slug,
      name: page?.name ?? item.name ?? slug,
      ...(edited.aliases.length ? { aliases: edited.aliases } : {}),
      summary: page?.summary ?? item.summary ?? "",
      // The first "Use it when" situation, in people's own words: the builder and plan_workflow match a goal on
      // them too (lib/goal.ts), so "let someone go" finds the termination checker. Kept short to keep this file small.
      cues: cuesOf(page?.when),
      headline: page?.headline ?? "",
      task: classifications.primary.get(slug) ?? page?.job ?? TASK_FROM_JOB[item.job] ?? "set-up-ai",
      ...classifications.fields(slug),
      category: category === "orchestrators" ? "orchestrator" : category,
      boards: item.boards ?? [],
      type: item.type ?? "skill",
      role: item.role ?? "make",
      job: item.job ?? "ops",
      level: item.level ?? "intermediate",
      // Workflows run several skills in a row, so they always ask for the strongest model.
      thinking: ["low", "medium", "high"].includes(page?.thinking) ? page.thinking : category === "orchestrators" || category === "agent" || item.type === "workflow" ? "high" : "medium",
      thinkingWhy: page?.thinking_why ?? (category === "orchestrators" || item.type === "workflow" ? "It runs several skills in a row. Give it your strongest model." : ""),
      inputs: asPorts(item.inputs),
      outputs: asPorts(item.outputs),
      uses: item.uses ?? [],
      steps,
      ...(item.execution === "coordinator" ? { execution: "coordinator" } : {}),
      origin: imported ? "imported" : item.origin ?? "own",
      ...(item.source ? { source: { by: String(item.source.by ?? ""), repo: String(item.source.repo ?? ""), url: String(item.source.url ?? ""), licence: String(item.source.licence ?? ""), original: String(item.source.original_name ?? ""), commit: String(item.source.commit ?? "") } } : {}),
      ...(Array.isArray(item.warnings) && item.warnings.length ? { warnings: item.warnings.map(String) } : {}),
      // Tested = passed the safety scan (tools/audit-library.mjs; anything that fails goes in quarantine.yaml and is
      // withheld below) and has a real input/output structure: what goes in, and what you get.
      tested: hasStructure(page?.output_sample ?? item.output_sample) ? { result: "pass" } : null,
      version: String(item.version ?? "1.0.0"),
      words: skill.split(/\s+/).length,
      // The same look in the other format: a video block's image twin, or the other way round.
      twin: item.twin ?? null,
      // The minds whose work the skill comes from (docs/SOURCE-SKILLS-PRD.md). Checked against the roster below.
      minds: Array.isArray(item.minds) ? item.minds.map(String) : [],
      files,
      added: lastChange(folder, ["item.yaml", "page.yaml", path.basename(skillPath)], pagePath?.startsWith(WORKFLOW_PAGES) ? pagePath : undefined),
      published: firstSeen(folder, ["item.yaml", "page.yaml", path.basename(skillPath)]),
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
const mindUseCases = new Map();
for (const r of roster.minds) if (!labelsOf(r.slug).length) problems.push(`minds/_labels.yaml has no labels for ${r.slug}`);
for (const r of roster.minds) {
  const folder = path.join(MINDS, r.slug);
  const yamlPath = path.join(folder, "mind.yaml"), skillPath = path.join(folder, "SKILL.md");
  if (!fs.existsSync(yamlPath) || !fs.existsSync(skillPath)) continue;
  let m;
  try { m = YAML.parse(fs.readFileSync(yamlPath, "utf8")); } catch (e) { problems.push(`minds/${r.slug}: ${e.message.split("\n")[0]}`); continue; }
  // Storefront wording stays separate from the person's source profile and pack.
  if (copyEdits[r.slug]) {
    if (copyEdits[r.slug].name !== m.name) throw new Error(`Mind person name changed: ${r.slug}`);
    m = applyDisplayCopy(m, null, copyEdits[r.slug]).item;
    copyUsed.add(r.slug);
  }
  mindUseCases.set(r.slug, m.use_cases ?? []);
  const skill = fs.readFileSync(skillPath, "utf8");
  sourceFactRows.set(path.basename(folder), factChecks.forItem(path.basename(folder), skill));
  fs.mkdirSync(path.join(OUT_SKILLS, r.slug), { recursive: true });
  fs.copyFileSync(skillPath, path.join(OUT_SKILLS, r.slug, "SKILL.md"));
  // The parts go too, so a mind's pack can carry its playbook, personality, knowledge and sources as their own files.
  // Like a skill's files, they ship as one zip (skills/<slug>.zip: <slug>/SKILL.md plus the parts), not one file each.
  const mindFiles = ["playbook.md", "personality.md", "knowledge.md"].filter((f) => fs.existsSync(path.join(folder, f)));
  const srcList = (m.sources ?? []).filter((s) => s.title).map((s) => `${s.n}. ${s.title}${s.by ? `, ${s.by}` : ""} (${s.kind ?? "source"})${s.url ? `: ${s.url}` : ""}`);
  const mindTree = { [`${r.slug}/SKILL.md`]: new TextEncoder().encode(skill.replace(/\r\n?/g, "\n")) };
  for (const f of mindFiles) mindTree[`${r.slug}/${f}`] = fs.readFileSync(path.join(folder, f));
  mindTree[`${r.slug}/sources.md`] = new TextEncoder().encode([`# Sources: ${m.name}`, "", "The public work this mind was built from. knowledge.md cites them as [S1], [S2] and so on.", "", ...srcList, ""].join("\n"));
  if (safety.scanned) mindTree[`${r.slug}/SAFETY.md`] = new TextEncoder().encode(safetyMarkdown(m.name, safety.items[r.slug], safety.scanned));
  fs.writeFileSync(path.join(OUT_SKILLS, `${r.slug}.zip`), zipSync(mindTree, { level: 6, mtime: ZIP_DATE }));
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
    subhead: m.subhead ?? m.summary,
    explain: `${m.known_for}\n\nThis is an AI playing ${first} from public work: ${m.sources.length} public sources, listed below, written into a data set of what they knew and believed and a profile of how they think and talk. It isn't ${first}, and ${first} hasn't endorsed it.${m.living ? ` ${first} is alive, so views can change; it was last checked on ${String(m.last_checked).slice(0, 10)}.` : ""}`,
    when: m.use_cases,
    you_give: ["Your task or question", "Your facts, numbers or draft (optional; it asks once if they matter)", "A role for them, such as \"my investor\" (optional)"],
    you_get: [`Your problem worked on the way ${first} would: their questions, their method, their push-back`, `The answer or the work, in ${first}'s voice, using their ideas by name`, "Anything that goes beyond their public record, marked", "One suggested next step"],
    how_to_use: ["Add the skill to your AI, or copy it and paste it into a chat.", `Ask your question or give the task, such as "${m.use_cases[0]}".`, "Paste the facts that matter.", `To hear ${first} argue with other minds, put them on an advisory council.`],
    output_shape: `<the answer or the piece of work, in ${first}'s voice>\n  <the recommendation, or the work itself, first>\n  <the reasoning, using ${first}'s ideas by name>\n  <[beyond the record] wherever it goes past what they said or did>\n\nMISSING: <facts you didn't give, or none>\nNEXT: <one suggested next step>`,
    ideas,
    hire,
    seats: m.seats,
    // Optional, written in mind.yaml the same way as in a skill's page.yaml.
    ...(Array.isArray(m.not_for) && m.not_for.length ? { not_for: m.not_for } : {}),
    ...(m.output_sample && typeof m.output_sample === "object" ? { output_sample: m.output_sample } : {}),
    pairs: (m.pairs_with ?? []).filter((s) => roster.minds.some((x) => x.slug === s)),
    credits: m.sources.filter((s) => s.title).map((s) => ({ title: String(s.title), by: s.by ? String(s.by) : "", url: s.url && /^https?:\/\//.test(s.url) ? String(s.url) : "", used: "" })),
  };
  page.html = { explain: sub(md.parse(page.explain)), skill: sub(md.parse(bodyOf(skill))) };
  const mindSafety = safetyFor(r.slug);
  if (mindSafety) page.safety = mindSafety;
  fs.writeFileSync(path.join(OUT_PAGES, `${r.slug}.json`), JSON.stringify(page));
  blocks.push({
    slug: r.slug, name: m.name, summary: m.summary, headline: m.name,
    task: "think-with-minds", category: "mind", boards: [], type: "mind", role: "make", job: "minds", level: "beginner",
    ...classifications.fields(r.slug),
    thinking: "medium", thinkingWhy: "It plays one voice from a written data set. Use your strongest model when the stakes are high.",
    seats: m.seats.map((s) => s.seat), area: m.area, also: m.also ?? [], years: m.years ?? "", living: !!m.living, identity: m.identity, labels: labelsOf(r.slug), // the face comes from the roster (lib/data.ts), so it is sent once
    inputs: [{ type: "question", required: true }], outputs: [{ type: "mind_view", required: true }],
    uses: [], steps: [], origin: "own", tested: hasStructure(m.output_sample) ? { result: "pass" } : null, version: String(m.version ?? "1.0.0"), words: skill.split(/\s+/).length,
    twin: null, files: mindFiles, minds: [], skills: [], flows: [], added: lastChange(folder, ["mind.yaml", "page.yaml", "SKILL.md", "knowledge.md", "playbook.md"]), published: firstSeen(folder, ["mind.yaml", "SKILL.md"]),
  });
}

for (const slug of Object.keys(copyEdits)) if (!copyUsed.has(slug)) problems.push(`display-copy.yaml: unknown or unsupported block "${slug}"`);

// Exclude reviewed risks and their dependents from every published asset. Keep sources intact for review.
factChecks.validateKnown(new Set(sourceFactRows.keys()));
console.log("Source-check records:", JSON.stringify(factChecks.summary()));
const quarantineFile = path.join(ROOT, "quarantine.yaml");
const quarantine = fs.existsSync(quarantineFile) ? YAML.parse(fs.readFileSync(quarantineFile, "utf8")) ?? {} : {};
const blocked = quarantineClosure(blocks, Object.keys(quarantine));
for (let i = blocks.length - 1; i >= 0; i--) if (blocked.has(blocks[i].slug)) {
  const slug = blocks[i].slug;
  fs.rmSync(path.join(OUT_SKILLS, slug), { recursive: true, force: true });
  fs.rmSync(path.join(OUT_SKILLS, `${slug}.zip`), { force: true });
  fs.rmSync(path.join(OUT_PAGES, `${slug}.json`), { force: true });
  blocks.splice(i, 1);
}
if (blocked.size) console.log(`Quarantine: ${blocked.size} blocks and their assets withheld`);
// How many workflows use each block: the honest "popular" signal until people can vote.
const bySlug = Object.fromEntries(blocks.map((b) => [b.slug, b]));
classifications.validateSlugs(blocks.map(b => b.slug));
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
// "Skip it when" lines that name another item link to it under its current name, and near-duplicates in one job get a
// "Similar items and how they differ" table (tools/lib/not-for-links.mjs, scripts/lib/similar-items.mjs, siblings.json).
const renamedAll = fs.existsSync(path.join(ROOT, "renamed.json")) ? JSON.parse(fs.readFileSync(path.join(ROOT, "renamed.json"), "utf8")) : {};
const notForIndex = makeNameIndex(blocks.filter((b) => b.headline).map((b) => ({ slug: b.slug, name: b.name, aliases: b.aliases ?? [], href: pagePath(b) })), renamedAll);
const siblingsOf = loadSiblings({ root: ROOT, pagesDir: OUT_PAGES, bySlug, hrefOf: pagePath, renamed: renamedAll });
for (const b of blocks) {
  const f = path.join(OUT_PAGES, `${b.slug}.json`);
  if (!fs.existsSync(f)) continue;
  const pageData = JSON.parse(fs.readFileSync(f, "utf8"));
  const links = linkOverrides.get(b.slug) ?? {};
  for (const slug of [...(links.next ?? []), ...(links.before ?? [])]) if (!bySlug[slug]) problems.push(`${b.slug}: next/before names "${slug}", which isn't a block`);
  pageData.plan = planOf(b, bySlug, blocks, describe, links);
  if (Array.isArray(pageData.not_for)) {
    const nf = linkNotFor(pageData.not_for, notForIndex, b.slug);
    pageData.not_for = nf.lines;
    if (nf.links.length) pageData.not_for_links = nf.links.map(({ line, start, end, href }) => ({ line, start, end, href }));
  }
  const siblings = siblingsOf(b.slug);
  if (siblings) pageData.siblings = siblings;
  // Why it needs that much thinking is only shown on the block's own page, so it travels there, not in blocks.json.
  if (b.thinkingWhy) pageData.thinkingWhy = b.thinkingWhy;
  delete b.thinkingWhy;
  // Facts only the block's own page shows (or nothing does) travel with the page, not in blocks.json.
  pageData.words = b.words; pageData.added = b.added; if (b.tested) pageData.tested = b.tested;
  // The first day it appeared, and the facts its Markdown and JSON twins (src/server/twins.ts) need from blocks.json, so a
  // twin is made from this one file and SKILL.md instead of the whole catalogue.
  if (b.published) pageData.published = b.published;
  pageData.facts = pageFacts(b, { bySlug, describe, taskName: (t) => TASKS.find((x) => x.id === t)?.name });
  // Only the selected page carries source checks; the catalogue list and starter stay small.
  const checks = sourceFactRows.get(b.slug);
  if (checks?.length) pageData.fact_checks = checks;
  // The names of its extra files (a skill's are in its zip; a mind's are served one by one for its pack).
  if (b.files.length) pageData.files = b.files;
  // An imported skill's GitHub link, licence, first name and commit are only shown on its page; the list keeps just the maker.
  if (b.source) pageData.source = b.source;
  // A workflow's step notes are only read on its own page, so they travel there; blocks.json keeps the step slugs.
  if (b.steps.some((s) => s.note)) { pageData.stepNotes = b.steps.map((s) => s.note); b.steps = b.steps.map((s) => ({ uses: s.uses, note: "" })); }
  fs.writeFileSync(f, JSON.stringify(pageData));
}

const usedTypes = new Set(blocks.flatMap((b) => [...b.inputs, ...b.outputs].map((p) => p.type)));
const portTypes = Object.fromEntries([...usedTypes].sort().map((t) => [t, typeDesc[t] ?? null]));

// Old names still work: the site sends an old link to the block's new page.
const renamedFile = path.join(ROOT, "renamed.json");
const renamed = fs.existsSync(renamedFile) ? Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(renamedFile, "utf8"))).filter(([, to]) => blocks.some((b) => b.slug === to))) : {};
// The whole roster goes too, so /minds can show who's coming before their files are built.
const minds = { areas: roster.areas ?? {}, roster: roster.minds.map((m) => ({ slug: m.slug, name: m.name, identity: bySlug[m.slug]?.identity ?? m.identity, area: m.area, seat: m.seat, living: !!m.living, built: !!bySlug[m.slug], face: faces[m.slug] ?? {}, labels: labelsOf(m.slug), useCases: mindUseCases.get(m.slug) ?? [] })), labels: labelFile.labels ?? {} };
// How people ask for each item in their own words (catalogue-items/search-asks.json, written per item without sight of
// any test requests): the words they use that the item's own text does not are added to its cues, so the builder and
// plan_workflow meet "nobody leaves reviews" or "stolen cards" by keyword. Only the new single words travel.
const ASKS_FILE = path.join(ROOT, "search-asks.json"), ASK_WORDS = 30;
if (fs.existsSync(ASKS_FILE)) {
  const asks = JSON.parse(fs.readFileSync(ASKS_FILE, "utf8")).asks ?? {};
  const STOPWORDS = new Set("a an and are as at be but by can do does for from get got have how i if in into is it its just me my no not of on or our so some than that the their them then there they this to too up us want was we what when where which who why will with would you your".split(" "));
  const wordsIn = (text) => (text.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) ?? []).map((w) => w.replace(/'s$/, ""));
  for (const b of blocks) {
    const said = asks[b.slug];
    if (!Array.isArray(said) || !said.length) continue;
    const known = new Set(wordsIn(`${b.name} ${(b.aliases ?? []).join(" ")} ${b.headline ?? ""} ${b.summary} ${b.slug.replace(/-/g, " ")} ${b.cues ?? ""}`));
    const extra = [...new Set(said.flatMap((s) => wordsIn(String(s))))].filter((w) => !known.has(w) && !STOPWORDS.has(w) && w.length > 1).slice(0, ASK_WORDS);
    if (extra.length) b.cues = [b.cues, extra.join(" ")].filter(Boolean).join(" ");
  }
}
// blocks.json is loaded by every page, so each block is sent as small as it can be: fields the list, search, home page and
// builder never read are left out, and a value equal to its default is left out too. loadCatalogue (lib/data.ts) puts them back.
const DEFAULTS = { category: "general", type: "skill", role: "make", job: "ops", level: "intermediate", thinking: "medium", origin: "own", version: "1.0.0", usedIn: 0 };
const wire = (b) => {
  const o = {};
  for (const [k, v] of Object.entries(b)) {
    if (["words", "added", "published", "files", "tested"].includes(k)) continue; // in the page JSON
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
// (copied from example-app-site during prerender) is left out because the saved tour is marked noindex.
const SITE = "https://useaiblocks.com";
const kindPath = (b) => (b.type === "mind" ? "minds" : b.type === "agent" ? "agents" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflows" : b.type === "prompt" ? "prompts" : "skills");
const { TOOLS } = await import("../../mini-tools/index.mjs");
const roles = roleSeeds(blocks);
const roleUrls = roles.length ? ["/roles", ...Array.from({length:Math.ceil(roles.length/24)-1},(_,i)=>`/roles/page/${i+2}`), ...roles.map(r=>`/roles/${r.id}`)] : [];
// The format pages (/skills, /prompts, /workflows, /agents) and /which-one are built by scripts/lib/format-pages.mjs.
const urls = ["/", "/teams", "/compose", "/how-it-works", "/minds", ...FORMAT_PAGE_URLS, ...roleUrls, "/from-a-source", "/community", "/tools", ...[...BROWSER_TOOLS, ...TOOLS].map((t) => `/tools/${t.slug}`), "/apps", "/api-and-mcp", "/me-md", "/train-your-own-ai-agent", ...INFO_PAGES.map(page => page.path), ...blocks.filter((b) => b.headline).map((b) => `/${kindPath(b)}/${b.slug}`)];
urls.push("/get-it-done", "/get-it-done/example", "/get-it-done/status"); // the outcome orchestrator's owner pages (src/outcomes-site)
// One sitemap per kind of page, under a sitemap index, so Search Console shows how each kind is indexed.
// sitemap-jobs.xml (the job hubs) is written by scripts/prerender.mjs, with the same dates as jobHubDates below.
// lastmod is only a date we can vouch for: an item page's is the day its own files (item.yaml, page.yaml, SKILL.md) last
// changed in git, the same date its page shows as "Updated"; a mini tool's is its `updated`, an AI tool guide's its
// last_checked and a policy page's its effective date. Other pages get none. A rebuild never moves any of them.
const lastmod = Object.fromEntries(blocks.filter((b) => b.headline && b.added).map((b) => [`/${kindPath(b)}/${b.slug}`, b.added]));
for (const t of TOOLS) if (t.updated) lastmod[`/tools/${t.slug}`] = String(t.updated).slice(0, 10);
const policyDay = (() => { const t = Date.parse(`${POLICY_DATE} UTC`); return Number.isNaN(t) ? "" : new Date(t).toISOString().slice(0, 10); })();
// The policy and info pages show this date as "Effective and last updated" and carry it as dateModified.
for (const page of INFO_PAGES) if (policyDay) lastmod[page.path] = policyDay;
// An agency agent page whose role page does the same job names the role as canonical, so only the role is listed.
const sameJobAgents = sameJobAgentPages(roles, blocks, (b) => !!b.headline);
const SITEMAPS = { pages: [...urls.filter((u) => !/^\/(skills|workflows|agents|prompts|minds)\//.test(u)), "/tools/growth-channel-planner"], skills: urls.filter((u) => u.startsWith("/skills/")), workflows: urls.filter((u) => u.startsWith("/workflows/")), agents: urls.filter((u) => u.startsWith("/agents/") && !sameJobAgents.has(u)), prompts: urls.filter((u) => u.startsWith("/prompts/")), minds: urls.filter((u) => u.startsWith("/minds/")) };
const aiToolsRoot = path.join(ROOT, "ai-tools");
if (fs.existsSync(aiToolsRoot)) {
  const guides = fs.readdirSync(aiToolsRoot).filter((f) => f.endsWith(".yaml") && !f.startsWith("_")).sort();
  SITEMAPS["ai-tools"] = ["/ai-tools", ...guides.map((f) => `/ai-tools/${f.slice(0, -5)}`)];
  for (const f of guides) {
    try { const checked = YAML.parse(fs.readFileSync(path.join(aiToolsRoot, f), "utf8"))?.last_checked; if (checked) lastmod[`/ai-tools/${f.slice(0, -5)}`] = (checked instanceof Date ? checked.toISOString() : String(checked)).slice(0, 10); } catch { /* build-ai-tools.mjs reports a broken guide */ }
  }
  lastmod["/ai-tools"] = newest(guides.map((f) => lastmod[`/ai-tools/${f.slice(0, -5)}`] ?? ""));
}
// The blog (src/content/blog, src/lib/blog.mjs): its own sitemap, each article dated by its updated or published day.
const blogPosts = fs.existsSync("src/content/blog") ? fs.readdirSync("src/content/blog").filter((f) => f.endsWith(".json")).sort().map((f) => JSON.parse(fs.readFileSync(path.join("src/content/blog", f), "utf8"))) : [];
// The data study is a research page, not a blog post, so it gets its own line under the blog in llms.txt.
const STUDY_JSON = "src/trust-pages/agent-skills-2026.json";
const study = fs.existsSync(STUDY_JSON) ? studyPage(JSON.parse(fs.readFileSync(STUDY_JSON, "utf8"))) : null;
if (blogPosts.length) {
  SITEMAPS.blog = ["/blog", "/guides", ...blogPosts.map((p) => `/blog/${p.slug}`)];
  for (const p of blogPosts) lastmod[`/blog/${p.slug}`] = p.updated ?? p.published ?? "2026-11-05";
  lastmod["/blog"] = newest(blogPosts.map((p) => lastmod[`/blog/${p.slug}`]));
  lastmod["/guides"] = newest(blogPosts.filter((p) => p.category === "Use AI Blocks well").map((p) => lastmod[`/blog/${p.slug}`]));
}
for (const f of fs.readdirSync("public").filter((f) => /^sitemap-.*\.xml$/.test(f))) fs.rmSync(path.join("public", f));
for (const [k, us] of Object.entries(SITEMAPS)) if (us.length) fs.writeFileSync(`public/sitemap-${k}.xml`, sitemapUrlset(us, lastmod));
// Each child carries the newest lastmod of its pages, so a crawler re-reads only the children that changed.
fs.writeFileSync("public/sitemap.xml", sitemapIndex([
  ...Object.keys(SITEMAPS).filter((k) => SITEMAPS[k].length).map((name) => ({ name, lastmod: newest(SITEMAPS[name].map((u) => lastmod[u] ?? "")) })),
  { name: "jobs", lastmod: jobHubDates(blocks).all },
  { name: "guides" }, // How we test and the industry pages, written by scripts/prerender.mjs (scripts/lib/trust-pages.mjs)
]));
// The feeds of new and changed items (the newest 100 by the dates above), linked from the home page, /jobs and llms.txt.
const taskName = (t) => TASKS.find((x) => x.id === t)?.name;
const feed = feedItems(blocks);
fs.writeFileSync(`public${FEEDS.json}`, JSON.stringify(jsonFeed(feed, { taskName }), null, 1) + "\n");
fs.writeFileSync(`public${FEEDS.rss}`, rssFeed(feed, { taskName }));
// Everyone may crawl and index everything: search engines, answer engines and AI assistants. The library is free and
// credited, so training crawlers are allowed too, on purpose. The saved example app is a copy of another app: it is
// noindex by a meta tag and by an X-Robots-Tag header (public/_headers), so robots.txt must NOT block it, or crawlers
// could never read the noindex.
// /data/ stays open because the pages need it to render.
fs.writeFileSync("public/robots.txt", [
  "# AI Blocks: free AI skills, workflows, minds and mini tools.",
  "# Search engines, answer engines and AI assistants are all welcome, including AI training crawlers: the library is free and every skill is credited.",
  "# A short guide for AI assistants: https://useaiblocks.com/llms.txt",
  "# API and MCP documentation: https://useaiblocks.com/api-and-mcp",
  "# Public pages stay crawlable so search engines can read their indexing directives.",
  "User-agent: *", "Allow: /", "",
  "Content-Signal: search=yes, ai-input=yes, ai-train=yes", "",
  `Sitemap: ${SITE}/sitemap.xml`, "",
].join("\n"));

// llms.txt (llmstxt.org): a plain guide to the site for AI assistants. It links one file per job (/llms/<job>.txt),
// each listing that job's pages with their one line, and llms-full.txt is the index of those files.
const TASK_NAMES = Object.fromEntries(TASKS.map(task => [task.id, task.name]));
const paged = blocks.filter((b) => b.headline);
const line = (b) => `- [${b.name}](${SITE}/${kindPath(b)}/${b.slug}): ${b.summary}`;
const byTask = {};
for (const b of paged) if (b.type !== "mind") (byTask[b.task] ??= []).push(b);
const tasksBySize = Object.entries(byTask).sort((a, b) => b[1].length - a[1].length);
const nSkills = paged.filter((b) => b.type !== "mind").length, nMinds = paged.filter((b) => b.type === "mind").length;
const example = paged.find((b) => b.slug === "ad-angle-planner") ?? paged[0];
const intro = [
  "# AI Blocks", "",
  "> Free AI skills, workflows, prompts and minds for real work. Each skill is a reusable SKILL.md for an AI assistant that can read files.", "",
  // How to connect comes first: the MCP server and the API are what an AI uses most (docs/AI-HUB-PRD.md §9).
  ...connectLines(example),
  "## Key facts", "",
  "- Browsing, catalogue downloads and manual workflow assembly are free, with no account needed. AI workflow planning requires sign-in and follows the current service limits.",
  `- ${nSkills} skills, workflows and prompts in ${tasksBySize.length} jobs, ${roles.length} specialists, ${nMinds} minds and ${TOOLS.length} mini tools.`,
  "- Imported skills keep their open-licence sources and credits (MIT, Apache 2.0, BSD, CC BY, CC BY-SA). Local changes are identified on the page and in the skill file.",
  "- Minds are AIs built from a person's public work, with their sources listed. They are not the person. Minds that invest teach frameworks only, never buy or sell advice.",
  "- Skills that scrape websites or need a paid outside account say so on their page.",
  `- Last changed ${newest(paged.map((b) => b.added))}. See the [JSON Feed](${SITE}${FEEDS.json}) or [RSS](${SITE}${FEEDS.rss}) for what changed.`, "",
  "## Planning and privacy", "",
  "- Use search to find relevant skills. A skill page shows what to prepare before it and what can use its result next. Add the steps you need to the builder.",
  "- When planning with your AI, keep the original request and use relevant supplied context, including me.md when available. Read the chosen methods and supporting files. Give each step a clear task, required material, expected result and checks.",
  "- Public API and MCP workflow tools return plans and instructions. They do not run skills or make model calls on your behalf. Your AI runs the work with its own tools and credits. The signed-in website planner uses the AI Blocks service.",
  "- Saved personal and company workflows require their connected account and access checks. Never put credentials or private workflow links in public searches. A prepared plan is not approval to send, spend or publish.", "",
  "## How to use a skill", "",
  `- Every skill has a page and a skill file. For example: [${example.name}](${SITE}/${kindPath(example)}/${example.slug}), and its file [SKILL.md](${SITE}/skills/${example.slug}/SKILL.md). Add the file to your AI as a skill, or paste it into a chat.`,
  `- [Every page by job](${SITE}/jobs), and the whole catalogue as data: [blocks.json](${SITE}/data/blocks.json)`, "",
  "## Main pages", "",
  `- [Plan an AI team](${SITE}/teams): review outcome-first specialist plans, input/output handoffs and permissions. On MCP, start_outcome is the front door for any business goal. The REST routes /api/v1/request-scopes, /api/v1/scoped-work-preparations and /api/v1/recommendation-handoffs turn evidence-backed chosen recommendations into work for the next orchestrator. Work and artifacts remain in the user's AI and authorized local project by default. POST /api/v1/specialist-team-preparations and /api/v1/specialist-team-checkpoints (prepare_specialist_team and checkpoint_specialist_team on signed-in connections) validate current sources and host-reported checkpoints; authenticated personal/company connections support explicit workflow saves, scoped memory and reviewed revocable sharing. No public hosted execution.`,
  `- [Workflow planner](${SITE}/compose): describe a task, review a plan and download it for your AI`,
  `- [Hire an AI specialist](${SITE}/roles): choose a job role, its deliverables and methods, then prepare a complete role pack. MCP tools find_specialist and prepare_specialist choose and onboard a worker for a task. Read aiblocks://roles/{id} for SOUL.md, knowledge, playbook, method routing, connection requirements, editable training/context and permission boundaries. API: GET /api/v1/specialists?task=... and POST /api/v1/specialist-preparations. Execution happens in the user’s AI.`,
  `- [Your me.md](${SITE}/me-md): prepare reusable context for your AI`,
  `- [Train your own AI agent](${SITE}/train-your-own-ai-agent): a step-by-step guide and starter pack for teaching your AI one job your way`,
  `- [Blog](${SITE}/blog): step-by-step guides to using AI for real business work, each with prompts to copy and the free skills that do the job`,
  ...blogPosts.map((p) => `  - [${p.title}](${SITE}/blog/${p.slug}): ${p.description}`),
  ...(study ? [`- [${study.h1}](${SITE}${study.url}): ${study.desc} Data as CSV under CC BY 4.0.`] : []),
  `- [API and MCP](${SITE}/api-and-mcp): connect an AI and read the public API documentation`,
  `- [All skills by job](${SITE}/jobs): every skill, workflow and prompt, sorted by the job it does`,
  `- [How it works](${SITE}/how-it-works): from one prompt to your own AI app`,
  `- [Minds](${SITE}/minds): hire a great thinker's method for your problem`,
  `- [From a source](${SITE}/from-a-source): turn a video, article or course into skills`,
  `- [Mini tools](${SITE}/tools): calculators for prices, margins, discounts and AI costs`,
  `- [Apps](${SITE}/apps): an example AI app and a starter pack`, "",
];
// llms/specialists.txt itself is written by build-roles.mjs, which runs after this file.
const specialistsLine = `- [Specialists](${SITE}/llms/specialists.txt): ${roles.length} AI specialists you can hire, each bundling the methods for one kind of job`;
const jobLine = ([t, bs]) => `- [${TASK_NAMES[t] ?? t}](${SITE}/llms/${t}.txt): ${bs.length} skills and workflows, such as ${bs.slice(0, 2).map((b) => b.name).join(" and ")}`;
fs.rmSync("public/llms", { recursive: true, force: true });
fs.mkdirSync("public/llms", { recursive: true });
for (const [t, bs] of tasksBySize) fs.writeFileSync(`public/llms/${t}.txt`, [`# ${TASK_NAMES[t] ?? t}: AI Blocks`, "", `> ${bs.length} free AI skills and workflows for this job. Each page links its SKILL.md.`, "", ...[...bs].sort((x, y) => x.name.localeCompare(y.name)).map(line), ""].join("\n"));
fs.writeFileSync("public/llms/minds.txt", ["# Minds: AI Blocks", "", "> AIs built from great thinkers' public work. Not the people themselves.", "", ...paged.filter((b) => b.type === "mind").sort((x, y) => x.name.localeCompare(y.name)).map(line), ""].join("\n"));
fs.writeFileSync("public/llms.txt", [...intro, "## Skills by job", "", ...tasksBySize.map(jobLine), `- [Minds](${SITE}/llms/minds.txt): ${nMinds} minds, from founders and investors to writers and scientists`, specialistsLine, "", "## Optional", "", `- [Every job file in one list](${SITE}/llms-full.txt)`, ""].join("\n"));
fs.writeFileSync("public/llms-full.txt", [...intro, "## Every job", "", ...[...tasksBySize].sort((a, b) => (TASK_NAMES[a[0]] ?? a[0]).localeCompare(TASK_NAMES[b[0]] ?? b[0])).map(jobLine), `- [Minds](${SITE}/llms/minds.txt): ${nMinds} minds`, specialistsLine, ""].join("\n"));

// Old addresses answer with a real 301 to the new one (Cloudflare Pages _redirects), so links and search results carry
// over. A rename never changes a block's kind, so one rule each. The app's own routes with no page file come last
// (rewrites, status 200), because dist/404.html turns off Cloudflare's fall back to the app for unknown addresses.
const redirects = Object.entries(renamed).map(([from, to]) => [from, bySlug[to]]).filter(([, b]) => b?.headline).map(([from, b]) => `/${kindPath(b)}/${from} /${kindPath(b)}/${b.slug} 301`);
// Rewrite to canonical asset URLs: .html targets trigger Workers' HTML redirects
// and would erase /space, /people or the shared token from the address bar.
const appRoutes = ["/traction /tools/growth-channel-planner 301", "/apps/starter-pack /apps 301", "/s/* /shared-space-shell 200"];
fs.writeFileSync("public/_redirects", `# Old block names, moved to shorter ones (catalogue-items/renamed.json). Made by scripts/build-index.mjs.\n${redirects.join("\n")}\n\n# App pages with no page file of their own.\n${appRoutes.join("\n")}\n`);
if (redirects.length + appRoutes.length > 2000) problems.push(`_redirects has ${redirects.length + appRoutes.length} rules; Cloudflare Pages allows 2,000`);
console.log(`sitemap: ${urls.length} pages`);
console.log(`${blocks.filter((b) => b.headline).length} of ${blocks.length} have a page`);
console.log(`${blocks.length} blocks (${blocks.filter((b) => b.category === "general").length} general, ${blocks.filter((b) => b.category === "ecommerce").length} ecommerce, ${blocks.filter((b) => b.category === "orchestrator").length} orchestrators, ${blocks.filter((b) => b.category === "agent").length} agents, ${blocks.filter((b) => b.category === "mind").length} minds)`);
if (problems.length) { console.error("Problems:\n  " + problems.join("\n  ")); process.exitCode = 1; }
