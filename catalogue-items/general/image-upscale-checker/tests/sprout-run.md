# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 6 of 6 met. Invented facts: 0.

This is a solid, honest setup for the Sprout banner. It works out 2160 x 2700 correctly, picks a faithful model, plans how to keep the words and logo exact, and leaves every review row open since no file came back.

## Judge list

- Met: Gives exact target size and says size check waits for file (no file yet)
  "2160 x 2700 px... Scale 2x exactly" and RESULT "not reviewed... They must be exactly 2160 x 2700"
- Met: Upscaler kind fits picture; faithful model first
  "Topaz Gigapixel, a faithful model (High Fidelity...)"; generative models ruled out.
- Met: Plan says which of the two ways each word and logo gets
  Figma words re-exported over upscale; pouch logo via Text & Shapes model, read letter by letter.
- Met: Difference check done or says why not
  "DIFFERENCE CHECK: not run yet." with GIMP steps and what to look for.
- Met: Nothing marked pass that wasn't compared; unseen areas say needs a person
  All REVIEW rows "not reviewed"; score "not scored yet: no returned file".
- Met: Original file untouched
  Retry plan: "each starting from the untouched original"; saves try as separate file.

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
I can't see the attached file or run Gigapixel from this chat, so this setup is built from your description. The check of the original and every review row stay open for a person.

```
SOURCE:     sprout-pour_4x5.png, 1080 x 1350 px, 4:5 (portrait)
            MISSING: a person's full-size check of the original before upscaling. Look for:
            the hands' finger count and joints, the torn pack edge, the gummy bear shapes,
            the pouch wordmark, the bear face, "28 Daily Packs", and "Rip. Tip. Enjoy." spelled right.
            Fix any fault first, then run this setup on the fixed file.
TARGET:     2160 x 2700 px, for a 12 x 15 in printed banner at 180 ppi
            (12 x 180 = 2160, 15 x 180 = 2700). Scale 2x exactly, ratio 4:5 kept.
UPSCALER:   Topaz Gigapixel, a faithful model (High Fidelity, or Standard if that is what your
            version offers). Settings:
            - Scale 2x, set with the tool's own size control.
            - Creativity or strength at its lowest, if shown.
            - Noise reduction at its lowest.
            - Sharpening low.
            - Face recovery off.
            - MISSING: the tool's setting names.
            Why this kind: the picture has words, a wordmark and a logo, two hands, and glossy
            foil and translucent gummies. A generative model (Redefine, Recover, Wonder) can
            re-letter the label, change fingers and invent gloss or texture. Do not use one.
TEXT/LOGO:  - "Rip. Tip. Enjoy." (Figma): export the picture from Figma without the words,
              upscale that clean version, then export the words again from Figma at
              2160 x 2700 over the upscaled picture.
              MISSING: a clean export without the words. If you only have the flattened PNG,
              the overlay gets upscaled with the picture. Read it letter by letter against the
              original, or cover it with the fresh Figma export at the same position.
            - Pouch wordmark, bear face and "28 Daily Packs": no logo or label artwork was given.
              Run the pouch label area through Text & Shapes at 2x, blend it into the upscale,
              then read it letter by letter against the original. Checked by eye only.

PROMPT (only if the tool takes one)
Not used. The faithful models take no prompt, and a prompt-led model is ruled out here.

RESULT:     not reviewed. Save as sprout-pour_2160x2700_try1.png. Read the real width and height
            from the file's own details. They must be exactly 2160 x 2700, with no padding,
            crop or stretch.
DIFFERENCE CHECK: not run yet.
            How to run it (for example in GIMP):
            1. Resize the original to 2160 x 2700 (Lanczos).
            2. Put it under the upscale and set the top layer to Difference.
            What to look for: bright spots in the fingers and nails, the torn foil edge,
            the outlines of the bears in the pour, the wordmark letters, the bear face,
            "28 Daily Packs", the Figma words, and the edges of the foil highlights.
REVIEW
Words and logos    not reviewed. Check "Rip. Tip. Enjoy.", the Sprout wordmark, the yellow bear
                   face and "28 Daily Packs". Every letter, shape and yellow must match.
Faces              not reviewed. None described; a person confirms there is no face in frame.
Hands              not reviewed. Check finger count, joints, nails, the grip on the pack, the
                   cupped palm, and that no bear has merged into a finger.
Product            not reviewed. Check the pack's torn top edge, the pouch outline, the deep green
                   colour, the number and shape of the bears, and the bears' green.
Texture and edges  not reviewed. Check for no plastic skin, no new gloss or glow on the foil,
                   no halos along the pouch and fingers, and the gummies' translucency kept.
FIDELITY SCORE: not scored yet: no returned file
            Items to count: size check, words and logos, hands, product, texture and edges
            (5, or 6 if a face is in frame).
Tries used: 0 of 3   Verdict: waiting for the file
```

Retry plan, each try starting from the untouched original:
- **Try 2:** if try 1 changes any detail, switch to Standard with everything at its lowest. If the problem is softness, try High Fidelity at a slightly higher sharpening setting.
- **Try 3:** a plain 2x Lanczos resize. It is the safe last try because it can't invent anything.

Send next:
- the returned file
- the original PNG at full size, attached so it can be read directly

MISSING:
- a full-size check of the original by a person
- a clean Figma export without "Rip. Tip. Enjoy."
- the pouch logo and label artwork, so the label can be placed back instead of checked by eye only
- Gigapixel's setting names in your version
- the returned file, for the size check, difference check, review and score
```
