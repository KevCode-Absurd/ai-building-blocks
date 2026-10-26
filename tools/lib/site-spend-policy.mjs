import assert from 'node:assert/strict';
export const POLICY = Object.freeze({ warnUSD: 10, pauseUSD: 12, targetUSD: 15, pollMinutes: 5, fixedMonthlyUSD: 5, delayMinutes: 15, minBufferUSD: 1, margin: .2 });
const nonnegative = (value, label) => { assert(typeof value === 'number' && Number.isFinite(value) && value >= 0, 'Missing or invalid metric: ' + label); return value; };
const sum = (rows, field) => { assert(Array.isArray(rows), 'Missing dataset: ' + field); return rows.reduce((n, row) => n + nonnegative(row.sum?.[field], field), 0); };
export function estimateSpend(metrics, aiUSD, previous = null, now = Date.now()) {
  nonnegative(aiUSD, 'AI ledger');
  for (const key of ['workers', 'd1', 'd1Storage', 'r2', 'r2Storage']) assert(Array.isArray(metrics[key]) && metrics[key].length < 1000, 'Missing or truncated dataset: ' + key);
  const requests = sum(metrics.workers, 'requests'), cpuUs = sum(metrics.workers, 'cpuTimeUs');
  const d1Bytes = metrics.d1Storage.reduce((n, row) => n + nonnegative(row.max?.databaseSizeBytes, 'D1 bytes'), 0);
  const r2Bytes = metrics.r2Storage.reduce((n, row) => n + nonnegative(row.max?.payloadSize, 'R2 payload') + nonnegative(row.max?.metadataSize, 'R2 metadata'), 0);
  // Ignore included allowances: this intentionally overestimates usage charges.
  // Use the highest current R2 operation/retrieval rate for all operations.
  const r2Requests = sum(metrics.r2, 'requests'), r2ResponseBytes = sum(metrics.r2, 'responseObjectSize');
  const costs = {
    aiAndReservations: aiUSD,
    workerRequests: requests * .30 / 1e6,
    workerCpu: cpuUs / 1000 * .02 / 1e6,
    d1Reads: sum(metrics.d1, 'rowsRead') * .001 / 1e6,
    d1Writes: sum(metrics.d1, 'rowsWritten') / 1e6,
    d1Storage: Math.ceil(d1Bytes / 1e9) * .75 / 28,
    r2Operations: r2Requests * 9 / 1e6,
    r2Retrieval: Math.ceil(r2ResponseBytes / 1e9) * .01,
    r2Storage: Math.ceil(r2Bytes / 1e9) * .015 / 28,
    fixedHosting: POLICY.fixedMonthlyUSD / 28,
    // Diagnostic logging allowance: conservative 20 charged log events per invocation.
    loggingAllowance: requests * 20 / 1e6,
    // R2 rounds operation billing units; reserve an additional unit when active.
    r2RoundingReserve: r2Requests > 0 ? 9 : 0,
  };
  const raw = Object.values(costs).reduce((n, x) => n + x, 0);
  const day = new Date(now).toISOString().slice(0, 10), sameDay = previous?.day === day;
  const elapsedMinutes = sameDay && previous.checkedAt && Number.isFinite(previous.rawUSD) ? (now - Date.parse(previous.checkedAt)) / 60000 : 0;
  const burnPerMinute = elapsedMinutes > 0 && elapsedMinutes <= 30 ? Math.max(0, raw - previous.rawUSD) / elapsedMinutes : 0;
  const buffer = Math.max(POLICY.minBufferUSD, raw * POLICY.margin, burnPerMinute * POLICY.delayMinutes);
  const estimatedUSD = Math.max(raw + buffer, sameDay && Number.isFinite(previous.estimatedUSD) ? previous.estimatedUSD : 0);
  return { day, checkedAt: new Date(now).toISOString(), rawUSD: raw, bufferUSD: buffer, estimatedUSD, costs, requests, cpuUs, sampledAnalytics: true, includedAllowancesIgnored: true };
}
export function decisionFor(estimate, previous = {}) {
  if (previous.pauseLatched) return { status: 'paused', reason: previous.pauseReason ?? 'previous_pause', notify: previous.status !== 'paused' };
  if (estimate.estimatedUSD >= POLICY.pauseUSD) return { status: 'paused', reason: 'daily_spend_threshold', notify: true };
  if (estimate.estimatedUSD >= POLICY.warnUSD) return { status: 'warning', reason: 'approaching_daily_budget', notify: previous.warningDay !== estimate.day };
  return { status: 'healthy', reason: null, notify: ['error', 'warning'].includes(previous.status) };
}
export const sameSettingsExceptEnable = settings => {
  const value = structuredClone(settings); delete value.annotations;
  value.bindings = value.bindings.filter(b => b.name !== 'WORKFLOW_COMPOSER_ENABLED').sort((a, b) => a.name.localeCompare(b.name));
  return value;
};
export function pauseBindings(settings) {
  assert(Array.isArray(settings.bindings), 'Worker bindings unavailable');
  assert(settings.bindings.some(b => b.name === 'WORKFLOW_COMPOSER_ENABLED' && b.type === 'plain_text'), 'Expected AI enable flag missing');
  return settings.bindings.map(b => b.name === 'WORKFLOW_COMPOSER_ENABLED' ? { name: b.name, type: 'plain_text', text: 'false' } : { name: b.name, type: 'inherit' });
}
