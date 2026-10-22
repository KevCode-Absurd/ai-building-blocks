# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: audience-starters.spec.ts >> requested presentation, case, research and valuation starting points open the right skills
- Location: e2e\audience-starters.spec.ts:42:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.bp-sub')
Expected substring: "chart placeholders"
Received string:    "Share your case, judging rules and analysis. Get a recommendation deck with source notes, financials and backup slides for questions."
Timeout: 5000ms

Call log:
  - Expect "toContainText" locator('.bp-sub') with timeout 5000ms
  - waiting for locator('.bp-sub')
    14 × locator resolved to <p class="bp-sub">Share your case, judging rules and analysis. Get …</p>
       - unexpected value "Share your case, judging rules and analysis. Get a recommendation deck with source notes, financials and backup slides for questions."

```

```yaml
- paragraph: Share your case, judging rules and analysis. Get a recommendation deck with source notes, financials and backup slides for questions.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import fs from 'node:fs';
  3  | import { unzipSync, strFromU8 } from 'fflate';
  4  |
  5  | test('all five audience starters are reachable, shareable and can return to the full library', async ({ page }) => {
  6  |   await page.goto('/');
  7  |   await expect(page.getByTestId('block-card')).toHaveCount(16);
  8  |   for (const [id, label] of [['students', 'Students'], ['workers', 'Workers'], ['small-businesses', 'Small businesses'], ['enterprise', 'Enterprise teams'], ['startups', 'Startups']]) {
  9  |     await page.getByTestId('filter-audience').click();
  10 |     await page.getByRole('option', { name: label, exact: true }).click();
  11 |     await expect(page.getByTestId('block-card')).toHaveCount(8);
  12 |     await expect(page).toHaveURL(new RegExp(`audience=${id}`));
  13 |     await expect(page.getByTestId('audience-guide')).toContainText('Bring:');
  14 |     await page.reload();
  15 |     await expect(page.getByTestId('filter-audience')).toContainText(label);
  16 |     await expect(page.getByTestId('block-card')).toHaveCount(8);
  17 |   }
  18 |   await page.getByRole('button', { name: 'Clear all', exact: true }).click();
  19 |   await expect(page.getByTestId('block-card')).toHaveCount(16);
  20 |   await expect(page).not.toHaveURL(/audience=/);
  21 | });
  22 |
  23 | test('student context reaches a complete imported download with its license', async ({ page }, info) => {
  24 |   await page.goto('/?audience=students#library');
  25 |   await page.getByTestId('audience-guide').getByRole('button', { name: 'Save your context' }).click();
  26 |   await page.getByTestId('biz-sells').fill('I am studying computer science with an exam on 23 October.');
  27 |   await page.getByTestId('biz-more').fill('Use my course notes. Ask practice questions before revealing answers.');
  28 |   await page.getByTestId('biz-save').click();
  29 |   await page.locator('[data-slug="study-understanding-check"]').click();
  30 |   await page.getByTestId('install-claude').click();
  31 |   const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('install-zip').click()]);
  32 |   const file = info.outputPath(download.suggestedFilename());
  33 |   await download.saveAs(file);
  34 |   const pack = unzipSync(fs.readFileSync(file));
  35 |   const prefix = 'study-understanding-check/';
  36 |   const skill = strFromU8(pack[`${prefix}SKILL.md`]);
  37 |   expect(skill).toContain('I am studying computer science');
  38 |   expect(skill).toContain('Ask practice questions before revealing answers');
  39 |   expect(pack[`${prefix}LICENSE`]).toBeTruthy();
  40 | });
  41 |
  42 | test('requested presentation, case, research and valuation starting points open the right skills', async ({ page }) => {
  43 |   for (const [id, slug] of [['presentations', 'storyboard-to-powerpoint-deck-builder'], ['case-competitions', 'case-competition-slide-deck-builder'], ['research-documents', 'research-paper-writer'], ['equity-research', 'equity-research-valuation-report-builder']]) {
  44 |     await page.goto(`/?audience=${id}#library`);
  45 |     await expect(page.getByTestId('block-card')).toHaveCount(8);
  46 |     await page.locator(`[data-slug="${slug}"]`).click();
  47 |     await expect(page.getByTestId('block-page')).toBeVisible();
  48 |     if (id === 'equity-research') await expect(page.locator('.bp-sub')).toContainText('Chinese');
> 49 |     if (id === 'case-competitions') await expect(page.locator('.bp-sub')).toContainText('chart placeholders');
     |                                                                           ^ Error: expect(locator).toContainText(expected) failed
  50 |   }
  51 | });
  52 |
  53 | test('@mobile audience starters and intake template work at phone width', async ({ page }, info) => {
  54 |   await page.setViewportSize({ width: 320, height: 900 });
  55 |   for (const id of ['students', 'workers', 'small-businesses', 'enterprise', 'startups', 'presentations', 'case-competitions', 'research-documents', 'equity-research']) {
  56 |     await page.goto(`/?audience=${id}#library`);
  57 |     await expect(page.getByTestId('block-card')).toHaveCount(8);
  58 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  59 |     await page.getByTestId('filter-audience').click();
  60 |     await expect(page.getByRole('listbox', { name: 'Start with' })).toBeVisible();
  61 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  62 |     await page.keyboard.press('Escape');
  63 |   }
  64 |   await page.goto('/?audience=enterprise#library');
  65 |   await expect(page.getByTestId('audience-guide')).toContainText('need your own implementation');
  66 |   await expect(page.getByTestId('block-card')).toHaveCount(8);
  67 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  68 |   const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: 'Download a context template', exact: true }).click()]);
  69 |   const file = info.outputPath(download.suggestedFilename());
  70 |   await download.saveAs(file);
  71 |   expect(fs.readFileSync(file, 'utf8')).toContain('Source date and version');
  72 |   await page.screenshot({ path: info.outputPath('enterprise-starter-mobile.png'), fullPage: false });
  73 | });
  74 |
```