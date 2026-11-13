---
name: ad-structure-map
description: "Learn which parts of an ad actually predict sales for this store. Maps the store's own judged winners and losers second by second (video) or zone by zone (static) on six parts a buyer needs: the moment they recognise, the feeling, the proof, the payoff, the ask, and the product and brand. Records when each part first appears, compares store cost per purchase between ads that carry a part early and clearly and ads that do not, and turns the result into a tuned house checklist with sample sizes and an honest association-not-cause label. Also reverse-engineers a single winner into a remake map that says what to keep and what can change. Feeds `prelaunch-ad-check`. Use quarterly, after a batch of results, or before remaking a winner. Read access only."
---

# Ad structure map for an online store

**You get:** a part-by-part comparison of the store's winning and losing ads, a house checklist backed by evidence, ad maps of every judged ad, a remake map for one winner and a fix list for losers still spending.

## When to use

- The store has 20 or more judged ads and wants to know what its winners have in common.
- A winning ad needs remaking with a new buyer, person or format, and the team must know which parts carry it.
- The pre-launch checklist feels generic and the team wants it tuned to its own results.
- A new creator or agency needs a one-page "what works here" sheet backed by numbers.
- Once a quarter, to refresh that sheet.

## Not for

- Pass or fail on a single draft before launch: use `prelaunch-ad-check`; this skill tunes the checklist it uses.
- Where viewers drop off in one running video: use `video-ad-retention-fix`.
- Zones and sizes for a new static layout: use `static-ad-layout-blueprint`.
- Making more ads in a winner's visual style: use `new-ads-from-store-winners`.

## What you need

Required:

1. **Ads Manager export, ad level, last 90 to 180 days:** Ad ID, Ad name, Amount spent, Impressions, 3-second video plays, Link clicks, Purchases (7-day click).
2. **Store orders by ad ID** (`utm_content`), or the order export for a store-side check.
3. **Target cost per purchase (CPP)** and gross profit per purchase, from `store-meta-math`.
4. **The creative** for every judged ad: video files or previews with length, statics as images, plus primary text and headline.
5. **Claims allowed and proof bank** from `store-meta-brand-dna`.

Optional: each ad's awareness stage and concept key from `weekly-creative-sprint` or `creative-gap-map`; sale calendar.

Missing 2: name winners on Meta 7-day click and mark the result "reduced confidence". Missing 4 for some ads: leave them out and say how many.

**Access:** level 1 (read).

## Before you start: the gates

1. **Money.** *Pass:* target CPP from gross profit per purchase. *Fail:* stop; without it there are no winners to learn from.
2. **Volume.** *Pass:* at least 10 judged winners and 10 judged losers (practitioner default, test it). *Fail:* run the single-winner map (step 6) only and label any pattern "directional".
3. **Tracking.** *Pass:* Meta 7-day click purchases are not above store orders. *Fail:* use store orders only.
4. **Clean data.** Ads whose spend fell mostly in a sale period are left out; sale results mostly show which product was discounted [MCR-0068].

## Steps

### 1. Pick the judged ads

Judged = spent at least 3x target CPP [ADC-0039]. Winner = store CPP at or under target. Loser = store CPP above 1.5x target, or 0 to 1 purchases at 3x (practitioner default, test it). Ads in between are left out of the comparison so the two groups differ clearly. Judge at ad set level where ads share a set and the set's result is clearer [ADC-0059].

### 2. Define the six parts

| Part | The buyer's question it answers | Counts as clear when |
|---|---|---|
| Moment | "That's my situation." | A specific, shown or spoken situation, not a category |
| Feeling | "I care about this." | A stake the buyer feels, shown by a person or a scene |
| Proof | "Why believe it?" | Counted reviews, a named reviewer with source [LPG-0037], a test, or a demonstration, all on claims allowed |
| Payoff | "What do I get?" | One concrete result or benefit |
| Ask | "What now, and what is the risk?" | A clear next step plus the offer or risk reducer from the page |
| Product and brand | "What is it, who makes it?" | Product visible and brand named or shown |

### 3. Map every judged ad

**Video:** cut into 3-second blocks. For each block note what is seen, said and shown as text, and which part it carries. Record the first second each part appears clearly.

**Static:** cut into zones (top line, image, overlay, bottom line, first 125 characters of primary text, headline). Note which part each zone carries and whether it reads within about 3 to 4 seconds [MCR-0024].

Score each part 0 (absent), 1 (implied or weak), 2 (clear). A part that first appears after the point most viewers have left scores 1 at most: only about 15% of viewers reach a typical video's second half [MCR-0077]. Tag every ad the same way, by the same rules [MCR-0051].

### 4. Compare winners with losers

For each part:

| Measure | How |
|---|---|
| Share of winners scoring 2 | Count |
| Share of losers scoring 2 | Count |
| Median store CPP, ads scoring 2 versus 0 to 1 | From step 1 |
| Median first second (video) | Winners versus losers |

A part **predicts** for this store when ads scoring 2 have at least 20% lower median store CPP than ads scoring 0 or 1, with at least 5 ads on each side (practitioner default, test it). Under that, call it "directional".

Then split by awareness stage where the sample allows. Order matters by stage: for cold, problem-aware ads the moment and feeling usually come first and the product later [MCR-0011] [MCR-0056]; the sense of being sold should rise gradually, not jump [MCR-0027]. Long explainer videos usually need objections and a risk reducer before the ask [MCR-0032]. Check whether the store's own winners follow those patterns or break them, and trust the store's data when the sample passes.

### 5. Write the tuned house checklist

For each part: required or optional, by stage; latest second (video) or zone (static) it must appear; the evidence (ads per side, CPP gap, date). Example row: "Proof, required for cold video, by second 12; winners 9 of 12 scored 2, losers 3 of 14; median store CPP 31% lower; 26 ads, Q3." Hand the checklist to `prelaunch-ad-check` as the store's rubric.

### 6. Map a single winner for remaking

For the winner to remake:

| Block or zone | Part | What carries it | Keep or free to change |
|---|---|---|---|

Mark as **keep** the parts that predict for this store and the order they come in. Mark as **free** the person, setting, wording and style, as long as each kept part stays as clear and as early. A remake that keeps the script but changes the person or setting is a known way to extend a winner [MCR-0012]. Never invent proof to fill a part the store cannot back; if a predicting part relies on proof the store lacks, list how to get it (a post-purchase survey, a creator test).

### 7. Write fixes for weak ads, sparingly

For losers that still spend, name the one missing predicting part and where it should go. Do not rebuild every ad around the checklist; parts that do not predict for this store are not worth the edit. No fix may add a line implying the viewer has a condition [MCR-0020].

## Checks before you hand it over

1. Winners and losers are defined from store CPP at 3x target spend, with sale-period ads excluded.
2. Every judged ad has a block or zone map with scores.
3. Proof scored 2 only when it is on claims allowed.
4. Each "predicts" call shows ads per side and the CPP gap; small samples say "directional".
5. The report says plainly that this shows association, not cause: winners differ in many ways at once.
6. The remake map marks each part keep or free, with reasons.
7. No fix invents proof or customer words.

## Output

1. **One-screen summary:** ads judged, the parts that predict for this store and by how much, the biggest change to the house checklist, the remake plan in one line.
2. **Part comparison table:** Part, Winners scoring 2, Losers scoring 2, Median store CPP (2 vs 0 to 1), Gap, Median first second, Predicts (yes, no, directional).
3. **House checklist** `ad-structure-checklist.md` with evidence per row.
4. **Ad maps** `ad-structure-maps.csv`: Ad ID, Block or zone, Seen, Said, Text, Part, Score.
5. **Remake map** for the chosen winner.
6. **Fix list** for spending losers: Ad, Missing part, Where, Fix.

## Common mistakes

- **Using a fixed four-part formula as truth.** Step 4 tests each part against the store's own results.
- **Counting a payoff that arrives after most viewers left.** Step 3 caps late parts at 1.
- **Reading association as cause.** Checks say so and set sample minimums.
- **Mixing sale-week ads into the comparison.** The clean-data gate drops them.
- **Scoring proof the store cannot back.** Step 2 requires claims allowed.
- **Leaving out the ask and the product.** Step 2 makes them parts like any other.

## Sources

- ADC-0039: judge after 3x target CPA.
- ADC-0059: judge at ad set level where clearer.
- LPG-0037: named reviewers and sources read as real.
- MCR-0011: most ads in early awareness stages.
- MCR-0012: reshoot a winning script in a new setting.
- MCR-0020: avoid implying a condition.
- MCR-0024: clear statics read in 3 to 4 seconds.
- MCR-0027: raise the sell gradually.
- MCR-0032: explainer videos need objections and risk reversal.
- MCR-0051: tag every ad on the same fields.
- MCR-0056: one awareness stage per ad.
- MCR-0068: sale periods corrupt creative reads.
- MCR-0077: only about 15% reach the second half.

What makes this skill ours: the checklist is learned from the store's own winners and losers on store cost per purchase, with sample minimums and an honest association-not-cause label; a part only counts if it appears clearly before most viewers leave; proof only counts if it is on the approved claims list; and the ask and the product are measured like any other part, then handed to the pre-launch check as the store's own rubric.
