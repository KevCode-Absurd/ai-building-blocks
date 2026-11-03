import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs/promises';
import {unzipSync,strFromU8} from 'fflate';

async function guestLoading(page:Page,attach:(name:string,options:any)=>Promise<void>){
  const requests:string[]=[];page.on('request',request=>requests.push(request.url()));
  // A production Vite preview has no account or AI write backend. Never permit a test write.
  await page.route('**/api/**',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort());
  const starter=page.waitForResponse(response=>new URL(response.url()).pathname==='/data/starter-blocks.json'&&response.ok());
  await page.goto('/');await starter;await expect(page.locator('.hero')).toBeVisible();
  await expect(page.getByTestId('library-search')).toBeAttached();
  // Observe the existing delayed globe and idle work too; this is not a speed-score target.
  await page.waitForTimeout(2200);
  const initial=[...requests];
  expect(initial.some(url=>/\/data\/blocks(?:-index)?\.json(?:\?|$)/.test(url))).toBe(false);
  expect(initial.some(url=>/\/assets\/clerk[.-]|clerk\.accounts\.|clerk\.com\//i.test(url))).toBe(false);
  const index=page.waitForResponse(response=>new URL(response.url()).pathname==='/data/blocks-index.json'&&response.ok());
  await page.getByTestId('library-search').fill('meeting notes');await index;
  await expect(page.getByTestId('library-search')).toHaveValue('meeting notes');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await attach('catalogue-network.json',{body:JSON.stringify({initial:initial.map(url=>new URL(url).pathname),afterSearch:requests.map(url=>new URL(url).pathname)},null,2),contentType:'application/json'});
}
test('home loads starter data first and the list only after search intent',async({page},info)=>guestLoading(page,(name,options)=>info.attach(name,options)));
test('@mobile home keeps the starter-first loading and search flow',async({page},info)=>guestLoading(page,(name,options)=>info.attach(name,options)));

test('me.md prompt copies, a synthetic file saves and reopens, and the starter pack downloads',async({page},info)=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as any).__copiedPrompt=text;}}}));
  await page.route('**/api/**',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort());
  await page.goto('/me-md');await expect(page.getByTestId('me-md-page')).toBeVisible();
  await page.getByRole('button',{name:'Copy the prompt',exact:true}).click();
  await expect(page.locator('#copy-status')).toContainText('Prompt copied');
  const copied=await page.evaluate(()=>(window as any).__copiedPrompt);expect(copied).toContain('me.md');expect(copied).toContain('Never');
  await page.getByRole('button',{name:'Your me.md',exact:true}).click();
  const text='# me.md\n\n## Core\nSynthetic editor for a local browser test.\n\n## Never\nNever invent customer quotes.\n';
  await page.getByTestId('me-text').fill(text);await page.getByTestId('biz-save').click();
  await page.getByRole('button',{name:'Your me.md',exact:true}).click();await expect(page.getByTestId('me-text')).toHaveValue(text);await page.getByTestId('biz-save').click();
  await page.reload();await page.getByRole('button',{name:'Your me.md',exact:true}).click();await expect(page.getByTestId('me-text')).toHaveValue(text);await page.getByTestId('biz-save').click();
  const pending=page.waitForEvent('download');await page.getByRole('link',{name:'Download the starter pack (.zip)',exact:true}).click();const download=await pending;const file=info.outputPath('me-md-starter.zip');await download.saveAs(file);
  const files=unzipSync(await fs.readFile(file));expect(Object.keys(files).length).toBeGreaterThan(2);expect(Object.values(files).some(bytes=>strFromU8(bytes).includes('me.md'))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
