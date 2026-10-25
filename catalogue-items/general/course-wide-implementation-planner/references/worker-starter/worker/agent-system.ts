/**
 * Worker entry point.
 *
 * 10 phases. Each one depends only on the phases above it.
 * Do not add business logic here. This file wires. Everything else lives
 * in lib/agents/.
 */

import 'dotenv/config'

import { JobQueue } from '../lib/agents/core/job-queue.js'
import { SlackRouter } from '../lib/agents/core/slack-router.js'
import { HeartbeatRunner } from '../lib/agents/core/heartbeat-runner.js'
import type { BaseAgent } from '../lib/agents/core/base-agent.js'
import { EchoAgent } from '../lib/agents/echo/agent.js'
import { MonitorAgent } from '../lib/agents/monitor/agent.js'

const REQUIRED_ENV = [
  'AGENT_SLACK_BOT_TOKEN',
  'AGENT_SLACK_APP_TOKEN',
  'AGENT_OPS_CHANNEL',
  'REDIS_URL',
] as const

async function main(): Promise<void> {
  const env = process.env.NODE_ENV ?? 'development'
  console.log('[AgentSystem] Starting.')
  console.log(`[AgentSystem] Environment: ${env}`)

  // Phase 1: env validation
  const missing = REQUIRED_ENV.filter((k) => !process.env[k])
  if (missing.length > 0) {
    console.error(`[AgentSystem] Missing required env vars: ${missing.join(', ')}`)
    process.exit(1)
  }

  // Phase 2: infrastructure
  const slackRouter = new SlackRouter(
    process.env.AGENT_SLACK_BOT_TOKEN!,
    process.env.AGENT_SLACK_APP_TOKEN!,
  )
  const jobQueue = new JobQueue(process.env.REDIS_URL!)
  await jobQueue.ping()
  console.log('[AgentSystem] Redis connected')

  // Phase 3: agent registration
  const echoAgent = new EchoAgent()
  const monitorAgent = new MonitorAgent({ opsChannel: process.env.AGENT_OPS_CHANNEL! })
  const agents: BaseAgent[] = [echoAgent, monitorAgent]

  const registry = new Map<string, BaseAgent>()
  for (const agent of agents) {
    agent.setSlackRouter(slackRouter)
    registry.set(agent.id, agent)
  }
  console.log(`[AgentSystem] ${registry.size} agents registered`)

  // Phase 4: Slack command routing
  slackRouter.registerCommand('echo', async (args, channel) => {
    await jobQueue.add('echo', 'echo.reply', { text: args, channel })
  })
  slackRouter.registerCommand('health', async (_args, channel) => {
    const text =
      `:green_heart: AgentSystem health\n` +
      `Agents: ${Array.from(registry.keys()).join(', ')}\n` +
      `Uptime: ${process.uptime().toFixed(0)}s`
    await slackRouter.postMessage(channel, text)
  })

  // Phase 5: heartbeats
  const heartbeats = new HeartbeatRunner()
  heartbeats.register({
    agentId: 'monitor',
    cron: '* * * * *', // every minute (swap for realistic cadence in prod)
    fn: () => monitorAgent.runHeartbeat(),
  })

  // Phase 6: worker processor
  const concurrency = Number(process.env.WORKER_CONCURRENCY ?? '5')
  jobQueue.createWorkerProcessor(registry, concurrency)
  console.log(`[AgentSystem] Worker started with concurrency=${concurrency}`)

  // Phase 7: connect Slack
  await slackRouter.connect()
  console.log('[AgentSystem] Slack connected via Socket Mode')

  // Phase 8: start heartbeats
  heartbeats.start()
  console.log('[AgentSystem] Heartbeat scheduled (every minute for monitor)')

  // Phase 9: graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`[AgentSystem] ${signal} received, shutting down`)
    heartbeats.stop()
    await slackRouter.disconnect().catch(() => {})
    await jobQueue.shutdown().catch(() => {})
    process.exit(0)
  }
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))

  // Phase 10: ready
  console.log('[AgentSystem] Ready.')
}

main().catch((err) => {
  console.error('[AgentSystem] Fatal boot error:', err)
  process.exit(1)
})
