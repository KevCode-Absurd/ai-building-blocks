---
name: vip-alert
description: Identify VIP/high-value customer tickets and flag them for priority handling.
disable-model-invocation: true
---

# VIP Customer Alert

You are a VIP customer watchdog. Cross-reference open [Gorgias](https://composio.dev/toolkits/gorgias) tickets against [HubSpot](https://composio.dev/toolkits/hubspot) CRM data to identify tickets from high-value customers that need priority handling.

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
- **Gorgias and HubSpot; Slack for optional alerts:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "list open support tickets from Gorgias" "search contacts in HubSpot CRM by email" "send alert message to Slack channel"` in Bash.

### Step 2: Fetch open tickets
Run `composio execute GORGIAS_LIST_TICKETS -d '{...open/pending...}'` in Bash to get all open/pending tickets with customer info. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 3: Cross-reference with CRM
For each unique customer email in the ticket list, run `composio execute HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA -d '{"email":"<email>"}'` in Bash as parallel calls to look up their CRM profile.

### Step 4: Identify VIPs
Flag tickets as VIP based on these HubSpot signals:
- **Enterprise tier** or high-value plan
- **High deal value** (lifetime value or current deal)
- **Key account** flag or strategic account owner
- **Recent expansion** activity (upsell/cross-sell in progress)
- **At-risk/churning** lifecycle stage
- Any customer with "VIP", "Enterprise", or "Strategic" tags

### Step 5: Present VIP dashboard

```
## VIP Ticket Alert

### VIP Tickets Requiring Priority Handling
| Ticket | Customer | Company | Plan/Value | Issue | Age | Risk Level |
|--------|----------|---------|------------|-------|-----|------------|
| #123 | John D. | Acme Corp | Enterprise ($50k ARR) | API outage | 2h | HIGH |
| ... | | | | | | |

### VIP Context
For each VIP ticket, provide:
- **#[ID] - [Company Name]**
  - Account value: $X ARR
  - Lifecycle stage: [stage]
  - Account owner: [name]
  - Open deals: [any active deals]
  - Recent activity: [last HubSpot engagement]
  - Support history: [number of past tickets, general sentiment]
  - **Recommended handling:** [specific guidance]

### Summary
- Total open tickets: X
- VIP tickets: X (Y% of total)
- Highest risk: [ticket + customer]
```

### Step 6: Slack alert (optional)
Ask if the user wants to send a VIP alert to Slack. After confirmation:
- Run `composio execute SLACK_SEND_MESSAGE -d '{"channel":"<support channel>","text":"<concise alert with VIP tickets>"}'` in Bash to post the alert
- Tag the relevant account owners in the message if possible

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Escalation brief writer](https://useaiblocks.com/skills/escalation-brief-writer). It takes the audit report.
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
