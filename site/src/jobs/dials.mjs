// Request-time preferences are deterministic data. A one-off request never changes saved defaults.
export const DIAL_NAMES = ['variety_mix', 'families', 'volume', 'decision_style', 'depth', 'modalities', 'risk', 'show_debate', 'ask_before_start'];
export const MIX_PRESETS = Object.freeze({ focused: { preset: 'focused', proven: 100, new: 0, outlier: 0 }, balanced: { preset: 'balanced', proven: 50, new: 30, outlier: 20 }, wide: { preset: 'wide', proven: 20, new: 50, outlier: 30 } });
export const RECOMMENDED_DIALS = Object.freeze({ variety_mix: MIX_PRESETS.balanced, families: 'you_choose', volume: 10, decision_style: 'one_path_plus_options', depth: 'standard', modalities: ['text'], risk: 'normal', show_debate: 'summary', ask_before_start: 'ask_first_time_per_job_type' });
const clone = v => structuredClone(v);
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
export function validateDialValues(input = {}) {
  const errors = [], add = (path, message) => errors.push({ path, message });
  if (!object(input)) return [{ path: 'dials', message: 'Send dial values as an object.' }];
  for (const key of Object.keys(input)) if (!DIAL_NAMES.includes(key)) add(`dials.${key}`, 'Unknown dial.');
  for (const [key, value] of Object.entries(input)) {
    const p = `dials.${key}`;
    if (key === 'variety_mix') {
      const mix = typeof value === 'string' ? MIX_PRESETS[value] : value;
      if (!object(mix) || !['focused', 'balanced', 'wide', 'custom'].includes(mix.preset)) { add(p, 'Choose focused, balanced, wide or a custom mix.'); continue; }
      if (['proven', 'new', 'outlier'].some(k => !Number.isFinite(mix[k]) || mix[k] < 0 || mix[k] > 100) || mix.proven + mix.new + mix.outlier !== 100) add(p, 'Proven, new and outlier must be percentages that sum to 100.');
      if (mix.preset !== 'custom' && ['proven', 'new', 'outlier'].some(k => mix[k] !== MIX_PRESETS[mix.preset][k])) add(p, 'Use custom when changing the preset shares.');
    } else if (key === 'volume' && (!Number.isSafeInteger(value) || value < 1 || value > 200)) add(p, 'Choose a whole count from 1 to 200.');
    else if (key === 'depth' && !['quick', 'standard', 'deep'].includes(value)) add(p, 'Choose quick, standard or deep.');
    else if (key === 'decision_style' && !['one_path_plus_options', 'compare_options', 'options_to_compare'].includes(value)) add(p, 'Choose one_path_plus_options or compare_options.');
    else if (key === 'risk' && !['conservative', 'normal', 'bold'].includes(value)) add(p, 'Choose conservative, normal or bold.');
    else if (key === 'show_debate' && !['summary', 'full_minutes'].includes(value)) add(p, 'Choose summary or full_minutes.');
    else if (key === 'ask_before_start' && !['ask_first_time_per_job_type', 'ask_dials', 'use_defaults', 'use_defaults_silently'].includes(value)) add(p, 'Choose when to ask about dials.');
    else if (key === 'modalities' && (!Array.isArray(value) || !value.length || value.length > 9 || value.some(x => !['text', 'image', 'video', 'audio', '3d', 'interactive', 'doc', 'data', 'code'].includes(x)))) add(p, 'Choose supported output media.');
    else if (key === 'families' && value !== 'you_choose') {
      const validList = (rows, allowEmpty = false) => Array.isArray(rows) && (allowEmpty || rows.length > 0) && rows.length <= 30 && new Set(rows).size === rows.length && rows.every(x => typeof x === 'string' && /^[a-z0-9][a-z0-9-]{0,119}$/.test(x));
      if (object(value)) {
        if (Object.keys(value).some(k => !['prefer', 'avoid'].includes(k)) || !validList(value.prefer ?? [], true) || !validList(value.avoid ?? [], true) || (value.prefer ?? []).some(id => (value.avoid ?? []).includes(id))) add(p, 'Use distinct prefer and avoid family lists.');
      } else if (!validList(value)) add(p, 'Choose family IDs or you_choose.');
    }
  }
  return errors;
}

/** A count is inferred only with an explicit counted noun, never from dates or revenue targets. */
export function requestDials(request, approachJob = {}) {
  const out = {}, text = String(request ?? ''), lower = text.toLowerCase();
  const count = lower.match(/\b(?:give|make|write|create|produce|draft|build|need|want|deliver|design|generate)(?:\s+me)?\s+(\d{1,3})\s+(?:different\s+)?(?:ads?|assets?|creatives?|emails?|options?|routes?|plans?|pages?|messages?|outputs?|posts?|articles?|variants?|scripts?|ideas?|designs?|videos?)\b/);
  if (count && Number(count[1]) > 0 && Number(count[1]) <= 200) out.volume = Number(count[1]);
  if (/\b(?:you decide|you choose|decide for me)\b/.test(lower)) out.variety_mix = clone(MIX_PRESETS.balanced);
  if (/\b(?:wide spread|wide variety|as varied as possible)\b/.test(lower)) out.variety_mix = clone(MIX_PRESETS.wide);
  if (/\b(?:quick team|quick pass|keep it quick)\b/.test(lower)) out.depth = 'quick';
  if (/\b(?:deep review|deep team|in depth)\b/.test(lower)) out.depth = 'deep';
  if (/\b(?:compare options|options to compare)\b/.test(lower)) out.decision_style = 'compare_options';
  const selected = (approachJob.families ?? []).filter(f => lower.includes(String(f.id).replaceAll('-', ' ')) || lower.includes(String(f.name).toLowerCase())).map(f => f.id);
  if (selected.length && /\b(?:only|just|one kind)\b/.test(lower)) { out.families = selected; out.variety_mix = clone(MIX_PRESETS.focused); }
  return out;
}

/** Sources are retained per dial so the delivery can explain defaults in one line. */
export function resolveDials({ request = '', dials = {}, preferences, job, approachJob = {}, host_capabilities = {} } = {}) {
  const explicit = { ...requestDials(request, approachJob), ...dials };
  const recommended = { ...RECOMMENDED_DIALS, volume: approachJob.default_volume ?? 10, modalities: host_capabilities.tools?.filter(t => ['image', 'video', 'audio', '3d', 'interactive', 'text', 'doc', 'data', 'code'].includes(t)) ?? ['text'] };
  if (!recommended.modalities.length) recommended.modalities = ['text'];
  const errors = validateDialValues(explicit);
  if (errors.length) return { ok: false, errors, dials: {} };
  const savedJob = preferences?.by_job_type?.[job] ?? {}, savedGeneral = preferences?.general ?? {};
  const resolved = {};
  for (const key of DIAL_NAMES) {
    let value, source;
    if (Object.hasOwn(explicit, key)) { value = explicit[key]; source = 'request'; }
    else if (Object.hasOwn(savedJob, key)) { value = savedJob[key]; source = 'saved_job_type'; }
    else if (Object.hasOwn(savedGeneral, key)) { value = savedGeneral[key]; source = 'saved_general'; }
    else { value = recommended[key]; source = 'recommended'; }
    if (key === 'families' && object(value)) {
      const known = (approachJob.families ?? []).map(f => f.id), avoided = new Set(value.avoid ?? []), preferred = value.prefer ?? [];
      if (preferred.length || known.length) value = (preferred.length ? preferred : known).filter(id => !avoided.has(id));
    }
    if (key === 'variety_mix') resolved[key] = { ...clone(typeof value === 'string' ? MIX_PRESETS[value] : value), source };
    else resolved[key] = { value: clone(value), source };
  }
  const finalErrors = validateDialValues(Object.fromEntries(Object.entries(resolved).map(([k, v]) => [k, k === 'variety_mix' ? Object.fromEntries(Object.entries(v).filter(([n]) => n !== 'source')) : v.value])));
  return { ok: !finalErrors.length, errors: finalErrors, dials: resolved };
}

export const wantsDefaultSave = text => /\b(?:always|make (?:this|it) my default|save (?:this|these) as my defaults?)\b/i.test(String(text ?? ''));
/**
 * @param {any} previous
 * @param {{job?: string, answers?: Record<string, unknown>, request?: string, feedback?: Array<{family:string, action:string}>, job_id?: string, at?: string, explicit?: boolean}} [options]
 */
export function updatePreferences(previous, { job, answers = {}, request = '', feedback = [], job_id = '', at = new Date().toISOString(), explicit = false } = {}) {
  if (job !== undefined && (typeof job !== 'string' || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(job) || ['constructor', 'prototype', '__proto__'].includes(job))) return { ok: false, errors: [{ path: 'job', message: 'Use a safe job slug.' }], preferences: null, changed: false };
  if (!object(answers) || !Array.isArray(feedback)) return { ok: false, errors: [{ path: 'answers', message: 'Send dial answers as an object and feedback as a list.' }], preferences: null, changed: false };
  if (previous !== undefined && previous !== null && (!object(previous) || !object(previous.general) || !object(previous.by_job_type) || !Array.isArray(previous.history) || !Number.isSafeInteger(previous.version) || previous.version < 0)) return { ok: false, errors: [{ path: 'preferences', message: 'Load a complete saved preference record first.' }], preferences: null, changed: false };
  if (!/^\d{4}-\d{2}-\d{2}T/.test(at) || !Number.isFinite(Date.parse(at))) return { ok: false, errors: [{ path: 'at', message: 'Use an ISO date and time.' }], preferences: null, changed: false };
  const next = clone(previous ?? { schema: 'ai-blocks-job-preferences/1', owner_scope: 'local', version: 0, general: {}, by_job_type: {}, history: [] });
  const save = explicit || wantsDefaultSave(request) || Object.keys(answers).length > 0;
  const errors = validateDialValues(answers);
  if (errors.length) return { ok: false, errors, preferences: next, changed: false };
  if (!save && !feedback.length) return { ok: true, errors: [], preferences: next, changed: false };
  if (!job && feedback.length) return { ok: false, errors: [{ path: 'job', message: 'Feedback needs a job type.' }], preferences: next, changed: false };
  const target = job ? (next.by_job_type[job] ??= {}) : next.general;
  if (save) { Object.assign(target, clone(answers)); if (typeof target.variety_mix === 'string') target.variety_mix = clone(MIX_PRESETS[target.variety_mix]); }
  if (feedback.length) {
    const pool = new Map((target.proven_pool ?? []).map(f => [f.family, f]));
    for (const f of feedback) {
      if (!f.family || !['keep', 'kill', 'more_like_this'].includes(f.action)) continue;
      if (f.action === 'kill') pool.delete(f.family);
      else pool.set(f.family, { family: f.family, evidence: `feedback:${f.action}`, updated: at.slice(0, 10) });
    }
    target.proven_pool = [...pool.values()].sort((a, b) => a.family.localeCompare(b.family)).slice(0, 100);
  }
  next.version += 1;
  next.history = [...next.history, { at, change: feedback.length ? 'Updated proven families from feedback.' : `Saved ${Object.keys(answers).join(', ')}.`, by: feedback.length ? 'feedback' : explicit ? 'explicit_edit' : 'owner_answer', ...(job_id ? { job_id } : {}) }].slice(-50);
  return { ok: true, errors: [], preferences: next, changed: true };
}

export function localPreferences(preferences) {
  return { schema: 'ai-blocks-job-preferences-result/1', preferences: preferences ?? null, recommended: clone(RECOMMENDED_DIALS), store: 'local', files: [{ path: 'ai-blocks/preferences.json', content: JSON.stringify(preferences ?? { schema: 'ai-blocks-job-preferences/1', owner_scope: 'local', version: 0, general: {}, by_job_type: {}, history: [] }, null, 2) }], me_md: '## Job preferences\n\nUse ai-blocks/preferences.json for my saved job dials. A choice in this request takes priority. Ask before changing a saved default unless I answer a dial question or say to save it.\n', instruction: 'Keep this file in the authorized local project. Add the Job preferences section to me.md. Connect an account with write consent to carry defaults across hosts.', model_calls: 0, stored_by_service: false };
}
