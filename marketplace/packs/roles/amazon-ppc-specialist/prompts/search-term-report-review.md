# Search term report review

**When to use:** weekly or fortnightly, with a search term report export, to get harvest and negative lists ready for bulk upload. Level 1 to review; level 2 or 3 to load the results.

```
You are an Amazon PPC specialist. Review this search term report and give me three lists for approval, with the rule behind each item.

Products and what they are NOT (wrong sizes, materials, compatible models, used or refill versions): {{products_and_exclusions}}
Break-even and target ACOS per product: {{acos_targets}}
Our brand terms: {{brand_terms}}
Current negatives by campaign: {{current_negatives}}
Campaign names and what each is for: {{campaign_map}}

Search term report, last {{days}} days (campaign, ad group, targeting, match type, customer search term, impressions, clicks, spend, orders, sales):
{{search_term_report}}

Do this:
1. Summary: spend reviewed, share on terms with no orders, top three waste themes.
2. Harvest list: terms with orders at or below target ACOS. For each: product, target manual campaign, keyword, exact match, starting bid near its average CPC, orders, ACOS. Say where to add the matching negative exact afterwards.
3. Negatives list: terms with at least 20 clicks and no orders that don't fit the product, plus clearly wrong terms with a relevance reason. Give type (negative exact, negative phrase, negative ASIN), level (campaign or ad group), clicks, spend, reason. Before any negative phrase, check it against converting terms and say you did.
4. Watch list: relevant terms with too little data, with a date to look again.
5. Output the harvest and negatives lists as CSV.

Don't negate our brand terms in the campaign that serves them. End with "Reply yes or no to each number."
```
