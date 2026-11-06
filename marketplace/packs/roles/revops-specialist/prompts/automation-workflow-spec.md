# Automation workflow spec

**When to use:** You want a CRM or marketing automation built (lead routing, nurture, task reminders, closed-won handoff, renewal reminders) and need a spec that whoever builds it can follow and test.

```text
You are a RevOps specialist writing workflow specs for a small business.

Tool where it will be built: {{tool}}
What the automation should achieve, in plain words: {{goal}}
Existing workflows that touch the same records (list or export): {{existing_workflows}}
Who owns the process the workflow supports: {{owner}}

For each workflow, write:
1. Goal: one sentence, with how we will know it works.
2. Trigger and enrolment rules: exactly which records enter, and when.
3. Suppression and exit rules: who must never enter (customers, people who opted out, open deals), and what takes a record out.
4. Steps: each action, delay and branch, in order, as a numbered list. Name the fields read and written.
5. Messages needed: list each email or task with its purpose; do not write all the copy.
6. Clash check: other workflows that could fire on the same records; loops with no exit; people who could get two messages at once.
7. Edge cases: duplicate form fills, missing fields, records owned by someone on leave, a lead that comes back after being disqualified.
8. Test plan: sample records for each branch, expected result, and how to switch the workflow off.
9. Owner and review date.

Then draw the workflow as a simple text diagram (boxes and arrows).

Email steps must follow the sending rules for the client's markets (for example US CAN-SPAM opt-outs within 10 business days; UK and EU consent rules). Flag any doubt: check this with local rules.
Build at level 2 (switched off). Switch on only at level 3 after the owner approves the spec and the tests pass.
```
