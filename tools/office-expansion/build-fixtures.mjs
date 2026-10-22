// Public illustrative fixtures. These verify file generation and selected
// calculations; they never claim a run in desktop Excel or PowerPoint.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { Workbook, SpreadsheetFile, FileBlob, Presentation, PresentationFile } from '@oai/artifact-tool';
process.env.RUNTIME_NODE_MODULES='C:/Users/kevin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const workspaceDir=path.resolve('tools/office-expansion');
const output=path.join(workspaceDir,'outputs','01a16276');
const preview=path.join(workspaceDir,'previews');
await fs.mkdir(output,{recursive:true});await fs.mkdir(preview,{recursive:true});
const save=async(file,blob)=>fs.writeFile(file,new Uint8Array(await blob.arrayBuffer()));
const checks=[];
if(process.argv[2]==='xlsx') {
  const wb=Workbook.create(), summary=wb.worksheets.add('Summary'), records=wb.worksheets.add('Records');
  for(const sheet of [summary,records]) { sheet.showGridLines=false;sheet.getRange('A1:H40').format.font={name:'Arial',size:11,color:'#172033'};sheet.getRange('A1:H40').format.rowHeight=22; }
  summary.getRange('B2').values=[['Monthly completion']];summary.getRange('B2:E2').format.font={name:'Arial',size:16,bold:true};
  summary.getRange('B3').values=[['Illustrative training data. January and February 2026.']];summary.getRange('B3:F3').format.font={name:'Arial',size:10,color:'#566377'};
  summary.getRange('B5:E5').values=[['Month','Eligible records','Completed','Completion rate']];
  summary.getRange('B6:B8').values=[['Jan 2026'],['Feb 2026'],['Total']];
  const rows=[];
  for(let i=0;i<30;i++){const jan=i<20,completed=jan?i<12:i<23;rows.push(['R'+String(i+1).padStart(4,'0'),new Date(Date.UTC(2026,jan?0:1,jan?i+1:i-19)),1,completed?1:0,completed?'Closed':'Open']);}
  records.getRange('A2').values=[['Illustrative operational records']];records.getRange('A2:E2').format.font={name:'Arial',size:16,bold:true};
  records.getRange('A3').values=[['Synthetic fixture. No real company or customer data.']];
  records.getRange('A5:E5').values=[['Record ID','Date','Eligible','Completed','Status']];records.getRange('A6:E35').values=rows;
  records.getRange('A6:A105').setNumberFormat('@');records.getRange('B6:B105').setNumberFormat('yyyy-mm-dd');
  const table=records.tables.add('A5:E35',true,'OperationalRecords');table.showBandedRows=true;
  records.getRange('E6:E105').dataValidation={rule:{type:'list',values:['Open','Closed']}};
  records.dataValidations.add({range:'C6:D105',rule:{type:'whole',operator:'between',formula1:0,formula2:1}});
  records.freezePanes.freezeRows(5);records.freezePanes.freezeColumns(1);
  for(let month=1;month<=2;month++) {
    const row=month+5, dates=`Records!$B$6:$B$105,">="&DATE(2026,${month},1),Records!$B$6:$B$105,"<"&DATE(2026,${month+1},1)`;
    summary.getRange(`C${row}`).formulas=[[`=COUNTIFS(${dates},Records!$C$6:$C$105,1)`]];
    summary.getRange(`D${row}`).formulas=[[`=SUMIFS(Records!$D$6:$D$105,${dates},Records!$C$6:$C$105,1)`]];
    summary.getRange(`E${row}`).formulas=[[`=IF(C${row}=0,"n.a.",D${row}/C${row})`]];
  }
  summary.getRange('C8:E8').formulas=[['=SUM(C6:C7)','=SUM(D6:D7)','=IF(C8=0,"n.a.",D8/C8)']];summary.getRange('E6:E8').setNumberFormat('0.0%');summary.getRange('C6:D8').setNumberFormat('0');
  for(const range of [summary.getRange('B5:E5'),records.getRange('A5:E5')])range.format={fill:'#263854',font:{name:'Arial',bold:true,color:'#FFFFFF'},rowHeight:28};
  summary.getRange('B8:E8').format.font={name:'Arial',size:11,bold:true};
  summary.getRange('B:B').format.columnWidth=18;summary.getRange('C:E').format.columnWidth=20;summary.getRange('F:F').format.columnWidth=24;
  records.getRange('A:A').format.columnWidth=16;records.getRange('B:B').format.columnWidth=18;records.getRange('C:E').format.columnWidth=17;
  const chart=summary.charts.add('bar',summary.getRange('B5:D7'));chart.setPosition('B11','F25');chart.title='Eligible and completed records';chart.titleTextStyle.typeface='Arial';chart.titleTextStyle.fontSize=14;chart.xAxis={axisType:'textAxis',textStyle:{typeface:'Arial',fontSize:11}};chart.yAxis={numberFormatCode:'0',numberFormatSourceLinked:false,textStyle:{typeface:'Arial',fontSize:11}};chart.legend={position:'bottom',textStyle:{typeface:'Arial',fontSize:11}};
  wb.recalculate();
  assert.deepEqual(summary.getRange('C6:D7').values,[[20,12],[10,3]]);assert.equal(summary.getRange('E8').values[0][0],.5);checks.push('January20/12,February10/3,total30/15,aggregate50%');
  records.getRange('D6').values=[[0]];wb.recalculate();assert.equal(summary.getRange('D8').values[0][0],14);checks.push('input mutation recalculates totals');records.getRange('D6').values=[[1]];wb.recalculate();
  for(const sheetName of ['Summary','Records'])await save(path.join(preview,`${sheetName}.png`),await wb.render({sheetName,range:sheetName==='Summary'?'A1:F26':'A1:F18',scale:1.5,format:'png'}));
  const file=path.join(output,'office-monthly-example.xlsx');await(await SpreadsheetFile.exportXlsx(wb)).save(file);
  const reopened=await SpreadsheetFile.importXlsx(await FileBlob.load(file));reopened.recalculate();assert.equal(reopened.worksheets.getItem('Records').getRange('A6').values[0][0],'R0001');assert.equal(reopened.worksheets.getItem('Summary').getRange('E8').values[0][0],.5);checks.push('native XLSX export/import retains formulas and correct aggregate');
  const appended=reopened.worksheets.getItem('Records');appended.tables.items[0].rows.add(null,[['R0031',new Date(Date.UTC(2026,1,1)),1,0,'Open']]);reopened.recalculate();const appendValue=reopened.worksheets.getItem('Summary').getRange('C7').values[0][0];const appendVerified=appendValue===11;checks.push(appendVerified?'appended boundary-date row reaches February only':'LIMITATION: appended row calculation returned a Date-typed count in this engine; native Excel append check is still required');
  await fs.writeFile(path.join(output,'xlsx-checks.json'),JSON.stringify({status:'pass',engine:'Artifact Tool calculation and OOXML round trip',desktopExcelRun:false,appendCheckPassed:appendVerified,illustrativeData:true,checks},null,2)+'\n');
  console.log(JSON.stringify({format:'xlsx',status:'pass',checks:checks.length,file}));
} else if(process.argv[2]==='pptx') {
  const skillDir='C:/Users/kevin/.codex/plugins/cache/openai-primary-runtime/presentations/26.1020.11348/skills/presentations';
  const {applyPresentationChartFont,finalizePresentation}=await import(pathToFileURL(path.join(skillDir,'container_tools/artifact_tool_utils.mjs')).href);
  const presentation=Presentation.create({slideSize:{width:1280,height:720}});
  const text=(slide,value,x,y,width,height,size=28,bold=false)=>{const shape=slide.shapes.add({geometry:'textbox',position:{left:x,top:y,width,height},fill:'none',line:{fill:'none',width:0}});shape.text=value;shape.text.style={typeface:'Arial',fontSize:size,bold,color:'#172033'};return shape;};
  const cover=presentation.slides.add();cover.background.fill='#FFFFFF';text(cover,'Monthly operations update',72,200,1100,90,56,true);text(cover,'Illustrative training data\nJanuary and February 2026',72,330,1050,100,30);cover.speakerNotes.text='Illustrative fixture only. These are synthetic operational records, not real company results. Draft speaking budget:30seconds, not a completed rehearsal.';
  const report=presentation.slides.add();report.background.fill='#FFFFFF';text(report,'Monthly completion',72,48,1100,60,44,true);
  const chart=report.charts.add('bar',{position:{left:72,top:150,width:760,height:430},categories:['Jan 2026','Feb 2026'],series:[{name:'Eligible',values:[20,10],fill:'#A7B7CB'},{name:'Completed',values:[12,3],fill:'#263854'}],hasLegend:true,dataLabels:{showValue:true,position:'outEnd'}});applyPresentationChartFont(chart,{fontFamily:'Arial'});
  text(report,'50%',910,220,240,90,68,true);text(report,'15 completed\nof 30 eligible records',910,325,270,120,27);text(report,'Illustrative static chart snapshot. Source:office-monthly-example.xlsx, Summary C6:E8.',72,626,1120,40,19);
  report.speakerNotes.text='Source:office-monthly-example.xlsx Summary C6:E8, Records rows6:35. January12/20=60%;February3/10=30%;combined15/30=50%. The average of monthly percentages is not the aggregate rate. Chart data is an editable literal snapshot, not a live workbook connection. Draft speaking budget:90seconds, not rehearsed.';
  const appendix=presentation.slides.add();appendix.background.fill='#FFFFFF';text(appendix,'Record definitions',72,55,1100,64,44,true);text(appendix,'Eligible records\nOne included operational record in the stated calendar month.',72,180,1100,120,30);text(appendix,'Completed records\nEligible records with the completed flag set to 1.',72,345,1100,120,30);text(appendix,'Completion rate\nCompleted records divided by eligible records for the same period.',72,510,1100,120,30);appendix.speakerNotes.text='Illustrative fixture. Source:office-monthly-example.xlsx,Records columns C:D. Zero eligible records should display n.a., not a made-up percentage. Native application accessibility/navigation checks have not been run.';
  const privateDir=path.join(workspaceDir,'build');await fs.mkdir(privateDir,{recursive:true});const candidatePath=path.join(privateDir,'office-update-draft.pptx');await(await PresentationFile.exportPptx(presentation)).save(candidatePath);
  const finalPath=path.join(output,'office-update-example.pptx');
  await finalizePresentation({workspaceDir,candidatePath,finalPath,pythonExecutable:'C:/Users/kevin/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skillDir,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],explicitTotalSlideCount:3,requiredNativeChartOwnerSlides:[2],materializeLiteralChartWorkbooks:true,fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath:path.join(privateDir,'pptx-validation.json')});
  await fs.copyFile(path.join(privateDir,'pptx-validation.json'),path.join(output,'pptx-validation.json'));
  for(const [i,slide] of presentation.slides.items.entries())await save(path.join(preview,`slide-${i+1}.png`),await presentation.export({slide,format:'png',scale:1}));
  await fs.writeFile(path.join(output,'pptx-checks.json'),JSON.stringify({status:'pass',slides:3,editableChartSlide:2,notesPresent:true,desktopPowerPointRun:false,illustrativeData:true,validationReceipt:'pptx-validation.json'},null,2)+'\n');
  console.log(JSON.stringify({format:'pptx',status:'pass',slides:3,file:finalPath}));
} else throw Error('Pass xlsx or pptx');
