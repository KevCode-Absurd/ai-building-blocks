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
  test(`${script}: equivalent complete source dates survive human-readable formatting`,()=>{
    const f=fixture();
    for(const [source,date] of [
      ['Published June 3, 2026.','3 June 2026'],
      ['Published 2026-06-03.','June 3, 2026'],
      ['Observed 18 November 2026.','2026-11-18'],
      ['Published 3rd of Jun. 2026.','June 3rd, 2026'],
      ['Observed 18/11/2026.','November 18, 2026'],
      ['Observed 11/18/2026.','18 November 2026'],
    ]) {
      const r=run([f.put('formatted.md',`Source publication: ${date}.`),'--brief',f.brief,'--date-source',f.put('source.txt',source)]);
      assert.equal(r.status,0,`${source} => ${date}: ${r.stdout}${r.stderr}`);
    }
  });
  test(`${script}: normalization cannot infer a year, ambiguous locale or impossible date`,()=>{
    const f=fixture();
    for(const [source,date] of [
      ['Published June 3, 2026.','June 3, 2027'],
      ['Published June 3.','June 3, 2026'],
      ['Published June 3, 2026.','June 3'],
      ['Observed 03/06/2026.','June 3, 2026'],
      ['Observed 03/06/2026.','March 6, 2026'],
      ['Published June 3, 2026.','03/06/2026'],
      ['Published February 30, 2026.','February 30, 2026'],
    ]) {
      const r=run([f.put('bad-date.md',`Source publication: ${date}.`),'--brief',f.brief,'--date-source',f.put('source.txt',source)]);
      assert.equal(r.status,1,`${source} => ${date}: ${r.stdout}${r.stderr}`);
    }
  });
  test(`${script}: one sourced date does not cover another date on the same line`,()=>{
    const f=fixture();
    const r=run([f.put('mixed.md','Published June 3, 2026; changed June 3, 2027.'),'--brief',f.brief,'--date-source',f.put('source.txt','Published 2026-06-03.')]);
    assert.equal(r.status,1,r.stdout+r.stderr);
    assert.match(r.stdout,/June 3, 2027/);
  });
  test(`${script}: supplied evidence dates are accepted, absent dates still fail`,()=>{const f=fixture();assert.equal(run([f.final,'--brief',f.brief]).status,1);const valid=run([f.final,'--brief',f.brief,'--date-source',f.source]);assert.equal(valid.status,0,valid.stdout+valid.stderr);});
  test(`${script}: a source date does not authorize a different year or arbitrary deadline`,()=>{const f=fixture();for(const date of ['2027-11-02','2026-12-25']){const final=f.put('wrong.md',`Launch on ${date}.`);const r=run([final,'--brief',f.brief,'--date-source',f.source]);assert.equal(r.status,1,r.stdout);assert.match(r.stdout,/date not in the brief/);}});
  test(`${script}: an unreadable declared source cannot turn into a silent pass`,()=>{const f=fixture();const r=run([f.final,'--brief',f.brief,'--date-source',path.join(f.dir,'missing.json')]);assert.equal(r.status,2);assert.match(r.stderr,/Cannot read date source/);});
}
test('quality orchestrator forwards declared source files to both date checks',()=>{const f=fixture();const r=spawnSync(process.execPath,[path.join(tools,'quality/qe-check.cjs'),f.final,'--plain',f.final,'--brief',f.brief,'--sources',f.source,'--context',f.dir,'--json'],{encoding:'utf8'});const result=JSON.parse(r.stdout);const rows=result.checks||result.rows;assert.ok(rows,r.stdout);for(const name of ['leakcheck','handover'])assert.equal(rows.find((x:any)=>x.name===name).status,'PASS',r.stdout);});
