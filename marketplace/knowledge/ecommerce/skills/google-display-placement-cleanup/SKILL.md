---
name: google-display-placement-cleanup
description: "Stops a store's Google Display, Demand Gen and Performance Max money going to junk apps, made-for-ads sites, unviewable slots and accidental clicks. Sorts every placement into one bucket using store-side sessions, viewability and gross profit, never view-through credit, then builds one shared exclusion list, app-category exclusions and account-level content settings so every campaign, including new ones, is covered, with a dated log that grows each cycle. Ends with a call on the channel itself. Read access only; the client approves each exclusion. Use it when Display clicks jump without sales, or on a regular cycle on any account running Display."
---

# Display placement clean-up

**You get:** a placement table sorting every Display, Demand Gen and Performance Max placement into a bucket, plus exclusion files for placements and app categories and an exclusions log, ready to upload.

Display ads appear on millions of sites and apps. Some send clicks from children tapping a game, from pages built only to show ads, or from slots nobody can see. Those cost the same as real ones. This skill finds them, blocks them once for every campaign, and keeps the block list growing.

## When to use

- Weekly on accounts spending meaningfully on Display, Demand Gen or image-heavy Performance Max; monthly on small ones. New junk apps appear all the time.
- Clicks jumped but store sessions and sales did not [GAD-0055].
- Display click-through looks far too good for the category.
- A new Display or remarketing campaign has run 14 days.
- The brand worries about where its ads appear.

## Not for

- Search terms on Search and Shopping: use `google-search-term-mining`.
- Performance Max channel drift as a whole: use `google-pmax-diagnostics`; this skill blocks the placements once Display is worth keeping.
- YouTube video performance: use `google-video-dropoff`.
- Meta placements: use `store-meta-deep-dive`.

## What you need

Required, read access (level 1):

1. **"Where ads showed" report** (placements), last 30 to 90 days, per campaign. Columns: Placement, Placement URL, Type (website, mobile app, YouTube channel, YouTube video), Campaign, Impressions, Viewable impr., Clicks, CTR, Cost, Conversions, Conv. value, View-through conv.
2. **Current exclusions**: shared exclusion lists, account-level placement exclusions, app category exclusions, content suitability settings.
3. **GA4 sessions by placement.** Add the free ValueTrack parameter {placement} to the tracking template or final URL suffix (for example utm_content={placement}), then read GA4 by session manual ad content: Sessions, Engaged sessions, Average engagement time, Purchases. If not yet set up, set it up now and use campaign-level GA4 data meanwhile.
4. **Gross profit per purchase**, from `store-meta-math`.
5. **The audience the store sells to** (age, interests), from the client or `store-meta-brand-dna`.

Optional: Shopify orders with UTM fields to confirm purchases store-side.

Missing input: ask once. Without placement-level sessions, use CTR, viewability and conversions only, mark exclude calls "reduced confidence", and still block obvious junk.

## Before you start: the gates

1. **Money gate.** Gross profit per purchase known. Fail: judge on cost per purchase against the account target and say so.
2. **Tracking gate.** Purchases counted once with real values [MEA-0017]. View-through conversions never keep a placement: view-through credit inflates reported returns heavily (on Meta, audits find 30 to 50% of ROAS from view-through [MEA-0042]). Fail: judge on sessions and click-through purchases only.
3. **Scope gate.** Check that no Search campaign has the Display Network option on; it is a common leak [GAD-0042]. If on, turning it off is the first fix.
4. **Small-channel caution.** Small, warm remarketing campaigns look strong because they reach people who would buy anyway [MEA-0040]. Judge remarketing on store-side orders, not platform return.

## Steps

### 1. Build the placement table

Merge placements across campaigns; add GA4 sessions per placement. Compute:

- Session match = GA4 sessions / Google clicks. Roughly 70 to 100% is normal; far below means accidental clicks, bots or Gmail opens counted as clicks [GAD-0055]. Practitioner default, test it.
- Viewable rate = viewable impressions / impressions.
- Engagement rate = engaged sessions / sessions.
- Profit after ads = click-through purchases x gross profit per purchase minus cost.
- Minimum to judge = cost of at least 1x gross profit per purchase; it scales with the store's margin instead of a fixed amount. Practitioner default, test it.

Shopify sessions include bots that GA4 filters [MEA-0012], so use GA4.

### 2. Sort into buckets

First match wins.

| Bucket | Rule | Action |
|---|---|---|
| Junk app | Mobile game, kids' app or utility app (flashlight, VPN, cleaner), or any app with session match under 30% | Exclude |
| Made for ads | Thin site full of ads, slideshow pages, sessions under 10 seconds with high CTR | Exclude |
| Unviewable | Viewable rate under about 50% with cost past the minimum (practitioner default) | Exclude |
| Wrong audience | Content clearly for people who do not buy (children's content for an adult product, unrelated languages) | Exclude |
| Brand safety | Content the client does not want beside the brand | Exclude, and set the matching content exclusion |
| YouTube in Display | YouTube channel or video placements in a Display campaign | Exclude here; run video in a video campaign judged by `google-video-dropoff` |
| Loser | Past the minimum, no click-through purchases, profit after ads below zero | Exclude |
| Keeper | Click-through purchases with profit after ads above zero, or engaged sessions that add to cart | Keep; consider a managed placement campaign |
| Watch | Below the minimum | Keep; recheck next cycle |

High CTR is a warning, not a win: a placement with several times the Display average CTR and low engagement is almost always accidental clicks.

### 3. Exclude whole categories where the pattern repeats

When 5 or more junk apps share one app category, exclude the category instead of app by app (practitioner default, test it). Common store-side choices: games, kids and family, utilities, unless the store sells to those buyers.

### 4. Build one shared list

- Keep one placement exclusion list in the Shared library (for example "Store junk placements") and apply it to every Display, Demand Gen and video campaign. Add the same placements at account level so Performance Max is covered where the account allows; check the current Help for which campaign types each level reaches.
- Set account-level content suitability: excluded content types and sensitive categories the client chose.
- Keep `exclusions-log.csv`: placement, bucket, date added, spend that cycle, who approved. Each cycle adds to the same list, so new campaigns are protected on day one.
- Review the log each quarter; remove an entry only if a keeper was blocked by mistake.

### 5. Call the channel

After exclusions, recheck each campaign:

- If placements with no click-through purchases still take over about 30% of a campaign's spend (practitioner default), the targeting is wrong, not just the placements: review audiences and creative.
- If a campaign has no click-through purchases at all over 30 days past the minimum spend, recommend pausing it and rethinking targeting rather than more exclusions.
- If Display (or Display inside Performance Max) still loses money after 60 days, narrow it: remarketing only, managed placements only, or a feed-only Performance Max that keeps spend on Shopping [GAD-0048] [GAD-0006]. Move freed budget through `google-smart-bidding-budget`.

## Checks before you hand it over

- Every Search campaign was checked for the Display Network option.
- Every exclude call shows its rule and numbers (session match, viewability, cost, purchases).
- No placement with click-through purchases and positive profit after ads is excluded.
- View-through conversions are not used to keep any placement.
- The shared list applies to every Display, Demand Gen and video campaign; the account-level copy is noted.
- Spend across buckets adds up to the report total.
- Nothing is excluded or paused without the client's yes; drafts only at level 2.

## Output

**One-screen summary first:** spend reviewed, spend on junk, made-for-ads, unviewable and losing placements (amount and share), placements and categories to exclude, keepers worth a managed campaign, and the channel call.

**Table "Placements":** Placement, Type, Campaign, Impressions, Viewable rate, Clicks, CTR, Cost, GA4 sessions, Session match, Engagement rate, Click-through purchases, Profit after ads, Bucket, Action.

**Files:** `placement-exclusions.txt` (one URL or app ID per line), `app-category-exclusions.txt`, `exclusions-log.csv`.

## Common mistakes

- **Trusting CTR.** High CTR on an app is often thumbs. Step 1 checks session match.
- **Keeping placements on view-through credit** [MEA-0042].
- **Excluding campaign by campaign.** New campaigns start unprotected. Step 4 uses one shared list plus account level.
- **Fixed spend lines.** They ignore the store's margin; the minimum scales with gross profit.
- **Leaving Display on inside Search** [GAD-0042].
- **Endless exclusions on a campaign with no buyers.** Step 5 calls the campaign itself.

## Sources

- GAD-0006, GAD-0048: feed-only Performance Max keeps spend on Shopping.
- GAD-0042: Display enabled in Search is a common leak.
- GAD-0055: click spikes from YouTube and Gmail opens.
- MEA-0012: Shopify sessions include bots that GA4 filters.
- MEA-0017: one primary purchase action.
- MEA-0040: small and warm channels look better in-platform than they are.
- MEA-0042: view-through credit inflates reported returns.

What makes this skill ours: placements are judged on store-side sessions through a free {placement} tag, viewability and gross profit, never on view-through credit; spend lines scale with the store's margin; one shared list plus account level and category exclusions protect every campaign; and the skill ends with a call on whether the campaign should run at all.
