---
name: add-new-ads-to-live-campaign
description: "A change plan for adding new ads to a Meta campaign that is already working, without knocking its winners back into learning. Takes a snapshot first, sorts every ad set into winning, weak, learning or learning limited, decides where each new ad goes (never into a winning ad set), lists what must not change in the same window, sets the order and timing of edits, and ends with a 72-hour and 7-day watch sheet with a written rollback rule. Covers Advantage+ campaigns, reusing winning posts, page ad limits, and peak sale dates in each market. Use whenever fresh creative goes into a live campaign or tired ads are being replaced."
---

# Add new ads to a live campaign safely

**You get:** one change plan for one live campaign: a before-snapshot, a placement decision for every new ad, a list of settings frozen during the change, the edit order, and a watch sheet with the rollback rule, ready for the client to approve.

## When to use

- New creative is ready and the campaign it belongs in is hitting its target.
- Ads in a live campaign are tiring and need successors without a rebuild.
- An Advantage+ sales campaign needs fresh ads.
- Ads are being relaunched after a pause, a stock-out or a sale.

## Not for

- Building each ad and the 13-point pre-publish check: use `ad-launch-prepublish-check`; this skill decides where and when, that one checks each ad.
- Deciding which ads are tired and what replaces them: use `refresh-a-tired-winning-ad` or `weekly-creative-sprint`.
- Raising or cutting budgets: use `store-meta-budget`. Never in the same window as this change.
- A brand-new campaign: use `build-meta-campaign-launch-sheet`.

## What you need

Required:

1. **Ads Manager export**, last 28 days, ad set and ad level: ad set name, delivery status (Active, Learning, Learning limited), budget, spend, purchases, cost per purchase, frequency, ad ID, post ID.
2. **Account activity log** (Ads Manager, Account settings, Activity history) for the last 14 days: every edit with its date.
3. **Shopify order export** for the same 28 days, to check that Meta's purchases match real orders.
4. **The new ads**: files, text, landing URL, and for each one the concept it belongs to (persona, angle, offer).
5. **Target cost per purchase** from `store-meta-math`.

Optional: Meta's ads-per-Page count, stock per advertised SKU, the sale calendar.

If 2 is missing, ask the client to export it; without it you cannot tell whether an ad set is still settling from the last edit. Reading needs level 1. Adding paused ads needs level 2. Switching ads on, pausing old ads and any rollback need the client's yes.

## Before you start: the gates

1. **Profit and target known.** Pass with a target cost per purchase built from gross profit. Fail: stop; nobody can call a new ad good or bad.
2. **Tracking.** Pass when Meta's purchases track store orders over the last 14 days. Fail: no new ads until `store-meta-capi` is done [ADC-0028].
3. **Quiet period.** Pass when the ad sets you will touch had no edit in the last 7 days (practitioner default, test it). Fail: wait, or touch only ad sets that are quiet.
4. **Stock.** Pass when advertised SKUs have cover for the test window. Selling out mid-test pushes ad sets back into learning [OPS-0019].
5. **Peak dates.** Pass when the change is not in the 5 days before a planned sale or peak season (Black Friday and Cyber Monday, Christmas, Singles' Day, a local festival). Fail: launch earlier or after.

## Steps

### 1. Take the snapshot

Save the 7-day and 28-day numbers for every ad set and ad, plus every setting (budget, bid strategy, event, attribution, audience, exclusions, placements). This snapshot is the rollback point and the baseline the watch sheet compares against.

### 2. Sort every ad set

| Status | Rule |
|---|---|
| Winning | At or under target cost per purchase on 7 days, stable delivery |
| Weak | Over target on 7 days with enough spend to judge (3 x target cost or more) |
| Learning | Ads Manager shows Learning; any edit now restarts its count |
| Learning limited | Not reaching about 50 optimisation events in 7 days [ADC-0066] |
| Starved | Ads inside that got almost no spend |

Under about 1,000 a day of spend, read 7 days or more, never one day [ADC-0064].

### 3. Place each new ad

| New ad is | Where it goes |
|---|---|
| A new concept | Its own new ad set in the same campaign, about 3 variations, with a daily minimum near 1 x target cost per purchase for 7 days [ADC-0007], keeping all test minimums under about 20% of the campaign budget [ADC-0005] |
| A new version of a winning concept | Its own ad set too; never into the winning ad set [ADC-0009] |
| A fix for a weak ad set | Into that weak ad set, replacing its worst ad |
| An old ad that never got spend | A separate holding ad set for a second chance [ADC-0031] |
| Into an Advantage+ sales campaign | New Advantage+ sales campaigns can carry more than one ad set while staying Advantage+ [ADC-6080]; give a new concept its own ad set if the campaign still shows as Advantage+ after the edit, else add it beside the current ads and read it by spend |

Do not touch winning ad sets. Meta sequences ads across a person's views, and new entrants can disturb what already works [ADC-0009].

### 4. Remove look-alikes and check limits

- Near-identical ads are grouped by Meta and reach the same people [MCR-0078]. Each new ad must differ from its nearest live ad on persona, angle, offer or format.
- Keep hooks per body to 2 to 4; dozens spread the budget too thin to learn [MCR-0013].
- Check the Page's active ad count against Meta's limit before adding; at high volume set up extra Pages first [ADC-0045].

### 5. Freeze everything else

During the change window, do not change on the touched ad sets: budget, bid strategy or goal, optimisation event, attribution setting, audience, exclusions, placements. One change type per ad set per window, or nobody can say what moved the numbers. The common "never move budget more than 20%" line has no Meta documentation behind it [ADC-0056], but stacking a budget move on new ads still muddies the read.

### 6. Reuse, do not edit, live winners

Never edit the media or text of a live winning ad: an edited ad is treated as new and reviewed again [ADC-6082]. To run a winner in a new ad set, use its existing post (post ID) so its comments and reactions carry over (practitioner default). Fix an expired code or price by building a new ad, then pausing the old one after the new one delivers.

### 7. Order the edits

1. Build all new ad sets and ads paused (via `ad-launch-prepublish-check`).
2. Client approves the change plan.
3. Switch on new ad sets first, in one sitting, early in the store's day.
4. Pause replaced ads in weak ad sets only after their successors show delivery (24 to 48 hours).
5. Log every edit with its time in the decision log used by `daily-ad-account-review`.

### 8. Watch and roll back

- **At 72 hours:** every new ad delivering or in review; no rejections; winning ad sets' cost per purchase within 30% of the snapshot (practitioner default, test it).
- **At 7 days:** apply the read rule written before launch: after spending 3 x target cost per purchase, 3 or more purchases keep, 2 wait, 0 or 1 cut [ADC-0039].
- **Rollback rule:** if a winning ad set's 3-day cost per purchase runs more than 30% over its snapshot and its spend shifted to new ads, pause the new ads in that campaign and return to the snapshot settings. Ask the client first.
- If one ad takes most of the spend afterwards, that is normal under campaign budget optimisation [ADC-0014]; cap or feed it as `store-meta-budget` decides [ADC-0061].

### 9. Market notes

- **Stores with many failed deliveries or pay on delivery:** judge new ads on confirmed or delivered orders, not placed orders (`meta-ads-for-cod-stores`). A new ad in another of the languages your buyers use is a new concept and gets its own ad set.
- **Peak seasons:** finish adding Black Friday and Cyber Monday or holiday ads at least a week before, so they have delivery history before the peak. Freeze changes in the week before the store's biggest sale days and local festivals.

## Checks before you hand it over

- A dated snapshot exists for every ad set touched.
- No new ad sits inside a winning ad set.
- Each new ad differs from its nearest live ad on a named element.
- No budget, event, audience or attribution change is planned in the same window.
- No live winning ad is edited; winners are reused by post ID.
- The read rule and rollback rule are written with dates before launch.
- The Page's ad count stays under the limit after launch.
- Every switch-on, pause and rollback waits for the client's yes.

## Output

**Summary (one screen):** campaign, ad sets touched and their status, new ads and where each goes, ads to pause later, test spend for 7 days, frozen settings, watch dates, the yes needed.

**Change plan table:** New ad name, Concept, Differs from nearest live ad by, Goes into (ad set), Why, Daily minimum, Replaces (ad), Pause old ad when.

**Watch sheet:** Ad set, Snapshot cost per purchase, 72-hour cost per purchase, 7-day cost per purchase, New ads spend share, Rejections, Keep/wait/cut call, Rollback triggered (Y/N), Client yes date.

## Common mistakes

- **New ads dropped into the winner's ad set.** Step 3 keeps them out [ADC-0009].
- **Budget raised in the same week.** Step 5 freezes it, so the read stays clean.
- **Editing a winning ad to fix a typo.** Step 6 builds a new ad instead [ADC-6082].
- **Calling new ads after one day.** Step 8 waits for spend of 3 x target cost [ADC-0039].
- **Ten near-copies of one idea.** Step 4 removes look-alikes [MCR-0078].
- **No way back.** Step 1's snapshot is the rollback.

## Sources

- ADC-0005, ADC-0007: test ad set minimums and their share of budget.
- ADC-0009: change ads only in underperforming ad sets.
- ADC-0014: budget optimisation concentrates spend in few ads.
- ADC-0028: data before structure and creative.
- ADC-0031: a holding ad set for ads that got no spend.
- ADC-0039: spend-based keep, wait or cut rule.
- ADC-0045: Page ad limits at high volume.
- ADC-0056: the 20% budget rule is not Meta's.
- ADC-0061: when one concept takes most spend.
- ADC-0064: small accounts read on 7 days or more.
- ADC-0066: about 50 events in 7 days.
- ADC-6080: Advantage+ sales campaigns with more than one ad set (proposed card).
- ADC-6082: edited ads are reviewed as new (proposed card).
- MCR-0013: 2 to 4 hooks per body.
- MCR-0078: near-duplicates share one entity.
- OPS-0019: stock-outs force a return to learning.

What makes this skill ours: a dated snapshot that doubles as the rollback point; a placement table that sorts ad sets by status before any ad goes in; a freeze list so new ads are never judged in the same week as a budget move; and winners reused by post ID instead of being edited.

## Selling in India

- Freeze changes in the week before Diwali and the big marketplace sale days.
- In a cash-on-delivery store, judge new ads on delivered orders, and treat a new regional-language ad as its own concept in its own ad set.
