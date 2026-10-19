# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 6 met. Invented facts: 1.

The run honestly said it couldn't upscale or see the file, and gave a usable setup plan with correct 2160 x 2700 math and MISSING flags. But it produced no result, so the owner has no upscaled file and the size and text checks remain undone.

## Fix

Add a rule in the step 1 and step 6 area: if no image file is visible, stop right away and ask for the original and returned files rather than writing a full setup. Alternatively, make clear that a setup-only handback is expected and judged on that basis.

## Judge list

- Not met: Report gives returned file's real pixel size matching target and ratio
  "No file has been returned yet." Size check left as instructions only; no real pixel size reported.
- Met: Upscaler kind fits picture and faithful model tried first
  "Model: High Fidelity, or Standard... Both are faithful models." Generative only as a fallback.
- Not met: Every printed word and logo read letter by letter or put back from design file/artwork
  Plan to re-export Figma text, but no words were verified; "MISSING: pouch label artwork" and nothing was checked.
- Met: Difference check done, or report says why it couldn't be
  "Difference check: not done, because there is no returned file."
- Met: Nothing marked pass that wasn't compared; unseen areas say needs a person
  All rows "needs a person to check"; Faces marked not in picture.
- Met: Original file still there, unchanged
  "The original stays as it was." Nothing was modified.

## Invented

- claim: Suppress Noise / Remove Blur / Fix Compression / Face Recovery sliders in Gigapixel (Slider names asserted as Gigapixel settings; output hedges with MISSING version note, so low risk.)

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
I can't run Topaz Gigapixel or make pictures from this chat, so I can't produce the upscale. Below is the setup to run and the check to apply to whatever comes back.

**Source**
- `MISSING: the image file itself.` No file reached me, only a description, so I could not check it at full size before upscaling (step 1).
- Stated details: `sprout-pour_4x5.png`, 1080 x 1350 px, ratio 4:5 (0.8), portrait.
- Before you upscale, check it at 100% for:
  - the spelling of "Rip. Tip. Enjoy."
  - the spelling of "28 Daily Packs"
  - finger count and grip on both hands
  - the tear edge on the pack
  - the bear face artwork
- Fix any fault first. The upscale will make every fault bigger.

**Target**
- 12 x 15 in at 180 ppi = **2160 x 2700 px**, 4:5, portrait.
- Use: printed banner.
- Scale is 2160 ÷ 1080 = **exactly 2x**, which is under 4x, so no softness warning applies.

**Upscaler**
- Tool: Topaz Gigapixel.
- `MISSING: your Gigapixel version and the models and sliders it shows.` The settings below assume the current core models. Confirm they match your screen.
- Model: **High Fidelity**, or **Standard** if High Fidelity isn't offered. Both are faithful models.
- Why this kind: the picture has printed words, a wordmark and a logo, two hands, a glossy product and gummies. That calls for a faithful model. Never use Redefine, Recover or Wonder on the text or logo areas.
- Settings:
  - Scale: 2x, set in Gigapixel's size control (or width 2160 px). Do not type a size into a prompt.
  - Suppress Noise: low.
  - Remove Blur: low.
  - Fix Compression: low.
  - Face Recovery: off. There is no face in the shot.
  - Sharpening: low, so the foil gloss and gummy texture stay as they are.
- Generative fallback: only if the faithful result is too soft on the gummies or hands, use Redefine at its lowest creativity, outside the text and logo areas. Use this prompt:

```
This is an approved photograph. Make it larger and cleaner, and change nothing in it.
Keep exactly: the adult's two hands: finger count, joints, nails, grip on the torn daily pack, the open receiving palm, skin tone and texture;
the Sprout daily pack: shape, torn top edge, colours, every printed word; the green gummy bears: count, shapes, positions mid-pour, translucency;
the Sprout Original pouch: glossy deep green foil, big yellow Sprout wordmark, yellow bear face top right, "28 Daily Packs" at the bottom, every letter as printed;
the framing, positions, background, colours and light.
Allowed: cleaner edges, less blur and compression blocking, the texture that is already there.
Not allowed: new or removed objects, words or logos; changed letters; smoother skin; new gloss, glow or pattern.
```

**Text and logos**
- **"Rip. Tip. Enjoy."** was added in Figma, so it gets re-exported from the design file.
  1. Upscale a version of the image without that text.
  2. Place the upscaled image in a 2160 x 2700 Figma frame.
  3. Re-export the text at that size from the design file.
- **Sprout wordmark, bear face and "28 Daily Packs"** are on the pouch.
  - If the pouch label artwork exists, place it back over the upscaled pouch, matched to the original in position, perspective and gloss.
  - `MISSING: pouch label artwork`. If you don't have it, run the pouch area through **Text & Shapes** at 2x. Then read every letter and number against the original. In that case the label words were checked by eye only.

**Result**
- No file has been returned yet.
- Save it as `sprout-pour_2160x2700_try1.png`.
- Check the width and height in the file's own properties. They must read 2160 x 2700 with nothing padded, cropped or stretched.

**Review**
- Difference check: not done, because there is no returned file. How to run it:
  1. Resize the original to 2160 x 2700 with bicubic.
  2. Put it under the upscale.
  3. Set the top layer to Difference.
  4. Look hardest at the hands, the pack tear, the wordmark, "28 Daily Packs" and the bear face.

| Area | Status | Change seen |
|---|---|---|
| Words and logos | needs a person to check | file not seen |
| Faces | not in picture, not counted | n/a |
| Hands | needs a person to check | file not seen |
| Product (pack, pouch, gummies) | needs a person to check | file not seen |
| Texture and edges | needs a person to check | file not seen |

**Fidelity score**
- Try 1: 0 / 5 passed = **0**, all pending.
- The 5 items are: size, words and logos, hands, product, texture and edges.

**Tries and verdict**
- Tries used: 0 of 3. Every try starts from the untouched original.
- Retry order:
  1. High Fidelity at 2x with low settings.
  2. If something changed, name the change, then retry with every slider at its minimum (or Standard).
  3. If it still changed, do a plain Lanczos 2x resize. This is the safe last try because it adds no detail and changes nothing.
- Verdict: **not accepted.** The original stays as it was. There is no file to review, and the source itself still needs its full-size check.

**To finish it**
- Run the steps above in Topaz Gigapixel, then send me the original PNG and each returned try so I can score them.
- ChatGPT (GPT Image), Gemini (Nano Banana) and Higgsfield can only redraw the picture. That is generative, so it is a last resort here and never for the text or logo areas.
- In Claude Code with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that API and save the file. Keys are at platform.openai.com/api-keys and aistudio.google.com/apikey, and OpenAI or Google bills each image.
```
