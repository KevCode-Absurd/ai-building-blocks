# Fictional worked example

This is an offline practice case, not a live service result.

## Input

{
  "mode": "chat-only first; authorized synthetic report-file trial separately",
  "request": "Build a compact brand packet and give a factual ad-writing slice",
  "sources": [
    {
      "id": "B1",
      "kind": "business fact",
      "date": "2026-10-24",
      "text": "Nori500ml steel bottle"
    },
    {
      "id": "O1",
      "kind": "older website excerpt",
      "date": "2026-10-20",
      "text": "24USD"
    },
    {
      "id": "O2",
      "kind": "owner confirmation in current task",
      "date": "2026-10-24",
      "text": "Current price26USD,no sale; old24USD is superseded"
    },
    {
      "id": "T1",
      "kind": "reusable writing lesson",
      "text": "Example:10,000customers love our product"
    }
  ],
  "unavailable": [
    "Live site access",
    "Buyer records",
    "Actual brand marks"
  ]
}

## Result

{
  "packet": {
    "00-start-here.md": "# Nori bottle\n[confirmed B1]500ml steel bottle,26USD current offer. [inferred] Buyer awareness and main buyer situation are not established. [unknown] Gap between site and buyer language cannot be diagnosed without buyer records. Use only approved facts in dependent copy. Load offers.md and proof-and-claims.md for the requested ad. Keep old24USD as superseded history. This inline packet must be saved or attached again for another chat.",
    "business.md": "[confirmed B1]Nori sells a500ml steel bottle. [unknown]Stage, positioning, story and pronunciation. No exclusivity claim established.",
    "offers.md": "[confirmed O2,owner24Oct]Current Nori500ml price26USD, no sale. [superseded O1,website20Oct]Previous displayed24USD; owner resolved current price as26USD. [unknown]Shipping, billing beyond single purchase, cancellation and returns terms.",
    "customers.md": "[unknown]No buyer quotes supplied. [inferred]A person considering a500ml bottle is a provisional buying situation, not a measured profile. Open question: provide actual buyer language before ranking fears or shares.",
    "proof-and-claims.md": "[approved B1]500ml,steel; product sheet24Oct. [approved O2]26USD,no sale; owner offer confirmation24Oct. [pending]No performance result provided. [unknown]Guarantee and testimonials. Teaching example “10,000customers” is not brand proof and is excluded.",
    "voice-and-look.md": "[unknown]Voice examples,colour codes,fonts,logo files and real product photos. Do not invent fonts or a substitute logo. No voice rule inferred from the unrelated lesson.",
    "market.md": "[unknown]No competitor records supplied. No confirmed category leadership, price ranking or market gap. Alternatives cannot be ranked from the current packet.",
    "log.md": "2026-10-24: O2 owner resolves current offer26USD,no sale, superseding O1 displayed24USD from20Oct. Canonical value in offers.md; affected next work: supplied ad price. Preserve O1 as historical. Checkpoint: eight inline sections complete with explicit gaps; no live website read or saved-file claim. Next action: use approved26USD/500ml/steel slice or supply buyer/visual evidence."
  },
  "writingSlice": {
    "product": "Nori500ml steel bottle",
    "price": "26USD",
    "sale": "none",
    "sources": [
      "B1",
      "O2"
    ],
    "notAllowed": [
      "T1customer count",
      "Old24USD as current",
      "Unproved performance,shipping or guarantee"
    ],
    "actualAd": "Nori500ml steel bottle.26USD. View the bottle."
  },
  "sourceIndex": [
    {
      "id": "B1",
      "kind": "business fact",
      "date": "2026-10-24"
    },
    {
      "id": "O1",
      "kind": "superseded offer",
      "date": "2026-10-20"
    },
    {
      "id": "O2",
      "kind": "owner-resolved current offer",
      "date": "2026-10-24"
    },
    {
      "id": "T1",
      "kind": "guidance/example",
      "date": "unknown"
    }
  ],
  "chatSaved": false,
  "handoff": "Paste/attach the named sections to another AI; no cross-chat memory or automatic sync promised.",
  "fileTrial": "The same eight section strings are written only to independent-skill-fixtures/brand-packet, a synthetic authorized review destination; existence/readback hashes recorded separately.",
  "checksMissed": [
    "Buyer profiles not grounded",
    "Visual assets unknown",
    "Market and live page not inspected"
  ]
}

## Check

- {"name":"Eight actual named sections plus useful slice","passed":true,"evidence":"A complete compact packet with explicit gaps and a factual ad is returned."}
- {"name":"Conflict resolution does not erase history","passed":true,"evidence":"O2 is prior owner confirmation; current26USD selected, old24USD remains marked superseded in offers/log."}
- {"name":"Guidance is not product evidence","passed":true,"evidence":"T1count excluded and no fake testimonial, market ownership or fonts created."}
- {"name":"Chat and file capability claims differ accurately","passed":true,"evidence":"Chat says unsaved; synthetic authorized file run creates and reads actual eight files without pretending installation or autosync."}
