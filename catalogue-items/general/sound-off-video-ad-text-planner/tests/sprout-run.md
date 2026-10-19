# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A restrained, correct result: one well-placed, well-timed site label from allowed copy, with every skipped moment explained and gaps flagged. The only soft spot is that the product-name label was skipped on an assumption the captions or pack show it, though the run tells you to check and gives a fallback position.

## Judge list

- Met: Every word on screen is a phrase from the approved script or allowed copy, unchanged.
  Only overlay: "sprout.example", which the input lists under allowed copy as "the site, sprout.example".
- Met: Nothing covers the product, a face or a hand, and no overlay repeats a caption.
  "Upper-left ... on the empty wall, well clear of the pouch at centre" in scene 8, "pouch, no speech", so no caption there.
- Met: Few overlays, about one every 6 to 8 seconds at most, never two at once.
  "Count: 1 overlay against a ceiling of 3 (22.9 s at one per 6–8 s)."
- Met: Each one stays up long enough to read.
  "14 characters, with 2.3 s on screen (minimum 1.5 s)" at 20.6–22.9 s.
- Met: Muted at phone size you can say what it is, why it matters and what to do next.
  Pack with wordmark held to lens, captioned "21 vitamins ... 6 grams of fiber", then "sprout.example"; name label left conditional with a check.
- Met: Nothing sits in the top 14% or bottom 35% of a vertical video.
  "about 6–45% across, 15–30% down" is inside the 14%–65% vertical band and 6% side margins.

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
| kind | exact text | start–end (s) | position | anchored to | reason |
|---|---|---|---|---|---|
| label | sprout.example | 20.6–22.9 | Upper-left inside the safe area: about 6–45% across, 15–30% down, on the empty wall, well clear of the pouch at centre | Scene 8 (pouch, no speech), beside the pouch | Scene 8 is the only stretch with no caption. A muted viewer gets the next step after scene 7's captioned terms end. The text is from the allowed copy, 14 characters, with 2.3 s on screen (minimum 1.5 s). |

**Left out on purpose**
- **Name ("Sprout"):** The first clear pack view is scene 2, which lasts only 1.4 s. That is under the 1.5 s minimum, and no frame from it was provided. Her captioned lines and the pouch held to the lens in scene 5 most likely carry the name. If neither the captions nor the pack printing shows "Sprout", add a name label beside the pouch and check it on a scene 2 or 3 frame.
- **Proof ("21 vitamins and minerals" / "6 grams of fiber"):** This is already burned in as the scene 5 caption, and a badge would repeat it. If it were ever needed, the place would be upper-left on the wall in f5.
- **Tear step (scene 3):** The picture does the work, and no frame was provided.
- **Offer and terms (scene 7):** They are captioned while she says them, and her face is on screen. If they ever go on a badge, the renewal condition must stay attached: "First order is $29.99 with the text sign-up. It renews at $49.99 every 4 weeks."
- **Underline:** The only still subject is the scene 8 pouch. An underline there would add nothing over the label and risks touching the printing.
- **Opening:** The first 1.5 s are clear. The opening is captioned, and scene 1 is her to camera.
- **Why only one:** With captions on every line, no other moment qualifies. The ad is better without more text.

**Count:** 1 overlay against a ceiling of 3 (22.9 s at one per 6–8 s).

**Style and contrast**
- Format is **clean** by default (a person talking), so it is a small label, not a yellow badge.
- Text is Work Sans bold in warm cream #FFF7DF on a forest green #00582D rounded plate with a soft shadow. The contrast is about 8.1:1, which passes 4.5:1 even at small size.
- The plate covers no printing or logo.
- Confirm Work Sans bold is installed. If it isn't, flag it rather than substituting a generic font.

**Frames used**
- Placement was judged on **f9 (22.4 s)**.
- f4 and f5 were reviewed only to confirm the left-out moments.

**Between frames**
- 20.6–22.4 s is unseen. Check that the pouch stays at centre and nothing enters upper-left. If the pouch drifts, keep the label on the side it moves away from.

**Timing basis**
- Times come from the scene lengths given, not measured speech.
- The label enters 0.2 s after scene 8 starts so it doesn't overlap the scene 7 caption's exit.

**Footage vs script**
- Only the scene 5 line was supplied, so nothing else could be compared.
- Check that the scene 7 spoken price and terms match the allowed copy word for word, including the renewal condition.

**Output file**
- Footage, sound and length are unchanged. Render the overlay as a separate file and keep the clean master.

MISSING: full approved script for scenes 1–4, 6 and 7
MISSING: frames for scenes 1–3 and 6–8 other than f9 (f1–f3, f6–f8)
MISSING: whether "sprout.example" and "Sprout" are spoken and captioned
MISSING: product name as printed on the pack
MISSING: never-say list
MISSING: format (defaulted to clean)
```
