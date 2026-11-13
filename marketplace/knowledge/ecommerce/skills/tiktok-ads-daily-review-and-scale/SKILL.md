---
name: tiktok-ads-daily-review-and-scale
description: "A 15-minute daily check of a store's TikTok ads that first looks for breakages (spend stopped, ads rejected, purchases not reaching TikTok, advertised stock running out), then corrects TikTok's purchase count with a weekly store-truth factor from Shopify orders, and makes scale, hold or cut calls per ad group and ad from rolling 3 and 7-day numbers against the store's own break-even. Protects ad groups still learning, sizes budget steps, checks the cost of the extra purchases after each raise, flags tired ads, and logs every change with a prediction and review date. Use every working day once TikTok ads spend daily."
---

# TikTok ads daily review and scaling

**You get:** a daily review note (breakages found, store-adjusted numbers, and a scale, hold or cut call for every ad group and every ad over its test spend) plus a change list for approval and a running decision log, in 15 minutes a day.

## When to use

- TikTok ads spend every day and someone needs to watch them.
- TikTok reports good ROAS but the store's sales do not show it.
- The owner wants to raise TikTok spend safely.
- Ad groups keep getting edited and never leave learning.

## Not for

- Meta and Google daily reviews: use `daily-ad-account-review`.
- Testing new creative: use `tiktok-ads-creative-testing`.
- TikTok Shop GMV Max campaigns: use `tiktok-shop-gmv-max-ads`.
- A sudden large drop across channels: use `store-results-drop-diagnosis`.

## What you need

Required (read access, level 1):

1. **TikTok Ads Manager** report by ad group and ad, today, last 3 days, last 7 days: spend, impressions, CPM, CTR, add to cart, purchases, purchase value, learning status, delivery status.
2. **Shopify orders** for the same days, with UTM source and campaign, so orders from TikTok traffic can be counted.
3. **Break-even and target cost per purchase** from `store-meta-math`.
4. **Stock** for each advertised SKU and its reorder lead time.
5. **The decision log** from earlier days.

Optional (needed for step 9): post-purchase survey answers, the pre-launch baseline of new customers and blended cost per new customer, Meta and Google results for the same days (to spot halo or shifts), TikTok account notices.

Making changes needs level 3 within written limits (maximum daily budget, maximum raise per step, which actions are allowed), or level 2 with each change approved. Anything outside the limits needs a fresh yes, using `ad-change-approval-gate`.

## Before you start: the gates

1. **Break-even is known** from delivered costs. Fail: report only breakages until it is computed.
2. **Tracking is roughly right.** TikTok purchases and store orders from TikTok traffic are within a believable range of each other this week. Fail: no scale calls; run `tiktok-pixel-and-events-api-check`.
3. **Limits are written.** Fail: work at level 2 and put every change in the approval list.
4. **Data is enough.** An ad group with under about $50 spend or 1,000 impressions gets no call [ADC-0037]. Fail: hold.

## Steps

### 1. Look for breakages first (5 minutes)

| Check | If it fails |
|---|---|
| Spend running in every active ad group | Check payment, account notices, budget caps |
| Ads rejected or limited | Read the reason; fix or replace |
| TikTok purchases today vs store orders from TikTok traffic | A sudden gap means tracking broke; stop scale calls |
| Advertised SKUs in stock | Pause or hold ads on SKUs out of stock or below lead time [ADC-0023] |
| Landing page loads and checkout works | Escalate to the site owner |

Most days, if nothing is broken, the right answer is few or no changes.

### 2. Apply the store-truth factor

Once a week, work out: store-truth factor = store orders from TikTok traffic (UTM or ttclid) over 7 days / TikTok-reported purchases over the same 7 days. Each day, adjusted cost per purchase = TikTok cost per purchase / factor.

The factor will be below 1 on most accounts. Also check the survey: TikTok's share of "how did you hear" answers should be near its share of spend [MEA-0045]. A new channel's effect can also show as better Meta results while TikTok looks weak [MEA-0040]; note any such pattern before cutting.

### 3. Read the right window

Use rolling 3-day and 7-day numbers, never today alone. Below about $1,000 a day of spend, daily swings are noise [ADC-0064]. Leave ad groups in learning alone: they need roughly 25 results in 7 days to settle [ADC-0063], and edits restart the clock.

### 4. Call each ad group

| Call | Rule (adjusted 7-day cost per purchase) |
|---|---|
| Scale | At or under target, out of learning, stock covers more than lead time, and the last raise held |
| Hold | Between target and break-even, or in learning, or a raise was made in the last 48 to 72 hours |
| Reduce | Above break-even on two reads in a row: cut budget by about a third |
| Pause | Above break-even for 7 days after learning, or a stock or policy problem |

Step size: raise about 20 to 30% at a time, then wait 48 to 72 hours (practitioner default, test it). There is no platform rule behind fixed percentage limits [ADC-0056]; the real limit is the cost of the extra purchases.

**Too many thin ad groups.** The learning bar per ad group is about 25 x allowed cost per purchase / 7 a day [ADC-0063]. When several test ad groups sit below it and stay in learning, propose merging them: fewer ad groups, each funded to the bar, with the concepts as ads inside. Show the arithmetic in the change list.

### 5. Check the cost of the extra purchases

After each raise, compare: extra spend / extra store-adjusted purchases. If that marginal cost is above break-even, step back to the last good budget even if the average still looks fine; in one account a 25% raise kept the average under target while the extra buyers cost far more [ADC-0049]. When stock is tight, hold winners at a steady budget so they last; when stock must clear, push harder [ADC-0012].

### 6. Call each ad

- Ads that spent three times the allowed cost per purchase with no purchase: pause [ADC-0039].
- Ads whose CTR has fallen by about a third from their own 7-day best while CPM is steady: mark tired and send to `tiktok-ads-creative-testing` for a refresh (practitioner default, test it).
- Do not pause a lower-performing ad inside an ad group that is meeting target just to tidy up; change ads in ad groups that are missing target. This is documented practice on Meta [ADC-0009] and a practitioner default on TikTok; test it.

### 7. Write the change list

Each change: ad group or ad, current setting, new setting, rule that triggered it, expected result, review date. Inside written limits at level 3, make it and log it. Otherwise, send for approval.

### 8. Log and review

Every decision goes into the log with a prediction ("adjusted cost per purchase stays under X at the new budget by day 3"). Each day, first review decisions due that day: right, wrong or too early. Hand the log to `recommendation-scorekeeping` monthly.

Weekly: recompute the store-truth factor, check new-customer cost from `new-customer-cost-by-channel`, and read the 90-day value bands for TikTok buyers: under 1 loses money, 2 to 3 is the zone to scale [MEA-0024].

### 9. Make budget verdicts on two reads that agree

A verdict on TikTok's budget (a raise past the written limits, or the day-30 or month-end call) needs at least two of these to agree:

1. Store-adjusted cost per new customer from step 2. UTM-tagged orders miss view-through, in-app browser and cross-device buyers, so this is a floor, never the verdict alone.
2. TikTok's survey share against its spend share [MEA-0045].
3. Blended cost per new customer across all paid channels against the pre-launch baseline, other channels held steady [MEA-0040].
4. A geo or time holdout.

If the reads disagree, hold budget and run a holdout before raising or cutting.

## Checks before you hand it over

- Breakage checks ran before any performance call.
- Every cost figure is store-adjusted, with the factor's date.
- No call on ad groups under $50 or 1,000 impressions.
- No edits to ad groups still learning.
- Every raise is within the written step and daily limits.
- Marginal cost was checked after the last raise.
- Every change has a rule, a prediction and a review date.
- Pass: test ad groups are funded to the learning bar, or a merge is proposed. Fail: many thin ad groups left alone.
- Pass: a budget verdict cites two reads that agree. Fail: it rests on UTM-tagged orders alone.
- Nothing outside limits went live without the owner's yes.

## Output

**Daily note** (one screen): breakages found and fixed; account spend and adjusted cost per purchase (3-day and 7-day) against target and break-even; calls (scale, hold, reduce, pause) with counts; decisions due for review today and their grades.

**Change list** (`tiktok-changes-<date>.csv`): Item, Level (ad group or ad), Current, New, Rule, Expected result, Review date, Approved by, Done at.

**Decision log** (`tiktok-decision-log.csv`): Date, Item, Change, Prediction, Review date, Outcome, Grade.

**Weekly line:** store-truth factor, survey share vs spend share, TikTok new-customer cost, blended new-customer cost vs the pre-launch baseline, 90-day value band, and whether the reads agree.

## Common mistakes

- **Trusting TikTok's purchase count.** Step 2 adjusts it with store orders.
- **Reacting to one day.** Step 3 reads 3 and 7 days.
- **Editing during learning.** Step 3 protects learning ad groups.
- **Scaling on average cost.** Step 5 checks the extra purchases' cost.
- **Scaling into a stock-out.** Step 1 checks stock first.
- **Tidying winners.** Step 6 leaves ads in a working ad group alone.
- **No memory of past calls.** Step 8 grades predictions.
- **Test money spread thin.** Step 4 merges ad groups below the learning bar.
- **Judging TikTok on UTM orders alone.** They under-count; step 9 needs two reads that agree.

## Sources

- ADC-0012: push or hold winners by stock and cash.
- ADC-0009: leave ads alone in ad groups that hit target (Meta).
- ADC-0023: tie targets to days of stock.
- ADC-0037: no call before $50 or 1,000 impressions.
- ADC-0039: pause after three times target cost with no purchase.
- ADC-0049: scale on marginal, not average, cost.
- ADC-0056: fixed budget-raise limits lack platform backing.
- ADC-0063: TikTok learning settles after about 25 results or 7 days.
- ADC-0064: small accounts swing daily.
- MEA-0024: time-bound profit to cost bands.
- MEA-0040: a new channel's effect can show elsewhere.
- MEA-0045: survey share should track spend share.

What makes this skill ours: breakages and stock are checked before any performance call; TikTok's purchases are corrected by a weekly store-truth factor from Shopify orders; raises are judged on the cost of the extra purchases, not the average; every change carries a prediction that is graded later; and budget verdicts need two agreeing reads, never UTM orders alone.
