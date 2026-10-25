import { test, expect } from "@playwright/test";

for (const tag of ["", "@mobile "]) {
  test(tag + "full-screen workflow keeps the whole workspace usable when changing views and customization", async ({ page }) => {
    await page.route("**/api/auth*", route => route.fulfill({ json: { configured: false } }));
    await page.route("**/api/comments*", route => route.fulfill({ json: { enabled: false, comments: [] } }));
    await page.route("**/api/compose*", route => route.fulfill({ json: { enabled: false, models: [] } }));
    await page.goto("/workflows/ad-ab-test");
    await page.locator("#app-loader").waitFor({ state: "hidden" });
    const reject = page.getByRole("button", { name: /Reject.*cookies|Reject optional/i });
    if (await reject.isVisible()) await reject.click();
    await page.getByTestId("view-in-builder").click();
    const builder = page.getByTestId("builder"), stage = builder.locator(":scope > .stage");
    await page.getByTestId("workflow-diagram-view").click();
    await page.getByTestId("view-full-screen").click();
    await expect(builder).toHaveClass(/\bfull\b/);
    await expect(page.getByTestId("workflow-customize")).toHaveAttribute("aria-expanded", "true");
    const desktop = (page.viewportSize()?.width ?? 0) > 860;
    const checkWorkspace = async () => {
      const bounds = await builder.boundingBox(), work = await stage.boundingBox();
      expect(bounds!.height).toBeCloseTo(page.viewportSize()!.height, 0);
      expect(work!.y + work!.height).toBeCloseTo(bounds!.height, 0);
      if (desktop) expect(work!.height).toBeCloseTo(bounds!.height, 0);
      else expect((await builder.locator(":scope > .chain-palette").boundingBox())!.height).toBeLessThanOrEqual(bounds!.height * .26);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    };
    await checkWorkspace();
    await page.getByTestId("workflow-list-view").click();
    await expect(page.getByTestId("workflow-list-view")).toHaveAttribute("aria-pressed", "true");
    await checkWorkspace();
    // There is one scrolling workspace rather than a small nested list above a blank grid row.
    expect(await builder.locator(".stage-list").evaluate(el => el.clientHeight >= el.scrollHeight - 1)).toBe(true);
    await page.getByTestId("list-end").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("list-end")).toBeInViewport();
    await page.getByTestId("copy-execution-prompt").scrollIntoViewIfNeeded();
    await page.getByTestId("copy-execution-prompt").click({ trial: true });
    await page.getByTestId("download-handoff").click({ trial: true });
    await page.getByTestId("workflow-customize").click();
    await expect(builder.locator(":scope > .chain-palette")).toHaveCount(0);
    expect((await stage.boundingBox())!.height).toBeCloseTo(page.viewportSize()!.height, 0);
    await page.getByTestId("workflow-customize").click();
    await checkWorkspace();
    // The open palette itself scrolls, so its later suggestions and workflows remain reachable.
    await builder.locator(".chain-templates > summary").scrollIntoViewIfNeeded();
    await builder.locator(".chain-templates > summary").click({ trial: true });
    await page.getByTestId("workflow-diagram-view").click();
    await expect(page.getByTestId("workflow-diagram-view")).toHaveAttribute("aria-pressed", "true");
    await checkWorkspace();
    await builder.locator(".react-flow").scrollIntoViewIfNeeded();
    await expect(builder.locator(".react-flow")).toBeInViewport();
    const point = await builder.locator(".react-flow__pane").evaluate(el => {
      const r = el.getBoundingClientRect();
      for (let y = Math.max(r.top, 0) + 25; y < Math.min(r.bottom, innerHeight) - 60; y += 35)
        for (let x = r.left + 25; x < r.right - 60; x += 35)
          if (document.elementFromPoint(x, y) === el && document.elementFromPoint(x + 35, y + 35) === el) return { x, y };
      return null;
    });
    expect(point).not.toBeNull();
    const canvas = builder.locator(".react-flow__viewport"), before = await canvas.getAttribute("style");
    await page.keyboard.down("Space"); await page.mouse.move(point!.x, point!.y); await page.mouse.down();
    await page.mouse.move(point!.x + 35, point!.y + 35, { steps: 8 }); await page.mouse.up();
    await page.keyboard.up("Space");
    await expect.poll(() => canvas.getAttribute("style")).not.toBe(before);
    await page.getByTestId("view-exit-full-screen").click();
    await expect(builder).not.toHaveClass(/\bfull\b/);
  });
}
