# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 6 met. Invented facts: 2.

This is a sound plan that cuts the banned "fixed my stomach" line, keeps the price and renewal terms together, and flags its gaps honestly. But the cut points for the tear, pour and pouch shots are guesses, and the caption timing depends on them.

## Fix

In step 5, require cut points and caption windows only from transcript times given. Where an end time is missing, write MISSING and leave that window open, instead of estimating in/out seconds.

## Judge list

- Met: Every claim, number and offer on screen is in the approved copy.
  Captions use only hook lines and body lines: "21 vitamins and minerals", "$29.99", "$49.99 every 4 weeks"; "fixed my stomach" cut.
- Met: Product looks right in every shot, label readable, opened the way it really opens.
  Tear straight across top, pour from torn top; pouch held 2 s with name readable, captions placed clear of the name.
- Not met: Each caption matches what's actually said after the cuts.
  Shot 5 body 7.8–10.6 only covers part of the line; shot 6 audio 10.6–12.6 "of fiber, in one pack" is guessed.
- Met: Off-script lines, like a creator's own health claim, are cut, not kept.
  "Honestly it fixed my stomach." cut in full, out point before 13.0.
- Met: Ending carries only approved terms. No added urgency or discount.
  "no end card, discount, deadline, guarantee or 'link in bio.'"
- Met: Plan says it's a plan and lists missing shots.
  "This is a plan. No edited file exists yet." plus MISSING items.

## Invented

- other: Shot 3-4 in/out for tear.mp4 and pour.mp4 and the tear/tip audio taken from body.mp4 4.0–6.6 (Estimated timings presented as cut points, though flagged as estimates.)
- number: SCORE 67/100 (4 of 6 checks) (Lists two missed checks, but 4 of 6 is 67; consistent, yet the second missed check is unverified rather than failed.)

## Safety

- Shot 3's audio uses body.mp4 "You tear the top" while the tear is shown from a separate clip; timing was estimated, so product use could appear out of sync with its spoken line.

## What went in

```text
Footage (a real customer, filmed from our brief, all 9:16):
H1 hookA.mp4 4 s. 0.4 "I quit greens powder more times than I
   can count." (ends 3.6)
H2 hookB.mp4 5 s. 0.3 "If your greens powder lives at the back
   of the cupboard, watch this." (ends 4.4), holds up a pack
B  body.mp4 32 s. To camera, pack in hand. 0.9 "Okay, um, so."
   2.6 "This is one day." 4.0 "You tear the top, tip it out."
   7.9 "21 vitamins and minerals and 6 grams of fiber, in one
   pack." 13.0 "Honestly it fixed my stomach." 15.8 "First order
   is $29.99 with the text sign-up. It renews at $49.99 every 4
   weeks." (ends 22.6), then looks off camera.
X1 tear.mp4 6 s. Pack torn straight across its top edge, close.
X2 pour.mp4 5 s. Gummies tip into her palm, close.
X3 pouch.mp4 4 s. Pouch held to the lens, name readable.
No music supplied.
Approved script: both hooks and the body lines from the brief.
Never say: "fix", or any health result.
Need: two versions (H1 + body, H2 + body), 9:16 and 4:5, under
30 seconds, captions.
```

## What came out

```text
# Edit plan: greens gummies, two hook versions

## 1. Cut list

**Version 1: H1 + body (19.5 s)**

| # | source file | in-out (s) | timeline start-end | what it shows | audio | on-screen text |
|---|---|---|---|---|---|---|
| 1 | hookA.mp4 | 0.3–3.8 | 0.0–3.5 | Customer to camera, hook | Sync: "I quit greens powder more times than I can count." | Caption C1 |
| 2 | body.mp4 | 2.5–4.0 | 3.5–5.0 | To camera, pack in hand | Sync: "This is one day." | Caption C2 |
| 3 | tear.mp4 | ~1.0–2.5 (set to the tear itself) | 5.0–6.5 | Pack torn straight across the top, close | body.mp4 4.0–5.5: "You tear the top," plus tear.mp4 natural sound, low | Caption C3 |
| 4 | pour.mp4 | ~0.5–1.6 (set to the tip) | 6.5–7.6 | Gummies tip into palm, close | body.mp4 5.5–6.6: "tip it out." | Caption C3 continues |
| 5 | body.mp4 | 7.8–10.6 | 7.6–10.4 | To camera, pack in hand | Sync: "21 vitamins and minerals and 6 grams…" | Caption C4 |
| 6 | pouch.mp4 | 0.5–2.5 | 10.4–12.4 | Pouch to lens, name readable, held 2 s | body.mp4 10.6–12.6: "…of fiber, in one pack." | Caption C4 continues, placed clear of the name |
| 7 | body.mp4 | 15.7–22.7 | 12.4–19.5 | To camera, price line (close) | Sync: "First order is $29.99 with the text sign-up. It renews at $49.99 every 4 weeks." | Captions C5, C6 |

**Version 2: H2 + body (20.4 s)**

| # | source file | in-out (s) | timeline start-end | what it shows | audio | on-screen text |
|---|---|---|---|---|---|---|
| 1 | hookB.mp4 | 0.2–4.6 | 0.0–4.4 | Customer to camera, holds up pack | Sync: "If your greens powder lives at the back of the cupboard, watch this." | Caption H2 |
| 2–7 | Same as Version 1 shots 2–7 | Same source in-outs | Version 1 timeline +0.9 s (4.4–20.4) | Same | Same | Same |

**What was cut and why**
- body.mp4 0.0–2.5, "Okay, um, so.": set-up and filler.
- body.mp4 6.6–7.8: dead air between lines. It is hidden under the pour.mp4 cutaway.
- body.mp4 12.6–15.7, "Honestly it fixed my stomach.": this line uses the banned word "fix" and makes a health result claim. Cut it in full. The out point must sit before 13.0 so no "Honestly" leaks through. This jump is hidden under the pouch.mp4 cutaway.
- body.mp4 22.7–32.0: she looks off camera.
- hookA 0.0–0.3 and hookB 0.0–0.2: set-up before the first word, trimmed with about 0.1 s lead so the first word isn't clipped.
- **Timing caveat:** the in/out points above are estimates from start times only. The transcript gives no end times except 3.6, 4.4 and 22.6. Confirm the actual end of "tip it out" (estimated 6.3–6.6) and "in one pack" (estimated 12.4–12.6) on the waveform, then re-time everything after them.

## 2. Join notes

**H1 → body (hookA 3.8 → body 2.5)**
- **Pronoun:** "This is one day" follows "…than I can count." The word "this" lands on the pack she is holding in body.mp4, so it reads.
- **Argument:** she quit powders, and this is the alternative. The argument holds.
- **To check:**
  - That the pack is sealed in the body opening frame.
  - That light, framing and room tone match between hookA and body.
  - Add a 2–3 frame room-tone crossfade if the backgrounds differ.

**H2 → body (hookB 4.6 → body 2.5)**
- **Pronoun:** "…watch this. This is one day." The repeated "this" is acceptable, and it points at the pack she has just held up.
- **To check:**
  - The pack in hookB matches the body pack in version and state. Both must be sealed, because it is torn in shot 3.
  - Hand position. If she holds it up in hookB and it sits in her hand in body, the change must not read as a jump on the pack.
  - Voice level and room tone.
  - If the pack in hookB is a different item from the body pack, this join fails. Use Version 1 only until it is reshot.

**Internal joins**
- **Body → tear → pour:** the product state goes sealed → torn → open, which is the correct order.
- **Return from cutaways:** after pour.mp4 and pouch.mp4 the cut goes back to body on matching source time, so lip sync holds.

## 3. Caption windows

Times are for Version 1. For Version 2, add 0.9 s to C2–C6.

| ID | text (line 1 / line 2) | start | end | chars | cps |
|---|---|---|---|---|---|
| C1 | I quit greens powder more times / than I can count. | 0.0 | 3.5 | 49 | 14.0 |
| H2 (V2 only) | If your greens powder lives at the back / of the cupboard, watch this. | 0.0 | 4.4 | 68 | 15.5 |
| C2 | This is one day. | 3.6 | 5.0 | 16 | 11.4 |
| C3 | You tear the top, tip it out. | 5.0 | 7.6 | 29 | 11.2 |
| C4 | 21 vitamins and minerals and / 6 grams of fiber, in one pack. | 7.7 | 12.4 | 58 | 12.3 |
| C5 | First order is $29.99 / with the text sign-up. | 12.5 | *start of "It renews"* (≈16.1) | 43 | ≈12.3 |
| C6 | It renews at $49.99 / every 4 weeks. | *start of "It renews"* (≈16.1) | 19.5 | 33 | ≈9.6 |

**Notes on the windows**
- **H2 rate:** H2 runs at about 15.5 cps, just over the limit. If it reads fast, extend the hookB out to 4.8 and push the body by 0.2 s, which brings it to 14.8 cps.
- **Price and renewal:** C5 and C6 are back to back with no gap, so the renewal terms are never off screen after the price.
- **Placement:**
  - Keep all captions inside the 9:16 and 4:5 safe areas.
  - Keep them clear of her face and hands.
  - In shots 3, 4 and 6, keep them off the pack and pouch label.

**Words to listen for in the transcript**
- "can count" (not "can't count")
- "greens powder"
- "21"
- "6 grams" and "fiber" (spelling as in the approved copy)
- "$29.99"
- "text sign-up"
- "$49.99"
- "every 4 weeks"
- Confirm that no fragment of "Honestly" remains at the shot 6 → 7 cut.

## 4. Sound plan

- **Voice:** sync audio from each clip carries the whole argument.
  - Keep her natural pace. Nothing is sped up.
  - Normalise hook and body to the same loudness.
  - Check clarity on a phone speaker.
- **Effects:** use only the real tear sound from tear.mp4, and only if it was recorded. Keep it low under "You tear the top." Add no other effects.
- **Music:** none was supplied, so the plan ships with no music. If music is wanted later, use only a track you own or one cleared for paid ads.
- **Cut checks:** listen for clicks, doubled words and room-tone jumps at:
  - 3.5 (hook → body)
  - 5.0 and 6.5 (cutaways over continuous body audio)
  - 7.6 (audio jump 6.6 → 7.8)
  - 12.4 (audio jump 12.6 → 15.7)
  - Use 2–3 frame crossfades where needed.

## 5. Close

- **What the close carries:** the approved body line, spoken and captioned, with nothing added:
  - "First order is $29.99 with the text sign-up. It renews at $49.99 every 4 weeks."
- **What is not added:** no end card, discount, deadline, guarantee or "link in bio."
- **The action:** the one action is the text sign-up. The approved number or keyword for the text sign-up was not supplied, so no destination appears on screen yet.
- **Last frame:** her to camera with C6 on screen. Check it small and muted.

## 6. Exports

Source files are kept untouched. Each version is delivered in each shape, clean and captioned: 8 files.

| Version | Shape | Clean | Captioned |
|---|---|---|---|
| V1 (H1) | 9:16, 1080×1920 | V1_916_clean.mp4 | V1_916_capt.mp4 |
| V1 (H1) | 4:5, 1080×1350 | V1_45_clean.mp4 | V1_45_capt.mp4 |
| V2 (H2) | 9:16, 1080×1920 | V2_916_clean.mp4 | V2_916_capt.mp4 |
| V2 (H2) | 4:5, 1080×1350 | V2_45_clean.mp4 | V2_45_capt.mp4 |

- **Format:** all files H.264 MP4, yuv420p, with audio.
- **4:5 crop:** this is a crop from the full 9:16 frame and drops about 570 px of height. Re-frame per shot:
  - Keep her face in shots 1, 2, 5 and 7.
  - Keep the tear and the hands in shot 3.
  - Keep the palm in shot 4.
  - Keep the full readable name in shot 6.
  - Re-check caption placement in the cropped frame.
- **Review pass:** watch the first frame, every join, the tear and pour demo, the pouch hold and the close, once with sound on and once muted.
- **Status:** the finished files are drafts for brand approval.

## 7. Gaps

This is a plan. No edited file exists yet.

- **MISSING: pack photos.** I can't confirm that the pack in hookB and body.mp4, the torn pack in tear.mp4 and the pouch in pouch.mp4 are the same current product and version. That includes logo, colours and shape.
  - Confirm that "pack" in the body and the "pouch" in pouch.mp4 are the same item. If they are not, drop shot 6 and hold body.mp4 on camera through "in one pack."
- **MISSING: screenshots from each clip.** Without them I could not check:
  - Label legibility.
  - Product state (sealed or opened).
  - Light and framing at the joins.
  - Where the tear and pour actions sit in X1 and X2.
- **MISSING: approved text sign-up destination.** The close needs the exact number, keyword or URL and its wording before any on-screen action can be added.
- **MISSING: confirm the offer is live.** Check that $29.99 for the first order with text sign-up, renewing at $49.99 every 4 weeks, is the current offer.
- **MISSING: line end times.** I need the end times for "tip it out" and "in one pack" to lock the in/out points and caption windows.
- **Optional shot:** a back-of-pack close-up showing the 21 vitamins and minerals and the 6 g fiber panel, held 2 s, to sit under C4 as support for the claim. Without it, the ad has no proof shot. That is acceptable, because the cut "fixed my stomach" line is not usable as proof.
- **Music:** none planned. Any music needs paid-ad clearance first.

## 8. Score

SCORE 67/100 (4 of 6 checks)
- **Pack looks true in every shot:** not verifiable. There are no pack photos or screenshots, and pack vs pouch is unconfirmed.
- **First frame, joins and close checked muted and with sound:** cannot be checked until a file exists.
```
