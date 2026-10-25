import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { composerOptions, exportEditable } from "./fixtures/workflow-ui";
import { decodeCatalogue, finalize, freeSelection } from "../src/lib/composer-core";

// Reuse an existing fixture goal with the real free composer; import/export does not run its skills.
const fixtures = JSON.parse(await fs.readFile("test/fixtures/composer-plans.json", "utf8"));
const legacyGoal = "Preserve every word of this older saved workflow request. ".repeat(200).slice(0, 10000);

for (const tag of ["", "@mobile "]) test(tag + "composer limits new requests to 3000 while preserving and round-tripping a 10000-character legacy plan", async ({ page, request: http }) => {
  let posts = 0;
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  await page.route("**/api/comments*", route => route.fulfill({ json: { enabled: false, comments: [] } }));
  await page.route("**/api/compose", route => {
    if (route.request().method() === "POST") { posts++; return route.fulfill({ status: 500, json: { error: "Unexpected mocked AI request" } }); }
    return route.fulfill({ json: { enabled: false } });
  });
  await page.goto("/compose");
  const library = decodeCatalogue(await (await http.get("/data/blocks.json")).json());
  const oldPlan = finalize(library, freeSelection(library, fixtures.cases[0].goal, { delivery: "code" }), "free");
  const request = page.getByTestId("compose-goal");
  await expect(request).toHaveAttribute("maxlength", "3000");
  await request.fill("New report request. ".repeat(170));
  expect((await request.inputValue()).length).toBe(3000);
  await expect(page.locator(".compose-voice-count")).toContainText("3,000 / 3,000 characters");
  await composerOptions(page);
  await page.getByRole("tab", { name: "Find steps from the library", exact: true }).click();
  const legacy = { format: "ai-blocks-composition/1", goal: legacyGoal, context: "Original context is preserved.", choices: {}, plan: oldPlan, model: "free", cost: 0 };
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(legacy)) });
  expect(await page.getByRole("alert").allTextContents()).toEqual([]);
  await expect(request).toHaveValue(legacyGoal);
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await expect(page.locator(".compose-voice-count")).toContainText("Shorten this draft before creating a new workflow");
  await expect(page.getByTestId("compose-download")).toBeEnabled();
  const [download] = await Promise.all([page.waitForEvent("download"), exportEditable(page)]);
  expect(await download.failure()).toBeNull();
  const exported = JSON.parse(await fs.readFile((await download.path())!, "utf8"));
  expect(exported.goal).toBe(legacyGoal); expect(exported.goal).toHaveLength(10000);
  expect(exported.context).toBe(legacy.context);
  expect(exported.plan.steps.map((step: any) => step.slug)).toEqual(oldPlan.steps.map((step: any) => step.slug));
  expect(exported.flowCode).toBeTruthy();

  // Reload exercises the real saved composer envelope, without truncating old requests.
  await page.reload();
  await expect(page.getByTestId("compose-goal")).toHaveValue(legacyGoal);
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await expect(page.getByTestId("compose-download")).toBeEnabled();
  await composerOptions(page);
  await page.getByRole("tab", { name: "Find steps from the library", exact: true }).click();
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(exported)) });
  await expect(page.getByTestId("compose-goal")).toHaveValue(legacyGoal);
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await page.getByTestId("compose-goal").fill("Write a checked weekly report from my supplied sales notes.");
  await expect(page.getByTestId("compose-submit")).toBeEnabled();
  expect(posts).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
