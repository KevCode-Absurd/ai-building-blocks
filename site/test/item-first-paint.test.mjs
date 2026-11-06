// The item-page first-paint step (tools/lib/item-first-paint.mjs), run on a built-like page made from index.html.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { itemCriticalCss, patchItemFirstPaint, selectRules, FULL_CSS_ATTR } from "../../tools/lib/item-first-paint.mjs";
import { contentFingerprint } from "../scripts/lib/content-stamps.mjs";
import { pageShell } from "../scripts/lib/page-shell.mjs";

const cssHref = "/assets/main-Test123.css";
const css = ":root{--bg:#fafafa}:root[data-theme=dark]{--bg:#0a0a0a}body{margin:0}.wrap{max-width:1200px}.header{display:flex}.header-in{gap:8px}.brand{font-weight:600}"
  + ".site-menu-trigger{padding:8px}.btn{border-radius:99px}.bp-h1{font-size:34px}.bp-sub{font-size:15px}.card{color:red}.composer textarea{width:100%}"
  + "@media (max-width:600px){.bp-h1{font-size:30px}.card{color:blue}}@font-face{font-family:X;src:url(x.woff2)}";
const supportCss = fs.readFileSync("public/support-chat.css", "utf8");

/** index.html as prerender leaves an item page: built entry and stylesheet, and a cover picture of the heading. */
function builtItemPage() {
  const shell = pageShell({ logo: "<svg></svg>", h1: "Product description writer", body: '<p class="bp-sub">Write a product description.</p>' });
  return fs.readFileSync("index.html", "utf8")
    .replace('<script type="module" src="/src/main.tsx"></script>', '<script type="module" crossorigin src="/assets/main-Test123.js"></script>')
    .replace("  </head>", `<link rel="stylesheet" crossorigin href="${cssHref}">\n  </head>`)
    .replace(/(<div id="app-loader"[^>]*>)/, `$1${shell}`)
    .replace('<div id="root"></div>', '<div id="root"><main><h1 class="bp-h1">Product description writer</h1><p>Real content.</p></main></div>');
}

test("the cover keeps only the complete rules it uses, with their media blocks", () => {
  const out = selectRules(css);
  assert.match(out, /\.bp-h1\{font-size:34px\}/);
  assert.match(out, /:root\[data-theme=dark\]\{--bg:#0a0a0a\}/, "dark theme colours come along");
  assert.match(out, /@media \(max-width:600px\)\{\.bp-h1\{font-size:30px\}\}/);
  assert.doesNotMatch(out, /\.card|composer|@font-face/);
  assert.throws(() => itemCriticalCss(".card{color:red}"), /lost/);
});

test("a built item page paints its cover from inline rules and starts the app after that paint", () => {
  const before = builtItemPage(), critical = itemCriticalCss(css);
  const after = patchItemFirstPaint(before, { critical, cssHref, supportCss });
  assert.ok(after.includes(`<style data-item-critical>${critical}</style>`));
  assert.ok(after.includes(`<link rel="stylesheet" crossorigin href="${cssHref}" media="print" ${FULL_CSS_ATTR}>`), "full stylesheet does not block the first paint");
  assert.ok(after.includes(`<noscript ${FULL_CSS_ATTR}><link rel="stylesheet" crossorigin href="${cssHref}"></noscript>`), "readers without scripts still get styles");
  assert.ok(after.includes('<link rel="modulepreload" crossorigin href="/assets/main-Test123.js" fetchpriority="low" data-item-entry>'));
  assert.doesNotMatch(after, /<script type="module" crossorigin src=/, "the app no longer starts from the head");
  assert.match(after, /<script type="module" data-item-enhancement>[\s\S]*requestAnimationFrame\(\(\)=>requestAnimationFrame/);
  assert.doesNotMatch(after, /<script defer src="\/support-chat\.js"><\/script>/, "the help widget starts after the first paint");
  assert.match(after, /<style data-item-support-critical>\n#abb-support \{/);
  // The swap waits for both the app and the full stylesheet, and only the page's own stylesheet failing is fatal.
  assert.match(after, /if \(!itemAppReady \|\| !itemCssReady \|\| itemRevealed\) return;/);
  assert.match(after, /event\.target\.rel === "stylesheet" && event\.target\.hasAttribute\("data-item-full-css"\)/);
  const readyLines = html => html.split('document.documentElement.dataset.boot = "ready";').length;
  assert.equal(readyLines(after), readyLines(before), "the handler is wrapped, not duplicated or dropped");
  assert.equal(patchItemFirstPaint(after, { critical, cssHref, supportCss }), after, "running it again changes nothing");
  // Loading changes are not content: sitemap dates and search pings stay put.
  assert.equal(contentFingerprint(after), contentFingerprint(before));
});

test("the build runs the step after the home page step and before content stamps", () => {
  const build = JSON.parse(fs.readFileSync("package.json", "utf8")).scripts.build;
  const home = build.indexOf("build-home-initial-shell.mjs"), item = build.indexOf("build-item-first-paint.mjs"), stamp = build.indexOf("stamp-content.mjs");
  assert.ok(home > 0 && home < item && item < stamp);
});
