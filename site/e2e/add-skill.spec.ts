import { choosePlanner, submitPlan, exportEditable } from "./fixtures/workflow-ui";
import { test, expect, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import { inflateSync, strFromU8, unzipSync } from "fflate";

test.beforeEach(async ({ page }, info) => { if (info.project.name === "desktop") await page.addInitScript(() => localStorage.setItem("abb:workflow-view", "diagram")); });

test.beforeEach(async ({ page }) => {
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: false } }));
  await page.route("**/api/auth/config", route => route.fulfill({ json: { configured: false } }));
});
const editable = async (page: Page, info: TestInfo, name: string) => {
  const [file] = await Promise.all([page.waitForEvent("download"), exportEditable(page)]);
  const target = info.outputPath(name); await file.saveAs(target);
  const data = JSON.parse(fs.readFileSync(target, "utf8"));
  return { data, flow: JSON.parse(strFromU8(inflateSync(Buffer.from(data.flowCode, "base64url")))) };
};
const assemble = async (page: Page) => {
  await page.goto("/compose"); await choosePlanner(page, "free");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch and give me source code");
  await submitPlan(page);
  await expect(page.getByTestId("add-workflow-skill")).toBeVisible();
};

for (const width of [1440, 390]) test(`add a skill in Compose, persist it and include its real instructions in the download at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 1000 }); await assemble(page);
  const before = await editable(page, info, "before.json");
  await page.getByTestId("add-workflow-skill").click(); const dialog = page.getByRole("dialog", { name: "Add a skill" });
  await dialog.getByLabel("Insert skill").selectOption("0");
  await dialog.getByLabel("Search skills").fill("Excel input form builder");
  await dialog.getByRole("group", { name: "Skills to add" }).getByRole("button", { name: /^Excel input form builder/ }).click();
  await expect(dialog.getByRole("button", { name: "Add skill", exact: true })).toBeEnabled();
  await page.screenshot({ path: info.outputPath(`picker-${width}.png`), fullPage: true });
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await dialog.getByRole("button", { name: "Add skill", exact: true }).click(); await expect(dialog).not.toBeVisible();
  const after = await editable(page, info, "after.json");
  expect(after.flow.s).toEqual(["excel-input-form-builder", ...before.flow.s]);
  expect(after.data.goal).toBe(before.data.goal);
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByTestId("compose-download").click()]);
  const file = info.outputPath("workflow.zip"); await download.saveAs(file); const files = unzipSync(fs.readFileSync(file));
  expect(files["skills/excel-input-form-builder/SKILL.md"]).toBeTruthy();
  expect(strFromU8(files["skills/excel-input-form-builder/SKILL.md"])).toContain("pasted data can bypass validation");
  const contract = JSON.parse(strFromU8(files["workflow.json"]));
  expect(contract.steps[0].skill).toBe("excel-input-form-builder"); expect(contract.steps).toHaveLength(before.flow.s.length + 1);
  await page.reload(); await expect(page.getByText("Restored from your saved workflow.")).toBeVisible();
  const restored = await editable(page, info, "restored.json"); expect(restored.flow.s).toEqual(after.flow.s);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("cancel and Escape leave a workflow unchanged; an unmatched search is clear", async ({ page }, info) => {
  await assemble(page); const before = await editable(page, info, "before.json");
  const open = page.getByTestId("add-workflow-skill"); await open.click();
  const dialog = page.getByRole("dialog", { name: "Add a skill" });
  await dialog.getByLabel("Search skills").fill("zzzz_no_matching_skill_8833");
  await expect(dialog.getByText("No skills match. Try a shorter name or another job.")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Add skill", exact: true })).toBeDisabled();
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(open).toBeFocused();
  const after = await editable(page, info, "after.json"); expect(after.flow).toEqual(before.flow);
  await open.click(); await dialog.getByRole("button", { name: "Cancel", exact: true }).click(); await expect(dialog).not.toBeVisible();
});

test("standalone editor adds a first skill to an empty workflow", async ({ page }) => {
  await page.goto("/#build"); const builder = page.getByTestId("builder");
  await builder.getByTestId("add-workflow-skill").click(); const dialog = page.getByRole("dialog", { name: "Add a skill" });
  await dialog.getByLabel("Search skills").fill("Excel input form builder");
  await dialog.getByRole("group", { name: "Skills to add" }).getByRole("button", { name: /^Excel input form builder/ }).click();
  await dialog.getByRole("button", { name: "Add skill", exact: true }).click();
  await expect(builder.getByTestId("flow-node")).toHaveCount(1);
  await expect(builder.getByTestId("flow-node")).toContainText("Excel input form builder");
  await expect(builder.getByTestId("download-handoff")).toBeEnabled();
});

test("insert in the middle and append at the end on a narrow phone", async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 900 }); await assemble(page);
  const original = await editable(page, info, "original.json");
  for (const at of [3, original.flow.s.length + 1]) {
    await page.getByTestId("add-workflow-skill").click();
    const dialog = page.getByRole("dialog", { name: "Add a skill" });
    await dialog.getByLabel("Insert skill").selectOption(String(at));
    await dialog.getByLabel("Search skills").fill("Excel input form builder");
    await dialog.getByRole("group", { name: "Skills to add" }).getByRole("button", { name: /^Excel input form builder/ }).click();
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await dialog.getByRole("button", { name: "Add skill", exact: true }).click(); await expect(dialog).not.toBeVisible();
    await page.getByTestId("step-panel").getByRole("button", { name: "Close", exact: true }).click();
  }
  const revised = await editable(page, info, "revised.json");
  expect(revised.flow.s).toEqual([...original.flow.s.slice(0, 3), "excel-input-form-builder", ...original.flow.s.slice(3), "excel-input-form-builder"]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
