---
name: brief
description: Generate contextual briefings for legal work — daily summary, topic research, or incident response. Use when starting your day and need a scan of legal-relevant items across email, calendar, and contracts, when researching a specific legal question across internal sources, or when a developing situation (data breach, litigation threat, regulatory inquiry) needs rapid context.
argument-hint: "[daily | topic <query> | incident]"
---

# /brief -- Legal Team Briefing

> AI Blocks note: the CONNECTORS.md file named in the original is not in this folder. Where a source says "if connected", check whether your AI can read that source (email, calendar, chat, contract tool, CRM). If it cannot, say which sources you skipped and carry on with the rest. Never guess what a source would have shown.

Generate contextual briefings for legal work. Supports three modes: daily brief, topic brief, and incident brief.

**Important**: This command assists with legal workflows but does not provide legal advice. Briefings should be reviewed by qualified legal professionals before being relied upon.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Invocation

```
/brief daily              # Morning brief of legal-relevant items
/brief topic [query]      # Research brief on a specific legal question
/brief incident [topic]   # Rapid brief on a developing situation
```

If no mode is specified, ask the user which type of brief they need.

## Modes

---

### Daily Brief

A morning summary of everything a legal team member needs to know to start their day.

#### Sources to Scan

Check each connected source for legal-relevant items:

**Email (if connected):**
- New contract requests or review requests
- Compliance questions or reports
- Responses from counterparties on active negotiations
- Flagged or urgent items from the legal team inbox
- External counsel communications
- Regulatory or legal update newsletters

**Calendar (if connected):**
- Today's meetings that need legal prep (board meetings, deal reviews, vendor calls)
- Upcoming deadlines this week (contract expirations, filing deadlines, response deadlines)
- Recurring legal team syncs

**Chat (if connected):**
- Overnight messages in legal team channels
- Direct messages requesting legal input
- Mentions of legal-relevant topics (contract, compliance, privacy, NDA, terms)
- Escalations or urgent requests

**CLM (if connected):**
- Contracts awaiting review or signature
- Approaching expiration dates (next 30 days)
- Newly executed agreements

**CRM (if connected):**
- Deals moving to stages that require legal involvement
- New opportunities flagged for legal review

#### Output Format

```
## Daily Legal Brief -- [Date]

### Urgent / Action Required
[Items needing immediate attention, sorted by urgency]

### Contract Pipeline
- **Awaiting Your Review**: [count and list]
- **Pending Counterparty Response**: [count and list]
- **Approaching Deadlines**: [items due this week]

### New Requests
[Contract review requests, NDA requests, compliance questions received since last brief]

### Calendar Today
[Meetings with legal relevance and what prep is needed]

### Team Activity
[Key messages or updates from legal team channels]

### This Week's Deadlines
[Upcoming deadlines and filing dates]

### Sources Not Available
[Any sources that were not connected or returned errors]
```

---

### Topic Brief

Research and brief on a specific legal question or topic across available sources.

#### Workflow

1. Accept the topic query from the user
2. Search across connected sources:
   - **Documents**: Internal memos, prior analyses, playbooks, precedent
   - **Email**: Prior communications on the topic
   - **Chat**: Team discussions about the topic
   - **CLM**: Related contracts or clauses
3. Synthesize findings into a structured brief

#### Output Format

```
## Topic Brief: [Topic]

### Summary
[2-3 sentence executive summary of findings]

### Background
[Context and history from internal sources]

### Current State
[What the organization's current position or approach is, based on available documents]

### Key Considerations
[Important factors, risks, or open questions]

### Internal Precedent
[Prior decisions, memos, or positions found in internal sources]

### Gaps
[What information is missing or what sources were not available]

### Recommended Next Steps
[What the user should do with this information]
```

#### Important Notes
- Topic briefs synthesize what is available in connected sources; they do not substitute for formal legal research
- If the topic requires current legal authority or case law, recommend the user consult a legal research platform (Westlaw, Lexis, etc.) or outside counsel
- Always note the limitations of the sources searched

---

### Incident Brief

Rapid briefing for developing situations that require immediate legal attention (data breaches, litigation threats, regulatory inquiries, IP disputes, etc.).

#### Workflow

1. Accept the incident topic or description
2. Rapidly scan all connected sources for relevant context:
   - **Email**: Communications about the incident
   - **Chat**: Real-time discussions and escalations
   - **Documents**: Relevant policies, response plans, insurance coverage
   - **Calendar**: Scheduled response meetings
   - **CLM**: Affected contracts, indemnification provisions, insurance requirements
3. Compile into an actionable incident brief

#### Output Format

```
## Incident Brief: [Topic]
**Prepared**: [timestamp]
**Classification**: [severity assessment if determinable]

### Situation Summary
[What is known about the incident]

### Timeline
[Chronological summary of events based on available sources]

### Immediate Legal Considerations
[Regulatory notification requirements, preservation obligations, privilege concerns]

### Relevant Agreements
[Contracts, insurance policies, or other agreements that may be implicated]

### Internal Response
[What response activity has already occurred based on email/chat]

### Key Contacts
[Relevant internal and external contacts identified from sources]

### Recommended Immediate Actions
1. [Most urgent action]
2. [Second priority]
3. [etc.]

### Information Gaps
[What is not yet known and needs to be determined]

### Sources Checked
[What was searched and what was not available]
```

#### Important Notes for Incident Briefs
- Speed matters. Produce the brief quickly with available information rather than waiting for complete information
- Flag any litigation hold or preservation obligations immediately
- Note privilege considerations (mark the brief as attorney-client privileged / work product if appropriate)
- If the incident may involve a data breach, flag applicable notification deadlines (e.g., 72 hours for GDPR)
- Recommend outside counsel engagement if the matter is significant

## General Notes

- If sources are unavailable, note the gaps prominently so the user knows what was not checked
- For daily briefs, learn the user's preferences over time (what they find useful, what they want filtered out)
- Briefs should be actionable: every item should have a clear next step or reason for inclusion
- Keep briefs concise. Link to source materials rather than reproducing them in full

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Incoming demand letter reviewer](https://useaiblocks.com/skills/incoming-demand-letter-reviewer). It takes the document.
- The [Subpoena first-look reviewer](https://useaiblocks.com/skills/subpoena-first-look-reviewer). It takes the document.
- The [Dispute timeline builder](https://useaiblocks.com/skills/dispute-timeline-builder). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
