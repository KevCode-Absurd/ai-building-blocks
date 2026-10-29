import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const script=fs.readFileSync(new URL('../public/analytics.js',import.meta.url),'utf8');
function browser({url='https://useaiblocks.com/',referrer='',readyState='complete',idle=null}={}){
 const calls=[],documentEvents={},windowEvents={},values=new Map([['abb:analytics-consent:v1','denied'],['abb:kits','saved kits'],['abb:flows','saved workflows']]);const location={};
 const setUrl=target=>{const u=new URL(target,location.href);Object.assign(location,{href:u.href,origin:u.origin,pathname:u.pathname,search:u.search,hash:u.hash,hostname:u.hostname});};setUrl(url);
 const document={readyState,referrer,head:{appendChild(el){calls.push(['script',el.src]);}},documentElement:{setAttribute(name,value){calls.push(['attribute',name,value]);}},createElement(tag){assert.equal(tag,'script','No cookie popup elements');return{};},addEventListener(name,fn){documentEvents[name]=fn;}};
 const history={pushState(_s,_u,target){setUrl(target);},replaceState(_s,_u,target){setUrl(target);}};
 const window={requestIdleCallback:idle,addEventListener(name,fn){windowEvents[name]=fn;}};const context={window,document,history,location,URL,URLSearchParams,Date,Set,localStorage:{removeItem(key){calls.push(['removeItem',key]);values.delete(key);}}};vm.runInNewContext(script,context);
 return {...context,calls,documentEvents,windowEvents,values,interact:()=>documentEvents.pointerdown?.({}),events:()=>Array.from(window.dataLayer??[],args=>[...args])};
}
test('Google starts on the first page and Clarity on the first tap, with advertising denied and no popup',()=>{
 const b=browser();assert.deepEqual(b.calls.filter(x=>x[0]==='script').map(x=>x[1]),['https://www.googletagmanager.com/gtag/js?id=G-FLLHB8ZGN7'],'the recorder waits for the visitor');
 b.interact();b.interact();assert.deepEqual(b.calls.filter(x=>x[0]==='script').map(x=>x[1]),['https://www.googletagmanager.com/gtag/js?id=G-FLLHB8ZGN7','https://www.clarity.ms/tag/z1oj0rgzrv']);
 const consent=b.events()[0];assert.equal(consent[0],'consent');assert.equal(consent[2].analytics_storage,'granted');for(const k of ['ad_storage','ad_user_data','ad_personalization'])assert.equal(consent[2][k],'denied');
 assert.equal(b.window.clarity.q[0][1].analytics_Storage,'granted');assert.equal(b.window.clarity.q[0][1].ad_Storage,'denied');assert(b.calls.some(x=>x[1]==='data-clarity-mask'&&x[2]==='true'));
 const config=b.events().find(x=>x[0]==='config')[2];assert.equal(config.send_page_view,false);assert.equal(config.allow_google_signals,false);assert.equal(config.allow_ad_personalization_signals,false);
});
test('retiring the old popup preference preserves kits and all saved work',()=>{
 const b=browser();assert.equal(b.values.has('abb:analytics-consent:v1'),false);assert.equal(b.values.get('abb:kits'),'saved kits');assert.equal(b.values.get('abb:flows'),'saved workflows');assert.deepEqual(b.calls.filter(x=>x[0]==='removeItem'),[['removeItem','abb:analytics-consent:v1']]);
});
test('private, query-bearing, preview and builder pages never load vendor scripts',()=>{
 for(const path of ['/account','/sign-up','/space','/s/private-share-key','/compose','/from-a-source','/example-app/','/?owner=private','/?q=private','/#build','/tools/example?goal=private'])assert.equal(browser({url:'https://useaiblocks.com'+path}).calls.filter(x=>x[0]==='script').length,0,path);
 assert.equal(browser({url:'https://preview.example/'}).calls.filter(x=>x[0]==='script').length,0);
});
test('public page views are deduplicated and do not contain incoming referrers',()=>{
 const b=browser({referrer:'https://elsewhere.test/?private=secret'});b.history.pushState(null,'','/skills/ai-search-audit');b.history.replaceState(null,'','/skills/ai-search-audit');const views=b.events().filter(x=>x[0]==='event'&&x[1]==='page_view');assert.equal(views.length,2);assert.equal(views[1][2].page_location,'https://useaiblocks.com/skills/ai-search-audit');assert.equal(views[0][2].page_referrer,'https://elsewhere.test/');assert(!JSON.stringify(b.events()).includes('secret'));assert.equal(b.window.clarity,undefined,'unsafe referrer disables replay');
});
test('private SPA transitions stop replay and disable Google collection without changing navigation',()=>{
 const b=browser();b.interact();b.window.clarity('start',{});b.history.pushState(null,'','/s/private-key');assert.equal(b.location.pathname,'/s/private-key');assert.equal(b.window['ga-disable-G-FLLHB8ZGN7'],true);assert.equal(b.window.clarity.q.some(x=>x[0]==='start'),false);const n=b.events().length;b.documentEvents['abb:ux-event']({detail:'file_download'});assert.equal(b.events().length,n);b.history.pushState(null,'','/skills/ai-search-audit');assert.equal(b.window['ga-disable-G-FLLHB8ZGN7'],false);
});
test('search typing stops recording before its text enters history, without reading its value',()=>{
 const b=browser();const commands=[];b.window.clarity=(method)=>{commands.push([method,b.location.href]);if(method==='stop')b.window.clarity=function(){(b.window.clarity.q??=[]).push(arguments);};};b.window.clarity.v='test-vendor';
 const event={target:{matches:()=>true,get value(){throw Error('Never read input');}}};b.documentEvents.beforeinput(event);b.documentEvents.beforeinput(event);b.history.replaceState(null,'','/?q=synthetic-private');assert.deepEqual(commands,[['stop','https://useaiblocks.com/']]);assert.equal(b.events().filter(x=>x[1]==='search_started').length,1);assert(!JSON.stringify(b.events()).includes('synthetic-private'));assert.equal(b.window['ga-disable-G-FLLHB8ZGN7'],true);
});
test('action tracking forwards only the fixed vocabulary, never arbitrary data',()=>{
 const b=browser();for(const name of ['task_started','request_copied','pack_download_requested','file_download','result_useful'])b.documentEvents['abb:ux-event']({detail:name});b.documentEvents['abb:ux-event']({detail:{name:'file_download',email:'private@example.test'}});b.documentEvents['abb:ux-event']({detail:'private@example.test'});const events=b.events().filter(x=>x[0]==='event');assert.equal(events.length,6);assert.equal(events.find(x=>x[1]==='file_download')[2].time_bucket,'under_30s');assert(!JSON.stringify(events).includes('private@example.test'));
});
test('a delayed Clarity download cannot start after private navigation',()=>{
 const b=browser();b.interact();b.history.pushState(null,'','/compose');b.window.clarity('metadata',()=>{});b.window.clarity('start',{});assert.equal(b.window.clarity.q.some(x=>x[0]==='start'),false);
});
test('typing before the first tap keeps the recorder from loading on that page',()=>{
 const b=browser();b.documentEvents.beforeinput({target:{matches:()=>false}});b.interact();assert.equal(b.window.clarity,undefined);assert.equal(b.calls.filter(x=>x[0]==='script'&&x[1].includes('clarity')).length,0);
});
test('leaving for a private page before the first tap keeps the recorder from loading',()=>{
 const b=browser();b.history.pushState(null,'','/space');b.interact();assert.equal(b.calls.filter(x=>x[0]==='script'&&x[1].includes('clarity')).length,0);
});
test('the Google tag downloads after the page has loaded, with the page view already queued',()=>{
 const b=browser({readyState:'loading'});b.documentEvents.DOMContentLoaded();assert.equal(b.calls.filter(x=>x[0]==='script').length,0);assert.equal(b.events().filter(x=>x[1]==='page_view').length,1);
 b.windowEvents.load();assert.deepEqual(b.calls.filter(x=>x[0]==='script').map(x=>x[1]),['https://www.googletagmanager.com/gtag/js?id=G-FLLHB8ZGN7']);
});

test("idle Google loading keeps its queued page view and rechecks private navigation",()=>{
 let resume;const b=browser({idle:fn=>{resume=fn;return 1;}});assert.equal(b.calls.filter(x=>x[0]==="script").length,0);assert.equal(b.events().filter(x=>x[1]==="page_view").length,1);resume();assert.equal(b.calls.filter(x=>x[0]==="script").length,1);
 let delayed;const privatePage=browser({idle:fn=>{delayed=fn;return 1;}});privatePage.history.pushState(null,"","/compose");delayed();assert.equal(privatePage.calls.filter(x=>x[0]==="script").length,0);
});
