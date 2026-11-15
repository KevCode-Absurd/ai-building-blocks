---
name: store-meta-capi
description: "Checks that every real store order reaches Meta once, with the right value, currency, product IDs and enough customer match data, through the browser pixel and the Conversions API together. Covers the Shopify Facebook and Instagram app data-sharing level, WooCommerce and custom setups, duplicate pixels, event ID deduplication, event coverage, match quality, consent, test codes left live, and cash-on-delivery orders that never pay. Ends with a day-by-day reconciliation table of store orders against Meta Purchase events and a ten-order spot check. Use it when Meta and the store disagree on orders, before scaling, after a theme, checkout or app change, and when someone wants to buy a server-side tracking tool."
---

# Store orders into Meta, once and correctly: pixel and Conversions API check

**You get:** a daily table of store orders against Meta Purchase events, a ten-order spot check, the main cause of any gap and the top three fixes in order.

Meta's delivery learns from the purchases it receives. If it receives 70 of 100 real sales, it thinks the ads convert worse than they do and bids less well [MEA-0046]. If it receives 130, it learns from ghosts. This skill makes the store's orders and Meta's Purchase events agree, and fixes the cheap, certain problems before anyone pays for tracking tools.

## When to use

- `store-meta-attribution` found Meta far above or far below store orders, or values that do not match.
- Before raising spend: data integrity comes before structure and creative [ADC-0028].
- After a new theme, checkout change, app install, cookie banner or tag manager change.
- Many orders fail delivery, are refused or have payments reversed, and the store wants Meta to learn from paid orders, not failed ones (common where pay on delivery is offered).
- Someone proposes a paid server-side tracking tool or the Conversions API Gateway.

## Not for

- Choosing an attribution window or reading Meta's credit against the store: use `store-meta-attribution`.
- Margin and break-even numbers: use `store-meta-math`.
- Budget and campaign decisions: use `store-meta-budget`.
- A full account review that includes tracking among other layers: use `store-meta-audit`.

## What you need

Required:

1. **Events Manager screenshots** for the store's dataset (pixel), last 28 days: Overview with Purchase selected and the connection method split (browser, server), the Purchase event detail page showing event match quality and event coverage, and the Diagnostics tab. Better: partner access with "Use events dataset" (level 1, read).
2. **Shopify order export** for the same 28 days: Name, Created at, Financial Status, Subtotal, Discount Amount, Shipping, Taxes, Total, Payment Method, Currency, Cancelled at. WooCommerce: the order CSV.
3. **How tracking is installed**: Shopify Settings, Apps and sales channels, the Facebook and Instagram app, and its customer data-sharing level (Standard, Enhanced or Maximum); any pixel code in the theme or in Customer events; any Google Tag Manager container. For WooCommerce, the Meta plugin settings. For custom sites, the developer's event spec.
4. **The value definition** that `store-meta-math` used for break-even (subtotal after discounts, with or without shipping and tax).
5. **The live store URL.**

Optional: consent banner settings, courier export of delivered and failed orders, and the Ads Manager export already used by `store-meta-attribution`.

Access: level 1 to diagnose everything here. Level 2 (draft) to prepare fixes such as a new tag in a paused workspace or a written spec for the developer. Changing the app's data-sharing level, theme code, consent settings or tag publishing changes the live store: the client does it, or approves it at level 3. Never ask for passwords or API tokens; the client signs in.

## Before you start: the gates

1. **Gross profit per purchase.** Not needed to diagnose events. Needed to decide whether a paid tool is worth it (step 9). If missing, run `store-meta-math`.
2. **Cash and stock.** Not needed here. Note any SKU about to sell out so its catalog ID checks are not wasted.
3. **Tracking trust.** This skill is the fix, so it runs when tracking fails. It must stop and escalate to the client the same day if Purchase events have stopped completely, because live ads are then optimising blind [ADC-0064].

## Steps

### 1. Map every source of Purchase events

List each place a Purchase can be sent from: the Shopify app (browser and, at Maximum data sharing, server), pixel code pasted in the theme or old order-status scripts, Customer events pixels, Google Tag Manager, a Gateway, or another app. Two browser sources for one order means double counting that deduplication cannot fix, because each sends its own event ID. Keep one browser source and one server source.

### 2. Count orders against events, day by day

For each of the last 14 closed days: store orders placed (minus test and cancelled orders) beside Meta Purchase events received, split by browser and server.

Practitioner defaults, test them against the store's own history:
- Events within about 5% of orders: healthy.
- Events above orders by more than 10%: duplicates, reloads of the thank-you page, or test traffic.
- Events below orders by more than 20%: missing server events, consent blocking, or ad blockers.

### 3. Check deduplication

Meta merges a browser and a server event when both carry the same event name and the same event ID and arrive within 48 hours of each other (Meta documentation). Check in Diagnostics for duplicate warnings and in the event detail for the deduplication share. Common breaks: the server sends a different ID from the browser; the event name differs ("Purchase" versus "purchase"); in server-side Google Tag Manager the ID never travels with the event to the server tag [MEA-0006].

### 4. Check event coverage

Meta's Conversions API setup guide recommends that server events cover at least 75% of browser events for the same action; Events Manager shows this as event coverage. Below that, the server side is missing orders. On Shopify, the usual fix is raising the app's data sharing to Maximum, which the client approves.

### 5. Check value, currency and product IDs

Value must follow one definition and match `store-meta-math`. Send real order revenue per purchase, not a fixed number [MEA-0016]. Currency must be the store's currency. For catalog and Advantage+ sales campaigns, content_ids must match the product feed IDs exactly, or catalog ads cannot learn which product sold.

### 6. Check match quality and customer data

Meta rates event match quality out of 10 per event. Aim for Meta's "Good" or "Great" on Purchase; any fixed number target is a practitioner default. The keys that matter most for a store: email and phone from checkout, then the click ID (fbc) and browser ID (fbp), then name, city, postcode and country, external ID, IP address and user agent.

Hashing rules from Meta documentation: email lowercased and trimmed; phone as digits with country code, no symbols or leading zeros; then SHA-256. Do not hash fbc, fbp, IP or user agent. Never hash a value twice. Shopify's app and the WooCommerce plugin hash for you; check this only on custom builds.

### 7. Check consent and test leftovers

- With a consent banner, a pixel set to fire on page load can miss the landing page view after the visitor accepts; fire it on the consent update [MEA-0007].
- A test event code left in a live tag sends real purchases to the Test Events screen, not reporting [MEA-0005]. Search the tag setup for it.
- EEA, UK and some US states need consent before events carry personal data. Do not give a legal ruling; point the client to their consent tool's documentation.

### 8. Failed and unpaid orders: decide what Meta should learn from

Standard setups send Purchase when an order is placed. Orders that fail delivery, get refused, or have their payment fail or reversed never pay, yet Meta learns from them. This matters most where pay on delivery or invoice payment is offered, and where fraud or failed payments are high. Options, practitioner default, test it:

- **Keep Purchase on placement** (default), and read profit per placed order from `store-meta-math`. Fastest learning.
- **Also send a delivered or prepaid event** through the Conversions API when the courier confirms delivery, as a custom event. Meta accepts events up to 7 days after they happen (Meta documentation), so deliveries later than that cannot be sent as the original order. Optimise to it only once it reaches about 50 events per ad set per week, Meta's learning-phase guide; test it with `store-meta-test`.

Never send refunded, failed or returned orders as negative purchases; correct for them in `store-meta-attribution`.

### 9. Decide whether a paid tool is worth it

The Conversions API Gateway copies browser events to a server only after the pixel fires, so when an ad blocker stops the pixel, both are lost; expect about 1 to 2% recovery, not the 13% Meta's materials quote [MEA-0001]. Gains from server-side tools are often too small to measure against normal weekly noise [MEA-0046]. Rule: fix steps 1 to 7 first, because they are free and certain. Consider a paid tool only when the store has no platform app sending server events, or when a tool's yearly cost is well under 1% of ad spend [MEA-0036]. The Shopify app and the WooCommerce plugin are the free path.

### 10. Spot-check ten orders and finish the table

Ask the client to place one test order while you watch Test Events, or to share ten recent order numbers. For each order, confirm one Purchase arrived, with matching value, currency, event ID on both sides, and the match keys present. Then complete the reconciliation tables below. Write each fix as a numbered change for the client to approve: what changes, who does it, and the expected effect on the daily count.

## Checks before you hand it over

- Every Purchase source is listed, and there is one browser source and one server source.
- The daily table covers 14 closed days and its totals match the order export.
- Deduplication, event coverage and match quality are each read from Events Manager, with the screenshot or date.
- Event value follows the same definition as break-even in `store-meta-math`.
- content_ids match the product feed on at least the ten sampled orders.
- Stores with many failed or unpaid orders have a stated decision on what Meta learns from.
- No fix is shown as done unless the client made or approved it, and each has a re-check date.

## Output

**Summary, one screen:** "Meta receives X Purchase events per 100 store orders", the main cause of any gap, the top three fixes in order, and whether a paid tool is justified (usually no).

**Table "Store orders versus Meta Purchase events, by day" (the reconciliation table):** Date, Store orders placed, Paid at checkout orders, Paid later orders (pay on delivery or invoice), Cancelled or test orders removed, Meta Purchase events received, From browser, From server, Events per 100 orders, Event coverage, Duplicate warnings (yes or no), Note.

**Table "Ten-order spot check":** Order name, Store value (agreed definition), Meta event value, Currency match, Event ID on browser, Event ID on server, Deduplicated, Email or phone present, fbc present, content_ids match feed.

**Change list for approval:** number, change, who makes it, access needed, expected effect, re-check date.

## Common mistakes

- **Two pixels on one store.** An old theme pixel plus the app doubles Purchases. Step 1 maps every source.
- **Judging tracking on Ads Manager.** Ads Manager shows attributed purchases, not events received. Step 2 counts events.
- **Server events without the browser's event ID.** No merge, so double counts. Step 3.
- **Value with tax against break-even without it.** ROAS looks better than it is. Step 5 aligns them.
- **Buying a tool to fix a setup problem.** Step 9 puts free fixes first [MEA-0001].
- **Training Meta on orders that never pay.** Step 8 makes it a choice, not an accident.
- **Leaving a test code live after debugging.** Step 7 [MEA-0005].

## Sources

- MEA-0001: Gateway recovery against blockers is about 1 to 2%.
- MEA-0005: a live test event code hides real purchases.
- MEA-0006: in server-side GTM the event ID must travel with the event.
- MEA-0007: consent setup can miss the landing page view.
- MEA-0016: send real order revenue, not a fixed value.
- MEA-0036: measurement tools at about 1% of ad spend.
- MEA-0046: lost signal lowers Meta's estimated action rate; tool gains are hard to measure.
- ADC-0028: fix data integrity before structure and creative.
- ADC-0064: act the same day only on clear breakages.
- Meta documentation: deduplication by event name and event ID within 48 hours; event coverage guidance; customer information hashing; event time limits; learning phase of about 50 optimisation events in 7 days.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: counts store orders against Meta Purchase events day by day and spot-checks ten real orders instead of scoring a pipeline; works through the Shopify app's data-sharing levels and duplicate pixel sources; ties event value to the store's break-even definition; and decides what Meta should learn from when cash-on-delivery orders do not pay.

## Selling in India

- COD orders that return to origin (RTO) are the main case for step 8. Send a delivered event from the courier data only once it reaches the volume step 8 sets.
