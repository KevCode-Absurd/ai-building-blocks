---
name: production-and-materials-plan
description: Plans production for a small maker - costs each product from a bill of materials (parts, scrap allowance, labour, overhead share), loads open orders against each workstation's capacity to find the bottleneck, schedules by due date around it in sensible batches, flags late orders, explodes the schedule into a materials buy list with order-by dates from supplier lead times, and writes goods-in, in-process and final quality checks using acceptance sampling and control charts. Use it for a weekly or monthly production plan, product costing, a capacity check before promising dates, or after quality slips.
---

# Production and materials plan

## When to use

- A workshop or small factory with open orders and no reliable schedule.
- "What does each product really cost to make?"
- "Can we take this order and still hit our other dates?"
- Materials keep running out mid-batch, or too much is bought.
- Customers report defects and the owner wants checks at each stage.

Not for: machine or product safety certification, ISO quality system documents or tax treatment of stock. Those stay with the client's engineer, certifier or accountant.

## What you need

1. **Open orders:** product, quantity, due date, customer priority (no personal details needed).
2. **Products:** parts list per product with quantities, scrap or waste allowance, and the routing (which workstations, in what order, minutes per unit and set-up time per batch).
3. **Capacity:** workstations, shifts, hours per day, planned downtime, people.
4. **Stock:** parts and finished goods on hand and on order.
5. **Suppliers:** price per part, minimums, lead times (measured, if the `purchase-orders-and-supplier-lead-times` log exists).
6. **Costs:** labour rate per hour and how the client wants overhead shared (per labour hour or per unit).
7. **Specs:** dimensions, tolerances or tests for each product, from the client's drawings or standards.
8. **Access:** level 1 to read the order book and stock. Drafting production or purchase orders is level 2. Releasing production orders or placing purchase orders is level 3, within the limits you set.

## Steps

### 1. Check the data first

Every product needs a parts list and a routing with times. List what is missing before planning; a schedule built on guessed times hides the bottleneck.

### 2. Cost each product

For each part: quantity × (1 + scrap allowance) × unit price. Add labour (minutes ÷ 60 × rate) and the overhead share on the basis the client chose. Show the sum per unit and the three biggest cost lines. Note any part priced from an old quote.

### 3. Load against capacity

For the planning window, add up the minutes each workstation needs (run time plus set-ups) and compare with the minutes it has. The station with the highest load as a share of capacity is the bottleneck. Show load and capacity per station per week.

### 4. Schedule around the bottleneck

- Sequence the bottleneck first, by due date, grouping similar products to save set-ups where it does not make orders late.
- Keep a small buffer of work in front of the bottleneck so it never waits.
- Schedule other stations to feed it.
- Flag every order that will finish after its due date, by how many days, and show the options: overtime on the bottleneck, outsourcing a step, splitting the order, or a new date for the customer (the client decides and tells the customer).

### 5. Turn the schedule into a materials plan

Explode each scheduled batch through its parts list, level by level, so sub-assemblies are planned before the parts inside them. For each part: gross need by week, minus stock and open orders, equals net need. Round to supplier minimums and packs. Order-by date = the week it is needed minus the supplier's lead time and a safety lead time. Pass the list to the purchase order skill.

### 6. Write the quality checks

For each product, three stages:
- **Goods-in:** what to check on incoming parts and how many. For lots where checking every piece is too costly or destructive, use an acceptance sampling plan from a recognised table, with the sample size and accept number written down, and what happens on a reject.
- **In process:** the measures that predict failure (a joint width, a cure time, a fill weight), how often to measure, and limits from the spec. Where a measure is taken often, plot it on a control chart and act on points outside the limits or runs on one side.
- **Final inspection:** the customer-facing checks, sample size, and what to do on a fail (hold, rework, scrap), with who decides.

Limits come from the client's specs. I do not invent tolerances.

### 7. Release (level 2 or 3)

Draft production orders and purchase orders in the tool (level 2) or release and place them within the limits (level 3). Anything outside the limits, or a supplier quality claim, needs a fresh yes.

## Checks

- Every product has a parts list, routing and times, or is listed as missing.
- Unit costs add up and show scrap, labour and overhead separately.
- Load includes set-up time and planned downtime.
- The bottleneck is named, and late orders are listed with days late.
- Net material needs subtract stock and open orders, and respect minimums.
- Order-by dates use measured lead times where available.
- Quality limits come from the client's specs, each with a reaction plan.

## Output format

1. **Missing data** list.
2. **Costed bill of materials** per product.
3. **Load versus capacity** by station and week, bottleneck named.
4. **Schedule** by station and day or week, late orders flagged with options.
5. **Materials buy list:** part, net need, order quantity, supplier, order-by date, cost.
6. **Quality check plan** per product and stage.
7. **Decisions for the client.**

## Example of good output (short)

*Illustrative structure, not a real business: a furniture workshop with 12 products and four stations (cutting, joinery, finishing, packing). Copy the shape, never the content: every fact comes from the client's own context.*

> **Bottleneck: finishing.** Weeks 1 to 4 need 312 hours of finishing against 240 available (130% load). Cutting runs at 71%, joinery at 88%.
>
> **Late orders.** Order 1187 (14 dining chairs) finishes 3 days late; order 1192 (2 sideboards) 5 days late. Options: one Saturday shift on finishing recovers 8 hours a week and brings 1187 back on time; or send sanding of chair parts to your usual subcontractor. Your call; I have not contacted the customer.
>
> **Chair, unit cost.** Oak 0.042 m³ × 1.12 (12% offcut allowance, your figure) × $1,900 = $89.38; fittings $6.10; finish $4.20; labour 2.4 h × $24 = $57.60; overhead 2.4 h × $9 = $21.60. Total $178.88.
>
> **Goods-in check, oak boards.** Moisture reading on a sample from each delivery against your spec; if any board is out, check the whole delivery before cutting.
