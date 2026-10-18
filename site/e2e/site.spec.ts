import { expect, test, type Page } from "@playwright/test";
import { unzipSync, strFromU8 } from "fflate";
import fs from "node:fs";

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

const cards = (page: Page) => page.getByTestId("block-card");

test("hero says what we do, in our words", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Making humanity AI native");
  await expect(page.locator(".hero .lede")).toContainText("10x human");
  await expect(page.locator(".hero .lede")).toContainText("Save hours every week");
  await expect(page.locator(".hero").getByRole("link", { name: "Browse the blocks" })).toBeVisible();
});

test("no brand names or brand pictures on the page", async ({ page }) => {
  await page.goto("/");
  await expect(cards(page).first()).toBeVisible();
  const text = await page.locator("body").innerText();
  for (const brand of ["Grüns", "Gruns", "AG1", "IM8", "Gehna", "Nourish"]) expect(text).not.toContain(brand);
  await expect(page.locator("img")).toHaveCount(0);
});

test("dark by default, light on request, and the choice is remembered", async ({ page }) => {
  await page.goto("/");
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await bg()).toBe("rgb(10, 10, 10)");
  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await bg()).toBe("rgb(250, 250, 250)");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("header links jump to each section", async ({ page }) => {
  await page.goto("/");
  for (const [label, id] of [["Library", "library"], ["Workflows", "workflows"], ["Builder", "build"], ["Testing", "testing"]]) {
    await page.locator(".nav").getByRole("link", { name: label }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test("search and filters narrow the library, and clearing brings it back", async ({ page }) => {
  await page.goto("/#library");
  const count = page.getByTestId("result-count");
  const all = parseInt(await count.innerText());
  expect(all).toBeGreaterThan(100);
  await page.getByTestId("library-search").fill("landing page");
  await expect(count).not.toHaveText(`${all} blocks`);
  const some = parseInt(await count.innerText());
  expect(some).toBeGreaterThan(0);
  expect(some).toBeLessThan(all);
  await page.locator(".chips").getByRole("button", { name: /^Check/ }).click();
  await expect(cards(page).first().locator(".role-mark")).toHaveText("Check");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(count).toHaveText(`${all} blocks`);
  await page.getByTestId("library-search").fill("zzzz nothing here");
  await expect(page.getByText("No blocks match that yet")).toBeVisible();
});

test("a block opens in a drawer with its skill, and the link can be shared", async ({ page }) => {
  await page.goto("/#library");
  const first = cards(page).first();
  const slug = await first.getAttribute("data-slug");
  await first.click();
  const drawer = page.getByTestId("drawer");
  await expect(drawer).toBeVisible();
  await expect(drawer.locator(".prose h2").first()).toBeVisible();
  await expect(drawer.locator(".prose")).not.toContainText("name: ");
  await expect(page).toHaveURL(new RegExp(`block=${slug}`));
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(page).not.toHaveURL(/block=/);
  await page.goto(`/?block=${slug}`);
  await expect(page.getByTestId("drawer")).toBeVisible();
});

test("saving a block to a kit persists after a reload", async ({ page }) => {
  await page.goto("/?block=meta-ad-policy-check");
  await page.getByRole("button", { name: "Save to kit" }).click();
  await page.getByLabel("New kit name").fill("Launch checks");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("status")).toContainText("Saved to Launch checks");
  await page.keyboard.press("Escape");
  await page.reload();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("open-kits")).toContainText("1");
  await page.getByTestId("open-kits").click();
  const kit = page.getByTestId("kit");
  await expect(kit).toHaveCount(1);
  await expect(kit.locator("input")).toHaveValue("Launch checks");
  await expect(kit.getByRole("button", { name: "Meta Ad Policy Check" })).toBeVisible();
});

test("a ready workflow opens in the builder as connected, numbered steps", async ({ page }) => {
  await page.goto("/#workflows");
  const card = page.getByTestId("workflow-card").filter({ hasText: "Brand Brain to Video Ad Script" });
  await card.click();
  await page.getByRole("button", { name: "Open in builder" }).click();
  const builder = page.getByTestId("builder");
  await expect(builder.getByTestId("flow-node")).toHaveCount(6);
  await expect(builder.getByText("Step 6")).toBeVisible();
  await expect(page.getByLabel("Workflow name")).toHaveValue("Brand Brain to Video Ad Script and Shot List");
  await expect(page.getByTestId("flow-status")).toContainText("runs in 6 steps");
  await page.reload();
  await expect(page.getByTestId("builder").getByTestId("flow-node")).toHaveCount(6);
});

test("blocks can be added from the palette and auto-connect", async ({ page }) => {
  await page.goto("/#build");
  const builder = page.getByTestId("builder");
  await builder.getByTestId("palette-search").fill("policy check");
  await builder.getByRole("button", { name: "Add Meta Ad Policy Check" }).click();
  await builder.getByTestId("palette-search").fill("brand voice");
  await builder.getByRole("button", { name: /^Add Ad Copy Brand Voice Check/ }).click();
  await expect(builder.getByTestId("flow-node")).toHaveCount(2);
  await expect(builder.locator(".react-flow__edge")).toHaveCount(1);
});

test("the handoff download is a complete, repeatable pack", async ({ page }, info) => {
  await page.goto("/?block=customer-reviews-to-static-ad-set");
  const grab = async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("drawer").getByRole("button", { name: "Download handoff" }).click()]);
    const path = info.outputPath(`${Date.now()}-${dl.suggestedFilename()}`);
    await dl.saveAs(path);
    return { name: dl.suggestedFilename(), bytes: fs.readFileSync(path) };
  };
  const a = await grab();
  const b = await grab();
  expect(a.name).toBe("customer-reviews-to-static-ad-set-handoff.zip");
  expect(Buffer.compare(a.bytes, b.bytes), "same workflow, same bytes").toBe(0);
  const files = unzipSync(new Uint8Array(a.bytes));
  const names = Object.keys(files);
  expect(names).toEqual(expect.arrayContaining(["HANDOFF.md", "workflow.json", "README.txt", "skills/static-ad-image-prompt-compiler/SKILL.md"]));
  expect(names.filter((n) => n.startsWith("skills/"))).toHaveLength(5);
  const handoff = strFromU8(files["HANDOFF.md"]);
  expect(handoff).toContain("## Before you start");
  for (let i = 1; i <= 5; i++) expect(handoff).toContain(`### Step ${i}:`);
  expect(handoff).toContain("Write `MISSING: <what>`");
  const wf = JSON.parse(strFromU8(files["workflow.json"]));
  expect(wf.steps.map((s: { skill: string }) => s.skill)[0]).toBe("brand-knowledge-folder-from-website");
});

test("phone width: no sideways scroll, drawer fills the screen @mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.goto("/?block=meta-ad-policy-check");
  const box = await page.getByTestId("drawer").boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual((page.viewportSize()?.width ?? 0) - 1);
});
