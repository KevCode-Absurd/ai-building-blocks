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

// Every app on the site, with how many screens its tour shows (site/src/apps/data.ts).
const APPS: [string, number][] = [["mercatura-ads", 9], ["mercatura-creative-studio", 6], ["mercatura-landing-pages", 4], ["mercatura-seo", 4], ["mercatura", 4]];

test("the header leads to Apps: the six-step ladder, five apps and the starter pack", async ({ page }) => {
  await page.goto("/");
  await page.locator(".nav").getByRole("link", { name: "Apps" }).click();
  const index = page.getByTestId("apps-index");
  await expect(index).toBeVisible();
  await expect(page).toHaveTitle("Apps · AI Blocks");
  await expect(index.getByTestId("ladder").locator("li b")).toHaveText(["Prompt", "Skill", "Routine", "Workflow", "Agent", "App"]);
  await expect(index.getByTestId("app-card")).toHaveCount(APPS.length);
  for (const [slug] of APPS) await expect(index.locator(`[data-testid="app-card"][data-slug="${slug}"]`)).toBeVisible();
  await expect(index.getByTestId("app-card").filter({ hasText: "Uses an agent" })).toHaveCount(0);
  await expect(index.locator(".ap-stages li")).toHaveCount(9);
  await expect(page.locator(".footer").getByRole("link", { name: "App starter pack" })).toHaveAttribute("href", "/apps/starter-pack");
});

for (const [slug, n] of APPS) {
  test(`${slug}: the tour clicks through all ${n} screens, and the page says it uses no agents`, async ({ page }) => {
    await page.goto(`/apps/${slug}`);
    const app = page.getByTestId("app-page");
    await expect(app).toHaveAttribute("data-slug", slug);
    const tour = app.getByTestId("tour");
    await expect(tour.getByTestId("tour-back")).toBeDisabled();
    const seen = new Set<string>();
    for (let i = 0; i < n; i++) {
      await expect(tour.locator(".ap-count")).toHaveText(`Screen ${i + 1} of ${n}`);
      seen.add((await tour.getByTestId("tour-screen").getAttribute("data-screen"))!);
      await expect(tour.getByTestId("tour-screen").locator("h3, .mc-head h3").first()).toBeVisible();
      if (i < n - 1) await tour.getByTestId("tour-next").click();
    }
    expect(seen.size, "every screen is different").toBe(n);
    await expect(tour.getByTestId("tour-next")).toBeDisabled();
    await tour.getByRole("tab").first().click();
    await expect(tour.locator(".ap-count")).toHaveText(`Screen 1 of ${n}`);
    await expect(app.getByTestId("agents-answer")).toBeVisible();
    await expect(app.locator("#agents-h")).toHaveText("No, it doesn't use agents");
    await expect(app.getByTestId("built-steps").locator("li").first()).toBeVisible();
    // The blocks it's made of are real pages in the library.
    const links = app.locator(".ap-blocks a");
    await expect(links.first()).toBeVisible();
    for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute("href")))) expect(href).toMatch(/^\/(skills|prompts|workflows)\/[a-z0-9-]+$/);
  });
}

test("the client app says it's example data and shows only Sprout and rivals A to C", async ({ page }) => {
  await page.goto("/apps/mercatura-ads");
  const app = page.getByTestId("app-page");
  await expect(app.getByTestId("example-note")).toContainText("took out every name, product and number");
  await expect(app.locator(".mc-badge")).toHaveText("Example data");
  await expect(app.getByTestId("tour-screen")).toContainText("Sprout");
  await app.getByRole("tab", { name: "Competitors" }).click();
  await expect(app.getByTestId("tour-screen")).toContainText("Rival A");
  // The repo's masking check passes: no word that could name the real client is in the app pages.
  expect(execFileSync("node", ["../tools/check-masking.mjs"], { encoding: "utf8" })).toContain("files clean");
});

test("the Mercatura apps link to the open-source starter, and each standalone app points to the combined one", async ({ page }) => {
  await page.goto("/apps/mercatura-landing-pages");
  await expect(page.getByTestId("repo-link")).toHaveAttribute("href", "https://github.com/KevCode-Absurd/mercatura-client-starter");
  await page.getByTestId("app-page").locator(".ap-example a").click();
  const combined = page.getByTestId("app-page");
  await expect(combined).toHaveAttribute("data-slug", "mercatura");
  await expect(combined.locator("#parts [data-testid=app-card]")).toHaveCount(3);
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
  await page.locator("#app").getByRole("link", { name: "Take the tour of example apps" }).click();
  await expect(page.getByTestId("apps-index")).toBeVisible();
});

test("every page has its own address on useaiblocks.com", async ({ page }) => {
  await page.goto("/apps/mercatura-seo");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://useaiblocks.com/apps/mercatura-seo");
  await expect(page.locator(".header .brand")).toHaveText("AI Blocks");
  await expect(page.locator(".footer")).toContainText("useaiblocks.com");
  const map = fs.readFileSync("public/sitemap.xml", "utf8");
  for (const [slug] of APPS) expect(map).toContain(`<loc>https://useaiblocks.com/apps/${slug}</loc>`);
  expect(fs.readFileSync("public/robots.txt", "utf8")).toContain("Sitemap: https://useaiblocks.com/sitemap.xml");
});

test("@mobile the tour fits a phone: no sideways scroll, and Next still works", async ({ page }) => {
  await page.goto("/apps/mercatura-ads");
  const tour = page.getByTestId("tour");
  for (let i = 0; i < 3; i++) {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "no sideways scroll").toBe(true);
    await tour.getByTestId("tour-next").click();
  }
  await expect(tour.locator(".ap-count")).toHaveText("Screen 4 of 9");
});
