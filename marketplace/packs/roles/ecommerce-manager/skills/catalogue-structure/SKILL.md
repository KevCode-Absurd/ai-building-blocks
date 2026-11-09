---
name: catalogue-structure
description: Designs or repairs an online store's catalogue - a category tree in shoppers' words, the attributes each category needs with allowed values, which attributes become filters and in what order, variant and tag rules, a product import template, and a map of current products to the new structure with missing data listed. Use when filters show messy or duplicate values, shoppers can't narrow down, products sit in several categories, variants are split or mixed up, or before a platform move or a new range.
---

# Catalogue structure

Shoppers find products by the dimensions they care about: use, size, room, fit, brand, style. A good catalogue is built on those dimensions, with clean values on every product. This skill builds the structure and the data rules, then maps the current products onto it.

## When to use

- "Our filters are a mess."
- "Shoppers can't find things; site search is doing all the work."
- Products appear in several categories, or variants are split across separate products.
- Before moving platforms, adding a large range, or sending the catalogue to Google and Meta.

## What you need

**Access:** level 1 for steps 1 to 8. Level 2 to load the new structure into draft products, hidden collections or an import sheet. Level 3 to apply it live, within your limits. Bulk category changes where the store uses categories for tax, and any deletion or merge, need a fresh yes.

- A full product export with all columns (type, vendor, tags, options, metafields).
- Current categories or collections and the menu.
- Site search terms and, if possible, filter usage (from analytics or the search app).
- Any rules: brands kept separate, products that must sit together.

## Steps

1. **List product types and how shoppers look for them.** From the export and site search terms, write each product type and the two or three dimensions shoppers use to choose (for example, sofas: seats, fabric, colour, width).
2. **Build the category tree.** Shoppers' words for names, one clear home per product, and a shallow structure. Write the rule for edge cases ("Sofa beds sit under Sofas; they appear in Beds through a collection"). Use collections or tags for cross-cutting groups (gifts, sale, new in), not extra categories.
3. **Assign standard categories.** On Shopify, map each type to one category in the Standard Product Taxonomy, so category attributes, channel categories and tax rules follow. Flag any change that alters a tax category for the client to approve.
4. **Choose attributes per category.** List what buyers compare. Mark each as required or optional, and as a filter or not. Order filters by how often shoppers use that dimension. Keep within the platform's limits (Shopify Search & Discovery: 25 filters per store; collections over 5,000 products show no filters).
5. **Write allowed values.** One list per attribute, in shoppers' words, with units fixed ("cm", not a mix). Map every current value to an allowed one, merging spelling, case and near-duplicates. Where a merge must wait, group values in the filter app as a stopgap.
6. **Set variant rules.** Same product in different sizes or colours: variants of one product, sharing one group ID in the store and in feeds. Different use, material or price point: separate products. Write the naming rule for variants.
7. **Set tag rules.** Each tag has one job (a collection rule, a badge, a filter) and a fixed spelling. Retire tags with no job.
8. **Check search and crawling.** Category pages should link to all their products. Decide which filtered views should be real collections that can rank (for example, "Grey corner sofas") and keep other filtered URLs out of crawling, following Google's faceted navigation guidance.
9. **Map current products.** Place each product in the tree with its attribute values. List products missing required values, and where each missing value could come from (label, supplier, client).
10. **Write the import template.** Column by column: field, required or optional, format, allowed values, example row. Add a one-page guide to keep the catalogue tidy.
11. **Apply in order (level 2 or 3).** Values first, then filters, then menu changes, so nothing vanishes mid-change. Log every change with the old value.

## Checks

- Every product has one home category and a complete set of required attributes, or is on the missing-data list.
- No filter has values missing on products that should match.
- Every old value maps to an allowed value.
- Variants share a group ID; separate products don't.
- Changes that affect tax or delete data are flagged for approval.
- No values invented to fill gaps.

## Output format

1. **Category tree** (indented outline) with edge-case rules.
2. **Attribute dictionary:** category, attribute, required, filter (yes or no), filter order, allowed values, unit.
3. **Value map:** attribute, old value, new value.
4. **Variant and tag rules.**
5. **Product map** and **missing data list.**
6. **Import template** and keep-it-tidy guide.
7. **Change plan** in order, with what needs approval.

## Example of good output (short)

*Illustrative structure, not a real business: a furniture shop. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

**Category tree (extract)**

- Sofas
  - Two-seat sofas
  - Three-seat sofas
  - Corner sofas
  - Sofa beds (also shown in Beds > Guest beds, through a collection)

**Attribute dictionary (extract)**

| Category | Attribute | Required | Filter | Order | Allowed values |
|---|---|---|---|---|---|
| Sofas | Seats | Yes | Yes | 1 | 2, 3, 4, Corner |
| Sofas | Upholstery | Yes | Yes | 2 | Fabric, Velvet, Leather, Faux leather |
| Sofas | Width | Yes | Yes | 3 | Under 180 cm, 180 to 220 cm, Over 220 cm |
| Sofas | Colour | Yes | Yes | 4 | Grey, Green, Blue, Natural, Brown, Pink |

**Value map (extract):** "Charcoal", "grey", "Graphite", "Slate" become "Grey" in the Colour filter; the exact shade stays in the variant name.

**Missing data:** 34 of 212 sofas have no width value; source: supplier spec sheets (requested).

**Change plan:** 1. Load allowed values and widths (import sheet, level 2). 2. Client approves. 3. Publish filters (level 3). 4. Update the menu. 5. Check every collection with each filter applied.
