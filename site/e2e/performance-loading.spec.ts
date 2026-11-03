import {test, expect} from '@playwright/test';

for (const mobile of [false, true]) {
 test((mobile ? '@mobile ' : '') + 'home intro uses its brand font before app startup even when the full fonts are delayed', async ({page}) => {
  if (mobile) await page.setViewportSize({width: 412, height: 823});
  await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
  let releaseEntry!: () => void, releaseFonts!: () => void;
  const entry = new Promise<void>(resolve => { releaseEntry = resolve; });
  const fonts = new Promise<void>(resolve => { releaseFonts = resolve; });
  await page.route(/\/assets\/main-[^/]+\.js$/, async r => { await entry; await r.continue(); });
  await page.route(/\/fonts\/(?:jetbrains-mono|space-grotesk)\.woff2$/, async r => { await fonts; await r.continue(); });
  await page.addInitScript(() => {
   (window as any).__introPaints = [];
   new PerformanceObserver(list => { for (const e of list.getEntries()) if ((e as any).element?.textContent?.startsWith('Type what you need done.')) (window as any).__introPaints.push(e.startTime); }).observe({type: 'largest-contentful-paint', buffered: true});
  });
  try {
   await page.goto('/', {waitUntil: 'domcontentloaded'});
   const intro = page.locator('#app-loader .hero .lede'); await expect(intro).toBeVisible();
   await expect.poll(() => page.evaluate(() => [...document.fonts].some(face => face.family === 'AI Blocks Intro Mono' && face.status === 'loaded'))).toBe(true);
   const cdp = await page.context().newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
   const doc = await cdp.send('DOM.getDocument'), node = await cdp.send('DOM.querySelector', {nodeId: doc.root.nodeId, selector: '#app-loader .hero .lede'});
   const actual = await cdp.send('CSS.getPlatformFontsForNode', {nodeId: node.nodeId});
   expect(actual.fonts.some(face => face.familyName === 'AI Blocks Intro Mono' && face.isCustomFont)).toBe(true);
   await intro.evaluate(el => { (window as any).__introBeforeApp = el; });
   const box = await intro.boundingBox();
   await page.waitForTimeout(200); const paints = await page.evaluate(() => (window as any).__introPaints);
   releaseEntry(); await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
   const live = page.locator('#root .hero .lede');
   releaseFonts(); await page.evaluate(() => document.fonts.ready);
   expect(await live.evaluate(el => el === (window as any).__introBeforeApp)).toBe(true);
   expect(Math.abs((await live.boundingBox())!.y - box!.y)).toBeLessThan(1);
   await page.waitForTimeout(250);
   expect(await page.evaluate(() => (window as any).__introPaints)).toEqual(paints);
   expect(await live.evaluate(el => getComputedStyle(el).fontFamily)).toContain('AI Blocks Intro Mono');
   await page.getByTestId('menu-btn').click(); await expect(page.getByTestId('menu-btn')).toHaveAttribute('aria-expanded', 'true');
   expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  } finally { releaseEntry(); releaseFonts(); }
 });
}

for (const mobile of [false, true]) {
 test((mobile ? '@mobile ' : '') + 'Minds cards work before decorative portraits paint and keep their position afterwards', async ({page}) => {
  if (mobile) await page.setViewportSize({width: 412, height: 823});
  await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
  await page.addInitScript(() => {
   let next = 0;
   const pending = new Map<number, IdleRequestCallback>();
   window.requestIdleCallback = callback => { pending.set(++next, callback); return next; };
   window.cancelIdleCallback = id => { pending.delete(id); };
   (window as any).__paintIdle = () => {
    const batch = [...pending.values()]; pending.clear();
    for (const callback of batch) callback({didTimeout: false, timeRemaining: () => 10});
   };
  });
  await page.goto('/minds', {waitUntil: 'domcontentloaded'});
  const wall = page.getByTestId('face-wall'), cards = page.getByTestId('mind-card'), search = page.getByRole('searchbox', {name: 'Search minds'});
  await expect(cards).toHaveCount(24); await expect(search).toBeVisible();
  await expect(wall.locator('svg')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  const before = await search.evaluate(el => el.getBoundingClientRect().top + scrollY);
  expect((await wall.boundingBox())!.height).toBe(mobile ? 48 : 72);
  const seat = page.getByTestId('seat-mind').first();
  await seat.click(); await expect(seat).toHaveAttribute('aria-pressed', 'true');
  for (let batch = 0; batch < 12; batch++) {
   await page.evaluate(() => (window as any).__paintIdle());
   await page.waitForTimeout(35);
  }
  const expected = await wall.evaluate(el => Math.floor(el.clientWidth / 24) * Math.ceil(el.clientHeight / 24));
  await expect(wall.locator('svg')).toHaveCount(expected);
  expect(Math.abs(await search.evaluate(el => el.getBoundingClientRect().top + scrollY) - before)).toBeLessThan(1);
  await expect(cards).toHaveCount(24); await expect(seat).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
 });
}

for(const mobile of [false,true]){
 test((mobile?'@mobile ':'')+'public skill header opens before its item download and stays mounted when data arrives',async({page})=>{
  if(mobile)await page.setViewportSize({width:412,height:823});
  await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'Local read-only fixture'}}));
  let release!:()=>void;const item=new Promise<void>(resolve=>{release=resolve;});
  await page.route('**/data/items/voice-and-tone-guide-writer.json',async r=>{await item;await r.continue();});
  try{
   await page.goto('/skills/voice-and-tone-guide-writer',{waitUntil:'domcontentloaded'});
   await expect(page.locator('#abb-item-opening')).toHaveCount(1);
   const opening=page.getByTestId('block-opening'),heading=opening.getByRole('heading',{level:1});
   await expect(opening).toBeVisible();await expect(page.locator('html')).toHaveAttribute('data-boot','ready');
   await expect(page.getByText('Opening the task controls…',{exact:true})).toBeVisible();
   await expect(page.getByTestId('skill-neighbours')).toHaveCount(0);
   await page.evaluate(()=>document.fonts.ready);
   const before=await opening.boundingBox(),copy=await opening.innerText();
   await heading.evaluate(el=>{(window as any).__earlySkillHeading=el;});
   await page.getByTestId('menu-btn').click();await expect(page.getByTestId('menu-btn')).toHaveAttribute('aria-expanded','true');
   await page.keyboard.press('Escape');release();
   await expect(page.getByTestId('skill-neighbours')).toBeVisible();
   expect(await opening.innerText()).toBe(copy);
   expect(await heading.evaluate(el=>el===(window as any).__earlySkillHeading)).toBe(true);
   expect(Math.abs((await opening.boundingBox())!.height-before!.height)).toBeLessThan(1);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  }finally{release();}
 });
 test((mobile?'@mobile ':'')+'skill opening remains readable and keeps the same heading while task controls download',async({page})=>{
  if(mobile)await page.setViewportSize({width:412,height:823});
  await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'Local read-only fixture'}}));
  await page.addInitScript(()=>{(window as any).__openingShifts=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!(entry as any).hadRecentInput)(window as any).__openingShifts+=(entry as any).value;}).observe({type:'layout-shift',buffered:true});});
  let release!:()=>void;const body=new Promise<void>(resolve=>{release=resolve;});
  await page.route(/\/assets\/BlockPage-[^/]+\.js$/,async r=>{await body;await r.continue();});
  const requests:string[]=[];page.on('request',r=>requests.push(new URL(r.url()).pathname));
  try{
   await page.goto('/skills/voice-and-tone-guide-writer',{waitUntil:'domcontentloaded'});
   const opening=page.getByTestId('block-opening'),heading=opening.getByRole('heading',{level:1});
   await expect(opening).toBeVisible();await expect(page.locator('html')).toHaveAttribute('data-boot','ready');
   await expect(page.getByRole('status').filter({hasText:'Opening the task controls…'})).toBeVisible();
   await page.evaluate(()=>document.fonts.ready);await heading.evaluate(el=>{(window as any).__skillHeading=el;});
   const footer=page.locator('#root footer');await expect(footer).toHaveCount(1);
   expect(await footer.evaluate(el=>el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(await page.evaluate(()=>innerHeight));
   const before=await opening.boundingBox();release();
   await expect(page.getByTestId('skill-neighbours')).toBeVisible();
   await page.waitForTimeout(250);
   expect(await page.evaluate(()=>(window as any).__openingShifts)).toBeLessThan(.02);
   expect(await heading.evaluate(el=>el===(window as any).__skillHeading)).toBe(true);
   const after=await opening.boundingBox();expect(Math.abs(before!.height-after!.height)).toBeLessThan(1);
   await expect(page.getByTestId('block-page').getByRole('heading',{level:1})).toHaveCount(1);
   expect(requests).not.toContain('/data/blocks.json');expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  }finally{release();}
 });
}

for (const mobile of [false, true]) {
  test((mobile ? '@mobile ' : '') + 'home keeps its original introduction through startup, interaction and navigation', async ({page}) => {
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route(/\/assets\/main-[^/]+\.js$/, async r => { await held; await r.continue(); });
    try {
      await page.goto('/', {waitUntil: 'domcontentloaded'});
      const intro = page.locator('#app-loader .hero .lede');
      await expect(intro).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await intro.evaluate(el => { (window as any).__firstHomeIntro = el; });
      const before = await intro.boundingBox();
      release();
      await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
      const live = page.locator('#root .hero .lede');
      await expect(live).toBeVisible();
      expect(await live.evaluate(el => el === (window as any).__firstHomeIntro)).toBe(true);
      const after = await live.boundingBox();
      expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
      expect(Math.abs(after!.height - before!.height)).toBeLessThan(1);
      await page.waitForTimeout(1800);
      expect(await live.evaluate(el => el === (window as any).__firstHomeIntro)).toBe(true);
      await page.locator('#root .hero-goal').getByRole('button', {name: 'Find help'}).click();
      await expect(page.getByTestId('library-search')).toBeFocused();
      await page.getByTestId('hero-connect').getByRole('link').click();
      await expect(page).toHaveURL(/\/api-and-mcp$/);
      await page.getByRole('link', {name: 'AI Blocks, home', exact: true}).click();
      await expect(page.locator('#root .hero .lede')).toBeVisible();
      await expect(page.locator('#root .hero h1')).toHaveCount(1);
      await expect(page.getByTestId('hero-connect')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    } finally { release(); }
  });

  test((mobile ? '@mobile ' : '') + 'home keeps its readable opening and menu while full styles are delayed', async ({page}) => {
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route(/\/assets\/main-[^/]+\.css$/, async r => { await held; await r.continue(); });
    try {
      await page.goto('/', {waitUntil: 'domcontentloaded'});
      await page.locator('#root [data-home-hero-host]').waitFor({state: 'attached'});
      const intro = page.locator('#app-loader .hero .lede');
      await expect(intro).toBeVisible();
      await intro.evaluate(el => { (window as any).__styleHeldIntro = el; });
      await page.locator('#app-loader [data-testid="menu-btn"]').click();
      await expect(page.locator('#app-loader [data-testid="menu-btn"]')).toHaveAttribute('aria-expanded', 'true');
      release();
      await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
      expect(await page.locator('#root .hero .lede').evaluate(el => el === (window as any).__styleHeldIntro)).toBe(true);
      await expect(page.locator('#root [data-testid="menu-btn"]')).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(page.locator('#root [data-testid="menu-btn"]')).toHaveAttribute('aria-expanded', 'false');
    } finally { release(); }
  });

  test((mobile ? '@mobile ' : '') + 'home retains readable text and recovery links after a full stylesheet failure', async ({page}) => {
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    await page.route(/\/assets\/main-[^/]+\.css$/, r => r.abort());
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await expect(page.locator('html')).toHaveAttribute('data-boot', 'error');
    await expect(page.locator('#app-loader .hero .lede')).toBeVisible();
    await expect(page.locator('#app-loader .boot-recovery').getByRole('link', {name: 'Try again', exact: true})).toBeVisible();
    await expect(page.locator('#root')).toBeHidden();
  });

  test((mobile ? '@mobile ' : '') + 'skill body keeps its place when Suspense reattaches downloaded controls', async ({page}) => {
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    await page.addInitScript(() => {
      (window as any).__bodyHandoffPositions = [];
      const capture = () => {
        const body = document.querySelector('[data-testid="block-body"]'), header = document.querySelector('[data-testid="block-opening"]');
        if (body && header && document.documentElement.dataset.boot === 'ready') {
          (window as any).__bodyHandoffPositions.push({body: body.getBoundingClientRect().top, header: header.getBoundingClientRect().bottom});
        }
      };
      new MutationObserver(capture).observe(document, {childList: true, subtree: true});
    });
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route(/\/assets\/BlockPage-[^/]+\.js$/, async r => { await held; await r.continue(); });
    try {
      await page.goto('/skills/voice-and-tone-guide-writer', {waitUntil: 'domcontentloaded'});
      await expect(page.getByText('Opening the task controls…', {exact: true})).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      release();
      await expect(page.getByTestId('skill-neighbours')).toBeVisible();
      const positions = await page.evaluate(() => (window as any).__bodyHandoffPositions as {body: number; header: number}[]);
      expect(positions.length).toBeGreaterThan(0);
      expect(positions.every(p => Math.abs(p.body - p.header) < 1)).toBe(true);
      await expect(page.getByText('Opening the task controls…', {exact: true})).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    } finally { release(); }
  });

  test((mobile ? '@mobile ' : '') + 'Minds opens real content before the full data and preserves searches through delayed downloads', async ({page, request}) => {
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    const roster = (await (await request.get('/data/minds-index.json')).json()).minds.roster;
    let releaseStarter!: () => void, releaseFull!: () => void, releaseStyles!: () => void, fullRequested = false, stylesRequested = false;
    const starter = new Promise<void>(resolve => { releaseStarter = resolve; });
    const full = new Promise<void>(resolve => { releaseFull = resolve; });
    const styles = new Promise<void>(resolve => { releaseStyles = resolve; });
    await page.route('**/data/minds-starter.json', async r => { await starter; await r.continue(); });
    await page.route('**/data/minds-index.json', async r => { fullRequested = true; await full; await r.continue(); });
    await page.route(/\/assets\/MindsPage-[^/]+\.css(?:\?.*)?$/, async r => { stylesRequested = true; await styles; await r.continue(); });
    try {
      await page.goto('/minds', {waitUntil: 'domcontentloaded'});
      const heading = page.getByRole('heading', {name: 'Borrow a great mind', exact: true});
      await expect(heading).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
      await page.evaluate(() => document.fonts.ready);
      await expect.poll(() => stylesRequested).toBe(true);
      await heading.evaluate(el => { (window as any).__mindsHeading = el; });
      const before = await heading.boundingBox();
      const opening = page.locator('.minds-opening'), openingBefore = await opening.boundingBox();
      releaseStyles();
      releaseStarter();
      await expect(page.getByTestId('mind-card')).toHaveCount(24);
      expect(await heading.evaluate(el => el === (window as any).__mindsHeading)).toBe(true);
      expect(Math.abs((await heading.boundingBox())!.y - before!.y)).toBeLessThan(1);
      const openingAfter = await opening.boundingBox();
      expect(Math.abs(openingAfter!.y - openingBefore!.y)).toBeLessThan(1);
      expect(Math.abs(openingAfter!.height - openingBefore!.height)).toBeLessThan(1);
      const query = page.getByRole('searchbox', {name: 'Search minds', exact: true});
      await query.fill(roster.at(-1).name);
      await expect.poll(() => fullRequested).toBe(true);
      await expect(page.getByRole('status').filter({hasText: 'Searching all minds…'})).toBeVisible();
      await expect(page.getByText('No minds match this search.', {exact: false})).toHaveCount(0);
      await query.evaluate(el => { (window as any).__mindsInput = el; });
      releaseFull();
      await expect(page.locator(`[data-testid="mind-card"][data-slug="${roster.at(-1).slug}"]`)).toBeVisible();
      await expect(query).toHaveValue(roster.at(-1).name);
      expect(await query.evaluate(el => el === (window as any).__mindsInput)).toBe(true);
      expect(await heading.evaluate(el => el === (window as any).__mindsHeading)).toBe(true);
    } finally { releaseStyles(); releaseStarter(); releaseFull(); }
  });
  test((mobile ? '@mobile ' : '') + 'minds browse in small batches while search, filters and council choices cover the full roster', async ({page, request}) => {
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    const roster = (await (await request.get('/data/minds-index.json')).json()).minds.roster;
    const requests: string[] = []; page.on('request', r => requests.push(new URL(r.url()).pathname));
    const searchWorkers: string[] = []; page.on('worker', worker => { if (/library-search-worker/.test(worker.url())) searchWorkers.push(worker.url()); });
    await page.goto('/minds');
    await expect(page.getByTestId('minds-page')).toBeVisible();
    await expect(page.getByTestId('mind-card')).toHaveCount(24);
    // Untouched browsing must not prepare metadata or start a search worker,
    // including after fetching the full roster to show the next batch.
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect(searchWorkers).toEqual([]);
    expect(requests).not.toContain('/data/library-search.json');
    await page.getByTestId('show-more-minds').click();
    await expect(page.getByTestId('mind-card')).toHaveCount(48);
    expect(searchWorkers).toEqual([]);
    expect(requests).not.toContain('/data/library-search.json');
    const query = page.getByRole('searchbox', {name: 'Search minds', exact: true});
    const last = roster.at(-1);
    await query.fill(last.name);
    await expect(page.locator(`[data-testid="mind-card"][data-slug="${last.slug}"]`)).toBeVisible();
    await expect.poll(() => searchWorkers.length).toBeGreaterThan(0);
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
    await page.getByText('More options: plan type, minds and imports', {exact: true}).click();
    await expect(page.getByTestId('my-minds')).toBeVisible();
    expect(requests.some(p => /\/assets\/Builder-[^/]+\.(?:js|css)$/.test(p))).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test((mobile ? '@mobile ' : '') + 'sign-in, account, community and calculator pages open without the full catalogue', async ({page}) => {
    await page.route('**/api/**', r => r.fulfill({status: 401, json: {error: 'Local read-only fixture'}}));
    if (mobile) await page.setViewportSize({width: 412, height: 823});
    const catalogue: string[] = [];
    page.on('request', r => { const p = new URL(r.url()).pathname; if (/^\/data\/blocks\.json$|^\/assets\/blocks-[0-9a-f]+\.json$/.test(p)) catalogue.push(p); });
    await page.goto('/sign-in');
    await expect(page.getByTestId('account-welcome')).toBeVisible();
    await page.goto('/account');
    await expect(page.getByTestId('account-page')).toBeVisible();
    await page.goto('/community');
    await expect(page.getByRole('heading', {level: 1})).toBeVisible();
    await page.goto('/tools/order-margin');
    await expect(page.getByTestId('tool-page')).toBeVisible();
    // Next steps still name their library items, resolved when the site was built.
    const next = page.getByTestId('next-step').getByRole('link').first();
    await expect(next).toHaveAttribute('href', /^\/(skills|prompts|workflows|agents)\/[a-z0-9-]+$/);
    await expect(next).not.toHaveText('');
    await expect(page.locator('html')).toHaveAttribute('data-boot', 'ready');
    await page.waitForTimeout(1200);
    expect(catalogue).toEqual([]);
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
      const heading = page.getByRole('heading', {name: 'Plan a job', exact: true});
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

for(const mobile of [false,true]){
 test((mobile?'@mobile ':'')+'base specialist stays usable while optional task setup is delayed',async({page})=>{
  if(mobile)await page.setViewportSize({width:390,height:844});
  await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'Local read-only fixture'}}));
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as any).__specialistCopied=text;}}}));
  let release!:()=>void;const held=new Promise<void>(r=>{release=r;});const requested:string[]=[],fullProfiles:string[]=[];
  page.on('request',r=>{if(/RoleTaskSetup/.test(r.url()))requested.push(r.url());if(new URL(r.url()).pathname==='/data/roles/coding-specialist.json')fullProfiles.push(r.url());});
  await page.route(/(?:\/assets\/RoleTaskSetup-[^/]+\.js|\/src\/roles\/RoleTaskSetup\.tsx)/,async r=>{await held;await r.continue();});
  try{
   await page.goto('/roles/coding-specialist');await expect(page.getByTestId('base-specialist-copy')).toBeVisible();expect(requested).toEqual([]);expect(fullProfiles).toEqual([]);
   await page.getByText('Add task context before downloading (optional)',{exact:true}).click();await expect(page.getByRole('status').filter({hasText:'Opening task setup…'})).toBeVisible();
   await page.getByTestId('base-specialist-copy').click();expect(await page.evaluate(()=>(window as any).__specialistCopied)).toContain('"role_id":"coding-specialist"');
   await expect(page.getByTestId('base-specialist-download')).toBeEnabled();release();await expect(page.getByTestId('role-goal')).toBeVisible();expect(fullProfiles).toHaveLength(1);
   await page.getByTestId('role-goal').fill('Fix the supplied bug and return the code changes.');
   await page.getByText('Add task context before downloading (optional)',{exact:true}).click();await page.getByText('Add task context before downloading (optional)',{exact:true}).click();
   await expect(page.getByTestId('role-goal')).toHaveValue('Fix the supplied bug and return the code changes.');
  }finally{release();}
 });
 test((mobile?'@mobile ':'')+'a still globe keeps its bitmap until its size actually changes',async({page})=>{
  if(mobile)await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'Local read-only fixture'}}));
  await page.addInitScript(()=>{(window as any).__globeClears=0;const clear=CanvasRenderingContext2D.prototype.clearRect;CanvasRenderingContext2D.prototype.clearRect=function(x,y,w,h){if(this.canvas.classList.contains('globe'))(window as any).__globeClears++;return clear.call(this,x,y,w,h);};});
  await page.route(/(?:\/assets\/Globe-[^/]+\.js|\/src\/Globe\.tsx)/,async r=>{await page.evaluate(()=>document.fonts.ready);await r.continue();});
  await page.goto('/');await expect(page.getByTestId('globe')).toBeVisible();await expect.poll(()=>page.evaluate(()=>(window as any).__globeClears)).toBe(1);
  await page.waitForTimeout(180);expect(await page.evaluate(()=>(window as any).__globeClears)).toBe(1);
  await page.setViewportSize({width:mobile?420:1380,height:mobile?844:900});await expect.poll(()=>page.evaluate(()=>(window as any).__globeClears)).toBeGreaterThan(1);
 });
}
