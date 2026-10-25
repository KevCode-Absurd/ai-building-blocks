# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat-only",
  "version": "rain-pouch-ad-v3",
  "copy": "Waterproof in every storm. $28.",
  "proof": [
    {
      "id": "E1",
      "source": "Owner-approved supplier sheet",
      "date": "2026-10-01",
      "product": "Rain pouch R1",
      "wording": "Resists light splashes; not tested for immersion or heavy rain"
    },
    {
      "id": "E2",
      "source": "Approved offer record",
      "date": "2026-10-24",
      "product": "Rain pouch R1",
      "priceUSD": 28
    },
    {
      "id": "RIVAL1",
      "source": "Review of another brand",
      "quote": "Stayed dry in a storm",
      "permission": "not supplied"
    }
  ]
}

## Result

{
  "version": "rain-pouch-ad-v3",
  "claims": [
    {
      "id": "C1",
      "trigger": "Waterproof in every storm",
      "assertion": "Water exclusion in all storms",
      "evidence": "E1",
      "scope": "R1; light splashes only",
      "date": "2026-10-01",
      "distance": "supplied sheet, not adjacent in ad",
      "verdict": "outruns evidence",
      "rejectedEvidence": "RIVAL1 is not this product and quote permission is unknown"
    },
    {
      "id": "C2",
      "trigger": "$28",
      "assertion": "R1 price is28USD",
      "evidence": "E2",
      "scope": "R1 approved offer as of24Oct",
      "date": "2026-10-24",
      "distance": "offer value appears directly in ad",
      "verdict": "matched"
    }
  ],
  "uniqueClaims": 2,
  "evaluated": 2,
  "total": 2,
  "matched": 1,
  "score": 50,
  "coverage": "2/2",
  "rewrittenCopy": "Resists light splashes. $28.",
  "rewriteStatus": "Provisional match to supplied E1/E2; no new test or clearance performed.",
  "reasons": {
    "better": "MISSING: comparative reason to choose this product",
    "true": "E1 supports only the narrower splash statement; source can be placed beside it",
    "actToday": "MISSING: no real deadline or limit supplied"
  },
  "wornOutMarks": [],
  "legalPlatformClearance": "NOT CHECKED",
  "saved": false
}

## Check

- {"name":"Explicit and implied duplicates count once","passed":true,"evidence":"Waterproof and every storm describe one disputed assertion; price is the second."}
- {"name":"Evidence supports exact product and scope","passed":true,"evidence":"Rival testimonial rejected and no owner-approval-as-proof substitution."}
- {"name":"Score and proposed fix distinguish original from future state","passed":true,"evidence":"1/2 matched =50%; rewrite is provisional, not a rescored production pass."}
- {"name":"Useful bounded replacement","passed":true,"evidence":"Actual splash copy returned; no fake proof, urgency or legal clearance."}
