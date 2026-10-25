import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { mockComposerAccount } from './fixtures/composer-account';
const privateValue = 'PRIVATE-saving-test-token@example.test-skill-instructions';
const requestId = '8db61562-bcca-4ab1-a48f-3472d7b8ad33';
test('Settings exports safe failure and recovery history after automatic retry and reload', async ({ page }) => {
  await page.clock.install(); await mockComposerAccount(page, true, privateValue, privateValue);
  let data = { 'abb:v1': JSON.stringify({ kits: [{ id: 'private-kit', name: privateValue, slugs: [], updated: 1 }], flows: [], draft: null, currentFlow: null, recent: [] }) }, revision = 1, attempts = 0;
  await page.route('**/api/library', async route => {
    if (route.request().method() === 'PUT') {
      if (++attempts === 1) return route.fulfill({ status: 503, headers: { 'x-save-request-id': requestId, 'x-save-error-code': 'SQLITE_BUSY', 'x-save-error-stage': 'write', 'retry-after': '2' }, json: { error: privateValue } });
      const body = route.request().postDataJSON(); expect(body.revision).toBe(revision); data = body.data; revision++;
    }
    return route.fulfill({ json: { data, revision } });
  });
  await page.goto('/account'); await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status', 'saved');
  await page.getByRole('button', { name: 'Manage my kits →', exact: true }).click();
  await page.locator('input[aria-label="Kit name"]').fill(privateValue + ' changed'); await page.clock.runFor(750);
  await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status', 'error');
  await page.clock.runFor(3000); await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status', 'saved'); expect(revision).toBe(2);
  await page.goto('/account?view=settings');
  const downloaded = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download saving diagnostics', exact: true }).click();
  const download = await downloaded; expect(download.suggestedFilename()).toBe('ai-blocks-saving-diagnostics.json');
  const text = await fs.readFile((await download.path())!, 'utf8'); expect(text).not.toContain(privateValue);
  const report = JSON.parse(text); expect(report.events.some((event: any) => event.code === 'SQLITE_BUSY' && event.requestId === requestId && event.operation === 'PUT')).toBe(true);
  expect(report.events.at(-1).event).toBe('recovered'); expect(attempts).toBe(2);
});
test('diagnostic download removes injected text from previously stored entries and stays in Settings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockComposerAccount(page, false);
  await page.addInitScript(({ value }) => localStorage.setItem('abb:save-diagnostics/1', JSON.stringify([{ at: Date.now(), stage: value, code: value, userId: value, error: value, requestId: value, token: value }])), { value: privateValue });
  await page.goto('/account?view=settings'); const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download saving diagnostics', exact: true }).click();
  const text = await fs.readFile((await (await downloaded).path())!, 'utf8'); expect(text).not.toContain(privateValue); expect(JSON.parse(text).events[0].code).toBe('unknown');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/compose'); await expect(page.getByRole('button', { name: 'Download saving diagnostics', exact: true })).toHaveCount(0);
});
