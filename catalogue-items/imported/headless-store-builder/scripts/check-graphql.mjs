// Use the same pinned schemas and warning level as `hydrogen gql check`.
// Relative paths keep gql.tada from treating a Windows C: path as a URL.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root=process.cwd(),require=createRequire(path.join(root,'package.json'));
const schemas=['storefront','customer-account'].map(name=>{
 const schema='./node_modules/@shopify/hydrogen/dist/'+name+'.schema.json';
 if(!fs.existsSync(schema))throw Error('Missing installed Shopify schema: '+name);
 return {name,schema,tadaOutputLocation:name+'-graphql-env.d.ts'};
});
const file=path.join(root,'.aiblocks-gql-check-'+randomUUID()+'.json');
fs.writeFileSync(file,JSON.stringify({extends:'./tsconfig.json',compilerOptions:{plugins:[{name:'gql.tada/ts-plugin',schemas,trackFieldUsage:false}]}}),{flag:'wx'});
try{
 const cli=path.join(path.dirname(require.resolve('gql.tada/package.json')),'bin/cli.js');
 const result=spawnSync(process.execPath,[cli,'check','--tsconfig',file,'--level','info','--fail-on-warn'],{cwd:root,stdio:'inherit'});
 if(result.error)throw result.error;process.exitCode=result.status??1;
}finally{fs.unlinkSync(file);}
