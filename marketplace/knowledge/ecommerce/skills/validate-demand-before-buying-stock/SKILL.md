---
name: validate-demand-before-buying-stock
description: "A cheap, legal demand test for one product before the store pays for stock: a pre-order, a deposit waitlist or a small ad test, with the go and no-go lines written down before any money is spent. Works out the gross profit per order and the most the store can pay to win a buyer, picks the test that fits the product and cash, sets the spend cap and stopping rule, writes the page and messages, then reads the result into one decision: order, change and retest, or drop. Covers mail order and pre-order rules in the US, UK and EU, Shopify pre-order settings, deposits and payment options, and honest scarcity. Use before a first stock order, a new product, a large reorder of an unproven variant or a factory minimum order."
---

# Validate demand before buying stock

**You get:** one test plan (test type, page, ads or messages, spend cap, dates) with go and no-go lines fixed in advance, and after the test a one-page decision sheet that says order, change and retest, or drop, with the numbers behind it.

## When to use

- A supplier quote with a minimum order is on the table and nobody knows if buyers will pay.
- The store wants to add a product it has never sold, or a new size, colour or flavour.
- A sample has passed quality checks and the owner wants proof before paying the deposit.
- A big reorder is planned for a variant that has only sold a handful of units.

## Not for

- Choosing which product to test in the first place: use `find-trending-products` or `niche-size-and-competition-check`.
- Choosing the next product for a store that already sells: use `plan-product-line-extension`, then come back here to test the pick.
- Setting the launch price itself: use `set-prices-from-costs-and-competitors`; this skill tests demand at a price already chosen.
- Running the launch once the test passes: use `product-launch-creative-kit` and `design-launch-offer`.

## What you need

Required:

1. **Supplier quote:** unit price, minimum order, lead time, deposit terms. Without it there is no stock decision to make; ask once.
2. **Landed cost per unit** from `calculate-landed-cost-per-unit`, or freight, duty and packaging figures to build it.
3. **Planned price** and the delivered costs per order: shipping, pick and pack, payment fee, expected return and failed delivery rate.
4. **Cash available** for the stock order and for the test, from the owner or `build-13-week-cash-forecast`.
5. **Product photos or renders** honest enough to show what will ship.

Optional: Shopify order export (Name, Created at, Lineitem name, Lineitem price, Payment Method) if the store already sells similar products; email and WhatsApp list sizes; Meta Ads Manager access.

Access: building the test page, pre-order app setting and paused ads needs draft access (level 2). Turning on ads, taking deposits or messaging the list needs the client's explicit yes, with a spend cap and an end date.

## Before you start: the gates

1. **Gross profit per order.** Price minus landed cost, shipping, pick and pack, payment fees and a return and failed delivery allowance [MEA-0037]. Pass: a number exists. Fail: build it first; a test that sells at a loss proves nothing useful.
2. **Room to pay for a buyer.** Pass: gross profit per first order is at least the cost to win a buyer the store can expect. A floor is cost per click divided by conversion rate: about 23 at 0.70 and 3%, about 50 at 1 and 2% [MEA-0019]. If the product is priced so low that it cannot fund that, flag it; low single-item prices struggle to pay for ads at launch [PRD-0006].
3. **Cash.** Pass: the store can pay the minimum order and still cover 13 weeks of costs if every unit sells slowly. Fail: test a smaller first batch or a deposit model, or stop.
4. **Ship-date promise.** Pass: the supplier lead time plus freight plus a buffer gives a date the store can keep. Fail: no pre-order; use a waitlist or a dry test (step 3).
5. **Product rules.** Food, cosmetics, supplements, toys and electricals may need licences, labels or certification under your market's labelling and product safety rules (for example FDA, CPSC and FCC in the US, CE or UKCA marking in the EU and UK). Check before taking money.

## Steps

### 1. Write the decision and the lines before spending

Fill this before any test goes live, and get the owner to sign it:

- Stock decision on the table (for example "order the 500-unit minimum").
- **Target cost per buyer** = gross profit per first order for a one-off product; for a repeat product, time-bound gross profit per customer divided by 2 to 3 [MEA-0020]. Read first-order gross profit over cost per buyer as bands: under 1 loses money, 1 to 2 needs proven repeat, 2 to 3 can scale [MEA-0024].
- **Go line:** paid pre-orders or deposits at or under target cost per buyer, and enough of them to clear the share of the minimum order the owner names (practitioner default: 20 to 30% of the first batch sold before the balance is paid; test it).
- **No-go line:** cost per paid order above 1.5 times target after the full spend cap (practitioner default, test it).
- **Spend cap and end date.**

### 2. Pick the test

| Test | Use when | Signal strength |
|---|---|---|
| Paid pre-order (full payment) | Ship date is firm, product is close to final | Strongest: real money |
| Deposit waitlist (partial payment) | Price is high or the ship date is far | Strong |
| Free waitlist | Cash for a test is tiny, product still changing | Weak: treat as interest only |
| Dry test ("coming soon, reserve") | No firm ship date at all | Medium; strict legal rules apply |
| Click and add-to-cart test only | Early screening of several ideas | Weakest; never orders stock on its own |

Rule: stock decisions rest on money taken, not on email sign-ups or likes. A free sign-up costs the buyer nothing, so use it to rank ideas, not to size an order.

### 3. Set it up legally

- **US mail order rule.** A stated ship date needs a reasonable basis; with no date the store must ship within 30 days; if late, the buyer must be offered a free way to cancel and a prompt refund, never store credit [CXP-6160] [OPS-6281].
- **Dry test.** Taking interest for a product that may never be made is allowed only when the page says plainly the product is planned and may not ship, promises no ship date, and refunds if the store decides not to make it [OPS-6281].
- **Shopify pre-orders** can take full, partial or no payment at checkout and charge the rest at fulfilment; they need Shopify Payments or PayPal Express and a pre-order app, and uninstalling the app deletes its pre-order data after 48 hours [OPS-6282]. Export pre-order data before changing apps.
- **UK and EU.** Buyers keep a 14-day right to cancel most online orders, and pre-orders are no different; state the delivery window before payment and refund in full if the store misses it.
- **Deposits and payment.** Pay on delivery does not work for a pre-order: there is nothing to collect against. Use a small refundable deposit (stated in the store's currency, with sales tax or VAT shown as the market expects) or a full prepaid pre-order. Show the expected dispatch window on the product page and in the email, WhatsApp or SMS confirmation. Follow your market's consumer rules on refund terms; confirm specifics with the store's advisor.
- **Honest scarcity.** "Only 200 in the first batch" is fine if true; false urgency, drip pricing and fake stock counts are misleading under ad standards codes and consumer rules in most markets (FTC, CMA and ASA, EU consumer law) [ADC-6147]. No countdown that resets.
- **Images.** If renders or AI images are used, label them "render" or "prototype" so buyers are not misled.

### 4. Build the page and the traffic

Page: product, price, what is included, the dispatch window in plain words, the refund line, and one action ("Pre-order now, ships by 15 March" or "Reserve with a small refundable deposit", with the amount in the store's currency).

Traffic, in order of cost:

1. Own list: email, WhatsApp opt-ins, Instagram followers. Cheapest, but warmer than cold buyers, so read their results separately.
2. Paid: a small Meta test at 10 to 50 a day adding 1 to 3 creatives every few days, judging first whether an ad gets spend and then whether it returns money [ADC-0052]. Spend cap = at least 3 times target cost per buyer per angle tested, so a no-go is not called on noise (practitioner default, test it).
3. Organic posts and creators: useful signal, slow to read.

Before paid traffic, check conversion rate times order value: below about 300 per 100 visitors, ads rarely scale at around a 3 cost per click [MEA-0047]. Use it as a warning line on the test, not as a fixed rule.

### 5. Run and watch daily

Log daily: spend, link clicks, page views, add to carts, paid orders or deposits, refunds requested, questions asked. Stop early only for a policy problem, a broken page or spend over the cap. Do not change the price mid-test; that makes two tests in one.

### 6. Read the result and decide

- Cost per paid order = paid spend / paid orders from paid traffic. Keep own-list orders in a separate column.
- Compare with the lines from step 1. Go, change and retest (one change only: angle, offer or price), or drop.
- Read the questions and refund requests: they are the objections the launch page must answer.
- For a go, size the first order from paid demand plus a buffer, not from hopes; hand the numbers to `set-reorder-points-and-safety-stock`.
- For a no-go, keep the data. A failed test at a small spend is the cheap outcome this skill exists for.

## Checks before you hand it over

- Go and no-go lines were written and signed before the first spend.
- Gross profit per order uses delivered costs, not product cost against price.
- The page states the dispatch window and refund terms; the dry test, if used, says the product may never ship.
- No pay on delivery option on a pre-order; deposits are refundable and shown with tax as the market expects.
- Own-list and paid-traffic results sit in separate columns.
- The decision rests on money taken, not sign-ups.
- No scarcity line that the store cannot prove.
- Nothing was spent, published or sent without the client's yes.

## Output

**One-screen summary:** product, test type, dates, spend, paid orders, cost per paid order against target, decision, first order size, top three buyer questions.

**Test plan sheet:**

| Field | Value |
|---|---|
| Stock decision | |
| Gross profit per first order | |
| Target cost per buyer | |
| Go line | |
| No-go line | |
| Test type | |
| Dispatch window and refund terms | |
| Traffic sources and spend cap | |
| Start and end date | |
| Approved by (client) and date | |

**Daily log:** Date, Source (own list or paid), Spend, Clicks, Page views, Add to carts, Paid orders, Deposits, Refund requests, Questions noted.

**Decision sheet:** Paid orders, Cost per paid order, Target, Result (go, change and retest, drop), Change to test next, First order quantity, Cash needed, Owner sign-off.

## Common mistakes

- **Ordering stock from sign-ups.** Step 2 makes money taken the only stock signal.
- **Moving the goal after the test.** Step 1 fixes the lines first.
- **Promising a date the supplier cannot keep.** Gate 4 and step 3 apply the mail order rules.
- **Mixing warm and cold buyers.** Step 6 splits own-list and paid results.
- **Calling a no-go on 20 clicks.** Step 4 sets a minimum spend per angle.
- **Pay on delivery pre-orders.** Step 3 uses a refundable deposit or prepaid instead.

## Sources

- MEA-0037: gross margin uses delivered costs.
- MEA-0019: cost per buyer floor is cost per click over conversion rate.
- MEA-0020: target cost per buyer from time-bound gross profit.
- MEA-0024: gross profit over cost per buyer bands.
- MEA-0047: conversion rate times order value warning line.
- PRD-0006: low-price products struggle to fund paid launch.
- ADC-0052: small zero-to-one Meta test cadence.
- ADC-6147: an ad standards code on false urgency and drip pricing.
- CXP-6160, CXP-6160, OPS-6281: US mail order rule, delays and dry tests.
- OPS-6282: Shopify pre-order payment options and app data.

What makes this skill ours: the go and no-go lines are set from the store's own gross profit per order before any spend; only money taken can trigger a stock order; the US dry-test rule, UK and EU cancel rights and the no pay on delivery pre-order rule are built into the setup; and warm list buyers are kept apart from cold ad buyers so the result is not flattered.

## Selling in India

- COD does not work for a pre-order. Use a small refundable UPI token, stated in rupees with GST shown, or a full prepaid pre-order.
- Follow the Consumer Protection (E-Commerce) Rules 2020 on refund terms.
- The ASCI guidelines treat false urgency and fake stock counts as misleading [ADC-6147].
- Food, cosmetics, toys and electricals may need FSSAI, BIS or other approvals before you take money.
