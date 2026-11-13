---
name: build-wholesale-price-list-and-terms
description: "A wholesale price list per SKU (delivered cost, wholesale price, suggested retail price, the shop's margin, the store's gross profit per unit and per case, case pack and minimum order) and a one-page terms sheet (payment, delivery, damages, returns, pricing policy) that keep the store profitable and its retail price intact. Works back from the retail price the store already charges, drops SKUs that cannot pay their way at wholesale, sets payment terms against the supplier's terms and the cash cycle, and covers GST, MRP and MSME rules in India and resale price rules in the US. Use before pitching any shop, distributor or corporate buyer, or when old wholesale prices are eating margin."
---

# Wholesale price list and terms

**You get:** a wholesale price sheet for every SKU the store will sell to trade, with a pass or fail margin check per line, and a one-page terms sheet ready to attach to pitches and quotes, both approved by the client before anyone sees them.

## When to use

- The store is about to pitch its first stockists or a distributor.
- Retail buyers are asking for a price list and terms.
- Existing wholesale prices were set as "half of retail" and nobody has checked the margin since costs rose.
- A large order request has arrived and the store needs a floor price before quoting.

## Not for

- Finding and pitching the shops: use `find-and-pitch-retail-stockists`.
- Quoting and invoicing a specific bulk order: use `bulk-order-quote-and-invoice`.
- Distributor exclusivity, territory and termination: use `distributor-agreement-checklist`.
- Setting the consumer retail price itself: use `set-prices-from-costs-and-competitors`, then come back.

## What you need

Required:

1. **Landed cost per SKU** from `calculate-landed-cost-per-unit`: product, inbound freight, duty, retail box.
2. **Current retail price per SKU** on the store (and printed MRP in India).
3. **Wholesale packing cost**: master carton, inner packs, shrink wrap, labels per case.
4. **Freight to a shop**: courier or transport quote per case for 2 or 3 typical destinations.
5. **Supplier payment terms and lead time** for each SKU.
6. **The store's DTC numbers**: gross profit per order and average cost per new customer from `build-sku-profit-sheet` or `store-meta-math`.

Optional: what 2 or 3 target shops say they expect as margin; competitor wholesale terms if a shop shares them; current bank or card fees for trade payments.

If retail-buyer margin expectations are unknown, use the practitioner defaults in step 3 and mark them "to confirm with 3 shops". Building the sheet needs read access only. Publishing a wholesale page or B2B catalog on the store needs draft access (level 2) and the client's yes.

## Before you start: the gates

1. **Cost is complete.** Pass when landed cost follows "all in until it's in": purchase price, inbound freight and duty per unit [FIN-0007], and the per-unit view adds wholesale packing, freight to the shop and payment costs [MEA-0037]. Fail: finish landed cost first.
2. **Cash cycle.** Pass when the payment terms you plan to give are shorter than the float your supplier gives you, or the gap is funded. Fail: prepaid terms only until it is.
3. **Capacity.** Pass when the store can supply reorders on time; missing a retailer's order costs the account [OPS-0022].
4. **Legal.** India: printed MRP must include all taxes [COG-6264], and resale price control is a competition law question; get a lawyer before making any minimum price binding. US: a suggested retail price and a policy the store applies alone are lawful; an agreed minimum resale price is judged case by case federally and banned in some states [OFF-6384].

## Steps

### 1. Build delivered cost per wholesale unit

Per SKU: landed cost + wholesale packing per unit + freight to shop per unit (if the store pays) + payment cost (bank, card or financing cost of the credit days) + any sales commission + a damage allowance (practitioner default 1 to 2%, test it). This is the true cost of one unit sold to trade; product margin alone hides about half of it [MEA-0023].

### 2. Start from the retail price, not from cost

Wholesale price is set so the shop earns its margin while selling at the store's own retail price. Multiplying cost by two or three ignores both the shop's needs and the store's real costs [FIN-0012].

- **US:** Wholesale = suggested retail price x (1 minus shop margin).
- **India:** the shop sells at MRP including GST and claims back the GST it pays you. Wholesale before GST = (MRP / (1 + GST rate)) x (1 minus shop margin).

### 3. Pick the shop margin

Practitioner defaults, confirm with 3 target shops:

| Buyer | US | India |
|---|---|---|
| Independent boutique or gift shop | about 50% of retail (retail is 2x wholesale) | 30 to 40% of MRP |
| Regional chain or modern trade | 40 to 50%, plus possible fees | 20 to 35%, plus listing or display fees |
| Distributor layer on top | 15 to 25% | 10 to 20% |

Ask each buyer for their margin, payment days and fees; write the answers in the sheet.

### 4. Run the margin check per SKU

Store gross profit per unit = wholesale price minus delivered cost. Then compare it with what the same unit earns online after acquisition: DTC gross profit per order minus cost per new customer, divided by units per order. A wholesale unit needs no ad spend, so a lower gross profit can still be the better deal [MEA-0026].

Pass a SKU when wholesale gross profit per unit is at least the practitioner floor of 20% of the wholesale price (test it) and at least half of the online contribution per unit. Fail: raise the retail price, cut cost, sell it only in a bundle or case, or leave it off the list.

Illustrative only: retail 1,000 (India MRP incl 18% GST), net of GST 847, shop margin 35% gives wholesale 551 before GST. Delivered cost 300 leaves 251 per unit, 46% of wholesale. Pass.

### 5. Set case packs and minimums

- **Case pack:** match the master carton so the store never splits cartons.
- **Opening minimum:** enough units to fill a shelf face, typically 6 to 12 per SKU across 3 or 4 SKUs (practitioner default).
- **Reorder minimum:** lower, so a shop can top up a seller quickly.
- **Check:** fixed cost per trade order (packing time, freight minimum, invoice) divided by the minimum order value should stay under 5% (practitioner default). If not, raise the minimum or charge freight below a value.

### 6. Add at most two volume tiers

Each tier must pass step 4 on its own. Keep tiers on quantity only, never one-off "special prices" that leak to other shops.

### 7. Set payment terms against cash

- New accounts: prepaid, or 50% with order and 50% before dispatch.
- After 2 or 3 orders paid on time: net 30 for trusted shops.
- Never give more credit days than the supplier float: supplier terms minus the days to make and land stock [FIN-0005]. Growth funded by waiting for customers to pay stalls when the cash cycle is long [FIN-0011]. Large retail purchase orders can be funded with a credit line or purchase order finance [FIN-0020].
- **India:** NEFT, RTGS or UPI; no cash on delivery for trade. If the store is a Udyam-registered micro or small enterprise, buyers must pay within 45 days of accepting goods or owe interest at three times the RBI bank rate; print the Udyam number on invoices [FIN-6382]. A GST tax invoice with both GSTINs is needed for the buyer's input credit [FIN-6380].
- **US:** ACH or wire for net terms; card payments add the processor fee, so price it in or add a surcharge only where the state allows.

### 8. Write damage, return and pricing rules

- **Damage:** claims with photos within 7 days of delivery (practitioner default); replace or credit note.
- **Returns:** no sale-or-return by default. Consignment only as a time-boxed test in a few shops, with stock counts on set dates.
- **Retail price:** state the suggested retail price. Online, the store will not undercut it; if the store runs a sale, shops are told first. US: the advertised price policy is the store's own and applied alone [OFF-6384].
- **Marketplaces:** stockists may not list the products on marketplaces without written permission.
- **Price changes:** 30 days' written notice (practitioner default).

### 9. Get approval

Show the sheet with failed SKUs highlighted and the terms page. The client approves before any version leaves the store; prices given to one shop become the price list for all.

## Checks before you hand it over

- Every SKU has delivered cost, wholesale price, suggested retail, shop margin and store gross profit per unit and per case.
- No SKU on the list fails the margin check.
- India prices show GST separately and MRP includes all taxes.
- Credit days are shorter than supplier float, or the gap is funded.
- Opening and reorder minimums are set and match case packs.
- The pricing policy suggests, never forces, a resale price.
- Shop margin assumptions are marked confirmed or "to confirm".
- Nothing was published or sent without a client yes.

## Output

1. **One-screen summary:** SKUs on and off the list, average shop margin, average store gross profit per unit at wholesale versus online contribution per unit, minimums, payment terms, and the runner-up pricing option in one line.
2. **Price sheet** with columns: SKU, Product, Case pack, Delivered cost, Wholesale price (ex tax), GST or tax rate, Suggested retail or MRP, Shop margin %, Store gross profit per unit, per case, Margin check (pass or fail), Tier 2 price, Notes.
3. **Terms sheet** (one page): Opening minimum, Reorder minimum, Payment (new and trusted accounts), Delivery and freight, Damage claims, Returns, Suggested retail price policy, Marketplace rule, Price change notice, Invoice details (GSTIN or tax ID, Udyam number if any).
4. **File:** `wholesale-price-list.csv` or a Google Sheet with live formulas.

## Common mistakes

- **Wholesale as half of retail.** Step 4 checks each SKU against delivered cost.
- **Ignoring GST in the India formula.** Step 2 removes GST before applying the shop margin.
- **Credit longer than supplier float.** Step 7 caps credit days [FIN-0005].
- **Site sales that undercut stockists.** Step 8 commits the store to its own retail price.
- **Forcing a resale price in writing.** Step 8 suggests a price; the gate flags the law.
- **Minimums too small to ship.** Step 5 tests fixed cost per order.

## Sources

- FIN-0007: landed cost rule for COGS.
- MEA-0037, MEA-0023: gross margin includes every delivery cost.
- FIN-0012: price bottom-up, not by a cost multiple.
- MEA-0026: compare contribution with acquisition cost.
- FIN-0005: supplier float caps safe credit days.
- FIN-0011: long cash cycles stall growth.
- FIN-0020: credit line or PO finance for big retail orders.
- OPS-0022: never miss a retailer's order.
- COG-6264: India MRP inclusive of all taxes.
- OFF-6384: US suggested price and resale price rules.
- FIN-6382: India MSMED Act 45-day payment.
- FIN-6380: India GST tax invoice fields.

What makes this skill ours: wholesale prices are worked back from the store's own retail price with GST handled the Indian way; every SKU is checked against what it earns online after ad cost; credit terms are capped by the supplier's float; and the pricing policy protects the retail price without crossing resale price law.
