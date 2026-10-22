import { expect, test } from "@playwright/test";

const pages = [
  ["/support", "Get help with AI Blocks"],
  ["/about", "Reusable instructions for the work you do"],
  ["/privacy", "Privacy policy"],
  ["/terms", "Terms of service"],
  ["/cookies", "Cookies and browser storage"],
  ["/ai-disclaimer", "Understand and check AI output"],
] as const;

test("support and policies navigate without the catalogue and update page metadata", async ({ page }) => {
  const errors: string[] = [], catalogue: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (new URL(request.url()).pathname === "/data/blocks.json") catalogue.push(request.url()); });
  await page.goto("/support");
  for (const [path, title] of pages) {
    if (path !== "/support") await page.getByRole("navigation", { name: "Help and policies", exact: true }).locator(`a[href="${path}"]`).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} · AI Blocks`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://useaiblocks.com${path}`);
    await expect(page.getByRole("navigation", { name: "Help and policies", exact: true }).locator('[aria-current="page"]')).toHaveAttribute("href", path);
  }
  expect(catalogue).toEqual([]);
  expect(errors).toEqual([]);
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cookies and browser storage");
  await page.getByRole("link", { name: "AI Blocks, home", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Use AI like the top 1%");
  await expect(page).toHaveTitle("Free AI Skills & Custom Workflow Builder | AI Blocks");
});

test("support email works and copy failure gives a truthful fallback", async ({ page }) => {
  await page.goto("/support");
  await expect(page.locator(".info-contact a")).toHaveAttribute("href", /^mailto:hello@useaiblocks.com\?subject=/);
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("permission denied"); } } }));
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByText("Copy the address manually: hello@useaiblocks.com", { exact: true })).toBeVisible();
  await expect(page.getByText("Support email copied.", { exact: true })).toHaveCount(0);
});

test("keyboard visitors can skip navigation to the content", async ({ page }) => {
  await page.goto("/support");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("policies and footer fit narrow phones and both themes @mobile", async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const [path, title] of pages) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} at ${width}px`).toBe(true);
      for (const link of await page.getByRole("navigation", { name: "Policies", exact: true }).getByRole("link").all()) await expect(link).toBeVisible();
    }
  }
  await page.goto("/support");
  const theme = page.getByTestId("theme-toggle");
  if (await theme.count()) await theme.click();
  await expect(page.locator(".info-contact a")).toBeVisible();
});
