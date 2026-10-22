import { test, expect } from './fixtures/staging-aware-test';
import fs from 'node:fs';
import { unzipSync, strFromU8 } from 'fflate';

test('only the four audience starters are offered, shareable and can return to the full library', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('block-card')).toHaveCount(16);
  await page.getByTestId('filter-audience').click();
  await expect(page.getByRole('option').locator('.sel-name')).toHaveText(['Full library', 'Students', 'Professionals', 'Startups', 'Enterprise']);
  await page.keyboard.press('Escape');
  for (const [id, label] of [['students', 'Students'], ['professionals', 'Professionals'], ['startups', 'Startups'], ['enterprise', 'Enterprise']]) {
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
  await page.getByTestId('install-code').click();
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

test('old audience and task links migrate to the current audience and survive refresh', async ({ page }) => {
  for (const [old, id, label] of [['workers', 'professionals', 'Professionals'], ['small-businesses', 'startups', 'Startups'], ['presentations', 'professionals', 'Professionals'], ['case-competitions', 'students', 'Students'], ['research-documents', 'students', 'Students'], ['equity-research', 'professionals', 'Professionals']]) {
    await page.goto(`/?audience=${old}#library`);
    await expect(page).toHaveURL(new RegExp(`audience=${id}`));
    await expect(page.getByTestId('filter-audience')).toContainText(label);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
    await page.reload();
    await expect(page.getByTestId('filter-audience')).toContainText(label);
  }
});

test('@mobile audience starters and intake template work at phone width', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const id of ['students', 'professionals', 'startups', 'enterprise']) {
    await page.goto(`/?audience=${id}#library`);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.getByTestId('filter-audience').click();
    await expect(page.getByRole('listbox', { name: 'Start with' })).toBeVisible();
    await expect(page.getByRole('option').locator('.sel-name')).toHaveText(['Full library', 'Students', 'Professionals', 'Startups', 'Enterprise']);
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
