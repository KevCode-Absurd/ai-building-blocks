import { choosePlanner, submitPlan } from "./fixtures/workflow-ui";
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { unzipSync, strFromU8, strToU8, deflateSync } from "fflate";

test("custom workflow offers top instructions and downloads a verified, unexecuted contract", async ({ page, context }, info) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/compose"); await choosePlanner(page, "free");
  const goal = "Build a landing page from scratch and deliver source code";
  await page.getByTestId("compose-goal").fill(goal); await submitPlan(page);
  const prompt = page.getByTestId("execution-prompt").first();
  await expect(prompt).toBeVisible(); await prompt.getByTestId("copy-execution-prompt").click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(`for this goal: ${goal}`);
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByTestId("compose-download").click()]);
  const file = info.outputPath("workflow.zip"); await download.saveAs(file); const files = unzipSync(fs.readFileSync(file));
  const contract = JSON.parse(strFromU8(files["workflow.json"]));
  const manifest = JSON.parse(strFromU8(files["manifest.json"]));
  for (const item of manifest.files) expect(createHash("sha256").update(files[item.path]).digest("hex"), item.path).toBe(item.sha256);
  expect(contract.execution.mode).toBe("portable"); expect(contract.execution.scheduling.reuse_skips_step).toBe(false);
  expect(JSON.parse(strFromU8(files["templates/execution-report.json"])).run_status).toBe("NOT_STARTED");
  expect(strFromU8(files["START_HERE.txt"])).toContain("Never invent accepted inputs");
  for (const s of contract.steps) expect(s.skill_sha256).toBe(createHash("sha256").update(files[s.skill_path]).digest("hex"));
  await page.screenshot({ path: info.outputPath("workflow-execution-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 }); await expect(prompt).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("workflow-execution-mobile.png"), fullPage: true });
  const edited = JSON.parse(strFromU8(files["workflow.edit.json"]));
  edited.flowCode = Buffer.from(deflateSync(strToU8(JSON.stringify({ v: 1, n: "Incomplete", s: [contract.steps[0].skill, "missing-required-skill"], p: [[0, 0], [1, 0]], e: [[0, 1]], m: [] })))).toString("base64url");
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(edited)) });
  await expect(page.getByRole("alert")).toContainText("This workflow is incomplete or invalid. No steps were imported.");
});

test("clipboard failure provides manual instructions and never says copied", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw Error("denied"); } }, configurable: true }));
  await page.goto("/from-a-source");
  await page.getByText("How to use the downloaded files", { exact: true }).click();
  const prompt = page.getByTestId("execution-prompt").first(); await prompt.getByTestId("copy-execution-prompt").click();
  await expect(prompt.getByRole("alert")).toHaveText("Copy did not work. Select and copy the instructions above.");
  await expect(prompt.getByLabel("AI execution instructions")).toBeVisible();
  await expect(prompt.getByTestId("copy-execution-prompt")).toHaveText("Copy AI instructions");
});

test("source-authoring download uses the shared contract and preserves its real approval gate", async ({ page }, info) => {
  await page.goto("/from-a-source"); await page.getByTestId("intake-title").fill("Checked source workflow"); await page.getByTestId("intake-text").fill("Read the current material. Compare its facts and list missing evidence. Ask the user to review the method before writing.");
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByTestId("intake-download").click()]);
  const file = info.outputPath("source.zip"); await download.saveAs(file); const raw = unzipSync(fs.readFileSync(file));
  const files = Object.fromEntries(Object.entries(raw).map(([p, b]) => [p.split("/").slice(1).join("/"), b]));
  expect(strFromU8(files["AUTHORING.md"])).toContain("A generic earlier");
  expect(strFromU8(files["AUTHORING.md"])).toContain("Bundle every selected SKILL.md");
  expect(strFromU8(files["HANDOFF.md"])).toContain("AUTHORING.md");
  expect(files["framework/execution-contract.md"]).toBeTruthy();
  for (const item of JSON.parse(strFromU8(files["manifest.json"])).files) expect(createHash("sha256").update(files[item.path]).digest("hex")).toBe(item.sha256);
});

test("standalone builder separates its prompt from the toolbar and rejects incomplete shared plans", async ({ page }) => {
  const packed = (slugs: string[]) => Buffer.from(deflateSync(strToU8(JSON.stringify({ v: 1, n: "Checked workflow", g: "Draft a clear reply", s: slugs, p: slugs.map((_, i) => [4 + i * 36, 11]), e: [], m: [] })))).toString("base64url");
  await page.goto(`/?flow=${packed(["executive-email-draft"])}#build`);
  const builder = page.getByTestId("builder"); await expect(builder.getByLabel("Workflow name")).toHaveValue("Checked workflow");
  await builder.getByTestId("workflow-diagram-view").click();
  // Capture all rectangles in one frame: #build uses smooth scrolling, so separate calls can drift.
  const layout = await builder.evaluate(el => {
    const toolbar = el.querySelector(".stage-bar")!.getBoundingClientRect();
    const prompt = el.querySelector(".stage > .workflow-launch")!.getBoundingClientRect();
    const canvas = el.querySelector(".react-flow")!.getBoundingClientRect();
    return { promptGap: prompt.top - toolbar.bottom, canvasGap: canvas.top - prompt.bottom };
  });
  expect(layout.promptGap).toBeGreaterThanOrEqual(-1);
  expect(layout.canvasGap).toBeGreaterThanOrEqual(-1);
  await page.goto(`/?flow=${packed(["executive-email-draft", "missing-required-skill"])}#build`);
  await expect(page.getByTestId("builder").getByLabel("Workflow name")).toHaveValue("Untitled workflow");
  await expect(page.getByText("This shared workflow is incomplete or invalid. No steps were imported. Ask for a complete workflow.")).toBeVisible();
});

test("mind collections route workflow entries to complete workflow downloads", async ({ page }, info) => {
  await page.goto("/minds/cal-newport");
  await page.getByRole("heading", { name: "Skills from Cal Newport's work", exact: true }).click();
  const workflows = page.getByTestId("mind-workflow-downloads");
  await expect(workflows).toContainText("Each workflow has its own complete pack");
  const slug = "daily-shutdown-planner";
  expect(await page.getByTestId("mind-skill-pick").evaluateAll(els => els.map(el => (el as HTMLElement).dataset.slug))).not.toContain(slug);
  await workflows.locator(`a[data-slug="${slug}"]`).click();
  await page.getByTestId("download-handoff").click();
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByTestId("needs-download").click()]);
  const file = info.outputPath("mind-workflow.zip"); await download.saveAs(file); const files = unzipSync(fs.readFileSync(file));
  expect(files["START_HERE.txt"]).toBeTruthy(); expect(files["workflow.json"]).toBeTruthy(); expect(files[`skills/${slug}/SKILL.md`]).toBeTruthy();
  expect(JSON.parse(strFromU8(files["templates/execution-report.json"])).run_status).toBe("NOT_STARTED");
});

test("incomplete legacy workflows stop at the missing reference without producing a partial pack", async ({ page }) => {
  let downloads = 0; page.on("download", () => downloads++);
  await page.goto("/minds/jeff-bezos");
  await page.getByRole("heading", { name: "Skills from Jeff Bezos's work", exact: true }).click();
  await page.getByTestId("mind-workflow-downloads").locator('a[data-slug="weekly-product-funnel-watcher"]').click();
  await page.getByTestId("download-handoff").click();
  await page.getByTestId("needs-download").click();
  await expect(page.getByText(/Missing local reference references\/retention-measurement-patterns\.md/)).toBeVisible();
  expect(downloads).toBe(0);
  await expect(page.getByTestId("needs")).toBeVisible();
});
