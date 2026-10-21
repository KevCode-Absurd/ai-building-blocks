// Exercises real Pages Functions and D1, using an explicitly local emulator only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.CF_LOCAL_URL || 'http://127.0.0.1:5183';
assert(['127.0.0.1','localhost'].includes(new URL(base).hostname),'Local emulator only');
const checks=[];
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
for(const url of ['/','/skills/website-brand-brain-builder','/example-app/','/s/'+newToken]){const page=await fetch(base+url);assert.equal(page.status,200,url);assert((await page.text()).includes('<html'),url)}checks.push('static, skill, example and shared deep links');
r=await fetch(base+'/this-page-does-not-exist-'+suffix);assert.equal(r.status,404);checks.push('unknown page returns 404');
const report={checkedOn:'2026-10-22',environment:'local Pages emulator with migrated D1',productionTouched:false,passed:checks.length,checks};
fs.writeFileSync('reports/cloudflare-local-api-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
