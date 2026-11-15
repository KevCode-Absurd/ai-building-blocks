---
name: inbound-shipment-tracker-with-alerts
description: "An inbound shipment tracker for every purchase order from factory to warehouse: booking, mode, vessel or flight, container and seal, departure and arrival dates (planned and actual), customs status, free-time end, delivery appointment and units received, with alert rules that fire when a date slips past the stock-out date, a filing is late or free time is running out, the options to offer the owner when that happens, and a quoted versus real cost and days log after each arrival. Use from booking to warehouse receipt for every inbound shipment, before peak season, or after a late container caused a stock-out or storage charges."
---

# Inbound shipment tracker with delay alerts

**You get:** one tracker sheet with a row per shipment, alert rules tied to each SKU's stock-out date, a weekly status note for the owner, an options list for every alert, and a log of quoted against real cost and transit days that grades forwarders and suppliers after each arrival.

## When to use

- A purchase order has a cargo ready date and needs booking.
- More than one shipment is in transit and nobody can say when each lands.
- Peak season or a launch depends on stock arriving on time.
- A container sat at port and ran up storage or detention charges.
- A late shipment caused a stock-out and the owner wants warning next time.

## Not for

- How much to order and when: use `set-reorder-points-and-safety-stock` and `forecast-demand-per-sku`.
- Comparing freight quotes before booking: the Sheila freight comparison and `calculate-landed-cost-per-unit`.
- Registrations needed before the first arrival in a market: use `import-registration-by-market`.
- Telling customers about delays: use `delay-and-stockout-customer-messages`.
- Taking pre-orders while stock is on the water: use `set-up-pre-orders-and-backorders`.
- Amazon FBA inbound shipments: use `plan-fba-inventory`.

## What you need

Required (read access, level 1):

1. **Open purchase orders:** PO number, supplier, SKUs and units, cargo ready date, Incoterm, cartons, weight and volume.
2. **Bookings from the forwarder:** booking reference, mode, carrier, vessel and voyage or flight, container and seal numbers, origin and destination, planned departure and arrival.
3. **Stock on hand and daily demand per SKU** (from `forecast-demand-per-sku`), to find each SKU's stock-out date.
4. **Customs contacts:** broker, filings needed in the market (for example ISF and entry in the US).
5. **Freight quote per shipment**, with quoted cost and transit days.

Optional: forwarder tracking links or emails, carrier schedule pages, 3PL receiving reports.

Keeping the tracker and sending alerts to the owner is level 1 and 2. Changing a booking, paying for air freight, paying storage or messaging customers needs the owner's yes.

## Before you start: the gates

1. **A need-by date per SKU.** Pass when every SKU on the shipment has a stock-out date from on-hand stock and demand on in-stock days [OPS-0014]. Fail: work it out first; an alert without a need-by date cannot say if a delay matters.
2. **One source per date.** Pass when each date names where it came from (forwarder, carrier site, broker, warehouse). Fail: mark it "unconfirmed" until a second source agrees.
3. **Filings known.** Pass when you know which filings the market needs and who files them. Fail: use `import-registration-by-market` first.

## Steps

### 1. Set up the tracker

One row per shipment, with these columns: PO, supplier, SKUs and units, cartons, weight, volume, Incoterm, cargo ready date (planned and actual), forwarder, booking reference, mode, carrier, vessel and voyage or flight, container number, seal number, origin port, departure (planned and actual), transshipment port, arrival at port (planned and actual), customs status (filed, held, exam, released), duty paid, free time end, delivery appointment, warehouse receipt date, units received, units short or damaged, need-by date (earliest stock-out among its SKUs), days of slack (need-by minus planned receipt), quoted cost, real cost, quoted days, real days, status colour, notes with source.

### 2. Plan dates with honest buffers

Planned receipt = cargo ready + port handling + transit + customs + delivery to warehouse + receiving. Add buffers you can defend:

- **Ocean schedule slips:** only 50.6% of container ships arrived on schedule in September 2026, and late ships averaged 6.65 days late, so add about a week to sea transit [OPS-6690].
- **New suppliers:** add 3 to 4 weeks to a new supplier's quoted lead time and about 2 weeks for a regular one, as a planning default.
- **Chinese New Year:** plan 2 to 4 weeks of lost production around the holiday [COG-6333]; the 2027 holiday runs 5 to 13 February [COG-6399].
- **Route risk:** for lanes through a chokepoint such as the Red Sea, the Suez Canal, the Strait of Hormuz or the Panama Canal, check carrier notices each week; a closure or diversion can add one to two weeks.

### 3. Set the alert rules

Each rule has a trigger, who is told and the first option to offer.

| Alert | Trigger | First option |
|---|---|---|
| Cargo not ready | Ready date slips 3 or more days | Ask the factory for a new date in writing; check late-shipment terms in the PO |
| Departure missed | Actual departure later than planned by 3 or more days | Re-plan receipt; check slack |
| Slack gone | Days of slack below 0 for any SKU | Options list in step 4 |
| Filing late (US ocean) | ISF not confirmed 72 hours before loading; the deadline is 24 hours before loading, with up to $5,000 per violation [OPS-6667] | Chase supplier data and the broker |
| Entry late (US) | No entry 10 days after landing; entry is due within 15 calendar days [OPS-6674] | Call the broker |
| Free time ending | Free time ends within 2 days and no delivery booked; full containers often get about 8 days, groupage about 5 at port plus 7 at the warehouse [OPS-6678] | Book delivery or ask for an extension |
| Customs hold or exam | Status shows a hold | Ask the broker what is needed and the likely days |
| Receipt variance | Units received differ from the PO by more than 1%, or damage is reported | Photo, count and claim note to the supplier |
| Cost variance | Real cost more than 10% over the quote | Ask for an itemised bill |

### 4. Give options when a shipment slips

For every "slack gone" alert, give the owner up to four options with cost and effect:

1. **Air part of the order** to cover the gap: price per kilo falls sharply with weight, so group air orders into fewer, heavier shipments [OPS-6682]. Size it to cover the gap days only.
2. **Slow the sell rate:** move ad spend off the SKU, or swap it out of hero spots, so stock lasts until arrival.
3. **Take pre-orders or backorders** with an honest date: hand to `set-up-pre-orders-and-backorders`.
4. **Tell waiting customers:** hand to `delay-and-stockout-customer-messages`.

Price each option: extra cost, sales protected (units x contribution per unit), and net effect. Recommend one.

### 5. Report weekly

A short note to the owner each week: shipments by status colour (green: slack 7 or more days; amber: 0 to 6; red: below 0 or a hold), what changed since last week with the source, alerts that fired, and decisions needed.

### 6. Close each shipment and log the truth

On receipt, fill real cost (freight, surcharges, duty, fees, storage, delivery) and real days by leg. Compare with the quote. Log the gaps per forwarder, lane and supplier. After three shipments, score each forwarder on on-time arrival and cost accuracy, and each supplier on cargo ready accuracy; send supplier scores to `supplier-scorecard`. Send real freight and duty per unit to `calculate-landed-cost-per-unit`.

## Checks before you hand it over

- Every shipment row has a need-by date and days of slack.
- Every date names its source; unconfirmed dates are marked.
- Sea transit includes a schedule buffer; Chinese New Year is in the plan where it applies.
- Every alert has a trigger, an owner and a first option.
- Free time end and filing deadlines are tracked for each shipment.
- Options for a slip are priced against sales protected.
- No booking change, air freight, storage payment or customer message happened without the owner's yes.

## Output

1. **Tracker sheet** with the columns in step 1 and status colours.
2. **Alert rules sheet:** alert, trigger, who is told, first option.
3. **Weekly status note:** shipments by colour, changes with source, alerts, decisions needed.
4. **Slip options table** (when an alert fires): option, extra cost, units protected, contribution protected, net, recommendation.
5. **Quoted versus real log:** shipment, forwarder, lane, quoted cost, real cost, quoted days, real days, gap, cause.

## Common mistakes

- **Tracking dates without a need-by date.** Gate 1 ties every shipment to stock-out dates.
- **Trusting the planned arrival.** Step 2 adds a schedule buffer.
- **Missing free time.** Step 3 alerts two days before it ends.
- **Offering air freight for the whole order.** Step 4 sizes it to the gap only.
- **Never checking the quote.** Step 6 logs real cost and days.

## Sources

- OPS-0014: forecast from in-stock days only.
- OPS-6690: ocean schedule reliability and average delay.
- COG-6333, COG-6399: Chinese New Year planning and 2027 dates.
- OPS-6667: US ISF timing and damages.
- OPS-6674: US entry within 15 days of landing.
- OPS-6678: free time for full containers and groupage.
- OPS-6682: air freight cost per kilo by shipment weight.
- Library items: Reorder stock before you run out and track the shipment (AI Blocks workflow); Strait of Hormuz status reader (adapted from hormuz-strait by himself65, MIT, https://github.com/himself65/finance-skills/tree/main/plugins/data-providers/skills/hormuz-strait), used for the weekly route risk check.
- Web sources: Sea-Intelligence, "Global Schedule Reliability Records a Marginal Gain in September" (https://www.sea-intelligence.com/press-room/415-global-schedule-reliability-records-a-marginal-gain-in-september); Flexport, "Should I ship by LCL or FCL?" (https://www.flexport.com/help/lcl-vs-fcl/); qualityinspection.org, "Sourcing from China 101, Part 5: The Terms You Need to Discuss" (https://qualityinspection.org/negotiations_terms_china/).

What makes this skill ours: every shipment is tied to the stock-out dates of the SKUs it carries, buffers come from measured schedule reliability, alerts fire on filings and free time as well as dates, every slip comes with priced options against sales protected, and each arrival grades the quote against what it really cost.
