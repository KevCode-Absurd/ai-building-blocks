import {test,expect} from '@playwright/test';
import {serveBuiltSite} from './built-site-fixture';

test.beforeEach(async({page})=>{
 await serveBuiltSite(page);
 await page.route('**/api/auth*',r=>r.fulfill({json:{configured:false}}));
});

for(const tag of ['', '@mobile ']){
 test(tag+'format tabs lead and job functions still filter by link',async({page})=>{
  await page.goto('/#library');await expect(page.getByTestId('library-search')).toBeEnabled();
  for(const id of ['all','skill','prompt','workflow','agent','mind','specialists'])await expect(page.getByTestId('tab-'+id)).toBeVisible();
  for(const id of ['job-all','job-coding','filter-domain','filter-task','more-filters'])await expect(page.getByTestId(id)).toHaveCount(0);
  await page.goto('/?area=coding#library');await expect(page.getByTestId('result-count')).toContainText('Coding');
  for(const [id,name] of [['leadership','Leadership'],['science','Science and research'],['teaching','Education and training'],['thinking','Thinking'],['sales','Sales']]){
   await page.goto('/?area='+id+'#library');await expect(page.getByTestId('result-count')).toContainText('in '+name);
  }
  expect(new URL(page.url()).searchParams.get('area')).toBe('sales');
  await page.reload();await expect(page.getByTestId('result-count')).toContainText('in Sales');
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  expect(new URL(page.url()).searchParams.get('area')).toBeNull();
  await expect(page.getByTestId('result-count')).not.toContainText('in Sales');
 });

 test(tag+'logo stays the same over time and on hover',async({page})=>{
  await page.goto('/#library');await expect(page.getByTestId('library-search')).toBeEnabled();
  const logo=page.locator('.header [data-testid="logo"]');await expect(logo).toBeVisible();
  const before=await logo.innerHTML();expect(await logo.locator('rect').count()).toBeGreaterThan(20);
  await page.waitForTimeout(4300);await expect(logo).toHaveClass('logo');expect(await logo.innerHTML()).toBe(before);
  const opacity=await logo.locator('rect').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).opacity));
  await logo.hover();expect(await logo.locator('rect').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).opacity))).toEqual(opacity);
  expect(await logo.evaluate(n=>n.getAnimations({subtree:true}).length)).toBe(0);
 });
}

test('@mobile the simplified library fits small screens and leaves search available',async({page})=>{
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});await page.goto('/?q=AEO#library');await page.reload();
  await expect(page.getByTestId('library-search')).toHaveValue('AEO');
  for(const id of ['filter-domain','filter-task','more-filters'])await expect(page.getByTestId(id)).toHaveCount(0);
  await expect(page.getByTestId('tab-all')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.getByTestId('library-search').scrollIntoViewIfNeeded();
  await page.screenshot({path:test.info().outputPath('library-'+width+'.png')});
 }
});
