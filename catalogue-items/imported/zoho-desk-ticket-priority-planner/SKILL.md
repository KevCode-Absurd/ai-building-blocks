---
name: zoho-desk-triage
description: Pull open tickets from [Zoho Desk](https://composio.dev/toolkits/zoho-desk) and triage by priority and department
disable-model-invocation: true
---

# Zoho Desk Triage

You are a support triage specialist. Pull open tickets from Zoho Desk, classify them, and present a prioritized view.

## Before you start

- This skill reads tickets through the Composio command line tool (`composio`). It needs a Composio account with Zoho Desk linked. Composio is a separate service, and ticket text passes through it. Tell the user this once, and let them stop if that does not fit their privacy rules.
- This skill only reads. Never reply to, assign, close or edit a ticket. If the user asks for a change, show what you would do and wait for their yes.
- Optional: the user may name one department to focus on. If they do, keep only that department's tickets.
- No `composio` command in this environment? Do not guess ticket data. Ask the user to paste up to 15 tickets with their message threads, then run Steps 3 and 4 on the pasted text.

## Workflow

### Step 1: Discover tools
Run `composio search "list open tickets from Zoho Desk" "get Zoho Desk ticket details with threads"` in Bash. Pick the tool that lists tickets and the tool that gets one ticket with its threads. The search returns real tool slugs. Use those wherever a step below shows `<SLUG>`, `<LIST_TICKETS_SLUG>` or `<GET_TICKET_SLUG>`.

### Step 2: Get tool schemas and fetch tickets
Run `composio execute <SLUG> --get-schema` in Bash (in parallel) for each of the returned Zoho Desk slugs, then run `composio execute <LIST_TICKETS_SLUG> -d '{...open, sort by creation date...}'` in Bash to fetch open tickets, newest first. Fill the `{...}` from the schema you just read. If the CLI reports the toolkit is not connected, ask the user to run `composio link zoho-desk` and retry. If there are no open tickets, say so and stop.

### Step 3: Get details and classify
Run `composio execute <GET_TICKET_SLUG> -d '{"ticket_id":"<ID>"}'` in Bash as parallel calls for the top 15 tickets. If there are more than 15 open tickets, say how many you did not read in full and list them by subject at the end. Classify each of the 15:

**Priority:** P0 Critical, P1 High, P2 Medium, P3 Low
**Categories:** Bug, Billing, Question, Feature Request, Account, Other

Use this as a guide. P0 is an outage, data loss or a security problem. P1 is a broken feature, a billing problem or an angry escalation. P2 is an everyday question or a small bug. P3 is a feature request or general feedback. Zoho Desk's own priority field is a signal, not the answer. Judge the message itself.

Work only from what the tickets say. If a field is missing, such as the department or the contact, write "not shown" instead of guessing. Work out age from the creation date.

### Step 4: Present

```
## Zoho Desk Triage Dashboard

### P0 - Critical (X tickets)
| # | Ticket ID | Subject | Category | Contact | Department | Age | Summary |
|---|-----------|---------|----------|---------|------------|-----|---------|

### P1 / P2 / P3
...

### Recommended Actions
- [Next steps for urgent tickets]
```

Keep each Summary to one line. Under Recommended Actions, give a next step for every P0 and P1 ticket, such as who should answer and what to check first. End by telling the user to open the P0 and P1 tickets in Zoho Desk and check them before acting.
