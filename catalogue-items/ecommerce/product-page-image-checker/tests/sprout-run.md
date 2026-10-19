# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 5 of 5 met. Invented facts: 0.

The run caught the real faults (20 vs 21, the corner tear, 24 vs 28 packs, missing study conditions) and was honest about not seeing the files. But it departed from the output shape and invented faults and verdicts for images 01, 06 and 07 that have no plan.

## Fix

In the output shape rule, require the exact layout (IMAGE nn-job PASS/FAIL blocks, SET lines, SCORE line, NOT RUN) and limit verdicts to images that were supplied. Also require SCORE to show the sum on the exact formula line, with 'after fixes' not claimed as 100 when checks were not run.

## Judge list

- Met: Every image has a verdict, including ones that didn't change.
  Verdicts given for 01, 02, 03, 04, 05, 06, 07 and 08, e.g. "08-promise: FAIL (not inspected)".
- Met: Every fault names its check, severity and place in the image, never a vague 'looks off'.
  "04-steps | Z3 Product detail | Stop | step 2 picture" and similar lines name check, severity and place.
- Met: Number faults quote the planned figure and the one that appeared.
  "planned: \"21 vitamins & minerals\" | found: \"20 vitamins & minerals\""; 28 vs 24 packs.
- Met: Wrong facts, wrong product and fake proof are always Stop.
  20 vs 21 vitamins and the corner tear are both Stop; the missing study conditions are also Stop.
- Met: Nothing counts as passed that wasn't seen at full size.
  All images marked "FAIL (not inspected)"; set checks listed as not run.

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
**MISSING: image file** (no image files reached me, only your description of 02, 03, 04, 05 and 08. 01, 06 and 07 are not mentioned at all)
**MISSING: real photo** (you say the pouch and in-hand photos are attached, but I can't see them)
**MISSING: plan** for 01, 06 and 07

The fault lines below come from what you report seeing and from your facts. I have not confirmed them by eye. Send the full-size files in every upload shape, plus the two real photos, and I'll run every check.

## Verdict per image

**01: FAIL (not inspected).** No file and no plan.

**02-made-of: FAIL (not inspected)**
`02-made-of | Z2 Figures | Stop | second line | planned: "21 vitamins & minerals" | found: "20 vitamins & minerals" | fix: change "20" to "21" only; keep the font, size, position and the other two lines`

**03-tested: FAIL (not inspected)**
`03-tested | Z1 Words / Z2 Figures | Stop | below "Folate +20.5%" | planned: small print "2025 study, 12 weeks, 120 healthy adults" | found: no small print, so the study figures have lost their conditions | fix: add the small print line under the figures; keep the three existing lines unchanged`
`03-tested | Z2 Figures | Polish | small print | planned: "2025 study, 12 weeks, 120 healthy adults" | found: brand facts also give "aged 23 to 59" | fix: add "aged 23 to 59" after "adults"; keep the rest of the line as is`

**04-steps: FAIL (not inspected)**
`04-steps | Z3 Product detail | Stop | step 2 picture | planned: pack torn straight across its top edge | found: a corner torn, which the brand's method rules out | fix: redraw only the step 2 tear as a straight line across the top edge; keep the hand, pack, framing and all three captions`

**05-what-arrives: FAIL (not inspected)**
`05-what-arrives | Z4 Counts | Fix | pack layout | planned: pouch plus 28 daily packs | found: 24 packs | fix: add 4 packs to make 28 in the same grid style; keep the pouch, spacing and background`

**06: FAIL (not inspected).** No file and no plan.

**07: FAIL (not inspected).** No file and no plan.

**08-promise: FAIL (not inspected).** As you report it, the words match the plan and the guarantee terms (30-day, first order only). No fault is logged, but this is unconfirmed until I see the file.

## Set verdict (S1 to S4): not run
- **S1 One object:** not run. There are no images, and the in-hand photo and main image can't be compared.
- **S2 One job each:** not run. Going by file names alone, 02 to 08 look like separate jobs, but 01, 06 and 07 are unknown.
- **S3 Order:** not run. There is no full upload order, and the main image (01) is absent.
- **S4 First-image rules (own store):** not run. No main image.

## Score (provisional, from reported faults only)
- **Now:** 100 − 40 (02 Stop) − 40 (03 Stop) − 40 (04 Stop) − 15 (05 Fix) − 5 (03 Polish) = −40, floored at **0**
- **After every listed fix:** **100** (provisional, since most checks have not run)
- **Do not upload.** There are three Stops, and no image has been inspected.

## Checks not run, and why
- **P1 Glance, P2 Readable and P3 Crop on every image:** no files to view at phone size or in the square and tall shapes.
- **Z1 Words and Z2 Figures:** confirmed for none. I relied on your reading for 02, 03, 04, 05 and 08, and 01, 06 and 07 have no plan or file.
- **Z3 Product detail (label printing, closure, colours, callout lines) on all images:** no images, and the real photos are not visible to me.
- **Z4 Counts outside 05:** no images.
- **Z5 People and proof:** not run. No images. This includes the hand in 04 and anything in 01, 06 and 07.
- **Z6 Clean file (borders, added logos, zoom detail, AI label in metadata):** not run, because it needs the actual files.
- **S1 to S4:** see the set verdict above.
```
