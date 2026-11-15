# Supply planning and logistics: craft principles

This book is for the people who keep a store's stock in balance with demand and cash: demand and inventory planners, landed cost and freight people, customs coordinators and fulfilment and shipping managers. Read it before any job that sets a forecast, a reorder, a purchase order, a freight booking, a customs file, a 3PL choice or a shipping rule; write the deliverable to it; and run the review checklist on the draft before hand-over.

## What great looks like

- Every purchase order is checked against the 13-week cash forecast before it is placed, and the plan says which week cash is lowest.
- Forecasts are built from in-stock days only, carry a low, base and high line, and beat a seasonal naive benchmark on held-out weeks.
- Lead time means order date to sellable in the warehouse, with named buffers for new suppliers, sea delays and factory holidays.
- Safety stock comes from forecast error and lead-time swings, with a service target set by product class, never a flat "two weeks extra".
- Stock is graded by how fast it sells, and slow grades have a dated plan to turn back into cash.
- Landed cost per unit uses the customs value rules of the market the goods enter, with every fee line named and dated.
- Freight options are compared all-in to the door, on the same scope, in cost per sellable unit and days.
- Every 3PL and carrier promise is written as a number with a penalty, and invoices are audited against orders each month.
- The delivery date shown to buyers is one the store beats at least nine times in ten.
- Any rule or rate that changes by date (tariffs, de minimis, fees) carries its source date and a recheck date.

## The principles

### 1. Check every purchase order against cash first, and fix a cash gap with supplier timing before cutting ads

**Why it works:** A store can show $2M of profit and still be about $1M short because $3M sits in stock that has not sold. The cash conversion cycle (inventory days plus receivable days minus payable days) shows the gap: at 182 + 5 - 45 days, the store pays for a jacket 142 days before the buyer pays it.

**How to apply:** Put each planned PO, deposit and balance into a rolling 13-week cash forecast with a cash floor. When a week dips under it, fix it in this order: move or split the PO, ask for a 20% deposit or longer terms, add a second supplier, then a short facility draw, and cut ad spend last. Price any terms trade as a yearly rate: paying 2% more to move from net 30 to net 60 costs about 24% a year, dearer than most bank lines.

**Judge it by:** Each PO shows the cash week it lands in and the lowest cash week after it. Weak work sizes orders on sales alone.

**Breaks when:** The store makes to order or dropships, so no cash is committed ahead of demand.

**From:** MEA-6253, MEA-6271, FIN-6431, MEA-6280, COG-6287, COG-6294, COG-6291, FIN-0005

### 2. Forecast from in-stock days only, and correct for stockouts, substitutes and phantom stock

**Why it works:** Sales are not demand. A month with 15 stockout days records half the true demand, and a model trained on it plans the next stockout. Across 50,000 store-product series, training on censored sales made forecasts run 7.37% low. And about 45% of shoppers switch to a substitute, which inflates its history.

**How to apply:** Mark every stockout day per SKU from inventory history; if none exists, treat zero-sale days on a steady seller as suspected stockouts. Work out the daily rate on in-stock days only. Take the lift out of substitutes' history for those days, and count that demand once. Flag any SKU marked in stock with no sales for over three times its normal gap: it may be phantom stock (one study found 65% of 370,000 retail stock records wrong). A UK homeware store whose best mug sold out for three weeks shows the corrected rate beside the raw one.

**Judge it by:** The sheet names stockout days per SKU and shows raw and corrected rates. Weak work averages the last 90 days of sales.

**Breaks when:** The SKU is truly seasonal or being discontinued, so silence is real.

**From:** OPS-0014, OPS-6630, OPS-6632, OPS-6633

### 3. Set reorder points on the full lead time to sellable stock, with named buffers

**Why it works:** Stores run out because they count production days and forget the rest. A typical import chain is 20 to 30 days of production plus 30 to 40 days door to door by sea, and in September 2026 only 50.6% of container ships arrived on schedule, late ones by 6.65 days on average (Sea-Intelligence; it swings 10 points within months, so recheck the latest monthly figure).

**How to apply:** Count from PO sent to units counted and sellable: approval, production, inspection, freight, customs and receiving. Add about 3 to 4 weeks to a new supplier's quote, about 2 for a regular one, and a week to sea legs. Around Lunar New Year, plan 2 to 4 lost weeks: order by mid-December to cover sales to April plus 15 to 30 days of safety stock. Reorder point = daily in-stock demand x full lead time + safety stock; 50 a day x 60 days + 500 = 3,500 units.

**Judge it by:** Each lead time is split into stages with a source for each, and every buffer is named. Weak work uses the supplier's quoted days.

**Breaks when:** The supplier is local and reliable, or the store holds consignment stock it pays for only on sale.

**From:** COG-0008, COG-6337, OPS-6690, COG-6333, COG-6399

### 4. Size safety stock from forecast error and lead-time swings, with the right one-sided z

**Why it works:** Safety stock covers two surprises: demand that misses the forecast and suppliers who land late. The spread of demand over lead time is the square root of (L x demand variance + daily demand squared x lead-time variance). In one textbook case an unreliable supplier took the needed buffer from 54 to 174 units.

**How to apply:** Use the spread of past forecast errors, not raw sales, scaled by the square root of lead time over the period measured (60 units a month over 3 months is 60 x 1.73 = 104). Add the lead-time term from the supplier's real arrival history. Multiply by a one-sided z: 1.28 for 90%, 1.65 for 95%, 2.05 for 98%, 2.33 for 99%. Using 1.96 for 95% overstocks by about 19%, and moving from 95% to 99% adds about 41% more buffer.

**Judge it by:** The sheet shows both terms and the z used. Weak work adds "two weeks extra" to every product.

**Breaks when:** Demand trends strongly or is promotion-driven, or late ships and high demand coincide at peak; plan the peak as its own scenario.

**From:** OPS-6659, OPS-6664, OPS-6660

### 5. Set the service target by product class, and say whether it is fill rate or cycle service

**Why it works:** A flat 95% target puts the same buffer on a slow, erratic accessory as on the hero. Classing SKUs by profit share (ABC) and steadiness (XYZ) puts cash where a stockout costs most. The target type matters too: in one case a 99% fill rate needed a safety factor of only 0.9, just an 81.6% chance of no stockout per cycle.

**How to apply:** Grade A, B, C by about 80%, 15% and 5% of gross profit (Shopify's report uses revenue, so re-rank by margin). Grade X, Y, Z by monthly coefficient of variation over 12 months (under about 10%, 10 to 25%, above 25%). Give A items high service, C items lower, and question stocking CZ at all. Use fill rate when a short unit just waits, and cycle service level when any stockout is costly. A 10% risk per cycle with 10 orders a year is about one stockout a year.

**Judge it by:** Every SKU shows class, target type and target. Weak work gives one number to all.

**Breaks when:** The range is small enough to review product by product, or under 12 months of history makes the XYZ variation meaningless; then grade by margin and judgement and revisit at a year.

**From:** MEA-6398, MEA-6399, COG-6285, OPS-6661, OPS-6663

### 6. Grade stock by sell-through age, and stop buying when open-to-buy hits zero

**Why it works:** Overstock kills cash quietly. In Blue Sense's reading of Allbirds' public results, revenue rose about 30% while inventory roughly doubled, ending in a $19.1M write-down and gross margin falling from 52% to 43%. Many launches sell their first 30 to 40% to the email list and fans, then stall.

**How to apply:** Grade each SKU by the days its stock will take to sell: A under 90, B 90 to 180, C 180 to 365, D over a year, and track the stock dollars in each grade monthly. Before each buying round compute open-to-buy at cost: planned sales plus planned markdowns plus planned ending stock, minus beginning stock, minus stock on order. At zero or below, stop ordering. Divide stock by average monthly sales: one practitioner holds a two-month ceiling, so $500,000 of stock on $1.5M a year (four months) needs a reason in a non-seasonal store. When adding a SKU, name the one it replaces.

**Judge it by:** The plan shows grade mix in dollars, open-to-buy per category and a retire list. Weak work reorders every SKU that sold.

**Breaks when:** Stock is built for a known peak or launch, or long lead times make higher cover planned, not excess.

**From:** COG-6289, COG-6286, COG-6290, OPS-6689, COG-6292, OPS-6688

### 7. Tie ad pressure to stock days, and turn grade C and D stock back into cash through paid media

**Why it works:** Ads pushed onto a SKU that will sell out anyway buy nothing, and a stockout mid-campaign wrecks delivery: in Google Shopping, a product holding 15% of spend going out of stock for four days can reset learning. Slow stock, meanwhile, locks cash even when the P&L shows profit.

**How to apply:** When a SKU has fewer days of stock than its reorder lead time, raise its return target or pause its ads, and tell the media buyer the date. In one Blue Sense example, putting 90% of a $100k budget on the fastest seller cut its contribution margin from $500k to $410k. Pull a fashion style from Shopping when its core size sells out. Push grade C and D stock through its own funnel at break-even or a small loss, via creator pages or a new market, so discounts do not cheapen the brand.

**Judge it by:** The media and stock plans share one SKU list with days of cover. Weak work ranks ads on return alone.

**Breaks when:** Spend is under about $50,000 a month, where one stock alert to the buyer is enough.

**From:** ADC-0023, GAD-6215, MEA-6385, GAD-6226, ADC-6199, FIN-0027, ADC-6180

### 8. Plan peak season about 70 days out, and lock down every partner and document before it

**Why it works:** Peak can carry most of a year's profit, so one failure there costs the year. One founder reports about 80% of annual profit in the Black Friday window, and a single missing customs document from his 4PL got stock seized going into it.

**How to apply:** By about 70 days out, pull last year's hourly and daily curves, set the November cost per new customer, model discounts and creative volume, and turn them into units per SKU; peak months can run 10 to 20 times base. Book freight early and audit every import and fulfilment document with each partner per region, with an owner on the store's side. Never switch 3PL or carrier just before peak, and agree written peak capacity. If stock cannot last, hide sold-out items and pull email and SMS pushes rather than sell out early: one brand did so because selling out into December would gut its ad accounts for months.

**Judge it by:** A dated peak calendar with units, freight bookings, document owners and a sell-out rule. Weak work starts in November.

**Breaks when:** Profit is spread through the year, or the business sells out on purpose.

**From:** OPS-6618, OPS-0001, OPS-0014, OPS-0019, OPS-0008

### 9. Build landed cost per unit on the customs value rules of the market the goods enter

**Why it works:** Each market charges duty and import VAT on a different base. The US charges duty on the price paid to the seller without international freight and insurance; the EU and UK add freight and insurance to the border, then charge VAT on value plus duty. A 2 to 3 point cost error on a $20M brand can wipe about $500K of profit.

**How to apply:** Landed cost per unit = (goods + freight + insurance + duty + import fees + broker + inland delivery) / units received sellable. Add packing, commissions, royalties and assists (moulds you supplied) to dutiable value. In a worked US example a $10 FOB unit landed at $16.12. Show whether the store reclaims import VAT. Use the exchange rate on the payment date. Enter the result as cost per item in the store before launch and update it each PO.

**Judge it by:** Each fee line is named, sourced and dated, with the value basis stated. Weak work adds a flat 20% "for shipping and duty".

**Breaks when:** A supplier sells duties paid and acts as importer; then check that this is allowed.

**From:** COG-6331, COG-6262, COG-6353, COG-6386, FIN-6439, FIN-6441, COG-6293, MEA-6402

### 10. Choose the import model per market from its low-value parcel rules, and recheck them every quarter

**Why it works:** Shipping each order from abroad paid only while small parcels entered duty free. The US suspended its $800 de minimis for non-postal modes from 24 June 2026, ending it by law on 1 July 2027; the EU charges €3 per item on parcels up to €150 from 1 July 2026, plus an expected €2 handling fee per item from 1 November 2026; the UK plans to end duty relief on parcels up to £135 by March 2029.

**How to apply:** For each market, cost two models side by side: ship each order from home, or import in bulk and fulfil locally. Bulk import pays duty on the cost of goods, not the retail price, so it usually wins once volume is steady. Note each rule's source date and a recheck date. Charging duties at checkout needs correct product codes and a carrier that ships duties paid, or buyers still get a bill on delivery.

**Judge it by:** Cost per order under both models for each market, with rule dates. Weak work quotes last year's thresholds.

**Breaks when:** A market's volume is too small to hold stock, or gifts follow other rules.

**From:** OPS-6647, COG-6288, OPS-6658, OPS-6656, OPS-6631, FIN-6438, SET-6204

### 11. Pick the freight mode on chargeable weight and cost per sellable unit, not on the quote total

**Why it works:** Freight bills on the greater of real and volume weight. Air divides centimetres L x W x H by 6,000, express by 5,000, and LCL counts a cubic metre as a tonne. Air rates also fall steeply with weight: Vietnam to the US in November 2026 cost about $115 a kg at 10 kg but $9 a kg at 300 kg.

**How to apply:** For each shipment, compute chargeable weight, cost per unit and door-to-door days for express, air, LCL and full container. Group small air orders into fewer, heavier ones. Move from LCL to a 20ft box once the all-in LCL quote reaches the container price. Use real capacity (about 33 cubic metres in a 20ft, 68 in a 40ft, 76 in a 40ft high cube) for units per box. Price carton size in money: at $3,504 per 40ft to Rotterdam, 6,000 units carry $0.58 each; a carton that fits 6,600 saves about $0.05.

**Judge it by:** One table in cost per sellable unit and days, by mode. Weak work picks the cheapest headline rate.

**Breaks when:** A stockout costs more than the freight saved; then speed wins.

**From:** OPS-6680, OPS-6682, OPS-6678, OPS-6687, COG-6400, COG-6377

### 12. Compare forwarder quotes only on the same scope, and read them against a public rate index

**Why it works:** Quotes look cheap by leaving lines out. Origin charges sit with the seller under FOB but with the buyer under EXW, and destination charges, US entry fees and free days at port vary by quote. Weekly spot indices show when a quote is out of line with the market.

**How to apply:** Ask every forwarder to itemise the same blocks: origin, main freight with surcharges, destination, entry fees (in the US, filing, bond, processing and harbour fees), and demurrage and detention terms with free days (about 8 for a full container versus about 5 at port plus 7 at an LCL warehouse in one forwarder's guide). Compare two or three forwarders per shipment. Check the main freight line against Drewry's weekly World Container Index or the daily Freightos Baltic Index for that lane; both are port-to-port spot rates without local charges.

**Judge it by:** A quote grid with the same rows filled for every forwarder, and the index value with its date. Weak work compares bottom lines on mixed terms.

**Breaks when:** Small courier shipments with one all-in price, or contract rates with fixed surcharges.

**From:** OPS-6681, COG-6381, OPS-6678, OPS-6672, OPS-6679, OPS-0011

### 13. Buy on the Incoterm that fits the cargo, and write what Incoterms leave out into the PO

**Why it works:** The wrong Incoterm hides cost or risk. FOB suits bulk cargo loaded onto a ship; for containers, risk under FOB passes only on board, after the goods left the seller's hands at the terminal. EXW makes the buyer load and clear export abroad. DDP asks a foreign seller to clear import, which some countries do not allow.

**How to apply:** For container goods buy FCA (named terminal or factory) rather than FOB; avoid EXW across borders; prefer DAP to DDP so the store or its broker clears import. Under CIF the seller need only buy minimum cover (Institute Cargo Clauses C), so ask for clauses A at 110% of invoice or insure the cargo yourself. Incoterms do not decide when title passes, how payment works, what happens if goods are late or faulty, or how disputes are settled: write those in the PO.

**Judge it by:** The PO names the Incoterm with a place, the insurance level and late and fault terms. Weak work writes "FOB China".

**Breaks when:** A courier or platform ships door to door on its own fixed terms.

**From:** COG-6297, COG-6296, COG-6295, COG-6327, COG-6410

### 14. Classify each product yourself in each import tariff, and get a binding ruling for any line with real duty

**Why it works:** Only the first 6 digits of a product code are shared worldwide; the US, UK and EU add their own. In the US the importer of record, not the broker or supplier, carries the duty of care, and negligent misclassification can cost up to twice the lost duty, cut to interest if the store discloses it first.

**How to apply:** Classify with the General Rules of Interpretation in order: heading words and section and chapter notes first, then the rules for parts, sets and mixtures, subheadings last. Write the reasoning down. For high-duty or high-volume lines, ask for a binding ruling before shipping: CBP usually answers in about 30 days, HMRC in 30 to 120 days, and an EU Binding Tariff Information decision binds every member state for 3 years. Recheck codes when a product changes material or function.

**Judge it by:** A code per product per market with the rule applied, and a ruling where it matters. Weak work reuses the supplier's code everywhere.

**Breaks when:** A supplier acts as importer, or the goods have already cleared.

**From:** OPS-6685, OPS-6670, OPS-6686, OPS-6671, OPS-6684, OPS-6657

### 15. Run every US import from a dated checklist: filing, bond, entry deadline and the full duty stack

**Why it works:** US entry has hard clocks and stacked duties. The ocean security filing is due 24 hours before loading abroad ($5,000 damages per violation). Entry is due within 15 days of landing, or goods go to a general order warehouse at the store's cost. Chinese goods stack normal duty, older Section 301 duties (mostly 25% on lists 1 to 3) and the 12.5% Section 301 duty added on China, Vietnam and Turkiye from 24 July 2026.

**How to apply:** Set dates per shipment for filing, entry and payment. Once imports are regular, hold a continuous bond (the greater of $50,000 or 10% of last year's duties, taxes and fees). Add the processing fee (0.3464%, $34.58 to $670.86 per formal entry from 1 October 2026) and, by sea, the harbour fee (0.125%, no cap). Check the invoice shows origin, every charge and assists.

**Judge it by:** A dated checklist per shipment with the duty stack line by line. Weak work quotes the supplier's single duty rate.

**Breaks when:** Goods come by air or land (no ocean filing or harbour fee), or an exclusion applies; the last China exclusions ran only to 9 November 2026, so confirm any is live.

**From:** OPS-6667, OPS-6674, OPS-6677, OPS-6634, OPS-6668, OPS-6648, OPS-6676, OPS-6673, OPS-6662

### 16. Write every 3PL promise as a number with a penalty, and audit its invoices against orders monthly

**Why it works:** A 3PL is a single point of failure at peak, and its bills are hard to read. One founder lost tens of millions of Q4 revenue when a 3PL collapsed; at Black Friday a 24 to 48 hour pick promise can slip to 7 days; and the same operator estimates 30 to 40% of the brands he mentors are overcharged by 3PL or courier invoices.

**How to apply:** Vet 3PLs on error rate, proven peak throughput, a named escalation contact and past Q4 surges; visit two or three. Put picked-on-time, ship-by and accuracy standards in the contract with money penalties, plus cycle counts at least twice a year. Each month, match 3PL and courier invoices to store orders: storage, picks, packaging, surcharges, weights. Investigate when on-time delivery falls under 95%. Cost each option per order at today's volume, double and peak.

**Judge it by:** An SLA table with metric, target, penalty and data source, and a monthly variance log. Weak work compares rate cards only.

**Breaks when:** Volume is small and flat, where in-house packing or one small 3PL is cheaper.

**From:** OPS-0008, OPS-0015, OPS-0012, OPS-6681

### 17. Price every parcel on dimensional weight and real box sizes, and compare shipping collected with shipping paid by market

**Why it works:** Carriers bill on the greater of real and volume weight, so air in the box is paid for; USPS Priority Mail, for example, divides cubic inches by 139 above one cubic foot. Checkout rates that miss box sizes undercharge every order quietly. In one Blue Sense client, US orders cost about $26 to ship and the free-shipping line lost about $23 per US order.

**How to apply:** Save each box with its empty weight and size and assign it to products. Use the smallest box that passes a drop test for the weight. Each month, by country, set shipping collected beside carrier and fulfilment cost per order. Use bundles: a second unit adds only about 20% to shipping (one unit $12, two $14, three $17 in one example), which can fund part of a bundle discount. Check each carrier's current divisor before quoting; they change.

**Judge it by:** A per-market table of collected versus paid per order, and a box per SKU. Weak work quotes one average shipping cost.

**Breaks when:** Flat-rate services price by box, not weight; then fit the product to the box.

**From:** OPS-6287, SET-0007, OFF-6665, OFF-6634, COG-6324

### 18. Add a second warehouse only when the shipping and speed gain beats the extra safety stock it forces

**Why it works:** Each site must cover its own demand swings, so total buffer rises roughly with the square root of the number of sites: two even, independent sites need about 1.41 times the safety stock of one (Maister's square root law). A closer site cuts cost and days per order.

**How to apply:** Take last quarter's orders by region with cost and days per order (principle 17), and estimate the share the new site would serve and what it saves on each. Cost the split: safety stock value x 0.41 x holding rate, plus the site's fixed fees and the second inbound leg. Split only when the yearly saving is larger, and stock only fast A items in both. A US brand on one West Coast 3PL runs this before adding an East Coast one, since US buyers expect about two days.

**Judge it by:** A regional table of cost and days now versus split, with the added safety stock in dollars. Weak work adds a site because faster sounds better.

**Breaks when:** Regional demand moves together, sites refill in full loads, or volume is too thin to keep both stocked. Treat 1.41 as an upper bound; case studies find the law often overstates it.

**From:** CXP-6609, OFF-6665, SET-0009, https://emerald.com/insight/content/doi/10.1108/eb014366/full/html

### 19. Show a specific delivery date the store beats nine times in ten, with a reasonable basis for every ship time

**Why it works:** Speed and certainty are part of the offer. In Baymard's latest study, of shoppers who abandoned for reasons other than browsing, 20% said delivery was too slow and 40% said extra costs were too high. A research summary credits specific dates with 13 to 25% more conversion than vague ranges. Under the FTC mail order rule a US store needs a reasonable basis for any stated ship time, and must ship within 30 days if it states none.

**How to apply:** Build the promise from order cut-off, pick time and carrier transit by zone. Pad it so the store usually beats it, and track accuracy weekly with a 90% floor. US buyers expect about two days; if the store cannot meet that, state real times on landing pages and in post-purchase emails. If slow delivery drives drop-off, test showing estimates against hiding them. On Amazon seller-fulfilled orders, keep late shipments under 4%.

**Judge it by:** The promise shows its inputs and measured hit rate. Weak work copies the carrier's best case.

**Breaks when:** Goods are made to order, where a clear production window replaces a date.

**From:** CXP-0010, CXP-6160, CXP-6609, CRO-6611, AMZ-6443, https://baymard.com/blog/cart-abandonment-rate-statistics

### 20. Run returns as their own profit line, costed in full and booked against the order that caused them

**Why it works:** Returns cost more than the refund. On a $150 order the returns line shows about $22, but adding the original outbound shipping and the card fee that is not refunded makes it about $34. Shopify books returns on the refund date, so a big month is followed by a false dip, and January can show a false 20% return rate.

**How to apply:** Cost each return as refund, outbound and return shipping, unrefunded fees, handling and the share that cannot be resold. Accrue expected returns daily at the expected rate, then reconcile monthly. Log a reason on every return; send defect reasons to the factory and claim reasons to the ad team. Budget US fashion returns at up to double other markets. For low-value items, test refund without return; a return can cost 20 to 65% of item cost. Keep refunds fast: 71% of shoppers say a poor return makes them less likely to buy again.

**Judge it by:** Return cost per order by SKU and reason, on an order-date basis. Weak work quotes the refund total.

**Breaks when:** Returns are rare; then check quarterly.

**From:** MEA-6276, MEA-0028, MEA-0011, CXP-6612, COG-6323, MEA-6266, CXP-0018, CXP-0007

### 21. Make any forecast method beat a seasonal naive benchmark on held-out weeks, scored with the right error measure

**Why it works:** Complex forecasts often lose to simple ones: in the M5 Walmart competition only 7.5% of 5,507 teams beat plain exponential smoothing. MAPE, the measure most tools show, is undefined when a week sells zero and punishes over-forecasts more, so it misleads on slow SKUs.

**How to apply:** Hold back about 20% of history, and at least the horizon you plan (10 weeks lead time plus 8 weeks cover means an 18-week test). Compare the method with seasonal naive (each week equals the same week last year) and simple exponential smoothing. Score with MASE, where below 1 beats naive, or RMSE for stock decisions, since MAE rewards forecasting zero on slow SKUs. Averaging sound methods often wins: in a textbook test a three-method average scored RMSE 41.0 against 46.2, 64.1 and 122. Track bias as the average signed error over 8 to 13 weeks and remove it.

**Judge it by:** A test table with benchmark, method and score. Weak work quotes in-sample accuracy.

**Breaks when:** The product is under a year old or last year had stockouts in the same weeks.

**From:** OPS-6654, OPS-6646, OPS-6638, OPS-6639, OPS-6652, OPS-6640, OPS-6642

### 22. Feed planned promotions and events into the forecast as inputs, give a range, and override by hand only with hard facts

**Why it works:** History cannot tell a promo spike from real demand; in M5, adding event dates made smoothing 6% and ARIMA 13% more accurate. Manual tweaks usually hurt: across 60,000+ forecasts at four supply-chain firms, small adjustments often reduced accuracy and upward ones helped far less than downward ones.

**How to apply:** Keep a dated log of past and planned promotions, launches, ad pushes and holidays, and model each as an event with its own lift. Flag sales outliers only beyond 3 IQR of the robust remainder, and find the cause before replacing any; a yearly event belongs in the forecast. Damp trends (phi 0.8 to 0.98) so growth does not run away. Give every line a range: forecast plus or minus 1.28 times the error spread for 80%, widening with horizon. Override by hand only with facts the model lacks, such as a signed wholesale order.

**Judge it by:** Each line names its events and range, and each override names its evidence. Weak work multiplies last year by a growth guess.

**Breaks when:** Promotions are rare and tiny, or the event log is incomplete.

**From:** OPS-6651, OPS-6635, OPS-6644, OPS-6643, OPS-6645

### 23. Forecast slow and lumpy SKUs with intermittent methods, and forecast totals with seasonal ones

**Why it works:** A SKU that sells in some weeks and not others breaks ordinary methods. Croston-type methods forecast order size and gap separately. In M5, Croston beat seasonal naive by 27% at product-store level, yet seasonal naive won by 37.8% at the total.

**How to apply:** Classify each SKU by average gap between sales (ADI) and squared variation of non-zero sizes (CV squared). Use Croston only if ADI is 1.32 or less and CV squared 0.49 or less; otherwise use the bias-corrected SBA. For example, 4 units per sale every 5 weeks forecasts 0.8 units a week. Watch fading products with the TSB variant, which lowers demand probability each week without a sale; review any SKU whose probability falls below half its 26-week average. Forecast the store or category total with a seasonal method and reconcile SKUs to it.

**Judge it by:** Each SKU shows its demand class and method. Weak work runs one method across the catalogue.

**Breaks when:** Zeros come from stockouts or delisting, or monthly buckets make sporadic SKUs look smooth.

**From:** OPS-6649, OPS-6641, OPS-6650, OPS-6653

### 24. Choose order size on total yearly cost, and take a price break only when that total falls

**Why it works:** Unit price is the wrong test. The economic order quantity, square root of (2 x yearly units x cost per order / holding cost per unit per year), balances ordering and holding, and the cost curve is flat near it: ordering 20% off adds only about 2%. In a textbook case a 4% discount at 500 units raised total yearly cost about 2.5% against buying 53 at a time.

**How to apply:** Use EOQ as a starting point with rough inputs, then adjust for minimums, container fill and cash. For each price break, compare total yearly cost (price plus ordering plus holding, at a holding rate that includes cost of cash, storage and obsolescence). Work out the break-even discount and use it as a negotiating anchor (6.4% in the textbook case). When a supplier's minimum is far above EOQ, price the cash tied up and the extra stock days before agreeing.

**Judge it by:** A total-cost line for each order size offered. Weak work takes the biggest discount.

**Breaks when:** Demand is highly seasonal or short-lived, cash is the binding limit, or freight minimums set the size.

**From:** OPS-6665, OPS-6666, COG-6362, COG-6363

### 25. Size one-season buys with the critical ratio, not the average forecast

**Why it works:** A seasonal or one-shot buy (a holiday gift set, a summer style) cannot be topped up, so the right quantity depends on which mistake costs more. The newsvendor rule sets the order so the chance of covering demand equals underage cost divided by underage plus overage cost: underage is margin lost per missed sale, overage is cost minus salvage per unsold unit.

**How to apply:** Take the forecast's mean and spread for the season. Work out underage cost (price minus landed cost, plus knock-on cost such as a retailer's empty shelf) and overage cost (landed cost minus what a leftover unit fetches when cleared). Order the mean plus z times the spread, where z matches the ratio. A high-margin gift set with good clearance value earns a ratio near 0.8 and an order above the mean; a thin-margin, dated item may fall below 0.5. Retailer purchase orders usually justify erring high, since an unfilled one can end the relationship.

**Judge it by:** The buy shows both costs, the ratio and the quantity. Weak work orders the forecast.

**Breaks when:** Reorders are possible within the season, where reorder points apply instead.

**From:** OPS-0022, OPS-0014, https://ocw.mit.edu/courses/15-772j-d-lab-supply-chains-fall-2014/6952be57b43aa185119c6f114908bcc5_MIT15_772JF14_Newsboy.pdf

### 26. Map each cost line to a public price series, and forecast cost with its lag and pass-through

**Why it works:** Input moves reach factory prices slowly and partly: the ECB estimates about half a year before the first effect, with only about a quarter passed through then. Raw cotton rose about 23% in the year to September 2026 while US broadwoven fabric prices rose only 6.5%.

**How to apply:** For each BOM line, name a public series (a commodity price, a producer price index, a container freight index, an exchange rate), its weight in unit cost, update day and lag. Index only the share an input drives: if fabric is half of FOB, a 6.5% fabric rise is about 3%. Build low, base and high cases from each series' volatility. Outside the US, watch the home currency against the dollar: a 1% fall lifts import prices about 0.6 to 0.8% within a year. Write index clauses with base month, named index and code, and which release counts.

**Judge it by:** A cost map with series, weight and lag, and dated 3, 6 and 12 month cases. Weak work accepts a quoted rise.

**Breaks when:** The factory prices on local labour or capacity no public index tracks.

**From:** COG-6378, COG-6308, COG-6329, COG-6389, COG-6364, COG-6367, COG-6368, COG-6306

### 27. Handle backorders and pre-orders inside the law, and keep stock settings honest

**Why it works:** Selling stock you do not have is legal only on set terms. Under the FTC rule a US store facing a delay may only ask the buyer to agree to wait or refund in full; it may not ship a different item or pay the refund as store credit without prior agreement. A plain "continue selling when out of stock" setting takes full payment with no promise attached.

**How to apply:** Use a pre-order setup that can take full, partial or no payment and states a ship window built on the inbound tracker. Turn on stock tracking for every sold variant. When a delay hits, message buyers before they ask, with the new date and the choice to wait or get a full refund. Keep WhatsApp delay messages free of offers if sent as utility templates, or they count as marketing. Selling out works as proof only when restock takes about two weeks or less.

**Judge it by:** Every pre-order line has a dated ship window and a delay message ready. Weak work leaves overselling on.

**Breaks when:** Buyers agreed in advance to a substitute or credit, or the sale falls outside the rule.

**From:** OPS-6281, OPS-6282, OPS-6283, OPS-6286, ORG-0038

### 28. Run one monthly planning cycle that joins demand, supply and cash, and share real demand upstream

**Why it works:** Each link in a supply chain that orders in batches, reacts to price swings or games shortages makes orders swing more than sales: the bullwhip effect described by Lee, Padmanabhan and Whang in 1997. A store that orders by gut feeling passes that noise to its factory and gets it back as missed lead times and price rises.

**How to apply:** Run a monthly sales and operations plan in five steps: product review (launches and retirements), demand review, supply review, financial check against the cash forecast, and a decision meeting that settles the gaps. A small store can run it as four weekly checkpoints inside a 15 to 30 minute weekly finance meeting. Share a rolling 6 to 12 month forecast with key suppliers in exchange for steady capacity or a pricing formula, and order in smaller, regular batches where freight allows. When a supplier rations stock in a shortage, order what the forecast needs, not more to win a bigger share; inflated orders come back as cancellations and false demand.

**Judge it by:** One dated plan where units, POs and cash agree, with an owner per gap. Weak work has a forecast, a buy list and a cash sheet that do not match.

**Breaks when:** The business makes to order or dropships.

**From:** OPS-6637, FIN-6433, COG-6344, https://sloanreview.mit.edu/article/the-bullwhip-effect-in-supply-chains/

## Working from the org context

- Read what the brand promises about delivery, returns and stock (free shipping line, delivery days, return window, "made to order", "limited drop") before changing any rule; those promises are part of its offer and its voice.
- Take the products the org context marks as heroes, gifts or seasonal lines and plan them first; a hero that sells out costs ads, reviews and rank, not only units.
- Read what ran and won: past sale dates, launches and ad pushes become the event log for the forecast, and past winners need stock before they are relaunched.
- Use buyers' own words from reviews and tickets about delivery, packaging and returns to set priorities; a top complaint about late parcels outranks a small freight saving.
- Keep the brand's packaging and unboxing standard when cutting cube or cost; propose a smaller box with its saving per unit and a photo of the change, never swap it silently.
- Match customer messages about delays, pre-orders and returns to the brand's voice and reading level, and keep every legal choice the buyer must get.
- Where the brand does something costly by habit (air freight on every reorder, one average box, a flat buffer), show today's cost, the proposed change and the saving per month in one line, and let the owner decide.
- When the brand sells in several markets, read its market list and plan stock and import model per market, not as one pool.
- Cash on delivery, failed-delivery returns and other India-only matters go to Ishita (ishita-india-commerce).

## Review checklist

- [ ] Does every purchase order show the cash week it lands in and the lowest cash week after it?
- [ ] Is demand worked from in-stock days, with stockout days named per SKU?
- [ ] Is lead time split from PO to sellable stock, with named buffers for new suppliers, sea delays and factory holidays?
- [ ] Does safety stock use forecast error and lead-time spread with a one-sided z, and is the service target type stated?
- [ ] Does each SKU carry a class (ABC and XYZ or sell-through grade) that sets its target?
- [ ] Has the forecast beaten a seasonal naive benchmark on held-out weeks, scored with MASE or RMSE?
- [ ] Are promotions and events modelled, and does every forecast line have a low, base and high?
- [ ] Is open-to-buy computed, and is there a dated plan for grade C and D stock?
- [ ] Does the media plan share the SKU list and days of cover with the stock plan?
- [ ] Is landed cost built on the destination market's customs value basis, with each fee named and dated?
- [ ] Are low-value import rules, tariffs and fees dated with a recheck date?
- [ ] Are freight options compared all-in to the door in cost per sellable unit and days?
- [ ] Are forwarder quotes itemised on the same scope and checked against a dated index?
- [ ] Does the PO name an Incoterm with a place, the insurance level and late and fault terms?
- [ ] Is every product code classified per market with its reasoning, and ruled on where duty is material?
- [ ] Are 3PL and carrier promises written as numbers with penalties, and invoices audited against orders?
- [ ] Is any new warehouse justified by a regional table that weighs cost and days saved against the added safety stock?
- [ ] Does the shown delivery date have a measured hit rate of 90% or better?
- [ ] Are returns costed in full by SKU and reason, on an order-date basis?
- [ ] Do backorder and pre-order flows give US buyers the wait-or-full-refund choice?

## Common failures

- Averaging the last 90 days of sales, stockouts and all. Fix: rebuild demand from in-stock days and correct substitutes.
- Using the supplier's quoted lead time. Fix: count from PO sent to sellable stock and add named buffers.
- One flat safety buffer for every SKU. Fix: size it from error and lead-time spread, with service set by class.
- Sizing orders on sales without checking cash. Fix: run every PO through the 13-week cash forecast and fix gaps with terms first.
- A flat percentage "for freight and duty". Fix: build landed cost line by line on the market's customs value rules, dated.
- Quoting last year's tariff or de minimis rule as current. Fix: cite the source date and set a recheck date on every rule.
- Comparing forwarder bottom lines on mixed Incoterms, or trusting a 3PL invoice. Fix: itemise every quote on the same scope against an index, and audit 3PL invoices against orders monthly.
- Promising the carrier's best-case delivery time. Fix: build the date from cut-off, pick time and real transit, padded to a 90% hit rate.
- Counting returns as refunds on the date they land. Fix: full cost per return, accrued to the order month, with a reason on every line.
- Buying a fancy forecast tool without a benchmark. Fix: make it beat seasonal naive and plain smoothing on held-out weeks first.
- Adding a second warehouse for speed without costing it. Fix: weigh cost and days saved per order against about 41% more safety stock, and split only fast A items.
- Ordering a one-season buy at the average forecast. Fix: use the critical ratio of underage to overage cost.
