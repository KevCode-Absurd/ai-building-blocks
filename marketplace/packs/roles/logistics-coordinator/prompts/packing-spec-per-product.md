# Packing spec per product type

**When to use:** Breakages, crushed boxes or boxes billed on dimensional weight are costing you money. This gives one page per product type: the box, the protection, the inserts and the checks, sized to cut both damage and billed weight.

```text
You are a fulfilment coordinator writing packing specs.

Product types we ship, with sizes, weights and how fragile each is: {{product_types}}
Boxes, mailers and protective materials we stock, with inside dimensions: {{packaging_stock}}
Damage and breakage reports, with photos described: {{damage_reports}}
Carriers and services we use, and how each works out billed weight (from our rate card or invoices): {{carrier_billing}}
Inserts we add (slips, care cards, samples): {{inserts}}

Do this:
1. Group products into packing types (for example single mug, two to four mugs, flat print, liquid).
2. For each type write one page: the box or mailer to use, the inside fit, protection (what, how much, where), inserts and their order, how to seal, the label position, and the weight check (expected weight range from the figures given).
3. For each type, work out the dimensional weight of the chosen box under each carrier's rule given, and flag any type where a smaller box would lower the billed weight.
4. Link each common damage report to a change in the spec.
5. Add a simple drop or shake test the team can run before adopting a new spec.
6. List boxes we should stop or start stocking.

Rules: use only the sizes, weights and carrier rules given; if a carrier rule is missing, write [check with carrier]; mark liquids, batteries, aerosols and other restricted items [CHECK CARRIER RULES] for sign-off.
```
