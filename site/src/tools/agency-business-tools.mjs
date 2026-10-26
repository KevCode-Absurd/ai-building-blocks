// Original local utilities informed by the credited Agency Agents methods.
// Input remains data. No network calls, code execution, file operations or account actions.
import { parseCsv } from './csv-utils.mjs';

const MAX_INPUT = 1_000_000;
const SCALE = 1_000_000n;
const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
const fail = message => { throw Error(message); };
const object = (value, label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`Provide ${label} as a JSON object.`);
  return value;
};
function inputObject(input) {
  if (typeof input !== 'string') fail('Paste JSON text.');
  if (input.length > MAX_INPUT) fail('Use at most 1,000,000 characters per input.');
  let value;
  try { value = JSON.parse(input); } catch { fail('Enter valid JSON. Start with the editable example.'); }
  return object(value, 'the input');
}
function fields(value, allowed, label) {
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`Unknown ${label} field: ${key}. Use the example schema.`);
}
function string(value, label, max = 500) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) fail(`Provide ${label} as nonempty text of at most ${max} characters.`);
  return value;
}
function array(value, label, max, allowEmpty = true) {
  if (!Array.isArray(value) || value.length > max || (!allowEmpty && !value.length)) fail(`Provide ${label} as ${allowEmpty ? 'an' : 'a nonempty'} array of at most ${max} records.`);
  return value;
}
function date(value, label) {
  if (typeof value !== 'string' || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) fail(`Use YYYY-MM-DD for ${label}.`);
  const time = Date.parse(value + 'T00:00:00Z');
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) fail(`Check the calendar date for ${label}.`);
  return value;
}
function decimal(value, label, integer = false) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!(integer ? /^\d{1,13}$/ : /^\d{1,13}(?:\.\d{1,6})?$/).test(text)) fail(`Use a non-negative ${integer ? 'whole number' : 'decimal with at most six decimal places'} for ${label}; no currency symbols, grouping separators or exponents.`);
  const [whole, fraction = ''] = text.split('.');
  const units = BigInt(whole) * SCALE + BigInt(fraction.padEnd(6, '0'));
  if (units > MAX_SAFE) fail(`${label} is too large to preserve the stated numeric precision.`);
  return units;
}
function add(a, b, label) {
  if (a === null || b === null) return null;
  const sum = a + b;
  if (sum > MAX_SAFE) fail(`The ${label} total is too large to preserve six-decimal precision. Use a smaller report.`);
  return sum;
}
const number = value => value === null ? null : Number(value) / Number(SCALE);
function ratio(numerator, denominator) {
  if (numerator === null || denominator === null || denominator === 0n) return null;
  const units = (numerator * SCALE + denominator / 2n) / denominator;
  if (units > MAX_SAFE) fail('A CPA or ROAS ratio is too large to preserve six-decimal precision. Use a narrower report or inspect the contributing rows.');
  return Number(units) / Number(SCALE);
}
const compareText = (a, b) => a < b ? -1 : a > b ? 1 : 0;

function analyzeNgrams(input) {
  const x = inputObject(input);
  fields(x, ['csv', 'n', 'currency', 'dateRange', 'columns'], 'input');
  if (typeof x.csv !== 'string' || !x.csv.trim() || x.csv.length > 750_000) fail('Provide csv as nonempty text of at most 750,000 characters.');
  if (!Number.isInteger(x.n) || x.n < 1 || x.n > 3) fail('Choose a whole n-gram size from 1 to 3.');
  if (typeof x.currency !== 'string' || !/^[A-Z]{3}$/.test(x.currency)) fail('Declare one uppercase three-letter currency code, such as USD. No currency conversion is performed.');
  const period = object(x.dateRange, 'dateRange');
  fields(period, ['start', 'end'], 'dateRange');
  date(period.start, 'dateRange.start'); date(period.end, 'dateRange.end');
  if (period.start > period.end) fail('dateRange.start must not be after dateRange.end.');
  const mapping = { query: 'query', cost: 'cost', clicks: 'clicks', conversions: 'conversions', value: null, currency: null, date: null, ...(x.columns === undefined ? {} : object(x.columns, 'columns')) };
  fields(mapping, ['query', 'cost', 'clicks', 'conversions', 'value', 'currency', 'date'], 'columns');
  for (const key of ['query', 'cost']) string(mapping[key], 'columns.' + key, 120);
  for (const key of ['clicks', 'conversions', 'value', 'currency', 'date']) if (mapping[key] !== null) string(mapping[key], 'columns.' + key, 120);
  const selected = Object.values(mapping).filter(value => value !== null);
  if (new Set(selected).size !== selected.length) fail('Map each input column to one role only.');
  const csv = parseCsv(x.csv);
  if (csv.length < 2 || csv.length > 5001) fail('Provide a header and 1 to 5,000 CSV data records.');
  const headings = csv[0].map(h => h.trim());
  if (!headings.length || headings.length > 64 || headings.some(h => !h || h.length > 120) || new Set(headings).size !== headings.length) fail('Use 1 to 64 distinct, nonempty column headings of at most 120 characters.');
  for (const heading of selected) if (!headings.includes(heading)) fail(`Mapped column is missing: ${heading}. Optional metric mappings may be null.`);
  const columns = Object.fromEntries(Object.entries(mapping).map(([key, name]) => [key, name === null ? null : headings.indexOf(name)]));
  const zero = () => ({ cost: 0n, clicks: mapping.clicks === null ? null : 0n, conversions: mapping.conversions === null ? null : 0n, value: mapping.value === null ? null : 0n });
  const totals = zero(), groups = new Map(), rows = [], notRepresented = [];
  for (let index = 1; index < csv.length; index++) {
    const cells = csv[index], csvRow = index + 1;
    if (cells.length !== headings.length) fail(`CSV record ${csvRow} has ${cells.length} cells; expected ${headings.length}.`);
    if (cells.some(cell => cell.length > 2000)) fail(`CSV record ${csvRow} contains a cell over 2,000 characters.`);
    const query = string(cells[columns.query], `query in CSV record ${csvRow}`, 500);
    if (columns.currency !== null && cells[columns.currency].trim() !== x.currency) fail(`CSV record ${csvRow} has a different or missing currency. Split mixed-currency reports first.`);
    if (columns.date !== null) {
      const day = date(cells[columns.date].trim(), `CSV record ${csvRow}`);
      if (day < period.start || day > period.end) fail(`CSV record ${csvRow} falls outside the declared date range. Filter the report first.`);
    }
    const metrics = {};
    for (const key of ['cost', 'clicks', 'conversions', 'value']) metrics[key] = columns[key] === null ? null : decimal(cells[columns[key]], `${key} in CSV record ${csvRow}`, key === 'clicks');
    for (const key of Object.keys(totals)) totals[key] = add(totals[key], metrics[key], key);
    const words = query.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
    if (words.length > 100) fail(`CSV record ${csvRow} has over 100 word tokens. Use shorter search terms.`);
    const unique = new Set();
    for (let i = 0; i + x.n <= words.length; i++) unique.add(words.slice(i, i + x.n).join(' '));
    if (!unique.size) notRepresented.push(csvRow);
    for (const gram of unique) {
      if (!groups.has(gram)) {
        if (groups.size >= 10_000) fail('The report creates over 10,000 distinct n-grams. Use fewer rows or a narrower report.');
        groups.set(gram, { gram, ...zero(), sourceRows: [] });
      }
      const group = groups.get(gram);
      for (const key of Object.keys(totals)) group[key] = add(group[key], metrics[key], key);
      group.sourceRows.push(csvRow);
    }
    rows.push({ csvRow, query, ...Object.fromEntries(Object.entries(metrics).map(([key, value]) => [key, number(value)])) });
  }
  const outputMetrics = value => ({ cost: number(value.cost), clicks: number(value.clicks), conversions: number(value.conversions), conversionValue: number(value.value), cpa: ratio(value.cost, value.conversions), roas: ratio(value.value, value.cost) });
  const ngrams = [...groups.values()].sort((a, b) => a.cost === b.cost ? compareText(a.gram, b.gram) : a.cost > b.cost ? -1 : 1).map(group => ({ gram: group.gram, queryRows: group.sourceRows.length, sourceRows: group.sourceRows, ...outputMetrics(group), zeroConversions: group.conversions === null ? null : group.conversions === 0n }));
  return JSON.stringify({ scope: { currency: x.currency, dateRange: period, currencyValidation: columns.currency === null ? 'declared-only; no currency column checked' : 'every record checked', dateValidation: columns.date === null ? 'declared-only; no date column checked' : 'every record checked' }, n: x.n, rowCount: rows.length, totals: outputMetrics(totals), ngramCount: ngrams.length, ngrams, sourceRows: rows, rowsWithoutNgram: notRepresented, numericPrecision: 'Input metrics have at most six decimal places; sums use fixed-point arithmetic. CPA and ROAS are rounded to six decimal places. Null means unavailable or a zero denominator.', tokenization: 'Unicode NFKC normalization, lowercase, then contiguous Unicode letters/numbers. Punctuation separates tokens. This is not dictionary-based word segmentation for Chinese, Japanese or other unspaced text.', warnings: ['N-gram groups overlap. Their spend and conversion totals are not additive; use the report totals as the denominator.', 'A gram contributes each source row once even when it occurs repeatedly within that query. Separate duplicate CSV records remain separate rows.', 'Zero conversions do not prove irrelevant traffic or wasted spend. No negative keywords, relevance verdicts or account changes are produced.'], limitation: 'Checks only the supplied report. Currency/date scope without mapped columns is a user declaration, not independently verified. Tracking quality, attribution and statistical significance are not evaluated.' }, null, 2);
}

const ISSUE = /^[A-Z][A-Z0-9]{0,19}-[1-9]\d{0,11}$/;
function issueRefs(text) {
  return [...new Set([...text.matchAll(/(?:^|[^A-Za-z0-9])([A-Z][A-Z0-9]{0,19}-[1-9]\d{0,11})(?![A-Za-z0-9])/g)].map(m => m[1]))].sort(compareText);
}
function shaKey(value, label) {
  string(value, label, 64);
  if (!/^[a-fA-F0-9]{7,64}$/.test(value)) fail(`${label} must be a 7 to 64 character hexadecimal commit ID. IDs join exactly; abbreviated and full IDs are not resolved against Git.`);
  return value.toLowerCase();
}
function distinctTextList(value, label, max, length = 120) {
  array(value, label, max);
  for (const text of value) string(text, label + ' entry', length);
  if (new Set(value).size !== value.length) fail(`List each ${label} entry once.`);
  return value;
}
function checkTraceability(input) {
  const x = inputObject(input);
  fields(x, ['issues', 'branches', 'commits', 'pullRequests', 'policy'], 'input');
  const issues = x.issues === undefined || x.issues === null ? null : new Set(distinctTextList(x.issues, 'issues', 5000, 40));
  if (issues && [...issues].some(key => !ISSUE.test(key))) fail('Issue keys must be supplied exactly in uppercase PROJECT-123 form; they are never guessed or case-normalized.');
  const policy = { branchPrefixes: [], outerPrefixes: [], requireSingleIssue: false, ...(x.policy === undefined ? {} : object(x.policy, 'policy')) };
  fields(policy, ['branchPrefixes', 'outerPrefixes', 'requireSingleIssue'], 'policy');
  for (const field of ['branchPrefixes', 'outerPrefixes']) {
    distinctTextList(policy[field], 'policy.' + field, 20, 80);
    if (policy[field].some(prefix => !/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/$/.test(prefix))) fail(`Use plain slash-terminated prefixes for policy.${field}, such as feature/ or codex/.`);
  }
  if (typeof policy.requireSingleIssue !== 'boolean') fail('policy.requireSingleIssue must be true or false.');
  array(x.branches, 'branches', 1000); array(x.commits, 'commits', 5000, false); array(x.pullRequests, 'pullRequests', 2000);
  const findings = [], branches = new Map(), commits = new Map(), prs = new Map(), membership = new Map();
  const finding = (code, recordType, recordId, detail) => findings.push({ code, recordType, recordId, detail });
  const inspectRefs = (refs, recordType, id) => {
    if (!refs.length) finding('MISSING_ISSUE_REFERENCE', recordType, id, 'No uppercase PROJECT-123 reference was extracted; lowercase or malformed text is not repaired.');
    if (policy.requireSingleIssue && refs.length > 1) finding('MULTIPLE_ISSUE_REFERENCES', recordType, id, 'The supplied policy requires exactly one issue per record.');
    if (issues) for (const ref of refs) if (!issues.has(ref)) finding('UNKNOWN_ISSUE', recordType, id, `Issue ${ref} is absent from the supplied issue register.`);
  };
  for (const raw of x.branches) {
    const b = object(raw, 'each branch'); fields(b, ['name'], 'branch'); const name = string(b.name, 'branch name', 240);
    if (branches.has(name)) fail('Branch name appears twice: ' + name);
    const refs = issueRefs(name); inspectRefs(refs, 'branch', name);
    let policyName = name;
    const prefix = [...policy.outerPrefixes].sort((a, b) => b.length - a.length || compareText(a, b)).find(p => name.startsWith(p));
    if (prefix) policyName = name.slice(prefix.length);
    if (policy.branchPrefixes.length && !policy.branchPrefixes.some(p => policyName.startsWith(p))) finding('BRANCH_PREFIX_MISMATCH', 'branch', name, 'The branch does not match the supplied prefix policy after at most one configured outer prefix.');
    branches.set(name, { name, issueRefs: refs, policyName, commitIds: [] });
  }
  for (const raw of x.commits) {
    const c = object(raw, 'each commit'); fields(c, ['sha', 'branch', 'subject'], 'commit');
    const id = shaKey(c.sha, 'commit sha'), branch = string(c.branch, 'commit branch', 240), subject = string(c.subject, 'commit subject', 1000);
    if (commits.has(id)) fail('Commit ID appears twice (hex letter case is ignored): ' + c.sha);
    const refs = issueRefs(subject); inspectRefs(refs, 'commit', c.sha);
    const b = branches.get(branch);
    if (!b) finding('MISSING_BRANCH_RECORD', 'commit', c.sha, 'The named branch is absent from the supplied branch records.');
    else {
      b.commitIds.push(c.sha);
      if (refs.length && b.issueRefs.length && refs.some(ref => !b.issueRefs.includes(ref))) finding('BRANCH_COMMIT_ISSUE_MISMATCH', 'commit', c.sha, 'At least one commit issue is not referenced by its supplied branch.');
    }
    commits.set(id, { sha: c.sha, branch, subject, issueRefs: refs, pullRequestIds: [] });
  }
  let references = 0;
  for (const raw of x.pullRequests) {
    const p = object(raw, 'each pull request'); fields(p, ['id', 'branch', 'title', 'commitShas'], 'pull request');
    const id = string(p.id, 'pull request id', 120), branch = string(p.branch, 'pull request branch', 240), title = string(p.title, 'pull request title', 1000);
    if (prs.has(id)) fail('Pull request id appears twice: ' + id);
    array(p.commitShas, 'pull request commitShas', 5000);
    references += p.commitShas.length;
    if (references > 20_000) fail('Use at most 20,000 total pull-request commit references.');
    const ids = p.commitShas.map(value => shaKey(value, 'pull request commit sha'));
    if (new Set(ids).size !== ids.length) fail('List each commit ID once in a pull request (hex letter case is ignored).');
    const refs = issueRefs(title); inspectRefs(refs, 'pullRequest', id);
    const b = branches.get(branch);
    if (!b) finding('MISSING_BRANCH_RECORD', 'pullRequest', id, 'The named branch is absent from the supplied branch records.');
    else if (refs.length && b.issueRefs.length && refs.some(ref => !b.issueRefs.includes(ref))) finding('BRANCH_PR_ISSUE_MISMATCH', 'pullRequest', id, 'At least one pull-request issue is not referenced by its supplied branch.');
    if (!ids.length) finding('EMPTY_PR_COMMIT_SET', 'pullRequest', id, 'No supplied commits establish this pull request’s membership.');
    for (const [index, commitId] of ids.entries()) {
      const commit = commits.get(commitId);
      if (!commit) finding('UNKNOWN_COMMIT_REFERENCE', 'pullRequest', id, 'Commit ' + p.commitShas[index] + ' is absent from the supplied commit records.');
      else {
        commit.pullRequestIds.push(id);
        if (commit.branch !== branch) finding('COMMIT_PR_BRANCH_MISMATCH', 'commit', commit.sha, 'Pull request ' + id + ' names a different branch.');
        if (commit.issueRefs.length && refs.length && commit.issueRefs.some(ref => !refs.includes(ref))) finding('COMMIT_PR_ISSUE_MISMATCH', 'commit', commit.sha, 'Pull request ' + id + ' omits an issue referenced by this commit.');
      }
      if (!membership.has(commitId)) membership.set(commitId, []);
      membership.get(commitId).push(id);
    }
    prs.set(id, { id, branch, title, issueRefs: refs, commitShas: [...p.commitShas] });
  }
  for (const commit of commits.values()) if (!commit.pullRequestIds.length) finding('UNLINKED_COMMIT', 'commit', commit.sha, 'No supplied pull request lists this exact commit ID.');
  for (const branch of branches.values()) if (!branch.commitIds.length) finding('BRANCH_WITHOUT_COMMITS', 'branch', branch.name, 'No supplied commit uses this branch.');
  const usedIssues = new Set([...branches.values(), ...commits.values(), ...prs.values()].flatMap(record => record.issueRefs));
  return JSON.stringify({ status: findings.length ? 'NEEDS_REVIEW' : issues === null ? 'UNKNOWN_ISSUE_VALIDITY' : 'TRACEABLE_IN_SUPPLIED_DATA', issueValidation: issues === null ? 'UNKNOWN: no issue register was supplied' : 'Exact membership in the supplied issue register only', counts: { issues: issues?.size ?? null, branches: branches.size, commits: commits.size, pullRequests: prs.size, findings: findings.length }, policy: { ...policy, namingChecked: policy.branchPrefixes.length > 0 }, branches: [...branches.values()], commits: [...commits.values()], pullRequests: [...prs.values()], findings, unusedIssueKeys: issues === null ? null : [...issues].filter(key => !usedIssues.has(key)), commitMembership: [...membership].map(([sha, pullRequestIds]) => ({ sha, pullRequestIds })), limitation: 'Local supplied-record checks only. Issue existence/freshness, Git history, branch targets, commit contents, review approvals, CI, security and production deployment are not queried or certified. Hex letter case is ignored for exact commit-ID joins; abbreviated IDs are not expanded. Branch prefixes and one-issue rules apply only when explicitly configured. All strings remain data and no commands or network requests run.' }, null, 2);
}

const source = (path, author) => ({ repo: 'msitarzewski/agency-agents', commit: 'b37b5bb33b78f2c1d6567d98e25ca818e3259219', path, author, licence: 'MIT', url: 'https://github.com/msitarzewski/agency-agents/blob/b37b5bb33b78f2c1d6567d98e25ca818e3259219/' + path });
export const AGENCY_BUSINESS_TOOLS = [
  {
    slug: 'search-term-ngram-analyzer', short: 'Search term n-gram spend analyzer', category: 'marketing', summary: 'Find recurring search-query phrases and reconcile their spend, clicks and conversions from a CSV export.',
    help: 'Paste JSON with csv, n (1–3), one currency code and dateRange.start/end (YYYY-MM-DD). Standard CSV headings are query,cost,clicks,conversions. Change columns to map your headings; set optional clicks/conversions/value mappings to null when unavailable. Map currency/date columns to validate each row, otherwise the scope is only your declaration. Numbers use a decimal dot, no grouping/currency symbols, and up to six decimal places; clicks are whole numbers. Limits: 5,000 records, 100 word tokens per query and 10,000 grams. sourceRows refer to logical CSV record numbers including the header, not physical file lines. Processing stays in this browser; overlapping n-gram totals are not additive and no keyword changes are made.',
    example: JSON.stringify({ n: 2, currency: 'USD', dateRange: { start: '2026-10-01', end: '2026-10-07' }, columns: { query: 'query', cost: 'cost', clicks: 'clicks', conversions: 'conversions', value: 'value', currency: 'currency', date: 'date' }, csv: 'query,cost,clicks,conversions,value,currency,date\nred shoes,10.50,5,1,40,USD,2026-10-01\nred shoes sale,20,10,0,0,USD,2026-10-02\nblue shoes,5,2,0,0,USD,2026-10-03\nred red shoes,8,4,1,32,USD,2026-10-04' }, null, 2),
    run: analyzeNgrams, extension: 'json', sources: [source('paid-media/paid-media-search-query-analyst.md', 'John Williams (@itallstartedwithaidea); Agency Agents contributors')],
  },
  {
    slug: 'issue-git-traceability-checker', short: 'Issue and Git traceability checker', category: 'operations', summary: 'Find missing or inconsistent ticket links across supplied branches, commits and pull requests.',
    help: 'Paste JSON with issues (uppercase PROJECT-123 keys, or null when no register is available), branches [{name}], commits [{sha,branch,subject}] and pullRequests [{id,branch,title,commitShas}]. Commit IDs are 7–64 hex characters and join exactly, ignoring hex letter case; short IDs are not resolved to full hashes. Supply working/head branches, not PR target branches. Optional policy sets branchPrefixes, outerPrefixes (one wrapper stripped) and requireSingleIssue; no repository naming convention is imposed by default. Multiple issue references are retained; enable requireSingleIssue only if your policy needs it. Limits: 1,000 branches, 5,000 commits, 2,000 PRs and 20,000 PR commit references. Checks use only your snapshot, perform no Git/Jira actions and do not certify approvals or release readiness.',
    example: JSON.stringify({ issues: ['APP-7', 'APP-8'], branches: [{ name: 'codex/feature/APP-7-settings' }], commits: [{ sha: 'a1b2c3d', branch: 'codex/feature/APP-7-settings', subject: '✨ APP-7: add account settings' }], pullRequests: [{ id: 'PR-12', branch: 'codex/feature/APP-7-settings', title: 'APP-7 account settings', commitShas: ['a1b2c3d'] }], policy: { branchPrefixes: ['feature/', 'bugfix/', 'hotfix/'], outerPrefixes: ['codex/'], requireSingleIssue: true } }, null, 2),
    run: checkTraceability, extension: 'json', sources: [source('project-management/project-management-jira-workflow-steward.md', 'Agency Agents contributors')],
  },
];
