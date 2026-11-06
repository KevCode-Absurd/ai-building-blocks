---
name: delivery-routes-and-run-sheets
description: Plans own-van delivery for a local business - delivery zones with days, fees and cut-offs, routes for a delivery day that meet time windows and drivers' legal hours, a printable run sheet and loading order per van, and a cost per drop compared with what the client charges. Use it for bakeries, florists, food and drink suppliers, furniture and building supplies, or any business running its own vans. Publishes routes to drivers and sends arrival messages only with level 3 access.
---

# Delivery routes and run sheets

## When to use

- Drivers finish late, miss time windows or cross each other's areas.
- The business wants fixed delivery days, zones or a minimum order.
- Delivery fees do not cover the cost of some areas.
- A new van or driver is being added.

Do not use it to set drivers' pay, decide vehicle safety, or replace live traffic and mapping tools; route times are checked with drivers or a mapping tool.

## Access needed

- **Level 1 (read):** the order list or export, addresses or postcodes, vans and drivers, past routes and finish times.
- **Level 2 (read and draft):** draft routes and run sheets in the route planner or a spreadsheet.
- **Level 3 (read, write and publish):** publish routes to drivers' apps, and send arrival-window messages to customers from approved templates, within the client's limits. Changing zones, fees or cut-offs at checkout needs the owner's approval of the plan first.

## What you need

1. Orders for the day (or a typical week): one row per drop with address or postcode, size or weight, time window, cold or fragile goods, payment to collect.
2. Vans: number, load space and weight limits, any refrigeration.
3. Drivers: start and finish times, breaks, which rules apply to their hours (ask the owner which vehicle category each van is).
4. Depot or start point, and any collection points.
5. Drive times the client knows, or a mapping tool's estimates.
6. Costs: driver time, fuel, vehicle running cost, and the delivery fees charged.

## Steps

### 1. Clean the drop list
One row per drop. List rows with missing postcodes, impossible windows or no size. Merge drops to the same address.

### 2. Group into zones
Group drops by area or postcode district into zones a single van can serve. Use the client's drive times or a mapping tool's; where neither exists, use rough distance bands and say so.

### 3. Build routes per van
Put timed drops first, then fill around them by zone. Keep chilled goods on the van for the shortest time. If using a route planner, give it the drops, windows, van capacities and driver hours, then check its answer: planners solve versions of the vehicle routing problem, and minimising total distance can put too much on one van, so check each route's finish time.

### 4. Check drivers' hours
Each route must fit the legal limits for that vehicle and trip, with breaks. In Great Britain, the domestic rules allow no more than 10 hours driving and 11 hours duty a day for goods vehicle drivers they cover; under the EU rules, driving is up to 9 hours a day with a 45-minute break after 4.5 hours. In the US, check the FMCSA hours-of-service rules for vehicles they cover. If a route breaks a limit, split it or move drops; never cut breaks.

### 5. Write the run sheet
One per route: stop order, time window, address and access notes, items and quantities, cold or fragile marks, payment to collect, and a proof-of-delivery column (signature, photo or safe place as agreed). Add the depot phone number.

### 6. Write the loading order
Reverse stop order, with heavy items low, cold items last on and first off, fragile items marked. Add a check before the van leaves: count, cold chain, payment devices, run sheet.

### 7. Work out cost per drop
From the client's figures: driver time, fuel, vehicle cost, any tolls, divided by drops, by zone. Compare with the fee charged. List zones that lose money.

### 8. Suggest zones, days and cut-offs
Where it saves time: fixed delivery days per zone, an order cut-off the day before, a minimum order or higher fee for far zones. The owner decides fees and minimums.

### 9. Publish or hand over
At level 3, publish the routes to drivers and send arrival-window messages from approved templates; log it. At level 2, save drafts and print run sheets for the owner to release.

## Checks

- Every drop is on exactly one route, and every timed drop's window is met on paper.
- Every route finishes within the driver's hours and the legal limits for that vehicle, with breaks.
- Van load and weight limits are not exceeded.
- Drive times are labelled as the client's, a mapping tool's, or rough bands.
- Costs per drop use only the client's figures.
- Nothing was published or sent beyond the access level and limits.

## Output format

1. Zone plan: zones by postcode or area, delivery days, cut-off, minimum order and fee (owner to set), with cost logic.
2. Routes for the day: one table per van with stop order, window, estimated arrival and finish time.
3. Run sheet and loading list per van.
4. Cost per drop by zone against the fee.
5. Assumptions and open questions.

## Example of good output (short)

*Made-up business for illustration: Harbour Bakehouse, two vans delivering to cafés.*

> **Van 1, Tuesday (driver start 5.00, depot leave 5.30)**
> | Stop | Window | Customer | Items | Notes | POD |
> |---|---|---|---|---|---|
> | 1 | by 6.30 | Quay Café | 40 rolls, 2 trays pastries | Key in lockbox (code in app) | Photo |
> | 2 | by 7.00 | Station Kiosk | 24 rolls | Hand to staff | Signature |
> | 3 | 7-8 | Hillside School | 3 trays | Kitchen door at rear | Signature |
>
> **Load order:** Hillside trays first (bottom, back), Station Kiosk, Quay Café last on.
> **Hours check:** route back at depot 9.10, total duty 4 h 10 min; well within the limits for this van.
> **Cost per drop:** zone C (Hillside) costs more than the fee charged; suggest Tuesday and Friday only, or a minimum order. Owner to decide.
