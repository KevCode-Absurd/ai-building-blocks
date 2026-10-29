import WorkerGuide from './WorkerGuide';
import {useEffect,useMemo,useRef,useState,useSyncExternalStore} from 'react';
import {Link,navigate} from '../lib/router';
import {flows,uid,type Flow} from '../lib/store';
import {library} from '../lib/library-storage';
import {meFor,useBusiness} from '../lib/business';
import {SaveHint} from '../AccountPersistence';
import type {RoleProfile} from './role-types';
import {roleLaunchPrompt,validateRoleBrief,type RoleBrief} from './role-runtime';
import {seedRolePlanner} from './role-transfer';
import './roles.css';
type Draft={goal:string;context:string;tools:string;training:string;deliverables:string[];resources:string[];useMe:boolean};
const defaults=(r:RoleProfile):Draft=>({goal:'',context:'',tools:'',training:'',deliverables:[...r.deliverables],resources:r.resources.map(x=>x.slug),useMe:true});
const draftKey=(id:string,owner:string)=>`abb:role-draft:${owner}:${id}`;
function readDraft(role:RoleProfile,owner:string):Draft{
 try{const d=JSON.parse(sessionStorage.getItem(draftKey(role.id,owner))??'null');if(d&&typeof d.goal==='string'&&d.goal.length<=3000&&typeof d.context==='string'&&d.context.length<=8000&&typeof d.tools==='string'&&d.tools.length<=2000&&Array.isArray(d.deliverables)&&Array.isArray(d.resources))return {goal:d.goal,context:d.context,tools:d.tools,training:typeof d.training==='string'&&d.training.length<=6000?d.training:'',useMe:d.useMe===true,deliverables:d.deliverables.filter((v:string)=>role.deliverables.includes(v)),resources:[...new Set([role.lead,...role.resources.filter(r=>r.bundled).map(r=>r.slug),...d.resources.filter((id:string)=>id!==role.lead&&role.resources.some(r=>r.slug===id))])]};}catch{}return defaults(role);
}
function RoleForm({role,owner,toast}:{role:RoleProfile;owner:string;toast:(text:string)=>void}){
 const [draft,setDraft]=useState(()=>readDraft(role,owner)),[step,setStep]=useState(1),[error,setError]=useState(''),[busy,setBusy]=useState(''),[saved,setSaved]=useState<Flow|null>(null),[preview,setPreview]=useState(false);
 const business=useBusiness();
 const heading=useRef<HTMLHeadingElement>(null),alive=useRef(true),flowId=useRef(uid());
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 useEffect(()=>{try{sessionStorage.setItem(draftKey(role.id,owner),JSON.stringify(draft));}catch{}},[draft,role.id,owner]);
 const update=(change:Partial<Draft>)=>{setDraft(d=>({...d,...change}));setError('');setSaved(null);};
 const selected=role.resources.filter(r=>draft.resources.includes(r.slug));
 const context=useMemo(()=>draft.useMe?meFor(business,selected).trim():'',[draft.useMe,draft.resources,role,business]);
 const brief:RoleBrief={goal:draft.goal,context:draft.context,tools:draft.tools,deliverables:draft.deliverables,resources:draft.resources,me:context,training:draft.training};
 const next=()=>{if(step===1&&(!draft.goal.trim()||!draft.deliverables.length)){setError('Describe the task and choose at least one deliverable.');return;}setError('');setStep(n=>Math.min(3,n+1));requestAnimationFrame(()=>heading.current?.focus());};
 const goBack=()=>{setError('');setStep(n=>Math.max(1,n-1));requestAnimationFrame(()=>heading.current?.focus());};
 async function work(action:'save'|'download'|'copy'|'planner'|'open'){
  setBusy(action);setError('');
  try{
   validateRoleBrief(role,brief);
   if(context.length>8000)throw Error('The relevant saved me.md is over 8,000 characters. Use task notes or shorten the saved context before continuing.');
   if(action==='copy'){await navigator.clipboard.writeText(roleLaunchPrompt(role,brief));if(alive.current)toast('Role brief copied. Attach the full pack or let your AI retrieve the methods.');return;}
   if(action==='planner'){
    const notes=[`Role: ${role.name}. Source: https://useaiblocks.com/roles/${role.id}`,`Expected deliverables:\n${draft.deliverables.map(d=>'- '+d).join('\n')}`,`Use the relevant methods after reading them in full:\n${selected.map(r=>`${r.name}: ${r.slug}`).join('\n')}`,`Task context:\n${draft.context}`,`Available tools and access:\n${draft.tools}`,`Training and preferences:\n${draft.training}`].join('\n\n');
    navigate(seedRolePlanner(draft.goal,notes,draft.useMe));return;
   }
   const [{loadCatalogue},{createRoleFlow}]=await Promise.all([import('../lib/data'),import('./role-runtime')]);
   const c=await loadCatalogue();if(!alive.current||library.snapshot().user!==(owner==='guest'?null:owner))return;
   const flow=saved??createRoleFlow(c,role,brief,flowId.current);
   if(action==='download'){
    const {buildHandoffZip}=await import('../lib/handoff');
    const result=await buildHandoffZip(c,flow,{}, {'README.md':`# ${role.name}\n\nThis role was prepared for the goal in workflow.json. No task has run. The role's complete source methods, references and licences are in skills/.\n\nRead START_HERE.txt, SOUL.md, PLAYBOOK.md, TRAINING.md and the role's own SKILL.md. Give the full folder to an AI with the needed tools. It should check available context, make a work plan, carry out supported tasks, check the real artifacts and hand back the files and evidence. Keep any missing access or required review clear.\n\nThe library methods are available to this role; they are not an invented fixed sequence. Additional methods can be found through the connected AI Blocks MCP service or the source pages.\n`});
    if('error'in result)throw Error(result.error);if(!alive.current)return;
    const {download}=await import('../lib/download');download(result.blob,result.filename);toast('Complete role pack downloaded. Start with START_HERE.txt.');return;
   }
   if(action==='open'){
    const old=flows.draft();if(old&&old.id!==flow.id&&(old.nodes.length||old.goal))flows.save(old);
    flows.save(flow);flows.open(flow.id);navigate('/#build');return;
   }
   flows.save(flow);setSaved(flow);toast('Role setup saved with your workflows.');
  }catch(e){if(alive.current)setError(e instanceof Error?e.message:'The role setup could not finish. Try again.');}finally{if(alive.current)setBusy('');}
 }
 let prompt='';if(preview)try{prompt=roleLaunchPrompt(role,brief);}catch{prompt='Describe the task and choose your deliverables to preview the brief.';}
 return <section className="role-form" aria-label="Set up this role" data-testid="role-setup">
  <ol className="role-stepper" aria-label="Setup progress">{['Task','Context','Use your role'].map((label,i)=><li key={label} aria-current={step===i+1?'step':undefined}><span>{i+1}</span>{label}</li>)}</ol>
  <h2 ref={heading} tabIndex={-1}>{step===1?'What should this role deliver?':step===2?'Give it the facts and tools':'Your role is ready to prepare'}</h2>
  {step===1&&<div className="role-setup-step"><div className="role-field"><label htmlFor="role-goal">The job you need done</label><textarea id="role-goal" rows={4} value={draft.goal} maxLength={3000} onChange={e=>update({goal:e.currentTarget.value})} placeholder={`Tell your ${role.name.toLowerCase()} what to work on.`} data-testid="role-goal"/><span className="small">{draft.goal.length.toLocaleString()} / 3,000 characters</span></div>
   {role.example&&<div className="role-example"><p>{role.example}</p><button className="link-btn" onClick={()=>update({goal:role.example})}>Use this starting brief</button></div>}
   <fieldset><legend>What you want back</legend><div className="role-choices">{role.deliverables.map(d=><label className="role-check" key={d}><input type="checkbox" checked={draft.deliverables.includes(d)} onChange={e=>update({deliverables:e.currentTarget.checked?[...draft.deliverables,d]:draft.deliverables.filter(v=>v!==d)})}/><span>{d}</span></label>)}</div></fieldset>
   <p className="small">The role keeps each active method's required steps and checks. Your choices set the final deliverables to emphasize.</p>
  </div>}
  {step===2&&<div className="role-setup-step"><div className="role-field"><label htmlFor="role-context">Facts, files, audience and limits</label><textarea id="role-context" rows={5} value={draft.context} maxLength={8000} onChange={e=>update({context:e.currentTarget.value})} placeholder="Name the files you will attach, the facts to use, the deadline and what a good result looks like." data-testid="role-context"/></div>
   <div className="role-field"><label htmlFor="role-tools">Tools and access already available</label><textarea id="role-tools" rows={3} maxLength={2000} value={draft.tools} onChange={e=>update({tools:e.currentTarget.value})} placeholder="For example: project folder, browser, analytics export or a connected helpdesk. Keep passwords and keys out of this form." data-testid="role-tools"/></div>
   <div className="role-field"><label htmlFor="role-training">Train it for your way of working</label><textarea id="role-training" rows={4} maxLength={6000} value={draft.training} onChange={e=>update({training:e.currentTarget.value})} placeholder="Your preferred format, brand voice, templates, examples of good work and corrections to remember in this project." data-testid="role-training"/><p className="small">Included in editable TRAINING.md. This is working guidance, not model fine-tuning or automatic memory.</p></div><label className="role-check"><input type="checkbox" checked={draft.useMe} onChange={e=>update({useMe:e.currentTarget.checked})}/><span>Use relevant parts of my saved me.md</span></label><p className="small">{context?'The matching saved context is included in the review below.':'Add the files and facts your AI should use. It will check the current conversation first.'}</p>
   <details><summary>Choose its library methods ({selected.length})</summary><div className="role-choices">{role.resources.map(r=><label key={r.slug} className="role-check role-resource-choice"><input type="checkbox" checked={draft.resources.includes(r.slug)} disabled={r.slug===role.lead||r.bundled} onChange={e=>update({resources:e.currentTarget.checked?[...draft.resources,r.slug]:draft.resources.filter(s=>s!==r.slug)})}/><span>{r.name}{r.slug===role.lead?' · primary method':r.bundled?' · included with the primary method':''}<small>{r.summary}</small></span></label>)}</div></details>
  </div>}
  {step===3&&<div className="role-setup-step"><p>Your setup includes the role prompt, {selected.length} selected {selected.length===1?'method':'methods'}, their full files and your task context.</p><ul className="role-review-list">{draft.deliverables.map(d=><li key={d}>{d}</li>)}</ul>
   <details open={preview} onToggle={e=>setPreview(e.currentTarget.open)}><summary>Review the complete launch brief</summary><pre className="role-preview" tabIndex={0} data-testid="role-prompt-preview">{prompt}</pre></details>
   <p className="role-setup-help">Download the pack and attach the full folder to your AI. The AI checks access, carries out the supported work and reports real files and checks. Use the AI planner to tailor a multi-step workflow with the site's existing AI credits.</p>
   <div className="role-form-actions"><button className="btn btn-primary" disabled={!!busy} onClick={()=>void work('download')} data-testid="role-download">{busy==='download'?'Building the complete pack…':'Download role pack'}</button><button className="btn btn-line" disabled={!!busy} onClick={()=>void work('copy')} data-testid="role-copy">Copy launch brief</button></div>
   <div className="role-form-actions"><button className="btn btn-line" disabled={!!busy} onClick={()=>void work('save')} data-testid="role-save">{saved?'Setup saved':'Save this role'}</button><button className="btn btn-line" disabled={!!busy} onClick={()=>void work('open')} data-testid="role-open-builder">Open in builder</button><button className="btn btn-line" disabled={!!busy} onClick={()=>void work('planner')} data-testid="role-ai-planner">Tailor with AI</button></div>
   {saved&&<div className="role-status" role="status"><p>Saved with your workflows. Reopen it from <Link to="/account">My saved work</Link> or the roles page.</p><SaveHint subject="role setup"/></div>}
   <p className="small">Prepared setup. Work begins when you ask your AI to run it.</p>
  </div>}
  {error&&<p role="alert" className="role-validation-error" data-testid="role-error">{error}</p>}
  {step<3&&<div className="role-form-actions">{step>1&&<button className="btn btn-line" onClick={goBack}>Back</button>}<button className="btn btn-primary" onClick={next}>{step===1?'Add context':'Review your role'}</button></div>}
  {step===3&&<button className="link-btn" onClick={goBack} disabled={!!busy}>Edit context and methods</button>}
 </section>;
}
export default function RoleDetail({role,toast}:{role:RoleProfile|null;toast:(text:string)=>void}){
 const owner=useSyncExternalStore(library.subscribe,()=>library.snapshot().user??'guest');
 if(!role)return <section className="wrap role-pending"><p role="status">Opening this role…</p></section>;
 return <div className="wrap role-profile-grid"><div className="role-profile" data-testid="role-profile">
  <div className="role-details-count"><span>{role.resourceCount} core {role.resourceCount===1?'method':'methods'}</span><span>Full sources included</span><span>Runs in your AI</span></div>
  <section className="role-profile-section"><h2>{role.name}</h2><p>{role.summary}</p><h3>What you get</h3><ul>{role.deliverables.map(d=><li key={d}>{d}</li>)}</ul></section>
  <section className="role-profile-section"><h2>Capabilities</h2><dl className="role-capabilities">{role.capabilities.map((c,i)=><div key={i}><dt>{c.name}</dt><dd>{c.description}</dd></div>)}</dl></section>
  <section className="role-profile-section"><h2>Tasks you can use it for</h2><ul>{role.fit.map((task,i)=><li key={i}>{task}</li>)}</ul></section>
  <section className="role-profile-section"><h2>How the role works</h2><ol><li>Checks your task, supplied facts and available tools.</li><li>Picks the methods needed and sets a work plan.</li><li>Carries out the supported work, keeping each method's limits.</li><li>Checks the real deliverables and corrects supported faults.</li><li>Hands back the files, evidence and any unresolved gaps.</li></ol></section>
  <WorkerGuide role={role}/><section className="role-profile-section"><h2>Have these ready</h2><ul>{role.inputs.map(d=><li key={d}>{d}</li>)}</ul>{role.helpfulInputs.length>0&&<><h3>Helpful context (optional)</h3><ul>{role.helpfulInputs.map(t=><li key={t}>{t}</li>)}</ul></>}{role.tools.length>0&&<><h3>Tools and access</h3><ul>{role.tools.map(t=><li key={t}>{t}</li>)}</ul></>}<p className="small">Your AI checks the tools each active method needs before using it. Optional connections stay optional.</p></section>
  <section className="role-profile-section"><h2>Functions and deliverables</h2><p className="small">Each method gives this role a function it can use for your task. It keeps the source's scope, instructions and credits.</p><ul className="role-methods">{role.resources.map(r=><li className="role-method" key={r.slug}><span className="role-method-kind">{r.kind}{r.slug===role.lead?' · primary method':r.bundled?' · included with the primary method':''}</span><h3><Link to={r.path}>{r.name} ↗</Link></h3><p>{r.summary}</p>{role.functions.find(f=>f.method===r.slug)?.deliverables.length?<details><summary>Deliverables from this function</summary><ul>{role.functions.find(f=>f.method===r.slug)!.deliverables.map((d,i)=><li key={i}>{d}</li>)}</ul></details>:null}{r.by&&<span className="small">{r.by}{r.license?` · ${r.license}`:''}</span>}</li>)}</ul><Link to="/api-and-mcp">Give your AI access to the wider library</Link></section>
  <section className="role-profile-section"><h2>Best way to use this role</h2><p>Give it one clear outcome, your actual files and a definition of done. Keep the work in the same AI project so it can reuse the checked context and earlier files.</p>{role.method.length>0&&<details><summary>Primary method's usage guide</summary><ol>{role.method.map((m,i)=><li key={i}>{m}</li>)}</ol></details>}<ol><li>Describe the task and choose the deliverables you need.</li><li>Add the real source material, tool access and limits. Keep secrets out of task notes.</li><li>Review the launch brief, then give the complete pack to your AI.</li><li>Ask it to carry out the work and check the resulting files. Resolve required missing inputs and approvals as they arise.</li><li>Keep its files, check results and handoff together for the next task.</li></ol></section>
  <section className="role-profile-section"><details><summary>Limits to check before starting</summary><ul>{role.limits.map(d=><li key={d}>{d}</li>)}</ul></details><p className="small">This setup has not run your task. The final report must name checks that passed, failed or could not run.</p></section>
 </div><RoleForm key={role.id+':'+owner} role={role} owner={owner} toast={toast}/></div>;
}
