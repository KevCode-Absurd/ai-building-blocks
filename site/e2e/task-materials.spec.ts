import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{
 await page.route('**/api/auth*',r=>r.fulfill({json:{configured:false}}));
 await page.route('**/api/comments*',r=>r.fulfill({json:{enabled:false,comments:[]}}));
});
for(const tag of ['', '@mobile '])test(tag+'task preparation uses its own details and preserves optional instructions and form requirements',async({page})=>{
 await page.goto('/skills/business-data-move-runbook');
 const materials=page.locator('.task-materials');
 await expect(materials).toContainText('Source and target tools, record types and counts.');
 await expect(materials).toContainText('Field details, business timing, test results and responsible owners.');
 await expect(materials.locator('li')).toHaveCount(2);
 await expect(materials).not.toContainText('buyer brief');await expect(materials).not.toContainText('article');
 await expect(page.getByTestId('task-primary').getByRole('button',{name:'Copy skill',exact:true})).toBeEnabled();
 await page.goto('/skills/3d-cutaway-image-ad-maker');
 await expect(materials).toContainText('optional at first, needed before you make the image');
 await expect(materials.locator('li')).toHaveCount(5);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.goto('/prompts/rough-notes-to-minutes-writer');
 const copy=page.getByTestId('composer-copy');await copy.click();await expect(page.getByTestId('task-input-help')).toContainText('Add your details above first.');await expect(page.locator('#composer-text')).toBeFocused();
 await page.locator('#composer-text').fill('Team meeting: Maya will send the draft on Friday.');await expect(copy).toBeEnabled();
});
