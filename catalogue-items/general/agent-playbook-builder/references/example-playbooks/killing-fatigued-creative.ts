/**
 * Example Playbook: Abandoned Cart Decline
 *
 * Hypothetical playbook for teaching purposes. The shape (5 zones: trigger,
 * cooldown, delegation roster, proposal, audit log) matches what you would
 * build in production. The triggers and downstream agents are illustrative,
 * not pulled from any specific account.
 *
 * Scenario: a Shopify store's abandoned-cart recovery rate has dropped while
 * cart-add volume is steady. Three independent signals suggest the email
 * recovery flow has stopped working. Rather than wait for the weekly report,
 * this playbook fires within 24 hours of the second signal and proposes a
 * coordinated diagnosis.
 *
 * Reporting only. The playbook never edits the email flow itself. It assembles
 * a proposal and waits for a human to approve.
 */

import type { PlaybookDefinition } from '../playbook-engine-starter'

export const abandonedCartDeclinePlaybook: PlaybookDefinition = {
  id: 'abandoned-cart-decline',
  name: 'Abandoned Cart Decline Playbook',
  description:
    'Multi-signal drop in cart recovery across email engagement, conversion tracking, and storefront analytics. Triggers a diagnosis-and-fix proposal.',

  triggerPattern: {
    requiredFindings: [
      {
        agentId: 'email-marketing',
        findingTypes: [
          'open-rate-decline',
          'click-rate-decline',
          'flow-engagement-drop',
        ],
        minSeverity: 'warning',
      },
      {
        agentId: 'shopify-analytics',
        findingTypes: [
          'cart-abandonment-spike',
          'recovery-revenue-drop',
        ],
        minSeverity: 'warning',
      },
      {
        agentId: 'conversion-tracking',
        findingTypes: ['event-deduplication-warning'],
        minSeverity: 'info',
      },
    ],
    timeWindowHours: 72,
    minMatchCount: 2,
  },

  analysisAgents: ['email-marketing', 'shopify-analytics', 'conversion-tracking'],
  cooldownHours: 48,

  issueTemplate: {
    title: 'Cart recovery dropped: {{clientName}}',
    description:
      'Two or more independent signals suggest the abandoned-cart flow is underperforming. ' +
      'Recommended: diagnose whether the cause is email deliverability, broken tracking, ' +
      'or a checkout-experience change. Pause the flow only if a hard break is confirmed.',
    labels: ['playbook', 'cart-recovery', 'review'],
    priority: 1,
  },

  autoProposal: {
    proposal_type: 'investigation',
    urgency: 'high',
  },
}

// ----------------------------------------------------------------------------
// STEPS WHEN APPROVED (delegation plan attached to the proposal)
// ----------------------------------------------------------------------------
//
//   Parent task: "Restore cart recovery for {{clientName}}"
//
//     Child 1 (priority 1): conversion-tracking
//       Verify abandoned_checkout events are firing and dedup-matched on
//       email opens. Report back within 4 hours.
//
//     Child 2 (priority 1, parallel with Child 1): email-marketing
//       Compare last 14 days of flow performance against the 90-day baseline.
//       Identify which email in the sequence is the drop-off point.
//
//     Child 3 (priority 2, blocked by Children 1 + 2): shopify-analytics
//       Cross-reference flow drop-off with recent storefront changes
//       (theme edits, app installs, checkout-extension toggles).
//
//     Child 4 (priority 2, blocked by Child 3): email-marketing
//       Draft a fix recommendation: copy refresh, send-time test, or
//       deliverability cleanup (whichever the diagnosis points to).
//
//     Child 5 (priority 3, blocked by Child 4): email-marketing
//       Once approved, ship the fix and watch for 7 days before declaring win.
//
// The engine does not auto-dispatch this tree on trigger. It attaches the plan
// to the proposal. Only human approval creates the actual task tree.
//
// ----------------------------------------------------------------------------
// Why a 72-hour window and a 48-hour cooldown
// ----------------------------------------------------------------------------
//
// Pick the time window slightly longer than your slowest specialist's sweep
// cadence. If your email agent reports daily, a 72-hour window catches three
// reports worth of evidence.
//
// Cooldown is the patience period. Once this playbook fires, do not refire it
// for the same client until 48 hours pass, even if new findings keep arriving.
// Two reasons:
//   1. The first proposal is probably still being worked on.
//   2. Without a cooldown, every new finding will spam the channel.
//
// Tune both numbers after a month of production data. These values are
// starting points, not gospel.

// ----------------------------------------------------------------------------
// Backwards-compatible alias
//
// The file is named killing-fatigued-creative.ts for course-folder continuity.
// The exported playbook itself uses an abandoned-cart-decline scenario. This
// alias lets the registry import either name without breaking.
// ----------------------------------------------------------------------------
export const killingFatiguedCreativePlaybook = abandonedCartDeclinePlaybook
