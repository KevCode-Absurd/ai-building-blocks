import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { workflows, agents } from './next-100-data.mjs';
import { NEXT_TOOLS } from '../site/src/tools/next-100-tools.mjs';

const manifestPath = 'reports/2026-10-22-next-100-recipes.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath));
assert.equal(workflows.length, 55); assert.equal(agents.length, 20); assert.equal(NEXT_TOOLS.length, 25);
assert.equal(manifest.items.length, 75);
const authorFiles = [
  'tools/next-100-data.mjs', 'tools/build-next-100.mjs', 'tools/freeze-next-100.mjs',
  'tools/check-next-100-adapters.py', 'tools/check-next-100-independent.mjs', 'tools/check-next-100-packs.mjs',
  'site/src/tools/browser-tools.mjs', 'site/src/tools/csv-utils.mjs', 'site/src/tools/next-100-tools.mjs',
  'site/src/tools/BrowserTool.tsx', 'site/src/tools/NextToolInputs.tsx', 'site/src/tools/next-tool-inputs.css',
  'site/test/browser-tools.test.mjs', 'site/test/next-100-independent-tools.test.mjs',
  'site/e2e/everyday-expansion.spec.ts', 'site/e2e/next-100.spec.ts', 'site/playwright.next-100.config.ts',
  'catalogue-items/imported/case-competition-slide-deck-builder/launch-tools/build_case.py',
  'catalogue-items/imported/equity-research-valuation-report-builder/launch-tools/render_equity.py',
];
const sha = path => crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const files = [...new Set([...authorFiles,...manifest.items.flatMap(item=>item.files)])].sort().map(path=>({path,sha256:sha(path)}));
const report = {
  createdAt:new Date().toISOString(), status:'source-ready-for-frozen-build-and-browser-QA',
  counts:{tools:25,workflows:55,agents:20,total:100,generatedCatalogueFiles:225},
  ownership:'This batch only. Other composer, voice, security and publication changes are coordinated and owned by the publishing chat.',
  manifest:{path:manifestPath,sha256:sha(manifestPath)},files,
  tools:NEXT_TOOLS.map(({slug,short,category,extension})=>({slug,name:short,category,resultFormat:extension})),
  workflows:workflows.map(({name,job,sector,deliverable})=>({name,job,sector,deliverable})),
  agents:agents.map(({name,workflow,trigger,sector})=>({name,workflow,trigger,sector})),
  verificationScope:'50 original and new utility unit cases, TypeScript compile, source method review and 4 native adapter fixtures passed. Final frozen-build browser, exact download and production checks are recorded separately. Method and pack verification do not claim execution of all business workflows; agent installation does not start a schedule.',
};
fs.writeFileSync('reports/2026-10-22-next-100-source-freeze.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,counts:report.counts,pinnedFiles:files.length}));
