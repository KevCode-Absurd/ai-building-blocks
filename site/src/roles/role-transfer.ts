import {library} from '../lib/library-storage';
import {LIMITS} from '../lib/composer-request';
const key=()=>`abb:role-planner:${library.snapshot().user??'guest'}`;
export function seedRolePlanner(goal:string,context:string,useContext:boolean){
 if(!goal.trim()||goal.length>LIMITS.request||context.length>LIMITS.context)throw Error('Shorten the task notes before opening the AI planner.');
 const nonce=crypto.randomUUID();
 sessionStorage.setItem(key(),JSON.stringify({format:'ai-blocks-role-planner/1',nonce,goal,context,useContext,at:Date.now()}));
 return `/compose?role_setup=${nonce}`;
}
export function takeRolePlannerSeed(){
 const nonce=new URLSearchParams(location.search).get('role_setup');if(!nonce)return null;
 try{
  const value=JSON.parse(sessionStorage.getItem(key())??'null');
  if(!value||value.format!=='ai-blocks-role-planner/1'||value.nonce!==nonce||typeof value.at!=='number'||Date.now()-value.at>30*60*1000||value.at>Date.now()+60_000||typeof value.goal!=='string'||!value.goal.trim()||value.goal.length>LIMITS.request||typeof value.context!=='string'||value.context.length>LIMITS.context)return null;
  sessionStorage.removeItem(key());return {goal:value.goal,context:value.context,useContext:value.useContext===true};
 }catch{return null;}
}
