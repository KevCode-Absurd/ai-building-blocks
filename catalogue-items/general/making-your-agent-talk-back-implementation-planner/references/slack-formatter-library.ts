/**
 * Slack Formatter Library
 *
 * Reusable Block Kit builders for agent responses. Agents produce structured
 * AgentResponse objects. This library turns them into Slack blocks.
 *
 * Public entry point: formatAgentResponse(response)
 */

// ============================================================================
// TYPES (duplicated locally so this file is standalone)
// ============================================================================

export interface AgentResponse {
  header: string
  sections: AgentResponseSection[]
  actions?: AgentAction[]
}

export interface AgentResponseSection {
  type: 'text' | 'findings' | 'error' | 'summary' | 'table' | 'code'
  text?: string
  data?: unknown
}

export interface AgentAction {
  label: string
  actionId: string
  style?: 'primary' | 'danger'
  url?: string
  value?: string
}

export interface Finding {
  severity: 'high' | 'medium' | 'low'
  type: string
  description: string
  location?: string
}

export interface TableData {
  headers: string[]
  rows: string[][]
}

// Slack block limits
const HEADER_MAX = 150
const SECTION_MAX = 2990 // Slack's 3000 limit with a safety buffer

// ============================================================================
// PUBLIC ENTRY POINT
// ============================================================================

export function formatAgentResponse(response: AgentResponse): unknown[] {
  const blocks: unknown[] = []

  if (response.header) {
    blocks.push(headerBlock(response.header))
  }

  for (const section of response.sections) {
    const built = formatSection(section)
    if (built) blocks.push(...built)
  }

  if (response.actions && response.actions.length > 0) {
    blocks.push(actionsBlock(response.actions))
  }

  return blocks
}

// ============================================================================
// SECTION FORMATTERS
// ============================================================================

function formatSection(section: AgentResponseSection): unknown[] {
  switch (section.type) {
    case 'text':
    case 'summary':
      return [markdownSection(truncate(section.text ?? '', SECTION_MAX))]
    case 'error':
      return [markdownSection(`:warning: ${truncate(section.text ?? '', SECTION_MAX - 20)}`)]
    case 'findings':
      return formatFindings((section.data as Finding[]) ?? [])
    case 'table':
      return [markdownSection(formatTable((section.data as TableData) ?? { headers: [], rows: [] }))]
    case 'code':
      return [markdownSection('```\n' + truncate(section.text ?? '', SECTION_MAX - 10) + '\n```')]
    default:
      return []
  }
}

function formatFindings(findings: Finding[]): unknown[] {
  if (findings.length === 0) return []
  const lines = findings.map((f) => {
    const emoji = severityEmoji(f.severity)
    const loc = f.location ? ` _(${f.location})_` : ''
    return `${emoji} *${f.type}* — ${f.description}${loc}`
  })
  return [markdownSection(truncate(lines.join('\n'), SECTION_MAX))]
}

function formatTable(data: TableData): string {
  if (!data.headers?.length) return '_(empty table)_'
  const lines: string[] = []
  lines.push('| ' + data.headers.join(' | ') + ' |')
  lines.push('|' + data.headers.map(() => '---').join('|') + '|')
  for (const row of data.rows) {
    lines.push('| ' + row.join(' | ') + ' |')
  }
  return lines.join('\n')
}

// ============================================================================
// BLOCK BUILDERS
// ============================================================================

function headerBlock(text: string): unknown {
  return {
    type: 'header',
    text: { type: 'plain_text', text: truncate(text, HEADER_MAX) },
  }
}

function markdownSection(text: string): unknown {
  return {
    type: 'section',
    text: { type: 'mrkdwn', text },
  }
}

function actionsBlock(actions: AgentAction[]): unknown {
  return {
    type: 'actions',
    elements: actions.map((a) => {
      const el: Record<string, unknown> = {
        type: 'button',
        text: { type: 'plain_text', text: truncate(a.label, 75) },
        action_id: a.actionId,
      }
      if (a.style) el.style = a.style
      if (a.url) el.url = a.url
      if (a.value) el.value = a.value
      return el
    }),
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function severityEmoji(s: Finding['severity']): string {
  switch (s) {
    case 'high':
      return ':red_circle:'
    case 'medium':
      return ':large_orange_circle:'
    case 'low':
      return ':large_yellow_circle:'
  }
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1) + '…'
}

// ============================================================================
// PROPOSAL HELPER (common pattern: text + approve/reject)
// ============================================================================

export function proposalResponse(args: {
  header: string
  body: string
  proposalId: string
}): AgentResponse {
  return {
    header: args.header,
    sections: [{ type: 'text', text: args.body }],
    actions: [
      { label: 'Approve', actionId: `proposal-approve-${args.proposalId}`, style: 'primary' },
      { label: 'Reject', actionId: `proposal-reject-${args.proposalId}`, style: 'danger' },
      { label: 'Modify', actionId: `proposal-modify-${args.proposalId}` },
    ],
  }
}

// ============================================================================
// STATUS HELPER (common pattern: short update, no actions)
// ============================================================================

export function statusResponse(header: string, text: string): AgentResponse {
  return {
    header,
    sections: [{ type: 'text', text }],
  }
}
