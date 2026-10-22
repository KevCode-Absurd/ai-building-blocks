import { test, expect, type Page } from './fixtures/staging-aware-test';
import { mockComposerAccount } from './fixtures/composer-account';

// Local UI tests only: no external challenge, provider call, secret or remote write.
async function mockVerification(page: Page) {
  await page.route('**/api/security', route => route.fulfill({ json: { required: true, sitekey: 'local-ui-fixture' } }));
  await page.addInitScript(() => {
    let next = 0;
    (window as any).turnstile = {
      render(element: HTMLElement, options: any) {
        const button = document.createElement('button'); button.textContent = 'Finish test verification'; button.type = 'button';
        button.dataset.action = options.action;
        button.onclick = () => options.callback(`single-use-${++next}`);
        element.append(button); return String(next);
      },
      remove() {},
    };
  });
}
async function startAI(page: Page) {
  await mockComposerAccount(page);
  await page.goto('/compose');
  await page.getByRole('tab', { name: 'AI composition' }).click();
  await page.getByTestId('compose-goal').fill('Build a landing page from scratch');
  await page.getByTestId('compose-submit').click();
}
test('AI waits for verification and uses a fresh token on retry', async ({ page }) => {
  await mockVerification(page);
  const tokens: string[] = [];
  await page.route('**/api/compose', route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { enabled: true } });
    tokens.push(route.request().headers()['x-turnstile-token']);
    return route.fulfill({ status: 429, json: { error: 'Please wait before generating again.' } });
  });
  await startAI(page);
  const dialog = page.getByRole('dialog', { name: 'Quick security check' });
  await expect(dialog).toBeVisible(); expect(tokens).toEqual([]);
  await expect(dialog.locator('[data-action="compose"]')).toBeVisible();
  await dialog.getByRole('button', { name: 'Finish test verification' }).click();
  await expect(page.getByRole('alert')).toContainText('Please wait');
  await expect(dialog).toHaveCount(0);
  await page.getByTestId('compose-submit').click();
  await page.getByRole('button', { name: 'Finish test verification' }).click();
  await expect.poll(() => tokens).toEqual(['single-use-1', 'single-use-2']);
});
test('cancelling verification prevents the AI request and restores the form', async ({ page }) => {
  await mockVerification(page); let calls = 0;
  await page.route('**/api/compose', route => { if (route.request().method() === 'POST') calls++; return route.fulfill({ json: { enabled: true } }); });
  await startAI(page);
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('cancelled');
  await expect(page.getByTestId('compose-submit')).toBeEnabled(); expect(calls).toBe(0);
});
test('comment submission verifies the comment action before posting', async ({ page }) => {
  await mockVerification(page); const tokens: string[] = [];
  await page.route('**/api/comments**', route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { comments: [] } });
    tokens.push(route.request().headers()['x-turnstile-token']);
    return route.fulfill({ status: 201, json: { comment: {} } });
  });
  await page.goto('/skills/website-brand-brain-builder');
  await page.getByTestId('comments-open').click();
  await page.getByTestId('comment-body').fill('Where should I begin with this workflow?');
  await page.getByTestId('comment-post').click();
  await expect(page.locator('[data-action="comment"]')).toBeVisible(); expect(tokens).toEqual([]);
  await page.getByRole('button', { name: 'Finish test verification' }).click();
  await expect.poll(() => tokens).toEqual(['single-use-1']);
  await expect(page.getByTestId('comment-body')).toHaveValue('');
});
test('space creation waits for its own action and preserves existing error handling', async ({ page }) => {
  await mockVerification(page); const tokens: string[] = [];
  await page.route('**/api/spaces', route => {
    tokens.push(route.request().headers()['x-turnstile-token']);
    return route.fulfill({ status: 429, json: { error: 'Please wait before making another space.' } });
  });
  await page.goto('/space');
  await page.getByTestId('space-name').fill('Security test'); await page.getByTestId('make-space-go').click();
  await expect(page.locator('[data-action="create_space"]')).toBeVisible(); expect(tokens).toEqual([]);
  await page.getByRole('button', { name: 'Finish test verification' }).click();
  await expect.poll(() => tokens).toEqual(['single-use-1']);
  await expect(page.getByTestId('make-space-go')).toBeEnabled();
});
test('a security configuration outage blocks AI calls with a usable error', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/security', route => route.fulfill({ status: 503, json: { error: 'Security verification is temporarily unavailable.' } }));
  await page.route('**/api/compose', route => { if (route.request().method() === 'POST') calls++; return route.fulfill({ json: { enabled: true } }); });
  await startAI(page); await expect(page.getByRole('alert')).toContainText('temporarily unavailable');
  expect(calls).toBe(0); await expect(page.getByTestId('compose-submit')).toBeEnabled();
});
test('free assembly never asks for Turnstile or posts to AI', async ({ page }) => {
  let checks = 0, paid = 0;
  page.on('request', req => { if (req.url().includes('/api/security')) checks++; if (req.url().includes('/api/compose') && req.method() === 'POST') paid++; });
  await page.goto('/compose'); await page.getByTestId('compose-goal').fill('Build a landing page from scratch'); await page.getByTestId('compose-submit').click();
  await expect(page.getByTestId('compose-steps')).toBeVisible(); expect(checks).toBe(0); expect(paid).toBe(0);
});
test('verification dialog fits a narrow screen @mobile', async ({ page }, info) => {
  await mockVerification(page);
  await page.route('**/api/compose', route => route.fulfill({ json: { enabled: true } }));
  await startAI(page); const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.screenshot({ path: info.outputPath('security-check-mobile.png') });
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
});
