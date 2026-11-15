// Which house agent leads each kind of job. The orchestrator names one lead; the lead's pack on agents.useaiblocks.com
// carries its role's whole toolbox, so nothing is searched at job time. lead-agents.json is curated by job type from the
// agents' titles and role toolboxes: a variant whose words appear in the request wins, then a setting match (store,
// software, local, nonprofit), then the job's default. An online-store request goes first to the e-commerce agent for
// what is being made (the table's `store` section), with the journey map it follows. Deterministic and model-free.
import TABLE from './lead-agents.json' with { type: 'json' };
import { askOf, isMixedRequest, qualityFamily } from './quality-engine.mjs';

export const AGENTS_ORIGIN = 'https://agents.useaiblocks.com';

const wordsOf = text => new Set(String(text ?? '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
const hasAll = (have, phrase) => String(phrase).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).every(w => have.has(w));
const known = (id, personas) => typeof id === 'string' && id && (!personas || personas.has(id));

/** The settings a request names, in the table's order of preference (first listed first). */
export function settingsOf(request, table = TABLE) {
  const have = wordsOf(request);
  return Object.entries(table.setting_words ?? {}).filter(([, list]) => (list ?? []).some(phrase => hasAll(have, phrase))).map(([setting]) => setting);
}

/**
 * The specialist for the deliverable a request names (its quality card), or null: { id, basis, card, job }. A named
 * deliverable ("push notifications", "a crisis statement") is more specific than a job type, so it leads first.
 */
export function deliverableLead(request, { personas = null, table = TABLE, kind } = {}) {
  if (isMixedRequest(request)) return null;
  const card = qualityFamily(request, kind), row = table.deliverables?.[card];
  if (!row) return null;
  const ids = personas ? new Set(personas) : null;
  // The ask decides first; the whole request (who is asking, their team) decides when the ask names no variant.
  // A variant names words that must all appear, or a pattern for phrasing that loose words would confuse.
  const fits = (v, text) => (v.pattern && new RegExp(v.pattern, 'i').test(text)) || (v.words ?? []).some(phrase => hasAll(wordsOf(text), phrase));
  const pick = text => (row.variants ?? []).find(v => fits(v, text) && known(v.agent, ids));
  const variant = pick(askOf(request)) ?? pick(String(request ?? ''));
  const id = variant?.agent ?? (known(row.agent, ids) ? row.agent : null);
  return { id, basis: `deliverable:${card}`, card, job: row.job ?? null };
}

/**
 * Whether a request is for an online store. A clear online word (Shopify, D2C, ROAS, a product page) decides; otherwise
 * the store setting words do, unless the request is about a physical shop ("in-store", "store manager", "App Store").
 */
export function isStoreRequest(request, table = TABLE) {
  const store = table.store, text = String(request ?? '');
  if (!store) return false;
  if (store.online && new RegExp(store.online, 'i').test(text)) return true;
  if (store.not_online && new RegExp(store.not_online, 'i').test(text)) return false;
  return settingsOf(text, table).includes('store');
}

/**
 * 14 Nov 2026: the e-commerce agent for an online-store request, or null: { id, basis, why, journey }. Before this,
 * store requests went to older house agents that carry neither the e-commerce toolbox nor the journey maps. A rule
 * on what is being made decides (the ask first, then the whole request), then the card's row, then the job type's.
 * A named card the store table does not list (a press pitch, an SOP) keeps its house specialist.
 */
export function storeLead(request, { job, personas = null, table = TABLE } = {}) {
  const store = table.store;
  if (!store || !isStoreRequest(request, table)) return null;
  const card = isMixedRequest(request) ? '_any' : qualityFamily(request);
  if (card && card !== '_any' && !Object.hasOwn(store.cards ?? {}, card)) return null;
  const ids = personas ? new Set(personas) : null, full = String(request ?? ''), ask = askOf(full);
  const test = (pattern, text) => Boolean(pattern) && new RegExp(pattern, 'i').test(text);
  const pick = text => (store.rules ?? []).find(rule => test(rule.pattern, text) && known(rule.agent, ids));
  const rule = pick(ask) ?? (ask !== full ? pick(full) : undefined);
  const cardRow = store.cards?.[card], jobRow = store.jobs?.[job];
  const [row, basis] = rule ? [rule, `store:${rule.id}`] : known(cardRow?.agent, ids) ? [cardRow, `store:card:${card}`] : known(jobRow?.agent, ids) ? [jobRow, `store:job:${job}`] : [null];
  if (!row) return null;
  const journey = (row.journeys ?? []).find(j => test(j.pattern, ask) || test(j.pattern, full))?.journey ?? row.journey ?? null;
  return { id: row.agent, basis, why: row.why ?? store.why ?? null, journey };
}

/** The journey map a single lead follows with the owner, or null: { id, instruction }. */
export function journeyFor(id, table = TABLE) {
  if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id) || !table.store?.journey_line) return null;
  return { id, instruction: table.store.journey_line.replace('<id>', id) };
}

/**
 * The lead agent for a job type and request: { id, basis, why, journey? } or null. `personas`, when given, is the set
 * of agent ids that exist; an agent missing from it is skipped. An online-store request goes to its e-commerce agent
 * first; otherwise a named deliverable's specialist comes first.
 */
export function leadAgentFor(job, request, { personas = null, table = TABLE } = {}) {
  const store = storeLead(request, { job, personas, table });
  if (store?.id) return store;
  const named = deliverableLead(request, { personas, table });
  if (named?.id) return { id: named.id, basis: named.basis, why: `The request names ${named.card.replace(/-/g, ' ')} work, and this specialist does exactly that.` };
  const row = table.jobs?.[job];
  if (!row) return null;
  const have = wordsOf(request), ids = personas ? new Set(personas) : null;
  for (const variant of row.variants ?? []) {
    if ((variant.words ?? []).some(phrase => hasAll(have, phrase)) && known(variant.agent, ids)) return { id: variant.agent, basis: 'variant', why: row.why ?? null };
  }
  for (const setting of settingsOf(request, table)) {
    const id = row.settings?.[setting];
    if (known(id, ids)) return { id, basis: `setting:${setting}`, why: row.why ?? null };
  }
  return known(row.default, ids) ? { id: row.default, basis: 'default', why: row.why ?? null } : null;
}

/** How a host loads an agent: the agents app's MCP tool, or its public pack for a host without that connector. */
export function agentLoad(id) {
  return {
    tool: 'load_agent', server: `${AGENTS_ORIGIN}/mcp`, args: { id },
    pack: { one_file: `${AGENTS_ORIGIN}/packs/${id}.txt`, files: `${AGENTS_ORIGIN}/packs/${id}/files.json`, zip: `${AGENTS_ORIGIN}/packs/${id}.zip` },
    read_first: ['AGENTS.md', 'toolbox.md'],
  };
}
