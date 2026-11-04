import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs/promises';
import {unzipSync,strFromU8} from 'fflate';
const goal='Check the supplied synthetic project and deliver working code with test evidence.';
async function offline(page:Page){await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'Local browser fixture; external writes disabled'}}));await page.route('**/api/auth*',r=>r.fulfill({json:{configured:false}}));await page.route('**/api/compose',r=>r.fulfill({json:{enabled:true}}));}
async function setup(page:Page){await page.goto('/roles/coding-specialist');await expect(page.getByTestId('role-profile')).toBeVisible();await page.getByText('Add task context before downloading (optional)',{exact:true}).click();await page.getByTestId('role-goal').fill(goal);await page.getByTestId('role-deliverables').fill('Updated project files\nTest evidence report');await page.getByRole('button',{name:'Add context',exact:true}).click();await page.getByTestId('role-context').fill('Synthetic project files attached. Keep the current navigation and page speed.');await page.getByTestId('role-tools').fill('Local project, terminal and browser. No external publishing.');await page.getByTestId('role-training').fill('Use the supplied template and include concise test evidence.');await page.getByRole('button',{name:'Review your role',exact:true}).click();}
for(const mobile of [false,true]){
 test(`${mobile?'@mobile ':''}roles load one batch, search the full library, paginate and keep navigation usable`,async({page})=>{
  if(mobile)await page.setViewportSize({width:390,height:844});await offline(page);const requests:string[]=[];page.on('request',r=>requests.push(new URL(r.url()).pathname));
  await page.goto('/roles');await expect(page.getByTestId('role-card')).toHaveCount(24);await expect(page.getByRole('link',{name:'Hire this specialist: Coding specialist',exact:true})).toBeVisible();await expect(page.getByRole('navigation',{name:'Breadcrumb'})).toContainText('Specialists');await expect(page.getByTestId('roles-team-entry')).toHaveText('Not sure? Describe your task');
  expect(requests).not.toContain('/data/blocks.json');expect(requests).not.toContain('/data/roles-search.json');
  await page.getByTestId('roles-more').click();await expect(page.getByTestId('role-card')).toHaveCount(48);
  await page.getByTestId('role-search').fill('executive assistant');await expect(page.getByTestId('role-card').filter({hasText:'Executive assistant'})).toBeVisible();
  await page.getByTestId('role-search').fill('unmatchable-role-xyz');await expect(page.getByText('No specialists match that search.',{exact:false})).toBeVisible();await expect(page.getByTestId('role-suggestions').getByRole('link').first()).toBeVisible();
  await page.getByRole('button',{name:'Clear search and filters'}).click();await expect(page.getByTestId('role-card')).toHaveCount(24);
  await expect(page.getByRole('navigation',{name:'Role pages'})).toHaveCount(0);
  await page.goto('/roles/page/2');await expect(page.getByTestId('role-card')).toHaveCount(24);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
 test(`${mobile?'@mobile ':''}role explains capabilities, tasks, functions and deliverables and preserves the task through a reload`,async({page},info)=>{
  if(mobile)await page.setViewportSize({width:390,height:844});await offline(page);await setup(page);
  await expect(page.getByRole('heading',{level:1,name:'Hire an AI coding specialist',exact:true})).toBeVisible();
  for(const name of ['What you give','What you get','An example'])await expect(page.getByTestId('role-profile').getByRole('heading',{name,exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Capabilities',exact:true})).toBeHidden();await page.getByTestId('role-details').locator('summary').first().click();
  for(const name of ['Capabilities','Tasks you can use it for','How the role works','Functions and deliverables','Best way to use this role'])await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();
  await page.getByText('Review the complete launch brief',{exact:true}).click();await expect(page.getByTestId('role-prompt-preview')).toContainText(goal);await expect(page.getByTestId('role-prompt-preview')).toContainText('Synthetic project files attached');
  await page.getByTestId('role-save').click();await expect(page.getByTestId('role-setup').getByText('Saved with your workflows.',{exact:false})).toBeVisible();
  await page.reload();await expect(page.getByTestId('role-goal')).toHaveValue(goal);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:info.outputPath('role-profile.png'),fullPage:true});
 });
}
test('complete role pack contains the supervisor, original methods, references, licences and the private task',async({page})=>{
 test.setTimeout(120000);await offline(page);await setup(page);const waiting=page.waitForEvent('download');await page.getByTestId('role-download').click();const downloaded=await waiting;
 const files=unzipSync(new Uint8Array(await fs.readFile((await downloaded.path())!)));const names=Object.keys(files);
 expect(names).toContain('workflow.json');expect(strFromU8(files['workflow.json'])).toContain(goal);expect(names.some(p=>p.includes('custom-role-coding-specialist')&&p.endsWith('SKILL.md'))).toBe(true);
 expect(names.some(p=>p.includes('agency-engineering-frontend-developer')&&p.endsWith('SKILL.md'))).toBe(true);expect(names.some(p=>/LICENSE/.test(p))).toBe(true);expect(names.some(p=>p.includes('/references/'))).toBe(true);expect(names).toContain('START_HERE.txt');for(const file of ['SOUL.md','KNOWLEDGE.md','PLAYBOOK.md','TOOL_ROUTER.md','CONNECTIONS.md','PERMISSIONS.md','TRAINING.md','CONTEXT.md','JOB.md','CHECKS.md','worker.json'])expect(names).toContain(file);expect(strFromU8(files['TRAINING.md'])).toContain('Use the supplied template');expect(strFromU8(files['JOB.md'])).toContain(goal);
 expect(strFromU8(files['README.md'])).toContain('No task has run');
});
test('AI tailoring passes the task and context privately and does not call a provider automatically',async({page})=>{
 await offline(page);let posts=0;page.on('request',r=>{if(r.method()==='POST'&&r.url().includes('/api/compose'))posts++;});await setup(page);await page.getByTestId('role-ai-planner').click();
 await expect(page).toHaveURL(/\/compose\?role_setup=/);expect(page.url()).not.toContain('Synthetic');await expect(page.getByTestId('compose-goal')).toHaveValue(goal);expect(posts).toBe(0);
});
test('failed full search preserves typed query and offers retry without losing the initial cards',async({page})=>{
 await offline(page);let failed=true;await page.route('**/data/roles-search.json',async r=>failed?r.fulfill({status:503,body:'Unavailable'}):r.continue());await page.goto('/roles');await expect(page.getByTestId('role-card')).toHaveCount(24);await page.getByTestId('role-search').fill('coding specialist');await expect(page.getByRole('alert')).toBeVisible();await expect(page.getByTestId('role-search')).toHaveValue('coding specialist');failed=false;await page.getByRole('button',{name:'Try again',exact:true}).click();await expect(page.getByTestId('role-grid').getByRole('link',{name:'Coding specialist',exact:true})).toBeVisible();await expect(page.getByRole('alert')).toHaveCount(0);await expect(page.getByTestId('role-search')).toHaveValue('coding specialist');
});
