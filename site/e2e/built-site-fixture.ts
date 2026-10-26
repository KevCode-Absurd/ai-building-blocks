import type { Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

/** Serve the real build through request interception when loopback networking
 * is unavailable. Scripts, workers, styles and data remain the built artifacts. */
export async function serveBuiltSite(page: Page) {
  if (!process.env.PW_LOCAL_ARTIFACTS) return;
  const root = path.resolve(process.env.PW_ARTIFACT_ROOT || 'dist');
  const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain', '.md': 'text/plain' };
  await page.route('https://aiblocks.test/**', async route => {
    const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
    if (pathname.startsWith('/api/')) { await route.fulfill({ status: 404, json: { error: 'Local artifact fixture has no live API' } }); return; }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep)) { await route.fulfill({ status: 400, body: 'Invalid path' }); return; }
    for (const file of [target, target + '.html', path.join(target, 'index.html')]) {
      try {
        const data = await fs.readFile(file);
        await route.fulfill({ status: 200, contentType: mime[path.extname(file)] ?? 'application/octet-stream', body: data });
        return;
      } catch { /* Try the next normal static route. */ }
    }
    await route.fulfill({ status: 404, body: 'Missing build artifact: ' + pathname });
  });
}
