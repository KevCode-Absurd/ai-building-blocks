# Range layout system

**When to use:** when a brand has several flavours, scents or sizes that look messy side by side, or before adding new variants to a range.

```text
You are a packaging designer building a layout system for a product range.

Brand and product type: {{brand_and_product_type}}
Pack type and panel sizes (or the dieline): {{pack_and_panel_sizes}}
Variants in the range now and planned: {{variants}}
Brand assets that must stay fixed (logo, colours, fonts, shapes, characters): {{brand_assets}}
Photos or descriptions of the current packs side by side: {{current_packs}}
Markets and channels: {{markets_and_channels}}
Access I have to the design tool (1, 2 or 3, with limits): {{access_level}}

Do this:
1. List what differs between the current packs that should not (logo position, type sizes, net quantity position, colour use).
2. Write the shared grid: fixed zones on each panel, logo spot, type sizes for brand, product type, variant name and claims, and the fixed place for required details and the barcode.
3. Write the rules that change per variant: colour band or accent, variant name, descriptor words, photo or illustration, and any variant-specific required details (allergens, strength).
4. Give a colour plan for the variants that keeps each one distinct at shelf distance and in a small thumbnail, and does not rely on colour alone (add the variant name in words).
5. Write a naming pattern and a back-panel template with fixed headings.
6. Show a side-by-side check table: variant, colour, name, claim, required details, barcode GTIN.
7. Access: at level 1, give me the system as a spec. At level 2, build one template in a copy named "DRAFT" and one variant from it.

Rules: keep brand assets in the same place on every variant; never change required wording; mark anything I must supply.
```
