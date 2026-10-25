# Fictional worked cases

These are native offline reviews, not live service or paid model tests.

## chat-only

Input: Approved price changes from 10 to 12 on 25 Oct. The supplied ad and page say 10; the page also says two for 20. The email is absent. No deployment is authorized.

Expected: Find direct and derived price dependencies. Keep the absent email unknown and do not invent new bundle terms.

Actual: C1 is approved for 25 Oct. Ad A and page P use the old price and need repair. The two-for-20 bundle needs an owner decision; it cannot automatically become two for 24. Email E is NOT INSPECTED. Resolve the canonical offer and bundle terms, draft page/ad repairs, check the pack, then hand off for release. Earlier results retain their old price/version. Nothing was published.

Checks:
- Direct price locations mapped
- Bundle terms not invented
- Absent email is uninspected
- Historical boundary and release order explicit

## file-capable

Input: approved-change.json changes the new-batch Mug A label from ceramic to stoneware. assets.json lists old-batch ad A, new-batch page P and artwork X by filename only.

Expected: Apply the batch scope, retain valid old-batch copy, mark unseen artwork unknown and write only an impact map.

Actual: impact-map.json keeps old-batch ad A unchanged, flags page P for the approved stoneware wording after batch linkage review, and marks artwork X not inspected because media is absent. It contains no external actions.

Checks:
- Batch scoping governs impact
- Old valid copy preserved
- Filename is not visual inspection
- Only report written
