// Read-only comparison of public production catalogue assets against a frozen
// candidate and local Vite output. No account endpoints, writes, or provider calls.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
const [candidateArg,distArg]=process.argv.slice(2);
assert(candidateArg&&distArg,'Usage: node tools/compare-live-catalogue.mjs <frozen-assets> <site/dist>');
const candidate=path.resolve(candidateArg),dist=path.resolve(distArg),base='https://useaiblocks.com';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=['data/blocks.json','data/library-search.json','data/public-api-manifest.json','data/starter-blocks.json','data/ai-tools.json'];
const result={checkedOn:new Date().toISOString(),origin:base,readOnly:true,files:{},catalogueDiff:null};
let liveCatalogue, candidateCatalogue;
for(const file of files){
 const response=await fetch(base+'/'+file,{signal:AbortSignal.timeout(30000)});assert.equal(response.status,200,file);
 const live=Buffer.from(await response.arrayBuffer()),candidateBytes=await fs.readFile(path.join(candidate,file));
 let distHash=null;if(await fs.stat(path.join(dist,file)).then(()=>true).catch(()=>false))distHash=sha(await fs.readFile(path.join(dist,file)));
 result.files[file]={liveSha256:sha(live),candidateSha256:sha(candidateBytes),distSha256:distHash,liveEqualsCandidate:sha(live)===sha(candidateBytes),liveEqualsDist:distHash===sha(live),bytes:live.length};
 if(file==='data/blocks.json'){liveCatalogue=JSON.parse(live.toString('utf8'));candidateCatalogue=JSON.parse(candidateBytes.toString('utf8'));}
}
const liveBy=new Map(liveCatalogue.blocks.map(b=>[b.slug,b])),candidateBy=new Map(candidateCatalogue.blocks.map(b=>[b.slug,b]));
const liveOnly=[...liveBy.keys()].filter(k=>!candidateBy.has(k)).sort(),candidateOnly=[...candidateBy.keys()].filter(k=>!liveBy.has(k)).sort();
const changed=[];for(const [slug,live] of liveBy){const other=candidateBy.get(slug);if(other&&sha(Buffer.from(JSON.stringify(live)))!==sha(Buffer.from(JSON.stringify(other))))changed.push(slug);}
result.catalogueDiff={liveEntries:liveBy.size,candidateEntries:candidateBy.size,liveOnly,candidateOnly,changedCommonRecords:changed.sort()};
console.log(JSON.stringify(result,null,2));
