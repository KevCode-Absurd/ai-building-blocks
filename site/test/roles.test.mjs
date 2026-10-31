import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {build} from 'esbuild';
import YAML from 'yaml';
import {buildRoles} from '../scripts/build-roles.mjs';
import {roleSeeds,FEATURED_ROLES} from '../src/roles/role-definitions.mjs';
import {rolePage} from '../scripts/lib/role-pages.mjs';
const read=file=>fs.readFileSync(new URL('../public/'+file,import.meta.url));
const bytes=read('data/blocks.json'),catalogue=JSON.parse(bytes),manifest=JSON.parse(read('data/public-api-manifest.json'));
const pages=new Map(),skills=new Map();
const page=id=>{if(!pages.has(id))pages.set(id,JSON.parse(read('data/pages/'+id+'.json')));return pages.get(id);};
const skill=id=>{if(!skills.has(id))skills.set(id,read('skills/'+id+'/SKILL.md').toString());return skills.get(id);};
const built=buildRoles({catalogue,manifest,page,skill}),byId=new Map(built.profiles.map(r=>[r.id,r]));
const strings=value=>Array.isArray(value)?value.flatMap(v=>typeof v==='string'&&v.trim()?[v.trim()]:v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===1&&typeof Object.values(v)[0]==='string'?[`${Object.keys(v)[0]}: ${Object.values(v)[0]}`]:[]):[];
const bundle=await build({stdin:{contents:'export {createRoleFlow,roleLaunchPrompt} from "./src/roles/role-runtime.ts";export {decodeWire} from "./src/lib/data.ts";export {validateCustomSkills,withCustomSkills} from "./src/lib/custom-skill-data.ts";',resolveDir:fileURLToPath(new URL('..',import.meta.url))},bundle:true,write:false,format:'esm',platform:'browser'});
const runtime=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const c=runtime.decodeWire(catalogue);c.sourceHash=createHash('sha256').update(bytes).digest('hex');
const brief=role=>({goal:'Complete the supplied synthetic task and hand back checked files. Do not publish or send them.',context:'Synthetic QA fixture. No customer data or outside accounts are supplied.',tools:'Only use the actual tools available in this session.',deliverables:[...role.deliverables],resources:role.resources.map(r=>r.slug),me:''});

test('every existing agent and complete workflow has a distinct role setup with the seven requested specialists',()=>{
 const composites=catalogue.blocks.filter(b=>['agent','workflow','routine'].includes(b.type)||b.category==='orchestrator');
 const expectedLeads=new Set([...composites.map(r=>r.slug),...FEATURED_ROLES.map(r=>r.lead)]);
 assert.equal(built.profiles.length,expectedLeads.size);
 assert.equal(new Set(built.profiles.map(r=>r.lead)).size,expectedLeads.size);
 assert.equal(new Set(built.profiles.map(r=>r.id)).size,built.profiles.length);
 assert.equal(new Set(built.profiles.map(r=>r.name.toLowerCase())).size,built.profiles.length);
 for(const featured of FEATURED_ROLES)assert.equal(byId.get(featured.id).lead,featured.lead);
 assert.deepEqual(new Set(roleSeeds(catalogue.blocks).map(r=>r.lead)),expectedLeads);
});
test('role capabilities, inputs, outputs and usage come from their real methods, with complete sources and credits',()=>{
 for(const r of built.profiles){
  const p=page(r.lead), seed=FEATURED_ROLES.find(seed=>seed.id===r.id);assert.deepEqual(r.inputs,strings(seed?.remit?.inputs??p.you_give),r.id);assert.deepEqual(r.deliverables,strings(seed?.remit?.deliverables??p.you_get),r.id);
  assert.deepEqual(r.fit,strings(seed?.remit?.fit??p.when),r.id);assert.deepEqual(r.limits,[...strings(seed?.remit?.limits??p.not_for),...strings(seed?.limits)],r.id);assert.deepEqual(r.method,strings(p.how_to_use),r.id);
  assert(r.capabilities.length&&r.functions.length&&r.inputs.length&&r.deliverables.length,r.id);
  assert.equal(r.catalogueHash,c.sourceHash);assert(r.instructions.includes('not executed'));
  assert.equal(YAML.parse(r.instructions.split('---')[1]).name,'custom-role-'+r.id);
  for(const resource of r.resources){assert.equal(resource.revision,manifest.resources[resource.slug].revision_sha256);assert.equal(createHash('sha256').update(skill(resource.slug)).digest('hex'),manifest.resources[resource.slug].instruction.sha256);assert.deepEqual(r.functions.find(f=>f.method===resource.slug).deliverables,strings(page(resource.slug).you_get));}
 }
});
test('all role setups make valid portable workflows and retain every selected method as support rather than invented edges',()=>{
 for(const r of built.profiles){const f=runtime.createRoleFlow(c,r,brief(r),'role-fixture');assert.equal(f.nodes.length,1,r.id);assert.equal(f.edges.length,0,r.id);assert(f.customSkills[0].slug.length<=77,r.id);const scoped=runtime.withCustomSkills(c,f.customSkills);assert.deepEqual(scoped.bySlug[f.nodes[0].slug].uses,r.resources.map(x=>x.slug));assert.equal(f.goal,brief(r).goal);assert(f.customSkills[0].workerFiles['SOUL.md']);assert.deepEqual(runtime.validateCustomSkills(f.customSkills)[0].workerFiles,f.customSkills[0].workerFiles);}
 const role=byId.get('executive-assistant'),b=brief(role);b.context='Use only the supplied synthetic calendar and notes.';b.me='## Work\nSynthetic leadership role.\n';
 const f=runtime.createRoleFlow(c,role,b,'role-fixture'),prompt=runtime.roleLaunchPrompt(role,b);
 assert(f.notes.includes(b.context)&&f.notes.includes(b.me));assert(prompt.includes(b.context)&&prompt.includes(b.me)&&prompt.includes(b.goal));
 assert.match(prompt,/full methods/);assert.match(prompt,/actual deliverables/);
});
test('role preparation rejects missing inputs, unknown sources, dropped bundled methods, stale data and oversized private notes',()=>{
 const r=byId.get('coding-specialist'),b=brief(r);
 assert.throws(()=>runtime.createRoleFlow(c,r,{...b,goal:''},'x'),/Describe the task/);
 assert.throws(()=>runtime.createRoleFlow(c,r,{...b,resources:[...b.resources,'unknown-method']},'x'),/methods from this role/);
 assert.throws(()=>runtime.createRoleFlow(c,r,{...b,resources:b.resources.filter(s=>s!==r.lead)},'x'),/primary method/);
 const child=r.resources.find(s=>s.bundled);assert(child);assert.throws(()=>runtime.createRoleFlow(c,r,{...b,resources:b.resources.filter(s=>s!==child.slug)},'x'),/bundled sources/);
 const context=r.resources.find(s=>s.onboarding);assert(context);assert.throws(()=>runtime.createRoleFlow(c,r,{...b,resources:b.resources.filter(s=>s!==context.slug)},'x'),/context setup/);
 assert.throws(()=>runtime.createRoleFlow({...c,sourceHash:'0'.repeat(64)},r,b,'x'),/library changed/);
 assert.throws(()=>runtime.createRoleFlow(c,r,{...b,context:'x'.repeat(8001)},'x'),/Shorten/);
 assert.throws(()=>runtime.roleLaunchPrompt(r,{...b,tools:'sk-proj-'+'x'.repeat(48)}),/Remove credentials/);
 const custom=runtime.validateCustomSkills([{...runtime.createRoleFlow(c,r,b,'x').customSkills[0],resources:['missing-real-source']}]);
 assert.throws(()=>runtime.withCustomSkills(c,custom),/unavailable/);
});
test('role pages describe real functions and best use, use CreativeWork instead of vacancy markup, and keep unique titles',()=>{
 const titles=new Set();for(const r of built.profiles){const p=rolePage('/roles/'+r.id,built.index,id=>byId.get(id));assert(p);assert(!titles.has(p.documentTitle),'Duplicate role title '+p.documentTitle);titles.add(p.documentTitle);assert(p.content.includes('<h2>Capabilities</h2>'));assert(p.content.includes('<h2>Functions and deliverables</h2>'));assert(p.content.includes('<h2>Best way to use this role</h2>'));assert.equal(p.main['@type'],'CreativeWork');assert(!JSON.stringify(p).includes('JobPosting'));}
 const all=[];for(let page=1;page<=Math.ceil(built.profiles.length/24);page++){const p=rolePage(page===1?'/roles':'/roles/page/'+page,built.index,id=>byId.get(id));assert(p.main.itemListElement.length<=24);all.push(...p.main.itemListElement.map(i=>i.url));}assert.equal(new Set(all).size,built.profiles.length);
});
test('the role directory opens only one complete batch while all identities remain available for complete search on intent',()=>{
 const starter=JSON.parse(read('data/roles-starter.json'));assert(starter.starter);assert.equal(starter.roles.length,built.profiles.length);
 assert.deepEqual(starter.roles.slice(0,24),built.index.roles.slice(0,24));assert(starter.roles.slice(24).every(r=>!r.summary&&!r.deliverables.length));
 assert(gzipSync(Buffer.from(JSON.stringify(starter))).length<50_000,'Initial role data must stay small despite directory breadth.');
 const search=JSON.parse(read('data/roles-search.json'));assert.deepEqual(search.roles,built.index.roles);assert.equal(search.starter,undefined);
 for(let p=2;p<=Math.ceil(built.profiles.length/24);p++){const paged=JSON.parse(read('data/roles-pages/'+p+'.json')),from=(p-1)*24;assert.deepEqual(paged.roles.slice(from,from+24),built.index.roles.slice(from,from+24));}
});

test('the media-buyer role covers existing-account diagnosis while retaining complete individual methods',()=>{
 const r=byId.get('media-buyer');
 assert(r.fit.some(x=>x.includes('existing')));
 for(const slug of ['meta-results-review-agent','ad-sales-drop-analyst'])assert(r.resources.some(x=>x.slug===slug),slug);
 assert(r.limits.some(x=>x.includes('Platform reporting alone')));
 assert(r.instructions.includes('source-method')||r.instructions.includes('method limits')||r.instructions.includes('their scope, limitations'));
});
