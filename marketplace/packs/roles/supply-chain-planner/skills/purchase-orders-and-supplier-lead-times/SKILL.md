---
name: purchase-orders-and-supplier-lead-times
description: Turns an approved buy list into purchase orders and follows each one to receipt - builds the order pack (supplier, lines, price, Incoterms rule and place, requested date, terms), drafts orders in Shopify, Odoo, Business Central, Xero or QuickBooks at level 2, places them at level 3 within the budget, supplier list and period the client confirms, chases confirmations and late orders, records partial and over-receipts, and keeps a lead-time log and an on-time, in-full record per supplier that feeds safety stock. Payments, deposits and bank details stay with the client. Use it when stock needs ordering, when orders are late, or to measure real supplier lead times.
---

# Purchase orders and supplier lead times

## When to use

- A reorder plan or buy list has been approved and the orders need placing.
- Orders are late, part-shipped or short, and the plan needs to know.
- The owner wants real lead times per supplier instead of the quoted ones.
- A supplier review: who delivers on time and in full, and who does not.

## What you need

1. **The approved buy list** from the `reorder-points-and-safety-stock` skill or the client.
2. **The ordering tool** (Shopify, Odoo, Business Central, Xero, QuickBooks, or email with a PDF order) and the access level the client grants for it.
3. **The limits for level 3, in writing:** approved suppliers, total budget and per-order cap, product list, period, and who receives copies.
4. **Supplier terms:** price list, minimums, case packs, payment terms, Incoterms rule and named place, usual contact.
5. **Order history:** past purchase orders with order, confirmation and receipt dates, for the lead-time log.

## Steps

### 1. Confirm the access and limits

Write down the access level per tool under "Access I have". Until the client answers, work at level 1. Restate the level 3 limits back to the client and get a yes to the first action list before any order goes out.

Always stop for a fresh yes, even at level 3:
- A supplier not on the approved list, or new contact or bank details for an existing one.
- Spend over the budget or per-order cap.
- A binding contract, framework agreement or long-term price commitment.
- A claim against a supplier (shortage, damage, quality).
- Cancelling an order when a cancellation fee applies or the cancellation cannot be undone.

Deposits, balances and any payment are prepared for the client (level 2) and paid by the client.

### 2. Build the order pack

For each supplier: order number, date, lines (product code, supplier code, quantity in the supplier's unit, unit price, line total), requested arrival date, ship-to, Incoterms 2020 rule and named place for imports, payment terms as agreed, and contact. Check every line against the minimum, case pack and price list. Total the order and compare it with the remaining budget.

### 3. Draft (level 2)

Create the purchase orders in the tool as drafts:
- **Shopify:** save as draft; it becomes Ordered when the supplier confirms.
- **Odoo:** a request for quotation, confirmed into a purchase order.
- **Business Central:** a purchase order not yet released or sent.
- **Xero or QuickBooks:** a draft purchase order.
The client reviews and sends, or grants level 3.

### 4. Place (level 3, within the limits)

Send the approved orders to the named supplier contacts from the client's tool or mailbox, and log each one: what, to whom, when, total, and the budget left. If a tool or supplier rejects an order, or anything looks odd (a changed price, a new bank account on the supplier's reply), stop and ask.

### 5. Get confirmation

Ask each supplier to confirm quantity, price and ship date. Record the confirmed date next to the requested one. If the confirmed date misses the need date, tell the planner the same day: the reorder point and cash plan may need to change.

### 6. Track and chase

Keep an open-orders list: order, supplier, requested, confirmed and expected dates, status. Chase before the confirmed date, not after. At level 3, routine chasers to existing contacts go out within the limits; anything that reads as a claim or threat of cancellation needs a fresh yes.

### 7. Receive

On arrival, check count and condition against the order. Record partial receipts as partial; the remaining quantity stays open. Record over-receipts only within the tolerance the client set, otherwise hold them and ask. Do not post the supplier invoice for physical goods before the receipt is recorded and the final cost is known. Shortages and damage are logged with photos and passed to the client to decide on a claim.

### 8. Hand over for payment

Match order, receipt and supplier invoice (quantity and price). Send the matched set and any differences to the client or their accounts payable process. Payment stays with them.

### 9. Update the lead-time log

For every received order, record order date, confirmation date, ship date and receipt date. Per supplier, report average days, spread, the latest three, and the share of orders on time and in full (arrived by the confirmed date with the full quantity). Pass the averages and spreads to the reorder plan.

## Checks

- Every order sent at level 3 was within the supplier list, budget, cap and period, and is in the log.
- No order went to a new supplier, contact or bank detail without a fresh yes.
- Every line respects minimum, case pack and price list.
- Each order has an Incoterms rule and place if it is an import.
- Confirmed dates are recorded and compared with need dates.
- Receipts are recorded before invoices are posted.
- The lead-time log uses receipt dates, not promised dates.

## Output format

1. **Access I have** and the level 3 limits.
2. **Order pack** per supplier, with budget used and left.
3. **Action log:** time, tool, action, supplier, amount, result.
4. **Open-orders list** with requested, confirmed and expected dates.
5. **Receipt notes:** partials, over-receipts, shortages, damage.
6. **Lead-time log** and on-time, in-full record per supplier.
7. **Items for the client:** payments due, claims to decide, any order outside limits.

## Example of good output (short)

*Illustrative structure, not a real business: a soap maker ordering through Odoo. Level 3 for Odoo purchasing: three approved suppliers, $12,000 budget to 30 November, no single order over $5,000. Copy the shape, never the content: every fact comes from the client's own context.*

> **Placed today (level 3).**
> | Time | Supplier | Order | Lines | Total | Budget left |
> |---|---|---|---|---|---|
> | 09:12 | Supplier A | P00418 | Shea butter 200 kg, olive oil 150 L | $3,940 | $8,060 |
> | 09:20 | Supplier B | P00419 | Gift box 2,000 (cases of 250) | $1,180 | $6,880 |
>
> **Held for you.** Supplier C replied with new bank details for the balance. I have not changed anything or placed their order. Please confirm the change with them by phone on a number you already hold.
>
> **Lead times (last 6 orders).** Supplier A: 18 days average, spread 3 days, all on time and in full. Supplier B: 26 days average, spread 9 days, 2 of 6 late. The reorder plan now uses 26 ± 9 days for boxes.
