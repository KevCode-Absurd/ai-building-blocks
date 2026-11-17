import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const tool=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../packs/shared/tools/quality/copy-check.cjs');
function run(copy:string,product?:unknown,auto=false){const dir=mkdtempSync(path.join(tmpdir(),'product-choice-'));const file=path.join(dir,'copy.md');writeFileSync(file,copy);let args=[tool,file];if(product!==undefined){mkdirSync(path.join(dir,'evidence'));const source=path.join(dir,'evidence/product.json');writeFileSync(source,JSON.stringify(product));if(!auto)args.push('--product-source',source);}return spawnSync(process.execPath,args,{cwd:dir,encoding:'utf8'});}
test('approved voice cannot justify a size choice from colour-only variants',()=>{const r=run('Choose the size that fits your routine.',{capacity_ml:500,variants:[{color:'blue'},{color:'clay'}]},true);assert.equal(r.status,1);assert.match(r.stdout,/size selection is unsupported/);});
test('a dimensions check and a single size statement do not imply a range',()=>{assert.equal(run('Check the size before you choose. 500 mL.',{capacity_ml:500,variants:[{color:'blue'}]}).status,0);});
test('explicit size options support a bounded choice check, not full claim approval',()=>{const r=run('Select your size.',{options:[{name:'Size',values:['S','M']}]});assert.equal(r.status,0);assert.match(r.stdout,/not semantic certification/);});
test('duplicate labels and mixed representations cannot manufacture multiple choices',()=>{assert.equal(run('Pick a size.',{variants:[{size:'500 mL',capacity_ml:500},{size:'500ml',capacity_ml:500}]}).status,1);assert.equal(run('Choose a size.',{size:'500mL',capacity_ml:500}).status,1);});
test('unsupported source shape and missing source never claim verified choices',()=>{const r=run('Find the perfect size.');assert.equal(r.status,0);assert.match(r.stdout,/NOT_RUN/);assert.equal(run('Choose a size.',[]).status,2);assert.equal(run('Choose a size.',{variants:[{color:'blue'}]}).status,1);});

test("explicit rejected examples are not positive range claims",()=>{assert.equal(run("Never say: choose a size.",{capacity_ml:500}).status,0);assert.equal(run("Do not wait. Choose your size.",{capacity_ml:500}).status,1);});

const qe=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../packs/shared/tools/quality/qe-check.cjs');
function combined(copy:string,product?:unknown){const dir=mkdtempSync(path.join(tmpdir(),'product-choice-qe-'));const file=path.join(dir,'copy.md');writeFileSync(file,copy);mkdirSync(path.join(dir,'context'));if(product!==undefined){mkdirSync(path.join(dir,'evidence'));writeFileSync(path.join(dir,'evidence/product.json'),JSON.stringify(product));}const r=spawnSync(process.execPath,[qe,file,'--customer-copy','--json'],{cwd:dir,encoding:'utf8'});return {code:r.status,json:JSON.parse(r.stdout)};}
test('combined quality gate automatically catches unsupported product choice',()=>{const r=combined('Choose the size for your routine: 500 mL.',{capacity_ml:500});assert.equal(r.code,1);assert.ok(r.json.failed.includes('product_choice'));});
test('combined gate does not mistake missing product evidence for verification',()=>{const r=combined('Choose your size.');assert.equal(r.code,1);assert.equal(r.json.rows.find((x:any)=>x.name==='product_choice').not_run,true);});
test('combined gate accepts a dimension check without requiring irrelevant product options',()=>{const r=combined('Check the dimensions before choosing.');assert.equal(r.json.rows.find((x:any)=>x.name==='product_choice').status,'PASS');});
