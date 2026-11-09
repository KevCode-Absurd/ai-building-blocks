---
name: drop-off-test-plan
description: Turns one change aimed at the biggest drop-off into a test plan written before launch - hypothesis, who sees it, randomisation unit, primary metric and guardrails, smallest effect worth acting on, a first sample size from the 16 sigma squared over delta squared rule of thumb (final number from the data scientist kit's calculator), run length in whole weeks, a sample ratio check, a no-peeking stop rule and the decision each outcome leads to. Says plainly when traffic is too low and offers a bigger change or a labelled weaker comparison. Setting up a draft experiment is level 2; starting or stopping it live is level 3. Use it before any product change you want to prove.
---

# Drop-off test plan

## When to use

- The funnel or retention analysis named one step to fix, and the team wants to know if the fix works.
- Someone wants to ship a change and "see what happens".
- A test is already running and nobody wrote down when to stop.

For the statistics of reading a finished test (z-test, confidence interval, money value), use the data scientist kit's `experiment-design-and-readout` skill.

## What you need

1. The drop-off to fix, with its current rate and weekly volume (from the funnel or retention work).
2. The change, described so a developer could build it.
3. The testing tool (PostHog, Amplitude, Mixpanel, GrowthBook, a feature-flag tool) or "none".
4. Any rule about who must not see the change (existing customers, one country, a price promise).
5. Access: level 1 to read past results; level 2 to set the experiment up as a draft; level 3 to start, pause or stop it within the limits you set. A change to what customers pay must be named in the limits.

## Steps

### 1. Write the hypothesis

"If we [change] for [who], then [metric] will rise, because [reason from the evidence]." One change at a time, so the result can be read.

### 2. Choose the unit and the audience

Randomise by user, not by page view, when the step spans sessions. Decide who is eligible (new users only, one platform) and exclude staff and test accounts.

### 3. Pick the metrics

- **Primary:** the conversion at the drop-off step, counted per user, with its window.
- **Guardrails:** things that must not get worse: refunds, cancellations, support contacts, page speed, revenue per user.
Write the exact event and window for each.

### 4. Size it

- Smallest effect worth acting on, from the business: "a rise from 25% to 28% would pay for the work".
- First estimate with the rule of thumb n = 16σ²/δ² per group, where σ² = p(1 − p) and δ is the absolute change [24]. For 25% to 28%: σ² = 0.1875, δ = 0.03, so n ≈ 16 × 0.1875 / 0.0009 ≈ 3,333 users per group.
- Confirm the final number with a proper calculator (the data scientist kit sets one out).
- Divide by weekly eligible users to get the run length, then round up to whole weeks so every weekday is covered equally.

### 5. Face low traffic honestly

If the run length is many months, say so. Options: test a bigger change, test at a busier step, measure a nearer metric, or run a before-and-after comparison labelled as weaker evidence that cannot prove cause.

### 6. Set the rules before launch

- **No peeking:** read the result only at the planned size. Stopping at the first significant reading gave 26.1% false positives in Evan Miller's simulation [24]. If early looks are needed, use a sequential or Bayesian design and say so in the plan.
- **Sample ratio check:** before reading results, test whether the split matches the plan. Microsoft's ExP uses a chi-square test with p below 0.0005 as a mismatch, and does not trust results until the cause is found [25].
- **Stop early only for harm:** a guardrail breached or a bug.
- **Know the engine:** PostHog runs Bayesian or frequentist statistics on feature-flag experiments [22]; read the verdict in the tool's own terms.

### 7. Write the decision table

What happens if the result is a clear win, a clear loss, or too small to tell. Decide now, so the result is not argued into a win later.

### 8. Set up and launch (level 2, then 3)

At level 2, create the experiment and flag as a draft and send the plan for review. At level 3, after your yes on the action list and limits, start it, check exposure events and the split on day one, and log both.

## Checks

- One change, one primary metric, guardrails named.
- Unit, audience and exclusions written.
- Size and run length shown with the sums, in whole weeks.
- Low traffic stated plainly with options, if it applies.
- No-peeking rule, sample ratio check and harm stop written before launch.
- Decision table agreed before launch.
- Live start or stop only at level 3 within limits, logged.

## Output format

```
# Test plan: [change], [date]
Hypothesis:
| Item | Plan |
| Who sees it / unit |
| Primary metric (event, window) |
| Guardrails |
| Baseline and smallest effect worth acting on |
| Sample size per group (sums shown) |
| Run length (whole weeks) |
| Split check |
| Stop rule |
| Decision if win / loss / too small |
Access needed: [level per step]
```

## Example of good output (short)

*Illustrative structure, not a real business: an online music lessons app. Copy the shape, never the content: every fact comes from the client's own context.*

> **Hypothesis.** If new users see the next three free trial slots on the teacher page, more will book a trial, because replays show people leaving the calendar screen.
>
> | Item | Plan |
> |---|---|
> | Who sees it | New sign-ups on all platforms, split 50/50 by user ID; staff and test accounts excluded |
> | Primary metric | `Trial Booked` within 7 days of `Teacher Selected`, per user |
> | Guardrails | Trial attendance rate; support tickets about bookings |
> | Baseline and effect | 35% now; 38% would pay for the work (δ = 0.03) |
> | Size | σ² = 0.35 × 0.65 = 0.2275; n ≈ 16 × 0.2275 / 0.0009 ≈ 4,044 per group; confirm with the calculator |
> | Run length | About 960 eligible users a week (2,890 in three weeks), so 8,088 / 960 ≈ 8.4 weeks, rounded up to 9 |
> | Split check | Chi-square on users per group before any result |
> | Stop rule | Read at 9 weeks; stop early only if attendance falls or booking errors rise |
> | Decision | Win: roll out. Loss: remove. Too small: keep the simpler page |
>
> Nine weeks is long. A bigger change (booking on the teacher page itself) could be sized for a 5-point rise instead; I can plan that too.
