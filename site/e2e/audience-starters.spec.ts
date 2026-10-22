import { test, expect } from './fixtures/staging-aware-test';
import fs from 'node:fs';
import { unzipSync, strFromU8 } from 'fflate';

test('all five audience starters are reachable, shareable and can return to the full library', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('block-card')).toHaveCount(16);
  for (const [id, label] of [['students', 'Students'], ['workers', 'Workers'], ['small-businesses', 'Small businesses'], ['enterprise', 'Enterprise teams'], ['startups', 'Startups']]) {
    await page.getByTestId('filter-audience').click();
    await page.getByRole('option', { name: label, exact: true }).click();
    await expect(page.getByTestId('block-card')).toHaveCount(8);
    await expect(page).toHaveURL(new RegExp(`audience=${id}`));
    await expect(page.getByTestId('audience-guide')).toContainText('Bring:');
    await page.reload();
    await expect(page.getByTestId('filter-audience')).toContainText(label);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
  }
  await page.getByRole('button', { name: 'Clear all', exact: true }).click();
  await expect(page.getByTestId('block-card')).toHaveCount(16);
  await expect(page).not.toHaveURL(/audience=/);
});

test('student context reaches a complete imported download with its license', async ({ page }, info) => {
  await page.goto('/?audience=students#library');
  await page.getByTestId('audience-guide').getByRole('button', { name: 'Save your context' }).click();
  await page.getByTestId('biz-sells').fill('I am studying computer science with an exam on 23 October.');
  await page.getByTestId('biz-more').fill('Use my course notes. Ask practice questions before revealing answers.');
  await page.getByTestId('biz-save').click();
  await page.locator('[data-slug="study-understanding-check"]').click();
  await page.getByTestId('install-claude').click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('install-zip').click()]);
  const file = info.outputPath(download.suggestedFilename());
  await download.saveAs(file);
  const pack = unzipSync(fs.readFileSync(file));
  const prefix = 'study-understanding-check/';
  const skill = strFromU8(pack[`${prefix}SKILL.md`]);
  expect(skill).toContain('I am studying computer science');
  expect(skill).toContain('Ask practice questions before revealing answers');
  expect(pack[`${prefix}LICENSE`]).toBeTruthy();
});

test('requested presentation, case, research and valuation starting points open the right skills', async ({ page }) => {
  for (const [id, slug] of [['presentations', 'storyboard-to-powerpoint-deck-builder'], ['case-competitions', 'case-competition-slide-deck-builder'], ['research-documents', 'research-paper-writer'], ['equity-research', 'equity-research-valuation-report-builder']]) {
    await page.goto(`/?audience=${id}#library`);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
    await page.locator(`[data-slug="${slug}"]`).click();
    await expect(page.getByTestId('block-page')).toBeVisible();
    if (id === 'equity-research') await expect(page.locator('.bp-sub')).toContainText('English adapter');
    if (id === 'case-competitions') await expect(page.locator('.bp-sub')).toContainText('editable charts');
  }
});

test('@mobile audience starters and intake template work at phone width', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const id of ['students', 'workers', 'small-businesses', 'enterprise', 'startups', 'presentations', 'case-competitions', 'research-documents', 'equity-research']) {
    await page.goto(`/?audience=${id}#library`);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.getByTestId('filter-audience').click();
    await expect(page.getByRole('listbox', { name: 'Start with' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.keyboard.press('Escape');
  }
  await page.goto('/?audience=enterprise#library');
  await expect(page.getByTestId('audience-guide')).toContainText('need your own implementation');
  await expect(page.getByTestId('block-card')).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: 'Download a context template', exact: true }).click()]);
  const file = info.outputPath(download.suggestedFilename());
  await download.saveAs(file);
  expect(fs.readFileSync(file, 'utf8')).toContain('Source date and version');
  await page.screenshot({ path: info.outputPath('enterprise-starter-mobile.png'), fullPage: false });
});
