# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run keeps the script wording intact, splits captions sensibly and marks every unverifiable check as blocked instead of passing it. It states plainly that the font file, clips and logo were missing and labels all timings and positions as inferred.

## Judge list

- Met: 1. Every caption matches the script word for word; only number format changed.
  "60+ ingredients," "21 vitamins and minerals," "6 g of prebiotic fiber." Other groups match the script exactly.
- Met: 2. No caption has more than two lines, and each line breaks in a natural place.
  Max two lines per group, e.g. "21 vitamins" / "and minerals,"; "No chalky glass" / "to rinse."
- Met: 3. The font on screen is the brand font, not a default like Arial.
  "No fallback font is used." Font file is missing and marked blocked; Work Sans Bold is named as the planned font.
- Met: 4. No caption sits under app buttons or on product/face/hands; if frames unseen, marked blocked.
  "Not checked against faces, label or hands (blocked)." Clear-of-buttons column is blocked in the checklist.
- Met: 5. Anything it couldn't check is marked blocked, not passed.
  Checks missed lists font measuring, phone check, placement, .srt and export checks all as blocked.

## What went in

```text
Clips: the 7 clips from the selfie-style plan (see "Turn a
selfie-style script into video shots"). Planned lengths: 10, 5,
5, 5, 10, 5, 5 s. Not yet measured from the real files.
Script (approved):
1 If your greens powder is still half full in the cupboard,
  this is for you.
2 This is one daily pack.
3 Tear the top,
4 tip it into your hand.
5 Sixty-plus ingredients, twenty-one vitamins and minerals, six
  grams of prebiotic fiber.
6 No shaker. No chalky glass to rinse.
7 Rip. Tip. Enjoy.
Font: Work Sans Bold for captions. File not attached.
Colours: warm cream #FFF7DF, deep forest green #002C17.
Logo file: not attached. Runs on Reels and TikTok.
```

## What came out

```text
```
STOPPED STEPS
- MISSING: font file (Work Sans Bold .ttf/.otf). Blocks measuring each line, the right-font check and the font check on export. Lines below use an estimated limit of 24 characters per line at about 60 px [inferred]. No fallback font is used.
- MISSING: clip length (real files not measured). Blocks the real and final lengths, speech-matched timing and the conversion to timeline times. All times below are planned values from 10/5/5/5/10/5/5 s [inferred].
- MISSING: clip files / frames. Blocks the placement check against the label, faces and hands, the phone check with sound off and on, all three exports, and the .srt-to-burn-in match.
- MISSING: logo file. Blocks any logo or end card. None is placed. Clip 7 carries the caption only.

CAPTION GROUPS (word for word)
Clip 1 (10 s [inferred])  G1 "If your greens powder" (21) / "is still half full" (18) · G2 "in the cupboard," (16) · G3 "this is for you." (16)
Clip 2 (5 s [inferred])  G1 "This is one daily pack." (23)
Clip 3 (5 s [inferred])  G1 "Tear the top," (13)
Clip 4 (5 s [inferred])  G1 "tip it into your hand." (22)
Clip 5 (10 s [inferred])  G1 "60+ ingredients," (16) · G2 "21 vitamins" (11) / "and minerals," (13) · G3 "6 g of prebiotic fiber." (23)
Clip 6 (5 s [inferred])  G1 "No shaker." (10) · G2 "No chalky glass" (15) / "to rinse." (9)
Clip 7 (5 s [inferred])  G1 "Rip. Tip. Enjoy." (16)
Format-only changes: "Sixty-plus" > "60+", "twenty-one" > "21", "six grams" > "6 g". No other words changed. The sentence across clips 3–4 is split at the cut. No sound cues added because the audio is unheard. If the pack rip is audible, a "[pack rips]" cue in clip 3 is an option.

STYLE
Font file: MISSING (Work Sans Bold, needed as .ttf/.otf)  Letters: warm cream #FFF7DF  Outline: deep forest green #002C17, 3–4 px outline or soft shadow, no box  Contrast: 14.3 : 1 (letter to outline, passes 4.5 : 1)
Position: assumed 1080 x 1920 frame. Text block is centred at x ≈ 480 px (pulled left of centre to clear the right-edge buttons), max width 840 px. The bottom of the block sits at y ≈ 1240 px, just above the bottom third (y > 1280) and well below the top seventh (y < 274). Same spot in every clip. Assumed size ≈ 60 px, line height ≈ 72 px [inferred]. Not checked against faces, label or hands (blocked).

TIMING TABLE
Clip | real length | final length | caption start-end (from clip start) | characters a second
1 | 10 s [inferred] | 10 s [inferred] | G1 0.3–2.8 / G2 2.8–3.9 / G3 4.2–5.4 | 15.6 / 14.5 / 13.3
2 | 5 s [inferred] | 5 s [inferred] | G1 0.3–1.9 | 14.4
3 | 5 s [inferred] | 5 s [inferred] | G1 0.3–1.3 | 13.0
4 | 5 s [inferred] | 5 s [inferred] | G1 0.3–1.8 | 14.7
5 | 10 s [inferred] | 10 s [inferred] | G1 0.3–1.9 / G2 2.0–4.0 / G3 4.1–6.3 | 10.0 / 12.0 / 10.5
6 | 5 s [inferred] | 5 s [inferred] | G1 0.3–1.2 / G2 1.4–3.0 | 11.1 / 15.0
7 | 5 s [inferred] | 5 s [inferred] | G1 0.3–2.3 | 8.0
All times are estimated speech positions [inferred]. Retime each group to its real first and last word once the clips are measured. Convert to timeline times (planned offsets 0/10/15/20/25/35/40 s, 45 s total) only after the cut is locked.

CHECKLIST
Caption | matches script | fits | readable on a phone | right font | clear of buttons
1-G1 | yes | blocked (est. 21/18) | blocked | blocked | blocked
1-G2 | yes | blocked (est. 16) | blocked | blocked | blocked
1-G3 | yes | blocked (est. 16) | blocked | blocked | blocked
2-G1 | yes | blocked (est. 23) | blocked | blocked | blocked
3-G1 | yes | blocked (est. 13) | blocked | blocked | blocked
4-G1 | yes | blocked (est. 22) | blocked | blocked | blocked
5-G1 | yes (60+) | blocked (est. 16) | blocked | blocked | blocked
5-G2 | yes (21) | blocked (est. 11/13) | blocked | blocked | blocked
5-G3 | yes (6 g) | blocked (est. 23) | blocked | blocked | blocked
6-G1 | yes | blocked (est. 10) | blocked | blocked | blocked
6-G2 | yes | blocked (est. 15/9) | blocked | blocked | blocked
7-G1 | yes | blocked (est. 16) | blocked | blocked | blocked

FAULTS
Clips 2–4, all captions, lower-middle frame (predicted [inferred]) > if the hands and pack sit at y ≈ 1100–1240 px, raise the block to just under the face for all seven clips, keeping one spot throughout.
Clip 5, G2, line fit (predicted [inferred]) > "21 vitamins and minerals," is 25 characters, so it is already split before "and". Keep it split even if the real font measures it as fitting.
Clip 6, G2, line fit (predicted [inferred]) > "No chalky glass to rinse." is 25 characters, so it is already split before "to rinse.". Re-measure with the font file.
Clip 1, G3, timing (predicted [inferred]) > the planned 10 s clip holds about 5.4 s of speech. If the speaker talks longer, stretch the groups to the real words. Never speed up the clip.
Clip 7, end, full frame > no logo or end card until the logo file is supplied.

CHECKS MISSED
Every line measured with the brand's font file: blocked (font file missing).
No fallback font appears: blocked (nothing rendered, font file missing).
No group over 17 characters a second: blocked (estimated pass; real speech timing unmeasured).
No group runs across a cut: blocked (real cut points unmeasured; planned cuts pass).
No caption in the app's covered areas or over the label, a face or the demo: blocked (frames not seen).
Phone check with sound off and on: blocked (no clip files).
.srt matches the burned-in captions: blocked (no exports).
Export checks for size, length, sound and on-screen font: blocked (no exports).
Captions match the transcript word for word apart from number format: passed.
```
```
