import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {unzipSync,strFromU8} from 'fflate';

test.beforeEach(async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.route('**/api/auth*',r=>r.fulfill({json:{configured:false}}));
 await page.route('**/api/comments*',r=>r.fulfill({json:{enabled:false,comments:[]}}));
});

for(const tag of ['', '@mobile ']){
 test(tag+'all task kinds offer complete downloads at the top',async({page})=>{
  test.setTimeout(120000);
  for(const [kind,slug]of [['skill','ai-search-audit'],['prompt','rough-notes-to-minutes-writer'],['mind','steve-jobs'],['workflow','ad-ab-test'],['agent','ai-pilot-evaluation-review-assistant']]){
   await page.goto(`/${kind}s/${slug}`);
   const primary=page.getByTestId('task-primary');await expect(primary).toBeVisible();
   await expect(primary.getByRole('button',{name:`Copy ${kind}`,exact:true})).toBeEnabled();
   await primary.getByRole('button',{name:`Copy ${kind}`,exact:true}).click();
   expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('---');
   const [file]=await Promise.all([page.waitForEvent('download'),primary.getByRole('button',{name:`Download ${kind}`,exact:true}).click()]);
   expect(await file.failure()).toBeNull();
   const zip=unzipSync(await fs.readFile((await file.path())!));const names=Object.keys(zip);
   if(['workflow','agent'].includes(kind)){
    expect(names).toContain('HANDOFF.md');expect(names).toContain('workflow.json');expect(names).toContain('manifest.json');
    expect(names).toContain(`skills/${slug}/SKILL.md`);
    expect(names.filter(n=>n.startsWith('skills/')&&n.endsWith('/SKILL.md')).length).toBeGreaterThan(1);
    const contract=JSON.parse(strFromU8(zip['workflow.json']));expect(contract.steps.length).toBeGreaterThan(0);
    await expect(primary.getByTestId('view-in-builder')).toBeVisible();
   }else{
    expect(names).toContain(`${slug}/SKILL.md`);
    if(kind==='skill'||kind==='mind')expect(names.length).toBeGreaterThan(1);
   }
   await expect(primary.getByRole('link',{name:'How to use',exact:true})).toHaveAttribute('href','/how-it-works#use-in-ai');
   const h=await page.locator('.bp-h1').boundingBox(),actions=await primary.boundingBox(),start=await page.getByTestId('task-start').count()?await page.getByTestId('task-start').boundingBox():null;
   expect(Math.abs(h!.x-actions!.x)).toBeLessThanOrEqual(1);if(start)expect(Math.abs(h!.x-start.x)).toBeLessThanOrEqual(1);
   // Fill it in comes before Run it, so the buttons sit below the inputs when a task has inputs.
   if (start) expect(start.y).toBeLessThanOrEqual(actions!.y);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
 });

 test(tag+'copy and download failures have visible recovery beside the actions',async({page})=>{
  await page.goto('/skills/ai-search-audit');await expect(page.getByTestId('copy-skill')).toBeEnabled();
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error('Denied'))}}));
  await page.getByTestId('copy-skill').click();
  await expect(page.getByTestId('task-primary').getByLabel('Copy instructions manually')).toBeVisible();
  await page.route('**/skills/ai-search-audit.zip*',r=>r.abort());
  await page.getByTestId('download-task').click();
  await expect(page.getByTestId('task-primary').getByRole('alert').filter({hasText:'complete skill files'})).toBeVisible();
  await expect(page.getByTestId('download-task')).toBeEnabled();
 });

 test(tag+'task forms and download panels keep readable insets in both themes',async({page})=>{
  for(const theme of ['dark','light']){
   await page.addInitScript(t=>localStorage.setItem('abb:theme',t),theme);
   await page.goto('/prompts/rough-notes-to-minutes-writer');
   await expect(page.getByTestId('composer')).toBeVisible();
   await page.locator('#composer-text').fill('Team meeting: Maya will send the draft on Friday.');
   await page.getByTestId('composer-copy').click();
   await expect(page.getByTestId('task-text-transfer')).toBeVisible();
   if(test.info().project.name==='mobile'){
    const notice=await page.locator('.toast').boundingBox(),support=await page.locator('#abb-support').boundingBox();
    expect(notice!.x+notice!.width+8).toBeLessThanOrEqual(support!.x);
   }
   const panel=await page.getByTestId('composer').boundingBox();
   for(const selector of ['.task-example-actions','.task-transfer h3','.task-transfer ol','.composer-bar > span']){
    const box=await page.getByTestId('composer').locator(selector).boundingBox();
    if(box)expect(box.x-panel!.x).toBeGreaterThanOrEqual(selector==='.task-example-actions'?0:12);
   }
   await page.getByTestId('composer').scrollIntoViewIfNeeded();await page.screenshot({path:test.info().outputPath(`composer-${theme}.png`)});
   await page.goto('/skills/ai-search-audit#install');
   const install=page.getByTestId('install');await expect(install).toBeVisible();
   const outer=await install.boundingBox(),button=await install.getByTestId('install-zip').boundingBox();
   expect(button!.x-outer!.x).toBeGreaterThanOrEqual(16);expect(button!.y-outer!.y).toBeGreaterThanOrEqual(16);
   await install.scrollIntoViewIfNeeded();await page.screenshot({path:test.info().outputPath(`install-${theme}.png`)});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
 });

 test(tag+'How to use reaches named setup guides and retains the library return',async({page})=>{
  await page.goto('/skills/ai-search-audit');await page.getByTestId('task-primary').getByRole('link',{name:'How to use',exact:true}).click();
  await expect(page.locator('#use-in-ai')).toBeInViewport();
  for(const [label,id]of [['ChatGPT','chatgpt'],['Claude','claude'],['Claude Code','claude-code'],['Codex','codex']]){
   await page.getByRole('navigation',{name:'Choose your AI'}).getByRole('link',{name:label,exact:true}).click();
   await expect(page.getByTestId('guide-'+id)).toBeInViewport();
   await expect(page.getByTestId('guide-'+id).getByRole('listitem')).toHaveCount(3);
  }
  await page.getByTestId('menu-btn').click();await page.getByRole('navigation',{name:'Sections'}).getByRole('link',{name:'Find a task',exact:true}).click();await expect(page.getByTestId('library-search')).toBeVisible();
 });
}

test('@mobile 320px actions and guides fit without horizontal scrolling',async({page})=>{
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});await page.goto('/skills/ai-search-audit');
  await expect(page.getByTestId('download-task')).toBeEnabled();
  await Promise.all([page.waitForEvent('download'),page.getByTestId('download-task').click()]);
  await expect(page.locator('.toast')).toContainText('Download ready');
  const notice=await page.locator('.toast').boundingBox(),support=await page.locator('#abb-support').boundingBox();
  expect(notice!.x+notice!.width+8).toBeLessThanOrEqual(support!.x);expect(notice!.width).toBeLessThanOrEqual(width-92);
  await page.screenshot({path:test.info().outputPath(`download-notice-${width}.png`)});
 }
 await page.setViewportSize({width:320,height:844});
 for(const route of ['/skills/ai-search-audit','/workflows/ad-ab-test','/how-it-works#guide-codex','/from-a-source','/tools','/compose','/minds','/account']){
  await page.goto(route);await expect(page.locator('main')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBe(true);
 }
});
