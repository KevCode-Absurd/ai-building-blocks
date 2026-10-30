import test from 'node:test';import assert from 'node:assert/strict';
import {agent,source,proposal} from './fixtures/expert-agent-fixtures.mjs';
import {agentRecordDigest,reviseExpertAgent,prepareExpertAgent} from '../src/agents/expert-agent-contract.mjs';
import {startCaptureSession,validateCaptureSession,appendCaptureAnswer,nextCaptureQuestion,proposeCaptureLearning,previewCaptureReview,reviewCaptureLearning,captureEvidence} from '../src/agents/expert-agent-capture.mjs';
const start=(a=agent(),mode='interview')=>startCaptureSession(a,{id:'capture-one',mode,source:source()});
async function proposed(a=agent()){
 let s=await start(a);s=await appendCaptureAnswer(a,s,{question_id:'case',answer:'Synthetic interview: repeated tickets came from one organization. A confirmed contract would change my choice.',artifact_sha256:null});return proposeCaptureLearning(a,s,proposal());
}
test('guided capture distinguishes real-case evidence, procedures, decision cues, counterfactuals and uncertainty',async()=>{
 const a=agent();let s=await start(a);assert.equal(nextCaptureQuestion(s).question.id,'case');
 for(const id of ['case','procedure','decision','counterfactual','uncertainty','critique']){
  assert.equal(nextCaptureQuestion(s).question.id,id);s=await appendCaptureAnswer(a,s,{question_id:id,answer:`Synthetic answer for ${id}.`,artifact_sha256:null});
 }
 assert.equal(nextCaptureQuestion(s).phase,'READY_TO_PROPOSE');assert.equal(a.knowledge.length,0);
 await assert.rejects(()=>appendCaptureAnswer(a,s,{question_id:'case',answer:'Repeated',artifact_sha256:null}));
});
test('work review asks about corrected output, applicability and exceptions before proposing a transferable rule',async()=>{
 const a=agent();let s=await start(a,'work-review');
 for(const id of ['work','correction','conditions','exception','test']){assert.equal(nextCaptureQuestion(s).question.id,id);s=await appendCaptureAnswer(a,s,{question_id:id,answer:'Synthetic scoped feedback.',artifact_sha256:'a'.repeat(64)});}
 assert.equal(s.answers[0].artifact_sha256,'a'.repeat(64));assert.equal(a.version,1);
});
test('proposals remain inactive; exact acceptance binds stable source evidence and creates a parent-linked candidate',async()=>{
 const a=agent(),s=await proposed(a),preview=await previewCaptureReview(a,s,'accept');
 assert.equal(a.knowledge.length,0);assert.equal(nextCaptureQuestion(s).phase,'REVIEW_PROPOSAL');
 const result=await reviewCaptureLearning(a,s,{decision:'accept',approved_preview_sha256:preview.preview_sha256,confirmed:true});
 assert.equal(result.agent.version,2);assert.equal(result.agent.parent_sha256,await agentRecordDigest(a));assert.equal(result.agent.knowledge[0].status,'expert-approved');
 assert.equal(result.agent.sources[0].sha256,await agentRecordDigest(captureEvidence(s)));assert.deepEqual(captureEvidence(s),captureEvidence(result.session));
 assert.equal(result.evaluation_status,'NOT_RUN');assert.equal(result.published,false);assert.equal(result.session.review.assurance,'host-reported-not-independently-verified');
 const prepared=await prepareExpertAgent(result.agent,{as_of:'2026-10-30'});assert(prepared.files['expert/knowledge.json'].includes('independent-demand'));
});
test('rejection preserves the agent and records the exact rejected proposal without activating its rules',async()=>{
 const a=agent(),s=await proposed(a),p=await previewCaptureReview(a,s,'reject'),r=await reviewCaptureLearning(a,s,{decision:'reject',approved_preview_sha256:p.preview_sha256,confirmed:true});
 assert.deepEqual(r.agent,a);assert.equal(r.session.review.decision,'reject');await assert.rejects(()=>proposeCaptureLearning(a,r.session,proposal()),/reviewed/);
});
test('changed content, reversed decisions, missing confirmation and stale agents cannot reuse a review digest',async()=>{
 const a=agent(),s=await proposed(a),p=await previewCaptureReview(a,s,'accept');
 await assert.rejects(()=>reviewCaptureLearning(a,s,{decision:'accept',approved_preview_sha256:p.preview_sha256,confirmed:false}),/confirmation/);
 await assert.rejects(()=>reviewCaptureLearning(a,s,{decision:'reject',approved_preview_sha256:p.preview_sha256,confirmed:true}),/no longer matches/);
 const changed=structuredClone(proposal());changed.knowledge_changes[0].record.text='A different rule.';const updated=await proposeCaptureLearning(a,s,changed);
 await assert.rejects(()=>reviewCaptureLearning(a,updated,{decision:'accept',approved_preview_sha256:p.preview_sha256,confirmed:true}),/no longer matches/);
 const next=await reviseExpertAgent(a,{...a,name:'Changed task name'});await assert.rejects(()=>previewCaptureReview(next,s,'accept'),/stale/);
});
test('a correction supersedes only its named approved rule; rejected corrections do not suppress that rule',async()=>{
 const a=agent(),s=await proposed(a),p=await previewCaptureReview(a,s,'accept');const first=(await reviewCaptureLearning(a,s,{decision:'accept',approved_preview_sha256:p.preview_sha256,confirmed:true})).agent;
 let second=await startCaptureSession(first,{id:'review-two',mode:'work-review',source:{...source(),id:'review-source'}});
 second=await appendCaptureAnswer(first,second,{question_id:'work',answer:'Synthetic correction to a reviewed memo.',artifact_sha256:null});
 const update=proposal();update.knowledge_changes[0].replaces_id='independent-demand';update.knowledge_changes[0].record.id='independent-demand-v2';update.rubric=[];update.development_cases[0].id='new-feedback-probe';
 second=await proposeCaptureLearning(first,second,update);const preview=await previewCaptureReview(first,second,'accept');
 assert.equal(preview.candidate.knowledge.find(k=>k.id==='independent-demand').status,'rejected');assert.equal(preview.candidate.knowledge.find(k=>k.id==='independent-demand-v2').status,'expert-approved');
 const rejected=await previewCaptureReview(first,second,'reject');assert.equal(rejected.candidate.knowledge[0].status,'expert-approved');
 assert.equal(preview.candidate.development_cases.length,2);assert.equal(preview.candidate.rubric.length,1);
});
test('capture rejects source reuse, unsafe JSON, fabricated approval, incorrect order and malformed learning',async()=>{
 const a=agent(),s=await start(a);
 await assert.rejects(()=>appendCaptureAnswer(a,s,{question_id:'decision',answer:'Out of order',artifact_sha256:null}));
 assert.throws(()=>validateCaptureSession({...s,platform_verified:true}));assert.throws(()=>validateCaptureSession({...s,answers:[{question_id:'case',answer:'Bearer '+'X'.repeat(50),artifact_sha256:null}]}),/credentials/);
 await assert.rejects(()=>proposeCaptureLearning(a,s,proposal()),/evidence/);
 let captured=await appendCaptureAnswer(a,s,{question_id:'case',answer:'Synthetic evidence.',artifact_sha256:null});
 const bad=proposal();bad.knowledge_changes[0].record.status='expert-approved';await assert.rejects(()=>proposeCaptureLearning(a,captured,bad),/Unsupported/);
 const missing=proposal();missing.knowledge_changes[0].replaces_id='not-owned';await assert.rejects(()=>proposeCaptureLearning(a,captured,missing),/target/);
 const valid=await proposeCaptureLearning(a,captured,proposal());await assert.rejects(()=>appendCaptureAnswer(a,valid,{question_id:'procedure',answer:'New evidence after proposal',artifact_sha256:null}),/awaiting/);
 const cross={...a,id:'other-agent'};await assert.rejects(()=>previewCaptureReview(cross,valid,'accept'),/outside/);
});
