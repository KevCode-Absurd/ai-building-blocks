---
name: launch-tiktok-ads-first-campaign
description: "Gets a store from no TikTok ads to a first sales campaign ready for the owner to approve: Business Center and ad account set up by the owner with the right time zone, currency and roles, a pixel and Events API pass on a real test order, one website sales campaign drafted with budget sized from the store's allowed cost per purchase, broad targeting, 3 to 6 TikTok-native videos with licensed sound and AI labels where needed, and a day-by-day checklist for the first 14 days read against store orders. Use when a store wants to start TikTok ads, restart a dead account, or replace a boosted-post habit with a proper campaign."
---

# First TikTok ads campaign

**You get:** a launch pack: the account set-up checklist, a pixel pass on a real order, one drafted sales campaign (every setting listed), the ad list with names and sizes, and a 14-day check sheet with what to look at each day and the decision on day 14, ready for the owner's yes.

## When to use

- The store has never run TikTok ads and wants to start.
- An old TikTok account spent money without tracked sales and needs a clean restart.
- The store boosts posts from the app and wants a real sales campaign.
- Meta works and the owner wants a second channel with vertical video already on hand.

## Not for

- Writing the video scripts: use `write-tiktok-ad-scripts`.
- Ads for products sold inside TikTok Shop: use `tiktok-shop-gmv-max-ads`.
- Running creator posts as ads: use `tiktok-spark-ads-with-creators`.
- A deep tracking audit: use `tiktok-pixel-and-events-api-check`; this skill only needs its launch pass.

## What you need

Required:

1. **Allowed cost per purchase** (break-even and target) from `store-meta-math` or `set-ad-budget-from-profit-target`.
2. **Shopify order export**, last 90 days, to check new orders against TikTok during the test.
3. **Videos**: 3 to 6 vertical 9:16 videos with usage rights, ideally in different styles (demo, problem and fix, customer story).
4. **Target country and landing page**: the page that converts best on other channels.
5. **The owner's monthly cap** for TikTok.

Optional: a customer email list (for an exclusion audience, uploaded by the owner), organic TikTok posts with views, competitor ads from the TikTok Creative Center.

Access: the owner creates the Business Center, ad account and payment method and signs in to install the TikTok app on Shopify; the agent never handles passwords or card numbers. The agent drafts the campaign at level 2. Turning it on, and every budget raise, needs the owner's yes.

## Before you start: the gates

1. **Buyers can be reached.** TikTok has been blocked in India since 2020, so an India store can only use TikTok ads to sell to countries it ships to. Fail for India-only stores: use Instagram Reels or YouTube Shorts instead.
2. **Break-even is known.** Fail: compute it first; no budget line can be set.
3. **Budget can learn.** The ad group needs about two times the allowed cost per purchase a day, with TikTok's floor of $20 a day, to have a chance of about 25 purchases in the 7-day learning phase [ADC-0063]. Fail: if that is too much, optimise to add to cart and say the read is weaker, or wait.
4. **Native video exists.** Fail: brief creators with `write-tiktok-ad-scripts` first; resized Meta ads with small text are not enough.
5. **Tracking passes** the launch test in step 2. Fail: do not launch.

## Steps

### 1. Set up the account (owner does, agent checks)

- Business Center created by the owner with a business email; a second admin added so one lost login does not stop the account.
- Ad account with the store's own time zone and currency. Treat both as fixed once created, so set them right the first time.
- Payment method added by the owner, with a backup.
- The agent gets a role at the access level the owner chose (read or draft).
- Business details verified as TikTok asks.

### 2. Run the tracking launch test

Install the pixel and Events API through the official TikTok app for Shopify with the highest data sharing setting the store's consent rules allow. Place one real order (refund it after). Pass when Events Manager shows one purchase with the right value and currency, not two and not zero. Anything else goes to `tiktok-pixel-and-events-api-check` before launch.

### 3. Choose the structure

| Daily budget the store can fund | Structure |
|---|---|
| Under about $100 | One campaign, one broad ad group, 3 to 5 ads |
| About $100 or more | One campaign, two ad groups (broad and one test audience), the same 3 ads in each |

The second row follows one agency's starter test: three styles across two audiences, at least $50 a day per ad group for 3 to 4 days, roughly $300 to $400 [ADC-0036]. Start with a manual campaign so results can be read per ad; try TikTok's automated campaign type later as a side-by-side test once purchases are steady (practitioner default, test it).

### 4. Draft the settings

- **Objective:** Sales, website destination; optimise to the purchase event.
- **Targeting:** country, a sensible age floor, everything else broad. If interests are used, two or three parent categories at most; stacking 15 interests raised cost in one fashion account [ADC-0035].
- **Exclusions:** existing customers, from a customer file the owner uploads.
- **Placement:** TikTok only to start, so results are not mixed with other apps.
- **Budget:** about two times allowed cost per purchase per ad group per day, above the $20 floor [ADC-0063]. Lowest-cost bidding first; cost caps only after the account has steady purchases.
- **Attribution:** keep the default window, but judge on store orders.
- **Schedule:** run all day; no dayparting.
- **Naming:** product, angle, format, date, so results sort later.

### 5. Prepare the ads

- 9:16 video, key text inside the safe area, captions on.
- Sound from TikTok's commercial music library or original audio; trending sounds from the app are not cleared for ads.
- A clear hook in the first seconds; a closing spoken call to action is optional, since paid placements show a button and its effect is contested [MCR-0061].
- Any AI-made person, voice or scene labelled as TikTok's ad policy requires, and never presented as a real customer. In the US, fake testimonials are banned, including those spoken by AI avatars [MCR-6021].
- Landing page: the proven page with the same offer and price as the ad.
- If an organic post beat the account's usual views by about five times, add it as a Spark ad [ORG-0035].

### 6. Write the approval pack

List every setting, the daily and monthly cap, the stop line, and the start date. The owner approves; only then is the campaign switched on.

### 7. Run the first 14 days

| Day | Check | Action |
|---|---|---|
| 0 to 1 | Ads approved, spend started, purchases reaching TikTok match Shopify | Fix rejections and tracking only |
| 1 | Per ad, after about $50 or 1,000 impressions: CTR above 1%, watch time above 25%, CPM in line with the country [ADC-0037] | Note creative problems; do not edit yet |
| 3 | Cost per click and add to cart; purchase cost against the store's own break-even, not a fixed figure [ADC-0037] | Pause ads that spent three times the allowed cost with no purchase [ADC-0039] |
| 4 to 7 | Learning phase: no budget jumps, no targeting edits | Leave it |
| 7 | Store-side new customers from TikTok (UTM and ttclid) against TikTok's claim | Write the gap |
| 8 to 13 | Daily review starts via `tiktok-ads-daily-review-and-scale` | Add 1 to 2 new ads if fewer than 3 are spending |
| 14 | Decision | Continue and scale, fix creative, or stop |

Day 14 decision: continue when store-side cost per new customer is at or under the allowance; fix creative when clicks are cheap but purchases are not; stop when cost is above 1.5 times the allowance with no trend down (practitioner default, test it). Watch Meta during the test too: a new channel's effect can show up in another platform's numbers [MEA-0040].

## Checks before you hand it over

- Time zone and currency match the store.
- A real test order reached TikTok once with the right value.
- Ad group budget is at least $20 and near two times the allowed cost per purchase.
- Targeting is broad or uses three interests at most.
- Every ad uses licensed sound and has AI labels where needed.
- Existing customers are excluded.
- The 14-day sheet has a day-14 rule written in money.
- Nothing went live without the owner's yes.

## Output

**One-screen summary:** country, daily and monthly cap, allowed cost per purchase, number of ads, the day-14 rule, and the one risk.

**Launch pack** (`tiktok-launch.md`):

1. Account checklist: Item, Done by, Status.
2. Tracking pass: Test order, Value in Shopify, Value in TikTok, Count, Pass or fail.
3. Campaign settings table: Level (campaign, ad group, ad), Setting, Value, Reason.
4. Ad list: Ad name, Angle, Style, Length, Sound source, AI label yes or no, Landing URL with UTM.
5. 14-day sheet (`tiktok-first-14-days.csv`): Day, Spend, Impressions, CTR, Watch time, CPM, Add to cart, TikTok purchases, Store new customers, Cost per new customer, Action taken, Approved by.

## Common mistakes

- **Budget too thin to learn.** Gate 3 sizes it from allowed cost per purchase.
- **Copying the agency's $30 purchase line.** Step 7 uses the store's own break-even.
- **Stacked interests.** Step 4 keeps targeting broad.
- **Editing during learning.** Step 7 keeps days 4 to 7 hands off.
- **App sounds in ads.** Step 5 uses the commercial library.
- **Trusting TikTok's purchase count alone.** Day 7 compares it with store orders.

## Sources

- ADC-0035: stacked interests raised cost; use two or three.
- ADC-0036: starter test of three styles and two audiences.
- ADC-0037: early creative diagnosis numbers.
- ADC-0039: judge after three times target cost.
- ADC-0063: ad group budget near two times cost per purchase, $20 floor.
- MCR-0061: spoken calls to action on TikTok are contested.
- MCR-6021: US ban on fake testimonials, including AI avatars.
- MEA-0040: a new channel's effect can show in other platforms.
- ORG-0035: outlier organic posts belong in ads.

What makes this skill ours: the budget comes from the store's own allowed cost per purchase instead of TikTok's suggestion or an agency's fixed number; launch waits for one real order to reach TikTok exactly once; India stores are told plainly that TikTok cannot reach Indian buyers; and day 14 is decided on store-side new customers with licensed sound and AI labels checked before approval.
