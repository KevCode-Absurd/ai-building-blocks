import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {unzipSync,strFromU8} from 'fflate';

const hash='a'.repeat(64),goal='Make a checked launch plan with three genuinely different routes.';
const names=['General coordinator','Product strategist','Customer researcher','Independent challenger','Fact checker','Independent judge','Quality critic'];
const types=['coordinator','maker','maker','red_team','fact_checker','judge','critic'];
const roles=names.map((name,i)=>({id:'role-'+i,name,summary:'A different discipline for this job',area:'operations',deliverables:['Checked work'],resourceCount:1,featured:true,seat_suitability:[types[i]],families:['family-'+i],lenses:['lens-'+i]}));
const seats=roles.map((r,i)=>({seat_id:'s'+i,seat_type:types[i],seat_types:i===1||i===2?['maker','strategist']:i===3?['red_team','strategist']:[types[i]],role_id:r.id,persona_id:null,lens:'lens-'+i,families:['family-'+i],toolbox:[{slug:'method-'+i,revision_sha256:hash}],tools_needed:[],budget:{max_tool_calls:10,max_generations:2},responsibilities:['Own one clear handoff']}));
async function setup(page:Page){
 const posted:unknown[]=[];
 await page.route('**/data/roles-index.json',route=>route.fulfill({json:{roles}}));
 await page.route('**/data/team-org-chart.json',route=>route.fulfill({json:{personas:[{id:'casey-research',name:'Casey',title:'Research lead',roles:['role-2'],stance:'Check the actual customer evidence'}]}}));
 await page.route('**/data/approach-index.json',route=>route.fulfill({json:{jobs:{'plan-strategy':{output_shape_default:'one_decision',default_volume:1,families:[{id:'customer-first',name:'Customer first',what_it_looks_like:'A customer-led plan',when_it_wins:'Customer evidence is available'},{id:'process-first',name:'Process first',what_it_looks_like:'An operating-process plan',when_it_wins:'The bottleneck is operational'},{id:'test-first',name:'Test first',what_it_looks_like:'A small reversible test',when_it_wins:'The main cause is uncertain'}]}}}}));
 await page.route('**/data/roles/role-*.json',route=>{const id=new URL(route.request().url()).pathname.split('/').pop()!.replace('.json',''),r=roles.find(r=>r.id===id)!;return route.fulfill({json:{...r,core:[{slug:'method-'+id.split('-')[1],revision_sha256:hash}],resources:[]}});});
 await page.route('**/api/v1/team-proposals',route=>{posted.push(route.request().postDataJSON());return route.fulfill({json:{schema:'ai-blocks-team-proposal/1',ok:true,seats,lead_seat_id:'s1',proposal_id:'tp_fixture',warnings:[],errors:[]}});});
 await page.route('**/api/compose',route=>route.fulfill({json:{enabled:false}}));
 return {posted};
}
async function open(page:Page){await page.goto('/councils');await expect(page.getByTestId('council-page')).toBeVisible();await expect(page).toHaveTitle('Build your council · AI Blocks');}
async function staff(page:Page){await page.getByTestId('council-request').fill(goal);await page.getByTestId('council-auto-staff').click();await expect(page.getByTestId('council-roster-person')).toHaveCount(7);}

test('council editor staffs a flexible team, changes its task lead, and retains explicit collaboration handoffs',async({page},info)=>{
 const api=await setup(page);await open(page);await staff(page);expect(api.posted).toHaveLength(1);expect(api.posted[0]).toMatchObject({task:goal,tier:'standard'});
 await page.getByTestId('council-roster-person').nth(2).click();await page.getByRole('button',{name:'Make task lead',exact:true}).click();await expect(page.getByRole('button',{name:'Task lead for this job',exact:true})).toBeDisabled();
 await page.getByText('Edit the handoffs',{exact:false}).click();await page.getByLabel('Handoff from',{exact:true}).selectOption('s2');await page.getByLabel('Handoff to',{exact:true}).selectOption('s3');await page.getByLabel('Handoff output',{exact:true}).fill('Customer evidence with checked sources');await page.getByRole('button',{name:'Add handoff',exact:true}).click();await expect(page.locator('.council-handoff-editor').getByText('Customer evidence with checked sources',{exact:false})).toBeVisible();
 await page.reload();await expect(page.getByTestId('council-roster-person')).toHaveCount(7);await expect(page.getByTestId('council-request')).toHaveValue(goal);await expect(page.locator('.council-roster').getByText('TASK LEAD',{exact:true})).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('council-desktop.png'),fullPage:true});
});

test('three route briefs can be edited and combined by individual parts',async({page})=>{
 await setup(page);await open(page);await staff(page);await page.getByRole('tab',{name:'Three routes & a mix',exact:true}).click();
 const routes=page.locator('.council-direction');await routes.nth(0).getByLabel('Route 1 first move',{exact:true}).fill('Interview returning customers');await routes.nth(0).getByRole('button',{name:'+ Keep this part',exact:true}).first().click();
 const second=routes.nth(1).getByRole('textbox');await second.nth(2).fill('Test a small operating-process change');await routes.nth(1).getByRole('button',{name:'+ Keep this part',exact:true}).nth(1).click();
 const third=routes.nth(2).getByRole('textbox');await third.nth(3).fill('Every claim must retain its source');await routes.nth(2).getByRole('button',{name:'+ Keep this part',exact:true}).last().click();
 await expect(page.locator('.council-combined')).toContainText('Interview returning customers');await expect(page.locator('.council-combined')).toContainText('Test a small operating-process change');await expect(page.locator('.council-combined')).toContainText('Every claim must retain its source');await expect(page.locator('.council-keep-part.is-kept')).toHaveCount(3);
});

test('planning pack carries the exact private brain bytes, hash, roster and three route briefs',async({page})=>{
 const api=await setup(page);await open(page);await staff(page);await page.getByLabel('Brain business',{exact:true}).fill('Owner supplied project');
 const content=Buffer.from('# Verified project brain\n\nPRIVATE_CONTEXT_FOR_THIS_DOWNLOAD_ONLY\n');await page.getByLabel('Add brain file',{exact:true}).setInputFiles({name:'project-brain.md',mimeType:'text/markdown',buffer:content});await expect(page.getByLabel('Brain SHA-256',{exact:true})).toHaveValue(createHash('sha256').update(content).digest('hex'));
 expect(JSON.stringify(api.posted)).not.toContain('PRIVATE_CONTEXT');
 const wait=page.waitForEvent('download');await page.getByTestId('council-download-pack').click();const file=await wait,bytes=new Uint8Array(await fs.readFile((await file.path())!)),zip=unzipSync(bytes);
 expect(Object.keys(zip)).toEqual(expect.arrayContaining(['COUNCIL-DRAFT.json','TEAM.json','RUBRIC.json','ROUTE-BRIEFS.json','BRAND-BRAIN.json','RUN-MY-COUNCIL.md','brand-brain/project-brain.md']));
 expect(Buffer.from(zip['brand-brain/project-brain.md']).equals(content)).toBe(true);expect(strFromU8(zip['RUN-MY-COUNCIL.md'])).toContain('must read the complete brain');expect(JSON.parse(strFromU8(zip['COUNCIL-DRAFT.json'])).seats).toHaveLength(7);expect(JSON.parse(strFromU8(zip['ROUTE-BRIEFS.json'])).directions).toHaveLength(3);
});

test('@mobile council editor keeps the map, controls and required brand-brain gate usable',async({page},info)=>{
 await page.setViewportSize({width:390,height:844});await setup(page);await open(page);await staff(page);await expect(page.getByTestId('council-flow')).toBeVisible();await page.getByRole('button',{name:'Check my plan',exact:false}).click();await expect(page.getByTestId('council-plan-check')).toContainText('brand or project brain');
 await page.getByTestId('council-roster-person').nth(3).click();await expect(page.getByTestId('council-role')).toHaveValue('role-3');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('council-mobile.png'),fullPage:true});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:info.outputPath('council-mobile-top.png')});await page.getByTestId('council-flow').scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('council-mobile-map.png')});
});

test('named councils reopen with their people and require a fresh brain-read check',async({page})=>{
 await setup(page);await open(page);await staff(page);await page.getByLabel('Brain business',{exact:true}).fill('Saved project');await page.getByLabel('Add brain file',{exact:true}).setInputFiles({name:'private.md',mimeType:'text/markdown',buffer:Buffer.from('# Private verified context')});await page.getByLabel('My coordinator has read this exact brain version.',{exact:true}).check();
 await page.getByText('Save or load my council',{exact:false}).click();await page.getByLabel('Council name',{exact:true}).fill('My launch council');await page.getByRole('button',{name:'Save this council',exact:true}).click();await expect(page.getByLabel('Saved councils',{exact:true}).locator('option')).toHaveCount(2);
 await page.getByTestId('council-request').fill('An unsaved different request');await page.getByRole('button',{name:'Load selected council',exact:true}).click();await expect(page.getByTestId('council-request')).toHaveValue(goal);await expect(page.getByTestId('council-roster-person')).toHaveCount(7);await expect(page.getByText('Reattach any private brain file',{exact:false})).toBeVisible();await expect(page.getByLabel('My coordinator has read this exact brain version.',{exact:true})).not.toBeChecked();const packWait=page.waitForEvent('download');await page.getByTestId('council-download-pack').click();const packFile=await packWait,pack=unzipSync(new Uint8Array(await fs.readFile((await packFile.path())!)));expect(Object.keys(pack)).not.toContain('brand-brain/private.md');
 await page.reload();await page.getByText('Save or load my council',{exact:false}).click();await page.getByLabel('Saved councils',{exact:true}).selectOption({label:'My launch council'});await page.getByRole('button',{name:'Load selected council',exact:true}).click();await expect(page.getByTestId('council-request')).toHaveValue(goal);await page.getByRole('button',{name:'Remove saved council',exact:true}).click();await expect(page.getByLabel('Saved councils',{exact:true}).locator('option')).toHaveCount(1);await expect(page.getByTestId('council-roster-person')).toHaveCount(7);
});
test('editable council JSON can be imported and malformed input preserves the working draft',async({page})=>{
 await setup(page);await open(page);await staff(page);const wait=page.waitForEvent('download');await page.getByTestId('council-download-json').click();const file=await wait,bytes=await fs.readFile((await file.path())!);await page.getByTestId('council-request').fill('Working draft retained on failure');await page.getByText('Save or load my council',{exact:false}).click();await page.getByLabel('Import council JSON file',{exact:true}).setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{broken')});await expect(page.getByTestId('council-request')).toHaveValue('Working draft retained on failure');await expect(page.getByText('Choose a valid council JSON file.',{exact:true})).toBeVisible();await page.getByLabel('Import council JSON file',{exact:true}).setInputFiles({name:'my-council.json',mimeType:'application/json',buffer:Buffer.concat([Buffer.from(' '.repeat(250000)),bytes])});await expect(page.getByTestId('council-request')).toHaveValue(goal);await expect(page.getByTestId('council-roster-person')).toHaveCount(7);
});
