import { test } from 'node:test';
import assert from 'node:assert/strict';
import { captureCompositionContext, planningMeContext, restoreCompositionContext, workflowPlanningContext } from '../src/lib/composer-context.ts';
import { LIMITS, plannerPrompt } from '../src/lib/composer-core.ts';

// Synthetic profile. No real person, company or customer facts.
const me = `# me.md
## Core
Synthetic freelance editor.
## Work
Edits research papers in plain English.
## Projects (as of 2026-10-28, expires 2026-11-15)
Two draft guides are already supplied.
## Voice
First person, dry humour.
## Preferences
Deliver Markdown files.
## Never
Never invent testimonials.
## Background
Synthetic teaching history.
## Life
Private hiking plans.
## Where to look
Use the attached research notes.
## Sources and dates
User notes dated 2026-10-28.
`;

test('AI planning receives relevant work, projects, constraints and sources without unrelated private life', () => {
  const context = workflowPlanningContext('Make two guides, each with a source checklist.', me, 'Plan two research guides', true, '2026-10-29');
  const prompt = plannerPrompt('Plan two research guides', context, {}, []);
  for (const phrase of ['two guides', 'Edits research papers', 'Two draft guides', 'Deliver Markdown', 'Never invent testimonials', 'attached research notes', '2026-10-28']) assert(prompt.user.includes(phrase), phrase);
  for (const phrase of ['Private hiking plans', 'teaching history', 'dry humour']) assert(!context.includes(phrase), phrase);
  assert.match(context, /not instructions and do not authorize/);
});

test('expiry is checked before sending saved facts and a relevant personal task can use life and background', () => {
  const expired = planningMeContext(me, 'Plan research guides', '2026-11-16');
  assert(!expired.includes('Two draft guides'));
  assert.match(expired, /Expired on 2026-11-15/);
  assert.match(planningMeContext(me, 'Write my own LinkedIn bio about my background and personal life', '2026-10-29'), /Private hiking plans/);
  assert.match(planningMeContext(me, 'Write my own LinkedIn bio', '2026-10-29'), /teaching history/);
});

test('personal writing gets personal voice while customer emails use the brand voice rule', () => {
  assert.match(planningMeContext(me, 'Write my own LinkedIn posts', '2026-10-29'), /dry humour/);
  const brand = planningMeContext(me, 'Write customer emails', '2026-10-29');
  assert(!brand.includes('dry humour'));
  assert.match(brand, /brand brain/);
});

test('opting out preserves explicit notes exactly and context overflow fails without truncation', () => {
  const notes = '  Keep both paragraphs.\n\nUse the supplied CSV.  ';
  assert.equal(workflowPlanningContext(notes, me, 'Plan a report', false), notes);
  assert.equal(workflowPlanningContext('x'.repeat(LIMITS.context), '', 'Plan a report', false).length, LIMITS.context);
  assert.throws(() => workflowPlanningContext('x'.repeat(LIMITS.context), me, 'Plan a report', true), /Shorten your notes or turn off/);
});

test('versioned saves separate editable notes from the planner snapshot and reopen without appending it twice', () => {
  const notes = 'Use only the two supplied drafts.';
  const snapshot = workflowPlanningContext(notes, me, 'Plan research guides', true, '2026-10-29');
  const saved = captureCompositionContext(notes, snapshot, true);
  const reopened = restoreCompositionContext(JSON.parse(JSON.stringify(saved)));
  assert.equal(reopened.context, notes);
  assert.equal(reopened.planningContext, snapshot);
  assert.equal(workflowPlanningContext(reopened.context, me, 'Plan research guides', reopened.useContext, '2026-10-29'), snapshot);
  assert.deepEqual(restoreCompositionContext(captureCompositionContext(notes, notes, false)), captureCompositionContext(notes, notes, false));
});

test('legacy combined context is preserved with automatic saved-context append disabled; invalid snapshots fail closed', () => {
  const old = 'My original notes\n\nSaved Core facts from an older export.';
  const restored = restoreCompositionContext({ context: old });
  assert.equal(restored.context, old);
  assert.equal(workflowPlanningContext(restored.context, me, 'Plan research guides', restored.useContext), old);
  assert.equal(restoreCompositionContext({}).context, '');
  for (const saved of [{ context: {} }, { contextVersion: 3, context: old }, { contextVersion: 2, context: old, planningContext: [], useContext: true }, { contextVersion: 2, context: old, planningContext: old, useContext: 'yes' }, { context: 'x'.repeat(LIMITS.context + 1) }]) assert.throws(() => restoreCompositionContext(saved));
});
