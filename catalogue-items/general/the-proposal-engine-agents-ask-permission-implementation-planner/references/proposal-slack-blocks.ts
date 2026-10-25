/**
 * Proposal Slack Block Kit Builder
 *
 * Reusable formatter for "Approve / Reject / Elaborate" proposal messages.
 *
 * The action_id format is `proposal_{action}_{proposalId}`. The router splits
 * on the underscore to route callbacks to the right handler.
 *
 * Button style:
 *   Approve  = primary (green)
 *   Reject   = danger (red)
 *   Elaborate = default (neutral)
 *
 * Urgency affects the header emoji only. Do not abuse color.
 */

import type { KnownBlock, SectionBlock, ActionsBlock, HeaderBlock } from '@slack/types'

// ============================================================================
// TYPES
// ============================================================================

export interface ProposalForSlack {
  id: string
  agent_id: string
  title: string
  summary: string
  strategy?: string
  urgency: 'normal' | 'high' | 'emergency'
  impact_estimate?: {
    metric: string
    current: number
    projected_low: number
    projected_high: number
    confidence: 'low' | 'moderate' | 'high'
    horizon_days: number
  }
  evidence?: Array<{ label: string; value: string; source?: string }>
  delegation_plan?: {
    parent: { title: string }
    children: Array<{ assignee_agent_id: string; title: string }>
  }
}

// ============================================================================
// PUBLIC: formatProposal
// ============================================================================

export function formatProposal(p: ProposalForSlack): { blocks: KnownBlock[]; text: string } {
  const blocks: KnownBlock[] = []

  blocks.push(headerBlock(p))
  blocks.push(summaryBlock(p))

  if (p.strategy) blocks.push(strategyBlock(p.strategy))
  if (p.impact_estimate) blocks.push(impactBlock(p.impact_estimate))
  if (p.evidence?.length) blocks.push(evidenceBlock(p.evidence))
  if (p.delegation_plan) blocks.push(planBlock(p.delegation_plan))

  blocks.push({ type: 'divider' })
  blocks.push(actionButtons(p.id))

  return {
    blocks,
    text: `Proposal from ${p.agent_id}: ${p.title}`,
  }
}

// ============================================================================
// BLOCK BUILDERS
// ============================================================================

function headerBlock(p: ProposalForSlack): HeaderBlock {
  const emoji =
    p.urgency === 'emergency' ? ':rotating_light:' :
    p.urgency === 'high' ? ':warning:' :
    ':speech_balloon:'
  return {
    type: 'header',
    text: { type: 'plain_text', text: `${emoji} ${p.title}` },
  }
}

function summaryBlock(p: ProposalForSlack): SectionBlock {
  return {
    type: 'section',
    fields: [
      { type: 'mrkdwn', text: `*Proposed by*\n${p.agent_id}` },
      { type: 'mrkdwn', text: `*Urgency*\n${p.urgency}` },
      { type: 'mrkdwn', text: `*Summary*\n${p.summary}` },
    ],
  }
}

function strategyBlock(strategy: string): SectionBlock {
  return {
    type: 'section',
    text: { type: 'mrkdwn', text: `*Strategy*\n${strategy}` },
  }
}

function impactBlock(impact: NonNullable<ProposalForSlack['impact_estimate']>): SectionBlock {
  const range = `${impact.projected_low}-${impact.projected_high}`
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        `*Impact estimate*\n` +
        `${impact.metric}: ${impact.current} -> ${range} ` +
        `(${impact.confidence} confidence, ${impact.horizon_days}d horizon)`,
    },
  }
}

function evidenceBlock(evidence: NonNullable<ProposalForSlack['evidence']>): SectionBlock {
  const lines = evidence.map(
    (e) => `- *${e.label}*: ${e.value}${e.source ? ` _(${e.source})_` : ''}`,
  )
  return {
    type: 'section',
    text: { type: 'mrkdwn', text: `*Evidence*\n${lines.join('\n')}` },
  }
}

function planBlock(plan: NonNullable<ProposalForSlack['delegation_plan']>): SectionBlock {
  const lines = plan.children.map((c) => `- ${c.assignee_agent_id}: ${c.title}`)
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Delegation plan*\n*${plan.parent.title}*\n${lines.join('\n')}`,
    },
  }
}

function actionButtons(proposalId: string): ActionsBlock {
  return {
    type: 'actions',
    elements: [
      {
        type: 'button',
        action_id: `proposal_approve_${proposalId}`,
        text: { type: 'plain_text', text: 'Approve' },
        style: 'primary',
        value: proposalId,
      },
      {
        type: 'button',
        action_id: `proposal_reject_${proposalId}`,
        text: { type: 'plain_text', text: 'Reject' },
        style: 'danger',
        value: proposalId,
      },
      {
        type: 'button',
        action_id: `proposal_elaborate_${proposalId}`,
        text: { type: 'plain_text', text: 'Elaborate' },
        value: proposalId,
      },
    ],
  }
}

// ============================================================================
// HANDLER STUBS — wire these into your SlackRouter
// ============================================================================

export interface ProposalCallbackContext {
  proposalId: string
  userId: string
  channelId: string
  messageTs: string
  responseUrl: string
}

export async function handleApprove(_ctx: ProposalCallbackContext): Promise<void> {
  // TODO:
  //   1. Load proposal from DB; verify status === 'posted'
  //   2. Update status -> 'approved', stamp approver_user_id + approved_at
  //   3. If delegation_plan present: call issueManager.createIssueTree(plan)
  //   4. Update Slack message: replace buttons with "Approved by @user"
  //   5. Dispatch wakeup to the proposing agent
}

export async function handleReject(_ctx: ProposalCallbackContext): Promise<void> {
  // TODO:
  //   1. Load proposal; verify status === 'posted'
  //   2. Update status -> 'rejected', stamp rejected_at
  //   3. Update Slack message: replace buttons with "Rejected by @user"
  //   4. Dispatch wakeup with reason 'proposal_rejected' (learning signal)
}

export async function handleElaborate(_ctx: ProposalCallbackContext): Promise<void> {
  // TODO:
  //   1. Load proposal; verify status === 'posted'
  //   2. Update status -> 'elaborating'
  //   3. Dispatch wakeup with reason 'proposal_elaborate'
  //   4. The agent's next heartbeat posts additional detail as a thread reply
}
