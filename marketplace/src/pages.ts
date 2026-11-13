// The website's pages as the Worker sends them. The browser app (src/ui) draws every page, but search engines, AI
// crawlers and link previews read the HTML first, so each page gets its own head tags here: title, description,
// canonical address, robots, social preview and structured data. Public pages also get a plain version of their
// content inside #app for crawlers that don't run scripts; the app replaces it when it starts. An agent's profile
// also carries the same data /api/agents/:id returns (script#boot), so the app shows it without a second request.
// Also robots.txt, sitemap.xml and llms.txt. Only production is indexed: every other environment says noindex, and
// its robots.txt disallows everything. Paths are listed in ARCHITECTURE.md; wrangler.jsonc sends them to the Worker.
import type { Env } from "./env.ts";
import { AREAS } from "./core/types.ts";
import { getRole, listRoles } from "./modules/directory/roles.ts";
import { listPersonas, searchPersonas } from "./modules/directory/service.ts";
import { agentPayload, featuredPayload, HOME_FEATURED, verticalPayload } from "./modules/directory/routes.ts";
import { areaLabel, type AgentProfile } from "./modules/directory/views.ts";
import { groupByNature, lowerFirst, workLine, workLineText } from "./modules/directory/work.ts";
import { AGENTS_TITLE, agentTitle, CONNECT_TITLE, ECOMMERCE_TITLE, GUIDES_TITLE, roleTitle, SITE_SUFFIX } from "./modules/directory/titles.ts";
import { verticalIndex } from "./modules/knowledge/service.ts";
import type { Persona } from "./core/types.ts";
import { publicProfile, publicProfileSlugs, recordShareVisit, type PublicProfile } from "./modules/experts/profiles.ts";

/** The how-to guides (src/ui/content/guides). Titles match each file's first heading (test/pages.test.ts checks). */
export const GUIDES = [
  {
    slug: "use-an-agent-pack",
    title: "Use an agent pack in your AI",
    description: "How to load a free AI Blocks agent into Claude, Claude Code, ChatGPT, OpenAI Codex, Gemini or Cursor, and what to send as your first message.",
  },
  {
    slug: "train-your-own-agent",
    title: "Train your own agent",
    description: "How the free Train your own pack turns the AI you use into a coach that helps you build your own version of an agent from your experience and voice.",
  },
] as const;

const SITE = "AI Blocks";
const HOME_TITLE = "Free AI agents that work in your own AI | AI Blocks";
const HOME_DESCRIPTION = "Hire a named AI agent for a job role, free. Download it or connect your AI, and it works in Claude, ChatGPT, Gemini, Codex or Cursor, on your own plan.";
const LIBRARY = "https://useaiblocks.com";

/** Pages only the app draws (sign-in, accounts, ops, studio): served, never indexed. /oauth/consent is in mcp/routes.ts. */
const APP_ONLY = [
  /^\/sign-in$/, /^\/invite$/, /^\/jobs(\/[^/]+)?$/, /^\/notifications$/, /^\/ops(\/.*)?$/, /^\/review$/,
  /^\/experts\/apply$/, /^\/expert$/, /^\/new$/, /^\/requests\/[^/]+$/, /^\/studio(\/agents\/[^/]+)?$/,
  /^\/experts\/invite\/[^/]+$/, /^\/job-posts(\/new|\/[^/]+)?$/,
];

const isProduction = (env: Env) => env.APP_ENV === "production";
const originOf = (env: Env) => env.APP_ORIGIN.replace(/\/+$/, "");

/** Text for HTML: element content and attribute values alike. */
export function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** JSON inside a <script> element: nothing in it can close the element or break the line. */
const LINE_SEPARATORS = new RegExp("[\\u2028\\u2029]", "g");
const scriptJson = (value: unknown) => JSON.stringify(value)
  .replace(/</g, "\\u003c")
  .replace(LINE_SEPARATORS, c => (c.charCodeAt(0) === 0x2028 ? "\\u2028" : "\\u2029"));

/** Cut to `max` characters at a word break, with an ellipsis. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 20)).replace(/[\s,.;:]+$/, "")}…`;
}

interface PageView {
  status: number;
  title: string;
  description: string;
  /** Canonical path (with its query when the query picks the page, e.g. /agents?role=seo-specialist). */
  path: string;
  index: boolean;
  image?: string;
  /** The page's largest image (an agent's portrait): fetched first, at high priority, so it paints as soon as the app draws. */
  preloadImage?: string;
  jsonLd?: object[];
  /** Plain HTML for #app (public pages). */
  body?: string;
  /** API answers the app would ask for first, keyed by their path. */
  boot?: Record<string, unknown>;
}

// ---------- Plain page content ----------

function frame(inner: string): string {
  return `<div class="seo-page"><header><a href="/">AI Blocks agents</a> <nav><a href="/agents">Agents</a> <a href="/connect">Connect your AI</a> <a href="/guides">Guides</a> <a href="${LIBRARY}">AI Blocks library</a></nav></header><main class="page">${inner}</main></div>`;
}

/** "Makes: landing page copy and homepage copy", the same line the cards show under an agent's title. "" when the agent lists no outcomes. */
function doesLine(p: Persona): string {
  const line = workLine(p.profile?.outcomes, p.profile?.not_for);
  return line ? workLineText(line) : "";
}

function agentLine(p: Persona): string {
  const does = doesLine(p);
  return `<li><a href="/agents/${esc(p.id)}">${esc(p.name)}, ${esc(p.title)}</a>: ${esc(p.tagline)}${does ? ` ${esc(does)}.` : ""}</li>`;
}

/** The home page's "What do you need done?" box as a plain form: it works with no script and leads to /agents?q=. */
const SEARCH_FORM = `<form action="/agents" method="get" role="search"><label for="seo-q">What do you need done?</label> <input id="seo-q" name="q" type="search" maxlength="120" placeholder="A landing page for my shop"> <button type="submit">Find an agent</button></form>`;

/** "What I can do" and "What I bring" for the page the Worker sends: the same tasks, counts, names and links the app shows. */
function toolboxHtml(a: AgentProfile): string {
  const tasks = a.tasks.length
    ? `<h2>What ${esc(a.name)} can do</h2>${groupByNature(a.tasks).map(g => `<h3>${esc(g.heading)}</h3><ul>${g.tasks.map(t => `<li>${esc(t.task)}</li>`).join("")}</ul>`).join("")}`
    : "";
  const item = (i: AgentProfile["brings"][number]["items"][number]) => {
    const href = i.file ? `/agents/${a.id}/files/${i.file}` : i.href;
    return `<li>${href ? `<a href="${esc(href)}">${esc(i.name)}</a>` : esc(i.name)}</li>`;
  };
  const brings = a.brings.length
    ? `<h2>What ${esc(a.name)} brings</h2>${a.brings.map(g => `<h3>${esc(g.label)}: ${g.items.length}</h3><ul>${g.items.map(item).join("")}</ul>`).join("")}`
    : "";
  return tasks + brings;
}

function agentsByArea(list: Persona[]): string {
  return AREAS.map(area => {
    const inArea = list.filter(p => p.area === area);
    return inArea.length ? `<h2>${esc(areaLabel(area))}</h2><ul>${inArea.map(agentLine).join("")}</ul>` : "";
  }).join("");
}

// ---------- Pages ----------

const notFound = (): PageView => ({
  status: 404, index: false, path: "/404",
  title: `Page not found | ${SITE}`,
  description: "There is nothing at this address. See every free AI agent instead.",
});

async function homePage(env: Env): Promise<PageView> {
  const everyone = await listPersonas(env);
  const count = everyone.length;
  const origin = originOf(env);
  return {
    status: 200, index: true, path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION,
    jsonLd: [
      { "@context": "https://schema.org", "@type": "WebSite", name: "AI Blocks agents", url: `${origin}/`, publisher: { "@type": "Organization", name: SITE, url: LIBRARY, logo: `${origin}/icon-512.png` },
        potentialAction: { "@type": "SearchAction", target: `${origin}/agents?q={search_term_string}`, "query-input": "required name=search_term_string" } },
    ],
    body: `<h1>Hire an AI agent. It works in your own AI.</h1><p>${count} named AI agents, each hired for a job role: SEO, sales, bookkeeping, support and more. Every agent is free. Download one, or connect your AI and load it there. It works on your own AI plan.</p>${SEARCH_FORM}<p><a href="/agents">Meet the agents</a> · <a href="/connect">Connect your AI</a> · <a href="/guides">Read the guides</a></p>`,
    boot: { [`/api/agents?featured=${HOME_FEATURED}`]: featuredPayload(everyone, HOME_FEATURED) },
  };
}

async function agentsPage(env: Env, url: URL): Promise<PageView> {
  const everyone = await listPersonas(env);
  const role = getRole(url.searchParams.get("role")?.trim());
  const filtered = url.searchParams.has("q") || url.searchParams.has("area");
  // A search (the home page's box, or a link someone shared): the same agents in the same order the app shows, never indexed.
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
  if (q && !role) {
    const area = url.searchParams.get("area")?.trim() ?? "";
    const found = searchPersonas(everyone, q).filter(p => !area || p.area === area);
    return {
      status: 200, index: false, path: "/agents",
      title: AGENTS_TITLE,
      description: clip(`${everyone.length} named AI agents for marketing, sales, finance, operations and more. Each one is free to download or load into your own AI.`, 160),
      body: `<h1>AI agents for "${esc(q)}"</h1>${SEARCH_FORM}<p>${found.length} agent${found.length === 1 ? "" : "s"}, best match first. Each line says whether the agent makes the thing, plans it or reviews it.</p><ul>${found.slice(0, 40).map(agentLine).join("")}</ul><p><a href="/agents">See every agent</a></p>`,
    };
  }
  if (role) {
    const inRole = everyone.filter(p => p.role === role.id);
    return {
      status: 200, index: inRole.length > 0 && !filtered, path: `/agents?role=${encodeURIComponent(role.id)}`,
      title: roleTitle(role.name),
      description: clip(`${role.summary} Each agent is free to download or load into your own AI.`, 160),
      body: `<h1>${esc(role.name)} agents</h1><p>${esc(role.summary)}</p><ul>${inRole.map(agentLine).join("")}</ul><p><a href="/agents">See every agent</a></p>`,
    };
  }
  return {
    status: 200, index: !filtered, path: "/agents",
    title: AGENTS_TITLE,
    description: clip(`${everyone.length} named AI agents for marketing, sales, finance, operations and more. Each one is free to download or load into your own AI.`, 160),
    body: `<h1>AI agents</h1><p>${everyone.length} named agents, each hired for a job role. Every one is free.</p><p><a href="${ECOMMERCE_PATH}">Run an online store? Meet the e-commerce team</a></p>${agentsByArea(everyone)}`,
  };
}

async function agentPage(env: Env, id: string): Promise<PageView> {
  const payload = await agentPayload(env, id);
  if (!payload) return notFound();
  const a = payload.agent;
  const origin = originOf(env);
  const path = `/agents/${a.id}`;
  const house = a.kind === "house";
  const outcomes = a.outcomes.map(o => `<li><strong>${esc(o.title)}</strong>: ${esc(o.deliverable)}</li>`).join("");
  const list = (items: string[]) => items.map(x => `<li>${esc(x)}</li>`).join("");
  const things = a.does?.things ?? [];
  const does = a.does ? `<p><strong>${esc(a.does.label)}${things.length ? ":" : ""}</strong> ${esc(things.length <= 1 ? things.join("") : `${things.slice(0, -1).join(", ")} and ${things[things.length - 1]}`)}${a.does_not ? `. <strong>Not for:</strong> ${esc(lowerFirst(a.does_not))}` : ""}</p>` : "";
  const fit = `${a.good_at.length ? `<h2>Good at</h2><ul>${list(a.good_at)}</ul>` : ""}${a.not_for.length ? `<h2>Not for</h2><ul>${list(a.not_for)}</ul>` : ""}`;
  return {
    status: 200, index: house, path,
    title: agentTitle(a.name, a.title),
    description: clip(`${a.tagline} ${a.name} is a free AI agent you can download or load into your own AI.`, 160),
    image: `${origin}${a.portrait}`,
    preloadImage: a.portrait,
    jsonLd: [
      { "@context": "https://schema.org", "@type": "SoftwareApplication", name: `${a.name}, ${a.title}`, description: a.tagline, url: `${origin}${path}`,
        image: `${origin}${a.portrait}`, applicationCategory: "BusinessApplication", operatingSystem: "Any AI app that reads files: Claude, ChatGPT, Gemini, Codex, Cursor",
        isAccessibleForFree: true, publisher: { "@type": "Organization", name: SITE, url: LIBRARY } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Agents", item: `${origin}/agents` },
        ...(a.role ? [{ "@type": "ListItem", position: 2, name: a.role.name, item: `${origin}/agents?role=${encodeURIComponent(a.role.id)}` }] : []),
        { "@type": "ListItem", position: a.role ? 3 : 2, name: `${a.name}, ${a.title}`, item: `${origin}${path}` },
      ] },
    ],
    body: `<p><a href="/agents">All agents</a></p><img src="${esc(a.portrait)}" alt="${esc(`${a.name}, ${a.title}`)}" width="160" height="160"><h1>${esc(a.name)}</h1><p>${esc(a.title)}${a.role ? ` · Job role: <a href="/agents?role=${esc(encodeURIComponent(a.role.id))}">${esc(a.role.name)}</a>` : ""}</p>${does}<p>${esc(a.tagline)}</p>${a.bio ? `<p>${esc(a.bio)}</p>` : ""}<h2>What ${esc(a.name)} delivers</h2><ul>${outcomes}</ul>${toolboxHtml(a)}${fit}${house ? `<h2>Get ${esc(a.name)}, free</h2><p><a href="/packs/${esc(a.id)}.txt">Download ${esc(a.name)} as one text file</a> for a chat app, or <a href="/packs/${esc(a.id)}.zip">download the folder</a> for a coding app. Or <a href="/connect">connect your AI</a> and ask it to load ${esc(a.name)}. Read the personality in <a href="${esc(path)}/soul.md">soul.md</a>.</p>` : ""}`,
    boot: { [`/api/agents/${a.id}`]: payload },
  };
}

/** /experts/<slug>: a public expert profile, indexed like an agent page. A 404 while the expert has no live agent. */
async function expertPage(env: Env, slug: string): Promise<PageView> {
  const p: PublicProfile | null = await publicProfile(env, slug);
  if (!p) return notFound();
  const origin = originOf(env);
  const agents = p.agents.map(a => `<li><a href="${esc(a.href)}">${esc(a.persona_name)}: ${esc(a.title)}</a>. ${esc(a.summary)}</li>`).join("");
  return {
    status: 200, index: true, path: p.path,
    title: `${p.name}, expert${SITE_SUFFIX}`,
    description: clip(`${p.headline}. ${p.name} builds AI agents from their own method on AI Blocks.`, 160),
    image: `${origin}${p.portrait}`,
    preloadImage: p.portrait,
    jsonLd: [
      { "@context": "https://schema.org", "@type": "ProfilePage", url: `${origin}${p.path}`,
        mainEntity: { "@type": "Person", name: p.name, description: p.headline, image: `${origin}${p.portrait}`, url: `${origin}${p.path}`,
          knowsAbout: p.areas.map(a => a.label) } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Agents", item: `${origin}/agents` },
        { "@type": "ListItem", position: 2, name: p.name, item: `${origin}${p.path}` },
      ] },
    ],
    body: `<p><a href="/agents">All agents</a></p><img src="${esc(p.portrait)}" alt="${esc(p.name)}" width="160" height="160"><h1>${esc(p.name)}</h1><p>${esc(p.headline)}</p>${p.bio ? `<p>${esc(p.bio)}</p>` : ""}${p.areas.length ? `<p>Works in: ${esc(p.areas.map(a => a.label).join(", "))}</p>` : ""}<h2>Agents built by ${esc(p.name)}</h2><ul>${agents}</ul>`,
    boot: { [`/api/expert-profiles/${p.slug}`]: { profile: p } },
  };
}

function guidesPage(): PageView {
  return {
    status: 200, index: true, path: "/guides",
    title: GUIDES_TITLE,
    description: "How to load a free AI Blocks agent into the AI you use, and how to train your own version of an agent.",
    body: `<h1>Guides</h1><ul>${GUIDES.map(g => `<li><a href="/guides/${g.slug}">${esc(g.title)}</a>: ${esc(g.description)}</li>`).join("")}</ul>`,
  };
}

function guidePage(slug: string): PageView {
  const g = GUIDES.find(x => x.slug === slug);
  if (!g) return notFound();
  return {
    status: 200, index: true, path: `/guides/${g.slug}`, title: `${g.title}${SITE_SUFFIX}`, description: g.description,
    jsonLd: [{ "@context": "https://schema.org", "@type": "HowTo", name: g.title, description: g.description }],
    body: `<p><a href="/guides">All guides</a></p><h1>${esc(g.title)}</h1><p>${esc(g.description)}</p>`,
  };
}

function connectPage(): PageView {
  return {
    status: 200, index: true, path: "/connect",
    title: CONNECT_TITLE,
    description: "Add AI Blocks to Claude, ChatGPT or another AI app once, then ask it to find an agent and load it into your chat. Free, on your own AI plan.",
    body: `<h1>Connect your AI</h1><p>Add AI Blocks to Claude, ChatGPT or another AI app once. Then ask it to find an agent and load it into your chat. The agent is free and works on your own AI plan.</p><p>Developers can read every agent through the public API: <a href="/api/agents">/api/agents</a> and <a href="/packs/index.json">/packs/index.json</a>.</p>`,
  };
}

/** /e-commerce: the e-commerce team (agents with vertical "ecommerce") and its knowledge library. */
export const ECOMMERCE_PATH = "/e-commerce";
const ECOMMERCE = "ecommerce";
export const ECOMMERCE_DESCRIPTION = "A team of free AI agents for online stores, built from expert e-commerce sources. Load one into your own AI, or ask the library what works.";

/** What GET /api/knowledge/:vertical returns (src/modules/knowledge/routes.ts), so the page can carry the same answer.
 *  test/pages.test.ts checks the two stay equal. */
function librarySummary(file: NonNullable<Awaited<ReturnType<typeof verticalIndex>>>["file"]) {
  const { vertical, counts, sources, cards } = file;
  return {
    id: vertical.id, name: vertical.name, summary: vertical.summary, updated: vertical.updated,
    cards: cards.length, sources: sources.length, baseline: cards.filter(c => c.scope === "baseline").length,
    modules: vertical.modules.map(m => ({ code: m.code, name: m.name, cards: counts[m.code] ?? 0 })),
    tiers: vertical.tiers,
  };
}

async function ecommercePage(env: Env): Promise<PageView> {
  const everyone = await listPersonas(env);
  const payload = verticalPayload(everyone, ECOMMERCE);
  const byId = new Map(everyone.map(p => [p.id, p]));
  const team = payload.agents.map(a => byId.get(a.id)!);
  // The library is a built file (scripts/build-packs.mjs); until it is built the page says it is on its way.
  const built = await verticalIndex(env, ECOMMERCE).catch(() => null);
  const library = built ? librarySummary(built.file) : null;
  const origin = originOf(env);
  const lead = team[0];
  const teamHtml = lead
    ? `<p>${esc(lead.name)}, ${esc(lead.title)}, leads the team.${team.length > 1 ? ` ${team.length - 1} specialists each own one part of the store.` : ""}</p><ul>${team.map(agentLine).join("")}</ul>`
    : "<p>The team is on its way.</p>";
  const modules = library?.modules.filter(m => m.cards > 0) ?? [];
  const libraryHtml = library && library.cards > 0
    ? `<p>${library.cards} card${library.cards === 1 ? "" : "s"} from ${library.sources} source${library.sources === 1 ? "" : "s"}. A card is one tested idea from a trusted source, with when it holds and when it fails.</p><ul>${modules.map(m => `<li>${esc(m.name)}: ${m.cards} card${m.cards === 1 ? "" : "s"}</li>`).join("")}</ul><p>Each card has a trust level from 1 to 4: 1 is the platform's own guides, 2 is large studies, 3 is a named seller with proof, 4 is opinion.</p>`
    : "<p>The library is on its way.</p>";
  return {
    status: 200, index: true, path: ECOMMERCE_PATH,
    title: ECOMMERCE_TITLE,
    description: ECOMMERCE_DESCRIPTION,
    jsonLd: [
      { "@context": "https://schema.org", "@type": "CollectionPage", name: "AI agents for e-commerce stores", description: ECOMMERCE_DESCRIPTION, url: `${origin}${ECOMMERCE_PATH}`,
        isAccessibleForFree: true, publisher: { "@type": "Organization", name: SITE, url: LIBRARY } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Agents", item: `${origin}/agents` },
        { "@type": "ListItem", position: 2, name: "E-commerce", item: `${origin}${ECOMMERCE_PATH}` },
      ] },
    ],
    body: `<p><a href="/agents">All agents</a></p><h1>AI agents for your online store</h1><p>A team that knows e-commerce, built from expert sources, free to use in your own AI. Made for Shopify stores in India and the US, with Amazon as a second place to sell.</p><h2>The team</h2>${teamHtml}<h2>The library</h2>${libraryHtml}<h2>How to start</h2><ol><li>Pick an agent. Start with the team lead, or the specialist for the job.</li><li>Load it in your AI. <a href="/guides/use-an-agent-pack">Read the guide</a> or <a href="/connect">connect your AI</a>.</li><li>Ask your first job, in your own words.</li></ol>`,
    boot: { [`/api/agents?vertical=${ECOMMERCE}`]: payload, ...(library ? { [`/api/knowledge/${ECOMMERCE}`]: library } : {}) },
  };
}

async function viewFor(env: Env, url: URL): Promise<PageView> {
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return homePage(env);
  if (path === "/agents") return agentsPage(env, url);
  if (path === "/guides") return guidesPage();
  if (path === "/connect") return connectPage();
  if (path === ECOMMERCE_PATH) return ecommercePage(env);
  let m = path.match(/^\/agents\/([a-z0-9-]+)$/);
  if (m) return agentPage(env, m[1]);
  m = path.match(/^\/agents\/([a-z0-9-]+)\/files\/.+$/);
  if (m) {
    const payload = await agentPayload(env, m[1]);
    return payload ? { status: 200, index: false, path, title: `${payload.agent.name}'s pack files | ${SITE}`, description: `A file from ${payload.agent.name}'s free agent pack.` } : notFound();
  }
  m = path.match(/^\/guides\/([a-z0-9-]+)$/);
  if (m) return guidePage(m[1]);
  m = path.match(/^\/experts\/([a-z0-9-]+)$/);
  if (m && m[1] !== "apply") return expertPage(env, m[1]);
  if (APP_ONLY.some(re => re.test(path))) return { status: 200, index: false, path, title: `${SITE} agents`, description: HOME_DESCRIPTION };
  return notFound();
}

// ---------- The shell ----------

/** The built index.html, once per isolate (assets don't change within a deploy). */
let shellCache: { origin: string; html: string } | null = null;

async function shell(env: Env, url: URL): Promise<string | null> {
  if (shellCache?.origin === url.origin) return shellCache.html;
  if (!env.ASSETS) return null;
  const res = await env.ASSETS.fetch(new Request(new URL("/", url)));
  if (!res.ok) return null;
  const html = await res.text();
  shellCache = { origin: url.origin, html };
  return html;
}

/** Tests only. */
export function clearShellCache(): void { shellCache = null; }

/** A short fingerprint of the built shell. It changes with every deploy that changes the app's asset names. */
export async function shellVersion(env: Env, url: URL): Promise<string | null> {
  const html = await shell(env, url);
  if (html === null) return null;
  let h = 0x811c9dc5;
  for (let i = 0; i < html.length; i++) { h ^= html.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}

/** The head tags for one page. */
export function headTags(env: Env, view: PageView): string {
  const origin = originOf(env);
  const canonical = `${origin}${view.path}`;
  const index = view.index && isProduction(env);
  const image = view.image ?? `${origin}/icon-512.png`;
  const tags = [
    `<title>${esc(view.title)}</title>`,
    `<meta name="description" content="${esc(view.description)}" />`,
    `<meta name="robots" content="${index ? "index, follow, max-image-preview:large" : "noindex, follow"}" />`,
    ...(view.status === 200 ? [`<link rel="canonical" href="${esc(canonical)}" />`] : []),
    `<meta property="og:site_name" content="${SITE}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(view.title)}" />`,
    `<meta property="og:description" content="${esc(view.description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:card" content="${view.image ? "summary_large_image" : "summary"}" />`,
    ...(view.preloadImage ? [`<link rel="preload" as="image" href="${esc(view.preloadImage)}" fetchpriority="high" />`] : []),
    ...(view.jsonLd ?? []).map(d => `<script type="application/ld+json">${scriptJson(d)}</script>`),
  ];
  return tags.join("\n    ");
}

/** The shell with this page's head tags, plain content and boot data. Tags the page sets itself are removed first. */
export function renderShell(html: string, env: Env, view: PageView): string {
  let out = html
    .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
    .replace(/\s*<meta\s+(name|property)="(description|robots|og:[a-z_:]+|twitter:[a-z_:]+)"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "");
  // Function replacements, so a "$" in an agent's text is never read as a replacement pattern.
  const head = headTags(env, view);
  out = out.replace(/<meta\s+name="viewport"[^>]*>/i, tag => `${tag}\n    ${head}`);
  if (view.body) { const body = frame(view.body); out = out.replace(/<div id="app"><\/div>/, () => `<div id="app">${body}</div>`); }
  // Vite puts the app's module script in <head>; module scripts run after parsing, so the end of <body> is in time.
  if (view.boot) { const boot = scriptJson(view.boot); out = out.replace(/<\/body>/i, () => `  <script type="application/json" id="boot">${boot}</script>\n  </body>`); }
  return out;
}

const PAGE_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=0, must-revalidate",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "content-security-policy": "frame-ancestors 'none'",
  "strict-transport-security": "max-age=31536000",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

/** A page of the website, or null when the app is not built here (tests without ASSETS, local API-only runs). */
export async function pageResponse(req: Request, env: Env): Promise<Response | null> {
  const url = new URL(req.url);
  const html = await shell(env, url);
  if (html === null) return null;
  const view = await viewFor(env, url);
  const headers: Record<string, string> = { ...PAGE_HEADERS };
  if (!(view.index && isProduction(env))) headers["x-robots-tag"] = "noindex";
  // ?via=<code> on any page: an expert's share link (first-party cookie, first touch wins; see experts/profiles.ts).
  const via = url.searchParams.get("via");
  if (via && req.method === "GET") {
    const hit = await recordShareVisit(env, req, via.toLowerCase()).catch(() => null);
    if (hit?.setCookie) headers["set-cookie"] = hit.setCookie;
  }
  return new Response(req.method === "HEAD" ? null : renderShell(html, env, view), { status: view.status, headers });
}

// ---------- robots.txt, sitemap.xml, llms.txt ----------

const TEXT_CACHE = "public, max-age=3600";
const text = (body: string, type: string) => new Response(body, { status: 200, headers: { "content-type": `${type}; charset=utf-8`, "cache-control": TEXT_CACHE, "x-content-type-options": "nosniff" } });

export function robotsTxt(env: Env): Response {
  if (!isProduction(env)) return text("# Not the live site: nothing here should be indexed.\nUser-agent: *\nDisallow: /\n", "text/plain");
  const origin = originOf(env);
  const blocked = ["/api/", "/oauth/", "/mcp", "/ops", "/studio", "/jobs", "/requests/", "/review", "/new", "/invite", "/notifications", "/sign-in", "/expert$", "/experts/apply", "/experts/invite/", "/e/", "/job-posts", "/*.zip$"];
  // The public pages load these while they draw, so a crawler that runs the app needs them (the longer rule wins).
  const allowed = ["/api/agents", "/api/config", "/api/expert-profiles/"];
  return text(`User-agent: *\n${blocked.map(p => `Disallow: ${p}`).join("\n")}\n${allowed.map(p => `Allow: ${p}`).join("\n")}\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, "text/plain");
}

export async function sitemapXml(env: Env): Promise<Response> {
  const origin = originOf(env);
  const everyone = await listPersonas(env);
  const roles = listRoles().filter(r => everyone.some(p => p.role === r.id));
  const paths = [
    "/", "/agents", ECOMMERCE_PATH, "/connect", "/guides", ...GUIDES.map(g => `/guides/${g.slug}`),
    ...roles.map(r => `/agents?role=${encodeURIComponent(r.id)}`),
    ...everyone.filter(p => p.kind === "house").map(p => `/agents/${p.id}`),
    ...(await publicProfileSlugs(env)).map(slug => `/experts/${slug}`),
  ];
  const urls = paths.map(p => `  <url><loc>${esc(`${origin}${p}`)}</loc></url>`).join("\n");
  return text(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, "application/xml");
}

export async function llmsTxt(env: Env): Promise<Response> {
  const origin = originOf(env);
  const everyone = (await listPersonas(env)).filter(p => p.kind === "house");
  const lines = [
    "# AI Blocks agents",
    "",
    `> ${everyone.length} free, named AI agents, each hired for a job role (SEO, sales, bookkeeping, support and more). Each agent is a pack of files: who it is, how it works, what it may touch and what it knows. Load one into your own AI (Claude, ChatGPT, Gemini, Codex, Cursor) and it works on your own plan. AI Blocks runs no work and holds no model keys for you.`,
    "",
    "Packs are free to use and change, including commercially in your own work, under the AI Blocks Agent Pack Licence 1.0. They may not be sold or resold.",
    "",
    "## Use the agents",
    "",
    `- [E-commerce team](${origin}${ECOMMERCE_PATH}): AI agents built only for online stores, and a library of expert e-commerce cards you can ask (${origin}/api/knowledge/ecommerce/ask?q=...).`,
    `- [Connect your AI](${origin}/connect): add the AI Blocks MCP server (${origin}/mcp) once, then ask your AI to load an agent with load_agent.`,
    `- [Agent list (JSON)](${origin}/api/agents): every agent with its role, area and outcomes.`,
    `- [Pack index (JSON)](${origin}/packs/index.json): every pack's files.json and zip.`,
    ...GUIDES.map(g => `- [${g.title}](${origin}/guides/${g.slug}): ${g.description}`),
    "",
    "## Agents",
    "",
    ...everyone.map(p => { const does = doesLine(p); return `- [${p.name}, ${p.title}](${origin}/agents/${p.id}): ${p.tagline}${does ? ` ${does}.` : ""}`; }),
    "",
  ];
  return text(lines.join("\n"), "text/plain");
}
