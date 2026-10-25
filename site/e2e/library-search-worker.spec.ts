import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { buildLibrarySearchIndex, searchLibraryIndex } from "../src/lib/library-search-core";
const publicSearchIndex = JSON.parse(fs.readFileSync(new URL("../public/data/library-search.json", import.meta.url), "utf8"));
const aeoResultCount = searchLibraryIndex(publicSearchIndex, "AEO").size;
if (!aeoResultCount) throw new Error("The public search index has no AEO results.");
test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  await page.route("**/api/compose", route => route.fulfill({ json: { enabled: false } }));
});
test("module worker prepares identical public metadata once, without query or private fields", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("performance-test-private", "PRIVATE_PERF_CANARY");
    const NativeWorker = Worker;
    const state = (window as any).__metadataWorker = { count: 0, input: null, output: null };
    (window as any).Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) { super(url, options); state.count++; this.addEventListener("message", event => { state.output = event.data.index; }); }
      postMessage(message: any) { state.input = message; super.postMessage(message); }
    };
  });
  await page.goto("/#library");
  await page.waitForFunction(() => !!(window as any).__metadataWorker.output, null, { timeout: 20000 });
  const state = await page.evaluate(() => (window as any).__metadataWorker);
  expect(state.count).toBe(1);
  expect(Object.keys(state.input).sort()).toEqual(["documents", "sourceHash"]);
  expect(JSON.stringify(state.input)).not.toContain("PRIVATE_PERF_CANARY");
  expect(state.output).toEqual(buildLibrarySearchIndex(state.input.documents, state.input.sourceHash));
  await page.getByTestId("library-search").fill("AEO");
  await expect(page.getByTestId("result-count")).toHaveText(`${aeoResultCount} results`, { timeout: 20000 });
  await page.getByTestId("library-search").fill("RNA-seq GEO");
  await expect(page.getByTestId("result-count")).toHaveText("1 result", { timeout: 20000 });
  expect(await page.evaluate(() => (window as any).__metadataWorker.count)).toBe(1);
});
test("full search and rapid typing finish while the metadata worker is delayed", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*library-search-worker*", async route => { await held; await route.continue().catch(() => {}); });
  await page.goto("/#library");
  await page.getByTestId("library-search").fill("AEO");
  await expect(page.getByTestId("result-count")).toHaveText(`${aeoResultCount} results`, { timeout: 20000 });
  const input = page.getByTestId("library-search");
  await input.clear(); await input.pressSequentially("RNA-seq GEO", { delay: 20 });
  await expect(input).toHaveValue("RNA-seq GEO");
  await expect(page.getByTestId("result-count")).toHaveText("1 result", { timeout: 20000 });
  release();
  await expect(page.locator('#library a[href="/skills/sequencing-pipeline-runner"]')).toBeVisible();
  await expect(page.getByTestId("result-count")).toHaveText("1 result");
});
test("blocked worker falls back in yielded batches and metadata remains usable after search failure", async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__inputBeats = 0; setInterval(() => (window as any).__inputBeats++, 10);
    (window as any).Worker = class { constructor() { throw Error("Worker blocked for fallback regression"); } };
  });
  await page.route("**/data/library-search.json", route => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/#library");
  const input = page.getByTestId("library-search");
  await expect(input).toBeEnabled();
  await input.pressSequentially("AEO", { delay: 25 });
  await expect(input).toHaveValue("AEO");
  await expect(page.locator('#library a[href="/skills/ai-search-audit"]')).toBeVisible({ timeout: 20000 });
  await expect(page.locator("#library [role=status]")).toHaveText(/\d+ results?/);
  await expect(page.locator("#library [role=alert]")).toContainText("titles and descriptions");
  expect(await page.evaluate(() => (window as any).__inputBeats)).toBeGreaterThan(5);
});
test("leaving a pending worker cancels it and a new library visit remains searchable", async ({ page }) => {
  await page.addInitScript(() => {
    const NativeWorker = Worker, state = (window as any).__workerLifetime = { started: 0, terminated: 0 };
    (window as any).Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) { super(url, options); state.started++; }
      terminate() { state.terminated++; super.terminate(); }
    };
  });
  let release!: () => void; const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*library-search-worker*", async route => { await held; await route.continue().catch(() => {}); });
  await page.goto("/#library");
  await page.waitForFunction(() => (window as any).__workerLifetime.started === 1);
  await page.getByRole("link", { name: "How it works", exact: true }).first().click();
  await expect.poll(() => page.evaluate(() => (window as any).__workerLifetime.terminated)).toBeGreaterThan(0);
  release();
  await page.getByRole("link", { name: "AI Blocks, home" }).click();
  await page.waitForFunction(() => (window as any).__workerLifetime.started === 2);
  await page.getByTestId("library-search").fill("AEO");
  await expect(page.getByTestId("result-count")).toHaveText(`${aeoResultCount} results`, { timeout: 20000 });
  expect(await page.evaluate(() => (window as any).__workerLifetime.started)).toBe(2);
});
