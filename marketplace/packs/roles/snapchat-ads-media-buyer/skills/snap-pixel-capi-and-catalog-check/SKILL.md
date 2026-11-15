---
name: snap-pixel-capi-and-catalog-check
description: Check and fix a store's Snapchat signal before money is spent. Tests the Snap Pixel and Conversions API (v3 or CAPI Gateway) for the right events, value and currency, a shared event_id with the Pixel's client_dedup_id, order IDs on purchases, hashed email and phone, the ScCid click ID and the Shopify Always on setting; then checks the product catalog and Pixel item IDs for Dynamic Ads. Ends with a pass or fix list and a developer spec. Never asks for tokens in chat. Use before a first Sales campaign, when Snap and the shop disagree, or when Dynamic Ads will not deliver.
---

# Snap Pixel, Conversions API and catalog check

## When to use

- Before a first Sales or Dynamic Ads campaign.
- When Snap reports more or fewer purchases than the shop.
- When conversions drop to near zero, or Dynamic Ads will not deliver.
- After a site, theme, checkout or app change.

## What you need

- Data Analyst access, or screenshots of Events Manager: events, volumes, deduplication and diagnostics.
- Shop orders by day for the last 14 days.
- How the server events are sent: direct Conversions API, CAPI Gateway, a partner, or the Shopify app.
- For Dynamic Ads: the catalog's diagnostics and a sample of the feed.
- Someone who can place a test order while you watch.

**Access:** level 1 for the whole check. Level 2 to write the developer spec. Level 3 only to change Events Manager settings on a confirmed list. Code and tokens stay with the client's developer.

## Steps

### 1. Count against the shop
- Compare Snap purchases (all sources, same dates) with shop orders by day.
- Snap higher on most days: likely double counting. Snap far lower or zero on some days: events stopped, or Shopify paused data sharing.

### 2. Check the events
- Pixel fires PAGE_VIEW, VIEW_CONTENT, ADD_CART, START_CHECKOUT and PURCHASE on the right pages.
- PURCHASE carries value, currency (USD or INR) and transaction_id.
- Event names are the same on the Pixel and server routes.

### 3. Check deduplication
- The Pixel's client_dedup_id is set (not left blank, which makes a browser-only ID) and equals the server event_id. Snap matches these within 48 hours.
- Purchases also carry the order number as transaction_id on the Pixel and order_id on the server. Snap matches these for up to 30 days.
- The ID is unique per conversion: order ID first, then lead ID, then a random UUID. Never a session or user ID, never a placeholder.

### 4. Check matching
- Server events include at least one match key: hashed email, hashed phone, or IP address with user agent.
- Email trimmed and lowercased; phone with country code (91 India, 1 US), no leading 00 or 0, digits only; both SHA-256 hashed in lowercase hex.
- The ScCid from the landing URL is passed as sc_click_id (or the full URL in event_source_url), and the _scid cookie as sc_cookie1.
- Events are sent within 37 days, ideally at once, with accurate timestamps.
- No health or other sensitive data in event fields.

### 5. Check the platform settings
- Shopify: the Snapchat app's data sharing is Always on, not Optimized.
- Opted-out iOS users carry the LMU option.
- Consent: where the site's banner or notice asks for consent, the Pixel waits for it and the server route respects the same choice. In India, the store's notice states the purpose (DPDP Rules).

### 6. Test live
- Open Test Events in Events Manager and the Snap Pixel Helper, place a test order, and confirm one browser event.
- Ask the developer to send the same order to the validate endpoint, then live. Confirm one purchase after deduplication. Allow up to 24 hours for diagnostics.

### 7. Catalog for Dynamic Ads
- Feed has id, title, description, link, image_link, availability, price, condition, and brand or mpn or gtin.
- Pixel item_id on Page View, View Content, Add to Cart and Purchase equals the catalog id.
- Match rate above 80%, and at least 1,000 matched Snapchatters.
- Out of stock items show as such, so they drop out of ads.
- Shopify: products are published to Snap; product sets built in Ads Manager, because Shopify collections do not carry over.

### 8. Write the result
Pass or fix for each check. For each fix: what is wrong, the evidence, the fix, who does it, and how to retest.

## Checks

- Shop orders were compared before any verdict.
- The test order was seen once after deduplication, or the result says "not tested".
- No token, password or customer data was requested in chat.
- Every fix names an owner and a retest.
- Snapchat rules quoted carry their check date.

## Output format

1. Top line: ready to spend, or not yet and why.
2. Snap against the shop, by day.
3. Check table: area, pass or fix, evidence.
4. Developer spec: event names, IDs, hashing, click ID, consent, test steps.
5. Catalog readiness for Dynamic Ads.

## Example of good output (short)

*Illustrative structure, not a real business: a US phone case store on Shopify. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Top line:** not ready. Purchases are counted twice on most days, and the catalog match is 58%.
>
> | Area | Result | Evidence |
> |---|---|---|
> | Dedup | Fix | Snap shows 212 purchases for 14 days; the shop shows 118. Pixel sends no client_dedup_id. |
> | Shopify sharing | Pass | Always on. |
> | Matching | Fix | Phone sent as "(555) 010-2233", not normalised before hashing. |
> | Catalog | Fix | Pixel item_id uses variant IDs; the catalog uses product IDs. |
>
> **Developer spec:** set client_dedup_id and event_id to the order number; add transaction_id and order_id; send phone as 15550102233 before hashing; send variant IDs in the catalog id field. Retest with one test order in Test Events and the validate endpoint.
