import { chromium, expect } from '@playwright/test';
import { mockComposerAccount } from '../e2e/fixtures/composer-account.ts';
import fs from 'node:fs';
const base = process.env.PERSISTENCE_URL || 'http://127.0.0.1:5195';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
fs.mkdirSync('test-results/persistence', { recursive: true });
const kitData = name => JSON.stringify({kits:[{id:'k',name,slugs:[],updated:1}],flows:[],recent:[],currentFlow:null,draft:null});
try {
  const context=await browser.newContext(), page=await context.newPage(),errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.route('**/api/auth*', route=>route.fulfill({json:{configured:false}}));
  await page.goto(base);
  await expect(page.getByTestId('persistence-bar')).toContainText('no scheduled expiry');
  await openKits(page);
  await page.getByPlaceholder('Name a new kit').fill('Guest launch kit');
  await page.getByPlaceholder('Name a new kit').press('Enter');
  await page.reload();await openKits(page);
  await expect(page.getByRole('textbox',{name:'Kit name',exact:true}).last()).toHaveValue('Guest launch kit');
  await page.screenshot({path:'test-results/persistence/guest-kits.png'});
  assertNoErrors(errors);await context.close();console.log('PASS guest kit creation and reload');

  let data={},revision=0;
  const attach=async target=>{
    await mockComposerAccount(target,true,'alice','alice');
    await target.route('**/api/library',route=>{
      if(route.request().headers().authorization!=='Bearer alice')return route.fulfill({json:{data:{},revision:0}});
      if(route.request().method()==='PUT'){const input=route.request().postDataJSON();if(input.revision!==revision)return route.fulfill({status:409,json:{error:'Changed elsewhere'}});data=input.data;revision++;}
      return route.fulfill({json:{data,revision}});
    });
  };
  const accountContext=await browser.newContext(), accountPage=await accountContext.newPage();
  accountPage.on('pageerror',e=>errors.push(e.message));await attach(accountPage);
  await accountPage.addInitScript(value=>{localStorage.setItem('abb:v1',value);},kitData('Guest original'));
  await accountPage.goto(base);await accountPage.getByRole('button',{name:'Import browser saves'}).click();
  await expect.poll(()=>data['abb:v1']).toBeTruthy();
  await openKits(accountPage);
  await accountPage.getByRole('textbox',{name:'Kit name',exact:true}).last().fill('Account launch kit');
  await expect.poll(()=>JSON.parse(data['abb:v1']).kits[0].name).toBe('Account launch kit');
  await expect(accountPage.getByTestId('persistence-bar')).toContainText('Saved to your account');
  const fresh=await browser.newContext(), other=await fresh.newPage();await attach(other);await other.goto(base);await openKits(other);
  await expect(other.getByRole('textbox',{name:'Kit name',exact:true}).last()).toHaveValue('Account launch kit');
  await fresh.close();console.log('PASS account save and restore in a clean browser');
  await accountPage.evaluate(()=>window.__switchMindAccount('bob'));await expect(accountPage.getByTestId('persistence-bar')).toHaveAttribute('data-account','bob');await expect(accountPage.getByTestId('persistence-bar')).toHaveAttribute('data-save-status','saved');await openKits(accountPage);await expect(accountPage.getByText('No kits yet',{exact:true})).toBeVisible();
  await accountPage.evaluate(()=>window.__switchMindAccount(null));await expect(accountPage.getByTestId('persistence-bar')).toHaveAttribute('data-account','guest');await openKits(accountPage);await expect(accountPage.getByRole('textbox',{name:'Kit name',exact:true}).last()).toHaveValue('Guest original');
  assertNoErrors(errors);await accountContext.close();console.log('PASS account switching and guest isolation');

  const sharingContext=await browser.newContext(),sharing=await sharingContext.newPage();await attach(sharing);
  let access={mode:'invited',emails:[],domain:''};
  await sharing.route('**/api/spaces/**',route=>{
    if(route.request().headers().authorization!=='Bearer alice')throw Error('Missing account session');
    if(route.request().url().endsWith('/access')){access=route.request().postDataJSON();return route.fulfill({json:{access}});}
    return route.fulfill({json:{space:{id:'s',name:'Company workspace'},shareToken:'private-share',access,items:[]}});
  });
  await sharing.goto(base+'/space');await sharing.getByRole('combobox',{name:'Who can open the share link?'}).selectOption('domain');
  await sharing.getByRole('textbox',{name:'Company email domain',exact:true}).fill('company.com');
  await sharing.getByRole('textbox',{name:'Invited email addresses, one per line'}).fill('guest@partner.com');
  await sharing.getByRole('button',{name:'Save access',exact:true}).click();
  await expect.poll(()=>access).toEqual({mode:'domain',emails:['guest@partner.com'],domain:'company.com'});
  await sharing.screenshot({path:'test-results/persistence/workspace-access.png',fullPage:true});
  await sharing.setViewportSize({width:390,height:844});
  await expect.poll(()=>sharing.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await sharing.screenshot({path:'test-results/persistence/workspace-mobile.png',fullPage:true});
  await sharingContext.close();console.log('PASS workspace access settings and mobile layout');
} finally {await browser.close();}
function assertNoErrors(errors){if(errors.length)throw Error(errors.join('\n'));}

async function openKits(page) {
  await page.getByTestId('nav-more').waitFor({state:'attached'});
  if (await page.getByTestId('menu-btn').isVisible()) await page.getByTestId('menu-btn').click();
  await page.getByTestId('nav-more').click(); await page.getByTestId('open-kits').click();
}
