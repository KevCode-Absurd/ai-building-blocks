---
name: set-up-ga4-for-store-and-check-data
description: "A GA4 property set up for an online store (settings, ecommerce events, purchase as the key event, channel groups, Google Ads link) and then checked day by day against the store's own orders, with every gap named, sized and given a fix and an owner. Covers Shopify's official Google channel versus a custom pixel, the upgraded thank-you page, transaction ID duplicates, third-party and one-click checkouts, payment redirects, orders taken by chat or phone, and why GA4 conversion rate is wrong until filtered to purchases. Use for a new store, after a theme, checkout or tracking change, or when GA4 and Shopify disagree."
---

# GA4 setup and data check for a store

**You get:** a completed setup checklist (each item set, verified or open), a 14-day reconciliation table of GA4 purchases and revenue against store orders, and a gap list where each gap has its size, cause, fix and owner, ready for the client to approve.

## When to use

- A new store, or a store whose GA4 nobody has looked at since it was installed.
- After a theme change, a checkout app change or Shopify's thank-you page upgrade.
- GA4 shows far more or far fewer purchases than Shopify.
- Before any report, cohort or channel work that will lean on GA4.

## Not for

- Google Ads conversion actions and enhanced conversions: use `check-google-ads-conversion-tracking`.
- Meta pixel and Conversions API: use `store-meta-capi`; TikTok: `tiktok-pixel-and-events-api-check`.
- The tagging rule for every link: use `set-up-utm-tracking-for-all-channels`.
- Bot and fake traffic: use `spot-bot-traffic-in-analytics`.
- Wiring data into AI tools: use `ad-and-store-data-connections`.

## What you need

1. **GA4 access.** Viewer for the check (level 1). Editor for setup changes; property settings and installs are live changes, so they need level 3 and the client's yes on the exact list first.
2. **Shopify admin access** to see Settings, Customer events and the installed apps (level 1; installing or removing an app is level 3 with a yes).
3. **Shopify order export** for the same 14 days: Name, Created at, Financial Status, Cancelled at, Subtotal, Shipping, Taxes, Total, Currency, Source, Payment Method.
4. **Store facts:** time zone, currency, checkout type (Shopify checkout or a third-party checkout), markets sold to, consent banner in use.

Optional: Google Ads account ID, list of other tags (GTM container, old scripts), staff IP addresses or office network.

If GA4 does not exist, create the property only after the client says yes; the client owns it and adds you as a user. Never ask for a Google password.

## Before you start: the gates

1. **Owner access.** The client's own Google account is the property's admin. Fail: stop and have them create or reclaim it; an agency-owned property can be lost.
2. **One install path.** Find every way GA4 is loaded: the Shopify Google and YouTube channel, a custom pixel, a GTM container, theme code, old checkout scripts. Pass when you know the list. Two paths for the same event double-count page views and add-to-carts.
3. **Thank-you page state.** Shopify's deadline to upgrade the Thank you and Order status pages was 26 August 2026, after which stores were upgraded automatically and old scripts there must be replaced [MEA-6226]. If purchase tracking lived in old additional scripts, assume it broke on upgrade until the check in step 7 proves otherwise.
4. **Consent rules.** Name the laws and markets in play (EU or UK consent under GDPR and the ePrivacy rules with Google Consent Mode, US state privacy laws such as California's, Canada's PIPEDA, Australia's Privacy Act, and any other market's data protection law). This skill does not rule on law; it records which banner the store uses and checks that tags respect it.

## Steps

### 1. Property settings

- Time zone and currency match Shopify exactly; otherwise days and revenue never line up.
- Event data retention: 14 months. Standard properties allow 2 or 14; the setting limits explorations and funnel reports, and data already deleted does not come back [MEA-6222] [MEA-0003].
- Define internal traffic (office and staff networks) and set the filter to active [MEA-0003].
- Leave the session timeout at 30 minutes unless there is a reason; raising it merges visits and breaks comparisons with past data [MEA-0004].
- Turn on Google signals only if the consent setup covers it.

### 2. Pick one install path

Default: Shopify's Google and YouTube sales channel, the official route. Use a custom pixel only for a gap the channel does not cover; custom pixels run in a sandbox on checkout and post-purchase pages, Shopify does not support them, and consent compliance stays with the store [MEA-6227]. Remove the others after the client approves the removal list. Never keep two paths for the same event.

### 3. Check the ecommerce events

GA4 expects these names: view_item_list, select_item, view_item, add_to_cart, view_cart, begin_checkout, add_shipping_info, add_payment_info, purchase and refund [MEA-6224]. In DebugView or Realtime, walk one product to checkout and confirm each fires once, with currency set whenever value is sent and items carrying item_id or item_name.

Place one real low-value order (or use the store's test mode if the gateway supports it) and confirm purchase fires once with the store's real order number as transaction_id. GA4 deduplicates purchases that share a transaction ID; an empty ID collapses every such purchase into one, and a reused ID undercounts [MEA-6223]. Refund the order afterwards.

### 4. Mark the key event

Mark purchase as a key event. GA4's session key event rate counts any key event, so conversion rate by channel or landing page is wrong until the report is filtered to purchase [MEA-0002]. If other key events exist (sign-up, add to cart), either unmark them or always filter.

### 5. Check channel grouping

Open Traffic acquisition by session default channel group for the last 28 days.

- **Unassigned** above about 5% of sessions means tagged links GA4 cannot place (practitioner default).
- **Organic Social** holding paid traffic: GA4 files a visit as Paid Social only when the medium matches cp, ppc, retargeting or paid*; a social source with any other medium counts as organic [MEA-6220]. Hand the fix to `set-up-utm-tracking-for-all-channels`.
- Build one custom channel group (the default cannot be edited) with extra channels the store needs: WhatsApp, creators, marketplaces, and AI assistants, whose visits mostly arrive without a link [AEO-0010].

### 6. Link Google Ads

Link the Ads account and keep auto-tagging on. Google calls the gclid required for conversion tracking, and in GA4 it wins over manual UTM tags [MEA-6225]. Do not make GA4-imported purchases the primary Ads conversion: imports undercounted by about 20% against the store tag in one practitioner's audits, and two primaries double-count [MEA-0017] [GAD-0042]. Hand the Ads side to `check-google-ads-conversion-tracking`.

### 7. Reconcile 14 days against orders

Build the table day by day in the store's time zone. Store side: web orders only (Source "web"), excluding cancelled, test, POS and draft orders. Shopify sessions include bots GA4 filters, so compare purchases, not sessions [MEA-0012].

Read the capture rate = GA4 purchases / store web orders (practitioner bands, test them):

- **90 to 100%:** good. Blockers and declined consent explain the rest.
- **75 to 90%:** usable for ratios and trends; not for counting sales.
- **Under 75%, or over 100%:** broken. Over 100% means duplicates (two install paths, reloads with new IDs); under 75% means a missing path.

Then compare revenue per order in GA4 and the store. A gap here with matching counts means currency, tax or shipping is inside or outside value differently.

### 8. Name every gap

For each gap: what is missing, how many orders a week, likely cause, fix, owner (store, developer, app vendor), and whether the fix needs level 3. Common causes:

- **Third-party checkout.** One-click, headless and pay-on-delivery checkouts that replace Shopify's checkout often send their own purchase event, or none. Ask the vendor how they send GA4 purchases and test one order.
- **Orders made outside the site.** Orders taken over WhatsApp, Instagram, email or phone and entered as draft orders never fire GA4. Report them as their own line, not a tracking failure.
- **Consent.** Purchases from visitors who declined are missing by design; size the share, do not "fix" it.
- **Payment redirects** (PayPal, Klarna, Afterpay and other buy-now-pay-later, bank-redirect methods such as iDEAL, local payment apps and wallets) that return to a different domain can start a new session and steal credit; check referral exclusions for the gateway domains.

## Checks before you hand it over

- Time zone and currency match the store.
- Retention is 14 months and the internal traffic filter is active.
- Exactly one install path sends each event; the removal list is approved.
- purchase fires once per order with the real order number as transaction_id.
- Purchase is a key event and every conversion rate in the hand-over is filtered to it.
- The 14-day capture rate is printed with its band.
- Unassigned share and paid traffic in Organic Social are measured.
- Every gap has size, cause, fix, owner and access level.
- No live change was made without the client's yes.

## Output

**1. One-screen summary:** capture rate and band, revenue match, the top three gaps with orders per week at stake, and the fix order. Up to three assumption lines where a missing setting changes the fix order.

**2. Setup checklist**

| Item | Required setting | Found | Action | Access needed | Status |
|---|---|---|---|---|---|

Rows: owner, time zone, currency, retention, internal filter, session timeout, install paths, each ecommerce event, purchase transaction_id, key event, channel group, custom channel group, Ads link, auto-tagging, consent, thank-you page.

**3. Reconciliation table**

| Date | Store web orders | GA4 purchases | Capture % | Store revenue | GA4 revenue | Revenue gap % | Note |
|---|---|---|---|---|---|---|---|

**4. Gap list**

| Gap | Orders per week | Cause | Fix | Owner | Level | Due |
|---|---|---|---|---|---|---|

## Common mistakes

- **Reading conversion rate on all key events.** Step 4 filters to purchase.
- **Two install paths.** Gate 2 finds them all; step 2 keeps one.
- **Comparing sessions with Shopify.** Bots differ; step 7 compares purchases.
- **Chasing 100%.** Blockers and declined consent are expected; step 7 bands the capture rate.
- **Ignoring third-party checkout and chat orders.** Step 8 lists them as their own lines.
- **Default 2-month retention.** Year-on-year explorations come up empty; step 1 sets 14 months.

## Sources

- MEA-6220: Paid Social needs a paid medium; other mediums count as organic.
- MEA-6222: retention is 2 or 14 months and limits explorations.
- MEA-6223: purchases deduplicate on transaction_id; empty IDs collapse.
- MEA-6224: GA4's recommended ecommerce events and purchase parameters.
- MEA-6225: keep auto-tagging; it wins over UTMs in GA4.
- MEA-6226: Shopify upgraded Thank you and Order status pages from 26 August 2026.
- MEA-6227: custom pixels run sandboxed; consent stays with the store.
- MEA-0002: session key event rate counts any key event.
- MEA-0003: 14-month retention and internal traffic filter on day one.
- MEA-0004: longer session timeout merges visits.
- MEA-0012: Shopify sessions include bots that GA4 filters.
- MEA-0017: one primary purchase conversion; GA4 imports undercount.
- GAD-0042: GA4 events as primary conversion miss about 10 to 15%.
- AEO-0010: most AI-assistant influence arrives without a referral link.

What makes this skill ours: the check is against store orders by day with banded capture rates instead of a "tags fire" test; third-party checkouts, chat and phone draft orders and payment redirects are named as separate gap causes; the post-upgrade thank-you page is treated as broken until proven; and every fix carries its access level and the client's approval.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Third-party one-click and COD checkouts are common in India and often send their own GA4 purchase event, or none; test one order through each. COD orders confirmed over WhatsApp or phone and entered as draft orders get their own line. Add UPI app redirects to referral exclusions. Name India's data protection law (DPDP) in the consent gate.
