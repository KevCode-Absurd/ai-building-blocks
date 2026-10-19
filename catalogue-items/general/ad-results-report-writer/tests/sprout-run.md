# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 7 of 7 met. Invented facts: 1.

Every number checks out against the CSV, the ranking and approval flags are right, and the 61%-vs-page mismatch and the banned 'Fix' verb are caught, so the owner can act on this straight away. The only slip is stating that revenue 'covers first orders only' as a fact when the file never defines the column; it should have been marked as assumed like the rest.

## Fix

In 'If something is missing', add: when column definitions are not supplied, label every statement about what revenue or purchases cover (first orders, renewals, refunds) as 'assumed' wherever it appears, including the worry and actions.

## Judge list

- Met: Cost per sale is total spend / total purchases, not an average of per-ad figures
  "Cost per sale, CPA (lower) | $34.51" — 21,500 / 623 = 34.51, recomputed from the CSV totals.
- Met: The first line tells you what to do, on its own
  "Get approval to pause P2 and late-window P1... then make the ads' '61% off' match the page and reword T1"
- Met: Exactly three actions, ranked, each tied to a number in the report
  "Ranked by the spend each one affects": $10,100 / ROAS 0.79; $5,500 / $2,889; $4,200 / $8,336 / CPA $21.21.
- Met: Any action that changes a budget or pauses an ad says needs approval
  Action 2: "Needs approval: yes. This report only proposes it; nothing has been paused." Actions 1 and 3 also marked.
- Met: No action described as already done without a record
  "nothing has been paused"; every action has a future 'Done when' check.
- Met: Platform revenue and own revenue never added together
  "Store order value / MER / refund rate | MISSING"; all revenue labelled "platform-claimed".
- Met: Anything missing is named in the coverage line
  "Dates: MISSING", "Attribution window: MISSING", MISSING earlier period, targets, store orders, refunds, tax/shipping, stock-outs.

## Invented

- claim: All revenue here is platform-claimed and covers first orders only (The CSV has no column definitions; 'first orders only' is stated as fact in the worry, not labelled assumed like the earlier coverage note.)

## What went in

```text
Practice results, USD (sprout/ad-results.csv). 9 ads, P1 split
into two 21-day windows.
ad / days / spend / impressions / clicks / purchases / revenue
T1 Hot girl tummy        30  4200  300000  4950  198  8336
P1 Too expensive d1-21   21  3000  250000  3750  112  3830
P1 Too expensive d22-42  21  3000  193500  1780   39  1334
P2 Dont pay full price   30  2500  227300  5569   50  1555
H1 One step never skip   16  1300   96300  1300   44  2015
K1 Fiber kids            30  2200  169200  2030   63  3062
F1 Fiber question        30  1800  138500  1524   46  1858
S1 Trusted by 1M         30  1600  128000  1600   38  1254
W1 Muscle weight loss    14   900   64300   900   23  1024
R1 Runner                30  1000   76900   538   10   400

No earlier period for the whole account. No targets.
Brand rule: say "supports", never "fix". Ads say 61% off; the
product page shows 52% and 55%.

[attached: sprout/product-page.md, sprout/ad-results.csv]
```

## What came out

```text
## Sprout ad results: practice period (USD)

**The answer:** Get approval to pause P2 and late-window P1, whose $5,500 brought back $2,889 in claimed sales, then make the ads' "61% off" match the page and reword T1, which drives a third of claimed sales.

### Period and coverage
- **Dates:** MISSING. Ads ran 14 to 42 days. P1 covers 42 days in two 21-day windows. The totals do not cover one even period.
- **Currency:** USD.
- **Attribution window:** MISSING.
- **Included:** 9 ads, with spend, impressions, link clicks, purchases and revenue from `ad-results.csv`. Revenue and purchases are the ad platform's claimed figures. The column definitions were not supplied, so this is assumed.
- **Not included:**
  - MISSING: an earlier period for the whole account. Only P1 has a before and after.
  - MISSING: targets. Results are compared, not called good or bad.
  - MISSING: store orders and revenue, so overall store return (MER) and store order value are unknown.
  - MISSING: refunds and refund rate.
  - MISSING: how tax and shipping are counted.
  - MISSING: whether revenue is before or after refunds, tax and shipping.
  - MISSING: stock-outs and renewal revenue.
  - MISSING: the dates of the page's price cut to "$29.99".

### Numbers table: account, platform-claimed

| Measure (good direction) | This period | Last period | Change | Target |
|---|---|---|---|---|
| Spend | $21,500 | MISSING | — | MISSING |
| Impressions | 1,644,000 | MISSING | — | MISSING |
| Link clicks | 23,941 | MISSING | — | MISSING |
| Purchases (higher) | 623 | MISSING | — | MISSING |
| Claimed revenue (higher) | $24,668 | MISSING | — | MISSING |
| Return on ad spend, ROAS (higher) | 1.15 | MISSING | — | MISSING |
| Cost per sale, CPA (lower) | $34.51 | MISSING | — | MISSING |
| Click rate, CTR (higher) | 1.46% | MISSING | — | MISSING |
| Cost per click, CPC (lower) | $0.90 | MISSING | — | MISSING |
| Cost per 1,000 impressions, CPM (lower) | $13.08 | MISSING | — | MISSING |
| Claimed order value (higher) | $39.60 | MISSING | — | MISSING |
| Store order value / MER / refund rate | MISSING | MISSING | — | MISSING |

### P1 "Too expensive": the only before and after

| Measure | Days 1–21 | Days 22–42 | Change |
|---|---|---|---|
| Spend | $3,000 | $3,000 | 0% |
| Impressions | 250,000 | 193,500 | −22.6% |
| Clicks | 3,750 | 1,780 | −52.5% |
| Purchases | 112 | 39 | −65.2% |
| Claimed revenue | $3,830 | $1,334 | −65.2% |
| ROAS (higher) | 1.28 | 0.44 | −65.2% |
| CPA (lower) | $26.79 | $76.92 | +187.1% |
| CTR (higher) | 1.50% | 0.92% | −38.7% |
| CPC (lower) | $0.80 | $1.69 | +110.7% |
| CPM (lower) | $12.00 | $15.50 | +29.2% |
| Claimed order value | $34.20 | $34.21 | 0.0% |

### By ad, same period, platform-claimed

| Ad | Spend | ROAS | CPA | CTR | Clicks to purchase |
|---|---|---|---|---|---|
| T1 Hot girl tummy | $4,200 | 1.98 | $21.21 | 1.65% | 4.00% |
| H1 One step | $1,300 | 1.55 | $29.55 | 1.35% | 3.38% |
| K1 Fiber kids | $2,200 | 1.39 | $34.92 | 1.20% | 3.10% |
| W1 Muscle | $900 | 1.14 | $39.13 | 1.40% | 2.56% |
| F1 Fiber question | $1,800 | 1.03 | $39.13 | 1.10% | 3.02% |
| S1 Trusted by 1M | $1,600 | 0.78 | $42.11 | 1.25% | 2.38% |
| P2 Don't pay full price | $2,500 | 0.62 | $50.00 | 2.45% | 0.90% |
| R1 Runner | $1,000 | 0.40 | $100.00 | 0.70% | 1.86% |

### What changed
- **P1 lost about two thirds of its sales in its second window.** Purchases fell from 112 to 39 at the same $3,000 spend. Clicks got scarcer: CTR fell from 1.50% to 0.92%. They also got dearer: CPC rose from $0.80 to $1.69. Order value held at $34.20 vs $34.21, so the drop came from fewer clicks and fewer sales, not smaller orders. Ad fatigue is a **guess**, because there is no frequency data.
- **The four "61% off" ad lines took most of the spend but returned less.** These are P1 in both windows, P2 and S1.
  - They took 47% of spend ($10,100 of $21,500).
  - They brought 32% of claimed revenue ($7,973 of $24,668).
  - They drew more clicks per view than the other ads: 1.59% vs 1.33%.
  - Those clicks turned into purchases about half as often: 1.88% vs 3.42%.
  - Their ROAS was 0.79, against 1.46 for the other ads.

  A possible cause is the page itself. It shows 52% and 55%, not 61%, and the $29.99 price needs an SMS sign-up. That fits the numbers but is a **guess**: the data cannot separate the offer from the audience.
- **P2 has the highest CTR (2.45%) but the lowest click-to-purchase rate (0.90%), giving a $50.00 CPA.**
- **T1 carries the account.** It brought 198 of 623 purchases (31.8%) and $8,336 of $24,668 claimed revenue (33.8%), at the lowest CPA ($21.21). Its opening line uses the verb the brand rule bans; the rule is to say "supports".

### One open worry
All revenue here is platform-claimed and covers first orders only, with an unknown attribution window. Subscriptions renew at $49.99 after the $29.99 first box. Without store orders and renewal data, we cannot tell either of these:
- whether the ads with ROAS under 1.0 (P2, P1 late, S1, R1) actually lose money;
- whether claimed sales overlap with sales the store would have made anyway.

### Three ranked actions
Ranked by the spend each one affects.

1. **Make the ads' discount match the page before any "61% off" ad runs again.** This covers P1, P2 and S1: $10,100 of spend, ROAS 0.79. Either use one percentage in both places, or put the SMS condition next to the price.
   - **Owner:** brand and web lead (role; name MISSING).
   - **Done when:** the ad and the landing page show the same percentage, and the SMS condition is visible next to the $29.99 price.
   - **Needs approval:** yes, for relaunching the edited ads.
2. **Pause P2 and P1 and hold their budget until action 1 is done.** Their latest spend was $5,500 and brought $2,889 in claimed revenue (P1 days 22–42: ROAS 0.44; P2: ROAS 0.62).
   - **Owner:** media buyer (role).
   - **Done when:** both ads show as paused and log $0 spend for 3 days in a row.
   - **Needs approval:** yes. This report only proposes it; nothing has been paused.
3. **Replace T1's opening line with one that says "supports".** T1 accounts for $4,200 of spend and $8,336 of claimed revenue. Launch the reworded version next to the current one rather than replacing it outright.
   - **Owner:** creative lead (role).
   - **Done when:** the new version is live with brand sign-off. After 7 days, compare its CPA with T1's $21.21. Turn the original T1 off only after that.
   - **Needs approval:** yes, because launching and turning off T1 changes ad status.

### Score
6 of 7 checks passed: 6 / 7 × 100 = **86**.
- **Missed: "Say whether revenue is before or after refunds, tax and shipping, and count it the same way in both periods."** The file does not say how revenue is counted, so this cannot be confirmed for either P1 window.
```
