import {test, expect} from '@playwright/test';

for (const mobile of [false, true]) {
  test((mobile ? '@mobile ' : '') + 'skill content and existing recommendations work while the full catalogue is held', async ({page}) => {
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    const modules: string[] = []; page.on('request', r => modules.push(new URL(r.url()).pathname));
    let release!: () => void, requested = false;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/data/blocks.json', async r => { requested = true; await held; await r.continue(); });
    try {
      await page.goto('/skills/voice-and-tone-guide-writer');
      await expect(page.getByTestId('skill-neighbours')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
      await expect.poll(() => requested).toBe(true);
      expect(modules.some(p => /\/assets\/handoff-/.test(p))).toBe(false);
      const before = await page.getByTestId('skill-neighbours').innerText();
      await page.locator('#root .bp-h1').evaluate(el => { (window as any).__firstSkillHeading = el; });
      const full = page.waitForResponse(r => new URL(r.url()).pathname === '/data/blocks.json' && r.ok());
      release(); await full;
      await expect.poll(() => page.getByTestId('skill-neighbours').innerText()).toBe(before);
      expect(await page.locator('#root .bp-h1').evaluate(el => el === (window as any).__firstSkillHeading)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    } finally { release(); }
  });

  test((mobile ? '@mobile ' : '') + 'fresh planner defers the full library and canvas until they are needed', async ({page}) => {
    await page.route('**/api/**', r => r.fulfill({json: {configured: false, enabled: true}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    const requests: string[] = []; page.on('request', r => requests.push(new URL(r.url()).pathname));
    await page.goto('/compose');
    await expect(page.getByTestId('compose-goal')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
    await page.waitForTimeout(1600);
    expect(requests).not.toContain('/data/blocks.json');
    expect(requests.some(p => /\/assets\/Builder-[^/]+\.(?:js|css)$/.test(p))).toBe(false);
    expect(requests.some(p => /\/assets\/handoff-/.test(p))).toBe(false);
    const full = page.waitForResponse(r => new URL(r.url()).pathname === '/data/blocks.json' && r.ok());
    await page.getByTestId('compose-goal').fill('Review supplied meeting notes and list the agreed actions');
    await full;
    await expect(page.getByTestId('compose-goal')).toHaveValue('Review supplied meeting notes and list the agreed actions');
    expect(requests.some(p => /\/assets\/Builder-[^/]+\.(?:js|css)$/.test(p))).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
