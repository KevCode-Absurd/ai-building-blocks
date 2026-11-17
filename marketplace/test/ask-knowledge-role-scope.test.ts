import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const load=(rel:string):Promise<any>=>import(rel);
async function pack({role=true,malformed=false,linked=false}={}){
 const {generate}=await load('../scripts/gen-ask-knowledge.mjs');const dir=mkdtempSync(path.join(tmpdir(),'role-ask-'));
 const files:Record<string,string|Buffer>={
  'AGENTS.md':'# Test agent',
  'knowledge.md':'# Role methods\n\n## Operating method\nRead the supplied store records, document dated evidence, and test the change before reporting the result.',
  'knowledge/ecommerce/FIN.md':'# Finance knowledge\n\n## Inventory supplier planning\nInventory supplier forecasts use reorder lead times and contribution margin to determine a safe purchase without overstating available cash or sellable units.',
  'knowledge/ecommerce/GAD.md':'# Google knowledge\n\n## Google brand attribution\nGoogle brand attribution reports can include returning customers and purchases that the store would have won without those advertisements, so compare cohorts carefully.',
  'sources.md':'# Sources\n',
  'pack.json':JSON.stringify({agent_id:'test-finance',name:'Finance',knowledge:{review_every_days:30}})
 };
 if(role)files['role-context.json']=JSON.stringify({schema:'ecommerce-role-context/1',agent_id:'test-finance',primary_modules:['FIN'],constraint_modules:['MEA','FIN','OPS']});
 if(malformed)files['knowledge/ecommerce/SEO.md']=Buffer.from([0xff,0xfe]);
 if(linked){files['knowledge/ecommerce/toolbox/FIN.md']='# Finance toolbox\n\nRead `knowledge/ecommerce/skills/forecast/SKILL.md` for the complete forecasting workflow, including assumptions and verification.';files['knowledge/ecommerce/skills/forecast/SKILL.md']='# Forecast skill\n\n## Inventory supplier model\nInventory supplier planning verifies the lead time, payment conditions, held stock, expected demand and the stock reserved for other purposes before any commitment.';}
 for(const [rel,text] of Object.entries(files)){mkdirSync(path.dirname(path.join(dir,rel)),{recursive:true});writeFileSync(path.join(dir,rel),text);}
 mkdirSync(path.join(dir,'tools'),{recursive:true});writeFileSync(path.join(dir,'tools/ask-knowledge.mjs'),generate());
 return {dir,files,run:(args:string[],preload?:string)=>spawnSync(process.execPath,[...(preload?['--import',pathToFileURL(preload).href]:[]),path.join(dir,'tools/ask-knowledge.mjs'),...args,'--json','--pack',dir],{encoding:'utf8',timeout:30000})};
}
function answer(result:{status:number|null;stdout:string|Buffer;stderr:string|Buffer}){assert.equal(result.status,0,String(result.stderr));return JSON.parse(String(result.stdout));}

test('role defaults prefilter module bodies before reads and follow only selected toolbox method references',async()=>{
 const p=await pack({malformed:true,linked:true});
 const preload=path.join(p.dir,'forbid.mjs');writeFileSync(preload,`import fs from 'node:fs';import {syncBuiltinESMExports} from 'node:module';const old=fs.readFileSync;fs.readFileSync=(p,...args)=>{if(String(p).endsWith('SEO.md')||String(p).endsWith('GAD.md'))throw Error('UNRELATED SOURCE WAS READ');return old(p,...args)};syncBuiltinESMExports();`);
 const a=answer(p.run(['inventory supplier'],preload));assert.equal(a.retrieval_scope.mode,'role');assert.equal(a.retrieval_scope.fallback_reason,null);
 assert.deepEqual(a.retrieval_scope.searched_modules,['FIN']);assert.ok(a.retrieval_scope.read_paths.includes('knowledge.md'));
 assert.ok(a.retrieval_scope.read_paths.includes('knowledge/ecommerce/skills/forecast/SKILL.md'));
 assert.ok(!a.retrieval_scope.read_paths.includes('knowledge/ecommerce/GAD.md'));assert.ok(a.passages.length<=5);
 assert.equal(a.retrieval_scope.files_read,a.retrieval_scope.read_paths.length);
 assert.equal(a.retrieval_scope.source_bytes_read,a.retrieval_scope.read_paths.reduce((n:number,rel:string)=>n+Buffer.byteLength(p.files[rel]),0));
});

test('explicit modules bypass the default role and union only explicitly requested paths',async()=>{
 const p=await pack({malformed:true});const a=answer(p.run(['google brand attribution','--module','GAD','--in','knowledge.md']));
 assert.equal(a.retrieval_scope.mode,'explicit');assert.deepEqual(a.retrieval_scope.read_paths,['knowledge.md','knowledge/ecommerce/GAD.md']);
 assert.deepEqual(a.retrieval_scope.searched_modules,['GAD']);assert.equal(a.retrieval_scope.fallback_reason,null);
 const narrow=answer(p.run(['inventory','--in','knowledge/ecommerce/FIN.md']));assert.equal(narrow.retrieval_scope.files_read,1);
 const unknown=answer(p.run(['inventory','--module','XYZ']));assert.equal(unknown.retrieval_scope.files_read,0);assert.equal(unknown.passages.length,0);
});

test('weak or empty role searches visibly expand and all makes broad search explicit',async()=>{
 const p=await pack();const a=answer(p.run(['google brand attribution']));
 assert.equal(a.retrieval_scope.mode,'role_fallback_all');assert.equal(a.retrieval_scope.fallback_reason,'role_scope_weak_or_empty');
 assert.ok(a.retrieval_scope.initial.indexed_files<a.retrieval_scope.indexed_files);assert.ok(a.passages.some((p:any)=>p.path==='knowledge/ecommerce/GAD.md'));
 const explicit=answer(p.run(['google brand attribution','--all']));assert.equal(explicit.retrieval_scope.mode,'all');assert.equal(explicit.retrieval_scope.fallback_reason,null);
 assert.equal(explicit.retrieval_scope.files_read,explicit.retrieval_scope.available_indexed_files);
});

test('malformed or wrong-agent role context cannot silently select the wrong sources',async()=>{
 const p=await pack();writeFileSync(path.join(p.dir,'role-context.json'),'{ malformed private data');
 const bad=p.run(['inventory']);assert.equal(bad.status,2);assert.match(bad.stderr,/role-context.json/);assert.ok(!bad.stderr.includes('private data'));
 assert.equal(p.run(['inventory','--all']).status,0);
 writeFileSync(path.join(p.dir,'role-context.json'),JSON.stringify({schema:'ecommerce-role-context/1',agent_id:'another-agent',primary_modules:['FIN']}));assert.equal(p.run(['inventory']).status,2);
});

test('legacy packs without role metadata preserve broad retrieval and explicit paths remain safe',async()=>{
 const p=await pack({role:false});const a=answer(p.run(['google brand attribution']));
 assert.equal(a.retrieval_scope.mode,'legacy_all');assert.equal(a.retrieval_scope.files_read,a.retrieval_scope.available_indexed_files);
 assert.ok(a.passages.some((p:any)=>p.path==='knowledge/ecommerce/GAD.md'));
 assert.equal(p.run(['inventory','--in','../outside.md']).status,2);
 assert.equal(p.run(['inventory','--all','--module','FIN']).status,2);
});

test('canonical pack file metadata excludes generated job artifacts from all-source fallback',async()=>{
 const p=await pack();const manifest=JSON.parse(String(p.files['pack.json']));manifest.files=Object.keys(p.files).map(p=>({path:p}));
 writeFileSync(path.join(p.dir,'pack.json'),JSON.stringify(manifest));mkdirSync(path.join(p.dir,'output'));writeFileSync(path.join(p.dir,'output/answer.md'),'# Google brand attribution\n\nAn earlier generated answer must never become independent evidence.');
 const a=answer(p.run(['google brand attribution','--all']));assert.ok(!a.retrieval_scope.read_paths.includes('output/answer.md'));assert.ok(a.passages.every((p:any)=>!p.path.startsWith('output/')));
});
