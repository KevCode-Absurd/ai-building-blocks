// Promote only the reviewed new finance directories. Never overwrite an existing item.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const repo=path.resolve('.'),isolated=path.resolve('runs/finance-source'),file='reports/finance-expansion-manifest.json';
const manifest=JSON.parse(await fs.readFile(file,'utf8'));
assert.equal(path.resolve(manifest.sourceRoot),isolated);assert.equal(manifest.items.length,210);
assert.equal(JSON.parse(await fs.readFile('reports/finance-peer-qa.json','utf8')).independentMethodReviews,210);
assert.equal(JSON.parse(await fs.readFile('reports/finance-model-runtime-qa.json','utf8')).passed,120);
const targets=[];
for(const item of manifest.items){
  const source=path.resolve(item.dir);assert(source.startsWith(isolated+path.sep));
  const relative=path.relative(isolated,source);assert(/^catalogue-items[\\/](general|orchestrators|agents)[\\/][a-z0-9-]+$/.test(relative));
  const destination=path.resolve(repo,relative);assert(destination.startsWith(path.join(repo,'catalogue-items')+path.sep));
  await assert.rejects(fs.stat(destination),{code:'ENOENT'});targets.push({source,destination,slug:item.slug});
}
const checks=[];
for(const target of targets){await fs.cp(target.source,target.destination,{recursive:true});
  for(const entry of await fs.readdir(target.source,{recursive:true,withFileTypes:true}))if(entry.isFile()){
    const sourceFile=path.join(entry.parentPath,entry.name),relative=path.relative(target.source,sourceFile),destination=path.join(target.destination,relative);
    const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),expected=digest(await fs.readFile(sourceFile));
    assert.equal(digest(await fs.readFile(destination)),expected);checks.push({slug:target.slug,file:relative.replaceAll('\\','/'),sha256:expected});
  }
}
await fs.writeFile('reports/finance-source-promotion.json',JSON.stringify({createdOn:new Date().toISOString(),status:'pass',items:targets.length,files:checks.length,sourceRoot:isolated,checks},null,2)+'\n');
console.log(JSON.stringify({promoted:targets.length,verifiedFiles:checks.length}));
