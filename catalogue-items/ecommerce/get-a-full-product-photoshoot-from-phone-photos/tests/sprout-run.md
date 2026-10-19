# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 1.

A careful, well-structured Stop 1 package: a sound truth sheet, eight non-overlapping shots with real light cards, correct MISSING lines for the daily pack and pouch dimensions, and everything held until approvals. The only slip is asserting the wordmark sits in the centre of the pouch when no input says so, a small but prompt-driving label detail that should have been a [confirm] line.

## Fix

In Step 2 (Truth sheet), add: 'State a label element's position only if a photo or the brand facts give it; otherwise write [confirm] or MISSING.'

## Judge list

- Met: Every photo has one job, and no two share job, distance and angle.
  Table: 01 Identity Mid Eye, 02 Scale Close High ... 07 Use Close Low, 08 Place Mid Straight down; no combination repeats.
- Met: At least one shot shows how big the product is.
  "02 Scale: open adult palm with one pack's bears" and "The palm is the size reference." Pouch scale held pending MISSING dimensions.
- Met: Each shot has a light card, and the shadows in the photo match it.
  All 8 shots have Main/Fill/Background/Time/surface fix lines, e.g. "Shadows fall long toward 3 o'clock." No photos made yet, so nothing to contradict.
- Met: The label matches the real photo when zoomed to full screen.
  No files made; run held work: "Every [confirm] line must be checked against those photos before Stop 2." Nothing delivered that could mismatch.
- Met: The test photo was approved before the rest were made.
  "Nothing is made until Stop 1 and the 01 test shot at Stop 2 are both approved."

## Invented

- other: Big yellow wordmark, centre (Brand facts give the wordmark no position; 'centre' is a label-layout guess stated as fact, not marked [confirm].)

## What went in

```text
Product: Sprout Original (Adults), Low Sugar, 28 daily packs.
Photos: pouch front on; gummies in an open hand. No photo of a daily
pack yet.

Brand facts: glossy deep green stand-up foil pouch, big yellow
wordmark, yellow bear face top right, "28 Daily Packs" at the
bottom. Gummies: small opaque deep-green bears, soft matte. Tear the
daily pack straight across the top and tip the gummies into a palm.
The pouch opens only at its resealable top, never shown torn.
Colours: forest green, cream, sunflower yellow. Photos bright,
sunny, candy-like; everyday adults at home or outdoors; never
clinical. Never show tie-in characters or partner marks.

For: product page and Meta feed ads. Sizes: 1:1 and 4:5.
No reference photos yet.

[attached: sprout/product-page.md]
```

## What came out

```text
I can write every prompt here, but I can't make the pictures because no image tool is connected to this chat.

---

## 1. Truth sheet

**Source check:** Only `product-page.md` reached me. The two phone photos (pouch front on, gummies in an open hand) did not come through. I built this sheet from your brand facts. Every **[confirm]** line must be checked against those photos before Stop 2.

| Field | Fact |
|---|---|
| Product | Sprout Original (Adults), **Low Sugar**, one pouch of 28 daily packs |
| Variant mark | **[confirm]** How the pouch front shows "Low Sugar" and how it differs from the Sugar-Free pouch. The page sells both, so the two must not be swapped. If your front photo isn't the Low Sugar pouch, send one. |
| Format | Stand-up pouch, front panel only. Sides, gusset, base and back are not photographed. |
| Material | Glossy deep-green foil |
| Printed words | Big yellow wordmark, centre. "28 Daily Packs" at the bottom. **[confirm]** Every other word on the front, transcribed one by one, with position and type size. |
| Marks | Yellow bear face, top right |
| Closure | Resealable top, always shown closed. Never torn, never cut. |
| Contents | Small opaque deep-green gummy bears with a soft matte surface. **[confirm]** Count per pack. Use the count in the hand photo, never more. |
| Use | Tear one daily pack straight across the top and tip the bears into a palm. One pack a day. |
| Colours | Forest green, cream, sunflower yellow |
| Look | Bright, sunny, candy-like. Everyday adults at home or outdoors. |
| State | Identity shots: new, crisp, closed pouch. Use shots: bears in a palm with the pouch closed nearby. |

**Never show:**
- The tie-in flavour, its characters or partner marks
- Kids variants or any child
- Clinical or lab looks: white coats, test tubes, pharmacy shelves
- A torn or open pouch
- The inside of the pouch
- The daily pack (none photographed yet)
- Any invented side or back panel
- More than one pack's worth of bears in a hand
- Pills, powders or other supplement brands
- Symptom or "before and after" body imagery (the page's health claims are already a risk)
- The paid athlete or any real person's face
- Discount numbers, ratings or any added words

**Missing:**
- `MISSING: daily pack photo (arrival, use: tear-and-tip)`. Shots dropped: arrival, tearing the pack, and pack-in-bag portability.
- `MISSING: pouch height and width (fact)`. Shots 04, 05, 06 and 08 put the pouch beside familiar objects. Without real dimensions its size would be guessed. If dimensions don't arrive by Stop 2, 04 runs without the pouch, and 05, 06 and 08 are held.
- `MISSING: back or side photo of the pouch`. All pouch angles stay front-facing. There is no turned three-quarter view.
- **Sizes:** proposed 1:1 at 2048×2048 and 4:5 at 1080×1350. [confirm]

---

## 2. Shot list and light cards (for approval at Stop 1)

Clock positions are seen from above, with the camera at 6 o'clock and the product in the centre.

| # | Job | Distance | Angle | Destination | Sizes |
|---|---|---|---|---|---|
| 01 | Identity | Mid | Eye level | Product page + feed | 1:1, 4:5 |
| 02 | Scale | Close | High | Product page | 1:1 |
| 03 | Substance | Close | Straight down | Product page + feed | 1:1, 4:5 |
| 04 | Use | Mid | Eye level | Product page + feed | 1:1, 4:5 |
| 05 | Place | Wide | Eye level | Feed + product page | 4:5, 1:1 |
| 06 | Ad base | Wide | High | Feed | 4:5 |
| 07 | Use | Close | Low | Feed | 4:5 |
| 08 | Place | Mid | Straight down | Product page + feed | 1:1, 4:5 |

**Coverage:**
- Close shots: 02, 03 and 07.
- Wide shots: 05 and 06.
- Harder light: 03, 05 and 07.
- No two shots share job, distance and angle.

**Shots cut:**
- Arrival: no daily pack photo, and the inside of the pouch is unseen.
- Range: only one variant is photographed, and the range tiles carry the banned tie-in.
- Back panel: not photographed.

**01 Identity: pouch front on, cream sweep**
- Main light: large soft box at 10 o'clock, raised about 30° above the product. Large, soft.
- Fill: white card at 3 o'clock.
- Background: soft warm wash on the cream sweep for a sunny gradient.
- Time of day: studio, warm daylight balance.
- Foil adjustment: the soft box sits far enough to the side that its reflection lands as one clean vertical stripe on the pouch's left edge, clear of the wordmark, the bear and "28 Daily Packs".

**02 Scale: open adult palm with one pack's bears, pouch out of frame**
- Main light: window at 9 o'clock, slightly above the hand. Medium, soft.
- Fill: none, so the bears keep their shape.
- Background: out-of-focus cream kitchen.
- Time of day: mid-morning.
- Matte adjustment: side light shows each bear's soft surface. The palm is the size reference.

**03 Substance: bears scattered on a cream ceramic dish**
- Main light: low sun at 9 o'clock, about 10° above the table. Small, hard. This is the harder-light shot.
- Fill: white card at 3 o'clock, just enough to lift the shadows.
- Background: none.
- Time of day: early morning.
- Matte adjustment: the raking light draws the texture of the bears' ears and bellies. Shadows fall long toward 3 o'clock.

**04 Use: adult at a sunny kitchen counter, palm of bears raised, pouch closed behind**
- Main light: window at 10 o'clock, at head height. Large, soft.
- Fill: a second, smaller window at 2 o'clock.
- Background: sunlit counter and wall, cream and green.
- Time of day: morning.
- Foil adjustment: turn the pouch a few degrees so the window's reflection skims its left edge, away from the words.

**05 Place: outdoors, pouch on a sunlit garden table, adult relaxed and partly in frame**
- Main light: direct sun at 11 o'clock, high. Hard.
- Fill: none. Bright ground bounce only.
- Background: green garden, softly blurred.
- Time of day: late morning.
- Foil adjustment: set the pouch so the sun's highlight falls on its top seal or edge, not the label. Shadow falls toward 5 o'clock.

**06 Ad base: pouch standing on a cream counter with fresh strawberries and greens**
- Main light: soft box at 9 o'clock, about 45° up. Large, soft.
- Fill: white card at 3 o'clock.
- Background: plain sunflower-yellow wall that fills the empty top two-fifths of the frame for headline space.
- Time of day: bright midday look.
- Foil adjustment: reflection stripe on the left edge only.
- Props: strawberries and greens are proposed from the Original flavour line ("fresh strawberries meets clean greens"). [approve]

**07 Use: palm of bears held up toward camera against blue sky**
- Main light: midday sun at 12 o'clock, behind and above the hand. Hard rim light.
- Fill: white card below frame bouncing light into the palm.
- Background: open sky.
- Time of day: midday.
- Matte adjustment: the bears are opaque, so expect a rim on their edges and no glow through them. Keep the card fill so the green doesn't go black.

**08 Place: breakfast flat lay, pouch lying flat front up**
- Main light: window at 10 o'clock, high. Large, soft.
- Fill: white card at 4 o'clock.
- Background: none.
- Time of day: morning.
- Scene: coffee mug, cream linen, a small dish holding one pack's bears.
- Foil adjustment: from straight down, a window at 10 o'clock puts its reflection off the top-left corner of the pouch. Check the reflection misses the wordmark.

**References:** None were sent, and I can't search from here. These are the searches per shot problem. Send one or two per shot, or approve going without.
- 01: "glossy dark foil pouch studio front, soft side light, clean edge highlight"
- 02 and 07: "small matte candy in open palm, natural window light" and "hand held up to sky, hard sun, rim light"
- 03: "matte gummy macro, low raking morning sun, long shadows"
- 04 and 05: "sunny home kitchen candid, morning" and "garden table, hard sun, glossy packaging"
- 06: "packaging on counter, coloured wall, negative space top"
- 08: "breakfast flat lay, window light, glossy pack"

**Rejected looks (recorded from brand rules, first run):**
- Clinical white lab
- Tie-in character scenes
- Kids or family-with-children setups
- Same-distance soft-light-only sets

---

## 3. Plan for each shot

Held until Stop 1 is approved.

## 4. Approved sizes

Held. Nothing is made until Stop 1 and the 01 test shot at Stop 2 are both approved.

## 5. Pass or fail per file

None yet.

---

**Stop 1:** Approve, edit or cut the shot list and light cards. Confirm the Low Sugar front photo, the pouch dimensions and the pixel sizes, and send references if you have them. Also send:
- A daily pack photo, if you want the arrival and tear-and-tip shots added back.
- The two phone photos, so I can fill in the [confirm] lines.

**To make the pictures once approved:**
- **ChatGPT or Gemini:** paste each prompt into a chat with the real photos attached and ask for the image. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can also make them.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes the images there.
- **Claude Code:** with `OPENAI_API_KEY` (from platform.openai.com/api-keys) or `GEMINI_API_KEY` (from aistudio.google.com/apikey) saved, I can send each prompt to that API and save the file. Each image is billed by OpenAI or Google.
```
