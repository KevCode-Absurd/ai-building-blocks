// Gives every page in the sitemap its own HTML file after `vite build`, so search engines, answer engines and link
// previews see the right title, description, canonical address, structured data and a readable first screen
// without running any script. The app still takes over as normal: main.tsx clears this first screen and renders.
// Also writes the job hubs (/jobs, /jobs/<job>), which are plain pages with no app, and a real 404 page.
// Cloudflare Pages serves dist/skills/<slug>.html at /skills/<slug>. Run from site/: node scripts/prerender.mjs
// Checklists: the technical-seo-auditor, seo-site-auditor, ai-search-visibility-optimiser, structured-data-writer and
// tool-pages-seo-fixer skills in our own library (catalogue-items/imported/).
import fs from "node:fs";
import { BROWSER_TOOLS } from "../src/tools/browser-tools.mjs";
import { INFO_PAGES, OPERATOR, POLICY_DATE, SUPPORT_EMAIL, emailLink, infoPage } from "../src/lib/site-info.mjs";
import path from "node:path";

const DIST = process.env.PRERENDER_DIST || "dist";
const SITE = "https://useaiblocks.com";
const SEO_TITLES = {
  "/workflows/build-google-remarketing-lists-and-campaigns-then-read-the-results": "Google Remarketing Campaigns and Results | AI Blocks",
  "/workflows/job-based-product-design": "Customer Jobs to Be Done Design Workflow | AI Blocks",
  "/tools/agency-or-in-house": "Agency vs In-House Cost Calculator | AI Blocks",
  "/tools/ai-time-saved": "AI Time Savings Calculator | AI Blocks",
  "/tools/launch-revenue-planner": "Launch Revenue Calculator | AI Blocks",
  "/tools/stock-weeks-of-cover": "Stock Weeks of Cover Calculator | AI Blocks",
};
// The built index.html, as vite left it (a second run first strips what the last one added to the home page).
const shell = fs.readFileSync(path.join(DIST, "index.html"), "utf8")
  .replace(/<script type="application\/ld\+json">.*?<\/script>\n  /s, "")
  .replace(/<div id="root">.*?<\/main><\/div>/s, '<div id="root"></div>');
// The same page without the app: for hubs and the 404 page, which are complete as plain HTML.
const plainShell = shell
  .replace(/<!-- APP_BOOT_START[\s\S]*?<!-- APP_BOOT_END -->\s*/g, "")
  .replace(/<!-- APP_LOADER_START -->[\s\S]*?<!-- APP_LOADER_END -->\s*/g, "")
  .replace(/<script type="module"[^>]*><\/script>\s*/g, "")
  .replace(/<link rel="modulepreload"[^>]*>\s*/g, "")
  .replace(/<link rel="preload" href="\/data\/blocks.json"[^>]*>\s*/, "");
const cat = JSON.parse(fs.readFileSync("public/data/blocks.json", "utf8"));
const aiTools = JSON.parse(fs.readFileSync("public/data/ai-tools.json", "utf8"));
const { TRACTION_CHANNELS: tractionChannels, tractionSlug } = await import("../../tools/lib/traction-channels.mjs");
const bySlug = Object.fromEntries(cat.blocks.map((b) => [b.slug, b]));
const { TOOLS } = await import("../../mini-tools/index.mjs");
const TASK_NAMES = Object.fromEntries([...fs.readFileSync("src/lib/data.ts", "utf8").split("export const TASKS")[1].split("];")[0].matchAll(/\{ id: "([^"]+)", name: "([^"]+)" \}/g)].map((m) => [m[1], m[2]]));
const AREAS = cat.minds?.areas ?? {};

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const text = (html) => String(html ?? "").replace(/<[^>]+>/g, " ").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
// A description ends on a whole sentence where it can, never mid-word.
const clip = (s, n = 160) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  return end > 60 ? cut.slice(0, end + 1) : `${cut.replace(/\s+\S*$/, "")}…`;
};
const words = (s, n) => { const w = String(s).split(/\s+/); return w.length > n ? `${w.slice(0, n).join(" ")}…` : s; };
const kindPath = (b) => (b.type === "mind" ? "minds" : b.type === "agent" ? "agents" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflows" : b.type === "prompt" ? "prompts" : "skills");
const hrefOf = (b) => `/${kindPath(b)}/${b.slug}`;
const hasPage = (b) => b.headline !== "";
const portName = (p) => String(p).replace(/\?$/, "").replace(/_/g, " ");
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const LICENCE_URL = (id) => (id ? `https://spdx.org/licenses/${id}.html` : undefined);
const jobHref = (t) => `/jobs/${t}`;
const readPage = (slug) => { try { return JSON.parse(fs.readFileSync(`public/data/pages/${slug}.json`, "utf8")); } catch { return {}; } };

// Who links to whom: the workflows that use a block, so its page can link back up to them.
const usedBy = {};
for (const b of cat.blocks) for (const s of [...(b.uses ?? []), ...(b.steps ?? []).map((x) => (Array.isArray(x) ? x[0] : x))]) if (bySlug[s] && s !== b.slug) (usedBy[s] ??= new Set()).add(b.slug);
const byTask = {};
for (const b of cat.blocks) if (hasPage(b) && b.type !== "mind" && b.task) (byTask[b.task] ??= []).push(b);
for (const list of Object.values(byTask)) list.sort((a, b) => a.name.localeCompare(b.name));

const ORG = { "@type": "Organization", "@id": `${SITE}/#org`, name: "AI Blocks", url: `${SITE}/`, logo: `${SITE}/og/logo.png`, email: SUPPORT_EMAIL, contactPoint: { "@type": "ContactPoint", email: SUPPORT_EMAIL, contactType: "customer support" }, founder: { "@type": "Person", name: OPERATOR } };
const WEBSITE = { "@type": "WebSite", "@id": `${SITE}/#site`, name: "AI Blocks", url: `${SITE}/`, inLanguage: "en", publisher: { "@id": `${SITE}/#org` }, description: "Free AI skills, workflows, prompts, minds and mini tools that do real work for you and your work." };

// The same links on every plain page, so no page is more than a few clicks from the rest.
const NAV = [["/jobs", "All skills by job"], ["/minds", "Minds"], ["/tools", "Mini tools"], ["/how-it-works", "How it works"], ["/from-a-source", "From a source"], ["/apps", "Apps"]];
const header = `<header class="wrap small" data-prerendered-nav><a href="/"><b>AI Blocks</b></a> · ${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join(" · ")}</header>`;
const footer = `<footer class="wrap small"><p>Free AI skills, workflows, prompts, minds and mini tools.</p><p>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join(" · ")} · <a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">Sitemap</a></p><p>${INFO_PAGES.map(page => `<a href="${page.path}">${esc(page.label)}</a>`).join(" · ")}</p><p><a href="${emailLink()}">${SUPPORT_EMAIL}</a> · ${OPERATOR}, India</p></footer>`;

// Pages that aren't blocks: their title and the line a search result shows.
const STATIC = {
  "/compose": ["Build a custom workflow", "Describe what you want to achieve. Get a step-by-step workflow with connected skills and checks, ready to edit, download and run in your own AI."],
  "/how-it-works": ["How AI Blocks works", "Start with one prompt, add skills, join them into a workflow and build up to your own AI app. Free, step by step."],
  "/minds": ["Minds: hire great thinkers to work on your problem", "Over 300 minds built from public sources. Bring a real problem and get their way of thinking, method and voice applied to it."],
  "/from-a-source": ["Create AI skills from articles, transcripts and notes", "Paste source text and download a handoff pack. Your AI uses it to turn the source's method into reusable skills and a workflow you can review."],
  "/tools": ["Free everyday tools for work and life", "Free tools for design, money, hiring, operations and personal effectiveness. Calculate, clean text, convert data and compare options in your browser."],
  "/apps": ["Example AI apps you can copy", "A real AI app to click through, and a starter pack to build your own from the same parts."],
  "/apps/starter-pack": ["AI app starter pack", "The files, prompts and steps to start your own AI app from the same parts as our example app."],
};

const list = (items) => (items.length ? `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>` : "");
const link = (b) => `<a href="${hrefOf(b)}">${esc(b.name)}</a>`;

function pageFor(url) {
  const info = infoPage(url);
  if (info) return {
    title: info.title, h1: info.title, desc: info.description,
    body: `<p class="bp-sub">${esc(info.description)}</p><p class="small">Effective and last updated ${POLICY_DATE}</p><nav aria-label="On this page">${list(info.sections.map(section => `<a href="#${section.id}">${esc(section.title)}</a>`))}</nav>${info.sections.map(section => `<section id="${section.id}"><h2>${esc(section.title)}</h2>${section.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}${list((section.items ?? []).map(esc))}${list((section.links ?? []).map(link => `<a href="${esc(link.href)}">${esc(link.label)}</a>`))}</section>`).join("")}`,
  };
  if (url === "/tools/growth-channel-planner") return {
    title: "Growth channel planner", h1: "Plan growth for any business", collection: true,
    desc: "Prepare a growth brief for any business. Compare 19 channels, define customer outcomes and download a complete planning skill pack. No website or sign-in required.",
    body: `<p class="bp-sub">19 standalone growth skills, SaaS and general-business workflows, and research and review agents. The site prepares your pack; your AI reads the product and writes the advice.</p><h2>Explore, test, then focus</h2><p>Read your business, compare every channel, prepare up to three affordable pilots, then choose a focus from observed customer quality and economics.</p>${list(tractionChannels.map((c) => `<a href="/skills/${tractionSlug(c.id)}">${esc(c.channel)}</a>: ${esc(c.decision)}`))}<p><a href="/workflows/find-your-saas-growth-channel">SaaS workflow</a> · <a href="/workflows/find-your-business-growth-channel">General-business workflow</a> · <a href="/agents/traction-research-agent">Research agent</a> · <a href="/agents/traction-experiment-keeper">Review agent</a></p>`,
  };
  if (url === "/ai-tools") return {
    title: "AI tools for your work", h1: "Find the right AI product for the job", collection: true,
    desc: `${aiTools.tools.length} AI products with their uses, pricing notes, sources and related skills. Find a product for the work you need done.`,
    body: `<p class="bp-sub">AI products by job, with pricing notes and sources.</p>${list(aiTools.tools.map((t) => `<a href="/ai-tools/${esc(t.slug)}">${esc(t.name)}</a>: ${esc(t.promise)}`))}`,
  };
  if (url.startsWith("/ai-tools/")) {
    const t = aiTools.tools.find((t) => `/ai-tools/${t.slug}` === url);
    if (!t) return null;
    return { title: `${t.name} for your work`, h1: t.name, desc: `${t.promise} Read what ${t.name} does, who it suits, pricing notes and related skills.`, crumbs: [["AI tools", "/ai-tools"]],
      body: `<p class="bp-sub">${esc(t.promise)}</p><h2>What it does</h2>${list(t.does.map(esc))}<h2>Best for</h2>${list(t.bestFor.map(esc))}<h2>Pricing</h2><p>${esc(t.pricing.from)}. ${esc(t.pricing.note)}</p><h2>Related skills</h2>${list(t.blocks.map((b) => `<a href="${esc(b.path)}">${esc(b.name)}</a>`))}<p><a href="${esc(t.url)}">Open ${esc(t.name)}</a></p>`,
    };
  }
  if (STATIC[url]) {
    const [t, d] = STATIC[url];
    let extra = "";
    // The minds and tools pages list every mind and tool, so each is linked from a page a crawler can read.
    if (url === "/minds") extra = Object.entries(AREAS).map(([a, name]) => { const ms = cat.blocks.filter((b) => b.type === "mind" && b.area === a); return ms.length ? `<h2>${esc(name)}</h2>${list(ms.map((m) => `${link(m)}: ${esc(m.identity || "")} · ${esc(m.summary)}`))}` : ""; }).join("");
    if (url === "/tools") extra = list([`<a href="/tools/growth-channel-planner">Growth channel planner</a>: Prepare a business brief and compare 19 growth channels.`, ...[...BROWSER_TOOLS, ...TOOLS].map((x) => `<a href="/tools/${x.slug}">${esc(x.name)}</a>: ${esc(x.summary)}`)]);
    return { title: t, desc: d, h1: t, crumbs: [], body: `<p class="bp-sub">${esc(d)}</p>${extra}`, ld: { "@type": "WebPage" } };
  }
  const [, kind, slug] = url.split("/");
  if (kind === "tools") {
    const browserTool = BROWSER_TOOLS.find(x => x.slug === slug);
    if (browserTool) return { title: browserTool.short, h1: browserTool.short, desc: browserTool.summary, crumbs: [["Tools", "/tools"]], body: `<p class="bp-sub">${esc(browserTool.summary)}</p><p>Use this free tool in your browser. Copy or download the result. Your input stays on your device.</p>` };
    const t = TOOLS.find((x) => x.slug === slug);
    if (!t) return null;
    return {
      title: t.name, desc: t.summary, h1: t.name, crumbs: [["Mini tools", "/tools"]],
      body: `<p class="bp-sub">${esc(t.summary)}</p><p>Free, works in your browser, no account. Each answer comes with the formula, a spreadsheet and the AI code.</p>${list(TOOLS.filter((x) => x !== t).map((x) => `<a href="/tools/${x.slug}">${esc(x.name)}</a>`))}`,
      main: { "@type": "WebApplication", name: t.name, description: t.summary, applicationCategory: "BusinessApplication", operatingSystem: "Any", isAccessibleForFree: true, offers: { "@type": "Offer", price: 0, priceCurrency: "USD" } },
    };
  }
  const b = bySlug[slug];
  if (!b || kindPath(b) !== kind) return null;
  const page = readPage(slug);
  const job = TASK_NAMES[b.task] ?? "";
  const by = b.source?.by;
  const src = page.source ?? {};

  if (b.type === "mind") {
    const credits = page.credits ?? [];
    const wiki = credits.find((c) => /wikipedia\.org/.test(c.url))?.url;
    const area = (AREAS[b.area] ?? b.area ?? "").toLowerCase();
    const disclose = `An AI built from ${credits.length} public sources about ${b.name}'s work. It is not ${b.name} and is not endorsed by them.${/investor|economist/.test((b.labels ?? []).join(" ")) ? " Frameworks only, never buy or sell advice." : ""}`;
    const pairs = (page.pairs ?? []).map((s) => bySlug[s]).filter(Boolean);
    const skills = (b.skills ?? []).map((s) => bySlug[s]).filter(Boolean);
    const ideas = (page.ideas ?? []).slice(0, 6);
    return {
      title: `${b.name}: AI mind for ${area}`, desc: `An AI built from ${b.name}'s public work. ${b.summary}`, h1: b.name, crumbs: [["Minds", "/minds"]],
      body: [
        `<p class="bp-identity">${esc(b.identity || "")}</p>`, `<p class="small">${esc(disclose)}</p>`, `<p class="bp-sub">${esc(b.summary)}</p>`,
        ideas.length ? `<h2>Big ideas</h2>${list(ideas.map((i) => `<b>${esc(i.title)}</b>: ${esc(words(text(i.text), 40))}`))}` : "",
        (page.hire?.jobs ?? []).length ? `<h2>Hire ${esc(b.name)} for</h2>${list(page.hire.jobs.slice(0, 8).map((j) => `<b>${esc(j.title)}</b>: ${esc(words(text(j.text), 30))}`))}` : "",
        skills.length ? `<h2>Skills from their work</h2>${list(skills.map(link))}` : "",
        pairs.length ? `<h2>Pairs well with</h2>${list(pairs.map(link))}` : "",
        credits.length ? `<h2>Built from</h2>${list(credits.slice(0, 25).map((c) => (c.url ? `<a href="${esc(c.url)}" rel="noopener">${esc(c.title)}</a>` : esc(c.title)) + (c.by ? `, ${esc(c.by)}` : "")))}` : "",
      ].join(""),
      main: { "@type": "CreativeWork", name: `${b.name} mind (AI persona)`, description: disclose, creator: { "@id": `${SITE}/#org` }, isAccessibleForFree: true, inLanguage: "en",
        isBasedOn: credits.filter((c) => c.url).slice(0, 10).map((c) => c.url), mentions: { "@type": "Person", name: b.name, ...(wiki ? { sameAs: wiki } : {}) },
        encoding: { "@type": "MediaObject", contentUrl: `${SITE}/skills/${slug}/SKILL.md`, encodingFormat: "text/markdown" } },
      markdown: `/skills/${slug}/SKILL.md`,
    };
  }

  // Skills, prompts and workflows: a unique section built from the page's own facts, not only the template.
  const isFlow = kindPath(b) === "workflows";
  const noun = b.type === "agent" ? "AI agent" : isFlow ? "AI workflow" : b.type === "prompt" ? "AI prompt" : "AI skill";
  const give = (Array.isArray(page.you_give) && page.you_give.length ? page.you_give : (page.plan?.needed ?? []).map((n) => n.what ? `${n.label}: ${n.what}` : n.label)).concat((page.plan?.helps ?? []).map((n) => `${n.label} (optional)`)).slice(0, 8);
  const get = Array.isArray(page.you_get) && page.you_get.length ? page.you_get : (b.outputs ?? []).map((o) => portName(o).replace(/^./, (c) => c.toUpperCase()));
  const steps = isFlow ? (b.steps ?? []).map((x) => bySlug[Array.isArray(x) ? x[0] : x]).filter(Boolean) : [];
  const facts = ["Free", "No account", ...(src.licence ? [`${src.licence.replace(/-/g, " ")} licence`] : []), `Made by ${by ?? "AI Blocks"}`, ...(b.level ? [`Level: ${b.level}`] : []), ...(b.thinking ? [`Thinking: ${b.thinking}`] : []), ...(page.tested?.result === "pass" ? ["Tested"] : [])];
  // Links out: four others in the same job (picked by the page's name, so each page links to a different four),
  // the workflows that use it, its twin, and the job's hub.
  const peers = (byTask[b.task] ?? []).filter((x) => x !== b);
  const start = peers.length ? hash(slug) % peers.length : 0;
  const pick = [0, 1, 2, 3].map((i) => peers[(start + i * Math.max(1, Math.floor(peers.length / 4))) % peers.length]).filter((x, i, a) => x && a.indexOf(x) === i);
  const flows = [...(usedBy[slug] ?? [])].map((s) => bySlug[s]).filter((x) => x && hasPage(x)).slice(0, 6);
  const twin = b.twin && bySlug[b.twin] && hasPage(bySlug[b.twin]) ? bySlug[b.twin] : null;
  const explain = text(page.html?.explain);
  const when = Array.isArray(page.when) ? page.when : page.when ? [page.when] : [];
  const lead = `${b.name} is a free ${noun}${job ? ` for the job "${job}"` : ""}. ${isFlow ? "It guides your AI through several skills in order, passing each step's output to the next." : "Give the instructions to an AI assistant that supports the required files and tools, then review its output."}`;
  const titleBase = `${b.name}: free ${noun}`;
  return {
    title: isFlow ? (`${b.name} · AI workflow`.length <= 60 ? `${b.name} · AI workflow` : b.name) : titleBase.length <= 60 ? titleBase : b.name,
    desc: `${b.summary} Free reusable instructions for your AI assistant.`, h1: b.headline || b.name,
    crumbs: job ? [[job, jobHref(b.task)]] : [],
    body: [
      `<p class="bp-sub">${esc(b.summary)}</p>`, `<p>${esc(lead)}</p>`, `<p class="small">${facts.map(esc).join(" · ")}</p>`,
      by && src.url ? `<p class="small">Made by ${esc(by)}. <a href="${esc(src.url)}" rel="noopener">See the original on GitHub</a>; we copied it as it is, with its licence.</p>` : "",
      explain ? `<h2>What it does</h2><p>${esc(words(explain, 150))}</p>` : "",
      give.length ? `<h2>You give it</h2>${list(give.map(esc))}` : "",
      get.length ? `<h2>You get</h2>${list(get.map(esc))}` : "",
      when.length ? `<h2>Use it when</h2>${list(when.slice(0, 5).map(esc))}` : "",
      steps.length ? `<h2>Steps</h2><ol>${steps.map((s) => `<li>${link(s)}: ${esc(s.summary)}</li>`).join("")}</ol>` : "",
      (page.how_to_use ?? []).length ? `<h2>How to use it</h2><ol>${page.how_to_use.slice(0, 6).map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : "",
      flows.length ? `<h2>Workflows that use it</h2>${list(flows.map(link))}` : "",
      twin ? `<h2>Same look, other format</h2>${list([link(twin)])}` : "",
      pick.length ? `<h2>More for ${esc(job || "the same job")}</h2>${list(pick.map(link))}${job ? `<p><a href="${jobHref(b.task)}">Every ${esc(job.toLowerCase())} skill</a></p>` : ""}` : "",
    ].join(""),
    main: isFlow
      ? { "@type": "HowTo", name: b.name, description: b.summary, step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.summary, url: `${SITE}${hrefOf(s)}` })) }
      : { "@type": "CreativeWork", name: b.name, description: b.summary, inLanguage: "en", isAccessibleForFree: true, keywords: job || undefined, publisher: { "@id": `${SITE}/#org` },
          author: by ? { "@type": "Organization", name: by } : { "@id": `${SITE}/#org` }, ...(src.url ? { isBasedOn: src.url } : {}), ...(LICENCE_URL(src.licence) ? { license: LICENCE_URL(src.licence) } : {}),
          encoding: { "@type": "MediaObject", contentUrl: `${SITE}/skills/${slug}/SKILL.md`, encodingFormat: "text/markdown" } },
    markdown: isFlow ? null : `/skills/${slug}/SKILL.md`,
  };
}

// One page's HTML: the shell with this page's head tags, structured data and first screen.
function render(url, p, { plain = false, noindex = false } = {}) {
  const full = `${SITE}${url === "/" ? "/" : url}`;
  const suffixed = `${p.title} · AI Blocks`;
  const title = p.documentTitle || SEO_TITLES[url] || (suffixed.length <= 65 ? suffixed : p.title);
  const desc = clip(p.desc);
  const crumbs = [["AI Blocks", "/"], ...(p.crumbs ?? []), [p.h1, url]];
  const graph = [ORG, WEBSITE,
    { "@type": p.collection ? "CollectionPage" : "WebPage", "@id": `${full}#page`, url: full, name: p.title, description: desc, inLanguage: "en", isPartOf: { "@id": `${SITE}/#site` },
      breadcrumb: { "@id": `${full}#crumbs` }, ...(p.main ? { mainEntity: p.main } : {}) },
    { "@type": "BreadcrumbList", "@id": `${full}#crumbs`, itemListElement: crumbs.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${SITE}${u}` })) },
  ];
  const body = `<main class="wrap bp-hero" data-prerendered>${header}<p class="small">${crumbs.slice(0, -1).map(([n, u]) => `<a href="${u}">${esc(n)}</a>`).join(" › ")}</p><h1 class="bp-h1">${esc(p.h1)}</h1>${p.body}${footer}</main>`;
  const metadata = { title, description: desc, canonical: full, robots: noindex ? "noindex, nofollow" : "max-image-preview:large, max-snippet:-1", graph: noindex ? null : { "@context": "https://schema.org", "@graph": graph }, markdown: p.markdown || null, image: `${SITE}/og/default.png` };
  const metadataFile = path.join(DIST, "metadata", `${url === "/" ? "index" : url.slice(1)}.json`);
  fs.mkdirSync(path.dirname(metadataFile), { recursive: true });
  fs.writeFileSync(metadataFile, JSON.stringify(metadata));
  const head = [
    noindex ? "" : `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`,
    p.markdown ? `<link rel="alternate" type="text/markdown" href="${p.markdown}" title="The skill file" />` : "",
    `<meta name="robots" content="${metadata.robots}" />`,
  ].filter(Boolean).join("\n    ");
  return (plain ? plainShell : shell)
    .replace(/<meta name="robots"[^>]*>\s*/g, "")
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, (_, prefix) => prefix + esc(desc))
    .replace(/(<link rel="canonical" href=")[^"]*/, (_, prefix) => prefix + full)
    .replace(/(<meta property="og:url" content=")[^"]*/, (_, prefix) => prefix + full)
    .replace(/(<meta property="og:title" content=")[^"]*/, (_, prefix) => prefix + esc(title))
    .replace(/(<meta property="og:description" content=")[^"]*/, (_, prefix) => prefix + esc(desc))
    .replace(/(<meta name="twitter:title" content=")[^"]*/, (_, prefix) => prefix + esc(title))
    .replace(/(<meta name="twitter:description" content=")[^"]*/, (_, prefix) => prefix + esc(desc))
    .replace("</head>", () => `${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
}
const write = (url, html) => { const out = path.join(DIST, `${url.slice(1)}.html`); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html); };

const urls = [...fs.readdirSync("public").filter((f) => /^sitemap-.*.xml$/.test(f)).map((f) => fs.readFileSync(`public/${f}`, "utf8")).join("").matchAll(/<loc>https:\/\/useaiblocks\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
let wrote = 0;
const titles = new Map(), problems = [];

// The home page: the main sections and every job, so a crawler reaches the whole library in two steps.
const tasks = Object.entries(byTask).sort((a, b) => b[1].length - a[1].length);
fs.writeFileSync(path.join(DIST, "index.html"), render("/", {
  documentTitle: "Free AI Skills & Custom Workflow Builder | AI Blocks",
  title: "Free AI skills, workflows and minds", desc: "Explore free AI skills, prompts and workflows. Build a custom workflow, edit the steps and download a pack to run in your AI. Try free browser tools too.", h1: "Use AI like the top 1%",
  body: `<p class="bp-sub">Turn hours of work into minutes. Spend the time you save on the work only you can do. Or at the beach (we won't tell).</p><p><a href="/compose">Build a custom workflow</a> · <a href="/tools">Explore free browser tools</a></p><h2>Skills by job</h2>${list(tasks.map(([t, bs]) => `<a href="${jobHref(t)}">${esc(TASK_NAMES[t] ?? t)}</a> (${bs.length}): ${bs.slice(0, 3).map(link).join(", ")}`))}<h2>Minds</h2>${list(cat.blocks.filter((b) => b.type === "mind").slice(0, 24).map(link))}<p><a href="/minds">All minds</a></p>`,
}).replace(/<title>[^<]*<\/title>/, "<title>Free AI Skills &amp; Custom Workflow Builder | AI Blocks</title>"));

// Job hubs: /jobs lists every job; /jobs/<job> lists every page for it with its one line, 150 to a page.
const PER = 150;
const hubUrls = ["/jobs"];
write("/jobs", render("/jobs", {
  title: "All AI skills and workflows by job", desc: `${cat.blocks.filter((b) => hasPage(b) && b.type !== "mind").length} free AI skills, workflows and prompts, sorted into ${tasks.length} jobs. Pick the job you need done.`, h1: "All skills by job", collection: true,
  body: list(tasks.map(([t, bs]) => `<a href="${jobHref(t)}">${esc(TASK_NAMES[t] ?? t)}</a>: ${bs.length} skills and workflows`)),
  main: { "@type": "ItemList", numberOfItems: tasks.length, itemListElement: tasks.map(([t], i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${jobHref(t)}`, name: TASK_NAMES[t] ?? t })) },
}, { plain: true }));
for (const [t, bs] of tasks) {
  const name = TASK_NAMES[t] ?? t;
  for (let pg = 0; pg * PER < bs.length; pg++) {
    const url = jobHref(t) + (pg ? `/${pg + 1}` : "");
    const items = bs.slice(pg * PER, (pg + 1) * PER);
    const pages = Math.ceil(bs.length / PER);
    const nav = pages > 1 ? `<p>${Array.from({ length: pages }, (_, i) => (i === pg ? `<b>Page ${i + 1}</b>` : `<a href="${jobHref(t)}${i ? `/${i + 1}` : ""}">Page ${i + 1}</a>`)).join(" · ")}</p>` : "";
    write(url, render(url, {
      title: `${name}: ${bs.length} free AI skills${pg ? `, page ${pg + 1}` : ""}`, desc: `Free AI skills and workflows to ${name.toLowerCase()}, such as ${items.slice(0, 3).map((x) => x.name).join(", ")}. Run them in an AI assistant with the required tools.`, h1: name + (pg ? `, page ${pg + 1}` : ""),
      crumbs: [["All skills by job", "/jobs"]], collection: true,
      body: `<p class="bp-sub">${bs.length} free AI skills and workflows for this job.</p>${nav}${list(items.map((x) => `${link(x)}: ${esc(x.summary)}`))}${nav}`,
      main: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: pg * PER + i + 1, url: `${SITE}${hrefOf(x)}`, name: x.name })) },
    }, { plain: true }));
    hubUrls.push(url);
  }
}

for (const url of urls) {
  if (url === "/") continue;
  const p = pageFor(url);
  if (!p) { problems.push(`no page data for ${url}`); continue; }
  const html = render(url, p);
  const t = html.match(/<title>([^<]*)<\/title>/)[1];
  if (titles.has(t)) problems.push(`same title on ${titles.get(t)} and ${url}: ${t}`);
  titles.set(t, url);
  write(url, html);
  wrote++;
}

// A dedicated shell avoids Pages' wildcard-to-index rewrite loop for shared links.
write("/space", render("/space", { title: "My private space", desc: "Keep your own AI skills, prompts and workflows together. Manage your space using your private device link and choose what to share.", h1: "My private space", body: "<p>Your owner link controls access to this space. Keep it private.</p>" }, { noindex: true }));
write("/people", render("/people", { title: "Skills and workflows from people", desc: "Explore public AI skills, prompts and workflows shared by the community. Open a shared item or add it to your own collection.", h1: "From people", body: "<p>Discover skills and workflows people have chosen to make public.</p>" }));
write("/shared-space-shell", render("/shared-space-shell", { title: "Shared space", desc: "Read a shared collection of AI skills and workflows.", h1: "Shared space", body: "" }, { noindex: true }));
// A real 404: Cloudflare Pages answers unknown addresses with it (and a 404 status) instead of the home page.
fs.writeFileSync(path.join(DIST, "404.html"), render("/404", { title: "Page not found", desc: "This page doesn't exist. Find the skill you need by job.", h1: "This page doesn't exist",
  body: `<p class="bp-sub">The address may have a typo, or the page may have moved. Start from a job:</p>${list(tasks.map(([t]) => `<a href="${jobHref(t)}">${esc(TASK_NAMES[t] ?? t)}</a>`))}` }, { plain: true, noindex: true }));
// The hub addresses go into their own sitemap, read by build-index's sitemap index.
fs.writeFileSync(path.join(DIST, "sitemap-jobs.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${hubUrls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`prerender: ${wrote} pages, ${hubUrls.length} job hubs, a 404 page${problems.length ? `\n  ${problems.slice(0, 20).join("\n  ")}` : ""}`);
// The saved, non-writing example is part of this deployment. This avoids a
// separate unconfigured host; its files count against the same capacity guard.
const exampleSource = path.resolve("../example-app-site/example-app");
if (!fs.existsSync(path.join(exampleSource, "index.html"))) {
  throw new Error("The Mercatura example is missing; refusing to build a broken example link.");
}
fs.cpSync(exampleSource, path.join(DIST, "example-app"), { recursive: true });
console.log("example app: saved tour included at /example-app/ (excluded from search)");
// Launch target: Workers Static Assets on Workers Paid (100,000 files/version).
// Leave 5,000 files of headroom. Verify the account subscription before deploying.
const MAX_FILES = 95000;
const count = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(d, e.name)) : 1), 0);
const files = count(DIST);
console.log(`dist: ${files.toLocaleString("en-US")} files (guard ${MAX_FILES.toLocaleString("en-US")}; Workers Paid required for more than 20,000 files)`);
if (files > MAX_FILES) { console.error(`  dist has ${files} files, over ${MAX_FILES}: bundle more files, or move to a plan that takes more`); process.exitCode = 1; }
if (problems.length) process.exitCode = 1;
