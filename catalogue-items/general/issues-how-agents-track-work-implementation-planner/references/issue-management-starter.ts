/**
 * Issue Management Starter
 *
 * Minimal, self-contained CRUD + state machine + checkout/checkin helpers.
 * Drop into any project, wire up to your Postgres client, and extend.
 *
 * Assumes the schema from issues-table-schema.sql is already applied.
 */

// ============================================================================
// TYPES
// ============================================================================

export type IssueStatus =
  | 'backlog'
  | 'todo'
  | 'in_progress'
  | 'in_review'
  | 'done'
  | 'cancelled'

export type IssuePriority = 0 | 1 | 2 | 3 // urgent, high, normal, low

export type IssueCommentType =
  | 'note'
  | 'status_update'
  | 'handoff'
  | 'approval'
  | 'rejection'
  | 'error'
  | 'system'

export interface Issue {
  id: string
  identifier: string
  title: string
  description: string | null
  status: IssueStatus
  priority: IssuePriority
  assignee_agent_id: string | null
  created_by_agent_id: string
  client_id: string | null
  labels: string[]
  parent_id: string | null
  proposal_id: string | null
  goal_id: string | null
  finding_id: string | null
  origin_type: string | null
  origin_id: string | null
  checkout_agent_id: string | null
  checkout_run_id: string | null
  checkout_at: string | null
  checkout_expires_at: string | null
  started_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateIssueParams {
  title: string
  description?: string
  priority?: IssuePriority
  assignee_agent_id?: string
  created_by_agent_id: string
  client_id?: string
  labels?: string[]
  parent_id?: string
  proposal_id?: string
  origin_type?: string
  origin_id?: string
  metadata?: Record<string, unknown>
}

// ============================================================================
// STATE MACHINE
// ============================================================================

const VALID_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  backlog: ['todo', 'cancelled'],
  todo: ['in_progress', 'cancelled'],
  in_progress: ['in_review', 'done', 'cancelled'],
  in_review: ['done', 'in_progress', 'cancelled'],
  done: [],
  cancelled: [],
}

export function isValidTransition(from: IssueStatus, to: IssueStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}

// ============================================================================
// DB INTERFACE
//
// Swap this for your real Supabase / pg / drizzle client.
// Kept as an interface so the starter has no external deps.
// ============================================================================

export interface IssuesDb {
  insertIssue(row: Partial<Issue>): Promise<Issue>
  getIssue(id: string): Promise<Issue | null>
  updateIssue(id: string, updates: Partial<Issue>): Promise<Issue>
  insertComment(row: {
    issue_id: string
    author_agent_id: string
    comment_type: IssueCommentType
    body: string
    metadata?: Record<string, unknown>
  }): Promise<void>
  checkoutRpc(args: {
    p_issue_id: string
    p_agent_id: string
    p_run_id: string
    p_timeout_minutes: number
  }): Promise<Issue | null>
  queryInbox(agentId: string): Promise<Issue[]>
}

// ============================================================================
// CREATE
// ============================================================================

export async function createIssue(db: IssuesDb, params: CreateIssueParams): Promise<Issue> {
  const issue = await db.insertIssue({
    title: params.title,
    description: params.description ?? null,
    status: 'backlog',
    priority: params.priority ?? 2,
    assignee_agent_id: params.assignee_agent_id ?? null,
    created_by_agent_id: params.created_by_agent_id,
    client_id: params.client_id ?? null,
    labels: params.labels ?? [],
    parent_id: params.parent_id ?? null,
    proposal_id: params.proposal_id ?? null,
    origin_type: params.origin_type ?? null,
    origin_id: params.origin_id ?? null,
    metadata: params.metadata ?? {},
  })
  console.log(`[issues] created ${issue.identifier}: ${issue.title}`)
  return issue
}

// ============================================================================
// STATE TRANSITIONS
// ============================================================================

/**
 * Transitions an issue, enforcing the state machine and adding a comment.
 * A comment is mandatory: no silent state changes.
 */
export async function transitionStatus(
  db: IssuesDb,
  issueId: string,
  newStatus: IssueStatus,
  agentId: string,
  comment: string
): Promise<Issue> {
  const current = await db.getIssue(issueId)
  if (!current) throw new Error(`issue ${issueId} not found`)

  if (!isValidTransition(current.status, newStatus)) {
    throw new Error(
      `invalid transition: ${current.status} -> ${newStatus} for ${current.identifier}`
    )
  }

  const now = new Date().toISOString()
  const updates: Partial<Issue> = { status: newStatus, updated_at: now }
  if (newStatus === 'in_progress' && !current.started_at) updates.started_at = now
  if (newStatus === 'done') updates.completed_at = now
  if (newStatus === 'cancelled') updates.cancelled_at = now

  const updated = await db.updateIssue(issueId, updates)
  await db.insertComment({
    issue_id: issueId,
    author_agent_id: agentId,
    comment_type: 'status_update',
    body: comment,
  })

  console.log(`[issues] ${current.identifier}: ${current.status} -> ${newStatus}`)
  return updated
}

// ============================================================================
// CHECKOUT / CHECKIN
// ============================================================================

export class CheckoutConflictError extends Error {
  constructor(public readonly issueId: string) {
    super(`issue ${issueId} is already checked out`)
    this.name = 'CheckoutConflictError'
  }
}

/**
 * Atomically claims an issue for work. Uses the checkout_issue RPC defined
 * in the schema so there is no TOCTOU race with other runners.
 */
export async function checkout(
  db: IssuesDb,
  issueId: string,
  agentId: string,
  runId: string,
  timeoutMinutes = 30
): Promise<Issue> {
  const result = await db.checkoutRpc({
    p_issue_id: issueId,
    p_agent_id: agentId,
    p_run_id: runId,
    p_timeout_minutes: timeoutMinutes,
  })
  if (!result) throw new CheckoutConflictError(issueId)
  console.log(`[issues] checked out ${result.identifier} by ${agentId} (run ${runId})`)
  return result
}

/**
 * Releases checkout fields, transitions the issue, and leaves a comment.
 * Use this at the end of the heartbeat's execute step.
 */
export async function checkin(
  db: IssuesDb,
  issueId: string,
  agentId: string,
  newStatus: IssueStatus,
  comment: string
): Promise<Issue> {
  const current = await db.getIssue(issueId)
  if (!current) throw new Error(`issue ${issueId} not found`)

  if (!isValidTransition(current.status, newStatus)) {
    throw new Error(
      `invalid transition: ${current.status} -> ${newStatus} for ${current.identifier}`
    )
  }

  const now = new Date().toISOString()
  const updates: Partial<Issue> = {
    status: newStatus,
    updated_at: now,
    checkout_agent_id: null,
    checkout_run_id: null,
    checkout_at: null,
    checkout_expires_at: null,
  }
  if (newStatus === 'done') updates.completed_at = now
  if (newStatus === 'cancelled') updates.cancelled_at = now

  const updated = await db.updateIssue(issueId, updates)
  await db.insertComment({
    issue_id: issueId,
    author_agent_id: agentId,
    comment_type: 'status_update',
    body: comment,
  })

  console.log(`[issues] checked in ${current.identifier} -> ${newStatus}`)
  return updated
}

/**
 * Release the checkout without transitioning status. Used in the heartbeat's
 * catch block when execution throws.
 */
export async function releaseCheckout(
  db: IssuesDb,
  issueId: string,
  agentId: string,
  reason: string
): Promise<void> {
  await db.updateIssue(issueId, {
    checkout_agent_id: null,
    checkout_run_id: null,
    checkout_at: null,
    checkout_expires_at: null,
    updated_at: new Date().toISOString(),
  })
  await db.insertComment({
    issue_id: issueId,
    author_agent_id: agentId,
    comment_type: 'error',
    body: `checkout released: ${reason}`,
  })
  console.log(`[issues] released checkout on ${issueId}: ${reason}`)
}

// ============================================================================
// INBOX
// ============================================================================

/**
 * Returns the agent's non-terminal issues, ordered for heartbeat picking:
 *   in_progress first, then in_review, then todo by priority then created_at.
 */
export async function loadInbox(db: IssuesDb, agentId: string): Promise<Issue[]> {
  const all = await db.queryInbox(agentId)

  const order: Record<IssueStatus, number> = {
    in_progress: 0,
    in_review: 1,
    todo: 2,
    backlog: 3,
    done: 99,
    cancelled: 99,
  }

  return all
    .filter((i) => i.status !== 'done' && i.status !== 'cancelled')
    .sort((a, b) => {
      const s = order[a.status] - order[b.status]
      if (s !== 0) return s
      const p = a.priority - b.priority
      if (p !== 0) return p
      return a.created_at.localeCompare(b.created_at)
    })
}

// ============================================================================
// USAGE EXAMPLE (pseudo)
// ============================================================================
//
// const issue = await createIssue(db, {
//   title: 'Pause frequency>4 ad sets',
//   created_by_agent_id: 'maya',
//   assignee_agent_id: 'maya',
//   client_id: 'northwind-skincare',
//   priority: 1,
//   labels: ['fatigue', 'pause'],
// })
//
// await transitionStatus(db, issue.id, 'todo', 'maya', 'ready for next heartbeat')
// const locked = await checkout(db, issue.id, 'maya', 'run_abc')
// // ... do the work ...
// await checkin(db, issue.id, 'maya', 'done', 'paused 3 ad sets; saved $42/day')
