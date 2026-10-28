// Publish only the files already inventoried in the public skill packages.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {unzipSync} from 'fflate';
import {inspectSkillArchive, safePackagePath} from '../src/lib/workflow-execution.ts';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const SLUG=/^[a-z0-9][a-z0-9-]{0,119}$/;
export function buildSkillAssets(publicDir){
  const root=path.resolve(publicDir),skills=path.join(root,'skills');
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/public-api-manifest.json'),'utf8'));
  if(manifest.schema!=='abb-public-catalogue/1'||!manifest.resources||Array.isArray(manifest.resources))throw Error('Invalid public package manifest');
  const noLinks=absolute=>{
    for(let current=absolute;;current=path.dirname(current)){
      if(fs.lstatSync(current,{throwIfNoEntry:false})?.isSymbolicLink())throw Error('Public asset path contains a symlink');
      if(current===root)break;
    }
  };
  const target=relative=>{
    if(!safePackagePath(relative)||!/^skills\/[a-z0-9-]+\/.+/.test(relative))throw Error('Unsafe public asset path');
    const absolute=path.resolve(root,relative),prefix=skills+path.sep;
    if(!absolute.startsWith(prefix))throw Error('Asset escaped the generated skills directory');
    // Never follow an existing directory junction or symlink out of the build.
    noLinks(absolute);
    return absolute;
  };
  const verify=(bytes,record,label)=>{if(!record||bytes.length!==record.bytes||digest(bytes)!==record.sha256)throw Error('Package checksum mismatch: '+label);};
  const writes=[];
  for(const [slug,entry]of Object.entries(manifest.resources)){
    if(!SLUG.test(slug)||entry.instruction?.path!==`/skills/${slug}/SKILL.md`||!Array.isArray(entry.files))throw Error('Invalid published resource');
    const instruction=fs.readFileSync(target(`skills/${slug}/SKILL.md`));verify(instruction,entry.instruction,slug+'/SKILL.md');
    let contents={[`${slug}/SKILL.md`]:instruction};
    if(entry.archive){
      if(entry.archive.path!==`/skills/${slug}.zip`)throw Error('Invalid published archive path');
      const archiveFile=path.join(skills,slug+'.zip');noLinks(archiveFile);
      const archive=fs.readFileSync(archiveFile);verify(archive,entry.archive,slug+'.zip');
      inspectSkillArchive(archive,slug);contents=unzipSync(archive);
    }
    const present=Object.keys(contents).filter(name=>!name.endsWith('/'));
    if(present.length!==entry.files.length||new Set(entry.files.map(f=>f.path)).size!==present.length)throw Error('Package inventory differs: '+slug);
    for(const record of entry.files){
      if(!safePackagePath(record.path)||!record.path.startsWith(slug+'/')||!contents[record.path])throw Error('Unsafe or missing package member');
      const bytes=Buffer.from(contents[record.path]);verify(bytes,record,record.path);
      if(record.path.toLowerCase()===slug+'/index.html')throw Error('A package root index.html would shadow its catalogue page; use a separate download route before publishing it');
      if(record.path===slug+'/SKILL.md'){
        if(instruction.toString('utf8').replace(/\r\n?/g,'\n')!==bytes.toString('utf8').replace(/\r\n?/g,'\n'))throw Error('Packaged instructions differ from the public instructions: '+slug);
        continue;
      }
      const relative='skills/'+record.path;writes.push({relative,file:target(relative),bytes});
    }
  }
  const inventoryFile=path.join(root,'data/skill-assets.json');
  const previous=fs.existsSync(inventoryFile)?JSON.parse(fs.readFileSync(inventoryFile,'utf8')):{schema:'abb-skill-assets/1',paths:[]};
  if(previous.schema!=='abb-skill-assets/1'||!Array.isArray(previous.paths))throw Error('Invalid generated asset inventory');
  const owned=new Set(writes.map(row=>row.relative)),stale=[];
  for(const relative of previous.paths){
    if(typeof relative!=='string'||/^skills\/[a-z0-9-]+\/skill\.md$/i.test(relative))throw Error('Invalid prior generated asset path');
    const file=target(relative);if(!owned.has(relative)&&fs.existsSync(file)){
      if(!fs.lstatSync(file).isFile())throw Error('Prior generated asset is not a file');
      stale.push(file);
    }
  }
  // All packages and destinations are checked before the first write or removal.
  let written=0;
  for(const row of writes){
    if(fs.existsSync(row.file)&&fs.readFileSync(row.file).equals(row.bytes))continue;
    fs.mkdirSync(path.dirname(row.file),{recursive:true});fs.writeFileSync(row.file,row.bytes);written++;
  }
  // Remove only exact files owned by the preceding generated inventory, never source folders.
  for(const file of stale)fs.unlinkSync(file);
  const next=JSON.stringify({schema:'abb-skill-assets/1',paths:[...owned].sort()},null,2)+'\n';
  if(!fs.existsSync(inventoryFile)||fs.readFileSync(inventoryFile,'utf8')!==next)fs.writeFileSync(inventoryFile,next);
  return {packages:Object.keys(manifest.resources).length,files:writes.length,written,removed:stale.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const result=buildSkillAssets(path.resolve(import.meta.dirname,'../public'));
  console.log('Skill assets: '+JSON.stringify(result));
}
