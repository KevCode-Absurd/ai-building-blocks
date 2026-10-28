---
name: customer-360
description: Full customer lookup across [Gorgias](https://composio.dev/toolkits/gorgias) tickets and [HubSpot](https://composio.dev/toolkits/hubspot) CRM.
disable-model-invocation: true
argument-hint: "[customer email or name]"
---

# Customer 360 View

You are a customer intelligence specialist. Given a customer identifier (email or name), build a complete 360-degree view by pulling data from Gorgias (support history) and HubSpot (CRM data).

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
- **Gorgias and HubSpot:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "search for customer support tickets by customer email in Gorgias" "search for contact by email or name in HubSpot CRM and get contact history"` in Bash.

### Step 2: Get tool schemas
Run `composio execute <SLUG> --get-schema` in Bash (in parallel) for each of these slugs:
- `GORGIAS_LIST_TICKETS`
- `GORGIAS_GET_TICKET`
- `HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA`
- `HUBSPOT_READ_CONTACT`
- `HUBSPOT_SEARCH_CRM_OBJECTS_BY_CRITERIA`

### Step 3: Search in parallel
Run these in parallel (either as parallel Bash calls, or via `composio execute --parallel GORGIAS_LIST_TICKETS -d '{...}' HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA -d '{...}'`):
1. `GORGIAS_LIST_TICKETS` — filter by customer email/name
2. `HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA` — search by the customer identifier

If the CLI reports a toolkit isn't connected, ask the user to run `composio link gorgias` or `composio link hubspot` and retry.

### Step 4: Deep dive
Parse the JSON output from Step 3 and based on results:
- For Gorgias: Run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in parallel Bash calls for the most recent 5 tickets
- For HubSpot: Use the contact_id to fetch engagement history with `composio execute HUBSPOT_SEARCH_CRM_OBJECTS_BY_CRITERIA -d '<JSON>'`, once each for notes, emails and calls. Build the JSON from the schema you fetched in Step 2: set the object type (notes, emails or calls) and filter on records associated with that contact ID. If the schema has no way to filter by contact, say so and show only the profile from `HUBSPOT_READ_CONTACT`.

### Step 5: Present the 360 View

```
## Customer 360: [Name] ([Email])

### Profile (HubSpot)
- **Company:** ...
- **Title:** ...
- **Lifecycle Stage:** ...
- **Owner:** ...
- **Created:** ...
- **Last Activity:** ...
- **Custom Properties:** [any relevant ones]

### Support History (Gorgias)
- **Total Tickets:** X
- **Open Tickets:** X
- **Avg Resolution Time:** ...
- **Last Contact:** ...

#### Recent Tickets
| # | ID | Subject | Status | Priority | Created | Last Update |
|---|-----|---------|--------|----------|---------|-------------|

### Engagement Timeline (HubSpot)
| Date | Type | Summary |
|------|------|---------|

### Customer Health Score
_Your estimate from the tickets and contacts listed above. Check it before acting on it._
- Sentiment: [Positive/Neutral/Negative based on recent tickets]
- Engagement: [Active/Moderate/Low based on interaction frequency]
- Risk: [Low/Medium/High based on open issues and sentiment]

### Recommended Actions
- [Specific suggestions based on the data]
```

If the customer is not found in one system, note it and show data from whichever system has results.

End with one next step: for example, copy the brief into the CRM record, or draft a reply for the user to approve before anything is sent. Never send a reply or change a record yourself.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
- The [Escalation brief writer](https://useaiblocks.com/skills/escalation-brief-writer). It takes the audit report.
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
