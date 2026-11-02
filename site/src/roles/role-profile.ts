import type {RoleProfile,RoleView} from './role-types';
const profiles=new Map<string,RoleProfile>(),pending=new Map<string,Promise<RoleProfile>>();
/** Full executable setup is needed only after the optional task form opens. */
export async function loadFullRole(view:RoleView):Promise<RoleProfile>{
 const proof=view.sourceProfile;
 if(proof?.path!=='/data/roles/'+view.id+'.json'||!Number.isSafeInteger(proof.bytes)||proof.bytes<=0||proof.bytes>250000||!/^[a-f0-9]{64}$/.test(proof.sha256))throw Error('The specialist setup changed. Reload the page.');
 const key=[view.id,view.sourceHash,view.catalogueHash,proof.sha256,proof.bytes].join(':');
 if(profiles.has(key))return profiles.get(key)!;if(pending.has(key))return pending.get(key)!;
 const request=(async()=>{
  const response=await fetch(proof.path);if(!response.ok||!response.headers.get('content-type')?.includes('json'))throw Error('Task setup could not load. Check your connection and try again.');
  const bytes=await response.arrayBuffer();
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(n=>n.toString(16).padStart(2,'0')).join('');
  if(bytes.byteLength!==proof.bytes||hash!==proof.sha256)throw Error('The complete setup changed during download. Reload the page and try again.');
  const role=JSON.parse(new TextDecoder().decode(bytes));
  if(role.schema!=='ai-blocks-role/1'||role.id!==view.id||role.sourceHash!==view.sourceHash||role.catalogueHash!==view.catalogueHash||!role.worker||!role.workerFiles||!Array.isArray(role.resources)||!role.resources.some((r:{slug:string})=>r.slug===role.lead))throw Error('The complete specialist setup is unavailable. Reload the page.');
  profiles.set(key,role);return role as RoleProfile;
 })().finally(()=>pending.delete(key));pending.set(key,request);return request;
}
