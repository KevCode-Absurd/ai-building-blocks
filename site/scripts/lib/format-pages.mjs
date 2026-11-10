// The format pages: /skills, /prompts, /workflows and /agents (one page per format, where /skills and the rest used
// to be dead ends although every item lives under them), and /which-one, which compares the formats in a small table.
// Plain pages built without the app, like the job hubs: scripts/prerender.mjs renders each page object into the site
// shell, and scripts/build-index.mjs lists their addresses in sitemap-pages.xml. /minds and /tools keep their own
// pages; formatIntro() gives their plain copy the same "what it is and when to use it" paragraph.
// Every count comes from the catalogue passed in. Nothing here is typed in by hand.
import { AGENTS_SITE, FORMATS, TOOL_FORMAT, WHICH_ONE, formatOfKind } from "../../src/lib/formats.mjs";
import { KIND_GLOSSARY } from "../../src/lib/kinds-glossary.ts";

const SITE = "https://useaiblocks.com";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const num = (n) => n.toLocaleString("en-US");
const COUNT_WORDS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight"];

/** The format id of a catalogue block: skill, prompt, workflow, agent or mind. */
export const kindOf = (b) => (b.type === "mind" ? "mind" : b.type === "agent" ? "agent" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflow" : b.type === "prompt" ? "prompt" : "skill");
export const hrefOf = (b) => `${formatOfKind(kindOf(b)).path}/${b.slug}`;
const hasPage = (b) => b.headline !== "";

/** The formats that get a page from this file (minds have /minds already). */
export const PAGE_FORMATS = FORMATS.filter((f) => f.id !== "mind");
/** Every address this file builds, for the sitemap and the app's list of plain pages. */
export const FORMAT_PAGE_URLS = [...PAGE_FORMATS.map((f) => f.path), WHICH_ONE.path];

const used = (b) => (Array.isArray(b.usedIn) ? b.usedIn.length : Number(b.usedIn) || 0);
const ownFirst = (b) => (b.origin === "imported" ? 1 : 0);

/** The items a format page opens with: the picks the home page already features, then safety checked items, the ones
 *  most workflows use, and our own before imported ones. One per job unless it is a pick, so the list shows range. */
export function topItems(blocks, kind, { picks = [], count = 12, perJob = 1 } = {}) {
  const pool = blocks.filter((b) => hasPage(b) && kindOf(b) === kind);
  const bySlug = new Map(pool.map((b) => [b.slug, b]));
  const ranked = [...pool].sort((a, b) => Number(!!b.tested) - Number(!!a.tested) || used(b) - used(a) || ownFirst(a) - ownFirst(b) || a.name.localeCompare(b.name));
  const out = [], perTask = new Map();
  for (const b of [...picks.map((s) => bySlug.get(s)).filter(Boolean), ...ranked]) {
    if (out.includes(b)) continue;
    const n = perTask.get(b.task) ?? 0;
    if (kind !== "mind" && n >= perJob && !picks.includes(b.slug)) continue;
    perTask.set(b.task, n + 1);
    out.push(b);
    if (out.length === count) break;
  }
  return out;
}

const arrow = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const card = (b) => {
  const f = formatOfKind(kindOf(b));
  return `<a class="card hub-card" href="${hrefOf(b)}"><span class="nm">${esc(b.name)}</span><span class="peek">${esc(b.summary)}</span><span class="card-footer"><span class="meta secondary-meta"><span class="kind">${f.name}</span>${b.tested ? `<span class="from trust tested">Safety checked</span>` : ""}</span><span class="view">View the ${f.noun}${arrow}</span></span></a>`;
};

/** The row of format links on every format page. The page you are on is marked, not linked. */
export function formatBar(current = "") {
  const links = [...FORMATS, TOOL_FORMAT].map((f) => (f.path === current ? `<b aria-current="page">${f.plural}</b>` : `<a href="${f.path}">${f.plural}</a>`));
  const which = current === WHICH_ONE.path ? `<b aria-current="page">${esc(WHICH_ONE.question)}</b>` : `<a href="${WHICH_ONE.path}">${esc(WHICH_ONE.question)}</a>`;
  return `<nav class="hub-pages fmt-bar" aria-label="Formats">${links.join("")}${which}</nav>`;
}

const stepsHtml = (steps) => `<ol class="bz-how fmt-steps">${steps.map(([name, line], i) => `<li><span class="bz-how-n">${i + 1}</span><b>${esc(name)}</b><span>${esc(line)}</span></li>`).join("")}</ol>`;

/** Search inside one format: the library on the home page opens with this format chosen and the words typed here. */
export function formatSearch(format, count) {
  const label = `Search ${num(count)} ${format.plural.toLowerCase()}`;
  return `<form class="search big hub-search" action="/#library" method="get" role="search"><input type="hidden" name="kind" value="${format.id}" /><input type="search" name="q" placeholder="${esc(label)}" aria-label="${esc(label)}" autocomplete="off" /><button class="btn btn-primary" type="submit">Search</button></form>`;
}

/** "What a mind is, and when to use one" for a page that already exists (/minds, /tools). */
export function formatIntro(format) {
  return `<section id="format"><h2 class="hub-h2">What ${format.a} ${format.noun} is, and when to use one</h2><p class="hub-gets">${esc(format.what)} ${esc(format.choose)}</p><p class="hub-links"><a href="${WHICH_ONE.path}">${esc(WHICH_ONE.question)}</a></p></section>`;
}

const SEO = {
  skill: ["Free AI skills: saved steps your AI can reuse | AI Blocks", (n) => `${num(n)} free AI skills. Each one is a set of saved instructions for a job. Add it to Claude, ChatGPT or Gemini once, then ask for it by name.`],
  prompt: ["Free AI prompts to paste into ChatGPT or Claude | AI Blocks", (n) => `${num(n)} free AI prompts. Each one is a single message. Paste it into Claude, ChatGPT or Gemini, add your details and get one result.`],
  workflow: ["Free AI workflows: whole jobs, step by step | AI Blocks", (n) => `${num(n)} free AI workflows. Each one joins several skills in order, so your AI can do a whole job in one run. Download one and try it.`],
  agent: ["Free AI agents: instructions for a whole job | AI Blocks", (n) => `${num(n)} free AI agents. Each one is a pack of instructions for a repeatable job. Your AI works through the steps and you check the result.`],
};

/** One format's page. `blocks` is the whole catalogue; `picks` are slugs to show first; `taskNames` maps job ids to
 *  names; `jobExists(id)` says whether /jobs/<id> is built. */
export function formatPage(format, { blocks, picks = [], taskNames = {}, jobExists = () => true }) {
  const all = blocks.filter((b) => hasPage(b) && kindOf(b) === format.id);
  const top = topItems(blocks, format.id, { picks });
  const perJob = new Map();
  for (const b of all) if (b.task) perJob.set(b.task, (perJob.get(b.task) ?? 0) + 1);
  const jobs = [...perJob].filter(([t]) => taskNames[t] && jobExists(t)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12);
  const lower = format.plural.toLowerCase();
  const specialist = KIND_GLOSSARY.find((k) => k.id === "specialist").define;
  const near = format.id === "agent"
    ? `<p class="hub-gets">Two other things here sound like an agent. A <a href="/roles">specialist</a> is ${esc(specialist.replace(/^A /, "a ").replace(/\.$/, ""))}. The <a href="${AGENTS_SITE}">agents site</a> has named agents, each with a pack you download and use in your own AI.</p>`
    : "";
  const [documentTitle, describe] = SEO[format.id];
  return {
    url: format.path, hub: true, plain: true, collection: true, crumbs: [[WHICH_ONE.label, WHICH_ONE.path]],
    title: `${format.plural}: free to download and use in your AI`, documentTitle, desc: describe(all.length), h1: format.plural,
    count: all.length, top,
    body: [
      `<p class="bp-sub">${num(all.length)} free ${lower} to download and use in Claude, ChatGPT or Gemini.</p>`,
      formatBar(format.path),
      `<h2 class="hub-h2">What ${format.a} ${format.noun} is, and when to use one</h2><p class="hub-gets">${esc(format.what)} ${esc(format.choose)}</p>${near}`,
      `<h2 class="hub-h2">How to use ${format.a} ${format.noun}</h2>${stepsHtml(format.steps)}`,
      `<h2 class="hub-h2">Find ${format.a} ${format.noun}</h2>${formatSearch(format, all.length)}<p class="hub-links"><a href="/?kind=${format.id}#library">Browse all ${num(all.length)} ${lower}</a>${format.id === "workflow" ? `<a href="/compose">Build a workflow from your goal</a>` : ""}</p>`,
      top.length ? `<h2 class="hub-h2">Start with these</h2><div class="grid hub-grid">${top.map(card).join("")}</div>` : "",
      jobs.length ? `<h2 class="hub-h2">${format.plural} by job</h2><p class="hub-links fmt-jobs">${jobs.map(([t, n]) => `<a href="/jobs/${t}">${esc(taskNames[t])} (${num(n)})</a>`).join("")}<a href="/jobs">All jobs</a></p>` : "",
      `<p class="hub-links"><span>Not sure this is the right format?</span><a href="${WHICH_ONE.path}">${esc(WHICH_ONE.question)}</a><a href="/how-it-works">How it works</a></p>`,
    ].join(""),
    main: { "@type": "ItemList", numberOfItems: top.length, itemListElement: top.map((b, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${hrefOf(b)}`, name: b.name })) },
  };
}

/** /which-one: every format in one table, each with a real item from the library as its example.
 *  `tools` are the browser tools ([{ slug, name, summary }]); `toolExample` is the slug to show. */
export function whichOnePage({ blocks, tools = [], toolExample = "", picks = {} }) {
  const problems = [];
  const bySlug = new Map(blocks.filter(hasPage).map((b) => [b.slug, b]));
  const count = (id) => blocks.filter((b) => hasPage(b) && kindOf(b) === id).length;
  const rows = FORMATS.map((f) => {
    let b = bySlug.get(f.example);
    // A renamed or removed example falls back to the format's top item; a format with nothing to show stops the build.
    if (!b || kindOf(b) !== f.id) b = topItems(blocks, f.id, { picks: picks[f.id] ?? [], count: 1 })[0];
    if (!b) problems.push(`${WHICH_ONE.path}: no ${f.noun} in the catalogue to show as an example`);
    return { f, n: count(f.id), example: b ? { href: hrefOf(b), name: b.name, line: b.summary } : null };
  });
  const tool = tools.find((t) => t.slug === toolExample) ?? tools[0];
  rows.push({ f: TOOL_FORMAT, n: tools.length, example: tool ? { href: `/tools/${tool.slug}`, name: tool.name ?? tool.short, line: tool.summary } : null });
  const cell = (label, html) => `<td data-label="${label}">${html}</td>`;
  const table = `<table class="fmt-table"><thead><tr><th scope="col">Format</th><th scope="col">What it is</th><th scope="col">Use it when</th><th scope="col">A real example</th></tr></thead><tbody>${rows.map(({ f, n, example }) =>
    `<tr><th scope="row"><a href="${f.path}">${f.name}</a><span class="fmt-count">${num(n)} ${f.id === "tool" ? "on the Tools page" : "in the library"}</span></th>${cell("What it is", esc(f.define))}${cell("Use it when", esc(f.useWhen))}${cell("A real example", example ? `<a href="${example.href}">${esc(example.name)}</a><span>${esc(example.line)}</span>` : "")}</tr>`).join("")}</tbody></table>`;
  const specialist = KIND_GLOSSARY.find((k) => k.id === "specialist").define;
  const listed = rows.map(({ f }) => [f.plural, f.path]);
  return {
    problems,
    page: {
      url: WHICH_ONE.path, hub: true, plain: true, collection: true, crumbs: [],
      title: `${WHICH_ONE.label}: which one do I need?`, documentTitle: "AI skills, prompts and workflows: which to use | AI Blocks",
      desc: "Compare the formats in the AI Blocks library in one table: prompts, skills, workflows, agents, minds and tools. Each has a real example to open.",
      h1: `${WHICH_ONE.label}: which one do I need?`,
      body: [
        `<p class="bp-sub">The library has ${COUNT_WORDS[rows.length] ?? rows.length} formats. Pick by the job in front of you, and start with the smallest one that does it.</p>`,
        formatBar(WHICH_ONE.path),
        `<h2 class="hub-h2">The formats side by side</h2>${table}`,
        `<h2 class="hub-h2">How to use one</h2>${stepsHtml([["Download", "Open the item and press its Download button. Everything in the library is free, and you need no account."], ["Add it to your AI", "Add the file to Claude, ChatGPT or Gemini. The item's page shows the steps for your AI."], ["Ask", "Give it what its page lists and ask for the result. Your AI does the work."]])}<p class="hub-gets">Tools are the exception. A tool runs on its own page, with nothing to download.</p>`,
        `<h2 class="hub-h2">Names that sound alike</h2><ul class="hub-list">`
          + `<li><a href="/roles">Specialists</a><span>${esc(specialist)} An agent is one pack of instructions for one job. A specialist brings several methods for a whole role.</span></li>`
          + `<li><a href="${AGENTS_SITE}">Agents on the agents site</a><span>Named agents, each with a pack you download and use in your own AI. The agents in this library are single instruction packs.</span></li>`
          + `<li><a href="/ai-tools">AI tool guides</a><span>Plain guides to AI products, with pricing notes and sources. The tools on this site are calculators that run in your browser.</span></li>`
          + `</ul>`,
        `<p class="hub-links"><span>Or start from the job</span><a href="/jobs">All skills by job</a><a href="/#library">Search the library</a><a href="/how-it-works">How it works</a></p>`,
      ].join(""),
      main: { "@type": "ItemList", numberOfItems: listed.length, itemListElement: listed.map(([name, u], i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${u}`, name })) },
    },
  };
}

/** Every page this file builds, plus anything the build should stop for.
 *  `picks` is { skill: [...slugs], prompt: [...], workflow: [...], agent: [...], mind: [...] }. */
export function formatPages({ blocks, picks = {}, taskNames = {}, jobExists = () => true, tools = [], toolExample = "" }) {
  const pages = PAGE_FORMATS.map((f) => formatPage(f, { blocks, picks: picks[f.id] ?? [], taskNames, jobExists }));
  const problems = pages.filter((p) => !p.count).map((p) => `${p.url}: no items of this format in the catalogue`);
  const which = whichOnePage({ blocks, tools, toolExample, picks });
  return { pages: [...pages, which.page], problems: [...problems, ...which.problems] };
}

/** The links to the format pages, for the plain footer under every app page. */
export const formatLinks = () => [...PAGE_FORMATS.map((f) => [f.path, f.plural]), [WHICH_ONE.path, WHICH_ONE.question]];
