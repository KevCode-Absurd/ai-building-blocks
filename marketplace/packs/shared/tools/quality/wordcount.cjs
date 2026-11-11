// Words a reader sees: strips markdown table pipes and markup; for HTML, visible text only.
const fs=require('fs');const count=f=>{let t=fs.readFileSync(f,'utf8');if(/\.html?$/i.test(f))t=t.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ');t=t.replace(/[|#*_>`-]+/g,' ');return (t.match(/[A-Za-z0-9$%€£][^\s]*/g)||[]).length};
// Usage: node wordcount.cjs <file> [<compare-file>]. Exit 0 = counted, 2 = usage error or unreadable file.
const [a,b]=process.argv.slice(2);
if(!a){console.error('Usage: node wordcount.cjs <file> [<compare-file>]');process.exit(2);}
for(const x of [a,b])if(x&&!fs.existsSync(x)){console.error('Cannot read '+x);process.exit(2);}
const ca=count(a);if(b){const cb=count(b);console.log(`${a}: ${ca} words; ${b}: ${cb} words; ratio ${(ca/cb).toFixed(2)}`)}else console.log(`${a}: ${ca} words`);
