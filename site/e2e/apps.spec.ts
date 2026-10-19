import { expect, test, type Page } from "@playwright/test";
import { unzipSync, strFromU8 } from "fflate";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const list: string[] = [];
  errors.set(page, list);
  page.on("pageerror", (e) => list.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") list.push(m.text()); });
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page), "no errors in the browser console").toEqual([]);
});

// The Next.js pages of the saved app fall back to loading the next saved page, and say so in the console.
const EXPECTED = /tour: load the page|Falling back to browser navigation/;

test("the header leads to Apps: one finished example app, the starter pack and the open-source app", async ({ page }) => {
  await page.goto("/");
  await page.locator(".nav").getByRole("link", { name: "Apps" }).click();
  const index = page.getByTestId("apps-index");
  await expect(index).toBeVisible();
  await expect(page).toHaveTitle("Apps · AI Blocks");
  await expect(index.getByTestId("tour-open")).toHaveAttribute("href", "/example-app/");
  await expect(index.getByTestId("tour-open")).toHaveAttribute("target", "_blank");
  await expect(index.getByTestId("example-note")).toContainText("nothing runs");
  await expect(index.getByTestId("app-area")).toHaveCount(9);
  await expect(index.locator(".ap-stages li")).toHaveCount(9);
  await expect(index.getByTestId("repo-link")).toHaveAttribute("href", "https://github.com/KevCode-Absurd/mercatura-client-starter");
  await expect(page.locator(".footer").getByRole("link", { name: "App starter pack" })).toHaveAttribute("href", "/apps/starter-pack");
  // Every picture on the page is there.
  for (const src of await index.locator("img").evaluateAll((im) => im.map((i) => i.getAttribute("src")))) expect((await page.request.get(src!)).status(), src!).toBe(200);
});

test("every part of the app the page lists opens a saved screen", async ({ page }) => {
  await page.goto("/apps");
  const hrefs = await page.getByTestId("app-area").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
  for (const h of hrefs) {
    const r = await page.request.get(h.replace(/\/$/, ""));
    expect(r.status(), h).toBe(200);
    expect(await r.text(), h).toContain("/example-app/_tour/tour.js");
  }
});

test("the example app works with no server: screens open, links move between them, and nothing is made", async ({ page }) => {
  const list = errors.get(page)!;
  await page.goto("/example-app/");
  await expect(page).toHaveTitle(/Creative Studio/);
  await expect(page.locator("#tour-bar")).toContainText("Nothing here runs");
  await expect(page.locator("#tour-bar a", { hasText: "Back to AI Blocks" })).toHaveAttribute("href", "/apps");
  await page.locator('a[href="/example-app/references"]').first().click();
  await expect(page).toHaveURL(/\/example-app\/references$/);
  await expect(page.locator("main h1, main h2").first()).toBeVisible();
  // Anything that would make or save something is stopped, with a note for the person who clicked.
  await page.mouse.click(4, 450);
  const status = await page.evaluate(() => fetch("/api/jobs", { method: "POST", body: "{}" }).then((r) => r.status));
  expect(status).toBe(403);
  await expect(page.locator("#tour-toast")).toContainText("Nothing is made, changed or saved here");
  // A screen that isn't in the tour says so and links back.
  const missing = await page.request.get("/example-app/not-a-screen");
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain("This screen isn't in the tour");
  errors.set(page, list.filter((e) => !EXPECTED.test(e)));
});

test("old tour pages lead to the Apps page", async ({ page }) => {
  await page.goto("/apps/mercatura-ads");
  await expect(page.getByTestId("apps-index")).toBeVisible();
});

test("no word that could name the private client is in the app pages or the saved example app", async () => {
  expect(execFileSync("node", ["../tools/check-masking.mjs"], { encoding: "utf8" })).toContain("files clean");
});

test("the starter pack downloads the same folder every time, with the prompt, the rules and nine stages", async ({ page }, info) => {
  await page.goto("/apps/starter-pack");
  const sp = page.getByTestId("starter-page");
  await expect(sp.locator("#stages .ap-stages li")).toHaveCount(9);
  await expect(sp.locator("#prompt")).toContainText("Ask before you build");
  const grab = async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), sp.getByTestId("starter-download").click()]);
    const path = info.outputPath(`${Date.now()}-${dl.suggestedFilename()}`);
    await dl.saveAs(path);
    return { name: dl.suggestedFilename(), bytes: fs.readFileSync(path) };
  };
  const a = await grab();
  const b = await grab();
  expect(a.name).toBe("app-starter.zip");
  expect(Buffer.compare(a.bytes, b.bytes), "same pack, same bytes").toBe(0);
  const files = unzipSync(new Uint8Array(a.bytes));
  const names = Object.keys(files);
  expect(names).toEqual(expect.arrayContaining(["app-starter/README.md", "app-starter/START-HERE.md", "app-starter/CLAUDE.md", "app-starter/QUESTIONS.md", "app-starter/stages/5-teams-and-roles.md", "app-starter/templates/APP-BRIEF.md", "app-starter/templates/LAUNCH-CHECKLIST.md"]));
  expect(names.filter((n) => n.startsWith("app-starter/stages/"))).toHaveLength(9);
  // Each file in the zip is the file in the repo.
  for (const n of names) expect(strFromU8(files[n]), n).toBe(fs.readFileSync(`../${n}`, "utf8").replace(/\r\n/g, "\n"));
  expect(strFromU8(files["app-starter/CLAUDE.md"])).toContain("mock mode");
});

test("How it works has six kinds, with routines, and its app section leads to Apps", async ({ page }) => {
  await page.goto("/how-it-works");
  await expect(page.locator(".hiw-ladder li b")).toHaveText(["Prompt", "Skill", "Routine", "Workflow", "Agent", "App"]);
  await expect(page.locator("#routine")).toBeVisible();
  await page.locator("#app").getByRole("link", { name: "Take the tour of a finished app" }).click();
  await expect(page.getByTestId("apps-index")).toBeVisible();
});

test("every page has its own address on useaiblocks.com, and the saved app stays out of search", async ({ page }) => {
  await page.goto("/apps/starter-pack");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://useaiblocks.com/apps/starter-pack");
  await expect(page.locator(".header .brand")).toHaveText("AI Blocks");
  await expect(page.locator(".footer")).toContainText("useaiblocks.com");
  const map = fs.readFileSync("public/sitemap.xml", "utf8");
  for (const p of ["/apps", "/apps/starter-pack"]) expect(map).toContain(`<loc>https://useaiblocks.com${p}</loc>`);
  expect(map).not.toContain("example-app");
  expect(fs.readFileSync("public/robots.txt", "utf8")).toContain("Sitemap: https://useaiblocks.com/sitemap.xml");
  expect(fs.readFileSync("public/example-app/index.html", "utf8")).toContain('<meta name="robots" content="noindex">');
});

test("@mobile the Apps page fits a phone: no sideways scroll", async ({ page }) => {
  await page.goto("/apps");
  await expect(page.getByTestId("app-area").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "no sideways scroll").toBe(true);
});
