// The website's pages as the Worker sends them (src/pages.ts): head tags, plain content, boot data, 404s, robots.txt,
// sitemap.xml and llms.txt. Only production is indexed.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { testEnv } from "./helpers.ts";
import { clearShellCache, clip, esc, GUIDES } from "../src/pages.ts";
import { housePersonas } from "../src/modules/directory/index.ts";

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

test("a role page has its own title and canonical address", async () => {
  const t = await testEnv(PROD);
  const res = await t.api("GET", `/agents?role=${agent.role}`);
  assert.equal(res.status, 200);
  assert.match(String(res.body), new RegExp(`<link rel="canonical" href="https://agents\\.test/agents\\?role=${agent.role}" />`));
  assert.match(String(res.body), new RegExp(`/agents/${agent.id}`));
});

test("production robots.txt points to the sitemap, which lists pages, roles and every live agent", async () => {
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
  assert.ok(locs.includes(`https://agents.test/agents?role=${agent.role}`));
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
