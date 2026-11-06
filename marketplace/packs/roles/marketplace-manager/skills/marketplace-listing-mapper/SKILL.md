---
name: marketplace-listing-mapper
description: Maps a brand's product data to a marketplace's own fields (eBay item specifics, Walmart attributes, bol and Zalando product data), builds a field map that shows required fields filled or missing, fills the marketplace's bulk upload template, writes titles and key features to each marketplace's rules from real data only, adds EU product safety (GPSR) details, checks lengths, allowed values, duplicates and blanks, and scores existing listings with a fix list. Use when adding eBay, Walmart or a European marketplace to an existing store, cleaning up listings with missing fields, or preparing a bulk upload.
---

# Marketplace listing mapper

Each marketplace wants the same product described its own way. Missing required fields hide products or block uploads, and guessed details cause returns and claims. The work is mapping first, writing second, and never inventing.

## When to use

- "We want our Shopify range on eBay and Walmart."
- "Our Walmart listings are missing details. What do we fix first?"
- Filling a bulk upload template for 20 or 2,000 products.
- EU listings blocked for missing manufacturer or responsible person details.

## What you need

**Access:** level 1 for steps 1 to 6. Level 2 to save draft or inactive listings or a filled bulk sheet in the marketplace. Level 3 to publish listings and upload approved sheets within the client's limits. A first listing on a new marketplace or in a new country needs a fresh yes.

- Product data export with every column: titles, descriptions, variants, identifiers (GTIN, UPC, EAN, MPN), brand, sizes, materials, weights, images, condition, cost and price.
- The marketplace's current bulk template or category requirements, downloaded from the seller account (they change by category and over time).
- Current listing export and any listing quality or error report.
- For EU marketplaces: manufacturer name, postal and electronic address, and the EU responsible person for each product.
- Photos, and the condition notes for used or refurbished items.

## Steps

1. **Pick the category** on each marketplace for each product type. Category decides which attributes are required.
2. **Build the field map.** For each marketplace: client column, marketplace field, required or optional, allowed values, filled or missing. Count missing required fields by product.
3. **Check identifiers.** Each variant needs its own identifier where the marketplace asks for one. Walmart asks for GTINs or UPCs from GS1 company prefixes. Never invent, reuse or "borrow" an identifier; list products without one and ask.
4. **Write titles to each marketplace's rules:** brand, product type, key specs, then size or colour. No promotional words. eBay titles take no HTML. Check the length limit in the marketplace's own form or template and show the character count next to each title.
5. **Fill attributes and item specifics** from the data. If a value is a reasonable inference (for example, colour from the image), mark it "to confirm" in a separate column; never publish it unconfirmed.
6. **Write descriptions and key features** for a phone screen: what it is, who it's for, the specs buyers compare, what's in the box, care or compatibility notes, and honest condition notes for used or refurbished items. No claims the data doesn't support.
7. **Add EU safety details** where the product is sold in the EU: manufacturer name, postal and electronic address, the EU responsible person, and any warnings. bol has blocked new listings without manufacturer details since 5 March 2026 and has required an EU responsible person since 1 April 2026.
8. **Run sheet checks:** lengths, allowed values, duplicate SKUs or identifiers, blank required cells, image links that load, prices within floors.
9. **Score existing listings:** title, required fields, images, price competitiveness, condition, and errors. Rank fixes by sales at stake, then by count.
10. **Upload (level 2 or 3).** Save as drafts or inactive first; publish within limits; read the marketplace's processing report; fix rejections; log every upload.

## Checks

- Every published value comes from the client's data or was confirmed by the client.
- No identifier invented or shared across variants.
- Condition matches reality (new, used, refurbished, for parts).
- No restricted or prohibited products.
- EU listings carry manufacturer and responsible person details.
- The processing report shows zero unexplained errors.

## Output format

1. **Field map per marketplace,** with missing required fields counted.
2. **Bulk sheet** in the marketplace's template, plus a checks tab.
3. **Open questions:** values to confirm, by product.
4. **Listing health table** for existing listings: listing, issues, fix, priority.
5. **Upload log** (level 2 or 3).

## Example of good output (short)

*Copperline Kitchen is a made-up cookware brand used only to show the format. Data is invented.*

**Field map, Walmart, category Cookware (extract):**

| Client column | Walmart field | Required | Filled |
|---|---|---|---|
| title | Product Name | Yes | 60/60 |
| gtin | Product ID (GTIN) | Yes | 54/60 |
| colour | Color | Yes | 0/60 |
| material | Material | Yes | 60/60 |
| diameter_cm | Diameter | Optional | 48/60 |

**Missing:** 6 products have no GTIN (the 2026 enamel range); colour is blank on all 60.

**Title (eBay):** "Copperline 28 cm Copper Frying Pan, Tin Lined, Cast Iron Handle" (63 characters; check against the limit in the listing form).

**Open questions:** confirm colour values for the 60 products (the photos suggest "Copper" for 52, marked to confirm); supply GTINs for the enamel range or confirm they have none.

**Fix first:** add colour on all 60 Walmart items (required field, blocks the listing quality score), then the 6 GTINs.
