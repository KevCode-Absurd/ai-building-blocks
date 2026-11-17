---
name: sales-change-diagnosis
description: Explains a sales dip or spike in an online store, step by step. First rules out data problems (tracking breaks, double-firing tags, time zones, Shopify's September 2026 session change, cookie banner changes, late refunds), then splits revenue into sessions, conversion rate and average order value, then finds the channel, product, device or market behind the change, and says how sure the answer is. Use when someone says "sales dropped 30% this week, what happened?" or before anyone acts on a sudden jump.
---

# Sales change diagnosis

Most "sales crashes" are part data, part real. The job is to separate the two fast, then point at the part of the store that moved, with an honest level of certainty.

## When to use

- "Sales fell 30% this week. What changed?"
- A spike nobody can explain.
- Before cutting ad spend or blaming a channel after a bad week.

## What you need

**Access:** level 1 for every step. Level 2 to save the diagnosis as a draft report. Level 3 to add a GA4 annotation marking the cause, within the client's limits. Fixing a tag or a theme is the developer's or marketing analyst's job; I hand over the fix list.

- Store order export for at least 8 weeks, by day: orders, net sales, refunds, channel, country, device if available, product lines.
- Analytics export for the same days: sessions and purchases by channel, device and landing page.
- Calendar of changes: site releases, app installs, theme edits, price changes, promotions, emails, stock-outs, ad budget changes, cookie banner or consent changes.
- Time zone and currency.

## Steps

1. **State the claim precisely.** Which number, which period, against what? "Net sales down 30% week on week" differs from "GA4 revenue down 30%".
2. **Rule out data problems, in this order:**
   1. *Store versus analytics.* If store orders held and analytics purchases fell, flag a measurement discrepancy, not a confirmed tracking fault. Find the first day the gap changed; reconcile transaction IDs, time zones, consent, channel mix, modelling and event receipts before naming the cause.
   2. *Double counting.* Repeated transaction IDs or analytics purchases above store orders point to a tag firing twice.
   3. *Time zone and cut-off.* Daily differences that vanish in weekly totals are time zone effects.
   4. *Known breaks.* Shopify changed session measurement from 21 to 23 September 2026, and referring channel values from 18 October 2026. A cookie banner added or changed in the EEA or UK lowers sessions in those markets.
   5. *Refunds.* Shopify books returns on the refund date, so a refund wave can cut a week's net sales without any drop in orders.
   6. *Test or cancelled orders* counted in one source and not the other.
   Report each check as passed or failed, with the number.
3. **Split the real change.** Revenue = sessions × conversion rate × AOV. Work out each part's change and how much of the revenue change it explains. Use orders from the store and sessions from one source.
4. **Drill into the part that moved:**
   - *Sessions moved:* by channel, then by campaign or landing page. Compare with ad spend and email sends.
   - *Conversion moved:* by device, then by funnel step (cart, checkout, purchase), then by landing page and market. Look for a release, an app, a payment method or a delivery price change on that date.
   - *AOV moved:* by product mix, discount use, bundle uptake and units per order.
5. **Check for outside causes** the client has noted: stock-outs on best sellers, a competitor sale, a holiday shift (compare the same week last year by date and by weekday).
6. **Say how sure you are.** "Confirmed" when the store data shows it directly (orders from one product fell to zero when it sold out). "Likely" when timing and size fit but nothing proves cause. "Unknown" when nothing fits; say what data would settle it.
7. **Recommend one or two actions,** sized to the evidence, and name who fixes what (developer, media buyer, merchandiser).
8. **Annotate (level 3).** Add a GA4 annotation for the cause and date if allowed; log it.

## Checks

- Every data check is written down, even the ones that passed.
- The split adds up: the parts' effects roughly explain the revenue change.
- No channel blamed on platform-reported conversions alone.
- Year-on-year comparisons line up by weekday and holidays.
- Certainty labelled on each finding.

## Output format

1. **The claim,** restated with numbers.
2. **Data checks:** a table of check, result, number.
3. **The split:** sessions, conversion rate, AOV, each with its change and share of the revenue change.
4. **Where it came from:** the drill-down table that shows the source.
5. **Cause, with certainty,** and what would confirm it.
6. **Actions and owners.**

## Example of good output (short)

*Illustrative structure, not a real business: a camping gear store. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Claim:** GA4 revenue down 31% (week of 12 Oct against the week before). Store net sales down 6%.

| Check | Result |
|---|---|
| Store versus analytics | Failed. GA4 purchases fell from 92% of store orders to 64% from Tuesday 13 Oct |
| Double counting | Passed. No repeated transaction IDs |
| Time zone | Passed |
| Known breaks | Theme update published 13 Oct, 10:40 |
| Refunds | £1,100 of refunds on September orders this week |

**Split (store data):** orders down 4%, AOV down 2%; Shopify sessions flat.

**Cause:** the theme update likely removed the GA4 tag from the thank-you step (confirmed by tag check: no purchase event fires). The real decline is about 6%, mostly from refunds and a sold-out tent (orders for it fell from 41 to 0).

**Actions:** developer restores the purchase tag today; mark 13 to 15 Oct as partial in GA4; restock alert on the tent.
