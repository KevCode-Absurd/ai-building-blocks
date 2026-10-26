import fs from 'node:fs';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import { compileClassifications } from './lib/catalogue-classification.mjs';
import { AREAS, TASKS, FUNCTIONS, areasOf, functionsOf, taskIdsOf, availableTasks } from '../src/lib/catalogue-taxonomy.mjs';

const root = '../reports/2026-10-26-library-taxonomy';
const catalogue = JSON.parse(fs.readFileSync('public/data/blocks.json', 'utf8'));
const baseline = JSON.parse(fs.readFileSync(`${root}/baseline.json`, 'utf8'));
const kinds = ['prompt', 'skill', 'workflow', 'agent', 'mind'];
const kindOf = b => b.type === 'routine' || b.category === 'orchestrator' ? 'workflow' : b.type ?? 'skill';
const taskIds = new Set(TASKS.map(t => t.id)), areaIds = new Set(AREAS.map(a => a.id));
for (const b of baseline) assert(catalogue.blocks.some(item => item.slug === b.slug), `${b.slug}: original entry must survive`);
const intended = compileClassifications(YAML.parse(fs.readFileSync('../catalogue-items/classification.yaml', 'utf8')));
intended.validateSlugs(catalogue.blocks.map(b => b.slug));
const before = new Map(baseline.map(b => [b.slug, b]));
const rows = catalogue.blocks.map(b => {
  const old = before.get(b.slug);
  if (old) assert.equal(kindOf(b), kindOf(old), `${b.slug}: format must stay unchanged`);
  if (intended.primary.has(b.slug)) assert.equal(b.task, intended.primary.get(b.slug), `${b.slug}: stale index`);
  for (const [key, value] of Object.entries(intended.fields(b.slug))) assert.deepEqual(b[key], value, `${b.slug}: stale ${key}`);
  const tasks = taskIdsOf(b), areas = areasOf(b), fns = functionsOf(b).map(f => f.id);
  assert(tasks.length && tasks.every(id => taskIds.has(id)), `${b.slug}: unknown or missing use case`);
  assert(areas.length && areas.every(id => areaIds.has(id)), `${b.slug}: unknown or missing job function`);
  assert(fns.length, `${b.slug}: no specialty`);
  for (const area of areas) for (const task of tasks) assert(availableTasks([b], { area }).some(t => t.id === task), `${b.slug}: hidden use case`);
  return { slug: b.slug, format: kindOf(b), previousTask: old?.task ?? b.task, task: b.task, tasks, areas, specialties: fns };
});
for (const task of TASKS) assert(FUNCTIONS.some(fn => fn.tasks.includes(task.id)), `${task.id}: no specialty owns this use case`);
for (const fn of FUNCTIONS) assert(AREAS.some(area => area.fns.includes(fn.id)), `${fn.id}: no job function owns this specialty`);
const counts = entries => Object.fromEntries(kinds.map(kind => [kind, entries.filter(b => kindOf(b) === kind).length]));
const matrix = AREAS.map(area => ({ id: area.id, name: area.name, total: rows.filter(r => r.areas.includes(area.id)).length,
  ...Object.fromEntries(kinds.map(kind => [kind, rows.filter(r => r.areas.includes(area.id) && r.format === kind).length])) }));
const useCases = TASKS.map(task => ({ ...task, ...counts(catalogue.blocks.filter(b => taskIdsOf(b).includes(task.id))) }));
const report = { date: '2026-10-26', entries: rows.length, functions: AREAS.length, specialties: FUNCTIONS.length, useCases: TASKS.length,
  formats: counts(catalogue.blocks), reclassified: rows.filter(row => row.previousTask !== row.task).length,
  secondaryTagged: catalogue.blocks.filter(b => b.tasks?.length).length, unclassified: 0, unknownUseCases: 0,
  matrix, useCaseCoverage: useCases, gaps: matrix.filter(row => kinds.some(kind => row[kind] === 0)).map(row => ({ function: row.name, missingFormats: kinds.filter(kind => row[kind] === 0) })) };
fs.writeFileSync(`${root}/coverage.json`, JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(`${root}/items.json`, JSON.stringify(rows, null, 2) + '\n');
const table = ['| Job function | Prompts | Skills | Workflows | Agents | Minds |', '|---|---:|---:|---:|---:|---:|', ...matrix.map(row => `| ${row.name} | ${kinds.map(kind => row[kind]).join(' | ')} |`)];
fs.writeFileSync(`${root}/coverage.md`, `# Library classification audit, 26 October 2026\n\nChecked all ${rows.length.toLocaleString('en')} published entries against the shared vocabulary. All entries have valid use cases, specialties and job functions. Item formats and slugs are preserved.\n\nThere are ${AREAS.length} job functions, ${FUNCTIONS.length} specialties and ${TASKS.length} use cases. ${report.reclassified} primary classifications were refined; ${report.secondaryTagged} items carry additional use cases. Categories overlap where the same work serves multiple functions; counts should not be added together.\n\n${table.join('\n')}\n\n## Remaining content gaps\n\n${report.gaps.map(gap => `- ${gap.function}: ${gap.missingFormats.join(', ')}.`).join('\n')}\n\nThese are real gaps in published formats, not hidden entries. No new content or format claims were invented to fill them. This audit checks catalog metadata and discoverability, not the runtime quality of every skill.\n\n## Classification rules\n\n- Job function identifies the work area. Use case describes the task. Format identifies how to use the entry.\n- A primary use case stays specific; reviewed secondary use cases support cross-functional discovery.\n- Minds keep their existing biographical areas and gain task tags only where their published description supports the task.\n- Industries and software names stay out of the job-function list. Hardware engineering has a separate function from software coding.\n- Routines remain in Workflows, as in the existing format model.\n- Updates live in catalogue-items/classification.yaml. Source instruction files remain unchanged.\n- The complete job-function selector is visible; use-case and specialty menus are derived from real membership, including Minds.\n\nThe per-item record is in items.json; machine-readable totals and the full use-case-by-format matrix are in coverage.json.\n`);
console.log(JSON.stringify({ ...report, matrix: undefined, useCaseCoverage: undefined }, null, 2));
