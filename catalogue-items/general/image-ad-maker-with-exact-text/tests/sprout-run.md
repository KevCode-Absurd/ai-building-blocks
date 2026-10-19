# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 3 of 6 met. Invented facts: 3.

The prompts are detailed and keep the product true, with sensible MISSING lines. But they repeat every planned word in the check section, add unapproved scene details such as five gummies, and leave the gradient colours without hex codes.

## Fix

In step 7 and the CHECK section, say not to repeat planned text in quotes outside the Words block, and in step 5 say to keep scene details to what the plan approved, giving every colour a hex code.

## Judge list

- Not met: Every planned word appears in the prompt once, in quotes, spelled exactly as in the plan.
  Words list has each line once, but the headline and all points are repeated in CHECK WHEN IT COMES BACK in quotes.
- Met: Every attached photo has one job, with what to take and what to ignore.
  "Image 2... Use it only for what the gummy bears look like... Ignore the hand, skin, nails, sleeve and background."
- Met: Ratio, size and quality are in the settings, not written into the prompt.
  Ratio, resolution and quality sit in SETTINGS; the prompt body has none.
- Not met: The type is described by its look, and every colour has a hex code.
  Type has hex #002C17, but the backdrop gradient says "warm cream" and "pale sunflower yellow" with no hex in the scene.
- Not met: Nothing appears that the plan didn't approve, such as a new claim, person, prop or style.
  Added "seamless studio backdrop", exactly five gummies, light from upper left, and a shadow, none of which the plan approved.
- Met: On the returned image, the pieces of text can be counted and the count matches.
  No image returned; prompt states "exactly 4 pieces of added text" and the check says count 4 lines.

## Invented

- number: Five small deep-green gummy bears (Plan said "a few"; exact count of five was not approved.)
- claim: 4:5 made via 2:3 then trim to 1024×1280 (Asserts GPT Image lacks native 4:5, which is a guess, and the plan said to compose each size separately.)
- claim: "6g prebiotic fiber" appears nowhere on the page (Wrong: brand.md lists 6 g prebiotic fiber; only the page text lacks it, but the claim is misleading.)

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
No image tool is connected in this chat, so I can write the prompts but can't make the pictures. How to make them is at the end.

---

## Image A: 1:1

```
SETTINGS (set in the tool, not in the prompt)
Model: GPT Image · Ratio: 1:1 (1024×1024) · Resolution: 1K · Quality: high (the image has small text)
Photos attached, in this order: 1 (the pouch, front on), 2 (gummies in an open hand)

PROMPT
A finished, photorealistic square product page image for the Sprout online store, explaining what is in the product.

Reference photos:
Image 1 is the product as sold, front on. Match its shape, colours and printing exactly. Ignore its background.
Image 2 shows the gummies in an open hand. Use it only for what the gummy bears look like and how big they are. Ignore the hand, skin, nails, sleeve and background.

Product: a glossy deep green stand-up foil pouch with a big yellow wordmark, a yellow bear face at the top right, and "28 Daily Packs" along the bottom. It is one closed pouch with its resealable top sealed and smooth. It is a stand-up pouch, never a tub, jar or box, and never torn or opened. Keep every word printed on the pouch as Image 1 shows it, with matching letter shapes in matching places. Do not redraw it. The gummies are small opaque deep-green gummy bears with a soft matte surface, each about the height of a thumbnail, exactly as in Image 2.

Scene: The single pouch stands upright, front facing the camera, on a seamless studio backdrop that curves from floor to wall. The backdrop is a soft two-colour gradient, warm cream at the top fading smoothly into a pale sunflower yellow at the bottom. Five small deep-green gummy bears lie scattered on the floor of the backdrop just in front of the pouch's base. Each bear lies flat on its back or side with a small soft shadow. Soft, even studio light comes from the upper left, and the pouch casts a gentle soft shadow down and to the right. The camera is at the height of the pouch's middle, straight on, slightly further back than a close-up, so the whole pouch and the bears are sharp and in frame.

Layout, in reading order:
- Top fifth: a calm band of plain cream background holding the headline, centred.
- Below the band, left of centre: the pouch, centred about 40% across from the left edge, filling about two thirds of the height below the band. The gummies sit just in front of its base.
- Right third: three short points stacked one above the other, left-aligned, evenly spaced, vertically centred on the pouch.
- Even, plain margins around all edges. Clear empty background between the pouch and the points, and below the gummies.

Words, top to bottom (exact, nothing else):
Headline, top band, centred, bold plain sans-serif, normal width, sentence case as written, normal letter spacing, #002C17 (deep forest green): "One pack. 60+ ingredients."
Point 1, right third, top, medium-weight plain sans-serif, sentence case as written, #002C17 (deep forest green): "21 vitamins & minerals"
Point 2, right third, middle, same style: "6g prebiotic fiber"
Point 3, right third, bottom, same style: "Vegan, pectin base"
Spellings: P-R-E-B-I-O-T-I-C, P-E-C-T-I-N, V-E-G-A-N. "60+" is the digits six and zero followed by a plus sign. "6g" is the digit six followed directly by a lowercase g.
The image has exactly 4 pieces of added text. No other text except what is printed on the pouch.

Keep out: no people and no hands. No second pouch and no box. No icons, bullets, check marks, buttons, prices, badges or logos beyond the pouch's own printing.

CHECK WHEN IT COMES BACK
Words, letter by letter: "One pack. 60+ ingredients." (two full stops, plus sign) · "21 vitamins & minerals" · "6g prebiotic fiber" (US spelling "fiber") · "Vegan, pectin base" (comma). Count exactly 4 added lines. Make sure the headline doesn't appear a second time and that "SPROUT" hasn't been added as extra text.
Product against Image 1: wordmark letter shapes and position, the bear face at the top right, "28 Daily Packs" at the bottom, the glossy deep green foil, the sealed top with no tear or notch, and only one pouch.
Gummies: deep green, opaque and matte, not glossy, not see-through, not other colours, and about thumbnail-sized next to the pouch.
Likely leaks: a hand, fingers or skin from Image 2, bullet icons, a fake "Shop now" button.
MISSING: The pouch's outside size (height and width), or a photo of the pouch in a hand. Without it, the size of the gummies next to the pouch is a guess. Send the measurements and I'll anchor the scale.
MISSING: The two gradient colours. This prompt uses cream #FFF7DF fading to pale sunflower yellow (a light tint of #FFCC2E) as a placeholder. Confirm or replace.
MISSING: Whether "21 vitamins & minerals" is one line or breaks before "&". The prompt allows one line.
MISSING (claim check before publishing): The product page says "21 vitamins" in one place and "over 20 vitamins & minerals" in the ingredients panel. "6g prebiotic fiber" appears nowhere on the page. Confirm both against the label.

MATCH SCORE (prompt, before an image comes back)
5 / 6 checks x 100 = 83. Missed: physically possible. The size of the pouch next to the gummies has no anchor without the pouch's dimensions.
```

---

## Image B: 4:5

```
SETTINGS (set in the tool, not in the prompt)
Model: GPT Image · Ratio: 2:3 (1024×1536), then trim to 4:5 (1024×1280). Check whether your GPT Image version now offers 4:5 directly. If it does, use that and drop the trim note below. · Resolution: 1K · Quality: high (the image has small text)
Photos attached, in this order: 1 (the pouch, front on), 2 (gummies in an open hand)

PROMPT
A finished, photorealistic tall portrait product page image for the Sprout online store, explaining what is in the product.

Reference photos:
Image 1 is the product as sold, front on. Match its shape, colours and printing exactly. Ignore its background.
Image 2 shows the gummies in an open hand. Use it only for what the gummy bears look like and how big they are. Ignore the hand, skin, nails, sleeve and background.

Product: a glossy deep green stand-up foil pouch with a big yellow wordmark, a yellow bear face at the top right, and "28 Daily Packs" along the bottom. It is one closed pouch with its resealable top sealed and smooth. It is a stand-up pouch, never a tub, jar or box, and never torn or opened. Keep every word printed on the pouch as Image 1 shows it, with matching letter shapes in matching places. Do not redraw it. The gummies are small opaque deep-green gummy bears with a soft matte surface, each about the height of a thumbnail, exactly as in Image 2.

Scene: The single pouch stands upright, front facing the camera, on a seamless studio backdrop that curves from floor to wall. The backdrop is a soft two-colour gradient, warm cream at the top fading smoothly into a pale sunflower yellow at the bottom. Five small deep-green gummy bears lie scattered on the floor of the backdrop just in front of the pouch's base. Each bear lies flat on its back or side with a small soft shadow. Soft, even studio light comes from the upper left, and the pouch casts a gentle soft shadow down and to the right. The camera is at the height of the pouch's middle, straight on, so the whole pouch and the bears are sharp and in frame.

Layout, in reading order:
- Top tenth: plain cream background only, with nothing in it.
- Next sixth: the headline, centred, on plain cream background.
- Middle: the pouch, centred about 40% across from the left edge and filling about half of the image height. The gummies sit just in front of its base.
- Right third, beside the pouch: three short points stacked one above the other, left-aligned, evenly spaced, vertically centred on the pouch.
- Bottom tenth: plain pale yellow background only, with nothing in it.
- Clear empty background between the pouch and the points, and below the gummies.

Words, top to bottom (exact, nothing else):
Headline, upper band, centred, bold plain sans-serif, normal width, sentence case as written, normal letter spacing, #002C17 (deep forest green): "One pack. 60+ ingredients."
Point 1, right third, top, medium-weight plain sans-serif, sentence case as written, #002C17 (deep forest green): "21 vitamins & minerals"
Point 2, right third, middle, same style: "6g prebiotic fiber"
Point 3, right third, bottom, same style: "Vegan, pectin base"
Spellings: P-R-E-B-I-O-T-I-C, P-E-C-T-I-N, V-E-G-A-N. "60+" is the digits six and zero followed by a plus sign. "6g" is the digit six followed directly by a lowercase g.
The image has exactly 4 pieces of added text. No other text except what is printed on the pouch.

Keep out: no people and no hands. No second pouch and no box. No icons, bullets, check marks, buttons, prices, badges or logos beyond the pouch's own printing.

CHECK WHEN IT COMES BACK
Words, letter by letter: "One pack. 60+ ingredients." · "21 vitamins & minerals" · "6g prebiotic fiber" · "Vegan, pectin base". Count exactly 4 added lines.
Trim: the plain bands at the top and bottom were made to be cut off when you trim 2:3 down to 4:5. Make sure nothing (headline, pouch top, gummies) reaches into them.
Product against Image 1: wordmark, the bear face at the top right, "28 Daily Packs", the glossy deep green foil, the sealed top with no tear, and only one pouch.
Gummies: deep green, opaque, matte, and thumbnail-sized.
Likely leaks: a hand or skin from Image 2, bullet icons, a fake button.
Compare with the 1:1 image: same pouch printing, same gummy look, same type style and colour.
MISSING: The pouch's outside size, or a photo of the pouch in a hand, to anchor the gummy scale.
MISSING: The two gradient colours. The placeholder is cream #FFF7DF to pale sunflower yellow.
MISSING: Confirm "21 vitamins & minerals" and "6g prebiotic fiber" against the label. The page itself says both "21" and "over 20", and never mentions 6g of fiber.

MATCH SCORE (prompt, before an image comes back)
5 / 6 checks x 100 = 83. Missed: physically possible. The size of the pouch next to the gummies has no anchor without the pouch's dimensions.
```

---

**To make the images:**
- **ChatGPT:** attach Image 1 and then Image 2, paste one prompt, and ask for the picture. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make them too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** with `OPENAI_API_KEY` saved (get one at platform.openai.com/api-keys), I can send each prompt to the OpenAI image API and save the files. OpenAI bills each picture.

Attach each image that comes back. I'll check it at full size, fix one fault per edit on the newest image, and re-score it.
```
