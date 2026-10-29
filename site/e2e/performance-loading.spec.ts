import {test, expect} from '@playwright/test';

for (const mobile of [false, true]) {
  test((mobile ? '@mobile ' : '') + 'minds browse in small batches while search, filters and council choices cover the full roster', async ({page, request}) => {
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    const roster = (await (await request.get('/data/minds-index.json')).json()).minds.roster;
    const requests: string[] = []; page.on('request', r => requests.push(new URL(r.url()).pathname));
    await page.goto('/minds');
    await expect(page.getByTestId('minds-page')).toBeVisible();
    await expect(page.getByTestId('mind-card')).toHaveCount(24);
    await page.getByTestId('show-more-minds').click();
    await expect(page.getByTestId('mind-card')).toHaveCount(48);
    const query = page.getByRole('searchbox', {name: 'Search minds', exact: true});
    const last = roster.at(-1);
    await query.fill(last.name);
    await expect(page.locator(`[data-testid="mind-card"][data-slug="${last.slug}"]`)).toBeVisible();
    await query.fill('Steve Jobs');
    const card = page.getByTestId('mind-card').filter({hasText: 'Steve Jobs'}).first();
    await expect(card).toBeVisible();
    await card.getByTestId('seat-mind').click();
    await expect(page.getByTestId('council-bar')).toContainText('Steve Jobs');
    await page.reload();
    await expect(page.getByTestId('council-bar')).toContainText('Steve Jobs');
    await page.getByTestId('minds-label-founder').click();
    await expect(page.getByTestId('minds-label-founder')).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', {name: 'Clear search and filters', exact: true}).click();
    await expect(page.getByTestId('mind-card')).toHaveCount(24);
    expect(requests).not.toContain('/data/blocks.json');
    expect(requests.some(p => /\/assets\/MyMinds-/.test(p))).toBe(false);
    await page.getByTestId('menu-btn').click();
    await expect(page.getByTestId('nav-minds')).toHaveAttribute('href', '/minds');
    await expect(page.getByTestId('nav-minds')).toHaveAttribute('aria-current', 'page');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', {name: 'Footer explore'}).getByRole('link', {name: 'Minds', exact: true})).toHaveAttribute('href', '/minds');
    await page.getByTestId('open-council').click();
    await expect(page.getByTestId('builder')).toBeVisible();
    await expect(page.getByTestId('flow-node').filter({hasText: 'Steve Jobs'})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
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
      expect(modules.some(p => /\/assets\/(?:AddToFlow|library-rank|library-search)-/.test(p))).toBe(false);
      // Reading and menus do not need the full catalogue. Only the editing control does.
      await page.locator("#root .bp-h1").click();
      expect(requested).toBe(false);
      await page.getByTestId('task-more').locator('summary').click();
      expect(requested).toBe(false);
      await page.getByTestId('add-to-workflow').click();
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

  test((mobile ? '@mobile ' : '') + 'a delayed skill editor keeps reading and cancellation available', async ({page}) => {
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    let release!: () => void, requested = false;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/assets/AddToFlow-*.js', async r => { requested = true; await held; await r.continue(); });
    try {
      await page.goto('/skills/voice-and-tone-guide-writer');
      await expect(page.getByTestId('skill-neighbours')).toBeVisible();
      expect(requested).toBe(false);
      await page.getByTestId('task-more').locator('summary').click();
      await page.getByTestId('add-to-workflow').click();
      await expect.poll(() => requested).toBe(true);
      const opening = page.getByRole('dialog', {name: 'Add to a workflow', exact: true});
      await expect(opening.getByRole('status')).toContainText('Opening your workflow choices');
      await opening.getByRole('button', {name: 'Close', exact: true}).click();
      await expect(opening).toHaveCount(0);
      await expect(page.getByTestId('skill-neighbours')).toBeVisible();
      release();
      await page.getByTestId('add-to-workflow').click();
      await expect(page.getByTestId('atf-new')).toBeVisible();
      await page.getByTestId('add-to-flow').getByRole('button', {name: 'Close', exact: true}).click();
      await expect(page.getByTestId('add-to-flow')).toHaveCount(0);
    } finally { release(); }
  });

  test((mobile ? '@mobile ' : '') + 'the menu retains keyboard focus, scrolling, theme and outside dismissal', async ({page}) => {
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    await page.goto('/skills/voice-and-tone-guide-writer');
    await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
    await page.evaluate(() => scrollTo({top: 600, behavior: 'instant'}));
    const trigger = page.getByTestId('menu-btn');
    await trigger.focus(); await trigger.press('Enter');
    const menu = page.getByTestId('site-menu');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', {name: 'Find a task', exact: true})).toBeFocused();
    const rect = await menu.boundingBox();
    expect(rect!.y).toBeGreaterThanOrEqual(64);
    expect(rect!.y + rect!.height).toBeLessThanOrEqual((page.viewportSize()!.height) + 1);
    await menu.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0); await expect(trigger).toBeFocused();
    await trigger.press('Enter');
    await page.locator('#root .bp-h1').click({force: true});
    await expect(menu).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
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

  test((mobile ? '@mobile ' : '') + 'large instruction previews retain full selection, scrolling and exact clipboard text', async ({page}) => {
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {value: {writeText: async (text: string) => { (window as any).__previewCopied = text; }}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    await page.goto('/skills/claude-app-builder');
    const block = page.getByTestId('copyable-task');
    await expect(page.getByTestId('copy-task-adapter')).toBeEnabled();
    await block.locator('details > summary').click();
    const pre = block.locator('pre');
    await pre.scrollIntoViewIfNeeded();
    const text = await pre.textContent();
    expect(text!.length).toBeGreaterThan(100000);
    const before = await pre.boundingBox();
    const scroll = await page.evaluate(() => scrollY);
    await pre.locator('.task-preview-chunk').last().scrollIntoViewIfNeeded();
    expect(Math.abs((await pre.boundingBox())!.height - before!.height)).toBeLessThan(1);
    expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThan(1);
    const selected = await pre.evaluate(el => {
      const range = document.createRange(); range.selectNodeContents(el);
      const selection = getSelection()!; selection.removeAllRanges(); selection.addRange(range);
      const text = selection.toString(); selection.removeAllRanges(); return text;
    });
    expect(selected).toBe(text);
    await page.getByTestId('copy-task-adapter').click();
    expect(await page.evaluate(() => (window as any).__previewCopied)).toBe(text);
    await expect(block.locator('summary')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
