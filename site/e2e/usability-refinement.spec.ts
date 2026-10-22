import {test,expect} from './fixtures/staging-aware-test';

const cards=(page:any)=>page.getByTestId('block-card');

test('library shows sixteen cards until Show more is clicked and the builder stays reachable',async({page})=>{
 await page.goto('/');
 await expect(cards(page)).toHaveCount(16);
 await expect(page.getByTestId('library-search')).toHaveAttribute('placeholder',/Search for a job/);
 await page.locator('.library-builder-link').click();
 await expect(page.getByTestId('builder')).toBeInViewport();
 await page.waitForTimeout(1200);
 await expect(cards(page)).toHaveCount(16);
 await page.getByTestId('show-more').click();
 await expect(cards(page)).toHaveCount(32);
 await page.getByTestId('library-search').fill('Ad claim proof gap finder');
 await expect(cards(page).first()).toContainText('Ad claims checker');
});

test('a manual scroll cancels the library anchor correction',async({page})=>{
 await page.goto('/');await expect(cards(page)).toHaveCount(16);
 await page.locator('.nav').getByRole('link',{name:'Library',exact:true}).click();
 await expect(page.locator('#library')).toBeInViewport();
 await page.mouse.wheel(0,-2500);
 await page.waitForTimeout(1600);
 expect(await page.evaluate(()=>scrollY)).toBeLessThan(150);
});

test('renamed jobs keep stable pages and readable card actions',async({page})=>{
 await page.goto('/');
 for(const [slug,title] of [['landing-page-30-point-checker','Landing page audit'],['website-brand-brain-builder','Brand profile builder'],['ad-claim-proof-gap-finder','Ad claims checker'],['ad-opening-line-batch-writer','Ad hook writer']]){
  const card=page.locator(`[data-testid="block-card"][data-slug="${slug}"]`);
  await expect(card).toContainText(title);
  const view=await card.locator('.view').innerText();await card.hover();await expect(card.locator('.view')).toHaveText(view);
 }
 await page.goto('/prompts/landing-page-30-point-checker');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Landing page audit');
 await expect(page.locator('.bp-sub')).toContainText('30 checks');
});

test('minds explain the council and separate profile navigation from seating',async({page})=>{
 await page.goto('/minds');
 await expect(page.getByTestId('council-guide')).toContainText('strongest disagreement');
 await expect(page.getByTestId('council-guide')).toContainText('HANDOFF.md');
 await expect(page.locator('.mind-years')).toHaveCount(0);
 const card=page.locator('[data-testid="mind-card"][data-slug="charlie-munger"]');
 await card.getByTestId('seat-mind').click();
 await expect(page).toHaveURL(/\/minds$/);
 await expect(card.getByTestId('seat-mind')).toHaveAttribute('aria-pressed','true');
 await card.click({position:{x:8,y:8}});
 await expect(page).toHaveURL(/\/minds\/charlie-munger$/);
});

test('tools can be searched and narrowed by a useful topic',async({page})=>{
 await page.goto('/tools');
 await page.getByTestId('tools-search').fill('ad');
 await page.getByRole('button',{name:'Ads',exact:true}).click();
 await expect(page.getByTestId('tool-card').first()).toBeVisible();
 await page.getByTestId('tools-search').fill('page test');
 await expect(page.getByTestId('tool-card')).toHaveCount(1);
 await page.reload();
 await expect(page.getByTestId('tools-search')).toHaveValue('page test');
 await page.getByTestId('tools-search').fill('zzzz unknown');
 await expect(page.getByText('No tools match.')).toBeVisible();
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.getByTestId('tool-card')).toHaveCount(36);
});

test('software path explains the live app boundary and links to the starter',async({page})=>{
 await page.goto('/apps');
 const guide=page.locator('#workflow-to-app');
 await expect(guide).toContainText('workflow.json');
 await expect(guide).toContainText('saved tour');
 await guide.getByRole('link',{name:'Build your app',exact:true}).click();
 await expect(page).toHaveURL(/apps\/starter-pack/);
});

test('@mobile council cards and long workflow labels fit and stay readable',async({page})=>{
 await page.goto('/?kind=workflow&q=council#library');
 await expect(cards(page).first()).toBeVisible();
 const overflow=await cards(page).evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+1).length);
 expect(overflow).toBe(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.goto('/minds');
 await expect(page.getByTestId('council-guide')).toBeVisible();
 const card=page.getByTestId('mind-card').filter({has:page.getByRole('button',{name:'Seat on council',exact:true})}).first();
 await card.getByTestId('seat-mind').click();
 await expect(page.getByTestId('council-bar')).toContainText('Your council');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.getByTestId('open-council').click();
 await expect(page.getByTestId('builder')).toBeVisible();
});
