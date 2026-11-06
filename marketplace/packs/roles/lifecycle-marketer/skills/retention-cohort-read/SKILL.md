---
name: retention-cohort-read
description: Reads an order export or a subscriber export and shows where customers stop buying. Builds monthly cohorts, the second-order rate and days to second order by product, or a subscriber drop-out table by month or box, then picks the weakest stage, one fix to try and how to measure it against a holdout or the previous cohort. Use when a shop asks why customers do not come back, when to send reorder or win-back messages, or where subscribers cancel.
---

# Retention cohort read

Most shops know their total sales and not much else about repeat buying. This skill turns a raw export into three answers: how many first-time buyers come back, how long they take, and where the biggest drop is. It ends with one fix, not ten.

## When to use

- "Why don't customers come back?" or "Is our repeat rate good?"
- Before building a reorder, replenishment or win-back flow, to set the timing from real data.
- A subscription brand asking where subscribers cancel, or whether last month's fix worked.
- A monthly retention review (see the `monthly-retention-fix` workflow).

## What you need

- **Order export**, at least 12 months if the shop has it: order ID, order date, customer ID, product or SKU, quantity, order total, discount code, refund flag. Names, emails and addresses removed.
- **Or a subscriber export:** subscriber ID, start date, cancel date (blank if active), cancel reason, plan, number of paid orders, payment failures.
- **Product facts:** how long one unit lasts, typical delivery time, price and margin.
- **What ran when:** flows switched on or changed, sales, price changes, stock-outs, so a dip can be matched to a cause.

**Access:** level 1 is enough for the whole read (an export or read-only connector). Building the fix inside the client's tools needs level 2 (switched off) or level 3 (live, within limits).

## Steps

1. **Fix the definitions first and write them down.** A customer is one customer ID. An order is a paid order, excluding full refunds. A month is a calendar month. For subscriptions, a cancel is the date the customer asked to stop, and a failed payment that never recovers counts as involuntary churn, shown separately. Use the same definitions every month, or comparisons mean nothing.
2. **Clean the export.** Remove test orders, staff orders, wholesale accounts and full refunds. Merge duplicate customer IDs where the same person used two emails, if the client confirms. Note how many rows you removed and why.
3. **Build first-order cohorts.** Group customers by the month of their first order. For each cohort, count how many placed a second order within 30, 60, 90 and 180 days, and by month 3, 6 and 12. Show it as a triangle table: cohorts down the side, months since first order across the top.
4. **Days to second order, by product.** For customers who did reorder, find the median days from first to second order, split by the main product in their first order. Compare with how long one unit lasts. If the median gap is much longer than the product's life, people are buying elsewhere or running out and forgetting.
5. **For subscriptions, build the drop-out table.** Count subscribers active after order 1, 2, 3, 4 and 6 (or month 1, 2, 3 and 6). Find the step with the biggest fall. Then look at what happens just before it: a delivery, a price step after an intro discount, a long gap, a product swap, a failed payment. Split cancel reasons for that step.
6. **Check what happened to the shop.** Line up dips with events: a flow switched off, a price rise, a stock-out, a big discount month that pulled in deal-seekers. A bad cohort is often explained by where its customers came from.
7. **Pick the weakest stage.** Usually one of: first to second order, the first reorder window, a specific subscription box, or failed payments. Choose the one with the biggest drop that the business can change.
8. **Choose one fix.** Examples: re-time the reorder message to a few days before the product runs out, plus delivery time; add a how-to-use email in the first week; improve the box where people leave; add a pause option on the cancel page; fix the failed-payment emails. Write why this fix fits the evidence.
9. **Set the measure.** Name the main metric (second-order rate by day 60, or subscribers kept past box 3), the guardrails (opt-outs, complaints, discount cost, cancellations) and the comparison: a holdout group kept out of the change, or the next cohort against the last one. Attributed revenue alone does not count as proof.
10. **List what the client must confirm** before anything goes live: offers, product life, any discount and its cap.

## Checks

- Definitions are written at the top and match last month's.
- Cleaning steps and removed rows are listed.
- Small cohorts are flagged (a cohort of 40 customers moves a lot by chance) and not over-read.
- Recent cohorts are not compared with older ones on months they have not reached yet.
- Voluntary and involuntary churn are shown separately.
- The fix is one change, tied to the weakest stage, with a measure and a comparison group.
- No benchmark from another shop is used as a target.

## Output format

1. **Definitions and cleaning notes.**
2. **Cohort table** (or subscriber drop-out table) with the counts behind each percentage.
3. **Days to second order by product**, next to product life and delivery time.
4. **The weakest stage**, with the evidence and the likely causes.
5. **This month's fix**, the measure, the comparison group and the read date.
6. **Facts to confirm** and the access level each step needs.

## Example of good output (short)

*Larkfield Coffee Roasters is a made-up business used only to show the format. All figures are invented.*

**Definitions:** paid orders, full refunds removed (41 orders), customer = store customer ID, calendar months, Jan to Dec 2026.

| First-order month | Customers | 2nd order by day 30 | by day 60 | by day 90 |
|---|---|---|---|---|
| Jun | 412 | 9% (37) | 21% (87) | 27% (111) |
| Jul | 388 | 8% (31) | 20% (78) | 26% (101) |
| Aug | 455 | 10% (46) | 22% (100) | not yet reached |

**Days to second order:** 250 g bags, median 41 days; one bag lasts about 21 days at two cups a day; delivery takes 3 days.

**Weakest stage:** first to second order. Most reorders arrive three weeks after the bag would have run out, so customers are likely buying coffee elsewhere in between. The current reorder email goes out on day 45 for every product.

**This month's fix:** move the reorder email to day 16 for 250 g bags (5 days before a typical bag runs out, plus delivery) and add a text on day 18 for customers who agreed to texts. Keep a random 10% of new customers on the old timing as a holdout.

**Measure:** second-order rate by day 60, new timing against holdout. Guardrails: opt-outs, complaints, discount use. Read on 15 March, once the first two cohorts reach day 60.

**Confirm:** bag life at typical use; no discount in the reorder email unless approved.
