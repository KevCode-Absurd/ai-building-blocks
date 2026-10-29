import {useCallback,useEffect,useState} from 'react';
import type {RoleCard,RoleIndex,RoleProfile} from './role-types';
let index:RoleIndex|null=null;
const starters=new Map<number,RoleIndex>();
const profiles=new Map<string,RoleProfile>();
const cards=new Map<string,RoleCard>();
const pending=new Map<string,Promise<RoleIndex|RoleProfile>>();
const initialPath=location.pathname;
const initialHeading=document.querySelector('#role-heading')?.textContent??'';
export const roleOpeningTitle=(path:string,id:string|null)=>!id?'Hire an AI specialist':profiles.has(id)?`Set up your ${profiles.get(id)!.name.toLowerCase()}`:cards.has(id)?`Set up your ${cards.get(id)!.name.toLowerCase()}`:path===initialPath&&initialHeading?initialHeading:'Set up your AI specialist';
async function load(id:string|null,page=1,full=false):Promise<RoleIndex|RoleProfile>{
 if(id&&!/^[a-z0-9][a-z0-9-]{0,69}$/.test(id))throw Error('This role could not be found.');
 if(!id&&index)return index;if(!id&&!full&&starters.has(page))return starters.get(page)!;if(id&&profiles.has(id))return profiles.get(id)!;
 const key=id??(full?'search':`page:${page}`);if(pending.has(key))return pending.get(key)!;
 const request=(async()=>{
  const response=await fetch(id?`/data/roles/${id}.json`:full?'/data/roles-search.json':page===1?'/data/roles-starter.json':`/data/roles-pages/${page}.json`);
  if(!response.ok||!response.headers.get('content-type')?.includes('json'))throw Error(response.status===404?'This role could not be found.':'The role library could not load. Check your connection and try again.');
  const data=await response.json();
  if(id){if(data.schema!=='ai-blocks-role/1'||data.id!==id||!Array.isArray(data.resources)||!data.resources.some((r:{slug:string})=>r.slug===data.lead))throw Error('This role is incomplete. Reload the page and try again.');profiles.set(id,data);}
  else{if(data.schema!=='ai-blocks-roles/1'||!Array.isArray(data.roles)||!Array.isArray(data.areas))throw Error('The role list is incomplete. Reload the page and try again.');if(data.starter)starters.set(page,data);else index=data;for(const card of data.roles)cards.set(card.id,card);}
  return data;
 })().finally(()=>pending.delete(key));pending.set(key,request);return request;
}
export const prefetchRole=(id:string|null,page=1)=>{void load(id,page).catch(()=>{});};
export function useRoleData(id:string|null,page=1){
 const cached=()=>id?profiles.get(id)??null:index??starters.get(page)??null;
 const [data,setData]=useState<RoleIndex|RoleProfile|null>(cached),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 const requestFull=useCallback(async()=>{setError('');try{const value=await load(null,page,true);setData(value);}catch(e){setError(e instanceof Error?e.message:'The full role list could not load.');}},[page]);
 useEffect(()=>{let active=true;setError('');setData(cached());void load(id,page,attempt>0).then(d=>{if(active)setData(d);}).catch(e=>{if(active)setError(e instanceof Error?e.message:'The role could not load.');});return()=>{active=false;};},[id,page,attempt]);
 return {data,error,retry:()=>setAttempt(a=>a+1),requestFull};
}
