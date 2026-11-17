// The website's pages as the Worker sends them (src/pages.ts): head tags, plain content, boot data, 404s, robots.txt,
// sitemap.xml and llms.txt. Only production is indexed.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { testEnv } from "./helpers.ts";
import { clearShellCache, clip, ECOMMERCE_DESCRIPTION, ECOMMERCE_PATH, esc, GUIDES, indexedShelfItem } from "../src/pages.ts";
import { housePersonas } from "../src/modules/directory/index.ts";
import { verticalBundle } from "../src/modules/knowledge/bundle.ts";
import { forgetVerticals } from "../src/modules/knowledge/service.ts";
import type { Card, Source, Vertical } from "../src/modules/knowledge/cards.ts";

const SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Old title</title>
    <meta name="description" content="Old description" />
    <meta property="og:title" content="Old" />
    <script type="module" crossorigin src="/assets/index.js"></script>
    <link rel="icon" href="/favicon.svg" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;
const ASSETS = { fetch: async (req: Request) => new URL(req.url).pathname === "/" ? new Response(SHELL, { headers: { "content-type": "text/html" } }) : new Response("missing", { status: 404 }) };
const PROD = { APP_ENV: "production", ASSETS } as const;
const live = housePersonas().filter(p => p.status === "live" && p.kind === "house");
const agent = live.find(p => p.role) ?? live[0];

beforeEach(() => clearShellCache());

test("guide titles match each guide's first heading", () => {
  for (const g of GUIDES) {
    const md = readFileSync(new URL(`../src/ui/content/guides/${g.slug}.md`, import.meta.url), "utf8");
    assert.equal(md.match(/^# (.+)$/m)?.[1], g.title, g.slug);
  }
});

test("an agent's page has its own head tags, plain content and the profile data", async () => {
  const t = await testEnv(PROD);
  const { status, body, res } = await t.api("GET", `/agents/${agent.id}`);
  assert.equal(status, 200);
  assert.equal(res.headers.get("x-robots-tag"), null);
  assert.equal(res.headers.get("x-frame-options"), "DENY");
  const html = String(body);
  assert.match(html, new RegExp(`<title>${esc(agent.name)}, ${esc(agent.title)} \\|`));
  assert.ok(!html.includes("Old title") && !html.includes("Old description") && !html.includes('content="Old"'), "the shell's own tags are replaced");
  assert.match(html, new RegExp(`<link rel="canonical" href="https://agents\\.test/agents/${agent.id}" />`));
  assert.match(html, /<meta name="robots" content="index, follow/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, new RegExp(`<h1>${esc(agent.name)}</h1>`));
  const portrait = html.match(/<img src="([^"]+)" alt="[^"]*" width="160"/)?.[1];
  assert.ok(portrait && html.includes(`<link rel="preload" as="image" href="${portrait}" fetchpriority="high" />`), "the portrait, the largest image, is fetched first");
  const boot = JSON.parse(html.match(/<script type="application\/json" id="boot">([\s\S]*?)<\/script>/)![1]);
  const api = await t.api("GET", `/api/agents/${agent.id}`);
  assert.deepEqual(boot[`/api/agents/${agent.id}`], api.body, "the page carries what /api/agents/:id returns");
  assert.ok(html.indexOf('id="boot"') > html.indexOf("<body>") && html.indexOf('id="boot"') < html.indexOf("</body>"), "boot data is in the body, read by the deferred app script");
});

test("the home page carries the featured agents, so the strip paints without moving the page", async () => {
  const t = await testEnv(PROD);
  const html = String((await t.api("GET", "/")).body);
  const boot = JSON.parse(html.match(/<script type="application\/json" id="boot">([\s\S]*?)<\/script>/)![1]);
  const api = await t.api("GET", "/api/agents?featured=6");
  assert.deepEqual(boot["/api/agents?featured=6"], api.body, "the page carries what the strip asks for");
});

test("outside production every page says noindex, and robots.txt disallows everything", async () => {
  const t = await testEnv({ ASSETS });
  const page = await t.api("GET", `/agents/${agent.id}`);
  assert.match(String(page.body), /<meta name="robots" content="noindex, follow" \/>/);
  assert.equal(page.res.headers.get("x-robots-tag"), "noindex");
  const robots = await t.api("GET", "/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.body, /^User-agent: \*\nDisallow: \/$/m);
  assert.doesNotMatch(robots.body, /Sitemap:/);
});

test("unknown addresses and agents are real 404s; app-only pages are served but not indexed", async () => {
  const t = await testEnv(PROD);
  for (const path of ["/no-such-page", "/agents/no-such-agent", "/guides/no-such-guide"]) {
    const res = await t.api("GET", path);
    assert.equal(res.status, 404, path);
    assert.match(String(res.body), /<meta name="robots" content="noindex, follow" \/>/);
    assert.match(String(res.body), /<div id="app"><\/div>/, "the app still draws its own not-found page");
  }
  const jobs = await t.api("GET", "/jobs");
  assert.equal(jobs.status, 200);
  assert.equal(jobs.res.headers.get("x-robots-tag"), "noindex");
  const search = await t.api("GET", "/agents?q=seo");
  assert.match(String(search.body), /content="noindex, follow"/, "search results are not indexed");
  const head = await t.api("HEAD", "/");
  assert.equal(head.status, 200);
});

// Production's assets answer a missing file with the app's index.html and a 200 (not_found_handling
// "single-page-application"). Pack-file viewers end in .md, so before 17 Nov 2026 they all reached Google as copies of
// the home page: no canonical, no noindex.
const SPA_ASSETS = { fetch: async (req: Request) => {
  const path = new URL(req.url).pathname;
  if (path === "/favicon.ico") return new Response("icon", { headers: { "content-type": "image/x-icon" } });
  return new Response(SHELL, { headers: { "content-type": "text/html" } });
} };

test("a pack file's viewer page says noindex and names the file, though its address ends in .md", async () => {
  const t = await testEnv({ ...PROD, ASSETS: SPA_ASSETS as unknown as Fetcher });
  for (const file of ["SKILL.md", "skills/research/SKILL.md", "LICENSE.md"]) {
    const res = await t.api("GET", `/agents/${agent.id}/files/${file}`);
    assert.equal(res.status, 200, file);
    assert.equal(res.res.headers.get("x-robots-tag"), "noindex", file);
    const html = String(res.body);
    assert.match(html, /<meta name="robots" content="noindex, follow" \/>/, file);
    assert.ok(html.includes(`<title>${esc(`${file}: ${agent.name}'s pack files`)} |`), file);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://agents\\.test/agents/${agent.id}/files/${file.replace(/[.]/g, "\\.")}" />`), file);
    assert.ok(!html.includes("Old title"), "not the shell's own title");
  }
  const noAgent = await t.api("GET", "/agents/no-such-agent/files/SKILL.md");
  assert.equal(noAgent.status, 404);
});

test("a made-up address with a file extension is a 404, not a copy of the home page; real files still load", async () => {
  const t = await testEnv({ ...PROD, ASSETS: SPA_ASSETS as unknown as Fetcher });
  for (const path of ["/nothing.md", "/agents/x.json", "/skills/a/SKILL.md"]) {
    const res = await t.api("GET", path);
    assert.equal(res.status, 404, path);
    assert.equal(res.res.headers.get("x-robots-tag"), "noindex", path);
  }
  const icon = await t.api("GET", "/favicon.ico");
  assert.equal(icon.status, 200);
  assert.equal(icon.body, "icon");
});

test("a role page has its own title and canonical address, and is served but not indexed", async () => {
  const t = await testEnv(PROD);
  const res = await t.api("GET", `/agents?role=${agent.role}`);
  assert.equal(res.status, 200);
  assert.match(String(res.body), /<meta name="robots" content="noindex, follow" \/>/, "a filter of /agents, not its own page for search (17 Nov 2026)");
  assert.match(String(res.body), new RegExp(`<link rel="canonical" href="https://agents\\.test/agents\\?role=${agent.role}" />`));
  assert.match(String(res.body), new RegExp(`/agents/${agent.id}`));
  // Structured data: the role's agents as a list, and the way back to all agents.
  const ld = [...String(res.body).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const list = ld.find(d => d["@type"] === "CollectionPage")?.mainEntity;
  assert.equal(list?.["@type"], "ItemList");
  assert.ok(list.itemListElement.some((i: { url: string }) => i.url === `https://agents.test/agents/${agent.id}`));
  assert.ok(ld.some(d => d["@type"] === "BreadcrumbList"));
  assert.match(String(res.body), new RegExp(`<h2><a href="/agents/${agent.id}">`), "each agent gets its own section with what it makes");
});

test("the home page's plain HTML lists the agents to start with and how it works", async () => {
  const t = await testEnv(PROD);
  const html = String((await t.api("GET", "/")).body);
  assert.match(html, /<h2>Agents to start with<\/h2><ul><li><a href="\/agents\/[a-z0-9-]+">/);
  assert.match(html, /<h2>How it works<\/h2><ol>/);
});

test("production robots.txt points to the sitemap, which lists pages and every live agent, not role filters", async () => {
  const t = await testEnv(PROD);
  const robots = await t.api("GET", "/robots.txt");
  assert.match(robots.body, /Disallow: \/api\//);
  assert.match(robots.body, /^Allow: \/api\/agents$/m, "crawlers may load the agent data the pages draw from");
  assert.match(robots.body, /Sitemap: https:\/\/agents\.test\/sitemap\.xml/);
  const data = await t.api("GET", `/api/agents/${agent.id}`);
  assert.equal(data.res.headers.get("x-robots-tag"), "noindex", "the JSON itself is never listed");
  const map = await t.api("GET", "/sitemap.xml");
  assert.equal(map.status, 200);
  assert.match(map.res.headers.get("content-type") ?? "", /application\/xml/);
  const locs = [...String(map.body).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.ok(locs.includes("https://agents.test/"));
  assert.ok(locs.includes(`https://agents.test/agents/${agent.id}`));
  assert.ok(!locs.some(l => l.includes("?role=")), "role filters are not indexed, so not listed");
  assert.equal(locs.filter(l => /\/agents\/[a-z0-9-]+$/.test(l)).length, live.length);
});

test("llms.txt describes the site and lists every agent", async () => {
  const t = await testEnv(PROD);
  const res = await t.api("GET", "/llms.txt");
  assert.equal(res.status, 200);
  assert.match(res.body, /^# AI Blocks agents/);
  assert.match(res.body, new RegExp(`\\[${agent.name}, ${agent.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]\\(https://agents\\.test/agents/${agent.id}\\)`));
});

test("text helpers escape HTML and cut at a word", () => {
  assert.equal(esc(`<a href="x">Tom & 'Jo'</a>`), "&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jo&#39;&lt;/a&gt;");
  assert.equal(clip("short", 10), "short");
  const cut = clip("one two three four five six seven", 20);
  assert.ok(cut.length <= 20 && cut.endsWith("…"), cut);
});

test("every role page title fits in 65 characters", async () => {
  const { roleTitle } = await import("../src/modules/directory/titles.ts");
  const { listRoles } = await import("../src/modules/directory/roles.ts");
  const long = listRoles().map(r => roleTitle(r.name)).filter(t => t.length > 65);
  assert.deepEqual(long, []);
  assert.equal(roleTitle("Bookkeeper"), "Bookkeeper AI agents, free | AI Blocks");
});

test("an agent's plain page says what the app says: the work line, the tasks, what it brings and real download links", async () => {
  const t = await testEnv(PROD);
  // An agent in a role with a toolbox, so both new sections have something to say.
  const { roleToolboxFile } = await import("../src/modules/directory/toolbox.ts");
  const roles = roleToolboxFile().roles;
  const withBox = live.find(p => p.role && roles[p.role]?.tasks.length);
  if (!withBox) return;
  const html = String((await t.api("GET", `/agents/${withBox.id}`)).body);
  const page = html.slice(html.indexOf('<div id="app">'), html.indexOf('id="boot"'));
  const profile = (await t.api("GET", `/api/agents/${withBox.id}`)).body.agent;
  // The line under the title, word for word what the card and the profile show.
  assert.ok(profile.does && page.includes(`<strong>${esc(profile.does.label)}`), "the work line is in the page");
  for (const thing of profile.does.things) assert.ok(page.includes(esc(thing)), thing);
  // Every task and every item the app lists, with the same counts and the same links.
  assert.ok(page.includes(`<h2>What ${esc(withBox.name)} can do</h2>`) && page.includes(`<h2>What ${esc(withBox.name)} brings</h2>`));
  for (const task of profile.tasks) assert.ok(page.includes(`<li>${esc(task.task)}</li>`), task.task);
  for (const group of profile.brings) {
    assert.ok(page.includes(`<h3>${esc(group.label)}: ${group.items.length}</h3>`), `${group.label} count`);
    for (const item of group.items) {
      const href = item.file ? `/agents/${withBox.id}/files/${item.file}` : item.href;
      assert.ok(page.includes(href ? `<a href="${esc(href)}">${esc(item.name)}</a>` : `<li>${esc(item.name)}</li>`), item.name);
    }
  }
  // What a visitor reads names no file path: paths only sit inside link addresses.
  const read = page.replace(/<a href="[^"]*">/g, "<a>").replace(/<img [^>]*>/g, "");
  assert.doesNotMatch(read, /SKILL\.md|skills\/|prompts\/|workflows\//);
  // "Download ... from this page" used to have no link to download.
  assert.ok(page.includes(`href="/packs/${withBox.id}.txt"`) && page.includes(`href="/packs/${withBox.id}.zip"`), "the download links are real");
  assert.doesNotMatch(page, /\$\d|price|beta|reviewed by (a|our) /i);
});

test("the home page has a search form that works without scripts, and a search page lists the matches in the app's order", async () => {
  const t = await testEnv(PROD);
  const home = String((await t.api("GET", "/")).body);
  assert.match(home, /<form action="\/agents" method="get" role="search">/);
  assert.match(home, /<input id="seo-q" name="q" type="search"/);
  const q = "I need a landing page for my shop";
  const search = await t.api("GET", `/agents?q=${encodeURIComponent(q)}`);
  assert.equal(search.status, 200);
  const html = String(search.body);
  assert.match(html, /<meta name="robots" content="noindex, follow" \/>/);
  assert.ok(html.includes(`<h1>AI agents for &quot;${esc(q)}&quot;</h1>`) || html.includes(`<h1>AI agents for "${esc(q)}"</h1>`));
  const api = (await t.api("GET", `/api/agents?q=${encodeURIComponent(q)}`)).body;
  assert.ok(api.agents.length > 0, "the request finds agents");
  const listed = [...html.matchAll(/<li><a href="\/agents\/([a-z0-9-]+)">/g)].map(m => m[1]);
  assert.deepEqual(listed, api.agents.slice(0, 40).map((a: any) => a.id), "same agents, same order as the app");
  // Each line says what the agent does, so nobody has to open a profile to learn it only audits.
  assert.match(html, /(Makes|Plans and briefs|Reviews and advises): /);
});

test("public pages are kept at the edge for a few minutes, and share links and misses are not", async () => {
  const store = new Map<string, Response>();
  const fake = { match: async (k: Request) => store.get(k.url)?.clone(), put: async (k: Request, r: Response) => { store.set(k.url, r); } };
  (globalThis as any).caches = { default: fake };
  try {
    const t = await testEnv(PROD);
    const first = await t.api("GET", "/agents");
    assert.equal(first.status, 200);
    assert.equal(first.res.headers.get("x-edge-cache"), "miss");
    await t.settle();
    const [key, kept] = [...store.entries()][0]!;
    assert.match(key, /\/agents\?__shell=[a-z0-9]+$/, "the key carries the shell fingerprint");
    assert.equal(kept.headers.get("cache-control"), "public, max-age=300");
    const second = await t.api("GET", "/agents");
    assert.equal(second.res.headers.get("x-edge-cache"), "hit");
    assert.equal(second.res.headers.get("cache-control"), "public, max-age=0, must-revalidate", "browsers still check every time");
    assert.equal(second.body, first.body);
    await t.api("GET", "/agents/no-such-agent-here");
    await t.api("GET", `/agents/${agent.id}?via=someone`);
    await t.settle();
    assert.equal(store.size, 1, "a 404 and a share link are never stored");
  } finally { delete (globalThis as any).caches; }
});

test("/e-commerce has its own head tags, plain content for crawlers and the team, and is in the sitemap", async () => {
  forgetVerticals();
  const t = await testEnv(PROD);
  const res = await t.api("GET", ECOMMERCE_PATH);
  assert.equal(res.status, 200);
  assert.equal(res.res.headers.get("x-robots-tag"), null);
  const html = String(res.body);
  assert.match(html, /<title>AI agents for e-commerce stores \| AI Blocks<\/title>/);
  assert.ok(html.includes(`<meta name="description" content="${esc(ECOMMERCE_DESCRIPTION)}" />`));
  assert.ok(ECOMMERCE_DESCRIPTION.length <= 160);
  assert.match(html, /<link rel="canonical" href="https:\/\/agents\.test\/e-commerce" \/>/);
  assert.match(html, /<meta name="robots" content="index, follow/);
  assert.match(html, /<meta property="og:title" content="AI agents for e-commerce stores \| AI Blocks" \/>/);
  assert.match(html, /<meta property="og:url" content="https:\/\/agents\.test\/e-commerce" \/>/);
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  // The team as an ItemList, so an answer engine can name the agent for each store job.
  assert.match(html, /"mainEntity":\{"@type":"ItemList","numberOfItems":\d+,"itemListElement":\[\{"@type":"ListItem","position":1,"url":"https:\/\/agents\.test\/agents\//);
  for (const p of ["/agents", "/guides", "/connect"]) assert.match(String((await t.api("GET", p)).body), /<script type="application\/ld\+json">/, `${p} carries structured data`);
  assert.match(html, /<h1>AI agents for your online store<\/h1>/);
  assert.ok(html.includes('<a href="/guides/use-an-agent-pack">') && html.includes('<a href="/connect">'), "how to start links to the guide and the connect page");
  // The team: the same agents, in the same order, the app asks for; the page carries that answer.
  const boot = JSON.parse(html.match(/<script type="application\/json" id="boot">([\s\S]*?)<\/script>/)![1]);
  const api = (await t.api("GET", "/api/agents?vertical=ecommerce")).body;
  assert.deepEqual(boot["/api/agents?vertical=ecommerce"], api);
  const page = html.slice(html.indexOf('<div id="app">'), html.indexOf('id="boot"'));
  const listed = [...page.matchAll(/<li><a href="\/agents\/([a-z0-9-]+)">/g)].map(m => m[1]);
  // Listed stage by stage (team-stages.ts): every team agent once, the lead first.
  assert.deepEqual([...listed].sort(), api.agents.map((a: { id: string }) => a.id).sort(), "every team agent, once");
  if (api.agents.length) assert.equal(listed[0], api.agents[0].id, "the lead first");
  for (const st of api.stages) assert.ok(page.includes(`<h3>${esc(st.label)}</h3>`), `stage heading ${st.label}`);
  if (api.agents.length) assert.ok(page.includes(`${esc(api.agents[0].name)}, ${esc(api.agents[0].title)}, leads the team.`));
  // No library built here: a calm note, and nothing in boot for the app to mistake for one.
  assert.ok(page.includes("The library is on its way."));
  assert.equal(boot["/api/knowledge/ecommerce"], undefined);
  // No prices for AI Blocks and no dollar figures; agents may still talk about a store's own prices (Douglas, Akosua).
  assert.doesNotMatch(page, /\$\d|our price|pricing plan|beta|—/i);
  // Found from /agents and the sitemap, and named in llms.txt.
  assert.ok(String((await t.api("GET", "/agents")).body).includes('<a href="/e-commerce">Run an online store? Meet the e-commerce team</a>'));
  const locs = [...String((await t.api("GET", "/sitemap.xml")).body).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.ok(locs.includes("https://agents.test/e-commerce"));
  assert.match((await t.api("GET", "/llms.txt")).body, /\[E-commerce team\]\(https:\/\/agents\.test\/e-commerce\)/);
});

test("/e-commerce carries the library's totals once it is built: the same answer as the API, modules with cards only", async () => {
  forgetVerticals();
  const vertical = JSON.parse(readFileSync(new URL("../knowledge/ecommerce/vertical.json", import.meta.url), "utf8")) as Vertical;
  const source: Source = { id: "S0001", title: "Source one", author: "A practitioner", url: "https://example.org/s1", date: "2026-06-01", rights: "public_reference", tier: 3, modules: ["MCR"], why: "Numbers.", cards: 1, public: true };
  const card: Card = {
    id: "MCR-0001", modules: ["MCR"], topics: [], claim: "Test 3 to 5 new hooks per concept each week at under 10k a month in ad spend.",
    body: `Creative fatigue sets in fast at low spend. ${Array.from({ length: 70 }, (_, i) => `spend${i % 7}`).join(" ")}`, conditions: "Under 10k a month in Meta spend.", fails_when: "Above 50k a month.",
    scope: "growth", tier: 3, numbers: ["3 to 5 hooks per concept"], asks: ["how many new ads should we test each week"], platforms: [], platform: [], jurisdiction: [], marketplace: [], mode: "",
    source: "S0001", evidence: { where: "minute 12" }, strength: "stated_by_practitioner", public: true,
  };
  const index = verticalBundle(vertical, [card], [source]).index;
  const assets = { fetch: async (req: Request) => new URL(req.url).pathname === "/packs/knowledge/ecommerce/index.json"
    ? new Response(JSON.stringify(index), { headers: { "content-type": "application/json" } })
    : ASSETS.fetch(req) };
  try {
    const t = await testEnv({ ...PROD, ASSETS: assets as unknown as Fetcher });
    const html = String((await t.api("GET", ECOMMERCE_PATH)).body);
    const boot = JSON.parse(html.match(/<script type="application\/json" id="boot">([\s\S]*?)<\/script>/)![1]);
    const api = await t.api("GET", "/api/knowledge/ecommerce");
    assert.equal(api.status, 200);
    assert.deepEqual(boot["/api/knowledge/ecommerce"], api.body, "the page carries what /api/knowledge/ecommerce returns");
    const page = html.slice(html.indexOf('<div id="app">'), html.indexOf('id="boot"'));
    assert.ok(page.includes("<p>1 card from 1 source. "), "the totals");
    assert.ok(page.includes("<li>Paid social creative: 1 card</li>"), "a module with cards, in plain words");
    assert.ok(!page.includes("Landing pages:"), "modules with no cards are left out");
    assert.match(page, /trust level from 1 to 4/);
  } finally { forgetVerticals(); clearShellCache(); }
});

test("shelf pages that repeat a library page are not indexed: every mind, and tools with a library guide", () => {
  const base = { slug: "x", title: "X", summary: "", stage: "", agents: [], path: "" };
  assert.equal(indexedShelfItem("minds", { ...base, identity: "", area: "", questions: [], library: "https://useaiblocks.com/minds/x" } as never), false);
  assert.equal(indexedShelfItem("tools", { ...base, guide: "canva" } as never), false, "the library's /ai-tools/canva is the page");
  assert.equal(indexedShelfItem("tools", { ...base, guide: null } as never), true, "a store-only tool is its own page");
  assert.equal(indexedShelfItem("prompts", base as never), true);
  assert.equal(indexedShelfItem("skills", base as never), true);
});
