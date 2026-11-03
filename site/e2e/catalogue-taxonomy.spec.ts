import { test, expect } from '@playwright/test';
import { serveBuiltSite } from './built-site-fixture';

test.beforeEach(async ({ page }) => {
  await serveBuiltSite(page);
  await page.route('**/api/auth*', route => route.fulfill({ json: { configured: false } }));
  await page.route('**/api/community/rankings', route => route.fulfill({ json: { ranked: ['catalogue/website-brand-brain-builder'], counts: {} } }));
});

for (const tag of ['', '@mobile ']) {
  test(tag + 'Finance filters every format and exposes its real use cases', async ({ page }) => {
    await page.goto('/?area=finance#library');
    await expect(page.getByTestId('result-count')).toContainText('Finance and accounting');
    for (const kind of ['prompt', 'skill', 'workflow', 'agent', 'mind']) {
      await page.getByTestId(`tab-${kind}`).click();
      await expect(page.getByTestId('result-count')).not.toHaveText(/^0 results/);
      await expect(page.locator('#library .grid > a').first()).toHaveAttribute('data-kind', kind);
    }
    // Use cases are reached by link now that the home page has no use-case menu.
    await page.goto('/?area=finance&kind=mind&job=manage-personal-finances#library');
    await expect(page.getByTestId('result-count')).toContainText('Plan personal spending and savings');
    await page.reload();
    await expect(page.getByTestId('tab-mind')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('result-count')).not.toHaveText(/^0 results/);
    await expect(page.getByTestId('result-count')).toContainText('Plan personal spending and savings');
    // URL restoration must not infer a specialty that excludes these minds.
    expect(new URL(page.url()).searchParams.get('fn')).toBeNull();
  });

  test(tag + 'every job function is reachable by link and the old filter menus are gone', async ({ page }) => {
    await page.goto('/#library');
    for (const id of ['filter-domain', 'filter-task', 'more-filters', 'job-finance']) await expect(page.getByTestId(id)).toHaveCount(0);
    for (const [id, name] of [['finance', 'Finance and accounting'], ['sales', 'Sales'], ['operations', 'Operations'], ['people', 'HR and recruiting'], ['legal', 'Legal and compliance'], ['data', 'Data and analytics'], ['product', 'Product management'], ['support', 'Customer support'], ['supply-chain', 'Supply chain and procurement'], ['it', 'IT and infrastructure'], ['security', 'Security and privacy'], ['engineering', 'Engineering']]) {
      await page.goto(`/?area=${id}#library`);
      await expect(page.getByTestId('result-count')).toContainText(`in ${name}`);
      await expect(page.getByTestId('result-count')).not.toHaveText(/^0 results/);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
}

test('dedicated Minds search uses the same expertise model', async ({ page }) => {
  await page.goto('/minds');
  await page.getByLabel('Search minds', { exact: true }).fill('value investing');
  await expect(page.locator('[data-testid="mind-card"][data-slug="warren-buffett"]')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('[data-testid="mind-card"][data-slug="charlie-munger"]')).toBeVisible();
  const first = await page.getByTestId('mind-card').evaluateAll(nodes => nodes.slice(0, 5).map(node => node.getAttribute('data-slug')));
  expect(first).toContain('warren-buffett');
  expect(first).toContain('charlie-munger');
});

test('@mobile a job function link fits at 320px and 390px', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?area=finance#library');
    await expect(page.getByTestId('result-count')).toContainText('Finance and accounting');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.getByTestId('library-search').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `../reports/2026-10-26-library-taxonomy/mobile-${width}.png` });
  }
});

for (const tag of ['', '@mobile ']) {
  test(tag + 'homepage search ranks expertise and stays relevant when format changes', async ({ page }) => {
    await page.goto('/#library');
    await page.getByTestId('library-search').fill('value investing');
    const cards = page.locator('#library .grid > a');
    await expect(page.locator('#library [data-slug="warren-buffett"]')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('#library [data-slug="charlie-munger"]')).toBeVisible();
    await expect(page.getByText('Searching full instructions…', { exact: true })).toHaveCount(0, { timeout: 30000 });
    const first = await cards.evaluateAll(nodes => nodes.slice(0, 5).map(node => node.getAttribute('href')));
    expect(first).toContain('/minds/warren-buffett');
    expect(first).toContain('/minds/charlie-munger');
    await page.getByTestId('tab-skill').click();
    await expect(cards.first()).toHaveAttribute('data-kind', 'skill');
    await expect(page.getByTestId('library-search')).toHaveValue('value investing');
    await page.getByTestId('tab-all').click();
    await page.getByTestId('library-search').fill('negotiation minds');
    await expect(cards.first()).toHaveAttribute('data-kind', 'mind', { timeout: 30000 });
    await expect(cards.filter({ hasText: 'Chris Voss' })).toBeVisible();
    await page.getByTestId('library-search').fill('customer support agent');
    await expect(cards.first()).toHaveAttribute('data-kind', 'agent', { timeout: 30000 });
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
}
