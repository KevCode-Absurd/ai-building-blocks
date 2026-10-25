/**
 * Minimal Router Scaffold
 *
 * A tiny message router that accepts inbound messages, classifies them
 * against three example agents, and dispatches to a job queue.
 *
 * This is the absolute minimum. No Slack SDK, no BullMQ. Use it to
 * understand the shape of the real SlackRouter + Orchestrator before
 * wiring in production pieces.
 */

// ============================================================================
// TYPES
// ============================================================================

interface InboundMessage {
  userId: string
  channelId: string
  threadTs: string | null
  text: string
}

interface Classification {
  agentId: string | null
  intent: string
  confidence: number
  tier: 'llm' | 'rules' | 'none'
}

interface AgentJob {
  id: string
  agentId: string
  jobType: string
  inputData: { message: string; classification: Classification }
  requestedBy: string
  createdAt: Date
}

type AgentHandler = (job: AgentJob) => Promise<{ response: string }>

// ============================================================================
// AGENT REGISTRY
// ============================================================================

interface RegistryEntry {
  id: string
  displayName: string
  triggers: string[]
  handler: AgentHandler
}

const registry = new Map<string, RegistryEntry>()

function registerAgent(entry: RegistryEntry) {
  registry.set(entry.id, entry)
}

// ============================================================================
// CLASSIFIER (rules-based, for the scaffold)
// ============================================================================

function classify(text: string): Classification {
  const lower = text.toLowerCase()
  let bestAgent: string | null = null
  let bestScore = 0

  for (const [id, entry] of registry) {
    const hits = entry.triggers.filter((t) => lower.includes(t)).length
    if (hits > bestScore) {
      bestScore = hits
      bestAgent = id
    }
  }

  if (!bestAgent || bestScore === 0) {
    return { agentId: null, intent: 'unknown', confidence: 0, tier: 'none' }
  }

  // Confidence scales with number of matching triggers.
  const confidence = Math.min(0.95, 0.5 + bestScore * 0.2)
  return { agentId: bestAgent, intent: 'chat', confidence, tier: 'rules' }
}

// ============================================================================
// IN-MEMORY JOB QUEUE (swap for BullMQ in production)
// ============================================================================

const queue: AgentJob[] = []

async function dispatchJob(job: AgentJob): Promise<void> {
  queue.push(job)
  console.log(`[queue] enqueued ${job.id} for ${job.agentId}`)
}

async function drainQueue(): Promise<void> {
  while (queue.length > 0) {
    const job = queue.shift()!
    const entry = registry.get(job.agentId)
    if (!entry) {
      console.error(`[queue] no handler for ${job.agentId}`)
      continue
    }
    try {
      const { response } = await entry.handler(job)
      console.log(`[${entry.displayName}] ${response}`)
    } catch (err) {
      console.error(`[queue] ${job.id} failed:`, err)
    }
  }
}

// ============================================================================
// ROUTE MESSAGE (what SlackRouter + Orchestrator.routeMessage does)
// ============================================================================

async function routeMessage(msg: InboundMessage): Promise<void> {
  const classification = classify(msg.text)

  if (!classification.agentId || classification.confidence < 0.5) {
    console.log('[router] not sure which agent should handle that.')
    return
  }

  const job: AgentJob = {
    id: `job-${Math.random().toString(36).slice(2, 10)}`,
    agentId: classification.agentId,
    jobType: 'chat',
    inputData: { message: msg.text, classification },
    requestedBy: msg.userId,
    createdAt: new Date(),
  }

  await dispatchJob(job)
}

// ============================================================================
// THREE EXAMPLE AGENTS
// ============================================================================

registerAgent({
  id: 'meta-agent',
  displayName: 'Meta Agent',
  triggers: ['meta', 'facebook', 'instagram', 'roas', 'pixel', 'ad set'],
  handler: async (job) => ({
    response: `Meta Agent received: "${job.inputData.message}"`,
  }),
})

registerAgent({
  id: 'google-agent',
  displayName: 'Google Agent',
  triggers: ['google ads', 'search campaign', 'pmax', 'quality score', 'shopping'],
  handler: async (job) => ({
    response: `Google Agent received: "${job.inputData.message}"`,
  }),
})

registerAgent({
  id: 'copy-agent',
  displayName: 'Copy Agent',
  triggers: ['rewrite', 'hook', 'copy', 'headline', 'cta'],
  handler: async (job) => ({
    response: `Copy Agent received: "${job.inputData.message}"`,
  }),
})

// ============================================================================
// LOCAL SELF-TEST
// ============================================================================

if (require.main === module) {
  const messages: InboundMessage[] = [
    { userId: 'U1', channelId: 'C1', threadTs: null, text: 'What is our Meta ROAS this week?' },
    { userId: 'U1', channelId: 'C1', threadTs: null, text: 'Rewrite this hook for a skincare ad.' },
    { userId: 'U1', channelId: 'C1', threadTs: null, text: 'Pull our Google Ads quality score.' },
    { userId: 'U1', channelId: 'C1', threadTs: null, text: 'What is the weather today?' },
  ]

  ;(async () => {
    for (const msg of messages) {
      await routeMessage(msg)
    }
    await drainQueue()
  })()
}
