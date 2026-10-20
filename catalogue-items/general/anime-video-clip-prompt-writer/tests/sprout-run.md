# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run did exactly what the skill asks at this point: it read the script without changing it, showed its word and length arithmetic, admitted it could not see the photos, built a usable original adult avatar card and stopped for approval. The STAGE 4 heading is absent only because the storyboard stage has not been reached yet, and every gap (brand name, pack words, offer, brand file, photos) is marked MISSING rather than guessed.

## Judge list

- Met: Stopped for OK after avatar card, sheets and storyboard, or marked each (approve) when asked for all stages
  "Stop: approval 1. Approve this avatar card or tell me what to change." User's "go ahead" answered the missing-inputs question, not a request for all stages.
- Met: Lock lines the same word for word in every prompt
  Not yet reached: run correctly halted at approval 1, before Stage 3 lock lines. Look line kept verbatim from input so far.
- Met: Every shot card has two key poses, a hold, and a moves and holds line
  Not yet reached: storyboard is Stage 4, after required stop. Stage 0 lists shots unchanged and a payoff pose.
- Met: Hero faces the same way toward the product unless a turn is shown
  Card locks it: "He faces screen right toward the product unless a turn is shown on screen" and "The right hand holding the product in every shot".
- Met: Dialogue matches the script exactly; no artist, studio, series or character named
  Quotes "Same fight, every morning." / "Or skip the scoop." / "Rip. Tip. Enjoy." verbatim; describes traits only, no names.

## What went in

```text
Script: the 20-second script from "Get an original anime ad
script". Look (proposed): thick even marker outline, flat colour
with one shadow tone, full bright palette, flat graphic
backgrounds. Shot 1: the hero glares at a towering tub of powder.
Shot 2: a scoop of powder puffs into his face. Shot 3: he tears a
daily pack across the top. Shot 4: gummies tip into his palm.
Shot 5: he heads out the door, pouch in hand.
Narration: "Same fight, every morning." / "Or skip the scoop." /
"Rip. Tip. Enjoy."
Cast note: the hero carries it, silent, with a narrator.
Photos: [pouch front] [daily pack in a hand] [gummies in a palm]
Pouch: glossy deep green, big yellow wordmark, yellow bear face
top right, "28 Daily Packs". Daily pack words: not captured.
Handling: tear the daily pack straight across the top only.
Tool: 8-second clips, up to 3 reference images, takes an end frame.
```

## What came out

```text
I can only write the prompts. I can't make pictures or video in this chat.

Your photos came through as names only ([pouch front], [daily pack in a hand], [gummies in a palm]), so I can't see them. I'm taking the pouch's look from your description, and the product sheet's photo check is still to do.

## Stage 0: Script in

**Shots (as given, unchanged)**
1. The hero glares at a towering tub of powder.
2. A scoop of powder puffs into his face.
3. He tears a daily pack across the top.
4. Gummies tip into his palm.
5. He heads out the door, pouch in hand.

**Narration (exact)**
- "Same fight, every morning."
- "Or skip the scoop."
- "Rip. Tip. Enjoy."

**Word counts, line by line**
- Line 1: 4 words
- Line 2: 4 words
- Line 3: 3 words

**Lengths (proposed)**
- Shots 1 to 5 run 4 s each: 4 + 4 + 4 + 4 + 4 = 20 s.
- Each shot fits inside your 8-second clip limit.

**Narration placement (proposed)**
- Line 1 plays over shot 1.
- Line 2 plays over the end of shot 2, after the puff.
- "Rip." plays over shot 3, "Tip." over shot 4 and "Enjoy." over shot 5.

**Claims in the script:** none beyond showing the product being opened and used. Nothing will be drawn beyond that.

**Handling:** the daily pack tears straight across the top only.

**Look line (your proposal, kept):** thick, even marker outline; flat colour with one shadow tone; full bright palette; flat graphic-shape backgrounds.

**Payoff pose:** at the open doorway, the hero turns three-quarters toward screen right. His right hand holds the pouch by its side edge at chest height, with the front (yellow wordmark and bear face) square to camera. Clear space sits to the pouch's left for the offer line.

## Stage 1: Avatar card

**Role:** Hero. He is silent and carries every shot. The narrator is heard but never seen.

**Age and look:** An original adult man, about 28 to 35. He has an average build, a slightly long face, heavy straight eyebrows built for a big glare, and warm brown skin.

**Silhouette:** One tall, forward-swept tuft of hair, like a wave crest. An oversized hoodie with the hood down. A messenger-bag strap runs from his left shoulder to his right hip.

**Clothes (3 colours):**
- Coral-red hoodie with white drawstrings
- Navy joggers
- White sneakers

The coral-red is chosen to stand apart from the deep green and yellow pouch.

**Props:**
- Mustard-yellow messenger bag (strap as above)
- Towering powder tub with a scoop (shots 1 and 2 only)
- Daily pack, gummies and pouch (shots 3 to 5)

**Voice:**
- Hero: none, he never speaks.
- Narrator (proposed): an adult voice, mid-low pitch, dry and unhurried, with a neutral accent. It will be designed from this card and never cloned.

**Must never change:**
- The hair tuft shape
- The coral hoodie colour
- The strap running left shoulder to right hip
- The right hand holding the product in every shot
- He faces screen right toward the product unless a turn is shown on screen

**Gaps so far**
- MISSING: product or brand name (the wordmark text)
- MISSING: words printed on the daily pack. The daily pack faces sideways in every shot until these are given.
- MISSING: current offer and terms for the end card
- MISSING: brand file (approved claims, never-show list, exact colour codes)
- MISSING: visible product photos. The photo check on the product sheet is still to do.

**Stop: approval 1.** Approve this avatar card or tell me what to change. I'll start the reference image prompts once you approve.
```
