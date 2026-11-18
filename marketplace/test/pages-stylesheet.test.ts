import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { clearShellCache, pageResponse, shellVersion } from "../src/pages.ts";
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

test("connect inlines the exact trusted built CSS, retains metadata/scripts/fonts, and reuses its separate cache", async () => {
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
  assert.ok(String(other.body).includes(LINK));
  assert.ok(!String(other.body).includes("data-built-stylesheet"));
  await t.api("GET", "/connect");
  assert.deepEqual(fixture.requests, ["/", PATH]);
  assert.equal(await shellVersion(t.env, new URL("https://agents.test/guides")), version);
});

test("connect-only styles and the raw shell fingerprint are independent of route order", async () => {
  const versions = [];
  for (const connectFirst of [false, true]) {
    clearShellCache();
    const fixture = assets(LINK, () => new Response(`body{color:${connectFirst ? "red" : "blue"}}`, { headers: { "content-type": "text/css" } }));
    const t = await testEnv({ ASSETS: fixture.binding });
    const get = async (path: string) => (await pageResponse(new Request(`https://agents.test${path}`), t.env))!;
    const version = await shellVersion(t.env, new URL("https://agents.test/connect"));
    assert.deepEqual(fixture.requests, ["/"], "fingerprinting must not fetch CSS");
    const head = await pageResponse(new Request("https://agents.test/connect", { method: "HEAD" }), t.env);
    assert.equal(await head!.text(), "");
    assert.deepEqual(fixture.requests, ["/"], "HEAD must not fetch a stylesheet for an absent body");
    if (connectFirst) await get("/connect");
    for (const path of ["/e-commerce", "/agents/lindsey", "/guides", "/sign-in"]) {
      const response = await get(path);
      const html = await response.text();
      assert.ok(html.includes(LINK), path);
      assert.ok(!html.includes("data-built-stylesheet"), path);
      assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
    }
    if (!connectFirst) assert.ok(!fixture.requests.includes(PATH), "ordinary routes must not fetch CSS");
    for (const path of ["/connect", "/connect/?from=test", "/connect"]) {
      const response = await get(path);
      assert.ok((await response.text()).includes("data-built-stylesheet"), path);
      assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
    }
    assert.deepEqual(fixture.requests.filter(path => path === "/" || path === PATH), ["/", PATH], "connect reuses its built variant across requests");
    assert.equal(await shellVersion(t.env, new URL("https://agents.test/e-commerce")), version);
    versions.push(version);
  }
  assert.equal(versions[0], versions[1], "CSS content and route order must not affect the built-shell fingerprint");
});

test("connect variants do not leak between origins", async () => {
  for (const [origin, color] of [["https://one.test", "red"], ["https://two.test", "blue"]]) {
    const fixture = assets(LINK, () => new Response(`body{color:${color}}`, { headers: { "content-type": "text/css" } }));
    const t = await testEnv({ ASSETS: fixture.binding });
    const page = await pageResponse(new Request(`${origin}/connect`), t.env);
    assert.ok((await page!.text()).includes(`<style data-built-stylesheet="${PATH}">body{color:${color}}</style>`));
    assert.deepEqual(fixture.requests, ["/", PATH]);
  }
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
