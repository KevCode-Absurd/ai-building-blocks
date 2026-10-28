---
name: ticket-triage
description: Classify, prioritize, and route incoming support tickets by extracting intent and entities, assigning severity, and generating initial responses. Use when the user requests ticket triage or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# Ticket Triage

Automatically classify, prioritize, and route incoming customer support tickets to the right team with a suggested first response. This skill processes raw ticket text, identifies the customer's intent and key entities (product area, account tier, error codes), assigns a category and priority level, then routes to the appropriate team while drafting an empathetic initial reply.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for customer words. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Receive and parse the ticket** — Ingest the raw ticket including subject, body, customer metadata (account tier, plan, tenure), and any attachments or screenshots. Normalize the text by stripping signatures, quoted replies, and boilerplate. Extract structured fields like order IDs, error codes, and URLs.

2. **Extract intent and entities** — Analyze the cleaned ticket text to determine the customer's primary intent (reporting a bug, asking a question, requesting a feature, disputing a charge). Identify named entities such as product names, feature areas, API endpoints, and specific error messages. Tag sentiment as positive, neutral, negative, or urgent.

3. **Classify into category** — Map the extracted intent to one of the standard categories: `billing` (charges, invoices, refunds, plan changes), `bug` (errors, crashes, unexpected behavior), `feature-request` (new functionality, integrations, enhancements), or `how-to` (setup, configuration, usage questions). If a ticket spans multiple categories, assign the primary and note secondaries.

4. **Assign priority using impact and urgency** — Score priority from P0 to P3 using a matrix. P0: production outage or data loss affecting multiple customers. P1: major functionality broken for a single enterprise account. P2: degraded experience with a workaround available. P3: general questions or minor cosmetic issues. Factor in account tier — enterprise accounts get a one-level priority bump.

5. **Route to the appropriate team** — Map the category and priority to a team: billing tickets go to the Finance Support queue, bugs route to Engineering Triage (P0/P1) or Product Support (P2/P3), feature requests go to Product Management, and how-to tickets go to Customer Education. Attach relevant context and internal notes.

6. **Generate initial response** — Draft a first reply that acknowledges the issue, sets expectations on response time based on priority, includes any immediate self-serve resources (KB articles, status page links), and asks clarifying questions if the ticket is ambiguous. Match tone to sentiment — empathetic for frustrated customers, concise for technical users.

## Usage

Provide a support ticket (or batch of tickets) and ask the agent to triage them. Include customer metadata when available for better priority assignment.

```
Triage these support tickets and output a classification table with category,
priority, assigned team, and a draft first response for each.
```

## Examples

### Example 1: Batch triage of 5 tickets

The replies in these examples show the shape only. Every time, refund period and link in them is a placeholder. Write your own, for example [your reply time] and [your refund policy], and never send them unchanged.

**Input:** 5 support tickets from the past hour.

**Output:**

| # | Subject | Category | Priority | Team | Suggested Response |
|---|---------|----------|----------|------|--------------------|
| 1 | "Can't login since this morning" | bug | P1 | Engineering Triage | "Hi Sarah, I'm sorry you're locked out. I've escalated this to our engineering team and they're investigating now. As a workaround, try clearing your browser cache or using an incognito window. We'll update you within [YOUR REPLY TIME]." |
| 2 | "How do I export data to CSV?" | how-to | P3 | Customer Education | "Hi James, great question! You can export to CSV from [MENU PATH IN YOUR PRODUCT]. Here's our step-by-step guide: [link]. Let me know if you hit any snags." |
| 3 | "Charged twice for March" | billing | P2 | Finance Support | "Hi Priya, I apologize for the duplicate charge. I've flagged your account for review and our billing team will review it under [YOUR REFUND POLICY]. You'll receive a confirmation email." |
| 4 | "Would love Slack integration" | feature-request | P3 | Product Management | "Hi Tom, thanks for the suggestion! A Slack integration is something we're hearing a lot about. I've added your vote to our feature tracker and will notify you if it moves to our roadmap." |
| 5 | "Dashboard is down for our entire org" | bug | P0 | Engineering Triage | "Hi Alex, this is our top priority right now. Our on-call engineering team has been paged and is actively investigating. Check [YOUR STATUS PAGE] for live updates. I'll follow up within [YOUR UPDATE INTERVAL] with a status." |

### Example 2: Urgent production outage escalation

**Input:** "URGENT: All API requests returning 500 errors since 14:32 UTC. Affecting our production environment. 50,000+ end users impacted. Enterprise plan."

**Output:**

- **Category:** bug
- **Priority:** P0 (production outage, multiple end users, enterprise account)
- **Team:** Engineering Triage → Immediate page to on-call SRE
- **Escalation path:** Auto-notify VP Engineering, assigned CSM, and account executive
- **SLA clock:** [YOUR FIRST RESPONSE TIME] first response, [YOUR UPDATE INTERVAL] status update cadence
- **Draft response:** "Hi — this is marked as our highest priority. Our SRE team has been paged and is investigating the 500 errors starting at 14:32 UTC. We'll provide our first status update within [YOUR FIRST RESPONSE TIME]. For real-time updates, monitor [YOUR STATUS PAGE]. I'm your point of contact until this is resolved."

## Best Practices

- Always extract customer account tier before assigning priority — enterprise customers with production impact should never be lower than P1.
- Use the secondary category tag for tickets that span billing and bug (e.g., "I was charged for a feature that doesn't work") to ensure both teams have visibility.
- Pre-populate the initial response with relevant KB article links by matching extracted entities against your knowledge base index.
- Re-triage tickets that receive a customer reply within 1 hour, as additional context often changes the category or priority.
- Log triage decisions with reasoning so the model can be fine-tuned on corrections from human reviewers.
- Set up auto-escalation rules: any P0 not acknowledged within [YOUR ESCALATION TIME] should page the on-call manager.

## Edge Cases

- **Legal threats and security reports** — Do not triage these or draft a reply. Send them straight to a named person (legal contact or security lead) and tell the user why.
- **Multi-intent tickets** — A single ticket contains both a bug report and a billing dispute. Classify under the higher-priority intent and create a linked ticket for the secondary issue.
- **Spam or vendor outreach** — Tickets that are marketing emails or vendor pitches routed through support. Classify as `spam`, flag it for a person to review (never auto-close, in case a real customer message was misread as spam), and exclude it from SLA metrics.
- **Non-English tickets** — Detect the language, translate for triage, and route to the appropriate language-specific support queue if one exists. Note the original language in internal metadata.
- **Repeat tickets from the same customer** — Detect duplicate or follow-up tickets within a 24-hour window. Merge into the existing thread rather than creating a new triage entry.
- **Tickets with only attachments** — When the body is empty but a screenshot or log file is attached, flag for manual review rather than auto-classifying with low confidence.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support inbox priority sorter](https://useaiblocks.com/skills/support-inbox-priority-sorter).
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
