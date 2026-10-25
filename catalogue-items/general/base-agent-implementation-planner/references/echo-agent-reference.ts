/**
 * Echo Agent — Reference Implementation
 *
 * The simplest possible real agent in Your Agency. Around 50 lines.
 * Inherits 6 capabilities from BaseAgent and implements only the two
 * abstract methods.
 *
 * Purpose: confirm the end-to-end pipeline is alive.
 * Slack -> Router -> Orchestrator -> BullMQ -> Agent -> Slack.
 *
 * Port this directly into `lib/agents/echo/agent.ts` if you're building
 * against the base. The import paths here assume the scaffold in
 * `./base-agent-scaffold/`.
 */

import { BaseAgent } from './base-agent-scaffold/base-agent'
import type { AgentJob, AgentResult } from './base-agent-scaffold/types'

export class EchoAgent extends BaseAgent {
  readonly id = 'echo'
  readonly name = 'Echo Agent'

  getCapabilities(): string[] {
    return ['echo', 'test', 'debug']
  }

  async handleJob(job: AgentJob): Promise<AgentResult> {
    // 1. Log receipt for auditability.
    await this.log(
      'echo-received',
      { jobId: job.id, jobType: job.jobType, clientScope: job.clientScope },
      job.clientScope?.clientId || undefined
    )

    // 2. Pull the message from either common input shape.
    const messageText =
      ((job.inputData?.message as string) ??
       (job.inputData?.text as string)) || 'N/A'

    const classification = job.inputData?.classification as
      | { intent: string; confidence: number; tier: string }
      | undefined

    // 3. Build a structured response. The router handles Block Kit.
    await this.respond(job.slackContext, {
      header: 'Echo Agent Response',
      sections: [
        { type: 'text', text: `*Message:* ${messageText}` },
        {
          type: 'summary',
          text: [
            `*Agent ID:* \`${job.agentId}\``,
            `*Job ID:* \`${job.id}\``,
            `*Job Type:* ${job.jobType}`,
            `*Channel Type:* ${job.slackContext?.channelType ?? 'unknown'}`,
            `*Client:* ${job.clientScope?.clientName ?? 'none'}`,
            `*Enforcement:* ${job.clientScope?.enforcementLevel ?? 'unknown'}`,
            classification
              ? `*Classification:* ${classification.intent} (${(classification.confidence * 100).toFixed(0)}% ${classification.tier})`
              : '',
          ]
            .filter(Boolean)
            .join('\n'),
        },
      ],
    })

    // 4. Zero-cost return. EchoAgent never calls an AI model.
    return { success: true, data: { echoed: messageText }, costUsd: 0 }
  }
}
