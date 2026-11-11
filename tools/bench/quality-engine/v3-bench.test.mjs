import test from 'node:test';
import assert from 'node:assert/strict';
import { validateVerdicts, DIMENSIONS } from './v3-bench.mjs';
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
