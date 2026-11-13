---
name: daily-ad-account-review
description: "A 20-minute daily routine for a store's Meta and Google accounts that stops knee-jerk changes. Checks breakages first (spend stopped, ads rejected, purchases not reaching the platform against store orders, stock-outs), then follows the media-buying spine on rolling 7-day store numbers: paused winners ready to relaunch, whether the best segment and proven formats are getting the spend, creative fatigue, pacing against the whole budget, and a Hold, Trim or Cut verdict that matches its number, applied through each ad set's one rule. Scale is flagged, never done daily. Every decision goes into a log with a prediction and a review day. Use every working day, or hand it to whoever watches the accounts."
---

# Daily ad account review

**You get:** a five-line daily note, a review table of every campaign and ad set against store-basis targets with one verdict and its rule, the relaunch and creative flags, and a decision log row with a prediction.

Daily numbers move a lot for no reason. This routine looks every day but acts only on breakages and on rules that hold over a week, so a month later the store can see which calls were right.

## When to use

- Every working day, before anyone touches budgets.
- Handing day-to-day watching to a junior, an assistant or an agent, with clear limits.
- After a launch or a budget change, to catch problems early.
- When the owner keeps reacting to yesterday's ROAS.

## Not for

- Weekly budget decisions per Meta campaign: use `store-meta-budget`.
- A drop that has lasted a week or more: use `store-results-drop-diagnosis`, or `store-meta-deep-dive` for Meta alone.
- Sorting ads into scale, keep, fix or cut in depth: use `store-meta-creative-review`.
- Grading old decisions: use `recommendation-scorekeeping`, which reads this log.

## What you need

Required (read access, level 1):

1. **Meta Ads Manager**, a saved report with yesterday and the last 7 days, campaign, ad set and ad levels: Delivery, Amount spent, Purchases, Purchase value, Cost per purchase, Frequency, CPM, link click-through rate, Budget, Attribution setting.
2. **Google Ads**, a saved view for yesterday and the last 7 days: Status, Cost, Conversions, Conv. value, Conversions (by conv. time), Search lost IS (budget), and Merchant Center disapprovals.
3. **Shopify**, yesterday and the last 7 days: orders, net sales, and orders by UTM.
4. **The plan card** from `store-meta-budget` or `store-meta-math`: break-even and target cost per purchase on each platform's basis, the store-vs-platform gap per ad set, the period's budget, each ad set's one rule, the winning segment and proven style.
5. **Stock alerts**: SKUs below 14 days of cover.
6. **The decision log** to date, and alerts from `ad-early-warning-watch` if the store runs it.

If the plan card is missing, run only step 1 (breakages) and ask for it.

Access: level 1 for the review. Pausing, budget changes and new ads need a client yes, asked in your message, or written level 3 limits for this routine (for example "may pause an ad set that spends 3 times target with no purchase; may not raise any budget").

## Before you start: the gates

1. **Targets from real margins.** Pass when the card uses gross profit per purchase after product cost, shipping, fees and returns [MEA-0023]. Fail: breakages only. The store's target can sit at or below first-order break-even when repeat buying is measured on real cohorts [MEA-0044].
2. **Cash and stock limits current.** Fail: no budget changes.
3. **Tracking.** Step 1 tests it daily. If it fails, the day's only job is the fix; numbers below it are not trusted [ADC-0028].

## Steps

Follow the house rules, chiefly **Look it up before you decide**, **Only the brief's facts run the business** and **One basis per number**. Read the plan card's brand brain (winning segment, proven style) before step 1. When a call is new, run `node tools/ask-knowledge.mjs` for it and note the card in `context/trace.md`. Review days are counted from today.

### 1. Tracking and breakages (5 minutes)

Act the same day on these, because each costs money every hour:

| Check | Breakage when | Action |
|---|---|---|
| Delivery | A funded campaign spent 0 yesterday, or ads rejected | Find the cause; tell the client today |
| Spend spike | Spend over 150% of the 7-day daily average (practitioner default) | Check budget edits in activity history |
| Tracking | Platform purchases under half of that channel's store orders, or zero (practitioner default) | Escalate to `store-meta-capi` |
| Stock | An advertised SKU out of stock or under 7 days of cover | Propose pausing its ads [ADC-0023] |
| Feed | New disapprovals on bestsellers | Fix the feed field named |
| Landing page | Error or wrong price | Fix the page; pause only if it cannot be fixed today |

Then write the store's three numbers: yesterday's orders, net sales and total ad spend, against the 7-day average. Store numbers are the referee. Every read below uses the plan card's gap per ad set, never a midpoint.

### 2. What worked before

- Check the log for winners paused for stock, fatigue or season. When the reason has passed (stock back above lead time, a fresh cut ready), flag them to relaunch at the next weekly review.
- Inside a campaign hitting target, leave ad sets and ads alone. Meta sequences ads, so switching off a weak ad inside a winning ad set can hurt it [ADC-0009].

### 3. Audiences

- Is the winning segment's ad set getting its planned share of spend? If its share fell for 3 days or more, flag it.
- Existing-customer and retargeting campaigns read on 14 days. Their warning is frequency, not cost: above about 7 a month on existing customers means overspend [ADC-0040].

### 4. Formats and messaging

- Count the proven-style ads that are spending. Fewer than the plan names means new creative is due; flag it to `store-meta-creative-review`.
- Cold-campaign ad frequency above about 2 points to fatigue or too few distinct ads [MCR-0040].
- Very high click-through with few purchases can be a false winner; check the drop from all clicks to link clicks [MCR-0029].

### 5. Budget

- Pacing: spend to date against the plan for the period. The plan spends the whole budget; underspend on a winner is flagged, not left.
- Below about 1,000 a day of Meta spend, day-to-day swings are normal; judge on at least 7 days [ADC-0064]. For Google, read recent days on conversion-time columns [MEA-0051].
- Raises never come from this routine: big raises look bad on day one because new buyers take days to convert [ADC-0056].

### 6. Verdicts

Each campaign on 7-day store-basis cost per purchase against target and break-even. Judge creative at ad set level [ADC-0059]. One label per line, matching its number:

| Situation | Verdict | Budget |
|---|---|---|
| At or under target, no breakage | Hold | Same; no edit |
| Between target and break-even, under 7 days of data, or in learning | Hold | Same; review when 7 days are in |
| Over break-even for 7 days after 3 times target spend | Trim or Cut, proposed | Lower, or zero |
| New ad at 3 times target cost with 0 or 1 purchases | Cut, proposed | Zero for that ad |
| At target and spending its full budget for 7 days | Hold, flagged for Scale | Same today; sent to `scale-readiness-check` |

A new ad is judged after spending 3 times the target cost: 3 or more purchases keep, 2 wait, 0 or 1 cut [ADC-0039]. Cutting at 1 times break-even is too quick: an ad expected to make about one sale makes none roughly a third of the time by chance.

### 7. Rules

Apply each ad set's one rule from the plan card, read on store numbers, never platform cost alone. Log one row per decision, "no change" included: day, platform, level, name, trigger numbers, rule, verdict, approved by, done at, the prediction ("store-basis cost back under target within 7 days") and the review day. A call with no prediction cannot be graded.

### 8. Hand over

Send the client a five-line note: store numbers, breakages (or "none"), changes proposed, changes made inside agreed limits, and the next review day. India and cash-on-delivery stores add one line: return-to-origin rate on orders delivered yesterday; a jump is flagged, never acted on in one day.

## Checks before you hand it over

- The breakage table was checked in full, with a result per row.
- Every read uses 7-day store-basis numbers and the plan card's gap.
- Paused winners whose reason has passed are flagged to relaunch.
- The winning segment's share and the proven-style ad count were checked.
- Pacing is read against the whole budget; no budget was raised.
- Every verdict label matches its budget change; no ad inside a winning ad set was paused.
- Every decision, "no change" included, has a log row with a prediction and review day.

## Output

**Daily note (five lines):** store orders and net sales against the 7-day average, breakages, proposed changes, changes made, next review day.

**Table "Today's review":** Name, Store cost 7 days, Target, Verdict, Rule.

**Flags:** winners to relaunch, segment share, creative due.

**File "decision-log.csv"** (appended daily): Day, Platform, Level, Name, Trigger numbers, Rule, Verdict, Approved by, Done at, Prediction, Review day, Outcome and Grade (filled later).

## Common mistakes

- **Acting on yesterday.** Step 5 uses 7 days [ADC-0064].
- **Pausing weak ads in a winning ad set.** Step 2 leaves them alone [ADC-0009].
- **Forgetting paused winners.** Step 2 flags them when their reason has passed.
- **Calling the last Google days a drop.** Step 5 uses conversion-time columns [MEA-0051].
- **Raising budgets daily.** Step 6 flags Scale for the weekly check.
- **A log with no predictions.** Step 7 refuses calls that cannot be graded.

## Sources

- ADC-0009: do not cut weak ads inside a winning ad set.
- ADC-0023: pause ads on SKUs about to sell out.
- ADC-0028: data integrity first.
- ADC-0039: read new ads after 3 times target cost.
- ADC-0040: existing-customer frequency under about 7 a month.
- ADC-0056: big raises look bad before delayed buyers convert.
- ADC-0059: judge creative at ad set level.
- ADC-0064: daily swings are noise at low spend.
- MCR-0029: high-CTR false winners.
- MCR-0040: frequency above about 2 signals fatigue.
- MEA-0023: product margin is not gross margin.
- MEA-0044: target cost can follow measured repeat value.
- MEA-0051: Google credits the click date.

What makes this skill ours: breakages and stock first, store numbers as the referee, paused winners and creative supply watched every day, labels that match their budget change, and a log with predictions so each call can be graded.
