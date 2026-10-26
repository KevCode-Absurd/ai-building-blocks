import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import { TASKS, FUNCTIONS, AREAS, QUICK_JOB_IDS, areasOf, functionsOf, taskIdsOf, availableTasks, availableFunctions, classificationText } from '../src/lib/catalogue-taxonomy.mjs';
import { compileClassifications } from '../scripts/lib/catalogue-classification.mjs';

const source = YAML.parse(fs.readFileSync(new URL('../../catalogue-items/classification.yaml', import.meta.url), 'utf8'));
const classifications = compileClassifications(source);
const published = JSON.parse(fs.readFileSync(new URL('../public/data/blocks.json', import.meta.url), 'utf8')).blocks;
const bySlug = new Map(published.map(b => [b.slug, b]));

test('all published formats and items have valid functions, specialties and use cases', () => {
  const taskIds = new Set(TASKS.map(task => task.id)), areaIds = new Set(AREAS.map(area => area.id));
  for (const block of published) {
    assert(taskIdsOf(block).length && taskIdsOf(block).every(id => taskIds.has(id)), block.slug);
    assert(areasOf(block).length && areasOf(block).every(id => areaIds.has(id)), block.slug);
    assert(functionsOf(block).length, block.slug);
  }
  for (const task of TASKS) assert(FUNCTIONS.some(fn => fn.tasks.includes(task.id)), task.id);
  for (const fn of FUNCTIONS) assert(AREAS.some(area => area.fns.includes(fn.id)), fn.id);
  for (const id of QUICK_JOB_IDS) assert(areaIds.has(id), id);
});

test('reviewed metadata survives the public index build', () => {
  classifications.validateSlugs(published.map(b => b.slug));
  for (const [slug, task] of classifications.primary) assert.equal(bySlug.get(slug)?.task, task, slug);
  for (const block of published) for (const [key, value] of Object.entries(classifications.fields(block.slug))) assert.deepEqual(block[key], value, block.slug);
});

test('finance has prompts, skills, workflows, agents and minds', () => {
  const finance = published.filter(b => areasOf(b).includes('finance'));
  for (const kind of ['prompt', 'skill', 'workflow', 'agent', 'mind']) assert(finance.some(b => (b.type ?? 'skill') === kind), kind);
  for (const task of ['manage-accounting', 'plan-budgets-and-cash', 'manage-tax', 'raise-funding', 'manage-personal-finances', 'money-and-investing']) assert(availableTasks(finance).some(t => t.id === task), task);
});

test('a mind is discoverable through its original area and reviewed task, without becoming a skill', () => {
  const mind = bySlug.get('ramit-sethi');
  assert.equal(mind.type, 'mind');
  assert(areasOf(mind).includes(mind.area));
  assert(areasOf(mind).includes('finance'));
  assert(taskIdsOf(mind).includes('manage-personal-finances'));
  assert(availableTasks(published, { area: 'finance' }).some(t => t.id === 'think-with-minds'));
  assert(availableFunctions(published, 'finance').some(fn => fn.id === 'minds'));
});

test('cross-functional tasks are listed wherever the item can actually be found', () => {
  for (const area of AREAS) {
    const tasks = new Set(availableTasks(published, { area: area.id }).map(t => t.id));
    for (const b of published.filter(b => areasOf(b).includes(area.id))) for (const task of taskIdsOf(b)) assert(tasks.has(task), `${area.id}/${b.slug}/${task}`);
  }
});

test('investment frameworks are separated from general analytics and hardware from coding', () => {
  assert(!areasOf(bySlug.get('benjamin-graham')).includes('data'));
  assert(areasOf(bySlug.get('pcb-trace-designer')).includes('engineering'));
  assert(!areasOf(bySlug.get('pcb-trace-designer')).includes('coding'));
  assert(areasOf(bySlug.get('data-analyst')).includes('data'));
  assert(!areasOf(bySlug.get('data-analyst')).includes('finance'));
  assert.match(classificationText(bySlug.get('journal-entry-preparer')), /Finance and accounting/);
});

test('invalid or conflicting reviewed metadata fails explicitly', () => {
  assert.throws(() => compileClassifications({ primary: { typo: ['sample'] } }), /unknown/);
  assert.throws(() => compileClassifications({ primary: { 'manage-tax': ['a', 'a'] } }), /duplicate/);
  assert.throws(() => compileClassifications({ primary: { 'manage-tax': ['a'], 'analyse-data': ['a'] } }), /conflicting/);
  assert.throws(() => compileClassifications({ secondary: { 'manage-tax': ['a'] } }).validateSlugs([]), /unknown or withheld/);
});
