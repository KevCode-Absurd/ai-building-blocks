import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beforeSection, nextOf, needsOf } from '../lib/needs.mjs';

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
