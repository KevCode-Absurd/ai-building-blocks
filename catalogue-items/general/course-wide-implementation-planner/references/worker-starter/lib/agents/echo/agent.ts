/**
 * EchoAgent
 *
 * The simplest possible agent. Proves end-to-end wiring:
 *   Slack !echo -> queue -> worker -> agent.handleJob -> Slack reply
 */

import { BaseAgent, type AgentJob, type AgentJobResult } from '../core/base-agent.js'

export class EchoAgent extends BaseAgent {
  public readonly id = 'echo'

  async handleJob(job: AgentJob): Promise<AgentJobResult> {
    const text = typeof job.payload.text === 'string' ? job.payload.text : ''
    const channel = typeof job.payload.channel === 'string' ? job.payload.channel : ''
    if (!channel) {
      return { ok: false, error: 'echo: missing channel' }
    }
    await this.post(channel, `:loudspeaker: ${text || '(empty)'}`)
    return { ok: true, output: text }
  }
}
