---
name: daily-ad-account-review
description: "A 20-minute daily routine for a store's Meta and Google ad accounts that stops knee-jerk changes. First checks for real breakages (spend stopped, ads rejected, purchases not reaching the platform, stock-outs), then reviews campaign, ad set and ad on rolling 7-day numbers against break-even from the store's real product margins, and makes only the keep, cut or adjust calls the rules allow. Most days the right answer is no change. Every decision goes into a log with a prediction and a review date so it can be graded later. Use it every working day, or hand it to whoever watches the accounts."
---

# Daily ad account review

**You get:** a five-line daily note, a review table of every campaign, ad set and ad against break-even with a clear call and rule, and a decision log row appended each day.

Daily numbers move a lot for no reason. This routine looks every day but acts only on breakages and on rules that hold over a week. It is built so the store can see, a month later, which calls were right.

## When to use

- Every working day, morning, before anyone touches budgets.
- Handing day-to-day watching to a junior, an assistant or an agent, with clear limits.
- After a launch or a budget change, to catch problems in the first days.
- When the owner keeps reacting to yesterday's ROAS and needs a steadier routine.

## Not for

- Weekly budget decisions per Meta campaign: use `store-meta-budget`.
- Diagnosing a drop that has lasted a week or more: use `store-results-drop-diagnosis` across channels, or `store-meta-deep-dive` for Meta alone.
- Sorting ads into scale, keep, fix or cut in depth: use `store-meta-creative-review`.
- Grading old decisions: use `recommendation-scorekeeping`, which reads this log.

## What you need

Required (read access, level 1):

1. **Meta Ads Manager**, a saved report with yesterday and the last 7 days, campaign, ad set and ad levels: Delivery, Amount spent, Purchases, Purchases conversion value, Cost per purchase, ROAS, Frequency, CPM, CTR (link click-through rate), Budget, Bid strategy, Attribution setting.
2. **Google Ads**, a saved view of campaigns for yesterday and last 7 days: Status, Cost, Conversions, Conv. value, Conversions (by conv. time), Search lost IS (budget), and the Merchant Center Diagnostics count of disapproved products.
3. **Shopify** yesterday and last 7 days: orders, net sales, and orders by referrer or UTM (Analytics, or an order export with the Landing site field).
4. **Break-even card** from `store-meta-math`: break-even and target cost per purchase and ROAS per product group, on each platform's basis using the store-truth factors from `store-meta-attribution`.
5. **Stock alerts**: SKUs below 14 days of cover.
6. **Yesterday's log**, and today's alerts from `ad-early-warning-watch` if the store runs it; its alerts feed check 1.

If the break-even card is missing, run only check 1 (breakages) and ask for it.

Access: level 1 for the review. Pausing, budget changes and new ads need a client yes, or written level 3 limits for this routine (for example "may pause an ad set that spends 3 times target with no purchase; may not raise any budget").

## Before you start: the gates

1. **Break-even from real margins.** Pass when the card uses gross profit per purchase after product cost, shipping, fees and returns, not price minus unit cost [MEA-0023]. Fail: no cut or scale calls; breakages only. The store's goal can sit at or below first-order break-even when repeat buying is measured on real cohorts [MEA-0044]; then judge against that written target, never against a generic ROAS.
2. **Cash and stock limits.** Pass when the monthly cap and stock alerts are current. Fail: no budget raises.
3. **Tracking.** Check 1 tests this every day. If it fails, the day's only job is the tracking fix; numbers below it are not trusted [ADC-0028].

## Steps

### 1. Breakages first (5 minutes)

Act the same day on these, because each costs money every hour:

| Check | Breakage when | Action |
|---|---|---|
| Delivery | A campaign with budget spent 0 yesterday, or ads rejected | Find the cause; tell the client today |
| Spend spike | Yesterday's spend over 150% of the 7-day daily average, practitioner default | Check budget edits in activity history |
| Tracking | Platform purchases yesterday under half of store orders from that channel, or zero, practitioner default | Escalate; send to `store-meta-capi` |
| Stock | An advertised SKU out of stock or under 7 days of cover | Propose pausing its ads; profitable or not [ADC-0023] |
| Feed | New Merchant Center disapprovals on bestsellers | Fix the feed field named |
| Landing page | Advertised page returns an error or the wrong price | Fix the page; pause only if it cannot be fixed today |

If nothing breaks, go on. If something does, fix it, log it and stop the routine for the day, unless the rest of the account is unaffected.

### 2. Store first (2 minutes)

Write three numbers: yesterday's store orders, net sales and total ad spend, and the same for the 7-day average. Blended spend over net sales tells the day at a glance. The store's numbers are the referee when a platform says something different.

### 3. Campaigns on 7 days, not yesterday

Below about 1,000 a day of Meta spend, day-to-day ROAS swings are normal; judge on at least 7 days [ADC-0064]. For Google, read recent days on the "by conversion time" columns, since the default view credits the click date and makes the last 3 to 4 days look weak [MEA-0051].

For each campaign: 7-day cost per purchase on the platform basis against target and break-even. Label green (at or under target), amber (between target and break-even) or red (over break-even).

Two campaign types read differently:
- **Retargeting and existing-customer** campaigns spend little and convert in small numbers; read them on 14 days. Their warning sign is frequency, not cost: above about 7 a month on existing customers means overspend [ADC-0040].
- **Advantage+ sales campaigns** have no ad sets to drill into; read the campaign, then apply the ad spend rule in step 5.

### 4. Ad sets: only where the campaign is not green

Inside a green campaign, leave ad sets and ads alone. Meta shows ads in sequence, so switching off a low-ROAS ad inside a winning ad set can hurt it [ADC-0009]. Judge creative at ad set level, where credit is more reliable than at ad level [ADC-0059].

In amber or red campaigns, list ad sets by spend. Flag any in "Learning limited" and any edited in the last 3 days; do not judge those yet.

### 5. Ads: cut only on the spend rule

A new ad or concept is judged after spending 3 times the target cost per purchase: 3 or more purchases keep, 2 wait, 0 or 1 cut [ADC-0039]. Where purchases are rare, wait for 5 times.

A common habit is to pause an ad with no sale once it has spent 1 times break-even cost. That is too quick: when an ad is expected to make about one sale, it makes none roughly a third of the time by chance. The 3 times rule wins because a zero there is rarely luck. Leave an ad that has spent little alone, however good or bad its early clicks look.

Two warnings, not cut rules:
- Very high click-through with few purchases can be a false winner; check the drop from all clicks to link clicks [MCR-0029].
- Cold-campaign ad frequency above about 2 points to fatigue or too few distinct ads [MCR-0040]; send to `store-meta-creative-review`.

### 6. Decide, with "no change" as the default

| Situation | Call |
|---|---|
| Green campaign, no breakage | Keep. No edit |
| Amber under 7 days of data, or in learning | Keep. Review on the date the 7 days end |
| Red over 7 days, after 3 times target spent | Adjust: propose a budget cut or a pause for the client |
| New ad meets the spend rule's cut line | Cut: propose pausing that ad |
| Green and spending its full budget for 7 days | Flag for `scale-readiness-check`. No raise today |

Big daily budget raises look bad on day one because new buyers take days to convert [ADC-0056]. That is why raises never come from this routine.

### 7. Log every decision, including "no change"

One row per decision: date, platform, level, name, the numbers that triggered it, the rule used, the call, approved by, done at, the prediction ("cost per purchase back under 20 within 7 days"), and the review date. A call with no prediction cannot be graded, so it is not complete.

### 8. Hand over

Send the client a five-line note: store numbers, breakages (or "none"), changes proposed for approval, changes made inside agreed limits, and the next review date.

### 9. India and cash-on-delivery stores

Compare platform purchases with placed orders, not delivered ones, in check 1. Add one daily line: return-to-origin rate on orders delivered yesterday, from the courier export. A jump there means the cost per purchase that matters is worse than the platform shows; flag it, do not cut ads on it in one day.

## Checks before you hand it over

- The breakage table was checked in full and each row has a result.
- Every judgement uses 7-day numbers, not yesterday alone.
- Break-even and target come from the store's card, on the platform's basis.
- No ad inside a green ad set was paused.
- No budget was raised by this routine.
- Every decision, including "no change", has a log row with a prediction and review date.
- Every live change has a client yes or sits inside the written limits.

## Output

**Daily note (five lines):** store orders and net sales against the 7-day average, breakages, proposed changes, changes made, next review date.

**Table "Today's review":** Platform, Level, Name, Spend 7 days, Cost per purchase 7 days, Target, Break-even, Status (green, amber, red), Learning or edited recently, Call, Rule.

**File "decision-log.csv"** (appended daily): Date, Platform, Level, Name, Trigger numbers, Rule, Call, Approved by, Done at, Prediction, Review date, Outcome (filled later), Grade (filled later).

## Common mistakes

- **Acting on yesterday.** Step 3 uses 7 days [ADC-0064].
- **Pausing weak ads in a winning ad set.** Step 4 leaves green ad sets alone [ADC-0009].
- **Calling the last three Google days a drop.** Step 3 uses conversion-time columns [MEA-0051].
- **Break-even from product margin.** Gate 1 uses delivered gross profit [MEA-0023].
- **Raising budgets daily.** Step 6 sends winners to a weekly readiness check instead.
- **A log with no predictions.** Step 7 refuses calls that cannot be graded.

## Sources

- ADC-0009: do not cut low-ROAS ads inside a winning ad set.
- ADC-0023: pause ads on SKUs about to sell out.
- ADC-0028: data integrity first.
- ADC-0039: read new ads after 3 times target cost.
- ADC-0040: keep existing-customer frequency under about 7 a month.
- MEA-0044: target cost can follow measured repeat value.
- ADC-0056: big raises look bad before delayed buyers convert.
- ADC-0059: judge creative at ad set level.
- ADC-0064: daily swings are noise at low spend.
- MCR-0029: high-CTR false winners.
- MCR-0040: frequency above about 2 signals fatigue.
- MEA-0023: product margin is not gross margin.
- MEA-0051: Google credits the click date.

What makes this skill ours: break-even pulled from delivered gross profit, not product margin; breakages and stock first, with "no change" as the default call; a written rule for every cut; and a decision log with predictions so each call can be graded later.
