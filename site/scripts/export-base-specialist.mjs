// Local export using exactly the browser/REST pack builder. No model or network calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {buildBaseSpecialistPack} from '../src/roles/base-specialist-pack.ts';
const args=process.argv.slice(2);
if(args.length!==4||args[0]!=='--role'||args[2]!=='--out'||!/^[a-z0-9][a-z0-9-]{0,69}$/.test(args[1]))throw Error('Use --role SPECIALIST_ID --out OUTPUT_DIRECTORY.');
const root=fileURLToPath(new URL('../public/',import.meta.url)),output=path.resolve(args[3]);
const read=async(p,max,expected)=>{
 if(!p.startsWith('/')||p.startsWith('//')||p.includes('..')||/[\\?#%]/.test(p))throw Error('Invalid asset path.');
 const b=await fs.readFile(path.join(root,p.slice(1)));
 if(b.length>max||expected&&(b.length!==expected.bytes||createHash('sha256').update(b).digest('hex')!==expected.sha256))throw Error('Published asset verification failed: '+p);
 return b;
};
const json=async p=>JSON.parse(new TextDecoder().decode(await read(p,16_000_000)));
const role=await json('/data/roles/'+args[1]+'.json'),catalogue=await json('/data/blocks.json'),manifest=await json('/data/public-api-manifest.json');
if(createHash('sha256').update(await read('/data/blocks.json',12_000_000)).digest('hex')!==manifest.catalogue_sha256)throw Error('Catalogue hash mismatch.');
const pack=await buildBaseSpecialistPack(role,catalogue,manifest,read);
await fs.mkdir(output,{recursive:true});await fs.writeFile(path.join(output,pack.filename),pack.bytes);
console.log(JSON.stringify({file:path.join(output,pack.filename),bytes:pack.bytes.length,files:pack.fileCount,methods:pack.methodCount,sha256:createHash('sha256').update(pack.bytes).digest('hex'),private_context:false}));
