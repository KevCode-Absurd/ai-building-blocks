'use strict';
// Financial verification boundary used by numbers.cjs --financial. Source values are
// read from confined, hash-pinned JSON snapshots using RFC6901 pointers. A pointer/hash
// verifies what a snapshot says, not whether the export is authentic or correctly scoped.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const close=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=Math.max(1e-8,Math.abs(b)*1e-8);
const signatures={
  roas:['attributed_revenue','ad_spend','ratio'],
  net_sales_mer:['net_merchandise_sales','ad_spend','ratio'],
  shopify_aov:['purchase_merchandise_revenue_excluding_adjustments','orders','money_per_order'],
  period_net_sales_per_order:['net_merchandise_sales','orders','money_per_order'],
  order_rate:['orders','sessions','ratio'],
  checkout_conversion:['checkout_sessions','sessions','ratio'],
  contribution_break_even_roas:['purchase_value_per_order','expected_contribution_before_ads_per_order','ratio'],
};
// Component order is deliberate: a model cannot change signs or silently omit a cost.
const commerceOperations={
  net_merchandise_sales:{metric:'net_merchandise_sales',inputs:['gross_merchandise_sales','merchandise_discounts','merchandise_refunds'],signs:[1,-1,-1]},
  contribution_before_ads:{metric:'contribution_before_ads',inputs:['net_merchandise_sales','landed_cogs','restocked_cogs_credit','fulfilment_cost','payment_fees','return_handling_cost','shipping_revenue_ex_tax','other_variable_costs'],signs:[1,-1,1,-1,-1,-1,1,-1]},
  contribution_after_ads:{metric:'contribution_after_ads',inputs:['contribution_before_ads','allocated_ad_spend'],signs:[1,-1]},
};
// Equal labels do not make ratios, averages or unknown custom metrics additive.
const additiveUnits={
  ...Object.fromEntries([...new Set([
    ...Object.values(commerceOperations).flatMap(x=>[x.metric,...x.inputs]),
    'ad_spend','attributed_revenue','purchase_merchandise_revenue_excluding_adjustments',
  ])].map(metric=>[metric,'money'])),
  orders:'orders',sessions:'sessions',checkout_sessions:'sessions',units:'units',clicks:'clicks',impressions:'impressions',
};
function validateFinancialLedger(doc,{root}){
  const errors=[],figures=new Map(),values=new Map(),visiting=new Set();
  const fail=(f,msg)=>errors.push(`${f?.id??'ledger'}: ${msg}`);
  const list=Array.isArray(doc)?doc:doc?.figures;
  if(!Array.isArray(list)||!list.length)return {errors:['financial ledger requires nonempty figures'],verified:0};
  let base;try{base=fs.realpathSync(root);}catch{return {errors:['financial source root unavailable'],verified:0};}
  const within=p=>{const rel=path.relative(base,p);return !path.isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+path.sep);};
  for(const f of list){
    if(!f||typeof f.id!=='string'||!f.id||figures.has(f.id)){fail(f,'missing or duplicate id');continue;}
    figures.set(f.id,f);
    if(!Number.isFinite(f.value))fail(f,'finite stated value required');
    if(typeof f.metric!=='string'||!f.metric||typeof f.unit!=='string'||!f.unit)fail(f,'metric and unit required');
    const p=f.period;
    if(!p||typeof p!=='object'||![p.start,p.end].every(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x))&&new Date(x).toISOString().slice(0,10)===x)||p.start>p.end)fail(f,'exact valid period start/end required');
    try{if(!p?.timezone)throw Error();new Intl.DateTimeFormat('en',{timeZone:p.timezone});}catch{fail(f,'valid period timezone required');}
    if(/money/.test(f.unit)&&!(/^[A-Z]{3}$/.test(f.currency??'')))fail(f,'money units require explicit ISO currency');
    if(f.formula||f.rows)fail(f,'financial mode uses typed calc operations, not untyped formula/rows');
    if(f.calc)continue;
    const s=f.source;
    if(!s||typeof s.file!=='string'||!s.file||!(/^[a-f0-9]{64}$/i.test(s.sha256??''))||typeof s.pointer!=='string'||!s.pointer.startsWith('/')){fail(f,'source file, SHA-256 and JSON pointer required');continue;}
    try{
      const target=path.resolve(base,s.file);
      if(!within(target)||!within(fs.realpathSync(target)))throw Error('source escapes allowed root');
      const bytes=fs.readFileSync(target);
      if(crypto.createHash('sha256').update(bytes).digest('hex')!==s.sha256.toLowerCase())throw Error('source hash mismatch');
      let value=JSON.parse(bytes.toString('utf8'));
      for(const rawKey of s.pointer.slice(1).split('/')){
        if(/~(?![01])/u.test(rawKey))throw Error('invalid JSON pointer escape');
        const key=rawKey.replace(/~1/g,'/').replace(/~0/g,'~');
        if(value===null||typeof value!=='object'||!Object.hasOwn(value,key))throw Error('source pointer not found');
        value=value[key];
      }
      if(typeof value!=='number'||!close(f.value,value))throw Error('stated value does not match numeric source pointer');
      values.set(f.id,value);
    }catch(error){fail(f,error.message);}
  }
  function valueOf(id){
    if(values.has(id))return values.get(id);
    const f=figures.get(id);
    if(!f){errors.push(`unknown input ${id}`);return undefined;}
    if(!f.calc){fail(f,'source value is not verified');return undefined;}
    if(visiting.has(id)){fail(f,'calculation cycle');return undefined;}
    visiting.add(id);
    try{
      const c=f.calc;
      if(!Array.isArray(c.inputs)||!c.inputs.length||c.inputs.some(x=>typeof x!=='string'))throw Error('calc.inputs must name ledger figures');
      const parents=c.inputs.map(x=>figures.get(x)),v=c.inputs.map(valueOf);
      if(parents.some(x=>!x)||v.some(x=>!Number.isFinite(x)))throw Error('unverified calculation input');
      if(parents.some(x=>!same(x.period,f.period)))throw Error('period/timezone mismatch; align sources explicitly');
      const currencies=new Set([f,...parents].map(x=>x.currency).filter(Boolean));
      if(currencies.size>1)throw Error('currency mismatch; use a dated normalized source snapshot');
      let result;
      if(Object.hasOwn(commerceOperations,c.op)){
        const spec=commerceOperations[c.op];
        if(f.metric!==spec.metric||f.unit!=='money'||parents.length!==spec.inputs.length||parents.some((x,i)=>x.metric!==spec.inputs[i]||x.unit!=='money'))throw Error('commerce operation requires its exact metric, monetary units and complete ordered component list');
        if(c.inputs.length!==new Set(c.inputs).size)throw Error('commerce operation repeats a component');
        if(!['period_activity','order_cohort'].includes(f.basis)||parents.some(x=>x.basis!==f.basis))throw Error('commerce components must share explicit period_activity or order_cohort basis');
        if(f.basis==='order_cohort'&&(!f.cohort_id||parents.some(x=>x.cohort_id!==f.cohort_id)))throw Error('order-cohort components must share an explicit cohort_id');
        if(!f.currency||parents.some(x=>x.currency!==f.currency))throw Error('commerce components must share one explicit currency');
        if(c.op==='net_merchandise_sales'){
          if(v.some(x=>x<0))throw Error('gross sales, discounts and refund amounts must be nonnegative; signs are applied by the operation');
          if(f.basis==='order_cohort'&&(v[1]>v[0]||v[2]>v[0]-v[1]))throw Error('cohort discounts/refunds exceed merchandise value; reconcile scope or classify non-merchandise adjustments separately');
        }
        if(c.op==='contribution_before_ads'){
          if(f.cost_coverage!==1)throw Error('complete variable-cost coverage required for contribution; explicit zero fields still need sources');
          if(v.slice(1).some(x=>x<0))throw Error('cost/credit/shipping amounts must be nonnegative; signs are applied by the operation');
          if(f.basis==='order_cohort'&&v[2]>v[1])throw Error('restocked COGS credit exceeds cohort landed COGS');
          if(parents[2].reverses!==parents[1].id)throw Error('restocked credit must identify the landed_cogs figure it reverses');
          const costs=[parents[1],parents[3],parents[4],parents[5],parents[7]],buckets=new Set();
          for(const cost of costs){
            if(!Array.isArray(cost.cost_buckets)||cost.cost_buckets.some(x=>typeof x!=='string'||!x)||cost.value!==0&&!cost.cost_buckets.length)throw Error('each variable cost needs explicit non-overlapping cost_buckets');
            for(const bucket of cost.cost_buckets){if(['ad_spend','advertising','paid_media'].includes(bucket))throw Error('before-ad contribution cannot include advertising costs');if(buckets.has(bucket))throw Error('variable cost buckets overlap; count each cost once');buckets.add(bucket);}
          }
        }
        if(c.op==='contribution_after_ads'){
          if(parents[0].cost_coverage!==1||f.cost_coverage!==1)throw Error('complete variable-cost coverage must propagate after advertising');
          if(v[1]<0||parents[1].allocation_method!=='management_allocation'||!parents[1].allocation_note||f.allocation_method!=='management_allocation')throw Error('ad-spend subtraction requires a nonnegative documented management allocation; it is not causal channel profit');
        }
        result=v.reduce((sum,value,i)=>sum+value*spec.signs[i],0);
      }else if(c.op==='sum'){
        if(!Object.hasOwn(additiveUnits,f.metric)||additiveUnits[f.metric]!==f.unit)throw Error('sum requires a supported additive metric and unit; recompute ratios/rates/averages from reconciled totals');
        if(parents.some(x=>x.unit!==f.unit||x.metric!==f.metric||x.basis!==f.basis))throw Error('sum has incompatible units, metrics or bases');
        if(c.inputs.length!==new Set(c.inputs).size)throw Error('sum repeats an input');
        if(parents.some(x=>!x.partition||typeof x.partition!=='string')||new Set(parents.map(x=>x.partition)).size!==parents.length)throw Error('sum requires distinct documented partitions');
        if(parents.some(x=>x.attribution!==parents[0].attribution))throw Error('incompatible attribution windows');
        if(f.metric==='attributed_revenue'){
          if(!parents[0].attribution||f.attribution!==parents[0].attribution)throw Error('attributed revenue needs an explicit matching attribution window');
          const ids=parents.flatMap(x=>Array.isArray(x.order_ids)?x.order_ids:[]);
          if(parents.some(x=>!Array.isArray(x.order_ids)||!x.order_ids.length)||new Set(ids).size!==ids.length)throw Error('attributed revenue sum requires non-overlapping order ids');
        }
        result=v.reduce((a,b)=>a+b,0);
      }else if(c.op==='ratio'){
        if(parents.length!==2||v[1]===0)throw Error('ratio needs two inputs and nonzero denominator');
        const sig=signatures[f.metric];
        if(!sig||parents[0].metric!==sig[0]||parents[1].metric!==sig[1]||f.unit!==sig[2])throw Error('wrong or unsupported metric signature');
        const moneyRatio=['roas','net_sales_mer','contribution_break_even_roas'].includes(f.metric);
        const expectedMoneyUnit=f.metric==='contribution_break_even_roas'?'money_per_order':'money';
        if(moneyRatio&&(parents.some(x=>x.unit!==expectedMoneyUnit)||!parents[0].currency||!parents[1].currency))throw Error('money ratio needs exact monetary units and currency');
        if(f.metric==='roas'&&(!parents[0].attribution||f.attribution!==parents[0].attribution||!parents[0].account_scope||parents[0].account_scope!==parents[1].account_scope||f.account_scope!==parents[0].account_scope))throw Error('ROAS needs matching account_scope and explicit attributed-value reporting window');
        if(['shopify_aov','period_net_sales_per_order'].includes(f.metric)&&(parents[0].unit!=='money'||parents[1].unit!=='orders'||f.currency!==parents[0].currency))throw Error('AOV needs money / orders with the output currency');
        if(f.metric==='order_rate'&&(parents[0].unit!=='orders'||parents[1].unit!=='sessions'))throw Error('order rate units must be orders / sessions');
        if(f.metric==='checkout_conversion'&&(parents[0].unit!=='sessions'||parents[1].unit!=='sessions'))throw Error('checkout conversion needs sessions / sessions');
        if(f.metric==='contribution_break_even_roas'&&(parents[1].cost_coverage!==1||v[1]<=0))throw Error('positive contribution and complete variable cost coverage required; otherwise no viable break-even target');
        result=v[0]/v[1];
      }else throw Error('unsupported financial operation; aggregate ratios from their totals, never an unweighted mean');
      if(!close(f.value,result))throw Error('arithmetic mismatch');
      values.set(id,result);return result;
    }catch(error){fail(f,error.message);return undefined;}finally{visiting.delete(id);}
  }
  for(const id of figures.keys())valueOf(id);
  return {errors:[...new Set(errors)],verified:values.size,limitations:'Source bytes and numeric locators checked. Metric definitions, partition labels, source authenticity and causal attribution still require adapter/analyst review.'};
}
module.exports={validateFinancialLedger};
