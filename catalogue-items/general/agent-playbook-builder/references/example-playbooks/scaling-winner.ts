/**
 * Email Flow Outperforming Playbook
 *
 * Fires when a Klaviyo flow shows genuine scaling-up readiness: high open and
 * click rates, healthy revenue per recipient, no deliverability flags. Avoids
 * pushing more volume into a flow that is about to hit list fatigue.
 *
 * Reporting only. Proposes flow expansion, does not execute.
 */

import type { PlaybookDefinition } from '../playbook-engine-starter'

export const emailFlowOutperformingPlaybook: PlaybookDefinition = {
  id: 'email-flow-outperforming',
  name: 'Email Flow Outperforming Playbook',
  description:
    'Flow open, click, and revenue signals align with no deliverability or fatigue flag in the same window. Safe to propose expanding audience.',

  triggerPattern: {
    requiredFindings: [
      {
        agentId: 'email-marketing',
        findingTypes: [
          'flow-revenue-spike',
          'open-rate-strong',
          'click-rate-strong',
        ],
        minSeverity: 'info',
      },
      {
        agentId: 'email-marketing',
        findingTypes: ['deliverability-healthy'],
        minSeverity: 'info',
      },
    ],
    timeWindowHours: 24,
    minMatchCount: 2,
  },

  analysisAgents: ['email-marketing', 'reporting'],
  cooldownHours: 24,

  issueTemplate: {
    title: 'Flow scaling opportunity: {{clientName}}',
    description:
      'Signals align for expanding the flow audience. Human approval required before audience change.',
    labels: ['playbook', 'email', 'review'],
    priority: 2,
  },

  autoProposal: {
    proposal_type: 'action',
    urgency: 'normal',
  },
}

// The registry in index.ts imports this playbook as scalingWinnerPlaybook.
// This alias keeps that import working.
export const scalingWinnerPlaybook = emailFlowOutperformingPlaybook

// ----------------------------------------------------------------------------
// EXIT CONDITIONS (documentation, enforced at runtime by the engine)
// ----------------------------------------------------------------------------
//
// The playbook should NOT fire or should EXIT early if any of the following
// are true within the same time window for the same client:
//
//   - `email-marketing` has any finding_type of 'unsubscribe-spike' or
//     'spam-complaint-spike' at warning or above
//   - `email-marketing` has 'list-fatigue' at warning or above
//   - An `email-flow-outperforming` playbook activation exists in the last 24
//     hours (the cooldown)
//
// If any of these are true, the engine logs the suppression reason into
// `playbook_activations.metadata.suppressed_reason`.
