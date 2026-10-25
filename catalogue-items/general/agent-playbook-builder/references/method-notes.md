

Detecting correlated findings across agents and triggering coordinated responses. Four playbooks: Creative Fatigue, Scaling Opportunity, Performance Emergency, Cross-Platform Drift.Playbook Definition SchemaA playbook is a declarative pattern. It describes a multi-agent signal to watch for, the window to look in, and the coordinated response to generate.Playbooks are reporting only by design. They never take action. Actions require human approval through the proposal engine.TypeScript Shapeexport interface PlaybookTriggerCondition {
  agentId: string                // which specialist must flag something
  findingTypes: string[]         // which finding_type values count
  minSeverity: 'info' | 'warning' | 'critical'
}

export interface PlaybookDefinition {
  id: string                     // stable identifier (kebab-case)
  name: string                   // human-readable name
  description: string            // one-liner, what pattern this catches

  triggerPattern: {
    requiredFindings: PlaybookTriggerCondition[]
    timeWindowHours: number      // correlation window
    minMatchCount: number        // how many different conditions must match
  }

  analysisAgents: string[]       // which agents contribute perspective
  cooldownHours: number          // lockout after a fire, per client

  // Optional. Overrides the default parent issue template.
  issueTemplate?: {
    title: string                // may reference {{clientName}}
    description?: string
    labels?: string[]
    priority?: 1 | 2 | 3
  }

  // Optional. If set, auto-generates a proposal on trigger (still pending human approval).
  autoProposal?: {
    proposal_type: 'action' | 'investigation' | 'strategy-change'
    urgency: 'normal' | 'high' | 'emergency'
    target_channel_id?: string   // defaults to ops channel
  }
}Field ContractidStable. Never rename. Used as a foreign key in playbook_activations and referenced by learning events. Use kebab-case.triggerPattern.requiredFindingsAn array of "if this kind of finding exists, it counts toward the trigger." Ordered for readability, not execution. Each entry pairs an agent id with a list of finding types at or above a severity floor.timeWindowHoursHow close together the matching findings must occur.- 12 hours → emergencies - 24 hours → normal ops - 48 hours → slower-moving patterns (e.g., creative fatigue)Avoid windows longer than 72 hours — correlations break down.minMatchCountThe number of different requiredFindings entries that must match at least once.Best practice:- 2 of 3 → ideal - All required → too strict (rarely fires) - 1 of N → too loose (fires too often)analysisAgentsThe specialists whose perspectives are included when the playbook runs. Each contributes domain insight, then gets synthesized into a unified diagnosis.cooldownHoursLockout per client after a fire. Prevents retriggering on the same data.- 12h → emergencies - 24h → standard patternsissueTemplate (optional)If the playbook should open a parent issue on trigger, provide a template. Use {{clientName}} as a placeholder. Leave unset if the playbook should only post a diagnostic message.autoProposal (optional)If set, the system generates a draft proposal on trigger. It is still sent to Slack with approval buttons. It never auto-executes.Minimum Example{
  id: 'creative-fatigue',
  name: 'Creative Fatigue Playbook',
  description: 'Multi-signal creative exhaustion across Riley, Mia, and Jordan.',

  triggerPattern: {
    requiredFindings: [
      { agentId: 'creative-review', findingTypes: ['creative-fatigue'], minSeverity: 'warning' },
      { agentId: 'facebook-ads', findingTypes: ['frequency-creep', 'roas-drop'], minSeverity: 'warning' },
      { agentId: 'copywriting', findingTypes: ['copy-performance-decline'], minSeverity: 'info' },
    ],
    timeWindowHours: 48,
    minMatchCount: 2,
  },

  analysisAgents: ['creative-review', 'facebook-ads', 'copywriting'],
  cooldownHours: 24,
}Pre-Launch Checklist- ID is unique across the registry - At least two requiredFindings (single-condition = alert, not playbook) - minMatchCount ≥ 2 unless justified - timeWindowHours matches real-world pattern speed - cooldownHours ≥ timeWindowHours - analysisAgents aligns with requiredFindings domains - Dry-run against 30 days of historical findings (false positives < 10%) - Reviewed by a domain owner
