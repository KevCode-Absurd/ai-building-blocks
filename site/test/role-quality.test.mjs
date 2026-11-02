import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {unzipSync,strFromU8} from 'fflate';
import {rankSpecialists} from '../src/roles/specialist-matching.mjs';
import {roleEvaluation,rubricSha,ROLE_NAMES} from '../src/roles/role-enrichment.mjs';
import {nextVersion} from '../src/roles/role-versions.mjs';
import {specialistFiles} from '../src/roles/specialist-worker.mjs';
import {CONTEXT_METHOD} from '../src/roles/context-intake.mjs';
const read=p=>fs.readFileSync(new URL('../public'+p,import.meta.url));
const index=JSON.parse(read('/data/roles-index.json')),roles=index.roles.map(r=>JSON.parse(read('/data/roles/'+r.id+'.json')));
const blocks=new Map(JSON.parse(read('/data/blocks.json')).blocks.map(b=>[b.slug,b]));
const real=r=>r.resources.filter(x=>!x.onboarding&&!x.reviewer);

test('context setup and tools follow the kind of work, so unrelated roles get no brand research or store tools',()=>{
 const brandless=roles.filter(r=>r.contextKind!=='brand');assert(brandless.length>400);
 for(const r of brandless){const own=(blocks.get(r.lead).uses??[]).includes(CONTEXT_METHOD);if(!own)assert(!r.resources.some(x=>x.slug===CONTEXT_METHOD),r.id);}
 for(const r of roles){const onboarding=r.resources.find(x=>x.onboarding);assert(onboarding,r.id);}
 const historian=roles.find(r=>r.id==='academic-historian');assert.equal(historian.contextKind,'research');assert(!historian.tools.some(t=>/^Shopify/.test(t)));
 assert(roles.filter(r=>r.area!=='commerce'&&r.tools.some(t=>/^Shopify/.test(t))).length<120,'Store tools come only from a role\'s own working methods.');
});

test('every role carries working rules, checks and golden tasks, and most carry a worked example',()=>{
 for(const r of roles){
  assert(r.expertise.principles.length>=3&&r.expertise.pitfalls.length>=2&&r.expertise.quality.length>=2,r.id);
  assert(r.evaluation.rubric.length>=4&&r.evaluation.goldenTasks.length>=2,r.id);assert(['NOT_RUN','PASS','FAIL'].includes(r.evaluation.status));
  for(const line of [...r.expertise.principles,...r.expertise.pitfalls,...r.expertise.quality])assert(!/not instructions|role[- ]play/i.test(line),r.id+': '+line);
 }
 assert(roles.filter(r=>r.workedExample.outputs.length).length/roles.length>0.98);
 for(const id of ['media-buyer','seo-specialist','coding-specialist','cro-specialist'])assert(roles.find(r=>r.id===id).expertise.sources.curated,id);
});

test('instructions put the role\'s own expertise before the shared protocol and stay small enough to read',()=>{
 for(const r of roles){
  const i=r.instructions,at=h=>i.indexOf(h);
  assert(at('## What good looks like')>0&&at('## What good looks like')<at('## Operating protocol'),r.id);
  assert(at('## Decision rules')<at('## Context before strategy and production'),r.id);
  assert(Buffer.byteLength(JSON.stringify(r))<250_000,r.id);
 }
 const median=a=>a.sort((x,y)=>x-y)[a.length>>1];
 assert(median(roles.map(r=>r.instructions.length))<16_000,'Median instructions stay well under the old 20k characters.');
});

test('support methods and reviewer minds are labelled, distinct and never replace the role\'s own method',()=>{
 for(const r of roles){
  assert.equal(new Set(r.resources.map(x=>x.slug)).size,r.resources.length,r.id);
  assert(r.resources[0].slug===r.lead,r.id);
  for(const x of r.resources.filter(x=>x.reviewer))assert.equal(x.kind,'mind',r.id);
  for(const x of r.resources.filter(x=>x.support))assert(!x.bundled&&!x.onboarding,r.id);
 }
 assert(roles.filter(r=>real(r).length===1).length<10,'Almost every role has more than one working method.');
 const withMind=roles.find(r=>r.resources.some(x=>x.reviewer)),files=specialistFiles(withMind);
 assert(files['PLAYBOOK.md'].includes('second-opinion pass'));assert(JSON.parse(files['worker.json']).routes.find(x=>x.purpose==='review').invocation.includes('endorsing'));
});

test('a stored evaluation counts only for the rubric it was graded on',()=>{
 const base={id:'x',deliverables:['A report'],inputs:['The data'],fit:['You need a report.'],expertise:{quality:['Numbers tie out.']}};
 assert.equal(roleEvaluation({...base,results:{}}).status,'NOT_RUN');
 const rubric=roleEvaluation({...base,results:{}}).rubric;
 assert.equal(roleEvaluation({...base,results:{x:{rubricSha:rubricSha(rubric),passed:true,date:'2026-11-02',model:'m',score:0.9}}}).status,'PASS');
 assert.equal(roleEvaluation({...base,results:{x:{rubricSha:'00000000',passed:true,date:'2026-11-02',model:'m',score:0.9}}}).status,'NOT_RUN');
 assert(roleEvaluation({...base,results:{}}).goldenTasks.some(t=>t.kind==='missing-input'));
});

test('a role version rises only when its own content changes, with a readable change note',()=>{
 const parts={remit:'a',expertise:'b',checks:'c',example:'d',methods:['lead@1','x@1']};
 const v1=nextVersion(undefined,parts,'2026-11-01');assert.equal(v1.version,1);
 assert.equal(nextVersion(v1,parts,'2026-11-02'),v1);
 const v2=nextVersion(v1,{...parts,expertise:'z',methods:['lead@1','y@1']},'2026-11-02');
 assert.equal(v2.version,2);assert.match(v2.changes[0].what,/working rules/);assert.match(v2.changes[0].what,/Added methods: y/);assert.match(v2.changes[0].what,/Removed methods: x/);
 for(const r of roles)if(r.version)assert(r.version.number>=1&&r.version.changes.length>=1,r.id);
});

test('role names read as people who do the job',()=>{
 for(const name of Object.values(ROLE_NAMES))assert(roles.some(r=>r.name===name),name);
 assert.equal(roles.filter(r=>/^(Make|Turn|Build|Write|Plan|Find|Fix|Get|Run|Set|Check|Prepare|Create|Clear|Audit|Teach|Keep)\b(?!-)/.test(r.name)).length,0);
 assert(index.families.length>20);for(const r of index.roles)assert(index.families.some(f=>f.id===r.family),r.id);
});

test('task matching finds the right kind of specialist for everyday requests',()=>{
 const cases=[
  ['hire a senior backend engineer',/hir|candidate|recruit/i],['recruit a sales rep',/hir|candidate|recruit/i],['interview questions for a product manager',/interview|hiring|candidate/i],
  ['review this employment contract',/contract|legal/i],['check my privacy policy for GDPR',/privacy|policy|data/i],
  ['set up GA4 tracking for my store',/tracking|analytics/i],['translate my app into Spanish',/translat|locali/i],
  ['write a cold email sequence for B2B SaaS',/cold|outreach|prospect/i],['reconcile my bank statement with Xero',/reconcil|bookkeep|ledger/i],
  ['my Meta ads CPA doubled last week',/media buyer|meta ads/i],['build a sales dashboard in SQL',/coding|dashboard/i],
  ['Draft replies to customer support tickets',/customer support|support|reply/i],['calculate my tax for this year',/tax/i],
 ];
 for(const [task,expect] of cases){const top=rankSpecialists(index,task,3);assert(top.some(r=>expect.test(r.name)),`${task} -> ${top.map(r=>r.name).join(' | ')}`);}
});

test('the base pack carries the role\'s expertise, checks, worked example and feedback guide',async()=>{
 const packs=JSON.parse(read('/data/base-specialist-packs.json')),entry=packs.packs['academic-historian'];
 const files=unzipSync(new Uint8Array(read(entry.path)));
 const text=p=>strFromU8(files[p]);
 assert(text('SOUL.md').includes('How an expert does this job'));assert(text('CHECKS.md').includes("This role's checks"));
 assert(text('EXAMPLE.md').includes('Example only, not this task'));assert(text('FEEDBACK.md').includes('"role":"academic-historian"'));
 assert(!text('CONNECTIONS.md').includes('Shopify'));assert.equal(JSON.parse(text('specialist.json')).evaluation,'NOT_RUN');
});
