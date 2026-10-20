# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

Every number is recalculated correctly from the export, the chain split is sound and names click rate as the weak link, and the counting check comes first. The owner gets a clear, honest answer that a pause can't be decided without a target and a re-pull, with no invented facts and no promises.

## Judge list

- Met: Pick one ad and check its cost per sale yourself; it should match.
  "Cost per sale (spend / purchases) $26.79 | $76.92": 3000/112 = 26.79 and 3000/39 = 76.92. Both match.
- Met: The first finding is about tracking or sale values, or says tracking was checked and why it's fine.
  "1. Counting is unverified, so check it before trusting the 39." with attribution window, browser/server events and UTM-tagged orders to check.
- Met: Each finding lists at least two possible reasons, not one confident cause.
  Findings 1–3 each give (a), (b), (c); finding 4 gives three reasons the data cannot settle a pause.
- Met: Nothing says pause now, nothing changed, no saving promised.
  "a person reduces or pauses P1 only if both of the following hold" and "Proposals only. Nothing has been changed." No savings claimed.
- Met: The chain split's shares add up to the whole change in cost per sale.
  "+0.256 / +0.489 / +0.310 ... Total 2.872, +1.055, 100%"; 24.3+46.3+29.4 = 100, ln(2.872)=1.055 checks.
- Met: Missing data is named, and the skill says what it would have changed.
  "Whether P1 is profitable in either window: no target, margin, refunds or renewal data"; "Frequency is MISSING, so this is unconfirmed."

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
- **Covers:** one image ad, P1 "'Sprout is too expensive': here's 61% off to prove otherwise". It spans two 21-day windows (days 1–21 and days 22–42) with the same $3,000 spend in each. Amounts are in USD. These are **practice numbers** (sprout/ad-results.csv).
- **Context used:** sprout/product-page.md, plus your notes about the 15+ copies, the 61% vs 52%/55% gap and the $29.99 price needing the SMS sign-up.
- **MISSING:**
  - target cost per sale or target return, and margin
  - calendar dates
  - attribution window and reporting delay
  - browser vs server purchase events, event IDs, deduplication and match score
  - reach and frequency by window
  - learning status
  - change log for ad, page, offer and budget
  - store orders and refunds for the same dates
  - checkout step counts
  - phone page speed
  - which of the 15+ copies ran in which window

**Recalculated table** (every figure is worked from its totals)

| | Days 1–21 | Days 22–42 | Change |
|---|---|---|---|
| Spend | $3,000 | $3,000 | 0% |
| Impressions | 250,000 | 193,500 | −22.6% |
| Link clicks | 3,750 | 1,780 | −52.5% |
| Purchases | 112 | 39 | −65.2% |
| Revenue (platform) | $3,830 | $1,334 | −65.2% |
| Cost per 1,000 views (3,000 / impr × 1,000) | $12.00 | $15.50 | +29.2% |
| Click rate (clicks / impr) | 1.50% | 0.92% | −38.7% |
| Buy rate (purchases / clicks) | 2.99% | 2.19% | −26.6% |
| Cost per click | $0.80 | $1.69 | +110.7% |
| **Cost per sale (spend / purchases)** | **$26.79** | **$76.92** | **×2.87 (+187%)** |
| Revenue per sale | $34.20 | $34.21 | ≈0% |
| Return (revenue / spend) | 1.28 | 0.44 | −65.2% |

**Chain split**

Cost per sale = cost per 1,000 / (1,000 × click rate × buy rate). The shares below come from the logs of each period-2 ÷ period-1 ratio.

| Link | Ratio | ln (push on cost per sale) | Share |
|---|---|---|---|
| Dearer to be seen (cost per 1,000) | 1.292 | +0.256 | 24.3% |
| Fewer clicks per view (1 / click-rate ratio) | 1 / 0.613 | +0.489 | **46.3%** |
| Fewer buyers per click (1 / buy-rate ratio) | 1 / 0.734 | +0.310 | 29.4% |
| **Total** | **2.872** | **+1.055** | **100%** |

The check holds: ln(76.92 / 26.79) = ln(2.872) = 1.055. Revenue per sale did not move, so smaller orders play no part.

**Findings, ranked**

1. **Counting is unverified, so check it before trusting the 39.**
   - **What I saw:** clicks fell 53% and purchases fell 65%. This is not the "steady clicks, fewer sales" pattern, so the drop in sales is partly real. However, days 22–42 is the most recent window, so it is the one most exposed to reporting delay.
   - **Possible reasons:**
     - (a) Late-reported purchases are not yet counted.
     - (b) A browser/server deduplication or event change happened mid-flight.
     - (c) A genuine drop.
   - **What to check:**
     - the attribution window and when the export was pulled
     - browser vs server purchase counts by window
     - store orders tagged to P1's UTMs for the same dates
   - **Proposal:** re-pull days 22–42 once the delay period has passed. Do this before any pause decision.
   - **Revisit:** at the re-pull.

2. **Click rate is the biggest link: 46% of the rise, 1.50% → 0.92%.**
   - **What I saw:** click rate fell, and fewer impressions were bought for the same money. That fits an audience that has seen this message too often.
   - **Possible reasons:**
     - (a) **Fatigue.** The same people saw the same image repeatedly. Frequency is MISSING, so this is unconfirmed.
     - (b) **Self-competition.** The 15+ copies of this headline, the most in the account, chase the same people. That would also raise cost per 1,000 (24% of the rise).
     - (c) **Placement or audience shift** between windows.
   - **Evidence against fatigue alone:** no frequency data, and no dates showing when the other copies launched.
   - **What to check:**
     - frequency and reach by week for P1
     - audience overlap and the launch dates of the 15+ copies
     - the placement breakdown
   - **Proposal:** if frequency rose and the copies overlap, a person consolidates the copies into fewer ads within the same total budget. This is one change, made once, so learning resets only once.
   - **Revisit:** 7 days after any approved change, or after about 50 purchases on the consolidated ad set, whichever comes later.

3. **Buy rate fell 2.99% → 2.19%, which is 29% of the rise.**
   - **What I saw:**
     - The page offer does not match the ad: the ad says 61%, while the page shows 52%, "up to 55%" and a 55% pop-up.
     - $29.99 needs an SMS sign-up and renews at $49.99.
     - The guarantee covers the first order only.
   - **Why this does not settle the drop:** this mismatch probably existed in both windows, so on its own it explains a low buy rate, not a falling one.
   - **Possible reasons for the fall:**
     - (a) A page or offer change mid-flight. The "birthday" price cut and the page reads on 30 Sept and 13 Oct suggest the page moves, but the change log is MISSING.
     - (b) Later clicks come from less-ready people once the readiest have bought.
     - (c) A checkout or SMS-step failure.
   - **Account context (different dates and formats, rough only):** other "61% off" ads also convert weakly. P2 has a 2.45% click rate but only a 0.90% buy rate. S1 converts at 2.38%. This points to the 61% promise attracting clicks that the page does not honour.
   - **What to check:**
     - the change log for page, price and offer across days 1–42
     - checkout step counts by window
     - whether the SMS discount actually applies
     - phone page speed
   - **Proposal:** a person aligns the ad's number with the first price on the page (or the reverse), as a separate test. Do this only after finding 2 is resolved, so the cause stays readable.
   - **Revisit:** 14 days after the change.

4. **Should you pause it? There is not enough here to say.**
   - **What I saw:** at $76.92 a sale and a 0.44 return on platform revenue, days 22–42 is P1's worst window. It is also worse than every ad in the export except R1 ($100.00). For reference: T1 $21.21, H1 $29.55, K1 $34.92, F1 and W1 $39.13, S1 $42.11, P2 $50.00. Those cover different windows and formats.
   - **Why the data cannot settle it:**
     - There is no target cost per sale and no margin.
     - First-order revenue understates a subscription that renews at $49.99, and renewal rates are MISSING.
     - The 39 may be under-counted (finding 1).
   - **Proposal:** a person reduces or pauses P1 only if both of the following hold:
     - the re-pulled cost per sale is still above your target cost per sale
     - frequency confirms fatigue
   - Any freed budget stays within the current total, for example moved to T1, the best cost per sale here at $21.21. That needs your approval.
   - **Revisit:** at the re-pull and target-setting.

**Not concluded**
- Whether P1 is profitable in either window: no target, margin, refunds or renewal data.
- Whether fatigue or self-competition is the cause: frequency and overlap are MISSING.
- Whether the page or offer changed mid-flight: no change log.
- Why revenue per sale ($34.20) sits above the $29.99 first-order price. It could be one-time orders, 2-adult orders, tax or shipping, but the export does not say.
- Store-side truth: platform revenue is shown here, and store revenue is MISSING.

**Score**

There is no target, so I cannot give a cost-per-sale score for either period. Scoring days 1–21 and days 22–42 requires target cost per sale ÷ actual cost per sale × 100 (MISSING: target).

What follows is a **review-check score** of this analysis, not a performance score:

| Check | Result |
|---|---|
| Rates recalculated, with currency, window and period stated | Fail: attribution window MISSING |
| Counting checked first | Pass |
| Chain split adds up | Pass |
| No promised savings | Pass |
| Nothing changed or paused | Pass |
| Practice numbers labelled | Pass |

Sum: 5 / 6 × 100 = **83**.

**Gaps to fill later**
- target cost per sale or return, and margin
- attribution window and reporting delay
- calendar dates
- browser/server events and deduplication
- reach and frequency
- launch dates of the 15+ copies
- change log
- store orders and refunds
- checkout step counts
- phone page speed
- renewal rate

Proposals only. Nothing has been changed.

Would you like to plan the consolidation and offer-match tests next with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer), bringing this report? You can also suggest your own next step.
```
