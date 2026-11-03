import { test, expect } from '@playwright/test';

// "Skip it when" names link to the item they name, and near-duplicates show "Similar items and how they differ",
// both in the static HTML (for crawlers) and on the hydrated page, with no sideways scroll on a phone.
test('skip-it-when names are links and similar items are compared, in static HTML and on a phone', async ({ page, request }) => {
  const route = '/skills/ad-sales-drop-analyst';
  const html = await (await request.get(route)).text();
  expect(html).toContain('<h3>Similar items and how they differ</h3>');
  expect(html).toContain('<a href="/skills/six-pattern-ad-performance-diagnoser">');
  expect(html).toContain('Start here');
  expect(html).toContain('<a href="/skills/ad-results-report-writer">');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(route);
  const similar = page.getByTestId('similar-items');
  await expect(similar).toBeVisible();
  await expect(similar.getByTestId('start-here')).toHaveCount(1);
  await expect(similar.getByRole('link', { name: 'Ad performance troubleshooter' })).toHaveAttribute('href', '/skills/ad-performance-diagnoser');
  const skip = page.getByTestId('is-it-for-you').getByTestId('skip-link').first();
  await expect(skip).toBeVisible();
  const target = await skip.getAttribute('href');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await skip.click();
  await expect(page).toHaveURL(new RegExp(`${target}$`));
});
