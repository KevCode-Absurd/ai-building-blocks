# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 7 of 7 met. Invented facts: 0.

Every figure checks out against the CSV, the answer line is actionable, and the report correctly refuses to call anything good or bad without targets while flagging the 61%-off mismatch and the banned "Fix" wording. The owner gets a clear, approval-gated plan plus an honest list of what data to bring next time.

## Judge list

- Met: Check one number yourself: cost per sale = total spend / total purchases, not an average
  "CPA | $34.51": $21,500 / 623 purchases = $34.51, recalculated from totals; per-ad CPAs (e.g. R1 $100.00) also check out.
- Met: The first line tells you what to do, on its own
  "Pause P1 and hold the other 61%-off ads until the offer they promise matches the page."
- Met: Exactly three actions, ranked, each tied to a number in the report
  Three actions "ranked by money at stake": $10,100/ROAS 0.79; $4,200/CPA $21.21; $1,000/ROAS 0.40.
- Met: Any action that changes a budget or pauses an ad says needs approval
  All three carry "Needs approval", including the T1 swap "(swapping a live ad)".
- Met: No action described as already done without a record
  Each is framed as "Proposal" with "Done when: P1 shows as paused in Ads Manager".
- Met: Platform revenue and own revenue never added together
  "Revenue, platform-claimed | $24,668" with "Store AOV | MISSING", "Store MER | MISSING" kept as separate rows.
- Met: Anything missing is named in the coverage line, not quietly left out
  Coverage lists MISSING: dates, attribution window, column definitions, earlier period, targets, store data, stock-outs.

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
**The answer:** Pause P1 and hold the other 61%-off ads until the offer they promise matches the page. Those ads took 47% of spend for 32% of claimed revenue, and P1's cost per sale nearly tripled in its second 21 days.

---

**Period and coverage**
- **Dates:** `MISSING:` calendar dates. The ad windows are not the same length: 30 days for most ads, 42 for P1 (split into two 21-day windows), 16 for H1 and 14 for W1.
- **Currency:** USD.
- **Attribution window:** `MISSING:`
- **Column definitions:** `MISSING:` Revenue and purchases are **assumed** to be Meta-claimed figures for first orders only. They are assumed to exclude $49.99 renewals, and to be counted before refunds, with tax and shipping treatment unknown.
- **Included:** 9 ads (10 rows), from sprout/ad-results.csv.
- **Not included:**
  - `MISSING:` an earlier account period, so there is no account-level change and no year-on-year line.
  - `MISSING:` targets, so changes are reported without being called good or bad.
  - `MISSING:` store orders and revenue, so there is no store AOV, MER or refund rate.
  - `MISSING:` stock-outs.
- **Price change to rule out before blaming the ads:** the product page announces a birthday price cut ("Subs Now Start at $29.99", "indefinitely") and a new tie-in flavour. How their timing lines up with these windows is `MISSING:`.

---

**Numbers table: account, all ads (platform-claimed revenue)**

| Metric | This period | Last period | Change | Target | Better when |
|---|---|---|---|---|---|
| Spend | $21,500 | MISSING | n/a | MISSING | n/a |
| Impressions | 1,644,000 | MISSING | n/a | MISSING | n/a |
| Link clicks | 23,941 | MISSING | n/a | MISSING | higher |
| Purchases (assumed first orders) | 623 | MISSING | n/a | MISSING | higher |
| Revenue, platform-claimed | $24,668 | MISSING | n/a | MISSING | higher |
| ROAS (platform) | 1.15 | MISSING | n/a | MISSING | higher |
| CPA | $34.51 | MISSING | n/a | MISSING | lower |
| CTR | 1.46% | MISSING | n/a | MISSING | higher |
| CPC | $0.90 | MISSING | n/a | MISSING | lower |
| CPM | $13.08 | MISSING | n/a | MISSING | lower |
| Revenue per purchase (platform) | $39.60 | MISSING | n/a | MISSING | n/a |
| Store AOV | MISSING | MISSING | n/a | MISSING | n/a |
| Store MER | MISSING | MISSING | n/a | MISSING | higher |
| Refund rate | MISSING | MISSING | n/a | MISSING | lower |

**The only like-for-like comparison: P1, days 1–21 vs days 22–42 (same $3,000 spend)**

| Metric | Days 22–42 | Days 1–21 | Change |
|---|---|---|---|
| Impressions | 193,500 | 250,000 | −22.6% |
| CPM | $15.50 | $12.00 | +29.2% |
| CTR | 0.92% | 1.50% | −38.7% |
| CPC | $1.69 | $0.80 | +110.7% |
| Clicks to purchase | 2.19% | 2.99% | −26.6% |
| Purchases | 39 | 112 | −65.2% |
| Revenue (platform) | $1,334 | $3,830 | −65.2% |
| ROAS | 0.44 | 1.28 | −65.2% |
| CPA | $76.92 | $26.79 | +187.1% |

**By ad (each recalculated from its own totals)**

| Ad | Spend | ROAS | CPA | CTR | Clicks to purchase | Revenue/purchase |
|---|---|---|---|---|---|---|
| T1 | $4,200 | 1.98 | $21.21 | 1.65% | 4.00% | $42.10 |
| H1 | $1,300 | 1.55 | $29.55 | 1.35% | 3.38% | $45.80 |
| K1 | $2,200 | 1.39 | $34.92 | 1.20% | 3.10% | $48.60 |
| P1 d1–21 | $3,000 | 1.28 | $26.79 | 1.50% | 2.99% | $34.20 |
| W1 | $900 | 1.14 | $39.13 | 1.40% | 2.56% | $44.52 |
| F1 | $1,800 | 1.03 | $39.13 | 1.10% | 3.02% | $40.39 |
| S1 | $1,600 | 0.78 | $42.11 | 1.25% | 2.38% | $33.00 |
| P2 | $2,500 | 0.62 | $50.00 | 2.45% | 0.90% | $31.10 |
| P1 d22–42 | $3,000 | 0.44 | $76.92 | 0.92% | 2.19% | $34.21 |
| R1 | $1,000 | 0.40 | $100.00 | 0.70% | 1.86% | $40.00 |

---

**What changed**
- **The 61%-off group underperformed the rest.** P1, P2 and S1 spent $10,100 (47% of spend) and brought $7,973 claimed revenue (32%). That is a ROAS of 0.79 and a CPA of $42.26, against 1.46 and $29.69 for the other ads.
- **P1 collapsed in its second window.** On the same $3,000, purchases fell 65.2% and CPA rose from $26.79 to $76.92. CPM rose 29.2% and CTR fell 38.7%.
  - Explanation the data supports: fewer people saw it, and fewer of those clicked.
  - Guess: ad fatigue. Frequency is not in the export.
- **P2 got clicks but not sales.** It had the highest CTR (2.45%) and the lowest clicks-to-purchase rate (0.90%).
  - Explanation the data supports: the clicks did not convert.
  - Guess: the gap between the ad's "61% off" and the 52% or 55% shown on the page.
- **T1 carried the account.** It brought 33.8% of claimed revenue on 19.5% of spend, at a CPA of $21.21. Its opening line, "Fix the Hot Girl Tummy", breaks the brand rule. It should say "supports".

---

**One open worry**
We don't know what "revenue" and "purchases" cover. They are **assumed** to be platform-claimed first orders, before refunds, excluding $49.99 renewals.
- Without store orders, refunds and renewal data, it is not possible to say whether an account ROAS of 1.15 is acceptable for a subscription.
- It is also not possible to say whether the 61%-off ads' lower revenue per purchase ($33.36 vs $43.48) reflects worse buyers or only a cheaper first box.

---

**Three ranked actions (by money at stake)**

1. **Stop P1 and hold the rest of the 61%-off group ($10,100, ROAS 0.79). Needs approval.**
   - Proposal:
     - Pause P1. Its days 22–42 CPA was $76.92.
     - Hold P2 and S1 budgets flat until one of two things is true: the ads state the same discount the landing page shows, or the page shows 61%.
   - Owner: paid-media lead to decide the pause. Site owner for the offer.
   - Done when:
     - P1 shows as paused in Ads Manager.
     - The number in the ad matches the number on the page, checked on a phone.
     - P2's clicks-to-purchase rate is re-measured after 14 days against 0.90%.

2. **Bring T1 into line with the brand rule without losing it ($4,200 spend, 33.8% of revenue, CPA $21.21). Needs approval** (swapping a live ad).
   - Proposal: launch a "supports" version of the opening line next to T1, then retire the old wording.
   - Owner: creative lead, with brand sign-off.
   - Done when:
     - No live ad uses the banned word.
     - The new version's CPA is reported against $21.21 over the same length of window.

3. **Pause R1 ($1,000, ROAS 0.40, CPA $100.00, CTR 0.70%, the lowest in the account). Needs approval.**
   - Owner: paid-media lead.
   - Done when R1 shows as paused and its budget sits unallocated until a person decides where it goes.

---

**Checks missed**
- **Year-on-year line:** left out because no earlier account period was supplied. Only the P1 split has a comparison.
- **Revenue before or after refunds, tax and shipping:** can't confirm, because there are no column definitions. Treated as assumed throughout.
- **Same revenue basis in both periods:** can't confirm, for the same reason.
- **Stock-out check:** no stock data was supplied.
- **Price-change check:** the $29.99 price cut and the new flavour are noted, but their dates against the ad windows are unknown.
- **Store AOV, MER and refund rate:** can't calculate without store orders and revenue.

---

Want to plan what to test next, such as a matched-offer version of P2 and a "supports" version of T1, with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? Bring this report and the product-page audit, or type your own next step.
```
