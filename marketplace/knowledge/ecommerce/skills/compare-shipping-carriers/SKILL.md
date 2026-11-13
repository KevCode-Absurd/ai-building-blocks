---
name: compare-shipping-carriers
description: "A carrier comparison priced on the store's own last three months of parcels: each courier, aggregator or label service costed per order across real weights, box sizes, zones and COD share, then scored on delivery speed, pincode or ZIP coverage, COD fees and remittance days, return-to-origin and reverse pickup, damage claims and surcharges. Ends with a main carrier, a backup, routing rules and a short pilot plan. Use when shipping costs feel high, deliveries are slow or lost, COD cash arrives late, a new region opens, or an aggregator or courier pitches a new rate card."
---

# Compare shipping carriers

**You get:** a comparison sheet that prices each carrier or aggregator on the store's real shipment mix, a scorecard on speed, coverage, COD, returns and claims, a one-screen recommendation (main carrier, backup and routing rules), and a 2 to 4 week pilot plan with pass or fail lines.

## When to use

- Shipping cost per order has crept up, or shipping eats a big share of gross profit.
- Late, lost or damaged parcels are showing in tickets and reviews.
- COD cash is slow to arrive, or return-to-origin charges are high.
- The store starts shipping to a new region or country.
- A courier or aggregator sends a new rate card and the owner wants to know if it is better.

## Not for

- Shipping rates and free-shipping line shown to buyers at checkout: use `set-up-shipping-rates-and-delivery-promise`.
- Choosing whether to use a 3PL at all: use `choose-3pl-or-self-fulfil`.
- Rules for which COD orders to confirm or block: use `cut-rto-on-cod-orders`.
- The full cost of returns and return to origin by product: use `returns-and-rto-cost-analysis`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 3 months: Name, Created at, Shipping Zip, Shipping Province, Shipping Country, Payment Method, Total, Lineitem sku, Lineitem quantity, Fulfilled at.
2. **Parcel data:** weight and box size per order, or per SKU and box rule. If the store uses calculated rates, check every box is saved with its empty weight and size; missing ones undercharge shipping quietly [SET-0007].
3. **Current carrier invoices** for 3 months, with weight disputes, surcharges, COD fees and return-to-origin charges.
4. **Tracking outcomes:** delivered date, delivery attempts, returned to origin, lost or damaged, per shipment, from the carrier or aggregator panel.
5. **Rate cards** from 3 to 5 options, requested on the store's shipment profile.

Optional: support tickets tagged delivery, review mentions of delivery, the 3PL's own carrier rates.

Asking for rate cards is fine at level 1 with the client's go-ahead. Signing up for an account, accepting terms, switching the default carrier or paying a deposit needs the client's yes; the client creates any account and signs in.

## Before you start: the gates

1. **Gross profit per order on delivered cost.** Pass when shipping, COD fees and return-to-origin costs feed gross profit per order [MEA-0037]. Fail: compute it in step 6 before recommending; a cheaper carrier with more failed deliveries can cost more.
2. **Clean parcel data.** Pass when 90% of orders have a weight and box size. Fail: weigh and measure the top 20 SKUs and box sizes before pricing.
3. **Capacity.** Pass when the team can run two carriers during a pilot (two pickup times, two label flows). Fail: pilot on one product line or one region only.

## Steps

### 1. Build the shipment profile

From the export and parcel data, count orders by:

- **Weight slab** (India: 0.5 kg steps; US: 1 lb steps) using the billable weight, which is the higher of actual and size-based weight. India couriers commonly divide length x width x height in centimetres by 5,000 to get kilograms; check each rate card for its own divisor. USPS Priority Mail charges by size for parcels over 1 cubic foot, dividing cubic inches by 139 [OPS-6287].
- **Zone:** India within city, within state, metro to metro, rest of India, special zones (north-east, Jammu and Kashmir, islands). US zones 1 to 8 from the ship-from ZIP.
- **Payment:** COD or prepaid.

This profile, not the headline rate, is what every option is priced on.

### 2. Make the long list

India: direct couriers (Delhivery, Blue Dart, DTDC, Xpressbees, India Post Speed Post and others) and aggregators that route across several couriers. Aggregators give one panel, COD remittance and courier switching; direct contracts can be cheaper at volume. US: USPS, UPS, FedEx, regional carriers, and label services (Shopify Shipping, free label tools or paid ones) that resell discounted rates. Pick 3 to 5 that serve the store's main zones.

### 3. Price each option on the profile

For each option: cost per order = sum over the profile of (orders in cell x rate for that weight and zone) + fuel and other surcharges + COD fee on COD orders + expected return-to-origin cost, divided by orders.

- **COD fee:** usually a percentage of order value or a flat minimum, whichever is higher.
- **Return-to-origin:** many Indian rate cards charge the forward rate again for the return leg; some charge less. Use each carrier's real return-to-origin rate from tracking data, not the store average.
- **US surcharges:** residential delivery, delivery area, fuel, peak season and additional handling for large or heavy boxes. Read each in the rate guide.
- **Insurance:** some label services include cover; Shopify Shipping includes up to $200 per label on Grow and higher plans with Shopify Payments [SET-0006]. Check the store's plan.

### 4. Check coverage

Take every pincode or ZIP the store shipped to in 12 months. For each option, the share it serves, the share it serves for COD, and the share it serves for reverse pickup. Weight by orders. A carrier with 98% of pincodes but weak in the store's top three states is worse than it looks.

### 5. Measure speed and delivery quality

From tracking data, or from 20 test parcels per option to the store's top destinations:

- days from pickup to delivery by zone (median and 90th percentile);
- first-attempt delivery rate;
- pickup reliability (missed pickups per month);
- lost and damaged per 1,000 parcels, and how fast claims are paid.

Shoppers check tracking several times per order [CXP-0014]; slow or missing scans drive "where is my order" contacts, which are healthy under 3% of orders [CXP-0012].

### 6. Check COD cash and disputes (India)

- **Remittance cycle:** days from delivery to cash in the bank, and whether early remittance costs a fee.
- **Weight disputes:** how the carrier re-weighs, how to contest, how often the store was charged a higher slab.
- **Non-delivery reports:** how failed deliveries are reported and how many reattempts are allowed before return to origin.

Put the remittance gap into the cash forecast: slower remittance means more cash tied up every week.

### 7. Score and decide

| Factor | Weight (practitioner default, adjust to the store) |
|---|---|
| Cost per order on profile | 35 |
| Speed and first-attempt delivery | 20 |
| Coverage (incl. COD and reverse) | 15 |
| Return-to-origin and claims | 15 |
| COD remittance and disputes | 10 |
| Panel, tracking page and integration | 5 |

Recommend one main carrier and one backup. Add routing rules where they pay: for example, a faster courier for metro prepaid orders, a wider-reach one for rest-of-India COD, or a cheaper ground service for US zones 1 to 4. Products that are heavy, bulky or fragile ship worse and cost more [PRD-0013]; route them separately if needed.

### 8. Plan the pilot

Run 2 to 4 weeks on a slice (one region, or 20% of orders). Pass lines:

- cost per order within 5% of the modelled figure;
- delivery days at or better than the current carrier;
- first-attempt delivery and return-to-origin no worse than the current carrier;
- zero missed pickups in the last week.

If it passes, switch the main flow. Then update the delivery promise on the site to what the new carrier really achieves, padded so the store usually beats it [CXP-0010]. Audit invoices against order data every month [OPS-0012].

## Checks before you hand it over

- Every option is priced on the store's own shipment profile, not the rate card headline.
- Billable weight uses each carrier's own size divisor.
- COD fees, surcharges and return-to-origin are in the cost per order.
- Coverage is weighted by the store's real orders, including COD and reverse pickup.
- Speed comes from tracking data or test parcels, not carrier claims.
- There is a main carrier, a backup and written routing rules.
- The pilot has pass or fail lines and a date.
- No account opened or carrier switched without the client's yes.

## Output

1. **One-screen recommendation:** main carrier, backup, routing rules, cost per order before and after, expected change in gross profit per order and per month, and the pilot dates.
2. **Pricing sheet:** Option, Weight slab, Zone, Payment, Orders, Rate, Surcharges, COD fee, Return-to-origin cost, Cost per order.
3. **Scorecard:** Option, Cost per order, Median days, 90th percentile days, First-attempt %, Coverage %, COD coverage %, Reverse pickup %, Return-to-origin %, Lost or damaged per 1,000, Remittance days, Score.
4. **Pilot plan:** slice, dates, pass lines, owner.
5. **Monthly audit template:** invoice line, weight charged, weight measured, zone charged, zone expected, difference.

## Common mistakes

- **Comparing headline rates.** Step 3 prices the store's real weights, zones and COD share.
- **Ignoring size-based weight.** Step 1 uses billable weight with each carrier's divisor.
- **Counting coverage by pincode count.** Step 4 weights by the store's orders.
- **Leaving out return-to-origin.** Step 3 adds each carrier's own rate.
- **Switching everything at once.** Step 8 pilots a slice with pass lines.
- **Not updating the delivery promise.** Step 8 resets it to real delivery times.

## Sources

- OPS-6287: USPS size-based weight over 1 cubic foot.
- SET-0007: saved package weights and sizes on Shopify.
- SET-0006: Shopify Shipping label billing and insurance.
- CXP-0010: specific, padded delivery dates.
- CXP-0012: healthy order-status contact rates.
- CXP-0014: shoppers check tracking often; proactive updates.
- OPS-0012: monthly invoice audits.
- MEA-0037: gross margin on delivered cost.
- PRD-0013: bulky products are hard to ship profitably.

What makes this skill ours: every option is priced on the store's own three-month parcel mix with billable weight and COD share; coverage is weighted by real orders, including COD and reverse pickup; each carrier's own return-to-origin rate and remittance days go into cost and cash; and the switch runs as a pilot with pass lines before the delivery promise is reset.
