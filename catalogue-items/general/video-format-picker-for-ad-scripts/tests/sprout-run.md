# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 3.

The analysis is sound and tied to the script, correctly picking the problem as the carrying part and warning that the renewal terms must stay visible. But it deviates from the required output shape and misapplies the scoring rule, so it isn't a clean result.

## Fix

In step 3 and the hand-back shape, require ranking to follow the script's musts only with the format's real score plus a stated tie-break, and require the exact shape headings (Part that carries it, Why, Properties, Best formats, Blend, Make it with, Length). Also forbid listing a surface (Mixed) with a 100 score when it adds nothing.

## Judge list

- Met: Every "must" quotes a line from your script.
  Order and Time musts quote "A Sprout pack takes one tear." and "Greens powder takes a scoop, water and a shaker."
- Met: The carrying part comes from what the script spends its lines on, not the product page.
  "The problem... Lines 1–2 spend the most time on the powder routine"
- Met: Each ranked format has a reason tied to the script, not "it's popular".
  Animated: "Holds order and time... pack opening onto line 4"; carousel tied to three-step contrast.
- Met: The length check says where extra length would come from, not just "make it longer".
  "the problem: more of the routine, such as clumps... an objection... proof"
- Met: It doesn't treat an AI-generated presenter as a real customer.
  "An AI presenter could act out the scoop-and-wash hassle, but would only be acting it, never vouching."

## Invented

- number: The opening and problem (lines 1–2) take about 6 s, the tear about 2 s, line 4 on screen about 5 s, line 5 about 2 s, and the offer card about 4–5 s. (Timing breakdown is an estimate presented as fact; plausible planning guess, not from inputs.)
- other: clumps, a rushed morning, or the shaker left in a bag (Suggested ideas for extra length; marked as examples, acceptable.)
- other: Card 1 is scoop + water + shaker, card 2 is washing, card 3 is one tear, card 4 is the facts and offer. (Suggestion, not a fact; fine.)

## What went in

```text
Script (20 s, narrated):
1 "Greens powder takes a scoop, water and a shaker."
2 "Then the shaker needs washing."
3 "A Sprout pack takes one tear."
4 "Inside: sixty-plus ingredients, 21 vitamins and minerals, 6 grams
   of fiber."
5 "One tear. That's the routine."
Offer on screen: $29.99 first order with text sign-up. Renews at
$49.99 every 4 weeks.
Product: daily greens gummies, bought again (subscription).
Limits: no presenter booked.
```

## What came out

```text
Carrying part: The problem (ending a daily hassle the buyer already knows). Lines 1–2 spend the most time on the powder routine, "Greens powder takes a scoop, water and a shaker." / "Then the shaker needs washing.", and lines 3 and 5 pay it off: "A Sprout pack takes one tear." / "One tear. That's the routine."

Needs:
- A believed face: no. Nothing is vouched for or lived on camera. It is a narrated comparison: "Greens powder takes a scoop, water and a shaker."
- Showing the unseen: helps. "Inside: sixty-plus ingredients, 21 vitamins and minerals, 6 grams of fiber" gains from opening the pack visually, but the argument stands without it.
- Controlled order: must. "A Sprout pack takes one tear." only works after "Then the shaker needs washing." The contrast is a set-up and a payoff.
- Sound: helps. "One tear. That's the routine." is written with spoken rhythm, but it survives muted if every line is on screen.
- Time: must. "Greens powder takes a scoop, water and a shaker." / "Then the shaker needs washing." is a sequence of steps. The hassle has to be seen taking seconds before "one tear" lands as short.
- Sounds like a person: no. "Greens powder takes a scoop, water and a shaker." is a brand-voice statement, not a person speaking.

Surfaces (2 musts: controlled order, time. Video surfaces are read as holding time; stills are not):
1. Animated, drawn or handmade: 2 of 2 = 100. Holds order and time. Also holds the "helps" of showing the unseen (the pack opening onto line 4) and attention. Narration supplies the sound. It needs no presenter, which fits "no presenter booked."
2. One person on camera: 2 of 2 = 100. Holds order and time, plus the "help" of sound. It ranks below animated on helps (it can't show the unseen) and on limits (no presenter booked). An AI presenter could act out the scoop-and-wash hassle, but would only be acting it, never vouching.
3. Mixed (person, then animation, then person): 2 of 2 = 100. It adds nothing the script needs. It costs two kinds of footage and still needs a presenter.
4. Carousel: 1 of 2 = 50. Partial order is enough for the three-step contrast (scoop and shake / wash / tear). It can't hold time.
5. Long-text image ad styled as a post: 0 of 2 = 0. It can't hold order or time.
6. Designed image ad: 0 of 2 = 0. It can't hold order or time.

No blend is needed, because one part carries the whole script.

Make it with:
- Video, ranked #1 surface, answering controlled order and time: `paper-craft-video-ad-script-writer`, then `paper-craft-video-clip-prompt-writer`. This is the problem told playfully: a cut-paper scoop, water, shaker and sink, then one clean tear. The buyer already knows this hassle, so "told gently or playfully" fits better than the "buyer doesn't see it yet" styles.
- Alternative in the same surface, also for order and time: `clay-town-video-ad-script-writer`, then `clay-town-video-clip-prompt-writer`.
- Fallback still, answering order only (scores 50): `carousel-ad-writer`. Card 1 is scoop + water + shaker, card 2 is washing, card 3 is one tear, card 4 is the facts and offer.
- Offer card: show "$29.99 first order with text sign-up. Renews at $49.99 every 4 weeks." in full and readable. The renewal terms must not be cut in any version.

Length: Fits at 20 s, and 20 s is the best length here.
- The opening and problem (lines 1–2) take about 6 s, the tear about 2 s, line 4 on screen about 5 s, line 5 about 2 s, and the offer card about 4–5 s.
- 15 s works only if the tear is played as the demo, so opening and proof happen at once, and line 4 is trimmed.
- At 30 s or more, extra length would come from:
  - the problem: more of the routine, such as clumps, a rushed morning, or the shaker left in a bag
  - an objection, such as taste or sugar per serving, which needs real product facts the script doesn't give
  - proof
- A longer version should be written as its own script, not stretched from this one.
```
