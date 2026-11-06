---
name: funnel-and-retention-diagnosis
description: Builds the growth model from a dated goal back through each funnel step, finds the step that limits growth, reads retention by cohort, and finds the activation moment (the early action that predicts a customer will stay) from a usage or order export. Ends with the order of fixes and one test for the first. Use when sign-ups, leads or first orders do not turn into lasting customers, when a team asks "what should we fix first?", or before writing a 90-day growth plan.
---

# Funnel and retention diagnosis

Most growth plans start with channels. This skill starts one step earlier: it checks whether the business can keep and convert the people it already gets. If it cannot, more traffic only buys churn.

Access levels for this skill: the whole diagnosis runs at level 1 (read exports, a viewer seat in analytics or a read-only connector). Building a saved funnel or retention report inside the client's analytics tool is level 2. Nothing here changes a live page, product or campaign.

## When to use

- Sign-ups, leads or first orders are coming in, but few become paying or repeat customers.
- "What should we fix first?"
- Before choosing channels or writing a 90-day plan.
- After a pricing or onboarding change, to see whether newer cohorts do better.

## What you need

- **Access I have:** level per tool, written down. Until the client answers, level 1.
- **The goal:** a number with a date, counted in customers or revenue.
- **Funnel counts by week for the last 8 to 12 weeks:** visits, sign-ups or enquiries, activated users or booked jobs, paid customers. From GA4, a product analytics tool (Mixpanel, Amplitude, PostHog), the CRM or the booking system.
- **A usage or order export** with customer ID, start date and dated actions, for the activation and retention work. Remove personal details.
- **What the product is for, in the customer's words,** so the "return event" reflects real value, not just a login.

## Steps

1. **Write the goal and the model.** List the steps from first touch to paying customer for this business (the knowledge file has a table by business type). For each, record the weekly count and the step rate.
2. **Work backwards.** From the goal, calculate the volume needed at each step at current rates. Compare with what happens now. The step with the largest gap relative to its rate is the first suspect.
3. **Check retention before anything else.** Build a cohort table: rows are start weeks or months; columns are periods since start; cells are the share still doing the value action. Use "on or after" retention unless the product must be used every period. Use day, week or month buckets that match how often the product should be used.
4. **Read the curves.**
   - Does each curve level off, or keep falling towards zero? Levelling off means a core of customers stays.
   - Do newer cohorts sit above older ones? If yes, recent changes are working.
   - Is there a cliff in the first period? That points to activation.
5. **Find the activation moment.** Split one or two recent cohorts into retained and gone at a fixed point. List actions each group took in the first days. Rank actions by how much more often retained customers did them. Check the top two candidates with their own cohort chart. Write the winner as a hypothesis: "Customers who [action] within [time] are much more likely to stay."
6. **Size the activation gap.** What share of new customers reach the moment now? How many more paying customers would the goal get if that share rose, all else equal? Show the sum.
7. **Optional fit check.** If retention never levels off, run Sean Ellis's question with recent active users ("How would you feel if you could no longer use this?") and Superhuman's three follow-ups. Segment answers to find who loves the product and why.
8. **Order the fixes.** Retention first, then activation, then conversion to paid, then acquisition. Name the one fix to work on now.
9. **Design one test** for the first fix, using the growth-experiment-design skill: hypothesis, metric, guardrail, size, run time.
10. **Write up** in the format below.

## Checks

- Every rate has its date range and source.
- Counts are by week, so one odd week cannot drive the call.
- The return event reflects value, not "any event".
- Incomplete cohort cells are marked and not read as final.
- The activation moment is labelled a hypothesis until a test confirms it.
- The recommended order puts retention and activation ahead of buying traffic, or explains why not.
- No benchmark from another business is used as a target.

## Output format

1. **Goal and model table:** step, weekly count, rate, volume the goal needs, gap.
2. **Constraint:** the step that limits growth, in one sentence, with the evidence.
3. **Retention:** the cohort table and three bullet points on what it shows.
4. **Activation hypothesis:** the action, the evidence, the share who reach it now.
5. **Order of fixes:** numbered, with one line of reasoning each.
6. **First test:** a short test card.
7. **Data gaps:** what could not be measured and how to fix it.

## Example of good output (short)

*Rotafy is a made-up shift-scheduling app for cafés, used only to show the format. All numbers are invented.*

**Goal:** 40 new paying cafés a month by 30 June (now about 17).

| Step (last 8 weeks, weekly average) | Count | Rate | Needed if only this step improves |
|---|---|---|---|
| Site visits | 1,200 | | about 2,770 visits |
| Trial sign-ups | 48 | 4.0% of visits | about 111 sign-ups |
| Activated (published a rota within 3 days) | 14 | 29% of sign-ups | 32 activated, a 67% rate |
| Paid at day 30 | 4 | 29% of activated | 9.2 paid a week (40 a month) |

At the current 29% paid rate among activated trials, the goal needs about 32 activated trials a week (9.2 ÷ 0.286). Traffic alone would need about 2.3 times today's visits. Activation alone would need to rise from 29% to about 67%, which is unlikely in one step, so the plan combines both, starting with activation.

**Retention (paid cafés, by start month):** curves level off at about 70% by month 3 for every cohort since January; no cohort has fallen below that. Paying customers stay. The cliff is before payment.

**Activation hypothesis:** the moment is "publish a rota and invite at least one staff member within 3 days". Activated trials that also invited staff paid at about 41%, against about 12% for those that published without inviting. 17% of sign-ups do both now.

**Order of fixes:** 1. Activation (biggest gap, retention already holds). 2. Trial to paid among activated users (check pricing page questions). 3. Acquisition, once activation is above 40%.

**First test:** pre-filled sample rota on sign-up versus a blank screen; primary metric: share publishing a rota and inviting staff within 3 days; guardrail: paid conversion at day 30. Sizing in the growth-experiment-design skill.

**Data gaps:** "staff invited" came from a database export, not analytics; it is added to the measurement plan as a tracked event. The 41% rests on about 64 cafés over 8 weeks, so it is a lead, not proof.
