// Original browser-only implementations informed by MIT Agency Agents profiles:
// msitarzewski/agency-agents@b37b5bb33b78f2c1d6567d98e25ca818e3259219.
// Source profiles are credited below. No profile code is evaluated or executed.
const fail = message => { throw Error(message); };
const MAX_INPUT = 1_000_000;
const MAX_OUTPUT = 5_000_000;
function normalizedNumber(token) {
  const m=token.match(/^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  let digits=(m[2]+(m[3]??'')).replace(/^0+/,'');
  if(!digits)return '0';
  let power=BigInt(m[4]??'0')-BigInt((m[3]??'').length);
  while(digits.endsWith('0')){digits=digits.slice(0,-1);power++;}
  return `${m[1]}${digits}e${power}`;
}
function parse(input) {
  if (typeof input !== 'string' || input.length > MAX_INPUT) fail('Paste JSON text of at most 1,000,000 characters.');
  let value;
  try { value = JSON.parse(input); } catch { fail('Enter valid JSON.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Enter a JSON object.');
  // Reject input digits that JSON.parse would silently round or underflow.
  const unquoted=input.replace(/"(?:[^"\\]|\\.)*"/gs,'""');
  for(const token of unquoted.match(/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g)??[]){
    if(token.length>128)fail('Use numeric tokens of at most 128 characters.');
    const n=Number(token);
    if(!Number.isFinite(n)||normalizedNumber(token)!==normalizedNumber(JSON.stringify(n)))fail('Use finite numbers whose digits survive JSON conversion. Shorten excessive precision; keep identifiers as strings.');
  }
  return value;
}
function list(value, name, maximum, allowEmpty = false) {
  if (!Array.isArray(value) || (!allowEmpty && !value.length) || value.length > maximum) fail(`Provide ${name} as ${allowEmpty ? 'an' : 'a nonempty'} array of at most ${maximum} entries.`);
}
function label(value, name) {
  if (typeof value !== 'string' || !value || value !== value.trim() || value.length > 200) fail(`Use a nonempty ${name} of at most 200 characters, without surrounding spaces.`);
  return value;
}
function distinctLabels(value, name, maximum, allowEmpty = true) {
  list(value, name, maximum, allowEmpty);
  for (const item of value) label(item, name + ' ID');
  if (new Set(value).size !== value.length) fail(`List each ${name} ID only once.`);
  return value;
}
function stringify(value) {
  const output = JSON.stringify(value, null, 2);
  if (output.length > MAX_OUTPUT) fail('The result exceeds 5,000,000 characters. Split the input into smaller claim groups.');
  return output;
}

export function calculatePopulationShift(input) {
  const x = parse(input);
  list(x.buckets, 'buckets', 1000);
  if (x.buckets.length < 2) fail('Provide at least two aligned buckets.');
  const pseudocount = x.pseudocount === undefined ? 0.5 : x.pseudocount;
  if (typeof pseudocount !== 'number' || !Number.isFinite(pseudocount) || pseudocount < 0 || pseudocount > 1_000_000) fail('Use a pseudocount from 0 to 1,000,000. The default is 0.5 per bucket.');
  const labels = new Set();
  let baselineTotal = 0, currentTotal = 0;
  for (const bucket of x.buckets) {
    if (!bucket || typeof bucket !== 'object' || Array.isArray(bucket)) fail('Each bucket needs a label, baseline count and current count.');
    label(bucket.label, 'bucket label');
    if (labels.has(bucket.label)) fail('Bucket labels must be distinct and match the same definition in both populations.');
    labels.add(bucket.label);
    for (const key of ['baseline', 'current']) if (!Number.isSafeInteger(bucket[key]) || bucket[key] < 0 || bucket[key] > 1_000_000_000_000) fail('Use whole baseline/current counts from 0 to 1,000,000,000,000.');
    baselineTotal += bucket.baseline; currentTotal += bucket.current;
  }
  if (!baselineTotal || !currentTotal) fail('Both populations need a positive total. An empty population cannot be compared.');
  if (!Number.isSafeInteger(baselineTotal) || !Number.isSafeInteger(currentTotal)) fail('Population totals exceed safe whole-number precision. Use smaller counts.');
  const adjustedBaselineTotal = baselineTotal + pseudocount * x.buckets.length;
  const adjustedCurrentTotal = currentTotal + pseudocount * x.buckets.length;
  let totalPSI = 0;
  const buckets = x.buckets.map(bucket => {
    const baselineShare = (bucket.baseline + pseudocount) / adjustedBaselineTotal;
    const currentShare = (bucket.current + pseudocount) / adjustedCurrentTotal;
    let contribution;
    if (baselineShare === 0 && currentShare === 0) contribution = 0;
    else if (!baselineShare || !currentShare) fail(`Bucket ${bucket.label} has a one-sided zero share. Its unsmoothed PSI is not finite; choose a positive pseudocount to calculate a smoothed comparison.`);
    else contribution = (currentShare - baselineShare) * Math.log(currentShare / baselineShare);
    if (!Number.isFinite(contribution) || contribution < -1e-12) fail('The supplied counts do not produce a finite PSI contribution.');
    contribution = Math.max(0, contribution);
    totalPSI += contribution;
    return { label: bucket.label, baselineCount: bucket.baseline, currentCount: bucket.current, rawBaselineShare: bucket.baseline / baselineTotal, rawCurrentShare: bucket.current / currentTotal, baselineShare, currentShare, contribution };
  });
  if (!Number.isFinite(totalPSI)) fail('The supplied counts do not produce a finite PSI total.');
  const rawSharesEqual = buckets.every(bucket => Math.abs(bucket.rawBaselineShare - bucket.rawCurrentShare) < 1e-14);
  return stringify({
    method: 'Binned Population Stability Index (PSI)',
    settings: { pseudocountPerBucket: pseudocount, defaultUsed: x.pseudocount === undefined, bucketCount: buckets.length, formula: 'sum((currentShare - baselineShare) * ln(currentShare / baselineShare))', shareDefinition: '(count + pseudocount) / (population total + pseudocount * bucket count)' },
    totals: { baseline: baselineTotal, current: currentTotal, smoothedBaseline: adjustedBaselineTotal, smoothedCurrent: adjustedCurrentTotal },
    buckets, totalPSI, rawSharesEqual,
    smoothingNote: pseudocount === 0 ? 'No pseudocount was added. A bucket absent from both populations contributes zero.' : 'The fixed pseudocount affects smaller populations more. Scaling counts alone can change smoothed PSI; scaling counts and the pseudocount together preserves it. Equal raw proportions with unequal sample totals can differ slightly after smoothing.',
    limitation: 'Describes differences in the supplied bucket counts only. Comparable labels do not prove identical sampling, time windows or bucket definitions. PSI is not a significance test, model-validity certificate or automatic pass/fail decision. No universal drift thresholds are applied.'
  });
}

// Tarjan groups only actual cycles; ancestors that merely lead into a cycle are
// not themselves labelled cyclic. Bound the graph so recursive depth is small.
function findCycles(sources) {
  const index = new Map(), low = new Map(), stack = [], onStack = new Set(), groups = [];
  let cursor = 0;
  function visit(id) {
    index.set(id, cursor); low.set(id, cursor++); stack.push(id); onStack.add(id);
    for (const parent of sources.get(id).derivedFrom) {
      if (!sources.has(parent)) continue;
      if (!index.has(parent)) { visit(parent); low.set(id, Math.min(low.get(id), low.get(parent))); }
      else if (onStack.has(parent)) low.set(id, Math.min(low.get(id), index.get(parent)));
    }
    if (low.get(id) === index.get(id)) {
      const group = []; let member;
      do { member = stack.pop(); onStack.delete(member); group.push(member); } while (member !== id);
      if (group.length > 1 || sources.get(id).derivedFrom.includes(id)) groups.push(group.sort());
    }
  }
  for (const id of sources.keys()) if (!index.has(id)) visit(id);
  return groups.sort((a, b) => a[0].localeCompare(b[0]));
}

export function checkCitationLineage(input) {
  const x = parse(input);
  list(x.sources, 'sources', 500);
  list(x.claims, 'claims', 500, true);
  const sources = new Map(), claimIds = new Set();
  let edgeCount = 0;
  for (const raw of x.sources) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) fail('Every source needs an id and title.');
    const id = label(raw.id, 'source ID'); label(raw.title, 'source title');
    if (sources.has(id)) fail(`Source ID appears twice: ${id}`);
    const derivedFrom = distinctLabels(raw.derivedFrom ?? [], 'derivedFrom', 500);
    const primaryStudyIds = distinctLabels(raw.primaryStudyIds ?? [], 'primaryStudyIds', 100);
    if (raw.confirmedOrigin !== undefined && typeof raw.confirmedOrigin !== 'boolean') fail('confirmedOrigin must be true or false when supplied.');
    edgeCount += derivedFrom.length;
    if (edgeCount > 5000) fail('Use at most 5,000 derived-from relationships.');
    sources.set(id, { id, title: raw.title, derivedFrom, primaryStudyIds, confirmedOrigin: raw.confirmedOrigin === true });
  }
  const claims = x.claims.map((claim, i) => {
    if (!claim || typeof claim !== 'object' || Array.isArray(claim)) fail('Every claim needs sourceIds.');
    const id = label(claim.id ?? `claim-${i + 1}`, 'claim ID');
    if (claimIds.has(id)) fail(`Claim ID appears twice: ${id}`); claimIds.add(id);
    return { id, sourceIds: distinctLabels(claim.sourceIds, 'claim sourceIds', 500, false) };
  });
  const cycles = findCycles(sources), cycleBySource = new Map();
  cycles.forEach((group, i) => group.forEach(id => cycleBySource.set(id, i)));
  const unknownDerivedFrom = [], selfLinks = [], anchorsWithParents = [];
  for (const source of sources.values()) {
    for (const targetId of source.derivedFrom) {
      if (!sources.has(targetId)) unknownDerivedFrom.push({ sourceId: source.id, targetId });
      if (targetId === source.id) selfLinks.push(source.id);
    }
    if ((source.confirmedOrigin || source.primaryStudyIds.length) && source.derivedFrom.length) anchorsWithParents.push(source.id);
  }
  const closures = new Map();
  function trace(start) {
    if (closures.has(start)) return closures.get(start);
    const pending = [start], visited = new Set(), origins = new Set(), unknown = new Set(), unknownOrigins = new Set(), cycleIds = new Set();
    while (pending.length) {
      const id = pending.pop();
      if (visited.has(id)) continue; visited.add(id);
      const node = sources.get(id);
      if (!node) { unknown.add(id); continue; }
      // Explicit study identifiers name the anchor. Do not count the record's
      // own ID again when a primary-study ID was supplied for the same source.
      if (node.confirmedOrigin && !node.primaryStudyIds.length) origins.add(node.id);
      for (const origin of node.primaryStudyIds) origins.add(origin);
      if (!node.derivedFrom.length && !node.confirmedOrigin && !node.primaryStudyIds.length) unknownOrigins.add(node.id);
      if (cycleBySource.has(id)) cycleIds.add(cycleBySource.get(id));
      pending.push(...node.derivedFrom);
    }
    const result = { visited, origins, unknown, unknownOrigins, cycleIds }; closures.set(start, result); return result;
  }
  const results = claims.map(claim => {
    const origins = new Map(), unknown = new Set(), unknownOrigins = new Set(), cycleIds = new Set(), traversed = new Set();
    for (const cited of claim.sourceIds) {
      const t = trace(cited);
      for (const origin of t.origins) { if (!origins.has(origin)) origins.set(origin, []); origins.get(origin).push(cited); }
      for (const id of t.unknown) unknown.add(id);
      for (const id of t.unknownOrigins) unknownOrigins.add(id);
      for (const id of t.cycleIds) cycleIds.add(id);
      for (const id of t.visited) if (sources.has(id)) traversed.add(id);
    }
    return { claimId: claim.id, citedSourceCount: claim.sourceIds.length, knownSuppliedOriginCount: origins.size,
      originGroups: [...origins].sort(([a], [b]) => a.localeCompare(b)).map(([originId, citedSourceIds]) => ({ originId, citedSourceIds: citedSourceIds.sort() })),
      sourcesTraversed: [...traversed].sort(), unresolvedSourceIds: [...unknown].sort(), unknownOriginSourceIds: [...unknownOrigins].sort(), cyclicSourceGroups: [...cycleIds].sort((a, b) => a - b).map(i => cycles[i]),
      allSuppliedBranchesResolved: !unknown.size && !unknownOrigins.size && !cycleIds.size
    };
  });
  return stringify({
    sourceCount: sources.size, claimCount: claims.length, relationshipCount: edgeCount,
    diagnostics: { cyclicSourceGroups: cycles, selfLinks: selfLinks.sort(), unknownDerivedFrom, anchorsWithParents: anchorsWithParents.sort(), anchorsWithParentsNote: 'These nodes declare an origin and also derive from other nodes. Review that supplied relationship; the tool preserves both the declared anchor and all upstream branches.' },
    claims: results,
    interpretation: 'Origin IDs are supplied assertions. An origin group shows repeated use of that supplied origin, not proven scientific independence or quality. Explicit primaryStudyIds name the anchors; confirmedOrigin:true without that list uses the source record ID. A source with no parents remains an unknown origin unless one of those origin assertions is supplied.',
    limitation: 'Graph and ID checks only. No source was opened, fetched or fact-checked. Separate study IDs can still share participants or data; relationships can be incomplete or wrong. Resolving every supplied branch does not prove a claim, source reliability or independent evidence.'
  });
}

const pin = 'b37b5bb33b78f2c1d6567d98e25ca818e3259219';
const source = profile => ({ repo: 'msitarzewski/agency-agents', commit: pin, licence: 'MIT', url: `https://github.com/msitarzewski/agency-agents/blob/${pin}/${profile}` });
export const AGENCY_RESEARCH_TOOLS = [
  { slug: 'population-shift-calculator', short: 'Population shift calculator', category: 'operations', summary: 'Compare bucket counts from two populations. See each bucket’s contribution to their distribution shift.',
    help: 'Enter 2–1,000 buckets with a distinct label and whole baseline/current counts from 0 to 1,000,000,000,000. Use a pseudocount from 0 to 1,000,000 and at most 1,000,000 input characters. Numbers whose digits would be rounded or underflow during JSON conversion are rejected. Definitions and order must match. Both population totals must be positive. pseudocount defaults to 0.5 per bucket; set it explicitly to see its effect. Fixed smoothing affects smaller samples more. No universal threshold or pass/fail verdict is applied. Inputs and calculations stay on this device.',
    example: JSON.stringify({ pseudocount: 0.5, buckets: [{ label: 'Low', baseline: 80, current: 60 }, { label: 'High', baseline: 20, current: 40 }] }, null, 2), run: calculatePopulationShift, extension: 'json', source: source('specialized/specialized-model-qa.md') },
  { slug: 'citation-lineage-checker', short: 'Citation lineage checker', category: 'work', summary: 'Map supplied citation origins. Find shared origins, circular chains and branches whose origin is still unknown.',
    help: 'Enter sources with unique id, title and derivedFrom source-ID arrays; add claims with id and sourceIds. Supply primaryStudyIds:[...] only when you have established those relationships. Alternatively confirmedOrigin:true uses the source ID as its anchor; an explicit study-ID list takes precedence. derivedFrom means the reported claim/data lineage, not every bibliographic citation. Unknown references and cycles are reported. A parentless unconfirmed source stays unknown. IDs match exactly. At most 500 sources, 500 claims and 5,000 relationships. Nothing is fetched or verified; inputs stay on this device.',
    example: JSON.stringify({ sources: [{ id: 'study-A', title: 'Fictional primary study', confirmedOrigin: true, derivedFrom: [] }, { id: 'article-B', title: 'Fictional article', derivedFrom: ['study-A'] }, { id: 'article-C', title: 'Another fictional article', derivedFrom: ['study-A'] }], claims: [{ id: 'claim-1', sourceIds: ['article-B', 'article-C'] }] }, null, 2), run: checkCitationLineage, extension: 'json', source: source('research/research-synthesist.md') }
];
