---
name: pdp-gallery-image-check
description: Use when product page gallery images have been rendered and need a pass or fail against their plan before upload.
---

# Product Page Gallery Image Check

A pass or fail for each rendered gallery image, and for the set, against the plan it was made from.

## Inputs
- **Rendered images** (required): every image at full size, in both shapes if two were made.
- **The plan** (required): the question, answer and exact words for each frame, with their sources.
- **Real product photos** (required): the same photos the images were built from.
- **Brand facts** (required): the figures, claims and terms the words must match.

## Steps
1. Look at each image at full size beside the real product photo. Never judge from memory or a thumbnail.
2. Run these 11 checks in order:
   1. Words: every planned line present, spelt as planned, no unplanned word.
   2. Figures: each number and unit matches the brand facts, digit for digit.
   3. Same product: put all frames on one sheet; shape, colour and proportion must not drift.
   4. Same size: set the hand shot beside the hero; they must read as one object at one size. This is free and catches the most embarrassing failure.
   5. One question each: name the question every frame answers; two frames on one question, or one frame on none, fails.
   6. Callouts and steps: each line touches the part it names, steps run in order, no inset shows a part the product lacks.
   7. Count: items in the "in the box" frame can be counted and match the order.
   8. People and proof: no generated person reads as a customer or expert; no child; no review or rating that is not real.
   9. Each shape: square and portrait side by side; type not cropped or misplaced in either.
   10. Phone: view at 390 px wide; the words must be readable.
   11. Edges: no border, button, watermark or logo the model added.
3. Stranger test, last: show each frame alone for 3 seconds. The viewer names the question and the answer, or the frame fails however good it looks.
4. For every failure write one line: what was asked, what came back.

## Output
Per image: PASS or FAIL, and for each failure the check number, the region of the image, the fault and the smallest fix. Then a set verdict: reads as one gallery, no two frames alike, upload order correct. Plan on about one frame in four failing.

## Checks
- Every image was inspected at full size, not just those that changed.
- Every failure names its check number and region.
- The set verdict is separate from the per-image verdicts.

## If something is missing
Write `MISSING: <real photo | plan | brand facts>` and do not pass the image. An uninspected image is a fail.

## Avoid
- Passing an image because it looks finished.
- Fixing a failure by resending the same prompt words.
- Judging at thumbnail size only.
