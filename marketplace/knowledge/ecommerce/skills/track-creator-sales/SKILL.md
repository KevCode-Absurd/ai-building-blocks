---
name: track-creator-sales
description: "A creator results sheet that shows, for every creator, the codes and links they used, orders, new customers, net revenue, full cost (fee, product, shipping, commission, tax) and gross profit per creator, plus a rebook, renegotiate or drop call for each. Includes the naming rule for codes and UTM links, a monthly update routine from the Shopify order export, and a survey check for sales codes miss. Use when creator spend is growing and nobody knows which creators pay, before rebooking creators, or when the profit team needs creator costs in the P&L."
---

# Track creator sales

**You get:** a code and link naming rule, a filled creator results sheet (one row per creator per month), a one-screen summary of who to rebook, renegotiate or drop, and a 30-minute monthly routine to keep it current.

## When to use

- The store pays or gifts more than five creators and cannot say which ones make money.
- Creator deals are up for renewal.
- The finance view needs creator costs and profit by month.
- A creator says their post "did great" and the owner wants to check.

## Not for

- Channel-level budget decisions across Meta, Google and creators: use `new-customer-cost-by-channel`.
- Setting up the affiliate program and rates: use `set-up-affiliate-program`.
- Measuring true lift with a holdout test: use `measure-channel-lift-with-holdouts`.
- Building the UTM rule for every channel: use `set-up-utm-tracking-for-all-channels` (this skill uses its creator part).

## What you need

Required:

1. **Shopify order export** for the period: Name, Created at, Financial Status, Fulfillment Status, Subtotal, Discount Code, Discount Amount, Refunded Amount, Shipping, Lineitem sku, Lineitem quantity, Payment Method, Customer Email, Tags. For India, also the delivery status per order from the courier panel (delivered or RTO).
2. **Landing data:** GA4 report of sessions and purchases by utm_source, utm_medium, utm_content, or Shopify's sessions by UTM.
3. **Creator cost log:** fees paid, product sent (units x landed cost), shipping, commission, usage fees, TDS or tax handling, by creator and month.
4. **Gross profit per order** by SKU from `build-sku-profit-sheet`.

Optional: post-purchase survey answers; views per post; TikTok Shop affiliate report if the store sells there.

Access: read only (level 1). Creating codes and links in Shopify is draft work (level 2) and the client approves it.

## Before you start: the gates

1. **Gross profit per order known.** Revenue alone ranks creators wrongly. Fail: stop and run `build-sku-profit-sheet`. Gross margin here means the delivered cost with all fees [MEA-0037].
2. **Every creator has a unique code and link.** Fail: build them in step 1 and start tracking from that date; earlier sales stay "untracked".
3. **Costs logged in full.** Fees alone undercount; product, shipping and commission count too. Fail: rebuild the cost log from payments and dispatch records before ranking.
4. **Delivered orders only.** In COD markets, count an order only when delivered and paid. Fail: mark India figures "provisional" until courier status is in.

## Steps

### 1. Set the naming rule

- **Code:** BRAND + HANDLE + offer, all caps, no spaces (for example STOREPRIYA10). One code per creator per offer.
- **Link:** store URL plus utm_source = platform (instagram, youtube, tiktok), utm_medium = creator, utm_campaign = round or month (2026-11-gifting), utm_content = handle.
- **Survey:** "Where did you hear about us?" with "A creator I follow" plus a free-text name.

### 2. Pull orders per creator

From the order export, filter by Discount Code; from GA4 or Shopify, take purchases by utm_content. Merge by order number so one order is not counted twice. Add survey answers that name a creator but used no code or link, marked "survey only".

### 3. Clean the orders

Remove cancelled orders, test orders and staff orders. Subtract refunds. For COD, keep only delivered and paid orders. Tag each order new or returning customer from the customer's first order date.

### 4. Cost each creator

Total cost = fee + usage fee + (units sent x landed cost) + shipping + commission paid + payment fees on commission (2.9% on Shopify Collabs automatic payouts [ORG-6422]) + any TDS cost the store bears.

### 5. Compute profit per creator

- Gross profit = sum over tracked orders of gross profit per order (by SKU), before creator cost.
- Creator profit = gross profit minus total creator cost.
- Profit ratio = gross profit / total creator cost.
- New-customer share = new-customer orders / all tracked orders.
- Sales per 1,000 views = net revenue / total views x 1,000. Rank creators on this, not views; it varied more than 100 times across top TikTok Shop videos [MCR-0046].

Read the ratio against first-order gross profit to acquisition cost bands: under 1 loses money, 1 to 2 hold, 2 to 3 scale, above 3 underspent [MEA-0032]. Here the "acquisition cost" is the creator cost.

### 6. Add what codes miss

Codes leak to coupon sites and many viewers buy later without a code. Two checks:

- **Survey share:** the share of survey answers naming creators should roughly match the share of spend going to creators; if creators get 20% of spend and 5% of answers, look harder [MEA-0045].
- **Halo:** small channels can look strong or weak in their own numbers because buyers convert elsewhere [MEA-0040]. Brands that sell mostly in retail or on marketplaces accept weak click tracking and price creators from views instead [ORG-0041]; a store that sells mainly on its own site should not.

Add survey-only orders to a separate column, not into the ratio.

### 7. Make the call per creator

Practitioner default rules; tune them with the owner:

| Call | Rule |
|---|---|
| Rebook | Profit ratio at or above 1 on tracked orders, labels used correctly |
| Rebook on content | Ratio 0.5 to 1, but their video beat other ads when run as an ad, or new-customer share above the store's average |
| Renegotiate | Ratio 0.5 to 1 with no content win: switch to commission or a lower fee |
| Drop | Ratio under 0.5 after two posts, or disclosure missing after a reminder |

Before rebooking on a big ratio, check whether those buyers came back: discount-led buyers often repeat less [CXP-0016]. Rerun at 90 days with `cohort-repeat-and-ltv-analysis`.

### 8. Monthly routine (30 minutes)

Export orders, refresh step 2 to 5, update the summary, list rebook and drop names, send it to the creator lead and the profit owner.

## Checks before you hand it over

- Every creator row has full cost, not just fees.
- No order is counted twice across code, link and survey.
- COD orders count only when delivered and paid; provisional figures are marked.
- Creators are ranked on profit ratio and sales per 1,000 views, not on views or revenue.
- Survey-only orders sit in their own column.
- Each rebook, renegotiate or drop call names the rule it met.
- No codes or links were created without the client's yes.

## Output

**One-screen summary:** total creator spend, tracked gross profit, overall profit ratio, survey share versus spend share, the top 5 to rebook, the names to renegotiate or drop, and one line on what the codes probably miss.

**Creator results sheet** (one row per creator per month):

| Column | Notes |
|---|---|
| Month, Creator, Handle, Platform, Deal type | |
| Code, UTM content | |
| Posts, Views | |
| Tracked orders (code + link, deduped) | delivered and paid only |
| New-customer orders, New-customer share | |
| Net revenue | after discounts and refunds |
| Gross profit before creator cost | by SKU |
| Fee, Usage fee, Product cost, Shipping, Commission, Commission fees, Tax cost, Total cost | |
| Creator profit, Profit ratio | |
| Sales per 1,000 views | |
| Survey-only orders | not in ratio |
| Call, Rule met, Next step | rebook / rebook on content / renegotiate / drop |

**Naming rule card:** the code and UTM format from step 1.

## Common mistakes

- **Ranking by revenue.** Step 5 ranks by gross profit over full cost.
- **Fees only.** Step 4 adds product, shipping, commission and fees.
- **Counting RTO orders.** Step 3 keeps only delivered, paid COD orders.
- **Double counting.** Step 2 merges code, link and survey by order number.
- **Trusting codes as the whole truth.** Step 6 checks survey share and halo before dropping anyone.
- **Rebooking discount-led winners blindly.** Step 7 checks repeat behaviour first.

## Sources

- MEA-0037: gross margin uses delivered cost with all fees.
- ORG-6422: Collabs commission fee and holding period.
- MCR-0046: rank on sales per 1,000 views.
- MEA-0032: first-order gross profit to acquisition cost bands.
- MEA-0045: survey shares should track spend shares.
- MEA-0040: small channels mislead in their own numbers.
- ORG-0041: retail-heavy brands price creators from views.
- CXP-0016: discount-led buyers repeat less.

What makes this skill ours: every creator is judged on gross profit against full cost, including product, shipping and commission fees; COD orders count only when delivered; codes, links and survey answers are merged without double counting, with survey-only sales kept apart; and the rebook call has written rules that also look at repeat behaviour.
