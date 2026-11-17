import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
const load=(rel:string):Promise<any>=>import(rel);
const scope={owner_id:'owner-a',workspace_id:'workspace-a',brand_id:'brand-a'};
const now=new Date('2026-11-17T12:00:00Z');
const sha=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
function fixture(){
 const dir=mkdtempSync(path.join(tmpdir(),'evidence-packet-'));
 const sources:any[]=[];
 const add=(id:string,name:string,text:string,extra:Record<string,unknown>={})=>{
  mkdirSync(path.dirname(path.join(dir,name)),{recursive:true});writeFileSync(path.join(dir,name),text);
  const row={id,path:name,sha256:sha(text),observed_at:'2026-11-17T10:00:00Z',fresh_for_days:7,...extra};sources.push(row);return row;
 };
 const manifest={schema:'task-evidence-manifest/1',scope,sources};
 const task={scope:{...scope,platform:'meta',account_id:'a-1'},facets:[{id:'returns',query:'returns policy exceptions'},{id:'economics',query:'contribution margin stock'}]};
 return {dir,sources,add,manifest,task};
}

test('task packet preserves policy exceptions and numeric tables while covering separate decisions',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('policy','policy.md','# Returns policy\nDomestic returns within seven days.\n\nInternational orders and custom designs are excluded.\n\n| Rule | Value |\n| --- | --- |\n| Restocking | 0% |',{qualifications:['Domestic standard orders only.']});
 f.add('finance','stock.md','# Contribution margin and stock\nContribution is 35%; sellable stock is 20 units.');
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now,perFacet:1});
 assert.equal(p.passages.length,2);assert.equal(p.has_retrieval_gaps,false);assert.equal(p.needs_review,true);assert.equal(p.answer_coverage,'not_evaluated');
 assert.match(p.passages.find((p:any)=>p.source_id==='policy').text,/International orders and custom designs are excluded/);
 assert.deepEqual(p.passages.find((p:any)=>p.source_id==='policy').qualifications,['Domestic standard orders only.']);
 assert.ok(p.facets.every((f:any)=>f.selected.length===1));
 assert.ok(p.passages.every((p:any)=>/^[a-f0-9]{64}$/.test(p.source_sha256)&&/^[a-f0-9]{64}$/.test(p.passage_sha256)));
 assert.match(p.assurance,/not all Drive sources/);
});

test('packet reads the selected scope only and rejects a different caller binding',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('own','policy.md','Returns policy',{scope:{platform:'meta',account_id:'a-1'}});
 f.add('other','other.md','Cross-account confidential contribution',{scope:{platform:'meta',account_id:'a-2'}});
 f.add('brand','brand.md','Other brand hidden',{scope:{brand_id:'brand-b'}});
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now});
 assert.deepEqual(p.sources.filter((s:any)=>s.status==='out_of_scope').map((s:any)=>s.source_id),['other','brand']);
 assert.ok(!JSON.stringify(p.passages).includes('confidential'));
 // Own sources do have hashes; out-of-scope sources must not.
 assert.ok(p.sources.filter((s:any)=>s.status==='out_of_scope').every((s:any)=>!s.sha256));
 assert.throws(()=>buildEvidencePacket(f.dir,f.manifest,{...f.task,scope:{...scope,owner_id:'other'}},{now}),/scope/);
});

test('changed, stale, undated, unread, unavailable and missing sources remain distinct unresolved gaps',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('changed','changed.md','Returns policy');writeFileSync(path.join(f.dir,'changed.md'),'New returns policy');
 f.add('stale','stale.md','Returns policy',{observed_at:'2026-09-01',fresh_for_days:7});
 f.add('undated','undated.md','Returns policy',{observed_at:null});
 f.add('unread','unread.md','Returns policy',{availability:'unread'});
 f.add('unavailable','unavailable.md','Returns policy',{availability:'unavailable'});
 f.sources.push({id:'missing',path:'missing.md',sha256:'a'.repeat(64),observed_at:'2026-11-17',fresh_for_days:7});
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now});
 assert.deepEqual(p.sources.map((s:any)=>s.status),['changed_since_index','stale','undated','unread','unavailable','missing_local']);
 assert.equal(p.passages.length,0);assert.equal(p.needs_review,true);
});

test('unsafe paths, invalid UTF-8 and sensitive source values are withheld without echoing contents',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.sources.push({id:'escape',path:'../escape.md',sha256:'a'.repeat(64),observed_at:'2026-11-17',fresh_for_days:7});
 f.add('sensitive','data.json',JSON.stringify({api_key:'never-echo-this-value'}));
 const b=Buffer.from([0xff,0xfe,0x61]);writeFileSync(path.join(f.dir,'invalid.txt'),b);
 f.sources.push({id:'invalid',path:'invalid.txt',sha256:sha(b),observed_at:'2026-11-17',fresh_for_days:7});
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now});
 assert.deepEqual(p.sources.map((s:any)=>s.status),['unreadable_or_unsafe','restricted_sensitive','unreadable_or_unsafe']);
 assert.ok(!JSON.stringify(p).includes('never-echo-this-value'));assert.equal(p.passages.length,0);
});

test('whole passages are not clipped to fake coverage when a packet budget is exhausted',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('policy','policy.md','# Returns policy\n'+('The policy requires proof. '.repeat(30))+'International returns excluded.');
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now,maxChars:100});
 assert.equal(p.passages.length,0);assert.equal(p.facets[0].status,'budget_gap');assert.equal(p.needs_review,true);
 assert.throws(()=>buildEvidencePacket(f.dir,f.manifest,f.task,{now,maxChars:0}),/integer/);
 assert.throws(()=>buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[f.task.facets[0],f.task.facets[0]]},{now}),/unique/);
});

test('contradictory fact keys are unresolved and retired or stale prices cannot win retrieval',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 const fact=(value:string,more={})=>({fact_key:'margin',value:'Contribution margin '+value,source:'ledger',status:'live',captured_at:'2026-11-17',...more});
 f.add('ledger-a','a.json',JSON.stringify({facts:[fact('35%'),fact('55%',{status:'retired',fact_key:'old-margin'})]}));
 f.add('ledger-b','b.json',JSON.stringify({facts:[fact('20%'),fact('USD 20',{fact_key:'price',kind:'price',captured_at:'2026-10-01'})]}));
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now});
 assert.equal(p.conflicts.length,1);assert.equal(p.conflicts[0].fact_key,'margin');assert.equal(p.passages.length,0);
 assert.deepEqual(p.omitted_memory_records.map((r:any)=>r.status),['retired','stale']);assert.equal(p.needs_review,true);
});

test('reconciled memory projection is invalidated when owner decisions change or newly appear',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 mkdirSync(path.join(f.dir,'context/org-context'),{recursive:true});
 const memory_inputs=['scope.json','facts.json','offers.json','owner-resolutions.json'].map(name=>({path:'context/org-context/'+name,sha256:null as string|null}));
 for(const input of memory_inputs.slice(0,3)){const text=input.path.endsWith('/scope.json')?JSON.stringify(scope):'{}';writeFileSync(path.join(f.dir,input.path),text);input.sha256=sha(text);}
 f.add('memory','projection.json',JSON.stringify({facts:[{fact_key:'margin',value:'Contribution margin 35%',status:'live',source:'ledger',captured_at:'2026-11-17'}],unresolved:[],restrictions:[],review:[],rejected:[],ready:true}),{kind:'memory',memory_inputs});
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now});assert.equal(p.passages.length,1);
 writeFileSync(path.join(f.dir,'context/org-context/owner-resolutions.json'),'{}');
 const changed=buildEvidencePacket(f.dir,f.manifest,f.task,{now});
 assert.equal(changed.sources[0].status,'memory_changed_since_projection');assert.equal(changed.passages.length,0);
 assert.equal(changed.needs_review,true);
});

test('raw memory ledger cannot bypass revoked/corrected reconciled memory view',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('raw','context/org-context/facts.json',JSON.stringify({facts:[{fact_key:'returns',value:'Returns policy outdated',status:'live'}]}));
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now});
 assert.equal(p.sources[0].status,'requires_reconciled_memory');assert.equal(p.passages.length,0);
});

test('long one-paragraph transcripts stay retrievable with exact anchors and explicit partial context',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 const text='Intro. '+('General methods repeat. '.repeat(350))+'The unusual contribution margin receipt is here. '+('Remaining context. '.repeat(300));
 f.add('long','transcript.txt',text);
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[{id:'rare',query:'unusual contribution margin receipt'}]},{now,perFacet:1});
 assert.equal(p.passages.length,1);const passage=p.passages[0];assert.match(passage.text,/unusual contribution margin receipt/);
 const [,a,b]=/chars(\d+)-(\d+)/.exec(passage.locator)!;assert.equal(text.slice(Number(a),Number(b)),passage.text);
 assert.equal(passage.section_partial,true);assert.equal(p.has_retrieval_gaps,true);assert.equal(p.facets[0].claim_support,'not_evaluated');
});

test('email-like contacts are masked per passage without discarding useful research',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 const text='# Returns policy\nContact example@example.test. Returns require receipt; custom goods excluded.';
 f.add('policy','policy.md',text);
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[f.task.facets[0]]},{now});
 assert.equal(p.passages.length,1);assert.match(p.passages[0].text,/custom goods excluded/);
 assert.ok(!JSON.stringify(p).includes('example@example.test'));assert.equal(p.passages[0].text.length,text.length);
 assert.equal(p.passages[0].contact_redactions,1);assert.equal(p.sources[0].contact_redactions,1);
});

test('ingestion annotations cannot outrank real evidence and excluded ranges preserve source anchors',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 const prefix='# Header\nTopics: contribution margin stock returns policy exceptions.\nSkip: context!\n';
 const body='# Original transcript\nThe contribution margin method subtracts shipping and refunds.\n';
 f.add('source','source.txt',prefix+body,{exclude_ranges:[{start:0,end:prefix.length,reason:'ingestion_metadata'}]});
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[f.task.facets[1]]},{now});
 assert.equal(p.passages.length,1);assert.equal(p.passages[0].text,body);assert.ok(!p.passages[0].text.includes('Skip:'));
 assert.match(p.passages[0].locator,new RegExp('chars'+prefix.length+'-'));assert.equal(p.sources[0].excluded_metadata_ranges.length,1);
 f.sources[0].exclude_ranges[0].end=999999;
 assert.equal(buildEvidencePacket(f.dir,f.manifest,f.task,{now}).sources[0].status,'unreadable_or_unsafe');
});

test('memory types select relevant stores before reads and do not turn semantic labels into facts',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('procedure','procedure.md','Returns policy workflow',{memory_type:'procedural',kind:'method'});
 f.add('episode','episode.md','Returns policy worked yesterday',{memory_type:'episodic'});
 f.add('fake-semantic','semantic.md','Returns policy approval is permanent',{memory_type:'semantic',kind:'method'});
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,memory_types:['procedural'],facets:[f.task.facets[0]]},{now});
 assert.deepEqual(p.sources.map((s:any)=>s.status),['read','memory_type_not_selected','semantic_requires_reconciled_memory']);
 assert.equal(p.passages.length,1);assert.equal(p.passages[0].memory_type,'procedural');assert.match(p.passages[0].authority,/never operating policy/);
 assert.ok(!p.sources[1].sha256);assert.ok(!p.sources[2].sha256);
 assert.throws(()=>buildEvidencePacket(f.dir,f.manifest,{...f.task,memory_types:['magic']},{now}),/known memory/);
});

test('stale episodic and unknown type records remain unresolved rather than becoming active lessons',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('episode','episode.md','Returns policy succeeded in an old job.',{memory_type:'episodic',observed_at:'2026-09-01',fresh_for_days:7});
 f.add('bad','bad.md','Returns policy',{memory_type:'active-universal-rules'});
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now});
 assert.deepEqual(p.sources.map((s:any)=>s.status),['stale','invalid_memory_type']);assert.equal(p.passages.length,0);
 assert.equal(p.needs_review,true);assert.equal(p.answer_coverage,'not_evaluated');
});

test('joined duration words remain searchable without splitting SKU identities',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('cash','cash.md','A 13week cash forecast records invoice timing for B500.');
 f.add('other','other.md','A 13 week cash forecast for X500.');
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[{id:'forecast',query:'13 week cash forecast B500'}]},{now,perFacet:1});
 assert.equal(p.passages[0].source_id,'cash');assert.ok(p.passages[0].matched_facets[0].matched_terms.includes('b500'));
});


test('citation URLs with credential-like query parameters are not copied into packets',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('policy','policy.md','Returns policy exceptions',{source_url:'https://example.com/read?api_key=not-for-output'});
 const p=buildEvidencePacket(f.dir,f.manifest,f.task,{now});
 assert.ok(!JSON.stringify(p).includes('not-for-output'));assert.ok(!p.sources[0].citation.url);
});

test('structured JSON selects complete metric subtrees with parent date, currency and limitations',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('ledger','ledger.json',JSON.stringify({currency:'INR',window:{start:'2026-10-24',end:'2026-11-08'},totals:{net_sales:'4124116.79',orders:141},limitations:['Headline items are not orders.'],rows:Array.from({length:200},(_,i)=>({order:i,value:'large irrelevant row '.repeat(8)}))}),{json_pointers:['/totals'],context_pointers:['/currency','/window','/limitations']});
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[{id:'totals',query:'net sales orders',required_source_ids:['ledger']}]},{now});
 assert.equal(p.passages.length,1);const body=JSON.parse(p.passages[0].text);
 assert.equal(p.passages[0].locator,'#/totals');assert.equal(body.evidence.value.orders,141);
 assert.equal(body.context['/currency'],'INR');assert.equal(body.context['/window'].start,'2026-10-24');
 assert.ok(!p.passages[0].text.includes('large irrelevant row'));
 f.sources[0].json_pointers=['/absent'];
 assert.equal(buildEvidencePacket(f.dir,f.manifest,f.task,{now}).sources[0].status,'unreadable_or_unsafe');
});

test('large tabular JSON yields an explicit structured-query route instead of sampled totals',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 const rows=Array.from({length:150},(_,i)=>({orders:i,net_sales:'example-row-value '.repeat(10)}));
 f.add('orders','orders.json',JSON.stringify({currency:'INR',rows}),{json_pointers:['/rows'],context_pointers:['/currency']});
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[{id:'data',query:'orders net sales',required_source_ids:['orders']}]},{now});
 assert.equal(p.passages[0].requires_structured_query,true);const route=JSON.parse(p.passages[0].text).route;
 assert.equal(route.record_count,150);assert.equal(route.field_coverage,'sampled');assert.ok(!p.passages[0].text.includes('example-row-value'));
 assert.equal(p.has_retrieval_gaps,true);
});

test('required primary sources cannot be replaced by a keyword-rich generic checklist',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('generic','generic.md','Contribution margin refunds shipping transaction fees breakeven advertising.');
 f.add('ledger','ledger.json',JSON.stringify({contribution:'Actual contribution statement',currency:'INR'}));
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[{id:'decision',query:'contribution margin refunds shipping transaction fees breakeven advertising',required_source_ids:['ledger']}]},{now,perFacet:1});
 assert.equal(p.passages[0].source_id,'ledger');assert.equal(p.facets[0].status,'evidence_candidates');
 const missing=buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:[{id:'decision',query:'contribution',required_source_ids:['missing-ledger']}]},{now,perFacet:1});
 assert.equal(missing.facets[0].status,'required_source_gap');assert.deepEqual(missing.facets[0].missing_required_sources,['missing-ledger']);assert.equal(missing.passages.length,0);
});

test('role module filters skip unrelated methods before reading while keeping shared brand facts',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('finance','finance.md','Contribution margin stock',{kind:'method',memory_type:'procedural',modules:['FIN']});
 f.add('seo','seo.md','Contribution margin stock',{kind:'method',memory_type:'procedural',modules:['SEO']});
 f.add('brand','brand.md','Returns policy and contribution margin',{kind:'policy'});
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,modules:['FIN']},{now});
 assert.deepEqual(p.sources.map((s:any)=>s.status),['read','module_not_selected','read']);assert.ok(!p.sources[1].sha256);
 assert.equal(p.statistics.source_files_read,2);assert.equal(p.statistics.module_filtered,1);
 const blocked=buildEvidencePacket(f.dir,f.manifest,{...f.task,modules:['FIN'],facets:[{id:'need',query:'contribution',required_source_ids:['seo']}]},{now});
 assert.equal(blocked.facets[0].status,'required_source_gap');assert.equal(blocked.passages.length,0);
});

test('missing procedural module metadata stays unresolved and unknown module requests never broaden access',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 f.add('method','method.md','Contribution margin',{kind:'method'});
 const p=buildEvidencePacket(f.dir,f.manifest,{...f.task,modules:['FIN']},{now});
 assert.equal(p.sources[0].status,'module_metadata_missing');assert.equal(p.statistics.source_files_read,0);
 assert.deepEqual(p.unresolved_sources,['method']);assert.equal(p.has_retrieval_gaps,true);
 assert.throws(()=>buildEvidencePacket(f.dir,f.manifest,{...f.task,modules:['unknown free text']},{now}),/module/);
});

test('tight budgets prioritize missing decision coverage before redundant second passages regardless of facet order',async()=>{
 const {buildEvidencePacket}=await load('../packs/shared/tools/evidence-packet.mjs');const f=fixture();
 const qualifications=['Historical reference only. Preserve this complete condition.'];
 const padded=(text:string)=>text.padEnd(240,' ');
 f.add('first-method','first.md',padded('alpha beta gamma delta'),{qualifications});
 f.add('second-method','second.md',padded('alpha beta gamma delta'),{qualifications});
 f.add('supplier-method','supplier.md',padded('cash supplier'),{qualifications});
 f.add('forecast-method','forecast.md',padded('forecast stock'),{qualifications});
 const facets=[{id:'alpha',query:'alpha beta gamma delta'},{id:'cash',query:'cash forecast supplier stock'}];
 const packets=[facets,[...facets].reverse()].map(ordered=>buildEvidencePacket(f.dir,f.manifest,{...f.task,facets:ordered},{now,maxChars:900,perFacet:2}));
 for(const p of packets){
  assert.ok(p.facets.every((x:any)=>x.selected.length>0),'each decision receives its first evidence attempt');
  assert.ok(p.passages.some((x:any)=>x.source_id==='forecast-method'),'novel forecast evidence precedes corroboration');
  assert.equal(p.passages.filter((x:any)=>/^(first|second)-method$/.test(x.source_id)).length,1);
  assert.ok(p.budget.selected_chars<=900);
  assert.ok(p.passages.every((x:any)=>x.qualifications.includes(qualifications[0])));
  assert.ok(p.facets.find((x:any)=>x.id==='alpha').omitted_for_budget.length>0,'the omitted corroboration is explicit');
  assert.equal(p.has_retrieval_gaps,true);assert.equal(p.answer_coverage,'not_evaluated');
 }
 assert.deepEqual(packets[0].passages.map((x:any)=>x.id),packets[1].passages.map((x:any)=>x.id));
});
