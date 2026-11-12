// Which house agent leads each kind of job. The orchestrator names one lead; the lead's pack on agents.useaiblocks.com
// carries its role's whole toolbox, so nothing is searched at job time. lead-agents.json is curated by job type from the
// agents' titles and role toolboxes: a variant whose words appear in the request wins, then a setting match (store,
// software, local, nonprofit), then the job's default. Deterministic and model-free.
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
  const have = wordsOf(askOf(request)), ids = personas ? new Set(personas) : null;
  const variant = (row.variants ?? []).find(v => (v.words ?? []).some(phrase => hasAll(have, phrase)) && known(v.agent, ids));
  const id = variant?.agent ?? (known(row.agent, ids) ? row.agent : null);
  return { id, basis: `deliverable:${card}`, card, job: row.job ?? null };
}

/**
 * The lead agent for a job type and request: { id, basis, why } or null. `personas`, when given, is the set of agent
 * ids that exist; an agent missing from it is skipped. A named deliverable's specialist comes first.
 */
export function leadAgentFor(job, request, { personas = null, table = TABLE } = {}) {
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
