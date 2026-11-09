---
name: growth-experiment-design
description: Turns a growth idea into a test that ends in a decision. Decides whether it is a channel bet (read on customers and cost) or a controlled experiment (read on a rate), writes the hypothesis, primary and guardrail metrics, sample size and run time, pass and stop marks, the access each step needs, and later reads the result with a sample-ratio and tracking check. Use when someone says "let's test X", when ranking a backlog with ICE scores, before launching any page, onboarding, email or pricing change, or when a finished test needs an honest readout.
---

# Growth experiment design and readout

Most "tests" in small businesses end without a decision: they were too small to read, stopped when they looked good, or never had a pass mark. This skill makes each test answer one question with a yes, a no or an honest "unclear".

Access levels for this skill: designing and reading tests needs level 1. Building the variant, a paused campaign or an unstarted experiment in the client's tool is level 2. Starting, stopping or shipping a test is level 3, within the limits the client set, after one yes to the action list. Log every action.

## When to use

- "Let's test a new onboarding / pricing page / offer / subject line."
- Ranking a backlog of ideas.
- Before anything goes live as a test.
- A test has ended and someone needs to know what it means.

## What you need

- **Access I have** per tool, written down. Until the client answers, level 1.
- The idea and the evidence behind it (interview notes, funnel data, reviews).
- Current numbers for the metric the idea should move: weekly volume and rate for the last 4 to 8 weeks.
- Unit economics or the allowable CAC (from the unit-economics-and-cac-limit skill) for channel bets.
- The tool that will run it: a page builder or app's A/B feature, an email platform's split test, an ad platform's experiments tool, a feature-flag tool (GrowthBook, Statsig, PostHog), or a simple holdout.

## Steps

1. **Classify the test.**
   - *Channel bet:* does this channel bring customers at an affordable cost? Use the Traction pack's test card if the client has it: budget cap, time box, tracking, pass and stop marks from unit economics. Read on customers and cost, not significance.
   - *Controlled experiment:* does this change lift a rate? Users are split at random. Continue below.
2. **Score it (ICE).** Impact if it works, confidence from evidence (not hope), ease in hours and access needed. Score each 1 to 10 and average. Note the evidence for the confidence score in one line.
3. **Write the hypothesis.** "Because [evidence], changing [element] for [audience] will raise [primary metric]."
4. **Choose metrics.** One primary metric that reflects value (paid conversion, activation, booked calls, orders), not clicks. One or two guardrails that catch harm: refunds, cancellations, unsubscribes, lead quality, support tickets.
5. **Size it.** Per variant, n ≈ 16 × p(1 − p) ÷ δ², with p the current rate and δ the smallest absolute change worth detecting (Evan Miller's rule of thumb, about 80% power at 5% significance). Total = n × number of variants. Run time = total ÷ weekly eligible users, rounded up to whole weeks.
6. **Decide if it is feasible.** If the run time is longer than the business can wait, or longer than the period over which other changes will muddy it, do not run an A/B test. Options: test a bigger change (larger δ), test the idea where volume is higher (ad copy, email subject lines), or ship it as a judgement call with a dated note and a before-and-after watch.
7. **Write the decision rule before launch.** What result means ship, keep the control, or test again. Include what happens if a guardrail moves the wrong way.
8. **Plan the build and approvals.** At level 2, build the variant and leave it unstarted; the client starts it. At level 3, list the actions (start, end date, traffic split, budget if any) and get one yes. Anything outside the limits (a new audience, a price shown to customers, spend above the cap) needs a fresh yes.
9. **Run whole weeks; do not peek to stop.** Check once early for bugs and broken tracking only.
10. **Read the result.**
    - Sample ratio: is the split close to plan? If not, stop and find the cause before reading anything.
    - Tracking: did the primary metric fire in both groups at similar volumes before the change point?
    - Primary metric against the decision rule; guardrails checked.
    - Surprisingly large lift: look for a bug first.
11. **Log it:** date, hypothesis, result, decision, lesson, next idea.

## Checks

- The test answers one question.
- Primary metric reflects customer value, not activity.
- Sample size working is shown with inputs, or the test is openly a channel bet.
- Decision rule and guardrails were written before launch.
- The access level for every live step is recorded, and level 3 actions had a yes.
- The readout includes the sample ratio and tracking checks.
- Losing and unclear tests are logged as fully as winners.

## Output format

**Before launch (test card):** name; type; ICE score with evidence line; hypothesis; primary metric and guardrails; sizing working; run time; decision rule; build steps with access level; approvals needed.

**After (readout):** sample ratio check; tracking check; result with numbers and date range; decision; lesson; next test.

## Example of good output (short)

*Illustrative structure, not a real business: an invoicing app for freelancers. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Test card: onboarding checklist**

- **Type:** controlled experiment (new sign-ups split 50:50 by the feature-flag tool).
- **ICE:** impact 7, confidence 6 (interviews: 9 of 14 churned users never sent a first invoice), ease 8. Score 7.0.
- **Hypothesis:** because most churned users never sent an invoice, a three-step checklist on first login will raise the share sending a first invoice within 7 days.
- **Primary metric:** first invoice sent within 7 days (now 30%). **Guardrails:** trial-to-paid at day 30; support tickets per sign-up.
- **Sizing:** sign-ups 200 a week. To detect +5 points (30% to 35%): n ≈ 16 × 0.30 × 0.70 ÷ 0.05² = 1,344 per variant, 2,688 total, about 14 weeks. Too long. To detect +10 points: n ≈ 336 per variant, 672 total, about 4 weeks. **Plan:** run 4 weeks, sized for a 10-point lift; a smaller real lift may show as "unclear".
- **Decision rule:** ship if the checklist group is higher at 5% significance (two-proportion test) and paid conversion is not lower; otherwise keep the control and log "unclear"; stop early only for a bug.
- **Access:** level 2 to build the flag and checklist, unstarted; the founder starts it. Level 3 was not granted.

**Readout (after 4 weeks):** split 401 to 389, within normal variation for 50:50. Tracking fired in both groups. First invoice within 7 days: 44% checklist vs 31% control (+13 points; z about 3.8, well past the 5% line). Trial-to-paid at day 30 not yet final for the last two weeks of sign-ups; first two weeks show no drop. Support tickets flat. **Decision:** ship, and re-check paid conversion when all cohorts reach day 30. **Lesson:** the first invoice is a strong activation candidate; test sending it from a template next.
