#!/usr/bin/env node
// Compare declared component-cost references; never infer supplier savings.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

export const INPUT_LIMIT = 262144;
const check=(ok,message)=>{if(!ok)throw Error(message);};
function object(x,allowed,label){check(x&&typeof x==='object'&&!Array.isArray(x),label+' must be an object');for(const k of Object.keys(x))check(allowed.includes(k),label+': unsupported key '+k);}
function text(x,label){check(typeof x==='string'&&x.trim().length>0&&x.length<=500&&!/[\u0000-\u001f\u007f]/.test(x),label+' needs bounded single-line text');return x;}
function decimal(x,label){
  // String input preserves declared decimal arithmetic, including equality boundaries.
  check(typeof x==='string'&&/^(?:0|[1-9]\d{0,6})(?:\.\d{1,6})?$/.test(x),label+' must be a nonnegative decimal string, at most 7 integer and 6 fractional digits');
  const [whole,fraction='']=x.split('.');return {n:BigInt(whole+fraction),d:10n**BigInt(fraction.length)};
}
const number=x=>Number(x.n)/Number(x.d);
const difference=(a,b)=>({n:a.n*b.d-b.n*a.d,d:a.d*b.d});
const relation=(a,b)=>{const d=a.n*b.d-b.n*a.d;return d<0n?'below':d>0n?'above':'equal to';};
const display=x=>number(x).toFixed(6).replace(/\.?0+$/,'')||'0';
function basis(x,label){
  check(typeof x.currency==='string'&&/^[A-Z]{3}$/.test(x.currency),label+'.currency must be a three-letter code');
  for(const k of ['unit','basisRef','sourceRef'])text(x[k],label+'.'+k);
  check(['confirmed','assumed','unknown'].includes(x.basisStatus),label+'.basisStatus must be confirmed, assumed or unknown');
}
export function compareShouldCost(input){
  object(input,['schema','material','quotes'],'input');check(input.schema==='should-cost-comparison-v1','Wrong schema');
  const m=input.material;object(m,['currency','unit','basisRef','basisStatus','sourceRef','netCost','scrapFractionOfGrossInput'],'material');basis(m,'material');
  const net=decimal(m.netCost,'material.netCost'),scrap=decimal(m.scrapFractionOfGrossInput,'material.scrapFractionOfGrossInput');
  check(scrap.n<scrap.d,'Scrap must be a fraction of gross input in [0,1)');
  const gross={n:net.n*scrap.d,d:net.d*(scrap.d-scrap.n)};
  check(Array.isArray(input.quotes)&&input.quotes.length>0&&input.quotes.length<=100,'Provide 1 to 100 quotes');
  const ids=new Set();
  const rows=input.quotes.map((q,i)=>{
    object(q,['id','currency','unit','basisRef','basisStatus','sourceRef','amount','commercialScope'],'quote '+i);basis(q,'quote '+i);text(q.id,'quote id');text(q.commercialScope,'commercialScope');check(!ids.has(q.id),'Duplicate quote id');ids.add(q.id);
    const amount=decimal(q.amount,'quote.amount');const reasons=[];
    for(const k of ['currency','unit','basisRef'])if(q[k]!==m[k])reasons.push(k+' differs');
    if(q.basisStatus==='unknown'||m.basisStatus==='unknown')reasons.push('product or monetary basis is unknown');
    const row={...q,status:reasons.length?'NOT_COMPARABLE':q.basisStatus==='assumed'||m.basisStatus==='assumed'?'CONDITIONAL_ARITHMETIC':'DECLARED_BASIS_ARITHMETIC',reasons,comparison:null,narrative:''};
    if(reasons.length){row.narrative=q.id+': no comparison; '+reasons.join('; ')+'.';return row;}
    const netRelation=relation(amount,net),grossRelation=relation(amount,gross);
    row.comparison={netMaterial:{amount:number(net),relation:netRelation,quoteMinusReference:number(difference(amount,net))},scrapAdjustedMaterial:{amount:number(gross),relation:grossRelation,quoteMinusReference:number(difference(amount,gross))}};
    row.narrative=`${q.id}: ${q.currency} ${q.amount} per ${q.unit} is ${netRelation} net material (${q.currency} ${m.netCost}) and ${grossRelation} scrap-adjusted material (approximately ${q.currency} ${display(gross)}). ${row.status==='CONDITIONAL_ARITHMETIC'?'This comparison depends on the declared assumed basis. ':' '}Commercial scope: ${q.commercialScope}. Component comparisons do not establish full-cost coverage, equivalent offers or savings.`;
    return row;
  });
  return {schema:'should-cost-comparison-result-v1',status:rows.some(x=>x.status==='NOT_COMPARABLE')?'HAS_UNCOMPARABLE_QUOTES':'ARITHMETIC_ONLY',material:{...m,scrapAdjustedCost:number(gross),calculation:'netCost / (1 - scrapFractionOfGrossInput)'},quotes:rows,
    arithmetic:'Relations use exact decimal fractions. Numeric amounts and differences use JavaScript number display; recurring gross costs are approximate. No currency conversion or quantity normalization.',
    limitations:'Inputs and source references are declarations, not authenticated evidence. Net material excludes scrap; scrap-adjusted material excludes labor, overhead, packaging, profit and logistics. Quotes can include different services or delivery terms. Neither component is a proven supplier minimum or a complete should-cost; assumptions and quote scope require reconciliation. This tool does not check final report prose.'};
}

export function runCli(args,root=process.cwd()){
  check(args.length===1,'Use node tools/should-cost-compare.mjs context/comparison.json; emits JSON to stdout only');
  const rel=args[0];check(typeof rel==='string'&&rel.length<=500&&!path.isAbsolute(rel)&&!/[\u0000-\u001f<>:"|?*]/.test(rel),'Use a safe relative input path');
  const parts=rel.replace(/\\/g,'/').split('/');check(parts.every(x=>x&&x!=='.'&&x!=='..'&&!/[. ]$/.test(x)&&!/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(x)),'Unsafe input path');
  const base=fs.realpathSync(root);let target=base;
  for(const part of parts){target=path.join(target,part);check(!fs.lstatSync(target).isSymbolicLink(),'Linked paths are not supported');const resolved=path.relative(base,fs.realpathSync(target));check(resolved&&resolved!=='..'&&!resolved.startsWith('..'+path.sep)&&!path.isAbsolute(resolved),'Input escapes project');}
  const stat=fs.statSync(target);check(stat.isFile()&&stat.size<=INPUT_LIMIT,'Input must be a bounded regular file');
  const bytes=fs.readFileSync(target);check(bytes.length<=INPUT_LIMIT,'Input exceeds byte limit');
  return {...compareShouldCost(JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,''))),inputSha256:createHash('sha256').update(bytes).digest('hex')};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{const result=runCli(process.argv.slice(2));console.log(JSON.stringify(result,null,2));if(result.status==='HAS_UNCOMPARABLE_QUOTES')process.exitCode=2;}
  catch(error){console.error(JSON.stringify({status:'ERROR',error:error.message}));process.exitCode=1;}
}
