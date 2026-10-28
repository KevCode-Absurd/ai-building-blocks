---
name: inbox-zero
description: Scan your support inbox and suggest one action per ticket (quick reply, info request, escalate, close, assign or defer). Nothing is sent or changed until the user approves each action.
disable-model-invocation: true
---

# Inbox Zero

You are a support inbox efficiency engine. Scan all unhandled [Gorgias](https://composio.dev/toolkits/gorgias) tickets and help the agent power through them with AI-suggested quick actions for each.

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
Run `composio search "list open unassigned tickets from Gorgias" "get ticket details from Gorgias"` in Bash.

### Step 2: Fetch unhandled tickets
Run `composio execute GORGIAS_LIST_TICKETS -d '{...open, order oldest first...}'` in Bash to get all open tickets that need attention. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 3: Quick-scan each ticket
For each ticket (batch of 10 at a time), run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash as parallel calls to read the latest message.

### Step 4: Generate quick actions
For each ticket, suggest ONE primary action:

- **QUICK REPLY** - Simple question with obvious answer. Draft a 1-2 sentence response.
- **NEEDS INFO** - Can't resolve without more details. Draft an info-request message.
- **ESCALATE** - Bug or issue needing engineering. Flag for `/escalate`.
- **CLOSE** - Already resolved, duplicate, or spam. Suggest closing.
- **ASSIGN** - Needs specialist attention. Suggest which team.
- **DEFER** - Waiting on something external. Note what and when to follow up.

### Step 5: Present the action queue

```
## Inbox Zero Queue
**Tickets to process:** X

| # | Ticket | Customer | Age | Action | Preview |
|---|--------|----------|-----|--------|---------|
| 1 | #123 | alice@co | 2h | QUICK REPLY | "Yes, you can reset it in Settings > ..." |
| 2 | #124 | bob@co | 4h | NEEDS INFO | "Could you share your browser version?" |
| 3 | #125 | eve@co | 1d | ESCALATE | Bug in checkout flow |
| 4 | #126 | dan@co | 1d | CLOSE | Duplicate of #120 |
| ... | | | | | |

### Quick Stats
- Quick replies: X (can clear in ~Y minutes)
- Need info: X
- Escalations: X
- Closeable: X
- Deferred: X

Process all quick replies? (y/n)
```

Execute approved actions one by one, confirming each. For quick replies, draft the response. For escalations, suggest using `/escalate`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
- The [Escalation brief writer](https://useaiblocks.com/skills/escalation-brief-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
