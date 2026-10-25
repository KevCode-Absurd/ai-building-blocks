import {test,expect} from './fixtures/staging-aware-test';
import fs from 'node:fs';
import {unzipSync,strFromU8} from 'fflate';
const specs=['public-markets','private-deals','operating-credit'].map(name=>JSON.parse(fs.readFileSync(new URL(`../../tools/finance-expansion/${name}.json`,import.meta.url),'utf8')));
const items=specs.flatMap(shard=>[...shard.skills.map((item:any)=>({...item,type:'skill'})),...shard.workflows.map((item:any)=>({...item,type:'workflow'})),...shard.agents.map((item:any)=>({...item,type:'agent'}))]);
if(items.length!==210||new Set(items.map((item:any)=>item.slug)).size!==210)throw new Error('Finance browser suite requires the complete 210-item batch.');
const published=JSON.parse(fs.readFileSync(new URL('../public/data/blocks.json',import.meta.url),'utf8'));
const publishedNames=new Map(published.blocks.map((item:any)=>[item.slug,item.name]));
for(const item of items)if(!publishedNames.has(item.slug))throw new Error(`Finance item is absent from the public catalogue: ${item.slug}`);
const route=(item:any)=>`/${item.type==='skill'?'skills':item.type==='workflow'?'workflows':'agents'}/${item.slug}`;
for(const item of items) test(`finance ${item.type} complete download: ${item.slug}`,async({page},info)=>{
  const paidCalls:string[]=[];
  await page.route('**/api/compose',route=>{if(route.request().method()==='POST'){paidCalls.push(route.request().url());return route.abort();}return route.continue();});
  await page.goto(route(item));
  await expect(page.getByRole('heading',{level:1})).toHaveText(publishedNames.get(item.slug));
  let download;
  if(item.type==='skill') {
    const button=page.getByRole('button',{name:'Download skill',exact:true});await expect(button).toBeEnabled();
    [download]=await Promise.all([page.waitForEvent('download'),button.click()]);
  } else {
    const button=page.getByRole('button',{name:'Download task pack',exact:true});await expect(button).toBeEnabled();
    [download]=await Promise.all([page.waitForEvent('download'),button.click()]);
  }
  expect(download.suggestedFilename()).toMatch(/\.zip$/);
  const filename=info.outputPath(download.suggestedFilename());await download.saveAs(filename);
  const files=unzipSync(fs.readFileSync(filename));
  const root=item.type==='skill'?`${item.slug}/`:`skills/${item.slug}/`;
  expect(files[root+'SKILL.md']).toBeTruthy();expect(files[root+'LICENSE']).toBeTruthy();
  const own=strFromU8(files[root+'SKILL.md']);expect(own).toContain('MISSING:');expect(own).toContain('CHECKS MISSED');
  if(item.type==='skill') {
    for(const file of ['references/model.json','scripts/run-model.mjs','examples/model.xlsx','examples/inputs.json','examples/expected.json'])expect(files[root+file],file).toBeTruthy();
    const model=JSON.parse(strFromU8(files[root+'references/model.json']));
    expect(model.outputs.length).toBeGreaterThan(0);expect(Object.keys(model.expected).sort()).toEqual([...model.outputs].sort());
    const xlsx=unzipSync(files[root+'examples/model.xlsx']);expect(xlsx['xl/workbook.xml']).toBeTruthy();
    expect(Object.entries(xlsx).some(([name,bytes])=>/^xl\/worksheets\/sheet\d+\.xml$/.test(name)&&/<(?:[A-Za-z_][\w.-]*:)?f(?:\s|>)/.test(strFromU8(bytes)))).toBeTruthy();
  } else {
    for(const file of ['HANDOFF.md','START_HERE.txt','workflow.json'])expect(files[file],file).toBeTruthy();
    const definition=JSON.parse(strFromU8(files['workflow.json']));expect(definition.steps).toHaveLength(1);expect(definition.steps[0].skill).toBe(item.slug);
    const deps=item.type==='agent'?[item.workflow,item.extra]:item.steps.map((step:any)=>step.uses);
    for(const id of deps)expect(files[`skills/${id}/SKILL.md`],id).toBeTruthy();
  }
  expect(paidCalls).toEqual([]);
});
for(const width of [320,390]) test(`@mobile finance ${width}px all 210 pages`,async({page},info)=>{
  test.setTimeout(360000);await page.setViewportSize({width,height:844});
  for(let index=0;index<items.length;index++) {
    const item=items[index];await page.goto(route(item));
    await expect(page.getByRole('heading',{level:1})).toHaveText(publishedNames.get(item.slug));
    await expect(page.locator('#app-loader')).toBeHidden();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),item.slug).toBeLessThanOrEqual(0);
    if(index%35===0)await page.screenshot({path:info.outputPath(`${width}-${item.slug}.png`),fullPage:true});
  }
});
