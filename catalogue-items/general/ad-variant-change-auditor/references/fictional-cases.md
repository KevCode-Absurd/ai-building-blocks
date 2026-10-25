# Fictional worked cases

These are native offline reviews, not live service or paid model tests.

## chat-only

Input: Test only the hook. Control: Keep pencils together. Cup 9. Choose your cup. Variant: Find one when you need one. Cup 7 today. Buy before midnight. The same image is claimed but absent.

Expected: Catch price, urgency and CTA changes beside the intended hook. Mark unseen media unknown and infer no performance result.

Actual: The lead change is intended. Price 9 to 7 changes the offer; the unverified midnight deadline adds urgency; the CTA also changes pressure. Image is NOT CHECKED. Verdict: repair, with an incomplete visual comparison. Restore price 9, remove the deadline and retain the control CTA while testing the new hook. No conversion lift or causal result is claimed.

Checks:
- All material cochanges detected
- No visual inspection from claim alone
- Smallest repair preserves test
- No performance inference

## file-capable

Input: contract.json locks offer 9 and destination /pageA. control.txt and V1.txt differ only in headline. V2.txt also changes destination to /pageB. No images are included.

Expected: Treat V1 as clean only within inspected text, catch V2 destination change and preserve source files.

Actual: variant-matrix.json marks V1 clean within text and V2 repair because /pageA changed to /pageB. Both list media, assignment, delivery and measurement as unknown. No source edits are recorded.

Checks:
- Textscope limit explicit
- Destination change caught
- Delivery unknown not assumed valid
- Inputs unchanged
