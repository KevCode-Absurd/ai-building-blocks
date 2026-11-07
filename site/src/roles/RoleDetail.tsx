import {lazy,Suspense,useState,useSyncExternalStore} from 'react';
import {library} from '../lib/library-storage';
import WorkerGuide from './WorkerGuide';
import RoleExpertise from './RoleExpertise';
import BaseSpecialistPanel from './BaseSpecialistPanel';
import {Link} from '../lib/router';
import {roleOpening} from './role-copy.mjs';
import type {RoleView} from './role-types';
import './roles.css';
const TaskSetup=lazy(()=>import('./RoleTaskSetup'));
function TaskContext({role,toast,owner}:{role:RoleView;toast:(text:string)=>void;owner:string}){
 const key='abb:role-context-open:'+owner+':'+role.id;
 const [open,setOpen]=useState(()=>{try{return sessionStorage.getItem(key)==='true';}catch{return false;}}),[loaded,setLoaded]=useState(open);
 return <details className="role-context-option" open={open} onToggle={e=>{const next=e.currentTarget.open;setOpen(next);if(next)setLoaded(true);try{sessionStorage.setItem(key,String(next));}catch{}}}><summary>Add task context before downloading (optional)</summary>{loaded&&<Suspense fallback={<section className="role-form"><p role="status">Opening task setup…</p></section>}><TaskSetup role={role} toast={toast}/></Suspense>}</details>;
}
// The top of the page says what you give, what you get and shows an example, in plain words. Capabilities, methods,
// the pack's files and the API sit under Details, the same as on skill pages.
export default function RoleDetail({role,toast}:{role:RoleView|null;toast:(text:string)=>void}){
 const owner=useSyncExternalStore(library.subscribe,()=>library.snapshot().user??'guest');
 if(!role)return <section className="wrap role-pending"><p role="status">Opening this role…</p></section>;
 const o=roleOpening(role),hub=!!role.family?.id&&role.family.id!=='other';
 return <div className="wrap role-profile-grid"><div className="role-profile" data-testid="role-profile">
  <p className="small"><Link to="/councils">Use with a team →</Link></p>
  <section className="role-profile-section role-start" data-testid="role-opening"><p className="role-summary">{o.summary}</p>
   <div className="role-give-get"><div><h2>What you give</h2><ul>{o.give.map(d=><li key={d}>{d}</li>)}</ul></div><div><h2>What you get</h2><ul>{o.get.map(d=><li key={d}>{d}</li>)}</ul></div></div></section>
  {o.example&&<section className="role-profile-section" data-testid="role-short-example"><h2>An example</h2>{o.example.situation&&<p>{o.example.situation}</p>}<p>You ask: “{o.example.task}”</p>{o.example.outputs.length>0&&<><p>You get back:</p><dl className="role-capabilities">{o.example.outputs.map(x=><div key={x.name}><dt>{x.name}</dt><dd>{x.contains}</dd></div>)}</dl></>}<p className="small">An example, not your task.</p></section>}
  {o.terms.length>0&&<section className="role-profile-section role-terms" data-testid="role-terms"><h2>Words used here</h2><dl>{o.terms.map(t=><div key={t.term}><dt>{t.term}</dt><dd>{t.meaning}</dd></div>)}</dl></section>}
  {((role.related?.length??0)>0||hub)&&<section className="role-profile-section" data-testid="role-related"><h2>Related specialists</h2>{(role.related?.length??0)>0&&<ul>{role.related!.map(r=><li key={r.id}><Link to={`/roles/${r.id}`}>{r.name}</Link></li>)}</ul>}{hub&&<p><a href={`/jobs/${role.family.id}`}>Skills and workflows for this job: {role.family.name}</a></p>}</section>}
  <details className="role-details" data-testid="role-details"><summary><h2>Details</h2></summary>
   <div className="role-details-count"><span>{role.resourceCount} core {role.resourceCount===1?'method':'methods'}</span><span>Full sources included</span><span>Runs in your AI</span></div>
   <section className="role-profile-section"><h3>Everything it can hand back</h3><p className="small">Tell your AI which files and outcomes you need. The specialist chooses the methods that cover your job.</p><ul>{role.deliverables.map(d=><li key={d}>{d}</li>)}</ul></section>
   <RoleExpertise role={role}/><section className="role-profile-section"><h3>Capabilities</h3><dl className="role-capabilities">{role.capabilities.map((c,i)=><div key={i}><dt>{c.name}</dt><dd>{c.description}</dd></div>)}</dl></section>
   <section className="role-profile-section"><h3>Tasks you can use it for</h3><ul>{role.fit.map((task,i)=><li key={i}>{task}</li>)}</ul></section>
   <section className="role-profile-section"><h3>How the role works</h3><ol><li>Checks your task, supplied facts and available tools.</li><li>Picks the methods needed and sets a work plan.</li><li>Carries out the supported work, keeping each method's limits.</li><li>Checks the real deliverables and corrects supported faults.</li><li>Hands back the files, evidence and any unresolved gaps.</li></ol></section>
   <WorkerGuide role={role}/><section className="role-profile-section"><h3>Inputs and helpful context</h3><p>The specialist starts from your task. It needs the inputs of the methods it actually uses.</p><h4>For the primary method, when used</h4><ul>{role.inputs.map(d=><li key={d}>{d}</li>)}</ul>{role.helpfulInputs.length>0&&<><h4>Helpful context (optional)</h4><ul>{role.helpfulInputs.map(t=><li key={t}>{t}</li>)}</ul></>}{role.tools.length>0&&<><h4>Tools and access</h4><ul>{role.tools.map(t=><li key={t}>{t}</li>)}</ul></>}<p className="small">Your AI checks the tools each active method needs before using it. Optional connections stay optional.</p></section>
   <section className="role-profile-section"><h3>Functions and deliverables</h3><p className="small">Each method gives this role a function it can use for your task. It keeps the source's scope, instructions and credits.</p><ul className="role-methods">{role.resources.map(r=><li className="role-method" key={r.slug}><span className="role-method-kind">{r.kind}{r.slug===role.lead?' · primary method':r.onboarding?' · context setup when needed':r.reviewer?' · second-opinion lens':r.support?' · support method':r.bundled?' · included with the primary method':''}</span><h4><Link to={r.path}>{r.name} ↗</Link></h4><p>{r.summary}</p>{role.functions.find(f=>f.method===r.slug)?.deliverables.length?<details><summary>Deliverables from this function</summary><ul>{role.functions.find(f=>f.method===r.slug)!.deliverables.map((d,i)=><li key={i}>{d}</li>)}</ul></details>:null}{r.by&&<span className="small">{r.by}{r.license?` · ${r.license}`:''}</span>}</li>)}</ul><Link to="/api-and-mcp">Give your AI access to the wider library</Link></section>
   <section className="role-profile-section"><h3>Best way to use this role</h3><p>Give it one clear outcome, your actual files and a definition of done. Keep the work in the same AI project so it can reuse the checked context and earlier files.</p>{role.method.length>0&&<details><summary>Primary method's usage guide</summary><ol>{role.method.map((m,i)=><li key={i}>{m}</li>)}</ol></details>}<ol><li>Describe the task and choose the deliverables you need.</li><li>Add the real source material, tool access and limits. Keep secrets out of task notes.</li><li>Review the launch brief, then give the complete pack to your AI.</li><li>Ask it to carry out the work and check the resulting files. Resolve required missing inputs and approvals as they arise.</li><li>Keep its files, check results and handoff together for the next task.</li></ol></section>
   <section className="role-profile-section"><details><summary>Limits to check before starting</summary><ul>{role.limits.map(d=><li key={d}>{d}</li>)}</ul></details><p className="small">This setup has not run your task. The final report must name checks that passed, failed or could not run.</p></section>
  </details>
 </div><div className="role-start-options"><BaseSpecialistPanel key={role.id} role={role} toast={toast}/><TaskContext key={role.id+':'+owner} role={role} owner={owner} toast={toast}/></div></div>;
}
