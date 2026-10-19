# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A solid, honest draft: it flagged the missing photos, kept the product spec to what it was told, built a clean style sheet and a nine-frame grid with no repeats, and correctly paused for go-ahead before writing prompts. Weak spots the owner should fix before approving: frame 05 shows gummies taken straight from the big pouch (the product comes in daily packs torn across the top), and a glass of water is an odd prop for a 'no water, no mixing' product.

## Judge list

- Met: The product looks identical in every frame (label, shape, colours, finish).
  Spec fixed once: "Glossy deep-green foil stand-up pouch, big yellow wordmark, yellow bear face top right"; every frame reuses the same pouch. Caveat: frame 05 shows gummies taken from the pouch, but the pouch holds daily packs.
- Met: The light, lens and finish lines are word for word the same in every prompt.
  No prompts yet (paused at step 5 as required); style sheet marked "the same for every frame" with single light, lens and finish lines.
- Met: No two frames share job, distance and angle.
  01 mid/eye, 02 mid/high, 03 close/high, 04 close/down, 05 wide/eye, 06 wide/low, 07 mid/down, 08 wide/down, 09 mid/low: all distinct.
- Met: Props are real things the product contains or is used with, with no other brand's mark.
  "a fresh curly kale leaf, fresh spinach leaves, a small cream dish of spirulina powder, a clear glass of water, and a cream canvas tote bag" (kale, spinach, spirulina are in the input). Water is off-message for a no-water product.
- Met: There are no words in any photo except those printed on the product.
  Ad base frame leaves "open cream space above for words added later"; tote is plain cream canvas; rule stated: "made-up adults only, whole hands".

## What went in

```text
Product: Sprout Original (Adults), Low Sugar. Attached: the pouch
front on, and gummies in an open hand. Glossy deep green stand-up
foil pouch, big yellow wordmark, yellow bear face top right. The
84-pack size is 3 pouches.

Brand colours: forest green #00582D; deep forest green #002C17;
cream #FFF7DF (hero background); kelly green #007E40 (buttons);
sunflower yellow #FFCC2E (stars, badges); plum #581E5A (banner).
Photo style: bright, sunny, candy-like. Everyday adults at home or
outdoors. Never clinical, never muted.
Ingredients include organic kale, spinach and spirulina. "Just grab
and go."

For: Instagram feed, 4:5. Photos only.
```

## What came out

```text
I can't draw the pictures in this chat because no image tool is connected. I'll write the prompts, and at the end I'll tell you where to make the photos.

**MISSING: photo.** Your message says two photos are attached, but I can only see the text. Please re-attach both: the pouch front-on and the gummies in an open hand. Step 2 needs the real photos, so the spec below comes from your description. Treat it as a draft until I've checked it against them. Please also tell me:
- **Pouch height and width** (cm or in). The scale frame needs a true size.
- **Pack photo.** Do you have one of the 84-pack's 3 pouches together? If not, I'll build frame 07 from three copies of the front photo.

**Dropped:** the *arrival* frame (what's in the box). There's no photo of the outer pack or box.

---

**Product spec (draft, to confirm against the photos)**
- **Pouch:** Sprout Original (Adults), Low Sugar. Glossy deep-green foil stand-up pouch, big yellow wordmark, yellow bear face top right. Size to come.
- **Gummies:** colour, shape and surface to be read from the hand photo.
- **Pack:** the 84-pack is 3 identical pouches.

---

**Style sheet (the same for every frame)**
1. **Colour plan: Small splash.** Mostly cream #FFF7DF, with one small patch of sunflower yellow #FFCC2E per frame (a folded cloth, a cup), kept well away from the pouch. Deep green against cream gives the clearest edge. The brand greens are left out of the set so the pouch never blends in. The yellow patch keeps the look sunny and candy-like, never muted.
2. **Light:** Hard late-morning sun as the main light, at 10 o'clock and high, set to the side so its reflection on the glossy foil falls beside the wordmark, never across it. A large white card at 4 o'clock opens the shadows. Bright, clean shadows with crisp edges.
3. **Lens:** Natural 50–85 mm full-frame look with shallow but readable depth of field. Close frames use a 100 mm macro.
4. **Surfaces:** cream seamless paper, a pale light-oak kitchen counter, and a pale warm sandstone step outdoors.
5. **Props:** a fresh curly kale leaf, fresh spinach leaves, a small cream dish of spirulina powder, a clear glass of water, and a cream canvas tote bag ("grab and go").
6. **Finish:** bright exposure, medium-high contrast, rich but true saturation, fine real film grain, true texture on the foil and gummies, no plastic smoothing.

---

**Frame list (9 frames, 4:5 feed)**

| # | Job | Distance | Angle | What it shows |
|---|---|---|---|---|
| 01 | Identity (test frame) | Mid | Eye level | Pouch standing alone on cream seamless paper, with a small yellow cloth fold to one side |
| 02 | Scale | Mid | High (45°) | An adult's whole hand holding the pouch on the oak counter, with the label clear of fingers |
| 03 | Use: in the hand | Close | High (45°) | Open adult palm with two gummies, pouch soft behind (matches your hand photo) |
| 04 | Substance | Close | Straight down | Macro of gummy texture on cream, beside a kale leaf, spinach and the spirulina dish |
| 05 | Use: at home | Wide | Eye level | An adult at a sunny kitchen counter taking a gummy from the pouch, with a glass of water and a yellow mug |
| 06 | Place | Wide | Low | Pouch peeking from the cream tote on a sunlit sandstone step outdoors |
| 07 | Range | Mid | Straight down | The 84-pack's three pouches side by side on cream, with a yellow cloth corner |
| 08 | Ad base | Wide | Straight down | Pouch in the lower third, with open cream space above for words added later |
| 09 | Use: on the go | Mid | Low | An adult's whole hand pulling the pouch from the tote outdoors, heading out |

- **Grid check:** no two frames share job, distance and angle. All three distances and all four angles are used. Use appears at three moments because the product is eaten.
- **People:** made-up adults only, whole hands, and no finger over the label.

---

Reply **"go ahead"** with the two photos and the pouch size, or tell me what to change. I'll then write the nine prompts, starting with frame 01 as the test frame.
```
