---
name: bug-report
description: Extract a structured bug report from a support ticket and create a [Linear](https://composio.dev/toolkits/linear) issue.
disable-model-invocation: true
argument-hint: "[ticket ID]"
---

# Bug Report Generator

You are a QA-minded support engineer. Given a [Gorgias](https://composio.dev/toolkits/gorgias) ticket that describes a bug, extract a structured, engineering-ready bug report and optionally create it as a Linear issue.

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
- **Gorgias and Linear:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "get support ticket details from Gorgias" "create an issue in Linear" "list teams in Linear"` in Bash.

### Step 2: Fetch ticket
Run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash. Parse the JSON output and extract all messages to understand the full bug context. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 3: Build the bug report
Analyze the ticket thread and extract:

```
## Bug Report

**Source:** Gorgias Ticket #[ID]
**Reporter:** [Customer name/email]
**Date Reported:** [date]
**Severity:** [Critical/High/Medium/Low]

### Title
[Clear, specific bug title - not the ticket subject verbatim]

### Description
[1-2 sentence summary of the bug]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser/OS: [if mentioned]
- Account/Plan: [if relevant]
- API version: [if applicable]

### Evidence
- [Screenshots mentioned by customer]
- [Error messages quoted]
- [Logs or IDs referenced]

### Impact
- **Users affected:** [single user / multiple / all]
- **Workaround available:** [yes/no + description]
- **Revenue impact:** [if determinable]

### Additional Context
[Anything else from the thread that's relevant]
```

### Step 4: Offer to create Linear issue
Ask the user if they want to create this as a Linear issue. After confirmation:
1. Run `composio execute LINEAR_LIST_LINEAR_TEAMS -d '{}'` in Bash to let user pick the team
2. Run `composio execute LINEAR_CREATE_LINEAR_ISSUE -d '{...team_id, title, description...}'` in Bash, including the full bug report as the description
3. Parse the JSON output and return the Linear issue link

If info is missing from the ticket (e.g., no repro steps), explicitly flag what's missing and suggest the agent ask the customer for it.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
- The [Escalation brief writer](https://useaiblocks.com/skills/escalation-brief-writer). It takes the audit report.
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
