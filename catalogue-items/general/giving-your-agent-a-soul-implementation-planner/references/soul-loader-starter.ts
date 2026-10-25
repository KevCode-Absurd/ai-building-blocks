/**
 * Soul Loader Starter
 *
 * Loads, parses, and caches agent soul files. Composes the full soul prefix
 * injected into every AI call's system prompt.
 *
 * Minimum-viable version: singleton, file-based, in-memory cache, and
 * token-budget truncation.
 *
 * Usage:
 *   const loader = SoulLoader.getInstance()
 *   const prefix = loader.getSoulPrefix('facebook-ads', 8192)
 *   // prepend `prefix` to your system prompt before calling the model
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// ============================================================================
// TYPES
// ============================================================================

export interface SoulMetadata {
  name: string
  role: string
  emoji: string
  slackDisplay: string
  version: string
  tokenBudget: number
  prioritySections: string[]
  ackPhrases: string[]
  relatedAgents: string[]
}

export interface ComposedSoul {
  metadata: SoulMetadata
  identity: string
  guardrails: string
  knowledge: string
  soul: string
  fullText: string
}

// ============================================================================
// CONFIG
// ============================================================================

// Expect this file to live one level below the souls/ directory.
// Adjust the join() call if your layout differs.
const SOULS_DIR = join(__dirname, 'souls')

function estimateTokens(text: string): number {
  // ~4 chars per token is good enough for budget gating.
  return Math.ceil(text.length / 4)
}

// ============================================================================
// SOUL LOADER
// ============================================================================

export class SoulLoader {
  private static instance: SoulLoader | null = null
  private cache = new Map<string, ComposedSoul | null>()
  private sharedIdentity: string | null = null
  private sharedGuardrails: string | null = null

  static getInstance(): SoulLoader {
    if (!SoulLoader.instance) SoulLoader.instance = new SoulLoader()
    return SoulLoader.instance
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  loadSoul(agentId: string): ComposedSoul | null {
    if (this.cache.has(agentId)) return this.cache.get(agentId) ?? null

    const soulPath = join(SOULS_DIR, agentId, 'SOUL.md')
    if (!existsSync(soulPath)) {
      this.cache.set(agentId, null)
      return null
    }

    try {
      const raw = readFileSync(soulPath, 'utf-8')
      const { metadata, body } = this.parseFrontmatter(raw)

      const identity = this.loadSharedIdentity()
      const guardrails = this.loadSharedGuardrails()
      const knowledge = this.loadKnowledge(agentId)

      const fullText = [identity, guardrails, knowledge, body]
        .filter(Boolean)
        .join('\n\n---\n\n')

      const composed: ComposedSoul = { metadata, identity, guardrails, knowledge, soul: body, fullText }
      this.cache.set(agentId, composed)
      return composed
    } catch (err) {
      console.error(`[soul-loader] failed to load ${agentId}:`, err)
      this.cache.set(agentId, null)
      return null
    }
  }

  getSoulMetadata(agentId: string): SoulMetadata | null {
    return this.loadSoul(agentId)?.metadata ?? null
  }

  /**
   * Return the soul prefix, truncated to fit the token budget if needed.
   * Pass maxTokens from your AI call config so we know how much room is left.
   */
  getSoulPrefix(agentId: string, maxTokens?: number): string {
    // Tiny calls skip the soul entirely. A 5000-token soul in a 500-token call
    // would crowd out the task.
    if (maxTokens !== undefined && maxTokens < 1024) return ''

    const composed = this.loadSoul(agentId)
    if (!composed) return ''

    const { metadata, identity, guardrails, knowledge, soul, fullText } = composed
    const budget = metadata.tokenBudget

    // Step 0: full text fits.
    if (estimateTokens(fullText) <= budget) return fullText

    // Step 1: drop guardrails first. Guardrails get reinforced by the soul body.
    const s1 = [identity, knowledge, soul].filter(Boolean).join('\n\n---\n\n')
    if (estimateTokens(s1) <= budget) return s1

    // Step 2: trim identity to the first paragraph.
    const trimmedIdentity = identity.split('\n\n')[0] ?? ''
    const s2 = [trimmedIdentity, knowledge, soul].filter(Boolean).join('\n\n---\n\n')
    if (estimateTokens(s2) <= budget) return s2

    // Step 3: keep only priority sections from the soul body.
    const prioritySoul = this.filterPrioritySections(soul, metadata.prioritySections)
    const s3 = [knowledge, prioritySoul].filter(Boolean).join('\n\n---\n\n')
    if (estimateTokens(s3) <= budget) return s3

    // Step 4: soul body only.
    if (estimateTokens(soul) <= budget) return soul

    // Step 5: hard truncate. Personality wins over completeness.
    const maxChars = budget * 4
    return soul.slice(0, maxChars) + '\n\n[truncated]'
  }

  // --------------------------------------------------------------------------
  // Internals
  // --------------------------------------------------------------------------

  private parseFrontmatter(raw: string): { metadata: SoulMetadata; body: string } {
    // Super-lightweight frontmatter parser. Swap for gray-matter in production.
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!match) {
      return { metadata: this.defaultMetadata(), body: raw }
    }
    const yaml = match[1]
    const body = match[2]

    const pick = (key: string): string | undefined => {
      const m = yaml.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))
      return m?.[1]?.trim()
    }

    const pickList = (key: string): string[] => {
      const block = yaml.match(new RegExp(`^${key}:\\s*\\n((?:  - .+\\n?)+)`, 'm'))
      if (!block) return []
      return block[1]
        .split('\n')
        .map((line) => line.replace(/^\s*-\s*"?/, '').replace(/"?$/, '').trim())
        .filter(Boolean)
    }

    const metadata: SoulMetadata = {
      name: pick('name') ?? 'Unnamed',
      role: pick('role') ?? 'Unassigned',
      emoji: pick('emoji') ?? ':robot_face:',
      slackDisplay: pick('slack_display') ?? pick('name') ?? 'Unnamed',
      version: pick('version') ?? '0.1',
      tokenBudget: Number(pick('token_budget') ?? 4000),
      prioritySections: pickList('priority_sections'),
      ackPhrases: pickList('ack_phrases'),
      relatedAgents: pickList('related_agents'),
    }
    return { metadata, body: body.trim() }
  }

  private defaultMetadata(): SoulMetadata {
    return {
      name: 'Unnamed',
      role: 'Unassigned',
      emoji: ':robot_face:',
      slackDisplay: 'Unnamed',
      version: '0.1',
      tokenBudget: 4000,
      prioritySections: [],
      ackPhrases: [],
      relatedAgents: [],
    }
  }

  private loadSharedIdentity(): string {
    if (this.sharedIdentity !== null) return this.sharedIdentity
    const p = join(SOULS_DIR, '_shared', 'IDENTITY.md')
    this.sharedIdentity = existsSync(p) ? readFileSync(p, 'utf-8') : ''
    return this.sharedIdentity
  }

  private loadSharedGuardrails(): string {
    if (this.sharedGuardrails !== null) return this.sharedGuardrails
    const p = join(SOULS_DIR, '_shared', 'GUARDRAILS.md')
    this.sharedGuardrails = existsSync(p) ? readFileSync(p, 'utf-8') : ''
    return this.sharedGuardrails
  }

  private loadKnowledge(agentId: string): string {
    const p = join(SOULS_DIR, agentId, 'KNOWLEDGE.md')
    return existsSync(p) ? readFileSync(p, 'utf-8') : ''
  }

  private filterPrioritySections(body: string, priorities: string[]): string {
    if (priorities.length === 0) return body
    const sections = body.split(/\n(?=# )/)
    const kept = sections.filter((sec) => {
      const header = sec.match(/^#\s+(.+)$/m)?.[1]?.toLowerCase().trim() ?? ''
      return priorities.some((p) => header.includes(p.toLowerCase()))
    })
    return kept.join('\n\n')
  }
}
