/**
 * MonitorAgent
 *
 * A skeleton monitoring agent that fires on a heartbeat. It pretends to
 * compute a metric, decides whether to emit a finding, and posts to the
 * ops channel. Swap the fake check for real Meta/Google/Klaviyo queries
 * when you move beyond the starter.
 */

import { BaseAgent, type AgentJob, type AgentJobResult } from '../core/base-agent.js'

export interface MonitorDeps {
  opsChannel: string
}

export class MonitorAgent extends BaseAgent {
  public readonly id = 'monitor'
  private readonly deps: MonitorDeps

  constructor(deps: MonitorDeps) {
    super()
    this.deps = deps
  }

  /** Called by HeartbeatRunner. Does not go through the queue. */
  async runHeartbeat(): Promise<void> {
    const value = Math.random()
    const threshold = 0.7
    if (value <= threshold) {
      // No finding. Silence is acceptable.
      return
    }
    const text =
      `:warning: *Synthetic finding*\n` +
      `Metric: random_value\n` +
      `Value: ${value.toFixed(3)} (threshold ${threshold})\n` +
      `Replace this with a real check when you extend the monitor.`
    await this.post(this.deps.opsChannel, text)
  }

  async handleJob(job: AgentJob): Promise<AgentJobResult> {
    // The starter monitor does not accept ad-hoc jobs yet. Reserved for later.
    return { ok: true, output: `monitor received ${job.type}, ignored` }
  }
}
