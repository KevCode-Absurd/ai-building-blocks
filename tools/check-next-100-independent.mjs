// Independent source QA only. This checker never imports candidate code, builds
// the site, or writes catalogue sources. Its only output is the review report.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import YAML from '../site/node_modules/yaml/dist/index.js';

const outputPath = 'reports/next-100-independent-method-review.json';
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const marker = option('--marker') ?? 'next-100';
const categories = ['general', 'ecommerce', 'imported', 'orchestrators', 'agents'];
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const posix = file => file.replaceAll('\\', '/');
const typeGroups = YAML.parse(fs.readFileSync('catalogue-items/_types.yaml', 'utf8'));
const registry = new Set(Object.values(typeGroups).flatMap(group => Object.keys(group)));
const previous = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : {};
const previousItems = new Map((previous.items ?? []).map(item => [item.slug, item]));
const previousComponents = new Map((previous.components ?? []).map(component => [component.slug, component]));
const dataPath = option('--data') ?? 'tools/next-100-data.mjs';
let candidateData = { workflows: [], agents: [] };
if (fs.existsSync(dataPath)) {
  // Recipe literals/functions only, with no filesystem, tools, process, modules
  // or network exposed. Never import the author module or its generator.
  const text = fs.readFileSync(dataPath, 'utf8');
  if (/\bimport\s|\brequire\s*\(/.test(text)) throw Error('Recipe data is no longer a pure literal module; inspect before evaluating.');
  candidateData = JSON.parse(JSON.stringify(vm.runInNewContext(text.replace(/export const /g, 'const ') + '\n({workflows,agents})', Object.create(null), { timeout: 500 })));
}
const slugOf = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const specs = new Map([...candidateData.workflows, ...candidateData.agents].map(spec => [slugOf(spec.name), spec]));
const taxonomySource = fs.readFileSync('site/src/lib/data.ts', 'utf8').split('export const TASKS:')[1]?.split('const TASK_BY_ID')[0] ?? '';
const jobs = new Set([...taxonomySource.matchAll(/id:\s*"([^"]+)"/g)].map(match => match[1]));
const all = new Map();
const duplicateSlugs = [];
for (const category of categories) {
  for (const dir of fs.readdirSync(`catalogue-items/${category}`, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    const base = `catalogue-items/${category}/${dir.name}`;
    const itemPath = `${base}/item.yaml`;
    if (!fs.existsSync(itemPath)) continue;
    let item;
    try { item = YAML.parse(fs.readFileSync(itemPath, 'utf8')); }
    catch (error) { all.set(`unparseable:${base}`, { item: {}, base, itemPath, parseError: error.message }); continue; }
    if (all.has(item.slug)) duplicateSlugs.push({ slug: item.slug, paths: [all.get(item.slug).itemPath, itemPath] });
    all.set(item.slug, { item, base, itemPath, skillPath: `${base}/SKILL.md`, pagePath: `${base}/page.yaml` });
  }
}

const candidates = [...all.values()].filter(source =>
  ['workflow', 'agent'].includes(source.item.type) && String(source.item.generated_from ?? '').includes(marker));
const candidateIds = new Set(candidates.map(source => source.item.slug));
const findings = [];
const issue = (severity, code, item, message, evidence = undefined) => {
  const entry = { severity, code, slug: item, message, ...(evidence ? { evidence } : {}) };
  findings.push(entry);
  return entry;
};
const normal = (list, owner, direction) => {
  if (list != null && !Array.isArray(list)) {
    issue('error', 'port-list', owner, `${direction} must be an array.`);
    return [];
  }
  return (list ?? []).map((raw, index) => {
    const port = typeof raw === 'string' ? { type: raw, required: true } : { type: raw?.type, required: raw?.required !== false };
    if (typeof port.type !== 'string' || !port.type.trim()) issue('error', 'port-type', owner, `${direction}[${index}] lacks a nonempty type.`);
    else if (port.type !== port.type.trim()) issue('error', 'port-whitespace', owner, `${direction}[${index}] has type whitespace: ${port.type}.`);
    else if (!registry.has(port.type)) issue(candidateIds.has(owner) ? 'error' : 'review', 'unregistered-type', owner, `${direction}[${index}] type ${port.type} is absent from _types.yaml.`);
    return port;
  }).filter(port => typeof port.type === 'string' && port.type.trim());
};
const stopWords = new Set(['a', 'an', 'and', 'as', 'at', 'be', 'before', 'by', 'for', 'from', 'get', 'in', 'into', 'it', 'of', 'on', 'or', 'prepare', 'the', 'to', 'turn', 'with', 'your']);
const words = text => new Set(String(text ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(/\s+/).filter(word => word && !stopWords.has(word)));
const similarity = (left, right) => {
  const a = words(left), b = words(right);
  return a.size && b.size ? [...a].filter(word => b.has(word)).length / new Set([...a, ...b]).size : 0;
};
const leafIds = new Set();
const requirements = new Map();
const requiredFiles = new Map();
const visit = (id, stack = []) => {
  const source = all.get(id);
  if (!source) return;
  if (stack.includes(id)) { issue('error', 'dependency-cycle', stack[0] ?? id, [...stack, id].join(' -> ')); return; }
  if (!['workflow', 'agent'].includes(source.item.type)) leafIds.add(id);
  const deps = [...new Set([...(source.item.uses ?? []), ...(source.item.steps ?? []).map(step => step.uses)])];
  for (const dep of deps) {
    if (!all.has(dep)) issue('error', 'missing-dependency', stack[0] ?? id, `${id} uses missing ${dep}.`, source.itemPath);
    else visit(dep, [...stack, id]);
  }
};
for (const source of candidates) visit(source.item.slug);

const priorFiles = [
  'reports/2026-10-22-workflow-audit-finance.json',
  'reports/2026-10-22-people-learning-component-audit.json',
  'reports/2026-10-22-workflow-audit-operations.json',
];
const priorReviews = new Map();
for (const file of priorFiles) {
  if (!fs.existsSync(file)) continue;
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const entry of report.records ?? report.reviewed_components ?? []) {
    const id = entry.component ?? entry.slug;
    const sourcePath = entry.path ?? entry.reviewed_path;
    if (!sourcePath || !fs.existsSync(sourcePath) || sha(sourcePath) !== entry.sha256) continue;
    if (!priorReviews.has(id)) priorReviews.set(id, []);
    priorReviews.get(id).push({ report: file, path: sourcePath, sha256: entry.sha256, applicability_in_prior_batch: entry.applicability ?? entry.applicability_and_findings, limits_in_prior_batch: entry.prerequisites_and_limits });
  }
}

const components = [...leafIds].sort().map(id => {
  const source = all.get(id);
  if (!fs.existsSync(source.skillPath)) { issue('error', 'missing-skill', id, 'Component SKILL.md is missing.', source.skillPath); return { slug: id, missing: true }; }
  const text = fs.readFileSync(source.skillPath, 'utf8');
  const lines = text.split(/\r?\n/);
  const signals = [];
  const patterns = [
    ['private-house-config', /~\/[.](?:claude|codex)\/plugins\/config|practice-level CLAUDE\.md|house (?:PIA|style|format|template)/i],
    ['requires-related-skill', /\b(?:must|always|required|first|load|read)\b.{0,90}(?:SKILL\.md|(?:another|other|the) skill|brainstorming|india-market|officecli|xlsx-author)/i],
    ['interactive-participant', /\b(?:learner|student|participant|candidate)\b.{0,90}(?:answer|response|attempt|recall|interview)|require.{0,70}(?:recall|response)/i],
    ['native-tool', /\b(?:renderer|render|recalculate|LibreOffice|soffice|Poppler|python|Node\.js|officecli|browser|MCP|connector)\b/i],
    ['action-or-schedule', /\b(?:send|publish|submit|stage|post|delete|schedule|automate|cancel|sign|pay)\b/i],
    ['scope-exclusion', /(?:do not|don't|not designed|not intended|out of scope|when not to use|not use this|only supports)/i],
  ];
  for (const [kind, expression] of patterns) {
    const matches = lines.flatMap((line, index) => expression.test(line) ? [{ line: index + 1, text: line.trim().slice(0, 700) }] : []);
    if (matches.length) signals.push({ kind, matches });
  }
  requirements.set(id, signals);
  const localFiles = [...text.matchAll(/\]\(([^)]+)\)/g)].map(match => match[1]).filter(target => !/^(?:https?:|mailto:|#)/i.test(target) && !target.includes('<'));
  const packageLinks = localFiles.map(target => {
    const clean = target.split('#')[0];
    const absolute = path.resolve(source.base, clean);
    const insidePackage = absolute.startsWith(path.resolve(source.base) + path.sep);
    return { target, inside_component_package: insidePackage, exists_in_component_package: insidePackage && fs.existsSync(absolute) };
  });
  requiredFiles.set(id, packageLinks);
  const priorManual = previousComponents.get(id)?.manual_method_review;
  const preservedManual = priorManual?.source_sha256 === sha(source.skillPath) && (priorManual.supporting_files ?? []).every(file => fs.existsSync(file.path) && sha(file.path) === file.sha256);
  return {
    slug: id, source: source.skillPath, sha256: sha(source.skillPath), item: source.itemPath,
    inputs: normal(source.item.inputs, id, 'inputs'), outputs: normal(source.item.outputs, id, 'outputs'),
    unchanged_prior_method_reviews: priorReviews.get(id) ?? [],
    method_status: priorReviews.has(id) ? 'prior full-method record reusable; new use still requires applicability review' : 'full-method read required',
    manual_method_review: preservedManual ? priorManual : { status: 'pending', source_sha256: sha(source.skillPath), supporting_files: [] },
    requirement_signals: signals, package_reference_links: packageLinks,
    used_by: candidates.filter(candidate => {
      const seen = new Set();
      const has = current => {
        if (current === id) return true;
        if (seen.has(current)) return false;
        seen.add(current);
        return (all.get(current)?.item.uses ?? []).some(has);
      };
      return has(candidate.item.slug);
    }).map(candidate => candidate.item.slug),
  };
});

let portCount = 0;
const records = candidates.map(source => {
  const { item } = source;
  const id = item.slug;
  const startFindings = findings.length;
  const itemSha = sha(source.itemPath);
  if (!fs.existsSync(source.skillPath)) issue('error', 'missing-governing-skill', id, 'Missing governing SKILL.md.', source.skillPath);
  if (!fs.existsSync(source.pagePath)) issue('error', 'missing-page', id, 'Missing page.yaml.', source.pagePath);
  const skill = fs.existsSync(source.skillPath) ? fs.readFileSync(source.skillPath, 'utf8') : '';
  const page = fs.existsSync(source.pagePath) ? YAML.parse(fs.readFileSync(source.pagePath, 'utf8')) : {};
  const spec = specs.get(id);
  if (!jobs.has(page.job)) issue('error', 'unknown-page-job', id, `Page job ${page.job} is not in the actual TASKS taxonomy.`);
  if (!spec) issue('error', 'missing-candidate-spec', id, 'Generated candidate has no matching recipe data entry.');
  else {
    if (page.name !== spec.name || page.job !== spec.job) issue('error', 'candidate-page-mismatch', id, 'Generated page name/job does not match the current candidate data.');
    if (item.type === 'workflow' && JSON.stringify(item.steps) !== JSON.stringify(spec.steps)) issue('error', 'candidate-step-mismatch', id, 'Generated workflow steps differ from the current recipe.');
    if (item.type === 'agent' && JSON.stringify(item.uses) !== JSON.stringify([spec.workflow, spec.extra])) issue('error', 'agent-governing-mismatch', id, 'Agent workflow/branch does not match its actual selected recipe.');
    if (item.type === 'agent' && !candidateData.workflows.some(flow => slugOf(flow.name) === spec.workflow)) issue('error', 'agent-index-target', id, 'Agent governing link does not resolve to a candidate workflow.');
  }
  const inputs = normal(item.inputs, id, 'inputs'), outputs = normal(item.outputs, id, 'outputs');
  portCount += inputs.length + outputs.length;
  const external = new Set(), produced = new Set();
  const steps = item.steps ?? [];
  if (!steps.length) issue('error', 'empty-steps', id, 'Workflow/agent has no explicit steps.');
  const uses = new Set(item.uses ?? []);
  for (const step of steps) {
    if (!uses.has(step.uses)) issue('error', 'uses-step-mismatch', id, `Step ${step.uses} is not in uses.`);
    const component = all.get(step.uses);
    if (!component) continue;
    for (const port of normal(component.item.inputs, step.uses, 'inputs')) if (!produced.has(port.type)) external.add(port.type);
    for (const port of normal(component.item.outputs, step.uses, 'outputs')) produced.add(port.type);
  }
  for (const dep of uses) if (!steps.some(step => step.uses === dep)) issue('error', 'unstepped-use', id, `uses contains ${dep} with no explicit step.`);
  for (const type of external) if (!inputs.some(port => port.type === type)) issue('error', 'missing-external-input', id, `Normalized component input ${type} is not exposed; include an explicit adapter if it is generated from other user input.`);
  for (const type of produced) if (!outputs.some(port => port.type === type)) issue('review', 'unexposed-component-output', id, `Intermediate type ${type} is not exposed. Confirm intentional final output contract.`);
  const dependencyWarnings = [...new Set([...uses].flatMap(dep => all.get(dep)?.item.warnings ?? []))];
  for (const warning of dependencyWarnings) if (!(item.warnings ?? []).includes(warning)) issue('error', 'lost-component-warning', id, `Component warning ${warning} was not propagated.`);
  if (item.type === 'workflow' && item.execution !== 'coordinator') issue('error', 'governing-file-flattened', id, 'Set execution: coordinator so the pack preserves its handoff and acceptance rules.');
  if (item.type === 'agent') {
    if (!(item.asks_before ?? []).length) issue('error', 'missing-approval-boundaries', id, 'Agent lacks asks_before action boundaries.');
    if (!/(?:trigger|when|if|changed|repeat|branch)/i.test(skill)) issue('review', 'agent-value', id, 'Check for a genuine evidence-based branch, repeated comparison or bounded repair loop.');
  }
  if (item.tested && !fs.existsSync(`${source.base}/tests`)) issue('review', 'tested-claim', id, 'A tested badge needs actual recorded run evidence; verify the supplied evidence path.');
  for (const [part, body] of [['skill', skill], ['page', YAML.stringify(page)]]) if (/\bundefined\b/.test(body)) issue('error', 'undefined-copy', id, `Generated ${part} contains undefined.`);
  if (!/MISSING:/.test(skill) || !/CHECKS MISSED/.test(skill)) issue('review', 'missing-controls', id, 'Confirm a visible missing-fact and checks-missed contract.');
  const exact = [...all.values()].filter(other => other.item.slug !== id && other.item.type === item.type && JSON.stringify(other.item.uses ?? []) === JSON.stringify(item.uses ?? [])).map(other => ({ slug: other.item.slug, name: other.item.name }));
  const similar = [...all.values()].filter(other => other.item.slug !== id && other.item.type === item.type).map(other => ({ slug: other.item.slug, name: other.item.name, similarity: similarity(item.name, other.item.name) })).filter(other => other.similarity >= 0.7).sort((a, b) => b.similarity - a.similarity);
  if (exact.length) issue('review', 'same-component-chain', id, 'Explain the distinct job and governing method compared with an existing recipe.', exact);
  if (similar.length) issue('review', 'similar-existing-job', id, 'Check outcome overlap with existing recipes; a new title alone does not justify a new workflow.', similar);
  const old = previousItems.get(id);
  const manual = old?.manual_review;
  const unchangedManual = manual && manual.item_sha256 === itemSha && manual.skill_sha256 === (fs.existsSync(source.skillPath) ? sha(source.skillPath) : null);
  return {
    slug: id, type: item.type, name: item.name, generated_from: item.generated_from, candidate_spec: spec,
    source_files: [source.itemPath, source.skillPath, source.pagePath].filter(fs.existsSync).map(file => ({ path: file, sha256: sha(file) })),
    inputs, outputs, normalized_external_input_types: [...external], produced_component_types: [...produced],
    steps: steps.map(step => ({ ...step, component_source: all.get(step.uses)?.skillPath, component_sha256: all.get(step.uses)?.skillPath && fs.existsSync(all.get(step.uses).skillPath) ? sha(all.get(step.uses).skillPath) : null })),
    requirements: [...uses].map(dep => ({ component: dep, signals: requirements.get(dep) ?? [] })),
    schema_findings: findings.slice(startFindings), duplicate_chain_candidates: exact, similar_job_candidates: similar,
    manual_review: unchangedManual && manual.data_sha256 === (fs.existsSync(dataPath) ? sha(dataPath) : null) ? manual : { status: 'pending new-use applicability review', previous_review_invalidated: Boolean(manual), item_sha256: itemSha, skill_sha256: fs.existsSync(source.skillPath) ? sha(source.skillPath) : null, data_sha256: fs.existsSync(dataPath) ? sha(dataPath) : null, checks: [] },
  };
});
for (const duplicate of duplicateSlugs.filter(entry => candidateIds.has(entry.slug))) issue('error', 'duplicate-slug', duplicate.slug, 'Candidate slug exists in more than one source folder.', duplicate.paths);
const pinnedCandidateFiles = fs.readdirSync('tools').filter(name => name.startsWith(marker)).map(name => `tools/${name}`).filter(file => fs.statSync(file).isFile()).map(file => ({ path: file, sha256: sha(file) }));
const errorCount = findings.filter(entry => entry.severity === 'error').length;
const pending = records.filter(record => record.manual_review.status !== 'approved').length;
const report = {
  date: '2026-10-22', reviewer: 'Independent workflows/agents QA', source_only: true,
  status: !records.length ? 'waiting for candidate sources' : errorCount ? 'source/schema findings require author correction' : pending ? 'schema checks complete; method applicability review pending' : 'source/schema and recorded method applicability checks complete',
  scope_marker: marker, recipe_data: fs.existsSync(dataPath) ? { path: dataPath, sha256: sha(dataPath) } : null, candidate_source_files: pinnedCandidateFiles,
  counts: { workflows: records.filter(record => record.type === 'workflow').length, agents: records.filter(record => record.type === 'agent').length, ports: portCount, leaf_components: components.length, unchanged_prior_method_records: components.filter(component => component.unchanged_prior_method_reviews?.length).length, errors: errorCount, reviews_pending: pending },
  limitation: 'This checker does not import candidate modules, run component scripts, make model calls, perform external actions, build the site or test downloads. Pure recipe construction is evaluated in an isolated context without filesystem, process, module or network access. Historical method review can be reused only at the same source hash and never substitutes for checking applicability to each new job.',
  findings, components, items: records,
};
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, ...report.counts, report: outputPath }, null, 2));
if (errorCount) process.exitCode = 1;
