# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run refuses to pass anything it could not see, logs the four real faults from the owner's descriptions with exact planned-versus-found values and single-change fixes, and lists every unrun check. The one wobble is flagging the brand's approved headline "Clinically tested for nutrient absorption" at Stop because the owner's pasted facts left it out, though it asks for a source rather than asserting it is false.

## Judge list

- Met: Every image has a verdict, including ones that didn't change.
  01 through 08 each get a verdict, e.g. "08-promise: FAIL (not inspected)... No fault lines, but it cannot pass without the file."
- Met: Every fault names its check, severity and place in the image, never a vague "looks off".
  "05-what-arrives | Z4 Counts | Fix | pack layout | planned: pouch plus 28 daily packs | found: 24 packs"
- Met: Number faults quote the planned figure and the one that appeared.
  "planned: "21 vitamins & minerals" | found: "20 vitamins & minerals"" and 28 vs 24 packs.
- Met: Wrong facts, wrong product and fake proof are always Stop.
  02 wrong figure Stop; 03 missing study conditions Stop; 04 wrong tear Stop; count shortfall correctly Fix per severity rules.
- Met: Nothing counts as passed that wasn't seen at full size.
  Every image marked "FAIL (not inspected)"; set checks "not run"; Z2 for 02 "not verified in a file".

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
MISSING: image file (01 through 08 were not supplied; only your descriptions were. 01, 06 and 07 were not described at all.)
MISSING: plan (01, 06, 07; no word-by-word source for any image)
MISSING: real photo (the daily pack and its tear; the packs laid out as shipped)

**01: FAIL (not inspected).** No file, plan or description.

**02-made-of: FAIL (not inspected)**
`02-made-of | Z1/Z2 Words & Figures | Stop | middle line | planned: "21 vitamins & minerals" | found: "20 vitamins & minerals" | fix: change "20" to "21"; keep "60+ ingredients", "6g fiber", layout and type unchanged`

**03-tested: FAIL (not inspected)**
`03-tested | Z1/Z2 Words & Figures | Stop | below "Folate +20.5%" | planned: small print "2025 study, 12 weeks, 120 healthy adults" | found: missing, so the study figures appear without their conditions | fix: add the small-print line exactly as planned; keep the three existing lines unchanged`
`03-tested | Z2 Figures | Stop | headline | planned: "Clinically tested for nutrient absorption" | found: the brand facts support blood vitamin C +40.1% and folate +20.5%, and nothing says "absorption" | fix: supply the source for "absorption" or reword the headline to match the study as stated; keep both figure lines unchanged`

**04-steps: FAIL (not inspected)**
`04-steps | Z3 Product detail | Stop | step 2 picture | planned: "Tear across the top", and the pack tears straight across its top edge, never a corner | found: a corner torn | fix: redraw only the step 2 pack torn straight across its top edge; keep the step 1 and 3 pictures and all three captions unchanged`

**05-what-arrives: FAIL (not inspected)**
`05-what-arrives | Z4 Counts | Fix | pack layout | planned: pouch plus 28 daily packs | found: 24 packs | fix: add 4 packs to reach exactly 28; keep the pouch, layout pattern and spacing style unchanged`

**06: FAIL (not inspected).** No file, plan or description.

**07: FAIL (not inspected).** No file, plan or description.

**08-promise: FAIL (not inspected).** Z1 matches the plan and the guarantee terms ("30-day money-back", "first order") as you described it. No fault lines, but it cannot pass without the file.

**Set verdict: NOT RUN**
- S1 One object: not run. No images.
- S2 One job each: partly run. The 02, 03, 04, 05 and 08 jobs are distinct in the plan. The jobs for 01, 06 and 07 are unknown, so this is not passed.
- S3 Order: not run. There is no plan for 01, 06 or 07 and no upload sequence.
- S4 First-image rules (own store): not run. 01 was not supplied.

**Checks not run, and why**
- P1, P2, P3 (glance, readability, square and tall crops) for every image: no files to view at phone size.
- Z1 for 01, 06, 07, and letter by letter for 02, 03, 04, 05, 08: you reported the words, but no files were provided to read.
- Z2 for 02 ("60+", "6g"): these match the facts as you reported them, but they were not verified in a file.
- Z3 for all images: no files. The real photos (pouch front on, gummies in hand) do not show a daily pack, its tear, or label detail on the packs.
- Z4 for 05: your count of 24 is used, but it was not verified in a file.
- Z5 (people and proof) for every image: no files. 03 has no source supplied for its claim.
- Z6 (borders, watermarks, zoom detail, AI label in metadata) for every image: no files or metadata.
```
