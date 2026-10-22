// Staging-only connectivity probe. Secrets and upload JWTs are never emitted.
import fs from 'node:fs/promises';
import path from 'node:path';
const logDirectory='site/.wrangler/logs';
const logs=(await fs.readdir(logDirectory)).filter(n=>n.endsWith('.log')).sort().slice(-5);
for(const name of logs){
 const log=await fs.readFile(path.join(logDirectory,name),'utf8');
 console.log(JSON.stringify({name,logBytes:log.length,errorCodes:[...new Set(log.match(/\b(?:UND_ERR_[A-Z_]+|ECONNRESET|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|EPIPE|EAI_AGAIN)\b/g)||[])],manifestLogged:log.includes('"manifest"')}));
}
const config=await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8');
const token=config.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];
if(!token)throw Error('Wrangler login required.');
const url='https://api.cloudflare.com/client/v4/accounts/31c814d2c58a11163d3187f505f0b9c5/workers/scripts/ai-building-blocks-staging/assets-upload-session';
try{
 const response=await fetch(url,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({manifest:{}}),signal:AbortSignal.timeout(30000)});
 const body=await response.json();
 console.log(JSON.stringify({uploadEndpointStatus:response.status,success:body.success,errors:body.errors?.map(e=>({code:e.code,message:e.message})),resultFields:Object.keys(body.result||{})}));
}catch(error){console.log(JSON.stringify({error:error.name,code:error.cause?.code}));process.exitCode=1;}
