# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest run: it maps Sprout's ads from the words available, labels every limit (text only, one competitor, no dates), and keeps its briefs free of health claims and Sprout's phrases. The owner gets three demand-backed ad directions and a clear list of what they must supply before any can run; the only soft spot is counting review 2 under "taste", which is a stretch but is cited so it can be checked.

## Judge list

- Met: Every card has a library ID, an advertiser and a start date, or "not shown".
  Shared card fields: "Library ID: not shown", "Advertiser: Sprout", "Start date: not shown", "Tier: unknown" apply to all 17 cards.
- Met: Claims are quoted word for word, from the ad itself, not the caption.
  "Text only. Every card below comes from headlines and main texts, not creatives." Headlines quoted exactly; main texts excerpted with ellipses.
- Met: The words "winner" and "profitable" never describe a competitor's ad.
  Output uses "what Sprout is betting on, not results"; neither word appears.
- Met: Each gap names both its reason (the map or the buyers) and the proof that fills it.
  "Why it's a gap: 4 buyers. Open at headline level." then "Proof needed: MISSING: your format facts" for each gap.
- Met: The briefs use your facts and claims only, with none of their words, people or footage.
  Avoid lists bar "Sprout reviewer phrases ('choking on', 'gritty/chalky')" and "'One Step I Never Skip' or 'Ridiculously Easy' wording"; headlines are new.

## What went in

```text
Today's job: plan our first ads for new customers, US, image ads.
About 3 ideas.

My business: a smaller greens gummy brand. Our facts and claims list
aren't written yet, and we have no reviews of our own yet.

Competitors: start with the category leader, Sprout.

Ads: 15 live Sprout headlines plus 2 main texts from the public Meta Ad
Library, with copies live and the mix of the
40 newest ads (sprout/ads.md). No screenshots, no library IDs, no
start dates.
Reviews: Sprout's 20 public reviews (sprout/reviews.md), as the
nearest view of what buyers in this category say.

[attached: sprout/reviews.md, sprout/ads.md]
```

## What came out

```text
# Competitor ad gaps: Sprout sample, first image ads for New buyers, US

**Text only.** Every card below comes from headlines and main texts, not creatives. The study has no screenshots, library IDs or start dates.

**One competitor only.** This map shows Sprout's habits, not the category's.

**MISSING:** your facts sheet and claims list. Every brief below is a draft until you add them.

## 1. Summary

Sprout's live ads lean hardest on the offer: "61% off" carries its most-copied headlines and 19 of its 40 newest ads. Its next biggest bet is gut and identity "moment" headlines, plus a new push on hair. The strongest buyer themes in its own reviews get no headline: quitting powders (4 buyers), taste (5 buyers) and the ease of a daily habit (5 buyers). Sprout runs nothing in Product alone, Old way new way, Their words, or a sourced Checked fact.

You hold no proof on file yet, so each gap below is a candidate that needs your facts before it can run.

**Top 3 gaps:**
1. Old way, new way: powder to gummy (4 buyers, no headline).
2. Product alone: the gummy itself, sold on taste and format (5 buyers on taste, no adult taste headline).
3. In use: the daily pack that fits the day (5 buyers on ease and habit; one Sprout headline).

## 2. Sample

- **Competitors:** 1 (Sprout). `MISSING: at least 2 more competitors` for a category map. Good next picks are other greens gummy and greens powder brands selling in the US, for you to name and confirm.
- **Ads read:**
  - 15 headlines, plus 2 main texts with no headline attached.
  - Also noted but not carded: 4 more Kids headlines, "30 Days Of [a fitness app], Free" and "Perfect Supplement for Weight Loss Support | Support Energy & Wellness".
  - The 10-ad cap (5 longest-running, 5 newest) could not be applied, because there are no start dates. All 15 were kept, and this is noted as a departure.
- **Versions merged:** "Copies live" counts are recorded on each card.
- **Skips:** none. All ads are US and English.
- **Tiers:** all unknown (`MISSING: start dates`). The only date signal is that the 6 hair ads were all made 2 Oct, which makes them New (under 30 days).

## 3. Category map (Sprout only)

With one advertiser, "half or more" and "one advertiser" both equal Sprout. So "crowded" and "thin" can't be told apart. Cells are marked **Used by Sprout** or **Open in this sample**. Dress is not shown for any ad.

| Question | Type | Sprout cards | Status | Main dress |
|---|---|---|---|---|
| What is it? | Product alone | none | **Open** | not shown |
| What is it? | Look inside | S15 | Used (1) | not shown |
| Is it for me? | The moment | S06, S07, S08, S09, S10, S13, S14, T2 | Used (heaviest after offer) | not shown |
| Is it for me? | Old way, new way | none as a headline; T2 says "without powders or prep" in body text | **Open** at headline level | not shown |
| Is it for me? | In use | S12 | Used (1) | not shown |
| Can I believe it? | Their words | none | **Open** | not shown |
| Can I believe it? | Checked fact | none sourced; S04 "1M+" and T1 "Third-party tested" have no source shown | **Open** for a sourced fact | not shown |
| Why now? | The offer | S01, S02, S03, S04, S11, T1 | Used (heaviest) | not shown |
| Why now? | The occasion | S05 (birthday price cut) | Used (1) | not shown |

## 4. Ad cards

**Fields that are the same for every card:**
- Library ID: not shown
- Advertiser: Sprout
- Start date: not shown
- Tier: unknown
- Status: live when pulled (30 Sept or 4 Oct 2026)
- Basis: text only
- Proof shown and dress: not shown
- Where it leads: not shown
- Cover-the-logo check: can't be done without the creative

| Code | Main claim, word for word | Question / type | Proof in the words | Offer shown | Claim flag | Copies |
|---|---|---|---|---|---|---|
| S01 | "'Sprout is too expensive': here's 61% off to prove otherwise" | Why now? / The offer | none | 61% off; deadline and subscription terms not shown | none | 15+ |
| S02 | "Don't Pay Full Price. You Literally Don't Have To. (61% off inside)" | Why now? / The offer | none | 61% off | none | 8+ |
| S03 | "Get up to 61% OFF + 4 FREE gifts: online exclusive" | Why now? / The offer | none | up to 61% off, 4 gifts, online only | none | 10 (with sister line) |
| S04 | "Trusted by 1M+: Take 61% OFF" | Why now? / The offer (leans on a count) | "1M+", with no source or definition of what it counts | 61% off | unsourced count | 4 |
| S05 | "We're Lowering Our Prices 🔥" | Why now? / The occasion (birthday price cut) | none | price cut; amount not shown | none | 1 |
| S06 | "Fix the Hot Girl Tummy" | Is it for me? / The moment | none | not shown | **"Fix" reads as a treatment claim** | 5 |
| S07 | "Struggling to Get Enough Fiber?" | Is it for me? / The moment | none in headline (6 g fiber in notes) | not shown | none | not counted |
| S08 | "Nutrition for Healthy Hair" | Is it for me? / The moment (beauty benefit) | none | not shown | **beauty benefit, no evidence on file** | 6 |
| S09 | "Support Muscle While You Lose Weight" | Is it for me? / The moment (weight-loss buyer) | none | not shown | **weight-loss claim, no evidence on file** | 1 |
| S10 | "The Daily Nutrition Every Runner Forgets" | Is it for me? / The moment (identity) | none | not shown | none | 2 |
| S11 | "Perks That Really Pile Up" | Why now? / The offer (membership; aimed at Warm buyers) | none | gifts, limited flavours, savings; terms not shown | none | 7 |
| S12 | "One Step I Never Skip" | Is it for me? / In use (daily habit, first-person voice) | none; not shown to be a real customer | not shown | none | 1 (+ "Nutrition Made Ridiculously Easy") |
| S13 | "He Asked What Day It Was. I Handed Him a Gummy." | Is it for me? / The moment (story) | none | not shown | none | 1 |
| S14 | "Fiber Kids Won't Fight" | Is it for me? / The moment (picky eater) | none | not shown | none | not counted |
| S15 | "Methylfolate, Not Folic Acid" | What is it? / Look inside | ingredient name only | not shown | none | not counted |
| T1 | Main text: "$29.99 for your first order … 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics … ✅ Third-party tested" | Why now? / The offer | "Third-party tested", no source | $29.99 first order, $20 off, +$5 off per extra person, online only | **"probiotics" contradicts the product page, which lists prebiotic fiber and no probiotics** | not shown |
| T2 | Main text: "Feeling off in your gut lately? … supports digestion with 6g of fiber, prebiotics … without powders or prep" | Is it for me? / The moment | 6 g fiber, no source shown | not shown | "supports digestion" is soft structure/function wording | not shown |

**Offer note:** ads say 61% off. The site shows 52%, 55%, 49% or 58% depending on the page.

## 5. Clichés and direction

- **Category clichés:** none can be named. A cliché needs 2 or more advertisers (`MISSING: more competitors`).
- **Sprout's own repeats**, to steer clear of:
  - "61% off" (S01 to S04)
  - "Don't pay full price"
  - "online exclusive"
  - "Fix" for gut
  - "Support … while you lose weight"
- **Where the newest ads are heading:** long-runners can't be compared with the newest without start dates. The 40 newest (30 Sept to 3 Oct) split as follows:
  - 19 offer
  - 7 perks
  - 6 hair (all made 2 Oct)
  - 3 habit or story
  - 2 gut
  - 2 limited flavour
  - 1 weight loss

  So the newest money goes to the offer and a fresh hair test. Habit and story stay small.

## 6. Buyer check

These are Sprout's 20 reviews, used as the nearest view of the category. 13 are hand-picked by the brand, so they lean positive. Only themes from 3 or more separate buyers are counted.

| Buyer want or doubt | Buyers | Reviews | Sprout ads that speak to it |
|---|---|---|---|
| Gut: regularity, bloating, digestion | 6 | 7, 8, 9, 10, 11, 14 | S06, S07, T2, "One pack a day keeps the gut happy 💩" |
| Easy to stick to, convenient daily habit | 5 | 1, 2, 5, 6, 15 | S12 and "Nutrition Made Ridiculously Easy" (2 copies) |
| Tastes good, feels like a treat | 5 | 2, 6, 12, 14, 16 | Kids headlines only ("Vitamins They Actually Want"); **no adult headline** |
| Quit powders (gritty, pricey, cleanup) | 4 | 1, 3, 4, 6 | **No headline**; one body line in T2 |

**Under the threshold (2 buyers each), not counted:**
- energy (13, 14)
- GLP-1 (11, 14; not usable by a brand anyway)
- kids love it (16, 17)
- subscription trap (17, 20)
- bad taste (18, 19)
- price (3, plus "They are expensive")

Sprout's most-copied ad (S01) answers a price doubt that only 2 reviewers on file voice.

## 7. Gaps and briefs

**Proof rule.** None of these can run until you add your own proof to your facts file. Sprout's reviews show buyer demand. They are **not** proof for your brand and can't be quoted. The proof each brief needs is marked `MISSING:`.

Gut (6 buyers) is not a gap: Sprout already occupies it, and it carries the most claim risk.

### Gap 1: Old way, new way: powder to gummy
- **Why it's a gap:** 4 buyers. Open at headline level.
- **Code:** G1
- **Question:** Is it for me?
- **Picture:** split frame, camera dress.
  - Left: a plain, unbranded scoop of green powder, a shaker bottle and a sink of dishes.
  - Right: one of your packs opened, gummies on a hand.
- **Headline:** "No scoop. No shaker. Just chew." (6 words)
- **Proof needed:**
  - `MISSING: your format facts` (gummy, single-serve pack, no mixing).
  - `MISSING: claims list sign-off` that format comparisons are allowed.
  - The powder side stays generic, with no brand, colour or tub shape a buyer could link to anyone.
- **How to read:** link clicks to the product page as the early read at 7 days, then purchases at 14 days, against G2 and G3.
- **Avoid:**
  - naming or showing any powder brand
  - any taste or "better" claim about rivals
  - Sprout reviewer phrases ("choking on", "gritty/chalky")

### Gap 2: Product alone: the gummy, close up
- **Why it's a gap:** 5 buyers on taste. Open type. No adult taste headline.
- **Code:** G2
- **Question:** What is it?
- **Picture:**
  - a real photo of your exact variant: the pack and a few gummies, on a plain background in your own colours
  - flavour and serving shown on the pack
- **Headline:** "Your greens, in a [flavour] gummy." (6 words)
- **Proof needed:**
  - `MISSING: product photo of the exact variant`
  - `MISSING: flavour name`
  - `MISSING: count of ingredients or nutrients` if you add a line
  - Taste is shown, not claimed, until you have your own reviews. A "Their words" version can follow once you do.
- **How to read:** purchases, read at 14 days. Clicks at 7 days as the early signal.
- **Avoid:**
  - "tastes like fruit snacks" (a Sprout buyer's words)
  - any percent-off headline
  - any colour palette or pack look like Sprout's (`MISSING: Sprout creatives` to check its look against)

### Gap 3: In use: the daily pack that fits the day
- **Why it's a gap:** 5 buyers on ease and habit. Sprout uses this once (S12) and is putting few new ads here.
- **Code:** G3
- **Question:** Is it for me?
- **Picture:** lo-fi phone photo of your pack in real use, such as a hand pulling it from a work bag or a car cup-holder in the morning.
- **Headline:** "Daily greens that fit your bag." (6 words)
- **Proof needed:**
  - `MISSING: a photo of real use`
  - `MISSING: pack size and servings-per-day facts`
  - Make no promise that buyers will "stick with it". That needs your own reviews, told as one buyer's story.
- **How to read:** purchases at 14 days. Clicks at 7 days.
- **Avoid:**
  - "One Step I Never Skip" or "Ridiculously Easy" wording
  - mom framing copied from Sprout review 15
  - any gut, energy, hair, weight-loss or GLP-1 claim

**For all three:**
- Make no health claim until your claims list exists.
- Don't say "probiotics" unless your label has them.
- Don't lead with a percent off. That is Sprout's loudest space.

## 8. Limits

- **Only one competitor.** This is Sprout's pattern, not the category's.
- **No creatives.** Type was judged from words alone. Dress, the biggest thing in each frame, the cover-the-logo check and where each ad leads are unknown.
- **No library IDs or start dates.** Every tier is unknown, long-runners can't be compared with the newest, and the 10-ad cap couldn't be applied.
- **Ad copy is incomplete.** Only 2 main texts, and they aren't matched to headlines. "Copies live" shows what Sprout is betting on, not results.
- **Reviews are one brand's, mostly hand-picked.** Star ratings weren't captured, and the brand's 4.8 from 100,000 differs from a public 4.0 from 2,411.
- **Your business inputs are missing:**
  - `MISSING: facts sheet`
  - `MISSING: claims list`
  - `MISSING: products, price range, live offers`
  - `MISSING: your own reviews`
  - `MISSING: your own past ads`

  Until these exist, the gaps are demand-backed but unproven for you.
```
