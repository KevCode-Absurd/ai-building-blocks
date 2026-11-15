import { test } from 'node:test';
import assert from 'node:assert/strict';
import { afterSection, beforeSection, nextOf, needsOf, planOf } from '../lib/needs.mjs';

test('a tool-only setup guide gives a useful next step without asking for an empty list of inputs', () => {
  const text = beforeSection({ needed: [], helps: [], chain: [], brain: null }, [{ name: 'Chat AI', why: 'Use the notes provided.' }]);
  assert.doesNotMatch(text, /better with\s*[.,]/);
  assert.match(text, /If a tool is unavailable/);
  assert.doesNotMatch(text, /Add them, or shall I/);
});

test('a setup guide with useful inputs still names the actual material', () => {
  const text = beforeSection({ needed: [{ key: 'meeting_notes', label: 'Meeting notes', what: 'rough notes or a transcript', parts: [], required: true }], helps: [], chain: [], brain: null });
  assert.match(text, /rough notes or a transcript/);
  assert.match(text, /Look for meeting notes/);
  assert.doesNotMatch(text, /none of it is required|works on its own/);
});

test('an imported skill is told to follow its own steps, not our CHECKS MISSED format', () => {
  const plan = { needed: [{ key: 'source_text', label: 'Source text', what: 'a long source', parts: [], required: true }], helps: [], chain: [], brain: null };
  const own = beforeSection(plan), imported = beforeSection(plan, [], '\n', { imported: true });
  assert.match(own, /CHECKS MISSED/);
  assert.doesNotMatch(imported, /CHECKS MISSED/);
  assert.match(imported, /Follow the skill below/);
});

test('an ordinary work plan does not lead to advertising through a generic report port', () => {
  const source = { slug: 'team-work-plan', name: 'Team work planner', task: 'organise-work', inputs: [], outputs: [{type:'plan'}] };
  const ads = { slug: 'ad-plan-review', name: 'Ad plan review', task: 'run-google-ads', inputs:[{type:'plan',required:true}], outputs:[] };
  const follow = { slug:'team-actions', name:'Team action tracker', task:'organise-work', inputs:[{type:'plan',required:true}], outputs:[] };
  assert.deepEqual(nextOf(source,[source,ads,follow]).map(x=>x.slug),[follow.slug]);
});

test('the catch-all AI setup task cannot connect unrelated plans through a broad port', () => {
  const source = {slug:'study-plan', task:'set-up-ai', inputs:[], outputs:[{type:'plan'}]};
  const other = {slug:'server-plan', task:'set-up-ai', inputs:[{type:'plan',required:true}], outputs:[]};
  assert.deepEqual(nextOf(source,[source,other]),[]);
});

test('a notes editor still needs notes when it returns the same kind of material', () => {
  const editor={slug:'notes-editor',inputs:[{type:'meeting_notes',required:true}],outputs:[{type:'meeting_notes'}]};
  const needs=needsOf(editor,{},t=>({label:t,what:'Meeting notes to edit'}));
  assert.equal(needs.needed.length,1);
  assert.equal(needs.needed[0].key,'meeting_notes');
});

test('a workflow cannot erase a starting input because a later step returns the same type', () => {
  const flow={slug:'question-flow',inputs:[{type:'question',required:true}],outputs:[{type:'question'}],steps:[{uses:'read-question'},{uses:'rewrite-question'}]};
  const bySlug={'read-question':{inputs:[{type:'question',required:true}],outputs:[{type:'brief'}]},'rewrite-question':{inputs:[{type:'brief',required:true}],outputs:[{type:'question'}]}};
  const needs=needsOf(flow,bySlug);
  assert.equal(needs.needed.length,1);
  assert.equal(needs.needed[0].key,'question');
});

test('meeting minutes lead to meeting actions and board minutes rather than an unrelated advertising task', () => {
  const base = { type: 'skill', category: 'general', inputs: [{ type: 'meeting_notes', required: true }], outputs: [], task: 'organise-work' };
  const minutes = { ...base, slug: 'rough-notes-to-minutes-writer', outputs: [{ type: 'meeting_notes' }] };
  const weekly = { ...base, slug: 'weekly-meeting-actions-keeper', name: 'Weekly meeting action tracker' };
  const board = { ...base, slug: 'board-minutes-drafter', name: 'Board minutes writer' };
  const ads = { ...base, slug: 'google-ads-dip-investigator', name: 'Google Ads results review', task: 'run-google-ads', tested: { result: 'pass' } };
  const next = nextOf(minutes, [minutes, ads, weekly, board]);
  assert.deepEqual(next.map(x => x.slug), [weekly.slug, board.slug]);
  assert(next.every(x => x.takes.length));
});

const makers = {
  'website-brand-brain-builder': { slug: 'website-brand-brain-builder', name: 'Org context builder', task: 'brand-file', inputs: [], outputs: [{ type: 'brand_brain' }] },
  'ai-image-fix-rules': { slug: 'ai-image-fix-rules', name: 'AI visual feedback editor', task: 'check-ads', inputs: [], outputs: [{ type: 'lessons_register' }] },
  'buyer-brief-writer': { slug: 'buyer-brief-writer', name: 'Buyer brief writer', task: 'understand-customers', inputs: [], outputs: [{ type: 'brief' }] },
};

test('stock and decision work get plain inputs, not the org context, ad lessons or a buyer brief', () => {
  const stock = { slug: 'stock-watch', task: 'plan-supply-chain', inputs: [{ type: 'spreadsheet', required: true }, { type: 'product_data', required: true }], outputs: [] };
  const decide = { slug: 'decision-log', task: 'think-and-decide', inputs: [{ type: 'question', required: true }, { type: 'lessons_register', required: false }, { type: 'brief', required: false }], outputs: [] };
  for (const b of [stock, decide]) {
    const { needed, helps } = needsOf(b, makers);
    assert.deepEqual([...needed, ...helps].filter(i => i.maker), []);
    assert.doesNotMatch(JSON.stringify([...needed, ...helps]), /past ads|buyer brief|Brand brain|Brand file|Org context/i);
  }
  assert.deepEqual(needsOf(stock, makers).needed.map(i => i.key), ['spreadsheet', 'product_data']);
});

test('ad work still reads product data from the org context and lessons from past ads', () => {
  const ad = { slug: 'image-ad', task: 'make-image-ads', inputs: [{ type: 'product_data', required: true }, { type: 'lessons_register', required: false }], outputs: [] };
  const { needed, helps } = needsOf(ad, makers);
  assert.deepEqual(needed.map(i => i.key), ['website-brand-brain-builder']);
  assert.deepEqual(helps.map(i => i.key), ['ai-image-fix-rules']);
});

test('a workflow lists its own inputs and specific step inputs, not the generic hand-offs between steps', () => {
  const bySlug = { ...makers, read: { slug: 'read', task: 'track-numbers', inputs: [{ type: 'spreadsheet', required: true }], outputs: [{ type: 'audit_report' }] }, act: { slug: 'act', task: 'track-numbers', inputs: [{ type: 'plan', required: true }, { type: 'performance_sheet', required: false }], outputs: [{ type: 'plan' }] } };
  const flow = { slug: 'flow', task: 'track-numbers', inputs: [{ type: 'spreadsheet', required: true }], outputs: [{ type: 'plan' }], steps: [{ uses: 'read' }, { uses: 'act' }] };
  const { needed, helps } = needsOf(flow, bySlug);
  assert.deepEqual(needed.map(i => i.key), ['spreadsheet']);
  assert.deepEqual(helps.map(i => i.key), ['performance_sheet']);
});

test('real hand-offs beat a same-job sibling that takes nothing, and the label names only what it really takes', () => {
  const base = { type: 'skill', category: 'general', task: 'organise-work', outputs: [] };
  const notes = { ...base, slug: 'weekly-meeting-notes-writer', name: 'Weekly meeting notes writer', summary: 'Turn a weekly team meeting into clean notes.', inputs: [{ type: 'transcript', required: true }], outputs: [{ type: 'meeting_notes' }] };
  const sibling = { ...base, slug: 'weekly-meeting-notes-tidier', name: 'Weekly meeting notes tidier', summary: 'Turn a weekly team meeting into tidy notes.', inputs: [{ type: 'transcript', required: true }] };
  const actions = { ...base, slug: 'action-tracker', name: 'Action tracker', summary: 'Keep owners and dates for each action.', inputs: [{ type: 'meeting_notes', required: true }] };
  const board = { ...base, slug: 'board-minutes-drafter', name: 'Board minutes writer', summary: 'Write formal minutes for the board.', inputs: [{ type: 'meeting_notes', required: true }, { type: 'plan', required: false }] };
  const next = nextOf(notes, [notes, sibling, actions, board]);
  assert.deepEqual(next.map(x => x.slug).sort(), [actions.slug, board.slug]);
  assert(next.every(x => x.takes.length === 1 && x.takes[0] === 'meeting notes'));
});

test('a result that only stands in for another type helps pick the link but is never named as the hand-off', () => {
  const base = { type: 'skill', category: 'general', task: 'product-photos', outputs: [] };
  const shoot = { ...base, slug: 'studio-photo-set-maker', name: 'Studio photo set maker', summary: 'Make a studio photo set of the product.', inputs: [{ type: 'product_data', required: true }], outputs: [{ type: 'photo_set' }] };
  const checker = { ...base, slug: 'product-photo-checker', name: 'Product photo checker', summary: 'Check product photos against the real product.', inputs: [{ type: 'product_photos', required: true }] };
  const next = nextOf(shoot, [shoot, checker]);
  assert.deepEqual(next.map(x => x.slug), [checker.slug]);
  assert.deepEqual(next[0].takes, []);
});

test('a loose hand-off links only blocks on the same topic, and a check is not followed by unrelated report readers', () => {
  const base = { type: 'skill', category: 'general', outputs: [] };
  const mail = { ...base, slug: 'direct-mail-review', name: 'Direct mail package reviewer', task: 'check-ads', role: 'check', summary: 'Check your direct mail envelope and letter before it prints. Get a score and a fix for each problem.', inputs: [{ type: 'copy_draft', required: true }], outputs: [{ type: 'audit_report' }] };
  const seo = { ...base, slug: 'store-seo-fixes', name: 'Store SEO fix prioritiser', task: 'get-found-in-search', summary: 'Rank the SEO fixes for your store by score.', inputs: [{ type: 'audit_report', required: true }] };
  const whys = { ...base, slug: 'five-whys', name: 'Five whys session planner', task: 'lead-people', summary: 'Plan a five whys session to find why a failure happened.', inputs: [{ type: 'question', required: true }], outputs: [{ type: 'plan' }] };
  const review = { ...base, slug: 'blame-free-review', name: 'Blame-free review agenda writer', task: 'lead-people', summary: 'Turn the five whys findings into a blame-free review agenda.', inputs: [{ type: 'plan', required: true }] };
  const partner = { ...base, slug: 'partner-screener', name: 'Long-term partner screener', task: 'lead-people', summary: 'Screen a business partner before you sign.', inputs: [{ type: 'plan', required: true }] };
  const all = [mail, seo, whys, review, partner];
  assert.deepEqual(nextOf(mail, all), []);
  assert.deepEqual(nextOf(whys, all).map(x => x.slug), [review.slug]);
});

test('generated text never doubles an article', () => {
  const bySlug = { 'buyer-brief-writer': { slug: 'buyer-brief-writer', name: 'Buyer brief writer', task: 'understand-customers', inputs: [], outputs: [{ type: 'brief' }] } };
  const step = { slug: 'step', name: 'Step', url: 'https://useaiblocks.com/skills/step', label: 'A draft', bring: [], uses: ['A buyer brief', 'Your offer'] };
  const text = beforeSection({ needed: [], helps: [{ key: 'buyer-brief-writer', label: 'A buyer brief', what: 'a brief', parts: [], required: false, maker: { ...bySlug['buyer-brief-writer'], url: 'u' } }], chain: [step], brain: null });
  assert.match(text, /It uses your buyer brief and offer\./);
  const terms = { slug: 'terms-writer', name: 'Deal terms writer', task: 'sell-and-negotiate', summary: 'Write the partner deal terms.', inputs: [], outputs: [{ type: 'deal_terms' }] };
  const desk = { slug: 'deal-desk', name: 'Deal desk reviewer', task: 'sell-and-negotiate', summary: 'Review partner deal terms.', inputs: [{ type: 'deal_terms', required: true }], outputs: [] };
  const text2 = afterSection({ job: terms.task, next: nextOf(terms, [terms, desk]) });
  assert.match(text2, /It takes the deal terms\./);
  assert.doesNotMatch(text2, /the the/);
});

test('work that reads the org context names its parts and where to find it, not the old eight files', () => {
  const ad = { slug: 'image-ad', name: 'Image ad maker', task: 'make-image-ads', inputs: [{ type: 'product_data', required: true }], outputs: [{ type: 'static_ads' }] };
  const plan = planOf(ad, makers, [...Object.values(makers), ad], (t) => ({ label: t, what: t }));
  assert.deepEqual(plan.brain.files, ['index.md', 'look.json', 'foundation/design.md', 'offers.json', 'facts.json']);
  assert.equal(plan.needed[0].label, 'Org context');
  const text = beforeSection(plan);
  assert.match(text, /\*\*From the org context, read:\*\* `index\.md`, `look\.json`, `foundation\/design\.md`, `offers\.json`, `facts\.json`\./);
  assert.match(text, /an org context is a `context\/org-context\/` folder with `index\.md` in it/);
  assert.match(text, /An older `context\/brand-file\/` folder, or a brand folder with `00-start-here\.md` in it, still works as material\./);
  assert.match(text, /Look for your org context/);
  assert.doesNotMatch(text, /eight files|brand brain|Brand file|voice-and-look|proof-and-claims|—/i);
});
