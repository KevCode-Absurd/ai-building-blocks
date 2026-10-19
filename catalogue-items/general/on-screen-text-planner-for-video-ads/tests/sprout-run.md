# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 6 met. Invented facts: 2.

This is a careful, honest plan: two on-brand labels, the offer sensibly left to the captions, and gaps clearly marked MISSING. The first label's placement is unverified and could repeat a caption, so the owner must check it before use.

## Fix

In step 2, don't place a name label in a scene that has no frame or no confirmed caption text; ask for frames or the caption wording first, or anchor only to frame-checked scenes.

## Judge list

- Met: 1. Every word on screen is a phrase from approved script or allowed copy, unchanged.
  Overlay texts are "Sprout" and "sprout.example", both in the allowed copy.
- Not met: 2. Nothing covers product, face or hand, and no overlay repeats a caption.
  Label 1 "no frame"; run admits "Drop it if the scene 1 or 2 caption already says 'Sprout'". Unverified.
- Met: 3. Few overlays, at most one per 6-8 s, never two at once.
  "2 overlays against a ceiling of 3 for 22.9 s"; 3.3-4.8 and 20.6-22.9 never overlap.
- Met: 4. Each stays up long enough to read.
  Label 1 is 1.5 s for one word; label 2 is 2.3 s for 14 characters, within the rate limit.
- Met: 5. Muted at phone size: what it is, why it matters, what to do next.
  Name label, scene 5 caption carries the fact, site address in the final scene; offer is in the captions.
- Met: 6. Nothing in top 14% or bottom 35%.
  Both labels placed at "y 16–24%", inside the safe area.

## Invented

- number: Contrast is about 8.1:1 ... about 5.7:1 (Contrast ratios are computed from the given brand colours, not invented.)
- number: 42 characters ... needs about 2.8 s (Worked out from the allowed copy and the 15 characters per second rule.)

## What went in

```text
Finished ad: Sprout customer ad, version A, 22.9 s, 9:16.
Captions already burned in, lower part, on every spoken line.
Scenes: 1 her to camera 0.0-3.2 | 2 holds up a pack 3.2-4.6 |
3 tears the pack across the top 4.6-6.6 | 4 gummies into her palm
6.6-8.5 | 5 pouch held to the lens 8.5-12.5 ("21 vitamins and
minerals and 6 grams of fiber, in one pack.") | 6 her 12.5-13.6 |
7 her, price and terms 13.6-20.4 | 8 pouch, no speech 20.4-22.9
Frames (one every 2.5 s): f4 at 7.6 s, palm center, empty counter
top-left. f5 at 10.1 s, pouch center-right in her hand, plain
kitchen wall top-left. f9 at 22.4 s, pouch center on the counter,
empty wall upper-left.
Allowed copy: Sprout; the approved script; "First order is $29.99
with the text sign-up. It renews at $49.99 every 4 weeks."; the
site, sprout.example.
Brand: Work Sans bold; forest green #00582D, warm cream #FFF7DF,
sunflower yellow #FFCC2E for badges.
```

## What came out

```text
MISSING: full approved script for scenes 1–4 and 6–7. Only scene 5's line was given, so I can't confirm whether "Sprout", the tear step or the site is already spoken and captioned.
MISSING: attached frames. Only text descriptions of f4, f5 and f9 were given, so every placement below is unchecked. Please attach screenshots, at minimum around 3.2–5.1 s and 20.4–22.9 s.
MISSING: format. I've treated this as **clean** because it's a customer talking to camera, so it uses labels only, kept clear of her mouth.
MISSING: never-say list, and the product name as printed on the pouch.

**Overlay plan**

| # | kind | exact text | start–end (s) | position (9:16) | anchored to | reason |
|---|---|---|---|---|---|---|
| 1 | label | Sprout | 3.3–4.8 | upper-left, about x 8–40%, y 16–24%, beside the pack and never across it | Scene 2, the pack is first held up (runs 0.2 s into scene 3) | Answers "what is it?" for a muted viewer. Drop it if the scene 1 or 2 caption already says "Sprout", or if the printed pack name reads clearly at phone size. |
| 2 | label | sprout.example | 20.6–22.9 | upper-left, about x 8–40%, y 16–24%, on the empty wall | Scene 8, pouch on the counter, no speech | Answers "what do I do now?" in a silent, uncaptioned scene. Same position as label 1. |

**Left out on purpose**
- **Proof badge, "21 vitamins and minerals":** the scene 5 caption already says it, and a badge would repeat the caption.
- **Offer badge in the final scene:** it is spoken and captioned in scene 7. The phrase that keeps its condition, "First order is $29.99 with the text sign-up", runs 42 characters and needs about 2.8 s. Scene 8 is 2.5 s. Showing $29.99 without the $49.99 renewal would also leave the term out, so the offer stays in the captions only.
- **Tear step (scene 3):** the picture shows it, and I have no approved wording for this scene. I won't write "tear the top" without it.
- **Underline:** nothing holds still on screen in the scenes that needed help.
- **Scene 1 (0.0–3.2), scene 4 (palm and gummies, f4), scenes 6–7:** her face, her hands and the captions carry these. They stay clear on purpose.

**Count**
2 overlays against a ceiling of 3 for 22.9 s (one per 6–8 s). The first 1.5 s are clear. No two overlays appear at once.

**Style and contrast**
- Work Sans Bold in forest green #00582D on a warm cream #FFF7DF label tag, with a soft shadow.
- Contrast is about 8.1:1, which passes even as small text.
- Sunflower #FFCC2E with green text would be about 5.7:1, but it isn't used because a clean format uses no badges.
- Neither label touches the pouch's printing or logo.
- The Work Sans font file needs to be supplied to whoever builds the overlay.

**Frames each placement was judged on**
- Label 1: no frame. 3.3–4.8 falls between frames, and none in that range was described. I'm guessing her face is not upper-left while she holds the pack up. Please check this.
- Label 2: f9 (22.4 s). The pouch is centred and the upper-left wall is empty. 20.6–22.4 is before that frame, so check that the pouch has already settled there.

**Timing**
All times come from the scene lengths given, not from measured speech.

**Footage vs script**
- f9 at 22.4 s doesn't match the stated 2.5 s spacing (f4 7.6, f5 10.1 would put f9 at 20.1). Please confirm the frame times.
- The script says "pack" and the scene notes say "pouch". Confirm these are the same product.
- Confirm the burned-in captions sit within the bottom 35%, so they don't crowd the label zone.

**Video**
The footage, voice, sound and 22.9 s length are unchanged. The overlay version is a separate file, and the clean version is kept.

SCORE 83/100 (5 of 6 checks)
- Missed, "nothing covers product, face or hand, or repeats a caption": not verified. Label 1 sits between frames with no image to check against, and it may repeat a caption if "Sprout" is spoken in scene 1 or 2. The scene 1–2 script and screenshots are needed to confirm.
```
