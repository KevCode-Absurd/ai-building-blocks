import test from 'node:test';
import assert from 'node:assert/strict';
import {proposeTeam,getApproaches,buildOrgChart} from '../src/jobs/propose-team.mjs';
import {rerankDiverse,rankSpecialists} from '../src/roles/specialist-matching.mjs';

const revision='b'.repeat(64);
const roles=[
 {id:'general-coordinator',name:'General coordinator',summary:'Scope a job and agree a rubric',seat_suitability:['coordinator'],department:'operations',lenses:['operator']},
 {id:'writer',name:'Writer',summary:'Write customer launch messages',seat_suitability:['maker','strategist'],department:'marketing',families:['message'],lenses:['customer'],job:'write-emails'},
 {id:'designer',name:'Designer',summary:'Design visual launch messages',seat_suitability:['maker','strategist'],department:'design',families:['visual'],lenses:['craft'],job:'make-images'},
 {id:'skeptic',name:'Sceptic',summary:'Challenge launch messages',seat_suitability:['red_team','strategist'],department:'product',lenses:['sceptic']},
 {id:'checker',name:'Fact checker',summary:'Check claims in launch messages',seat_suitability:['fact_checker'],department:'data',lenses:['numbers']},
 {id:'judge',name:'Judge',summary:'Review launch messages against rubric',seat_suitability:['judge'],department:'security',lenses:['legal-and-safety']},
 {id:'critic',name:'Critic',summary:'Critique launch messages for brand fit',seat_suitability:['critic'],department:'marketing',lenses:['brand-guardian']},
 ...Array.from({length:5},(_,n)=>({id:'extra-'+n,name:'Launch specialist '+n,summary:'Write and review customer launch messages',department:'specialist-'+n,seat_suitability:['maker','strategist','judge','critic'],lenses:['extra-'+n]})),
].map(role=>({...role,area:role.department,deliverables:['Checked launch work'],resources:[{slug:role.id+'-method',revision}]}));
const approaches={review_status:'REVIEWED',jobs:{'write-emails':{output_shape_default:'many_artifacts',default_volume:10,lenses:[],families:[{id:'message',name:'Message',what_it_looks_like:'Written launch message',items:['writer-method'],pickers:[],checks:[],tools_needed:['text'],modality:['text']},{id:'visual',name:'Visual',what_it_looks_like:'A visual launch message',items:['designer-method'],pickers:[],checks:[],tools_needed:['image'],modality:['image']}]}},revisions:{'writer-method':revision,'designer-method':revision}};
const context={roles:{roles},approaches,personas:roles.map(role=>({id:'persona-'+role.id,roles:[role.id],seat_suitability:role.seat_suitability,lenses:role.lenses,department:role.department}))};
const input={task:'Write and design customer launch messages',job:'write-emails',tier:'standard',host_capabilities:{tools:['text','image']}};
test('standard roster is deterministic, independent and within seven seats',()=>{
 const team=proposeTeam(input,context);assert(team.ok);assert.deepEqual(proposeTeam(input,context),team);assert.equal(team.seats.length,7);assert.equal(team.model_calls,0);
 assert(team.seats.some(seat=>seat.seat_type==='red_team'));assert(team.seats.some(seat=>seat.seat_type==='fact_checker'));
 const makers=team.seats.filter(seat=>seat.seat_type==='maker');assert.equal(makers.length,2);assert.equal(new Set(makers.map(seat=>seat.lens)).size,2);
 for(const seat of team.seats.filter(seat=>['coordinator','fact_checker','judge'].includes(seat.seat_type)))assert(!seat.seat_types.includes('maker'));
 const lead=team.seats.find(seat=>seat.seat_id===team.lead_seat_id);assert(lead.seat_types.includes('strategist'));assert(team.working_groups.every(group=>group.reports_to===team.coordinator_seat_id));
 for(const seat of team.seats)for(const item of seat.toolbox)assert.match(item.revision_sha256,/^[a-f0-9]{64}$/);
});
test('task lead changes with the request while the intake coordinator remains general',()=>{
 const design=proposeTeam({...input,task:'Design visual launch messages'},context),writing=proposeTeam({...input,task:'Write customer launch messages'},context);
 const lead=team=>team.seats.find(seat=>seat.seat_id===team.lead_seat_id).role_id;
 assert.equal(design.seats[0].role_id,'general-coordinator');assert.equal(writing.seats[0].role_id,'general-coordinator');assert.equal(lead(writing),'writer');assert.equal(lead(design),'designer');
 // A visual-only palette also changes the production lead rather than
 // installing a fixed department head.
 const visual=proposeTeam({...input,task:'Design visual launch messages',job_card:{dials:{families:{value:['visual']}}}},context);assert.equal(lead(visual),'designer');
});
test('quick and deep tiers keep independent judges and apply the seat caps',()=>{
 for(const [tier,lower,upper] of [['quick',3,4],['deep',8,12]]){const team=proposeTeam({...input,tier},context);assert(team.ok);assert(team.seats.length>=lower&&team.seats.length<=upper);const judgeIds=team.seats.filter(seat=>seat.seat_type==='judge').map(seat=>seat.role_id);assert.equal(judgeIds.length,tier==='deep'?2:1);assert(team.seats.filter(seat=>seat.seat_type==='maker').every(seat=>!judgeIds.includes(seat.role_id)));}
});
test('MMR spreads equal relevance across family, lens and department facets',()=>{
 const rows=[{role:{id:'a',families:['same'],lenses:['same'],department:'same'},score:10},{role:{id:'b',families:['same'],lenses:['same'],department:'same'},score:9.8},{role:{id:'c',families:['other'],lenses:['other'],department:'other'},score:9.5}];
 assert.deepEqual(rerankDiverse(rows).map(row=>row.role.id),['a','c','b']);assert.deepEqual(rerankDiverse(rows),rerankDiverse(rows));
 assert.equal(rankSpecialists({roles:roles.slice(0,3)},'Write customer launch messages',1)[0].id,'writer');
});
test('unsupported tools, missing revisions and mapping gaps are honest warnings',()=>{
 const team=proposeTeam({...input,host_capabilities:{tools:['text']}},context);assert(team.seats.some(seat=>seat.unavailable_tools?.includes('image')));
 const missing=proposeTeam({...input,job:'unknown'},{...context,approaches:{jobs:{}}});assert(missing.warnings.some(warning=>warning.path==='families'));assert.equal(missing.model_calls,0);
 const unavailable=proposeTeam(input,{...context,approaches:{...approaches,revisions:{}}});assert(unavailable.warnings.some(warning=>/revision/.test(warning.message)));
});
test('approaches and org chart are generic deterministic read-only views',()=>{
 assert.equal(getApproaches(approaches,{job:'write-emails'}).families.length,2);assert.equal(getApproaches(approaches,{job:'missing'}).coverage.status,'UNKNOWN_JOB');
 const chart=buildOrgChart(context);assert.equal(chart.model_calls,0);assert(chart.departments.some(department=>department.roles.some(role=>role.id==='writer')));assert(!JSON.stringify(chart).includes('department_head'));
 assert.equal(proposeTeam({},context).ok,false);assert.equal(proposeTeam({...input,tier:'huge'},context).ok,false);
});
