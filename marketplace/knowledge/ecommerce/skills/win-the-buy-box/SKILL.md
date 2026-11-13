---
name: win-the-buy-box
description: "A diagnosis of why a product is losing Amazon's Featured Offer (the Buy Box), checked factor by factor against Amazon's own list (total price with shipping, delivery speed, free shipping and returns, seller performance, stock), and the price, stock and account fixes to win it back, each with a profit floor so no fix sells at a loss. Separates a pricing problem from another seller on the listing, from a stockout and from account health, and handles unauthorised sellers and counterfeits through allowed routes only. Use when the Featured Offer percentage drops, when ads stop serving, when another seller appears on the brand's listing, or when the price shows only under 'See all buying options'."
---

# Win and keep the Buy Box

**You get:** a one-page diagnosis per affected ASIN naming what is losing the Featured Offer, the fix for each cause with its owner and date, a price floor and repricing rule the client can set in Seller Central, and a weekly watch list so the problem is caught in days, not weeks.

## When to use

- The Featured Offer (Buy Box) percentage in Business Reports drops.
- Sponsored Products ads stop serving or show as ineligible.
- The product page shows "See all buying options" instead of Add to Cart.
- Another seller appears on the brand's own listing.
- The client asks whether to cut price to win it back.

## Not for

- Fixing account metrics in depth and writing appeals: use `amazon-account-health-fix`.
- Brand Registry, trademark and protection set-up: use `set-up-brand-registry-and-store`.
- Restocking FBA so the offer stays in stock: use `plan-fba-inventory`.
- Setting the store's own prices and offers: use `offer-bundle-threshold-design`.

## What you need

Required:

1. **Business Reports**, Detail Page Sales and Traffic by Child Item, last 60 days: the Featured Offer percentage per ASIN by week.
2. **Pricing Health page** and any pricing alerts in Seller Central.
3. **Offer list for each ASIN**: every seller on the listing with price, shipping charge, delivery promise and fulfilment method (from the "Other sellers" panel, viewed from a few delivery addresses).
4. **Account Health dashboard** and Voice of the Customer page.
5. **Stock**: FBA inventory and inbound, and seller-fulfilled stock if any.
6. **Price floor inputs**: gross profit per unit from `build-sku-profit-sheet`.

Optional: the brand's prices on its own site and other marketplaces, distribution agreements with resellers, test-buy photos.

Reading is level 1. Changing price, shipping settings or repricing rules needs draft access (level 2) and the client's yes; level 3 only within a price range the client sets. Reports of IP violations go out only with the client's fresh yes.

## Before you start: the gates

1. **Price floor known.** Floor = landed cost + referral fee + fulfilment fee + storage + returns allowance + the minimum profit the client accepts [MEA-0037]. Fail: compute it first; never cut price without it.
2. **Know whose listing it is.** The brand's own product with resellers, or a shared product many sellers stock. The fixes differ.
3. **Policy risk.** No report of a seller as counterfeit without evidence, and no price change outside the client's range.

## Steps

1. **Read the trend.** Chart the Featured Offer percentage weekly for 8 weeks. Mark the week it dropped and what changed that week: price, stock, a new seller, a shipping template edit, an account warning.
2. **Check the factors in Amazon's order.** Amazon ranks offers on combined item and shipping price, delivery speed, free shipping, free returns, seller performance (order volume, chargebacks, Voice of the Customer complaints) and stock; reviews, star rating, the Prime badge and the fulfilment method are not factors [AMZ-6442]. Being considered never guarantees being featured. From July 2026 Amazon is removing the separate eligibility requirement, so a lost Featured Offer now points to one of these factors, not to a missing badge [AMZ-6442].
3. **Stock.** An offer with no stock cannot be featured. If stock ran out or is stranded, fix it first (`plan-fba-inventory`); no price change helps.
4. **Price health.** Open Pricing Health, which Amazon names as the place to find pricing issues that can make an offer ineligible [AMZ-6442]. If it flags the price as high against recent prices or the same item elsewhere, the offer can lose the Featured Offer even with no rival. Compare the brand's own site and other marketplaces: a lower price elsewhere is a common cause. Fix by aligning the prices the brand controls, not by dropping below the floor.
5. **Rival offers on the listing.** Compare total price (item plus shipping) and delivery promise for each. Then:
   - **Rival is cheaper and above your floor:** match within the floor using a repricing rule (Automate Pricing in Seller Central is free) with the floor as minimum.
   - **Rival is below your floor:** do not follow. A price race below profit loses money on every order and resets the price buyers expect. Win on delivery speed and free returns, or accept a lower share for now.
   - **Rival is faster:** move the ASIN to FBA or a faster shipping template, if the extra fee keeps profit above the floor.
6. **Unauthorised sellers on the brand's listing.** Make a test buy. If the unit is fake or materially different, report it through Brand Registry's Report a Violation with photos and the order number. If it is genuine stock resold, Amazon will not remove it on trademark grounds alone; trace the leak (which distributor or wholesale buyer) and fix it with the distribution agreement. Never file a false IP complaint: it risks the brand's own account.
7. **Commingling.** If the brand sends FBA stock with manufacturer barcodes, its units can mix with other sellers' units of the same item. Use Amazon's own FNSKU labels so a counterfeit sold from the pool is not shipped under the brand's name (practitioner default, check the account's barcode setting).
8. **Seller performance.** Read the order defect rate (under 1%), and for seller-fulfilled orders the late shipment rate (under 4%), cancel rate (under 2.5%) and valid tracking rate (over 95%) [AMZ-6444] [AMZ-6443]. Any metric over its line goes to `amazon-account-health-fix`. Read Voice of the Customer complaints for the ASIN: a pattern ("arrived broken", "not as described") is a listing or packaging fix.
9. **Shipping and returns settings.** Check the shipping template for the delivery promise and any shipping charge, and whether the category allows free returns on this offer. A charge that pushes the total above a rival's can lose the box even when the item price is lower.
10. **Do not test prices on buyers.** Change price as a rule-based response, not as an A/B test of two prices for the same product; that once ended in refunds to thousands of Amazon buyers [CRO-0009].
11. **India notes (Amazon.in).** The same factors apply. Many sellers list the same branded item; buyers compare the delivered price, so check the delivery charge and delivery date shown for a few pincodes. Cash-on-delivery availability affects choice but is not a listed Featured Offer factor. Keep MRP on the listing correct.
12. **US notes (Amazon.com).** A seller-fulfilled offer must ship within the time it promises; set handling time honestly rather than shortening it to look faster [CXP-6160].
13. **Set the watch.** Weekly: Featured Offer percentage per ASIN, Pricing Health alerts, offers on each listing, stock cover. Alert the client if any ASIN falls 10 points in a week (practitioner default).

## Checks before you hand it over

- Every cause named is tied to evidence: a report line, a screenshot or an order.
- The price floor is shown with its inputs, and no recommended price is below it.
- Stock and Pricing Health were checked before any price change.
- Any counterfeit report has a test buy behind it; genuine resale is not reported as counterfeit.
- Account metrics are compared with Amazon's stated lines.
- Repricing rules have a floor and a ceiling set by the client.
- No change made without the client's yes.

## Output

**One-screen summary:** ASINs affected, Featured Offer percentage before and now, the main cause for each, the fix, expected date, and anything needing the client's decision.

**Diagnosis table:** ASIN | Featured Offer % (8 weeks) | Week of drop | Stock | Pricing Health flag | Lowest rival total price | Our total price | Delivery promise ours vs rival | Account metric over line | Cause | Fix | Owner | Date.

**Repricing rule card:** ASIN | Floor | Ceiling | Rule (match Featured Offer, stay above floor) | Approved by.

**Unauthorised seller log:** Seller name | ASIN | Test buy order and date | Genuine or not | Route taken (Report a Violation, distributor fix) | Status.

## Common mistakes

- **Cutting price first.** Steps 3 and 4 check stock and Pricing Health before price.
- **Believing reviews or Prime win the box.** Amazon says they do not count [AMZ-6442].
- **Following a rival below cost.** Step 5 keeps every price above the floor.
- **Reporting resellers as counterfeit.** Step 6 needs a test buy and treats genuine resale as a supply-chain fix.
- **Ignoring the price on the brand's own site.** Step 4 compares every channel the brand controls.
- **Shorter handling time to look faster.** Step 12 keeps promises the warehouse can meet.

## Sources

- AMZ-6442: Featured Offer factors and the July 2026 eligibility change.
- AMZ-6443: seller-fulfilled shipping metric targets.
- AMZ-6444: order defect rate under 1% and policy consequences.
- MEA-0037: price floor must include marketplace fees and delivery.
- CRO-0009: never test two prices for the same product.
- CXP-6160: US mail order rule on shipping promises.

What makes this skill ours: it uses Amazon's own factor list, which says reviews and Prime do not count, instead of the common "lowest price wins" belief; every price move sits above a profit floor; it checks the brand's own prices elsewhere as a cause; and it treats genuine resellers as a supply-chain leak, not an IP case.
