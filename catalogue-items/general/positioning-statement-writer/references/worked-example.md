# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat-only; no browser, file or research access",
  "product": {
    "name": "Nook bowls",
    "facts": [
      "Three polypropylene bowls nest together",
      "For buyers with small cupboards"
    ]
  },
  "rivals": [
    {
      "id": "R1",
      "name": "Stacker",
      "suppliedFact": "Three nesting polypropylene bowls",
      "reputation": "not supplied"
    },
    {
      "id": "R2",
      "name": "Classic",
      "suppliedFact": "Three ceramic bowls; nesting not specified",
      "reputation": "not supplied"
    }
  ],
  "buyerNote": "Small cupboard is the supplied target situation, not an interview finding.",
  "request": "One position and short team brief; do not invent an exclusive feature."
}

## Result

{
  "categories": [
    {
      "name": "Everyday kitchen bowls",
      "first": "UNKNOWN",
      "second": "UNKNOWN",
      "ourRung": "UNKNOWN"
    },
    {
      "name": "Bowls for small cupboards",
      "first": "UNKNOWN",
      "second": "UNKNOWN",
      "ourRung": "proposed niche"
    }
  ],
  "rivalIdeas": [
    {
      "id": "R1",
      "ownedIdea": "UNKNOWN; supplied product property is nesting"
    },
    {
      "id": "R2",
      "ownedIdea": "UNKNOWN; ceramic is a supplied property, not a verified reputation"
    }
  ],
  "verifiedTradeoff": "No comparative weakness established: Classic nesting is unknown; Stacker shares the nesting feature.",
  "attribute": "Compact storage",
  "dropped": [
    "Unproved market leadership",
    "Unproved superiority over ceramic",
    "Additional durability claim"
  ],
  "position": "Nesting bowls for small cupboards.",
  "substitutionCheck": "Stacker can truthfully use this line. Useful category fit is supported; distinct positioning remains unresolved.",
  "readerTest": "NOT RUN",
  "stretch": "Applies to the supplied three-bowl nesting set; no claim about cookware, all kitchens or another product.",
  "teamBrief": [
    "Buying situation: a small cupboard.",
    "Proposed position: compact storage through nesting.",
    "Fact: three bowls nest together.",
    "Do not say only, first, best, or that Classic cannot nest."
  ],
  "missing": [
    "A supplied like-for-like distinction from Stacker",
    "Actual buyer feedback if testing understanding"
  ],
  "saved": false
}

## Check

- {"name":"Actual position and brief delivered","passed":true,"evidence":"One concise position and four-line brief returned from existing facts."}
- {"name":"No invented rival weakness or leadership","passed":true,"evidence":"Shared nesting acknowledged; Classic unknown is not converted into non-nesting."}
- {"name":"Unresolved differentiation remains visible","passed":true,"evidence":"Rival substitution fails distinctness, and reader test is NOT RUN."}
- {"name":"Chat portability is honest","passed":true,"evidence":"Named inline result; no research, saved file or persistent installation claimed."}
