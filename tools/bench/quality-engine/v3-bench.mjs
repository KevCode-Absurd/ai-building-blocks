// Local, model-free benchmark. Never silently packs partial runs or tallies incomplete judging.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const DIMENSIONS = ['usefulness', 'accuracy', 'specificity', 'clarity', 'craft', 'overall'];
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => { fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2)); };
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export function validateVerdicts(results, ids, expectedJudges) {
  const seen = new Set();
  for (const result of results) {
    if (!expectedJudges.includes(result.judge) || !Array.isArray(result.pairs)) throw Error('Unknown judge or invalid result');
    for (const pair of result.pairs) {
      const key = result.judge + ':' + pair.id;
      if (!ids.includes(pair.id) || seen.has(key)) throw Error('Unexpected or duplicate verdict: ' + key);
      seen.add(key);
      if (!['X','Y','tie'].includes(pair.winner)) throw Error('Invalid winner: ' + key);
      for (const label of ['X','Y']) for (const dim of DIMENSIONS) {
        const n = pair[label]?.[dim];
        if (!Number.isInteger(n) || n < 1 || n > 10) throw Error('Invalid score: ' + key);
      }
      if (typeof pair.X.note !== 'string' || typeof pair.Y.note !== 'string') throw Error('Missing reasoning: ' + key);
    }
  }
  for (const judge of expectedJudges) for (const id of ids) if (!seen.has(judge + ':' + id)) throw Error('Missing verdict: ' + judge + ':' + id);
  return seen.size;
}

export function pack(run, panel = 'v3', arm = 'v3', renderTool, candidateFile = 'final') {
  if (!['candidate','final'].includes(candidateFile)) throw Error('Candidate file must be candidate or final');
  const tasks = json(path.join(run, 'tasks.json'));
  const selected = arm === 'v21' ? tasks.filter(t => !['gruns','linear'].includes(t.brand)) : tasks;
  const keyFile = path.join(run, 'keys', panel + '.json');
  if (fs.existsSync(keyFile)) throw Error('This panel is already frozen; use a new panel name');
  const files = selected.map(t => ({t, a:path.join(run,'codex',arm,t.id,candidateFile+'.'+t.ext), b:path.join(run,'codex','plain',t.id,'final.'+t.ext)}));
  for (const {t,a,b} of files) if (![a,b].every(f => fs.existsSync(f) && fs.statSync(f).size > 100)) throw Error('Missing or empty deliverable: ' + t.id);
  if (files.some(f => f.t.ext === 'html') && !renderTool) throw Error('HTML comparisons require the screenshot renderer');
  const key = {};
  for (const {t,a,b} of files) {
    const labels = crypto.randomInt(2) ? {X:a,Y:b} : {X:b,Y:a};
    const dir = path.join(run, 'judge', panel, t.id); fs.mkdirSync(dir,{recursive:true});
    write(path.join(dir,'request.txt'),t.brief);
    key[t.id] = {};
    for (const [label,source] of Object.entries(labels)) {
      const target = path.join(dir,label+'.'+t.ext); fs.copyFileSync(source,target);
      key[t.id][label] = {arm:source===a?arm:'plain', sha256:hash(target)};
      if (t.ext==='html') {
        execFileSync(process.execPath,[renderTool,target,path.join(dir,label)],{cwd:process.cwd(),stdio:'pipe',timeout:120000});
        key[t.id][label].screenshots = {};
        for (const size of ['phone','desktop']) { const file=path.join(dir,`${label}-${size}.png`); if(!fs.existsSync(file)) throw Error('Screenshot missing'); key[t.id][label].screenshots[size]=hash(file); }
      }
    }
  }
  write(path.join(run,'panels',panel+'.json'),{schema:'codex-quality-panel/1',ids:files.map(f=>f.t.id)});
  write(keyFile,{schema:'codex-quality-blind/1',panel,arm,candidate_file:candidateFile,generator_model:'Codex (session model)',baseline_model:'Codex (session model)',original_claude_run:'interrupted, preserved separately',key});
  return {pairs:files.length,html:files.filter(f=>f.t.ext==='html').length};
}

export function tally(run, panel = 'v3', expectedJudges = ['j1','j2','i1','i2']) {
  const ids = json(path.join(run,'panels',panel+'.json')).ids;
  const dir = path.join(run,'verdicts',panel);
  const results = fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>json(path.join(dir,f)));
  const count = validateVerdicts(results,ids,expectedJudges);
  // The answer key is opened only after every expected blind verdict has validated.
  const frozen = json(path.join(run,'keys',panel+'.json'));
  if(Object.keys(frozen.key).length!==ids.length || ids.some(id=>!frozen.key[id])) throw Error('Panel and frozen key differ');
  const tasks = json(path.join(run,'tasks.json'));
  const rows = results.flatMap(r=>r.pairs.map(p=>{
    const labels = frozen.key[p.id], a = labels.X.arm===frozen.arm?'X':'Y', b=a==='X'?'Y':'X';
    for (const label of ['X','Y']) {
      const task=tasks.find(t=>t.id===p.id),file=path.join(run,'judge',panel,p.id,label+'.'+task.ext);
      if(hash(file)!==labels[label].sha256) throw Error('Judged deliverable changed: '+p.id);
      for(const [size,digest] of Object.entries(labels[label].screenshots ?? {})) if(hash(path.join(run,'judge',panel,p.id,`${label}-${size}.png`))!==digest) throw Error('Judged screenshot changed: '+p.id);
    }
    return {id:p.id,judge:r.judge,panel:r.judge.startsWith('i')?'independent brief':'original brief',set:tasks.find(t=>t.id===p.id).evaluation_set ?? (['gruns','linear'].includes(tasks.find(t=>t.id===p.id).brand)?'practice':'held-out'),win:p.winner===a,tie:p.winner==='tie',engine:p[a],plain:p[b]};
  }));
  const interval = data => {
    const clusters = [...new Set(data.map(x=>x.id))].map(id=>data.filter(x=>x.id===id));
    if(clusters.length<3) return null;
    let seed=27644437; const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    const rates=[];
    for(let i=0;i<2000;i++){let wins=0,total=0;for(let j=0;j<clusters.length;j++){const c=clusters[Math.floor(random()*clusters.length)];wins+=c.filter(x=>x.win).length;total+=c.length;}rates.push(wins/total);}
    rates.sort((a,b)=>a-b);return [rates[50],rates[1949]];
  };
  const stats = data => ({scores:Object.fromEntries(DIMENSIONS.map(dim=>[dim,{plain:data.reduce((n,v)=>n+v.plain[dim],0)/data.length,engine:data.reduce((n,v)=>n+v.engine[dim],0)/data.length,delta:data.reduce((n,v)=>n+v.engine[dim]-v.plain[dim],0)/data.length}])),task_clustered_win_rate_ci95:interval(data),verdicts:data.length,wins:data.filter(x=>x.win).length,ties:data.filter(x=>x.tie).length,win_rate:data.filter(x=>x.win).length/data.length,clarity_delta:data.reduce((s,x)=>s+x.engine.clarity-x.plain.clarity,0)/data.length,overall_delta:data.reduce((s,x)=>s+x.engine.overall-x.plain.overall,0)/data.length});
  const groups = {all:stats(rows)};
  for(const set of ['practice','held-out']) if(rows.some(x=>x.set===set)) groups[set]=stats(rows.filter(x=>x.set===set));
  for(const brief of ['original brief','independent brief']) groups[brief]=stats(rows.filter(x=>x.panel===brief));
  // Predeclared release gate: a majority of all and held-out verdicts, no clarity regression.
  const pass = groups.all.win_rate>.5 && (!groups['held-out'] || groups['held-out'].win_rate>.5) && groups.all.clarity_delta>=0;
  const report = {schema:'codex-quality-results/1',panel,arm:frozen.arm,expected_judges:expectedJudges,verdicts:count,groups,release_gate:{pass,rule:'More than 50% wins overall and on held-out tasks; no mean clarity regression.'},limits:['Single model family for generation and judging.','AI preference, not customer acceptance or measured business results.','Builders used same-context internal checks; external judges are independent contexts.','Separate from the interrupted Claude benchmark; no cross-model gain is claimed.'],per_task:ids.map(id=>({id,...stats(rows.filter(x=>x.id===id))}))};
  write(path.join(run,'RESULTS-'+panel+'.json'),report);
  write(path.join(run,'RESULTS-'+panel+'.md'),`# Separate Codex evaluation: ${panel}\n\n${count} blind verdicts; ${ids.length} tasks; ${expectedJudges.length} judges.\n\n| Scope | Wins | Ties | Win rate | 95% task CI | Mean clarity gain | Mean overall gain |\n|---|---:|---:|---:|---:|---:|---:|\n`+Object.entries(groups).map(([name,g])=>`| ${name} | ${g.wins}/${g.verdicts} | ${g.ties} | ${(100*g.win_rate).toFixed(1)}% | ${g.task_clustered_win_rate_ci95 ? g.task_clustered_win_rate_ci95.map(n=>(100*n).toFixed(1)+"%").join(" to ") : "not estimated"} | ${g.clarity_delta.toFixed(2)} | ${g.overall_delta.toFixed(2)} |`).join('\n')+`\n\nRelease gate: ${pass?'PASS':'FAIL'}. ${report.release_gate.rule}\n\n`+report.limits.map(x=>'- '+x).join('\n')+'\n');
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const [cmd,run,panel='v3',arm='v3',renderTool,candidateFile='final'] = process.argv.slice(2);
    if (!run || !['pack','tally'].includes(cmd)) throw Error('Usage: v3-bench.mjs pack <run> <panel> <arm> <renderer> [final|candidate] | tally <run> <panel>');
    console.log(JSON.stringify(cmd==='pack'?pack(run,panel,arm,renderTool,candidateFile):tally(run,panel),null,2));
  } catch(error) {console.error(error.message);process.exitCode=1;}
}
