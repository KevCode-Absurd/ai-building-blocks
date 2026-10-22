// Actual pack assembly on frozen files. Network/provider access is prohibited.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {build} from '../site/node_modules/esbuild/lib/main.js';
import {unzipSync,strFromU8} from '../site/node_modules/fflate/esm/index.mjs';
const repo=path.resolve(import.meta.dirname,'..'),dist=path.resolve(process.argv[2]??'');
assert(process.argv[2]&&fs.existsSync(path.join(dist,'data/blocks.json')),'Pass the frozen built asset directory.');
const manifest=JSON.parse(fs.readFileSync(path.join(repo,'reports/finance-expansion-manifest.json'),'utf8'));
assert.equal(manifest.items.length,210);
assert.deepEqual(manifest.counts,{skills:120,workflows:60,agents:30,total:210});
const bundle=path.join(repo,'runs/finance-handoff-qa.mjs');
const runtime=path.join(path.dirname(dist),'source/site/src');
assert(fs.existsSync(path.join(runtime,'lib/handoff.ts')),'Pack checks require the archived release source.');
const handoffSource=path.join(runtime,'lib/handoff.ts'),dataSource=path.join(runtime,'lib/data.ts');
await build({stdin:{contents:`export {buildHandoffZip,buildSkillZip} from ${JSON.stringify(handoffSource)};export {loadCatalogue,loadSkillText} from ${JSON.stringify(dataSource)};`,resolveDir:path.join(repo,'runs'),loader:'ts'},bundle:true,platform:'node',format:'esm',outfile:bundle,logLevel:'silent'});
globalThis.fetch=async input=>{
  const url=new URL(String(input),'https://qa.invalid');assert.equal(url.origin,'https://qa.invalid','Pack assembly tried a network request.');
  const target=path.resolve(dist,'.'+decodeURIComponent(url.pathname));assert(target.startsWith(dist+path.sep));
  return fs.existsSync(target)?new Response(fs.readFileSync(target),{status:200}):new Response('Missing',{status:404});
};
const {buildHandoffZip,buildSkillZip,loadCatalogue,loadSkillText}=await import(pathToFileURL(bundle).href+'?v='+Date.now());
const catalogue=await loadCatalogue(),sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),checks=[];
for(const item of manifest.items){
  const block=catalogue.bySlug[item.slug];assert(block,item.slug+' absent from final catalogue');assert.equal(block.type,item.type);
  const flow={id:'qa-'+item.slug,name:block.name,goal:block.name,nodes:[{id:'1',slug:item.slug,x:0,y:0}],edges:[],updated:0};
  async function pack(){if(item.type==='skill')return buildSkillZip(item.slug,await loadSkillText(item.slug),true,{});const result=await buildHandoffZip(catalogue,flow);assert(!result.error,result.error);return result.blob;}
  const bytes=new Uint8Array(await(await pack()).arrayBuffer()),files=unzipSync(bytes);
  const base=item.type==='skill'?'':'skills/';
  const expected=new Set();const visit=id=>{if(expected.has(id))return;expected.add(id);const b=catalogue.bySlug[id];assert(b,'missing '+id);for(const child of [...b.uses,...b.steps.map(step=>step.uses)])visit(child);};visit(item.slug);
  if(item.type!=='skill'){
    for(const file of ['HANDOFF.md','START_HERE.txt','workflow.json'])assert(files[file],item.slug+' missing '+file);
    const definition=JSON.parse(strFromU8(files['workflow.json']));assert.equal(definition.steps.length,1);assert.equal(definition.steps[0].skill,item.slug);
  }
  for(const id of expected){
    const own=`${base}${id}/SKILL.md`;assert(files[own],item.slug+' missing '+own);
    assert.equal(sha(files[own]),sha(Buffer.from(fs.readFileSync(path.join(dist,'skills',id,'SKILL.md'),'utf8').replace(/\r\n?/g,'\n'))),id+' governing method changed');
    assert(files[`${base}${id}/LICENSE`],id+' licence missing');
    const native=unzipSync(fs.readFileSync(path.join(dist,'skills',id+'.zip')));
    for(const [name,content]of Object.entries(native)){if(name.endsWith('/')||name.endsWith('/SKILL.md'))continue;assert(files[base+name],item.slug+' missing '+name);assert.equal(sha(files[base+name]),sha(content),name+' changed');}
  }
  if(item.type==='skill'){
    const native=files[`${item.slug}/examples/model.xlsx`];assert(native,'native financial example missing');assert(unzipSync(native)['xl/workbook.xml']);
    assert(files[`${item.slug}/references/model.json`]&&files[`${item.slug}/scripts/run-model.mjs`]);
  }
  const again=new Uint8Array(await(await pack()).arrayBuffer());assert.equal(sha(bytes),sha(again),item.slug+' repeat export differs');
  checks.push({slug:item.slug,type:item.type,dependencies:expected.size,files:Object.keys(files).length,zipSha256:sha(bytes)});
  if(checks.length%20===0)console.log(`Finance packs ${checks.length}/210`);
}
const report={checkedOn:new Date().toISOString(),dist,runtimeSource:handoffSource,status:'pass',passed:checks.length,providerCalls:0,manifestSha256:sha(fs.readFileSync(path.join(repo,'reports/finance-expansion-manifest.json'))),catalogueSha256:sha(fs.readFileSync(path.join(dist,'data/blocks.json'))),runtimeSourceSha256:sha(fs.readFileSync(handoffSource)),checkerSha256:sha(fs.readFileSync(import.meta.filename)),scope:'Actual archived release pack code against frozen built files, governing instructions, all recursive references/licences and native workbook bytes preserved, repeat exports deterministic. Business outcomes and financial source truth are not inferred from packaging.',checks};
fs.writeFileSync(path.join(repo,'reports/finance-packs-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:checks.length,report:'reports/finance-packs-qa.json'}));
