import { test, expect } from "./fixtures/composer-staging-test";
import fs from "node:fs";
import { unzipSync, strFromU8 } from "fflate";
import { WORKFLOW_CASES } from "../../tools/lib/workflow-fresh-cases.mjs";
test("landing source delivery pack contains the reviewed method without unrelated extras", async ({ page }, info) => {
  await page.goto("/compose"); await page.getByRole("tab", { name: "Free assembly" }).click();
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver source code");
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-download")).toBeEnabled();
  const event = page.waitForEvent("download");
  await page.getByTestId("compose-download").click();
  const download = await event, file = info.outputPath(download.suggestedFilename());
  await download.saveAs(file);
  const pack = unzipSync(fs.readFileSync(file));
  const slugs = JSON.parse(strFromU8(pack["workflow.edit.json"])).plan.steps.map((s: any) => s.slug);
  expect(slugs).toContain("react-landing-page-builder");
  expect(slugs).toContain("landing-page-30-point-checker");
  expect(slugs).toContain("human-review-gate");
  expect(slugs).not.toContain("copilot-resx-source-generator-migration");
  expect(slugs).not.toContain("website-brand-brain-builder");
  expect(slugs).toHaveLength(10);
});
for (const task of WORKFLOW_CASES) test(`new free request produces an editable complete pack: ${task.id}`, async ({ page }, info) => {
  let calls = 0;
  page.on("request", req => { if (req.method() === "POST" && req.url().includes("/api/compose")) calls++; });
  await page.goto("/compose"); await page.getByRole("tab", { name: "Free assembly" }).click(); await page.getByTestId("compose-goal").fill(task.goal);
  await page.getByText("Add context and constraints", { exact: true }).click(); await page.locator("#compose-context").fill(task.context);
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-download")).toBeEnabled();
  const event = page.waitForEvent("download"); await page.getByTestId("compose-download").click(); const dl = await event;
  const file = info.outputPath(dl.suggestedFilename()); await dl.saveAs(file); const pack = unzipSync(fs.readFileSync(file));
  const edit = JSON.parse(strFromU8(pack["workflow.edit.json"]));
  expect(edit.context).toBe(task.context); expect(edit.plan.steps.length).toBeGreaterThan(0);
  expect(strFromU8(pack["HANDOFF.md"])).toContain(task.context);
  for (const s of edit.plan.steps) expect(pack[`skills/${s.slug}/SKILL.md`]).toBeTruthy();
  expect(calls).toBe(0);
  if (task.id === "static-cafe") { expect(edit.plan.steps.some((s: any) => s.slug === "static-html-landing-page-builder")).toBe(true); expect(edit.plan.steps.some((s: any) => s.slug === "react-landing-page-builder")).toBe(false); }
});
