---
name: new-customer-cost-by-channel
description: "A table of what each new customer really costs by channel (Meta, Google, TikTok, Pinterest, creators and any other paid source), counted from the store's own first-time orders rather than each platform's claims, and set against first-order gross profit and 90-day gross profit for customers that channel brought in. Gives each channel a range from three views (store attribution, platform report, post-purchase survey), a blended new-customer cost and acquisition MER, and a verdict per channel: scale, hold, fix, cut or not enough data. Use monthly, before setting next month's budget, when platforms claim more sales than the store has, or before adding or dropping a channel."
---

# New-customer cost by channel

**You get:** a one-page table, per channel, of new customers, spend, cost per new customer as a low to high range, first-order gross profit, 90-day gross profit and a verdict, plus the blended new-customer cost for the whole store, ready to feed the monthly budget.

## When to use

- Next month's budget is being set and needs a cost per new customer for each channel.
- Meta, Google and TikTok together claim more purchases than the store took.
- The store added creators, Pinterest or TikTok and nobody knows if they bring new buyers.
- Revenue grows but profit does not, and repeat buyers may be hiding weak acquisition.

## Not for

- The weekly blended view of Meta and Google on gross profit, with over-claim and branded search checks: use `blended-channel-profit-view`.
- Full repeat curves and lifetime value by cohort: use `cohort-repeat-and-ltv-analysis`; this skill reads its 90-day line.
- Proving a channel adds sales the store would not have made anyway: use `measure-channel-lift-with-holdouts`.
- Setting the budget itself: hand this table to `set-ad-budget-from-profit-target`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 6 months: Name, Created at, Customer Email, Subtotal, Discount Amount, Shipping, Refunded Amount, Payment Method, Cancelled at, Lineitem sku, Lineitem quantity. Add delivery status for COD orders on India stores.
2. **Order source per first order**, one of: Shopify's marketing attribution report (orders by channel and UTM), or a GA4 exploration of purchases by first user source and medium with transaction ID, joined to the Shopify order name.
3. **Spend by channel by month**, from each ads manager, plus creator fees, product seeding cost and agency fees by channel.
4. **Gross profit per order** from delivered costs (from `build-sku-profit-sheet` or `store-meta-math`).

Optional: post-purchase survey answers ("how did you hear about us", from `post-purchase-how-did-you-hear-survey`), platform-reported new-customer conversions, and Amazon sales if the store also sells there.

If order source is missing, use the survey alone and mark every cost "survey only". If both are missing, give the blended new-customer cost only and hand off to `set-up-utm-tracking-for-all-channels`. No access above read is needed.

## Before you start: the gates

1. **Gross profit per order is known** from delivered cost to the door [MEA-0037]. Fail: compute it first; costs mean nothing without it.
2. **New customers are counted correctly.** A new customer is an email or phone with no earlier order. Remove test, staff, cancelled and fully refunded orders. India: remove COD orders that were returned to origin; they are not customers. Fail: fix the list before any cost.
3. **UTM tags are consistent.** Values are case sensitive, so "Meta" and "meta" split into two rows [MEA-6221]. Fail: merge spellings by hand and flag the fix.
4. **Windows match.** Platforms report on different default windows: Pinterest 30-day click [MEA-6100], Snap 28-day swipe [MEA-6101], Reddit 28-day click [MEA-6102], Meta read on 7-day click [MEA-0042]. Fail: re-pull platform numbers on the same click window, or leave the platform view out.

## Steps

### 1. Build the new-customer list

From the export, find each customer's first ever order. Count, per month, new customers and their first-order gross profit (net of discount, refund and delivered costs). Do not use Shopify's returning customer rate to infer new customers; it measures orders, not people, and moves with acquisition [MEA-0021].

### 2. Give each first order a channel

Use store-side data, in this order of trust:

1. The order's UTM source and medium or landing page with a click ID (fbclid, gclid, ttclid).
2. GA4 first user source for that transaction ID.
3. Referrer only.
4. None: "direct or unknown".

Keep email, SMS and WhatsApp out of acquisition for first orders unless the signup came from a paid ad; a signup from an ad that bought later belongs to that ad's channel. An ad that misses on cost can still earn its place by capturing cheap signups that the flows convert [MEA-0043].

### 3. Load cost per channel

All money spent to win customers in that channel: ad spend, creator fees, free product at landed cost, agency or freelancer fees, and app fees tied to it. India: include GST on ad spend if the store cannot claim it back.

### 4. Work out three views of cost per new customer

Per channel per month:

- **Store view** = channel cost / new customers attributed in step 2.
- **Platform view** = channel cost / platform-reported new-customer purchases (only where the platform separates new customers; else skip).
- **Survey view** = channel cost / (all new customers x that channel's share of survey answers). If a channel takes about half the spend, about half the answers should name it [MEA-0045].

Report the range low to high. Where views disagree by more than half, say which is likely wrong and why. Small channels mislead in both directions: tiny budgets drift to warm visitors and look cheap, while a real prospecting test can show its effect in another platform's numbers [MEA-0040].

### 5. Work out the blended number

Blended new-customer cost = all paid acquisition cost / all new customers. Acquisition MER = new-customer revenue / ad spend [MEA-0025]. Track these, not blended MER: blended MER can rise while new-customer efficiency falls [MEA-0039]. At large retailers acquisition MER can sit far below what Meta reports [MEA-0031]. If the store sells on Amazon too, note that part of ad value lands there [MEA-0029].

### 6. Set each channel against profit

Per channel:

- First-order gross profit per new customer (channels bring different order values and discounts).
- 90-day gross profit per new customer, only for customers acquired at least 90 days ago [MEA-0048]. Use `cohort-repeat-and-ltv-analysis` by first channel when available.
- Ratio = gross profit / cost per new customer, at first order and at 90 days. Under 1 loses money, 1 to 2 holds, 2 to 3 is where to scale, over 3 may mean under-spending [MEA-0032] [MEA-0024].

Expect 90-day lift to differ by category: 365-day gross profit lift over first order ran about 55% for fashion, about 110% for supplements, near zero for furniture [MEA-0052]. Low-repeat stores must be paid back on the first order.

### 7. Give each channel a verdict

| Verdict | Rule |
|---|---|
| Scale | 90-day ratio 2 or more on store view and the range is tight |
| Hold | Ratio 1 to 2, or views disagree |
| Fix | First-order ratio under 1 but click and add-to-cart costs are healthy: page, offer or tracking problem |
| Cut | 90-day ratio under 1 on all views for two months |
| Not enough data | Fewer than about 20 new customers in the month (practitioner default, test it) |

A cut on a small upper-funnel channel waits for a holdout test (`measure-channel-lift-with-holdouts`) when the survey names it often.

## Checks before you hand it over

- New customers exclude test, cancelled, refunded and RTO orders.
- Each channel's cost includes creator fees, seeded product and agency fees.
- Platform numbers use the same click window as the store's standard.
- Every cost is shown as a range with its views named.
- 90-day profit uses only cohorts at least 90 days old.
- The blended new-customer cost and acquisition MER are on the page.
- Every verdict cites its rule from step 7.

## Output

**One-screen summary:** blended new-customer cost, acquisition MER, the best and worst channel on 90-day ratio, the one channel with the widest disagreement between views, and the action for each verdict. Runner-up reading in one line where the data is thin.

**Channel table** (`new-customer-cost-<month>.csv` or Google Sheet):

| Column | Meaning |
|---|---|
| Channel | Meta, Google, TikTok, Pinterest, creators, other, direct or unknown |
| Cost | All acquisition cost in the channel |
| New customers (store) | From step 2 |
| Cost per new customer: store / platform / survey | Three views |
| Range | Low to high |
| First-order gross profit | Per new customer |
| 90-day gross profit | Per new customer, mature cohorts only |
| Ratio first order / 90 days | Gross profit / cost |
| Verdict | Scale, hold, fix, cut, not enough data |
| Note | Why views disagree, tracking fix needed |

Plus a monthly trend tab: blended new-customer cost and acquisition MER for the last six months.

## Common mistakes

- **Platform purchases as new customers.** Most include repeat buyers; step 4 counts new customers from store orders.
- **Leaving out creator and agency costs.** Step 3 loads every cost, so creators are not falsely cheap.
- **Comparing windows.** A 30-day click Pinterest report against a 7-day click Meta report flatters Pinterest; gate 4 matches them.
- **Counting COD orders that never arrived.** Gate 2 removes RTO.
- **Using lifetime value from young cohorts.** Step 6 waits until cohorts are 90 days old.
- **Cutting a channel whose lift shows elsewhere.** Step 7 sends small upper-funnel channels to a holdout first.

## Sources

- MEA-0021: Shopify's returning customer rate is not repeat rate.
- MEA-0024, MEA-0032: gross profit to cost bands.
- MEA-0025, MEA-0031, MEA-0039: acquisition MER over blended MER and platform ROAS.
- MEA-0029: part of ad value lands on Amazon.
- MEA-0037: gross margin from delivered cost.
- MEA-0040: small channels mislead in-platform.
- MEA-0042: read Meta on 7-day click.
- MEA-0043: count cheap signups the flows convert.
- MEA-0045: survey share should track spend share.
- MEA-0048: rank only on cohorts old enough.
- MEA-0052: 365-day profit lift by category.
- MEA-6100, MEA-6101, MEA-6102: Pinterest, Snap and Reddit default windows.
- MEA-6221: UTM values are case sensitive.

What makes this skill ours: new customers are counted from the store's own first orders with RTO removed; every channel gets a range from three views instead of one number; creator fees and seeded product count as acquisition cost; and verdicts use 90-day gross profit only from mature cohorts, with small upper-funnel channels sent to a holdout before any cut.
