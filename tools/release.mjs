#!/usr/bin/env node
// Local gates by default. Publication requires --deploy, committed/pushed source and existing authentication.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {git,REPO,worktreeText} from './qa/git-content.mjs';
import {readSitemaps} from './indexnow-ping.mjs';
const SITE='https://useaiblocks.com';
const TS=createRequire(new URL('../site/package.json',import.meta.url))('typescript');
export const ATTRIBUTION='Co-Authored-By: Codex <noreply@openai.com>';
export const gateSteps=[
  ['Build minds',process.execPath,['tools/build-minds.mjs'],'.'],
  ['Index catalogue', 'npm',['--prefix','site','run','index'],'.'],
  ['Generate Before and After',process.execPath,['tools/add-needs.mjs'],'.'],
  ['Reindex catalogue','npm',['--prefix','site','run','index'],'.'],
  ['Check generated sections',process.execPath,['tools/add-needs.mjs','--check'],'.'],
  // Search scoring writes its reports outside the repo (CATALOGUE_EVAL_REPORTS, set in execute) so the source stays clean.
  ['Search relevance',process.execPath,['scripts/evaluate-catalogue-search.mjs','--check'],'site'],
  ['Check source',process.execPath,['tools/qa/check.mjs','--worktree'],'.'],
  ['Unit tests','npm',['run','test:unit'],'site'],
  ['Outcome evals scorecard',process.execPath,['tools/outcome-evals.mjs','score'],'.'],
  ['Production build','npm',['run','build'],'site'],
  ['Byte budgets',process.execPath,['scripts/byte-budgets.mjs'],'site'],
  ['SEO','npm',['run','seo'],'site'],
  ['Browser checks','npx',['playwright','test','--config','playwright.context.config.ts'],'site'],
];
export async function runSteps(steps,execute){for(const step of steps){const result=await execute(step);if(result?.status!==0)throw Error(`Stopped at: ${step[0]}`);}}
export function validateDeploymentConfig(text,hold){
  const parsed=TS.parseConfigFileTextToJson('wrangler.production.jsonc',text);if(parsed.error||!parsed.config||typeof parsed.config!=='object')throw Error('Production configuration is invalid');
  for(const name of ['PUBLIC_API_ENABLED','MCP_OAUTH_ENABLED','WORKFLOW_COMPOSER_ENABLED'])if(parsed.config.vars?.[name]!=='true')throw Error(name+' must stay enabled');
  if(hold!==null&&hold!==undefined&&(typeof hold!=='object'||Array.isArray(hold)||typeof hold.pauseLatched!=='boolean'))throw Error('Spending hold state is unreadable');
  if(hold?.pauseLatched)throw Error('An existing spending hold must not be resumed by a deployment');
}
export const ASSET_LIMIT=95000;
export function buildInventory(root){
  let files=0,dirs=0;const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.isSymbolicLink())throw Error('Build contains a symlink');const file=path.join(dir,entry.name);if(entry.isDirectory()){dirs++;walk(file);}else if(entry.isFile())files++;else throw Error('Unsupported build entry');}};
  walk(path.join(root,'site/dist'));if(files+dirs>=ASSET_LIMIT)throw Error('Final deployment inventory reached the asset safety limit');
  return {files,directories:dirs,entries:files+dirs,limit:ASSET_LIMIT,headroom:ASSET_LIMIT-files-dirs,used:`${Math.round((files+dirs)/ASSET_LIMIT*1000)/10}%`};
}
// Workers static assets keep only the files of the live version, so a page opened before a deploy would ask for code
// files that are gone. Each verified deploy remembers its own /assets (hashed names, never reused), and the next deploy
// within 7 days uploads that one previous build again beside the new one. Only one previous build is carried (the
// hashed catalogue alone is 4.5 MB), so pages two deploys old rely on the app's reload-once instead.
export const ASSET_KEEP_MS=7*24*60*60*1000;
const historyDir=root=>path.join(root,'site/.wrangler/asset-history');
export function carryForwardAssets(root,now=Date.now()){
  const history=historyDir(root),target=path.join(root,'site/dist/assets'),names=[];
  if(!fs.existsSync(history)||!fs.existsSync(target))return {files:0,builds:0,names};
  const latest=fs.readdirSync(history).filter(entry=>now-Number(entry.split('-')[0])<ASSET_KEEP_MS).sort((a,b)=>Number(b.split('-')[0])-Number(a.split('-')[0]))[0];
  if(!latest)return {files:0,builds:0,names};
  for(const name of fs.readdirSync(path.join(history,latest))){const to=path.join(target,name);if(!fs.existsSync(to)){fs.copyFileSync(path.join(history,latest,name),to);names.push(name);}}
  return {files:names.length,builds:1,names};
}
// Saves the new build's own files (not the ones carried from before) and deletes every older entry.
export function rememberAssets(root,version,now=Date.now(),carried=[]){
  const history=historyDir(root),source=path.join(root,'site/dist/assets');if(!fs.existsSync(source))return 0;
  fs.mkdirSync(history,{recursive:true});
  for(const entry of fs.readdirSync(history))fs.rmSync(path.join(history,entry),{recursive:true,force:true});
  const keep=path.join(history,`${now}-${version}`),skip=new Set(carried);fs.mkdirSync(keep);let files=0;
  for(const entry of fs.readdirSync(source,{withFileTypes:true}))if(entry.isFile()&&!skip.has(entry.name)){fs.copyFileSync(path.join(source,entry.name),path.join(keep,entry.name));files++;}
  return files;
}
// The one version serving all traffic now: the rollback target if the new deploy fails its live check.
export function liveVersion(text){
  let status;try{status=JSON.parse(text);}catch{throw Error('Cannot read the live deployment; nothing was deployed');}
  const versions=Array.isArray(status?.versions)?status.versions:[];
  if(versions.length!==1||versions[0].percentage!==100||!/^[a-f0-9-]{36}$/.test(versions[0].version_id??''))throw Error('Production is not on a single version; finish or roll back that deployment first');
  return versions[0].version_id;
}
// A live check can fail while the new version spreads, so it is tried a few times. A version that still fails is
// rolled back to the one that was live before, and the release stops either way.
export async function verifyOrRollBack({check,rollBack,previous,attempts=3,pause=15000,sleep=ms=>new Promise(done=>setTimeout(done,ms))}){
  let failure;
  for(let attempt=1;attempt<=attempts;attempt++){try{return await check();}catch(error){failure=error;if(attempt<attempts)await sleep(pause);}}
  const rolled=await rollBack(previous,failure);
  if(rolled?.status===0)throw Error(`${failure.message}. Production was rolled back to version ${previous}`);
  throw Error(`${failure.message}. Automatic rollback failed: run npx wrangler rollback ${previous} -c wrangler.production.jsonc`);
}
function cleanSource(root){if(git(root,['status','--porcelain']).toString().trim())throw Error('Review and commit source changes before publication');return git(root,['rev-parse','HEAD']).toString().trim();}
function deploymentConfig(root){const text=worktreeText(root,'site/wrangler.production.jsonc');if(!text)throw Error('Production configuration missing');const state=worktreeText(root,'site/.wrangler/spend-monitor/state.json');validateDeploymentConfig(text,state?JSON.parse(state):null);}
function pushedSource(root,source){
  const branch=git(root,['branch','--show-current']).toString().trim();if(!branch)throw Error('A named, pushed branch is required');
  const remote=git(root,['-c','credential.interactive=false','ls-remote','origin','refs/heads/'+branch],{env:{...process.env,GIT_TERMINAL_PROMPT:'0'}}).toString().trim().split(/\s/)[0];
  if(remote!==source)throw Error('Push this exact source commit to origin before publication');
}
async function get(fetcher,route,options){const response=await fetcher(SITE+route,{signal:AbortSignal.timeout(30000),...options});if(!response.ok)throw Error('Live check failed: '+route+' HTTP '+response.status);return response;}
// Headers every release must keep (public/_headers): HTTPS only, account pages never framed, the report-only content
// policy on pages, and the support-chat frame unchanged. An item page keeps a short stale window. /connect-mcp is
// checked by site/test/security-headers.test.mjs only: the Worker answers a bare GET there with 400.
export function headerRules(itemPath){return [
  ['/',{'strict-transport-security':/^max-age=31536000; includeSubDomains$/,'content-security-policy-report-only':/default-src 'self'.*report-uri \/api\/client-error/,'x-content-type-options':/^nosniff$/}],
  ['/sign-in',{'x-frame-options':/^DENY$/,'content-security-policy':/frame-ancestors 'none'/}],
  ['/account',{'x-frame-options':/^DENY$/,'content-security-policy':/frame-ancestors 'none'/}],
  ['/support-chat-frame',{'x-frame-options':/^SAMEORIGIN$/,'content-security-policy':/frame-ancestors 'self'/}],
  ...(itemPath?[[itemPath,{'cache-control':/^public, max-age=300, stale-while-revalidate=600$/}]]:[]),
];}
export async function checkHeaders(fetcher,rules){
  for(const [route,expected] of rules){const response=await get(fetcher,route);for(const [name,pattern] of Object.entries(expected)){const value=response.headers.get(name);if(!value||!pattern.test(value))throw Error(`Live header check failed: ${route} ${name}`);}}
  return rules.length;
}
async function assertComposerActive(fetcher){if((await(await get(fetcher,'/api/compose')).json()).enabled!==true)throw Error('The live AI composer is paused or unavailable; deployment cannot resume it');}
export async function checkPublishedBuild({root,source,fetcher=fetch}){
  const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
  const stamps=JSON.parse(fs.readFileSync(path.join(root,'site/dist/data/content-fingerprints.json')));
  if(stamps.dirty!==false||stamps.source_commit!==source)throw Error('Build must describe this exact committed source');
  const routes=['/index.html','/compose','/api-and-mcp','/data/blocks.json','/data/public-api-manifest.json','/data/content-fingerprints.json','/robots.txt'];
  for(const route of routes){const direct=path.join(root,'site/dist'+route),file=fs.existsSync(direct)?direct:direct+'.html';const bytes=Buffer.from(await(await get(fetcher,route)).arrayBuffer());if(sha(bytes)!==sha(fs.readFileSync(file)))throw Error('Live content differs from build: '+route);}
  const remote=await readSitemaps(SITE,{warn:()=>{throw Error('Unreadable live sitemap');}}),built=await readSitemaps(path.join(root,'site/dist'));
  if(remote.size!==built.size||[...remote].some(([url,date])=>built.get(url)!==date||stamps.urls[url]?.lastmod!==date))throw Error('Published sitemaps differ from verified build');
  const status=await(await get(fetcher,'/api/v1/status')).json();if(status.model_calls!==false||status.hosted_execution!==false)throw Error('Public API status changed unexpectedly');
  const mcp=await(await get(fetcher,'/mcp',{method:'POST',headers:{'content-type':'application/json',accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list',params:{}})})).json();
  const names=(mcp.result?.tools??[]).map(tool=>tool.name);if(!['plan_workflow','prepare_workflow','get_item'].every(name=>names.includes(name))||names.length<9)throw Error('Public MCP tool list incomplete');
  const item=fs.readdirSync(path.join(root,'site/dist/skills')).find(name=>/^[a-z0-9-]+\.html$/.test(name));
  const headerRoutes=await checkHeaders(fetcher,headerRules(item?'/skills/'+item.slice(0,-5):null));
  await assertComposerActive(fetcher);return {urls:remote.size,tools:names.length,exactRoutes:routes.length,headerRoutes};
}
function execute(root,step,{capture=false}={}){
  const [name,command,args,folder]=step;console.log(name);
  // Only these fixed npm/npx command arrays use the Windows command processor.
  const windows=process.platform==='win32'&&['npm','npx'].includes(command);
  const result=spawnSync(command,args,{cwd:path.resolve(root,folder),shell:windows,env:{...process.env,CI:'true',GIT_TERMINAL_PROMPT:'0',CATALOGUE_EVAL_REPORTS:process.env.CATALOGUE_EVAL_REPORTS||path.join(os.tmpdir(),'aiblocks-search-eval')},stdio:capture?'pipe':'inherit',encoding:'utf8',maxBuffer:16<<20});
  if(capture){if(result.stdout)process.stdout.write(result.stdout);if(result.stderr)process.stderr.write(result.stderr);}return result;
}
export async function release({deploy=false,root=REPO,fetcher=fetch}={}){
  let source=null;if(deploy){source=cleanSource(root);deploymentConfig(root);pushedSource(root,source);await assertComposerActive(fetcher);}
  await runSteps(gateSteps,step=>execute(root,step));
  const carried=deploy?carryForwardAssets(root):null;
  const inventory=buildInventory(root);
  if(!deploy){console.log(JSON.stringify({gates:'passed',inventory,next:'Review and commit any generated changes, push the source, then run node tools/release.mjs --deploy.'},null,2));return;}
  if(cleanSource(root)!==source)throw Error('Source changed during checks');deploymentConfig(root);pushedSource(root,source);await assertComposerActive(fetcher);
  const stamps=JSON.parse(fs.readFileSync(path.join(root,'site/dist/data/content-fingerprints.json')));if(stamps.dirty!==false||stamps.source_commit!==source)throw Error('Uncommitted or mismatched build');
  const previous=liveVersion(execute(root,['Read live version','npx',['wrangler','deployments','status','--json','-c','wrangler.production.jsonc'],'site'],{capture:true}).stdout??'');
  const deployed=execute(root,['Deploy production','npx',['wrangler','deploy','-c','wrangler.production.jsonc'],'site'],{capture:true});if(deployed.status!==0)throw Error('Production deployment failed; state was not advanced');
  const version=deployed.stdout?.match(/Current Version ID:\s*([a-f0-9-]{36})/)?.[1];if(!version)throw Error('Cannot identify deployed version; inspect deployment before advancing state');
  // Fixed arguments only: on Windows these pass through the command processor.
  const live=await verifyOrRollBack({check:()=>checkPublishedBuild({root,source,fetcher}),previous,rollBack:id=>execute(root,['Roll back production','npx',['wrangler','rollback',id,'-c','wrangler.production.jsonc','-m','live-check-failed','-y'],'site'])});
  const remembered=rememberAssets(root,version,Date.now(),carried?.names);
  await runSteps([['Notify IndexNow of changed URLs',process.execPath,['tools/indexnow-ping.mjs'],'.']],step=>execute(root,step));
  const file='tools/indexnow-state.json';if(git(root,['status','--porcelain']).toString().trim()!=='M '+file||git(root,['diff','--cached','--name-only']).toString().trim())throw Error('Only the verified IndexNow state may be committed');
  const state=JSON.parse(worktreeText(root,file));if(state.source_commit!==source||state.count!==live.urls||Object.keys(state.fingerprints??{}).length!==live.urls)throw Error('Unexpected publication state');
  git(root,['add','--',file]);git(root,['-c','core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol','diff','--cached','--check']);
  git(root,['commit','-m','Remember verified production content fingerprints','-m',`Save changed-URL publication state after deploy ${version}.\n\n${ATTRIBUTION}`]);
  git(root,['-c','credential.interactive=false','push','origin','HEAD'],{env:{...process.env,GIT_TERMINAL_PROMPT:'0'}});
  console.log(JSON.stringify({source,deployment:version,previous,stateCommit:git(root,['rev-parse','HEAD']).toString().trim(),inventory,carriedAssets:carried&&{files:carried.files,builds:carried.builds},rememberedAssets:remembered,live},null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2);
  if(args.length>1||args.some(arg=>arg!=='--deploy')){console.error('Usage: node tools/release.mjs [--deploy]');process.exitCode=1;}
  else release({deploy:args.includes('--deploy')}).catch(error=>{console.error('Release stopped: '+error.message);process.exitCode=1;});
}
