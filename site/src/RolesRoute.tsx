import {lazy,Suspense} from 'react';
import {Link} from './lib/router';
import {StartupReady} from './StartupReady';
import {roleOpeningTitle,useRoleData} from './roles/role-data';
import type {RoleIndex,RoleProfile} from './roles/role-types';
import './roles-opening.css';
const Browse=lazy(()=>import('./roles/RoleBrowse'));
const Detail=lazy(()=>import('./roles/RoleDetail'));
export default function RolesRoute({path,toast}:{path:string;toast:(text:string)=>void}){
 const page=path.match(/^\/roles\/page\/([1-9]\d*)$/)?.[1];
 const id=path==='/roles'||page?null:path.split('/')[2],{data,error,retry,requestFull}=useRoleData(id,Number(page??1));
 const valid=path==='/roles'||!!page||/^\/roles\/[a-z0-9][a-z0-9-]{0,69}$/.test(path);
 return <main className="roles-page" data-testid="roles-page"><StartupReady/>
  <header className="wrap role-opening">
   {id?<Link to="/roles" className="small role-back">← All AI roles</Link>:<span className="mono small">CHOOSE A ROLE. GIVE IT A JOB.</span>}
   <h1 id="role-heading">{roleOpeningTitle(path,id)}</h1>
   <p className="role-opening-copy">{id?'Set the task, choose your deliverables and take the complete work pack to your AI.':'Coding, design, support and the work in between. Set up an AI specialist with real methods, clear deliverables and checks.'}</p>
  </header>
  {error&&data&&<div className="wrap"><p role="alert">{error}</p><button className="btn btn-line" onClick={retry}>Try again</button></div>}
  {!valid||error&&!data?<section className="wrap role-pending"><p role="alert">{valid?error:'This role could not be found.'}</p>{valid&&<button className="btn btn-line" onClick={retry}>Try again</button>} <Link to="/roles">Browse all roles</Link></section>:
   <Suspense fallback={<section className="wrap role-pending"><p role="status">Opening the role library…</p></section>}>
    {id?<Detail key={id} role={data?.schema==='ai-blocks-role/1'?data as RoleProfile:null} toast={toast}/>:<Browse key={page??'1'} page={Number(page??1)} data={data?.schema==='ai-blocks-roles/1'?data as RoleIndex:null} complete={data?.schema==='ai-blocks-roles/1'&&!data.starter} onNeedFull={requestFull}/>}
   </Suspense>}
 </main>;
}
