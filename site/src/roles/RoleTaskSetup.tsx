import {TASK_DELIVERABLE} from './specialist-worker.mjs';
import {useEffect,useLayoutEffect,useMemo,useRef,useState,useSyncExternalStore} from 'react';
import {Link,navigate} from '../lib/router';
import {flows,uid,type Flow} from '../lib/store';
import {library} from '../lib/library-storage';
import {meFor,orderByProfile,useBusiness} from '../lib/business';
import {SaveHint} from '../AccountPersistence';
import type {RoleProfile,RoleView} from './role-types';
import {loadFullRole} from './role-profile';
import {roleLaunchPrompt,validateRoleBrief,type RoleBrief} from './role-runtime';
import {seedRolePlanner} from './role-transfer';
import './roles.css';
type Draft={goal:string;context:string;tools:string;training:string;requested:string;deliverables:string[];resources:string[];useMe:boolean};
const defaults=(r:RoleProfile):Draft=>({goal:'',context:'',tools:'',training:'',requested:'',deliverables:[],resources:r.resources.map(x=>x.slug),useMe:true});
const draftKey=(id:string,owner:string)=>`abb:role-draft:${owner}:${id}`;
function readDraft(role:RoleProfile,owner:string):Draft{
 try{const d=JSON.parse(sessionStorage.getItem(draftKey(role.id,owner))??'null');if(d&&typeof d.goal==='string'&&d.goal.length<=3000&&typeof d.context==='string'&&d.context.length<=8000&&typeof d.tools==='string'&&d.tools.length<=2000&&Array.isArray(d.deliverables)&&Array.isArray(d.resources))return {goal:d.goal,context:d.context,tools:d.tools,requested:typeof d.requested==='string'&&d.requested.length<=3000?d.requested:'',training:typeof d.training==='string'&&d.training.length<=6000?d.training:'',useMe:d.useMe===true,deliverables:d.deliverables.filter((v:string)=>role.deliverables.includes(v)),resources:[...new Set([role.lead,...role.resources.filter(r=>r.bundled||r.onboarding).map(r=>r.slug),...d.resources.filter((id:string)=>id!==role.lead&&role.resources.some(r=>r.slug===id))])]};}catch{}return defaults(role);
}
function RoleForm({role,owner,toast}:{role:RoleProfile;owner:string;toast:(text:string)=>void}){
 const [draft,setDraft]=useState(()=>readDraft(role,owner)),[step,setStep]=useState(1),[error,setError]=useState(''),[busy,setBusy]=useState(''),[saved,setSaved]=useState<Flow|null>(null),[preview,setPreview]=useState(false);
 const business=useBusiness();
 const heading=useRef<HTMLHeadingElement>(null),alive=useRef(true),flowId=useRef(uid());
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 useLayoutEffect(()=>{try{sessionStorage.setItem(draftKey(role.id,owner),JSON.stringify(draft));}catch{}},[draft,role.id,owner]);
 const update=(change:Partial<Draft>)=>{setDraft(d=>({...d,...change}));setError('');setSaved(null);};
 const selected=role.resources.filter(r=>draft.resources.includes(r.slug));
 const context=useMemo(()=>draft.useMe?meFor(business,selected).trim():'',[draft.useMe,draft.resources,role,business]);
 // Methods you can add are ordered by your brand file (a local business sees local-service methods first).
 const fixed=(r:RoleProfile['resources'][number])=>r.slug===role.lead||!!r.bundled||!!r.onboarding;
 const methodOrder=useMemo(()=>[...role.resources.filter(fixed),...orderByProfile(role.resources.filter(r=>!fixed(r)),r=>`${r.name} ${r.summary} ${r.task??''}`,business)],[role,business]);
 const requested=[...new Set([...draft.requested.split('\n').map(s=>s.trim()).filter(Boolean),...draft.deliverables])];
 const brief:RoleBrief={goal:draft.goal,context:draft.context,tools:draft.tools,deliverables:requested.length?requested:[TASK_DELIVERABLE],resources:draft.resources,me:context,training:draft.training};
 const next=()=>{if(step===1&&!draft.goal.trim()){setError('Describe the task you need done.');return;}setError('');setStep(n=>Math.min(3,n+1));requestAnimationFrame(()=>heading.current?.focus());};
 const goBack=()=>{setError('');setStep(n=>Math.max(1,n-1));requestAnimationFrame(()=>heading.current?.focus());};
 async function work(action:'save'|'download'|'copy'|'planner'|'open'){
  setBusy(action);setError('');
  try{
   validateRoleBrief(role,brief);
   if(context.length>8000)throw Error('The relevant part of your saved brand file is over 8,000 characters. Use task notes or shorten your brand file before continuing.');
   if(action==='copy'){await navigator.clipboard.writeText(roleLaunchPrompt(role,brief));if(alive.current)toast('Role brief copied. Attach the full pack or let your AI retrieve the methods.');return;}
   if(action==='planner'){
    const notes=[`Role: ${role.name}. Source: https://useaiblocks.com/roles/${role.id}`,`Expected deliverables:\n${brief.deliverables.map(d=>'- '+d).join('\n')}`,`Use the relevant methods after reading them in full:\n${selected.map(r=>`${r.name}: ${r.slug}`).join('\n')}`,`Task context:\n${draft.context}`,`Available tools and access:\n${draft.tools}`,`Training and preferences:\n${draft.training}`].join('\n\n');
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
  {step===1&&<div className="role-setup-step"><p className="small">Have a brand file, brief or asset folder? Add it in the next step. Your AI checks the context first and builds missing brand information before brand-dependent work.</p><div className="role-field"><label htmlFor="role-goal">The job you need done</label><textarea id="role-goal" rows={4} value={draft.goal} maxLength={3000} onChange={e=>update({goal:e.currentTarget.value})} placeholder={`Tell your ${role.name.toLowerCase()} what to work on.`} data-testid="role-goal"/><span className="small">{draft.goal.length.toLocaleString()} / 3,000 characters</span></div>
   {role.example&&<div className="role-example"><p>{role.example}</p><button className="link-btn" onClick={()=>update({goal:role.example})}>Use this starting brief</button></div>}
   <div className="role-field"><label htmlFor="role-deliverables">What you want back (optional)</label><textarea id="role-deliverables" rows={3} value={draft.requested} maxLength={3000} onChange={e=>update({requested:e.currentTarget.value})} placeholder="One deliverable per line. Name the files, formats or live result you need." data-testid="role-deliverables"/><p className="small">The specialist checks coverage against your task. Unsupported work stays clear; it does not invent a finished result.</p></div><details><summary>Choose examples from the primary method (optional)</summary><fieldset><legend>Primary method outputs</legend><div className="role-choices">{role.deliverables.map(d=><label className="role-check" key={d}><input type="checkbox" checked={draft.deliverables.includes(d)} onChange={e=>update({deliverables:e.currentTarget.checked?[...draft.deliverables,d]:draft.deliverables.filter(v=>v!==d)})}/><span>{d}</span></label>)}</div></fieldset></details>
   <p className="small">The role keeps each active method's required steps and checks. Your choices set the final deliverables to emphasize.</p>
  </div>}
  {step===2&&<div className="role-setup-step"><div className="role-field"><label htmlFor="role-context">Brand file, files and context</label><textarea id="role-context" rows={5} value={draft.context} maxLength={8000} onChange={e=>update({context:e.currentTarget.value})} placeholder="Link your brand file or brief, asset folder, website and relevant ad-library or reference pages. If none exists, ask the specialist to build the missing context. Add the facts, limits and definition of done." data-testid="role-context"/></div>
   <div className="role-field"><label htmlFor="role-tools">Tools and access already available</label><textarea id="role-tools" rows={3} maxLength={2000} value={draft.tools} onChange={e=>update({tools:e.currentTarget.value})} placeholder="For example: project folder, browser, analytics export or a connected helpdesk. Keep passwords and keys out of this form." data-testid="role-tools"/></div>
   <div className="role-field"><label htmlFor="role-training">Train it for your way of working</label><textarea id="role-training" rows={4} maxLength={6000} value={draft.training} onChange={e=>update({training:e.currentTarget.value})} placeholder="Your preferred format, brand voice, templates, examples of good work and corrections to remember in this project." data-testid="role-training"/><p className="small">Included in editable TRAINING.md. This is working guidance, not model fine-tuning or automatic memory.</p></div><label className="role-check"><input type="checkbox" checked={draft.useMe} onChange={e=>update({useMe:e.currentTarget.checked})}/><span>Use relevant parts of my saved brand file</span></label><p className="small">{context?'The matching saved context is included in the review below.':'Add the files and facts your AI should use. It will check the current conversation first.'}</p>
   <details><summary>Choose its library methods ({selected.length})</summary><div className="role-choices">{methodOrder.map(r=><label key={r.slug} className="role-check role-resource-choice"><input type="checkbox" checked={draft.resources.includes(r.slug)} disabled={r.slug===role.lead||r.bundled||r.onboarding} onChange={e=>update({resources:e.currentTarget.checked?[...draft.resources,r.slug]:draft.resources.filter(s=>s!==r.slug)})}/><span>{r.name}{r.slug===role.lead?' · primary method':r.onboarding?' · context setup when needed':r.reviewer?' · second-opinion lens':r.support?' · support method':r.bundled?' · included with the primary method':''}<small>{r.summary}</small></span></label>)}</div></details>
  </div>}
  {step===3&&<div className="role-setup-step"><p>Your setup includes the role prompt, {selected.length} selected {selected.length===1?'method':'methods'}, their full files and your task context.</p><ul className="role-review-list">{brief.deliverables.map(d=><li key={d}>{d}</li>)}</ul>
   <details open={preview} onToggle={e=>setPreview(e.currentTarget.open)}><summary>Review the complete launch brief</summary><pre className="role-preview" tabIndex={0} data-testid="role-prompt-preview">{prompt}</pre></details>
   <p className="role-setup-help">Download the specialist, unzip it and add all the files to your AI. Then say: <b>Read START_HERE.txt and follow HANDOFF.md</b>. Your AI checks access, does the work and gives you real files and checks.</p>
   <div className="role-form-actions"><button className="btn btn-primary" disabled={!!busy} onClick={()=>void work('download')} data-testid="role-download">{busy==='download'?'Preparing the download…':'Download specialist'}</button><button className="btn btn-line" disabled={!!busy} onClick={()=>void work('copy')} data-testid="role-copy">Copy launch brief</button></div>
   <div className="role-form-actions"><button className="btn btn-line" disabled={!!busy} onClick={()=>void work('save')} data-testid="role-save">{saved?'Setup saved':'Save this role'}</button><button className="btn btn-line" disabled={!!busy} onClick={()=>void work('open')} data-testid="role-open-builder">Open in builder</button><button className="btn btn-line" disabled={!!busy} onClick={()=>void work('planner')} data-testid="role-ai-planner">Tailor with AI</button></div>
   {saved&&<div className="role-status" role="status"><p>Saved with your workflows. Reopen it from <Link to="/account">My saved work</Link> or the roles page.</p><SaveHint subject="role setup"/></div>}
   <p className="small">Prepared setup. Work begins when you ask your AI to run it.</p>
  </div>}
  {error&&<p role="alert" className="role-validation-error" data-testid="role-error">{error}</p>}
  {step<3&&<div className="role-form-actions">{step>1&&<button className="btn btn-line" onClick={goBack}>Back</button>}<button className="btn btn-primary" onClick={next}>{step===1?'Add context':'Review your role'}</button></div>}
  {step===3&&<button className="link-btn" onClick={goBack} disabled={!!busy}>Edit context and methods</button>}
 </section>;
}

export default function RoleTaskSetup({role,toast}:{role:RoleView;toast:(text:string)=>void}){
 const owner=useSyncExternalStore(library.subscribe,()=>library.snapshot().user??'guest');
 const [full,setFull]=useState<RoleProfile|null>(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let live=true;setError('');void loadFullRole(role).then(value=>{if(live)setFull(value);}).catch(e=>{if(live)setError(e instanceof Error?e.message:'Task setup could not load.');});return()=>{live=false;};},[role.id,role.sourceHash,attempt]);
 if(error)return <section className="role-form"><p role="alert">{error}</p><button className="btn btn-line" onClick={()=>setAttempt(a=>a+1)}>Retry task setup</button></section>;
 if(!full)return <section className="role-form"><p role="status">Opening task setup…</p></section>;
 return <RoleForm key={role.id+':'+owner} role={full} owner={owner} toast={toast}/>;
}
