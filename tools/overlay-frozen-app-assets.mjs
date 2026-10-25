// Overlay only Vite's tested app JS/CSS onto a frozen asset-only candidate.
// Catalogue, SEO, API metadata, Worker, bindings and D1 configuration stay from
// the reviewed baseline package. This intentionally does not copy dist/data.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const [sourceArg, targetArg, distArg] = process.argv.slice(2);
assert(sourceArg && targetArg && distArg, 'Usage: node tools/overlay-frozen-app-assets.mjs <agency candidate> <new frozen candidate> <site/dist>');
const source=path.resolve(sourceArg),target=path.resolve(targetArg),dist=path.resolve(distArg);
assert.equal(path.basename(source),'release-2026-10-25-agency-agents');
assert.equal(path.basename(target),'release-2026-10-25-final-combined');
assert.equal(path.basename(dist),'dist');
const original=JSON.parse(await fs.readFile(path.join(source,'release-manifest.json'),'utf8'));
assert.equal(original.status,'prepared-not-deployed');
assert.equal(original.previousVersionId,'1e38049b-4107-4d93-95ff-d27ba1ec4e76');
assert.equal(original.workerSha256,'bc749ed3169c246afe3303bb85e5c1882ed93c5ca5beaf64f0be4daaad5e9fd5');
assert.equal(original.after-original.before,283);
assert.equal(await fs.realpath(target),target);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fileSha=async file=>sha(await fs.readFile(file));
const baselineCatalogueSha=await fileSha(path.join(source,'assets','data','blocks.json'));
const distIndex=path.join(dist,'index.html'),targetAssets=path.join(target,'assets');
const buildHtml=await fs.readFile(distIndex,'utf8');
const js=[...buildHtml.matchAll(/<script[^>]+src="(\/assets\/[^\"]+\.js)"/g)].map(m=>m[1]);
const css=[...buildHtml.matchAll(/<link[^>]+href="(\/assets\/[^\"]+\.css)"/g)].map(m=>m[1]);
assert(js.length>=1&&css.length>=1,'Built index must reference its hashed JS and CSS.');
const distAssets=path.join(dist,'assets');
const builtFiles=(await fs.readdir(distAssets,{withFileTypes:true})).filter(d=>d.isFile()&&/\.(?:js|css)$/.test(d.name));
assert(builtFiles.length>=40,'Unexpectedly small Vite JS/CSS asset set.');
for(const entry of builtFiles) await fs.copyFile(path.join(distAssets,entry.name),path.join(targetAssets,'assets',entry.name));

const candidateOldMain='/assets/main-p2CNNbld.js';
const candidateOldCss='/assets/index-pixels-1e0626cf3123.css';
const replacementMain=js[0],replacementCss=css.find(href=>/index-/.test(href))??css[0];
let htmlChanged=0,htmlFilesWithAppShell=0,appScriptReferences=0,appCssReferences=0;
async function walk(dir){
  for(const item of await fs.readdir(dir,{withFileTypes:true})){
    const file=path.join(dir,item.name);
    if(item.isDirectory()) await walk(file);
    else if(item.isFile()&&item.name.endsWith('.html')){
      let text=await fs.readFile(file,'utf8'),next=text.replaceAll(candidateOldMain,replacementMain).replaceAll(candidateOldCss,replacementCss);
      if(file.toLowerCase()===path.join(targetAssets,'index.html').toLowerCase()) next=buildHtml;
      if(next.includes(replacementMain)&&next.includes(replacementCss))htmlFilesWithAppShell++;
      appScriptReferences+=next.split(replacementMain).length-1;
      appCssReferences+=next.split(replacementCss).length-1;
      if(next!==text){htmlChanged++;await fs.writeFile(file,next);}
    }
  }
}
await walk(targetAssets);
assert(htmlFilesWithAppShell>=1000,'Expected app shell references across the prerendered pages.');

const configPath=path.join(target,'wrangler.production.jsonc');
const config=JSON.parse(await fs.readFile(configPath,'utf8'));
config.main=path.join(target,'worker','worker.js');
config.assets.directory=targetAssets;
assert.equal(config.name,'ai-building-blocks');
assert.equal(config.d1_databases?.[0]?.database_id,'a886eeae-4014-4da2-842f-a5bebc4d7f71');
await fs.writeFile(configPath,JSON.stringify(config,null,2)+'\n');
const manifestPath=path.join(target,'release-manifest.json');
const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
const totalFiles=(await fs.readdir(targetAssets,{recursive:true,withFileTypes:true})).filter(x=>x.isFile()).length;
manifest.root=target;manifest.assets=targetAssets;manifest.source=path.join(target,'source');
manifest.files=totalFiles;
manifest.appOverlay={createdOn:new Date().toISOString(),buildRoot:dist,script:replacementMain,stylesheet:replacementCss,appAssets:builtFiles.length,appAssetSha256:Object.fromEntries(await Promise.all(builtFiles.map(async d=>[d.name,await fileSha(path.join(targetAssets,'assets',d.name))]))),htmlFilesChanged:Math.max(htmlChanged,htmlFilesWithAppShell),htmlReferencesChanged:appScriptReferences+appCssReferences,htmlFilesWithAppShell,sourceCommit:'e38217a989a169f0e8b795430dc7835a21b499f9',workerUnchanged:true,catalogueUnchanged:true};
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
assert.equal(await fileSha(path.join(target,'worker','worker.js')),original.workerSha256);
assert.equal(await fileSha(path.join(targetAssets,'data','blocks.json')),baselineCatalogueSha,'Overlay must preserve the reviewed 5,278-record catalogue bytes.');
const finalIndex=await fs.readFile(path.join(targetAssets,'index.html'),'utf8');
assert(finalIndex.includes(replacementMain)&&finalIndex.includes(replacementCss));
assert(!finalIndex.includes(candidateOldMain)&&!finalIndex.includes(candidateOldCss));
const report={status:'staged-app-overlay',createdOn:new Date().toISOString(),previousVersionId:original.previousVersionId,workerSha256:original.workerSha256,catalogueSha256:sha(await fs.readFile(path.join(targetAssets,'data','blocks.json'))),catalogueEntries:JSON.parse(await fs.readFile(path.join(targetAssets,'data','blocks.json'),'utf8')).blocks.length,addedAgencyAgents:283,assetFiles:totalFiles,overlay:manifest.appOverlay};
await fs.writeFile(path.join(target,'combined-app-overlay.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
