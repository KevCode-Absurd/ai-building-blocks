import {test,expect} from '@playwright/test';
import {serveBuiltSite} from './built-site-fixture';

test.beforeEach(async({page})=>{
 await serveBuiltSite(page);
 await page.route('**/api/auth*',r=>r.fulfill({json:{configured:false}}));
});

for(const tag of ['', '@mobile ']){
 test(tag+'common jobs and the complete list remain visible',async({page})=>{
  await page.goto('/#library');await expect(page.getByTestId('library-search')).toBeEnabled();
  for(const id of ['all','coding','marketing','design','writing','business','finance','sales','operations'])await expect(page.getByTestId('job-'+id)).toBeVisible();
  await expect(page.getByTestId('filter-domain')).toBeVisible();
  await expect(page.getByTestId('filter-task')).toBeVisible();
  await page.getByTestId('job-coding').click();await expect(page.getByTestId('result-count')).toContainText('Coding');
  await page.getByTestId('more-filters').click();
  await expect(page.getByTestId('filter-domain')).toBeVisible();
  await page.getByTestId('filter-domain').click();
  for(const name of ['Sales','Leadership','Science and research','Education and training','Thinking'])await expect(page.getByRole('option',{name:new RegExp('^'+name)})).toBeAttached();
  await page.getByRole('option',{name:/^Sales/}).click();
  await expect(page.getByTestId('result-count')).toContainText('Sales');
  expect(new URL(page.url()).searchParams.get('area')).toBe('sales');
  await page.getByTestId('more-filters').click();
  await page.reload();await expect(page.getByTestId('more-filters')).toHaveAttribute('aria-expanded','false');
  await expect(page.getByTestId('filter-domain')).toContainText('Sales');
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await expect(page.getByTestId('job-all')).toHaveAttribute('aria-pressed','true');
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

test('@mobile More filters fits small screens and leaves search/use case available',async({page})=>{
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});await page.goto('/?q=AEO#library');await page.reload();
  await expect(page.getByTestId('library-search')).toHaveValue('AEO');
  await expect(page.getByTestId('filter-domain')).toBeVisible();
  await page.getByTestId('more-filters').click();await page.getByTestId('filter-domain').click();
  await expect(page.getByRole('listbox',{name:'Job function',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.keyboard.press('Escape');await expect(page.getByTestId('filter-task')).toBeVisible();
  await page.getByTestId('library-search').scrollIntoViewIfNeeded();
  await page.screenshot({path:test.info().outputPath('library-'+width+'.png')});
 }
});
