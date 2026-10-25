import { test, expect, type Page, type Route } from "@playwright/test";
import { mockComposerAccount } from "./fixtures/composer-account";
import fs from "node:fs/promises";
import { unzipSync } from "fflate";
import { exportEditable } from "./fixtures/workflow-ui";

// Every AI request and account write is intercepted. These tests never call a provider.
const models = ["gpt-6-luna", "gpt-6.1-sol", "claude-haiku-5-5"].map(id => ({ id, label: id, available: true }));
const goal = "Write a checked weekly report from my sales notes";
const plan = { title: "Fixture checked weekly report", summary: "A plan to write the requested report from supplied facts.", steps: [{ slug: "request-deliverable-drafter", reason: "Write the requested report.", notes: "Use only supplied sales notes. Save weekly-report.md and check every figure against the source. Report missing evidence.", minds: ["steve-jobs"] }], questionIds: [], assumptions: [] };
type Usage = { completed: number; attemptsToday: number; dailyAttemptLimit: number | null; unlimited?: boolean; dailyIpAttemptLimit?: number | null };
async function setup(page: Page, signedIn = true, usage: Usage = { completed: 0, attemptsToday: 0, dailyAttemptLimit: 5 }) {
  await page.route("**/api/**", route => {
    if (!["GET", "HEAD"].includes(route.request().method())) return route.fulfill({ status: 401, json: { error: "Fixture blocks account writes" } });
    return route.fulfill({ status: 401, json: { error: "Fixture unavailable" } });
  });
  await mockComposerAccount(page, signedIn);
  await page.route("**/api/auth?usage", route => route.fulfill({ json: usage }));
  await page.route("**/api/comments*", route => route.fulfill({ json: { enabled: false, comments: [] } }));
  // Exercise the challenge lifecycle on local and hosted origins. Only the SDK
  // boundary is simulated; every protected POST below remains intercepted.
  await page.addInitScript(() => {
    let issued = 0;
    (window as any).turnstile = {
      render(_element: HTMLElement, options: { callback: (token: string) => void }) {
        const id = `builder-ui-fixture-${++issued}`;
        queueMicrotask(() => options.callback(id));
        return id;
      },
      remove() {},
    };
  });
  await page.route("**/api/security", route => route.fulfill({ json: { required: true, sitekey: "builder-ui-fixture" } }));
  await page.route("**/api/compose", route => route.request().method() === "POST" ? route.fulfill({ status: 500, json: { error: "Unexpected fixture AI request" } }) : route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } }));
}
async function open(page: Page, existing = false) {
  await page.goto("/#build");
  await expect(page.getByTestId("builder")).toBeVisible({ timeout: 20000 });
  await page.locator("#app-loader").waitFor({ state: "hidden" });
  const reject = page.getByRole("button", { name: /Reject cookies/i });
  if (await reject.isVisible()) await reject.click();
  await expect(page.getByTestId("workflow-customize")).toHaveAttribute("aria-expanded", "true");
  if (existing) {
    await page.getByTestId("chain-start").getByRole("button", { name: /^Use first:/ }).first().click();
    await page.getByRole("textbox", { name: "Workflow name", exact: true }).fill("Keep my existing workflow");
  }
  await page.getByTestId("builder-use-ai").click();
  await expect(page.getByTestId("builder-ai-assist")).toBeVisible();
}
async function settle(route: Route, body = { plan, model: "gpt-6-luna" }) { try { await route.fulfill({ json: body }); } catch { /* An intentionally aborted request has no response consumer. */ } }
async function unchanged(page: Page) { await expect(page.getByRole("textbox", { name: "Workflow name", exact: true })).toHaveValue("Keep my existing workflow"); }
async function browserWorkflowState(page: Page) {
  return page.evaluate(() => {
    // Signed-in saves are isolated by account and tab; the abb:v1 state lives inside that local envelope.
    const account = Object.entries(localStorage).filter(([key]) => key.startsWith("abb:account-library/1:user_browser_fixture:"))
      .map(([, value]) => JSON.parse(value)).sort((a, b) => b.at - a.at)[0];
    return JSON.parse(account?.data?.["abb:v1"] ?? localStorage.getItem("abb:v1") ?? "null");
  });
}

for (const tag of ["", "@mobile "]) {
  test(tag + "builder sign-up and sign-in preserve the draft and never generate on return", async ({ page }) => {
    await setup(page, false); let posts = 0;
    page.on("request", request => { if (request.method() === "POST" && new URL(request.url()).pathname === "/api/compose") posts++; });
    await open(page);
    const panel = page.getByTestId("builder-ai-assist");
    await expect(page.getByTestId("builder-ai-assign-minds")).toBeChecked();
    await page.getByTestId("builder-ai-assign-minds").uncheck();
    await page.getByTestId("builder-ai-goal").fill(goal);
    await panel.getByText("Add context (optional)", { exact: true }).click();
    await page.getByLabel("Audience, available material or limits").fill("Use only my supplied notes.");
    for (const [label, key] of [["Sign up free", "fixture:signup"], ["Sign in", "fixture:redirect"]]) {
      await panel.getByRole("button", { name: label, exact: true }).click();
      await expect.poll(() => page.evaluate(key => sessionStorage.getItem(key), key)).toBeTruthy();
      const [redirect, draft] = await page.evaluate(key => [JSON.parse(sessionStorage.getItem(key)!), JSON.parse(sessionStorage.getItem("abb:builder-ai-signin")!)], key);
      expect(new URL(redirect.signInForceRedirectUrl).hash).toBe("#build");
      expect(new URL(redirect.signUpForceRedirectUrl).pathname).toBe("/");
      expect(draft.goal).toBe(goal); expect(draft.context).toBe("Use only my supplied notes.");
      expect(draft.assignMinds).toBe(false);
    }
    // A real redirect loads the authenticated SDK before mounting the form again.
    await page.evaluate(() => sessionStorage.setItem("fixture:active-user", JSON.stringify("signed_in_after_redirect")));
    await page.reload(); await page.getByTestId("builder-use-ai").click();
    await expect(page.getByTestId("builder-ai-create")).toBeVisible();
    await expect(page.getByTestId("builder-ai-assign-minds")).not.toBeChecked();
    expect(posts).toBe(0);
    await expect(page.getByTestId("builder-ai-goal")).toHaveValue(goal);
    await panel.getByRole("link", { name: "More planning options", exact: true }).click();
    await expect(page).toHaveURL(/\/compose$/);
    await expect(page.getByTestId("compose-assign-minds")).not.toBeChecked();
    await expect(page.getByTestId("compose-goal")).toHaveValue(goal);
    expect(posts).toBe(0);
  });

  test(tag + "builder sends only the selected available AI model and applies a validated successful plan", async ({ page }) => {
    await setup(page); const sent: any[] = [];
    await page.route("**/api/compose", route => {
      if (route.request().method() !== "POST") return route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } });
      sent.push({ body: route.request().postDataJSON(), headers: route.request().headers() });
      return settle(route, { plan: route.request().postDataJSON().assignMinds ? plan : { ...plan, steps: plan.steps.map(step => ({ ...step, minds: [] })) }, model: route.request().postDataJSON().model });
    });
    await open(page, true);
    await expect(page.getByTestId("builder-ai-model")).toHaveValue("gpt-6-luna");
    for (const { id } of models) {
      const assignMinds = id !== "claude-haiku-5-5";
      await page.getByTestId("builder-ai-assign-minds").setChecked(assignMinds);
      await page.getByTestId("builder-ai-goal").fill(goal);
      await page.getByTestId("builder-ai-model").selectOption(id);
      await page.getByTestId("builder-ai-create").click();
      await expect(page.getByRole("textbox", { name: "Workflow name", exact: true })).toHaveValue(plan.title);
      await expect(page.getByTestId("builder-ai-create")).toBeEnabled();
      expect(sent.at(-1).body).toEqual({ goal, context: "", choices: {}, model: id, assignMinds });
      expect(sent.at(-1).headers.authorization).toBe("Bearer browser-fixture-session");
      expect(sent.at(-1).headers["x-turnstile-token"]).toMatch(/^builder-ui-fixture-/);
      expect(sent.at(-1).headers["idempotency-key"]).toBeTruthy();
      await expect.poll(async () => (await browserWorkflowState(page))?.draft?.nodes[0]?.minds).toEqual(assignMinds ? ["steve-jobs"] : []);
    }
    expect(sent).toHaveLength(3);
    await expect(page.getByTestId("download-handoff")).toBeEnabled();
  });

  test(tag + "legacy long draft is preserved and must be shortened to the 3000-character limit", async ({ page }) => {
    await setup(page); const legacy = "A saved report request. ".repeat(180); let posts = 0;
    await page.addInitScript(value => sessionStorage.setItem("abb:builder-ai-signin", JSON.stringify({ goal: value, context: "Keep this context", savedAt: Date.now(), userId: null })), legacy);
    page.on("request", request => { if (request.method() === "POST" && new URL(request.url()).pathname === "/api/compose") posts++; });
    await open(page);
    await expect(page.getByTestId("builder-ai-goal")).toHaveValue(legacy);
    await expect(page.getByTestId("builder-ai-goal")).toHaveAttribute("maxlength", "3000");
    await expect(page.getByTestId("builder-ai-create")).toBeDisabled();
    await expect(page.getByTestId("builder-ai-assist")).toContainText("Shorten this draft");
    await page.getByTestId("builder-ai-goal").fill("a".repeat(3001));
    await expect(page.getByTestId("builder-ai-goal")).toHaveValue("a".repeat(3000));
    await expect(page.getByTestId("builder-ai-create")).toBeEnabled();
    expect(posts).toBe(0);
  });

  test(tag + "duplicate submit, cancellation and API errors preserve the current workflow and request", async ({ page }) => {
    await setup(page); let pending: Route | undefined, posts = 0;
    await page.route("**/api/compose", route => {
      if (route.request().method() !== "POST") return route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } });
      posts++; pending = route;
    });
    await open(page, true); await page.getByTestId("builder-ai-goal").fill(goal);
    await page.getByTestId("builder-ai-create").click();
    await expect.poll(() => posts).toBe(1);
    await expect(page.getByTestId("builder-ai-assign-minds")).toBeDisabled();
    await page.getByTestId("builder-ai-assist").locator("form").evaluate(form => { form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); });
    expect(posts).toBe(1); await unchanged(page);
    await page.getByTestId("builder-ai-assist").getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(page.getByTestId("builder-ai-assist").getByRole("alert")).toContainText("Planning stopped");
    await settle(pending!); await unchanged(page);
    await expect(page.getByTestId("builder-ai-goal")).toHaveValue(goal);
    await page.route("**/api/compose", route => route.request().method() === "POST" ? route.fulfill({ status: 429, json: { error: "The daily allowance is reached. Try tomorrow." } }) : route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } }));
    await page.getByTestId("builder-ai-create").click();
    await expect(page.getByTestId("builder-ai-assist").getByRole("alert")).toContainText("daily allowance");
    await unchanged(page); await expect(page.getByTestId("builder-ai-goal")).toHaveValue(goal);
  });

  test(tag + "late AI responses and private draft are discarded after switching account", async ({ page }) => {
    await setup(page); let pending: Route | undefined, posts = 0;
    await page.route("**/api/compose", route => { if (route.request().method() === "POST") { posts++; pending = route; return; } return route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } }); });
    await open(page, true); await page.getByTestId("builder-ai-goal").fill(goal);
    await page.getByTestId("builder-ai-create").click(); await expect.poll(() => posts).toBe(1);
    await page.evaluate(() => (window as any).__switchMindAccount("different_user"));
    // The outer account boundary remounts Builder, closing its local AI panel.
    await expect(page.getByTestId("builder-ai-assist")).toHaveCount(0);
    await page.getByTestId("builder-use-ai").click();
    await expect(page.getByTestId("builder-ai-goal")).toHaveValue("");
    const newAccountName = await page.getByRole("textbox", { name: "Workflow name", exact: true }).inputValue();
    await settle(pending!);
    await expect(page.getByRole("textbox", { name: "Workflow name", exact: true })).toHaveValue(newAccountName);
    expect(newAccountName).not.toBe(plan.title);
  });

  test(tag + "late AI response cannot change an existing workflow after closing AI assist", async ({ page }) => {
    await setup(page); let pending: Route | undefined;
    await page.route("**/api/compose", route => { if (route.request().method() === "POST") { pending = route; return; } return route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } }); });
    await open(page, true); await page.getByTestId("builder-ai-goal").fill(goal);
    await page.getByTestId("builder-ai-create").click(); await expect.poll(() => !!pending).toBe(true);
    await page.getByRole("group", { name: "Build your workflow", exact: true }).getByRole("button", { name: "Choose steps", exact: true }).click();
    await expect(page.getByTestId("builder-ai-assist")).toHaveCount(0);
    await settle(pending!); await unchanged(page);
  });

  test(tag + "successful pending AI request preserves the latest manual workflow edits as a saved copy", async ({ page }) => {
    await setup(page); let pending: Route | undefined;
    await page.route("**/api/compose", route => { if (route.request().method() === "POST") { pending = route; return; } return route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } }); });
    await open(page, true); await page.getByTestId("builder-ai-goal").fill(goal);
    await page.getByTestId("builder-ai-create").click(); await expect.poll(() => !!pending).toBe(true);
    await page.getByRole("textbox", { name: "Workflow name", exact: true }).fill("Latest manual edits while AI is working");
    await page.getByTestId("workflow-list-view").click();
    await page.getByTestId("step-open").first().click();
    const step = page.getByTestId("step-panel");
    await step.getByText("Edit instructions", { exact: true }).click();
    await step.getByTestId("step-instructions").fill("Keep this new instruction added while the AI request is pending.");
    await step.getByRole("button", { name: "Close", exact: true }).click();
    await page.getByTestId("palette-all").click();
    await page.getByTestId("palette-search").fill("request-acceptance-checker");
    await page.locator('.chain-card[data-slug="request-acceptance-checker"]').getByRole("button", { name: /^Add after:/ }).click();
    await expect.poll(async () => (await browserWorkflowState(page))?.draft?.nodes.length).toBe(2);
    const edited = (await browserWorkflowState(page)).draft;
    expect(edited.name).toBe("Latest manual edits while AI is working");
    expect(edited.nodes[0].notes).toBe("Keep this new instruction added while the AI request is pending.");
    expect(edited.edges).toHaveLength(1);
    await settle(pending!);
    await expect(page.getByRole("textbox", { name: "Workflow name", exact: true })).toHaveValue(plan.title);
    await expect.poll(async () => (await browserWorkflowState(page))?.draft?.name).toBe(plan.title);
    const after = await browserWorkflowState(page), saved = after.flows.find((flow: any) => flow.id === edited.id);
    expect(saved, "The original workflow must be saved with its latest edits before the AI plan replaces the open draft").toBeTruthy();
    for (const key of ["name", "nodes", "edges", "goal", "notes", "team", "overseer"]) expect(saved[key], key).toEqual(edited[key]);
    expect(after.draft.id).not.toBe(edited.id);
    expect(after.draft.name).toBe(plan.title);
    expect(after.draft.nodes.map((node: any) => node.slug)).toEqual(plan.steps.map(step => step.slug));
  });

  test(tag + "server unlimited flag changes the allowance while unavailable models stay disabled", async ({ page }) => {
    await setup(page, true, { completed: 99, attemptsToday: 99, dailyAttemptLimit: null, unlimited: true, dailyIpAttemptLimit: 10 });
    await page.route("**/api/compose", route => route.fulfill({ json: { enabled: true, models: models.map(model => ({ ...model, available: model.id !== "claude-haiku-5-5" })), defaultModel: "gpt-6-luna" } }));
    await open(page); await page.getByTestId("builder-ai-goal").fill(goal);
    await expect(page.getByTestId("builder-ai-account")).toContainText("No daily workflow count limit");
    await expect(page.getByTestId("builder-ai-account")).toContainText("network limit of 10 attempts per day");
    await expect(page.getByTestId("builder-ai-create")).toBeEnabled();
    expect(await page.getByTestId("builder-ai-model").locator('option[value="claude-haiku-5-5"]').evaluate(option => (option as HTMLOptionElement).disabled)).toBe(true);
    await page.route("**/api/auth?usage", route => route.fulfill({ json: { completed: 5, attemptsToday: 5, dailyAttemptLimit: 5, unlimited: false } }));
    await page.reload(); await page.getByTestId("builder-use-ai").click(); await page.getByTestId("builder-ai-goal").fill(goal);
    await expect(page.getByTestId("builder-ai-account")).toContainText("0 of 5 attempts left today");
    await expect(page.getByTestId("builder-ai-create")).toBeDisabled();
  });

  test(tag + "invalid AI mind assignment is rejected without changing the current workflow", async ({ page }) => {
    await setup(page);
    await page.route("**/api/compose", route => route.request().method() === "POST" ? route.fulfill({ json: { plan: { ...plan, steps: plan.steps.map(step => ({ ...step, minds: ["not-a-real-mind"] })) } } }) : route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } }));
    await open(page, true); await page.getByTestId("builder-ai-goal").fill(goal);
    await page.getByTestId("builder-ai-create").click();
    await expect(page.getByTestId("builder-ai-assist").getByRole("alert")).toContainText("invalid mind assignments");
    await unchanged(page); await expect(page.getByTestId("builder-ai-goal")).toHaveValue(goal);
  });

  test(tag + "composer keeps the mind preference through sign-in and exports assigned minds as a complete council", async ({ page }) => {
    await setup(page, false); const sent: any[] = [];
    await page.route("**/api/compose", route => {
      if (route.request().method() !== "POST") return route.fulfill({ json: { enabled: true, models, defaultModel: "gpt-6-luna" } });
      const body = route.request().postDataJSON(); sent.push(body);
      return route.fulfill({ json: { plan: { ...plan, steps: plan.steps.map(step => ({ ...step, minds: body.assignMinds ? ["steve-jobs", "jeff-bezos"] : [] })) }, model: "gpt-6-luna", cost: 0, latencyMs: 0 } });
    });
    await page.goto("/compose");
    await expect(page.getByTestId("compose-assign-minds")).toBeChecked();
    await page.getByTestId("compose-assign-minds").uncheck();
    await page.getByTestId("compose-goal").fill(goal);
    await page.getByTestId("compose-submit").click();
    await page.getByTestId("compose-account").getByRole("button", { name: "Sign in", exact: true }).click();
    expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("abb:composer-signin")!).assignMinds)).toBe(false);
    await page.evaluate(() => sessionStorage.setItem("fixture:active-user", JSON.stringify("user_browser_fixture")));
    await page.reload();
    await expect(page.getByTestId("compose-assign-minds")).not.toBeChecked();
    await expect(page.getByTestId("compose-goal")).toHaveValue(goal);
    expect(sent).toHaveLength(0);
    if (await page.getByTestId("compose-submit").textContent() === "Continue") await page.getByTestId("compose-submit").click();
    await expect(page.getByTestId("compose-submit")).toBeEnabled(); await page.getByTestId("compose-submit").click();
    await expect(page.getByTestId("plan-ready")).toBeVisible(); expect(sent[0].assignMinds).toBe(false);
    const [editable] = await Promise.all([page.waitForEvent("download"), exportEditable(page)]);
    const saved = JSON.parse(await fs.readFile((await editable.path())!, "utf8"));
    expect(saved.assignMinds).toBe(false); expect(saved.plan.steps.every((step: any) => step.minds.length === 0)).toBe(true);
    await page.getByTestId("compose-assign-minds").check();
    await expect(page.getByTestId("compose-steps").getByTestId("node-mind")).toHaveCount(0);
    await page.getByTestId("compose-submit").click();
    await expect(page.getByTestId("plan-ready")).toBeVisible(); expect(sent[1].assignMinds).toBe(true);
    const [pack] = await Promise.all([page.waitForEvent("download"), page.getByTestId("compose-download").click()]);
    expect(await pack.failure()).toBeNull();
    const files = unzipSync(await fs.readFile((await pack.path())!));
    expect(files["TASK-COUNCIL.md"]).toBeTruthy();
    for (const mind of ["steve-jobs", "jeff-bezos"]) {
      expect(files[`skills/${mind}/SKILL.md`]).toBeTruthy();
      expect(Object.keys(files).filter(path => path.startsWith(`skills/${mind}/`)).length).toBeGreaterThan(1);
    }
  });

  test(tag + "inline AI assist remains readable, clickable and separate from the diagram in both themes", async ({ page }, info) => {
    await setup(page, false); await open(page, true);
    for (const width of info.project.name === "mobile" ? [320, 390] : [1440]) for (const theme of ["dark", "light"]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
      await page.getByTestId("builder-ai-goal").fill(goal);
      const panel = page.getByTestId("builder-ai-assist"), box = await panel.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      const stagebar = await page.locator(".stage-bar").boundingBox(), diagram = await page.locator(".react-flow").boundingBox();
      expect(box!.y).toBeGreaterThanOrEqual(stagebar!.y + stagebar!.height - 1);
      expect(diagram!.y).toBeGreaterThanOrEqual(box!.y + box!.height - 1);
      for (const control of [page.getByTestId("builder-ai-goal"), page.getByTestId("builder-ai-model"), panel.getByRole("button", { name: "Sign up free", exact: true })]) {
        await control.scrollIntoViewIfNeeded();
        expect(await control.evaluate(element => { const box = element.getBoundingClientRect(); const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2); return !!top && (element === top || element.contains(top)); })).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: info.outputPath(`builder-ai-${width}-${theme}.png`), fullPage: false });
    }
  });
}
