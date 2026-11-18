import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { clearShellCache, shellVersion } from "../src/pages.ts";
import { testEnv } from "./helpers.ts";

const PATH = "/assets/index-test_123.css";
const LINK = `<link rel="stylesheet" crossorigin href="${PATH}">`;
const document = (link = LINK) => `<!doctype html><html><head><meta name="viewport" content="width=device-width"><title>Old</title>${link}<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" crossorigin><script type="module" crossorigin src="/assets/index-test.js"></script></head><body><div id="app"></div></body></html>`;

function assets(link: string, cssResponse: () => Response | Promise<Response>) {
  const requests: string[] = [];
  return {
    requests,
    binding: { fetch: async (req: Request) => {
      const pathname = new URL(req.url).pathname;
      requests.push(pathname);
      if (pathname === "/") return new Response(document(link), { headers: { "content-type": "text/html" } });
      if (pathname === PATH) return cssResponse();
      return new Response("not found", { status: 404 });
    } } as unknown as Fetcher,
  };
}

beforeEach(clearShellCache);

test("public pages inline the exact trusted built CSS, retain metadata/scripts/fonts, and reuse the shell cache", async () => {
  const css = `@font-face{font-family:Store;src:url('/fonts/store.woff2')}body{color:#123}.icon{background:url("data:image/svg+xml,%3Csvg%3E%3C/svg%3E")}.price:after{content:"$&"}`;
  const fixture = assets(LINK, () => new Response(css, { headers: { "content-type": "text/css; charset=utf-8" } }));
  const t = await testEnv({ APP_ENV: "production", ASSETS: fixture.binding });
  const page = await t.api("GET", "/connect");
  assert.equal(page.status, 200);
  assert.ok(String(page.body).includes(`<style data-built-stylesheet="${PATH}">${css}</style>`));
  assert.ok(!String(page.body).includes(LINK));
  assert.match(String(page.body), /<meta name="robots" content="index, follow/);
  assert.match(String(page.body), /<link rel="canonical" href="https:\/\/agents\.test\/connect"/);
  assert.ok(String(page.body).includes('<script type="module" crossorigin src="/assets/index-test.js"></script>'));
  assert.ok(String(page.body).includes('<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" crossorigin>'));
  const version = await shellVersion(t.env, new URL("https://agents.test/connect"));
  const other = await t.api("GET", "/guides");
  assert.equal(other.status, 200);
  assert.deepEqual(fixture.requests, ["/", PATH]);
  assert.equal(await shellVersion(t.env, new URL("https://agents.test/guides")), version);
});

test("unsupported link semantics retain the original link and never fetch an untrusted stylesheet", async () => {
  for (const link of [
    `<link rel="stylesheet" href="https://example.test${PATH}">`,
    '<link rel="stylesheet" href="/assets/../private.css">',
    `<link rel="stylesheet" href="${PATH}?v=1">`,
    `<link rel="stylesheet" href="${PATH}" integrity="sha256-keep">`,
    `<link rel="stylesheet" href="${PATH}" media="print">`,
    `<link rel="stylesheet" href="${PATH}" disabled>`,
    `<link rel="stylesheet" href="${PATH}" crossorigin="use-credentials">`,
    `<link rel="stylesheet" href="${PATH}" href="/assets/other.css">`,
  ]) {
    clearShellCache();
    const fixture = assets(link, () => { throw Error("Must not fetch"); });
    const t = await testEnv({ ASSETS: fixture.binding });
    const page = await t.api("GET", "/connect");
    assert.equal(page.status, 200);
    assert.ok(String(page.body).includes(link), link);
    assert.deepEqual(fixture.requests, ["/"], link);
  }
});

test("failed, non-CSS or unsafe stylesheet responses fall back without changing CSS meaning or HTML boundaries", async () => {
  const fallback = [
    () => new Response("missing", { status: 404, headers: { "content-type": "text/css" } }),
    () => new Response("<html>SPA fallback</html>", { headers: { "content-type": "text/html" } }),
    () => new Response('body{color:red}</StYlE><script>alert(1)</script>', { headers: { "content-type": "text/css" } }),
    () => new Response("body{background:url('../image.png')}", { headers: { "content-type": "text/css" } }),
    () => new Response("@import '/assets/later.css';body{color:red}", { headers: { "content-type": "text/css" } }),
    () => new Response(String.raw`body{background:\75rl(../image.png)}`, { headers: { "content-type": "text/css" } }),
    () => new Response("body{}".repeat(22000), { headers: { "content-type": "text/css" } }),
    () => { throw Error("Asset unavailable"); },
  ];
  for (const response of fallback) {
    clearShellCache();
    const fixture = assets(LINK, response);
    const t = await testEnv({ ASSETS: fixture.binding });
    const page = await t.api("GET", "/connect");
    assert.equal(page.status, 200);
    assert.ok(String(page.body).includes(LINK));
    assert.ok(!String(page.body).includes("data-built-stylesheet"));
    assert.ok(!String(page.body).includes("alert(1)"));
  }
});

test("an anonymous same-origin link can use another attribute order without changing its styles", async () => {
  const css = "body{color:#456}";
  const fixture = assets(`<link href='${PATH}' crossorigin='anonymous' rel='stylesheet' />`, () => new Response(css, { headers: { "content-type": "TEXT/CSS" } }));
  const t = await testEnv({ ASSETS: fixture.binding });
  const page = await t.api("GET", "/connect");
  assert.ok(String(page.body).includes(`<style data-built-stylesheet="${PATH}">${css}</style>`));
});
