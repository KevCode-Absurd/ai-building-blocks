import {useEffect,useRef,useState} from 'react';
import type {RoleView} from './role-types';
import {baseSpecialistPrompt} from './base-specialist.mjs';

export default function BaseSpecialistPanel({role,toast}:{role:RoleView;toast:(s:string)=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');const alive=useRef(true);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 async function download(){
  setBusy(true);setError('');
  try{
   const [{loadBaseSpecialistPack},{download}]=await Promise.all([import('./base-specialist-pack.ts'),import('../lib/download')]);
   const result=await loadBaseSpecialistPack(role);if(!alive.current)return;
   download(new Blob([result.bytes as BlobPart],{type:'application/zip'}),result.filename);
   toast('Base specialist downloaded. Extract it and start with START_HERE.md in your AI.');
  }catch(e){if(alive.current)setError(e instanceof Error?e.message:'The complete pack could not load. Try again.');}
  finally{if(alive.current)setBusy(false);}
 }
 async function copy(){try{await navigator.clipboard.writeText(baseSpecialistPrompt(role));toast('Setup prompt copied. Paste it into your AI with the pack or connected AI Blocks MCP.');}catch{setError('Copy is unavailable. Expand the setup prompt below and copy it manually.');}}
 return <section className="role-form base-specialist" aria-label="Take this specialist to your AI" data-testid="base-specialist">
  <h2>Use this specialist in your AI</h2><p>Download the base specialist now. Tell it what you need done and add context inside your own AI.</p>
  <div className="role-form-actions"><button className="btn btn-primary" disabled={busy} onClick={()=>void download()} data-testid="base-specialist-download">{busy?'Downloading the complete pack…':'Download base specialist'}</button><button className="btn btn-line" disabled={busy} onClick={()=>void copy()} data-testid="base-specialist-copy">Copy to my AI</button></div>
  <p className="small">No task form or account needed. Includes README, setup, SOUL, intake, handoff, best practices and complete associated skill files, references and licences.</p>
  <ol><li>Extract the pack and give your AI access to the folder.</li><li>Ask it to read <code>START_HERE.md</code>.</li><li>Answer only the missing task questions and start the work there.</li></ol>
  <details><summary>Use through MCP or API</summary><p>Ask your connected AI to load this specialist:</p><pre>{`prepare_specialist({"role_id":"${role.id}"})`}</pre><p>Your AI handles the task questions. To find a specialist from a task, use <code>find_specialist</code>, review its suggestions and accept the specialist or team.</p><p>Complete pack endpoint:</p><code>{`GET /api/v1/specialists/${role.id}/pack`}</code></details>
  <details><summary>Read or copy the setup prompt</summary><pre className="role-preview" data-testid="base-specialist-prompt">{baseSpecialistPrompt(role)}</pre></details>
  {error&&<p role="alert">{error}</p>}
 </section>;
}
