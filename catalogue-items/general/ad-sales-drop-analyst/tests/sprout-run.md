# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

Every rate is correctly recalculated from the CSV totals, the log-based chain split sums exactly, and the findings lead with counting before blaming the ad or audience. The owner gets a clear, honest answer to "should we pause it" (not yet, here is what to check first) with no invented facts and no pressure to act before targets exist.

## Judge list

- Met: Pick one ad and check its cost per sale yourself (spend divided by purchases). It should match.
  "Cost per sale | $26.79 | $76.92" — 3000/112 = 26.79 and 3000/39 = 76.92, both match.
- Met: The first finding is about tracking or sale values, or it says tracking was checked and why it's fine.
  "1. The counting has not been checked yet, and the latest window is the most exposed to it."
- Met: Each finding lists at least two possible reasons, not one confident cause.
  Finding 1 lists (a)(b)(c); Finding 2 (a)(b)(c); Finding 3 (a)-(d); Finding 4 (a)(b)(c).
- Met: Nothing says "pause now", nothing is changed in the account, and no saving is promised.
  "No pause recommendation from this data." and "Proposals only. Nothing has been changed."
- Met: The chain split's shares add up to the whole change in cost per sale.
  "+0.256 ... +0.489 ... +0.310 ... Total +1.055 100.0%" — ln(2.872)=1.055, logs sum correctly.
- Met: Missing data is named, and the skill says what it would have changed.
  "MISSING: target cost per sale or target return, and margin. Without these I describe the change only."

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
- **Data covered:** one image ad, P1 "'Sprout is too expensive': here's 61% off to prove otherwise". There are two 21-day windows: days 1–21 and days 22–42. All figures are in USD. These are **practice numbers**.
- **Context used:** the product-page notes (sprout/product-page.md) and your notes. Those say there are 15+ copies of this headline, the ad says 61% off while the page shows 52% and 55%, and the $29.99 first order needs the text sign-up and renews at $49.99.
- **Missing:**
  - `MISSING: calendar dates for both windows`
  - `MISSING: attribution window`
  - `MISSING: reporting delay for purchases`
  - `MISSING: target cost per sale or target return, and margin`. Without these I describe the change only. I do not call either window good or bad.
  - `MISSING: browser vs server purchase events, event IDs and duplicate handling, platform match score`
  - `MISSING: change log (ad, offer, page, budget, targeting, tracking)`
  - `MISSING: reach and frequency by week; learning status`
  - `MISSING: store's own orders, revenue and refunds for the same dates; checkout step counts; phone page speed`
  - `MISSING: what the other 15+ copies spent and how many people they reached in the same windows`
  - `MISSING: what the $34.20 per sale includes` (tax, shipping, 2-adult orders?). It is above the $29.99 headline price.

**Recalculated table** (all rates come from totals, practice numbers)

| Measure | Days 1–21 | Days 22–42 | Change |
|---|---|---|---|
| Spend | $3,000 | $3,000 | 0% |
| Impressions | 250,000 | 193,500 | −22.6% |
| Link clicks | 3,750 | 1,780 | −52.5% |
| Purchases | 112 | 39 | −65.2% |
| Revenue (platform-attributed) | $3,830 | $1,334 | −65.2% |
| Cost per 1,000 views | $12.00 | $15.50 | +29.2% |
| Click rate (clicks / views) | 1.50% | 0.92% | −38.7% |
| Cost per click | $0.80 | $1.69 | +110.6% |
| Buy rate (purchases / clicks) | 2.99% | 2.19% | −26.6% |
| **Cost per sale** | **$26.79** | **$76.92** | **×2.87 (+187%)** |
| Revenue per sale | $34.20 | $34.21 | ~0% |
| Return (revenue / spend) | 1.28 | 0.44 | −65.2% |

**Chain split**

Cost per sale = cost per 1,000 views / (1,000 × click rate × buy rate). The total change is ln(2.872) = 1.055.

| Link | Ratio (P2/P1) | Log effect on cost per sale | Share of change |
|---|---|---|---|
| Cost per 1,000 views up | 1.292 | +0.256 | 24.3% |
| Click rate down | 0.613 | +0.489 | 46.3% |
| Buy rate down | 0.734 | +0.310 | 29.4% |
| **Total** | | **+1.055** | **100.0%** |

- Revenue per sale did not move ($34.20 vs $34.21), so smaller orders are not the cause.
- The link that moved most is **click rate**, at about 46% of the rise. No single link explains the change. All three got worse.

**Findings, ranked**

**1. The counting has not been checked yet, and the latest window is the most exposed to it.**
- **Seen:** purchases fell 65% while clicks fell 52%. Clicks did fall too, so tracking alone cannot explain the whole drop.
- **Why buy rate is the sensitive link:** days 22–42 are the most recent days. Any purchases still inside the reporting delay or attribution window would be missing from that window only. That would make buy rate look worse than it is.
- **Possible reasons:**
  - (a) Reporting delay, with late sales not yet credited.
  - (b) A tracking change, such as duplicates removed, a server event lost, or an event renamed.
  - (c) A real fall in buying.
- **Check:**
  - Attribution window and delay.
  - Browser vs server purchase counts by day across both windows.
  - Event names and IDs, and how duplicates are handled.
  - Purchase value and currency.
  - The store's own orders for those dates, kept separate from what the platform claims.
- **Proposal:** re-pull days 22–42 once the attribution window has fully closed for day 42. Do this before deciding anything about the ad.
- **Revisit:** at that re-pull. If buy rate recovers toward 2.99%, the buy-rate finding below shrinks.

**2. Click rate fell 39%, about 46% of the rise.**
- **Seen:** the same image and the same opening line ran for 42 days. Clicks per view went from 1.50% to 0.92%.
- **Possible reasons:**
  - (a) The same people saw it too often (fatigue). This is likely for a static image after 3 weeks, but I can't confirm it without frequency.
  - (b) The 15+ near-identical copies have already shown this headline to the same people, so the opening no longer stops anyone.
  - (c) A placement shift toward lower-clicking placements.
- **Against:** there is no frequency or placement data, so none of these is proven.
- **Check:**
  - Frequency and reach by week for P1 and for the copies combined.
  - Click rate by placement in both windows.
  - Whether click rate fell gradually (points to fatigue) or suddenly (points to an edit or placement shift). Use the change log for this.
- **Proposal:** if frequency rose across the windows while reach flattened, test one fresh opening against this one inside the same budget. Change only the opening, nothing else.
- **Revisit:** after the frequency check. For a new opening, revisit once it has comparable spend.

**3. Buy rate fell 27%, about 29% of the rise.**
- **Seen:** the ad promises 61% off. The page shows a 52% bar, an "up to 55%" badge and a 55% pop-up. The $29.99 needs the text sign-up, which only the footer says, while the page also says "DISCOUNT AUTO-APPLIED". The price renews at $49.99, and the guarantee covers the first order only.
- **Why the mismatch alone doesn't explain the change:** it likely existed in both windows, so it can't by itself explain a drop between them. It may still be why buy rate isn't higher overall.
- **Possible reasons for the drop:**
  - (a) Later clicks came from less ready people once the eager ones in a used-up audience had bought. This fits findings 2 and 4.
  - (b) The page or offer changed during days 22–42. Candidates are the "birthday" price change, the new tie-in flavour tile, discount wording, or the sign-up pop-up. The page was read on 30 Sept and 13 Oct, but the dates of those changes are unknown.
  - (c) A checkout, payment or SMS-code problem, or a slower phone page.
  - (d) Reporting delay (finding 1).
- **Check:**
  - Change log for the page, offer and checkout during the window.
  - Checkout step counts by window.
  - Whether the SMS discount code still applies.
  - Phone page speed since the last theme or app change.
  - Whether the first buying option a phone visitor sees matches "61% off".
- **Proposal:** if the change log shows a page or offer change during days 22–42, put that first. Otherwise propose one test where the ad's offer and the page's first offer match, either by wording or by landing page.
- **Revisit:** after the change-log and checkout check.

**4. Cost per 1,000 views rose 29%, about 24% of the rise.**
- **Seen:** the same $3,000 bought 22.6% fewer views.
- **Possible reasons:**
  - (a) The 15+ copies of this headline are competing for the same people. That raises what each copy pays and is the account's own doing.
  - (b) The audience is being used up.
  - (c) Seasonal competition. The calendar dates are missing, so this can't be tested.
- **What I'm not concluding:** I can't say "the algorithm changed" from this number.
- **Check:**
  - Combined reach and frequency across all copies.
  - Whether the copies target overlapping audiences.
  - Cost per 1,000 views for other ads in the account over the same calendar dates, as a seasonal comparison.
- **Proposal:** if the copies overlap heavily, propose that a person reduce the number of live copies of this headline, inside the current total budget. Make this a separate step from any opening test so the cause stays readable.
- **Revisit:** one to two weeks after any change. Judge on combined results, not on this one ad.

**On "should we pause it?"**
- **No pause recommendation from this data.** There are no targets and no margin, the counting is unverified, and the latest window may be incomplete. The fall is large and is a strong signal to look closer.
- **What the numbers do show:** platform-attributed first-order revenue fell from 1.28× spend to 0.44× spend. Renewals at $49.99 are not in these numbers, so a return below 1 on first orders is not automatically a loss. Equally, a return above 1 was not automatically a profit.
- **Proposed sequence, one change at a time:**
  1. Re-pull after the window closes.
  2. Check frequency and the change log.
  3. If cost per sale is still well above your target once targets are supplied, and frequency is high, a person decides whether to pause P1 or consolidate the copies.
- **Learning status:** 39 purchases in 21 days is well under the roughly 50 a week Meta cites for leaving learning. An edit is unlikely to cost learning progress, but frequent edits still blur the cause.

**Not concluded**
- Whether either window met target. `MISSING: targets, margin`.
- Whether any of the 65% fall in purchases is a counting artefact.
- Whether fatigue, copies competing or season is behind the higher cost per 1,000 views and lower click rate. There is no frequency, overlap or date data.
- Whether the 61% vs 52%/55% mismatch, the SMS requirement or a page change caused the buy-rate drop, rather than just limiting buy rate in both windows.
- Store-level profit. There are no store orders, refunds or renewal rates for these customers.

Proposals only. Nothing has been changed.
```
