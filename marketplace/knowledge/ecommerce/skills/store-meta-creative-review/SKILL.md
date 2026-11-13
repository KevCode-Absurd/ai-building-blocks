---
name: store-meta-creative-review
description: "Review an online store's live Meta ads and sort each one into scale, keep, fix or cut, judged on store-side cost per purchase against the store's own target, with hook and hold rates to say what to fix. Then maps the ads into concepts to show missing buyers, angles, offers and formats, works out how many new ads the account needs, and checks every asset against Meta placement sizes and safe zones. Use for a weekly or monthly creative review, when results slide, before a sale, or before handing a new batch to production. Read access only; pausing or scaling needs a yes."
---

# Meta creative review for an online store

**You get:** a scale, keep, fix or cut verdict for every live Meta ad on store cost per purchase, a concept map, a gap list, an asset check and a numbered approval list.

## When to use

- Weekly or monthly creative review on a running account.
- Cost per purchase has crept up for two weeks and the owner suspects tired ads.
- One or two ads take most of the spend and the owner worries what happens when they fade.
- Before a sale, to decide which ads carry the offer.
- Before sending new ads live, to check sizes, safe zones and that the offer matches the page.

## Not for

- Writing the new concepts this review asks for: use `store-meta-concepts`.
- Making images from a brief: use `store-meta-ad-images`.
- A full account health check (tracking, structure, bidding): use `store-meta-audit`.
- Fixing the page the ads land on: use `store-meta-landing`.

## What you need

Required:

1. **Meta Ads Manager export**, last 30 days and last 7 days, ad level: Campaign name, Ad set name, Ad name, Ad ID, Amount spent, Impressions, Reach, Frequency, CPM, Link clicks, CTR (all), CTR (link click-through rate), 3-second video plays, ThruPlays, Video plays at 25%, 50%, 75%, 95%, Purchases, Purchases conversion value, Attribution setting. Add the Placement breakdown for video ads. Use 7-day click; view-through credit can make up 30 to 50% of reported ROAS [MEA-0042].
2. **Store orders for the same dates.** Best: orders by utm_content from Shopify's marketing reports or GA4, with ads tagged `utm_content={{ad.id}}`. At least: the Shopify order export (Name, Created at, Total, Discount Code, customer ID) so new orders can be counted.
3. **Target cost per purchase (CPP)**, from gross profit per purchase (GPP) as `store-meta-plan` computes it.
4. **The creative files or previews** for every ad with spend: image or video, primary text, headline, offer.

Optional: stock by SKU for advertised products; the store's concept tags if it keeps them; the sale calendar.

Missing 1, 3 or 4: ask once. Missing the UTM report: use the account-level correction in step 1 and mark verdicts "reduced confidence".

**Access:** level 1 (read) for the review. Pausing, scaling, duplicating or editing ads needs level 3 and a yes per change list; level 2 can prepare them as drafts. Never turn off an ad on your own.

## Before you start: the gates

1. **Money.** *Pass:* target CPP comes from GPP. *Fail:* no ad can be called a winner; stop and compute GPP first. A CPP target set wrong makes losers look like winners [ADC-0017].
2. **Tracking.** *Pass:* Meta's 7-day click purchases are not above Shopify orders for the same dates. *Fail:* send the job to `store-meta-capi`; give only the spec and safe-zone checks (steps 7 and 8).
3. **Stock.** *Pass:* each advertised product has stock for the next 30 days at current pace. *Fail:* no "scale" verdict for that product, whatever its numbers [ADC-0023].
4. **Cash.** *Pass:* the owner knows how many new ads a month they can pay to make. *Fail:* step 6 gives the need, and the owner picks what to fund.

## Steps

1. **Work out store-side cost per purchase per ad.**
   - With an ad-level UTM report: store CPP = spend ÷ store orders carrying that ad ID.
   - Without one: correction factor k = store orders tagged to Meta (any UTM) ÷ Meta 7-day click purchases, account-wide, same dates. Store CPP = spend ÷ (Meta purchases × k).
   - With no UTMs at all: use Meta 7-day click, check it against new-customer orders in Shopify, and ask to tag new ads from now on.
   Judge ad sets before ads: ad-level credit is the least reliable [ADC-0059].

2. **Only judge ads with enough spend.** An ad under 3 × target CPP spent is "learning": leave it. At 3 × CPP: 3 or more purchases keep, 2 wait, 0 or 1 cut; a firm call needs 5 × CPP [ADC-0039].

3. **Sort each judged ad.** Ratios are practitioner defaults; test them.

| Verdict | Rule |
|---|---|
| Scale | Store CPP at or under 0.8 × target after 5 × CPP spend, cold ad frequency 2 or less over 30 days [MCR-0040], product in stock |
| Keep | Store CPP at or under target; or up to 1.2 × target inside an ad set that is meeting target, because Meta shows ads in sequence and cutting can hurt the set [ADC-0009] |
| Fix | Store CPP 1.0 to 1.5 × target with one clearly weak part (step 4) |
| Cut | Store CPP above 1.5 × target after 5 × CPP spend, or 0 to 1 purchases after 3 × CPP, in an ad set missing target |

   Catalog ads are judged apart, on 7-day click and new customers, because they mostly reach near-buyers [ADC-0040]. During a sale, judge on CTR and cost per click; ad ROAS then mostly shows which product was discounted [MCR-0068].

4. **Diagnose fix ads with hook and hold.** Hook rate = 3-second plays ÷ impressions. Hold rate = ThruPlays ÷ 3-second plays. Compare each to the account's own 30-day median for the same placement group (Reels and Stories apart from Feed), not to internet benchmarks; under 0.8 × median is weak (practitioner default, test it).
   - Weak hook, fine hold: cut 2 to 4 new openers on the same body [MCR-0013]; one brand cuts every ad with 4 to 5 openers [MCR-0076].
   - Good hook, weak hold: fix the first half; only about 15% reach the second half, so put benefits before features [MCR-0077].
   - High CTR (all) but low link CTR, or clicks without purchases: a false winner that pulls the wrong viewers [MCR-0029].
   - Good link CTR, low purchase rate: the page is the problem; send the URL to `store-meta-landing`.
   - Statics: use link CTR and the gap between CTR (all) and link CTR.

5. **Map concepts and find the gaps.** Tag every ad with buyer, angle, offer, format, awareness stage and proof type [MCR-0051]. A new colour or background is the same concept [MCR-0022]; near-copies are grouped by Meta and add no reach [MCR-0078]. Then report:
   - Spend share of the top concept. When one concept takes about 80%, feed it more variations or cap it near 40% and rotate new concepts [ADC-0061]; under campaign budgets a few ads often hold most spend, which is fragile when they fade [ADC-0014].
   - Awareness mix. Mostly product-aware ads keep the account warm and frequency climbs; aim most volume at unaware and problem-aware buyers [MCR-0057].
   - Missing formats a store can use: 4:5 static, 9:16 video, carousel, collection, catalog ads, partnership ads through a creator's handle [ADC-0011], founder-led ads with or without the founder on camera [MCR-0005].
   - Missing buyers, angles and offers, checked against stock and GPP.

6. **Size the new-ad need.** With a few months of history: new ads a month = winners lost per month ÷ hit rate [MCR-0025]; a hit rate near 5% is normal [ADC-0017]. Without it, use concepts by spend band [MCR-0058]. Split the work about 50 to 60% remakes of past winners, 20 to 30% fixes, 20 to 30% net-new concepts, never zero new [MCR-0042]. Hand the brief to `store-meta-concepts`.

7. **Check placement specs.** From Meta's ad guide: Feed 1080 × 1350 (4:5) or 1080 × 1080 (1:1); Stories and Reels 1080 × 1920 (9:16); carousel 2 to 10 cards at 1080 × 1080; video MP4 or MOV with H.264; image files up to 30 MB. Recommended text: primary text about 125 characters before "more", headline about 40. Read sizes from file properties or any free image viewer; no paid tool is needed. Every concept needs a 9:16 and a 4:5 or 1:1 version, or Meta crops one into the other. Flexible ads can crop story assets into Feed or build carousels you did not approve [ADC-0065]. List which Advantage+ creative enhancements are on and whether the owner approved them, since text changes can alter claims.

8. **Check safe zones and store facts on each asset.** On 9:16 assets, keep text, logo, price and offer out of the top 250 px and bottom 340 px and off the right edge where Reels buttons sit (practitioner default; confirm in the Ads Manager placement preview). Captions are burned in for sound-off viewers. The price, offer and product in the ad match the live page today, the product is in stock, and every claim has the store's own proof.

## Checks before you hand it over

1. Every verdict uses store-side CPP or says why it could not.
2. No ad under 3 × target CPP spend has a scale or cut verdict.
3. No "scale" verdict on a product short of stock.
4. Each fix ad names the weak part (hook, hold, false click, page) with numbers.
5. Concepts are counted, not ads, and the top concept's spend share is shown.
6. Every asset has a pass or fail for size, aspect ratio and safe zone.
7. Pauses and budget changes are a numbered list for approval, not done.

## Output

1. **One-screen summary:** spend by verdict (scale, keep, fix, cut, learning), the top action, the biggest gap, new ads needed this month, confidence.
2. **Ad verdict table:** Ad ID, Ad name, Concept, Spend, Meta purchases (7-day click), Store purchases, Store CPP, Target CPP, Frequency, Hook rate, Hold rate, Link CTR, Verdict, Reason, Next step.
3. **Concept map:** Concept, Buyer, Angle, Offer, Format, Awareness stage, Ads, Spend share, Store CPP.
4. **Gap list:** Missing buyer, angle, offer or format; Evidence; Stock and GPP check; Priority.
5. **Asset check:** Asset, Placement, Expected size, Actual size, File size, Safe zone, Offer matches page, Status, Fix.
6. **Approval list:** numbered changes (pause, raise, duplicate), each with access level.
7. Files: `CREATIVE-REVIEW.md` and `creative-verdicts.csv`.

## Common mistakes

- **Cutting on Meta's numbers alone.** View-through and double counts flatter some ads. Step 1 uses store-side CPP.
- **Killing ads too early.** Step 2 waits for 3 × CPP.
- **Switching off cheap-looking ads inside a winning ad set.** Step 3 keeps them [ADC-0009].
- **Judging hooks against internet benchmarks.** Step 4 uses the account's own median by placement.
- **Calling colour swaps new concepts.** Step 5 counts concepts.
- **Scaling an ad whose product is running out.** The stock gate blocks it.
- **Reading sale-week ROAS as creative quality.** Step 3 switches to CTR and cost per click.

## Sources

ADC-0009: do not cut inside a winning ad set; ADC-0011: partnership ads; ADC-0014: spend piles on few ads; ADC-0017: hit rate near 5%; ADC-0023: ad targets tied to stock; ADC-0039: judge at 3 × and 5 × CPA; ADC-0040: judge catalog ads on 7-day click; ADC-0059: ad set over ad level; ADC-0061: cap a dominant concept; ADC-0065: flexible ads crop and hide; MCR-0005: founder ads without the founder; MCR-0013: 2 to 4 hooks per body; MCR-0022: colour is not a concept; MCR-0025: ad volume from churn; MCR-0029: high-CTR false winners; MCR-0040: cold frequency above 2; MCR-0042: remake, fix, new split; MCR-0051: tag every ad the same way; MCR-0057: awareness mix; MCR-0058: concepts by spend band; MCR-0068: sale-week analysis; MCR-0076: 4 to 5 openers per ad; MCR-0077: fix the first half; MCR-0078: near-copies grouped; MEA-0042: view-through inflates ROAS.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: it gives every live ad a scale, keep, fix or cut verdict from store-side cost per purchase against the store's own target, with a minimum spend before judging; it uses hook and hold rates against the account's own median to name what to fix; it sizes how many new ads the account needs from winner churn and hit rate; and it folds in the format check with a free manual path, dropping the "60% similarity" rule, the paid image tool and the cost tracking.
