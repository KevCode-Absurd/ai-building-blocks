# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 7 of 7 met. Invented facts: 0.

Every figure checks out against the CSV, the answer line is actionable, and the 61%-off vs page-discount mismatch is correctly flagged as a guess rather than a proven cause. The owner gets a clear, honest one-pager with budget moves held for approval and the risky "Fix" headline caught; the only blemish is saying "four" 61%-off ads when it means four rows for three ads.

## Judge list

- Met: Check one number yourself. Cost per sale should be total spend divided by total purchases, not an average of each ad's figure.
  "Cost per sale, CPA (lower) | $34.51" = $21,500 / 623 purchases; totals recomputed from the CSV match.
- Met: The first line tells you what to do, on its own.
  "Make the ad offer match the product page, and hold back P1, P2 and R1 (needs approval)."
- Met: There are exactly three actions, ranked, and each one ties to a number in the report.
  Three numbered actions: "$10,100 of spend, ROAS 0.79", "ROAS 0.44 and CPA $76.92", "ROAS 1.98, CPA $21.21".
- Met: Any action that changes a budget or pauses an ad says needs approval.
  Action 2 "Pause or cut P1, P2 and R1 ... Needs approval."; Action 3 "The budget increase needs approval."
- Met: No action is described as already done unless you gave it a record.
  All actions are proposals with "Done when" checks; nothing claimed as completed.
- Met: Platform revenue and store revenue are never added together.
  "Platform revenue (higher) | $24,668" and "Store return, MER (higher) | MISSING" kept as separate rows.
- Met: Anything missing is named in the coverage line, not quietly left out.
  "Dates: MISSING", "Attribution window: MISSING", "Store's own orders and revenue: MISSING", "Targets: MISSING".

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
**The answer:** The four "61% off" ads took 47% of the $21,500 spend but returned $0.79 in platform-claimed revenue per $1, against $1.46 for the other ads. Make the ad offer match the product page, and hold back P1, P2 and R1 (**needs approval**).

**Period and coverage**
- Currency: USD.
- Dates: MISSING. Only day counts are given. Ads ran 14 to 42 days, so this is not one aligned window. P1 is split into two 21-day halves.
- Attribution window: MISSING.
- Column definitions: MISSING. I assumed "purchases" and "revenue" are platform-attributed first orders. It is unknown whether revenue is before or after refunds, tax and shipping.
- Store's own orders and revenue: MISSING. Overall store return (MER) therefore cannot be calculated.
- Refunds, stock-outs and earlier account period: MISSING.
- Targets: MISSING. Changes are reported without calling them good or bad.
- Price change: the page announces a "birthday" price cut to $29.99. Its start date is unknown, so it may sit inside this window.
- Subscription renewals ($49.99 every 4 weeks) are not in these numbers.

**Numbers table: account (all 9 ads, platform-claimed)**

| Measure (better direction) | This period | Last period | Change |
|---|---|---|---|
| Spend | $21,500 | MISSING | n/a |
| Impressions | 1,644,000 | MISSING | n/a |
| Clicks | 23,941 | MISSING | n/a |
| Purchases (higher) | 623 | MISSING | n/a |
| Platform revenue (higher) | $24,668 | MISSING | n/a |
| Return, ROAS (higher) | 1.15 | MISSING | n/a |
| Cost per sale, CPA (lower) | $34.51 | MISSING | n/a |
| Click rate, CTR (higher) | 1.46% | MISSING | n/a |
| Cost per click, CPC (lower) | $0.90 | MISSING | n/a |
| Cost per 1,000 impressions, CPM (lower) | $13.08 | MISSING | n/a |
| Purchases per click (higher) | 2.60% | MISSING | n/a |
| Average order value (platform) | $39.60 | MISSING | n/a |
| Store return, MER (higher) | MISSING | MISSING | n/a |
| Refund rate (lower) | MISSING | MISSING | n/a |

**P1 "Too expensive" (61% off), same ad, same $3,000 per half**

| Measure | Days 1–21 | Days 22–42 | Change |
|---|---|---|---|
| Purchases | 112 | 39 | −65.2% |
| Revenue | $3,830 | $1,334 | −65.2% |
| ROAS | 1.28 | 0.44 | −65.2% |
| CPA | $26.79 | $76.92 | +187% |
| CTR | 1.50% | 0.92% | −38.7% |
| CPC | $0.80 | $1.69 | +111% |
| CPM | $12.00 | $15.50 | +29.2% |
| Purchases per click | 2.99% | 2.19% | −26.7% |

**By ad (whole run, platform-claimed)**

| Ad | Spend | ROAS | CPA | CTR | Purchases per click |
|---|---|---|---|---|---|
| T1 | $4,200 | 1.98 | $21.21 | 1.65% | 4.00% |
| H1 | $1,300 | 1.55 | $29.55 | 1.35% | 3.38% |
| K1 | $2,200 | 1.39 | $34.92 | 1.20% | 3.10% |
| W1 | $900 | 1.14 | $39.13 | 1.40% | 2.56% |
| F1 | $1,800 | 1.03 | $39.13 | 1.10% | 3.02% |
| S1 (61%) | $1,600 | 0.78 | $42.11 | 1.25% | 2.38% |
| P2 (61%) | $2,500 | 0.62 | $50.00 | 2.45% | 0.90% |
| R1 | $1,000 | 0.40 | $100.00 | 0.70% | 1.86% |

**What changed**
- **The 61%-off ads (P1, P2, S1) underperform the rest.**
  - They spent $10,100 for $7,973 in revenue: ROAS 0.79, CPA $42.26.
  - The other ads spent $11,400 for $16,695: ROAS 1.46, CPA $29.69.
- **P1 roughly tripled in cost per sale between halves.** Spend was the same, but purchases fell from 112 to 39 and CPA rose from $26.79 to $76.92. Click rate, impression cost and buyers per click all moved the wrong way at once.
- **P2 draws clicks that don't buy.** It has the highest click rate (2.45%) but the lowest purchases per click (0.90%, against 2.60% for the account).
  - The data supports "clicks don't convert".
  - The cause is a **guess**: the page shows 52% and 55%, not 61%, and the $29.99 price needs a text sign-up that only the footer mentions.
- **T1 leads the account.** It used 20% of spend but brought 34% of claimed revenue and 32% of purchases, at the lowest CPA ($21.21).

**One open worry**
Why P1 fell in days 22–42 is unexplained. The rise in impression cost and drop in click rate fit ad fatigue, but that is a **guess**: there is no frequency or audience data. The page's undated price cut or a page change could also explain it. Until store revenue is supplied, these platform figures may also double-count sales.

**Three ranked actions**

1. **Make the 61%-off ads and the landing page show the same offer** ($10,100 of spend, ROAS 0.79).
   - What: either change the ad copy to the discount the page actually shows, or send these ads to a page that shows 61%. State the text sign-up condition on the ad's landing page.
   - Owner: growth lead with the web/page owner.
   - Done when: a phone visit from each 61% ad shows the same discount number above the button. P2's purchases per click is then re-checked against its 0.90% after at least 1,000 new clicks.
   - Ad copy edits go through the usual sign-off.
2. **Pause or cut P1, P2 and R1 until action 1 is live** ($6,500 of recent spend).
   - Why: P1 days 22–42 had ROAS 0.44 and CPA $76.92. P2 had ROAS 0.62. R1 had ROAS 0.40 and CPA $100.
   - Owner: media buyer.
   - Done when: the change log shows each ad's new status or budget, and the next export shows no further spend on them.
   - **Needs approval.**
3. **Rewrite T1's opening line to brand rules, then consider moving freed budget to T1** ($4,200 spend, ROAS 1.98, CPA $21.21).
   - Why: T1 opens with "Fix the Hot Girl Tummy", which breaks the "supports, never fix" rule. That puts the account's strongest ad at compliance risk.
   - Owner: creative lead (rewrite); media buyer (budget).
   - Done when: the approved new opening uses "supports" and is live. Any budget increase is logged, and T1's CPA is re-checked against $21.21 after about 100 purchases.
   - The budget increase **needs approval**.
```
