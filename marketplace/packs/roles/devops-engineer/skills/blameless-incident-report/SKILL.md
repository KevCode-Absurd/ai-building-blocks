---
name: blameless-incident-report
description: Turns an outage or near miss into a blameless incident report from chat exports, alerts, deploy logs and notes - a timeline with exact 24-hour times and a source for each entry, guesses marked, impact in numbers, contributing causes in process and design (never a person), what went well, what went badly and where we got lucky, a short action list with owners and dates - plus an honest customer update and a runbook for next time. Flags reporting rules (SEC Item 1.05, NIS2, UK NIS, GDPR) for the client's legal lead without giving legal advice. Drafts at access level 2; publishing a status update or customer notice needs level 3 and the client's yes. Use it after any incident that met the client's postmortem triggers.
---

# Blameless incident report

## When to use

- After an outage, data loss, a rollback, a security scare or a long slowdown.
- After a near miss that could have been bad.
- When customers need an honest update about what happened.
- When the same kind of incident keeps coming back and the runbook needs fixing.

This skill is for writing up after the fact. During a live incident, the client's own responders run it; I can keep the timeline and draft updates if asked.

## What you need

1. Start and end times, and the time zone.
2. Raw material: chat exports, alert history, deploy and change logs, monitoring graphs, support tickets, notes. Personal data removed.
3. Who was affected and how (users, orders, regions), with numbers if known.
4. The current runbook or procedure, if one exists.
5. Who the report is for (team, leadership, customers, a regulator via the client's legal lead).
6. Access: level 1 to read. Level 2 to draft the report and updates in the client's tools. Publishing a status update needs level 3 and the client's yes.

## Steps

### 1. Collect before concluding

Gather every source first. Ask for missing start and end times. Don't look for causes yet.

### 2. Build the timeline

A table in order, with exact times in 24-hour format and one time zone, what happened, who noticed or acted (by role), and the source for each entry. Mark guesses as guesses. Mark gaps as unknown instead of filling them.

Include: the first trigger, the first signal (alert, customer, staff), when it was declared an incident, each action tried and its result, mitigation, full recovery, and the all-clear.

### 3. State the impact

Who and how many were affected, for how long, what they could not do, data lost or delayed, money or orders affected if known. Numbers with their source; ranges if unsure.

### 4. Find contributing causes

Ask "why" repeatedly from the trigger, and from the detection delay and the recovery time too. Look for causes in process, design, tooling and information: a missing check, an alert nobody saw, a step that relied on memory, a config change pushed everywhere at once. If the answer is "a person made a mistake", ask what let that mistake reach production. Never name a person as the cause.

### 5. Record what went well, what went badly, and where we got lucky

Luck is a finding: "the database survived because the bad deploy hit at 03:00" means the protection is missing.

### 6. Write the actions

A short list. Each action: what, owner (a role or named owner the client chooses), due date, and how we will know it worked. Prefer actions that change the system (a check, an alert, a staged rollout, a kill switch) over "be more careful". A few strong actions beat a long list of weak ones.

### 7. Flag reporting rules

Without giving legal advice, flag what the client's legal or data protection lead should look at: US public companies disclose material cybersecurity incidents on Form 8-K Item 1.05 (generally within four business days of deciding an incident is material); entities in NIS2 sectors in the EU, and UK services under the NIS Regulations, have incident-notification duties; personal data breaches have GDPR or UK GDPR rules. The client's lead decides.

### 8. Write the customer update

Plain words: what happened, who was affected, what we did, what happens next, and what customers need to do, if anything. No jargon, no excuses, no promises we can't keep. "It won't happen again" is out; say what changed.

### 9. Write or fix the runbook

Symptoms, first checks, fixes in order, when to escalate and to whom, how to roll back, and how to tell customers. Test it in a calm moment.

### 10. Review and share

The report is reviewed by someone senior who was not in the incident, then shared where the team can find it. Google's SRE guidance treats an unreviewed postmortem as worthless.

## Checks

- Every timeline entry has an exact time and a source; guesses and gaps are marked.
- No person is named or implied as the cause; "human error" is not a root cause.
- Impact is in numbers with sources, or marked unknown.
- Every action has an owner, a date and a "how we'll know".
- The customer update matches the facts in the report.
- Reporting rules are flagged for the client's legal lead, not decided.

## Output format

1. Summary (five lines: what, when, impact, cause, status).
2. Timeline table.
3. Impact.
4. Contributing causes (why chain).
5. What went well, what went badly, where we got lucky.
6. Actions table.
7. Reporting flags for the legal lead.
8. Customer update draft.
9. Runbook draft or changes.

## Example of good output (short)

*Made-up business for illustration: "Copperleaf Tickets", checkout down on a Tuesday evening.*

> | Time (UTC) | What happened | Source |
> |---|---|---|
> | 18:02 | Config change to payment timeout deployed to all servers | Deploy log |
> | 18:04 | Checkout error rate alert fires | Alert history |
> | 18:31 | On-call engineer acknowledges alert (alert went to an old phone number) | Chat export |
> | 18:40 | Incident declared; config change suspected | Chat export |
> | 18:52 | Previous config redeployed; errors fall | Deploy log, graph |
> | 19:10 | All clear | Chat export |
>
> **Where we got lucky:** a sale started at 20:00, an hour after recovery.
>
> | Action | Owner | Due | How we'll know |
> |---|---|---|---|
> | Roll out config changes to one server first, then the rest | Platform lead | 30 May | Next config change shows two stages in the deploy log |
> | Alert routing checked weekly against the on-call rota | Ops lead | 23 May | Weekly check logged |
