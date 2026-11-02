// Outcome playbooks: our reusable know-how for one kind of outcome. Validation only; no model, storage or execution.
export const PLAYBOOK_SCHEMA = 'ai-blocks-outcome-playbook/1';
// The universal lifecycle. A stage may depend only on stages of the same or an earlier kind.
export const STAGE_KINDS = ['intake', 'context', 'evidence', 'integrity', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'];
export const GATES = ['none', 'review', 'approve', 'approve_each_action'];
const ACCESS = ['read', 'draft', 'live'];
const ROUTES = ['MCP', 'CSV', 'FILE', 'URL', 'ASK'];
const ID = /^[a-z0-9][a-z0-9-]{0,79}$/;
const SLUG = /^[a-z0-9][a-z0-9-]{0,119}$/;

const fail = message => { throw Error(message); };
const object = (v, label) => v && typeof v === 'object' && !Array.isArray(v) ? v : fail(`${label} must be an object.`);
const keys = (v, allowed, label) => { const extra = Object.keys(v).find(k => !allowed.includes(k)); if (extra) fail(`${label} has an unsupported field: ${extra}.`); };
const text = (v, label, max = 2000) => typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : fail(`${label} must be nonempty text of at most ${max} characters.`);
const rows = (v, label, max = 40) => v === undefined ? [] : Array.isArray(v) && v.length <= max ? v : fail(`${label} must be a list of at most ${max}.`);
const unique = (v, label) => new Set(v).size === v.length ? v : fail(`${label} must be unique.`);
const id = (v, label) => ID.test(v ?? '') ? v : fail(`${label} must be a lowercase id.`);
const ids = (v, label) => unique(rows(v, label).map(x => id(x, label)), label);
const texts = (v, label, max = 30) => unique(rows(v, label, max).map(x => text(x, label)), label);
const one = (v, allowed, label) => allowed.includes(v) ? v : fail(`${label} must be one of ${allowed.join(', ')}.`);
const known = (refs, set, label) => { const bad = refs.find(r => !set.has(r)); if (bad) fail(`${label} refers to unknown ${bad}.`); return refs; };
function safePath(v, label) {
  const p = text(v, label, 200);
  if (p.includes('\\') || p.startsWith('/') || /^[a-z]+:/i.test(p) || p.split('/').some(s => !s || s === '.' || s === '..' || /[<>:"|?*\u0000-\u001f]/.test(s))) fail(`${label} must be a safe relative path.`);
  return p;
}

/** Check structure, references and the safety rules every playbook must keep. methodSlugs/roleIds check the live catalogue when supplied. */
export function validatePlaybook(input, { methodSlugs, roleIds } = {}) {
  const p = object(input, 'Playbook');
  keys(p, ['schema', 'id', 'version', 'name', 'outcome', 'fallback', 'signals', 'metric', 'questions', 'data', 'capabilities', 'stages', 'hypotheses', 'deliverable', 'measurement'], 'Playbook');
  if (p.schema !== PLAYBOOK_SCHEMA) fail('Unknown playbook schema.');
  if (!Number.isSafeInteger(p.version) || p.version < 1) fail('Playbook version must be a positive integer.');
  const fallback = p.fallback === true;
  const signals = texts(p.signals, 'Signals', 60).map(s => s.toLowerCase());
  if (!fallback && !signals.length) fail('A specific playbook needs matching signals.');
  const metric = p.metric === undefined && fallback ? null : (() => {
    const m = object(p.metric, 'Metric'); keys(m, ['name', 'direction', 'unit', 'guardrails'], 'Metric');
    return { name: text(m.name, 'Metric name', 200), direction: one(m.direction, ['decrease', 'increase', 'reach'], 'Metric direction'), unit: text(m.unit, 'Metric unit', 40), guardrails: texts(m.guardrails, 'Guardrails', 12) };
  })();

  const stages = rows(p.stages, 'Stages', 30).map((s, i) => {
    object(s, 'Stage'); keys(s, ['id', 'kind', 'name', 'goal', 'owner', 'support', 'methods', 'data', 'needs', 'depends_on', 'outputs', 'checks', 'gate', 'optional_when'], 'Stage');
    const owner = object(s.owner, 'Stage owner'); keys(owner, ['role', 'area'], 'Stage owner');
    if (!!owner.role === !!owner.area) fail('A stage owner names exactly one role or one area.');
    if (owner.area && !fallback) fail('A specific playbook names the owner role for every stage.');
    const outputs = rows(s.outputs, 'Stage outputs', 12).map(o => { object(o, 'Output'); keys(o, ['id', 'name', 'format', 'path'], 'Output'); return { id: id(o.id, 'Output id'), name: text(o.name, 'Output name', 250), format: text(o.format, 'Output format', 40), path: safePath(o.path, 'Output path') }; });
    const checks = rows(s.checks, 'Stage checks', 12).map(c => { object(c, 'Check'); keys(c, ['id', 'name', 'required'], 'Check'); return { id: id(c.id, 'Check id'), name: text(c.name, 'Check name', 500), required: c.required !== false }; });
    unique(outputs.map(o => o.id), 'Output ids'); unique(checks.map(c => c.id), 'Check ids');
    const kind = one(s.kind, STAGE_KINDS, 'Stage kind');
    if (kind !== 'intake' && !outputs.length) fail(`Stage ${s.id} needs at least one output.`);
    return {
      id: id(s.id, 'Stage id'), kind, name: text(s.name, 'Stage name', 120), goal: text(s.goal, 'Stage goal', 1500),
      owner: owner.role ? { role: id(owner.role, 'Owner role') } : { area: id(owner.area, 'Owner area') },
      support: ids(s.support, 'Support roles'), methods: unique(rows(s.methods, 'Methods', 16).map(m => SLUG.test(m) ? m : fail('Invalid method slug.')), 'Methods'),
      data: ids(s.data, 'Stage data'), needs: ids(s.needs, 'Stage capabilities'), depends_on: ids(s.depends_on, 'Dependencies'),
      outputs, checks, gate: one(s.gate, GATES, 'Stage gate'), optional_when: s.optional_when === undefined ? null : text(s.optional_when, 'Optional condition', 500), order: i,
    };
  });
  if (!stages.length) fail('A playbook needs stages.');
  const stageIds = new Set(unique(stages.map(s => s.id), 'Stage ids'));
  unique(stages.flatMap(s => s.outputs.map(o => o.path.toLowerCase())), 'Output paths');

  const questions = rows(p.questions, 'Questions', 20).map(q => {
    object(q, 'Question'); keys(q, ['id', 'ask', 'why', 'affects', 'required', 'options'], 'Question');
    const options = rows(q.options, 'Options', 12).map(o => { object(o, 'Option'); keys(o, ['value', 'label', 'playbook'], 'Option'); return { value: id(o.value, 'Option value'), label: text(o.label, 'Option label', 200), ...(o.playbook ? { playbook: id(o.playbook, 'Option playbook') } : {}) }; });
    return { id: id(q.id, 'Question id'), ask: text(q.ask, 'Question', 500), why: text(q.why, 'Question reason', 500), affects: known(ids(q.affects, 'Affected stages'), stageIds, 'Question'), required: q.required === true, options };
  });
  unique(questions.map(q => q.id), 'Question ids');
  const capabilities = rows(p.capabilities, 'Capabilities', 20).map(c => {
    object(c, 'Capability'); keys(c, ['id', 'access', 'why', 'examples'], 'Capability');
    return { id: id(c.id, 'Capability id'), access: one(c.access, ACCESS, 'Capability access'), why: text(c.why, 'Capability reason', 500), examples: texts(c.examples, 'Capability examples', 12) };
  });
  const capIds = new Set(unique(capabilities.map(c => c.id), 'Capability ids'));
  const data = rows(p.data, 'Data', 20).map(d => {
    object(d, 'Data'); keys(d, ['id', 'name', 'why', 'fields', 'routes', 'required_for', 'alternative'], 'Data');
    const routes = rows(d.routes, 'Routes', 6).map(r => { object(r, 'Route'); keys(r, ['kind', 'how'], 'Route'); return { kind: one(r.kind, ROUTES, 'Route kind'), how: text(r.how, 'Route steps', 600) }; });
    if (!routes.length) fail(`Data ${d.id} needs at least one way to get it.`);
    return { id: id(d.id, 'Data id'), name: text(d.name, 'Data name', 200), why: text(d.why, 'Data reason', 600), fields: texts(d.fields, 'Fields', 30), routes, required_for: known(ids(d.required_for, 'Required for'), stageIds, 'Data'), alternative: d.alternative === undefined ? null : text(d.alternative, 'Alternative', 600) };
  });
  const dataIds = new Set(unique(data.map(d => d.id), 'Data ids'));
  const hypotheses = rows(p.hypotheses, 'Hypotheses', 30).map(h => {
    object(h, 'Hypothesis'); keys(h, ['id', 'statement', 'test', 'confirm_if', 'refute_if', 'fix_stage'], 'Hypothesis');
    return { id: id(h.id, 'Hypothesis id'), statement: text(h.statement, 'Hypothesis', 400), test: text(h.test, 'Hypothesis test', 800), confirm_if: text(h.confirm_if, 'Confirm rule', 500), refute_if: text(h.refute_if, 'Refute rule', 500), fix_stage: known([id(h.fix_stage, 'Fix stage')], stageIds, 'Hypothesis')[0] };
  });
  unique(hypotheses.map(h => h.id), 'Hypothesis ids');

  const byId = new Map(stages.map(s => [s.id, s]));
  const kindIndex = s => STAGE_KINDS.indexOf(s.kind);
  for (const s of stages) {
    known(s.depends_on, stageIds, `Stage ${s.id}`); known(s.data, dataIds, `Stage ${s.id}`); known(s.needs, capIds, `Stage ${s.id}`);
    if (s.depends_on.includes(s.id)) fail(`Stage ${s.id} depends on itself.`);
    if (s.depends_on.some(d => kindIndex(byId.get(d)) > kindIndex(s))) fail(`Stage ${s.id} cannot depend on a later kind of stage.`);
    if (s.kind === 'decision' && s.gate !== 'approve') fail('A decision stage needs owner approval.');
    if (s.needs.some(c => capabilities.find(x => x.id === c).access === 'live') && s.gate !== 'approve_each_action') fail(`Stage ${s.id} takes live actions, so every action needs owner approval.`);
    if (roleIds) known([s.owner.role, ...s.support].filter(Boolean), roleIds, `Stage ${s.id} specialist`);
    if (methodSlugs) known(s.methods, methodSlugs, `Stage ${s.id} method`);
  }
  const visited = new Set(), active = new Set();
  const visit = sid => { if (active.has(sid)) fail('Stage dependencies contain a cycle.'); if (visited.has(sid)) return; active.add(sid); byId.get(sid).depends_on.forEach(visit); active.delete(sid); visited.add(sid); };
  stages.forEach(s => visit(s.id));
  const intake = stages.filter(s => s.kind === 'intake');
  if (intake.length !== 1 || stages[0] !== intake[0] || intake[0].depends_on.length) fail('A playbook starts with exactly one intake stage.');
  const ancestors = sid => { const out = new Set(), walk = x => byId.get(x).depends_on.forEach(d => { if (!out.has(d)) { out.add(d); walk(d); } }); walk(sid); return out; };
  for (const s of stages.filter(s => s.kind === 'production' || s.kind === 'execution')) {
    if (![...ancestors(s.id)].some(a => byId.get(a).kind === 'decision')) fail(`Stage ${s.id} must come after the owner's decision.`);
  }
  for (const s of stages.filter(s => s.kind !== 'intake')) if (!s.depends_on.length) fail(`Stage ${s.id} needs a dependency.`);

  const deliverable = object(p.deliverable, 'Deliverable'); keys(deliverable, ['name', 'done'], 'Deliverable');
  const measurement = p.measurement === undefined ? null : (() => { const m = object(p.measurement, 'Measurement'); keys(m, ['window', 'min_volume', 'stop_rule'], 'Measurement'); return { window: text(m.window, 'Measurement window', 300), min_volume: text(m.min_volume, 'Minimum volume', 300), stop_rule: text(m.stop_rule, 'Stop rule', 500) }; })();
  return {
    schema: PLAYBOOK_SCHEMA, id: id(p.id, 'Playbook id'), version: p.version, name: text(p.name, 'Playbook name', 160), outcome: text(p.outcome, 'Outcome', 600), fallback, signals, metric,
    questions, data, capabilities, stages, hypotheses, deliverable: { name: text(deliverable.name, 'Deliverable name', 300), done: texts(deliverable.done, 'Definition of done', 20) }, measurement,
  };
}

const cell = s => String(s).replace(/\|/g, '/').replace(/\n/g, ' ');
const label = s => String(s).replace(/["[\]]/g, "'");
export function playbookDiagram(p) {
  return 'flowchart TD\n' + p.stages.map(s => `  ${s.id.replace(/-/g, '_')}["${label(s.name)}"]`).join('\n') + '\n' + p.stages.flatMap(s => s.depends_on.map(d => `  ${d.replace(/-/g, '_')} --> ${s.id.replace(/-/g, '_')}`)).join('\n') + '\n';
}
export function playbookMarkdown(p) {
  const owner = s => s.owner.role ? `\`${s.owner.role}\`` : `${s.owner.area} (route at run time)`;
  return `# ${p.name} (v${p.version})\n\n${p.outcome}\n\n${p.metric ? `**Steered by:** ${p.metric.name} (${p.metric.direction}, ${p.metric.unit}). **Limits:** ${p.metric.guardrails.join('; ') || 'set at intake'}.\n\n` : ''}**Deliverable:** ${p.deliverable.name}\n\n${p.deliverable.done.map(d => `- ${d}`).join('\n')}\n\n## Stages\n\n\`\`\`mermaid\n${playbookDiagram(p)}\`\`\`\n\n| # | Stage | Kind | Owner | Methods | Gate |\n|---|---|---|---|---|---|\n${p.stages.map((s, i) => `| ${i + 1} | ${cell(s.name)} | ${s.kind} | ${owner(s)}${s.support.length ? ` + ${s.support.map(r => `\`${r}\``).join(', ')}` : ''} | ${s.methods.map(m => `\`${m}\``).join(', ') || '-'} | ${s.gate} |`).join('\n')}\n${p.measurement ? `\n## Measurement\n\n- Window: ${p.measurement.window}\n- Minimum volume: ${p.measurement.min_volume}\n- Stop rule: ${p.measurement.stop_rule}\n` : ''}`;
}
export function hypothesesMarkdown(p) {
  return p.hypotheses.length ? `# Hypotheses to test\n\nMark each one SUPPORTED, REFUTED or UNKNOWN in diagnosis/hypotheses.json, with the evidence. Add any new hypothesis the data suggests.\n\n${p.hypotheses.map(h => `## ${h.id}: ${h.statement}\n\n- Test: ${h.test}\n- Supported if: ${h.confirm_if}\n- Refuted if: ${h.refute_if}\n- Fixed in stage: ${h.fix_stage}`).join('\n\n')}\n` : '# Hypotheses to test\n\nThe diagnosis stage writes its own hypotheses for this outcome, each with a test, a rule that supports it and a rule that refutes it.\n';
}
