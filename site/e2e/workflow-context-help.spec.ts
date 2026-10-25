import { test, expect } from "./fixtures/staging-aware-test";
import fs from "node:fs";
const sourceFixture = JSON.parse(fs.readFileSync(new URL("../test/fixtures/composer-plans.json", import.meta.url), "utf8")).cases[0];
const publicCatalogue = JSON.parse(fs.readFileSync(new URL("../public/data/blocks.json", import.meta.url), "utf8"));
const publicSlugs = new Set(publicCatalogue.blocks.map((block: { slug: string }) => block.slug));
// The shared fixture predates the catalogue rename; keep the test plan entirely
// within the current public catalogue so import rejection remains meaningful.
const fixture = { ...sourceFixture, plan: { ...sourceFixture.plan, steps: sourceFixture.plan.steps.map((step: { slug: string }) => step.slug === "page-seo-optimizer" ? { ...step, slug: "page-metadata-fixer" } : step) } };
if (fixture.plan.steps.some((step: { slug: string }) => !publicSlugs.has(step.slug))) throw new Error("Workflow regression plan references a skill absent from the public catalogue.");

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem("abb:workflow-view", "list"));
  await context.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  await context.route("**/api/compose", route => route.fulfill({ json: { enabled: false } }));
});
async function importPlan(page: import("@playwright/test").Page) {
  await page.goto("/compose");
  await page.getByText("Customize: planner, minds and imports", { exact: true }).click();
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ format: "ai-blocks-composition/1", goal: fixture.goal, context: "Keep this context", choices: {}, plan: fixture.plan, model: fixture.model, cost: fixture.cost })) });
  await expect(page.getByTestId("plan-ready")).toContainText("No steps have run");
  await page.getByTestId("workflow-list-view").click();
  await expect(page.getByTestId("step-open")).toHaveCount(fixture.plan.steps.length);
}

test("required task details explain the next action and copy a complete request", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => { (window as any).requestFromHelpTest = text; } } }));
  await page.goto("/prompts/rough-notes-to-minutes-writer");
  const input = page.getByLabel("Paste your meeting notes");
  await expect(page.getByTestId("composer-copy")).toBeDisabled();
  await expect(page.getByTestId("task-input-help")).toContainText("Add the requested details");
  await expect(input).toHaveAttribute("aria-describedby", /task-input-help/);
  const help = page.getByTestId("task-action-help"); await help.getByText("Where will I get the result?", { exact: true }).click();
  await expect(help).toContainText("Paste the complete request into a new AI chat");
  await expect(help).toContainText("Your AI makes the result in your chat or workspace");
  const notes = "Rae sends the revised draft on Friday. The budget decision is still open.";
  await input.fill(notes); await expect(page.getByTestId("composer-copy")).toBeEnabled();
  await expect(page.getByTestId("task-input-help")).toHaveCount(0);
  await page.getByTestId("composer-copy").click();
  const request = await page.evaluate(() => (window as any).requestFromHelpTest as string);
  expect(request).toContain(notes); expect(request.length).toBeGreaterThan(notes.length + 100);
  await expect(page.getByTestId("task-text-transfer")).toContainText("Paste the complete request");
});

test("composer navigation and import recovery keep the current complete plan", async ({ page }, info) => {
  await page.goto("/compose");
  await expect(page.getByTestId("compose-goal")).toHaveAccessibleDescription(/who it is for and the format/);
  const nav = page.getByRole("navigation", { name: "Composer sections" });
  await expect(nav.getByRole("link", { name: "2. Your workflow" })).toHaveCount(0);
  await importPlan(page); await expect(nav.getByRole("link", { name: "2. Your workflow" })).toBeVisible();
  await page.getByTestId("compose-run-help").getByText("How do I get my result?", { exact: true }).click();
  await expect(page.getByTestId("compose-run-help")).toContainText("Copy AI instructions gives you a first message to send with the files");
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "broken.json", mimeType: "application/json", buffer: Buffer.from("{ broken") });
  await expect(page.getByRole("alert")).toContainText("Choose workflow.edit.json from a previous download");
  await expect(page.getByRole("alert")).toContainText("Your current workflow is kept");
  await expect(page.getByTestId("compose-goal")).toHaveValue(fixture.goal);
  await expect(page.getByTestId("step-open")).toHaveCount(fixture.plan.steps.length);
  await page.getByText("Other formats", { exact: true }).click();
  await expect(page.getByText("Editable JSON reopens this plan in AI Blocks.", { exact: false })).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByTestId("compose-export").click()]);
  const file = info.outputPath("retained-plan.json"); await download.saveAs(file);
  const exported = JSON.parse(fs.readFileSync(file, "utf8"));
  expect(exported.plan.steps).toEqual(fixture.plan.steps);
  expect(exported.plan.bindings).toHaveLength(fixture.plan.bindings.length);
  for (const binding of exported.plan.bindings as { from: number; step: number; type: string; instruction: string }[]) {
    expect(binding.from).toBeGreaterThanOrEqual(1); expect(binding.from).toBeLessThanOrEqual(exported.plan.steps.length);
    expect(binding.step).toBeGreaterThanOrEqual(1); expect(binding.step).toBeLessThanOrEqual(exported.plan.steps.length);
    expect(binding.type).toBeTruthy(); expect(binding.instruction).toBeTruthy();
  }
  expect(exported.context).toBe("Keep this context"); expect(exported.flowCode).toBeTruthy();
});

test("workflow help separates files from the first message and explains required inputs", async ({ page }) => {
  await importPlan(page); const builder = page.getByTestId("builder");
  await expect(builder.getByTestId("workflow-view-help")).toContainText("Step list shows the order");
  await page.getByTestId("compose-run-help").getByText("How do I get my result?", { exact: true }).click();
  await expect(page.getByTestId("compose-run-help")).toContainText("complete files");
  await expect(page.getByTestId("compose-run-help")).toContainText("START_HERE.txt and follow HANDOFF.md");
  await builder.getByTestId("step-open").first().click(); const panel = page.getByTestId("step-panel");
  await expect(panel.locator(".sp-list").first()).toContainText("required");
  await expect(panel.locator(".sp-list").first()).toContainText("Use an existing file, link or earlier result");
  await panel.getByRole("button", { name: "Close", exact: true }).click();
  await builder.getByTestId("workflow-diagram-view").click();
  await expect(builder.locator(".diagram-tools")).toHaveCount(0);
  await expect(builder.getByTestId("flow-node")).toHaveCount(fixture.plan.steps.length);
  await builder.getByTestId("workflow-list-view").click(); await expect(builder.getByTestId("step-open")).toHaveCount(fixture.plan.steps.length);
});

test("@mobile help opens the right guide while keeping the task draft", async ({ page, context }) => {
  await page.setViewportSize({ width: 320, height: 780 }); await page.goto("/prompts/rough-notes-to-minutes-writer");
  const input = page.getByLabel("Paste your meeting notes"); await input.fill("Keep these meeting notes while I read help.");
  const help = page.getByTestId("task-action-help"); await help.getByText("Where will I get the result?", { exact: true }).click();
  const [guide] = await Promise.all([context.waitForEvent("page"), help.getByRole("link", { name: "Read the steps in a new tab" }).click()]);
  await guide.waitForURL("**/how-it-works#use-in-ai"); await expect(guide.locator("#use-in-ai")).toBeVisible();
  await expect(guide.locator("#use-in-ai")).toContainText("Your AI makes the result in your chat or workspace");
  await expect(input).toHaveValue("Keep these meeting notes while I read help.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await guide.close();
});

for (const tag of ["desktop", "@mobile"]) test(`context help leaves the diagram canvas usable without a toolbar ${tag}`, async ({ page }) => {
  if (tag === "@mobile") await page.setViewportSize({ width: 320, height: 780 });
  await importPlan(page); const builder = page.getByTestId("builder");
  await builder.getByTestId("workflow-diagram-view").click();
  const toolbar = await builder.locator(".stage-bar").boundingBox(), canvas = await builder.locator(".react-flow").boundingBox();
  expect(toolbar).toBeTruthy(); expect(canvas).toBeTruthy();
  await expect(builder.locator(".diagram-tools")).toHaveCount(0);
  expect(canvas!.y).toBeGreaterThanOrEqual(toolbar!.y + toolbar!.height - 1); expect(canvas!.height).toBeGreaterThanOrEqual(320);
  const footer = await builder.locator(".stage-foot").boundingBox(), stage = await builder.locator(".stage").boundingBox();
  expect(footer).toBeTruthy(); expect(stage).toBeTruthy();
  expect(footer!.x).toBeGreaterThanOrEqual(stage!.x - 1);
  expect(footer!.x + footer!.width).toBeLessThanOrEqual(stage!.x + stage!.width + 1);
  expect(await builder.locator(".stage-foot > .small").evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await expect(builder.getByTestId("flow-node")).toHaveCount(fixture.plan.steps.length);
  await builder.getByTestId("workflow-list-view").click(); await expect(builder.getByTestId("step-open")).toHaveCount(fixture.plan.steps.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
