// Compare known local private keys with client bundles without emitting values.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {loadWorkflowEnv} from './lib/workflow-env.mjs';
const assets=path.resolve(process.argv[2]||'site/dist/assets');
const env=loadWorkflowEnv(process.cwd());
const providers=['OPENAI_API_KEY','ANTHROPIC_API_KEY','GEMINI_API_KEY','DEEPSEEK_API_KEY'].map(name=>env[name]).filter(value=>typeof value==='string'&&value.length>20);
const clerk=[],development=[];
for(const file of ['site/.env.local','site/.env.clerk.production.local'])if(fs.existsSync(file)){
 const contents=fs.readFileSync(file,'utf8');
 const value=name=>contents.match(new RegExp('^'+name+'\\s*=\\s*(.*?)\\s*$','m'))?.[1]?.replace(/^["']|["']$/g,'');
 if(value('CLERK_SECRET_KEY'))clerk.push(value('CLERK_SECRET_KEY'));
 for(const name of ['VITE_CLERK_PUBLISHABLE_KEY','CLERK_PUBLISHABLE_KEY'])if(value(name)?.startsWith('pk_test_'))development.push(value(name));
}
const secrets=[...providers,...clerk,...development];
const files=fs.readdirSync(assets).filter(file=>file.endsWith('.js'));
const leaks=files.filter(file=>{const text=fs.readFileSync(path.join(assets,file),'utf8');return secrets.some(secret=>text.includes(secret));});
assert.equal(leaks.length,0,'Private credentials or development account keys found in a client bundle.');
const report={checkedOn:new Date().toISOString(),knownProviderKeysChecked:providers.length,knownClerkSecretsChecked:clerk.length,developmentPublicKeysChecked:new Set(development).size,clientJavaScriptFiles:files.length,leaks,status:'pass'};
fs.writeFileSync('reports/cloudflare-client-credential-scan.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
