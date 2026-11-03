import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {unzipSync,strFromU8} from 'fflate';

test.beforeEach(async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.route('**/api/auth*',r=>r.fulfill({json:{configured:false}}));
 await page.route('**/api/comments*',r=>r.fulfill({json:{enabled:false,comments:[]}}));
});
const fits=async(page:any)=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
const ready=async(page:any)=>{await page.locator('main h1').first().waitFor();await page.locator('#app-loader').waitFor({state:'hidden'});};

for(const tag of ['', '@mobile ']){
 test(tag+'navigation makes every main feature reachable and Escape returns focus',async({page},info)=>{
  if(info.project.name==='mobile')await page.setViewportSize({width:320,height:568});
  await page.goto('/#library');await ready(page);
  const toggle=page.getByTestId('menu-btn');
  await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');
  if(info.project.name==='mobile')await expect(page.getByRole('navigation',{name:'Sections'}).getByRole('link',{name:'My Account',exact:true})).toBeFocused();
  for(const name of ['Workflow Builder','Plan a job','Browser tools','Apps','Minds','AI tools','Growth planner','Create skills from content','Team space','Help & contact'])await expect(page.getByRole('navigation',{name:'Sections'}).getByRole('link',{name,exact:true})).toBeVisible();
  if(info.project.name==='mobile'){
   await page.screenshot({path:info.outputPath('mobile-menu-top.png')});
   const last=page.getByRole('navigation',{name:'Sections'}).getByRole('link',{name:'Help & contact',exact:true});await last.scrollIntoViewIfNeeded();await expect(last).toBeInViewport();
   await page.screenshot({path:info.outputPath('mobile-menu-bottom.png')});
  }
  await page.keyboard.press('Escape');await expect(toggle).toHaveAttribute('aria-expanded','false');await expect(toggle).toBeFocused();
  if(info.project.name==='mobile'){
   await page.keyboard.press('Enter');await expect(page.getByRole('navigation',{name:'Sections'}).getByRole('link',{name:'My Account',exact:true})).toBeFocused();
   await page.keyboard.press('Tab');await expect(page.getByTestId('open-saved-work')).toBeFocused();
   await page.keyboard.press('Escape');await expect(toggle).toBeFocused();
  }
  await toggle.click();await page.getByTestId('nav-intake').click();await expect(page.getByTestId('intake-text')).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded','false');await fits(page);
 });

 test(tag+'browser tool results can be copied and downloaded without extra steps',async({page})=>{
  for(const slug of ['word-counter','text-cleaner','json-formatter','csv-to-json','contrast-checker']){
   await page.goto('/tools/'+slug);await ready(page);
   if(slug==='word-counter'){
    await page.getByTestId('browser-input').fill('Hello');await expect(page.getByTestId('browser-output')).toContainText('1 word');await expect(page.getByTestId('browser-output')).toContainText('1 paragraph');
   }
   const output=page.getByTestId('browser-output');await expect(output).toBeVisible();
   const text=await output.innerText();expect(text.trim().length).toBeGreaterThan(0);
   await page.getByRole('button',{name:'Copy result',exact:true}).click();expect((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n')).toBe(text);
   const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download result',exact:true}).click()]);
   expect(await file.failure()).toBeNull();expect(await fs.readFile((await file.path())!,'utf8')).toBe(text);
   await fits(page);
  }
 });

 test(tag+'calculator copy and all download formats work',async({page})=>{
  await page.goto('/tools/discount-calculator');await ready(page);
  for(const [id,suffix]of [['download-html','.html'],['download-xlsx','.xlsx'],['download-skill','.zip']]){
   const link=page.getByTestId(id);await expect(link).toBeEnabled();
   const [file]=await Promise.all([page.waitForEvent('download'),link.click()]);expect(await file.failure()).toBeNull();expect(file.suggestedFilename()).toContain(suffix);
   const bytes=await fs.readFile((await file.path())!);expect(bytes.length).toBeGreaterThan(100);
   if(suffix==='.zip')expect(Object.keys(unzipSync(bytes)).some(p=>p.endsWith('SKILL.md'))).toBe(true);
  }
  await page.getByTestId('copy-prompt').click();expect((await page.evaluate(()=>navigator.clipboard.readText())).length).toBeGreaterThan(80);
  await page.getByTestId('copy-embed').click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('<iframe');await fits(page);
 });

 test(tag+'source download and its copy instructions stay separate and readable',async({page})=>{
  await page.goto('/from-a-source');await ready(page);
  await expect(page.getByTestId('intake-download')).toBeDisabled();
  const source='Start by asking who needs the result. Collect the facts and the deadline. Write a short draft from those facts. Check the draft against the goal, fix any unsupported claim and return the finished draft with a checklist. '.repeat(5);
  await page.getByTestId('intake-title').fill('A clear drafting method');await page.getByTestId('intake-text').fill(source);
  const [file]=await Promise.all([page.waitForEvent('download'),page.getByTestId('intake-download').click()]);
  const archive=unzipSync(await fs.readFile((await file.path())!));expect(Object.keys(archive).some(p=>p.endsWith('/HANDOFF.md'))).toBe(true);expect(Object.keys(archive).some(p=>p.endsWith('/AUTHORING.md'))).toBe(true);
  expect(Object.values(archive).some(bytes=>strFromU8(bytes).includes(source.trim()))).toBe(true);
  const help=page.locator('.intake-transfer-help');if(!await help.evaluate(e=>(e as HTMLDetailsElement).open))await help.locator('summary').click();
  await help.getByTestId('copy-execution-prompt').click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('HANDOFF.md');
  const area=await help.locator('.workflow-launch').boundingBox(),button=await help.getByTestId('copy-execution-prompt').boundingBox();expect(button!.x-area!.x).toBeGreaterThanOrEqual(12);await fits(page);
 });

 test(tag+'long Mind pack controls and optional skill choices stay inside the page',async({page,request})=>{
  const catalogue=await(await request.get('/data/blocks.json')).json();const minds=catalogue.blocks.filter((b:any)=>b.type==='mind').sort((a:any,b:any)=>b.name.length-a.name.length);
  for(const mind of minds.slice(0,3)){
   await page.goto('/minds/'+mind.slug+'#skills');await ready(page);
   const pack=page.getByTestId('mind-pack');await expect(pack).toBeVisible();const b=await pack.boundingBox();expect(b!.x).toBeGreaterThanOrEqual(0);expect(b!.x+b!.width).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth));
   const all=page.getByTestId('mind-skills-all');if(await all.isVisible()){await all.click();await expect(pack).toContainText('on their own');await all.click();}
   await fits(page);
  }
 });

 test(tag+'growth brief and guest backup downloads remain straightforward',async({page})=>{
  await page.goto('/tools/growth-channel-planner');await ready(page);
  await page.getByTestId('traction-business').fill('A neighbourhood bakery taking custom cake orders.');
  await page.getByTestId('traction-prepare').click();await expect(page.getByTestId('traction-result')).toBeVisible();
  await page.getByTestId('traction-copy').click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('bakery');
  const [pack]=await Promise.all([page.waitForEvent('download'),page.getByTestId('traction-download').click()]);expect(await pack.failure()).toBeNull();
  expect(Object.keys(unzipSync(await fs.readFile((await pack.path())!)))).toContain('HANDOFF.md');await fits(page);
  await page.goto('/account?view=settings');await ready(page);
  for(const label of ['Download backup','Download saving diagnostics']){
   const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:label,exact:true}).click()]);
   expect(await file.failure()).toBeNull();
   const json=JSON.parse(await fs.readFile((await file.path())!,'utf8'));expect(json).toBeTruthy();
  }
  await fits(page);
 });

 test(tag+'builder download, first message and transfer help work after choosing a workflow',async({page})=>{
  await page.goto('/workflows/ad-ab-test');await ready(page);await page.getByTestId('view-in-builder').click();
  await page.getByTestId('builder').waitFor();await page.getByTestId('workflow-list-view').click();await expect(page.getByTestId('step-open').first()).toBeVisible();
  await page.getByTestId('download-handoff').click();const dialog=page.getByTestId('needs');await expect(dialog).toBeVisible();
  const [file]=await Promise.all([page.waitForEvent('download'),dialog.getByTestId('needs-download').click()]);expect(await file.failure()).toBeNull();
  expect(Object.keys(unzipSync(await fs.readFile((await file.path())!)))).toContain('HANDOFF.md');
  const guide=dialog.getByTestId('transfer-guide');await guide.getByText('Need a first message or a file checklist?',{exact:true}).click();
  await guide.getByTestId('copy-first-message').click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('HANDOFF.md');
  await dialog.getByTestId('next-done').click();const retained=page.locator('.builder .stage > .task-file-transfer');await expect(retained).toBeVisible();
  const panel=await retained.boundingBox(),heading=await retained.locator('h3').boundingBox();expect(heading!.x-panel!.x).toBeGreaterThanOrEqual(16);await fits(page);
 });
}
