import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

// Release check against the actual published article and its reviewed files.
// Intentionally fails if the article has not yet been produced from the ledger.
const slug = 'ecommerce-ai-agents-output-benchmarks';
const assets = `/blog-assets/${slug}`;

for (const suffix of ['', ' @mobile']) {
  test(`the 80-agent study exposes its actual results, history and verified downloads${suffix}`, async ({ page, context, request }) => {
    test.setTimeout(180_000);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.route('**/api/auth*', route => route.fulfill({ json: { configured: false } }));
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await request.get(`${assets}/results.json`);
    expect(response.ok()).toBe(true);
    const results = await response.json();
    expect(results.cases).toHaveLength(80);
    expect(new Set(results.cases.map((c: any) => c.id)).size).toBe(80);
    await page.goto(`/blog/${slug}`);
    const article = page.getByTestId('blog-page');
    await expect(article.getByRole('heading', { level: 1 })).toHaveText('See what 80 ecommerce AI agents actually deliver');
    await expect(page).toHaveTitle(/80 ecommerce AI agents: outputs and results/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://useaiblocks.com/blog/${slug}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /fresh ecommerce agent outputs/i);
    await expect(article.locator('details.benchmark-case')).toHaveCount(80);
    await expect(article.getByRole('region', { name: 'All 80 agent results', exact: true }).locator('tbody tr')).toHaveCount(80);
    const checkedFiles = new Map<string, string>();
    for (const c of results.cases) {
      const detail = article.locator(`#case-${c.id}`);
      await detail.locator(':scope > summary').click();
      await expect(detail).toHaveAttribute('open', '');
      await expect(detail.locator('blockquote.benchmark-output')).toHaveCount(c.outputs.length);
      await expect(detail.locator('.benchmark-attempt')).toHaveCount(c.attempts.length);
      await expect(detail.getByRole('link', { name: `Open ${c.name}'s agent profile` })).toHaveAttribute('href', `https://agents.useaiblocks.com/agents/${c.id}`);
      for (const output of c.outputs) {
        for (const file of output.files) {
          if (!checkedFiles.has(file.filename)) {
            const res = await request.get(`${assets}/${file.filename}`);
            expect(res.ok(), file.filename).toBe(true);
            const bytes = await res.body();
            expect(bytes.length, file.filename).toBe(file.bytes);
            expect(createHash('sha256').update(bytes).digest('hex'), file.filename).toBe(file.sha256);
            checkedFiles.set(file.filename, file.sha256);
          } else {
            expect(checkedFiles.get(file.filename)).toBe(file.sha256);
          }
          if (file.kind === 'image') {
            const image = detail.locator(`img[src="${assets}/${file.filename}"]`).first();
            await image.scrollIntoViewIfNeeded();
            await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
            expect(await image.evaluate((el: HTMLImageElement) => [el.naturalWidth, el.naturalHeight])).toEqual([file.width, file.height]);
          }
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), c.id).toBe(true);
      await detail.locator(':scope > summary').click();
    }
    const copyButtons = article.locator('.copy-btn');
    await expect(copyButtons).toHaveCount(2);
    for (const button of await copyButtons.all()) {
      await button.click();
      await expect(article.locator('#copy-status')).toContainText(/copied|selected/i);
    }
    expect(errors).toEqual([]);
  });
}
