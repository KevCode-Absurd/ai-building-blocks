import test from 'node:test';
import assert from 'node:assert/strict';
import {AGENCY_TECHNICAL_TOOLS,checkCoordinateCsv,checkFrameBudget} from '../src/tools/agency-technical-tools.mjs';
const runCoordinates=(csv,extra={})=>JSON.parse(checkCoordinateCsv(JSON.stringify({crs:'EPSG:4326',units:'decimal-degrees',latitudeColumn:'lat',longitudeColumn:'lon',csv,...extra})));
const runFrame=(targetFps,cpuMs,gpuMs)=>JSON.parse(checkFrameBudget(JSON.stringify({targetFps,cpuMs,gpuMs})));
const close=(actual,expected,tolerance=1e-10)=>assert(Math.abs(actual-expected)<=tolerance,`${actual} differs from ${expected}`);

test('tool definitions expose working JSON examples and distinct routes',()=>{
  assert.deepEqual(AGENCY_TECHNICAL_TOOLS.map(t=>t.slug),['coordinate-csv-checker','frame-budget-checker']);
  for(const tool of AGENCY_TECHNICAL_TOOLS){assert.equal(tool.extension,'json');assert(tool.short&&tool.category&&tool.summary&&tool.help);assert.doesNotThrow(()=>JSON.parse(tool.run(tool.example)));}
});
test('coordinate boundaries are inclusive and out-of-range rows remain visible',()=>{
  const out=runCoordinates('id,lat,lon\na,90,180\nb,-90,-180\nc,91,0\nd,0,-181');
  assert.deepEqual(out.summary,{records:4,rangeValid:2,invalid:2,swapHints:1});
  assert.equal(out.records.length,4);assert.equal(out.records[2].latitude.error,'OUT_OF_RANGE');assert.equal(out.records[3].longitude.error,'OUT_OF_RANGE');
});
test('exact decimal comparison catches values rounding back to geographic limits',()=>{
  const out=runCoordinates('lat,lon\n90.00000000000000001,180\n-90,-180.00000000000000001\n9e1,1.8e2\n0.0000000000001,0');
  assert.equal(out.records[0].latitude.error,'OUT_OF_RANGE');assert.equal(out.records[1].longitude.error,'OUT_OF_RANGE');
  assert.equal(out.records[2].rangeValid,true);assert.equal(out.records[3].rangeValid,true);
});
test('coordinate parser preserves quotes, multiline text, BOM, CRLF and leading-zero IDs',()=>{
  const csv='\uFEFFid,lat,lon,note\r\n0012,12.5,77.5,"A, B"\r\n9007199254740993,-0.25,.5,"first\r\nsecond ""quoted"""\r\n';
  const out=runCoordinates(csv,{idColumn:'id'});
  assert.equal(out.records[0].id,'0012');assert.equal(out.records[1].id,'9007199254740993');assert.equal(out.records[0].values.note,'A, B');assert.equal(out.records[1].values.note,'first\nsecond "quoted"');assert.equal(out.records[1].csvRecord,3);assert.equal(out.status,'range-checks-passed');
});
test('coordinate invalid numbers, empty values and underflow are not converted to zero',()=>{
  const out=runCoordinates('lat,lon\n,0\nNaN,0\nInfinity,0\n1e999,0\n1e-999,0\n0x10,0\ntrue,0\n-0.0,0');
  assert.deepEqual(out.records.map(r=>r.latitude.error),['EMPTY','NOT_DECIMAL','NOT_DECIMAL','NON_FINITE','UNDERFLOW','NOT_DECIMAL','NOT_DECIMAL',null]);
  assert.equal(out.summary.invalid,7);assert.equal(out.records[4].latitude.raw,'1e-999');
});
test('swap hints never correct data or infer ambiguous valid coordinate order',()=>{
  const out=runCoordinates('lat,lon\n120,45\n45,80\n200,45');
  assert(out.records[0].swapHint);assert.equal(out.records[0].automaticCorrectionApplied,false);assert.equal(out.records[0].values.lat,'120');
  assert(!out.records[1].swapHint);assert(!out.records[2].swapHint);assert.match(out.assumptions.join(' '),/do not prove axis order/);
});
test('coordinate assumptions and CSV shape are explicit',()=>{
  for(const extra of [{crs:'EPSG:3857'},{crs:null},{units:'radians'},{latitudeColumn:'lon'},{latitudeColumn:'LAT'},{idColumn:'missing'}])assert.throws(()=>runCoordinates('lat,lon\n0,0',extra));
  for(const csv of ['lat,lat\n0,0',',lon\n0,0','lat,lon','lat,lon\n0','lat,lon\n0,0,0','lat,lon\n"0,0'])assert.throws(()=>runCoordinates(csv));
  assert.throws(()=>runCoordinates('lat,lon\n'+Array.from({length:10001},()=> '0,0').join('\n')),/10,000/);
});
test('untrusted CSV strings and prototype-like headings stay inert text',()=>{
  const out=runCoordinates('lat,lon,__proto__,note\n0,0,safe,<script>alert(1)</script>');
  assert.equal(out.records[0].values.__proto__,'safe');assert.equal(out.records[0].values.note,'<script>alert(1)</script>');assert.equal({}.safe,undefined);
});
test('frame budgets match independently worked common and fractional targets',()=>{
  close(runFrame(60,12,8).budgetMs,50/3);close(runFrame(90,8,9).budgetMs,100/9);close(runFrame(120,6,5).budgetMs,25/3);
  close(runFrame(59.94,10,11).budgetMs,100000/5994);
});
test('CPU and GPU have separate headroom and overlap gives only a lower bound',()=>{
  const out=runFrame(60,20,8);close(out.cpu.overrunMs,10/3);close(out.gpu.headroomMs,26/3);close(out.cpu.utilizationPercent,120);
  assert.equal(out.cpu.comparison,'over budget');assert.equal(out.gpu.comparison,'under budget');assert.equal(out.pipelineLowerBound.milliseconds,20);assert.equal(out.pipelineLowerBound.largerSuppliedComponent,'cpu');assert.notEqual(out.pipelineLowerBound.milliseconds,28);
  assert.match(out.pipelineLowerBound.meaning,/lower bound/);assert.match(out.assumptions.join(' '),/not observed frame time/);
});
test('zero timings and exact boundaries do not create infinity or false overruns',()=>{
  const zero=runFrame(60,0,0);assert.equal(zero.pipelineLowerBound.milliseconds,0);assert.equal(zero.pipelineLowerBound.largerSuppliedComponent,'equal');assert.equal(zero.cpu.utilizationPercent,0);
  const exact=runFrame(64,15.625,15.625);assert.equal(exact.cpu.headroomMs,0);assert.equal(exact.cpu.comparison,'at budget');
  assert.equal(runFrame(60,16.67,8).cpu.comparison,'over budget');
});
test('invalid and excessively imprecise frame inputs fail before arithmetic',()=>{
  for(const value of [{targetFps:0,cpuMs:1,gpuMs:1},{targetFps:-1,cpuMs:1,gpuMs:1},{targetFps:60,cpuMs:-1,gpuMs:1},{targetFps:'60',cpuMs:1,gpuMs:1},{targetFps:60,cpuMs:null,gpuMs:1},{targetFps:60,cpuMs:1}])assert.throws(()=>checkFrameBudget(JSON.stringify(value)));
  for(const text of ['{"targetFps":1e999,"cpuMs":1,"gpuMs":1}','{"targetFps":1e-999,"cpuMs":1,"gpuMs":1}','{"targetFps":60,"cpuMs":9007199254740993,"gpuMs":1}','{"targetFps":60,"cpuMs":1.000000000000000001,"gpuMs":1}','{"targetFps":60,"cpuMs":1,"gpuMs":NaN}'])assert.throws(()=>checkFrameBudget(text));
  assert.throws(()=>runFrame(1e-308,1,1),/finite calculation/);
});
test('both tools reject malformed, nonobject and oversized JSON',()=>{
  for(const tool of AGENCY_TECHNICAL_TOOLS)for(const input of ['{bad}', '[]', 'null', '"text"', ' '.repeat(1_000_001)])assert.throws(()=>tool.run(input));
});
