/**
 * Wakeup Dispatcher Starter
 *
 * Event-driven agent triggering. When an event happens (proposal approved,
 * issue assigned, dependency cleared, etc.), insert a wakeup row and enqueue
 * an immediate heartbeat job. Dedup prevents storms.
 *
 * Pair with the schema:
 *
 *   CREATE TABLE agent_nudges (
 *     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     agent_id TEXT NOT NULL,
 *     reason TEXT NOT NULL,
 *     source_type TEXT NOT NULL,
 *     source_id TEXT,
 *     priority SMALLINT NOT NULL DEFAULT 2,
 *     dedup_key TEXT NOT NULL,
 *     status TEXT NOT NULL DEFAULT 'pending',
 *     claimed_at TIMESTAMPTZ,
 *     processed_at TIMESTAMPTZ,
 *     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 *   );
 *   CREATE UNIQUE INDEX agent_nudges_dedup
 *     ON agent_nudges (dedup_key)
 *     WHERE status IN ('pending', 'claimed');
 */

// ============================================================================
// TYPES
// ============================================================================

// Keep this enum small and meaningful. Add new reasons as your system grows;
// resist the urge to add one for every conceivable trigger.
export type WakeupReason =
  | 'manual'
  | 'scheduled'
  | 'upstream_event'
  | 'delegation'

export type WakeupStatus = 'pending' | 'claimed' | 'processed' | 'expired'

export type IssuePriority = 0 | 1 | 2 | 3

export interface AgentWakeup {
  id: string
  agent_id: string
  reason: WakeupReason
  source_type: string
  source_id: string | null
  priority: IssuePriority
  dedup_key: string
  status: WakeupStatus
  claimed_at: string | null
  processed_at: string | null
  created_at: string
}

// ============================================================================
// DB + QUEUE INTERFACES
// ============================================================================

export interface WakeupsDb {
  insertWakeup(row: {
    agent_id: string
    reason: WakeupReason
    source_type: string
    source_id: string | null
    priority: IssuePriority
    dedup_key: string
  }): Promise<{ id: string; duplicate: boolean }>
  claimPendingForAgent(agentId: string): Promise<AgentWakeup[]>
  markProcessed(ids: string[]): Promise<void>
}

export type QueueAdder = (
  jobName: string,
  payload: Record<string, unknown>,
  opts?: { priority?: number }
) => Promise<void>

let queueAdder: QueueAdder | null = null

/** Called once at bootstrap to wire the BullMQ queue. */
export function setQueueAdder(fn: QueueAdder): void {
  queueAdder = fn
}

// ============================================================================
// CORE DISPATCH
// ============================================================================

/**
 * Fire a wakeup for an agent. Two things happen:
 *   1. A row is inserted into agent_nudges (dedup handles duplicates).
 *   2. A heartbeat job is enqueued so the agent runs immediately.
 *
 * Never throws on dedup collision. Logs and continues.
 */
export async function dispatch(
  db: WakeupsDb,
  agentId: string,
  reason: WakeupReason,
  sourceType: string,
  sourceId: string | null,
  priority: IssuePriority = 2
): Promise<void> {
  const dedupKey = `${agentId}:${reason}:${sourceId ?? 'none'}`

  const result = await db.insertWakeup({
    agent_id: agentId,
    reason,
    source_type: sourceType,
    source_id: sourceId,
    priority,
    dedup_key: dedupKey,
  })

  if (result.duplicate) {
    console.log(`[wakeups] dedup skip: ${dedupKey}`)
    return
  }

  console.log(`[wakeups] dispatched: ${agentId} reason=${reason} source=${sourceId ?? 'none'}`)

  if (queueAdder) {
    try {
      await queueAdder(
        'heartbeat',
        { agentId, wakeupId: result.id, jobType: 'heartbeat' },
        { priority }
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[wakeups] queue enqueue failed: ${msg}`)
      // Intentional: do not rethrow. The pending wakeup will be picked up
      // by the next scheduled heartbeat as a safety net.
    }
  }
}

// ============================================================================
// CLAIM + MARK PROCESSED (called from heartbeat Step 4)
// ============================================================================

/**
 * Claim all pending wakeups for this agent atomically. Called from Step 4
 * of the heartbeat. Returns the rows that are now owned by this run.
 */
export async function claimPending(db: WakeupsDb, agentId: string): Promise<AgentWakeup[]> {
  const claimed = await db.claimPendingForAgent(agentId)
  if (claimed.length > 0) {
    console.log(`[wakeups] claimed ${claimed.length} for ${agentId}`)
  }
  return claimed
}

/**
 * Mark wakeups as processed at the end of the heartbeat. Do this only after
 * the corresponding work has been checked in, so a crash mid-run leaves the
 * wakeup in 'claimed' and a recovery job can reset it to 'pending'.
 */
export async function markProcessed(db: WakeupsDb, ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await db.markProcessed(ids)
  console.log(`[wakeups] marked processed: ${ids.length}`)
}

// ============================================================================
// CONVENIENCE METHODS
//
// One per common dispatch pattern, so call sites read clearly:
//   await dispatchForUpstreamEvent(db, 'maya', 'task', taskId)
// rather than spelling out the reason at every call site.
// ============================================================================

export async function dispatchManual(
  db: WakeupsDb,
  agentId: string,
  sourceType: string,
  sourceId: string | null,
  priority: IssuePriority = 1
): Promise<void> {
  return dispatch(db, agentId, 'manual', sourceType, sourceId, priority)
}

export async function dispatchScheduled(
  db: WakeupsDb,
  agentId: string,
  sourceType: string,
  sourceId: string | null
): Promise<void> {
  return dispatch(db, agentId, 'scheduled', sourceType, sourceId, 2)
}

export async function dispatchForUpstreamEvent(
  db: WakeupsDb,
  agentId: string,
  sourceType: string,
  sourceId: string | null,
  priority: IssuePriority = 2
): Promise<void> {
  return dispatch(db, agentId, 'upstream_event', sourceType, sourceId, priority)
}

export async function dispatchForDelegation(
  db: WakeupsDb,
  agentId: string,
  sourceType: string,
  sourceId: string | null,
  priority: IssuePriority = 1
): Promise<void> {
  return dispatch(db, agentId, 'delegation', sourceType, sourceId, priority)
}
