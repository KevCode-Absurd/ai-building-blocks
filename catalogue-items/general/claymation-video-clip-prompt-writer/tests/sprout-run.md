# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run did exactly what the skill demands at this point: read the script without changing it, wrote clean fixed lines and an avatar card, listed every gap as MISSING, and stopped for approval. Nothing about Sprout was invented, and the owner gets a clear, correct first checkpoint to approve or tweak before images are made.

## Judge list

- Met: It stopped for your OK after the avatar card, the sheets and the storyboard.
  "Stage 1 approval: please approve or correct... I won't start the reference image prompts (stage 2) until you approve." Later stops not yet reached.
- Met: The lock lines appear word for word in every still and clip prompt.
  Not testable yet: run correctly halted at approval 1; fixed lines written once in Stage 0, no prompts produced yet.
- Met: Each clip has one mover and one camera instruction, and there is at most one morph, made from a first and last frame.
  Not testable yet; shot list already isolates one mover per shot and marks shot 6 as the single MORPH ("tower").
- Met: The product follows its one product line in every shot, with the label exactly as printed.
  Not testable yet; run flagged "MISSING: the wordmark text and every other label line" and side/top photos face away until supplied.
- Met: The change happens in view, by a clay move, and never pops or vanishes.
  Planned correctly: "the tower squashes down into the counter in stepped clay poses"; clips not yet produced.

## What went in

```text
Script (30 s, from "Show what your product does, in a clay
animation ad"):
Object: a leaning grey clay tower of powder tub, scoop and shaker.
Before: it teeters. Changing: it squashes down into the counter.
After: a clear counter, the pouch on it.
Character: a clay man, 6 heads tall, slim, warm beige clay, short
dark hair as one shape, rust jumper, grey trousers, bead eyes, a
small clay watch. Cast note: he carries it, silent, with a narrator.
Set: kitchen counter, shelf, sink, window. Handled finish. Water in
the sink as clear gel. Before: blue-grey with one dull khaki.
After: forest green, cream and sunflower.
Product: the real pouch photo, lit to match the set.
Shots: 1 whole set, tower teeters (mover: tower) ... 5 he tears
the pack straight across the top, bears tip into his palm (hands)
| 6 MORPH: the tower squashes into the counter (tower) ... 9 held.
Pouch photo attached: glossy deep green, big yellow wordmark,
"28 Daily Packs". Tool: 4 to 6 second clips, 9:16, 3 references,
first and last frame.
```

## What came out

```text
# Stage 0: Script in

## Shot list: movers and states (shot table read as given, not changed)

| Shot | Picture | Mover | Tower state |
|---|---|---|---|
| 1 | Whole set, the tower teeters | tower | before (teetering) |
| 2–4 | `MISSING: rows 2–4 (picture, mover, state)` | n/a | before (assumed) |
| 5 | He tears the pack straight across the top and the bears tip into his palm | his hands | before |
| 6 | MORPH: the tower squashes into the counter | tower | changing |
| 7–8 | `MISSING: rows 7–8 (picture, mover, state)` | n/a | after (assumed) |
| 9 | Held | none (held frame) | after |

## Changing object, three states
- **Before:** a leaning grey clay tower of a powder tub, a scoop and a shaker. It teeters on the counter.
- **Changing:** the tower squashes down into the counter in stepped clay poses.
- **After:** a clear counter with the pouch on it.

## Fixed lines
- **SET:** "a handmade stop-motion tabletop set, matte modelling clay with some thumbprints, photographed with a macro lens: a kitchen counter, a shelf, a sink and a window. The water in the sink is clear gel, the window glass is clear acrylic, and the view outside is a printed paper card of plain sky. The powder tub, scoop and shaker are plain grey clay with no labels. No words anywhere on the set."
- **LIGHT:** "one soft key light from frame left, on the window side, and a soft fill from frame right; bright enough to see the thumbprints and tool marks."
- **LENS:** "shallow focus, the subject sharp and the background soft, so it reads as miniature; camera at the man's eye level on a stand. The edges of the set never show."
- **PALETTES:** "Before: greyed and cool, blue-grey with one dull khaki. After: forest green, cream and sunflower. Until the tower squashes, the pouch is the only thing in brand colours."

## MISSING
- `MISSING: narration lines for all 9 shots`
- `MISSING: shot table rows 2–4 and 7–8; shot 9 mover and seconds per shot`
- `MISSING: the wordmark text and every other label line in order (only "28 Daily Packs" is given)`
- `MISSING: pouch side and top photos` (until supplied, those sides face away)
- `MISSING: brand confirmation that the pouch opens by tearing straight across the top, and that the bears tip out loose into the palm` (shot 5 depends on both)
- `MISSING: real colour of the bears` (they must keep it on screen)
- `MISSING: brand file (approved claims, never-show list) and the live offer and price`
- `MISSING: narrator voice brief` (a proposal is on the card below)

---

# Stage 1: Avatar card

**The clay man.** An adult man about 6 heads tall with a slim build, made of warm beige matte clay with some thumbprints. His short dark hair is a single sculpted shape. He wears a rust jumper and grey trousers. His eyes are two small black bead eyes. His one mark is a small clay watch on his left wrist. His hands are chunky clay hands with rounded fingertips and no nails.

- **Voice:** he never speaks and never mouths words, and his mouth stays still in every shot. The narration comes from an off-screen narrator: a warm, calm adult voice, mid-pitched and unhurried, speaking plainly as in a conversation. The voice is designed for the ad, never cloned.
- **Never changes:** height of 6 heads, slim build, warm beige clay, the one-piece dark hair, the rust jumper, the grey trousers, the bead eyes, the watch on the left wrist, the chunky no-nail hands and the closed, still mouth.
- **Rules:** he is an adult, not a child, and he is not based on a real person, a known character or any brand's mascot. No human hands ever enter the set.
- **Palette note:** rust and grey are not brand colours, so the "pouch only in brand colours" rule still holds. The jumper stays matte and slightly muted so it doesn't compete with the pouch.

**Stage 1 approval:** please approve or correct the fixed lines and the avatar card, especially the key light from frame left and the narrator voice. I won't start the reference image prompts (stage 2) until you approve.
```
