import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: false } }));
});

test("job function links filter the library and combine with format tabs", async ({ page }) => {
  await page.goto("/?area=coding#library");
  await expect(page.getByTestId("job-coding")).toHaveCount(0);
  await expect(page.getByTestId("result-count")).toContainText("in Coding");
  await expect(page.locator('#library a[href="/prompts/code-explainer-for-newcomers"]')).toBeVisible();
  await expect(page).toHaveURL(/area=coding/);
  await page.goto("/?area=marketing#library");
  await expect(page.getByTestId("result-count")).toContainText("in Marketing");
  await page.getByTestId("tab-agent").click();
  await expect(page.locator("#library .grid > a").first()).toHaveAttribute("href", /^\/agents\//);
  await expect(page).toHaveURL(/area=marketing/);
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.getByTestId("tab-all")).toHaveAttribute("aria-selected", "true");
  await expect(page).not.toHaveURL(/area=/);
});

test("AEO finds useful methods across types and filters retain relevance", async ({ page }) => {
  await page.goto("/?q=AEO#library");
  await expect(page.locator("#library [role=status]")).toHaveCount(0, { timeout: 20000 });
  await expect(page.locator('#library a[href="/agents/ai-answer-visibility-tracker"]')).toBeVisible();
  await page.getByTestId("tab-skill").click();
  const cards = page.locator("#library .grid > a");
  await expect(cards.first()).toBeVisible();
  for (const href of await cards.evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))) expect(href).toMatch(/^\/skills\//);
  await expect(page.getByTestId("library-search")).toHaveValue("AEO");
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("a natural goal finds AI answer visibility without knowing the skill name", async ({ page }) => {
  await page.goto("/#library");
  await page.getByTestId("library-search").fill("get my brand mentioned in ChatGPT answers");
  await expect(page.locator('#library a[href="/agents/ai-answer-visibility-tracker"]')).toBeVisible({ timeout: 20000 });
  await expect(page.locator("#library .grid > a").first()).toContainText(/AI answer|visibility/i);
});

test("agentic search includes the agent collection rather than one exact title", async ({ page }) => {
  await page.goto("/#library");
  const published = await (await page.request.get("/data/blocks.json")).json();
  const agentCount = published.blocks.filter((block: {type: string}) => block.type === "agent").length;
  expect(agentCount).toBeGreaterThan(16);
  await page.getByTestId("library-search").fill("Agentic");
  await page.getByTestId("tab-agent").click();
  await expect(page.getByTestId("result-count")).toHaveText(`${agentCount} results`, { timeout: 20000 });
  await expect(page.locator("#library .grid > a")).toHaveCount(16);
  await expect(page.getByTestId("show-more")).toBeVisible();
});

test("typing keeps every character and collection links replace filters", async ({ page }) => {
  await page.goto("/#library");
  const search = page.getByTestId("library-search");
  // Sequential key input does not wait for the disabled loading field to become
  // editable. Begin this typing regression when the complete library is ready.
  await expect(search).toBeEnabled();
  await search.pressSequentially("AEO agentic visibility", { delay: 35 });
  await expect(search).toHaveValue("AEO agentic visibility");
  await expect(page).toHaveURL(/q=AEO\+agentic\+visibility/);
  await page.locator('#home-agents a[href="/?kind=agent#library"]').click();
  await expect(search).toHaveValue("");
  await expect(page.getByTestId("tab-agent")).toHaveAttribute("aria-selected", "true");
  await page.goBack();
  await expect(search).toHaveValue("AEO agentic visibility");
  await expect(page.getByTestId("tab-all")).toHaveAttribute("aria-selected", "true");
});

test("visible collections stay in order and ready workflows open in the builder", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const collections = page.locator("#home-minds, #home-workflows, #home-agents, #everyday-tools");
  await expect(collections).toHaveCount(4);
  expect(await collections.evaluateAll(nodes => nodes.map(node => node.id))).toEqual(["home-minds", "home-workflows", "home-agents", "everyday-tools"]);
  for (const id of ["home-minds", "home-workflows", "home-agents", "everyday-tools"]) await expect(page.locator(`#${id}`)).toBeVisible();
  await page.locator('#home-workflows .grid a').first().click();
  await expect(page.getByTestId("builder")).toBeVisible({ timeout: 15000 });
  await expect(page.getByTestId("builder").getByTestId("step-open").first()).toBeVisible();
  await expect(page.getByTestId("builder").getByTestId("workflow-list-view")).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});

test("@mobile type names, controls and cards fit small screens", async ({ page }, info) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/#library");
    await expect(page.getByTestId("library-search")).toBeVisible();
    for (const kind of ["all", "prompt", "skill", "workflow", "agent", "mind"]) {
      const tab = page.getByTestId(`tab-${kind}`);
      await expect(tab).toBeVisible();
      expect(await tab.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    }
    await expect(page.getByTestId("tab-specialists")).toBeVisible();
    await expect(page.getByTestId("filter-domain")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: info.outputPath(`library-${width}.png`) });
  }
});
