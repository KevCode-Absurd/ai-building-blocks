---
name: check-google-ads-conversion-tracking
description: "A pass or fail check of a store's Google Ads conversion tracking against its real orders: which purchase actions exist and which one is primary, whether order values are real and in the right currency, duplicates from the Shopify app, Tag Manager and GA4 imports firing together, enhanced conversions, consent mode, and how Google's purchase count and value compare with Shopify orders day by day. It adds adjustments for cancelled, refunded and returned orders, failed deliveries and pay-on-delivery orders that never pay. Ends with a fix list in order and a verdict on whether bidding can be trusted. Read access only. Use before any Google budget change, Smart Bidding switch or audit, after a theme or app change, or when Google and Shopify numbers disagree."
---

# Google Ads conversion tracking check

**You get:** a one-page pass or fail sheet of 10 tracking checks with the evidence for each, a 14-day reconciliation table of Google purchases against Shopify orders, a verdict (trust, trust with caution, or do not bid on this), and a numbered fix list for the client to approve.

## When to use

- Before raising Google budget, switching to Smart Bidding or setting a target ROAS.
- Google Ads and Shopify disagree on purchases or revenue.
- After a theme change, checkout change, new tracking app or Tag Manager edit.
- First step of taking over an account, before `google-ads-account-audit`.

## Not for

- Setting up GA4 events and channel groups: use `set-up-ga4-for-store-and-check-data`.
- Meta pixel and Conversions API: use `store-meta-capi`.
- UTM naming across channels: use `set-up-utm-tracking-for-all-channels`.
- Deciding how much each channel really drives: use `blended-channel-profit-view`.

## What you need

Required (read access, level 1):

1. **Google Ads conversion actions list**: Goals, then Conversions, Summary, with columns Conversion action, Source, Category, Optimization (primary or secondary), Count (one or every), Value settings, Click-through window, Status, Enhanced conversions.
2. **Google Ads daily report, last 30 days**: Day, Conversions (by conversion time), Conv. value (by conversion time), All conv., with a segment by Conversion action.
3. **Shopify order export, same 30 days**: Name, Created at, Financial Status, Fulfillment Status, Subtotal, Shipping, Taxes, Total, Discount Amount, Payment Method, Cancelled at, Source.
4. **How tags are installed**: Shopify Google and YouTube channel app, Google Tag Manager, a tracking app, or hard-coded; Shopify Customer events settings.
5. **Markets served**, to check consent rules.

Optional: GA4 purchases by day and by source, Tag Assistant recording of a test order, report of cancellations, refunds, returns and failed deliveries.

Access: read only. Fixes need draft or publish access in Google Ads, Shopify or Tag Manager, and the client's yes for each.

## Before you start: the gates

1. **Clean order data.** Test, staff and fully cancelled orders are removed from the Shopify export. Fail: remove them first or every comparison is off.
2. **Same time zone and currency.** Google Ads account time zone and currency match the store's, or the difference is noted and converted.
3. **Consent known.** For buyers in the European Economic Area or UK, consent mode must be in place for Google's ads features; check with the store's consent tool. No legal ruling here.
4. **No live changes during the check.** Note any tag change in the last 14 days; it splits the comparison.

## Steps

### 1. List every purchase-like action

Mark each action as one of: Shopify app purchase, Tag Manager or site tag purchase, GA4 imported purchase, other (add to cart, begin checkout, page view).

- **Check 1, one primary purchase.** Exactly one purchase action is primary; every other purchase-like action is secondary. Only primary actions fill the Conversions column and feed bidding; GA4-created conversions arrive as secondary by default [MEA-6125]. Two primary purchases double count [MEA-0017].
- **Check 2, the right source is primary.** Prefer the Google Ads tag (the Shopify app's or the site tag) over a GA4 import; GA4 imports as primary undercount by about 10 to 20% in practitioner audits [MEA-0017] [GAD-0042].
- **Check 3, count setting.** Purchase counts "Every"; lead-style actions count "One".
- **Check 4, no micro-events primary.** Add to cart, begin checkout and page views are secondary, unless the client chose a lighter event on purpose and it is written down.

### 2. Check the values

- **Check 5, real values.** Value uses the order's real amount, not a fixed number. Fixed values stop target ROAS working [MEA-0016].
- **Check 6, consistent definition.** Decide whether value includes tax and shipping, then check it matches. Average Google value per purchase should be within 10% of the matching Shopify average for the chosen definition (practitioner default, test it). A gap of exactly the tax rate or the shipping fee shows which is included.
- **Check 7, currency.** The tag sends the store currency; multi-currency stores send the presented currency correctly.
- Margin-adjusted values are better only when per-SKU costs are reliable; wrong margins mislead bidding more than plain revenue [MEA-0016].

### 3. Check enhanced conversions and consent

- **Check 8, enhanced conversions on** for the primary purchase action, with diagnostics showing data received. The tag hashes the buyer's email, phone, name or address with SHA256 before sending [MEA-6126].
- Consent: in markets that need it, consent mode is set and the store's notice covers ad measurement.

### 4. Reconcile with Shopify, day by day

For 14 days, by conversion time (not click time, which under-counts recent days [GAD-0035]):

| Day | Shopify orders | Google purchases (primary) | Ratio | Shopify value | Google value | Value ratio |
|---|---|---|---|---|---|---|

- **Check 9, never above the store.** Google purchases must never exceed Shopify orders on any day. Above 100% means duplicates: two tags, a thank-you page reload counted twice, or the order status page firing again. Fail.
- A steady ratio is good. A ratio that jumps on one date points to a change that day; look at the change history.
- Google only counts orders after an ad interaction, so a ratio well under 100% is normal. A sudden fall to near zero is a break.

### 5. Find duplicates and gaps

Common causes, checked in this order:
- The Shopify Google channel app and a Tag Manager tag both send purchases to the same action or two primary actions.
- An old hard-coded tag in theme files still fires.
- Purchase fires on page load of the order status page, so it repeats on revisits.
- After a checkout upgrade, old checkout scripts stopped firing; tags must use Shopify's Customer events or the app.
- Transaction ID is missing, so Google cannot remove duplicates.

**Check 10, transaction ID sent** with every purchase, so repeats are removed.

### 6. Returns, refunds and failed deliveries

Google counts a purchase when it is placed, but some orders are later cancelled, refunded, returned or never delivered; pay-on-delivery orders, where a market offers them, are often refused at the door. Plan conversion adjustments: upload retractions for cancelled and undelivered orders and restatements for partial refunds and returns, matched by transaction ID, on a weekly schedule (Google Ads conversion adjustments, Google Ads Help). If uploads are not possible yet, report Google's figures alongside the store's kept-order rate and lower targets by that rate. If the Google Ads invoice adds VAT or another tax the store cannot claim back, add it to ad cost when judging return.

### 7. Give the verdict

- **Trust:** checks 1, 5, 9 and 10 pass and the ratio is steady.
- **Trust with caution:** one of checks 2, 6, 7 or 8 fails; bidding can continue, fixes go first in the list.
- **Do not bid on this:** check 1, 5, 9 or 10 fails. Pause any target ROAS change or budget increase until fixed, and recheck 7 days after the fix, since Smart Bidding may show Learning for up to 7 days after big changes [MEA-6125].

### 8. Campaign goals, normal gaps and late-data traps

- **Check campaign-level goals too.** A campaign can override the account default and bid on add to cart or a GA4 import. Open each campaign's goal setting.
- **Add-to-cart bidding exception.** Only a high-ticket store with about 8 to 20 purchases a month may bid on add to cart for signal, and then only until purchases are enough.
- **Normal gaps.** GA4 against Google Ads differing by 10 to 30% is normal. Investigate above about 40%, a gap that flips direction, a sudden change in a stable gap, or any platform reading exactly zero. Browser-only tracking typically loses 10 to 30% of conversions to blockers, Safari cookie limits and device switching.
- **Do not judge the last 3 days.** Conversions post back to the click date and keep arriving; line up the conversion action, date basis, time zone, window and scope before comparing.
- **A tag firing is not a conversion arriving.** Preview proves the tag ran; only the destination platform proves receipt. Absence of a browser tag is not absence of tracking: ask whether a server or native integration (the Shopify Google channel, server-side tagging) already sends purchases.
- **Shopify checkout change.** Shopify removed Additional Scripts and script tags on the Thank you and Order status pages for all remaining stores on 26 August 2026. Tracking that stopped in late August 2026 should be checked there first.
- **Refund asymmetry.** Google supports conversion adjustments for refunds; where those are not uploaded, high-return stores read Google value too high.
- **Server-side tagging** is a practitioner default above about 50,000 a month of Google spend, not a must below it.
- Label every finding observed, reported or inferred.

## Checks before you hand it over

- Every purchase-like action is listed with its source and primary or secondary status.
- The reconciliation uses conversion-time columns and clean Shopify orders.
- Each of the 10 checks has pass or fail and the evidence (screenshot or row).
- The verdict follows the rule in step 7, not judgment alone.
- Each fix names where it is made and who makes it.
- Stores with real levels of returns, refunds or failed deliveries have an adjustment plan.
- No setting was changed during the check.
- Campaign-level goals were opened for every spending campaign, not only the account default.
- No verdict rests on the last 3 days of data.

## Output

1. **One-screen summary:** verdict, the one or two causes behind it, the fix order, and the recheck date.
2. **Checks sheet:** Check number, Check, Pass or fail, Evidence, Fix.
3. **Conversion actions table:** Action, Source, Category, Primary or secondary, Count, Value setting, Enhanced conversions, Keep or change.
4. **Reconciliation table:** the step 4 columns for 14 days, with averages.
5. **Fix list for approval:** Number, Fix, Where (Google Ads, Shopify, Tag Manager, theme), Owner, Access needed, Client yes.

## Common mistakes

- **Comparing on click-date columns.** Step 4 uses conversion time [GAD-0035].
- **GA4 import left as the primary purchase.** Step 1 moves it to secondary [MEA-0017].
- **Two primary purchases from the app and Tag Manager.** Step 5 finds them.
- **A fixed value on every purchase.** Step 2 fails it [MEA-0016].
- **Counting refused, undelivered or refunded orders as sales.** Step 6 retracts them.
- **Changing bids the same week as fixing tags.** Step 7 waits for the recheck.
- **Calling a 20% GA4 gap broken.** Up to about 30% is normal; investigate patterns, not size alone.

## Sources

- GAD-0035: recent days under-count on click-date columns.
- GAD-0042: GA4 imports as primary miss conversions; common leaks.
- MEA-0016: real order values and enhanced conversions.
- MEA-0017: one primary purchase; GA4 import undercounts; two primaries double count.
- MEA-6125: primary versus secondary actions; learning after changes.
- MEA-6126: enhanced conversions send hashed buyer data.

What makes this skill ours: it reconciles Google with the store's own orders day by day on conversion time, with a hard rule that Google can never exceed the store; the verdict is rule-based and tells the client when not to bid; and cancelled, refunded and undelivered orders are retracted instead of counted as sales.

## Selling in India

- COD orders are counted by Google when placed, but many are refused or come back as RTO. Upload retractions for them weekly, matched by transaction ID, or lower targets by the delivered-order rate until uploads work.
- Add GST on the Google Ads invoice to ad cost when judging return, unless the store claims it back.
