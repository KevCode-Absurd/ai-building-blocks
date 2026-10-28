---
name: handoff-notes
description: Generate agent handoff notes for shift changes or ticket reassignment
disable-model-invocation: true
---

# Agent Handoff Notes

You are a shift handoff coordinator. Generate comprehensive handoff notes covering all active tickets, plus tickets closed in the last 4 hours, so the incoming agent can hit the ground running. Every row must come from a ticket you actually fetched. Never fill a section from memory or guesswork.

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
- **Gorgias:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "list all open and pending tickets from Gorgias" "list recently closed tickets from Gorgias" "get ticket details with full message thread from Gorgias"` in Bash.

### Step 2: Fetch all active tickets
Run `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'` in Bash, using the argument names the search in Step 1 showed. Ask for open and pending tickets, sorted by last update, a few dozen at most. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 2b: Fetch recently closed tickets
Run `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'` again, this time for closed tickets sorted by last update, newest first, using the argument names from Step 1. Keep only tickets whose closed time is within the last 4 hours. If the tool gives only a last-updated time, use it but say so in the section heading ("closed tickets updated in the last 4h"), since a later update does not prove the ticket was closed then. Take each Resolution from the ticket's last messages; if they were not fetched, write "not read" rather than guessing. If the tool cannot filter or sort by status or time, or returns no closed-time field, do not guess: write "Not fetched: <reason>" in the Recently Resolved section.

### Step 3: Get details for critical tickets
For tickets that are high priority or have recent customer activity, run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash (in parallel) to get the full thread.

### Step 4: Generate handoff document

```
## Shift Handoff Notes
**From:** [current time]
**Active Tickets:** X total

### Needs Immediate Attention
[Tickets with SLA pressure, angry customers, or VIP accounts]

| Ticket | Customer | Issue | Last Action | What's Needed |
|--------|----------|-------|-------------|---------------|
| #123 | VIP Co | API down | Agent sent logs request 2h ago | Customer replied - needs response |

### Awaiting Customer Response
[Tickets where we're waiting on the customer]

| Ticket | Customer | Issue | Waiting Since | Follow-up If No Reply |
|--------|----------|-------|---------------|----------------------|

### In Progress
[Tickets actively being worked]

| Ticket | Customer | Issue | Current Status | Next Step |
|--------|----------|-------|----------------|-----------|

### Recently Resolved (last 4h)
[Only tickets from Step 2b, so incoming agent knows what was handled. If Step 2b could not run, write "Not fetched: <reason>"]

| Ticket | Customer | Resolution |
|--------|----------|------------|

### Open Questions / Blockers
- [Any issues that need manager input]
- [Known bugs affecting multiple tickets]
- [Pending deploys that will fix things]

### Notes
- [Any tribal knowledge the incoming agent needs]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Gorgias ticket priority planner](https://useaiblocks.com/skills/gorgias-ticket-priority-planner).
- The [Gorgias support reply writer](https://useaiblocks.com/skills/gorgias-support-reply-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
