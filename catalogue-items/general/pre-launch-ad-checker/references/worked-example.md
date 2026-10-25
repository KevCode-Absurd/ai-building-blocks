# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat-only",
  "version": "bottle-ad-script-v2",
  "placement": "Proposed mobile feed video; no dated official spec supplied",
  "asset": {
    "script": "Frame1:500ml steel bottle. End:See Nori.26USD.",
    "caption": "Nori500ml steel bottle.26USD.",
    "button": "View details"
  },
  "facts": "Approved Nori500ml,steel,26USD,no sale",
  "missing": [
    "Actual image/video/audio",
    "Placement preview/current official specification",
    "Destination response",
    "UTM record",
    "Event probe",
    "Budget/risk limit and experiment rule"
  ]
}

## Result

{
  "version": "bottle-ad-script-v2",
  "message": "See a500ml steel bottle priced26USD.",
  "checkMatrix": [
    {
      "check": "Supplied script facts",
      "status": "PASS",
      "evidence": "500ml,steel,26USD match approved record"
    },
    {
      "check": "One action and provided button text",
      "status": "PASS",
      "evidence": "See Nori/View details share one details-view action"
    },
    {
      "check": "Caption/spoken contradictions in supplied script",
      "status": "PASS",
      "evidence": "Supplied text agrees; no actual audio inspected"
    },
    {
      "check": "Dated placement specification",
      "status": "NOT CHECKED"
    },
    {
      "check": "Safe zones and actual media legibility/product rendering",
      "status": "NOT CHECKED"
    },
    {
      "check": "Real audio/caption execution",
      "status": "NOT CHECKED"
    },
    {
      "check": "Destination/offer/UTM congruence",
      "status": "NOT CHECKED"
    },
    {
      "check": "Event firing",
      "status": "NOT CHECKED"
    }
  ],
  "observed": 3,
  "eligible": 8,
  "observedStopShip": 0,
  "observedWorthALook": 0,
  "score": "100 observed penalty-score points within the supplied text checks only;3/8 coverage. This is not complete launch readiness.",
  "verdict": "INCOMPLETE",
  "fiveLinks": {
    "who": "thin: no buying situation supplied",
    "gain": "thin: factual product only",
    "proof": "product facts supplied; no performance assertion",
    "risk": "unknown buyer doubt/terms",
    "step": "text action clear; actual destination unverified"
  },
  "nextAction": {
    "owner": "Creative/launch owner",
    "action": "Supply the exact media version and intended placement preview/spec, then verify destination/tracking under a separate authorized probe.",
    "testContract": {
      "control": "MISSING",
      "variable": "MISSING",
      "budgetRisk": "MISSING",
      "window": "MISSING",
      "decision": "MISSING"
    }
  },
  "interpretation": "125/40 and eight-word heuristics are craft suggestions, not platform limits or a reason to pass a specification check.",
  "notRun": [
    "No actual video, link, tracking event or policy check",
    "No changes, upload or launch"
  ],
  "saved": false
}

## Check

- {"name":"Available asset is actually reviewed","passed":true,"evidence":"Three named text checks evaluated with concrete evidence, not a blanket no-tools refusal."}
- {"name":"Score never certifies uninspected launch dimensions","passed":true,"evidence":"100 is explicitly observed subset score with3/8coverage and INCOMPLETE verdict."}
- {"name":"Unknowns stay unknown and heuristics stay editorial","passed":true,"evidence":"No remembered safe-zone/spec rule, no image/phone/audio/event pass."}
- {"name":"Next action is bounded and owned","passed":true,"evidence":"Exact missing creative/spec/probe requested; no invented experiment budget or campaign action."}
