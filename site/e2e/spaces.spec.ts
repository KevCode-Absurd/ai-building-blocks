import { expect, test, type Page } from "@playwright/test";
import { zipSync, strToU8 } from "fflate";

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

const skill = (name: string, line: string) => `---\nname: ${name}\ndescription: ${line}\n---\n# ${name.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())}\n\nThis skill ${line.toLowerCase()}\n`;

async function makeSpace(page: Page, name: string) {
  await page.goto("/space");
  await page.getByTestId("space-name").fill(name);
  await page.getByTestId("make-space-go").click();
  await expect(page.getByTestId("share-box")).toBeVisible();
}

test("the header leads to My space, and a space is made in one click", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("nav-space").click();
  await expect(page.getByTestId("space-page")).toContainText("Keep your skills and workflows in one place");
  await page.getByTestId("space-name").fill("Sam's team");
  await page.getByTestId("make-space-go").click();
  await expect(page.getByTestId("space-title")).toHaveValue("Sam's team");
  await expect(page.getByTestId("share-link")).toHaveValue(/\/s\/[A-Za-z0-9_-]{30,}$/);
  // The key stays in this browser: a reload opens the same space.
  await page.reload();
  await expect(page.getByTestId("space-title")).toHaveValue("Sam's team");
});

test("you add your own skills by pasting, by file and from a zip, and an agent", async ({ page }) => {
  await makeSpace(page, "Upload test");
  await page.getByTestId("add-title").fill("Refund reply writer");
  await page.getByTestId("add-body").fill(skill("refund-reply-writer", "Writes a kind refund reply."));
  await page.getByTestId("add-save").click();
  await expect(page.getByTestId("space-item").filter({ hasText: "Refund reply writer" })).toBeVisible();
  await page.getByTestId("add-file").setInputFiles({ name: "SKILL.md", mimeType: "text/markdown", buffer: Buffer.from(skill("welcome-email-writer", "Writes the first email a new buyer gets.")) });
  await expect(page.getByTestId("space-item").filter({ hasText: "Welcome email writer" })).toContainText("Writes the first email a new buyer gets.");
  const zip = zipSync({
    "skills/a-skill/SKILL.md": strToU8(skill("price-page-checker", "Checks a price page.")),
    "skills/b-skill/SKILL.md": strToU8(skill("faq-writer", "Writes the FAQ.")),
    "skills/b-skill/references/notes.md": strToU8("notes"),
  });
  await page.getByTestId("add-file").setInputFiles({ name: "skills.zip", mimeType: "application/zip", buffer: Buffer.from(zip) });
  await expect(page.getByTestId("space-item").filter({ hasText: "Price page checker" })).toBeVisible();
  await expect(page.getByTestId("space-item").filter({ hasText: "Faq writer" })).toBeVisible();
  await page.getByTestId("add-kind").selectOption("agent");
  await page.getByTestId("add-title").fill("Support inbox agent");
  await page.getByTestId("add-body").fill("You answer support emails using our refund rules.");
  await page.getByTestId("add-save").click();
  await expect(page.locator("[data-testid=space-item][data-kind=agent]")).toContainText("Support inbox agent");
  await expect(page.getByTestId("space-item")).toHaveCount(5);
  // Open shows the file; delete asks first.
  const one = page.getByTestId("space-item").filter({ hasText: "Refund reply writer" });
  await one.getByTestId("item-open").click();
  await expect(one).toContainText("This skill writes a kind refund reply.");
  page.once("dialog", (d) => d.accept());
  await one.getByTestId("item-delete").click();
  await expect(page.getByTestId("space-item")).toHaveCount(4);
});

test("the share link shows the space to a teammate, read only, and a new link turns the old one off", async ({ page, browser }) => {
  await makeSpace(page, "Kev's shop");
  await page.getByTestId("add-title").fill("Our refund rules");
  await page.getByTestId("add-body").fill("Refunds within 30 days, no questions.");
  await page.getByTestId("add-save").click();
  await expect(page.getByTestId("space-item")).toHaveCount(1);
  const link = await page.getByTestId("share-link").inputValue();
  const mate = await (await browser.newContext()).newPage();
  await mate.goto(link);
  await expect(mate.getByTestId("shared-space")).toContainText("Kev's shop");
  await expect(mate.getByTestId("space-item")).toContainText("Our refund rules");
  await expect(mate.getByTestId("item-delete")).toHaveCount(0);
  await expect(mate.getByTestId("vis-public")).toHaveCount(0);
  // The teammate makes a space and saves a copy into it.
  await makeSpace(mate, "Mate's space");
  await mate.goto(link);
  await mate.getByTestId("item-save").click();
  await expect(mate.locator(".toast")).toContainText("Saved a copy");
  await mate.goto("/space");
  await expect(mate.getByTestId("space-item")).toContainText("Our refund rules");
  // A new link: the old one stops working.
  page.once("dialog", (d) => d.accept());
  await page.getByTestId("share-new").click();
  await expect(page.getByTestId("share-link")).not.toHaveValue(link);
  await mate.goto(link);
  await expect(mate.getByTestId("shared-space")).toContainText("This link doesn't open a space");
});

test("a public item shows on From people, and a private one never does", async ({ page }) => {
  const stamp = Date.now();
  await makeSpace(page, `Public test ${stamp}`);
  for (const t of [`Shown ${stamp}`, `Hidden ${stamp}`]) {
    await page.getByTestId("add-title").fill(t);
    await page.getByTestId("add-body").fill(`The ${t} prompt.`);
    await page.getByTestId("add-save").click();
    await expect(page.getByTestId("space-item").filter({ hasText: t })).toBeVisible();
  }
  const shown = page.getByTestId("space-item").filter({ hasText: `Shown ${stamp}` });
  await shown.getByTestId("vis-public").click();
  await expect(shown.getByTestId("vis-public")).toHaveAttribute("aria-pressed", "true");
  await page.goto("/people");
  const card = page.getByTestId("public-item").filter({ hasText: `Shown ${stamp}` });
  await expect(card).toContainText(`from Public test ${stamp}`);
  await expect(page.getByTestId("people-page")).not.toContainText(`Hidden ${stamp}`);
  await expect(page.getByTestId("people-page")).toContainText("aren't checked or tested by us");
  await card.getByTestId("public-open").click();
  const opened = page.getByTestId("space-item").filter({ hasText: `Shown ${stamp}` });
  await opened.getByTestId("item-open").click();
  await expect(opened).toContainText(`The Shown ${stamp} prompt.`);
});

test("kits from this browser and workflows from the builder go into the space and open again in the builder", async ({ page }) => {
  // A kit saved only in this browser.
  await page.addInitScript(() => {
    if (!localStorage.getItem("abb:v1")) localStorage.setItem("abb:v1", JSON.stringify({ kits: [{ id: "k1", name: "Launch kit", slugs: ["meta-ads-compliance-checker", "website-brand-brain-builder"], updated: 1 }], flows: [], recent: [], currentFlow: null, draft: null }));
  });
  await makeSpace(page, "Builder test");
  await expect(page.getByTestId("bring-in")).toContainText("1 kit");
  await page.getByTestId("bring-in-go").click();
  const kit = page.locator("[data-testid=space-item][data-kind=kit]");
  await expect(kit).toContainText("Launch kit");
  await expect(kit).toContainText("Meta ads compliance checker");
  await expect(page.getByTestId("bring-in")).toHaveCount(0);
  // Open it in the builder, then save it from there as a workflow.
  await kit.getByTestId("item-builder").click();
  await expect(page).toHaveURL(/\?flow=/);
  await expect(page.getByTestId("download-handoff")).toBeEnabled();
  if (await page.getByTestId("bar-more").isVisible()) await page.getByTestId("bar-more").click(); // folded on a narrow canvas
  await page.getByTestId("flow-to-space").click();
  await expect(page.locator(".toast")).toContainText("to your space");
  await page.goto("/space");
  await expect(page.locator("[data-testid=space-item][data-kind=workflow]")).toContainText("Launch kit");
});

test("every skill says what to have first, links the steps before it, and offers what to do next", async ({ page }) => {
  await page.goto("/prompts/fact-based-ad-copy-writer");
  const before = page.locator("#before");
  await expect(before).toContainText("Recommended steps before this one");
  await expect(before).toContainText("It runs on its own");
  await expect(before.getByTestId("chain").getByRole("link", { name: "Website brand brain builder" })).toHaveAttribute("href", "/skills/website-brand-brain-builder");
  await expect(before.getByTestId("brain-files")).toContainText("proof-and-claims.md");
  const next = page.getByTestId("next");
  await expect(next).toContainText("Check it before it goes live");
  await next.getByRole("link", { name: /Meta ads compliance checker/ }).click();
  await expect(page).toHaveURL(/\/skills\/meta-ads-compliance-checker$/);
  // The skill file itself carries the same, with full links, and asks what's next at the end.
  const file = await (await page.request.get("/skills/fact-based-ad-copy-writer/SKILL.md")).text();
  expect(file).toContain("## Before you start");
  expect(file).toContain("https://useaiblocks.com/skills/website-brand-brain-builder");
  expect(file).toContain("**Look first.**");
  expect(file).toContain("shall I go ahead with what you've given me?");
  expect(file).toContain("This skill runs on its own");
  expect(file).toContain("## After this");
  expect(file).toContain("suggest what they could do next");
});

test("@mobile My space fits a phone: no sideways scroll", async ({ page }) => {
  await makeSpace(page, "Phone");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "no sideways scroll").toBe(true);
});
