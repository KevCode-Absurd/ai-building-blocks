// Plans that worked (B5). With the owner's opt-in consent, a finished engagement becomes an anonymised plan pattern:
// the owner sees the exact file first and consents to that file (by its sha256), it goes to a review queue, a person at
// AI Blocks reviews it, and only then can it be exported as a catalogue workflow draft, which a person edits and
// publishes through the normal catalogue process. Nothing here sends, stores or publishes anything.
// Also: a catalogue-gap report, from patterns or recorded runs, telling phase 1 which specialists to build next.
import { fail, planPattern, refuseSecrets, text } from './engagement.mjs';

export const PATTERN_SCHEMA = 'ai-blocks-plan-pattern/2';
export const SUBMISSION_SCHEMA = 'ai-blocks-pattern-review/1';
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const encoder = new TextEncoder();
const sha256 = async s => [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(s)))].map(v => v.toString(16).padStart(2, '0')).join('');
const fileOf = pattern => JSON.stringify(pattern, null, 2) + '\n';

// What counts as private in free text. Structural fields (stage kinds, specialist and item ids, gates, verdicts) are kept.
const PRIVATE = [
  ['email', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email]'],
  ['link', /\bhttps?:\/\/\S+|\bwww\.\S+/gi, '[link]'],
  ['handle', /(^|\s)@[A-Za-z0-9_.]{2,}/g, '$1[handle]'],
  ['phone', /\+?\d[\d ()-]{7,}\d/g, '[phone]'],
  ['postcode', /\b[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}\b/g, '[postcode]'],
  ['money', /[£$€¥]\s?\d[\d,.]*(\s?(k|m|bn|million|thousand))?\b|\b\d[\d,.]*\s?(dollars|pounds|euros|usd|gbp|eur)\b/gi, '[amount]'],
  ['figure', /\b\d[\d,.]*\s?%|\b\d{1,3}(,\d{3})+(\.\d+)?\b|\b\d{3,}(\.\d+)?\b/g, '[n]'],
];
const SENTENCE_START = /(^|[.!?:;]\s+|\n\s*|["'(]\s*)$/;
const COMMON = new Set('The This That These Those When Where What Which Who Why How Each Every All Any Some No Not Only One Two Three Four Five Six Seven Eight Nine Ten First Second Third Last Next After Before During If Then Else And But Or For With Without From Into Over Under Our Your Their His Her Its We You They I A An In On At By To Of As Is Are Was Were Be Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March April May June July August September October November December CHECKED LIMITED UNRELIABLE SUPPORTED REFUTED UNKNOWN WIN LOSS INCONCLUSIVE PASS FAIL CSV PDF JSON API MCP SEO CRM CTA FAQ KPI ROI CPA ROAS AOV LTV CAC MRR ARR NPS SMS URL UK US EU VAT GDPR'.split(' '));

/** Names that would identify the business: capitalised words the owner wrote, minus names public sources use too. */
export function privateTerms(engagement, { keep = [], remove = [] } = {}) {
  const b = engagement.brief ?? {};
  const own = [engagement.request, b.outcome, b.deliverable, b.done, b.assets, b.decides, b.data_home, b.guardrails, b.limits, b.unknowns, (b.answers ?? []).map(a => a.answer)].flat(3).filter(x => typeof x === 'string').join('\n');
  const publicWords = new Set([...(engagement.research?.sources ?? []).filter(s => s.kind === 'web').flatMap(s => `${s.title} ${new URL(s.ref).hostname.replace(/^www\./, '').split('.')[0]}`.split(/[^A-Za-z0-9]+/)), ...keep].map(w => w.toLowerCase()).filter(Boolean));
  const found = new Set(), initial = new Map();
  for (const m of own.matchAll(/\b[A-Z][A-Za-z0-9'&-]{1,}\b/g)) {
    const w = m[0].replace(/'s$/, '');
    if (COMMON.has(w) || publicWords.has(w.toLowerCase())) continue;
    // A capital at the start of a sentence may be an ordinary word; count it as a name only if it appears twice.
    if (SENTENCE_START.test(own.slice(Math.max(0, m.index - 3), m.index))) { initial.set(w, (initial.get(w) ?? 0) + 1); continue; }
    found.add(w);
  }
  for (const [w, n] of initial) if (n >= 2) found.add(w);
  // Who decides is always a person or a team: every capitalised word there is a name.
  for (const m of String(b.decides ?? '').matchAll(/\b[A-Z][A-Za-z'-]{1,}\b/g)) if (!COMMON.has(m[0]) && !publicWords.has(m[0].toLowerCase())) found.add(m[0].replace(/'s$/, ''));
  for (const r of remove) found.add(text(r, 'Term to remove', 100));
  return [...found].sort((a, b) => b.length - a.length);
}

function scrubber(terms) {
  const removed = new Map();
  const note = (kind, n = 1) => removed.set(kind, (removed.get(kind) ?? 0) + n);
  const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const named = terms.length ? new RegExp(`\\b(${terms.map(escape).join('|')})('s)?\\b`, 'gi') : null;
  const clean = s => {
    if (typeof s !== 'string') return s;
    let out = s;
    for (const [kind, rx, to] of PRIVATE) out = out.replace(rx, (...m) => { note(kind); return to.replace('$1', m[1] ?? ''); });
    if (named) out = out.replace(named, () => { note('name'); return '[name]'; });
    return out;
  };
  return { clean, removed };
}

// Public source links are kept as written: they are the research, not the business.
const scanView = p => ({ ...p, research: { ...p.research, public_sources: (p.research?.public_sources ?? []).map(({ ref, ...r }) => r) } });

/** Anything that still looks private after anonymising. A pattern with residual risks cannot be shared. */
export function privacyScan(pattern, terms = []) {
  // Only text is scanned: numeric fields such as relative_change are meant to be there.
  const strings = v => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];
  const s = strings(pattern).join('\n');
  const risks = [];
  for (const [kind, rx] of PRIVATE) { const m = s.match(new RegExp(rx.source, rx.flags)); if (m) risks.push(`${kind}: ${m[0].slice(0, 40)}`); }
  for (const t of terms) if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(s)) risks.push(`name: ${t}`);
  try { refuseSecrets(pattern); } catch { risks.push('key or token'); }
  return risks;
}

/** The anonymised pattern for a finished round: the plan's shape, what held, verdicts as relative change, catalogue gaps. */
export function anonymisePattern(engagement, { keep = [], remove = [], experiments } = {}) {
  if (!engagement.plan || (engagement.stages.at(-1)?.state !== 'DONE' && engagement.round < 2)) fail('Patterns come from a finished round: complete the learning stage first.');
  const terms = privateTerms(engagement, { keep, remove });
  const { clean, removed } = scrubber(terms);
  const base = planPattern(engagement);
  // Closed tests from experiments.jsonl give each verdict its relative change; without the file, verdicts only.
  const closes = typeof experiments === 'string' ? experiments.split(/\r?\n/).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(x => x?.type === 'experiment' && x.action === 'close') : [];
  const deep = v => typeof v === 'string' ? clean(v) : Array.isArray(v) ? v.map(deep) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)])) : v;
  const pattern = {
    schema: PATTERN_SCHEMA, share: 'ONLY_WITH_OWNER_CONSENT', method_version: base.method_version, plan_version: base.plan_version, rounds: base.rounds,
    metric: base.metric ? { name: clean(base.metric.name), direction: base.metric.direction } : null,
    research: { steps: base.research.steps.map(clean), source_kinds: base.research.source_kinds, public_sources: engagement.research.sources.filter(s => s.kind === 'web').map(s => ({ title: clean(s.title), ref: s.ref, date: s.date })) },
    stages: deep(base.stages),
    hypotheses: (engagement.plan.hypotheses ?? []).map(h => ({ id: h.id, statement: clean(h.statement), fix_stage: h.fix_stage })),
    dropped: base.dropped.map(clean),
    experiments: closes.length ? closes.map(c => ({ hypothesis_id: engagement.records.experiments[c.id]?.hypothesis_id ?? null, verdict: c.verdict, relative_change: c.relative_change, volume_met: c.volume_met, guardrails_held: c.guardrail_results.every(g => g.held) })) : base.experiments.map(x => ({ ...x, relative_change: null })),
    gaps: engagement.plan.stages.filter(s => s.owner.gap).map(s => ({ kind: s.kind, gap: clean(s.owner.gap) })),
  };
  const risks = privacyScan(scanView(pattern), terms);
  return { pattern, removed: Object.fromEntries(removed), terms, risks };
}

/**
 * Step 1, preview: the exact file the owner would share and its sha256. Step 2, consent: the owner says yes to that
 * sha256 and gets PATTERN-SUBMISSION.json for the review queue. A different file, or residual private data, is refused.
 */
export async function preparePattern(engagement, { keep = [], remove = [], experiments, consent } = {}) {
  const { pattern, removed, terms, risks } = anonymisePattern(engagement, { keep, remove, experiments });
  const file = fileOf(pattern);
  const digest = await sha256(file);
  if (!consent) {
    return {
      schema: 'ai-blocks-pattern-preview/1', state: risks.length ? 'NEEDS_CLEANING' : 'AWAITING_OWNER_CONSENT', pattern_sha256: digest, removed, names_removed: terms,
      ...(risks.length ? { risks } : {}), files: { 'PATTERN.json': file },
      ask_owner: risks.length ? `Some details may still identify the business: ${risks.join('; ')}. Add them to remove, then show the owner the new file.` : 'Here is exactly what would be shared with AI Blocks: the plan\'s shape, which ideas held up and the results as percentages, with names, figures, links and contact details taken out. Would you like to share it so other owners can use what worked? It is your choice, and nothing is sent unless you say yes.',
      next: 'Show the owner PATTERN.json in full. Only if they say yes, call again with consent {"pattern_sha256":"<this sha>","by":"owner","consented":true,"at":"YYYY-MM-DD"}.',
    };
  }
  if (consent.by !== 'owner') fail('Only the owner can consent to sharing a pattern (by: "owner").');
  if (typeof consent.consented !== 'boolean') fail('consented must be true or false.');
  if (!DATE.test(consent.at ?? '')) fail('Consent date (at) must be YYYY-MM-DD.');
  if (consent.pattern_sha256 !== digest) fail('The owner consented to a different file. Show them the current PATTERN.json and ask again.');
  if (!consent.consented) return { schema: 'ai-blocks-pattern-preview/1', state: 'NOT_SHARED', pattern_sha256: digest, next: 'The owner said no. Nothing is shared. Keep the learnings in this project only.', files: {} };
  if (risks.length) fail(`The pattern still looks private (${risks.join('; ')}). Clean it and ask the owner again.`);
  const submission = {
    schema: SUBMISSION_SCHEMA, id: `pat-${digest.slice(0, 12)}`, submitted: consent.at, status: 'PENDING_REVIEW', pattern_sha256: digest,
    consent: { by: 'owner', consented: true, at: consent.at, pattern_sha256: digest },
    prechecks: { privacy: 'CLEAN', stages: pattern.stages.length, gaps: pattern.gaps.length, verdicts: pattern.experiments.map(x => x.verdict) },
    pattern, review: null,
  };
  return {
    schema: 'ai-blocks-pattern-preview/1', state: 'READY_TO_SEND', pattern_sha256: digest, files: { 'PATTERN-SUBMISSION.json': JSON.stringify(submission, null, 2) + '\n' },
    next: 'Save PATTERN-SUBMISSION.json. Nothing has been sent. If the owner wants to share it, they send this file to AI Blocks themselves; a person reviews it before it can become a catalogue workflow.',
  };
}

const REVIEW_CHECKLIST = {
  no_private_data: 'Nothing in the pattern identifies the business, its people, customers or figures.',
  method_sound: 'The stage order, checks and measurement are what a careful expert would do.',
  catalogue_ids_exist: 'Every specialist and item id is in the live catalogue.',
  honest_results: 'Verdicts follow the registered rules; nothing is presented as a guaranteed result.',
  reusable: 'Another owner with the same job could follow it without this business\'s context.',
};
export { REVIEW_CHECKLIST };

/** A person at AI Blocks reviews a queued submission. AI hosts cannot approve. */
export async function reviewSubmission(item, { reviewer, reviewer_kind, decision, notes, at, checklist = {} } = {}) {
  if (item?.schema !== SUBMISSION_SCHEMA) fail(`A submission must have schema ${SUBMISSION_SCHEMA}.`);
  if (item.status !== 'PENDING_REVIEW') fail(`This submission is ${item.status}; only pending submissions are reviewed.`);
  if (await sha256(fileOf(item.pattern)) !== item.pattern_sha256 || item.consent?.pattern_sha256 !== item.pattern_sha256 || item.consent?.consented !== true) fail('The pattern differs from the file the owner consented to. Reject it.');
  if (reviewer_kind !== 'human') fail('Patterns are reviewed by a person (reviewer_kind: "human"), never approved by an AI.');
  const name = text(reviewer, 'Reviewer', 120);
  if (!['APPROVED', 'REJECTED'].includes(decision)) fail('Decision must be APPROVED or REJECTED.');
  if (!DATE.test(at ?? '')) fail('Review date (at) must be YYYY-MM-DD.');
  const risks = privacyScan(scanView(item.pattern));
  if (decision === 'APPROVED') {
    const unticked = Object.keys(REVIEW_CHECKLIST).filter(k => checklist[k] !== true);
    if (unticked.length) fail(`Approve only when every review check holds. Not confirmed: ${unticked.join(', ')}.`);
    if (risks.length) fail(`The pattern still looks private: ${risks.join('; ')}.`);
  }
  return { ...item, status: decision, review: { by: name, kind: 'human', decision, at, checklist: Object.fromEntries(Object.keys(REVIEW_CHECKLIST).map(k => [k, checklist[k] === true])), ...(notes ? { notes: text(notes, 'Review notes', 2000) } : {}) } };
}

const yamlString = s => JSON.stringify(String(s));
/**
 * Turn an approved submission into a catalogue workflow draft (item.yaml and SKILL.md). The draft is marked unpublished;
 * a person edits it, checks it with the catalogue tools and moves it into catalogue-items/ by hand.
 */
export function workflowDraft(item, { slug, name } = {}) {
  if (item?.status !== 'APPROVED' || item.review?.kind !== 'human' || item.review?.decision !== 'APPROVED') fail('Only a pattern a person has reviewed and approved can become a workflow draft.');
  const id = /^[a-z0-9][a-z0-9-]{2,79}$/.test(slug ?? '') ? slug : fail('Give the draft a lowercase slug.');
  const title = text(name, 'Workflow name', 120);
  const p = item.pattern;
  const work = p.stages.filter(s => !['intake', 'decision', 'learning'].includes(s.kind));
  const uses = [...new Set(work.flatMap(s => s.uses))];
  const steps = work.filter(s => s.uses.length).map(s => ({ uses: s.uses[0], note: `${s.name}. Checks: ${s.checks.slice(0, 3).join('; ')}.` }));
  const yaml = [
    `slug: ${id}`, `name: ${yamlString(title)}`, `summary: ${yamlString(`A tested plan for: ${p.metric ? `${p.metric.direction} ${p.metric.name}` : 'this job'}. Drafted from a reviewed outcome pattern.`)}`,
    'category: orchestrator', 'type: workflow', 'role: orchestrate', 'status: draft', 'published: false', 'origin: outcome-pattern',
    `pattern: {id: ${item.id}, sha256: ${item.pattern_sha256}, reviewed_by: ${yamlString(item.review.by)}, reviewed: ${item.review.at}}`,
    `uses: [${uses.join(', ')}]`, 'steps:', ...steps.map(s => `  - {uses: ${s.uses}, note: ${yamlString(s.note)}}`),
    'credits:', ...p.research.public_sources.map(s => `  - {title: ${yamlString(s.title)}, url: ${s.ref}${s.date ? `, date: ${s.date}` : ''}}`),
  ].join('\n') + '\n';
  const md = `---\nname: ${id}\ndescription: ${yamlString(`Use when you want to ${p.metric ? `${p.metric.direction} ${p.metric.name}` : 'do this job'}. Draft from a reviewed outcome pattern; edit before publishing.`)}\n---\n\n# ${title}\n\nDRAFT. Not published. A person must edit this page, check it with the catalogue tools and move it into catalogue-items/ before anyone sees it.\n\n## Steps\n\n${p.stages.filter(s => s.kind !== 'intake').map((s, i) => `${i + 1}. **${s.name}** (${s.kind}${s.owner ? `, specialist \`${s.owner}\`` : s.gap ? `, no specialist yet: ${s.gap}` : ''}). Checks: ${s.checks.join('; ')}.`).join('\n')}\n\n## What held up\n\n${p.experiments.map(x => `- ${x.hypothesis_id ?? 'test'}: ${x.verdict}${x.relative_change !== null && x.relative_change !== undefined ? ` (${Math.round(x.relative_change * 100)}%)` : ''}`).join('\n') || '- No closed tests.'}\n\n## Sources\n\n${p.research.public_sources.map(s => `- [${s.title}](${s.ref})${s.date ? ` (${s.date})` : ''}`).join('\n') || '- None.'}\n`;
  return { status: 'DRAFT', published: false, path: `drafts/${id}/`, files: { 'item.yaml': yaml, 'SKILL.md': md }, next: 'Edit, run the catalogue checks, then move it into catalogue-items/ by hand. Nothing was published.' };
}

/** Where no specialist fit, across patterns or recorded runs. Each entry: { source, industry?, stages: [{ kind, gap }] }. */
export function catalogueGapReport(entries) {
  const gaps = entries.flatMap(e => (e.stages ?? []).filter(s => s.gap).map(s => ({ source: e.source, industry: e.industry ?? null, kind: s.kind, gap: s.gap })));
  const key = g => g.gap.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length > 3).slice(0, 6).sort().join(' ');
  const groups = new Map();
  for (const g of gaps) { const k = key(g); const x = groups.get(k) ?? { gap: g.gap, count: 0, kinds: new Set(), sources: new Set(), industries: new Set() }; x.count++; x.kinds.add(g.kind); x.sources.add(g.source); if (g.industry) x.industries.add(g.industry); groups.set(k, x); }
  const rows = [...groups.values()].sort((a, b) => b.count - a.count || a.gap.localeCompare(b.gap)).map(x => ({ gap: x.gap, count: x.count, kinds: [...x.kinds].sort(), industries: [...x.industries].sort(), sources: [...x.sources].sort() }));
  const markdown = `# Catalogue gaps\n\nStages where no specialist in the catalogue fit, from ${entries.length} engagements. Phase 1 builds these next.\n\n${rows.length ? `| Specialist needed | Times | Stage kinds | Industries | From |\n|---|---|---|---|---|\n${rows.map(r => `| ${r.gap.replace(/\|/g, '/')} | ${r.count} | ${r.kinds.join(', ')} | ${r.industries.join(', ') || '-'} | ${r.sources.join(', ')} |`).join('\n')}` : 'No gaps: every stage found a catalogue specialist.'}\n`;
  return { engagements: entries.length, gaps: gaps.length, rows, markdown };
}
