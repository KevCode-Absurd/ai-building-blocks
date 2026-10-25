/**
 * Coordinator Agent Starter
 *
 * Minimal Coordinator Agent pattern. Uses a strong reasoning model for
 * cross-domain synthesis. Every other agent should use a cheaper model.
 * Delegate authority flows downward only.
 *
 * What this file shows:
 *  - DOMAIN_OVERLAP map for cross-referencing findings
 *  - Two operational tools (findings + delegate) to start
 *  - The handoff callback pattern used to dispatch work to specialists
 *
 * Extend it by registering more tools as your system grows.
 */

import { BaseAgent } from './base-agent'
import type {
  AgentJob,
  AgentResult,
  AgentToolDefinition,
  HandoffInstruction,
  SlackContext,
  ClientScope,
} from './types'

// ----------------------------------------------------------------------------
// DOMAIN OVERLAP MAP
// ----------------------------------------------------------------------------
// When agent A flags something, the head agent should check findings from its
// overlapping agents. Relationships are directional. Start small.

const DOMAIN_OVERLAP: Record<string, string[]> = {
  'paid-media': ['creative', 'copy'],
  'creative': ['paid-media', 'copy'],
  'copy': ['creative', 'paid-media'],
}

// ----------------------------------------------------------------------------
// HANDOFF CALLBACK
// ----------------------------------------------------------------------------
// The orchestrator wires this up at boot so the coordinator can delegate to specialists.

export type HandoffCallback = (
  fromAgentId: string,
  parentJobId: string | null,
  instruction: HandoffInstruction,
  slackContext: SlackContext,
  clientScope?: ClientScope,
) => Promise<{ jobId: string } | null>

// ----------------------------------------------------------------------------
// COORDINATOR AGENT CLASS
// ----------------------------------------------------------------------------

export class CoordinatorAgent extends BaseAgent {
  readonly id = 'coordinator'
  readonly name = 'Coordinator Agent'

  // Override the model in your BaseAgent config. This agent should use
  // your strongest reasoning model. All others: a cheaper, faster model.
  protected model = 'your-strongest-model'

  private handoffCallback: HandoffCallback | null = null

  setHandoffCallback(cb: HandoffCallback): void {
    this.handoffCallback = cb
  }

  getCapabilities(): string[] {
    return [
      'strategic-oversight',
      'finding-review',
      'cross-domain-synthesis',
      'delegation',
      'daily-brief',
    ]
  }

  // --------------------------------------------------------------------------
  // CHAT TOOLS
  // --------------------------------------------------------------------------
  // Start with two. You do not need 16 to be valuable.

  protected getChatTools(_job: AgentJob): AgentToolDefinition[] {
    return [
      {
        name: 'get_agent_findings',
        description:
          'Pull recent findings across all specialist agents. Use when asked what needs attention or how a client is performing.',
        parameters: {
          type: 'object',
          properties: {
            client_id: { type: 'string', description: 'Optional. Scope to one client.' },
            min_severity: {
              type: 'string',
              enum: ['info', 'warning', 'critical'],
              description: 'Filter by severity floor. Default warning.',
            },
            hours: { type: 'number', description: 'Lookback window. Default 24.' },
          },
          required: [],
        },
      },
      {
        name: 'delegate_to_agent',
        description:
          'Dispatch a work order to a specialist agent. Use when you have enough signal to justify a specific action.',
        parameters: {
          type: 'object',
          properties: {
            target_agent_id: {
              type: 'string',
              description: 'Agent receiving the work. Must be a registered specialist.',
            },
            task: { type: 'string', description: 'What the agent should do.' },
            client_id: { type: 'string', description: 'Client scope.' },
            urgency: { type: 'string', enum: ['normal', 'high'], description: 'Default normal.' },
          },
          required: ['target_agent_id', 'task'],
        },
      },
    ]
  }

  // --------------------------------------------------------------------------
  // TOOL EXECUTION
  // --------------------------------------------------------------------------

  protected async executeTool(
    name: string,
    args: Record<string, unknown>,
    job: AgentJob,
  ): Promise<unknown> {
    switch (name) {
      case 'get_agent_findings':
        return this.getAgentFindings(args as GetFindingsArgs)
      case 'delegate_to_agent':
        return this.delegateToAgent(args as DelegateArgs, job)
      default:
        throw new Error(`[Coordinator] Unknown tool: ${name}`)
    }
  }

  // --------------------------------------------------------------------------
  // TOOL: get_agent_findings
  // --------------------------------------------------------------------------

  private async getAgentFindings(args: GetFindingsArgs): Promise<FindingRow[]> {
    const db = this.getAdmin()
    const since = new Date(Date.now() - (args.hours ?? 24) * 3600_000).toISOString()

    let query = db
      .from('agent_findings')
      .select('id, agent_id, client_id, finding_type, severity, title, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(50)

    if (args.client_id) query = query.eq('client_id', args.client_id)
    if (args.min_severity) query = query.in('severity', severityFloor(args.min_severity))

    const { data, error } = await query
    if (error) throw new Error(`[Coordinator] findings query failed: ${error.message}`)

    return (data ?? []) as FindingRow[]
  }

  // --------------------------------------------------------------------------
  // TOOL: delegate_to_agent
  // --------------------------------------------------------------------------

  private async delegateToAgent(
    args: DelegateArgs,
    job: AgentJob,
  ): Promise<{ jobId: string | null; status: string }> {
    if (!this.handoffCallback) {
      return { jobId: null, status: 'handoff_callback_not_wired' }
    }

    const instruction: HandoffInstruction = {
      target_agent_id: args.target_agent_id,
      task: args.task,
      urgency: args.urgency ?? 'normal',
    }

    const slackContext: SlackContext = {
      channel_id: job.slack_context?.channel_id ?? '',
      thread_ts: job.slack_context?.thread_ts,
      user_id: job.slack_context?.user_id ?? 'coordinator',
    }

    const clientScope: ClientScope | undefined = args.client_id
      ? { client_id: args.client_id }
      : undefined

    const result = await this.handoffCallback(
      this.id,
      job.id,
      instruction,
      slackContext,
      clientScope,
    )

    return { jobId: result?.jobId ?? null, status: result ? 'dispatched' : 'failed' }
  }

  // --------------------------------------------------------------------------
  // CROSS-DOMAIN LINK CHECK
  // --------------------------------------------------------------------------
  // When a finding arrives, ask: do its overlapping agents also have findings
  // for this client in the same window?

  async findCorrelatedAgents(
    sourceAgentId: string,
    clientId: string,
    windowHours = 48,
  ): Promise<string[]> {
    const overlaps = DOMAIN_OVERLAP[sourceAgentId] ?? []
    if (overlaps.length === 0) return []

    const db = this.getAdmin()
    const since = new Date(Date.now() - windowHours * 3600_000).toISOString()

    const { data } = await db
      .from('agent_findings')
      .select('agent_id')
      .in('agent_id', overlaps)
      .eq('client_id', clientId)
      .gte('created_at', since)

    const correlated = new Set<string>()
    for (const row of (data ?? []) as { agent_id: string }[]) {
      correlated.add(row.agent_id)
    }
    return Array.from(correlated)
  }

  // --------------------------------------------------------------------------
  // handleJob stub — implement your brief generation here
  // --------------------------------------------------------------------------

  async handleJob(_job: AgentJob): Promise<AgentResult> {
    // TODO: implement daily brief generation
    //  - pull findings from last 24h
    //  - group by client
    //  - run findCorrelatedAgents on each finding
    //  - escalate critical, queue warnings for the digest
    //  - post to ops channel
    return { ok: true, summary: 'Coordinator: no-op placeholder' }
  }
}

// ----------------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------------

type GetFindingsArgs = {
  client_id?: string
  min_severity?: 'info' | 'warning' | 'critical'
  hours?: number
}

type DelegateArgs = {
  target_agent_id: string
  task: string
  client_id?: string
  urgency?: 'normal' | 'high'
}

type FindingRow = {
  id: string
  agent_id: string
  client_id: string | null
  finding_type: string
  severity: 'info' | 'warning' | 'critical' | 'opportunity'
  title: string
  created_at: string
}

function severityFloor(floor: 'info' | 'warning' | 'critical'): string[] {
  if (floor === 'critical') return ['critical']
  if (floor === 'warning') return ['critical', 'warning']
  return ['critical', 'warning', 'info']
}
