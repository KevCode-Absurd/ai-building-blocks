---
name: process-map-and-bottleneck
description: Maps how one process works today from start to finish, marks every wait, hand-off and redo, finds the step that caps output (the constraint) and the causes of delay, then designs a leaner flow and a short, dated trial with a measure and a stop rule. Use it when work piles up, lead times grow, the owner adds hours without more output, or the same delays and redos keep happening. Uses only the client's own counts and labels guesses. Draws on Lean, the five whys and Goldratt's five focusing steps. Changes live boards or task flows only with level 3 access.
---

# Process map and bottleneck

## When to use

- Orders, jobs, tickets or client files queue up somewhere and customers wait.
- Everyone is busy but total output is flat.
- The owner keeps adding hours or staff and nothing moves faster.
- Work comes back for redoing at the same point.
- A hand-off between two people or teams keeps dropping things.

Do not use it to sign off machine safety, engineering changes or capital spending, or to judge individual staff. Those need a qualified engineer, an accountant or HR.

## Access needed

- **Level 1 (read):** task tool exports, job logs, order histories, timesheets and the weekly numbers.
- **Level 2 (read and draft):** draw the current and future maps on a new board, and build the trial tracker in a private project or a copy of the sheet.
- **Level 3 (read, write and publish):** change live board columns, work-in-progress limits and task flows for the trial, and set up the trial's tracking, within the limits the client agreed.

## What you need

1. Where the process starts and ends, and what the customer (or the next team) receives at the end.
2. Who touches the work, in order.
3. Counts from the client's records: items started and finished per week, items waiting at each step, how long items take, how often work comes back. Several weeks of data beats one, because one week can be unusual.
4. Two or three real examples followed from start to end, with dates.
5. What the client has already tried.

## Steps

### 1. Define the process
One line each: start, end, the result the customer sees, and the people involved.

### 2. Map the current steps
List every step as it really happens, as a numbered list and a simple swimlane (one lane per role). Mark:
- **W** for each wait or queue,
- **H** for each hand-off between people,
- **R** for each place work comes back,
- **D** for each decision or approval.

Follow a real example through the map to test it. A value-stream view adds the information flow: who tells whom that work is ready.

### 3. Count what the client gave you
For each step: items waiting, time per item, how often work comes back, how many people touch it. Write "guess" next to anything not from the client's records. Show the arithmetic.

### 4. Find the constraint
The constraint is usually the step with the longest queue in front of it, running flat out while steps after it wait. Check it three ways: where work piles up, which step is always busy, and what happens to total output when that step stops. Name the evidence for each.

### 5. Find the causes of delay
For each big wait or redo, ask why until you reach a cause the team can change. Five is a rule of thumb, not a quota. Stop at a cause that is about the process, not a person.

### 6. Get the most from the constraint (before adding capacity)
- Keep it working: cover its breaks, prepare work for it in advance.
- Check quality before work reaches it, so it never spends time on bad work.
- Give it the most valuable work first.
- Take off it any task another step could do.

### 7. Pace the rest to it
Release new work only as fast as the constraint can take it, and keep a small buffer in front of it so it never runs dry. Limit work in progress elsewhere so piles do not just move.

### 8. Design the leaner flow
Remove steps first, then merge, then reorder, then automate. Keep every step that protects quality, safety or a legal requirement. Draw the future map next to the current one and list what changes.

### 9. Add capacity only if needed
If the constraint still caps output after steps 6 and 7, list options (overtime, cross-training, outside help, equipment) with the cost and output gain for each, from the client's figures. The decision is the client's; spending decisions may need their accountant.

### 10. Write the trial
- What changes, who tries it and where.
- The start and end dates.
- The measure (output, lead time, queue at the constraint, redo rate) and its baseline.
- A guard measure, so a faster step does not cause more errors.
- The stop rule: what result means "go back to the old way".

At level 3, set up the trial in the live board or tracker after the client's yes. Otherwise hand over the setup steps.

### 11. Review and repeat
At the trial's end, compare the measure with the baseline. Standardise what worked (write or update the SOP) or drop it. If the constraint has moved, start again at step 4.

## Checks

- Every number is from the client's data, or labelled a guess, with the arithmetic shown.
- The constraint is backed by at least two pieces of evidence.
- Root causes are about the process, not a person's character.
- Steps that protect quality, safety or compliance are kept.
- The trial has dates, a measure, a baseline, a guard measure and a stop rule.
- No live change was made without level 3 access and the client's yes.

## Output format

1. Process definition (four lines)
2. Current map: numbered list and swimlane, with W, H, R and D marks
3. Counts table, guesses labelled
4. The constraint and its evidence
5. Causes of delay, ranked by effect and effort
6. Future map and change list
7. Trial plan
8. Capacity options with costs (only if needed)

## Example of good output (short)

*Illustrative structure, not a real business: a print studio, five people printing custom posters. Copy the shape, never the content: every fact comes from the client's own context.*

> **Constraint: proof approval.** Evidence from your job log for four weeks: 31 jobs waiting at "Proof sent", against 4 or fewer at every other step; average 3.2 days at this step against under 1 day elsewhere; printing sat idle on 6 afternoons waiting for approved jobs.
> **Why:** Proofs go out as PDFs with no deadline. Why? There is no rule for chasing. Why? Nobody owns approvals once the proof is sent.
> **Changes to try:** (1) The designer sends proofs with a reply-by time and a one-click approve link. (2) The front desk owns chasing at that time. (3) Printing works on approved jobs in deadline order, not arrival order.
> **Trial:** 10 to 21 November. Measure: average days at "Proof sent" (baseline 3.2). Guard: reprints caused by proof errors (baseline 2 in four weeks). Stop rule: reprints rise above baseline, or days at the step do not fall.
