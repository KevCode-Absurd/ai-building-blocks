import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const script=fs.readFileSync(new URL('../public/analytics.js',import.meta.url),'utf8');
function browser({zone='Europe/Berlin',saved='',gpc=false}={}){
 const calls=[],documentEvents={},store=new Map(saved?[['abb:analytics-consent:v2',saved]]:[]),nodes=[];
 const u=new URL('https://useaiblocks.com/');const location={href:u.href,origin:u.origin,pathname:u.pathname,search:'',hash:'',hostname:u.hostname};
 const element=tag=>{const el={tag,attrs:{},listeners:{},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},addEventListener(n,fn){el.listeners[n]=fn;},remove(){nodes.splice(nodes.indexOf(el),1);}};el.setAttribute=(k,v)=>{el.attrs[k]=v;};el.getAttribute=k=>el.attrs[k];return el;};
 const document={readyState:'complete',referrer:'',head:{appendChild(el){if(el.tag==='script')calls.push(['script',el.src]);else nodes.push(el);}},body:{appendChild(el){nodes.push(el);}},documentElement:{setAttribute(){}},createElement:element,getElementById:id=>nodes.find(n=>n.id===id)||null,addEventListener(name,fn){(documentEvents[name]??=[]).push(fn);}};
 const window={addEventListener(){}};
 const Intl={DateTimeFormat:()=>({resolvedOptions:()=>({timeZone:zone})})};
 const localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
 vm.runInNewContext(script,{window,document,history:{pushState(){},replaceState(){}},location,URL,URLSearchParams,Date,Set,Intl,localStorage,navigator:{globalPrivacyControl:gpc}});
 const banner=()=>nodes.find(n=>n.id==='abb-consent');
 const pick=choice=>banner().listeners.click({target:{closest:()=>({getAttribute:()=>choice})}});
 const interact=()=>{for(const fn of documentEvents.pointerdown??[])fn({});};
 return {calls,store,banner,pick,interact,scripts:()=>calls.filter(x=>x[0]==='script')};
}
test('visitors outside Europe are measured from the first page with no banner; replay starts on the first tap',()=>{
 for(const zone of ['Asia/Kolkata','America/New_York','Australia/Sydney']){const b=browser({zone});assert.equal(b.banner(),undefined);assert.equal(b.scripts().length,1,zone);b.interact();assert.equal(b.scripts().length,2,zone);}
});
test('visitors in the EU, UK and Switzerland see a banner and nothing loads until they allow it',()=>{
 for(const zone of ['Europe/Berlin','Europe/London','Europe/Zurich','Atlantic/Canary','Indian/Reunion']){const b=browser({zone});assert.ok(b.banner(),zone);assert.equal(b.scripts().length,0,zone);}
});
test('allowing starts analytics and is remembered; declining loads nothing',()=>{
 const yes=browser();yes.pick('granted');assert.equal(yes.banner(),undefined);assert.equal(yes.scripts().length,2);assert.equal(yes.store.get('abb:analytics-consent:v2'),'granted');
 const no=browser();no.pick('denied');assert.equal(no.banner(),undefined);assert.equal(no.scripts().length,0);assert.equal(no.store.get('abb:analytics-consent:v2'),'denied');
});
test('a saved choice is respected on the next visit without asking again',()=>{
 const yes=browser({saved:'granted'});assert.equal(yes.banner(),undefined);yes.interact();assert.equal(yes.scripts().length,2);
 const no=browser({saved:'denied'});assert.equal(no.banner(),undefined);assert.equal(no.scripts().length,0);
});
test('anyone can say no from the analytics page, including outside Europe',()=>{
 const b=browser({zone:'America/New_York',saved:'denied'});assert.equal(b.banner(),undefined);assert.equal(b.scripts().length,0);
});
test('a Global Privacy Control signal means no analytics and no banner, anywhere',()=>{
 for(const zone of ['America/New_York','Europe/Berlin']){const b=browser({zone,gpc:true});assert.equal(b.banner(),undefined,zone);assert.equal(b.scripts().length,0,zone);}
});
