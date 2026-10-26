import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeTaskRecipe, buildTaskPrompt, buildTaskWorkflow, taskInputSheet } from '../src/lib/copyable-task.mjs';
const source='---\nname: analogy-teacher\n---\n# Method\nAsk for a concept and a familiar field. Explain one analogy and where it breaks. Wait for the learner to restate it, then introduce correct terms.\n## Checks\n- [ ] State the analogy limits.\n- [ ] Wait for the learner response.\n';
const block={slug:'analogy-teacher',name:'Analogy teacher',task:'teach-and-train',inputs:['source_text','brief?'],outputs:['document'],hasFiles:true,uses:['learning-checker']};
const page={you_give:['Concept and confusing part.','A familiar field.'],you_get:['One analogy with limits.','A learner question.'],how_it_works:[{title:'Locate the gap',text:'Ask what is unclear.'},{title:'Teach and check',text:'Explain one analogy, wait, then introduce precise terms.'}],judge:['Correct terms follow confirmed understanding.'],works_best_with:{tools:[{name:'File reader',why:'Read the lesson notes.'}]}};
test('task request carries real inputs, outputs, frontmatter, every method clause and missing-input rules',()=>{const r=makeTaskRecipe(block,page,source),p=buildTaskPrompt(r,source);assert.match(p,/INPUT_1 \(Concept and confusing part\.\)/);assert.match(p,/Unfilled square-bracket input fields are missing/);assert.match(p,/One analogy with limits/);assert.ok(p.includes('Wait for the learner to restate it'));assert.ok(p.includes('State the analogy limits'));assert.match(p,/download the complete task pack/i);assert.match(p,/does not grant tools or permissions/);assert.ok(p.includes(source.trim()));});
test('workflow uses task stages, retains interactive checkpoints and carries honest check states',()=>{const r=makeTaskRecipe(block,page,source),w=buildTaskWorkflow(r,source,'GOAL: Learn queues\nINPUT_1: queues\nINPUT_2: kitchens');assert.match(w,/2\. Locate the gap: Ask what is unclear/);assert.match(w,/3\. Teach and check/);assert.match(w,/4\. Review:/);assert.match(w,/5\. Handoff:/);assert.match(w,/GOAL: Learn queues/);assert.match(w,/do not fabricate the user response/);assert.match(w,/PASS, FAIL or NOT_RUN/);assert.match(w,/linked skills/);});
test('empty methods and unsafe identifiers fail, optional ports are readable',()=>{assert.throws(()=>makeTaskRecipe({...block,slug:'../x'},page,source));assert.throws(()=>makeTaskRecipe(block,page,''));const r=makeTaskRecipe({...block,hasFiles:false,uses:[]},{},source);assert.deepEqual(r.inputs,['source text','brief']);assert.match(taskInputSheet(r),/AVAILABLE_TOOLS/);assert.match(buildTaskWorkflow(r,source),/follow the complete skill method below/);});
test('example prompts and caveats are not promoted into ordered workflow stages',()=>{
  const example='## Key prompts\n### Process design\n1. Design a process.\n2. Draft a policy.\n## Protocol caveats\n1. Evidence takes time.\n2. Models can be wrong.';
  const r=makeTaskRecipe(block,{},example);assert.deepEqual(r.steps,[]);
  assert.equal(r.outputGuidance,'');
  const plain=makeTaskRecipe(block,{},'## Workflow\n1. Read the supplied evidence.\n2. Make an evidence table.\n## Example Output\nA made-up claim.');
  assert.equal(plain.steps.length,2);assert.equal(plain.outputGuidance,'');
});
test('source schemas can supply precise launch fields and local-only rules survive copying',()=>{
  const s='---\ninput_schema:\n  required:\n    - field: learner_context\nallowed-tools: local-files\n---\n## Method\nKeep data local-only. Do not send patient facts to an external model.';
  const r=makeTaskRecipe(block,{...page,sourceInputFields:['learner_context: year and learning need']},s);
  assert.deepEqual(r.inputs,['learner_context: year and learning need']);assert.equal(r.localDataRules,true);
  for(const request of [buildTaskPrompt(r,s),buildTaskWorkflow(r,s)]){assert.ok(request.includes(s));assert.match(request,/Restricted data must stay in its approved environment/);assert.match(request,/allowed-tools: local-files/);}
});
