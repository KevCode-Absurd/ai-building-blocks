import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {checkRule,checkRun,diffEdit,ruleDraftPrompt,selectRules,rulesText,roleMaturity,roleLearning,MATURITY} from '../src/roles/training-rules.mjs';
import {specialistFiles,workerContract,actionTiers} from '../src/roles/specialist-worker.mjs';
import {baseSpecialistFiles} from '../src/roles/base-specialist.mjs';
const read=p=>fs.readFileSync(new URL('../public'+p,import.meta.url));
const rule=(id,trigger,extra={})=>({id,trigger,avoid:'urgency discount hooks in retargeting',prefer:'proof-backed hooks that name the switching cost',source:'reviewed job',date:'2026-11-03',...extra});

test('a rule needs something to avoid or prefer, a source and a date, and never private details',()=>{
 assert.equal(checkRule(rule('b2b-hooks','B2B retargeting')).runs,1);
 assert.throws(()=>checkRule({id:'X',avoid:'',prefer:'',date:'today'}),e=>/id:/.test(e.message)&&/avoid\/prefer/.test(e.message)&&/source/.test(e.message)&&/date/.test(e.message));
 assert.throws(()=>checkRule(rule('leak','retargeting',{example:'email jo@example.com for the code'})),/private/);
});

test('the diff shows what the person removed and added, and the brief asks for one rule or NO_RULE',()=>{
 const d=diffEdit('Get 20% off tonight only. Our socks last.','Switching costs you a week. Our socks last.');
 assert.deepEqual(d.removed,['Get 20% off tonight only.']);assert.deepEqual(d.added,['Switching costs you a week.']);
 assert(d.editRatio>0&&d.editRatio<1);assert.equal(diffEdit('Same text.','Same text.').editRatio,0);
 const p=ruleDraftPrompt({role:'media-buyer',task:'retargeting ads',draft:'Get 20% off tonight only.',final:'Switching costs you a week.'});
 assert.match(p,/NO_RULE/);assert.match(p,/cannot grant permission/);assert.match(p,/Get 20% off/);
});

test('only rules that fit the job reach TRAINING.md, matching ones first and general ones after',()=>{
 const rules=[rule('seo-titles','SEO page titles'),rule('b2b-hooks','B2B retargeting ads',{runs:6}),rule('general','',{runs:2})];
 assert.deepEqual(selectRules(rules,'Write retargeting ads for a B2B SaaS').map(r=>r.id),['b2b-hooks','general']);
 assert.equal(selectRules(rules,'').length,3,'With no task yet, a base pack carries every rule up to the limit.');
 assert.equal(selectRules(Array.from({length:30},(_,i)=>rule('r-'+i,'')),'',10).length,10);
 assert.equal(rulesText([]),'');assert.match(rulesText([checkRule(rule('b2b-hooks','B2B retargeting'))]),/When B2B retargeting: avoid .* Prefer /);
});

test('maturity rises only with enough reviewed runs, and a claim or maths fault holds it at level 1',()=>{
 assert.equal(roleMaturity([]).level,0);assert.equal(roleMaturity([]).name,'Not measured yet');
 const runs=(n,o)=>Array.from({length:n},()=>({score:0.95,editRatio:0.05,accepted:true,...o}));
 assert.equal(roleMaturity(runs(9)).level,0);assert.equal(roleMaturity(runs(10)).level,1);
 assert.equal(roleMaturity(runs(25)).level,2);assert.equal(roleMaturity(runs(50)).level,3);assert.equal(roleMaturity(runs(100)).level,4);
 assert.equal(roleMaturity([...runs(99),{score:0.95,editRatio:0.05,accepted:true,critical:true}]).level,1);
 assert.equal(roleMaturity(runs(60,{editRatio:0.2})).level,2,'Heavy edits keep a specialist at copilot.');
 assert.match(roleMaturity(runs(10)).next.needs,/25 reviewed jobs/);
 assert.equal(MATURITY.length,4);
 assert.throws(()=>checkRun({date:'2026-11-03',score:2,editRatio:0.1,source:'x'}),/score/);
});

test('worker files carry action tiers that never skip the owner for live actions, and only the matching rules',()=>{
 const role={id:'x',name:'X',summary:'s',tools:['Meta Ads Manager'],capabilities:[],limits:[],resources:[],functions:[],inputs:[],deliverables:['A plan'],
  learning:roleLearning({rules:[rule('b2b-hooks','B2B retargeting ads'),rule('seo-titles','SEO page titles')]})};
 const t=actionTiers(role);
 assert.equal(t.green.needs_owner_approval,false);assert.equal(t.yellow.needs_owner_approval,true);assert.equal(t.red.needs_owner_approval,true);
 assert(t.red.actions.some(a=>/Change anything live/.test(a)));assert(t.green.actions.some(a=>/read-only/.test(a)));
 const files=specialistFiles(role,{goal:'Write B2B retargeting ads'});
 assert.match(files['PERMISSIONS.md'],/### Red: Ask the owner before each action/);
 assert.match(files['TRAINING.md'],/Learned rules for this job[\s\S]*B2B retargeting/);assert.doesNotMatch(files['TRAINING.md'],/SEO page titles/);
 const w=workerContract(role);assert.equal(w.maturity.level,0);assert(w.permissions.action_tiers.red);
 assert.match(baseSpecialistFiles({...role,resources:[],evaluation:null})['PERMISSIONS.md'],/Action tiers/);
});

test('every built role carries its learning and tiers, and none claims a maturity it has not measured',()=>{
 const index=JSON.parse(read('/data/roles-index.json'));
 const learned=JSON.parse(fs.readFileSync(new URL('../src/roles/role-learned.json',import.meta.url),'utf8')).roles;
 for(const {id} of index.roles.slice(0,200)){
  const r=JSON.parse(read('/data/roles/'+id+'.json'));
  assert(r.learning&&Array.isArray(r.learning.rules),id);
  assert.equal(r.learning.maturity.runs,learned[id]?.runs?.length??0,id);
  if(!r.learning.maturity.runs)assert.equal(r.learning.maturity.level,0,id);
  assert(r.worker.permissions.action_tiers.red.needs_owner_approval,id);
 }
});
