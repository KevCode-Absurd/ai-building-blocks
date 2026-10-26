import { test, expect } from "@playwright/test";

for (const tag of ["", "@mobile "]) {
  test(tag + "published API and documentation menu links work without unfinished publishing links", async ({ page }) => {
    await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
    await page.route("**/api/comments*", route => route.fulfill({ json: { enabled: false, comments: [] } }));
    await page.goto("/");
    await page.locator("#app-loader").waitFor({ state: "hidden" });
    const reject = page.getByRole("button", { name: /Reject.*cookies|Reject optional/i });
    if (await reject.isVisible()) await reject.click();
    for (const [id, href] of [["nav-api-mcp", "/api-and-mcp"], ["nav-documentation", "/api-and-mcp#api"]]) {
      await page.getByTestId("menu-btn").click();
      const menu = page.getByTestId("site-menu");
      await expect(menu.locator('a[href="/community"],a[href="/publish"],a[href="/my-submissions"],a[href="/admin/review"]')).toHaveCount(0);
      await expect(menu.getByTestId(id)).toHaveAttribute("href", href);
      await menu.getByTestId(id).click();
      await expect(page).toHaveURL(new RegExp(href.replace("/", "\\/") + "$"));
      await expect(page).toHaveTitle("AI Blocks API and MCP server documentation | AI Blocks");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Connect with API & MCP.");
      if (id === "nav-documentation") await expect(page.locator("#api")).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await expect(page.getByText("This page doesn't exist", { exact: true })).toHaveCount(0);
      await page.goto("/");
      await page.locator("#app-loader").waitFor({ state: "hidden" });
    }
  });
}
