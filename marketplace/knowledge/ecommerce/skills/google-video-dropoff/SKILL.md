---
name: google-video-dropoff
description: "Shows where viewers leave a store's YouTube and Demand Gen video ads, scores each video against the account's own videos of the same format, and places it in one diagnostic bucket (weak opening, weak middle, weak ending, too long, worn out, wrong audience or working) with a time-coded edit. Judges every video on purchases and store-level sales, not views: click-through and view-through purchases stay apart, brand search, direct visits, new customers and marketplace sales are checked, and a regional holdout is the only proof of lift. Read access only; the client approves any change. Use it monthly on Google video spend, or before making new video ads."
---

# YouTube and Demand Gen video drop-off

**You get:** a video scorecard placing each YouTube and Demand Gen ad in one diagnostic bucket, an opening test table, a verdict on video spend, and time-coded edit briefs for the videos worth fixing.

A video ad loses viewers second by second, and where it loses them tells you what to fix. But a video that holds viewers and sells nothing is still a bad ad, so this skill reads both: the drop-off curve and what happened in the store.

## When to use

- Monthly, on any account spending on YouTube or Demand Gen; a quick weekly wear-out check where video spend is heavy.
- Before briefing new video ads, to learn which openings and lengths hold the store's buyers.
- A video has high views and low sales, or the reverse.
- The owner asks whether YouTube is worth its spend.

## Not for

- Meta or TikTok video: use `store-meta-creative-review`.
- Writing new concepts and scripts: use `store-meta-concepts` with these findings.
- Junk YouTube channels inside Display: use `google-display-placement-cleanup`.
- Performance Max video assets and channel drift: use `google-pmax-diagnostics`.

## What you need

Required, read access (level 1):

1. **Video report**, last 30 to 90 days, per ad: Ad name, Video, Duration, Campaign type and format (in-stream, in-feed, Shorts, bumper, Demand Gen), Impressions, Views, View rate, Video played to 25%, 50%, 75%, 100%, Clicks, CTR, Cost, Conversions, Conv. value, View-through conv., Avg. CPV. Pull the same for the prior period.
2. **Gross profit per purchase**, from `store-meta-math`.
3. **Store-side sales by week**: Shopify orders (new and returning), GA4 sessions by channel (Paid Video, Organic Search, Direct), and brand search volume (brand campaign impressions or Search Console brand queries).

Optional: YouTube Studio second-by-second retention, Amazon sales by week if the brand sells there, post-purchase survey answers on where buyers heard of the brand.

Missing input: ask once. Without store-side data, score retention only and label the business verdict "not proven".

## Before you start: the gates

1. **Money gate.** Gross profit per purchase known. Fail: score retention only; no keep or cut call.
2. **Tracking gate.** One primary purchase action [MEA-0017]. Click-through and view-through purchases sit in separate columns; view-through credit can make up a large share of reported returns [MEA-0042]. Fail: fix before any spend call.
3. **Volume gate.** At least about 1,000 views (2,000 impressions on Demand Gen) before a curve means anything. Practitioner default, test it. Below that: "too early".
4. **Cash gate.** Video often pays back more slowly than Search. The client states the most they will spend before a verdict, and by when.

## Steps

### 1. Build the curve and the comparison set

For each video, retention at 25, 50, 75 and 100% (played to that point / impressions; pick one base and keep it). Add the Studio curve where available to find the exact second of the steepest drop.

Compare only like with like: in-stream with in-stream of similar length, Shorts with Shorts, Demand Gen with Demand Gen. Demand Gen in feeds usually shows lower view rates and higher CTR than in-stream, so one benchmark for both misleads. Use the account's own median per set, not a public average.

### 2. Place each video in one bucket

Check in this order; first match wins.

| Bucket | Sign | Edit |
|---|---|---|
| Worn out | Heavy impressions (practitioner default: 50,000 or more) and view rate down over 25% against its own earlier weeks | Refresh the opening or replace; keep the body if it still holds |
| Weak opening | View rate or 25% retention well below the set's median | Rebuild the first 5 seconds: the reason to care first, not the logo [MCR-0077] |
| Too long | Over 60 seconds and 25% retention below median (not for Shorts) | Cut a 15-second and a 6-second version from the strongest moment |
| Weak middle | Fine to 25%, steep loss from 25% to 75% | Cut slack; move the best proof earlier; show the product working |
| Weak ending | Holds to 75% but few clicks or purchases | Make the ask plain: offer, price cue, where to buy, on screen and spoken; put it in by the halfway point and again at the end |
| Wrong audience | Retention fine, CTR and purchases low after one edit | Change targeting or the buyer the video speaks to |
| Working | At or above median retention and profit after ads at or above zero | Keep; make variants of the opening |

Most viewers never reach the second half of a video ad (one practitioner estimate is about 15% on paid social [MCR-0077]), so fix the first half first.

### 3. Test openings, not whole videos

The opening decides who stays. Treat it as three levers: spoken words, on-screen text, first image [MCR-0028]. Make 3 to 5 openings on the same body and run them as separate ads [MCR-0076]. Judge openings on 25% retention and click-through purchases, bodies on 25% to 75%. Practitioner default, test it.

### 4. Judge on money, not views

Profit after ads = click-through purchases x gross profit per purchase minus cost. View-through purchases stay in their own column and never go into a keep decision without a test.

Then read the store. YouTube's effect often lands elsewhere: brand searches, direct visits and, for brands also on Amazon, Amazon sales; one measurement source finds YouTube's sales split about 1:1 between site and Amazon [MEA-0029], and upper-funnel spend often shows its lift in another channel's numbers [MEA-0040]. Check the weekly trend in brand search, direct sessions and new-customer orders in weeks when video spend rose or fell.

To prove lift, run a holdout: switch video off (or on) in a matched set of regions for 3 to 4 weeks and compare new-customer revenue with the rest [MEA-0033] [MEA-0050]. Incremental return = revenue lift / spend in the test regions. Only this decides a big budget change.

### 5. Rank by profit per thousand impressions

Revenue or profit per thousand impressions ranks videos fairly when reach differs; view counts do not. On TikTok Shop, sales per 1,000 views varied more than 100x across top videos [MCR-0046]; the same logic holds on YouTube. Add the cost of making each video: a cheap video with average results can earn more than an expensive one [MCR-0023].

### 6. Decide

- Working: keep; raise only after a holdout or a clear store-side lift.
- Weak opening, middle, ending or too long: edit, relaunch as a new ad, recheck in 14 to 21 days.
- Worn out: refresh now.
- Wrong audience: change targeting once; if still weak, cut.
- Nothing works on money after two rounds: move spend back to Search and Shopping, keep video for remarketing.

## Checks before you hand it over

- Each video has a curve, one bucket, and the second or quartile where it fails.
- Each comparison set is one format and similar length, and is named.
- Click-through and view-through purchases sit in separate columns.
- Every keep or cut call shows profit after ads and the store-side check.
- Any claim of lift names the holdout, or says "not proven".
- Videos under the volume gate are "too early", not judged.
- Nothing is paused, launched or changed without the client's yes.

## Output

**One-screen summary first:** video spend, click-through purchases, profit after ads, the store-side signal (brand search, direct, new customers), the verdict on video (keep, narrow, test with holdout, cut), and the three edits worth most.

**Table "Video scorecard":** Video, Format, Length, Impressions, View rate, 25%, 50%, 75%, 100%, vs set median, Click-through purchases, View-through purchases, Cost, Profit after ads, Profit per 1,000 impressions, Bucket, Edit.

**Table "Opening tests":** Body, Opening, 25% retention, CTR, Purchases, Winner.

**Edit briefs:** per video to fix, the time code, what to cut or move, the new first 5 seconds in words and on-screen text, and cut-down lengths where needed.

## Common mistakes

- **Judging on views.** Step 4 judges on profit after ads.
- **Defending spend with view-through.** Keep it apart [MEA-0042]; prove lift with a holdout.
- **One benchmark for every format.** Step 1 compares like with like.
- **Fixing the ending first.** Few viewers get there [MCR-0077].
- **Cutting video on platform numbers alone.** Its sales can land in brand search or on Amazon [MEA-0029].
- **Running one video until it dies.** The worn-out check catches it.

## Sources

- MCR-0023: compare creative on gross profit after production cost.
- MCR-0028, MCR-0076: an opening is three levers; cut several openings per ad.
- MCR-0046: rank creative on revenue per thousand views.
- MCR-0077: most viewers never reach the second half.
- MEA-0017, MEA-0042: one purchase action; keep view-through apart.
- MEA-0029, MEA-0040: video sales land on Amazon and in other channels.
- MEA-0033, MEA-0050: regional holdouts measure lift.

What makes this skill ours: every video is judged on profit after ads with view-through kept out; drop-off is compared within one format against the account's own median; every bucket ends in a time-coded edit; store-side signals are read before any cut; and a regional holdout is the only proof of lift.
