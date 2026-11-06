// The loading cover must be the first and largest paint on item pages (see e2e/performance-loading.spec.ts for the
// behaviour on a real build). These checks keep the two pieces of the fix from drifting apart.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("the cover draws its heading and opening line in a blocking face of the preloaded Space Grotesk", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const face = html.match(/@font-face \{ font-family: "AI Blocks Shell";[^}]*\}/)?.[0];
  assert.ok(face, "index.html declares the AI Blocks Shell face");
  assert.match(face, /font-display: block/);
  assert.match(face, /url\(\/fonts\/space-grotesk\.woff2\)/, "same file as the preload, so nothing extra downloads");
  assert.match(html, /<link rel="preload" href="\/fonts\/space-grotesk\.woff2"/);
  assert.match(html, /#app-loader \.page-shell \.page-shell-h1, #app-loader \.page-shell \.bp-sub \{ font-family: "AI Blocks Shell"/);
  // The home build rewrites this exact line of the ready handler; keep it intact.
  assert.match(html, /\n {8}document\.documentElement\.dataset\.boot = "ready";\n/);
});

test("every route says it is ready through announceReady, which waits for the cover to paint", () => {
  const ready = fs.readFileSync("src/StartupReady.tsx", "utf8");
  assert.match(ready, /export function announceReady\(\)/);
  assert.match(ready, /first-contentful-paint/);
  assert.match(ready, /COVER_PAINT_CAP_MS = 1500/);
  assert.match(ready, /if \(ready\) announceReady\(\);/);
  assert.match(fs.readFileSync("src/BlockPage.tsx", "utf8"), /announceReady\(\);/);
  // Only the recovery screen may announce at once: it replaces a failed page and must show without waiting.
  const direct = fs.readdirSync("src", { recursive: true }).filter(f => /\.tsx?$/.test(f))
    .filter(f => fs.readFileSync(`src/${f}`, "utf8").includes('dispatchEvent(new Event("abb:ready"))')).map(f => f.replace(/\\/g, "/")).sort();
  assert.deepEqual(direct, ["PageRecovery.tsx", "StartupReady.tsx"]);
});
