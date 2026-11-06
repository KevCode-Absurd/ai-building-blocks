---
name: reorder-and-account-plan
description: Reads a wholesale order history and groups buyers into new, active, slowing and lapsed using each buyer's own gap between orders, then writes reorder messages timed to when each buyer is likely to run low, based on what they last bought and what sells for similar shops, plus a short account plan for the top accounts. Use it when wholesale revenue depends on reorders, when buyers go quiet, or before a season. Never invents buyer names or order history; at level 3 it sends only approved messages to the agreed list.
---

# Reorder and account plan

## When to use

- Most wholesale revenue comes from repeat orders and some buyers have gone quiet.
- The client wants a reorder routine instead of one email to everyone.
- A season or trade show is coming and the client wants to prioritise accounts.
- A distributor's orders are shrinking and nobody knows why.

## Access needed

- **Level 1 (read):** order history from the store, CRM or accounting tool.
- **Level 2 (read and draft):** draft reorder emails and sequences, draft orders for buyers to confirm, and an account plan in the CRM.
- **Level 3 (read, write and publish):** send the approved reorder messages to the agreed buyers on schedule, and log replies in the CRM. Offers or discounts outside the agreed range, credit for overdue accounts, and messages to a new list need a fresh yes.

## What you need

1. Order history for at least 12 months: buyer (a code is fine), order dates, items, quantities, values.
2. Price list and any reorder offer the client allows.
3. Overdue invoices, if any.
4. Notes on each top account (contact, what they say sells, display space), if the client has them.

## Steps

### 1. Clean the history

One row per order. Merge duplicate buyers. Note the date range and gaps in the data.

### 2. Work out each buyer's own rhythm

For buyers with three or more orders, the typical gap between orders (median). For buyers with one or two orders, use the gap for similar buyers (same type or size) and mark it as estimated.

### 3. Group buyers

- **New:** one order, within their expected gap.
- **Active:** ordering on rhythm.
- **Slowing:** current gap clearly longer than their usual gap, or order sizes shrinking.
- **Lapsed:** gap far past their usual rhythm with no reply to the last message.

The client decides where "clearly longer" and "far past" fall; show the distribution so they can choose.

### 4. Read what they bought

For each buyer: last three orders, best sellers for them, products similar shops reorder that they have never tried, and anything discontinued they used to buy.

### 5. Write messages by group

- **New:** a check-in after their first order has had time to sell: ask what sold, offer a small reorder of the best seller.
- **Active:** a reminder timed just before their usual reorder, listing what they bought last time and one new product.
- **Slowing:** ask a real question (what is selling, what is not, any display or staff training they need) before offering anything.
- **Lapsed:** a short, honest note with something new and an easy way to say "not now".

Each under 120 words, one ask, the buyer's own products named. No pressure about their retail prices.

### 6. Plan the top accounts

For the accounts that make most of the revenue: current trend, what they stock and do not, one opportunity, one risk, the next step and its date.

### 7. Set the routine

Weekly: who is due a reminder this week. Monthly: who moved group. Quarterly: top account review. At level 3, send the approved messages on schedule and log replies.

### 8. Research (both modes)

With web search connected, look at the buyer's public shop or website for what they stock and how they display it, without collecting personal data. Without it, work from the client's notes.

## Checks

- Every buyer, order and number comes from the export; nothing is invented.
- Gaps are each buyer's own where there is enough history; estimates are marked.
- Messages name the buyer's own products and have one ask.
- No message tells a buyer what to charge or asks them to stop discounting.
- Overdue accounts are flagged before any reorder push.
- Sending stays within the approved list and schedule.

## Output format

1. Summary: revenue at risk in slowing and lapsed accounts, and the top three actions.
2. Buyer table: buyer code, group, usual gap, days since last order, last order value, next action and date.
3. Messages by group, with merge fields.
4. Top account plans.
5. Weekly and monthly routine.
6. Data gaps and facts to confirm.

## Example of good output (short)

*Made-up business for illustration: Hollow Oak Pantry, a jam and chutney maker selling to 60 farm shops and delis.*

> | Buyer | Group | Usual gap | Days since last | Last order | Next action |
> |---|---|---|---|---|---|
> | D-014 | Slowing | 42 days | 71 days | GBP 186 | Ask what is selling, 10 Nov |
> | F-031 | Active | 35 days | 30 days | GBP 240 | Reorder reminder, 8 Nov |
>
> **Reminder to F-031 (active)**
> Hi Ellie, your last order was six jars each of Damson Jam and Fig Chutney. If you're running low before the Christmas rush, I can send the same again this week. We've also just made a Spiced Pear Chutney that our farm shops are asking about; want two jars to try alongside your order? Reply "same again" and I'll sort it. Mark, Hollow Oak Pantry
