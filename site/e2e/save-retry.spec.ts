import {test,expect} from '@playwright/test';
import {mockComposerAccount} from './fixtures/composer-account';
const initial=()=>({'abb:v1':JSON.stringify({kits:[{id:'retry-kit',name:'Original kit',slugs:['fact-based-ad-copy-writer'],updated:1}],flows:[{id:'retry-flow',name:'Workflow retained',nodes:[],edges:[],updated:1,customSkills:[{slug:'private-retry-skill',name:'Private retained skill',markdown:'Every original private instruction'}]}],draft:null,currentFlow:null,recent:[]})});
for(const failure of ['server','rate-limit','lost-response'] as const)test(`save retries automatically after ${failure}, with one committed copy`,async({page})=>{
 await page.clock.install();await mockComposerAccount(page,true,'retry-user','retry-token');
 let data=initial(),revision=1,attempts=0,commits=0;
 await page.route('**/api/library',async route=>{
  if(route.request().method()==='PUT'){
   attempts++;const input=route.request().postDataJSON();
   if(attempts===1&&failure!=='lost-response')return route.fulfill({status:failure==='server'?503:429,headers:{'retry-after':'3'},contentType:'text/html',body:'<h1>Temporary service response</h1>'});
   if(input.revision!==revision)return route.fulfill({status:409,json:{error:'Another device saved'}});
   data=input.data;revision++;commits++;
   if(attempts===1&&failure==='lost-response')return route.abort('failed');
  }
  return route.fulfill({json:{data,revision}});
 });
 await page.goto('/account');await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status','saved');
 await page.getByRole('button',{name:'Manage my kits →',exact:true}).click();
 await page.locator('input[aria-label="Kit name"]').first().fill('Retained retry rename');await page.clock.runFor(750);
 await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status','error');
 await page.evaluate(()=>Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'}));
 if(failure!=='lost-response'){await page.clock.runFor(2000);expect(attempts).toBe(1);}
 await page.clock.runFor(4000);await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status','saved');
 expect(attempts).toBe(2);expect(commits).toBe(1);const saved=JSON.parse(data['abb:v1']);
 expect(saved.kits).toHaveLength(1);expect(saved.kits[0].name).toBe('Retained retry rename');expect(saved.flows).toHaveLength(1);
 expect(saved.flows[0].customSkills[0].markdown).toBe('Every original private instruction');
 await page.clock.runFor(30000);expect(attempts).toBe(2);
});
for(const tokenFailure of ['empty','stalled'])test(`${tokenFailure} token refresh keeps the account boundary and retries without signing out`,async({page})=>{
 await page.clock.install();await mockComposerAccount(page,true,'retry-user','retry-token');
 const sdk=`export class Clerk {session={id:'retry-session',status:'active',user:{id:'retry-user'},getToken:async()=>{const n=Number(sessionStorage.getItem('retry-tokens')||0);sessionStorage.setItem('retry-tokens',String(n+1));return n? 'retry-token':${tokenFailure==='stalled'?'new Promise(()=>{})':'null'};}};async load(){} addListener(fn){fn();return ()=>{};}}`;
 await page.route('**/assets/clerk*.js',route=>route.fulfill({contentType:'text/javascript',body:sdk}));
 await page.route('**/@clerk_clerk-js*.js*',route=>route.fulfill({contentType:'text/javascript',body:sdk}));
 await page.route('**/api/library',route=>route.fulfill({json:{data:initial(),revision:1}}));
 await page.goto('/account');
 if(tokenFailure==='stalled'){await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('retry-tokens'))).toBe('1');await page.clock.runFor(20000);}
 await expect(page.getByTestId('account-page')).toHaveAttribute('data-account','retry-user');
 await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status','error');
 await page.clock.runFor(1500);await expect(page.getByTestId('account-page')).toHaveAttribute('data-save-status','saved');
 await expect(page.getByRole('button',{name:/Original kit/})).toBeVisible();await expect(page.getByRole('button',{name:/Private retained skill/})).toBeVisible();
});
