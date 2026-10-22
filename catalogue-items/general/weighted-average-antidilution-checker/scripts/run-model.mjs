// Original finite-input finance fixture engine. No evaluation, network or account access.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const OPERATIONS = ['add','sub','mul','div','pow','min','max','abs','neg','sum','mean','sqrt','npv','irr','pmt'];
const fail = message => { throw new Error(message); };
const finite = (value, label) => typeof value === 'number' && Number.isFinite(value) ? value : fail(`${label} must be a finite number.`);
const idPattern = /^[a-zA-Z][a-zA-Z0-9_]{0,79}$/;
const arity = {sub:2,div:2,pow:2,abs:1,neg:1,sqrt:1,pmt:3};
const comparisons={lt:(a,b)=>a<b,lte:(a,b)=>a<=b,gt:(a,b)=>a>b,gte:(a,b)=>a>=b,eq:(a,b)=>a===b};

export function validateModel(model) {
  if (!model || !Array.isArray(model.inputs) || !model.inputs.length || model.inputs.length > 256) fail('Model needs 1–256 inputs.');
  if (!Array.isArray(model.calculations) || !model.calculations.length || model.calculations.length > 512) fail('Model needs 1–512 calculations.');
  const seen = new Set();
  for (const input of model.inputs) {
    if (!idPattern.test(input.id) || seen.has(input.id)) fail(`Invalid or repeated input ID: ${input.id}`);
    if (!input.label || !input.unit) fail(`${input.id} needs a label and unit.`);
    finite(input.value, input.id);
    if (input.min !== undefined) finite(input.min, `${input.id} minimum`);
    if (input.max !== undefined) finite(input.max, `${input.id} maximum`);
    if (input.min !== undefined && input.max !== undefined && input.min > input.max) fail(`${input.id} has reversed bounds.`);
    seen.add(input.id);
  }
  for (const node of model.calculations) {
    if (!idPattern.test(node.id) || seen.has(node.id)) fail(`Invalid or repeated calculation ID: ${node.id}`);
    if (!node.label || !node.unit || !OPERATIONS.includes(node.op)) fail(`Invalid calculation: ${node.id}`);
    if (!Array.isArray(node.args) || !node.args.length || node.args.length > 256) fail(`${node.id} needs bounded arguments.`);
    if (arity[node.op] && node.args.length !== arity[node.op]) fail(`${node.id} has invalid argument count.`);
    if (['npv','irr'].includes(node.op) && node.args.length < 2) fail(`${node.id} needs at least two arguments.`);
    for (const arg of node.args) {
      if (typeof arg === 'string' ? !seen.has(arg) : typeof arg !== 'number' || !Number.isFinite(arg)) fail(`${node.id} references an unavailable argument: ${String(arg)}`);
    }
    seen.add(node.id);
  }
  if (!Array.isArray(model.outputs) || !model.outputs.length || new Set(model.outputs).size !== model.outputs.length) fail('Model needs distinct output IDs.');
  for (const id of model.outputs) if (!seen.has(id)) fail(`Unknown output: ${id}`);
  if(model.constraints!==undefined){
    if(!Array.isArray(model.constraints)||model.constraints.length>256)fail('Constraints must be a bounded array.');
    for(const constraint of model.constraints){
      if(!Object.hasOwn(comparisons,constraint.operator)||typeof constraint.message!=='string'||constraint.message.trim().length<4)fail('Invalid numeric constraint.');
      for(const value of [constraint.left,constraint.right])if(typeof value==='string'?!seen.has(value):typeof value!=='number'||!Number.isFinite(value))fail('Constraint references an unavailable numeric value.');
    }
  }
  return model;
}

function npv(rate, flows) {
  if (rate <= -1) fail('Discount rate must exceed -100%.');
  return flows.reduce((total, amount, index) => total + amount / (1 + rate) ** (index + 1), 0);
}

function irr(flows) {
  // The conventional pattern guarantees a unique root. Nonconventional flows
  // can have multiple IRRs; refusal is more useful than an arbitrary root.
  if (flows[0] >= 0 || flows.slice(1).some(value => value < 0) || !flows.slice(1).some(value => value > 0)) fail('IRR requires one initial outflow followed by nonnegative periodic inflows. Use a timing-aware review for other cash-flow patterns.');
  const valueAt = rate => flows[0] + npv(rate, flows.slice(1));
  let low = -0.999999999, high = 1;
  while (valueAt(high) > 0 && high < 1e12) high = high * 2 + 1;
  if (valueAt(low) < 0 || valueAt(high) > 0) fail('IRR could not be bracketed reliably.');
  for (let count = 0; count < 250; count++) {
    const middle = (low + high) / 2;
    if (valueAt(middle) > 0) low = middle; else high = middle;
  }
  return (low + high) / 2;
}

export function operation(op, args) {
  args.forEach((value, index) => finite(value, `${op} argument ${index + 1}`));
  let value;
  switch (op) {
    case 'add': case 'sum': value = args.reduce((a,b)=>a+b,0); break;
    case 'sub': value = args[0]-args[1]; break;
    case 'mul': value = args.reduce((a,b)=>a*b,1); break;
    case 'div': if (args[1]===0) fail('Division denominator is zero.'); value = args[0]/args[1]; break;
    case 'pow': if (args[0]===0 && args[1]<=0) fail('Zero raised to a nonpositive power is undefined.'); value = args[0]**args[1]; break;
    case 'min': value = Math.min(...args); break;
    case 'max': value = Math.max(...args); break;
    case 'abs': value = Math.abs(args[0]); break;
    case 'neg': value = -args[0]; break;
    case 'mean': value = args.reduce((a,b)=>a+b,0)/args.length; break;
    case 'sqrt': if(args[0]<0) fail('Square root requires a nonnegative value.'); value = Math.sqrt(args[0]); break;
    case 'npv': value = npv(args[0],args.slice(1)); break;
    case 'irr': value = irr(args); break;
    case 'pmt': {
      const [rate,periods,present] = args;
      if(rate<=-1 || !Number.isInteger(periods) || periods<=0) fail('Payment needs a rate above -100% and a positive whole period count.');
      value = rate===0 ? -present/periods : -present*rate/(-Math.expm1(-periods*Math.log1p(rate)));
      break;
    }
    default: fail(`Unsupported operation: ${op}`);
  }
  return finite(value, `${op} result`);
}

export function defaultInputs(model) { return Object.fromEntries(model.inputs.map(input => [input.id,input.value])); }

export function evaluateModel(model, inputs = defaultInputs(model)) {
  validateModel(model);
  if (!inputs || typeof inputs!=='object' || Array.isArray(inputs)) fail('Inputs must be an object of numeric values.');
  const declared = new Set(model.inputs.map(input=>input.id));
  for(const id of Object.keys(inputs)) if(!declared.has(id)) fail(`Unknown input: ${id}`);
  const values = Object.create(null);
  for(const input of model.inputs) {
    if(!Object.hasOwn(inputs,input.id)) fail(`MISSING: ${input.label} (${input.id}).`);
    const value = finite(inputs[input.id],input.id);
    if(input.min!==undefined && value<input.min) fail(`${input.id} is below its supported minimum ${input.min}.`);
    if(input.max!==undefined && value>input.max) fail(`${input.id} exceeds its supported maximum ${input.max}.`);
    values[input.id]=value;
  }
  for(const node of model.calculations) values[node.id]=operation(node.op,node.args.map(arg=>typeof arg==='string'?values[arg]:arg));
  for(const constraint of model.constraints??[]){const number=value=>typeof value==='string'?values[value]:value;if(!comparisons[constraint.operator](number(constraint.left),number(constraint.right)))fail(`Unsupported numeric domain: ${constraint.message}`);}
  return {outputs:Object.fromEntries(model.outputs.map(id=>[id,values[id]])),values};
}

export function excelConstraint(constraint,addresses){
  const signs={lt:'<',lte:'<=',gt:'>',gte:'>=',eq:'='};
  if(!Object.hasOwn(signs,constraint.operator))fail('Unsupported constraint operator.');
  const argument=value=>typeof value==='string'?addresses[value]??fail('Unmapped constraint reference.'):String(finite(value,'Constraint constant'));
  return `${argument(constraint.left)}${signs[constraint.operator]}${argument(constraint.right)}`;
}

export function excelFormula(node, addresses, cashflowRanges = {}) {
  const args=node.args.map(arg=>typeof arg==='string'?addresses[arg]:String(arg));
  if(args.some(arg=>arg===undefined)) fail(`Unmapped formula reference: ${node.id}`);
  switch(node.op) {
    case 'add': case 'sum': return `=SUM(${args.join(',')})`;
    case 'sub': return `=${args[0]}-${args[1]}`;
    case 'mul': return `=PRODUCT(${args.join(',')})`;
    case 'div': return `=IF(${args[1]}=0,NA(),${args[0]}/${args[1]})`;
    case 'pow': return `=${args[0]}^${args[1]}`;
    case 'mean': return `=AVERAGE(${args.join(',')})`;
    case 'neg': return `=-${args[0]}`;
    case 'abs': case 'min': case 'max': case 'sqrt': return `=${node.op.toUpperCase()}(${args.join(',')})`;
    case 'npv': return `=IF(${args[0]}>-1,NPV(${args.join(',')}),NA())`;
    case 'irr': {
      const range=cashflowRanges[node.id];
      if(!range)fail(`IRR needs a contiguous cash-flow range: ${node.id}`);
      const match=range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
      if(!match || match[1]!==match[3] || Number(match[4])<=Number(match[2]))fail(`Invalid IRR cash-flow range: ${range}`);
      const first=`${match[1]}${match[2]}`,rest=`${match[1]}${Number(match[2])+1}:${match[3]}${match[4]}`;
      return `=IF(AND(${first}<0,COUNTIFS(${rest},"<0")=0,COUNTIFS(${rest},">0")>0),IRR(${range}),NA())`;
    }
    case 'pmt': return `=IF(AND(${args[0]}>-1,${args[1]}>0,${args[1]}=INT(${args[1]})),PMT(${args.join(',')}),NA())`;
    default: fail(`No Excel formula for ${node.op}`);
  }
}

if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const spec = JSON.parse(fs.readFileSync(process.argv[2] ?? fail('Usage: node run-model.mjs model.json [inputs.json]'),'utf8'));
    const model = spec.model ?? spec;
    const supplied = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3],'utf8')) : defaultInputs(model);
    const result = evaluateModel(model,supplied);
    console.log(JSON.stringify({basis:process.argv[3]?'User-supplied numbers; source evidence is checked separately.':'Illustrative figures only.',outputs:result.outputs,calculations:model.calculations.map(node=>({id:node.id,label:node.label,unit:node.unit,value:result.values[node.id]}))},null,2));
  } catch(error) { console.error(error.message); process.exitCode=1; }
}
