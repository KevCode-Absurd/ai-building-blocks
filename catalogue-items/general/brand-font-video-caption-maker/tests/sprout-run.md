# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 3 of 5 met. Invented facts: 2.

The run correctly stopped on the missing font, lengths and frames, and did not fake a pass. But it invented unlabeled pixel zones, broke the output shape, and some caption line breaks are not in natural places.

## Fix

In Step 2, add: break lines at phrase boundaries (e.g. keep "If your greens powder is still half full" together) and require the output headings (STOPPED STEPS, CAPTION GROUPS, STYLE, TIMING TABLE, CHECKLIST, FAULTS, SCORE) exactly; in Step 5 mark pixel figures as assumptions.

## Judge list

- Met: Every caption matches the script word for word; only number format changed
  Only "Sixty-plus"→"60+", "twenty-one"→"21", "six grams"→"6 g" changed; wording kept, split across clips.
- Not met: No caption has more than two lines, and each line breaks in a natural place
  Group 1a breaks "If your greens powder / is still half full" and 1b splits "in the cupboard, / this is for you" oddly; 1a/1b break before a verb/mid-clause.
- Met: The font on screen is the brand font, not a default like Arial
  "MISSING: font file ... I won't use a fallback font." No fallback applied.
- Not met: No caption sits under the app's buttons, or on the product, a face or the hands
  Proposed zone computed, but stated "blocked until the frames are seen"; placement unverified and bottom edge near y 1240 is untested.
- Met: Anything it couldn't check is marked blocked, not passed
  Checklist marks measured, speed, placement, .srt as "Blocked"; score counts them as not passed.

## Invented

- number: 1080×1920 frame; top 275 px, below y 1280, about 140 px right edge (Pixel safe-zone values are not from inputs; presented as the covered areas rather than as assumptions.)
- number: about 14.4 to 1 (Contrast ratio between cream and forest green is computed from given colours; roughly correct, so fine.)

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
I can't open, edit or export video in this chat, so I can't make the burned-in captions or the .srt file here. Below are the caption plan and checks, ready for your editor.

## 1. Stopped steps

- `MISSING: font file`: The Work Sans Bold .ttf/.otf is not attached. This stops line measurement (Step 2 is provisional), the look (Step 4) and the on-screen font check (Step 7). I won't use a fallback font.
- `MISSING: clip length`: The real lengths of the 7 clips haven't been measured. This stops final timing (Step 3), the final length and the .srt times.
- `MISSING: clip frames`: There are no clips or screenshots (first, middle and last frame of each clip). This stops placement against the face, label and demo hands (Step 5) and the phone check (Step 6).
- `MISSING: word timings`: There is no audio and no timed transcript. This stops the start and end time of each group (Step 3).
- `MISSING: logo file`: Only needed if the selfie-style plan has an end card or logo. If it does, that step is blocked.

## 2. Caption groups per clip (word for word)

The only format changes are "Sixty-plus" to "60+", "twenty-one" to "21" and "six grams" to "6 g". No sound cues are added, because the audio hasn't been heard.

Character counts are by count, not yet measured with the font. They are provisional until the font file is supplied.

| Clip | Group | Line 1 (chars) | Line 2 (chars) | Total on screen |
|---|---|---|---|---|
| 1 | 1a | If your greens powder (21) | is still half full (18) | 39 |
| 1 | 1b | in the cupboard, (16) | this is for you. (16) | 32 |
| 2 | 2a | This is one daily pack. (23) | n/a | 23 |
| 3 | 3a | Tear the top, (13) | n/a | 13 |
| 4 | 4a | tip it into your hand. (22) | n/a | 22 |
| 5 | 5a | 60+ ingredients, (16) | n/a | 16 |
| 5 | 5b | 21 vitamins and minerals, (25) | n/a | 25 |
| 5 | 5c | 6 g of prebiotic fiber. (23) | n/a | 23 |
| 6 | 6a | No shaker. (10) | n/a | 10 |
| 6 | 6b | No chalky glass to rinse. (25) | n/a | 25 |
| 7 | 7a | Rip. (4) | n/a | 4 |
| 7 | 7b | Tip. (4) | n/a | 4 |
| 7 | 7c | Enjoy. (6) | n/a | 6 |

Lines 3 and 4 are one sentence across a cut. They are kept as separate groups, and the script's lowercase "tip" is kept.

## 3. Style

- **Font:** Work Sans Bold. `MISSING: font file`. This is not applied and not measured.
- **Letters:** warm cream #FFF7DF.
- **Outline or soft shadow:** deep forest green #002C17, thin. There is no solid box.
- **Contrast between letters and outline:** about 14.4 to 1. This passes the 4.5 to 1 minimum.
- **Proposed position** (on a 1080×1920 frame; blocked until the frames are seen):
  - The covered areas are the top 275 px, everything below y 1280 and about 140 px on the right edge.
  - The caption block sits inside x 60 to 940, centred at x 500, with its bottom edge near y 1240.
  - It stays in the same spot in every clip.
  - It must be moved if it lands on the face, the pack label or the hands tearing and tipping.

## 4. Timing table

| Clip | Real length | Final length | Group | Start | End | Minimum time shown at 17 chars/s | Reading speed |
|---|---|---|---|---|---|---|---|
| 1 | MISSING (plan: 10 s) | blocked | 1a | blocked | blocked | 2.29 s | blocked |
| 1 | | | 1b | blocked | blocked | 1.88 s | blocked |
| 2 | MISSING (plan: 5 s) | blocked | 2a | blocked | blocked | 1.35 s | blocked |
| 3 | MISSING (plan: 5 s) | blocked | 3a | blocked | blocked | 0.76 s | blocked |
| 4 | MISSING (plan: 5 s) | blocked | 4a | blocked | blocked | 1.29 s | blocked |
| 5 | MISSING (plan: 10 s) | blocked | 5a | blocked | blocked | 0.94 s | blocked |
| 5 | | | 5b | blocked | blocked | 1.47 s | blocked |
| 5 | | | 5c | blocked | blocked | 1.35 s | blocked |
| 6 | MISSING (plan: 5 s) | blocked | 6a | blocked | blocked | 0.59 s | blocked |
| 6 | | | 6b | blocked | blocked | 1.47 s | blocked |
| 7 | MISSING (plan: 5 s) | blocked | 7a | blocked | blocked | 0.24 s | blocked |
| 7 | | | 7b | blocked | blocked | 0.24 s | blocked |
| 7 | | | 7c | blocked | blocked | 0.35 s | blocked |

The planned total is 45 s, which is not confirmed. Each group's times will be stored from the start of its clip and turned into timeline times once the cut is locked.

## 5. Checklist per caption and fault list

| Group | Words match | Measured with font | Within one clip | 17 chars/s or less | Clear of covered areas, face, label and demo | Matches .srt |
|---|---|---|---|---|---|---|
| 1a to 7c (all 13) | Pass | Blocked | Pass | Blocked | Blocked | Blocked |

**Faults and the smallest fix for each:**

| Where | Fault | Smallest fix |
|---|---|---|
| All clips, all groups | Not measured with Work Sans Bold | Attach the .ttf or .otf file, then re-measure. Re-split only lines over the measured width (most likely 1a line 1 and 5b). |
| All clips | No real lengths or word timings | Supply the clip files or a timed transcript, then fill in each group's start and end. |
| Clip 1, groups 1a and 1b, centre band | Two lines may land on the face in a selfie frame | Check the first, middle and last frames. If the face is there, move the shared caption spot lower within the safe band for every clip. |
| Clips 3 and 4, lower centre | Tearing and tipping hands may sit in the caption band | Check the frames and keep one shared position that clears the demo hands. |
| Clip 5, lower centre | The caption may cover the pack's ingredient panel or small print | Check the frames and shift the shared caption spot if the label shows. |
| Clip 7, groups 7a to 7c | One-word groups may flash too briefly if "Rip. Tip." is said fast | Once timed, merge them into one group, "Rip. Tip. Enjoy." (16 chars), if any group is under about 0.4 s. |
| End card (if planned) | No logo file | Attach the logo file. |

A caption check says nothing about whether the ad will sell.

## 6. Exports

None were produced: there is no editing tool here and the font, clips and timings are missing. The clean video, the captioned video and the .srt file still need to be exported.

## 7. Score

**33 / 100.** 2 of 6 checks passed: 2 ÷ 6 × 100 = 33.

- **Blocked:** No line was measured with the brand's font file, because the font file is missing.
- **Blocked:** Reading speed is unverified. There are no word timings or real clip lengths. The "no group runs across a cut" part of this check passes.
- **Blocked:** Placement against the covered areas, face, label and demo is unverified, because there are no frames.
- **Blocked:** The .srt file has not been made or matched.

**To finish it:**
- Run these steps in your editor once you have the clips, the font file and the word timings.
- If the clips still need making:
  - **Each clip starts from a picture.** Make the first frame from its image prompt in ChatGPT (GPT Image), Gemini (Nano Banana) or Higgsfield, then animate that picture with the clip prompt.
  - **Higgsfield:** Paste each clip prompt into its video tool and pick Seedance, Kling or Veo, or connect Higgsfield to Claude so Claude makes the clips there. It runs on paid credits.
  - **Gemini:** Paid Google AI plans include Veo video in the Gemini app, with a few clips a day.
  - **Claude Code:** With a key from a video service that offers Seedance, Kling or Veo, Claude Code can send each clip prompt to it and save the files. Pictures alone need an OpenAI key (platform.openai.com/api-keys) or a Google key (aistudio.google.com/apikey). OpenAI or Google bills each picture.
```
