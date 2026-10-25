import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {unzipSync,strFromU8} from 'fflate';
for(const tag of ['', '@mobile '])test(tag+'app starter copies directly, downloads complete files and recovers from blocked copying',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.route('**/api/auth*',r=>r.fulfill({json:{configured:false}}));
 await page.goto('/apps/starter-pack');await page.locator('#app-loader').waitFor({state:'hidden'});
 const before=page.url();await page.getByTestId('starter-copy').click();await expect(page.getByTestId('starter-copy')).toHaveText('Prompt copied');expect(page.url()).toBe(before);
 const copied=(await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n');expect(copied.length).toBeGreaterThan(100);
 let expected:string[]=[];
 for(const id of ['starter-download','starter-download-bottom']){
  const [file]=await Promise.all([page.waitForEvent('download'),page.getByTestId(id).click()]);expect(await file.failure()).toBeNull();expect(file.suggestedFilename()).toBe('app-starter.zip');
  const archive=unzipSync(await fs.readFile((await file.path())!)),names=Object.keys(archive);expect(names.length).toBeGreaterThanOrEqual(16);
  const prompt=names.find(p=>p.endsWith('START-HERE.md'));expect(prompt).toBeTruthy();expect(strFromU8(archive[prompt!]).replace(/\r\n/g,'\n').split(/\n---\n/).slice(1).join('\n---\n').trim()).toBe(copied);
  if(expected.length)expect(names.sort()).toEqual(expected);else expected=names.sort();
 }
 await page.getByTestId('starter-copy').scrollIntoViewIfNeeded();await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error('Blocked'))}}));
 await page.getByTestId('starter-copy').click();await expect(page.getByLabel('Copy the app starter prompt manually')).toBeVisible();await expect(page.getByLabel('Copy the app starter prompt manually')).toHaveValue(copied);
 await page.evaluate(()=>{URL.createObjectURL=()=>{throw Error('Blocked download')};});
 for(const id of ['starter-download','starter-download-bottom']){
  await page.getByTestId(id).click();
  await expect(page.locator('.toast')).toHaveText('The pack could not be downloaded. Please try again.');
  await expect(page.locator('.toast')).toBeInViewport();await expect(page.getByTestId(id)).toBeEnabled();
  await expect(page.locator('.toast')).toBeHidden();
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
