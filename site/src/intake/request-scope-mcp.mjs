import { scopeSpecialistRequest, prepareScopedRequest, scopeDigest } from './request-scope.mjs';

const str = (maxLength = 2000) => ({ type: 'string', minLength: 1, maxLength });
const identifier = { ...str(80), pattern: '^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$' };
const hash = { ...str(64), pattern: '^[a-f0-9]{64}$' };
const list = (items, maxItems = 40) => ({ type: 'array', items, maxItems });
const obj = (properties, required = Object.keys(properties)) => ({ type: 'object', properties, required, additionalProperties: false });
const one = values => ({ type: 'string', enum: values });
const refs = list(identifier), strings = list(str(), 30);
const output = obj({ id: identifier, name: str(500), format: str(80) });
const inputSource = { oneOf: [obj({ source_id: identifier }), obj({ work_id: identifier, deliverable_id: identifier })] };
export const scopeInputSchema = obj({
  schema: { type: 'string', const: 'ai-blocks-request-scope/1' }, id: identifier, request: str(4000),
  route: { anyOf: [one(['direct', 'diagnostic']), { type: 'null' }] }, domain: { anyOf: [one(['business', 'software', 'design', 'operations', 'other']), { type: 'null' }] },
  subject: { type: 'string', maxLength: 3000 }, goal: { type: 'string', maxLength: 3000 }, symptom: { type: 'string', maxLength: 3000 },
  deliverables: list(output, 20), acceptance_checks: strings, constraints: strings, exclusions: strings,
  sources: list(obj({ id: identifier, title: str(300), locator: { type: 'string', maxLength: 2000 }, as_of: { anyOf: [{ type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }, { type: 'null' }] }, status: one(['SUPPLIED', 'MISSING', 'DISPUTED']) }, ['id', 'title', 'status'])),
  data_needs: list(obj({ id: identifier, name: str(300), why: str(1000), status: one(['SUPPLIED', 'MISSING', 'UNKNOWN', 'NOT_NEEDED']), source_ids: refs, required_for: refs, alternative: { type: 'string', maxLength: 1500 } }, ['id', 'name', 'why', 'status'])),
  tools: list(obj({ id: identifier, name: str(200), access: one(['read', 'write']), status: one(['AVAILABLE', 'MISSING', 'UNKNOWN']), authorization: one(['REPORTED_GRANTED', 'NEEDS_APPROVAL']), scope: str(1000), source_ids: refs }, ['id', 'name', 'access', 'status', 'authorization', 'scope']), 30),
  pipeline: obj({ stages: list(obj({ id: identifier, name: str(250), parent_id: { anyOf: [identifier, { type: 'null' }] }, source_ids: refs }, ['id', 'name']), 60), edges: list(obj({ from: identifier, to: identifier, kind: one(['flow', 'feedback']) }, ['from', 'to']), 100) }, []),
  findings: list(obj({ id: identifier, title: str(300), detail: str(3000), status: one(['SUPPORTED', 'HYPOTHESIS', 'UNKNOWN']), stage_ids: refs, source_ids: refs, alternatives: list(str(), 10), limitation: str(1500), next_test: { type: 'string', maxLength: 2000 } }, ['id', 'title', 'detail', 'status', 'limitation'])),
  work: list(obj({ id: identifier, title: str(200), task: str(4000), routing_task: { ...str(2000), description: 'Explicit discovery summary without private facts or source bodies. The host checks what is appropriate to include.' }, specialist_area: str(80), mode: one(['DIAGNOSE', 'FIX', 'MEASURE']), priority: one(['P0', 'P1', 'P2', 'P3', 'P4']), priority_reason: str(), finding_ids: refs, source_ids: refs, data_ids: refs, tool_ids: refs, depends_on: refs, inputs: list(obj({ name: str(300), from: inputSource }), 30), deliverables: list(output, 20), checks: strings }, ['id', 'title', 'task', 'routing_task', 'mode', 'priority', 'priority_reason', 'deliverables', 'checks']), 30)
}, ['id', 'request']);
const definition = (name, description, properties, required) => ({ name, description, inputSchema: obj(properties, required), annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } });
export const scopeMcpTools = [
  definition('scope_specialist_request', 'Start before specialist matching. Preserve the original request, suggest direct/diagnostic intake and ask only unanswered qualifying questions. The host AI interprets intent; no model or diagnosis runs here.', { request: str(4000) }, ['request']),
  definition('prepare_scoped_specialist_work', 'Validate a host-authored scope dossier: context/evidence gaps, pipeline/subprocesses, supported findings versus hypotheses, priorities, dependencies, tool authority and detailed work prompts. No invented root cause, tool execution or storage.', { scope: scopeInputSchema, approved_scope_sha256: hash }, ['scope']),
  definition('route_scoped_specialist_work', 'Find actual catalogue candidates for each ready scoped work item, in dependency/priority order. Blocked work is not matched. This does not prove fit or select/execute an agent.', { scope: scopeInputSchema, scope_sha256: hash }, ['scope', 'scope_sha256']),
  definition('prepare_scoped_specialist_team', 'Bind an exact existing specialist team plan to selected scoped work. Checks work dependencies, outputs, acceptance checks, evidence context and required tool permissions before delegating to current catalogue plan/source validation. Review still required; no execution or durable storage.', { scope: scopeInputSchema, scope_sha256: hash, plan: { type: 'object', description: 'Complete ai-blocks-team-plan/1 as required by prepare_specialist_team. No approval is inferred.' }, assignments: list(obj({ work_id: identifier, stage_id: identifier }), 30) }, ['scope', 'scope_sha256', 'plan', 'assignments'])
];
const fail = message => { throw Error(message); };
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

export function createScopeMcpService(catalogue) {
  if (!catalogue || typeof catalogue.callTool !== 'function') fail('Supply the actual catalogue service.');
  return { async callTool(name, args = {}) {
    const def = scopeMcpTools.find(t => t.name === name);
    if (!def || !args || typeof args !== 'object' || Array.isArray(args) || Object.keys(args).some(k => !Object.hasOwn(def.inputSchema.properties, k)) || def.inputSchema.required.some(k => !Object.hasOwn(args, k))) fail('Use documented scoping tool arguments.');
    if (name === 'scope_specialist_request') return scopeSpecialistRequest(args);
    const prepared = await prepareScopedRequest(args.scope, name === 'prepare_scoped_specialist_work' && args.approved_scope_sha256 !== undefined ? { approved_scope_sha256: args.approved_scope_sha256 } : {});
    if (name === 'prepare_scoped_specialist_work') return prepared;
    if (!HASH(args.scope_sha256) || args.scope_sha256 !== prepared.scope_sha256) fail('Fetch and review this exact scope before routing or planning.');
    if (name === 'route_scoped_specialist_work') {
      const routed = [];
      for (const work of prepared.work) {
        if (work.state !== 'READY_FOR_PLAN_REVIEW') { routed.push({ work_id: work.id, state: work.state, blockers: work.blockers, candidates: [] }); continue; }
        // Local catalogue retrieval; private source bodies and findings are not used as search text.
        const result = await catalogue.callTool('find_specialist', { task: work.routing_task, area: work.specialist_area, limit: 5 });
        if (!Array.isArray(result?.candidates)) fail('The catalogue did not return candidate records.');
        routed.push({ work_id: work.id, priority: work.priority, depends_on: work.depends_on, state: result.candidates.length ? 'CANDIDATES_REQUIRE_REMIT_REVIEW' : 'NO_MATCH', candidates: result.candidates, execution_blockers: work.execution_blockers, prompt: work.prompt });
      }
      return { schema: 'ai-blocks-scoped-routing/1', scope_sha256: prepared.scope_sha256, state: prepared.state, routed, model_calls: 0, stored_by_service: false, hosted_execution: false, next_action: 'Compare complete candidate remits and pinned methods with each brief. No candidates means clarify or discover a missing method. Author a concrete team plan and assignments; call prepare_scoped_specialist_team, show it and obtain exact plan review before production.' };
    }
    const plan = args.plan;
    if (!plan || typeof plan !== 'object' || Array.isArray(plan) || !Array.isArray(plan.stages) || !Array.isArray(args.assignments) || !args.assignments.length || args.assignments.length > 30) fail('Supply the full team plan and selected work assignments.');
    if (plan.goal !== prepared.scope.goal) fail('The team goal must preserve the scoped goal.');
    const assignments = new Map(), stageIds = new Set();
    for (const a of args.assignments) {
      if (!a || Object.keys(a).some(k => !['work_id', 'stage_id'].includes(k)) || assignments.has(a.work_id) || stageIds.has(a.stage_id) || typeof a.work_id !== 'string' || typeof a.stage_id !== 'string') fail('Use one unique stage per selected work item.');
      const w = prepared.work.find(w => w.id === a.work_id), s = plan.stages.find(s => s.id === a.stage_id);
      if (!w || !s || w.state !== 'READY_FOR_PLAN_REVIEW') fail('Only ready scoped work can enter a specialist team.');
      assignments.set(a.work_id, a.stage_id); stageIds.add(a.stage_id);
    }
    if (stageIds.size !== plan.stages.length) fail('Every team stage must belong to selected scoped work.');
    for (const [workId, stageId] of assignments) {
      const w = prepared.work.find(w => w.id === workId), s = plan.stages.find(s => s.id === stageId);
      if (w.depends_on.some(x => !assignments.has(x)) || !same(s.depends_on ?? [], w.depends_on.map(x => assignments.get(x)))) fail('Keep all scoped producer dependencies in the team.');
      if (!same((s.outputs ?? []).map(o => JSON.stringify([o.id, o.name, o.format])), w.deliverables.map(o => JSON.stringify([o.id, o.name, o.format]))) || !same((s.checks ?? []).map(c => c.name), w.checks) || (s.checks ?? []).some(c => c.required === false)) fail('Keep scoped deliverables and required acceptance checks.');
      for (const source of w.brief.sources) if (source.status === 'SUPPLIED' && !(plan.context ?? []).some(c => c.id === source.id && c.path === source.locator)) fail('Keep selected source locators in team context.');
      if (!same(s.requires_permissions ?? [], w.tool_ids)) fail('Do not add unscoped tool authority to a stage.');
      for (const tool of w.brief.tool_requirements) {
        const permission = (plan.permissions ?? []).find(p => p.id === tool.id);
        if (!permission || permission.scope !== tool.scope || !(s.requires_permissions ?? []).includes(tool.id) || permission.status === 'GRANTED' && tool.authorization !== 'REPORTED_GRANTED') fail('Keep required tool scopes and unresolved authority in the team.');
      }
      for (const input of w.inputs) {
        const from = input.from.source_id ? { context_id: input.from.source_id } : { stage_id: assignments.get(input.from.work_id), output_id: input.from.deliverable_id };
        if (!(s.inputs ?? []).some(i => i.name === input.name && i.required !== false && i.from && Object.keys(i.from).length === Object.keys(from).length && Object.entries(from).every(([key, value]) => i.from[key] === value))) fail('Keep actual scoped input handoffs in the team.');
      }
    }
    const usedTools = new Set(prepared.work.filter(w => assignments.has(w.id)).flatMap(w => w.tool_ids));
    if ((plan.permissions ?? []).some(p => !usedTools.has(p.id))) fail('Do not add unscoped permissions to a team.');
    const checkedPlan = { ...plan, notes: (plan.notes ? plan.notes + '\n\n' : '') + 'Scope dossier SHA-256: ' + prepared.scope_sha256 + '. Read the corresponding scope files and work prompts before production.' };
    const result = await catalogue.callTool('prepare_specialist_team', { plan: checkedPlan });
    if (!HASH(result?.plan_sha256)) fail('The catalogue did not return an exact prepared-plan digest.');
    return { ...result, scoping: { scope_sha256: prepared.scope_sha256, plan_sha256: result.plan_sha256, binding_sha256: await scopeDigest({ scope_sha256: prepared.scope_sha256, plan_sha256: result.plan_sha256, assignments: args.assignments }), assignments: args.assignments, assurance: 'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED', execution_blockers: prepared.work.filter(w => assignments.has(w.id)).flatMap(w => w.execution_blockers.map(reason => ({ work_id: w.id, reason }))) }, scope_files: prepared.files, next_action: 'Show the exact team plan, source revisions, scoped priorities, dependencies, missing tools and authority. Incorporate user edits and obtain exact plan review through the existing team protocol. Scope approval does not approve a plan or authorize external actions.' };
  } };
}
const HASH = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
