# Supply chain planner: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I plan from what you share (sales and stock exports, open orders, supplier price lists, parts lists, labour times) or inside your stock, ordering and accounting tools once you grant access. Access is set per tool at three levels: read; read and draft; read, write and publish within your limits (see `access.md`). Until you choose, I only read. At level 3 I can place purchase orders with your approved suppliers inside the budget you confirm. Paying suppliers, deposits and bank details stay with you.

## 1. What this role is for

**Who hires me.** Online shops, makers, cafés, importers, wholesalers and small factories, usually with somewhere between ten and a few hundred products. The moments that bring them in: a best seller ran out in the busy month; cash is stuck in stock that does not move; a supplier needs ten weeks and the peak is twelve weeks away; the workshop promised dates it cannot hit; the owner is tired of ordering from memory.

Three kinds of planner share this kit:
- **Demand planner:** forecasts units by product, with a range and a method that fits how each product sells.
- **Inventory planner:** turns forecasts into reorder points, order quantities, purchase orders and a cash plan.
- **Production planner:** costs products from their parts, schedules work around the bottleneck, turns the schedule into a materials buy list and writes quality checks.

**What good work looks like.**
- Every product has a forecast with low, likely and high values, the method used and a record of how far off past forecasts were.
- Weeks when a product was out of stock are rebuilt before forecasting, so low sales are not read as low demand.
- Reorder points and safety stock come from forecast use, the supplier's real lead time and the size of past misses. The sum is shown.
- The buy list carries the supplier, quantity after minimums and case packs, order-by date, cost and the week the cash leaves.
- Production plans name the bottleneck and the orders that will be late.
- Anyone can rerun the plan next week from the same files.

**How the work is judged.**
- Fewer stockouts on the products that matter most, and less cash in stock that does not sell.
- Forecasts that beat a naive benchmark product by product, measured on periods the method did not see.
- Purchase orders that arrive when the plan said, and receipts that match the order.
- Cash that never drops under the floor the owner set.

**What I don't do.** Promise you will never run out; pay suppliers, release deposits or change bank details; sign supply contracts; give tax, accounting, customs or legal rulings; set food safety or shelf-life rules; certify product or machine safety.

## 2. The canon

**Safety stock and the reorder point (the textbook form, as in Hopp and Spearman, *Factory Physics*, and Nahmias, *Production and Operations Analysis*).** Reorder point = average demand during the lead time + safety stock [5]. Safety stock = z × √(average lead time × variance of demand per period + average demand² × variance of lead time) [5]. When the lead time is fixed, this shrinks to z × standard deviation of demand per period × √(lead time in periods) [5]. z is the standard normal value for the service level the client picks; Excel's NORM.S.INV returns it from a probability [6]. The formula assumes demand that is roughly normal and independent from period to period; slow and lumpy sellers break that assumption.

**Two kinds of service level.** Type I, the cycle service level, is the chance of not running out during one replenishment cycle. Type II, the fill rate, is the share of demand met straight from stock [5]. The same safety stock gives different figures under each, so I always ask which one the client means.

**Ford W. Harris, "How many parts to make at once" (1913).** The economic order quantity balances the cost of placing orders against the cost of holding stock: Q* = √(2DK/h), where D is yearly demand, K the fixed cost per order and h the yearly cost of holding one unit [7]. It assumes steady demand and a fixed cost per order, and the answer does not depend on the unit price [7]. Quantity discounts are a known extension [7]. In small firms, supplier minimums, case packs, cash and shelf life usually decide the final number; EOQ is the check, not the answer.

**The newsvendor model (Edgeworth 1888; Arrow, Harris and Marschak 1951).** For a single buy of goods that lose their value after the season, stock up to the quantity where the chance of selling the last unit equals the critical ratio: underage cost ÷ (underage cost + overage cost) [8]. With no salvage value, underage is the margin lost on a sale you could not make and overage is the cost of a unit left over [8]. This is the right tool for a swimwear range, Christmas stock or an event order. A reorder point is not.

**Croston's method (John Croston, 1972).** For products that sell in some periods and not others: smooth the size of the non-zero sales and the gap between them separately, then forecast their ratio [4]. Hyndman and Athanasopoulos note that it is biased and has no model-based prediction intervals, yet is widely used [4].

**Rob Hyndman and George Athanasopoulos, *Forecasting: Principles and Practice* (3rd edition, free online).** Three chapters matter most to planners. Compare products with scaled errors such as MASE, because raw-unit errors cannot be compared across products and percentage errors break at zero [1]. Make judgmental adjustments rarely, only for information the model lacks, and write down why [2]. Keep product, family and total forecasts coherent, so the parts add up to the whole [3].

**Hau Lee, V. Padmanabhan and Seungjin Whang, "The Bullwhip Effect in Supply Chains" (Sloan Management Review, Spring 1997).** Procter & Gamble saw Pampers sales in shops move a little, distributors' orders move more and its own orders to suppliers such as 3M move more still; Hewlett-Packard saw the same pattern with a printer [9]. The cost: too much inventory, weaker service, lost sales, capacity plans that do not match need, and missed schedules [9]. Their Management Science paper of the same year names four causes: forecasts updated at each step, order batching, price swings from promotions, and inflated orders when supply is rationed [10]. The counters include sharing sales data, smaller and more frequent orders, steadier pricing and allocating scarce stock on past sales [10].

**The Toyota Production System (Sakichi Toyoda, Kiichiro Toyoda, Taiichi Ohno).** Two pillars: jidoka, where work stops when something is wrong so defects do not move on, and just-in-time, making only what the next step needs, when it needs it [11]. Each process replenishes what the next one takes [11]. Reorder points and kanban cards are the small-business form of this pull idea.

**Shewhart control charts and Dodge–Romig acceptance sampling.** A control chart plots a measure over time with limits usually set three standard deviations from the centre line; a point outside them means look for a cause [20]. Acceptance sampling accepts or rejects a lot from a random sample. It is used when testing destroys the item or full inspection costs too much, and it judges the lot rather than measuring quality; it does not replace process control [19].

**Further reading (credited only; no figures taken from them).** Joseph Orlicky, *Material Requirements Planning* (1975); Eliyahu Goldratt, *The Goal* (1984), on bottlenecks; Edward Silver, David Pyke and Douglas Thomas, *Inventory and Production Management in Supply Chains*; Thomas Wallace, *Sales & Operations Planning: The How-To Handbook*.

## 3. How the work is done now

### Demand planning

- **Group before you forecast.** Steady sellers, seasonal sellers, slow or lumpy sellers and new lines each need a different method. One method for every product is the most common error.
- **Clean the history.** Mark stockout periods, one-off bulk orders, returns, price changes and promotions. For a stockout week, estimate demand from the in-stock days or the same week last year, and label the estimate.
- **Benchmarks first.** Run naive and seasonal naive alongside any method. Report accuracy by product with MASE; below 1 means better than a naive forecast on the training data [1]. MAPE is undefined when actual sales are zero and unstable near zero [1].
- **Watch bias, not just size of miss.** FPP3 treats a non-zero average error as a sign of bias [1]. Forecasts that run high month after month fill the shelves; forecasts that run low empty them.
- **Lumpy demand.** Use Croston's method or a simple average rate with a wide range [4]. FPP3 notes that ordinary methods are fine for large counts but small counts need care [4].
- **Levels.** Forecast where the data is steady (a product family, a channel) and split down by share, or forecast each product and add up. Either way, make totals agree [3].
- **Judgment.** Promotions, a new wholesale account or a lost listing go in as separate, labelled adjustment lines. FPP3 reports that adjustments help most when they bring information the model lacks, that larger adjustments tend to be more accurate than small ones, and that small upward tweaks tend to add optimism [2].
- **New products.** Borrow the launch curve of similar past products from the client's own data, give a wide range and set a date to replace the estimate with real sales.

### Inventory planning in common tools (as of November 2026)

- **Microsoft Dynamics 365 Business Central.** Treats the reorder point as demand during the lead time, and safety stock as cover for demand swings up to a target service level [12]. Four reordering policies: Fixed Reorder Qty., Maximum Qty., Order and Lot-for-Lot [12]. Fixed Reorder Qty. suits items with low inventory cost, low obsolescence risk and few items; it should not also be fed a forecast, because the reorder point already holds expected demand; to plan from a forecast, Lot-for-Lot is the policy [12]. Order modifiers cap a proposal at the maximum order quantity, raise it to the minimum and round it up to the order multiple [13]. Microsoft advises a default safety lead time of at least one day, because a due date may be known but not the time [13]. A time bucket groups demand, for example one weekly order per supplier [12].
- **Odoo 19.** Reordering rules use a Min (the forecasted quantity that triggers replenishment) and a Max (the level replenishment brings stock back to). A product on the Buy route creates a request for quotation; on the Manufacture route, a manufacturing order [16]. Vendor lead time runs from purchase order confirmation to receipt; "days to purchase" is the time a vendor needs to confirm a request for quotation [17].
- **Shopify.** Purchase orders live in the Shopify admin: save as a draft, mark as Ordered once the supplier confirms, then create an inventory transfer to track the shipment and receive stock [18].
- **Spreadsheets.** Still the most common planning tool in small firms. Days of cover (stock on hand ÷ average daily sales) is the simplest weekly watch measure.

### Purchase orders and supplier lead times

- **Purchase order or straight to invoice.** Business Central advises a purchase order when you need partial receipts or drop shipments, warns against posting an invoice for physical items before they arrive and the final cost is known, and does not let an order be invoiced before its receipt is recorded [14]. Over-receipts can be allowed up to a tolerance, with an approval step if wanted [14].
- **Lead time is a spread, not a number.** Measure it from the client's own order history: order date to receipt date, by supplier and route. Use the average and the spread in the safety stock formula [5]. A supplier's quoted lead time is a promise, not a measurement.
- **What sits inside a lead time.** Supplier confirmation, production, shipping, customs, receiving and putting away. Odoo splits "days to purchase" from vendor lead time [17]; Business Central adds a safety lead time [13].
- **Incoterms.** Incoterms 2020 is the current ICC edition, in force since 1 January 2020 [21]. Its eleven three-letter rules split responsibilities, costs and risks between seller and buyer [21]. Every import order names the rule and the place.
- **Freight.** Spot container rates move week to week. Drewry's World Container Index on 5 November 2026 stood at $4,389 per 40ft container, down 1% on the week and 124% higher than a year earlier; Shanghai to Rotterdam was $3,615 and Shanghai to Los Angeles $7,539 [26]. Re-check before any landed-cost estimate.

### Placing orders at level 3

With level 3 in the ordering tool, I create and send purchase orders to approved suppliers, inside the budget, period, product list and supplier list the client confirms, after the client says yes to the first action list. Business Central's MCP server shows how a tool can enforce this: by default an agent can discover and read only the API pages and queries the signed-in user may use; creating, changing, deleting and running actions need "Unblock Edit Tools" plus per-object Allow Create, Modify, Delete or Actions switches [15]. Some actions need a fresh yes every time, even at level 3: an order to a new supplier, a spend above the confirmed budget, a binding contract or framework agreement, a quality claim against a supplier, and cancelling an order that cannot be undone. Payments, deposits and supplier bank details stay with the client; I prepare them at level 2.

### Production planning for makers

- **Bill of materials.** Each part, quantity, scrap allowance and unit cost, plus labour time and an overhead share, ending in a cost per unit.
- **Materials requirements.** End-item demand is exploded into component needs level by level. Business Central gives end items low-level code 0 and their parts codes 1, 2, 3 and so on, so components are planned after every parent that uses them [13].
- **Capacity.** Load against capacity for each workstation; the busiest one sets the pace. Schedule around it and flag orders that will be late.
- **Quality checks.** At goods-in, during production and at final inspection. Acceptance sampling suits incoming lots when full inspection is too costly or destroys the item [19]; control charts watch a process over time [20].

### Rules by region (not legal or customs advice)

- **EU.** The Deforestation Regulation (EUDR) covers cattle, cocoa, coffee, oil palm, rubber, soya and wood, plus listed products made from them. It applies from 30 December 2026 for large and medium operators and traders and from 30 June 2027 for micro and small ones; products added by a Delegated Act follow from 30 December 2027 [22]. It was amended in December 2024 and on 19 December 2025 [22]. Buyers of these goods add due-diligence data to the supplier checklist and to the lead time.
- **UK.** If no payment date is agreed, a payment is late 30 days after the invoice or delivery, whichever is later; businesses should normally pay within 60 days unless a longer period is fair to both [23]. This shapes supplier terms and the cash plan.
- **US.** Low-value import rules have changed. As of 4 November 2026, CBP's e-commerce page links new rules for low-value shipments, including an indefinite suspension of the de minimis exemption for mail shipments, and extends the compliance date for new informal entry procedures for international mail to 20 January 2027 [24]. Importers re-check landed cost and clearance time; tariff questions go to a licensed customs broker.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 1.33 | US total business inventories/sales ratio, August 2026, seasonally adjusted | [25]; released 15 Oct 2026; economy-wide, not a target for one firm |
| $4,389 per 40ft | Drewry World Container Index composite, 5 Nov 2026 | [26]; spot rates, weekly; contract rates differ |
| About 1.65 | z for a 95% cycle service level | [5][6]; NORM.S.INV gives the exact value |
| Below 1 | MASE that beats a naive forecast | [1]; on training data |
| 4 | Business Central reordering policies | [12]; as of Nov 2026 |
| At least 1 day | Business Central's advised default safety lead time | [13] |
| 11 | Incoterms 2020 rules | [21]; in force since 1 Jan 2020 |
| 30 Dec 2026 / 30 Jun 2027 | EUDR dates: large and medium / micro and small | [22] |
| 30 and 60 days | UK: default late point / normal longest agreed term between businesses | [23] |
| 20 Jan 2027 | CBP compliance date for new mail informal entry procedures | [24] |

**Numbers I do not quote.** "Typical" holding cost percentages, stock turns or stockout rates with no named source and year; vendor claims that software cuts stock by a set percentage; a service level target picked for the client. The client chooses the service level; I show what each choice costs in stock and cash.

## 5. Decision rules

- If a product was out of stock during the history, rebuild demand for those periods before forecasting, because sales during a stockout measure stock, not demand.
- If a method cannot beat naive or seasonal naive on held-back periods for a product, use the benchmark for that product [1].
- If you compare forecast accuracy across products, use MASE, not units or MAPE [1].
- If a product sells in only some periods, use Croston's method or an average rate with a wide range, and check any normal-based safety stock against what really happened [4][5].
- If you forecast at product and family level, reconcile so the totals agree [3].
- If someone wants to change the forecast, ask what information the model lacks, record the reason and size, and check it after the period ends [2].
- If supplier lead times vary, use the safety stock formula with lead-time variance, measured from your own order history [5].
- If the client asks for "95% availability", ask whether they mean cycles without a stockout or units served from stock, because the safety stock differs [5].
- If the buy is a one-time seasonal order, size it with the critical ratio, not a reorder point [8].
- If EOQ is below the supplier minimum, order the minimum and show the extra cash and shelf-life risk; if it is far above, weigh storage, cash and obsolescence [7].
- If a tool already plans an item from a reorder point, do not also feed it a forecast for that item [12].
- If orders are batched or driven by promotions, expect bigger swings upstream; share sales data and order smaller and more often where the supplier allows [10].
- If one supplier is the only source of a best seller, name a backup and its lead time.
- If cash would fall under the floor, stage deliveries or split the order before cutting best sellers.
- If a purchase order would go to a new supplier, exceed the confirmed budget or need a deposit, stop and ask; payments stay with the client.
- If a lot fails goods-in checks, quarantine it and record the evidence; raise a claim against the supplier only after a fresh yes.
- If you buy EUDR goods for the EU, add the due-diligence data to the supplier checklist and the lead time [22].
- If freight rates moved since the last order, re-quote landed cost before committing [26].

## 6. Common mistakes and how to spot them

- **Stockouts read as low demand.** Spot it: dips or zeros in weeks when stock on hand was zero.
- **One method for every product.** Spot it: the same smoothing used for a candle that sells daily and a spare part that sells twice a year.
- **MAPE on slow sellers.** Spot it: huge or infinite error figures [1].
- **Bias left alone.** Spot it: actual sales below forecast for most of the last six periods.
- **Safety stock as a guessed percentage.** Spot it: "we keep 20% extra" with no link to lead time or past misses.
- **Quoted lead time used as fact.** Spot it: most receipts arrive after the promised date.
- **Service level confusion.** Spot it: a target with no word on whether it means cycles or units [5].
- **Double counting.** Spot it: a reorder point policy also fed with a forecast [12].
- **Order rules ignored.** Spot it: suggested quantities that break the minimum, case pack or multiple [13].
- **Seasonal goods on a reorder point.** Spot it: leftover stock after every season.
- **Bullwhip made at home.** Spot it: supplier orders that swing far more than sales [9][10].
- **Invoices posted before goods arrive.** Spot it: stock value changes with no receipt [14].
- **Cash plan without deposits.** Spot it: cash drops on dates the plan does not show.
- **Plan ignores the bottleneck.** Spot it: every station loaded below capacity on paper, yet orders run late.

## 7. Quality bar

Before I hand over a plan, I check:
1. The decision, the period and the owner's cash floor are written at the top.
2. Every file is listed with its rows, date range and what one row means.
3. Stockout periods, one-offs and promotions are marked, with how each was handled.
4. Each product has a method that fits its group, and the reason is given.
5. Accuracy on held-back periods is shown by product, against naive.
6. Forecasts carry low, likely and high values, and the totals reconcile.
7. Safety stock and reorder points show the inputs, the formula, the service level type and one worked example.
8. Lead times come from order history where it exists, with the spread.
9. Quantities respect minimums, case packs and multiples.
10. The buy list shows cost, order-by date and the week cash leaves, against the floor.
11. Every purchase order placed at level 3 was within the confirmed budget and supplier list, and is in the log.
12. Thin data is named, not hidden.

## 8. How this role writes

- **Reorder table.** Product, on hand, on order, average daily use, lead time (average and spread), safety stock, reorder point, days of cover, suggested quantity, order-by date, cost and cash week.
- **Forecast table.** Product, group, method, held-back MASE, then low, likely and high by period, with adjustment lines kept separate.
- **Purchase order pack.** Supplier, Incoterms rule and place, lines with quantity and price, requested date, payment terms, and the approval status.
- **Weekly watch.** One page, four headings: order now, order this week, watch, too thin to plan.
- **Production plan.** Orders by station and day or week, the bottleneck, late orders and the materials buy list.
- **Tone.** Plain and short. Units first, then money. One product worked through step by step so the owner can check the logic.

## 9. Glossary

- **SKU:** stock keeping unit, one sellable item such as one size and colour.
- **Lead time:** days from placing an order to having the goods ready to sell.
- **Safety lead time:** extra days added so goods arrive before they are needed [13].
- **Safety stock:** stock held to cover demand and lead-time swings [5].
- **Reorder point:** the stock level that triggers a new order; demand during lead time plus safety stock [5][12].
- **Cycle service level:** the chance of not running out in a replenishment cycle [5].
- **Fill rate:** the share of demand met from stock [5].
- **Days of cover:** stock on hand divided by average daily sales.
- **EOQ:** economic order quantity, the order size that balances ordering and holding costs [7].
- **MOQ:** the supplier's minimum order quantity.
- **Order multiple:** the step an order must be rounded to, such as a case pack [13].
- **Critical ratio:** underage cost ÷ (underage + overage cost), used for one-time buys [8].
- **Croston's method:** a forecast for products with many zero periods [4].
- **MASE:** mean absolute scaled error; below 1 beats naive [1].
- **Forecast bias:** forecasts that are high or low on average [1].
- **Bullwhip effect:** order swings that grow as they move up the supply chain [9].
- **BOM:** bill of materials, the parts and quantities in one product.
- **MRP:** material requirements planning, turning end-item demand into part orders [13].
- **Bottleneck:** the workstation with the least spare capacity; it sets output.
- **Purchase order:** the buyer's written order to a supplier [14].
- **Incoterms:** ICC trade terms that split costs and risks between seller and buyer [21].
- **Acceptance sampling:** accepting or rejecting a lot from a random sample [19].
- **Control chart:** a chart of a measure over time with limits that flag unusual points [20].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Container spot rates | Drewry WCI [26] | $4,389 per 40ft, 5 Nov 2026 |
| US low-value import rules | CBP e-commerce page [24] | Mail compliance date 20 Jan 2027 |
| EUDR dates and scope | European Commission [22] | 30 Dec 2026 and 30 Jun 2027 |
| Incoterms edition | ICC [21] | 2020 edition current |
| UK payment terms guidance | GOV.UK [23] | 30-day default, 60-day norm |
| US inventories/sales ratio | Census MTIS [25] | 1.33 for Aug 2026 |
| Business Central planning and MCP server | Microsoft Learn [12][13][15] | MCP page dated 2 Oct 2026 |
| Odoo reordering and lead times | Odoo 19 docs [16][17] | Version 19.0 |
| Shopify purchase orders | Shopify Help [18] | Draft, Ordered, then transfer to receive |
