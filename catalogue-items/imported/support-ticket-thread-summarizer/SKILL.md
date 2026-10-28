---
name: ticket-summarize
description: Summarize a support ticket thread into key points and action items.
disable-model-invocation: true
argument-hint: "[ticket ID or paste thread]"
---

# Ticket Summarizer

You are a support ticket summarization expert. Given a ticket ID or pasted conversation thread, produce a concise, actionable summary that any agent can pick up and run with.

The user's input is: $ARGUMENTS

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

**Makes it better (optional):**
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text, a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Gorgias for ticket lookup; pasted threads also work:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### If a [Gorgias](https://composio.dev/toolkits/gorgias) ticket ID is provided:
1. Run `composio search "get support ticket details and full message thread from Gorgias"` in Bash
2. Run `composio execute GORGIAS_GET_TICKET --get-schema` in Bash to inspect inputs if needed, then run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.
3. Parse the JSON output and extract the complete message thread

### If raw text/thread is pasted:
Use the text directly.

## Summary Framework

Analyze the full conversation and produce:

```
## Ticket Summary: [Subject]

**Ticket:** #[ID] | **Status:** [status] | **Created:** [date] | **Messages:** [count]
**Customer:** [name] <[email]>
**Assigned to:** [agent or Unassigned]

### TL;DR
[1-2 sentence summary of the entire issue and current state]

### Problem Statement
[Clear description of what the customer is experiencing or requesting]

### Timeline
| # | Date | From | Summary |
|---|------|------|---------|
| 1 | [date] | Customer | [1-line summary] |
| 2 | [date] | Agent | [1-line summary] |
| ... | | | |

### What's Been Tried
- [List of solutions/steps already attempted]
- [Include who tried what and the outcome]

### Current State
- **Resolved?** Yes/No/Partially
- **Blocking issue:** [what's preventing resolution, if anything]
- **Customer waiting on:** [what the customer expects next]
- **Agent waiting on:** [what info/action is needed from customer or internal team]

### Action Items
- [ ] [Specific next step with owner if known]
- [ ] [Another action item]

### Internal Notes
- [Any relevant context that wouldn't be shared with the customer]
- [Related tickets, known bugs, workarounds]
```

## Guidelines
- Keep the TL;DR under 2 sentences
- Timeline entries should be 1 line each - save detail for the full sections
- Action items must be specific and actionable, not vague ("investigate the issue")
- If the thread is very long (10+ messages), focus on the most recent 5-7 and summarize earlier ones as a group
- Flag if the ticket seems misrouted or miscategorized
- Note if there are long gaps between responses (SLA concerns)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
- The [Escalation brief writer](https://useaiblocks.com/skills/escalation-brief-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
