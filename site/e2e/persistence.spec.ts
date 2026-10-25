import { test, expect } from "@playwright/test";
import { mockComposerAccount } from "./fixtures/composer-account";
async function openKits(page: import("@playwright/test").Page) {
  const destination = await page.getByTestId("account-link").getAttribute("href");
  await page.getByTestId("account-link").click();
  if (destination === "/sign-up" || destination === "/sign-in") await page.getByRole("link", { name: "View this browser’s saved work →" }).click();
  await page.getByRole("button", { name: "Manage my kits →", exact: true }).click();
}
const kitData = (name: string) => JSON.stringify({ kits: [{ id: "kit-one", name, slugs: ["fact-based-ad-copy-writer"], updated: 1 }], flows: [], recent: [], currentFlow: null, draft: null });

test("guest kits survive reloads and explain their storage lifetime", async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  await page.goto("/");
  await expect(page.getByTestId("account-page")).toHaveCount(0);
  await openKits(page);
  await page.getByPlaceholder("Name a new kit").fill("Guest launch kit");
  await page.getByPlaceholder("Name a new kit").press("Enter");
  await expect(page.getByRole("textbox", { name: "Kit name", exact: true }).last()).toHaveValue("Guest launch kit");
  await page.reload(); await openKits(page);
  await expect(page.getByRole("textbox", { name: "Kit name", exact: true }).last()).toHaveValue("Guest launch kit");
});

test("signed-in kits save, restore on a fresh device and stay isolated during account switching", async ({ page, browser }) => {
  let data: Record<string, string> = {}, revision = 0;
  const attach = async (target: typeof page) => {
    await mockComposerAccount(target, true, "alice", "alice");
    await target.route("**/api/library", async route => {
      const user = route.request().headers().authorization;
      if (user !== "Bearer alice") return route.fulfill({ json: { data: {}, revision: 0 } });
      if (route.request().method() === "PUT") { const input = route.request().postDataJSON(); expect(input.revision).toBe(revision); data = input.data; revision++; }
      return route.fulfill({ json: { data, revision } });
    });
  };
  await attach(page);
  await page.addInitScript(value => { if (!localStorage.getItem("fixture:seed")) { localStorage.setItem("abb:v1", value); localStorage.setItem("fixture:seed", "yes"); } }, kitData("Guest original"));
  await page.goto("/account?view=settings");
  await page.getByRole("button", { name: "Import browser saves" }).click();
  await expect.poll(() => data["abb:v1"]).toBeTruthy();
  await openKits(page);
  const name = page.getByRole("textbox", { name: "Kit name", exact: true }).last();
  await expect(name).toHaveValue("Guest original"); await name.fill("Account launch kit");
  await expect.poll(() => JSON.parse(data["abb:v1"]).kits[0].name).toBe("Account launch kit");
  await expect(page.getByTestId("save-hint")).toContainText("Saved to your account");
  const fresh = await browser.newContext(), other = await fresh.newPage();
  await attach(other); await other.goto(new URL("/", page.url()).href); await openKits(other);
  await expect(other.getByRole("textbox", { name: "Kit name", exact: true }).last()).toHaveValue("Account launch kit");
  await fresh.close();
  await page.evaluate(() => (window as any).__switchMindAccount("bob"));
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-account", "bob");
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-save-status", "saved");
  await openKits(page); await expect(page.getByText("No kits yet", { exact: true })).toBeVisible();
  await page.evaluate(() => (window as any).__switchMindAccount(null));
  await expect(page.getByTestId("account-page")).toHaveAttribute("data-account", "guest");
  await openKits(page); await expect(page.getByRole("textbox", { name: "Kit name", exact: true }).last()).toHaveValue("Guest original");
});

test("workspace owners can set invited emails and company domain access", async ({ page }) => {
  await mockComposerAccount(page, true, "alice", "alice");
  await page.route("**/api/library", route => route.fulfill({ json: { data: {}, revision: 0 } }));
  let access = { mode: "invited", emails: [] as string[], domain: "" };
  await page.route("**/api/spaces/**", route => {
    expect(route.request().headers().authorization).toBe("Bearer alice");
    if (route.request().url().endsWith("/access")) { access = route.request().postDataJSON(); return route.fulfill({ json: { access } }); }
    return route.fulfill({ json: { space: { id: "s", name: "Company workspace" }, shareToken: "private-share", access, items: [] } });
  });
  await page.goto("/space");
  await page.getByRole("combobox", { name: "Who can open the share link?" }).selectOption("domain");
  await page.getByRole("textbox", { name: "Company email domain", exact: true }).fill("company.com");
  await page.getByRole("textbox", { name: "Invited email addresses, one per line" }).fill("guest@partner.com");
  await page.getByRole("button", { name: "Save access", exact: true }).click();
  await expect.poll(() => access).toEqual({ mode: "domain", emails: ["guest@partner.com"], domain: "company.com" });
  await expect(page.getByTestId("share-link")).toHaveValue(/\/s\/private-share$/);
});
