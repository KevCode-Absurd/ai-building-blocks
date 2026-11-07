import { validateJobDocument } from './contracts.mjs';
import { proposeTeam } from './propose-team.mjs';
import { routeJob } from './router.mjs';
import { resolveDials, localPreferences, updatePreferences } from './dials.mjs';
import { dialQuestions } from './dial-questions.mjs';
import { jobMethod, deliveryTemplates } from './method.mjs';
import { assembleRubric, scoreReview } from './rubric.mjs';
import { refuseSecrets } from '../outcomes/engagement.mjs';

export const JOB_STATE_SCHEMA = 'ai-blocks-job-state/1';
export const JOB_EVENTS = ['scope', 'staff', 'diverge', 'council', 'produce', 'review', 'revise', 'deliver', 'feedback', 'set_preferences', 'block', 'reopen'];
export const TIER_SETTINGS = Object.freeze({ quick: { seats: [3, 4], council_rounds: 0, loops: 0, token_multiple: [1.5, 2] }, standard: { seats: [5, 7], council_rounds: 1, loops: 1, token_multiple: [2.5, 4] }, deep: { seats: [8, 12], council_rounds: 2, loops: 2, token_multiple: [5, 8] } });
const encoder = new TextEncoder(), HASH = /^[a-f0-9]{64}$/;
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
export const canonicalJobJSON = value => Array.isArray(value) ? `[${value.map(canonicalJobJSON).join(',')}]` : object(value) ? `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonicalJobJSON(value[k])}`).join(',')}}` : JSON.stringify(value);
export async function jobStateDigest(state) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(canonicalJobJSON(state))))].map(v => v.toString(16).padStart(2, '0')).join(''); }
export class JobValidationError extends Error { constructor(issues) { super(issues.map(i => `${i.path}: ${i.message}`).join('\n')); this.name = 'JobValidationError'; this.issues = issues; } }
const fail = (path, message) => { throw new JobValidationError([{ path, message }]); };
const check = (schema, document, context) => { const result = validateJobDocument(schema, document, context); if (!result.ok) throw new JobValidationError(result.errors); return result; };
const types = seat => new Set([seat.seat_type, ...(seat.seat_types ?? [])]);
const pathSafe = path => typeof path === 'string' && path.length <= 240 && !/^(?:[a-z]:|[\\/])|[\\\0?#%]|(?:^|\/)\.{1,2}(?:\/|$)/i.test(path);
const bounded = value => { let raw; try { raw = JSON.stringify(value); } catch { fail('state', 'Send JSON data without cycles.'); } if (encoder.encode(raw).length > 240000) fail('state', 'Keep state below 240 KB; reference source files and keep artifacts local.'); refuseSecrets(value); };
const stageSchema = { scope: 'ai-blocks-job-card/1', staff: 'ai-blocks-team-plan/2', council: 'ai-blocks-council/1', review: 'ai-blocks-review/1', deliver: 'ai-blocks-job-delivery/1' };

function contextFor(view, base, catalogue) {
  return { ...catalogue, job: base.job_type.job, tier: base.tier, card: view.card, job_card: view.card, team: view.team, team_plan: view.team, routes: view.routes, spread: view.spread, rubric: view.rubric, review: view.review, evidence: view.evidence ?? { claims: view.card?.facts ?? [] }, approach_index: catalogue.approaches, catalogue: catalogue.items, explicit_dials: base.explicit_dials, host_capabilities: base.host_capabilities, proposal_contents: view.proposal_contents, deliverables: Object.fromEntries((view.production?.artifacts ?? []).map(a => [a.slot_id, a.producer_note])), production: view.production };
}

function asTeamPlan(proposal, card) {
  return { schema: 'ai-blocks-team-plan/2', goal: card.job_to_be_done, route_options: [{ id: 'team', name: 'Flexible team', reason: 'A task lead coordinates distinct experts against the job rubric.' }], selected_route: 'team', context: (card.context_sources ?? []).map(c => ({id:c.id,path:c.ref,status:'UNKNOWN',revision_sha256:null})), permissions: [], stages: [], constraints: (card.constraints ?? []).map(c => c.text), success_checks: (card.acceptance ?? []).map(c => c.criterion + ': ' + c.threshold), kpis: [], notes: '', proposal_id: proposal.proposal_id, seats: proposal.seats, lead_seat_id: proposal.lead_seat_id, working_groups: proposal.working_groups ?? [], amendments: [] };
}

function productionCheck(document, view, base, context) {
  check('ai-blocks-production/1', document, context);
  if (!object(document) || document.schema !== 'ai-blocks-production/1' || !Array.isArray(document.artifacts) || !document.artifacts.length) fail('document.artifacts', 'Send the production manifest and actual local artifact hashes.');
  check('ai-blocks-evidence/1', document.evidence, context);
  const seats = new Map(view.team.seats.map(s => [s.seat_id, s])), claims = new Set(document.evidence.claims.map(c => c.id));
  const expected = view.spread?.slots ?? [], ids = new Set();
  for (const [index, a] of document.artifacts.entries()) {
    const p = `document.artifacts[${index}]`, seat = seats.get(a.maker_seat), slot = expected.find(s => s.slot_id === a.slot_id);
    if (!a.slot_id || ids.has(a.slot_id)) fail(`${p}.slot_id`, 'Give each output a unique slot ID.'); ids.add(a.slot_id);
    if (!seat || !types(seat).has('maker')) fail(`${p}.maker_seat`, 'Only a staffed maker can produce an artifact.');
    if (!pathSafe(a.path) || !HASH.test(a.sha256 ?? '')) fail(`${p}.path`, 'Use a safe local relative path and its SHA-256.');
    if (!a.producer_note?.trim() || !Array.isArray(a.items) || !a.items.length || !Array.isArray(a.checks) || !a.checks.length) fail(p, 'Include the producer note, pinned methods and self-check results.');
    if (a.checks.some(c => !['PASS', 'FAIL', 'NOT_RUN', 'BLOCKED'].includes(c.status))) fail(`${p}.checks`, 'Use honest PASS, FAIL, NOT_RUN or BLOCKED check statuses.');
    const pins=[...seat.toolbox,...(a.contributor_seats??[]).flatMap(id=>seats.get(id)?.toolbox??[])];
    for (const ref of a.items) if (!pins.some(r => r.slug === ref.slug && r.revision_sha256 === ref.revision_sha256)) fail(`${p}.items`, 'Use only methods pinned in the actual makers’ toolboxes.');
    if (!Array.isArray(a.claims) || a.claims.some(id => !claims.has(id))) fail(`${p}.claims`, 'Link every claimed fact to the evidence ledger.');
    if (slot && (slot.family !== a.family || slot.maker_seat !== a.maker_seat || slot.modality !== a.modality)) fail(p, 'The output must match the approved spread slot, maker, family and modality.');
    if (!object(a.budget)||!Number.isFinite(a.budget.allowance)||a.budget.allowance<0)fail(`${p}.budget`,'Report the actual declared tool allowance.');
    if(a.budget.used===null){
      if(a.budget.usage_status!=='NOT_AVAILABLE'||!a.budget.reason?.trim())fail(`${p}.budget`,'Unknown tool totals need NOT_AVAILABLE and an explanation; do not substitute operation counts.');
    }else{
      if(!Number.isFinite(a.budget.used)||a.budget.used<0||a.budget.used>a.budget.allowance||a.budget.usage_status==='NOT_AVAILABLE')fail(`${p}.budget`,'Report measured total tool use within its allowance, or explicitly mark it unavailable.');
      if(a.budget.allowance&&a.budget.used<.6*a.budget.allowance&&!a.budget.reason?.trim())fail(`${p}.budget.reason`,'Explain why less than 60% of the allowance was needed.');
    }
  }
  if (expected.length && (expected.length !== ids.size || expected.some(s => !ids.has(s.slot_id)))) fail('document.artifacts', 'Produce every approved spread slot exactly once.');
  if (document.artifacts.length !== view.card.deliverables.reduce((n, d) => n + d.count, 0)) fail('document.artifacts', 'Meet the requested deliverable count.');
  if(view.card.deliverables.length>1){
    for(const kind of view.card.deliverables)if(document.artifacts.filter(a=>a.kind===kind.kind).length!==kind.count)fail('document.artifacts.kind','Meet the scoped count for every deliverable kind.');
  }
  for (const claim of document.evidence.claims) {
    const checker = seats.get(claim.checked_by);
    if (!checker || !types(checker).has('fact_checker') || types(checker).has('maker')) fail('document.evidence.claims.checked_by', 'A staffed fact checker who did not make the work must check each claim.');
    if ((claim.used_in ?? []).some(id => !ids.has(id))) fail('document.evidence.claims.used_in', 'Evidence may refer only to real produced slots.');
  }
  if (view.team.lead_seat_id && (document.lead_review?.by_seat !== view.team.lead_seat_id || document.lead_review?.status !== 'PASS' || !document.lead_review?.notes?.trim())) fail('document.lead_review', 'The task lead must check that the expert output meets the job before final review.');
}

/** Replays validated history on every call. A recomputed digest cannot make an invalid phase jump valid. */
function applyEvent(view, entry, base, catalogue) {
  const { event, document, schema } = entry, context = contextFor(view, base, catalogue);
  if (!JOB_EVENTS.includes(event)) fail('event', 'Unknown job event.');
  if (!object(document)) fail('document', 'Send a document object.');
  if (schema && document.schema && schema !== document.schema) fail('schema', 'The schema argument must match the document.');
  if (event === 'block') { if (!document.reason?.trim()) fail('document.reason', 'Explain what is blocked.'); if (view.phase === 'BLOCKED') fail('event', 'This job is already blocked.'); return { ...view, blocked_phase: view.phase, phase: 'BLOCKED', block: document.reason }; }
  if (event === 'reopen') { if (view.phase !== 'BLOCKED' || !document.reason?.trim()) fail('event', 'Only a blocked job can reopen, with a reason.'); const result = { ...view, phase: view.blocked_phase }; delete result.blocked_phase; delete result.block; return result; }
  if (event === 'set_preferences') { if (!object(document.answers)) fail('document.answers', 'Send the explicit preference values.'); const updated = updatePreferences(view.preferences ?? base.preferences, { job: base.job_type.job, answers: document.answers, explicit: true, job_id: base.job_id, at: entry.at }); if (!updated.ok) throw new JobValidationError(updated.errors); return { ...view, preferences: updated.preferences, preferences_changed: true }; }
  const expectedEvent = { SCOPE: 'scope', STAFF: 'staff', DIVERGE: 'diverge', DELIBERATE: 'council', PRODUCE: 'produce', REVIEW: 'review', DELIVER: 'deliver', LEARN: 'feedback' };
  if (event !== 'revise' && event !== expectedEvent[view.phase]) fail('event', `The ${view.phase} phase expects ${expectedEvent[view.phase] ?? 'no work event'}.`);
  if (event === 'scope') {
    check(stageSchema.scope, document, context);
    const brain=document.brand_brain;
    if(!brain||!['AVAILABLE','BUILT'].includes(brain.status)||!brain.business?.trim()||!pathSafe(brain.path)||!HASH.test(brain.sha256??'')||brain.read_by_coordinator!==true||!document.context_sources.some(source=>source.ref===brain.path))fail('document.brand_brain','Load and read the existing brand brain, or build a verified one first. Record its business, safe path, SHA-256 and matching context source before staffing.');
    if (document.request_verbatim !== base.request) fail('document.request_verbatim', 'Keep the owner’s original request unchanged.');
    if (document.dials.depth.value !== base.tier) fail('document.dials.depth', 'Use the agreed tier from start_job; restart to change team size and budget.');
    const saved = updatePreferences(view.preferences ?? base.preferences, { job: base.job_type.job, answers: document.preference_answers ?? {}, job_id: base.job_id, at: entry.at });
    return { ...view, phase: 'STAFF', card: document, rubric: assembleRubric(document), ...(saved.changed ? { preferences: saved.preferences, preferences_changed: true } : {}) };
  }
  if (event === 'staff') {
    if(document.tier&&document.tier!==base.tier)fail('document.tier','The staffed tier must match the scoped job.');
    const original=proposeTeam({task:base.request,job:base.job_type.job,job_card:view.card,tier:base.tier,host_capabilities:base.host_capabilities},catalogue);
    if(!original.ok)fail('document.proposal_id','The catalogue cannot staff this job yet. Resolve the reported role or palette gaps.');
    if(document.proposal_id!==original.proposal_id)fail('document.proposal_id','Use the proposal returned for this job card and current catalogue.');
    if(canonicalJobJSON(document.seats)!==canonicalJobJSON(original.seats)&&!document.amendments?.length)fail('document.amendments','Explain changes to the proposed roster.');
    check(stageSchema.staff, document, context);
    const lead=document.seats.find(s=>s.seat_id===document.lead_seat_id);if(!lead||types(lead).has('coordinator')||types(lead).has('judge'))fail('document.lead_seat_id','Choose a task-specific expert lead separate from the general coordinator and independent judge.');
    return {...view,phase:'DIVERGE',team:document};
  }
  if (event === 'diverge') {
    const routes = document.schema === 'ai-blocks-routes/1' ? document : document.routes, spread = document.schema === 'ai-blocks-spread/1' ? document : document.spread;
    if (routes) check('ai-blocks-routes/1', routes, context);
    if (spread) check('ai-blocks-spread/1', spread, context);
    if (!routes || (view.card.output_shape === 'many_artifacts' && !spread)) fail('document', 'Send a route board and a spread for multi-output work.');
    if (view.card.output_shape === 'many_artifacts' && spread.slots.length !== view.card.deliverables.reduce((n, d) => n + d.count, 0)) fail('document.spread.slots', 'The spread count must match the scoped deliverables.');
    return { ...view, phase: 'DELIBERATE', routes, ...(spread ? { spread } : {}), proposal_contents: document.proposal_contents ?? {} };
  }
  if (event === 'council') {
    check(stageSchema.council, document, context);
    if(view.routes){
      const routes=view.routes.routes;
      if(document.proposals.length!==routes.length||new Set(document.proposals.map(p=>p.ref)).size!==routes.length||routes.some(r=>!document.proposals.some(p=>p.ref===r.route_id&&p.owner_seat===r.owner_seat)))fail('document.proposals','The council must consider every rival route with its actual owner.');
    }
    for(const proposal of document.proposals){
      const pinned=view.proposal_contents?.[proposal.file]??view.proposal_contents?.[proposal.label];
      if(typeof pinned==='string'&&proposal.content!==undefined&&proposal.content!==pinned)fail('document.proposals.content','A proposal cannot change the original blind text while being critiqued. Record later changes in revisions.');
    }
    if (document.status === 'CONSENSUS_UNTESTED' && (document.red_team?.length ?? 0) < 2) fail('document.red_team', 'A winner without substantive criticism needs a second red-team pass.');
    if (base.tier === 'deep' && !([1,2].every(pass=>document.red_team?.some(r=>r.pass===pass)))) fail('document.red_team', 'Deep tier requires two red-team rounds.');
    return { ...view, phase: 'PRODUCE', council: document };
  }
  if (event === 'produce') { productionCheck(document, view, base, context); return { ...view, phase: 'REVIEW', production: document, evidence: document.evidence, reviews: [] }; }
  if (event === 'review') {
    check(stageSchema.review, document, context);
    if (document.loop !== view.loops) fail('document.loop', 'Report the current review pass number.');
    const produced = new Set(view.production.artifacts.map(a => a.slot_id));
    if (document.items.length !== produced.size || new Set(document.items.map(i => i.slot_id)).size !== produced.size || document.items.some(i => !produced.has(i.slot_id))) fail('document.items', 'Review every produced output exactly once.');
    if ((view.reviews ?? []).some(r => r.judge_seat === document.judge_seat)) fail('document.judge_seat', 'The second deep-tier review needs a different judge.');
    const critical = view.card.acceptance.filter(c => c.critical);
    if (critical.some(c => !document.critical_checks?.some(x => x.id === c.id && typeof x.passed === 'boolean' && x.quote?.trim()))) fail('document.critical_checks', 'Report each critical acceptance check with a quote.');
    const judged = scoreReview(document, view.rubric), criticalPass = critical.every(c => document.critical_checks.find(x => x.id === c.id)?.passed === true);
    const reviews = [...(view.reviews ?? []), document], pass = reviews.every(review => scoreReview(review,view.rubric).pass && critical.every(c => review.critical_checks?.find(x=>x.id===c.id)?.passed===true)) && judged.pass && criticalPass;
    const needsSecond = base.tier === 'deep' && reviews.length < 2;
    return { ...view, reviews, review: document, review_pass: pass && !needsSecond, phase: needsSecond ? 'REVIEW' : 'DELIVER', review_score: judged, needs_revision: !pass };
  }
  if (event === 'revise') {
    if (view.phase !== 'DELIVER' || !view.needs_revision) fail('event', 'Revise only after a failed review.');
    if (view.loops >= TIER_SETTINGS[base.tier].loops) fail('event', 'This tier has reached its revision limit. Deliver with honest flags.');
    if (!Array.isArray(document.slot_ids) || !document.slot_ids.length || !document.reason?.trim() || document.slot_ids.some(id => !view.production.artifacts.some(a => a.slot_id === id))) fail('document', 'Name the real slots to revise and why.');
    return { ...view, phase: 'PRODUCE', loops: view.loops + 1, revision: document, review_pass: false };
  }
  if (event === 'deliver') {
    check(stageSchema.deliver, document, context);
    const coordinator=view.team.seats.find(s=>types(s).has('coordinator')),finalCheck=document.coordinator_review;
    if(!finalCheck||finalCheck.by_seat!==coordinator.seat_id||typeof finalCheck.job_match!=='boolean'||!finalCheck.notes?.trim()||!Array.isArray(finalCheck.rubric_checks)||view.card.acceptance.some(c=>!finalCheck.rubric_checks.some(x=>x.id===c.id&&typeof x.passed==='boolean'&&x.notes?.trim())))fail('document.coordinator_review','The general coordinator must check the original job and every acceptance criterion after the task lead and independent judge.');
    const coordinatorPass=finalCheck.job_match&&finalCheck.rubric_checks.every(c=>c.passed);
    if(!coordinatorPass&&(!document.flags?.length||document.status!=='DELIVERED_WITH_FLAGS'))fail('document.coordinator_review','A failed final coordinator check requires explicit unresolved flags and DELIVERED_WITH_FLAGS status.');
    const required = deliveryTemplates({ hasSpread: Boolean(view.spread) }).map(f => (document.delivery_root?document.delivery_root+'/':'')+f.path.replace(/^delivery\//, ''));
    const names = (document.files ?? []).map(f => document.delivery_root?f.path:f.path.replace(/^delivery\//, ''));
    if (required.some(path => !names.includes(path))) fail('document.files', 'Include every required delivery file.');
    if (document.files.some(f => !pathSafe(f.path) || !HASH.test(f.sha256 ?? ''))) fail('document.files', 'Use safe relative file paths and actual content hashes.');
    if (document.deliverables.length !== view.production.artifacts.length || document.deliverables.some(d => !view.production.artifacts.some(a => a.slot_id === d.slot_id && a.path === d.path && a.sha256 === d.sha256))) fail('document.deliverables', 'Deliver the exact produced and reviewed artifact revisions.');
    if (!view.review_pass && (!Array.isArray(document.flags) || !document.flags.length || document.status !== 'DELIVERED_WITH_FLAGS')) fail('document.flags', 'A failed review must be delivered with explicit unresolved flags and DELIVERED_WITH_FLAGS status.');
    if (!view.review_pass && view.loops < TIER_SETTINGS[base.tier].loops && document.accept_remaining_failures !== true) fail('document', 'Revise the failed outputs, or record an explicit choice to deliver the remaining failures.');
    return { ...view, phase: 'LEARN', delivery: document };
  }
  if (event === 'feedback') {
    if (!Array.isArray(document.items) || document.items.length > 200) fail('document.items', 'Send scoped keep, kill or more_like_this feedback.');
    const feedback = document.items.map(f => { const a = view.production.artifacts.find(a => a.slot_id === f.slot_id); if (!a || !['keep', 'kill', 'more_like_this'].includes(f.action)) fail('document.items', 'Feedback must refer to an actual output and a supported action.'); return { family: a.family, action: f.action }; });
    const updated = updatePreferences(view.preferences ?? base.preferences, { job: base.job_type.job, feedback, job_id: base.job_id, at: entry.at });
    return { ...view, phase: 'COMPLETE', feedback: document, preferences: updated.preferences, preferences_changed: updated.changed };
  }
  return view;
}

function replay(state, catalogue) {
  if (!object(state) || state.schema !== JOB_STATE_SCHEMA || !object(state.base) || !Array.isArray(state.history) || state.history.length > 60) fail('state', 'Send the complete job-state document from the previous result.');
  bounded(state);
  const base = state.base;
  if (!/^job_[a-z0-9_-]{1,70}$/.test(base.job_id ?? '') || !TIER_SETTINGS[base.tier] || typeof base.request !== 'string' || !base.request.trim() || base.request.length > 4000 || !object(base.job_type) || !object(base.host_capabilities)) fail('state.base', 'The job identity, request, type and tier must be complete.');
  let view = { phase: 'SCOPE', loops: 0 };
  for (const entry of state.history) { if (!object(entry) || typeof entry.at !== 'string') fail('state.history', 'Invalid recorded event.'); view = applyEvent(view, entry, base, catalogue); }
  return view;
}

function nextAction(view, base) {
  const instructions = { SCOPE: 'Load and read the existing brand brain, or build one from verified sources first. Define the real job, outputs, dials, evidence and measurable acceptance checks in JOB-CARD.json. Ask at most three questions.', STAFF: 'Accept the proposed flexible team or amend it with reasons. The coordinator selects a task lead; experts collaborate under that lead.', DIVERGE: 'Write distinct blind routes and, for multiple outputs, the spread. Include proposal_contents keyed by the council proposal file path.', DELIBERATE: 'Run the council steps. Record quoted criticism, red-team tests, valid ballots, the choice, dissent and options.', PRODUCE: 'Experts produce under their task lead using full pinned methods and separate family pipelines. Return artifact hashes, producer notes, checks, budget use, evidence and the lead review.', REVIEW: 'Have a fresh independent judge score every artifact against the rubric with quotes. Include every critical acceptance check. Deep tier requires a second judge.', DELIVER: view.needs_revision ? 'Revise failed outputs within the tier limit, or deliver honest unresolved flags with DELIVERED_WITH_FLAGS status.' : 'Fill and hash the delivery templates. Deliver the exact reviewed artifact revisions.', LEARN: 'Ask which outputs to keep, kill or make more like, then send scoped feedback.', COMPLETE: 'The delivery and feedback are complete. Keep the validated local record.', BLOCKED: 'Resolve the stated block, then reopen with a reason.' };
  const event = { SCOPE: 'scope', STAFF: 'staff', DIVERGE: 'diverge', DELIBERATE: 'council', PRODUCE: 'produce', REVIEW: 'review', DELIVER: 'deliver', LEARN: 'feedback', BLOCKED: 'reopen' }[view.phase] ?? null;
  return { event, instruction: instructions[view.phase], questions_allowed: view.phase === 'SCOPE' ? 3 : 0, schema: stageSchema[event] ?? (event === 'produce' ? 'ai-blocks-production/1' : null), ...(view.phase === 'DELIVER' && view.needs_revision && view.loops < TIER_SETTINGS[base.tier].loops ? { alternative_event: 'revise' } : {}) };
}

async function describe(state, view, catalogue, initial = false) {
  const base = state.base, settings = TIER_SETTINGS[base.tier];
  const files = [{ path: 'state.json', content: JSON.stringify(state, null, 2) }];
  if (initial) files.push({ path: 'JOB-METHOD.md', content: jobMethod(base.host_profile, base.tier) }, { path: 'templates/JOB-CARD.json', content: JSON.stringify({ schema: 'ai-blocks-job-card/1', request_verbatim: base.request, dials: base.dials, job_to_be_done: '', output_shape: catalogue.approaches?.jobs?.[base.job_type.job]?.output_shape_default ?? 'many_artifacts', deliverables: [], audience: '', constraints: [], context_sources: base.context_refs, brand_brain:{status:'AVAILABLE',business:'',path:'brand-brain/00-index.md',sha256:'',read_by_coordinator:false}, facts: [], unknowns: [], questions_asked: [], acceptance: [], preferences_ref: base.preferences_ref, priors: { source: base.preferences ? 'memory' : 'none', families_that_worked: [], families_that_failed: [] } }, null, 2) });
  let proposal;
  if (view.phase === 'STAFF') { proposal = proposeTeam({ task: base.request, job: base.job_type.job, job_card: view.card, tier: base.tier, host_capabilities: base.host_capabilities }, catalogue); files.push({ path: 'TEAM-PROPOSAL.json', content: JSON.stringify(proposal, null, 2) }); }
  if (view.rubric) files.push({ path: 'RUBRIC.json', content: JSON.stringify(view.rubric, null, 2) });
  if (view.phase === 'DELIVER') files.push(...deliveryTemplates({ hasSpread: Boolean(view.spread) }));
  if (view.preferences_changed) files.push(...localPreferences(view.preferences).files);
  const warnings = [];
  if (base.host_profile !== 'parallel') warnings.push('A single-context host cannot prove independent review. State the actual isolation used.');
  if(view.production?.artifacts?.some(a=>a.budget?.used===null))warnings.push('The host did not expose some producer tool-call totals; their allowance use is not verified.');
  if (view.needs_revision) warnings.push('The review failed. Unresolved work cannot be described as passing.');
  if (view.preferences_changed) warnings.push('Preference files are proposals for the authorized host to save; no account write ran on this public service.');
  return { schema: 'ai-blocks-job/1', job_id: base.job_id, mode: base.mode, mode_reason: base.mode_reason, job_type: base.job_type, tier: base.tier, estimate: { seats: settings.seats[1], council_rounds: settings.council_rounds, token_multiple: settings.token_multiple, source: 'estimated' }, host_profile: base.host_profile, phase: view.phase, ok: true, errors: [], warnings, state, state_digest: await jobStateDigest(state), next_action: nextAction(view, base), files, ...(initial ? { dials: base.dials, dial_questions: base.dial_questions } : {}), ...(proposal ? { proposal } : {}), ...(view.rubric ? { rubric: view.rubric } : {}), ...(view.review_score ? { review_score: view.review_score } : {}), ...(view.preferences_changed ? { preference_update: localPreferences(view.preferences) } : {}), model_calls: 0, hosted_execution: false, stored_by_service: false, assurance: 'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED' };
}

export async function startJob(input = {}, catalogue = {}) {
  if (typeof input.request !== 'string' || !input.request.trim() || input.request.length > 4000) fail('request', 'Send the owner’s request in at most 4,000 characters.');
  bounded(input);
  let rerun;
  if(input.from_option){
    const source=input.option_source;
    if(!source?.state||!HASH.test(source.state_digest??'')||await jobStateDigest(source.state)!==source.state_digest)fail('option_source','A stateless option rerun needs the original validated state and digest. Send option_source:{state,state_digest} from that delivery.');
    const prior=replay(source.state,catalogue),option=prior.council?.decision?.option_cards?.find(o=>o.option_id===input.from_option);
    if(!option)fail('from_option','This option does not exist in the supplied job record.');
    const proposal=prior.council.proposals.find(p=>p.label===option.from);
    rerun={option_id:option.option_id,pitch:option.pitch,proposal,source_job_id:source.state.base.job_id};
  }
  const routed = routeJob(input, catalogue);
  if(input.job){if(!Object.hasOwn(catalogue.approaches?.jobs??{},input.job))fail('job','Choose a published job ID.');if(!input.job_reason?.trim())fail('job_reason','Explain why this job type fits the request.');routed.job_type={job:input.job,confidence:1,alternatives:[]};}
  if (!routed.ok) throw new JobValidationError(routed.errors);
  if (routed.mode !== 'team') {
    const selectedItem=input.item_id??(routed.selected_id&&catalogue.items?.some(i=>i.slug===routed.selected_id)?routed.selected_id:null);
    const selectedRole=input.role_id??(routed.selected_id&&(Array.isArray(catalogue.roles)?catalogue.roles:catalogue.roles?.roles??[]).some(r=>r.id===routed.selected_id)?routed.selected_id:null);
    const action=routed.mode==='outcome'?{tool:'start_outcome',args:{request:input.request}}:selectedItem?{tool:'get_item',args:{id:selectedItem}}:selectedRole?{tool:'prepare_specialist',args:{role_id:selectedRole}}:input.persona_id?{tool:'load_agent',server:'https://agents.useaiblocks.com/mcp',args:{id:input.persona_id}}:{tool:'find_specialist',args:{task:input.request}};
    return {schema:'ai-blocks-job/1',job_id:'job_'+crypto.randomUUID(),...routed,tier:'quick',estimate:{seats:1,council_rounds:0,token_multiple:[1,1],source:'estimated'},host_profile:input.host_capabilities?.parallel_agents?'parallel':'sequential',phase:'ROUTE',next_action:{event:null,...action,instruction:'Before any production, read the complete verified brand brain or build one from authorized sources; use a verified project context brain for non-business work. Keep the path, hash and read receipt with the job. '+(routed.mode==='outcome'?'Continue in the outcome track, retaining the owner’s words.':'Load the named item or specialist through the existing direct tools.')},files:[],model_calls:0,stored_by_service:false,hosted_execution:false};
  }
  const approachJob = catalogue.approaches?.jobs?.[routed.job_type.job] ?? {}, host = input.host_capabilities ?? {};
  const resolved = resolveDials({ ...input, job: routed.job_type.job, approachJob }); if (!resolved.ok) throw new JobValidationError(resolved.errors);
  const host_profile = input.host_profile ?? (host.parallel_agents && host.max_parallel >= 2 ? 'parallel' : 'sequential');
  const tier = resolved.dials.depth.value;
  const base = { job_id: `job_${crypto.randomUUID()}`, request: input.request, mode: 'team', mode_reason: routed.mode_reason, job_type: routed.job_type, tier, host_profile, host_capabilities: host, explicit_dials: input.dials ?? {}, dials: resolved.dials, dial_questions: dialQuestions({ dials: resolved.dials, approachJob, output_shape: approachJob.output_shape_default }), context_refs: input.context_refs ?? [], parent_outcome_id: input.parent_outcome_id ?? null, from_option: rerun ?? null, preferences: input.preferences ?? null, preferences_ref: input.preferences_ref ?? { store: input.preferences ? 'local' : 'none', id: '', version: input.preferences?.version ?? 0 } };
  const state = { schema: JOB_STATE_SCHEMA, base, history: [] };
  const response = await describe(state, { phase: 'SCOPE', loops: 0 }, catalogue, true);
  if(rerun){response.rerun=rerun;response.files.push({path:'OPTION.json',content:JSON.stringify(rerun,null,2)});response.next_action.instruction+=' Scope this rerun around OPTION.json and preserve its winning conditions.';}
  if (routed.ask) response.next_action.question = routed.question;
  if(!input.job){response.classification_review={status:'CANDIDATE_REQUIRES_SCOPE_CHECK',candidates:[routed.job_type.job,...routed.job_type.alternatives].filter(Boolean),instruction:'Check this guess against the actual output and brand brain. If another job fits, restart with job and job_reason. Ask only if the supplied context cannot settle it.'};}
  return response;
}

export async function advanceJob(input, catalogue = {}) {
  const { state, state_digest, job_id, event } = input ?? {};
  if (!HASH.test(state_digest ?? '') || await jobStateDigest(state) !== state_digest) fail('state_digest', 'The state changed. Send state.json and the digest from the latest result unchanged.');
  if (job_id !== state?.base?.job_id) fail('job_id', 'The job ID must match its state.');
  let view = replay(state, catalogue), document = input.document;
  if (event === 'staff' && (input.accept_proposal === true || document?.accept_proposal === true)) {
    const proposal = proposeTeam({ task: state.base.request, job: state.base.job_type.job, job_card: view.card, tier: state.base.tier, host_capabilities: state.base.host_capabilities }, catalogue);
    document = asTeamPlan(proposal, view.card);
  }
  const entry = { event, schema: input.schema ?? document?.schema ?? null, document, at: new Date().toISOString() };
  view = applyEvent(view, entry, state.base, catalogue);
  const next = structuredClone({ ...state, history: [...state.history, entry] }); bounded(next);
  return describe(next, view, catalogue);
}
