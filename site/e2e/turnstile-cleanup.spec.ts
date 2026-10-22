import { test, expect } from './fixtures/staging-aware-test';

// Local regression: a third-party SDK cleanup exception must not strand an app action.
for (const action of ['verify', 'cancel'] as const) test(`Turnstile ${action} settles even when SDK cleanup throws`, async ({ page }) => {
  let posts = 0;
  await page.route('**/api/security', route => route.fulfill({ json: { required: true, sitekey: 'local-ui-fixture' } }));
  await page.route('**/api/spaces', route => { posts++; return route.fulfill({ status: 429, json: { error: 'Please try later.' } }); });
  await page.addInitScript(() => {
    (window as any).turnstile = {
      render(element: HTMLElement, options: any) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Finish test verification';
        button.onclick = () => options.callback('synthetic-single-use-token'); element.append(button); return 'test-widget';
      },
      remove() { throw Error('Synthetic SDK cleanup failure'); },
    };
  });
  page.on('pageerror', () => {});
  await page.goto('/space');
  await page.getByTestId('space-name').fill('Cleanup regression');
  await page.getByTestId('make-space-go').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: action === 'verify' ? 'Finish test verification' : 'Cancel', exact: true }).click();
  if (action === 'verify') await expect.poll(() => posts, { timeout: 2500 }).toBe(1);
  await expect(page.getByTestId('make-space-go')).toBeEnabled({ timeout: 2500 });
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 2500 });
  expect(posts).toBe(action === 'verify' ? 1 : 0);
});
