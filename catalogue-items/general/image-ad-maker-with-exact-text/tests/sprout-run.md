# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The owner gets two ready-to-paste GPT Image prompts, one per size, that lock the exact words, give each photo a role, keep the pouch closed and intact, and set ratio and quality in the tool. It honestly says it can't see the photos or draw, flags the 21 vs over 20 vitamin count and the unsourced fibre number, and the only slip is re-quoting point 2 in a MISSING line instead of naming it by role.

## Judge list

- Met: Every planned word appears in the prompt once, in quotes, spelled exactly as in the plan.
  "One pack. 60+ ingredients." / "21 vitamins & minerals" / "6g prebiotic fiber" / "Vegan, pectin base" each once in Words; a MISSING line re-quotes point 2 outside the prompt.
- Met: Every attached photo has one job, with what to take and what to ignore.
  "Image 2: ... Take only the gummies' shape, colour, finish and their size against the hand. Ignore the hand, the skin, the background"
- Met: Ratio, size and quality are in the settings, not written into the prompt.
  "Model: GPT Image · Ratio: 1:1 · Resolution: highest the tool offers ... Quality: high"; prompt opens with no shape words.
- Met: The type is described by its look, and every colour has a hex code.
  "bold plain sans-serif, sentence case, normal spacing, #002C17 (deep forest green)"; gradient "#FFF7DF to sunflower yellow #FFCC2E".
- Met: Nothing appears that the plan didn't approve, such as a new claim, person, prop or style.
  Scene stays to pouch, gradient, few gummies; gradient colours marked "[inferred] from your palette"; "no hands and no people".
- Met: On the returned image, the pieces of text can be counted and the count matches.
  "The image has exactly 4 pieces of added text"; check says "Count exactly 4 added pieces of text"; no image could be returned in a text-only run.

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
I can't make images here, so below are the two prompts to paste into GPT Image. I also couldn't see Photos 1 and 2, so the product details come from your notes and the product check is still to do.

**Size 1 of 2**

```
SETTINGS (set in the tool, not in the prompt)
Model: GPT Image · Ratio: 1:1 · Resolution: highest the tool offers (check in the tool) · Quality: high (small text in the points)
Photos attached, in this order: 1 (the pouch, front on), 2 (gummies in an open hand)

PROMPT
A finished, photorealistic product page image for the Sprout online store, explaining what is inside the product.

Reference photos:
Image 1: the Sprout pouch as sold, front on. Match its shape, colours and printing exactly. Ignore its background and lighting.
Image 2: Sprout gummies in an open hand. Take only the gummies' shape, colour, finish and their size against the hand. Ignore the hand, the skin, the background and anything else in it.

Product: a glossy deep green stand-up foil pouch, big yellow wordmark, yellow bear face top right, "28 Daily Packs" along the bottom. It is a closed, intact stand-up pouch with its resealable top sealed. It is never a tub, a box or a torn pack. Keep every word printed on the pouch exactly as Image 1 shows it, with matching letter shapes in matching places. Do not redraw it. Gummies: small opaque deep green bears with a soft matte finish, each about thumbnail height, as in Image 2.

Scene: The pouch stands upright, front facing the camera, on a smooth surface that blends into a soft two-colour gradient backdrop running from warm cream #FFF7DF to sunflower yellow #FFCC2E. A few gummies lie scattered on the surface just in front of the pouch, each resting flat with its own small soft shadow. Soft, even studio light gives the pouch a gentle highlight on its glossy foil and a soft shadow on the surface beneath it, matching the gummies' shadows. The camera is level with the pouch, front on, and the whole pouch and the gummies are in frame.

Layout: Top fifth: a calm band of the cream end of the gradient that holds the headline, centred. Below it, centre-left: the pouch, about two thirds of the frame height, with the gummies at its base. Right third: the three points stacked one above another, left-aligned and evenly spaced, level with the middle of the pouch. Keep clear space around the pouch and between the points. Leave a slim empty margin on every edge.

Words, top to bottom (exact, nothing else):
Headline, top band, centred, bold plain sans-serif, sentence case, normal spacing, #002C17 (deep forest green): "One pack. 60+ ingredients."
Point 1, right third, top, medium-weight plain sans-serif, sentence case, #002C17 (deep forest green): "21 vitamins & minerals"
Point 2, right third, middle, medium-weight plain sans-serif, sentence case, #002C17 (deep forest green): "6g prebiotic fiber"
Point 3, right third, bottom, medium-weight plain sans-serif, sentence case, #002C17 (deep forest green): "Vegan, pectin base"
The image has exactly 4 pieces of added text. No other text except what is printed on the product.

Keep out: no hands and no people; no second pouch, no box, no loose sachets; no tears, dents or open top on the pouch; no icons, badges, buttons, prices or logos beyond the pouch's own printing.

CHECK WHEN IT COMES BACK
Headline: read letter by letter, including the two full stops and the "+" after the number. Point 1: the "21" and the ampersand. Point 2: "6g" with no space, and "prebiotic" spelled p-r-e-b-i-o-t-i-c. Point 3: the comma. Count exactly 4 added pieces of text. Pouch against Image 1: wordmark shape and colour, bear face top right, the bottom line of print, closed top, no tear. Gummies: matte deep green bears, small next to the pouch, not jelly-clear and not bear-sized. Leaks from Image 2: fingers, skin or palm. Every gummy and the pouch has a shadow that matches the light.
MISSING: gradient colours. The plan says "two-colour", and cream #FFF7DF to sunflower yellow #FFCC2E is [inferred] from your palette.
MISSING: the pouch's outside measurements. Without them the gummy-to-pouch scale is a guess, so judge it by eye.
MISSING: a source for point 2. "6g prebiotic fiber" does not appear on the product page file.
MISSING: which vitamin count is right. Point 1 says 21, while the page's ingredients panel says "over 20" (page issue 7). Confirm before launch.
MISSING: Image 1 and Image 2 were not seen here. The product match is still to check against them.

MATCH CHECK
CHECKS MISSED: none in the prompt. The image itself is not yet returned and checked.
```

**Size 2 of 2**

```
SETTINGS (set in the tool, not in the prompt)
Model: GPT Image · Ratio: 4:5 (check the tool offers it; make this as its own image, not a crop of the other) · Resolution: highest the tool offers (check in the tool) · Quality: high (small text in the points)
Photos attached, in this order: 1 (the pouch, front on), 2 (gummies in an open hand)

PROMPT
A finished, photorealistic product page image for the Sprout online store, explaining what is inside the product.

Reference photos:
Image 1: the Sprout pouch as sold, front on. Match its shape, colours and printing exactly. Ignore its background and lighting.
Image 2: Sprout gummies in an open hand. Take only the gummies' shape, colour, finish and their size against the hand. Ignore the hand, the skin, the background and anything else in it.

Product: a glossy deep green stand-up foil pouch, big yellow wordmark, yellow bear face top right, "28 Daily Packs" along the bottom. It is a closed, intact stand-up pouch with its resealable top sealed. It is never a tub, a box or a torn pack. Keep every word printed on the pouch exactly as Image 1 shows it, with matching letter shapes in matching places. Do not redraw it. Gummies: small opaque deep green bears with a soft matte finish, each about thumbnail height, as in Image 2.

Scene: The pouch stands upright, front facing the camera, on a smooth surface that blends into a soft two-colour gradient backdrop running from warm cream #FFF7DF to sunflower yellow #FFCC2E. A few gummies lie scattered on the surface just in front of the pouch, each resting flat with its own small soft shadow. Soft, even studio light gives the pouch a gentle highlight on its glossy foil and a soft shadow on the surface beneath it, matching the gummies' shadows. The camera is level with the pouch, front on, and the whole pouch and the gummies are in frame.

Layout: Top fifth: a calm band of the cream end of the gradient that holds the headline, centred. Below it, centre-left: the pouch, about three fifths of the frame height, standing in the lower part of the frame with the gummies at its base. Right third: the three points stacked one above another, left-aligned, with more space between them than in a shorter frame, spanning the height of the pouch. Keep a band of plain gradient below the gummies, and a slim empty margin on every edge.

Words, top to bottom (exact, nothing else):
Headline, top band, centred, bold plain sans-serif, sentence case, normal spacing, #002C17 (deep forest green): "One pack. 60+ ingredients."
Point 1, right third, top, medium-weight plain sans-serif, sentence case, #002C17 (deep forest green): "21 vitamins & minerals"
Point 2, right third, middle, medium-weight plain sans-serif, sentence case, #002C17 (deep forest green): "6g prebiotic fiber"
Point 3, right third, bottom, medium-weight plain sans-serif, sentence case, #002C17 (deep forest green): "Vegan, pectin base"
The image has exactly 4 pieces of added text. No other text except what is printed on the product.

Keep out: no hands and no people; no second pouch, no box, no loose sachets; no tears, dents or open top on the pouch; no icons, badges, buttons, prices or logos beyond the pouch's own printing.

CHECK WHEN IT COMES BACK
Headline: read letter by letter, including the two full stops and the "+" after the number. Point 1: the "21" and the ampersand. Point 2: "6g" with no space, and "prebiotic" spelled p-r-e-b-i-o-t-i-c. Point 3: the comma. Count exactly 4 added pieces of text. Pouch against Image 1: wordmark shape and colour, bear face top right, the bottom line of print, closed top, no tear, and the pouch not stretched to fill the extra height. Gummies: matte deep green bears, small next to the pouch. Leaks from Image 2: fingers, skin or palm. Shadows match the light. Compare with the 1:1 image: the product, the words and the colours are the same.
MISSING: gradient colours. Cream #FFF7DF to sunflower yellow #FFCC2E is [inferred] from your palette.
MISSING: the pouch's outside measurements, for the gummy-to-pouch scale.
MISSING: a source for point 2, "6g prebiotic fiber".
MISSING: confirmation of "21" against the "over 20" on the ingredients panel.
MISSING: Image 1 and Image 2 were not seen here. The product match is still to check.

MATCH CHECK
CHECKS MISSED: none in the prompt. The image itself is not yet returned and checked.
```

To make the pictures, paste each prompt into ChatGPT (GPT Image) with Photo 1 and Photo 2 attached in that order. Free plans have tight daily limits. In Claude Code, with `OPENAI_API_KEY` saved, I can send them to the API and save the files (OpenAI bills each picture). Send me each image back so I can run the checks and write one-fault edits.

Next, do you want to run these through the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker), bring the image prompts, or something else? The fibre and vitamin numbers are the ones to settle.
```
