// Verify discovery and complete agent handoff downloads against the built site.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import crypto from 'node:crypto';
const ROOT=path.resolve(import.meta.dirname,'..');
const require=createRequire(path.join(ROOT,'site/package.json'));
const {chromium,expect}=require('@playwright/test'),{unzipSync}=require('fflate');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const arg=key=>{const at=process.argv.indexOf(key);return at>=0?process.argv[at+1]:null;};
const rows=JSON.parse(await fs.readFile(path.join(ROOT,'reports/2026-10-25-agency-agents-import.json'),'utf8')).rows;
const assets=path.resolve(arg('--assets')??path.join(ROOT,'site/dist')),out=path.resolve(arg('--out')??path.join(ROOT,'reports/2026-10-25-agency-agents-browser'));
const externalOrigin=arg('--origin');
if(externalOrigin)assert.equal(new URL(externalOrigin).origin,'https://useaiblocks.com');
await fs.mkdir(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.zip':'application/zip','.md':'text/plain','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.webp':'image/webp'};
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=new URL(req.url,'http://local').pathname;
  if(pathname.startsWith('/api/')){res.writeHead(404,{'content-type':'application/json'});res.end('{"error":"Local static preview"}');return;}
  let target=path.resolve(assets,'.'+decodeURIComponent(pathname));
  assert(target===assets||target.startsWith(assets+path.sep));
  const stat=await fs.stat(target).catch(()=>null);
  if(stat?.isDirectory())target=path.join(target,'index.html');
  else if(!stat&& !path.extname(target))target=await fs.stat(target+'.html').then(()=>target+'.html').catch(()=>path.join(assets,'index.html'));
  res.writeHead(200,{'content-type':mime[path.extname(target)]??'application/octet-stream'});res.end(await fs.readFile(target));
 }catch{res.writeHead(404);res.end('Not found');}
});
if(!externalOrigin)await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=externalOrigin??'http://127.0.0.1:'+server.address().port;
const report={status:'running',startedOn:new Date().toISOString(),origin,builtAssets:assets,profiles:[],liveDeployment:!!externalOrigin};
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 for(const profile of [{name:'desktop',viewport:{width:1440,height:1000}},{name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true}]){
  const context=await browser.newContext({...profile,permissions:['clipboard-read','clipboard-write'],acceptDownloads:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  const proof={profile:profile.name,checks:[]};
  for(const rel of profile.name==='desktop'?['engineering/engineering-frontend-developer.md','specialized/agentic-identity-trust.md']:['security/security-penetration-tester.md','finance/finance-bookkeeper-controller.md']){
   const row=rows.find(r=>r.path===rel);assert(row);
   await page.goto(origin+'/#library',{waitUntil:'domcontentloaded'});
   const cookie=page.getByRole('button',{name:/reject cookies/i});if(await cookie.isVisible())await cookie.click();
   const search=page.getByTestId('library-search');await expect(search).toBeVisible();await search.fill(row.name);
   const card=page.locator(`[data-testid="block-card"][data-slug="${row.slug}"]`);
   await expect(card).toBeVisible({timeout:20000});await card.click();
   await expect(page.locator('main h1')).toHaveText(row.name);
   await expect(page.getByTestId('gh-pill')).toContainText('msitarzewski/agency-agents');
   await expect(page.getByTestId('gh-pill')).toContainText('MIT');
   assert((await page.getByTestId('gh-pill').getAttribute('href')).includes('/b37b5bb33b78f2c1d6567d98e25ca818e3259219/'));
   await expect(page.getByTestId('tested')).toHaveCount(0);
   await expect(page.getByTestId('copy-skill')).toBeEnabled();await page.getByTestId('copy-skill').click();
   const copied=await page.evaluate(()=>navigator.clipboard.readText());assert(copied.includes('references/source-agent.md'));assert(copied.includes("user's authorization"));
   const pending=page.waitForEvent('download');await page.getByTestId('download-task').click();const download=await pending;
   assert((await download.suggestedFilename()).endsWith('.zip'));
   const bytes=await fs.readFile(await download.path()),archive=unzipSync(bytes),files=Object.keys(archive);
   const source=files.find(f=>f.endsWith(`/${row.slug}/references/source-agent.md`));assert(source,'Complete handoff must include original profile');assert.equal(sha(archive[source]),row.sourceSha256);
   assert(files.some(f=>f.endsWith(`/${row.slug}/LICENSE`)));assert(files.some(f=>f.endsWith(`/${row.slug}/SETUP.md`)));
   if(rel==='specialized/agentic-identity-trust.md')assert(files.some(f=>f.endsWith(`/${row.slug}/references/identity-graph-operator.md`)));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:path.join(out,profile.name+'-'+row.slug+'.png')});
   proof.checks.push({slug:row.slug,discovery:true,sourceCredit:true,copy:true,completeDownload:true,archiveFiles:files.length,archiveSha256:sha(bytes),horizontalOverflow:false});
   await page.getByRole('link',{name:'Back to results',exact:true}).click();await expect(page.getByTestId('library-search')).toHaveValue(row.name);
  }
  assert.deepEqual(errors,[]);proof.pageErrors=errors;report.profiles.push(proof);await context.close();
 }
 report.status='pass';
}catch(error){report.status='fail';report.error=String(error.stack??error);throw error;}
finally{report.finishedOn=new Date().toISOString();await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');if(browser)await browser.close();if(server.listening)await new Promise(resolve=>server.close(resolve));console.log(JSON.stringify(report));}
