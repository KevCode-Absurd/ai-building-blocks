#!/usr/bin/env node
// Outcome orchestrator evals: golden requests across industries, recorded engagements, a scorecard that gates releases.
//
//   node tools/outcome-evals.mjs prompt <case>            brief for a host AI recording a run (no scoring details)
//   node tools/outcome-evals.mjs mcp <tool> '<json>'      call a tool on the public MCP (search_library, find_specialist, get_item ...)
//   node tools/outcome-evals.mjs check <run.json>         replay one run through the outcome tools; prints refusals and warnings only
//   node tools/outcome-evals.mjs score                    release gate: every run replays, every control is refused, no case regresses,
//                                                         and the committed scorecard is current
//   node tools/outcome-evals.mjs score --write [--allow-drop "<reason>"]   write scorecard.json and SCORECARD.md
//
// Runs live in site/src/outcomes/evals/recorded/<case>.json: { case, host, recorded, method_version, brief, research, plan }.
// No model is called here. Runs are recorded by a host AI (Claude Code, Codex) following the prompt, the same way an owner's AI would.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASES, INDUSTRIES } from '../site/src/outcomes/evals/cases.mjs';
import { EXPECT } from '../site/src/outcomes/evals/expect.mjs';
import { CASE_TOLERANCE, PASS_SCORE, RUBRIC_VERSION, replay, runControls, scoreRun } from '../site/src/outcomes/evals/rubric.mjs';
import { localResolver } from '../site/src/outcomes/evals/local-catalogue.mjs';
import { METHOD_VERSION, methodMarkdown } from '../site/src/outcomes/method.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EVALS = path.join(ROOT, 'site/src/outcomes/evals');
const RUNS = path.join(EVALS, 'recorded');
const CARD = path.join(EVALS, 'scorecard.json');
const CARD_MD = path.join(EVALS, 'SCORECARD.md');
const MCP = 'https://useaiblocks.com/mcp';
const [cmd, ...rest] = process.argv.slice(2);
const flag = k => rest.includes(`--${k}`);
const opt = k => { const i = rest.indexOf(`--${k}`); return i < 0 ? undefined : rest[i + 1]; };
const caseById = id => CASES.find(c => c.id === id) ?? (() => { throw Error(`Unknown case ${id}. Cases: ${CASES.map(c => c.id).join(', ')}`); })();
const resolve = localResolver();

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
  const controls = await runControls(c, run, options);
  const loose = controls.filter(x => x.result === 'ACCEPTED' || x.result === 'WRONG_REASON');
  return { ...base, status: loose.length ? 'RULE_LOOSENED' : scored.pass ? 'PASS' : 'LOW', score: scored.score, stages: plan.stages.length, warnings: replayed.warnings.length, controls, items: scored.items };
}

const mean = xs => xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length * 10) / 10 : null;

function card(results) {
  const scored = results.filter(r => typeof r.score === 'number');
  return {
    rubric_version: RUBRIC_VERSION, method_version: METHOD_VERSION, pass_score: PASS_SCORE,
    average: mean(scored.map(r => r.score)),
    industries: Object.fromEntries(INDUSTRIES.map(i => [i, mean(scored.filter(r => r.industry === i).map(r => r.score))])),
    cases: results.map(({ items, controls, ...r }) => ({ ...r, controls_refused: controls?.filter(x => x.result === 'REFUSED').length, controls_run: controls?.filter(x => x.result !== 'SKIPPED').length })),
  };
}

function cardMarkdown(c, results) {
  const groups = ['brief', 'research', 'plan', 'safety', 'owner'];
  const byGroup = r => groups.map(g => { const it = r.items?.filter(i => i.group === g) ?? []; return it.length ? `${Math.round(it.reduce((t, i) => t + i.got, 0))}/${it.reduce((t, i) => t + i.points, 0)}` : '-'; });
  const gaps = results.filter(r => r.items).flatMap(r => r.items.filter(i => i.got < i.points && i.note).map(i => `- **${r.id}** ${i.group}/${i.id} (${i.got}/${i.points}): ${i.note}`));
  return `# Outcome orchestrator scorecard\n\nRubric v${c.rubric_version}, method v${c.method_version}. Pass mark ${c.pass_score}. Average **${c.average ?? '-'}** over ${c.cases.filter(x => typeof x.score === 'number').length} of ${c.cases.length} cases.\n\n` +
    `Generated by \`node tools/outcome-evals.mjs score --write\`. Each run was recorded by a host AI from the owner's words and answers only, then replayed through the public outcome tools and scored. The score checks what an expert would insist on (owner's answers carried into the brief, real sources, the right stages and specialists, checks, live-action safety, owner effort). It does not grade the writing or the work the stages would produce.\n\n` +
    `| Industry | Average |\n|---|---|\n${Object.entries(c.industries).map(([k, v]) => `| ${k} | ${v ?? '-'} |`).join('\n')}\n\n` +
    `| Case | Industry | Status | Score | Brief | Research | Plan | Safety | Owner | Controls refused | Host |\n|---|---|---|---|---|---|---|---|---|---|---|\n` +
    results.map((r, i) => { const x = c.cases[i]; return `| ${r.id} | ${r.industry} | ${r.status}${r.stale ? ' (older method)' : ''} | ${r.score ?? '-'} | ${byGroup(r).join(' | ')} | ${x.controls_run ? `${x.controls_refused}/${x.controls_run}` : '-'} | ${r.host ?? '-'} |`; }).join('\n') +
    `${c.allowed_drop ? `\n\nAccepted score drop: ${c.allowed_drop}` : ''}\n\n## Where runs lost points\n\n${gaps.join('\n') || 'None.'}\n` +
    `${results.some(r => r.reason) ? `\n## Refused runs\n\n${results.filter(r => r.reason).map(r => `- **${r.id}**: ${r.reason}`).join('\n')}\n` : ''}`;
}

async function score() {
  const results = [];
  for (const c of CASES) results.push(await evaluate(c));
  const next = card(results);
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
  const regressions = problems.filter(p => /fell from/.test(p));
  const hard = problems.filter(p => !/fell from/.test(p));
  if (allowed && regressions.length) next.allowed_drop = allowed;
  const blocking = [...hard, ...(allowed ? [] : regressions)];
  const summary = { average: next.average, industries: next.industries, pass: next.cases.filter(x => x.status === 'PASS').length, cases: next.cases.length };

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
  else { console.error('Use: prompt <case> | mcp <tool> <json> | check <run.json> | score [--write] [--allow-drop "<reason>"]'); process.exit(2); }
} catch (error) { console.error(error.message); process.exit(1); }
