---
name: rfm-customer-segments
description: "A customer sheet that scores every buyer on recency, frequency and gross profit, sorts them into seven named groups, and gives each group a plain plan: what to send, on which channel, with or without an offer, how often, and when they leave the group. Cutoffs come from the store's own days between orders, not fixed 180 and 365-day defaults, and spend is scored on gross profit, not revenue. Works from a Shopify order export in a sheet, or from Klaviyo's built-in RFM groups when the store meets their data floor. Includes notes for pay-on-delivery, failed delivery and phone-only buyers. Use before planning retention sends, when every customer gets the same email, or when the owner asks who the best customers are."
---

# Customer segments by recency, frequency and spend

**You get:** one sheet with every customer scored 1 to 3 on recency, frequency and gross profit, grouped into seven named segments, plus a one-page plan per group (goal, message type, channel, offer rule, frequency cap, exit) and the matching segment definitions for the email tool.

## When to use

- Every customer gets the same campaigns, whether they bought once two years ago or six times this year.
- The owner asks "who are our best customers?" and nobody can answer with numbers.
- Before `plan-monthly-email-calendar`, `win-back-lapsed-customers` or `vip-customer-program`, which all start from these groups.
- After a big sale brought in many new buyers and the team needs to know who to nurture first.

## Not for

- Cohort repeat rate and lifetime value by first product or channel: use `cohort-repeat-and-ltv-analysis`.
- Engagement-based list segments (opened, clicked, unengaged): use `build-klaviyo-segments`.
- Writing the emails each group gets: use `email-copy-from-store-history` or `write-win-back-email-series`.
- Picking and pricing VIP perks: use `vip-customer-program`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, 24 months if the store has it: Name, Email, Phone, Created at, Financial Status, Fulfillment Status, Subtotal, Discount Code, Discount Amount, Refunded Amount, Lineitem sku, Lineitem quantity, Payment Method, Tags, Cancelled at.
2. **Gross profit per SKU or per order** from `build-sku-profit-sheet`: landed cost, shipping, payment fees and a return allowance.
3. **Consent status per customer**: email marketing, SMS and WhatsApp opt-in, from Shopify's customer export or the email tool.

Optional: Klaviyo account with the RFM report, subscription export (active subscribers), returns or failed delivery list, support tickets flagged as open complaints.

If gross profit per SKU is missing, use revenue for the M score for now and label the sheet "revenue-based, redo with gross profit". If the export covers under 12 months, score recency and frequency only. Pushing segments into the email tool needs draft access (level 2); sending anything to them needs the client's yes.

## Before you start: the gates

1. **Gross profit known.** Pass when each order's gross profit is computed with delivered costs [MEA-0037]. Fail: score M on revenue and flag it; a high-revenue buyer who returns half her orders is not a top customer.
2. **Enough buyers.** Pass at 500 or more customers with a paid order, the same floor Klaviyo uses for its RFM report [EML-6325]. Fail: skip scoring and use three simple groups (one order, two or more orders, lapsed) until the store passes.
3. **Clean orders.** Cancelled, test, staff and fully refunded orders removed. Undelivered pay-on-delivery orders and other failed deliveries removed: they were never purchases.
4. **Capacity.** Ask how many group-specific sends the team can write and check a month. Plan only that many; the rest of the list gets the normal broad sends.

## Steps

### 1. Build one row per customer

Key customers on email; for buyers with no email, use the phone number in a single format (country code, no spaces). Merge rows that share either. For each customer compute: first order date, last delivered order date, delivered order count, total gross profit, total refunds, discount share (orders with a code divided by all orders), and channel consent.

### 2. Find the store's own reorder gap

Take every customer with two or more orders and compute days from first to second order. The median of that is the store's reorder gap, call it G. Klaviyo's defaults count a purchase within 180 days as recent and over 365 days as lapsed [EML-6325]; that suits a store whose gap is a few months, but is far too slow for a monthly consumable and too fast for furniture. Use G.

### 3. Score each customer 1 to 3

| Score | Recency (days since last order) | Frequency (delivered orders) | Monetary (total gross profit) |
|---|---|---|---|
| 3 | Up to G | 3 or more | Top third of customers |
| 2 | G to 2 x G | 2 | Middle third |
| 1 | Over 2 x G | 1 | Bottom third |

Twice the reorder gap is the usual point where a buyer counts as lapsed [EML-0019]. Frequency uses fixed counts instead of percentiles because most stores have far more one-time buyers than anyone else, and percentile cutoffs collapse when two thirds of buyers have one order. Monetary uses thirds of the store's own customers, the same idea as Klaviyo's 33rd and 66th percentile cutoffs [EML-6325].

### 4. Sort into seven groups

Apply the rules top to bottom; the first match wins.

| Order | Group | Rule (R, F, M) | Who they are |
|---|---|---|---|
| 1 | Do not market | Any score, with an open complaint, return in progress, chargeback or two or more RTOs | Fix or exclude first |
| 2 | Champions | R3, F3, M3 | Recent, frequent, most profit |
| 3 | Needs attention | R2, any F, M3 | Valuable, slowing down |
| 4 | Loyal | R2 or R3, F2 or F3 | Repeat buyers still active |
| 5 | New one-time | R3, F1 | Bought once, recently |
| 6 | At risk | R1, F2 or F3 | Used to repeat, now lapsed |
| 7 | Lapsed one-time | R1 or R2, F1 | Bought once, never came back |

Check every customer lands in exactly one group and the counts add up.

### 5. Read the groups before planning sends

For each group: customers, share of customers, share of 12-month gross profit, median days since last order, discount share, and how many can receive email, SMS and WhatsApp. Then decide where the effort goes. Under about 10 to 20 million a year, the usual limit on growth is turning first orders into second orders [EML-0053], so New one-time is often the biggest lever even though Champions earn the most per head. Customers won on deep discounts often repeat less [CXP-0016]; if New one-time has a high discount share, expect lower returns from it and do not answer with more discounts.

### 6. Write the plan per group

| Group | Goal | Send | Offer rule | Cap |
|---|---|---|---|---|
| Champions | Keep and hear from them | Early access, new products, a reply-to-founder note | No discounts; access and service instead | Normal sends plus 1 a month |
| Loyal | Move to Champions | Bestsellers they have not bought, refills, reviews ask | No sitewide codes; bundle or threshold offers only | Normal sends |
| New one-time | Second order | Hand to `post-purchase-repeat-sequence`; campaigns on use and results | Only a second-order offer that passes the gross profit check below | Normal sends |
| Needs attention | Catch before lapse | Personal note, what is new, a service check | Small and time-boxed at most | 2 extra a month for one month |
| At risk | Return | Hand to `win-back-lapsed-customers` | Ladder set there | Set there |
| Lapsed one-time | Return or sunset | Hand to `win-back-lapsed-customers` | Ladder set there | Set there |
| Do not market | Fix | Support follow-up only | None | No marketing |

Offer check for any group offer: gross profit of the expected order after the discount must stay above zero, and the discount must not be one the group would have bought without [OFF-0065]. Unannounced surprise gifts to a whole group rarely pay back; aim them at an at-risk slice instead [CXP-0006]. Active subscribers stay out of sitewide sale sends whatever their group [EML-0001].

### 7. Put the groups into the email tool

- **Klaviyo with RFM:** if the store meets the floor (500 buyers, 180 days of orders with orders in the last 30 days, some customers with 3 or more orders) and the plan includes it, build segments on the built-in group and edit the recency cutoffs to match G [EML-6325].
- **Without it (free path):** upload the sheet as a list import with a custom property "rfm_group", then build one segment per value. Shopify's own customer segments can approximate it with number of orders, amount spent and last order date filters, though amount spent is revenue, not profit.

### 8. Market notes

- **Phone-only buyers:** where buyers give only a phone (common with pay on delivery and chat orders), their channel is WhatsApp or SMS, so the plan needs opt-in status per customer. Score seasonal buyers carefully: a Black Friday or Christmas-only buyer can look lapsed in June; read R with a 13-month view before calling them lost.
- **SMS (US, UK, EU, Canada, Australia):** SMS goes only to customers with recorded SMS consent; most groups will be email-only.

### 9. Refresh monthly

Rescore on the first working day of each month. Track movement: how many New one-time moved to Loyal, how many Loyal slid to Needs attention. Movement, not group size, shows whether the plan works.

## Checks before you hand it over

- G is the store's own median days from first to second order, with the customer count it came from.
- Cancelled, test, staff, refunded and failed-delivery orders are out.
- M is scored on gross profit, or the sheet says it is revenue-based.
- Every customer sits in exactly one group; group counts add up to the customer total.
- Each group has a goal, send type, offer rule, cap and exit.
- Every offer passed the gross profit check.
- Channel counts use recorded consent only.
- Nothing was sent or switched on without a client yes.

## Output

1. **One-screen summary:** the seven groups with size, share of gross profit and the one move for each this month; the reorder gap G; the group to focus on and why.
2. **Customer sheet** (`rfm-customers.csv`): Customer key, Email, Phone, First order, Last order, Days since, Orders, Gross profit, Refunds, Discount share, R, F, M, Group, Email ok, SMS ok, WhatsApp ok.
3. **Group plan table:** Group, Customers, Share of gross profit, Goal, Send, Channel, Offer rule, Cap, Exit, Owner.
4. **Segment definitions** for the email tool, one line per group.
5. **Monthly movement log:** Month, Group, Start, In, Out, End.

## Common mistakes

- **Fixed 180 and 365-day cutoffs.** Step 2 uses the store's reorder gap.
- **Spend scored on revenue.** A heavy returner looks like a Champion. Step 1 scores gross profit.
- **Percentile frequency on a one-order-heavy list.** Step 3 uses order counts.
- **Discounting the best customers.** Step 6 gives Champions access, not codes.
- **Marketing to people with open complaints.** "Do not market" overrides every other group.
- **Counting failed deliveries as orders.** Gate 3 removes them before scoring.

## Sources

- EML-6325: Klaviyo RFM scoring, six groups, data floor.
- EML-0019: lapse at about twice the purchase interval.
- EML-0053: split by new, returning, loyal; first-to-second order is the usual constraint.
- EML-0001: keep active subscribers out of sale sends.
- CXP-0016: discount-acquired customers repeat less.
- CXP-0006: unannounced gifts rarely pay; target at-risk groups.
- OFF-0065: discounts raise break-even sharply.
- MEA-0037: gross margin is the delivered cost to the door.

What makes this skill ours: recency cutoffs come from the store's own reorder gap instead of fixed defaults; spend is scored on gross profit so heavy returners never pass as top customers; frequency uses order counts so one-order-heavy lists still split; and phone-only buyers and failed deliveries are handled before anyone is scored.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Remove undelivered COD orders (RTO) before scoring. Many COD buyers give only a phone, so the plan needs WhatsApp opt-in status per customer. A Diwali-only buyer can look lapsed in June; read R with a 13-month view before calling them lost.
