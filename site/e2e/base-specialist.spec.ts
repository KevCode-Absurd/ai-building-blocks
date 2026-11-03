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
 await page.goto('/roles/design-specialist');
 // The main action is one paste-ready message for chat apps: setup, intake and the method, no zip needed.
 await page.getByTestId('base-specialist-message').click();await expect(page.getByTestId('base-specialist-copied')).toContainText('characters');
 const message=await page.evaluate(()=>navigator.clipboard.readText());expect(message).toContain('Please work as my design specialist');expect(message).toContain('What would you like me to do, and what would you like back?');expect(message).toContain('## The method: ');expect(message.length).toBeLessThanOrEqual(16000);expect(message).not.toContain('brand file');
 await page.getByText('Use with the pack, MCP or API',{exact:true}).click();await page.getByTestId('base-specialist-copy').click();
 const copied=await page.evaluate(()=>navigator.clipboard.readText());expect(copied).toContain('"role_id":"design-specialist"');expect(copied).toContain('what I want back');expect(copied).toContain('let me accept or change');
 await expect(page.getByTestId('base-specialist')).toContainText('find_specialist');
 await expect(page.getByTestId('role-goal')).not.toBeVisible();
});

test('the saved brand file is added to the copied message on this device only',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.route('**/api/**',r=>r.fulfill({status:401,json:{error:'No remote calls'}}));
 const posts:string[]=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.addInitScript(()=>localStorage.setItem('abb:business',JSON.stringify({name:'Sprout',sells:'Plant care kits',reach:'local',area:'north Leeds',goal:'More customers or bookings'})));
 await page.goto('/roles/design-specialist');await expect(page.getByTestId('base-specialist-brand')).toContainText('Your brand file is added when you copy');
 await page.getByTestId('base-specialist-message').click();await expect(page.getByTestId('base-specialist-copied')).toBeVisible();
 const message=await page.evaluate(()=>navigator.clipboard.readText());expect(message).toContain('Sprout');expect(message).toContain('Local, around north Leeds');expect(message).toContain('including my brand file');
 expect(posts).toEqual([]);
});
