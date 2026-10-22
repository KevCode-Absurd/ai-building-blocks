import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {unzipSync,strFromU8} from 'fflate';
import {mockComposerAccount} from './fixtures/composer-account';

const skill={slug:'custom-space-checker',name:'Source checker',summary:'Check supplied claims',markdown:'---\nname: custom-space-checker\n---\n# Check\nRead all supplied evidence.\n## Checks\nVerify the sources.\n',role:'make',inputs:[{type:'brief',required:true}],outputs:[{type:'draft',required:true}]};
const parent={...skill,slug:'custom-space-governor',name:'Workflow method',markdown:'# Governing workflow\nRead the complete source. Do not pass a pending review.\n',role:'orchestrate',inputs:[],outputs:[]};
const profile={slug:'my-mind-space-voice',name:'Saved voice',specialty:'Clear reports',voice:'Plain and specific',principles:'Verify claims',avoid:'Jargon',examples:'A useful change.'};
const flow={id:'browser-flow',name:'Saved workflow',goal:'Produce my checked report',notes:'Keep original citations and review gates.',ended:true,team:{minds:[profile.slug],mode:'split'},overseer:profile.slug,governingSkills:[parent.slug],customSkills:[skill,parent],customMinds:[profile],nodes:[{id:'check',slug:skill.slug,x:40,y:100,notes:'Keep my evidence notes.',minds:[profile.slug]}],edges:[],updated:1};
const item=(id:string,kind:string,title:string,data:any,body='Original user source. Review citations before release.\n')=>({id,spaceId:'fixture-space',kind,title,summary:'Sample workflow',data,body,visibility:'private',created:'2026-10-22T00:00:00Z',updated:'2026-10-22T00:00:00Z'});

async function fixture(page:Page,items:any[]){
 await mockComposerAccount(page,false);
 await page.addInitScript(()=>localStorage.setItem('abb:space-key','sample-owner-key'));
 await page.route('**/data/blocks.json',r=>r.fulfill({json:{built:'fixture',blocks:[],renamed:{},portTypes:{brief:'The supplied brief',draft:'Checked draft'}}}));
 await page.route('**/api/spaces**',async r=>{
  const req=r.request(),url=new URL(req.url());
  if(req.method()==='POST'&&url.pathname.endsWith('/me/items')){const data=req.postDataJSON();const saved=item('saved-'+items.length,data.kind,data.title,data.data,data.body??'');items.push(saved);await r.fulfill({status:201,json:{item:saved}});return;}
  if(url.pathname.endsWith('/me')){await r.fulfill({json:{space:{id:'fixture-space',name:'Workflow examples'},shareToken:'public-fixture',items}});return;}
  await r.fulfill({json:{space:{id:'fixture-space',name:'Workflow examples'},items}});
 });
}
async function archive(page:Page,card:any,info:any,name:string){const waiting=page.waitForEvent('download');await card.getByTestId('space-workflow-download').click();const d=await waiting;const file=info.outputPath(name);await d.saveAs(file);return unzipSync(fs.readFileSync(file));}

test('Space workflows download complete contracts, retain author source and reopen with their context',async({page},info)=>{
 const sample=item('structured','workflow','Reviewed workflow',flow);await fixture(page,[sample]);await page.goto('/s/public-fixture');
 const card=page.getByTestId('space-item').filter({hasText:'Reviewed workflow'});await expect(card.getByTestId('space-workflow-download')).toHaveText('Download the workflow');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).__spaceCopied=text;}}}));
 await card.getByTestId('space-copy-execution-prompt').click();expect(await page.evaluate(()=>(window as any).__spaceCopied)).toContain(flow.goal);
 const files=await archive(page,card,info,'workflow.zip'),contract=JSON.parse(strFromU8(files['workflow.json']));
 expect(contract.start.goal).toBe(flow.goal);expect(contract.start.notes).toBe(flow.notes);expect(contract.team.minds).toEqual([profile.slug]);expect(contract.overseer).toBe(profile.slug);
 expect(contract.governing_skills.map((s:any)=>s.skill)).toEqual([parent.slug]);expect(strFromU8(files['source.md'])).toBe(sample.body);
 expect(strFromU8(files['OPTIONAL_USER_PROMPT.txt'])).toBe(await page.evaluate(()=>(window as any).__spaceCopied));
 for(const entry of JSON.parse(strFromU8(files['manifest.json'])).files)expect(createHash('sha256').update(files[entry.path]).digest('hex')).toBe(entry.sha256);
 expect(JSON.parse(strFromU8(files['templates/execution-report.json'])).run_status).toBe('NOT_STARTED');
 await card.getByTestId('item-builder').click();await expect(page.getByTestId('builder').getByLabel('Workflow name')).toHaveValue(sample.title);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('abb:v1')||'null')?.draft?.goal)).toBe(flow.goal);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('abb:v1')!).draft);expect(stored.notes).toBe(flow.notes);expect(stored.governingSkills).toEqual([parent.slug]);expect(stored.team.minds).toEqual([profile.slug]);
});

test('text-only agents get blocked source bundles and unavailable steps show persistent download errors',async({page},info)=>{
 const text=item('source','agent','Inbox source',null,'A proposed inbox method. The user confirmed nothing.\n');
 const malformed=item('missing','workflow','Unavailable workflow',{...flow,nodes:[{id:'missing',slug:'missing-required-skill',x:0,y:0}]});
 await fixture(page,[text,malformed]);await page.goto('/space');
 const source=page.getByTestId('space-item').filter({hasText:'Inbox source'});await expect(source.getByTestId('space-source-status')).toContainText('Source awaiting review');
 await expect(source.getByTestId('space-workflow-download')).toHaveText('Download source files');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).__sourceCopied=text;}}}));
 await source.getByTestId('space-copy-execution-prompt').click();expect(await page.evaluate(()=>(window as any).__sourceCopied)).toContain('Begin with preflight only');
 const files=await archive(page,source,info,'source.zip');expect(strFromU8(files['source.md'])).toBe(text.body);
 expect(strFromU8(files['OPTIONAL_USER_PROMPT.txt'])).toBe(await page.evaluate(()=>(window as any).__sourceCopied));
 expect(JSON.parse(strFromU8(files['SOURCE_STATUS.json'])).execution_status).toBe('BLOCKED');expect(files['workflow.json']).toBeUndefined();expect(Object.keys(files).some(p=>p.endsWith('SKILL.md'))).toBe(false);
 const broken=page.getByTestId('space-item').filter({hasText:'Unavailable workflow'});await broken.getByTestId('space-workflow-download').click();await expect(broken.getByRole('alert')).toContainText('selected skill is unavailable');
});

test('@mobile moving a local workflow into Spaces retains its instructions and fits the screen',async({page},info)=>{
 await page.setViewportSize({width:390,height:844});const items:any[]=[];await fixture(page,items);
 await page.addInitScript(f=>localStorage.setItem('abb:v1',JSON.stringify({kits:[],flows:[f],recent:[],currentFlow:null,draft:null})),flow);
 await page.goto('/space');await page.getByTestId('bring-in-go').click();const card=page.getByTestId('space-item').filter({hasText:flow.name});await expect(card).toBeVisible();
 expect(items[0].data.goal).toBe(flow.goal);expect(items[0].data.notes).toBe(flow.notes);expect(items[0].data.governingSkills).toEqual([parent.slug]);expect(items[0].data.team).toEqual(flow.team);
 const files=await archive(page,card,info,'mobile.zip');expect(JSON.parse(strFromU8(files['workflow.json'])).start.goal).toBe(flow.goal);
 await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.toast').waitFor({state:'hidden'});
 await card.screenshot({path:info.outputPath('space-workflow-mobile.png')});
});
