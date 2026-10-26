import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
});

test("a failed help page offers recovery while other navigation remains usable", async ({ page }) => {
  let fail = true;
  await page.route(/\/(?:src\/HowItWorks\.tsx|assets\/HowItWorks-[^/?]+\.js)/, route => fail
    ? route.fulfill({ status: 503, contentType: "text/javascript", body: "Unavailable" }) : route.continue());
  await page.goto("/");
  const sections = page.getByRole("navigation", { name: "Sections", exact: true });
  await expect(page.getByTestId("library-search")).toBeEnabled();
  await page.getByTestId("menu-btn").click();
  await sections.getByRole("link", { name: "How to use AI Blocks", exact: true }).click();
  await expect(page.getByRole("heading", { name: "This page couldn't open", exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("Check your connection");
  await page.getByTestId("menu-btn").click();
  await expect(sections.getByRole("link", { name: "Find a task", exact: true })).toBeVisible();
  await page.screenshot({ path: test.info().outputPath("page-recovery.png") });
  fail = false;
  await page.getByRole("button", { name: "Reload this page", exact: true }).click();
  await expect(page.getByTestId("how-it-works")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("navigation marks the current page and keyboard users can return to the library", async ({ page }) => {
  await page.goto("/");
  const sections = page.getByRole("navigation", { name: "Sections", exact: true });
  const menu = page.getByTestId("menu-btn");
  await expect(menu).toBeVisible();
  await menu.click();
  const help = sections.getByRole("link", { name: "How to use AI Blocks", exact: true });
  await help.click();
  await expect(page.locator("main h1")).toBeFocused();
  await menu.click();
  await expect(help).toHaveAttribute("aria-current", "page");
  await sections.getByRole("link", { name: "Browser tools", exact: true }).click();
  await menu.click();
  await expect(sections.getByRole("link", { name: "Browser tools", exact: true })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await sections.getByRole("link", { name: "Find a task", exact: true }).click();
  await expect(page.locator("#library")).toBeFocused();
  await expect(page.getByTestId("library-search")).toBeEnabled();
});

test("@mobile a failed first page reveals recovery instead of staying behind the loading cover", async ({ page }) => {
  await page.route(/\/(?:src\/HowItWorks\.tsx|assets\/HowItWorks-[^/?]+\.js)/, route =>
    route.fulfill({ status: 503, contentType: "text/javascript", body: "Unavailable" }));
  await page.goto("/how-it-works");
  await expect(page.getByTestId("page-recovery")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reload this page", exact: true })).toBeVisible();
  await page.getByTestId("page-recovery").getByRole("link", { name: "Find a task", exact: true }).click();
  await expect(page.getByTestId("library-search")).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("public library download starts while account setup is still waiting", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/auth", async route => { await held; await route.fulfill({ json: { configured: false } }); });
  let requested = false;
  page.on("request", request => { if (new URL(request.url()).pathname === "/data/blocks-index.json") requested = true; });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect.poll(() => requested).toBe(true);
    await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
    await expect(page.locator("#app-loader")).toHaveCount(0);
    await expect(page.getByText("Saved to your account.", { exact: true })).toHaveCount(0);
  } finally { release(); }
  await expect(page.getByTestId("library-search")).toBeEnabled();
});

test("browser tools open without downloading the full task library", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", request => { if (new URL(request.url()).pathname === "/data/blocks.json") requests.push(request.url()); });
  await page.goto("/tools");
  await expect(page.getByTestId("tools-index")).toBeVisible();
  expect(requests).toEqual([]);
});

test("transfer help is readable before JavaScript opens", async ({ browser, baseURL }) => {
  test.skip(!process.env.PW_BUILT_ASSETS, "Requires the final public HTML with its reviewed help sections.");
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/how-it-works#use-in-ai");
    await expect(page.locator("#use-in-ai")).toContainText("Your AI makes the result");
    await expect(page.locator("#use-in-ai")).toContainText("keep all the files together");
    await page.goto("/from-a-source#source-help");
    await expect(page.locator("#source-help")).toContainText("A link is for credit; it does not load the content.");
    await expect(page.locator('#source-help a[href="/how-it-works#use-in-ai"]')).toBeVisible();
  } finally { await context.close(); }
});
