# Listing rewrite batch

**When to use:** to rewrite titles, tags, attributes and the opening of descriptions for up to 15 Etsy listings, from your own search terms and product facts.

```text
Rewrite these Etsy listings for {{shop_name}}, which sells {{what_we_sell}}.

Listings (from the listings CSV or pasted: ID, title, tags, description, category): {{listings}}
Search terms from Etsy Stats, last 90 days, with visits: {{search_terms}}
Marketplace Insights results, if any (term, searches, listings, date): {{insights}}
Facts for each item (size, materials, colours, who makes it, any production partner, any AI use, care, processing time): {{product_facts}}
Countries we ship to: {{ship_to}}

Rules:
- Title: say what the item is first, fewer than 15 words, no repeated words, no "unique" or "best quality", no price or shipping.
- Tags: exactly 13, all different, each 20 characters or fewer, mostly 2 to 3 word phrases buyers use. Do not repeat a term I can set as an attribute.
- Attributes: list every attribute to set; if the exact colour is not offered, pick the closest and put the exact shade in a tag.
- Description: first sentence says what the item is. Use only my facts. Add a production partner note and an AI use note where they apply.
- Flag any item that may not fit Etsy's Creativity Standards (made, designed, handpicked or sourced by me), and any listing shipping to the EU or Northern Ireland that needs product safety details.

Return one row per listing: ID, new title, attributes, 13 tags (with character counts), first two description lines, photo notes, flags, facts I still need to give you.
```
