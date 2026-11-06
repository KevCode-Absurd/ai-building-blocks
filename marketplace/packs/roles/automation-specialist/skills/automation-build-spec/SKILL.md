---
name: automation-build-spec
description: Turns a repeat task into a build spec for one automation in Zapier, Make, n8n or Power Automate - the process as done today, trigger, steps, a field map, filters, a dedupe key, error paths with alerts to a named person, human approval for risky steps, a test plan, a monthly usage estimate against plan limits, switch-off and rollback steps - then builds it switched off (access level 2) and turns it on only at level 3 after the client confirms the action list. Use it for form-to-CRM, order-to-sheet, invoice and onboarding routines.
---

# Automation build spec

## When to use

- A team copies data between tools by hand every day or week.
- A new tool arrives and needs to talk to the others.
- An existing automation was built in a hurry and needs a proper design before it is rebuilt.

Not for: messages to people who have not agreed to them, or moving money without a person approving.

## What you need

1. What starts the task, what "done" looks like, who does it now, how often, and what goes wrong today.
2. The apps involved and the plan each is on (Free or paid matters for polling speed, code steps, webhooks and limits).
3. Field names in each app, and five to ten sample records with made-up values, including one messy one.
4. Who should hear when something fails, and who approves risky steps.
5. Access: which level the client grants for each app. Level 1 (read) is enough for the spec. Building in the tool needs level 2. Switching it on needs level 3 and a yes on the action list.

## Steps

### 1. Write the process as it is today

Number each step with the app, the person and the fields touched. Mark each step as a rule, a judgement, or touching money, deletion, customers or legal notices. Remove steps that add nothing before automating anything.

### 2. Choose the trigger

Instant (webhook) or polling. On polling triggers, say how long the delay can be on the client's plan; on Zapier Free it is up to 15 minutes. If the source can send webhooks, prefer them, and plan to check what arrives.

### 3. Lay out the steps

Trigger, filters, each action with app and action name, branches (paths or routers), and where a person approves. Built-in steps first; a code step only to reshape data or reach an app with no connector.

### 4. Write the field map

| Source field | Target field | Change | If blank |
|---|---|---|---|
Cover every target field: formats for dates, phone numbers, currency and names; defaults for blanks; what stops the run.

### 5. Stop doubles

Pick the dedupe key (order number, email plus date, the source's event ID). Before any "create" step, add a "find" step on the key; update if found, create if not. For webhooks, store processed event IDs.

### 6. Plan for failure

- An error path on every step that can fail, ending in an alert to a named person with the record and the error.
- In Zapier, error handlers send no error email, so the handler must send the alert. In Make, add a Retry handler and turn on incomplete executions where a lost run matters. In n8n, set an error workflow with the Error Trigger node. In Power Automate, use "configure run after" paths and keep the 30-day run limit in mind for approvals.
- A stop when data looks wrong (missing key field, amount far outside the usual range), rather than carrying on.
- A log: date, record, action, result.

### 7. Add human approval where needed

Refunds, deletions, customer-facing messages, legal notices and anything over an amount the client sets go through an approval step (Zapier Request Approval, Power Automate Approvals, n8n human review, or a Slack or email approval) with a timeout and what happens on timeout.

### 8. Estimate usage

Runs per month × steps that count on that platform (Zapier tasks, Make credits, n8n executions, Airtable automation runs). Compare with the plan. Mark any limit you could not see as "to confirm".

### 9. Write the test plan

At least: a normal record, a missing field, a duplicate, an app that is down, and the largest realistic record. Expected result for each.

### 10. Build it switched off (level 2)

Build in the client's tool with the trigger off or the scenario inactive. Run the tests with sample data. Record results in the test table.

### 11. Go live (level 3)

Show the client the action list and limits (which apps and accounts, which actions, how many runs or messages, who can be contacted, for how long) and get a yes. Run alongside the manual process for an agreed period, then switch the manual process off. Log the go-live.

## Checks

- Every app, field and limit comes from the brief or is marked to confirm.
- Every create step has a dedupe check.
- Every failure ends in an alert to a named person.
- Risky steps have human approval.
- No passwords or keys in any step; connections use the tool's own credential store.
- Usage is inside the plan.
- The access level needed for each step is stated; nothing goes live without the client's yes.

## Output format

1. **Process today** and what changes.
2. **Flow:** trigger, steps, branches, approvals.
3. **Field map** table.
4. **Dedupe and failure handling.**
5. **Usage estimate.**
6. **Test plan** with expected results.
7. **Go-live, switch-off and rollback**, with the access level each step needs.

## Example of good output (short)

*Made-up business: Pinewood Physio, web enquiries to HubSpot and Slack, Zapier Professional.*

> **Trigger.** New Typeform response (instant). **Steps.** 1. Formatter: phone to E.164; blank becomes "none". 2. HubSpot: find contact by email. 3. Path A (found): update contact, add note. Path B (not found): create contact. 4. Slack: post to #enquiries. 5. Google Sheets: add log row.
>
> **Dedupe.** Email, lower case and trimmed; the find step runs before create.
>
> **Failure.** Error handler on steps 2 to 4 posts the response ID and error to #ops-alerts and emails Dana (practice manager), because Zapier sends no error email when a handler runs.
>
> **Usage.** About 220 enquiries a month × 4 counting steps ≈ 880 tasks; confirm against the plan.
>
> **Tests.** Normal; blank phone; same email twice in a minute; HubSpot down (handler alert fires); 2,000-character message.
>
> **Go-live (level 3).** Action list: create or update HubSpot contacts, post to two Slack channels, append to one sheet; no emails to patients. Run alongside the manual inbox check for two weeks.
