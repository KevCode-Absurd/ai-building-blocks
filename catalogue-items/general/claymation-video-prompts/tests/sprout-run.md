# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, paste-ready set of prompts that keeps the pouch closed and unchanged because the photo could not be seen and the tear could mean pouch or daily pack, exactly as the skill requires. Every gap (narration, shots 2-4 and 7-8, label lines, offer, dimensions) is marked MISSING rather than guessed, and the lock lines are pasted in full everywhere.

## Judge list

- Met: Stopped for OK after avatar card, sheets and storyboard, or marked each "(approve)" when asked to run through
  "**Avatar card** (approve)", "## 3. Sheet prompts and lock lines (stage 3) (approve)", "## 4. Storyboard (stage 4) (approve)" after user said "Go ahead".
- Met: Lock lines appear word for word in every still and clip prompt
  CHARACTER, SET, LIGHT, LENS, PALETTES, PRODUCT pasted identically into all 9 stills, both morph frames, sheets and all 9 clips.
- Met: Each clip has one mover and one camera instruction; at most one morph from first and last frame
  "Only the tower moves. Camera: locked off."; Clip 6 (morph) "Attach the first frame and the last frame from shot 6"; shot 8 one slow push.
- Met: Product follows its one product line in every shot, label exactly as printed
  "The real pouch exactly as in its photo ... the line \"28 Daily Packs\" ... no letter redrawn in clay" in every prompt; pouch kept closed.
- Met: The change happens in view by a clay move, never pops or vanishes
  "beat 1 it sags; beat 2 it squashes halfway into the counter; beat 3 it flattens flush" with first/last frame.

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
No video tool is connected in this chat, so I'll write the prompts and you'll make the images and clips. I can't see the attached pouch photo here, only your description, so the product sheet can't be checked against the real pack.

---

## 1. Fixed lines and avatar card (stages 0 and 1)

**Shot table as read** (your shots 1, 5, 6 and 9 are kept word for word; shots 2–4 and 7–8 are `[inferred]`, so replace them with your script's shots if they differ)

| # | Picture | Mover | Tower state | Palette | Secs |
|---|---|---|---|---|---|
| 1 | whole set, tower teeters | tower | before (teeters) | before | 4 |
| 2 `[inferred]` | he looks up at the tower, head tilts | him | before | before | 3 |
| 3 `[inferred]` | close: tub shifts, scoop slides to the edge | tower | before | before | 3 |
| 4 `[inferred]` | he turns his head to the pouch | him | before | before | 3.5 |
| 5 | he tears the pack straight across the top, bears tip into his palm. **Shot as: his right hand rests on top of the closed pouch** (see MISSING) | hands | before | before | 3.5 |
| 6 | MORPH: the tower squashes into the counter | tower | changing | before | 4 |
| 7 `[inferred]` | clear counter, he lowers his hand to his side | him | after (clear counter, pouch on it) | after | 3 |
| 8 `[inferred]` | close on the pouch, he gives a small nod beside it | him | after | after | 3 |
| 9 | held | none (one blink) | after | after | 3 |

Total: 30 s. Your tool's shortest clip is 4 s and 9 × 4 = 36 s, so every clip is generated at 4 s and trimmed in the edit to the seconds above.

**Changing object:** a leaning grey clay tower of powder tub, scoop and shaker. Before: it teeters. Changing: it squashes down into the counter. After: a clear counter, the pouch on it.

**Fixed lines**
- **SET:** A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens. Water in the sink is clear gel. No words anywhere on the set.
- **LIGHT:** One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. `[inferred: light side]`
- **LENS:** Shallow focus, subject sharp and background soft so it reads as miniature. Camera on a stand at the clay man's eye level. The edges of the set never show.
- **PALETTES:** Before the change, the set is greyed and cool, blue-grey with one dull khaki. After the change, it is forest green, cream and sunflower. Until the change, the pouch is the only thing in brand colours.

**Avatar card** (approve)
- **Who:** a clay man, 6 heads tall, slim, warm beige modelling clay.
- **Hair:** short and dark, sculpted as one shape.
- **Clothes:** rust jumper, grey trousers.
- **Face:** small black bead eyes. The mouth stays closed and still. He never speaks or mouths words.
- **Mark:** a small clay watch on his left wrist `[inferred: wrist]`.
- **Hands:** chunky clay hands with rounded fingertips and no nails.
- **Narrator:** off screen, a calm, warm adult voice at an unhurried pace `[inferred]`.
- **Never changes:** height, build, clay colour, hair shape, jumper and trouser colours, bead eyes, watch, closed mouth.
- **Never shown:** a child, a real person, a known character, another brand's mascot, or a human hand in the set.

---

## 2. Reference image prompts (stage 2)

Pick one.

**R1: standing front.** A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. Standing straight, arms at his sides, facing camera, on a plain pale grey backdrop. Handmade stop-motion style, matte modelling clay with some thumbprints, photographed with a macro lens. One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level. 9:16.

**R2: head tilted.** A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. Three-quarter view, head tilted up and to one side as if looking at something tall, on a plain pale grey backdrop. Handmade stop-motion style, matte modelling clay with some thumbprints, photographed with a macro lens. One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level. 9:16.

**R3: arm out.** A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. Standing, right arm out at waist height, palm down, on a plain pale grey backdrop. Handmade stop-motion style, matte modelling clay with some thumbprints, photographed with a macro lens. One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level. 9:16.

**R4: small nod.** A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. Three-quarter view, chin dipped in a small nod, arms relaxed, on a plain pale grey backdrop. Handmade stop-motion style, matte modelling clay with some thumbprints, photographed with a macro lens. One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level. 9:16.

---

## 3. Sheet prompts and lock lines (stage 3) (approve)

**Lock lines.** Paste these in full, word for word, into every later prompt.

> CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still.
> SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set.
> LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints.
> LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show.
> PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours.
> PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

**Attachments in every prompt from here:** image 1 is the clay man (character sheet), image 2 is the kitchen set (set sheet), image 3 is the pouch (your photo).

**Character sheet** (attach the picked reference). A character turnaround sheet on a plain pale grey backdrop: front, three-quarter left, three-quarter right, side and back. Below the turnaround: head tilted up; right arm out at waist height, palm down; right hand resting flat on top of a box shape; a small nod. Last panel: him standing beside the pouch (image 3) on a counter, the pouch about as tall as his forearm. Lock lines in full: CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

**Product sheet** (real photo route; attach your pouch photo). The pouch exactly as in image 3, front view only, standing upright on a matte clay counter with some thumbprints, label facing camera. No side or top views: you have no photos of them, so the pouch always faces front. Lock lines in full: CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

**Set sheet.** Two panels with the same camera and light, wide view of the empty kitchen set (no clay man). The pouch stands at the left end of the counter.
- **Panel A, before palette:** a leaning grey clay tower of powder tub, scoop and shaker stands centre counter, tilting right.
- **Panel B, after palette:** the counter is clear, with only the pouch on it.

Lock lines in full: CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

`MISSING: which part is opened, and how` (outer pouch or a single daily pack inside). No opening step is in the PRODUCT line until this is confirmed.

---

## 4. Storyboard (stage 4) (approve)

**Staging used throughout:**
- The pouch stands at the left end of the counter from shot 1.
- The tower is centre counter.
- The clay man stands at the right end of the counter.
- His right hand is the only hand that touches the pouch.

**Shot 1 still.** Wide 9:16 of the whole set, counter across the lower third. The grey tower of powder tub, scoop and shaker is centre counter, leaning right. The clay man stands still at the right end. The pouch is at the left end. Palette this shot: before. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: tower.
- Beats: beat 1 the tower rocks right; beat 2 it rocks back; beat 3 it holds, leaning.
- Camera: locked off.
- Narration: `MISSING`.
- Length: 4 s.
- Sound: room tone, a soft clay knock.

**Shot 2 still** `[inferred]`. Medium shot of the clay man from the waist up at the right end of the counter, head tilted up towards the leaning grey tower at the frame's left edge. Palette this shot: before. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: him.
- Beats: beat 1 head level; beat 2 head tilts up; beat 3 holds.
- Camera: locked off.
- Narration: `MISSING`.
- Length: 3 s.
- Sound: room tone.

**Shot 3 still** `[inferred]`. Close-up of the leaning grey tower. The tub sits slightly off-centre on the shaker, and the scoop is at the top edge. The man is out of frame. The pouch is soft in the background left. Palette this shot: before. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: tower.
- Beats: beat 1 the tub shifts; beat 2 the scoop slides to the edge; beat 3 holds.
- Camera: locked off.
- Narration: `MISSING`.
- Length: 3 s.
- Sound: a small clay scrape.

**Shot 4 still** `[inferred]`. Medium-wide shot of the counter. The clay man is at the right, head turned towards the pouch at the left. The leaning grey tower is between them. Palette this shot: before. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: him.
- Beats: beat 1 he looks at the tower; beat 2 his head turns left; beat 3 holds on the pouch.
- Camera: locked off.
- Narration: `MISSING`.
- Length: 3.5 s.
- Sound: room tone.

**Shot 5 still.** Medium close-up of the clay man's right hand resting flat on the top of the closed pouch, his watch visible on the other wrist. The leaning grey tower is soft behind. Palette this shot: before.
- Script line: "he tears the pack straight across the top, bears tip into his palm."
- Shown instead: the hand rests on top, because which part opens and what comes out are not confirmed.

CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: hands.
- Beats: beat 1 the right hand lifts; beat 2 it settles on the pouch top; beat 3 holds.
- Camera: locked off.
- Narration: `MISSING`.
- Length: 3.5 s.
- Sound: a soft tap.

**Shot 6 still (morph first frame).** Wide 9:16, the same framing as shot 1. The grey tower leans at its furthest. The clay man stands still at the right. The pouch is at the left. Palette this shot: before. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

**Shot 6 morph last frame.** The same camera, framing and light as the first frame. The counter is clear where the tower stood, its clay surface smooth with thumbprints. The clay man is in the same pose at the right. The pouch is in the same spot at the left. Palette this shot: before (the colour shift happens on the cut to shot 7, so the morph changes only the tower). CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: tower.
- Beats: beat 1 the tower sags; beat 2 it squashes halfway into the counter; beat 3 it flattens flush; beat 4 holds.
- Camera: locked off.
- Narration: `MISSING`.
- Length: 4 s.
- Sound: a soft squash.

**Shot 7 still** `[inferred]`. Medium-wide shot of the clear counter, the pouch at the left. The clay man is at the right, his right hand just lifted from his side. Palette this shot: after. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: him.
- Beats: beat 1 hand raised; beat 2 it lowers to his side; beat 3 holds.
- Camera: locked off.
- Narration: `MISSING`.
- Length: 3 s.
- Sound: room tone.

**Shot 8 still** `[inferred]`. Medium close-up of the pouch on the clear counter, the clay man standing just right of it from the chest up, chin level. Palette this shot: after. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: him.
- Beats: beat 1 chin level; beat 2 small nod down; beat 3 back up and hold.
- Camera: one slow push in that starts and ends still.
- Narration: `MISSING`.
- Length: 3 s.
- Sound: room tone.

**Shot 9 still.** Wide 9:16, the same framing as shot 1. The counter is clear with the pouch at the left. The clay man stands still at the right, arms at his sides. Palette this shot: after. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label.

*Card:*
- Mover: none; one small repeat, a single blink.
- Beats: beat 1 hold; beat 2 blink; beat 3 hold.
- Camera: locked off.
- Narration: `MISSING`.
- Length: 3 s.
- Sound: room tone.

**Morph frame pair:** shot 6, first frame and last frame above.

**Continuity checked:**
- The tower is before in shots 1–5, changing in 6 and after in 7–9.
- The pouch stays the same size against him, with the label to camera, at the left end of the counter.
- Only his right hand touches it, and only in shot 5.

---

## 5. Clip prompts (stage 5)

Every clip:
- Length: 4 s, trimmed in the edit.
- Shape: 9:16.
- Attach: the approved still as first frame; image 1 the clay man (character sheet), image 2 the kitchen set (set sheet), image 3 the pouch (photo).
- Make 2–3 takes of each and pick one.

**Clip 1.** Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. Beat 1 the grey tower rocks right; beat 2 it rocks back; beat 3 it holds, leaning. Only the tower moves. Camera: locked off. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone and small clay sounds (a soft knock).

**Clip 2.** Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. Beat 1 his head is level; beat 2 his head tilts up towards the tower; beat 3 it holds. Only he moves. Camera: locked off. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone.

**Clip 3.** Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. Beat 1 the tub shifts on the shaker; beat 2 the scoop slides to the top edge; beat 3 it holds. Only the tower moves. Camera: locked off. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone and small clay sounds (a scrape).

**Clip 4.** Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. Beat 1 he looks at the tower; beat 2 his head turns left; beat 3 it holds on the pouch. Only he moves. Camera: locked off. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone.

**Clip 5.** Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. Beat 1 his right hand lifts; beat 2 it settles flat on the top of the closed pouch; beat 3 it holds. Only his hand moves. The pouch does not open, tear or move. Camera: locked off. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone and small clay sounds (a tap).

**Clip 6 (morph).** Attach the first frame and the last frame from shot 6, plus images 1–3. Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. The grey tower squashes down into the counter in a few stepped poses. Beat 1 it sags; beat 2 it squashes halfway into the counter; beat 3 it flattens flush with the counter; beat 4 the counter holds, clear. Only the tower moves. The colours stay the same. Camera: locked off. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone and small clay sounds (a squash).

**Clip 7.** Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. Beat 1 his right hand is raised; beat 2 it lowers to his side; beat 3 it holds. Only he moves. Camera: locked off. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone.

**Clip 8.** Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. Beat 1 his chin is level; beat 2 he gives a small nod down; beat 3 he comes back up and holds. Only he moves. Camera: one slow push in that starts and ends still. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone.

**Clip 9.** Stop-motion timing: the clay moves in small stepped poses, about 12 new poses a second, with a faint shimmer between poses. The camera moves smoothly. Beat 1 everything holds; beat 2 he blinks once; beat 3 everything holds. Nothing else moves. Camera: locked off. Same character, set and product as the references. Every surface stays clay or its stand-in. His mouth stays still. The label stays as printed. CHARACTER: A clay man, 6 heads tall, slim, warm beige modelling clay, short dark hair sculpted as one shape, rust jumper, grey trousers, small black bead eyes, a small clay watch on his left wrist, chunky clay hands with rounded fingertips and no nails; his mouth stays closed and still. SET: A handmade stop-motion tabletop kitchen set, a counter, a shelf, a sink and a window, matte modelling clay with some thumbprints, photographed with a macro lens; water in the sink is clear gel; no words anywhere on the set. LIGHT: One soft key light from the left, the window side, and a soft fill from the right, bright enough to see the thumbprints. LENS: Shallow focus, subject sharp and background soft so it reads as miniature, camera on a stand at the clay man's eye level, the edges of the set never show. PALETTES: Before the change, the set is greyed and cool, blue-grey with one dull khaki; after the change, forest green, cream and sunflower; until the change, the pouch is the only thing in brand colours. PRODUCT: The real pouch exactly as in its photo, glossy deep green with a big yellow wordmark and the line "28 Daily Packs", lit by the set's key light, no letter redrawn in clay; it stays closed and unchanged, stands upright on the counter with its label facing camera, about as tall as the clay man's forearm, and he touches only its side or top, never its label. Sound: soft room tone.

---

## 6. Edit list

**Order over the narration (30 s):**

| Clip | Trim to | Cuts at |
|---|---|---|
| 1 | 4 s | 0–4 |
| 2 | 3 s | 4–7 |
| 3 | 3 s | 7–10 |
| 4 | 3.5 s | 10–13.5 |
| 5 | 3.5 s | 13.5–17 |
| 6 | 4 s | 17–21 |
| 7 | 3 s | 21–24 |
| 8 | 3 s | 24–27 |
| 9 | 3 s | 27–30 |

- The cut from 6 to 7 is where the palette changes to after. It is a cut, not a morph.
- **Voice:** design the narrator voice from the card (calm, warm, adult, unhurried) in ElevenLabs. Never clone a voice. Lay it on in the edit. There is no lip-sync and his mouth never moves.
- **Offer text:** added in the edit over shots 8–9, from your live offer, never in a prompt. `MISSING: offer and price`.
- **Safe zones (9:16):**
  - Keep text out of the top 14% and the bottom 20%.
  - Keep it clear of the right-edge buttons, about 12% of the width.
  - Keep it off the pouch label.

**Retake notes.** Ask for a screenshot of each take. Then fix:
- **Clay looks like smooth plastic, or the sink gel looks like real water:** repeat the SET line first.
- **His colours or watch drift:** re-attach the character sheet.
- **The tower pops or vanishes instead of squashing:** cut the beats down and use the first and last frame.
- **Two things move:** rewrite the mover.
- **His mouth shapes words:** repeat the hold line.
- **The label changes, or the pouch opens:** re-attach the photo and repeat the PRODUCT line.
- **Words appear on the set:** repeat the SET line.

Rerun once, then simplify, then change one instruction.

**Final check:** the tower's change reads with the sound off and shows nothing beyond approved claims. `MISSING: approved claims / brand file`.

**Making it:**
1. Make each first frame from its still prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield.
2. Animate each frame with its clip prompt in Higgsfield, choosing Seedance, Kling or Veo. Veo suits clip 6's first and last frame. Higgsfield runs on paid credits. You can also connect Higgsfield to Claude so Claude makes the clips there.
3. Paid Google AI plans also include a few Veo clips a day in the Gemini app.
4. In Claude Code, with a video-service key (Seedance, Kling or Veo), I can send each prompt and save the files. Pictures alone need an OpenAI key (platform.openai.com/api-keys) or a Google key (aistudio.google.com/apikey), billed per picture.

**MISSING:**
- `MISSING: which part is opened, and how` (the outer pouch or one of the 28 daily packs). Shot 5 shows the hand resting on top until this is confirmed.
- `MISSING: what comes out, its real colour and shape` (the script's "bears"). They are not shown until confirmed.
- `MISSING: product photo` visible to me. I worked from your description, so the product sheet can't be checked against the real pack.
- `MISSING: label lines`: the wordmark text and any other lines beyond "28 Daily Packs".
- `MISSING: side and top photos` of the pouch. It faces front in every shot.
- `MISSING: pouch dimensions`. "About as tall as his forearm" is inferred.
- `MISSING: narration lines for all 9 shots`.
- `MISSING: shots 2–4 and 7–8` from your script. The versions above are inferred.
- `MISSING: offer and price; approved claims; never-show list`.

---

## 7. Checks missed

CHECKS MISSED: none

Want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? Or tell me what you'd like next.
```
