import { test, expect } from '@playwright/test';
import { mockComposerAccount } from './fixtures/composer-account';

test('the expanded council receives another device’s choices without echo saves', async ({ page }) => {
  let revision = 1, puts = 0;
  let data: Record<string, string> = { 'aib-council-draft': JSON.stringify(['jeff-bezos']) };
  await page.clock.install();
  await page.addInitScript(() => Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' }));
  await mockComposerAccount(page, true, 'alice', 'alice');
  await page.route('**/api/library', async route => {
    if (route.request().method() === 'PUT') {
      puts++;
      const input = route.request().postDataJSON();
      if (input.revision !== revision) return route.fulfill({ status: 409, json: { error: 'Another device saved' } });
      data = input.data; revision++;
    }
    return route.fulfill({ json: { data, revision } });
  });
  await page.goto('/minds');
  await expect(page.getByTestId('mind-card')).toHaveCount(505);
  await expect(page.locator('.council-names')).toContainText('Jeff Bezos');
  await page.getByRole('searchbox', { name: 'Search minds' }).fill('Julia Child');
  await page.getByTestId('seat-mind').click();
  await page.clock.runFor(1500);
  await expect.poll(() => JSON.parse(data['aib-council-draft'])).toEqual(['jeff-bezos', 'julia-child']);
  data = { ...data, 'aib-council-draft': JSON.stringify(['julia-child', 'nancy-duarte']) }; revision++;
  const before = puts;
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('.council-names')).toContainText('Nancy Duarte');
  await expect(page.locator('.council-names')).toContainText('Julia Child');
  await expect(page.locator('.council-names')).not.toContainText('Jeff Bezos');
  await page.getByRole('searchbox', { name: 'Search minds' }).fill('Nancy Duarte');
  await expect(page.getByTestId('seat-mind')).toHaveAttribute('aria-pressed', 'true');
  await page.clock.runFor(30000);
  expect(puts).toBe(before);
  expect(JSON.parse(data['aib-council-draft'])).toEqual(['julia-child', 'nancy-duarte']);
});
