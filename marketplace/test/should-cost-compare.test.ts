import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildPack,TOOL_FILES} from '../src/modules/packs/build.ts';
import {housePersonas} from '../src/modules/directory/index.ts';
import {getRole} from '../src/modules/directory/roles.ts';
import {listJobTypes} from '../src/modules/catalogue/index.ts';
// @ts-ignore Portable pack tool is JavaScript.
import {compareShouldCost,runCli,INPUT_LIMIT} from '../packs/shared/tools/should-cost-compare.mjs';

const fixture=()=>{
  const basis={currency:'USD',unit:'accepted unit',basisRef:'assumed-test-spec',basisStatus:'assumed',sourceRef:'Synthetic fixture'};
  return {schema:'should-cost-comparison-v1',material:{...basis,netCost:'10',scrapFractionOfGrossInput:'0.1'},quotes:[{...basis,id:'S1',amount:'8',commercialScope:'FOB assertion'},{...basis,id:'S2',amount:'10.5',commercialScope:'DDP assertion'}]};
};
test('regression: a quote above net material can still be below scrap-adjusted material',()=>{
  const r=compareShouldCost(fixture());assert.equal(r.status,'ARITHMETIC_ONLY');
  assert.equal(r.quotes[0].comparison.netMaterial.relation,'below');
  assert.equal(r.quotes[1].comparison.netMaterial.relation,'above');
  assert.equal(r.quotes[1].comparison.netMaterial.quoteMinusReference,0.5);
  assert.equal(r.quotes[1].comparison.scrapAdjustedMaterial.relation,'below');
  assert.equal(r.material.scrapAdjustedCost,100/9);
  assert.match(r.quotes[1].narrative,/is above net material \(USD 10\) and below scrap-adjusted/);
  assert.match(r.quotes[1].narrative,/assumed basis/);
  assert.match(r.quotes[1].narrative,/do not establish full-cost coverage, equivalent offers or savings/);
});
test('exact equality, zero scrap and mixed quote directions never produce an all-below claim',()=>{
  const f=fixture();f.material.netCost='0.1';f.material.scrapFractionOfGrossInput='0';f.quotes[0].amount='0.100000';f.quotes[1].amount='0.099999';
  const r=compareShouldCost(f);assert.equal(r.quotes[0].comparison.netMaterial.relation,'equal to');assert.equal(r.quotes[0].comparison.scrapAdjustedMaterial.relation,'equal to');
  assert.equal(r.quotes[0].comparison.netMaterial.quoteMinusReference,0);
  assert.equal(r.quotes[1].comparison.netMaterial.relation,'below');assert.match(r.quotes[0].narrative,/is equal to net material/);
  assert.equal(r.quotes[1].comparison.netMaterial.quoteMinusReference,-0.000001);
});
test('currency, unit, product-basis or unknown-basis mismatch produces no comparative arithmetic',()=>{
  for(const mutate of [(f:any)=>f.quotes[0].currency='EUR',(f:any)=>f.quotes[0].unit='lot',(f:any)=>f.quotes[0].basisRef='other-spec',(f:any)=>f.quotes[0].basisStatus='unknown',(f:any)=>f.material.basisStatus='unknown']){
    const f=fixture();mutate(f);const r=compareShouldCost(f);assert.equal(r.status,'HAS_UNCOMPARABLE_QUOTES');assert.equal(r.quotes[0].comparison,null);assert.ok(r.quotes[0].reasons.length);assert.match(r.quotes[0].narrative,/no comparison/);
  }
});
test('missing bases, unsupported fields and invalid decimal or yield inputs fail closed',()=>{
  for(const mutate of [(f:any)=>delete f.material.currency,(f:any)=>delete f.material.unit,(f:any)=>delete f.material.basisRef,(f:any)=>delete f.quotes[0].sourceRef,(f:any)=>delete f.quotes[0].commercialScope,(f:any)=>f.material.netCost=10,(f:any)=>f.material.netCost='-1',(f:any)=>f.material.netCost='1e3',(f:any)=>f.material.scrapFractionOfGrossInput='1',(f:any)=>f.material.scrapFractionOfGrossInput='10',(f:any)=>f.material.scrapFractionOfGrossInput='0.0000001',(f:any)=>f.quotes[0].id='S2',(f:any)=>f.material.recoveryCredit='2']){
    const f=fixture();mutate(f);assert.throws(()=>compareShouldCost(f));
  }
});
test('CLI binds read-only local input and rejects traversal, device names and oversized input',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'should-cost-compare-'));
  try{
    fs.mkdirSync(path.join(root,'context'));const p=path.join(root,'context/input.json');fs.writeFileSync(p,JSON.stringify(fixture()));const before=fs.readFileSync(p);
    const r=runCli(['context/input.json'],root);assert.match(r.inputSha256,/^[a-f0-9]{64}$/);assert.equal(r.quotes[1].comparison.netMaterial.relation,'above');assert.deepEqual(fs.readFileSync(p),before);assert.deepEqual(fs.readdirSync(root),['context']);
    for(const s of ['../input.json','context/../input.json','context/NUL',p])assert.throws(()=>runCli([s],root));
    fs.writeFileSync(path.join(root,'context/large.json'),' '.repeat(INPUT_LIMIT+1));assert.throws(()=>runCli(['context/large.json'],root),/bounded regular file/);
  }finally{assert.equal(path.dirname(root),fs.realpathSync(os.tmpdir()));assert.ok(path.basename(root).startsWith('should-cost-compare-'));fs.rmSync(root,{recursive:true,force:true});}
});
test('comparison tools and guidance are Douglas-agent-only; all other agent/train contents stay unchanged',async()=>{
  const names=['should-cost-compare.mjs','SHOULD-COST-COMPARE.md'];for(const name of names)assert.deepEqual(TOOL_FILES.find(x=>x.name===name)?.personaIds,['douglas-should-cost']);
  const tools=Object.fromEntries(names.map(name=>[name,fs.readFileSync(new URL('../packs/shared/tools/'+name,import.meta.url),'utf8')]));
  const personas=housePersonas().filter(p=>p.vertical==='ecommerce'&&p.status==='live');assert.equal(personas.length,81);
  for(const persona of personas)for(const kind of ['agent','train'] as const){
    const input={persona,role:getRole(persona.role)??null,kit:null,jobTypes:listJobTypes(),options:{kind,version:'test',updated:'2026-11-19'}};
    const pack=await buildPack({...input,tools});const expected=persona.id==='douglas-should-cost'&&kind==='agent';
    for(const name of names)assert.equal(pack.files.some(f=>f.path==='tools/'+name),expected);
    assert.equal(pack.files.find(f=>f.path==='AGENTS.md')!.content.includes('## Reconcile cost comparison prose'),expected);
    if(!expected){const baseline=await buildPack({...input,tools:{}});assert.deepEqual(pack.files,baseline.files,persona.id+' '+kind);assert.deepEqual(pack.manifest,baseline.manifest);}
  }
});
