---
name: plan-fba-inventory
description: "An FBA stock plan for every Amazon product: daily sales from in-stock days only, the full lead time from factory to sellable at Amazon, a minimum and maximum weeks of cover at FBA, the send dates and box quantities for the next 90 days, and the fees each choice costs (monthly storage, aged inventory surcharge, low-inventory fee, inbound placement), all read from Amazon's current fee pages on the day. Splits stock between FBA and a cheaper holding place when that lowers total cost, checks Amazon's capacity limits, and ties ad spend to stock cover. Use before each reorder, before Q4 or a big sale, when storage fees jump, or after a stockout cost rank."
---

# FBA inventory plan

**You get:** a 90-day FBA plan sheet: for each product, sales per day, weeks of cover now, the date the next shipment must leave, units and boxes per shipment, the fee cost of holding more or less, and the flag list of products about to run out or age into surcharges, ready for the client and supplier to act on.

## When to use

- Before each reorder or FBA shipment.
- Six to ten weeks before Q4, Prime Day, or a big Indian sale period.
- Storage or aged inventory fees jumped on the last statement.
- A product ran out at Amazon and lost rank.
- Amazon lowered the account's capacity limit.

## Not for

- Reorder points for the store's own warehouse across all channels: use `set-reorder-points-and-safety-stock`.
- The cost per unit delivered to the warehouse: use `calculate-landed-cost-per-unit`.
- Turning slow stock into cash: use `clear-slow-moving-stock`.
- Cash for the purchase order itself: put it in `build-13-week-cash-forecast`.

## What you need

Required:

1. **FBA inventory data**: Seller Central Inventory, the FBA Inventory page or report (available, inbound, reserved, unfulfillable, inventory age).
2. **Sales by day per ASIN**, last 90 days, from Business Reports, with stockout dates.
3. **Lead times**: factory production, transit to the country, customs, prep, transit to Amazon, and Amazon's receiving time from past shipments (shipment created to units available).
4. **Current FBA fees**, read on the day from Seller Central's fee pages: fulfilment fee by size tier, monthly storage per cubic foot by season, aged inventory surcharge bands, low-inventory-level fee rule, inbound placement fee options. Amazon changed several of these in 2026; never use remembered figures.
5. **Unit size and weight** as Amazon measured them (Fee Preview report).
6. **Capacity limit** for the coming months (Capacity Monitor in Seller Central).

Optional: supplier MOQ and payment terms, a 3PL or own warehouse quote, planned promotions and ad budgets.

Reading is level 1. Creating shipments in Send to Amazon is draft work (level 2); confirming a shipment, paying placement fees, and placing purchase orders need the client's yes.

## Before you start: the gates

1. **Profit per unit known**, including fulfilment fee and storage [MEA-0037] [FIN-0007]. Fail: compute it in `build-sku-profit-sheet` first; a product that loses money should not get more stock.
2. **Cash for the order.** The purchase order and freight fit the cash forecast. Supplier terms set how long cash is out: payment terms minus lead time [FIN-0005]. Fail: smaller order or stage it.
3. **Clean sales data.** Stockout days are marked so they can be left out. Fail: mark them from the inventory history first.
4. **Capacity.** Planned units fit the limit for each storage type. Fail: hold the rest elsewhere and send in stages.

## Steps

1. **Daily sales from in-stock days only.** Units sold / days in stock, last 30 and 90 days. Days out of stock make demand look lower than it is [OPS-0014]. Add planned lifts (sale events, new ad budgets) as separate lines with dates.
2. **Full lead time.** Production + transit to the country + customs and prep + transit to Amazon + Amazon receiving. From Asia, production of 20 to 30 days plus 30 to 40 days by sea door to door is a common pattern, or 7 to 10 days by air, all before Amazon receiving [COG-0008]. Use the account's own receiving times from past shipments; a practitioner rule of thumb is 1 to 2 weeks normally and up to a month in Q4 (test it against your history).
3. **Set weeks of cover at FBA.** Hold 4, 8 or 12 weeks of stock by how steady demand is, plus 5 to 10 days of safety stock [OPS-0014]. Then check two limits:
   - **Minimum:** cover at FBA must last until the next shipment is available for sale, plus safety. Amazon also charges a low-inventory-level fee on some standard-size items when FBA stock runs low against recent sales; read the current rule and avoid falling under its line.
   - **Maximum:** stock older than Amazon's aged inventory thresholds draws a surcharge on top of monthly storage, and storage costs more per cubic foot in October to December. Keep units at FBA below what sells before the first surcharge band.
4. **Price the holding options.** For each ASIN, compare the cost per unit of holding the next 90 days of stock (a) all at FBA, (b) part at FBA and the rest in a 3PL, own warehouse or Amazon's own storage programme, sent in smaller shipments. Storage per unit per month = unit cubic feet x monthly rate. Add the extra inbound shipping and placement fees for more frequent sends. Pick the cheaper option that still meets the minimum cover.
5. **Schedule shipments.** Ship date = date cover falls to the minimum - (transit to Amazon + receiving). Purchase order date = ship date - (production + transit to the country + customs and prep). Write both for the next 90 days. Units per shipment = sales per day x days until the following shipment is available + safety - stock already inbound.
6. **Choose placement.** In Send to Amazon, compare the placement options: sending to fewer locations usually costs a placement fee, splitting across more costs more freight. Pick on total cost per unit and receiving speed. Label every unit with Amazon's FNSKU barcode unless the client chooses otherwise, so units are not mixed with other sellers' stock.
7. **Tie ads to stock.** When an ASIN's cover drops below its lead time, lower its ad bids or pause it, and do not run deals on it [ADC-0023]. Write this rule into `launch-amazon-ppc` and `harvest-amazon-search-terms` for that ASIN.
8. **Flag ageing and slow stock.** Units already in an aged band, or that will reach one before they sell at current speed, go to `clear-slow-moving-stock` or a removal order, whichever loses less. Days of inventory remaining = ending stock / average daily sales over 28 days, the same measure Shopify reports use [COG-6285].
9. **Q4 and big sales.** Move the PO date earlier by the extra receiving time Amazon shows in Q4. Do not send more peak stock than sells by early January: leftover units have already paid the higher October to December storage rate and keep ageing toward the surcharge.
10. **India notes (Amazon.in FBA).** The same logic applies; fees and storage rates are in rupees on Amazon.in's fee pages. Amazon's fees carry GST, usually claimable as input credit by a registered seller; confirm with the accountant. Pre-packaged goods must carry the Legal Metrology declarations before they are sent [COG-6264]. For big sale periods (festive season), Amazon.in sets inbound cut-off dates; work back from them.
11. **US notes.** Imports no longer enter duty free under the old low-value rule, so small air top-up shipments now carry duty; add it to the air option's cost [COG-6261].
12. **Hand over.** Show the sheet, the flag list and the purchase orders and shipments that need a yes this week.

## Checks before you hand it over

- Sales per day excludes stockout days.
- Lead time includes Amazon receiving from the account's own history.
- Every fee figure is dated today and taken from Amazon's pages, not memory.
- Cover at FBA sits between the minimum and the first aged band for every ASIN.
- Shipment and PO dates are worked back from when cover hits the minimum.
- Planned units fit the capacity limit by storage type.
- ASINs below lead-time cover have an ad rule attached.
- No PO, shipment or fee committed without the client's yes.

## Output

**One-screen summary:** ASINs at risk of stockout in 90 days (with dates), ASINs at risk of aged surcharge, POs and shipments due this week, capacity used, and the cheapest holding split.

**Plan sheet:** ASIN | Sales per day (in-stock) | Available | Inbound | Weeks of cover | Lead time (parts) | Min cover | Max cover | Next ship date | Units | Boxes | Next PO date | PO units | Holding option | Holding cost per unit | Flag.

**Fee block (dated):** Fee | Rate today | Source page | Applies to which ASINs.

**Shipment list:** Shipment | Ship date | ASINs and units | Placement option | Placement fee | Expected available date.

## Common mistakes

- **Averaging sales over stockout days.** Step 1 uses in-stock days only.
- **Lead time without Amazon receiving.** Step 2 adds it from the account's own history.
- **Old fee figures from a course or blog.** What you need item 4 reads them on the day.
- **Sending everything to FBA.** Step 4 prices a split against holding it all at Amazon.
- **Ads running on a product about to run out.** Step 7 ties bids to cover.
- **Peak stock that ages in January.** Step 9 sizes peak sends to what sells.

## Sources

- OPS-0014: forecast from in-stock days; hold 4, 8 or 12 weeks plus 5 to 10 days safety.
- COG-0008: production and sea or air lead times.
- ADC-0023: lower or pause ads when cover is below lead time.
- COG-6285: days of inventory remaining defined.
- FIN-0005: supplier float equals payment terms minus lead time.
- MEA-0037 and FIN-0007: what sits in product cost and what sits below it.
- COG-6264: India packaged-goods declarations.
- COG-6261: US low-value duty-free entry ended.

What makes this skill ours: every fee is read from Amazon on the day because the 2026 fee changes make course figures wrong; cover has both a floor and a ceiling set by fees, not one flat number; it prices a split between FBA and cheaper storage; and it writes the stock-to-ads rule into the ad skills.
