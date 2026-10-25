# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat-only",
  "version": "carry-body-brief-v1",
  "opening": "Keep the little things together.",
  "requested": "Body and close only; do not rewrite opening",
  "buyer": "An organizer for keys and small everyday objects",
  "facts": [
    {
      "id": "F1",
      "product": "Zip pouch Z1",
      "fact": "One zipped compartment;16by10cm;cotton canvas;18USD"
    },
    {
      "id": "Q1",
      "product": "Zip pouch Z1",
      "quote": "My keys stay in one place.",
      "permission": "Permission supplied for this exact quote",
      "source": "Customer note supplied24Oct"
    }
  ],
  "missing": [
    "Delivery timing",
    "Refund/guarantee terms"
  ],
  "unusable": "Brand-wide1000five-star reviews with no SKU link."
}

## Result

{
  "version": "carry-body-v1",
  "body": "Keys, then the other small things you need. Put them in one zipped compartment rather than leave them loose. The Z1 cotton-canvas pouch measures16by10cm. One Z1 buyer put it this way: “My keys stay in one place.”",
  "close": "Keep the little things together in the Z1 pouch,18USD. See the pouch and its dimensions. [MISSING: delivery timing and refund/guarantee terms before final sales use.]",
  "proofPlaced": [
    {
      "claim": "One zipped compartment;cotton canvas;16by10cm;18USD",
      "proof": "F1 exact Z1 product/offer facts"
    },
    {
      "claim": "One customer experience, not universal outcome",
      "proof": "Q1 exact permitted Z1 quote"
    }
  ],
  "excluded": [
    "1000brand-wide reviews are not Z1 evidence",
    "No shipping speed, refund period, stock limit or fake customer scene"
  ],
  "assumed": [
    "Illustrative loose-objects situation; not a claim about measured customer behavior"
  ],
  "placeholders": [
    "Delivery timing",
    "Refund/guarantee terms"
  ],
  "checksMissed": [
    "Commercial close cannot be final until the missing terms are supplied"
  ],
  "review": "Native self-review of carry-body-v1; independent runtime review NOT RUN",
  "saved": false
}

## Check

- {"name":"Body and close actually produced","passed":true,"evidence":"Requested scope delivered; opening retained and close returns to same organization promise."}
- {"name":"Claims and quote stay product-specific","passed":true,"evidence":"Q1 attached to Z1 and verbatim; broad review count excluded."}
- {"name":"Unknown terms remain explicit","passed":true,"evidence":"No invented guarantee, delivery, urgency or savings; close visibly provisional."}
- {"name":"Portable bounded handoff","passed":true,"evidence":"Inline output, exact version and self-review limits; no saved/installed or independent-run claim."}
