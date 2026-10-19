# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 3 of 5 met. Invented facts: 3.

The plan is well structured, with sensible skips and clear MISSING lines. But it stretches review 5 into a failed Try and a Before scene with bottles on the counter, which the files do not support, and it scores itself 100 despite that.

## Fix

In step 1 and the check list, add a rule that a Try or Before point must be stated in the supplied facts (not inferred from a review's side remark) and that the self-score must fail the needs-met check if it is stretched.

## Judge list

- Met: Each script would be called a different ad from its neighbour.
  Talk doubt, Show demo, Story tries, Talk offer: different openings, selling beats and shapes.
- Not met: Each type's needs are met by a fact supplied, named next to it.
  Tries in a row Try 2 cites "pill stacks, multivitamins" and review 5, but review 5 is about gummies, not a failed try.
- Not met: At least three selling beats and, where facts allow, all four groups.
  Four beats, but only three groups. Making of (Show) and Day in use qualified, yet Teach was unfilled; claim of no qualifying Teach type holds.
- Met: Two types never open on the same fact.
  Openings: Last doubt, tear-tip-eat demo, gritty powder (review 3), gummy bottles (review 5).
- Met: Every skipped type has a reason, and missing facts are marked.
  Line-up "MISSING: a real test against rivals"; Turning point, Someone noticed, Real cause, Time-lapse MISSING.

## Invented

- claim: Try 2 is a stack of separate probiotic, B12 and multivitamin gummies ... review 5 (Review 5 says the reviewer stopped buying these; it is not stated as a failed try, and the buyer brief says pill stacks, not gummy bottles.)
- claim: separate probiotic, B12 and multivitamin gummy bottles on the counter ("On the counter" is invented; review 5 only says stopped buying separate gummies, and the buyer's Before is pill stacks.)
- claim: Time-lapse ... length (45 to 60 s) is also at or under the 60-second floor (Skill says a time-lapse needs 60 or more; this is reasonable, not invented.)

## What went in

```text
Buyer: the quitter who wants to stick, 28 to 45. Has quit greens
powders, pill stacks and multivitamins. Doubt: "A gummy can't
hold enough to replace my powder."
Reason to buy: one daily habit that lasts.
Offer: $29.99 first order with the text sign-up, renews at $49.99
every 4 weeks. 30-day money back, first order only.
Knows: the problem and the fixes, not Sprout. Length: 45 to 60 s.
Voice: playful, cheeky, no guilt.
What we can supply:
- 1 pack = 60+ ingredients, 21 vitamins and minerals, 6 g fiber;
  tear, tip, eat; no water, no shaker
- reviews: "the drink was definitely gritty/chalky" (3); "I also
  stopped buying separate probiotic gummies, b12 gummies, and
  multivitamin gummies." (5); "So easy to grab and eat on my way
  to the billion things I have to do as a mom." (15); "I thought
  the first pack I tried tasted terrible, but after the third day
  they started tasting better" (18)
- survey, of surveyed users: "95% ... take [Sprout] at least
  4-6x per week with 80% taking daily"
- pectin base, vegan; third-party tested for 70 pesticides
Not on file: time points, a day count, a test against rivals.
```

## What came out

```text
Batch: 4 scripts
1. Doubt first (Talk) | selling beat: doubt | opens on: the Last doubt, granted as fair: "A gummy can't hold enough to replace my powder" | tone: curious -> confident | needs met: Last doubt, quoted in the buyer brief. The proof aimed at it is 1 pack = 60+ ingredients, 21 vitamins and minerals, 6 g fiber (product facts). The matching guarantee is 30-day money back on the first order (offer terms). The script states the per-pack numbers and makes no claim that a pack equals a powder.
2. Show it working (Show) | selling beat: proof | opens on: mid-demo, one continuous take of tear, tip, eat, with no water and no shaker | tone: matter of fact -> pleased | needs met: "tear, tip, eat; no water, no shaker" (product facts). Outside proof is the survey line "80% taking daily" (survey of users) and "third-party tested for 70 pesticides" (product facts). The demo shows only the product in use, never an effect on a body.
3. Tries in a row (Story) | selling beat: how it works | opens on: the first try, a greens powder, "definitely gritty/chalky" | tone: fed up -> relieved | needs met: two Tries. Try 1 is greens powder (buyer brief, review 3). Try 2 is a stack of separate probiotic, B12 and multivitamin gummies (buyer brief "pill stacks, multivitamins", review 5). How it works, as the thing both tries missed, is one pack with tear, tip, eat and no water (product facts). Tries are named as kinds of product, never brands.
4. Straight case (Talk) | selling beat: offer | opens on: the Before, said to "you": separate probiotic, B12 and multivitamin gummy bottles on the counter | tone: amused -> matter of fact | needs met: Before point from review 5 and the buyer brief ("pill stacks, multivitamins"). The offer is $29.99 first order with text sign-up, renewing at $49.99 every 4 weeks, with 30-day money back on the first order only (offer terms). The renewal price is said aloud.

Spread: Talk (2), Show (1) and Story (1) are used. No Teach type qualifies (see below), so the fourth slot goes to a second Talk type, Straight case, set to the offer beat, which is the one selling beat no other script carries. Selling beats used are doubt, proof, how it works and offer (4 of 4). The openings are the Last doubt, the tear-tip-eat demo, the gritty powder from review 3, and the counter of separate gummy bottles from review 5. No two scripts share an opening point or fact. Starting tones are grounded in research and fit the playful, no-guilt voice. Curious comes from the stated doubt. Matter of fact suits the demo. Fed up comes from review 3, "definitely gritty/chalky". Amused comes from the wry list in review 5. Worry was not used because nothing on file is at stake.

Skipped types and why
- Flaw first: qualifies, using the real shortcoming in review 18 ("the first pack I tried tasted terrible, but after the third day they started tasting better"). Not chosen because its selling beat, doubt, is already carried by Doubt first. It is the first swap if Doubt first underperforms.
- Offer up front: the buyer doesn't know Sprout yet, and this type is weak on cold buyers.
- Day in use: qualifies, using review 15 ("grab and eat on my way to the billion things I have to do as a mom") and the survey's "80% taking daily". Not chosen because its proof beat is already carried by Show it working in the same group.
- Line-up: MISSING: a real test against rivals, or checkable facts on rival kinds of product.
- Making of: qualifies, with pectin base and vegan as the decision and third-party testing for 70 pesticides as the outside proof. Not chosen because the Show group is already filled and its beat, how it works, is carried by Tries in a row.
- Mirror: suits buyers unaware of the problem. This buyer knows the problem and the fixes.
- Turning point: MISSING: a real Trigger with stakes. It is also aimed at less-aware buyers.
- Someone noticed: MISSING: a real customer account of another person noticing. It is also aimed at buyers aware only of the problem, so the filming-notes route was not used.
- The real cause: MISSING: one true cause. This is why Teach has no qualifying type.
- Time-lapse: MISSING: time points and effects the business can back. Review 18's single "third day" remark is not a backed timeline. The length (45 to 60 s) is also at or under the 60-second floor.

Scripts: none written, because no writing skill is paired.

Score: 100/100 (5 of 5 checks passed; 5 ÷ 5 × 100 = 100). Check 5 ("no recipe example in a script") passes for this plan. Run it again once the scripts are written.
```
