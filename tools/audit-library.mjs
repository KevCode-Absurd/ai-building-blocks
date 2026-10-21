// Static catalogue security and first-read copy review. Never executes imported code.
// A clean scan is not a proof of safety or a model performance test.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from '../site/node_modules/yaml/dist/index.js';
import {grade} from './readability.mjs';

const roots=['general','ecommerce','imported','orchestrators','agents','minds'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const rules=[
 ['instruction-override',/\b(?:ignore|disregard|override)\s+(?:all\s+)?(?:previous|prior|system|developer|safety)\s+(?:instructions|rules|prompts)/i],
 ['concealed-action',/\b(?:silently\s+(?:send|upload|delete|add|install|change|complete)|(?:do not|don't|never)\s+(?:tell|inform|notify)\s+(?:the\s+)?user|without\s+(?:telling|notifying)\s+(?:the\s+)?user|hidden\s+(?:recipient|bcc|cc))/i],
 ['approval-bypass',/\b(?:skip|bypass|disable)\s+(?:all\s+)?(?:approval|confirmation|security|safety)\b|--no-verify\b/i],
 ['remote-shell',/curl\b[^\n|]{0,300}\|\s*(?:ba)?sh\b|wget\b[^\n|]{0,300}\|\s*(?:ba)?sh\b|Invoke-Expression\b|\biex\s*\(/i],
 ['destructive-command',/\brm\s+-[a-z]*r[a-z]*f\b|git\s+(?:reset\s+--hard|push\s+--force(?:\s|$))|Remove-Item[^\n]*-Recurse/i],
 ['credential-candidate',/\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16})\b/],
 ['encoded-execution',/(?:eval|exec)\s*\(\s*(?:atob|base64\.|Buffer\.from)|powershell[^\n]*-enc(?:odedcommand)?\s+[A-Za-z0-9+/]{20,}/i],
 ['bidirectional-control',/[\u202a-\u202e\u2066-\u2069]/],
 ['hidden-text-instruction',/<!--[^\n]*(?:ignore|override|secretly|silently|execute|send)[^\n]*-->/i]
];
const textExt=/\.(md|txt|ya?ml|json|[cm]?js|tsx?|jsx|py|ps1|sh|bash|cmd|bat|html?|xml|svg|toml|ini|cfg|csv|sql|rb|go|rs|php|cs|java|ipynb)$/i;
const executable=/\.(exe|dll|msi|scr|com|lnk|so|dylib|jar|wasm|pkl|pickle)$/i;
const findings=[],copy=[],manifest=[],structural=[];let files=0,bytes=0;
function* walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const p=path.join(dir,e.name);if(e.isSymbolicLink()){structural.push({file:p,issue:'symlink'});continue;}if(e.isDirectory())yield*walk(p);else yield p;}}
for(const cat of roots)for(const slug of fs.readdirSync(`catalogue-items/${cat}`).sort()){
 const dir=`catalogue-items/${cat}/${slug}`,skill=`${dir}/SKILL.md`;if(!fs.existsSync(skill))continue;
 const itFile=`${dir}/${cat==='minds'?'mind':'item'}.yaml`;if(!fs.existsSync(itFile)){structural.push({slug,issue:'missing metadata'});continue;}
 let it;try{it=YAML.parse(fs.readFileSync(itFile,'utf8'));}catch{structural.push({slug,issue:'invalid YAML'});continue;}
 let pg={};const pf=cat==='orchestrators'?`tools/orchestrator-pages/${slug}.yaml`:`${dir}/page.yaml`;if(fs.existsSync(pf))try{pg=YAML.parse(fs.readFileSync(pf,'utf8'))??{};}catch{structural.push({slug,issue:'invalid page YAML'});}
 const entry=[];
 for(const f of walk(dir)){
  const data=fs.readFileSync(f);files++;bytes+=data.length;entry.push(path.relative(dir,f).split(path.sep).join('/')+'\0'+hash(data));
  if(executable.test(f))findings.push({slug,file:f,rule:'binary-executable',line:0,digest:hash(data)});
  if(!textExt.test(f))continue;
  const lines=data.toString('utf8').split(/\r?\n/);
  if(/\.svg$/i.test(f))for(let i=0;i<lines.length;i++)if(/<script\b|\bon[a-z]+\s*=|(?:href|src)=["'](?:javascript:|data:text\/html)/i.test(lines[i]))findings.push({slug,file:f.split(path.sep).join('/'),line:i+1,rule:'active-svg',context:'review',digest:hash(lines[i])});
  for(let i=0;i<lines.length;i++)for(const [rule,re] of rules)if(re.test(lines[i])){
   // A nearby prohibition or attack/test example changes interpretation; retain it for audit rather than silently dropping it.
   const context=lines.slice(Math.max(0,i-2),i+2).join(' ');
   const guarded=/\b(?:never|do not|don't|must not|forbid|prohibit|not authorized|untrusted|malicious|prompt injection|example attack|avoid)\b/i.test(context);
   findings.push({slug,file:f.split(path.sep).join('/'),line:i+1,rule,context:guarded?'guard-or-example':'review',digest:hash(lines[i])});
  }
 }
 manifest.push({slug,category:cat,files:entry.length,sha256:hash(entry.join('\n'))});
 if(cat==='minds')continue;
 const name=pg.name??it.name??'',summary=pg.summary??it.summary??'',subhead=pg.subhead??'';
 const issues=[];
 if(!name.trim()||!summary.trim())issues.push('missing name or summary');
 if(summary.length<55)issues.push('short summary: check result is specific');
 if(/^(?:A |An |The )?(?:powerful|comprehensive|expert|advanced|intelligent)\b/i.test(summary))issues.push('leads with a claim instead of a job');
 if(/\b(?:helps? you|assist(?:s)? with|various tasks|best practices|AI-powered|end-to-end)\b/i.test(summary))issues.push('check vague benefit or unexplained term');
 if(!/\b(?:get|find|check|write|build|plan|make|turn|draft|test|compare|review|fix|learn|read|give|share|paste|choose|create|set|see|ship|map|show|score|rank|spot|run|pick|use|send|cut|trace|ask|track)\w*\b/i.test(summary))issues.push('no clear job or result verb');
 if(grade(summary)>10)issues.push('summary reading grade above 10');
 if(subhead===summary||subhead.split(/\s+/).length<25)issues.push('needs a fuller page introduction');
 if(issues.length)copy.push({slug,category:cat,file:pf,name,summary,subhead,grade:grade(summary),issues});
}
const report={method:'Static pattern scan of all catalogue skill folders and supporting files, metadata checks, SHA-256 manifest. No imported scripts executed. Findings are candidates, not verdicts. Model behavior and remote dependencies require separate evaluation.',counts:{blocks:manifest.length,files,bytes,findings:findings.length,copyCandidates:copy.length},structural,findings,copy,manifest};
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/library-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.counts));console.log('Structural:',structural.length,'Uncontextualized security candidates:',findings.filter(x=>x.context!=='guard-or-example').length);
