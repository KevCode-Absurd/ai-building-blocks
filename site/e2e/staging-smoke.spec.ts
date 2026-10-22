import { test, expect } from './fixtures/staging-aware-test';

// This suite is selected only by the staging config and makes no API writes.
for (const width of [1440, 320]) test(`live staging navigation, assets and timings at ${width}px`, async ({ page }, info) => {
  test.skip(!process.env.CF_STAGING_URL, 'Selected for live staging verification.');
  test.setTimeout(120_000);
  await page.setViewportSize({ width, height: 900 });
  const errors: string[] = [], failedAssets: string[] = [], timings: unknown[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) failedAssets.push(`${response.status()} ${new URL(response.url()).pathname}`);
  });
  for (const path of ['/', '/compose', '/skills/website-brand-brain-builder', '/people', '/example-app/']) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await page.waitForLoadState('networkidle');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), path).toBeLessThanOrEqual(1);
    timings.push(await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        path: location.pathname,
        ttfbMs: Math.round(navigation.responseStart - navigation.requestStart),
        domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
        loadMs: Math.round(navigation.loadEventEnd),
        firstContentfulPaintMs: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
        transferBytes: navigation.transferSize,
      };
    }));
    if (path === '/') await page.screenshot({ path: info.outputPath(`staging-home-${width}.png`), fullPage: false });
  }
  await info.attach('observed-navigation-timings', {
    body: JSON.stringify({ width, scope: 'single client observations; no previous production baseline', timings }, null, 2),
    contentType: 'application/json',
  });
  expect(errors, 'no uncaught application errors').toEqual([]);
  expect(failedAssets, 'no failed HTTP responses on representative pages').toEqual([]);
});
