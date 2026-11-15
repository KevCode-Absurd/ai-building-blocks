// The living org context as data: where it lives, how long each part stays fresh, which slice each kind of job takes,
// and the lines a person's AI is given next. Deterministic and model-free. The org context lives in the client's own
// project under context/org-context/; AI Blocks stores none of it.
// The shared lists (FRESH_DAYS, FAST_KINDS, SLICES, SLICE_PARTS, SLICE_WORDS, BRAND_FILE_PARTS, SLICE_LINES) are also
// in marketplace/src/modules/packs/brand-file.ts and in the tool the AI runs
// (catalogue-items/general/brand-dna-capture/scripts/org-context.mjs); test/brand-file-rules.test.mjs fails when the
// copies differ. SLICE_BY_KIND mirrors CONTEXT_NEED in grounding.mjs and is checked by the same test.

/** One name everywhere: org context (it was the brand brain, then the brand file). `replaces` lists the old index-file names this one index takes over from; the old context/brand-file/ folder is still read until it is moved. */
export const BRAND_FILE = Object.freeze({
  name: 'org context', folder: 'context/org-context', index: 'context/org-context/index.md', worked: 'context/org-context/worked.md',
  raw: 'context/brand-dna.json', tool: 'org-context.mjs', capture: 'capture-brand-dna.mjs', schema: 'ai-blocks-org-context/1',
  replaces: Object.freeze(['brand-brain/00-index.md', 'brand-brain/INDEX.md', '00-start-here.md', 'brand-file/index.md']),
});
/** Days a line stays fresh, by its `volatile` class. A line with no date is stale whatever its class. */
export const FRESH_DAYS = Object.freeze({ fast: 7, slow: 90, fixed: null });
/** The kinds of fact in the fast class. Everything else, and the look and the voice, is slow. */
export const FAST_KINDS = Object.freeze(['price', 'offer', 'stock', 'shipping']);
export const SLICES = Object.freeze(['none', 'facts', 'voice', 'look', 'full']);
/** The parts a slice reads. Stale or missing parts outside the slice never block a job. */
export const SLICE_PARTS = Object.freeze({ none: [], facts: ['offers', 'facts'], voice: ['offers', 'facts', 'voice'], look: ['offers', 'facts', 'look'], full: ['offers', 'facts', 'voice', 'look'] });
/** The most words a slice may hand to a job. */
export const SLICE_WORDS = Object.freeze({ none: 40, facts: 600, voice: 600, look: 600, full: 1500 });
export const BRAND_FILE_PARTS = Object.freeze([
  { id: 'offers', file: 'offers.json', holds: 'Prices, promotions, stock and shipping', fresh: 'fast' },
  { id: 'facts', file: 'facts.json', holds: 'Lasting facts: the business, proof, policies, customers', fresh: 'slow' },
  { id: 'look', file: 'look.json', holds: 'Palette, type, shapes, buttons and imagery', fresh: 'slow' },
  { id: 'voice', file: 'voice.md', holds: 'Real lines, each with its source', fresh: 'slow' },
  { id: 'references', file: 'references.md', holds: 'Admired, avoided and competitors', fresh: null },
  { id: 'worked', file: 'worked.md', holds: 'What the client kept, killed or asked for more of', fresh: null },
]);
/** The short line a job context carries for each slice. Kept under 150 characters: the job brief is capped. */
export const SLICE_LINES = Object.freeze({
  none: 'Org context: not needed for this job. Skip capture.',
  facts: 'Org context: facts only. Run org-context.mjs status, refresh stale prices and stock, then take slice facts.',
  voice: 'Org context: facts and voice. Run org-context.mjs status, refresh what is stale, then take slice voice.',
  look: 'Org context: facts and look. Run org-context.mjs status, refresh what is stale, then take slice look.',
  full: 'Org context: facts, voice and look. Run org-context.mjs status, refresh prices and stock first, then take slice full.',
});
/** The slice each kind of job takes. The same map as CONTEXT_NEED in grounding.mjs. */
export const SLICE_BY_KIND = Object.freeze({ web_page: 'full', ad_creative: 'full', copy: 'voice', email: 'voice', audit: 'facts', analysis: 'none', strategy: 'facts', plan: 'facts', code: 'none', ops_doc: 'none', other: 'none' });
/** Kinds that sell something: their prices and stock are refreshed before anything else. */
export const SELLING_KINDS = Object.freeze(['web_page', 'ad_creative', 'copy', 'email']);

export const sliceFor = kind => SLICE_BY_KIND[kind] ?? 'none';
/** The one short line for a job context: which slice this kind takes and how to get it. */
export const brandFileLine = kind => SLICE_LINES[sliceFor(kind)];

const list = value => Array.isArray(value) ? value : [];
/**
 * What the host reported about the org context, in one shape. Accepts the JSON `org-context.mjs status --json` prints
 * ({exists, parts: [{id, state}], stale: [{kind, source}]}), a short report ({exists, stale: ['offers'], missing: ['voice']}),
 * or nothing at all when the host has not looked yet.
 */
export function readStatus(status, level) {
  if (status === null || status === undefined) return { known: false };
  const needed = SLICE_PARTS[level] ?? [], parts = list(status.parts);
  const named = key => list(status[key]).filter(x => typeof x === 'string');
  const stale = parts.length ? parts.filter(p => p.state === 'stale').map(p => p.id) : [...named('stale_parts'), ...named('stale')];
  const missing = parts.length ? parts.filter(p => p.state === 'missing').map(p => p.id) : named('missing');
  const pages = [...new Set(list(status.stale).filter(x => x && typeof x === 'object' && FAST_KINDS.includes(x.kind) && /^https?:\/\//.test(x.source ?? '')).map(x => x.source))];
  return { known: true, exists: status.exists !== false, stale: stale.filter(id => needed.includes(id)), missing: missing.filter(id => needed.includes(id)), pages };
}

/**
 * The next step for a job, as a state and the lines to give the AI. The rules:
 *   no org context needed          -> say so and skip capture
 *   first job for a client        -> build the org context once; later jobs reuse and update it
 *   needed and fresh              -> take the slice
 *   needed and stale or missing   -> refresh only the stale part (prices and stock first when the job sells), then take the slice
 * Every job that used the org context ends by recording what the client kept or killed, and the next spec reads that first.
 */
export function brandFileStep({ kind, status = null, tools = 'tools' } = {}) {
  const level = sliceFor(kind), sells = SELLING_KINDS.includes(kind);
  const tool = `node ${tools}/${BRAND_FILE.tool}`, capture = `node ${tools}/${BRAND_FILE.capture}`;
  const slice = `${tool} slice ${level} --for ${kind}`;
  if (level === 'none') return { level, state: 'not_needed', lines: [`This ${kind ?? 'other'} job needs no org context. Skip capture and work from the system, files or data.`] };
  const worked = `Before the spec, read ${BRAND_FILE.worked} if it exists: keep what the client kept, leave out what they killed.`;
  const take = `Take only your slice: ${slice} --out context/facts.md. It is all the brand context you read. Lines under RECHECK are not facts until you read them again at the source.`;
  const learn = `At hand-over, record what the client kept, killed or asked for more of: ${tool} learn --job "<job>" --kept "<...>" --killed "<...>" --more "<...>"`;
  const buildWith = `${capture} <site url> <1 to 3 pages that matter>`;
  const build = `First job for this client: build the org context once with ${buildWith}. Later jobs reuse and update it.`;
  const s = readStatus(status, level);
  if (!s.known) return { level, state: 'check', lines: [
    worked,
    `Check the org context: ${tool} status --for ${kind}`,
    `If there is none, this is the first job for this client: build it once with ${buildWith}. Later jobs reuse and update it.`,
    `If parts are stale or missing: refresh only those${sells ? ', prices, offers and stock first,' : ''} by capturing the pages they came from again. Do not capture the whole site.`,
    take, learn,
  ] };
  if (!s.exists) return { level, state: 'build', lines: [build, take, learn] };
  const stale = [...new Set([...s.stale, ...s.missing])];
  if (!stale.length) return { level, state: 'ready', lines: [worked, `The org context is fresh for this job. ${take}`, learn] };
  const refresh = [], fast = stale.includes('offers'), slow = stale.filter(id => id === 'look' || id === 'voice');
  if (fast) refresh.push(`${sells ? 'First refresh' : 'Refresh'} prices, offers, stock and shipping: ${capture} ${s.pages.length ? s.pages.slice(0, 4).join(' ') : '<the pages with prices>'}${sells ? '. Nothing that sells is written before this.' : ''}`);
  if (slow.length) refresh.push(`Refresh the ${slow.join(' and ')}: ${capture} <site url>`);
  if (stale.includes('facts')) refresh.push(`Read the stale facts again at their source, or confirm them with the client and set captured_at in ${BRAND_FILE.folder}/facts.json.`);
  return { level, state: 'refresh', lines: [worked, `Refresh only what is stale (${stale.join(', ')}); leave the rest of the org context as it is.`, ...refresh, take, learn] };
}
/** The instruction lines alone. */
export const brandFileNext = ({ kind, status = null, tools = 'tools' } = {}) => brandFileStep({ kind, status, tools }).lines;
