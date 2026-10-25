import { test, expect } from "./fixtures/staging-aware-test";
import { unzipSync, strFromU8 } from "fflate";
import fs from "node:fs";

test.beforeEach(async ({ page }) => { await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } })); });

test("shared cards keep summary, requirements, credits and action in separate readable rows", async ({ page }, info) => {
 const measurements: unknown[] = [];
 for (const query of ["ad first line", "customer cohort"]) {
 await page.goto("/?q=" + encodeURIComponent(query), { waitUntil: "domcontentloaded" });
 await expect(page.getByTestId("block-card").first()).toBeVisible({ timeout: 15000 });
  if (query === "customer cohort") await expect(page.getByTestId("from-label").first()).toBeVisible();
 for (const width of [320, 390, 768, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.evaluate(() => document.fonts.ready);
  const cards = await page.getByTestId("block-card").evaluateAll(elements => elements.map(card => {
   const box = card.getBoundingClientRect();
   const rows = Array.from(card.querySelectorAll(".nm,.peek,.requirement,.meta,.view")).map(el => {
    const range = document.createRange(); range.selectNodeContents(el); const text = range.getBoundingClientRect();
    return { part: el.className, top: text.top, bottom: text.bottom, left: text.left, right: text.right };
   });
   const collisions = rows.slice(1).flatMap((row, i) => row.top < rows[i].bottom - 1 ? [{ before: rows[i].part, after: row.part }] : []);
   const outside = rows.filter(row => row.left < box.left - 1 || row.right > box.right + 1 || row.bottom > box.bottom + 1);
   return { slug: card.getAttribute("data-slug"), collisions, outside, sourceCredit: !!card.querySelector(".from"), requirement: !!card.querySelector(".requirement"), href: card.getAttribute("href"), pixelDisplay: getComputedStyle(card, "::after").display };
  }));
  if (query === "customer cohort") expect(cards.some(card => card.sourceCredit)).toBe(true);
  expect(cards.some(card => card.requirement)).toBe(true);
  for (const card of cards) { expect(card.collisions, card.slug ?? "card").toEqual([]); expect(card.outside, card.slug ?? "card").toEqual([]); expect(card.href).toBeTruthy(); expect(card.pixelDisplay).toBe("none"); }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByTestId("block-card").first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath(`${query === "customer cohort" ? "imported-cards" : "cards"}-${width}.png`) });
  measurements.push({ query, width, cards });
 }
 }
 fs.writeFileSync(info.outputPath("card-measurements.json"), JSON.stringify(measurements, null, 2));
});

test("source page has one download area, spaced optional transfer help and an unchanged complete pack", async ({ page }, info) => {
 await page.goto("/from-a-source", { waitUntil: "domcontentloaded" });
 await expect(page.getByTestId("intake-page")).toBeVisible();
 await expect(page.getByTestId("intake-download-top")).toHaveCount(0);
 await expect(page.getByTestId("intake-download")).toBeDisabled();
 const source = "Read the material. List the facts it supports. Ask about missing evidence. Check the method with the user. Write each step in plain words and keep the source beside the instructions.";
 await page.getByTestId("intake-title").fill("Example source for a workflow");
 await page.getByTestId("intake-text").fill(source);
 await page.locator(".intake-transfer-help > summary").click();
 await expect(page.getByTestId("execution-prompt")).toHaveCount(1);
 for (const width of [320, 390, 768, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  const actions = page.locator(".intake-actions");
  const buttons = await actions.locator("button").evaluateAll(elements => elements.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, height: r.height }; }));
  expect(buttons).toHaveLength(2);
  expect(buttons.every(button => button.height >= 44)).toBe(true);
  expect(buttons[0].right <= buttons[1].x - 8 || buttons[0].bottom <= buttons[1].y - 8).toBe(true);
  const launch = page.locator(".intake-transfer-help .workflow-launch-actions");
  const buttonBox = await launch.locator("button").boundingBox(), noteBox = await launch.locator(".small").boundingBox();
  expect(buttonBox).toBeTruthy(); expect(noteBox).toBeTruthy();
  expect(buttonBox!.x + buttonBox!.width <= noteBox!.x - 8 || buttonBox!.y + buttonBox!.height <= noteBox!.y - 8).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await actions.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath(`intake-actions-${width}.png`) });
 }
 const [download] = await Promise.all([page.waitForEvent("download"), page.getByTestId("intake-download").click()]);
 const files = unzipSync(fs.readFileSync((await download.path())!));
 const sourceKey = Object.keys(files).find(key => key.endsWith("/source.md"));
 expect(sourceKey).toBeTruthy();
 const prefix = sourceKey!.slice(0, -"source.md".length);
 expect(files[prefix + "HANDOFF.md"]).toBeTruthy();
 expect(strFromU8(files[sourceKey!])).toContain(source);
 expect(files[prefix + "framework/execution-contract.md"]).toBeTruthy();
});

test("task and agent inputs and main actions stay usable at narrow and wide widths", async ({ page }, info) => {
 for (const path of ["/prompts/rough-notes-to-minutes-writer", "/agents/website-quality-keeper"]) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("task-start")).toBeVisible({ timeout: 15000 });
  for (const width of [320, 768, 1440]) {
   await page.setViewportSize({ width, height: 1000 });
   const primary = page.getByTestId("task-start").locator(".btn-primary:visible");
   await expect(primary).toHaveCount(1);
   const bounds = await primary.boundingBox(); expect(bounds).toBeTruthy();
   expect(bounds!.width).toBeGreaterThan(100);
   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
   await primary.scrollIntoViewIfNeeded();
   if (width <= 640) {
    const button = await primary.boundingBox(), questions = await page.getByTestId("comments-open").boundingBox();
    expect(button).toBeTruthy(); expect(questions).toBeTruthy();
    const intersects = button!.x < questions!.x + questions!.width && button!.x + button!.width > questions!.x && button!.y < questions!.y + questions!.height && button!.y + button!.height > questions!.y;
    expect(intersects, "Questions must not cover the main task action").toBe(false);
   }
   await page.screenshot({ path: info.outputPath(`${path.includes("agents") ? "agent" : "task"}-${width}.png`) });
  }
 }
});
