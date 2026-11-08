import {useRef,useState} from 'react';
import {readRunEvidence} from './run-evidence';
import './run-evidence.css';

export default function RunEvidence(){
 const [record,setRecord]=useState<ReturnType<typeof readRunEvidence>|null>(null),[error,setError]=useState('');
 const serial=useRef(0);
 async function open(file?:File){
  const current=++serial.current;setError('');if(!file)return;
  try{if(file.size>240000)throw Error('Keep the job-state record under 240 KB.');const next=readRunEvidence(await file.text());if(current===serial.current)setRecord(next);}
  catch(reason){if(current===serial.current)setError(reason instanceof Error?reason.message:'The record could not be read.');}
 }
 return <section className="council-evidence" aria-labelledby="council-evidence-title" data-testid="council-evidence">
  <h2 id="council-evidence-title">See what your team actually reported.</h2>
  <p>Open the job-state JSON returned by your AI to inspect its sources, selected methods, alternatives and artifact checks. This view stays in this page; the file is not uploaded or saved.</p>
  <label className="council-field">Open execution record<input type="file" accept="application/json,.json" aria-label="Open execution record" onChange={event=>{const file=event.currentTarget.files?.[0];event.currentTarget.value='';void open(file);}}/></label>
  {error&&<p role="alert">{error} The previous record is retained.</p>}
  {record&&<div data-testid="council-run-record">
   <p className="council-standard-status">Host-reported record · execution and owner acceptance are not independently verified</p>
   <p><strong>Original request:</strong> {record.request}</p><p>Execution policy: {record.policy||'legacy / not reported'}{record.policy<2?' · source tracing and native preflight were not required by this older policy.':''}</p>
   <details open><summary>Context and selected methods ({record.context.length} sources, {record.methods.length} methods)</summary>
    {!record.context.length&&!record.methods.length&&<p>No source-use trace was reported.</p>}
    {record.context.map((source,index)=><article key={index}><h3>{source.id} · {source.status}</h3><p>{source.ref}</p><p>{source.observation}</p>{source.limitation&&<p>Limit: {source.limitation}</p>}</article>)}
    {record.methods.map((method,index)=><article key={index}><h3>{method.slug} · {method.status}</h3><p>{method.reason}</p><p>{method.observation}</p><p className="council-evidence-hash">Revision: {method.revision}</p><details><summary>Reported resource reads ({method.resources.length})</summary><ul>{method.resources.map((resource,i)=><li key={i}>{resource.path} · {resource.status}<br/><span className="council-evidence-hash">{resource.sha256}</span></li>)}</ul></details></article>)}
   </details>
   <details><summary>Alternatives and decision ({record.alternatives.length} routes)</summary><p>Chosen: {record.choice}. {record.reason}</p>{record.alternatives.map((route,index)=><article key={index}><h3>{route.id}</h3><p>Strength: {route.strength}</p><p>Tradeoff: {route.tradeoff}</p><p>Wins when: {route.wins_if}</p><p>Next test: {route.test}</p><ul>{route.criteria.map((criterion,i)=><li key={i}>{criterion.id} · {criterion.status}: {criterion.basis}</li>)}</ul></article>)}<p>Retained dissent: {record.dissent}</p></details>
   <details><summary>Artifacts and required checks ({record.artifacts.length})</summary>{record.artifacts.map((artifact,index)=><article key={index}><h3>{artifact.path}</h3><p className="council-evidence-hash">{artifact.sha256}</p><ul>{artifact.checks.map((check,i)=><li key={i}>{check.id} · {check.status}</li>)}</ul></article>)}</details>
   <details><summary>Original host tool declarations ({record.tools.length})</summary><p>These are the starting declarations, not current availability checks or tool execution receipts.</p><ul>{record.tools.map((tool,index)=><li key={index}>{tool.id} · {tool.available?'reported available':'unavailable'} · {tool.billing} · checked {tool.checked_at}</li>)}</ul></details>
   <button className="council-text-button" onClick={()=>{serial.current++;setRecord(null);setError('');}}>Clear execution record</button>
  </div>}
  <p><a href="/packs/native-delivery-toolkit.zip" download>Download the local artifact checker</a> to verify actual file hashes, decode images and exercise local page interactions. Build, brand and product review remain separate checks.</p>
 </section>;
}
