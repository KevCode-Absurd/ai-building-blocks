// Verify copies, licenses and provenance without executing imported programs.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from '../site/node_modules/yaml/dist/index.js';
const source=process.argv[2];if(!source)throw Error('Pass the awesome-copilot clone path.');
const map=YAML.parse(fs.readFileSync('tools/import-map/github-awesome-copilot.yaml','utf8'));
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=(d,rel='')=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name),`${rel}${e.name}/`):[`${rel}${e.name}`]);
const rows=[],problems=[];let total=0;
for(const [key,entry]of Object.entries(map)){
 if(entry.skip)continue;
 const rel=key.slice('github/awesome-copilot:'.length),from=path.join(source,rel),to=`catalogue-items/imported/${entry.slug}`;
 for(const f of walk(from)){total++;if(!fs.existsSync(path.join(to,f))||!fs.readFileSync(path.join(from,f)).equals(fs.readFileSync(path.join(to,f))))problems.push(`${entry.slug}: changed or missing ${f}`);}
 const item=YAML.parse(fs.readFileSync(`${to}/item.yaml`,'utf8'));
 if(item.source?.repo!=='github/awesome-copilot'||item.source?.path!==rel||!item.source?.commit)problems.push(`${entry.slug}: missing provenance`);
 const license=`${to}/${item.source.licence_file}`;if(!fs.existsSync(license))problems.push(`${entry.slug}: missing license`);
 rows.push({slug:entry.slug,source:rel,commit:item.source.commit,license:item.source.licence,sourceFiles:walk(from).length,skillSha256:digest(fs.readFileSync(`${to}/SKILL.md`))});
}
fs.writeFileSync('reports/copilot-import-verification.json',JSON.stringify({skills:rows.length,files:total,problems,entries:rows},null,2)+'\n');
console.log(`${rows.length} skills, ${total} upstream files compared byte for byte, ${problems.length} problems.`);
if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}
