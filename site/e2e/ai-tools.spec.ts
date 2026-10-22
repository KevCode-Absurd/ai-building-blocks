import { expect, test } from "./fixtures/staging-aware-test";

test("AI products can be searched, opened, and followed to their skills", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/ai-tools");
  await expect(page.getByTestId("ai-tool-card")).toHaveCount(75);
  await page.getByTestId("ai-tools-search").fill("ChatGPT");
  const card = page.locator('[data-testid="ai-tool-card"][data-slug="chatgpt"]');
  await expect(card).toBeVisible();
  await card.click();
  await expect(page.getByTestId("ai-tool-page")).toHaveAttribute("data-slug", "chatgpt");
  await expect(page.getByTestId("at-open")).toHaveAttribute("href", "https://chatgpt.com");
  await expect(page.getByTestId("at-pricing")).toBeVisible();
  await page.getByTestId("at-block-link").first().click();
  await expect(page.locator("h1")).not.toHaveText("That block isn't here");
  expect(errors).toEqual([]);
});

test("AI tools handle empty results, unknown products, and loading failure", async ({ page }) => {
  await page.goto("/ai-tools?q=zzzz-no-product");
  await expect(page.getByTestId("ai-tools-empty")).toBeVisible();
  const missing = await page.goto("/ai-tools/missing-product");
  if (missing?.status() === 404) await expect(page.getByRole('heading', { name: "This page doesn't exist", exact: true })).toBeVisible();
  else await expect(page.getByTestId("ai-tool-missing")).toBeVisible();
  await page.route("**/data/ai-tools.json", (route) => route.fulfill({ status: 503, body: "unavailable" }));
  await page.goto('/ai-tools');
  await expect(page.getByTestId("ai-tools-failed")).toBeVisible();
});

test("AI tools fit a phone and keep search in the address @mobile", async ({ page }) => {
  await page.goto("/ai-tools");
  await page.getByTestId("ai-tools-search").fill("ChatGPT");
  await expect(page).toHaveURL(/q=ChatGPT/);
  await page.reload();
  await expect(page.getByTestId("ai-tools-search")).toHaveValue("ChatGPT");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
