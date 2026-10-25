// Original browser-only utilities. Inputs stay data; no network or file operations.
const define = (slug, short, category, summary, help, example, run) => ({ slug, short, category, summary, help, example: JSON.stringify(example, null, 2), run, extension: 'json' });
const fail = message => { throw Error(message); };
const object = text => {
  if (typeof text !== 'string') fail('Paste JSON text.');
  if (text.length > 1_000_000) fail('Use at most 1,000,000 characters per input.');
  let value;
  try { value = JSON.parse(text); } catch { fail('Enter valid JSON. Use the editable example to check the format.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Enter a JSON object.');
  return value;
};
const label = value => typeof value === 'string' && value.trim().length > 0;
const array = (value, name, max, empty = false) => {
  if (!Array.isArray(value) || (!empty && !value.length) || value.length > max) fail(`Provide ${name} as ${empty ? 'an' : 'a nonempty'} array of at most ${max} entries.`);
};
const text = value => JSON.stringify(value, null, 2);
const dateValue = value => {
  if (typeof value !== 'string' || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) fail('Use dates from 1000 to 9999 in YYYY-MM-DD form.');
  const n = Date.parse(value + 'T00:00:00Z');
  if (!Number.isFinite(n) || new Date(n).toISOString().slice(0, 10) !== value) fail(`Check the date ${value}.`);
  return n;
};

function checkSources(input) {
  const x = object(input);
  array(x.sources, 'sources', 2000);
  array(x.citations, 'citations', 5000, true);
  const sources = new Map();
  for (const s of x.sources) {
    if (!s || !label(s.id) || !label(s.title)) fail('Every source needs a nonempty id and title.');
    if (sources.has(s.id)) fail(`Source id appears twice: ${s.id}`);
    sources.set(s.id, { id: s.id, title: s.title, uses: 0 });
  }
  const missing = [], used = new Set();
  for (const [index, c] of x.citations.entries()) {
    if (!c || !label(c.location)) fail('Every citation needs a nonempty location.');
    array(c.sourceIds, 'sourceIds for each citation', 100);
    if (c.sourceIds.some(id => !label(id)) || new Set(c.sourceIds).size !== c.sourceIds.length) fail('Use distinct, nonempty sourceIds within each citation.');
    for (const id of c.sourceIds) {
      if (sources.has(id)) { sources.get(id).uses++; used.add(id); }
      else missing.push({ citation: index + 1, location: c.location, sourceId: id });
    }
  }
  return text({ sourceCount: sources.size, citationCount: x.citations.length, unresolvedCitations: missing, uncitedSources: [...sources.values()].filter(s => !used.has(s.id)), sourceUsage: [...sources.values()], limitation: 'Checks exact IDs only. Read each source to verify that it supports the cited claim. Links and publication details are not checked.' });
}

function planDependencies(input) {
  const x = object(input);
  array(x.tasks, 'tasks', 1000);
  const tasks = new Map();
  for (const t of x.tasks) {
    if (!t || !label(t.id) || !label(t.title) || !Number.isSafeInteger(t.minutes) || t.minutes < 0 || t.minutes > 1_000_000) fail('Every task needs an id, title and whole minutes from 0 to 1,000,000.');
    array(t.dependsOn, 'dependsOn for each task', 1000, true);
    if (t.dependsOn.some(id => !label(id)) || new Set(t.dependsOn).size !== t.dependsOn.length) fail('List each dependency id once.');
    if (tasks.has(t.id)) fail(`Task id appears twice: ${t.id}`);
    tasks.set(t.id, t);
  }
  for (const t of tasks.values()) for (const id of t.dependsOn) if (!tasks.has(id)) fail(`Task ${t.id} has an unknown dependency: ${id}`);
  const finished = new Map(), waves = [], schedule = [];
  while (finished.size < tasks.size) {
    const ready = [...tasks.values()].filter(t => !finished.has(t.id) && t.dependsOn.every(id => finished.has(id)));
    if (!ready.length) fail('Dependencies contain a cycle. Remove circular dependencies before planning.');
    waves.push(ready.map(t => t.id));
    // Each wave uses only earlier waves, preserving dependency completion times.
    for (const t of ready) {
      const start = Math.max(0, ...t.dependsOn.map(id => finished.get(id)));
      const finish = start + t.minutes;
      finished.set(t.id, finish);
      schedule.push({ id: t.id, title: t.title, dependsOn: t.dependsOn, minutes: t.minutes, earliestStartMinute: start, earliestFinishMinute: finish });
    }
  }
  return text({ dependencyWaves: waves, earliestCompletionMinutes: Math.max(...finished.values()), schedule, limitation: 'Earliest times assume unlimited people, immediate handoffs and no breaks. Waves show dependency levels; tasks need not wait for unrelated tasks in an earlier wave. Nothing is scheduled.' });
}

function planStudyReviews(input) {
  const x = object(input);
  array(x.intervalsDays, 'intervalsDays', 24);
  if (x.intervalsDays.some((v, i) => !Number.isSafeInteger(v) || v < 0 || v > 3650 || (i > 0 && v <= x.intervalsDays[i - 1]))) fail('Use distinct, increasing whole-day intervals from 0 to 3650.');
  array(x.items, 'items', 400);
  const reviews = [];
  for (const [index, item] of x.items.entries()) {
    if (!item || !label(item.title)) fail('Every study item needs a title and studiedOn date.');
    const start = dateValue(item.studiedOn);
    for (const days of x.intervalsDays) {
      const date = new Date(start + days * 86_400_000).toISOString().slice(0, 10);
      if (!/^\d{4}-/.test(date)) fail('A review date goes beyond year 9999. Use an earlier start or smaller intervals.');
      reviews.push({ date, item: index + 1, title: item.title, daysAfterStudy: days });
    }
  }
  reviews.sort((a, b) => a.date.localeCompare(b.date) || a.item - b.item);
  return text({ reviewCount: reviews.length, reviews, limitation: 'Dates use the fixed intervals you chose after the original study date. This plan does not adapt to recall, guarantee learning or create calendar reminders.' });
}

const validFilename = value => typeof value === 'string' && value.length > 0 && value.length <= 255 && !/[<>:"/\\|?*\u0000-\u001f]/u.test(value) && !/[. ]$/u.test(value) && !/^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/iu.test(value) && value !== '.' && value !== '..';
const fileKey = value => value.normalize('NFC').toLowerCase();
function planFilenames(input) {
  const x = object(input);
  array(x.names, 'names', 2000);
  array(x.existingNames, 'existingNames', 2000, true);
  if (typeof x.prefix !== 'string' || !Number.isSafeInteger(x.start) || x.start < 0 || x.start > 1_000_000_000 || !Number.isSafeInteger(x.pad) || x.pad < 1 || x.pad > 12 || typeof x.keepExtension !== 'boolean') fail('Provide prefix text, start from 0 to 1,000,000,000, pad from 1 to 12 and a keepExtension boolean.');
  if ([...x.names, ...x.existingNames].some(name => !validFilename(name))) fail('Use plain portable filenames of at most 255 characters. Remove paths, reserved device names, forbidden characters and trailing dots or spaces.');
  if (new Set(x.names.map(fileKey)).size !== x.names.length) fail('Selected filenames must be distinct when case and Unicode normalization are ignored.');
  const occupied = new Map();
  const add = (name, owner) => { const key = fileKey(name); if (!occupied.has(key)) occupied.set(key, []); occupied.get(key).push(owner); };
  for (const name of x.existingNames) add(name, 'unselected file');
  for (const [i, name] of x.names.entries()) add(name, i);
  const proposed = new Map();
  const renames = x.names.map((name, i) => {
    const dot = name.lastIndexOf('.'), extension = x.keepExtension && dot > 0 ? name.slice(dot) : '';
    const newName = x.prefix + String(x.start + i).padStart(x.pad, '0') + extension;
    if (!validFilename(newName)) fail('The proposed filenames contain forbidden characters, reserved names, trailing dots or spaces, or exceed 255 characters. Change the prefix or padding.');
    const key = fileKey(newName);
    if (!proposed.has(key)) proposed.set(key, []);
    proposed.get(key).push(i);
    return { from: name, to: newName, conflicts: [] };
  });
  renames.forEach((r, i) => {
    const key = fileKey(r.to);
    if (proposed.get(key).length > 1) r.conflicts.push('Another selected file has the same proposed name.');
    if ((occupied.get(key) ?? []).some(owner => owner !== i)) r.conflicts.push('A listed file already occupies this name. Rename via temporary names or choose a different prefix.');
  });
  return text({ hasListedCollisions: renames.some(r => r.conflicts.length), renames, limitation: 'Preview only; no files are read or renamed. List unselected files from the same folder in existingNames. Checks case-insensitive NFC names conservatively; filesystem path lengths and platform-specific rules still need review. Only the final extension is kept; dotfiles have none.' });
}

export const LIBRARY_COVERAGE_TOOLS = [
  define('source-id-cross-checker', 'Source ID cross-checker', 'work', 'Paste source IDs and citations. Find unresolved references and sources your draft never cites.', 'Enter sources as objects with id and title; citations need location and sourceIds. IDs match exactly, including case and spaces. An empty citations array is allowed. Checks stay on this device.', { sources: [{ id: 'S1', title: 'Fictional workshop notes' }, { id: 'S2', title: 'Fictional interview notes' }], citations: [{ location: 'Paragraph 2', sourceIds: ['S1', 'S3'] }] }, checkSources),
  define('task-dependency-planner', 'Task dependency planner', 'work', 'Paste tasks, durations and dependencies. Get a valid task order and earliest completion times.', 'Enter tasks with unique id, title, whole minutes and dependsOn arrays of task IDs. Use [] for tasks that can start first. Cycles and unknown dependencies stop the plan. Times assume unlimited parallel capacity.', { tasks: [{ id: 'notes', title: 'Read notes', minutes: 30, dependsOn: [] }, { id: 'draft', title: 'Write draft', minutes: 45, dependsOn: ['notes'] }, { id: 'review', title: 'Review draft', minutes: 20, dependsOn: ['draft'] }] }, planDependencies),
  define('study-review-date-planner', 'Study review date planner', 'personal', 'Paste study dates and your chosen review intervals. Get a dated review list for each topic.', 'Enter increasing intervalsDays such as [1,3,7] and items with title and studiedOn in YYYY-MM-DD form. Every interval is measured from the original study date. Dates are calendar dates, independent of timezone. This creates a list for manual use.', { intervalsDays: [1, 3, 7], items: [{ title: 'Practice topic', studiedOn: '2026-10-24' }] }, planStudyReviews),
  define('file-rename-preview', 'File rename preview', 'operations', 'Paste filenames and a numbering pattern. Preview new names and flag collisions among the files you list.', 'Enter names, existingNames for unselected files in the same folder, prefix, start, pad and keepExtension. All arrays use plain filenames. Keeps only the last extension when requested. Review the plan before renaming files yourself.', { names: ['draft.txt', 'notes.txt'], existingNames: ['lesson-001.txt'], prefix: 'lesson-', start: 1, pad: 3, keepExtension: true }, planFilenames),
];

export function runLibraryCoverageTool(slug, input) {
  const tool = LIBRARY_COVERAGE_TOOLS.find(t => t.slug === slug);
  if (!tool) fail('Unknown utility.');
  return tool.run(input);
}
