---
name: google-ads-weekly-routine
description: "A 30-minute weekly routine that keeps a store's Google Ads account clean and profitable: six timed checks in a fixed order (results against break-even on conversion-time columns, tracking against Shopify orders, Merchant Center health and stock, search term waste, budgets and targets, and the change log), each with a pass or fail line and the one change it allows, plus rules for what never to touch week to week. Produces a one-page weekly log the client approves before any change. Read access to check; changes need the client's yes. Use every week on any store running Search, Shopping or Performance Max, after the first 30 days."
---

# Google Ads weekly routine

**You get:** a filled one-page weekly log: six checks, each with the number found, pass or fail, and at most one proposed change, plus a short change list for the client's approval and a line on what was left alone and why. Same order every week, about 30 minutes.

## When to use

- Every week on an account past its first 30 days.
- When a store owner wants a light, repeatable habit instead of a monthly scramble.
- After `google-ads-first-90-days` hands the account over to steady running.
- As the Google part of `weekly-growth-meeting-pack`.

## Not for

- A deep account review: use `google-ads-account-audit` once a quarter.
- Explaining a big drop: use `store-results-drop-diagnosis`; this routine flags it and stops.
- Full search term sorting: use `google-search-term-mining` when check 4 finds a lot.
- Bid strategy and budget redesign: use `google-smart-bidding-budget` monthly.

## What you need

Required (read access, level 1):

1. **Google Ads campaign report**: last 7 days, previous 7 days and last 13 weeks by week, with Cost, Conversions (by conversion time), Conv. value (by conversion time), Impression share, Search lost IS (budget), Search lost IS (rank), Status.
2. **Shopify orders**, last 7 days: count and net sales, test and cancelled orders removed.
3. **Merchant Center**: product issues count and the products out of stock.
4. **Search terms**, last 7 days, all Search, Shopping and Performance Max insights.
5. **Change history**, last 7 days.
6. **Money lines**: break-even ROAS, target ROAS or target cost per purchase, from `store-meta-math`.

Optional: stock report for top sellers, upcoming promotions calendar.

Access: read only for the routine. Proposed changes are applied by the client or with draft or publish access after their yes.

## Before you start: the gates

1. **Money lines exist.** Break-even and target are written at the top of the log. Fail: run `store-meta-math` once, then start.
2. **Tracking verdict.** The last `check-google-ads-conversion-tracking` verdict was "trust" or "trust with caution". Fail: run it; do not change bids on untrusted data.
3. **Change limit.** At most three changes a week across the account, each 20% or less in budget or target (practitioner default, test it). Every change resets some learning; restructures reset more [GAD-0036].

## Steps

### Check 1. Results against break-even (5 minutes)

- Read last 7 days against the previous 7 and the 13-week trend, on conversion-time columns. Click-date columns always make the last 3 to 4 days look weak [GAD-0035] [MEA-0051].
- Split brand and non-brand. Non-brand ROAS against break-even is the number that matters; brand flatters the total [GAD-0003].
- Pass: non-brand at or above target. Watch: between break-even and target. Fail: below break-even for two weeks running.
- A swing of about 10% in revenue can be normal noise when it is a small dip in conversion rate and order value together [MEA-0009]. Only a fail for two weeks, or a drop over 25% in one week, goes to `store-results-drop-diagnosis`.

### Check 2. Tracking sanity (3 minutes)

- Google purchases (primary, conversion time) divided by Shopify orders for the week. Compare with the usual ratio.
- Pass: within the usual range. Fail: above 100% (duplicates) or a sudden fall to near zero (broken tag). On fail, stop all bid and budget changes this week and run `check-google-ads-conversion-tracking`.

### Check 3. Feed and stock (5 minutes)

- Merchant Center disapproved and limited counts against last week. Any new disapproval on a top seller goes to `fix-merchant-center-disapprovals` today; price mismatches are a common cause [GAD-0005].
- Top sellers out of stock or under a week of cover: flag them. A hero product out of stock for a few days can reset Performance Max learning [GAD-0037].
- Any sale or price change next week: confirm the feed update is timed to it.
- If a top product's Shopping click-through fell sharply, check rival prices; a rival discount is a common cause [GAD-0034]. Hand price questions to `track-competitor-prices`.

### Check 4. Search term waste (7 minutes)

- Sort last 7 days' search terms by cost. Take the top 50.
- Add clear waste (wrong product, jobs, free, DIY, wrong country) to the shared negative list, as a proposal for the client.
- Brand terms showing in non-brand campaigns or Performance Max: fix the brand negatives or exclusion.
- Converting terms with no keyword of their own: list them for `build-google-search-campaign` or the next mining run.
- Do not add negatives every day; each change can disturb learning. Weekly is enough after the first month.

### Check 5. Budgets and targets (5 minutes)

For each campaign, apply one rule only:

| Situation | Change allowed this week |
|---|---|
| Spends its full budget and is at or above target | Raise budget by 10 to 15% [GAD-0023] |
| Spends under 80% of budget and misses target | Loosen target ROAS or target CPA a step, not the budget [GAD-0023] |
| Target ROAS set above what the campaign achieves and spend falling | Cut the target to near actual, firmly, not in small steps [GAD-0053] |
| Budget-limited target ROAS or target CPA campaign | Check the target is the one the business wants; since 17 August 2026 these campaigns bid toward the stated target, so a loose old target can drift down to it [GAD-0004] |
| Below break-even for two weeks, tracking trusted | Propose a pause or a cut; hand to `google-smart-bidding-budget` |
| Anything else | No change |

Budget steps stay at about 20% or less on Google [GAD-0042].

### Check 6. Change log and next week (5 minutes)

- Read change history: anything changed by someone else, by auto-apply or by Google's recommendations. Auto-apply should be off [GAD-0042].
- Check last week's changes: did each do what was expected? Mark done, partly or no effect.
- A change proposed twice and not made gets decided this week: do it, drop it or rescope it.
- Write the change list (three at most) for the client's yes.

### Market notes

- Pay-on-delivery and festival markets: count pay-on-delivery orders only once delivered when judging profit; if Google is still counting refused orders, use the store's delivered rate to adjust check 1. Watch the store's festival and peak weeks (Boxing Day, Singles' Day, Ramadan, local holidays) when click costs and conversion rates both move; compare with the same week last year where possible. Add any VAT or goods and services tax on Google invoices to cost unless the store reclaims it.
- US: watch Black Friday to Cyber Monday, when Google can get less efficient while Meta improves in one data set [GAD-0050]; prepare feeds and promotions rather than chasing inflated returns.

### When results dip: the drill before any change

When revenue or ROAS falls, diagnose before touching anything [GAD-6208]:

1. **Read change history** and widen the range to 90 to 180 days in a weekly view, on conversion time. Do not use this on campaigns under about 30 conversions a month; that is noise.
2. **Business level first.** Revenue = sessions x conversion rate x order value: find which moved. If Google is only 10 to 35% of ad spend, check Meta and other channels, the site, an ended sale or offer, and seasonality before blaming Google.
3. **Google level.** Sort campaigns by cost; the cause is almost always in the top five. Find the inflection date, then the ad group or asset group [GAD-6204].
4. **The tree.** Cost per sale = cost per click / conversion rate; clicks = impressions x click-through. Rising cost per click alone is not a problem if conversion rate rose. Conversion rate fell: tracking, page change, audience or search term mix, learning reset, promo ended [GAD-6219]. Impressions fell: lost to budget or to rank [GAD-6213]. Cost per click rose: Quality Score parts, new rivals in auction insights [GAD-6214] [GAD-6220].
5. **By campaign type.** Performance Max: warm drift, brand exclusion broken, disapprovals or stock-outs, target raised [GAD-0037]. Shopping: title changes, Merchant Center warnings, rival price cuts. Search: search term mix, new competitor, target squeeze, Display switched on.
6. **Decide fix, wait or ignore**, default to a fix not a rebuild, one change at a time, and write one sentence: "down because X fell, driven by Y, caused by Z".

## Checks before you hand it over

- All six checks have a number, a pass or fail, and the source export.
- Conversion-time columns were used for the last 7 days.
- Brand and non-brand are read apart.
- Three changes or fewer are proposed, each within the step limit.
- No bid or budget change is proposed in a week tracking failed.
- Last week's changes are marked with their effect.
- No change was applied without the client's yes.
- Any dip note ends with the one-sentence cause and a fix, wait or ignore call.

## Output

1. **One-screen weekly log:**

| Check | Number this week | Last week | Pass or fail | Proposed change | Client yes |
|---|---|---|---|---|---|
| 1 Results (non-brand ROAS against break-even) | | | | | |
| 2 Tracking ratio | | | | | |
| 3 Feed issues and stock | | | | | |
| 4 Search term waste (cost) | | | | | |
| 5 Budgets and targets | | | | | |
| 6 Changes and follow-ups | | | | | |

2. **Change list:** Number, Campaign, Change, From, To, Rule used, Expected effect, Check date.
3. **Left alone:** one line on what was not changed and why.
4. **Escalations:** any item handed to another skill, with the reason.

## Common mistakes

- **Reading the last few days on click-date columns.** Check 1 uses conversion time [GAD-0035].
- **Changing everything at once.** Gate 3 caps changes at three a week.
- **Restructuring after one bad week.** Targeted fixes first [GAD-0036].
- **Raising budget on a campaign that is not spending its budget.** Check 5 loosens the target instead [GAD-0023].
- **Missing a stock-out.** Check 3 flags low cover a week ahead [GAD-0037].
- **Brand making the account look fine.** Check 1 reads non-brand on its own [GAD-0003].
- **Rebuilding after one bad week.** Read change history and the drill first.

## Sources

- GAD-0003: brand flatters blended results.
- GAD-0004: budget-limited target campaigns bid toward the stated target from 17 August 2026.
- GAD-0005: price mismatch is a common disapproval cause.
- GAD-0023: budget up when spending fully at target; loosen target when under-spending.
- GAD-0034: falling Shopping click-through can mean a rival discount.
- GAD-0035, MEA-0051: recent days under-count on click-date columns.
- GAD-0036: targeted fixes before rebuilds.
- GAD-0037: stock-outs and disapprovals hurt Performance Max.
- GAD-0042: auto-apply off; budget steps of about 20%.
- GAD-0050: Black Friday efficiency on Google versus Meta.
- GAD-0053: cut an over-high target ROAS firmly.
- MEA-0009: small revenue dips are often noise.
- GAD-6204: top-down triage by spend.
- GAD-6208: read change history, 90 to 180 days weekly.
- GAD-6213: impressions and clicks falling below budget means bid strength.
- GAD-6214: rising CPC with flat conversion rate.
- GAD-6219: conversion rate fall checklist.
- GAD-6220: compare top search terms before and after.

What makes this skill ours: six checks in a fixed 30-minute order, each with one allowed change, so the account is not over-managed; brand is read apart and results are judged against the store's own break-even on conversion-time columns; tracking failure freezes all bid changes for the week; and festival weeks and pay-on-delivery refusals are built into the reading.

## Selling in India

- Count COD orders only once delivered; if Google still counts refused orders, adjust check 1 with the delivered rate.
- Watch festival weeks (Diwali, Raksha Bandhan), when click costs and conversion rates both move.
- Add GST on Google invoices to cost.
