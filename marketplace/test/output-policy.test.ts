// Contract and prompt regressions, not claims about generated creative quality.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {selectOutputStyle,outputPolicyMarkdown,activeOutputContract,OUTPUT_PRECEDENCE,FACT_RULE,READINESS_RULE,HOSTED_TEXT_LIMIT} from '../src/modules/runner/output-policy.ts';
import {buildHousePackage,renderPrompt} from '../src/modules/runner/packages.ts';
import {buildPack} from '../src/modules/packs/build.ts';
import {trimmedSeatPack} from '../src/modules/mcp/team-seats.ts';
import {validateAgentPackage,withRuleBlock} from '../src/modules/studio/package.ts';
import {NOVA,LANDING_PAGE} from './fixtures.ts';

test('explicit task, brand and specialist voices remain distinct with the declared precedence',()=>{
  const exuberant={tone:'Playful, electric and irreverent',formatting:'LAUNCH THE SPARK!!! ✨',sentence_style:'Expressive fragments and emphatic punctuation'};
  const restrained={tone:'Quiet, contemplative luxury',sentence_style:'Measured, flowing sentences',formatting:'Sparse editorial hierarchy'};
  const specialist={voice:'Warm concise assistant updates'};
  const first=selectOutputStyle({brand:exuberant,specialist});
  const second=selectOutputStyle({brand:restrained,specialist});
  assert.equal(first.source,'brand');assert.deepEqual(first.value,exuberant);
  assert.equal(second.source,'brand');assert.deepEqual(second.value,restrained);
  assert.notDeepEqual(first.value,second.value);
  const task={tone:'Formal technical audience',format:'JSON only'};
  assert.deepEqual(selectOutputStyle({task,brand:exuberant,specialist}),{source:'task',value:task});
  assert.deepEqual(selectOutputStyle({task:{tone:''},brand:{style:{}},specialist}),{source:'specialist',value:specialist});
  assert.equal(selectOutputStyle({task:{},brand:{},specialist:{}}).source,'neutral_fallback');
});

test('runtime contracts preserve requested verse, code and expression instead of imposing house prose',()=>{
  for(const [request,style] of [
    ['Write an iambic sonnet without headings',{genre:'iambic sonnet',format:'verse; preserve metre and line breaks'}],
    ['Return TypeScript code only',{genre:'code',output_format:'TypeScript; preserve identifiers and syntax'}],
    ['Write our exuberant launch announcement',{tone:'GO BOLD!!! ✨',sentence_style:'Fragments and emotional emphasis'}],
  ] as const){
    const contract=activeOutputContract({request,spec:style,brand:{tone:'Neutral house'}});
    assert(contract.includes(request));
    const candidate=JSON.parse(contract.match(/Explicit structured style candidate: (.+)\. This candidate/)![1]);
    assert.deepEqual(candidate.value,style);
    assert(contract.includes('"source":"task"'));
    assert(!contract.includes('aim for 15 words'));assert(!contract.includes('grade 8 to 9'));
  }
  const defaultContract=activeOutputContract({request:'Summarise the supplied report'});
  assert(defaultContract.includes('neutral_fallback'));
  assert(defaultContract.includes('does not parse or override the original task'));
});

test('house packages separate integrity from presentation and preserve current prompt placeholders',()=>{
  const pkg=buildHousePackage(NOVA,LANDING_PAGE);
  assert.equal(validateAgentPackage(pkg).ok,true);
  assert(pkg.skill.instructions.includes(OUTPUT_PRECEDENCE));
  assert(pkg.banned_patterns.some(rule=>rule.includes('invented quotes, testimonials or reviews')));
  assert(!pkg.banned_patterns.some(rule=>/Hype words:|ALL CAPS labels|Em dashes\./.test(rule)));
  assert(pkg.checklist.includes(READINESS_RULE));
  for(const step of pkg.steps){
    assert.equal(step.output,'markdown','existing storage format remains supported');
    const rendered=renderPrompt(step.prompt,{request:'Use {{feedback}} literally; preserve our emoji voice ✨',spec:{tone:'LOUD!!! ✨'},brand:{tone:'Muted'},rubric:[],previous:'',feedback:'',steps:{plan:'Accepted plan',draft:'Draft'}});
    assert(rendered.includes('"source":"task"'));
    assert(rendered.includes('LOUD!!! ✨'));
    assert(rendered.includes('{{feedback}} literally'));
    assert(!rendered.includes('{{output_contract}}'));
  }
});

test('text-only hosted pipeline cannot promise a native implementation from Markdown',()=>{
  const native={...LANDING_PAGE,id:'interactive-tool',title:'Interactive calculator',deliverable:'Working calculator source with tested interactions'};
  const pkg=buildHousePackage(null,native);
  assert(pkg.skill.instructions.includes(HOSTED_TEXT_LIMIT));
  assert(pkg.steps[1].prompt.includes('blocked handoff'));
  assert(!pkg.steps[1].prompt.includes('Markdown only. Start with the first heading'));
  assert(!pkg.steps[2].prompt.includes('final deliverable in markdown, complete, with no comments'));
  assert(pkg.steps[2].prompt.includes('required checks that did not run'));
});

test('downloaded agent, training and trimmed seat all carry the same output policy',async()=>{
  const templates:Record<string,string>={};
  for(const path of ['AGENTS.md','train/AGENTS.md','train/personality.md','train/instructions.md'])templates[path]=readFileSync(new URL(`../packs/shared/${path}`,import.meta.url),'utf8');
  const persona={...NOVA,profile:{...NOVA.profile,style:{...NOVA.profile.style!,tone:'Electric and playful',sentences:'Long musical sentences or expressive fragments',formatting:'ALL CAPS and emoji are approved',words_i_use:['seamless','unlock']}}};
  for(const kind of ['agent','train'] as const){
    const pack=await buildPack({persona,role:null,kit:null,jobTypes:[LANDING_PAGE],templates,options:{kind,version:'test',updated:'2026-11-08'}});
    const file=(name:string)=>pack.files.find(row=>row.path===name)!.content;
    assert.equal(file('OUTPUT-POLICY.md'),outputPolicyMarkdown());
    assert(file('AGENTS.md').includes('OUTPUT-POLICY.md'));
    assert(file('playbook.md').includes(READINESS_RULE));
    assert(file('skills/landing-page-copy/SKILL.md').includes(FACT_RULE));
    assert(file('skills/landing-page-copy/SKILL.md').includes('Keep requested fiction and illustrative examples clearly distinct from factual claims.'));
    assert(!file('skills/landing-page-copy/SKILL.md').includes('Never invent numbers, prices, results, quotes, reviews, names, awards or links.'));
    assert(!file('playbook.md').includes('finished work in markdown, ready to use'));
    if(kind==='agent'){
      assert(file('personality.md').includes('Electric and playful'));
      assert(file('personality.md').includes('ALL CAPS and emoji are approved'));
      assert(!file('personality.md').includes('Writing rules I always follow'));
      assert(!file('personality.md').includes('Emoji, exclamation marks and ALL CAPS labels.'));
    }else{
      assert(file('instructions.md').includes('two conflicting customer voices'));
      assert(file('personality.md').includes('not a universal customer-output rule'));
    }
  }
  const seat=trimmedSeatPack(null,{seat_type:'maker',role_id:'test-maker'},'','',[]);
  assert.equal(seat.files['OUTPUT-POLICY.md'],outputPolicyMarkdown());assert(seat.bytes<=60_000);
});

test('approved studio style does not outrank the current task and verified authorised research stays allowed',()=>{
  const pkg=buildHousePackage(NOVA,LANDING_PAGE);
  pkg.style_rules=['Use short formal sentences for my usual status updates'];
  pkg.banned_patterns=['Avoid emoji in my usual status updates'];
  const merged=withRuleBlock(pkg);
  assert(merged.skill.instructions.includes(OUTPUT_PRECEDENCE));
  assert(merged.skill.instructions.includes('style preferences do not override the active task'));
  assert(merged.skill.instructions.includes('verified sources authorised for this task'));
  assert(merged.skill.instructions.includes('including permitted research and connected data'));
  assert(merged.skill.instructions.includes('required placeholders'));
  assert(merged.skill.instructions.includes('requested in a template'));
  assert.equal(withRuleBlock(merged).skill.instructions,merged.skill.instructions,'rule blocks stay idempotent');
});
