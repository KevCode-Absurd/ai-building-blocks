# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 6 met. Invented facts: 1.

The run is an honest, well-reasoned run sheet: right model, faithful settings, Figma re-export for the type, all rows marked 'needs a person', and MISSING wherever it could not see or run anything. But it delivers no upscaled file, no real pixel size and no letter-by-letter check, so the owner still has the whole job ahead of them, and one check item wrongly calls the gummies translucent.

## Fix

In 'If something is missing', add: 'If you cannot open the image or run the tool in this session, say so in the first line, label the output RUN SHEET (not run), and ask for the returned file before writing Result or Review.' Also in Step 7, say product rows must use the brand's own product description (e.g. opaque, matte) rather than guessed traits.

## Judge list

- Not met: The report gives the returned file's real pixel size, and it matches the target and the original's ratio.
  "Result: MISSING: returned file. No try has been run or seen yet." Ratio kept: "not yet known". No real file size reported.
- Met: The kind of upscaler fits what's in the picture, and a faithful model was tried first.
  "Topaz Gigapixel, High Fidelity model. This is a faithful model, chosen because the image has hands, a printed product and words."
- Not met: Every printed word and logo was read letter by letter, or put back from the design file or artwork.
  Only planned: "export it again from the Figma file"; "MISSING: Sprout pouch/logo artwork." Nothing was actually read or placed back.
- Met: A difference check was done, or the report says why it couldn't be.
  "Difference check: not done yet" because "the returned file has not been seen", with the three steps listed for the reviewer.
- Met: Nothing is marked "pass" that wasn't compared. Unseen areas say "needs a person".
  All five rows read "needs a person to check"; "none of these areas has been compared yet".
- Met: The original file is still there, unchanged.
  "The original sprout-pour_4x5.png stays untouched."

## Invented

- claim: gummy translucency (Brand file says the gummies are "small opaque deep-green bears, soft matte"; translucency is not a Sprout fact and would mislead the reviewer.)

## What went in

```text
Approved image attached: sprout-pour_4x5.png, 1080 x 1350 px.
An adult's hand holds a Sprout daily pack torn across the top,
green gummy bears pour into the other palm, and the Sprout Original
pouch stands behind (glossy deep green foil, big yellow wordmark,
yellow bear face top right, "28 Daily Packs" at the bottom).
Words on the image, added in Figma: "Rip. Tip. Enjoy."

Need: a 4:5 banner printed at 12 x 15 inches, 180 ppi.
Tool: Topaz Gigapixel.
```

## What came out

```text
- **Source:** `sprout-pour_4x5.png`, 1080 x 1350 px, ratio 4:5 portrait.
  - `MISSING: a full-size view of the original.` Step 1 (checking it for a misspelling, a broken hand or wrong pouch printing before upscaling) has not been done. Someone must check it at 100% first. If anything needs fixing, fix it before any try.

- **Target:** 2160 x 2700 px, 4:5 portrait. That is 12 x 15 in at 180 ppi, for a printed banner.
  - The scale is 2160 ÷ 1080 = **2x** exactly, well under 4x, so it should hold up close.

- **Upscaler:** Topaz Gigapixel, **High Fidelity** model. This is a faithful model, chosen because the image has hands, a printed product and words. Settings:
  - Scale: **2x**, using Gigapixel's own scale control. Output set to 2160 x 2700.
  - **Face Recovery off.** There is no face, and it must not touch the hands.
  - Suppress Noise: low. Fix Compression: low. Sharpen: low. This keeps the gummy texture, skin and foil grain as they are.
  - Redefine, Recover and Wonder (the generative models) are not used. This photo has no part that would call for them.
  - High Fidelity takes no prompt, so no prompt is used.

- **Text and logos:**
  - **"Rip. Tip. Enjoy." (Figma):** export it again from the Figma file at 2160 x 2700 and place it over the upscaled picture. At exactly 2x it lines up position for position.
    - Best: export a text-free base from Figma, upscale that, then add the type.
    - If only the baked-in PNG exists, the new export must fully cover the upscaled lettering.
  - **Pouch wordmark, yellow bear face, "28 Daily Packs", and any print on the torn daily pack:**
    - Place the Sprout pack artwork back over the pouch, matched to the original's position, perspective and foil sheen.
    - `MISSING: Sprout pouch/logo artwork.` If none exists, run the pouch area through Gigapixel **Text & Shapes** at 2x. Then read every letter and number against the original. In that case the report must say the words were checked by eye only.

- **Result:** `MISSING: returned file.` No try has been run or seen yet.
  - Expected file: `sprout-pour_2160x2700_try1.png`.
  - Read its real pixel size from the file's own details. It must be exactly 2160 x 2700 and 4:5, with no padding, crop or stretch.
  - Ratio kept: not yet known.

- **Review:** none of these areas has been compared yet, because the returned file has not been seen.

  | Area | Status | What to look for |
  |---|---|---|
  | Words and logos | needs a person to check | "Rip. Tip. Enjoy.", the Sprout wordmark, the bear face, "28 Daily Packs" (every letter, the yellow colour, the bear's shape) |
  | Faces | needs a person to check | none expected; confirm no face was added anywhere |
  | Hands | needs a person to check | both hands: finger count, joints, nails, the grip on the torn pack, the open palm |
  | Product | needs a person to check | the torn edge of the daily pack, the pouch outline and stand, the deep green foil colour and gloss (no new shine), each bear's shape and count where it is clear |
  | Texture and edges | needs a person to check | gummy translucency, no plastic skin, no halo along the pouch edges or fingers, no invented pattern in the foil |

  - **Difference check:** not done yet.
    1. Resize the original to 2160 x 2700 (bicubic).
    2. Put it under the try in a layered editor and set the top layer to Difference.
    3. Look hardest at the hands, the pouch print and the pour of bears.

- **Tries used:** 0 of 3.
  - If try 1 fails, start again from the untouched original with lower settings: Suppress Noise, Fix Compression and Sharpen at 0.
  - Last try: a plain Lanczos 2x resize. It changes nothing, though it will look softer.

- **Verdict:** not accepted. Not reviewed.
  - The original `sprout-pour_4x5.png` stays untouched.
  - Accept a try only after the original is checked, the type and artwork are placed back, and all five review rows pass.
```
