import { test, expect } from '@playwright/test';
import { previewSessionRoute } from '../src/server/preview-session';
import { previewSecurity, apiSecurity } from '../src/server/api-security';

test.use({ trace: 'off', video: 'off' });

test('normal browser form login retains its same-origin proof and opens a private cookie session', async ({ page }) => {
  // Entirely synthetic host and credential: no real staging traffic or secrets.
  const origin = 'https://browser-login-test.example.workers.dev';
  const secret = 'synthetic-browser-preview-test-credential-only';
  const allow = { async limit() { return { success: true }; } };
  const env = { PREVIEW_PROTECTED: 'true', PREVIEW_ACCESS_TOKEN: secret, API_ALLOWED_HOSTS: new URL(origin).hostname,
    API_WRITE_LIMITER: allow, API_READ_LIMITER: allow, TURNSTILE_SITE_KEY: 'real-site-key', TURNSTILE_SECRET_KEY: 'test-server-secret' };
  let observedOrigin: string | undefined;
  let loginStatus: number | undefined;
  await page.route('**/*', async route => {
    const browserRequest = route.request();
    if (!browserRequest.url().startsWith(origin + '/')) return route.abort();
    const headers = await browserRequest.allHeaders();
    const req = new Request(browserRequest.url(), { method: browserRequest.method(), headers: { ...headers, 'cf-connecting-ip': '192.0.2.1' }, body: browserRequest.postDataBuffer() ?? undefined });
    let response = await previewSessionRoute(req, env);
    if (new URL(req.url).pathname === '/__preview/login' && req.method === 'POST') {
      observedOrigin = req.headers.get('origin') ?? undefined; loginStatus = response?.status;
    }
    response ??= await previewSecurity(req, env);
    if (!response && new URL(req.url).pathname.startsWith('/api/')) response = await apiSecurity(req, env);
    response ??= new Response('<h1>Private browser session confirmed</h1>', { headers: { 'content-type': 'text/html' } });
    await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
  });
  await page.goto(origin + '/__preview/login');
  await page.getByLabel('Staging access credential').fill(secret);
  await page.getByRole('button', { name: 'Open staging' }).click();
  expect(observedOrigin).toBe(origin);
  expect(loginStatus).toBe(303);
  await expect(page).toHaveURL(origin + '/space');
  await expect(page.getByRole('heading')).toHaveText('Private browser session confirmed');
  await page.reload();
  await expect(page.getByRole('heading')).toHaveText('Private browser session confirmed');
  const writeStatus = await page.evaluate(async () => (await fetch('/api/spaces', { method: 'POST', body: '{}' })).status);
  expect(writeStatus).toBe(403);
});
