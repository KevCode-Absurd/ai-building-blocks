# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A clean, usable edit plan: it drops the corner-tear clip, keeps the warning with its step, correctly suspects "sip" is a mis-hearing of the brand's "Rip. Tip. Enjoy.", and lists every number for confirmation. The owner can hand this straight to an editor; the only gaps are ones the input genuinely left open and they are all marked MISSING.

## Judge list

- Met: The post lands one idea, and the opening line makes sense on its own.
  "PURPOSE: After watching, a viewer knows to tear a daily pack straight across the top... OPENING LINE: 'People keep asking how to open these.'" with product required in view for "these".
- Met: Every name, number and step in the captions is either confirmed or listed to check against the recording.
  CHECK table lists 0:12 "28", 0:16 "straight across the top", "Not the side", 0:22 "Rip, sip, enjoy" flagged as likely mis-transcribed.
- Met: No extra shot suggests a different product, a result or a fact the footage doesn't show.
  Shots A–E all from clips 1–3 or "SHOT TO FILM: a static close-up of the unopened pouch on the same counter."
- Met: Use and care steps keep their conditions, and nothing shows the product used the wrong way.
  "NOT USED: Clip 4... torn at the corner, which breaks the brand rule." and "'Not the side.' stays with its step in rows 4–5."
- Met: Captions stay clear of the app's buttons and stay up long enough to read.
  "below the top 14% (269 px), above the bottom 35% (672 px)... Each caption is 2–4 seconds long... about 11 characters per second."
- Met: There's no invented testimonial, milestone or offer, and no 'buy now' ending unless you asked for one.
  "On-screen text... 'Save this for your first pack.' There is no sales ending, because none was asked for."

## What went in

```text
Purpose: show how to open a pack the right way.
Clips (all vertical):
1. Talking at a kitchen counter, 0:42, speech. Transcript below.
2. Hands open the big pouch at its resealable top and take out
   one daily pack, 0:12, no speech.
3. Close-up: one pack torn straight across the top, gummies
   tipped into a palm, 0:08, no speech.
4. Same as 3, but the pack is torn at the corner, 0:07.

Auto transcript, clip 1:
[0:00] Okay so, um, people keep asking how to open these.
[0:05] So this is the big pouch, it opens at the top, it reseals.
[0:12] Inside are 28 daily packs.
[0:16] You tear one straight across the top. Not the side.
[0:22] Then you just tip the gummies into your hand. Rip, sip,
enjoy.
[0:29] That's a small handful, that's your one pack for the day.
[0:35] Over 20 vitamins and minerals, no water, no shaker.

Rules: the daily pack tears straight across its top edge, never
the side, bottom or a corner. The big pouch is never shown torn.
```

## What came out

```text
## 1. PURPOSE and OPENING LINE

**PURPOSE:** After watching, a viewer knows to tear a daily pack straight across the top, not the side, and then tip the gummies into their hand.

**OPENING LINE:** "People keep asking how to open these." This is clip 1, starting at about 0:01.5, after "Okay so, um" is cut. The product must be in view on this line so that "these" has something to point to. See EXTRA SHOTS, row A.

## 2. CUT LIST

Times are in seconds. All in-points inside a line are estimates from the transcript's line starts. Set exact cuts on the waveform, then re-time the captions.

| # | Source | In | Out | On screen | Caption (timing in edit) | Sound |
|---|---|---|---|---|---|---|
| 1 | Clip 1 | ~1.5 | 5.0 | Speaker at counter. Pack or pouch must be in view (row A). | "People keep asking / how to open these." (0.0–3.5) | Clip 1 voice |
| 2 | Clip 1 audio + Clip 2 picture | 5.0 | 12.0 | B-roll: hands open the big pouch at its resealable top | "So this is the big pouch," (3.5–6.5) · "it opens at the top, / it reseals." (6.5–10.5) | Clip 1 voice. Clip 2 natural sound low, or muted. |
| 3 | Clip 1 audio + Clip 2 picture | 12.0 | 16.0 | B-roll: hand takes out one daily pack | "Inside are 28 daily packs." (10.5–14.5) | Clip 1 voice |
| 4 | Clip 1 audio + Clip 3 picture | 16.0 | ~20.0 | B-roll: one pack torn straight across the top | "You tear one straight / across the top." (14.5–18.5) | Clip 1 voice. Tear sound low, under the voice. |
| 5 | Clip 1 | ~20.0 | 22.0 | Speaker on camera, for emphasis | "Not the side." (18.5–20.5) | Clip 1 voice |
| 6 | Clip 1 audio + Clip 3 picture | 22.0 | ~26.0 | B-roll: gummies tipped into a palm | "Then you just tip the gummies / into your hand." (20.5–24.5) | Clip 1 voice |
| 7 | Clip 1 | ~26.0 | 29.0 | Speaker on camera. End text appears (see 6. ENDING). | "Rip, sip, enjoy." (24.5–27.5), pending CHECK | Clip 1 voice |

**Caption rules applied:**
- Each caption is 2–4 seconds long and runs at no more than about 11 characters per second.
- Lines break at natural pauses.
- "Not the side." stays whole, and "Not the side." stays with its step in rows 4–5.
- "28" stays with "daily packs".

**Caption placement:**
- Keep captions inside the safe area: below the top 14% (269 px), above the bottom 35% (672 px), and 6% (65 px) in from each side. At 1080 x 1920 that leaves a text band from y 269 to y 1248.
- Keep captions off the speaker's mouth.
- In clips 2 and 3, set captions above the hands, the tear line and the pack label.

**Layout:** One layout for the whole post: speaker with full-frame cutaways.

**Music:** None planned. Voice first. If music is added, use only a brand-owned or business-licensed track, low enough that every word stays clear. Do not use a trending sound.

## 3. EXTRA SHOTS

| Shot | Line it covers | Source |
|---|---|---|
| A. Unopened pouch or pack on the counter, or in the speaker's hand (~3.5 s) | "People keep asking how to open these." | Clip 1, if the product is visible at 0:01.5. If it isn't, **SHOT TO FILM**: a static close-up of the unopened pouch on the same counter. |
| B. Hands open the big pouch at its resealable top | "So this is the big pouch, it opens at the top, it reseals." | Clip 2, ~0:00–0:07 (exact moment MISSING) |
| C. Hand takes out one daily pack | "Inside are 28 daily packs." | Clip 2, ~0:07–0:11 |
| D. Pack torn straight across the top | "You tear one straight across the top." | Clip 3, ~0:00–0:04 |
| E. Gummies tipped into a palm | "Then you just tip the gummies into your hand." | Clip 3, ~0:04–0:08 |

**Rule check on the shots:**
- Watch clip 2 frame by frame. It must never show the big pouch torn, notched or cut open. Opening at the resealable top only is allowed.
- Clip 3 tears across the top edge, so it is allowed.

## 4. CHECK BEFORE CAPTIONING

| Time (clip 1) | Word(s) to confirm | Why |
|---|---|---|
| 0:00 | "these" | The opening must show or name the product. |
| 0:05 | "the big pouch", "at the top", "it reseals" | Check this matches how the brand describes the pouch. The brand file is MISSING. |
| 0:12 | "28" | Number. Confirm it against the label. If the label differs, cut or re-record the line. |
| 0:16 | "straight across the top", "Not the side" | This is the step and its warning. Confirm it is "Not" and not something else. |
| 0:22 | "Rip, sip, enjoy" | Likely mis-transcribed. "Sip" makes no sense for gummies. Confirm the exact words from the audio. If the line really is "sip", cut it, and the post ends at 0:26. |
| 0:29 | "one pack for the day" | This is a serving amount. It is saved for another post and must be confirmed against the label before use. |
| 0:35 | "Over 20" | This is a nutrient claim. It is saved for another post and must be confirmed against the label before use. |

## 5. COVER AND POST CAPTION

**Cover:**
- Frame: the real frame from clip 3 where the pack is torn mid-way, straight across the top.
- Text: "How to open your daily pack".
- Place the text in the safe area, off the hands and the label.

**Post caption:** "How to open your daily pack: tear it straight across the top, not the side, then tip the gummies into your hand. Save this for your first one."

## 6. ENDING and DISCLOSURE

**ENDING:**
- The last spoken line is "Rip, sip, enjoy." This is pending CHECK. If it is cut, the post ends on "into your hand".
- On-screen text over the final ~2 seconds: "Save this for your first pack."
- There is no sales ending, because none was asked for.

**DISCLOSURE:**
- No paid or gifted disclosure appears in the footage.
- MISSING: whether the speaker is brand staff or a paid or gifted creator. If paid or gifted, add the platform's disclosure label and a line in the post caption.

## 7. EXPORT

**Format:**
- Shape: 9:16 vertical. All clips are already vertical, so no crop is needed. If any crop is applied, watch it through the full hand movement.
- Size: 1080 x 1920 or higher.
- Length: about 27.5 s, plus a ~2 s end-text hold if the last line is cut early.

**Files (both exported from copies of the footage):**
1. Clean master with no added captions. Check whether any source clip has burned-in text, because it will still show.
2. Captioned copy.

**Platform checks:**
- No other app's watermark.
- No black bars.
- Sound on.
- Sharp on a phone.
- Not just a slide of text.
- Instagram says it shows posts with these problems to fewer people.

**Final watch:**
- Watch on a phone with sound, then again muted.
- Check the first frame, every join (especially speaker to B-roll at 5.0, 16.0, ~20.0, 22.0 and ~26.0) and the last second.

## 8. SAVE FOR ANOTHER POST, NOT USED and MISSING

**SAVE FOR ANOTHER POST:**
- Clip 1, 0:29–0:42: "That's a small handful, that's your one pack for the day." and "Over 20 vitamins and minerals, no water, no shaker."
- These could become a "What's in one daily pack" post.
- Confirm "one pack for the day" and "over 20" against the label first.

**NOT USED:**
- Clip 4, all 0:07. The pack is torn at the corner, which breaks the brand rule.
- Clip 1, 0:00–~0:01.5: "Okay so, um" warm-up.

**MISSING:**
- MISSING: brand file (product name as the brand writes it, fonts, colours, voice, label text to confirm "28").
- MISSING: target platforms and caption style.
- MISSING: exact word-level times in clip 1, and exact action times in clips 2 and 3.
- MISSING: whether the product is visible in clip 1 at the opening.
- MISSING: the speaker's disclosure status.
- MISSING: a music licence, if music is wanted.
```
