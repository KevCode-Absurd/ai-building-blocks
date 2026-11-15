---
name: google-ads-account-audit
description: "A deep, Google-only audit of an online store's Google Ads account from standard CSV exports and screenshots, with no developer token or paid tool. Grades ten areas A to F (conversion tracking, settings leaks, brand versus non-brand, structure, bidding, Performance Max, product feed, search terms, product profit, recent changes) with evidence for each check, then ranks every fix by monthly gross profit at stake using the store's own margins, not ROAS. The overall grade can never beat the tracking grade. Ends with a change list the client approves. Use when taking over an account, when Google results slip for weeks, before raising Google spend, or once a quarter."
---

# Google Ads account audit for a store

**You get:** a Google Ads scorecard grading ten areas A to F, a ranked findings table with gross profit at stake, a product profit table, a numbered change list for approval and an audit CSV.

One graded view of what is wrong in the Google account and what each problem costs the store in gross profit, deep enough to act on line by line. Everything here works from the free Google Ads interface and Merchant Center; scripts or the API are an optional speed-up. It recommends; the client applies changes in the Google Ads interface or Editor.

## When to use

- Taking over an account from another buyer or agency.
- Google cost per purchase has drifted up for two weeks or more.
- Before raising Google spend.
- Quarterly health check.

## Not for

- Sorting search terms into negatives and new keywords in depth: use `google-search-term-mining`.
- One quick 0 to 100 health score across Meta, Google and TikTok together: use `paid-ads-health-score`, which can take this skill's grades as its Google part. A Meta account: use `store-meta-audit`.
- Comparing Google with Meta and the store's total: use `blended-channel-profit-view`.
- Turning the findings into a funding case: use `audit-to-action-deck`.

## What you need

Required (read access, level 1; the client adds you with read-only access or sends exports):

1. **Campaigns report**, last 90 days by week: Campaign, Campaign type, Status, Budget, Bid strategy type, Target CPA or ROAS, Cost, Impressions, Clicks, Conversions, Conv. value, Conversions (by conv. time), Search impr. share, Search lost IS (budget), Search lost IS (rank).
2. **Goals, Conversions, Summary** screenshot: every conversion action, primary or secondary, source, value setting, count setting, enhanced conversions status.
3. **Search terms report**, last 90 days, all campaigns including Performance Max search term insights.
4. **Products report** (Shopping and Performance Max): Item ID, Title, Cost, Clicks, Conversions, Conv. value.
5. **Change history**, last 90 days, and the auto-apply recommendations settings page.
6. **Merchant Center**: Products diagnostics (disapproved and limited items with reasons), and feed settings (currency, country, automatic item updates).
7. **Shopify order export** for the same 90 days with UTM or landing site fields, and **gross profit per order** by product group from `store-meta-math`.

Optional: Performance Max channel performance report where available, Auction insights, Google Search Console brand query data.

If an export is missing, ask once; then grade that area "not graded" and lower the overall confidence.

Access: level 1 for the audit. Level 2 to draft changes (paused campaigns, drafts and experiments). Every live change needs a client yes, or written level 3 limits.

## Before you start: the gates

1. **Gross profit per order known by product group.** Fail: grade the areas, but rank fixes by spend at stake only and label it so. ROAS alone cannot rank fixes: the highest-ROAS product can earn the least [ADC-0022].
2. **Cash and limits stated.** Fail: no fix that raises spend goes on the change list.
3. **Tracking trusted.** Area 1 is the gate. If it grades F, the overall grade is F, and tracking is the only change on the list until fixed.

## Steps

### Grading scale (practitioner defaults, test them)

A: no material issue. B: minor, under 2% of monthly spend or gross profit at stake. C: 2 to 10%. D: over 10%. F: broken, blocks reliable decisions.

Grades follow money at stake, not counts of failed checks: ten small misses can matter less than one leak. Overall grade = the same bands applied to total money at stake across all areas, and never better than the tracking grade.

Some popular checks are left out on purpose, because they do not track store profit: Google's optimization score, single-keyword ad groups, a minimum number of negative keywords, headline counts or ad strength, and device bid adjustments on smart bidding. Note them only if they cause a real leak.

### 1. Conversion tracking

- Exactly one primary purchase action. GA4-imported purchases as primary undercount by about 20% against the Google Ads tag or Shopify app, and two primaries double count [MEA-0017]. GA4 as primary is a common leak [GAD-0042].
- Value is the real order value per purchase, not a fixed number; enhanced conversions on [MEA-0016].
- "All conv." far above "Conversions" (more than half again, practitioner default) means secondary actions fire heavily; check none of them feed bidding.
- Google purchases versus Shopify orders with Google UTMs or gclid, week by week: stable and explained, or not.

### 2. Settings leaks

Display network switched on inside Search campaigns, broad match on Maximize clicks, and auto-apply recommendations left on are the usual leaks [GAD-0042]. Also check location targeting is set to people in the target countries, not people interested in them (Google Ads documentation), and whether search partners are on for non-brand campaigns; keep them only if their segment shows purchases at target. Flag any campaign that spent over 2 times the target cost per purchase in 30 days with no purchase, practitioner default.

### 3. Brand versus non-brand

- Brand runs in its own campaigns, with exact brand negatives on every non-brand Search, Shopping and Performance Max campaign [GAD-0028].
- Brand excluded from Performance Max; brand often takes about 11% of search spend but 34% of conversions, inflating blended ROAS [GAD-0003].
- Brand share of Google spend; one practitioner keeps it at 3 to 8% and never above 10% [GAD-0024]. A store's own holdout result beats that rule.

### 4. Structure

Default to consolidation; split only for brand versus non-brand, geography, clearly different margins or distinct categories [GAD-0043]. In Standard Shopping, segment by margin tier when margins spread widely, by ROAS tier when they sit within about 10 points [GAD-0040]. Shopping usually deserves most store spend, as image, price and title filter buyers before the click [GAD-0054].

### 5. Bidding

- Strategy fits volume: manual CPC or Maximize conversion value to start, target ROAS at 30 to 50 monthly conversions [GAD-0021].
- Target versus actual: a target above what the campaign achieves shrinks reach toward zero [GAD-0053]. Since 17 August 2026, budget-limited target ROAS and CPA campaigns bid toward the stated target, so a loose target drags results down to it [GAD-0004].
- Targets set from the store's break-even ROAS on Google's basis, not habit.
- Lost impression share: to budget means money is the limit; to rank means bids, ads or feed are.
- A grade of C or worse here goes to `google-smart-bidding-budget` for the target-by-target fix.

### 6. Performance Max

- Preconditions: clean feed, working purchase tracking, enough daily budget and 30 to 50 monthly conversions [GAD-0026]; a new account adds it only after about 100 recorded purchases [GAD-0033].
- Channel drift: clicks up while ROAS falls can mean spend moved to YouTube and Gmail, where opening an ad counts as a click [GAD-0055]. Fix by going feed-only [GAD-0048].
- Declines usually trace to drift toward warm buyers, feed disapprovals or stock-outs, or a raised target [GAD-0037].
- A grade of C or worse here goes to `google-pmax-diagnostics` for the channel split and brand-exclusion test.

### 7. Product feed and Merchant Center

- Disapprovals and limited items on bestsellers. Price mismatch between feed and page is a top cause; with changing prices, update the feed often and turn on automatic item updates [GAD-0005].
- Titles lead with searched attributes, brand last, about 120 characters [GAD-0009]; rewrite with terms proven in the search terms report and roll out gradually [GAD-0044].
- Price, title and main image drive most Shopping results [GAD-0019].
- One feed per currency when selling abroad [GAD-0049].

### 8. Search terms

Measure the share of non-brand spend on terms with no purchase in 90 days and spend above 2 times the target cost per purchase, practitioner default. Grade on that share. Hand the term-by-term work to `google-search-term-mining`.

### 9. Product profit

From the Products report and the store's gross profit per product group: contribution per product = conversions x factor x gross profit per order minus cost. List products that lose money at current spend and products that earn but are starved. Maximizing conversions sends money to the cheapest sale, not the most profitable [ADC-0022].

### 10. Recent changes and stability

From change history: count significant changes per campaign per month. A decline met by rebuilds resets learning and can start a spiral; targeted fixes first [GAD-0036]. Read the last 3 to 4 days on conversion-time columns; the default credits the click date [GAD-0035].

### 11. Rank fixes by gross profit at stake

Per finding: monthly gross profit at stake = affected spend or conversions x the gap x gross profit per order, with the method in one line. Rank by that, then by effort. Each fix states what changes, the expected effect as a range, the risk (for example "resets learning for 2 weeks") and the review date.

### 12. Tax, currency and pay-on-delivery checks

Check the feed price matches the page price in the store's own currency: including VAT or goods and services tax where prices are shown with tax (UK, EU, Australia), and before sales tax in the US and Canada. Check that shipping and any pay-on-delivery terms in Merchant Center match the store. Where pay on delivery is common, use gross profit per placed order after failed-delivery losses in step 9. For mixed-language queries, see `google-search-term-mining`.

### 13. Structure traps and the fewest-campaigns map

Add these structure checks to the audit, each with money at stake:

- **Minimum structure.** Under about 30 conversions a month across the account, keep the fewest campaigns: brand, one non-brand Shopping, perhaps one Search. Three campaigns with 50, 20 and 10 conversions each learn alone; merged into one with 90 they usually do better [GAD-6151]. At most two campaigns on 10,000 a month and three to five under 50,000 [GAD-6222].
- **Every extra campaign needs a reason**: brand versus non-brand, country, different margin or efficiency goal, distinct category, clearance or new arrivals [GAD-6171]. Name the campaign each orphan merges into.
- **Traps:** Standard Shopping at Low priority next to Performance Max; about 200 products in one campaign on a small budget; one Performance Max asset group for a varied catalogue; listing groups never customised.
- **Asset groups:** one per product type with its own listing group, at least 15 products each and 3 to 20 groups in total [GAD-6149]. Asset rule of thumb: 15 or more images, 5 or more videos, refreshed every 4 to 6 weeks.
- **Cold-campaign brand leakage:** for each non-brand Search, Shopping, Performance Max and Demand Gen campaign, the share of its spend and conversions coming from brand queries [GAD-6183].
- **Portfolio bidding** where campaigns must stay apart but need shared learning or a CPC cap, for example where niche clicks run 10 to 30 [GAD-6164].
- **Learning.** Smart bidding leaves learning after about 50 conversions or 3 buying cycles; do not call a young campaign broken [GAD-6193].
- **Naming:** type, country, focus, bid strategy (for example Shopping-UK-Bestsellers-MaxValue).

## Checks before you hand it over

- Every area has a letter grade with at least one evidence line (export row, screenshot, date), or "not graded" with the reason.
- The overall grade is no better than the tracking grade.
- Every fix carries monthly gross profit at stake with its method, or is labelled "spend at stake only".
- No fix contradicts the tracking verdict.
- Recommendations respect the stated spend limit.
- No step needed a developer token or a paid tool.
- Nothing is shown as done; every change waits for a client yes.
- Every campaign has a written split reason or a named merge target.

## Output

**Summary, one screen:** overall grade, tracking verdict, the three fixes with the most gross profit at stake (monthly, likely value), and whether the account can take more spend now, after fixes, or not yet.

**Table "Scorecard":** Area, Grade, Evidence, Money at stake per month.

**Table "Findings":** Rank, Area, Finding, Evidence, Gross profit at stake per month (method), Fix, Effort, Risk, Review date.

**Table "Product profit":** Item ID, Title, Cost, Conversions, Store-basis orders, Gross profit per order, Contribution, Action.

**Change list for approval:** numbered, each item small enough for a yes or no, with access needed.

**File:** `google-ads-audit.csv` plus the scorecard in a Google Sheet.

## Common mistakes

- **Ranking fixes by ROAS.** Step 11 ranks by gross profit at stake.
- **Grading everything else while tracking is broken.** The overall grade cannot beat tracking.
- **Calling the last 3 days a decline.** Step 10 uses conversion-time columns [GAD-0035].
- **Rebuilding the account to fix a dip.** Step 10 prefers targeted fixes [GAD-0036].
- **Trusting Performance Max's ROAS without checking channel drift.** Step 6 checks it [GAD-0055].
- **Brand mixed into prospecting.** Step 3 separates it [GAD-0003].
- **Leaving Standard Shopping at Low priority beside Performance Max.** Performance Max then takes the cold traffic it should not.

## Sources

- ADC-0022: maximise-conversions favours the cheapest sale.
- GAD-0003, GAD-0024, GAD-0028: brand separation and share.
- GAD-0004, GAD-0021, GAD-0053: bidding rules.
- GAD-0005, GAD-0009, GAD-0019, GAD-0044, GAD-0049: feed quality.
- GAD-0026, GAD-0033, GAD-0037, GAD-0048, GAD-0055: Performance Max.
- GAD-0035, GAD-0036: click-date lag; targeted fixes.
- GAD-0040, GAD-0043, GAD-0054: structure.
- GAD-0042: common leaks.
- MEA-0016, MEA-0017: real values and one primary purchase action.
- GAD-6149: asset group sizes.
- GAD-6151: consolidation beats segmentation.
- GAD-6164: portfolio bidding.
- GAD-6171: split reasons.
- GAD-6183: check cold search terms for brand.
- GAD-6193: learning exit.
- GAD-6222: campaign count by budget.

What makes this skill ours: everything from standard exports with no developer token; an overall grade that can never beat the tracking grade; fixes ranked by monthly gross profit at stake from the store's own margins; and a product profit table that shows which items lose money at current spend.

## Selling in India

- Check the feed price matches the page price including GST, in rupees, and that COD terms in Merchant Center match the store.
- Use gross profit per placed order after RTO losses in step 9.
- For Hindi and mixed-language queries, see `google-search-term-mining`.
