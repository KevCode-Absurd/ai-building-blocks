---
name: tiktok-shop-gmv-max-ads
description: "A GMV Max set-up for a store's TikTok Shop products: a profit check per product that counts TikTok Shop fees, affiliate and ads commissions, shipping and returns to give each product's break-even ROI, the products to include and leave out, an ROI target set at or above break-even, a daily budget, rules for affiliate and own videos, and a weekly read of GMV Max results against Seller Center settlements and orders the shop would have made anyway. Use when the store sells on TikTok Shop and wants to run Shop ads, when GMV Max spends but profit is unclear, or before a Shop sale day."
---

# TikTok Shop GMV Max ads

**You get:** a GMV Max plan: a product profit table with break-even ROI per product, the product list for the campaign, ROI target and daily budget, creative and affiliate rules, the drafted campaign settings, and a weekly profit read sheet, ready for the owner's yes.

## When to use

- The store sells on TikTok Shop and wants to start Shop ads.
- GMV Max is running and shows a good ROI, but the shop's settlements do not show profit.
- Affiliates post many videos and the store wants paid reach behind the best ones.
- A Shop campaign day or sale is coming and budgets may jump.

## Not for

- Opening TikTok Shop, products and shipping: use `launch-tiktok-shop`.
- Recruiting affiliates and setting commissions: use `tiktok-shop-creator-affiliate-outreach`.
- Listing titles, images and prices: use `optimize-tiktok-shop-listings`.
- Ads that send buyers to the store's own website: use `launch-tiktok-ads-first-campaign`.

## What you need

Required:

1. **Seller Center order and settlement reports**, last 30 to 90 days: order ID, product, price, discounts (seller and platform funded), referral fee, affiliate commission, ads commission, shipping fee, refunds, net settlement.
2. **Landed cost per product** and packaging cost.
3. **Stock** per product on TikTok Shop and the reorder lead time.
4. **Affiliate list**: commission rates (standard and for Shop ads), number of videos per product.
5. **TikTok Ads Manager access** linked to the shop, with GMV Max authorised for that shop.

Optional: past GMV Max reports, organic Shop sales by product before any ads, LIVE schedule.

Access: the owner authorises the ad account for the shop and adds payment; the agent never handles logins or card numbers. Drafting the campaign is level 2. Turning it on, raising budget, changing commissions or joining a platform campaign day needs the owner's yes.

## Before you start: the gates

1. **Profit per product is known** from the settlement report, not from the list price. Product margin is not gross margin once fees, shipping and allowances are taken out [MEA-0023] [MEA-0037]. Fail: build the table in step 1 first.
2. **The shop is eligible.** GMV Max and TikTok Shop are open only in some countries and TikTok is blocked in India. Fail: no Shop ads; use the store's website channels.
3. **Videos exist.** GMV Max runs on the shop's own and affiliate videos that tag the product. Fail: fewer than about 5 usable videos per product means seed or brief creators first (`tiktok-shop-creator-affiliate-outreach`).
4. **Stock covers a spike.** Fail: leave out any product with less stock than its lead time [ADC-0023].
5. **Claims are allowed.** Health, beauty and supplement claims in affiliate videos follow TikTok Shop rules and advertising law. Fail: exclude that video.

## Steps

### 1. Build the product profit table

Per product, per order, from settlements:

Gross profit before ads = price paid - seller-funded discount - referral fee - affiliate commission (on affiliate orders) - ads commission (when an affiliate video is used in ads) - seller-paid shipping - landed cost - packaging - refund and return allowance.

Break-even ROI = GMV per order / gross profit before ads. Recompute it at every discount depth used on sale days; required return rises steeply as discounts eat margin [OFF-0069].

### 2. Pick the products

Start with the top 20% of products by past orders, in one campaign; a product can sit in only one GMV Max campaign [ADC-0062]. Leave out products with break-even ROI the campaign cannot reach, low stock, or fewer than 5 usable videos. Group products with similar break-even ROI together, so one ROI target fits them all; put very different products in separate campaigns.

### 3. Set the ROI target

TikTok suggests a target. One practitioner found that suggestion often below break-even and added one full point (1.2 becomes 2.2), lowering it only if delivery did not start within a few days [ADC-0062]. Our rule:

- Target ROI = the higher of TikTok's suggestion and the group's break-even ROI from step 1, plus a margin for profit the owner wants.
- If delivery does not start in 3 days, lower the target in small steps, never below break-even.
- A target set far too high simply stops delivery.

### 4. Set the budget

Daily budget near two times the target cost per order from the profit table [ADC-0062], inside the owner's monthly cap. Switch off automatic budget boosts on promotion days unless the owner has approved a separate sale-day cap; they can raise spend many times over [ADC-0062]. Creative boosts for single videos spend on top of the budget; count them in the cap.

### 5. Set creative and affiliate rules

- Leave automatic video selection on so new affiliate videos are tested as they arrive; pause any video with claims that fail gate 5.
- Rank videos on revenue per 1,000 views, not view count; across seven top Shop videos it varied more than 100 times [MCR-0046].
- Reaction videos suit products felt within seconds (taste, cooling, smell), but drew big views at low sales per view in one case [MCR-0045].
- Ads commission for affiliates is usually set below standard commission, since the store pays for the reach; agree it in `tiktok-shop-creator-affiliate-outreach`.
- To build video supply, one brand paid new creators a monthly floor or 15 to 20% commission, whichever was higher, for a video a day [ORG-0036]; seeding at scale can return close to one video per creator onboarded [ORG-0009]. Check margins can carry it.
- AI-made videos are labelled per TikTok's rules and never pose as real buyers [MCR-6021].

### 6. Draft the campaign

Settings table: shop, products, ROI target, daily budget, promotion-day boost (off or capped), automatic video selection (on), excluded videos, start date. Send for approval.

### 7. Read it weekly on profit

GMV Max reports GMV against ad cost. Check what the report counts for the selected products, then read:

- Ad cost, GMV, and orders from the GMV Max report.
- Net settlement for the same products and dates from Seller Center.
- Contribution after ads = settlement - landed cost - packaging - ad cost.
- Orders the products sold in the 4 weeks before ads started, as a rough baseline. Shop ads also pick up buyers who would have bought anyway; growth above the baseline is the better test.

Rules: raise the target ROI when contribution after ads is negative for two weeks; raise budget by about 20 to 30% when contribution is positive and stock allows (practitioner default, test it); remove a product when it stays under break-even after two target changes.

### 8. Sale days

Model each sale-day discount in step 1 before joining. Set a sale-day cap and target, approved in advance. After the sale, return targets and budget to normal and read the sale on settlements 14 days later, when returns have come in.

## Checks before you hand it over

- Every product has gross profit and break-even ROI from settlement data.
- Commissions (standard and ads) are in the profit maths.
- Every ROI target is at or above its group's break-even.
- Each product is in only one GMV Max campaign.
- Promotion-day boosts are off or capped with approval.
- Low-stock products are excluded.
- The weekly read uses Seller Center settlements, not only GMV.
- Nothing went live without the owner's yes.

## Output

**One-screen summary:** products in the campaign, ROI target and its break-even, daily budget and monthly cap, expected weekly contribution range, and the one risk.

**Product profit table** (`gmv-max-products.csv`): Product, Price, Average discount, Referral fee, Affiliate commission, Ads commission, Shipping, Landed cost, Packaging, Return allowance, Gross profit before ads, Break-even ROI, Stock days, Videos available, In campaign (yes or no, reason).

**Campaign settings:** Campaign, Products, ROI target, Daily budget, Boost setting, Video selection, Excluded videos, Start.

**Weekly read** (`gmv-max-weekly.csv`): Week, Ad cost, GMV, Orders, Net settlement, Landed cost, Contribution after ads, Baseline orders, Action.

## Common mistakes

- **Accepting TikTok's suggested ROI.** Step 3 starts from break-even.
- **Leaving out commissions.** Step 1 counts affiliate and ads commission.
- **Promotion-day boost left on.** Step 4 switches it off or caps it.
- **Judging videos by views.** Step 5 ranks on revenue per 1,000 views.
- **Reading GMV, not settlements.** Step 7 uses Seller Center payouts.
- **Pushing products that will sell out.** Gate 4 excludes them.

## Sources

- ADC-0023: pause products with less stock than lead time.
- ADC-0062: GMV Max ROI target, product grouping, budget and boost.
- MCR-0045: reaction videos for instant-sensation products.
- MCR-0046: rank Shop videos on revenue per 1,000 views.
- MCR-6021: no fake testimonials, including AI.
- MEA-0023, MEA-0037: true gross margin from delivered costs.
- OFF-0069: break-even rises steeply with discount depth.
- ORG-0009: seeding creators at scale for Shop videos.
- ORG-0036: a starter deal for Shop affiliates.

What makes this skill ours: each product's break-even ROI is built from Seller Center settlements including affiliate and ads commissions; the ROI target can never go below that line, whatever TikTok suggests; promotion-day boosts need their own approved cap; and the weekly read is contribution after ads on settlements against a pre-ads baseline, not GMV.
