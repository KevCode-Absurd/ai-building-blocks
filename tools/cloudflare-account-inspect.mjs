// Read-only Cloudflare inventory for this release. Never prints authentication material.
import fs from 'node:fs/promises';
import path from 'node:path';
const account=process.argv[2];
if(!/^[a-f0-9]{32}$/.test(account||''))throw Error('Pass the verified Cloudflare account ID.');
const credentialPath=path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml');
const config=await fs.readFile(credentialPath,'utf8');
const token=config.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];
if(!token)throw Error('Wrangler OAuth token is unavailable; run wrangler login.');
const paths={workers:`/accounts/${account}/workers/scripts`,subdomain:`/accounts/${account}/workers/subdomain`,settings:`/accounts/${account}/workers/account-settings`,subscriptions:`/accounts/${account}/subscriptions`,domains:`/accounts/${account}/workers/domains`,zone:'/zones?name=useaiblocks.com'};
const results={};
await Promise.all(Object.entries(paths).map(async([name,apiPath])=>{
 const response=await fetch('https://api.cloudflare.com/client/v4'+apiPath,{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});
 const body=await response.json();
 results[name]={status:response.status,success:body.success,result:body.result,errors:body.errors?.map(e=>({code:e.code,message:e.message}))};
}));
const report={checkedOn:new Date().toISOString(),account,readOnly:true,results};
await fs.writeFile('reports/cloudflare-account-inventory.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
