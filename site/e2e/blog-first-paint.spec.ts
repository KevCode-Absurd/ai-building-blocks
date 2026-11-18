import { test, expect } from "@playwright/test";

// These guarantees concern the built HTML, not Vite's development shell.
test.skip(!process.env.PW_EXTERNAL_SERVER, "Requires the built production preview");

for (const mobile of [false, true]) {
  for (const path of ["/blog", "/blog/landing-page-checklist"]) {
    test(`${mobile ? "@mobile " : ""}${path} shows its real opening while shared CSS is delayed`, async ({ page }, testInfo) => {
      let releaseCss!: () => void;
      const cssReady = new Promise<void>(resolve => { releaseCss = resolve; });
      await page.route(/\/assets\/main-[\w-]+\.css$/, async route => {
        await cssReady;
        await route.continue();
      });
      try {
        await page.goto(path, { waitUntil: "domcontentloaded" });
        const opening = page.locator("#app-loader .page-shell");
        const title = opening.locator(".page-shell-h1");
        await expect(title).toBeVisible();
        await expect(opening.locator("p.lede")).toBeVisible();
        const text = (await title.innerText()).trim();
        expect(text.length).toBeGreaterThan(8);
        const font = await title.evaluate(element => {
          const style = getComputedStyle(element);
          return { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight };
        });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        await page.screenshot({ path: testInfo.outputPath("opening.png") });
        releaseCss();
        const completeTitle = page.getByTestId("blog-page").getByRole("heading", { level: 1 });
        await expect(completeTitle).toBeVisible();
        await expect(completeTitle).toHaveText(text);
        await expect(page.locator("html")).toHaveAttribute("data-boot", "ready");
        await expect(opening).not.toBeVisible();
        const completeFont = await completeTitle.evaluate(element => {
          const style = getComputedStyle(element);
          return { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight };
        });
        // The existing loader aliases the same font file to control first-paint
        // font display. Verify that alias, rather than requiring identical names.
        expect(completeFont).toEqual({ ...font, family: font.family.replace(/^"AI Blocks Shell",\s*/, "") });
        const sources = await page.evaluate(() => {
          const result: Record<string, string> = {};
          for (const sheet of Array.from(document.styleSheets)) {
            for (const rule of Array.from(sheet.cssRules)) {
              if (!(rule instanceof CSSFontFaceRule)) continue;
              const family = rule.style.fontFamily.replaceAll('"', "");
              if (family === "AI Blocks Shell" || family === "Space Grotesk") result[family] = rule.style.getPropertyValue("src");
            }
          }
          return result;
        });
        expect(sources["AI Blocks Shell"]).toContain("space-grotesk.woff2");
        expect(sources["Space Grotesk"]).toBe(sources["AI Blocks Shell"]);
        await page.screenshot({ path: testInfo.outputPath("complete.png") });
      } finally {
        releaseCss();
      }
    });
  }
}

for (const path of ["/blog", "/blog/landing-page-checklist"]) {
  test(`${path} retains readable content without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto(`${process.env.PW_BASE_URL || "http://127.0.0.1:5191"}${path}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect((await page.locator("main").innerText()).trim().length).toBeGreaterThan(500);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    } finally {
      await context.close();
    }
  });
}
