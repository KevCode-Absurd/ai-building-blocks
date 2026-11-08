import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {zipSync,strToU8} from 'fflate';

const repo=fileURLToPath(new URL('../../',import.meta.url));
export const NATIVE_TOOLKIT_ZIP=new URL('../public/packs/native-delivery-toolkit.zip',import.meta.url);
export const NATIVE_TOOLKIT_SOURCES=Object.freeze(['tools/inspect-native-delivery.mjs','tools/verify-delivery-evidence.mjs','site/src/jobs/native-execution.mjs','docs/NATIVE-DELIVERY-ADAPTER.md']);
const sha=value=>createHash('sha256').update(value).digest('hex');
const json=value=>JSON.stringify(value,null,2)+'\n';
const prefix='native-delivery-toolkit/';
const readme=`# AI Blocks native delivery toolkit

Download: https://useaiblocks.com/packs/native-delivery-toolkit.zip

This toolkit makes no model/API calls, uses no API keys and does not run project build scripts or generation. It checks actual local file bytes, raster decoding/dimensions and bounded offline static-page behaviour. It does not certify brand fidelity, launch readiness or business outcomes.

Requirements: Node.js 22+, npm, and installed Chrome (or Edge). Install the two pinned local dependencies from this extracted directory:

    npm --prefix site install

The install downloads ordinary npm packages; it does not buy or use model credits. Browser binaries are not bundled or installed by this toolkit. To use Edge add --browser msedge to inspection commands.

Run the included local fixture from this extracted directory:

    node tools/inspect-native-delivery.mjs inspect --root C:/absolute/path/to/native-delivery-toolkit --manifest examples/inspection.json

On macOS/Linux use your absolute extracted path for --root. The fixture is a small mechanical test only, not a landing-page design recommendation or evidence of model/output quality.

For your actual work, choose an explicitly authorized project root, create a manifest with actual hashes and list every local preview asset. Read docs/NATIVE-DELIVERY-ADAPTER.md. Do not copy private brand/project files into this toolkit's public download.

Before producing native files in a connected AI, check the actual host tools:

    node tools/inspect-native-delivery.mjs preflight --root C:/absolute/path/to/native-delivery-toolkit --manifest examples/preflight.json

The sample preflight intentionally returns BLOCKED because it has no host tools. Supply fresh actual tool availability receipts; do not invent availability. Paid tools are rejected by the CLI, even if a file tries to enable them.

SOURCE-MANIFEST.json hashes every other file in this archive. Reports go to stdout; nothing is saved automatically. Keep reports and project evidence private. PASS means only the enumerated mechanical checks passed; PARTIAL/FAIL return a nonzero exit code.
`;

export function nativeToolkitFiles() {
 const files={};
 for(const name of NATIVE_TOOLKIT_SOURCES)files[name]=new Uint8Array(fs.readFileSync(path.join(repo,name)));
 const sitePackage=JSON.parse(fs.readFileSync(path.join(repo,'site/package.json'),'utf8'));
 const versions=Object.fromEntries(['@playwright/test','sharp'].map(name=>[name,sitePackage.dependencies?.[name]??sitePackage.devDependencies?.[name]]));
 for(const [name,version] of Object.entries(versions))if(!/^\d+\.\d+\.\d+$/.test(version??''))throw Error(`Native toolkit dependency ${name} must have an exact pinned version.`);
 files['site/package.json']=strToU8(json({name:'ai-blocks-native-delivery-toolkit',version:'1.0.0',private:true,type:'module',engines:{node:'>=22'},dependencies:versions}));
 files['README.md']=strToU8(readme);
 const fixture='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Mechanical inspection fixture</title><style>body{font:16px system-ui;margin:24px;max-width:60ch}button{padding:12px}</style></head><body><h1>Local inspection fixture</h1><p>This is a test fixture, not a landing-page design or quality benchmark.</p><button id="show-details" onclick="document.querySelector(\'#details-panel\').hidden=false">Show fixture details</button><p id="details-panel" hidden>The local interaction worked.</p></body></html>\n';
 files['fixtures/example-page.html']=strToU8(fixture);
 files['examples/inspection.json']=strToU8(json({schema:'ai-blocks-native-inspection/1',files:{schema:'ai-blocks-file-evidence/1',artifacts:[{id:'page',path:'fixtures/example-page.html',sha256:sha(fixture)}]},pages:[{id:'page',serve:['page'],primary_action:{selector:'#show-details',expected_visible:'#details-panel'}}]}));
 files['examples/preflight.json']=strToU8(json({plan:{landing_pages:{requested:true,delivery_mode:'LAUNCHABLE_SITE'}},tools:[]}));
 files['SOURCE-MANIFEST.json']=strToU8(json({schema:'ai-blocks-native-toolkit/1',model_calls:0,paid_calls:0,fixture_use:'MECHANICAL_CHECKS_ONLY_NOT_QUALITY_EVIDENCE',files:Object.fromEntries(Object.entries(files).sort(([a],[b])=>a.localeCompare(b)).map(([name,bytes])=>[name,{bytes:bytes.length,sha256:sha(bytes)}]))}));
 return files;
}

export function nativeToolkitBytes() {
 const entries={},mtime=new Date(2026,0,1,0,0,0);
 for(const [name,bytes] of Object.entries(nativeToolkitFiles()).sort(([a],[b])=>a.localeCompare(b)))entries[prefix+name]=[bytes,{mtime}];
 return zipSync(entries,{level:9});
}

export function buildNativeDeliveryToolkit() {
 const bytes=nativeToolkitBytes();fs.mkdirSync(path.dirname(fileURLToPath(NATIVE_TOOLKIT_ZIP)),{recursive:true});
 if(!fs.existsSync(NATIVE_TOOLKIT_ZIP)||!Buffer.from(bytes).equals(fs.readFileSync(NATIVE_TOOLKIT_ZIP)))fs.writeFileSync(NATIVE_TOOLKIT_ZIP,bytes);
 return {status:'PASS',model_calls:0,bytes:bytes.length,output:'public/packs/native-delivery-toolkit.zip'};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(buildNativeDeliveryToolkit()));
