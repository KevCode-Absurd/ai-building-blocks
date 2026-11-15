---
name: tiktok-pixel-and-events-api-check
description: "A pass or fail check of a store's TikTok pixel and Events API, with the fixes in the order they should be made. Checks there is one pixel and one connection, that the Shopify app and its data sharing level are right, that browser and server events carry the same event ID so purchases count once, that purchase value, currency and product IDs are correct, that no test code is left live, that customer matching and consent work, and that purchase events match Shopify orders day by day, with a ten-order spot check. Use before launching TikTok ads, when TikTok and the store disagree on sales, after a theme, checkout or app change, or when results drop suddenly."
---

# TikTok pixel and Events API check

**You get:** a check sheet of 12 pass or fail tests with the evidence for each, a day-by-day table of Shopify orders against TikTok purchase events for 7 days, a ten-order spot check, and a numbered fix list in priority order, ready for the owner or developer to act on.

## When to use

- Before the first TikTok ads campaign goes live.
- TikTok reports more or fewer purchases than the store took.
- The theme, checkout pages, consent banner or TikTok app changed.
- TikTok results fell suddenly and nothing else changed.

## Not for

- Meta pixel and Conversions API: use `store-meta-capi`.
- Google Ads conversions: use `check-google-ads-conversion-tracking`.
- GA4 setup: use `set-up-ga4-for-store-and-check-data`.
- Deciding budgets from the numbers: use `tiktok-ads-daily-review-and-scale` once this passes.

## What you need

Required (read access, level 1):

1. **TikTok Events Manager** view of the pixel: events received by day, source (browser or server), diagnostics tab.
2. **Shopify order export**, last 7 full days: Name, Created at, Total, Currency, Payment Method, Cancelled at.
3. **Shopify settings view**: installed apps, the TikTok app's connection and data sharing setting, Customer events (custom pixels), theme code search for "ttq" or "analytics.tiktok.com".
4. **A browser with the free TikTok Pixel Helper extension**, or the browser's network tab.

Optional: the consent banner settings, server-side tag manager container, a list of recent app installs.

Access: reading settings is level 1. Changing the app connection, theme code or custom pixels needs level 2 (draft) and the owner's yes before publishing. Test orders are placed and refunded with the owner's agreement. Never ask for logins; the owner signs in to connect apps.

## Before you start: the gates

1. **One owner of the pixel.** Know which Business Center and ad account the pixel belongs to. Fail: the owner confirms access before any change.
2. **Time zone matches.** TikTok ad account and Shopify in the same time zone, or the daily table is shifted. Fail: compare on 7-day totals only.
3. **Consent rules known.** Which visitors must accept cookies before tracking (for example EU and UK). Fail: ask the owner; never switch consent off to get more data.
4. **Market.** TikTok ads run only where TikTok is available; it is blocked in a few countries. This check applies to stores advertising to buyers where it runs.

## Steps

### 1. Count the pixels and connections

Search theme code, Customer events and installed apps for TikTok code. Load the home page, a product page, cart and order status page with Pixel Helper on.

- **Pass:** one pixel ID, from one source (normally the official TikTok app).
- **Fail:** two pixel IDs, or the same pixel from both theme code and the app. Duplicates double-count purchases. Remove extras after the owner's yes.

Old scripts on Shopify's Thank you and Order status pages had to be replaced in the 2026 upgrade; a purchase tag that lived there may have stopped [MEA-6226]. Use a custom pixel only if no app can do the job, and the store owns its consent compliance [MEA-6227].

### 2. Check the app connection

In the TikTok app on Shopify: connected to the right Business Center, ad account and pixel; data sharing set to the highest level the store's consent rules allow, so server events (Events API) are sent alongside the browser pixel. Pass: Events Manager shows both browser and server as sources for Purchase.

### 3. Check the event list

Pass when these arrive daily: ViewContent, AddToCart, InitiateCheckout, and the purchase event (named Complete Payment or Purchase depending on the account). Missing mid-funnel events weaken optimisation; a missing purchase event is a stop.

### 4. Check purchase parameters

Inspect one purchase in Pixel Helper or Events Manager:

- value: the order amount on one stated basis (with or without tax and shipping; pick one and keep it).
- currency: the store's currency code.
- content_id: the same product or variant ID the catalog uses.
- quantity and content_type present.
- event_id: the Shopify order ID or another ID unique to the order.

### 5. Check deduplication

TikTok merges a browser and server event when both carry the same event name and event_id; its help article "About event deduplication" describes a 48-hour window and a cookie fallback when no event ID is sent (check the article on the day). The same rule holds on Meta, where the ID must travel on both routes [MEA-0006]. Every order needs its own ID; a shared or empty ID collapses or drops purchases, as GA4 shows with transaction IDs [MEA-6223].

Pass: the ten-order spot check (step 9) finds each order once.

### 6. Check for a live test code

A test event code left in a server set-up sends real events to the test screen instead of reporting; this has silently stopped counting on Meta [MEA-0005]. Pass: no test code in any live tag or server container.

### 7. Check customer matching

Advanced matching on (hashed email and phone sent with events); the TikTok click ID (ttclid) kept on landing URLs, so no redirect strips it. Lost signal makes the platform underrate the store's ads [MEA-0046]. Pass: matching enabled and ttclid present after a click from a test ad or preview link.

### 8. Check consent

Where consent is required, the pixel must wait for it and then fire once consent is given, including on the page where the visitor accepted; a pixel tied only to the first page load misses that page [MEA-0007]. Pass: no TikTok request before acceptance; requests start after.

### 9. Reconcile with Shopify

Daily table, 7 days: Shopify orders (excluding test and cancelled), TikTok purchase events received (all sources, not just ad-attributed), ratio, value in each.

| Ratio of TikTok events to orders | Read |
|---|---|
| Above 1.0 | Duplicates: fix steps 1 and 5 first |
| About 0.85 to 1.0 | Normal loss to blockers and consent (practitioner default, test it) |
| Below about 0.85 | Missing server events, consent over-blocking or a broken page |

Ten-order spot check: pick ten recent orders, find each order ID as an event_id in Events Manager, and note found once, twice or not found.

Pay on delivery and other paid-later orders: the purchase fires when the order is placed, before payment. If many of these orders fail delivery or are never paid, consider sending a separate server event for confirmed or delivered orders; `meta-ads-for-cod-stores` explains the logic.

### 10. Write the fix list in order

1. Duplicate pixels or double-counted purchases.
2. Missing or wrong purchase value or currency.
3. Live test code.
4. Missing server events or event ID.
5. Consent firing errors.
6. Matching and click ID.
7. Mid-funnel events and product IDs.

Each fix: what, where, who (owner, developer, app support), access needed, and how to re-test.

### 11. Re-test after fixes

Place one real order (refund it after, with the owner's agreement). Pass: one purchase, right value and currency, browser and server both present, merged into one.

## Checks before you hand it over

- Every one of the 12 tests (pixel count, app connection, events, value, currency, content ID, event ID, dedup, test code, matching, consent, reconciliation) has pass or fail and evidence.
- The daily table covers 7 full days in one time zone.
- The ten-order spot check is complete.
- Fixes are numbered in the priority order above.
- No change was published and no consent setting was loosened without the owner's yes.
- The re-test order is recorded.

## Output

**One-screen summary:** overall pass or fail, the three most important fixes, the 7-day ratio of TikTok events to Shopify orders, and whether ads can launch or scale.

**Check sheet** (`tiktok-tracking-check.csv`): Test, Pass or fail, Evidence (screenshot name or value seen), Fix needed.

**Reconciliation table:** Date, Shopify orders, Shopify value, TikTok purchase events, TikTok value, Ratio, Note.

**Spot check:** Order ID, Order time, Value, Found in TikTok (once, twice, no), Event source.

**Fix list:** Priority, Fix, Where, Owner, Access level, Re-test step.

## Common mistakes

- **Two pixels after an app switch.** Step 1 counts every source.
- **Dedup by hope.** Steps 5 and 9 check the order ID on both routes and in a spot check.
- **Comparing attributed purchases to all orders.** Step 9 uses all events received.
- **Test code left live.** Step 6 checks every tag.
- **Switching off consent to fix low numbers.** Gate 3 forbids it.
- **Thank-you page scripts that died in Shopify's upgrade.** Step 1 checks for them.

## Sources

- MEA-0005: a live test code stops real events counting (Meta).
- MEA-0006: the event ID must travel on browser and server routes.
- MEA-0007: fire after the consent update, not only on page load.
- MEA-0046: lost signal makes the platform underrate ads.
- MEA-6223: each order needs a unique ID.
- MEA-6226: old Thank you page scripts had to be replaced in 2026.
- MEA-6227: custom pixels only when no app fits; consent stays with the store.

What makes this skill ours: purchase events are reconciled against every Shopify order by day with a ten-order spot check, not just a green light in Events Manager; fixes come in a fixed priority order starting with double counts; Shopify's 2026 checkout upgrade is checked for silent tag loss; and consent is never loosened to raise the numbers.

## Selling in India

- TikTok is blocked in India, so this check applies only to Indian stores advertising to buyers abroad.
