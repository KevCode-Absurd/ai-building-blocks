# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat first; synthetic named-file report trial after",
  "change": {
    "id": "CH1",
    "owner": "Offer owner",
    "source": "Approved change note24Oct",
    "scope": "Canvas tote T1,US market only",
    "before": 50,
    "after": 60,
    "currency": "USD",
    "effective": "2026-11-01T09:00:00Z"
  },
  "unchanged": {
    "bundle": "Two T1totes90USD",
    "UK": "UK offer unchanged"
  },
  "assets": [
    {
      "id": "A1",
      "version": "v1",
      "channel": "US ad",
      "text": "Tote50USD. Two for90USD. Save10%."
    },
    {
      "id": "P1",
      "version": "v3",
      "channel": "US page",
      "text": "One50USD;two90USD."
    },
    {
      "id": "UK1",
      "version": "v1",
      "channel": "UK email",
      "text": "Your UK tote offer is unchanged."
    },
    {
      "id": "IMG1",
      "version": "v2",
      "channel": "US artwork",
      "filenameOnly": "tote-final.png"
    },
    {
      "id": "H1",
      "version": "week42",
      "channel": "historic report",
      "text": "Sales at unit50USD"
    }
  ],
  "inventoryComplete": false
}

## Result

{
  "change": "CH1 approved future T1US50to60 at1Nov09UTC;bundle90 unchanged.",
  "impactMap": [
    {
      "id": "A1/v1",
      "status": "affected",
      "locations": [
        {
          "old": "Tote50USD",
          "new": "Tote60USD",
          "kind": "direct"
        },
        {
          "old": "Save10%",
          "new": "Save25% against two individual60USD totes",
          "kind": "derived",
          "calculation": "(2*60-90)/(2*60)=25%"
        }
      ],
      "timing": "Prospective v2only, not current before effective time"
    },
    {
      "id": "P1/v3",
      "status": "affected",
      "locations": [
        {
          "old": "One50USD",
          "new": "One60USD"
        }
      ]
    },
    {
      "id": "UK1/v1",
      "status": "inspected-unaffected",
      "evidence": "UK outside CH1USscope; supplied statement contains no changed US value"
    },
    {
      "id": "IMG1/v2",
      "status": "not inspected",
      "evidence": "Filename is not image text/preview"
    },
    {
      "id": "H1/week42",
      "status": "inspected-unaffected as historical",
      "evidence": "Keep unit50USD and version/date boundary; do not restate prior sales at60USD"
    }
  ],
  "underlyingDecisions": 1,
  "repairOrder": [
    "Plan canonical CH1 fact at effective time",
    "Stage A1/P1 smallest text and derived-saving repairs",
    "Obtain/inspect IMG1 and any unlisted assets",
    "Review destination and changed versions",
    "Owner coordinates consistent handoff at effective time"
  ],
  "releaseLimits": [
    "Manifest incomplete; no claim of whole-campaign coverage",
    "Partial rollout could show inconsistent prices: proposed coordinated hold/handoff until reviewed",
    "No live change, scheduler or account access used"
  ],
  "proposedPatch": "A1/v2prospective:Tote60USD.Two for90USD.Save25%against two individual totes. P1/v4prospective:One60USD;two90USD.",
  "history": "H1remains50USD; future comparisons must retain price/version boundary."
}

## Check

- {"name":"Real direct and derived output","passed":true,"evidence":"A1/P1 repairs identified;90against120 is25%, not a literal50-only search."}
- {"name":"Scope and unseen coverage respected","passed":true,"evidence":"UK outside scope, IMG1uninspected, incomplete manifest visible."}
- {"name":"Historical facts and timing preserved","passed":true,"evidence":"H1unchanged and proposed versions cannot activate early."}
- {"name":"File/chat boundaries survive useful work","passed":true,"evidence":"Actual report fixture saved/read in reports only; no source overwrite, live account edit or external hold claimed."}
