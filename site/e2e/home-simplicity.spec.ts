import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
});

test("visible library choices preserve the hero and keep every destination available", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Get your ads, emails and plans done with AI");
  await expect(page.locator(".hero .lede")).toHaveText("Type what you need done. Then copy free instructions into the chatbot you use. Or hire a specialist for the whole task.");
  await expect(page.locator(".hero .btn-primary")).toHaveCount(1);
  await expect(page.getByTestId("hero-hire")).toHaveAttribute("href", "/roles");
  await expect(page.locator(".react-flow")).toHaveCount(0);
  await page.getByRole("button", { name: "Find help" }).click();
  await expect(page.getByTestId("library-search")).toBeFocused();
  for (const kind of ["all", "prompt", "skill", "workflow", "agent", "mind"]) await expect(page.getByTestId(`tab-${kind}`)).toBeVisible();
  await expect(page.locator("#library .grid > a")).toHaveCount(16);
  await expect(page.getByText("Browse by type", { exact: true })).toHaveCount(0);
  await expect(page.locator(".task-examples, .task-start-note, .task-recommendation")).toHaveCount(0);
  await page.getByTestId("show-more").click();
  await expect(page.locator("#library .grid > a")).toHaveCount(32);
  await page.getByTestId("menu-btn").click();
  for (const href of ["/#build", "/compose", "/tools", "/apps", "/minds", "/ai-tools", "/from-a-source", "/space"]) {
    await expect(page.locator(`#site-menu-links a[href="${href}"]`)).toBeVisible();
  }
});

test("ordinary task wording finds a useful result and filters preserve the request", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const search = page.getByTestId("library-search");
  await search.fill("tidy my notes");
  await expect(page.locator('#library .grid a[href="/prompts/rough-notes-to-minutes-writer"]')).toBeVisible();
  await page.getByTestId("tab-prompt").click();
  await expect(page.getByTestId("tab-prompt")).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(search).toHaveValue("tidy my notes");
  await expect(page.getByTestId("tab-all")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('#library .grid a[href="/prompts/rough-notes-to-minutes-writer"]')).toBeVisible();
});

test("saved kits and workflows remain reachable from one account page", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("abb:v1", JSON.stringify({ kits: [{id:"a",name:"My notes kit",slugs:["rough-notes-to-minutes-writer"],updated:1}], flows:[],recent:[],currentFlow:null,draft:null })));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const opener = page.getByTestId("open-saved-work");
  await opener.click();
  await expect(page.getByTestId("account-page")).toContainText("My notes kit");
  await page.getByRole("button", { name: "Manage my kits" }).click();
  await expect(page.locator(".kit-head input")).toHaveValue("My notes kit");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Manage my kits" })).toBeFocused();
});

test("@mobile a phone can find a task and all advanced destinations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByTestId("menu-btn").click();
  await page.getByTestId("menu-btn").click();
  await expect(page.getByTestId("nav-compose")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByTestId("hero-goal").fill("make this easier to read");
  await page.getByTestId("hero-goal").press("Enter");
  await expect(page.getByTestId("library-search")).toHaveValue("make this easier to read");
  await expect(page.getByTestId("library-top-hits").locator('a[href="/skills/plain-english-editor"]')).toBeInViewport();
  await expect(page.locator('#library .grid a[href="/skills/plain-english-editor"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
