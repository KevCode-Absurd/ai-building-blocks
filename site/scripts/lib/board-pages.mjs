// The business board pages: /industries (the list), /industries/<board> (the journey in 8 stages) and
// /industries/<board>/<stage> (everything made for that stage, when there is enough of it). Plain prerendered pages
// in the guides sitemap, built from scripts/lib/board-map.mjs. Words live in src/trust-pages/boards.mjs.
import { BOARDS, BOARDS_PATH, STAGES } from "../../src/trust-pages/boards.mjs";
import { playbookHref } from "../../src/trust-pages/board-names.mjs";
import { TASKS } from "../../src/lib/catalogue-taxonomy.mjs";
import { DESC, fitTitle, trimDescription } from "../../src/lib/seo-meta.mjs";
import { mapAll } from "./board-map.mjs";

const SITE = "https://useaiblocks.com";
const BRAND = "AI Blocks";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Lower-case the first letter, but leave a name like SaaS or AI alone.
const lower = (s) => (s && !/^[A-Z]{2}|^[A-Z][a-z]*[A-Z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const KIND_PATH = { agent: "agents", workflow: "workflows", prompt: "prompts", skill: "skills" };
const KIND_WORD = { agent: "Agent", workflow: "Workflow", prompt: "Prompt", skill: "Skill" };
const TASK_NAMES = Object.fromEntries(TASKS.map((t) => [t.id, t.name]));
const itemHref = (b) => `/${KIND_PATH[b.kind] ?? "skills"}/${b.slug}`;

/** How many made-for items and specialists a stage needs before it gets a page of its own. */
export const STAGE_PAGE_MIN = 8;
const ON_BOARD = 6;      // items shown per stage on the board page
const ROLES_ON_BOARD = 3;
const TOOLS_ON_BOARD = 3;
const PER_JOB = 30;      // made-for items per job on a stage page; the job page has the rest
const GENERAL_ON_STAGE = 12;

const itemLine = (b, made) => `<li><a href="${itemHref(b)}">${esc(b.name)}</a><span class="from">${KIND_WORD[b.kind] ?? "Skill"}</span>${b.tested ? `<span class="from trust tested">Safety checked</span>` : ""}${made ? "" : `<span class="from">Any business</span>`}<span>${esc(b.summary)}</span></li>`;
const roleLink = (r) => `<a href="/roles/${esc(r.id)}">${esc(r.name)}</a>`;
const toolLink = (t) => `<a href="/tools/${esc(t.slug)}">${esc(t.short ?? t.name)}</a>`;
const stageUrl = (board, st) => `${BOARDS_PATH}/${board.slug}/${st}`;

/** A board's stages with their picks: made-for first, then useful-to-any-business items to fill the stage. */
function stagesOf(board, map, jobExists) {
  return STAGES.map((s, i) => {
    const at = map[board.slug][s.id];
    const [label, line] = board.stages[s.id];
    const shown = [...at.made.slice(0, ON_BOARD).map((b) => [b, true]), ...at.general.slice(0, Math.max(0, ON_BOARD - at.made.length)).map((b) => [b, false])];
    const roles = [...at.roles, ...at.generalRoles].slice(0, ROLES_ON_BOARD);
    const tools = at.tools.slice(0, TOOLS_ON_BOARD);
    const own = at.made.length + at.roles.length >= STAGE_PAGE_MIN;
    const jobs = [...new Set([...at.made, ...at.general].map((b) => b.task))].filter((t) => jobExists(t)).slice(0, 6);
    return { ...s, n: i + 1, label, line, at, shown, roles, tools, own, jobs };
  });
}

function boardBody(board, stages, { all, industry, extras }) {
  const madeCount = stages.reduce((n, s) => n + s.at.made.length, 0);
  const roleCount = stages.reduce((n, s) => n + s.at.roles.length, 0);
  const parts = [
    `<p class="bp-sub">${esc(board.intro)}</p>`,
    `<p class="hub-gets">${madeCount ? `${madeCount.toLocaleString("en-US")} skills, workflows and agents${roleCount ? ` and ${roleCount} specialists` : ""} are made for ${esc(board.short)} owners. ` : ""}Each stage lists those first. Items marked &ldquo;Any business&rdquo; fit every business and fill the gaps.</p>`,
    `<p class="hub-links"><span>For your AI</span><a href="${playbookHref(board.slug)}" download>Download the ${esc(lower(board.name))} playbook</a></p>`,
    `<p class="small">The playbook tells your AI what ${/^[aeiouAEIOU]/.test(board.short) ? "an" : "a"} ${esc(board.short)} business needs at each stage. Set your kind of business in your brand file, and every download includes it.</p>`,
    `<nav class="hub-areas" aria-label="Stages">${stages.map((s) => `<a href="#${s.id}">${s.n}. ${esc(s.label)}</a>`).join("")}</nav>`,
    ...stages.map((s) => `<section class="hub-area" id="${s.id}"><h2 class="hub-h2">${s.n}. ${esc(s.label)}</h2><p>${esc(s.line)}</p>`
      + (s.shown.length ? `<ul class="hub-list">${s.shown.map(([b, made]) => itemLine(b, made)).join("")}</ul>` : "")
      + (s.roles.length ? `<p class="hub-links"><span>Specialists</span>${s.roles.map(roleLink).join("")}</p>` : "")
      + (s.tools.length ? `<p class="hub-links"><span>Free tools</span>${s.tools.map(toolLink).join("")}</p>` : "")
      + (s.own ? `<p class="hub-links"><a href="${stageUrl(board, s.id)}">See all ${(s.at.made.length + s.at.roles.length).toLocaleString("en-US")} made for this stage</a></p>`
        : s.jobs.length ? `<p class="hub-links"><span>More by job</span>${s.jobs.slice(0, 3).map((t) => `<a href="/jobs/${t}">${esc(TASK_NAMES[t] ?? t)}</a>`).join("")}</p>` : "")
      + `</section>`),
    extras ?? "",
    `<p class="hub-links"><span>Other businesses</span>${all.filter((b) => b.slug !== board.slug).map((b) => `<a href="${BOARDS_PATH}/${b.slug}">${esc(b.name)}</a>`).join("")}<a href="${BOARDS_PATH}">All businesses</a></p>`,
  ];
  void industry;
  return parts.join("");
}

function stageBody(board, s, stages) {
  const byJob = new Map();
  for (const b of s.at.made) byJob.set(b.task, [...(byJob.get(b.task) ?? []), b]);
  const jobs = [...byJob.entries()].sort((a, z) => z[1].length - a[1].length);
  const prev = stages[s.n - 2], next = stages[s.n];
  return [
    `<p class="bp-sub">${esc(s.line)} Everything here is made for ${esc(board.short)} owners.</p>`,
    jobs.length > 1 ? `<nav class="hub-areas" aria-label="Jobs">${jobs.map(([t, bs]) => `<a href="#${t}">${esc(TASK_NAMES[t] ?? t)} (${bs.length})</a>`).join("")}</nav>` : "",
    ...jobs.map(([t, bs]) => `<section class="hub-area" id="${t}"><h2 class="hub-h2">${esc(TASK_NAMES[t] ?? t)}</h2><ul class="hub-list">${bs.slice(0, PER_JOB).map((b) => itemLine(b, true)).join("")}</ul>${bs.length > PER_JOB ? `<p class="hub-links"><a href="/jobs/${t}">See all ${esc(lower(TASK_NAMES[t] ?? t))} skills</a></p>` : ""}</section>`),
    s.at.roles.length ? `<h2 class="hub-h2">Specialists made for this stage</h2><p>A specialist is a ready-made role for your AI, with its own methods and checks.</p><ul class="hub-list">${s.at.roles.map((r) => `<li>${roleLink(r)}<span>${esc(r.summary)}</span></li>`).join("")}</ul>` : "",
    s.at.general.length ? `<h2 class="hub-h2">Also useful to any business</h2><ul class="hub-list">${s.at.general.slice(0, GENERAL_ON_STAGE).map((b) => itemLine(b, false)).join("")}</ul>` : "",
    s.at.tools.length ? `<h2 class="hub-h2">Free tools</h2><p>They run in your browser. Nothing you type is sent to us.</p><ul class="hub-list">${s.at.tools.slice(0, 8).map((t) => `<li>${toolLink(t)}<span>${esc(t.summary)}</span></li>`).join("")}</ul>` : "",
    `<p class="hub-links"><span>Stages</span>${prev ? `<a href="${prev.own ? stageUrl(board, prev.id) : `${BOARDS_PATH}/${board.slug}#${prev.id}`}">Before: ${esc(prev.label)}</a>` : ""}<a href="${BOARDS_PATH}/${board.slug}">All stages for ${esc(lower(board.name))}</a>${next ? `<a href="${next.own ? stageUrl(board, next.id) : `${BOARDS_PATH}/${board.slug}#${next.id}`}">Next: ${esc(next.label)}</a>` : ""}</p>`,
    `<p class="hub-links"><span>For your AI</span><a href="${playbookHref(board.slug)}" download>Download the ${esc(lower(board.name))} playbook</a></p>`,
  ].join("");
}

const listed = (rows) => ({ "@type": "ItemList", numberOfItems: rows.length, itemListElement: rows.map(([name, u], i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${u}`, name })) });

/** Pad a description up to the minimum with the first extra sentence that fits. */
function fitDesc(base, extras) {
  let d = trimDescription(base);
  for (const x of extras) if (d.length < DESC.min && `${d} ${x}`.length <= DESC.max) d = `${d} ${x}`;
  return d;
}

/**
 * Every board page object for prerender's render(), and the map behind them.
 * `industryExtras(slug)` returns extra HTML for a board that was an industry page (its common jobs), or "".
 */
export function boardPages({ blocks, roles, tools, fixes, jobExists = () => true, industryExtras = () => "", keptPages = [] }) {
  const { boards: map, unplaced } = mapAll({ blocks, roles, tools, fixes });
  const pages = [];
  const problems = [];
  const all = BOARDS;
  const stagesBy = Object.fromEntries(BOARDS.map((b) => [b.slug, stagesOf(b, map, jobExists)]));
  pages.push({
    url: BOARDS_PATH, hub: true, collection: true,
    title: "AI help by business", documentTitle: "AI help by business: pick your kind of business | AI Blocks",
    desc: "Pick your kind of business: online store, Amazon seller, SaaS, app, course, creator, agency, local shop and more. Each one follows 8 stages.",
    h1: "AI help by business",
    body: `<p class="bp-sub">Pick your kind of business. Each page follows that business from planning to money, in 8 stages, with the skills, specialists and free tools that fit each one.</p>`
      + `<ul class="hub-list">${all.map((b) => `<li><a href="${BOARDS_PATH}/${b.slug}">${esc(b.name)}</a><span>${esc(b.intro.split(/(?<=\.)\s/)[0])}</span></li>`).join("")}</ul>`
      + (keptPages.length ? `<h2 class="hub-h2">By team</h2><ul class="hub-list">${keptPages.map((p) => `<li><a href="${p.url}">${esc(p.name)}</a><span>${esc(p.line)}</span></li>`).join("")}</ul>` : "")
      + `<p class="hub-links"><span>Also</span><a href="/how-we-test">How we test</a><a href="/jobs">All skills by job</a><a href="/roles">Hire an AI specialist</a></p>`,
    main: listed(all.map((b) => [b.name, `${BOARDS_PATH}/${b.slug}`])),
  });
  for (const board of BOARDS) {
    const stages = stagesBy[board.slug];
    const rows = stages.flatMap((s) => [...s.shown.map(([b]) => [b.name, itemHref(b)]), ...s.roles.map((r) => [r.name, `/roles/${r.id}`]), ...s.tools.map((t) => [t.short ?? t.name, `/tools/${t.slug}`])]);
    if (rows.length < 20) problems.push(`${board.slug}: only ${rows.length} picks on the board page`);
    pages.push({
      url: `${BOARDS_PATH}/${board.slug}`, hub: true, collection: true, crumbs: [["AI help by business", BOARDS_PATH]],
      title: board.title, documentTitle: board.documentTitle, desc: board.desc, h1: board.title,
      body: boardBody(board, stages, { all, extras: industryExtras(board.slug) }),
      main: listed(rows),
      board: board.slug,
    });
    for (const s of stages.filter((x) => x.own)) {
      const n = s.at.made.length + s.at.roles.length;
      const h1 = `${board.name}: ${lower(s.label)}`;
      const documentTitle = fitTitle([`${s.label} for ${lower(board.name)} | ${BRAND}`, `${s.label}: AI for ${board.short} owners | ${BRAND}`, `${board.name}: ${lower(s.label)} | ${BRAND}`, `${s.label} for ${board.short} owners: free AI | ${BRAND}`, `${s.label}: free AI for ${board.short} owners | ${BRAND}`, `${s.label} for ${board.short} owners | ${BRAND}`, `${s.label}: free AI skills and tools | ${BRAND}`, `${s.label}: free AI skills | ${BRAND}`,`${s.label}: AI skills | ${BRAND}`, `${s.label} | ${BRAND}`]);
      if (!documentTitle.endsWith(`| ${BRAND}`)) problems.push(`${board.slug}/${s.id}: title has no brand: ${documentTitle}`);
      const desc = fitDesc(`${n.toLocaleString("en-US")} AI skills, workflows and specialists made for ${board.short} owners at this stage: ${lower(s.line)}`, ["Free to use in Claude, ChatGPT or Gemini.", "Free to use in your own AI.", "All free."]);
      pages.push({
        url: stageUrl(board, s.id), hub: true, collection: true,
        crumbs: [["AI help by business", BOARDS_PATH], [board.name, `${BOARDS_PATH}/${board.slug}`]],
        title: h1, documentTitle, desc, h1,
        body: stageBody(board, s, stages),
        main: listed([...s.at.made.map((b) => [b.name, itemHref(b)]), ...s.at.roles.map((r) => [r.name, `/roles/${r.id}`])].slice(0, 200)),
        board: board.slug,
      });
    }
  }
  return { pages, problems, map, unplaced };
}
