import { test, expect, type Page } from './fixtures/staging-aware-test';
import fs from 'node:fs';
import crypto from 'node:crypto';

test('real Turnstile permits synthetic staging space and comment creation', async ({ page }) => {
  test.skip(process.env.CF_STAGING_REAL_WRITES !== 'true', 'Run explicitly in a visible staging browser.');
  test.setTimeout(720_000);
  const suffix = crypto.randomUUID().slice(0, 20);
  const name = 'Staging launch verification ' + suffix;
  const commentSlug = 'website-brand-brain-builder';
  const fixture: Record<string, string> = { commentSlug };
  const diagnostics: unknown[] = [];
  await page.exposeFunction('__recordStagingWidgetEvent', (event: unknown) => console.log(JSON.stringify({ realWidgetEvent: event })));
  page.on('pageerror', error => console.log(JSON.stringify({ realWidgetPageError: error.message.replace(/https?:\/\/\S+/g, '[URL]').slice(0, 300) })));
  page.on('requestfailed', request => diagnostics.push({ host: new URL(request.url()).hostname, resource: request.resourceType(), error: request.failure()?.errorText }));
  page.on('console', message => { if (/turnstile/i.test(message.text())) diagnostics.push({ consoleType: message.type(), message: message.text().replace(/https?:\/\/\S+/g, '[URL]').slice(0, 300) }); });
  page.on('response', response => { if (new URL(response.url()).pathname === '/api/security') diagnostics.push({ securityStatus: response.status() }); });
  await page.addInitScript(() => {
    (window as any).__stagingToasts = [];
    (window as any).__stagingWidgetErrors = [];
    // Observe the real SDK's error code, then invoke its original callback unchanged.
    document.addEventListener('load', event => {
      if (!(event.target instanceof HTMLScriptElement) || !event.target.src.startsWith('https://challenges.cloudflare.com/turnstile/')) return;
      const api = (window as any).turnstile; if (!api) return;
      const render = api.render.bind(api);
      api.render = (element: HTMLElement, options: any) => render(element, { ...options, callback: (token: string) => {
        (window as any).__recordStagingWidgetEvent({ type: 'success-callback', action: options.action });
        try { return options.callback?.(token); }
        catch (error: any) { (window as any).__recordStagingWidgetEvent({ type: 'callback-cleanup-error', message: String(error?.message || 'Unknown cleanup error').slice(0, 200) }); throw error; }
      }, 'error-callback': (code: string) => {
        (window as any).__stagingWidgetErrors.push(String(code).slice(0, 32));
        (window as any).__recordStagingWidgetEvent({ type: 'error-callback', code: String(code).slice(0, 32), action: options.action });
        return options['error-callback']?.(code);
      } });
    }, true);
    setInterval(() => { const text = document.querySelector('.toast')?.textContent; const list = (window as any).__stagingToasts; if (text && text !== list.at(-1)) list.push(text); }, 100);
  });
  async function normalProtectedAction(page: Page, pathname: string, submit: () => Promise<unknown>, action: string) {
    const response = page.waitForResponse(response => new URL(response.url()).pathname === pathname && response.request().method() === 'POST', { timeout: 300_000 });
    await submit();
    const state = await Promise.race([response.then(() => 'complete'), new Promise(resolve => setTimeout(() => resolve('pending'), 15_000))]);
    if (state === 'pending') {
      await page.screenshot({ path: test.info().outputPath(`real-widget-${action}-pending.png`) });
      const ui = await page.evaluate(() => ({ dialogOpen: !!document.querySelector('dialog[open]'), sdkLoaded: !!(window as any).turnstile, toasts: (window as any).__stagingToasts, errorCodes: (window as any).__stagingWidgetErrors }));
      console.log(JSON.stringify({ action, ui, diagnostics }));
      if (!ui.dialogOpen && ui.toasts?.some((text: string) => /security check could not|verification|unavailable/i.test(text))) {
        console.log(`REAL_WIDGET_RETRY_NEEDED:${action}: retry the normal action in the visible browser if its security check expired.`);
      }
      console.log(`REAL_WIDGET_PENDING:${action}: the visible browser is waiting for the normal Cloudflare security check.`);
    }
    const result = await response;
    console.log(JSON.stringify({ realProtectedResponse: action, status: result.status() }));
    expect(result.status(), `normal ${action} submission succeeds after real verification`).toBe(201);
    return result.json();
  }
  try {
    await page.goto('/space');
    await page.getByTestId('space-name').fill(name);
    const created = await normalProtectedAction(page, '/api/spaces', () => page.getByTestId('make-space-go').click(), 'space');
    for (const value of [created.ownerKey, created.shareToken, created.space?.id]) expect(typeof value).toBe('string');
    Object.assign(fixture, { ownerKey: created.ownerKey, shareToken: created.shareToken, spaceId: created.space.id });
    await page.reload();
    await expect(page.getByTestId('space-title')).toHaveValue(name);
    await page.goto('/skills/' + commentSlug);
    await page.getByTestId('comments-open').click();
    await page.getByTestId('comment-body').fill(name);
    await page.getByTestId('comment-name').fill('Staging verification');
    const posted = await normalProtectedAction(page, '/api/comments', () => page.getByTestId('comment-post').click(), 'comment');
    expect(typeof posted.comment?.id).toBe('string');
    fixture.commentId = posted.comment.id;
    await expect(page.getByTestId('comment').filter({ hasText: name })).toBeVisible();
    await page.screenshot({ path: test.info().outputPath('real-widget-posted-comment.png') });
    // Synthetic owner/share credentials stay in the ignored local directory.
    fs.mkdirSync('.wrangler', { recursive: true });
    fs.writeFileSync('.wrangler/staging-live-fixtures.json', JSON.stringify(fixture), { mode: 0o600 });
    fs.writeFileSync('../reports/cloudflare-staging-real-writes.json', JSON.stringify({ checkedOn: new Date().toISOString(), deployedVersion: process.env.CF_STAGING_VERSION, status: 'pass', environment: process.env.CF_STAGING_URL, realWidget: true, productionTouched: false, providerCalls: 0, checks: ['space created through real Turnstile and persisted after reload', 'comment created through real Turnstile'], fixtureCleanup: 'pending API persistence/sharing checks and cleanup' }, null, 2) + '\n');
    console.log('Real widget-created staging fixtures saved privately for API checks.');
  } catch (error) {
    // Record only safe IDs if an action succeeded before the next challenge failed.
    fs.writeFileSync('../reports/cloudflare-staging-real-writes.json', JSON.stringify({ checkedOn: new Date().toISOString(), deployedVersion: process.env.CF_STAGING_VERSION, status: 'incomplete', realWidget: true, productionTouched: false, providerCalls: 0, remainingFixture: { spaceId: fixture.spaceId, commentId: fixture.commentId } }, null, 2) + '\n');
    throw error;
  }
});
