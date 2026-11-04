import { choosePlanner, submitPlan, exportEditable, editStepOptions, planOptions } from "./fixtures/workflow-ui";
import { test, expect } from "./fixtures/composer-staging-test";
import fs from "node:fs";
import { unzipSync, strFromU8 } from "fflate";
import { mockComposerAccount } from "./fixtures/composer-account";
const fixture = JSON.parse(fs.readFileSync("test/fixtures/composer-plans.json", "utf8"));

test.beforeEach(async ({ page }, info) => { if (info.project.name === "desktop") await page.addInitScript(() => localStorage.setItem("abb:workflow-view", "diagram")); });

for (const task of fixture.cases) test(`real Haiku output exports a complete pack: ${task.id}`, async ({ page }, info) => {
  await page.goto("/compose"); await choosePlanner(page, "free");
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ format: "ai-blocks-composition/1", goal: task.goal, context: "", choices: {}, plan: task.plan, model: task.model, cost: task.cost })) });
  await expect(page.getByTestId("compose-steps").getByTestId("flow-node")).toHaveCount(task.plan.steps.length);
  const event = page.waitForEvent("download"); await page.getByTestId("compose-download").click(); const downloaded = await event;
  const file = info.outputPath(downloaded.suggestedFilename()); await downloaded.saveAs(file);
  const files = unzipSync(fs.readFileSync(file));
  for (const step of task.plan.steps) expect(files[`skills/${step.slug}/SKILL.md`], step.slug).toBeTruthy();
  for (const name of ["workflow.json", "workflow.edit.json", "README.md", "HANDOFF.md", "inputs.json"]) expect(files[name], name).toBeTruthy();
  expect(JSON.parse(strFromU8(files["workflow.json"])).steps).toHaveLength(task.plan.steps.length);
  expect(strFromU8(files["README.md"])).toContain("No skills have run");
});

test("free composition edits, exports, restores and downloads a complete runnable pack without model calls", async ({ page }, info) => {
  let paidCalls = 0; page.on("request", req => { if (req.method() === "POST" && req.url().includes("/api/compose")) paidCalls++; });
  await page.goto("/compose"); await choosePlanner(page, "free");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Build a workflow");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver source code");
  await submitPlan(page);
  await expect(page.getByTestId("compose-steps")).toContainText("React landing page builder");
  await expect(page.getByTestId("compose-steps")).toContainText("Human review gate");
  await page.getByTestId("flow-node").first().click(); await editStepOptions(page);
  await page.getByTestId("step-instructions").fill("Use the supplied offer. Hand the checked copy to the next step.");
  const exportEvent = page.waitForEvent("download"); await exportEditable(page); const exported = await exportEvent;
  const exportedFile = info.outputPath("workflow.edit.json"); await exported.saveAs(exportedFile);
  const saved = JSON.parse(fs.readFileSync(exportedFile, "utf8")); expect(saved.flowCode).toBeTruthy();
  await page.reload(); await page.getByTestId("flow-node").first().click(); await editStepOptions(page); await expect(page.getByTestId("step-instructions")).toHaveValue("Use the supplied offer. Hand the checked copy to the next step."); await page.getByTestId("step-panel").getByRole("button", { name: "Close", exact: true }).click();
  const zipEvent = page.waitForEvent("download"); await page.getByTestId("compose-download").click(); const zip = await zipEvent;
  const zipFile = info.outputPath(zip.suggestedFilename()); await zip.saveAs(zipFile);
  const files = unzipSync(fs.readFileSync(zipFile));
  for (const name of ["README.md", "HANDOFF.md", "workflow.json", "workflow.edit.json", "inputs.json"]) expect(files[name], name).toBeTruthy();
  expect(strFromU8(files["HANDOFF.md"])).toContain("Action boundaries");
  expect(strFromU8(files["HANDOFF.md"])).toContain("compatible local preview");
  const machine = JSON.parse(strFromU8(files["workflow.json"])); expect(machine.steps[0].your_notes).toContain("supplied offer"); expect(machine.steps.some((s: any) => s.input_bindings.length)).toBeTruthy();
  for (const step of saved.plan.steps) expect(files[`skills/${step.slug}/SKILL.md`]).toBeTruthy();
  await page.getByLabel("Import workflow JSON").setInputFiles(exportedFile);
  await expect(page.getByTestId("compose-steps")).toContainText("React landing page builder");
  expect(paidCalls).toBe(0);
});

test("greetings are rejected, backend model choice stays private and errors stay usable", async ({ page }) => {
  await mockComposerAccount(page);
  // This one test is a fully simulated paid-error UI flow. No real challenge or
  // protected POST reaches staging; live security enforcement is tested separately.
  await page.route("**/api/security", route => route.fulfill({ json: { required: true, sitekey: "composer-ui-fixture" } }));
  await page.addInitScript(() => {
    (window as any).turnstile = {
      render(element: HTMLElement, options: any) {
        const button = document.createElement("button");
        button.textContent = "Complete simulated verification";
        button.onclick = () => options.callback("composer-ui-fixture-token");
        element.append(button); return "composer-ui-fixture";
      },
      remove() {},
    };
  });
  // Model availability is a fixture, so this UI test also runs with production AI disabled.
  await page.route("**/api/compose", async route => {
    if (route.request().method() === "POST") return route.fulfill({ status: 429, json: { error: "The daily allowance is reached. Free assembly is still available." } });
    await route.fulfill({ json: { enabled: true } });
  });
  await page.goto("/compose"); await choosePlanner(page, "free"); await page.getByTestId("compose-goal").fill("How are you?"); await submitPlan(page);
  await expect(page.getByRole("alert")).toContainText("Describe a result");
  await choosePlanner(page, "ai");
  await expect(page.getByTestId("compose-model")).toHaveCount(0);
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  // All POSTs are mocked; no provider call is made.
  await expect(page.getByTestId("compose-submit")).toBeEnabled(); await submitPlan(page);
  await page.getByRole("button", { name: "Complete simulated verification" }).click();
  await expect(page.getByRole("alert")).toContainText("daily allowance");
  await choosePlanner(page, "free"); await submitPlan(page);
  await expect(page.getByTestId("compose-steps")).toContainText("landing page");
});

test("voice keeps typing available when microphone permission is denied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", { value: { getUserMedia: async () => { throw new DOMException("Denied", "NotAllowedError"); } }, configurable: true });
  });
  await page.goto("/compose"); await choosePlanner(page, "free");
  const goal = page.getByTestId("compose-goal");
  await expect(goal).toHaveAttribute("maxlength", "10000");
  await goal.fill("Build a landing page"); await page.getByTestId("compose-voice").click();
  await expect(page.getByText("Microphone permission was denied.", { exact: false })).toBeVisible();
  await expect(goal).toBeEnabled(); await expect(page.getByTestId("compose-submit")).toBeEnabled();
  await expect(goal).toHaveValue("Build a landing page");
});

test("a composed workflow opens in the existing builder with its notes", async ({ page }) => {
  await page.goto("/compose"); await choosePlanner(page, "free"); await page.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver code"); await submitPlan(page);
  await page.getByRole("button", { name: "Open in the full builder", exact: true }).click();
  await expect(page).toHaveURL(/#build/); await expect(page.locator(".builder")).toContainText("React landing page builder");
});

test("@mobile composer questions, steps and downloads fit the screen", async ({ page }, info) => {
  await page.goto("/compose"); await choosePlanner(page, "free"); await page.getByTestId("compose-goal").fill("Build a landing page");
  await planOptions(page); await page.getByLabel("What should the landing-page workflow hand back?").selectOption("code");
  await submitPlan(page); await expect(page.getByTestId("compose-download")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: info.outputPath("composer-mobile.png"), fullPage: true });
});
