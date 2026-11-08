import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {nativeExecutionRequirements,preflightNativeExecution} from '../src/jobs/native-execution.mjs';
import {inspectNativeDelivery,runNativeInspectionCLI} from '../../tools/inspect-native-delivery.mjs';
const require=createRequire(import.meta.url),sha=value=>createHash('sha256').update(value).digest('hex');
const tool=(id,capabilities,billing='LOCAL')=>({id,capabilities,billing,available:true,checked_at:new Date().toISOString(),availability_receipt:'host-tools:actual-inventory'});
const pagePlan={landing_pages:{requested:true,delivery_mode:'LAUNCHABLE_SITE'}},imagePlan={images:{required:true}};

test('native preflight blocks production without real required capabilities and never authorises a paid tool by default',()=>{
 assert.deepEqual(nativeExecutionRequirements({landing_pages:{requested:true,delivery_mode:'DESIGN_REFERENCE'}}),[]);
 let report=preflightNativeExecution({plan:pagePlan,tools:[tool('writer',['source_edit'])]});
 assert.equal(report.status,'BLOCKED');assert(report.errors.some(error=>error.path==='browser_preview'));
 report=preflightNativeExecution({plan:imagePlan,tools:[tool('local-reader',['raster_inspection','semantic_review']),tool('api',['raster_generation'],'PAID')]});
 assert.equal(report.status,'BLOCKED');assert.equal(report.errors[0].code,'PAID_TOOL_NOT_AUTHORIZED');
 report=preflightNativeExecution({plan:imagePlan,tools:[tool('included-host',['raster_generation','raster_inspection','semantic_review'],'INCLUDED')]});
 assert.equal(report.status,'READY_FOR_HOST_EXECUTION');assert.equal(report.model_calls,0);assert.match(report.assurance,/NOT_EXECUTION/);
 report=preflightNativeExecution({plan:pagePlan,tools:[{...tool('fake',['source_edit','project_build','browser_preview','semantic_review']),availability_receipt:''}]});
 assert.equal(report.status,'BLOCKED');
 report=preflightNativeExecution({plan:pagePlan,tools:[{...tool('stale',['source_edit','project_build','browser_preview','semantic_review']),checked_at:'2020-01-01T00:00:00Z'}]});assert.equal(report.status,'BLOCKED');
});

async function fixture(t,files) {
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'aiblocks-native-'));
 t.after(async()=>{assert.equal(path.dirname(root),os.tmpdir());assert(path.basename(root).startsWith('aiblocks-native-'));await fs.rm(root,{recursive:true,force:true});});
 const artifacts=[];
 for(const [id,file] of Object.entries(files)){await fs.writeFile(path.join(root,file.path),file.content);artifacts.push({id,path:file.path,sha256:sha(file.content)});}
 return {root,manifest:{schema:'ai-blocks-native-inspection/1',files:{schema:'ai-blocks-file-evidence/1',artifacts}}};
}

test('native raster inspection decodes actual bytes, verifies dimensions and rejects a screenshot path pretending to be raster',async t=>{
 const png=await require('sharp')({create:{width:40,height:60,channels:3,background:'red'}}).png().toBuffer();
 const p=await fixture(t,{image:{path:'ad.png',content:png},imposter:{path:'fake.png',content:'This is only a concept, not an image.'}});
 p.manifest.images=[{id:'image',width:40,height:60}];
 let report=await inspectNativeDelivery(p);assert.equal(report.status,'PASS');assert.equal(report.images[0].sha256,sha(png));assert(report.images[0].not_checked.includes('brand'));
 p.manifest.images=[{id:'image',width:99,height:60}];report=await inspectNativeDelivery(p);assert.equal(report.status,'FAIL');assert.equal(report.images[0].checks[1].status,'FAIL');
 p.manifest.images=[{id:'imposter'}];report=await inspectNativeDelivery(p);assert.equal(report.status,'FAIL');
});

test('stale file hashes stop native execution before raster/browser work',async t=>{
 const p=await fixture(t,{image:{path:'image.png',content:'old'}});p.manifest.images=[{id:'image'}];await fs.writeFile(path.join(p.root,'image.png'),'new');
 const report=await inspectNativeDelivery(p);assert.equal(report.status,'FAIL');assert.equal(report.images.length,0);assert.equal(report.file_evidence.errors[0].code,'HASH_MISMATCH');
});

test('offline browser executes local interaction and records bounded mechanical checks rather than claiming launch readiness',async t=>{
 const html='<!doctype html><html lang="en"><head><title>Preview</title><style>body{margin:20px}button{padding:20px}</style></head><body><h1>Useful local page</h1><button id="start" onclick="document.querySelector(\'#result\').hidden=false">Show details</button><p id="result" hidden>Details are visible</p></body></html>';
 const p=await fixture(t,{page:{path:'index.html',content:html}});p.manifest.pages=[{id:'page',serve:['page'],primary_action:{selector:'#start',expected_visible:'#result'}}];
 const report=await inspectNativeDelivery(p);assert.equal(report.status,'PASS',JSON.stringify(report));assert.equal(report.pages[0].checks.filter(check=>check.id==='responsive_overflow').length,2);assert(report.pages[0].not_checked.includes('brand_content'));assert(report.pages[0].checks.some(check=>check.id==='local_primary_action'&&check.status==='PASS'));
});

test('browser blocks external resources and cannot pass an untested buyer interaction',async t=>{
 const p=await fixture(t,{page:{path:'index.html',content:'<!doctype html><title>Missing context</title><body><p>Page</p><img src="https://example.invalid/product.jpg"></body>'}});p.manifest.pages=[{id:'page',serve:['page']}];
 const report=await inspectNativeDelivery(p);assert.equal(report.status,'FAIL');assert(report.pages[0].checks.some(check=>check.id==='offline_assets'&&check.status==='FAIL'));assert(report.pages[0].checks.some(check=>check.id==='local_primary_action'&&check.status==='NOT_RUN'));
});

test('an already visible result cannot pass as a verified primary-action state transition',async t=>{
 const p=await fixture(t,{page:{path:'index.html',content:'<!doctype html><title>False action</title><body><button id="start">No action</button><p id="result">Already here</p></body>'}});p.manifest.pages=[{id:'page',serve:['page'],primary_action:{selector:'#start',expected_visible:'#result'}}];
 const report=await inspectNativeDelivery(p);assert.equal(report.status,'FAIL');assert.match(report.pages[0].error,/already visible/);
});

test('CLI preflight ignores file attempts to authorise paid execution',async t=>{
 const p=await fixture(t,{}),input={plan:imagePlan,tools:[tool('api',['raster_generation','raster_inspection','semantic_review'],'PAID')],allow_paid:true};
 await fs.writeFile(path.join(p.root,'preflight.json'),JSON.stringify(input));let output='';
 const code=await runNativeInspectionCLI(['preflight','--root',p.root,'--manifest','preflight.json'],{stdout:{write:value=>output+=value},stderr:{write:value=>assert.fail(value)}});
 assert.equal(code,1);assert.equal(JSON.parse(output).status,'BLOCKED');
});
