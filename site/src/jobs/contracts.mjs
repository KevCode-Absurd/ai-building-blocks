// Structural checks for host-authored job documents. They cannot prove what a host actually ran.
import {discoverStudioFormats} from './studio-discovery.mjs';
import {buildExecutionPlan} from './execution-quality.mjs';
import {VISUAL_DELIVERY_SCHEMA,validateVisualDelivery} from './visual-delivery.mjs';
import landingPageDeliverySchema from './schemas/landing-page-delivery.json' with { type: 'json' };
import {validateLandingPageDelivery} from './landing-page-delivery.mjs';
import {WORK_CONTEXT_SCHEMA,validateWorkContext} from './work-context.mjs';
import jobSchema from './schemas/job.json' with { type: 'json' };
import cardSchema from './schemas/job-card.json' with { type: 'json' };
import teamSchema from './schemas/team-plan-v2.json' with { type: 'json' };
import routesSchema from './schemas/routes.json' with { type: 'json' };
import spreadSchema from './schemas/spread.json' with { type: 'json' };
import councilSchema from './schemas/council.json' with { type: 'json' };
import evidenceSchema from './schemas/evidence.json' with { type: 'json' };
import rubricSchema from './schemas/rubric.json' with { type: 'json' };
import reviewSchema from './schemas/review.json' with { type: 'json' };
import deliverySchema from './schemas/job-delivery.json' with { type: 'json' };
import preferencesSchema from './schemas/job-preferences.json' with { type: 'json' };
import approachesSchema from './schemas/approach-index.json' with { type: 'json' };
import productionSchema from './schemas/production.json' with { type: 'json' };
import { JOB_TIERS, VARIETY_CONFIG, tierConfig, varietyThresholds } from './variety-config.mjs';

export const JOB_SCHEMA = 'ai-blocks-job/1', JOB_CARD_SCHEMA = 'ai-blocks-job-card/1', TEAM_PLAN_SCHEMA = 'ai-blocks-team-plan/2';
export const ROUTES_SCHEMA = 'ai-blocks-routes/1', SPREAD_SCHEMA = 'ai-blocks-spread/1', COUNCIL_SCHEMA = 'ai-blocks-council/1';
export const EVIDENCE_SCHEMA = 'ai-blocks-evidence/1', RUBRIC_SCHEMA = 'ai-blocks-rubric/1', REVIEW_SCHEMA = 'ai-blocks-review/1';
export const DELIVERY_SCHEMA = 'ai-blocks-job-delivery/1', PREFERENCES_SCHEMA = 'ai-blocks-job-preferences/1', APPROACH_INDEX_SCHEMA = 'ai-blocks-approach-index/1';
export const PRODUCTION_SCHEMA = 'ai-blocks-production/1';
export const JOB_SCHEMAS = Object.freeze(Object.fromEntries([jobSchema, cardSchema, teamSchema, routesSchema, spreadSchema, councilSchema, evidenceSchema, rubricSchema, reviewSchema, deliverySchema, preferencesSchema, approachesSchema, productionSchema, landingPageDeliverySchema,VISUAL_DELIVERY_SCHEMA,WORK_CONTEXT_SCHEMA].map(s => [s.title, s])));
export const SCHEMAS = JOB_SCHEMAS;
export const getJobSchema = schema => JOB_SCHEMAS[schema] ?? null;
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const list = v => Array.isArray(v) ? v : [];
const present = v => typeof v === 'string' && v.trim().length > 0;
const key = (p, k) => /^[a-z_][a-z0-9_]*$/i.test(k) ? (p ? `${p}.${k}` : k) : `${p}[${JSON.stringify(k)}]`;
const typesOf = seat => new Set([seat?.seat_type, ...list(seat?.seat_types)].filter(Boolean));
export const hasSeatType = (seat, type) => typesOf(seat).has(type);
const cardOf = c => c.card ?? c.job_card ?? c.jobCard ?? {};
const teamOf = c => c.team ?? c.team_plan ?? c.teamPlan ?? {};
const tierOf = c => c.tier ?? teamOf(c).tier ?? cardOf(c).dials?.depth?.value ?? 'standard';
const indexOf = c => c.approach_index ?? c.approachIndex ?? c.approaches ?? {};
const rowsOf = v => Array.isArray(v) ? v : v instanceof Map ? [...v.values()] : object(v) ? Object.values(v) : [];
const recordFor = (collection, id) => collection instanceof Map ? collection.get(id) : Array.isArray(collection) ? collection.find(x => x?.slug === id || x?.id === id) : collection?.[id];
const catalogueOf = c => c.catalogue?.items ?? c.catalogue?.blocks ?? c.catalogue ?? c.items;
const jobIndexOf = c => {
  const index = indexOf(c), job = c.job_type?.job ?? c.job_type ?? c.job?.job ?? c.job;
  const primary = index.jobs?.[job] ?? (Array.isArray(index.families) ? index : null);
  const card = cardOf(c), launchable = buildExecutionPlan({ request: card.request_verbatim ?? '', card }).landing_pages.delivery_mode === 'LAUNCHABLE_SITE';
  const implementation = launchable && list(index.jobs?.['write-landing-page']?.families).find(family => family.id === 'built-experiences');
  return primary && implementation && !list(primary.families).some(family => family.id === implementation.id) ? { ...primary, families: [...list(primary.families), implementation] } : primary;
};
/** The method palette a team works from. A mixed-work team adds the families of each maker's own job to the primary job's. */
const paletteOf = (c, work = teamOf(c).work) => {
  const primary = jobIndexOf(c), extra = list(work).flatMap(row => list(indexOf(c).jobs?.[row?.job]?.families));
  if (!extra.length) return primary;
  const seen = new Set();
  return { ...(primary ?? {}), families: [...list(primary?.families), ...extra].filter(family => family?.id && !seen.has(family.id) && seen.add(family.id)) };
};
/** A judge who sits outside the council. The reviewer of a mixed-work team is a judge who also holds the red-team seat. */
const pureJudge = seat => hasSeatType(seat, 'judge') && !hasSeatType(seat, 'red_team');
const normalize = v => String(v ?? '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const same = (a, b) => canonicalJobJSON(a) === canonicalJobJSON(b);
export function canonicalJobJSON(value) {
  if (Array.isArray(value)) return '[' + value.map(canonicalJobJSON).join(',') + ']';
  if (object(value)) return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonicalJobJSON(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
export async function jobDocumentDigest(value) {
  const bytes = new TextEncoder().encode(canonicalJobJSON(value));
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2, '0')).join('');
}
export const stateDigest = jobDocumentDigest;

/** Deliberately small JSON Schema evaluator: every keyword used by the published schemas is supported. */
export function checkJobSchema(schema, value) {
  const errors = [], add = (path, message) => errors.push({ path: path || '$', message });
  const fits = (t, v) => t === 'null' ? v === null : t === 'object' ? object(v) : t === 'array' ? Array.isArray(v) : t === 'integer' ? Number.isSafeInteger(v) : t === 'number' ? typeof v === 'number' && Number.isFinite(v) : typeof v === t;
  function walk(s, v, path) {
    if (s === false) { add(path, 'is not allowed.'); return; }
    if (!object(s)) return;
    if (s.type && ![s.type].flat().some(t => fits(t, v))) { add(path, `must be ${[s.type].flat().join(' or ')}.`); return; }
    if (Object.hasOwn(s, 'const') && !same(v, s.const)) add(path, `must equal ${JSON.stringify(s.const)}.`);
    if (s.enum && !s.enum.some(x => same(x, v))) add(path, `must be one of ${s.enum.join(', ')}.`);
    for (const group of ['anyOf', 'oneOf']) if (s[group]) {
      const matches = s[group].filter(branch => checkJobSchema(branch, v).length === 0).length;
      if (!matches || (group === 'oneOf' && matches !== 1)) add(path, `must match ${group === 'oneOf' ? 'exactly one' : 'one'} of the allowed shapes.`);
    }
    for (const branch of s.allOf ?? []) walk(branch, v, path);
    if (typeof v === 'string') {
      if (s.minLength !== undefined && [...v.trim()].length < s.minLength) add(path, `must contain at least ${s.minLength} characters.`);
      if (s.maxLength !== undefined && [...v].length > s.maxLength) add(path, `must contain at most ${s.maxLength} characters.`);
      if (s.pattern && !new RegExp(s.pattern, 'u').test(v)) add(path, `must match ${s.pattern}.`);
    }
    if (typeof v === 'number') {
      if (s.minimum !== undefined && v < s.minimum) add(path, `must be at least ${s.minimum}.`);
      if (s.maximum !== undefined && v > s.maximum) add(path, `must be at most ${s.maximum}.`);
    }
    if (Array.isArray(v)) {
      if (s.minItems !== undefined && v.length < s.minItems) add(path, `needs at least ${s.minItems} entries.`);
      if (s.maxItems !== undefined && v.length > s.maxItems) add(path, `may have at most ${s.maxItems} entries.`);
      if (s.uniqueItems && new Set(v.map(canonicalJobJSON)).size !== v.length) add(path, 'must contain unique entries.');
      if (s.items) v.forEach((x, idx) => walk(s.items, x, `${path}[${idx}]`));
    }
    if (object(v)) {
      const props = s.properties ?? {}, keys = Object.keys(v);
      if (s.minProperties !== undefined && keys.length < s.minProperties) add(path, `needs at least ${s.minProperties} fields.`);
      if (s.maxProperties !== undefined && keys.length > s.maxProperties) add(path, `may have at most ${s.maxProperties} fields.`);
      for (const field of s.required ?? []) if (!Object.hasOwn(v, field)) add(key(path, field), 'is required.');
      for (const field of keys) {
        if (Object.hasOwn(props, field)) walk(props[field], v[field], key(path, field));
        else if (s.additionalProperties === false) add(key(path, field), 'is not an allowed field.');
        else if (object(s.additionalProperties)) walk(s.additionalProperties, v[field], key(path, field));
      }
    }
  }
  walk(schema, value, '');
  return errors;
}

function safeJSON(value, add, maxBytes) {
  const seen = new WeakSet(); let nodes = 0;
  function walk(v, path, depth) {
    if (++nodes > 150000) throw Error('Document has too many values.');
    if (depth > 32) throw Error('Document is nested too deeply.');
    if (v === null || typeof v === 'string' || typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v))) return;
    if (typeof v !== 'object') { add(path, 'must be a JSON value.'); return; }
    if (seen.has(v)) throw Error('Document must not contain a cycle.');
    if (!Array.isArray(v) && Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) { add(path, 'must be a plain JSON object.'); return; }
    seen.add(v);
    for (const [k, x] of Object.entries(v)) {
      if (['__proto__', 'constructor', 'prototype'].includes(k)) add(key(path, k), 'is an unsafe key.');
      walk(x, key(path, k), depth + 1);
    }
    seen.delete(v);
  }
  walk(value, '', 0);
  const serialized = JSON.stringify(value);
  if (serialized === undefined || new TextEncoder().encode(serialized).length > maxBytes) add('$', `must fit within ${maxBytes} bytes.`);
}
function unique(rows, field, path, add) {
  const seen = new Set();
  list(rows).forEach((row, idx) => { const id = row?.[field]; if (id !== undefined && seen.has(id)) add(`${path}[${idx}].${field}`, 'must be unique.'); seen.add(id); });
}
function mixChecks(mix, path, add) {
  if (!object(mix)) return;
  if (['proven', 'new', 'outlier'].every(k => typeof mix[k] === 'number') && Math.abs(mix.proven + mix.new + mix.outlier - 100) > 1e-8) add(path, 'proven, new and outlier must add up to 100.');
  const preset = VARIETY_CONFIG.presets[mix.preset];
  if (preset) for (const [k, v] of Object.entries(preset)) if (mix[k] !== v) add(`${path}.${k}`, `${mix.preset} requires ${v}%. Use custom for other shares.`);
}
function pinned(ref, path, context, add, allowed) {
  if (!object(ref)) return;
  const catalogue = catalogueOf(context), item = recordFor(catalogue, ref.slug);
  if (catalogue && !item) add(`${path}.slug`, 'does not exist in the catalogue.');
  const revision = cRevision(context, ref.slug) ?? item?.revision_sha256 ?? item?.revision?.sha256 ?? item?.sha256;
  if (revision && ref.revision_sha256 !== revision) add(`${path}.revision_sha256`, 'does not match the pinned catalogue revision.');
  if (allowed && !allowed.has(ref.slug)) add(`${path}.slug`, 'does not belong to this family or role toolbox.');
}
function cRevision(context, slug) { return context.manifest?.resources?.[slug]?.revision_sha256 ?? context.manifest?.[slug]?.revision_sha256; }
function safePath(path) {
  return typeof path === 'string' && !path.startsWith('/') && !path.includes('\\') && !/^[a-z]+:/i.test(path) && path.split('/').every(part => part && part !== '.' && part !== '..' && !/[\u0000-\u001f<>:"|?*]/.test(part) && !/[. ]$/.test(part) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part));
}
function cardChecks(d, c, add, warn) {
  if(d.work_context!==undefined)for(const error of validateWorkContext(d.work_context,{request:d.request_verbatim,required:false}).errors)add(error.path,error.message);
  mixChecks(d.dials?.variety_mix, 'dials.variety_mix', add);
  for (const field of ['deliverables', 'constraints', 'context_sources', 'facts', 'unknowns', 'acceptance']) unique(d[field], field === 'deliverables' ? 'kind' : 'id', field, add);
  list(d.acceptance).forEach((row, idx) => { if (present(row?.threshold) && !/\d|\b(?:all|each|every|none|zero|pass|fail|yes|no|complete|present|source|trace|quote|verified|no rework|as is)\b/i.test(row.threshold)) add(`acceptance[${idx}].threshold`, 'must give a measurable count, rate, or pass/fail condition.'); });
  for (const [name, dial] of Object.entries(d.dials ?? {})) {
    if (dial?.source === 'recommended') warn(`dials.${name}`, 'Name this recommended default in the delivery.');
    if (dial?.source !== 'request') continue;
    const explicit = c.explicit_dials ?? c.request_dials;
    if (explicit && Object.hasOwn(explicit, name) && (same(explicit[name], name === 'variety_mix' ? Object.fromEntries(Object.entries(dial).filter(([k]) => !['source', 'source_ref'].includes(k))) : dial.value) || (name === 'variety_mix' && explicit[name] === dial.preset))) continue;
    const answers = list(d.questions_asked).filter(x => x?.by === 'owner').map(x => x.answer).join(' ');
    const input = normalize(`${d.request_verbatim ?? ''} ${answers}`);
    const ref = normalize(dial.source_ref), values = name === 'variety_mix' ? [dial.preset] : Array.isArray(dial.value) ? dial.value : [dial.value];
    if (!(ref && input.includes(ref)) && !values.some(v => (typeof v === 'string' || typeof v === 'number') && normalize(v) && input.includes(normalize(v)))) add(`dials.${name}.source`, 'request must be traceable to the request or an owner answer; include source_ref.');
  }
  const families = d.dials?.families?.value;
  if (d.dials?.variety_mix?.preset === 'focused' && !(Array.isArray(families) && families.length === 1)) add('dials.families', 'focused work must name exactly one family.');
}
function teamChecks(d, c, add) {
  const seats = list(d.seats), tier = d.tier ?? tierOf(c), config = tierConfig(tier), seatById = new Map(seats.map(s => [s?.seat_id, s]));
  // Mixed work: one maker per kind of work, one independent reviewer, and a fact checker when the work carries claims.
  // That team is as small as the work allows, so its size follows the kinds of work, not the tier's usual bench.
  const work = list(d.work), mixed = work.length > 1;
  const minSeats = mixed ? Math.min(config.min_seats, work.length + 2) : config.min_seats, maxSeats = mixed ? Math.max(config.max_seats, work.length + 3) : config.max_seats;
  if (seats.length < minSeats || seats.length > maxSeats) add('seats', `${tier} needs ${minSeats}–${maxSeats} seats.`);
  unique(work, 'kind', 'work', add); unique(work, 'maker_seat', 'work', add);
  work.forEach((row, idx) => { if (!hasSeatType(seatById.get(row?.maker_seat), 'maker')) add(`work[${idx}].maker_seat`, 'must name a maker seat.'); });
  if (mixed && d.lead_seat_id && work[0]?.maker_seat !== d.lead_seat_id) add('work', 'the first row is the lead: its maker makes the primary deliverable.');
  unique(seats, 'seat_id', 'seats', add); unique(d.working_groups, 'id', 'working_groups', add);
  if (seats.filter(s => hasSeatType(s, 'coordinator')).length !== 1) add('seats', 'needs exactly one coordinator.');
  for (const type of ['maker', 'judge', ...(tier === 'quick' ? [] : ['red_team', 'fact_checker'])]) if (!seats.some(s => hasSeatType(s, type))) add('seats', `needs a ${type} seat.`);
  if (tier === 'deep' && seats.filter(s => hasSeatType(s, 'judge')).length < 2) add('seats', 'deep work needs two independent judge seats.');
  const lenses = new Set();
  seats.forEach((seat, idx) => {
    const types = typesOf(seat), p = `seats[${idx}]`;
    if (seat?.seat_types && !seat.seat_types.includes(seat.seat_type)) add(`${p}.seat_types`, 'must include the primary seat_type.');
    if (types.has('maker') && ['coordinator', 'judge', 'fact_checker'].some(t => types.has(t))) add(`${p}.seat_type`, 'coordinator, judge and fact checker cannot also be makers.');
    // In a mixed-work team one reviewer holds both outside checks: it chooses between the candidates (red team) and later
    // reads the finished work as the client would (judge), each in a fresh context. It never makes, coordinates or writes a route.
    if (types.has('judge') && ['coordinator', 'strategist', 'critic', 'mind', ...(mixed ? [] : ['red_team'])].some(t => types.has(t))) add(`${p}.seat_types`, 'the judge must stay out of the council.');
    if (types.has('strategist')) { if (lenses.has(seat.lens)) add(`${p}.lens`, 'strategists must have distinct lenses.'); lenses.add(seat.lens); }
    const roles = c.roles?.roles ?? c.roles, row = recordFor(roles, seat.role_id), profile = recordFor(c.roles?.profiles, seat.role_id), role = row || profile ? { ...row, ...profile } : null;
    if (roles && !role) add(`${p}.role_id`, 'does not exist in the role inventory.');
    const families = list(paletteOf(c, work)?.families).filter(f => list(seat.families).includes(f.id)), seatJob = work.find(row => row?.maker_seat === seat?.seat_id)?.job ?? c.job;
    const roleItems = [...list(role?.toolbox), ...list(role?.core), ...list(role?.extended), ...list(role?.resources)].map(x => typeof x === 'string' ? x : x?.slug);
    const studio = (c.job === 'make-image-ads' || seatJob === 'make-image-ads') && (types.has('maker') || seat.role_id==='media-buyer') ? discoverStudioFormats(c) : null;
    const studioItems = studio ? [...studio.visual_worlds,...studio.image_variants].map(x=>x.method).concat(studio.formats.filter(x=>x.medium==='image').flatMap(x=>x.related_methods)).filter(x=>x.status==='AVAILABLE').map(x=>x.slug) : [];
    const allowed = families.length || role ? new Set([...families.flatMap(f => [...list(f.items), ...list(f.pickers), ...list(f.checks), ...list(f.tool_guides), ...list(f.supporting_items)]), ...roleItems, ...studioItems]) : undefined;
    unique(seat?.toolbox, 'slug', `${p}.toolbox`, add);
    list(seat?.toolbox).forEach((ref, j) => pinned(ref, `${p}.toolbox[${j}]`, c, add, allowed));
  });
  if (d.selected_route && !list(d.route_options).some(r => r?.id === d.selected_route)) add('selected_route', 'must name a route option.');
  const lead = d.lead_seat_id && seatById.get(d.lead_seat_id);
  if (d.lead_seat_id && (!lead || hasSeatType(lead, 'judge'))) add('lead_seat_id', 'must name an existing seat other than an independent judge.');
  const groups = new Map(list(d.working_groups).map(g => [g?.id, g]));
  list(d.working_groups).forEach((g, idx) => {
    const p = `working_groups[${idx}]`, leader = seatById.get(g?.lead_seat_id);
    const members = list(g.seat_ids ?? g.members), reviewGroup = members.length > 0 && members.every(id => { const s = seatById.get(id); return s && !hasSeatType(s, 'maker') && ['judge', 'fact_checker', 'critic'].some(t => hasSeatType(s, t)); });
    if (!leader || (hasSeatType(leader, 'judge') && !reviewGroup) || !members.includes(g.lead_seat_id)) add(`${p}.lead_seat_id`, 'must be a member seat; a judge may lead only an independent review group.');
    for (const seat of members) if (!seatById.has(seat)) add(`${p}.seat_ids`, `unknown seat ${seat}.`);
    const seen = new Set([g.id]); let parent = g.reports_to;
    while (parent) {
      if (seen.has(parent)) { add(`${p}.reports_to`, 'working group reporting must not contain a cycle.'); break; }
      seen.add(parent);
      if (!groups.has(parent) && !seatById.has(parent)) { add(`${p}.reports_to`, 'must name an existing group or seat.'); break; }
      parent = groups.get(parent)?.reports_to;
    }
  });
}
export function routeTextSimilarity(a, b) {
  const x = normalize(a), y = normalize(b);
  if (x === y) return 1;
  const tokens = text => new Set(text.split(' ').filter(Boolean));
  const A = tokens(x), B = tokens(y), union = new Set([...A, ...B]);
  return union.size ? [...A].filter(t => B.has(t)).length / union.size : 1;
}
function routesChecks(d, c, add) {
  const routes = list(d.routes), config = tierConfig(tierOf(c)), seats = list(teamOf(c).seats), facts = list((c.evidence ?? c.ledger)?.claims ?? cardOf(c).facts);
  // In mixed work each maker writes the candidates for its own piece, so the count follows the kinds of work.
  const pieces = list(teamOf(c).work).length, minRoutes = pieces > 1 ? Math.min(config.min_routes, pieces) : config.min_routes, maxRoutes = pieces > 1 ? Math.max(config.max_routes, pieces) : config.max_routes;
  if (routes.length < minRoutes || routes.length > maxRoutes) add('routes', `needs ${minRoutes}–${maxRoutes} routes for this tier.`);
  unique(routes, 'route_id', 'routes', add); unique(routes, 'owner_seat', 'routes', add);
  const lenses = new Set();
  routes.forEach((route, idx) => {
    const seat = seats.find(s => s?.seat_id === route?.owner_seat);
    if (seats.length && !hasSeatType(seat, 'strategist')) add(`routes[${idx}].owner_seat`, 'must name a strategist seat.');
    if (seat && lenses.has(seat.lens)) add(`routes[${idx}].owner_seat`, 'route owners must have different lenses.');
    if (seat) lenses.add(seat.lens);
    if (facts.length || c.evidence || c.ledger || cardOf(c).facts) for (const id of list(route?.evidence)) if (!facts.some(f => f?.id === id)) add(`routes[${idx}].evidence`, `unknown evidence ${id}.`);
    for (let j = 0; j < idx; j++) if (['first_move', 'mechanism', 'segment', 'horizon'].every(k => routeTextSimilarity(route?.differs_on?.[k], routes[j]?.differs_on?.[k]) >= VARIETY_CONFIG.route_similarity_threshold)) add(`routes[${idx}].differs_on`, `is too similar to route ${routes[j]?.route_id}; change the actual approach.`);
  });
  const mix = cardOf(c).dials?.variety_mix;
  if (mix && mix.preset !== 'focused' && tierOf(c) !== 'quick') for (const type of ['new', 'outlier']) if (mix[type] > 0 && !routes.some(r => r?.mix === type)) add('routes', `needs at least one ${type} route.`);
}
function spreadChecks(d, c, add) {
  const slots = list(d.slots), N = slots.length, card = cardOf(c), mix = card.dials?.variety_mix ?? d.variety_mix ?? {}, families = new Map(), makers = new Set(), methods = new Set(), modalities = new Set(), seats = list(teamOf(c).seats), job = paletteOf(c);
  mixChecks(d.variety_mix, 'variety_mix', add);
  if (card.dials?.variety_mix && ['proven', 'new', 'outlier'].some(k => d.variety_mix?.[k] !== mix[k])) add('variety_mix', 'must match the resolved job-card mix.');
  unique(slots, 'slot_id', 'slots', add);
  const count = list(card.deliverables).reduce((sum, x) => sum + (Number.isSafeInteger(x?.count) ? x.count : 0), 0);
  if (count && N !== count) add('slots', `must cover all ${count} requested deliverables.`);
  const chosen = card.dials?.families?.value;
  slots.forEach((slot, idx) => {
    if (!object(slot)) return;
    const p = `slots[${idx}]`, family = list(job?.families).find(f => f.id === slot.family), seat = seats.find(s => s?.seat_id === slot.maker_seat);
    families.set(slot.family, (families.get(slot.family) ?? 0) + 1); makers.add(slot.maker_seat); modalities.add(slot.modality);
    if (job && !family) add(`${p}.family`, 'does not exist in this job palette.');
    if (seats.length && (!hasSeatType(seat, 'maker') || !list(seat?.families).includes(slot.family))) add(`${p}.maker_seat`, 'must be a maker assigned to this family.');
    const requiredImplementation = slot.family === 'built-experiences' && buildExecutionPlan({ request: card.request_verbatim ?? '', card }).landing_pages.delivery_mode === 'LAUNCHABLE_SITE';
    if (Array.isArray(chosen) && !chosen.includes(slot.family) && !requiredImplementation) add(`${p}.family`, 'was not selected in the job card.');
    const allowed = family ? new Set([...list(family.items), ...list(family.pickers), ...list(family.checks), ...list(family.tool_guides), ...list(family.supporting_items)]) : undefined;
    unique(slot.items, 'slug', `${p}.items`, add);
    list(slot.items).forEach((ref, j) => { methods.add(ref?.slug); pinned(ref, `${p}.items[${j}]`, c, add, allowed); });
    const supported = card.dials?.modalities?.value;
    if (Array.isArray(supported) && !supported.includes(slot.modality)) add(`${p}.modality`, 'is outside the job-card modalities.');
    if (family?.modality && !family.modality.includes(slot.modality)) add(`${p}.modality`, 'is not supported by this family.');
  });
  if (mix.preset === 'focused') { if (families.size !== 1) add('slots', 'focused work must stay within one selected family.'); }
  else if (N >= VARIETY_CONFIG.min_slots) {
    const limits = varietyThresholds(mix), required = Math.min(limits.max_families_required, Math.ceil(N / limits.slots_per_family));
    if (families.size < required) add('slots', `needs at least ${required} distinct approach families.`);
    for (const [family, count] of families) if (count / N > limits.max_concentration + 1e-8) add('slots', `${family} exceeds ${limits.max_concentration * 100}% of slots.`);
    if (mix.preset === 'wide') for (const [family, count] of families) if (count > 2) add('slots', `wide work allows at most two slots per family; ${family} has ${count}.`);
  }
  for (const type of ['proven', 'new', 'outlier']) {
    const actual = slots.filter(s => s?.mix === type).length, expected = N * (mix[type] ?? 0) / 100;
    if (Math.abs(actual - expected) > VARIETY_CONFIG.mix_tolerance_slots + 1e-8) add('slots', `${type} share differs by more than one slot from the agreed mix.`);
    if (type === 'outlier' && mix.outlier > 0 && N >= VARIETY_CONFIG.outlier_min_slots && !actual) add('slots', 'needs at least one outlier slot.');
  }
  if (methods.size < families.size) add('slots', 'distinct methods must cover the distinct families.');
  if (families.size >= 2 && makers.size < VARIETY_CONFIG.min_makers) add('slots', 'two or more families need at least two maker seats.');
  const tools = list(c.host_capabilities?.tools ?? c.hostCapabilities?.tools), media = ['image', 'video', 'audio', '3d'].filter(x => tools.includes(x)), allowed = card.dials?.modalities?.value;
  if (media.length > 1 && !(Array.isArray(allowed) && allowed.length === 1) && modalities.size < 2) add('slots', 'use at least two available modalities or record the restriction in the job card.');
}
function councilChecks(d, c, add, warn) {
  const proposals = list(d.proposals), critiques = list(d.critiques), ballots = list(d.ranking?.ballots), labels = new Set(proposals.map(p => p?.label)), team = list(teamOf(c).seats), full = tierOf(c) !== 'quick';
  unique(proposals, 'label', 'proposals', add); unique(ballots, 'by_seat', 'ranking.ballots', add);
  const bodyFor = p => p?.content ?? c.proposal_contents?.[p?.file] ?? c.proposal_contents?.[p?.label] ?? c.proposalContents?.[p?.file] ?? c.files?.[p?.file];
  const counts = new Map(proposals.map(p => [p.label, new Set()]));
  critiques.forEach((critique, idx) => {
    const p = proposals.find(p => p?.label === critique?.on), path = `critiques[${idx}]`, body = bodyFor(p);
    if (!p) { add(`${path}.on`, 'must name an existing proposal.'); return; }
    if (p.owner_seat === critique.by_seat) add(`${path}.by_seat`, 'cannot critique its own proposal.');
    if (team.length && !team.some(s => s?.seat_id === critique.by_seat && !pureJudge(s))) add(`${path}.by_seat`, 'must name a council seat other than the independent judge.');
    const quote = critique.flaw_quote?.replace(/^["“]|["”]$/g, '');
    if (!present(quote)) add(`${path}.flaw_quote`, 'must quote the proposal.');
    else if (typeof body === 'string' && !body.includes(quote)) add(`${path}.flaw_quote`, 'does not appear in the proposal file.');
    else if (typeof body !== 'string') warn(`${path}.flaw_quote`, 'Quote was not independently matched: send the proposal file contents.');
    if (p.owner_seat !== critique.by_seat && present(quote) && (typeof body !== 'string' || body.includes(quote))) counts.get(p.label)?.add(critique.by_seat);
  });
  if (full) for (const [label, reviewers] of counts) if (reviewers.size < 2) add('critiques', `proposal ${label} needs two distinct non-owner critiques.`);
  const scores = new Map(proposals.map(p => [p.label, 0]));
  ballots.forEach((ballot, idx) => {
    const path = `ranking.ballots[${idx}]`, own = proposals.filter(p => p?.owner_seat === ballot?.by_seat).map(p => p.label), expected = [...labels].filter(l => !own.includes(l));
    if (list(ballot?.order).some(l => own.includes(l))) add(`${path}.order`, 'cannot rank its own proposal.');
    if (list(ballot?.order).length !== expected.length || expected.some(l => !list(ballot?.order).includes(l))) add(`${path}.order`, 'must rank each non-owned proposal exactly once.');
    if (team.length && !team.some(s => s?.seat_id === ballot?.by_seat && !pureJudge(s))) add(`${path}.by_seat`, 'must name a council seat other than the independent judge.');
    list(ballot?.order).forEach((label, rank) => { if (!labels.has(label)) add(`${path}.order`, `unknown proposal ${label}.`); else scores.set(label, scores.get(label) + Math.max(0, expected.length - rank)); });
  });
  const result = list(d.ranking?.result);
  if (result.length !== labels.size || [...labels].some(l => !result.includes(l))) add('ranking.result', 'must include every proposal exactly once.');
  for (let idx = 1; idx < result.length; idx++) if (scores.get(result[idx]) > scores.get(result[idx - 1])) add('ranking.result', 'does not match the Borda scores. Ties may be ordered by the chair.');
  for (const chosen of list(d.decision?.chosen)) if (!labels.has(chosen)) add('decision.chosen', `unknown proposal ${chosen}.`);
  for (const row of list(d.decision?.alternative_wins_if)) if (!labels.has(row?.label)) add('decision.alternative_wins_if', `unknown proposal ${row?.label}.`);
  list(d.decision?.option_cards).forEach((o, idx) => { if (!labels.has(o?.from)) add(`decision.option_cards[${idx}].from`, 'must refer to an existing proposal.'); if (o?.rerun?.args?.from_option !== o?.option_id) add(`decision.option_cards[${idx}].rerun.args.from_option`, 'must match this option id.'); });
  if (full && !list(d.red_team).length) add('red_team', 'needs at least one red-team pass.');
  list(d.red_team).forEach((r, idx) => { if (!labels.has(r?.against) || !labels.has(r?.for_weakest)) add(`red_team[${idx}]`, 'must name existing proposals.'); if (r?.by_seat && team.length && !team.some(s => s?.seat_id === r.by_seat && hasSeatType(s, 'red_team'))) add(`red_team[${idx}].by_seat`, 'must name a red-team seat.'); });
  const winner = d.decision?.chosen?.[0] ?? result[0], challenged = critiques.some(x => x?.on === winner && present(x.flaw)), passes = new Set(list(d.red_team).map(x => x?.pass)), unanimous = ballots.length > 0 && ballots.every(x => x?.order?.[0] === winner);
  if (full && !challenged && d.status !== 'CONSENSUS_UNTESTED') add('status', 'must be CONSENSUS_UNTESTED when the winner has no substantive critique.');
  if (full && !challenged && !(passes.has(1) && passes.has(2))) add('red_team', 'untested consensus needs both red-team passes before production.');
  if (full && !(unanimous && passes.has(1) && passes.has(2)) && !present(d.decision?.dissent?.verbatim)) add('decision.dissent', 'record the strongest dissent verbatim.');
  const dissenter = d.decision?.dissent?.by_seat;
  if (dissenter && team.length && !team.some(s => s?.seat_id === dissenter && !pureJudge(s))) add('decision.dissent.by_seat', 'must name a council seat other than the independent judge.');
}
function evidenceChecks(d, c, add) {
  unique(d.claims, 'id', 'claims', add);
  const seats = list(teamOf(c).seats), slots = list(c.spread?.slots), artifacts = list(c.deliverables);
  list(d.claims).forEach((claim, idx) => {
    const seat = seats.find(s => s?.seat_id === claim?.checked_by);
    if (seats.length && (!hasSeatType(seat, 'fact_checker') || hasSeatType(seat, 'maker'))) add(`claims[${idx}].checked_by`, 'must name an independent fact checker.');
    for (const slot of list(claim?.used_in)) if ((slots.length || artifacts.length) && ![...slots, ...artifacts].some(s => s?.slot_id === slot)) add(`claims[${idx}].used_in`, `unknown deliverable ${slot}.`);
    if (claim?.status === 'CONFIRMED' && !present(claim.source)) add(`claims[${idx}].source`, 'confirmed claims need a traceable source.');
  });
}
// The team standard. The job leads by a clear margin, as it does in every craft rubric. What the client receives (usable,
// true, their own material, a fit, clear) carries the rest. The two rows about how the team worked, range and the
// recorded decision, are small: blind judges never see them.
const WEIGHTS = Object.freeze({ job: 30, usable: 15, truth: 15, insight: 10, fit: 10, clear: 10, range: 5, reasoned: 5 });
export const STANDARD_WEIGHTS = WEIGHTS;
function rubricChecks(d, add) {
  unique(d.standard, 'id', 'standard', add);
  for (const [id, weight] of Object.entries(WEIGHTS)) if (!list(d.standard).some(row => row?.id === id && row.weight === weight)) add('standard', `${id} must carry weight ${weight}.`);
  if (d.pass?.overall !== 0.75) add('pass.overall', 'the standard pass threshold is 0.75.');
}
function reviewChecks(d, c, add, warn) {
  const seats = list(teamOf(c).seats), judge = seats.find(s => s?.seat_id === d.judge_seat), artifacts = Array.isArray(c.deliverables) ? c.deliverables : list(c.production?.deliverables ?? c.production?.artifacts), slots = list(c.spread?.slots);
  if (seats.length && (!hasSeatType(judge, 'judge') || hasSeatType(judge, 'maker'))) add('judge_seat', 'must name an independent judge, never a maker.');
  if (artifacts.some(a => (a?.maker_seat ?? a?.producer_seat) === d.judge_seat)) add('judge_seat', 'cannot judge its own deliverables.');
  if (Number.isInteger(d.loop) && d.loop > tierConfig(tierOf(c)).max_revision_loops) add('loop', 'exceeds the revision allowance for this tier.');
  unique(d.items, 'slot_id', 'items', add);
  if (slots.length && (list(d.items).length !== slots.length || slots.some(slot => !list(d.items).some(item => item?.slot_id === slot.slot_id)))) add('items', 'must review every planned deliverable exactly once.');
  list(d.items).forEach((item, idx) => {
    const p = `items[${idx}]`, artifact = artifacts.find(a => a?.slot_id === item?.slot_id), text = artifact?.content ?? artifact?.producer_note ?? c.deliverable_contents?.[item?.slot_id] ?? c.deliverableContents?.[item?.slot_id] ?? (object(c.deliverables) ? c.deliverables[item?.slot_id] : undefined);
    if (item?.verdict === 'REVISE' && !present(item.notes)) add(`${p}.notes`, 'explain the change needed.');
    if (artifacts.length && !artifact) add(`${p}.slot_id`, 'must name a produced deliverable.');
    if (typeof text === 'string' && !text.includes(item?.quote ?? '')) add(`${p}.quote`, 'does not appear in the deliverable or producer note.');
    else if (typeof text !== 'string') warn(`${p}.quote`, 'Quote was not independently matched: send the deliverable or producer note.');
    const scores = item?.scores ?? {}, overall = Object.entries(scores).reduce((sum, [key, value]) => sum + (WEIGHTS[key] ?? 0) * value / 1000, 0), fullScores = Object.keys(WEIGHTS).every(k => typeof scores[k] === 'number');
    if (item?.verdict === 'PASS' && fullScores && overall < (c.rubric?.pass?.overall ?? 0.75)) add(`${p}.verdict`, 'cannot pass below the rubric threshold.');
    if (item?.verdict === 'PASS' && item.critical_passed === false) add(`${p}.critical_passed`, 'critical checks must pass.');
  });
  const critical = list(cardOf(c).acceptance).filter(x => x?.critical);
  for (const criterion of critical) {
    const check = list(d.critical_checks).find(x => x?.id === criterion.id);
    if (!check) add('critical_checks', `must report the critical acceptance check ${criterion.id}.`);
    else if (!check.passed && list(d.items).some(item => item?.verdict === 'PASS')) add('critical_checks', `critical check ${criterion.id} failed; affected deliverables cannot pass.`);
    else if (present(check.quote) && artifacts.length && !artifacts.some(a => `${a?.content ?? ''}\n${a?.producer_note ?? ''}`.includes(check.quote))) add('critical_checks', `quote for ${criterion.id} does not appear in the delivered work or producer notes.`);
  }
}
function productionChecks(d, c, add, warn) {
  if(d.work_context!==undefined)for(const error of validateWorkContext(d.work_context,{request:cardOf(c).request_verbatim??'',required:false,production:true,artifacts:d.artifacts}).errors)add(error.path,error.message);
  for(const scoped of list((c.card??c.job_card)?.deliverables))if(list(d.artifacts).filter(a=>a?.kind===scoped.kind).length!==scoped.count)add('artifacts.kind','meet the scoped count for every deliverable kind.');
  const artifacts = list(d.artifacts), slots = list(c.spread?.slots), seats = list(teamOf(c).seats);
  unique(artifacts, 'slot_id', 'artifacts', add);
  if (slots.length && (artifacts.length !== slots.length || slots.some(slot => !artifacts.some(a => a?.slot_id === slot.slot_id)))) add('artifacts', 'must produce every planned slot exactly once.');
  artifacts.forEach((artifact, idx) => {
    const path = `artifacts[${idx}]`, slot = slots.find(s => s?.slot_id === artifact?.slot_id), maker = seats.find(s => s?.seat_id === artifact?.maker_seat);
    if (!safePath(artifact?.path)) add(`${path}.path`, 'must be a safe relative file path.');
    if (seats.length && !hasSeatType(maker, 'maker')) add(`${path}.maker_seat`, 'must name a maker seat.');
    if (slot && ['maker_seat', 'family', 'modality'].some(k => artifact?.[k] !== slot[k])) add(path, 'must match its planned maker, family and modality.');
    if (slot && list(slot.items).some(ref=>!list(artifact?.items).some(actual=>actual.slug===ref.slug&&actual.revision_sha256===ref.revision_sha256))) add(`${path}.items`, 'must retain every planned pinned method in its spread slot.');
    const contributors=list(artifact?.contributor_seats).map(id=>seats.find(seat=>seat?.seat_id===id));
    if(contributors.some(seat=>!hasSeatType(seat,'maker')))add(`${path}.contributor_seats`,'every contributor must be a staffed maker, separate from independent review.');
    const producerPins=[...list(maker?.toolbox),...contributors.flatMap(seat=>list(seat?.toolbox))];
    const extra=slot?list(artifact?.items).filter(ref=>!list(slot.items).some(planned=>planned.slug===ref.slug)):[];
    for(const ref of extra){if(!producerPins.some(pin=>pin.slug===ref.slug&&pin.revision_sha256===ref.revision_sha256))add(`${path}.items`,'additional methods must belong to the maker’s pinned role toolbox.');if(!list(artifact?.method_amendments).some(change=>change.slug===ref.slug&&present(change.reason)))add(`${path}.method_amendments`,'explain each extra role method needed during production.');}
    for (const ref of list(artifact?.items)) pinned(ref, `${path}.items`, c, add);
    const budget = artifact?.budget;
    if(budget?.used===null){
      if(budget.usage_status!=='NOT_AVAILABLE'||!present(budget.reason))add(`${path}.budget`,'unknown total tool use needs NOT_AVAILABLE and an explanation or receipt reference.');
    }else{
      if(budget?.usage_status==='NOT_AVAILABLE')add(`${path}.budget.usage_status`,'use null when the total is not available.');
      if (budget?.used > budget?.allowance) add(`${path}.budget`, 'exceeds the tool-call allowance.');
      if (budget?.allowance > 0 && budget.used < budget.allowance * 0.6 && !present(budget.reason)) add(`${path}.budget.reason`, 'explain why less than 60% of the allowance was used.');
    }
    if (list(artifact?.checks).some(check => check?.status !== 'PASS')) warn(`${path}.checks`, 'Producer checks have open failures. The judge must check them and the delivery must report unresolved issues.');
    for (const id of list(artifact?.claims)) if (!list(d.evidence?.claims).some(claim => claim?.id === id && list(claim.used_in).includes(artifact.slot_id))) add(`${path}.claims`, `claim ${id} is missing from the ledger or is not linked to this artifact.`);
  });
  const evidence = validateJobDocument(EVIDENCE_SCHEMA, d.evidence, { ...c, deliverables: artifacts });
  for (const error of evidence.errors) add(`evidence.${error.path}`, error.message);
  for (const warning of evidence.warnings) warn(`evidence.${warning.path}`, warning.message);
  const lead = d.lead_review?.by_seat;
  if (teamOf(c).lead_seat_id && lead !== teamOf(c).lead_seat_id) add('lead_review.by_seat', 'must be the agreed task lead.');
  if (seats.length && !seats.some(s => s?.seat_id === lead && !hasSeatType(s, 'judge'))) add('lead_review.by_seat', 'must name an existing seat other than the independent judge.');
  if (d.lead_review?.status !== 'PASS') add('lead_review.status', 'task lead must accept the production handoff.');
}
function deliveryChecks(d, c, add) {
  unique(d.files, 'path', 'files', add); unique(d.deliverables, 'slot_id', 'deliverables', add);
  if(d.delivery_root!==undefined&&!safePath(d.delivery_root))add('delivery_root','must be a safe relative directory.');
  const required = ['DELIVERY.md', 'DECISIONS.md', 'EVIDENCE.md', 'REVIEW.md', 'TEAM.md', 'run.json', ...(c.spread ? ['SPREAD.md'] : [])].map(name=>d.delivery_root?d.delivery_root+'/'+name:name), paths = new Set(list(d.files).map(f => d.delivery_root?f?.path:f?.path?.replace(/^delivery\//, '')));
  for (const name of required) if (!paths.has(name)) add('files', `delivery pack is missing ${name}.`);
  for (const field of ['files', 'deliverables']) list(d[field]).forEach((file, idx) => { if (!safePath(file?.path)) add(`${field}[${idx}].path`, 'must be a safe relative file path.'); if (!/^[a-f0-9]{64}$/.test(file?.sha256 ?? '')) add(`${field}[${idx}].sha256`, 'must pin the exact file contents.'); });
  const slots = list(c.spread?.slots);
  if (slots.length && (list(d.deliverables).length !== slots.length || slots.some(slot => !list(d.deliverables).some(a => a?.slot_id === slot.slot_id)))) add('deliverables', 'must deliver every planned slot exactly once.');
  const review = c.review;
  if (review && (review.set_checks?.count_met !== true || review.set_checks?.variety_contract === 'FAIL' || review.set_checks?.decision_record === 'FAIL' || list(review.items).some(i => i?.verdict !== 'PASS')) && !list(d.flags ?? d.open_flags).length) add('flags', 'record unresolved review failures before delivery.');
}
function preferencesChecks(d, c, add) {
  const scope = c.owner_scope ?? c.ownerScope;
  if (scope && d.owner_scope !== scope) add('owner_scope', 'must match the authenticated person and workspace.');
  if (!(d.owner_scope === 'local' || /^account:[^/\s]+\/[^/\s]+$/.test(d.owner_scope ?? ''))) add('owner_scope', 'must be local or account:<user>/<workspace>.');
  for (const [name, values] of [['general', d.general], ...Object.entries(d.by_job_type ?? {}).map(([k, v]) => [`by_job_type.${k}`, v])]) {
    if (!object(values)) continue;
    if (values.variety_mix) mixChecks(values.variety_mix, `${name}.variety_mix`, add);
    const f = values.families;
    if (object(f) && list(f.prefer).some(id => list(f.avoid).includes(id))) add(`${name}.families`, 'a family cannot be both preferred and avoided.');
    unique(values.proven_pool, 'family', `${name}.proven_pool`, add);
  }
}
function approachesChecks(d, c, add) {
  const catalogue = catalogueOf(c);
  for (const [job, data] of Object.entries(d.jobs ?? {})) {
    if (!object(data)) continue;
    const p = `jobs.${job}`, families = list(data.families), counts = new Map();
    unique(families, 'id', `${p}.families`, add); unique(data.lenses, 'id', `${p}.lenses`, add);
    families.forEach((family, idx) => {
      for (const field of ['items', 'pickers', 'checks', 'tool_guides', 'seeds_from', 'supporting_items']) for (const slug of list(family?.[field])) if (catalogue && !recordFor(catalogue, slug)) add(`${p}.families[${idx}].${field}`, `unknown catalogue item ${slug}.`);
      for (const slug of list(family?.items)) counts.set(slug, (counts.get(slug) ?? 0) + 1);
    });
    for (const [slug, count] of counts) if (count > 3) add(`${p}.families`, `${slug} belongs to more than three families in this job.`);
    const makeCount = c.make_counts?.[job] ?? rowsOf(catalogue).filter(x => x?.job === job && ['make', 'render'].includes(x?.role)).length;
    if (makeCount >= 10 && families.length < 4) add(`${p}.families`, 'jobs with ten or more make/render items need at least four families.');
  }
}

/** All errors are returned together. No content or host-reported check grants authority to act. */
export function validateJobDocument(schema, document, context = {}) {
  const errors = [], warnings = [], add = (path, message) => errors.push({ path: path || '$', message }), warn = (path, message) => warnings.push({ path: path || '$', message });
  try {
    if (!object(context)) context = {};
    const spec = getJobSchema(schema);
    if (!spec) { add('schema', 'is not a supported job schema.'); return { ok: false, errors, warnings }; }
    safeJSON(document, add, schema === APPROACH_INDEX_SCHEMA ? 10 * 1024 * 1024 : 256 * 1024);
    if (errors.length) return { ok: false, errors, warnings };
    errors.push(...checkJobSchema(spec, document));
    if (!object(document)) return { ok: false, errors, warnings };
    const handlers = { [JOB_CARD_SCHEMA]: cardChecks, [TEAM_PLAN_SCHEMA]: teamChecks, [ROUTES_SCHEMA]: routesChecks, [SPREAD_SCHEMA]: spreadChecks, [COUNCIL_SCHEMA]: councilChecks, [EVIDENCE_SCHEMA]: evidenceChecks, [REVIEW_SCHEMA]: reviewChecks, [DELIVERY_SCHEMA]: deliveryChecks, [PREFERENCES_SCHEMA]: preferencesChecks, [APPROACH_INDEX_SCHEMA]: approachesChecks, [PRODUCTION_SCHEMA]: productionChecks };
    if (schema === RUBRIC_SCHEMA) rubricChecks(document, add);
    else if (schema === landingPageDeliverySchema.title) errors.push(...validateLandingPageDelivery(document, { requireLaunchable: document.mode === 'LAUNCHABLE_SITE', artifacts: context.artifacts, existingSiteRequired: context.existing_site_required === true }).errors);
    else if (schema === VISUAL_DELIVERY_SCHEMA.title) errors.push(...validateVisualDelivery(document,{artifacts:context.artifacts??list(document.items).map(row=>({slot_id:row?.slot_id,sha256:row?.sha256,modality:'image'})),request:cardOf(context).request_verbatim??''}).errors);
    else if (schema === WORK_CONTEXT_SCHEMA.title) errors.push(...validateWorkContext(document,{request:context.request??cardOf(context).request_verbatim??'',required:document.mode!=='CREATE',production:context.production_check===true,artifacts:context.artifacts??[]}).errors);
    else handlers[schema]?.(document, context, add, warn);
  } catch (error) { add('$', error instanceof Error ? error.message : 'must be a valid JSON document.'); }
  return { ok: errors.length === 0, errors, warnings };
}
export const validateSpread = (document, context = {}) => validateJobDocument(SPREAD_SCHEMA, document, context);
export const validateCouncil = (document, context = {}) => validateJobDocument(COUNCIL_SCHEMA, document, context);
export const validateReview = (document, context = {}) => validateJobDocument(REVIEW_SCHEMA, document, context);
export const validateRoutes = (document, context = {}) => validateJobDocument(ROUTES_SCHEMA, document, context);
export const validateJobCard = (document, context = {}) => validateJobDocument(JOB_CARD_SCHEMA, document, context);
export const validateJobTeamPlan = (document, context = {}) => validateJobDocument(TEAM_PLAN_SCHEMA, document, context);
