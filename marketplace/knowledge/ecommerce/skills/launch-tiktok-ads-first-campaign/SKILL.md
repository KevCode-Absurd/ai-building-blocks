---
name: launch-tiktok-ads-first-campaign
description: "Gets a store from no TikTok ads to a first sales campaign ready for the owner's yes, built like a media buyer would: a pixel and Events API pass on a real order and a plan to judge on store orders, the winners from Meta and organic posts brought in first, audiences from the segments the store's data ranks (broad, no guessed age floor), TikTok-native video weighted to the style that already sells with enough of it to feed the budget, the whole budget planned with ad groups funded to learn from day one, and a 14-day sheet with Scale, Hold, Trim or Cut verdicts and one rule per ad group read on store numbers. Use when a store wants to start TikTok ads, restart a dead account, or replace boosted posts with a real campaign."
---

# First TikTok ads campaign

**You get:** a launch pack: tracking that passes on a real order, the proven concepts brought in first, the audiences the data backs, the ad list weighted to the style that sells, a full budget with each ad group funded to learn, and a 14-day sheet with one rule per ad group on store numbers, ready for the owner's yes.

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
2. **Shopify order export**, last 90 days, for the pre-launch baseline: new customers a day and blended cost per new customer across all paid channels.
3. **What already sells**: the Meta or other ad export with format, angle and store-basis cost per ad, and organic TikTok or Reels posts with views.
4. **Segment data**: who buys, by age, gender, region and product, from store orders and other channels.
5. **Videos**: vertical 9:16 videos with usage rights, or scripts to shoot.
6. **Target country, landing page and the owner's TikTok budget** for the period.

Optional: a customer email list (for an exclusion audience, uploaded by the owner), a post-purchase "how did you hear about us" question with TikTok as an answer, competitor ads from the TikTok Creative Center.

Access: the owner creates the Business Center, ad account and payment method and signs in to install the TikTok app on Shopify; the agent never handles passwords or card numbers. The agent drafts the campaign at level 2. Turning it on, and every budget raise, needs the owner's yes, asked in your message.

## Before you start: the gates

1. **Buyers can be reached.** TikTok ads run only in some countries, and some markets block TikTok or limit ad types. Check that the countries the store ships to are open to TikTok ads and to the objective you need. Fail if none are: use Instagram Reels or YouTube Shorts instead.
2. **Break-even is known.** Fail: compute it first; no budget line can be set.
3. **Budget can learn.** At least one ad group can be funded to its learning bar (step 5), never below about two times the allowed cost per purchase a day or TikTok's $20 floor [ADC-0063]. Fail: optimise to add to cart and say the read is weaker.
4. **Native video exists or is briefed.** Resized Meta ads with small text are not enough.

## Steps

Follow the house rules, chiefly **Org context first**, **Map every signal to an asset**, **Look it up before you decide**, **Only the brief's facts run the business** and **One basis per number**. Before step 1, write the org context (voice, customers' own words, every segment the data ranks with its number) and the signal-to-asset map. Run `node tools/ask-knowledge.mjs` once per signal and once per decision, logged in `context/trace.md`; every figure goes in `context/numbers.json`. Days count from launch (Day 1); a calendar date only when the brief gives one.

The account itself (Business Center with a second admin, ad account in the store's own time zone and currency, payment method with a backup, verified details) is set up by the owner and checked by the agent; time zone and currency are fixed once created.

### 1. Tracking

- Install the pixel and Events API through the official TikTok app for Shopify, at the highest data-sharing level the store's consent rules allow. Place one real order (refund it after). Pass when Events Manager shows one purchase with the right value and currency, not two and not zero. Anything else goes to `tiktok-pixel-and-events-api-check`.
- Tag every ad with UTMs so store orders can be matched. If the brief gives a store-vs-TikTok gap from a past run, use it per ad group; never a midpoint. Otherwise work it from Day 7: store orders tagged TikTok divided by TikTok's purchases.
- Every verdict uses store numbers. TikTok over-claims and UTM orders under-count, so a channel verdict needs two reads that agree: tagged store orders, post-purchase survey share against spend share [MEA-0045], or blended cost per new customer against the pre-launch baseline, since a new channel's effect can show in other platforms [MEA-0040].

### 2. What worked before

- Bring in proven concepts first: the Meta ads, organic posts and Reels whose store-basis cost or views beat the account's usual level. An organic post with about five times the usual views belongs in ads, as a Spark ad [ORG-0035].
- Remake each one natively for TikTok: a fresh hook, first frame and length in the same concept.
- If an old TikTok account had winners, paused ones included, relaunch them first with fresh cuts.

### 3. Audiences

- Start from the org context's best segments: rank who buys by age band, gender, region and product on store data, each with its number. Name the winner.
- Target broad: country and language set, no age floor or interest the data does not support. If interests are used, two or three parent categories at most; stacking 15 raised cost in one fashion account [ADC-0035].
- Steer to the winning segment with creative: people who look like it, its words, its problem.
- Exclude existing customers with a customer file the owner uploads.

### 4. Formats and messaging

- Weight the ads to the style that already sells (demo, problem and fix, creator, founder), and give at least half the ads to it. Add one or two other styles for range; the starter test that works for one agency uses three styles [ADC-0036].
- Volume: each ad needs about 3 times the allowed cost to be judged [ADC-0039]. Ads needed for the first two weeks = new-ad budget for those weeks / (3 x allowed cost). Brief that many; 3 to 6 per ad group is the usual range.
- 9:16, key text inside the safe area, captions on, sound from TikTok's commercial library or original audio.
- A clear hook in the first seconds; a closing spoken call to action is optional, since paid placements show a button and its effect is contested [MCR-0061].
- Any AI-made person, voice or scene is labelled as TikTok's ad policy requires and never presented as a real customer. In the US, fake testimonials are banned, including those spoken by AI avatars [MCR-6021]; the UK (ASA and CMA) and EU consumer rules also ban fake reviews and hidden ads.
- Landing page: the proven page, with the same offer and price as the ad.

### 5. Budget

The plan uses the whole TikTok budget (house rule **Spend plans add up**).
- Learning settles after about 25 results in 7 days [ADC-0063], so the learning bar per ad group = 25 x allowed cost / 7, about 3.6 times the allowed cost a day. Check it also covers ads in the group x 3 x allowed cost / days you will wait, and fund each ad group at the larger figure.
- Ad groups funded = daily budget / that figure, rounded down; extra concepts go in as ads inside those groups. Below one bar, run one ad group and say the read is slower.
- Spend starts on Day 1 once tracking passes; no zero-spend days except those a tracking fix needs.
- A reserve is at most 15%, with a release rule on store numbers the account will hit in the period, for example "release to the best ad group once two reads agree its cost per new customer is under the allowance".
- Objective Sales, website destination, optimised to purchase; lowest-cost bidding first; cost caps only once purchases are steady. TikTok placement only to start. Start manual, so results read per ad.

### 6. Verdicts

From Day 14, one label per ad group, matching its number:
- **Scale** (budget up): two reads agree cost per new customer is at or under the allowance.
- **Hold** (same): reads disagree, or under 7 days since a change.
- **Trim** (lower): cost between the allowance and 1.5 times it, trending down.
- **Cut** (zero): two reads agree cost is above 1.5 times the allowance with no trend down (practitioner default, test it), or an ad spent 3 times the allowed cost with no purchase [ADC-0039].

Early creative reads after about $50 or 1,000 impressions an ad: click-through above 1%, watch time above 25%, CPM in line with the country [ADC-0037]. These flag creative problems; they never set a verdict alone.

### 7. Rules

One rule per ad group, in one line, on store numbers, never on TikTok's reported cost alone. For example: "Scale 20% every 3 to 4 days while store-tagged cost per new customer over 7 days stays under the allowance; Cut to zero if it passes 1.5 times." No edits on Days 4 to 7 while learning, except to stop clear losses.

### 8. The 14-day sheet and hand-over

| Day | Check | Action |
|---|---|---|
| 1 | Ads approved, spend started, TikTok purchases match Shopify | Fix rejections and tracking only |
| 2 to 3 | Early creative reads, cost per click, add to cart | Note problems; Cut ads at 3 times allowed cost with no purchase |
| 4 to 7 | Learning | Leave it |
| 7 | Store-tagged new customers against TikTok's claim | Write the gap |
| 8 to 13 | Daily review via `tiktok-ads-daily-review-and-scale` | Add proven-style ads if fewer than 3 are spending |
| 14 | Verdict per ad group | Apply step 6 |

Run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>` and fix every FAIL. Order the launch steps leverage first: tracking pass, proven concepts, then new styles. A holdout appears only when the brief asks or the two reads disagree.

### 9. Account setup check and layout by budget

Before step 1, run the account setup check. Mark each line done, missing or not sure, with a one-step fix. A missing purchase event or billing address stops the launch.

- **Accounts:** Ads Manager account inside a Business Center (separate from anyone's personal login); the ad account added by ID; each person added separately; the TikTok profile linked to the Business Center and then to the ad account, with the owner holding manage rights and any agency deliver-ads rights only. TikTok Shop linked if the store sells there.
- **Billing:** complete billing address; a card as main method with a backup method; automatic or manual payment chosen on purpose (manual thresholds can stop winners mid-day).
- **Team:** smallest role for each person, two-step sign-in, access limited to the company email domain.
- **Defaults:** location and minimum age set; brand safety on standard inventory; account health good. Per ad: leave "add to ad library" unchecked unless wanted, music sharing off, rights to any music used.

Advice from creators about avoiding bans is not TikTok policy; never use tricks around a ban.

Layout by daily budget (one operator's judgement, keep it as a starting point):

| Daily budget | Ad groups |
|---|---|
| Under 50 | One broad ad group at 20 or more with 3 ads |
| 50 to 99 | One broad ad group at about 50 |
| 100 to 200 | Two to four ad groups at about 50 each, broad first, the same 3 ads in each |

Rather than thin ad groups, run fewer of them [ADC-0063]. Keep campaign budget optimisation off while testing and switch it on only to scale proven ad groups. Name campaigns product, objective, date. Interests, if used, stay at 2 to 3 broad parent categories [ADC-0035]. Once spend allows, add one retargeting ad group: 30-day visitors minus 30-day buyers, auto refresh on, expansion off. Lookalike seeds: 180-day visitors, people who watched a video to the end, and a consented customer file. A four-week ladder changes one thing a week: broad, then one interest, then lookalikes, then stack the winners. Test Smart+ only later, head to head with the same budget and ads for 7 to 14 days, and keep the one with the lower store-basis cost per purchase.

## Checks before you hand it over

- A real test order reached TikTok once with the right value; the gap rule comes from the brief or store orders, never a midpoint.
- Proven concepts from Meta, organic posts or old TikTok winners come first.
- Segments are ranked; targeting is broad, with no unsupported age or interest floor.
- At least half the ads are in the proven style, and the ad count covers 3 times the allowed cost each.
- The whole budget is planned; each ad group is funded to its learning bar; any reserve is 15% or less with a release rule.
- Every verdict label matches its number; each ad group has one rule on store numbers.
- Every ad uses licensed sound and has AI labels where needed; existing customers are excluded.
- The setup check is complete with no missing stop items before any spend.
- Ad group count fits the daily budget table.

## Output

**One-screen summary:** country, budget, allowed cost per purchase, ad groups funded, ads by style, the Day 14 rule, and the one risk.

**Each decision in two lines:** what to do, and why with one number.

**Launch pack** (`tiktok-launch.md`):

1. Tracking pass: Test order, Shopify value, TikTok value, Count, Pass.
2. Ad groups: Ad group, Audience, Daily budget, Ads, Rule.
3. Ad list: Ad name, Concept and source, Style, Sound, AI label.
4. 14-day sheet (`tiktok-first-14-days.csv`) with spend, store new customers, cost per new customer, survey share and the action taken.

Settings and the learning-bar working go in an appendix.

## Common mistakes

- **Starting from scratch.** Step 2 brings in what already sells.
- **A guessed age floor.** Step 3 uses the store's own segments.
- **Too few ads in the winning style.** Step 4 sizes volume to the budget.
- **Test money spread thin.** Step 5 funds fewer ad groups to the learning bar.
- **Rules on TikTok's own cost.** Step 7 reads store numbers.
- **App sounds in ads.** Step 4 uses the commercial library.
- **Opening several thin ad groups on a small budget.** Fewer, fuller ad groups leave learning sooner [ADC-0063].

## Sources

- ADC-0035: stacked interests raised cost; use two or three.
- ADC-0036: a starter test of three styles.
- ADC-0037: early creative diagnosis numbers.
- ADC-0039: judge after three times target cost.
- ADC-0063: learning near 25 results in 7 days; $20 floor.
- MCR-0061: spoken calls to action on TikTok are contested.
- MCR-6021: US ban on fake testimonials, including AI avatars.
- MEA-0040: a new channel's effect can show in other platforms.
- MEA-0045: survey share should track spend share.
- ORG-0035: outlier organic posts belong in ads.

What makes this skill ours: the first campaign starts from what already sells, targets the segments the store's data ranks, funds fewer ad groups to learn from Day 1, and is judged on two agreeing store reads, never TikTok's own count.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. TikTok has been blocked in India since 2020, so an India store can only use TikTok ads to sell to other countries it ships to. For India-only stores, the gate fails: use Instagram Reels or YouTube Shorts instead.
