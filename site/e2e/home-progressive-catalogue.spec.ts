import { test, expect } from "@playwright/test";

for (const tag of ["", "@mobile "]) test(`${tag}home paints starter picks before requesting the full catalogue`, async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  let fullCatalogueRequested = false;
  await page.route("**/data/blocks.json", async route => {
    fullCatalogueRequested = true;
    await route.continue();
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
  await expect(page.locator("#library [data-testid=block-card]")).toHaveCount(4);
  expect(fullCatalogueRequested).toBe(false);
  await expect(page.getByText("Showing starter picks while the full library opens.")).toBeVisible();

  await page.getByRole("link", { name: /Start with a task/ }).click();
  await expect(page).toHaveURL(/#library$/);
  await expect.poll(() => fullCatalogueRequested).toBe(true);
  await expect(page.locator("#library [data-testid=block-card]")).toHaveCount(16);
  await expect(page.getByTestId("library-search")).toBeFocused();
});

for (const tag of ["", "@mobile "]) test(`${tag}home stays usable if the deferred globe fails`, async ({ page }) => {
  await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
  let globeFailed = false;
  const failGlobe = async (route: import("@playwright/test").Route) => { globeFailed = true; await route.abort(); };
  await page.route("**/src/Globe.tsx*", failGlobe);
  await page.route("**/assets/Globe-*.js", failGlobe);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const heading = page.getByRole("heading", { name: "Use AI like the top 1%" });
  await expect(heading).toBeVisible();
  await expect.poll(() => globeFailed, { timeout: 5_000 }).toBe(true);
  await expect(heading).toBeVisible();
  await expect(page.getByText("This page couldn’t open.")).toHaveCount(0);
});
