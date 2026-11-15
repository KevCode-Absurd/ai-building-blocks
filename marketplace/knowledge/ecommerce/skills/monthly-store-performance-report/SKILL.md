---
name: monthly-store-performance-report
description: "Writes a store's monthly performance report that leads with profit and cash, not platform ROAS. Pulls Shopify, Meta, Google and GA4 numbers for the month, the prior month and the same month last year, corrects the known traps (refunds booked on the refund date, Shopify's AOV and returning-customer definitions, GA4 conversion rate counting any key event), and tags every number with its source. Then explains what moved using sessions times conversion rate times order value, lists wins and problems with evidence, grades last month's actions, and sets actions for the next week, month and quarter. Use at each month end, for the owner, a partner or an investor."
---

# Monthly performance report: profit and cash first

**You get:** a monthly report that leads with profit and cash: a KPI snapshot, a gross-to-net bridge, a what-moved table, a channels table, graded and next actions, and a data CSV with every figure's source.

Most monthly reports open with ROAS and clicks. The owner needs to know first whether the store made money, where the cash went, and what to do next. This report gives that on one screen, then backs every number with its source.

## When to use

- Month end, for the owner or the team.
- A partner, lender or investor asks how the month went.
- A month looked strong or weak and someone needs to know why.
- Before next month's budget, as the input to `cross-channel-budget-reallocation`.

## Not for

- A weekly or daily read: use `daily-ad-account-review`.
- Diagnosing a sharp drop in the middle of the month: use `store-meta-deep-dive`.
- Grading individual recommendations in depth: use `recommendation-scorekeeping`.
- A pitch to fund fixes: use `audit-to-action-deck`.

## What you need

Required (read access, level 1):

1. **Shopify**: Analytics reports "Total sales breakdown" (Gross sales, Discounts, Returns, Net sales, Shipping charges, Taxes) and "First-time vs returning customer sales" for the month, prior month and same month last year; plus the order export with Created at, Subtotal, Discount Amount, Shipping, Refunded Amount, Customer Id, Payment Method, Lineitem sku, Lineitem quantity.
2. **Product costs**: landed cost per SKU and fulfilment, fee and return costs from `store-meta-math`.
3. **Meta Ads Manager** monthly export: Campaign name, Amount spent, Purchases and Purchases conversion value on 7-day click, Attribution setting.
4. **Google Ads** monthly campaign report: Campaign, Campaign type, Cost, Conversions, Conv. value.
5. **GA4**: Traffic acquisition report with Sessions and a purchase-only conversion rate, by default channel group.
6. **Cash**: bank balance at the start and end of the month, payouts received, stock purchases paid, from the bank or accounting software.

Optional: email platform revenue (Klaviyo, Shopify Email or Omnisend) with its attribution window, stock on hand by value, post-purchase survey, last month's report and action list.

If cash data is missing, ask once; if still missing, the report says "cash not reported" in the summary rather than estimating.

Access: level 1 throughout. The report goes to the people the client names; sending it is the client's call.

## Before you start: the gates

1. **Gross profit per order known.** Fail: report revenue lines with a clear "profit not computed" note, and make the first action building it with `store-meta-math`.
2. **Cash and stock known.** Fail: cash section reads "not reported" and the summary says so. Never estimate a bank balance.
3. **Tracking trusted enough.** Shopify is the source of truth for sales; platform numbers appear only as their claims. If a platform's purchases drifted far from store orders this month, flag it in the summary and keep its numbers out of profit lines.

## Steps

### 1. Set the money lines with the traps removed

- **Net sales** from Shopify: Gross sales minus Discounts minus Returns. Cash collected from customers is Net sales plus Shipping charges; Total sales includes tax [MEA-0010].
- **Refunds:** Shopify books returns on the refund date, so a strong month makes the next one look weak. Accrue returns at the expected rate for orders placed in the month, and show the booked figure beside it [MEA-0011] [MEA-0028].
- **AOV:** rebuild from the export; Shopify's dashboard AOV leaves out shipping charged [MEA-0013].
- **Gross profit** = net sales minus landed product cost, fulfilment, payment fees and accrued return costs.
- **Contribution after ads** = gross profit minus total ad spend.
- **Gross-to-net bridge:** accounting software often receives only net revenue, so show gross sales, discounts, refunds and shipping collected in one table, or a change cannot be explained later [FIN-0010].

### 2. Split new and returning customers

Use Shopify's customer type on the order export. Show new-customer net sales, returning net sales, and contribution for each. Returning profit can hide a loss on new customers [MEA-0055]. Do not use Shopify's "returning customer rate" as a loyalty measure; it rises when new-customer sales fall [MEA-0014]. Report the share of last quarter's new customers who bought again instead.

### 3. Put ads on the store's basis

- **Total ad spend** across Meta and Google.
- **New-customer MER** = new-customer net sales / total ad spend; it decides acquisition questions, while blended MER can rise as new-customer efficiency falls [MEA-0039].
- Meta reported on 7-day click, not the default with view credit, which can make up 30 to 50% of reported return [MEA-0042].
- Platform claims shown in their own table, marked as claims, never added together as sales.
- Email and SMS revenue shown as the platform's claim with its attribution window. A default open-based window works like view-through credit, so "email should be half of revenue" is not a benchmark [EML-0056].
- Pacing: month's spend against the plan, and the reason for any gap over 10%.

### 4. Explain what moved

Net sales change = sessions x conversion rate x order value. Compute each factor's share of the change against prior month and last year. A 5% order value dip plus a 4% conversion dip compounding to about 10% is usually normal noise [MEA-0009]. Read sessions in GA4 as well as Shopify; Shopify counts bot traffic GA4 filters [MEA-0012]. Filter GA4 conversion rate to purchase only; the default counts any key event [MEA-0002].

Label each change: flat (within 3%), moderate (3 to 10%), strong (over 10%), practitioner default. A label is not a cause; say "noise" when the move sits inside the store's normal month-to-month swing. Add a 13-month line for contribution after ads and new-customer MER, so a single month is read against the season, not against the month before alone.

### 5. Tag every number with its source

Each figure carries a short tag: [Shopify], [Meta 7dc], [Google], [GA4], [Bank], [Costs sheet], [Calc]. A [Calc] figure shows its formula in the appendix. A number with no tag is removed, not footnoted.

### 6. Write wins and problems with evidence

Up to three wins and three problems. Each states the number, the comparison, the source and the likely cause in one line each. "ROAS improved" is not a win unless contribution after ads also rose. Name losses plainly; a report with no problems is not believed.

Add a short operations line: SKUs under 14 days of cover, average days from order to dispatch, and support tickets per 100 orders. These limit next month's plan more often than the ads do.

### 7. Grade last month's actions

For each action on last month's list: done or not, the predicted effect, what happened on contribution, and a grade (worked, did not, too early, cannot tell). Pass the rows to `recommendation-scorekeeping`.

### 8. Set next actions by horizon

- **This week:** at most three, each with an owner and the number it should move.
- **This month:** at most three, tied to the biggest problem in step 6.
- **This quarter:** at most two, structural (offer, margin, channel, stock).

Judge changes to order value, repeat rate or acquisition cost on 60 to 180-day cash, not 30 days [FIN-0029]; say so next to quarter actions.

Close with next month's targets (contribution after ads, new-customer MER, spend), each with how it was set, and book a 30-minute walk-through with the owner; the report is read properly when someone talks it through. Keep the report to what changes a decision: top and bottom ads belong in `store-meta-creative-review`, not here.

### 9. Stores with pay on delivery or many failed deliveries

Add three lines: pay on delivery share of orders, failed-delivery rate on orders shipped this month, and cash still with couriers at month end. Gross profit uses placed orders after failed-delivery and return losses. Sales tax or VAT stays out of net sales and is shown as a separate line.

## Checks before you hand it over

- Net sales, refunds, gross profit and contribution after ads reconcile to Shopify and the costs sheet.
- Refunds are accrued for the month's orders, with the booked figure beside them.
- Every number has a source tag; every [Calc] has its formula in the appendix.
- Platform claims are never summed into sales.
- The "what moved" split adds up to the total change.
- Last month's actions are each graded.
- No more than eight next actions across the three horizons, each with an owner.
- The summary leads with contribution and cash, not ROAS.

## Output

**One-screen summary (first page):**
1. Contribution after ads this month, against prior month and last year. [Calc]
2. Cash: start balance, end balance, and the three biggest movements. [Bank]
3. New-customer MER against break-even. [Calc]
4. The one thing that drove the month, from step 4.
5. The top three actions for this week.

**Table "KPI snapshot":** Line, This month, Prior month, Change, Same month last year, Change, Source. Lines: net sales, cash collected, gross profit, total ad spend, contribution after ads, new-customer net sales, returning net sales, new-customer MER, orders, AOV, sessions, conversion rate (purchase only), refunds accrued.

**Table "Gross-to-net bridge":** Gross sales, Discounts, Refunds booked, Refunds accrued, Shipping collected, Net sales, Taxes (separate).

**Table "What moved":** Factor (sessions, conversion rate, order value), Prior, Now, Effect on net sales.

**Table "Channels":** Channel, Spend, Platform-claimed purchases, Platform-claimed value, Store-matched orders, New-customer share, Source.

**Sections:** Wins, Problems, Last month's actions graded, Next actions (week, month, quarter), Appendix with formulas.

**File:** a document or Google Sheet with the tables, and `monthly-report-data.csv` with every figure and its source tag.

## Common mistakes

- **Leading with ROAS.** The summary leads with contribution and cash.
- **Calling a refund timing shift a bad month.** Step 1 accrues returns [MEA-0011].
- **Using Shopify's returning customer rate as loyalty.** Step 2 uses cohort repeat instead [MEA-0014].
- **Adding Meta and Google revenue.** Step 3 keeps claims apart.
- **GA4 conversion rate counting sign-ups.** Step 4 filters to purchase [MEA-0002].
- **Long action lists nobody owns.** Step 8 caps them and names owners.

## Sources

- EML-0056: email platform revenue is a claim, not a benchmark.
- FIN-0010: show gross-to-net each month.
- FIN-0029: judge some changes on 60 to 180-day cash.
- MEA-0002: GA4 key event rate counts any key event.
- MEA-0009: sessions x conversion rate x order value; small compounding dips are noise.
- MEA-0010: Shopify net sales plus shipping as cash collected.
- MEA-0011, MEA-0028: refunds booked on refund date; accrue them.
- MEA-0012: Shopify sessions include bots.
- MEA-0013: Shopify AOV excludes shipping.
- MEA-0014: returning customer rate moves with acquisition.
- MEA-0039, MEA-0042: new-customer MER; 7-day click reporting.
- MEA-0055: split new and returning profit.

What makes this skill ours: contribution after ads and cash on the first screen; Shopify's definition traps corrected before any comparison; a source tag on every number with untagged numbers removed; and last month's actions graded so the report learns from itself.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Add COD share of orders, RTO rate on COD orders this month, and COD cash still with couriers at month end. GST stays out of net sales as its own line.
