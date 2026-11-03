import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
 await page.route('**/api/auth*',r=>r.fulfill({json:{configured:false}}));
 await page.route('**/api/comments*',r=>r.fulfill({json:{enabled:false,comments:[]}}));
});

for(const tag of ['', '@mobile ']){
 test(tag+'clear search keeps selected filters and returns keyboard focus',async({page})=>{
  await page.goto('/?q=AEO&kind=skill&area=marketing#library');
  const input=page.getByTestId('library-search');
  await expect(input).toHaveValue('AEO');
  await page.getByRole('button',{name:'Clear search',exact:true}).click();
  await expect(input).toHaveValue('');await expect(input).toBeFocused();
  await expect(page.getByTestId('tab-skill')).toHaveAttribute('aria-selected','true');
  expect(new URL(page.url()).searchParams.get('area')).toBe('marketing');
  await expect(page.getByTestId('result-count')).toContainText('in Marketing');
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  await expect(page.getByTestId('result-count')).toHaveAttribute('role','status');
 });

 test(tag+'task return survives questions, reload, and browser back/forward',async({page})=>{
  await page.goto('/?q=AEO&kind=skill&area=marketing#library');
  await expect(page.getByTestId('result-count')).not.toHaveText('0 results');
  const target=page.locator('#library [data-testid="block-card"]').first();
  await target.click();await expect(page.locator('main h1')).toBeVisible();
  if(await page.locator('.bp-toc summary').isVisible()){
   await page.locator('.bp-toc summary').click();await page.getByTestId('toc-comments').click();
  }else await page.getByRole('button',{name:'Questions and comments',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Questions and comments',exact:true});
  await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:'Close',exact:true}).click();
  await page.reload();
  await page.getByRole('link',{name:'Back to results',exact:true}).click();
  await expect(page.getByTestId('library-search')).toHaveValue('AEO');
  await expect(page.getByTestId('tab-skill')).toHaveAttribute('aria-selected','true');
  expect(new URL(page.url()).searchParams.get('area')).toBe('marketing');
  await page.goBack();await expect(page.locator('main h1')).toBeVisible();
  await page.goForward();await expect(page.getByTestId('library-search')).toHaveValue('AEO');
 });

 test(tag+'direct task links reject an untrusted return address',async({page})=>{
  await page.goto('/skills/ai-search-audit');
  await expect(page.locator('main h1')).toBeVisible();
  await page.evaluate(()=>history.replaceState({abbLibraryReturn:'https://example.org/?q=outside'},'',location.href));
  await page.reload();
  await expect(page.getByRole('link',{name:'Back to results',exact:true})).toHaveAttribute('href','/#library');
 });

 test(tag+'ordinary AI-answer wording finds relevant methods and empty searches can recover',async({page})=>{
  await page.goto('/?q=show+up+in+AI+answers#library');
  await expect(page.locator('#library [data-testid="block-card"]').filter({hasText:'AI search audit'})).toBeVisible();
  // The useful metadata match must be visible above within the normal 5s.
  // Cold full-body shards load independently and have a 15s network deadline.
  await expect(page.getByText('Searching full instructions…',{exact:true})).toHaveCount(0,{timeout:20000});
  await page.getByTestId('tab-skill').click();
  await page.getByTestId('library-search').fill('zzzz-no-such-task');
  await expect(page.getByText("We couldn't find that task",{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Search again without filters',exact:true}).click();
  await expect(page.getByTestId('library-search')).toHaveValue('zzzz-no-such-task');
  await page.getByRole('button',{name:'Clear search',exact:true}).click();
  await expect(page.locator('#library [data-testid="block-card"]')).toHaveCount(16);
 });

 test(tag+'Minds search is reached before portraits with a direct route to matches',async({page})=>{
  await page.goto('/minds');const input=page.getByLabel('What would you like help with?',{exact:true});
  await expect(input).toBeVisible();
  const search=await input.boundingBox(),wall=await page.getByTestId('face-wall').boundingBox();
  expect(search!.y+search!.height).toBeLessThan(wall!.y);
  await input.fill('cooking');
  const matches=page.getByTestId('mind-card');await expect(matches.first()).toBeAttached();
  expect(await matches.count()).toBeGreaterThan(0);
  await page.getByRole('link',{name:/View \d+ matching minds/}).click();
  await expect(page.getByTestId('mind-grid')).toBeInViewport();
  await expect(page.getByTestId('mind-needs')).toBeAttached();
  await expect(page.locator('[data-testid^="mind-need-"]')).toHaveCount(10);
  await page.getByRole('button',{name:'Clear search and filters',exact:true}).click();
  await expect(matches).toHaveCount(505);
 });
}

test('@mobile narrow screens retain readable filters and contextual file help',async({page})=>{
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  await page.goto('/?q=AEO#library');await expect(page.getByTestId('library-search')).toHaveValue('AEO');
  for(const id of ['tab-all','tab-skill','tab-specialists']){const rect=await page.getByTestId(id).boundingBox();expect(rect!.height).toBeGreaterThanOrEqual(44);}
  for(const id of ['job-coding','more-filters','filter-task'])await expect(page.getByTestId(id)).toHaveCount(0);
  const clear=await page.getByRole('button',{name:'Clear search',exact:true}).boundingBox();expect(clear!.width).toBe(44);expect(clear!.height).toBe(44);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.goto('/from-a-source');await page.getByText('How to use the downloaded files',{exact:true}).click();
  await expect(page.locator('.intake-transfer-help')).toContainText('keep all its files together');
  const summary=await page.locator('.intake-transfer-help > summary').boundingBox(),help=await page.locator('.workflow-launch').boundingBox();
  expect(help!.y).toBeGreaterThan(summary!.y+summary!.height);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});
