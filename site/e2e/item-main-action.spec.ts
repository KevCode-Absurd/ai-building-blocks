import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/auth*', r => r.fulfill({ json: { configured: false } }));
  await page.route('**/api/comments*', r => r.fulfill({ json: { enabled: false, comments: [] } }));
});

test('@mobile the main action sits under the headline and follows as a slim bar on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const [path, main] of [['/prompts/rough-notes-to-minutes-writer', 'download-task'], ['/workflows/ad-ab-test', 'download-task']] as const) {
    await page.goto(path);
    const action = page.getByTestId(main);
    await expect(action).toBeEnabled();
    const h1 = await page.locator('.bp-h1').boundingBox(), box = await action.boundingBox();
    expect(box!.y).toBeGreaterThan(h1!.y);
    expect(box!.y).toBeLessThan(812);
    await expect(page.getByTestId('sticky-action')).toBeHidden();
    await page.getByTestId('main-action').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().bottom + scrollY + 400));
    await expect(page.getByTestId('sticky-action')).toBeVisible();
    const bar = await page.getByTestId('sticky-action').boundingBox();
    expect(bar!.y + bar!.height).toBeLessThanOrEqual(812 + 1);
    await page.locator('#run').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('sticky-action')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

test('the main button downloads the item, and the upload steps sit right under it', async ({ page }) => {
  await page.goto('/prompts/rough-notes-to-minutes-writer');
  const main = page.getByTestId('main-action');
  await expect(main.getByTestId('download-task')).toHaveText('Download prompt');
  await expect(main.getByTestId('upload-steps')).toContainText('Then upload it to your AI');
  await main.getByTestId('upload-chatgpt').click();
  await expect(main.getByTestId('upload-steps')).toContainText("ChatGPT project's Sources");
  await expect(page.getByText('Run in my AI')).toHaveCount(0);
  await Promise.all([page.waitForEvent('download'), main.getByTestId('download-task').click()]);
  // Copying is still one tap away under Other ways.
  await page.getByTestId('more-ways-link').click();
  await expect(page.getByTestId('task-primary')).toContainText('Other ways to use it');
  await expect(page.getByTestId('copy-skill')).toBeVisible();
});

test('Share copies the page address', async ({ page }) => {
  await page.goto('/prompts/rough-notes-to-minutes-writer');
  await page.getByTestId('share-item').click();
  await expect(page.getByTestId('share-item')).toHaveText('Link copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/prompts\/rough-notes-to-minutes-writer$/);
});

test('a workflow page says to upload the whole pack and follow HANDOFF.md', async ({ page }) => {
  await page.goto('/workflows/ad-ab-test');
  const main = page.getByTestId('main-action');
  await expect(main.getByTestId('download-task')).toHaveText('Download workflow');
  await expect(main.getByTestId('upload-steps')).toContainText('follow HANDOFF.md');
});

test('@mobile home search says Searching until it can count, without a separate top-matches list', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/data/library-search.json', async r => { await held; await r.continue(); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByTestId('library-search').fill('meeting notes');
  const count = page.getByTestId('result-count');
  await expect(count).toHaveText('Searching…');
  await expect(page.getByText(/^0 results/)).toHaveCount(0);
  release();
  await expect(count).toHaveText(/^\d[\d,]* results?/, { timeout: 20000 });
  await expect(page.getByTestId('library-top-hits')).toHaveCount(0);
  await expect(page.locator('#library [data-testid="block-card"]').first()).toBeVisible();
  await page.getByTestId('library-search').fill('xqzv plorb wug');
  await expect(page.getByTestId('library-minds')).toHaveCount(0);
});
