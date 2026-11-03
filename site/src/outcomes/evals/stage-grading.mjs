// Grading the work a stage produces, not just the plan. Two layers:
//   1. Deterministic checks against the stage-output contract below: outputs exist at their declared paths and match
//      what the host reported, every check the plan names is evidenced, figures point to their evidence, diagnoses give
//      every hypothesis a verdict, and nothing promises results or leaks a key.
//   2. A prompt a host AI follows to grade the work 1 to 5 on five dimensions, saved as a grade file next to the
//      recorded runs. We never call a model: grades are recorded by host AIs (Claude Code, Codex), like the B3 runs,
//      and each grade pins the sha256 of every file it read, so a grade goes stale when the work changes.
import { createHash } from 'node:crypto';

export const STAGE_GRADE_SCHEMA = 'ai-blocks-stage-grade/1';
export const GRADE_DIMENSIONS = {
  goal_fit: 'Does the work do what the stage goal asks, for this business, at the size the brief allows?',
  evidence: 'Is every figure and finding traceable to a named file, export or source, with owner-reported numbers labelled as reports?',
  specificity: 'Is it written for this job (its data, systems, customers and limits), or could it be pasted into any business?',
  usefulness: 'Could the owner act on it today without asking what it means: clear next step, plain words, nothing missing?',
  honesty: 'Does it keep unknowns unknown, avoid promised results, and say plainly where a check failed or could not run?',
};

/** The contract every stage output follows. Shown to the specialist in its stage prompt and to graders. */
export const STAGE_OUTPUT_CONTRACT = `# Stage output contract

1. Write every output the stage declares, at its declared path inside outcomes/<id>/. JSON must parse; CSV has a header row and at least one data row; Markdown starts with a heading.
2. End the main Markdown output with a \`## Checks\` section, one line per check the plan names for this stage:
   \`- <check-id>: PASS|FAIL|NOT_RUN. <how it was checked> (evidence: <relative path or research source id>)\`
   The result must match what you report with advance_outcome, and the evidence path must exist.
3. Every sentence with a figure (a count, money, a percentage, a date range) points to where it came from:
   \`[evidence: <relative path>]\`, \`[source: <research source id>]\`, or \`(reported)\` for a number the owner gave that nothing has checked yet.
4. A diagnosis gives every hypothesis in hypotheses.md a verdict: \`<hypothesis-id>: SUPPORTED|REFUTED|UNKNOWN\`, with the evidence.
5. No promised results, and never a key or token.
`;

const sha = text => createHash('sha256').update(text).digest('hex');
const NUMBER_SENTENCE = /(\d[\d,.]*\s*(%|percent|k\b|m\b)|[£$€]\s?\d|\b\d{2,}[\d,.]*\b)/i;
const CITED = /\[(evidence|source):\s*[^\]]+\]|\(reported\)/i;
const CHECK_LINE = /^\s*[-*]\s*`?([a-z0-9][a-z0-9-]*)`?\s*:\s*(PASS|FAIL|NOT_RUN)\b(.*)$/gim;
const EVIDENCE_REF = /\((?:evidence|source):\s*([^)]+)\)/i;
const SECRET = /(sk-(ant-|proj-)?[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|xox[abprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
const PROMISE = /\bguarantee[ds]? (?:to |that |you\b|your |\d|(?:more |higher |better )?(?:results?|income|revenue|sales|roi|growth|rankings?|traffic|leads|profit))|\brisk[- ]free\b|\bwill (?:definitely|certainly) (?:increase|double|grow)\b/i;
const sentences = md => md.replace(/```[\s\S]*?```/g, '').split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => s && !/^#|^\|?\s*-{3}/.test(s));

function formatProblem(o, text) {
  if (!text.trim()) return 'is empty';
  if (o.format === 'json' || o.path.endsWith('.json')) { try { JSON.parse(text); } catch { return 'is not valid JSON'; } }
  if (o.format === 'csv' || o.path.endsWith('.csv')) { const lines = text.trim().split(/\r?\n/); if (lines.length < 2 || !lines[0].includes(',')) return 'needs a header row and at least one data row'; }
  if (o.format === 'markdown' || o.path.endsWith('.md')) { if (!/^\s*#/.test(text)) return 'should start with a heading'; }
  return null;
}

/**
 * Deterministic checks of one stage's outputs. files maps paths relative to outcomes/<id>/ to their text.
 * Returns each check with ok and a note, and a score out of 100 (share of checks passed).
 */
export function checkStageOutputs(engagement, stageId, files) {
  const def = engagement.plan?.stages.find(s => s.id === stageId) ?? (() => { throw Error(`Unknown stage ${stageId}.`); })();
  const state = engagement.stages.find(s => s.id === stageId);
  const reported = new Map((state?.outputs ?? []).map(o => [o.id, o]));
  const results = [];
  const add = (id, ok, note = '') => results.push({ id, ok, note });
  const outputs = def.outputs.map(o => ({ ...o, path: reported.get(o.id)?.path ?? o.path, sha256: reported.get(o.id)?.sha256 }));

  const missing = outputs.filter(o => !Object.hasOwn(files, o.path));
  add('outputs-exist', !missing.length, missing.length ? `Missing: ${missing.map(o => o.path).join(', ')}.` : `${outputs.length} outputs at their declared paths.`);
  const present = outputs.filter(o => Object.hasOwn(files, o.path));
  const changed = present.filter(o => o.sha256 && sha(files[o.path]) !== o.sha256);
  add('outputs-match-report', !changed.length, changed.length ? `Changed since the stage was reported complete: ${changed.map(o => o.path).join(', ')}.` : present.some(o => o.sha256) ? 'Files match the sha256 reported at completion.' : 'No sha256 was reported; nothing to compare.');
  const badFormat = present.map(o => [o, formatProblem(o, files[o.path])]).filter(([, p]) => p);
  add('formats', !badFormat.length, badFormat.map(([o, p]) => `${o.path} ${p}.`).join(' '));

  // Checks named in the plan are evidenced in the outputs, with results matching what the host reported.
  const markdown = present.filter(o => o.path.endsWith('.md')).map(o => files[o.path]).join('\n');
  const lines = new Map([...markdown.matchAll(CHECK_LINE)].map(m => [m[1], { result: m[2].toUpperCase(), rest: m[3] }]));
  const reportedChecks = new Map((state?.checks ?? []).map(c => [c.id, c.result]));
  const unevidenced = [], mismatched = [];
  const sourceIds = new Set((engagement.research?.sources ?? []).map(s => s.id));
  for (const c of def.checks) {
    const line = lines.get(c.id);
    const ref = line && EVIDENCE_REF.exec(line.rest)?.[1].trim().replace(/#.*$/, '');
    const refOk = ref && (Object.hasOwn(files, ref) || sourceIds.has(ref));
    if (!line || !refOk || (c.required && line.result !== 'PASS')) unevidenced.push(c.id);
    if (line && reportedChecks.has(c.id) && reportedChecks.get(c.id) !== line.result) mismatched.push(c.id);
  }
  add('checks-evidenced', !unevidenced.length, unevidenced.length ? `No Checks line with a result and an existing evidence path for: ${unevidenced.join(', ')}.` : `All ${def.checks.length} checks evidenced.`);
  add('checks-match-report', !mismatched.length, mismatched.length ? `The output and the completion report disagree on: ${mismatched.join(', ')}.` : '');

  // Figures point to evidence.
  const figures = sentences(markdown.replace(/^##\s*Checks[\s\S]*$/im, '')).filter(s => NUMBER_SENTENCE.test(s));
  const uncited = figures.filter(s => !CITED.test(s));
  const cited = figures.length ? 1 - uncited.length / figures.length : 1;
  add('figures-cited', cited >= 0.9, `${figures.length - uncited.length} of ${figures.length} sentences with figures cite their evidence.${uncited.length ? ` First uncited: "${uncited[0].slice(0, 120)}"` : ''}`);

  if (def.kind === 'diagnosis') {
    const all = present.map(o => files[o.path]).join('\n');
    const open = (engagement.plan.hypotheses ?? []).filter(h => !new RegExp(`${h.id}[^\\n]{0,80}\\b(SUPPORTED|REFUTED|UNKNOWN)\\b`).test(all));
    add('hypotheses-judged', !open.length, open.length ? `No verdict for: ${open.map(h => h.id).join(', ')}.` : '');
  }
  const everything = present.map(o => files[o.path]).join('\n');
  add('no-secrets', !SECRET.test(everything), SECRET.test(everything) ? 'An output contains what looks like a key or token.' : '');
  const promise = PROMISE.exec(everything);
  add('no-promises', !promise, promise ? `Promises a result: "${promise[0]}".` : '');

  const score = Math.round(results.filter(r => r.ok).length / results.length * 1000) / 10;
  return { stage_id: stageId, kind: def.kind, score, pass: results.every(r => r.ok), results };
}

/** The brief a host AI follows to grade one stage's work. The grader is never the session that did the work. */
export function stageGradePrompt(engagement, stageId, files, { caseId = null, saveTo } = {}) {
  const def = engagement.plan.stages.find(s => s.id === stageId) ?? (() => { throw Error(`Unknown stage ${stageId}.`); })();
  const outputs = def.outputs.filter(o => Object.hasOwn(files, o.path));
  const deterministic = checkStageOutputs(engagement, stageId, files);
  const shown = outputs.map(o => `### ${o.path} (sha256 ${sha(files[o.path])})\n\n\`\`\`\n${files[o.path].slice(0, 20000)}${files[o.path].length > 20000 ? '\n[cut at 20,000 characters]' : ''}\n\`\`\``).join('\n\n');
  const target = saveTo ?? `site/src/outcomes/evals/graded/${caseId ?? engagement.id}/${stageId}.json`;
  return `You are grading one stage of an AI Blocks outcome engagement. You did not do this work; judge it as a demanding expert reviewer would, from the files below only. Never invent evidence. Quote the line you base each score on.

## The job

Outcome: ${engagement.brief.outcome}
Deliverable: ${engagement.brief.deliverable}
Guardrails: ${engagement.brief.guardrails.join('; ') || 'none stated'}
Limits: ${engagement.brief.limits.join('; ') || 'none stated'}

## The stage

${def.name} (${def.kind}). Goal: ${def.goal}
Checks the plan names: ${def.checks.map(c => `${c.id}: ${c.name}`).join('; ')}

## Deterministic checks already run

${deterministic.results.map(r => `- ${r.id}: ${r.ok ? 'ok' : 'FAILED'}${r.note ? `. ${r.note}` : ''}`).join('\n')}

## The work

${shown || 'No output files were found.'}

## Grade it

Score each dimension 1 to 5 (1 unusable, 2 weak, 3 acceptable, 4 good, 5 an expert would sign it off unchanged):
${Object.entries(GRADE_DIMENSIONS).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Save ${target} as:
{"schema":"${STAGE_GRADE_SCHEMA}","case":${JSON.stringify(caseId)},"engagement_id":"${engagement.id}","stage_id":"${stageId}","grader":{"host":"<your app>","model":"<your model>","independent":true},"graded":"<YYYY-MM-DD>","outputs":[${outputs.map(o => `{"path":"${o.path}","sha256":"${sha(files[o.path])}"}`).join(',')}],"scores":{${Object.keys(GRADE_DIMENSIONS).map(k => `"${k}":<1-5>`).join(',')}},"reasons":{${Object.keys(GRADE_DIMENSIONS).map(k => `"${k}":"<why, quoting the line>"`).join(',')}},"verdict":"ACCEPT or REVISE","fix_first":"<the one change that would most improve it>"}

Then check it with: node tools/outcome-evals.mjs grades
`;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Check a recorded grade file. files (optional) maps output paths to current text, to detect stale grades. */
export function validateGrade(g, { files } = {}) {
  const problems = [];
  const need = (ok, msg) => { if (!ok) problems.push(msg); };
  need(g && typeof g === 'object', 'A grade must be an object.');
  if (!problems.length) {
    need(g.schema === STAGE_GRADE_SCHEMA, `schema must be ${STAGE_GRADE_SCHEMA}.`);
    need(typeof g.stage_id === 'string' && g.stage_id, 'stage_id is required.');
    need(typeof g.engagement_id === 'string' && g.engagement_id, 'engagement_id is required.');
    need(g.grader && typeof g.grader.host === 'string' && typeof g.grader.model === 'string' && g.grader.independent === true, 'grader needs host, model and independent: true (the grader did not do the work).');
    need(DATE.test(g.graded ?? ''), 'graded must be YYYY-MM-DD.');
    need(Array.isArray(g.outputs) && g.outputs.length && g.outputs.every(o => typeof o.path === 'string' && /^[a-f0-9]{64}$/.test(o.sha256 ?? '')), 'outputs must list each file graded with its sha256.');
    for (const k of Object.keys(GRADE_DIMENSIONS)) {
      need(Number.isInteger(g.scores?.[k]) && g.scores[k] >= 1 && g.scores[k] <= 5, `scores.${k} must be a whole number from 1 to 5.`);
      need(typeof g.reasons?.[k] === 'string' && g.reasons[k].trim().length >= 20, `reasons.${k} must say why, quoting the work.`);
    }
    need(['ACCEPT', 'REVISE'].includes(g.verdict), 'verdict must be ACCEPT or REVISE.');
    const extra = Object.keys(g.scores ?? {}).filter(k => !Object.hasOwn(GRADE_DIMENSIONS, k));
    need(!extra.length, `Unknown score dimensions: ${extra.join(', ')}.`);
    if (files && Array.isArray(g.outputs)) for (const o of g.outputs) need(Object.hasOwn(files, o.path) && sha(files[o.path]) === o.sha256, `${o.path} changed or is missing since it was graded; grade it again.`);
  }
  const total = problems.length ? null : Math.round(Object.values(g.scores).reduce((a, b) => a + b, 0) / (5 * Object.keys(GRADE_DIMENSIONS).length) * 1000) / 10;
  return { ok: !problems.length, problems, score: total };
}

export { sha as sha256Text };
