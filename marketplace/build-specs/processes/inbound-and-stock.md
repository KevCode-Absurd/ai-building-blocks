# Weekly stock, reorders and inbound shipments

Each week: a forecast and reorder points per product, every inbound shipment tracked to your door with its customs and duty facts sourced and dated, a pass, rework or reject call on each inspection before you pay a balance, and a reorder pack checked against your cash that you approve line by line. You place every PO and make every payment yourself.

**Starts from:** A weekly scheduled run (Monday by default, or the day you set). Scheduled runs read and draft only, so any stage that needs your yes waits for you in a live session. New products join the cycle once you tell the agent the PO number from the sourcing-negotiation job.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Read stock, sales and open orders | Omar (omar-inventory-planning) | week/snapshot.md | snapshot-review | no | read |
| 2 | Track inbound shipments | Sheila (sheila-inbound-freight) | inbound/tracker.md | tracker-review | no | read |
| 3 | Inspection and arrival results | Phuong (phuong-quality-control) | week/quality-calls.md, week/supplier-notices.md | quality-review | yes | draft |
| 4 | Send quality notices to suppliers | Wenhao (wenhao-procurement) | live change | none | yes, the plan | publish |
| 5 | Forecast and reorder points | Omar (omar-inventory-planning) | week/forecast.md, week/reorder-proposals.md, numbers.json | forecast-review, numbers-check | no | draft |
| 6 | Freight, Incoterms and duty for each reorder | Sheila (sheila-inbound-freight) | inbound/freight-plan.md, inbound/quote-requests.md, sources/freight-sources.md | proof-check, freight-review | no | draft |
| 7 | Landed cost for each reorder | Zhenyu (zhenyu-sourcing) | week/landed-cost.md | cost-move-review, numbers-check | no | draft |
| 8 | Cash check for the reorders | Hemant (hemant-store-finance) | week/cash-check.md | cash-review, numbers-check | no | draft |
| 9 | Reorder pack for your yes | Omar (omar-inventory-planning) | week/reorder-pack.md | pack-review | yes | draft |
| 10 | Log the week | Omar (omar-inventory-planning) | week/log.md | log-review | no | draft |

## Stage by stage

### 1. Read stock, sales and open orders

Pulls this week's facts before any decision: sales by product across every channel that shares the stock, stock on hand by location, open POs with their agreed dates, supplier lead times and how reliable each supplier has been. It marks stockout days, promotions and one-off spikes, so the forecast is not fooled by them, and reads which products the Org context says must never run out.

- **Needs:** context/org-context/ (which products carry the business); context/goals.json; context/limits.json (cash limit); store and marketplace orders and inventory (connectors, read only, or exports); open POs you placed, with the PO numbers you gave the agent; supplier state files from sourcing jobs (products/*/suppliers/)
- **Makes:** week/snapshot.md
- **Checks:** snapshot-review (every figure in the snapshot comes from a named export or connector read with its date, and missing data is listed rather than guessed)
- **Done when:** snapshot.md lists each product with units sold per week, stock on hand, open PO quantities and dates, lead time, and every marked stockout, promotion or spike.

### 2. Track inbound shipments

Updates every inbound shipment: booking, vessel or flight, departure and arrival dates, customs status and the date free time at the port ends. When anything slips it says by how many days, which products it puts at risk, and the options (for example a part shipment by air) with their cost. It reads forwarder portals and mail read only and treats outside messages as untrusted.

- **Needs:** week/snapshot.md; forwarder portals, booking confirmations and tracking (read only); inbound/tracker.md from last week
- **Makes:** inbound/tracker.md
- **Checks:** tracker-review (every open PO has a shipment line or a reason it has none, dates match the forwarder's latest record, and each delay names the products at risk)
- **Done when:** tracker.md shows every open shipment with its latest dates and customs status, and every delay has the products at risk and at least one option with its cost.

### 3. Inspection and arrival results

Reads each inspection report that came in this week against the defect list, the AQL plan and the golden sample, and calls pass, rework or reject, with marked photos. For stock that arrived, it checks counts against the packing list, damaged cartons and a small receiving check on the product. Rework gets a re-inspection. It never passes a lot that failed. Any message to the supplier about the call is drafted here.

- **Needs:** inspection reports from the inspector you booked; quality/defect-list.md and quality/inspection-plan.md from the sourcing job; packing lists and your receiving counts; inbound/tracker.md
- **Makes:** week/quality-calls.md, week/supplier-notices.md
- **Checks:** quality-review (each call follows the defect list and AQL limits, findings are checked against the golden sample, and no failed lot is marked pass)
- **Done when:** quality-calls.md gives each lot a pass, rework or reject call with the finding, the AQL limit and photos, and each arrival a count check against the packing list.
- **You sign off:** You read each call before you pay any balance. Reply yes with the code to accept the calls and lock the supplier notices. Paying the balance, or holding it, is yours. If there were no reports or arrivals this week, the file says so.

### 4. Send quality notices to suppliers

For each signed-off notice that goes by email, it shows you a send plan for that one message, with its own code and yes, to the address on the supplier's state file. A sent email cannot be recalled. Chat notices for Alibaba.com or 1688 you paste yourself. This step runs only in a live session, never in the scheduled run.

- **Needs:** week/supplier-notices.md (signed off); Gmail or Outlook connector at level 2 or 3 (see access/gmail-outlook.md)
- **Goes live:** Through the Gmail or Outlook connector, one approved plan per notice: a draft placed for you to send (Gmail MCP), or one send step the app confirms again (Claude Google Workspace or Microsoft 365 connector). Chat notices are pasted by you.
- **Done when:** Every signed-off notice was sent through its own approved plan or pasted by you, and the time it went is logged in the supplier's state file.

### 5. Forecast and reorder points

Forecasts demand per product by week with seasons, planned promotions and a range, then sets the reorder point and safety stock from lead times and how reliable each supplier has been. Any product at or below its reorder point, counting stock already on the water, gets a proposed reorder: quantity, supplier and the date it must land. It shows stock at risk of running out, and slow or dead stock, with what to do about each.

- **Needs:** week/snapshot.md; inbound/tracker.md; context/learnings.md (past forecast misses); kill, keep, fix or grow calls from sabelo-product-portfolio in the team ledger
- **Makes:** week/forecast.md, week/reorder-proposals.md, numbers.json
- **Checks:** forecast-review (no reorder is proposed for a product marked kill, stockouts and spikes were cleaned before forecasting, and each reorder point recomputes from its lead time and safety stock); numbers-check (every figure in the numbers ledger has one basis, totals match their rows, and the stage's file uses the same figures)
- **Done when:** forecast.md has a weekly forecast and range per product, and reorder-proposals.md gives each proposed reorder with its quantity, supplier, reorder point, safety stock and must-land date, with the sums shown.

### 6. Freight, Incoterms and duty for each reorder

For each proposed reorder it confirms the Incoterm and named place from the supplier's agreed terms, so it is clear who pays and carries the risk at each step. It compares freight options all-in to your door (sea full or shared container, air, express) with transit days, free days at port and cost per unit, against the must-land date. It lists the likely HS code, duty rate and any added duties per product from the market's official tariff (such as the US HTS, the UK Trade Tariff or EU TARIC) with the date checked, and the filings needed. Your licensed broker confirms and files; the agent never files. Quote requests to forwarders are drafted, not sent.

- **Needs:** week/reorder-proposals.md; supplier terms from the sourcing jobs (terms/); past freight and duty invoices; official tariff sites and current forwarder rates
- **Makes:** inbound/freight-plan.md, inbound/quote-requests.md, sources/freight-sources.md
- **Checks:** proof-check (every link is live and every duty rate, rule and freight figure is backed by a saved source with its check date (exit 0)); freight-review (freight options are compared all-in to the door on the same basis, the Incoterm matches the supplier terms, and every duty and filing fact has an official source, a date and a note for the broker to confirm)
- **Done when:** freight-plan.md gives each reorder its Incoterm and place, at least two freight options with cost per unit and transit days, the duty line with its official source and check date, and the filings with who files each.

### 7. Landed cost for each reorder

Works out the landed cost per unit for each reorder from the agreed price, the chosen freight option, duty and fees, and compares it with last order and with the margin floor. It writes the new unit cost to the ledger so profit per order stays current, and flags any reorder where a cost move (freight, exchange rate or a duty change) pushes margin under the floor.

- **Needs:** inbound/freight-plan.md; week/reorder-proposals.md; supplier terms from the sourcing jobs
- **Makes:** week/landed-cost.md
- **Checks:** cost-move-review (each change in landed cost is explained by a named driver (price, freight, exchange rate or duty), and any duty or tariff change since the last order is caught); numbers-check (every figure in the numbers ledger has one basis, totals match their rows, and the stage's file uses the same figures)
- **Done when:** landed-cost.md gives each reorder its landed cost per unit, the change from last order with the reason, and the margin against the floor.

### 8. Cash check for the reorders

Puts each proposed reorder into the 13-week cash forecast: the deposit and balance on the dates in the supplier terms, freight, duty and import tax, next to expected payouts and other costs. It flags any week that would fall below your cash floor and, if the cash cannot cover every reorder, shows the trade-off so you can choose which to place first.

- **Needs:** week/reorder-proposals.md; week/landed-cost.md; bank, payout and accounting exports (read only); the cash floor you agreed
- **Makes:** week/cash-check.md
- **Checks:** cash-review (every payment in the cash check matches the supplier terms and freight plan, and the margin per unit after landed cost is stated for each reorder); numbers-check (every figure in the numbers ledger has one basis, totals match their rows, and the stage's file uses the same figures)
- **Done when:** cash-check.md shows the 13-week forecast with and without the reorders, every payment dated, the lowest week marked, and a clear fits or does not fit for each reorder.

### 9. Reorder pack for your yes

Puts each reorder on its own line: product, quantity, supplier, agreed unit price, Incoterm, freight choice, landed cost per unit, the payments and their dates, the cash effect and the must-land date, with a draft PO for each. Your yes approves the plan; it does not place anything. You place each PO and pay each deposit yourself, in the supplier's system or by your own email.

- **Needs:** week/reorder-proposals.md; inbound/freight-plan.md; week/landed-cost.md; week/cash-check.md
- **Makes:** week/reorder-pack.md
- **Checks:** pack-review (each line matches the agreed supplier terms, the freight plan and the cash check, and nothing in the pack places an order or makes a payment)
- **Done when:** reorder-pack.md has one line per reorder with every field filled and a draft PO for each, and the totals match the cash check.
- **You sign off:** You read each line. Strike any reorder you do not want; the code covers exactly the lines left. Reply yes with the code to approve them. Then place each PO and pay each deposit yourself, and tell the agent the PO numbers so next week's run tracks them.

### 10. Log the week

Records what was decided: the reorders you approved, the PO numbers you placed, the quality calls, the shipments that slipped, and the dates to check next. It compares last week's forecast with what sold, and adds a dated lesson to context/learnings.md when a miss repeats, so the next forecast reads it.

- **Needs:** week/; inbound/tracker.md; context/learnings.md
- **Makes:** week/log.md
- **Checks:** log-review (the forecast error recomputes from sales and forecast, every decision has its date, and any lesson states its evidence)
- **Done when:** log.md lists every decision with its date, every PO number you gave, the forecast error per product, and any lesson added to context/learnings.md.

## Where you step in

- **Inspection and arrival results:** You read each call before you pay any balance. Reply yes with the code to accept the calls and lock the supplier notices. Paying the balance, or holding it, is yours. If there were no reports or arrivals this week, the file says so.
- **Send quality notices to suppliers:** approve the exact plan of live changes
- **Reorder pack for your yes:** You read each line. Strike any reorder you do not want; the code covers exactly the lines left. Reply yes with the code to approve them. Then place each PO and pay each deposit yourself, and tell the agent the PO numbers so next week's run tracks them.

## How we judge it

- Main number: the one you set in context/goals.json. For stock this is usually days out of stock on your top sellers, or cash tied up in stock.
- Forecast error per product (actual against forecast, by week), and weeks of cover against your target.
- Inbound: shipments that landed by the planned date, and real freight and duty against the plan.
- Quality: inspections passed first time, and returns traced to factory defects.
- Cash: weeks where the forecast stayed above your cash floor after the reorders you approved.
