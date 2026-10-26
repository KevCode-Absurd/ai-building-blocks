// Local, deterministic utilities. Inputs are data; no fetching, evaluation or file access.
import {parseCsv} from './csv-utils.mjs';

const json=value=>JSON.stringify(value,null,2);
const fail=message=>{throw Error(message);};
const decimal=/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d+))?$/;
function normalizedNumber(token){
  const m=token.match(/^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  let digits=(m[2]+(m[3]??'')).replace(/^0+/,'');
  if(!digits)return '0';
  let power=BigInt(m[4]??'0')-BigInt((m[3]??'').length);
  while(digits.endsWith('0')){digits=digits.slice(0,-1);power++;}
  return `${m[1]}${digits}e${power}`;
}
function object(input){
  if(typeof input!=='string')fail('Paste JSON text.');
  if(input.length>1_000_000)fail('Use at most 1,000,000 characters.');
  let value;try{value=JSON.parse(input);}catch{fail('Enter valid JSON. Use the editable example to check the format.');}
  if(!value||typeof value!=='object'||Array.isArray(value))fail('Enter a JSON object.');
  // JSON.parse otherwise silently rounds long numeric tokens or underflows them to zero.
  const unquoted=input.replace(/"(?:[^"\\]|\\.)*"/gs,'""');
  for(const token of unquoted.match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g)??[]){
    if(token.length>128)fail('Use numeric tokens of at most 128 characters.');
    const n=Number(token);
    if(!Number.isFinite(n)||normalizedNumber(token)!==normalizedNumber(JSON.stringify(n)))fail('Use finite numbers whose digits survive JSON conversion. Shorten excessive precision; keep identifiers as strings.');
  }
  return value;
}
const heading=(value,name)=>{if(typeof value!=='string'||!value.trim())fail(`Provide ${name} as a nonempty column name.`);return value.trim();};

// Compare decimal text with integer bounds without rounding 90.00000000000000001 to 90.
function exceedsBound(token,limit){
  const m=token.match(decimal),fraction=m[3]??m[4]??'';
  const digits=((m[2]??'0')+fraction).replace(/^0+/,'');
  if(!digits)return false;
  const power=BigInt(m[5]??'0')-BigInt(fraction.length);
  const order=BigInt(digits.length)+power,boundDigits=String(limit);
  if(order!==BigInt(boundDigits.length))return order>BigInt(boundDigits.length);
  // Equal order bounds power by the short input length, so this never allocates a huge exponent.
  const left=digits+'0'.repeat(Math.max(0,Number(power)));
  const right=boundDigits+'0'.repeat(Math.max(0,Number(-power)));
  return left>right;
}
function coordinate(raw,limit){
  const text=raw.trim();
  if(!text)return {raw,value:null,error:'EMPTY',message:'A coordinate is missing.'};
  if(text.length>128)return {raw,value:null,error:'TOO_LONG',message:'Use a decimal coordinate of at most 128 characters.'};
  if(!decimal.test(text))return {raw,value:null,error:'NOT_DECIMAL',message:'Use a finite decimal-degree number, not text or another numeric notation.'};
  const n=Number(text);
  if(!Number.isFinite(n))return {raw,value:null,error:'NON_FINITE',message:'The coordinate must be finite.'};
  const mantissa=text.split(/[eE]/)[0];
  if(n===0&&/[1-9]/.test(mantissa))return {raw,value:null,error:'UNDERFLOW',message:'This nonzero coordinate is too small for JavaScript numeric conversion.'};
  if(exceedsBound(text,limit))return {raw,value:n,error:'OUT_OF_RANGE',message:`Expected a value from -${limit} to ${limit}, inclusive.`};
  return {raw,value:n,error:null};
}

export function checkCoordinateCsv(input){
  const x=object(input);
  if(!['WGS84','EPSG:4326'].includes(x.crs)||x.units!=='decimal-degrees')fail('Declare crs as WGS84 or EPSG:4326 and units as decimal-degrees. Other or unknown coordinate systems are unsupported.');
  const lat=heading(x.latitudeColumn,'latitudeColumn'),lon=heading(x.longitudeColumn,'longitudeColumn');
  if(lat===lon)fail('Latitude and longitude must use different columns.');
  if(typeof x.csv!=='string')fail('Provide csv as a text string.');
  const [rawHeaders,...rows]=parseCsv(x.csv);
  if(!rawHeaders||!rows.length)fail('Add a CSV header and at least one coordinate record.');
  if(rows.length>10_000)fail('Check at most 10,000 records at a time.');
  const headers=rawHeaders.map(s=>s.trim());
  if(headers.some(h=>!h)||new Set(headers).size!==headers.length)fail('Give every CSV column a different, nonempty heading.');
  const latIndex=headers.indexOf(lat),lonIndex=headers.indexOf(lon);
  if(latIndex<0||lonIndex<0)fail('The selected latitudeColumn and longitudeColumn must match CSV headings exactly, including case.');
  if(x.idColumn!==undefined){const id=heading(x.idColumn,'idColumn');if(!headers.includes(id))fail('idColumn must match a CSV heading.');}
  const records=rows.map((cells,index)=>{
    if(cells.length!==headers.length)fail(`CSV record ${index+2} has ${cells.length} cells; expected ${headers.length}. Quoted multiline cells count as one record.`);
    const latitude=coordinate(cells[latIndex],90),longitude=coordinate(cells[lonIndex],180);
    const valid=!latitude.error&&!longitude.error;
    const swappedLatitude=coordinate(cells[lonIndex],90),swappedLongitude=coordinate(cells[latIndex],180);
    const swapHint=!valid&&!swappedLatitude.error&&!swappedLongitude.error;
    return {csvRecord:index+2,...(x.idColumn!==undefined?{id:cells[headers.indexOf(x.idColumn.trim())]}:{}),values:Object.fromEntries(headers.map((h,i)=>[h,cells[i]])),latitude,longitude,rangeValid:valid,...(swapHint?{swapHint:'The reversed columns fit numeric ranges. Check authoritative column/CRS metadata; this does not prove they are swapped.',automaticCorrectionApplied:false}:{})};
  });
  const invalid=records.filter(r=>!r.rangeValid).length;
  return json({status:invalid?'needs-review':'range-checks-passed',declaredCrs:x.crs,units:x.units,latitudeColumn:lat,longitudeColumn:lon,summary:{records:records.length,rangeValid:records.length-invalid,invalid,swapHints:records.filter(r=>r.swapHint).length},records,assumptions:['The user declares WGS84 decimal degrees and chooses the coordinate columns. The tool cannot verify that declaration.','Ranges are checked exactly from decimal text. Numeric result values use JavaScript floating point; original cell text is preserved.','Plausible ranges do not prove axis order, actual CRS, positional accuracy or whether a point belongs in the intended location.'],limitations:'No reprojection, geocoding, geometry/topology check, coordinate correction or file mutation is performed. CSV record numbers are logical records, not physical text-line numbers.'});
}

export function checkFrameBudget(input){
  const x=object(input);
  if(typeof x.targetFps!=='number'||!Number.isFinite(x.targetFps)||x.targetFps<=0)fail('Provide targetFps as a positive finite number.');
  for(const key of ['cpuMs','gpuMs'])if(typeof x[key]!=='number'||!Number.isFinite(x[key])||x[key]<0)fail(`Provide ${key} as a nonnegative finite number in milliseconds.`);
  const budgetMs=1000/x.targetFps;
  if(!Number.isFinite(budgetMs)||budgetMs<=0)fail('The target FPS is outside the finite calculation range.');
  const compare=ms=>{
    const headroomMs=budgetMs-ms,utilizationPercent=ms/budgetMs*100;
    if(!Number.isFinite(headroomMs)||!Number.isFinite(utilizationPercent))fail('Timing and FPS values are too large relative to each other for a finite calculation.');
    return {suppliedMs:ms,headroomMs,overrunMs:Math.max(0,-headroomMs),utilizationPercent,comparison:headroomMs>0?'under budget':headroomMs<0?'over budget':'at budget'};
  };
  return json({targetFps:x.targetFps,budgetMs,formula:'frame budget (ms) = 1000 / target FPS; component headroom = budget - supplied component milliseconds',cpu:compare(x.cpuMs),gpu:compare(x.gpuMs),pipelineLowerBound:{milliseconds:Math.max(x.cpuMs,x.gpuMs),largerSuppliedComponent:x.cpuMs===x.gpuMs?'equal':x.cpuMs>x.gpuMs?'cpu':'gpu',meaning:'A best-case lower bound if CPU and GPU work can overlap completely. Synchronization, waits and other work may make actual frames slower.'},assumptions:['Inputs are supplied timings, not measurements made by this tool. Use comparable profiling captures and consistent units.','CPU and GPU durations can overlap; they are compared separately and are never added.','The lower bound is not observed frame time, guaranteed FPS or proof that a device meets the chosen target.'],limitations:'No profiling, optimization, thermal assessment or real-time frame-pacing test is performed. Comparisons use full numeric precision before display.'});
}

export const AGENCY_TECHNICAL_TOOLS=[
  {slug:'coordinate-csv-checker',short:'Coordinate CSV checker',category:'operations',summary:'Check declared WGS84 latitude and longitude columns for missing, invalid or out-of-range values.',help:'Paste JSON with csv, crs (WGS84 or EPSG:4326), units (decimal-degrees), latitudeColumn and longitudeColumn. idColumn is optional. Column names are case-sensitive. Use at most 10,000 data records and 1,000,000 JSON input characters. This checks ranges only; it never guesses CRS or swaps coordinates.',example:json({crs:'EPSG:4326',units:'decimal-degrees',latitudeColumn:'latitude',longitudeColumn:'longitude',idColumn:'id',csv:'id,latitude,longitude\n0012,12.9716,77.5946\n0013,95,45'}),run:checkCoordinateCsv,extension:'json'},
  {slug:'frame-budget-checker',short:'Frame budget checker',category:'design',summary:'Compare supplied CPU and GPU frame timings with a target frame-rate deadline, with separate headroom for each.',help:'Paste JSON with targetFps, cpuMs and gpuMs. FPS must be positive; timings must be nonnegative finite numbers in milliseconds. Results are calculations from your inputs, not a device benchmark. CPU and GPU times are never added.',example:json({targetFps:60,cpuMs:12,gpuMs:8}),run:checkFrameBudget,extension:'json'},
];
