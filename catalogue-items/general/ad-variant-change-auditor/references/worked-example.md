# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat first; synthetic named-file matrix trial after",
  "contract": {
    "id": "T1",
    "question": "Which headline better attracts the same buyer?",
    "control": "C/v1",
    "factor": "headline",
    "invariants": [
      "30USD",
      "Same product/offer/body/CTA/image",
      "Same audience/placement/destination"
    ],
    "assignment": "not supplied",
    "observationPlan": "not supplied"
  },
  "control": {
    "id": "C/v1",
    "headline": "Room for the small things",
    "body": "One zipped pouch.30USD.",
    "cta": "View pouch",
    "image": "control.png not supplied",
    "destination": "/pouch"
  },
  "variant": {
    "id": "V/v1",
    "headline": "Keep keys together",
    "body": "One zipped pouch.27USD.",
    "cta": "Buy before midnight",
    "image": "variant.png not supplied",
    "destination": "/pouch"
  },
  "resultMention": "Owner reports variant CTR6%vscontrol4%; assignment, windows and denominators not supplied."
}

## Result

{
  "contract": "T1headline only; C/v1control retained.",
  "differences": [
    {
      "dimension": "headline",
      "control": "Room for the small things",
      "variant": "Keep keys together",
      "classification": "intended",
      "interpretation": "Different lead emphasis is the named test factor"
    },
    {
      "dimension": "price",
      "control": "30USD",
      "variant": "27USD",
      "classification": "unintended",
      "interpretation": "Offer change can explain response"
    },
    {
      "dimension": "CTA/urgency",
      "control": "View pouch",
      "variant": "Buy before midnight",
      "classification": "unintended",
      "interpretation": "Action and deadline introduce separate factors; deadline not approved"
    },
    {
      "dimension": "image/product depiction/layout",
      "classification": "uninspected",
      "interpretation": "Filenames do not establish same artwork, model or layout"
    },
    {
      "dimension": "destination text",
      "classification": "intended invariant preserved in supplied text",
      "evidence": "/pouchmatches"
    },
    {
      "dimension": "Actual page/UTM/audience/delivery",
      "classification": "uninspected"
    }
  ],
  "readiness": [
    {
      "id": "V/v1",
      "status": "REPAIR + INCOMPLETE",
      "reason": "Price and urgency break locks; media/delivery missing"
    }
  ],
  "repair": {
    "nextVersion": "V/v2proposed",
    "headline": "Keep keys together",
    "body": "One zipped pouch.30USD.",
    "cta": "View pouch",
    "destination": "/pouch",
    "requires": "Actual common media/preview and delivery/measurement contract before recheck; do not rewrite C/v1"
  },
  "resultInterpretation": "No headline winner can be inferred from4%/6%alone: offer/CTA/media and assignment/denominators are unresolved. A proposed textual repair is not a completed causal experiment.",
  "alternateRoute": "If owner wants27USD/deadline concept, obtain a separate approved test contract rather than label it the same headline-only test.",
  "notRun": [
    "Media inspection",
    "Delivery/assignment verification",
    "Campaign launch/allocation",
    "Results collection"
  ],
  "sourceFilesChanged": false
}

## Check

- {"name":"Concrete difference matrix identifies actual confounds","passed":true,"evidence":"Price30to27 and changed urgency/CTA singled out, not just a generic gate."}
- {"name":"Smallest actual repair preserves the control","passed":true,"evidence":"V/v2restores30USDandViewpouch; C/v1andapprovedoffer not altered."}
- {"name":"Unseen media and delivery remain unknown","passed":true,"evidence":"Same filenames not inferred; exact version binding requires recheck."}
- {"name":"Results and external actions bounded","passed":true,"evidence":"Reported CTR is insufficient for causal headline winner; report fixture only, no campaign action."}
