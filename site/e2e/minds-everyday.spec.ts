import { test, expect } from '@playwright/test';

test('browse starts with search and focused roles while tools stay in links', async ({ page }) => {
  await page.goto('/minds');
  await expect(page.getByRole('heading', { name: 'Borrow a great mind' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search minds' })).toBeVisible();
  await expect(page.getByTestId('label-filter').getByRole('button')).toHaveCount(11);
  await expect(page.getByTestId('mind-needs')).toHaveCount(0);
  await expect(page.getByTestId('council-guide')).toHaveCount(0);
  await expect(page.getByTestId('my-minds')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Minds');
  await expect(page.getByTestId('council-bar')).toHaveCount(0);
  await page.getByTestId('minds-label-founder').click();
  await page.getByRole('searchbox', { name: 'Search minds' }).fill('Steve Jobs');
  await expect(page.getByTestId('mind-card')).toHaveCount(1);
  await expect(page.getByTestId('seat-mind').locator('.mind-seat-plus')).toHaveText('+');
  await page.getByTestId('seat-mind').click();
  await expect(page.getByTestId('open-council')).toBeEnabled();
  await page.getByRole('navigation', { name: 'Mind tools' }).getByRole('link', { name: 'All minds', exact: true }).click();
  await expect(page.getByTestId('mind-card')).toHaveCount(505);
});

test('My minds has a separate view with creation and import available', async ({ page }) => {
  await page.goto('/minds');
  await page.getByRole('navigation', { name: 'Mind tools' }).getByRole('link', { name: 'My minds' }).click();
  await expect(page.getByTestId('my-minds-page')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create a mind', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Import mind or writing sample' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Create a mind', exact: true })).toBeVisible();
});

test('search and role filters fit a phone @mobile', async ({ page }) => {
  await page.goto('/minds');
  await page.getByRole('searchbox', { name: 'Search minds' }).fill('Julia Child');
  await expect(page.getByTestId('mind-card')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
