# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 6 of 6 met. Invented facts: 3.

The run correctly stops after the avatar card and keeps the doll faithful to the cast note, with invented details marked inferred. But it wrongly says the photos did not come through and refuses to continue, and it flags the lines the input already summarised as missing.

## Fix

In "What you need", add: if photos are listed as attached, treat them as received and read the label from the given text; only say MISSING when the label wording itself is absent. Also don't mark script lines MISSING when the run input already names them in a summary.

## Judge list

- Met: It stopped for your approval after the avatar card, the sheets and the storyboard.
  Stopped after stage 1: "**Stop here.** Please approve this avatar card"; later stops not reached yet, correct so far.
- Met: The material sentence is word for word the same in every prompt, and the doll card in every frame she's in.
  No image prompts written yet; the material sentence is locked only at stage 3, so nothing to break.
- Met: Every object in every prompt names its material and a real color.
  Only the avatar card so far; props carry material and colour: "pale-blue crocheted glass with a crocheted spoon".
- Met: Each clip has one camera move and one yarn change, written as yarn behaves.
  No clips written yet; plying described as "strands wind around each other into one thicker yarn".
- Met: No frame asks for a close-up of a face.
  "she is shown at full or medium shot, never in a face close-up."
- Met: The label lines are short, in quotes, and match your pack.
  No product prompt written; it asked for photos first despite photos being said attached: "I won't write any product prompt".

## Invented

- other: two small dark-brown embroidered eyes, warm-rose mouth, felted blush, brows (Embroidered features are not in the cast note, but marked inferred, which the skill allows.)
- other: soft dark-brown crocheted slippers (Not in the cast note, but marked inferred.)
- number: Seconds ~0–4, 4–8, 8–12, 12–16, 16–20, 20–30 (Proposed timings clearly marked proposed.)

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
I'll write the prompts. I can't make pictures or video here, because no video tool is connected to this chat.

---

## Stage 0: Script in (fixed from here on)

**Show job:** join
**Technique:** plying. The strands wind around each other into one thicker yarn, turning as they go.

**The turn:**
- **Starts:** line 4, opening on six separate leaf-green strands, close.
- **Ends:** one plied leaf-green yarn running into a crocheted Sprout daily pack.
- **Yarn-made scene change:** the plied yarn runs out of the strand close-up and into the pack. This carries us from the "six strands" shot to the pack shot.

| # | Line | Picture | Seconds | Claims |
|---|---|---|---|---|
| 1 | "Fiber powder. Gritty, every single morning." | She stirs a glass. | ~0–4 `proposed` | Fiber powder is gritty (about the other format, not Sprout) |
| 2 | `MISSING: line 2 text` (pills) | `MISSING` | ~4–8 `proposed` | `MISSING` |
| 3 | "Here's six grams of fiber, the easy way." | Six strands, close. | ~8–12 `proposed` | **6 g of fiber per pack.** Needs to be an approved claim. "The easy way" is ease of use. |
| 4 | "Six strands. One pack." | THE TURN: plying | ~12–16 `proposed` | Six strands make one pack (this is visual, not a nutrient claim) |
| 5 | "Rip. Tip. Enjoy." | Hands tear the pack across the top. | ~16–20 `proposed` | Use steps: tear straight across the top only, tip, enjoy |
| 6–8 | `MISSING: lines 6–8 text` (pouch, offer, close) | `MISSING` | ~20–30 `proposed` | `MISSING`. The offer goes on the end card as text, from the live offer that day. |

**Missing items:**
- `MISSING: seconds per line`. The timings above are proposed to fill about 30 s.
- `MISSING: lines 2 and 6–8`, with their picture notes and claims.
- `MISSING: product photos`. No pouch images came through in this chat. Please re-attach the front, side and top. I won't write any product prompt until I can see them.
- `MISSING: pouch base colour`, the colour of "28 Daily Packs", the look of a single daily pack (shape, colour, label) and the pouch size next to the doll.
- `MISSING: brand file`. I need the approved claims, especially "six grams of fiber", plus brand colours and never-show items.

---

## Stage 1: Avatar card

**Avatar:** one crocheted doll. Based on the cast note.

- **Role in the story:** the everyday morning fiber-taker.
  - Opens tired of gritty powder (line 1).
  - Finds Sprout daily packs.
  - Tears, tips and enjoys (line 5).
- **Age range:** an adult woman, about 38–45. She is made up, not a real person, customer, expert or founder.
- **Build:** medium build. Doll proportions with a rounded crocheted head and soft limbs. The hands are mitten-shaped and move as one piece.
- **Hair:** shoulder-length dark brown yarn in loose waves, with a slightly brushed, soft texture.
- **Embroidered features** `inferred`:
  - two small dark-brown embroidered eyes
  - short dark-brown stitched brows
  - a small single-stitch warm-rose mouth
  - faint felted blush on the cheeks
  - no nose, or a single tiny bump `inferred`
- **Clothes:**
  - a mustard stockinette jumper
  - grey rib-knit trousers
  - soft dark-brown crocheted slippers `inferred`
- **Props:**
  - a glass for line 1. Proposed: a clear-look pale-blue crocheted glass with a crocheted spoon `proposed`.
  - the Sprout pouch
  - a Sprout daily pack
- **Voice:** none on screen. The doll never speaks. The narrator is off screen, in a real or stock voice, never cloned.
- **Never changes:**
  - hair colour, length and waves
  - mustard jumper and grey rib trousers
  - medium build
  - embroidered features
  - she always holds the daily pack in her right hand `proposed`
  - she is shown at full or medium shot, never in a face close-up. Close-ups are for hands and product only.

---

**Stop here.** Please approve this avatar card, or tell me what to change. Please also re-attach the pouch photos and send the missing lines, so the product and storyboard stages can follow.
```
