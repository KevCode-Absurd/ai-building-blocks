import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {unzipSync} from 'fflate';
import {inspectSkillArchive} from '../src/lib/workflow-execution.ts';
import {buildTaskPrompt,buildTaskWorkflow} from '../src/lib/copyable-task.mjs';
test('catalogue build preserves primary-source casing and emits precise skill adapters during a normal build',async()=>{
 const base=await fs.mkdtemp(path.join(os.tmpdir(),'abb-case-test-')),cat=path.join(base,'catalogue'),folder=path.join(cat,'imported/case-fixture');
 const source=['---','name: case-fixture','description: Explain the supplied note.','input_schema:','  required:','    - field: note','      description: The complete note with source IDs.','    - name: audience','      description: The reader and their level.','  optional:','    - field: tone','      description: Preferred wording style.','output_schema:','  fields:','    - field: explanation','      description: Supported explanation with source IDs.','    - name: open_questions','      description: Unresolved facts to clarify.','      required: false','---','# Method','## Workflow','1. Read the full note and keep each source ID.','2. Explain supported facts for the named reader.','## Checks','- [ ] Preserve the original meaning.',''].join('\n');
 try {
 await fs.mkdir(path.join(folder,'references'),{recursive:true});await fs.mkdir(path.join(base,'src/lib'),{recursive:true});
 await fs.copyFile(new URL('../src/lib/data.ts',import.meta.url),path.join(base,'src/lib/data.ts'));
 await fs.writeFile(path.join(cat,'_types.yaml'),'files:\n  source_text: {desc: Supplied notes}\n  document: {desc: An explanation}\n');
 await fs.writeFile(path.join(folder,'item.yaml'),'slug: case-fixture\nname: Note explainer\norigin: imported\njob: ops\ninputs: [source_text]\noutputs: [document]\nuses: [helper-fixture]\nsteps:\n  - uses: helper-fixture\n    note: Read its supporting guide.\n');
 await fs.writeFile(path.join(folder,'page.yaml'),'headline: Note explainer\nsubhead: Share a note and get a plain explanation.\njob: work-with-files\nyou_give: [Generic input label]\nyou_get: [Generic output label]\n');
 await fs.writeFile(path.join(cat,'display-copy.yaml'),'case-fixture:\n  name: Note context checker\n  summary: Share a note and check its meaning.\n  subhead: Share source notes and get a checked explanation.\n');
 // Windows keeps the first directory-entry casing; Linux can hold both names.
 await fs.writeFile(path.join(folder,'skill.md'),source.replaceAll('\n','\r\n'));await fs.writeFile(path.join(folder,'SKILL.md'),source);
 await fs.writeFile(path.join(folder,'references/guide.md'),'# Guide\nKeep the source meaning.\n');
 const helper=path.join(cat,'general/helper-fixture');await fs.mkdir(helper,{recursive:true});
 await fs.writeFile(path.join(helper,'item.yaml'),'slug: helper-fixture\nname: Context helper\ntype: skill\njob: research\ninputs: [source_text]\noutputs: [document]\n');
 const helperSource=['---','name: helper-fixture','description: Read context.','input_schema:','  type: object','  properties:','    source_text:','      description: Source notes in full.','    goal:','      description: An optional focus.','  required: [source_text]','output_schema:','  type: object','  properties:','    summary:','      description: A supported context summary.','    questions:','      description: Any remaining questions.','  required: [summary]','---','# Context helper','Read and summarize the supplied context.',''].join('\n');
 await fs.writeFile(path.join(helper,'SKILL.md'),helperSource);
 for(const type of ['prompt','agent','workflow','routine']){
  const nonSkill=path.join(cat,'imported',type+'-fixture');await fs.mkdir(nonSkill,{recursive:true});
  await fs.writeFile(path.join(nonSkill,'item.yaml'),`slug: ${type}-fixture\nname: ${type} fixture\ntype: ${type}\njob: ops\ninputs: [source_text]\noutputs: [document]\n`);
  await fs.writeFile(path.join(nonSkill,'page.yaml'),`headline: ${type} fixture\njob: organise-work\n`);
  await fs.writeFile(path.join(nonSkill,'SKILL.md'),'# Method\nRead the supplied note.\n');
 }
 const mind=path.join(cat,'minds/mind-fixture');await fs.mkdir(mind,{recursive:true});
 await fs.writeFile(path.join(cat,'minds/_roster.yaml'),'areas: {}\nminds:\n  - slug: mind-fixture\n    name: Fictional reviewer\n    area: learning\n    seat: reviewer\n');
 await fs.writeFile(path.join(cat,'minds/_avatars.yaml'),'mind-fixture: {}\n');
 await fs.writeFile(path.join(cat,'minds/_labels.yaml'),'labels:\n  reviewer: Reviewer\npeople:\n  mind-fixture: [reviewer]\n');
 await fs.writeFile(path.join(mind,'mind.yaml'),'name: Fictional reviewer\nsummary: A fictional review fixture.\nknown_for: Reviewing fictional notes.\nuse_cases: [Review a fictional note]\nsources: []\nseats:\n  - seat: reviewer\n');
 await fs.writeFile(path.join(mind,'SKILL.md'),'# Fictional reviewer\nRead the fictional note.\n');
 const script=path.resolve(new URL('../scripts/build-index.mjs',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
 const result=spawnSync(process.execPath,[script],{cwd:base,env:{...process.env,CATALOGUE_ROOT:cat},encoding:'utf8',windowsHide:true});
 assert.equal(result.status,0,result.stderr||result.stdout);
 const bytes=await fs.readFile(path.join(base,'public/skills/case-fixture.zip'));inspectSkillArchive(bytes,'case-fixture');
 const archive=unzipSync(bytes);assert.deepEqual(Object.keys(archive).sort(),['case-fixture/SKILL.md','case-fixture/references/guide.md']);assert.equal(Buffer.from(archive['case-fixture/SKILL.md']).toString(),source);
 const page=JSON.parse(await fs.readFile(path.join(base,'public/data/pages/case-fixture.json'),'utf8')),recipe=page.copyable;
 assert.equal(recipe.name,'Note context checker');assert.equal(recipe.task,'work-with-files');assert.equal(recipe.needsFiles,true);
 assert.deepEqual(recipe.inputs,['note: The complete note with source IDs.','audience: The reader and their level.','tone: Preferred wording style. (optional)']);
 assert.deepEqual(recipe.outputs,['explanation: Supported explanation with source IDs.','open_questions: Unresolved facts to clarify. (optional)']);
 assert.deepEqual(recipe.steps.map(s=>s.text),['Read the full note and keep each source ID.','Explain supported facts for the named reader.']);
 assert.deepEqual(recipe.dependencies,['helper-fixture']);assert.ok(recipe.checks.includes('Preserve the original meaning.'));
 assert.equal(page.subhead,'Share source notes and get a checked explanation.');assert.deepEqual(page.you_give,['Generic input label']);
 assert.equal(await fs.readFile(path.join(base,'public/skills/case-fixture/SKILL.md'),'utf8'),source);
 assert.equal(await fs.readFile(path.join(folder,'SKILL.md'),'utf8'),source);
 assert.ok(buildTaskPrompt(recipe,source).includes(source.trim()));assert.ok(buildTaskWorkflow(recipe,source).includes(source.trim()));
 const minimal=JSON.parse(await fs.readFile(path.join(base,'public/data/pages/helper-fixture.json'),'utf8'));
 assert.equal(minimal.headline,undefined,'Page-less skills must not gain invented editorial headlines');
 assert.equal(minimal.html.explain,'');assert.equal(minimal.copyable.name,'Context helper');assert.equal(minimal.copyable.task,'understand-customers');assert.equal(minimal.copyable.needsFiles,false);
 assert.deepEqual(minimal.copyable.inputs,['source_text: Source notes in full.','goal: An optional focus. (optional)']);
 assert.deepEqual(minimal.copyable.outputs,['summary: A supported context summary.','questions: Any remaining questions. (optional)']);
 for(const type of ['prompt','agent','workflow','routine']){const nonSkillPage=JSON.parse(await fs.readFile(path.join(base,'public/data/pages',type+'-fixture.json'),'utf8'));assert.equal(nonSkillPage.copyable,undefined,type+' must not gain a skill adapter');}
 const mindPage=JSON.parse(await fs.readFile(path.join(base,'public/data/pages/mind-fixture.json'),'utf8'));assert.equal(mindPage.copyable,undefined,'Minds must not gain a skill adapter');
 } finally {
  assert.equal(path.dirname(base),path.resolve(os.tmpdir()));assert(path.basename(base).startsWith('abb-case-test-'));await fs.rm(base,{recursive:true,force:true});
 }
});
