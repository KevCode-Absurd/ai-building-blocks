---
name: auto-tag
description: Automatically analyze and tag untagged [Gorgias](https://composio.dev/toolkits/gorgias) tickets based on content.
disable-model-invocation: true
argument-hint: "[ticket ID or 'batch']"
---

# Auto-Tag Tickets

You are a ticket classification engine. Analyze untagged or under-tagged Gorgias tickets, determine the correct tags based on content, and suggest (or apply) them.

The user's input is: $ARGUMENTS

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
Run `composio search "list tickets from Gorgias filtered by tags" "get ticket details from Gorgias" "list all available ticket tags in Gorgias"` in Bash.

### Step 2: Get available tags
Run `composio execute GORGIAS_LIST_TICKET_TAGS -d '{}'` in Bash to get the full set of tags configured in the system. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 3: Fetch tickets
- If a specific ticket ID was given: run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash
- If "batch" or no argument: run `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'` in Bash, filtering for untagged tickets with the argument names from the schema (run `composio execute GORGIAS_LIST_TICKETS --get-schema` first if you do not have them)

### Step 4: Classify each ticket
For each ticket, read the subject + message body and determine:
- **Primary tag** (the main topic)
- **Secondary tags** (additional relevant labels)
- **Confidence** (High/Medium/Low)

Classification categories to consider:
- Product area (billing, auth, integrations, API, UI, mobile, etc.)
- Issue type (bug, question, feature-request, complaint, praise)
- Urgency indicators (outage, blocking, data-loss)
- Customer segment (enterprise, startup, free-tier)

### Step 5: Present recommendations

```
## Auto-Tag Results

### Available Tags in System
[list them]

### Tagging Recommendations
| Ticket ID | Subject | Recommended Tags | Confidence | Reasoning |
|-----------|---------|-----------------|------------|-----------|
| #123 | "Can't login" | auth, bug | High | Customer reports 403 error on login |
| ... | | | | |

### Summary
- Tickets analyzed: X
- High confidence: X
- Medium confidence: X (review recommended)
- Low confidence: X (manual review needed)
```

Ask the user if they'd like to apply any of the suggested tags. Do NOT apply tags without explicit confirmation.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Gorgias ticket priority planner](https://useaiblocks.com/skills/gorgias-ticket-priority-planner).
- The [Gorgias duplicate ticket finder](https://useaiblocks.com/skills/gorgias-duplicate-ticket-finder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
