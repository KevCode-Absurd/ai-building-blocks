# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 6 met. Invented facts: 0.

Two careful, usable prompts with the product facts held steady, the planned words quoted correctly, honest MISSING lines and no invented Sprout facts. It slips on two mechanical rules the block exists for: it writes the 4:5 ratio into the prompt text and re-quotes "6g" and "60+" a second time, which risks stray text in the image.

## Fix

In step 2 add: "Do not name the ratio in the prompt text either, not even in brackets; describe the frame only through the layout." In step 7 add: "Spell out letters with hyphens only; never put a word or fragment in quote marks a second time anywhere in the prompt."

## Judge list

- Not met: Every planned word appears in the prompt once, in quotes, spelled exactly as in the plan.
  Lines are right, but the prompt then re-quotes fragments: '"6g" with no space, "60+" with a plus sign', doubling quoted text the skill warns against.
- Met: Every attached photo has one job, with what to take and what to ignore.
  "Image 2: ... Take only the gummies' shape, colour, matte texture and size. Ignore the hand, the skin and the background."
- Not met: Ratio, size and quality are in the settings, not written into the prompt.
  Settings are correct, but the 4:5 prompt opens "photorealistic portrait-format (4:5) product page image", writing the ratio into the prompt.
- Met: The type is described by its look, and every colour has a hex code.
  "bold plain sans-serif, sentence case, normal spacing, #002C17 (deep forest green)"; band "#FFF7DF"; gradient colours left as MISSING placeholders.
- Met: Nothing appears that the plan didn't approve, such as a new claim, person, prop or style.
  Only pouch, gummies, gradient, cream band and the three planned points; "no hands and no people"; light direction chosen but flagged MISSING.
- Met: On the returned image, the pieces of text can be counted and the count matches.
  "The image has exactly 4 pieces of added text" and CHECK: "Count the added text. It should be exactly 4 pieces".

## What went in

```text
Plan: product page image 3, "Why does it work?"
- Kind: a finished product page image for the Sprout store
- Words: headline "One pack. 60+ ingredients." Points: "21 vitamins
  & minerals", "6g prebiotic fiber", "Vegan, pectin base"
- Scene: the pouch standing on a soft two-colour gradient, a few
  gummies scattered in front
- Layout: headline band at the top, pouch centre-left, three points
  in the right third
- Sizes: 1:1 and 4:5
- Tool: GPT Image

Photos: 1 = the pouch, front on. 2 = gummies in an open hand.
Product facts: glossy deep green stand-up foil pouch, big yellow
wordmark, yellow bear face top right, "28 Daily Packs" at the
bottom. Gummies: small opaque deep-green bears, soft matte, about
thumbnail height. The big pouch opens only at its resealable top
and is never shown torn.
Colours: deep forest green #002C17, warm cream #FFF7DF, sunflower
yellow #FFCC2E. Type: bold plain sans for headings, medium for body.

[attached: sprout/product-page.md]
```

## What came out

```text
```
SETTINGS (set in the tool, not in the prompt)
Model: GPT Image · Ratio: 1:1 · Resolution: 1K (1024×1024) · Quality: high (small text)
Photos attached, in this order: 1 (the pouch, front on), 2 (gummies in an open hand)

PROMPT
A finished, photorealistic square product page image for the Sprout online store, explaining why the product works.

Reference photos:
Image 1: the Sprout pouch as sold, front on. Match its shape, colours and printing exactly. Ignore its background and lighting.
Image 2: Sprout gummies in an open hand. Take only the gummies' shape, colour, matte texture and size. Ignore the hand, the skin and the background.

Product: a glossy deep green stand-up foil pouch, big yellow wordmark, yellow bear face top right, "28 Daily Packs" along the bottom. It is shown standing upright, closed and sealed at its resealable top. It is never torn, opened, dented or creased, and never a tub, a box or a jar. Keep every word printed on the pouch as Image 1 shows it, with matching letter shapes in matching places. Do not redraw it.
Gummies: small opaque deep-green gummy bears with a soft matte surface, each about the height of a thumbnail, exactly as in Image 2.

Scene: The pouch stands upright on its base on a seamless soft two-colour gradient that runs from {colour A} at the top to {colour B} at the bottom. The gradient forms both the floor and the wall. Five gummy bears lie scattered on the floor just in front of the pouch base. They are loose, face up or on their sides, and each casts its own small soft shadow. Soft, diffused light comes from the upper left, giving the pouch a gentle sheen on its foil and a soft contact shadow falling to the lower right. The camera sits at the pouch's mid-height, straight on, with the whole pouch and the gummies in frame.

Layout: Top fifth: a plain warm cream (#FFF7DF) band across the full width that holds the headline. Below the band, the left two thirds hold the pouch, set centre-left. The pouch is about 60% of the frame height, with the gummies at its base. Right third: the three points stacked one under another, vertically centred on the pouch, left-aligned, with even space between them. Clear margins stay empty on all edges. Nothing else is in the frame.

Words, top to bottom (exact, nothing else):
Headline, centred in the top cream band, bold plain sans-serif, sentence case, normal spacing, #002C17 (deep forest green): "One pack. 60+ ingredients."
Point 1, right third, top, medium plain sans-serif, sentence case, #002C17 (deep forest green): "21 vitamins & minerals"
Point 2, right third, middle, same style, #002C17 (deep forest green): "6g prebiotic fiber"
Point 3, right third, bottom, same style, #002C17 (deep forest green): "Vegan, pectin base"
Spell them letter by letter: P-E-C-T-I-N, P-R-E-B-I-O-T-I-C, "6g" with no space, "60+" with a plus sign.
The image has exactly 4 pieces of added text. No other text except what is printed on the pouch.

Keep out: no hands and no people. No second pouch, no box and no small daily packs or sachets. No badges, stars, prices, icons or bullet symbols.

CHECK WHEN IT COMES BACK
- Read "One pack. 60+ ingredients." letter by letter, including both full stops and the plus sign.
- Read "21 vitamins & minerals", "6g prebiotic fiber" and "Vegan, pectin base" letter by letter, including the ampersand, the comma and "6g" with no space.
- Count the added text. It should be exactly 4 pieces, with no stray caption, button or watermark.
- Compare the pouch printing with Image 1: the wordmark, the bear face top right and "28 Daily Packs" along the bottom.
- The pouch should be closed and untorn, with its top intact.
- Gummies should be opaque, matte and deep green, not translucent or glossy. They should be thumbnail-small next to the pouch, not oversized.
- Watch for leaks: a hand or skin carried over from Image 2, or a background copied from Image 1.
- Check that the text colour is #002C17 and the band is #FFF7DF.
- Check the shadows run lower right, matching the upper-left light.
MISSING: the two gradient colours ({colour A}, {colour B}).
MISSING: the vitamin count. The plan says "21 vitamins & minerals", but the ingredients panel on the product page says "over 20". Confirm 21 against the label before this ships.
MISSING: the source for "6g prebiotic fiber". It does not appear anywhere on the product page. Confirm it per daily pack from the label, and for which sugar level (Low Sugar or Sugar-Free) Image 1 shows.
MISSING: the pouch's outside measurements, or a photo of the pouch next to a hand or the gummies. Without them, the scale of the gummies against the pouch is a guess.
MISSING: the light direction. The plan didn't set it; upper left is used here.
```

```
SETTINGS (set in the tool, not in the prompt)
Model: GPT Image · Ratio: 4:5 (confirm your GPT Image offers it; see MISSING) · Resolution: 1K · Quality: high (small text)
Photos attached, in this order: 1 (the pouch, front on), 2 (gummies in an open hand)

PROMPT
A finished, photorealistic portrait-format (4:5) product page image for the Sprout online store, explaining why the product works.

Reference photos:
Image 1: the Sprout pouch as sold, front on. Match its shape, colours and printing exactly. Ignore its background and lighting.
Image 2: Sprout gummies in an open hand. Take only the gummies' shape, colour, matte texture and size. Ignore the hand, the skin and the background.

Product: a glossy deep green stand-up foil pouch, big yellow wordmark, yellow bear face top right, "28 Daily Packs" along the bottom. It is shown standing upright, closed and sealed at its resealable top. It is never torn, opened, dented or creased, and never a tub, a box or a jar. Keep every word printed on the pouch as Image 1 shows it, with matching letter shapes in matching places. Do not redraw it.
Gummies: small opaque deep-green gummy bears with a soft matte surface, each about the height of a thumbnail, exactly as in Image 2.

Scene: The pouch stands upright on its base on a seamless soft two-colour gradient that runs from {colour A} at the top to {colour B} at the bottom. The gradient forms both the floor and the wall. Five gummy bears lie scattered on the floor just in front of the pouch base. They are loose, face up or on their sides, and each casts its own small soft shadow. Soft, diffused light comes from the upper left, giving the pouch a gentle sheen on its foil and a soft contact shadow falling to the lower right. The camera sits at the pouch's mid-height, straight on, with the whole pouch and the gummies in frame.

Layout: Top sixth: a plain warm cream (#FFF7DF) band across the full width that holds the headline. Below the band, the left two thirds hold the pouch, set centre-left. The pouch is about 60% of the frame height, with a little more open floor beneath it than in a square so the gummies sit clearly in front. Right third: the three points stacked one under another, vertically centred on the pouch, left-aligned, with even space between them. Clear margins stay empty on all edges. Nothing else is in the frame.

Words, top to bottom (exact, nothing else):
Headline, centred in the top cream band, bold plain sans-serif, sentence case, normal spacing, #002C17 (deep forest green): "One pack. 60+ ingredients."
Point 1, right third, top, medium plain sans-serif, sentence case, #002C17 (deep forest green): "21 vitamins & minerals"
Point 2, right third, middle, same style, #002C17 (deep forest green): "6g prebiotic fiber"
Point 3, right third, bottom, same style, #002C17 (deep forest green): "Vegan, pectin base"
Spell them letter by letter: P-E-C-T-I-N, P-R-E-B-I-O-T-I-C, "6g" with no space, "60+" with a plus sign.
The image has exactly 4 pieces of added text. No other text except what is printed on the pouch.

Keep out: no hands and no people. No second pouch, no box and no small daily packs or sachets. No badges, stars, prices, icons or bullet symbols.

CHECK WHEN IT COMES BACK
- Read "One pack. 60+ ingredients." letter by letter, including both full stops and the plus sign.
- Read "21 vitamins & minerals", "6g prebiotic fiber" and "Vegan, pectin base" letter by letter, including the ampersand, the comma and "6g" with no space.
- Count the added text. It should be exactly 4 pieces, with no stray caption, button or watermark.
- Compare the pouch printing with Image 1: the wordmark, the bear face top right and "28 Daily Packs" along the bottom.
- The pouch should be closed and untorn, with its top intact.
- Gummies should be opaque, matte and deep green, not translucent or glossy. They should be thumbnail-small next to the pouch, not oversized.
- Watch for leaks: a hand or skin carried over from Image 2, or a background copied from Image 1.
- Check that the pouch printing and the product facts match the 1:1 version exactly.
- Check that the ratio actually came back as 4:5 and was not cropped from another size.
MISSING: whether your GPT Image access offers 4:5. Its standard sizes are 1024×1024, 1536×1024 and 1024×1536 (2:3). If 4:5 isn't offered, decide whether this size is made in another tool or the plan changes to 2:3. Don't crop it from the square.
MISSING: the two gradient colours ({colour A}, {colour B}).
MISSING: confirm "21 vitamins & minerals" against the label. The page says "over 20".
MISSING: a source for "6g prebiotic fiber" per daily pack, and for which sugar level. It is not on the product page.
MISSING: the pouch's outside measurements, or a photo of the pouch with a hand or gummies, to fix the scale.
MISSING: the light direction. The plan didn't set it; upper left is used here.
```
```
