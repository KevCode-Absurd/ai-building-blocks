/**
 * Delegation Manager Starter
 *
 * Pattern: one agent creates a child issue assigned to another. Authority is
 * validated. Depth is capped. Blocking relations are set. A wakeup is fired.
 *
 * Dependency injection pattern: this module does not import IssueManager
 * directly. The worker bootstrap wires functions in at startup. Prevents
 * circular imports and keeps tests easy.
 */

// ============================================================================
// DI CONTAINER
// ============================================================================

type CreateIssueFn = (params: CreateIssueParams) => Promise<Issue>
type GetIssueFn = (issueId: string) => Promise<Issue | null>
type DispatchWakeupFn = (
  agentId: string,
  reason: string,
  sourceType: string,
  sourceId: string,
  priority?: number,
) => Promise<void>

let createIssue: CreateIssueFn | null = null
let getIssue: GetIssueFn | null = null
let dispatchWakeup: DispatchWakeupFn | null = null

export function setIssueCreator(fn: CreateIssueFn): void { createIssue = fn }
export function setIssueGetter(fn: GetIssueFn): void { getIssue = fn }
export function setWakeupDispatcher(fn: DispatchWakeupFn): void { dispatchWakeup = fn }

// ============================================================================
// TYPES
// ============================================================================

export interface Issue {
  id: string
  identifier: string
  title: string
  assignee_agent_id: string
  parent_id: string | null
  status: 'open' | 'in_progress' | 'done' | 'blocked' | 'cancelled'
}

export interface CreateIssueParams {
  title: string
  description?: string
  assignee_agent_id: string
  created_by_agent_id: string
  parent_id?: string
  priority?: number
  labels?: string[]
  metadata?: Record<string, unknown>
}

export interface DelegateParams {
  fromAgentId: string
  toAgentId: string
  title: string
  description?: string
  priority?: number
  parentIssueId?: string
  blockedByIssueIds?: string[]
  metadata?: Record<string, unknown>
  labels?: string[]
}

// ============================================================================
// AUTHORITY
// ============================================================================

const AUTHORITY: Record<string, string[]> = {
  'coordinator': ['*'], // coordinator can delegate to anyone
  'agent-a': ['agent-b', 'agent-c'],
  'agent-b': ['agent-c'],
  'agent-c': [], // leaf: cannot delegate further
}

export class DelegationAuthorityError extends Error {
  constructor(msg: string) { super(msg); this.name = 'DelegationAuthorityError' }
}

function validateAuthority(from: string, to: string): void {
  const allowed = AUTHORITY[from] ?? []
  if (allowed.includes('*')) return
  if (!allowed.includes(to)) {
    throw new DelegationAuthorityError(
      `[Delegation] ${from} has no authority to delegate to ${to}. Allowed: ${allowed.join(', ') || 'none'}`,
    )
  }
}

// ============================================================================
// DEPTH LIMIT
// ============================================================================

const MAX_DELEGATION_DEPTH = parseInt(process.env.MAX_DELEGATION_DEPTH || '3', 10)

async function countDepth(parentIssueId: string): Promise<number> {
  if (!getIssue) throw new Error('[Delegation] getIssue not injected')
  let depth = 0
  let cursor: string | null = parentIssueId
  while (cursor && depth < 10) {
    const issue = await getIssue(cursor)
    if (!issue) break
    depth++
    cursor = issue.parent_id
  }
  return depth
}

// ============================================================================
// DELEGATE
// ============================================================================

/**
 * Agent-to-agent delegation.
 *
 * Six enforced steps:
 *   1. Validate authority
 *   2. Check depth
 *   3. Create child issue
 *   4. Set up blocked_by relations
 *   5. Fire wakeup if not blocked
 *   6. Log the delegation
 */
export async function delegate(params: DelegateParams): Promise<Issue> {
  // 1. Authority
  validateAuthority(params.fromAgentId, params.toAgentId)

  // 2. Depth
  if (params.parentIssueId) {
    const depth = await countDepth(params.parentIssueId)
    if (depth >= MAX_DELEGATION_DEPTH) {
      throw new DelegationAuthorityError(
        `[Delegation] Max depth (${MAX_DELEGATION_DEPTH}) reached. Refusing to create child.`,
      )
    }
  }

  // 3. Create child issue
  if (!createIssue) throw new Error('[Delegation] createIssue not injected')
  const issue = await createIssue({
    title: params.title,
    description: params.description,
    assignee_agent_id: params.toAgentId,
    created_by_agent_id: params.fromAgentId,
    parent_id: params.parentIssueId,
    priority: params.priority ?? 2,
    labels: params.labels ?? ['delegation'],
    metadata: params.metadata ?? {},
  })

  // 4. Blocking relations
  if (params.blockedByIssueIds?.length) {
    await setBlockingRelations(issue.id, params.blockedByIssueIds, params.fromAgentId)
  }

  // 5. Wakeup if not blocked
  if (!params.blockedByIssueIds?.length && dispatchWakeup) {
    await dispatchWakeup(params.toAgentId, 'assignment', 'issue', issue.id, params.priority ?? 2)
  }

  // 6. Audit log
  await logDelegation(params.fromAgentId, params.toAgentId, issue.id, true)

  return issue
}

// ============================================================================
// DELEGATE TO HUMAN
// ============================================================================

/**
 * Use when no agent can do the work. Creates an issue labeled `human-required`
 * assigned to the coordinator. The coordinator's heartbeat routes it to the
 * appropriate team member via Slack.
 */
export async function delegateToHuman(
  fromAgentId: string,
  title: string,
  description?: string,
  metadata?: Record<string, unknown>,
): Promise<Issue> {
  if (!createIssue) throw new Error('[Delegation] createIssue not injected')

  const issue = await createIssue({
    title: `[Human Required] ${title}`,
    description,
    assignee_agent_id: 'coordinator',
    created_by_agent_id: fromAgentId,
    priority: 1,
    labels: ['human-required', 'delegation'],
    metadata: { ...(metadata ?? {}), originating_agent: fromAgentId },
  })

  if (dispatchWakeup) {
    await dispatchWakeup('coordinator', 'human_required', 'issue', issue.id, 1)
  }

  await logDelegation(fromAgentId, 'coordinator', issue.id, true, 'human-required')

  return issue
}

// ============================================================================
// SUPPORTING HELPERS (replace with real Supabase calls in your system)
// ============================================================================

async function setBlockingRelations(
  issueId: string,
  blockerIds: string[],
  createdBy: string,
): Promise<void> {
  // TODO: insert into issue_relations and mark issueId as blocked
  console.log(`[Delegation] Issue ${issueId} blocked by ${blockerIds.length} sibling(s) (by ${createdBy})`)
}

async function logDelegation(
  from: string,
  to: string,
  issueId: string,
  success: boolean,
  kind?: string,
): Promise<void> {
  // TODO: insert into delegation_audit_log
  console.log(`[Delegation] ${from} -> ${to} (issue ${issueId}, success=${success}${kind ? `, kind=${kind}` : ''})`)
}
