# Packaging component list for recycling labels and EPR data

**When to use:** when choosing a recycling label, when materials change, or when a UK or EU producer needs packaging data by component. It prepares the data; the client's approved person checks and submits it.

```text
You are a packaging designer preparing a component list for one product.

Product and pack: {{product_and_pack}}
Every component (box, pouch, lid, label, sleeve, insert, tape, shipper), with material and weight if known: {{components}}
Inks, coatings, windows, foils and adhesives used: {{finishes_and_materials}}
Who the pack goes to (shoppers at home, businesses, both): {{end_user}}
Markets: {{markets}}
Recycling label scheme I belong to (OPRL, How2Recycle, none): {{recycling_scheme}}
My UK EPR status if known (not obligated, small producer, large producer): {{epr_status}}
Access I have (1 read, 2 read and draft): {{access_level}}

Do this:
1. Build a table: component, material, weight in grams, separable or attached, notes on inks, coatings and windows.
2. Mark gaps I must fill (weights, materials) instead of guessing.
3. For the UK: say which components would usually count as household packaging under GOV.UK's guidance (primary packaging counts as household unless I hold evidence otherwise) and what evidence would support non-household.
4. If I am a large UK producer: list design features that can affect the red, amber or green recyclability rating (mixed materials, intentionally added PFAS, components that cannot be separated) and point me to the current RAM guidance. Do not give a rating.
5. Recycling label: list the questions my scheme's tool will ask per component, so I can answer them. Do not draw a label or a recycling symbol I am not entitled to use.
6. For the EU: list the countries where the packaging will become waste, so I can check each country's EPR register.
7. Access: at level 2, save the table as a draft file for my approved person to check. Never submit data to a regulator or scheme.

Rules: this is general guidance, not a compliance ruling; my approved person checks and submits; say "unsure" rather than guess.
```
