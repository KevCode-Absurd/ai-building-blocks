# Weekly trading cycle

**Cadence:** weekly, Monday morning, with a short Thursday stock check before the weekend.

**Trigger:** the trading week starts, or a sale, launch or season end is within six weeks.

## Steps

1. **Pull the exports (level 1; tools: store inventory and sales reports, cost list).** Stock on hand, units sold by week for 4 weeks, cost and price, and price history for the last 30 days for anything on sale or due for markdown.
2. **Run the review (prompt: weekly-trading-review).** Weeks of cover, sell-through, margin and trend per product; hero, push, clear, cut and reorder groups.
3. **Update the plan (skill: merchandising-and-markdown-plan).** This week's home page slots, collection tops and email features; markdown steps due; reorder list for the buyer. Before the plan is ready, run **period-capacity-and-dependencies**: allocate every task to its owner and source week, verify each week and the whole plan with `capacityPlan`, and preserve stock, cash and launch prerequisites.
4. **Check prices before they change (prompt: price-reduction-check).** EU "was" prices against the 30-day low; UK deadlines real and delivery included; US former prices genuine.
   **Approval point:** the owner approves the week's plan. Price changes inside the approved markdown plan, above its floors, can run at level 3 without a new yes; anything outside it needs one.
5. **Make the changes (level 2 to schedule; level 3 to apply within limits).** Reorder collections and home page slots; schedule markdown steps; send email features to whoever runs email.
6. **Thursday check.** Stock on featured products; any product selling out; any price or display error. If something unexpected happens (a price error, a featured product out of stock, a spike in returns), stop, fix what's inside the limits, and report.
7. **Log and report.** Every change: what, where, when, result. A three-line note: what sold, what didn't, what's next.

## Outputs

- Product table with groups.
- Trading calendar for the week and the next three, with owner-by-week hours, remaining capacity and saved calculation inputs/results.
- Markdown steps applied or scheduled, with price checks.
- Reorder list for the buyer.
- Change log and a weekly note.

## Needs the client's approval

- The weekly plan.
- The markdown plan, its steps and floor prices, before any step runs.
- Any price change, reduction or deadline outside that plan.
- Reorders and supplier orders (the client places them).
