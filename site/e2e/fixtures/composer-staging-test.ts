import { test as base, expect } from './staging-aware-test';

// Diagnostics contain paths/statuses only. Never record preview headers, cookies,
// request bodies, full URLs or authentication responses.
export const test = base.extend<{ composerDiagnostics: void }>({
  composerDiagnostics: [async ({ page }, use, info) => {
    const pending = new Map<object, { path: string; started: number }>();
    const events: object[] = [];
    page.on('request', request => pending.set(request, { path: new URL(request.url()).pathname, started: Date.now() }));
    page.on('requestfinished', request => pending.delete(request));
    page.on('requestfailed', request => {
      events.push({ path: new URL(request.url()).pathname, failed: request.failure()?.errorText });
      pending.delete(request);
    });
    page.on('response', response => {
      if (response.status() >= 400) events.push({ path: new URL(response.url()).pathname, status: response.status() });
    });
    page.on('pageerror', error => events.push({ error: error.message.replace(/https?:\/\/\S+/g, '[URL]') }));
    await use();
    if (info.status !== info.expectedStatus) {
      await info.attach('composer-network-diagnostics', { contentType: 'application/json', body: Buffer.from(JSON.stringify({ events, pending: [...pending.values()].map(r => ({ path: r.path, pendingMs: Date.now() - r.started })) }, null, 2)) });
    }
  }, { auto: true }],
});
export { expect };
