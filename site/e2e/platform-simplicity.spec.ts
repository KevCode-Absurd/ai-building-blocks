import { test, expect } from "@playwright/test";
import { mockComposerAccount } from "./fixtures/composer-account";
import { build } from "esbuild";
test.setTimeout(90000);

test("signed-in home shows its public first screen while private saved work is still loading", async ({ page }) => {
  await mockComposerAccount(page, true, "alice", "alice");
  let release!: () => void;
  let libraryRequested = false;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/library", async route => { libraryRequested = true; await held; await route.fulfill({ json: { data: {}, revision: 0 } }); });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect.poll(() => libraryRequested).toBe(true);
    await expect(page.locator("#top .hero h1", { hasText: "Use AI like the top 1%" })).toBeVisible();
    await expect(page.locator("#app-loader")).toHaveCount(0);
    await expect(page.getByTestId("library-search")).toBeEnabled();
    await expect(page.getByText("Saved to your account.", { exact: true })).toHaveCount(0);
    await page.screenshot({ path: test.info().outputPath("signed-in-library-loading.png") });
  } finally { release(); }
  await expect(page.locator("#top .hero h1", { hasText: "Use AI like the top 1%" })).toBeVisible();
  await page.getByTestId("menu-btn").click();
  await expect(page.getByRole("navigation", { name: "Sections", exact: true })).toContainText("Signed in");
  await expect(page.getByTestId("open-saved-work")).toBeVisible();
  await expect(page.locator("[data-prerendered]")).toHaveCount(0);
  await expect(page.locator("#app-loader")).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("signed-in-library-ready.png") });
});

test("a failed catalogue can be retried without a reload", async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  let blocked = true;
  await page.route("**/data/blocks.json", route => blocked ? route.fulfill({ status: 503, body: "Unavailable" }) : route.continue());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("The task library could not load. Check your connection and try again.", { exact: true })).toBeVisible();
  const pageStarted = await page.evaluate(() => performance.timeOrigin);
  blocked = false;
  await page.getByRole("button", { name: /^Try (again|the full library again)$/ }).click();
  await expect(page.getByTestId("library-search")).toBeVisible();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(pageStarted);
});

test("route navigation and same-page anchors place keyboard focus at the destination", async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("menu-btn")).toBeVisible();
  await page.getByTestId("menu-btn").click();
  await page.getByRole("navigation", { name: "Sections", exact: true }).getByRole("link", { name: "How to use AI Blocks", exact: true }).click();
  await expect(page.locator("main h1")).toBeFocused();
  await page.getByTestId("menu-btn").click();
  await page.getByRole("navigation", { name: "Sections", exact: true }).getByRole("link", { name: "Find a task", exact: true }).click();
  await expect(page.locator("#library")).toBeFocused();
  await page.goBack();
  await expect(page.locator("main h1")).toBeFocused();
});

test("home shows every format while search waits for the complete library", async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/data/blocks.json", async route => { await held; await route.continue(); });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('.library-formats-loading a[href="/?kind=skill#library"]')).toBeVisible();
    const search = page.getByTestId("library-search");
    await expect(search).toBeDisabled();
    await expect(page.locator('.library-formats-loading a')).toHaveCount(6);
    release(); await expect(search).toBeEnabled();
  } finally { release(); }
});

test("isolated router focuses delayed content and cancels focus when the person continues", async ({ page }) => {
  const bundled = await build({ entryPoints: ["src/lib/router.tsx"], bundle: true, write: false, format: "iife", globalName: "routerFixture", platform: "browser" });
  await page.route("http://router.test/**", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><main><h1>Home</h1><button id="continue">Keep working</button><section id="library">Library</section></main>' }));
  await page.goto("http://router.test/");
  await page.addScriptTag({ content: bundled.outputFiles[0].text });
  await page.evaluate(() => {
    (window as any).routerFixture.navigate("/later");
    setTimeout(() => { document.querySelector("h1")!.outerHTML = "<h1>New task</h1>"; }, 30);
  });
  await expect(page.getByRole("heading", { name: "New task" })).toBeFocused();
  await page.evaluate(() => (window as any).routerFixture.navigate("/later#library"));
  await expect(page.locator("#library")).toBeFocused();
  await page.evaluate(() => { document.getElementById("library")!.outerHTML = '<section id="library">Full library ready</section>'; });
  await expect(page.locator("#library")).toBeFocused();
  await page.evaluate(() => {
    (window as any).routerFixture.navigate("/another");
    const button = document.getElementById("continue")!;
    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); button.focus();
    setTimeout(() => { document.querySelector("h1")!.outerHTML = "<h1>Another task</h1>"; }, 30);
  });
  await expect(page.getByRole("heading", { name: "Another task" })).toBeVisible();
  await expect(page.locator("#continue")).toBeFocused();
});

test("isolated catalogue hook recovers a failed request and keeps entered work", async ({ page }) => {
  const bundled = await build({ stdin: { resolveDir: process.cwd(), loader: "tsx", contents: `
    import { createElement, useState } from 'react';
    import { createRoot } from 'react-dom/client';
    import { useCatalogueState } from './src/lib/data.ts';
    function App() { const state = useCatalogueState(); const [text,setText] = useState('');
      return createElement('main', null,
        createElement('input', { 'aria-label':'Your notes', value:text, onChange:e=>setText(e.target.value) }),
        state.error && createElement('p', {role:'alert'}, state.error),
        state.error && createElement('button', {onClick:state.retry}, 'Try again'),
        state.catalogue && createElement('p', null, state.catalogue.blocks.length + ' tasks ready'));
    } createRoot(document.getElementById('root')).render(createElement(App));
  ` }, alias: { react: "preact/compat", "react-dom/client": "preact/compat/client" }, bundle: true, write: false, format: "iife", platform: "browser" });
  let blocked = true;
  await page.route("https://catalogue.test/**", route => new URL(route.request().url()).pathname === "/data/blocks.json"
    ? route.fulfill({ status: blocked ? 503 : 200, contentType: "application/json", body: JSON.stringify({ built: "fixture", renamed: {}, portTypes: {}, blocks: [{ slug: "sample-task", name: "Sample" }] }) })
    : route.fulfill({ contentType: "text/html", body: '<!doctype html><div id="root"></div>' }));
  await page.goto("https://catalogue.test/"); await page.addScriptTag({ content: bundled.outputFiles[0].text });
  await expect(page.getByRole("alert")).toContainText("task library could not load");
  await page.getByRole("textbox", { name: "Your notes" }).fill("Keep my work");
  blocked = false; await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.getByText("1 tasks ready", { exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Your notes" })).toHaveValue("Keep my work");
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("isolated starter catalogue opens reviewed tasks before full search becomes ready", async ({ page }) => {
  const bundled = await build({ stdin: { resolveDir: process.cwd(), loader: "tsx", contents: `
    import { createElement } from 'react'; import { createRoot } from 'react-dom/client';
    import { useCatalogueState } from './src/lib/data.ts';
    function App() { const state = useCatalogueState(true, {starterFirst:true});
      return createElement('main', null, createElement('p', null, state.complete ? 'Full search ready' : 'Full search loading'),
        state.starterCatalogue && createElement('p', null, state.starterCatalogue.blocks.length + ' starter tasks ready'),
        state.catalogue && createElement('p', null, state.catalogue.blocks.length + ' full tasks ready'));
    } createRoot(document.getElementById('root')).render(createElement(App));
  ` }, alias: { react: "preact/compat", "react-dom/client": "preact/compat/client" }, bundle: true, write: false, format: "iife", platform: "browser" });
  const fs = await import("node:fs/promises");
  const starter = JSON.parse(await fs.readFile("public/data/starter-blocks.json", "utf8"));
  let starterAvailable = true;
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("https://starter.test/**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/data/starter-blocks.json") return route.fulfill({ status: starterAvailable ? 200 : 404, contentType: "application/json", body: JSON.stringify(starter) });
    if (path === "/data/blocks.json") { await held; return route.fulfill({ contentType: "application/json", body: JSON.stringify({ ...starter, starter: undefined, blocks: [...starter.blocks, { slug: "another-task", name: "Another" }] }) }); }
    return route.fulfill({ contentType: "text/html", body: '<!doctype html><div id="root"></div>' });
  });
  try {
    await page.goto("https://starter.test/"); await page.addScriptTag({ content: bundled.outputFiles[0].text });
    await expect(page.getByText("4 starter tasks ready", { exact: true })).toBeVisible();
    await expect(page.getByText("Full search loading", { exact: true })).toBeVisible();
    await expect(page.getByText("Full search ready", { exact: true })).toHaveCount(0);
    release();
    await expect(page.getByText("Full search ready", { exact: true })).toBeVisible();
    await expect(page.getByText("5 full tasks ready", { exact: true })).toBeVisible();
    starterAvailable = false;
    await page.reload(); await page.addScriptTag({ content: bundled.outputFiles[0].text });
    await expect(page.getByText("5 full tasks ready", { exact: true })).toBeVisible();
    await expect(page.getByText("4 starter tasks ready", { exact: true })).toHaveCount(0);
  } finally { release(); }
});

test("public measurement emits only approved enums and stays quiet after private navigation", async ({ page }) => {
  const analytics = await import("node:fs/promises").then(fs => fs.readFile("public/analytics.js", "utf8"));
  // Exercise the production-host gate without contacting either provider.
  await page.route("https://www.googletagmanager.com/**", route => route.fulfill({ contentType: "text/javascript", body: "/* provider mocked */" }));
  await page.route("https://www.clarity.ms/**", route => route.fulfill({ contentType: "text/javascript", body: "/* provider mocked */" }));
  await page.route("https://useaiblocks.com/**", route => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Public task</title><main><h1>Task</h1></main>" }));
  await page.goto("https://useaiblocks.com/");
  await page.addScriptTag({ content: analytics });
  await page.evaluate(() => document.dispatchEvent(new CustomEvent("abb:ux-event", { detail: "task_started" })));
  expect(await page.evaluate(() => (window as any).dataLayer || [])).toEqual([]);
  await page.getByRole("button", { name: "Accept cookies", exact: true }).click();
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent("abb:ux-event", { detail: { name: "request_copied", text: "private sample" } }));
    document.dispatchEvent(new CustomEvent("abb:ux-event", { detail: "task_started" }));
    document.dispatchEvent(new CustomEvent("abb:ux-event", { detail: "request_copied" }));
    history.pushState(null, "", "/compose?goal=private-sample");
    document.dispatchEvent(new CustomEvent("abb:ux-event", { detail: "request_copied" }));
  });
  const events = await page.evaluate(() => (window as any).dataLayer.map((args: any) => [...args]).filter((args: any) => args[0] === "event"));
  expect(events.map((args: any) => args[1])).toEqual(["page_view", "task_started", "request_copied"]);
  expect(JSON.stringify(events)).not.toContain("private");
});
