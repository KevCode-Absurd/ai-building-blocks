/**
 * Feedback Handler Starter
 *
 * Turns Slack emoji reactions and thread replies into structured feedback
 * records, then fans them out to the learning system.
 *
 * Four reactions map to four feedback types. Thread replies add context.
 */

// ============================================================================
// REACTION MAP
// ============================================================================

// Pick four emoji that map to four feedback types your team will actually
// remember. The example below is one option. Customize to your team's
// muscle memory.
export const REACTION_FEEDBACK_MAP: Record<string, FeedbackType> = {
  thumbsup: 'acknowledge',
  bulb: 'useful',
  thumbsdown: 'not-useful',
  warning: 'flag-for-review',
}

export type FeedbackType =
  | 'acknowledge'
  | 'useful'
  | 'not-useful'
  | 'flag-for-review'

// ============================================================================
// TYPES
// ============================================================================

export interface SlackReactionEvent {
  type: 'reaction_added' | 'reaction_removed'
  reaction: string
  user: string
  item: {
    channel: string
    ts: string            // the message that received the reaction
    type: 'message'
  }
}

export interface SlackThreadReplyEvent {
  channel: string
  user: string
  thread_ts: string
  text: string
  ts: string
}

export interface FeedbackRecord {
  id?: string
  agent_id: string
  agent_job_id: string
  client_id: string | null
  feedback_type: FeedbackType
  user_id: string
  channel_id: string
  message_ts: string
  thread_replies: string[]    // accumulated reply text
  metadata: Record<string, unknown>
  created_at: string
}

// ============================================================================
// DI
// ============================================================================

type FindJobByMessageFn = (args: {
  channel_id: string
  message_ts: string
}) => Promise<{
  id: string
  agent_id: string
  client_id: string | null
  metadata?: Record<string, unknown>
} | null>

type SaveFeedbackFn = (record: FeedbackRecord) => Promise<string>
type AppendThreadReplyFn = (feedbackId: string, replyText: string) => Promise<void>
type OnFeedbackReceivedFn = (record: FeedbackRecord) => Promise<void>

let findJobByMessage: FindJobByMessageFn | null = null
let saveFeedback: SaveFeedbackFn | null = null
let appendThreadReply: AppendThreadReplyFn | null = null
let onFeedbackReceived: OnFeedbackReceivedFn | null = null

export function setFindJobByMessage(fn: FindJobByMessageFn): void { findJobByMessage = fn }
export function setSaveFeedback(fn: SaveFeedbackFn): void { saveFeedback = fn }
export function setAppendThreadReply(fn: AppendThreadReplyFn): void { appendThreadReply = fn }
export function setOnFeedbackReceived(fn: OnFeedbackReceivedFn): void { onFeedbackReceived = fn }

// ============================================================================
// REACTION HANDLER
// ============================================================================

export async function handleFeedbackReaction(
  event: SlackReactionEvent,
): Promise<FeedbackRecord | null> {
  if (event.type !== 'reaction_added') return null

  const feedbackType = REACTION_FEEDBACK_MAP[event.reaction]
  if (!feedbackType) return null

  if (!findJobByMessage || !saveFeedback) {
    console.warn('[Feedback] DI not wired, skipping reaction')
    return null
  }

  const job = await findJobByMessage({
    channel_id: event.item.channel,
    message_ts: event.item.ts,
  })
  if (!job) {
    console.log(`[Feedback] No agent job found for ${event.item.channel}:${event.item.ts}`)
    return null
  }

  const record: FeedbackRecord = {
    agent_id: job.agent_id,
    agent_job_id: job.id,
    client_id: job.client_id,
    feedback_type: feedbackType,
    user_id: event.user,
    channel_id: event.item.channel,
    message_ts: event.item.ts,
    thread_replies: [],
    metadata: {
      reaction: event.reaction,
      job_metadata: job.metadata ?? {},
    },
    created_at: new Date().toISOString(),
  }

  const id = await saveFeedback(record)
  record.id = id

  console.log(`[Feedback] ${feedbackType} from ${event.user} on ${job.agent_id} job ${job.id}`)

  if (onFeedbackReceived) {
    try { await onFeedbackReceived(record) }
    catch (err: any) { console.error('[Feedback] learning handler failed:', err.message) }
  }

  return record
}

// ============================================================================
// THREAD REPLY HANDLER
// ============================================================================

/**
 * Captures reply text as additional context for any existing feedback record
 * against the same message. If no feedback exists yet for this thread, creates
 * a lightweight "context" record with type = already-known so the reply is not
 * lost. (A later reaction will promote it.)
 */
export async function handleThreadReply(
  event: SlackThreadReplyEvent,
): Promise<void> {
  if (!findJobByMessage || !saveFeedback || !appendThreadReply) {
    console.warn('[Feedback] DI not wired, skipping thread reply')
    return
  }

  const job = await findJobByMessage({
    channel_id: event.channel,
    message_ts: event.thread_ts,
  })
  if (!job) return

  // Find or create feedback record for this message
  // (implementation-specific — either look up by (channel, message_ts) or
  // keep a separate feedback_context table)
  const record: FeedbackRecord = {
    agent_id: job.agent_id,
    agent_job_id: job.id,
    client_id: job.client_id,
    feedback_type: 'acknowledge', // placeholder until a reaction is added
    user_id: event.user,
    channel_id: event.channel,
    message_ts: event.thread_ts,
    thread_replies: [event.text],
    metadata: {
      type: 'thread-only',
      reply_ts: event.ts,
    },
    created_at: new Date().toISOString(),
  }

  const existingIdLookup = await lookupExistingFeedbackId({
    agent_job_id: job.id,
    channel_id: event.channel,
    message_ts: event.thread_ts,
  })

  if (existingIdLookup) {
    await appendThreadReply(existingIdLookup, event.text)
  } else {
    await saveFeedback(record)
  }

  console.log(`[Feedback] Thread reply captured for ${job.agent_id} job ${job.id}`)
}

// ============================================================================
// PRIVATE
// ============================================================================

async function lookupExistingFeedbackId(_args: {
  agent_job_id: string
  channel_id: string
  message_ts: string
}): Promise<string | null> {
  // TODO: implement against your agent_feedback table.
  // Return the id of the most recent feedback record for this message, or null.
  return null
}
