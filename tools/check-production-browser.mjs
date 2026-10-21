import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(new URL('../site/package.json',import.meta.url));
const {chromium}=require('@playwright/test');
const base=process.env.CF_LOCAL_URL || 'http://127.0.0.1:5183';
assert(['127.0.0.1','localhost'].includes(new URL(base).hostname),'Local preview only');
fs.mkdirSync('reports/usability-final',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try{
 for(const width of [320,393,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},colorScheme:'dark'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/');await page.getByTestId('block-card').first().waitFor();
  assert.equal(await page.getByTestId('block-card').count(),16);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: home overflow`);
  await page.screenshot({path:`reports/usability-final/home-${width}.png`});
  if(width===1440){await page.locator('#library').scrollIntoViewIfNeeded();await page.screenshot({path:'reports/usability-final/library-1440.png'})}
  await page.getByTestId('show-more').click();assert.equal(await page.getByTestId('block-card').count(),32);
  await page.getByTestId('library-search').fill('Ad claim proof gap finder');
  await page.getByTestId('block-card').filter({hasText:'Ad claims checker'}).first().waitFor();
  for(const path of ['/minds','/tools','/skills/website-brand-brain-builder']){
   await page.goto(base+path);await page.locator('h1').waitFor();
   if(path==='/minds')await page.getByTestId('council-guide').waitFor();
   if(path==='/tools'){await page.getByTestId('tools-search').fill('discount');await page.getByTestId('tool-card').first().waitFor()}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: overflow on ${path}`);
   if(path==='/minds'&&(width===393||width===1440))await page.screenshot({path:`reports/usability-final/minds-${width}.png`});
  }
  if(width===320){
   await page.getByTestId('open-business').click();await page.getByTestId('biz-name').fill('Local example');await page.getByTestId('biz-save').click();
   await page.getByRole('button',{name:'Save to kit',exact:true}).click();await page.getByLabel('New kit name').fill('Local test kit');await page.getByRole('button',{name:'Create',exact:true}).click();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'320: populated header overflow');
  }
  assert.equal(errors.length,0,errors.join('\n'));
  results.push({width,initialCards:16,afterShowMore:32,oldNameSearch:true,noOverflow:true,pageErrors:errors});await context.close();
 }
}finally{await browser.close()}
fs.writeFileSync('reports/production-browser-check.json',JSON.stringify({checkedOn:'2026-10-22',environment:'production assets served by local Cloudflare Pages',results},null,2)+'\n');console.log(JSON.stringify(results));
