// Bounded local executor for mechanical checks, never a model or build runner.
// Pages are served from explicitly selected immutable bytes. External page
// HTTP(S) and WebSocket requests are blocked. No shell commands or paid calls.
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {FILE_EVIDENCE_SCHEMA,verifyDeliveryEvidence,readLocalEvidenceBytes,isEvidencePath} from './verify-delivery-evidence.mjs';
import {preflightNativeExecution} from '../site/src/jobs/native-execution.mjs';

const require=createRequire(new URL('../site/package.json',import.meta.url));
const list=value=>Array.isArray(value)?value:[];
const text=value=>typeof value==='string'&&value.trim().length>0;
const mime=file=>({'.html':'text/html; charset=utf-8','.htm':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon'})[path.extname(file).toLowerCase()]??'application/octet-stream';
const issue=(code,at,message)=>({code,path:at,message});

function validateInspection(manifest) {
 const errors=[];
 if(!manifest||manifest.schema!=='ai-blocks-native-inspection/1')errors.push(issue('INVALID_SCHEMA','schema','Use ai-blocks-native-inspection/1.'));
 if(!manifest?.files||manifest.files.schema!==FILE_EVIDENCE_SCHEMA)errors.push(issue('INVALID_FILES','files','Include an ai-blocks-file-evidence/1 manifest with exact current hashes.'));
 const artifacts=list(manifest?.files?.artifacts),sources=list(manifest?.files?.sources),ids=new Map([...artifacts,...sources].map(row=>[row?.id,row]));
 const inspected=new Set();
 for(const [index,row] of list(manifest?.images).entries()) {
  const at=`images[${index}]`;
  if(!artifacts.some(file=>file?.id===row?.id)||inspected.has(row?.id))errors.push(issue('INVALID_IMAGE',at,'Select each raster artifact exactly once by its file-evidence artifact ID.'));
  inspected.add(row?.id);
  for(const field of ['width','height'])if(row?.[field]!==undefined&&(!Number.isSafeInteger(row[field])||row[field]<1||row[field]>16384))errors.push(issue('INVALID_DIMENSIONS',`${at}.${field}`,'Expected dimensions must be positive whole numbers up to 16384.'));
 }
 for(const [index,row] of list(manifest?.pages).entries()) {
  const at=`pages[${index}]`;
  if(!artifacts.some(file=>file?.id===row?.id&&/\.html?$/i.test(file.path??''))||inspected.has(row?.id))errors.push(issue('INVALID_PAGE',at,'Select an actual HTML source artifact once; images, URLs and bundles need a different host executor.'));
  inspected.add(row?.id);
  if(!Array.isArray(row?.serve)||!row.serve.includes(row.id)||new Set(row.serve).size!==row.serve.length||row.serve.some(id=>!ids.has(id)))errors.push(issue('INVALID_SERVE',`${at}.serve`,'Explicitly list every source/artifact ID the preview may serve, including the HTML entrypoint. Receipts are not served.'));
  if(row.primary_action!==undefined&&(!text(row.primary_action?.selector)||!text(row.primary_action?.expected_visible)||row.primary_action.selector.length>500||row.primary_action.expected_visible.length>500))errors.push(issue('INVALID_ACTION',`${at}.primary_action`,'Provide bounded CSS selectors for the action and the local element expected to become visible after clicking.'));
 }
 if(!inspected.size)errors.push(issue('EMPTY_INSPECTION','$','Select at least one actual raster image or static HTML page to inspect.'));
 if(list(manifest?.images).length>100||list(manifest?.pages).length>20)errors.push(issue('INSPECTION_LIMIT','$','Inspect at most 100 images and 20 pages per run.'));
 return errors;
}

async function inspectRaster(bytes,row) {
 const sharp=require('sharp');
 const image=sharp(bytes,{limitInputPixels:40*1000*1000,failOn:'warning'}),metadata=await image.metadata();
 if(!['png','jpeg','webp','avif','heif','gif','tiff'].includes(metadata.format)||!metadata.width||!metadata.height)throw Error('The selected file is not a supported raster image.');
 // Metadata alone can accept a truncated raster. Decode the pixels as well.
 await image.resize({width:1,height:1,fit:'inside'}).raw().toBuffer();
 return {id:row.id,status:(row.width===undefined||row.width===metadata.width)&&(row.height===undefined||row.height===metadata.height)?'PASS':'FAIL',format:metadata.format,width:metadata.width,height:metadata.height,checks:[{id:'raster_decode',status:'PASS',observed:'Raster bytes decoded successfully.'},{id:'requested_dimensions',status:(row.width===undefined||row.width===metadata.width)&&(row.height===undefined||row.height===metadata.height)?'PASS':'FAIL',observed:`Observed ${metadata.width} × ${metadata.height}; expected ${row.width??'unspecified'} × ${row.height??'unspecified'}.`}],not_checked:['brand','product_fidelity','claims_copy','aesthetic_quality','generation_provenance']};
}

async function inspectPage({row,files,browser}) {
 const served=new Map(row.serve.map(id=>[files.get(id).path,files.get(id)])),entry=files.get(row.id),requests=[],blocked=[];
 const server=http.createServer((request,response)=>{
  if(request.method!=='GET'&&request.method!=='HEAD'){response.writeHead(405);response.end();return;}
  let relative;try{relative=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname).slice(1);}catch{response.writeHead(400);response.end();return;}
  const file=served.get(relative);
  if(!file){if(requests.length<30)requests.push(relative);response.writeHead(404);response.end();return;}
  response.writeHead(200,{'Content-Type':mime(file.path),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});response.end(request.method==='HEAD'?undefined:file.data);
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const origin=`http://127.0.0.1:${server.address().port}`,context=await browser.newContext({serviceWorkers:'block',acceptDownloads:false}),checks=[];
 const deadline=setTimeout(()=>{void context.close().catch(()=>{});},30000);
 try {
  await context.route('**/*',route=>{
   const url=route.request().url();
   if(url.startsWith(origin+'/'))return route.continue();
   if(blocked.length<30)blocked.push(url.slice(0,500));
   return route.abort('blockedbyclient');
  });
  // WebSocket traffic is a separate transport from ordinary request routing.
  await context.routeWebSocket('**/*',socket=>socket.close());
  const page=await context.newPage();page.setDefaultTimeout(5000);page.setDefaultNavigationTimeout(10000);
  const pageErrors=[];page.on('pageerror',error=>{if(pageErrors.length<20)pageErrors.push(error.message.slice(0,500));});
  for(const viewport of [{width:390,height:844},{width:1440,height:900}]) {
   await page.setViewportSize(viewport);
   await page.goto(`${origin}/${entry.path}`,{waitUntil:'load'});
   const observed=await page.evaluate(()=>({title:document.title,body_text:document.body?.innerText.trim().length??0,overflow:document.documentElement.scrollWidth>window.innerWidth+1,broken_images:[...document.images].filter(image=>!image.complete||image.naturalWidth===0).length}));
   checks.push({id:'responsive_overflow',viewport,status:!observed.overflow&&observed.body_text>0?'PASS':'FAIL',observed});
   checks.push({id:'loaded_images',viewport,status:observed.broken_images===0?'PASS':'FAIL',observed:`${observed.broken_images} broken or unfinished image loads.`});
  }
  if(row.primary_action) {
   await page.goto(`${origin}/${entry.path}`,{waitUntil:'load'});
   const expected=page.locator(row.primary_action.expected_visible);
   if(await expected.isVisible())throw Error('The expected action result was already visible before the interaction; provide a meaningful state transition.');
   const target=page.locator(row.primary_action.selector);await target.focus();
   const focused=await target.evaluate(element=>element===document.activeElement);
   await target.click();await page.locator(row.primary_action.expected_visible).waitFor({state:'visible'});
   checks.push({id:'local_primary_action',status:focused?'PASS':'FAIL',observed:`Clicked ${row.primary_action.selector}; ${row.primary_action.expected_visible} became visible; keyboard focus ${focused?'reached':'did not reach'} the action.`});
  } else checks.push({id:'local_primary_action',status:'NOT_RUN',observed:'No explicit local interaction was supplied. This run does not establish a functional buyer action.'});
  checks.push({id:'offline_assets',status:requests.length===0&&blocked.length===0?'PASS':'FAIL',observed:{missing_local_paths:requests,blocked_external_urls:blocked}});
  checks.push({id:'browser_errors',status:pageErrors.length===0?'PASS':'FAIL',observed:pageErrors});
  return {id:row.id,status:checks.some(check=>check.status==='FAIL')?'FAIL':checks.some(check=>check.status==='NOT_RUN')?'PARTIAL':'PASS',source_files:[...served.values()].map(file=>({id:file.id,path:file.path,sha256:file.sha256})),checks,not_checked:['project_build','backend_or_checkout','complete_keyboard_accessibility','brand_content','visual_quality','owner_acceptance']};
 } finally {clearTimeout(deadline);await context.close();await new Promise(resolve=>server.close(resolve));}
}

/** Execute only fixed mechanical checks against declared, hash-verified files.
 * Does not issue generation/build commands or mark a whole deliverable ready. */
export async function inspectNativeDelivery({root,manifest,browserChannel='chrome'}={}) {
 const report={schema:'ai-blocks-native-inspection-result/1',status:'FAIL',assurance:'LOCAL_NATIVE_CHECKS_SEMANTICS_UNVERIFIED',model_calls:0,paid_calls:0,images:[],pages:[],errors:validateInspection(manifest),verification_limit:'Actual bytes and selected mechanical checks only. This does not establish generation provenance, brand/product fidelity, full accessibility, integration, launch readiness or owner acceptance. Use the native delivery contract and independent semantic review.'};
 if(report.errors.length)return report;
 report.file_evidence=await verifyDeliveryEvidence({root,manifest:manifest.files,limits:{max_files:200,max_file_bytes:16*1024*1024,max_total_bytes:64*1024*1024}});
 if(report.file_evidence.status!=='PASS'){report.errors.push(issue('FILE_EVIDENCE_FAILED','files','Repair file evidence before native inspection.'));return report;}
 const files=new Map();
 try {
  for(const row of [...manifest.files.artifacts,...list(manifest.files.sources)]) {
   const observed=await readLocalEvidenceBytes({root,file:row.path,max_bytes:16*1024*1024});
   if(observed.sha256!==row.sha256)throw Error('Selected file changed before inspection.');
   files.set(row.id,{...row,data:observed.data});
  }
  for(const row of list(manifest.images)) {
   try{report.images.push({...await inspectRaster(files.get(row.id).data,row),sha256:files.get(row.id).sha256});}
   catch(error){report.images.push({id:row.id,status:'FAIL',sha256:files.get(row.id).sha256,error:error.message});}
  }
  if(list(manifest.pages).length) {
   const {chromium}=require('@playwright/test');let browser;
   try {
    browser=await chromium.launch({...(browserChannel?{channel:browserChannel}:{}),headless:true,args:['--disable-background-networking','--disable-quic','--force-webrtc-ip-handling-policy=disable_non_proxied_udp']});
    for(const row of manifest.pages)try{report.pages.push(await inspectPage({row,files,browser}));}catch(error){report.pages.push({id:row.id,status:'FAIL',error:error.message});}
   } finally {if(browser)await browser.close();}
  }
 } catch(error) {report.errors.push(issue('EXECUTOR_UNAVAILABLE_OR_FAILED','$',error.message));}
 const inspected=[...report.images,...report.pages];
 report.status=report.errors.length||inspected.some(row=>row.status==='FAIL')?'FAIL':inspected.some(row=>row.status==='PARTIAL')?'PARTIAL':'PASS';
 report.inspected_at=new Date().toISOString();
 return report;
}

export async function runNativeInspectionCLI(argv,{stdout=process.stdout,stderr=process.stderr}={}) {
 try {
  const [mode,...args]=argv,options={};
  if(!['inspect','preflight'].includes(mode))throw Error('Use inspect or preflight with --root <absolute authorized directory> --manifest <relative JSON>.');
  for(let index=0;index<args.length;index++) {
   const key=args[index];if(!['--root','--manifest','--browser'].includes(key)||options[key]!==undefined||!args[index+1]||args[index+1].startsWith('--'))throw Error('Invalid CLI arguments.');
   options[key]=args[++index];
  }
  if(!options['--root']||!isEvidencePath(options['--manifest']))throw Error('An explicit absolute root and safe relative manifest path are required.');
  const input=await readLocalEvidenceBytes({root:options['--root'],file:options['--manifest'],max_bytes:2*1024*1024}),manifest=JSON.parse(input.content);
  // The CLI has no paid option. Paid execution is never authorised by a file.
  const report=mode==='preflight'?preflightNativeExecution({...manifest,allow_paid:false}):await inspectNativeDelivery({root:options['--root'],manifest,browserChannel:options['--browser']??'chrome'});
  report.input={path:options['--manifest'],sha256:input.sha256};stdout.write(JSON.stringify(report,null,2)+'\n');
  return ['PASS','READY_FOR_HOST_EXECUTION','NOT_REQUIRED'].includes(report.status)?0:1;
 } catch(error){stderr.write(`Native delivery adapter failed: ${error.message}\n`);return 2;}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))process.exitCode=await runNativeInspectionCLI(process.argv.slice(2));
