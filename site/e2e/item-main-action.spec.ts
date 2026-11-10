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
  // A prompt is one message: one line on how to use it, the brief, then three steps that fit any AI.
  await expect(main.getByTestId('main-action-lead')).toContainText('open a new chat');
  await expect(main.getByTestId('item-brief')).toContainText('You give it');
  await expect(main.getByTestId('brief-time')).toHaveText('One message and one reply.');
  await expect(main.getByTestId('upload-steps')).toContainText('Then use it in your AI');
  await expect(main.getByTestId('upload-steps')).toContainText('paste the prompt in');
  await expect(main.getByTestId('upload-chatgpt')).toHaveCount(0);
  await expect(page.getByText('Run in my AI')).toHaveCount(0);
  // It downloads as a prompt file, not as SKILL.md or a skill ZIP.
  const [file] = await Promise.all([page.waitForEvent('download'), main.getByTestId('download-task').click()]);
  expect(file.suggestedFilename()).toBe('rough-notes-to-minutes-writer-prompt.md');
  // The page says what it is and links up to every prompt.
  await expect(page.getByTestId('format-label')).toHaveText('Prompt');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByTestId('format-link')).toHaveAttribute('href', '/prompts');
  await expect(page.getByRole('heading', { name: 'Before and after this prompt' })).toBeVisible();
  // Copying is still one tap away under Other ways.
  await page.getByTestId('more-ways-link').click();
  await expect(page.getByTestId('task-primary')).toContainText('Other ways to use it');
  await expect(page.getByTestId('copy-skill')).toBeVisible();
});

test('Save sits beside Download, Claude Code has its own steps, and extras wait under More options', async ({ page }) => {
  await page.goto('/skills/ai-search-audit');
  const main = page.getByTestId('main-action');
  await expect(main.getByTestId('save-item')).toBeVisible();
  await expect(page.getByTestId('save-item')).toHaveCount(1);
  await expect(main.getByTestId('upload-steps')).toContainText('Then upload it to your AI');
  await main.getByTestId('upload-chatgpt').click();
  await expect(main.getByTestId('upload-steps')).toContainText("ChatGPT project's Sources");
  await main.getByTestId('upload-claude-code').click();
  await expect(main.getByTestId('upload-steps')).toContainText('.claude/skills');
  await expect(page.getByTestId('pull-from-ai')).toBeHidden();
  await page.getByTestId('task-more').locator('> summary').click();
  await expect(page.getByTestId('pull-from-ai')).toBeVisible();
});

test('anyone can say whether an item worked, change the answer, or take it back', async ({ page }) => {
  await page.route('**/api/votes*', async r => {
    const req = r.request();
    if (req.method() === 'GET') return r.fulfill({ json: { yes: 3, no: 1, mine: null } });
    const { worked } = req.postDataJSON();
    return r.fulfill({ json: { yes: 3 + (worked === true ? 1 : 0), no: 1 + (worked === false ? 1 : 0), mine: worked } });
  });
  await page.goto('/prompts/rough-notes-to-minutes-writer');
  const votes = page.getByTestId('item-votes');
  await expect(votes.getByTestId('vote-count')).toHaveText('3 of 4 people say it worked.');
  await votes.getByTestId('vote-no').click();
  await expect(votes.getByTestId('vote-no')).toHaveAttribute('aria-pressed', 'true');
  await expect(votes.getByTestId('vote-thanks').getByRole('link', { name: 'Tell others what went wrong' })).toHaveAttribute('href', '#comments');
  await votes.getByTestId('vote-yes').click();
  await expect(votes.getByTestId('vote-count')).toHaveText('4 of 5 people say it worked.');
  await votes.getByTestId('vote-yes').click();
  await expect(votes.getByTestId('vote-yes')).toHaveAttribute('aria-pressed', 'false');
  await expect(votes.getByTestId('vote-count')).toHaveText('3 of 4 people say it worked.');
});

test('the answers row stays hidden when the service is off', async ({ page }) => {
  await page.route('**/api/votes*', r => r.fulfill({ status: 503, json: { error: 'off' } }));
  await page.goto('/prompts/rough-notes-to-minutes-writer');
  await expect(page.getByTestId('download-task')).toBeEnabled();
  await expect(page.getByTestId('item-votes')).toHaveCount(0);
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
