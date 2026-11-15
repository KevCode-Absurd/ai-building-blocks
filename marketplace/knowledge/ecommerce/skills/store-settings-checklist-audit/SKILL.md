---
name: store-settings-checklist-audit
description: "A fast pass/fail audit of a Shopify store's settings and product pages: checkout and payment options, shipping and returns visibility, tax and currency, speed, post-purchase messages, and product page images, copy and proof. Reads settings through the Shopify Admin API with read-only scopes where the owner connects it, or from admin screenshots where they do not. Covers card and wallet checkouts plus each market's local payment methods, postcode delivery checks, failed delivery controls and VAT or sales tax invoices. Each fail comes with the fix, who can make it, and the gross profit it protects. Use on a new store before launch, after a theme or app change, or as the first hour of any conversion audit."
---

# Store settings and product page checklist

**You get:** a pass or fail checklist of the Shopify store's settings and product pages, the five fixes to make first, a numbered change list for approval and a CSV to re-run after changes.

A one-sitting audit that turns "the store feels off" into a list of pass and fail lines with fixes. It finds the quick wins; `storefront-conversion-audit` sizes the bigger ones.

## When to use

- A new store is about to remove its password page.
- After a theme switch, a new app, or a change to payments, shipping or tax.
- First hour of a conversion audit, to clear obvious breaks before reading the funnel.
- The store starts selling in a new country for the first time.

## Not for

- Sizing conversion leaks with funnel numbers: use `storefront-conversion-audit`.
- Designing offers, bundles or the free-shipping threshold: use `offer-bundle-threshold-design`.
- Building a new theme section to fix a fail: use `shopify-theme-section-builder`.
- Pixel and Conversions API set-up: use `store-meta-capi`.

## What you need

Required:

1. **Live store URL** and the three best-selling product pages.
2. **Settings, one of two ways:**
   - **API path (preferred):** the owner creates a custom app in Shopify admin (Settings, Apps and sales channels, Develop apps) with read scopes only: `read_products`, `read_shipping`, `read_legal_policies`, `read_themes`, `read_orders`. The owner installs it and keeps the access token. The agent reads through an official Shopify connector or MCP server, or the owner runs the read script on their own machine with the token in an environment variable. Never ask for the token in chat.
   - **Manual path:** admin screenshots of Settings > Payments, Checkout, Shipping and delivery, Taxes and duties, Markets, Policies, Notifications, and the Apps list.
3. **Average order value and gross profit per order** from `store-meta-math`, or the inputs to work them out.

Optional: last 30 days of orders by payment method (to see which local methods buyers use), support ticket tags, and PageSpeed Insights for the home and top product page.

Everything here is read access (level 1). Fixing a fail needs draft or publish access and a client yes for each change. If an input is missing, ask once; otherwise mark those lines "not checked".

## Before you start: the gates

1. **Gross profit per order.** Needed only to rank fails. Pass when it exists. Fail: run the checklist anyway but sort fails by severity, not money, and say so.
2. **Cash and capacity.** Ask who can change settings (owner, developer, agency) and how many hours this month. Settings fixes are cheap; theme fixes are not.
3. **Market.** Name the markets the store sells to. Payment, tax and delivery checks differ by country; run the local checks in step 8 for each one.
4. **Test orders allowed.** Before any change goes live, the store will run test-mode orders [SET-0003]. If the client will not allow test orders, mark checkout changes "client to verify".

## Steps

### 1. Pull the settings

API path: read the shop record (currency, ships-to countries, tax-inclusive pricing, policies), delivery profiles and zones, the installed theme and its app embeds, and product data for the top three products (images, alt text, description length, variants, metafields). Manual path: read the screenshots in the same order. Record each value in the checklist as found, with the date.

### 2. Checkout and payments

- Shop Pay on where Shopify Payments is available; its mobile checkout-to-order rate runs well above regular checkout [SET-0008]. Fail if off.
- Express wallets (Apple Pay, Google Pay, PayPal) on for card markets and shown at the top of checkout. Practitioner default, test it.
- Guest checkout allowed; an account is never required to buy.
- Tipping off unless the store sells food or a service; gift cards set to fulfil automatically.
- Buy now, pay later shown on the product page where order values run above about 100 (practitioner default, test it).
- Shopify Payments verification complete, names matching ID, two-step sign-in on [SET-0005].
- 3D Secure left to Shopify's risk rules; AVS off unless the risk reports show card fraud [SEC-0003] [SEC-0005].
- Percentage discounts cannot cap the amount saved; high order value stores need fixed-amount tiers or an app [SET-0001].
- Cart shows no discount code box when no public promotion runs [LPG-0058].

### 3. Shipping and returns visibility

- Every box has its empty weight and size saved and assigned, or calculated rates undercharge [SET-0007].
- Shipping, tax and fees added at checkout stay under about 10% of order value [LPG-0063].
- A specific delivery date shows on the product page and in cart, padded so the store beats it at least 9 times in 10 [CXP-0010].
- Return window, who pays return postage, and refund timing appear on the product page within one tap, not only in the footer. Practitioner default, test it.
- A free-shipping threshold, if any, shows near the price, in a site banner and in the cart with the amount left to reach it.

### 4. Tax and currency

- Tax collected where the store has presence; shipping taxability and duties set per market [SET-0004].
- Without Shopify Payments, converter apps show local prices only up to the cart; checkout charges the base currency [SET-0002]. Fail if shoppers see one price and pay another.

### 5. Speed

- Core Web Vitals for home and top product page on mobile, against Google's "good" lines: Largest Contentful Paint 2.5 seconds or less, Interaction to Next Paint 200 ms or less, Cumulative Layout Shift 0.1 or less. Ignore old single "speed scores". Lab results change at once; field data takes about 28 days to move [SPD-0005].
- Hero image loads eagerly with high priority, never lazy or faded in [SPD-0006].
- Images under about 200 KB for heroes and 100 KB for product shots [SPD-0002].
- No leftover script tags from removed apps; search the theme for each removed app's name [SPD-0009].
- Count third-party services. Stores with 0 to 5 scored a median 74 on mobile; stores with 21 to 30 scored 44 [SPD-0001].

### 6. Post-purchase

- Order confirmation, shipping and delivery notifications are on and branded.
- Tracking page carries the brand and three proactive updates go out; that cut "where is my order" tickets 40 to 60% in reported cases [CXP-0014].
- Where-is-my-order contacts under 3% of orders is healthy; above 8% is structural [CXP-0012].
- Thank-you page carries one relevant add-on or cross-sell, a two-question survey ("what made you buy today, what almost stopped you") [CRO-0018], and the referral link if a programme exists.
- Meta pixel, Google tag and UTM tagging are present; hand any doubt to `store-meta-capi`.

### 7. Product page: images, copy, proof

For each of the three top products, on a phone:

- First screen holds image thumbnails, rating above the title, price, add to cart and a risk reducer [LPG-0034].
- Two kinds of proof above the fold; risk reducers directly under the button [LPG-0038].
- Reviews show a name and source; bare press logos read as fake [LPG-0037]. Fewer than about 80 reviews is the biggest proof gap [LPG-0062].
- **Images:** real in-use photos and several angles, not supplier sheet shots; at least one video (demo, customer clip or founder); the gallery works as a mini landing page with benefit, proof and guarantee images, since more shoppers swipe the gallery than scroll the page [LPG-0060].
- **Copy:** a headline that says what the product does for the buyer; short scannable lines above the fold; the problem it solves explained before specs; the top three objections from reviews and tickets answered; ingredients, materials or sourcing explained, not just listed; size chart and care or use notes where the category needs them.
- **Buying:** add to cart above the fold, high contrast, at least 44 px tall; a sticky add-to-cart bar after scrolling; subscription shown beside one-time purchase where offered.
- **Proof:** reviews loaded on the page, not hidden in a tab, with customer photos; proof at more than one point down the page. Only real numbers: no "N added to cart today" counters without a live source.
- **Shipping and returns** sit next to add to cart, not in a footer tab.

### 8. Local market checks (for each country the store sells to)

Practitioner defaults, test them; no public card covers these numbers.

- **Local payment methods** buyers in that country expect are offered through the store's gateway: for example iDEAL in the Netherlands, Bancontact in Belgium, Klarna or invoice payment in Germany and the Nordics, Pix in Brazil, bank transfer apps where they lead. The most used local method is near the top on mobile.
- **Pay on delivery**, where it is offered, shows any fee or any saving for paying upfront before checkout.
- **Postcode or ZIP check** on the product page shows the delivery date before add to cart, where delivery times differ a lot by area.
- **Phone number** is asked for at checkout where couriers need it for delivery.
- **Order confirmation** for risky orders (pay on delivery, first orders, high value) by message or call before dispatch, with a cancel option, to cut failed deliveries.
- **Tax invoice** carries what the market needs: a VAT invoice with the store's VAT number for UK and EU buyers, the right sales tax lines for US states, goods and services tax lines in Australia.
- **Failed delivery rate** is tracked by payment method; pass the number to `store-meta-math`.

### 9. Price each fail

For each fail, write the fix, the owner, the hours, and the gross profit it protects or adds a month where you can estimate it: orders affected x gross profit per order x the share you expect to recover. Where you cannot estimate, say "severity: high, medium or low" and why. A broken checkout step is always high.

### 10. Hand over the change list

Group fixes into: settings changes (minutes, owner can do), app or theme changes (developer), and content changes (copywriter). Every change waits for a client yes. After any checkout, tax or shipping change, run test-mode orders to several addresses and on a phone before going live [SET-0003].

## Checks before you hand it over

- Every line is pass, fail or "not checked", with the value found and its date.
- Each fail has a fix, an owner and either a gross profit figure or a stated severity.
- The local checks in step 8 are present for each country the store sells to.
- No line asks for or repeats a password, API key or token.
- Speed results say lab or field, and which page.
- No change was made live without a client yes; test orders are listed after checkout changes.
- The top five fixes fit the stated hours.

## Output

1. **One-screen summary:** count of passes and fails by area, the five fixes to make first, and the gross profit they protect.
2. **Checklist table:** Area, Check, Found (value and date), Pass or fail, Fix, Owner, Hours, Gross profit a month or severity, Card.
3. **Change list for approval:** numbered, each small enough for a yes or no.
4. **File:** `store-settings-checklist.csv`, so the client can re-run it after changes.

## Common mistakes

- **Checking on desktop only.** Most shoppers are on phones. Step 7 runs on a phone.
- **Reading lab speed as proof of a fix.** Field data lags about four weeks [SPD-0005].
- **Missing leftover app code.** Uninstalling an app does not remove its scripts [SPD-0009].
- **Treating pay on delivery as just a payment option.** It drives failed deliveries; the checklist ties it to confirmation and to the money lines.
- **Asking for the API token.** The owner installs the app and keeps the token; the agent reads through a connector.
- **Changing checkout without test orders.** Step 10 requires them.

## Sources

- SET-0001, SET-0002, SET-0004, SET-0005, SET-0007, SET-0008: Shopify discounts, currency, tax, Payments, packages, Shop Pay.
- SET-0003: test-mode orders before going live.
- SEC-0003, SEC-0005: AVS and 3D Secure defaults.
- LPG-0034, LPG-0037, LPG-0038, LPG-0060, LPG-0062: product page first screen, proof and gallery.
- LPG-0058, LPG-0063: cart code box and checkout fees.
- CXP-0010, CXP-0012, CXP-0014: delivery dates and order tracking.
- CRO-0018: two-question post-purchase survey.
- SPD-0001, SPD-0002, SPD-0005, SPD-0006, SPD-0009: speed checks.

What makes this skill ours: settings are read through a read-only app the owner controls, never a shared password or token; every fail is priced in gross profit or given a severity; each market gets its own lines for local payment methods, delivery checks, failed deliveries and tax invoices; and checkout changes always end in test-mode orders before going live.

## Selling in India

Practitioner defaults, test them.

- **Cash on delivery** is offered, with a clear COD fee or a prepaid incentive shown before checkout.
- **UPI** is offered through the store's gateway (Razorpay, PayU, Cashfree or similar) and is the first prepaid option on mobile.
- **Pincode check** on the product page shows delivery date and COD availability before add to cart.
- **COD confirmation** by WhatsApp or call before dispatch, with a cancel option, to cut return to origin (RTO).
- **GST invoice** carries the store's GSTIN.
- **RTO rate** on COD is tracked and passed to `store-meta-math`.
