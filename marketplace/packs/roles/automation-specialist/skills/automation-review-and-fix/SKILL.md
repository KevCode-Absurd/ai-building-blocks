---
name: automation-review-and-fix
description: Diagnoses an automation that fails, runs twice, misses records or burns through its plan, and reviews new automations before anyone relies on them - reads run history and step settings, finds the cause, checks filters, field maps, dedupe, error paths, alerts, approvals, secrets and usage, then gives the fixed steps or code, a test, a rollback plan and a clean-up of bad records. Works at access level 1 for diagnosis, level 2 to stage the fix, and level 3 to apply it and replay runs within the client's limits.
---

# Automation review and fix

## When to use

- "Our Zap fails twice a week at the Google Sheets step."
- Records are created twice, or some never arrive.
- The plan's tasks, credits or runs ran out early.
- A new automation is about to go live and nobody has checked it.
- An automation was built by someone who has left.

## What you need

1. The automation's steps and settings: an export, screenshots, or level 1 access to the tool.
2. Two or three failed or wrong runs from the run history, with the data in and out (personal details masked if pasted).
3. What it should do, in plain words, and what changed recently (new fields, new plan, a renamed sheet).
4. The plan for each app.
5. Access: level 1 to read history and settings; level 2 to stage the fix in a copy or draft; level 3 to change the live automation, replay failed runs or clean up records, after the client confirms the action list.

## Steps

### 1. Restate the job

One paragraph: trigger, steps, what "done" looks like. If nobody can say, that is the first finding.

### 2. Read the failures

For each failed run: the step, the error message, the input data and what was different about it (a blank field, a new value, a long text, a rate limit, an expired connection). Group failures by cause.

### 3. Check the common causes

- **Missing or changed fields:** a renamed column or form question breaks the map.
- **Bad formats:** dates, phone numbers, currency, empty strings versus blanks.
- **Expired or wrong connections:** an account that left, a reset password, lost permissions.
- **Rate limits and time-outs:** too many calls at once; code steps over the plan's run time.
- **Doubles:** create steps with no find step; replays and webhook retries; two automations doing the same job.
- **Missed records:** polling gaps, filters too strict, a trigger that only sees new records and not updated ones.
- **Usage blow-out:** loops over line items, steps that count but add nothing, polling far more often than needed.

### 4. Review the design (for new automations too)

Run the checklist: trigger fits; filters correct; field map complete with blank handling; dedupe key before every create; error path and alert to a named person on every step that can fail (in Zapier, handlers send no error email); human approval for money, deletions and customer messages; no secrets in steps; usage inside the plan; switch-off and rollback written down; owner named.

### 5. Write the fix

The changed steps or code in full, for the named platform, with input and output names that match the field map. Add the missing dedupe, error path or alert.

### 6. Stage and test (level 2)

Apply the fix to a copy or a draft version with the trigger off. Test with the inputs that failed, plus a normal record and a duplicate. Record the results.

### 7. Apply and recover (level 3)

With the client's yes on the action list: apply the fix to the live automation, then decide what to do with the failed runs (replay, fix by hand, or leave) and with any doubles already created (merge or delete, which needs its own yes because it cannot be undone). Log every action.

### 8. Prevent it next time

Add a check that would have caught this (an alert, a weekly count comparison, a catch-up job), and a note in the automation's description of what was changed and why.

## Checks

- The cause is shown from run history, not guessed.
- The fix is complete code or steps for the named platform.
- The fix was tested on the inputs that failed.
- Replays and clean-ups were agreed before they ran; deletions had their own yes.
- An alert now reaches a named person.
- The log lists every action taken in the client's tools.

## Output format

1. **What it should do.**
2. **What went wrong:** cause, evidence from the runs, how many records were affected.
3. **Fix:** steps or code in full.
4. **Test results.**
5. **Recovery plan:** replays, manual fixes, duplicate clean-up, each with the access level needed.
6. **Review findings** ranked by risk, for anything else found.
7. **Prevention:** the new check and the note.

## Example of good output (short)

*Made-up business: Cove Swim School, Zapier, booking form to Google Sheets.*

> **What went wrong.** 9 of 212 runs in October failed at "Create Spreadsheet Row" with "Required field Date is missing". All 9 came from the mobile form, which sends the date as "" when the parent skips the optional second-choice field; the Zap maps the second-choice date into the required Date column by mistake.
>
> **Fix.** Map Date from "First choice date" (always filled). Add a Formatter step: if "Second choice date" is blank, write "none". Add an error handler on the Sheets step that posts the booking ID to #bookings-alerts.
>
> **Test.** The 9 failed inputs now pass; a normal booking passes; the same booking sent twice updates one row (find step on booking ID added).
>
> **Recovery (level 3, confirmed with the owner).** Replay the 9 failed runs after the fix; no doubles to clean up.
