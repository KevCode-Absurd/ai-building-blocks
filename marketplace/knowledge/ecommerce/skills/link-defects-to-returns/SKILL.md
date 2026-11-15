---
name: link-defects-to-returns
description: "A per-SKU table that matches return reasons, refund notes, support tickets and one to three star reviews to the factory defects behind them, sorts each into maker, transit, listing promise or buyer fit, puts a money cost on each defect (refunds, reships, return shipping, unsellable stock, lost reviews and repeat orders), and turns the top ones into new lines on the defect list, tighter inspection points, a carton test or a corrective action request to the supplier, with a 90-day check that the fix worked. Use when returns or bad reviews rise for a product, after a new batch or supplier, or once a month for your top sellers."
---

# Link factory defects to your returns

**You get:** a defect-to-return table for each SKU in scope (defect, where it starts, returns and reviews it caused per 100 units sold, cost a month, evidence), the three costliest defects with the fix for each (new defect list line, inspection point, carton test, spec change or corrective action request), a draft note to the supplier with photos and counts, and a 90-day tracker that shows whether the next lot is better.

## When to use

- Returns or one to three star reviews rose for a product, and nobody can say if the factory, the courier or the listing is to blame.
- A new production lot, a new supplier or a cheaper material has just gone on sale.
- Once a month for the top ten sellers by revenue, before the next purchase order.
- Before a price or terms talk with a supplier, so the store argues from counts and costs, not feelings.

## Not for

- Writing the first defect list and the sample checks before a first order: use `order-samples-and-quality-check`.
- Scoring all suppliers each quarter: use `supplier-scorecard`; this skill feeds its quality score.
- Return policy, portal and refund rules: use `set-up-returns-and-exchanges`.
- The full cost of returns and failed deliveries by area and channel: use `returns-and-rto-cost-analysis`.
- Reading all support tickets for every kind of theme: use `turn-support-tickets-into-insights`.
- Replying to the bad reviews themselves: use `reply-to-negative-reviews`.
- Rewriting the spec or tech pack once a fix is agreed: use `write-product-spec-sheet-for-factory`.

## What you need

Required (read access, level 1):

1. **Returns by line item** for the last 90 days and the 90 days before: order number, SKU, variant, lot or ship date, return reason, the buyer's free-text note, refund amount, whether the item came back and its condition on arrival. In Shopify, Total sales by product filtered to returned items lists reasons per product [COG-6323].
2. **Units sold per SKU and variant** for the same periods, so every count becomes a rate.
3. **Support tickets** tagged damaged, faulty, wrong item, not as described or quality, with any photos buyers sent.
4. **Reviews of one to three stars** for the same SKUs, with dates.
5. **The current defect list** (critical, major, minor), the approved spec or tech pack, and the last inspection reports for each lot.

Optional: the warehouse's notes on returned goods, carrier damage claims, lot numbers printed on the goods, and the landed cost per unit.

Drafting the supplier note and the new checks is level 2. Sending anything to the supplier, holding a payment, changing a purchase order or pulling stock from sale needs the owner's yes.

## Before you start: the gates

1. **Reasons are logged.** At least 80% of returns in the period carry a reason. A refund issued without a return record keeps no reason at all, so check how returns are entered [CXP-6612]. Fail: read the free-text notes and tickets for a sample of 100 returns, tag them by hand, and say the table rests on a sample.
2. **Rates, not counts.** Every figure is per 100 units sold of that SKU and variant. A best seller always has the most returns. Fail: stop until units sold are in.
3. **Lot or ship date known.** Each return links to the lot it came from, or at least to the month it shipped. Without it you cannot tell an old problem from a new batch. Fail: link by ship date and say so.
4. **Evidence before blame.** A defect is charged to the factory only with a photo, a returned unit checked by a person, or the same fault named by three or more buyers. Some returns are fraud or buyer's remorse dressed as a defect, so check the goods before you charge a supplier [CXP-6613].
5. **Safety first.** Any return, ticket or review that mentions a burn, cut, shock, choking, rash, fire, leak of a harmful liquid or injury goes to the owner the same day, outside this report. In the US a firm may have to report a possible hazard to the CPSC within 24 hours of having reasonable information [COG-6393]; other markets have their own product safety bodies. The owner decides with a qualified adviser.

## Steps

### 1. Build the base table per SKU

For each SKU and variant: units sold, returns, return rate per 100 units, refunds without return, one to three star reviews per 100 units, defect-type tickets per 100 units, and the change from the period before. Sort by return rate times units sold, so a high rate on a big seller comes first. Mark any SKU whose rate rose by half or more on similar volume.

### 2. Read the words and sort every return into four sources

Tags hide causes. "Defective" may be three different faults. Read the buyer notes, tickets and reviews by hand, at least 30 per SKU in scope or all if fewer, and keep the exact words [AVT-0007]. Tickets and returns are the highest-yield, lowest-effort research a store owns [AVT-0028]. Put each one in one bucket:

| Source | What buyers say | Who fixes it |
|---|---|---|
| Maker defect | Seam split, zip broke, wrong colour, scratched, does not switch on, smells | Factory, through QC |
| Transit damage | Box crushed, lid cracked, leaked in the parcel, arrived wet | Packaging and carton spec |
| Listing promise | Smaller than shown, not as soft, took weeks to work, colour differs from photos | Product page and ads |
| Buyer fit | Wrong size ordered, changed mind, did not need it | Size guide, page, policy |

Only the first two belong to the factory and packaging. Listing promise gaps go to the page and ad owners: drop or fix any claim that drives returns, even if the ad sells well [MCR-6727].

### 3. Name each maker defect the way an inspector would

Turn buyer words into a checkable fault: "handle came off" becomes "handle rivet pull-out under 5 kg load"; "colour looks cheap" becomes "shade outside approved swatch under daylight". Give each one a class using the store's list: critical (unsafe or illegal, zero allowed), major (a buyer would return it), minor (cosmetic, away from the main surfaces) [COG-6411]. A defect that is causing returns is at least major, even if the old list called it minor.

Check against the defect list. Each defect is either already on it (so inspection missed it), on it with the wrong class, or missing.

### 4. Link each defect to lots and suppliers

For each defect, count it per lot or ship month. A defect that appears in one lot points at that run. A defect that grows run after run while the price was pushed down points at quality fade, quiet cuts in material or parts [COG-6326]: compare weights, thickness or part makers against the golden sample. A defect spread across all lots and suppliers points at the design or spec, not the factory.

### 5. Put a money figure on each defect

Cost of a defect a month = returns caused x (refund + return label + original outbound shipping + payment fee not refunded + share of returned units that cannot be resold x landed cost) + reships x (landed cost + shipping) + agent minutes x hourly cost. The visible returns line usually understates the real cost of a return by a third or more [MEA-6276]. Add a note for lost value you cannot price exactly: one to three star reviews on the page and buyers who will not order again; a poor return experience makes most buyers less likely to come back [CXP-0007]. Group the costs under the external failure bucket of cost of quality, and set them beside what you spend on prevention and inspection [COG-6361]. When the external failure cost of one defect is bigger than a year of extra checks for it, the check pays.

### 6. Pick the fix for the top three

Rank defects by cost a month; break ties by trend. For each of the top three choose the cheapest fix that removes the cause, not just one that catches it:

- **Add or reclass a line on the defect list** with a measurable limit and a photo of pass and fail.
- **Add an inspection point**: a function test, a pull test, a colour check under set light, measured against an approved sample you send to the inspector yourself [COG-6348].
- **Tighten the sampling**: move the supplier to tightened inspection or level III after quality problems [COG-6335]; under the switching rules two rejected lots out of five move a supplier to tightened, five passes in a row move it back [COG-6408].
- **Test the carton** for transit damage: run drop tests at the height set by packed weight [COG-6324], and change the insert or carton before blaming the factory.
- **Design it out** when the same part fails across suppliers: ask what job the part does, list at least two ways to get that job done without it (merge it with a neighbour part, change the material, drop the job), write the trade-off of each in numbers, and pick one cheap test that could fail.
- **Write a corrective action request** to the supplier: the defect, the lot, the count per 100 units, photos, the cost, the root cause you ask them to find, the fix and the date. Re-inspection after a failed lot is at the supplier's cost by common practice [COG-6346].

### 7. Draft the supplier note and the internal handoffs

The supplier note is short, factual and numbered: what failed, how often, in which lot, the evidence attached, what you need by when. No threats and no guesses at cause. Internal notes go to the page owner (listing promise gaps with buyer quotes), packaging (transit damage), support (a macro for the defect while stock is still on sale) and the supplier scorecard (defect rate per lot). Nothing goes out until the owner approves.

### 8. Track the next lot for 90 days

For each fix, record the rate before, the date the fixed lot went on sale, and the rate at 30, 60 and 90 days on that lot only. A fix worked only if the rate fell on similar volume. If the rate holds after two lots, the cause was wrong: go back to step 3 for that defect.

## Checks before you hand it over

- Every figure is per 100 units sold of that SKU and variant, with the period shown.
- Every return in scope sits in one of the four sources; only maker and transit defects are charged to the factory or packaging.
- Each defect charged to the factory has photos, a checked unit or three or more matching buyer reports.
- Each top defect has a class, a lot link, a cost a month and one fix with an owner and date.
- Any safety mention went to the owner the same day and is not buried in the table.
- No buyer name, address, phone or order detail appears in anything sent to the supplier.

## Output

**One-screen summary:** the three costliest defects, their monthly cost, the fix for each, and how many of last month's fixes worked.

**Defect-to-return table:** SKU, Variant, Defect (inspector wording), Source (maker, transit, listing promise, buyer fit), Class, Lots affected, Returns per 100 units, Bad reviews per 100 units, Tickets per 100 units, Cost a month, Evidence, On defect list (yes, wrong class, missing), Fix, Owner, Date.

**New defect list lines:** Defect, Class, Limit or test, Pass photo, Fail photo.

**Supplier note draft** with counts, lots and photos attached.

**90-day tracker:** Defect, Fix, Lot on sale from, Rate before, Rate at 30, 60 and 90 days, Verdict.

## Common mistakes

- **Counting returns instead of rates.** Gate 2 and step 1 use per 100 units sold.
- **Blaming the factory for a page problem.** Step 2 sorts listing promise and buyer fit away from maker defects.
- **Charging the supplier without proof.** Gate 4 needs photos, a checked unit or several matching reports.
- **Fixing by catching, never by removing.** Step 6 asks for a design-out or a spec fix before more inspection.
- **Missing quality fade.** Step 4 compares lots over time against the golden sample.
- **Never checking the next lot.** Step 8 tracks the rate on the fixed lot only.
- **Keep-it refunds with no record.** Gate 1: a refund without a return record leaves no reason; ask for a photo before a keep-it refund so the defect data survives [CXP-0018].

## Sources

- AVT-0007: read buyer words by hand and keep them verbatim.
- AVT-0028: tickets and returns are high-yield, low-effort research.
- COG-6323: return reasons per line item in Shopify reports.
- COG-6324: carton drop test heights by packed weight.
- COG-6326: quality fade across production runs.
- COG-6335: when to use tightened or level III inspection.
- COG-6346: re-inspection after a failed lot at the supplier's cost.
- COG-6348: send the approved sample to the inspector yourself.
- COG-6361: the four buckets of cost of quality.
- COG-6393: US hazard reporting clock.
- COG-6408: switching rules between normal and tightened inspection.
- COG-6411: default classes for critical, major and minor defects.
- CXP-0007: poor returns cut repeat purchase.
- CXP-0018: keep-it refunds and return fraud.
- CXP-6612: refunds without a return record lose the reason.
- CXP-6613: check returned goods before charging a factory.
- MCR-6727: drop ad claims that drive returns.
- MEA-6276: the full cost of one return.

Built from the library items Weak part design-out planner (the design-out moves and the one cheap test) and Serial returner spotter (checking abnormal return patterns before acting), adapted from shopify-admin-return-fraud-detector by 40rty AI, MIT.

What makes this skill ours: every return is sorted into maker, transit, listing promise or buyer fit before anyone blames the factory; defects are written in inspector wording and costed with the full cost of a return; the fix removes the cause before it adds inspection; and the next lot is tracked on its own for 90 days.
