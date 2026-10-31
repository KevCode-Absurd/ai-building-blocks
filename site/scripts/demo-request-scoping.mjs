// Synthetic, local walkthrough. Reads an existing generated catalogue; does not call a model or execute work.
import fs from 'node:fs';
import path from 'node:path';
import { PublicCatalogueService } from '../src/server/public-catalogue.ts';
import { createScopeMcpService } from '../src/intake/request-scope-mcp.mjs';
import { directScope, diagnosticScope, teamFor } from '../test/fixtures/request-scope-fixtures.mjs';
const args = process.argv.slice(2), options = new Map();
for (let i = 0; i < args.length; i += 2) {
  if (!['--catalogue-dir', '--output'].includes(args[i]) || !args[i + 1] || options.has(args[i])) throw Error('Use --catalogue-dir PATH --output NEW_DIRECTORY.');
  options.set(args[i], args[i + 1]);
}
if (options.size !== 2) throw Error('Use --catalogue-dir PATH --output NEW_DIRECTORY.');
const catalogueDir = fs.realpathSync(options.get('--catalogue-dir')), output = path.resolve(options.get('--output'));
if (fs.existsSync(output)) throw Error('Refusing to overwrite an existing output directory.');
const catalogue = new PublicCatalogueService(async uri => {
  try { return new Response(fs.readFileSync(path.join(catalogueDir, uri.slice(1)))); } catch { return new Response('Missing', { status: 404 }); }
}, 'https://example.test');
const service = createScopeMcpService(catalogue), cases = [
  ['vague', { id: 'synthetic-vague', request: 'Improve my business.' }], ['direct', directScope()], ['diagnostic', diagnosticScope()]
];
const summaries = [], packets = [];
for (const [name, scope] of cases) {
  const prepared = await service.callTool('prepare_scoped_specialist_work', { scope });
  const routed = await service.callTool('route_scoped_specialist_work', { scope, scope_sha256: prepared.scope_sha256 });
  let team = null;
  if (name === 'direct') {
    const plan = teamFor(prepared);
    for (const stage of plan.stages) {
      const role = JSON.parse(fs.readFileSync(path.join(catalogueDir, 'data/roles/' + stage.role_id + '.json'))), method = role.resources.find(r => r.slug === role.lead);
      stage.methods = [{ slug: method.slug, revision_sha256: method.revision }];
    }
    team = await service.callTool('prepare_scoped_specialist_team', { scope, scope_sha256: prepared.scope_sha256, plan, assignments: prepared.work.map(w => ({ work_id: w.id, stage_id: w.id })) });
  }
  summaries.push({ case: name, synthetic: true, original_request: scope.request, state: prepared.state, scope_sha256: prepared.scope_sha256, next_questions: prepared.questions.map(q => q.id), ordered_work: prepared.work.map(w => ({ id: w.id, priority: w.priority, state: w.state })), candidates: routed.routed.map(r => ({ work_id: r.work_id, ids: r.candidates.slice(0, 3).map(c => c.id) })), team_state: team?.state ?? 'NOT_PREPARED', model_calls: 0, hosted_execution: false, business_outcome_measured: false });
  packets.push({ name, prepared, routed, team });
}
fs.mkdirSync(output);
for (const { name, prepared, routed, team } of packets) {
  const dir = path.join(output, name); fs.mkdirSync(dir);
  for (const [file, bytes] of Object.entries(prepared.files)) { const dest = path.join(dir, file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, bytes, { flag: 'wx' }); }
  fs.writeFileSync(path.join(dir, 'routing.json'), JSON.stringify(routed, null, 2) + '\n', { flag: 'wx' });
  if (team) fs.writeFileSync(path.join(dir, 'team-preparation.json'), JSON.stringify(team, null, 2) + '\n', { flag: 'wx' });
}
fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summaries, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output, cases: summaries }, null, 2));
