import { test, expect } from './fixtures/staging-aware-test';
import fs from 'node:fs';
import { unzipSync, strFromU8 } from 'fflate';

// Each starter's goal line in the audience guide names which starter is active.
const GOALS: Record<string, string> = {
  'small-business': 'Win customers, answer reviews',
  students: 'Learn a topic, check your understanding',
  professionals: 'Prepare meetings, turn notes into actions',
  startups: 'Test an idea, plan runway',
  enterprise: 'Review policies, suppliers and processes',
};

test('the five audience starter links are shareable and can return to the full library', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('block-card')).toHaveCount(16);
  // The starter picker is no longer a home control; starters are reached by link.
  await expect(page.getByTestId('filter-audience')).toHaveCount(0);
  await expect(page.getByTestId('starter-small-business')).toHaveCount(0);
  for (const id of ['small-business', 'students', 'professionals', 'startups', 'enterprise']) {
    await page.goto(`/?audience=${id}#library`);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
    await expect(page).toHaveURL(new RegExp(`audience=${id}`));
    await expect(page.getByTestId('audience-guide')).toContainText('Bring:');
    await expect(page.getByTestId('audience-guide')).toContainText(GOALS[id]);
    await page.reload();
    await expect(page.getByTestId('audience-guide')).toContainText(GOALS[id]);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
  }
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(page.getByTestId('block-card')).toHaveCount(16);
  await expect(page).not.toHaveURL(/audience=/);
});

test('student context reaches a complete imported download with its license', async ({ page }, info) => {
  await page.goto('/?audience=students#library');
  await page.getByTestId('audience-guide').getByRole('button', { name: 'Add your me.md' }).click();
  await page.getByTestId('biz-sells').fill('I am studying computer science with an exam on 23 October.');
  await page.getByTestId('business-form').getByText('Add more detail (optional)').click();
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
  for (const [old, id] of [['workers', 'professionals'], ['small-businesses', 'small-business'], ['presentations', 'professionals'], ['case-competitions', 'students'], ['research-documents', 'students'], ['equity-research', 'professionals']]) {
    await page.goto(`/?audience=${old}#library`);
    await expect(page).toHaveURL(new RegExp(`audience=${id}`));
    await expect(page.getByTestId('audience-guide')).toContainText(GOALS[id]);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
    await page.reload();
    await expect(page).toHaveURL(new RegExp(`audience=${id}`));
    await expect(page.getByTestId('audience-guide')).toContainText(GOALS[id]);
  }
});

test('@mobile audience starters and intake template work at phone width', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const id of ['small-business', 'students', 'professionals', 'startups', 'enterprise']) {
    await page.goto(`/?audience=${id}#library`);
    await expect(page.getByTestId('block-card')).toHaveCount(8);
    await expect(page.getByTestId('audience-guide')).toContainText(GOALS[id]);
    await expect(page.getByTestId('filter-audience')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
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
