#!/usr/bin/env node
// Offline ASR evidence collection. No downloads, uploads or semantic-pass claim.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const hash = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const file = p => { const q=fs.realpathSync(p); if(!fs.statSync(q).isFile())throw Error('Expected a local file: '+p); return q; };
export function reviewSegments(raw) {
  if(!raw || !Array.isArray(raw.transcription))throw Error('Expected whisper.cpp JSON transcription array');
  return raw.transcription.map((row,index)=>{
    const start=row.offsets?.from, end=row.offsets?.to;
    if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<=start||typeof row.text!=='string')throw Error('Invalid segment '+index);
    const tokens=Array.isArray(row.tokens)?row.tokens:[];
    const uncertain=tokens.filter(t=>typeof t.text==='string'&&!/^\[_/.test(t.text)&&Number.isFinite(t.p)&&t.p<0.5).map(t=>({text:t.text,probability:t.p}));
    return {index,startMs:start,endMs:end,text:row.text.trim(),uncertainTokens:uncertain,review:'UNREVIEWED_MACHINE_TRANSCRIPT'};
  });
}

export function collectSpeech({source,cli,model,ffmpeg,out,language,threads=2,audioTrack=0,modelSha256,cliSha256}) {
  for(const [key,value] of Object.entries({source,cli,model,ffmpeg,out,language}))if(typeof value!=='string'||!value.trim())throw Error('Required option: '+key);
  if(!/^[a-z]{2,3}$/.test(language))throw Error('Specify the known source language code; do not silently translate');
  if(!Number.isInteger(threads)||threads<1||threads>16||!Number.isInteger(audioTrack)||audioTrack<0)throw Error('Invalid threads or audioTrack');
  source=file(source);cli=file(cli);model=file(model);ffmpeg=file(ffmpeg);out=path.resolve(out);
  if(/\.en(?:[-.]|$)/i.test(path.basename(model))&&language!=='en')throw Error('English-only model cannot review this source language');
  for(const [p,expected] of [[model,modelSha256],[cli,cliSha256]])if(expected!==undefined&&(!/^[a-f0-9]{64}$/.test(expected)||hash(p)!==expected))throw Error('Pinned dependency hash mismatch');
  // Exclusive creation protects prior evidence and makes failures inspectable.
  fs.mkdirSync(out,{recursive:false});
  const startedAt=new Date().toISOString(), originalHash=hash(source);
  const receipt={schema:'local-speech-review/1',status:'RUNNING',startedAt,source:{path:source,sha256:originalHash},runtime:{cli:{path:cli,sha256:hash(cli)},model:{path:model,sha256:hash(model)},ffmpeg:{path:ffmpeg,sha256:hash(ffmpeg)}},language,audioTrack,threads,steps:[],limitations:['Automated speech recognition can omit or hallucinate words. Confidence is not proof of correctness.','This is semantic-review input, not human listening, verified captions, rights clearance or a publishing pass.','No model or runtime is downloaded and no media is uploaded by this helper.']};
  const run=(name,exe,args)=>{
    const result=spawnSync(exe,args,{encoding:'utf8',timeout:900000,maxBuffer:32*1024*1024,windowsHide:true});
    fs.writeFileSync(path.join(out,name+'.stdout.txt'),result.stdout??'');fs.writeFileSync(path.join(out,name+'.stderr.txt'),result.stderr??'');
    receipt.steps.push({name,command:exe,args,exitCode:result.status,error:result.error?.message??null});
    if(result.error||result.status!==0)throw Error(name+' failed; retained logs explain why');
  };
  try {
    const wav=path.join(out,'speech.wav'),prefix=path.join(out,'transcript');
    run('extract',ffmpeg,['-hide_banner','-loglevel','error','-nostdin','-n','-i',source,'-map',`0:a:${audioTrack}`,'-vn','-ar','16000','-ac','1','-c:a','pcm_s16le',wav]);
    run('transcribe',cli,['-m',model,'-f',wav,'-t',String(threads),'-l',language,'-ng','-ojf','-osrt','-otxt','-of',prefix]);
    const raw=JSON.parse(fs.readFileSync(prefix+'.json','utf8'));
    if(raw.model?.multilingual===false&&language!=='en')throw Error('Runtime reports an English-only model for another language');
    const segments=reviewSegments(raw);
    if(!segments.length)throw Error('No speech segments; inspect the source and selected audio track');
    fs.writeFileSync(path.join(out,'segments-for-review.json'),JSON.stringify({schema:'speech-segments-for-review/1',sourceSha256:originalHash,machineTranscriptSha256:hash(prefix+'.json'),status:'HUMAN_OR_AGENT_SEMANTIC_REVIEW_REQUIRED',segments},null,2)+'\n');
    receipt.status='ASR_DRAFT_CREATED';receipt.segmentCount=segments.length;
  } catch(error) { receipt.status='FAILED';receipt.error=error.message;throw error; }
  finally {
    if(hash(source)!==originalHash){receipt.status='FAILED';receipt.error='Source changed during transcription';}
    receipt.finishedAt=new Date().toISOString();
    receipt.artifacts=Object.fromEntries(fs.readdirSync(out).filter(n=>fs.statSync(path.join(out,n)).isFile()).sort().map(n=>[n,{sha256:hash(path.join(out,n)),bytes:fs.statSync(path.join(out,n)).size}]));
    fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  }
  if(receipt.status==='FAILED')throw Error(receipt.error);
  return receipt;
}
function main(){
  const a=process.argv.slice(2),o={};
  for(let i=0;i<a.length;i+=2){if(!/^--[a-z][a-z0-9-]*$/.test(a[i])||a[i+1]===undefined)throw Error('Use --source FILE --cli FILE --model FILE --ffmpeg FILE --out NEW_DIR --language en');const k=a[i].slice(2).replace(/-([a-z])/g,(_,c)=>c.toUpperCase());if(k in o)throw Error('Duplicate option '+k);o[k]=a[i+1];}
  const allowed=new Set(['source','cli','model','ffmpeg','out','language','threads','audioTrack','modelSha256','cliSha256']);
  for(const k of Object.keys(o))if(!allowed.has(k))throw Error('Unknown option '+k);
  for(const k of ['threads','audioTrack'])if(k in o)o[k]=Number(o[k]);
  const r=collectSpeech(o);console.log(JSON.stringify({status:r.status,segments:r.segmentCount,receipt:path.join(path.resolve(o.out),'receipt.json')}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main();}catch(e){console.error(e.message);process.exitCode=1;}}
