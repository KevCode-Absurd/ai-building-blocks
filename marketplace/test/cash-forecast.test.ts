import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Portable pack tool.
import {cashForecast} from '../packs/shared/tools/commerce-math.mjs';
const periods=(receipts=2000)=>Array.from({length:13},(_,i)=>({period:`W${i+1}`,receipts,payments:1700+({0:1800,1:800,2:1200,4:4200}[i]||0)}));
test('cash narrative summary selects first breach from actual rows, not the preceding week',()=>{const r=cashForecast({openingCash:5000,reserve:2000,periods:periods()});assert.equal(r.firstReserveBreach,'W5');assert.equal(r.firstNegativeCash,'W5');assert.equal(r.rows[3].closingCash,2400);assert.equal(r.lowestClosingCash,-1500);assert.equal(r.peakFundingGap,3500);assert.equal(r.endingCash,900);});
test('downside separates first reserve breach from first negative cash and lowest period',()=>{const r=cashForecast({openingCash:5000,reserve:2000,periods:periods(1400)});assert.equal(r.firstReserveBreach,'W2');assert.equal(r.firstNegativeCash,'W5');assert.equal(r.lowestPeriod,'W13');assert.equal(r.peakFundingGap,8900);});
test('reserve equality, zero cash, opening shortfalls and no breach are distinct',()=>{const r=cashForecast({openingCash:0,reserve:2000,periods:[{period:'W1',receipts:2000,payments:0}]});assert.equal(r.firstReserveBreach,null);assert.equal(r.firstNegativeCash,null);assert.equal(r.openingReserveGap,2000);assert.equal(r.peakFundingGap,2000);});
test('cash forecast rejects ambiguous duplicate periods and nonfinite flows',()=>{assert.throws(()=>cashForecast({openingCash:1,reserve:0,periods:[{period:'W1',receipts:0,payments:0},{period:'W1',receipts:0,payments:0}]}));assert.throws(()=>cashForecast({openingCash:1,reserve:0,periods:[{period:'W1',receipts:Infinity,payments:0}]}));});
