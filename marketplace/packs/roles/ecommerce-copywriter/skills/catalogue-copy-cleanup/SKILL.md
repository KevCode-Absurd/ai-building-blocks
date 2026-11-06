---
name: catalogue-copy-cleanup
description: Audits the copy across a whole catalogue export - duplicate and near-duplicate descriptions, supplier text pasted in, missing fields, mixed naming and units, titles over platform limits, keyword-stuffed or empty alt text, AI-sounding filler and risky claims - then ranks fixes by traffic and sales, writes naming rules, and fixes the first batch. Use when someone says their product copy is a mess, after a supplier import or a bulk AI rewrite, before moving to a new platform or feed, or for a regular catalogue copy review.
---

# Catalogue copy clean-up

Catalogues decay. Products arrive from suppliers with their text, someone runs a bulk AI rewrite, three people name colours three ways, and nobody checks titles against feed limits. This skill finds the mess at scale, fixes what matters first, and leaves rules so it doesn't come back.

## When to use

- "Our product copy is all over the place."
- After a supplier import, a platform move, or a bulk AI rewrite.
- Before sending the catalogue to Google Shopping, Meta or a marketplace.
- A monthly or quarterly copy review.

## What you need

**Access:** level 1 to read the catalogue export and reports. Level 2 to prepare a corrected import sheet or draft products. Level 3 to publish fixes on the products and fields you named, within your limits. Deleting or merging products needs a fresh yes every time.

- A full product export (CSV) with handle, title, body or description, type, vendor, tags, variant options, SEO title, meta description and image alt text.
- Sales and page views by product for the last 90 days, if available.
- Feed diagnostics from Google Merchant Center, if the catalogue goes to Google.
- The store's filter names and values.

## Steps

1. **Profile the export.** Count products, variants and empty fields per column. Note which columns the store's filters and feeds depend on.
2. **Find duplicates and supplier text.** Compare descriptions across products: flag exact and near-exact matches (the same paragraph with one word changed). Flag text that looks like supplier copy (spec-sheet phrasing, model codes in prose, the supplier's brand voice). If the client can, check a sample of sentences against other shops' pages for the same product.
3. **Find naming and unit drift.** List every value used for colour, size, material and units ("Navy", "navy blue", "NVY"; "cm" and "in" mixed). Propose one allowed list and map each old value to it. Agree it with the ecommerce manager, who owns the filters.
4. **Check titles against limits.** For each surface, flag titles over the limit or with the key details past the visible part: Google feed titles over 150 characters or with brand, type and variant past the first 70; SEO titles over 60 to 70 characters; titles carrying prices, "sale" or shipping text.
5. **Check alt text.** Flag empty alt on informative images, alt text that repeats the file name, and keyword lists.
6. **Spot AI filler.** Flag stock openings ("Discover the perfect...", "Introducing the ultimate..."), padding in threes, and any fact that isn't in a fact sheet. Mark these for rewrite from facts.
7. **Flag risky claims.** Pull every origin, green, health, safety, free-from, review and price claim into a list for the claims-and-label-check skill. Don't fix them here.
8. **Rank the fixes.** Score each product: views or sales in the last 90 days (high, medium, low) against the size of the problem (blocking a feed, misleading, weak). Fix high-traffic misleading or blocking issues first, then high-traffic weak copy, then the long tail.
9. **Write the rules.** A one-page naming and style guide: title patterns per product type, allowed values, units, how to write bullets, alt text rules, and the claims that always need checking.
10. **Fix the first batch.** Rewrite the top 10 to 20 products with the product-page-copy skill, and give a corrected import sheet for the naming fixes.
11. **Log it.** List every change: product, field, old value, new value, date. At level 3, log each published change and report it.

## Checks

- Counts are shown, with the formulas or filters used.
- Every proposed allowed value maps all the old values.
- The ranking uses real traffic or sales data where it exists, and says so when it doesn't.
- Claims are listed for checking, not rewritten on a guess.
- The import sheet keeps the store's exact column names and handles.

## Output format

1. **Health summary:** products, variants, empty fields by column, duplicates, titles over limits, alt text gaps, risky claims.
2. **Value map:** attribute, old value, new value.
3. **Ranked fix list:** product, problem, traffic band, fix, priority.
4. **Naming and style rules** (one page).
5. **First batch** of rewritten products and a **corrected import sheet**.
6. **Change log.**

## Example of good output (short)

*Copper Kettle Kitchenware is a made-up shop used only to show the format. Figures are invented for this example.*

**Health summary:** 640 products, 1,912 variants. 212 descriptions match another product's text word for word (33%). 148 Google feed titles put the variant past character 70. 391 images have empty alt text. 14 products say "non-toxic" with no evidence on file.

**Value map (extract)**

| Attribute | Old values | New value |
|---|---|---|
| Colour | Copper, copper finish, COP, Rose gold copper | Copper |
| Capacity | 1.5L, 1.5 litre, 1500ml | 1.5 l |

**Ranked fix list (top 3)**

| Product | Problem | Traffic | Fix | Priority |
|---|---|---|---|---|
| Copper stovetop kettle | "Non-toxic" claim, no evidence | High | Hold claim; send to claims check | 1 |
| Enamel casserole, 24 cm | Same description as 26 cm and 28 cm sizes | High | Rewrite from fact sheet; lead with capacity and serving size | 2 |
| Steel saucepan set | Feed title 168 characters, variant at the end | Medium | "Copper Kettle Steel Saucepan Set, 3 Pieces, 16/18/20 cm" | 3 |

**Rule (extract):** Title pattern for cookware: Brand + item + key spec + size. Capacity in litres with a space ("1.5 l"). Never "non-toxic", "chemical-free" or "eco" without the evidence in the claims log.
