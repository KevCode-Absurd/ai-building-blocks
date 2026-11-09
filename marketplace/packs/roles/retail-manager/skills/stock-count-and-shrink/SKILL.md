---
name: stock-count-and-shrink
description: Plans and runs a shop or stall stock count (full or cycle) in Square, Shopify POS, Lightspeed or on paper, reconciles it against the record, works out shrink by line and by cause (theft, damage, paperwork, supplier error) using adjustment reason codes, and writes the fixes. Use before a season, after a delivery problem, when best sellers keep running out, when the stock record can't be trusted, or for start and end counts at a market or pop-up.
---

# Stock count and shrink

Stock records drift. A count brings the record back to what is on the shelf, and the gap, called shrink, tells you where money is leaking. This skill plans the count so nothing is missed, reconciles it safely, and splits the gap by cause so the fix is aimed at the right problem.

## When to use

- Before a busy season or a stock-take date the owner or accountant wants.
- When best sellers "run out" while the system still shows stock, or the reverse.
- After a messy delivery, a staff change or a run of unexplained adjustments.
- Start and end counts for a market or pop-up (also used by the pop-up-and-market-plan skill).

Not for: valuing stock for accounts or tax (ask a qualified accountant), or investigating a named person for theft (that is for the owner, with HR or legal advice).

## What you need

- **Which system** holds stock (Square, Shopify POS, Lightspeed, other, or paper) and its plan, since some count features need a paid tier (Square counts need Plus or Premium; counting inside the Shopify POS app needs POS Pro at that location).
- **Item list** with SKU or barcode, category, cost price and current recorded stock.
- **Adjustment history** for the last 3 to 12 months, with reasons (Square exports it to CSV).
- **Open orders, transfers, special orders and layaways**, which must not be counted as shop stock.
- **People and time:** who counts, when the shop is closed or quiet, and whether selling continues.
- **Access I have:** level 1 to read records; level 2 to set up a count in the system; level 3 to approve a cycle count or log adjustments, within the client's limits. Approving a **full** count always needs a fresh yes, because uncounted items can be set to zero and approval cannot be undone.

## Steps

1. **Choose full or cycle.** A full count checks everything at one location; a cycle count checks a part on a rolling schedule. Square recommends counting each variation at least every 90 days. A practical cycle: A lines (top sellers) most often, B lines less, C lines least, plus any line with repeated adjustments.
2. **Freeze the paperwork.** Book in every delivery, transfer and customer return before the count starts. Note items reserved for special orders or layaways; Lightspeed's guidance is not to count them.
3. **Set up the count.** In the system (level 2) or on a printed count sheet: location, categories, item list. For a full count, plan zones (shelf by shelf, back room last) and assign one counter per zone with a second person to recount any zone that varies.
4. **Count.** Scan or type, one zone at a time. Mark each zone finished. If selling continues, do not sell uncounted units of a line part-way through counting, and do not add units received after an item was counted.
5. **Close the gaps.** List items with no count. In a full count, every item must be counted or deliberately set to zero; in Square, uncounted variations are set to zero on approval, and in Lightspeed they sit on a Missed list until counted or zeroed.
6. **Review variances.** Sort by cost variance. Recount the biggest gaps before accepting them. Check deliveries, transfers and refunds for paperwork errors first.
7. **Approve or reconcile.**
   - Level 2: leave the count ready for the owner to approve.
   - Level 3: approve a cycle count within the agreed categories; for a full count, show the variance summary and get a fresh yes before approving. Log the action.
8. **Work out shrink.** Shrink units = recorded stock minus counted stock, after paperwork fixes. Value it twice: at cost (what the business lost) and at retail price (what it could have sold). Shrink rate = shrink at retail divided by net sales for the same period since the last count. Use the same basis every time so counts compare. Show both by category and for the top 10 lines.
9. **Split by cause.** Use reason codes on past adjustments (theft, damaged, lost, waste, vendor return) and the pattern of gaps: high-value small items near the door point to customer theft; gaps right after deliveries point to receiving errors; whole-case gaps point to supplier short deliveries; random small gaps across lines point to till errors.
10. **Fix by cause.** Receiving check against the delivery note; reason codes required on every adjustment; high-risk lines moved into sight of the till or into locked display; a staff till routine; supplier claims for short deliveries (prepared by me, sent only with the client's fresh yes).
11. **Set the next count** and the lines to watch.

## Checks

- Paperwork was booked in before counting; reserved stock was excluded.
- Every item in a full count has a count or a deliberate zero.
- The biggest variances were recounted before approval.
- Shrink is shown at cost and as a share of sales, with the period stated.
- Causes are described as patterns, never as accusations against a person.
- Supplier claims and anything sent outside the business wait for the client's fresh yes.
- At level 3, only agreed categories were approved, and every action is logged.

## Output format

1. **Count plan:** type, date, zones, counters, rules for selling during the count.
2. **Count sheet or system set-up** (item, SKU, location, recorded, counted, variance).
3. **Variance summary:** top gaps at cost, recount results, paperwork fixes.
4. **Shrink table:** by category and top lines, value and rate.
5. **Causes and fixes**, each with an owner and a date.
6. **Next count schedule** (A, B and C lines).
7. **Access and log.**

## Example of good output (short)

*Illustrative structure, not a real business: a kitchenware shop. System: Square for Retail Plus. Access I have: Square level 2 (set up counts, no approvals). Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Count plan:** full count, Sunday 9:00 to 13:00, shop closed. Zones: front tables (Ana), wall bays 1 to 4 (Tom), back room (Ana and Tom together). Recount any line over £20 at cost variance. Two special orders set aside, not counted.

**Variance summary:** 412 lines counted, 0 missed. Biggest gaps after recount: knife sharpeners (−9 units), cafetières (−4), silicone lids (+12). The +12 lids match a delivery booked twice in September: paperwork fix, not shrink.

| Category | Shrink at cost | Shrink at retail | Rate (retail / net sales since last count) |
|---|---|---|---|
| Small gadgets | £186 | £372 | 2.9% |
| Coffee and tea | £122 | £244 | 1.4% |
| Whole shop | £401 | £802 | 1.1% |

**Likely causes:** small gadgets near the door (customer theft pattern); one cafetière case short against the delivery note (supplier).

**Fixes:** move sharpeners to the counter display (Tom, this week); check every delivery against its note before booking in (Ana, from Monday); supplier claim drafted for the short case, waiting for your yes.

**Next:** the count is set up in Square and ready for you to approve. Then cycle counts of small gadgets every two weeks until shrink falls.
