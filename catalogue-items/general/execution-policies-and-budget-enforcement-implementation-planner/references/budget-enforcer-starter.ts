/**
 * Budget Enforcer Starter
 *
 * Hard spending limits with warnings and auto-pause. Works alongside the
 * per-call CostTracker (Lesson 16) and the per-issue ExecutionPolicyEnforcer.
 *
 * Two check points:
 *   - At heartbeat pre-flight (block the whole heartbeat if over cap)
 *   - Inside callAI (block the individual call)
 *
 * Feature-gated: no `spend_limits` rows = no enforcement.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SpendLimit {
  id: string
  scope: 'system' | 'agent' | 'project'
  scope_id: string | null    // agent_id, project_id, or null for system-wide
  window: 'daily' | 'monthly' | 'lifetime'
  limit_usd: number
  warn_percent: number        // 0-100
  hard_stop: boolean
  status: 'active' | 'paused' | 'archived'
}

export interface LimitBreach {
  policy_id: string
  agent_id: string
  observed_usd: number
  limit_usd: number
  action_taken: 'warn' | 'pause' | 'override'
}

export interface BudgetCheckResult {
  allowed: boolean
  warnings: string[]
  incidents: LimitBreach[]
}

export class BudgetExceededError extends Error {
  constructor(
    public agentId: string,
    public policyId: string,
    public observed: number,
    public limit: number,
  ) {
    super(`Agent ${agentId} exceeded budget policy ${policyId}: $${observed.toFixed(2)} / $${limit.toFixed(2)}`)
    this.name = 'BudgetExceededError'
  }
}

// ============================================================================
// DI
// ============================================================================

type FetchPoliciesFn = (agentId: string) => Promise<SpendLimit[]>
type FetchSpendFn = (args: {
  agentId: string
  scope: SpendLimit['scope']
  sinceIso: string | null
}) => Promise<number>
type RecordIncidentFn = (incident: LimitBreach) => Promise<string>
type PauseAgentFn = (agentId: string, reason: string) => Promise<void>

let fetchPolicies: FetchPoliciesFn | null = null
let fetchSpend: FetchSpendFn | null = null
let recordIncident: RecordIncidentFn | null = null
let pauseAgent: PauseAgentFn | null = null

export function setFetchPolicies(fn: FetchPoliciesFn): void { fetchPolicies = fn }
export function setFetchSpend(fn: FetchSpendFn): void { fetchSpend = fn }
export function setRecordIncident(fn: RecordIncidentFn): void { recordIncident = fn }
export function setPauseAgent(fn: PauseAgentFn): void { pauseAgent = fn }

// ============================================================================
// WINDOW CALCULATION
// ============================================================================

function windowStart(window: SpendLimit['window']): string | null {
  const now = new Date()
  if (window === 'daily') {
    return new Date(now.getTime() - 24 * 3600_000).toISOString()
  }
  if (window === 'monthly') {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
  }
  return null // lifetime
}

// ============================================================================
// CORE
// ============================================================================

/**
 * Checks an agent's spending against all applicable policies.
 * Returns { allowed, warnings, incidents }. Pauses the agent on hard-stop breaches.
 */
export async function checkBudget(agentId: string): Promise<BudgetCheckResult> {
  if (!fetchPolicies || !fetchSpend) {
    // DI not wired = no enforcement (feature gate)
    return { allowed: true, warnings: [], incidents: [] }
  }

  const policies = await fetchPolicies(agentId)
  if (policies.length === 0) {
    return { allowed: true, warnings: [], incidents: [] }
  }

  const result: BudgetCheckResult = { allowed: true, warnings: [], incidents: [] }

  for (const policy of policies) {
    if (policy.status !== 'active') continue

    const sinceIso = windowStart(policy.window)
    const observed = await fetchSpend({
      agentId,
      scope: policy.scope,
      sinceIso,
    })

    const warnAt = policy.limit_usd * (policy.warn_percent / 100)

    if (observed >= policy.limit_usd) {
      const incident: LimitBreach = {
        policy_id: policy.id,
        agent_id: agentId,
        observed_usd: observed,
        limit_usd: policy.limit_usd,
        action_taken: policy.hard_stop ? 'pause' : 'warn',
      }
      result.incidents.push(incident)
      if (recordIncident) await recordIncident(incident)

      if (policy.hard_stop) {
        result.allowed = false
        if (pauseAgent) await pauseAgent(agentId, `budget_exceeded:${policy.id}`)
        console.error(
          `[BudgetEnforcer] Agent ${agentId} paused: $${observed.toFixed(2)}/$${policy.limit_usd.toFixed(2)} (policy ${policy.id})`,
        )
      } else {
        result.warnings.push(
          `Policy ${policy.id}: over limit but hard_stop=false ($${observed.toFixed(2)}/$${policy.limit_usd.toFixed(2)})`,
        )
      }
    } else if (observed >= warnAt) {
      result.warnings.push(
        `Policy ${policy.id}: ${Math.round((observed / policy.limit_usd) * 100)}% of limit ($${observed.toFixed(2)}/$${policy.limit_usd.toFixed(2)})`,
      )
    }
  }

  return result
}

// ============================================================================
// PRE-CALL GATE (used inside callAI)
// ============================================================================

/**
 * Throws BudgetExceededError if the next call would exceed a hard-stop policy.
 * Call from inside your `callAI` wrapper BEFORE hitting the model.
 */
export async function assertBudgetAllowsCall(
  agentId: string,
  estimatedCostUsd: number,
): Promise<void> {
  if (!fetchPolicies || !fetchSpend) return

  const policies = await fetchPolicies(agentId)
  for (const policy of policies) {
    if (policy.status !== 'active' || !policy.hard_stop) continue

    const sinceIso = windowStart(policy.window)
    const observed = await fetchSpend({ agentId, scope: policy.scope, sinceIso })
    if (observed + estimatedCostUsd > policy.limit_usd) {
      throw new BudgetExceededError(agentId, policy.id, observed + estimatedCostUsd, policy.limit_usd)
    }
  }
}

// ============================================================================
// BACKFILL (call at heartbeat end)
// ============================================================================

/**
 * After a heartbeat completes, write the total observed cost for the heartbeat
 * back to the heartbeat_runs row. Catches costs from jobs that completed
 * asynchronously during the heartbeat.
 */
export async function backfillHeartbeatCost(
  heartbeatRunId: string,
  agentId: string,
  writeCost: (runId: string, cost: number) => Promise<void>,
): Promise<void> {
  if (!fetchSpend) return
  const since = new Date(Date.now() - 3600_000).toISOString() // last hour
  const cost = await fetchSpend({ agentId, scope: 'agent', sinceIso: since })
  await writeCost(heartbeatRunId, cost)
}
