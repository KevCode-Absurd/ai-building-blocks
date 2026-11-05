// Builds the trust and industry pages at build time: /how-we-test (from the outcome planner's scorecard) and
// /industries plus one page per industry (from the catalogue). scripts/prerender.mjs renders each page object into the
// site shell and writes dist/sitemap-guides.xml with guidesSitemap(). scripts/build-trust-pages.mjs prints the picks
// and checks every link without a full build.
//
// Picks are real catalogue items: for each job on an industry page, the library search (the same index and ranking
// the site uses) finds skills, prompts, agents and workflows for the job's query, and rankSpecialists finds roles
// for its specialist words. Mini tools are named in industries.mjs and must exist. Nothing is invented: a job with
// no strong match shows fewer items, and a page that would be empty fails the build.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildLibrarySearchIndex, searchLibraryIndex } from "../../src/lib/library-search-core.ts";
import { rankLibraryResults } from "../../src/lib/library-rank.ts";
import { makeSearchDocument } from "../../src/lib/search-document.mjs";
import { rankSpecialists } from "../../src/roles/specialist-matching.mjs";
import { INDUSTRIES, INDUSTRIES_PATH, START_JOB, FALLBACK_JOB_PATH } from "../../src/trust-pages/industries.mjs";
import { HOW_WE_TEST_PATH, howWeTestPage } from "../../src/trust-pages/how-we-test.mjs";
import { safetyPage } from "../../src/trust-pages/safety-check.mjs";
import { BOARDS, KEPT_PAGES } from "../../src/trust-pages/boards.mjs";
import { boardPages } from "./board-pages.mjs";
import { readFixes } from "./board-map.mjs";

const SITE = "https://useaiblocks.com";
const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EVALS = path.join(SITE_ROOT, "src/outcomes/evals");
// The safety scan's results (tools/safety-scan.mjs write), read for /how-we-check-safety.
const SAFETY_FILE = path.resolve(process.env.CATALOGUE_ROOT || path.join(SITE_ROOT, "../catalogue-items"), "_safety.json");

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const kindPath = b => (b.type === "mind" ? "minds" : b.type === "agent" ? "agents" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflows" : b.type === "prompt" ? "prompts" : "skills");
export const hrefOf = b => `/${kindPath(b)}/${b.slug}`;
const KIND_WORD = { skills: "Skill", prompts: "Prompt", agents: "Agent", workflows: "Workflow" };
// Items that are not for an owner's business work: developer copilots for one product, investing and academic items.
// The engineering page is the exception for developer items.
const NOT_FOR_OWNERS = /^copilot-|invest|portfolio|stock-pick|thesis|dissertation|academic/;

/** The How we test page, read from the scorecard, cases and rubric in src/outcomes/evals (read only). */
export async function howWeTest({ evalsDir = EVALS } = {}) {
  const card = JSON.parse(fs.readFileSync(path.join(evalsDir, "scorecard.json"), "utf8"));
  const { CASES } = await import(new URL(`file:///${path.join(evalsDir, "cases.mjs").replace(/\\/g, "/")}`).href);
  const rubric = await import(new URL(`file:///${path.join(evalsDir, "rubric.mjs").replace(/\\/g, "/")}`).href);
  const { rubricChecks } = await import("../../src/trust-pages/how-we-test.mjs");
  const checks = rubricChecks(fs.readFileSync(path.join(evalsDir, "rubric.mjs"), "utf8"));
  if (!checks.length) throw Error("trust-pages: no scored checks found in rubric.mjs");
  return howWeTestPage({ card, cases: CASES, checks, controls: rubric.CONTROLS, passScore: rubric.PASS_SCORE, tolerance: rubric.CASE_TOLERANCE });
}

/** A search over the catalogue's titles, summaries and page text, ranked the way the site ranks the library. */
export function catalogueSearch(cat, readPage) {
  const blocks = cat.blocks.filter(b => b.headline !== "" && b.type !== "mind");
  const docs = blocks.map(b => makeSearchDocument(b, readPage(b.slug) ?? {}));
  const index = buildLibrarySearchIndex(docs, "0".repeat(64));
  return (query, { limit = 4, pool = blocks } = {}) => {
    const hits = searchLibraryIndex(index, query);
    const ranked = rankLibraryResults(pool.filter(b => hits.has(b.slug)), hits, query, { isTested: b => !!b.tested });
    return ranked.slice(0, limit);
  };
}

/** For each industry: its jobs with matching items and specialists, its workflows and its mini tools. */
export function pickIndustryItems({ cat, readPage, roles, tools }) {
  const search = catalogueSearch(cat, readPage);
  const toolBySlug = new Map(tools.map(t => [t.slug, t]));
  const problems = [];
  const industries = INDUSTRIES.map(ind => {
    const used = new Set();
    const owner = b => ind.slug === "engineering" || !NOT_FOR_OWNERS.test(b.slug);
    const jobs = ind.jobs.map(job => {
      // The name must say the job (job.must), so a loose word match ("web" in a 3D scene builder) never shows up.
      const named = job.must ? new RegExp(job.must, "i") : null;
      const found = search(job.query, { limit: 20 }).filter(b => owner(b) && !used.has(b.slug) && (!named || named.test(b.name)));
      const items = found.filter(b => kindPath(b) !== "workflows").slice(0, 3);
      const workflow = found.find(b => kindPath(b) === "workflows");
      for (const b of [...items, workflow].filter(Boolean)) used.add(b.slug);
      if (!items.length && !workflow) problems.push(`${ind.slug}: no catalogue match for "${job.job}" (query "${job.query}")`);
      return { ...job, items, workflow };
    });
    const seenRoles = new Set();
    const specialists = [];
    for (const job of ind.jobs) {
      // The best match, or the best one whose name says the job when the job names one (job.role).
      const ranked = rankSpecialists(roles, job.specialist, 8).filter(r => !seenRoles.has(r.id));
      const named = job.role ? new RegExp(job.role, "i") : null;
      const pick = (named && ranked.find(r => named.test(r.name))) || ranked[0];
      if (pick) { seenRoles.add(pick.id); specialists.push({ ...pick, job: job.job }); }
    }
    if (!specialists.length) problems.push(`${ind.slug}: no specialist found`);
    const miniTools = ind.tools.map(slug => toolBySlug.get(slug) ?? (problems.push(`${ind.slug}: mini tool "${slug}" does not exist`), null)).filter(Boolean);
    return { ...ind, jobs, specialists, miniTools };
  });
  return { industries, problems };
}

/** Where "Start this job" goes: the outcome page with the job filled in, or the planner when that page is not built. */
export function startJobHref(request, routeExists) {
  if (!routeExists(START_JOB.path)) return FALLBACK_JOB_PATH;
  return START_JOB.param ? `${START_JOB.path}?${START_JOB.param}=${encodeURIComponent(request)}` : START_JOB.path;
}

const itemLine = b => `<li><a href="${hrefOf(b)}">${esc(b.name)}</a><span class="from">${KIND_WORD[kindPath(b)] ?? "Skill"}</span>${b.tested ? `<span class="from trust tested">Safety checked</span>` : ""}<span>${esc(b.summary)}</span></li>`;

function industryBody(ind, { routeExists, scoreFor, all }) {
  const others = all.filter(x => x.slug !== ind.slug);
  const score = scoreFor(ind.eval);
  const workflows = ind.jobs.map(j => j.workflow).filter(Boolean);
  const jobs = ind.jobs.map((j, i) => `<section class="hub-area" id="job-${i + 1}"><h3>${esc(j.job)}</h3><p>${esc(j.why)}</p>${j.items.length ? `<ul class="hub-list">${j.items.map(itemLine).join("")}</ul>` : ""}<p class="hub-links"><a href="${esc(startJobHref(j.request, routeExists))}">Start this job</a>${j.workflow ? `<a href="${hrefOf(j.workflow)}">See the workflow</a>` : ""}</p></section>`).join("");
  return [
    ...ind.intro.map((p, i) => `<p class="${i ? "hub-gets" : "bp-sub"}">${esc(p)}</p>`),
    ind.example ? `<p class="hub-gets">${esc(ind.example)}</p>` : "",
    `<nav class="hub-areas" aria-label="Jobs on this page">${ind.jobs.map((j, i) => `<a href="#job-${i + 1}">${esc(j.job)}</a>`).join("")}</nav>`,
    `<h2 class="hub-h2">Jobs ${esc(ind.short)} owners bring</h2><p>&ldquo;Start this job&rdquo; opens the job page. Say what you want in your own words, and your AI plans it with our specialists. It asks a few questions first and waits for your yes before any work starts.</p>${jobs}`,
    ind.specialists.length ? `<h2 class="hub-h2">AI specialists to hire</h2><p>A specialist is a ready-made role for your AI, with its own methods and checks.</p><ul class="hub-list">${ind.specialists.map(r => `<li><a href="/roles/${esc(r.id)}">${esc(r.name)}</a><span>For: ${esc(j_lower(r.job))}. ${esc(r.summary)}</span></li>`).join("")}</ul>` : "",
    workflows.length ? `<h2 class="hub-h2">Workflows that fit</h2><p>A workflow joins several skills into one job, step by step.</p><ul class="hub-list">${workflows.map(itemLine).join("")}</ul>` : "",
    ind.miniTools.length ? `<h2 class="hub-h2">Free calculators and tools</h2><p>They run in your browser. Nothing you type is sent to us.</p><ul class="hub-list">${ind.miniTools.map(t => `<li><a href="/tools/${esc(t.slug)}">${esc(t.short ?? t.name)}</a><span>${esc(t.summary)}</span></li>`).join("")}</ul>` : "",
    score ? `<h2 class="hub-h2">How we check plans for ${esc(ind.name.toLowerCase())}</h2><p>We test the job planner on ${score.count} requests like these before each release. Their average score is ${score.average} out of 100. The test checks the plan, not the finished work. <a href="${HOW_WE_TEST_PATH}">See how we test</a>.</p>` : "",
    `<p class="hub-links"><span>By business</span>${BOARDS.slice(0, 6).map(x => `<a href="${INDUSTRIES_PATH}/${x.slug}">${esc(x.name)}</a>`).join("")}<a href="${INDUSTRIES_PATH}">All businesses</a></p>`,
  ].join("");
}
/** A board that used to be an industry page keeps its common jobs and its planner score, below the stages. */
function industryExtras(ind, { routeExists, scoreFor }) {
  if (!ind) return "";
  const score = scoreFor(ind.eval);
  const jobs = ind.jobs.map((j) => `<li><a href="${esc(startJobHref(j.request, routeExists))}">${esc(j.job)}</a><span>${esc(j.why)}${j.workflow ? ` Workflow: <a href="${hrefOf(j.workflow)}">${esc(j.workflow.name)}</a>.` : ""}</span></li>`).join("");
  return [
    `<h2 class="hub-h2">Common jobs ${esc(ind.short)} owners bring</h2><p>Pick one to start. Say what you want in your own words, and your AI plans it with our specialists. It asks a few questions first and waits for your yes before any work starts.</p><ul class="hub-list">${jobs}</ul>`,
    score ? `<h2 class="hub-h2">How we check plans for ${esc(ind.name.toLowerCase())}</h2><p>We test the job planner on ${score.count} requests like these before each release. Their average score is ${score.average} out of 100. The test checks the plan, not the finished work. <a href="${HOW_WE_TEST_PATH}">See how we test</a>.</p>` : "",
  ].join("");
}
const j_lower = s => (s ? s[0].toLowerCase() + s.slice(1) : s);

/** Every page object for prerender's render(): /how-we-test, /industries and one per industry. */
export async function trustPages({ cat, readPage, roles, tools, routeExists = () => false, evalsDir = EVALS }) {
  const test = await howWeTest({ evalsDir });
  const { industries, problems } = pickIndustryItems({ cat, readPage, roles, tools });
  const card = JSON.parse(fs.readFileSync(path.join(evalsDir, "scorecard.json"), "utf8"));
  const scoreFor = id => { const n = card.cases.filter(c => c.industry === id && typeof c.score === "number").length; return n && typeof card.industries?.[id] === "number" ? { count: n, average: card.industries[id] } : null; };
  const pages = [{ ...test, crumbs: [], hub: true }];
  if (fs.existsSync(SAFETY_FILE)) pages.push({ ...safetyPage(JSON.parse(fs.readFileSync(SAFETY_FILE, "utf8"))), crumbs: [], hub: true });
  // The business boards own /industries and the industry pages they replaced; finance and engineering keep theirs.
  const byIndustry = Object.fromEntries(industries.map((ind) => [ind.slug, ind]));
  const kept = industries.filter((ind) => KEPT_PAGES.includes(ind.slug));
  const boards = boardPages({
    blocks: cat.blocks, roles: roles.roles, tools, fixes: readFixes().fixes, jobExists: () => true,
    industryExtras: (slug) => industryExtras(byIndustry[slug], { routeExists, scoreFor }),
    keptPages: kept.map((ind) => ({ url: `${INDUSTRIES_PATH}/${ind.slug}`, name: ind.name, line: `${ind.jobs.slice(0, 3).map((j) => j.job).join(", ")}, and more.` })),
  });
  problems.push(...boards.problems);
  pages.push(...boards.pages);
  for (const ind of kept) {
    const listed = [...ind.jobs.flatMap(j => [...j.items, j.workflow].filter(Boolean)).map(b => [b.name, hrefOf(b)]), ...ind.specialists.map(r => [r.name, `/roles/${r.id}`]), ...ind.miniTools.map(t => [t.short ?? t.name, `/tools/${t.slug}`])];
    if (listed.length < 6) problems.push(`${ind.slug}: only ${listed.length} catalogue items found`);
    pages.push({
      url: `${INDUSTRIES_PATH}/${ind.slug}`, hub: true, collection: true, crumbs: [["AI help by business", INDUSTRIES_PATH]],
      title: ind.title, documentTitle: ind.documentTitle, desc: ind.desc, h1: ind.title,
      body: industryBody(ind, { routeExists, scoreFor, all: industries }),
      main: { "@type": "ItemList", numberOfItems: listed.length, itemListElement: listed.map(([name, u], i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${u}`, name })) },
      picks: ind,
    });
  }
  void BOARDS;
  return { pages, problems };
}

/** Every internal link in a page body: { href, path }. */
export const bodyLinks = html => [...String(html).matchAll(/href="(\/[^"]*)"/g)].map(m => ({ href: m[1].replace(/&amp;/g, "&"), path: m[1].split(/[?#]/)[0] || "/" }));

/** Links that go nowhere: each must be a catalogue page, a role, a mini tool, a guide page or a known site path. */
export function brokenLinks(pages, { cat, roles, tools, sitePaths = [] }) {
  const known = new Set([...cat.blocks.filter(b => b.headline !== "").map(hrefOf), ...roles.roles.map(r => `/roles/${r.id}`), ...tools.map(t => `/tools/${t.slug}`), ...pages.map(p => p.url), ...sitePaths]);
  return pages.flatMap(p => bodyLinks(p.body).filter(l => !known.has(l.path)).map(l => `${p.url} -> ${l.href}`));
}

/** dist/sitemap-guides.xml: the guide pages, listed once (build-index's sitemap index points to it). */
export function guidesSitemap(pages, dist) {
  const day = p => (/^\d{4}-\d{2}-\d{2}$/.test(p.modified ?? "") ? `<lastmod>${p.modified}</lastmod>` : "");
  fs.writeFileSync(path.join(dist, "sitemap-guides.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>${SITE}${p.url}</loc>${day(p)}</url>`).join("\n")}\n</urlset>\n`);
}
