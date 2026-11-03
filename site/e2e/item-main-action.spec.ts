import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/auth*', r => r.fulfill({ json: { configured: false } }));
  await page.route('**/api/comments*', r => r.fulfill({ json: { enabled: false, comments: [] } }));
});

test('@mobile the main action sits under the headline and follows as a slim bar on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const [path, main] of [['/prompts/rough-notes-to-minutes-writer', 'run-in-my-ai'], ['/workflows/ad-ab-test', 'main-download']] as const) {
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

test('Run in my AI opens the chosen AI and copies the instructions', async ({ page, context }) => {
  await page.goto('/prompts/rough-notes-to-minutes-writer');
  await page.getByTestId('run-in-my-ai').click();
  for (const name of ['ChatGPT', 'Claude', 'Gemini']) await expect(page.getByRole('group', { name: 'Choose your AI' }).getByRole('button', { name: new RegExp(name) })).toBeVisible();
  await context.route(/^https:\/\/(chatgpt\.com|claude\.ai|gemini\.google\.com)\//, r => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>stub</title>' }));
  const [popup] = await Promise.all([context.waitForEvent('page'), page.getByTestId('run-in-gemini').click()]);
  expect(popup.url()).toBe('https://gemini.google.com/app');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied.length).toBeGreaterThan(200);
  await expect(page.locator('.toast')).toContainText('Paste it into the new Gemini chat');
  await popup.close();
  await page.getByTestId('run-in-my-ai').click();
  await expect(page.getByTestId('run-in-gemini')).toContainText('Last used');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('run-in-gemini')).toHaveCount(0);
  // Everything else is still one tap away under More ways.
  await page.getByTestId('more-ways-link').click();
  await expect(page.getByTestId('task-primary')).toContainText('More ways to run it');
  await expect(page.getByTestId('copy-skill')).toBeVisible();
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
