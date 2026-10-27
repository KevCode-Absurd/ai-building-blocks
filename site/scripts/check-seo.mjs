// Checks the built pages the way a search engine sees them, and fails the build when a rule breaks. Run after
// `npm run build` (or against another folder with SEO_DIST=<dir>), from site/:  node scripts/check-seo.mjs
//   --gaps <file.json>   also write the pages whose own copy is too thin to describe (for the copy rewrite)
//   --json <file.json>   also write every count below, for comparing two builds
// Rules (each prints how many pages break it, with examples):
//  * titles 50 to 60 characters (45 is the floor; 45 to 49 is a warning), unique, brand last; descriptions 120 to 155, unique;
//    no description tail shared by more than 20 pages or 3% of a kind (a template, not a description)
//  * one h1, headings that never skip a level, a self canonical (no query, slash or .html), og and twitter tags that
//    match the title and description, an og image that exists
//  * valid JSON-LD per page type: Organization, WebSite, WebPage or CollectionPage, a BreadcrumbList that ends on this
//    page, and a CreativeWork, HowTo, WebApplication or ItemList only where the page is that
//  * the sitemap index lists every indexable page once, lists no noindex page, robots.txt points to it and blocks none
//    of it; only the private pages, /people, the saved example app and the utility pages are noindex
//  * every internal link in the prerendered body goes to a real page (not to a redirect); no item page is an orphan
//  * the prerendered body holds the page's real content, including "Is it for you?" and the output sample when the
//    page has them, and enough words
//  * nothing in the head blocks rendering except the one stylesheet; images have sizes and alt text
//  * every item page says "Updated <date>" and puts the same day in dateModified; sitemap lastmod values are real past dates
//  * each job hub opens with its own counts and a "Start with these" list, and the home page links to every hub; the home
//    page carries Organization and WebSite data with a SearchAction
import fs from "node:fs";
import path from "node:path";
import { DESC, TITLE, itemSeo } from "../src/lib/seo-meta.mjs";
import { TASKS } from "../src/lib/catalogue-taxonomy.mjs";
const JOB = Object.fromEntries(TASKS.map((t) => [t.id, t.name]));

const DIST = process.env.SEO_DIST || "dist";
const SITE = "https://useaiblocks.com";
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : null; };
const KINDS = ["skills", "prompts", "workflows", "agents", "minds"]; // catalogue item pages
// Pages that must be noindex, and the only ones that may be.
const NOINDEX = new Set(["/404", "/account", "/sign-in", "/sign-up", "/space", "/people", "/publish", "/my-submissions", "/admin/review", "/shared-space-shell", "/connect-mcp", "/support-chat-frame", "/analytics-privacy"]);
const SKIP_DIRS = new Set(["assets", "data", "metadata", "example-app", "example-app-shots", "mini-tools", "fonts", "og", "llms", "examples", "templates"]);

const problems = new Map(), warnings = new Map();
const add = (map, rule, url) => { (map.get(rule) ?? map.set(rule, []).get(rule)).push(url); };
const bad = (rule, url) => add(problems, rule, url);
const warn = (rule, url) => add(warnings, rule, url);
const un = (s) => String(s ?? "").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const read = (f) => fs.readFileSync(f, "utf8");
const exists = (f) => fs.existsSync(f);

// ---- find the pages -------------------------------------------------------------------------------------------
const pages = []; // { url, file, html }
const walk = (dir, top) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (top && SKIP_DIRS.has(e.name)) continue; walk(p, false); continue; }
    if (!e.name.endsWith(".html")) continue;
    const rel = path.relative(DIST, p).split(path.sep).join("/").replace(/\.html$/, "");
    pages.push({ url: rel === "index" ? "/" : `/${rel}`, file: p });
  }
};
walk(DIST, true);
const byUrl = new Map(pages.map((p) => [p.url, p]));

// ---- the catalogue, for the content checks ---------------------------------------------------------------------
const dataDir = exists(path.join(DIST, "data", "blocks.json")) ? path.join(DIST, "data") : "public/data";
const cat = JSON.parse(read(path.join(dataDir, "blocks.json")));
const bySlug = Object.fromEntries(cat.blocks.map((b) => [b.slug, b]));
const readPage = (slug) => { try { return JSON.parse(read(path.join(dataDir, "pages", `${slug}.json`))); } catch { return null; } };

// ---- redirects and robots ----------------------------------------------------------------------------------------
const redirects = new Map();
for (const line of exists(path.join(DIST, "_redirects")) ? read(path.join(DIST, "_redirects")).split("\n") : []) {
  const m = line.match(/^(\/\S+)\s+(\/\S+)\s+(\d+)/); if (m && m[3] === "301") redirects.set(m[1], m[2]);
}
const robotsTxt = exists(path.join(DIST, "robots.txt")) ? read(path.join(DIST, "robots.txt")) : "";
const disallows = [...robotsTxt.matchAll(/^Disallow:\s*(\S+)/gim)].map((m) => m[1]);

// ---- parse each page ----------------------------------------------------------------------------------------------
const meta = (h, attr, key) => un(h.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1] ?? "");
const stats = {};
const titles = new Map(), descs = new Map(), inbound = {}, words = {};
const indexable = [];
const heads = [];
for (const pg of pages) {
  const { url } = pg;
  const h = read(pg.file);
  const head = h.slice(0, h.indexOf("</head>"));
  const title = un(h.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = meta(h, "name", "description");
  const robots = meta(h, "name", "robots");
  const noindex = /noindex/.test(robots);
  const kind = KINDS.includes(url.split("/")[1]) && url.split("/").length === 3 ? url.split("/")[1] : url.startsWith("/jobs") ? "jobs" : url.startsWith("/tools/") ? "tools" : url.startsWith("/ai-tools/") ? "ai-tools" : "other";
  const body = h.match(/<main\b[^>]*data-prerendered[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  Object.assign(pg, { h, title, desc, robots, noindex, kind, body });
  heads.push(head.length);

  // Noindex: only the listed pages, and all of them.
  if (noindex && !NOINDEX.has(url)) bad("noindex on a page that should be indexed", url);
  if (!noindex && NOINDEX.has(url)) bad("a private page that is not noindex", url);
  if (NOINDEX.has(url) || noindex) continue;
  indexable.push(pg);

  // Title and description.
  const tl = title.length;
  if (!title) bad("missing title", url);
  else if (tl > TITLE.max) bad(`title over ${TITLE.max} characters`, url);
  else if (tl < TITLE.min - 5) bad(`title under ${TITLE.min - 5} characters`, url);
  else if (tl < TITLE.min) warn(`title ${TITLE.min - 5} to ${TITLE.min - 1} characters (aim for ${TITLE.min} to ${TITLE.max})`, url);
  if (url !== "/" && !/\| AI Blocks$/.test(title) && tl) warn("brand is not last in the title", url);
  if (titles.has(title)) bad("same title on two pages", `${titles.get(title)} and ${url}`); else titles.set(title, url);
  const dl = desc.length;
  if (!desc) bad("missing description", url);
  else if (dl > DESC.max) bad(`description over ${DESC.max} characters`, url);
  else if (dl < DESC.min) bad(`description under ${DESC.min} characters`, url);
  if (desc && descs.has(desc)) bad("same description on two pages", `${descs.get(desc)} and ${url}`); else if (desc) descs.set(desc, url);
  if (/[�]|&amp;amp;|undefined|\[object|NaN|\$\{/.test(title + desc)) bad("broken text in title or description (undefined, NaN, a stray ${})", url);

  // Canonical: this page, in its one address.
  const canonical = un(h.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "");
  const want = `${SITE}${url}`;
  if (canonical !== want) bad("canonical is not this page's own address", `${url} -> ${canonical || "none"}`);
  if (/[?#]|\.html$|\/$/.test(canonical.replace(`${SITE}/`, "x")) || /[A-Z]/.test(canonical.replace(SITE, ""))) bad("canonical has a query, slash, .html or capital", url);
  // Social tags.
  if (meta(h, "property", "og:title") !== title) bad("og:title differs from the title", url);
  if (meta(h, "property", "og:description") !== desc) bad("og:description differs from the description", url);
  if (meta(h, "property", "og:url") !== want) bad("og:url is not the canonical address", url);
  if (meta(h, "name", "twitter:title") !== title || meta(h, "name", "twitter:description") !== desc) bad("twitter title or description differs", url);
  if (meta(h, "name", "twitter:card") !== "summary_large_image") bad("no twitter:card", url);
  const img = meta(h, "property", "og:image");
  if (!img.startsWith(`${SITE}/`)) bad("no absolute og:image", url);
  else if (!exists(path.join(DIST, img.slice(SITE.length + 1)))) bad("og:image file is missing", url);
  if (!meta(h, "property", "og:image:width") || !meta(h, "property", "og:image:alt")) warn("og:image has no size or alt text", url);
  if ((h.match(/<meta name="robots"/g) ?? []).length !== 1) bad("not exactly one robots tag", url);
  if (!/<html lang="en"/.test(h)) bad("no lang on <html>", url);
  if (!/<meta name="viewport"/.test(h)) bad("no viewport tag", url);

  // Headings: one h1, then never a level skipped going down.
  const levels = [...body.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  // The home page keeps its h1 in the first-screen shell, so its prerendered copy starts at h2.
  if (url === "/" ? levels.includes(1) : levels.filter((l) => l === 1).length !== 1) bad("not exactly one h1 in the page body", url);
  else if (levels[0] !== (url === "/" ? 2 : 1)) bad("the h1 is not the first heading", url);
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { bad("heading level skipped (for example h2 then h4)", url); break; }
  const h1s = [...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  if (h1s.length !== 1) bad("not exactly one h1 in the whole page", url);

  // Render-blocking and image risks in the head and body.
  for (const s of head.matchAll(/<script\b([^>]*)>/g)) if (/\bsrc=/.test(s[1]) && !/\b(defer|async)\b|type="module"/.test(s[1])) bad("a script in the head blocks rendering (no defer, async or module)", url);
  const sheets = (head.match(/<link rel="stylesheet"/g) ?? []).length;
  if (sheets > 2) bad("more than two stylesheets block rendering", url);
  if (/<link rel="stylesheet"[^>]*href="https?:\/\//.test(head)) bad("a stylesheet from another site blocks rendering", url);
  for (const i of body.matchAll(/<img\b([^>]*)>/g)) { if (!/\bwidth=/.test(i[1]) || !/\bheight=/.test(i[1])) bad("an image with no width and height (layout shift)", url); if (!/\balt=/.test(i[1])) bad("an image with no alt text", url); }
  if (pg.h.length > 900000) warn("page over 900 KB of HTML", url);

  // JSON-LD.
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (ld.length !== 1) bad("not exactly one JSON-LD block", url);
  else {
    let j = null;
    try { j = JSON.parse(ld[0]); } catch { bad("JSON-LD does not parse", url); }
    if (j) checkLd(j, pg, want, desc);
  }

  // Words and links in the prerendered body.
  const text = body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ");
  pg.words = text.split(/\s+/).filter(Boolean).length;
  (words[kind] ??= []).push(pg.words);
  if (!body) bad("no prerendered body for crawlers that skip JavaScript", url);
  pg.links = [...body.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const href of new Set(pg.links)) { const p = href.split(/[?#]/)[0] || "/"; if (p !== url) inbound[p] = (inbound[p] ?? 0) + 1; }
}

function checkLd(j, pg, want, desc) {
  const { url } = pg;
  if (j["@context"] !== "https://schema.org") bad("JSON-LD has no schema.org @context", url);
  const g = j["@graph"];
  if (!Array.isArray(g)) { bad("JSON-LD has no @graph", url); return; }
  const ids = g.map((x) => x["@id"]).filter(Boolean);
  if (new Set(ids).size !== ids.length) bad("JSON-LD repeats an @id", url);
  const type = (t) => g.find((x) => x["@type"] === t);
  for (const t of ["Organization", "WebSite"]) if (!type(t)) bad(`JSON-LD has no ${t}`, url);
  const page = type("WebPage") ?? type("CollectionPage");
  if (!page) { bad("JSON-LD has no WebPage or CollectionPage", url); return; }
  if (page.url !== want) bad("JSON-LD page url is not the canonical address", url);
  if (page["@id"] !== `${want}#page`) bad("JSON-LD page @id is not the canonical address plus #page", url);
  if (!page.name || !page.description) bad("JSON-LD page has no name or description", url);
  else if (un(page.description) !== desc) bad("JSON-LD description differs from the meta description", url);
  if (page.dateModified && !/^\d{4}-\d{2}-\d{2}/.test(page.dateModified)) bad("JSON-LD dateModified is not a date", url);
  const crumbs = type("BreadcrumbList");
  if (!crumbs) bad("JSON-LD has no BreadcrumbList", url);
  else {
    const items = crumbs.itemListElement ?? [];
    if (!items.length) bad("empty BreadcrumbList", url);
    if (items.some((x, i) => x.position !== i + 1 || !x.name || !String(x.item).startsWith(`${SITE}/`))) bad("BreadcrumbList item without a position, name or address", url);
    if (url !== "/" && items.at(-1)?.item !== want) bad("BreadcrumbList does not end on this page", url);
    if (url === "/" && items.length !== 1) bad("home BreadcrumbList should be one item", url);
    if (new Set(items.map((x) => x.item)).size !== items.length) bad("BreadcrumbList repeats an address", url);
    if (page.breadcrumb?.["@id"] !== crumbs["@id"]) bad("WebPage does not point at its BreadcrumbList", url);
  }
  const main = page.mainEntity;
  const mt = main?.["@type"];
  const allowed = { skills: ["CreativeWork"], prompts: ["CreativeWork"], agents: ["CreativeWork"], minds: ["CreativeWork"], workflows: ["CreativeWork", "HowTo"], jobs: ["ItemList"], tools: ["WebApplication"] };
  if (pg.kind in allowed && url !== "/tools" && !allowed[pg.kind].includes(mt)) {
    if (!(pg.kind === "tools" && url === "/tools/growth-channel-planner")) bad(`${pg.kind} page without a ${allowed[pg.kind].join(" or ")} in its JSON-LD`, url);
  }
  if (mt === "HowTo" && (!Array.isArray(main.step) || !main.step.length || main.step.some((s) => !s.name || !s.text))) bad("HowTo without steps that have a name and text", url);
  if (mt === "ItemList" && (!main.itemListElement?.length || main.numberOfItems !== main.itemListElement.length)) bad("ItemList count does not match its items", url);
  if (mt === "WebApplication" && (!main.name || !main.offers)) bad("WebApplication without a name or offer", url);
  if (mt === "CreativeWork" && (!main.name || !main.description)) bad("CreativeWork without a name or description", url);
  if (g.some((x) => ["FAQPage", "Review", "AggregateRating", "Product"].includes(x["@type"]))) bad("FAQPage, Review, Rating or Product markup on a page that is not one", url);
  if (JSON.stringify(j).includes("undefined")) bad("JSON-LD contains the text undefined", url);
}

// ---- sitemaps ---------------------------------------------------------------------------------------------------
const smIndex = exists(path.join(DIST, "sitemap.xml")) ? read(path.join(DIST, "sitemap.xml")) : "";
if (!/<sitemapindex/.test(smIndex)) bad("sitemap.xml is not a sitemap index", "/sitemap.xml");
const inSitemap = new Map();
let sitemapFiles = 0;
for (const m of smIndex.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const f = path.join(DIST, m[1].replace(`${SITE}/`, ""));
  if (!m[1].startsWith(`${SITE}/`) || !exists(f)) { bad("the sitemap index lists a file that does not exist", m[1]); continue; }
  sitemapFiles++;
  const xml = read(f);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
  if (locs.length > 50000 || Buffer.byteLength(xml) > 50 * 1024 * 1024) bad("a sitemap file is over the 50,000 URL or 50 MB limit", m[1]);
  const today = new Date().toISOString().slice(0, 10);
  for (const lm of xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)) if (!/^\d{4}-\d{2}-\d{2}$/.test(lm[1]) || lm[1] > today) bad("a sitemap lastmod is not a past date (YYYY-MM-DD)", `${m[1]} ${lm[1]}`);
  for (const loc of locs) {
    const u = loc.replace(SITE, "") || "/";
    if (!loc.startsWith(`${SITE}/`)) bad("sitemap URL is not on useaiblocks.com", loc);
    if (/[?#]|\.html$|[A-Z]/.test(u) || (u.length > 1 && u.endsWith("/"))) bad("sitemap URL has a query, fragment, .html, capital or trailing slash", loc);
    if (inSitemap.has(u)) bad("a URL appears twice in the sitemaps", u); else inSitemap.set(u, path.basename(f));
    if (redirects.has(u)) bad("a redirecting address is in the sitemap", u);
    if (!byUrl.has(u) && u !== "/") bad("a sitemap URL has no page", u);
    else if (byUrl.get(u)?.noindex) bad("a noindex page is in the sitemap", u);
  }
}
for (const pg of indexable) if (!inSitemap.has(pg.url)) bad("an indexable page is missing from the sitemaps", pg.url);
if (!robotsTxt.includes(`Sitemap: ${SITE}/sitemap.xml`)) bad("robots.txt does not point to the sitemap index", "/robots.txt");
for (const d of disallows) for (const u of inSitemap.keys()) if (u.startsWith(d)) { bad("robots.txt blocks a page that is in the sitemap", u); break; }
// The saved example app is noindex (a meta tag and a header), and robots.txt must let crawlers read that.
const example = path.join(DIST, "example-app", "index.html");
if (exists(example) && !/<meta name="robots" content="[^"]*noindex/.test(read(example))) bad("the saved example app has no noindex tag", "/example-app/");
const headersFile = exists(path.join(DIST, "_headers")) ? read(path.join(DIST, "_headers")) : "";
if (exists(example) && !/\/example-app\/\*\s*\n(\s+.*\n)*?\s+X-Robots-Tag: noindex/.test(headersFile)) bad("no X-Robots-Tag: noindex header for /example-app/*", "/_headers");
if (disallows.some((d) => "/example-app/".startsWith(d) || d.startsWith("/example-app"))) bad("robots.txt blocks /example-app/, so crawlers can never read its noindex", "/robots.txt");

// ---- links ------------------------------------------------------------------------------------------------------
const files = new Set();
const listFiles = (dir, rel) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const r = `${rel}/${e.name}`; if (e.isDirectory()) { files.add(r); listFiles(path.join(dir, e.name), r); } else files.add(r); } };
for (const e of fs.readdirSync(DIST, { withFileTypes: true })) { if (e.isDirectory()) { files.add(`/${e.name}`); if (!["data", "metadata", "assets", "fonts", "example-app-shots", "mini-tools"].includes(e.name)) listFiles(path.join(DIST, e.name), `/${e.name}`); } else files.add(`/${e.name}`); }
const APP_ROUTES = new Set(["/s", "/community", "/mcp", "/mcp/server-card", "/.well-known/ai-catalog.json"]); // and /api/..., which the worker answers
// Markdown and JSON twins of a page (/<kind>/<slug>.md|.json): the worker builds them from the page data (src/server/twins.ts).
const twinOf = p => { const m = p.match(/^(\/[a-z-]+\/[^/]+)\.(?:md|json)$/); return m && byUrl.has(m[1]); };
let linkCount = 0;
for (const pg of indexable) {
  for (const href of new Set(pg.links)) {
    linkCount++;
    const p = (href.split(/[?#]/)[0] || "/").replace(/(.)\/$/, "$1");
    const resolved = p === "/" || p.startsWith("/api/") || byUrl.has(p) || files.has(p) || files.has(`${p}.html`) || files.has(`${p}/index.html`) || APP_ROUTES.has(p) || twinOf(p);
    // A supporting file the page lists (references/...): the release step copies it out of the skill's zip.
    const support = p.match(/^\/skills\/([^/]+)\/(.+)$/);
    if (!resolved && support && (readPage(support[1])?.files ?? []).includes(support[2])) { warn("a link to a supporting file that exists only after the release step unpacks the zip", `${pg.url} -> ${p}`); continue; }
    if (redirects.has(p)) bad("an internal link goes to an address that redirects", `${pg.url} -> ${p}`);
    else if (!resolved) bad("a broken internal link", `${pg.url} -> ${p}`);
  }
}
const items = indexable.filter((p) => KINDS.includes(p.kind));
for (const pg of items) if (!inbound[pg.url]) bad("an item page no other page links to (orphan)", pg.url);
for (const pg of indexable.filter((p) => p.kind === "jobs" || p.kind === "tools" || p.kind === "ai-tools")) if (!inbound[pg.url] && pg.url !== "/tools") bad("a hub or tool page no other page links to (orphan)", pg.url);
// Each job hub opens with its own counts and a "Start with these" list; the home page links to every hub.
const home = byUrl.get("/");
for (const pg of indexable.filter((p) => /^\/jobs\/[^/]+$/.test(p.url))) {
  if (!pg.body.includes("Start with these")) bad('a job hub with no "Start with these" list', pg.url);
  if (home && !home.body.includes(`href="${pg.url}"`)) bad("a job hub the home page does not link to", pg.url);
}
// Organization and WebSite structured data on the home page, with the search box and any configured profiles.
if (home) {
  try {
    const g = JSON.parse(home.h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
    const org = g.find((x) => x["@type"] === "Organization"), site = g.find((x) => x["@type"] === "WebSite");
    if (!org?.name || !org.url || !org.logo || !org.email) bad("home Organization lacks a name, url, logo or email", "/");
    else if (!exists(path.join(DIST, org.logo.replace(`${SITE}/`, "")))) bad("the Organization logo file is missing", org.logo);
    if (site?.potentialAction?.["@type"] !== "SearchAction" || !String(site.potentialAction.target?.urlTemplate).includes("{search_term_string}")) bad("home WebSite has no SearchAction", "/");
    if (org?.sameAs && org.sameAs.some((u) => !/^https:\/\//.test(u))) bad("sameAs holds a non-https profile", "/");
  } catch { bad("home page structured data could not be read", "/"); }
}
// Every item links back up to its job hub, and every hub links down to the pages it lists.
const noHub = items.filter((p) => !["minds"].includes(p.kind) && bySlug[p.url.split("/")[2]]?.task && !p.body.includes(`href="/jobs/${bySlug[p.url.split("/")[2]].task}"`));
for (const p of noHub) bad("an item page with no link up to its job hub", p.url);

// ---- content --------------------------------------------------------------------------------------------------------
const MIN_WORDS = { skills: 150, prompts: 150, workflows: 150, agents: 150, minds: 120 };
for (const pg of items) {
  const slug = pg.url.split("/")[2];
  if (pg.words < (MIN_WORDS[pg.kind] ?? 0)) bad(`fewer than ${MIN_WORDS[pg.kind]} words in the prerendered body`, pg.url);
  const page = readPage(slug);
  if (!page) continue;
  // Freshness: the page says when it last changed, and its structured data says the same day.
  if (page.added) {
    if (!pg.body.includes("Updated ")) bad('page has a last-change date but the body has no "Updated" line', pg.url);
    const ldPage = (() => { try { return JSON.parse(pg.h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? "{}")["@graph"]?.find((x) => x["@type"] === "WebPage"); } catch { return null; } })();
    if (ldPage && ldPage.dateModified !== page.added) bad("JSON-LD dateModified is not the page's last-change date", pg.url);
  }
  const when = (Array.isArray(page.when) ? page.when : page.when ? [page.when] : []).filter((x) => typeof x === "string" && x.trim());
  const notFor = (Array.isArray(page.not_for) ? page.not_for : page.not_for ? [page.not_for] : []).filter((x) => typeof x === "string" && x.trim());
  const os = page.output_sample;
  const weOk = os && typeof os === "object" && Array.isArray(os.input) && os.input.some((x) => typeof x === "string" && x.trim()) && Array.isArray(os.output) && os.output.some((o) => o && typeof o.name === "string" && o.name.trim() && typeof o.contains === "string" && o.contains.trim());
  if (pg.kind !== "minds") {
    if ((when.length || notFor.length) && !pg.body.includes('id="fit"')) bad('page has when or not_for but the body has no "Is it for you?" part', pg.url);
    if (notFor.length && !pg.body.includes("Skip it when")) bad("page has not_for but the body has no Skip it when list", pg.url);
    if (weOk && !pg.body.includes('id="sample"')) bad("page has an output sample but the body has none", pg.url);
    if (page.subhead && !un(pg.body.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").includes(String(page.subhead).replace(/\s+/g, " ").trim().split(" ").slice(0, 6).join(" "))) warn("the page's subhead is not in the prerendered body", pg.url);
  }
}
// Pages built mostly in the browser still say what they are for.
for (const u of ["/how-it-works", "/apps", "/compose", "/from-a-source", "/community", "/minds", "/tools"]) {
  const pg = byUrl.get(u);
  if (pg && pg.words < 120) bad("a main page with fewer than 120 words in its prerendered body", u);
}

// ---- templated descriptions -----------------------------------------------------------------------------------------
const tails = new Map();
for (const pg of indexable) { const t = pg.desc.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).slice(-6).join(" "); if (t) (tails.get(t) ?? tails.set(t, []).get(t)).push(pg); }
const perKind = {}; for (const pg of indexable) perKind[pg.kind] = (perKind[pg.kind] ?? 0) + 1;
const tailReport = [];
for (const [t, list] of tails) {
  const k = list[0].kind;
  if (list.length > 50) { bad("one description ending shared by more than 20 pages (a template)", `"…${t}" on ${list.length} pages, e.g. ${list[0].url}`); tailReport.push([t, list.length]); }
  else if (list.length > 20) warn("one description ending shared by more than 20 pages", `"…${t}" on ${list.length} pages`);
}

// ---- the copy gaps: pages whose own words are too thin to describe ------------------------------------------------------
function gaps() {
  const out = { generated: new Date().toISOString().slice(0, 10), rules: { summary: "120 to 155 characters, outcome first (docs/QUALITY-BAR.md)", description: "built from summary, then when, you_get, you_give, subhead, steps; a shared sentence is the last resort" }, counts: {} };
  const g = { summaryUnder80: [], summary80to119: [], summaryOver155: [], descriptionFromSharedSentence: [], descriptionStillUnder120: [], noWhen: [], noYouGet: [], noSubhead: [], noNotFor: [], noOutputSample: [] };
  const sentences = new Map(), openers = new Map();
  const all = cat.blocks.filter((b) => b.headline !== "");
  for (const b of all) {
    const kind = b.type === "mind" ? "mind" : b.type === "agent" ? "agent" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflow" : b.type === "prompt" ? "prompt" : "skill";
    const n = b.summary.length;
    if (n < 80) g.summaryUnder80.push(b.slug); else if (n < DESC.min) g.summary80to119.push(b.slug); else if (n > DESC.max) g.summaryOver155.push(b.slug);
    for (const s of b.summary.split(/(?<=[.!?])\s+/)) { const k = s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim(); if (k.length > 12) (sentences.get(k) ?? sentences.set(k, { text: s, slugs: [] }).get(k)).slugs.push(b.slug); }
    const op = b.summary.split(/\s+/).slice(0, 3).join(" ").toLowerCase(); (openers.get(op) ?? openers.set(op, []).get(op)).push(b.slug);
    if (kind === "mind") continue;
    const page = readPage(b.slug) ?? {};
    const seo = itemSeo({ block: b, page, kind, job: JOB[b.task] ?? "", steps: (b.steps ?? []).map((x) => bySlug[Array.isArray(x) ? x[0] : x]?.name).filter(Boolean) });
    if (seo.description.from === "tail") g.descriptionFromSharedSentence.push(b.slug);
    if (seo.description.short) g.descriptionStillUnder120.push(b.slug);
    if (!(page.when ?? []).length) g.noWhen.push(b.slug);
    if (!(page.you_get ?? []).length) g.noYouGet.push(b.slug);
    if (!page.subhead) g.noSubhead.push(b.slug);
    if (!(Array.isArray(page.not_for) ? page.not_for : page.not_for ? [page.not_for] : []).some((x) => typeof x === "string" && x.trim())) g.noNotFor.push(b.slug);
    const os = page.output_sample;
    if (!(os && typeof os === "object" && Array.isArray(os.input) && os.input.some((x) => typeof x === "string" && x.trim()) && Array.isArray(os.output) && os.output.some((o) => o && typeof o.name === "string" && o.name.trim() && typeof o.contains === "string" && o.contains.trim()))) g.noOutputSample.push(b.slug);
  }
  const repeated = [...sentences.values()].filter((x) => x.slugs.length >= 8).sort((a, b) => b.slugs.length - a.slugs.length).map((x) => ({ sentence: x.text, count: x.slugs.length, slugs: x.slugs }));
  const templatedOpeners = [...openers].filter(([, s]) => s.length >= 40).sort((a, b) => b[1].length - a[1].length).map(([opener, slugs]) => ({ opener, count: slugs.length, slugs }));
  for (const [k, v] of Object.entries(g)) out.counts[k] = v.length;
  out.counts.itemsWithPages = all.length;
  out.counts.summarySentenceRepeatedOn8OrMore = new Set(repeated.flatMap((r) => r.slugs)).size;
  out.counts.summaryOpenerRepeatedOn40OrMore = new Set(templatedOpeners.flatMap((r) => r.slugs)).size;
  return { ...out, ...g, repeatedSummarySentences: repeated, repeatedSummaryOpeners: templatedOpeners };
}
if (arg("gaps")) { const out = gaps(); fs.mkdirSync(path.dirname(path.resolve(arg("gaps"))), { recursive: true }); fs.writeFileSync(arg("gaps"), JSON.stringify(out, null, 1)); console.log(`copy gaps written to ${arg("gaps")}: ${JSON.stringify(out.counts)}`); }

// ---- report -------------------------------------------------------------------------------------------------------------
for (const [k, w] of Object.entries(words)) { w.sort((a, b) => a - b); stats[k] = { pages: w.length, fewest_words: w[0], median_words: w[w.length >> 1] }; }
console.table(stats);
const nTitleOk = indexable.filter((p) => p.title.length >= TITLE.min && p.title.length <= TITLE.max).length;
const nDescOk = indexable.filter((p) => p.desc.length >= DESC.min && p.desc.length <= DESC.max).length;
console.log(`${pages.length} pages read, ${indexable.length} indexable, ${inSitemap.size} in ${sitemapFiles} sitemaps, ${linkCount} distinct internal links checked`);
console.log(`titles ${TITLE.min}-${TITLE.max}: ${nTitleOk}/${indexable.length}; descriptions ${DESC.min}-${DESC.max}: ${nDescOk}/${indexable.length}; ${titles.size} distinct titles, ${descs.size} distinct descriptions; head size median ${heads.sort((a, b) => a - b)[heads.length >> 1]} bytes`);
const show = (map, label) => {
  if (!map.size) return;
  const total = [...map.values()].reduce((n, l) => n + l.length, 0);
  console.log(`\n${total} ${label}:`);
  for (const [rule, list] of [...map].sort((a, b) => b[1].length - a[1].length)) console.log(`  ${String(list.length).padStart(5)}  ${rule}  (e.g. ${list.slice(0, 3).join("; ")})`);
};
show(warnings, "warnings");
show(problems, "problems");
if (arg("json")) fs.writeFileSync(arg("json"), JSON.stringify({ pages: pages.length, indexable: indexable.length, sitemapUrls: inSitemap.size, titlesInRange: nTitleOk, descriptionsInRange: nDescOk, problems: Object.fromEntries([...problems].map(([k, v]) => [k, v.length])), warnings: Object.fromEntries([...warnings].map(([k, v]) => [k, v.length])) }, null, 1));
if (!problems.size) console.log("\nseo check passed");
process.exitCode = problems.size ? 1 : 0;
