import { expect, test, stagingHeaders, type Page } from "./fixtures/staging-aware-test";

// These tests add three pretend imported skills to the library as it loads, so they work whatever has really been imported.
const url = (repo: string, name: string) => `https://github.com/${repo}/tree/main/skills/${name}`;
const FAKE = [
  { slug: "fake-anthropic-site-builder", name: "Website builder", task: "build-websites", source: { by: "Anthropic", repo: "anthropics/skills", url: url("anthropics/skills", "frontend-design"), licence: "Apache-2.0", original: "frontend-design", commit: "dbd4588" } },
  { slug: "fake-openai-sheet-maker", name: "Sheet maker", task: "work-with-files", source: { by: "OpenAI", repo: "openai/skills", url: url("openai/skills", "spreadsheet"), licence: "MIT" } },
  { slug: "fake-community-note-taker", name: "Meeting note taker", task: "organise-work", source: { by: "Some Person", repo: "someone/skills", url: url("someone/skills", "notes"), licence: "MIT" }, warnings: ["scrapes", "paid:Apify"] },
];

test.beforeEach(async ({ page }: { page: Page }) => {
  // Fake catalogue entries have no deployed HTML; load the actual app shell for
  // their document requests while keeping the requested fixture URL.
  await page.route('**/skills/fake-*', async route => {
    if (route.request().resourceType() !== 'document') return route.fallback();
    const home = new URL('/', route.request().url()).toString();
    const response = await route.fetch({ url: home, headers: stagingHeaders(home, route.request().headers()) });
    return route.fulfill({ response });
  });
  // Home lists cards from the small index; block pages read the full file. Patch both.
  await page.route("**/data/blocks{,-index}.json", async (route) => {
    const res = await route.fetch({ headers: stagingHeaders(route.request().url(), route.request().headers()) });
    const data = await res.json();
    const base = data.blocks.find((b: { origin: string; type: string }) => b.type === "skill" && b.origin !== "imported");
    for (const f of FAKE) {
      const b = { ...base, ...f, summary: `A pretend imported skill called ${f.name}.`, headline: "", origin: "imported", inputs: [], outputs: [], tested: undefined, twin: undefined, minds: [], usedIn: 0 };
      data.blocks.push(b);
      data.bySlug = undefined;
    }
    await route.fulfill({ response: res, json: data });
  });
  for (const f of FAKE) {
    await page.route(`**/skills/${f.slug}/SKILL.md`, (route) => route.fulfill({ contentType: "text/markdown", body: `---\nname: ${f.slug}\ndescription: pretend\n---\n\nDo the pretend job.\n` }));
    await page.route(`**/data/pages/${f.slug}.json`, (route) => route.fulfill({ status: 404, body: "" }));
  }
});

const card = (page: Page, slug: string) => page.locator(`[data-testid="block-card"][data-slug="${slug}"]`);

test("imported cards say who made them, and ours say nothing", async ({ page }) => {
  await page.goto("/#library");
  await page.getByTestId("library-search").fill("pretend imported");
  await expect(page.getByTestId("block-card")).toHaveCount(3);
  await expect(card(page, FAKE[0].slug).getByTestId("from-label")).toHaveText("From Anthropic");
  await expect(card(page, FAKE[1].slug).getByTestId("from-label")).toHaveText("From OpenAI");
  await expect(card(page, FAKE[2].slug).getByTestId("from-label")).toHaveText("From the community");
  await page.getByTestId("library-search").fill("Fact-based ad copy writer");
  await expect(page.getByTestId("block-card").first()).toBeVisible();
  await expect(page.getByTestId("block-card").first().getByTestId("from-label")).toHaveCount(0);
});

test("old maker links keep their search without silently hiding other makers", async ({ page }) => {
  await page.goto("/?q=pretend+imported&by=openai#library");
  await expect(page.getByTestId("block-card")).toHaveCount(3);
  await expect(page.getByTestId("filter-by")).toHaveCount(0);
  await expect(page).not.toHaveURL(/by=/);
});

test("work groups remain available as secondary filters and old job links still work", async ({ page }) => {
  await page.goto("/#library");
  await page.getByTestId("more-filters").click();
  await page.getByTestId("filter-work").click();
  for (const name of ["Build and code", "Work with files", "Connect your tools", "Run your work"]) {
    await expect(page.getByRole("option", { name: new RegExp(`^${name}`) })).toHaveCount(1);
  }
  await page.keyboard.press("Escape");
  await page.goto("/?q=pretend+imported&fn=developer&job=build-websites#library");
  await expect(card(page, FAKE[0].slug)).toBeVisible();
  await expect(page.getByTestId("filter-work")).toContainText("Build and code");
  await expect(page.getByTestId("filter-task")).toContainText("Build websites");
});

test("an imported skill's page credits the maker and still reads clean with no page file", async ({ page }) => {
  await page.goto(`/skills/${FAKE[0].slug}`);
  const credit = page.getByTestId("credit-line");
  await expect(credit).toContainText("Made by Anthropic. We copied it as it is, with its licence, and gave it a plain name.");
  await expect(credit.getByRole("link", { name: /See the original on GitHub/ })).toHaveAttribute("href", FAKE[0].source.url);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Website builder");
  await expect(page.getByTestId("composer")).toHaveCount(0);
  // No empty headings: every section that shows has something in it.
  await expect(page.getByRole("heading", { name: "What you give it, what you get" })).toHaveCount(0);
  await expect(page.getByText("Do the pretend job.")).toBeVisible();
  const empty = await page.locator(".bp-main section.bp-sec").evaluateAll((els) => els.filter((e) => e.textContent!.trim() === (e.querySelector("h2")?.textContent ?? "").trim()).length);
  expect(empty).toBe(0);
});

test("our own skills carry no credit line", async ({ page }) => {
  await page.goto("/skills/fact-based-ad-copy-writer");
  await expect(page.getByTestId("block-page")).toBeVisible();
  await expect(page.getByTestId("credit-line")).toHaveCount(0);
});

test("an imported skill links to its GitHub folder and shows its first name", async ({ page }) => {
  await page.goto(`/skills/${FAKE[0].slug}`);
  const pill = page.getByTestId("gh-pill");
  await expect(pill).toHaveAttribute("href", FAKE[0].source.url);
  await expect(pill).toContainText("anthropics/skills");
  await expect(pill).toContainText("Apache 2.0");
  await expect(page.locator(".gh-rename")).toContainText("frontend-design");
  await expect(page.locator(".gh-rename")).toContainText(FAKE[0].name);
  await expect(page.getByTestId("credit-line")).toContainText("dbd4588");
  if (process.env.SHOTS) for (const scheme of ["light", "dark"] as const) {
    await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, scheme);
    await page.locator(".bp-hero").screenshot({ path: `${process.env.SHOTS}/credit-${scheme}-${page.viewportSize()?.width}.png` });
  }
});

test("a skill that scrapes or needs a paid account says so on its card and its page", async ({ page }) => {
  await page.goto("/#library");
  await page.getByTestId("library-search").fill("pretend imported");
  await expect(card(page, FAKE[2].slug).getByTestId("scrapes-label")).toBeVisible();
  await expect(card(page, FAKE[2].slug).getByTestId("paid-label")).toHaveText("Needs a paid account");
  await expect(card(page, FAKE[0].slug).getByTestId("paid-label")).toHaveCount(0);
  await page.goto(`/skills/${FAKE[2].slug}`);
  await expect(page.getByTestId("scrapes-note")).toBeVisible();
  await expect(page.getByTestId("paid-note")).toContainText("paid Apify account");
});
