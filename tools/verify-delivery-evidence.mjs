// Read-only host adapter: no model calls, network access or command execution.
// A manifest declares files; matching bytes never certify their meaning or quality.
import fs from 'node:fs/promises';
import {constants as FS} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const FILE_EVIDENCE_SCHEMA = 'ai-blocks-file-evidence/1';
export const FILE_EVIDENCE_ASSURANCE = 'LOCAL_BYTES_VERIFIED_SEMANTICS_UNVERIFIED';
export const FILE_EVIDENCE_LIMITS = Object.freeze({max_files:1000,max_file_bytes:256*1024*1024,max_total_bytes:1024*1024*1024,max_manifest_bytes:2*1024*1024});
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const sha = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const id = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(value);
const inside = (root,target) => {const relative=path.relative(root,target);return relative!==''&&!path.isAbsolute(relative)&&relative!=='..'&&!relative.startsWith('..'+path.sep);};
const issue = (code,at,message) => ({code,path:at,message});
const safeMessage = error => error?.code === 'ENOENT' ? 'The declared file or parent directory does not exist.' : error?.code === 'EACCES' || error?.code === 'EPERM' ? 'The declared file is not readable.' : 'The declared file could not be verified.';

export function isEvidencePath(value) {
  return typeof value==='string' && value.length>0 && value.length<=1024 && !/^[a-z]+:|^[/\\]|\\|[\u0000-\u001f\u007f]/i.test(value)
    && value.split('/').every(part=>part&&part!=='.'&&part!=='..'&&!/[<>:"|?*]/.test(part)&&!/[. ]$/.test(part)&&!/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part));
}

function limitsOf(overrides={}) {
  const result={...FILE_EVIDENCE_LIMITS};
  for(const [key,value] of Object.entries(overrides)) {
    if(!Object.hasOwn(result,key)||!Number.isSafeInteger(value)||value<1)throw Error('Limits must be positive whole numbers for known limit names.');
    // Callers may tighten limits but cannot silently enlarge the published cap.
    if(value>result[key])throw Error('Limits may only tighten the published file-evidence caps.');
    result[key]=value;
  }
  return result;
}

async function rootDirectory(root) {
  if(typeof root!=='string'||!path.isAbsolute(root))throw Error('The host must supply an absolute project root separately from the manifest.');
  const real=await fs.realpath(root);
  if(!(await fs.stat(real)).isDirectory())throw Error('The authorized project root must be a directory.');
  return real;
}

// Refuse all symlink/junction components, including links that currently resolve
// inside the root. Realpath and identity checks also detect changed parent paths.
async function inspectPath(root,relative) {
  if(!isEvidencePath(relative))throw Object.assign(Error('Use a safe relative POSIX file path.'),{evidenceCode:'UNSAFE_PATH'});
  let current=root;
  const parts=relative.split('/');
  for(let index=0;index<parts.length;index++) {
    current=path.join(current,parts[index]);
    const info=await fs.lstat(current);
    if(info.isSymbolicLink())throw Object.assign(Error('Symlinks and junctions are not accepted evidence paths.'),{evidenceCode:'SYMLINK_PATH'});
    if(index<parts.length-1&&!info.isDirectory())throw Object.assign(Error('A parent path is not a directory.'),{evidenceCode:'NOT_DIRECTORY'});
  }
  const real=await fs.realpath(current);
  if(!inside(root,real))throw Object.assign(Error('The file resolves outside the authorized project root.'),{evidenceCode:'OUTSIDE_ROOT'});
  const info=await fs.stat(real);
  if(!info.isFile())throw Object.assign(Error('Evidence must be a regular file.'),{evidenceCode:'NOT_REGULAR_FILE'});
  return {real,info};
}

async function readVerifiedFile(root,relative,maxBytes,{collect=false,onRead=()=>{}}={}) {
  const before=await inspectPath(root,relative);
  if(before.info.size>maxBytes)throw Object.assign(Error('The file exceeds the applicable byte limit.'),{evidenceCode:'FILE_LIMIT'});
  const handle=await fs.open(before.real,FS.O_RDONLY|(FS.O_NOFOLLOW??0));
  try {
    const opened=await handle.stat();
    const current=await inspectPath(root,relative);
    if(!opened.isFile()||opened.dev!==before.info.dev||opened.ino!==before.info.ino||current.info.dev!==opened.dev||current.info.ino!==opened.ino||current.real!==before.real)throw Object.assign(Error('The evidence path changed while it was opened.'),{evidenceCode:'FILE_CHANGED'});
    const hasher=createHash('sha256'),buffer=Buffer.alloc(64*1024),chunks=[];
    let bytes=0;
    while(true) {
      const read=await handle.read(buffer,0,Math.min(buffer.length,maxBytes-bytes+1),null);
      if(!read.bytesRead)break;
      bytes+=read.bytesRead;
      onRead(read.bytesRead);
      if(bytes>maxBytes)throw Object.assign(Error('The file grew beyond the applicable byte limit.'),{evidenceCode:'FILE_LIMIT'});
      const chunk=buffer.subarray(0,read.bytesRead);hasher.update(chunk);if(collect)chunks.push(Buffer.from(chunk));
    }
    const after=await handle.stat();
    const final=await inspectPath(root,relative);
    if(bytes!==opened.size||after.size!==opened.size||after.mtimeMs!==opened.mtimeMs||after.ctimeMs!==opened.ctimeMs||final.info.dev!==opened.dev||final.info.ino!==opened.ino||final.real!==before.real)throw Object.assign(Error('The evidence file changed during verification.'),{evidenceCode:'FILE_CHANGED'});
    return {bytes,sha256:hasher.digest('hex'),...(collect?{content:Buffer.concat(chunks).toString('utf8'),data:Buffer.concat(chunks)}:{})};
  } finally {await handle.close();}
}

/** Read explicitly selected evidence bytes using the same bounded, no-link
 * checks as the verifier. Callers must not print private content by default. */
export async function readLocalEvidenceBytes({root,file,max_bytes=FILE_EVIDENCE_LIMITS.max_file_bytes}={}) {
  if(!Number.isSafeInteger(max_bytes)||max_bytes<1||max_bytes>FILE_EVIDENCE_LIMITS.max_file_bytes)throw Error('Invalid evidence byte limit.');
  return readVerifiedFile(await rootDirectory(root),file,max_bytes,{collect:true});
}

function manifestRows(manifest,limits) {
  const errors=[],rows=[],ids=new Set(),paths=new Set();
  if(!plain(manifest))return {rows,errors:[issue('INVALID_MANIFEST','$','The manifest must be an object.')]};
  for(const key of Object.keys(manifest))if(!['schema','artifacts','sources'].includes(key))errors.push(issue('UNKNOWN_FIELD',key,'Only schema, artifacts and sources are accepted. The root belongs to the host CLI argument.'));
  if(manifest.schema!==FILE_EVIDENCE_SCHEMA)errors.push(issue('INVALID_SCHEMA','schema',`Use ${FILE_EVIDENCE_SCHEMA}.`));
  if(!Array.isArray(manifest.artifacts)||manifest.artifacts.length===0)errors.push(issue('EMPTY_ARTIFACTS','artifacts','List at least one actual deliverable artifact.'));
  if(manifest.sources!==undefined&&!Array.isArray(manifest.sources))errors.push(issue('INVALID_SOURCES','sources','Sources must be an array when provided.'));
  const append=(row,kind,at,parentId)=>{
    if(!plain(row)){errors.push(issue('INVALID_FILE_RECORD',at,'Each file record must be an object.'));return;}
    const allowed=kind==='receipt'?['path','sha256']:kind==='artifact'?['id','path','sha256','receipts']:['id','path','sha256'];
    for(const key of Object.keys(row))if(!allowed.includes(key))errors.push(issue('UNKNOWN_FIELD',`${at}.${key}`,'This field is not part of the file-evidence contract.'));
    if(kind!=='receipt') {
      if(!id(row.id))errors.push(issue('INVALID_ID',`${at}.id`,'Use a unique file ID containing letters, digits, underscores or hyphens.'));
      else if(ids.has(row.id))errors.push(issue('DUPLICATE_ID',`${at}.id`,'File IDs must be unique across artifacts and sources.'));
      ids.add(row.id);
    }
    if(!isEvidencePath(row.path))errors.push(issue('UNSAFE_PATH',`${at}.path`,'Use a relative POSIX file path without absolute roots, backslashes, aliases or traversal.'));
    else {
      // Windows path matching is case-insensitive; use that stricter rule on all
      // hosts so exported manifests behave the same when moved between systems.
      const key=row.path.toLowerCase();
      if(paths.has(key))errors.push(issue('DUPLICATE_PATH',`${at}.path`,'Declare each file path once; duplicate paths cannot add evidence coverage.'));
      paths.add(key);
    }
    if(!sha(row.sha256))errors.push(issue('INVALID_SHA256',`${at}.sha256`,'Provide the expected lowercase SHA-256 of the actual file bytes.'));
    rows.push({kind,...(kind==='receipt'?{parent_id:parentId}:{id:row.id}),path:row.path,expected_sha256:row.sha256,manifest_path:at});
  };
  for(const [index,artifact] of (Array.isArray(manifest.artifacts)?manifest.artifacts:[]).entries()) {
    const at=`artifacts[${index}]`;append(artifact,'artifact',at);
    if(plain(artifact)&&artifact.receipts!==undefined) {
      if(!Array.isArray(artifact.receipts))errors.push(issue('INVALID_RECEIPTS',`${at}.receipts`,'Receipts must be an array when provided.'));
      else for(const [receiptIndex,receipt] of artifact.receipts.entries())append(receipt,'receipt',`${at}.receipts[${receiptIndex}]`,artifact.id);
    }
  }
  for(const [index,source] of (Array.isArray(manifest.sources)?manifest.sources:[]).entries())append(source,'source',`sources[${index}]`);
  if(rows.length>limits.max_files)errors.push(issue('FILE_COUNT_LIMIT','$',`The manifest exceeds ${limits.max_files} declared files, including receipts.`));
  return {rows,errors};
}

/** Verify only declared local file bytes. No file content is returned or executed. */
export async function verifyDeliveryEvidence({root,manifest,limits:overrides={}}={}) {
  let limits,realRoot;
  const report={schema:'ai-blocks-file-evidence-result/1',status:'FAIL',assurance:FILE_EVIDENCE_ASSURANCE,files:[],errors:[],summary:{declared_files:0,verified_files:0,verified_bytes:0},verification_limit:'Only declared local file bytes are checked. This does not establish that the manifest covers the requested job, that a receipt describes a real test, visual or semantic quality, ownership, user approval, or production readiness.'};
  try {limits=limitsOf(overrides);realRoot=await rootDirectory(root);}
  catch {report.errors.push(issue('INVALID_ROOT_OR_LIMITS','$','Supply an existing absolute authorized project root and valid byte limits.'));return report;}
  report.limits=limits;report.root=realRoot;
  let manifestBytes;
  try{manifestBytes=Buffer.byteLength(JSON.stringify(manifest),'utf8');}
  catch{report.errors.push(issue('INVALID_MANIFEST','$','The manifest must be serializable JSON.'));return report;}
  if(manifestBytes>limits.max_manifest_bytes){report.errors.push(issue('MANIFEST_LIMIT','$','The manifest exceeds the byte limit.'));return report;}
  const {rows,errors}=manifestRows(manifest,limits);report.summary.declared_files=rows.length;report.errors.push(...errors);
  if(errors.length)return report; // Never open paths from an invalid manifest.
  let inspectedBytes=0;
  for(const row of rows) {
    const file={...row,status:'FAIL'};delete file.manifest_path;
    try {
      const remaining=limits.max_total_bytes-inspectedBytes;
      if(remaining<=0)throw Object.assign(Error('The total byte budget is exhausted.'),{evidenceCode:'TOTAL_BYTE_LIMIT'});
      const stat=await inspectPath(realRoot,row.path);
      if(stat.info.size>remaining)throw Object.assign(Error('The declared files exceed the total byte limit.'),{evidenceCode:'TOTAL_BYTE_LIMIT'});
      const observed=await readVerifiedFile(realRoot,row.path,Math.min(limits.max_file_bytes,remaining),{onRead:bytes=>{inspectedBytes+=bytes;}});
      file.bytes=observed.bytes;file.actual_sha256=observed.sha256;
      if(observed.sha256!==row.expected_sha256)report.errors.push(issue('HASH_MISMATCH',row.manifest_path,'The actual file bytes differ from the declared SHA-256.'));
      else {file.status='PASS';report.summary.verified_files++;report.summary.verified_bytes+=observed.bytes;}
    } catch(error) {report.errors.push(issue(error.evidenceCode??'UNREADABLE_FILE',row.manifest_path,error.evidenceCode?error.message:safeMessage(error)));}
    report.files.push(file);
  }
  report.summary.inspected_bytes=inspectedBytes;
  report.status=report.errors.length?'FAIL':'PASS';return report;
}

async function writeReport(root,relative,report,manifestPath,manifest) {
  if(!isEvidencePath(relative))throw Error('The report output must be a safe relative file path under the authorized root.');
  const declared=manifestRows(manifest,report.limits??FILE_EVIDENCE_LIMITS).rows.map(row=>String(row.path).toLowerCase());
  if(relative.toLowerCase()===manifestPath.toLowerCase()||declared.includes(relative.toLowerCase()))throw Error('The report output cannot overwrite the manifest or any declared evidence file.');
  const parts=relative.split('/'),filename=parts.pop();let parent=root;
  for(const part of parts) {
    parent=path.join(parent,part);const info=await fs.lstat(parent);
    if(!info.isDirectory()||info.isSymbolicLink())throw Error('The report parent must be an existing directory without symlinks or junctions.');
  }
  const realParent=await fs.realpath(parent);
  if(realParent!==root&&!inside(root,realParent))throw Error('The report output resolves outside the authorized root.');
  const output=path.join(realParent,filename);
  const handle=await fs.open(output,FS.O_WRONLY|FS.O_CREAT|FS.O_EXCL|(FS.O_NOFOLLOW??0),0o600);
  try{await handle.writeFile(JSON.stringify(report,null,2)+'\n','utf8');}finally{await handle.close();}
}

export async function runFileEvidenceCLI(argv,{stdout=process.stdout,stderr=process.stderr}={}) {
  const options={};
  try {
    for(let index=0;index<argv.length;index++) {
      const name=argv[index];
      if(!['--root','--manifest','--output'].includes(name)||options[name]!==undefined||!argv[index+1]||argv[index+1].startsWith('--'))throw Error('Use --root <absolute project directory> --manifest <relative manifest.json> [--output <new relative report.json>].');
      options[name]=argv[++index];
    }
    if(!options['--root']||!options['--manifest'])throw Error('Both --root and --manifest are required.');
    const root=await rootDirectory(options['--root']);
    const observed=await readVerifiedFile(root,options['--manifest'],FILE_EVIDENCE_LIMITS.max_manifest_bytes,{collect:true});
    let manifest;try{manifest=JSON.parse(observed.content);}catch{throw Error('The manifest must contain valid JSON.');}
    const report=await verifyDeliveryEvidence({root,manifest});
    report.manifest={path:options['--manifest'],sha256:observed.sha256,bytes:observed.bytes};
    if(options['--output'])await writeReport(root,options['--output'],report,options['--manifest'],manifest);
    stdout.write(JSON.stringify(report,null,2)+'\n');return report.status==='PASS'?0:1;
  } catch(error) {stderr.write(`File evidence verification failed: ${error.evidenceCode?error.message:error.message??'invalid request'}\n`);return 2;}
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))process.exitCode=await runFileEvidenceCLI(process.argv.slice(2));
