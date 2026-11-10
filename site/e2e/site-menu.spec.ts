import { test, expect } from "@playwright/test";
import { mockComposerAccount } from "./fixtures/composer-account";

for (const tag of ["", "@mobile "]) {
  test(tag + "laptop header shows the main sections; the menu holds the rest and supports keyboard, outside close and small screens", async ({ page }) => {
    await mockComposerAccount(page, false);
    await page.goto('/apps');
    // The prerendered header is replaced once the app starts; press keys only after that.
    await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
    const header = page.locator('header.site-header'), trigger = page.getByTestId('menu-btn');
    const main = ['Find a task', 'Hire an AI specialist', 'Build a workflow', 'Tools', 'Minds'];
    const wide = (page.viewportSize()?.width ?? 0) >= 1000;
    for (const label of main) await expect(header.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label, exact: true })).toBeVisible({ visible: wide });
    await expect(trigger).toHaveText(wide ? /More/ : /Menu/);
    await trigger.focus(); await page.keyboard.press('Enter');
    const menu = page.getByTestId('site-menu');
    await expect(menu.getByRole('link').filter({ visible: true }).first()).toBeFocused();
    // The grouped menu reaches every main page; on a laptop the five in the header are left out of it.
    for (const label of ['My work', 'Account settings', 'Sign in', 'AI tool guides', 'AI help by business', 'Get a whole job done', 'Turn an article or video into a workflow', 'Turn a workflow into an app', 'Train your own AI agent', 'Plan an AI team', 'Connect your AI', 'Your me.md file', 'Team space', 'Skills, prompts and workflows', 'How it works', 'Documentation', 'Help & contact']) await expect(menu.getByRole('link', { name: label, exact: true })).toBeAttached();
    for (const label of main) await expect(menu.getByRole('link', { name: label, exact: true })).toHaveCount(wide ? 0 : 1);
    await page.keyboard.press('Escape'); await expect(trigger).toBeFocused(); await expect(menu).toHaveCount(0);
    await trigger.click(); await header.click({ position: { x: 4, y: 4 } }); await expect(menu).toHaveCount(0);
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 568 }); await trigger.click();
      const last = menu.getByRole('link', { name: 'Account settings', exact: true }); await last.scrollIntoViewIfNeeded(); await expect(last).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.keyboard.press('Escape');
    }
    await trigger.click(); await menu.getByRole('link', { name: 'Build a workflow', exact: true }).click();
    await expect(page.getByTestId('compose-page')).toBeVisible(); await expect(menu).toHaveCount(0);
    await trigger.click(); await menu.getByRole('link', { name: 'Turn an article or video into a workflow', exact: true }).click();
    await expect(page.getByTestId('intake-text')).toBeVisible(); await expect(menu).toHaveCount(0);
    await trigger.click(); await menu.getByRole('link', { name: 'Train your own AI agent', exact: true }).click();
    await expect(page).toHaveURL(/\/train-your-own-ai-agent$/); await expect(page.getByRole('heading', { level: 1 })).toContainText('train your own AI agent'); await expect(menu).toHaveCount(0);
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
