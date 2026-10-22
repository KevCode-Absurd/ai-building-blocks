import { test, expect } from "./fixtures/composer-staging-test";
import fs from "node:fs";
import { unzipSync, strFromU8 } from "fflate";
import { mockComposerAccount } from "./fixtures/composer-account";
const fixture = JSON.parse(fs.readFileSync("test/fixtures/composer-plans.json", "utf8"));

for (const task of fixture.cases) test(`real Haiku output exports a complete pack: ${task.id}`, async ({ page }, info) => {
  await page.goto("/compose");
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ format: "ai-blocks-composition/1", goal: task.goal, context: "", choices: {}, plan: task.plan, model: task.model, cost: task.cost })) });
  await expect(page.getByTestId("compose-steps").locator(":scope > li")).toHaveCount(task.plan.steps.length);
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
  await page.goto("/compose");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Get a workflow");
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver source code");
  await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-steps")).toContainText("React landing page builder");
  await expect(page.getByTestId("compose-steps")).toContainText("Human review gate");
  await page.getByText("Edit step instructions", { exact: true }).first().click();
  await page.getByLabel("Instructions for step 1", { exact: true }).fill("Use the supplied offer. Hand the checked copy to the next step.");
  const exportEvent = page.waitForEvent("download"); await page.getByTestId("compose-export").click(); const exported = await exportEvent;
  const exportedFile = info.outputPath("workflow.edit.json"); await exported.saveAs(exportedFile);
  const saved = JSON.parse(fs.readFileSync(exportedFile, "utf8")); expect(saved.plan.steps[0].notes).toContain("supplied offer");
  await page.reload(); await expect(page.getByLabel("Instructions for step 1", { exact: true })).toHaveCount(1);
  const zipEvent = page.waitForEvent("download"); await page.getByTestId("compose-download").click(); const zip = await zipEvent;
  const zipFile = info.outputPath(zip.suggestedFilename()); await zip.saveAs(zipFile);
  const files = unzipSync(fs.readFileSync(zipFile));
  for (const name of ["README.md", "HANDOFF.md", "workflow.json", "workflow.edit.json", "inputs.json"]) expect(files[name], name).toBeTruthy();
  expect(strFromU8(files["HANDOFF.md"])).toContain("Action boundaries");
  expect(strFromU8(files["HANDOFF.md"])).toContain("compatible local preview");
  const machine = JSON.parse(strFromU8(files["workflow.json"])); expect(machine.steps.some((s: any) => s.input_bindings.length)).toBeTruthy();
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
  await page.goto("/compose"); await page.getByTestId("compose-goal").fill("How are you?"); await page.getByTestId("compose-submit").click();
  await expect(page.getByRole("alert")).toContainText("Describe a result");
  await page.getByRole("tab", { name: "AI composition" }).click();
  await expect(page.getByTestId("compose-model")).toHaveCount(0);
  await page.getByTestId("compose-goal").fill("Build a landing page from scratch");
  // All POSTs are mocked; no provider call is made.
  await expect(page.getByTestId("compose-submit")).toBeEnabled(); await page.getByTestId("compose-submit").click();
  await page.getByRole("button", { name: "Complete simulated verification" }).click();
  await expect(page.getByRole("alert")).toContainText("daily allowance");
  await page.getByRole("tab", { name: "Free assembly" }).click(); await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-steps")).toContainText("landing page");
});

test("typed requests accept10,000 characters and voice has a cumulative five-minute cap", async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).SpeechRecognition = class {
      onresult: any; onend: any; onerror: any; stops = 0;
      constructor() { (window as any).__voice = this; }
      start() {}
      stop() { this.stops++; this.onend?.(); }
      abort() { this.stops++; }
      emit(text: string) { this.onresult?.({ results: [[{ transcript: text }]] }); }
    };
  });
  await page.clock.install(); await page.goto("/compose");
  const goal = page.getByTestId("compose-goal"), voice = page.getByTestId("compose-voice");
  await expect(page.getByLabel("Voice language", { exact: true })).toHaveCount(0);
  await expect(goal).toHaveAttribute("maxlength", "10000");
  await goal.fill("Build"); await voice.click();
  expect(await page.evaluate(() => (window as any).__voice.lang)).toBe("en-IN");
  expect(await page.evaluate(() => (window as any).__voice.lang)).toBe("en-IN");
  await page.evaluate(() => (window as any).__voice.emit("a landing page from scratch"));
  await expect(goal).toHaveValue("Build a landing page from scratch");
  await expect(page.getByTestId("compose-submit")).toBeDisabled();
  await page.clock.runFor(60000); await voice.click();
  await expect(page.getByRole("timer")).toHaveText("4:00 remaining");
  await voice.click(); await page.clock.runFor(240000);
  await expect(voice).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Five-minute voice limit");
  await expect(page.getByRole("timer")).toHaveText("0:00 remaining");
  await expect(page.getByTestId("compose-submit")).toBeEnabled();
});

test("voice transcript obeys the character cap and denied permission keeps typing available", async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).SpeechRecognition = class {
      onresult: any; onend: any; onerror: any;
      constructor() { (window as any).__voice = this; }
      start() {}
      stop() { this.onend?.(); }
      abort() {}
    };
  });
  await page.goto("/compose"); const goal = page.getByTestId("compose-goal");
  await goal.fill("Create a report ".padEnd(9998, "x")); await page.getByTestId("compose-voice").click();
  await page.evaluate(() => (window as any).__voice.onresult({ results: [[{ transcript: "more spoken words" }]] }));
  expect((await goal.inputValue()).length).toBe(10000);
  await expect(page.getByTestId("compose-voice")).toBeDisabled();
  await goal.fill("Build a landing page"); await page.getByTestId("compose-voice").click();
  await page.evaluate(() => (window as any).__voice.onerror({ error: "not-allowed" }));
  await expect(page.getByRole("status")).toContainText("permission was denied");
  await expect(goal).toBeEnabled(); await expect(page.getByTestId("compose-submit")).toBeEnabled();
});

test("a composed workflow opens in the existing builder with its notes", async ({ page }) => {
  await page.goto("/compose"); await page.getByTestId("compose-goal").fill("Build a landing page from scratch and deliver code"); await page.getByTestId("compose-submit").click();
  await page.getByRole("button", { name: "Open in the builder", exact: true }).click();
  await expect(page).toHaveURL(/#build/); await expect(page.locator(".builder")).toContainText("React landing page builder");
});

test("@mobile composer questions, steps and downloads fit the screen", async ({ page }) => {
  await page.goto("/compose"); await page.getByTestId("compose-goal").fill("Build a landing page");
  await page.getByLabel("What should the landing-page workflow hand back?").selectOption("code");
  await page.getByTestId("compose-submit").click(); await expect(page.getByTestId("compose-download")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: "test-results/composer-mobile.png", fullPage: true });
});
