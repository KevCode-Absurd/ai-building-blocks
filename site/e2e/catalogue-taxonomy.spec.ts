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
    await expect(page.getByTestId('job-finance')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('filter-domain')).toContainText('Finance and accounting');
    for (const kind of ['prompt', 'skill', 'workflow', 'agent', 'mind']) {
      await page.getByTestId(`tab-${kind}`).click();
      await expect(page.getByTestId('result-count')).not.toHaveText(/^0 results/);
      await expect(page.locator('#library .grid > a').first()).toHaveAttribute('data-kind', kind);
    }
    await page.getByTestId('filter-task').click();
    await page.getByRole('option', { name: /Plan personal spending and savings/ }).click();
    await expect(page.getByTestId('result-count')).toContainText('Plan personal spending and savings');
    await page.reload();
    await expect(page.getByTestId('tab-mind')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('result-count')).not.toHaveText(/^0 results/);
    await expect(page.getByTestId('filter-task')).toContainText('Plan personal spending and savings');
    // URL restoration must not infer a specialty that excludes these minds.
    expect(new URL(page.url()).searchParams.get('fn')).toBeNull();
  });

  test(tag + 'all functions are discoverable without expanding More filters', async ({ page }) => {
    await page.goto('/#library');
    await expect(page.getByTestId('filter-domain')).toBeVisible();
    await expect(page.getByTestId('more-filters')).toHaveAttribute('aria-expanded', 'false');
    for (const id of ['finance', 'sales', 'operations']) await expect(page.getByTestId(`job-${id}`)).toBeVisible();
    await page.getByTestId('filter-domain').click();
    await expect(page.getByRole('listbox', { name: 'Job function', exact: true }).getByRole('option')).toHaveCount(24);
    for (const name of ['HR and recruiting', 'Legal and compliance', 'Data and analytics', 'Product management', 'Customer support', 'Supply chain and procurement', 'IT and infrastructure', 'Security and privacy', 'Engineering']) {
      await expect(page.getByRole('option', { name: new RegExp('^' + name) })).toBeAttached();
    }
    await page.getByRole('option', { name: /^HR and recruiting/ }).click();
    await expect(page.getByTestId('result-count')).toContainText('HR and recruiting');
    await page.getByTestId('filter-task').click();
    await expect(page.getByRole('option', { name: /Hire and look after your people/ })).toBeVisible();
    await page.keyboard.press('Escape');
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

test('@mobile function and use-case menus fit at 320px and 390px', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?area=finance#library');
    await expect(page.getByTestId('result-count')).toContainText('Finance and accounting');
    for (const id of ['filter-domain', 'filter-task']) {
      await page.getByTestId(id).click();
      await expect(page.getByRole('listbox')).toBeVisible();
      const box = await page.getByRole('listbox').boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      await page.keyboard.press('Escape');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.getByTestId('job-finance').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `../reports/2026-10-26-library-taxonomy/mobile-${width}.png` });
  }
});

test('desktop classification controls remain compact and keyboard accessible', async ({ page }) => {
  await page.goto('/?area=finance#library');
  await expect(page.getByTestId('result-count')).toContainText('Finance and accounting');
  await page.getByTestId('filter-domain').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox', { name: 'Job function', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('filter-domain')).toBeFocused();
  await page.getByTestId('library-search').scrollIntoViewIfNeeded();
  await page.screenshot({ path: '../reports/2026-10-26-library-taxonomy/desktop.png' });
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
