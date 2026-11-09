---
name: funnel-drop-off-analysis
description: Builds a step-by-step funnel from exported events or weekly step counts - each step defined in one line, the window, step order and counting method stated, conversion from the previous step and from step 1, splits by device, platform, source and start week - then picks the biggest fixable drop, lists likely causes with the evidence that would tell them apart, and hands one change to the test plan skill. Notes how GA4, Amplitude, Mixpanel and PostHog funnel settings differ. Reading data is level 1; saving shared funnel reports is level 3. Use it when someone asks where users are lost.
---

# Funnel drop-off analysis

## When to use

- "Where do we lose people between visit and purchase?"
- "Sign-ups are fine but few people book. Why?"
- A weekly or monthly check of the main funnel.
- Before choosing what to test.

## What you need

1. The key action that shows value, and the steps that lead to it.
2. Step counts by week, or an event export with user ID, event name, timestamp, device, platform and source (IDs only, no names or emails).
3. The tool and its funnel settings, if the counts came from a saved report (screenshot with settings visible).
4. Release dates, outages, price changes and campaigns in the period.
5. Access: level 1 covers every step. Saving or sharing the funnel inside your tool is level 2 (unshared) or level 3 (shared with agreed people).

## Steps

### 1. Define the steps

Write each step in one plain line with the event behind it: "Step 3, Booking started: `begin_checkout` fired." Confirm each step exists in the data and has counts. If a step cannot be counted, say so and add it to the tracking plan instead of guessing.

### 2. Fix the settings

State, above the table:
- **Window:** how long a user has from step 1 to finish. Mixpanel defaults to 7 days and allows up to 366 [16].
- **Order:** in order with other events allowed between steps, strict (nothing between), or any order. GA4 calls these "indirectly" and "directly followed by" [4]; Amplitude "this order", "exact order" and "any order" [12]; PostHog "sequential", "strict" and "any order" [20].
- **Entry:** closed (must start at step 1) or open (enter at any step) [4].
- **Counting:** unique people (the usual choice), totals or sessions [16].
- **Exclusions:** staff, test accounts, bots.

### 3. Build the table

For each step: people, conversion from the previous step, conversion from step 1, and people lost. Check the arithmetic: each step's count is no larger than the one before in an ordered funnel.

### 4. Split

Split by device, platform, browser, source and start week where the data allows. Look for one group that behaves very differently. A drop on one device or browser only is usually a bug; check it before writing a theory. Flag groups too small to judge.

### 5. Watch for traps

- **Incomplete recent weeks:** the newest cohort has not had the full window. Hide or mark it (PostHog can hide incomplete periods [20]).
- **Mixed definitions:** a step event that changed name or meaning mid-period.
- **Tracking loss:** browser events lost to blockers, especially at payment; compare the last step with a trusted total.
- **First-entry counting:** many tools count only a user's first attempt by default [4][16].

### 6. Pick the drop to fix

Rank drops by people lost multiplied by how fixable the step is. Prefer a step the team controls this month. Say why the others were not chosen.

### 7. List likely causes and the evidence

For the chosen step, list two to four likely causes. For each, the evidence that would support or rule it out: session replays, error logs, the step split by device, time to convert, survey or support answers. Tools such as PostHog's correlation analysis can suggest properties linked with conversion; treat them as clues only [20].

### 8. Hand over one change

Write one change aimed at the most likely cause, and pass it to the `drop-off-test-plan` skill. Do not say a change "will fix" the drop.

## Checks

- Each step is defined in one line and was counted.
- Window, order, entry and counting method are stated.
- Counts and both conversion rates shown; arithmetic checked.
- Incomplete periods marked; staff and test traffic excluded.
- At least one split was examined; small groups flagged.
- Likely causes are labelled as likely, each with the evidence that would test it.
- No claim that a change caused anything without a test.

## Output format

```
# Funnel: [first step] to [key action], [date range]
Settings: window [x]; order [x]; entry [open/closed]; counting [people]; excluded [x]

| Step | Definition | People | From previous | From step 1 | Lost |

## Splits that stand out
## The drop to fix first, and why
## Likely causes and the evidence for each
## One change to test
## Data limits
```

## Example of good output (short)

*Illustrative structure, not a real business: an online music lessons app; sign-ups from 1 to 21 September, read on 29 September. Copy the shape, never the content: every fact comes from the client's own context.*

> Settings: 7-day window; in order, other events allowed; closed funnel; unique people; staff and test accounts excluded.
>
> | Step | Definition | People | From previous | From step 1 |
> |---|---|---|---|---|
> | 1 Sign-up | `Account Created` | 4,120 | | 100% |
> | 2 Teacher chosen | `Teacher Selected` | 2,890 | 70.1% | 70.1% |
> | 3 Trial booked | `Trial Booked` | 1,010 | 34.9% | 24.5% |
> | 4 Trial attended | `Trial Attended` | 760 | 75.2% | 18.4% |
>
> **Biggest drop:** step 2 to 3 loses 1,880 people. On Android, 134 of 640 people who chose a teacher booked a trial (20.9%); on iOS and web, 876 of 2,250 did (38.9%).
>
> **Likely causes and evidence.** (a) The Android calendar picker fails on some phones: check error logs and replays for Android at this step. (b) Trial times shown are far ahead: compare time to convert by device. (c) Price shown late: check whether drop-offs follow the price screen.
>
> **One change to test:** after the Android bug check, show the next three free trial slots on the teacher page. Handed to the test plan skill. Sign-ups from 22 to 28 September have not had the full 7-day window, so they are left out.
