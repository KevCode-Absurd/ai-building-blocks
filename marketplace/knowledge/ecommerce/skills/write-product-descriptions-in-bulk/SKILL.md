---
name: write-product-descriptions-in-bulk
description: "Writes product descriptions for a whole catalogue from one template per product type: a fixed structure (summary, benefits, details table, use and care, what is in the box, fit or suitability), a voice sample bank, and a fact sheet built from the Shopify export, so every description is consistent and every claim comes from product data. Flags each product where a needed fact is missing instead of guessing, scores the batch for duplicates and machine tells, and returns an import-ready CSV for review. Use when a catalogue has supplier or empty descriptions, after a rebrand, or when many products were added at once."
---

# Product descriptions for the whole catalogue

**You get:** one description template per product type, a voice sample bank, and descriptions for every product in a Shopify import CSV (Handle and Body (HTML)), with a flag sheet listing each product held back for missing facts, ready for spot checks and the client's approval before import.

## When to use

- Descriptions were pasted from suppliers or are empty.
- The catalogue grew fast and each page sounds different.
- A rebrand changed the voice and 50 or more products need rewriting.
- Search Console shows thin or duplicate product pages.

## Not for

- One high-traffic product page written in full with proof and FAQ: `write-product-page-copy`.
- Product titles for store and marketplaces: `write-product-titles-for-store-and-marketplaces`.
- Image alt text: `write-image-alt-text-at-scale`.
- Duplicate and thin pages as an SEO project: `fix-duplicate-and-thin-pages`.
- Rewriting copy that already reads as machine-made: `machine-copy-scrubber` (also used in step 8 here).

## What you need

Required (read access, level 1):

1. **Shopify products export (CSV)**: Handle, Title, Body (HTML), Vendor, Product Category, Type, Tags, Option1 to Option3 names and values, Variant SKU, Variant Price, Variant Grams, Status, and any metafields used for specs (material, dimensions, ingredients, care).
2. **Supplier spec sheets** or the store's own product spec files.
3. **Five to ten pieces of the brand's best existing copy** (emails, ads, the about page) for the voice bank.
4. **Reviews export** for the top 20 products by sales.

Optional: return reasons by product, Search Console queries by product URL, the claims sheet from `product-claims-profile`.

If specs are missing for many products, run the fact sheet step first and hand the gap list to the client before writing. Importing the CSV needs draft access (level 2) on a duplicated set or with products in draft; the client approves before anything goes live.

## Before you start: the gates

1. **Facts exist.** For each product type, decide the required facts (step 2). A product missing any required fact is not written; it goes on the flag sheet. No exceptions.
2. **Claims are allowed.** Category claim rules apply: cosmetics, supplements, food, baby and health products may only carry approved claims; India listings show MRP, net quantity, country of origin and manufacturer or importer details under Legal Metrology rules for packaged goods. Fail: the product waits for the claims sheet.
3. **Scale with care.** Machine-written pages published in bulk can spike then crash in search [AEO-0018], and fully AI-written pages are rare among top-ranked and cited pages [AEO-0033]. Every batch is human-edited and spot-checked before import.

## Steps

1. **Group by product type.** Sort the export by Type (or Product Category). Each group with 5 or more products gets its own template; small groups share the nearest one.
2. **Set required facts per type.** For example apparel: material, fit, sizes, measurements, care, origin. Skincare: skin type, key ingredients with function, size, how to use, warnings. Home: dimensions, material, weight, care, what is in the box. Build a fact sheet: one row per product, one column per fact, filled from the export, metafields and spec sheets. Mark each empty required cell.
3. **Write the template.** Fixed blocks in order, each with a word budget:
   - Summary: 40 to 80 words, what it is, who it is for, the main result, in buyer words.
   - Three benefit lines: result first, then the feature that causes it.
   - Details table: the required facts.
   - How to use or care: 2 to 4 steps.
   - What is in the box.
   - Fit or suitability: who it suits and who should choose another product.
   One practitioner's product page template runs summary, features and benefits, a specs table, a longer description, FAQs and reviews [SEO-0007]; for bulk work keep the long description only for top sellers.
4. **Build the voice bank.** Put 5 real brand lines beside 5 lines in the template. Write 10 do and avoid word pairs from the brand's own copy. Take benefit phrases from reviews by hand [AVT-0007]. AI may only rearrange this approved language, not invent new claims [ORG-0025].
5. **Write a pilot of 10.** Pick 10 products across types, including the top 3 sellers. Write them, then have the client approve the template and voice before the rest. Change the template, not each product.
6. **Write the batch.** Fill each template only from the fact sheet row. Keep sentences short. Vary the summary's opening by the product's main result so pages are not near-copies. Where one product sells to different buyers, write the summary for the biggest buyer group; angle-specific pages are a separate job [LPG-0064].
7. **Put text in the page.** Descriptions go into Body (HTML) or metafields rendered in the theme as plain HTML, not loaded by an app script, so search and AI crawlers can read them [AEO-0002].
8. **Check the batch.** Run three checks: a near-duplicate check (any two descriptions sharing more than about half their sentences get rewritten, practitioner default), a machine-tell scan with `machine-copy-scrubber`, and a fact check of 10% of products (minimum 10) against spec sheets. One fact error in the sample means the whole type is rechecked.
9. **India and US notes.** India: show prices GST-inclusive in copy that mentions price, keep Legal Metrology declarations in their own block, and add Hindi or regional language descriptions only for products whose buyers write reviews in that language. US: no "Made in USA" or health claims beyond the claims sheet.
10. **Hand over the import file and flags.** The CSV holds only approved products. The flag sheet lists every held product with the missing fact and who should supply it.

## Checks before you hand it over

- Every product type has a template with required facts and word budgets.
- No description contains a fact not present in its fact sheet row.
- Every product missing a required fact is on the flag sheet, not in the CSV.
- The 10-product pilot was approved before the batch.
- No two descriptions share more than about half their sentences.
- A 10% fact sample passed against spec sheets.
- Text renders as HTML in the page, not via script.
- India listings carry the Legal Metrology block.

## Output

**Summary (one screen):** products in scope, types and templates, products written, products flagged and why, sample check results, and the import plan.

**Template sheet (per type):** block, word budget, required facts, example.

**Voice bank:** 5 brand lines, 5 template lines, 10 do and avoid pairs.

**Fact sheet:**

| Handle | Type | Required fact 1 | Fact 2 | Fact 3 | Source | Missing |
|---|---|---|---|---|---|---|

**Import CSV:** Handle, Body (HTML) (and metafield columns if used).

**Flag sheet:**

| Handle | Title | Missing fact | Who supplies it | Due date |
|---|---|---|---|---|

**To confirm:** template approval, claims awaiting sign-off.

## Common mistakes

- **Guessing missing facts.** Gate 1 moves those products to the flag sheet.
- **One template for every product.** Step 1 makes one per type.
- **Voice drift across 500 pages.** Steps 4 and 5 lock the voice on a pilot.
- **Near-identical pages.** Step 8 checks duplicates.
- **Publishing an unedited machine batch.** Gate 3 and step 8 require human checks.
- **Descriptions in an app widget.** Step 7 keeps text in the HTML.

## Sources

- AEO-0018: bulk AI pages spike then crash.
- AEO-0033: few top-ranked or cited pages are fully AI-generated.
- SEO-0007: product page template order.
- AVT-0007: copy benefit words from reviews by hand.
- ORG-0025: AI remixes only approved language.
- LPG-0064: one angle per page when buyers differ.
- AEO-0002: script-loaded text is invisible to many AI crawlers.

What makes this skill ours: each description is filled only from a fact sheet row, so missing facts become a flag list instead of invented copy; templates are set per product type with word budgets; a 10-product pilot locks the voice before the batch; and duplicate, machine-tell and fact checks run before anything is imported.
