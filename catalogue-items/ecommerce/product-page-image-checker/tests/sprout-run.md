# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly refuses to treat the transcribed descriptions as seen images, catches the 20 vs 21 vitamin error, the corner tear and the 24-pack count, and gives each a precise fix. Scoring is shown with the sum, and the not-run list and MISSING lines are honest and complete.

## Judge list

- Met: Every image has a verdict, including ones that didn't change.
  All five images have verdict lines, including "IMAGE 08-promise  FAIL (not inspected...)".
- Met: Every fault names its check, severity and place in the image, never a vague "looks off".
  "Z2 figures | Stop | second line of the three facts"; "Z4 counts | Fix | daily packs laid out beside the pouch".
- Met: Number faults quote the planned figure and the one that appeared.
  planned: "21 vitamins & minerals" found: "20 vitamins & minerals"; planned 28 packs, found 24.
- Met: Wrong facts, wrong product and fake proof are always Stop.
  Wrong 20 vs 21 marked Stop; corner tear marked Stop. Missing study conditions marked Fix, which is debatable but defensible.
- Met: Nothing counts as passed that wasn't seen at full size.
  Every image FAIL marked "not inspected: described, file not seen"; 08 says no fault found but FAIL.

## What went in

```text
Facts: per pack "60+ ingredients, 21 vitamins & minerals, and 6g
fiber". Study: 2025, 12 weeks, 120 healthy adults aged 23 to 59;
blood vitamin C +40.1%, folate +20.5%. The daily pack tears
straight across its top edge, never a corner. 28 daily packs per
pouch. Guarantee: 30-day money-back, first order only.

The plan, and what I see on each image at full size:
02-made-of. Plan: "60+ ingredients" / "21 vitamins & minerals" /
"6g fiber". Image: "60+ ingredients" / "20 vitamins & minerals" /
"6g fiber".
03-tested. Plan: "Clinically tested for nutrient absorption" /
"Vitamin C +40.1%" / "Folate +20.5%" / small print "2025 study, 12
weeks, 120 healthy adults". Image: the first three lines only.
04-steps. Plan: "1 Grab a pack" / "2 Tear across the top" / "3 Tip
into your palm". Image: all three lines; step 2 shows a corner torn.
05-what-arrives. Plan: pouch plus 28 daily packs laid out. Image: I
count 24 packs.
08-promise. Plan: "30-day money-back guarantee on your first
order". Image: the same words.

For our own store. Real photos attached: pouch front on, gummies in
a hand.
```

## What came out

```text
```
IMAGE 02-made-of  FAIL (not inspected: described, file not seen)
Z2 figures | Stop | second line of the three facts
  planned: "21 vitamins & minerals"  found: "20 vitamins & minerals"
  fix: change "20" to "21"; keep "60+ ingredients", "6g fiber", wording, type, layout and picture the same

IMAGE 03-tested  FAIL (not inspected: described, file not seen)
Z2 figures | Fix | small print under the figures (absent)
  planned: small print "2025 study, 12 weeks, 120 healthy adults"  found: only "Clinically tested for nutrient absorption" / "Vitamin C +40.1%" / "Folate +20.5%", with no study conditions
  fix: add the small-print line "2025 study, 12 weeks, 120 healthy adults" beneath the two figures; keep the three existing lines, figures and layout the same

IMAGE 04-steps  FAIL (not inspected: described, file not seen)
Z3 product detail | Stop | step 2 picture
  planned: "2 Tear across the top", with the pack torn straight across its top edge  found: the pack torn at a corner
  fix: redraw only the step 2 picture so the pack tears straight across the top edge; keep all three lines, steps 1 and 3, and the layout the same

IMAGE 05-what-arrives  FAIL (not inspected: described, file not seen)
Z4 counts | Fix | daily packs laid out beside the pouch
  planned: pouch plus 28 daily packs  found: 24 packs (your count)
  fix: lay out exactly 28 packs (for example 4 rows of 7); keep the pouch, its position, the background and the light the same

IMAGE 08-promise  FAIL (not inspected: described, file not seen)
No fault found in what the description covers. Z1 words match the plan, and the terms match the brand facts (30-day money-back, first order only).

SET (pass 1)
S1 one object:   not run. The images were not seen, so shape, colour and size can't be compared with the real pouch and in-hand photos.
S2 one job each: pass on the plan only (made-of, tested, steps, what-arrives, promise are five distinct jobs). Not checked on the images.
S3 order:        not run. Only 02, 03, 04, 05 and 08 were given. No main image (01) and no full upload order were supplied.
S4 first image:  not run. No main image was supplied. Own-store rule: the product must be the clear subject at thumbnail size.

SCORE  0/100 now (100 - 40 x 2 - 15 x 2 - 5 x 0 = -10, stops at 0)
       100/100 after the fixes (on the checks run)
       2 Stops: do not upload until 02 and 04 are fixed.

NOT RUN
The images were described, not attached. Every check that needs the file was not run, and no image has been described beyond what you wrote.
P1 glance, P2 readable, P3 crop (all images): need each file at full size, in every upload shape (square and tall).
Z1 words (all images): checked from your transcription only. A letter-by-letter read needs the files.
Z2 figures (02, 03): checked from your transcription only. Confirming them needs the files.
Z3 product detail (02, 03, 05, 08; 04 beyond step 2): needs the files beside the real pouch and in-hand photos to check label printing, closure, colours and callout lines.
Z4 counts (05): your count of 24 was used. Confirming it needs the file.
Z5 people and proof (all images): needs the files to check for made-up people, children, reviews and badges.
Z6 clean file (all images): needs the files and their metadata to check for added borders, buttons, watermarks or logos, zoom detail and the AI label.
S1, S3, S4: need the main image 01 and the full upload order.
MISSING: image file (02, 03, 04, 05, 08 at full size; main image 01)
MISSING: plan (upload order and any images other than 02, 03, 04, 05, 08)
```
```
