// Repair a not-yet-deployed candidate with the reviewed complete-package opt-in.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
const root=path.resolve(process.argv[2]??'');assert(root.startsWith(path.resolve('site/.wrangler/releases')+path.sep));
const release=JSON.parse(await fs.readFile(path.join(root,'release-manifest.json'),'utf8'));
const manifestFile='reports/finance-expansion-manifest.json',manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));
assert.equal(manifest.items.length,210);assert.equal(release.workerUnchanged,true);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const indexFile=path.join(root,'source/site/scripts/build-index.mjs');
const original=await fs.readFile(indexFile,'utf8');
const old='const files = imported ? walk(folder)',replacement='const files = imported || item.package_files === "all" ? walk(folder)';
assert.equal(original.split(old).length,2);const updated=original.replace(old,replacement);
assert.equal(updated.replace(/\r\n?/g,'\n'),(await fs.readFile('site/scripts/build-index.mjs','utf8')).replace(/\r\n?/g,'\n'),'Unrelated build-index changes must not enter this release.');
await fs.writeFile(indexFile,updated);
const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[indexFile],{cwd:path.resolve('site'),windowsHide:true,stdio:'inherit'});child.on('error',reject);child.on('exit',resolve);});assert.equal(code,0);
assert.equal(sha(await fs.readFile('site/public/data/blocks.json')),release.catalogueSha256,'Catalogue changed beyond package completeness; rebuild pages.');
for(const item of manifest.items){
  const governing=await fs.readFile(path.join(item.dir,'SKILL.md'));
  assert.equal(sha(governing),sha(await fs.readFile(path.join(root,'assets/skills',item.slug,'SKILL.md'))),item.slug+' governing instructions changed; rebuild pages.');
  await fs.copyFile(path.join('site/public/skills',item.slug+'.zip'),path.join(root,'assets/skills',item.slug+'.zip'));
}
release.sourceManifestSha256=sha(await fs.readFile(manifestFile));
release.buildIndexOverlay={path:'site/scripts/build-index.mjs',sha256:sha(updated),scope:'Explicit package_files: all opt-in for original skills with native examples, calculation scripts and JSON references. Existing browser and Worker unchanged.'};
release.completedPackagesOn=new Date().toISOString();
assert.equal(sha(await fs.readFile(path.join(root,'worker/worker.js'))),release.workerSha256);
await fs.writeFile(path.join(root,'release-manifest.json'),JSON.stringify(release,null,2)+'\n');
await fs.writeFile('reports/finance-release.json',JSON.stringify(release,null,2)+'\n');
console.log(JSON.stringify({updated:210,nativeExamples:120,catalogueUnchanged:true,workerUnchanged:true}));
