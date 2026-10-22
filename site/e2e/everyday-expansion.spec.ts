import { expect, test } from "./fixtures/staging-aware-test";
import { BROWSER_TOOLS } from "../src/tools/browser-tools.mjs";

test("browser utilities work with edited input and produce downloadable results", async ({ page }) => {
  for (const tool of BROWSER_TOOLS) {
    await page.goto(`/tools/${tool.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(tool.short);
    await expect(page.getByTestId("browser-output")).not.toBeEmpty();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download result" }).click();
    expect((await download).suggestedFilename()).toMatch(/\.(txt|json|csv|md|jsonl)$/);
  }
  await page.goto("/tools/csv-to-json");
  await page.getByTestId("browser-input").fill('name,note\nAlex,"Line 1\nLine 2"');
  await expect(page.getByTestId("browser-output")).toContainText('"note": "Line 1\\nLine 2"');
  await page.getByTestId("browser-input").fill("name,name\nA,B");
  await expect(page.getByRole("alert")).toContainText("different");
  await expect(page.getByRole("button", { name: "Download result" })).toBeDisabled();
  await page.goto("/tools/contrast-checker");
  await page.getByTestId("contrast-front").fill("#000");
  await expect(page.getByTestId("browser-output")).toContainText("21.00:1");
  await page.getByTestId("contrast-front").fill("#fff");
  await expect(page.getByTestId("browser-output")).toContainText("1.00:1");
  await expect(page.getByTestId("browser-output")).toContainText("Fail");
});

test("tool topics can be linked, searched and cleared", async ({ page }) => {
  await page.goto("/tools?topic=design");
  await expect(page.getByRole("button", { name: /^Design / })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-slug="contrast-checker"]')).toBeVisible();
  await page.getByTestId("tools-search").fill("contrast");
  await expect(page.getByTestId("tool-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByTestId("tool-card")).not.toHaveCount(1);
});

test("featured tools appear below the builder and minds have identities @mobile", async ({ page }) => {
  await page.goto("/");
  const featured = page.getByTestId("featured-tools");
  await featured.scrollIntoViewIfNeeded();
  await expect(featured.getByRole("link")).toHaveCount(7);
  expect(await page.locator("#build").evaluate(el => !!el.nextElementSibling?.matches("#everyday-tools"))).toBeTruthy();
  for (const url of ["/tools", ...BROWSER_TOOLS.map(t => `/tools/${t.slug}`)]) {
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), url).toBeLessThanOrEqual(0);
  }
  await page.goto("/minds/ada-lovelace");
  await expect(page.getByTestId("mind-identity")).toHaveText("Early computer programming pioneer");
});
