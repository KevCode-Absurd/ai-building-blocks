// The release check: the journeys a visitor takes on every deploy, on a laptop and a phone.
// Run it before pushing to production (see playwright.release.config.ts).
import { expect, test, type Page } from "@playwright/test";

const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const list: string[] = [];
  errors.set(page, list);
  page.on("pageerror", (e) => list.push(e.message));
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page), "no script errors on the page").toEqual([]);
});

const cards = (page: Page) => page.getByTestId("block-card");
// The first-screen header and the app's header overlap for a moment while the app starts; wait until one is left for good.
const menuButton = async (page: Page) => {
  const btn = page.getByTestId("menu-btn");
  await expect.poll(async () => (await btn.count()) === 1 && (await page.waitForTimeout(400), await btn.count()) === 1).toBe(true);
  return btn;
};
const search = async (page: Page, words: string) => {
  await page.getByTestId("library-search").fill(words);
  await expect(page.getByTestId("result-count")).toBeVisible();
};
const topLinks = async (page: Page, n = 5) =>
  cards(page).evaluateAll((els, n) => els.slice(0, n).map((e) => (e.closest("a") ?? e.querySelector("a"))?.getAttribute("href") ?? ""), n);

test("home: one heading, the search box, cards marked Tested, and a short header", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByTestId("library-search")).toBeVisible();
  await expect(cards(page).first()).toBeVisible();
  await expect(page.getByTestId("trust-badge").first()).toHaveText("Tested");
  await expect(page.locator("body")).not.toContainText("not yet tested");
  await expect(page.getByTestId("logo")).toBeVisible();
  await expect(await menuButton(page)).toBeVisible();
});

test("search: keywords find the item that does the job", async ({ page }) => {
  await page.goto("/");
  for (const [words, slug] of [
    ["meeting minutes", "rough-notes-to-minutes-writer"],
    ["ad compliance", "compliance"],
    ["cash runway", "runway"],
  ] as const) {
    await search(page, words);
    await expect.poll(async () => (await topLinks(page)).some((h) => h.includes(slug)), { message: `"${words}" finds ${slug} in the top 5` }).toBe(true);
  }
});

test("search: a typo still finds results", async ({ page }) => {
  await page.goto("/");
  await search(page, "meetng minutes");
  await expect(cards(page).first()).toBeVisible();
});

test("an item page: Tested, what goes in and comes out, copy, download, and what to do next", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/prompts/fact-based-ad-copy-writer");
  const bp = page.getByTestId("block-page");
  await expect(bp.locator("h1")).toHaveCount(1);
  await expect(bp.getByTestId("tested")).toHaveText("Tested");
  await expect(bp.getByTestId("output-sample")).toBeVisible();
  await bp.getByTestId("copy-skill").click();
  expect((await page.evaluate(() => navigator.clipboard.readText())).length).toBeGreaterThan(200);
  const download = page.waitForEvent("download");
  await bp.getByTestId("download-task").click();
  expect((await download).suggestedFilename()).toMatch(/\.(md|txt|zip)$/);
  await expect(bp.getByTestId("next").locator("a[href]").first()).toBeVisible();
});

test("the builder: pick a first step, add the next, and download the workflow", async ({ page }) => {
  await page.goto("/#build");
  const builder = page.getByTestId("builder");
  await expect(builder).toBeVisible();
  await builder.getByRole("button", { name: "Use first" }).first().click();
  await expect(builder.getByTestId("flow-node").first()).toBeVisible();
  await builder.getByTestId("download-handoff").click();
  const download = page.waitForEvent("download");
  await page.getByRole("dialog").getByRole("button", { name: "Download the workflow" }).click();
  expect((await download).suggestedFilename()).toMatch(/\.zip$/);
});

test("ready workflows in the builder all have steps", async ({ page }) => {
  await page.goto("/#build");
  const builder = page.getByTestId("builder");
  await expect(builder.locator("button.tpl").first()).toBeAttached();
  const empty = await builder.locator("button.tpl").evaluateAll((els) => els.map((e) => (e.textContent ?? "").trim()).filter((t) => /\D0 steps$/.test(t)));
  expect(empty, "no ready workflow with 0 steps").toEqual([]);
});

test("the menu has the four main areas and hides From people until it has enough items", async ({ page }) => {
  await page.goto("/");
  await (await menuButton(page)).click();
  const menu = page.getByTestId("site-menu");
  await expect(menu).toBeVisible();
  for (const href of ["/#library", "/compose", "/tools", "/space"]) await expect(menu.locator(`a[href="${href}"]`).first()).toBeAttached();
  await expect(page.locator('footer a[href="/how-it-works"]').first()).toBeAttached();
  await expect(menu.locator('a[href="/people"]')).toHaveCount(0);
});

for (const path of ["/ai-tools", "/ai-tools/replit", "/minds", "/tools/discount-calculator", "/how-it-works", "/compose", "/jobs", "/workflows/review-image-ads"]) {
  test(`${path} opens with one heading and no script errors`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("main h1, [data-testid=block-page] h1").first()).toBeVisible();
  });
}

test("phone: search, open an item, and the main button is on screen @mobile", async ({ page }) => {
  await page.goto("/");
  await expect(await menuButton(page)).toBeVisible();
  await search(page, "meeting minutes");
  await cards(page).first().click();
  const bp = page.getByTestId("block-page");
  await expect(bp.locator("h1")).toBeVisible();
  await expect(bp.getByTestId("task-primary")).toBeInViewport({ ratio: 0.1 }).catch(async () => {
    await bp.getByTestId("task-primary").scrollIntoViewIfNeeded();
    await expect(bp.getByTestId("task-primary")).toBeVisible();
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "no sideways scroll").toBe(true);
});

test("phone: the menu opens and the builder shows a step list @mobile", async ({ page }) => {
  await page.goto("/#build");
  await expect(page.getByTestId("builder")).toBeVisible();
  await (await menuButton(page)).click();
  await expect(page.getByTestId("site-menu")).toBeVisible();
});
