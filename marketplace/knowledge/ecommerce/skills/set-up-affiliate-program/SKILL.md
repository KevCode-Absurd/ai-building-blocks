---
name: set-up-affiliate-program
description: "An affiliate program ready to switch on: commission rate worked back from gross profit per order, cookie window and holding period matched to the buying cycle and return window, approval and removal rules, banned traffic sources (brand-term bidding, coupon sites), a disclosure rule for each market the store sells in, payout and tax steps, and a creative pack affiliates can post from. Covers Shopify Collabs, other affiliate apps and a free manual setup with codes and UTM links. Use when launching affiliates, when an existing program pays commission on sales the store would have got anyway, or when the owner asks what commission to offer."
---

# Affiliate program setup

**You get:** a program spec (commission, cookie window, holding period, approval and removal rules, banned sources, payout and tax steps), a settings list ready for the client to approve, a terms page draft, and a creative pack of 10 to 15 approved assets with captions and disclosure lines.

## When to use

- The store wants creators, bloggers and customers to sell for commission.
- An affiliate app is installed but rates, rules and terms were never thought through.
- Commission is going to coupon sites and people bidding on the store's name.
- The owner asks "what commission should we offer?"

## Not for

- Paid creator deals with fees and deliverables: use `write-influencer-outreach` and `influencer-contract-and-usage-rights`.
- TikTok Shop's built-in affiliate program: use `tiktok-shop-creator-affiliate-outreach`.
- Reading results per creator after launch: use `track-creator-sales`.
- Customer refer-a-friend rewards: use `design-loyalty-program`.

## What you need

Required:

1. **Gross profit per order** by product, after product, shipping, payment fees, returns and failed deliveries, from `build-sku-profit-sheet`.
2. **Shopify order export** for 6 to 12 months: Created at, Total, Discount Code, Lineitem sku, Refunded Amount, Customer Email (to find days between first visit and purchase where available, and return timing).
3. **Return window** and average days from order to refund.
4. **Time-bound customer value**: 90-day or 180-day gross profit per new customer, from `cohort-repeat-and-ltv-analysis`, if repeat purchase matters.
5. **Tool choice**: Shopify Collabs, another affiliate app, or the free manual route.

Optional: current affiliate list and results; brand assets.

Access: read (level 1) to model; draft (level 2) to set up the app, codes and terms page unpublished; publishing the terms page, approving affiliates and turning on payouts each need the client's yes.

## Before you start: the gates

1. **Profit per order known by product.** Fail: stop and run `build-sku-profit-sheet`. Commission is a cost on every order, and discounts, commission and ad spend come from the same acquisition pool [FIN-0015].
2. **Returns timing known.** The holding period must outlast the return window. Fail: use the return policy days plus 14 as a stop-gap.
3. **Brand search protected.** Brand-name negatives in non-brand campaigns and a rule against affiliates bidding on the brand exist [GAD-0028]. Fail: add the ban in step 5 and run `protect-brand-search-terms`.
4. **Disclosure rule ready.** Affiliates earn a reward, so they must say so; the store must train and check them [CXP-6303].

## Steps

### 1. Work out the commission ceiling

For each product group:

- Ceiling per order = gross profit per order (before commission) minus the profit the store needs to keep per order.
- Ceiling rate = ceiling per order / net revenue per order (after discounts, before tax).

If new customers buy again, you can pay more: target first-order gross profit or 90-day gross profit per customer at 2 to 3 times what you pay to acquire them [MEA-0020]. Use first-order profit unless cohort data shows repeat value.

### 2. Set the offered rate

- **Standard rate:** below the ceiling by enough to leave room for the buyer discount (if any) and the tool fee. On Shopify Collabs, each automatic commission payment carries a 2.9% processing fee [ORG-6422].
- **Top tier:** a higher rate for affiliates passing a sales line each month (practitioner default: two tiers, not five).
- **New customers only, or all orders?** If repeat buyers come through affiliate links anyway, paying on new-customer orders only (where the tool supports it) stops paying for sales you already had.
- **Buyer discount:** 10% or less unless the profit sheet carries more; buyers won on deep discounts often repeat less [CXP-0016].

### 3. Set cookie window and holding period

- **Cookie window:** match the buying cycle from the order data. Impulse products: 7 to 14 days. Considered purchases: 30 days. Practitioner default; test it.
- **Holding period:** return window plus return transit. On Shopify Collabs it can be 1 to 90 days (30 by default), and commission on cancelled or fully refunded orders inside that period is cancelled [ORG-6422]. Partial refunds need a manual check.

### 4. Approval rules

Approve when: real audience in your shipping markets, content fits the brand, past posts carry disclosures, and no coupon-site or deal-forum model. Auto-approve only customers with a past delivered order. Review 10% of posts each month.

### 5. Banned sources and removal

Write these into the terms:

- Bidding on the brand name or misspellings in search ads.
- Posting codes on coupon and deal sites, or browser extensions that inject codes at checkout.
- Paid ads from the affiliate's account using brand terms or the brand's creative without written approval.
- Claims outside the approved list; fake reviews or invented results [MCR-6045].
- Posts with no disclosure.

Removal: first breach, warning and fix within 48 hours; second, removal and unpaid commission on breaching orders forfeited.

### 6. Disclosure rule

Follow your market's ad disclosure rules. The common core everywhere: a clear label in the post itself, upfront, not only in a bio or behind "more".

- **US:** "I earn a commission if you buy through my link" or "Ad" in the post itself, under the FTC endorsement guides [ORG-6405].
- **UK:** "Ad" or "#ad" at the start, under the ASA and CAP code; "affiliate" alone is not enough.
- **EU, Canada, Australia and others:** the EU consumer rules, Ad Standards in Canada and Australia, and similar codes elsewhere ask for a plain label such as "Ad", "Advertising" or "Partnership" upfront, in the language your buyers use [ORG-6406].

Put the exact lines in the creative pack.

### 7. Build the creative pack

10 to 15 items: 5 product photos (white and in use), 3 short videos, 3 caption starters, the approved claims list, banned words, the disclosure lines for each market, and the code and link format. Being listed in third-party "best X for Y" roundups helps answer engines recommend the brand, so give bloggers a fact sheet with specs and prices [AEO-0029].

### 8. Choose the setup route

- **Shopify Collabs:** native app; links and codes, automatic payouts with the fee above.
- **Other affiliate apps:** compare monthly fee, payout methods for every country your affiliates live in (bank transfer, PayPal, local methods), currency support, tax form collection and fraud checks.
- **Free manual route:** a Shopify discount code per affiliate plus a UTM link (from `set-up-utm-tracking-for-all-channels`), a monthly order export filtered by code, and payouts by bank transfer after the holding period. Fine up to about 20 affiliates.

### 9. Payouts and tax

- **US:** collect a W-9; the store may need to issue Form 1099. On Collabs, a missing requested W-9 caps payouts at 599.99 dollars a year [ORG-6422]. Affiliates outside the US give a W-8BEN instead.
- **UK, EU and elsewhere:** pay to the affiliate's own account in their currency; affiliates registered for VAT may need to invoice the store with VAT, and some countries ask the store to withhold tax on commission. Ask the accountant once per country.
- **All markets:** count commission only on delivered, paid orders, never on orders that are refused, fail delivery or are refunded inside the holding period. Where the store offers pay on delivery, that means after the cash is collected.

## Checks before you hand it over

- The commission rate is below the ceiling for every product group, with the tool fee included.
- The holding period is at least the return window plus return transit.
- Orders earn commission only once delivered and paid (pay-on-delivery orders after the cash is collected).
- Brand bidding and coupon-site posting are banned in the terms.
- Disclosure lines exist for each market in the creative pack.
- Every asset in the pack has reuse rights and only approved claims.
- The settings list is unpublished and waiting for the client's yes.

## Output

**One-screen summary:** commission by tier, cookie window, holding period, buyer discount, profit kept per affiliate order, tool and monthly cost, and launch date once approved.

**Program spec table:** Product group, Net revenue per order, Gross profit before commission, Ceiling rate, Offered rate, Top-tier rate, Buyer discount, Profit kept per order.

**Settings list for approval:** numbered app or Shopify settings with the value for each.

**Terms page draft:** who can join, commission and tiers, cookie window, holding period, payout method and timing, banned sources, disclosure rule, removal, changes to terms.

**Creative pack index:** Asset, Type, Link, Caption starter, Claims used, Disclosure line, Usage note.

## Common mistakes

- **Copying a rate from another brand.** Step 1 sets the ceiling from the store's own profit.
- **Paying before returns land.** Step 3 holds commission past the return window.
- **Paying on orders that never arrive or never get paid.** Step 9 pays only on delivered, paid orders.
- **Coupon sites stealing credit.** Step 5 bans them; code sales are watched monthly.
- **Brand bidding by affiliates.** Gate 3 and step 5 stop it.
- **No disclosure line.** Step 6 gives affiliates the exact words.

## Sources

- FIN-0015: discounts, commission and ads share one acquisition pool.
- GAD-0028: keep brand terms protected from non-brand spend.
- CXP-6303: rewarded endorsers must disclose; the store trains and monitors.
- MEA-0020: set acquisition cost from time-bound gross profit.
- ORG-6422: Collabs holding period, refund cancellation, 2.9% fee, W-9 cap.
- CXP-0016: deep-discount buyers often repeat less.
- MCR-6045: fake reviews and testimonials are banned in the US.
- ORG-6405: FTC disclosure in the post itself.
- ORG-6406: upfront ad labels such as "Ad" or "Partnership" (one national ad code, used here as the common standard).
- AEO-0029: third-party roundups drive answer-engine recommendations.

What makes this skill ours: the commission is a ceiling worked back from each product group's own gross profit, not an industry rate; commission is held past the return window and paid only on orders that were delivered and paid; brand bidding and coupon-site leaks are banned in the terms from day one; and a free manual route works for small programs without a paid app.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Disclosure in India follows the ASCI code: a label such as "Ad" or "Partnership" upfront [ORG-6406]. Pay by bank transfer or UPI to the affiliate's own account, and ask the accountant about TDS on commission and GST invoices for registered affiliates. Count commission only on delivered, paid COD orders, never on orders that return to origin (RTO).
