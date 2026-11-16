import {test,expect} from './fixtures/staging-aware-test';
import fs from 'node:fs';
import {unzipSync,strFromU8} from 'fflate';

test('one catalogue search combines with domain and format and survives reload',async({page})=>{
 await page.goto('/?area=coding#library');
 await expect(page.getByTestId('results-search')).toHaveCount(0);
 await expect(page.getByTestId('filter-domain')).toHaveCount(0);
 await page.getByTestId('library-search').fill('Qdrant');
 await expect(page.getByTestId('block-card').first()).toContainText('Qdrant');
 await expect(page.getByTestId('result-count')).toContainText('in Coding');
 await page.getByTestId('tab-skill').click();
 await expect(page.getByTestId('block-card').first()).toHaveAttribute('data-kind','skill');
 await page.reload();
 await expect(page.getByTestId('library-search')).toHaveValue('Qdrant');
 await expect(page.getByTestId('result-count')).toContainText('in Coding');
 await expect(page.getByTestId('tab-skill')).toHaveAttribute('aria-selected','true');
 await page.getByRole('button',{name:'Clear filters',exact:true}).click();
 await expect(page.getByTestId('library-search')).toHaveValue('Qdrant');
 await expect(page.getByTestId('result-count')).not.toContainText('in Coding');
 await expect(page.getByTestId('tab-all')).toHaveAttribute('aria-selected','true');
 expect(new URL(page.url()).searchParams.get('area')).toBeNull();
});

test('new workflow packs retain the governing method and complete imported files',async({page},info)=>{
 await page.goto('/workflows/verify-an-mcp-server-release');
 await expect(page.getByRole('heading',{level:1})).toContainText('Verify an MCP server release');
 await page.getByTestId('block-page').getByTestId('download-handoff').click();
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByTestId('needs-download').click()]);
 const file=info.outputPath(download.suggestedFilename());await download.saveAs(file);
 const files=unzipSync(fs.readFileSync(file));
 expect(strFromU8(files['HANDOFF.md'])).toContain('Action boundaries');
 expect(strFromU8(files['skills/verify-an-mcp-server-release/SKILL.md'])).toContain('Reconcile the findings');
 for(const slug of ['copilot-mcp-implementation-security-review','copilot-mcp-security-audit','copilot-mcp-release-qa']){
  expect(files[`skills/${slug}/SKILL.md`]).toBeTruthy();
  expect(files[`skills/${slug}/LICENSE`]).toBeTruthy();
 }
 expect(Object.keys(files).filter(f=>f.endsWith('/SKILL.md'))).toHaveLength(4);
});

test('new agent packs retain state, branch and retry rules',async({page},info)=>{
 await page.goto('/agents/executive-work-keeper');
 await page.getByTestId('block-page').getByTestId('download-handoff').click();
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByTestId('needs-download').click()]);
 const file=info.outputPath(download.suggestedFilename());await download.saveAs(file);
 const files=unzipSync(fs.readFileSync(file));
 const root=strFromU8(files['skills/executive-work-keeper/SKILL.md']);
 expect(root).toContain('outcome-unknown');expect(root).toContain('With no changed sources');
 for(const slug of ['executive-action-register','executive-due-task-drafts','executive-daily-digest'])expect(files[`skills/${slug}/SKILL.md`]).toBeTruthy();
});

test('saved context travels with imported skill files and preserves scripts and licenses',async({page},info)=>{
 await page.goto('/skills/copilot-copilot-usage-metrics');
 await page.getByTestId('open-business').click();
 await page.getByTestId('biz-sells').fill('B2B software for small teams');
 await page.getByTestId('biz-save').click();
 await page.getByTestId('install-claude').click();
 const [dl]=await Promise.all([page.waitForEvent('download'),page.getByTestId('install-zip').click()]);
 const file=info.outputPath(dl.suggestedFilename());await dl.saveAs(file);
 const files=unzipSync(fs.readFileSync(file)),root='copilot-copilot-usage-metrics';
 expect(strFromU8(files[`${root}/SKILL.md`])).toContain('B2B software for small teams');
 expect(strFromU8(files[`${root}/SKILL.md`])).toContain('## Your me.md');
 expect(files[`${root}/get-org-metrics.sh`]).toBeTruthy();
 expect(files[`${root}/LICENSE`]).toBeTruthy();
});

test('a missing imported archive blocks a standalone download',async({page})=>{
 await page.goto('/skills/copilot-copilot-usage-metrics');
 await page.route('**/skills/copilot-copilot-usage-metrics.zip',r=>r.fulfill({status:503,body:'unavailable'}));
 let downloads=0;page.on('download',()=>downloads++);
 await page.getByTestId('install-claude').click();
 await page.getByTestId('install-zip').click();
 await expect(page.getByRole('status')).toContainText('complete skill files');
 expect(downloads).toBe(0);
});

test('saved context is included in a mind pack',async({page},info)=>{
 await page.goto('/minds/claude-hopkins');
 await page.getByTestId('open-business').click();
 await page.getByTestId('biz-sells').fill('Software for small teams');
 await page.getByTestId('biz-save').click();
 await page.getByTestId('mind-skills-all').click();
 const [dl]=await Promise.all([page.waitForEvent('download'),page.getByTestId('mind-pack').click()]);
 const file=info.outputPath(dl.suggestedFilename());await dl.saveAs(file);
 const files=unzipSync(fs.readFileSync(file));
 expect(strFromU8(files['claude-hopkins-pack/me.md'])).toContain('Software for small teams');
 expect(strFromU8(files['claude-hopkins-pack/claude-hopkins/SKILL.md'])).toContain('Software for small teams');
 expect(strFromU8(files['claude-hopkins-pack/README.md'])).toContain('Read me.md');
});

test('home shows a goal search above the fold and How it works remains reachable',async({page})=>{
 await page.goto('/');
 const box=page.getByTestId('library-search');await expect(box).toBeVisible();
 const bounds=await box.boundingBox();expect(bounds!.y+bounds!.height).toBeLessThan(900);
 await expect(page.getByTestId('open-business').locator('.context-full')).toBeVisible();
 await expect(page.getByTestId('open-business').locator('.context-full')).toHaveText('Your context');
 await page.getByRole('link',{name:'How it works',exact:true}).first().click();
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await expect(page).toHaveURL(/how-it-works/);
});

test('@mobile goal search, context and compact filters fit without page overflow',async({page})=>{
 await page.goto('/');
 const box=page.getByTestId('library-search');await expect(box).toBeVisible();
 const b=await box.boundingBox();expect(b!.y+b!.height).toBeLessThan(750);
 const formats=page.getByRole('tablist',{name:'Format'});
 await expect(formats.getByRole('tab')).toHaveCount(6);
 const grid=await page.getByTestId('library-formats').boundingBox();expect(grid!.height).toBeLessThan(190);
 for(const kind of ['agent','mind'])await expect(page.getByTestId(`tab-${kind}`)).toBeInViewport();
 await expect(page.getByTestId('filter-level')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.getByTestId('library-search').fill('Executive');
 await expect(page.getByTestId('library-search')).toHaveValue('Executive');
 await page.getByTestId('open-business').click();
 await expect(page.getByTestId('business-form')).toContainText('Your me.md');
 await page.getByTestId('biz-sells').fill('B2B software');
 await page.getByTestId('biz-save').click();
 await page.reload();
 await page.getByTestId('open-business').click();
 await expect(page.getByTestId('biz-sells')).toHaveValue('B2B software');
 await page.screenshot({path:infoPath('mobile-context.png'),fullPage:false});
});

function infoPath(name:string){return test.info().outputPath(name);}


test('format tiles support keyboard navigation',async({page})=>{
 await page.goto('/#library');
 await page.getByTestId('tab-all').focus();
 await page.keyboard.press('End');
 await expect(page.getByTestId('tab-mind')).toBeFocused();
 await expect(page.getByTestId('tab-mind')).toHaveAttribute('aria-selected','true');
 await expect(page.getByTestId('block-card').first()).toHaveAttribute('data-kind','mind');
 await page.keyboard.press('Home');
 await expect(page.getByTestId('tab-all')).toBeFocused();
 await expect(page.getByTestId('more-filters')).toHaveCount(0);
 await expect(page.getByTestId('filter-level')).toHaveCount(0);
});
