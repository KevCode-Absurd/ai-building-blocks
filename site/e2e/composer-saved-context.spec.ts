import { test, expect, type Page } from "@playwright/test";
import { mockComposerAccount } from "./fixtures/composer-account";
import { choosePlanner, submitPlan, exportEditable, planOptions } from "./fixtures/workflow-ui";
import fs from "node:fs/promises";
import { unzipSync, strFromU8 } from "fflate";

// All account, security and AI endpoints below are simulated. No provider calls.
const goal = "Write a checked weekly report from my sales notes";
const plan = { title: "Synthetic weekly report plan", summary: "Write a report from the supplied sales notes.", steps: [{ slug: "request-deliverable-drafter", reason: "Write the requested report.", notes: "Use supplied figures. Save report.md and check each figure against the source.", minds: [] }], questionIds: [], assumptions: [] };
const profile = "# me.md\n## Core\nSynthetic editor.\n## Work\nResearch editing for science teams.\n## Projects (expires 2000-01-01)\nEXPIRED_PROJECT_DO_NOT_USE\n## Never\nNever invent customer quotes.\n## Life\nUNRELATED_PRIVATE_LIFE\n";

async function setup(page: Page, legacy = false) {
  await page.addInitScript(() => localStorage.setItem("abb:workflow-view", "diagram"));
  let data: Record<string, string> = { "abb:business": JSON.stringify({ me: profile }) }, revision = 1;
  if (legacy) data["abb:composer"] = JSON.stringify({ format: "ai-blocks-composition/1", goal, context: "Legacy notes and saved Core from the original export.", plan: { ...plan, source: "ai" }, choices: {}, assignMinds: false });
  const sent: any[] = [];
  await page.route("**/api/**", route => route.fulfill({ status: 401, json: { error: "Blocked by local fixture" } }));
  await mockComposerAccount(page);
  await page.route("**/api/library", route => {
    if (route.request().method() === "PUT") { data = route.request().postDataJSON().data; revision++; }
    return route.fulfill({ json: { data, revision } });
  });
  await page.route("**/api/security", route => route.fulfill({ json: { required: false } }));
  await page.route("**/api/compose", route => {
    if (route.request().method() !== "POST") return route.fulfill({ json: { enabled: true, models: [{ id: "gpt-6-luna", label: "GPT-6 Luna", available: true }], defaultModel: "gpt-6-luna" } });
    sent.push(route.request().postDataJSON());
    return route.fulfill({ json: { plan, model: "gpt-6-luna", cost: 0, latencyMs: 1 } });
  });
  return { sent, data: () => data };
}

async function openAccountPage(page: Page, path: string) {
  await page.goto("/account");
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
  if (path === "/#build") {
    await page.getByRole("link", { name: "AI Blocks, home", exact: true }).click();
    // My account no longer loads the catalogue, so home opens on starter picks; focusing search opens the full library.
    await page.locator("#task-search").focus();
    await page.locator("#home-workflows").getByRole("link", { name: /Open the workflow builder/ }).click();
    return;
  }
  await page.goto(path);
}

async function editStepOptions(page: Page) {
  const summary = page.getByTestId("step-panel").getByText("Edit instructions", { exact: true });
  if (!await summary.evaluate(el => (el.parentElement as HTMLDetailsElement).open)) await summary.click();
}

test("AI planner uses saved work, filters expired facts, and reopens without duplicate profile or lost manual edits", async ({ page }, info) => {
  const api = await setup(page);
  await openAccountPage(page, "/compose");
  await page.getByTestId("compose-goal").fill(goal);
  await planOptions(page);
  await page.getByText("Add context and constraints", { exact: true }).click();
  const include = page.getByRole("checkbox", { name: "Use relevant parts of my saved me.md" });
  await expect(include).toBeChecked();
  await expect.poll(() => page.evaluate(() => document.body.textContent?.includes("Checking sign-in…"))).toBe(false);
  await page.getByLabel("Audience, offer, available inputs and limits").fill("Use the supplied CSV only.");
  await page.getByTestId("compose-assign-minds").uncheck();
  await submitPlan(page);
  await expect(page.getByTestId("compose-steps")).toBeVisible();
  expect(api.sent).toHaveLength(1);
  const firstContext = api.sent[0].context;
  expect(firstContext).toContain("Research editing for science teams");
  expect(firstContext).toContain("Never invent customer quotes");
  expect(firstContext).not.toContain("EXPIRED_PROJECT_DO_NOT_USE");
  expect(firstContext).not.toContain("UNRELATED_PRIVATE_LIFE");
  await page.getByTestId("flow-node").first().click(); await editStepOptions(page);
  await page.getByTestId("step-instructions").fill("Keep this manually edited instruction.");
  await page.getByTestId("step-panel").getByRole("button", { name: "Close", exact: true }).click();
  const download = page.waitForEvent("download"); await exportEditable(page);
  const file = info.outputPath("workflow.edit.json"); await (await download).saveAs(file);
  const saved = JSON.parse(await fs.readFile(file, "utf8"));
  expect(saved.context).toBe("Use the supplied CSV only.");
  expect(saved.planningContext).toBe(firstContext);
  expect(saved.contextVersion).toBe(2); expect(saved.flowCode).toBeTruthy();
  await expect.poll(() => !!api.data()["abb:composer"]).toBe(true);
  await page.reload();
  await page.getByTestId("flow-node").first().click(); await editStepOptions(page);
  await expect(page.getByTestId("step-instructions")).toHaveValue("Keep this manually edited instruction.");
  await page.getByTestId("step-panel").getByRole("button", { name: "Close", exact: true }).click();
  await planOptions(page);
  await page.getByText("Add context and constraints", { exact: true }).click();
  await expect(page.getByLabel("Audience, offer, available inputs and limits")).toHaveValue("Use the supplied CSV only.");
  await submitPlan(page); await expect.poll(() => api.sent.length).toBe(2);
  expect(api.sent[1].context).toBe(firstContext);
  await include.uncheck(); await submitPlan(page); await expect.poll(() => api.sent.length).toBe(3);
  expect(api.sent[2].context).toBe("Use the supplied CSV only.");
});

test("legacy planner exports retain old notes with automatic profile appending off", async ({ page }) => {
  const api = await setup(page, true); await openAccountPage(page, "/compose");
  await expect(page.getByTestId("flow-node")).toHaveCount(1);
  await planOptions(page);
  await page.getByText("Add context and constraints", { exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Use relevant parts of my saved me.md" })).not.toBeChecked();
  await submitPlan(page); await expect.poll(() => api.sent.length).toBe(1);
  expect(api.sent[0].context).toBe("Legacy notes and saved Core from the original export.");
});

test("free matching stays model-free and opens a skill with before and after additions", async ({ page }) => {
  const api = await setup(page); await openAccountPage(page, "/compose"); await choosePlanner(page, "free");
  await page.getByTestId("compose-goal").fill("Write a brand voice guide"); await submitPlan(page);
  await expect(page.getByTestId("plan-ready")).toBeVisible();
  await page.getByTestId("compose-pick-start").click();
  await expect(page.getByTestId("compose-start")).toBeVisible();
  await page.getByRole("button", { name: "Start with: Voice and tone guide writer", exact: true }).click();
  await expect(page.getByTestId("builder")).toBeVisible();
  await expect(page.getByTestId("chain-before")).toBeVisible(); await expect(page.getByTestId("chain-after")).toBeVisible();
  await page.getByTestId("chain-before").getByRole("button", { name: /^Add before:/ }).first().click();
  await expect(page.getByTestId("flow-node")).toHaveCount(2);
  expect(api.sent).toHaveLength(0);
});

test("builder AI assist uses the same saved context and honors its opt-out", async ({ page }) => {
  const api = await setup(page); await openAccountPage(page, "/#build");
  await expect(page.getByTestId("builder")).toBeVisible();
  await page.getByTestId("builder-use-ai").click();
  await page.getByTestId("builder-ai-goal").fill(goal);
  await page.getByTestId("builder-ai-assign-minds").uncheck();
  await page.getByText("Add context (optional)", { exact: true }).click();
  const include = page.getByRole("checkbox", { name: "Use relevant parts of my saved me.md" });
  await expect(include).toBeChecked();
  await page.getByTestId("builder-ai-create").click(); await expect.poll(() => api.sent.length).toBe(1);
  expect(api.sent[0].context).toContain("Research editing for science teams");
  await expect(page.getByRole("textbox", { name: "Workflow name", exact: true })).toHaveValue(plan.title);
  if (!await page.getByTestId("builder-ai-assist").isVisible()) await page.getByTestId("builder-use-ai").click();
  await page.getByTestId("builder-ai-goal").fill(goal);
  if (!await include.isVisible()) await page.getByText("Add context (optional)", { exact: true }).click();
  await include.uncheck();
  await page.getByTestId("builder-ai-create").click(); await expect.poll(() => api.sent.length).toBe(2);
  expect(api.sent[1].context).toBe("");
});

test("@mobile saved-context controls and the resulting workflow fit a phone", async ({ page }, info) => {
  const api = await setup(page); await openAccountPage(page, "/compose");
  await page.getByTestId("compose-goal").fill(goal); await planOptions(page);
  await page.getByText("Add context and constraints", { exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Use relevant parts of my saved me.md" })).toBeChecked();
  await page.getByLabel("Audience, offer, available inputs and limits").fill("Use the supplied CSV only.");
  await page.getByTestId("compose-assign-minds").uncheck(); await submitPlan(page);
  await expect(page.getByTestId("compose-download")).toBeVisible();
  expect(api.sent).toHaveLength(1); expect(api.sent[0].context).toContain("Research editing for science teams");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("context-workflow-mobile.png"), fullPage: true });
});

test("the full 12,000-character context reopens and downloads as unvalidated planning context", async ({ page }, info) => {
  const api = await setup(page); await openAccountPage(page, "/compose");
  await page.getByTestId("compose-goal").fill(goal); await planOptions(page);
  await page.getByText("Add context and constraints", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Use relevant parts of my saved me.md" }).uncheck();
  const notes = "Synthetic source notes: preserve every character.\n".padEnd(12000, "x");
  await page.getByLabel("Audience, offer, available inputs and limits").fill(notes);
  await page.getByTestId("compose-assign-minds").uncheck(); await submitPlan(page);
  await expect(page.getByTestId("flow-node")).toHaveCount(1);
  expect(api.sent[0].context).toBe(notes);
  await expect(page.getByTestId("workflow-inputs")).toContainText("Inputs your AI will check");
  await expect.poll(() => !!api.data()["abb:composer"]).toBe(true);
  await page.reload(); await expect(page.getByTestId("flow-node")).toHaveCount(1);
  await planOptions(page); await page.getByText("Add context and constraints", { exact: true }).click();
  await expect(page.getByLabel("Audience, offer, available inputs and limits")).toHaveValue(notes);
  const download = page.waitForEvent("download"); await page.getByTestId("compose-download").click();
  const zip = await download, file = info.outputPath(zip.suggestedFilename()); await zip.saveAs(file);
  const files = unzipSync(await fs.readFile(file));
  const inputs = JSON.parse(strFromU8(files["inputs.json"]));
  expect(inputs.planning_context.status).toBe("PROVIDED_UNVALIDATED");
  expect(inputs.planning_context.data.context).toBe(notes);
  expect(inputs.planning_context.data.status).toBe("verify-supplied-context-first");
  expect(inputs.inputs.every((input: any) => input.status === "MISSING" && input.acceptance_decision === null)).toBe(true);
  expect(files["me.md"]).toBeUndefined();
});
