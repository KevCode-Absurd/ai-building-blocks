import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const tools=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../packs/shared/tools');
function fixture(){const dir=fs.mkdtempSync(path.join(tmpdir(),'source-dates-'));const put=(name:string,text:string)=>{const p=path.join(dir,name);fs.writeFileSync(p,text);return p;};return {dir,put,brief:put('brief.md','Review store sales.'),source:put('source.json',JSON.stringify({period_start:'2026-11-02',period_end:'2026-11-08'})),final:put('final.md','Historical sales window: 2026-11-02 through 2026-11-08. Retain the existing budget.')};}
for(const script of ['quality/leakcheck.cjs','check-handover.mjs']){
  const run=(args:string[])=>spawnSync(process.execPath,[path.join(tools,script),...args],{encoding:'utf8'});
  test(`${script}: supplied evidence dates are accepted, absent dates still fail`,()=>{const f=fixture();assert.equal(run([f.final,'--brief',f.brief]).status,1);const valid=run([f.final,'--brief',f.brief,'--date-source',f.source]);assert.equal(valid.status,0,valid.stdout+valid.stderr);});
  test(`${script}: a source date does not authorize a different year or arbitrary deadline`,()=>{const f=fixture();for(const date of ['2027-11-02','2026-12-25']){const final=f.put('wrong.md',`Launch on ${date}.`);const r=run([final,'--brief',f.brief,'--date-source',f.source]);assert.equal(r.status,1,r.stdout);assert.match(r.stdout,/date not in the brief/);}});
  test(`${script}: an unreadable declared source cannot turn into a silent pass`,()=>{const f=fixture();const r=run([f.final,'--brief',f.brief,'--date-source',path.join(f.dir,'missing.json')]);assert.equal(r.status,2);assert.match(r.stderr,/Cannot read date source/);});
}
test('quality orchestrator forwards declared source files to both date checks',()=>{const f=fixture();const r=spawnSync(process.execPath,[path.join(tools,'quality/qe-check.cjs'),f.final,'--plain',f.final,'--brief',f.brief,'--sources',f.source,'--context',f.dir,'--json'],{encoding:'utf8'});const result=JSON.parse(r.stdout);const rows=result.checks||result.rows;assert.ok(rows,r.stdout);for(const name of ['leakcheck','handover'])assert.equal(rows.find((x:any)=>x.name===name).status,'PASS',r.stdout);});
