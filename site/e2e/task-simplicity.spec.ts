import { test, expect } from "./fixtures/staging-aware-test";
import { unzipSync } from "fflate";
import { mockComposerAccount } from "./fixtures/composer-account";
import fs from "node:fs";
const TASK = "/prompts/rough-notes-to-minutes-writer";
const NOTES = "Decided to use the plain version. Mina will send the draft on Friday. Budget still open.";

// Each task test starts as a guest. The account-isolation test registers its
// explicit Clerk routes later; Playwright handles the most recently registered route first.
test.beforeEach(async ({ page }) => {
 await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
});

test("failed task details can be retried without losing the local draft", async ({ page }) => {
 let failDetails = true;
 await page.route("**/data/pages/rough-notes-to-minutes-writer.json", route => failDetails ? route.fulfill({ status: 503, body: "Unavailable" }) : route.continue());
 await page.goto(TASK, { waitUntil: "domcontentloaded" });
 await expect(page.getByRole("alert")).toContainText("could not load");
 const draft = page.getByTestId("composer").locator("textarea").first();
 await draft.fill(NOTES);
 failDetails = false;
 await page.getByRole("button", { name: "Try again", exact: true }).click();
 await expect(page.getByRole("alert")).toHaveCount(0);
 await expect(page.getByLabel("Paste your meeting notes")).toHaveValue(NOTES);
});

test("a tailored-skill email copy failure keeps a selectable complete request", async ({ page }) => {
 await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw Error("denied"); } }, configurable: true }));
 await page.goto("/", { waitUntil: "domcontentloaded" });
 await page.getByTestId("tailor-footer").click();
 await page.getByTestId("tailor-want").fill("Help me write clearer drafts.");
 await page.getByTestId("tailor-email").fill("example@example.com");
 await page.getByTestId("tailor-copy").click();
 await expect(page.getByRole("alert")).toContainText("Copy did not work");
 await expect(page.getByRole("textbox", { name: "Copy the email request manually" })).toHaveValue(/Help me write clearer drafts\./);
 await expect(page.getByRole("status").filter({ hasText: "Copied. Paste" })).toHaveCount(0);
});

test("text request is near the top, has one main action and keeps the draft", async ({ page }, testInfo) => {
 await page.goto(TASK, { waitUntil: "domcontentloaded" });
 const start = page.getByTestId("task-start");
 await expect(start.getByLabel("Paste your meeting notes")).toBeVisible();
 await start.getByTestId("composer-copy").click();
 await expect(start.getByTestId("task-input-help")).toContainText("Add your details above first.");
 await start.getByLabel("Paste your meeting notes").fill(NOTES);
 await expect(start.getByTestId("composer-copy")).toBeEnabled();
 await page.reload({ waitUntil: "domcontentloaded" });
 await expect(start.getByLabel("Paste your meeting notes")).toHaveValue(NOTES);
 await expect(page.getByTestId("composer")).toHaveCount(1);
 await expect(start.locator(".btn-primary:visible")).toHaveCount(1);
 await expect(page.getByTestId("add-to-workflow")).not.toBeVisible();
 await page.screenshot({ path: testInfo.outputPath("task-request.png"), fullPage: false });
});
test("clipboard rejection exposes the complete request without false success", async ({ page }) => {
 await page.addInitScript(() => {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw Error("denied"); } } });
  (window as any).uxEvents = [];
  document.addEventListener("abb:ux-event", e => (window as any).uxEvents.push((e as CustomEvent).detail));
 });
 await page.goto(TASK, { waitUntil: "domcontentloaded" });
 await page.getByLabel("Paste your meeting notes").fill(NOTES);
 await page.getByTestId("composer-copy").click();
 await expect(page.getByRole("alert")).toContainText("Copy did not work");
 const fallback = page.getByLabel("Copy the complete request manually");
 await expect(fallback).toBeVisible();
 expect(await fallback.inputValue()).toContain(NOTES);
 expect((await fallback.inputValue()).length).toBeGreaterThan(NOTES.length + 100);
 await expect(page.getByTestId("composer-copy")).toHaveText("Copy the request");
 expect(await page.evaluate(() => (window as any).uxEvents)).not.toContain("request_copied");
});
test("keyboard request transfer contains all instructions and is honest about external work", async ({ page }) => {
 await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => { (window as any).copiedRequest = text; } } }));
 await page.goto(TASK, { waitUntil: "domcontentloaded" });
 const input = page.getByLabel("Paste your meeting notes");
 await input.focus(); await input.fill(NOTES);
 await page.getByTestId("composer-copy").focus(); await page.keyboard.press("Enter");
 await expect(page.getByTestId("task-text-transfer")).toContainText("Your AI does the work");
 await expect(page.getByTestId("composer-copy")).toHaveText("Request copied");
 expect(await page.evaluate(() => (window as any).copiedRequest)).toContain(NOTES);
 await page.getByTestId("task-useful").click();
 await expect(page.getByTestId("task-useful")).toHaveText("Thanks for letting us know");
});
test("reference anchor opens preserved checks", async ({ page }) => {
 await page.goto(`${TASK}#test`, { waitUntil: "domcontentloaded" });
 await expect(page.getByTestId("bp-details")).toHaveAttribute("open", "");
 await expect(page.locator("#test .checks")).toContainText(/owner|date/);
 await expect(page.locator("#file")).toBeAttached();
});
test("file task exports supporting files and keeps transfer instructions", async ({ page }) => {
 await page.goto("/skills/ad-first-line-writer-and-scorer", { waitUntil: "domcontentloaded" });
 const start = page.getByTestId("task-start");
 await expect(start.getByTestId("install-zip")).toBeEnabled({ timeout: 15000 });
 await expect(start.getByTestId("composer")).toHaveCount(0);
 const [dl] = await Promise.all([page.waitForEvent("download"), start.getByTestId("install-zip").click()]);
 const contents = unzipSync(fs.readFileSync((await dl.path())!));
 expect(Object.keys(contents)).toContain("ad-first-line-writer-and-scorer/SKILL.md");
 expect(Object.keys(contents).length).toBeGreaterThan(1);
 await expect(start.getByTestId("skill-transfer")).toContainText("supporting files");
});
test("workflow files do not require user uploads and are not executed results", async ({ page }) => {
 await page.goto("/workflows/review-image-ads", { waitUntil: "domcontentloaded" });
 await page.getByTestId("task-start").getByTestId("download-handoff").click();
 const dialog = page.getByTestId("needs");
 await expect(dialog).toContainText("You can download now and add this material later");
 await expect(dialog.getByTestId("needs-download")).toBeEnabled();
 const [dl] = await Promise.all([page.waitForEvent("download"), dialog.getByTestId("needs-download").click()]);
 const contents = unzipSync(fs.readFileSync((await dl.path())!));
 expect(contents["HANDOFF.md"]).toBeTruthy(); expect(contents["workflow.json"]).toBeTruthy();
 await expect(dialog.getByTestId("transfer-guide")).toContainText("does not run, publish or schedule");
 await dialog.getByTestId("next-done").click();
 await expect(page.getByTestId("task-start").getByTestId("transfer-guide")).toBeVisible();
});
test("file failure stays recoverable", async ({ page }) => {
 await page.route("**/skills/ad-first-line-writer-and-scorer.zip", route => route.fulfill({ status: 503, body: "unavailable" }));
 await page.goto("/skills/ad-first-line-writer-and-scorer", { waitUntil: "domcontentloaded" });
 await page.getByTestId("task-start").getByTestId("install-zip").click();
 await expect(page.getByTestId("task-start").getByRole("alert")).toContainText("Try downloading again");
 await expect(page.getByTestId("task-start").getByTestId("skill-transfer")).toHaveCount(0);
 await expect(page.getByTestId("task-start").getByTestId("install-zip")).toBeEnabled();
});
test("@mobile small-screen request has no horizontal overflow", async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 780 }); await page.goto(TASK, { waitUntil: "domcontentloaded" });
 await page.getByLabel("Paste your meeting notes").fill(NOTES);
 await expect(page.getByTestId("composer-copy")).toBeEnabled();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});


test("task drafts remain isolated across Alice, Bob and guest with no old-draft flash", async ({ page }) => {
 await mockComposerAccount(page, true, "alice", "alice");
 await page.route("**/api/library", async route => {
  if (route.request().method() === "PUT") return route.fulfill({ json: { revision: 1, data: route.request().postDataJSON().data } });
  return route.fulfill({ json: { revision: 0, data: {} } });
 });
 await page.addInitScript(() => {
  localStorage.setItem("abb:draft:rough-notes-to-minutes-writer", "AMBIGUOUS LEGACY PRIVATE TEXT");
  localStorage.setItem("abb:task-draft:guest:rough-notes-to-minutes-writer", "Guest notes to restore");
 });
 await page.goto(TASK, { waitUntil: "domcontentloaded" });
 const input = page.getByLabel("Paste your meeting notes");
 await expect(input).toHaveValue("");
 await input.fill("Alice private meeting notes");
 await expect.poll(() => page.evaluate(() => localStorage.getItem("abb:task-draft:user:alice:rough-notes-to-minutes-writer"))).toBe("Alice private meeting notes");
 await page.evaluate(() => {
  (window as any).draftLeaks = [];
  (window as any).__switchMindAccount("bob");
  const check = () => { const input = document.getElementById("composer-text") as HTMLTextAreaElement | null; if (input?.value.includes("Alice private")) (window as any).draftLeaks.push(input.value); };
  new MutationObserver(check).observe(document.body, { childList: true, subtree: true, attributes: true });
  requestAnimationFrame(function watch() { check(); requestAnimationFrame(watch); });
 });
 await expect(input).toHaveValue("");
 await input.fill("Bob private meeting notes");
 expect(await page.evaluate(() => (window as any).draftLeaks)).toEqual([]);
 await page.evaluate(() => (window as any).__switchMindAccount(null));
 await expect(input).toHaveValue("Guest notes to restore");
 await input.fill("Updated guest notes");
 await page.evaluate(() => (window as any).__switchMindAccount("bob"));
 await expect(input).toHaveValue("Bob private meeting notes");
 await page.evaluate(() => (window as any).__switchMindAccount(null));
 await expect(input).toHaveValue("Updated guest notes");
 expect(await page.evaluate(() => (window as any).draftLeaks)).toEqual([]);
 expect(await page.evaluate(() => localStorage.getItem("abb:draft:rough-notes-to-minutes-writer"))).toBe("AMBIGUOUS LEGACY PRIVATE TEXT");
});


test("reviewed example notes and draft can be tried without losing the user's text", async ({ page }) => {
 for (const [url, label] of [[TASK, "Use example notes"], ["/skills/plain-english-editor", "Use example draft"]]) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const input = page.locator("#composer-text");
  await input.fill("My own private draft to restore");
  await page.getByRole("button", { name: label, exact: true }).click();
  await expect(input).not.toHaveValue("My own private draft to restore");
  await expect(page.getByTestId("composer")).toContainText("made-up material");
  const example = await input.inputValue();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(input).toHaveValue(example);
  await expect(page.getByTestId("composer")).toContainText("made-up material");
  await page.getByRole("button", { name: "Restore my text", exact: true }).click();
  await expect(input).toHaveValue("My own private draft to restore");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(input).toHaveValue("My own private draft to restore");
  await expect(page.getByRole("button", { name: "Restore my text", exact: true })).toHaveCount(0);
 }
});

test("full skill display repairs only included references and keeps raw source unchanged", async ({ page }) => {
 await page.goto("/skills/16s-microbiome-read-processor#file", { waitUntil: "domcontentloaded" });
 const href = "/skills/16s-microbiome-read-processor/scripts/amplicon_workflow.py";
 await expect(page.locator('#file .prose a[href="' + href + '"]')).toHaveCount(1, { timeout: 15000 });
 const asset = await page.request.get(href);
 expect(asset.status()).toBe(200);
 const source = await page.request.get("/skills/16s-microbiome-read-processor/SKILL.md");
 const raw = await source.text();
 expect(raw).toContain("scripts/amplicon_workflow.py");
 expect(raw).not.toContain(href);
 await page.goto("/skills/90-day-plan-builder#file", { waitUntil: "domcontentloaded" });
 await expect(page.locator("#file .skill-source-reference").filter({ hasText: "c-level-advisor" }).first()).toContainText("source reference:");
 await expect(page.locator('#file a[href*="../"]')).toHaveCount(0);
});

test("built supporting markdown and Python assets match their verified ZIP entries", async ({ page }) => {
 test.skip(process.env.PW_BUILT_ASSETS !== "1", "Run only against the frozen built preview with derived supporting files.");
 const archive = await page.request.get("/skills/16s-microbiome-read-processor.zip");
 expect(archive.status()).toBe(200);
 const entries = unzipSync(await archive.body());
 for (const file of ["references/runtime-and-interpretation.md", "scripts/amplicon_workflow.py"]) {
  const entry = "16s-microbiome-read-processor/" + file;
  expect(entries[entry], "the verified archive includes " + entry).toBeTruthy();
  const asset = await page.request.get("/skills/" + entry);
  expect(asset.status(), "derived supporting file returns HTTP 200: " + file).toBe(200);
  expect(await asset.body()).toEqual(Buffer.from(entries[entry]));
 }
});
