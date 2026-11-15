---
name: meta-event-match-quality-fixes
description: "Raises how well Meta matches a store's events to real people, event by event. Reads the 0 to 10 event match quality score and the customer information coverage for each funnel event (view content, add to cart, checkout, purchase), finds the missing or broken match keys, ranks the fixes by how much they help the purchase signal Meta optimises on, and writes exact pixel and Conversions API fixes for Shopify, WooCommerce or custom builds. Gives an honest range for what poor matching costs instead of a made-up figure, verifies each fix in Shopify's customer events and Meta's test tools, then re-measures after 7 days. Use after store-meta-capi, or when match quality is OK or Poor."
---

# Better match quality, event by event

**You get:** a match quality table for every funnel event, a ranked fix list with hours and owners, and a before and after table measured on day 0 and day 7.

Meta can only learn from a purchase it can tie to a person who saw an ad. Match quality says how often it can. This skill finds which keys each event is missing, fixes the ones that matter for buying signal first, and proves the fix a week later.

## When to use

- `store-meta-capi` confirmed events arrive and deduplicate, and match quality is the remaining weak spot.
- Events Manager rates Purchase or Initiate Checkout as Poor or OK.
- After moving checkout, changing the Shopify app's data sharing level, or adding a consent banner.
- Someone claims a paid tool will "fix match quality" and the store wants to check free fixes first.

## Not for

- Missing, doubled or wrongly valued purchase events: use `store-meta-capi` first; match quality on a broken event stream is meaningless.
- Which attribution setting to trust: use `store-meta-attribution`.
- Google Ads enhanced conversions: use `google-ads-account-audit`.

## What you need

Required (read access, level 1):

1. **Events Manager screenshots or partner access** ("Use events dataset") for the store's dataset, last 7 days: for each of PageView, ViewContent, AddToCart, InitiateCheckout and Purchase, the event match quality score, and the customer information parameters list with the share of events carrying each key.
2. **How events are sent**: Shopify Settings, Apps and sales channels, the Facebook and Instagram app and its data sharing level; Settings, Customer events (app pixels and any custom pixels); any Google Tag Manager or server container; for WooCommerce, the Meta plugin settings; for custom sites, the developer's event spec.
3. **Checkout fields**: which of email, phone, name and address the checkout asks for, and at which step.
4. **The reconciliation table** from `store-meta-capi`: Meta purchase events per 100 store orders.

Optional: consent banner settings and opt-in rate, share of orders through a third-party checkout or chat ordering.

Access: level 1 to diagnose. Level 2 to write the developer spec or a paused tag. Changing the app's data sharing level, theme code, checkout fields, consent settings or publishing tags changes the live store: the client does it or approves it. Never ask for passwords or API tokens.

## Before you start: the gates

1. **Gross profit per purchase.** Not needed to diagnose. Needed only if a paid tool is proposed (step 8). If missing, run `store-meta-math` then.
2. **Cash and capacity.** Not a gate for free fixes. Developer hours are the cost; state them per fix.
3. **Event stream trusted.** Pass when Meta receives about one Purchase per store order and deduplication works, per `store-meta-capi`. Fail: stop and run that skill. Data integrity comes before any tuning [ADC-0028].

## Steps

### 1. Score every funnel event

Record for each event: match quality (0 to 10, and Meta's label), and the share of events carrying each key. Meta labels the score; any fixed target is a practitioner default. Upper-funnel events are mostly anonymous visitors, so they score lower by nature. Judge each event against what the store can know at that moment:

| Event | Keys the store can usually send | Realistic aim, practitioner default |
|---|---|---|
| PageView, ViewContent | fbp, fbc, IP, user agent, external ID for logged-in or returning visitors | OK |
| AddToCart | as above, plus email or phone if the visitor is known | OK to Good |
| InitiateCheckout | as above, plus email or phone once entered | Good |
| Purchase | email, phone, name, city, postcode, country, external ID, fbp, fbc, IP, user agent | Good to Great |

Meta does not publish how many points each key adds. Any table of "points per key" is a guess and two such tables rarely agree, so rank keys by the coverage Meta shows and by step 4, not by invented weights.

### 2. Find the gap per key

For Purchase and InitiateCheckout, list each key below 90% coverage, practitioner default. Then find why, in this order:

- **Email or phone low on Purchase:** the server event is not sending them. On Shopify, data sharing below Maximum is the usual cause. On custom builds, the field is missing from the server payload.
- **fbc low:** the click ID from the ad link is lost. Check that the landing URL keeps fbclid through redirects and caching rules: a CDN rule that strips query strings to speed up caching destroys it; keep tracking parameters out of cache keys instead of removing them [SPD-0003]. Check that the consent setup does not block the cookie before the visitor accepts. With consent mode, a pixel fired on page load can miss the landing view after the visitor accepts; fire it on the consent update [MEA-0007].
- **fbp low on server events:** the browser ID is not passed to the server event. In server-side tag setups, values must travel with the event to the server tag, the same way the event ID must [MEA-0006].
- **External ID missing or mismatched:** send the store's own customer ID on both browser and server events so returning buyers match across devices. It must be the same value, formatted the same way, on both sides; a hashed email on one side and a customer number on the other matches nothing.
- **IP and user agent missing on server events:** the server sends its own address instead of the shopper's.

### 3. Check the format, not just the presence

Meta's hashing rules (Meta documentation): email lowercased and trimmed; phone as digits with country code, no plus sign, spaces or leading zero; names lowercased; postcode without spaces for most countries; then SHA-256. Do not hash fbc, fbp, IP or user agent. Hashing external ID is recommended but optional; what matters is that both sides do the same. A key that is present but formatted wrong does not match, often with no error shown, so also read the Diagnostics tab for malformed or rejected parameter warnings. The Shopify app and the WooCommerce plugin format and hash for you; test this only on custom or tag-manager builds.

### 4. Rank the fixes

Order fixes by: Purchase first, then InitiateCheckout, then AddToCart, then the rest. Within an event, email and phone first, then fbc and fbp, then external ID, then address fields, then IP and user agent. Put free platform settings before developer work, and developer work before any paid tool.

### 5. Estimate what poor matching costs, honestly

Lost signal makes Meta underrate the ads: if 100 real sales show as 70, a 3% conversion rate looks like 2% and the store loses auctions it should win [MEA-0046]. But the same source found the gains from paid server-side tools too small to separate from normal weekly noise.

The score is not a share of missed sales. Never multiply reported purchases by the gap between today's score and a target score; that turns a quality label into a made-up loss. Report a range instead:
- **Upper bound:** the share of store orders Meta never receives, from `store-meta-capi`, applied to monthly spend. This is the most that signal loss could be costing.
- **Lower bound:** zero measurable change, which is common.
- Where Events Manager shows its own estimate of extra conversions from adding a key, record it as "Meta's estimate", not a store fact.

### 6. Write the fixes

Per fix: what changes, where (Shopify app setting, Customer events, theme, checkout, tag container, developer code), who does it, effort in hours, and the expected change in coverage for that key.

Common fixes:
- Shopify: raise the Facebook and Instagram app data sharing to Maximum (client approves). Remove custom pixels in Customer events that duplicate the app's events.
- Ask for email or phone early in checkout so InitiateCheckout carries it.
- Keep fbclid on the landing URL; stop redirect chains or link shorteners that drop it.
- Send the hashed customer ID as external ID on browser and server events.
- Remove any test event code left in a live tag; it sends real events to the test screen [MEA-0005].
- Never fix matching by removing the browser pixel. Server events add to it; they do not replace it.

### 7. Verify each fix the same day

- Shopify: Settings, Customer events shows the Meta app pixel as connected, with no duplicate custom pixel for the same events.
- Meta Test Events: place test orders the way real buyers do (one arriving from an ad link so fbclid is present, one guest checkout, one with phone only) and confirm browser and server Purchase both arrive, deduplicated, with email or phone, fbp and fbc present.
- Remove the test code once done [MEA-0005].

### 8. Re-measure after 7 days

Match quality reflects recent events, so wait at least 7 days after the last fix, practitioner default. Record day 0 and day 7 scores and coverage per event, plus Meta purchase events per 100 store orders. Only then decide on any paid tool: the Conversions API Gateway only copies events after the browser pixel fires, so blocked pixels stay lost and recovery is about 1 to 2% [MEA-0001]. Spend on measurement tools around 1% of ad spend at most, and only if they plausibly make spend 5% better [MEA-0036].

### 9. Phone-first stores

In some markets many orders carry a phone number and no email, especially with pay on delivery or chat ordering. Make phone the first key: send it with the buyer's country code (for example 1 for the US and Canada, 44 for the UK, 61 for Australia), digits only, on every checkout and purchase event. If orders arrive through a third-party checkout or chat ordering, confirm those orders also send a server Purchase with phone; they often bypass the store's own checkout events.

## Checks before you hand it over

- The event stream gate passed, with the `store-meta-capi` date.
- Every funnel event has a score, a label and key coverage.
- Each gap has a cause, not just "low".
- Fixes are ranked Purchase first, free before paid.
- The cost of poor matching is a range with its method, not a single number.
- Each fix has an owner, an effort and a verification step.
- Day 0 and day 7 numbers sit side by side, or the day 7 date is booked.
- No live setting changed without a client yes.

## Output

**Summary, one screen:** Purchase match quality now and target, the three fixes that matter most, effort in hours, the cost range of poor matching, and the re-measure date.

**Table "Match quality by event":** Event, Score, Label, Email %, Phone %, fbc %, fbp %, External ID %, Name and address %, IP and user agent %, Main gap, Cause.

**Table "Fix list":** Rank, Event, Key, Fix, Where, Who, Hours, Expected coverage after, Verified (date), Day 7 result.

**Table "Before and after":** Event, Day 0 score, Day 7 score, Day 0 Purchase events per 100 orders, Day 7.

## Common mistakes

- **Chasing a high score on PageView.** Anonymous visitors cannot match well. Step 1 sets aims by event.
- **Fixing matching before the event stream works.** Gate 3 sends it to `store-meta-capi`.
- **Keys present but badly formatted.** Step 3 checks format, and the same external ID on both sides.
- **Ranking keys by made-up points.** Meta publishes no weights; step 1 ranks by coverage.
- **Promising spend saved.** Step 5 gives a range and says gains are often unmeasurable [MEA-0046].
- **Buying a tool first.** Step 8 puts free fixes first [MEA-0001].
- **Judging the fix the next morning.** Step 8 waits 7 days.

## Sources

- ADC-0028: data integrity first.
- MEA-0001: Gateway recovers about 1 to 2%.
- MEA-0005: a test code left live hides real events.
- MEA-0006: values must travel to the server tag.
- MEA-0007: consent setup can miss the landing view.
- MEA-0036: measurement tools at about 1% of spend.
- MEA-0046: lost signal lowers Meta's estimated action rate; tool gains are hard to measure.
- SPD-0003: keep tracking parameters out of cache keys rather than stripping them.

What makes this skill ours: realistic aims per funnel event instead of one score for all; a cause for every missing key; an honest cost range in place of a made-up loss; and a same-day check in Shopify customer events and test events, then a booked 7-day re-measure.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Many orders carry a phone number and no email, especially COD. Send phone with the 91 country code, digits only, on every checkout and purchase event.
