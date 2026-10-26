// UI3 release validation only. Importing this module does not read credentials or make requests.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
export const PRODUCTION = 'https://useaiblocks.com';
export const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
export const fingerprint = value => sha(JSON.stringify(canonical(value)));
export const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'));
export const samePath = (a,b) => path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
export const inside = (parent, file) => { const r=path.relative(parent,file); return r && !r.startsWith('..') && !path.isAbsolute(r); };
export const safeRelative = file => typeof file==='string' && file && !/[\\:]/.test(file) && !file.startsWith('/') && file.split('/').every(part=>part && part!=='.' && part!=='..');
export function argsOf(argv, allowed) { const out={}; for(let i=0;i<argv.length;i++){const key=argv[i];assert(allowed.includes(key) && !(key in out),'Unsupported or repeated argument: '+key);out[key]=key==='--execute'?true:argv[++i];assert(out[key]&&!String(out[key]).startsWith('--'),'Missing argument: '+key);}return out; }
const cachePath = file => file.split('/').some(part=>['node_modules','.git','.vite','.cache','.wrangler','vite-cache'].includes(part)) || file.endsWith('.tsbuildinfo');
export async function inventory(root,{source=false,excludePublic=false}={}) {
  root=path.resolve(root);const files=[];
  async function walk(folder,prefix=''){for(const item of await fs.readdir(folder,{withFileTypes:true})){const file=prefix+item.name;if(source&&(cachePath(file)||excludePublic&&file==='site/public'))continue;assert(!item.isSymbolicLink(),'Unexpected frozen junction: '+file);assert(!/(?:^|\/)\.env(?:\.[^/]*)?$/.test(file),'Private environment file in release: '+file);if(item.isDirectory())await walk(path.join(folder,item.name),file+'/');else if(item.isFile())files.push(file);}}
  await walk(root);const map={};let next=0;
  await Promise.all(Array.from({length:20},async()=>{while(next<files.length){const file=files[next++];assert(safeRelative(file));map[file]=sha(await fs.readFile(path.join(root,file)));}}));
  return Object.fromEntries(Object.entries(map).sort(([a],[b])=>a.localeCompare(b)));
}
export const normalizeConfig = value => { const next=structuredClone(value);delete next.main;if(next.assets)delete next.assets.directory;return next; };
export const effectiveSettings = value => { const next=structuredClone(value);delete next.annotations;return next; };
export const bindingFingerprints = value => value.bindings.map(binding=>({name:binding.name,sha256:fingerprint(binding)})).sort((a,b)=>a.name.localeCompare(b.name));
export const entryRefs = html => {const script=html.match(/<script\b(?=[^>]*type="module")[^>]*src="([^"]+)"/)?.[1]??html.match(/<link\b(?=[^>]*rel="modulepreload")(?=[^>]*\bdata-home-entry(?:\s|>))[^>]*href="([^"]+)"/)?.[1],css=html.match(/<link\b(?=[^>]*rel="stylesheet")[^>]*href="([^"]+)"/)?.[1];assert(script?.startsWith('/assets/')&&css?.startsWith('/assets/'));return[script,css];};
const preloadPattern=/<!-- The library list starts downloading alongside the code instead of after it\. -->\s*<script>[\s\S]*?<\/script>/g;
const preloadBlock=html=>{const blocks=html.match(preloadPattern);assert.equal(blocks?.length,1);return blocks[0];};
const stripHelp=html=>html.replace(/<!-- USABILITY_HELP_START -->[\s\S]*?<!-- USABILITY_HELP_END -->/g,'');
const OVERLAY = new Set(['site/index.html','site/src/App.tsx','site/src/PageRecovery.tsx','site/src/navigation-usability.css','site/src/lib/library-search.ts','site/src/lib/library-search-worker.ts','site/src/HowItWorks.tsx','site/src/IntakePage.tsx','site/src/intake-layout.css','site/src/contextual-help.css','site/src/BlockPage.tsx','site/src/task-simplicity.css','site/src/Builder.tsx','site/src/BuilderParts.tsx','site/src/workflow-simplicity.css','site/src/ComposePage.tsx','site/src/compose.css','site/scripts/build-usability-help.mjs']);
export function validateContract(m,plan,root){
  assert.equal(m.schema,'abb-usability-release/1');assert.equal(plan.schema,'abb-usability-release-plan/1');assert.equal(plan.approvedForBuild,true);
  assert.equal(m.status,'built-not-deployed');assert.equal(m.deploymentAuthorized,false);assert.equal(m.stagingDeploymentAllowed,false);
  for(const key of ['contentRegenerated','backendCompiled','migrationsRun'])assert.equal(m[key],false);
  for(const key of ['providerCalls','databaseWrites'])assert.equal(m[key],0);
  assert(samePath(root,m.root)&&samePath(root,plan.root));assert(samePath(m.previous,plan.baseline.root));assert.equal(m.previousVersionId,plan.baseline.versionId);
  assert.equal(m.minds,505);assert.equal(plan.baseline.expectedMinds,505);assert.equal(m.staticChecks.status,'pass');
  assert.deepEqual([...m.targetedHelp].sort(),['from-a-source.html','how-it-works.html']);
}
export async function validateUsabilityRelease(manifestFile){
  const file=path.resolve(manifestFile),root=path.dirname(file),manifestBytes=await fs.readFile(file),m=JSON.parse(manifestBytes);
  assert.equal(path.basename(file),'release-manifest.json');assert(samePath(root,m.root));
  const planBytes=await fs.readFile(path.join(root,'review-plan.json')),plan=JSON.parse(planBytes);validateContract(m,plan,root);assert.equal(sha(planBytes),m.reviewPlanSha256);
  const source=path.join(root,'source'),assets=path.join(root,'assets');assert(samePath(source,m.source)&&samePath(assets,m.assets));
  assert(!samePath(root,m.previous)&&!inside(m.previous,root)&&!inside(root,m.previous),'Predecessor and candidate must be independent roots.');
  const baselineRoot=path.resolve(plan.baseline.root),baselineAssets=path.join(baselineRoot,'assets'),baselineSource=path.join(baselineRoot,'source');
  const baselineManifestBytes=await fs.readFile(path.join(baselineRoot,'release-manifest.json'));assert.equal(sha(baselineManifestBytes),plan.baseline.manifestSha256);assert.equal(m.baselineManifestSha256,plan.baseline.manifestSha256);
  const [hashes,sourceHashes,baseHashes,baseSourceHashes]=await Promise.all([inventory(assets),inventory(source,{source:true}),inventory(baselineAssets),inventory(baselineSource,{source:true,excludePublic:true})]);
  assert.deepEqual(hashes,await readJson(path.join(root,'asset-hashes.json')));assert.equal(fingerprint(hashes),m.assetFingerprint);assert.equal(Object.keys(hashes).length,m.files);
  assert.deepEqual(sourceHashes,m.sourceHashes);assert.equal(fingerprint(sourceHashes),m.sourceFingerprint);
  assert.deepEqual(baseHashes,await readJson(path.join(baselineRoot,'asset-hashes.json')));assert.equal(fingerprint(baseHashes),plan.baseline.assetFingerprint);assert.equal(fingerprint(baseHashes),m.baselineAssetFingerprint);
  assert.equal(fingerprint(baseSourceHashes),plan.baseline.sourceFingerprint);assert.equal(fingerprint(baseSourceHashes),m.baselineSourceFingerprint);
  assert.equal(m.sourcePublicMaterialization.independentCopy,true);assert.equal(m.sourcePublicMaterialization.junctionCopied,false);assert(samePath(m.sourcePublicMaterialization.from,baselineAssets));
  assert.equal(m.sourcePublicMaterialization.assetFingerprint,plan.baseline.assetFingerprint);assert(!(await fs.lstat(path.join(source,'site/public'))).isSymbolicLink());
  const overlay=m.reviewedOverlay,overlayBytes=await fs.readFile(overlay.inventoryFile),overlayInventory=JSON.parse(overlayBytes);assert(inside(root,path.resolve(overlay.inventoryFile)));
  assert.equal(sha(overlayBytes),overlay.inventorySha256);assert.equal(sha(overlayBytes),plan.overlay.inventorySha256);assert.equal(overlayInventory.schema,'abb-reviewed-usability-overlay/1');assert.equal(overlayInventory.status,'root-reviewed-source-frozen');
  assert.deepEqual(overlayInventory.files,plan.overlayHashes);assert.deepEqual(m.overlayHashes,plan.overlayHashes);assert.deepEqual(overlay.hashes,plan.overlayHashes);
  assert(Object.keys(plan.overlayHashes).every(file=>OVERLAY.has(file)));assert.equal(Object.keys(plan.overlayHashes).length,18);
  const deltas=Object.fromEntries(Object.entries(plan.overlayHashes).sort(([a],[b])=>a.localeCompare(b)).map(([file,after])=>[file,{before:baseSourceHashes[file]??null,after}]));
  assert.deepEqual(await readJson(overlay.deltaFile),deltas);assert.equal(sha(await fs.readFile(overlay.deltaFile)),overlay.deltaSha256);assert.deepEqual(Object.fromEntries(Object.entries(deltas).map(([file,v])=>[file,v.before])),plan.overlayBaselineHashes);
  const tc=m.reviewedLocalToolchain,tcBytes=await fs.readFile(tc.manifestFile),toolchain=JSON.parse(tcBytes);assert(inside(root,path.resolve(tc.manifestFile)));assert.equal(sha(tcBytes),tc.manifestSha256);assert.equal(tc.manifestSha256,plan.toolchain.inventorySha256);
  assert.equal(toolchain.schema,'abb-reviewed-local-toolchain/1');assert.equal(toolchain.status,'root-reviewed-local-input');assert.equal(toolchain.publicBaseline,false);assert.equal(tc.publicBaseline,false);
  const basePackageBytes=await fs.readFile(toolchain.baseFile),lockBytes=await fs.readFile(toolchain.lockFile);assert.equal(sha(basePackageBytes),toolchain.baseSha256);assert.equal(sha(lockBytes),toolchain.lockSha256);
  const descriptor=JSON.parse(basePackageBytes);assert(!descriptor.scripts.build.includes('build-usability-help.mjs'));descriptor.scripts.build+=' && node scripts/build-usability-help.mjs';
  const packageHash=sha(Buffer.from(JSON.stringify(descriptor,null,2)+'\n'));assert.equal(packageHash,tc.derivedPackageSha256);assert.equal(packageHash,toolchain.currentPackageSha256);
  const expectedSource={...baseSourceHashes,...plan.overlayHashes,'site/package.json':packageHash,'site/package-lock.json':sha(lockBytes),'site/scripts/build-usability-release.mjs':plan.builderSha256,...Object.fromEntries(Object.entries(baseHashes).map(([file,hash])=>['site/public/'+file,hash]))};assert.deepEqual(sourceHashes,expectedSource);
  const configFile=path.join(root,'wrangler.production.jsonc'),config=await readJson(configFile),baselineConfigBytes=await fs.readFile(path.join(baselineRoot,'wrangler.production.jsonc')),baselineConfig=JSON.parse(baselineConfigBytes);
  assert.equal(sha(baselineConfigBytes),plan.baseline.productionConfigSha256);assert.deepEqual(normalizeConfig(config),normalizeConfig(baselineConfig));assert.equal(fingerprint(normalizeConfig(config)),m.productionConfigurationFingerprint);
  const worker=path.join(root,'worker/worker.js');assert(samePath(config.main,worker)&&samePath(config.assets.directory,assets));assert.equal(config.no_bundle,true);assert.equal(config.name,'ai-building-blocks');
  assert.equal(sha(await fs.readFile(worker)),m.workerSha256);assert.equal(m.workerSha256,plan.baseline.workerSha256);assert.equal(sha(await fs.readFile(baselineConfig.main)),m.workerSha256);
  assert.equal(config.vars.PUBLIC_API_ENABLED,'true');assert.equal(config.vars.MCP_OAUTH_ENABLED,'true');assert.equal(config.vars.WORKFLOW_COMPOSER_ENABLED,'true');
  const settingsProof=m.liveSettingsBaseline,settingsBytes=await fs.readFile(settingsProof.manifestFile),settingsInventory=JSON.parse(settingsBytes),rawSettingsBytes=await fs.readFile(settingsProof.settingsFile),settings=JSON.parse(rawSettingsBytes);
  assert(inside(root,path.resolve(settingsProof.manifestFile))&&inside(root,path.resolve(settingsProof.settingsFile)));assert.equal(sha(settingsBytes),settingsProof.manifestSha256);assert.equal(sha(settingsBytes),plan.liveSettings.inventorySha256);
  assert.equal(settingsInventory.status,'pass');assert.equal(settingsInventory.productionVersionId,m.previousVersionId);assert.equal(settingsInventory.workerSha256,m.workerSha256);assert.equal(sha(rawSettingsBytes),settingsProof.settingsSha256);assert.equal(sha(rawSettingsBytes),settingsInventory.settingsSha256);
  assert.equal(fingerprint(effectiveSettings(settings)),settingsProof.effectiveSettingsFingerprint);assert.equal(settingsProof.effectiveSettingsFingerprint,settingsInventory.effectiveSettingsFingerprint);assert.deepEqual(bindingFingerprints(settings),settingsInventory.bindings);assert.equal(settings.bindings.length,22);assert.equal(settingsProof.bindings,22);
  const preload=preloadBlock(await fs.readFile(path.join(source,'site/index.html'),'utf8'));assert.equal(sha(preload),m.earlyPreloadSha256);assert.deepEqual(entryRefs(await fs.readFile(path.join(baselineAssets,'index.html'),'utf8')),m.oldRefs);assert.deepEqual(entryRefs(await fs.readFile(path.join(assets,'index.html'),'utf8')),m.newRefs);
  for(const [file,before] of Object.entries(baseHashes)){
    if(!file.endsWith('.html')){assert.equal(hashes[file],before,'Preserved baseline content changed: '+file);continue;}
    const original=await fs.readFile(path.join(baselineAssets,file),'utf8');let expected=original;if(original.includes(m.oldRefs[0])){for(let i=0;i<m.oldRefs.length;i++)expected=expected.replaceAll(m.oldRefs[i],m.newRefs[i]);expected=expected.replace(preloadPattern,()=>preload);}
    const actual=await fs.readFile(path.join(assets,file),'utf8');if(m.targetedHelp.includes(file)){assert.equal(stripHelp(actual),stripHelp(expected));assert(actual.includes('<!-- USABILITY_HELP_START -->'));}else assert.equal(actual,expected,'Unreviewed HTML change: '+file);
  }
  for(const file of Object.keys(hashes).filter(file=>!baseHashes[file]))assert(/^assets\/[^/]+\.(?:js|css)$/.test(file),'Unexpected generated public content: '+file);
  assert.equal(hashes['data/blocks.json'],m.catalogueSha256);const catalogue=await readJson(path.join(assets,'data/blocks.json'));assert.equal(catalogue.minds.roster.length,505);
  const index=await readJson(path.join(assets,'data/library-search.json'));assert.equal(index.sourceHash,m.catalogueSha256);assert.equal(index.engineHash,sha(JSON.stringify({'library-search-core.ts':sourceHashes['site/src/lib/library-search-core.ts'],'library-search-intents.ts':sourceHashes['site/src/lib/library-search-intents.ts']})));
  const sv=m.searchValidation,semanticBytes=await fs.readFile(sv.file),semantic=JSON.parse(semanticBytes);assert(inside(root,path.resolve(sv.file)));assert.equal(sha(semanticBytes),sv.sha256);assert.equal(semantic.sourceHash,index.sourceHash);assert.equal(semantic.manifestHash,hashes['data/library-search.json']);assert.equal(semantic.corpusHash,index.corpusHash);assert.equal(semantic.engineHash,index.engineHash);assert.equal(sv.engineHash,index.engineHash);
  assert.equal(semantic.acceptance.total,24);assert.equal(semantic.acceptance.passed,24);assert(Array.isArray(semantic.acceptance.failed)?!semantic.acceptance.failed.length:semantic.acceptance.failed===0);assert.equal(semantic.precision.length,8);assert.equal(new Set(semantic.precision.map(x=>x.id)).size,8);assert(semantic.precision.every(x=>x.passed===true));assert.equal(sv.acceptancePassed,24);assert.equal(sv.precisionPassed,8);
  for(const shard of index.shards.files)assert.equal(hashes[shard.file.slice(1)],shard.sha256);
  return {file,root,manifest:m,manifestSha256:sha(manifestBytes),plan,source,assets,hashes,sourceHashes,baselineRoot,baselineAssets,baseHashes,configFile,config,worker,settings,settingsInventory,catalogue,index};
}
export async function validateApproval(release,reviewFile){
  const file=path.resolve(reviewFile);assert(!inside(release.root,file),'Root approval must be separate from immutable candidate.');const bytes=await fs.readFile(file),review=JSON.parse(bytes),m=release.manifest;
  assert.equal(review.schema,'abb-usability-root-review/1');assert.equal(review.approved,true);assert(samePath(review.root,release.root));
  assert.equal(review.manifestSha256,release.manifestSha256);for(const key of ['assetFingerprint','sourceFingerprint','workerSha256','previousVersionId','reviewPlanSha256'])assert.equal(review[key],m[key]);
  for(const kind of ['browser','visual','static'])assert(review.qaEvidence?.some(e=>e.kind===kind&&e.status==='pass'),'Missing passing '+kind+' evidence.');
  for(const e of review.qaEvidence){assert.equal(e.status,'pass');assert.equal(sha(await fs.readFile(e.file)),e.sha256);}
  for(const file of ['tools/deploy-usability-release.mjs','tools/check-usability-live.mjs','tools/usability-release-lib.mjs'])assert.equal(sha(await fs.readFile(file)),review.helperHashes[file],'Root must bind exact helper: '+file);
  const baseline=review.baselineVerification,baselineBytes=await fs.readFile(baseline.file),evidence=JSON.parse(baselineBytes);assert.equal(sha(baselineBytes),baseline.sha256);assert.equal(baseline.versionId,m.previousVersionId);assert.equal(evidence.versionId??evidence.productionVersionId,m.previousVersionId);assert(['pass','PASS','published-and-verified','PUBLISHED_AND_VERIFIED'].includes(evidence.status));
  for(const key of ['productionDeploymentReport','productionLiveReport']){assert(review[key]);const destination=path.resolve(review[key]);assert(inside(path.resolve('reports'),destination)&&destination.includes('usability'),'Use dedicated usability reports.');}
  assert(!samePath(review.productionDeploymentReport,review.productionLiveReport));return{file,review,sha256:sha(bytes)};
}
export async function cloudflareClient(config){
  const credential=await fs.readFile(path.join(process.env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8'),token=credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];assert(token,'Existing authenticated CLI credentials required.');
  assert(/^[a-f0-9]{32}$/.test(config.account_id)&&config.name==='ai-building-blocks');const base=`https://api.cloudflare.com/client/v4/accounts/${config.account_id}/workers/scripts/${config.name}`;
  const request=async route=>{const response=await fetch(base+route,{headers:{authorization:'Bearer '+token},signal:AbortSignal.timeout(30000)});assert(response.ok,'Cloudflare read failed: '+response.status);return response;};
  const api=async route=>{const data=await(await request(route)).json();assert.equal(data.success,true);return data.result;};
  const version=async()=>{const r=await api('/deployments'),versions=(r.deployments??r)[0].versions;assert.equal(versions.length,1);assert.equal(versions[0].percentage,100);return versions[0].version_id;};
  const workerHash=async()=>{const response=await request('/content/v2');if(/multipart\/form-data/i.test(response.headers.get('content-type')??'')){const form=await response.formData(),module=form.get('worker.js');assert(module&&typeof module.arrayBuffer==='function');return sha(Buffer.from(await module.arrayBuffer()));}return sha(Buffer.from(await response.arrayBuffer()));};
  return{api,version,workerHash};
}
