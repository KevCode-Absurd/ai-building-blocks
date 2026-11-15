---
name: set-up-youtube-ads-for-store
description: "Plans and builds a YouTube ad campaign for an online store: picks the right campaign goal for the store's stage (sales through Demand Gen, or cheap reach for an explainer), specifies the video cuts to make from one master (vertical Shorts, 15-second, 30 to 60-second demo, 6-second bumper), sets the audience and exclusions, and writes the plan for judging YouTube against store sales: brand search lift, direct visits, survey answers, Amazon spill-over and a region holdout, never views or platform ROAS alone. Built paused for the client's yes. Use when a store wants to start YouTube, has product video sitting unused, or cannot tell if its YouTube spend sells anything."
---

# YouTube ads for a store

**You get:** a one-page YouTube plan (goal, campaign type, budget, audiences), a cut list for the video editor with lengths, ratios and what each cut must show by second, a paused build sheet, and a measurement plan that says how YouTube will be judged on store sales and on what date.

## When to use

- The store has product or demo video and no YouTube ads.
- YouTube ads run but nobody can say whether they sell.
- The product needs showing (how it works, how it fits, before and after) and still images undersell it.
- The store wants reach in a new region or for a launch.

## Not for

- Image plus video prospecting across Discover, Gmail and YouTube: use `set-up-demand-gen-campaign` for the build; this skill hands sales-goal builds to it.
- Diagnosing where viewers leave existing videos: use `google-video-dropoff`.
- Writing the script or shooting: use `creator-video-script` or `mechanism-explainer-video-ad`, and `short-video-edit-pipeline` for the edit.
- Organic YouTube Shorts: use `youtube-shorts-plan`.

## What you need

Required:

1. **Gross profit per purchase and target cost per new customer** from `store-meta-math`.
2. **Video material**: the master video file or raw footage, its length, and whether it shows the product in use.
3. **Tracking**: one primary purchase action with real values in Google Ads [MEA-0017]; YouTube channel linked to Google Ads.
4. **Baseline data, last 8 weeks**: Shopify orders by day and region (Created at, Shipping Province, Customer type), branded search clicks from Search Console or the brand campaign, direct sessions from GA4.
5. **Where else the brand sells**: Amazon, Walmart, Etsy, eBay, Zalando, bol, Mercado Libre, retail.

Optional: post-purchase survey with a "where did you hear about us" question, a YouTube channel with organic views, past video campaign exports.

Access: draft access to build paused; the client approves budget, creative and launch.

## Before you start: the gates

1. **Stage.** Search and Shopping are profitable and stable for 30 days, or the store has a clear reason for reach (launch, new region). Fail: wait; YouTube is not a first campaign for a small store.
2. **Cash.** The client can carry the test budget in step 3 for six weeks without hurting stock buying.
3. **Video that shows the product.** The product appears in the first seconds of every cut. Fail: brief a reshoot via `creator-video-script`.
4. **Honesty.** No AI-made person presented as a real customer; AI presenters are labelled where YouTube or the law requires; testimonials only from real buyers with consent (see `customer-testimonial-videos`). Claims pass `product-claims-profile`.
5. **Measurement possible.** At least 30 orders a week store-wide, or the test must run longer and the read is weaker; say so.

## Steps

### 1. Pick the goal and campaign type

| Store situation | Goal | Campaign type |
|---|---|---|
| Wants purchases from video | Sales | Demand Gen with video ads; Google moved Video action campaigns into Demand Gen, with the last upgrades done by April 2026 (Google Ads Help, Video action campaign upgrade page) |
| Product needs explaining, wants cheap attention before sales ads | Views | Video views campaign, then retarget viewers with Demand Gen |
| Launch or sale, short window, wants reach in a region | Awareness and reach | Reach campaign with bumpers and 15-second cuts, capped frequency |
| Already runs Performance Max with video | Leave video inside it, but check its channel mix | Performance Max can drift into YouTube; one account's return fell about 20% when YouTube rose from 2% to about 10% of spend [GAD-0055] |

Recommend one. Most stores start with Sales through Demand Gen; hand the build to `set-up-demand-gen-campaign` and use this skill for the cuts and the measurement.

### 2. Plan the cuts from one master

| Cut | Ratio | Length | Must show |
|---|---|---|---|
| Shorts | 9:16 vertical | 15 to 35 seconds | Product in hand in the first 2 seconds; one problem, one result; captions |
| In-stream short | 16:9 | about 15 seconds | Product and brand before the skip button appears at 5 seconds; one offer |
| Demo | 16:9 | 30 to 60 seconds | How it works or fits, proof, offer, call to action at the end and on screen |
| Bumper | 16:9 | 6 seconds | Product, name, one line; for reach and reminders |

Rules:
- Brand name and product on screen early; many viewers skip at 5 seconds.
- Captions on every cut; many watch without sound.
- One call to action, matching the landing page.
- Make versions in the languages your buyers use where the store sells in several markets, with the voice-over by a native speaker; prices in the store's own currency as on the site for that market; real shipping and returns terms; payment lines (free returns, buy now, pay later, pay on delivery) only if live.

### 3. Set budget and audiences

- Sales goal: budget by Google's Demand Gen rule, at least 10 times target CPA a day [GAD-6124].
- Views or reach: a fixed test budget the client can lose without harm, for six weeks.
- One agency builds YouTube at about 10 to 15% of Google budget once core campaigns run [GAD-0030]; one brand put about 15% of paid media into YouTube [ADC-0051]. Treat these as ceilings until the test says more.
- Audiences: lookalikes of buyers, custom segments from converting search terms, in-market segments; exclude past buyers from prospecting.
- Frequency cap on reach campaigns: 2 to 3 a week per person (practitioner default, test it).

### 4. Build and load paused

Names carry goal, audience and cut (for example "YT Sales, Lookalike, Shorts 20s"). Load paused with start and end dates.

### 5. Write the measurement plan

YouTube often drives sales that land elsewhere: a viewer searches the brand later, types the URL, or buys on Amazon. Judge it on the store, not on views or click-through.

- **Primary read: region holdout.** Run YouTube in matched regions only and compare total new-customer orders against the other regions for about 3 to 4 weeks [MEA-0050]. Incremental return = extra gross profit in test regions divided by YouTube spend.
- **Side signals, weekly:** branded search clicks and direct sessions in test regions; post-purchase survey answers naming YouTube, which should move toward YouTube's share of spend [MEA-0045]; for brands on Amazon, Amazon sales in the test regions, since YouTube's effect can split roughly evenly between site and Amazon in one brand's data [MEA-0029].
- **Google numbers kept apart:** click-through purchases, view-through purchases and engaged-view purchases in separate columns. Never add them to Search and Shopping results.
- **Decision at week 6:** keep if incremental gross profit covers spend at the store's target; change cuts or audiences if the side signals moved but the holdout did not reach significance; stop if neither moved.

### 6. Watch for leaks while it runs

Weekly: placements (apps and kids content, hand to `google-display-placement-cleanup`), view rate and drop-off by cut (hand to `google-video-dropoff`), frequency, and cost per new customer from store data.

## Checks before you hand it over

- One goal and one campaign type are recommended, with the reason.
- Every cut shows the product in the first seconds and has captions.
- Budget is worked from target cost per purchase or stated as a fixed test the client can lose.
- Past buyers are excluded from prospecting.
- The measurement plan has a holdout or states why not, plus side signals and a decision date.
- No AI-made person is passed off as a customer; claims are checked.
- Everything is paused until the client approves.

## Output

1. **One-screen summary:** goal, campaign type, budget for six weeks, audiences, cuts to make, how it will be judged and when.
2. **Cut list for the editor:** Cut name, Ratio, Length, Second-by-second must-shows, Captions (yes), Language, Call to action, Due date.
3. **Build sheet:** Campaign, Type, Goal, Ad group, Audience, Exclusions, Bid strategy, Daily budget, Frequency cap, Start, End, Status (Paused).
4. **Measurement sheet:** Week, Region (test or control), New-customer orders, Gross profit, Brand search clicks, Direct sessions, Survey share naming YouTube, Amazon sales, YouTube spend.
5. **Decision note template for week 6:** Result, Incremental gross profit, Decision, Next step.

## Common mistakes

- **Judging YouTube by views or click-through.** Step 5 judges on store orders.
- **Adding view-through purchases to the account total.** Step 5 keeps them apart.
- **One long video cut for every placement.** Step 2 makes cuts by ratio and length.
- **Product shown at the end.** Step 2 puts it in the first seconds.
- **Performance Max quietly spending on YouTube.** Step 1 checks its channel mix [GAD-0055].
- **Starting YouTube before core campaigns earn.** Gate 1 holds it back.

## Sources

- ADC-0051: one brand's paid split with YouTube at about 15%.
- GAD-0030: video at about 10 to 15% of Google budget once core runs.
- GAD-0055: Performance Max drift into YouTube and Gmail.
- GAD-6124: Demand Gen placements; 10 times target CPA daily budget.
- MEA-0017: one primary purchase action.
- MEA-0029: YouTube's effect can land on Amazon.
- MEA-0045: survey share should track spend share.
- MEA-0050: clustered region tests to read lift.

What makes this skill ours: it picks the campaign type for the store's stage instead of defaulting to reach; it turns one master video into a cut list an editor can work from by the second; and it judges YouTube on new-customer gross profit through a region holdout with brand search, survey and Amazon side signals, never views.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Make Hindi or regional-language versions where the buyers are, with the voice-over by a native speaker; show prices in rupees as on the site; use cash-on-delivery lines only if live. Count Flipkart and Amazon.in sales as side signals in the holdout.
