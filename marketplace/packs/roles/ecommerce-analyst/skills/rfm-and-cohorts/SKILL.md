---
name: rfm-and-cohorts
description: Scores every customer on recency, frequency and spend from an order export, names segments in plain words (matching Shopify's RFM groups where useful), sizes each group's share of customers and revenue, builds a repeat-purchase cohort table by first-order month with time to second order, and lists good customers who are slipping, with a next step per group. Use for "who are our best customers", a retention or email plan that needs target lists, or a check on whether new customers come back as often as they used to.
---

# RFM scores and repeat-purchase cohorts

Two questions sit behind most retention work: who are our customers now (RFM), and are new customers coming back as well as earlier ones did (cohorts). Both come from the order export, not from web analytics, because GA4 cohorts see only consenting visitors on one device.

## When to use

- "Score our customers and tell us who the best ones are."
- "Which regulars have gone quiet, and what did they use to spend?"
- An email or loyalty plan that needs named target groups.
- Owners worried that repeat buying is falling.

## What you need

**Access:** level 1 for steps 1 to 8. Level 2 to save draft segments in the store or email tool. Level 3 to create live segments or customer tags you approved. Syncing a list to a new email list, ad audience or app always needs a fresh yes.

- Order export, ideally 24 months or more: order ID, order date, customer ID (or email, hashed or masked if possible), net order value, refunds, cancelled flag.
- Date of the export (the "as of" date for recency).
- Which customers may be used for marketing (consent flag), and in which countries.
- Optional: product lines, discount codes, first-order channel.

## Steps

1. **Clean.** Remove test and cancelled orders; net off refunds; merge duplicate customers where the customer ID or email matches; drop orders with no customer (guest checkouts can be matched by email if the client allows). Write down every rule and how many rows it changed.
2. **Per customer:** days since last order (R), number of orders (F), total net spend (M), first order date, and days between first and second order.
3. **Score.** Split each measure into fifths of this store's customers, 5 being the best fifth, as Shopify does. For a small base, use thirds instead and say so. Recency scores run the other way: fewer days is better.
4. **Group.** Use plain names a shop owner would use. To line up with Shopify's RFM report, combine F and M as (F + M) ÷ 2 rounded down, and map R and FM to groups such as Champions, Loyal, Promising, New, Needs attention, At risk, Almost lost and Dormant. Show the rule for each group in one line.
5. **Size each group:** customers, share of customers, share of revenue, average order value, median days since last order.
6. **Build the cohort table.** Rows are first-order months; columns are the share who ordered again within 30, 60, 90, 180 and 365 days, plus median days to second order. Leave a cell blank if the cohort is too young to have completed that window.
7. **Find the slipping list.** Customers who used to buy often (high F) and whose recency is now well past their own usual gap between orders, ranked by past spend. Use customer IDs.
8. **Write one action per group,** with the revenue at stake (group size × typical order value, labelled as an estimate). Pick the one group to start with and say why.
9. **Save or create segments (level 2 or 3).** Build the agreed segments in the store or email tool; log each one with its rule and count. Never send messages; that's the email team's job once the client approves.

## Checks

- Customer count after cleaning is explained against the raw count.
- Scores are relative to this store; the cut-points are shown.
- Cohort cells for incomplete windows are blank, not low.
- Segments use only customers the client may contact for the stated purpose.
- The file uses IDs, not names, unless the client asks otherwise.
- Formulas or steps are written so the client can rerun them next quarter.

## Output format

1. **Cleaning log.**
2. **Segment table:** group, rule, customers, share of customers, share of revenue, AOV, median days since last order, action.
3. **Cohort table** and a two-line reading.
4. **Slipping list** (separate sheet): customer ID, past orders, past spend, days since last order, usual gap.
5. **Start here:** the one group and why.
6. **How to rerun.**

## Example of good output (short)

*Larkspur Coffee Co. is a made-up coffee subscription and shop used only to show the format. Figures are invented. As of 31 Oct 2026; 6,120 customers after cleaning (from 6,488: 211 duplicates merged, 157 test or fully refunded).*

| Group | Rule | Customers | Share of revenue | AOV | Action |
|---|---|---|---|---|---|
| Champions | R 5, FM 5 | 410 | 31% | £42 | Early access to new roasts; no discounts |
| At risk | R 1 to 2, FM 4 to 5 | 520 | 14% | £39 | Personal "we've missed you" note from the roaster |
| New | R 5, F 1 | 780 | 6% | £27 | Second-order nudge at day 21 (median gap 24 days) |

**Cohorts:** customers who first ordered in March 2026 came back within 90 days at 34%, against 41% for March 2025. September 2026 is too young to read.

**Start here:** At risk. 520 customers who averaged 6 orders; bringing back one in five for one order at their usual order value is worth about £4,000 (104 × £39, estimate).
