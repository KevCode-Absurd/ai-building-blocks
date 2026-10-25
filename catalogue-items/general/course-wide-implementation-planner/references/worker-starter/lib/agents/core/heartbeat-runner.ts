/**
 * HeartbeatRunner
 *
 * Minimal cron wrapper. Each registered heartbeat runs on its own schedule.
 * In production you would also record start/finish/cost to a
 * heartbeat_runs table. This starter keeps it simple and just logs.
 */

import cron, { type ScheduledTask } from 'node-cron'

export interface Heartbeat {
  agentId: string
  cron: string
  fn: () => Promise<void>
}

export class HeartbeatRunner {
  private readonly tasks: ScheduledTask[] = []
  private readonly heartbeats: Heartbeat[] = []

  register(hb: Heartbeat): void {
    this.heartbeats.push(hb)
  }

  start(): void {
    for (const hb of this.heartbeats) {
      const task = cron.schedule(hb.cron, async () => {
        const startedAt = Date.now()
        console.log(`[Heartbeat] ${hb.agentId} starting`)
        try {
          await hb.fn()
          const ms = Date.now() - startedAt
          console.log(`[Heartbeat] ${hb.agentId} ok (${ms}ms)`)
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          console.error(`[Heartbeat] ${hb.agentId} failed: ${msg}`)
        }
      })
      this.tasks.push(task)
    }
  }

  stop(): void {
    for (const task of this.tasks) task.stop()
  }
}
