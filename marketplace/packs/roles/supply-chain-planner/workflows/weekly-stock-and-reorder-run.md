# Weekly stock and reorder run

**Cadence:** Every week, on the same day, before the main supplier's order cut-off. Also run it when a large order, a stockout or a late shipment changes the picture.

## Steps

1. **Check access and limits.** Confirm the access level per tool under "Access I have" and the level 3 limits still in force: approved suppliers, budget left for the period, per-order cap. Until the client answers, use level 1.
2. **Pull the data (level 1).** Stock on hand, open purchase orders, last week's unit sales and receipts, through the official connector, MCP server or an export. Note any stockouts during the week.
3. **Refresh lead times.** Add last week's receipts to the lead-time log with the `purchase-orders-and-supplier-lead-times` skill, and update each supplier's average and spread.
4. **Refresh the numbers.** Use the `reorder-points-and-safety-stock` skill: days of cover, reorder points and safety stock with the latest demand and lead times. Run the `rebuild-demand-after-stockouts` prompt first if anything ran out.
5. **Build the watch list.** Four headings: order now, order this week, watch, too thin to plan. Each line shows days of cover, the reorder point and the suggested quantity after minimums and case packs.
6. **Build the buy list and cash view.** Cost, order-by date, deposit and balance dates for each suggested order, and the cash balance by week against the floor.
   Compute the full cash schedule before writing recommendations. Derive the first reserve breach, first negative balance, trough and every named week's amount from those same rows. Verify each occurrence in the final answer, HTML and spreadsheet against its exact row; checking the trough alone is insufficient. If a prose date or amount differs, repair all copies before delivery. Keep new PO liabilities separate until matched to scheduled payments; a deferred payment is not savings.
7. **Get approval or act within limits.**
   - At level 1 or 2, send the watch list and buy list to the client, with draft purchase orders in the tool at level 2.
   - At level 3, place the orders that fall inside the confirmed suppliers, budget and cap, and log each one. *Approval: the first live run needs the client's yes to the action list; later runs act within the same limits.*
   - Hold anything outside the limits for a fresh yes: a new supplier or changed bank details, spend over the cap, a deposit, a contract, a claim.
8. **Chase open orders.** Confirmations missing, confirmed dates later than needed, shipments overdue. Routine chasers to existing contacts at level 3; anything that reads as a claim needs a fresh yes.
9. **Report.** A one-page note: what was ordered (with the log), what is held for the client, what is at risk of running out and when, and payments the client needs to make.

## Outputs

- Watch list (order now, this week, watch, too thin)
- Buy list with costs, dates and cash by week
- Purchase orders drafted (level 2) or placed (level 3), with the action log
- Updated lead-time log and open-orders list
- Items for the client: payments due, approvals needed, risks

## Needs the client's approval

The access level for each tool and the level 3 limits; the first live action list; any order to a new supplier or with changed supplier details; spend over the budget or cap; deposits and all payments (always made by the client); contracts and framework agreements; supplier claims; cancellations that carry a fee or cannot be undone.
