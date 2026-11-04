import { test, expect } from "./fixtures/staging-aware-test";
import { mockComposerAccount } from "./fixtures/composer-account";
import { unzipSync, strFromU8 } from "fflate";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SOURCE = "Read the full material. List the steps it teaches, in order. Show the steps to the user and wait for their review. Write each approved step in plain words. Check that each result gives the next step what it needs.";
test.beforeEach(async ({ page }) => { await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } })); });

test("transfer help works with the keyboard, explains where results appear and keeps all reference sections", async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/how-it-works#use-in-ai", { waitUntil: "domcontentloaded" });
  const help = page.locator("#use-in-ai");
  await expect(help).toContainText("Your AI makes the result in your chat or workspace.");
  const copied = page.getByTestId("help-copied-request"), files = page.getByTestId("help-downloaded-files");
  await copied.locator("summary").focus(); await page.keyboard.press("Enter");
  await expect(copied).toHaveAttribute("open", "");
  await expect(copied).toContainText("Paste the complete request");
  await page.keyboard.press("Enter"); await expect(copied).not.toHaveAttribute("open");
  await files.locator("summary").focus(); await page.keyboard.press("Enter");
  await expect(files).toHaveAttribute("open", "");
  await expect(files).toContainText("Keep all its files and folders together");
  await expect(files).toContainText("does not replace the downloaded files");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await help.scrollIntoViewIfNeeded(); await page.screenshot({ path: info.outputPath("guide-transfer-320.png") });
  await expect(page.locator(".hiw-ladder li b")).toHaveText(["Prompt", "Skill", "Workflow", "Agent", "Mind", "Specialist"]);
  for (const id of ["prompt", "skill", "routine", "workflow", "agent", "app", "council", "choose", "builder", "results", "words"]) await expect(page.locator("#" + id)).toBeAttached();
  await expect(page.locator("#builder")).toContainText("This does not run your work");
  await expect(page.locator("#routine")).toContainText("Downloading instructions here does not start a schedule");
  const text = await page.getByTestId("how-it-works").evaluate(el => {
    const skip = [...el.querySelectorAll<HTMLElement>("figure.code,.bp-toc")];
    skip.forEach(node => { node.style.display = "none"; }); const text = (el as HTMLElement).innerText;
    skip.forEach(node => { node.style.display = ""; }); return text;
  });
  const textPath = info.outputPath("guide-reading-level.txt"); fs.writeFileSync(textPath, text);
  const grade = execFileSync(process.execPath, ["tools/reading-level.mjs", "--file", textPath], { cwd: "..", encoding: "utf8" });
  expect(Number(grade.match(/grade (-?[\d.]+)/)![1]), grade).toBeLessThanOrEqual(10);
  await help.getByRole("link", { name: "Open browser tools" }).click(); await expect(page).toHaveURL(/\/tools$/);
  await page.goBack(); await expect(page).toHaveURL(/\/how-it-works#use-in-ai$/);
  await expect(page.locator("#use-in-ai")).toBeInViewport();
});

test("source-only intake explains link limits and recovers a failed complete download without losing text", async ({ page }, info) => {
  let failed = false;
  await page.route("**/skills/long-source-to-workflow/SKILL.md", route => {
    if (!failed) { failed = true; return route.fulfill({ status: 503, body: "Unavailable" }); }
    return route.continue();
  });
  await page.goto("/from-a-source", { waitUntil: "domcontentloaded" });
  const form = page.getByTestId("intake-page"), input = page.getByTestId("intake-text"), button = page.getByTestId("intake-download");
  await expect(form).toContainText("Only the source text is needed");
  await page.getByTestId("intake-link").fill("https://example.com/source");
  await expect(button).toBeDisabled(); await expect(form).toContainText("A link does not load the content");
  await input.fill(SOURCE); await expect(page.getByTestId("intake-title")).toHaveValue("");
  await button.click(); await expect(form.getByRole("alert")).toContainText("Your text is still here");
  await expect(input).toHaveValue(SOURCE); await expect(button).toBeEnabled(); await expect(button).toBeFocused();
  const [download] = await Promise.all([page.waitForEvent("download"), page.keyboard.press("Enter")]);
  await download.saveAs(info.outputPath(download.suggestedFilename()));
  const entries = unzipSync(fs.readFileSync((await download.path())!)), sourceKey = Object.keys(entries).find(k => k.endsWith("/source.md"))!;
  const prefix = sourceKey.slice(0, -"source.md".length);
  expect(strFromU8(entries[sourceKey])).toContain(SOURCE);
  for (const file of ["HANDOFF.md", "AUTHORING.md", "framework/execution-contract.md", "skills/long-source-to-workflow/SKILL.md"]) expect(entries[prefix + file], file).toBeTruthy();
  await expect(form.getByRole("alert")).toHaveCount(0);
  const transfer = form.locator(".intake-transfer-help"); await expect(transfer).toHaveAttribute("open", "");
  await expect(transfer).toContainText("Review them before it writes the skills and workflow");
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 }); await transfer.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`intake-next-${width}.png`) });
  }
  const [help] = await Promise.all([page.waitForEvent("popup"), transfer.getByRole("link", { name: /Get help using the files/ }).click()]);
  await expect(help.locator("#use-in-ai")).toContainText("Your AI makes the result in your chat or workspace");
  await help.close(); await expect(input).toHaveValue(SOURCE);
  await page.reload({ waitUntil: "domcontentloaded" }); await expect(input).toHaveValue(SOURCE);
});

async function accountFixture(page: import("@playwright/test").Page) {
  await mockComposerAccount(page, true, "alice", "alice");
  const writes: string[] = [];
  await page.route("**/api/library", route => {
    if (route.request().method() === "PUT") { writes.push(route.request().postData() ?? ""); return route.fulfill({ json: { revision: 1, data: route.request().postDataJSON().data } }); }
    return route.fulfill({ json: { revision: 0, data: {} } });
  });
  await page.addInitScript(() => {
    if (!localStorage.getItem("fixture:intake-seeded")) {
      localStorage.setItem("fixture:intake-seeded", "yes");
      localStorage.setItem("aib-intake-draft", '{ "text": "UNATTRIBUTED PRIVATE LEGACY SOURCE", "title": "Keep exact bytes" }');
      localStorage.setItem("abb:intake-draft:v2:guest", JSON.stringify({ text: "Guest source to restore", title: "Guest title", kind: "talk" }));
    }
  });
  return writes;
}

test("intake drafts are isolated across Alice, Bob and guest, survive reload and leave legacy bytes untouched", async ({ page }) => {
  const writes = await accountFixture(page);
  await page.goto("/from-a-source", { waitUntil: "domcontentloaded" }); const input = page.getByTestId("intake-text");
  await expect(input).toHaveValue(""); await input.fill("Alice private source"); await page.getByTestId("intake-title").fill("Alice title");
  await page.reload({ waitUntil: "domcontentloaded" }); await expect(input).toHaveValue("Alice private source");
  await page.evaluate(() => {
    (window as any).intakeLeaks = [];
    const check = () => { const value = (document.querySelector('[data-testid="intake-text"]') as HTMLTextAreaElement | null)?.value; if ((window as any).expectedIntakeOwner !== "alice" && value?.includes("Alice private")) (window as any).intakeLeaks.push(value); };
    new MutationObserver(check).observe(document.body, { childList: true, subtree: true, attributes: true });
    requestAnimationFrame(function watch() { check(); requestAnimationFrame(watch); });
    (window as any).expectedIntakeOwner = "bob"; (window as any).__switchMindAccount("bob");
  });
  await expect(input).toHaveValue(""); await expect(page.getByTestId("intake-title")).toHaveValue("");
  await input.fill("Bob private source"); expect(await page.evaluate(() => (window as any).intakeLeaks)).toEqual([]);
  await page.reload({ waitUntil: "domcontentloaded" }); await expect(input).toHaveValue("Bob private source");
  await page.evaluate(() => (window as any).__switchMindAccount(null)); await expect(input).toHaveValue("Guest source to restore");
  await expect(page.getByTestId("intake-title")).toHaveValue("Guest title"); await input.fill("Updated guest source");
  await page.evaluate(() => (window as any).__switchMindAccount("alice")); await expect(input).toHaveValue("Alice private source");
  await page.evaluate(() => (window as any).__switchMindAccount("bob")); await expect(input).toHaveValue("Bob private source");
  await page.getByRole("button", { name: "Clear", exact: true }).click(); await expect(input).toHaveValue("");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("abb:intake-draft:v2:user:bob") ?? "{}").text)).toBe("");
  await page.evaluate(() => (window as any).__switchMindAccount(null)); await expect(input).toHaveValue("Updated guest source");
  expect(await page.evaluate(() => localStorage.getItem("aib-intake-draft"))).toBe('{ "text": "UNATTRIBUTED PRIVATE LEGACY SOURCE", "title": "Keep exact bytes" }');
  expect(writes.join("\n")).not.toMatch(/Alice private|Bob private|Guest source|UNATTRIBUTED PRIVATE/);
});

test("changing account while a source pack is loading does not download the old owner's source", async ({ page }) => {
  await accountFixture(page); let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; }); let requested = false; const downloads: string[] = [];
  page.on("download", download => downloads.push(download.suggestedFilename()));
  await page.route("**/skills/long-source-to-workflow/SKILL.md", async route => { requested = true; await gate; await route.continue(); });
  await page.goto("/from-a-source", { waitUntil: "domcontentloaded" }); await page.getByTestId("intake-text").fill("Alice private source being prepared");
  await page.getByTestId("intake-download").click(); await expect.poll(() => requested).toBe(true);
  await page.evaluate(() => (window as any).__switchMindAccount("bob")); await expect(page.getByTestId("intake-text")).toHaveValue("");
  const response = page.waitForResponse("**/skills/long-source-to-workflow/SKILL.md"); release(); await response;
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(downloads).toEqual([]); await expect(page.getByTestId("intake-download")).toBeDisabled();
  await expect(page.getByRole("status").filter({ hasText: /^Download started\.$/ })).toHaveCount(0);
});
