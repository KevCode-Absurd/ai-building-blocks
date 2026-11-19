import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildPack, TOOL_FILES } from '../src/modules/packs/build.ts';
import { housePersonas } from '../src/modules/directory/index.ts';
import { getRole } from '../src/modules/directory/roles.ts';
import { listJobTypes } from '../src/modules/catalogue/index.ts';
// @ts-ignore Portable browser/Node diagnostic.
import { reviewSvgLayout } from '../packs/shared/tools/svg-layout-check.mjs';

const item = (tag: string, order: number, bounds: any, fill = 'rgb(255, 255, 255)') => ({ id: `${tag}-${order}`, tag, order, bounds, fill, fillOpacity: 1, fontSize: tag === 'text' ? 34 : 0, text: tag === 'text' ? 'See the ring in detail.' : '', unsupported: [] as string[] });
const fixture = () => ({ schema: 'svg-layout-probe/1', sourceDomSha256: 'a'.repeat(64), viewport: { x:0, y:0, width:1080, height:1920 }, warnings: [] as any[], items: [
  item('rect',0,{ x:0,y:0,width:1080,height:1920 },'rgb(112, 46, 62)'),
  item('image',1,{ x:217,y:640,width:646,height:450 }),
  item('text',2,{ x:80,y:1084,width:319,height:40 })
] });

test('photo edge collision remains unresolved despite strong brand palette contrast', () => {
  const r=reviewSvgLayout(fixture());
  assert.equal(r.status,'REVIEW_REQUIRED');
  assert.ok(r.findings.some((f: any) => f.code === 'TEXT_IMAGE_INTERSECTION'));
  assert.equal(r.textChecks[0].contrastRatio,null);
});
test('moving the supporting line clear enables uniform panel calculation', () => {
  const f=fixture();f.items[2].bounds.y=1110; const r=reviewSvgLayout(f);
  assert.equal(r.status,'NO_GEOMETRY_FINDINGS');assert.ok(r.textChecks[0].contrastRatio>9);
  assert.match(r.limitations,/not a visual pass/);
});
test('an opaque panel must cover all text and be painted after the image', () => {
  const f=fixture(), text=f.items.pop()!;
  f.items.push(item('rect',2,{x:70,y:1070,width:350,height:70},'rgb(112, 46, 62)'));text.order=3;text.id='text-3';f.items.push(text);
  assert.equal(reviewSvgLayout(f).status,'NO_GEOMETRY_FINDINGS');
  f.items[2].fillOpacity=0.9;assert.ok(reviewSvgLayout(f).findings.some((x:any)=>x.code==='TEXT_IMAGE_INTERSECTION'));
  f.items[2].fillOpacity=1;f.items[2].bounds.width=200;assert.equal(reviewSvgLayout(f).textChecks[0].contrastRatio,null);
});
test('later imagery, unsupported effects and missing font geometry never certify contrast', () => {
  const f=fixture();f.items[2].bounds.y=1110;f.items.push(item('image',3,{x:0,y:1100,width:500,height:100}));
  assert.ok(reviewSvgLayout(f).findings.some((x:any)=>x.code==='LATER_PAINT_INTERSECTION'));
  assert.equal(reviewSvgLayout(f).textChecks[0].contrastRatio,null);
  f.items.pop();f.items[2].unsupported=['rotation-skew-or-reflection'];assert.equal(reviewSvgLayout(f).textChecks[0].contrastRatio,null);
  f.items[2].unsupported=[];f.warnings.push({code:'UNSUPPORTED_ELEMENT',element:'path-3',detail:'path'});assert.equal(reviewSvgLayout(f).textChecks[0].contrastRatio,null);
});
test('low contrast, clipping, text overlap and raster-only text produce explicit findings', () => {
  const f=fixture();f.items[2].bounds.y=1110;f.items[0].fill='rgb(245, 245, 245)';
  assert.ok(reviewSvgLayout(f).findings.some((x:any)=>x.code==='LOW_SOLID_PANEL_CONTRAST'));
  f.items[2].bounds.x=-10;assert.ok(reviewSvgLayout(f).findings.some((x:any)=>x.code==='TEXT_OUTSIDE_VIEWPORT'));
  f.items.push(item('text',3,{...f.items[2].bounds}));assert.ok(reviewSvgLayout(f).findings.some((x:any)=>x.code==='TEXT_TEXT_INTERSECTION'));
  f.items=f.items.slice(0,2);assert.ok(reviewSvgLayout(f).findings.some((x:any)=>x.code==='NO_MEASURABLE_TEXT'));
});
test('malformed, unbound, oversized and reordered snapshots are rejected', () => {
  for (const change of [(f:any)=>f.sourceDomSha256='',(f:any)=>f.viewport.width=NaN,(f:any)=>f.items[2].bounds.y=Infinity,(f:any)=>f.items[1].order=9,(f:any)=>f.items[2].id=f.items[1].id,(f:any)=>f.items[1].unsupported='none',(f:any)=>f.items=Array(1001).fill(f.items[0])]) {
    const f=fixture();change(f);assert.throws(()=>reviewSvgLayout(f));
  }
  assert.throws(()=>reviewSvgLayout(fixture(),{normalTextContrast:3}));
});
test('layout diagnostic is included only in the finished Ayaka pack', async () => {
  const names=['svg-layout-check.mjs','SVG-LAYOUT-CHECK.md'];
  for (const name of names) assert.deepEqual(TOOL_FILES.find(x=>x.name===name)?.personaIds,['ayaka-ad-design']);
  const files=Object.fromEntries(names.map(n=>[n,fs.readFileSync(new URL(`../packs/shared/tools/${n}`,import.meta.url),'utf8')]));
  const personas=housePersonas().filter(p=>p.vertical==='ecommerce' && p.status==='live');assert.equal(personas.length,81);
  for (const persona of personas) {
    const input={persona,role:getRole(persona.role),kit:null,jobTypes:listJobTypes(),options:{kind:'agent' as const,version:'2026.11.18',updated:'2026-11-18'}};
    const before=await buildPack({...input,tools:{}}),after=await buildPack({...input,tools:files});
    if (persona.id==='ayaka-ad-design') {
      names.forEach(name=>assert.ok(after.files.some(f=>f.path==='tools/'+name)));
      assert.match(after.files.find(f=>f.path==='AGENTS.md')!.content,/Verify the final creative layout/);
    } else {assert.deepEqual(after.files,before.files,persona.id);assert.deepEqual(after.manifest,before.manifest);}
    const trained=await buildPack({...input,tools:files,options:{...input.options,kind:'train' as const}});
    names.forEach(name=>assert.ok(!trained.files.some(f=>f.path==='tools/'+name)));
  }
});
