import test from 'node:test';
import assert from 'node:assert/strict';
import { validateVerdicts, DIMENSIONS, tally } from './v3-bench.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
const score = () => ({...Object.fromEntries(DIMENSIONS.map(d=>[d,8])),note:'Usable and accurate.'});
const pair = id => ({id,X:score(),Y:score(),winner:'tie'});
test('an incomplete judge set cannot produce a completed benchmark', () => {
  assert.throws(()=>validateVerdicts([{judge:'j1',pairs:[pair('A01')]}],['A01'],['j1','i1']),/Missing verdict/);
});
test('duplicate votes and invalid score ranges cannot inflate the tally', () => {
  assert.throws(()=>validateVerdicts([{judge:'j1',pairs:[pair('A01'),pair('A01')]}],['A01'],['j1']),/duplicate/);
  const p=pair('A01');p.X.overall=11;
  assert.throws(()=>validateVerdicts([{judge:'j1',pairs:[p]}],['A01'],['j1']),/Invalid score/);
});
test('exactly one complete verdict per expected judge and task is accepted', () => {
  assert.equal(validateVerdicts(['j1','i1'].map(judge=>({judge,pairs:[pair('A01'),pair('R01')]})),['A01','R01'],['j1','i1']),4);
});
test('incomplete judging is rejected before any answer key is opened', () => {
  const run = fs.mkdtempSync(path.join(os.tmpdir(),'blind-key-gate-'));
  fs.mkdirSync(path.join(run,'panels'));
  fs.mkdirSync(path.join(run,'verdicts/P1'),{recursive:true});
  fs.writeFileSync(path.join(run,'panels/P1.json'),JSON.stringify({ids:['A01']}));
  fs.writeFileSync(path.join(run,'verdicts/P1/j1.json'),JSON.stringify({judge:'j1',pairs:[pair('A01')]}));
  // There is deliberately no key: looking for it first would fail with ENOENT.
  assert.throws(()=>tally(run,'P1',['j1','i1']),/Missing verdict: i1:A01/);
});
test('tally handles swapped labels and refuses edits to a judged snapshot', () => {
  const run=fs.mkdtempSync(path.join(os.tmpdir(),'blind-swap-gate-'));
  const write=(file,value)=>{const out=path.join(run,file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,typeof value==='string'?value:JSON.stringify(value));};
  const ids=['A01','R01'],key={};
  write('tasks.json',ids.map(id=>({id,brand:'allbirds',ext:'md'})));
  write('panels/P1.json',{ids});
  for(const id of ids){key[id]={};for(const label of ['X','Y']){
    const arm=(id==='A01')===(label==='X')?'v3':'plain';
    const text=arm==='v3'?'A useful engine answer.':'A useful plain answer.';
    write(`judge/P1/${id}/${label}.md`,text);
    key[id][label]={arm,sha256:crypto.createHash('sha256').update(text).digest('hex')};
  }}
  write('keys/P1.json',{arm:'v3',key});
  for(const judge of ['j1','i1'])write(`verdicts/P1/${judge}.json`,{judge,pairs:ids.map(id=>{
    const a=id==='A01'?'X':'Y',b=a==='X'?'Y':'X';
    return {id,[a]:{...score(),overall:9},[b]:{...score(),overall:8},winner:a};
  })});
  const report=tally(run,'P1',['j1','i1']);
  assert.equal(report.groups.all.win_rate,1);
  assert.equal(report.groups.all.scores.overall.delta,1);
  assert.equal(report.release_gate.pass,true);
  write('judge/P1/R01/Y.md','Changed after judging.');
  assert.throws(()=>tally(run,'P1',['j1','i1']),/Judged deliverable changed/);
});
