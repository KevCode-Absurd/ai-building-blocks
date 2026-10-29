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
      await page.waitForTimeout(1000);
      expect(requested).toBe(false);
      // Start warming the full catalogue on real user intent, while the exact page stays usable.
      await page.locator("#root .bp-h1").click();
      await expect.poll(() => requested).toBe(true);
      expect(modules.some(p => /\/assets\/handoff-(?!core-)/.test(p))).toBe(false);
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
    expect(requests.some(p => /\/assets\/(?:MyMinds|DownloadDialog|ExecutionPrompt)-/.test(p))).toBe(false);
    expect(requests.some(p => /\/assets\/HomePage-/.test(p))).toBe(false);
    expect(requests.some(p => /\/assets\/composer-runtime-/.test(p))).toBe(false);
    const full = page.waitForResponse(r => new URL(r.url()).pathname === '/data/blocks.json' && r.ok());
    await page.getByTestId('compose-goal').fill('Review supplied meeting notes and list the agreed actions');
    await full;
    await expect(page.getByTestId('compose-goal')).toHaveValue('Review supplied meeting notes and list the agreed actions');
    await page.getByText('Customize: planner, minds and imports', {exact: true}).click();
    await expect(page.getByTestId('my-minds')).toBeVisible();
    expect(requests.some(p => /\/assets\/Builder-[^/]+\.(?:js|css)$/.test(p))).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test((mobile ? '@mobile ' : '') + 'typing survives a delayed workflow-tools download', async ({page}) => {
    await page.route('**/api/**', r => r.fulfill({json: {configured: false, enabled: true}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    let release!: () => void, requested = false;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/assets/composer-runtime-*.js', async r => { requested = true; await held; await r.continue(); });
    try {
      await page.goto('/compose');
      const goal = page.getByTestId('compose-goal');
      await expect(goal).toBeVisible();
      await goal.fill('Review my supplied meeting notes');
      await expect.poll(() => requested).toBe(true);
      await goal.fill('Review my supplied meeting notes and list agreed actions');
      await expect(goal).toHaveValue('Review my supplied meeting notes and list agreed actions');
      await goal.evaluate(el => { (window as any).__composerInput = el; });
      const tools = page.waitForResponse(r => /\/assets\/composer-runtime-[^/]+\.js$/.test(new URL(r.url()).pathname) && r.ok());
      release(); await tools;
      await expect(goal).toHaveValue('Review my supplied meeting notes and list agreed actions');
      expect(await goal.evaluate(el => el === (window as any).__composerInput)).toBe(true);
    } finally { release(); }
  });

  test((mobile ? '@mobile ' : '') + 'composer opening stays visible and keeps its position while the form loads', async ({page}) => {
    await page.route('**/api/**', r => r.fulfill({json: {configured: false, enabled: true}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/assets/ComposePage-*.js', async r => { await held; await r.continue(); });
    try {
      await page.goto('/compose', {waitUntil: 'domcontentloaded'});
      const heading = page.getByRole('heading', {name: 'Build a custom workflow', exact: true});
      await expect(heading).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
      await page.evaluate(() => document.fonts.ready);
      await heading.evaluate(el => { (window as any).__composerHeading = el; });
      const before = await heading.boundingBox();
      release();
      await expect(page.getByTestId('compose-goal')).toBeVisible();
      expect(await heading.evaluate(el => el === (window as any).__composerHeading)).toBe(true);
      const after = await heading.boundingBox();
      expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
      expect(Math.abs(after!.height - before!.height)).toBeLessThan(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    } finally { release(); }
  });
}
