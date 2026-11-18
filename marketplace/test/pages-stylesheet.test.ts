import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { clearShellCache, pageResponse, shellVersion } from "../src/pages.ts";
import { testEnv } from "./helpers.ts";

const LINK = '<link rel="stylesheet" crossorigin href="/assets/index-test_123.css">';
const SCRIPT = '<script type="module" crossorigin src="/assets/index-test.js"></script>';
const FONT = '<link rel="preload" href="/fonts/space-grotesk.woff2" as="font" crossorigin>';
const document = (link = LINK) => `<!doctype html><html><head><meta name="viewport" content="width=device-width"><title>Old</title>${link}${FONT}${SCRIPT}</head><body><div id="app"></div></body></html>`;

function assets(link = LINK) {
  const requests: string[] = [];
  return {
    requests,
    binding: { fetch: async (req: Request) => {
      requests.push(req.url);
      return new URL(req.url).pathname === "/"
        ? new Response(document(link), { headers: { "content-type": "text/html" } })
        : new Response("not found", { status: 404 });
    } } as unknown as Fetcher,
  };
}

beforeEach(clearShellCache);

test("pages retain external assets and share an unchanged built shell across route orders", async () => {
  const versions = [];
  for (const routes of [["/connect", "/guides"], ["/guides", "/connect"]]) {
    clearShellCache();
    const fixture = assets();
    const t = await testEnv({ APP_ENV: "production", ASSETS: fixture.binding });
    const version = await shellVersion(t.env, new URL("https://agents.test/connect"));
    for (const path of routes) {
      const response = await pageResponse(new Request(`https://agents.test${path}`), t.env);
      assert.equal(response!.status, 200);
      const html = await response!.text();
      for (const asset of [LINK, SCRIPT, FONT]) assert.ok(html.includes(asset));
      assert.ok(!html.includes("data-built-stylesheet"));
      assert.ok(html.includes(`<link rel="canonical" href="https://agents.test${path}"`));
      assert.match(html, /<meta name="robots" content="index, follow/);
      assert.equal(response!.headers.get("cache-control"), "public, max-age=0, must-revalidate");
      assert.equal(await shellVersion(t.env, new URL(`https://agents.test${path}`)), version);
    }
    const head = await pageResponse(new Request("https://agents.test/connect", { method: "HEAD" }), t.env);
    assert.equal(await head!.text(), "");
    assert.deepEqual(fixture.requests, ["https://agents.test/"], "rendering and fingerprinting fetch only the built shell once");
    versions.push(version);
  }
  assert.equal(versions[0], versions[1]);
});

test("shell caches are separated by origin and a changed asset name changes the version", async () => {
  const versions = [];
  for (const [origin, link] of [["https://one.test", LINK], ["https://two.test", LINK.replace("test_123", "new_456")]]) {
    const fixture = assets(link);
    const t = await testEnv({ ASSETS: fixture.binding });
    const page = await pageResponse(new Request(`${origin}/connect`), t.env);
    assert.ok((await page!.text()).includes(link));
    versions.push(await shellVersion(t.env, new URL(`${origin}/connect`)));
    assert.deepEqual(fixture.requests, [`${origin}/`]);
  }
  assert.notEqual(versions[0], versions[1]);
});
