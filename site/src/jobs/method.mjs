import { executionQualityMethod } from './execution-quality.mjs';

/** How a job with one lead runs. Sent in start_job for single mode; there is no record keeping to learn. */
export const SINGLE_LEAD_METHOD = [
  'One lead does this job. You are the orchestrator.',
  '1 Ask the `questions` in one short message. Each has a default, so "you decide" is a full answer.',
  '2 Load the lead with `next_action.tool`. Hand it the request, the answers and the brief. Its toolbox comes with it: it opens what fits and does not search the library.',
  '3 The lead grounds the job in the client\'s real site, files or data. Then it makes about three real candidates of the part that decides the outcome, and builds the best one in full.',
  '4 A fresh reviewer who has not seen the drafts checks the work against `rubric`. Use a new sub-agent if you can start one. If not, do a separate pass and label it SAME-CONTEXT. Every gate must pass.',
  '5 You check the finished work against the request. Hand over the work first, opened by 3 to 5 lines: what this is, the main decision and why, what to check before use.',
  'Nothing here permits sending, spending, publishing or deleting. Those stop for the owner.',
].join('\n');

const isolationLine = profile => profile === 'parallel'
  ? 'Run each seat as its own sub-agent, so no seat sees another\'s draft. Give the reviewer a fresh one.'
  : profile === 'pack'
    ? 'Follow TEAM-MODE.md. Write each seat\'s result to its own file before the next seat starts. One chat cannot give an independent review: label it SAME_CONTEXT.'
    : 'Run the seats one at a time and save each draft before starting the next. One chat cannot give an independent review: label it SAME_CONTEXT.';

/**
 * The team method the orchestrator reads at the start of a team job. Kept under 900 words: every sentence changes what
 * the AI does. Field-by-field record detail lives in jobRecords() and is opened only when a check fails.
 */
export function jobMethod(profile = 'sequential', tier = 'standard') {
  const council = tier === 'quick'
    ? 'Quick team: each maker\'s candidate is kept, the lead chooses, and the choice, the other options and any objection are recorded.'
    : 'Helpers who did not write a candidate each criticise it with a quote and rank the others\' work, never their own. The red team attacks the favourite. The lead settles it and records the choice, the strongest objection and what to take from the losers.';
  const loops = tier === 'quick' ? 'A quick team gets no revision round.' : tier === 'deep' ? 'A deep team gets up to two revision rounds and needs two different reviewers.' : 'You get one revision round.';
  return `# How to run this team job

One lead owns the deliverable. Helpers work for the lead. You, the orchestrator, set the job up and check it at the end. AI Blocks runs no model and takes no action. It only checks the records you send.

## Who does what

- **Orchestrator (you, the coordinator seat).** Understand the request. Ask the \`questions\` in one message; each has a default, so "you decide" is a full answer. Write the spec sheet. Hand over to the lead. At the end, check the finished work against the spec. You never make the work.
- **Team lead (\`team.lead\`).** Owns the deliverable from first draft to hand-over. Decides which helper does what, briefs them, joins their work and checks it before review.
- **Helpers (\`team.helpers\`).** Each has one job, written beside its name. A maker never reviews. A reviewer never makes.
- **Fresh reviewer (the judge).** Sees only the request, the spec sheet, the rubric and the finished work. Never the drafts or the debate.

Each seat arrives with its toolbox, \`focus_methods\` first. Open what fits the task and leave the rest. Do not search the library during the job.

${isolationLine(profile)}

## The steps

Send one \`advance_job\` event per step. Send \`state\` and \`state_digest\` exactly as last returned; save them, and every returned file, in \`jobs/<job_id>/\`.

1. **\`scope\`: the spec sheet.** Fill \`templates/JOB-CARD.json\`. Give the job in one sentence: who must do what after seeing this. List the deliverables with counts, in the client's words. Add 5 to 7 acceptance checks the client would ask, the hard rules, and what you assumed. Keep \`request_verbatim\` unchanged. Ground only what this job needs, as the brief says. If the job changes or reviews existing work, add \`work_context\`: what you inspected, when, and what must stay. Check the suggested job type; if another fits, restart with \`job\` and \`job_reason\`.
2. **\`staff\`: the team.** Send \`accept_proposal: true\`, or your own seat list with a one-line reason for each change. The lead must be a maker: not you, not the reviewer.
3. **\`diverge\`: real candidates.** Each maker writes a first version alone, before seeing the others. Candidates must differ in substance: promise, proof, structure, buyer moment or offer. A new colour, crop or headline is not a new candidate. Each route names its \`methods\`, its \`references\` and a \`draft_receipt\`. More than one output also needs a \`spread\`.
4. **\`council\`: someone else chooses.** ${council}
5. **\`produce\`: build it in full.** The lead builds the chosen candidate with the helpers. Write the persuasion yourself: page lines are facts, not copy to paste. Use real names, prices and dates. Where a number is unknown, give a working figure and say what to check. The fact checker traces every claim. Report \`grounding\` here if the job card does not hold it. The lead signs off in \`lead_review\`.
6. **\`review\`: the fresh reviewer.** The judge scores each output against \`RUBRIC.json\`, with a quote for each score. It marks every gate PASS or FAIL and answers each critical acceptance check. A failed gate is never averaged away. ${loops}
7. **\`deliver\`: hand over.** You check the work against the spec and each acceptance check (\`coordinator_review\`). The work comes first, opened by 3 to 5 lines: what this is, the main decision and why, what to check before use. No process sections. Never point the client at working files. If a check failed, say so and deliver with flags.
8. **\`feedback\`.** Ask what to keep, kill or make more like, and send it.

## Rules that hold all the way through

- No fact without a source. No invented numbers, quotes or reviews.
- Visual work: use the image or page tool the job needs and name it in \`host_capabilities.visual_renderers\`. If it is missing, stop and offer a labelled brief. A non-maker compares each rendered output with the brand references before review.
- A landing page means working source on the client's site, not a picture of one.
- Nothing here permits sending, spending, publishing or deleting. Those stop for the owner.

## If a record is refused

The error names the field and what it needs. Fix that field and send the same event again. For every record field (receipts, hashes, budgets, visual and landing-page reports), call \`get_job_templates\` and open \`JOB-RECORDS.md\`. Do not read it unless a check fails.
`;
}

/**
 * The record reference: every receipt, hash and report field the engine checks. get_job_templates returns it.
 * It is not part of start_job, so nobody reads it before a check fails.
 */
export function jobRecords(tier = 'standard') {
  return `# Job records: field reference

Open this only when advance_job refuses a record. The error names the field; find its section here. These are records the host reports. They do not prove human approval, and they grant no permission to send, spend, delete, publish or act in live systems.

## Every event
Send the complete \`state\` and \`state_digest\` from the latest result, unchanged, with each advance_job event. The digest detects edits; the server replays the whole history and checks phase order and structure. Keep artifacts local and send their SHA-256 hashes. Paths are safe relative paths.

## scope (ai-blocks-job-card/1)
- \`request_verbatim\` equals the original request. \`dials.depth.value\` equals the tier from start_job.
- \`brand_brain\` (the brand file) is required for page, ad, copy and email jobs only: status AVAILABLE or BUILT, business, path, sha256, read_by_coordinator: true, and a \`context_sources\` entry whose ref is the same path. Audits and analysis need a data snapshot instead (see grounding). Strategy, plan, code and document jobs need neither.
- \`grounding\`, when reported here: for page, ad, copy and email jobs \`brand_dna\` {path context/brand-dna.json, sha256, source, captured_at, method} and \`taste_brief\` {path context/taste-brief.md, sha256, brand_codes, references_admired (2), reference_avoid (1), defaults_to_avoid}; for audits and analysis \`data_snapshot\` {path under context/, sha256, source, captured_at}. Production is refused until grounding is reported at scope or produce.
- \`visual_spec\` for ad creative, image, video or designed landing-page work: references, fonts, colors, logo, formats, format_rationale and required_renderer. Mark unknown brand elements; do not invent them.
- Dials are silent defaults: state them in one line (\`dials_line\`). An ordinary request changes no saved default.

## staff (ai-blocks-team-plan/2)
\`proposal_id\` equals the proposal returned for this job card. Changed seats need \`amendments\` with reasons. The lead is not the coordinator and not a judge. A coordinator never makes the work; a maker never judges it. Each seat loads its \`focus_methods\` in full; the rest of its toolbox is an allowed palette.

## diverge (ai-blocks-routes/1, ai-blocks-spread/1)
- Each route: owner_seat, the 1 to 6 \`methods\` it uses ({slug, revision_sha256}, pinned in the owner's toolbox) and, for brand work, its \`references\`. Rival routes sharing more than 60% of either are refused.
- \`draft_receipt\` per route: context_id, path, sha256 of the exact text, isolation (ISOLATED or SAME_CONTEXT) and saw_other_proposals: false. Put the exact text in \`proposal_contents\` keyed by that path.
- Several outputs need a \`spread\` whose slot count equals the scoped deliverables. In patch mode a route is a ranked change-set to the live asset, each edit with its evidence.

## council (ai-blocks-council/1)
${tier === 'quick' ? 'Quick tier: separate proposals and a chair decision; record alternatives and dissent.' : 'Every route appears as a proposal with its owner and its frozen text. Each proposal gets at least two critiques from non-owners with a quoted flaw. Ballots rank other people\'s proposals; record Borda scores, the choice, the strongest dissent and the options that could still win. A winner with no real criticism is CONSENSUS_UNTESTED and needs a second red-team pass. Deep tier needs two red-team rounds.'}

## produce (ai-blocks-production/1)
- One artifact per scoped output: slot_id, kind, path, sha256, maker_seat, family, modality, the pinned \`items\` used, producer_note, \`claims\` linked to the evidence ledger, and \`checks\` with PASS, FAIL, NOT_RUN or BLOCKED.
- \`budget\`: allowance and measured tool calls. If the host does not expose the total, send used: null, usage_status: NOT_AVAILABLE and a reason. Explain use below 60% of the allowance.
- A staffed fact checker who did not make the work checks each claim. \`lead_review\`: by_seat (the lead), status PASS, notes.
- Visual work: \`visual_review\` or \`visual_delivery\` with the renderer named in visual_spec, a receipt, a non-maker reviewer and one item per output.

## review (ai-blocks-review/1)
One item per produced output: standard \`scores\`, \`craft_scores\` for RUBRIC.json craft.criteria, and \`gates\` with PASS, FAIL or NOT_RUN and evidence. \`critical_checks\` answers each critical acceptance check with a quote. \`loop\` is the current pass number. ${tier === 'quick' ? 'Quick tier has no revision loop.' : tier === 'deep' ? 'Deep tier allows two revision loops and needs two distinct judges.' : 'Standard tier allows one revision loop.'}

## deliver (ai-blocks-job-delivery/1)
\`coordinator_review\`: by_seat (the coordinator), job_match, notes and a rubric_checks entry per acceptance check. Include every delivery template file with its hash, and the exact reviewed artifact revisions. A failed review or final check needs \`flags\` and status DELIVERED_WITH_FLAGS.

## feedback
Items of {slot_id, action: keep, kill or more_like_this}. Feedback applies to one artifact unless scope: family and a reason are given.

${executionQualityMethod()}`;
}

export function deliveryTemplates({ hasSpread = true } = {}) {
  const templates = {
    'DELIVERY.md': '# Delivery\n\nAsked: [the real job]\nGot: [outputs and count]\nRecommendation: [best next move]\nDo first: [one action]\nOpen flags: [unknowns, failures, missing tools, defaults used]\n',
    'DECISIONS.md': '# Decisions\n\n## [Decision]\nConsidered: [distinct routes]\nChose: [route and evidence]\nWhy: [short reason]\nStrongest dissent: “[verbatim]”\nStill worth trying: [option, when it wins, full start_job args]\nCut: [idea and reason]\n',
    'EVIDENCE.md': '# Evidence\n\n## Confirmed\n[Claim, source and checker]\n\n## Inferred\n[Claim, basis and limitation]\n\n## Disputed\n[Claim and conflicting sources]\n\n## Unknown\n[What is missing and its effect]\n',
    'REVIEW.md': '# Review\n\n[Rubric scores and quotes]\n\n[What failed and changed]\n\n[Critical acceptance checks]\n\n[Independent or same-context review, remaining flags]\n\nAssurance: HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED\n',
    'TEAM.md': '# Team\n\n[General coordinator → task lead → experts, handoffs and reviewer]\n\n| Seat | Persona | Role | Pinned methods used |\n|---|---|---|---|\n',
    'run.json': '{"schema":"ai-blocks-job-delivery/1","files":[],"deliverables":[],"flags":[]}\n',
  };
  if (hasSpread) templates['SPREAD.md'] = '# Spread\n\n| Family | Count | Mix | Modality |\n|---|---:|---|---|\n\nWhy this mix: [reason]\nTry next: [alternative]\n';
  return Object.entries(templates).map(([path, content]) => ({ path: `delivery/${path}`, content }));
}
