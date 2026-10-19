# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, correct first step: it declared no video tool, built the fixed lines and avatar card straight from the script, flagged the missing shots, label lines and photo, and stopped where the skill says to. The owner gets nothing to make yet, but also nothing guessed; sending the photos and label lines unlocks the rest.

## Judge list

- Met: It stopped for your OK after the avatar card, the sheets and the storyboard.
  "Stopping here. Please approve or correct the fixed lines and avatar card ... before Stage 2." Stopped after stage 1 as required.
- Met: The lock lines appear word for word in every still and clip prompt.
  No still or clip prompts exist yet (correctly halted at approval 1); fixed lines are written in full and quoted, ready to paste.
- Met: Each clip has one mover and one camera instruction, and at most one morph from a first and last frame.
  No clips yet; shot table already names one mover per shot and flags "6 MORPH ... (tower)" as the single morph.
- Met: The product follows its one product line in every shot, with the label exactly as printed.
  Product line held to real photo; refused to guess label: "MISSING: every label line in order." No sheet written without the photo.
- Met: The change happens in view, by a clay move, never pops or vanishes.
  States listed: "Changing: it squashes down into the counter"; morph planned as a clay move at shot 6. No clip yet to break it.

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
No video tool is connected to this chat, so I'll write the prompts and you'll make the pictures and clips in your own tools.

## Stage 0: Script in

**Shots, movers and states (script wording unchanged)**

| Shot | Picture | Mover | Tower state |
|---|---|---|---|
| 1 | whole set, tower teeters | tower | before: teeters |
| 2–4 | `MISSING: shots 2–4 (narration, picture, mover, state, seconds)` | — | — |
| 5 | he tears the pack straight across the top, bears tip into his palm | hands (him) | before, still standing (please confirm) |
| 6 | MORPH: the tower squashes into the counter | tower | changing: squashes down into the counter |
| 7–8 | `MISSING: shots 7–8` | — | — |
| 9 | held | none (one small repeat only, such as a blink) | after: a clear counter, the pouch on it |

**The changing object's three states**
- **Before:** a leaning grey clay tower of powder tub, scoop and shaker. It teeters.
- **Changing:** it squashes down into the counter.
- **After:** a clear counter, the pouch on it.

**Fixed lines**
- **SET:** "a handmade stop-motion tabletop set, matte modelling clay with some thumbprints, photographed with a macro lens. A kitchen: counter, shelf, sink, window. Water in the sink is clear gel; the window glass is clear acrylic. No words anywhere on the set."
- **LIGHT:** "one soft key light from the window, camera left, and a soft fill from camera right; bright enough to see the thumbprints and tool marks."
- **LENS:** "shallow focus, the subject sharp and the background soft, so it reads as miniature; the camera at the clay man's eye level on a stand; the edges of the set never show."
- **PALETTES:** "Before: greyed and cool, blue-grey with one dull khaki. After: forest green, cream and sunflower. Until the change, the pouch is the only thing in brand colours. The clay man's own colours stay the same throughout."

## Stage 1: Avatar card (approval 1)

**CHARACTER:** "a clay man, 6 heads tall, slim build, warm beige clay; short dark hair sculpted as one smooth shape; a rust jumper and grey trousers; small black bead eyes; one mark, a small clay watch on his left wrist; chunky clay hands with rounded fingertips and no nails. He never speaks or mouths words; his mouth stays still."

- **Narrator's voice** (my suggestion, please confirm or change): a warm, calm adult voice, unhurried and friendly, in a plain everyday accent. It will be a designed voice, never a cloned one.
- **Never changes:** 6-heads-tall proportions, beige clay, the one-shape dark hair, the rust and grey clothing colours, the bead eyes, the watch on his left wrist, the nail-less rounded fingers, and the closed, still mouth.
- **Never shown:** a child, a real person, a known character, another brand's mascot, or any human hand entering the set.
- **Cast:** he carries the story silently with a narrator. The tower's three states stay in the shot table.

**MISSING**
- `MISSING: the pouch photo is not visible in this chat. Please re-attach the front, plus side and top photos. Until then, the product sheet can't be checked against the real pack.`
- `MISSING: every label line in order. I have only "28 Daily Packs" and a big yellow wordmark whose text isn't given.`
- `MISSING: what the bears look like out of the pack (photo, colour). They must keep their real colour.`
- `MISSING: brand file / approved claims / never-show list.`
- `MISSING: current offer and price for the edit.`

**Stopping here.** Please approve or correct the fixed lines and avatar card (watch wrist, key-light side, narrator voice, shot 5's tower state), and send the missing items before Stage 2.
```
