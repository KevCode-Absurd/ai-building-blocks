# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest caption plan: the words are locked to the approved script, the groups and character counts are correct, the contrast and minimum on-screen times are properly worked out, and every unverifiable check is marked blocked rather than passed. The owner gets a ready-to-run plan the moment the font file and real clips arrive, with nothing invented.

## Judge list

- Met: Every caption matches the script word for word; only number format changed.
  All 11 groups reproduce the script; only "Sixty-plus" → "60+", "twenty-one" → "21", "six grams" → "6 g" changed.
- Met: No caption has more than two lines, and each line breaks in a natural place.
  Max two lines (1a, 1b); "in the cupboard, / this is for you." breaks after punctuation; 1a breaks at subject/verb boundary, natural though not in the skill's listed rule.
- Met: The font on screen is the brand font, not a default like Arial.
  "No fallback font will be used." Font marked MISSING and rendering steps stopped rather than substituting.
- Met: No caption sits under the app's buttons, or on the product, a face or the hands.
  Band y≈1080–1260 clear of top seventh and bottom third; label/face/hands overlap explicitly marked "Blocked (no clips)" with a fix in fault 5.
- Met: Anything it couldn't check is marked blocked, not passed.
  Checklist marks font measurement, cps, safe zones, phone check and .srt as "Blocked"; timing table cells say "blocked".

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
## 1. Stopped steps

- `MISSING: font file`: Work Sans Bold .ttf/.otf. This blocks line measurement (step 2), the look and caption size (step 4), the on-phone font check (step 6) and every export (step 7). The groups below are counted by characters only and are provisional until each line is measured with the file. No fallback font will be used.
- `MISSING: clip length`: there are only planned lengths (10, 5, 5, 5, 10, 5, 5 s), and no clip files are attached. This blocks speech timing (step 3), the reading-speed check, final timeline times, placement against label, faces and hands (step 5), the phone check (step 6) and exports (step 7).
- `MISSING: logo file`: this blocks any logo or end card, if the selfie-style plan includes one. It does not block captions.
- Not missing, but blocked: checking the captions word for word against the actual delivered speech needs the clip audio. Until then the approved script is the source.
- Assumption to confirm when the cut is locked: script line *n* is spoken entirely within clip *n*. If any line crosses a cut, that group splits at the cut.

## 2. Caption groups per clip (word-locked)

Only format changes were made: "Sixty-plus" → "60+", "twenty-one" → "21", "six grams" → "6 g". No other words were changed. A bracketed sound cue (e.g. a pack tear in clip 3 or 7) can only be decided after listening, so it is pending.

Counts include spaces and punctuation.

| Clip | Group | Line 1 (chars) | Line 2 (chars) |
|---|---|---|---|
| 1 | 1a | If your greens powder (21) | is still half full (18) |
| 1 | 1b | in the cupboard, (16) | this is for you. (16) |
| 2 | 2a | This is one daily pack. (23) | n/a |
| 3 | 3a | Tear the top, (13) | n/a |
| 4 | 4a | tip it into your hand. (22) | n/a |
| 5 | 5a | 60+ ingredients, (16) | n/a |
| 5 | 5b | 21 vitamins and minerals, (25) | n/a |
| 5 | 5c | 6 g of prebiotic fiber. (23) | n/a |
| 6 | 6a | No shaker. (10) | n/a |
| 6 | 6b | No chalky glass to rinse. (25) | n/a |
| 7 | 7a | Rip. Tip. Enjoy. (16) | n/a |

Line breaks follow the skill's rules:
- Breaks fall after punctuation or before a preposition ("in the cupboard").
- "6 g" stays together.
- No article is split from its noun.

If the font measurement shows 25-character lines (5b, 6b) are too wide at caption size, there are two fallbacks:
- 5b breaks as "21 vitamins / and minerals,".
- 6b breaks as "No chalky glass / to rinse.".

## 3. Style

- **Font file:** Work Sans Bold. MISSING, so the caption size is not set.
- **Letters:** warm cream #FFF7DF.
- **Outline:** a thin outline or soft shadow in deep forest green #002C17. There is no solid box.
- **Letter-to-outline contrast:** about 14.3 : 1, which passes the 4.5 : 1 minimum.
- **Contrast over footage:** blocked until the clips are available.
- **Position:** one fixed spot in all 7 clips. On a 1080×1920 frame it sits in the lower-middle band, with the text block bottom no lower than y ≈ 1260 and its top around y ≈ 1080. That keeps it clear of:
  - the top seventh (0–275 px);
  - the bottom third (below 1280 px);
  - the right edge, with about 160 px kept clear on the right.

  Left and centre margins are about 60 px.
- **Blocked checks:** the position must still be checked against the Reels and TikTok safe-zone previews and the pack label, face and hands in each clip.

## 4. Timing table

Start and end times are blocked until the speech is timed in the real files. The minimum on-screen time is the time that keeps each group at or below 17 characters a second.

| Clip | Real length | Final length | Group | Start | End | Min. on-screen at ≤17 cps | Reading speed |
|---|---|---|---|---|---|---|---|
| 1 | MISSING (plan 10 s) | blocked | 1a | blocked | blocked | 2.29 s (39 ch) | blocked |
| 1 | | | 1b | blocked | blocked | 1.88 s (32 ch) | blocked |
| 2 | MISSING (plan 5 s) | blocked | 2a | blocked | blocked | 1.35 s (23 ch) | blocked |
| 3 | MISSING (plan 5 s) | blocked | 3a | blocked | blocked | 0.76 s (13 ch) | blocked |
| 4 | MISSING (plan 5 s) | blocked | 4a | blocked | blocked | 1.29 s (22 ch) | blocked |
| 5 | MISSING (plan 10 s) | blocked | 5a | blocked | blocked | 0.94 s (16 ch) | blocked |
| 5 | | | 5b | blocked | blocked | 1.47 s (25 ch) | blocked |
| 5 | | | 5c | blocked | blocked | 1.35 s (23 ch) | blocked |
| 6 | MISSING (plan 5 s) | blocked | 6a | blocked | blocked | 0.59 s (10 ch) | blocked |
| 6 | | | 6b | blocked | blocked | 1.47 s (25 ch) | blocked |
| 7 | MISSING (plan 5 s) | blocked | 7a | blocked | blocked | 0.94 s (16 ch) | blocked |

The planned cumulative timeline is 0 / 10 / 15 / 20 / 25 / 35 / 40, ending at 45 s. It is for reference only. Times will be stored relative to each clip and converted once, after the cut is locked.

## 5. Checklist and faults

**Checklist (applies to every group, 1a–7a):**

| Check | Status |
|---|---|
| Words match script | Pass, with format-only changes |
| Matches delivered audio | Blocked (no clips) |
| Measured with brand font file | Blocked (MISSING font) |
| No group across a cut | Pass on plan; blocked until cut locked |
| ≤17 cps | Blocked (no speech timing) |
| Out of app-covered areas | Blocked (no safe-zone preview check) |
| Clear of label, face, hands | Blocked (no clips) |
| Same spot every clip | Set; blocked until checked |
| Phone check, sound off and on | Blocked |
| .srt matches burn-in | Blocked (not exported) |

**Faults, with the smallest fix:**

1. **All groups, all frames:** the font file is not attached. Fix: supply the Work Sans Bold .ttf or .otf.
2. **All clips:** lengths are planned, not measured, and the files are absent. Fix: supply the final clip files.
3. **Clip 1, groups 1a and 1b:** these are the densest captions (39 and 32 characters). Fix: if speech timing shows more than 17 cps, split 1a into "If your greens powder" and "is still half full". Do not reword.
4. **Clips 3 and 4, groups 3a and 4a:** one sentence spans a cut. It is already split per clip. Fix: confirm the cut falls between "top," and "tip" in the edit.
5. **Clips 3, 4 and 7, centre-lower frame:** the hands and pack demo are likely to sit in the caption band. Fix: if they overlap, move the shared caption spot up within the safe band, and use the same new spot in all clips.
6. **Logo or end card:** the file is not attached. Fix: supply the logo file if the plan includes one.

## 6. Exports

Blocked. The clean video, the captioned video and the .srt can be made once the font file and the clips are supplied.
```
