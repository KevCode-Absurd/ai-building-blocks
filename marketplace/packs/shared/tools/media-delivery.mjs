#!/usr/bin/env node
// Checks actual local delivery bytes. Review declarations are never visual verification.
// node tools/media-delivery.mjs delivery/manifest.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const MAX_FILE=256*1024*1024, MAX_TOTAL=512*1024*1024;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const text=x=>typeof x==='string'&&x.trim().length>0&&x.length<=2000;
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
function localFile(root,relative) {
  if(!text(relative)||relative.includes('\\')||relative.includes(':')||relative.startsWith('/')||relative.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Paths must be relative, contained, forward-slash paths');
  let full=root;
  for(const part of relative.split('/')) {full=path.join(full,part);if(fs.lstatSync(full).isSymbolicLink())throw Error('Symbolic links are not supported');}
  const stat=fs.statSync(full);
  if(!stat.isFile()||stat.size>MAX_FILE)throw Error('Expected a regular file no larger than 256 MiB');
  return {full,bytes:stat.size};
}

export function inspectMedia(full) {
  // Explicit elementary/container demuxers exclude playlists and manifests that can
  // refer to other local files. The input itself is a contained regular file.
  const formats='png_pipe,jpeg_pipe,webp_pipe,bmp_pipe,tiff_pipe,mov,matroska,webm,avi,wav,mp3,aac,ogg,flac';
  // Small still images otherwise autodetect as image2, which permits sequences.
  const head=Buffer.alloc(16),fd=fs.openSync(full,'r');try{fs.readSync(fd,head,0,16,0);}finally{fs.closeSync(fd);}
  const forced=head.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'))?'png_pipe':head.subarray(0,3).equals(Buffer.from('ffd8ff','hex'))?'jpeg_pipe':head.toString('ascii',0,4)==='RIFF'&&head.toString('ascii',8,12)==='WEBP'?'webp_pipe':head.toString('ascii',0,2)==='BM'?'bmp_pipe':['49492a00','4d4d002a'].includes(head.subarray(0,4).toString('hex'))?'tiff_pipe':null;
  const result=spawnSync('ffprobe',['-v','error','-protocol_whitelist','file','-format_whitelist',formats,...(forced?['-f',forced]:[]),'-show_entries','stream=codec_type,codec_name,width,height:format=duration,format_name','-of','json',full],{encoding:'utf8',timeout:15000,maxBuffer:1024*1024,windowsHide:true,shell:false});
  if(result.error?.code==='ENOENT')return {status:'NOT_RUN',reason:'ffprobe unavailable; install it or use the host media inspector and retain its receipt'};
  if(result.error||result.status!==0)return {status:'FAIL',reason:'Media could not be decoded by ffprobe'};
  try {
    const data=JSON.parse(result.stdout),v=data.streams?.find(s=>s.codec_type==='video'),a=data.streams?.find(s=>s.codec_type==='audio');
    const duration=Number(data.format?.duration),durationSeconds=Number.isFinite(duration)&&duration>0?duration:null;
    const imageFormat=/^(png|jpeg|webp|bmp|tiff)_pipe$/.test(data.format?.format_name??'');
    if(v&&(!Number.isInteger(v.width)||v.width<=0||!Number.isInteger(v.height)||v.height<=0))return {status:'FAIL',reason:'Invalid image/video dimensions'};
    const mediaKind=v?(imageFormat&&durationSeconds===null?'image':durationSeconds!==null?'video':null):a&&durationSeconds!==null?'audio':null;
    if(!mediaKind)return {status:'FAIL',reason:'No supported still image or finite-duration video/audio'};
    return {status:'PASS',mediaKind,width:v?.width??null,height:v?.height??null,codec:v?.codec_name??a?.codec_name,audio:!!a,durationSeconds};
  }catch{return {status:'FAIL',reason:'Invalid ffprobe response'};}
}

export function checkMediaDelivery(manifestPath,{probe=inspectMedia}={}) {
  const manifestAbsolute=path.resolve(manifestPath),root=fs.realpathSync(path.dirname(manifestAbsolute));
  const manifestFile=localFile(root,path.basename(manifestAbsolute));
  if(manifestFile.bytes>1024*1024)throw Error('Manifest exceeds 1 MiB');
  const m=JSON.parse(fs.readFileSync(manifestFile.full,'utf8').replace(/^\uFEFF/,''));
  if(!object(m)||m.schema!=='media-delivery/1'||!Array.isArray(m.sources)||!Array.isArray(m.outputs)||!Array.isArray(m.requiredSourceKinds)||!Array.isArray(m.editableFiles)||m.sources.length>96||m.outputs.length>96||m.editableFiles.length>96||!m.outputs.length)throw Error('Invalid media-delivery/1 manifest or file limit');
  const kinds=['photograph','footage','audio','illustration','generated','reference'];
  if(m.requiredSourceKinds.some(k=>!kinds.includes(k)))throw Error('Unknown required source kind');
  const findings=[],sourceIds=new Set(),availableKinds=new Set(),paths=new Set();let total=0;
  const add=(code,detail)=>findings.push({code,detail});
  const read=entry=>{
    if(!object(entry)||!text(entry.path)||typeof entry.sha256!=='string'||!/^[a-f0-9]{64}$/.test(entry.sha256))throw Error('Every file needs path and lowercase SHA-256');
    if(paths.has(entry.path))throw Error('Duplicate file path');paths.add(entry.path);
    try {
      const file=localFile(root,entry.path);total+=file.bytes;if(total>MAX_TOTAL)throw Error('Delivery exceeds 512 MiB');
      const actual=hash(fs.readFileSync(file.full));if(actual!==entry.sha256)add('HASH_MISMATCH',entry.path);
      return {...file,sha256:actual};
    }catch(e){add('FILE_UNAVAILABLE',entry.path+': '+e.message);return null;}
  };
  for(const source of m.sources){
    if(!object(source)||!text(source.id)||sourceIds.has(source.id)||!kinds.includes(source.kind)||!text(source.provenance)||!text(source.rightsReference))throw Error('Sources need unique id, kind, provenance and rightsReference');
    sourceIds.add(source.id);const file=read(source);
    if(file&&file.sha256===source.sha256){
      const required={photograph:'image',footage:'video',audio:'audio'}[source.kind];
      if(required){
        const inspected=probe(file.full);
        if(inspected.status!=='PASS')add('SOURCE_INSPECTION_'+inspected.status,source.path+': '+inspected.reason);
        else if(inspected.mediaKind!==required)add('SOURCE_KIND_MISMATCH',source.path+': '+source.kind+' requires '+required+' bytes');
        else availableKinds.add(source.kind);
      }else availableKinds.add(source.kind);
    }
  }
  for(const kind of new Set(m.requiredSourceKinds))if(!availableKinds.has(kind))add('MISSING_REQUIRED_SOURCE',kind+' is required; generated or illustrated substitutes do not satisfy it');
  for(const edit of m.editableFiles)read(edit);
  if(!m.editableFiles.length)add('MISSING_EDITABLE_SOURCE','Include the design project or render source and its local dependencies');
  const outputs=[];
  for(const output of m.outputs){
    if(!['image','video'].includes(output.kind)||!text(output.placement)||!Array.isArray(output.sourceIds)||!output.sourceIds.length||output.sourceIds.some(id=>!sourceIds.has(id))||!Number.isInteger(output.width)||!Number.isInteger(output.height)||output.width<=0||output.height<=0)throw Error('Outputs need image/video kind, placement, sourceIds and positive integer width/height');
    const file=read(output);let measured={status:'NOT_RUN',reason:'Output unavailable'};
    if(file){measured=probe(file.full);if(measured.status==='PASS'&&(measured.width!==output.width||measured.height!==output.height))add('DIMENSIONS_MISMATCH',output.path);else if(measured.status!=='PASS')add('MEDIA_INSPECTION_'+measured.status,output.path+': '+measured.reason);}
    if(measured.status==='PASS'&&measured.mediaKind!==output.kind)add('OUTPUT_KIND_MISMATCH',output.path+': expected '+output.kind+' bytes');
    if(output.kind==='video'){
      if(typeof output.durationSeconds!=='number'||!Number.isFinite(output.durationSeconds)||output.durationSeconds<=0||typeof output.audioExpected!=='boolean')throw Error('Video needs durationSeconds and audioExpected');
      if(measured.status==='PASS'&&(measured.durationSeconds===null||Math.abs(measured.durationSeconds-output.durationSeconds)>0.15))add('DURATION_MISMATCH',output.path);
      if(measured.status==='PASS'&&measured.audio!==output.audioExpected)add('AUDIO_STREAM_MISMATCH',output.path);
    }
    const r=output.review;
    const checks=output.kind==='video'?['phoneSize','productFidelity','captions','fullPlayback','sound']:['phoneSize','productFidelity','textAndCrop'];
    const declared=object(r)&&r.sha256===file?.sha256&&text(r.reviewer)&&text(r.notes)&&checks.every(k=>r[k]==='reviewed');
    if(!declared)add('REVIEW_REQUIRED',output.path+': missing current-export review of '+checks.join(', '));
    outputs.push({path:output.path,sha256:file?.sha256??null,measured,reviewDeclarationComplete:!!declared});
  }
  const blocking=findings.some(f=>!['REVIEW_REQUIRED','MEDIA_INSPECTION_NOT_RUN'].includes(f.code));
  return {schema:'media-delivery-result/1',status:blocking?'BLOCKED':findings.length?'REVIEW_REQUIRED':'INTEGRITY_PASS',findings,outputs,authorityGranted:false,externalActionsExecuted:0,limitations:'Checks file containment, hashes, measured media metadata and presence of hash-bound review declarations. Does not authenticate provenance or rights, verify visual quality, speech/caption accuracy, product identity, marketplace rules or actual human playback. INTEGRITY_PASS is not approval to publish.'};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  try{if(process.argv.length!==3)throw Error('Usage: node media-delivery.mjs delivery/manifest.json');const r=checkMediaDelivery(process.argv[2]);console.log(JSON.stringify(r,null,2));process.exitCode=r.status==='INTEGRITY_PASS'?0:1;}
  catch(e){console.error(JSON.stringify({schema:'media-delivery-result/1',status:'INVALID',error:e.message,authorityGranted:false,externalActionsExecuted:0}));process.exitCode=2;}
}
