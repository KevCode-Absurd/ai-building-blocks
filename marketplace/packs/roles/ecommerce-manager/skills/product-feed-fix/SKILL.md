---
name: product-feed-fix
description: Turns Google Merchant Center or Meta catalogue diagnostics into a ranked fix list - each issue with the products affected, the cause in the data, the fix and where to make it (store data, feed rule or supplemental sheet) - plus title patterns per product type with before-and-after rows, a supplemental CSV using only the client's values, and feed rule steps for the named tool. Use when products are disapproved or limited, titles are SKU codes, GTINs or apparel attributes are missing, or before a big sale.
---

# Product feed fix

A feed problem is a data problem with a channel's name on it. This skill traces each issue to its cause in the product data, fixes it in the right place, and never fills gaps with guesses.

## When to use

- "Half our products are disapproved in Merchant Center."
- "Our Shopping titles are just SKU codes."
- Missing GTINs, brands, sizes, colours or gender on apparel.
- Before a peak sale, a new market, or switching feed tools.

## What you need

**Access:** level 1 for steps 1 to 7. Level 2 to save feed rules or a supplemental sheet without applying them. Level 3 to apply them to the fields and channels you named. Price and availability changes in feeds need a fresh yes.

- Diagnostics export from Merchant Center (product issues by type and count) and, if used, Meta Commerce Manager.
- The product feed or a store product export (id, title, description, brand, GTIN, MPN, category, variant options, image links).
- The feed tool in use (Shopify's Google & YouTube app, DataFeedWatch, Channable or another).
- Search terms that convert, from the ads account, if available.
- Target countries.

## Steps

1. **Count issues.** Group diagnostics by issue type: how many products each affects, and whether it blocks the product or only limits it.
2. **Find the cause in the rows.** For each issue, pull example rows and name the cause: a missing value, a wrong format, a mismatch with the product page (price, availability), or a policy point. Say which causes the export alone can't settle (for example, a policy decision only the client or Google can make).
3. **Check the required fields.** Against Google's specification: id, title, description, link, image link, availability, price; brand for new products; GTIN where one exists, MPN if not. For apparel in Brazil, France, Germany, Japan, the UK or the US: colour, size, gender, age group and item group ID. Bundles: is_bundle. Multipacks: multipack. Note the 500 by 500 pixel minimum image size enforced from 31 January 2027.
4. **Rank the fixes.** First, blocked products by sales; then limited products by sales; then everything else by count.
5. **Decide where each fix belongs.**
   - *Store data* (best): fixes reach every channel. Missing brands, sizes, GTINs from the supplier.
   - *Feed rule:* channel-specific changes, such as building a feed title from attributes.
   - *Supplemental sheet:* attributes the store can't hold, keyed on the exact product ID.
6. **Write title patterns per product type.** Brand, product type, key attribute, variant, with the key details in the first 70 characters and no promotional text. Show at least three before-and-after rows from the client's own feed. If AI writes titles, send them in `structured_title`.
7. **Build the supplemental CSV.** The ID column plus only the attributes being fixed, with values taken only from the client's data. Leave unknowns blank and list them. Never invent or reuse GTINs; private-label products send brand and MPN.
8. **Write feed rule steps** for the named tool, one rule per change, with the condition and the result.
9. **Apply (level 2 to save, level 3 to apply).** Apply in a test or draft channel first where the tool allows; then live. Log each rule and upload.
10. **Re-check after the next feed update.** Compare issue counts before and after. If disapprovals rise, or an account-level warning appears, stop and report.

## Checks

- IDs in the supplemental sheet match the feed exactly.
- No GTIN, brand or attribute invented; unknowns listed.
- Header names are valid for the channel.
- Title patterns keep product type and variant in the first 70 characters.
- Policy notes are general guidance for the client to check, not rulings.

## Output format

1. **Issue summary:** issue, products affected, blocked or limited, cause.
2. **Ranked fix list:** fix, products, where to fix, priority, owner.
3. **Title patterns** with before-and-after rows.
4. **Supplemental CSV** and a list of missing values with their likely source.
5. **Feed rule steps.**
6. **Change log** and a before-and-after count after the next update.

## Example of good output (short)

*Fernbrook Outdoor is a made-up clothing shop used only to show the format. Figures are invented for this example.*

**Issue summary (extract)**

| Issue | Products | Status | Cause |
|---|---|---|---|
| Missing gender | 318 | Limited in UK and US | Gender stored only in tags ("mens", "Women") |
| Missing size | 96 | Limited | Size held in variant title, not the size option |
| Invalid GTIN | 41 | Blocked | Supplier codes entered as GTINs |

**Fix list (top 3)**

1. Invalid GTIN, 41 products, blocked. Remove the supplier codes from the GTIN field in the store; ask the supplier for real GTINs; send brand and MPN meanwhile.
2. Missing gender, 318 products. Store data: add a gender metafield from tags (mens to male, women to female). Feed rule as a stopgap until done.
3. Missing size, 96 products. Store data: move size into the size option.

**Title pattern, jackets:** Brand + gender + product type + key feature + colour + size.

| Before | After |
|---|---|
| FB-JKT-2231-NVY-M | Fernbrook Men's Waterproof Hiking Jacket, Taped Seams, Navy, M |
