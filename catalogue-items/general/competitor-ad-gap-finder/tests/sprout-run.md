# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 1.

A careful, honest reading of Sprout's ad mix and buyer themes with correct counts and no borrowed copy, and it flags every missing input rather than guessing. But because the business supplied no facts, claims or reviews, the three briefs are proofless candidates the owner cannot run yet, and one line ("shrunk") overstates a trend the data doesn't show.

## Fix

In "If something is missing", add: "No business facts, claims list or reviews: hand back the sample, map, cards, clichés and buyer check only, ask for them, and do not write gap briefs or a score until they arrive." Also in step 5, require "heading there" statements to cite both the earlier and newer counts."fix":""}

## Judge list

- Met: Every card has a library ID, an advertiser and a start date, or "not shown".
  "For all 15 cards: Library ID: not shown, Advertiser: Sprout, Start date: not shown, Tier: unknown"
- Met: Claims are quoted word for word, from the ad itself, not the caption.
  All 15 claims match ads.md exactly, e.g. "He Asked What Day It Was. I Handed Him a Gummy."; cards labelled "text only".
- Met: The words "winner" and "profitable" never describe a competitor's ad.
  Neither word appears; run says "'Copies live' is a bet, not a result."
- Not met: Each gap names both its reason (the map or the buyers) and the proof that fills it.
  "None of these gaps has your proof on file yet"; every brief's proof is "MISSING". Run itself scores this check as missed.
- Met: The briefs use your facts and claims only, with none of their words, people or footage.
  Briefs avoid "Never Skip", "Ridiculously Easy", "gritty/chalky", "$94"; headlines like "Swap the scoop for a chew" are new.

## Invented

- claim: Gut ads have shrunk to 2 of 40. (ads.md gives 2 gut ads among the 40 newest but no earlier count, so "shrunk" is an unsupported trend.)

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
## 1. Summary

Sprout, the only advertiser in this sample, spends most of its ad effort on "Why now?" offers: 26 of its 40 newest ads lead with an offer or with member perks, and "61% off" is its most-copied line. The three things Sprout's buyers praise that its headlines barely touch are how easy the gummy is to keep taking, quitting powders, and taste for adults. Sprout's only "old way, new way" ads are for kids. Every gap below is a candidate, not a finished brief: your facts, claims list and reviews aren't written yet, so none of them has proof on file. With one competitor, this map shows Sprout's habits, not the category's.

**Top 3 gaps (candidates):**
1. **Easy to keep taking.** 5 buyers mention it. Sprout runs 1 headline on it.
2. **Quitting powders, for adults.** 4 buyers mention it. No Sprout headline covers it.
3. **Taste, for adults.** 4 buyers mention it. Sprout's taste lines are all about kids.

## 2. Sample

- **Competitors:** 1 (Sprout). The user named it. `MISSING: 2 to 5 more competitor names`. Send them, or ask me to propose a list and confirm it before I use it.
- **Ads:** 15 numbered headlines, 6 extra headlines and 2 main texts, all from Sprout and all live when pulled on 30 Sept and 4 Oct 2026.
- **Selection rule not applied:** the rule is the 5 longest-running plus the 5 newest ads. That needs start dates, so I carded all 15 numbered headlines instead. The 6 extra headlines are counted on the map but not carded.
- **Skips:** none. All ads are US and in English.
- **Tiers:** all "unknown". `MISSING: start dates`.
- **Creative:** none was seen, so every card is **text only**. `MISSING: screenshots` and `MISSING: library IDs`.
- **"Copies live":** this is a rough sign of what Sprout is betting on. It is not a result.

## 3. Category map

There is only one advertiser, so "crowded" (half or more of advertisers) and "thin" (one advertiser) can't be told apart. Each type below is marked either as used by 1 of 1 advertisers or as open. The ad count shows Sprout's own weight on each type. Dress is not seen for any ad, because no creative was captured.

| Question | Type | Sprout ads using it | Status | Main dress |
|---|---|---|---|---|
| What is it? | Product alone | 0 seen (needs images to judge) | Unknown | not seen |
| What is it? | Look inside | 1 (#8, 6 copies) | Used, 1 of 1 | not seen |
| Is it for me? | The moment | 9 (#6, 7, 9, 10, 13, 14, plus 3 extras) | Used, 1 of 1 (Sprout's most-used type) | not seen |
| Is it for me? | Old way, new way | 2 (#15, plus "The veggies they won't eat…"), kids only | Used, 1 of 1. **Open for adults** | not seen |
| Is it for me? | In use | 1 (#12, plus "Nutrition Made Ridiculously Easy") | Used, 1 of 1 | not seen |
| Can I believe it? | Their words | 0 | **Open** | n/a |
| Can I believe it? | Checked fact | 0 headlines lead with one ("1M+" in #4 sits inside an offer and has no source) | **Open** | n/a |
| Why now? | The offer | 7 (#1–5, #11, plus the fitness-app gift), with the most copies | Used, 1 of 1 (heaviest by copies) | not seen |
| Why now? | The occasion | 1 ("The Lemon Aid Stand is open. 🍋") | Used, 1 of 1 | not seen |

**Offer shapes seen:**
- Percent off: "61% off". The site shows 52%, 55%, 49% or 58%, depending on the page.
- Percent off plus gift: "up to 61% OFF + 4 FREE gifts".
- Money off: "$29.99 for your first order", "$20 off your first order" and "+$5 off for every extra person".
- Partner gift: "30 Days Of [a fitness app], Free".
- Membership perks: gifts, limited flavours and savings.
- Subscription terms: not shown in any ad.

**Where the ads lead:** not captured. Main text 1 says "Online-exclusive offer. Shop [Sprout]."

## 4. Ad cards (text only)

For all 15 cards:
- **Library ID:** not shown
- **Advertiser:** Sprout
- **Start date:** not shown
- **Tier:** unknown
- **Status:** live
- **Dress:** not seen
- **Cover-the-logo check:** can't be done without the creative

| # | Code (type) | Question | Main claim, word for word | Proof shown | Offer shown | Health or beauty claim flag |
|---|---|---|---|---|---|---|
| 1 | The offer | Why now? | "'Sprout is too expensive': here's 61% off to prove otherwise" | none (the quote is unsourced) | 61% off, no deadline shown | none |
| 2 | The offer | Why now? | "Don't Pay Full Price. You Literally Don't Have To. (61% off inside)" | none | 61% off | none |
| 3 | The offer | Why now? | "Get up to 61% OFF + 4 FREE gifts: online exclusive" | none | up to 61% off, 4 gifts, online only | none |
| 4 | The offer | Why now? | "Trusted by 1M+: Take 61% OFF" | checked fact claimed ("1M+"), no source or count basis shown | 61% off | none |
| 5 | The offer | Why now? | "We're Lowering Our Prices 🔥" | none | price cut (birthday), no amount shown | none |
| 6 | The moment | Is it for me? | "Fix the Hot Girl Tummy" | none | none | **"Fix" is a treatment-style claim** |
| 7 | The moment | Is it for me? | "Struggling to Get Enough Fiber?" | none in the headline (6 g fiber is in the main text) | none | none |
| 8 | Look inside | What is it? | "Nutrition for Healthy Hair" | none | none | **Beauty benefit claim** |
| 9 | The moment | Is it for me? | "Support Muscle While You Lose Weight" | none | none | **Weight-loss claim, no evidence on file** |
| 10 | The moment | Is it for me? | "The Daily Nutrition Every Runner Forgets" | none | none | none |
| 11 | The offer | Why now? | "Perks That Really Pile Up" | none | membership perks: gifts, limited flavours, savings | none |
| 12 | In use | Is it for me? | "One Step I Never Skip" | none (first-person voice, but written by the brand) | none | none |
| 13 | The moment | Is it for me? | "He Asked What Day It Was. I Handed Him a Gummy." | none | none | none |
| 14 | The moment | Is it for me? | "Fiber Kids Won't Fight" | none | none | none |
| 15 | Old way, new way | Is it for me? | "Methylfolate, Not Folic Acid" | ingredient named, no source | none | none |

**Main texts (no headline linked):**
- **T1:** "…60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics…"
  - Offer: $29.99 first order, $20 off, +$5 per extra person, online only.
  - **Flag:** the product page lists no probiotics.
  - **Flag:** "Third-party tested" is shown with no source.
- **T2:** "[Sprout] supports digestion with 6g of fiber, prebiotics, and daily vitamins to help keep your gut balanced without powders or prep."
  - **Flag:** "supports digestion" and "keep your gut balanced" are health claims.
  - This is the only line in the sample that mentions powders.

**Other health claims flagged in the extra headlines:**
- "Perfect Supplement for Weight Loss Support | Support Energy & Wellness" (weight loss)
- "One pack a day keeps the gut happy 💩" (gut)

## 5. Clichés and direction

**Category clichés:** none can be named. A cliché needs nearly the same words from 2 or more advertisers, and there is only 1 here.

**Sprout's own repeated lines** (keep clear of these so you don't look like a smaller Sprout):
- "61% off" / "61% OFF", across 4 headlines and 37+ copies
- "Actually Want" and "Literally Don't Have To"
- the kids "won't eat / won't fight / they will" pattern
- "Daily Nutrition"

**Direction:**
- Long-runners can't be compared with the newest ads without start dates.
- The newest 40 ads lean further into offers (19) and perks (7).
- Sprout is adding "Look inside" with hair: all 6 hair ads were made on 2 Oct.
- Gut ads have shrunk to 2 of 40.
- Habit and story ads are 3 of 40.

## 6. Buyer check (Sprout's 20 public reviews, used as the category view)

**Counted (3 or more separate buyers):**

| Want or doubt | Count | Reviews | Sprout ads that speak to it |
|---|---|---|---|
| Gut, regularity, less bloating | 6 | 7, 8, 9, 10, 11, 14 | #6, #7, #14, T2, "One pack a day keeps the gut happy" |
| Easy to keep taking / convenient | 5 | 1, 2, 5, 6, 15 | #12 (1 copy) and "Nutrition Made Ridiculously Easy" only |
| Tastes good | 4 | 6, 12, 14, 16 | kids only ("Vitamins They Actually Want", "The veggies they won't eat…"). **None for adults** |
| Quitting or disliking powders | 4 | 1, 3, 4, 6 | T2 ("without powders or prep") only. **No headline** |
| Fits family life / kids | 3 | 15, 16, 17 | #14, #15, and 4 kids extras |

**Below 3 buyers (noted, not counted):**
- Price: review 3 and "They are expensive", so 2.
- Subscription doubt: reviews 17 and 20, so 2.
- Bad taste: reviews 18 and 19, so 2.
- Energy: reviews 13 and 14, so 2.
- GLP-1 use: reviews 11 and 14, so 2.
- Sugar-alcohol effects: 1.

## 7. Gaps and briefs

None of these gaps has your proof on file yet. Each brief lists the proof it needs.

`MISSING: your product facts`
`MISSING: your allowed and banned claims list`
`MISSING: your reviews`
`MISSING: your past ads and results`

**Not gaps:**
- Gut (6 buyers) and kids (3 buyers) are both well covered by Sprout.
- "Their words" and "Checked fact" are open cells, but you have no reviews or sourced numbers to fill them yet. Revisit them once you do.

---

**Gap 1: Easy to keep taking.** 5 buyers mention it. Sprout covers it with 1 headline and 3 of its 40 newest ads.

- **Code:** In use · Camera
- **Question:** Is it for me?
- **Picture:** a real hand pulling one of your packs from a jacket pocket or bag on the way out the door. Shoot your exact pack, unstaged and in daylight.
- **Headline:** "Daily greens that fit in your pocket" (7 words)
- **Proof needed:** your pack format and serving facts, from your label or product page. `MISSING`. Any "easy to stick with" line has to wait for your own reviews or reorder data.
- **How to read it:**
  - At day 7, after one learning window: link clicks to the product page.
  - At day 14 to 30: purchases from new customers.
- **Avoid:**
  - "Never Skip" and "Ridiculously Easy" (Sprout's lines)
  - a first-person "I" voice with no real source behind it
  - "61% off"-style offer stickers

---

**Gap 2: Quitting powders, for adults.** 4 buyers mention it. No Sprout headline covers it, and Sprout's only "old way, new way" ads are for kids.

- **Code:** Old way, new way · Camera
- **Question:** Is it for me?
- **Picture:**
  - Left side: an unbranded shaker bottle, a scoop and a dusty counter.
  - Right side: one of your gummy packs.
  - No rival tub, colours or label anywhere in the frame.
- **Headline:** "Swap the scoop for a chew" (6 words)
- **Proof needed:**
  - Old way: a plain statement that greens powders are mixed into liquid.
  - New way: your serving facts, i.e. what's in one pack and how many gummies. `MISSING`.
- **How to read it:**
  - At day 7: link clicks.
  - At day 14 to 30: purchases from new customers.
- **Avoid:**
  - naming or picturing any powder brand
  - the buyers' words "gritty/chalky", "choking" and "$94" (those describe a rival)
  - nutrition comparisons you can't source

---

**Gap 3: Taste, for adults.** 4 buyers mention it. Sprout only speaks to taste through kids.

- **Code:** Product alone · Camera
- **Question:** What is it?
- **Picture:** a close-up of your actual gummies in their real colour, with the flavour named on the pack. One adult hand at most, and no kids.
- **Headline:** "Greens you'll look forward to" (5 words)
- **Proof needed:**
  - your flavour name
  - sugar or sugar-alcohol per serving, shown plainly (2 buyers raised taste and sugar-free doubts)
  - your own taste feedback before you claim anything stronger
  - `MISSING` for all of the above
- **How to read it:**
  - At day 7: link clicks.
  - At day 14 to 30: purchases from new customers.
- **Avoid:**
  - "fruit snacks", "treat" and "Actually Want" wording
  - any gut, weight or GLP-1 claim riding along in the caption
  - a "Sugar-Free" label unless your claims list allows it

## 8. Limits

- **Only 1 competitor**, so this map shows Sprout's habits, not the category's.
- **No screenshots or frames.** Types are judged from text only, and dress, logo checks and Product-alone use are unseen.
- **No library IDs or start dates.** There are no tiers, the 5-longest plus 5-newest rule couldn't be applied, and long-runners couldn't be compared with the newest ads.
- **No landing pages** were captured.
- **The buyer view is Sprout's buyers talking about Sprout.** Your own buyers may want different things.
- **Most star ratings weren't captured.** Sprout claims 4.8 stars from 100,000 reviews, while a public review site showed 4.0 from 2,411.
- **No spend or results** are visible in the Ad Library. "Copies live" is a bet, not a result.
- **Your claims list, facts and past ads are missing**, so the briefs can't be checked against what you already run or are allowed to say.

## 9. Score

3 checks passed out of 5 → 3 / 5 × 100 = **60 / 100**

- **Missed: every gap has a map or buyer reason and proof on file.** Each gap has a buyer reason and a map reason, but none has your proof, because your facts and reviews aren't written yet.
- **Missed: no competitor material in the briefs, and every claim is on the allowed list.** No competitor words, people or logos are used, but there is no allowed claims list to check the headlines against.
```
