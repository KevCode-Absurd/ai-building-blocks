// Leak check v2.1: internal notes, placeholders and workflow words in a finished deliverable.
// For HTML it checks the text a visitor sees, plus elements that look like internal notes.
// Usage: node leakcheck.cjs <file>. Exit 0 = clean, 1 = leaks found, 2 = usage error or unreadable file.
const fs=require('fs');const f=process.argv[2];
if(!f){console.error('Usage: node leakcheck.cjs <file.md|.html|.txt>');process.exit(2);}
let t;try{t=fs.readFileSync(f,'utf8');}catch(e){console.error('Cannot read '+f);process.exit(2);}const hits=[];
if(/\.html?$/i.test(f)){
  const tagRe=/<([a-z0-9]+)\b[^>]*\b(class|id)\s*=\s*["'][^"']*\b(note|notes|internal|debug|todo|dev|annotation|reviewer|editor|sources-panel|fact-?check)\b[^"']*["'][^>]*>/gi;let m;
  while((m=tagRe.exec(t)))hits.push(`element looks like an internal note: ${m[0].slice(0,120)}`);
  t=t.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,'\n').replace(/&nbsp;/g,' ');
}
const pats=[/\b(facts|market|research|lessons|preferences|contract|check)\.md\b/i,/\[INTERNAL[^\]]*\]/i,/\bUNKNOWN\b/,/\bUNCONFIRMED\b/,/\bTBD\b/,/\bTODO\b/,/\bXX+\b/,/\[(insert|fill|placeholder|your|name|date|confirm)[^\]]*\]/i,/\{\{[^}]+\}\}/,/\bcand-[a-d]\b/i,/\b(company memory|research file|facts file|the checker|the contract|this workflow|quality engine|draft [A-D]\b)/i,/\b(internal notes?|notes? for (the )?(team|reviewer|editor)|not for publication|do not publish|for internal use)\b/i,/scratchpad|qbench|[A-Z]:[\\\/]Users[\\\/]/i];
t.split(/\r?\n/).forEach((l,i)=>{for(const p of pats){const m=l.match(p);if(m)hits.push(`line ${i+1}: "${m[0]}" in: ${l.trim().slice(0,120)}`)}});
console.log(hits.length?`LEAKS (${hits.length}):\n`+hits.join('\n'):'clean');process.exitCode=hits.length?1:0;
