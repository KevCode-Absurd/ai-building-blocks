---
name: help-desk-build-sheet
description: Designs a help desk a team can run, as one build sheet - queues with named owners, a short tag list where each tag answers one question, routing rules in the order they run, views for agents, leads and managers, SLA policies, escalation paths, a triage guide for whoever sees a ticket first, and a tested change list. Works for Zendesk, Freshdesk, Intercom, Help Scout and Gorgias. Use it when a team moves off a shared inbox, when tickets get lost between people, or when routing and automations have grown messy. At level 3 it applies only the agreed change list, tested first and logged.
---

# Help desk build sheet

## When to use

- A team of three or more answers customers from one shared inbox and tickets get missed.
- The team is moving to a help desk (Zendesk, Freshdesk, Intercom, Help Scout, Gorgias) and needs it set up properly.
- An existing help desk has dozens of tags nobody uses, rules that fight each other, or queues with no owner.
- Tickets bounce between support, billing and engineering.

Not for: answering customers (see the `customer-support-specialist` kit) or designing a bot (see the `chatbot-specialist` kit).

## Access needed

- **Level 1 (read):** settings, groups, views, triggers, automations, SLA policies, tags and a ticket export.
- **Level 2 (read and draft):** build new rules switched off, or in a sandbox where the plan has one; draft views and SLA policies.
- **Level 3 (read, write and publish):** apply the agreed change list live, one change at a time, test each on a test ticket, and log it. Anything not on the list, deleting tickets or data, and changes to roles and permissions need a fresh yes.

## What you need

1. Channels, opening hours and team (names or roles, skills such as languages).
2. Ticket counts by hour and day for at least four weeks, by channel.
3. A ticket export with subject, tags, group, priority and first message, customer details removed.
4. The help desk and plan. Features differ by plan: in Zendesk, skills routing and custom queues need Professional, and SLA policies need Suite Growth or Support Professional (see `knowledge.md`, section 3).
5. Current promises to customers or clients (response times in contracts or on the website).
6. Who handles billing, technical faults, complaints and data requests today.

## Steps

### 1. Map today

List every group, view, trigger, automation, SLA policy and macro, with what it does and when it last fired. Mark rules that overlap, rules with no nullifying condition, and views nobody uses. In Zendesk, an automation without a nullifying condition can fire in a loop (see `knowledge.md`, section 3).

### 2. Find the contact reasons

Read 200 or more tickets (or the client's own categories). Group them into 8 to 15 reasons that cover most volume. Note the risky ones even if rare: safety, legal threats, data requests, payment errors, press.

### 3. Design queues and owners

One queue per kind of work that needs different people or different speed: general, billing, technical, complaints, VIP or B2B, and a data-request queue that only the owner sees. Each queue gets a named owner who watches its age, not just its size.

### 4. Design the tag list

Each tag answers one question: reason, product, or channel. Never combine two (no "refund-shoes"). Keep the list short enough to fit on one screen. If the help desk has AI classification, map its topics to your reasons rather than running two lists.

### 5. Write routing rules in order

Number them in the order they should run:
1. Safety, legal, data requests and press go to the owner's queue and are marked urgent.
2. Known VIP or B2B customers go to their queue.
3. Reason-based routing (billing, technical).
4. Language or skill routing.
5. Everything else to general.

Say what sets Priority. In Zendesk, a ticket with blank Priority gets no SLA (see `knowledge.md`, section 3), so triage must set it.

### 6. Set SLA policies

Draft policies from the target table (use the `service-levels-and-staffing` skill). Place the most restrictive policy first, because policies apply in order in Zendesk and Freshdesk.

### 7. Build views

- Agents: "my open tickets by SLA due", "unassigned in my queue".
- Leads: "breaching in the next hour", "pending over 3 days", "reopened".
- Manager: "oldest by queue", "unowned".

### 8. Write escalation paths

Levels by customer impact (safety or money, loss of access, problem with a workaround, question), who owns each, how fast, and when it moves up. Add a hand-off note template: customer, issue, steps tried, evidence, next step, so the customer never repeats their story.

### 9. Write the triage guide

One page for whoever sees a ticket first: check for risk words, set reason tag and priority, route, send the first reply or macro, escalate if a trigger applies.

### 10. Write the change list and test

One row per change: what, where, why, test ticket result, who approved, live date, how to undo. At level 2, build every change switched off or in the sandbox. At level 3, after the client approves the list, apply changes one at a time, send a test ticket through each, and watch the first hours of live tickets. Switch a rule off and report if it fires on far more tickets than tested.

### 11. Research the tool (both modes)

With web search connected, check the vendor's current help centre for each feature the design relies on and note the date. Without it, ask the client for screenshots of the admin pages and mark each feature "confirmed" or "to check".

## Checks

- Every queue and view has a named owner.
- Every tag answers one question; the list fits on one screen.
- Routing rules are numbered and do not contradict each other.
- Every rule uses a feature the plan has, or says it does not.
- Priority is always set before SLA policies apply.
- Data requests and legal threats never sit in a general queue.
- Every live change was on the agreed list, tested and logged; deletions and permission changes waited for a fresh yes.

## Output format

1. Summary: what changes and why, in five lines.
2. Today's map with problems marked.
3. Contact reasons with counts.
4. Queue table: queue, what lands there, owner, target.
5. Tag list.
6. Routing rules, numbered.
7. SLA policy drafts.
8. Views by role.
9. Escalation levels and hand-off template.
10. Triage guide (one page).
11. Change list with test results.
12. What to do on day one, in three steps.

## Example of good output (short)

*Made-up business for illustration: Fernhill Plants, an online plant shop with six support staff moving from Gmail to Freshdesk.*

> **Queue table**
>
> | Queue | What lands there | Owner | First reply target |
> |---|---|---|---|
> | Orders | Where is my order, address changes | Priya | 4 business hours |
> | Plant health | Dying plants, photos | Tom | 8 business hours |
> | Billing | Charges, refunds | Ana | 8 business hours |
> | Owner only | Legal, data requests, press | Ruth (owner) | Same day |
>
> **Routing rule 1:** if the subject or body contains "solicitor", "lawyer", "GDPR", "delete my data" or "journalist", route to Owner only, set priority Urgent.
>
> **Change list row:** Rule 1 | Freshdesk automation, ticket creation | keeps legal and data requests out of general | test ticket routed correctly 6 Nov | approved by Ruth | live 7 Nov | undo: deactivate rule.
