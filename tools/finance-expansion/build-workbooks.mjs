// Author native illustrative model examples using the approved Artifact Tool runtime.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { Workbook, SpreadsheetFile, FileBlob } from '@oai/artifact-tool';
import { evaluateModel, defaultInputs, excelFormula, excelConstraint } from './model-engine.mjs';

const repo=path.resolve(import.meta.dirname,'../..');
const start=Number(process.argv[2]??0), limit=Number(process.argv[3]??100);
assert(Number.isInteger(start)&&start>=0&&Number.isInteger(limit)&&limit>0&&limit<=100);
const output=process.argv[4] ? path.resolve(process.argv[4]) : path.resolve(repo,'outputs/finance-expansion-01a16358');
const sourceRoot=process.argv[5] ? path.resolve(process.argv[5]) : repo;
const selectedShard=process.argv[6];
const shardNames=['public-markets','private-deals','operating-credit'];
assert(!selectedShard||shardNames.includes(selectedShard),'Unknown finance source shard.');
const shards=await Promise.all((selectedShard?[selectedShard]:shardNames).map(async name=>JSON.parse(await fs.readFile(path.join(repo,`tools/finance-expansion/${name}.json`),'utf8'))));
const skills=shards.flatMap(shard=>shard.skills).slice(start,start+limit);
assert(skills.length>0);
await fs.mkdir(output,{recursive:true});
const results=[];
async function writeReport(file,content){const temporary=file+'.tmp';await fs.writeFile(temporary,content);for(let attempt=0;;attempt++){try{await fs.rename(temporary,file);return;}catch(error){if(attempt>=12)throw error;await new Promise(resolve=>setTimeout(resolve,150));}}}
const close=(actual,expected,label)=>assert(typeof actual==='number' && Number.isFinite(actual) && Math.abs(actual-expected)<=1e-7+1e-9*Math.abs(expected),`${label}: ${JSON.stringify(actual)} != ${expected}`);
const format=unit=>/(?:^|\s)(fraction|decimal|rate|percent|percentage)(?:$|\s)/i.test(unit)?'0.0%;(0.0%);"-"':/^(x|times|multiple)$/i.test(unit)?'0.00"x"':'#,##0.00;(#,##0.00);"-"';
for(const spec of skills) {
  const model=spec.model, wb=Workbook.create(), sheet=wb.worksheets.add('Model');
  sheet.showGridLines=false;
  const outputStart=7, buildStart=outputStart+model.outputs.length+3, inputStart=buildStart+model.calculations.length+3;
  const scopeRow=inputStart+model.inputs.length+3, sourceRow=scopeRow+3, endRow=sourceRow+2+spec.references.length*3;
  const area=sheet.getRange(`B1:D${endRow}`);
  area.format.font={name:'Arial',size:11,color:'#202938'};
  area.format.verticalAlignment='center';area.format.rowHeight=22;
  sheet.getRange(`B1:B${endRow}`).format.columnWidth=70;
  sheet.getRange(`C1:C${endRow}`).format.columnWidth=22;
  sheet.getRange(`D1:D${endRow}`).format.columnWidth=27;
  sheet.getRange('B2').values=[[spec.name]];
  sheet.getRange('B2').format.font={name:'Arial',size:15,bold:true,color:'#142D4E'};
  sheet.getRange('B2').format.wrapText=true;sheet.getRange('B2:D2').format.rowHeight=45;
  sheet.getRange('B4').values=[['Illustrative figures only. Editable inputs are blue.']];
  sheet.getRange('B4').format.font={name:'Arial',size:11,italic:true,color:'#5C6676'};
  const header=(row,name)=>{const r=sheet.getRange(`B${row}:D${row}`);r.values=[[name,'Value','Unit']];r.format.fill='#203D63';r.format.font={name:'Arial',size:11,color:'#FFFFFF',bold:true};r.format.rowHeight=26;};
  header(outputStart-1,'Outputs');header(buildStart-1,'Calculation');header(inputStart-1,'Editable input');
  const addresses={},inputById=new Map();
  model.inputs.forEach((input,index)=>{addresses[input.id]=`C${inputStart+index}`;inputById.set(input.id,input);sheet.getRange(`B${inputStart+index}:D${inputStart+index}`).values=[[input.label,input.value,input.unit]];sheet.getRange(addresses[input.id]).format.font={name:'Arial',size:11,color:'#0000FF'};sheet.getRange(addresses[input.id]).setNumberFormat(format(input.unit));});
  model.calculations.forEach((node,index)=>{addresses[node.id]=`C${buildStart+index}`;sheet.getRange(`B${buildStart+index}`).values=[[node.label]];sheet.getRange(`D${buildStart+index}`).values=[[node.unit]];sheet.getRange(addresses[node.id]).setNumberFormat(/recon|difference|check|gap/i.test(node.id)?'0.00;(0.00);0.00':format(node.unit));});
  const cashflowRanges={};let cashRow=endRow+3;
  for(const node of model.calculations.filter(node=>node.op==='irr')) {
    sheet.getRange(`B${cashRow}`).values=[['Periodic IRR cash flows, starting at period zero']];
    node.args.forEach((arg,index)=>{sheet.getRange(`C${cashRow+index+1}`).formulas=[[`=${typeof arg==='string'?addresses[arg]:arg}`]];sheet.getRange(`B${cashRow+index+1}`).values=[[`Period ${index}`]];});
    cashflowRanges[node.id]=`C${cashRow+1}:C${cashRow+node.args.length}`;cashRow+=node.args.length+3;
  }
  for(const node of model.calculations) {
    let formula=excelFormula(node,addresses,cashflowRanges);
    const guards=node.args.filter(arg=>typeof arg==='string'&&inputById.has(arg)).flatMap(id=>{const input=inputById.get(id),cell=addresses[id];return [`ISNUMBER(${cell})`,...(input.min!==undefined?[`${cell}>=${input.min}`]:[]),...(input.max!==undefined?[`${cell}<=${input.max}`]:[])];});
    if(guards.length)formula=`=IF(AND(${[...new Set(guards)].join(',')}),${formula.slice(1)},NA())`;
    sheet.getRange(addresses[node.id]).formulas=[[formula]];
  }
  const constraints=(model.constraints??[]).map(constraint=>excelConstraint(constraint,addresses));
  if(constraints.length){sheet.getRange('B5').formulas=[[`=IF(AND(${constraints.join(',')}),"Numeric domain checks pass; source evidence still needs review.","INPUT CHECK FAILED: inspect the stated numeric domain.")`]];sheet.getRange('B5').format.font={name:'Arial',size:10,color:'#5C6676'};sheet.getRange('B5').conditionalFormats.addCustom(`NOT(AND(${constraints.join(',')}))`,{fill:'#FDE8E8',font:{color:'#B42318',bold:true}});}
  model.outputs.forEach((id,index)=>{const owner=model.calculations.find(node=>node.id===id)??inputById.get(id);const row=outputStart+index;sheet.getRange(`B${row}`).values=[[owner.label]];sheet.getRange(`C${row}`).formulas=[[constraints.length?`=IF(AND(${constraints.join(',')}),${addresses[id]},NA())`:`=${addresses[id]}`]];sheet.getRange(`D${row}`).values=[[owner.unit]];sheet.getRange(`C${row}`).setNumberFormat(format(owner.unit));sheet.getRange(`B${row}:D${row}`).format.font={name:'Arial',size:11,color:'#202938',bold:true};});
  sheet.getRange(`B${scopeRow}`).values=[['Model scope']];sheet.getRange(`B${scopeRow}`).format.font={name:'Arial',size:11,bold:true};
  sheet.getRange(`B${scopeRow+1}`).values=[[model.explanation]];sheet.getRange(`B${scopeRow+1}`).format.wrapText=true;sheet.getRange(`B${scopeRow+1}:D${scopeRow+1}`).format.rowHeight=Math.max(44,18*Math.ceil(model.explanation.length/65));
  sheet.getRange(`B${sourceRow}`).values=[['Source: original illustrative inputs, not actual company data.']];
  spec.references.forEach((ref,index)=>{const row=sourceRow+2+index*3;sheet.getRange(`B${row}`).values=[[ref.title]];sheet.getRange(`B${row+1}`).values=[[ref.url]];sheet.getRange(`B${row+1}`).format.wrapText=true;sheet.getRange(`B${row+1}:D${row+1}`).format.rowHeight=Math.max(35,18*Math.ceil(ref.url.length/65));});
  sheet.getRange(`C${outputStart}:C${inputStart+model.inputs.length}`).format.horizontalAlignment='right';
  for(const row of [outputStart-1,buildStart-1,inputStart-1])sheet.getRange(`C${row}`).format.horizontalAlignment='left';
  for(const input of model.inputs) {
    const cell=addresses[input.id];
    const invalid=[`NOT(ISNUMBER(${cell}))`,...(input.min!==undefined?[`${cell}<${input.min}`]:[]),...(input.max!==undefined?[`${cell}>${input.max}`]:[])];
    sheet.getRange(cell).conditionalFormats.addCustom(`OR(${invalid.join(',')})`,{fill:'#FDE8E8',font:{color:'#B42318',bold:true}});
  }
  wb.recalculate();
  const baseline=evaluateModel(model);
  for(const node of model.calculations)close(sheet.getRange(addresses[node.id]).values[0][0],baseline.values[node.id],`${spec.slug} baseline ${node.id}`);
  model.outputs.forEach((id,index)=>close(sheet.getRange(`C${outputStart+index}`).values[0][0],baseline.outputs[id],`${spec.slug} baseline output ${id}`));
  const changed=model.cases.find(fixture=>!fixture.error);
  const invalid=model.cases.find(fixture=>fixture.error);
  const nativeCases=[];
  for(const fixture of model.cases){
    for(const input of model.inputs)sheet.getRange(addresses[input.id]).values=[[input.value]];
    for(const [id,value] of Object.entries(fixture.inputs))sheet.getRange(addresses[id]).values=[[value]];
    wb.recalculate();
    if(fixture.error)assert(model.outputs.some((id,index)=>{const value=sheet.getRange(`C${outputStart+index}`).values[0][0];return typeof value!=='number'||!Number.isFinite(value);}),`${spec.slug}: native workbook hid invalid case ${fixture.name}`);
    else{const altered=evaluateModel(model,{...defaultInputs(model),...fixture.inputs});for(const node of model.calculations)close(sheet.getRange(addresses[node.id]).values[0][0],altered.values[node.id],`${spec.slug} ${fixture.name} ${node.id}`);model.outputs.forEach((id,index)=>close(sheet.getRange(`C${outputStart+index}`).values[0][0],altered.outputs[id],`${spec.slug} ${fixture.name} output ${id}`));}
    nativeCases.push({name:fixture.name,kind:fixture.error?'refusal':'changed-input',status:'pass'});
  }
  for(const input of model.inputs)sheet.getRange(addresses[input.id]).values=[[input.value]];
  wb.recalculate();
  const finalEnd=Math.max(endRow,cashRow-1);
  if(finalEnd>endRow){const helper=sheet.getRange(`B${endRow+1}:D${finalEnd}`);helper.format.font={name:'Arial',size:11,color:'#202938'};helper.format.rowHeight=22;sheet.getRange(`C${endRow+1}:C${finalEnd}`).setNumberFormat('#,##0.00;(#,##0.00);"-"');}
  const inspection=await wb.inspect({kind:'region',sheetId:'Model',range:`B${outputStart}:D${outputStart+model.outputs.length-1}`,maxChars:1600,tableMaxRows:10,tableMaxCols:3});
  const preview=await wb.render({sheetName:'Model',range:`B1:D${finalEnd}`,scale:1,format:'png'});
  const previewPath=path.join(output,`${spec.slug}.png`);await fs.writeFile(previewPath,new Uint8Array(await preview.arrayBuffer()));
  const nativePath=path.join(output,`${spec.slug}.xlsx`);const native=await SpreadsheetFile.exportXlsx(wb);await native.save(nativePath);
  const reopened=await SpreadsheetFile.importXlsx(await FileBlob.load(nativePath));reopened.recalculate();
  const reopenedSheet=reopened.worksheets.getItem('Model');
  for(const node of model.calculations)close(reopenedSheet.getRange(addresses[node.id]).values[0][0],baseline.values[node.id],`${spec.slug} reopened ${node.id}`);
  model.outputs.forEach((id,index)=>close(reopenedSheet.getRange(`C${outputStart+index}`).values[0][0],baseline.outputs[id],`${spec.slug} reopened output ${id}`));
  for(const node of model.calculations)assert(reopenedSheet.getRange(addresses[node.id]).formulas[0][0]?.startsWith('='),`${spec.slug}: lost native formula ${node.id}`);
  const destination=path.join(sourceRoot,`catalogue-items/general/${spec.slug}/examples/model.xlsx`);
  await fs.mkdir(path.dirname(destination),{recursive:true});
  await fs.mkdir(path.join(sourceRoot,`catalogue-items/general/${spec.slug}/references`),{recursive:true});
  await fs.copyFile(nativePath,destination);
  const bytes=await fs.readFile(nativePath);
  const workbookSpecSha256=crypto.createHash('sha256').update(JSON.stringify({name:spec.name,model:spec.model,references:spec.references})).digest('hex');
  await fs.writeFile(path.join(sourceRoot,`catalogue-items/general/${spec.slug}/references/workbook-verification.json`),JSON.stringify({engine:'Artifact Tool',scope:'Illustrative workbook calculations, not source truth or an actual investment conclusion. Native Microsoft Excel application execution is not claimed.',modelSha256:crypto.createHash('sha256').update(JSON.stringify(model)).digest('hex'),xlsxSha256:crypto.createHash('sha256').update(bytes).digest('hex'),baseline:'pass',changedInputCase:changed.name,invalidInputCase:invalid.name,cases:nativeCases,reopenedAndRecalculated:true,rendered:true,visualReview:'pending'},null,2)+'\n');
  results.push({slug:spec.slug,status:'pass',modelSha256:crypto.createHash('sha256').update(JSON.stringify(model)).digest('hex'),baselineOutputs:baseline.outputs,changedInputCase:changed.name,invalidInputCase:invalid.name,cases:nativeCases,reopenedAndRecalculated:true,formulaCount:model.calculations.length,nativePath,packagePath:destination,previewPath,xlsxSha256:crypto.createHash('sha256').update(bytes).digest('hex'),inspection:inspection.ndjson});
  console.log(`Workbook ${start+results.length}: ${spec.slug}`);
  results.at(-1).workbookSpecSha256=workbookSpecSha256;
  const proofPath=path.join(sourceRoot,`catalogue-items/general/${spec.slug}/references/workbook-verification.json`);
  const proof=JSON.parse(await fs.readFile(proofPath,'utf8'));proof.workbookSpecSha256=workbookSpecSha256;
  await fs.writeFile(proofPath,JSON.stringify(proof,null,2)+'\n');
  await writeReport(path.join(repo,`reports/finance-workbooks-${selectedShard??`${start}-${start+skills.length-1}`}.json`),JSON.stringify({checkedOn:new Date().toISOString(),engine:'Artifact Tool',scope:'Illustrative native workbooks; baseline and changed-input recalculation, render, XLSX export and saved-file reimport checked. Visual review is recorded separately.',passed:results.length,results},null,2)+'\n');
}
