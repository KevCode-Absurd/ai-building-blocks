// Execute the delivered standalone model scripts, not a separately imported evaluator.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const manifestFile='reports/finance-expansion-manifest.json',manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
assert.equal(manifest.items.length,210);
const models=manifest.items.filter(item=>item.type==='skill');assert.equal(models.length,120);
const authored=['public-markets','private-deals','operating-credit'].flatMap(name=>JSON.parse(fs.readFileSync(`tools/finance-expansion/${name}.json`,'utf8')).skills);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const close=(a,b,label)=>assert(typeof a==='number'&&Number.isFinite(a)&&Math.abs(a-b)<=1e-7+1e-9*Math.abs(b),label);
const scratch=path.resolve('runs/finance-cli-qa');fs.mkdirSync(scratch,{recursive:true});
const results=[];
for(const item of models){
  const base=path.resolve(item.dir),script=path.join(base,'scripts/run-model.mjs'),modelFile=path.join(base,'references/model.json');
  const spec=JSON.parse(fs.readFileSync(modelFile,'utf8')),model=spec.model??spec;
  const invoke=inputs=>spawnSync(process.execPath,[script,modelFile,...(inputs?[inputs]:[])],{encoding:'utf8',timeout:15000,windowsHide:true});
  const baseline=invoke();assert.equal(baseline.status,0,`${item.slug}: ${baseline.stderr}`);
  const parsed=JSON.parse(baseline.stdout);assert.match(parsed.basis,/Illustrative/);
  assert.deepEqual(Object.keys(parsed.outputs).sort(),[...model.outputs].sort());
  for(const [id,value]of Object.entries(model.expected))close(parsed.outputs[id],value,`${item.slug} baseline ${id}`);
  const fixtures=[];
  for(let index=0;index<model.cases.length;index++){
    const fixture=model.cases[index],inputs=Object.fromEntries(model.inputs.map(input=>[input.id,input.value]));Object.assign(inputs,fixture.inputs);
    const inputFile=path.join(scratch,`${item.slug}-${index}.json`);fs.writeFileSync(inputFile,JSON.stringify(inputs));
    const run=invoke(inputFile);
    if(fixture.error){assert.equal(run.status,1,`${item.slug} accepted invalid fixture ${fixture.name}`);assert.equal(run.stdout.trim(),'');assert(run.stderr.trim());}
    else{assert.equal(run.status,0,`${item.slug}: ${run.stderr}`);const changed=JSON.parse(run.stdout);assert.match(changed.basis,/source evidence is checked separately/);for(const [id,value]of Object.entries(fixture.expected))close(changed.outputs[id],value,`${item.slug} ${fixture.name} ${id}`);}
    fixtures.push({name:fixture.name,kind:fixture.error?'refusal':'changed-input',status:'pass'});
  }
  const native=path.join(base,'examples/model.xlsx'),proof=JSON.parse(fs.readFileSync(path.join(base,'references/workbook-verification.json'),'utf8'));
  assert.equal(proof.modelSha256,sha(JSON.stringify(model)),item.slug+' native example uses an older model');
  const source=authored.find(spec=>spec.slug===item.slug);assert(source);
  assert.equal(proof.workbookSpecSha256,sha(JSON.stringify({name:source.name,model:source.model,references:source.references})),item.slug+' native title or method references are stale');
  assert.equal(proof.xlsxSha256,sha(fs.readFileSync(native)),item.slug+' workbook changed since recalculation');
  assert.equal(proof.baseline,'pass');assert.equal(proof.reopenedAndRecalculated,true);assert.equal(proof.rendered,true);
  assert.equal(proof.visualReview,'pass',item.slug+' native sheet not visually reviewed');
  results.push({slug:item.slug,status:'pass',baseline:'pass',fixtures,scriptSha256:sha(fs.readFileSync(script)),modelSha256:proof.modelSha256,xlsxSha256:proof.xlsxSha256});
}
const report={checkedOn:new Date().toISOString(),status:'pass',passed:results.length,fixtures:results.reduce((sum,item)=>sum+1+item.fixtures.length,0),manifestSha256:sha(fs.readFileSync(manifestFile)),checkerSha256:sha(fs.readFileSync(import.meta.filename)),scope:'Each delivered standalone script executed with baseline, changed and invalid examples; native example proof and visual-review status pinned. Illustrative cases do not validate real company evidence.',providerCalls:0,results};
fs.writeFileSync('reports/finance-model-runtime-qa.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,fixtures:report.fixtures,report:'reports/finance-model-runtime-qa.json'}));
