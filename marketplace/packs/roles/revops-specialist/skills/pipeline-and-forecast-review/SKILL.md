---
name: pipeline-and-forecast-review
description: Reviews a sales pipeline from a CRM export - stage conversion, time in stage, deals at risk, and whether volume, win rate, deal size or cycle length moved - then builds a forecast as a best, likely and worst range with every assumption listed. Use it for a weekly pipeline review, a quarter-end forecast, or when sales dropped and nobody knows why. States what the data cannot tell you; does not give financial or investment advice.
---

# Pipeline and forecast review

## When to use

- Weekly or monthly pipeline review for a sales manager or founder.
- Quarter-end forecast for the owner, the board or finance.
- "Sales dropped this quarter. Why?"
- Before setting next period's targets.

## What you need

1. A deal export with deal ID, owner, amount, created date, close date, current stage, closed won or lost, loss reason, and stage history (either a stage history export or "date entered stage" fields).
2. At least the last four quarters of closed deals if available, for conversion and cycle length.
3. The stage definitions and forecast categories in use (for example Pipeline, Best case, Commit).
4. The period to forecast and any target.

**Access:** level 1 is enough for the analysis. Level 2 to build the report or dashboard in the CRM unpublished. Level 3 to publish the agreed dashboard, update close dates or next steps only where the owner has confirmed them, and set the weekly review task, within your limits. I never move a deal's stage or amount on my own judgement.

## Steps

### 1. Read and clean

- List columns and what each means; flag missing stage history or close dates.
- Count duplicates, deals with no amount, no owner, or closed with no close date. Report the counts; exclude only with a stated rule.
- Note the currency and whether amounts include tax or one-off fees.

### 2. Measure the pipeline

- **Stage counts and value** now, and at the same point last period.
- **Stage-to-stage conversion** from closed cohorts: of deals that entered stage A, how many reached stage B.
- **Time in stage** (median, not average, because a few stuck deals distort the mean).
- **Win rate** on closed deals, by count and by value.
- **Average deal size** and **sales cycle length** (created to closed won).

### 3. Find which number moved

Compare this period with a like-for-like period. Split the change into:
1. Volume (new deals created).
2. Win rate.
3. Deal size.
4. Cycle length (deals slipping out of the period).

Say which moved most and by how much. Then check the likely causes in the data: a lead source that dried up, one rep's results, a segment, a product, a stage where conversion fell.

### 4. Flag deals at risk

Use rules the client agrees, for example:
- Close date in the past and still open.
- No activity within the client's chosen window.
- No next step recorded.
- In a late stage without the fields its entry rule needs.
- Close date pushed more than once.

List each with owner and the single question to ask in the review.

### 5. Build the forecast as a range

- **Likely:** open deals weighted by historic stage-to-won conversion (not the probabilities typed into the CRM, unless they match history), plus expected new deals created and closed within the period from history.
- **Best:** add the deals reps mark as Best case at a higher rate, stated.
- **Worst:** Commit and closed won only, with known slips removed.
- Write every assumption in a table so the reader can change it.
- If the period has few deals, say the range is wide and why.

### 6. Turn it into actions

End with no more than three actions for the week, ranked by effect and effort, each with an owner.

## Checks

- Every figure traces to the export and the date pulled.
- Conversion and cycle length use closed cohorts, not open deals.
- The forecast is a range with assumptions listed; nothing is presented as certain.
- Findings describe the process, not individual blame.
- Anything about revenue recognition, tax or investment is out of scope: ask a qualified accountant.

## Output format

1. One-paragraph summary: what moved, the forecast range, the top action.
2. Pipeline table: stage, deals, value, median days in stage, conversion to next stage.
3. Movement split: volume, win rate, deal size, cycle length, this period vs last.
4. Deals at risk table.
5. Forecast table: best, likely, worst, with assumptions.
6. Three actions with owners.
7. What the data cannot tell us.

## Example of good output (short)

*Illustrative structure, not a real business: a freight software company with 6 sellers, Q3 review. Copy the shape, never the content: every fact comes from the client's own context.*

**Summary.** Closed-won value fell 18% against Q2. Volume and deal size held; win rate fell from 31% to 22%, almost all at the proposal stage. Likely Q4: 410k (best 520k, worst 300k).

| Driver | Q2 | Q3 | Change |
|---|---|---|---|
| New deals created | 96 | 94 | flat |
| Win rate (count) | 31% | 22% | down |
| Median deal size | 14.2k | 14.6k | flat |
| Median cycle (days) | 47 | 51 | up slightly |

**Assumptions.** Stage-to-won rates from the last four closed quarters; new-deal creation at the Q3 rate; two late-stage deals with pushed close dates counted only in best case.

**What the data cannot tell us.** Loss reasons are blank on 40% of Q3 losses, so the cause of the proposal-stage drop needs the win-loss prompt and a look at the proposals.
