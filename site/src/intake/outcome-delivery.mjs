// Portable host instructions and checked recommendation-to-execution contracts.
// No model calls, filesystem writes, business actions or approval authority.
export function outcomeDeliveryInstructions() {
  return `Work backwards from the desired business or project outcome, with a primary metric and guardrails. Preserve the reported before-state separately from verified evidence. Success is a checked deliverable and, later, an honestly measured outcome; never promise that a metric will improve.

Keep the experience in the user's connected AI using its model, tokens, tools and authorized local files by default. AI Blocks supplies intelligence and contracts; it does not run these workers. Reuse current context and accepted artifacts. Do not upload client files or create remote memory merely to complete a job. A hosted chat without local filesystem access must use its supported artifact/export mechanism and describe that boundary.

Ask only unresolved questions that affect a decision. Establish the metric, account/project, scope, time window, desired outcome, guardrails and permitted actions. Inspect working read connections before asking the user to connect an existing one. If the onset is unknown, inspect an appropriate available trend and explain the provisional window. Do not demand every possible source before useful independent work.

Check evidence before conclusions: definitions, scope, time zone, freshness, completeness, nulls, pagination, totals, attribution and changes in collection. Record CHECKED, LIMITED or UNRELIABLE with actual checks and limitations. Partial platform data can support bounded platform findings; it cannot silently become verified profit, a matched-user funnel or causation. Help obtain missing inputs: identify the owner, connector or export steps, exact fields, a viable alternative and which decision it unblocks. Keep permitted work moving while a dependent branch waits.

Perform the task's real analysis in the host AI. For performance work, calculate weighted totals and comparable trends; inspect appropriate periods and relevant segments, mix, changes and competing explanations. Use the available history, not an arbitrary fixed window. In acquisition analysis distinguish traffic cost, response, conversion, attributed order value and net economics. ROAS equals attributed AOV divided by CPA when numerator/denominator definitions match. Check both; a lower CPA with worse profitability or lost volume is not success. A high-ROAS demographic with few conversions is a test candidate, not proof of scalable unused demand. Do not infer image/video format or a concept from an ad's name; inspect the creative. Never turn provider lift suggestions into a client-specific forecast.

Deliver ranked selectable recommendations with stable IDs. Each must say what we will change or investigate, why, the evidence and uncertainty, the concrete work and native artifacts, the responsible specialist, prerequisites, tool/access limits, tradeoffs, verification, measurement and feedback. Prefer fewer supported actions to filling a top-ten list with generic advice. Separate repairs supported by findings, hypotheses requiring experiments and evidence-acquisition work.

Ask which recommendation IDs to pursue. The user's selection becomes an exact, dependency-aware execution proposal for OUR next orchestrator, not advice for the user to implement elsewhere. Show required prerequisite work and remaining access/authority, preserve the chosen outcome and guardrails, and read the full selected specialist remits and methods. The orchestrator owns end-to-end completion; specialists own explicit artifacts and checks. A media analyst hands accepted evidence to creative strategy; strategy hands an accepted brief to copy/design/production; a campaign operator receives accepted assets plus destinations, settings and matching action authority. Select only specialists the job actually needs.

Use existing authorization without repetitive permission requests. Selection is not blanket permission to spend, publish or alter unrelated systems. Execute covered work with real tools, inspect actual artifacts and read back external state. When code access is missing, produce the usable patch, Liquid/HTML or other native artifact and its checks; leave integration and business outcome pending. For creative work offer supported generation or a complete prompt/production pack if direct generation is unavailable. A fallback is a named partial deliverable, not a claim that implementation happened. If a tool response is uncertain, reconcile state before retrying.

Separate recommendations, selected plan, artifact production, implementation verification, experimentation and observed outcomes. Register the comparison, metric, guardrails, observation rule, stopping rule and limitations before a test. Outcome can remain inconclusive. Record accepted feedback with provenance and scope in the user's local project; update relevant instructions/examples and regression cases. Do not claim automatic model training, zero error or background monitoring without an actual authorized runtime. Report what was delivered, what changed, checks, specific remaining blockers and the next valid action.`;
}

const fail = message => { throw Error(message); };
const object = (v, label) => v && typeof v === 'object' && !Array.isArray(v) ? v : fail(`${label} must be an object.`);
const text = (v, label, max = 2000) => typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : fail(`Check ${label}.`);
const keys = (v, allowed, label) => { if (Object.keys(v).some(k => !allowed.includes(k))) fail(`${label} has an unsupported field.`); };
const rows = (v, label, max = 30) => Array.isArray(v) && v.length <= max ? v : fail(`Check ${label}.`);
const unique = (v, label) => new Set(v).size === v.length ? v : fail(`${label} must be unique.`);
const strings = (v, label, min = 1) => {
  const result = unique(rows(v, label).map(x => text(x, label)), label);
  if (result.length < min) fail(`${label} needs at least ${min} item(s).`);
  return result;
};
const refs = (v, known, label, min = 1) => {
  const result = strings(v, label, min);
  if (result.some(x => !known.has(x))) fail(`${label} has an unknown reference.`);
  return result;
};
const ids = values => new Set(values.map(x => x.id));
const safeId = v => typeof v === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(v) ? v : fail('Check recommendation id.');

export function validateOutcomeDelivery(input, scope) {
  const p = object(input, 'Delivery');
  keys(p, ['before', 'after', 'metric', 'guardrails', 'evidence_reviews', 'data_requests', 'recommendations'], 'Delivery');
  const sourceIds = ids(scope.sources), workIds = ids(scope.work), findingIds = ids(scope.findings), dataIds = ids(scope.data_needs);
  const evidence_reviews = rows(p.evidence_reviews, 'evidence reviews', 40).map(v => {
    object(v, 'Evidence review'); keys(v, ['source_id', 'status', 'checks', 'limitation'], 'Evidence review');
    if (!sourceIds.has(v.source_id) || !['CHECKED', 'LIMITED', 'UNRELIABLE'].includes(v.status)) fail('Check evidence review source and status.');
    return { source_id: v.source_id, status: v.status, checks: strings(v.checks, 'evidence checks'), limitation: text(v.limitation, 'evidence limitation') };
  });
  unique(evidence_reviews.map(v => v.source_id), 'Evidence review sources');
  const data_requests = rows(p.data_requests, 'data requests', 40).map(v => {
    object(v, 'Data request'); keys(v, ['data_id', 'owner', 'route', 'steps', 'fields', 'alternative'], 'Data request');
    if (!dataIds.has(v.data_id) || !['MCP', 'CSV', 'FILE'].includes(v.route)) fail('Check data request and acquisition route.');
    return { data_id: v.data_id, owner: text(v.owner, 'data owner', 300), route: v.route, steps: strings(v.steps, 'acquisition steps'), fields: strings(v.fields, 'required fields'), alternative: text(v.alternative, 'data alternative') };
  });
  unique(data_requests.map(v => v.data_id), 'Data requests');
  const recommendations = rows(p.recommendations, 'recommendations').map(v => {
    object(v, 'Recommendation'); keys(v, ['id', 'title', 'rank', 'finding_ids', 'work_ids', 'reason', 'expected_effect', 'tradeoffs', 'measurement', 'fallback'], 'Recommendation');
    if (!Number.isSafeInteger(v.rank) || v.rank < 1 || v.rank > 30) fail('Check recommendation rank.');
    const measurement = object(v.measurement, 'Measurement');
    keys(measurement, ['metric', 'comparison', 'window', 'decision_rule', 'guardrails', 'limitations'], 'Measurement');
    const fallback = object(v.fallback, 'Fallback'); keys(fallback, ['when', 'deliverable', 'next_step'], 'Fallback');
    return {
      id: safeId(v.id), title: text(v.title, 'recommendation title', 300), rank: v.rank,
      finding_ids: refs(v.finding_ids, findingIds, 'Recommendation findings', scope.route === 'direct' ? 0 : 1), work_ids: refs(v.work_ids, workIds, 'Recommendation work'),
      reason: text(v.reason, 'recommendation reason'), expected_effect: text(v.expected_effect, 'expected effect'), tradeoffs: text(v.tradeoffs, 'tradeoffs'),
      measurement: { metric: text(measurement.metric, 'measurement metric'), comparison: text(measurement.comparison, 'comparison'), window: text(measurement.window, 'observation window'), decision_rule: text(measurement.decision_rule, 'decision rule'), guardrails: strings(measurement.guardrails, 'measurement guardrails'), limitations: text(measurement.limitations, 'measurement limitations') },
      fallback: { when: text(fallback.when, 'fallback condition'), deliverable: text(fallback.deliverable, 'fallback deliverable'), next_step: text(fallback.next_step, 'fallback next step') }
    };
  }).sort((a, b) => a.rank - b.rank);
  if (!recommendations.length) fail('Delivery needs selectable recommendations.');
  unique(recommendations.map(v => v.id), 'Recommendation ids'); unique(recommendations.map(v => v.rank), 'Recommendation ranks');
  for (const rec of recommendations) {
    const required = dependencyClosure(scope.work, rec.work_ids);
    for (const w of scope.work.filter(w => required.includes(w.id))) {
      for (const d of scope.data_needs.filter(d => w.data_ids.includes(d.id) || d.required_for.includes(w.id) || scope.route === 'diagnostic' && d.required_for.includes('diagnosis'))) {
        if (!['SUPPLIED', 'NOT_NEEDED'].includes(d.status) && !data_requests.some(r => r.data_id === d.id)) fail('A missing recommendation input needs a concrete acquisition request.');
      }
    }
  }
  return { before: text(p.before, 'before state', 3000), after: text(p.after, 'desired after state', 3000), metric: text(p.metric, 'primary metric', 2000), guardrails: strings(p.guardrails, 'outcome guardrails'), evidence_reviews, data_requests, recommendations };
}

function dependencyClosure(work, selected) {
  const index = new Map(work.map(w => [w.id, w])), included = new Set();
  const visit = id => { if (included.has(id)) return; const w = index.get(id); if (!w) fail('Unknown selected work.'); included.add(id); for (const dep of w.depends_on) visit(dep); };
  for (const id of selected) visit(id);
  return work.filter(w => included.has(w.id)).map(w => w.id);
}

export function applyDeliveryReadiness(scope, work) {
  if (!scope.delivery) return;
  const reviews = new Map(scope.delivery.evidence_reviews.map(r => [r.source_id, r]));
  for (const w of work) {
    for (const source of w.brief.sources.filter(s => s.status === 'SUPPLIED')) {
      const review = reviews.get(source.id);
      if (w.mode === 'FIX' && (!review || review.status === 'UNRELIABLE')) {
        w.blockers.push(`Evidence review required for this work: ${source.id}.`);
        w.state = 'NEEDS_INPUT';
      }
    }
    // Ordering is already topological. A new evidence blocker propagates only to consumers.
    for (const dep of w.depends_on) if (work.find(x => x.id === dep).state !== 'READY_FOR_PLAN_REVIEW') {
      w.state = 'NEEDS_INPUT';
      const message = `Resolve blocked producer: ${dep}.`;
      if (!w.blockers.includes(message)) w.blockers.push(message);
    }
  }
}

export function selectRecommendations(prepared, selectedIds) {
  if (!prepared.scope.delivery) fail('Add the outcome delivery contract before selecting recommendations.');
  const selected = unique(strings(selectedIds, 'selected recommendation ids'), 'Selected recommendations');
  const recommendations = prepared.scope.delivery.recommendations.filter(r => selected.includes(r.id));
  if (recommendations.length !== selected.length) fail('Unknown selected recommendation.');
  const direct = [...new Set(recommendations.flatMap(r => r.work_ids))];
  const work_ids = dependencyClosure(prepared.work, direct);
  return { selected_recommendation_ids: recommendations.map(r => r.id), work_ids, prerequisite_work_ids: work_ids.filter(id => !direct.includes(id)), deferred_recommendation_ids: prepared.scope.delivery.recommendations.filter(r => !selected.includes(r.id)).map(r => r.id) };
}

export function outcomeDeliveryFiles(scope, work) {
  if (!scope.delivery) return {};
  const d = scope.delivery;
  const choices = d.recommendations.map(r => ({ ...r, work: work.filter(w => dependencyClosure(work, r.work_ids).includes(w.id)).map(w => ({ id: w.id, mode: w.mode, task: w.task, depends_on: w.depends_on, deliverables: w.deliverables, checks: w.checks, blockers: w.blockers, execution_blockers: w.execution_blockers })) }));
  return {
    'delivery/OUTCOME.md': `# Outcome contract\n\nBefore: ${d.before}\n\nDesired after: ${d.after}\n\nMetric: ${d.metric}\n\nGuardrails:\n${d.guardrails.map(x => '- ' + x).join('\n')}\n\nThese are intended outcomes, not measured improvements.\n`,
    'delivery/recommendations.json': JSON.stringify(choices, null, 2) + '\n',
    'delivery/RECOMMENDATIONS.md': '# Select work for our next orchestrator\n\n' + choices.map(r => `## ${r.id}: ${r.title}\n\nRank: ${r.rank}\nWhy: ${r.reason}\nIntended effect: ${r.expected_effect}\nTradeoffs: ${r.tradeoffs}\nWork: ${r.work.map(w => w.id).join(', ')}\n\n${r.work.map(w => `- ${w.id}: ${w.task}\n  Outputs: ${w.deliverables.map(d => d.name + ' (' + d.format + ')').join('; ')}\n  Checks: ${w.checks.join('; ')}\n  Blockers: ${[...w.blockers, ...w.execution_blockers].join('; ') || 'none declared'}`).join('\n')}\n\nMeasurement: ${r.measurement.metric}; ${r.measurement.comparison}; ${r.measurement.window}. ${r.measurement.decision_rule}\nGuardrails: ${r.measurement.guardrails.join('; ')}\nLimits: ${r.measurement.limitations}\nFallback when ${r.fallback.when}: ${r.fallback.deliverable}. Next: ${r.fallback.next_step}\n`).join('\n') + '\nChoose recommendation IDs. Selection prepares a proposed execution handoff; it does not authorize unspecified external changes.\n',
    'delivery/DATA-REQUESTS.md': '# Obtain missing inputs\n\n' + d.data_requests.map(r => `## ${r.data_id}\nOwner: ${r.owner}\nRoute: ${r.route}\n${r.steps.map((x, i) => `${i + 1}. ${x}`).join('\n')}\nFields: ${r.fields.join('; ')}\nAlternative: ${r.alternative}\n`).join('\n'),
    'delivery/PLAYBOOK.md': outcomeDeliveryInstructions() + '\n'
  };
}
