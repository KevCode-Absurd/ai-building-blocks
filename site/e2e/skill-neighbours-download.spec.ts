import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {unzipSync,strFromU8,zipSync,strToU8} from 'fflate';
import {build} from 'esbuild';

// Exercise the real shared component without account services or a running dev server.
async function fixture(page:Page){
  const bundle=await build({stdin:{resolveDir:process.cwd(),loader:'tsx',contents:`
    import {createRoot} from 'react-dom/client';
    import SkillNeighbours from './src/SkillNeighbours';
    const blocks=[{slug:'prepare',name:'Research planner'},{slug:'current',name:'Draft writer'},{slug:'review',name:'Draft reviewer',hasFiles:true}].map(b=>({...b,type:'skill',category:'general'}));
    const c={blocks,bySlug:Object.fromEntries(blocks.map(b=>[b.slug,b]))};
    const plan={chain:[{...blocks[0],url:'/skills/prepare',label:'Prepare your research.'}],next:[{...blocks[2],url:'/skills/review',label:'Check your draft.',takes:['draft']}]};
    createRoot(document.getElementById('root')).render(<main style={{maxWidth:900,margin:'auto',padding:16}}><SkillNeighbours block={blocks[1]} plan={plan} c={c} onAdd={slugs=>window.addedSkills=slugs}/></main>);
  `},jsx:'automatic',jsxImportSource:'preact',alias:{react:'preact/compat','react-dom/client':'preact/compat/client'},bundle:true,write:false,format:'iife',platform:'browser'});
  await page.route('https://neighbours.test/**',async route=>{
    const path=new URL(route.request().url()).pathname;
    if(path==='/skills/review.zip')return route.fulfill({contentType:'application/zip',body:Buffer.from(zipSync({'review/SKILL.md':strToU8('# Review'),'review/references/checklist.md':strToU8('Check the evidence.')}))});
    if(path.endsWith('/SKILL.md'))return route.fulfill({contentType:'text/plain',body:'# '+path.split('/')[2]});
    return route.fulfill({contentType:'text/html',body:'<!doctype html><html data-theme="dark"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div></body></html>'});
  });
  await page.goto('https://neighbours.test/');
  for(const file of ['styles.css','block-flow.css','task-simplicity.css'])await page.addStyleTag({content:await readFile(`src/${file}`,'utf8')});
  await page.addScriptTag({content:bundle.outputFiles[0].text});
}

for(const mobile of [false,true])test(`${mobile?'@mobile ':''}before and after skills have links, ordered selections and complete downloads`,async({page},info)=>{
  if(mobile)await page.setViewportSize({width:375,height:812});
  await fixture(page);
  const section=page.getByTestId('skill-neighbours');
  await expect(section).toBeVisible();
  // Plain links first; the checkboxes and order appear only when you ask to download several.
  await expect(section.getByRole('checkbox')).toHaveCount(0);
  await section.getByTestId('skill-neighbours-pick').click();
  const boxes=section.getByRole('checkbox');
  const count=await boxes.count();expect(count).toBeGreaterThan(1);
  await expect(section.getByRole('button',{name:'Download selected (1)',exact:true})).toBeEnabled();
  const links=section.locator('.skill-neighbours-choice a');
  for(const link of await links.all())expect(await link.getAttribute('href')).toMatch(/^\/(skills|prompts|routines|workflows|agents)\/[a-z0-9-]+$/);
  for(const box of await boxes.all())await box.check();
  const ordered=section.getByTestId('skill-selected-order');
  const original=await ordered.locator('li > a').evaluateAll(nodes=>nodes.map(node=>({name:node.textContent,slug:node.getAttribute('href')!.split('/').pop()})));
  await ordered.getByRole('button',{name:`Move ${original[1].name} up`,exact:true}).click();
  await expect(ordered.locator('li > a').first()).toHaveText(original[1].name!);
  await expect(ordered.getByRole('button',{name:`Move ${original[1].name} up`,exact:true})).toBeDisabled();
  await section.screenshot({path:info.outputPath('skill-neighbours-selected.png')});
  const selectedEvent=page.waitForEvent('download');
  await section.getByRole('button',{name:`Download selected (${count})`,exact:true}).click();
  const selected=await selectedEvent;
  const files=unzipSync(new Uint8Array(await readFile((await selected.path())!)));
  const selectedOrder=JSON.parse(strFromU8(files['skill-order.json']));
  expect(selectedOrder.map((row:any)=>row.slug)).toEqual([original[1].slug,original[0].slug,...original.slice(2).map(row=>row.slug)]);
  for(const row of selectedOrder)expect(files[row.file]).toBeTruthy();
  expect(strFromU8(files['review/references/checklist.md'])).toBe('Check the evidence.');
  await boxes.first().uncheck();
  const allEvent=page.waitForEvent('download');
  await section.getByRole('button',{name:`Download all (${count})`,exact:true}).click();
  const all=await allEvent;
  const allFiles=unzipSync(new Uint8Array(await readFile((await all.path())!)));
  expect(JSON.parse(strFromU8(allFiles['skill-order.json'])).map((row:any)=>row.slug)).toEqual(original.map(row=>row.slug));
  for(const box of await boxes.all())await box.uncheck();
  await expect(section.getByRole('button',{name:'Download selected (0)',exact:true})).toBeDisabled();
  await expect(section.getByRole('button',{name:`Download all (${count})`,exact:true})).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(mobile)expect(await page.evaluate(()=>innerWidth)).toBe(375);
  await section.screenshot({path:info.outputPath('skill-neighbours.png')});
});

test('a failed download shows a retryable error and keeps selected skills',async({page})=>{
  await fixture(page);
  await page.route('**/skills/*/SKILL.md',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.route('**/skills/*.zip',route=>route.fulfill({status:503,body:'Unavailable'}));
  const section=page.getByTestId('skill-neighbours');
  await section.getByTestId('skill-neighbours-pick').click();
  await section.getByRole('button',{name:'Download selected (1)',exact:true}).click();
  await expect(section.getByRole('alert')).toContainText(/Couldn't load/);
  await expect(section.getByRole('button',{name:'Download selected (1)',exact:true})).toBeEnabled();
  await expect(section.getByTestId('skill-selected-order').locator('li')).toHaveCount(1);
  await page.unroute('**/skills/*/SKILL.md');
  await page.unroute('**/skills/*.zip');
  const pending=page.waitForEvent('download');
  await section.getByRole('button',{name:'Download selected (1)',exact:true}).click();
  await pending;
  await expect(section.getByRole('alert')).toHaveCount(0);
});
