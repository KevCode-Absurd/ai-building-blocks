/**
 * Health Score Engine Starter
 *
 * Scaffold for a 12-check health scoring engine. 5 checks are implemented
 * here as reference implementations across all 4 categories. Add the
 * remaining 7 following the same pattern, then scale up from there.
 *
 * The scoring math, category weights, severity multipliers, and
 * aggregation logic are complete. Members only need to implement check
 * functions and register them.
 *
 * Toy domain: storefront health for an e-commerce account. Categories:
 *   tracking, inventory, checkout, trust.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type Category = 'tracking' | 'inventory' | 'checkout' | 'trust'
export type CheckResult = 'pass' | 'warning' | 'fail' | 'insufficient_data'

export interface Finding {
  checkId: string
  category: Category
  severity: Severity
  result: CheckResult
  title: string
  description: string
  recommendation: string
  estimatedFixMinutes?: number
}

export interface HealthScoreReport {
  overallScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  categoryScores: Record<Category, number>
  findings: Finding[]
  quickWins: Finding[]
  dataCoveragePct: number
  coverageWarning: string | null
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SEVERITY_MULTIPLIER: Record<Severity, number> = {
  critical: 5.0,
  high: 3.0,
  medium: 1.5,
  low: 0.5,
}

// Equal weights as a teaching default. Tune these once you have enough
// findings in production to know which category drives the most business risk.
export const CATEGORY_WEIGHTS: Record<Category, number> = {
  tracking: 0.25,
  inventory: 0.25,
  checkout: 0.25,
  trust: 0.25,
}

const RESULT_CREDIT: Record<CheckResult, number> = {
  pass: 1.0,
  warning: 0.5,
  fail: 0.0,
  insufficient_data: 0.0,
}

// ---------------------------------------------------------------------------
// Input shape (what your data pull must provide)
// ---------------------------------------------------------------------------

export interface AuditInputs {
  analytics: { installed: boolean | null; eventsLast7d: number | null }
  catalog: { totalSkus: number | null; outOfStockPct: number | null }
  checkout: { abandonmentRate: number | null; expressCheckoutEnabled: boolean | null }
  trust: { sslValid: boolean | null; reviewsVisible: boolean | null }
}

// ---------------------------------------------------------------------------
// Reference check implementations (5 of 12)
// ---------------------------------------------------------------------------

// H01: Analytics Installed
function checkH01(input: AuditInputs): Finding {
  const active = input.analytics.installed
  if (active === null) {
    return finding('H01', 'tracking', 'critical', 'insufficient_data',
      'Analytics Installed',
      'Analytics configuration could not be read from the site.',
      'Verify the analytics tag is present on all pages.')
  }
  return finding('H01', 'tracking', 'critical',
    active ? 'pass' : 'fail',
    'Analytics Installed',
    active ? 'Analytics firing across standard pages.' : 'Analytics not firing.',
    active ? 'Maintain. Re-check quarterly.' : 'Install or restore the analytics tag via tag manager or native integration.',
    active ? undefined : 30
  )
}

// H02: Recent Events Recorded
function checkH02(input: AuditInputs): Finding {
  const events = input.analytics.eventsLast7d
  if (events === null) return insuff('H02', 'tracking', 'critical', 'Recent Events Recorded')
  if (events >= 1000) {
    return finding('H02', 'tracking', 'critical', 'pass', 'Recent Events Recorded',
      `${events} events recorded in the last 7 days.`,
      'Maintain. Monitor for sudden drops.')
  }
  if (events >= 100) {
    return finding('H02', 'tracking', 'critical', 'warning', 'Recent Events Recorded',
      `${events} events recorded in the last 7 days. Low volume for a live account.`,
      'Check whether the tag is firing on high-traffic pages.', 60)
  }
  return finding('H02', 'tracking', 'critical', 'fail', 'Recent Events Recorded',
    `Only ${events} events in the last 7 days. Tracking is broken or not live.`,
    'Audit the tag firing conditions. Expect at least 1000 events per week on any real storefront.', 120)
}

// H03: Out of Stock Rate
function checkH03(input: AuditInputs): Finding {
  const pct = input.catalog.outOfStockPct
  if (pct === null) return insuff('H03', 'inventory', 'high', 'Out of Stock Rate')
  if (pct <= 0.05) {
    return finding('H03', 'inventory', 'high', 'pass', 'Out of Stock Rate',
      `${(pct * 100).toFixed(1)}% of SKUs out of stock.`,
      'Maintain. Alert when stockout rate breaches 5%.')
  }
  if (pct <= 0.15) {
    return finding('H03', 'inventory', 'high', 'warning', 'Out of Stock Rate',
      `${(pct * 100).toFixed(1)}% of SKUs out of stock.`,
      'Review purchase orders for the top 20 SKUs by revenue.', 90)
  }
  return finding('H03', 'inventory', 'high', 'fail', 'Out of Stock Rate',
    `${(pct * 100).toFixed(1)}% of SKUs out of stock. Ad spend is pushing traffic to unavailable products.`,
    'Pause ads on out-of-stock SKUs and prioritize restock of the top revenue drivers.', 120)
}

// H04: Express Checkout Enabled
function checkH04(input: AuditInputs): Finding {
  const enabled = input.checkout.expressCheckoutEnabled
  if (enabled === null) return insuff('H04', 'checkout', 'medium', 'Express Checkout Enabled')
  return finding('H04', 'checkout', 'medium',
    enabled ? 'pass' : 'warning',
    'Express Checkout Enabled',
    enabled ? 'At least one express checkout option is live.' : 'No express checkout detected. Mobile conversion rate is likely leaving money on the table.',
    enabled ? 'Maintain.' : 'Enable Apple Pay, Google Pay, or Shop Pay on the cart and PDP.', 45)
}

// H05: Reviews Visible
function checkH05(input: AuditInputs): Finding {
  const v = input.trust.reviewsVisible
  if (v === null) return insuff('H05', 'trust', 'high', 'Reviews Visible')
  return finding('H05', 'trust', 'high', v ? 'pass' : 'fail', 'Reviews Visible',
    v ? 'Reviews appear on PDP above the fold.' : 'No reviews surfaced on product pages.',
    v ? 'Maintain. Refresh review widget monthly.' : 'Install a reviews widget and seed with existing social proof.',
    v ? undefined : 60)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function finding(
  id: string, cat: Category, sev: Severity, res: CheckResult,
  title: string, desc: string, rec: string, fixMin?: number
): Finding {
  return { checkId: id, category: cat, severity: sev, result: res,
    title, description: desc, recommendation: rec, estimatedFixMinutes: fixMin }
}

function insuff(id: string, cat: Category, sev: Severity, title: string): Finding {
  return finding(id, cat, sev, 'insufficient_data', title,
    'Data required for this check was not available.',
    'Ensure the account grants the necessary data access.')
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export function scoreFindings(findings: Finding[]): HealthScoreReport {
  const byCategory: Record<Category, { earned: number; possible: number }> = {
    tracking: { earned: 0, possible: 0 },
    inventory: { earned: 0, possible: 0 },
    checkout: { earned: 0, possible: 0 },
    trust: { earned: 0, possible: 0 },
  }

  for (const f of findings) {
    const maxPts = SEVERITY_MULTIPLIER[f.severity] * CATEGORY_WEIGHTS[f.category]
    const earned = maxPts * RESULT_CREDIT[f.result]
    byCategory[f.category].earned += earned
    byCategory[f.category].possible += maxPts
  }

  const categoryScores: Record<Category, number> = {
    tracking: safePct(byCategory.tracking),
    inventory: safePct(byCategory.inventory),
    checkout: safePct(byCategory.checkout),
    trust: safePct(byCategory.trust),
  }

  const overallScore = Math.round(
    (categoryScores.tracking * CATEGORY_WEIGHTS.tracking) +
    (categoryScores.inventory * CATEGORY_WEIGHTS.inventory) +
    (categoryScores.checkout * CATEGORY_WEIGHTS.checkout) +
    (categoryScores.trust * CATEGORY_WEIGHTS.trust)
  )

  const grade = toGrade(overallScore)
  const evaluated = findings.filter(f => f.result !== 'insufficient_data').length
  const coveragePct = findings.length > 0 ? Math.round(evaluated / findings.length * 100) : 0

  const quickWins = identifyQuickWins(findings)

  return {
    overallScore,
    grade,
    categoryScores,
    findings,
    quickWins,
    dataCoveragePct: coveragePct,
    coverageWarning: coveragePct < 70
      ? `Only ${coveragePct}% of checks evaluated. Score may not reflect full account health.`
      : null,
  }
}

function safePct(x: { earned: number; possible: number }): number {
  if (x.possible === 0) return 0
  return Math.round(x.earned / x.possible * 100)
}

function toGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

function identifyQuickWins(findings: Finding[]): Finding[] {
  return findings
    .filter(f =>
      (f.result === 'fail' || f.result === 'warning') &&
      (f.severity === 'critical' || f.severity === 'high') &&
      (f.estimatedFixMinutes !== undefined && f.estimatedFixMinutes <= 30))
    .sort((a, b) => {
      const aImpact = SEVERITY_MULTIPLIER[a.severity] * CATEGORY_WEIGHTS[a.category] *
        (a.result === 'fail' ? 1.0 : 0.5)
      const bImpact = SEVERITY_MULTIPLIER[b.severity] * CATEGORY_WEIGHTS[b.category] *
        (b.result === 'fail' ? 1.0 : 0.5)
      return bImpact - aImpact
    })
    .slice(0, 5)
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export function runHealthScore(input: AuditInputs): HealthScoreReport {
  const findings: Finding[] = [
    checkH01(input),
    checkH02(input),
    checkH03(input),
    checkH04(input),
    checkH05(input),
    // TODO: add H06, H07, H08, H09, H10, H11, H12
    // Follow the same pattern: function returns a Finding, push into array.
  ]
  return scoreFindings(findings)
}
