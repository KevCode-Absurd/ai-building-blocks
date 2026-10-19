import { expect, test, type Page } from "@playwright/test";
import { unzipSync, strFromU8 } from "fflate";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

// The tools and their worked examples, as plain data: tools/build-mini-tool.mjs writes this file on every `npm run dev` or build.
// (Playwright can't load the .mjs formula files themselves, so the board rules are repeated in a few lines below.)
type Item = { id: string; unit: string; boards?: string[]; none?: string; row?: string; helper?: boolean };
type AnyTool = { slug: string; headline: string; presets: { id: string; label: string }[]; sections?: { id: string; label: string; closed?: boolean }[]; inputs: Item[]; outputs: Item[] };
type Example = { name: string; preset?: string; inputs: Record<string, number>; expect: Record<string, number | null>; says?: string };
const DATA = JSON.parse(fs.readFileSync("public/mini-tools/tools.json", "utf8")) as { tools: AnyTool[]; examples: Record<string, Example[]> };
const tools = DATA.tools;
const EXAMPLES = DATA.examples;
const presetOf = (t: AnyTool, id?: string) => t.presets.find((p) => p.id === id) ?? t.presets[0];
const on = (x: Item, preset: string) => !x.boards || x.boards.includes(preset);
const visibleInputs = (t: AnyTool, preset: string) => t.inputs.filter((i) => on(i, preset));
const visibleOutputs = (t: AnyTool, preset: string) => t.outputs.filter((o) => !o.helper && on(o, preset));

// The mini tools: the Tools page, each tool's page, and the files behind the five ways.
// Answers on the page come from the same formula files as the worked examples, so here we type each example in
// through the page itself and read the answers back off the screen.

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

const fill = async (page: Page, id: string, v: string | number) => page.getByTestId(`input-${id}`).fill(String(v));

test("the Tools page lists all eight mini tools, and the header and footer lead to it", async ({ page }) => {
  await page.goto("/");
  await page.locator(".nav").getByRole("link", { name: "Tools" }).click();
  await expect(page).toHaveURL(/\/tools$/);
  const index = page.getByTestId("tools-index");
  await expect(index.getByRole("heading", { level: 1 })).toHaveText("Know your numbers before you spend money");
  await expect(index.getByTestId("tool-card")).toHaveCount(8);
  expect(await index.getByTestId("tool-card").evaluateAll((els) => els.map((e) => e.getAttribute("data-slug")))).toEqual(tools.map((t) => t.slug));
  await index.getByTestId("tool-card").first().click();
  await expect(page).toHaveURL(/\/tools\/discount-calculator$/);
  await expect(page.getByTestId("tool-page").getByRole("heading", { level: 1 })).toHaveText(tools[0].headline);
  await page.goto("/how-it-works");
  await page.locator(".footer").getByRole("link", { name: "Mini tools" }).click();
  await expect(page).toHaveURL(/\/tools$/);
});

test("the answer and every line of the working change as you type", async ({ page }) => {
  await page.goto("/tools/discount-calculator");
  const answer = page.getByTestId("answer");
  await expect(answer).toHaveText("At 20% off you keep $24.00 an order instead of $36.00. To make the same profit, you need to sell 50% more.");
  await expect(page.getByTestId("example-note")).toContainText("example numbers");
  await fill(page, "price", "100");
  await expect(answer).toContainText("At 20% off you keep $56.00 an order instead of $76.00");
  await expect(page.getByTestId("value-salePrice")).toHaveText("$80.00");
  await expect(page.locator('[data-line="salePrice"] code')).toHaveText("$100.00 × (100% − 20%) = $80.00");
  await expect(page.getByTestId("example-note")).toContainText("Your numbers");
  // A loss is said plainly.
  await fill(page, "discount", "100");
  await expect(answer).toContainText("you lose $24.00 on every order");
  await expect(page.getByTestId("value-extraSales")).toHaveText("Selling more can't make it up");
  // Any currency.
  await page.getByTestId("currency").fill("€");
  await expect(answer).toContainText("€24.00");
  // A number that can't be used is named, and no answer is guessed.
  await fill(page, "discount", "120");
  await expect(page.getByRole("alert")).toHaveText("Use 100 or less");
  await expect(answer).toHaveText("Fix the numbers marked in red to see the answer.");
  // What you typed is still there next time.
  await fill(page, "discount", "30");
  await page.reload();
  await expect(page.getByTestId("input-discount")).toHaveValue("30");
  await expect(page.getByTestId("input-price")).toHaveValue("100");
});

test("online store adds shipping, payment fees and ad return to the discount calculator", async ({ page }) => {
  await page.goto("/tools/discount-calculator");
  await expect(page.getByTestId("input-shipping")).toHaveCount(0);
  await page.getByTestId("preset-ecommerce").click();
  for (const id of ["shipping", "fee", "roas"]) await expect(page.getByTestId(`input-${id}`)).toBeVisible();
  await expect(page.getByTestId("answer")).toContainText("At 20% off you lose $3.44 on every order");
  await expect(page.getByTestId("value-breakEvenRoas")).toHaveText("2.90x");
  await expect(page.getByTestId("compare")).toContainText("$2.38"); // 10% off still leaves a little
});

for (const tool of tools) {
  test(`${tool.slug}: every worked example typed into the page gives the hand-checked answers`, async ({ page }) => {
    await page.goto(`/tools/${tool.slug}`);
    await expect(page.getByTestId("answer")).not.toHaveText(/Fix the numbers/);
    for (const s of tool.sections ?? []) if (s.closed) await page.getByTestId("tool-form").locator("summary", { hasText: s.label }).click();
    for (const ex of EXAMPLES[tool.slug]) {
      const preset = presetOf(tool, ex.preset).id;
      if (tool.presets.length > 1) await page.getByTestId(`preset-${preset}`).click();
      for (const i of visibleInputs(tool, preset)) await fill(page, i.id, ex.inputs[i.id]);
      const shown = new Set(visibleOutputs(tool, preset).filter((o) => !o.row).map((o) => o.id));
      for (const [id, want] of Object.entries(ex.expect)) {
        if (!shown.has(id)) continue;
        const o = tool.outputs.find((x) => x.id === id)!;
        const cell = page.getByTestId(`value-${id}`);
        if (want === null) { await expect(cell, `${ex.name}: ${id}`).toHaveText(o.none ?? "none"); continue; }
        // The page rounds for display, so the number shown must be within half its last digit of the hand-checked one.
        await expect.poll(async () => {
          const t = (await cell.textContent()) ?? "";
          const n = Number(t.replace(/[^0-9.-]/g, ""));
          const decimals = (t.replace(/[^0-9.]/g, "").split(".")[1] ?? "").length;
          return Math.abs(n - (want as number)) <= 0.51 * 10 ** -decimals;
        }, { message: `${ex.name}: ${id} should show about ${want}` }).toBe(true);
      }
      if (ex.says) await expect(page.getByTestId("answer"), ex.name).toContainText(new RegExp(ex.says.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    }
  });
}

test("AI run cost shows each model per run and per month, with the date the prices were checked", async ({ page }) => {
  await page.goto("/tools/ai-run-cost");
  const table = page.getByTestId("model-table");
  await expect(table.locator("tbody tr")).toHaveCount(12);
  await expect(table.locator("tr", { hasText: "Claude Opus 5.5" })).toContainText("$0.0320");
  await expect(table.locator("tr", { hasText: "Claude Opus 5.5" })).toContainText("$16.00");
  await expect(page.getByTestId("answer")).toContainText("19 Oct 2026");
  await expect(page.getByTestId("currency")).toHaveCount(0); // lab prices are in dollars
  await fill(page, "runs", "1000");
  await expect(table.locator("tr", { hasText: "Claude Opus 5.5" })).toContainText("$32.00");
});

test("each input says where to find the real number, and the page lists the tools that hold it", async ({ page }) => {
  await page.goto("/tools/order-margin");
  const where = page.locator(".mt-where").first();
  await where.locator("summary").click();
  await expect(where).toContainText("Revenue divided by orders");
  await expect(where).toContainText("Held in: Shopify analytics");
  const best = page.getByTestId("works-best-with");
  for (const name of ["Shopify analytics", "Meta Ads Manager", "Stripe"]) await expect(best).toContainText(name);
  await expect(page.getByTestId("next-step").getByRole("link")).toHaveCount(1);
});

test("the download is one file that works offline and gives the same answer", async ({ page, context }) => {
  await page.goto("/tools/order-margin");
  const res = await page.request.get("/mini-tools/order-margin/order-margin.html");
  expect(res.ok()).toBe(true);
  const html = await res.text();
  expect(html).not.toMatch(/<script[^>]+src=|<link[^>]+stylesheet/);
  // Open it with every network request blocked, as if there were no internet.
  const offline = await context.newPage();
  await offline.route("**/*", (r) => (r.request().url().endsWith("/offline.html") ? r.fulfill({ body: html, contentType: "text/html" }) : r.abort()));
  await offline.goto("http://localhost:5180/offline.html");
  await expect(offline.locator("[data-answer]")).toContainText("You keep $27.60 from each order after ads");
  await offline.locator('[data-input="adCost"]').fill("60");
  await expect(offline.locator("[data-answer]")).toContainText("you lose $12.40 on every order");
  await expect(offline.locator('[data-value="profitAfterAds"]')).toHaveText("-$12.40");
  await offline.close();
  // The button on the page downloads that same file.
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("download-html").click()]);
  expect(dl.suggestedFilename()).toBe("order-margin.html");
});

test("the spreadsheet download holds your numbers, with real formulas that point at them", async ({ page }, info) => {
  await page.goto("/tools/discount-calculator");
  await fill(page, "price", "80");
  await page.getByTestId("currency").fill("£");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("download-xlsx").click()]);
  expect(dl.suggestedFilename()).toBe("discount-calculator.xlsx");
  const file = info.outputPath("discount-calculator.xlsx");
  await dl.saveAs(file);
  const files = unzipSync(new Uint8Array(fs.readFileSync(file)));
  const sheet = strFromU8(files["xl/worksheets/sheet1.xml"]);
  const priceCell = sheet.match(/<c r="(B\d+)"[^>]*><v>80<\/v><\/c>/)![1];
  expect(sheet).toMatch(new RegExp(`<f>${priceCell}\\*\\(1-B\\d+/100\\)</f><v>64</v>`)); // price after 20% off: 80 x 0.8
  expect(strFromU8(files["xl/styles.xml"])).toContain("&quot;£&quot;");
  expect(sheet).toContain("Google Sheets: File &gt; Import &gt; Upload");
});

test("in your AI: the skill, the prompt and the steps to keep it", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/tools/creative-volume-planner");
  const ai = page.getByTestId("way-ai");
  const zip = await page.request.get(await ai.getByTestId("download-skill").getAttribute("href") as string);
  const files = unzipSync(new Uint8Array(await zip.body()));
  const skill = strFromU8(files["creative-volume-planner/SKILL.md"]);
  expect(skill).toMatch(/^---\nname: creative-volume-planner\ndescription: /);
  expect(skill).toContain("Never work a sum out in your head");
  expect(skill).toContain("def calculate(v):");
  await expect(ai.getByTestId("copy-prompt")).toBeEnabled();
  await ai.getByTestId("copy-prompt").click();
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).toContain("Never do the sums in your head");
  expect(prompt).toContain("YOUR_NUMBERS");
  await ai.getByTestId("save-steps").locator("summary").click();
  for (const name of ["Claude, as a Project", "ChatGPT, as a custom GPT", "Gemini, as a Gem"]) await expect(ai.getByTestId("save-steps")).toContainText(name);
});

test("embed: a snippet with a credit link, and a small page that works inside it", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/tools/hourly-rate");
  await page.getByTestId("copy-embed").click();
  const snippet = await page.evaluate(() => navigator.clipboard.readText());
  expect(snippet).toContain('<iframe src="https://useaiblocks.com/mini-tools/hourly-rate/embed.html"');
  expect(snippet).toContain('<a href="https://useaiblocks.com/tools/hourly-rate">');
  await page.goto("/mini-tools/hourly-rate/embed.html");
  await expect(page.locator("[data-answer]")).toContainText("Charge at least $74.88 an hour");
  await expect(page.locator(".credit a")).toHaveAttribute("href", "https://useaiblocks.com/tools/hourly-rate");
});

test("tool pages read at grade 10 or below", async ({ page }, info) => {
  for (const tool of tools) {
    await page.goto(`/tools/${tool.slug}`);
    await expect(page.getByTestId("answer")).toBeVisible();
    // Everything a visitor reads, leaving out the code boxes and the sums in the working.
    const text = await page.getByTestId("tool-page").evaluate((el) => {
      const skip = [...el.querySelectorAll<HTMLElement>("figure.code, .mt-working code, table")];
      skip.forEach((x) => (x.style.display = "none"));
      const t = (el as HTMLElement).innerText;
      skip.forEach((x) => (x.style.display = ""));
      return t;
    });
    const file = info.outputPath(`${tool.slug}.txt`);
    fs.writeFileSync(file, text);
    const out = execFileSync(process.execPath, ["tools/reading-level.mjs", "--file", file], { cwd: "..", encoding: "utf8" });
    const g = Number(out.match(/grade (-?[\d.]+)/)![1]);
    expect(g, `${tool.slug}: grade ${g}`).toBeLessThanOrEqual(10);
  }
});

test("a tool that doesn't exist says so and leads back to the list", async ({ page }) => {
  await page.goto("/tools/not-a-tool");
  await expect(page.getByTestId("tool-missing")).toContainText("That mini tool isn't here");
  await page.getByRole("link", { name: "See all mini tools" }).click();
  await expect(page.getByTestId("tools-index")).toBeVisible();
});

test("phone width: no sideways scroll on the tools, and the answer stays in sight while you type @mobile", async ({ page }) => {
  for (const url of ["/tools", ...tools.map((t) => `/tools/${t.slug}`), "/mini-tools/discount-calculator/embed.html"]) {
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, url).toBeLessThanOrEqual(0);
  }
  await page.goto("/tools/discount-calculator");
  await expect(page.getByTestId("answer-peek")).toContainText("At 20% off you keep $24.00");
  await fill(page, "discount", "10");
  await expect(page.getByTestId("answer-peek")).toContainText("At 10% off you keep $30.00");
  await page.getByTestId("answer").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("answer-peek")).toHaveCount(0);
});
