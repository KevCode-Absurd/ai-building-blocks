import { test, expect } from './fixtures/staging-aware-test';
import fs from 'node:fs';
import { unzipSync, strFromU8 } from 'fflate';
import { NEXT_TOOLS } from '../src/tools/next-100-tools.mjs';
import { workflows, agents } from '../../tools/next-100-data.mjs';

const slug = (name:string) => name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const edited: Record<string,[string,string]> = {
  'duplicate-line-remover': ['Blue\nRed\nBlue','Blue\nRed'],
  'line-sorter': ['Zebra\nApple','Apple\nZebra'],
  'csv-markdown-table': ['name,role\nAlex,Reviewer','| Alex | Reviewer |'],
  'json-array-to-csv': ['[{"id":"0007","note":"A,B"}]','0007,"A,B"'],
  'csv-column-profiler': ['name,team\nAlex,Design\nSam,','"missing": 1'],
  'csv-transposer': ['name,Alex,Sam\nrole,Design,Review','Alex,Design'],
  'csv-duplicate-row-remover': ['name,role\nAlex,Review\nAlex,Review','name,role\nAlex,Review'],
  'tsv-to-csv': ['name\trole\nAlex\tReview','Alex,Review'],
  'json-lines-validator': ['{"ok":true}\nnull','Line 2: valid null'],
  'json-array-to-json-lines': ['[{"id":"001"},{"id":"002"}]','{"id":"001"}\n{"id":"002"}'],
  'json-path-inventory': ['{"a/b":{"~x":42}}','/a~1b/~0x'],
  'url-query-inspector': ['https://example.com/new?tag=a&tag=b','"path": "/new"'],
  'url-list-deduplicator': ['https://EXAMPLE.com:443/new\nhttps://example.com/new','https://example.com/new'],
  'unicode-character-inspector': ['A\u00a0B','U+00A0'],
  'html-text-escaper': ['<b>A & B</b>','&lt;b&gt;A &amp; B&lt;/b&gt;'],
  'markdown-heading-outline': ['# Findings\n\n## Caveats','- Findings\n  - Caveats'],
  'markdown-link-inventory': ['[Evidence](https://example.com/evidence)','"label": "Evidence"'],
  'plain-list-to-checklist': ['Review\nShare','- [ ] Review\n- [ ] Share'],
  'time-log-summarizer': ['project,minutes\nReview,30\nReview,45','"totalMinutes": 75'],
  'meeting-action-register': ['action,owner,due,status\nReview,Alex,2026-10-30,open','"owner": "Alex"'],
};
for (const tool of NEXT_TOOLS) test(`next100 utility: ${tool.slug} edits and downloads`, async ({page}, info) => {
  await page.goto(`/tools/${tool.slug}`);
  await expect(page.getByRole('heading',{level:1})).toHaveText(tool.short);
  const output = page.getByTestId('browser-output');
  await expect(output).not.toBeEmpty();
  if (edited[tool.slug]) {
    const [value,expected] = edited[tool.slug];
    await page.getByTestId('browser-input').fill(value);
    await expect(output).toContainText(expected);
  } else if (tool.slug==='utm-link-builder') {
    await page.getByTestId('field-campaign').fill('winter & spring');
    await expect(output).toContainText('utm_campaign=winter+%26+spring');
  } else if (tool.slug==='reading-session-scheduler') {
    await page.getByTestId('field-wordsPerMinute').fill('100');
    await page.getByTestId('field-minutesPerSession').fill('10');
    await page.getByTestId('reading-title-0').fill('New chapter');
    await expect(output).toContainText('New chapter');
    await expect(output).toContainText('"totalMinutes": 85');
  } else if (tool.slug==='text-line-comparer') {
    await page.getByTestId('field-before').fill('Old');
    await page.getByTestId('field-after').fill('New');
    await expect(output).toContainText('- 1 × Old');
    await expect(output).toContainText('+ 1 × New');
  } else if (tool.slug==='csv-column-selector') {
    await page.getByTestId('field-columns').fill('team\nname');
    await expect(output).toContainText('team,name');
  } else if (tool.slug==='url-query-builder') {
    await page.getByTestId('field-params').fill('q=hello & goodbye\ntag=a\ntag=b');
    await expect(output).toContainText('q=hello+%26+goodbye&tag=a&tag=b');
  } else throw Error(`Missing edit case for ${tool.slug}`);
  const expected = (await output.textContent())!;
  const [download] = await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download result',exact:true}).click()]);
  expect(download.suggestedFilename()).toBe(`${tool.slug}.${tool.extension}`);
  const file = info.outputPath(download.suggestedFilename()); await download.saveAs(file);
  expect(fs.readFileSync(file,'utf8')).toBe(expected);
});

for (const [type,items] of [['workflow',workflows],['agent',agents]] as const) for (const item of items) test(`next100 ${type} download: ${slug(item.name)}`,async({page},info)=>{
  const id=slug(item.name);
  await page.goto(`/${type==='agent'?'agents':'workflows'}/${id}`);
  await expect(page.getByRole('heading',{level:1})).toHaveText(item.name);
  await page.getByTestId('block-page').getByTestId('download-handoff').click();
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByTestId('needs-download').click()]);
  const file=info.outputPath(download.suggestedFilename());await download.saveAs(file);
  const files=unzipSync(fs.readFileSync(file));
  for(const name of ['HANDOFF.md','workflow.json','README.txt',`skills/${id}/SKILL.md`])expect(files[name],name).toBeTruthy();
  const own=strFromU8(files[`skills/${id}/SKILL.md`]);
  expect(own).toContain('MISSING:');expect(own).toContain('CHECKS MISSED');
  if(type==='agent'){expect(own).toContain('state.json');expect(own).toContain('at most two correction passes');}
  const definition=JSON.parse(strFromU8(files['workflow.json']));
  expect(definition.steps).toHaveLength(1);expect(definition.steps[0].skill).toBe(id);
});

test('next100 invalid data blocks downloads and recovers after correction',async({page})=>{
  await page.goto('/tools/json-array-to-csv');
  await page.getByTestId('browser-input').fill('[{"id":9007199254740993}]');
  await expect(page.getByRole('alert')).toContainText('exact digits');
  await expect(page.getByRole('button',{name:'Download result',exact:true})).toBeDisabled();
  await page.getByTestId('browser-input').fill('[{"id":"9007199254740993"}]');
  await expect(page.getByTestId('browser-output')).toContainText('9007199254740993');
  await expect(page.getByRole('button',{name:'Download result',exact:true})).toBeEnabled();
  await page.goto('/tools/reading-session-scheduler');
  await page.getByTestId('field-wordsPerMinute').fill('0');
  await expect(page.getByRole('alert')).toContainText('positive');
  await expect(page.getByRole('button',{name:'Download result',exact:true})).toBeDisabled();
  await page.getByTestId('field-wordsPerMinute').fill('200');
  await expect(page.getByTestId('browser-output')).toContainText('totalWords');
});

for(const width of [320,390]) test(`@mobile next100 ${width}px tools and structured forms fit`,async({page},info)=>{
  await page.setViewportSize({width,height:844});
  for(const tool of NEXT_TOOLS){
    await page.goto(`/tools/${tool.slug}`);
    await expect(page.getByRole('heading',{level:1})).toHaveText(tool.short);
    await expect(page.locator('#app-loader')).toBeHidden();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),tool.slug).toBeLessThanOrEqual(0);
    await expect(page.getByRole('button',{name:'Download result',exact:true})).toBeEnabled();
    if(['utm-link-builder','reading-session-scheduler','csv-column-profiler'].includes(tool.slug))await page.screenshot({path:info.outputPath(`${width}-${tool.slug}.png`),fullPage:true});
  }
});

test('next100 tools can be found by name and topic',async({page})=>{
  await page.goto('/tools?topic=ads');
  await expect(page.locator('[data-slug="utm-link-builder"]')).toBeVisible();
  await page.getByTestId('tools-search').fill('UTM');
  await expect(page.getByTestId('tool-card')).toHaveCount(1);
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await page.getByTestId('tools-search').fill('zzqvnomatchingtool');
  await expect(page.getByTestId('tool-card')).toHaveCount(0);
});
