---
name: spot-bot-traffic-in-analytics
description: "A check that separates bot and fake traffic from real buyers in a store's analytics and ad data: compares Shopify, GA4 and ad platform numbers, scores each traffic source on signs of automation, sizes how much bot traffic is bending conversion rate and cost per sale, and lists the filters, segments and exclusions to apply in each tool. Keeps wanted bots (search and AI crawlers) out of the blame and out of the block list. Ends with a cleaned set of key numbers the rest of the team can trust. Use when sessions jump with no sales, conversion rate falls for no clear reason, an ad source sends clicks that never engage, or before any profit ranking of channels."
---

# Spot bot traffic in analytics

**You get:** a bot traffic report (sources scored real, doubtful or bot, with the sessions and share each makes up), a before-and-after table of key numbers (sessions, conversion rate, cost per sale, revenue per session) with bots removed, and a filter list for GA4, Shopify reports and each ad platform, ready to apply after the client's yes.

## When to use

- Sessions spiked with no matching rise in add-to-carts or orders.
- Conversion rate dropped and nothing on the site changed.
- An ad source or placement sends clicks with near-zero time on site.
- Shopify, GA4 and ad platforms disagree by much more than usual.
- Before ranking channels or campaigns on profit, so fake visits do not bend the ranking.

## Not for

- Fake orders and card testing at checkout: use `stop-fake-orders-and-card-testing`.
- Setting up GA4 events and checking purchases against orders: use `set-up-ga4-for-store-and-check-data`.
- Cleaning bad placements from Google display campaigns: use `google-display-placement-cleanup`.
- Explaining a revenue drop overall: use `store-results-drop-diagnosis`.

## What you need

Required (all read access, level 1):

1. **GA4**: sessions, engaged sessions, engagement rate, average engagement time, add-to-carts and purchases by session source and medium, landing page, country, city and device, last 90 days by day.
2. **Shopify reports**: sessions by day, by referrer and by location; orders by day.
3. **Ad platform exports** for the same days: Meta (link clicks, landing page views, purchases by placement); Google Ads (clicks, invalid clicks, conversions by campaign and placement); TikTok if used.
4. **Email platform** click data for the last 30 days if email clicks look high.

Optional: server or CDN logs if the store has a headless front end, robots.txt, a list of known campaigns and launches with dates.

Applying filters, exclusions and segments is level 2 (draft) in each tool, then live with the client's yes. Data filters in GA4 change future data only, so they always need a yes first.

## Before you start: the gates

1. **Purchases are tracked correctly.** Pass when GA4 purchases are within a normal gap of Shopify orders. Fail: fix tracking first (`set-up-ga4-for-store-and-check-data`); bot work on broken tracking misleads.
2. **Know the normal gap.** GA4 already removes known bots automatically from the IAB list and Google research, cannot turn this off and cannot show how much it removed [MEA-6203]. Shopify's session count includes bot traffic GA4 filters, so Shopify sessions run higher [MEA-0012]. A gap alone is not proof of an attack.
3. **Conversion rate uses purchases.** GA4's session key event rate counts any key event; filter to purchase before comparing [MEA-0002].
4. **Wanted bots stay.** Search engine and AI crawlers are distribution. Blocking Common Crawl or AI crawlers removes the store from AI answers [SEC-0001] [SEC-0002].

## Steps

### 1. Build the baseline

For the 4 weeks before the problem: daily sessions in Shopify and GA4, the ratio between them, GA4 engagement rate, add-to-cart rate and purchase conversion rate. This is the store's own normal.

### 2. Find the break

Plot the same numbers by day. Mark the first day the Shopify-to-GA4 ratio, engagement rate or add-to-cart rate moved more than about 30% from the baseline (practitioner default, test it). Check the launch and campaign list: a real launch raises sessions and add-to-carts together; bots raise sessions alone.

### 3. Score each source

For every source and medium, landing page, country and city with real volume, score these signs:

- Engagement rate far below the site average, with average engagement time near zero.
- Add-to-cart rate near zero over hundreds of sessions.
- One city or country with a sudden jump the store does not ship to or advertise in.
- Sessions landing on odd URLs (search pages with junk queries, old URLs, `/cart` direct).
- Referrers that are not real sites, or traffic marked direct that spikes at night in the store's time zone.
- One device, browser version or screen size dominating a spike.

Two or more signs: doubtful. Three or more with no purchases: bot. Count sessions in each group.

### 4. Check the ad platforms

- **Meta:** compare link clicks with landing page views by placement. A large gap on one placement (often the audience network) points at accidental or fake clicks. Exclude that placement in a test, judged on purchases, not clicks.
- **Google Ads:** read the invalid clicks column, which shows clicks Google filtered and did not charge. For display and video placements with clicks but no engaged sessions, hand the list to `google-display-placement-cleanup`.
- **Email:** security scanners click every link; count clicks only from opens that are not machine opens, and exclude bot clicks when judging email results [EML-0011] [EML-0013].

### 5. Size the damage

Recompute with bot and doubtful traffic removed: sessions, purchase conversion rate, revenue per session, and cost per sale for each paid source. Show both versions side by side. If a paid source's cost per sale or revenue per session changes rank after cleaning, flag it to the media buyer and `store-meta-math`. A brand with unmeasured bot traffic should not get a channel profit ranking until this is done.

### 6. Set the filters

- **GA4:** turn on the internal traffic filter if not done [MEA-0003]; add bot sources to the unwanted referrals list where they appear as referrals; build a saved comparison or segment that excludes the bot groups for reporting; note that GA4 data filters cover only internal and developer traffic, so most bot cleaning is done in reports, not at collection.
- **GA4 session timeout:** do not change it to hide bots; raising it merges visits and changes session counts [MEA-0004].
- **Shopify:** report sessions from GA4 when reading conversion rate; use Shopify for orders and revenue.
- **Ad platforms:** placement and location exclusions from step 4, as tests with an end date.
- **Site:** if the bots are hitting forms or checkout, hand to `stop-fake-orders-and-card-testing`. Do not add blanket bot blocking at the CDN; it catches wanted crawlers [SEC-0002].

### 7. India and US notes

- India: spikes from one city often come from a courier or marketplace crawler, or from a cheap traffic source; check the campaign list before calling it bots. WhatsApp link previews can create single-hit visits with no engagement.
- US: data centre traffic (Ashburn, Virginia and similar hosting hubs is a common sign, practitioner default) with zero engagement is usually automated.

### 8. Weekly watch

Every Monday: Shopify-to-GA4 session ratio, engagement rate, add-to-cart rate, and Meta link clicks to landing page views, each against the 4-week average. Alert when any moves more than 30%.

## Checks before you hand it over

- The baseline period and the break date are stated.
- Every source called bot has at least 3 signs and its session count.
- Key numbers are shown before and after cleaning, with the method.
- No search engine or AI crawler is on any block list.
- Every filter or exclusion names the tool, the setting and whether it changes future data.
- Ad exclusions are framed as tests with an end date, judged on purchases.
- Nothing was applied without the client's yes.

## Output

**One-screen summary:** share of sessions that are bot or doubtful, the corrected conversion rate and revenue per session, the paid sources whose ranking changed, and the filters to approve.

**Source scorecard:**

| Source or medium | Landing page | Country or city | Sessions | Engagement rate | Add-to-cart rate | Purchases | Signs (count) | Verdict (real, doubtful, bot) |
|---|---|---|---|---|---|---|---|---|

**Before and after table:**

| Number | Raw | Bots removed | Change |
|---|---|---|---|

**Filter list:** Tool, Setting, Value, Changes future data (yes or no), Approved by, Date.

**Weekly watch:** Week, Shopify-to-GA4 ratio, Engagement rate, Add-to-cart rate, Link click to landing page view ratio, Alerts.

## Common mistakes

- **Treating the Shopify and GA4 gap as an attack.** Gate 2 sets the normal gap [MEA-0012].
- **Conversion rate on any key event.** Gate 3 [MEA-0002].
- **Blocking all bots.** It hides the store from AI answers [SEC-0001]. Step 6 keeps wanted crawlers.
- **Judging ad placements on clicks.** Step 4 judges on landing page views and purchases.
- **Counting scanner clicks in email.** Step 4 excludes them [EML-0013].
- **Changing GA4 settings to make numbers look better.** Step 6 cleans in reports and keeps raw data.

## Sources

- MEA-6203: GA4 excludes known bots automatically; no switch, no count.
- MEA-0002: GA4 key event rate counts any key event.
- MEA-0003: GA4 internal traffic filter and retention.
- MEA-0004: raising session timeout merges visits.
- MEA-0012: Shopify sessions include bots GA4 filters.
- EML-0011: engaged means non-bot clicks and non-privacy opens.
- EML-0013: exclude bot clicks from email attribution.
- SEC-0001: keep Common Crawl unblocked.
- SEC-0002: accidental AI crawler blocks.

What makes this skill ours: the check starts from the store's own normal gap between Shopify and GA4 instead of treating any gap as an attack; each source needs three signs and a count before it is called a bot; key numbers are shown raw and cleaned so profit rankings can be trusted; and wanted AI and search crawlers are never blocked.
