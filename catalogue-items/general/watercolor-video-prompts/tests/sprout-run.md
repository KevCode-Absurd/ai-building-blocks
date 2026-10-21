# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, usable prompt pack: it says it can't see the photos, uses only the pouch details given, keeps the label to two quoted lines, writes the turn as glazes stacking, and marks every gap (shelf and offer lines, pack colour, bear colours, timings) as MISSING or inferred. The owner can approve the three marked points and hand the prompts straight to an image and video tool with no invented facts to clean up.

## Judge list

- Met: Stopped for approval after avatar card, sheets and storyboard, or marked those points when asked for all stages at once
  "STAGE 1 AVATAR CARD (approve)", "STAGE 3 ... (approve)", "STAGE 4 STORYBOARD (approve)" and closing "Can I have your yes on each point"
- Met: Material sentence and lock lines word for word the same in every image prompt
  Every F-prompt carries [MATERIAL]; "Paste each locked line word for word wherever its [TOKEN] appears" matches the shape's own [MATERIAL] placeholder
- Met: Each clip prompt names one camera move and at most one paint change
  Clip 3 "slow dolly in", clip 5 "slow pan right" with no paint change; clip 4 locked-off with one glazing build as the show plan dictates
- Met: Turn written as what wet paint does, never a brush at work
  "a thin see-through spinach-shaped layer spreads over the dry kale leaf; where it overlaps, the colour deepens ... each wet edge stops and dries matte"
- Met: Label lines short, in quotes, matching the pack
  "painted label lines "Sprout" and "28 Daily Packs" only" — both taken from the input's pouch description
- Met: Every frame reads as watercolour on paper, never a filtered photo
  "painted" on every object, [MATERIAL] in each frame, avoid field "photograph, 3D render, plastic"

## What went in

```text
Script (from the watercolor ad script skill), about 30 s.
Show plan: build, glazing. Leaf glazes stack until they match the
pouch's deep forest green. Cold-press, light granulation.
3 "Here are those greens, one layer at a time." One pale kale leaf.
4 "Kale. Spinach. Spirulina. Broccoli. Wheatgrass." THE TURN.
5 "Sixty-plus ingredients, twenty-one vitamins and minerals, six
  grams of fiber." The pouch where the layers meet.
6 "In one pack you tear and eat." Hand, torn daily pack, bears.
(lines 1-2 shelf, 7-8 offer and close)
Cast note: hands only, in line 6. The pouch carries the ad.
Photos attached: pouch front, side and top; one daily pack.
Pouch: glossy deep green, "Sprout" in big yellow letters, yellow
bear face top right, "28 Daily Packs" at the bottom. Pack torn
straight across the top only. Video tool: 8-second clips, takes an
end frame, no sound.
Write every stage in one go; I'll approve at the marked points.
```

## What came out

```text
I write the prompts only. This chat has no image or video tool, so the pictures and clips aren't made here.
I can't see the attached photos. The pouch's look and label words below come from your description, and the painted product sheet still needs a check against the real pouch and daily pack.

```
STAGE 0  SCRIPT IN   Turn: build, glazing. Starts on one pale kale leaf (line 3),
         stops when the stacked glazes match the pouch's deep forest green (end of
         line 4, met at the pouch in line 5), never crosses the label ("Sprout",
         bear face, "28 Daily Packs" stay crisp and bare of glaze).
         Lines, seconds [inferred, ~30 s total], claims:
         L1-2  shelf | ~6 s | MISSING: words and claims
         L3  "Here are those greens, one layer at a time." | ~3 s | no claim
         L4  "Kale. Spinach. Spirulina. Broccoli. Wheatgrass." | ~5 s | contains these five greens
         L5  "Sixty-plus ingredients, twenty-one vitamins and minerals, six grams of fiber." | ~6 s |
             all three numbers said and captioned word for word
         L6  "In one pack you tear and eat." | ~3 s | one daily pack, torn and eaten
         L7-8  offer and close | ~7 s | MISSING: words, offer, claims

STAGE 1  AVATAR CARD (approve)
         Role  the eater's hands, line 6 only; the pouch carries the rest of the ad
         | Age  made-up adult, 30s [inferred] | Look  a pair of loosely painted adult
         hands, light warm skin in two pale washes, short plain nails, no rings
         | Clothes  soft oatmeal sweater cuffs at the wrists
         Props  one daily pack, the gummy bears inside | Voice  none on screen;
         narrator off screen | Never changes  right hand holds the pack, left hand
         tears it, oatmeal cuffs, no jewellery, the face is never shown, the pack is
         torn straight across the top only

STAGE 2  REFERENCE IMAGES  "A loosely painted watercolour of a pair of adult hands
         alone on bare paper, light warm skin in two pale washes, short plain nails,
         soft oatmeal sweater cuffs at the wrists, the right hand open palm-up, the
         left relaxed beside it. [MATERIAL] Flat and square to the sheet, the
         painting filling the frame."
         Avoid field: photograph, 3D render, plastic, desk, frame.
         Make 4. Pick: the one whose hands stay loosest and least lifelike, with
         clean bare-paper gaps between the fingers and cuffs that read oatmeal, not
         white, because the card asks for loosely painted hands that never turn real.

STAGE 3  SHEETS AND LOCK LINES (approve)
         MATERIAL  Painted in loose transparent watercolour on warm-white cold-press
         paper, each dried shape see-through and darker where the pigment pooled at
         its edge, with light granulation in the greens, a palette of pale sap green,
         deep forest green and warm yellow, and the light coming from the bare white
         paper.
         FIGURE  a pair of loosely painted adult hands, light warm skin in two pale
         washes, short plain nails, soft oatmeal sweater cuffs at the wrists
         PRODUCT  the painted Sprout pouch, an upright stand-up pouch in deep forest
         green with a glossy streak of bare paper down one side, "Sprout" in big
         yellow letters, a yellow bear face at top right and "28 Daily Packs" at the
         bottom, its edges the crispest on the sheet
         PACK  a small flat painted daily pack, torn straight across the top only
         when torn, colour and print MISSING (placeholder: deep forest green [inferred])
         (Paste each locked line word for word wherever its [TOKEN] appears.)
         Character sheet  [FIGURE] from the picked image: back of hands, palms,
         three-quarter left and right, side; poses: right hand holding [PACK]
         upright, left fingers pinched at its top corner, mid-tear, holding torn
         pack open; size: pack fits across the palm, pouch about two hands tall [inferred]
         Product sheet  [PRODUCT] front, side, top, true shape, painted label lines
         "Sprout" and "28 Daily Packs" only, plus [PACK] closed and torn.
         Full label beside it for the edit: front "Sprout", yellow bear face top
         right, "28 Daily Packs"; side and top text MISSING
         Set sheet  A: bare cold-press sheet, empty (lines 3-5). B: same sheet with a
         pale warm-grey ground wash, empty (line 6). C: painted store shelf, empty,
         pouch painted small when placed (lines 1-2, MISSING script)

STAGE 4  STORYBOARD (approve)
         Avoid field for F3-F5: photograph, 3D render, plastic, brush, hand, desk,
         frame. For F6: photograph, 3D render, plastic, brush, desk, frame.
         F1-2  MISSING: shelf lines; build from Set C with [PRODUCT] painted small.
         F3  A single pale painted kale leaf, dry and still, lying slightly diagonal
             in the centre of an otherwise bare painted sheet. Set A. [MATERIAL] Flat
             and square to the sheet, wide, the painting filling the frame. No label
             lines.  Attach: Set sheet A = the sheet
         Card 3: wide | slow dolly in | the dry leaf holds still as the frame closes
             on it | "Here are those greens, one layer at a time." | ~3 s | none
         F4  A single pale painted kale leaf, dry, filling the centre of the frame,
             its ruffled edge darker where the pigment pooled, the paper around it
             bare, the moment before the next glaze. Set A. [MATERIAL] Flat and
             square to the sheet, close on the leaf, the painting filling the frame.
             No label lines.  Attach: Set sheet A = the sheet
         F4-end  Five painted shapes stacked in overlapping see-through glazes: a
             kale leaf, a spinach leaf, a blue-green spirulina swirl, a broccoli
             floret and wheatgrass blades. Where they overlap, the colour is deep
             forest green, all dry and matte. Set A. [MATERIAL] Same framing as F4.
             Attach: Product sheet = colour target for the deep forest green
         Card 4: close | locked-off | five glazes stack in spoken order and deepen to
             the pouch's green | "Kale. Spinach. Spirulina. Broccoli. Wheatgrass." |
             ~5 s | none
         F5  The stacked painted leaf glazes in deep forest green fill the left
             two-thirds, the left edge of [PRODUCT] just entering at right. Set A.
             [MATERIAL] Flat and square to the sheet, the painting filling the frame.
             No label lines in view yet.
         F5-end  [PRODUCT] standing upright, the stacked painted leaf glazes meeting
             its left side in the same deep forest green, the label areas bare and
             crisp. Set A. [MATERIAL] Flat and square to the sheet, the painting
             filling the frame. Label lines: "Sprout", "28 Daily Packs".
             Attach: image 1 = the pouch (product sheet), image 2 = the sheet (Set A)
         Card 5: medium | slow pan right | dry leaves give way to the pouch they
             match | "Sixty-plus ingredients, twenty-one vitamins and minerals, six
             grams of fiber." | ~6 s | none
         F6  [FIGURE] holding [PACK] upright and closed in the right hand, left
             fingertips pinched at its top corner, the moment before the tear. Set B.
             [MATERIAL] Flat and square to the sheet, medium close, the painting
             filling the frame. No label lines.
             Attach: image 1 = the hands (character sheet), image 2 = the daily pack
             (product sheet), image 3 = the sheet (Set B)
         Card 6: medium close | locked-off | left hand tears the pack straight across
             the top, painted gummy bears show inside | "In one pack you tear and
             eat." | ~3 s | none
         F7-8  MISSING: offer and close lines; end card is text in the edit.
         Continuity  Camera stays on the front of the sheet throughout (180° line =
             the sheet plane); no eyelines (no faces). Right hand holds, left hand
             tears, in every hand frame. The pouch is never opened. The daily pack is
             closed until card 6, torn straight across the top only from card 6 on.
             Glaze edges stop short of the pouch label in F5 and F5-end.

STAGE 5  CLIP 3 (8 s, use ~3 s, start F3, end F4)
         Camera slow dolly in  0 to 8 s the painting is dry and still; only the
         camera moves, closing from the whole sheet to the kale leaf  Fixed the paper
         and every dry shape stay fixed  End the pale leaf filling the frame, dry
         and matte.  Narration: line 3
         CLIP 4 (8 s, use ~5 s, start F4, end F4-end)  THE TURN
         Camera locked-off  0 to 1 s a thin see-through spinach-shaped layer spreads
         over the dry kale leaf; where it overlaps, the colour deepens  1 to 2 s a
         blue-green spirulina swirl layer spreads across them and deepens the overlap
         2 to 3 s a broccoli floret layer spreads over the stack  3 to 4 s wheatgrass
         blade layers spread across the top  4 to 6 s where all the layers overlap
         the colour settles to deep forest green; each wet edge stops and dries
         matte  6 to 8 s still  Fixed the paper and every dry shape stay fixed; the
         camera stays still  End five stacked shapes, deep forest green where they
         overlap, settled and drying matte.  Narration: line 4
         CLIP 5 (8 s, use ~6 s, start F5, end F5-end)
         Camera slow pan right  0 to 8 s the painting is dry and still; only the
         camera moves, from the stacked leaves to the painted pouch  Fixed the paper,
         the leaf glazes and the pouch label stay fixed and crisp  End the pouch
         upright, the leaves meeting its side in matching deep forest green, dry and
         matte.  Narration: line 5
         CLIP 6 (8 s, use ~3 s, start F6, end torn-pack frame from the character sheet)
         Camera locked-off  0 to 2 s the left fingertips tear the pack straight
         across the top  2 to 4 s the top strip comes away and painted gummy bears
         show inside  4 to 8 s the hands hold still  Fixed the paper, the ground wash
         and the cuffs stay fixed  End the torn pack held open, the bears in view,
         settled and drying matte.  Narration: line 6
         Takes  2 or 3 of each clip; pick the one where the label stays crisp
         (clip 5) and the tear stays straight across the top (clip 6).
         VOICE  Narrator recorded separately in a stock voice (e.g. ElevenLabs
         library), never cloned; nobody on screen speaks, no lip-sync. The video tool
         makes no sound, so add no ambient line.
         EDIT  Order: L1-2 (MISSING), clips 3, 4, 5, 6, L7-8 (MISSING), trimmed to
         the narration. Hard cut 3→4 on the matched leaf; cut 4→5 on the settled
         green; cut 5→6 on the end of line 5. Captions are every line word for word,
         including "Sixty-plus ingredients, twenty-one vitamins and minerals, six
         grams of fiber." Overlay: if "Sprout" or "28 Daily Packs" comes out wrong,
         lay the real label from the photo over the held pouch in clip 5. End card:
         offer and price as text, from the offer live that day. Safe zone: all words
         inside the centre, clear of the platform's top bar, right-side buttons and
         bottom caption area. Music only if the brand uses it, low under the voice.
         Final check: every line said, every claim word for word, nothing painted
         beyond the five named greens.
         MISSING: script lines 1-2 and 7-8; line timings (inferred above); the offer
         and price; platform and aspect ratio (assumed 9:16 [inferred]); the daily
         pack's colour and print; the gummy bears' colours; the pouch side and top
         label text; the full ingredient list; approved claims and never-show list
         (no brand file); whether the brand uses music; the check of the painted
         product sheet against the real photos (I couldn't see them).
CHECKS MISSED: none
```

**To finish it**
1. Make each frame from its prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield.
2. Animate each frame with its clip prompt. Higgsfield works with Seedance, Kling or Veo, on paid credits. Paid Google AI plans include Veo in the Gemini app, with a few clips a day.
3. In Claude Code with a video service key, I can send the clip prompts and save the files.

**Your three approvals**
Can I have your yes on each point before you make anything?
1. The stage 1 hands card.
2. The stage 3 sheets and lock lines.
3. The stage 4 storyboard.

If you change one, I'll redo the stages after it.

Next, do you want to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker)? Or type your own next step.
```
