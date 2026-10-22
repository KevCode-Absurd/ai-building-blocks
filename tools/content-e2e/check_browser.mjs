// Browser-level report QA: local source retrieval, mobile layout, print export.
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(path.join(process.env.RUNTIME_NODE_MODULES,'__runtime__.cjs'));
const {chromium}=require('playwright');
const root=path.resolve(process.argv[2]);
const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1:5197');
    const file=path.resolve(root,'artifacts','.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(path.resolve(root,'artifacts')+path.sep)){res.writeHead(403);res.end();return;}
    const bytes=await fs.readFile(file);
    res.setHeader('content-type',file.endsWith('.html')?'text/html; charset=utf-8':'application/json');res.end(bytes);
  }catch {res.writeHead(404);res.end('Not found');}
});
await new Promise((resolve,reject)=>server.listen(5197,'127.0.0.1',resolve).on('error',reject));
const browser=await chromium.launch({headless:true,channel:'chrome'});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5197/equity-research.html');
 const desktop=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,sections:document.querySelectorAll('main>section').length,lang:document.documentElement.lang,missingAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)}));
 await page.screenshot({path:path.join(root,'qa/equity-desktop.png'),fullPage:true});
 const links=await page.locator('[data-source-field="url"]').evaluateAll(as=>as.map(a=>a.href));const sources=[];
 for(const url of links){const response=await page.request.get(url);const obj=await response.json();sources.push({url,status:response.status(),synthetic:obj.label.startsWith('SYNTHETIC')});}
 const mobile=[];
 for(const width of [320,393,768]){
  await page.setViewportSize({width,height:900});
  mobile.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollableTables:document.querySelectorAll('.table-wrap').length,heading:document.querySelector('h1').textContent})));
  if(width===320)await page.screenshot({path:path.join(root,'qa/equity-mobile.png'),fullPage:false});
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.pdf({path:path.join(root,'artifacts/equity-research.pdf'),printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:'<div></div>',footerTemplate:'<div style="font-size:8px;width:100%;text-align:center;color:#566574">SYNTHETIC SAMPLE | 22 October 2026 | <span class="pageNumber"></span> / <span class="totalPages"></span></div>',margin:{top:'12mm',bottom:'12mm',left:'12mm',right:'12mm'}});
 const result={desktop,mobile,sources,pageErrors:errors};
 await fs.writeFile(path.join(root,'qa/equity-browser.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
 if(desktop.scrollWidth>desktop.width||desktop.missingAnchors.length||desktop.lang!=='en'||desktop.sections!==11||mobile.some(x=>x.scrollWidth>x.width)||errors.length||sources.some(s=>s.status!==200||!s.synthetic))throw Error('Report browser checks failed');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
