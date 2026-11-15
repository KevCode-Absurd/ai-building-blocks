---
name: cohort-repeat-and-ltv-analysis
description: "A cohort table of repeat rate and 90, 180 and 365-day value per customer, split by first-order month, first product and first channel, built from the store's order export. Shows value as revenue and as gross profit, only for cohorts old enough to read, with time to second order and the cohorts that repeat best and worst. Ends with the CAC each first product and channel can afford and the next retention move. Use before setting ad targets from lifetime value, when the owner quotes Shopify's returning customer rate, or when choosing which product to lead acquisition with."
---

# Repeat purchase and lifetime value by cohort

**You get:** a cohort workbook with three tables (by first-order month, by first product, by first channel) showing customers, repeat rate and value per customer at 90, 180 and 365 days in revenue and gross profit, plus a one-screen summary with the affordable CAC per segment and one retention action.

## When to use

- The owner wants a CAC target from lifetime value and has no real cohort numbers.
- Someone quotes Shopify's "returning customer rate" as the repeat rate.
- The team must pick which product or channel to lead new-customer ads with.
- A discount, a sale month or a new channel brought many buyers and nobody knows if they came back.

## Not for

- A monthly tracking sheet of repeat rate and returning revenue with targets: use `retention-dashboard` (this skill builds its baseline).
- The flows that win second orders: use `post-purchase-repeat-sequence` or `email-sms-flow-plan`.
- What each new customer costs by channel today: use `new-customer-cost-by-channel` (this skill gives the value side).
- Forecasting next month's revenue: use `forecast-next-month-revenue`.

## What you need

Required, read access (level 1):

1. **Shopify order export** covering at least 15 months (365 days plus a return window, plus at least one cohort): Name, Email, Phone, Created at, Financial Status, Cancelled at, Subtotal, Discount Code, Discount Amount, Refunded Amount, Lineitem sku, Lineitem quantity, Lineitem price, Payment Method, Shipping Province. The customer export (Customer ID, Email, Phone) helps join guest orders.
2. **Gross profit per order or per SKU** from `build-sku-profit-sheet` or `store-meta-math`. Without it, the tables show revenue only and no CAC target is set.
3. **First channel per order**, best source first: Shopify's sales by marketing attribution report joined on order number; a GA4 exploration of transaction_id with session source and medium; the post-purchase survey answer (`post-purchase-how-did-you-hear-survey`); the discount code if codes are channel-specific.

Optional: failed-delivery or returned-to-sender list from the courier, subscription flag, wholesale and marketplace order tags.

If the export is shorter than 15 months, build 90 and 180-day tables only and say 365 waits. No step writes to any tool, so no approval is needed; customer data stays inside the job and leaves only as counts.

## Before you start: the gates

1. **Identity.** Pass when at least 95% of orders carry an email or a phone that can be matched. Where guest checkout by phone is common, phone is often the only key: normalise it to one international format (strip spaces and the leading 0, add the country code) before matching. Fail: say the repeat rate is a floor, because unmatched repeat buyers count as new.
2. **Real purchases only.** Cancelled, voided, test, undelivered (returned to sender) and fully refunded orders are not purchases. Remove them before finding each customer's first order, or a refused pay-on-delivery parcel becomes a "first order".
3. **Maturity.** A cohort is read at day N only when N days plus the return window have passed since its last first order. Rank on customers acquired at least 12 months ago for 365-day value [MEA-0048]. Immature cells stay blank, never estimated in the main table.
4. **Gross profit known.** Pass when per-order gross profit exists. Fail: deliver the revenue tables and block any CAC target, per the rule that nothing is ranked before gross profit per purchase is known.

## Steps

### 1. Build the customer table

One row per customer: first order date, first order number, first product (the highest-value line on the first order), first channel, first discount code, first payment method (card, wallet, buy now pay later, or pay on delivery where offered), country and province or state. Exclude wholesale and marketplace orders; they are different buyers.

### 2. Tag every later order

For each customer's later orders: days since first order, net revenue (after discounts and refunds) and gross profit. A second order on the same day as the first is usually a split basket; merge orders under 24 hours apart (practitioner default; say so).

### 3. Compute the cohort metrics

For each cohort (first-order month) and each window N = 90, 180, 365 days:

- **Repeat rate at N** = customers with a second order within N days / cohort customers.
- **Value per customer at N** = cumulative net revenue per customer, first order included. Show gross profit per customer beside it.
- **Lift over first order** = value at N / first-order value. Use gross profit for this.
- **Median days to second order**, among those who came back.

Do not use Shopify's returning customer rate for any of this. It measures returning orders against new ones in the period, so it rises when acquisition slows and falls when the store scales [MEA-0014] [MEA-0021].

### 4. Split by first product and first channel

Repeat the 90, 180 and 365 metrics grouped by first product (top 10 by customers, rest as "other") and first channel. Merge months into quarters when a cell has fewer than 100 customers (practitioner default, test it). If over 30% of customers have no known first channel, show the channel table with a warning and do not set channel CAC targets from it.

Add two cuts the owner rarely sees:

- **First discount code.** At many brands, buyers won on deep discounts had markedly worse lifetime value [CXP-0016].
- **First payment method.** Report repeat rate and value by how the first order was paid (card, wallet, buy now pay later, pay on delivery). Buyers who paid up front often behave differently, and that changes how hard to push one method over another.

### 5. Check against known patterns

Compare 365-day gross profit lift with typical bands by vertical: about 55% for fashion, about 110% for consumables and supplements, near zero for furniture and homewares [MEA-0052]. Far below the band points at a product or experience problem; far above it, check for a subscription or wholesale buyer mixed in.

Look for seasonal cohorts: November buyers repeated less than February buyers in a 10-brand sample, though two brands saw no gap [MEA-0035]. If the store's sale cohorts repeat less, the sale needs its own CAC allowance.

Under roughly 10 to 20 million a year in revenue, the usual retention constraint is the first-to-second order step [EML-0053]; check that the 90-day repeat rate is where the gap is before planning anything for third orders.

### 6. Turn value into an affordable CAC

For each first product and channel with mature data:

- Affordable CAC = time-bound gross profit per customer / target ratio. Use 90-day value for high-repeat categories and 30-day for low-repeat, with refunds deducted, and a ratio of 2 to 3 [MEA-0020].
- Read the current CAC against it: under 1 loses money, 1 to 2 needs proven retention, 2 to 3 is where to scale, above 3 means underspending [MEA-0024].

State the window and that values are observed, not modelled. Ratios quoted on long modelled windows from young cohorts mislead [MEA-0038]. If the owner wants a 12 or 24-month figure, give it as a range from the decay of older cohorts and label it modelled [MEA-0022].

### 7. Pick the next move

Choose one, with the number that justifies it:

- **Lead acquisition with the best first product** if its 180-day gross profit beats the next one by a clear margin and stock allows.
- **Fix the first-to-second step** if 90-day repeat is low; time the second-order message just before the median days to second order. Hand to `post-purchase-repeat-sequence`.
- **Change the discount** if discount cohorts lag; hand to `offer-bundle-threshold-design`.
- **Push prepaid harder** if prepaid first orders repeat clearly better; hand to `cod-and-prepaid-checkout-for-india`.

## Checks before you hand it over

- Undelivered, cancelled and fully refunded orders are excluded before first orders are set.
- No immature cell is filled; blanks are labelled "not yet".
- Value is shown in gross profit as well as revenue.
- Shopify's returning customer rate appears nowhere as a repeat rate.
- Small cells are merged or flagged; none drives a decision alone.
- Each CAC target names its window, ratio and the observed or modelled label.
- The unknown first-channel share is printed above the channel table.
- Totals of cohort customers match unique first-time buyers in the export.

## Output

**1. One-screen summary**

- Window, customers, match rate, unknown-channel share.
- 90, 180 and 365-day repeat rate and gross profit per customer for the store, against last year if available.
- Best and worst first product and channel by 180-day gross profit.
- Affordable CAC for the top 3 segments, with window and ratio.
- The one next move and its number. A second move that adds to it goes into the same plan, with its own number.

**2. Cohort by month** (rows: first-order month; blanks where immature)

| Cohort | Customers | Repeat 90d | Repeat 180d | Repeat 365d | GP per customer 90d | 180d | 365d | Revenue per customer 365d | Median days to 2nd order |
|---|---|---|---|---|---|---|---|---|---|

**3. Cohort by first product** and **4. by first channel**: same columns plus First-order GP, Lift 180d, Affordable CAC, Current CAC, Ratio band.

**5. Cuts tab:** discount code, first payment method, country and province or state (top 10).

**6. Method tab:** exclusions, merge rules, identity key, maturity rule, data dates.

## Common mistakes

- **Shopify's returning customer rate as repeat rate.** It moves with acquisition; step 3 builds the real one.
- **Undelivered orders as first purchases.** They inflate new customers and sink repeat rate; gate 2 removes them.
- **Reading young cohorts.** A March cohort cannot have a 365-day value in June; gate 3 leaves it blank.
- **Revenue LTV for CAC targets.** A cheap first product with high repeat can earn less profit than it looks; step 6 uses gross profit.
- **One store-wide LTV.** It hides that one first product or channel carries the value; step 4 splits it.
- **Modelled 24-month LTV quoted as fact.** Step 6 labels anything beyond observed data as modelled.

## Sources

- MEA-0014: Shopify's returning customer rate moves with acquisition; use cohorts.
- MEA-0021: returning customer rate is returning orders over all orders, not repeat rate.
- MEA-0020: CAC targets from time-bound lifetime gross profit at a 2 to 3 ratio.
- MEA-0024: bands for 30 and 90-day gross profit over CAC.
- MEA-0048: rank by 12-month gross profit on customers acquired at least 12 months ago.
- MEA-0052: 365-day gross profit lift by vertical.
- MEA-0035: November cohorts repeated less in a 10-brand sample.
- MEA-0038: ask the window and whether LTV is observed or modelled.
- MEA-0022: forecast returning revenue from cohort decay.
- CXP-0016: deep-discount cohorts had worse lifetime value.
- EML-0053: under about 10 to 20 million a year, first-to-second order is the constraint.

What makes this skill ours: undelivered, refused and refunded orders are removed before anyone becomes a "customer"; phone numbers are normalised as the identity key for guest checkouts; immature cells stay blank instead of being projected; and every lifetime value turns into an affordable CAC on gross profit with its window stated.

## Selling in India

- Phone is often the only identity key. Strip spaces, the leading 0 and +91 before matching.
- Pull the RTO list from the courier and remove RTO and refused COD orders before setting first orders.
- Cut repeat rate and value by COD versus prepaid first order; prepaid first-timers often behave differently.
