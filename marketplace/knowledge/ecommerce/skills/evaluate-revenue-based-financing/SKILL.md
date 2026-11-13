---
name: evaluate-revenue-based-financing
description: "A yes or no verdict on one revenue-based financing, merchant cash advance or sales-linked loan offer, with its true cost as an effective annual rate at the store's own sales forecast, a month-by-month repayment schedule, the lowest cash point once repayments start, and the contract terms to fix or walk away from. Tests whether the money funds something that pays back inside the term (stock with proven sell-through, ads with proven payback), compares the offer with cheaper options such as supplier terms, a credit line or clearing slow stock, and runs a downside case. Use when a lender, platform or payment provider sends a financing offer, before a big stock buy or peak season, or when the owner is thinking of borrowing to grow."
---

# Should you take revenue-based financing?

**You get:** a one-page verdict (take it, take it with changes, or decline) with the effective annual cost, the repayment schedule by month in base and downside, the lowest cash point, the alternatives compared, and a list of contract terms to accept, negotiate or refuse.

## When to use

- A lender, Shopify Capital, a payment gateway or a marketplace offers sales-linked funding.
- The owner wants money for a big stock order, a peak season or a push on ads.
- Several offers need comparing on one basis.
- The store already has one advance and is offered a top-up.

## Not for

- Raising equity or selling the business: outside this toolkit; see a corporate finance adviser.
- Building the weekly cash view: run `build-13-week-cash-forecast` first; this skill adds the offer to it.
- Deciding how much ad spend the store can afford: use `set-ad-budget-from-profit-target`.
- Legal review of the contract: a lawyer signs off; this skill lists what to ask.

## What you need

Required (read access, level 1):

1. **The offer**, in writing: amount, fee or rate, repayment method (share of daily sales, share of payouts, fixed weekly or monthly), any minimum payment rule, term, security, guarantees, and early-repayment terms.
2. **The 13-week cash forecast** from `build-13-week-cash-forecast`, and a revenue forecast for the full term (`forecast-next-month-revenue`, extended).
3. **The use of funds**: what the money buys, when, and the evidence it pays back (past sell-through of that stock, cost per new customer and payback of that ad spend).
4. **Gross profit per order** from `store-meta-math` or `monthly-store-pnl`.

Optional: existing loans and their repayments, supplier terms on offer, other offers.

If the use of funds has no evidence behind it, the answer is no until it does. This skill reads and models. Accepting, signing or drawing any financing is the client's decision alone; nothing here commits them.

## Before you start: the gates

1. **The store makes a profit per order.** Pass when contribution after ads is positive. Financing a store that loses money on each order only speeds up the loss. Fail: decline and hand off to `store-90-day-growth-plan`.
2. **The use pays back inside the term.** Pass when the funded stock or spend has a measured payback shorter than the repayment period. Judge it on 60 to 180-day cash, not a 30-day view [FIN-0029]. Fail: decline or shrink the amount to what has proof.
3. **The forecast exists.** Pass when a weekly cash forecast is built. Fail: build it first.

## Steps

### 1. Write down how repayment works

Name the type:

- **Share of sales, fixed fee:** a set percentage of daily sales goes to the lender until the amount plus a fixed fee is repaid [FIN-6244]. The fee does not change with time, so fast repayment means a higher annual cost.
- **Share of payouts:** the lender takes a cut of each payout before it reaches the bank; payouts shrink.
- **Fixed instalments:** weekly or monthly payments regardless of sales; riskier in a slow month.
- **Minimum payment rule:** many sales-linked offers require a minimum amount repaid in each period; if sales are slow, the shortfall is due anyway. Find it in the contract.

### 2. Build the repayment schedule

Using the revenue forecast, compute repayment per week: sales x remittance rate (or the fixed instalment), until the total owed is paid. Show months to repay in base and downside (sales 20% lower, practitioner default). Add any minimum-payment top-ups.

### 3. Work out the true cost

Put the cash flows in a sheet: money received on day 0 (after any fees taken up front), then each repayment on its date. Use the spreadsheet XIRR function to get the effective annual rate. Illustrative only: 100,000 received, 108,000 repaid at 12% of sales on 300,000 a month means about 36,000 a month for 3 months, roughly 4% a month or about 60% a year. The same fee repaid over 12 months is about 15% a year. Always quote the annual rate at the store's own forecast, not the fee as a percentage.

US: some states, including California and New York, require commercial financing providers to disclose an estimated annual cost; ask for it and compare with yours. India: check the lender is a bank or an RBI-registered NBFC, and ask for the key facts statement.

### 4. Put the repayments into the cash forecast

Add the money in and every repayment to the 13-week forecast. Find the lowest cash week after repayments start, in base and downside. If downside cash falls below the buffer, the offer fails as written. Repayments taken from payouts also reduce the receipts lines; do not count them twice.

### 5. Test the use of funds

- **Stock:** units bought x gross profit per unit x expected sell-through by month, from that product's past sell-through, minus freight and duty. Lead times of 50 to 70 days for sea freight push the first sales two months out [COG-0008], while repayments may start at once.
- **Ads:** spend / cost per new customer = new customers, x gross profit per customer over the term. Use 30 to 90-day gross profit per customer over cost per new customer; under 1 loses money, 1 to 2 needs proven repeat buying, 2 to 3 is the zone to scale [MEA-0024]. If buyers churn or do not repeat, payback stretches; in one subscription example a 3.2-month naive payback became about 8 months once drop-off by the second order was counted [FIN-0014].

The rule: **extra gross profit earned within the term must be at least twice the financing cost** (practitioner default, test it), and the first repayments must be coverable from cash already forecast.

### 6. Compare the alternatives

Cost each alternative the same way, in the same table:

1. **Supplier terms:** longer payment terms move cash later at little or no cost [FIN-0023]; supplier float is terms minus lead time [FIN-0005].
2. **Clearing slow stock:** turning slow products into cash through their own funnel at break-even [FIN-0026].
3. **A revolving credit line** for purchase-order timing, or purchase-order financing for large confirmed orders [FIN-0020].
4. **Smaller amount** funding only the part with proof.
5. **Doing nothing:** what growth is lost by waiting a month.

Growth paid for with inventory loans has pushed some brands' net profit to near zero once interest and repayments landed [FIN-0011]. Facilities that fund marketing per customer cohort exist at large scale and work because each cohort's payback is measured [FIN-0022]; the same discipline applies to a small offer.

### 7. Read the contract terms

List each and mark accept, negotiate or refuse:

- personal guarantee by the owner;
- security over all business assets, or a lien that blocks other lenders;
- rights to change the remittance rate or redirect payouts;
- minimum payment rules and default triggers;
- fees taken up front, late fees and early-repayment terms (does paying early cut the fee?);
- exclusivity or bans on other financing;
- in the US, any clause letting the lender take a court judgement without a hearing.

Refuse or ask a lawyer before signing anything with the last three. Disclose to the client that this is not legal advice.

### 8. Decide

- **Take it:** gates pass, downside cash stays above buffer, return on the use is at least twice the cost, and no refused terms.
- **Take it with changes:** passes only at a smaller amount, a lower remittance rate or without a term; list the changes to ask for.
- **Decline:** any gate fails, downside breaks the buffer, or a cheaper alternative covers the need.

Give one verdict and the runner-up in one line.

## Checks before you hand it over

- The repayment method and any minimum payment rule are written in plain words.
- The effective annual rate is computed from dated cash flows at the store's forecast, in base and downside.
- Repayments are in the 13-week forecast, and the lowest cash week is shown.
- The use of funds has evidence: past sell-through or measured customer payback.
- At least three alternatives are costed on the same basis.
- Every contract term is marked accept, negotiate or refuse.
- The verdict is one of three, with reasons; nothing was accepted or signed.

## Output

**One-screen verdict:** take, take with changes, or decline; amount; effective annual cost (base and downside); months to repay; lowest cash point and week; extra gross profit expected versus cost; the best alternative; terms to change; and a short "To confirm" list.

**Repayment schedule:**

| Month | Forecast sales base | Repayment base | Balance owed base | Forecast sales downside | Repayment downside | Balance owed downside | Minimum payment top-up |
|---|---|---|---|---|---|---|---|

**Cost comparison:** Option, Amount, Total cost, Effective annual rate, Months to repay, Lowest cash point, Conditions, Verdict.

**Use-of-funds test:** Use, Amount, Evidence, Gross profit expected within term, Financing cost, Ratio, Pass or fail.

**Terms checklist:** Term, What the contract says, Accept, negotiate or refuse, Question to ask.

## Common mistakes

- **Reading the fee as the interest rate.** An 8% fee repaid in 3 months costs far more a year than 8%. Step 3 computes the annual rate [FIN-6244].
- **Funding a loss.** Gate 1 stops financing a store that loses money per order.
- **Ignoring lead time.** Stock bought with the money sells months later while repayments start now [COG-0008]. Step 5 dates both.
- **Payback on first orders only.** Drop-off stretches payback [FIN-0014]. Step 5 uses cohort payback.
- **No downside.** Step 4 runs it before any verdict.
- **Skipping cheaper money.** Step 6 costs supplier terms and slow stock first [FIN-0023] [FIN-0026].

## Sources

- FIN-6244 (proposed): sales-linked repayment until amount plus fixed cost is repaid.
- FIN-0029: judge growth moves on 60 to 180-day cash.
- FIN-0014: cohort payback is longer once drop-off is counted.
- MEA-0024: gross profit per customer over cost per customer bands.
- COG-0008: production and freight lead times.
- FIN-0023: supplier net terms instead of equity.
- FIN-0005: supplier float equals terms minus lead time.
- FIN-0026: turn slow stock into cash at break-even.
- FIN-0020: credit line and purchase-order financing.
- FIN-0011: inventory-loan growth pushed net profit near zero.
- FIN-0022: cohort-based marketing financing at scale.

What makes this skill ours: the cost is an annual rate computed at the store's own sales forecast, so fast repayment is shown as expensive; repayments are dropped into the weekly cash forecast to find the lowest week; the money is approved only for uses with measured payback; and supplier terms and slow stock are costed as cheaper money before any lender.
