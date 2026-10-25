/**
 * JobQueue
 *
 * Thin wrapper over BullMQ. Agents never touch Redis directly. They call
 * jobQueue.add(...) and the worker side dispatches via the agent registry.
 */

import { Queue, Worker, type Job } from 'bullmq'
import IORedis, { type Redis } from 'ioredis'
import type { AgentJob, BaseAgent } from './base-agent.js'

const QUEUE_NAME = 'agent-jobs'

export class JobQueue {
  private readonly connection: Redis
  private readonly queue: Queue
  private worker: Worker | null = null

  constructor(redisUrl: string) {
    this.connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    })
    this.queue = new Queue(QUEUE_NAME, { connection: this.connection })
  }

  async add(agentId: string, type: string, payload: Record<string, unknown>): Promise<string> {
    const job: AgentJob = {
      id: `${agentId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      agentId,
      type,
      payload,
      createdAt: new Date().toISOString(),
    }
    const bullJob = await this.queue.add(job.type, job, {
      jobId: job.id,
      removeOnComplete: 100,
      removeOnFail: 500,
    })
    return bullJob.id ?? job.id
  }

  createWorkerProcessor(
    registry: Map<string, BaseAgent>,
    concurrency = 5,
  ): void {
    if (this.worker) {
      throw new Error('JobQueue worker already started')
    }
    this.worker = new Worker(
      QUEUE_NAME,
      async (job: Job) => {
        const payload = job.data as AgentJob
        const agent = registry.get(payload.agentId)
        if (!agent) {
          throw new Error(`Unknown agent: ${payload.agentId}`)
        }
        const result = await agent.handleJob(payload)
        if (!result.ok) {
          throw new Error(result.error ?? 'Agent returned ok:false')
        }
        return result
      },
      { connection: this.connection, concurrency },
    )

    this.worker.on('failed', (job, err) => {
      console.error(`[JobQueue] job ${job?.id} failed:`, err.message)
    })
  }

  async ping(): Promise<void> {
    await this.connection.ping()
  }

  async shutdown(): Promise<void> {
    if (this.worker) await this.worker.close()
    await this.queue.close()
    await this.connection.quit()
  }
}
