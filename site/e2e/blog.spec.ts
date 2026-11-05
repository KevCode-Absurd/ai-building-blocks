import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
});

test("the blog lists every article and guide, and an article opens with its contents, prompts and related reading", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/blog");
  const blog = page.getByTestId("blog-page");
  await expect(blog.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(blog.locator('.blog-card a[href^="/blog/"]')).toHaveCount(30);
  for (const href of ["/train-your-own-ai-agent", "/me-md", "/industries", "/how-we-test"]) await expect(blog.locator(`.blog-card a[href="${href}"]`)).toHaveCount(1);
  await blog.locator('.blog-card a[href="/blog/landing-page-checklist"]').click();
  await expect(page).toHaveURL(/\/blog\/landing-page-checklist$/);
  await expect(blog.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(blog.locator(".byline")).toContainText("min read");
  await blog.locator('.toc a[href="#faq"]').click();
  await expect(page.locator("#faq")).toBeInViewport();
  const copy = blog.locator(".copy-btn").first();
  await copy.click();
  await expect(blog.locator("#copy-status")).toContainText(/copied|selected/i);
  await blog.locator('.post-related a[href^="/blog/"]').first().click();
  await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);
  await expect(blog.locator(".post-body h2").first()).toBeVisible();
});

test("@mobile the menu's Blog group reaches the blog and the training guide", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("menu-btn").click();
  const menu = page.getByTestId("site-menu");
  await expect(menu.getByRole("heading", { name: "Blog", exact: true })).toBeVisible();
  await expect(menu.getByRole("link", { name: "Train your own AI agent", exact: true })).toHaveAttribute("href", "/train-your-own-ai-agent");
  await menu.getByRole("link", { name: "All articles and guides", exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("an unknown article says so and links back to the blog", async ({ page }) => {
  await page.goto("/blog/no-such-article");
  await expect(page.getByRole("heading", { name: "This article doesn't exist" })).toBeVisible();
  await expect(page.getByRole("link", { name: "See all articles and guides" })).toHaveAttribute("href", "/blog");
});
