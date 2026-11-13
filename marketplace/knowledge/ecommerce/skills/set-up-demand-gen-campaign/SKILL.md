---
name: set-up-demand-gen-campaign
description: "Sets up a Google Demand Gen campaign for an online store, ready to approve: whether the store is ready for it, the budget worked from its target cost per purchase, audiences (customer lists, lookalikes, custom search-based segments, exclusions), channel choices, image, video and product feed creative to Google's formats, and a test plan that compares Demand Gen with the store's other prospecting (usually Meta) on new customers and gross profit, not platform ROAS. Built paused for the client's yes. Use when a store with stable Search and Shopping wants new buyers before they search, or wants to test Google against Meta for prospecting."
---

# Google Demand Gen campaign setup

**You get:** a paused Demand Gen campaign build sheet (settings, ad groups, audiences, creative list with sizes and copy, product feed link), the budget worked from the store's own target cost per purchase, and a dated 6-week test plan against the store's other prospecting with the rule that decides keep, change or stop.

## When to use

- Search and Shopping are stable and profitable and the store wants buyers before they search.
- The store runs Meta prospecting and wants a second source of new customers.
- The store has product video or strong lifestyle images that Performance Max is not using well.
- An old Video action campaign was upgraded and nobody has checked the new set-up.

## Not for

- Pure YouTube video planning (goal, cuts, view-based campaigns): use `set-up-youtube-ads-for-store`.
- Finding where viewers drop off in existing videos: use `google-video-dropoff`.
- Junk placements in Demand Gen or Display: use `google-display-placement-cleanup`.
- Deciding the overall Meta and Google split: use `cross-channel-budget-reallocation`.

## What you need

Required:

1. **Gross profit per purchase and target cost per purchase** from `store-meta-math`.
2. **Google Ads conversion set-up**: one primary purchase action with real values [MEA-0017]; check with `check-google-ads-conversion-tracking` if unsure.
3. **Creative on hand**: product and lifestyle images (landscape, square and portrait), any product video in horizontal, vertical or square, the logo, and the Merchant Center feed if products should show.
4. **Customer data**: a customer email list export from Shopify (Email, Phone, Country, Total spent, Orders count) if the account may use Customer Match; Google Ads audience lists of site visitors.
5. **Other prospecting results**: Meta Ads Manager export for the last 60 days (Campaign, Spend, Purchases, Purchase value) and Shopify new versus returning orders.

Optional: post-purchase survey answers, past Video action campaign data, top search terms from Search campaigns.

Access: draft access to build the paused campaign; the client approves the budget and launch. Uploading a customer list needs the client's yes and must follow Google's Customer Match policy and the store's privacy notice.

## Before you start: the gates

1. **Core first.** Search and Shopping profitable for at least 30 days with steady purchases. Demand Gen is a layer added once core conversions are stable, not a first campaign. Fail: hand off to `google-ads-first-90-days`.
2. **Cash.** On target CPA bidding, Google recommends a daily budget of at least 10 times the target CPA [GAD-6124]. The client must carry that for six weeks. Fail: do not launch; say what monthly cash would allow it.
3. **Tracking.** Purchase tracking works and sends real order values [MEA-0016]. Fail: fix first.
4. **Creative.** At least 5 distinct images and, ideally, 2 videos with the product shown early. Fail: hand off to `creator-video-script` or `campaign-photo-set` and come back.
5. **Honest creative.** No AI-made person presented as a real customer; testimonials only from real buyers with consent. Claims must pass `product-claims-profile`.

## Steps

### 1. Set the budget and bid

- Target CPA = the store's target cost per new customer from `store-meta-math`. If first orders run at a loss on purpose, use the cost the store's repeat value supports, and say so.
- Daily budget = target CPA x 10 [GAD-6124], rounded up. Six-week test budget = daily budget x 42.
- Start on Maximize conversions or target CPA near the store's real cost per purchase; Google warns against a target far below the historical average [GAD-6124]. Move to value-based bidding once there are 30 or more purchases a month (practitioner default, test it).
- If the account has too few purchases, Google suggests a lighter event such as add to cart [GAD-6124]; only do this with a cap and a rule to switch back, because cheap carts that never buy can fill the report.
- As a share of Google spend, one compilation puts Demand Gen at 10 to 20% in a mature account [GAD-0008]. Treat that as a ceiling until the test says more.

### 2. Choose channels

Demand Gen can serve on YouTube and Shorts, Discover, Gmail, Maps and the Display Network [GAD-6124]. Start with YouTube, Shorts, Discover and Gmail, and leave Display off at launch where the channel controls allow it (practitioner default, test it). Watch Gmail: an opened Gmail ad can count as a click, which can make clicks jump while sales do not [GAD-0055].

### 3. Build audiences, one per ad group

| Ad group | Audience | Notes |
|---|---|---|
| Lookalike | Lookalike segment seeded from buyers (narrow first) | Needs a customer list or buyer audience as the seed |
| Search intent | Custom segment of people who searched the store's best non-brand terms | Take terms from Search campaigns that convert |
| Interest | In-market or custom segment by rival sites or app categories | Broadest; expect higher cost |
| Exclusions | Past 180-day buyers and current site visitors | Applied to all prospecting groups so the test reads new buyers |

Use optimised targeting only after the first two weeks, so the first read shows which audience works.

### 4. Build the creative

- Images: landscape (1.91:1), square (1:1) and portrait (4:5), product clearly visible, little text.
- Video: at least one vertical cut for Shorts and one horizontal; the product in the first seconds; captions on. Use `google-video-dropoff` later to fix where viewers leave.
- Headlines and descriptions: real offer, real proof (review count, delivery promise) from the live site. India: cash-on-delivery or prepaid offer lines only if live; price in rupees as shown on site. US: real shipping and returns terms.
- Product feed: attach the Merchant Center feed, limited to products with stock and good gross profit (custom label), so ads can show products under the creative.
- Final URL: product or collection page, never the home page for a product-led ad.

### 5. Name, tag and load paused

Campaign and ad group names say audience and creative theme, so the test can be read. Load everything paused, with the budget, schedule and end date for the client's approval.

### 6. Plan the test against other prospecting

The question is whether Demand Gen finds new customers at a lower cost in gross profit than the store's next best prospecting, usually Meta.

- **Metric:** new-customer orders and gross profit from the store's own data, not Google-reported ROAS. View-through credit can flatter video-led campaigns; one Meta audit found 30 to 50% of reported ROAS came from views [MEA-0042]. Read click-through and view-through purchases apart.
- **Design (choose one):**
  - Region split: run Demand Gen in matched regions only and compare new-customer orders against the rest, with Meta spend held steady; large brands use clustered geo tests of about 25 days [MEA-0050].
  - Time split for small stores: two weeks off, four weeks on, Meta steady, compare new-customer orders per day (weaker; say so).
- **Side checks:** post-purchase survey answers naming YouTube or Google should move roughly in line with spend share [MEA-0045]; brand searches and direct visits in the test regions; for brands also on Amazon, part of the effect can land there [MEA-0029].
- **Decision rule at week 6:** keep and grow if cost per new customer in gross profit terms is at or below the store's next best prospecting; change audiences or creative if it is within 25% (practitioner default, test it); stop if worse than that or if the test could not be read.

## Checks before you hand it over

- Daily budget equals at least 10 times target CPA, or the gate fail is stated.
- Past buyers and site visitors are excluded from prospecting ad groups.
- Every ad has the formats listed, with copy and offers that match the live site.
- No AI-made person is presented as a customer; claims pass the claims profile.
- The feed attached is limited to in-stock products with known gross profit.
- The test plan has a metric from store data, a design, dates and a decision rule.
- The campaign is paused; nothing spends without the client's yes.

## Output

1. **One-screen summary:** readiness (pass or fail with reasons), daily and six-week budget, audiences, creative count, and the test question and decision date.
2. **Build sheet:** Campaign, Ad group, Audience, Exclusions, Channels, Bid strategy, Target, Daily budget, Start, End, Status (Paused).
3. **Creative sheet:** Ad name, Format, Size or ratio, Asset file, Headline, Description, Call to action, Final URL, Claims check (pass or fail).
4. **Test plan:** Design, Regions or dates, Metric, Data source, Side checks, Decision rule, Read date, Owner.
5. **Week 6 results template:** Arm, Spend, New-customer orders, Gross profit, Cost per new customer, Survey share, Decision.

## Common mistakes

- **Launching before Search and Shopping are stable.** Gate 1 holds it back.
- **A budget too small to learn.** Step 1 uses Google's 10 times target CPA guide [GAD-6124].
- **Retargeting inside a prospecting test.** Step 3 excludes buyers and visitors.
- **Reading Google ROAS as the result.** Step 6 reads new customers in store data.
- **Clicks from Gmail opens mistaken for interest.** Step 2 watches Gmail [GAD-0055].
- **One generic creative for every format.** Step 4 builds each ratio.

## Sources

- GAD-0008: Demand Gen share of a mature Google budget.
- GAD-0055: Gmail opens counted as clicks.
- GAD-6124: Demand Gen placements, 10 times target CPA budget, lighter events.
- MEA-0016, MEA-0017: real order values, one primary purchase action.
- MEA-0029: part of the effect can land on Amazon.
- MEA-0042: view-through credit flatters reported return.
- MEA-0045: survey share should track spend share.
- MEA-0050: clustered geo tests for incrementality.

What makes this skill ours: readiness and budget come from the store's own target cost per purchase and Google's own 10 times rule, so a store that cannot fund a fair test is told before spending; prospecting excludes buyers so the test reads new customers; and Demand Gen is judged against Meta on new-customer gross profit from store data, never Google-reported ROAS.
