---
name: set-up-markets-and-currencies
description: "Opens one new country for a Shopify store and proves it works before any ad money goes there: a landed-margin check for that country, the market in Shopify Markets, currency and rounding, local prices, duties and import taxes collected or not, shipping rates and a delivery promise, translated key pages, local payment methods and returns, then a launch check with test orders from that country. Shows when a separate local store beats one store with Markets, and when not to open the country at all. Use when a store wants to sell to one new country, when international orders arrive with surprise customs bills, or when foreign buyers abandon at checkout."
---

# Selling abroad: markets and currencies

**You get:** a country launch sheet for one country: a go or no-go margin check, the Shopify Markets settings to enter (currency, rounding, prices, duties, shipping, domain, language, payments), a 15-line launch check with 3 test orders, and the first-month watch list.

## When to use

- The store has organic orders or real demand from one new country and wants to serve it properly.
- International buyers complain about customs bills on delivery.
- Foreign visitors abandon at checkout after seeing a currency or charge they did not expect.
- A store wants to sell from its home country into another: for example a US store into Canada, the UK or Australia, a UK store into the EU or US, or an EU store into the UK.

## Not for

- Hreflang, subfolders and translated pages for search: use `international-seo-hreflang`.
- Domestic tax set-up: use `set-up-taxes-gst-and-us-sales-tax`.
- Choosing an international courier or 3PL: use `compare-shipping-carriers`.
- Ad campaigns for the new country: hand the go result to the media buyer.

## What you need

Required:

1. **Target country**, one at a time.
2. **Landed cost per product** and **gross profit per order** at home (`build-sku-profit-sheet`).
3. **International courier quotes** for that country by weight slab, with whether they offer Delivered Duty Paid (DDP).
4. **HS codes and country of origin** for every product going to that country.
5. **Shopify order export** filtered to that country, if any orders exist: Created at, Total, Shipping, Taxes, Shipping Country, Refunded amount.
6. **Payment provider** in use, and whether it is Shopify Payments.

Optional: GA4 sessions by country, support tickets from that country, competitor prices there.

Checking is level 1. Creating the market and its settings is level 2, built inactive. Activating the market and sending traffic needs the client's yes.

## Before you start: the gates

1. **Landed margin per order for that country is positive.** Gross profit = local price minus landed cost minus international shipping minus duties the store pays (if DDP) minus payment and currency fees minus a return allowance. Fail: no-go, or raise the local price and recheck.
2. **Returns plan exists.** Pass when there is a local return address or a policy to refund without return under a value line. Fail: write it first (`set-up-returns-and-exchanges`).
3. **Tax and duty obligations confirmed.** Many countries require the seller to register for VAT or a similar sales tax before selling to consumers there (the EU's One Stop Shop and Import One Stop Shop schemes, UK VAT on parcels up to 135 pounds, Australia's and New Zealand's low-value import tax, US state sales tax once over a state's threshold); the accountant confirms. Fail: no-go until confirmed.
4. **Cash.** International shipping and duties are paid up front; refunds take longer. The client confirms the cash for one month of expected orders.

## Steps

### 1. Choose the structure

- **One store with Markets** (default): one admin, one catalogue, local currency and settings per market.
- **A separate local store** with a local warehouse can beat cross-border selling for small, light products; one operator cites UK processing near 0.5% against 5% to 7% cross-border fees [SET-0009]. Consider it only when volume in that country is proven.

### 2. Currency

Local currency shown on the product page but charged in the store's base currency at checkout confuses buyers. Without Shopify Payments, currency converter apps show local prices only up to the cart and checkout still charges the base currency [SET-0002]. On Shopify Payments, turn on local currency for the market. Otherwise, either sell in the base currency openly or use a gateway that settles in the local currency.

Set rounding to local price endings (for example .99 in the US and UK, .95 or whole euros in parts of the EU, whole yen in Japan).

### 3. Prices

Do not just convert. Set a price list for the market from step 1's landed margin: local price = the price that keeps gross profit per order at or above home, rounded to local endings, and sense-checked against two local competitors. Decide tax-inclusive pricing: the UK, EU and Australia expect it; the US and Canada expect tax added [SET-0004].

### 4. Duties and import taxes

Decide who pays:

- **Collect at checkout (DDP):** the buyer pays one total and gets no bill at the door. In Shopify this needs HS codes on products, a carrier that supports DDP labels, and not using Shopify Fulfillment Network; it is turned on per market and carries a transaction fee [SET-6204]. Wrong or missing HS codes still lead to extra charges on delivery [SET-6204].
- **Buyer pays on delivery (DDU):** cheaper to set up, but say so clearly on the product page, cart and shipping policy.

Default: collect at checkout where the requirements are met.

### 5. Shipping and promise

Create the market's shipping zone with real courier rates and a promise from transit time plus customs plus buffer. Show it in the market's language on the product page and cart (`set-up-shipping-rates-and-delivery-promise`). Keep extra charges at checkout low: below about 10% of order value, one practitioner saw no material conversion effect [LPG-0063].

### 6. Payments

Turn on the methods buyers there use, which the payment settings list by country. Accelerated checkouts help mobile buyers [SET-0008]. Check the local favourites: for example iDEAL in the Netherlands, Bancontact in Belgium, BLIK in Poland, Klarna and other buy now, pay later options in the Nordics, Germany and the UK, Interac in Canada, Afterpay in Australia, Pix in Brazil. Confirm the gateway supports cards from that country and the settlement currency. Pay on delivery rarely works cross-border; offer it only where a local partner collects and remits the cash.

### 7. Language and pages

Translate at least the product pages for the products you will push, the cart, shipping and returns policy, and the contact page. Use Shopify's free Translate and Adapt app first; have a native speaker check the policy and the top product page. Hand domains, subfolders and hreflang to `international-seo-hreflang`.

### 8. Launch check

Build the market inactive, then preview it from the country (Shopify's market preview, or a VPN for the store owner's own test) and check: currency on product page, cart and checkout match; price endings correct; duties line shown or DDU notice present; shipping rate and promise correct; tax line correct; policy pages translated; payment methods correct; confirmation email in the right language and currency.

Run 3 test orders to an address in the country: one standard, one with a discount, one refunded. Check the total charged in the buyer's currency, the payout in base currency, and the fee.

### 9. First-month watch

Weekly: orders, conversion rate and gross profit per order for the market against home; abandoned checkouts at the shipping or payment step; customs complaints; returns. If gross profit per order falls below home for 3 weeks, raise prices or pause ads to that market.

## Checks before you hand it over

- The landed margin sheet shows positive gross profit per order for the market, with every cost line filled.
- Every product sold there has an HS code and country of origin.
- Currency on product page and checkout match, or the base currency is stated openly.
- Duties are collected at checkout, or a clear DDU notice appears on 3 pages.
- Shipping promise for the market is shown in its language.
- 3 test orders logged with charged amount, fee and payout.
- The market is inactive until the client approves.

## Output

**One-screen summary:** go or no-go, landed gross profit per order there versus home, structure (Markets or local store), duty choice, launch date proposed.

**Landed margin table:**

| SKU | Local price | Landed cost | Intl shipping | Duties paid by store | Payment and FX fees | Return allowance | Gross profit per order | Home gross profit per order |
|---|---|---|---|---|---|---|---|---|

**Market settings sheet:** Setting, Value, Where in Shopify, Who confirms (currency, rounding, price list, tax-inclusive, duties, shipping zone, payment methods, language, domain).

**Launch check:** 15 lines, pass or fail, with proof; test order log with order number, charged amount and currency, fee, payout.

## Common mistakes

- **Converted prices only.** They ignore duties and shipping; step 3 prices from landed margin.
- **Local currency shown, base currency charged.** Buyers feel misled [SET-0002]. Step 2.
- **Surprise customs bills.** Step 4 collects duties or warns clearly; HS codes keep estimates right [SET-6204].
- **Several countries at once.** One country, one launch check, then the next.
- **No returns path.** Gate 2.
- **Ads before the test orders.** Step 8 comes first.

## Sources

- SET-0002: without Shopify Payments, checkout charges the base currency.
- SET-0004: tax-inclusive pricing for markets that expect it; duties at checkout.
- SET-0008: Shop Pay mobile checkout figure.
- SET-0009: separate local stores can beat cross-border for small, light goods.
- SET-6204: duties at checkout requirements, fee and accuracy.
- LPG-0063: keep checkout add-ons under about 10% of order value.

What makes this skill ours: a country opens only if landed gross profit per order there is positive after duties, fees and returns; local prices come from that margin rather than a currency converter; duties are collected or clearly disclosed; and the market stays inactive until three test orders from that country pass.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. An India store selling abroad: confirm the gateway supports international cards and the settlement currency; COD does not apply, and export paperwork and GST rules for exports go to the accountant. A store abroad selling into India: offer UPI and COD through an India gateway, round prices to whole rupees, and show prices inclusive of GST.
