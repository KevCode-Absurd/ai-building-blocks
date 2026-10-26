// Source-grounded staging. Headings inside code fences are examples, not process steps.
import crypto from 'node:crypto';
export const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
export const cleanHeading=s=>s.replace(/^[^\p{L}\p{N}]+/u,'').replace(/\*\*/g,'').trim();
export function sourceMethod(bytes){
 const text=bytes.toString('utf8').replace(/\r\n?/g,'\n'),lines=text.split('\n');
 const front=text.match(/^---\n[\s\S]*?\n---\n?/);
 const body=front?text.slice(front[0].length):text;
 let fence=null;const headings=[];
 for(let i=0;i<lines.length;i++){
  const f=lines[i].match(/^\s*(`{3,}|~{3,})/);
  if(f){if(!fence)fence={char:f[1][0],length:f[1].length};else if(f[1][0]===fence.char&&f[1].length>=fence.length)fence=null;continue;}
  if(fence)continue;const h=lines[i].match(/^(#{1,6})\s+(.+?)\s*#*$/);
  if(h)headings.push({level:h[1].length,title:cleanHeading(h[2]),startLine:i+1});
 }
 for(let i=0;i<headings.length;i++){const h=headings[i],next=headings.slice(i+1).find(n=>n.level<=h.level);h.endLine=next?next.startLine-1:lines.length;h.text=lines.slice(h.startLine,h.endLine).join('\n').trim();}
 const process=headings.find(h=>h.level===2&&/workflow|(?:your |our |execution |step.by.step )process|execution plan/i.test(h.title));
 const children=process?headings.filter(h=>h.level===3&&h.startLine>process.startLine&&h.endLine<=process.endLine):[];
 const numbered=children.filter(h=>/^(?:step|phase|stage)\s*\d+/i.test(h.title));
 let basis,methodStages;
 if(numbered.length>=2){basis='source-sequence';methodStages=numbered.map((h,i)=>({id:'method-'+(i+1),title:h.title,kind:'source-stage',sourceRanges:[range(h)],instructions:h.text,checkpoint:'Record this stage’s actual decisions, artifacts and checks. Preserve its source-specific branch and stop rules.'}));}
 else if(process){
  // Unnumbered subheadings can be alternate procedures. Do not invent ordering among them.
  const route=children.length>=2;
  basis=route?'source-route':'source-process';
  methodStages=[{id:'source-method',title:route?'Choose and run the matching source procedure':process.title,kind:route?'source-route':'source-process',sourceRanges:[range(process)],instructions:route?`Choose only the procedure(s) matching the task: ${children.map(h=>h.title).join('; ')}. Preserve the selected procedure’s internal order, conditionals and questions. ${process.text}`:process.text,checkpoint:'Record the chosen procedure, what was performed, resulting artifacts and any blocked source obligation.'}];
 }else{
  basis='adapter-from-source-sections';
  const methods=headings.filter(h=>h.level===2&&/mission|capabilit|specialized skills|decision framework|deliverable|method|approach|responsibilit/i.test(h.title));
  const selected=methods.length?methods:headings.filter(h=>h.level===2&&!/identity|memory|communication|success metric/i.test(h.title));
  methodStages=[{id:'source-method',title:'Apply the source method to the agreed task',kind:'adapter-method',sourceRanges:selected.map(range),instructions:`This source has no explicit ordered process. Use the relevant source sections without claiming they were an upstream sequence: ${selected.map(h=>h.title).join('; ')}. Select methods by the task, preserve every applicable constraint and deliver the requested result.`,checkpoint:'Record the methods selected, the work produced and the evidence used. This ordering is an AI Blocks adapter, not a sequence claimed by the source.'}];
 }
 const constraints=headings.filter(h=>h.level===2&&/critical|rule|standard|boundar|does not do|safety|compliance/i.test(h.title));
 const deliverables=headings.filter(h=>h.level===2&&/deliverable|success metric|quality|validation|acceptance|checklist/i.test(h.title));
 const stages=[{id:'scope',title:'Confirm the task and required evidence',kind:'adapter-intake',sourceRanges:constraints.map(range),instructions:'Read the entire source profile once before execution. Match the requested outcome to its scope. Identify required inputs, evidence, tools, source-specific prerequisites and existing authorization. Ask only for missing facts that affect the next step. Do not invent them.',checkpoint:'A task brief with the requested result, available evidence, source prerequisites, relevant procedure and unresolved required inputs.'},...methodStages,{id:'review',title:'Check the result against the source requirements',kind:'adapter-review',sourceRanges:[...constraints,...deliverables].map(range),instructions:'Review the actual result against all applicable source rules, deliverable requirements and success targets. Record evidence for each check actually performed. Mark unavailable checks NOT_RUN and unresolved requirements BLOCKED. Targets and sample case studies are not proof that a check passed.',checkpoint:'A review record with the result revision, evidence, PASS/FAIL/NOT_RUN/BLOCKED states and the next permitted action.'},{id:'handoff',title:'Hand back the work and its open items',kind:'adapter-handoff',sourceRanges:deliverables.map(range),instructions:'Return the requested deliverable using the source’s required format when applicable, with the source-stage checkpoint record, evidence, remaining gaps and any action still awaiting authorization. State what ran and what did not. Resume only from the earliest affected checkpoint after an input or output changes.',checkpoint:'The task result, checkpoint record, unresolved gaps and next permitted action.'}];
 const coverage=headings.filter(h=>h.level>=2).map(h=>({heading:h.title,level:h.level,startLine:h.startLine,endLine:h.endLine,normalizedSectionSha256:digest(h.text),treatment:/identity|memory|experience/i.test(h.title)?'role-context-with-no-claimed-history':'full-normative-source-preserved',activeAt:stages.filter(s=>s.sourceRanges.some(r=>r.startLine<=h.startLine&&r.endLine>=h.endLine)).map(s=>s.id)}));
 return {body,normalizedBodySha256:digest(body),lineCount:lines.length,headings,process:process?range(process):null,basis,stages,coverage};
}
const range=h=>({heading:h.title,startLine:h.startLine,endLine:h.endLine});
export function formatSlug(agentSlug,format){const full=agentSlug+'-'+format;if(full.length<64)return full;const end='-'+digest(agentSlug).slice(0,8)+'-'+format;return agentSlug.slice(0,63-end.length).replace(/-+$/,'')+end;}
