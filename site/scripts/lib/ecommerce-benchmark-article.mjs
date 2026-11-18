// This is a publication adapter, not a benchmark runner or an LLM judge.
// Accept only a completed, explicitly reviewed public export. Raw customer data
// and historical carry-forward results never enter the blog through this module.
import { createHash } from 'node:crypto';
import { readingMinutes } from '../../src/lib/blog.mjs';

export const BENCHMARK_SLUG = 'ecommerce-ai-agents-output-benchmarks';
export const BENCHMARK_ASSETS = `/blog-assets/${BENCHMARK_SLUG}`;
const sha = value => createHash('sha256').update(value).digest('hex');
const esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const fail = message => { throw new Error(`Benchmark publication refused: ${message}`); };
const text = (value, field, max = 12000) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) fail(`${field} must be non-empty text, at most ${max} characters`);
  // Defense in depth. A human privacy review remains required; this cannot
  // identify every private fact or customer name.
  if (/gehna|[a-z]:[\\/]|file:\/\/|localhost|127\.0\.0\.1|(?:api[_ -]?key|access[_ -]?token|password)\s*[:=]|[\w.+-]+@[\w.-]+\.[a-z]{2,}|drive\.google\.com|docs\.google\.com/i.test(value)) fail(`${field} contains a private identifier, credential marker, or local location`);
  return value.trim();
};
const digest = (value, field) => { if (!/^[a-f0-9]{64}$/.test(value ?? '')) fail(`${field} needs a SHA-256 digest`); return value; };
const revision = (value, field) => { if (!/^[a-f0-9]{40}$/.test(value ?? '')) fail(`${field} needs a full Git commit`); return value; };
const date = (value, field) => { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) fail(`${field} needs an ISO timestamp`); return value; };
const choice = (value, options, field) => { if (!options.includes(value)) fail(`${field} must be ${options.join(', ')}`); return value; };
const score = (value, field) => { if (!Number.isFinite(value) || value < 0 || value > 100) fail(`${field} needs a score from 0 to 100`); return value; };
const list = (value, field, min = 1) => { if (!Array.isArray(value) || value.length < min) fail(`${field} must contain at least ${min} entries`); return value; };
const publicFile = f => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:png|zip|csv|json|txt|pdf)$/.test(f?.filename ?? '')) fail('output file must have a flat, safe public filename');
  if (f.filename === 'results.json') fail('results.json is reserved for the reviewed result export');
  if (!Number.isSafeInteger(f.bytes) || f.bytes < 1 || f.bytes > 15000000) fail('output file size must be 1 to 15000000 bytes');
  const kind = choice(f.kind, ['download', 'image'], 'output.file.kind');
  if (kind === 'image' && !f.filename.endsWith('.png')) fail('inline benchmark images must be reviewed PNG files');
  if (kind === 'image' && (![f.width, f.height].every(n => Number.isSafeInteger(n) && n > 0 && n <= 20000))) fail('inline benchmark images require bounded pixel dimensions');
  return { filename: text(f.filename, 'output.file.filename', 200), sha256: digest(f.sha256, 'output.file.sha256'), bytes: f.bytes, kind, ...(kind === 'image' ? { width: f.width, height: f.height } : {}), label: text(f.label, 'output.file.label', 250), reviewNote: text(f.reviewNote, 'output.file.reviewNote', 1500) };
};

// This records an externally audited arithmetic-only correction. It never
// replaces the strict private audit or permits a changed score or verdict.
const judgeCorrection = (c, judge) => {
  if (c === undefined) return {};
  if (c?.kind !== 'derived-total-only' || c.originalValidity !== 'INVALID_REPORT' || c.sameAuthor !== true || c.substantiveFieldsUnchanged !== true) fail('judge correction must preserve the same author and every substantive field');
  const originalReportSha256 = digest(c.originalReportSha256, 'correction.originalReportSha256');
  if (originalReportSha256 === judge.reportSha256) fail('corrected report must have a different hash');
  const originalSpecialistTotal = score(c.originalSpecialistTotal, 'correction.originalSpecialistTotal');
  const originalPlainTotal = score(c.originalPlainTotal, 'correction.originalPlainTotal');
  if (originalSpecialistTotal === judge.specialistScore && originalPlainTotal === judge.plainScore) fail('judge correction contains no total change');
  return { correction: { kind: c.kind, originalValidity: c.originalValidity, sameAuthor: true, substantiveFieldsUnchanged: true, originalReportSha256, auditSha256: digest(c.auditSha256, 'correction.auditSha256'), originalSpecialistTotal, originalPlainTotal, reason: text(c.reason, 'correction.reason', 2000) } };
};

/** Validate and project an allowlist. Extra source fields never become public. */
export function publicBenchmark(input) {
  if (input?.schema !== 'ecommerce-fresh80-public-v1') fail('unsupported schema');
  if (input.status !== 'COMPLETE' || input.freshAll80 !== true || input.originalPrCompleted !== true) fail('all 80 fresh cases and the original PR task must be complete');
  if (!/^[a-f0-9]{40}$/.test(input.sourceRevision ?? '')) fail('sourceRevision needs a full Git commit');
  if (input.privacyReview?.approved !== true) fail('public excerpts require an explicit privacy review');
  const review = { approved: true, reviewedAt: date(input.privacyReview.reviewedAt, 'privacyReview.reviewedAt'), method: text(input.privacyReview.method, 'privacyReview.method', 2000) };
  const cases = list(input.cases, 'cases');
  const roster = list(input.roster, 'roster');
  if (cases.length !== 80 || roster.length !== 80 || new Set(roster).size !== 80) fail('exactly 80 distinct roster IDs and cases are required');
  if (new Set(cases.map(c => c.id)).size !== 80 || cases.some(c => !roster.includes(c.id))) fail('cases must exactly match the frozen roster');
  for (const id of roster) if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail('invalid agent ID');
  const runIds = new Set();
  const normalized = cases.map(c => {
    const attempts = list(c.attempts, `${c.id}.attempts`).map((a, index) => {
      const arms = {};
      for (const name of ['specialist', 'plain']) {
        const arm = a[name];
        if (!arm || arm.fresh !== true || arm.completed !== true) fail(`${c.id} attempt ${index + 1} ${name} is not a fresh completed run`);
        const runId = text(arm.runId, 'runId', 150);
        if (runIds.has(runId)) fail(`duplicate run ID ${runId}`);
        runIds.add(runId);
        const startedAt = date(arm.startedAt, 'startedAt'), completedAt = date(arm.completedAt, 'completedAt');
        if (Date.parse(completedAt) < Date.parse(startedAt)) fail('run ends before it starts');
        arms[name] = { runId, startedAt, completedAt, fresh: true, completed: true, model: text(arm.model, 'model', 100), artifactSha256: digest(arm.artifactSha256, 'artifactSha256') };
      }
      const judges = {};
      for (const name of ['sol', 'terra']) {
        const j = a.judges?.[name];
        if (j?.valid !== true) fail(`${c.id} attempt ${index + 1} ${name} has no valid independent judgment`);
        judges[name] = { valid: true, model: text(j.model, 'judge.model', 100), specialistScore: score(j.specialistScore, 'specialistScore'), plainScore: score(j.plainScore, 'plainScore'), specialistStatus: choice(j.specialistStatus, ['PASS', 'NEEDS_REPAIR', 'LIMITED_CAPABILITY', 'FAIL'], 'specialistStatus'), plainStatus: choice(j.plainStatus, ['PASS', 'NEEDS_REPAIR', 'LIMITED_CAPABILITY', 'FAIL'], 'plainStatus'), preference: choice(j.preference, ['specialist', 'plain', 'tie', 'insufficient_evidence'], 'preference'), reason: text(j.reason, 'judge.reason', 3000), reportSha256: digest(j.reportSha256, 'reportSha256') };
      }
      for (const name of ['sol', 'terra']) Object.assign(judges[name], judgeCorrection(a.judges[name].correction, judges[name]));
      return { number: index + 1, sourceRevision: revision(a.sourceRevision, 'attempt.sourceRevision'), packageSha256: digest(a.packageSha256, 'packageSha256'), specialist: arms.specialist, plain: arms.plain, judges, changes: list(a.changes ?? [], 'changes', 0).map(v => text(v, 'change', 1500)) };
    });
    const selected = c.selectedAttempt;
    if (!Number.isInteger(selected) || selected < 1 || selected > attempts.length) fail(`${c.id} selectedAttempt is out of range`);
    if (selected !== attempts.length) fail(`${c.id} must select its latest completed attempt; preserve later failures`);
    if (Object.values(attempts[selected - 1].judges).some(j => j.specialistStatus !== 'PASS')) fail(`${c.id} selected specialist output has not passed both judges`);
    const outputs = list(c.outputs, `${c.id}.outputs`).map(o => {
      if (!Number.isInteger(o.attemptNumber) || o.attemptNumber < 1 || o.attemptNumber > attempts.length) fail(`${c.id} output attemptNumber is out of range`);
      return { title: text(o.title, 'output.title', 150), attemptNumber: o.attemptNumber, arm: choice(o.arm, ['specialist', 'plain'], 'output.arm'), kind: choice(o.kind, ['verbatim-public', 'redacted-excerpt'], 'output.kind'), excerpt: text(o.excerpt, 'output.excerpt'), sourceArtifactSha256: digest(o.sourceArtifactSha256, 'output.sourceArtifactSha256'), reviewNote: text(o.reviewNote, 'output.reviewNote', 1500), files: list(o.files ?? [], 'output.files', 0).map(publicFile) };
    });
    if (!outputs.some(o => o.arm === 'specialist' && o.attemptNumber === selected)) fail(`${c.id} needs an actual selected-attempt specialist output`);
    return { id: c.id, name: text(c.name, 'name', 150), role: text(c.role, 'role', 150), job: text(c.job, 'job', 2500), taskKind: choice(c.taskKind, ['analysis', 'creative', 'code', 'workflow', 'research'], 'taskKind'), fixtureKind: choice(c.fixtureKind, ['public', 'private-redacted', 'synthetic', 'mixed'], 'fixtureKind'), evidence: text(c.evidence, 'evidence', 3000), executionLimits: text(c.executionLimits, 'executionLimits', 3000), inputSha256: digest(c.inputSha256, 'inputSha256'), originalPrTask: c.originalPrTask === true, attempts, selectedAttempt: selected, outputs };
  });
  if (normalized.filter(c => c.originalPrTask).length !== 1) fail('identify exactly one original PR case');
  return { schema: input.schema, status: 'COMPLETE', freshAll80: true, originalPrCompleted: true, sourceRevision: input.sourceRevision, runStartedAt: date(input.runStartedAt, 'runStartedAt'), runCompletedAt: date(input.runCompletedAt, 'runCompletedAt'), protocolSha256: digest(input.protocolSha256, 'protocolSha256'), evidenceManifestSha256: digest(input.evidenceManifestSha256, 'evidenceManifestSha256'), protocol: text(input.protocol, 'protocol', 6000), rubric: text(input.rubric, 'rubric', 6000), limitations: list(input.limitations, 'limitations').map(v => text(v, 'limitation', 2500)), privacyReview: review, roster: [...roster], cases: normalized };
}

export function benchmarkTotals(data) {
  const result = { cases: data.cases.length, attempts: 0, repairedCases: 0, judgeTotalCorrections: 0, firstAttemptPasses: 0, finalPasses: 0, judgeDisagreements: 0, sol: { specialist: 0, plain: 0, tie: 0, insufficient_evidence: 0 }, terra: { specialist: 0, plain: 0, tie: 0, insufficient_evidence: 0 } };
  for (const c of data.cases) {
    result.attempts += c.attempts.length;
    result.judgeTotalCorrections += c.attempts.reduce((n, a) => n + Object.values(a.judges).filter(j => j.correction).length, 0);
    if (c.attempts.length > 1) result.repairedCases++;
    if (Object.values(c.attempts[0].judges).every(j => j.specialistStatus === 'PASS')) result.firstAttemptPasses++;
    const last = c.attempts[c.selectedAttempt - 1];
    if (Object.values(last.judges).every(j => j.specialistStatus === 'PASS')) result.finalPasses++;
    for (const name of ['sol', 'terra']) result[name][last.judges[name].preference]++;
    if (last.judges.sol.preference !== last.judges.terra.preference || last.judges.sol.plainStatus !== last.judges.terra.plainStatus) result.judgeDisagreements++;
  }
  return result;
}

const paragraph = s => `<p>${esc(s)}</p>`;
const bullets = items => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
const scoreCell = j => `${j.specialistScore} / ${j.plainScore}`;
const preference = p => ({ specialist: 'Specialist', plain: 'Plain model', tie: 'Tie', insufficient_evidence: 'Insufficient evidence' })[p];
const fileMarkup = f => `${f.kind === 'image' ? `<img src="${BENCHMARK_ASSETS}/${f.filename}" alt="${esc(f.label)}" width="${f.width}" height="${f.height}" loading="lazy" decoding="async">` : `<p><a href="${BENCHMARK_ASSETS}/${f.filename}" download>${esc(f.label)}</a> (${f.bytes} bytes)</p>`}<p>${esc(f.reviewNote)} File SHA-256: <code>${f.sha256}</code>.</p>`;

export function renderBenchmarkArticle(input, methodologyHtml) {
  const data = publicBenchmark(input), totals = benchmarkTotals(data);
  const published = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(data.runCompletedAt));
  const rows = data.cases.map(c => {
    const a = c.attempts[c.selectedAttempt - 1];
    return `<tr><th scope="row"><a href="#case-${c.id}">${esc(c.name)}</a><br><span>${esc(c.role)}</span></th><td>${esc(c.taskKind)}</td><td>${scoreCell(a.judges.sol)}</td><td>${scoreCell(a.judges.terra)}</td><td>${esc(a.judges.sol.specialistStatus)}</td><td>${esc(a.judges.terra.specialistStatus)}</td><td>${preference(a.judges.sol.preference)} / ${preference(a.judges.terra.preference)}</td><td>${c.attempts.length}</td></tr>`;
  }).join('\n');
  const details = data.cases.map(c => `<details class="benchmark-case" id="case-${c.id}"><summary>${esc(c.name)}: ${esc(c.role)}</summary>
<h3>The job and the evidence</h3>${paragraph(c.job)}${paragraph(c.evidence)}${paragraph(`Source type: ${c.fixtureKind}. ${c.executionLimits}`)}
${c.outputs.map(o => `<figure><h3>${esc(o.title)}</h3><blockquote class="benchmark-output">${esc(o.excerpt)}</blockquote>${o.files.map(fileMarkup).join('\n')}<figcaption>${o.arm === 'specialist' ? 'Specialist output' : 'Plain-model output'}, attempt ${o.attemptNumber} (${o.attemptNumber === c.selectedAttempt ? 'selected' : 'retained'}). ${o.kind === 'redacted-excerpt' ? 'Redacted excerpt from the actual output.' : 'Actual output using public or synthetic information.'} ${esc(o.reviewNote)} Source artifact SHA-256: <code>${o.sourceArtifactSha256}</code>.</figcaption></figure>`).join('\n')}
<h3>Every attempt and both judgments</h3>${c.attempts.map(a => `<section class="benchmark-attempt"><h4>Attempt ${a.number}${a.number === c.selectedAttempt ? ' (selected)' : ' (retained)'}</h4>${a.changes.length ? bullets(a.changes) : paragraph('First attempt on this frozen brief.')}<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(c.name)} attempt ${a.number} judgments"><table><thead><tr><th scope="col">Judge</th><th scope="col">Specialist</th><th scope="col">Plain model</th><th scope="col">Preference</th></tr></thead><tbody>${['sol', 'terra'].map(name => { const j = a.judges[name]; return `<tr><th scope="row">${esc(j.model)}</th><td>${j.specialistScore}/100, ${j.specialistStatus}</td><td>${j.plainScore}/100, ${j.plainStatus}</td><td>${preference(j.preference)}</td></tr>`; }).join('')}</tbody></table></div>${['sol', 'terra'].map(name => { const j = a.judges[name], c = j.correction; return paragraph(`${j.model}: ${j.reason}`) + (c ? paragraph(`Judge arithmetic correction: the original report was INVALID_REPORT. Its totals were ${c.originalSpecialistTotal} for the specialist and ${c.originalPlainTotal} for the plain model. The same judge corrected only those derived totals; scores, gates, verdicts, evidence and preference stayed unchanged. ${c.reason}`) + `<p>Original report SHA-256: <code>${c.originalReportSha256}</code>. Corrected report SHA-256: <code>${j.reportSha256}</code>. Correction audit SHA-256: <code>${c.auditSha256}</code>.</p>` : ''); }).join('')}<p class="benchmark-provenance">Tested source: <code>${a.sourceRevision}</code>. Package SHA-256: <code>${a.packageSha256}</code>. Specialist run: <code>${esc(a.specialist.runId)}</code>, ${esc(a.specialist.completedAt)}. Plain run: <code>${esc(a.plain.runId)}</code>, ${esc(a.plain.completedAt)}.</p></section>`).join('\n')}
<p><a href="https://agents.useaiblocks.com/agents/${c.id}">Open ${esc(c.name)}'s agent profile</a></p></details>`).join('\n');
  const body = `<div class="callout"><p>This report covers ${totals.cases} fresh job comparisons. ${totals.firstAttemptPasses} specialist outputs passed both judges on the first attempt; ${totals.finalPasses} passed on the selected final attempt. ${totals.repairedCases} cases had further attempts. Each case below keeps its earlier results and shows the actual output.</p><p>On the selected attempts, Sol preferred the specialist ${totals.sol.specialist} times, the plain model ${totals.sol.plain} times, and called ${totals.sol.tie} ties. Terra preferred the specialist ${totals.terra.specialist} times, the plain model ${totals.terra.plain} times, and called ${totals.terra.tie} ties.${totals.sol.insufficient_evidence || totals.terra.insufficient_evidence ? ` Sol found insufficient evidence for a preference in ${totals.sol.insufficient_evidence} cases; Terra did so in ${totals.terra.insufficient_evidence}.` : ''} Passing a task does not establish superiority over ordinary Sol. These selected tasks and repair attempts do not measure performance on unseen jobs.</p><p>Testing ran from ${esc(data.runStartedAt)} to ${esc(data.runCompletedAt)}. The release source revision is <code>${data.sourceRevision}</code>. Individual package hashes appear with every attempt.</p></div>
<h2 id="results">Compare all 80 agents and their outputs</h2>
<p>The score pairs read specialist first, plain model second. A passing output meets this task's acceptance rules. Preference is a separate question: which output would the judge choose? These results describe the selected tasks and test conditions.</p>
<div class="table-wrap" tabindex="0" role="region" aria-label="All 80 agent results"><table><caption>Selected attempt scores and specialist status, with first-to-last attempt history below</caption><thead><tr><th scope="col">Agent and role</th><th scope="col">Job type</th><th scope="col">Sol scores</th><th scope="col">Terra scores</th><th scope="col">Sol specialist status</th><th scope="col">Terra specialist status</th><th scope="col">Sol / Terra preference</th><th scope="col">Attempts</th></tr></thead><tbody>${rows}</tbody></table></div>
<h2 id="comparison">Where the specialist helped, and where the plain model won</h2>
${paragraph(`Across the 80 selected comparisons, Sol preferred the specialist ${totals.sol.specialist} times, the plain model ${totals.sol.plain} times, and called ${totals.sol.tie} ties. Terra preferred the specialist ${totals.terra.specialist} times, the plain model ${totals.terra.plain} times, and called ${totals.terra.tie} ties.`)}
${totals.sol.insufficient_evidence || totals.terra.insufficient_evidence ? paragraph(`Sol found insufficient evidence for a preference in ${totals.sol.insufficient_evidence} cases; Terra did so in ${totals.terra.insufficient_evidence} cases. These are separate from ties.`) : ''}
${paragraph(`The judges differed on preference or the plain model's pass status in ${totals.judgeDisagreements} selected cases. We retain each judgment. A disagreement is useful evidence about an unclear criterion or a trade-off between the outputs.`)}
${totals.judgeTotalCorrections ? paragraph(`${totals.judgeTotalCorrections} judge reports needed an arithmetic-only correction. Those original invalid reports remain recorded below. First-attempt output passes include these corrected judgments; they are not a count of error-free original judge reports.`) : ''}
<p>The final pass count includes repaired attempts. Use the first-attempt count when assessing how often the initial output was ready. Repair work can improve the product while also making this dataset less suitable for measuring performance on unseen tasks.</p>
<h2 id="protocol">Read the exact test conditions</h2>${paragraph(data.protocol)}${paragraph(data.rubric)}
${methodologyHtml}
<h2 id="outputs">Inspect the work, evidence, and repair history</h2>
<p>Expand a case to read its brief, output excerpts, limits, and both judges' reasons. Excerpts are labelled when private details were removed. We keep the complete private source artifacts for review, with their hashes in the public evidence file. A hash identifies a file; it cannot verify a hidden file's contents by itself.</p>
${details}
<h2 id="limits">What these results do and do not establish</h2>${bullets(data.limitations)}
<p>These are development evaluations on selected ecommerce jobs. They do not establish a population-wide success rate, measured sales growth, or superiority over a human specialist. Model judgments have their own errors. Repeated tests on new businesses and review by experienced operators remain necessary.</p>
<h2 id="evidence">Download the public evidence</h2>
<p><a href="${BENCHMARK_ASSETS}/results.json">Download all 80 results and the reviewed output excerpts as JSON</a>. The file contains run IDs, package hashes, input hashes, raw-artifact hashes, every retained attempt, and both judge reports' hashes. It excludes private account data and source documents.</p>
<p>Frozen protocol SHA-256: <code>${data.protocolSha256}</code>. Private evidence manifest SHA-256: <code>${data.evidenceManifestSha256}</code>. Public export privacy review: ${esc(data.privacyReview.reviewedAt)}. ${esc(data.privacyReview.method)}</p>
<h2 id="faq">Questions about the agent benchmarks</h2>
<h3>Does a pass mean the agent changed a live business?</h3><p>Read the execution limits on each case. A test can assess an actual file, calculation, or local storefront change while leaving a live store untouched. Publishing an ad, sending customer messages, and changing a budget require their own access and approval.</p>
<h3>Why can the plain model win when the specialist passes?</h3><p>Pass status checks whether an output meets the brief. Preference compares two acceptable outputs. The plain model may write a clearer answer, find stronger evidence, or make a simpler recommendation. We publish those outcomes alongside the specialist wins.</p>
<h3>Are these 80 new outputs or old scores carried forward?</h3><p>Every case in this report has fresh completed runs and new judgments. Earlier reports remain separate. This report includes the original PR task, and the case record identifies that task explicitly.</p>
<h3>Can I reproduce the result exactly?</h3><p>The public file records the models, times, file hashes, conditions, and excerpts. Some private fixtures cannot be shared. Model outputs also vary between runs. Use the method with your own approved inputs, then keep every result so the next comparison has a clear basis.</p>`;
  const meta = { slug: BENCHMARK_SLUG, title: 'See what 80 ecommerce AI agents actually deliver', seoTitle: '80 ecommerce AI agents: outputs and results', description: 'Inspect fresh ecommerce agent outputs, compare Sol and Terra judgments, read every repair, and see the evidence and limits behind the results.', lede: 'See the work behind our ecommerce agent tests: actual output excerpts, plain-model comparisons, judge disagreements, and repairs for all 80 specialists. Use the results to choose a role and decide what you should check before giving it a live job.', category: 'Run your business', keywords: ['ecommerce AI agent benchmarks', 'AI agent output evaluation', 'ecommerce agent results'], related: ['hire-ai-specialists', 'ai-agents-for-small-business', 'give-ai-context-about-your-business'], minutes: readingMinutes(body), published, updated: published };
  return { meta, body, data, totals, publicDataSha256: sha(JSON.stringify(data, null, 2) + '\n') };
}
