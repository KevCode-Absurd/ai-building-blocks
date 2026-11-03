import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {unzipSync,strFromU8} from 'fflate';
import {prepareTeamPlan} from '../src/teams/team-contract.mjs';
import {mockComposerAccount} from './fixtures/composer-account';

// Browser fixtures only: all API/account writes below are intercepted. Unit tests
// separately verify real source validation, signatures, storage and OAuth scopes.
const goal='Review the supplied storefront evidence and return checked local deliverables. No live publishing.';
const context='Browser-only workflow fixture. Reuse the supplied brand folder and verify each source; no customer records.';
const clone=<T,>(v:T):T=>JSON.parse(JSON.stringify(v));
async function setup(page:Page,options:{signedIn?:boolean;failFirstSave?:boolean;holdSave?:boolean}={}){
 const index=JSON.parse(await fs.readFile(new URL('../public/data/roles-index.json',import.meta.url),'utf8'));
 const preparations:any[]=[],saves:any[]=[],memory:any[]=[],unexpectedPosts:string[]=[];let record:any=null,revoked=false,shares=0,mutations=0,releaseSave:()=>void=()=>{};
 const held=new Promise<void>(resolve=>{releaseSave=resolve;});
 await page.route('**/api/**',route=>{if(route.request().method()==='POST')unexpectedPosts.push(new URL(route.request().url()).pathname);return route.fulfill({status:401,json:{error:'Browser fixture blocks unrelated API actions'}});});
 await mockComposerAccount(page,options.signedIn??false);
 await page.route('**/api/library',route=>route.fulfill({json:{data:{},revision:0}}));
 await page.route('**/api/compose',route=>route.fulfill({json:{enabled:false}}));
 await page.route('**/api/v1/specialist-team-preparations',async route=>{
  const body=route.request().postDataJSON();preparations.push(clone(body));
  try{const value=await prepareTeamPlan(body.plan,{roleIds:index.roles.map((r:any)=>r.id),approved_digest:body.approved_plan_sha256});await route.fulfill({json:value});}
  catch(e){await route.fulfill({status:400,json:{error:{message:e instanceof Error?e.message:'Invalid test plan'}}});}
 });
 const projection=()=>({schema:'ai-blocks-shared-workflow/1',stages:record.data.plan.stages.map((s:any)=>({id:s.id,name:s.name,role_id:s.role_id,depends_on:s.depends_on,methods:s.methods,inputs:s.inputs,outputs:s.outputs,checks:s.checks})),excluded_methods:record.data.excluded_methods??[]});
 await page.route('**/api/v1/personal/**',async route=>{
  const request=route.request(),url=new URL(request.url()),path=url.pathname;
  expect(request.headers().authorization).toBeTruthy();
  if(path.endsWith('/workflow-records')&&request.method()==='POST'){
   const body=request.postDataJSON();saves.push(clone(body));expect(body.confirmed).toBe(true);expect(body.business_id).toBe(body.template.plan.business_id);expect(body.expected_version).toBe(record?.version??0);
   if(options.holdSave)await held;
   if(options.failFirstSave&&saves.length===1)return route.fulfill({status:503,json:{error_description:'Simulated save interruption; your draft is retained.'}});
   mutations++;record={id:'workflow_ui_fixture',business_id:body.business_id,title:body.title,version:(record?.version??0)+1,data:clone(body.template)};return route.fulfill({json:record});
  }
  if(path.endsWith('/workflow-records'))return route.fulfill({json:{items:record?[record]:[]}});
  if(path.endsWith('/workflow-records/workflow_ui_fixture'))return route.fulfill({json:record});
  if(path.endsWith('/share-preview')){const p=projection(),digest=createHash('sha256').update(JSON.stringify(p)).digest('hex');return route.fulfill({json:{projection:p,projection_sha256:digest,version:record.version}});}
  if(path.endsWith('/workflow-shares')){const body=request.postDataJSON();expect(body.confirmed).toBe(true);expect(body.approved_projection_sha256).toBe(createHash('sha256').update(JSON.stringify(projection())).digest('hex'));shares++;revoked=false;return route.fulfill({json:{share_id:'share_ui_fixture',url:url.origin+'/teams?share=fixture-public-template'}});}
  if(path.endsWith('/workflow-shares/share_ui_fixture/revoke')){expect(request.postDataJSON().confirmed).toBe(true);revoked=true;return route.fulfill({json:{revoked:true}});}
  if(path.endsWith('/memory-records')){if(request.method()==='POST'){const body=request.postDataJSON();expect(body.confirmed).toBe(true);memory.push({id:'memory-'+memory.length,title:body.title,version:1,record:body.record,business_id:body.business_id});return route.fulfill({json:memory.at(-1)});}return route.fulfill({json:{items:memory}});}
  return route.fulfill({status:404,json:{error_description:'Unimplemented browser fixture path'}});
 });
 await page.route('**/api/v1/workflow-shares/fixture-public-template',route=>revoked?route.fulfill({status:404,json:{error_description:'Revoked'}}):route.fulfill({json:{title:'Reviewed shared template',version:record.version,template:projection()}}));
 return {preparations,saves,memory,unexpectedPosts,releaseSave,shares:()=>shares,mutations:()=>mutations,record:()=>record};
}
async function open(page:Page,signedIn=false){if(signedIn){await page.goto('/account');await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status','saved');}await page.goto('/teams');await expect(page.getByTestId('team-page')).toBeVisible();}
async function add(page:Page,id:string){await page.getByTestId('team-role').focus();await expect(page.getByTestId('team-role').locator('option[value="'+id+'"]')).toHaveCount(1);await page.getByTestId('team-role').selectOption(id);await page.getByTestId('team-add-role').click();}
async function draft(page:Page){await page.getByTestId('team-business').fill('ui-workspace');await page.getByTestId('team-goal').fill(goal);await page.getByTestId('team-context').fill(context);await add(page,'seo-specialist');await add(page,'coding-specialist');const stages=page.getByTestId('team-stage');await expect(stages).toHaveCount(2);await stages.nth(0).getByRole('textbox').fill('Inspect actual public sources and retain unresolved policy conflicts.');await stages.nth(1).getByRole('textbox').fill('Build a checked local correction from the accepted audit.');await stages.nth(1).getByRole('combobox').selectOption({label:'SEO specialist'});}
async function review(page:Page){await page.getByTestId('team-review').click();await expect(page.getByTestId('team-review-status')).toContainText('Ready for you to check');}

for(const mobile of [false,true]){
 test(`${mobile?'@mobile ':''}specialist team review preserves exact handoffs and clears approval after edits`,async({page},info)=>{
  if(mobile)await page.setViewportSize({width:390,height:844});const api=await setup(page);await open(page);await draft(page);await review(page);
  const first=api.preparations[0].plan;expect(first.notes).toContain(context);expect(first.stages[1].inputs[0].from.stage_id).toBe(first.stages[0].id);expect(first.stages[1].depends_on).toEqual([first.stages[0].id]);expect(first.stages.every((s:any)=>s.methods.every((m:any)=>/^[a-f0-9]{64}$/.test(m.revision_sha256)))).toBe(true);
  await page.getByTestId('team-approve').click();await expect(page.getByTestId('team-review-status')).toContainText('Plan approved');expect(api.preparations[1].approved_plan_sha256).toMatch(/^[a-f0-9]{64}$/);expect(api.preparations[1].plan).toEqual(api.preparations[0].plan);
  await page.getByTestId('team-stage').nth(1).getByRole('textbox').fill('Keep this accepted correction and its actual checks.');await expect(page.getByTestId('team-review-status')).toHaveCount(0);await expect(page.getByTestId('team-save')).toBeDisabled();await review(page);expect(api.preparations.at(-1).approved_plan_sha256).toBeUndefined();expect(api.preparations.at(-1).plan.stages[1].why).toContain('accepted correction');
  await page.reload();await expect(page.getByTestId('team-goal')).toHaveValue(goal);await expect(page.getByTestId('team-stage').nth(1).getByRole('textbox')).toHaveValue('Keep this accepted correction and its actual checks.');await expect(page.getByTestId('team-review-status')).toHaveCount(0);expect(api.saves).toHaveLength(0);expect(api.unexpectedPosts).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('specialist-team.png')});
 });

 test(`${mobile?'@mobile ':''}reviewed team saves after confirmation, retains accepted edits and shares only an explicit revocable preview`,async({page})=>{
  if(mobile)await page.setViewportSize({width:390,height:844});const api=await setup(page,{signedIn:true,failFirstSave:true});await open(page,true);await draft(page);await review(page);await page.getByTestId('team-approve').click();await expect(page.getByTestId('team-review-status')).toContainText('approved');
  await page.getByTestId('team-save').click();await expect(page.getByRole('alert')).toContainText('Simulated save interruption');await expect(page.getByTestId('team-goal')).toHaveValue(goal);await page.getByTestId('team-save').click();await expect(page.getByTestId('team-saved')).toContainText('Saved version 1');expect(api.saves).toHaveLength(2);expect(api.saves[0].idempotency_key).toBe(api.saves[1].idempotency_key);expect(api.mutations()).toBe(1);expect(api.shares()).toBe(0);
  await page.reload();await page.getByRole('button',{name:'Open my saved plans',exact:true}).click();await page.getByRole('button',{name:'My specialist team · v1',exact:true}).click();await expect(page.getByTestId('team-stage').nth(1).getByRole('textbox')).toHaveValue('Build a checked local correction from the accepted audit.');await expect(page.getByTestId('team-review-status')).toHaveCount(0);
  await page.getByTestId('team-share-preview').click();await expect(page.getByTestId('team-share-projection')).toBeVisible();expect(await page.getByTestId('team-share-projection').innerText()).not.toContain(context);expect(await page.getByTestId('team-share-projection').innerText()).not.toContain(goal);expect(api.shares()).toBe(0);
  await page.getByTestId('team-share').click();await expect(page.getByTestId('team-share-link')).toHaveAttribute('href',/fixture-public-template/);expect(api.shares()).toBe(1);await page.getByTestId('team-revoke').click();await expect(page.getByTestId('team-share-link')).toHaveCount(0);await page.goto('/teams?share=fixture-public-template');await expect(page.getByRole('alert')).toContainText('unavailable or was revoked');await expect(page.getByTestId('team-shared')).toHaveCount(0);expect(api.unexpectedPosts).toEqual([]);
 });
}

test('complete team download contains both stage workers, original source bytes, references and licences',async({page})=>{
 test.setTimeout(180000);const api=await setup(page);await open(page);await draft(page);await review(page);const firstPlan=api.preparations[0].plan;
 const waiting=page.waitForEvent('download',{timeout:150000});await page.getByTestId('team-download').click();const downloaded=await waiting,files=unzipSync(new Uint8Array(await fs.readFile((await downloaded.path())!))),names=Object.keys(files);
 expect(names).toContain('team/plan.json');expect(names).toContain('team/approval.json');expect(names).toContain('START_HERE.md');expect(JSON.parse(strFromU8(files['team/approval.json'])).status).toBe('REVIEW_REQUIRED');expect(JSON.parse(strFromU8(files['team/plan.json'])).stages.map((s:any)=>s.role_id)).toEqual(['seo-specialist','coding-specialist']);
 for(const stage of firstPlan.stages){const base='stages/'+stage.id+'/';for(const file of ['SOUL.md','KNOWLEDGE.md','PLAYBOOK.md','TOOL_ROUTER.md','CONNECTIONS.md','PERMISSIONS.md','TRAINING.md','CONTEXT.md','JOB.md','CHECKS.md','worker.json'])expect(names).toContain(base+file);expect(strFromU8(files[base+'JOB.md'])).toContain(goal);expect(names.some(p=>p.startsWith(base)&&p.includes('/references/'))).toBe(true);expect(names.some(p=>p.startsWith(base)&&/LICENSE/.test(p))).toBe(true);}
 const source=names.find(p=>p.startsWith('stages/'+firstPlan.stages[0].id+'/')&&p.endsWith('/technical-seo-auditor/SKILL.md'));expect(source).toBeTruthy();const original=await fs.readFile(new URL('../public/skills/technical-seo-auditor/SKILL.md',import.meta.url));expect(Buffer.from(files[source!]).equals(original)).toBe(true);expect(api.saves).toHaveLength(0);expect(api.unexpectedPosts).toEqual([]);
});

test('invalid imported plan leaves the existing draft intact instead of breaking the team page',async({page})=>{
 await setup(page);await open(page);await draft(page);await page.getByText('Paste or edit the full plan (advanced)',{exact:true}).click();await page.getByTestId('team-json').fill('{"stages":null}');await page.getByRole('button',{name:'Apply edited plan',exact:true}).click();await expect(page.getByRole('alert')).toBeVisible();await expect(page.getByTestId('team-goal')).toHaveValue(goal);await expect(page.getByTestId('team-stage')).toHaveCount(2);
});

test('an account switch during a save cannot display the previous account private receipt',async({page})=>{
  const api=await setup(page,{signedIn:true,holdSave:true});await open(page,true);await draft(page);await review(page);
  await page.getByTestId('team-memory').fill('PRIVATE_FIRST_ACCOUNT_FEEDBACK');await page.getByText('Paste or edit the full plan (advanced)',{exact:true}).click();await page.getByRole('button',{name:'Load current plan into editor',exact:true}).click();await expect(page.getByTestId('team-json')).toHaveValue(new RegExp(goal));
  await page.getByTestId('team-save').click();await expect.poll(()=>api.saves.length).toBe(1);await page.evaluate(()=>{(window as any).__switchMindAccount('different_browser_account');});await expect(page.getByTestId('team-goal')).toHaveValue('');await expect(page.getByTestId('team-memory')).toHaveValue('');await expect(page.getByTestId('team-json')).toHaveValue('');await expect(page.getByTestId('team-context')).toHaveValue('');
  // Account changes may remount the workspace and quietly discard the old response.
  // Wait for that real late response, then assert isolation rather than an old workspace alert.
  const lateResponse=page.waitForResponse(r=>r.url().includes('/workflow-records')&&r.request().method()==='POST');api.releaseSave();await lateResponse;await expect.poll(()=>api.mutations()).toBe(1);await expect(page.getByTestId('team-goal')).toHaveValue('');await expect(page.getByTestId('team-context')).toHaveValue('');await expect(page.getByTestId('team-memory')).toHaveValue('');await expect(page.getByTestId('team-json')).toHaveValue('');await expect(page.getByTestId('team-saved')).toHaveCount(0);await expect(page.getByTestId('team-share-preview')).toHaveCount(0);
  await page.getByTestId('team-goal').fill('Second account private draft');await page.evaluate(()=>{(window as any).__switchMindAccount('user_browser_fixture');});await expect(page.getByTestId('team-goal')).toHaveValue(goal);await expect(page.getByTestId('team-context')).toHaveValue(context);await expect(page.getByTestId('team-stage')).toHaveCount(2);await expect(page.getByTestId('team-memory')).toHaveValue('');await expect(page.getByTestId('team-json')).toHaveValue('');await expect(page.getByTestId('team-review-status')).toHaveCount(0);
  await page.evaluate(()=>{(window as any).__switchMindAccount('different_browser_account');});await expect(page.getByTestId('team-goal')).toHaveValue('Second account private draft');await expect(page.getByTestId('team-context')).toHaveValue('');await expect(page.getByTestId('team-stage')).toHaveCount(0);expect(api.unexpectedPosts).toEqual([]);
});
