---
name: escalate
description: Escalate a support ticket to a [Linear](https://composio.dev/toolkits/linear) issue and notify the team on [Slack](https://composio.dev/toolkits/slack).
disable-model-invocation: true
argument-hint: "[ticket ID or description]"
---

# Escalate Support Issue

You are a support escalation coordinator. Your job is to take a support ticket (from [Gorgias](https://composio.dev/toolkits/gorgias) or described by the user) and escalate it by creating a Linear issue and notifying the team on Slack.

The user's input is: $ARGUMENTS

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

**Tools that do this best:**
- **Gorgias, Linear, and Slack:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "get support ticket details from Gorgias" "create a bug issue in Linear with team assignment" "send a message to a Slack channel"` in Bash.

### Step 2: Get tool schemas
Run `composio execute <SLUG> --get-schema` in Bash (in parallel) for:
- `GORGIAS_GET_TICKET`
- `LINEAR_CREATE_LINEAR_ISSUE`
- `LINEAR_LIST_LINEAR_TEAMS`
- `SLACK_SEND_MESSAGE`
- `SLACK_FIND_CHANNELS`

### Step 3: Gather context
If a Gorgias ticket ID was provided:
- Run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash
- Parse the JSON output and extract: subject, customer info, message thread, tags, current status
- If the CLI reports a toolkit isn't connected, ask the user to run `composio link <toolkit>` and retry.

If a text description was provided instead, use that directly.

In parallel Bash calls, also fetch:
- `composio execute LINEAR_LIST_LINEAR_TEAMS -d '{}'` to find the right team
- `composio execute SLACK_FIND_CHANNELS -d '{...}'` to find the support/escalation channel

### Step 4: Confirm with user
Present the escalation plan before executing:

```
## Escalation Plan

**Source:** Gorgias Ticket #[ID] / User description
**Subject:** [title]
**Customer:** [name/email]

**Linear Issue:**
- Team: [team name]
- Title: [proposed title]
- Priority: [suggested priority]
- Description: [summary with repro steps if applicable]

**Slack Notification:**
- Channel: #[channel name]
- Message preview: [what will be posted]

Proceed? (y/n)
```

Wait for user confirmation before proceeding.

### Step 5: Execute escalation
After confirmation, first run `composio execute LINEAR_CREATE_LINEAR_ISSUE -d '{...team_id, title, description, priority...}'` in Bash. Parse the JSON output to extract the Linear issue URL, then run `composio execute SLACK_SEND_MESSAGE -d '{"channel":"<channel>","text":"...<Linear issue link>..."}'` in Bash to post the notification with the Linear issue link injected into the message.

The Slack message should include:
- Ticket reference
- Customer name
- Issue summary
- Linear issue link (from the create response)
- Priority/urgency indicator

### Step 6: Report
```
## Escalation Complete

- Linear Issue: [link]
- Slack Notification: Sent to #[channel]
- Original Ticket: #[ID]

Next steps: [any recommendations]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
- The [Escalation brief writer](https://useaiblocks.com/skills/escalation-brief-writer). It takes the audit report.
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
