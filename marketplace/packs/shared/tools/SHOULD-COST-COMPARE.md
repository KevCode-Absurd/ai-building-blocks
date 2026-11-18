# Compare each quote against the right cost reference

Use `tools/should-cost-compare.mjs` before writing a should-cost summary that compares supplier quotes to material costs. Net material and scrap-adjusted material are different references. A quote can be above the first and below the second. Never turn that into “all quotes are below net material.”

Declare monetary amounts as decimal strings, not quantities. `netCost` is material cost per the declared accepted-good unit. `scrapFractionOfGrossInput` is a fraction of input lost: gross material cost = net cost / (1 − scrap fraction). A 20% input loss uses division by 0.80; it is not a 20% markup. No scrap recovery credit, final rejection allowance or labor adjustment is inferred.

Each material and quote record must state its currency, unit, product/specification basis reference, basis status and source reference. Use `confirmed`, `assumed` or `unknown` honestly. Unknown bases and unequal currencies, units or product references return `NOT_COMPARABLE` with no numerical comparison. Do not rename a kilogram, lot, different SKU or missing specification to make it match. Establish the conversion and specification outside this helper with evidence first. The helper does not authenticate declarations. An explicit assumption can support a conditional scenario, not a proven supplier cost floor.

Illustrative input for `context/comparison.json`; replace every value and source reference:

~~~json
{
  "schema": "should-cost-comparison-v1",
  "material": {
    "currency": "USD", "unit": "accepted unit", "basisRef": "example-spec-planning-assumption",
    "basisStatus": "assumed", "sourceRef": "Illustrative material sheet; monetary interpretation unverified",
    "netCost": "12", "scrapFractionOfGrossInput": "0.20"
  },
  "quotes": [
    {
      "id": "Quote A", "currency": "USD", "unit": "accepted unit", "basisRef": "example-spec-planning-assumption",
      "basisStatus": "assumed", "sourceRef": "Illustrative quote A", "amount": "11", "commercialScope": "Unverified factory-gate offer"
    },
    {
      "id": "Quote B", "currency": "USD", "unit": "accepted unit", "basisRef": "example-spec-planning-assumption",
      "basisStatus": "assumed", "sourceRef": "Illustrative quote B", "amount": "13", "commercialScope": "Unverified delivered offer"
    }
  ]
}
~~~

~~~sh
node tools/should-cost-compare.mjs context/comparison.json
~~~

The tool reads a bounded local input, emits JSON only, and binds the input SHA256. Save a new output artifact through the host without overwriting earlier evidence. It performs no network, provider or purchasing action. Input paths must stay within the current project; links and traversal are rejected. Exit 2 means at least one quote has an unresolved comparison basis, not that a lower-priced quote is wrong.

For the illustration, A is below both net material 12 and scrap-adjusted material 15; B is above net material but below scrap-adjusted material. Generated `narrative` strings describe each quote independently. Exact decimal fractions decide above/below/equal relationships; displayed recurring amounts are approximate. A negative `quoteMinusReference` means the quote is below that named reference, not a saving.

Use the named comparison results when writing headlines, tables and conclusions. Check each comparison word—below, above, equal, all, both—against every relevant row. Reconcile the final summary with the saved result after editing. The helper does not scan or certify the final prose.

Finish the actual costing job separately: labor, overhead, packaging, scrap recovery, process route, final acceptance, supplier margin versus markup, tooling and logistics need explicit assumptions or evidence. FOB, factory-gate and delivered offers include different scopes. Material-only comparisons are diagnostic flags; they do not establish equivalent quotes, full-cost coverage, fraud, a negotiation target or achieved savings. Obtain a same-specification and same-delivery-basis quote before committing.
