---
name: weekly-store-report
description: Builds a one-page weekly store report from a store order export (Shopify, WooCommerce, BigCommerce) and an analytics export (GA4 or Shopify analytics). Checks that store and analytics agree before reading any trend, defines every metric once, shows sales, orders, sessions, conversion rate, average order value and new versus returning buyers against last week and the same week last year, adds a channel table, and ends with three to five plain findings and actions. Use for a Monday report, a new reporting template, or when a team argues about which number is right.
---

# Weekly store report

A weekly report is only useful if it's trusted and read. That means the numbers tie back to the store, the layout never changes, and the owner can read it in two minutes.

## When to use

- "Build our weekly report from these exports."
- Setting up a report template a team can update every Monday.
- The report exists, but nobody trusts it because Shopify, GA4 and the ad platforms all disagree.

## What you need

**Access:** level 1 for every step. Level 2 to save the report as a draft dashboard or sheet. Level 3 to publish or share the dashboard and add a GA4 annotation for known breaks, within the limits the client set.

- Store order export for this week, last week and the same week last year: order ID, date and time, customer ID, gross sales, discounts, refunds, shipping, tax, sales channel.
- Analytics export for the same days: sessions, purchases, purchase revenue, by default channel group.
- Time zone and currency. Ask; never assume.
- Known events: sales, launches, email sends, site changes, tracking or cookie banner changes, stock-outs.

If last year's data is missing, report against last week and the 4-week average, and say so.

## Steps

1. **Confirm the frame.** Write the date range, time zone and currency at the top. Shopify reports and GA4 can use different time zones, which moves orders between days.
2. **Define each metric once,** and keep the definitions identical every week:
   - Orders: store orders placed in the period, excluding test orders.
   - Net sales: gross sales minus discounts minus returns (Shopify's definition), excluding shipping and tax.
   - Sessions: from the named source (Shopify or GA4); never mix them across weeks.
   - Checkout-session conversion: sessions with a completed checkout ÷ sessions, from one source. Orders ÷ sessions is a separate custom order rate; multiple orders can occur in a session.
   - Purchase AOV: merchandise sales less discounts for the purchase cohort ÷ orders, excluding later adjustments. Period net sales ÷ orders is a separate custom KPI; show later refunds separately.
   - New and returning buyers: by each customer's first ever order date, not by GA4 "new users".
3. **Run the data check before anything else.**
   - Store orders against analytics purchases for each day. Note the usual gap, and flag any day where it changes sharply.
   - GA4 purchase revenue excludes tax and shipping, so compare it with store gross sales minus discounts, not total sales.
   - Look for repeated transaction IDs in analytics (double-firing tags).
   - Mark known breaks: Shopify's session measurement change (21 to 23 September 2026), Shopify's referring-channel value change (18 October 2026), cookie banner or tag changes.
   - Note refunds booked this week for older orders: Shopify records returns on the refund date, which can drag a week's net sales down.
4. **Build the KPI table:** this week, last week, same week last year, change versus each. Show absolute changes in rates as percentage points; label relative percentage changes separately.
5. **Build the channel table** from one source, with the same groups each week (for example: organic search, paid search, paid social, email, direct, referral, marketplaces, other). Say which attribution model it uses. Don't add up ad platform figures.
6. **Find what moved.** For the biggest change, split revenue into sessions × conversion rate × AOV and say which part moved. If something moved a lot, use the sales-change-diagnosis skill.
7. **Write three to five findings,** each with its number, comparison and one action. Plain words, one metric per sentence.
8. **Add the glossary** at the bottom, with the definitions from step 2.
9. **Save or publish (level 2 or 3).** Save the sheet or dashboard; at level 3, share it and annotate known breaks in GA4. Log what you changed.

## Checks

- Totals match the store's own sales report for the same filters.
- Same definitions and channel groups as last week; any change is noted in the data check box.
- No finding claims a cause the data can't show; "likely" where it's an inference.
- Partial data (tracking gaps, late refunds) is marked as partial.
- No customer names or emails in the report.

## Output format

1. **Data check box:** frame, store-versus-analytics gap, breaks, partial data.
2. **KPI table.**
3. **Channel table,** with the attribution model named.
4. **Findings and actions,** three to five lines.
5. **Glossary.**

## Example of good output (short)

*Illustrative structure, not a real business: an online tea shop. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Data check:** 27 Oct to 2 Nov 2026, Europe/London, GBP. Store orders 412; GA4 purchases 371 (90% of store orders, in line with the last 8 weeks). No breaks this week. £640 of refunds relate to October orders.

| Metric | This week | Last week | Same week 2025 | vs LW | vs LY |
|---|---|---|---|---|---|
| Net sales | £14,830 | £13,210 | £12,950 | +12% | +15% |
| Orders | 412 | 377 | 368 | +9% | +12% |
| Sessions (Shopify) | 16,480 | 15,900 | n/a | +4% | session change in Sept 2026 |
| Conversion rate | 2.50% | 2.37% | n/a | +0.13 pts | not comparable |
| AOV | £36.00 | £35.04 | £35.19 | +3% | +2% |
| Returning buyers' share of orders | 41% | 38% | 39% | +3 pts | +2 pts |

**Findings**
- Net sales rose 12%: conversion rate did the most (2.37% to 2.50%, about 5% higher), then sessions (+4%) and order value (+3%).
- The 30 October email drove 64 orders (last non-direct click, Shopify), against 38 the week before.
- Returning buyers took a bigger share, likely from the same email.
- Action: resend the email's winning offer to non-openers by Friday; check stock on the two top-selling blends.
