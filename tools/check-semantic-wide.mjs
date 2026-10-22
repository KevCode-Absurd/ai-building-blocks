import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { decodeCatalogue, finalize } from '../site/src/lib/composer-core.ts';
import { semanticWorkflow } from '../site/src/lib/composer-semantic.ts';
import { callModel, MODELS } from '../site/src/lib/composer-models.ts';
import { loadWorkflowEnv } from './lib/workflow-env.mjs';
import { WIDE_CASES } from './lib/workflow-wide-cases.mjs';
const label = process.argv[2] || 'semantic-wide-v1'; assert(/^[a-z0-9-]+$/.test(label));
const env = loadWorkflowEnv(process.cwd()), model = MODELS.find(m => m.id === 'gpt-6.1-sol'); assert(env.OPENAI_API_KEY, 'An existing server API key is required.');
const c = decodeCatalogue(JSON.parse(fs.readFileSync('site/public/data/blocks.json', 'utf8')));
const directory = path.join('runs', label); fs.mkdirSync(directory, { recursive: true });
const files = ['site/src/lib/composer-core.ts', 'site/src/lib/composer-semantic.ts', 'site/src/lib/composer-models.ts', 'tools/lib/workflow-wide-cases.mjs'];
const fingerprint = crypto.createHash('sha256').update(files.map(file => fs.readFileSync(file)).join('\n')).digest('hex');
const prior = fs.readdirSync(directory).filter(file => file.endsWith('.json')).map(file => JSON.parse(fs.readFileSync(path.join(directory, file))));
assert(prior.every(run => run.fingerprint === fingerprint), 'Use a fresh label after changing the planner.');
let spent = prior.reduce((sum, run) => sum + run.cost, 0), reserved = 0, position = 0;
const cap = Math.min(3, Number(env.TEST_ROUND_CAP_USD || 3));
async function runner(m, key, prompt, schema, maxOutput) {
  const bound = (Buffer.byteLength(JSON.stringify(prompt)) * m.input + maxOutput * m.output) / 1e6 * 1.25;
  if (spent + reserved + bound > cap) throw Error('Test budget cap reached');
  reserved += bound;
  try { const result = await callModel(m, key, prompt, schema, maxOutput); reserved -= bound; spent += result.cost; return result; }
  catch (error) { reserved -= bound; spent += error.billable?.cost ?? bound; throw error; }
}
const retryErrors = process.argv.includes('--retry-errors');
const pending = WIDE_CASES.filter(task => { const file = path.join(directory, task.id + '.json'); return !fs.existsSync(file) || retryErrors && JSON.parse(fs.readFileSync(file)).status === 'error'; });
await Promise.all(Array.from({ length: retryErrors ? 1 : 3 }, async () => {
  while (position < pending.length) {
    const task = pending[position++], before = spent; let output;
    try {
      const { result, candidates, intents } = await semanticWorkflow(c, task.goal, task.context || '', {}, model, env.OPENAI_API_KEY, runner);
      const plan = finalize(c, JSON.parse(result.text), 'ai', new Set(candidates.map(b => b.slug)));
      const text = JSON.stringify(plan), flags = [];
      if (!new RegExp(task.evidence, 'i').test(text)) flags.push('Requested subject or constraint missing');
      if (!/\.(md|csv|xlsx|docx|pptx|json|html|pdf|txt)\b/i.test(text)) flags.push('No named output file');
      if (task.excludes && plan.steps.some(s => new RegExp(task.excludes).test(s.slug))) flags.push('Excluded work selected');
      if (task.mixed) for (const pattern of task.id === 'combined' ? ['incident', 'reunion|packing'] : ['supplier', 'donor|thank', 'Spanish|español']) if (!new RegExp(pattern, 'i').test(text)) flags.push('Combined result missing: ' + pattern);
      output = { fingerprint, id: task.id, goal: task.goal, context: task.context || '', status: flags.length ? 'needs-review' : 'pass', flags, cost: result.cost, usage: result.usage, intents, candidates: candidates.map(b => b.slug), plan };
    } catch (error) { output = { fingerprint, id: task.id, goal: task.goal, status: 'error', error: error.message, cost: Math.max(0, spent - before) }; }
    const file = path.join(directory, task.id + '.json');
    if (fs.existsSync(file)) { const previous = JSON.parse(fs.readFileSync(file)); output.previousAttempts = [...(previous.previousAttempts || []), { status: previous.status, error: previous.error, cost: previous.cost }]; output.cost += previous.cost; }
    fs.writeFileSync(file, JSON.stringify(output, null, 2));
    console.log(JSON.stringify({ id: output.id, status: output.status, cost: output.cost, flags: output.flags, error: output.error }));
  }
}));
const runs = WIDE_CASES.map(task => JSON.parse(fs.readFileSync(path.join(directory, task.id + '.json'))));
const report = { checkedOn: new Date().toISOString(), label, fingerprint, model: model.id, requestCount: runs.length, passed: runs.filter(r => r.status === 'pass').length, issues: runs.filter(r => r.status !== 'pass').map(({ id, status, flags, error }) => ({ id, status, flags, error })), accountedCostUpperBoundUSD: spent, capUSD: cap, scope: 'Real interpretation and generation calls across thirty sampled requests. Checks establish structural validity, selected constraints, mixed-goal coverage and named outputs; they do not prove all possible requests or execute the resulting workflows. Failed attempts are preserved; unknown usage and earlier concurrent failure accounting use conservative upper bounds.', runs };
fs.writeFileSync('reports/' + label + '.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ requestCount: report.requestCount, passed: report.passed, issues: report.issues, actualCostUSD: spent }));
if (report.issues.length) process.exitCode = 1;
