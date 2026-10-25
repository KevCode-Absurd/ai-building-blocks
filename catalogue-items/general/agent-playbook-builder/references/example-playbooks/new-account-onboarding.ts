/**
 * New Account Onboarding Playbook
 *
 * Fires when a new client enters the `clients` table with status 'active'.
 * Coordinates the opening-week sequence across onboarding, reporting, ads,
 * and communication agents.
 *
 * Unlike the other two playbooks, this one is event-driven, not
 * finding-correlated. It uses a synthetic finding type `client-activated`
 * emitted by the onboarding agent when a new client is set live.
 *
 * Reporting only. Proposes the onboarding sequence, does not execute.
 */

import type { PlaybookDefinition } from '../playbook-engine-starter'

export const newAccountOnboardingPlaybook: PlaybookDefinition = {
  id: 'new-account-onboarding',
  name: 'New Account Onboarding Playbook',
  description:
    'New client activated. Coordinate opening-week setup across onboarding, reporting, and ads specialists.',

  triggerPattern: {
    requiredFindings: [
      {
        agentId: 'onboarding',
        findingTypes: ['client-activated'],
        minSeverity: 'info',
      },
    ],
    timeWindowHours: 1,
    minMatchCount: 1, // single-signal by design
  },

  analysisAgents: ['onboarding', 'reporting', 'facebook-ads', 'google-ads', 'communication'],
  cooldownHours: 168, // 7 days: only fires once per client activation

  issueTemplate: {
    title: 'Opening week setup: {{clientName}}',
    description:
      'Client activated. Running coordinated onboarding playbook: data connections, ' +
      'baseline reports, first-week campaign audit, kickoff communication.',
    labels: ['playbook', 'onboarding'],
    priority: 2,
  },

  autoProposal: {
    proposal_type: 'action',
    urgency: 'normal',
  },
}

// ----------------------------------------------------------------------------
// STEPS WHEN APPROVED
// ----------------------------------------------------------------------------
//
//   Parent issue: "Opening week setup: {{clientName}}"
//
//     Child 1 (priority 1): onboarding
//       Task: Confirm Meta, Google, Shopify, Klaviyo connectors are live and
//             pulling data. Emit `data-connected` when complete.
//
//     Child 2 (priority 2, blocked by Child 1): reporting
//       Task: Generate 30-day baseline report across all connected platforms.
//             Establish baselines for CPM, CTR, ROAS, frequency per platform.
//
//     Child 3 (priority 2, blocked by Child 1): facebook-ads
//       Task: Run your audit framework against the existing Meta ad account.
//             File findings.
//
//     Child 4 (priority 2, blocked by Child 1): google-ads
//       Task: Run your audit framework against the existing Google Ads
//             account. File findings.
//
//     Child 5 (priority 3, blocked by Children 2, 3, 4): communication
//       Task: Draft kickoff message for the client Slack channel summarizing
//             what we found and what we plan for weeks 1 through 4.
//
// Exit condition: if any agent fails to complete its leaf within 72 hours,
// the playbook escalates via `delegateToHuman` from the onboarding agent.
