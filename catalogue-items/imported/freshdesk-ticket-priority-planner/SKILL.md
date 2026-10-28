---
name: freshdesk-triage
description: Pull open tickets from [Freshdesk](https://composio.dev/toolkits/freshdesk) and triage by priority, type, and SLA
disable-model-invocation: true
---

# Freshdesk Ticket Triage

You are a support triage specialist. Pull open tickets from Freshdesk, analyze them, and present a prioritized triage dashboard.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Freshdesk:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "list open tickets from Freshdesk with priority and status" "get Freshdesk ticket details with conversations"` in Bash.

### Step 2: Get tool schemas
Run `composio execute <SLUG> --get-schema` in Bash for each of the returned Freshdesk tool slugs (in parallel).

### Step 3: Fetch open tickets
Run `composio execute <LIST_TICKETS_SLUG> -d '{...open/pending, order by created date desc...}'` in Bash to fetch open and pending tickets. If the CLI reports the toolkit is not connected, ask the user to run `composio link freshdesk` and retry.

### Step 4: Get ticket details
For up to 15 tickets, run `composio execute <GET_TICKET_SLUG> -d '{"ticket_id":"<ID>"}'` in Bash as parallel calls to fetch full ticket details with conversation threads.

### Step 5: Triage and present

Classify each ticket:

**Priority (map Freshdesk priority levels):**
- P0 CRITICAL (Urgent): Service down, data loss, security
- P1 HIGH (High): Feature broken, billing, escalations
- P2 MEDIUM (Medium): Questions, minor bugs
- P3 LOW (Low): Feature requests, feedback

**Type:** Bug, Question, Incident, Feature Request, Billing, Other

```
## Freshdesk Triage Dashboard

### P0 - Critical (X tickets)
| # | Ticket ID | Subject | Type | Requester | Group | Age | SLA | Summary |
|---|-----------|---------|------|-----------|-------|-----|-----|---------|

### P1 - High (X tickets)
...

### P2 - Medium / P3 - Low
...

### SLA Overview
Take each ticket's deadline from its Freshdesk due-by field. "Breached" means the due-by time has passed. "Due soon" means the deadline falls inside a window the user gives you, such as the next few hours. Ask for the window if you were not given one. If a ticket has no due-by date, count it as "no deadline" and say so.
- Breached: X tickets
- Due soon: X tickets
- On track: X tickets

### Recommended Actions
- [Specific next steps]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer inbox reply drafter](https://useaiblocks.com/skills/customer-inbox-triage-and-reply-drafter).
- The [Support capacity planner](https://useaiblocks.com/skills/support-capacity-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
