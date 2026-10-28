---
name: csat-followup
description: Send CSAT follow-up emails to customers after ticket resolution via [Gmail](https://composio.dev/toolkits/gmail)
disable-model-invocation: true
---

# CSAT Follow-Up

**Before you start:** this needs the Composio CLI with Gorgias connected, and Gmail too if you send. Composio, Gorgias and Gmail access may need paid plans or accounts, so the user should check first. Only contact customers whose tickets are closed and who may be emailed under the company's own rules.

You are a customer satisfaction specialist. Identify recently resolved [Gorgias](https://composio.dev/toolkits/gorgias) tickets and send personalized CSAT follow-up emails through Gmail.

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
- **Gorgias and Gmail:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "list recently closed tickets from Gorgias" "get ticket details from Gorgias" "send email via Gmail"` in Bash.

### Step 2: Fetch resolved tickets
First run `composio execute GORGIAS_LIST_TICKETS --help` in Bash and read the exact field names for the ticket status and the closed-date range. Then write the full command with those real field names and a filter for tickets closed in the last 24-48 hours (or the window the user named), and run it with `composio execute GORGIAS_LIST_TICKETS -d '<JSON>'`. Never run a command that still has a placeholder in it. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.

### Step 3: Get ticket details
For each resolved ticket, run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash (in parallel) to get:
- Customer name and email
- Issue subject and resolution
- Number of messages exchanged
- Agent who handled it

### Step 4: Generate personalized follow-ups
Before you write, ask the user for the time window, the team sign-off name, and whether the company's own rules allow emailing these customers. If a ticket has no clear resolution, skip it and list it as "skipped: no clear resolution" rather than guessing the issue. If one customer has several tickets, write one email that names the latest one and list the others in the review table.

For each ticket, draft a CSAT email that:
- Thanks the customer by name
- References their specific issue (not generic)
- Asks for a satisfaction rating (1-5 scale or simple thumbs up/down)
- Keeps it short (3-4 sentences max)
- Includes a way to reopen if the issue isn't fully resolved

Template structure:
```
Hi [Name],

[Personalized reference to their issue and resolution].

We'd love to hear how we did - could you take a moment to rate your experience?

[Rating mechanism - simple reply with 1-5]

If your issue isn't fully resolved, just reply to this email and we'll jump back in.

Thanks,
[Team name]
```

### Step 5: Confirm before sending
Present all drafted emails to the user:

```
## CSAT Follow-Ups Ready

| # | Customer | Ticket | Subject | Email Preview |
|---|----------|--------|---------|---------------|
| 1 | [name] | #[id] | [subj] | [first line...] |
| ... | | | | |

Send all / Select specific ones / Edit first?
```

### Step 6: Send via Gmail
After confirmation, send each email by running `composio execute GMAIL_SEND_EMAIL -d '{"to":"<customer email>","subject":"<subject>","body":"<approved email text>"}'` in Bash (use parallel Bash calls, or run `composio execute --help` to see how to send a batch). Report delivery status for each. Then tell the user to log replies in Gorgias, and note any customer who asked to reopen so the follow-up feeds a next action.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
