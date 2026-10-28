---
name: weekly-digest
description: Generate a weekly support digest and post it to [Slack](https://composio.dev/toolkits/slack)
disable-model-invocation: true
---

# Weekly Support Digest

You are a support reporting analyst. Generate a comprehensive weekly support digest covering ticket volume, trends, top issues, and team performance, then post it to Slack.

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
- **Gorgias; Slack for optional sharing:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "list support tickets from Gorgias filtered by date range" "get ticket details from Gorgias" "send a formatted message to Slack channel"` in Bash.

### Step 2: Fetch the week's data
Run `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'` in Bash, with the date range set to the past 7 days (or the week the user named), using the argument names from the schema (get it first with `composio execute GORGIAS_LIST_TICKETS --get-schema`) to pull all tickets from the past 7 days. Paginate to get the complete set. Then run the same call once more for the 7 days before that, so you can compare the two weeks. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 3: Enrich key tickets
For a representative sample (up to 25 tickets), run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash as parallel calls to get response time data and message details.

### Step 4: Compile the digest

```
## Weekly Support Digest
**Week of:** [Monday date] - [Sunday date]

### At a Glance
- New tickets: X (+/-Y% vs last week, worked out from the previous week's pull in Step 2; if that pull failed or is empty, leave the comparison out and say so)
- Resolved: X
- Still open: X
- Avg first response: Xh (from a sample of up to 25 tickets)
- Avg resolution time: Xh (from a sample of up to 25 tickets)
- Sample note: ticket counts cover the whole week; the averages come from the sample only. Say how many tickets the sample held.
- CSAT: X% (if available)

### Top Issues This Week
1. [Issue category] - X tickets - [brief description of trend]
2. [Issue category] - X tickets
3. [Issue category] - X tickets

### Notable Tickets
- **Biggest fire:** #[ID] - [what happened and how it was resolved]
- **Longest open:** #[ID] - [status and why]
- **Best resolution:** #[ID] - [quick/creative resolution worth highlighting]

### Trends
- [Any emerging patterns]
- [Issues that are growing/shrinking]
- [Product areas generating the most tickets]

### Recommendations
- [Process improvements]
- [Product fixes that would reduce ticket volume]
- [Knowledge base articles to create/update]
```

### Step 5: Confirm and post to Slack
Show the digest to the user for review. Before posting, strip customer names, email addresses, order details and any other personal data from the ticket excerpts, and show the user the cleaned version. After confirmation:
1. Run `composio execute SLACK_FIND_CHANNELS -d '<JSON>'` in Bash (ask the user which channel, and read the argument names from `composio execute SLACK_FIND_CHANNELS --get-schema` first, because they can change) to find the target Slack channel, parse the JSON output for the channel ID
2. Format the digest as a Slack message (use markdown_text for formatting)
3. Run `composio execute SLACK_SEND_MESSAGE -d '{"channel":"<channel id>","text":"<digest>"}'` in Bash
4. Parse the JSON output and confirm with the posted message link

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Gorgias support metrics reporter](https://useaiblocks.com/skills/gorgias-support-metrics-report).
- The [Gorgias ticket priority planner](https://useaiblocks.com/skills/gorgias-ticket-priority-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
