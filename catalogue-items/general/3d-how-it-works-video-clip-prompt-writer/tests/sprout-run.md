# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 3.

The run did stage 0 and stage 1 correctly, stopped for approval, and kept to the script's parts key. It marked unreadable photos, label lines, voice rights and claim sources as MISSING instead of guessing.

## Judge list

- Met: Stopped for OK after avatar cards, sheets, storyboard (or marked approve)
  "Stop. Please approve these cards before I move to stage 2" – stopped after stage 1 as the skill requires; no later stages run.
- Met: Every link marked sourced or common knowledge, never assumed
  Common knowledge for "food for gut bacteria"; "6 g" needs label line; "supports digestion" flagged as brand claim needing source. Not assumed.
- Met: Parts key keeps same name, colour, shape in every prompt
  Only one stage run; key stated once: yellow strands, soft blue spheres, cream tube, matching the input.
- Met: Storyboard: product first appears at its own link
  No storyboard yet, but states "It is never shown at breakfast" and appears first at link 3.
- Met: Voice is brand-recorded/licensed and a person approved the read
  "The brand's own recorded narrator"; rights flagged MISSING, approval of read left for stage 5.

## Invented

- other: Stylised 3D adult woman, aged 30 to 40... knit top, trousers (Design choice for a character card, which the skill asks for; not a fact.)
- number: about 2.5 words a second (Pacing suggestion; arithmetic-ish production guidance, not a Sprout fact.)
- number: Each strand about 4 bacteria long, a fifth thick; clusters of 5 to 12; 30 bacteria across (Design scale for the visual, not a claim.)

## What went in

```text
Script (29 s, from "Show what your product does where no camera
can see"): chain: 6 g prebiotic fiber meets the bacteria already
in your gut, they feed on it, so it supports digestion. Surface:
"Breakfast at seven. But who else is eating?" Dive: "Now smaller
than a grain of salt, inside you." Links: bacteria wait; no fiber
when the powder stays shut; "Sprout brings six grams of prebiotic
fiber, food for them."; "They feed, and that supports digestion
and gut health." Surface again: a daily pack torn at the door.
Parts key: bacteria = small soft blue spheres; fiber = thin yellow
strands; the gut = a plain cream tube.
Cast note: the fiber carries it; the woman appears only at human
size, silent; calm, warm narrator.
Photos: [pouch front] [daily pack in a hand]
Voice: the brand's own recorded narrator.
```

## What came out

```text
I write the prompts only. No video tool is connected here, so no pictures or clips will come from this chat.

## Stage 0: Script in (locked script, tested)

| Test | Result |
|---|---|
| **Hidden** | Pass. Fiber meeting gut bacteria can't be filmed at normal size. |
| **True** | Passes only once the sources are in. "Prebiotic fiber is food for gut bacteria" is common knowledge. "6 g" needs the label line. "Supports digestion and gut health" is a brand claim and needs its source. |
| **Teaches** | Pass. The four boxes are: bacteria wait, no fiber, fiber arrives, they feed. Links 1, 2 and 4 teach without the brand name. |

**Honesty notes**
- "Supports" is a soft, true verb. It is fine as long as the picture shows only the bacteria feeding: no glowing gut, no tube changing shape, no relief.
- **Regulator flag:** this is a food supplement making a gut-health claim. In some markets, the word "prebiotic" and "supports digestion" are restricted health claims. The brand must read the script before any picture is made.
- **Body:** the gut stays a plain cream tube. Nothing see-through, no organs, no woman's body in the dive. The dive enters the tube directly, not through her.
- **Product placement:** the Sprout pouch must not appear in the breakfast opening. It appears first at link 3.
- **Closing match:** the script closes "at the door" but opens "at breakfast". To match the moments, set the door in the same kitchen, with the same light and the same woman, on the same morning. Please confirm.
- **Timing:** 4 + 4 + 16 (4 links × 4 s) + 5 = 29 s. This works.

## Stage 1: Avatar cards (approval 1)

### Parts key (the fiber is the avatar)

**Fiber, from Sprout (lead part)**
- Colour and shape: thin yellow strands, soft and slightly curling, like loose thread.
- How it moves: drifts in slowly and settles among the bacteria. It never "attacks" or "cleans".
- Size: each strand is about 4 bacteria long and about a fifth of a bacterium thick.

**Bacteria (the gut's own residents)**
- Colour and shape: small, soft blue spheres, matte, slightly squashy.
- How they move: before the fiber, they sit still with a faint idle wobble. With the fiber, they gather on the strands, and the strands slowly shorten as they feed.
- Size: the reference unit. They show in clusters of 5 to 12.

**The gut (the setting part)**
- Colour and shape: a plain cream tube with a smooth matte inner wall. No folds, veins, villi or anatomy.
- How it moves: it does not move. It holds still as the stage.
- Size: the tube's diameter fills the frame, about 30 bacteria across.

Everything else stays neutral: soft white light, faint cream haze for scale, no other colours.

### Product card: Sprout
- **Model:** the Sprout pouch and a single daily pack, modelled from the two photos.
- **Status:** `MISSING:` the photos didn't come through as images I can read. The pouch's colours, shape and label lines can't be checked against the real pack yet.
- **Where it appears:** at link 3, where it is named, and in the closing hand at the door. It is never shown at breakfast.
- **What it does on screen:** it releases the yellow strands, and nothing more.

### Person card (human size only)
- Stylised 3D adult woman, aged 30 to 40, with a soft, simple look. She is not a real person, an expert or a patient.
- Fully clothed in everyday morning clothes (knit top, trousers), with a calm expression.
- She is silent: no lip movement, never speaks.
- She appears in the opening breakfast shot and the closing door shot only.

### Voice
- The brand's own recorded narrator: calm and warm, unhurried, about 2.5 words a second.
- Off screen throughout.
- `MISSING:` confirmation the brand holds the rights to this voice for ads, and how "Sprout" and "prebiotic" are said (I assume "PREE-bye-OT-ick").

**Stop. Please approve these cards before I move to stage 2 (reference renders).**

### Gaps to fill later
- `MISSING:` readable product photos (front, side, top, out of the pack).
- `MISSING:` every label line, typed exactly, including the 6 g fiber line and the fiber's name.
- `MISSING:` source for "supports digestion and gut health", and the regulator markets the ad will run in.
- `MISSING:` brand colours and font, for captions and for "prebiotic" in the brand colour.
- `MISSING:` banned claims and what buyers assume.
- `MISSING:` current offer and price, for the closing on-screen text.
- `MISSING:` pronunciation of hard words, and confirmation of the voice rights.
- `MISSING:` your video tool's clip lengths, and whether it takes a first and last frame.
```
