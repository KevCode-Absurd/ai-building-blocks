import { test, expect } from "./fixtures/composer-staging-test";
import fs from "node:fs";
import { unzipSync, strFromU8, deflateSync, strToU8 } from "fflate";
import { GENERAL_CASES } from "../../tools/lib/workflow-general-cases.mjs";

const start = async (page: any, goal = "Build a landing page from scratch and deliver source code") => {
  await page.goto("/compose"); await page.getByTestId("compose-goal").fill(goal); await page.getByTestId("compose-submit").click();
  await expect(page.getByTestId("compose-steps").locator(":scope > li").first()).toBeVisible();
};
test.beforeEach(async ({ page }) => {
  await page.route("**/api/compose", r => r.request().method() === "GET" ? r.fulfill({ json: { enabled: false } }) : r.abort());
});
test("right-click replacement searches the repository, preserves notes and recomputes the pack", async ({ page }, info) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  await start(page);
  const steps = page.getByTestId("compose-steps").locator(":scope > li"); const count = await steps.count();
  await steps.first().getByText("Edit step instructions", { exact: true }).click();
  await page.getByLabel("Instructions for step 1", { exact: true }).fill("Keep my supplied offer and return a file.");
  await steps.first().click({ button: "right" }); await page.getByRole("menuitem", { name: "Replace skill…" }).click();
  const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible();
  await dialog.getByLabel("Search repository skills").fill("incident-runbook-writer");
  await dialog.getByRole("button").filter({ hasText: "Incident runbook writer" }).first().click();
  await expect(dialog.getByRole("status")).toContainText("Inputs to supply");
  await dialog.getByRole("button", { name: "Replace skill", exact: true }).click();
  await expect(steps).toHaveCount(count); await expect(steps.first()).toContainText("Incident runbook writer");
  expect(await page.getByLabel("Instructions for step 1", { exact: true }).inputValue()).toBe("Keep my supplied offer and return a file.");
  const event = page.waitForEvent("download"); await page.getByTestId("compose-download").click(); const pack = await event;
  const file = info.outputPath("replaced.zip"); await pack.saveAs(file); const files = unzipSync(fs.readFileSync(file));
  expect(files["skills/incident-runbook-writer/SKILL.md"]).toBeTruthy();
  expect(JSON.parse(strFromU8(files["workflow.edit.json"])).plan.steps[0].slug).toBe("incident-runbook-writer");
  expect(errors).toEqual([]);
});

test("a failed skill download can be retried without reloading the workflow", async ({ page }, info) => {
  let attempts = 0;
  await page.route("**/skills/ad-matched-landing-page-writer/SKILL.md", route => {
    attempts++;
    return attempts === 1 ? route.fulfill({ status: 503, contentType: "text/plain", body: "Temporary asset failure" }) : route.fallback();
  });
  await start(page);
  await page.getByTestId("compose-download").click();
  await expect(page.getByRole("alert")).toContainText("Couldn't load the complete files");
  expect(attempts).toBe(1);
  const event = page.waitForEvent("download");
  await page.getByTestId("compose-download").click();
  const pack = await event;
  const file = info.outputPath("retried-pack.zip"); await pack.saveAs(file);
  expect(unzipSync(fs.readFileSync(file))["skills/ad-matched-landing-page-writer/SKILL.md"]).toBeTruthy();
  expect(attempts).toBe(2);
});

test("uploaded skill survives JSON import, ZIP export, reload and canvas replacement", async ({ page, context }, info) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  let posts = 0; page.on("request", r => { if (r.method() === "POST" && r.url().includes("/api/compose")) posts++; });
  await start(page, "Create a wedding budget");
  await page.getByRole("button", { name: "Replace step 2", exact: true }).click();
  let dialog = page.getByRole("dialog"); await dialog.getByText("Upload your own skill", { exact: true }).click();
  await dialog.getByLabel("Upload custom skill").setInputFiles({ name: "bad.zip", mimeType: "application/zip", buffer: Buffer.from("bad") });
  await expect(dialog.getByRole("alert")).toContainText("self-contained");
  const markdown = "---\nname: My budget skill\ndescription: Use supplied costs.\n---\n# My budget skill\nCreate budget.md from verified costs.\n<script>window.uploadExecuted=true</script>";
  await dialog.getByLabel("Upload custom skill").setInputFiles({ name: "SKILL.md", mimeType: "text/markdown", buffer: Buffer.from(markdown) });
  await dialog.getByLabel("Required input types").fill("plan"); await dialog.getByLabel("Output types").fill("document");
  await dialog.getByRole("button", { name: "Replace skill", exact: true }).click();
  await expect(page.getByTestId("compose-steps")).toContainText("My budget skill");
  await page.reload(); await expect(page.getByTestId("compose-steps")).toContainText("My budget skill");
  const event = page.waitForEvent("download"); await page.getByTestId("compose-download").click(); const pack = await event;
  const file = info.outputPath("custom.zip"); await pack.saveAs(file); const files = unzipSync(fs.readFileSync(file));
  const envelope = JSON.parse(strFromU8(files["workflow.edit.json"])); const slug = envelope.plan.steps[1].slug;
  expect(strFromU8(files[`skills/${slug}/SKILL.md`])).toContain(markdown.split("# My budget skill")[1]);
  expect(envelope.customSkills[0].markdown).toBe(markdown);
  await page.getByLabel("Import workflow JSON").setInputFiles({ name: "workflow.edit.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(envelope)) });
  await page.getByRole("button", { name: "Open in the builder", exact: true }).click();
  await expect(page.getByTestId("flow-node").filter({ hasText: "My budget skill" })).toBeVisible();
  await page.getByTestId("bar-more").click();
  await page.getByTestId("share-flow").click();
  const sharedLink = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(sharedLink).origin).toBe(new URL(page.url()).origin);
  await page.goto(sharedLink);
  await page.reload(); const node = page.getByTestId("flow-node").filter({ hasText: "My budget skill" }); await expect(node).toBeVisible();
  await node.click(); await page.getByTestId("step-panel").getByRole("button", { name: "Replace skill", exact: true }).click();
  dialog = page.getByRole("dialog"); await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByTestId("step-panel").getByRole("button", { name: "Close", exact: true }).click();
  await node.click({ button: "right" }); await page.getByRole("menuitem", { name: "Replace skill…" }).click();
  await page.getByRole("dialog").getByLabel("Search repository skills").fill("request-deliverable-drafter");
  await page.getByRole("dialog").getByRole("button").filter({ hasText: "Request deliverable drafter" }).first().click();
  await page.getByRole("dialog").getByRole("button", { name: "Replace skill", exact: true }).click();
  await expect(page.getByTestId("flow-node").filter({ hasText: "Request deliverable drafter" })).toBeVisible();
  expect(await page.evaluate(() => (window as any).uploadExecuted)).toBeUndefined(); expect(posts).toBe(0); expect(errors).toEqual([]);
});

test("expanded step replace is usable on mobile without horizontal overflow @mobile", async ({ page }, info) => {
  await start(page, "Write a travel itinerary");
  const step = page.getByTestId("compose-steps").locator(":scope > li").first();
  await step.getByText("Edit step instructions", { exact: true }).click();
  await step.getByRole("button", { name: "Replace skill", exact: true }).click();
  const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
  await page.screenshot({ path: info.outputPath("mobile-replace.png") });
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  await page.getByRole("button", { name: "Open in the builder", exact: true }).click();
  await page.getByTestId("step-open").first().click();
  await page.getByTestId("step-panel").getByRole("button", { name: "Replace skill", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

for (const task of GENERAL_CASES) test(`general request downloads honest instructions: ${task.id}`, async ({ page }, info) => {
  let posts = 0; page.on("request", r => { if (r.method() === "POST" && r.url().includes("/api/compose")) posts++; });
  await start(page, task.goal);
  const event = page.waitForEvent("download"); await page.getByTestId("compose-download").click(); const pack = await event;
  const file = info.outputPath(`${task.id}.zip`); await pack.saveAs(file); const files = unzipSync(fs.readFileSync(file));
  const envelope = JSON.parse(strFromU8(files["workflow.edit.json"]));
  for (const step of envelope.plan.steps) expect(files[`skills/${step.slug}/SKILL.md`], step.slug).toBeTruthy();
  expect(strFromU8(files["HANDOFF.md"])).toContain(task.goal);
  expect(strFromU8(files["README.md"])).toContain("No skills have run");
  if (task.general) expect(envelope.plan.summary).toContain("general");
  expect(posts).toBe(0);
});

test("oversized compressed workflow links are rejected before loading custom skills", async ({ page }) => {
  await page.goto("/compose");
  const code = Buffer.from(deflateSync(strToU8(JSON.stringify({ v: 1, s: [], padding: "x".repeat(2200000) })))).toString("base64url");
  await page.goto(`/?flow=${code}#build`);
  await expect(page.getByTestId("builder")).toBeVisible();
  await expect(page.locator(".toast")).toContainText("That workflow link is broken or out of date.");
  await expect(page.getByTestId("flow-node")).toHaveCount(0);
});
