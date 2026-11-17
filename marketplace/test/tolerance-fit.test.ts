import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Portable pack tool.
import {toleranceFit} from '../packs/shared/tools/commerce-math.mjs';
const base={productMin:70,productMax:70,openingMin:71,openingMax:73,requiredMin:2,requiredMax:4,unit:'mm'};
test('prototype aperture tolerance cannot claim a different clearance range',()=>{const r=toleranceFit(base);assert.equal(r.clearanceMin,1);assert.equal(r.clearanceMax,3);assert.equal(r.withinTarget,false);});
test('matching worst-case endpoints pass, product variation changes acceptance',()=>{assert.equal(toleranceFit({...base,openingMin:72,openingMax:74}).withinTarget,true);const r=toleranceFit({...base,openingMin:72,openingMax:74,productMin:69.5,productMax:70.5});assert.equal(r.clearanceMin,1.5);assert.equal(r.clearanceMax,4.5);assert.equal(r.withinTarget,false);});
test('interference remains negative and is not clipped to zero',()=>{const r=toleranceFit({...base,openingMin:68,openingMax:69,requiredMin:0});assert.equal(r.clearanceMin,-2);assert.equal(r.withinTarget,false);});
test('ambiguous units, missing ranges and inverted bounds fail',()=>{assert.throws(()=>toleranceFit({...base,unit:'mixed'}));assert.throws(()=>toleranceFit({...base,productMin:71}));assert.throws(()=>toleranceFit({...base,productMax:undefined}));});
