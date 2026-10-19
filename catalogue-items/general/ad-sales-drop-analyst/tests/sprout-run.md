# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

Every number checks out against the export, the chain split is correctly computed and sums to the whole change, and the tracking check comes first with the pause question left to the owner with clear conditions. The owner gets a defensible answer: click rate is the weakest link, the 61% vs 52%/55% offer mismatch is flagged but not blamed for the drop without a change log, and no targets are guessed.

## Judge list

- Met: 1. Cost per sale recalculated correctly for one ad
  "Cost per sale | $26.79 | $76.92" matches 3000/112 and 3000/39.
- Met: 2. First finding is about tracking or sale values
  "1. Counting and reporting delay: check this first." with revenue per sale $34.20 vs $34.21 as evidence values pass consistently.
- Met: 3. Each finding lists at least two possible reasons
  Finding 1: reporting delay or tracking change; Finding 2: (a)(b)(c); Finding 3: (a)-(d); Finding 4: (a)(b)(c); Finding 5 weighs renewal value and margin.
- Met: 4. No 'pause now', nothing changed, no saving promised
  "a person may approve pausing P1" only after target and re-pull; "Proposals only. Nothing has been changed."
- Met: 5. Chain split shares add up to the whole change
  24.3% + 46.3% + 29.4% = 100.0%; log contributions 0.256+0.489+0.310 = 1.055 = ln(2.872).
- Met: 6. Missing data named with what it would have changed
  Ten MISSING lines; "Without targets this review describes only"; "no frequency or placement data was supplied, so none of these is settled."

## What went in

```text
Export (sprout/ad-results.csv, practice numbers), USD.
ad_name,days,spend,impressions,link_clicks,purchases,revenue
P1 Too expensive days 1-21,21,3000,250000,3750,112,3830
P1 Too expensive days 22-42,21,3000,193500,1780,39,1334
Same image ad in both windows. Opening line: "'Sprout is too
expensive': here's 61% off to prove otherwise".

What we know: this headline has 15+ copies live, the most in the
account. The ad says 61% off; the product page shows 52% and 55%.
The $29.99 first order needs the text sign-up discount and renews
at $49.99 every 4 weeks.

Question: P1 cost $26.79 a sale in its first 21 days. Why did it
get so much worse, and should we pause it?

[attached: sprout/product-page.md, sprout/ad-results.csv]
```

## What came out

```text
**Basis**
- **Data:** two rows for one image ad, P1 "'Sprout is too expensive': here's 61% off to prove otherwise". Days 1–21 and days 22–42, USD. These are practice numbers.
- **Context used:** the product page notes (read 30 Sept and 13 Oct 2026) and your notes on duplicate copies, the offer mismatch and the renewal price.
- **Totals:** recalculated from the export. No rates were averaged.
- MISSING: calendar dates of each window
- MISSING: attribution window and how long sales take to report
- MISSING: target cost per sale or target return, and margin
- MISSING: value of renewals at $49.99 every 4 weeks, and refunds
- MISSING: frequency, reach, placement split, learning status
- MISSING: tracking details (browser vs server events, event IDs, deduplication, match score)
- MISSING: store's own orders and revenue for the same dates
- MISSING: change log for the ad, offer and page between the windows
- MISSING: checkout step counts, phone page speed, stock
- MISSING: total budget
- **Without targets** this review describes only. It does not call either period good or bad against a target.

**Recalculated table (USD, practice numbers)**

| | Days 1–21 | Days 22–42 | Change |
|---|---|---|---|
| Spend | $3,000 | $3,000 | 0% |
| Impressions | 250,000 | 193,500 | −22.6% |
| Link clicks | 3,750 | 1,780 | −52.5% |
| Purchases | 112 | 39 | −65.2% |
| Revenue (platform) | $3,830 | $1,334 | −65.2% |
| Cost per 1,000 views | $12.00 | $15.50 | +29.2% |
| Click rate | 1.50% | 0.92% | −38.7% |
| Cost per click | $0.80 | $1.69 | +110.6% |
| Buy rate (purchases / clicks) | 2.99% | 2.19% | −26.6% |
| **Cost per sale** | **$26.79** | **$76.92** | **+187.2% (×2.87)** |
| Revenue per sale | $34.20 | $34.21 | flat |
| Return (revenue / spend) | 1.28 | 0.44 | −65.2% |

**Chain split**

The change in cost per sale is ln(2.872) = 1.055.

| Link | Change | Log contribution | Share |
|---|---|---|---|
| Cost per 1,000 views | ×1.292 | +0.256 | 24.3% |
| Click rate (inverse) | ×0.613 | +0.489 | **46.3%** |
| Buy rate (inverse) | ×0.734 | +0.310 | 29.4% |
| **Total** | ×2.872 | **+1.055** | **100.0%** |

- **Order value:** revenue per sale did not move, so it explains none of the rise.
- **Weakest link:** click rate. All three links worsened.

**Findings, ranked**

1. **Counting and reporting delay: check this first.**
   - **What we saw:** purchases fell 65% while clicks fell 53%. This is not the "steady clicks, fewer sales" pattern. Revenue per sale is identical at $34.20 and $34.21, which suggests purchase value and currency pass the same way in both windows.
   - **What the data can't rule out:**
     - If days 22–42 end near the export date, sales still inside the attribution window may not have reported yet. That would lower the buy rate and part of the 29.4% share.
     - A tracking change between the windows. No event data was supplied to check this.
   - **What to check:**
     - The export date against the window's end date.
     - Store orders for the same dates.
     - Browser vs server purchase events and deduplication in both windows.
     - The match score as the platform reports it.
   - **Proposal:** re-pull days 22–42 once the attribution window has fully closed. Compare the result with store orders before any decision on P1.
   - **Revisit:** when the window closes after day 42.

2. **Fewer clicks per view (46.3% of the rise; −38.7%).**
   - **Possible reasons:**
     - (a) Fatigue. One unchanged image has run for 42 days, so the same people may be seeing it repeatedly.
     - (b) The 15+ near-identical copies of this headline compete for the same people, which wears it out faster.
     - (c) A shift to a placement where people click less.
   - **Evidence for:** clicks fell faster than impressions, which fits (a) and (b).
   - **Evidence against:** no frequency or placement data was supplied, so none of these is settled.
   - **What to check:**
     - Frequency and reach by week.
     - The placement split in both windows.
     - The click rate by week across the 15+ copies.
   - **Proposal:** if frequency rose across the windows, test one fresh opening line as a new ad rather than editing P1. Editing P1 is a big change and would restart learning. Make one change at a time.
   - **Revisit:** after the new ad has a week of delivery.

3. **Fewer buyers per click (29.4%; −26.6%).**
   - **Possible reasons:**
     - (a) Mismatch between the ad's offer and the page. The ad says 61% off. The page shows 52% (announcement bar) and "up to 55%" (badge and pop-up). The $29.99 only applies after the text sign-up, which only the footer explains. The page also says "DISCOUNT AUTO-APPLIED".
     - (b) Once the readiest buyers had converted, later clicks came from less ready people.
     - (c) A page, offer or checkout change between the windows. The page was read on 30 Sept and 13 Oct, but the windows' dates are unknown.
     - (d) Reporting delay (see finding 1).
   - **Against (a) alone:** if the mismatch existed in both windows, it explains a weak buy rate, not a drop. It only explains the drop if something on the page changed.
   - **What to check:**
     - The change log for page and offer edits between the windows.
     - The checkout step counts in both windows.
     - Whether the 61% matches the first buying option on the page.
   - **Proposal:** if the page or offer changed between the windows, line up the ad's offer with the page's default plan box in a new ad. Do this only after finding 2's test, not at the same time.
   - **Revisit:** after the change log is reviewed.

4. **Dearer to be seen (24.3%; +29.2%).**
   - **Possible reasons:**
     - (a) The 15+ copies bid against each other for the same audience.
     - (b) A small or used-up audience.
     - (c) More advertisers bidding in that season. The calendar dates are missing, so this can't be checked.
   - **What to check:**
     - Audience overlap among the copies.
     - Reach over time.
     - The cost per 1,000 views for other ads in the same weeks.
   - **Proposal:** if overlap is high, a person can decide whether to combine the copies into fewer ad sets. That is a big edit and restarts learning. P1's 39 sales in 21 days, about 13 a week, is already below the ~50 a week Meta cites.
   - **Revisit:** after one week of delivery following any merge.

5. **Should P1 be paused? This is the person's decision. Here is what to weigh.**
   - **Platform return:** 1.28 in days 1–21 and 0.44 in days 22–42.
   - **Why neither number settles it:**
     - The revenue reflects a discounted first order. Renewals at $49.99 every 4 weeks are not included.
     - Margin and refunds are missing.
   - **Proposal:** set a target cost per sale that includes renewal value and margin. If the re-pulled days 22–42 (finding 1) still sit above that target, a person may approve pausing P1. Its $3,000 per 21 days could then move to another ad within the stated total, but that total is MISSING.
   - **Revisit:** once the target and the re-pull are both in.

**Not concluded**
- Whether days 22–42 are final, given the possible reporting delay.
- Which single cause drove the click rate drop. Frequency and placement data are absent.
- Whether the 61% vs 52%/55% mismatch caused the buy rate drop or was present throughout.
- Whether either period is profitable. Targets, margin, renewal value and refunds are missing.
- Store-level results. Store orders and revenue were not supplied.
- **Other ads:** comparisons don't hold because the dates, lengths and formats differ. For example, P2 is $50.00 a sale and S1 is $42.11 a sale, both over 30 days.
- Why revenue per sale ($34.20) exceeds the $29.99 first box. It may be tax, shipping or 2-adult orders.

**Score**

The target cost per sale is MISSING, so no period scores are given. This is the review score against the 6 checks.

| Check | Result |
|---|---|
| Rates recalculated, with currency, window and period stated | ✗ The attribution window is missing |
| Counting checked before other reasons | ✓ Checked with the data available |
| Chain split adds up | ✓ |
| No promised outcomes | ✓ |
| Nothing described as changed or paused | ✓ |
| Practice numbers labelled | ✓ |

5 passed of 6. 5 / 6 × 100 = **83 (review score, not a period score)**.

Proposals only. Nothing has been changed.
```
