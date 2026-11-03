// Scheduled read-backs and guardrail alerts (B4). A registered experiment is read back on a schedule the owner's AI
// runs (a Claude Code scheduled task, a cron-style routine), compared with its baseline, minimum volume and guardrails,
// and closed with an honest verdict when its window ends. Guardrail breaches raise an alert straight away.
// Budget and pause ideas come back as proposals the owner approves; nothing here or in the routine ever applies one.
// Stateless and model-free: the host keeps engagement.json, experiments.jsonl and monitoring.jsonl.
import { fail, refuseSecrets, text } from './engagement.mjs';

export const READBACK_SCHEMA = 'ai-blocks-outcome-readback/1';
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY = 86400000;
const day = s => Date.parse(`${s}T00:00:00Z`);
const iso = t => new Date(t).toISOString().slice(0, 10);
const addDays = (s, n) => iso(day(s) + n * DAY);
const between = (a, b) => Math.round((day(b) - day(a)) / DAY);
const object = (v, label) => v && typeof v === 'object' && !Array.isArray(v) ? v : fail(`${label} must be an object.`);
const num = (v, label) => typeof v === 'number' && Number.isFinite(v) ? v : fail(`${label} must be a number.`);
const count = (v, label) => Number.isSafeInteger(v) && v >= 0 ? v : fail(`${label} must be a whole number.`);
const r3 = x => Math.round(x * 1000) / 1000;
const money = x => Math.round(x * 100) / 100;

/** Experiment registrations and closes from experiments.jsonl (text or parsed lines). */
export function parseExperiments(input) {
  const lines = typeof input === 'string' ? input.split(/\r?\n/).filter(l => l.trim()).map((l, i) => { try { return JSON.parse(l); } catch { return fail(`experiments.jsonl line ${i + 1} is not JSON.`); } }) : Array.isArray(input) ? input : fail('Send experiments.jsonl as text or a list of its lines.');
  const out = new Map();
  for (const x of lines) {
    if (x?.type !== 'experiment') continue;
    const e = out.get(x.id) ?? {};
    if (x.action === 'register') e.register = x; else if (x.action === 'close') e.close = x;
    out.set(x.id, e);
  }
  return out;
}

/** Read-back dates for one registration: every N days through the window, then a final read once the data settles. */
export function readbackDates(reg, { every_days = 7, settle_days = 2 } = {}) {
  const { start, end } = reg.window;
  const dates = [];
  for (let d = addDays(start, every_days); d < end; d = addDays(d, every_days)) dates.push(d);
  return { checks: dates, final: addDays(end, settle_days) };
}

function registrations(engagement, experiments) {
  const parsed = parseExperiments(experiments);
  return Object.entries(engagement.records?.experiments ?? {}).map(([id, rec]) => ({ id, rec, ...parsed.get(id) })).filter(x => x.register);
}

/** The schedule for every open experiment and the routine prompt a host scheduler runs. */
export function planReadbacks(engagement, experiments, { every_days = 7, settle_days = 2, hour = 9, today } = {}) {
  if (![1, 2, 3, 7, 14].includes(every_days)) fail('every_days must be 1, 2, 3, 7 or 14.');
  if (!Number.isSafeInteger(settle_days) || settle_days < 0 || settle_days > 14) fail('settle_days must be 0 to 14.');
  if (!Number.isSafeInteger(hour) || hour < 0 || hour > 23) fail('hour must be 0 to 23.');
  const open = registrations(engagement, experiments).filter(x => x.rec.state === 'REGISTERED');
  const rows = open.map(x => {
    const { checks, final } = readbackDates(x.register, { every_days, settle_days });
    const next = today ? [...checks, final].find(d => d >= today) ?? final : checks[0] ?? final;
    return { id: x.id, metric: x.register.metric, direction: x.register.direction, baseline: x.register.baseline, min_volume: x.register.min_volume, guardrails: x.register.guardrails, window: x.register.window, checks, final, next };
  });
  // Weekly reads run on the weekday the first read falls on; shorter cadences run daily and read only what is due.
  const first = rows[0]?.checks[0] ?? rows[0]?.final ?? today ?? '2026-01-05';
  const cron = every_days >= 7 ? `0 ${hour} * * ${new Date(day(first)).getUTCDay()}` : `0 ${hour} * * *`;
  const prompt = routinePrompt(engagement, rows);
  const md = `# Read-backs\n\n${rows.length ? rows.map(r => `## ${r.id}: ${r.metric}\n\n- Baseline ${r.baseline}, should ${r.direction}; window ${r.window.start} to ${r.window.end}; minimum volume ${r.min_volume}.\n- Guardrails: ${r.guardrails.join('; ') || 'none'}.\n- Read on: ${[...r.checks, `${r.final} (final, closes the test)`].join(', ')}.`).join('\n\n') : 'No open experiments. Register one with record_outcome_experiment before launch.'}\n\n## Routine\n\nSchedule: \`${cron}\` (local time). Set it up only if the owner agrees. It reads numbers and writes files; it never changes budgets, pauses anything or sends messages.\n`;
  return {
    schema: READBACK_SCHEMA, state: rows.length ? 'SCHEDULED' : 'NOTHING_TO_READ', experiments: rows,
    routine: { name: `read-back-${engagement.id}`.slice(0, 60), cron, every_days, hour, prompt, set_up_by: 'the owner\'s AI, only after the owner agrees' },
    files: { 'READBACKS.md': md }, never: ['change a budget', 'pause or switch on anything', 'send a message to customers', 'close a test before its window ends'],
  };
}

export function routinePrompt(engagement, rows) {
  const folder = `outcomes/${engagement.id}/`;
  return `Scheduled read-back for outcome engagement ${engagement.id}. You are the owner's AI. You read numbers and write files only.

1. Open ${folder}. Read engagement.json, experiments.jsonl, monitoring.jsonl (create it if missing) and READBACKS.md.
2. For each experiment due today or overdue (${rows.map(r => `${r.id}: checks ${r.checks.join(', ') || 'none'}, final ${r.final}`).join('; ') || 'none yet'}), read from the owner's connected tools, read-only: the metric value for the window so far, the volume, and the current value of each registered guardrail. Use the same definitions as the baseline. If you cannot read a number, do not guess it: record the read-back as missed and say why.
3. Call read_back_outcome_experiment with the engagement, its engagement_sha256, the text of experiments.jsonl and the reading. Append the returned line to monitoring.jsonl.
4. If the status is GUARDRAIL_BREACH, write the returned ALERTS.md and tell the owner now, in plain words, with the proposals. Do not pause, revert or change anything yourself.
5. If the status is READY_TO_CLOSE, call record_outcome_experiment with the returned close payload, append its line to experiments.jsonl, and tell the owner the verdict and what it means. An INCONCLUSIVE verdict is an honest result, not a failure to hide.
6. List any budget proposals for the owner to approve or decline. Never apply them: no budget, bid, pause or send happens from this routine.
7. Keys and tokens stay in your environment or secret store, never in these files.`;
}

function guardrailResults(registered, readings = []) {
  if (!Array.isArray(readings)) fail('guardrails must be a list.');
  const out = readings.map(g => {
    object(g, 'Guardrail reading');
    const name = text(g.name, 'Guardrail', 300);
    let held = g.held;
    if (g.value !== undefined || g.limit !== undefined) {
      const value = num(g.value, `Guardrail ${name} value`), limit = num(g.limit, `Guardrail ${name} limit`);
      if (!['above', 'below'].includes(g.worse_if)) fail(`Guardrail ${name}: say whether it is broken when the value goes above or below the limit (worse_if).`);
      const computed = g.worse_if === 'above' ? value <= limit : value >= limit;
      if (typeof held === 'boolean' && held !== computed) fail(`Guardrail ${name}: held does not match its value and limit.`);
      held = computed;
      return { name, held, value, limit, worse_if: g.worse_if, ...(g.note ? { note: text(g.note, 'Guardrail note', 500) } : {}) };
    }
    if (typeof held !== 'boolean') fail(`Guardrail ${name}: give held (true or false), or its value, limit and worse_if.`);
    return { name, held, ...(g.note ? { note: text(g.note, 'Guardrail note', 500) } : {}) };
  });
  const unread = registered.filter(n => !out.some(g => g.name === n));
  return { results: out, unread };
}

/**
 * Compare one reading with its registration. reading: { experiment_id, at, observed, volume, guardrails: [...],
 * spend?: { to_date, cap }, source, min_effect? }. Returns the status, an honest verdict and close payload once the
 * window has ended, alerts, proposals (never applied) and the line for monitoring.jsonl.
 */
export function readBack(engagement, experiments, reading, { today, every_days = 7, settle_days = 2 } = {}) {
  object(reading, 'Reading'); refuseSecrets(reading);
  const allowed = ['experiment_id', 'at', 'observed', 'volume', 'guardrails', 'spend', 'source', 'min_effect', 'note'];
  const extra = Object.keys(reading).find(k => !allowed.includes(k));
  if (extra) fail(`Reading has an unsupported field: ${extra}.`);
  const x = registrations(engagement, experiments).find(r => r.id === reading.experiment_id) ?? fail(`No registered experiment ${reading.experiment_id} in engagement.json and experiments.jsonl.`);
  if (x.rec.state !== 'REGISTERED' || x.close) fail(`Experiment ${x.id} is already closed${x.rec.verdict ? ` (${x.rec.verdict})` : ''}.`);
  const reg = x.register;
  const at = DATE.test(reading.at ?? '') ? reading.at : fail('Reading date (at) must be YYYY-MM-DD.');
  if (today && at > today) fail('A reading cannot be dated in the future.');
  const observed = num(reading.observed, 'Observed value'), volume = count(reading.volume, 'Volume');
  const source = text(reading.source, 'Where the numbers were read (source)', 300);
  const minEffect = reading.min_effect === undefined ? 0 : num(reading.min_effect, 'Minimum effect');
  if (minEffect < 0 || minEffect >= 1) fail('min_effect is a relative change from 0 to below 1, such as 0.05 for 5%.');
  const { results, unread } = guardrailResults(reg.guardrails, reading.guardrails ?? []);
  const broken = results.filter(g => !g.held);

  const { start, end } = reg.window;
  const phase = at < start ? 'NOT_STARTED' : at <= end ? 'IN_WINDOW' : 'WINDOW_ENDED';
  const relative = r3(observed / reg.baseline - 1);
  const better = reg.direction === 'decrease' ? observed < reg.baseline : observed > reg.baseline;
  const enough = volume >= reg.min_volume;
  const elapsed = Math.max(1, between(start, at < end ? at : end) + 1), length = between(start, end) + 1;
  const projected = phase === 'IN_WINDOW' ? Math.round(volume / elapsed * length) : volume;

  const proposals = [];
  const propose = (action, why) => proposals.push({ action, why, applied: false, needs_owner_approval: true });
  const alerts = [];
  let status, verdict = null, close = null;
  if (unread.length) {
    status = 'INCOMPLETE_READING';
    alerts.push({ level: 'warning', message: `Guardrails not read: ${unread.join('; ')}. Read them before judging this test.` });
  } else if (broken.length) {
    status = 'GUARDRAIL_BREACH';
    alerts.push({ level: 'urgent', message: `Guardrail broken on ${at}: ${broken.map(g => g.name + (g.value !== undefined ? ` (${g.value} against a limit of ${g.limit})` : '')).join('; ')}. This test cannot be a win.` });
    propose('pause_or_revert_change', `Stop "${reg.change}" until the owner has looked at ${broken.map(g => g.name).join('; ')}.`);
  } else if (phase === 'NOT_STARTED') status = 'NOT_STARTED';
  else if (phase === 'IN_WINDOW') status = better ? 'ON_TRACK' : 'BEHIND';
  else status = 'READY_TO_CLOSE';

  if (phase === 'IN_WINDOW' && projected < reg.min_volume) {
    alerts.push({ level: 'warning', message: `At this pace the test reaches about ${projected} of the ${reg.min_volume} it needs by ${end}, so it will close INCONCLUSIVE.` });
    propose('extend_window', `Extend the window past ${end}, or accept an INCONCLUSIVE verdict. Changing the window means registering a new test.`);
  }
  if (phase === 'WINDOW_ENDED' && !unread.length) {
    // The same rules record_outcome_experiment enforces: low volume is INCONCLUSIVE; a broken guardrail is never a WIN.
    verdict = !enough ? 'INCONCLUSIVE' : broken.length ? 'LOSS' : !better ? 'LOSS' : Math.abs(relative) < minEffect ? 'INCONCLUSIVE' : 'WIN';
    status = broken.length ? 'GUARDRAIL_BREACH' : 'READY_TO_CLOSE';
    close = { action: 'close', id: x.id, observed, volume, guardrail_results: results.map(({ name, held, note }) => ({ name, held, ...(note ? { note } : {}) })), verdict, at };
    if (verdict === 'WIN') propose('keep_change', `Keep "${reg.change}". Any budget increase is a separate decision for the owner, in steps they approve.`);
    if (verdict === 'LOSS') propose('revert_change', `Undo "${reg.change}" or plan a different test; the owner decides.`);
  }
  if (reading.spend !== undefined) {
    const s = object(reading.spend, 'Spend'); const toDate = num(s.to_date, 'Spend to date'), cap = num(s.cap, 'Spend cap');
    const pace = phase === 'IN_WINDOW' ? money(toDate / elapsed * length) : toDate;
    if (pace > cap * 1.05) {
      const daily = money(Math.max(0, cap - toDate) / Math.max(1, length - elapsed));
      alerts.push({ level: toDate > cap ? 'urgent' : 'warning', message: `Spend is on course for ${pace} against a cap of ${cap}.` });
      propose('lower_daily_budget', `Lower the daily budget to about ${daily} for the rest of the window to stay within ${cap}. Owner approves before anything changes.`);
    }
  }

  const line = { type: 'readback', schema: READBACK_SCHEMA, engagement: engagement.id, experiment_id: x.id, at, phase, status, observed, volume, volume_met: enough, projected_volume: projected, relative_change: relative, guardrail_results: results, ...(verdict ? { verdict } : {}), source, proposals: proposals.map(p => p.action) };
  const alertsMd = alerts.length ? `# Alerts\n\n${alerts.map(a => `- **${a.level}** (${at}, ${x.id}): ${a.message}`).join('\n')}\n\n## Proposed, not done\n\n${proposals.map(p => `- ${p.why}`).join('\n') || '- Nothing.'}\n\nNothing has been paused, reverted or changed. Each proposal needs the owner's yes.\n` : null;
  const direction = reg.direction === 'decrease' ? 'down' : 'up';
  const summary = {
    INCOMPLETE_READING: `Read-back of ${reg.metric} on ${at} is missing guardrails, so it is not judged yet.`,
    GUARDRAIL_BREACH: `${reg.metric} read on ${at}: a guardrail broke. The owner needs to look now. Nothing was changed.`,
    NOT_STARTED: `The ${reg.metric} test starts on ${start}.`,
    ON_TRACK: `${reg.metric} is ${observed} against a baseline of ${reg.baseline} (${relative > 0 ? '+' : ''}${Math.round(relative * 100)}%), moving ${direction} as hoped. No verdict until ${end}.`,
    BEHIND: `${reg.metric} is ${observed} against a baseline of ${reg.baseline}, not yet moving ${direction}. No verdict until ${end}; don't stop early on a mid-window number.`,
    READY_TO_CLOSE: `The ${reg.metric} test has ended: ${verdict}. ${verdict === 'INCONCLUSIVE' ? 'There was not enough volume or effect to tell.' : verdict === 'WIN' ? `It beat the baseline by ${Math.abs(Math.round(relative * 100))}% with every guardrail held.` : 'It did not beat the baseline.'}`,
  }[status];
  const next = status === 'READY_TO_CLOSE' || (status === 'GUARDRAIL_BREACH' && close) ? 'Close the test: call record_outcome_experiment with close, then tell the owner the verdict.' : status === 'GUARDRAIL_BREACH' ? 'Tell the owner now and show ALERTS.md. Do not change anything until they decide.' : 'Append the line to monitoring.jsonl. Read again on the next scheduled date.';
  const dates = readbackDates(reg, { every_days, settle_days });
  const upcoming = dates.checks.find(d => d > at) ?? dates.final;
  return {
    schema: READBACK_SCHEMA, status, summary, next, ...(verdict ? { verdict } : {}), ...(close ? { close: { tool: 'record_outcome_experiment', experiment: close } } : {}),
    alerts, proposals, append: { file: 'monitoring.jsonl', line: JSON.stringify(line) + '\n' }, ...(alertsMd ? { files: { 'ALERTS.md': alertsMd } } : {}),
    next_readback: close ? null : upcoming, review: { host_reported: true, applies_changes: false },
  };
}
