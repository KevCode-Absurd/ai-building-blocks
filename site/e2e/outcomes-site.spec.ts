import { test, expect, type Page } from "@playwright/test";
import { sampleEngagement } from "../src/outcomes-site/owner-view.ts";
import example from "../src/outcomes/examples/rising-cpa.mjs";
import fs from "node:fs";
import path from "node:path";

const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth", route => route.fulfill({ json: { configured: false } }));
  const list: string[] = [];
  errors.set(page, list);
  page.on("pageerror", e => list.push(e.message));
});
test.afterEach(async ({ page }) => { expect(errors.get(page), "no script errors").toEqual([]); });

test("the menu leads owners to the outcome page, and the goal box hands the job to their AI", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const sent: string[] = [];
  page.on("request", r => sent.push(`${r.url()} ${r.postData() ?? ""}`));
  await page.goto("/compose");
  await page.getByTestId("compose-get-it-done").click();
  await expect(page).toHaveURL(/\/get-it-done$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hand your AI a whole job, and keep every decision");
  const job = page.getByTestId("outcome-job");
  await job.focus();
  await page.keyboard.type("Our shop's repeat orders dropped this year");
  await expect(page.getByTestId("outcome-message")).toContainText('"Our shop\'s repeat orders dropped this year"');
  await expect(page.getByTestId("outcome-message")).toContainText("start_outcome");
  await page.getByTestId("outcome-copy").click();
  await expect(page.getByRole("status").filter({ hasText: /Copied|Text selected/ })).toBeVisible();
  await expect(page.getByTestId("outcome-connect")).toHaveAttribute("href", "/api-and-mcp");
  expect(sent.filter(s => s.includes("repeat orders")), "the job never leaves the page").toEqual([]);
  await job.fill("use sk-ant-api03-abcdefghijklmnopqrstuvwxyz please");
  await expect(page.getByRole("alert")).toContainText("looks like a password or API key");
  await page.getByRole("button", { name: "Our ad costs keep going up and profit is shrinking", exact: true }).click();
  await expect(job).toHaveValue("Our ad costs keep going up and profit is shrinking");
});

test("the worked example steps through every screen by keyboard", async ({ page }) => {
  await page.goto("/get-it-done/example");
  await expect(page.getByTestId("walk-screen")).toHaveAttribute("data-screen", "words");
  await expect(page.getByTestId("walk-screen")).toContainText(example.request);
  await expect(page.getByText("Illustrative figures").first()).toBeVisible();
  for (const screen of ["brief", "research", "plan", "stops", "results"]) {
    await page.getByTestId("walk-next").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("walk-screen")).toHaveAttribute("data-screen", screen);
    await expect(page.locator("#screen-h")).toBeFocused();
    if (screen === "plan") await expect(page.getByTestId("walk-stage")).toHaveCount(example.plan.stages.length);
    if (screen === "stops") await expect(page.getByTestId("walk-screen")).toContainText("Approve each live action");
  }
  await expect(page.getByTestId("walk-start")).toHaveAttribute("href", "/get-it-done");
  await page.getByTestId("screen-research").click();
  await expect(page.getByTestId("walk-screen")).toHaveAttribute("data-screen", "research");
});

test("where my job stands reads a picked folder in the browser and explains bad files", async ({ page }, testInfo) => {
  await page.goto("/get-it-done/status");
  await page.getByTestId("job-sample").click();
  await expect(page.getByTestId("job-headline")).toHaveText("One thing waits on you.");
  await expect(page.getByTestId("job-waiting")).toContainText("Choose what to do");
  await expect(page.getByTestId("job-progress")).toHaveText(`7 of ${example.plan.stages.length} stages done`);
  const e = sampleEngagement();
  // A folder input takes a real folder: outcomes/<id>/ with its engagement.json and other files.
  const job = testInfo.outputPath("outcomes", e.id), empty = testInfo.outputPath("not-a-job");
  fs.mkdirSync(job, { recursive: true }); fs.mkdirSync(empty, { recursive: true });
  fs.writeFileSync(path.join(job, "engagement.json"), JSON.stringify(e)); fs.writeFileSync(path.join(job, "PLAN.md"), "# Plan");
  fs.writeFileSync(path.join(empty, "notes.md"), "hello");
  await page.getByTestId("job-folder-input").setInputFiles(job);
  await expect(page.getByTestId("job-status")).not.toContainText("This is the sample job");
  await expect(page.getByTestId("job-headline")).toHaveText("One thing waits on you.");
  await page.getByTestId("job-file-input").setInputFiles({ name: "engagement.json", mimeType: "application/json", buffer: Buffer.from('{"schema":"other"}') });
  await expect(page.getByTestId("job-error")).toContainText("does not pass the orchestrator's checks");
  await page.getByTestId("job-folder-input").setInputFiles(empty);
  await expect(page.getByTestId("job-error")).toContainText("couldn't find an engagement.json");
});

test("@mobile the three pages fit a 375px screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 760 });
  for (const url of ["/get-it-done", "/get-it-done/example", "/get-it-done/status"]) {
    await page.goto(url);
    await expect(page.getByTestId("outcomes-page")).toBeVisible();
    if (url.endsWith("example")) for (let i = 0; i < 3; i++) await page.getByTestId("walk-next").click();
    if (url.endsWith("status")) await page.getByTestId("job-sample").click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${url} has no sideways scroll`).toBe(true);
  }
});
