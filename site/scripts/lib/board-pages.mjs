// The business board pages: /industries (the list), /industries/<board> (the journey in 8 stages) and
// /industries/<board>/<stage> (everything made for that stage, when there is enough of it). Plain prerendered pages
// in the guides sitemap, built from scripts/lib/board-map.mjs. Words live in src/trust-pages/boards.mjs.
// Layout: tiles (src/hub.css, "Business boards"), each with a pixel icon from src/trust-pages/pixel-icons.mjs.
import { BOARDS, BOARDS_PATH, STAGES } from "../../src/trust-pages/boards.mjs";
import { playbookHref } from "../../src/trust-pages/board-names.mjs";
import { pixelIcon } from "../../src/trust-pages/pixel-icons.mjs";
import { TASKS } from "../../src/lib/catalogue-taxonomy.mjs";
import { DESC, fitTitle, trimDescription } from "../../src/lib/seo-meta.mjs";
import { mapAll } from "./board-map.mjs";

const SITE = "https://useaiblocks.com";
const BRAND = "AI Blocks";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Lower-case the first letter, but leave a name like SaaS or AI alone.
const lower = (s) => (s && !/^[A-Z]{2}|^[A-Z][a-z]*[A-Z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const n = (x) => x.toLocaleString("en-US");
const KIND_PATH = { agent: "agents", workflow: "workflows", prompt: "prompts", skill: "skills" };
const KIND_WORD = { agent: "Agent", workflow: "Workflow", prompt: "Prompt", skill: "Skill" };
const TASK_NAMES = Object.fromEntries(TASKS.map((t) => [t.id, t.name]));
const itemHref = (b) => `/${KIND_PATH[b.kind] ?? "skills"}/${b.slug}`;
const ARROW = `<span class="bz-arrow" aria-hidden="true">&rarr;</span>`;

/** How many made-for items and specialists a stage needs before it gets a page of its own. */
export const STAGE_PAGE_MIN = 8;
const ON_BOARD = 6;      // items shown per stage on the board page
const ROLES_ON_BOARD = 3;
const TOOLS_ON_BOARD = 3;
const PER_JOB = 30;      // made-for items per job on a stage page; the job page has the rest
const GENERAL_ON_STAGE = 12;

// One tile: the name (its link covers the whole tile), what it does, then small tags.
const tile = (href, name, text, tags = []) => `<li class="bz-tile"><a href="${href}">${esc(name)}</a>${text ? `<span class="bz-tile-text">${esc(text)}</span>` : ""}${tags.length ? `<span class="bz-tags">${tags.join("")}</span>` : ""}</li>`;
const tag = (word, cls = "") => `<span class="bz-tag${cls ? ` ${cls}` : ""}">${word}</span>`;
const itemTile = (b, made) => tile(itemHref(b), b.name, b.summary, [tag(KIND_WORD[b.kind] ?? "Skill"), b.tested ? tag("Safety checked", "bz-tag-good") : "", made ? "" : tag("Any business", "bz-tag-quiet")].filter(Boolean));
const roleTile = (r) => tile(`/roles/${esc(r.id)}`, r.name, r.summary, [tag("Specialist")]);
const toolTile = (t) => tile(`/tools/${esc(t.slug)}`, t.short ?? t.name, t.summary, [tag("Free tool")]);
const tiles = (rows) => (rows.length ? `<ul class="bz-tiles">${rows.join("")}</ul>` : "");
const stageUrl = (board, st) => `${BOARDS_PATH}/${board.slug}/${st}`;
const stageHref = (board, s) => (s.own ? stageUrl(board, s.id) : `${BOARDS_PATH}/${board.slug}#${s.id}`);

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

const totals = (stages) => ({
  made: stages.reduce((x, s) => x + s.at.made.length, 0),
  roles: stages.reduce((x, s) => x + s.at.roles.length, 0),
  tools: new Set(stages.flatMap((s) => s.at.tools.map((t) => t.slug))).size,
});

/** The playbook download, as one clear block. */
const playbookBlock = (board) => `<aside class="bz-cta" aria-label="Playbook">${pixelIcon("playbook", "px-ico bz-cta-ico")}<div><h2>Give your AI the ${esc(lower(board.name))} playbook</h2><p>One file that tells your AI what ${/^[aeiouAEIOU]/.test(board.short) ? "an" : "a"} ${esc(board.short)} business needs at each stage. Set your kind of business in your org context, and every download includes it.</p></div><a class="btn btn-primary" href="${playbookHref(board.slug)}" download>Download the playbook</a></aside>`;

/** Small numbered tiles for the 8 stages. `href(s)` is where each goes; `current` marks the stage being read. */
const journey = (stages, href, { current, counts = true } = {}) => `<ol class="bz-journey">${stages.map((s) => {
  const count = s.at.made.length + s.at.roles.length;
  const inner = `<span class="bz-step-top"><span class="bz-step-n">${s.n}</span>${pixelIcon(s.id)}</span><b>${esc(s.label)}</b>${counts ? `<span class="bz-step-count">${count ? `${n(count)} made for this` : "Fits any business"}</span>` : ""}`;
  return `<li>${href ? `<a class="bz-step" href="${href(s)}"${s.id === current ? ' aria-current="step"' : ""}>${inner}</a>` : `<div class="bz-step">${inner}</div>`}</li>`;
}).join("")}</ol>`;

/** The other kinds of business, as small icon tiles. */
const boardTiles = (boards, { small = false, counts } = {}) => `<ul class="bz-boards${small ? " bz-boards-sm" : ""}">${boards.map((b) => `<li><a class="bz-board" href="${b.url ?? `${BOARDS_PATH}/${b.slug}`}">${pixelIcon(b.icon ?? b.slug, "px-ico bz-board-ico")}<b>${esc(b.name)}</b>${small ? "" : `<span>${esc(b.line ?? b.intro.split(/(?<=\.)\s/)[0])}</span><span class="bz-board-foot">${counts?.[b.slug] ? `${n(counts[b.slug])} made for this business` : "Open"} ${ARROW}</span>`}</a></li>`).join("")}</ul>`;

function boardBody(board, stages, { all, extras }) {
  const t = totals(stages);
  const parts = [
    `<p class="bp-sub">${esc(board.intro)}</p>`,
    `<dl class="bz-stats">${t.made ? `<div><dt>Made for ${esc(board.short)} owners</dt><dd>${n(t.made)}</dd></div>` : ""}${t.roles ? `<div><dt>AI specialists</dt><dd>${n(t.roles)}</dd></div>` : ""}<div><dt>Stages, plan to money</dt><dd>8</dd></div>${t.tools ? `<div><dt>Free tools</dt><dd>${n(t.tools)}</dd></div>` : ""}</dl>`,
    playbookBlock(board),
    `<h2 class="hub-h2">Your 8 stages</h2><p class="hub-gets">Pick the stage you are at. Items made for ${esc(board.short)} owners come first. Items marked &ldquo;Any business&rdquo; fit every business and fill the gaps.</p>`,
    journey(stages, (s) => `#${s.id}`),
    ...stages.map((s) => {
      const count = s.at.made.length + s.at.roles.length;
      const more = s.own ? `<a class="btn btn-line btn-sm" href="${stageUrl(board, s.id)}">See all ${n(count)} ${ARROW}</a>` : "";
      const panels = [
        s.roles.length ? `<div class="bz-panel"><h3>${pixelIcon("specialist")}Specialists</h3><p>Ready-made roles for your AI.</p><ul>${s.roles.map((r) => `<li><a href="/roles/${esc(r.id)}">${esc(r.name)}</a></li>`).join("")}</ul></div>` : "",
        s.tools.length ? `<div class="bz-panel"><h3>${pixelIcon("tool")}Free tools</h3><p>They run in your browser.</p><ul>${s.tools.map((x) => `<li><a href="/tools/${esc(x.slug)}">${esc(x.short ?? x.name)}</a></li>`).join("")}</ul></div>` : "",
        !s.own && s.jobs.length ? `<div class="bz-panel"><h3>${pixelIcon("found")}More by job</h3><p>Every skill for the job.</p><ul>${s.jobs.slice(0, 3).map((j) => `<li><a href="/jobs/${j}">${esc(TASK_NAMES[j] ?? j)}</a></li>`).join("")}</ul></div>` : "",
      ].filter(Boolean);
      return `<section class="bz-stage" id="${s.id}"><div class="bz-stage-head"><span class="bz-stage-badge">${pixelIcon(s.id)}<span>${s.n}</span></span><div><p class="bz-kicker">Stage ${s.n} of 8</p><h2>${esc(s.label)}</h2><p>${esc(s.line)}</p></div>${more}</div>`
        + tiles(s.shown.map(([b, made]) => itemTile(b, made)))
        + (panels.length ? `<div class="bz-panels">${panels.join("")}</div>` : "")
        + `</section>`;
    }),
    extras ?? "",
    `<h2 class="hub-h2">Other kinds of business</h2>`,
    boardTiles(all.filter((b) => b.slug !== board.slug), { small: true }),
    `<p class="hub-links"><a href="${BOARDS_PATH}">All businesses</a></p>`,
  ];
  return parts.join("");
}

function stageBody(board, s, stages) {
  const byJob = new Map();
  for (const b of s.at.made) byJob.set(b.task, [...(byJob.get(b.task) ?? []), b]);
  const jobs = [...byJob.entries()].sort((a, z) => z[1].length - a[1].length);
  const prev = stages[s.n - 2], next = stages[s.n];
  const step = (x, word, cls) => `<a class="bz-pn ${cls}" href="${stageHref(board, x)}"><span>${word}</span><b>${x.n}. ${esc(x.label)}</b></a>`;
  return [
    `<p class="bp-sub">${esc(s.line)} Everything here is made for ${esc(board.short)} owners.</p>`,
    journey(stages, (x) => stageHref(board, x), { current: s.id, counts: false }),
    jobs.length > 1 ? `<nav class="hub-areas" aria-label="Jobs">${jobs.map(([t, bs]) => `<a href="#${t}">${esc(TASK_NAMES[t] ?? t)} (${bs.length})</a>`).join("")}</nav>` : "",
    ...jobs.map(([t, bs]) => `<section class="hub-area" id="${t}"><h2 class="hub-h2">${esc(TASK_NAMES[t] ?? t)}</h2>${tiles(bs.slice(0, PER_JOB).map((b) => itemTile(b, true)))}${bs.length > PER_JOB ? `<p class="hub-links"><a href="/jobs/${t}">See all ${esc(lower(TASK_NAMES[t] ?? t))} skills</a></p>` : ""}</section>`),
    s.at.roles.length ? `<section class="hub-area"><h2 class="hub-h2">Specialists made for this stage</h2><p class="hub-gets">A specialist is a ready-made role for your AI, with its own methods and checks.</p>${tiles(s.at.roles.map(roleTile))}</section>` : "",
    s.at.general.length ? `<section class="hub-area"><h2 class="hub-h2">Also useful to any business</h2>${tiles(s.at.general.slice(0, GENERAL_ON_STAGE).map((b) => itemTile(b, false)))}</section>` : "",
    s.at.tools.length ? `<section class="hub-area"><h2 class="hub-h2">Free tools</h2><p class="hub-gets">They run in your browser. Nothing you type is sent to us.</p>${tiles(s.at.tools.slice(0, 8).map(toolTile))}</section>` : "",
    `<nav class="bz-prevnext" aria-label="Stages">${prev ? step(prev, "&larr; Before", "bz-pn-prev") : ""}<a class="bz-pn bz-pn-all" href="${BOARDS_PATH}/${board.slug}"><span>All 8 stages</span><b>${esc(board.name)}</b></a>${next ? step(next, "Next &rarr;", "bz-pn-next") : ""}</nav>`,
    playbookBlock(board),
  ].join("");
}

const listed = (rows) => ({ "@type": "ItemList", numberOfItems: rows.length, itemListElement: rows.map(([name, u], i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${u}`, name })) });

/** Pad a description up to the minimum with the first extra sentence that fits. */
function fitDesc(base, extras) {
  let d = trimDescription(base);
  for (const x of extras) if (d.length < DESC.min && `${d} ${x}`.length <= DESC.max) d = `${d} ${x}`;
  return d;
}

const HOW = [
  ["ecommerce", "Pick your kind of business", "Open the page for the business you run."],
  ["plan", "Go to your stage", "Each page has the same 8 stages, from planning to money."],
  ["playbook", "Give your AI the playbook", "One file that tells your AI how your kind of business works."],
];

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
  const counts = Object.fromEntries(BOARDS.map((b) => [b.slug, totals(stagesBy[b.slug]).made]));
  pages.push({
    url: BOARDS_PATH, hub: true, collection: true,
    title: "AI help by business", documentTitle: "AI help by business: pick your kind of business | AI Blocks",
    desc: "Pick your kind of business: online store, Amazon seller, SaaS, app, course, creator, agency, local shop and more. Each one follows 8 stages.",
    h1: "AI help by business",
    body: `<p class="bp-sub">Pick your kind of business. Each page follows that business from planning to money, in 8 stages, with the skills, specialists and free tools that fit each one.</p>`
      + `<ol class="bz-how">${HOW.map(([icon, head, text], i) => `<li>${pixelIcon(icon)}<span class="bz-how-n">${i + 1}</span><b>${head}</b><span>${text}</span></li>`).join("")}</ol>`
      + `<h2 class="hub-h2">Pick your kind of business</h2>`
      + boardTiles(all, { counts })
      + (keptPages.length ? `<h2 class="hub-h2">By team</h2>${boardTiles(keptPages.map((p) => ({ ...p, icon: p.url.split("/").pop() })))}` : "")
      + `<h2 class="hub-h2">The same 8 stages on every page</h2><p class="hub-gets">So you always know where to look, whatever you run.</p>`
      + `<ol class="bz-journey">${STAGES.map((s, i) => `<li><div class="bz-step"><span class="bz-step-top"><span class="bz-step-n">${i + 1}</span>${pixelIcon(s.id)}</span><b>${esc(s.name)}</b></div></li>`).join("")}</ol>`
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
      const count = s.at.made.length + s.at.roles.length;
      const h1 = `${board.name}: ${lower(s.label)}`;
      const documentTitle = fitTitle([`${s.label} for ${lower(board.name)} | ${BRAND}`, `${s.label}: AI for ${board.short} owners | ${BRAND}`, `${board.name}: ${lower(s.label)} | ${BRAND}`, `${s.label} for ${board.short} owners: free AI | ${BRAND}`, `${s.label}: free AI for ${board.short} owners | ${BRAND}`, `${s.label} for ${board.short} owners | ${BRAND}`, `${s.label}: free AI skills and tools | ${BRAND}`, `${s.label}: free AI skills | ${BRAND}`,`${s.label}: AI skills | ${BRAND}`, `${s.label} | ${BRAND}`]);
      if (!documentTitle.endsWith(`| ${BRAND}`)) problems.push(`${board.slug}/${s.id}: title has no brand: ${documentTitle}`);
      const desc = fitDesc(`${n(count)} AI skills, workflows and specialists made for ${board.short} owners at this stage: ${lower(s.line)}`, ["Free to use in Claude, ChatGPT or Gemini.", "Free to use in your own AI.", "All free."]);
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
