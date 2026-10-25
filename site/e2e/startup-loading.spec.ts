import { test, expect, type Page } from "@playwright/test";

// The dev shell has no prerender. Give it representative public HTML so this
// regression also exercises the first paint without rebuilding the catalogue.
async function publicShell(page: Page) {
  await page.route(url => url.pathname === "/", async route => {
    const response = await route.fetch();
    let html = await response.text();
    if (!html.includes("data-prerendered")) html = html.replace('<div id="root"></div>', '<div id="root"><main data-prerendered><h1>Public task library</h1><a href="/jobs">Browse tasks by job</a></main></div>');
    await route.fulfill({ response, body: html });
  });
}

async function holdAccount(page: Page) {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/auth", async route => {
    await held;
    await route.fulfill({ json: { configured: false } });
  });
  return release;
}

test("compact home loader has no text wall and yields to the real first-screen design", async ({ page }) => {
  await publicShell(page);
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route(url => url.pathname === "/src/main.tsx" || /^\/assets\/main-[^/]+\.js$/.test(url.pathname), async route => { await held; await route.continue(); });
  try {
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator("html")).toHaveAttribute("data-boot", "loading");
    await expect(page.locator("#app-loader")).toBeVisible();
    await expect(page.locator("#root")).toBeHidden();
    await expect(page.locator(".boot-brand")).toHaveText("AI Blocks");
    await expect(page.locator(".boot-loading h1, .boot-loading p, .boot-loading a")).toHaveCount(0);
    await expect(page.locator(".boot-progress")).toBeVisible();
    expect(await page.locator(".boot-progress").evaluate(el => getComputedStyle(el).animationDuration)).toContain("0.9s");
    await expect(page.locator(".boot-mark")).toHaveCount(0);
    await expect(page.locator("[data-prerendered]")).toBeHidden();
    await page.screenshot({ path: test.info().outputPath("designed-first-screen-desktop.png") });
  } finally { release(); }
  await expect(page.getByTestId("library-search")).toBeEnabled();
  await expect(page.locator("html")).toHaveAttribute("data-boot", "ready");
  await expect(page.locator("#app-loader")).toHaveCount(0);
  await expect(page.locator("[data-prerendered]")).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("interactive-home-desktop.png") });
});

test("home headline and actions render while the decorative globe chunk is delayed", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/assets\/Globe-[^/]+\.js$/, async route => { await held; await route.continue(); });
  try {
    await page.goto("/", { waitUntil: "commit" });
    const globeRequest = page.waitForRequest(/\/assets\/Globe-[^/]+\.js$/);
    await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Start with a task/ })).toBeEnabled();
    await expect(page.getByTestId("globe")).toHaveCount(0);
    await globeRequest;
    await expect(page.getByTestId("globe")).toHaveCount(0);
  } finally { release(); }
  await expect(page.getByTestId("globe")).toBeVisible({ timeout: 10000 });
});

test("@mobile compact loader has no text wall while the app bundle is delayed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("abb:theme", "light"));
  await publicShell(page);
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route(url => url.pathname === "/src/main.tsx" || /^\/assets\/main-[^/]+\.js$/.test(url.pathname), async route => { await held; await route.continue(); });
  try {
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator("#app-loader")).toBeVisible();
    await expect(page.locator(".boot-brand")).toHaveText("AI Blocks");
    await expect(page.locator(".boot-loading h1, .boot-loading p, .boot-loading a")).toHaveCount(0);
    await expect(page.locator(".boot-progress")).toBeVisible();
    expect(await page.locator(".boot-progress").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
    await expect(page.locator(".boot-mark")).toHaveCount(0);
    await expect(page.locator("#app-loader")).toHaveCSS("background-color", "rgb(250, 250, 250)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath("designed-first-screen-mobile.png") });
  } finally { release(); }
  await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
  await expect(page.getByTestId("library-search")).toBeEnabled();
});

test("@mobile public first screen appears while account restoration is delayed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release!: () => void;
  let requested = false;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/auth", async route => { requested = true; await held; await route.fulfill({ json: { configured: false } }); });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
    await expect(page.locator("#app-loader")).toHaveCount(0);
    await expect(page.getByTestId("library-search")).toBeEnabled();
    await expect.poll(() => requested, { timeout: 5000 }).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { release(); }
});

test("a stalled account request does not delay the public homepage", async ({ page }) => {
  let requested = false;
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/auth", async route => { requested = true; await held; await route.fulfill({ json: { configured: false } }); });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Start with a task/ })).toBeEnabled();
    await expect(page.locator("#app-loader")).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("data-boot", "ready");
    await expect(page.getByTestId("library-search")).toBeEnabled();
    await expect.poll(() => requested, { timeout: 5000 }).toBe(true);
    await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
  } finally { release(); }
});

test("private account routes keep the designed loading cover until auth resolves", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("abb:theme", "light"));
  const release = await holdAccount(page);
  try {
    await page.goto("/account", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-boot", "loading");
    await expect(page.locator("#app-loader")).toBeVisible();
    await expect(page.locator("#root")).toBeHidden();
    await expect(page.locator(".boot-brand")).toHaveText("AI Blocks");
    await expect(page.locator(".boot-loading h1, .boot-loading p, .boot-loading a")).toHaveCount(0);
    await expect(page.locator(".boot-mark")).toHaveCount(0);
    await expect(page.locator("#app-loader")).toHaveCSS("background-color", "rgb(250, 250, 250)");
    await page.screenshot({ path: test.info().outputPath("private-account-loading.png") });
  } finally { release(); }
  await expect(page.getByRole("heading", { name: "Your saved work", exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-boot", "ready");
  await expect(page.locator("#app-loader")).toHaveCount(0);
});

test("no JavaScript leaves the crawlable public heading and links visible", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await publicShell(page);
    await page.goto("/");
    await expect(page.locator("[data-prerendered] h1")).toBeVisible();
    await expect(page.locator("[data-prerendered] a").first()).toBeVisible();
    await expect(page.locator("#app-loader")).toBeHidden();
    await expect(page.locator("html")).not.toHaveAttribute("data-boot", /.+/);
  } finally { await context.close(); }
});

/* This guard is kept for the fallback experience: a broken app stylesheet must never show unstyled account UI. */
test("account startup stylesheet failure shows the recovery screen", async ({ page }) => {
  await page.route("**/*.css", route => route.abort());
  await page.goto("/account", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-boot", "error");
  await expect(page.locator("#app-loader")).toBeVisible();
});

