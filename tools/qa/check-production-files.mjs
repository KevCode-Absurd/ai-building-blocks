// Inspect every build entry before publishing. Downloadable source methods and licences remain valid assets.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {REPO} from './git-content.mjs';

export function auditProductionFiles(root, app='site') {
  if(!['site','marketplace'].includes(app))throw Error('Unknown production application');
  const folder=path.join(root,app,'dist'), entries=[], problems=[];
  const internal=new Set(app==='site'?['fonts/ai-blocks-intro-sans.json','fonts/README-intro-font.md']:['agents/manifest.json']);
  let directories=0;
  const walk=(dir,prefix='')=>{
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
      const relative=prefix+entry.name, absolute=path.join(dir,entry.name);
      if(entry.isSymbolicLink()){problems.push(relative+' (symlink)');continue;}
      if(/^(?:\.git|node_modules|__pycache__|\.pytest_cache|\.wrangler|test-results)(?:$|-)/.test(entry.name)||/^\.env(?:$|\.)/.test(entry.name)&&entry.name!=='.env.example')problems.push(relative+' (development file)');
      if(entry.isDirectory()){directories++;walk(absolute,relative+'/');}
      else if(entry.isFile()){
        if(internal.has(relative)||/\.(?:map|log|pyc|pyo|tsbuildinfo|bak|tmp)$/i.test(entry.name))problems.push(relative+' (maintenance/build debris)');
        entries.push({path:relative,bytes:fs.statSync(absolute).size});
      }else problems.push(relative+' (unsupported entry)');
    }
  };
  if(fs.lstatSync(folder).isSymbolicLink())throw Error('Production build root must not be a symlink');
  walk(folder);
  if(!entries.length)throw Error('Production build is empty');
  if(problems.length)throw Error('Unnecessary production files: '+problems.join(', '));
  entries.sort((a,b)=>a.path.localeCompare(b.path,'en'));
  return {app,files:entries.length,directories,bytes:entries.reduce((sum,row)=>sum+row.bytes,0),path_size_manifest_sha256:createHash('sha256').update(JSON.stringify(entries)).digest('hex'),assurance:'All file paths and sizes inspected; this is not semantic review of every file.'};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2);
  if(args.length>1||args.length===1&&!['--library','--marketplace'].includes(args[0]))throw Error('Use --library or --marketplace');
  console.log(JSON.stringify({status:'PASS',...auditProductionFiles(REPO,args[0]==='--marketplace'?'marketplace':'site')},null,2));
}
