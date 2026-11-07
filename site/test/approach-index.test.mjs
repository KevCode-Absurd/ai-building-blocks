import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {compileApproaches} from '../../tools/build-approaches.mjs';

const items=Array.from({length:12},(_,index)=>({slug:'maker-'+index,role:'make',job:'make-images',outputs:['image']}));
items.push({slug:'picker',role:'plan',job:'make-images'},{slug:'checker',role:'check',job:'make-images'});
const family=(id,slugs)=>({id,name:id,what_it_looks_like:'A named, recognisable kind of output.',when_it_wins:'Use when the supplied brief asks for it.',modality:['image'],tools_needed:['image'],items:slugs,pickers:['picker'],checks:['checker'],tool_guides:[],lenses:['craft']});
const source=()=>({review_status:'REVIEWED',jobs:{'make-images':{output_shape_default:'many_artifacts',default_volume:12,lenses:['craft'],families:[family('one',['maker-0','maker-1','maker-2']),family('two',['maker-3','maker-4','maker-5']),family('three',['maker-6','maker-7','maker-8']),family('four',['maker-9','maker-10','maker-11'])]}}});
const compile=value=>compileApproaches({source:value,items,lenses:{craft:{name:'Craft',minds:[],check_items:['checker']}}});

test('approach compilation is deterministic and records real coverage',()=>{
 const result=compile(source());assert(result.ok);assert.deepEqual(compile(source()),result);
 const job=result.index.jobs['make-images'];assert.equal(job.coverage.status,'PASS');assert.equal(job.coverage.covered_items,12);assert.equal(job.families.length,4);
 assert.equal(result.index.review_status,'REVIEWED');assert.equal(result.index.coverage.status,'PASS');
});
test('unknown makers, pickers, lens ids and empty families are all returned with paths',()=>{
 const value=source(),bad=value.jobs['make-images'].families[0];bad.items=[];bad.pickers=['missing'];bad.lenses=['missing-lens'];value.jobs['make-images'].families[1].items=['missing-maker'];
 const result=compile(value);assert.equal(result.ok,false);assert(result.errors.length>=4);assert(result.errors.every(error=>error.path&&error.message));
});
test('a checker is not misrepresented as a maker and four memberships are refused',()=>{
 const value=source();value.jobs['make-images'].families[0].items.push('checker');for(const row of value.jobs['make-images'].families)row.items.push('maker-11');
 const result=compile(value);assert(!result.ok);assert(result.errors.some(error=>/makers and renderers/.test(error.message)));assert(result.errors.some(error=>/three families/.test(error.message)));
});
test('typed output groups remain inventory and never disguise approach gaps',()=>{
 const result=compile({jobs:{}});assert(result.ok);const job=result.index.jobs['make-images'];assert.equal(job.families.length,0);assert.equal(job.coverage.status,'GAP');assert.equal(job.coverage.draft_output_groups.image.length,12);assert.equal(result.index.coverage.status,'GAPS_REMAIN');
});
test('minds remain optional lenses even when the compact catalogue omits their role',()=>{
 const mind={slug:'test-mind',type:'mind',role:'make',job:'think-with-minds',outputs:['mind_view']};
 const result=compileApproaches({items:[mind],lenses:{thinking:{name:'Thinking',minds:['test-mind'],check_items:[]}},source:{jobs:{'think-with-minds':{families:[],lenses:['thinking']}}}});
 assert(result.ok);assert.equal(result.index.jobs['think-with-minds'].coverage.make_items,0);assert.equal(result.index.jobs['think-with-minds'].lenses[0].minds[0],'test-mind');
 const invalid=compileApproaches({items:[mind],source:{jobs:{'think-with-minds':{families:[family('not-a-maker',['test-mind'])]}}},lenses:{craft:{}}});
 assert(!invalid.ok);assert(invalid.errors.some(error=>/optional minds/.test(error.message)));
});
test('the generated index has no orphan families and labels its review state honestly',()=>{
 const index=JSON.parse(fs.readFileSync(new URL('../public/data/approach-index.json',import.meta.url),'utf8'));
 assert.equal(index.schema,'ai-blocks-approach-index/1');assert(index.review_status);
 for(const job of Object.values(index.jobs))for(const row of job.families){assert(row.items.length);assert(row.seeds_from.length);assert(row.what_it_looks_like&&row.when_it_wins);}
 for(const job of Object.values(index.jobs))if(job.coverage.make_items>=10&&job.families.length<4)assert.equal(job.coverage.status,'GAP');
});
