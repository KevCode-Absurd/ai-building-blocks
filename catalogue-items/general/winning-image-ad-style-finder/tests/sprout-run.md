# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The ranking and every cost-per-purchase figure are correct, P1's two windows are joined properly, and the style traits are honestly limited to what the headline text can show, with images, dress and reasons all marked MISSING or not recorded. The three new ads each change one thing, follow the brand's pack rules, use only real buyer quotes from the file it was sent, and leave out the conflicting discounts, so the owner gets a usable, safe plan with a clear list of what to confirm before making anything.

## Judge list

- Met: The ranking matches your file, and ads under about 20 sales are left out.
  "T1 $21.21 top ... P2 $50.00 bottom ... Not measured: R1 Runner (10 purchases, $100.00)"; every cost per purchase checks against the CSV.
- Met: Every kept trait shows its count among winners and losers.
  "Headline 5 words or fewer   top 3 of 3   bottom 0 of 3   kept" and the same for each kept trait.
- Met: Any reason for a win comes from your records, or is written "not recorded".
  "Why each won: T1 not recorded. H1 not recorded. K1 not recorded."
- Met: The do-not-carry list includes the winners' words, offers and people.
  "Do not carry: 'Fix the Hot Girl Tummy' ... the T1 UGC creator and any lookalike ... 61% off, 4 free gifts"
- Met: Each new ad changes exactly one thing, and you can say what it is in a few words.
  "Changed Type: The moment → Old way new way"; "Changed Argument"; "Changed Audience: New → Warm"

## What went in

```text
Ads: ad-results.csv, one row per ad, 14 to 42 days (all 10 rows
pasted; practice numbers). P1 is one ad split into two 21-day
windows. Columns: ad_name, format, opening_line, days_live,
spend_usd, impressions, link_clicks, purchases, revenue_usd
Ad images: not attached
Judge on: cost per purchase
Product: Sprout Original (Adults)
Facts: Sprout brand file (pasted)
Reviews: all 20 (pasted)
How many new ads: 3

[attached: sprout/brand.md, sprout/ad-results.csv]
```

## What came out

```text
```
WORKING FROM
  Product  Sprout Original (Adults), Low Sugar, 28 packs: $66.65 one-time, $49.99 subscription every 4 weeks, "starts at" $29.99 first order only with the SMS sign-up discount (brand.md, prices seen late Sept to mid Oct 2026)
  Ads      sprout/ad-results.csv, 10 rows = 9 ads (P1 split into two 21-day windows), 14 to 42 days live each. Calendar dates not given. Practice numbers.
  Judged   Cost per purchase (spend ÷ purchases). Read point: about 20 purchases.
  Flags    Every top-group ad is a video and every bottom-group ad is an image (see STYLE). No ad images attached, so no visual trait could be read. Small print: any "starts at $29.99" needs the SMS-discount line, and ads carry no FDA line (the site footer does). Stock level unknown.

RANKING (cost per purchase. Account usual: $33.44 = $20,500 ÷ 613 purchases across measured ads)
  T1 Hot girl tummy          $21.21   top
  H1 One step never skip     $29.55   top
  K1 Fiber kids              $34.92   top
  F1 Fiber question          $39.13   middle
  W1 Muscle weight loss      $39.13   middle
  P1 Too expensive           days 1-21: $26.79 (112 purchases)   days 22-42: $76.92 (39 purchases)   bottom (placed on both windows joined, $6,000 ÷ 151). Cause of the change between windows: not recorded.
  S1 Trusted by 1M           $42.11   bottom
  P2 Dont pay full price     $50.00   bottom
  Not measured: R1 Runner (10 purchases, $100.00, under the read point)

STYLE  (top 3 vs bottom 3)
  Headline 5 words or fewer                      top 3 of 3   bottom 0 of 3   kept
  No price or discount in headline               top 3 of 3   bottom 0 of 3   kept
  No digits or % in headline                     top 3 of 3   bottom 0 of 3   kept (same evidence as the price trait)
  Type from the "Is it for me?" row [inferred from opening line]   top 3 of 3 (The moment)   bottom 0 of 3 (all The offer)   kept
  Audience New [inferred from opening line]      top 3 of 3   bottom 0 of 3 (Warm/Ready)   kept
  Opens as a statement                           top 3 of 3   bottom 2 of 3   dropped (brand habit)
  Speaker "you"                                  top 1 of 3   bottom 1 of 3   dropped
  Speaker "I"                                    top 1 of 3   bottom 0 of 3   dropped (fails the top rule)
  Format video (not one of the five traits)      top 3 of 3   bottom 0 of 3   noted, cannot carry into an image ad
  Dress, skeleton, brand cues, product shown     top ? of 3   bottom ? of 3   MISSING (no images; top group is all video)
  Why each won: T1 not recorded. H1 not recorded. K1 not recorded. The video-vs-image split may explain the gap as much as any kept trait. Not recorded which.
  Do not carry: "Fix the Hot Girl Tummy" (a risky "fix" claim), "One Step I Never Skip", "Fiber Kids Won't Fight", the T1 UGC creator and any lookalike, the Kids product and kids claims (K1), 61% off, 4 free gifts, "Trusted by 1M+", the "too expensive" quote, every discount figure
  Never used by winners: types Product alone, Look inside, Old way new way, In use, Their words, Checked fact, The offer, The occasion. Audiences Warm, Ready. Arguments: powder-quitter, taste ("Tastes like a treat"), no water or mixing on the go, third-party testing, absorption study, methylfolate.

NEW ADS
  1 Code Old way new way · MISSING: dress · New
      For      The quitter who wants to stick: has abandoned a greens powder tub and shaker
      Argues   The habit sticks when there's no tub or shaker to give up on.
      Kept     Headline ≤5 words, no price/digits in headline, "Is it for me?" row, New audience, habit argument (as H1)
      Changed  Type: The moment → Old way new way
      Headline "Quit The Shaker, Not Greens" (5)
      Product shown  An unbranded half-used powder tub and shaker on one side. On the other, a daily pack torn straight across the top, gummies pouring into a palm. Photo: MISSING clean product photo.
      Rests on Format "No water, no mixing, no shaker" (brand.md, What it is). Buyer quote "Sprout has been the one thing I've been able to stick to." (brand.md, Who buys it 1; reviews file not received). Brand line "No more gagging on pills, sloshing chalky powders, or cleaning messy counters." (brand.md, voice)

  2 Code The moment · MISSING: dress · New
      For      The busy parent buying Adults for herself
      Argues   Your greens fit the rush: tear, tip, eat, no water or mixing.
      Kept     Headline ≤5 words, no price/digits in headline, The moment type, New audience
      Changed  Argument: habit/gut/fiber → on-the-go in the morning rush
      Headline "Greens Before The School Run" (5)
      Product shown  A daily pack torn straight across the top, gummies pouring into a palm. A new fictional adult or no person, never a lookalike of the T1 creator. Photo: MISSING clean product photo.
      Rests on Format facts (brand.md, What it is). Brand line "Rip. Tip. Enjoy." (brand.md, voice). Buyer quote "So easy to grab and eat on my way to the billion things I have to do as a mom." (brand.md, Who buys it 3)

  3 Code The moment · MISSING: dress · Warm
      For      Shoppers who already know Sprout (shelf, past ads) but doubt they'd keep taking it
      Argues   This is the supplement people actually keep taking.
      Kept     Headline ≤5 words, no price/digits in headline, The moment type, habit argument (as H1)
      Changed  Audience: New → Warm
      Headline "The Supplement You'll Actually Finish" (5)
      Product shown  The adult pouch shut and standing (never torn), one daily pack beside it torn straight across the top. Photo: MISSING clean product photo.
      Rests on Body copy only, never in the headline: "95% of users take [Sprout] at least 4-6x per week with 80% taking daily", stated as "of surveyed users" (brand-reported survey of 3,000+ customers, brand.md, Claims). Buyer quote "Sprout has been the one thing I've been able to stick to." (brand.md, Who buys it 1)

MISSING  The ad images (no dress, skeleton, brand cues or product shown could be read, and all 3 top ads are video). Calendar dates for each ad. Reviews: "all 20" were mentioned, but only brand.md and ad-results.csv came through, so quotes come from brand.md. Clean product photos by view (pack front, torn pack, gummies in hand). Stock level. Which discount is current (52/55/58/61% and $29.99 conflict), so no offer is used. The SMS-discount small print and FDA line, if any ad adds a price. Why any ad won.
CHECKS MISSED  Kept traits rest on opening-line text only, and type/audience are inferred, not read from images. Top group is all video, bottom all image, so the style may not transfer to image ads. Dress cannot be filled in any new-ad code.
STOP 1   Before anything is made, confirm or correct: (a) type and audience codes inferred from opening lines; (b) whether the video-vs-image split, not the word traits, drove the win; (c) the dress, skeleton and brand cues of T1, H1, K1 from their frames; (d) which offer is current, if one is to go in body copy; (e) clean product photos. All 3 new ads are drafts (approve).
```
```
