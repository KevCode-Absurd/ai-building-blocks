---
name: supplier-scorecard
description: "A quarterly scorecard rating every active supplier on quality, delivery, cost and response from the store's own purchase orders, inspection reports, returns and invoices, with the money each supplier's failures cost in lost gross profit, a green, amber or red band, and a dated action for each weak one: corrective plan, extra inspection, backup qualification or volume shift. Use each quarter, before re-orders and annual price talks, or when stock-outs or returns point at a supplier."
---

# Supplier scorecard

**You get:** a quarterly scorecard sheet with one row per supplier (scores, band and the gross profit their misses cost), a one-screen summary, and an action list with owners and dates for every amber or red supplier, plus a short note to send each supplier.

## When to use

- End of each quarter, as a standing review.
- Before a large re-order or annual price talk with a supplier.
- After a stock-out, a failed inspection or a jump in returns on one product.
- When deciding whether to qualify a second supplier.

## Not for

- Choosing a new supplier from scratch: use `find-and-vet-suppliers`.
- Inspecting one lot: use `order-samples-and-quality-check`.
- Setting reorder points and safety stock: use `set-reorder-points-and-safety-stock`.
- Rating the 3PL or courier: use `choose-3pl-or-self-fulfil`.

## What you need

Required (read access, level 1):

1. **Purchase orders for the quarter**: supplier, SKU, quantity, order date, promised ship or delivery date, actual delivery date, quantity received.
2. **Inspection reports** or receiving checks: lot, units checked, defects by class.
3. **Shopify returns or refunds export** with return reasons and SKU, for the quarter and the previous quarter.
4. **Supplier invoices** for the quarter and the last price list.
5. **Message log** or email threads (for reply times and issues).

Optional: stock-out days per SKU from the inventory report, gross profit per unit from `calculate-landed-cost-per-unit` and `store-meta-math`, competing quotes from the last year.

If inspection data is missing, score quality on returns and receiving checks only and mark it "thin". If returns cannot be tied to a supplier (two suppliers for one SKU), split by lot or receiving date, or say the split is not possible. Sending the supplier notes is done by the client or at level 2 after approval; moving volume or ending a supplier needs the client's yes.

## Before you start: the gates

1. **Gross profit per unit known for each SKU.** Pass: from the landed cost sheet and delivery costs. Fail: compute it first; the cost of a supplier's misses is counted in lost gross profit, not revenue.
2. **Data covers the quarter.** Pass: at least one delivery per supplier in the quarter. Fail: carry the last score forward and mark "no delivery".
3. **Agreed standards exist.** Pass: each supplier has a written spec version, defect limits and promised lead times. Fail: score against what was promised in the purchase order and fix the gap with the supplier this quarter.

## Steps

### 1. Pull the four measures per supplier

**Quality (weight 40):**
- First-time inspection pass rate: lots passed / lots inspected.
- Defect rate found at inspection or receiving.
- Product-fault return rate: returns with a quality reason (broke, faulty, not as described, wrong size outside tolerance) / units sold, for stock from this supplier. Compare with the previous lot or supplier; a cost cut often shows up as returns a quarter later.

**Delivery (weight 25):**
- On time in full: deliveries on or before the promised date with the full quantity / all deliveries.
- Average days late.
- Real lead time versus quoted lead time.

**Cost (weight 20):**
- Price change since last quarter, per unit.
- Landed cost per unit versus the target.
- Charges not in the quote (surcharges, packaging, rework).
- Price against the market: the best competing quote in the last 12 months.

**Response (weight 15):**
- Median reply time in working hours.
- Issues raised and closed within the agreed time.

The weights are a practitioner default; test them. A store with a peak season or wholesale orders may weight delivery higher, because missing a retailer's order can end the relationship [OPS-0022].

### 2. Turn each measure into a 1 to 5 score

Set the bands once and keep them for a year so trends mean something. A starting set (practitioner default, test it):

| Measure | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|
| First-time pass rate | 100% | 95% or more | 90% or more | 80% or more | under 80% |
| On time in full | 95% or more | 90% or more | 80% or more | 70% or more | under 70% |
| Price change | down | flat | up under 3% | up 3 to 8% | up over 8% |
| Median reply | under 4 h | under 8 h | under 24 h | under 48 h | over 48 h |

Weighted total out of 100. Band: green 80 or more, amber 60 to 79, red under 60.

Keep the inspection record beside the score. Under the Z1.4 switching rules (the same tables as ISO 2859-1), 2 rejected lots out of 5 in a row move a supplier to tightened inspection, 5 straight passes return it to normal, and 10 straight passes can allow reduced inspection (`aql-sampling-plan-and-inspection-calls`). A supplier under 90% on time in full is on probation whatever its total.

### 3. Put a money figure on the misses

Scores rank; money decides. For each supplier, add up:

- **Stock-out cost:** stock-out days caused by their late deliveries x units a day x gross profit per unit. Use the sales rate from in-stock days only, since stock-out days understate demand [OPS-0014].
- **Defect cost:** defective units x landed cost, plus rework, plus return handling on product-fault returns.
- **Price drift:** price increase per unit x units bought.

Poor returns also cost future orders: 71% of consumers in a 2025 survey said a bad return makes them less likely to buy again [CXP-0007]. Note it; do not add a made-up figure for it.

Sort quality money into the four cost of quality buckets so the supplier review shows where it leaks: prevention (specs, golden samples, planning), appraisal (inspections, audits), internal failure (rework and scrap before delivery) and external failure (returns, complaints and refunds after delivery). External failure is the dearest; money spent on prevention and appraisal should push it down.

### 4. Decide the action per band

- **Green:** share the forecast early, ask for better terms on the next order (float is payment terms minus lead time [FIN-0005]), and keep them as first choice.
- **Amber:** send a corrective action request naming the measure, the number, the target and the date. Add a pre-shipment inspection to every lot until two lots pass.
- **Red:** start qualifying a backup now with `find-and-vet-suppliers`. Move volume in steps, starting with a small trial order, because a cheaper or new supplier can fail on its first real batch [COG-0009]. Do not drop a red supplier before the backup passes inspection on a real lot.

For any sole supplier, whatever its band, plan a second source and check the contract has continued-supply and most-favoured-customer terms [COG-0013]. Moving to another country is a lead time against cost decision; model the extra stock and cash a longer lead time needs before deciding [COG-0004].

Where two suppliers make the same product, split volume by score rather than evenly: the top supplier about 70% and the second about 30% is a common pattern, so the backup stays warm and both have a reason to improve.

Watch these early warning signs between scorecards, and start the backup plan when two appear: reply times creeping up, the usual contact leaving, sudden asks for bigger deposits or new bank details, quotes far below the market (often a sign of cash trouble), a big new customer taking the factory's capacity, or repeated small changes to materials or packing.

### 5. Share the score

Send each supplier its own scorecard (not others' names or numbers). Factories that know the buyer measures them and has alternatives tend to keep price and quality honest [COG-0003]. Praise the green measures as well as naming the weak one.

For the one or two suppliers that matter most, hold a short quarterly review on a call: the scorecard, the next two quarters' forecast, open corrective actions, cost-down ideas with how any saving is shared, capacity for peak season, and holiday plans (Chinese New Year usually costs 2 to 4 weeks, so agree mid-December order dates). Write the actions down with owners and dates and send them after the call.

### 6. Feed other plans

- Real lead times go to `set-reorder-points-and-safety-stock`.
- Price drift and landed cost go to `calculate-landed-cost-per-unit` and `monthly-store-pnl`.
- Red suppliers' products go to `rank-products-to-push-or-cut` if no backup exists.

### Tax paperwork and import notes

- **Tax paperwork:** add a paperwork line under response: correct VAT or sales tax invoices with the right tax numbers, and the transport papers the goods need. Where the store reclaims tax paid to suppliers (VAT in the UK and EU, goods and services tax in Australia and elsewhere), a wrong or missing invoice blocks that reclaim, which is a real cost; record it under cost.
- **Imports:** track customs holds and documentation errors under delivery (wrong codes, missing origin papers, unpaid duties); a single missing document can strand stock in peak season.

## Checks before you hand it over

- Every active supplier has a row, including ones with no delivery this quarter.
- Every score traces to a number from a named export or report.
- Quality uses product-fault returns, not all returns.
- Money figures use gross profit per unit, not revenue.
- Bands and weights are the same as last quarter, or the change is stated.
- Every amber and red supplier has an action, owner and date.
- Two-supplier products show the volume split and the reason.
- Any early warning signs seen this quarter are listed with the response.
- No supplier was dropped or volume moved without the client's yes.

## Output

**One-screen summary:** the number of suppliers in each band, the three biggest money losses from supplier misses this quarter, the actions due, and the change since last quarter.

**Scorecard sheet:**

| Supplier | SKUs | First-time pass rate | Defect rate | Product-fault return rate | On time in full | Avg days late | Real vs quoted lead time | Price change | Landed vs target | Median reply | Quality score | Delivery score | Cost score | Response score | Weighted total | Band | Stock-out cost | Defect cost | Price drift cost | Last quarter total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Action list:**

| Supplier | Band | Problem measure | Target | Action | Owner | Due date | Check date |
|---|---|---|---|---|---|---|---|

**Supplier note (fill per supplier):** "Here is your scorecard for [quarter]. Strong: [measure and number]. Needs work: [measure, number, target]. Please send a plan by [date]. Our forecast for next quarter is [units]."

## Common mistakes

- **Scoring by feel.** Step 1 ties every score to an export.
- **Counting all returns as quality.** Step 1 uses product-fault reasons only.
- **Ranking by score alone.** Step 3 adds the gross profit lost.
- **Dropping a red supplier overnight.** Step 4 moves volume after a backup passes a real lot.
- **Changing the bands each quarter.** Step 2 keeps them fixed for a year.
- **Keeping the score private.** Step 5 shares it so the supplier can fix it.
- **Waiting for the quarter to spot trouble.** Step 4 lists warning signs to act on between scorecards.
- **Splitting volume evenly.** Step 4 splits by score.

## Sources

- COG-0003: suppliers aware of alternatives keep price and quality honest.
- COG-0004: moving country trades lead time against cost.
- COG-0009: trial a new supplier small before moving volume.
- COG-0013: sole-supplier continued-supply and most-favoured terms.
- CXP-0007: poor returns cut repeat purchase.
- FIN-0005: float is payment terms minus lead time.
- OPS-0014: forecast from in-stock days.
- OPS-0022: missing a retailer's order can end the relationship.
- IndustryWeek, Supplier Scorecards: Choose These Metrics: https://www.industryweek.com/supply-chain/supplier-scorecards-choose-these-metrics-improve-your-partners-performance
- QualityInspection.org, Setting up a Supplier Evaluation System that Works in China: https://qualityinspection.org/supplier-evaluation-system/
- SQC Online, Switching Rules (MIL-STD-105E, Z1.4): https://www.sqconline.com/switching-rules-mil-std-105e-z14
- ASQ, What is Cost of Quality (COQ)?: https://www.asq.org/quality-resources/cost-of-quality
- QualityInspection.org, When a Chinese Factory Quote Is Too Low: https://qualityinspection.org/when-a-chinese-factory-quote-is-too-low-the-hidden-risks-for-buyers/
- QualityInspection.org, Chinese New Year: how to manage the disruption: https://qualityinspection.org/chinese-new-year-production-planning/

What makes this skill ours: supplier misses are priced in gross profit lost, not just scored; quality is measured on product-fault returns tied back to the lot; tax paperwork counts as a cost when it blocks a tax reclaim; and a red supplier is never dropped before a backup passes a real batch.

## Selling in India

- Check GST tax invoices carry a matching GSTIN and that e-way bills travel with the goods. Invoices missing from the supplier's GST returns block input tax credit; record that under cost.
