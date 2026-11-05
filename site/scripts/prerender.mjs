// Gives every page in the sitemap its own HTML file after `vite build`, so search engines, answer engines and link
// previews see the right title, description, canonical address, structured data and a readable first screen
// without running any script. The app still takes over as normal: main.tsx clears this first screen and renders.
// Also writes the job hubs (/jobs, /jobs/<job>), which are plain pages with no app, and a real 404 page.
// Cloudflare Pages serves dist/skills/<slug>.html at /skills/<slug>. Run from site/: node scripts/prerender.mjs
// Checklists: the technical-seo-auditor, seo-site-auditor, ai-search-visibility-optimiser, structured-data-writer and
// tool-pages-seo-fixer skills in our own library (catalogue-items/imported/).
import fs from "node:fs";
import { factCheckHtml } from "./lib/fact-check-html.mjs";
import { catalogueUsageHowTo } from "./lib/catalogue-usage.mjs";
import { skillNeighbours } from "../src/lib/skill-neighbours.ts";
import { hubDescription } from "./lib/hub-description.mjs";
import { pageShell } from "./lib/page-shell.mjs";
import {rolePage} from "./lib/role-pages.mjs";
import { loadRoleLinks, specialistsSection, hubSpecialists } from "./lib/role-links.mjs";
import { roleSeeds, sameJobAgentPages } from "../src/roles/role-definitions.mjs";
import {mindDirectory, mindDirectoryUrls} from "./lib/mind-directory.mjs";
import { brokenLinks, guidesSitemap, trustPages } from "./lib/trust-pages.mjs";
import { staticFooter, staticHeader } from "./lib/site-chrome.mjs";
import { BOARD_NAMES, boardHref, playbookHref } from "../src/trust-pages/board-names.mjs";
import { readPrerenderShell, injectPrerender } from "./lib/prerender-shell.mjs";
import { AREAS as JOB_AREAS, FUNCTIONS, TASKS } from "../src/lib/catalogue-taxonomy.mjs";
import { BROWSER_TOOLS } from "../src/tools/browser-tools.mjs";
import { INFO_PAGES, OPERATOR, POLICY_DATE, SOCIAL_PROFILES, SUPPORT_EMAIL, emailLink, infoPage } from "../src/lib/site-info.mjs";
import path from "node:path";
import { normalizeSkillHtml } from "../src/lib/skill-html.mjs";
import { similarHtml, skipWhenItems } from "./lib/similar-html.mjs";
import { BRAND, describe, fitTitle, itemSeo, lowerFirst, mindTitle, pageTitle, titleLadder, trimDescription } from "../src/lib/seo-meta.mjs";
import { outcomePage } from "./lib/outcome-pages.mjs";

const DIST = process.env.PRERENDER_DIST || "dist";
const SITE = "https://useaiblocks.com";
const SEO_TITLES = {
  "/skills/check-translation-parity-across-three-languages": "Russian, English, Portuguese translation check | AI Blocks",
  "/workflows/check-management-payout-and-sponsor-receipts": "Check management awards and investor returns | AI Blocks",
  "/workflows/clean-up-your-meta-account-and-rebuild-it-to-scale": "Meta account review and restructure plan | AI Blocks",
  "/workflows/fix-inbox-placement-and-win-back-your-opens": "Email delivery and quiet-subscriber recovery | AI Blocks",
  "/workflows/investment-results-review": "Review holdings against business results | AI Blocks",
  "/workflows/make-your-me-md-and-set-it-up-in-every-ai": "Build your me.md for use across AI tools | AI Blocks",
  "/workflows/real-earning-power": "Company earnings reliability and adjustments | AI Blocks",
  "/workflows/reconcile-seller-closing-cash": "Check seller proceeds and retained cash | AI Blocks",
  "/workflows/reconcile-the-bank-to-your-books-and-issue-a-clean-p-and-l": "Bank reconciliation and financial statements | AI Blocks",
  "/workflows/review-a-down-round-rights-change": "Review down-round and option-pool changes | AI Blocks",
  "/workflows/run-fair-interviews-and-choose-on-evidence": "Interview plans and candidate comparisons | AI Blocks",
  "/workflows/separate-financing-effects-from-operating-cash": "Review factoring and supplier finance cash | AI Blocks",
  "/workflows/separate-pension-cost-funding-and-remeasurement": "Check pension funding and expense changes | AI Blocks",
  "/workflows/set-up-a-documentation-system-and-write-sops-that-pass-a-check": "Plan team documentation, SOPs and runbooks | AI Blocks",
  "/workflows/set-up-product-tracking-and-build-a-retention-dashboard": "Product tracking and retention dashboard | AI Blocks",
  "/workflows/set-your-cac-limit-and-test-what-ads-really-add": "Customer acquisition cost and ad-lift tests | AI Blocks",
  "/workflows/ship-stock-to-amazon-and-claim-back-what-goes-missing": "Amazon stock shipments and reimbursement | AI Blocks",
  "/workflows/stress-test-a-business-plan-before-you-commit-money": "Review business plan downside scenarios | AI Blocks",
  "/workflows/test-input-inflation-against-stock-clearance": "Stock clearance cash and replacement cost | AI Blocks",
  "/workflows/turn-a-messy-spreadsheet-into-a-clean-slide-deck": "Spreadsheet cleanup and checked slide decks | AI Blocks",
  "/workflows/turn-a-report-into-an-editable-briefing-deck": "Report-to-slide briefing deck and review | AI Blocks",
  "/workflows/turn-the-first-weeks-after-an-order-into-repeat-buyers": "Post-purchase emails and repeat-order tests | AI Blocks",
  "/workflows/write-a-procedure-test-it-and-build-a-training-deck": "Procedure drafts, testing and training decks | AI Blocks",
  "/agents/weekly-saas-numbers-keeper": "Review SaaS revenue, churn and customer cost | AI Blocks",
  "/workflows/build-google-remarketing-lists-and-campaigns-then-read-the-results": "Google Remarketing Campaigns and Results | AI Blocks",
  "/workflows/job-based-product-design": "Customer Jobs to Be Done Design Workflow | AI Blocks",
  "/tools/agency-or-in-house": "Agency vs In-House Cost Calculator, Free Tool | AI Blocks",
  "/tools/ai-time-saved": "AI Time Savings Calculator: Free Online Tool | AI Blocks",
  "/tools/launch-revenue-planner": "Launch Revenue Calculator: Free Online Tool | AI Blocks",
  "/tools/stock-weeks-of-cover": "Stock Weeks of Cover Calculator, Free Tool | AI Blocks",
};
// The built index.html, as vite left it (a second run first strips what the last one added to the home page).
const shell = readPrerenderShell(fs.readFileSync(path.join(DIST, "index.html"), "utf8"));
// The same page without the app: for hubs and the 404 page, which are complete as plain HTML.
const plainShell = shell
  .replace(/<!-- APP_BOOT_START[\s\S]*?<!-- APP_BOOT_END -->\s*/g, "")
  .replace(/<!-- APP_LOADER_START -->[\s\S]*?<!-- APP_LOADER_END -->\s*/g, "")
  .replace(/<script type="module"[^>]*><\/script>\s*/g, "")
  .replace(/<link rel="modulepreload"[^>]*>\s*/g, "")
  .replace(/<link rel="preload" href="\/data\/blocks.json"[^>]*>\s*/, "");
const cat = JSON.parse(fs.readFileSync("public/data/blocks.json", "utf8"));
const aiTools = JSON.parse(fs.readFileSync("public/data/ai-tools.json", "utf8"));
const roleIndex = JSON.parse(fs.readFileSync("public/data/roles-index.json", "utf8"));
// Specialists who use each item, and the agency agent pages that are the same job as a role page (canonical: the role).
const roleLinks = loadRoleLinks();
const sameJobAgents = sameJobAgentPages(roleSeeds(cat.blocks), cat.blocks);
const { TRACTION_CHANNELS: tractionChannels, tractionSlug } = await import("../../tools/lib/traction-channels.mjs");
const bySlug = Object.fromEntries(cat.blocks.map((b) => [b.slug, b]));
const directoryMinds = cat.blocks.filter(b => b.type === "mind");
const { TOOLS } = await import("../../mini-tools/index.mjs");
const TASK_NAMES = Object.fromEntries(TASKS.map(task => [task.id, task.name]));
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
// An imported item nobody has tested yet. Its page stays indexable; the card and page badge say it has not been tested.
const isThin = (b) => b.origin === "imported" && !b.tested;
const portName = (p) => String(p).replace(/\?$/, "").replace(/_/g, " ");
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const LICENCE_URL = (id) => (id ? `https://spdx.org/licenses/${id}.html` : undefined);
const jobHref = (t) => `/jobs/${t}`;
const readPage = (slug) => { try { return JSON.parse(fs.readFileSync(`public/data/pages/${slug}.json`, "utf8")); } catch { return {}; } };
// "Is it for you?" (the first 3 when, all not_for with the items they name linked), the similar items in the same job,
// and the output sample, for the What you get part of a page.
function fitAndExample(page, slug) {
  const strs = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter((x) => typeof x === "string" && x.trim());
  const useWhen = strs(page.when).slice(0, 3), notFor = skipWhenItems(page, esc);
  const fitHtml = (useWhen.length || notFor.length ? `<div id="fit"><h3>Is it for you?</h3>${useWhen.length ? `<h4>Use it when</h4>${list(useWhen.map(esc))}` : ""}${notFor.length ? `<h4>Skip it when</h4>${list(notFor)}` : ""}</div>` : "") + similarHtml(page.siblings, slug, esc);
  // output_sample: what goes in, then what comes out. The full list is kept for crawlers; the page itself folds it after 6.
  const os = page.output_sample;
  const outs = (Array.isArray(os?.output) ? os.output : []).filter((o) => o && typeof o.name === "string" && o.name.trim() && typeof o.contains === "string" && o.contains.trim());
  const ins = strs(os?.input), pre = strs(os?.prerequisites);
  const hasSample = ins.length > 0 && outs.length > 0;
  const sampleHtml = hasSample ? `<div id="sample"><h3>What goes in</h3>${list(ins.map(esc))}${pre.length ? `<h4>Before you start</h4>${list(pre.map(esc))}` : ""}<h3>What comes out</h3>${list(outs.map((o) => `<b>${esc(o.name)}</b>: ${esc(o.contains)}`))}</div>` : "";
  return { fitHtml, sampleHtml, hasSample };
}

// Who links to whom: the workflows that use a block, so its page can link back up to them.
const usedBy = {};
for (const b of cat.blocks) for (const s of [...(b.uses ?? []), ...(b.steps ?? []).map((x) => (Array.isArray(x) ? x[0] : x))]) if (bySlug[s] && s !== b.slug) (usedBy[s] ??= new Set()).add(b.slug);
const byTask = {};
for (const b of cat.blocks) if (hasPage(b) && b.type !== "mind" && b.task) (byTask[b.task] ??= []).push(b);
for (const list of Object.values(byTask)) list.sort((a, b) => a.name.localeCompare(b.name));

const ORG = { "@type": "Organization", "@id": `${SITE}/#org`, name: "AI Blocks", url: `${SITE}/`, logo: `${SITE}/og/logo.png`, email: SUPPORT_EMAIL, contactPoint: { "@type": "ContactPoint", email: SUPPORT_EMAIL, contactType: "customer support" }, founder: { "@type": "Person", name: OPERATOR }, ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES.map((p) => p.url) } : {}) };
const WEBSITE = { "@type": "WebSite", "@id": `${SITE}/#site`, name: "AI Blocks", url: `${SITE}/`, inLanguage: "en", publisher: { "@id": `${SITE}/#org` }, description: "Free AI skills, workflows, prompts, minds and mini tools that do real work for you and your work.",
  // The library search on the home page takes ?q=, so Google can offer a search box for it.
  potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE}/?q={search_term_string}` }, "query-input": "required name=search_term_string" } };

// The same links on every plain page, so no page is more than a few clicks from the rest.
const NAV = [["/roles", "Hire an AI specialist"], ["/jobs", "All skills by job"], ["/minds", "Minds"], ["/tools", "Tools"], ["/ai-tools", "AI tool guides"], ["/how-it-works", "How it works"], ["/train-your-own-ai-agent", "Train your own AI agent"], ["/teams", "Plan an AI team"], ["/apps", "Apps"], ["/api-and-mcp", "Connect your AI"], ["/api-and-mcp#api", "Documentation"], ["/industries", "AI help by business"], ["/how-we-test", "How we test"]];
const header = `<header class="small" data-prerendered-nav><a href="/"><b>AI Blocks</b></a><nav aria-label="Main navigation"><a href="/#library">Find a task</a> · <a href="/roles">Hire an AI specialist</a> · <a href="/compose">Build a workflow</a> · <a href="/tools">Tools</a> · <a href="/minds">Minds</a> · <a href="/space">Team space</a> · <a href="/account" data-testid="account-link">My work</a></nav></header>`;
// Plain pages (job hubs, business boards, How we test) use the app's header and footer, drawn without the app (lib/site-chrome.mjs).
const GLOBE = ["..###..", ".#+#+#.", "#+#+#+#", "##+#+##", "#+#+#+#", ".#+#+#.", "..###.."];
const logo = `<svg viewBox="0 0 24 24" aria-hidden="true" class="logo">${GLOBE.flatMap((row, y) => [...row].map((c, x) => (c === "." ? "" : `<rect x="${(x * 3.4 + 0.3).toFixed(1)}" y="${(y * 3.4 + 0.3).toFixed(1)}" width="2.9" height="2.9" fill="currentColor"${c === "+" ? ' opacity="0.32"' : ""}/>`))).join("")}</svg>`;
const footer = `<footer class="wrap small"><p>Free AI skills, workflows, prompts, minds and mini tools.</p><p>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join(" · ")} · <a href="/llms.txt">llms.txt</a> · <a href="/sitemap.xml">Sitemap</a></p><p>${INFO_PAGES.map(page => `<a href="${page.path}">${esc(page.label)}</a>`).join(" · ")}</p><p><a href="${emailLink()}">${SUPPORT_EMAIL}</a></p>${SOCIAL_PROFILES.length ? `<p>${SOCIAL_PROFILES.map((p) => `<a href="${esc(p.url)}" rel="me noopener">${esc(p.label)}</a>`).join(" · ")}</p>` : ""}</footer>`;

// Pages that aren't blocks: their title and the line a search result shows.
const STATIC = {
  "/community": ["Skills and workflows from the community", "Explore skills and workflows made by the community and reviewed before publication."],
  "/publish": ["Share your skill or workflow", "Create a submission with your instructions and supporting files for our team to review."],
  "/my-submissions": ["Your community submissions", "Track your drafts, review feedback and published submissions."],
  "/admin/review": ["Review community submissions", "Backend review queue for community skills and workflows."],
  "/compose": ["Build a workflow", "Say what you want done. Get a free step-by-step plan with the right skills and checks. Edit it, then give it to your AI. No sign-up needed."],
  "/how-it-works": ["How AI Blocks works", "Start with one prompt, add skills, join them into a workflow and build up to your own AI app. Free, step by step."],
  "/minds": ["Minds: hire great thinkers to work on your problem", "Over 500 minds built from public sources. Get practical help with everyday life, learning, work and creative projects, using their methods and questions."],
  "/from-a-source": ["Create AI skills from articles, transcripts and notes", "Paste source text and download a handoff pack. Your AI uses it to turn the source's method into reusable skills and a workflow you can review."],
  "/tools": ["Free everyday tools for work and life", "Free tools for design, money, hiring, operations and personal effectiveness. Calculate, clean text, convert data and compare options in your browser."],
  "/apps": ["Example AI apps you can copy", "A real AI app to click through, and a starter pack to build your own from the same parts. The files, prompts and steps are all on this page."],
};

const list = (items) => (items.length ? `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>` : "");
const link = (b) => `<a href="${hrefOf(b)}">${esc(b.name)}</a>`;

// What a search result shows for each page that isn't a catalogue item: the title (50 to 60 characters, brand last)
// and the description (120 to 155 characters). check-seo.mjs holds these ranges.
const SEO_PAGES = {
  "/community": ["Community AI skills and workflows, reviewed | AI Blocks", "Explore AI skills and workflows made by the community. Each one is reviewed before it is published, and you can read every file before you use it."],
  "/compose": ["Build a custom AI workflow from your goal | AI Blocks", STATIC["/compose"][1]],
  "/how-it-works": ["How AI skills, workflows and apps work | AI Blocks", "Learn what prompts, skills, workflows, agents and apps are, which one fits your job, and how to add each to ChatGPT, Claude, Claude Code or Codex."],
  "/minds": [`AI minds: hire great thinkers for your problem | ${BRAND}`, `${cat.blocks.filter((b) => b.type === "mind").length} AI minds built from public sources. Get practical help with work, learning and creative projects, using each thinker's methods and questions.`],
  "/from-a-source": ["Turn an article or transcript into AI skills | AI Blocks", STATIC["/from-a-source"][1]],
  "/tools": ["Free online calculators and everyday tools | AI Blocks", STATIC["/tools"][1]],
  "/apps": ["Example AI app you can click through and copy | AI Blocks", STATIC["/apps"][1]],
  "/api-and-mcp": ["Connect your AI to AI Blocks with MCP or the API | AI Blocks", "Connect ChatGPT, Claude, Codex or your own app to AI Blocks once. Then your AI can find, plan and get any skill or workflow when it needs one."],
  "/train-your-own-ai-agent": ["How to train your own AI agent, step by step | AI Blocks", "Train ChatGPT, Claude or Gemini to do one job your way, with no code. Nine plain steps, five prompts and a free starter pack with every file you need."],
  "/me-md": ["me.md: one file that tells every AI who you are | AI Blocks", "Make one private file that tells ChatGPT, Claude and Gemini who you are. Get the template, three prompts to make it, and where to put it in each AI."],
  "/tools/growth-channel-planner": ["Growth channel planner: compare 19 channels | AI Blocks", "Prepare a growth brief for any business. Compare 19 channels, define customer outcomes and download a complete planning skill pack. No sign-in needed."],
  "/support": ["Get help with AI Blocks skills and workflows | AI Blocks", "Ask a question, report a broken skill or get help with your workflow. Write to Kevin Mark at hello@useaiblocks.com and get a reply from a person."],
  "/about": ["About: free reusable AI skills and workflows | AI Blocks", "AI Blocks is a free library of AI skills, prompts, workflows, minds and mini tools, run by Kevin Mark. See what it is for and who makes it."],
  "/privacy": ["Privacy policy: accounts, saved work and AI use | AI Blocks", "How AI Blocks handles saved work, accounts, AI requests and optional visitor analytics, and how to contact us about your data or ask for it to be deleted."],
  "/terms": ["Terms of service: accounts, licences, AI output | AI Blocks", "The terms for using AI Blocks, including free access, accounts, acceptable use, content licences, third-party tools and what to know about AI output."],
  "/cookies": ["Cookies and browser storage: what we save | AI Blocks", "What AI Blocks saves in your browser, which sign-in and security storage it uses, and how Google Analytics and Microsoft Clarity cookies work."],
  "/ai-disclaimer": ["AI disclaimer: check AI output before using it | AI Blocks", "How AI Blocks uses AI, what workflow packs and AI minds do, and the checks to make before you rely on or publish anything an AI generated."],
};
const niceDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const isoDate = (d) => { const t = Date.parse(`${d} UTC`); return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10); };
const grab = (file) => { try { return fs.readFileSync(file, "utf8"); } catch { return ""; } };
const matches = (text, re) => [...text.matchAll(re)].map((m) => m.slice(1));
// The browser-built pages say the same thing to a crawler as to a visitor: these read the lists the app itself uses.
function howItWorksBody() {
  const t = grab("src/HowItWorks.tsx");
  const sub = t.match(/<p className="bp-sub">([^<]+)<\/p>/)?.[1] ?? "";
  const kinds = matches(t, /name: "([^"]+)", line: "([^"]+)"/g);
  const choose = matches(t.slice(t.indexOf("const CHOOSE"), t.indexOf("const WORDS")), /^\s*\["([^"]+)", "([A-Za-z]+)", "[a-z]+"\]/gm);
  const words = matches(t.slice(t.indexOf("const WORDS"), t.indexOf("const Steps")), /^\s*\["([^"]+)", "([^"]+)"\]/gm);
  return [
    `<p class="bp-sub">${esc(sub)}</p>`,
    `<h2>Start with one task</h2><ol><li>Choose what you want to do in <a href="/#library">Find a task</a>. Try meeting notes or an email reply.</li><li>Add the details the task asks for. Optional details can wait.</li><li>Copy the request into your AI chat, or give your AI the downloaded files. Send it to start the work.</li></ol>`,
    `<h2>Six kinds, from one message to an app</h2><p>Each one does more than the one before. Start with the smallest one that does your job.</p>${list(kinds.map(([n, l]) => `<b>${esc(n)}</b>: ${esc(l)}`))}`,
    `<h2>Which one to use</h2>${list(choose.map(([need, kind]) => `${esc(need)}: use ${/^[aeiou]/i.test(kind) ? "an" : "a"} ${esc(kind.toLowerCase())}.`))}`,
    `<p><a href="/jobs">Browse every skill by job</a> · <a href="/compose">Build a workflow from your goal</a> · <a href="/apps">See an example app</a></p>`,
    `<p><a href="/me-md">Make your me.md once. Every task then fits you.</a></p>`,
    `<p><a href="/train-your-own-ai-agent">Train your own AI agent for a job you do often.</a></p>`,
    `<h2>How we build and review</h2>${list(["Kevin Mark runs AI Blocks. Each page says what you give the item, what you get back and when to skip it.", "Some items are rebuilt by us in our own words from public sources, which the page credits. Others are imported from open-licence collections, with the author, source and licence on the page.", "Safety checked means we checked the item for harmful or hidden instructions. Its page lists what goes in and what you get."])}<p><a href="/about#how-built">Read more about how we build and review</a></p>`,
    `<h2>Words you'll see</h2>${list(words.map(([w, d]) => `<b>${esc(w)}</b>: ${esc(d)}`))}`,
  ].join("");
}
function appsBody() {
  const a = grab("src/apps/AppsPage.tsx"), d = grab("src/apps/data.ts");
  const sub = a.match(/<p className="bp-sub">(See how[^<]+)<\/p>/)?.[1] ?? "";
  const note = a.match(/data-testid="example-note">([^<]+)</)?.[1] ?? "";
  const steps = matches(a.slice(a.indexOf('id="workflow-to-app"'), a.indexOf('id="inside"')), /^\s*\["([^"]+)", "([^"]+)"\]/gm);
  const areas = matches(d.slice(d.indexOf("export const AREAS"), d.indexOf("export const SETUP_STEPS")), /name: "([^"]+)", line: "([^"]+)"/g);
  const setup = matches(d.slice(d.indexOf("export const SETUP_STEPS")), /step: "([^"]+)", what: "([^"]+)"/g);
  return [
    `<p class="bp-sub">${esc(sub)}</p>`, note ? `<p>${esc(note)}</p>` : "",
    `<p><a href="/example-app/">Open the example app</a> · <a href="#starter-pack">Get the app starter pack</a></p>`,
    `<h2>Put your workflow behind a form and a button</h2><ol>${steps.map(([h, t]) => `<li><b>${esc(h)}</b> ${esc(t)}</li>`).join("")}</ol>`,
    `<h2>What's inside the example app</h2>${list(areas.map(([n, l]) => `<b>${esc(n)}</b>: ${esc(l)}`))}`,
    `<section id="starter-pack"><h2>Build your own with the app starter pack</h2><p>A folder you give to your AI coding assistant. It asks you ten questions, writes a one-page brief, then builds one small stage at a time. It waits for your OK before it writes code, and stops after each stage so you can try it.</p></section>`,
    `<h2>Or start from our open-source app</h2><p>The open-source starter runs for one person on your own computer. It starts with sample data, so nothing costs money until you connect your own services.</p><ol>${setup.map(([h, t]) => `<li><b>${esc(h)}.</b> ${esc(t)}</li>`).join("")}</ol>`,
    `<p><a href="/how-it-works">How skills, workflows and apps fit together</a> · <a href="/compose">Build a workflow first</a></p>`,
  ].join("");
}
function composeBody() {
  const flows = cat.blocks.filter((b) => kindPath(b) === "workflows" && hasPage(b) && !isThin(b)).slice(0, 12);
  return [
    `<p class="bp-sub">${esc(STATIC["/compose"][1])}</p>`,
    `<h2>How it works</h2><ol><li><b>Say what you want to achieve.</b> Write the goal in your own words, with who it is for and what a good result looks like.</li><li><b>Review the plan.</b> Your workflow shows what each step does, what it needs and what comes next. Edit the order and instructions before you download.</li><li><b>Download and run it.</b> Your AI does the work after you download the plan: give it the pack and ask it to follow HANDOFF.md.</li></ol>`,
    `<h2>Start from a workflow that already exists</h2>${list(flows.map((b) => `${link(b)}: ${esc(b.summary)}`))}<p><a href="/?kind=workflow#library">Browse all workflows</a> · <a href="/from-a-source">Turn an article or transcript into a workflow</a> · <a href="/how-it-works">How it works</a></p>`,
  ].join("");
}
function sourceBody() {
  const t = grab("src/IntakePage.tsx");
  const sub = t.match(/<p className="bp-sub">([^<]+)<\/p>/)?.[1] ?? "";
  const steps = matches(t, /<li><b>([^<]+)<\/b> ([^<]+)<\/li>/g).slice(0, 3);
  return `<p class="bp-sub">${esc(sub)}</p><h2>What happens</h2><ol>${steps.map(([h, x]) => `<li><b>${esc(h)}</b> ${esc(x)}</li>`).join("")}</ol><p>Your source text goes into the download, not to an AI. Your AI makes the result in your own chat or workspace.</p><p><a href="/skills/long-source-to-workflow">Read the full method</a> · <a href="/compose">Build a workflow from a goal</a> · <a href="/how-it-works#use-in-ai">Get help using the files</a></p>`;
}
function communityBody() {
  return `<p class="bp-sub">${esc(SEO_PAGES["/community"][1])}</p><h2>How submissions work</h2><ol><li>Someone shares a reusable method they own, with its complete files.</li><li>Our team reviews it and tests how it behaves before it is published.</li><li>You read every file first, then add the skill or workflow to your own AI.</li></ol><p><a href="/jobs">Browse the library by job</a> · <a href="/how-it-works">How it works</a></p>`;
}

// Free tools: each page says what you enter, what comes back and what to do next, and links six tools on the same
// shelf (a different six per page), not all 100.
const TOOL_AREA = { design: "design", hr: "hiring", finance: "money", personal: "personal effectiveness", operations: "operations", compliance: "compliance", work: "work" };
const TOOL_TAIL = ["Free, runs in your browser, no sign-up.", "Free, in your browser, no sign-up.", "Free, in your browser."];
const ALL_TOOLS = [...BROWSER_TOOLS, ...TOOLS];
const toolTitle = (name) => pageTitle(name, ["free online tool, no sign-up", "free online tool", "free online calculator", "free tool", "online tool", "online", "free"]);
function relatedTools(t) {
  const same = ALL_TOOLS.filter((x) => x.category === t.category), at = same.indexOf(t);
  const pick = Array.from({ length: Math.min(6, same.length - 1) }, (_, i) => same[(at + 1 + i) % same.length]);
  const area = TOOL_AREA[t.category] ?? "everyday";
  return pick.length ? `<h2>More free ${area} tools</h2>${list(pick.map((x) => `<a href="/tools/${x.slug}">${esc(x.name ?? x.short)}</a>: ${esc(x.summary)}`))}<p><a href="/tools">All free tools</a> · <a href="/ai-tools">AI tool guides</a></p>` : `<p><a href="/tools">All free tools</a></p>`;
}
function miniToolBody(t) {
  const skills = (t.next ?? []).map((n) => (bySlug[n.slug] && hasPage(bySlug[n.slug]) ? `${link(bySlug[n.slug])}: ${esc(n.why)}` : "")).filter(Boolean);
  return [
    `<p class="bp-sub">${esc(t.summary)}</p>`,
    t.question ? `<h2>The question it answers</h2><p>${esc(t.question)}</p>` : "",
    (t.inputs ?? []).length ? `<h2>What you enter</h2>${list(t.inputs.map((i) => `<b>${esc(i.label)}</b>${i.help ? `: ${esc(i.help)}` : ""}${i.where ? ` Find it in: ${esc(i.where)}` : ""}`))}` : "",
    (t.outputs ?? []).length ? `<h2>What you get back</h2>${list(t.outputs.map((o) => `<b>${esc(o.label)}</b>${o.means ? `: ${esc(o.means)}` : ""}`))}` : "",
    `<p>Free, works in your browser, no account. Each answer comes with the formula, a spreadsheet and the AI code.</p>`,
    (t.notes ?? []).length ? `<h2>Good to know</h2>${list(t.notes.map(esc))}` : "",
    skills.length ? `<h2>What to do next</h2>${list(skills)}` : "",
    relatedTools(t),
  ].join("");
}

// The skill file's own headings go under the h3 "Full instruction file": its h1 becomes h4, and a heading is never more
// than one level below the one before it, whatever the file did (an h2 straight to an h5 is a skipped level).
function underH3(html) {
  let prev = 3; const open = [];
  return html.replace(/<(\/?)h([1-6])\b/g, (_, slash, level) => {
    if (slash) return `</h${open.pop() ?? level}`;
    const n = Math.min(6, 3 + Number(level), prev + 1);
    prev = n; open.push(n);
    return `<h${n}`;
  });
}
// A list page's ItemList: every address it links to, in order.
const itemList = (entries) => ({ "@type": "ItemList", numberOfItems: entries.length, itemListElement: entries.map(([name, u], i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${u}`, name })) });

function pageFor(url) {
  const outcome = outcomePage(url, { itemHref: (s) => (bySlug[s] && hasPage(bySlug[s]) ? hrefOf(bySlug[s]) : null), roleHref: (id) => (roleIndex.roles.some((r) => r.id === id) ? `/roles/${id}` : null) });
  if (outcome) return outcome;
  if (url.startsWith("/minds/page/")) { const page = mindDirectory(url, directoryMinds); return page ? {...page, plain: true, hub: true, collection: true, crumbs: [["Minds", "/minds"]]} : null; }
  if(url==="/teams")return {title:"Plan your AI team",documentTitle:"Plan an AI specialist team with checked handoffs | AI Blocks",h1:"Plan your AI team",desc:"Plan a team of AI specialists around your task. Review context, methods, handoffs and checks, then save, download and share the workflow with your AI.",content:`<h1>Plan your AI team</h1><p>A coordinator checks the context, offers routes and chooses the smallest useful specialist team. Review the exact plan before production.</p><h2>Start with the right context</h2><p>Reuse your brand brain, brief, assets and project files, or build missing context from verified sources. Load only the relevant current facts and preferences.</p><h2>Review the team and handoffs</h2><p>Choose roles, method revisions, real inputs and outputs, dependencies, tools, permissions and acceptance checks. Edits need fresh review.</p><h2>Save, reuse and share</h2><p>Sign in to save versioned personal or company workflows. Retrieve accepted edits, export complete source files and review a sanitized template before creating a revocable link. Private memory and run data are excluded from sharing.</p><h2>Execute with your connected AI</h2><p>Your AI carries out authorized work with its real tools, checks handoff artifacts and records actual results. A prepared plan does not run a worker, connect an account or activate a schedule.</p><p><a href="/roles">Browse all specialists</a> · <a href="/api-and-mcp">Connect through API and MCP</a></p>`,main:{"@type":"CreativeWork",name:"AI specialist team planner",description:"Review and prepare a contextual team plan for your AI",isAccessibleForFree:true}};
  if (url === "/roles" || url.startsWith("/roles/")) return rolePage(url, roleIndex, id => JSON.parse(fs.readFileSync(`public/data/roles/${id}.json`, "utf8")));
  if (url === "/api-and-mcp") return {
    title: "Connect your AI", h1: "Connect your AI once, then pull any skill or workflow it needs.", documentTitle: SEO_PAGES[url][0],
    desc: SEO_PAGES[url][1],
    content: fs.readFileSync("src/content/api-mcp.html", "utf8"),
    stylesheet: fs.readdirSync(path.join(DIST, "assets")).find(file => /^ApiMcpPage-.*\.css$/.test(file)),
  };
  if (url === "/me-md") return {
    title: "Your me.md", h1: "Write one file that tells every AI who you are.", documentTitle: SEO_PAGES[url][0],
    desc: SEO_PAGES[url][1], modified: "2026-10-27", mainClass: "me-md-docs",
    content: fs.readFileSync("src/content/me-md.html", "utf8"),
    stylesheet: fs.readdirSync(path.join(DIST, "assets")).find(file => /^MeMdPage-.*\.css$/.test(file)),
  };
  // The training guide: an Article by the site's operator, with the starter pack as its download.
  if (url === "/train-your-own-ai-agent") return {
    title: "Train your own AI agent", h1: "How to train your own AI agent, step by step", documentTitle: SEO_PAGES[url][0],
    desc: SEO_PAGES[url][1], modified: "2026-11-03", mainClass: "agent-guide",
    content: fs.readFileSync("src/content/train-agent.html", "utf8"),
    stylesheet: fs.readdirSync(path.join(DIST, "assets")).find(file => /^TrainAgentPage-.*.css$/.test(file)),
    main: { "@type": "Article", "@id": `${SITE}${url}#article`, headline: "How to train your own AI agent, step by step", description: SEO_PAGES[url][1], inLanguage: "en",
      author: { "@type": "Person", name: OPERATOR }, publisher: { "@id": `${SITE}/#org` }, datePublished: "2026-11-03", dateModified: "2026-11-03",
      image: `${SITE}/og/default.png`, isAccessibleForFree: true,
      about: ["AI agents", "Training an AI agent", "ChatGPT projects", "Claude projects", "Gemini Gems"],
      associatedMedia: { "@type": "MediaObject", name: "AI agent starter pack", contentUrl: `${SITE}/templates/ai-agent-starter-pack.zip`, encodingFormat: "application/zip" } },
  };
  const info = infoPage(url);
  if (info) return {
    title: info.title, h1: info.title, documentTitle: SEO_PAGES[url]?.[0], desc: SEO_PAGES[url]?.[1] ?? info.description, modified: isoDate(POLICY_DATE),
    body: `<p class="bp-sub">${esc(info.description)}</p><p class="small">Effective and last updated ${POLICY_DATE}</p><nav aria-label="On this page">${list(info.sections.map(section => `<a href="#${section.id}">${esc(section.title)}</a>`))}</nav>${info.sections.map(section => `<section id="${section.id}"><h2>${esc(section.title)}</h2>${section.paragraphs.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}${list((section.items ?? []).map(esc))}${list((section.links ?? []).map(link => `<a href="${esc(link.href)}">${esc(link.label)}</a>`))}</section>`).join("")}`,
  };
  if (url === "/tools/growth-channel-planner") return {
    title: "Growth channel planner", h1: "Plan growth for any business", collection: true, documentTitle: SEO_PAGES[url][0],
    desc: SEO_PAGES[url][1],
    body: `<p class="bp-sub">19 standalone growth skills, SaaS and general-business workflows, and research and review agents. The site prepares your pack; your AI reads the product and writes the advice.</p><h2>Explore, test, then focus</h2><p>Read your business, compare every channel, prepare up to three affordable pilots, then choose a focus from observed customer quality and economics.</p>${list(tractionChannels.map((c) => `<a href="/skills/${tractionSlug(c.id)}">${esc(c.channel)}</a>: ${esc(c.decision)}`))}<p><a href="/workflows/find-your-saas-growth-channel">SaaS workflow</a> · <a href="/workflows/find-your-business-growth-channel">General-business workflow</a> · <a href="/agents/traction-research-agent">Research agent</a> · <a href="/agents/traction-experiment-keeper">Review agent</a></p>`,
  };
  if (url === "/ai-tools") return {
    title: "AI tools for your work", h1: "Find the right AI product for the job", collection: true, documentTitle: "AI tools by job: pricing, uses and best fit | AI Blocks",
    desc: `${aiTools.tools.length} AI products with what they do, who they suit, pricing notes, sources and related skills. Find the right product for the work you need done.`,
    body: `<p class="bp-sub">AI products by job, with pricing notes and sources.</p>${list(aiTools.tools.map((t) => `<a href="/ai-tools/${esc(t.slug)}">${esc(t.name)}</a>: ${esc(t.promise)}`))}`,
    main: itemList(aiTools.tools.map((t) => [t.name, `/ai-tools/${t.slug}`])),
  };
  // Optional AI tool fields: first result, needs, example and what is not yet confirmed.
  const toolExtras = (t) => [
    t.firstResult?.length ? `<h2>Your first result</h2>${t.firstResult.map((g) => `${g.name ? `<h3>${esc(g.name)}</h3>` : ""}<ol>${g.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`).join("")}` : "",
    t.needs?.length ? `<h2>What you need</h2>${list(t.needs.map(esc))}` : "",
    t.example ? `<h2>Example</h2>${t.example.task ? `<p><b>The task:</b> ${esc(t.example.task)}</p>` : ""}${t.example.cost ? `<p><b>What it costs:</b> ${esc(t.example.cost)}</p>` : ""}${t.example.reply ? `<p><b>What you get back:</b> ${esc(t.example.reply)}</p>` : ""}` : "",
    t.notVerified?.length ? `<aside><h2>Not yet confirmed</h2><p class="small">We could not confirm these on the maker's pages.</p>${list(t.notVerified.map(esc))}</aside>` : "",
  ].join("");
  if (url.startsWith("/ai-tools/")) {
    const t = aiTools.tools.find((t) => `/ai-tools/${t.slug}` === url);
    if (!t) return null;
    const toolDesc = describe({ summary: t.promise, more: [t.bestFor?.[0] ? `Best for: ${t.bestFor[0]}` : "", t.pricing?.from ? `Pricing from ${t.pricing.from}.` : "", t.does?.[0] ?? ""].filter(Boolean), tail: [`Pricing and uses for ${t.name}.`] });
    return { title: `${t.name} for your work`, h1: t.name, documentTitle: pageTitle(t.name, ["what it does, pricing and best uses", "pricing, uses and best fit", "pricing and uses"]), desc: toolDesc.text, modified: t.lastChecked,
      about: { "@type": "SoftwareApplication", name: t.name, url: t.url, ...(t.maker ? { author: { "@type": "Organization", name: t.maker } } : {}) }, crumbs: [["AI tools", "/ai-tools"]],
      body: `<p class="bp-sub">${esc(t.promise)}</p><h2>What it does</h2>${list(t.does.map(esc))}<h2>Best for</h2>${list(t.bestFor.map(esc))}<h2>Pricing</h2><p>${esc(t.pricing.from)}. ${esc(t.pricing.note)}</p>${toolExtras(t)}<h2>Related skills</h2>${list(t.blocks.map((b) => `<a href="${esc(b.path)}">${esc(b.name)}</a>`))}<p><a href="${esc(t.url)}">Open ${esc(t.name)}</a></p>`,
    };
  }
  if (STATIC[url]) {
    const [t, d] = STATIC[url];
    let extra = "";
    // The mind directory links every profile through bounded pages; tools retain their complete list.
    if (url === "/minds") extra = mindDirectory(url, directoryMinds)?.body ?? "";
    if (url === "/tools") extra = `<p><a href="/ai-tools">Read the AI tool guides</a>: find the right AI product for the job.</p>` + list([`<a href="/tools/growth-channel-planner">Growth channel planner</a>: Prepare a business brief and compare 19 growth channels.`, ...[...BROWSER_TOOLS, ...TOOLS].map((x) => `<a href="/tools/${x.slug}">${esc(x.name)}</a>: ${esc(x.summary)}`)]);
    const [documentTitle, seoDesc] = SEO_PAGES[url] ?? [];
    if (url === "/how-it-works") extra = howItWorksBody();
    // The heading the app shows (src/HowItWorks.tsx), so the page does not change heading when the app opens.
    const appH1 = url === "/how-it-works" ? grab("src/HowItWorks.tsx").match(/className="bp-h1">([^<]+)</)?.[1] : null;
    if (url === "/apps") extra = appsBody();
    if (url === "/compose") extra = composeBody();
    if (url === "/from-a-source") extra = sourceBody();
    if (url === "/community") extra = communityBody();
    const lede = ["/how-it-works", "/apps", "/compose", "/from-a-source", "/community"].includes(url) ? "" : `<p class="bp-sub">${esc(seoDesc ?? d)}</p>`;
    const main = url === "/minds" ? mindDirectory(url, directoryMinds)?.main : url === "/tools" ? itemList([["Growth channel planner", "/tools/growth-channel-planner"], ...ALL_TOOLS.map((x) => [x.name ?? x.short, `/tools/${x.slug}`])]) : undefined;
    return { title: t, documentTitle, desc: seoDesc ?? d, h1: appH1 ?? t, crumbs: [], collection: !!main, main, body: `${lede}${extra}`, ld: { "@type": "WebPage" } };
  }
  const [, kind, slug] = url.split("/");
  if (kind === "tools") {
    const browserTool = BROWSER_TOOLS.find(x => x.slug === slug);
    if (browserTool) return {
      title: browserTool.short, h1: browserTool.short, documentTitle: toolTitle(browserTool.short), desc: describe({ summary: browserTool.summary, more: ["Copy or download the result. Your input stays on your device."], tail: TOOL_TAIL }).text, crumbs: [["Tools", "/tools"]],
      body: `<p class="bp-sub">${esc(browserTool.summary)}</p><p>Use this free tool in your browser. Copy or download the result. Your input stays on your device.</p>${relatedTools(browserTool)}`,
      main: { "@type": "WebApplication", name: browserTool.short, description: browserTool.summary, url: `${SITE}${url}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", isAccessibleForFree: true, offers: { "@type": "Offer", price: 0, priceCurrency: "USD" } },
    };
    const t = TOOLS.find((x) => x.slug === slug);
    if (!t) return null;
    return {
      title: t.name, documentTitle: toolTitle(t.name), desc: describe({ summary: t.summary, subhead: t.question, more: (t.inputs ?? []).length ? [`You enter ${t.inputs.slice(0, 4).map((i) => lowerFirst(i.label)).join(", ")}.`] : [], tail: TOOL_TAIL }).text, h1: t.name, crumbs: [["Mini tools", "/tools"]], modified: t.updated,
      body: miniToolBody(t),
      main: { "@type": "WebApplication", name: t.name, description: t.summary, url: `${SITE}${url}`, applicationCategory: "BusinessApplication", operatingSystem: "Any", isAccessibleForFree: true, offers: { "@type": "Offer", price: 0, priceCurrency: "USD" } },
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
    const mindFit = fitAndExample(page);
    return {
      title: b.name, modified: page.added, documentTitle: mindTitle({ name: b.name, identity: b.identity, area: AREAS[b.area] ?? b.area ?? "" }), h1: b.name, crumbs: [["Minds", "/minds"]],
      desc: describe({ summary: b.summary, more: [`An AI built from public sources about ${b.name}.`], tail: ["Free to use in Claude, ChatGPT or Gemini.", "Free to use in your AI.", "Free AI mind."] }).text,
      body: [
        `<p class="bp-identity">${esc(b.identity || "")}</p>`, `<p class="small">${esc(disclose)}${page.added ? ` Updated ${niceDate(page.added)}.` : ""}</p>`,
        // The subhead goes where the app puts it (p.bp-sub), so the page reads the same before and after the app opens.
        ...(text(page.subhead) ? [`<p class="bp-sub">${esc(text(page.subhead))}</p>`, `<p>${esc(b.summary)}</p>`] : [`<p class="bp-sub">${esc(b.summary)}</p>`]),
        (page.hire?.jobs ?? []).length || mindFit.fitHtml || mindFit.sampleHtml ? `<section id="get"><h2>What you get</h2>${(page.hire?.jobs ?? []).length && !mindFit.hasSample ? `<p>What you can hire ${esc(b.name)} for.</p>${list(page.hire.jobs.slice(0, 5).map((j) => esc(j.title)))}` : ""}${mindFit.sampleHtml}${mindFit.fitHtml}</section>` : "",
        `<section id="task-start"><h2>Run it</h2><p>Add ${esc(b.name)} to Claude, ChatGPT or Gemini once, then ask for it by name in any chat. Copy and download buttons are on the page.</p></section>`,
        factCheckHtml(page.fact_checks, esc),
      `<details id="details"><summary><h2>Details</h2></summary>${[
          ideas.length ? `<h3>Big ideas</h3>${list(ideas.map((i) => `<b>${esc(i.title)}</b>: ${esc(words(text(i.text), 40))}`))}` : "",
          (page.hire?.jobs ?? []).length ? `<h3>Hire ${esc(b.name)} for</h3>${list(page.hire.jobs.slice(0, 8).map((j) => `<b>${esc(j.title)}</b>: ${esc(words(text(j.text), 30))}`))}` : "",
          skills.length ? `<h3>Skills from their work</h3>${list(skills.map(link))}` : "",
          pairs.length ? `<h3>Pairs well with</h3>${list(pairs.map(link))}` : "",
          credits.length ? `<h3>Built from</h3>${list(credits.slice(0, 25).map((c) => (c.url ? `<a href="${esc(c.url)}" rel="noopener">${esc(c.title)}</a>` : esc(c.title)) + (c.by ? `, ${esc(c.by)}` : "")))}` : "",
        ].join("")}</details>`,
      ].join(""),
      main: { "@type": "CreativeWork", name: `${b.name} mind (AI persona)`, description: disclose, creator: { "@id": `${SITE}/#org` }, isAccessibleForFree: true, inLanguage: "en",
        isBasedOn: credits.filter((c) => c.url).slice(0, 10).map((c) => c.url), mentions: { "@type": "Person", name: b.name, ...(wiki ? { sameAs: wiki } : {}) },
        encoding: { "@type": "MediaObject", contentUrl: `${SITE}/skills/${slug}/SKILL.md`, encodingFormat: "text/markdown" } },
      markdown: `/skills/${slug}/SKILL.md`,
    };
  }

  // Skills, prompts and workflows: a unique section built from the page's own facts, not only the template.
  const isFlow = kindPath(b) === "workflows";
  const isCoordinator = isFlow && b.execution === "coordinator" && !(b.steps ?? []).length;
  const coordinatorFiles = (page.files ?? []).includes("workflow-state.json") ? "SKILL.md and workflow-state.json" : "SKILL.md and the included supporting files";
  const noun = b.type === "agent" ? "AI agent" : isFlow ? "AI workflow" : b.type === "prompt" ? "AI prompt" : "AI skill";
  const give = (Array.isArray(page.you_give) && page.you_give.length ? page.you_give : (page.plan?.needed ?? []).map((n) => n.what ? `${n.label}: ${n.what}` : n.label)).concat((page.plan?.helps ?? []).map((n) => `${n.label} (optional)`)).slice(0, 8);
  const get = Array.isArray(page.you_get) && page.you_get.length ? page.you_get : (b.outputs ?? []).map((o) => portName(o).replace(/^./, (c) => c.toUpperCase()));
  const steps = isFlow ? (b.steps ?? []).map((x) => bySlug[Array.isArray(x) ? x[0] : x]).filter(Boolean) : [];
  const facts = ["Free", "No account", ...(src.licence ? [`${src.licence.replace(/-/g, " ")} licence`] : []), `Made by ${by ?? "AI Blocks"}`, ...(b.level ? [`Level: ${b.level}`] : []), ...(b.thinking ? [`Thinking: ${b.thinking}`] : []), ...(page.tested?.result === "pass" ? ["Safety checked"] : []), ...(page.added ? [`Updated ${niceDate(page.added)}`] : [])];
  // Links out: four others in the same job (picked by the page's name, so each page links to a different four),
  // the workflows that use it, its twin, and the job's hub.
  const peers = (byTask[b.task] ?? []).filter((x) => x !== b);
  const start = peers.length ? hash(slug) % peers.length : 0;
  const pick = [0, 1, 2, 3].map((i) => peers[(start + i * Math.max(1, Math.floor(peers.length / 4))) % peers.length]).filter((x, i, a) => x && a.indexOf(x) === i);
  const flows = [...(usedBy[slug] ?? [])].map((s) => bySlug[s]).filter((x) => x && hasPage(x)).slice(0, 6);
  const twin = b.twin && bySlug[b.twin] && hasPage(bySlug[b.twin]) ? bySlug[b.twin] : null;
  const explain = text(page.html?.explain);
  const when = Array.isArray(page.when) ? page.when : page.when ? [page.when] : [];
  const { fitHtml, sampleHtml, hasSample } = fitAndExample(page, slug);
  // The page's own subhead leads; the shared sentence is only for a page that has none.
  const kindLine = isCoordinator ? `It follows ${coordinatorFiles}, preserving the required inputs, evidence and checkpoints.` : isFlow ? "It guides your AI through several skills in order, passing each step's output to the next." : "Give the instructions to an AI assistant that supports the required files and tools, then review its output.";
  const subhead = text(page.subhead);
  const lead = subhead ? `${subhead}${isCoordinator ? ` ${kindLine}` : ""}` : `${b.name} is a free ${noun}${job ? ` for the job "${job}"` : ""}. ${kindLine}`;
  const kindKey = b.type === "agent" ? "agent" : isFlow ? "workflow" : b.type === "prompt" ? "prompt" : "skill";
  const seo = itemSeo({ block: b, page, job, kind: kindKey, steps: steps.map((x) => x.name) });
  const usage = catalogueUsageHowTo({ name: b.name, pageUrl: SITE + url, steps: page.how_to_use });
  const neighbours = skillNeighbours(b.slug, page.plan, bySlug);
  const neighbourList = (rows) => list(rows.map(row => `<a href="${esc(row.url.replace(/^https:\/\/useaiblocks\.com/, ""))}">${esc(row.name)}</a><p class="small">${esc(row.note)}</p>`));
  const neighbourView = !isFlow && page.plan ? `<section id="next" class="bp-next skill-neighbours"><h2>Before and after this skill</h2><p>Choose the steps you need. Bring your own material when you have it.</p><div class="skill-neighbours-grid"><div class="skill-neighbours-card"><h3>Before</h3>${neighbours.before.length ? neighbourList(neighbours.before) : "<p>Bring the material listed under Fill it in.</p>"}</div><span aria-hidden="true">→</span><div class="skill-neighbours-card"><h3>This skill</h3><p><b>${esc(b.name)}</b></p><a href="/#build">Open builder</a></div><span aria-hidden="true">→</span><div class="skill-neighbours-card"><h3>After</h3>${neighbours.after.length ? neighbourList(neighbours.after) : "<p>Use the result on its own, or choose another skill in the builder.</p>"}</div></div></section>` : "";
  const rowText = value => typeof value === "string" ? value : Object.entries(value ?? {}).map(([, part]) => typeof part === "string" ? part : "").filter(Boolean).join(". ");
  const requiresFiles = !!b.hasFiles || b.type === "agent";
  const nextSteps = page.plan?.next ?? [];
  const reference = [
    ["what", "How the task works", list((page.how_it_works ?? []).map(value => esc(rowText(value))))],
    ["use", "Full instructions", list((page.how_to_use ?? []).map(esc))],
    ["test", "Check your result", list((page.judge ?? []).map(esc))],
    ["most", "Change the instructions", list((page.tweaks ?? []).map(value => esc(rowText(value))))],
    ["improve", "Improve the result", list((page.improve ?? []).map(value => esc(rowText(value))))],
    ["terms", "Words used in this task", Array.isArray(page.terms) ? list(page.terms.map(x => esc(typeof x === "string" ? x : `${x.term ?? ""}: ${x.meaning ?? x.definition ?? ""}`))) : ""],
    ["file", "Full instruction file", underH3(normalizeSkillHtml(page.html?.skill ?? "", slug, page.files ?? []))],
  ].filter(([, , html]) => html);
  return {
    title: b.name, documentTitle: seo.title, modified: page.added,
    desc: seo.description.text, h1: b.headline || b.name,
    crumbs: job ? [[job, jobHref(b.task)]] : [],
    body: [
      // The subhead goes where the app puts it (p.bp-sub), so the page reads the same before and after the app opens.
      ...(subhead ? [`<p class="bp-sub">${esc(subhead)}</p>`, `<p>${esc(b.summary)}${isCoordinator ? ` ${esc(kindLine)}` : ""}</p>`] : [`<p class="bp-sub">${esc(b.summary)}</p>`, `<p>${esc(lead)}</p>`]), `<p class="small">${facts.map(esc).join(" · ")}</p>`, ...(Array.isArray(page.boards) && page.boards.length ? [`<p class="small">For: ${page.boards.filter((x) => BOARD_NAMES[x]).map((x) => `<a href="${boardHref(x)}">${esc(BOARD_NAMES[x])}</a>`).join(", ")}</p>`] : []),
      // Three parts first (what you get, fill it in, run it), then what to do next, then everything else under one Details.
      page.output_shape || get.length || fitHtml || sampleHtml ? `<section id="get"><h2>What you get</h2>${sampleHtml}${page.output_shape ? (hasSample ? `<details><summary>See the full layout</summary><p class="small">Every run hands it back in this order. Your details fill each gap.</p><pre>${esc(page.output_shape)}</pre></details>` : `<p class="small">Every run hands it back in this order. Your details fill each gap.</p><pre>${esc(page.output_shape)}</pre>`) : hasSample ? "" : list(get.map(esc))}${fitHtml}</section>` : "",
      give.length ? `<section id="task-start"><h2>Fill it in</h2><p>${isFlow ? "Gather these first. You add them in your AI after you download." : "Add what this task works from, then copy the request."}</p>${list(give.map(esc))}</section>` : "",
      `<section id="${give.length ? "run" : "task-start"}"><h2>Run it</h2><p>${isCoordinator ? `Download the complete workflow pack. Give it to your AI, then ask it to read ${coordinatorFiles} and follow the governing instructions and checkpoints.` : isFlow ? "Get the plan and all the skill files. Give the complete pack to your AI, then ask it to follow HANDOFF.md." : requiresFiles ? "Download the complete instructions and supporting files. Add them to Claude, ChatGPT or Gemini once, then ask for it by name in any chat. Pasting the instructions into a chat works too." : "Add your task details in the form when the page opens. Copy the complete request into your AI. Or add the skill to Claude, ChatGPT or Gemini once and ask for it by name. Your AI does the work."}</p>${!isFlow ? `<p><a href="/skills/${esc(slug)}${b.hasFiles ? ".zip" : "/SKILL.md"}" download>${b.hasFiles ? "Download all files" : "Download the instructions"}</a></p>` : ""}</section>`,
      neighbourView || (nextSteps.length ? `<section id="next"><h2>What to do next</h2>${list(nextSteps.map((x) => `<a href="${esc(String(x.url).replace(/^https:\/\/useaiblocks\.com/, ""))}">${esc(x.name)}</a>: ${esc(x.label)}`))}</section>` : ""),
      factCheckHtml(page.fact_checks, esc),
      specialistsSection(roleLinks.get(slug)),
      `<details id="details"><summary><h2>Details</h2></summary>${[
        by && src.url ? `<p class="small">From ${esc(by)}. <a href="${esc(src.url)}" rel="noopener">See the original on GitHub</a>; shared under its licence, with a plain name for this library.</p>` : "",
        explain ? `<section id="explain"><h3>What it does</h3><p>${esc(words(explain, 150))}</p></section>` : "",
        give.length || get.length ? `<section id="io"><h3>What goes in and out</h3>${give.length ? `<h4>You give it</h4>${list(give.map(esc))}` : ""}${get.length ? `<h4>You get</h4>${list(get.map(esc))}` : ""}</section>` : "",
        when.length > 3 ? `<h3>Use it when</h3>${list(when.slice(0, 5).map(esc))}` : "",
        steps.length ? `<h3>Steps</h3><ol>${steps.map((s) => `<li>${link(s)}: ${esc(s.summary)}</li>`).join("")}</ol>` : "",
        flows.length ? `<h3>Workflows that use it</h3>${list(flows.map(link))}` : "",
        twin ? `<h3>Same look, other format</h3>${list([link(twin)])}` : "",
        pick.length ? `<h3>More for ${esc(job || "the same job")}</h3>${list(pick.map(link))}${job ? `<p><a href="${jobHref(b.task)}">Every ${esc(job.toLowerCase())} skill</a></p>` : ""}` : "",
        ...reference.map(([id, title, html]) => `<section id="${id}"><h3>${title}</h3>${html}</section>`),
      ].join("")}</details>`,
    ].join(""),
    main: isFlow && steps.length
      ? { "@type": "HowTo", name: b.name, description: b.summary, step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.summary, url: `${SITE}${hrefOf(s)}` })) }
      : { "@type": "CreativeWork", name: b.name, description: b.summary, inLanguage: "en", isAccessibleForFree: true, keywords: job || undefined, publisher: { "@id": `${SITE}/#org` }, ...(usage ? { hasPart: usage } : {}),
          author: by ? { "@type": "Organization", name: by } : { "@id": `${SITE}/#org` }, ...(src.url ? { isBasedOn: src.url } : {}), ...(LICENCE_URL(src.licence) ? { license: LICENCE_URL(src.licence) } : {}),
          encoding: { "@type": "MediaObject", contentUrl: `${SITE}/skills/${slug}/SKILL.md`, encodingFormat: "text/markdown" } },
    markdown: isFlow ? null : `/skills/${slug}/SKILL.md`,
  };
}

// --- Crawl extras (docs/AI-HUB-PRD.md §9): twin links, feed links, richer structured data and job-hub dates. -------
// Kept apart from the page templates above: crawlPage() adds to what pageFor() made, crawlHead() adds head links, and
// jobsSitemap() writes sitemap-jobs.xml. None of it changes what a visitor sees.
const FEED_LINKS = [
  `<link rel="alternate" type="application/feed+json" href="/feed.json" title="AI Blocks: new and changed items (JSON Feed)" />`,
  `<link rel="alternate" type="application/rss+xml" href="/feed.xml" title="AI Blocks: new and changed items (RSS)" />`,
];
// The newest "Updated" day of each job's items, gathered as item pages render: a hub changes when one of its items does.
const jobDates = new Map();
function crawlHead(url, p) {
  return [...(url === "/" || url === "/jobs" ? FEED_LINKS : []), ...(p.json ? [`<link rel="alternate" type="application/json" href="${p.json}" title="JSON version" />`] : [])];
}
function crawlPage(url, p) {
  if (!p) return p;
  if (url.startsWith("/ai-tools/") && p.about?.["@type"] === "SoftwareApplication") return { ...p, about: aiToolLd(p.about, aiTools.tools.find((t) => `/ai-tools/${t.slug}` === url)) };
  const [, kind, slug] = url.split("/");
  const b = bySlug[slug];
  if (!b || kindPath(b) !== kind) return p;
  const page = readPage(slug);
  if (b.type !== "mind" && b.task && /^\d{4}-\d{2}-\d{2}$/.test(page.added ?? "")) jobDates.set(b.task, [jobDates.get(b.task) ?? "", page.added].sort().at(-1));
  // Pages built before the twins existed have no facts; they keep their SKILL.md link.
  if (!page.facts) return p;
  return { ...p, markdown: `${url}.md`, json: `${url}.json`, main: p.main ? itemLd(p.main, b, page, url) : p.main };
}
// CreativeWork for every item (HowTo for a workflow with steps), with what goes in and what comes out, its source credit
// and licence, and the same dates as its sitemap lastmod and its page.
function itemLd(main, b, page, url) {
  const full = `${SITE}${url}`, src = page.source ?? {}, facts = page.facts;
  const port = (x) => `${x.label ?? x.type}${x.what ? `: ${x.what}` : ""}${x.required === false ? " (optional)" : ""}`;
  const credits = (page.credits ?? []).filter((c) => c?.title);
  const out = { ...main, "@id": `${full}#item`, url: full,
    ...(page.published ? { datePublished: page.published } : {}), ...(page.added ? { dateModified: page.added } : {}),
    encoding: [...[main.encoding].flat().filter(Boolean),
      { "@type": "MediaObject", contentUrl: `${full}.md`, encodingFormat: "text/markdown", name: "Markdown version" },
      { "@type": "MediaObject", contentUrl: `${full}.json`, encodingFormat: "application/json", name: "JSON version" }] };
  if (b.type === "mind") return out;
  const basedOn = [...new Set([src.url, ...credits.map((c) => c.url)].filter((u) => /^https?:\/\//.test(u ?? "")))].slice(0, 10);
  if (basedOn.length) out.isBasedOn = basedOn.length === 1 ? basedOn[0] : basedOn;
  const credit = src.by ? `From ${src.by}${src.repo ? ` (${src.repo})` : ""}${src.licence ? `, ${src.licence} licence` : ""}. Adapted by AI Blocks.`
    : credits.length ? `By AI Blocks, built from ${credits.slice(0, 5).map((c) => `${c.title}${c.by ? ` by ${c.by}` : ""}`).join("; ")}.` : "";
  if (credit) out.creditText = credit;
  const inputs = facts.inputs ?? [], outputs = facts.outputs ?? [];
  if (main["@type"] === "HowTo") {
    // A workflow with steps: its inputs and results as HowTo supply and yield.
    if (inputs.length) out.supply = inputs.map((x) => ({ "@type": "HowToSupply", name: x.label ?? x.type, description: port(x) }));
    if (outputs.length) out.yield = outputs.map(port);
  } else if (inputs.length || outputs.length) {
    // A skill, prompt or agent stays a CreativeWork (check-seo.mjs): running it is an Action that works on your inputs
    // (object) and gives the results (result).
    out.potentialAction = { "@type": "Action", name: `Run ${b.name} in your AI`,
      ...(inputs.length ? { object: inputs.map((x) => ({ "@type": "Thing", name: x.label ?? x.type, description: port(x) })) } : {}),
      ...(outputs.length ? { result: outputs.map((x) => ({ "@type": "CreativeWork", name: x.label ?? x.type, description: port(x) })) } : {}) };
  }
  return out;
}
// AI tool guides: the product as a SoftwareApplication, with only what the guide states.
function aiToolLd(about, t) {
  if (!t) return about;
  return { ...about, description: t.promise, ...(t.categories?.length ? { applicationCategory: t.categories.join(", ") } : {}),
    ...(t.runsIn?.length ? { operatingSystem: t.runsIn.join(", ") } : {}), ...(["free", "freemium"].includes(t.pricing?.model) ? { isAccessibleForFree: true } : {}) };
}
// The job hubs' sitemap, each hub with the newest date of its items (the same rule as build-index's jobHubDates).
function jobsSitemap(hubUrls) {
  const all = [...jobDates.values()].sort().at(-1) ?? "";
  const dateOf = (u) => (u === "/jobs" ? all : jobDates.get(u.split("/")[2]) ?? "");
  fs.writeFileSync(path.join(DIST, "sitemap-jobs.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${hubUrls.map((u) => `  <url><loc>${SITE}${u}</loc>${dateOf(u) ? `<lastmod>${dateOf(u)}</lastmod>` : ""}</url>`).join("\n")}\n</urlset>\n`);
}

// One page's HTML: the shell with this page's head tags, structured data and first screen.
function render(url, p, { plain = p.plain ?? false, noindex = false } = {}) {
  const full = `${SITE}${url === "/" ? "/" : url}`;
  const canonical = p.canonical ? `${SITE}${p.canonical}` : full;
  const suffixed = `${p.title} | ${BRAND}`;
  const title = SEO_TITLES[url] || p.documentTitle || (suffixed.length <= 60 ? suffixed : p.title);
  const desc = trimDescription(p.desc);
  const crumbs = [["AI Blocks", "/"], ...(p.crumbs ?? []), [p.h1, url]];
  const ldCrumbs = url === "/" ? crumbs.slice(0, 1) : crumbs;
  const graph = [ORG, WEBSITE,
    { "@type": p.collection ? "CollectionPage" : "WebPage", "@id": `${full}#page`, url: full, name: p.title, description: desc, inLanguage: "en", isPartOf: { "@id": `${SITE}/#site` },
      primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}/og/default.png`, width: 1200, height: 630 }, ...(p.modified ? { dateModified: p.modified } : {}),
      breadcrumb: { "@id": `${full}#crumbs` }, ...(p.main ? { mainEntity: p.modified && ["CreativeWork", "HowTo"].includes(p.main["@type"]) ? { ...p.main, dateModified: p.modified } : p.main } : {}), ...(p.about ? { about: p.about } : {}) },
    { "@type": "BreadcrumbList", "@id": `${full}#crumbs`, itemListElement: ldCrumbs.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${SITE}${u}` })) },
  ];
  // The home page shell already has its own h1, so its crawlable copy uses an h2 to keep one h1 per page.
  // The trail above the heading, left out when it would only repeat "AI Blocks" under the header.
  const trail = crumbs.length > 2 ? `<p class="small hub-trail">${crumbs.slice(0, -1).map(([n, u]) => `<a href="${u}">${esc(n)}</a>`).join(" › ")}</p>` : "";
  const body = p.content
    ? `<main class="wrap ${p.mainClass ?? "api-mcp-docs"}" data-prerendered>${header}${p.content}${footer}</main>`
    : p.hub
    ? `${staticHeader(url, logo)}<main id="main-content" class="wrap bp-hero hub" data-prerendered>${trail}<h1 class="bp-h1">${esc(p.h1)}</h1>${p.body}</main>${staticFooter()}<script defer src="/site-menu.js"></script>`
    : `<main class="wrap bp-hero" data-prerendered${/^\/(skills|prompts|workflows|agents|minds)\/[^/]+$/.test(url) ? " data-static-first" : ""}>${header}${trail}${url === "/" ? `<h2 class="bp-h1">${esc(p.h1)}</h2>` : `<h1 class="bp-h1">${esc(p.h1)}</h1>`}${p.body}${footer}</main>`;
  // The loading cover shows this page's header and heading at once, styled (scripts/lib/page-shell.mjs). Home has its own.
  const picture = plain || url === "/" ? "" : pageShell({ logo, h1: esc(p.h1), body, content: p.content ?? "", mainClass: p.mainClass ?? "api-mcp-docs" });
  const metadata = { title, description: desc, canonical, robots: noindex ? (noindex === "follow" ? "noindex, follow" : "noindex, nofollow") : "max-image-preview:large, max-snippet:-1", graph: noindex ? null : { "@context": "https://schema.org", "@graph": graph }, markdown: p.markdown || null, ...(p.json ? { json: p.json } : {}), image: `${SITE}/og/default.png` };
  const metadataFile = path.join(DIST, "metadata", `${url === "/" ? "index" : url.slice(1)}.json`);
  fs.mkdirSync(path.dirname(metadataFile), { recursive: true });
  fs.writeFileSync(metadataFile, JSON.stringify(metadata));
  const openingBlock = /^\/(skills|prompts|workflows|agents|minds)\/[^/]+$/.test(url) ? bySlug[url.split("/")[2]] : null;
  const openingPage = openingBlock ? readPage(openingBlock.slug) : null;
  const opening = openingBlock && hrefOf(openingBlock) === url ? {schema: 1, path: url, slug: openingBlock.slug, block: openingBlock, page: Object.fromEntries(["headline", "subhead", "added"].filter(key => typeof openingPage[key] === "string").map(key => [key, openingPage[key]]))} : null;
  const head = [
    opening ? `<script type="application/json" id="abb-item-opening">${JSON.stringify(opening).replace(/</g, "\\u003c")}</script>` : "",
    p.stylesheet ? `<link rel="stylesheet" href="/assets/${p.stylesheet}" />` : "",
    noindex ? "" : `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`,
    p.markdown ? `<link rel="alternate" type="text/markdown" href="${p.markdown}" title="${p.json ? "Markdown version" : "The skill file"}" />` : "",
    ...crawlHead(url, p),
    `<meta name="robots" content="${metadata.robots}" />`,
  ].filter(Boolean).join("\n    ");
  return injectPrerender((plain ? plainShell : shell)
    .replace(/<div id="app-loader"[^>]*>/, (open) => open + picture)
    .replace(/<meta name="robots"[^>]*>\s*/g, "")
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, (_, prefix) => prefix + esc(desc))
    .replace(/(<link rel="canonical" href=")[^"]*/, (_, prefix) => prefix + canonical)
    .replace(/(<meta property="og:url" content=")[^"]*/, (_, prefix) => prefix + canonical)
    .replace(/(<meta property="og:title" content=")[^"]*/, (_, prefix) => prefix + esc(title))
    .replace(/(<meta property="og:description" content=")[^"]*/, (_, prefix) => prefix + esc(desc))
    .replace(/(<meta name="twitter:title" content=")[^"]*/, (_, prefix) => prefix + esc(title))
    .replace(/(<meta name="twitter:description" content=")[^"]*/, (_, prefix) => prefix + esc(desc))
    , head, body);
}
const write = (url, html) => { const out = path.join(DIST, `${url.slice(1)}.html`); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html); };

const urls = [...fs.readdirSync("public").filter((f) => /^sitemap-.*.xml$/.test(f)).map((f) => fs.readFileSync(`public/${f}`, "utf8")).join("").matchAll(/<loc>https:\/\/useaiblocks\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
const mindPages = mindDirectoryUrls(directoryMinds).slice(1);
for (const url of mindPages) if (!urls.includes(url)) urls.push(url);
// Keep the extra directory pages in the existing minds sitemap.
const mindsSitemap = path.join(DIST, "sitemap-minds.xml");
const mindsXml = fs.readFileSync(mindsSitemap, "utf8");
fs.writeFileSync(mindsSitemap, mindsXml.replace(/\s*<url><loc>https:\/\/useaiblocks\.com\/minds\/page\/[^<]+<\/loc>[\s\S]*?<\/url>/g, "").replace("</urlset>", mindPages.map(url => `  <url><loc>${SITE}${url}</loc></url>`).join("\n") + "\n</urlset>"));
if (!urls.includes("/api-and-mcp")) urls.push("/api-and-mcp");
if (!urls.includes("/me-md")) urls.push("/me-md");
if (!urls.includes("/train-your-own-ai-agent")) urls.push("/train-your-own-ai-agent");
// Imported pages without a Tested label still get a page and stay indexable.
const thinUrls = new Set(cat.blocks.filter((b) => hasPage(b) && isThin(b)).map(hrefOf));
for (const u of thinUrls) if (!urls.includes(u)) urls.push(u);
for (const u of sameJobAgents.keys()) if (!urls.includes(u)) urls.push(u);
let wrote = 0;
const titles = new Map(), problems = [];

// The home page: the main sections and every job, so a crawler reaches the whole library in two steps.
const tasks = Object.entries(byTask).sort((a, b) => b[1].length - a[1].length);
const homeTypes = [["", "All", "Explore the library"], ["skill", "Skills", "Run the same steps every time"], ["prompt", "Prompts", "Paste into a chat"], ["workflow", "Workflows", "Connect several steps"], ["agent", "Agents", "Delegate a repeatable job"], ["mind", "Minds", "Borrow an expert's thinking"]];
const homeMinds = cat.blocks.filter(b => b.type === "mind");
const homeFlows = cat.blocks.filter(b => kindPath(b) === "workflows" && hasPage(b));
const homeAgents = cat.blocks.filter(b => b.type === "agent" && hasPage(b) && !isThin(b)).sort((a, b) => (b.tested ? 1 : 0) - (a.tested ? 1 : 0));
fs.writeFileSync(path.join(DIST, "index.html"), render("/", {
  documentTitle: "Free AI Skills & Custom Workflow Builder | AI Blocks",
  title: "Free AI skills, workflows and minds", desc: "Explore free AI skills, prompts and workflows. Build a custom workflow, edit the steps and download a pack to run in your AI. Try free browser tools too.", h1: "Use AI like the top 1%",
  body: [
    `<p class="bp-sub">Turn hours of work into minutes. Spend the time you save on the work only you can do. Or at the beach (we won't tell).</p>`,
    `<p><a class="btn btn-line" href="/#build" data-testid="hero-build-workflow">Build a workflow →</a></p>`,
    `<section id="library"><h2>Explore the library</h2><nav aria-label="Task types">${list(homeTypes.map(([kind, name, description]) => `<a href="/${kind ? `?kind=${kind}` : ""}#library"><b>${name}</b></a>: ${description}`))}</nav>${list(cat.blocks.filter(b => hasPage(b) && b.type !== "mind").slice(0, 16).map(b => `${link(b)}: ${esc(b.summary)}`))}<p><a href="/jobs">Browse all tasks by job</a> · <a href="/how-it-works">How it works</a></p><p><a href="/me-md">Make your me.md once. Every task then fits you.</a></p></section>`,
    `<section id="home-minds"><h2>Minds</h2>${list(homeMinds.slice(0, 8).map(link))}<p><a href="/minds">Explore all ${homeMinds.length} minds</a></p></section>`,
    `<section id="home-workflows"><h2>Workflows and builder</h2><p><a href="/#build">Open the workflow builder</a> · <a href="/compose">Plan from a goal</a> · <a href="/apps">See an example</a></p>${list(homeFlows.slice(0, 6).map(link))}<p><a href="/?kind=workflow#library">Browse all workflows</a></p></section>`,
    `<section id="home-agents"><h2>Agents</h2>${list(homeAgents.slice(0, 4).map(link))}<p><a href="/?kind=agent#library">Browse all agents</a></p></section>`,
    `<section id="everyday-tools"><h2>Free everyday tools</h2><p><a href="/tools">Explore all tools</a></p></section>`,
    `<h2>Skills by job</h2>${list(tasks.map(([t, bs]) => `<a href="${jobHref(t)}">${esc(TASK_NAMES[t] ?? t)}</a> (${bs.length}): ${bs.slice(0, 3).map(link).join(", ")}`))}`,
  ].join(""),
}).replace(/<title>[^<]*<\/title>/, "<title>Free AI Skills &amp; Custom Workflow Builder | AI Blocks</title>"));

// Job hubs: /jobs lists every job; /jobs/<job> lists every page for it with its one line, 150 to a page.
const PER = 150;
// A job hub's opening: counts of what is in it, how many are tested, a few results you get, the best items (tested
// first, then the most used in workflows) and the jobs it connects to. All of it comes from the hub's own items.
const KIND_LABEL = { skills: ["skill", "skills"], workflows: ["workflow", "workflows"], prompts: ["prompt", "prompts"], agents: ["agent", "agents"] };
const hubRank = (x) => (x.tested ? 1e6 : 0) + (Array.isArray(x.usedIn) ? x.usedIn.length : x.usedIn ?? 0);
const bestOf = (bs, n) => [...bs].sort((a, b) => hubRank(b) - hubRank(a) || a.name.localeCompare(b.name)).slice(0, n);
const arrow = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const testedBadge = (x) => (x.tested ? `<span class="from trust tested">Safety checked</span>` : "");
// The library's card, drawn without the app: name, its one line, what kind it is and whether it is Tested.
const hubCard = (x) => {
  const kind = KIND_LABEL[kindPath(x)]?.[0] ?? "skill";
  return `<a class="card hub-card" href="${hrefOf(x)}"><span class="nm">${esc(x.name)}</span><span class="peek">${esc(x.summary)}</span><span class="card-footer"><span class="meta secondary-meta"><span class="kind">${kind[0].toUpperCase()}${kind.slice(1)}</span>${testedBadge(x)}</span><span class="view">View the ${kind}${arrow}</span></span></a>`;
};
// Search from a plain page: the home page opens the library with ?q= (and ?job= keeps it to one job).
const hubSearch = (n, label = `Search ${n.toLocaleString("en-US")} skills, workflows and prompts`, job = "") =>
  `<form class="search big hub-search" action="/" method="get" role="search">${job ? `<input type="hidden" name="job" value="${esc(job)}" />` : ""}<input type="search" name="q" placeholder="${esc(label)}" aria-label="${esc(label)}" autocomplete="off" /><button class="btn btn-primary" type="submit">Search</button></form>`;
function hubIntro(t, name, bs) {
  const best = bestOf(bs, 8);
  const counts = Object.entries(bs.reduce((m, x) => ((m[kindPath(x)] = (m[kindPath(x)] ?? 0) + 1), m), {})).sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${n.toLocaleString("en-US")} ${KIND_LABEL[k]?.[n === 1 ? 0 : 1] ?? k}`);
  const tested = bs.filter((x) => x.tested).length;
  const gets = best.slice(0, 3).map((x) => readPage(x.slug).you_get?.[0]).filter((g) => typeof g === "string" && g.length < 110).map((g) => g.replace(/[.\s]+$/, ""));
  const near = {};
  for (const x of bs) for (const s of [...(x.uses ?? []), ...(x.steps ?? []).map((y) => (Array.isArray(y) ? y[0] : y)), ...(usedBy[x.slug] ?? [])]) { const o = bySlug[s]?.task; if (o && o !== t && TASK_NAMES[o]) near[o] = (near[o] ?? 0) + 1; }
  const relatedJobs = Object.entries(near).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4).map(([o]) => o);
  const pill = (o) => `<a href="${jobHref(o)}">${esc(TASK_NAMES[o] ?? o)}</a>`;
  const related = relatedJobs.map(pill);
  // Every hub also links to the other jobs in each area it belongs to, so no hub is a dead end and crawlers reach each
  // hub from several. A job alone in its areas links to the biggest hubs instead.
  const linkable = (o) => o !== t && !relatedJobs.includes(o) && isIndexableHub(o);
  const areaJobs = [...new Set(JOB_AREAS.flatMap((a) => { const ts = a.fns.flatMap((id) => FUNCTIONS.find((fn) => fn.id === id)?.tasks ?? []); return ts.includes(t) ? ts : []; }))]
    .filter(linkable).sort((x, y) => (byTask[y]?.length ?? 0) - (byTask[x]?.length ?? 0)).slice(0, 6);
  const popular = areaJobs.length + relatedJobs.length < 4 ? tasks.map(([o]) => o).filter((o) => linkable(o) && !areaJobs.includes(o)).slice(0, 6 - areaJobs.length) : [];
  return [
    `<p class="bp-sub">${esc(name)}: ${bs.length} free AI items you can run in Claude, ChatGPT or Gemini (${counts.join(", ")}).${tested ? ` ${tested} of them ${tested === 1 ? "is" : "are"} safety checked and come first below.` : ""}</p>`,
    gets.length ? `<p class="hub-gets">Examples of what you get: ${gets.map((g) => esc(lowerFirst(g))).join("; ")}.</p>` : "",
    hubSearch(bs.length, `Search the ${bs.length.toLocaleString("en-US")} items for this job`, t),
    `<h2 class="hub-h2">Start with these</h2><div class="grid hub-grid">${best.map(hubCard).join("")}</div>`,
    hubSpecialists(roleIndex, t),
    areaJobs.length ? `<p class="hub-links"><span>Related jobs</span>${areaJobs.map(pill).join("")}</p>` : "",
    popular.length ? `<p class="hub-links"><span>Popular jobs</span>${popular.map(pill).join("")}</p>` : "",
    `<p class="hub-links">${related.length ? `<span>Often used with</span>${related.join("")}` : ""}<a href="/jobs">All jobs</a><a href="/compose">Build a workflow for ${esc(lowerFirst(name))}</a></p>`,
  ].join("");
}
// A hub with only one or two items is too thin to rank and spends crawl time; it stays reachable but is not indexed.
const MIN_HUB_ITEMS = 3;
const isIndexableHub = (t) => (byTask[t]?.length ?? 0) >= MIN_HUB_ITEMS;
const hubTitle = (name, n, pg) => fitTitle(titleLadder(pg ? `${name}, page ${pg + 1}` : name, ["free AI skills for ChatGPT and Claude", `${n} free AI skills for ChatGPT`, `${n} free AI skills and workflows`, `${n} free AI skills`, "free AI skills", `${n} free AI skills to use`, "AI skills"]));

const hubUrls = ["/jobs"];
// /jobs groups the jobs under the library's broad areas, each job once, in the area it is listed under first.
const jobCount = new Map(tasks.map(([t, bs]) => [t, bs]));
const placed = new Set();
const jobGroups = JOB_AREAS.map((a) => {
  const ts = [...new Set(a.fns.flatMap((id) => FUNCTIONS.find((fn) => fn.id === id)?.tasks ?? []))].filter((t) => jobCount.has(t) && !placed.has(t));
  ts.forEach((t) => placed.add(t));
  return [a.name, ts.sort((x, y) => jobCount.get(y).length - jobCount.get(x).length)];
}).filter(([, ts]) => ts.length);
const unplaced = tasks.map(([t]) => t).filter((t) => !placed.has(t));
if (unplaced.length) jobGroups.push(["More jobs", unplaced]);
const jobCard = (t) => {
  const bs = jobCount.get(t), name = TASK_NAMES[t] ?? t;
  return `<div class="card hub-job"><a class="hub-job-name" href="${jobHref(t)}">${esc(name)}</a><span class="count">${bs.length.toLocaleString("en-US")} skills and workflows</span><ul>${bestOf(bs, 3).map((x) => `<li><a href="${hrefOf(x)}">${esc(x.name)}</a></li>`).join("")}</ul><span class="view">See all ${bs.length.toLocaleString("en-US")}${arrow}</span></div>`;
};
const allCount = cat.blocks.filter((b) => hasPage(b) && b.type !== "mind").length;
write("/jobs", render("/jobs", {
  title: "All AI skills and workflows by job", documentTitle: `Browse ${cat.blocks.filter((b) => hasPage(b) && b.type !== "mind").length.toLocaleString("en-US")} free AI skills and workflows by job | ${BRAND}`, desc: `${cat.blocks.filter((b) => hasPage(b) && b.type !== "mind").length.toLocaleString("en-US")} free AI skills, workflows and prompts sorted into ${tasks.length} jobs, from ${lowerFirst(TASK_NAMES[tasks[0][0]] ?? tasks[0][0])} to ${lowerFirst(TASK_NAMES[tasks[3][0]] ?? tasks[3][0])}. Pick the job you need done.`, h1: "All skills by job", collection: true,
  hub: true,
  body: `<p class="bp-sub">${allCount.toLocaleString("en-US")} free AI skills, workflows and prompts, sorted into ${tasks.length} jobs. Pick the job you need done, or search the whole library.</p>${hubSearch(allCount)}`
    + `<nav class="hub-areas" aria-label="Areas">${jobGroups.map(([n]) => `<a href="#${n.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${esc(n)}</a>`).join("")}</nav>`
    + jobGroups.map(([n, ts]) => `<section class="hub-area" id="${n.toLowerCase().replace(/[^a-z0-9]+/g, "-")}"><h2 class="hub-h2">${esc(n)}</h2><div class="hub-jobs">${ts.map(jobCard).join("")}</div></section>`).join(""),
  main: { "@type": "ItemList", numberOfItems: tasks.length, itemListElement: tasks.map(([t], i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${jobHref(t)}`, name: TASK_NAMES[t] ?? t })) },
}, { plain: true }));
for (const [t, bs] of tasks) {
  const name = TASK_NAMES[t] ?? t;
  // Keep the same existing recommendation order across the intro and paginated list.
  const ranked = bestOf(bs, bs.length);
  for (let pg = 0; pg * PER < bs.length; pg++) {
    const url = jobHref(t) + (pg ? `/${pg + 1}` : "");
    const items = ranked.slice(pg * PER, (pg + 1) * PER);
    const pages = Math.ceil(bs.length / PER);
    const nav = pages > 1 ? `<nav class="hub-pages" aria-label="Pages">${Array.from({ length: pages }, (_, i) => (i === pg ? `<b aria-current="page">Page ${i + 1}</b>` : `<a href="${jobHref(t)}${i ? `/${i + 1}` : ""}">Page ${i + 1}</a>`)).join("")}</nav>` : "";
    write(url, render(url, {
      title: `${name}: ${bs.length} free AI skills${pg ? `, page ${pg + 1}` : ""}`, documentTitle: hubTitle(name, bs.length, pg), desc: hubDescription(name, bs.length, items, pg, pages), h1: name + (pg ? `, page ${pg + 1}` : ""),
      crumbs: [["All skills by job", "/jobs"]], collection: true, hub: true,
      body: `${pg ? `<p class="bp-sub">Page ${pg + 1} of ${pages}: more free AI skills and workflows to ${esc(lowerFirst(name))}. <a href="${jobHref(t)}">Start with the best ${esc(lowerFirst(name))} skills on page 1</a>.</p>` : hubIntro(t, name, bs)}<h2 class="hub-h2">${pg ? `More to ${esc(lowerFirst(name))}` : `Every ${esc(lowerFirst(name))} skill and workflow`}</h2>${nav}<ul class="hub-list">${items.map((x) => `<li><a href="${hrefOf(x)}">${esc(x.name)}</a>${testedBadge(x)}<span>${esc(x.summary)}</span></li>`).join("")}</ul>${nav}`,
      main: { "@type": "ItemList", numberOfItems: items.length, itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: pg * PER + i + 1, url: `${SITE}${hrefOf(x)}`, name: x.name })) },
    }, { plain: true, noindex: isIndexableHub(t) ? false : "follow" }));
    if (isIndexableHub(t)) hubUrls.push(url);
  }
}

// How we test and the industry pages (scripts/lib/trust-pages.mjs): plain pages built from the outcome scorecard and the
// catalogue, listed in their own sitemap (sitemap-guides.xml). A pick that no longer exists or a link that goes nowhere fails the build.
const trustTools = [...BROWSER_TOOLS, ...TOOLS];
const trust = await trustPages({ cat, readPage, roles: roleIndex, tools: trustTools, routeExists: (u) => urls.includes(u) || fs.existsSync(path.join(DIST, `${u.slice(1)}.html`)) });
problems.push(...trust.problems, ...brokenLinks(trust.pages, { cat, roles: roleIndex, tools: trustTools, sitePaths: [...urls, ...hubUrls, ...Object.keys(BOARD_NAMES).map(playbookHref)] }).map((l) => `guide page link goes nowhere: ${l}`));
for (const pg of trust.pages) write(pg.url, render(pg.url, pg, { plain: true }));
guidesSitemap(trust.pages, DIST);

for (const url of urls) {
  // Job hubs and their pagination are rendered by the dedicated loop above.
  if (url === "/" || url === "/people" || url === "/jobs" || url.startsWith("/jobs/")) continue;
  const p = crawlPage(url, pageFor(url));
  if (p && sameJobAgents.has(url)) p.canonical = sameJobAgents.get(url);
  if (!p) { problems.push(`no page data for ${url}`); continue; }
  const html = render(url, p);
  const t = html.match(/<title>([^<]*)<\/title>/)[1];
  if (titles.has(t)) problems.push(`same title on ${titles.get(t)} and ${url}: ${t}`);
  titles.set(t, url);
  write(url, html);
  wrote++;
}

// A dedicated shell avoids Pages' wildcard-to-index rewrite loop for shared links.
for (const [url, title] of [["/account", "My account"], ["/sign-up", "Create an account"], ["/sign-in", "Sign in"]]) write(url, render(url, { title, desc: "Your saved kits, skills, workflows and account settings in one place.", h1: title, body: "<p>Keep your work together in your AI Blocks account.</p>" }, { noindex: true }));
for (const url of ["/community", "/publish", "/my-submissions", "/admin/review"]) write(url, render(url, pageFor(url), { noindex: url !== "/community" }));
write("/space", render("/space", { title: "My private space", desc: "Keep your own AI skills, prompts and workflows together. Manage your space using your private device link and choose what to share.", h1: "My private space", body: "<p>Your owner link controls access to this space. Keep it private.</p>" }, { noindex: true }));
write("/people", render("/people", { title: "Skills and workflows from people", desc: "Explore public AI skills, prompts and workflows shared by the community. Open a shared item or add it to your own collection.", h1: "From people", body: "<p>Discover skills and workflows people have chosen to make public.</p>" }, { noindex: true }));
write("/shared-space-shell", render("/shared-space-shell", { title: "Shared space", desc: "Read a shared collection of AI skills and workflows.", h1: "Shared space", body: "" }, { noindex: true }));
// A real 404: Cloudflare Pages answers unknown addresses with it (and a 404 status) instead of the home page.
fs.writeFileSync(path.join(DIST, "404.html"), render("/404", { title: "Page not found", desc: "This page doesn't exist. Find the skill you need by job.", h1: "This page doesn't exist",
  body: `<p class="bp-sub">The address may have a typo, or the page may have moved. Start from a job:</p>${list(tasks.map(([t]) => `<a href="${jobHref(t)}">${esc(TASK_NAMES[t] ?? t)}</a>`))}` }, { plain: true, noindex: true }));
// The hub addresses go into their own sitemap, read by build-index's sitemap index, each with its items' newest date.
jobsSitemap(hubUrls);
console.log(`prerender: ${wrote} pages (${thinUrls.size} imported without the Tested label), ${hubUrls.length} job hubs, a 404 page${problems.length ? `\n  ${problems.slice(0, 20).join("\n  ")}` : ""}`);
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
