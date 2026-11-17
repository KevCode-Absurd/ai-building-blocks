import {test,expect} from '@playwright/test';
const decode=(text:string)=>text.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');

test('source-stated dates remain unverified in static HTML and on a narrow hydrated page',async({page,request})=>{
  await page.route('**/api/**',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort());
  const html=await(await request.get('/skills/uae-rules-finder')).text();
  expect(html).toContain('Source-stated date 2026-08-15');expect(html).toContain('More than 60 days old');
  await page.setViewportSize({width:375,height:812});await page.goto('/skills/uae-rules-finder');
  const checks=page.getByTestId('fact-checks');await expect(checks).toBeVisible();await checks.locator('summary').click();
  await expect(checks).toContainText('AI Blocks has not independently checked');await expect(checks).toContainText('More than 60 days old');
  await expect(checks.getByRole('link',{name:'Source 1',exact:true})).toHaveAttribute('href',/^https:\/\/github\.com\//);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('usage markup retains the imported CreativeWork and follows visible steps without claiming a live test',async({page,request})=>{
  // Structured data is only on pages that ask to be in Google (search keep rule, 17 Nov 2026), so read a kept imported skill.
  const route='/skills/compliance-checklist',html=await(await request.get(route)).text();
  const raw=html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];expect(raw).toBeTruthy();
  const graph=JSON.parse(raw!);const nodes=Array.isArray(graph)?graph:graph['@graph'];
  const main=nodes.find((node:any)=>node['@type']==='WebPage')?.mainEntity;
  expect(main['@type']).toBe('CreativeWork');expect(main.author).toBeTruthy();expect(main.license).toBeTruthy();
  expect(main.hasPart['@type']).toBe('HowTo');expect(main.hasPart.url).toBe('https://useaiblocks.com'+route+'#use');
  expect(main.hasPart.author).toBeUndefined();expect(main.hasPart.totalTime).toBeUndefined();
  await page.goto('/skills/stock-count-updater');await expect(page.getByTestId('fact-checks')).toBeVisible();
  await page.getByTestId('fact-checks').locator('summary').click();
  await expect(page.getByTestId('fact-checks')).toContainText('No sign-in or store operation was run.');
});

test('internal skill navigation keeps the generated title, canonical and structured data for its destination',async({page,request})=>{
  await page.goto('/skills/compliance-checklist');
  const next=page.locator('.bp-next a[href^="/skills/"]').first();await expect(next).toBeVisible();
  const target=await next.getAttribute('href');expect(target).toBeTruthy();
  const html=await(await request.get(target!)).text(),title=decode(html.match(/<title>([^<]*)<\/title>/)![1]);
  await next.click();await expect(page).toHaveURL(new RegExp(target!+'$'));await expect(page).toHaveTitle(title);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://useaiblocks.com'+target);
  await expect(page.locator('html')).toHaveAttribute('data-metadata-path',target!);
  // A destination left out of Google (noindex) carries no structured data, the same as its static HTML.
  if (!html.includes('application/ld+json')) { await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0); return; }
  const schema=await page.locator('script[type="application/ld+json"]').textContent();expect(schema).toContain('https://useaiblocks.com'+target);
});

for (const mobile of [false,true]) test((mobile?'@mobile ':'')+'skill diagram keeps an existing unsaved task and opens the current before/after controls',async({page},info)=>{
  const writes:string[]=[];
  await page.route('**/api/**',route=>{if(!['GET','HEAD','OPTIONS'].includes(route.request().method()))writes.push(route.request().url());return route.fulfill({status:401,json:{error:'Blocked by local fixture'}});});
  await page.addInitScript(()=>localStorage.setItem('abb:v1',JSON.stringify({kits:[],flows:[],recent:[],currentFlow:null,draft:{id:'synthetic-draft',name:'Synthetic existing task',goal:'Keep the supplied goal',notes:'KEEP_SYNTHETIC_FLOW_NOTES',nodes:[{id:'existing',slug:'request-deliverable-drafter',x:40,y:0,notes:'KEEP_SYNTHETIC_STEP_NOTES'}],edges:[],updated:0}})));
  if(mobile)await page.setViewportSize({width:375,height:812});
  await page.goto('/skills/voice-and-tone-guide-writer');
  const diagram=page.getByTestId('skill-neighbours');await expect(diagram).toBeVisible();
  await expect(page.getByTestId('skill-before')).toBeVisible();await expect(page.getByTestId('skill-after')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await diagram.screenshot({path:info.outputPath(mobile?'neighbours-mobile.png':'neighbours-desktop.png')});
  await page.getByTestId('add-this-skill').click();await expect(page.getByTestId('builder')).toBeVisible();
  await expect(page.getByTestId('flow-node')).toHaveCount(2);await expect(page.getByRole('textbox',{name:'Workflow name',exact:true})).toHaveValue('Synthetic existing task');
  await expect(page.getByTestId('chain-before')).toBeVisible();await expect(page.getByTestId('chain-after')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>{const draft=JSON.parse(localStorage.getItem('abb:v1')||'{}').draft;return draft?.notes==='KEEP_SYNTHETIC_FLOW_NOTES'&&draft.nodes.some((node:any)=>node.id==='existing'&&node.notes==='KEEP_SYNTHETIC_STEP_NOTES');})).toBe(true);
  expect(writes).toHaveLength(0);
});
