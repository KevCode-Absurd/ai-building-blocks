// Synthetic workflow fixtures, not real business data or demonstrated business outcomes.
export const SHA = 'a'.repeat(64);
const output = (id, name) => ({ id, name, format: 'Markdown' });
export function directScope() {
  return {
    id: 'synthetic-crawl', request: 'Fix the crawlability of my website.', route: 'direct', domain: 'software',
    subject: 'The supplied synthetic website repository.', goal: 'Find and repair supported crawlability defects and verify the patch.',
    deliverables: [output('handoff', 'Patch and crawlability check report')], acceptance_checks: ['Changed crawl directives match the reviewed intent; relevant checks pass.'],
    constraints: ['Keep live publishing separate.'], exclusions: ['No keyword strategy or complete business audit.'],
    sources: [{ id: 'repo', title: 'Synthetic website source', locator: 'project/README.md', as_of: '2026-10-30', status: 'SUPPLIED' }],
    work: [
      { id: 'fix', title: 'Repair supported defects', task: 'Implement the accepted crawlability findings in the website repository.', routing_task: 'Implement a crawlability fix in website code.', specialist_area: 'engineering', mode: 'FIX', priority: 'P0', priority_reason: 'The requested repair follows the accepted diagnosis.', depends_on: ['audit'], inputs: [{ name: 'Accepted crawl audit', from: { work_id: 'audit', deliverable_id: 'report' } }], source_ids: ['repo'], deliverables: [output('patch', 'Code patch')], checks: ['Relevant repository tests pass.'] },
      { id: 'audit', title: 'Audit crawlability', task: 'Inspect the repository crawl directives and return evidence-linked findings.', routing_task: 'Audit website crawlability and technical SEO.', specialist_area: 'marketing', mode: 'DIAGNOSE', priority: 'P2', priority_reason: 'Identify the specific defect before making changes.', source_ids: ['repo'], inputs: [{ name: 'Website source', from: { source_id: 'repo' } }], deliverables: [output('report', 'Crawlability audit')], checks: ['Every finding cites a source location.'] }
    ]
  };
}
export function diagnosticScope() {
  const s = directScope();
  Object.assign(s, { id: 'synthetic-business', request: 'My business is failing. Help me find what is wrong.', route: 'diagnostic', domain: 'business', subject: 'A synthetic business software service, with a supplied context brief and process export.', goal: 'Locate the supported activation constraint, state uncertainty and prepare an ordered repair and measurement plan.', symptom: 'The supplied synthetic export shows failed activation attempts during the declared period.' });
  s.sources.push({ id: 'brief', title: 'Synthetic business brief', locator: 'business/context.md', as_of: '2026-10-30', status: 'SUPPLIED' });
  s.pipeline = { stages: [{ id: 'visit', name: 'Visit', source_ids: ['brief'] }, { id: 'signup', name: 'Signup', source_ids: ['brief'] }, { id: 'activate', name: 'Activation', source_ids: ['repo'] }, { id: 'provision', name: 'Provision workspace', parent_id: 'activate', source_ids: ['repo'] }], edges: [{ from: 'visit', to: 'signup' }, { from: 'signup', to: 'activate' }] };
  s.findings = [{ id: 'activation', title: 'A provisioning error is present', detail: 'Synthetic logs identify an error at the provisioning step.', status: 'SUPPORTED', stage_ids: ['provision'], source_ids: ['repo'], alternatives: ['User intent and measurement gaps may also contribute.'], limitation: 'The observation alone does not establish the share of lost revenue attributable to the error.', next_test: 'Reproduce the error and measure the repaired path.' }];
  s.work[0].finding_ids = ['activation']; s.work[0].task = 'Repair the reproduced activation error in the repository, then hand off for measurement.'; s.work[0].routing_task = 'Fix a software activation bug with tests.';
  s.work[1].task = 'Reproduce the activation error and check the source evidence.'; s.work[1].routing_task = 'Debug a software activation failure in a repository with proof.'; s.work[1].specialist_area = 'engineering';
  return s;
}
export function teamFor(prepared) {
  return {
    id: 'synthetic-plan', business_id: 'synthetic-project', name: 'Scoped specialist plan', version: 1, goal: prepared.scope.goal,
    route_options: [{ id: 'evidence', name: 'Evidence first', reason: 'Diagnose before repair.' }], selected_route: 'evidence',
    context: prepared.scope.sources.filter(s => s.status === 'SUPPLIED').map(s => ({ id: s.id, path: s.locator, status: 'INFERRED', note: 'Host-reported supplied evidence; inspect before use.' })),
    stages: prepared.work.map(w => ({ id: w.id, name: w.title, role_id: w.mode === 'DIAGNOSE' ? 'seo-specialist' : 'coding-specialist', why: w.task.slice(0, 1500), depends_on: w.depends_on, methods: [{ slug: 'synthetic-method', revision_sha256: SHA }], inputs: w.inputs.map((i, n) => ({ id: 'input-' + n, name: i.name, from: i.from.source_id ? { context_id: i.from.source_id } : { stage_id: i.from.work_id, output_id: i.from.deliverable_id } })), outputs: w.deliverables.map(o => ({ ...o, path: `work/${w.id}/${o.id}.md` })), checks: w.checks.map((name, n) => ({ id: 'check-' + n, name, required: true })), requires_permissions: w.tool_ids }))
  };
}
