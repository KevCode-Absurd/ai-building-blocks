// Exercises the real Workers Static Assets router and D1, locally only; no provider calls.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.CF_LOCAL_URL || 'http://127.0.0.1:5183';
assert(['127.0.0.1','localhost'].includes(new URL(base).hostname),'Local emulator only');
const checks=[];
const fetch=(input,options={})=>globalThis.fetch(input,{...options,signal:AbortSignal.timeout(30000)});
async function call(url,method='GET',data,key){
 const response=await fetch(base+url,{method,headers:{...(data?{'content-type':'application/json'}:{}),...(key?{authorization:`Bearer ${key}`}:{})},...(data?{body:JSON.stringify(data)}:{})});
 const text=await response.text();let body;try{body=JSON.parse(text)}catch{body=text}
 return {status:response.status,body};
}
const suffix=Date.now().toString(36),slug='local-launch-check-'+suffix;
let r=await call('/api/comments','POST',{slug,body:'Local D1 launch verification',name:'Local test'});assert.equal(r.status,201);const comment=r.body.comment;
r=await call('/api/comments?slug='+slug);assert(r.body.comments.some(c=>c.id===comment.id));checks.push('comment persisted in D1');
r=await call('/api/comments?id='+comment.id,'DELETE');assert.equal(r.status,403);checks.push('comment moderation requires team token');
const made=await call('/api/spaces','POST',{name:'Local launch verification '+suffix});assert.equal(made.status,201);const {ownerKey,shareToken}=made.body;
r=await call('/api/spaces/me');assert.equal(r.status,401);
r=await call('/api/spaces/me','GET',undefined,'incorrect-owner-key');assert.equal(r.status,401);checks.push('space owner authorization');
r=await call('/api/spaces/me/items','POST',{kind:'skill',title:'Local private item',body:'Only local fixture',visibility:'private'},ownerKey);assert.equal(r.status,201);const item=r.body.item;
r=await call('/api/spaces/me','GET',undefined,ownerKey);assert(r.body.items.some(i=>i.id===item.id));checks.push('space item persisted in D1');
r=await call('/api/spaces/public');assert(!r.body.items.some(i=>i.id===item.id));checks.push('private item excluded from public listing');
r=await call('/api/spaces/shared/'+shareToken);assert.equal(r.status,200);assert(r.body.items.some(i=>i.id===item.id));
r=await call('/api/spaces/shared/'+shareToken,'POST',{name:'Forbidden'});assert.equal(r.status,405);checks.push('shared space is read only');
r=await call('/api/spaces/me/link','POST',{},ownerKey);assert.equal(r.status,200);const newToken=r.body.shareToken;
r=await call('/api/spaces/shared/'+shareToken);assert.equal(r.status,404);
r=await call('/api/spaces/shared/'+newToken);assert.equal(r.status,200);checks.push('share rotation invalidates prior link');
r=await call('/api/spaces/me/items/'+item.id,'DELETE',undefined,ownerKey);assert.equal(r.status,200);
for(const url of ['/','/how-it-works','/minds','/tools','/compose','/space','/people','/skills/website-brand-brain-builder','/example-app/','/s/'+newToken]){const page=await fetch(base+url,{redirect:'manual'});assert.equal(page.status,200,url);assert.equal(page.headers.get('location'),null,url);assert((await page.text()).includes('<html'),url)}checks.push('static, composer, space, example and shared deep links preserve their URLs');
r=await fetch(base+'/this-page-does-not-exist-'+suffix);assert.equal(r.status,404);checks.push('unknown page returns 404');
const redirect=fs.readFileSync('site/dist/_redirects','utf8').split(/\r?\n/).find(line=>line.endsWith(' 301')).split(/\s+/);
r=await fetch(base+redirect[0],{redirect:'manual'});assert.equal(r.status,301);assert.equal(new URL(r.headers.get('location'),base).pathname,redirect[1]);checks.push('legacy skill URL keeps its permanent redirect');
r=await fetch(base+'/skills/fact-based-ad-copy-writer?source=saved',{redirect:'manual'});assert.equal(r.status,301);assert.equal(new URL(r.headers.get('location'),base).pathname,'/prompts/fact-based-ad-copy-writer');assert.equal(new URL(r.headers.get('location'),base).search,'?source=saved');
r=await fetch(base+'/skills/no-such-thing',{redirect:'manual'});assert.equal(r.status,404);checks.push('wrong block types repair canonical URLs while unknown slugs keep a real 404');
const downloadable=JSON.parse(fs.readFileSync('site/dist/data/blocks.json','utf8')).blocks.find(b=>b.hasFiles);
assert(downloadable,'A complete skill ZIP must be available');
for(const asset of ['skills/website-brand-brain-builder/SKILL.md',`skills/${downloadable.slug}.zip`,'data/blocks.json']){
  r=await fetch(base+'/'+asset);assert.equal(r.status,200,asset);assert.deepEqual(Buffer.from(await r.arrayBuffer()),fs.readFileSync('site/dist/'+asset),asset);
}checks.push('skill source, ZIP download and catalogue bytes unchanged');
r=await fetch(base+'/skills/website-brand-brain-builder/SKILL.md',{method:'HEAD'});assert.equal(r.status,200);assert.equal(await r.text(),'');assert.equal(r.headers.get('x-content-type-options'),'nosniff');assert.match(r.headers.get('cache-control'),/max-age=300/);checks.push('asset HEAD, security and cache headers preserved');
r=await fetch(base+'/example-app/');assert((await r.text()).includes('noindex'));checks.push('saved example remains excluded from indexing');
r=await call('/api/compose');assert.equal(r.status,200);assert.deepEqual(r.body,{enabled:false});checks.push('composer metadata available with paid AI disabled and no model details');
r=await call('/api/unknown');assert.equal(r.status,404);assert.equal(typeof r.body.error,'string');checks.push('unknown API returns JSON 404 rather than an HTML shell');
const report={checkedOn:'2026-10-22',environment:'local Workers Static Assets emulator with migrated D1',productionTouched:false,providerCalls:0,passed:checks.length,checks};
fs.writeFileSync('reports/cloudflare-local-api-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
