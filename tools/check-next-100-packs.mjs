import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { build } from '../site/node_modules/esbuild/lib/main.js';
import { unzipSync, strFromU8 } from '../site/node_modules/fflate/esm/index.mjs';
const repo=path.resolve(import.meta.dirname,'..');
const dist=path.resolve(process.argv[2]||'');
assert(fs.existsSync(path.join(dist,'data/blocks.json')),'Pass the frozen built asset directory.');
const artifact=path.join(repo,'runs/next-100-handoff-qa-bundle.mjs');
await build({stdin:{contents:'export { buildHandoffZip } from "../site/src/lib/handoff.ts"; export { loadCatalogue } from "../site/src/lib/data.ts";',resolveDir:path.join(repo,'runs'),sourcefile:'everyday-qa-entry.ts',loader:'ts'},bundle:true,platform:'node',format:'esm',outfile:artifact,logLevel:'silent'});
const requests=[];
globalThis.fetch=async input=>{
 const url=new URL(String(input),'https://qa.invalid');
 assert.equal(url.origin,'https://qa.invalid','Pack assembly must stay on frozen assets.');
 const target=path.resolve(dist,'.'+decodeURIComponent(url.pathname));
 assert(target.startsWith(dist+path.sep),'Unsafe asset path');
 requests.push(url.pathname);
 return fs.existsSync(target)?new Response(fs.readFileSync(target),{status:200}):new Response('Missing',{status:404});
};
const {buildHandoffZip,loadCatalogue}=await import(pathToFileURL(artifact).href+'?v='+Date.now());
const cat=await loadCatalogue();
const manifest=JSON.parse(fs.readFileSync(path.join(repo,'reports/2026-10-22-next-100-recipes.json'),'utf8'));
assert.equal(manifest.items.length,75,'Exactly55 workflows and20 agents must be packaged.');
assert.equal(manifest.items.filter(item=>item.type==='workflow').length,55);
assert.equal(manifest.items.filter(item=>item.type==='agent').length,20);
assert.equal(new Set(manifest.items.map(item=>item.slug)).size,75,'Candidate slugs must be unique.');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const checks=[];
for(const item of manifest.items){
 const block=cat.bySlug[item.slug]; assert(block,item.slug+' must be in final public catalogue');
 assert.equal(block.type,item.type,item.slug+' public type changed');
 const sourceSkill=item.files.find(file=>file.endsWith('/SKILL.md'));
 assert(sourceSkill,item.slug+' source manifest lacks its governing instructions');
 assert.equal(sha(Buffer.from(fs.readFileSync(path.join(repo,sourceSkill),'utf8').replace(/\r\n?/g,'\n'))),sha(Buffer.from(fs.readFileSync(path.join(dist,'skills',item.slug,'SKILL.md'),'utf8').replace(/\r\n?/g,'\n'))),item.slug+' frozen governing source is stale');
 if(item.type==='workflow')assert.equal(block.execution,'coordinator',item.slug+' governing workflow must survive builder export');
 const flow={id:'qa-'+item.slug,name:block.name,goal:block.name,nodes:[{id:'1',slug:item.slug,x:0,y:0}],edges:[],updated:0};
 const packed=await buildHandoffZip(cat,flow);assert(!packed.error,item.slug+': '+packed.error);
 const bytes=new Uint8Array(await packed.blob.arrayBuffer()),files=unzipSync(bytes);
 for(const file of ['HANDOFF.md','README.txt','workflow.json',`skills/${item.slug}/SKILL.md`])assert(files[file],item.slug+' missing '+file);
 const workflow=JSON.parse(strFromU8(files['workflow.json'])); assert.equal(workflow.steps.length,1);assert.equal(workflow.steps[0].skill,item.slug);
 const own=strFromU8(files[`skills/${item.slug}/SKILL.md`]);assert(own.includes('MISSING:')&&own.includes('CHECKS MISSED'),item.slug+' governing controls missing');
 const required=new Set();const visit=slug=>{if(required.has(slug))return;required.add(slug);const b=cat.bySlug[slug];assert(b,'unknown '+slug);for(const child of [...b.uses,...b.steps.map(s=>s.uses)])visit(child);};visit(item.slug);
 for(const slug of required){
  assert(files[`skills/${slug}/SKILL.md`],item.slug+' missing dependency '+slug);
  assert.equal(sha(files[`skills/${slug}/SKILL.md`]),sha(Buffer.from(fs.readFileSync(path.join(dist,'skills',slug,'SKILL.md'),'utf8').replace(/\r\n?/g,'\n'))),slug+' skill content changed');
  if(cat.bySlug[slug].hasFiles){const native=unzipSync(fs.readFileSync(path.join(dist,'skills',slug+'.zip')));for(const [name,content] of Object.entries(native)){if(name.endsWith('/')||name.endsWith('/SKILL.md'))continue;assert(files['skills/'+name],item.slug+' missing reference '+name);assert.equal(sha(files['skills/'+name]),sha(content),name+' changed');}}
 }
 const again=await buildHandoffZip(cat,flow);assert(!again.error);assert.equal(sha(new Uint8Array(await again.blob.arrayBuffer())),sha(bytes),item.slug+' is not deterministic');
 checks.push({slug:item.slug,type:item.type,dependencies:required.size,files:Object.keys(files).length,zipSha256:sha(bytes)});
 if(checks.length%10===0)console.log('Verified packs: '+checks.length+'/'+manifest.items.length);
}
const report={checkedOn:new Date().toISOString(),dist,checkerSha256:sha(fs.readFileSync(import.meta.filename)),manifest:sha(fs.readFileSync(path.join(repo,'reports/2026-10-22-next-100-recipes.json'))),catalogueSha256:sha(fs.readFileSync(path.join(dist,'data/blocks.json'))),runtimeSourceSha256:sha(fs.readFileSync(path.join(repo,'site/src/lib/handoff.ts'))),passed:checks.length,providerCalls:0,scope:'Actual handoff assembly against frozen built files; governing instructions match current sources, recursive dependency skill text preserved with expected newline normalization; all packaged references/licenses preserved byte for byte; ZIPs repeat deterministically. This does not execute each business workflow.',checks};
fs.writeFileSync(path.join(repo,'reports/2026-10-22-next-100-packs-qa.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,report:'reports/2026-10-22-next-100-packs-qa.json'}));
