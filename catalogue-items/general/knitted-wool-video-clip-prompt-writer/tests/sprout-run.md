# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A disciplined start: it fixed the turn and lines, built a complete avatar card from the cast note, marked every guess as inferred or proposed, and stopped at approval 1 as the skill requires. The owner gets a clear list of what to supply (lines 2 and 6 to 8, timings, offer, daily-pack photos) before any product prompt is written.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  "Approval 1: Please confirm or correct the avatar card above... Stage 2 (reference images) waits for your yes." Stages 3 and 4 correctly not reached.
- Met: The material sentence is word for word the same in every prompt, and the doll card in every frame she's in.
  No image or clip prompts written yet (run halted at approval 1), so no inconsistency possible.
- Met: Every object in every prompt names its material and a real color.
  "crocheted clear-blue drinking glass with a felted grey spoon", "dark brown felted slip-on shoes"; pouch colour marked MISSING rather than guessed.
- Met: Each clip has one camera move and one yarn change, written as yarn behaves.
  No clips yet; the turn is already written as yarn behaves: "They wind around each other into one thicker leaf-green yarn".
- Met: No frame asks for a close-up of a face.
  "There are no face close-ups; close-ups are for her crocheted hands and the product."
- Met: The label lines are short, in quotes, and match your pack.
  Claims column: "28 Daily Packs" (label), matching the attached label text.

## What went in

```text
Script (from the knitted wool script skill), about 30 s.
Show plan: join, plying. Six leaf-green strands twist into one
yarn that runs into a crocheted daily pack.
1 "Fiber powder. Gritty, every single morning."  She stirs a glass.
3 "Here's six grams of fiber, the easy way."  Six strands, close.
4 "Six strands. One pack."  THE TURN: plying.
5 "Rip. Tip. Enjoy."  Hands tear the pack across the top.
(lines 2, 6 to 8: pills, pouch, offer and close)
Cast note: one crocheted doll. Sketch: a woman about 40, medium
build, shoulder-length dark brown yarn hair in loose waves, a
mustard stockinette jumper, grey rib-knit trousers.
Photos attached: pouch front, side and top. Label: "Sprout" in
yellow, a yellow bear face top right, "28 Daily Packs" at the
bottom. Tear only straight across the top.
Video tool: 8-second clips, takes an end frame, no sound.
```

## What came out

```text
# Stage 0: Script in

**Show job:** join
**Yarn technique:** plying

**The turn:** It starts on line 4 with six separate leaf-green strands lying side by side. They wind around each other into one thicker leaf-green yarn, and that yarn runs into a crocheted daily pack. This is the only yarn-made scene change.

**Lines (fixed from here on)**

| Line | Narration | Picture | Seconds (proposed) | Claims |
|---|---|---|---|---|
| 1 | "Fiber powder. Gritty, every single morning." | She stirs a glass. | 0–4 | Fiber powder is gritty (a category claim, not a brand claim) |
| 2 | MISSING | pills | MISSING | MISSING |
| 3 | "Here's six grams of fiber, the easy way." | Six strands, close. | MISSING | "six grams of fiber"; "the easy way" |
| 4 | "Six strands. One pack." | THE TURN: plying | MISSING | none |
| 5 | "Rip. Tip. Enjoy." | Hands tear the pack across the top. | MISSING | none (tear straight across the top only) |
| 6–8 | MISSING | pouch, offer, close | MISSING | "28 Daily Packs" (label) |

MISSING: narration and picture notes for lines 2, 6, 7 and 8.
MISSING: seconds for each line. Line 1 is `proposed`; the rest wait until all eight lines are in, fitted to about 30 s.
MISSING: the offer for line 7 or 8 (price and offer, as live on the day, for the end card).
MISSING: brand file. Approved claims are needed to confirm "six grams of fiber" and "the easy way" word for word, and to confirm that "gritty" about fiber powder is allowed.
MISSING: photos (front, side and top) and label text word for word, with colours, of the single daily pack. The attached photos and label are for the pouch only.
MISSING: pouch background colour and the colour of "28 Daily Packs".
MISSING: size of the daily pack and the pouch next to the doll.
MISSING: how it's used after "tip" (into water, a drink or the mouth). This is needed for line 5. No product prompt will be written until it is supplied.

---

# Stage 1: Avatar card

**Avatar:** one crocheted doll

- **Role in the story:** An everyday adult who stirs gritty fiber powder each morning (line 1). She then switches to the daily pack: she tears it straight across the top and tips it (line 5).
- **Age range:** about 40, a made-up adult. She is not a real person, customer, expert or founder.
- **Look:**
  - Crocheted doll of a woman, medium build.
  - Shoulder-length dark brown yarn hair in loose waves.
  - Embroidered features (`inferred`): dark brown thread brows, two small black embroidered eyes, a short pink embroidered smile, soft pink felted cheeks.
- **Clothes:**
  - A mustard stockinette jumper.
  - Grey rib-knit trousers.
  - Shoes (`proposed`): dark brown felted slip-on shoes.
- **Props:**
  - A crocheted clear-blue drinking glass with a felted grey spoon (line 1, `proposed` colours).
  - The crocheted leaf-green daily pack (line 5).
  - The crocheted Sprout pouch (line 6+, details pending).
- **Voice:** none on screen. The doll never speaks, and there is no lip-sync. The narrator is off screen and recorded separately in a real or stock voice, never a cloned one.
- **What never changes:**
  - Build, yarn hair colour, length and waves.
  - Embroidered features.
  - Mustard stockinette jumper and grey rib-knit trousers.
  - One yarn thickness.
  - Always a crocheted doll, shown at full or medium shot only. There are no face close-ups; close-ups are for her crocheted hands and the product.
  - Her hands are the doll's own crocheted hands, never a maker's hands.

---

**Approval 1:** Please confirm or correct the avatar card above, including the `inferred` and `proposed` items. Stage 2 (reference images) waits for your yes.
```
