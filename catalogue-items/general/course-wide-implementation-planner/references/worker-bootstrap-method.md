# The Worker Bootstrap: How the Whole System Starts

**Module:** 02 - 3.Building Your Agent System

## Transcript / Content

The main() function that wires the entire agent system together. Environment validation, infrastructure initialization, agent registration, control plane wiring, monitoring setup, cron scheduling, and graceful shutdown.Render Deployment GuideDeploying worker/agent-system.ts as a Background Worker on Render. Start-to-live in roughly 30 minutes.Prerequisites- Render account (free tier works for testing; upgrade for production) - GitHub repo with your agent system code - Upstash or Render Redis instance - Supabase project (URL + service role key) - Slack app with bot token + app token (Socket Mode enabled)Step 1: Create the service- Render Dashboard -> New -> Background Worker - Connect your GitHub repo - Name: bwm-agent-system-worker (or your equivalent) - Region: Virginia (or closest to your Redis) - Branch: main - Runtime: Node - Build Command: npm install - Start Command: npx tsx worker/agent-system.ts - Plan: Starter ($7/mo) for light use, Standard ($25/mo) for productionDo NOT pick Web Service. Background Workers have no HTTP port.Step 2: Set environment variablesIn the service dashboard -> Environment, add:[Image: image.png] (https://assets.skool.com/f/da2509cb3fc84581aee465c37d43a5a0/8b4c6ae126c349a292d8fa35e6eac143bf01eea8f41e4802a8a0d24df4e40e42.png)PUT /env-vars REPLACES ALL env vars in Render's API. If using the MCP, always send the complete set.Step 3: Add a health check (optional but recommended)Background Workers do not expose HTTP by default. Add a lightweight endpoint by running a tiny Express server in parallel:// At the top of worker/agent-system.ts
import express from 'express'
const healthApp = express()
healthApp.get('/healthz', (_, res) => res.json({ ok: true, uptime: process.uptime() }))
healthApp.listen(process.env.PORT || 10000)
Then in Render, add PORT=10000 to env vars and configure the health check path in service settings.Step 4: Auto-deploy hooks- Auto-deploy: ON (main branch) - Pre-deploy command: npx tsc --noEmit (catches type errors before deploy)If the TypeScript check fails, the deploy aborts and the previous version keeps running.Step 5: First deploy- Push to main - Render detects the push and builds - Watch the build logs - Once the build succeeds, the worker starts - Expected log output:[AgentSystem] Starting Agent System...
[AgentSystem] Environment: production
[AgentSystem] Redis connected
[AgentSystem] 12 agents registered
[AgentSystem] Control plane enabled: initializing components
[AgentSystem] Monitoring loop started (14 checks across 6 agents)
[AgentSystem] Self-reflection runner scheduled: 6 AM daily
[AgentSystem] SlackRouter connected to Slack via Socket Mode
[AgentSystem] Worker started with concurrency=5
[AgentSystem] Orphan recovery: 0 stuck jobs found
[AgentSystem] Agent System ready.
If any of these are missing, the boot failed at that phase.Step 6: Log monitoringRender's log viewer is fine for spot checks. For production:- Logtail / Better Stack: pipe Render logs via syslog drain - Sentry: add @sentry/node to capture unhandled rejections - Slack: wire critical errors (budget auto-pause, orphan recovery failures) to post into an internal ops channelStep 7: ScalingBackground Workers are single-instance by default. Agent systems rarely need multiple instances because:- BullMQ concurrency handles job parallelism inside one process - Slack Socket Mode does not multiplex well (one socket per process is simpler) - Cron jobs running twice will cause duplicatesIf you need more throughput, raise WORKER_CONCURRENCY to 10-20 before adding a second instance.Step 8: Deploy safelyBefore merging to main:npx tsc --noEmit       # Must pass
npm run build          # Must pass
Fix ALL errors. Only merge when both pass. Render's auto-deploy is unforgiving if the build breaks — the worker process restarts and may lose in-flight jobs.Common deployment failures[Image: image.png] (https://assets.skool.com/f/da2509cb3fc84581aee465c37d43a5a0/797cfc0631dc4cd2893c3c4ddea1b4ae39cd0988d8ba4166bc1dad43eea0321b.png)System Boot DiagramThe 10 phases of main(). Each phase depends only on the phases below it. Read top to bottom.Phase 1: Environment validationLoad .env.local (dotenv)Check required env vars:- AGENT_SLACK_BOT_TOKEN - AGENT_SLACK_APP_TOKEN - NEXT_PUBLIC_SUPABASE_URL - SUPABASE_SERVICE_ROLE_KEY (or legacy SUPABASE_SERVICE_KEY) - REDIS_URLMissing → process.exit(1) with clear messagePresent → continuePhase 2: Infrastructure- new SlackRouter() → connect to Slack via Socket Mode - new JobQueue() → connect to Redis, create BullMQ queue - new HealthMonitor() → begin uptime tracking - new Orchestrator(slackRouter) → intent classifier, conversation cachePhase 3: Agent registration- new EchoAgent() - new FacebookAdsAgent() - new GoogleAdsAgent() - … (one per agent)For each:- agent.setSlackRouter(slackRouter)Registry:agentRegistry = Map<string, BaseAgentInterface>
  'echo'           -> echoAgent
  'facebook-ads'   -> facebookAdsAgent
  ...Head agent wiring:headAgent.setHandoffCallback(
  (from, parentJobId, instruction, slackCtx, scope) =>
    orchestrator.handleHandoff(...)
)Phase 4: Monitoring loop- new MonitoringLoop()For each agent:- agent.registerMonitoringChecks(monitoringLoop)Start schedules:- hourly → 0 * * * * - every 6h → 0 */6 * * * - daily → 5 7 * * * - weekly → 0 8 * * 1Phase 5: Control plane wiring (if enabled)- ProposalEngine.setSlackPoster(...) - ProposalEngine.setSlackUpdater(...) - WakeupDispatcher.setQueueAdder(jobQueue.add) - DelegationManager.setIssueCreator(IssueManager.createIssue) - DelegationManager.setWakeupDispatcher(WakeupDispatcher.dispatch) - FindingToActionRouter.setProposer(ProposalEngine.propose) - BudgetEnforcer.setFetchPolicies(...) - BudgetEnforcer.setPauseAgent(...) - HeartbeatRunner.setAgentRegistry(agentRegistry)All dependency injection happens here.No circular imports. No global state outside this file.Phase 6: Worker processorjobQueue.createWorkerProcessor(agentRegistry, orchestrator)- BullMQ worker starts with concurrency = 5For each job:registry.get(job.agentId).handleJob(job)Phase 7: Cron schedules- 0 6 * * * → runSelfReflection (daily 6 AM) - 0 8 * * * → runDailyDigest (daily 8 AM) - */15 * * * * → detectAndExecutePlaybooks (every 15 min) - 0 */4 * * * → syncAllSOPs (every 4 hours) - */5 * * * * → recoverStuckJobs (every 5 min) - 0 9 * * 1 → generateWeeklyFeedbackDigest (Monday 9 AM)Phase 8: Orphan recovery- await jobQueue.recoverStuckJobs()Process:- Find jobs in Supabase with status='queued' but missing from Redis - Re-enqueue each with original payload - Log count - Continue even if recovery failsPhase 9: Graceful shutdown wiringprocess.on('SIGTERM', shutdownHandler)
process.on('SIGINT', shutdownHandler)Handler:shutdownHandler = async () => {
  log 'Shutting down gracefully'
  await slackRouter.disconnect()
  await jobQueue.shutdown()
  await orchestrator.shutdown()
  process.exit(0)
}Phase 10: Readyconsole.log 'Agent System ready.'The process runs indefinitely. No return from main().Dependency direction (strict)Layer 6  Intelligence (MonitoringLoop, PlaybookEngine, SelfReflection, Feedback, Learning)
           ^
Layer 5  Control Plane (Heartbeat, Issues, Proposals, Delegation, Wakeup, Budget)
           ^
Layer 4  Agents (BaseAgent, specialists, SoulLoader)
           ^
Layer 3  Routing (Orchestrator, IntentClassifier, ConversationContext)
           ^
Layer 2  Transport (SlackRouter, JobQueue, Worker)
           ^
Layer 1  Infrastructure (Redis, Supabase, Slack Socket Mode)Rules:- Each layer depends only on the layer below - No layer reaches down more than one level - Changes in higher layers cannot break lower layers
