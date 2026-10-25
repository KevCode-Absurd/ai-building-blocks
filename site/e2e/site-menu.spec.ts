import { test, expect } from "@playwright/test";
import { mockComposerAccount } from "./fixtures/composer-account";

for (const tag of ["", "@mobile "]) {
  test(tag + "one menu exposes all features and supports keyboard, outside close and small screens", async ({ page }) => {
    await mockComposerAccount(page, false);
    await page.goto('/apps');
    const header = page.locator('header.site-header'), trigger = page.getByTestId('menu-btn');
    await expect(header.getByRole('button', { name: 'Menu', exact: true })).toHaveCount(1);
    await expect(header.getByRole('link')).toHaveCount(1);
    await trigger.focus(); await page.keyboard.press('Enter');
    const menu = page.getByTestId('site-menu');
    await expect(menu.getByRole('link').first()).toHaveText('My Account');
    await expect(menu.getByRole('link').first()).toBeFocused();
    for (const label of ['My saved work', 'Sign in', 'Find a task', 'Workflow Builder', 'Plan a workflow', 'Prompts', 'Skills', 'Workflows', 'Agents', 'Minds', 'Browser tools', 'Apps', 'AI tools', 'Growth planner', 'Create skills from content', 'My space', 'Help & contact']) await expect(menu.getByRole('link', { name: label, exact: true })).toBeAttached();
    await page.keyboard.press('Escape'); await expect(trigger).toBeFocused(); await expect(menu).toHaveCount(0);
    await trigger.click(); await header.click({ position: { x: 4, y: 4 } }); await expect(menu).toHaveCount(0);
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 568 }); await trigger.click();
      const last = menu.getByRole('link', { name: 'Help & contact', exact: true }); await last.scrollIntoViewIfNeeded(); await expect(last).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.keyboard.press('Escape');
    }
    await trigger.click(); await menu.getByRole('link', { name: 'Create skills from content', exact: true }).click();
    await expect(page.getByTestId('intake-text')).toBeVisible(); await expect(menu).toHaveCount(0);
  });

  test(tag + "guest account exposes a real sign-in route and signed-in account can sign out", async ({ page }) => {
    await mockComposerAccount(page, false);
    await page.goto('/account');
    await page.getByTestId('account-page').getByRole('link', { name: 'Sign in', exact: true }).click();
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('fixture:redirect') || 'null'))).toMatchObject({ signInForceRedirectUrl: new URL('/account', page.url()).href });
    await page.evaluate(() => (window as any).__switchMindAccount('menu-owner'));
    await page.route('**/api/library', route => route.fulfill({ json: { data: {}, revision: 1 } }));
    await page.goto('/account');
    await expect(page.getByTestId('account-page').getByRole('button', { name: 'Sign out', exact: true })).toBeVisible();
    await page.getByTestId('menu-btn').click();
    await expect(page.getByTestId('site-menu').getByRole('link', { name: 'Sign in', exact: true })).toHaveCount(0);
    await page.getByTestId('site-menu').getByRole('button', { name: 'Sign out', exact: true }).click();
    await expect.poll(() => page.evaluate(() => sessionStorage.getItem('fixture:signout'))).toBe('called');
    await expect(page.getByTestId('account-page').getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
  });
}
