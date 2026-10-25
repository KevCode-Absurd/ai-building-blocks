# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat-only; tool available only for counting this synthetic review text",
  "scope": "Edit short page copy, preserve friendly voice; no guarantee invented",
  "version": "soap-tray-page-v1",
  "draft": "Your sink-side pal. $54. Never chips.",
  "approvedFacts": {
    "product": "Steel soap tray",
    "priceUSD": 49,
    "source": "Offer F1 confirmed24Oct",
    "noChipResult": "not supplied"
  },
  "prohibited": "No blanket no-chip guarantee or efficacy test supplied."
}

## Result

{
  "revisedVersion": "soap-tray-page-v2-review-draft",
  "annotatedDraft": "Your sink-side pal. $49. Never chips.",
  "readiness": "NOT READY: Never chips is unproved; quoted original remains explicitly flagged for a claims check, not approved for publication.",
  "locked": [
    "Approved49USD offer F1",
    "Product steel soap tray",
    "Friendly voice and argument order"
  ],
  "promise": "A steel soap tray; the durability promise in the draft is unproved.",
  "ledger": [
    {
      "old": "$54",
      "new": "$49",
      "reason": "Draft contradicts the approved current offer F1",
      "gain": "Correct live-price meaning restored; no discount invented"
    }
  ],
  "leftAsIs": [
    {
      "line": "Your sink-side pal.",
      "reason": "Intentional friendly voice, no concrete reader problem shown."
    }
  ],
  "forClaimsCheck": [
    {
      "quote": "Never chips.",
      "issue": "No supporting durability evidence supplied",
      "next": "Supply applicable result or owner-approved claim decision; do not invent an alternative result"
    }
  ],
  "measures": {
    "before": {
      "words": 6,
      "longestSentenceWords": 3
    },
    "after": {
      "words": 6,
      "longestSentenceWords": 3
    },
    "readingGrade": "NOT MEASURED: no syllable/grade calculation performed"
  },
  "checksMissed": [
    "Unproved durability promise",
    "Reading grade not measured"
  ],
  "saved": false,
  "finalRepairRetest": "Final tail now directs correcting a resolved draft error and logging its source; genuinely disputed/unproved claims remain for claims check. Price correction and no-chip gap follow separate branches."
}

## Check

- {"name":"Approved facts can correct a draft error","passed":true,"evidence":"Exact54to49 ledger row; original fact error is not protected as locked."}
- {"name":"Unproved claim is not secretly approved","passed":true,"evidence":"Never chips is explicitly NOT READY and routed, with no fabricated replacement benefit."}
- {"name":"Editing preserves voice and scope","passed":true,"evidence":"Only necessary price edit; friendly line retained, no structural rewrite or fake sale."}
- {"name":"Measures and repaired instructions are honest","passed":true,"evidence":"Word/longest counts computed locally; grade marked unmeasured; revised tail consistently supports both branches."}
