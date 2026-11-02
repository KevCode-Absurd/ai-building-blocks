import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {unzipSync,strFromU8} from 'fflate';

for(const mobile of [false,true])test(`${mobile?'@mobile ':''}base specialist downloads without task, account or private context`,async({page},info)=>{
 test.setTimeout(120000);if(mobile)await page.setViewportSize({width:390,height:844});
 const posts:string[]=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'No account or provider calls in this local test'}}));
 await page.goto('/roles/coding-specialist');await expect(page.getByTestId('base-specialist')).toBeVisible();
 await expect(page.getByTestId('role-goal')).not.toBeVisible();
 const wait=page.waitForEvent('download');await page.getByTestId('base-specialist-download').click();const downloaded=await wait;
 expect(downloaded.suggestedFilename()).toBe('coding-specialist-base-specialist.zip');
 const files=unzipSync(new Uint8Array(await fs.readFile((await downloaded.path())!)));
 expect(JSON.parse(strFromU8(files['specialist.json'])).task).toBeNull();expect(strFromU8(files['INTAKE.md'])).toContain('what would you like back');
 expect(files['skills/agency-engineering-frontend-developer/SKILL.md']).toBeTruthy();expect(Object.keys(files).some(p=>p.includes('/references/'))).toBe(true);expect(Object.keys(files).some(p=>/LICENSE/.test(p))).toBe(true);
 expect(posts).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('base-specialist.png'),fullPage:false});
});

test('download error preserves the base role, supports retry and never demands context',async({page})=>{
 test.setTimeout(120000);await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'No remote calls'}}));
 let fail=true;await page.route('**/specialists/coding-specialist-base-specialist.zip',r=>fail?r.fulfill({status:503,body:'Download temporarily unavailable'}):r.continue());
 await page.goto('/roles/coding-specialist');await page.getByTestId('base-specialist-download').click();await expect(page.getByTestId('base-specialist').getByRole('alert')).toBeVisible();await expect(page.getByTestId('role-goal')).not.toBeVisible();
 fail=false;const wait=page.waitForEvent('download');await page.getByTestId('base-specialist-download').click();await wait;await expect(page.getByTestId('base-specialist').getByRole('alert')).toHaveCount(0);
});

test('copy provides a role-only setup prompt and task-based hiring explains acceptance',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'No remote calls'}}));
 await page.goto('/roles/design-specialist');await page.getByTestId('base-specialist-copy').click();
 const copied=await page.evaluate(()=>navigator.clipboard.readText());expect(copied).toContain('"role_id":"design-specialist"');expect(copied).toContain('what I want back');expect(copied).toContain('let me accept or change');
 await page.getByText('Use through MCP or API',{exact:true}).click();await expect(page.getByTestId('base-specialist')).toContainText('find_specialist');
 await expect(page.getByTestId('role-goal')).not.toBeVisible();
});
