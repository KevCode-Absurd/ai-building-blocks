# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat first; synthetic named-file review-ledger trial after",
  "asOf": "2026-10-24T12:00:00Z",
  "timezone": "UTC",
  "ownerRule": "Only stated review/permission dates apply; no universal expiry interval",
  "evidence": [
    {
      "id": "E1",
      "claim": "Kept my desk dry",
      "type": "customer quote",
      "product": "MatM1",
      "permissionUntil": "2026-10-20",
      "uses": [
        "A1/v1",
        "P1/v2"
      ],
      "owner": "Mira",
      "exposure": "unknown"
    },
    {
      "id": "E2",
      "claim": "Absorbed20ml in a lab test",
      "type": "study",
      "product": "MatM1v1",
      "publication": "2021-05-01",
      "reviewDue": "2026-10-01",
      "expiry": null,
      "uses": [
        "A2/v1"
      ],
      "owner": "Noah",
      "exposure": "active supplied ad"
    },
    {
      "id": "E3",
      "claim": "Absorbed20ml",
      "type": "study",
      "product": "MatM1v1",
      "requestedUseProduct": "MatM2v2",
      "permission": "valid as supplied",
      "uses": [
        "A3/v1"
      ],
      "owner": "Mira",
      "exposure": "unknown"
    }
  ]
}

## Result

{
  "asOf": "2026-10-24T12:00:00Z UTC",
  "table": [
    {
      "id": "E1",
      "status": [
        "explicitly-expired use permission"
      ],
      "truth": "Not evaluated; permission date does not make the experience false",
      "affectedUses": [
        "A1/v1",
        "P1/v2"
      ],
      "exposure": "unknown",
      "action": "Propose removing/holding quote uses pending applicable renewal; no live action taken"
    },
    {
      "id": "E2",
      "status": [
        "review-due"
      ],
      "truth": "2021publication alone does not expire result; current scope/last-check unknown",
      "affectedUses": [
        "A2/v1"
      ],
      "exposure": "active as supplied",
      "action": "Owner verifies test applicability/version and records actual evidence before marking review complete"
    },
    {
      "id": "E3",
      "status": [
        "out-of-scope"
      ],
      "truth": "M1v1study cannot establish M2v2result just because permission exists",
      "affectedUses": [
        "A3/v1"
      ],
      "exposure": "unknown",
      "action": "Provide M2v2support or restrict use to actual supported product"
    }
  ],
  "queue": [
    {
      "job": "J1",
      "evidence": "E1",
      "owner": "Mira",
      "priority": "Urgent permission issue; unknown exposure must be checked",
      "uses": [
        "A1/v1",
        "P1/v2"
      ],
      "acceptance": "Actual renewed permission covering these uses or verified removal decision"
    },
    {
      "job": "J2",
      "evidence": "E2",
      "owner": "Noah",
      "priority": "Overdue review on supplied active use",
      "uses": [
        "A2/v1"
      ],
      "acceptance": "Reviewed test/product/conditions and actual review record, not date replacement alone"
    },
    {
      "job": "J3",
      "evidence": "E3",
      "owner": "Mira",
      "priority": "Product mismatch; exposure unknown",
      "uses": [
        "A3/v1"
      ],
      "acceptance": "Applicable M2v2evidence or corrected product-specific wording/use"
    }
  ],
  "underlyingIssues": 3,
  "linkedUses": 4,
  "notRun": [
    "Present-day source verification",
    "Legal/platform clearance",
    "Customer outreach",
    "Live hold/removal"
  ],
  "history": "Keep original E1/E2/E3 and date facts; append review jobs without overwriting source records."
}

## Check

- {"name":"Multiple substantive evidence decisions","passed":true,"evidence":"Expired permission, overdue review and wrong product are handled separately."}
- {"name":"No invented expiry or fresh check","passed":true,"evidence":"Old study is not automatically false/expired; no date-only renewal."}
- {"name":"Queue is useful and nonduplicative","passed":true,"evidence":"Three owner/acceptance jobs for four linked uses; unknown-exposure issues retained."}
- {"name":"File/chat action claims remain truthful","passed":true,"evidence":"Only a review-ledger fixture saved; no source overwrite, live hold, outreach or legal clearance."}
