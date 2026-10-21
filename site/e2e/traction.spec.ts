import { expect, test } from "@playwright/test";
import { unzipSync, strFromU8 } from "fflate";
import fs from "node:fs";
// This independently checks the expected book taxonomy. Keep the browser test
// free of outside ESM imports: this project's Playwright version predates Node 24.
const CHANNEL_IDS = ["viral-marketing", "public-relations", "unconventional-pr", "search-engine-marketing", "social-and-display-ads", "offline-ads", "search-engine-optimization", "content-marketing", "email-marketing", "engineering-as-marketing", "targeting-blogs", "business-development", "sales", "affiliate-programs", "existing-platforms", "trade-shows", "offline-events", "speaking-engagements", "community-building"];

test("a product URL downloads all 19 complete skills and an honest AI handoff", async ({ page, context }, info) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors: string[] = [], requests: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/traction");
  await expect(page.getByTestId("traction-channel")).toHaveCount(19);
  expect(requests.some((r) => r.includes("/data/blocks.json")), "catalogue waits until the download is needed").toBe(false);
  await page.getByTestId("traction-download").click();
  await expect(page.getByTestId("traction-error")).toContainText("URL");
  await page.getByTestId("traction-url").fill("https://signaldesk.example");
  await page.getByTestId("traction-copy").click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("Explore all 19");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("traction-download").click()]);
  const file = info.outputPath(dl.suggestedFilename()); await dl.saveAs(file);
  const files = unzipSync(fs.readFileSync(file));
  expect(strFromU8(files["HANDOFF.md"])).toContain("https://signaldesk.example/");
  expect(strFromU8(files["HANDOFF.md"])).toContain("Withhold a scale verdict");
  expect(files["skills/find-your-saas-growth-channel/SKILL.md"]).toBeTruthy();
  for (const id of CHANNEL_IDS) {
    const root = `skills/traction-${id}`;
    for (const name of ["SKILL.md", "references/measurement.md", "references/general-mode.md", "references/source-notes.md"]) expect(files[`${root}/${name}`], `${id}/${name}`).toBeTruthy();
  }
  await expect(page.getByTestId("traction-status")).toContainText("advice is produced in your AI");
  expect(requests.some((r) => r.includes("signaldesk.example"))).toBe(false);
  expect(errors).toEqual([]);
});

test("general-business mode and a standalone channel survive into the downloaded pack", async ({ page }, info) => {
  await page.goto("/traction");
  await page.getByTestId("traction-url").fill("https://service.example");
  await page.getByTestId("traction-mode").click();
  await page.getByRole("option", { name: "General business", exact: true }).click();
  await page.getByTestId("traction-scope").click();
  await page.getByRole("option", { name: "Sales", exact: true }).click();
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("traction-download").click()]);
  const file = info.outputPath(dl.suggestedFilename()); await dl.saveAs(file);
  const files = unzipSync(fs.readFileSync(file));
  expect(strFromU8(files["HANDOFF.md"])).toContain("General business");
  expect(Object.keys(files).filter((n) => n.endsWith("/SKILL.md"))).toEqual(["skills/traction-sales/SKILL.md"]);
  expect(files["skills/traction-sales/references/general-mode.md"]).toBeTruthy();
});

test("an unavailable reference pack produces an error instead of an incomplete download", async ({ page }) => {
  await page.goto("/traction");
  await page.getByTestId("traction-url").fill("https://signaldesk.example");
  await page.route("**/skills/traction-sales.zip", (r) => r.fulfill({ status: 503, body: "unavailable" }));
  let downloads = 0; page.on("download", () => downloads++);
  await page.getByTestId("traction-download").click();
  await expect(page.getByTestId("traction-error")).toContainText("complete files");
  expect(downloads).toBe(0);
});

test("workflow page exports preserve the coordinator that selects and skips channels", async ({ page }, info) => {
  await page.goto("/workflows/find-your-saas-growth-channel");
  await page.getByTestId("block-page").getByTestId("download-handoff").click();
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("needs-download").click()]);
  const file = info.outputPath(dl.suggestedFilename()); await dl.saveAs(file);
  const files = unzipSync(fs.readFileSync(file));
  const workflow = JSON.parse(strFromU8(files["workflow.json"]));
  expect(workflow.steps.map((s: { skill: string }) => s.skill)).toEqual(["find-your-saas-growth-channel"]);
  expect(strFromU8(files["skills/find-your-saas-growth-channel/SKILL.md"])).toContain("only the selected channel skills");
  for (const id of CHANNEL_IDS) expect(files[`skills/traction-${id}/SKILL.md`]).toBeTruthy();
});

test("the growth hub works on a phone with all 19 channel links @mobile", async ({ page }) => {
  await page.goto("/traction");
  await expect(page.getByTestId("traction-channel")).toHaveCount(19);
  await page.getByTestId("traction-url").fill("javascript:alert(1)");
  await page.getByTestId("traction-download").click();
  await expect(page.getByTestId("traction-error")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByTestId("traction-channel").last().click();
  await expect(page.getByTestId("block-page")).toHaveAttribute("data-slug", "traction-community-building");
});
