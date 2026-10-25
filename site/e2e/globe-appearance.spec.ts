import { expect, test } from "@playwright/test";

const globeChunk = (url: URL) =>
  /\/src\/Globe\.tsx$/.test(url.pathname) || /\/assets\/Globe-[^/]+\.js$/.test(url.pathname);

for (const { tag, minimumDraws } of [
  { tag: "", minimumDraws: 1200 },
  { tag: "@mobile ", minimumDraws: 400 },
]) {
  test(`${tag}home keeps the binary world deferred, then paints a dense globe`, async ({ page }) => {
    await page.addInitScript(() => {
      const original = CanvasRenderingContext2D.prototype.drawImage;
      (window as Window & { __globeDraws: number }).__globeDraws = 0;
      CanvasRenderingContext2D.prototype.drawImage = function (...args: any[]) {
        if (this.canvas.dataset.testid === "globe") {
          (window as Window & { __globeDraws: number }).__globeDraws++;
        }
        return original.apply(this, args as Parameters<typeof original>);
      };
    });
    await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));

    let fullCatalogueRequested = false;
    await page.route("**/data/blocks.json", async route => {
      fullCatalogueRequested = true;
      await route.continue();
    });
    let releaseGlobe!: () => void;
    const globeGate = new Promise<void>(resolve => { releaseGlobe = resolve; });
    let notifyGlobeRequest!: () => void;
    const globeRequest = new Promise<void>(resolve => { notifyGlobeRequest = resolve; });
    await page.route(globeChunk, async route => {
      notifyGlobeRequest();
      await globeGate;
      await route.continue();
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
    await expect(page.getByText("Showing starter picks while the full library opens.")).toBeVisible();
    await expect(page.locator("#library [data-testid=block-card]")).toHaveCount(4);
    await expect(page.locator("#app-loader")).toHaveCount(0);
    expect(fullCatalogueRequested).toBe(false);
    await expect(page.getByTestId("globe")).toHaveCount(0);

    await globeRequest;
    await expect(page.getByRole("heading", { name: "Use AI like the top 1%" })).toBeVisible();
    await expect(page.locator("#library [data-testid=block-card]")).toHaveCount(4);
    expect(fullCatalogueRequested).toBe(false);
    await expect(page.getByTestId("globe")).toHaveCount(0);

    releaseGlobe();
    const globe = page.getByTestId("globe");
    await expect(globe).toBeVisible();
    const draws = await page.evaluate(() => (window as Window & { __globeDraws: number }).__globeDraws);
    expect(draws, "the globe should show a dense, connected land mask instead of a sparse dot sphere").toBeGreaterThan(minimumDraws);
    const box = await globe.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });
}
