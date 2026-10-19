# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 1.

The plan is well built: a clear Build moment, a 7-word headline, the approved claim word for word, honest offer terms with the renewal price, and sensible MISSING lines. But the image prompt calls the pouch "greens powder", which misdescribes the product to the image tool and clashes with the exact buyer this ad targets.

## Fix

In step 7 (image prompt) add: "Name what is inside the pack exactly as the brand file does (e.g. gummies); never describe the product as the thing it replaces." Add the same line to the check list.

## Judge list

- Met: Shown for 2 seconds, someone can say what the product is and the one idea.
  "The Sprout pouch upright and centred, about 40% of frame width" with glazed greens stacking above it and "A whole shelf of greens. One pack."
- Met: The headline has 7 words or fewer, with at most 3 other things to read.
  "Headline (7 words): A whole shelf of greens. One pack." plus claim line and offer line; "There is no button on the image."
- Met: The words sit on bare paper, big and dark enough to read on a phone.
  "Headline: forest green #00582D, about 64 px, centred on the bare paper"; offer at 30 px on a solid brand-colour band, contrast ~8:1.
- Met: The implied sentence is something your claims let you say, and nothing shows a body changing.
  "One Sprout pack holds a lot of different greens." backed by the approved 60+ claim; all painted plants on the given list; no figure.
- Not met: The product matches your photos, with your real label laid over it.
  Image prompt opens "A painted watercolour stand-up pouch of greens powder"; the product is gummies. Overlay step is present but premise is wrong.

## Invented

- claim: stand-up pouch of greens powder (Sprout sells gummies, not powder; powder is the enemy this buyer quit, and the avoid field even lists "powder".)

## What went in

```text
Selling idea: a whole shelf of greens in one small pack.
Buyer: the quitter who wants to stick, 28 to 45. Gave up greens
powders ("gritty/chalky"). Knows the fixes, not Sprout. Runs in
the Instagram feed.
Product: Sprout Low Sugar, 28 daily packs. Glossy deep green
stand-up pouch, big yellow wordmark "Sprout", yellow bear face top
right, "28 Daily Packs" at the bottom. Photos attached: front,
side, top.
Ingredients include organic kale, spinach, spirulina, chlorella,
wheatgrass, broccoli and beet; acai, goji, pomegranate.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack. Never say: fix, energy or immunity results, weight loss.
Colors: forest green #00582D, warm cream #FFF7DF, sunflower
yellow #FFCC2E.
Offer: $29.99 first order with the text sign-up, renews at $49.99
every 4 weeks.
```

## What came out

```text
## 1. Moment plan
- **Fit:** Good. "A whole shelf of greens in one small pack" is many parts adding up, which a photo of a pouch can't show. Watercolour is not used to prove texture or taste.
- **Moment:** The buyer is comparing fixes, so the painted change is caught halfway. Painted leafy greens stack up in see-through layers. Each layer deepens as it drops toward the pouch, as if the shelf is filling the pack.
- **Show job:** Build.
- **Technique:** Glazing, wet-on-dry. There are four transparent layers, from top to bottom:
  1. Pale yellow-green wheatgrass blades
  2. Spinach leaves
  3. Kale and broccoli florets
  4. A deep blue-green spirulina and chlorella glaze, where the layers meet the pouch top

  Every overlap is a shade deeper. The top layer is still the pale first glaze.
- **Paper:** Hot-press. It is smooth, gives crisp label shapes and has no grain. There is no granulation, salt or dry brush, so nothing reads as gritty or chalky.
- **Colour:** Greens and yellows next to each other on the wheel: forest green #00582D, sap green, a cool blue-green and sunflower yellow #FFCC2E. Acai, goji, pomegranate and beet are left out on purpose. Reds and purples glazed over green turn brown.
- **Sentence it implies:** "One Sprout pack holds a lot of different greens."
- **Source:** The approved claim "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack. Every painted plant is on the given list: kale, spinach, broccoli, wheatgrass, spirulina, chlorella.
- **What it does not imply:**
  - Nothing about smoothness or taste. There is no approved claim for either.
  - Nothing about energy, immunity, weight or a body changing.

## 2. Layout
- **Size:** 4:5, 1080 x 1350.
- **Zone map, top to bottom:**

| Zone | Height | Contents |
|---|---|---|
| 0–25% | Quiet area | Bare cream paper. Holds the headline and the claim line. |
| 25–58% | Picture | The four glazed layers of greens, tapering down toward the pouch. |
| 58–87% | Product | The Sprout pouch upright and centred, about 40% of frame width. It sits on bare paper with the deepest glaze just behind its top edge, and has the crispest edges in the frame. |
| 87–100% | Offer band | A solid forest green #00582D band with the offer line. |

- **1:1 (1080 x 1080) recompose:** Do not stretch the 4:5 version.
  - 0–24%: headline and claim
  - Left 0–55%, from 24% to 86%: the glazes, painted wider and shorter
  - Right 50–95%, from 24% to 86%: the pouch
  - 86–100%: offer band

## 3. Words on the image
1. **Headline (7 words):** A whole shelf of greens. One pack.
   - This is a plain metaphor. It is backed by the listed greens and the 60+ ingredients claim.
2. **Claim line:** 60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack
   - Source: the approved claim, word for word.
3. **Offer line:** $29.99 first order with text sign-up. Renews at $49.99 every 4 weeks.
   - Source: the brand offer and its terms.

There is no button on the image. The Instagram CTA button carries it, so the image has 2 items to read besides the headline.

## 4. Image prompt
> A painted watercolour stand-up pouch of greens powder standing upright, glossy deep forest green, with a big painted sunflower-yellow wordmark and a small painted yellow bear face in the top right corner. Above the pouch, painted watercolour greens build up in four transparent glazed layers:
> - pale yellow-green painted wheatgrass blades at the top
> - then painted spinach leaves
> - then painted kale and broccoli florets
> - then a deep blue-green painted wash where the layers meet the top of the pouch
>
> Each overlap is visibly a shade deeper, and the topmost layer is still a pale first glaze.
>
> No setting, only bare white-cream watercolour paper. Transparent watercolour glazing, wet-on-dry, on smooth hot-press paper with clean hard-edged layers and no granulation. Palette: forest green, sap green, cool blue-green, sunflower yellow.
>
> Soft even light, with the bare paper as the brightest light. Vertical 4:5 framing:
> - The top quarter of the frame is empty bare cream paper.
> - The greens fill the middle third.
> - The pouch is centred in the lower third with the sharpest, crispest edges in the image.
> - A plain empty strip runs along the bottom 13%.
>
> Label lines: "Sprout", "28 Daily Packs".

**Avoid field:** photograph, 3D render, plastic, brush, hand of a painter, desk, powder, dust, scoop, glass, spoon, berries, beetroot, text, person.

## 5. Post words
- **Primary text:** Gave up on greens powders? One Sprout pack holds 60+ ingredients, 21 vitamins & minerals, and 6g fiber, and your first order is $29.99 with text sign-up, renewing at $49.99 every 4 weeks.
- **Headline field:** First order $29.99 with text sign-up
- **Button:** Shop Now

## 6. Edit step
1. **Label overlay:** Cut the real pouch out of the front photo. Lay it over the painted pouch, matched to its size and angle. Feather only the outer edge so that "Sprout", the bear face and "28 Daily Packs" are the real ones, letter for letter. Use the side and top photos to check the pouch shape and gusset.
2. **Placing the words:**
   - Headline: forest green #00582D, about 64 px, centred on the bare paper at 6–15%.
   - Claim line: forest green, 32 px, at 16–23%.
   - Offer line: warm cream #FFF7DF, 30 px, centred in the green band at 87–100%.
   - Keep everything off the glazes. Never set yellow type on cream.
3. **Contrast check:**
   - Forest green on cream: about 8.0:1. Passes.
   - Cream on forest green: about 8.0:1. Passes.
   - If the paper reads darker than #FFF7DF in the render, sample it and recheck that it stays at 4.5:1 or more.
4. **Glance check:** View it at phone size for 2 seconds. A stranger should be able to say "Sprout greens pack, lots of greens in one." Before it runs, check the price and terms against the live offer that day.

## 7. MISSING
- MISSING: the pouch label text word for word. Is "Low Sugar" printed on the front? If so, it is the third label line, and the overlay must show it.
- MISSING: the full ingredient list. Only "includes" was given, so nothing beyond the listed greens is painted.
- MISSING: the offer end date and the full sign-up and cancel terms.
- MISSING: an approved claim on texture or taste (for example, smooth or not chalky). Without one, the "gritty/chalky" objection is not answered in words or paint.
```
