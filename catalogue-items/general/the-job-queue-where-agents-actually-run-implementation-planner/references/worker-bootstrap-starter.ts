/**
 * Worker Bootstrap Starter
 *
 * Minimal worker process that routes two job types to two agents.
 * Model this after your `worker/agent-system.ts`.
 *
 * Run: npx tsx worker-bootstrap-starter.ts
 *
 * Env vars required:
 *   REDIS_URL=redis://... (or rediss:// for TLS)
 */

import { Queue, Worker, type Job } from 'bullmq'
import { URL } from 'url'

// ============================================================================
// CONNECTION
// ============================================================================

function parseRedisUrl(raw: string) {
  const u = new URL(raw)
  return {
    host: u.hostname,
    port: Number(u.port || 6379),
    password: u.password || undefined,
    username: u.username || undefined,
    tls: u.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: null, // BullMQ requires this
  }
}

const REDIS_URL = process.env.REDIS_URL
if (!REDIS_URL) {
  console.error('REDIS_URL is required')
  process.exit(1)
}

const connection = parseRedisUrl(REDIS_URL)

// ============================================================================
// QUEUE
// ============================================================================

export const queue = new Queue('agent-jobs', { connection })

// ============================================================================
// AGENT REGISTRY
// ============================================================================

interface AgentLike {
  id: string
  handleJob(data: any): Promise<{ success: boolean; data?: any; costUsd?: number }>
}

class EchoAgent implements AgentLike {
  id = 'echo'
  async handleJob(data: any) {
    console.log(`[echo] received: ${JSON.stringify(data)}`)
    return { success: true, data: { echoed: data }, costUsd: 0 }
  }
}

class GreeterAgent implements AgentLike {
  id = 'greeter'
  async handleJob(data: any) {
    const name = data?.name ?? 'friend'
    console.log(`[greeter] hello ${name}`)
    return { success: true, data: { greeting: `Hello, ${name}` }, costUsd: 0 }
  }
}

const registry = new Map<string, AgentLike>()
registry.set('echo', new EchoAgent())
registry.set('greeter', new GreeterAgent())

// ============================================================================
// WORKER
// ============================================================================

const worker = new Worker(
  'agent-jobs',
  async (job: Job) => {
    const agentId = job.data.agentId
    const agent = registry.get(agentId)
    if (!agent) throw new Error(`No agent for id=${agentId}`)

    const started = Date.now()
    const result = await agent.handleJob(job.data.inputData)
    const duration = Date.now() - started

    console.log(`[worker] ${job.id} done in ${duration}ms`)
    return result
  },
  {
    connection,
    concurrency: 5,
    stalledInterval: 20 * 60 * 1000,
  }
)

worker.on('completed', (job) => console.log(`[worker] completed ${job.id}`))
worker.on('failed', (job, err) =>
  console.error(`[worker] failed ${job?.id}:`, err.message)
)

// ============================================================================
// SELF-TEST (add a couple of jobs on startup)
// ============================================================================

async function selfTest() {
  await queue.add('job', { agentId: 'echo', inputData: { msg: 'hello world' } })
  await queue.add('job', { agentId: 'greeter', inputData: { name: 'Claude' } })
  await queue.add('job', { agentId: 'greeter', inputData: { name: 'Mia' } })
  console.log('[bootstrap] queued 3 test jobs')
}

if (require.main === module) {
  selfTest().catch((err) => {
    console.error('self-test failed:', err)
    process.exit(1)
  })
}
