// Composed outcome plans. For each engagement the host AI writes a brief, researches how experts do the job and
// composes a plan from our catalogue. This module checks all three against the rules every plan must keep.
// Validation only: no model, storage or execution. Normalized output validates again unchanged.
export const STAGE_KINDS = ['intake', 'context', 'evidence', 'integrity', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'];
// Kinds every plan may add without tracing them to research: they are our method, not the industry's.
export const STANDARD_KINDS = ['intake', 'options', 'decision', 'measurement', 'learning'];
export const GATES = ['none', 'review', 'approve', 'approve_each_action'];
export const SOURCE_KINDS = ['web', 'catalogue', 'memory', 'owner'];
const ACCESS = ['read', 'draft', 'live'];
const VIA = ['mcp', 'api_key', 'file', 'browser', 'owner'];
const ROUTES = ['MCP', 'CSV', 'FILE', 'URL', 'ASK'];
const DIRECTIONS = ['decrease', 'increase', 'reach'];
const ID = /^[a-z0-9][a-z0-9-]{0,79}$/;
const SLUG = /^[a-z0-9][a-z0-9-]{0,119}$/;
const MONTH = /^\d{4}-\d{2}(-\d{2})?$/;

export const fail = message => { throw Error(message); };
const absent = v => v === undefined || v === null;
const object = (v, label) => v && typeof v === 'object' && !Array.isArray(v) ? v : fail(`${label} must be an object.`);
const keys = (v, allowed, label) => { const extra = Object.keys(v).find(k => !allowed.includes(k)); if (extra) fail(`${label} has an unsupported field: ${extra}.`); };
export const text = (v, label, max = 2000) => typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : fail(`${label} must be nonempty text of at most ${max} characters.`);
const maybe = (v, label, max) => absent(v) ? null : text(v, label, max);
const rows = (v, label, max = 40) => absent(v) ? [] : Array.isArray(v) && v.length <= max ? v : fail(`${label} must be a list of at most ${max}.`);
const unique = (v, label) => new Set(v).size === v.length ? v : fail(`${label} must be unique.`);
const id = (v, label) => ID.test(v ?? '') ? v : fail(`${label} must be a lowercase id.`);
const ids = (v, label, max) => unique(rows(v, label, max).map(x => id(x, label)), label);
const slugs = (v, label, max) => unique(rows(v, label, max).map(x => SLUG.test(x ?? '') ? x : fail(`${label} must be catalogue ids.`)), label);
const texts = (v, label, max = 30, len = 2000) => unique(rows(v, label, max).map(x => text(x, label, len)), label);
const one = (v, allowed, label) => allowed.includes(v) ? v : fail(`${label} must be one of ${allowed.join(', ')}.`);
const known = (refs, set, label) => { const bad = refs.find(r => !set.has(r)); if (bad) fail(`${label} refers to unknown ${bad}.`); return refs; };
const num = (v, label) => typeof v === 'number' && Number.isFinite(v) ? v : fail(`${label} must be a number.`);
function safePath(v, label) {
  const p = text(v, label, 200);
  if (p.includes('\\') || p.startsWith('/') || /^[a-z]+:/i.test(p) || p.split('/').some(s => !s || s === '.' || s === '..' || /[<>:"|?*\u0000-\u001f]/.test(s))) fail(`${label} must be a safe relative path.`);
  return p;
}

/** The "beautiful prompt": what the owner wants, measured, with limits, data and connections. Unknowns are named, not guessed. */
export function validateBrief(input) {
  const b = object(input, 'Brief');
  keys(b, ['outcome', 'deliverable', 'done', 'metric', 'deadline', 'guardrails', 'limits', 'assets', 'connections', 'data_home', 'technical_level', 'decides', 'unknowns', 'answers'], 'Brief');
  const metric = absent(b.metric) ? null : (() => {
    const m = object(b.metric, 'Metric'); keys(m, ['name', 'direction', 'unit', 'baseline', 'baseline_source', 'target'], 'Metric');
    const baseline = absent(m.baseline) ? null : num(m.baseline, 'Baseline');
    const source = one(m.baseline_source, ['reported', 'verified', 'unknown'], 'Baseline source');
    if ((baseline === null) !== (source === 'unknown')) fail('A missing baseline has source "unknown"; a stated baseline is "reported" or "verified".');
    return { name: text(m.name, 'Metric name', 200), direction: one(m.direction, DIRECTIONS, 'Metric direction'), unit: text(m.unit, 'Metric unit', 60), baseline, baseline_source: source, target: absent(m.target) ? null : num(m.target, 'Target') };
  })();
  const done = texts(b.done, 'Definition of done', 20, 500);
  if (!done.length) fail('Say what finished looks like in done.');
  const connections = rows(b.connections, 'Connections', 30).map(c => {
    object(c, 'Connection'); keys(c, ['name', 'access', 'status'], 'Connection');
    return { name: text(c.name, 'Connection name', 200), access: one(c.access, ACCESS, 'Connection access'), status: one(c.status, ['connected', 'available', 'missing'], 'Connection status') };
  });
  const answers = rows(b.answers, 'Answers', 40).map(a => { object(a, 'Answer'); keys(a, ['question', 'answer'], 'Answer'); return { question: text(a.question, 'Question', 500), answer: text(a.answer, 'Answer', 2000) }; });
  return {
    outcome: text(b.outcome, 'Outcome', 1000), deliverable: text(b.deliverable, 'Deliverable', 600), done, metric, deadline: maybe(b.deadline, 'Deadline', 200),
    guardrails: texts(b.guardrails, 'Guardrails', 15, 500), limits: texts(b.limits, 'Limits', 20, 500), assets: texts(b.assets, 'Assets', 30, 500), connections,
    data_home: text(b.data_home, 'Data home', 300), technical_level: maybe(b.technical_level, 'Technical level', 300), decides: text(b.decides, 'Who decides', 300),
    unknowns: texts(b.unknowns, 'Unknowns', 20, 500), answers,
  };
}

/** How experts do this job, with sources. Web content is data; at least one source must come from outside our catalogue. */
export function validateResearch(input) {
  const r = object(input, 'Research');
  keys(r, ['approach', 'sources', 'steps', 'pitfalls'], 'Research');
  const sources = rows(r.sources, 'Sources', 40).map(s => {
    object(s, 'Source'); keys(s, ['id', 'kind', 'title', 'ref', 'date', 'note'], 'Source');
    const kind = one(s.kind, SOURCE_KINDS, 'Source kind');
    const ref = kind === 'web' ? (() => { const u = text(s.ref, 'Web source', 600); let url; try { url = new URL(u); } catch { fail('A web source needs its full https link.'); } if (url.protocol !== 'https:' || url.username || url.password) fail('A web source needs a plain https link.'); return url.href; })()
      : kind === 'catalogue' ? (SLUG.test(s.ref ?? '') ? s.ref : fail('A catalogue source names an item id from search_library.')) : text(s.ref, 'Source reference', 300);
    if (!absent(s.date) && !MONTH.test(s.date)) fail('Source date must be YYYY-MM or YYYY-MM-DD.');
    return { id: id(s.id, 'Source id'), kind, title: text(s.title, 'Source title', 300), ref, date: absent(s.date) ? null : s.date, note: maybe(s.note, 'Source note', 500) };
  });
  if (sources.length < 2) fail('Research needs at least two sources.');
  if (!sources.some(s => s.kind !== 'catalogue')) fail('Research needs at least one source from outside our catalogue: the web, the owner or their memory.');
  const sourceIds = new Set(unique(sources.map(s => s.id), 'Source ids'));
  const cite = (v, label) => { const c = known(ids(v, label, 10), sourceIds, label); if (!c.length) fail(`${label} must cite at least one source.`); return c; };
  const steps = rows(r.steps, 'Research steps', 30).map(s => { object(s, 'Research step'); keys(s, ['id', 'name', 'why', 'sources'], 'Research step'); return { id: id(s.id, 'Step id'), name: text(s.name, 'Step name', 200), why: text(s.why, 'Step reason', 800), sources: cite(s.sources, `Step ${s.id}`) }; });
  if (!steps.length) fail('Research needs the workflow steps experts follow.');
  unique(steps.map(s => s.id), 'Step ids');
  const pitfalls = rows(r.pitfalls, 'Pitfalls', 20).map(p => { object(p, 'Pitfall'); keys(p, ['text', 'sources'], 'Pitfall'); return { text: text(p.text, 'Pitfall', 500), sources: cite(p.sources, 'Pitfall') }; });
  return { approach: text(r.approach, 'Approach', 3000), sources, steps, pitfalls };
}

/** Check a composed plan's structure, its trace to the research and the safety rules. Catalogue ids are checked separately (checkCatalogue). */
export function validatePlan(input, { research, brief } = {}) {
  const p = object(input, 'Plan');
  keys(p, ['name', 'capabilities', 'data', 'stages', 'hypotheses', 'dropped', 'measurement'], 'Plan');
  research ?? fail('Validate the research before the plan.');
  const stepIds = new Set(research.steps.map(s => s.id));
  const capabilities = rows(p.capabilities, 'Capabilities', 25).map(c => {
    object(c, 'Capability'); keys(c, ['id', 'access', 'via', 'name', 'why'], 'Capability');
    return { id: id(c.id, 'Capability id'), access: one(c.access, ACCESS, 'Capability access'), via: one(c.via, VIA, 'Capability via'), name: text(c.name, 'Capability name', 200), why: text(c.why, 'Capability reason', 500) };
  });
  const capIds = new Set(unique(capabilities.map(c => c.id), 'Capability ids'));

  const stages = rows(p.stages, 'Stages', 30).map(s => {
    object(s, 'Stage'); keys(s, ['id', 'kind', 'name', 'goal', 'from_steps', 'owner', 'support', 'reviewers', 'uses', 'data', 'needs', 'depends_on', 'outputs', 'checks', 'gate', 'optional_when'], 'Stage');
    const owner = object(s.owner, 'Stage owner'); keys(owner, ['role', 'gap'], 'Stage owner');
    if (absent(owner.role) === absent(owner.gap)) fail('A stage owner names one catalogue specialist (role) or describes the missing one (gap).');
    const outputs = rows(s.outputs, 'Stage outputs', 12).map(o => { object(o, 'Output'); keys(o, ['id', 'name', 'format', 'path'], 'Output'); return { id: id(o.id, 'Output id'), name: text(o.name, 'Output name', 250), format: text(o.format, 'Output format', 40), path: safePath(o.path, 'Output path') }; });
    const checks = rows(s.checks, 'Stage checks', 12).map(c => { object(c, 'Check'); keys(c, ['id', 'name', 'required'], 'Check'); return { id: id(c.id, 'Check id'), name: text(c.name, 'Check name', 500), required: c.required !== false }; });
    unique(outputs.map(o => o.id), 'Output ids'); unique(checks.map(c => c.id), 'Check ids');
    const kind = one(s.kind, STAGE_KINDS, 'Stage kind');
    if (kind !== 'intake' && (!outputs.length || !checks.length)) fail(`Stage ${s.id} needs at least one output and one check.`);
    const from = known(ids(s.from_steps, 'From steps', 10), stepIds, `Stage ${s.id}`);
    if (!STANDARD_KINDS.includes(kind) && !from.length) fail(`Stage ${s.id} must name the research steps it carries out.`);
    return {
      id: id(s.id, 'Stage id'), kind, name: text(s.name, 'Stage name', 120), goal: text(s.goal, 'Stage goal', 1500), from_steps: from,
      owner: absent(owner.role) ? { gap: text(owner.gap, 'Catalogue gap', 500) } : { role: id(owner.role, 'Owner role') },
      support: ids(s.support, 'Support roles', 8), reviewers: ids(s.reviewers, 'Reviewer roles', 6), uses: slugs(s.uses, 'Uses', 20),
      data: ids(s.data, 'Stage data'), needs: ids(s.needs, 'Stage capabilities'), depends_on: ids(s.depends_on, 'Dependencies'),
      outputs, checks, gate: one(s.gate, GATES, 'Stage gate'), optional_when: maybe(s.optional_when, 'Optional condition', 500),
    };
  });
  if (!stages.length) fail('A plan needs stages.');
  const stageIds = new Set(unique(stages.map(s => s.id), 'Stage ids'));
  unique(stages.flatMap(s => s.outputs.map(o => o.path.toLowerCase())), 'Output paths');

  const data = rows(p.data, 'Data', 20).map(d => {
    object(d, 'Data'); keys(d, ['id', 'name', 'why', 'fields', 'routes', 'required_for', 'alternative'], 'Data');
    const routes = rows(d.routes, 'Routes', 6).map(r => { object(r, 'Route'); keys(r, ['kind', 'how'], 'Route'); return { kind: one(r.kind, ROUTES, 'Route kind'), how: text(r.how, 'Route steps', 600) }; });
    if (!routes.length) fail(`Data ${d.id} needs at least one way to get it.`);
    return { id: id(d.id, 'Data id'), name: text(d.name, 'Data name', 200), why: text(d.why, 'Data reason', 600), fields: texts(d.fields, 'Fields', 30, 200), routes, required_for: known(ids(d.required_for, 'Required for'), stageIds, 'Data'), alternative: maybe(d.alternative, 'Alternative', 600) };
  });
  const dataIds = new Set(unique(data.map(d => d.id), 'Data ids'));
  const hypotheses = rows(p.hypotheses, 'Hypotheses', 30).map(h => {
    object(h, 'Hypothesis'); keys(h, ['id', 'statement', 'test', 'confirm_if', 'refute_if', 'fix_stage'], 'Hypothesis');
    return { id: id(h.id, 'Hypothesis id'), statement: text(h.statement, 'Hypothesis', 400), test: text(h.test, 'Hypothesis test', 800), confirm_if: text(h.confirm_if, 'Confirm rule', 500), refute_if: text(h.refute_if, 'Refute rule', 500), fix_stage: known([id(h.fix_stage, 'Fix stage')], stageIds, 'Hypothesis')[0] };
  });
  unique(hypotheses.map(h => h.id), 'Hypothesis ids');
  const dropped = rows(p.dropped, 'Dropped steps', 30).map(d => { object(d, 'Dropped step'); keys(d, ['step', 'reason'], 'Dropped step'); return { step: known([id(d.step, 'Dropped step')], stepIds, 'Dropped step')[0], reason: text(d.reason, 'Reason for dropping', 500) }; });
  const covered = new Set([...stages.flatMap(s => s.from_steps), ...dropped.map(d => d.step)]);
  const uncovered = research.steps.filter(s => !covered.has(s.id));
  if (uncovered.length) fail(`Every research step is carried out by a stage or dropped with a reason. Not covered: ${uncovered.map(s => s.id).join(', ')}.`);

  const byId = new Map(stages.map(s => [s.id, s]));
  const kindIndex = s => STAGE_KINDS.indexOf(s.kind);
  for (const s of stages) {
    known(s.depends_on, stageIds, `Stage ${s.id}`); known(s.data, dataIds, `Stage ${s.id}`); known(s.needs, capIds, `Stage ${s.id}`);
    if (s.depends_on.includes(s.id)) fail(`Stage ${s.id} depends on itself.`);
    if (s.depends_on.some(d => kindIndex(byId.get(d)) > kindIndex(s))) fail(`Stage ${s.id} cannot depend on a later kind of stage.`);
    if (s.kind === 'decision' && s.gate !== 'approve') fail('A decision stage needs owner approval.');
    if (s.needs.some(c => capabilities.find(x => x.id === c).access === 'live') && s.gate !== 'approve_each_action') fail(`Stage ${s.id} takes live actions, so every action needs owner approval.`);
  }
  const visited = new Set(), active = new Set();
  const visit = sid => { if (active.has(sid)) fail('Stage dependencies contain a cycle.'); if (visited.has(sid)) return; active.add(sid); byId.get(sid).depends_on.forEach(visit); active.delete(sid); visited.add(sid); };
  stages.forEach(s => visit(s.id));
  const intake = stages.filter(s => s.kind === 'intake');
  if (intake.length !== 1 || stages[0] !== intake[0] || intake[0].depends_on.length) fail('A plan starts with exactly one intake stage.');
  if (stages.at(-1).kind !== 'learning') fail('A plan ends with a learning stage.');
  const ancestors = sid => { const out = new Set(), walk = x => byId.get(x).depends_on.forEach(d => { if (!out.has(d)) { out.add(d); walk(d); } }); walk(sid); return out; };
  for (const s of stages.filter(s => s.kind === 'production' || s.kind === 'execution')) {
    if (![...ancestors(s.id)].some(a => byId.get(a).kind === 'decision')) fail(`Stage ${s.id} must come after the owner's decision.`);
  }
  for (const s of stages.filter(s => s.kind !== 'intake')) if (!s.depends_on.length) fail(`Stage ${s.id} needs a dependency.`);
  if (brief?.metric && stages.some(s => s.kind === 'execution') && !stages.some(s => s.kind === 'measurement')) fail('A plan that launches changes against a metric needs a measurement stage.');

  const measurement = absent(p.measurement) ? null : (() => { const m = object(p.measurement, 'Measurement'); keys(m, ['window', 'min_volume', 'stop_rule'], 'Measurement'); return { window: text(m.window, 'Measurement window', 300), min_volume: text(m.min_volume, 'Minimum volume', 300), stop_rule: text(m.stop_rule, 'Stop rule', 500) }; })();
  return { name: text(p.name, 'Plan name', 160), capabilities, data, stages, hypotheses, dropped, measurement };
}

/** Every catalogue id the plan and research name, for checking against the live catalogue. */
export function planRefs(plan, research) {
  const roles = new Set(plan.stages.flatMap(s => [s.owner.role, ...s.support, ...s.reviewers]).filter(Boolean));
  const items = new Set([...plan.stages.flatMap(s => s.uses), ...research.sources.filter(s => s.kind === 'catalogue').map(s => s.ref)]);
  return { roles: [...roles].sort(), items: [...items].sort() };
}
export function checkCatalogue({ missing_roles = [], missing_items = [] }) {
  if (missing_roles.length) fail(`These specialists are not in the catalogue: ${missing_roles.join(', ')}. Use find_specialist, or record the stage owner as a gap.`);
  if (missing_items.length) fail(`These items are not in the catalogue: ${missing_items.join(', ')}. Use ids from search_library.`);
}

const monthsBetween = (a, b) => (Number(b.slice(0, 4)) - Number(a.slice(0, 4))) * 12 + Number(b.slice(5, 7)) - Number(a.slice(5, 7));
/** Quality warnings the owner sees with the plan. They don't block it. */
export function planWarnings(brief, research, plan, today) {
  const w = [];
  if (brief.metric && !plan.stages.some(s => s.kind === 'measurement')) w.push('There is a metric but no measurement stage, so the result will not be read back.');
  if (plan.stages.some(s => s.kind === 'diagnosis') && plan.hypotheses.length < 3) w.push('The diagnosis tests fewer than three hypotheses; competing explanations may be missed.');
  const web = research.sources.filter(s => s.kind === 'web');
  const undated = web.filter(s => !s.date), old = web.filter(s => s.date && today && monthsBetween(s.date, today) > 18);
  if (undated.length) w.push(`Web sources without a date: ${undated.map(s => s.id).join(', ')}. Their advice may be out of date.`);
  if (old.length) w.push(`Web sources older than 18 months: ${old.map(s => s.id).join(', ')}. Keep one only if it is still the current version, such as a regulator's rules.`);
  const stops = plan.stages.filter(s => s.gate !== 'none');
  if (stops.length > 6) w.push(`The plan stops for the owner ${stops.length} times. Keep stops where their judgement changes the result: decisions, live actions and work they must see before it is used.`);
  const options = plan.stages.filter(s => s.kind === 'options' && s.gate !== 'none');
  if (options.length) w.push(`The owner sees the options at the decision, so ${options.map(s => s.id).join(', ')} need no gate of their own.`);
  const bare = plan.stages.filter(s => !STANDARD_KINDS.includes(s.kind) && !s.uses.length);
  if (bare.length) w.push(`Stages with no catalogue items, relying on the specialist alone: ${bare.map(s => s.id).join(', ')}.`);
  const gaps = plan.stages.filter(s => s.owner.gap);
  if (gaps.length) w.push(`No catalogue specialist fits ${gaps.map(s => s.id).join(', ')}; the host works as that expert and the gap is reported.`);
  const loose = plan.stages.filter(s => s.kind !== 'intake' && !s.checks.some(c => c.required));
  if (loose.length) w.push(`Stages with no required check: ${loose.map(s => s.id).join(', ')}.`);
  return w;
}

const cell = s => String(s).replace(/\|/g, '/').replace(/\n/g, ' ');
const label = s => String(s).replace(/["[\]]/g, "'");
export function planDiagram(p) {
  return 'flowchart TD\n' + p.stages.map(s => `  ${s.id.replace(/-/g, '_')}["${label(s.name)}"]`).join('\n') + '\n' + p.stages.flatMap(s => s.depends_on.map(d => `  ${d.replace(/-/g, '_')} --> ${s.id.replace(/-/g, '_')}`)).join('\n') + '\n';
}
const ownerName = s => s.owner.role ? `\`${s.owner.role}\`` : `gap: ${s.owner.gap}`;
export function planMarkdown(brief, research, p, { version = 1, warnings = [] } = {}) {
  const live = p.capabilities.filter(c => c.access === 'live');
  return `# Plan v${version}: ${p.name}\n\n**Outcome:** ${brief.outcome}\n\n**Deliverable:** ${brief.deliverable}\n\n${brief.done.map(d => `- ${d}`).join('\n')}\n\n` +
    `**You decide at:** ${p.stages.filter(s => ['approve', 'approve_each_action'].includes(s.gate)).map(s => s.name).join('; ') || 'nowhere'}.` +
    `${live.length ? ` **Live actions** (each one needs your yes): ${live.map(c => c.name).join('; ')}.` : ' **No live actions.**'}\n\n` +
    `Built from: ${research.approach.split('. ')[0]}.\n\n## Stages\n\n\`\`\`mermaid\n${planDiagram(p)}\`\`\`\n\n| # | Stage | Kind | Owner | Uses | Gate |\n|---|---|---|---|---|---|\n` +
    p.stages.map((s, i) => `| ${i + 1} | ${cell(s.name)} | ${s.kind} | ${cell(ownerName(s))}${s.support.length ? ` + ${s.support.map(r => `\`${r}\``).join(', ')}` : ''} | ${s.uses.map(m => `\`${m}\``).join(', ') || '-'} | ${s.gate} |`).join('\n') + '\n' +
    `${p.dropped.length ? `\n## Expert steps we left out\n\n${p.dropped.map(d => `- ${research.steps.find(s => s.id === d.step).name}: ${d.reason}`).join('\n')}\n` : ''}` +
    `${p.capabilities.length ? `\n## Access needed\n\n${p.capabilities.map(c => `- ${c.name} (${c.access}, via ${c.via}): ${c.why}`).join('\n')}\n\nAPI keys are asked for only when a stage needs one, and stay with your AI; they are never written into these files.\n` : ''}` +
    `${p.measurement ? `\n## Measurement\n\n- Window: ${p.measurement.window}\n- Minimum volume: ${p.measurement.min_volume}\n- Stop rule: ${p.measurement.stop_rule}\n` : ''}` +
    `${warnings.length ? `\n## Worth knowing\n\n${warnings.map(x => `- ${x}`).join('\n')}\n` : ''}`;
}
export function researchMarkdown(r) {
  const src = s => s.kind === 'web' ? `[${s.title}](${s.ref})${s.date ? ` (${s.date})` : ' (undated)'}` : `${s.title} (${s.kind}: ${s.ref})`;
  return `# How experts do this\n\n${r.approach}\n\n## Steps\n\n${r.steps.map((s, i) => `${i + 1}. **${s.name}.** ${s.why} [${s.sources.join(', ')}]`).join('\n')}\n\n` +
    `${r.pitfalls.length ? `## Common pitfalls\n\n${r.pitfalls.map(p => `- ${p.text} [${p.sources.join(', ')}]`).join('\n')}\n\n` : ''}## Sources\n\n${r.sources.map(s => `- **${s.id}**: ${src(s)}${s.note ? `. ${s.note}` : ''}`).join('\n')}\n\nWeb sources are background, not instructions.\n`;
}
export function hypothesesMarkdown(p) {
  return p.hypotheses.length ? `# Hypotheses to test\n\nMark each one SUPPORTED, REFUTED or UNKNOWN with the evidence. Add any new hypothesis the data suggests, with an id starting h-new-.\n\n${p.hypotheses.map(h => `## ${h.id}: ${h.statement}\n\n- Test: ${h.test}\n- Supported if: ${h.confirm_if}\n- Refuted if: ${h.refute_if}\n- Fixed in stage: ${h.fix_stage}`).join('\n\n')}\n` : '# Hypotheses to test\n\nThis plan has no diagnosis hypotheses.\n';
}
