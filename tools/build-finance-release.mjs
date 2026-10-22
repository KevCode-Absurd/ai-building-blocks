// Content-only finance release. Reuse the currently verified application bundle.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
const repo=path.resolve('.'),root=path.resolve(process.argv[2]??''),expectedVersion=process.argv[3],finalizeOnly=process.argv[5]==='--finalize';
assert(root.startsWith(path.resolve('site/.wrangler/releases')+path.sep)&&path.basename(root).startsWith('release-2026-10-22'));
assert(expectedVersion,'Pass the reviewed production version.');
if(finalizeOnly){assert((await fs.stat(root)).isDirectory());await assert.rejects(fs.stat(path.join(root,'release-manifest.json')),{code:'ENOENT'});}else await assert.rejects(fs.stat(root),{code:'ENOENT'});
const live=JSON.parse(await fs.readFile('reports/cloudflare-live-release.json','utf8'));
assert.equal(live.production.versionId,expectedVersion,'Production baseline changed.');
const previous=path.resolve(live.production.assetReleaseRoot??live.production.releaseRoot);
const previousWorker=path.join(path.resolve(live.production.releaseRoot),'worker/worker.js');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(sha(await fs.readFile(previousWorker)),live.production.workerSha256);
const sourceManifest=JSON.parse(await fs.readFile('reports/finance-expansion-manifest.json','utf8'));
assert.equal(path.resolve(sourceManifest.sourceRoot),repo,'Promote reviewed finance sources before freezing.');
assert.deepEqual(sourceManifest.counts,{skills:120,workflows:60,agents:30,total:210});
assert.equal(JSON.parse(await fs.readFile('reports/finance-model-runtime-qa.json','utf8')).passed,120);
async function treeHashes(dir){const result={};for(const entry of await fs.readdir(dir,{recursive:true,withFileTypes:true})){if(entry.isFile()){const file=path.join(entry.parentPath,entry.name);result[path.relative(dir,file)]=sha(await fs.readFile(file));}}return result;}
const baselineBrowser=await treeHashes(path.join(previous,'assets/assets'));
await fs.mkdir(root,{recursive:true});
const sourceCommit=execFileSync('git',['rev-parse',process.argv[4]??'HEAD'],{windowsHide:true,encoding:'utf8'}).trim();
const source=path.join(root,'source');await fs.mkdir(source,{recursive:true});
const archive=path.join(root,'source.tar');
await fs.writeFile(archive,execFileSync('git',['-c','core.longpaths=true','archive',sourceCommit,'site/scripts','site/src','mini-tools','tools/lib'],{windowsHide:true,maxBuffer:64*1024*1024}));
execFileSync('tar',['-xf',archive,'-C',source],{windowsHide:true});
const archivedSite=path.join(source,'site');
if(!finalizeOnly)await fs.cp(path.join(previous,'assets'),path.join(root,'assets'),{recursive:true});
await fs.mkdir(path.join(root,'worker'),{recursive:true});
await fs.copyFile(previousWorker,path.join(root,'worker/worker.js'));
try{await fs.copyFile(previousWorker+'.map',path.join(root,'worker/worker.js.map'));}catch(error){if(error.code!=='ENOENT')throw error;}
async function run(args,env={},cwd=path.join(repo,'site')){const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{cwd,windowsHide:true,stdio:'inherit',env:{...process.env,...env}});child.on('error',reject);child.on('exit',resolve);});assert.equal(code,0,'Finance content build failed: '+args[0]);}
if(!finalizeOnly){
await run([path.join(archivedSite,'scripts/build-index.mjs')]);
for(const folder of ['data','skills','llms'])await fs.cp(path.join(repo,'site/public',folder),path.join(root,'assets',folder),{recursive:true});
for(const name of await fs.readdir('site/public'))if(/^sitemap.*\.xml$/.test(name)||/^llms.*\.txt$/.test(name)||['robots.txt','_redirects'].includes(name))await fs.copyFile(path.join(repo,'site/public',name),path.join(root,'assets',name));
await fs.mkdir(path.join(archivedSite,'public'),{recursive:true});
await fs.cp(path.join(repo,'site/public/data'),path.join(archivedSite,'public/data'),{recursive:true});
await fs.cp(path.join(previous,'assets/example-app'),path.join(source,'example-app-site/example-app'),{recursive:true});
for(const name of await fs.readdir('site/public'))if(/^sitemap.*\.xml$/.test(name))await fs.copyFile(path.join(repo,'site/public',name),path.join(archivedSite,'public',name));
await run([path.join(archivedSite,'scripts/prerender.mjs')],{PRERENDER_DIST:path.join(root,'assets')},archivedSite);
}
assert.deepEqual(await treeHashes(path.join(root,'assets/assets')),baselineBrowser,'Reviewed browser application changed.');
assert.equal(sha(await fs.readFile(path.join(root,'worker/worker.js'))),live.production.workerSha256);
for(const environment of ['staging','production']){
  let config=JSON.parse(await fs.readFile(path.join(previous,`wrangler.${environment}.jsonc`),'utf8'));
  if(environment==='staging'&&config.env?.staging)config={...config,...config.env.staging};
  delete config.env;
  config.main=path.join(root,'worker/worker.js');config.assets.directory=path.join(root,'assets');config.no_bundle=true;
  for(const value of Object.values(config.env??{}))if(value.assets)value.assets.directory=path.join(root,'assets');
  await fs.writeFile(path.join(root,`wrangler.${environment}.jsonc`),JSON.stringify(config,null,2)+'\n');
}
const assets=path.join(root,'assets'),files=(await fs.readdir(assets,{recursive:true,withFileTypes:true})).filter(entry=>entry.isFile()).length;
const catalogue=JSON.parse(await fs.readFile(path.join(assets,'data/blocks.json'),'utf8'));
const byId=new Map(catalogue.blocks.map(item=>[item.slug,item]));
for(const item of sourceManifest.items){const block=byId.get(item.slug);assert(block,'Missing finance item '+item.slug);assert.equal(block.type??'skill',item.type,'Wrong finance type '+item.slug);for(const file of [`skills/${item.slug}/SKILL.md`,`skills/${item.slug}.zip`,`${item.type==='skill'?'skills':item.type==='workflow'?'workflows':'agents'}/${item.slug}.html`])assert((await fs.stat(path.join(assets,file))).size>0);}
const report={createdOn:new Date().toISOString(),root,assets,sourceCommit,archivedSite,previous,previousVersionId:expectedVersion,files,counts:sourceManifest.counts,workerSha256:live.production.workerSha256,catalogueSha256:sha(await fs.readFile(path.join(assets,'data/blocks.json'))),sourceManifestSha256:sha(await fs.readFile('reports/finance-expansion-manifest.json')),browserAssetsUnchanged:true,workerUnchanged:true,scope:'210 original finance source packs and pages. Existing verified browser and Worker bundles retained byte-for-byte; archived committed content-build and pack code excludes unrelated working-tree app edits.'};
await fs.writeFile(path.join(root,'release-manifest.json'),JSON.stringify(report,null,2)+'\n');
await fs.writeFile('reports/finance-release.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
