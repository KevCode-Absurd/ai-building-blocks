import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root=path.resolve(process.env.CF_RELEASE_DIST||'site/dist'),files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push({path:path.relative(root,p).replaceAll('\\','/'),bytes:fs.statSync(p).size});}}
walk(root);
const fileLimit=100000, buildBuffer=95000;
assert(files.length<=buildBuffer,`Too many files for Workers Paid safety guard: ${files.length}`);
const large=files.filter(f=>f.bytes>25*1024*1024);assert.equal(large.length,0,'Files exceed the Workers Static Assets per-file limit');
for(const f of ['index.html','404.html','compose.html','shared-space-shell.html','_routes.json','_headers','_redirects','robots.txt','data/blocks.json','example-app/index.html','apps.html','apps/starter-pack.html','skills/website-brand-brain-builder/SKILL.md'])assert(fs.existsSync(path.join(root,f)),`Missing ${f}`);
for(const rule of ['/space / 200','/people / 200','/s/* /shared-space-shell 200'])assert(fs.readFileSync(path.join(root,'_redirects'),'utf8').includes(rule),`Missing Workers rewrite: ${rule}`);
const routes=JSON.parse(fs.readFileSync(path.join(root,'_routes.json'),'utf8').replace(/^\uFEFF/,''));assert.deepEqual(routes.include,['/api/*']);
assert(fs.readFileSync(path.join(root,'example-app/index.html'),'utf8').includes('noindex'));
assert(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Disallow: /example-app/'));
assert(!fs.readFileSync(path.join(root,'sitemap-pages.xml'),'utf8').includes('example-app'));
const migrations=['0001_comments.sql','0002_spaces.sql','0004_composer.sql','0005_composer_accounts.sql'];
for(const f of ['site/functions/api/comments.ts','site/functions/api/spaces/[[path]].ts','site/functions/api/compose.ts',...migrations.map(f=>'site/migrations/'+f)])assert(fs.existsSync(f),`Missing ${f}`);
const template=JSON.parse(fs.readFileSync('site/wrangler.example.jsonc','utf8'));
assert.equal(template.main,'src/worker.ts');
assert.equal(template.assets.directory,'./dist');
assert.equal(template.assets.binding,'ASSETS');
assert.equal(template.assets.not_found_handling,undefined,'Unknown routes must reach canonical repair/custom 404 handling');
assert(template.compatibility_flags.includes('assets_navigation_has_no_effect'));
assert.equal(template.assets.html_handling,'auto-trailing-slash');
assert.deepEqual(template.assets.run_worker_first,['/api','/api/*']);
assert(fs.readFileSync(path.join(root,'.assetsignore'),'utf8').includes('_routes.json'));
for(const binding of ['COMMENTS','SPACES','COMPOSER'])assert(template.d1_databases.some(db=>db.binding===binding&&db.migrations_dir==='migrations'),`Missing D1 binding ${binding}`);
assert.equal(template.vars.WORKFLOW_COMPOSER_ENABLED,'false','Enable paid AI only after preview verification');
assert.equal(template.vars.WORKFLOW_DAILY_CAP_USD,'2');
const cat=JSON.parse(fs.readFileSync(path.join(root,'data/blocks.json'),'utf8'));
for(const b of cat.blocks){
  for(const f of [`skills/${b.slug}/SKILL.md`,`data/pages/${b.slug}.json`,...(b.hasFiles?[`skills/${b.slug}.zip`]:[])])assert(fs.existsSync(path.join(root,f)),`Incomplete published assets: ${f}`);
}
const expected={'landing-page-30-point-checker':'Landing page audit','website-brand-brain-builder':'Brand profile builder','ad-claim-proof-gap-finder':'Ad claims checker','ad-opening-line-batch-writer':'Ad hook writer'};
for(const [slug,name]of Object.entries(expected))assert.equal(cat.blocks.find(b=>b.slug===slug)?.name,name);
const critical=['index.html','_redirects','_headers','.assetsignore','data/blocks.json','example-app/index.html'].map(f=>({path:f,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')}));
const report={preparedOn:'2026-10-22',launchTarget:'2026-10-22',status:'local-build-ready-for-workers-integration',productionDeploymentPerformed:false,deploymentTarget:'Workers Static Assets',workersPlan:{recommended:'Workers Paid Standard',minimumMonthlyUSD:5,subscriptionVerified:false,staticHosting:'Workers Static Assets',usageOveragesPossible:true},migrations,files:files.length,fileLimit,freeFileLimit:20000,buildBuffer,remainingBeforeBuffer:buildBuffer-files.length,totalBytes:files.reduce((n,f)=>n+f.bytes,0),largestFiles:files.sort((a,b)=>b.bytes-a.bytes).slice(0,5),publishedEntries:cat.blocks.length,checks:{requiredFiles:true,exampleSameOrigin:true,exampleNoindex:true,apiOnlyWorker:true,custom404:true,maximumFileSize:true,editorialNames:true,composerBindingTemplate:true,paidAIDisabledByDefault:true},criticalAssets:critical,requiredAtIntegration:['Authenticate the intended Cloudflare account and verify Workers Paid subscription','Replace production/staging D1 placeholders; keep staging separate','Apply all listed migrations; preserve COMMENTS/SPACES/COMPOSER bindings and existing salts','Copy comments/spaces secrets; add WORKFLOW_SALT and chosen provider API secret for AI','Verify staging Worker URL and measured performance before custom-domain cutover','Verify Cloudflare-managed DNS, domain/TLS and production data continuity']};
fs.writeFileSync('reports/cloudflare-launch-readiness.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,files:report.files,remainingBeforeBuffer:report.remainingBeforeBuffer}));
