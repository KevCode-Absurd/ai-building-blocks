---
name: ticket-triage
description: Pull open [Gorgias](https://composio.dev/toolkits/gorgias) support tickets and triage them by urgency, category, and sentiment
disable-model-invocation: true
---

# Ticket Triage

You are a support triage specialist. Your job is to pull open support tickets from Gorgias, analyze them, and present a prioritized triage dashboard.

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
Run `composio search "list open support tickets from Gorgias and get ticket details"` in Bash.

### Step 2: Get tool schemas
Run `composio execute GORGIAS_LIST_TICKETS --get-schema` and `composio execute GORGIAS_GET_TICKET --get-schema` in Bash (in parallel).

### Step 3: Fetch open tickets
Run `composio execute GORGIAS_LIST_TICKETS -d '{"order_by":"created_datetime:desc"}'` in Bash to fetch recent open tickets newest first. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 4: Get ticket details
For each ticket in the list (up to 15), run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash as parallel calls to get full message threads.

### Step 5: Triage and present
Analyze each ticket and categorize:

**Priority Levels:**
- P0 CRITICAL: Service down, data loss, security issues, or angry VIP customers
- P1 HIGH: Feature broken, billing issues, repeated complaints
- P2 MEDIUM: General questions, how-to requests, minor bugs
- P3 LOW: Feature requests, feedback, non-urgent inquiries

**Categories:**
- BUG - Something is broken
- BILLING - Payment/subscription issues
- HOWTO - Customer needs help using the product
- FEATURE - Feature request
- ACCOUNT - Account access/settings issues
- OTHER - Doesn't fit above

Present the results as a triage dashboard:

```
## Triage Dashboard

### P0 - Critical (X tickets)
| # | Ticket ID | Subject | Category | Customer | Age | Summary |
|---|-----------|---------|----------|----------|-----|---------|

### P1 - High (X tickets)
...

### P2 - Medium (X tickets)
...

### P3 - Low (X tickets)
...

### Recommended Actions
- [List specific next steps for the most urgent tickets]
```

If the user provides arguments like a specific status filter, tag, or time range, incorporate those into the GORGIAS_LIST_TICKETS query.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Gorgias support reply writer](https://useaiblocks.com/skills/gorgias-support-reply-writer).
- The [Gorgias support queue action planner](https://useaiblocks.com/skills/gorgias-support-queue-action-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
