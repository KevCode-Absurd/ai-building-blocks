---
name: set-up-shipping-rates-and-delivery-promise
description: "Builds a store's shipping set-up from its own courier rates and dispatch record: zones, rates by weight or order value, a free-shipping line the margin can carry, and a delivery promise in dates the store can keep at least 9 times in 10, then places that promise on the product page, cart, checkout and shipping policy in matching words. Works out the true shipping cost per order from packed weights and courier invoices, prices each zone so no zone loses money, and covers flat, calculated and expedited rates, postcode-based zones, remote-area surcharges, pickup points and lockers, and the legal delivery rules in markets such as the US, UK, EU and Australia. Use before launch, when a courier changes prices, when shipping complaints rise, or when the owner wants to show a delivery date."
---

# Shipping rates and delivery promise

**You get:** a shipping set-up sheet with 3 to 6 zones, a rate for each zone and speed, one free-shipping line, a delivery promise per zone written as a date range, and the exact wording and spot for that promise on 4 pages, ready to enter in Shopify after the client's yes.

## When to use

- A new store needs shipping zones and rates before launch.
- The courier or aggregator raised prices, or the store moved to a 3PL.
- "Where is my order" tickets or late-delivery reviews are rising.
- The owner wants a delivery date on product pages and needs to know which date is safe.
- Shipping charged at checkout does not match what the courier bills.

## Not for

- Choosing a courier, aggregator or 3PL: use `compare-shipping-carriers` or `choose-3pl-or-self-fulfil`.
- Testing the free-shipping threshold against bundles and gifts in depth: use `offer-bundle-threshold-design` (this skill sets the first line; that one tunes it).
- Messages for late orders and stockouts: use `delay-and-stockout-customer-messages`.
- Selling into a new country with duties: use `set-up-markets-and-currencies`.

## What you need

Required:

1. **Courier rate card or last 3 months of courier invoices**, with weight slab, zone and any fuel, residential, remote-area or cash-collection surcharge.
2. **Packed weight and box size per product** (product plus box plus filler), and the box sizes used.
3. **Shopify order export**, last 90 days if trading: Name, Created at, Subtotal, Shipping, Shipping Zip or postcode, Shipping Province, Lineitem quantity, Fulfilled at.
4. **Dispatch record**: order time and the time it left the warehouse, from the 3PL report or packing log. For a new store, the packer's committed cut-off time.
5. **Gross profit per order before shipping**, per product (`store-meta-math` or `build-sku-profit-sheet`).

Optional: courier delivery report with promised versus actual dates, support tickets tagged shipping, competitors' shipping terms.

Reading data is level 1. Entering zones and rates is level 2 (draft); the rates go live only after the client approves the sheet. If dispatch data is missing, use the courier's published transit time plus 1 day and say so.

## Before you start: the gates

1. **Gross profit per order before shipping is known.** Fail: stop; rates cannot be judged without it [MEA-0037].
2. **Packed weights are real.** Pass when weighed, not taken from the supplier sheet. Fail: weigh 3 units of each product first.
3. **Capacity matches the promise.** Pass when the packer can dispatch the peak day's orders by the cut-off time. Fail: lengthen the promise before launch, not after complaints.
4. **Legal floor for each market.** In the US, a stated shipping time needs a reasonable basis; if late, the buyer gets a delay-or-cancel choice and refunds within 7 working days [CXP-6160]. In the UK and EU, goods must arrive within 30 days unless another date was agreed, and the total price including delivery must be shown before the order. Australia's consumer law treats a missed promised date as a breach the buyer can act on. Fail: do not publish a promise the dispatch record cannot support.

## Steps

### 1. Work out the real cost per order

For each order in the export, compute shipping cost = courier slab rate for its zone and packed weight + surcharges (fuel, residential, remote area, any cash-collection fee) + packing material. Charge by the greater of actual and volumetric weight if the courier does. Compare with what the store charged: shipping charged minus shipping cost per order, by zone. Shopify bills its own labels to the card on file at a threshold, not from payouts, so include label spend in cash planning [SET-0006].

### 2. Draw the zones

Group destinations by cost and transit time, not by map:

- **Large countries (US, Canada, Australia, Brazil):** a flat national zone is simplest. Split only if the cost to the far zones (Alaska, Hawaii and territories in the US; the north in Canada; remote Western Australia and the Northern Territory) is much higher.
- **Smaller or denser countries (UK, most of the EU):** one domestic zone, plus a remote-area zone where the courier charges more (Scottish Highlands, Northern Ireland and islands in the UK; islands in the EU). Use the courier's postcode list for surcharge areas.
- **Abroad:** group nearby countries that share a rate (for example EU neighbours, or the UK and Ireland), then the rest of the world; hand duties to `set-up-markets-and-currencies`.
- **Pickup points and lockers:** offer them as a cheaper rate where couriers support them; in much of Europe buyers expect the option.

Keep 3 to 6 zones. More zones confuse buyers and invite mistakes.

### 3. Choose the rate type per zone

- **Flat rate** when packed weights sit in one or two slabs. Easy to read; set it at or above the median real cost for that zone.
- **Calculated rates** when weights vary a lot. Only works if every product has a weight and each box is a saved package with empty weight and size; otherwise every order undercharges [SET-0007].
- **Order-value tiers** when the store wants a free-shipping line.
- **Expedited**: offer only if the courier has a real next-day or two-day service and dispatch can meet the cut-off.

Keep total extra charges at checkout (shipping plus fees plus tax added) under about 10% of order value; in one practitioner's tests, charges below that showed no material conversion effect [LPG-0063].

### 4. Set the free-shipping line

Start from the order value distribution, not the average: put the line just above a peak where many orders sit [OFF-0013]. Check the line pays: (orders that move up x gross profit gained) minus (orders already above the line x shipping now given away). On a low-price single item, free shipping can lift conversion and still lose money [OFF-0033]. Because shipping is partly fixed per order, a second unit costs little extra to ship [OFF-0006], so a multi-unit line often pays where a single-unit one does not. Hand the full model to `offer-bundle-threshold-design`.

### 5. Extra charges and payment-related limits

Practitioner default, test it: any extra delivery charge (remote area, oversize, Saturday, or a cash-collection fee where the store offers pay on delivery) is shown on the product page or the shipping policy, never as a surprise at checkout. Where pay on delivery is offered, set an order-value ceiling and turn it off for areas the courier flags. Detailed rules belong in `cut-rto-on-cod-orders`; this step only sets the shipping-side charge. Surcharges for payment methods are banned or capped in some markets (for example card surcharges in the EU and UK), so check before adding one.

### 6. Build the delivery promise

Promise = order cut-off + dispatch time + courier transit for the zone + buffer. From the dispatch record and courier report, take the time within which 90% of orders reached the buyer for each zone. Promise that, not the average. Showing a specific delivery date instead of a vague range is reported to lift conversion about 13 to 25%, but only when the estimate is padded so the store usually beats it and stays accurate above 90% [CXP-0010].

Write it as a date range ("Arrives Tue 18 to Thu 20 Nov") on the product page when the theme or a delivery-date app can compute it; otherwise "Ships within 1 business day. Delivery in 3 to 5 business days to most of the country." Name holiday cutoffs in peak seasons (Black Friday and Cyber Monday, the winter holidays, local festivals) and carriers' published last-shipping dates.

### 7. Put the promise in the right places

Same words in all four places:

1. **Product page**: under the add to cart button, with the free-shipping line.
2. **Cart**: progress to the free-shipping line and the delivery range.
3. **Checkout**: the rate name carries the range ("Standard, 3 to 5 business days").
4. **Shipping policy**: zones, rates, cut-off, holidays, what happens if late (`write-store-policy-pages`).

Google's store quality signals include shipping speed and cost [GAD-0018], so keep the Merchant Center shipping settings matched to the same rates.

### 8. Set the watch

Weekly: on-time rate by zone against the promise, where-is-my-order contacts as a share of orders (under 3% is healthy, above 8% is structural [CXP-0012]), and shipping charged minus cost. If on-time falls under 90% in a zone for two weeks, lengthen that zone's promise first, then fix the cause.

## Checks before you hand it over

- Every zone shows shipping charged minus real cost; no zone is negative unless the client chose it in writing.
- Every product has a packed weight; every box is a saved package if calculated rates are used.
- The promise per zone matches the 90th percentile of past deliveries, or courier transit plus 1 day for a new store.
- The same promise wording appears on product page, cart, checkout rate name and policy.
- The free-shipping line has its profit check attached.
- Non-serviceable and surcharge areas are listed; any extra charge is shown before checkout.
- The shipping policy says what happens when an order is late, with the refund timing each market's rules require.

## Output

**One-screen summary:** zones and rates, the free-shipping line with its monthly profit effect, the promise per zone, the on-time rate it rests on, and the changes for the client to approve.

**Zone and rate table:**

| Zone | Destinations or postcode list | Rate type | Rate | Free above | Real cost per order (median) | Charged minus cost | Promise (business days) | On-time at 90th percentile |
|---|---|---|---|---|---|---|---|---|

**Promise placement sheet:**

| Page | Exact wording | Position | Source of the date | Live check (pass or fail) |
|---|---|---|---|---|

**Set-up list for approval:** numbered Shopify changes (Settings, Shipping and delivery), each with old and new value.

## Common mistakes

- **Rates from the supplier's weight.** Real packed weight is higher. Gate 2 weighs units.
- **Promise from the courier's best case.** Step 6 uses the 90th percentile plus a buffer.
- **Different promises on different pages.** Step 7 uses one wording in four places.
- **Free shipping set from the average order.** Step 4 uses the distribution and a profit check.
- **Extra fees shown only at checkout.** It reads as a trick; step 5 shows them on the product page.
- **No weekly watch.** Promises drift as volume grows; step 8 catches it.

## Sources

- SET-0006: Shopify label billing and insurance.
- SET-0007: saved package weights for calculated rates.
- MEA-0037: gross margin uses delivered cost.
- LPG-0063: keep checkout add-ons under about 10% of order value.
- OFF-0006: multi-unit shipping cost per unit.
- OFF-0013: thresholds from distribution peaks.
- OFF-0033: free shipping on a cheap single item can lose money.
- CXP-0010: specific delivery dates, padded and above 90% accurate.
- CXP-0012: where-is-my-order contact rate bands.
- GAD-0018: Google store quality signals include shipping speed and cost.
- CXP-6160: US shipping promise rules and refund timing (the UK, EU and Australia have similar rules).

What makes this skill ours: every zone is priced from the store's own courier invoices and packed weights; the promise is set from the 90th percentile of real deliveries, not the courier's brochure; the same words appear on all four pages; and each market's surcharge areas and legal delivery rules are built in.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Typical India zones: local or same city, same state or region, metro to metro, rest of India, and north-east, Jammu and Kashmir and islands. Use the courier's pincode serviceability list and mark pincodes with no COD. Show a small COD fee on the product page or offer a prepaid discount, never a surprise at checkout; set a COD order-value ceiling and turn COD off for pincodes the courier flags. Promise wording can read "Delivery in 3 to 5 business days to most of India."
