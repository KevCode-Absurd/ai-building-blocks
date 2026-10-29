import {localSecurity,securityJson,type SecurityEnv} from './api-security.ts';

/** Additional per-connection limits after OAuth verification. Keep the shared edge-IP guard too. */
export async function verifiedGrantLimit(request:Request,env:SecurityEnv,grantId:string):Promise<Response|null>{
  if(localSecurity(request,env))return null;
  const unavailable=()=>securityJson(503,{error:'connection_protection_unavailable',error_description:'Connection protection is unavailable. Please try later.'});
  if(typeof grantId!=='string'||!grantId||grantId.length>200)return unavailable();
  const write=!['GET','HEAD','OPTIONS'].includes(request.method),limiter=write?env.API_WRITE_LIMITER:env.API_READ_LIMITER;
  if(!limiter)return unavailable();
  try{
    // Only the verified, stable grant ID is used. Tokens, arbitrary headers and routes cannot reset it.
    const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('mcp-grant/1:'+grantId)))].map(n=>n.toString(16).padStart(2,'0')).join('');
    if(!(await limiter.limit({key:'mcp-grant:'+digest})).success)return securityJson(429,{error:'connection_rate_limited',error_description:'This connection has made too many requests. Wait a minute and try again.'},{'retry-after':'60'});
    return null;
  }catch{return unavailable();}
}
