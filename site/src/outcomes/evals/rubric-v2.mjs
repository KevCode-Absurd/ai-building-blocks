// Rubric v2: a harder, deterministic read of a recorded engagement. v1 (rubric.mjs) checks coverage and gates releases;
// nearly every good run scores close to 100 on it, so it catches drops but cannot tell good from great. v2 asks what a
// demanding expert reviewer would: are the checks specific to this job, do the hypotheses rest on data with decision
// thresholds, are the sources primary, dated and corroborated, how much owner time does the plan cost, and is the
// measurement designed with baselines, volumes, comparisons and guardrail stop rules. It is reported, not gated.
// Like v1 it reads the brief, research and plan only; the work the stages produce is graded by stage-grading.mjs.
import example from '../examples/rising-cpa.mjs';

export const RUBRIC_V2_VERSION = 2;

const STOP = new Set('about above after again against all also and any are because been before being below between both but can cannot could does doing done down during each either every few for from further had has have having here how into its itself just least less made make many may more most much must need needs no nor not now off once one only other our out over own same shall should since some still such than that the their them then there these they this those through too under until upon very was were what when where which while who whom why will with within without would yet you your week weeks month months day days stage plan owner each show shown read check checks written write list using used based clear first last next full every case data file files number numbers result results'.split(' '));
const words = v => typeof v === 'string' ? v : Array.isArray(v) ? v.map(words).join('\n') : v && typeof v === 'object' ? Object.values(v).map(words).join('\n') : '';
const tokens = v => new Set(words(v).toLowerCase().match(/[a-z][a-z0-9-]{3,}/g)?.filter(t => !STOP.has(t)) ?? []);
const overlaps = (text, vocab, n = 1) => { let hit = 0; for (const t of tokens(text)) if (vocab.has(t) && ++hit >= n) return true; return false; };
const share = (xs, test) => xs.length ? xs.filter(test).length / xs.length : 0;
const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
const months = (a, b) => (Number(b.slice(0, 4)) - Number(a.slice(0, 4))) * 12 + Number(b.slice(5, 7)) - Number(a.slice(5, 7));

// A threshold an outsider could test: a figure, or a comparison word next to one.
const NUMBER = /\d/;
const VERIFY = /\b(match(es|ed)?|reconcil\w*|ties? (out|to|back)|equal\w*|against|within|at least|at most|no more than|fewer than|more than|less than|above|below|under|over|before|after|every|each|none|zero|no \w+ (is|are|was|were)|not (in|on|used)|exactly|same|differ\w*|compare\w*|only|named|listed|recorded|written down|signed|approved by)\b/i;
const VAGUE = /^(the )?(output|work|result|file|document|draft|report|plan)s? (is|are|looks?) (good|complete|correct|done|ready|fine|ok|accurate|high quality)\.?$/i;
// Where primary guidance lives: regulators, official help and documentation, standards bodies.
const PRIMARY_HOST = /(^|\.)(gov|gov\.uk|nhs\.uk|europa\.eu|ac\.uk|edu|ico\.org\.uk|asa\.org\.uk|ftc\.gov|w3\.org|ietf\.org|iso\.org|aicpa-cima\.com|owasp\.org|nist\.gov)$|^(help|support|docs|developer|developers|learn|business|sellercentral|advertising|ads|cloud|dev|web)\./i;
const PRIMARY_PATH = /\/(help|help-center|helpcenter|docs?|documentation|support|policies|policy|legal|guidance|standards?|knowledge-base|answer)\b/i;
const COMPARISON = /\b(control|holdout|hold-out|a\/b|split|test group|comparison (group|period)|compared with|versus|vs\.?|before[- ]and[- ]after|pre-?period|same (period|weeks?|month) last|last year|seasonal\w*|baseline period|untreated|unchanged group)\b/i;
const DURATION = /\b(\d+|one|two|three|four|five|six|seven|eight|ten|twelve|thirteen)(\s*(-|to)\s*\d+)?[\s-]*(full\s+)?(hours?|days?|weeks?|months?|quarters?|closes?|episodes?|issues?|runs?|releases?)\b/i;
// A volume set before launch: a count, or a rule that every single event counts (a leaked key, a 212-question set).
const COUNTED = /\b\d[\d,]*\b|\b(two|three|four|five|six|seven|eight|nine|ten|twelve|thirteen|twenty|fifty|hundred)\b|\bno volume (is )?needed\b|\bany (single )?\w+ (with|after|counts)\b/i;
const FINDING = /\b(findings?|evidence|rests? on|based on|diagnos\w*|supported|refuted|sourced?|cit(es?|ed|ing)|trac(es?|ed)|research)\b/i;
const TRADEOFF = /\b(costs?|effort|risks?|hours?|price[sd]?|budget|trade-?offs?)\b/i;
// Checks every plan can carry whatever the job: the method's own rules and the worked example hosts are shown.
// They are good to have but say nothing about this job, so they don't count as specific.
const METHOD_CHECKS = [
  ...example.plan.stages.flatMap(st => (st.checks ?? []).map(c => c.name)),
  'Ends with CHECKED, LIMITED or UNRELIABLE', 'Every hypothesis is SUPPORTED, REFUTED or UNKNOWN', 'Each main finding names a competing explanation',
  'Groups with few records are marked low-confidence', 'Every option cites the finding it rests on', 'Chosen and passed-over options and the reasons are recorded',
  'Every registered test is closed with a verdict', 'Each test is registered before it goes live', 'Each action was approved by the owner before it happened',
].map(n => tokens(n));
const jaccard = (a, b) => { let i = 0; for (const t of a) if (b.has(t)) i++; return i / (a.size + b.size - i || 1); };
const boilerplate = name => { const t = tokens(name); return METHOD_CHECKS.some(b => jaccard(t, b) >= 0.5); };
// Minutes of owner attention each kind of stop costs, roughly: reading, judging and replying.
const GATE_MINUTES = { none: 0, review: 15, approve: 10, approve_each_action: 10 };

/** Points per item; the items add up to 100. today is the run's recorded date, for source recency. */
export function scoreRunV2(expect, { brief, research, plan }, { today } = {}) {
  const items = [];
  const add = (group, id, points, got, note = '') => items.push({ group, id, points, got: Math.round(clamp(got, 0, points) * 10) / 10, note });
  const stages = plan.stages;
  const work = stages.filter(s => s.kind !== 'intake');
  const kinds = new Set(stages.map(s => s.kind));
  const m = brief.metric;

  // The words of this job: the metric, systems, data and research. A check that names none of them could sit in any plan.
  const job = tokens([brief, plan.data.map(d => [d.name, d.fields, d.why]), research.steps.map(s => [s.name, s.why]), research.pitfalls.map(p => p.text), plan.capabilities.map(c => c.name)]);

  // 1. Checks specific to the job (20)
  const checks = work.flatMap(s => s.checks.map(c => ({ stage: s, ...c })));
  const specific = c => !VAGUE.test(c.name) && !boilerplate(c.name) && (NUMBER.test(c.name) || overlaps(c.name, job, 2));
  const sp = share(checks, specific);
  add('checks', 'specific', 10, 10 * clamp((sp - 0.4) / 0.45), `${Math.round(sp * 100)}% of ${checks.length} checks are written for this job (not the method's or the worked example's stock checks) and name its figures, data or systems.`);
  const numbered = share(checks, c => NUMBER.test(c.name));
  add('checks', 'thresholds', 4, 4 * clamp(numbered / 0.4), `${Math.round(numbered * 100)}% of checks carry a figure or threshold.`);
  const risky = work.filter(s => ['evidence', 'diagnosis', 'production', 'execution'].includes(s.kind));
  const deep = share(risky, s => s.checks.filter(c => c.required).length >= 2);
  add('checks', 'depth', 3, 3 * deep, `${Math.round(deep * 100)}% of evidence, diagnosis, production and execution stages have two or more required checks.`);
  const guard = tokens([brief.guardrails, brief.limits]);
  const made = work.filter(s => s.kind === 'production' || s.kind === 'execution');
  const guarded = share(made, s => s.checks.some(c => overlaps(c.name, guard)));
  add('checks', 'guardrails-checked', 3, made.length ? 3 * guarded : 3, made.length ? `${Math.round(guarded * 100)}% of production and execution stages check a guardrail or limit from the brief.` : '');

  // 2. Hypotheses linked to evidence, with decision thresholds (15)
  const hyps = plan.hypotheses;
  const diagnosisExpected = expect.kinds.includes('diagnosis') || kinds.has('diagnosis');
  if (diagnosisExpected) {
    const dataVocab = tokens([plan.data.map(d => [d.name, d.fields]), stages.filter(s => ['evidence', 'integrity'].includes(s.kind)).map(s => s.outputs.map(o => o.name))]);
    const research_ = tokens([research.pitfalls.map(p => p.text), research.steps.map(s => [s.name, s.why])]);
    const fixKinds = new Map(stages.map(s => [s.id, s.kind]));
    const linked = share(hyps, h => overlaps(h.test, dataVocab, 2));
    const thresholded = share(hyps, h => NUMBER.test(h.confirm_if) || NUMBER.test(h.refute_if));
    const traced = share(hyps, h => overlaps(h.statement, research_, 2));
    const fixes = share(hyps, h => ['production', 'execution'].includes(fixKinds.get(h.fix_stage)));
    add('hypotheses', 'tested-on-data', 4, 4 * linked, `${Math.round(linked * 100)}% of ${hyps.length} hypotheses are tested on data the plan gathers.`);
    add('hypotheses', 'decision-thresholds', 5, 5 * clamp(thresholded / 0.6), `${Math.round(thresholded * 100)}% say with a figure what would support or refute them.`);
    add('hypotheses', 'from-research', 3, 3 * traced, `${Math.round(traced * 100)}% trace to the research pitfalls or steps.`);
    add('hypotheses', 'fixed-by-work', 3, 3 * fixes, `${Math.round(fixes * 100)}% name a production or execution stage that fixes them.`);
  } else {
    // No diagnosis: the options must still rest on findings.
    const choices = stages.filter(s => s.kind === 'options');
    const pool = choices.length ? choices : made;
    const said = s => words([s.goal, s.checks.map(c => c.name)]);
    const grounded = share(pool, s => FINDING.test(said(s))), weighed = share(pool, s => TRADEOFF.test(said(s)) && NUMBER.test(said(s)));
    add('hypotheses', 'grounded-choices', 8, 8 * grounded, `${Math.round(grounded * 100)}% of ${choices.length ? 'options' : 'production'} stages say which findings or sources each choice rests on.`);
    add('hypotheses', 'weighed-choices', 7, 7 * weighed, `${Math.round(weighed * 100)}% weigh each choice's cost, effort or risk against a figure from the brief.`);
  }

  // 3. Research source quality and recency (15)
  const web = research.sources.filter(s => s.kind === 'web');
  const primary = share(web, s => { const u = new URL(s.ref); return PRIMARY_HOST.test(u.hostname) || PRIMARY_PATH.test(u.pathname); });
  add('research', 'primary-sources', 4, 4 * clamp(primary / 0.5), `${Math.round(primary * 100)}% of ${web.length} web sources are official documentation, help pages or regulators.`);
  const recent = share(web, s => /^\d{4}-\d{2}-\d{2}$/.test(s.date ?? '') && !/undated|when it was read|date (read|accessed)|accessed/i.test(s.note ?? '') && (!today || months(s.date, today) <= 18));
  add('research', 'dated-recent', 4, 4 * recent, `${Math.round(recent * 100)}% carry a publication date within 18 months.`);
  const webIds = new Set(web.map(s => s.id));
  const corroborated = share(research.steps, s => s.sources.length >= 2 && s.sources.some(id => webIds.has(id)));
  add('research', 'corroborated', 4, 4 * corroborated, `${Math.round(corroborated * 100)}% of ${research.steps.length} steps cite two or more sources, one from the web.`);
  const hosts = new Set(web.map(s => new URL(s.ref).hostname.replace(/^www\./, ''))).size;
  add('research', 'independent-sites', 3, 3 * clamp((hosts - 1) / 4), `${hosts} different websites.`);

  // 4. Owner time (15): minutes of attention the plan asks for, from its stops, manual data and owner-run access.
  const gateMinutes = stages.reduce((t, s) => t + (GATE_MINUTES[s.gate] ?? 0), 0);
  const manualData = plan.data.filter(d => d.routes.every(r => r.kind === 'ASK')).length;
  const ownerAccess = plan.capabilities.filter(c => c.via === 'owner').length;
  const minutes = gateMinutes + 10 * manualData + 3 * plan.data.length - 3 * manualData + 5 * ownerAccess;
  add('owner', 'minutes', 15, 15 * clamp((130 - minutes) / 80), `About ${minutes} minutes of owner time (stops ${gateMinutes}, data ${10 * manualData + 3 * (plan.data.length - manualData)}, owner-run access ${5 * ownerAccess}). Full marks at 50 or less.`);

  // 5. Measurement design (20)
  const meas = plan.measurement;
  const measStages = stages.filter(s => s.kind === 'measurement');
  const measText = words([meas, measStages.map(s => [s.goal, s.checks.map(c => c.name)])]);
  if (m) {
    const baselineChecked = work.some(s => ['evidence', 'integrity'].includes(s.kind) && s.checks.some(c => /baseline|total|match|reconcil|tie|recalculat|re-?calculat|same (definition|dates|period)/i.test(c.name) && overlaps(c.name, tokens([m.name, m.unit, plan.data.map(d => d.name)]))));
    add('measurement', 'baseline', 4, (m.baseline !== null ? 2 : 0) + (baselineChecked ? 2 : 0), [m.baseline === null && 'No baseline figure.', !baselineChecked && 'No evidence or integrity check re-checks the baseline at its source.'].filter(Boolean).join(' '));
    add('measurement', 'window', 3, meas && DURATION.test(meas.window) ? 3 : meas ? 1 : 0, !meas ? 'No measurement window.' : DURATION.test(meas.window) ? '' : 'The window has no length.');
    add('measurement', 'minimum-volume', 4, meas && COUNTED.test(meas.min_volume) ? 4 : meas ? 1 : 0, !meas ? 'No minimum volume.' : COUNTED.test(meas.min_volume) ? '' : 'The minimum volume is not a number set before launch.');
    const stopRule = meas?.stop_rule ?? '';
    add('measurement', 'stop-rule', 3, (overlaps(stopRule, guard) ? 1.5 : 0) + (NUMBER.test(stopRule) ? 1.5 : 0), !meas ? 'No stop rule.' : [!overlaps(stopRule, guard) && 'The stop rule does not name a guardrail.', !NUMBER.test(stopRule) && 'The stop rule has no threshold.'].filter(Boolean).join(' '));
    add('measurement', 'comparison', 3, COMPARISON.test(measText) ? 3 : 0, COMPARISON.test(measText) ? '' : 'No control group, holdout or comparison period, so a change in the number cannot be credited to the work.');
    const numericGuards = share(brief.guardrails, g => NUMBER.test(g));
    add('measurement', 'numeric-guardrails', 3, brief.guardrails.length ? 3 * clamp(numericGuards / 0.5) : 0, `${Math.round(numericGuards * 100)}% of ${brief.guardrails.length} guardrails have a figure.`);
  } else {
    // No number to move: the deliverable is checked instead (a policy, an answer set, a report).
    const doneCheckable = share(brief.done, d => NUMBER.test(d) || VERIFY.test(d));
    const reviewed = share(made, s => s.reviewers.some(r => r !== s.owner.role));
    const sourced = share(made, s => s.checks.some(c => /source|evidence|polic|control|record|log|tie|match|reconcil/i.test(c.name)));
    const evidenceFirst = made.length && made.every(s => stages.some(e => e.kind === 'evidence' && stages.indexOf(e) < stages.indexOf(s)));
    add('measurement', 'done-checkable', 5, 5 * doneCheckable, `${Math.round(doneCheckable * 100)}% of the done list can be checked by someone else.`);
    add('measurement', 'independent-review', 5, made.length ? 5 * reviewed : 0, `${Math.round(reviewed * 100)}% of production and execution stages have a reviewer who is not the owner specialist.`);
    add('measurement', 'evidence-checks', 5, made.length ? 5 * sourced : 0, `${Math.round(sourced * 100)}% check the work against its source or records.`);
    add('measurement', 'evidence-first', 5, evidenceFirst ? 5 : 0, evidenceFirst ? '' : 'Work is built before the evidence is gathered.');
  }

  // 6. Claims point to evidence (10)
  const options = stages.filter(s => s.kind === 'options');
  const groundedOptions = options.length ? share(options, s => FINDING.test(words([s.goal, s.checks.map(c => c.name)]))) : 0;
  add('evidence', 'options-cite-findings', 3, options.length ? 3 * groundedOptions : (kinds.has('decision') ? 0 : 3), options.length ? `${Math.round(groundedOptions * 100)}% of options stages tie each option to a finding.` : kinds.has('decision') ? 'A decision with no options stage.' : '');
  const reviewedWork = share(made, s => s.reviewers.some(r => r !== s.owner.role));
  add('evidence', 'independent-review', 4, made.length ? 4 * reviewedWork : 0, `${Math.round(reviewedWork * 100)}% of ${made.length} production and execution stages have an independent reviewer.`);
  add('evidence', 'unknowns-named', 3, 3 * clamp(brief.unknowns.length / 3), `${brief.unknowns.length} unknowns named.`);

  // 7. Specialists and tested items (5)
  const traced = work.filter(s => !['options', 'decision', 'measurement', 'learning'].includes(s.kind));
  const fitted = traced.length ? traced.reduce((t, s) => t + (s.owner.role ? 0.5 : 0.25) + (s.uses.length ? 0.5 : 0), 0) / traced.length : 0;
  add('specialists', 'fit', 5, 5 * fitted, `${traced.filter(s => s.owner.gap).length} catalogue gaps; ${traced.filter(s => !s.uses.length).length} stages with no catalogue items.`);

  const score = Math.round(items.reduce((t, i) => t + i.got, 0) * 10) / 10;
  return { score, items };
}

/** Spread of a set of scores: mean, min, max, standard deviation. */
export function spread(scores) {
  if (!scores.length) return null;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const sd = Math.sqrt(scores.reduce((t, x) => t + (x - mean) ** 2, 0) / scores.length);
  const r = x => Math.round(x * 10) / 10;
  return { mean: r(mean), min: r(Math.min(...scores)), max: r(Math.max(...scores)), sd: r(sd) };
}
