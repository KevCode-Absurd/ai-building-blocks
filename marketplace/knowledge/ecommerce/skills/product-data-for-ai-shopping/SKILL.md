---
name: product-data-for-ai-shopping
description: "A product data completeness sheet and fix list that lets AI shopping agents (ChatGPT, Google AI Mode and Gemini, Copilot and others) find, compare and buy a store's products: every SKU scored on the fields agents read (title, description facts, images, price and currency, availability, GTIN or MPN, brand, variants, shipping, returns), the store policies agents require completed, the channels the store is live in through Shopify's agentic storefronts, Merchant Center or a direct feed, price and stock kept in sync, and stale app metafields cleaned up. Ranked by the gross profit of the products that fail. Use when products do not appear in AI shopping results, before turning on agent checkout, or after a catalogue import."
---

# Product data for AI shopping agents

**You get:** a per-SKU completeness sheet with pass or fail on every field AI shopping channels read, a policy checklist, a channel status table, a ranked fix list with the Shopify field or feed rule for each fix, and a one-screen summary, ready for the client to approve.

## When to use

- The store's products do not show when buyers shop inside ChatGPT, Gemini or Copilot.
- The owner wants to allow checkout inside AI channels and needs the data ready first.
- After a large import from a supplier or a migration, when fields are patchy.
- Agents quote wrong prices, stock or return terms for the store.

## Not for

- Making assistants mention the store in answers: use `get-recommended-by-ai-assistants`.
- On-page structured data: use `add-product-schema-and-rich-results`.
- Merchant Center disapprovals: use `fix-merchant-center-disapprovals`.
- Writing the policy pages: use `write-store-policy-pages`.

## What you need

Required (read access, level 1):

1. **Shopify product export** (CSV): Handle, Title, Body (HTML), Vendor, Type, Tags, Status, Option names and values, Variant SKU, Variant Barcode, Variant Price, Variant Compare At Price, Variant Inventory Qty, Variant Weight, Image Src, Image Alt Text, plus product metafields.
2. **Sales channels** screen (Shopify admin, Sales channels): which AI and Google channels are on.
3. **Policy pages**: Terms of service, Privacy policy, Return and refund policy, Shipping policy (Settings, Policies).
4. **Merchant Center** diagnostics, if the Google channel is used.
5. **Gross profit per order** by product.

Optional: a direct product feed the store sends to any AI channel, review app export (rating and count per product).

Editing products, metafields and channel settings needs draft or publish access as agreed; turning any channel or agent checkout on or off needs the client's yes.

## Before you start: the gates

1. **Products worth listing.** Pass when each product has gross profit per order known and positive [MEA-0037]. Products that lose money are set to not sell in AI channels, not fixed first.
2. **Policies complete.** Shopify's agentic storefronts need Terms of service, Privacy policy and Return and refund policy completed in Settings, Policies [AEO-6467]. Fail: hand to `write-store-policy-pages` before anything else.
3. **Prices and stock in sync.** Feed price must match the page exactly or products are disapproved [GAD-6122]; with frequent price changes, update at least every 6 hours with automatic item updates on [GAD-0005].
4. **Checkout readiness.** Before agent checkout is allowed, confirm fulfilment capacity, fraud settings (`stop-fake-orders-and-card-testing`) and that the channel supports the store's payment methods.

## Steps

### 1. Map the channels

List each AI channel and how products reach it: Shopify's agentic storefronts reach ChatGPT, Google AI Mode and Gemini, Microsoft Copilot and Meta through Shopify Catalog, or for Google through the Google and YouTube channel or Merchant Center; it is on by default for eligible stores, managed under Sales channels, Agentic [AEO-6467]. Non-Shopify stores or direct integrations may send a feed in the channel's own format (for example OpenAI's product feed spec). Record per channel: on or off, countries, checkout on or off, last checked date. Settings change fast; recheck the help page each time.

### 2. Score every SKU

Shopify's catalog is built from back-end product data, not the theme [AEO-0003], so the admin fields are what agents read. For each variant, pass or fail:

| Field | Pass when |
|---|---|
| Title | Product type and key attribute in plain words; variant named; under 150 characters, no promotional text [GAD-6123] |
| Description | Plain facts: material, size, capacity, use, who it suits, what is in the box; no claims without source |
| Image | At least one clear product image, no overlays on the main image [GAD-6043], alt text present |
| Price and currency | Above zero, matches page, tax treatment correct for the market |
| Availability | Inventory tracked; sold-out variants show out of stock, not in stock |
| GTIN or MPN | Real barcode where the product has one; never invented. Brands without GTINs use MPN and brand |
| Brand | The brand buyers know, not the supplier name |
| Variants | Options named consistently (Size, Colour), values as buyers say them |
| Product type and category | Set from Shopify's standard product taxonomy |
| Shipping and returns | Weight set; shipping rates and return window defined for the market |
| Ratings (optional) | From the review app, real and current |

Score = fields passed / fields applicable. A score under 100% on a top-profit product is a fix.

### 3. Clean the metafields

List metafields by namespace. Remove or empty those left by uninstalled apps (old review counts, old size charts), since stale metafields can flow into the catalog [AEO-0003]. Move important facts (material, care, dimensions) into structured metafields the theme and catalog both use.

### 4. Write facts, not slogans

Agents shortlist by matching facts to the buyer's request. "Perfect for life on the go" matches nothing; "750 ml insulated steel bottle, keeps drinks cold 24 hours (tested by the store), fits car cup holders" matches many requests. Rewrite the first 2 to 3 lines of descriptions for top-profit products as facts with units. Every number needs a source; untested claims are removed. Hand bulk rewrites to `write-product-descriptions-in-bulk`.

### 5. Keep it in sync

- Inventory tracked on every variant; "continue selling when out of stock" only for real pre-orders.
- Sale prices set with real start and end dates; compare-at prices only where the store genuinely charged that price.
- After each sale or price change, check a sample in each channel within a day.

### 6. Rank the fix list

Order fixes by: gross profit per order x units sold in 90 days x fields failing. Policy gaps and price mismatches come first because they block whole channels. Each fix names the Shopify field or feed rule, owner and access level.

### 7. Market notes

- **UK, EU and Australia:** prices shown to consumers must include VAT (or Australia's goods and services tax); set tax settings so channel prices match the page. Return windows, including the EU 14-day right to cancel, must match the policy page.
- **Pay on delivery:** where many buyers pay on delivery, and an AI channel only supports prepaid checkout, note that those buyers may still discover there but buy on the site, and keep the product page payment message clear.
- **Every market:** check which AI shopping channels serve each country the store sells to before planning around them.
- **US:** sales tax is added at checkout, so listed prices exclude it; return windows and who pays return shipping must match the policy page word for word.

### 8. Confirm

After the client approves fixes: re-export, re-score, and check 10 top products in each live channel (search for them as a buyer would). Record what each channel shows (price, stock, returns) against the store.

## Checks before you hand it over

- Every active SKU is scored on every applicable field.
- The three required policies are complete and match operations.
- Page, feed and channel prices match on a 20-product sample.
- No invented GTINs; missing ones left blank with MPN and brand.
- Stale app metafields listed and cleared or marked.
- Descriptions of top-profit products open with sourced facts.
- Channel table shows on or off and checkout status, with the date checked.
- No channel or checkout setting changed without the client's yes.

## Output

1. **One-screen summary:** channels live, share of SKUs at 100%, the 10 fixes with the most gross profit behind them, policies status, what needs the client's yes.
2. **Completeness sheet** (`ai-product-data.csv`):

| Handle | Variant SKU | Gross profit per order | Units 90 days | Title | Description facts | Image | Price match | Availability | GTIN or MPN | Brand | Variants | Category | Shipping and returns | Score | Fix |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

3. **Policy checklist:** Policy, Exists, Matches operations, Last updated, Owner.
4. **Channel table:** Channel, Route (Catalog, Merchant Center, direct feed), Status, Countries, Checkout, Date checked.
5. **Fix list:** Fix, Products, Field or rule, Owner, Access, Approval, Status.

## Common mistakes

- **Fixing the theme instead of the data.** Step 2 works on admin fields, which is what the catalog reads.
- **Missing policies.** Gate 2 blocks channels until they exist.
- **Invented barcodes.** Step 2 leaves them blank.
- **Stale app data.** Step 3 clears it.
- **Slogan descriptions.** Step 4 opens with facts and units.
- **Turning on agent checkout before fraud and capacity checks.** Gate 4.

## Sources

- AEO-0003: Shopify's catalog reads back-end data; minimum fields; stale metafields.
- AEO-6467: agentic storefronts channels, policies and eligibility.
- GAD-0005: price mismatch causes disapprovals; update often.
- GAD-6043: no overlays on the main product image.
- GAD-6122: feed and page prices must match exactly.
- GAD-6123: Merchant Center title rules.
- MEA-0037: gross margin is delivered cost.

What makes this skill ours: every SKU gets a pass or fail per field agents read, ranked by the gross profit of what fails; policies and price sync are treated as gates that block whole channels; stale app metafields are cleaned because the catalog reads the admin, not the theme; and pay-on-delivery buyers are planned for when an AI channel only takes prepaid.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Displayed prices must include all taxes; set GST correctly so channel prices match the page. Many buyers pay COD; if an AI channel only takes prepaid, expect COD-heavy buyers to discover there but buy on the site, and keep the product page COD message clear. Check which AI channels serve India before planning around them.
