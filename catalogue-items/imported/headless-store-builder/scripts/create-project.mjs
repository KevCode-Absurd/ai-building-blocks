// AI Blocks adaptation: fetch one reviewed Shopify template commit into a NEW folder.
// No shell commands, package installs, store connections or deployments run here.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const reference=name=>fileURLToPath(new URL('../references/'+name,import.meta.url));
const manifest=JSON.parse(await fs.readFile(reference('starter-snapshot.json'),'utf8'));
const targetArg=process.argv[2];if(!targetArg)throw Error('Usage: node create-project.mjs <new-project-folder>');
const target=path.resolve(targetArg);
try{await fs.access(target);throw Error('Target already exists. Choose a new folder; nothing was overwritten.');}catch(error){if(error.code!=='ENOENT')throw error;}
if(!/^[a-f0-9]{40}$/.test(manifest.commit))throw Error('Invalid pinned source commit');
const prefix='templates/react-router/';
if(!Array.isArray(manifest.files)||manifest.files.length!==80)throw Error('Unexpected source manifest');
const outputFiles=manifest.files.map(source=>{
 const relative=source.startsWith(prefix)?source.slice(prefix.length):source==='LICENSE.md'?'UPSTREAM-LICENSE.md':null;
 if(!relative||relative.includes('..')||relative.includes('\\')||path.isAbsolute(relative))throw Error('Invalid source path');
 return {source,relative};
});
await fs.mkdir(target);
const marker=path.join(target,'.aiblocks-download-incomplete');await fs.writeFile(marker,'Incomplete download. Do not build this folder until setup succeeds.\n',{flag:'wx'});
for(const row of outputFiles){
 const response=await fetch('https://raw.githubusercontent.com/Shopify/hydrogen/'+manifest.commit+'/'+row.source,{signal:AbortSignal.timeout(45000)});
 if(!response.ok)throw Error('Source download failed: '+response.status+' '+row.source);
 const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>2_000_000)throw Error('Unexpectedly large source file');
 const file=path.join(target,row.relative);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes,{flag:'wx'});
}
const packageJson=await fs.readFile(reference('starter-package.json'),'utf8'),pkg=JSON.parse(packageJson);
const lock=await fs.readFile(reference('starter-package-lock.json'),'utf8'),lockRoot=JSON.parse(lock).packages[''];
for(const key of ['dependencies','devDependencies'])if(JSON.stringify(pkg[key])!==JSON.stringify(lockRoot[key]))throw Error('Package pins and lock disagree');
await fs.writeFile(path.join(target,'package.json'),packageJson);
await fs.writeFile(path.join(target,'package-lock.json'),lock,{flag:'wx'});
await fs.mkdir(path.join(target,'scripts'),{recursive:true});
await fs.copyFile(new URL('./check-graphql.mjs',import.meta.url),path.join(target,'scripts/check-graphql.mjs'));
const rootFile=path.join(target,'app/root.tsx'),original=await fs.readFile(rootFile,'utf8'),eol=original.includes('\r\n')?'\r\n':'\n';let root=original.replace(/\r\n/g,'\n');
for(const [from,to]of [
 ['import { analyticsConsent, resolveShopIdentity, storefrontConfig } from "~/lib/shop";','import { analyticsConsent, resolveShopIdentity, storefrontConfig, shouldUseMockShop } from "~/lib/shop";'],
 ['    shopIdentity: resolveShopIdentity(env, layout.shopId),','    shopIdentity: resolveShopIdentity(env, layout.shopId),\n    demoMode: shouldUseMockShop(env),'],
 ['        {children}','        {rootData?.demoMode ? (\n          <p role="note" className="bg-surface text-on-surface px-4 py-3 text-center">\n            Demo storefront. Products and checkout use mock.shop; no real order is placed.\n          </p>\n        ) : null}\n        {children}']
]){if(!root.includes(from))throw Error('Pinned template anchor missing');root=root.replace(from,to);}
await fs.writeFile(rootFile,root.replace(/\n/g,eol));
await fs.writeFile(path.join(target,'.env'),'MOCK_SHOP=1\n',{flag:'wx'});
await fs.unlink(marker);
console.log('Created '+target+' from Shopify/hydrogen '+manifest.commit+'.');
console.log('Demo data is fictional. No credentials, orders or deployments were used.');
console.log('Next, inside the new folder, run each command in order and stop on an error:\nnpm ci --ignore-scripts --no-audit --no-fund\nnpm run typecheck\nnpm run build');
