#!/usr/bin/env node
// Outcome orchestrator evals: golden requests across industries, recorded engagements, a scorecard that gates releases.
//
//   node tools/outcome-evals.mjs prompt <case>            brief for a host AI recording a run (no scoring details)
//   node tools/outcome-evals.mjs mcp <tool> '<json>'      call a tool on the public MCP (search_library, find_specialist, get_item ...)
//   node tools/outcome-evals.mjs check <run.json>         replay one run through the outcome tools; prints refusals and warnings only
//   node tools/outcome-evals.mjs score                    release gate: every run replays, every control is refused, no case regresses,
//                                                         and the committed scorecard is current
//   node tools/outcome-evals.mjs score --write [--allow-drop "<reason>"]   write scorecard.json and SCORECARD.md
//   node tools/outcome-evals.mjs stage-check <outcome-folder> <stage>      deterministic checks of one stage's outputs
//   node tools/outcome-evals.mjs stage-prompt <outcome-folder> <stage> [--case <id>]   brief for a host AI grading that stage
//   node tools/outcome-evals.mjs grades                   validate recorded stage grades (evals/graded/<case>/<stage>.json)
//   node tools/outcome-evals.mjs gaps [<submissions-folder>]   catalogue-gap report from recorded runs (and pattern submissions)
//   node tools/outcome-evals.mjs pattern-review <submission.json> --reviewer "<name>" --decision APPROVED|REJECTED [--notes "..."] [--checked]
//   node tools/outcome-evals.mjs pattern-export <reviewed.json> --slug <slug> --name "<name>" --out <folder>   workflow draft, never published
//
// Two rubrics: v1 (rubric.mjs) gates releases; v2 (rubric-v2.mjs) is harder and reported so good and great plans can be told apart.
// Runs live in site/src/outcomes/evals/recorded/<case>.json: { case, host, recorded, method_version, brief, research, plan }.
// No model is called here. Runs are recorded by a host AI (Claude Code, Codex) following the prompt, the same way an owner's AI would.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASES, INDUSTRIES } from '../site/src/outcomes/evals/cases.mjs';
import { EXPECT } from '../site/src/outcomes/evals/expect.mjs';
import { CASE_TOLERANCE, PASS_SCORE, RUBRIC_VERSION, replay, runControls, scoreRun } from '../site/src/outcomes/evals/rubric.mjs';
import { localResolver } from '../site/src/outcomes/evals/local-catalogue.mjs';
import { RUBRIC_V2_VERSION, scoreRunV2, spread } from '../site/src/outcomes/evals/rubric-v2.mjs';
import { checkStageOutputs, stageGradePrompt, validateGrade } from '../site/src/outcomes/evals/stage-grading.mjs';
import { REVIEW_CHECKLIST, catalogueGapReport, reviewSubmission, workflowDraft } from '../site/src/outcomes/patterns.mjs';
import { METHOD_VERSION, methodMarkdown } from '../site/src/outcomes/method.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVALS = path.join(ROOT, 'site/src/outcomes/evals');
const RUNS = path.join(EVALS, 'recorded');
const CARD = path.join(EVALS, 'scorecard.json');
const CARD_MD = path.join(EVALS, 'SCORECARD.md');
const GRADED = path.join(EVALS, 'graded');
const MCP = 'https://useaiblocks.com/mcp';
const [cmd, ...rest] = process.argv.slice(2);
const flag = k => rest.includes(`--${k}`);
const opt = k => { const i = rest.indexOf(`--${k}`); return i < 0 ? undefined : rest[i + 1]; };
const caseById = id => CASES.find(c => c.id === id) ?? (() => { throw Error(`Unknown case ${id}. Cases: ${CASES.map(c => c.id).join(', ')}`); })();
let resolver;
const resolve = refs => (resolver ??= localResolver())(refs);

function prompt(c) {
  return `You are the owner's AI, running the AI Blocks outcome orchestrator for this request. Record one engagement up to the point the owner approves the plan.

## The owner's request

"${c.request}"

## The owner's answers to your brief questions

${c.owner}

Use only these answers for the brief. Anything they do not answer goes in unknowns; never invent a fact, number or tool.

## Method

${methodMarkdown()}
## How to do it here

1. Brief: fill every field of the brief frame from the owner's answers (see the worked example's shape with \`node tools/outcome-evals.mjs mcp start_outcome '{"request":"x","include_example":true}'\`).
2. Research: search our catalogue with \`node tools/outcome-evals.mjs mcp search_library '{"query":"...","type":"workflow"}'\`, \`mcp find_specialist '{"task":"..."}'\` and \`mcp get_item '{"id":"..."}'\`. Search the web for how practitioners in this industry do this job now; record real https links with dates. Never put the owner's private details in a search.
3. Compose the plan from catalogue specialists and items only (ids exactly as search returns them). Where no specialist fits, use {"gap":"..."}.
4. Save ${path.relative(ROOT, path.join(RUNS, `${c.id}.json`)).replace(/\\/g, '/')} as {"case":"${c.id}","host":"<your model and app>","recorded":"<YYYY-MM-DD>","method_version":${METHOD_VERSION},"brief":{...},"research":{...},"plan":{...}}.
5. Check it with \`node tools/outcome-evals.mjs check <that file>\` and fix every refusal until it reaches AWAITING_OWNER or READY. Read the warnings and fix the ones a careful expert would.
`;
}

async function mcp(tool, args) {
  const res = await fetch(MCP, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: args } }) });
  const body = await res.json();
  if (body.error) throw Error(body.error.message);
  const r = body.result;
  return r.structuredContent ?? r.content?.map(x => x.text).join('\n');
}

const readRun = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const runFile = id => path.join(RUNS, `${id}.json`);

async function evaluate(c) {
  const file = runFile(c.id);
  if (!fs.existsSync(file)) return { id: c.id, industry: c.industry, status: 'MISSING' };
  const run = readRun(file);
  const options = { resolve, today: run.recorded };
  const base = { id: c.id, industry: c.industry, host: run.host, recorded: run.recorded, stale: run.method_version !== METHOD_VERSION };
  let replayed;
  try { replayed = await replay(c, run, options); }
  catch (error) { return { ...base, status: 'REFUSED', reason: String(error.message).slice(0, 400) }; }
  const { brief, research, plan } = replayed.engagement;
  const scored = scoreRun(EXPECT[c.id], { brief, research, plan });
  const v2 = scoreRunV2(EXPECT[c.id], { brief, research, plan }, { today: run.recorded });
  const controls = await runControls(c, run, options);
  const loose = controls.filter(x => x.result === 'ACCEPTED' || x.result === 'WRONG_REASON');
  return { ...base, status: loose.length ? 'RULE_LOOSENED' : scored.pass ? 'PASS' : 'LOW', score: scored.score, score_v2: v2.score, stages: plan.stages.length, warnings: replayed.warnings.length, controls, items: scored.items, items_v2: v2.items };
}

const mean = xs => xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length * 10) / 10 : null;

const V2_GROUPS = ['checks', 'hypotheses', 'research', 'owner', 'measurement', 'evidence', 'specialists'];
const groupTotal = (items, g) => items.filter(i => i.group === g).reduce((t, i) => t + i.got, 0);

function card(results, grades) {
  const scored = results.filter(r => typeof r.score === 'number');
  const v2 = results.filter(r => typeof r.score_v2 === 'number');
  return {
    rubric_version: RUBRIC_VERSION, method_version: METHOD_VERSION, pass_score: PASS_SCORE,
    average: mean(scored.map(r => r.score)),
    industries: Object.fromEntries(INDUSTRIES.map(i => [i, mean(scored.filter(r => r.industry === i).map(r => r.score))])),
    cases: results.map(({ items, items_v2, controls, ...r }) => ({ ...r, controls_refused: controls?.filter(x => x.result === 'REFUSED').length, controls_run: controls?.filter(x => x.result !== 'SKIPPED').length })),
    rubric_v2: {
      version: RUBRIC_V2_VERSION, gates_release: false, ...spread(v2.map(r => r.score_v2)),
      industries: Object.fromEntries(INDUSTRIES.map(i => [i, mean(v2.filter(r => r.industry === i).map(r => r.score_v2))])),
      // Group points vary for runs without a diagnosis or a metric, so each group shows its average share of the points.
      groups: Object.fromEntries(V2_GROUPS.map(g => [g, mean(v2.map(r => groupTotal(r.items_v2, g)))])),
    },
    stage_grades: grades,
  };
}

function cardMarkdown(c, results) {
  const groups = ['brief', 'research', 'plan', 'safety', 'owner'];
  const byGroup = r => groups.map(g => { const it = r.items?.filter(i => i.group === g) ?? []; return it.length ? `${Math.round(it.reduce((t, i) => t + i.got, 0))}/${it.reduce((t, i) => t + i.points, 0)}` : '-'; });
  const gaps = results.filter(r => r.items).flatMap(r => r.items.filter(i => i.got < i.points && i.note).map(i => `- **${r.id}** ${i.group}/${i.id} (${i.got}/${i.points}): ${i.note}`));
  const v = c.rubric_v2;
  const v2Gaps = results.filter(r => r.items_v2).flatMap(r => r.items_v2.filter(i => i.got < i.points * 0.5)).reduce((m, i) => m.set(`${i.group}/${i.id}`, (m.get(`${i.group}/${i.id}`) ?? 0) + 1), new Map());
  const POINTS = { checks: 20, hypotheses: 15, research: 15, owner: 15, measurement: 20, evidence: 10, specialists: 5 };
  const v2Section = `## Rubric v2 (harder, reported, not a release gate)\n\nAverage **${v.mean}**, lowest ${v.min}, highest ${v.max}, standard deviation ${v.sd}. v2 asks what a demanding reviewer would: checks written for this job rather than stock ones, hypotheses tested on the plan's data with figures that decide them, primary, dated and corroborated sources, the owner's minutes, and measurement with a checked baseline, a volume set in advance, a comparison and guardrail stop rules.\n\n` +
    `| Part | Points | Average |\n|---|---|---|\n${Object.entries(v.groups).map(([g, x]) => `| ${g} | ${POINTS[g]} | ${x} |`).join('\n')}\n\n` +
    `| Industry | v2 average |\n|---|---|\n${Object.entries(v.industries).map(([k, x]) => `| ${k} | ${x ?? '-'} |`).join('\n')}\n\n` +
    `Most common v2 shortfalls (runs scoring under half the item's points):\n\n${[...v2Gaps].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10).map(([k, n]) => `- ${k}: ${n} of ${results.length} runs`).join('\n') || '- None.'}\n\n` +
    `Stage grades recorded by host AIs: ${c.stage_grades.recorded}${c.stage_grades.recorded ? ` (average ${c.stage_grades.average})` : '. The harness is ready (stage-check, stage-prompt, grades); no stage work has been recorded and graded yet.'}\n\n`;
  return `# Outcome orchestrator scorecard\n\nRubric v${c.rubric_version}, method v${c.method_version}. Pass mark ${c.pass_score}. Average **${c.average ?? '-'}** over ${c.cases.filter(x => typeof x.score === 'number').length} of ${c.cases.length} cases. Rubric v2 average **${v.mean}** (range ${v.min} to ${v.max}).\n\n` +
    `Generated by \`node tools/outcome-evals.mjs score --write\`. Each run was recorded by a host AI from the owner's words and answers only, then replayed through the public outcome tools and scored. The score checks what an expert would insist on (owner's answers carried into the brief, real sources, the right stages and specialists, checks, live-action safety, owner effort). It does not grade the writing or the work the stages would produce.\n\n` +
    `| Industry | Average |\n|---|---|\n${Object.entries(c.industries).map(([k, v]) => `| ${k} | ${v ?? '-'} |`).join('\n')}\n\n` +
    `| Case | Industry | Status | Score | v2 | Brief | Research | Plan | Safety | Owner | Controls refused | Host |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n` +
    results.map((r, i) => { const x = c.cases[i]; return `| ${r.id} | ${r.industry} | ${r.status}${r.stale ? ' (older method)' : ''} | ${r.score ?? '-'} | ${r.score_v2 ?? '-'} | ${byGroup(r).join(' | ')} | ${x.controls_run ? `${x.controls_refused}/${x.controls_run}` : '-'} | ${r.host ?? '-'} |`; }).join('\n') +
    `\n\n${v2Section}` +
    `${c.allowed_drop ? `Accepted score drop: ${c.allowed_drop}\n\n` : ''}## Where runs lost points (v1)\n\n${gaps.join('\n') || 'None.'}\n` +
    `${results.some(r => r.reason) ? `\n## Refused runs\n\n${results.filter(r => r.reason).map(r => `- **${r.id}**: ${r.reason}`).join('\n')}\n` : ''}`;
}

async function score() {
  const results = [];
  for (const c of CASES) results.push(await evaluate(c));
  const grades = gradeSummary();
  const next = card(results, { recorded: grades.valid.length, average: mean(grades.valid.map(g => g.score)), invalid: grades.invalid.length });
  const prev = fs.existsSync(CARD) ? JSON.parse(fs.readFileSync(CARD, 'utf8')) : null;
  const problems = [];
  for (const r of results) {
    if (r.status === 'MISSING') problems.push(`${r.id}: no recorded run. Record one with: node tools/outcome-evals.mjs prompt ${r.id}`);
    if (r.status === 'REFUSED') problems.push(`${r.id}: the outcome tools now refuse this run: ${r.reason}`);
    if (r.status === 'RULE_LOOSENED') problems.push(`${r.id}: a broken copy was accepted: ${r.controls.filter(x => x.result !== 'REFUSED' && x.result !== 'SKIPPED').map(x => `${x.id} (${x.result}${x.note ? `: ${x.note}` : ''})`).join('; ')}`);
  }
  const allowed = opt('allow-drop');
  if (prev && prev.rubric_version === next.rubric_version) {
    for (const r of next.cases) {
      const before = prev.cases.find(x => x.id === r.id)?.score;
      if (typeof before === 'number' && typeof r.score === 'number' && r.score < before - CASE_TOLERANCE) problems.push(`${r.id}: score fell from ${before} to ${r.score}.`);
    }
    if (typeof prev.average === 'number' && typeof next.average === 'number' && next.average < prev.average && !allowed) problems.push(`Average fell from ${prev.average} to ${next.average}.`);
  }
  if (grades.invalid.length) problems.push(...grades.invalid.map(g => `Stage grade ${g.file}: ${g.problems.join(' ')}`));
  // v2 is reported, not gated: a fall is shown so it gets looked at, but it does not stop a release.
  if (prev?.rubric_v2?.version === next.rubric_v2.version) {
    const fell = next.cases.filter(r => { const b = prev.cases.find(x => x.id === r.id)?.score_v2; return typeof b === 'number' && typeof r.score_v2 === 'number' && r.score_v2 < b - CASE_TOLERANCE; });
    if (fell.length) console.error(`Rubric v2 fell by more than ${CASE_TOLERANCE} points (not blocking): ${fell.map(r => `${r.id} ${prev.cases.find(x => x.id === r.id).score_v2} to ${r.score_v2}`).join('; ')}`);
  }
  const regressions = problems.filter(p => /fell from/.test(p));
  const hard = problems.filter(p => !/fell from/.test(p));
  if (allowed && regressions.length) next.allowed_drop = allowed;
  const blocking = [...hard, ...(allowed ? [] : regressions)];
  const summary = { average: next.average, industries: next.industries, pass: next.cases.filter(x => x.status === 'PASS').length, cases: next.cases.length, rubric_v2: { mean: next.rubric_v2.mean, min: next.rubric_v2.min, max: next.rubric_v2.max, sd: next.rubric_v2.sd }, stage_grades: next.stage_grades.recorded };

  if (flag('write')) {
    if (blocking.length) { console.error(blocking.join('\n')); console.error('\nScorecard not written.'); process.exit(1); }
    fs.writeFileSync(CARD, JSON.stringify(next, null, 2) + '\n');
    fs.writeFileSync(CARD_MD, cardMarkdown(next, results));
    console.log(JSON.stringify({ written: path.relative(ROOT, CARD_MD), ...summary }, null, 2));
    return;
  }
  const stale = !prev || JSON.stringify(prev) !== JSON.stringify(next);
  if (stale && !blocking.length) blocking.push('The committed scorecard is out of date. Run: node tools/outcome-evals.mjs score --write');
  if (blocking.length) { console.error(blocking.join('\n')); process.exit(1); }
  console.log(JSON.stringify({ scorecard: 'current', ...summary }, null, 2));
}

// An outcome folder as the host keeps it: engagement.json plus every text file, by path relative to the folder.
function readFolder(dir) {
  const root = path.resolve(dir);
  const engagement = JSON.parse(fs.readFileSync(path.join(root, 'engagement.json'), 'utf8'));
  const files = {};
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (fs.statSync(f).size < 2_000_000) files[path.relative(root, f).replace(/\\/g, '/')] = fs.readFileSync(f, 'utf8'); } };
  walk(root);
  return { engagement, files };
}

// Recorded stage grades: evals/graded/<case>/<stage>.json. When evals/stage-runs/<case>/ holds the graded work, each
// grade's sha256s are checked against it, so a grade goes stale when the work changes.
function gradeSummary() {
  const valid = [], invalid = [];
  if (!fs.existsSync(GRADED)) return { valid, invalid };
  for (const c of fs.readdirSync(GRADED, { withFileTypes: true }).filter(d => d.isDirectory())) {
    const work = path.join(EVALS, 'stage-runs', c.name);
    const files = fs.existsSync(path.join(work, 'engagement.json')) ? readFolder(work).files : undefined;
    for (const f of fs.readdirSync(path.join(GRADED, c.name)).filter(f => f.endsWith('.json'))) {
      const file = path.relative(ROOT, path.join(GRADED, c.name, f)).replace(/\\/g, '/');
      let g; try { g = readRun(path.join(GRADED, c.name, f)); } catch { invalid.push({ file, problems: ['not valid JSON'] }); continue; }
      const r = validateGrade(g, { files });
      (r.ok ? valid : invalid).push({ file, ...r });
    }
  }
  return { valid, invalid };
}

function gaps(folder) {
  const entries = CASES.filter(c => fs.existsSync(runFile(c.id))).map(c => { const run = readRun(runFile(c.id)); return { source: c.id, industry: c.industry, stages: run.plan.stages.map(st => ({ kind: st.kind, gap: st.owner?.gap })) }; });
  if (folder) for (const f of fs.readdirSync(folder).filter(f => f.endsWith('.json'))) { const sub = readRun(path.join(folder, f)); if (sub.pattern) entries.push({ source: sub.id ?? f, stages: sub.pattern.gaps }); }
  return catalogueGapReport(entries);
}

async function check(file) {
  const run = readRun(path.resolve(file));
  const c = caseById(run.case);
  const r = await replay(c, run, { resolve, today: run.recorded ?? new Date().toISOString().slice(0, 10) });
  console.log(JSON.stringify({ state: r.state, stages: r.engagement.plan.stages.length, warnings: r.warnings }, null, 2));
}

try {
  if (cmd === 'prompt') console.log(prompt(caseById(rest[0])));
  else if (cmd === 'mcp') { const out = await mcp(rest[0], JSON.parse(rest[1] ?? '{}')); console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 2)); }
  else if (cmd === 'check') await check(rest[0]);
  else if (cmd === 'score') await score();
  else if (cmd === 'stage-check') { const { engagement, files } = readFolder(rest[0]); const r = checkStageOutputs(engagement, rest[1], files); console.log(JSON.stringify(r, null, 2)); if (!r.pass) process.exit(1); }
  else if (cmd === 'stage-prompt') { const { engagement, files } = readFolder(rest[0]); console.log(stageGradePrompt(engagement, rest[1], files, { caseId: opt('case') ?? null })); }
  else if (cmd === 'grades') { const g = gradeSummary(); console.log(JSON.stringify({ recorded: g.valid.length, average: mean(g.valid.map(x => x.score)), grades: g.valid.map(x => ({ file: x.file, score: x.score })), invalid: g.invalid }, null, 2)); if (g.invalid.length) process.exit(1); }
  else if (cmd === 'gaps') console.log(gaps(rest[0]).markdown);
  else if (cmd === 'pattern-review') {
    const file = path.resolve(rest[0]);
    const checklist = Object.fromEntries(Object.keys(REVIEW_CHECKLIST).map(k => [k, flag('checked')]));
    if (opt('decision') === 'APPROVED' && !flag('checked')) { console.error(`Before approving, confirm each of these yourself, then add --checked:\n${Object.values(REVIEW_CHECKLIST).map(x => `- ${x}`).join('\n')}`); process.exit(1); }
    const reviewed = await reviewSubmission(readRun(file), { reviewer: opt('reviewer'), reviewer_kind: 'human', decision: opt('decision'), notes: opt('notes'), at: new Date().toISOString().slice(0, 10), checklist });
    const out = file.replace(/\.json$/, '.reviewed.json'); fs.writeFileSync(out, JSON.stringify(reviewed, null, 2) + '\n'); console.log(`${reviewed.status}: wrote ${out}`);
  }
  else if (cmd === 'pattern-export') {
    const draft = workflowDraft(readRun(path.resolve(rest[0])), { slug: opt('slug'), name: opt('name') });
    const out = path.resolve(opt('out') ?? '.', draft.path);
    if (out.startsWith(path.join(ROOT, 'catalogue-items'))) { console.error('Write drafts outside catalogue-items/. A person moves a finished draft in by hand.'); process.exit(1); }
    fs.mkdirSync(out, { recursive: true }); for (const [f, text] of Object.entries(draft.files)) fs.writeFileSync(path.join(out, f), text);
    console.log(`Draft written to ${out}. Not published: ${draft.next}`);
  }
  else { console.error('Use: prompt <case> | mcp <tool> <json> | check <run.json> | score [--write] [--allow-drop "<reason>"] | stage-check <folder> <stage> | stage-prompt <folder> <stage> [--case <id>] | grades | gaps [<folder>] | pattern-review <file> --reviewer <name> --decision APPROVED|REJECTED [--checked] | pattern-export <file> --slug <slug> --name <name> --out <folder>'); process.exit(2); }
} catch (error) { console.error(error.message); process.exit(1); }
