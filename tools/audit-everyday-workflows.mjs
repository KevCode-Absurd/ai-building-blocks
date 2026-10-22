import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import YAML from '../site/node_modules/yaml/dist/index.js';
import { workflows, agents } from './everyday-workflows-data.mjs';

const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const slug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const recipesPath = 'tools/everyday-workflows-data.mjs';
const recipesSha = sha(recipesPath);
const manifestPath = 'reports/2026-10-22-everyday-workflows.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath));
const typeGroups = YAML.parse(fs.readFileSync('catalogue-items/_types.yaml', 'utf8'));
const registeredTypes = new Set(Object.values(typeGroups).flatMap(group => Object.keys(group)));
const sources = new Map();
for (const cat of ['general', 'ecommerce', 'imported', 'orchestrators', 'agents']) {
  for (const dir of fs.readdirSync(`catalogue-items/${cat}`, { withFileTypes: true }).filter(x => x.isDirectory())) {
    const itemPath = `catalogue-items/${cat}/${dir.name}/item.yaml`;
    if (!fs.existsSync(itemPath)) continue;
    const item = YAML.parse(fs.readFileSync(itemPath, 'utf8'));
    sources.set(item.slug, { item, path: itemPath.replace(/item.yaml$/, 'SKILL.md') });
  }
}
const financeJobs = new Set(['track-numbers', 'plan-supply-chain', 'set-prices', 'check-contracts', 'money-and-investing', 'work-with-files']);
const financeComponents = [...new Set(workflows.filter(x => financeJobs.has(x.job)).flatMap(x => x.steps.map(s => s.uses)))].sort();
const notes = {
  'account-reconciler': 'GL/subledger/bank reconciliation methods match expense-register reconciliation. Preserve period, opening/closing balances, reconciling categories and qualified reviewer signoff; no journal posting.',
  'budget-and-forecast-builder': 'Revenue/cost drivers, cash timing, scenarios and variance are explicit methods. Recipe selects cash timing/scenario work, with source opening cash and dated flows; no invented confidence bands or historical actuals.',
  'budget-variance-explainer': 'Decomposition, materiality and a reconciled bridge support budget-overrun explanations. Show any residual; source numerical thresholds and illustrative examples do not become owner rules.',
  'compliance-checklist': 'Control mapping, status/evidence gaps and remediation match preparation. Use owner/reviewer supplied scope and current dated primary requirements; source industry shortcuts do not establish legal applicability or certification.',
  'contract-and-proposal-drafter': 'Requirements, scope/value/dates and proposal/SOW templates support website project quotations. Output is a review draft; source template percentages, legal generalizations and jurisdictions are not automatically applicable.',
  'contract-risk-reviewer': 'Party perspective, operative terms, clause risks and alternative wording fit amendment/renewal/proposal review. Proposed clauses stay proposed and current jurisdictional meaning requires appropriate review.',
  'decision-checklist-runner': 'Requires an existing ordered checklist with pass/stop rules and must not invent one. Purchase and sponsorship intakes now explicitly require that checklist.',
  'department-budget-planner': 'Historical spending, phased budget, actual variance and adjustments fit department planning. Cash-buffer use is restricted to budget response options tied to the preceding reconciled cash scenarios.',
  'document-file-generator': 'PaperJSX is generation-only from JSON schema, not a document editor or renderer. Recipe creates a new Word file, then uses an actual converter and PDF renderer for separate verification.',
  'editable-slide-deck-builder': 'Narrative choice, source IDs, explicit layout, native objects and manual/render QA match editable briefing deck creation. Require user-approved custom outline, approved build environment and real renderer; absent renderer leaves visual QA pending.',
  'employee-data-privacy-checker': 'HR employee-data minimization, consent/access and AI processing review match the HR access-change preparation. Missing local policy/jurisdiction remains a question and no access is changed.',
  'executive-action-register': 'Extracts sourced commitments with stable IDs, owner/date/status gaps and proposed writes. Invoice/payroll/compliance results are supplied as source evidence; discussion is not accepted ownership or completion.',
  'figures-to-plain-pictures-writer': 'Turns verified figures into plain comparisons while retaining the actual amount. Spreadsheet handoff provides units/periods and forbids adding unsupported equivalences.',
  'invoice-checker': 'Full invoice processing covers extraction, PO/receipt matches, flags and batch summary. Source GL examples and default tolerances do not replace user approval rules; never release payment.',
  'invoice-totals-checker': 'Exact recomputation script or shown arithmetic, common fields and date/currency/rounding checks match independent invoice arithmetic. Determines no applicable tax treatment.',
  'libreoffice-document-builder': 'Writer format conversion explicitly supports DOCX/ODT/PDF through soffice. Recipe converts the actual generated Word document into a separate review PDF and preserves the native source.',
  'payroll-timesheet-checker': 'Period/roster/intake/hour totals/anomaly review support payroll input checking via uploaded records. Recipe restricts use to read-only review, needs confirmed rates/rules/prior totals and stops before flag edits, staging or journals.',
  'pdf-maker-and-reader': 'Page rendering and visible inspection match both scanned-fact verification and actual Word-to-PDF review. Tool presence and reviewed pages must be recorded; no text-only layout claims.',
  'people-risk-register-builder': 'HR risk identification, assessment, mitigation and owner review fit employee data/access risks. No private trait inference or unapproved employee decision.',
  'personal-budget-builder': 'Income, essentials, discretionary spending and savings plan establish purchase affordability. Owner commitments and chosen limits take precedence over source default percentages; no transfer is executed.',
  'plain-english-editor': 'Supported draft editing preserves meaning, uncertainty and facts. It is not a source of new controls, evidence or legal interpretation.',
  'plain-words-contract-summary': 'Portable original prompt needs full contract and party perspective, returns duties, money/dates, exit and source sections. Replaces private lawyer-plugin summary/config assumptions; proposed/base versions stay distinct.',
  'presentation-builder': 'Audience/purpose/narrative/outline/notes methods support report-to-briefing planning. Recipe uses outline mode before the separate native PPTX build and preserves source qualifications.',
  'proofreader': 'Grammar/consistency/style correction supports final text checking only within assessable language scope. It does not prove translations, facts or source consent.',
  'scanned-pdf-text-reader': 'LiteParse offers spatial text, OCR and page screenshots with page/error coverage checks. Recipe requires local OCR/language data and compares important values to visible source pages; extraction confidence is not proof.',
  'spend-savings-finder': 'Procurement normalization, supplier/category/usage analysis and consolidation options support subscription reviews. Actual usage and contract scope are required; missing usage is not unused and sample savings percentages are not evidence.',
  'spreadsheet-checker': 'Full source covers inventory/grain, normalization, formula validation, reconciliation, auditable output, re-open and render. Its general method replaces India-only formula audit and tax-default category methods; preserve raw data and label unavailable recalculation.',
  'stakeholder-update-writer': 'Audience/cadence/source progress and decision updates match variance briefs. Proposed options are distinguished from approved budget changes.',
  'supplier-quote-comparer': 'Actual method compares physical-product MOQ, unit costs, lead time, retail margin, cash, terms and quality checks. Intake now includes planned retail price and stock cash limit; no deposit or inspection purchase is executed.',
  'supplier-risk-scorecard-builder': 'Risk identification, criticality, evidence and mitigation fit the supplied supplier-risk evidence stage. Recipe limits it to sourced evidence and forbids treating illustrative weights, buffer months or cost-reduction factors as facts.',
  'vendor-agreement-status-checker': 'Agreement identity/status/term/renewal/notice and unavailable-source coverage support subscription renewal decisions. Uploaded actual agreements remain the evidence and no unsearched system is claimed checked.',
  'vendor-comparison-writer': 'TCO, implementation/training/exit costs, risk/performance and side-by-side options match supplier/service purchase comparisons and renewal briefs. Unsupported quality or savings remains unknown.',
  'web-project-scoper': 'Six phases define concept, UX, design, architecture, accessibility and MVP scope. Intake is explicitly a website project, not arbitrary freelance services; estimate/contract assumptions remain separate from approved scope.',
};
const records = financeComponents.map(component => {
  assert(notes[component], `Missing finance applicability review: ${component}`);
  const source = sources.get(component);
  assert(source && fs.existsSync(source.path));
  return { component, path: source.path, sha256: sha(source.path), method_reviewed: true, applicability: notes[component], used_by: workflows.filter(x => x.steps.some(s => s.uses === component)).map(x => slug(x.name)) };
});
const financeReport = { date: '2026-10-22', scope: [...financeJobs], recipe_sha256: recipesSha, method: 'Read governing method, required inputs, output contract, boundaries, references and limitations in actual local SKILL.md files. Example data/code and legal/financial statements were not independently validated or executed. Review is applicability and preparation safety, not execution or professional signoff.', records };
fs.writeFileSync('reports/2026-10-22-workflow-audit-finance.json', JSON.stringify(financeReport, null, 2) + '\n');

const auditFiles = ['reports/2026-10-22-workflow-audit-finance.json', 'reports/2026-10-22-people-learning-component-audit.json', 'reports/2026-10-22-workflow-audit-operations.json'];
const coverage = new Map();
const auditPins = [];
for (const file of auditFiles) {
  const r = JSON.parse(fs.readFileSync(file));
  auditPins.push({ file, sha256: sha(file), recipe_sha256: r.recipe_sha256 ?? r.recipes_source_sha256, matches_current_recipe: (r.recipe_sha256 ?? r.recipes_source_sha256) === recipesSha });
  for (const entry of r.records ?? r.reviewed_components ?? []) {
    const id = entry.component ?? entry.slug;
    const sourcePath = entry.path ?? entry.reviewed_path;
    if (!coverage.has(id)) coverage.set(id, []);
    coverage.get(id).push({ audit: file, source: sourcePath, sha256: entry.sha256, source_matches: fs.existsSync(sourcePath) && sha(sourcePath) === entry.sha256, applicability: entry.applicability ?? entry.applicability_and_findings });
  }
}
const active = [...new Set([...workflows.flatMap(x => x.steps.map(s => s.uses)), ...agents.map(x => x.extra)])].sort();
const uncovered = active.filter(x => !coverage.has(x));
assert.equal(uncovered.length, 0, `Unaudited active components: ${uncovered.join(', ')}`);
assert(active.every(x => coverage.get(x).some(r => r.source_matches)), 'Active component audit source changed');

const required = ['new_slug', 'name', 'summary', 'job', 'headline', 'subhead', 'explain', 'when', 'you_give', 'you_get', 'how_to_use', 'how_it_works', 'output_shape', 'tweaks', 'judge', 'test', 'improve'];
const copyIssues = [];
const paths = [];
for (const record of manifest.items) {
  const itemFile = record.files.find(x => x.endsWith('/item.yaml'));
  const item = YAML.parse(fs.readFileSync(itemFile, 'utf8'));
  const page = YAML.parse(fs.readFileSync(itemFile.replace(/item.yaml$/, 'page.yaml'), 'utf8'));
  const governing = fs.readFileSync(itemFile.replace(/item.yaml$/, 'SKILL.md'), 'utf8');
  assert.equal(item.generated_from, recipesPath);
  for (const direction of ['inputs', 'outputs']) {
    assert(Array.isArray(item[direction]), `Missing ${direction}: ${record.slug}`);
    for (const port of item[direction]) {
      assert(port && typeof port === 'object' && typeof port.type === 'string' && port.type.trim().length > 0, `Invalid ${direction} port: ${record.slug}`);
      assert(registeredTypes.has(port.type), `Unregistered ${direction} type ${port.type}: ${record.slug}`);
    }
  }
  assert(!item.tested && item.example_pending === true, `Unsupported tested claim: ${record.slug}`);
  assert(item.type !== 'workflow' || item.execution === 'coordinator', `Flattened governing rules: ${record.slug}`);
  assert.equal(item.inputs.filter(x => x.required).map(x => x.type).join(','), 'brief', `Unexpected required source-union port: ${record.slug}`);
  assert(item.steps.every(x => sources.has(x.uses)), `Unknown component: ${record.slug}`);
  const needed = new Set(['brief']);
  const made = new Set();
  for (const step of item.steps) {
    const component = sources.get(step.uses).item;
    for (const raw of component.inputs ?? []) {
      const type = typeof raw === 'string' ? raw : raw.type;
      if (!made.has(type)) needed.add(type);
    }
    for (const raw of component.outputs ?? []) made.add(typeof raw === 'string' ? raw : raw.type);
  }
  assert([...needed].every(type => item.inputs.some(p => p.type === type)), `Omitted external source type: ${record.slug}`);
  assert([...made].every(type => item.outputs.some(p => p.type === type)), `Omitted component output type: ${record.slug}`);
  assert(!/\bundefined\b/.test(governing) && !/\bundefined\b/.test(YAML.stringify(page)), `Undefined generated copy: ${record.slug}`);
  assert(governing.includes('MISSING:') && governing.includes('CHECKS MISSED') && governing.includes('actual participant responses'));
  for (const key of required) if (page[key] == null || page[key] === '') copyIssues.push(`${record.slug}: missing ${key}`);
  for (const [key, limit] of [['summary', 22], ['subhead', 60], ['name', 10], ['headline', 18]]) if (page[key].split(/\s+/).length > limit) copyIssues.push(`${record.slug}: long ${key}`);
  const warnings = [...new Set(item.uses.flatMap(dep => sources.get(dep).item.warnings ?? []))];
  assert(warnings.every(w => item.warnings?.includes(w)), `Lost component warning: ${record.slug}`);
  for (const file of record.files) paths.push({ file, sha256: sha(file) });
}
assert.equal(copyIssues.length, 0, copyIssues.join('\n'));
const report = { date: '2026-10-22', workflows: workflows.length, agents: agents.length, active_components: active.length, recipe: { path: recipesPath, sha256: recipesSha }, generator: { path: 'tools/build-everyday-workflows.mjs', sha256: sha('tools/build-everyday-workflows.mjs') }, manifest: { path: manifestPath, sha256: sha(manifestPath) }, source_only: true, limitation: 'No paid model execution, real business outcome, legal/financial signoff or finished native artifact is claimed. Root/publisher owns site build, complete pack and browser verification.', audit_pins: auditPins, uncovered_components: uncovered, components: active.map(component => ({ component, reviews: coverage.get(component) })), copy_issues: copyIssues, catalogue_files: paths };
fs.writeFileSync('reports/2026-10-22-everyday-workflow-validation.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ workflows: workflows.length, agents: agents.length, active_components: active.length, source_hashes_match: true, audit_recipe_pins_current: auditPins.every(x => x.matches_current_recipe), copy_issues: copyIssues.length, recipe_sha256: recipesSha, catalogue_files: paths.length }, null, 2));
