---
name: estimate-with-ranges
description: Builds a scope breakdown and a cost and time estimate with low, likely and high figures for a software, website or other project - features split into tasks, the work people forget, assumptions and risks behind each range, a sized contingency, and scope options that fit the budget. Also checks a quote received from a supplier and re-forecasts a project in progress from work done and work left. Use it before asking for quotes, before signing one, when a budget must be set, or when a project is running over. Always labels the result as an estimate, not a promise.
---

# Estimate with ranges

## When to use

- A founder or manager needs to know roughly what a project will cost and take before asking for quotes.
- A quote has arrived and they want to know whether it is complete and fair before signing.
- The budget is fixed and they need to know what fits.
- A project in progress is running over and they need a new range for cost and finish date.

Do not use it to give a fixed price or a guarantee, to build the software, or to review contract terms (that is for their legal adviser).

## Access needed

- **Level 1 (read):** the brief, designs, feature list, quotes, and the tracker or timesheets for a project in progress.
- **Level 2 (read and draft):** build the estimate as a spreadsheet copy or a draft page; draft the questions for the supplier.
- **Level 3 (read, write and publish):** update the live project budget or forecast fields in the tracker and share the re-forecast with the agreed people, within the client's limits.

## What you need

1. The brief, designs or feature list, and who will use the result, on what devices.
2. What must be ready first, and the deadline.
3. The hourly or day rate to use, from the client or the quote. I never invent rates.
4. Any quotes received.
5. For a re-forecast: the task list, what is done, and hours spent so far.
6. Past projects like this one and what they really took, if the client has them.

## Steps

### 1. List the features
Write each feature as something a user can do ("A customer can book a slot and get a confirmation email"). Ask about anything vague.

### 2. Split each feature into tasks
Across design, front end, back end, data, content, testing and launch. One line per task.

### 3. Add the forgotten work
Setup and environments, admin screens, emails and notifications, edge cases and errors, accessibility checks, content entry, data migration, third-party accounts, project management, launch, training, and fixes after launch. These are where quotes most often fall short.

### 4. Estimate each task three ways
A low (things go well), likely and high (things go wrong) figure in hours. Use the client's past projects as the starting point where they exist. Show the arithmetic with the rate given. If a single figure per task is needed, the PERT weighting (low + 4 x likely + high) / 6 is one common option; show it beside the range, not instead of it.

### 5. List assumptions and risks per range
What each range takes for granted (designs are final, the payment provider's test account is ready) and what would push it to the high end (unclear rules, a third-party tool's limits, late content).

### 6. Size the contingency
Base it on how unclear the scope is, and say why it is that size. Hold it as one line, not hidden in each task.

### 7. Separate estimate, target and commitment
Write the estimate (what it will likely take), note any target the business has (what it wants) and leave the commitment (what someone promises) to the client and their supplier.

### 8. Offer scope options for the budget
Two or three versions: for example a core version, the planned version and a fuller one, each with what it includes, its range and what it drops.

### 9. Check a quote (when given one)
Line it up against the breakdown. Mark missing tasks, vague lines ("development: 120 hours"), rates out of line with what the client said they expected, missing exclusions and missing assumptions. Write the questions to ask before signing.

### 10. Re-forecast (when a project is running)
Work done, work left (re-estimated as ranges), the spend so far from the timesheets, and a new range for total cost and finish date. Show what changed since the last estimate and why.

### 11. State what would change it most
End with the two or three things that would move the estimate most, and the line "This is an estimate, not a quote or a promise."

## Checks

- Every feature is split into tasks, and the forgotten work is included.
- Every task has a low, likely and high figure; guesses are labelled.
- Rates come from the client or the quote; the arithmetic is shown.
- Assumptions, risks and exclusions are written.
- Contingency is one line with a reason.
- Scope options each say what they drop.
- The result is labelled as an estimate.
- Nothing was changed in a live tracker without level 3 access.

## Output format

1. Feature list and scope (in and out)
2. Task breakdown table: feature, task, low, likely, high, notes
3. Totals in hours and cost at the given rate, with contingency
4. Assumptions, risks and exclusions
5. Scope options for the budget
6. Quote check and questions (if a quote was given)
7. Re-forecast (if the project is in progress)
8. What would change the estimate most

## Example of good output (short)

*Illustrative structure, not a real business: a dog grooming business wanting online booking. Rate given by the client: $90 an hour. Copy the shape, never the content: every fact comes from the client's own context.*

> | Feature | Task | Low | Likely | High |
> |---|---|---|---|---|
> | Book a slot | Calendar of free slots by groomer | 10 | 16 | 28 |
> | Book a slot | Confirmation and reminder emails | 4 | 6 | 10 |
> | Pay a deposit | Card payment with the provider's test mode first | 8 | 12 | 24 |
> | Forgotten work | Admin screen to block holidays | 6 | 10 | 16 |
> | Forgotten work | Accessibility checks and fixes | 4 | 8 | 14 |
>
> **Totals:** 32 to 92 hours, likely 52; $2,880 to $8,280, likely $4,680, plus contingency of 15% because the payment provider is not chosen yet (assumption, revisit once it is).
> **Biggest movers:** which payment provider; whether groomers need their own logins.
> **This is an estimate, not a quote or a promise.**
