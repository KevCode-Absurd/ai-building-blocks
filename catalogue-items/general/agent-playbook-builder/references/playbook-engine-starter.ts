/**
 * Playbook Engine Starter
 *
 * Minimal playbook runner. Scans recent findings, detects patterns, and
 * synthesizes coordinated analyses. Rollback-safe.
 *
 * Core loop (call every 15-30 minutes from your worker):
 *   1. For each registered playbook:
 *      a. Query findings within the time window
 *      b. Group by client
 *      c. For each client: count how many trigger conditions matched
 *      d. If matches >= minMatchCount and cooldown is clear: fire
 *   2. On fire:
 *      a. Request perspectives from analysisAgents
 *      b. Synthesize into a single diagnosis
 *      c. Post to the ops channel
 *      d. Optionally open a parent issue
 *      e. Optionally generate a draft proposal
 *      f. Record activation with cooldown timestamp
 *
 * Reporting only. No actions without a proposal and human approval.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface PlaybookTriggerCondition {
  agentId: string
  findingTypes: string[]
  minSeverity: 'info' | 'warning' | 'critical'
}

export interface PlaybookDefinition {
  id: string
  name: string
  description: string
  triggerPattern: {
    requiredFindings: PlaybookTriggerCondition[]
    timeWindowHours: number
    minMatchCount: number
  }
  analysisAgents: string[]
  cooldownHours: number
  issueTemplate?: {
    title: string
    description?: string
    labels?: string[]
    priority?: 1 | 2 | 3
  }
  autoProposal?: {
    proposal_type: 'action' | 'investigation' | 'strategy-change'
    urgency: 'normal' | 'high' | 'emergency'
    target_channel_id?: string
  }
}

interface Finding {
  id: string
  agent_id: string
  client_id: string | null
  finding_type: string
  severity: 'info' | 'warning' | 'critical' | 'opportunity'
  created_at: string
}

interface PlaybookActivation {
  playbook_id: string
  client_id: string | null
  triggered_at: string
}

// ============================================================================
// DI CONTAINER
// ============================================================================

type FetchFindingsFn = (args: {
  sinceIso: string
  agentIds: string[]
  findingTypes: string[]
}) => Promise<Finding[]>

type FetchActivationsFn = (args: {
  sinceIso: string
  playbookId: string
}) => Promise<PlaybookActivation[]>

type RequestAgentPerspectiveFn = (args: {
  agentId: string
  playbook: PlaybookDefinition
  findings: Finding[]
  clientId: string | null
}) => Promise<string>

type SynthesizeFn = (args: {
  playbook: PlaybookDefinition
  perspectives: Array<{ agentId: string; text: string }>
  findings: Finding[]
  clientId: string | null
}) => Promise<string>

type PostDiagnosisFn = (args: {
  playbook: PlaybookDefinition
  clientId: string | null
  diagnosis: string
  perspectives: Array<{ agentId: string; text: string }>
  findings: Finding[]
}) => Promise<void>

type RecordActivationFn = (args: {
  playbookId: string
  clientId: string | null
  findingIds: string[]
  metadata?: Record<string, unknown>
}) => Promise<void>

let fetchFindings: FetchFindingsFn | null = null
let fetchActivations: FetchActivationsFn | null = null
let requestAgentPerspective: RequestAgentPerspectiveFn | null = null
let synthesize: SynthesizeFn | null = null
let postDiagnosis: PostDiagnosisFn | null = null
let recordActivation: RecordActivationFn | null = null

export function setFetchFindings(fn: FetchFindingsFn): void { fetchFindings = fn }
export function setFetchActivations(fn: FetchActivationsFn): void { fetchActivations = fn }
export function setRequestAgentPerspective(fn: RequestAgentPerspectiveFn): void { requestAgentPerspective = fn }
export function setSynthesize(fn: SynthesizeFn): void { synthesize = fn }
export function setPostDiagnosis(fn: PostDiagnosisFn): void { postDiagnosis = fn }
export function setRecordActivation(fn: RecordActivationFn): void { recordActivation = fn }

// ============================================================================
// ENGINE
// ============================================================================

const SEVERITY_RANK: Record<Finding['severity'], number> = {
  opportunity: 0,
  info: 1,
  warning: 2,
  critical: 3,
}

function meetsSeverity(f: Finding, floor: 'info' | 'warning' | 'critical'): boolean {
  return SEVERITY_RANK[f.severity] >= SEVERITY_RANK[floor]
}

export async function detectAndExecutePlaybooks(
  playbooks: PlaybookDefinition[],
): Promise<void> {
  for (const playbook of playbooks) {
    try {
      await runOne(playbook)
    } catch (err: any) {
      console.error(`[PlaybookEngine] ${playbook.id} failed:`, err.message)
    }
  }
}

async function runOne(playbook: PlaybookDefinition): Promise<void> {
  if (!fetchFindings || !fetchActivations) throw new Error('DI not wired')

  const sinceIso = new Date(
    Date.now() - playbook.triggerPattern.timeWindowHours * 3600_000,
  ).toISOString()

  // Pull candidate findings in one query
  const agentIds = Array.from(
    new Set(playbook.triggerPattern.requiredFindings.map((c) => c.agentId)),
  )
  const findingTypes = Array.from(
    new Set(playbook.triggerPattern.requiredFindings.flatMap((c) => c.findingTypes)),
  )

  const candidates = await fetchFindings({ sinceIso, agentIds, findingTypes })

  // Group by client
  const byClient = new Map<string | null, Finding[]>()
  for (const f of candidates) {
    const key = f.client_id
    if (!byClient.has(key)) byClient.set(key, [])
    byClient.get(key)!.push(f)
  }

  // Check each client against the trigger pattern
  for (const [clientId, clientFindings] of byClient) {
    const matched = matchedConditions(playbook, clientFindings)
    if (matched < playbook.triggerPattern.minMatchCount) continue

    // Cooldown check
    const cooldownIso = new Date(
      Date.now() - playbook.cooldownHours * 3600_000,
    ).toISOString()
    const recent = await fetchActivations({ sinceIso: cooldownIso, playbookId: playbook.id })
    const inCooldown = recent.some((a) => a.client_id === clientId)
    if (inCooldown) continue

    await executePlaybook(playbook, clientId, clientFindings)
  }
}

function matchedConditions(
  playbook: PlaybookDefinition,
  findings: Finding[],
): number {
  let matched = 0
  for (const cond of playbook.triggerPattern.requiredFindings) {
    const hit = findings.some(
      (f) =>
        f.agent_id === cond.agentId &&
        cond.findingTypes.includes(f.finding_type) &&
        meetsSeverity(f, cond.minSeverity),
    )
    if (hit) matched++
  }
  return matched
}

async function executePlaybook(
  playbook: PlaybookDefinition,
  clientId: string | null,
  triggerFindings: Finding[],
): Promise<void> {
  if (!requestAgentPerspective || !synthesize || !postDiagnosis || !recordActivation) {
    throw new Error('DI not wired for execution')
  }

  // 1. Collect perspectives
  const perspectives: Array<{ agentId: string; text: string }> = []
  for (const agentId of playbook.analysisAgents) {
    try {
      const text = await requestAgentPerspective({
        agentId,
        playbook,
        findings: triggerFindings,
        clientId,
      })
      perspectives.push({ agentId, text })
    } catch (err: any) {
      console.error(`[PlaybookEngine] perspective from ${agentId} failed:`, err.message)
    }
  }

  // 2. Synthesize
  const diagnosis = await synthesize({
    playbook,
    perspectives,
    findings: triggerFindings,
    clientId,
  })

  // 3. Post (wrap in try so record still happens on Slack failure)
  try {
    await postDiagnosis({
      playbook,
      clientId,
      diagnosis,
      perspectives,
      findings: triggerFindings,
    })
  } catch (err: any) {
    console.error(`[PlaybookEngine] post failed:`, err.message)
  }

  // 4. Record activation (enforces cooldown going forward)
  await recordActivation({
    playbookId: playbook.id,
    clientId,
    findingIds: triggerFindings.map((f) => f.id),
    metadata: {
      diagnosis_snippet: diagnosis.slice(0, 240),
      perspective_count: perspectives.length,
    },
  })
}

// ============================================================================
// ROLLBACK
// ============================================================================
//
// Rollback only matters if you chose to open an issue or generate a proposal.
// The diagnostic post itself is idempotent (re-posting just creates a second
// message, which is visible and recoverable).
//
// For rollback semantics you need:
//   - Idempotency key on `postDiagnosis` (use playbook_id + client_id + day)
//   - On issue/proposal creation failure: set activation metadata.failed = true
//   - A cron that retries failed activations with exponential backoff
//
// Keep the engine synchronous-in-spirit. If the whole run fails partway, the
// next cron tick re-evaluates and will re-fire if the signal is still there.
