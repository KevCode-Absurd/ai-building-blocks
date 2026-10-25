import { test, expect } from '@playwright/test';

test('minds can be found by a practical task and still seated on a council', async ({ page }) => {
  await page.goto('/minds');
  const cards = page.getByTestId('mind-card');
  await expect(cards).toHaveCount(505);
  const search = page.getByRole('searchbox', { name: 'Search minds' });
  await search.fill('cooking');
  await expect.poll(() => cards.count()).toBeGreaterThan(0);
  await expect.poll(() => cards.count()).toBeLessThan(505);
  await expect(cards.first().locator('.mind-use')).toContainText('Try:');
  await cards.first().getByTestId('seat-mind').click();
  await expect(page.getByTestId('open-council')).toBeEnabled();
  await search.fill('zzzz-no-such-task');
  await expect(cards).toHaveCount(0);
  await expect(page.getByText('No minds match this search.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search and filters' }).click();
  await expect(cards).toHaveCount(505);
  await search.fill('Jacques Pepin');
  await expect(cards).toHaveCount(1);
  await expect(cards).toContainText(/Jacques P[eé]pin/);
  await cards.getByRole('link', { name: /Jacques/ }).click();
  await expect(page).toHaveURL(/\/minds\/jacques-pepin$/);
});

test('portraits finish one blink and stay still after hover, filtering and navigation', async ({ page }) => {
  await page.goto('/minds');
  const eyes = page.locator('[data-slug="jeff-bezos"] .pface-eyes');
  await eyes.scrollIntoViewIfNeeded();
  await expect(eyes).toHaveCSS('animation-iteration-count', '1');
  // Offscreen cards use content-visibility, so observe the visible portrait only.
  await expect.poll(() => eyes.evaluate(element => element.getAnimations().length)).toBe(0);
  await expect(eyes).toHaveCSS('transform', 'none');
  await page.locator('[data-slug="jeff-bezos"]').hover();
  expect(await eyes.evaluate(element => element.getAnimations().length)).toBe(0);
  const search = page.getByRole('searchbox', { name: 'Search minds' });
  await search.fill('Shakespeare');
  await search.fill('Bezos');
  await expect(eyes).toHaveCSS('animation-name', 'none');
  await page.locator('[data-slug="jeff-bezos"] .mind-profile-link').click();
  await expect(page).toHaveURL(/\/minds\/jeff-bezos$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/minds$/);
  await expect(eyes).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.face-wall > span').first()).toHaveCSS('animation-name', 'none');
});

test('reduced-motion portraits are static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/minds');
  await expect(page.locator('.pface-eyes').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.face-wall > span').first()).toHaveCSS('animation-name', 'none');
});

test('everyday task search fits a phone @mobile', async ({ page }) => {
  await page.goto('/minds');
  const search = page.getByRole('searchbox', { name: 'Search minds' });
  await search.fill('Julia Child');
  await expect(page.getByTestId('mind-card')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByTestId('mind-card').getByTestId('seat-mind').click();
  await expect(page.getByTestId('open-council')).toBeVisible();
});
