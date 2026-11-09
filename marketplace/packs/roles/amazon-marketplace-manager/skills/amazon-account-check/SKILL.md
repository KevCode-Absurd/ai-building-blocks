---
name: amazon-account-check
description: Runs a monthly Amazon account check from reports the client exports. Reads profit per SKU after every fee, ad cost against break-even, stock cover and fee risks, account health metrics and the Account Health Rating, and reimbursements due for lost, damaged or missing stock, then writes the claim packs and the top three actions as change requests. Use once a month, after a fee change, when the account health page shows a warning, or when stock seems to have gone missing.
---

# Amazon account check

Amazon accounts leak money and risk quietly: a fee that changed in January, stock lost in a warehouse, an ad term that never converts, a policy warning nobody opened. This check finds them in one pass, from exports and screenshots, and ends with a short list of actions the client approves. Facts on targets, fees and claim windows checked on 2026-11-06.

## When to use

- The monthly review for any account you look after.
- After Amazon's yearly fee changes (US changes usually take effect in mid-January) or the holiday peak period.
- When the Account Health page shows At Risk, a new violation or a falling rating.
- When inbound shipments show missing units, or inventory counts do not add up.

## What you need

- **Date Range transaction report** for the month (every fee and reimbursement line).
- **Business Report** (Sales and Traffic by child ASIN) for the month and the month before.
- **Advertising:** campaign and search term reports for the month.
- **Inventory:** FBA inventory report, inventory age report, inventory ledger.
- **Reimbursements report** and the manufacturing cost on file for top SKUs.
- **Shipments:** summary and Contents tab screenshots for any shipment with missing units, plus supplier invoices.
- **Account Health page:** full-page screenshot.
- **Unit cost sheet:** landed cost per SKU.
- **Access:** steps 1 to 7 need level 1 (read), or the downloads above. Step 8 needs level 2 to draft cases in Seller Central or level 3 to file them. Step 9 needs level 3 to carry out actions within the client's limits.

## Steps

1. **Profit per SKU.** From the transaction report, total each fee type per SKU: referral, fulfilment, storage, inbound placement, low-inventory-level, returns processing, removal, other. Add landed cost and ad spend. Show contribution per unit and in total. Flag SKUs that lost money after ads.
2. **Fee changes.** Compare each fee per unit with last month. Explain changes: size tier, the January fee update, the holiday peak period (15 October 2026 to 14 January 2027 in the US, plus the 3.5% fuel and logistics surcharge), or an error worth a case.
3. **Ads against break-even.** For each campaign: spend, sales, ACOS against the SKU's break-even ACOS, and TACOS (ad spend over all sales) to see whether organic sales are growing. List terms with spend and no sales, and terms converting well enough to move to exact match.
4. **Stock.** Weeks of cover per SKU from the last 30 days' sales. Flag cover below four weeks of sales (low-inventory-level fee risk and stock-outs), stock nearing 181 days old (aged inventory surcharge) and stranded or unfulfillable units.
5. **Reimbursements.** Check that warehouse losses were reimbursed automatically (Amazon has done this for most US cases since 15 January 2025). For gaps, check the manual windows: warehouse loss within 60 days of the loss being reported; customer returns 45 to 105 days after the refund; removals lost in transit 15 to 75 days after the removal was created; other removals within 60 days of delivery back. Check the manufacturing cost Amazon holds; pre-order losses are paid at that figure since 10 March 2025.
6. **Inbound shipments.** For shipments with fewer units received than sent, confirm the shipment is Closed, then build the reconciliation pack: proof of ownership (supplier invoice or signed packing list, non-editable file) and proof of delivery for pallet freight. Read the filing deadline on the shipment summary page.
7. **Account health.** Read the Account Health Rating and band (Healthy 200 and above, At Risk 100 to 199, Unhealthy below 100) and each metric against target: order defect rate under 1%, late shipment rate under 4%, pre-fulfilment cancel rate under 2.5%, valid tracking rate above 95% (the last three for orders you ship yourself). List each policy violation by severity with what it needs.
8. **Write the claim packs (level 2 drafts the case; level 3 files it within the agreed limits).** For each claim: what happened, the IDs, the units, the evidence attached, what you are asking for. Factual, short, no threats.
9. **Pick the top three actions** by money or risk, each with cost, expected effect, and how to check it next month. At levels 1 and 2 they are change requests. At level 3, carry out the ones inside the agreed limits after the client's yes, log them, and ask first for anything outside the limits, such as a reorder above the agreed quantity or a removal order.

## Checks

- Every fee line is from the client's own report, not a published rate card.
- Each claim is inside its window, with the evidence Amazon asks for.
- Account health metrics are compared with targets and the rating band is stated.
- No live change happens without level 3 access inside the agreed limits; anything outside them is asked first, and every action is logged.
- Personal buyer data is removed from anything shared.
- Rules and windows are dated; anything older than the last fee or policy update is re-checked.

## Output format

1. **One-line verdict:** profit, risk, and the biggest issue.
2. **Profit by SKU** table, with the month before.
3. **Fee changes** and their causes.
4. **Ads** table: campaign, spend, ACOS, break-even ACOS, action.
5. **Stock** table: SKU, weeks of cover, age risk, reorder date.
6. **Reimbursements:** found, due, claim packs attached.
7. **Account health:** rating, band, metrics, violations.
8. **Top three actions** as change requests, or at level 3 the actions taken with their log.

## Example of good output (short)

*Illustrative structure, not a real business: an Amazon seller of insulated water bottles. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Access I have:** Seller Central level 1 (downloads only).

**Verdict:** October profit $4,120 (down from $5,300). Cause: holiday peak fulfilment fees and one ad campaign at twice break-even. Account Healthy (rating 240). Two claims ready.

| SKU | Units | Contribution after ads | Last month |
|---|---|---|---|
| BTL-750-BLK | 1,120 | $3,350 | $3,980 |
| BTL-500-SAGE | 410 | $770 | $1,320 |

**Ads:** "insulated bottle 500ml" campaign at 58% ACOS against a 29% break-even: lower bids and add 14 non-converting terms as negatives.

**Stock:** BTL-500-SAGE at 3.1 weeks of cover; reorder now (lead time 6 weeks) to avoid stock-outs and the low-inventory-level fee.

**Reimbursements:** 22 units lost in the warehouse on 2 October and reimbursed automatically, but at Amazon's estimated manufacturing cost of $3.10, below the seller's $4.40 invoice cost. Action: update manufacturing cost for this SKU. Shipment FBA-EXAMPLE-01 closed 36 units short: reconciliation pack attached (invoice, carrier pallet note).

**Top three actions for approval:** 1) bid and negative changes on the 500 ml campaign; 2) reorder 900 units of BTL-500-SAGE; 3) update manufacturing cost and file the inbound reconciliation.
