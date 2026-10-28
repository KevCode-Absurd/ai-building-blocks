---
name: sla-monitor
description: Check SLA compliance across open tickets and flag breaches or at-risk tickets
disable-model-invocation: true
---

# SLA Monitor

**Before you start:** this needs the Composio CLI and a Gorgias account linked through it. Composio may charge for use, so the user should check its pricing before the first run.

You are an SLA compliance monitor. Check all open [Gorgias](https://composio.dev/toolkits/gorgias) tickets against SLA targets, flag breaches, and identify tickets at risk of breaching.

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
Run `composio search "list open support tickets from Gorgias with timestamps" "get ticket details with message timestamps from Gorgias"` in Bash. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 2: Define SLA targets
Use these defaults (or ask the user for their SLA targets):
- **First Response Time:** 1 hour (P0), 4 hours (P1), 8 hours (P2), 24 hours (P3)
- **Resolution Time:** 4 hours (P0), 24 hours (P1), 48 hours (P2), 72 hours (P3)
- **Next Reply Time:** 2 hours after customer responds

### Step 3: Fetch open tickets
Run `composio execute GORGIAS_LIST_TICKETS --get-schema` first. Build the `-d` JSON from that schema so it asks only for open and pending tickets, using the status values the schema lists. If the schema has no status filter, fetch all tickets and keep only open and pending ones. Then run `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'` in Bash. Repeat the call with the next cursor or page value the response gives until no results remain, and say how many tickets you fetched.

### Step 4: Compute SLA status
For each ticket, run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash (in parallel) to get message timestamps:
- Calculate time since ticket creation
- Calculate time since last customer message
- Determine if first response was sent and when
- Check if resolution time is approaching its limit, meaning over 75% of the resolution target has passed (AT RISK)

Use the Next Reply Time target too: if the customer's last message has gone unanswered longer than the target, count the ticket as BREACHED, and as AT RISK once 75% of that target has passed.

Classify each ticket:
- **BREACHED** - SLA target exceeded
- **AT RISK** - Over 75% of SLA target elapsed
- **ON TRACK** - Within SLA limits
- **MET** - First response, and resolution if the ticket is closed, both happened within the target

Compute the health score as the average of the First Response and Resolution percentages met. Show how you got it.

### Step 5: Present SLA dashboard

```
## SLA Dashboard
**As of:** [current timestamp]

### BREACHED (X tickets) - Immediate action required
| Ticket | Subject | Customer | SLA Target | Elapsed | Breach By |
|--------|---------|----------|------------|---------|-----------|

### AT RISK (X tickets) - Action needed soon
| Ticket | Subject | Customer | SLA Target | Elapsed | Time Left |
|--------|---------|----------|------------|---------|-----------|

### ON TRACK (X tickets)
| Ticket | Subject | SLA Target | Elapsed | Remaining |
|--------|---------|------------|---------|-----------|

### SLA Health Score: [X/100]
- First Response SLA: X% met
- Resolution SLA: X% met
- Average response time: Xh Xm

### Recommendations
- [Specific actions for breached tickets]
- [Agents who should be pinged: the assigned agent first; the team lead if the ticket is unassigned. Start with breached P0 and P1 tickets.]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
- The [Escalation brief writer](https://useaiblocks.com/skills/escalation-brief-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
