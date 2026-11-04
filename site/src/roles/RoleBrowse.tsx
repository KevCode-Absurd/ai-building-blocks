import {useMemo,useState} from 'react';
import {Link,navigate} from '../lib/router';
import {flows,useStore} from '../lib/store';
import type {RoleCard,RoleIndex} from './role-types';
import {isStrongRoleMatch,rankRoles} from './specialist-matching.mjs';
import './roles.css';
const PAGE=24;
export default function RoleBrowse({data,page=1,complete=true,onNeedFull}:{data:RoleIndex|null;page?:number;complete?:boolean;onNeedFull?:()=>void}){
 const [query,setQuery]=useState(''),[area,setArea]=useState('all'),[count,setCount]=useState(PAGE);
 const allFlows=useStore(s=>s.flows);
 const saved=useMemo(()=>allFlows.filter(f=>f.customSkills?.some(skill=>skill.slug.startsWith('custom-role-'))),[allFlows]);
 const pendingSearch=!complete&&!!(query.trim()||area!=='all');
 // One ranking for this box and find_specialist (specialist-matching.mjs): best fit first, owners' words understood.
 const {rows,strong}=useMemo(()=>{
  if(pendingSearch||!data)return {rows:[] as RoleCard[],strong:0};
  const inArea=(r:RoleCard)=>area==='all'||r.area===area;
  if(!query.trim())return {rows:data.roles.filter(inArea),strong:0};
  const ranked=(rankRoles(data,query,area) as {role:RoleCard;matched:string[]}[]).filter(row=>inArea(row.role));
  return {rows:ranked.map(row=>row.role),strong:ranked.filter(row=>isStrongRoleMatch(row,query)).length};
 },[data,query,area,pendingSearch]);
 const suggestions=useMemo(()=>(data?.roles??[]).filter(r=>r.featured).slice(0,6),[data]);
 if(!data)return <section className="wrap role-pending"><p role="status">Opening the role library…</p></section>;
 const offset=query.trim()||area!=='all'?0:(page-1)*PAGE;
 const paintCount=complete?count:Math.min(count,PAGE);
 const reset=()=>{setQuery('');setArea('all');setCount(PAGE);};
 return <div className="wrap role-browser">
  {saved.length>0&&<section className="role-saved" aria-label="Your saved role setups"><h2>Your roles</h2><div className="role-saved-list">{saved.slice(0,6).map(f=><button className="btn btn-line" key={f.id} onClick={()=>{const old=flows.draft();if(old&&old.id!==f.id&&(old.nodes.length||old.goal))flows.save(old);flows.open(f.id);navigate('/#build');}}>{f.name}<span aria-hidden="true"> ↗</span></button>)}</div><Link to="/account">View all saved work</Link></section>}
  <section aria-label="Find an AI role"><div className="role-search-row"><div><label htmlFor="role-search">Find the specialist you need</label><input id="role-search" type="search" value={query} placeholder="Try coding, SEO, executive assistant or support" onFocus={()=>onNeedFull?.()} onChange={e=>{setQuery(e.currentTarget.value);setCount(PAGE);onNeedFull?.();}} data-testid="role-search"/></div></div>
   <div className="role-areas" role="group" aria-label="Filter roles by area">{data.areas.map(a=><button key={a.id} className="role-area" aria-pressed={area===a.id} onClick={()=>{setArea(a.id);setCount(PAGE);onNeedFull?.();}}>{a.name}</button>)}</div>
   <div className="role-results-meta"><p className="small" role="status">{pendingSearch?'Searching all specialists…':<>{rows.length.toLocaleString('en-US')} {rows.length===1?'specialist':'specialists'}{area!=='all'?` in ${data.areas.find(a=>a.id===area)?.name}`:''}{query.trim()&&rows.length?`, best fit first${strong&&strong<rows.length?`. ${strong} match every word`:''}`:''}</>}</p>{(query||area!=='all')&&<button className="link-btn" onClick={reset}>Clear search and filters</button>}</div>
   <ul className="role-grid" data-testid="role-grid">{rows.slice(offset,offset+paintCount).map(r=><li className="role-card" key={r.id} data-testid="role-card"><div className="role-card-top"><span className="mono small">{data.areas.find(a=>a.id===r.area)?.name}</span></div><h2><Link to={`/roles/${r.id}`}>{r.name}</Link></h2><p className="role-card-summary">{r.summary}</p><ul className="role-card-deliverables">{r.deliverables.slice(0,2).map(d=><li key={d}>{d}</li>)}</ul><div className="role-card-foot"><span className="small">Uses {r.resourceCount} tested {r.resourceCount===1?'method':'methods'}</span><Link to={`/roles/${r.id}`} className="role-card-link" aria-label={`Hire this specialist: ${r.name}`}>Hire this specialist <span aria-hidden="true">→</span></Link></div></li>)}</ul>
   {!rows.length&&!pendingSearch&&<div className="role-empty"><p>No specialists match that search. Try a shorter job title or clear the filters.</p>{suggestions.length>0&&<><p>Or start with one of these:</p><ul data-testid="role-suggestions">{suggestions.map(r=><li key={r.id}><Link to={`/roles/${r.id}`}>{r.name}</Link>: {r.summary}</li>)}</ul></>}</div>}
   {rows.length>offset+count&&<div className="role-more"><p className="small">Showing {Math.min(paintCount,rows.length-offset)} of {rows.length}{offset?` · starting at role ${offset+1}`:''}</p><button className="btn btn-line" disabled={!complete&&count>PAGE} onClick={()=>{setCount(n=>n+PAGE);onNeedFull?.();}} data-testid="roles-more">{!complete&&count>PAGE?'Opening more specialists…':<>Show {Math.min(PAGE,rows.length-offset-count)} more specialists</>}</button></div>}
  </section>
  <section className="role-how"><h2>From a job title to work you can use</h2><ol><li><b>Choose the specialist.</b><p>Read its methods, deliverables and limits.</p></li><li><b>Download the base pack.</b><p>Take its setup and complete methods to your AI.</p></li><li><b>Give it the job there.</b><p>Your AI asks the missing questions, uses your context and checks the work.</p></li></ol><p className="small">Roles prepare work for your AI to carry out. Each run reports the files made, checks performed and gaps that need attention.</p></section>
 </div>;
}
