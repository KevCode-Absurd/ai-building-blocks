// Read-only production verification of every new agent's page and complete source pack.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const ROOT=path.resolve(import.meta.dirname,'..'),require=createRequire(path.join(ROOT,'site/package.json'));
const {unzipSync}=require('fflate');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const arg=k=>{const at=process.argv.indexOf(k);return at>=0?process.argv[at+1]:null;};
const expectedAssets=arg('--assets');
assert(expectedAssets,'Pass --assets <the exact deployed frozen assets>.');
const out=path.resolve(arg('--out')??path.join(ROOT,'reports/2026-10-25-agency-agents-live.json'));
const receipt=JSON.parse(await fs.readFile(path.join(ROOT,'reports/2026-10-25-agency-agents-import.json'),'utf8'));
const origin='https://useaiblocks.com',checks=[];
let requests=0;
async function fetchBytes(route){
 assert(route.startsWith('/')&&!route.includes('..'));
 requests++;
 const response=await fetch(origin+route,{signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,200,route+' must be live');
 return Buffer.from(await response.arrayBuffer());
}
async function exact(file,route='/'+file){
 const [actual,expected]=await Promise.all([fetchBytes(route),fs.readFile(path.join(expectedAssets,file))]);
 assert.equal(sha(actual),sha(expected),'Live bytes differ: '+route);
 return actual;
}
const report={status:'running',origin,startedOn:new Date().toISOString(),expectedAssets:path.resolve(expectedAssets),sourceCommit:receipt.commit,requests:0,checks,productionWrites:0,providerCalls:0};
try{
 const catalogue=JSON.parse(await exact('data/blocks.json'));
 const api=JSON.parse(await exact('data/public-api-manifest.json'));
 const search=JSON.parse(await exact('data/library-search.json'));
 const ids=new Set(catalogue.blocks.map(b=>b.slug));
 assert.equal(search.sourceHash,sha(await fs.readFile(path.join(expectedAssets,'data/blocks.json'))));
 let next=0;
 await Promise.all(Array.from({length:6},async()=>{
  while(next<receipt.rows.length){
   const row=receipt.rows[next++];assert(ids.has(row.slug),'Missing agent: '+row.slug);
   assert(search.docs.includes(row.slug));assert.equal(api.resources[row.slug]?.reference_validation.status,'PASS');
   const base='skills/'+row.slug;
   const page=JSON.parse(await exact(`data/pages/${row.slug}.json`));
   assert.equal(page.source.commit,receipt.commit);assert.equal(page.source.licence,'MIT');
   await exact(base+'/SKILL.md');
   const zipBytes=await exact(base+'.zip'),zip=unzipSync(new Uint8Array(zipBytes));
   assert.equal(sha(zip[row.slug+'/references/source-agent.md']),row.sourceSha256);
   assert(Buffer.from(zip[row.slug+'/LICENSE']).toString('utf8').includes('Permission is hereby granted'));
   assert(zip[row.slug+'/SETUP.md']);
   const html=await exact(`agents/${row.slug}.html`,`/agents/${row.slug}`);
   assert(html.toString('utf8').includes('https://useaiblocks.com/agents/'+row.slug));
   checks.push({slug:row.slug,status:'pass',sourceSha256:row.sourceSha256,archiveSha256:sha(zipBytes)});
  }
 }));
 assert.equal(checks.length,283);checks.sort((a,b)=>a.slug.localeCompare(b.slug));
 report.status='pass';report.catalogueEntries=catalogue.blocks.length;report.agents=checks.length;
}catch(error){report.status='fail';report.error=String(error.stack??error);throw error;}
finally{report.requests=requests;report.finishedOn=new Date().toISOString();await fs.mkdir(path.dirname(out),{recursive:true});await fs.writeFile(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,agents:checks.length,requests,error:report.error,report:out}));}
