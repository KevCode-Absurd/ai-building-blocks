/**
 * Heartbeat Runner Starter
 *
 * Simplified heartbeat runner. TODO markers mark every integration point
 * you need to wire in.
 *
 * Never throws. Every error is caught, recorded, and returned.
 * This invariant matters: a thrown heartbeat crashes the worker.
 */

// ============================================================================
// TYPES
// ============================================================================

export type HeartbeatTrigger = 'scheduled' | 'wakeup' | 'manual'

export interface HeartbeatResult {
  runId: string | null
  agentId: string
  trigger: HeartbeatTrigger
  status: 'success' | 'failed' | 'skipped'
  reason?: string
  issuesProcessed: number
  proposalsCreated: number
  findingsCount: number
  costUsd: number
  durationMs: number
  summary: string
}

// Minimal agent contract the runner needs.
export interface HeartbeatAgent {
  id: string
  name: string
  executeIssueWork(
    issue: { id: string; title: string },
    context: unknown
  ): Promise<{ newStatus: string; comment: string }>
  executeResponsibility(responsibility: {
    id: string
    name: string
  }): Promise<{ findings: number; proposals: number }>
}

// ============================================================================
// CONSTANTS
// ============================================================================

const HEARTBEAT_TIMEOUT_MS = 10 * 60 * 1000 // 10 minutes

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

export async function executeHeartbeat(
  agent: HeartbeatAgent,
  trigger: HeartbeatTrigger,
  triggerDetails?: Record<string, unknown>
): Promise<HeartbeatResult> {
  const startedAt = Date.now()
  let runId: string | null = null

  try {
    // PRE-FLIGHT 1: Feature gate
    // TODO: check feature_gates table, return skipped if off
    const gateOk = await checkFeatureGate(agent.id)
    if (!gateOk) {
      return skipped(agent.id, trigger, 'feature gate off', startedAt)
    }

    // PRE-FLIGHT 2: Budget
    // TODO: query ai_calls for today's spend, compare to daily_budget_usd
    const canSpend = await checkBudget(agent.id)
    if (!canSpend) {
      return skipped(agent.id, trigger, 'budget exceeded', startedAt)
    }

    // PRE-FLIGHT 3: Concurrency guard
    // TODO: INSERT INTO heartbeats with UNIQUE constraint on (agent_id, status=running)
    runId = await openRunRecord(agent.id, trigger, triggerDetails)
    if (!runId) {
      return skipped(agent.id, trigger, 'another heartbeat in flight', startedAt)
    }

    // PRE-FLIGHT 4: Timeout wrapper
    const result = await withTimeout(
      runProtocol(agent, runId, trigger),
      HEARTBEAT_TIMEOUT_MS
    )

    // Finalize
    await finalizeRun(runId, 'success', result)
    return {
      runId,
      agentId: agent.id,
      trigger,
      status: 'success',
      issuesProcessed: result.issuesProcessed,
      proposalsCreated: result.proposalsCreated,
      findingsCount: result.findingsCount,
      costUsd: result.costUsd,
      durationMs: Date.now() - startedAt,
      summary: result.summary,
    }
  } catch (err) {
    // Never throw. Record the failure and return.
    const reason = err instanceof Error ? err.message : String(err)
    if (runId) await finalizeRun(runId, 'failed', { summary: reason })
    return {
      runId,
      agentId: agent.id,
      trigger,
      status: 'failed',
      reason,
      issuesProcessed: 0,
      proposalsCreated: 0,
      findingsCount: 0,
      costUsd: 0,
      durationMs: Date.now() - startedAt,
      summary: `heartbeat failed: ${reason}`,
    }
  }
}

// ============================================================================
// THE 10 STEPS
// ============================================================================

interface ProtocolResult {
  issuesProcessed: number
  proposalsCreated: number
  findingsCount: number
  costUsd: number
  summary: string
}

async function runProtocol(
  agent: HeartbeatAgent,
  runId: string,
  _trigger: HeartbeatTrigger
): Promise<ProtocolResult> {
  let issuesProcessed = 0
  let proposalsCreated = 0
  let findingsCount = 0

  // Step 1: Identity
  // TODO: load agents row, responsibilities, schedule
  const identity = await loadIdentity(agent.id)

  // Step 2: Pending approvals
  // TODO: SELECT from approval_gates where status=pending
  const pendingApprovals = await loadPendingApprovals(agent.id)

  // Step 3: Approved proposals needing execution
  // TODO: SELECT from proposals where status=approved AND executed_at IS NULL
  const approvedProposals = await loadApprovedProposals(agent.id)

  // Step 4: Claim wakeups
  // TODO: UPDATE wakeups SET status=claimed WHERE target_agent_id=... AND status=pending
  const claimedWakeups = await claimWakeups(agent.id)

  // Step 5: Load inbox
  // TODO: SELECT from tasks where assignee_agent_id=... AND status NOT IN ('done','cancelled')
  const inbox = await loadInbox(agent.id)

  // Step 6: Pick work (priority cascade)
  const work = pickWorkItem(inbox, approvedProposals, identity.responsibilities)

  // Step 6e: Evaluate routines
  // TODO: SELECT from schedules where next_run_at <= NOW()
  const dueRoutines = await loadDueRoutines(agent.id)

  // Step 6f: Goal drift
  // TODO: sync goal metrics, create drift proposals for off-track goals
  const driftProposals = await checkGoalDrift(agent.id)
  proposalsCreated += driftProposals

  if (!work) {
    return {
      issuesProcessed,
      proposalsCreated,
      findingsCount,
      costUsd: 0,
      summary: `no work. wakeups=${claimedWakeups} approvals=${pendingApprovals} routines=${dueRoutines}`,
    }
  }

  // Step 7: Checkout
  if (work.kind === 'issue') {
    // TODO: UPDATE tasks SET checked_out_by, checked_out_at WHERE id=...
    await checkoutIssue(work.issue.id, agent.id, runId)

    try {
      // Step 8: Context
      // TODO: load comments, parent, children, relations, approvals, predecessor outputs
      const context = await buildIssueContext(work.issue.id)

      // Step 9: Execute
      const result = await agent.executeIssueWork(work.issue, context)

      // Step 10: Checkin
      // TODO: UPDATE tasks SET status=result.newStatus, clear checkout
      //       INSERT task_comments WITH result.comment
      await checkinIssue(work.issue.id, agent.id, result.newStatus, result.comment)
      issuesProcessed += 1
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      await releaseCheckout(work.issue.id, agent.id, `execution failed: ${reason}`)
      throw err
    }
  } else if (work.kind === 'responsibility') {
    const result = await agent.executeResponsibility(work.responsibility)
    findingsCount += result.findings
    proposalsCreated += result.proposals
  }

  return {
    issuesProcessed,
    proposalsCreated,
    findingsCount,
    costUsd: 0, // TODO: sum ai_calls for runId
    summary: `processed ${work.kind} item; findings=${findingsCount} proposals=${proposalsCreated}`,
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function skipped(
  agentId: string,
  trigger: HeartbeatTrigger,
  reason: string,
  startedAt: number
): HeartbeatResult {
  return {
    runId: null,
    agentId,
    trigger,
    status: 'skipped',
    reason,
    issuesProcessed: 0,
    proposalsCreated: 0,
    findingsCount: 0,
    costUsd: 0,
    durationMs: Date.now() - startedAt,
    summary: `skipped: ${reason}`,
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`heartbeat timed out after ${ms}ms`)), ms)
    ),
  ])
}

interface WorkItem {
  kind: 'issue' | 'responsibility'
  issue?: { id: string; title: string; status: string; priority: number }
  responsibility?: { id: string; name: string }
}

function pickWorkItem(
  inbox: Array<{ id: string; title: string; status: string; priority: number }>,
  approvedProposals: unknown[],
  responsibilities: Array<{ id: string; name: string }>
): WorkItem | null {
  // Priority 1: in_progress
  const inProgress = inbox.find((i) => i.status === 'in_progress')
  if (inProgress) return { kind: 'issue', issue: inProgress }

  // Priority 2: approved proposals get synthesized into synthetic issues
  // TODO: materialize proposals into issues here

  // Priority 3: in_review
  const inReview = inbox.find((i) => i.status === 'in_review')
  if (inReview) return { kind: 'issue', issue: inReview }

  // Priority 4: todo by priority then created_at
  const todo = inbox.find((i) => i.status === 'todo')
  if (todo) return { kind: 'issue', issue: todo }

  // Priority 5: responsibilities
  if (responsibilities.length > 0) {
    return { kind: 'responsibility', responsibility: responsibilities[0] }
  }

  return null
}

// ============================================================================
// STUBS (replace with real DB calls)
// ============================================================================

async function checkFeatureGate(_agentId: string): Promise<boolean> { return true }
async function checkBudget(_agentId: string): Promise<boolean> { return true }
async function openRunRecord(_agentId: string, _trigger: HeartbeatTrigger, _details?: unknown): Promise<string | null> { return 'stub-run-id' }
async function finalizeRun(_runId: string, _status: string, _result: { summary: string }): Promise<void> {}
async function loadIdentity(_agentId: string): Promise<{ responsibilities: Array<{ id: string; name: string }> }> { return { responsibilities: [] } }
async function loadPendingApprovals(_agentId: string): Promise<number> { return 0 }
async function loadApprovedProposals(_agentId: string): Promise<unknown[]> { return [] }
async function claimWakeups(_agentId: string): Promise<number> { return 0 }
async function loadInbox(_agentId: string): Promise<Array<{ id: string; title: string; status: string; priority: number }>> { return [] }
async function loadDueRoutines(_agentId: string): Promise<number> { return 0 }
async function checkGoalDrift(_agentId: string): Promise<number> { return 0 }
async function checkoutIssue(_id: string, _agentId: string, _runId: string): Promise<void> {}
async function buildIssueContext(_id: string): Promise<unknown> { return {} }
async function checkinIssue(_id: string, _agentId: string, _status: string, _comment: string): Promise<void> {}
async function releaseCheckout(_id: string, _agentId: string, _reason: string): Promise<void> {}
