import {useMemo,useState} from 'react';
import {Link,navigate} from '../lib/router';
import {flows,useStore} from '../lib/store';
import type {RoleIndex} from './role-types';
import './roles.css';
const PAGE=24;
export default function RoleBrowse({data,page=1,complete=true,onNeedFull}:{data:RoleIndex|null;page?:number;complete?:boolean;onNeedFull?:()=>void}){
 const [query,setQuery]=useState(''),[area,setArea]=useState('all'),[family,setFamily]=useState('all'),[count,setCount]=useState(PAGE);
 const allFlows=useStore(s=>s.flows);
 const saved=useMemo(()=>allFlows.filter(f=>f.customSkills?.some(skill=>skill.slug.startsWith('custom-role-'))),[allFlows]);
 const pendingSearch=!complete&&!!(query.trim()||area!=='all'||family!=='all');
 const rows=useMemo(()=>{if(pendingSearch)return [];const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return data?.roles.filter(r=>(area==='all'||r.area===area)&&(family==='all'||r.family===family)&&terms.every(t=>`${r.name} ${r.summary} ${r.deliverables.join(' ')} ${r.keywords??''}`.toLowerCase().includes(t)))??[];},[data,query,area,family,pendingSearch]);
 const families=useMemo(()=>{const ids=new Set(data?.roles.filter(r=>area==='all'||r.area===area).map(r=>r.family));return (data?.families??[]).filter(f=>ids.has(f.id));},[data,area]);
 if(!data)return <section className="wrap role-pending"><p role="status">Opening the role library…</p></section>;
 const offset=query.trim()||area!=='all'||family!=='all'?0:(page-1)*PAGE;
 const paintCount=complete?count:Math.min(count,PAGE);
 const reset=()=>{setQuery('');setArea('all');setFamily('all');setCount(PAGE);};
 return <div className="wrap role-browser">
  {saved.length>0&&<section className="role-saved" aria-label="Your saved role setups"><h2>Your roles</h2><div className="role-saved-list">{saved.slice(0,6).map(f=><button className="btn btn-line" key={f.id} onClick={()=>{const old=flows.draft();if(old&&old.id!==f.id&&(old.nodes.length||old.goal))flows.save(old);flows.open(f.id);navigate('/#build');}}>{f.name}<span aria-hidden="true"> ↗</span></button>)}</div><Link to="/account">View all saved work</Link></section>}
  <section className="role-saved"><h2>Choose a specialist, or describe a task</h2><p>Download a base specialist and give it the job inside your AI. For a larger task, ask your AI to suggest a team, then accept or change the specialists.</p><Link to="/teams" className="btn btn-primary" data-testid="roles-team-entry">Plan my AI team</Link></section>
  <section aria-label="Find an AI role"><div className="role-search-row"><div><label htmlFor="role-search">Find the specialist you need</label><input id="role-search" type="search" value={query} placeholder="Try coding, SEO, executive assistant or support" onFocus={()=>onNeedFull?.()} onChange={e=>{setQuery(e.currentTarget.value);setCount(PAGE);onNeedFull?.();}} data-testid="role-search"/></div><span className="small role-total">{data.roles.length} role setups</span></div>
   <div className="role-areas" role="group" aria-label="Filter roles by area">{data.areas.map(a=><button key={a.id} className="role-area" aria-pressed={area===a.id} onClick={()=>{setArea(a.id);setFamily('all');setCount(PAGE);onNeedFull?.();}}>{a.name}</button>)}</div>
   {families.length>1&&<div className="role-family-filter"><label htmlFor="role-family">Kind of work</label><select id="role-family" value={family} onChange={e=>{setFamily(e.currentTarget.value);setCount(PAGE);onNeedFull?.();}} data-testid="role-family"><option value="all">All kinds of work</option>{families.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></div>}
   <div className="role-results-meta"><p className="small" role="status">{pendingSearch?'Searching all roles…':<>{rows.length} {rows.length===1?'role':'roles'}{area!=='all'?` in ${data.areas.find(a=>a.id===area)?.name}`:''}</>}</p>{(query||area!=='all'||family!=='all')&&<button className="link-btn" onClick={reset}>Clear search and filters</button>}</div>
   <ul className="role-grid" data-testid="role-grid">{rows.slice(offset,offset+paintCount).map(r=><li className="role-card" key={r.id} data-testid="role-card"><div className="role-card-top"><span className="role-mark" aria-hidden="true">{r.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}</span><span className="mono small">{data.areas.find(a=>a.id===r.area)?.name}</span></div><h2><Link to={`/roles/${r.id}`}>{r.name}</Link></h2><p className="role-card-summary">{r.summary}</p><ul className="role-card-deliverables">{r.deliverables.slice(0,2).map(d=><li key={d}>{d}</li>)}</ul><div className="role-card-foot"><span className="small">{r.resourceCount} {r.resourceCount===1?'core method':'core methods'} + your task brief</span><Link to={`/roles/${r.id}`} className="role-card-link" aria-label={`Set up role: ${r.name}`}>Set up role <span aria-hidden="true">↗</span></Link></div></li>)}</ul>
   {!rows.length&&!pendingSearch&&<p className="role-empty">No roles match that search. Try a shorter job title or clear the filters.</p>}
   {rows.length>offset+count&&<div className="role-more"><p className="small">Showing {Math.min(paintCount,rows.length-offset)} of {rows.length}{offset?` · starting at role ${offset+1}`:''}</p><button className="btn btn-line" disabled={!complete&&count>PAGE} onClick={()=>{setCount(n=>n+PAGE);onNeedFull?.();}} data-testid="roles-more">{!complete&&count>PAGE?'Opening more roles…':<>Show {Math.min(PAGE,rows.length-offset-count)} more roles</>}</button></div>}
   <nav className="hub-pages" aria-label="Role pages">{Array.from({length:Math.ceil(data.roles.length/PAGE)},(_,i)=>i===page-1?<b key={i} aria-current="page">Page {i+1}</b>:<Link key={i} to={i?`/roles/page/${i+1}`:'/roles'}>Page {i+1}</Link>)}</nav>
  </section>
  <section className="role-how"><h2>From a job title to work you can use</h2><ol><li><b>Choose the specialist.</b><p>Read its methods, deliverables and limits.</p></li><li><b>Download the base pack.</b><p>Take its setup and complete methods to your AI.</p></li><li><b>Give it the job there.</b><p>Your AI asks the missing questions, uses your context and checks the work.</p></li></ol><p className="small">Roles prepare work for your AI to carry out. Each run reports the files made, checks performed and gaps that need attention.</p></section>
 </div>;
}
