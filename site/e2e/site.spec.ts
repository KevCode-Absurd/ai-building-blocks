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
const MODEL = "write-ads-people-believe"; // the block with the finished model page
const WORKFLOW = "turn-your-reviews-into-image-ads-buyers-believe";

test("hero is the headline, the mono subhead and two buttons, over the globe", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Making humanity AI native");
  await expect(page.locator(".hero .lede")).toContainText("Save hours every week");
  expect(await page.locator(".hero .lede").evaluate((el) => getComputedStyle(el).fontFamily)).toContain("JetBrains Mono");
  await expect(page.locator(".hero").getByRole("link")).toHaveText(["Browse the blocks", "Build a workflow"]);
  await expect(page.locator(".hero-in > *")).toHaveCount(3);
  const globe = page.getByTestId("globe");
  await expect(globe).toBeVisible();
  expect(await globe.evaluate((c: HTMLCanvasElement) => c.width > 0 && c.height > 0)).toBe(true);
});

test("no brands, no jargon labels, no business split, no agents", async ({ page }) => {
  await page.goto("/");
  await expect(cards(page).first()).toBeVisible();
  const text = await page.locator("body").innerText();
  for (const word of ["Grüns", "Gruns", "AG1", "IM8", "Gehna", "Nourish", "Digest", "Orchestrate", "Ecommerce", "Any business", "Agents", "brand brain"]) expect(text).not.toContain(word);
  await expect(page.getByRole("button", { name: /^(Source|Digest|Make|Render|Check)\s*\d*$/ })).toHaveCount(0);
  await expect(page.locator("img")).toHaveCount(0);
});

test("light by default, even on a dark system; dark on request, and remembered", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await bg()).toBe("rgb(250, 250, 250)");
  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await bg()).toBe("rgb(10, 10, 10)");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByTestId("theme-toggle").click();
  expect(await bg()).toBe("rgb(250, 250, 250)");
});

test("header links jump to the library and the builder", async ({ page }) => {
  await page.goto("/");
  for (const [label, id] of [["Library", "library"], ["Builder", "build"]]) {
    await page.locator(".nav").getByRole("link", { name: label }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
  await page.locator(".hero").getByRole("link", { name: "Build a workflow" }).click();
  await expect(page.getByTestId("builder")).toBeInViewport();
});

test("the library opens on job functions, and is sorted into prompts, skills and workflows", async ({ page }) => {
  await page.goto("/#library");
  await expect(page.locator(".fns .fn")).toHaveCount(8);
  await expect(page.getByTestId("fn-media-buyer")).toContainText("Meta media buyer");
  await expect(page.locator(".fns .fn .px")).toHaveCount(8); // every function has its pixel icon
  await expect(page.getByRole("tab")).toHaveText([/^All/, /^Prompts/, /^Skills/, /^Workflows/]);
  for (const kind of ["prompt", "skill", "workflow"]) {
    await page.getByTestId(`tab-${kind}`).click();
    await expect(cards(page).first()).toHaveAttribute("data-kind", kind);
    const kinds = await cards(page).evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("data-kind")))]);
    expect(kinds).toEqual([kind]);
  }
});

test("picking a function, a job and filters narrow the library; the choice is kept in the link", async ({ page }) => {
  await page.goto("/#library");
  const count = page.getByTestId("result-count");
  const all = parseInt(await count.innerText());
  expect(all).toBeGreaterThan(100);
  await page.getByTestId("fn-copywriter").click();
  const forFn = parseInt(await count.innerText());
  expect(forFn).toBeLessThan(all);
  await expect(page.getByTestId("subjobs")).toBeVisible();
  await page.getByTestId("job-write-ad-copy").click();
  await expect(page.getByTestId("job-write-ad-copy")).toHaveAttribute("aria-pressed", "true");
  await expect(cards(page).first().locator(".type")).toHaveText("Write ad copy");
  await expect(page).toHaveURL(/job=write-ad-copy/);
  await page.reload();
  await expect(page.getByTestId("job-write-ad-copy")).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Clear all" }).click();
  await expect(count).toHaveText(new RegExp(`^${all} results`));
  // The dropdowns: pick with the mouse, then with the keyboard.
  await page.getByTestId("filter-biz").click();
  await page.getByRole("option", { name: /Online stores/ }).click();
  await expect(page).toHaveURL(/biz=store/);
  const stores = parseInt(await count.innerText());
  expect(stores).toBeLessThan(all);
  await page.getByTestId("filter-level").focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/level=beginner/);
  await page.getByRole("button", { name: "Clear all" }).click();
  await page.getByTestId("library-search").fill("landing page");
  const some = parseInt(await count.innerText());
  expect(some).toBeGreaterThan(0);
  expect(some).toBeLessThan(all);
  await page.getByTestId("library-search").fill("zzzz nothing here");
  await expect(page.getByText("Nothing matches that yet")).toBeVisible();
});

test("a card opens the block's own page, with the outcome, a real example and the steps", async ({ page }) => {
  await page.goto("/#library");
  const card = cards(page).filter({ has: page.locator(`[data-slug="${MODEL}"]`) }).or(page.locator(`[data-slug="${MODEL}"]`)).first();
  await card.click();
  await expect(page).toHaveURL(new RegExp(`/prompts/${MODEL}$`));
  const bp = page.getByTestId("block-page");
  await expect(bp.getByRole("heading", { level: 1 })).toContainText("Write ads people believe");
  await expect(bp.locator(".bp-sub")).toContainText("product facts");
  await expect(bp.locator("#example .code")).toHaveCount(2);
  await expect(bp.locator("#example")).toContainText("Sprout");
  // The sample output writes itself out once it is on screen, then can be replayed.
  const out = bp.locator("#example .code").first();
  await out.scrollIntoViewIfNeeded();
  await expect(out.getByTestId("code-replay")).toHaveText("Replay", { timeout: 8000 });
  await expect(out.locator(".ln.ghost")).toHaveCount(0);
  await out.getByTestId("code-replay").click();
  await expect(out.locator(".code-meta")).toContainText("writing");
  await out.getByTestId("code-replay").click(); // Skip
  await expect(out.locator(".ln.ghost")).toHaveCount(0);
  for (const id of ["what", "io", "use", "most", "test", "improve", "file"]) await expect(bp.locator(`#${id}`)).toBeVisible();
  await expect(bp.locator(".prose").first()).not.toContainText("name: ");
  await page.getByRole("link", { name: /Library/ }).first().click();
  await expect(page).toHaveURL(/\/(\?.*)?#library$/);
  await expect(page.locator("#library")).toBeInViewport();
});

test("old links and wrong types land on the right page", async ({ page }) => {
  await page.goto(`/?block=${MODEL}`);
  await expect(page).toHaveURL(new RegExp(`/prompts/${MODEL}$`));
  await page.goto(`/skills/${MODEL}`);
  await expect(page).toHaveURL(new RegExp(`/prompts/${MODEL}$`));
  // Renamed blocks: the old name still leads to the new page.
  await page.goto("/prompts/buyer-led-selling-fact-to-appeal");
  await expect(page).toHaveURL(new RegExp(`/prompts/${MODEL}$`));
  await page.goto("/?block=customer-reviews-to-static-ad-set");
  await expect(page).toHaveURL(new RegExp(`/workflows/${WORKFLOW}$`));
  await page.goto("/skills/no-such-thing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("That page has moved");
});

test("saving a block to a kit persists after a reload", async ({ page }) => {
  await page.goto(`/prompts/${MODEL}`);
  await page.getByRole("button", { name: "Save to kit" }).click();
  await page.getByLabel("New kit name").fill("Launch checks");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("status")).toContainText("Saved to Launch checks");
  await page.goto("/");
  await expect(page.getByTestId("open-kits")).toContainText("1");
  await page.getByTestId("open-kits").click();
  const kit = page.getByTestId("kit");
  await expect(kit).toHaveCount(1);
  await expect(kit.locator("input")).toHaveValue("Launch checks");
  await kit.getByRole("link").first().click();
  await expect(page).toHaveURL(new RegExp(`/prompts/${MODEL}$`));
});

test("a ready workflow opens in the builder as connected, numbered steps", async ({ page }) => {
  await page.goto(`/workflows/${WORKFLOW}`);
  await expect(page.locator("#steps li")).toHaveCount(5);
  await page.getByRole("button", { name: "Open in the builder" }).click();
  const builder = page.getByTestId("builder");
  await expect(builder.getByTestId("flow-node")).toHaveCount(5);
  await expect(builder.getByText("Step 5")).toBeVisible();
  await expect(page.getByTestId("flow-status")).toContainText("runs in 5 steps");
  await page.reload();
  await expect(page.getByTestId("builder").getByTestId("flow-node")).toHaveCount(5);
});

test("blocks can be added from the palette and auto-connect", async ({ page }) => {
  await page.goto("/#build");
  const builder = page.getByTestId("builder");
  await builder.getByTestId("palette-search").fill("blocking your ads");
  await builder.locator('.pal-item[data-slug="keep-facebook-from-blocking-your-ads"] .add').click();
  await builder.getByTestId("palette-search").fill("sound like your brand");
  await builder.locator('.pal-item[data-slug="make-every-ad-sound-like-your-brand"] .add').click();
  await expect(builder.getByTestId("flow-node")).toHaveCount(2);
  await expect(builder.locator(".react-flow__edge")).toHaveCount(1);
});

test("the builder suggests where to start, then what comes next", async ({ page }) => {
  await page.goto("/#build");
  const builder = page.getByTestId("builder");
  const sug = builder.getByTestId("suggestions");
  await expect(sug.locator(".pal-group").first()).toHaveText("Start with one of these");
  await sug.locator(".pal-item .add").first().click();
  await expect(builder.getByTestId("flow-node")).toHaveCount(1);
  await expect(sug.locator(".pal-group").first()).toContainText("Next after");
  await expect(sug.locator(".pal-item").first()).toBeVisible();
  await sug.locator(".pal-item .add").first().click();
  await expect(builder.getByTestId("flow-node")).toHaveCount(2);
  await expect(builder.locator(".react-flow__edge")).toHaveCount(1);
});

test("from a skill: start a workflow, then add another skill to it and reorder", async ({ page }) => {
  await page.goto(`/?block=${MODEL}`);
  await page.getByTestId("add-to-workflow").click();
  const dlg = page.getByTestId("add-to-flow");
  await expect(dlg).toBeVisible();
  await dlg.getByTestId("atf-new").click();
  const steps = dlg.getByTestId("atf-steps").locator("li");
  await expect(steps).toHaveCount(1);
  const sugg = dlg.getByTestId("atf-suggestions").locator("button").first();
  const second = (await sugg.getAttribute("data-slug"))!;
  await sugg.click();
  await expect(steps).toHaveCount(2);
  await dlg.getByTestId("atf-name").fill("Sprout launch");
  await dlg.getByTestId("atf-save").click();
  await expect(dlg.getByTestId("atf-done")).toBeVisible();
  await dlg.getByTestId("atf-open").click();
  await expect(page).toHaveURL(/#build$/);
  await expect(page.getByTestId("flow-node")).toHaveCount(2);
  await expect(page.locator(".flow-name")).toHaveValue("Sprout launch");

  // A different skill goes into the same workflow, then moves to the front.
  const other = await page.evaluate(async (skip) => {
    const c = await (await fetch("/data/blocks.json")).json();
    return c.blocks.find((b: { slug: string; category: string; type: string }) => b.category !== "orchestrator" && b.type !== "prompt" && !skip.includes(b.slug)).slug as string;
  }, [MODEL, second]);
  await page.goto(`/?block=${other}`);
  await page.getByTestId("add-to-workflow").click();
  await dlg.getByTestId("atf-mine").getByRole("button", { name: /Sprout launch/ }).click();
  await expect(steps).toHaveCount(3);
  await expect(steps.nth(2)).toHaveAttribute("data-slug", other);
  await steps.nth(2).dragTo(steps.nth(0));
  await expect(steps.nth(0)).toHaveAttribute("data-slug", other);
  await steps.nth(2).getByTestId("atf-remove").click();
  await expect(steps).toHaveCount(2);
  await dlg.getByTestId("atf-save").click();
  await dlg.getByTestId("atf-open").click();
  await expect(page.getByTestId("flow-node")).toHaveCount(2);
  await expect(page.getByTestId("flow-status")).toContainText("2 blocks");
});

test("paste your details once, copy the skill with them", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(`/prompts/${MODEL}`);
  const box = page.getByTestId("composer");
  await box.locator("textarea").fill("Buyer: busy parents. Format: Facebook image ad.");
  await box.getByRole("button", { name: "Copy the skill with my details" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("Buyer: busy parents");
  expect(copied).toContain("name: ");
  await page.reload();
  await expect(page.getByTestId("composer").locator("textarea")).toHaveValue(/busy parents/);
});

test("the workflow download is a complete, repeatable pack", async ({ page }, info) => {
  await page.goto(`/workflows/${WORKFLOW}`);
  const grab = async () => {
    const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("block-page").getByTestId("download-handoff").click()]);
    const path = info.outputPath(`${Date.now()}-${dl.suggestedFilename()}`);
    await dl.saveAs(path);
    return { name: dl.suggestedFilename(), bytes: fs.readFileSync(path) };
  };
  const a = await grab();
  const b = await grab();
  expect(a.name).toMatch(/^[a-z0-9-]+-handoff\.zip$/);
  expect(Buffer.compare(a.bytes, b.bytes), "same workflow, same bytes").toBe(0);
  const files = unzipSync(new Uint8Array(a.bytes));
  const names = Object.keys(files);
  expect(names).toEqual(expect.arrayContaining(["HANDOFF.md", "workflow.json", "README.txt", "skills/stop-image-tools-redrawing-your-product-and-words/SKILL.md"]));
  expect(names.filter((n) => n.startsWith("skills/"))).toHaveLength(5);
  const handoff = strFromU8(files["HANDOFF.md"]);
  expect(handoff).toContain("## Before you start");
  for (let i = 1; i <= 5; i++) expect(handoff).toContain(`### Step ${i}:`);
  expect(handoff).toContain("Write `MISSING: <what>`");
  expect(handoff).not.toContain("Role:");
  const wf = JSON.parse(strFromU8(files["workflow.json"]));
  expect(wf.steps.map((s: { skill: string }) => s.skill)[0]).toBe("turn-website-into-brand-file-for-ai");
});

test("a skill installs: the zip is a folder Claude can upload, and every AI has its steps", async ({ page }, info) => {
  await page.goto("/skills/get-different-video-ads-from-same-research");
  const bp = page.getByTestId("block-page");
  await bp.getByTestId("add-to-ai").click();
  const box = bp.getByTestId("install");
  await expect(box).toBeInViewport();
  await expect(box.getByRole("tab", { selected: true })).toHaveText("Claude");
  const [dl] = await Promise.all([page.waitForEvent("download"), box.getByTestId("install-zip").click()]);
  expect(dl.suggestedFilename()).toBe("get-different-video-ads-from-same-research.zip");
  const path = info.outputPath(dl.suggestedFilename());
  await dl.saveAs(path);
  const files = unzipSync(new Uint8Array(fs.readFileSync(path)));
  const skill = strFromU8(files["get-different-video-ads-from-same-research/SKILL.md"]);
  expect(skill).toMatch(/^---\nname: get-different-video-ads-from-same-research\ndescription: /);
  expect(Object.keys(files)).toContain("get-different-video-ads-from-same-research/references/types.md");
  await box.getByTestId("install-code").click();
  await expect(box).toContainText("/get-different-video-ads-from-same-research");
  await box.getByTestId("install-chatgpt").click();
  await expect(box).toContainText(/characters/);
  // The choice is remembered on the next skill.
  await page.goto(`/prompts/${MODEL}`);
  await expect(page.getByTestId("install").getByRole("tab", { selected: true })).toHaveText("ChatGPT");
});

test("phone width: no sideways scroll on home or a block page @mobile", async ({ page }) => {
  for (const url of ["/", `/prompts/${MODEL}`]) {
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, url).toBeLessThanOrEqual(0);
  }
});
