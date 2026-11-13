---
name: prelaunch-ad-check
description: "Check a draft ad (video or static, any platform) before any money is spent on it, and say pass or fail on six things: the muted first seconds, whether each claim matters to the buyer, clarity, proof, the call to action and its landing page, and policy and size. Every fail comes with the fix. Claims are checked against what the store can prove, the price and offer against the live page, and the hook against the buyer it should filter for. Runs by hand with a printed rubric or automatically with any vision model, and logs each verdict next to the ad's later store-side results so the checks get sharper over time. Use before launching any new ad, before a batch goes to Ads Manager, or when a designer or tool hands back finished files."
---

# Pre-launch ad check

**You get:** a pass or fail verdict on six checks for every draft ad, fix notes for each failing line or frame, a prelaunch log CSV and a list of claims the owner must prove or drop.

A cheap gate that stops weak or risky ads before they take spend. It judges the draft against the buyer, the store's proof and the live page, not against taste.

## When to use

- A new ad (video or static) is finished and about to be uploaded.
- A batch from a designer, creator or image tool comes back and needs a yes or no per file.
- An ad is being reused on a new platform or placement.
- A sale ad needs its price, dates and offer checked against the site.
- The team wants a repeatable check that learns from what later sold.

## Not for

- Judging ads that already have spend and results: use `store-meta-creative-review`.
- Writing new concepts or copy from scratch: use `store-meta-concepts`.
- Checking the landing page itself in depth: use `store-meta-landing`.
- Checking a whole month's batch for duplicates and test budget: use `monthly-ad-batch-sprint`.

## What you need

**Required**

- The draft ad files: MP4 or MOV for video, PNG or JPG for statics, at the size it will run.
- The ad copy as it will run: primary text, headline, description, CTA button, on-screen text, and the voiceover script for video.
- The landing page URL the ad will point to.
- The store's proof table: each claim the store may make, its source (reviews export, lab report, supplier spec, press link) and the date checked. `store-meta-brand-dna` builds this.

**Optional**

- Target cost per purchase for the product (from `store-meta-math`).
- The buyer group and awareness stage the ad was briefed for.
- The prelaunch log from earlier runs (`prelaunch-log.csv`).

**When something is missing.** No proof table: ask once for the reviews export (CSV with rating, body, date, reviewer name) and any lab or spec documents; until then, mark every claim "unproven" and fail the proof check. No landing URL: fail the CTA check. No brief: infer the buyer and stage from the ad and say so.

**Access.** Read only. The check never uploads, edits live ads or spends. Fixed files go back to the owner, who approves launch.

## Before you start: the gates

1. **Gross profit per purchase known for the product in the ad.** Needed to judge any offer the ad shows. Fail: run the check, but mark the offer line "not judged" and send the owner to `store-meta-math` before launch.
2. **Cash and capacity.** Fixes must be possible with the people and tools the store has this week. Fail (no designer, no editor): limit fixes to text, crop and order changes that a free editor such as Canva free, Photopea or CapCut can make, and say which fixes need a reshoot.
3. **Tracking good enough to learn.** The recalibration step needs store-side purchases per ad (Shopify orders by UTM or discount code, or Meta purchases that track within about 20% of store orders, practitioner default, test it). Fail: run the check, log verdicts, but skip recalibration until tracking passes `store-meta-capi`.
4. **The product is live.** In stock, at the price the ad shows, on the URL it links to. Fail: stop; the ad cannot launch.

## Steps

### 1. Prepare what the checker sees

- Video: export frames at 0.0, 0.5, 1, 2 and 3 seconds (`ffmpeg -i ad.mp4 -vf fps=2 -t 3 f%02d.png`, free) and the muted first 3 seconds as a clip.
- Static: the file at full size and a copy shrunk to phone feed width (about 400 px wide) for the glance test.
- Capture the landing page today: price, offer, stock, shipping line. Note the date.

### 2. Test 1: the muted first seconds

Watch or look with sound off, as most feed viewers do.

- The first frame shows the product, the problem or the person using it, not unrelated footage; viewers decide in about half a second [ORG-0017]. Holds for short vertical video; a deliberate pattern-break opener passes only if the next second connects it.
- The opening text carries the hook. On paid video, copy does most of the hook's work and should read at about grade 5 to 8 [MCR-0063], unless the format is music-led, where audio counts for more.
- Hook text is 5 to 8 words; fail past 12 [ORG-0016]. This band describes viral Reels, not a controlled test, so treat 9 to 12 as a fix, not a fail, for expert niches.
- The hook speaks to the buyer, not everyone: a broad curiosity hook trains delivery toward non-buyers [MCR-0026]. Fail if the hook would stop people who could never buy.
- Static: in the shrunk copy, a stranger can say what the product is in 3 to 4 seconds, or the ad is a deliberate curiosity gap sent to a page that explains [MCR-0024].

### 3. Test 2: does each claim matter to the buyer

List every claim on screen, in copy and in voiceover. For each, write the buyer outcome it leads to. A spec with no outcome a buyer would feel fails; rewrite it as the outcome, keeping the spec as proof. Benefits come before features [MCR-0077].

### 4. Test 3: clarity

- One message and one awareness stage per ad; mixing a product-aware image with problem-aware copy fails both groups [MCR-0056].
- For video aimed at cold buyers, the benefit lands in the first half, because few viewers reach the second half [MCR-0077].
- Strike filler: vague praise words with no number or proof behind them. Replace with a specific or delete.
- Strike the "it's not X, it's Y" pattern; buyers read it as AI copy [MCR-0016].
- Read the script aloud. If it sounds like a brand talking about itself rather than a person telling a friend, rewrite the line (practitioner default, test it).

### 5. Test 4: proof

- Every number, rating, review count, award, press mention and result claim has a row in the proof table, dated, and matches the live site today.
- Reviews show a name and source; press logos carry the outlet's own quote, since bare logos and anonymous reviews now read as fake [LPG-0037].
- No AI-made person is presented as a customer. A testimonial must come from a real customer with permission.
- Health, weight, money or personal-attribute angles do not imply the viewer has the condition ("your hair loss") [MCR-0020].

### 6. Test 5: call to action and destination

- The ad's job fits its destination: a curiosity ad goes to a page that explains (listicle, advertorial, quiz); a clear product ad can go to the product page [MCR-0030]. Holds for cold traffic; retargeting ads can go straight to the product.
- Price, currency, offer, end date, shipping line and cash-on-delivery availability match the page capture exactly.
- The CTA button names the next step on that page (Shop Now for a product page, Learn More for an advertorial).
- If an offer is shown, its break-even ROAS has been recomputed at that discount depth [OFF-0016].

### 7. Test 6: policy and size

- Size and ratio are right for the placement (feed 4:5 at 1080 x 1350; Stories and Reels 9:16 at 1080 x 1920; TikTok 9:16). On 9:16, nothing that must be read sits in roughly the top 14%, bottom 35% or side 6% (Meta Reels guidance; check the current Ads Manager template). TikTok's right-side buttons and bottom caption need similar clearance; check TikTok's current safe-zone overlay.
- Platform AI rules: realistic AI people or scenes follow the platform's current AI disclosure rules.
- Fake urgency fails: no countdown, "only X left" or "ends tonight" unless true on the page today. In India, false urgency is a listed dark pattern under the 2023 consumer protection guidelines.

### 8. Run it automatically (optional)

Give any vision-capable model the frames, the copy, the proof table, the page capture and the rubric below as JSON. Ask it to return, per check, pass or fail, the exact line or frame that proves it, and a fix. Then verify every fail and at least two passes yourself; models miss small type and misread prices. The rubric:

| Check ID | Test | Hard or soft |
|---|---|---|
| T1 | Muted first seconds | Soft |
| T2 | Claims matter to the buyer | Soft |
| T3 | Clarity, one message, one stage | Soft |
| T4 | Proof, every claim sourced | Hard |
| T5 | CTA, offer and page match | Hard |
| T6 | Policy, size, safe zones | Hard |

### 9. Give the verdict

- **Ready:** all six pass.
- **Fix, then ready:** only soft fails, each with a fix the team can make with the tools named in gate 2.
- **Do not launch:** any hard fail. Fix and run the check again.

### 10. Log it and learn

Append one row per ad to `prelaunch-log.csv`. Once the ad has run, fill in its results from `store-meta-creative-review`. Read results on at least 3 times target cost per purchase of spend [ADC-0039], at ad set level where the ad shares an ad set [ADC-0059], and treat a high CTR with few purchases as a weak ad, not a winner [MCR-0029].

After about 30 launched ads with results (practitioner default, test it), compare winners and losers per check. A soft check that never separates them becomes advisory. A pattern common in losers that the check passed becomes a new check. Hard checks are never loosened. Record each change and its date at the top of the log.

## Checks before you hand it over

1. Every one of the six tests has pass or fail with the line, frame or source that proves it.
2. Every fail has a concrete fix, and each fix is possible with the store's people and tools.
3. Every claim in the ad appears in the proof table with a date, or the ad is marked "Do not launch".
4. Price, offer and stock match a page capture dated today.
5. Model verdicts were checked by eye: all fails and at least two passes.
6. Nothing was uploaded, edited live or launched.
7. The log has one row per ad with the verdict and the fixes.

## Output

1. **One-screen summary:** count of ads Ready, Fix then ready, Do not launch; the one most common problem; what to fix first.
2. **Verdict table:** ad ID, file, placement, T1 to T6 (pass or fail), verdict, top fix, who can make it, effort (minutes).
3. **Fix notes per ad:** the failing line or frame, why it fails, the rewrite or edit.
4. **`prelaunch-log.csv`** columns: ad ID, check date, T1 to T6, verdict, fixes made, launch date, spend, store-side purchases, cost per purchase, target cost per purchase, CTR (link), hook rate, review verdict.
5. **To confirm:** claims the owner must prove or drop.

## Common mistakes

- **Passing a pretty ad with an unproven claim.** Proof is a hard check in step 5 and step 9.
- **Price in the ad no longer matches the site.** Step 1 captures the page on the day of the check.
- **A curiosity ad sent to the product page.** Step 6 matches the ad's job to its destination.
- **Text under the Reels caption.** Step 7 checks the 9:16 safe zones.
- **Trusting the model's pass.** Step 8 makes a person verify every fail and a sample of passes.
- **Calling a high-CTR ad a winner.** Step 10 reads store-side purchases first.
- **Changing the checks after five ads.** Step 10 waits for about 30 results and never loosens hard checks.

## Sources

- [ORG-0017]: the first frame must show the topic; half-second test.
- [MCR-0063]: hook copy carries most of a paid video hook; grade 5 to 8.
- [ORG-0016]: hook text 5 to 8 words, falls off past 12.
- [MCR-0026]: a hook must filter for buyers.
- [MCR-0024]: a static is fully clear or a deliberate curiosity gap.
- [MCR-0077]: few viewers reach the second half; benefits before features.
- [MCR-0056]: one awareness stage per ad.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [LPG-0037]: bare press logos and anonymous reviews read as fake.
- [MCR-0020]: health and personal-attribute policy on images.
- [MCR-0030]: the destination sets the ad's job.
- [OFF-0016]: recompute break-even for every offer.
- [ADC-0039]: judge after 3 times target cost per purchase.
- [ADC-0059]: judge creative at ad set level.
- [MCR-0029]: high CTR can be a false winner.

Platform documentation: Meta Ads Guide sizes and Reels safe-zone guidance, Meta personal attributes policy, platform AI disclosure rules, India's 2023 dark patterns guidelines.

What makes this skill ours: hard checks that tie every claim to a dated proof row and every price to a same-day page capture; an offer check that needs the product's gross profit per purchase; a log that pairs each verdict with store-side results and changes the checks only after enough ads; a manual path and a model path that use the same rubric.
