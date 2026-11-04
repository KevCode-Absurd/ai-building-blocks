import { test, expect } from '@playwright/test';

test('a stalled optional starter cannot block the full task library', async ({ page }) => {
  await page.route('**/api/auth*', route => route.fulfill({ json: { configured: false } }));
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/data/starter-blocks.json', async route => {
    await held;
    await route.continue().catch(() => {});
  });
  try {
    await page.goto('/#library', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('library-search')).toBeEnabled();
    await page.getByTestId('library-search').fill('rough notes');
    await expect(page.locator('#library a[data-slug="rough-notes-to-minutes-writer"]')).toBeVisible();
  } finally { release(); }
});

test('tool navigation switches between browser utilities and calculators with working inputs', async ({ page }) => {
  await page.route('**/api/auth*', route => route.fulfill({ json: { configured: false } }));
  await page.goto('/tools/word-counter');
  await page.getByTestId('browser-input').fill('A useful result');
  await expect(page.getByTestId('browser-output')).toContainText('3 words');
  await page.getByRole('link', { name: /All (mini )?tools/ }).first().click();
  // The tools page shows 24 at a time; search reaches the rest.
  await page.getByTestId('tools-search').fill('meeting cost');
  await page.locator('a[href="/tools/meeting-cost"]').first().click();
  await expect(page.getByTestId('tool-page')).toBeVisible();
  // Calculator pages lead back through the breadcrumb.
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Tools', exact: true }).click();
  await page.locator('a[href="/tools/json-formatter"]').first().click();
  await page.getByTestId('browser-input').fill('{"ready":true}');
  await expect(page.getByTestId('browser-output')).toContainText('"ready": true');
});

