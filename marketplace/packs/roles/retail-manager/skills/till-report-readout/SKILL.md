---
name: till-report-readout
description: Reads a shop's till or POS export (Square, Shopify POS, Lightspeed or a spreadsheet) and returns a one-page sales readout - best and worst lines by sales and margin, busy and dead hours, basket size and units per sale, sell-through and slow stock - ending in three actions (promote, move, reorder) and what to watch next week. Use when an owner shares a sales export and asks how the shop is doing, before planning promotions or a rota, or after a market day to review the event.
---

# Till report readout

A till readout turns a sales export into three decisions an owner can act on this week. It is read in five minutes, uses only the client's numbers, and shows its working.

## When to use

- The owner shares a sales or item export and asks "how are we doing?" or "what should I do about weekdays?".
- Before building a promotions calendar or a rota, to find busy and quiet hours.
- After a market or pop-up, with the card reader export and start and end stock counts.
- Monthly, as part of the weekly-trading-review workflow.

Not for: tax returns, accounts or payroll (send those to an accountant), or online store analytics (see the `ecommerce-manager` kit).

## What you need

- **Item sales export** for the period: item, variation, category, units sold, gross sales, discounts, net sales. Square, Shopify POS and Lightspeed all export these to CSV.
- **Sales by hour and day**, or the transaction list with timestamps.
- **Cost prices** by item (or the margin you aim for by category). Without them, mark margin as unknown.
- **Stock on hand** and, where the till tracks it, a sell-through or aging report (Square's sell-through report needs Retail Plus or Premium).
- **Context:** opening hours, events, weather, staff changes, stock-outs and deliveries in the period.
- **Access I have:** level 1 is enough for this skill. With level 2 I can save draft price changes or a draft purchase order for the actions. Level 3 changes (moving prices on named lines within floors) happen only after the client approves the actions.

## Steps

1. **Check the data.** Note the date range, locations, and whether refunds, discounts and gift cards are included. Look for gaps: days missing, items with no category, negative stock. List anything odd before drawing conclusions.
2. **Headline numbers.** Net sales, number of transactions, average transaction value (net sales divided by transactions) and units per transaction. Compare with the same period last year if given, else the previous period. Say which comparison you used.
3. **Rank lines.** Sort items by net sales and by gross margin (if cost is known). Mark the top lines that make most of the sales (A), the middle (B) and the long tail (C). Flag lines that sell well but earn little, and lines with high margin but low visibility.
4. **Busy and dead hours.** Build a day-by-hour grid of transactions and sales. Name the three busiest and three quietest blocks. Busy blocks drive staffing and stock on the shop floor; quiet blocks are where events, workshops or offers to locals can help.
5. **Slow stock.** From stock on hand and sales rate, list lines with weeks of stock far above the season left, or low sell-through. Use the client's own sell-through, and if quoting Square's guide that 80% and above is generally excellent and below 40% is concerning, say it is a vendor rule of thumb.
6. **Out-of-stocks.** Look for best sellers with zero sales for several days in a row while normally steady. Those days are probably stock-outs, not lack of demand.
7. **Choose three actions.** One each, if the data supports it:
   - **Promote:** a high-margin line with low visibility, or a line to feature in the window.
   - **Move or mark down:** a slow line, moved first (better spot, bundle, till point), marked down second.
   - **Reorder:** a best seller at risk of running out, with quantity from sales rate and lead time.
8. **Name what to watch.** One or two numbers for next week, such as Saturday afternoon basket size or units of the featured line.
9. **For an event review:** profit = sales minus pitch fee, travel, staff, card fees and cost of goods sold (start count minus end count, at cost). Compare sales by hour with footfall notes. End with three changes for next time.

## Checks

- Every figure traces to the export, with the date range shown.
- ATV and UPT are worked from the same transaction count.
- Margin is shown only where cost prices were given; otherwise "unknown".
- Refunds and discounts are treated the same way across periods.
- No action relies on a number the client did not provide.
- Any price action respects the client's floors and, in the EU, the 30-day lowest price rule for announced reductions.
- At level 3, price changes stay inside the approved list and are logged.

## Output format

1. **Period and data notes** (date range, gaps, anything excluded).
2. **Headline table:** net sales, transactions, ATV, UPT, against the comparison period.
3. **Top 10 and bottom 10 lines** by net sales, with margin where known.
4. **Day-by-hour grid** with the busiest and quietest blocks named.
5. **Slow stock and stock-out list.**
6. **Three actions** (promote, move or mark down, reorder), each with the reason and the number behind it.
7. **What to watch next week.**
8. **Access and log:** the level used and any changes made.

## Example of good output (short)

*Illustrative structure, not a real business: a bookshop. Data: Square item sales and transactions, 1 Aug to 31 Oct 2026, one location. Access I have: Square level 1. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Headline:** net sales up 6% on the same months last year; transactions flat; ATV up, so people bought more per visit rather than more people coming in.

| | Aug to Oct 2026 | Aug to Oct 2025 |
|---|---|---|
| Net sales | £41,300 | £38,960 |
| Transactions | 2,950 | 2,940 |
| ATV (net sales / transactions) | £14.00 | £13.25 |
| UPT (units / transactions) | 1.6 | 1.5 |

**Busiest:** Saturday 11:00 to 15:00. **Quietest:** Tuesday and Wednesday 10:00 to 12:00.

**Actions:**
1. **Promote** the local-history shelf: high margin, sells steadily, but sits at the back. Move a face-out display to the table by the till for four weeks; watch its units per week.
2. **Move** the adult colouring books: weeks of stock far above the season left. Bundle with pencils at the till first; mark down only if still slow after three weeks.
3. **Reorder** the children's book of the month: zero sales on four Saturdays in October, which look like stock-outs. Draft purchase order saved at level 2 for your approval.

**Watch next week:** Saturday afternoon ATV, and units of the local-history shelf.
