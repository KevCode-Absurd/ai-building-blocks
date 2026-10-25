// Reference starter only. Current SKILL.md governs applicability, missing data and evidence.
/**
 * Audit Check Scaffold
 *
 * Minimal template for adding a new audit check to an audit engine.
 * Copy this file, rename the function, and push results to the appropriate
 * evaluator's findings array in your engine.
 *
 * Every check follows the same shape. No exceptions.
 */

// ---------------------------------------------------------------------------
// Types (match the shapes used by the engine)
// ---------------------------------------------------------------------------

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type Category =
  | 'pixel_capi'
  | 'creative'
  | 'structure'
  | 'audience'

export type CheckResult =
  | 'pass'
  | 'warning'
  | 'fail'
  | 'insufficient_data'

export interface Finding {
  checkId: string            // e.g. 'X01', must be unique
  category: Category
  severity: Severity
  result: CheckResult
  title: string              // human-readable check name
  description: string        // what was found on this account
  recommendation: string     // specific action the buyer should take
}

// ---------------------------------------------------------------------------
// Example: a custom check for "Landing Page Load Time" (X01)
// ---------------------------------------------------------------------------

/**
 * X01: Landing Page Load Time
 *
 * Severity: High
 * Rationale: review measured page performance as one possible conversion friction. No fixed revenue or conversion effect is established by this timing rule.
 *
 * PASS: median landing page load < 2.5s
 * WARNING: 2.5s <= median < 4s
 * FAIL: median >= 4s
 * INSUFFICIENT_DATA: no landing page timing data available
 */
export function evaluateLandingPageSpeed(data: {
  landingPageMedianMs: number | null
}): Finding {
  const ms = data.landingPageMedianMs

  if (ms === null || ms === undefined) {
    return {
      checkId: 'X01',
      category: 'structure',
      severity: 'high',
      result: 'insufficient_data',
      title: 'Landing Page Load Time',
      description:
        'No landing page performance data available. Install web vitals ' +
        'tracking or grant access to the store performance dashboard.',
      recommendation:
        'Add a performance observer to your theme or install a web ' +
        'performance app to expose median landing page times.',
    }
  }

  if (ms < 2500) {
    return {
      checkId: 'X01',
      category: 'structure',
      severity: 'high',
      result: 'pass',
      title: 'Landing Page Load Time',
      description: `Median landing page load ${ms}ms, under 2500ms threshold.`,
      recommendation:
        'Maintain. Re-check monthly or after theme updates.',
    }
  }

  if (ms < 4000) {
    return {
      checkId: 'X01',
      category: 'structure',
      severity: 'high',
      result: 'warning',
      title: 'Landing Page Load Time',
      description:
        `Median landing page load ${ms}ms, above 2500ms threshold. ` +
        `Observed timing exceeds this example threshold; business impact is unknown.`,
      recommendation:
        'Audit image sizes on landing pages, defer non-critical JS, ' +
        'enable critical CSS inlining. Target under 2500ms.',
    }
  }

  return {
    checkId: 'X01',
    category: 'structure',
    severity: 'high',
    result: 'fail',
    title: 'Landing Page Load Time',
    description:
      `Median landing page load ${ms}ms, well above 4000ms. ` +
      `Expect 30-50% conversion loss relative to a fast page.`,
    recommendation:
      'Full landing page performance audit required. Image compression, ' +
      'lazy loading, remove blocking third-party scripts, consider a ' +
      'dedicated fast-loading ads landing page separate from main PDP.',
  }
}

// ---------------------------------------------------------------------------
// How to wire this into the engine
// ---------------------------------------------------------------------------

/**
 * Inside your engine's evaluateStructure() function:
 *
 *   findings.push(evaluateLandingPageSpeed({
 *     landingPageMedianMs: data.landingPage?.medianLoadMs ?? null
 *   }))
 *
 * That's the entire integration. The surrounding engine picks up the new
 * finding and includes it in:
 *   - the findings[] output
 *   - the category score math (via the severity multiplier)
 *   - the quick wins ranking (if severity is critical or high)
 *   - the data coverage calculation
 *
 * No other file needs to change.
 */

// ---------------------------------------------------------------------------
// Check ID convention
// ---------------------------------------------------------------------------

/**
 * Public 30-check inventory uses category-prefixed IDs:
 *   P01-P08   Pixel / CAPI Tracking
 *   C01-C10   Creative Performance
 *   S01-S08   Account Structure
 *   A01-A04   Audience Strategy
 *
 * For agency-specific custom checks, use the X-prefix range (X01+).
 * This keeps custom checks separate from the 30 public IDs so future
 * additions to the public inventory never collide with your customizations.
 */
