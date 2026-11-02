// Keep the local server and headless browser in one permission/session context.
import {createServer} from 'vite';
import {spawn} from 'node:child_process';
import path from 'node:path';
const output=process.argv[2];if(!output)throw Error('Supply a local test-output directory.');
const server=await createServer({mode:'test',server:{host:'127.0.0.1',port:5197,strictPort:true}});
try{
 await server.listen();
 const response=await fetch('http://127.0.0.1:5197/roles/coding-specialist',{signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw Error('Local preview health check failed: '+response.status);
 console.log('Local preview health check:',response.status);
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['node_modules/@playwright/test/cli.js','test','e2e/base-specialist.spec.ts','e2e/roles.spec.ts','--workers=1','--reporter=line','--output='+path.resolve(output)],{windowsHide:true,stdio:'inherit',env:{...process.env,PW_EXTERNAL_SERVER:'1',PW_BASE_URL:'http://127.0.0.1:5197'}});
  child.on('error',reject);child.on('exit',code=>resolve(code??1));
 });
 process.exitCode=code;
}finally{await server.close();}
