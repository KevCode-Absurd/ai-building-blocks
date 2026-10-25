# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat-only; no browsing",
  "request": "A brief for replacement container lids, under250words",
  "records": [
    {
      "id": "U1",
      "source": "Supplied forum excerpt",
      "text": "I want lids that fit. I kept old tubs because the last set warped."
    },
    {
      "id": "U1-repost",
      "source": "Copied into a second supplied document",
      "original": "U1",
      "text": "I want lids that fit. I kept old tubs because the last set warped."
    },
    {
      "id": "U2",
      "source": "Supplied support excerpt",
      "text": "I don't want another set that warps."
    }
  ],
  "productProof": "not supplied",
  "competitorClaims": "not supplied"
}

## Result

{
  "brief": "Job: When a previous lid set warped, I want lids that fit, so I can use the tubs I already have. What stops me: “the last set warped.”\nAwareness: Solution aware, provisionally: U1 and U2 compare replacement lids; no supplied sign they know this brand.\nMarket stage: UNKNOWN; no competitor claims supplied.\nPush: U1 “the last set warped.”\nPull: U1 “I want lids that fit.”\nFear: U2 “I don't want another set that warps.”\nHabit: U1 “I kept old tubs.”\nPriority: Address fit and the durability doubt with applicable proof. Do not intensify a problem both records already describe. Product fit and durability evidence are MISSING.\nWord bank: U1 “lids that fit”; “last set warped”; “kept old tubs”; U2 “another set”; “don't want”.\nTwo unique supplied buyer records support these observations, not a population rate. Priority is provisional until product evidence is available.",
  "wordCount": 143,
  "countRule": "Whitespace-delimited words; ledger and research questions excluded",
  "ledger": [
    {
      "canonical": "U1",
      "merged": "U1-repost",
      "reason": "Exact repost of same buyer statement"
    },
    {
      "canonical": "U2",
      "merged": null
    }
  ],
  "researchQuestions": [
    {
      "question": "Which supplied fit dimensions and durability tests apply to these lids?",
      "sourceType": "Product specification/test record",
      "changesDecision": "If no relevant durability proof, lead with supported fit only rather than a durability reassurance."
    },
    {
      "question": "What fit and durability promises do the nearest alternatives actually publish?",
      "sourceType": "Dated competitor pages supplied by owner or separately researched",
      "changesDecision": "A crowded demonstrated mechanism can change the provisional market-stage treatment."
    }
  ],
  "checksMissed": [
    "Product evidence missing",
    "Market stage unknown"
  ],
  "researchRun": false,
  "saved": false
}

## Check

- {"name":"Actual bounded brief returned","passed":true,"evidence":"Brief text is under250words, not merely an intake list."}
- {"name":"Quotes are traceable and repost deduped","passed":true,"evidence":"Three raw records become two unique records; exact snippets stay linked to U1/U2."}
- {"name":"Evidence determines provisional message","passed":true,"evidence":"Fear of repeat warping prompts proof; no unsupported durability promise or prevalence inference."}
- {"name":"Research limits and questions are meaningful","passed":true,"evidence":"Two targeted questions name decision-changing conditions; no browsing or invented competitor stage."}
