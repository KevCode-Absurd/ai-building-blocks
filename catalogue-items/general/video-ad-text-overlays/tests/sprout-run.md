# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A disciplined, honest plan: two tiny labels taken straight from the allowed copy, placed on frame-checked wall space inside the safe area, with every unverifiable placement marked unchecked and every gap listed. The owner can hand this to an editor as-is and knows exactly which frames and script lines to supply to tighten it.

## Judge list

- Met: Every word on screen is a phrase from the approved script or allowed copy, unchanged
  Only two overlays: "Sprout" and "sprout.example", both listed verbatim in the input's allowed copy.
- Met: Nothing covers the product, a face or a hand, and no overlay repeats a caption
  "on the plain kitchen wall beside the pouch, never across it"; label 2 in scene 8, "the one scene that has no caption".
- Met: Few overlays, about one every 6 to 8 seconds at most, never two at once
  "Count: 2 in 22.9 seconds (ceiling 3)"; 8.8-10.8 s and 20.6-22.9 s do not overlap.
- Met: Each one stays up long enough to read
  "Sprout" 2.0 s; "sprout.example" (14 characters) 2.3 s, under 15 characters a second and over 1.5 s.
- Met: Muted at phone size: what it is, why it matters, what to do next
  Name label at 8.8 s, burned-in caption "21 vitamins and minerals and 6 grams of fiber", site label at the end; honestly noted "not played".
- Met: Nothing in the top 14% or bottom 35% of a vertical video
  "about 16-30% down from the top and 6-40% in from the left" for both labels.

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
OVERLAYS
1 label | "Sprout" | 8.8-10.8 s |
  Upper-left, about 16-30% down from the top and 6-40% in from the left, on the plain kitchen wall beside the pouch, never across it. Unchecked.
  Anchored to: scene 5, the pouch held to the lens, early in "21 vitamins and minerals and 6 grams of fiber, in one pack."
  Reason: names the product beside the pack the first time a frame-checked shot shows it, so a muted viewer knows what it is.
2 label | "sprout.example" | 20.6-22.9 s |
  Upper-left, about 16-30% down from the top and 6-45% in from the left, on the empty wall above the pouch. Same position as label 1. Unchecked.
  Anchored to: scene 8, the pouch on the counter, no speech.
  Reason: gives a muted viewer the next step in the one scene that has no caption.

LEFT OUT ON PURPOSE
Scene 1, opening 0.0-3.2 s: it has a caption, so the first 1.5 s stay clear. Her face is the picture.
Scene 2, first clear view of the pack 3.2-4.6 s: this is where the name belongs. No frame was described near it, and its caption is unknown. The name moved to scene 5. To place it here I'd need the frame at about 2.6 or 5.1 s and the scene 2 line.
Scene 3, tearing the top 4.6-6.6 s: this would be the missable step. Its spoken line isn't known, and step words must come from the approved script. The tear also reads clearly in the picture. To place it I'd need the scene 3 line and the frame at about 5.1 s.
Scene 4, gummies into her palm 6.6-8.5 s: the picture does the work, and the caption is unknown.
Scene 5 proof, "21 vitamins and minerals" or "6 grams of fiber": the burned-in caption already says it word for word, so a badge would repeat it.
Scene 6, her 12.5-13.6 s: no frame was described, the caption is unknown, and there's no job left for it.
Scene 7, price and terms 13.6-20.4 s: the caption covers the spoken terms. The approved wording is also too long for an overlay.
Count: 2 in 22.9 seconds (ceiling 3)

STYLE  Format: clean (a person talking with a short demo, the default since no format was given), so labels only. Font: Work Sans bold.
Label 1: warm cream #FFF7DF text on a forest green #00582D tab, about 8.1:1 contrast, with a soft shadow.
Label 2: forest green #00582D text on a sunflower yellow #FFCC2E tab, about 5.7:1 contrast, with a thin green outline.
Both pass 4.5:1 for small text. Neither covers the pouch printing or the logo. Overlays go on a separate file; the clean version stays untouched.

NOTES
Placement judged on: the written notes for f5 (10.1 s) and f9 (22.4 s). No frame images were attached, so every placement is unchecked. f4 (7.6 s) was considered and not used.
Between samples: 8.8-10.1 s, since the pouch is held to the lens and may move or fill the upper-left. 20.6-22.4 s, since the frame at about 19.9 s wasn't described. A person must check both by eye.
Times come from scene lengths, not measured speech.
No mismatch found in the frame notes. The script for scenes 1-4, 6 and 7 wasn't seen, so a mismatch there can't be ruled out.
MISSING: the frame images themselves. Descriptions of frames at about 0.1, 2.6, 5.1, 12.6, 15.1, 17.6 and 19.9 s. The approved script lines for scenes 1-4, 6 and 7. Whether scene 7's caption already says sprout.example (if it does, label 2 repeats it and should go). The product name and plain description as printed on the pack. The guarantee wording, if there is one. The never-say list. The format.

CHECKS MISSED  
Nothing covers the product, a face or a hand: couldn't be confirmed, because placements were judged on written notes and not on frames.
Nothing repeats a caption: label 2 can't be confirmed until scene 7's caption is known.
The three questions answered when played muted at phone size: not played. "Why should I care" relies on the scene 5 caption.

Next, would you like to check it before it goes live with the [Pre-launch ad checker](https://useaiblocks.com/skills/pre-launch-ad-checker), or make captions in your brand font with the [Video caption maker in your brand font](https://useaiblocks.com/skills/branded-video-captions)? You can also name your own next step.
```
