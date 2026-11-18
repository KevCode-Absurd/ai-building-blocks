#!/usr/bin/env node
// Deterministic planning arithmetic. No network, purchase orders, or live changes.
// node tools/commerce-math.mjs <input.json>  where input = {operation, inputs}
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

function nonnegative(values) {
  for (const [key,value] of Object.entries(values)) if (!Number.isFinite(value) || value < 0) throw Error(`${key} must be finite and nonnegative`);
}
function fraction(value,name) { if (!Number.isFinite(value) || value < 0 || value > 1) throw Error(`${name} must be between 0 and 1`); }
export function forecastInputCost({currentCost,indexChange,passThrough}) {
  nonnegative({currentCost}); fraction(passThrough,'passThrough');
  if (!Number.isFinite(indexChange) || indexChange < -1) throw Error('indexChange must be a decimal change >= -1');
  return {cost:currentCost*(1+indexChange*passThrough),formula:'currentCost * (1 + indexChange * passThrough)'};
}
export function safetyStock({sigma,periodDays,leadDays,z,iidPeriods}) {
  nonnegative({sigma,periodDays,leadDays,z});
  if (!periodDays || iidPeriods !== true) throw Error('Positive periodDays and independent comparable period errors required; otherwise use horizon forecast errors');
  return {units:z*sigma*Math.sqrt(leadDays/periodDays),model:'independent comparable period errors; supplied z, no guaranteed service level'};
}
export function materialInput({goodUnits,scrapRate,basis}) {
  nonnegative({goodUnits,scrapRate});
  if (basis === 'markup_on_good_units') return {units:goodUnits*(1+scrapRate)};
  if (basis === 'fraction_of_input_lost' && scrapRate < 1) return {units:goodUnits/(1-scrapRate)};
  throw Error('Declare scrap basis; fraction_of_input_lost must be below 1');
}
export function forecastUnits({baseline,baselineScope,repeatForecast,seasonMultiplier=1,trendMultiplier=1,promotionMultiplier=1,repeatPromotionMultiplier=1,pullForwardUnits=0}) {
  nonnegative({baseline,seasonMultiplier,trendMultiplier,promotionMultiplier,repeatPromotionMultiplier,pullForwardUnits});
  let units;
  if (baselineScope === 'all_customers') {
    if (repeatForecast !== undefined || repeatPromotionMultiplier !== 1) throw Error('All-customer baseline already contains returning demand');
    units=baseline*seasonMultiplier*trendMultiplier*promotionMultiplier;
  } else if (baselineScope === 'new_customers_only') {
    nonnegative({repeatForecast});
    units=baseline*seasonMultiplier*trendMultiplier*promotionMultiplier+repeatForecast*repeatPromotionMultiplier;
  } else throw Error('baselineScope must be all_customers or new_customers_only');
  if (pullForwardUnits>units) throw Error('pull-forward deduction exceeds forecast demand');
  return {units:units-pullForwardUnits,scope:baselineScope};
}
export function stockPlan({onHand,committed,backorders=0,dailyDemand,leadDays,coverDays,safetyUnits,receipts=[],casePack,moq,unitCost,cash}) {
  nonnegative({onHand,committed,backorders,dailyDemand,leadDays,coverDays,safetyUnits,casePack,moq,unitCost,cash});
  if (![onHand,committed,backorders,leadDays,coverDays,casePack,moq].every(Number.isInteger) || !casePack || !unitCost || leadDays+coverDays>3650) throw Error('Discrete stock/pack/day inputs required, positive casePack and unitCost, horizon <= 3650 days');
  if (!Array.isArray(receipts) || receipts.some(r=>!Number.isInteger(r.day)||r.day<0||!Number.isInteger(r.units)||r.units<0||typeof r.confirmed!=='boolean')) throw Error('Each receipt needs nonnegative integer day/units and explicit confirmed boolean');
  const horizon=leadDays+coverDays, usable=receipts.filter(r=>r.confirmed&&r.day<=horizon);
  const available=onHand-committed-backorders;
  const rawNeed=Math.max(0,dailyDemand*horizon+safetyUnits-available-usable.reduce((s,r)=>s+r.units,0));
  const required=rawNeed===0?0:Math.ceil(Math.max(rawNeed,moq)/casePack)*casePack;
  const affordable=Math.floor(cash/unitCost/casePack)*casePack;
  const draftUnits=required===0||affordable<moq?0:Math.min(required,affordable);
  let stock=available,firstShortageDay=null;
  const timeline=[];
  for(let day=0;day<=horizon;day++) {
    const receiptUnits=usable.filter(r=>r.day===day).reduce((s,r)=>s+r.units,0);
    const proposedReceipt=day===leadDays?draftUnits:0;
    stock+=receiptUnits+proposedReceipt-(day===0?0:dailyDemand);
    if(stock<0&&firstShortageDay===null)firstShortageDay=day;
    timeline.push({day,receiptUnits,proposedReceipt,projectedAvailable:stock});
  }
  return {required,draftUnits,draftCash:draftUnits*unitCost,unfundedUnits:required-draftUnits,firstShortageDay,timeline,excludedReceipts:receipts.filter(r=>!r.confirmed||r.day>horizon),action:'draft_only',assumptions:'Receipts at start of day, demand at end; commitments and backorders are disjoint and excluded from forecast future demand. No order is placed.'};
}
export function replenishmentDay({deliveryDays,usageDays,usageFraction}) {
  nonnegative({deliveryDays,usageDays}); fraction(usageFraction,'usageFraction');
  return {daysFromOrder:deliveryDays+usageDays*usageFraction,daysFromDelivery:usageDays*usageFraction};
}
export function experimentReadout({controlVisitors,controlOrders,variantVisitors,variantOrders,practicalAbsoluteLift,plannedHorizonComplete,independentRandomization}) {
  nonnegative({controlVisitors,controlOrders,variantVisitors,variantOrders,practicalAbsoluteLift});
  if(![controlVisitors,controlOrders,variantVisitors,variantOrders].every(Number.isInteger)||controlOrders>controlVisitors||variantOrders>variantVisitors)throw Error('Valid integer independent visitor/conversion counts required');
  if(plannedHorizonComplete!==true||independentRandomization!==true)throw Error('Fixed-horizon readout requires completed planned horizon and independent randomization');
  if(Math.min(controlOrders,variantOrders,controlVisitors-controlOrders,variantVisitors-variantOrders)<10)throw Error('Large-count normal interval not suitable; use a prespecified exact or small-sample method');
  const a=controlOrders/controlVisitors,b=variantOrders/variantVisitors,difference=b-a;
  const half=1.959963984540054*Math.sqrt(a*(1-a)/controlVisitors+b*(1-b)/variantVisitors);
  const low=difference-half,high=difference+half;
  return {controlRate:a,variantRate:b,difference,interval95:[low,high],relativeLift:difference/a,statisticalRead:low>0?'positive':high<0?'negative':'inconclusive',practicalBenefitNotRuledOut:high>=practicalAbsoluteLift,equivalenceEstablished:false,method:'Unpooled normal 95% interval; does not verify randomization, multiple-testing policy, guardrails, or causality'};
}
export function capacityPlan({availability,assignments}) {
  if(!Array.isArray(availability)||!availability.length||!Array.isArray(assignments))throw Error('Explicit availability and assignments are required');
  const buckets=new Map(),key=r=>JSON.stringify([r.owner,r.period]);
  for(const row of availability) {
    if(typeof row.owner!=='string'||!row.owner||typeof row.period!=='string'||!row.period||!row.source)throw Error('Availability needs owner, exact period and evidence source');
    nonnegative({hours:row.hours});
    if(buckets.has(key(row)))throw Error('Duplicate availability for one owner/period');
    buckets.set(key(row),{owner:row.owner,period:row.period,available:row.hours,source:row.source,assigned:0,tasks:[]});
  }
  const seen=new Set();
  for(const row of assignments) {
    if(typeof row.task!=='string'||!row.task)throw Error('Every assignment needs a task');
    nonnegative({hours:row.hours});
    const bucket=buckets.get(key(row));if(!bucket)throw Error('Assignment has no sourced availability for this owner/period');
    const id=JSON.stringify([row.owner,row.period,row.task]);if(seen.has(id))throw Error('Repeated task allocation');seen.add(id);
    bucket.assigned+=row.hours;bucket.tasks.push(row.task);
  }
  const periods=[...buckets.values()].map(r=>({...r,remaining:r.available-r.assigned}));
  return {feasible:periods.every(r=>r.remaining>=-1e-9),periods,violations:periods.filter(r=>r.remaining< -1e-9),limitations:'Checks allocation against declared sourced limits; does not authenticate availability or verify estimates. Include existing commitments before adding work.'};
}
/** Conditional queue arithmetic: new arrivals occur before dispatch; overtime stops at first clearance. */
export function backlogRecovery({backlogOrders,arrivalsPerDay,baseCapacityPerDay,overtimeCapacityPerDay,overtimeCostPerDay,horizonDays,currency,population,unit,constantRates,arrivalsExcludeBacklog}) {
  const counts={backlogOrders,arrivalsPerDay,baseCapacityPerDay,overtimeCapacityPerDay,horizonDays};
  nonnegative({...counts,overtimeCostPerDay});
  if(!Object.values(counts).every(Number.isSafeInteger)||horizonDays<1||horizonDays>3650)throw Error('Safe integer order counts and a horizon of 1 to 3650 operating days required');
  if(constantRates!==true||arrivalsExcludeBacklog!==true)throw Error('Explicit constant rates and new arrivals disjoint from the opening backlog required');
  if(unit!=='orders'||typeof population!=='string'||!population.trim())throw Error('One explicit order population and unit orders required; do not mix stock units or tickets');
  if(typeof currency!=='string'||!(/^[A-Z]{3}$/).test(currency))throw Error('Explicit common three-letter currency required for overtime costs');
  let backlog=backlogOrders,firstClearanceDay=backlogOrders===0?0:null,overtimeDays=0,overtimeCost=0;
  let clearedAndStayedClearThroughHorizon=backlogOrders===0;
  const timeline=[];
  for(let day=1;day<=horizonDays;day++) {
    const openingBacklog=backlog,overtimeActive=firstClearanceDay===null&&overtimeCapacityPerDay>0;
    const capacity=baseCapacityPerDay+(overtimeActive?overtimeCapacityPerDay:0),available=openingBacklog+arrivalsPerDay;
    if(!Number.isSafeInteger(capacity)||!Number.isSafeInteger(available))throw Error('Order arithmetic exceeds safe integer range');
    const dispatched=Math.min(capacity,available),dayOvertimeCost=overtimeActive?overtimeCostPerDay:0;
    backlog=available-dispatched;
    overtimeDays+=overtimeActive?1:0;overtimeCost+=dayOvertimeCost;
    if(!Number.isFinite(overtimeCost))throw Error('Overtime cost arithmetic overflow');
    if(firstClearanceDay===null&&backlog===0){firstClearanceDay=day;clearedAndStayedClearThroughHorizon=true;}
    if(firstClearanceDay!==null&&backlog>0)clearedAndStayedClearThroughHorizon=false;
    timeline.push({day,openingBacklog,arrivals:arrivalsPerDay,capacity,dispatched,closingBacklog:backlog,overtimeActive,overtimeCost:dayOvertimeCost});
  }
  return {status:'conditional_scenario',population,unit,currency,firstClearanceDay,endingBacklog:backlog,overtimeDays,overtimeCost,baseCapacityCoversArrivals:baseCapacityPerDay>=arrivalsPerDay,clearedAndStayedClearThroughHorizon,timeline,
    assumptions:'Constant daily arrivals and capacities for one order population; new arrivals exclude the opening backlog and arrive before dispatch. Full daily overtime cost is charged while overtime is active, including the clearance day. Overtime stops at first clearance and is not restarted; the remaining horizon uses base capacity.',
    limitations:'Arithmetic only, not observed clearance, an SLA, calendar dates, staffing availability, source authentication or spending approval. Day-zero clearance describes an empty opening queue, not future capacity stability. Cost covers only declared incremental overtime, not total fulfilment or profit.'};
}
export function cashForecast({openingCash,reserve,periods}) {
  if(!Number.isFinite(openingCash))throw Error('openingCash must be finite');
  nonnegative({reserve});
  if(!Array.isArray(periods)||!periods.length||periods.length>520)throw Error('Provide 1 to 520 ordered cash periods');
  let cash=openingCash;const seen=new Set();
  const rows=periods.map(p=>{
    if(typeof p.period!=='string'||!p.period.trim()||seen.has(p.period))throw Error('Each period needs a unique nonempty label in chronological order');
    seen.add(p.period);nonnegative({receipts:p.receipts,payments:p.payments});
    const opening=cash;cash+=p.receipts-p.payments;
    if(!Number.isFinite(cash))throw Error('Cash arithmetic overflow');
    return {period:p.period,openingCash:opening,receipts:p.receipts,payments:p.payments,closingCash:cash,reserveGap:Math.max(0,reserve-cash)};
  });
  const lowest=rows.reduce((a,b)=>b.closingCash<a.closingCash?b:a);
  return {rows,openingReserveGap:Math.max(0,reserve-openingCash),firstReserveBreach:rows.find(r=>r.closingCash<reserve)?.period??null,firstNegativeCash:rows.find(r=>r.closingCash<0)?.period??null,lowestPeriod:lowest.period,lowestClosingCash:lowest.closingCash,peakFundingGap:Math.max(0,reserve-openingCash,...rows.map(r=>r.reserveGap)),endingCash:cash,limitations:'Period-end arithmetic in supplied chronological order and one currency. Opening shortfall is reported separately. Does not verify source completeness, timing within a period, financing approval or double-counted flows.'};
}
export function toleranceFit({productMin,productMax,openingMin,openingMax,requiredMin,requiredMax,unit}) {
  nonnegative({productMin,productMax,openingMin,openingMax,requiredMin,requiredMax});
  if(!['mm','cm','in'].includes(unit))throw Error('Declare one common unit: mm, cm or in');
  if(productMin>productMax||openingMin>openingMax||requiredMin>requiredMax)throw Error('Each minimum must not exceed its maximum');
  const clearanceMin=openingMin-productMax,clearanceMax=openingMax-productMin;
  return {unit,clearanceMin,clearanceMax,withinTarget:clearanceMin>=requiredMin-1e-9&&clearanceMax<=requiredMax+1e-9,limitations:'Worst-case total dimensional clearance, not radial clearance. Declared ranges only; does not verify measurements, cushioning, material deformation or manufacturing safety.'};
}
const operations={forecastInputCost,safetyStock,materialInput,forecastUnits,stockPlan,replenishmentDay,experimentReadout,capacityPlan,backlogRecovery,cashForecast,toleranceFit};
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{
    const doc=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
    if(!Object.hasOwn(operations,doc.operation))throw Error('Unknown operation');
    console.log(JSON.stringify({ok:true,operation:doc.operation,result:operations[doc.operation](doc.inputs)},null,2));
  }catch(error){console.error(JSON.stringify({ok:false,error:error.message}));process.exitCode=1;}
}
