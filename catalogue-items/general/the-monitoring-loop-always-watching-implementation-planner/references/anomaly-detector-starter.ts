/**
 * Anomaly Detector Starter
 *
 * Two detectors side by side:
 *   - Z-score (for metrics with roughly normal distributions over time)
 *   - Threshold (absolute + relative bounds, stricter and more interpretable)
 *
 * Both return a common `AnomalyDetectionResult` so the monitoring loop can
 * treat them uniformly.
 *
 * Designed to be called from inside a MonitoringCheck's `checkFn`.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AnomalyDetectionResult {
  anomaly: boolean
  severity: 'info' | 'warning' | 'critical'
  confidence: number            // 0-1
  score: number                 // z-score or normalized deviation
  reason: string
  observed: number
  baseline: number
}

export interface HistoricalSeries {
  values: number[]              // ordered oldest -> newest
  days_covered: number
}

// ============================================================================
// Z-SCORE DETECTOR
// ============================================================================

export function detectZScore(
  observed: number,
  history: HistoricalSeries,
  opts: {
    warnZ?: number        // default 2.0
    criticalZ?: number    // default 3.0
    direction?: 'both' | 'above' | 'below'  // default 'both'
  } = {},
): AnomalyDetectionResult {
  const warnZ = opts.warnZ ?? 2.0
  const criticalZ = opts.criticalZ ?? 3.0
  const direction = opts.direction ?? 'both'

  const n = history.values.length
  if (n < 7) {
    return {
      anomaly: false,
      severity: 'info',
      confidence: 0,
      score: 0,
      reason: `Insufficient history (${n} points)`,
      observed,
      baseline: n === 0 ? 0 : mean(history.values),
    }
  }

  const mu = mean(history.values)
  const sigma = stdDev(history.values, mu)
  if (sigma === 0) {
    return {
      anomaly: observed !== mu,
      severity: 'info',
      confidence: 0.3,
      score: 0,
      reason: 'Baseline has zero variance',
      observed,
      baseline: mu,
    }
  }

  const z = (observed - mu) / sigma
  const absZ = Math.abs(z)

  // Direction filter
  if (direction === 'above' && z <= 0) {
    return { anomaly: false, severity: 'info', confidence: confidenceFromDays(history.days_covered), score: z, reason: 'Below baseline, monitoring above only', observed, baseline: mu }
  }
  if (direction === 'below' && z >= 0) {
    return { anomaly: false, severity: 'info', confidence: confidenceFromDays(history.days_covered), score: z, reason: 'Above baseline, monitoring below only', observed, baseline: mu }
  }

  const severity: AnomalyDetectionResult['severity'] =
    absZ >= criticalZ ? 'critical' : absZ >= warnZ ? 'warning' : 'info'

  return {
    anomaly: absZ >= warnZ,
    severity,
    confidence: confidenceFromDays(history.days_covered),
    score: z,
    reason: `z = ${z.toFixed(2)} (observed ${observed} vs baseline ${mu.toFixed(2)} ± ${sigma.toFixed(2)})`,
    observed,
    baseline: mu,
  }
}

// ============================================================================
// THRESHOLD DETECTOR
// ============================================================================

export function detectThreshold(
  observed: number,
  baseline: number,
  opts: {
    absoluteWarn?: number       // trigger warning if observed >= this
    absoluteCritical?: number   // trigger critical if observed >= this
    relativeWarnPct?: number    // 0.30 = 30% above baseline
    relativeCriticalPct?: number
    direction?: 'above' | 'below'
    baselineConfidence?: number // 0-1, pass through from threshold engine
  },
): AnomalyDetectionResult {
  const direction = opts.direction ?? 'above'
  const signed = observed - baseline
  const relative = baseline === 0 ? 0 : signed / baseline

  const absolutelyCritical = opts.absoluteCritical !== undefined &&
    (direction === 'above' ? observed >= opts.absoluteCritical : observed <= opts.absoluteCritical)
  const absolutelyWarn = opts.absoluteWarn !== undefined &&
    (direction === 'above' ? observed >= opts.absoluteWarn : observed <= opts.absoluteWarn)

  const relativelyCritical = opts.relativeCriticalPct !== undefined &&
    (direction === 'above' ? relative >= opts.relativeCriticalPct : relative <= -opts.relativeCriticalPct)
  const relativelyWarn = opts.relativeWarnPct !== undefined &&
    (direction === 'above' ? relative >= opts.relativeWarnPct : relative <= -opts.relativeWarnPct)

  // REQUIRE both absolute and relative to fire (reduces false positives)
  const critical = absolutelyCritical && relativelyCritical
  const warning = !critical && absolutelyWarn && relativelyWarn

  const severity: AnomalyDetectionResult['severity'] =
    critical ? 'critical' : warning ? 'warning' : 'info'

  return {
    anomaly: warning || critical,
    severity,
    confidence: opts.baselineConfidence ?? 0.7,
    score: relative,
    reason:
      `observed=${observed} baseline=${baseline} rel=${(relative * 100).toFixed(1)}% ` +
      `abs_warn=${opts.absoluteWarn ?? '-'} abs_crit=${opts.absoluteCritical ?? '-'}`,
    observed,
    baseline,
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function mean(xs: number[]): number {
  if (xs.length === 0) return 0
  let s = 0
  for (const x of xs) s += x
  return s / xs.length
}

function stdDev(xs: number[], mu: number): number {
  if (xs.length < 2) return 0
  let s = 0
  for (const x of xs) s += (x - mu) ** 2
  return Math.sqrt(s / (xs.length - 1))
}

function confidenceFromDays(days: number): number {
  if (days >= 90) return 0.95
  if (days >= 30) return 0.85
  if (days >= 14) return 0.7
  if (days >= 7) return 0.55
  return 0.35
}
