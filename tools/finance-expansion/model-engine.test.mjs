import test from 'node:test';
import assert from 'node:assert/strict';
import { operation, evaluateModel, validateModel, excelFormula, excelConstraint } from './model-engine.mjs';
const near = (actual,expected) => assert(Math.abs(actual-expected)<=1e-9*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);

test('cross-input domains refuse impossible ownership and preserve boundary equality',()=>{
  const model={inputs:[{id:'investment',label:'Investment',unit:'USD',value:100,min:0},{id:'cap',label:'Cap',unit:'USD',value:1000,min:1}],calculations:[{id:'ownership',label:'Ownership',unit:'fraction',op:'div',args:['investment','cap']}],outputs:['ownership'],constraints:[{left:'investment',operator:'lte',right:'cap',message:'Investment must not exceed the capitalization cap.'}]};
  near(evaluateModel(model).outputs.ownership,.1);
  near(evaluateModel(model,{investment:1000,cap:1000}).outputs.ownership,1);
  assert.throws(()=>evaluateModel(model,{investment:1001,cap:1000}),/Unsupported numeric domain/);
  model.constraints=[{left:'ownership',operator:'gte',right:0,message:'Ownership cannot be negative.'}];
  assert.equal(excelConstraint(model.constraints[0],{ownership:'C9'}),'C9>=0');
  assert.throws(()=>validateModel({...model,constraints:[{left:'notKnown',operator:'lte',right:1,message:'Must be known.'}]}),/unavailable/);
  assert.throws(()=>validateModel({...model,constraints:[{left:1,operator:'constructor',right:2,message:'Must be numeric.'}]}),/Invalid numeric/);
});
test('discounted cash flows exclude initial cash flow and keep timing',()=>{
  near(operation('npv',[.1,110,121]),200);
  near(operation('irr',[-100,0,121]),.1);
  near(operation('irr',[-100,50]),-.5);
  assert.throws(()=>operation('irr',[-100,300,-210]),/initial outflow/);
  assert.throws(()=>operation('npv',[-1,10]),/exceed/);
});
test('payment sign, zero rate and nonzero rate reconcile',()=>{
  near(operation('pmt',[0,10,100]),-10);
  const payment=operation('pmt',[.1,2,100]);
  near(payment,-57.61904761904762);
  near(100+operation('npv',[.1,payment,payment]),0);
  near(operation('pmt',[1e-12,10,100]),-10.000000000055);
  assert.throws(()=>operation('pmt',[.1,0,100]),/positive/);
});
test('finite arithmetic and domain restrictions reject misleading outputs',()=>{
  assert.throws(()=>operation('div',[10,0]),/zero/);
  assert.throws(()=>operation('pow',[-2,.5]),/finite/);
  assert.throws(()=>operation('pow',[0,0]),/undefined/);
  assert.throws(()=>operation('mul',[1e308,1e308]),/finite/);
  assert.throws(()=>operation('sqrt',[-1]),/nonnegative/);
  assert.throws(()=>operation('add',['1',2]),/finite/);
});
const model={inputs:[{id:'revenue',label:'Revenue',value:100,unit:'USD',min:0},{id:'margin',label:'Margin',value:.2,unit:'fraction',min:0,max:1}],calculations:[{id:'profit',label:'Profit',op:'mul',args:['revenue','margin'],unit:'USD'}],outputs:['profit']};
test('missing, extra, null and out-of-domain inputs remain errors',()=>{
  assert.equal(evaluateModel(model).outputs.profit,20);
  for(const inputs of [{revenue:100},{revenue:100,margin:null},{revenue:100,margin:2},{revenue:100,margin:.2,typo:3}])assert.throws(()=>evaluateModel(model,inputs));
  assert.equal(evaluateModel(model,{revenue:0,margin:0}).outputs.profit,0);
});
test('schema rejects cycles, future references and executable operations',()=>{
  assert.throws(()=>validateModel({...model,calculations:[{...model.calculations[0],args:['profit',1]}]}),/unavailable/);
  assert.throws(()=>validateModel({...model,calculations:[{...model.calculations[0],op:'eval'}]}),/Invalid/);
  assert.throws(()=>validateModel({...model,calculations:[{...model.calculations[0],id:'revenue'}]}),/repeated/);
});
test('Excel formulas retain missing denominators and use actual IRR range',()=>{
  assert.equal(excelFormula({id:'x',op:'div',args:['revenue','margin']},{revenue:'C20',margin:'C21'}),'=IF(C21=0,NA(),C20/C21)');
  const irrFormula=excelFormula({id:'x',op:'irr',args:['a','b']},{a:'C1',b:'C2'},{x:'H10:H11'});
  assert(irrFormula.includes('H10<0') && irrFormula.includes('COUNTIFS(H11:H11,"<0")=0') && irrFormula.includes('IRR(H10:H11)'));
});
