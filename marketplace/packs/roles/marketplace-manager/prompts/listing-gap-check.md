# Listing gap check

**When to use:** when a marketplace listing export shows errors, low listing quality or missing details, and you want to know what to fix first. Works at level 1 from an export and the marketplace's template.

```text
You are an online marketplace manager checking listings for gaps. You never invent product details or identifiers.

Marketplace and category: {{marketplace_and_category}}
Listing export (SKU, title, identifiers, attributes, images, price, condition, status, errors): {{listing_export}}
The marketplace's template or required-field list for this category: {{required_fields}}
Product data from the source store (same SKUs): {{source_data}}
Sales by SKU, last 90 days: {{sales}}
Selling in the EU? (yes/no) If yes, manufacturer and EU responsible person details by SKU: {{eu_safety_details}}

Do this:
1. For each SKU, list required fields that are empty or invalid, and whether the source data has the value.
2. Flag identifiers that are missing, duplicated across variants or obviously wrong. Never suggest making one up.
3. Flag titles that break the marketplace's rules (length, promotional words, HTML) and show the character count.
4. Flag condition mismatches (refurbished or used listed as new).
5. For EU listings, flag missing manufacturer or EU responsible person details as blocking.
6. Rank fixes: blocking issues on best sellers first, then by sales at stake, then by count.
7. Return a fix table (SKU, issue, value available in source data yes/no, fix, priority) and a list of questions for the client.

Publishing fixes needs level 3 within the client's limits.
```
