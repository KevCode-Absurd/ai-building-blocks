# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 6 met. Invented facts: 3.

The concept is strong and on-brief, with a clear side-by-side idea, the right problem quotes and no health claims. A few details are weak: the product is tucked in a lower-right corner, the front-print claim conflicts with the prompt, and the output shape was reworked.

## Fix

In step 6 and the product check, require the product to sit in the scene's middle ground, not a corner, and state its readable print only from the photo. Also require the output to use the fixed shape's labelled lines (ONE THOUGHT, MOMENT, TWIST...) instead of free headings.

## Judge list

- Met: Cover the headline. The picture alone shows the problem.
  Unrinsed shaker with dried chalky green ring in sink, beside a dry counter with the pack: shows the chore.
- Met: One sentence on why the picture is unexpected and why relevant.
  "Greens ads show a glowing glass... not the dirty shaker"; "exact object and chore from review 6".
- Not met: Product in the ad, small and matching real photo, not pasted in a corner.
  Placed "lower right" on the counter edge, and the prompt says "readable at small size" with "no added text", which conflicts with its front print reading at thumbnail size.
- Met: Picture shows problem or cause, never a result or before-and-after.
  Shows a messy shaker next to a dry counter with the pack; no body change or result claimed. Mildly contrast-framed, though.
- Met: Headline names a moment or gain, not a reader condition.
  "Greens with nothing to wash" (gain).
- Met: Prompt mentions the problem before the product.
  Prompt starts with the sink and unrinsed shaker with chalky ring before the pack.

## Invented

- number: The shaker is a standard 20 oz bottle (Size is not in the files; it is an art-direction choice, not a Sprout fact.)
- other: Line under the image: "Tear, eat. Nothing to rinse." (28 characters) (The count is wrong; it is 26 characters, and the line is new copy, not a brand line.)
- claim: the pack's front print reads at thumbnail size (The torn daily pack's front print is not described in the files; it is assumed, and the prompt contradicts it with "no added text".)

## What went in

```text
Problem: review 6, "Plus not having to clean a shaker bottle or
extra dishes for greens stuff in powder form, is absolutely
excellent!" and review 3, "the drink was definitely
gritty/chalky."
Moment: a weekday morning at the sink.

Product: Sprout, daily greens gummies. Tear a pack, eat the
gummies. No water, no mixing. 6 g prebiotic fiber.
Brand line: "No more gagging on pills, sloshing chalky powders, or
cleaning messy counters."
Never: "fix", weight or energy results, before-and-after.

Photos: the adult pouch on a soft gradient; one daily pack torn
straight across the top, gummies pouring into a palm.
Look: deep forest green #002C17, sunflower yellow #FFCC2E. Work
Sans bold. Photos are bright and sunny, never clinical.
Offer: none.
```

## What came out

```text
# Concept card: Sprout, "nothing to wash"

**The one thought**
After one look, the buyer thinks: *"No shaker bottle or extra dishes to clean."*
- Quote: "Plus not having to clean a shaker bottle or extra dishes for greens stuff in powder form, is absolutely excellent!" (review 6)
- Supporting quote: "the drink was definitely gritty/chalky." (review 3)

**The moment**
A weekday morning at the kitchen sink, about 7am. Last night's greens shaker sits unrinsed in the basin, with a dried, chalky green ring around the inside wall.

**The twist**
- **Structure: side by side.** The crusted shaker sits in the sink. On the dry counter edge right beside it, a hand holds the torn Sprout daily pack with gummies poured into the palm.
- **Why not plain:** a plain shaker with one exact detail (the crust ring) makes the problem real. But it has no room for the product without becoming an ordinary product shot. Placing the two together lets the comparison carry the point.
- **What it concludes:** *this is the opposite of that.* One leaves a dish in the sink. The other leaves nothing.

**Two-by-two**
- **Unexpected: yes.** Greens ads show a glowing glass or a smoothie, not the dirty shaker left behind.
- **Relevant: yes.** It is the exact object and chore from review 6, and the residue from review 3.
- **Result: keep.**

**Headline on the image** (gain, 5 words)
"Greens with nothing to wash"

**Support line** (brand's own words)
"No more gagging on pills, sloshing chalky powders, or cleaning messy counters."

**Line under the image** (28 characters)
Tear, eat. Nothing to rinse.

**The look and why**
- **Style:** a photograph, because the point is "this is real." The crust is a mess the buyer has actually scrubbed.
- **Light and colour:** bright, sunny morning light from a window, warm and clean, never clinical.
- **Palette:** a light sink and counter so the forest green and sunflower yellow carry the brand.

**The frame** (4:5 Feed)
- **Focal point:** the dried green ring inside the shaker bottle, sharp and lit by the window.
- **Quiet area for words:** the top third, a plain pale wall in soft sunlight above the sink.
  - Headline: Work Sans bold, deep forest green #002C17.
  - Support line: smaller, in the same green, set below the headline.
  - A short sunflower yellow #FFCC2E bar under the headline.
  - Two colours only.
- **Product position:** lower right, on the dry counter edge just outside the sink. An adult hand's open palm holds the gummies, with the torn daily pack resting at the fingers. It is small, but the pack's front print reads at thumbnail size.
- **Scale:**
  - The shaker is a standard 20 oz bottle, standing about two-thirds the height of the faucet.
  - The daily pack is roughly palm-length.
  - Each gummy is about fingertip-sized.

**Product treatment**
- **Source photo:** the daily pack torn straight across the top, with gummies pouring into a palm. This is the in-use photo, so the use scene is built from it.
- **The pack:** keep its exact shape, the straight tear, its colours and its large front print. Leave out any small print and invent none.
- **The gummies:** match the photo's colour, shape and count.
- **The hand:** a made-up adult hand only, with no face. It is not presented as a customer, expert or founder.
- **The shaker:** generic, with no brand and no label.

**Image prompt**
> Bright, sunny weekday-morning photograph of a home kitchen sink, warm window light, clean and cheerful, not clinical. In the sink basin stands an unrinsed plastic shaker bottle, about two-thirds the height of the faucet, no label. Inside it a dried, chalky green powder ring crusts the wall, sharp and in focus as the main subject. Beside the sink, on the dry light countertop in the lower right of the frame, an adult hand holds an open palm of daily greens gummies next to a small daily pack torn straight across the top, matching the reference photo exactly in shape, colour and front print, no added text, readable at small size. The counter around the pack is dry and spotless, the sink side messy, the two side by side. The top third of the frame is a plain pale wall in soft sunlight, left empty for text. Headline in that area in a bold geometric sans-serif, deep forest green #002C17, with a short sunflower yellow #FFCC2E bar beneath: "Greens with nothing to wash". 4:5 vertical, few objects, one focal point, no other text.

The support line is set afterwards in the layout file, in Work Sans bold, #002C17. It is not generated, because a line that long garbles in image tools.

**MISSING:** none

**Not used**
- **Adult pouch on gradient:** a closed studio shot, which doesn't fit a use scene.
- **"6 g prebiotic fiber":** no source on file, and not needed for this thought.
- **News and curiosity headlines:** the gain carries the thought, and there is no new fact on file.
- **Offer:** none running.
- **Showing a result:** no fix, weight or energy claims, and no before-and-after.
```
