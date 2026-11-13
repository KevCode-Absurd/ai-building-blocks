---
name: choose-3pl-or-self-fulfil
description: "A fulfilment decision for the store: keep packing in-house, hire help, move to a third-party warehouse (3PL) or split the two, with the full cost per order of each option at today's volume, at double and at peak, the quality and risk checks that matter more than price, a request-for-pricing pack to send 3PLs, the questions to ask them, and the service terms to put in the contract. Use when packing eats the founder's day, orders are growing fast, peak season is coming, delivery is slow or error-prone, or a 3PL quote arrives and needs checking."
---

# Choose a 3PL or fulfil in-house

**You get:** a one-page decision (stay, hire, outsource or split) with cost per order for each option at three volumes, a scored comparison of up to three 3PL quotes, a ready-to-send request-for-pricing pack, a question list for 3PL calls, and the service terms to put in the contract.

## When to use

- The founder or team spends more than about 2 hours a day packing, or orders queue past the ship-by time.
- Orders are rising fast, or peak season is within 3 months.
- Errors, damage or late dispatch are showing up in reviews and tickets.
- A 3PL quote has arrived and nobody knows if it is good.
- The current 3PL is missing promises and the owner wants options.

## Not for

- Choosing couriers and shipping aggregators: use `compare-shipping-carriers`.
- Writing the daily packing routine: use `pick-pack-ship-sop`.
- Amazon FBA planning: use `plan-fba-inventory`.
- Return-to-origin rules for COD orders: use `cut-rto-on-cod-orders`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 12 months: Created at, Name, Lineitem sku, Lineitem quantity, Shipping Province, Shipping Zip, Payment Method. Gives orders per month, units per order and where orders go.
2. **Product list** with weight, box size, value and any special handling (fragile, liquid, battery, expiry date, gift wrap, kitting).
3. **Current fulfilment costs:** packing hours per week and who does it, wage or the owner's hourly value, packaging cost per order, rent or space, shipping invoices for 3 months.
4. **Errors and damage** from the last 3 months: wrong item, missing item, damaged, late dispatch, with counts.
5. **Forecast** of monthly orders for 12 months (from `forecast-demand-per-sku`).

Optional: 3PL quotes already received, stock on hand by SKU, the number of stock locations wanted.

Asking 3PLs for quotes is fine at level 1 with the client's go-ahead. Signing a contract, paying a deposit or moving stock needs the client's explicit yes.

## Before you start: the gates

1. **Delivered cost per order.** Pass when gross profit per order includes pick, pack and outbound shipping [MEA-0037]. Fail: build it first; a $100 product can look like 70% margin and be 24% once shipping and pick and pack are in [MEA-0023].
2. **Cash for the switch.** Pass when the store can pay set-up fees, a deposit, freight to the new warehouse and a month of overlap. Fail: plan the move after the cash forecast allows it.
3. **Timing.** Pass when the move finishes at least 8 weeks before peak, as a practitioner default. Fail: do not move in the run-up to peak; one missing customs document at a logistics provider cost a brand its Black Friday stock [OPS-0001].

## Steps

### 1. Size the work

From the export: orders per month (average, lowest, peak month), units per order, share of single-unit orders, SKU count, share going to each region or state. Write the minutes per order today (time a normal hour of packing and divide).

### 2. Cost in-house fulfilment per order

In-house cost per order = (packing hours x loaded hourly cost + packaging + space share + equipment and software + error cost) / orders + shipping per order.

- Count the owner's own hours at the wage of the person who would replace them, not zero.
- Error cost = errors per month x (reship cost + product cost + support time).
- Do it at today's volume, double and peak month. Staff core volume at the lowest month and cover peaks with flexible help; one practitioner sizes full-time payroll to about 12% of revenue in the lowest month [OPS-0010].

Options inside in-house: a part-time packer, a packing station layout, or batch packing at set hours. Often the first fix is a person, not a 3PL.

### 3. Send a request for pricing

Send the same pack to 3 to 5 warehouses so quotes compare. The pack holds: products with weights and box sizes, SKU count, monthly orders by month for 12 months, units per order, inbound pattern (pallets, cartons, containers, how often), destinations, returns volume, special handling, integrations needed (Shopify, marketplaces), and the go-live date. Ask for every fee in a per-unit format.

India notes: ask about COD handling, remittance cycle, return-to-origin processing and which cities they hold stock in. Holding stock in another state usually needs GST registration of an additional place of business there; confirm with the accountant before choosing a multi-city network. US notes: stock held in a state can create sales tax presence there; check with the accountant before splitting stock across warehouses.

### 4. Build the 3PL cost per order

3PL cost per order = (receiving + storage + pick fee per order + extra item fees + packaging + inserts and kitting + returns processing + monthly minimum or account fee + integration fees) / orders + their shipping rate per order.

- Receiving: per pallet, carton or unit; container unloading can carry extra charges if it waits.
- Storage: per pallet, shelf or cubic foot per month; slow stock makes this grow.
- Shipping: 3PLs pass on their own carrier rates, which vary widely by their total volume; compare the real rate for your top 3 box sizes and zones. Box size matters: a parcel over 1 cubic foot on USPS Priority Mail is charged by size when that beats weight [OPS-6287].
- Monthly minimum: at low volume this can make the cost per order jump.

Do it at today's volume, double and peak, using the same forecast as step 2.

### 5. Score quality and risk, not just price

The cheapest warehouse is not always the best. Score each 3PL 1 to 5 on:

| Factor | What to check |
|---|---|
| Accuracy | Error rate in writing; barcode scanning on receipt and on pick |
| Peak record | What happened in their last two peaks; a named escalation contact [OPS-0008] |
| Speed | Order cut-off time; picked-on-time promise |
| Fit | Similar products and order sizes to yours |
| Systems | Live stock view, Shopify sync, returns flow |
| Exit | Notice period, stock release terms, data export |
| References | Two current clients of similar size, called by the owner |

A 3PL that fails at peak can cost far more than any fee saving; one brand lost tens of millions in a single fourth quarter [OPS-0008].

### 6. Decide

- **Stay in-house** if its cost per order at double volume is within about 10% of the best 3PL and quality is good.
- **Hire help** if hours, not skill or space, are the constraint.
- **Outsource** if the 3PL wins on cost at double volume, scores 4+ on accuracy and peak, and the move fits before peak.
- **Split** when some products need special handling (fragile, high value, custom) and the rest are simple.

Write one recommendation and the runner-up in one line.

### 7. Put the promises in the contract

Service terms to request:

- Picked on time: orders before cut-off leave the same day, others next working day, with a credit when missed; at peak a 24 to 48 hour promise can slip to a week without one [OPS-0015].
- Pick accuracy target and who pays for mis-picks (product, reship, support time).
- Inventory accuracy with full or cycle counts at least twice a year.
- Damage and loss liability while stock is in their care.
- Peak plan in writing: staffing, cut-off dates, surge fees.
- Customs and import paperwork owner, if they receive imports.
- Data access and an exit plan.

Hand the contract to the client's lawyer; the agent does not sign or advise on law.

### 8. Plan the move and the audit

Move plan: freeze dates, stock count out and in, run both sites for a short overlap, update Shopify locations, test 10 orders end to end before switching all traffic. After go-live, audit the 3PL and courier invoices every month against order data; one operator estimates 30 to 40% of the brands he mentors are overcharged [OPS-0012].

## Checks before you hand it over

- Owner time is costed, not left at zero.
- Both options are costed at today's volume, double and peak.
- Every 3PL fee in the quote is in the cost per order, including minimums.
- Shipping rates compared on the store's real box sizes and destinations.
- Each 3PL has a quality and risk score with two reference calls planned.
- The move date is at least 8 weeks before peak or the plan says why not.
- India GST and US sales tax questions about stock locations are listed for the accountant.
- No contract signed and no stock moved without the client's yes.

## Output

1. **One-page decision:** the recommendation, cost per order for each option at three volumes, the top risk, the runner-up in one line, and the move date.
2. **Cost comparison table:** Option, Volume, Labour or pick fees, Packaging, Storage, Receiving, Shipping, Minimums and fixed fees, Errors, Cost per order, Gross profit per order after fulfilment.
3. **3PL scorecard:** 3PL, Accuracy, Peak record, Speed, Fit, Systems, Exit, References, Total, Notes.
4. **Request-for-pricing pack** ready to send.
5. **Call question list** (15 questions, grouped by cost, quality, peak, returns, exit).
6. **Contract terms list** for the lawyer.
7. **Monthly invoice audit template:** invoice line, rate in contract, units billed, units in order data, difference.

## Common mistakes

- **Owner's packing time counted as free.** Step 2 prices it at a replacement wage.
- **Comparing quotes at today's volume only.** Steps 2 and 4 use three volumes.
- **Missing the monthly minimum.** Step 4 adds every fixed fee.
- **Choosing on price alone.** Step 5 scores accuracy, peak record and exit.
- **Moving just before peak.** Gate 3 and step 8 set the timing.
- **Signing without picked-on-time terms.** Step 7 puts them in the contract.

## Sources

- OPS-0008: vet a 3PL on errors, peak throughput and escalation.
- OPS-0015: picked-on-time terms with penalties.
- OPS-0012: audit 3PL and courier invoices monthly.
- OPS-0001: a missing customs document cost a brand its peak stock.
- OPS-0010: payroll sized to the lowest month, flexible labour above.
- MEA-0037, MEA-0023: gross margin on delivered cost.
- OPS-6287: USPS dimensional weight above 1 cubic foot.

What makes this skill ours: both options are costed per order at today's volume, double and peak with the owner's time priced; a 3PL is scored on accuracy, peak record and exit terms before price; India GST and US sales tax effects of stock location are raised before a multi-site choice; and the move is timed away from peak with a monthly invoice audit after.
