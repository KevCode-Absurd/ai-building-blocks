import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';

const protectedContexts = new WeakSet<BrowserContext>();

export function stagingHeaders(url: string, headers: Record<string, string> = {}) {
  if (!process.env.CF_STAGING_URL) return headers;
  const origin = new URL(process.env.CF_STAGING_URL).origin;
  if (new URL(url, origin).origin !== origin) return headers;
  const token = process.env.CF_PREVIEW_ACCESS_TOKEN;
  if (!token) throw new Error('Load the staging preview credential in-process before live browser checks.');
  return { ...headers, 'x-preview-access': token };
}

export async function protectStagingContext(context: BrowserContext) {
  if (!process.env.CF_STAGING_URL || protectedContexts.has(context)) return;
  const origin = new URL(process.env.CF_STAGING_URL).origin;
  // Browser-managed attachment downloads can bypass route interception. Use the
  // legitimate staging login cookie, scoped to this HTTPS host, when supplied.
  const session = process.env.CF_PREVIEW_SESSION_COOKIE;
  if (session) {
    if (!/^__Host-ai_preview=[0-9]{10}\.[0-9]{10}\.[a-f0-9]{32}\.[a-f0-9]{64}$/.test(session)) throw new Error('Invalid staging session format.');
    await context.addCookies([{ name: '__Host-ai_preview', value: session.split('=')[1], url: origin, secure: true, httpOnly: true, sameSite: 'Strict' }]);
  }
  // Never use global extraHTTPHeaders: Turnstile is a third-party origin.
  await context.route(url => url.origin === origin, route => route.continue({
    headers: stagingHeaders(route.request().url(), route.request().headers()),
  }));
  protectedContexts.add(context);
}

export async function protectedGet(page: Page, url: string) {
  return page.request.get(url, { headers: stagingHeaders(url) });
}

export const test = base.extend<{ stagingProtection: void }>({
  stagingProtection: [async ({ context }, use) => {
    await protectStagingContext(context);
    await use();
  }, { auto: true }],
});
export { expect };
export type { Page };
