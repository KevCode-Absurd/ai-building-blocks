---
name: launch-new-shopify-store-checklist
description: "A dated go-live checklist for a new Shopify store, worked through line by line until the first real order can be taken safely: domain and sender email, payments verified, tax and shipping set, policies live, tracking firing once, notifications checked, staff access locked, and at least five test orders that each prove a different path. Each line is pass, fail or not needed, with the proof attached and the owner who fixes a fail. Works for a store in any country: card and wallet checkouts, local payment methods, sales tax or VAT, and pay on delivery where it is used. Use in the last one to two weeks before a store removes its password page, or when a store that went live in a rush needs its basics proved."
---

# New Shopify store launch checklist

**You get:** one launch sheet of 32 numbered checks in 9 blocks, each marked pass, fail or not needed with its proof (screenshot, test order number or link), plus a test order log of at least 5 orders, a readiness score out of 100 with blockers listed first, and a go or no-go line for the client to sign.

## When to use

- A new store is built and the owner wants to remove the password page.
- A store went live in a hurry and has never taken a test order end to end.
- The store is moving from a single test market to taking real paid traffic.
- A new payment method, shipping app or tax setting was added the week before launch.

## Not for

- Auditing an already trading store's settings and product pages: use `store-settings-checklist-audit`.
- Writing the policy pages themselves: use `write-store-policy-pages`.
- Setting the shipping rates and promise from scratch: use `set-up-shipping-rates-and-delivery-promise`.
- Pixel and Conversions API depth: use `store-meta-capi` after launch.

## What you need

Required:

1. **Shopify admin access** at level 1 (read) to check, and level 2 (draft) to fix settings that are not live yet. Removing the password page is a live change: the client does it, or approves it in writing.
2. **The domain registrar login held by the owner.** The owner adds DNS records; never ask for the registrar password.
3. **Business facts:** legal business name and address, tax numbers for each market (for example EIN and state registrations in the US, VAT number in the UK or EU, ABN and goods and services tax registration in Australia, a federal and provincial sales tax number in Canada), support email and phone, return address.
4. **Cost per product** (landed) and **packed weight and box size per product**, from the supplier quote and a kitchen scale.
5. **A real card or local payment app of the owner's** for live test orders, used by the owner, never typed by the agent.

Optional: brand guide, Meta and Google ad accounts, existing email list. If a required input is missing, mark the lines that depend on it "blocked" and name who must supply it.

## Before you start: the gates

1. **Gross profit per order is known.** Pass when each product's price minus landed cost, shipping, payment fee and expected returns gives a positive number (`store-meta-math` or `build-sku-profit-sheet`) [MEA-0037]. Fail: do not launch paid traffic; the store can still open for organic and friends-and-family orders.
2. **Stock and dispatch are real.** Pass when units are on hand or a supplier date is in writing, and someone can pack orders on day one. Fail: set products to pre-order or keep the password on.
3. **Legal identity matches.** Pass when the legal name on the payment account matches government ID exactly; mismatches are the most common cause of stalled Shopify Payments verification [SET-0005]. Fail: fix the names before anything else.
4. **Tax status is decided.** Pass when an accountant has confirmed where the store must collect tax. Fail: hand off to `set-up-taxes-gst-and-us-sales-tax` and keep the password on.

## Steps

Work the blocks in this order; later blocks depend on earlier ones.

### Block 1. Account and access

Before Block 1, sweep the basics in Settings: store name, billing address, store currency and default weight and size units. Tax and shipping are built from these, so a wrong one is a blocker, not polish.

1. Turn on two-step login for the owner. Shopify Payments requires it [SET-0005]; turn it on for every staff account too.
2. Create staff accounts with only the permissions each person needs. Outside freelancers use collaborator accounts with the request code required [SEC-6202]. Full access review: `lock-down-store-staff-and-app-access`.
3. Record the store owner email and recovery codes in the owner's password manager, not in a shared document.

### Block 2. Domain and email

4. Connect the domain, set it as primary, and confirm the old myshopify address redirects to it. Check `https://` loads with no browser warning.
5. Set the sender email to an address on the store's domain and complete Shopify's sender domain authentication by adding the DNS records it shows. Unauthenticated sender addresses land in spam.
6. Check `robots.txt` and any CDN bot setting: AI crawlers should not be blocked by accident [SEC-0002].

### Block 3. Payments

7. Finish payment provider verification. Shopify Payments is not offered in every country, so check the Payments page; where it is missing, use a local gateway that takes the cards, wallets and bank payments your buyers use (for example iDEAL in the Netherlands, Klarna in much of Europe, or Afterpay in Australia) (see `set-up-payments-and-cod-rules`).
8. Turn on accelerated checkouts where available. Shop Pay is reported to raise mobile checkout-to-order rate 1.91x versus regular checkout [SET-0008] (Shopify's own figure; treat as a direction, not a forecast).
9. Decide on payment-risk rules: pay on delivery (used in some regions) on or off, order limits, fees or none, and fraud filters for card orders. Do not switch pay on delivery on by default without rules for failed deliveries and returns ready (`cut-rto-on-cod-orders`).
10. Confirm the payout bank account is in the owner's legal name. The agent never enters bank details.

### Block 4. Tax

11. Set tax collection only where the accountant confirmed registration [SET-0004]. US: home state first, other states only after registration. UK and EU: VAT on sales once registered, and the EU One Stop Shop for cross-border sales to EU buyers. Australia: goods and services tax once registered. Canada: federal sales tax, the harmonized tax in provinces that use it, and any provincial tax. If local law needs a tax invoice that Shopify does not make, add an invoice app [FIN-6205].
12. Choose whether prices include tax. UK, EU and Australian buyers expect tax-inclusive prices; US and Canadian buyers expect tax added at checkout.

### Block 5. Shipping

13. Create a saved package for each box with empty weight and size, and set real product weights; otherwise calculated rates undercharge every order [SET-0007].
14. Set zones and rates, a free-shipping line if the margin model supports it, and the delivery promise (`set-up-shipping-rates-and-delivery-promise`).
15. Confirm the courier covers every postcode or ZIP code range you sell to, including remote areas and islands that carry a surcharge.

### Block 6. Policies and legal pages

16. Refund, shipping, privacy, terms and contact pages live and linked in the footer and at checkout. Search each page for leftover template placeholders (brackets, "your return address", "[store name]"); any left is a blocker. Shopify's templates cover most pages, but the shipping policy is the owner's own words.
17. US: the shipping time stated must be one the store has a reasonable basis to meet; with no time stated, the default expectation is 30 days [CXP-6160].
18. Show the seller's legal name, address, contact details and return terms as your market requires (for example the EU and UK 14-day cancellation right and trader details). Have a lawyer confirm what applies.

### Block 7. Tracking

19. GA4 property created, data retention changed from 2 to 14 months on day one and internal traffic filter set [MEA-0003]. Full check: `set-up-ga4-for-store-and-check-data`.
20. Meta pixel and Conversions API connected through the official sales channel app. Confirm no test event code is left in a published tag [MEA-0005].
21. Each purchase fires once per platform. A double-fired purchase inflates every report from day one.

### Block 8. Notifications and post-purchase

22. Order confirmation, shipping confirmation, refund and cancellation emails: store name, logo, support contact and return address correct.
23. SMS or WhatsApp order updates only through an approved business provider, with template approval and opt-in as your market requires (`sms-and-whatsapp-compliance-setup`).

### Block 9. Test orders, then go

24. Run at least 5 test orders before removing the password [SET-0003]: one in test mode with a full card, one real low-value order paid and refunded by the owner, one to a far zone, one with a discount code, one on a phone. Add one order with each local payment method you offer, and one pay on delivery order if you use it. For each, check tax line, shipping rate, confirmation email, the order in admin, the purchase event in GA4 and Meta, and the refund flow.
25. Cancel and refund real test orders and mark them as tests so they do not pollute reports.
26. **Fulfil one test order end to end.** Mark it fulfilled with a tracking number and read the shipping email as a buyer would. The first real order must not be the first time anyone presses Fulfil.
27. **One real order per fulfilment location.** The built-in test order does not prove a warehouse or 3PL link works. For each location or warehouse app, place one real low-value order and confirm it reaches the warehouse, gets a tracking number and sends the shipping email. Add an order with a bundle or multi-item pack, since bundles of several SKUs are where warehouses most often pick wrong. Skip this only when the store ships from one place with no warehouse app.
28. **Every product is sellable.** Each product has a title, description, price, at least one image and stock above zero in the location that ships it; a custom product section must have its product picked in the section settings, or the page shows sold out. Open 3 product pages in a private window to see what a stranger sees.
29. **First visit, as a stranger, on a phone.** Click through the menu from the home page: logo, favicon, store name, footer links and contact details are right, nothing says "Powered by Shopify" unless the client wants it, and no demo text or sample product remains.
30. **Search Console verified** for the primary domain and the sitemap submitted, alongside GA4, so day-one search data is not lost.
31. **Cross-border duties stated.** If the store ships abroad and does not charge duties at checkout, the shipping policy and the product or cart page say that duties and import taxes may be due on delivery. Test mode proves the checkout flow, not that tax registrations are right; that stays with the accountant.
32. Fill the go or no-go line. Any fail in blocks 3, 4, 5 or 9 is a no-go. The client removes the password page last, only after every line above passes.

**Score the readiness** (our own scale): start at 100, take off 15 for each blocker (anything that stops the store taking money, shipping an order or showing the policies it needs) and 5 for each warning (wrong but does not stop a sale), and stop at 0. Show the sum. A line not tested takes nothing off but is listed as not tested. Any blocker means no-go, whatever the score.

## Checks before you hand it over

- Every line is pass, fail, blocked or not needed; no blanks.
- Each pass has proof: screenshot, test order number or URL.
- At least 5 test orders logged, covering card, a far zone, a discount and mobile; plus each local payment method and pay on delivery if offered.
- Purchase fires once in GA4 and once in Meta for the same test order.
- The legal name matches on payment account, policies and invoices.
- Shipping charged on the test orders matches the courier's quote within a small margin.
- No password, card number or bank detail appears anywhere in the sheet.
- The go or no-go line names who approved and when.
- One order has been fulfilled end to end, and each fulfilment location has had one real order reach it with tracking.
- No policy page holds a template placeholder.
- The readiness score shows its sum, with blockers listed before warnings and untested lines named.

## Output

**One-screen summary:** go or no-go, count of pass, fail and blocked lines, the top 3 fails with owner and date, and the test orders still to run.

**Launch sheet** (Google Sheet or CSV), one row per line:

| # | Block | Check | Standard | Result (pass, fail, blocked, n/a) | Proof | Owner | Fix by | Card |
|---|---|---|---|---|---|---|---|---|

**Test order log:**

| Order no. | Path (card, wallet, local method, pay on delivery, discount, mobile, far zone) | Total | Tax shown | Shipping charged | Email received | GA4 purchase | Meta purchase | Refunded | Notes |
|---|---|---|---|---|---|---|---|---|---|

**Go line:** "Store cleared to remove password on [date]. Approved by [client name]. Open items: [list]."

## Common mistakes

- **Launching before payments verify.** Payouts freeze and orders pile up. Block 3 and gate 3 come first.
- **No package weights.** Calculated shipping looks fine in testing but undercharges every real order [SET-0007]. Step 13.
- **One test order.** A single card order misses local payment methods, tax by region and mobile. Step 24 asks for five paths.
- **Test orders left in the data.** They inflate early conversion and revenue. Step 25.
- **Double purchase events.** A theme snippet plus an app both fire. Step 21 checks one test order on both platforms.
- **Pay on delivery on by default.** Fake and refused orders start on day one. Step 9 waits for failed-delivery and return rules.
- **Trusting the built-in test order for the warehouse.** Step 27 sends one real order to each fulfilment location.
- **A product page that says sold out on day one.** Step 28 checks stock in the shipping location and the section's product setting.

## Sources

- SET-0003: run test-mode orders across addresses and phone before removing the password.
- SET-0004: tax where you have presence; tax-inclusive pricing where expected.
- SET-0005: Payments verification stalls on name mismatches; two-step login required.
- SET-0007: saved package weights or shipping is undercharged.
- SET-0008: Shop Pay mobile checkout-to-order figure.
- SEC-0002: check robots.txt and CDN settings for accidental AI crawler blocks.
- SEC-6202: collaborator request code and least permissions.
- MEA-0003: GA4 retention and internal traffic filter on day one.
- MEA-0005: test event code left in a published tag.
- MEA-0037: gross margin uses delivered cost.
- FIN-6205: Shopify tax settings and missing tax invoices where local law needs them.
- CXP-6160: US shipping time needs a reasonable basis; 30-day default.

What makes this skill ours: the order of blocks follows what breaks if done out of order; every pass needs proof, not a tick; the test order log covers every payment path the store offers, not just one card checkout; and launch is blocked until gross profit per order is positive.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Shopify Payments may not be offered; most India stores use a local gateway that takes UPI, cards, net banking and wallets. Do not switch COD on by default without RTO rules ready. Tax: CGST and SGST for home state, IGST elsewhere, HSN codes on products, and a GST invoice app, since Shopify does not make GST-compliant invoices [FIN-6205]. Buyers expect tax-inclusive prices. Confirm pincode serviceability for prepaid and COD with the courier or aggregator. Show the seller's legal name, address, grievance contact and return terms. WhatsApp updates only through an approved provider with template approval and opt-in. Test orders add one COD and one UPI order.
