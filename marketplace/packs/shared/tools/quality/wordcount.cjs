// Words a reader sees: strips markdown table pipes and markup; for HTML, visible text only.
// --raw counts the way an owner's word processor or `wc -w` does: every whitespace-separated token, tables and
//   markup included (for HTML, the visible text only).
// --limit N prints the share of the owner's word limit and fails only over the fail line. There is no target share:
//   stop when the job is done; length is judged by clarity and the owner's own limit.
//   The fail line is the owner's limit itself (100%); --fail-above P sets a tighter one an owner asked for, such as 95.
// Usage: node wordcount.cjs <file> [<compare-file>] [--raw] [--limit N [--fail-above P]]
// Exit 0 = counted, 1 = over the fail line of --limit, 2 = usage error or unreadable file.
const fs=require('fs');
// The visible count keeps its original HTML handling; the raw count also drops comments and &nbsp;.
const strip=(f,t)=>{if(!/\.html?$/i.test(f))return t;if(useRaw)t=t.replace(/<!--[\s\S]*?-->/g,' ');t=t.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ');return useRaw?t.replace(/&nbsp;/g,' '):t;};
const visible=t=>(t.replace(/[|#*_>`-]+/g,' ').match(/[A-Za-z0-9$%€£][^\s]*/g)||[]).length;
const raw=t=>(t.match(/\S+/g)||[]).length;
const usage='Usage: node wordcount.cjs <file> [<compare-file>] [--raw] [--limit N [--fail-above P]]';
const argv=process.argv.slice(2),files=[];let useRaw=false,limit=null,failAbove=100;
for(let i=0;i<argv.length;i++){
  const a=argv[i];
  if(a==='--raw')useRaw=true;
  else if(a==='--limit'||a==='--fail-above'){const v=Number(argv[++i]);if(!(v>0)){console.error(a+' needs a positive number\n'+usage);process.exit(2);}if(a==='--limit'){if(!Number.isInteger(v)){console.error('--limit needs a whole number of words\n'+usage);process.exit(2);}limit=v;}else failAbove=v;}
  else if(a.startsWith('--')){console.error('Unknown option '+a+'\n'+usage);process.exit(2);}
  else files.push(a);
}
const [a,b]=files;
if(!a||files.length>2){console.error(usage);process.exit(2);}
for(const x of [a,b])if(x&&!fs.existsSync(x)){console.error('Cannot read '+x);process.exit(2);}
const count=f=>{const t=strip(f,fs.readFileSync(f,'utf8'));return useRaw?raw(t):visible(t);};
const unit=useRaw?'raw words':'words';
const ca=count(a);
if(b){const cb=count(b);console.log(`${a}: ${ca} ${unit}; ${b}: ${cb} ${unit}; ratio ${(ca/cb).toFixed(2)}`)}else console.log(`${a}: ${ca} ${unit}`);
if(limit){
  const share=Math.round(ca/limit*100);
  const line=`${ca} ${unit} is ${share}% of the ${limit}-word limit`;
  if(ca>limit*failAbove/100){console.log(`FAIL ${line}: over the ${failAbove}% line. Cut any section the owner did not ask for, then anything the owner will not use.`);process.exitCode=1;}
  else console.log(`OK ${line}: within the limit.`);
}
