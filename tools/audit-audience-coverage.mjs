// Count the published catalogue, then check editorial starting points. Counts are inventory, not evidence of usefulness.
import fs from 'node:fs';
import { AUDIENCE_STARTERS, WORK_STARTERS, STARTER_PATHS } from '../site/src/lib/audience-starters.ts';
const catalogue = JSON.parse(fs.readFileSync('site/public/data/blocks.json', 'utf8'));
const blocks = catalogue.blocks, bySlug = new Map(blocks.map(b => [b.slug, b]));
const tally = key => blocks.reduce((out, b) => { const value = b[key] ?? (key === 'type' ? 'skill' : key === 'level' ? 'intermediate' : 'unknown'); out[value] = (out[value] ?? 0) + 1; return out; }, {});
const report = {
  checkedOn: '2026-10-22', launchTarget: '2026-10-23',
  method: 'Published catalogue inventory plus manually curated starter paths for the user-selected audiences. Matching an audience path is editorial selection, not a suitability certification. Existing tested badges were counted, not independently re-evaluated.',
  total: blocks.length, withPassingTestBadge: blocks.filter(b => b.tested).length,
  withoutPassingTestBadge: blocks.filter(b => !b.tested).length,
  types: tally('type'), levels: tally('level'), tasks: tally('task'),
  audiences: AUDIENCE_STARTERS.map(a => ({ ...a, entries: a.slugs.map(slug => ({ slug, published: bySlug.has(slug), testedBadge: !!bySlug.get(slug)?.tested, task: bySlug.get(slug)?.task })) })),
  requestedWork: WORK_STARTERS.map(a => ({ ...a, entries: a.slugs.map(slug => ({ slug, published: bySlug.has(slug), testedBadge: !!bySlug.get(slug)?.tested, task: bySlug.get(slug)?.task })) })),
  missingStarterEntries: STARTER_PATHS.flatMap(a => a.slugs.filter(slug => !bySlug.has(slug)).map(slug => `${a.id}: ${slug}`)),
};
fs.writeFileSync('reports/audience-coverage.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ total: report.total, withPassingTestBadge: report.withPassingTestBadge, withoutPassingTestBadge: report.withoutPassingTestBadge, missingStarterEntries: report.missingStarterEntries }));
if (report.missingStarterEntries.length) process.exitCode = 1;
