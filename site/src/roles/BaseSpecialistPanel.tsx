import {useEffect,useRef,useState} from 'react';
import type {RoleView} from './role-types';
import {baseSpecialistPrompt} from './base-specialist.mjs';
import {specialistMessage} from './base-specialist-message.mjs';
import {getBusiness,hasBusiness,meFor,useBusiness} from '../lib/business';
import {openBusiness} from '../Business';
import {copyText} from '../lib/copy-text';

const SKILL=/^\/skills\/[a-z0-9][a-z0-9-]*\/SKILL\.md$/;
const count=(n:number)=>n.toLocaleString('en-US');
type Built=ReturnType<typeof specialistMessage>;

/** The primary method's full text, read from the published library. null when it can't load: the message still works. */
async function fetchMethod(role:RoleView):Promise<string|null>{
 const lead=role.resources.find(r=>r.slug===role.lead);
 const path=lead?.skillPath&&SKILL.test(lead.skillPath)?lead.skillPath:`/skills/${role.lead}/SKILL.md`;
 if(!SKILL.test(path))return null;
 try{const r=await fetch(path);if(!r.ok)return null;const t=(await r.text()).replace(/\r\n?/g,'\n');return t.trimStart().startsWith('<')?null:t;}catch{return null;}
}

export default function BaseSpecialistPanel({role,toast}:{role:RoleView;toast:(s:string)=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[copied,setCopied]=useState<Built|null>(null),[preview,setPreview]=useState<Built|null>(null);
 const alive=useRef(true),method=useRef<Promise<string|null>|null>(null);
 const business=useBusiness(),hasBrand=hasBusiness(business);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
 const lead=role.resources.find(r=>r.slug===role.lead);
 // The brand file is read at click time, in this browser only. The published pack and the server copy stay generic.
 const brandFile=()=>meFor(getBusiness(),lead?[{slug:lead.slug,name:lead.name,task:lead.task}]:[]);
 const loadMethod=()=>method.current??=fetchMethod(role);
 const build=async()=>specialistMessage(role,{method:await loadMethod(),brandFile:brandFile()});
 async function copyMessage(){
  setError('');setCopied(null);
  const pending=build();
  try{await copyText(pending.then(b=>b.text));const built=await pending;if(!alive.current)return;setCopied(built);setPreview(built);toast('Message copied. Paste it into ChatGPT, Claude or Gemini.');}
  catch{if(!alive.current)return;setError('Copy did not work. Open "Read the message before you copy" and copy it by hand.');void pending.then(b=>{if(alive.current)setPreview(b);}).catch(()=>{});}
 }
 async function download(){
  setBusy(true);setError('');
  try{
   const [{loadBaseSpecialistPack},{download}]=await Promise.all([import('./base-specialist-pack.ts'),import('../lib/download')]);
   const result=await loadBaseSpecialistPack(role);if(!alive.current)return;
   download(new Blob([result.bytes as BlobPart],{type:'application/zip'}),result.filename);
   toast('Full pack downloaded. Extract it and start with START_HERE.md in your coding tool.');
  }catch(e){if(alive.current)setError(e instanceof Error?e.message:'The complete pack could not load. Try again.');}
  finally{if(alive.current)setBusy(false);}
 }
 const packPrompt=()=>{const about=brandFile();return about?`${baseSpecialistPrompt(role)}\n\n---\n\n${about}`:baseSpecialistPrompt(role);};
 async function copyPackPrompt(){try{await navigator.clipboard.writeText(packPrompt());toast('Setup prompt copied. Paste it into your AI with the pack or connected AI Blocks MCP.');}catch{setError('Copy is unavailable. Expand the setup prompt below and copy it manually.');}}
 return <section className="role-form base-specialist" aria-label="Take this specialist to your AI" data-testid="base-specialist">
  <h2>Use this specialist in your AI</h2>
  <p>Copy one message and paste it into ChatGPT, Claude or Gemini. It tells your AI how to start, what to ask you and the method to follow{hasBrand?', with your brand file':''}.</p>
  <div className="role-form-actions"><button className="btn btn-primary" onClick={()=>void copyMessage()} onPointerEnter={()=>void loadMethod()} onFocus={()=>void loadMethod()} data-testid="base-specialist-message">Copy as one message</button><button className="btn btn-line" disabled={busy} onClick={()=>void download()} data-testid="base-specialist-download">{busy?'Downloading the full pack…':'Download full pack (zip)'}</button></div>
  {copied&&<p className="small" role="status" data-testid="base-specialist-copied">{copied.fits?`Copied ${count(copied.chars)} characters. Paste it as your first message.`:`Copied ${count(copied.chars)} characters. That is longer than some chats take at once. If yours cuts it off, shorten your me.md or use the full pack.`}{copied.shortened?' The full method is longer than one message, so this has a shorter version and a link to the rest.':''}</p>}
  <p className="small" data-testid="base-specialist-brand">{hasBrand?<>Your brand file is added when you copy. <button type="button" className="link-btn" onClick={openBusiness}>Edit</button></>:<><button type="button" className="link-btn" onClick={openBusiness}>Add your brand file</button> so the message fits your business. It takes 5 quick questions.</>}</p>
  <p className="small">The zip is for coding tools like Claude Code, Codex or Cursor. It has the setup, intake, handoff and every method with its references and licences.</p>
  <details onToggle={e=>{if(e.currentTarget.open)void build().then(b=>{if(alive.current)setPreview(b);});}}><summary>Read the message before you copy</summary>{preview?<pre className="role-preview" tabIndex={0} data-testid="base-specialist-message-preview">{preview.text}</pre>:<p role="status" className="small">Preparing the message…</p>}</details>
  <details><summary>Use with the pack, MCP or API</summary>
   <ol><li>Extract the pack and give your AI access to the folder.</li><li>Ask it to read <code>START_HERE.md</code>, or paste the setup prompt.</li><li>Answer only the missing task questions and start the work there.</li></ol>
   <p><button className="btn btn-line btn-sm" onClick={()=>void copyPackPrompt()} data-testid="base-specialist-copy">Copy setup prompt for the pack</button></p>
   <p>Ask your connected AI to load this specialist:</p><pre>{`prepare_specialist({"role_id":"${role.id}"})`}</pre><p>Your AI handles the task questions. To find a specialist from a task, use <code>find_specialist</code>, review its suggestions and accept the specialist or team.</p><p>Complete pack endpoint:</p><code>{`GET /api/v1/specialists/${role.id}/pack`}</code>
   <details><summary>Read the setup prompt</summary><pre className="role-preview" data-testid="base-specialist-prompt">{baseSpecialistPrompt(role)}</pre></details>
  </details>
  {error&&<p role="alert">{error}</p>}
 </section>;
}
