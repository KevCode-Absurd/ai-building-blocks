---
name: video-ad-retention-fix
description: "Find where each of a store's video ads loses people (the opening seconds or later) and say exactly which seconds to re-edit. Sorts every video with enough spend into keep, strong opener but weak body, weak opener but strong body, or cut, using store-side cost per purchase against the store's own target first and attention second, so a video that sells is never 'fixed' into a worse one. Reads the drop between the 25%, 50%, 75% and 95% marks to place the leak in seconds, compares each video with the account's own medians by placement, and gives a specific edit per video. Use when video ads spend but do not convert, before a re-edit round, or when a winner starts to fade. Read access only."
---

# Video ad retention fix for an online store

**You get:** a keep, fix or cut verdict for each video ad with spend, second-by-second edit sheets for the ones to fix, and an approval list, saved as a report and a verdicts CSV.

## When to use

- A video ad spends but store cost per purchase is above target.
- The team cannot agree whether the opener or the body is the problem.
- Before a re-edit round, to give the editor second-by-second instructions.
- A winning video starts to fade and the team wants to know which part tired first.
- After a batch of new videos, to see which openers and bodies to reuse.

## Not for

- Statics and carousels: use `store-meta-creative-review`.
- Writing new openers once the diagnosis says "weak opener": use `ad-opener-writer`.
- Checking that every part of the story is present: use `ad-structure-map`.
- Campaign budgets after the sort: use `store-meta-budget`.

## What you need

Required:

1. **Meta Ads Manager export, ad level, video ads, last 14 to 30 days:** Ad ID, Ad name, Amount spent, Impressions, Reach, Frequency, 3-second video plays, ThruPlays, Video plays at 25%, 50%, 75%, 95% and 100%, Video average play time, Link clicks, Purchases (7-day click). Break down by Placement (Feed versus Reels and Stories).
2. **Store orders** tied to each ad (`utm_content` = ad ID) or the order export, same dates.
3. **Target cost per purchase (CPP)** and gross profit per purchase (GPP), from `store-meta-math`.
4. **Each video's length in seconds** and the video file or preview.

Optional: a transcript or shot list per video; TikTok export with 2-second and 6-second views, average watch time and completion rate.

Missing 2: use Meta 7-day click purchases and mark "reduced confidence". Missing 4: read length from the preview; without it, drops cannot be placed in seconds.

**Access:** level 1 (read). Pausing, budget moves and uploading re-edits need level 3 and a yes.

## Before you start: the gates

1. **Money.** *Pass:* target CPP from GPP. *Fail:* sort on attention only and label every verdict "not money-checked"; no cut verdicts.
2. **Enough data.** *Pass:* the video spent at least 3x target CPP and had at least about 5,000 impressions (practitioner default, test it). *Fail:* mark it "learning" [ADC-0039].
3. **Tracking.** *Pass:* Meta 7-day click purchases are not above store orders. *Fail:* use store orders only.
4. **Clean window.** No sale inside the dates, or read CTR and cost per click only [MCR-0068].

## Steps

### 1. Compute the rates

Per video and placement:

- **Hook rate** = 3-second plays / impressions. Did the opening stop people?
- **Hold rate** = ThruPlays / 3-second plays. Meta counts a ThruPlay at 15 seconds or the end, whichever comes first, so for videos of 15 seconds or less hold rate is a completion rate. For longer videos, also use the quartiles.
- **Quartile drops:** 25%, 50%, 75% and 95% plays, each divided by 3-second plays.
- **Link CTR** and **store CPP** = spend / store orders.

Use one definition for every video. Do not mix ThruPlay-based and quartile-based hold rates across ads.

Show the numerator and denominator beside every rate, with the dates and the column name used, so anyone can recheck it. A missing column or a zero denominator is "not calculable", never a zero. If someone hands you 3-second plays divided by reach, label it "plays per person reached": repeat plays can push it over 100%, so it is not the share of people who watched. A 6-second video's ThruPlay rate is not comparable with a 45-second video's; compare quartiles in seconds instead.

### 2. Set the bar from the account, not the internet

For each placement group (Feed; Reels and Stories), take the median hook rate and hold rate of videos that passed the data gate. Strong = at or above the median; weak = under 0.8x the median (practitioner default, test it). Reels and Stories hook rates run higher than Feed, so never compare across groups.

If the owner has their own cutoffs, use them and say so; if not, say the medians are the starting bar. Any video within 10% of a bar, or just past the data gate, is marked "unsure" rather than forced into strong or weak (practitioner default, test it). A forced label on thin data reads as more certain than it is.

### 3. Sort on money first, attention second

| Verdict | Rule |
|---|---|
| Keep | Store CPP at or under target, whatever the attention numbers |
| Strong opener, weak body | Store CPP above target, hook strong, hold weak |
| Weak opener, strong body | Store CPP above target, hook weak, hold strong |
| Cut | Store CPP above 1.5x target at 5x target CPP spend, or 0 to 1 purchases at 3x, with both hook and hold weak [ADC-0039] |
| Watch | Store CPP above target but both rates strong: the page, offer or audience is the issue |

Two traps before you trust a verdict:

- High CTR with few purchases is a false winner; a big gap between all-clicks CTR and link CTR shows it [MCR-0029].
- A strong hook can pull the wrong viewers; Meta then learns to find more of them [MCR-0026]. If hook rate is high, store CPP poor and link CTR low, treat the opener as off-target, not strong.

### 4. Place the leak in seconds

Convert each quartile into seconds (25% of a 40-second video is second 10). The steepest drop between neighbouring marks is the leak. Watch the video at that point with the sound off and on, and name what happens there: a long talking stretch, a cut to a logo, the first price mention, a jump from story to pitch.

Only about 15% of viewers reach the second half of a typical video, so the first half matters most [MCR-0077]. The biggest exits come where the feeling of being sold jumps suddenly [MCR-0027].

To name the cause, map the script around the leak. Label each line hook, bridge, body, proof or call to action, and rate how sold-to the viewer feels on it from 0 (not at all) to 5 (a direct pitch). A jump of 2 or more between neighbouring lines is a broken bridge [MCR-6738]. Then check these causes in order:

| What sits at the leak | Likely cause | Look at |
|---|---|---|
| The line right after the opener | A stock opener stapled onto a body it does not lead into [MCR-6715] | Write a bridge line for that opener |
| A shot held 10 seconds or more with nothing new | Pacing; a talking head with no cutaway [MCR-6624] | Add a cut, overlay or close-up every 1.5 to 3 seconds [MCR-6800] |
| The first time the product is named or shown | The pitch arrived before the problem and the reason were clear | See the note below before moving anything |
| A slow, product-led first 8 to 9 seconds | The ad only suits warm buyers [MCR-6633] | Cut straight to the first interesting line for cold traffic |
| A curiosity gap left open for 20 seconds or more | Viewers never learn what the ad is about | Give the why and the benefit early |
| The price said aloud | Price shock with no frame | Frame it per use or against what it replaces |

**Do not move the product earlier just because the curve dips there.** A later reveal keeps fewer viewers but usually sells better to the ones who stay [MCR-6654]. Move it only when store CPP, not attention, says the reveal is the problem.

### 5. Write the fix

**Strong opener, weak body.** Keep the first 3 seconds exactly. Re-edit from the leak:

- Cut every 3 seconds or so in the first half; state benefits before features [MCR-0077].
- Smooth the jump into the pitch: add one line of how it works before naming the product for cold, problem-aware viewers [MCR-0014].
- Check the opener and body speak to the same buyer; an attention grab followed by a feature list serves nobody [MCR-0015].
- For premium products, keep the product out of any rough phone footage and show it cleanly later [MCR-0010].

**Weak opener, strong body.** Keep the body. Make 3 to 5 new openers on the same body [MCR-0076]; 2 to 4 is enough when budget is tight [MCR-0013]. Show the topic in the first frame [ORG-0017]. When reviving a tired winner, shoot new openers with a different person rather than recutting old footage [MCR-0047]. Send the brief to `ad-opener-writer` and `first-frame-design`. Each new opener needs its own bridge into the body; never stitch 20 openers onto one body with no join line [MCR-6715]. Before paying to test them, the store can post the cuts as Instagram trial reels with the call to action removed, read the retention graphs, and put only the best few into the account [MCR-6664].

**Signs by symptom**, for when the sort is unclear:

| Sign | Look at |
|---|---|
| Few watch past 3 seconds | The opener: who it calls in and whether it shows the topic |
| They stay for the opener, then leave | The bridge, or a problem beat written as a list |
| Watched, few link clicks | The promise, the offer or the call to action |
| Clicks, few purchases | The landing page match and the price said aloud |
| Fading after a week or two | New openers on the same body, then a new reason to buy |
| Cheap clicks, then refunds or complaints | The promise is bigger than the product; rewrite the promise, not the edit |

**Cut.** Pause with a yes. Log the concept key so the team does not remake it; the problem is the concept, not a part.

**Watch.** Send the landing page to `store-meta-landing` and check the offer against the page.

### 6. Rank the work by money

Rank fixes by gross profit at stake per month = monthly spend on the video / target CPP x GPP x the share of that spend you expect to recover. Use 25% recovery for body re-edits and openers unless the store's own past re-edits say otherwise (practitioner default, test it). Body re-edits on high-spend videos usually come first; new openers are cheaper per test.

## Checks before you hand it over

1. Every verdict used store CPP or says why it could not.
2. Hook and hold use one definition across all videos and are compared within placement groups.
3. No video under the data gate has a verdict other than "learning".
4. Every fix names the seconds to change and the seconds to keep.
5. No video at or under target CPP is sent for a fix.
6. Pauses and uploads are a numbered approval list, not done.
7. The plain answer ("improve your hook") would not beat it: each fix is specific to one video.
8. Every rate shows its numerator, denominator and column name; nothing missing was filled with a zero.
9. Videos near a bar or on thin data say "unsure", and no product reveal was moved earlier on attention alone.

## Output

1. **One-screen summary:** videos by verdict with spend, the top three fixes with gross profit at stake, and what to make next.
2. **Video table:** Ad ID, Ad name, Placement, Length (s), Spend, Store purchases, Store CPP, Target CPP, Hook rate, Hold rate, Account median hook, Account median hold, Leak (seconds), Verdict, Fix.
3. **Edit sheets**, one per video to fix: Keep (seconds), Change (seconds), What happens at the leak, The edit, New opener count.
4. **Approval list** for pauses and uploads.

Save as `VIDEO-RETENTION.md` and `video-verdicts.csv`.

## Common mistakes

- **Fixing a video that sells.** Step 3 keeps anything at or under target CPP.
- **Judging hooks against internet benchmarks.** Step 2 uses the account's own medians by placement.
- **Mixing two hold definitions.** Step 1 fixes one.
- **Calling a curiosity hook strong when it pulls non-buyers.** Step 3 checks link CTR and store CPP.
- **Recutting the same footage to revive a winner.** Step 5 asks for a new person on camera.
- **Re-editing by feel.** Step 4 places the leak in seconds before any edit.

## Sources

- ADC-0039: judge at 3x and 5x target CPA.
- MCR-0010: keep the premium product out of rough footage.
- MCR-0013: 2 to 4 hooks per body.
- MCR-0014: add mechanism seconds before the product.
- MCR-0015: attention hook with a feature body is a mismatch.
- MCR-0026: hooks should filter for buyers.
- MCR-0027: sudden jumps to the pitch cause drop-offs.
- MCR-0029: high-CTR false winners.
- MCR-0047: new hooks by a new person revived a winner.
- MCR-0068: sale periods corrupt creative reads.
- MCR-0076: 4 to 5 openers per ad.
- MCR-0077: fix the first half first.
- MCR-6624: break up any long shot with nothing new.
- MCR-6633: a slow product-led start keeps an ad warm-only.
- MCR-6654: a late product reveal sells better to those who stay.
- MCR-6664: pre-test cuts as trial reels without the call to action.
- MCR-6715: stitched hooks break at the bridge.
- MCR-6738: script the bridges; let product awareness rise slowly.
- MCR-6800: a new clip every 1.5 to 2 seconds.
- ORG-0017: show the topic in the first frame.

What makes this skill ours: the sort uses store-side cost per purchase against the store's own target before attention, so a selling video is never re-edited; bars come from the account's own medians by placement, with one hold definition; leaks are placed in seconds from the quartile drops; and fixes are ranked by gross profit at stake per month.
