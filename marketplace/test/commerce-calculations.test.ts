// Illustrative figures only: these fixtures are not any merchant's data.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtempSync,writeFileSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
// @ts-ignore Plain Node portable pack tool.
import * as math from '../packs/shared/tools/commerce-math.mjs';
// @ts-ignore Plain Node portable pack tool.
import {findOffers,judgeOffers,evaluateOffer} from '../packs/shared/tools/check-offers.mjs';
const require=createRequire(import.meta.url);
const {validateFinancialLedger}=require('../packs/shared/tools/quality/financial-ledger.cjs');
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

test('cost pass-through changes only the delta, including unchanged and negative indices',()=>{
  for(const passThrough of [0,.25,1]) near(math.forecastInputCost({currentCost:100,indexChange:0,passThrough}).cost,100);
  near(math.forecastInputCost({currentCost:100,indexChange:.2,passThrough:.25}).cost,105);
  near(math.forecastInputCost({currentCost:100,indexChange:-.2,passThrough:.25}).cost,95);
  assert.throws(()=>math.forecastInputCost({currentCost:100,indexChange:.2,passThrough:2}));
});
test('safety stock scales variance by period and rejects an unsupported independence assumption',()=>{
  near(math.safetyStock({sigma:14,periodDays:7,leadDays:28,z:1.65,iidPeriods:true}).units,46.2);
  assert.throws(()=>math.safetyStock({sigma:14,periodDays:7,leadDays:28,z:1.65,iidPeriods:false}));
});
test('scrap denominators and disjoint demand populations remain explicit',()=>{
  near(math.materialInput({goodUnits:100,scrapRate:.1,basis:'fraction_of_input_lost'}).units,100/.9);
  near(math.materialInput({goodUnits:100,scrapRate:.1,basis:'markup_on_good_units'}).units,110);
  assert.throws(()=>math.materialInput({goodUnits:100,scrapRate:.1}));
  near(math.forecastUnits({baseline:100,baselineScope:'all_customers'}).units,100);
  near(math.forecastUnits({baseline:60,baselineScope:'new_customers_only',repeatForecast:40}).units,100);
  near(math.forecastUnits({baseline:60,baselineScope:'new_customers_only',repeatForecast:40,promotionMultiplier:2}).units,160);
  assert.throws(()=>math.forecastUnits({baseline:100,baselineScope:'all_customers',repeatForecast:40}));
});
test('inventory respects reservations, receipt timing, minimums and cash while exposing early shortages',()=>{
  const input={onHand:100,committed:80,dailyDemand:10,leadDays:7,coverDays:14,safetyUnits:20,receipts:[{day:30,units:200,confirmed:true}],casePack:10,moq:120,unitCost:6,cash:1000};
  const result=math.stockPlan(input);
  assert.equal(result.required,210);assert.equal(result.draftUnits,160);assert.equal(result.draftCash,960);
  assert.equal(result.unfundedUnits,50);assert.equal(result.firstShortageDay,3);assert.equal(result.timeline.length,22);
  assert.equal(math.stockPlan({...input,cash:100}).draftUnits,0);
  const dayZero=math.stockPlan({...input,onHand:0,committed:0,dailyDemand:1,receipts:[{day:0,units:50,confirmed:true}]});
  assert.equal(dayZero.firstShortageDay,null);
});
test('replenishment timing and experiment intervals contradict the former erroneous examples',()=>{
  near(math.replenishmentDay({deliveryDays:7,usageDays:30,usageFraction:.75}).daysFromOrder,29.5);
  const r=math.experimentReadout({controlVisitors:19600,controlOrders:392,variantVisitors:19600,variantOrders:431,practicalAbsoluteLift:.004,plannedHorizonComplete:true,independentRandomization:true});
  assert.equal(r.statisticalRead,'inconclusive');assert.equal(r.practicalBenefitNotRuledOut,true);assert.equal(r.equivalenceEstablished,false);
  assert.ok(r.interval95[0]<0&&r.interval95[1]>.004);
});
test('offers retain decimal precision and reject 100 percent and unresolved stacking',()=>{
  for(const copy of ['Save 15.4% off.','Get 100% off.','Get 15% off, plus an extra 10% off at checkout. Both savings apply to the same order.'])
    assert.ok(judgeOffers(findOffers(copy),15).some((x:any)=>x.level==='FAIL'),copy);
  assert.ok(judgeOffers(findOffers('Save 15% off.'),15).every((x:any)=>x.level==='OK'));
  const result=evaluateOffer({referenceSubtotal:100,currency:'USD',discounts:[{type:'percent',value:15,eligible:true},{type:'percent',value:10,eligible:true}],limit:15,variableCosts:30});
  near(result.effectivePercent,23.5);assert.equal(result.ok,false);assert.equal(result.authority,'arithmetic_only');
  assert.throws(()=>evaluateOffer({referenceSubtotal:100,currency:'USD',discounts:[],limit:15,variableCosts:NaN}));
});

const root=mkdtempSync(path.join(tmpdir(),'financial-source-'));
const snapshot={sales:8200,spend:3000,orders:100,revenue:9000,platform1:10000,platform2:5000,negativeContribution:-50};
const sourceFile=path.join(root,'snapshot.json');writeFileSync(sourceFile,JSON.stringify(snapshot));
const sha=createHash('sha256').update(readFileSync(sourceFile)).digest('hex');
const period={start:'2026-11-02',end:'2026-11-08',timezone:'UTC'};
const f=(id:string,value:number,metric:string,extra:Record<string,unknown>={})=>({id,value,metric,unit:'money',currency:'USD',period,source:{file:'snapshot.json',sha256:sha,pointer:'/'+id},...extra});
const sales=f('sales',8200,'net_merchandise_sales'),spend=f('spend',3000,'ad_spend');
const mer=f('mer',8200/3000,'net_sales_mer',{unit:'ratio',source:undefined,calc:{op:'ratio',inputs:['sales','spend']}});
const check=(figures:any[])=>validateFinancialLedger({figures},{root});
test('financial gate binds values to exact hash-pinned snapshot fields and typed metric definitions',()=>{
  assert.deepEqual(check([sales,spend,mer]).errors,[]);
  for(const bad of [
    {...sales,source:undefined},
    {...sales,source:{...sales.source,pointer:'/nonexistent'}},
    {...sales,source:{...sales.source,sha256:'0'.repeat(64)}},
    {...sales,value:9999},
    {...sales,source:{...sales.source,file:'../snapshot.json'}},
  ]) assert.ok(check([bad,spend,mer]).errors.length);
});
test('financial ratios reject mismatched currency, period, units and native AOV semantics',()=>{
  for(const bad of [{...spend,currency:'INR'},{...spend,period:{...period,start:'2026-10-02'}},{...spend,unit:'orders'}])assert.ok(check([sales,bad,mer]).errors.length);
  const orders=f('orders',100,'orders',{unit:'orders',currency:undefined});
  const aov=f('aov',82,'shopify_aov',{unit:'money_per_order',source:undefined,calc:{op:'ratio',inputs:['sales','orders']}});
  assert.ok(check([sales,orders,aov]).errors.some((x:string)=>/signature/.test(x)));
  const revenue=f('revenue',9000,'purchase_merchandise_revenue_excluding_adjustments');
  assert.deepEqual(check([revenue,orders,{...aov,value:90,calc:{op:'ratio',inputs:['revenue','orders']}}]).errors,[]);
});
test('financial aggregation rejects overlap, missing partitions, unweighted ratio operations and cycles',()=>{
  const a=f('platform1',10000,'attributed_revenue',{partition:'meta',attribution:'7d',order_ids:['same']}),b=f('platform2',5000,'attributed_revenue',{partition:'google',attribution:'7d',order_ids:['same']});
  const sum=f('total',15000,'attributed_revenue',{source:undefined,attribution:'7d',calc:{op:'sum',inputs:['platform1','platform2']}});
  assert.ok(check([a,b,sum]).errors.some((x:string)=>/non-overlapping/.test(x)));
  assert.ok(check([sales,spend,{...mer,calc:{op:'average',inputs:['sales','spend']}}]).errors.length);
  assert.ok(check([{...mer,calc:{op:'ratio',inputs:['mer','spend']}},spend]).errors.some((x:string)=>/cycle/.test(x)));
});

test('sum cannot certify ROAS, rates, per-order averages or unknown metrics as additive',()=>{
  for(const [metric,unit] of [['roas','ratio'],['shopify_aov','money_per_order'],['order_rate','ratio'],['custom_average','money']]){
    const a=f('platform1',10000,metric,{unit,partition:'a'}),b=f('platform2',5000,metric,{unit,partition:'b'});
    const total=f('total',15000,metric,{unit,source:undefined,calc:{op:'sum',inputs:['platform1','platform2']}});
    assert.ok(check([a,b,total]).errors.some((x:string)=>/supported additive metric/.test(x)),metric);
  }
  const a=f('platform1',10000,'ad_spend',{partition:'a'}),b=f('platform2',5000,'ad_spend',{partition:'b'});
  const total=f('total',15000,'ad_spend',{source:undefined,calc:{op:'sum',inputs:['platform1','platform2']}});
  assert.deepEqual(check([a,b,total]).errors,[]);
});
test('actual numbers CLI enforces financial mode and formula-window/currency consistency',()=>{
  const tool=fileURLToPath(new URL('../packs/shared/tools/quality/numbers.cjs',import.meta.url));
  const run=(doc:unknown,flags:string[]=[])=>{const ledger=path.join(root,'numbers.json');writeFileSync(ledger,JSON.stringify(doc));return spawnSync(process.execPath,[tool,ledger,...flags],{encoding:'utf8'});};
  assert.equal(run({figures:[sales,spend,mer]},['--financial']).status,0);
  const invalid=run({mode:'financial',figures:[{...sales,source:'unverified words'}]});assert.equal(invalid.status,1,invalid.stdout);
  for(const difference of [{unit:'INR'},{period:'month'}]){
    const result=run([{id:'a',value:100,unit:'USD',period:'week'},{id:'b',value:100,unit:'USD',period:'week',...difference},{id:'sum',value:200,formula:'a+b',unit:'USD',period:'week'}]);
    assert.equal(result.status,1,result.stdout);
  }
});


test('financial money ratios reject identically wrong units, undeclared attribution and nonpositive contribution',()=>{
  const revenue=f('platform1',10000,'attributed_revenue',{attribution:'7d-click',account_scope:'meta:123'});
  const cost={...spend,account_scope:'meta:123'};
  const roas=f('roas',10000/3000,'roas',{unit:'ratio',source:undefined,attribution:'7d-click',account_scope:'meta:123',calc:{op:'ratio',inputs:['platform1','spend']}});
  assert.deepEqual(check([revenue,cost,roas]).errors,[]);
  assert.ok(check([{...revenue,unit:'orders'},{...cost,unit:'orders'},roas]).errors.some((x:string)=>/exact monetary/.test(x)));
  assert.ok(check([{...revenue,attribution:undefined},cost,roas]).errors.some((x:string)=>/reporting window/.test(x)));
  const purchase=f('revenue',9000,'purchase_value_per_order',{unit:'money_per_order'});
  const contribution=f('negativeContribution',-50,'expected_contribution_before_ads_per_order',{unit:'money_per_order',cost_coverage:1});
  const be=f('be',-180,'contribution_break_even_roas',{unit:'ratio',source:undefined,calc:{op:'ratio',inputs:['revenue','negativeContribution']}});
  assert.ok(check([purchase,contribution,be]).errors.some((x:string)=>/positive contribution/.test(x)));
});

function contributionFixture(overrides:Record<string,number>={}){
  const root=mkdtempSync(path.join(tmpdir(),'contribution-source-'));
  const data={gross_merchandise_sales:10000,merchandise_discounts:1000,merchandise_refunds:300,landed_cogs:3500,restocked_cogs_credit:120,fulfilment_cost:700,payment_fees:261,return_handling_cost:60,shipping_revenue_ex_tax:200,other_variable_costs:0,allocated_ad_spend:3000,...overrides};
  const file=path.join(root,'source.json');writeFileSync(file,JSON.stringify(data));const sha256=createHash('sha256').update(readFileSync(file)).digest('hex');
  const common={unit:'money',currency:'USD',period,basis:'order_cohort',cohort_id:'orders-created-2026-11-02-to-08'};
  const figures:any[]=Object.entries(data).map(([metric,value])=>({id:metric,metric,value,...common,source:{file:'source.json',sha256,pointer:'/'+metric}}));
  const at=(id:string)=>figures.find(f=>f.id===id);
  at('landed_cogs').cost_buckets=['product'];at('restocked_cogs_credit').reverses='landed_cogs';
  at('fulfilment_cost').cost_buckets=['shipping_out','pick_pack'];at('payment_fees').cost_buckets=['payment_processing'];
  at('return_handling_cost').cost_buckets=['return_handling'];at('other_variable_costs').cost_buckets=[];
  Object.assign(at('allocated_ad_spend'),{allocation_method:'management_allocation',allocation_note:'This period spend assigned to current order cohort; not causal channel profit.'});
  const net=data.gross_merchandise_sales-data.merchandise_discounts-data.merchandise_refunds;
  const before=net-data.landed_cogs+data.restocked_cogs_credit-data.fulfilment_cost-data.payment_fees-data.return_handling_cost+data.shipping_revenue_ex_tax-data.other_variable_costs;
  figures.push({id:'net',metric:'net_merchandise_sales',value:net,...common,calc:{op:'net_merchandise_sales',inputs:['gross_merchandise_sales','merchandise_discounts','merchandise_refunds']}});
  figures.push({id:'before',metric:'contribution_before_ads',value:before,...common,cost_coverage:1,calc:{op:'contribution_before_ads',inputs:['net','landed_cogs','restocked_cogs_credit','fulfilment_cost','payment_fees','return_handling_cost','shipping_revenue_ex_tax','other_variable_costs']}});
  figures.push({id:'after',metric:'contribution_after_ads',value:before-data.allocated_ad_spend,...common,cost_coverage:1,allocation_method:'management_allocation',calc:{op:'contribution_after_ads',inputs:['before','allocated_ad_spend']}});
  return {root,figures,at,run:()=>validateFinancialLedger({figures},{root})};
}
test('typed cohort contribution verifies the complete 8700 -> 4499 -> 1499 example from source components',()=>{
  const f=contributionFixture();assert.equal(f.at('net').value,8700);assert.equal(f.at('before').value,4499);assert.equal(f.at('after').value,1499);
  assert.deepEqual(f.run().errors,[]);
  // A real negative contribution is a valid result, not an invalid number to suppress.
  const loss=contributionFixture({landed_cogs:9000});assert.ok(loss.at('before').value<0);assert.ok(loss.at('after').value<0);assert.deepEqual(loss.run().errors,[]);
});
test('typed contribution rejects omitted costs, wrong signs/metrics, overlap, mixed cohorts and undocumented ad allocation',()=>{
  const changes=[
    (f:any)=>{f.at('before').calc.inputs.pop();},
    (f:any)=>{f.at('before').cost_coverage=.8;},
    (f:any)=>{f.at('merchandise_refunds').basis='period_activity';},
    (f:any)=>{f.at('merchandise_refunds').cohort_id='prior-orders';},
    (f:any)=>{f.at('fulfilment_cost').cost_buckets=['payment_processing'];},
    (f:any)=>{f.at('other_variable_costs').cost_buckets=['advertising'];},
    (f:any)=>{f.at('restocked_cogs_credit').reverses='another-cohort';},
    (f:any)=>{f.at('allocated_ad_spend').allocation_note=undefined;},
    (f:any)=>{f.at('shipping_revenue_ex_tax').metric='shipping_after_fulfilment_cost';},
    (f:any)=>{f.at('after').value=4499;},
  ];
  for(const mutate of changes){const f=contributionFixture();mutate(f);assert.ok(f.run().errors.length,mutate.toString());}
  assert.ok(contributionFixture({merchandise_refunds:-300}).run().errors.length);
  assert.ok(contributionFixture({restocked_cogs_credit:4000}).run().errors.length);
});
